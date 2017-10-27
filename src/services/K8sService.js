const path = require('path');
const ini = require('ini');
const _ = require('lodash');
const k8s = require('kubernetes-client');
const {
  ConfigService, FileService, InquireService, LogService, SpinnerService,
} = require('./');

/**
 * K8sService represents a utility service to confirm and confirgure kubernetes cloud service.
 *
 *   ~/.olympus/olympus_k8s
 *
 */
class K8sService {

  get configFilename() {
    return '.olympus_k8s';
  }

  get configPath() {
    return FileService.joinPath(ConfigService.cache, this.configFilename);
  }

  get config() {
    return this.read({ filename: this.configPath });
  }

  get defaultQuestions() {
    return [{
      type: 'list',
      name: 'provider',
      message: 'Which cloud provider is your kubernetes cluster hosted?',
      default: 'gke',
      choices: ['aws', 'gke', 'other'],
      filter(val) {
        return val.toLowerCase();
      },
    }, {
      type: 'input',
      name: 'profile',
      message: 'Give this cluster a profile name:',
      validate: (value) => {
        if (value) {
          return true;
        }

        return 'Please enter a valid profile name';
      },
    }, {
      type: 'input',
      name: 'url',
      message: 'Enter your kubernetes url (eg: https://my-k8s-api-server.com):',
      validate: (value) => {
        if (value) {
          return true;
        }

        return 'Please enter a valid kubernetes url';
      },
    }, {
      type: 'list',
      name: 'tls',
      message: 'Select your cluster tls/ssl connection options:',
      default: 'default',
      choices: [{
        name: 'use default',
        value: 'default',
        short: 'default',
      },
      {
        name: 'skip tsl/ssl verification',
        value: 'skip',
        short: 'skip',
      }, {
        name: 'provide cluster-ca',
        value: 'cluster-ca',
        short: 'cluster ca',
      }],
    }, {
      type: 'input',
      name: 'clusterCa',
      message: 'Provide path to your cluster-ca tls/ssl certificate:',
      when: answers => (answers.tls === 'cluster-ca'),
      validate: (filepath) => {
        if (filepath && FileService.exists(path.resolve(filepath))) {
          return true;
        }

        return 'Please enter a valid file path (eg: /path/to/cluster-ca.pem)';
      },
    }, {
      type: 'list',
      name: 'authMethod',
      message: 'Which authentication protocol does your kubernetes cluster use?',
      default: 'user-pass',
      choices: [{
        name: 'username & password',
        value: 'user-pass',
        short: 'user-pass',
      },
      {
        name: 'bearer token',
        value: 'token',
        short: 'token',
      }, {
        name: 'private key & certificate',
        value: 'private-key',
        short: 'private key',
      }],
      filter(val) {
        return val.toLowerCase();
      },
    }, {
      type: 'input',
      name: 'username',
      message: 'Enter your kubernetes username:',
      when: this.authMethodFn('user-pass'),
      validate: (value) => {
        if (value) {
          return true;
        }

        return 'Please enter a valid kubernetes username';
      },
    }, {
      type: 'password',
      name: 'password',
      mask: '*',
      message: 'Enter your kubernetes password:',
      when: this.authMethodFn('user-pass'),
      validate: (value) => {
        if (value) {
          return true;
        }

        return 'Please enter a valid kubernetes password';
      },
    }, {
      type: 'input',
      name: 'token',
      message: 'Enter your kubernetes bearer token:',
      when: this.authMethodFn('token'),
      validate: (value) => {
        if (value) {
          return true;
        }

        return 'Please enter a valid kubernetes token';
      },
    }, {
      type: 'input',
      name: 'privateKey',
      message: 'Provide path to your private-key-file:',
      when: this.authMethodFn('private-key'),
      validate: (filepath) => {
        if (filepath && FileService.exists(path.resolve(filepath))) {
          return true;
        }

        return 'Please enter a valid file path (eg: /path/to/private-key-file.pem)';
      },
    }, {
      type: 'input',
      name: 'certFile',
      message: 'Provide path to your cert-file:',
      when: this.authMethodFn('private-key'),
      validate: (filepath) => {
        if (filepath && FileService.exists(path.resolve(filepath))) {
          return true;
        }

        return 'Please enter a valid file path (eg: /path/to/cert-file.pem)';
      },
    }];
  }

  authMethodFn(method) {
    return answers => (answers.authMethod === method);
  }

  read({ filename }) {
    if (!FileService.exists(filename)) {
      return {};
    }
    return ini.parse(FileService.read(filename));
  }

  write({ filename, source }) {
    FileService.overwrite(filename, ini.stringify(source, { whitespace: true }));
  }

  readConfig({ profile }) {
    return _.get(this.config, profile);
  }

  writeConfig({ profile, config }) {
    this.write({
      filename: this.configPath,
      source: { ...this.config, [profile]: config },
    });
  }

  async existingProfiles() {
    const choices = _.keys(this.config);
    if (!choices.length) {
      LogService.error(`No config profiles have been created, exiting...`);
      throw new Error('No config profiles have been created, exiting...');
    }

    const questions = {
      type: 'list',
      name: 'profile',
      message: 'Select kubernetes cloud profile to update:',
      choices,
    };

    const selectedProfile = await InquireService.askQuestions({questions});
    return selectedProfile.profile;
  }

  authConfig({config}) {
    let authConfig = {url: config.url, promises: true};
    switch (config.tls) {
      case 'cluster-ca':
        authConfig = {
          ...authConfig,
          ca: FileService.read(config.clusterCa),
        };
        break;
      case 'skip':
        authConfig = {
          ...authConfig,
          insecureSkipTlsVerify: true,
        };
        break;
      default:
        break;
    }

    switch (config.authMethod) {
      case 'user-pass':
        authConfig = {
          ...authConfig,
          auth: {
            user: config.username,
            pass: config.password,
          },
        };
        break;
      case 'token':
        authConfig = {
          ...authConfig,
          auth: {
            bearer: config.token,
          },
        };
        break;
      case 'private-key':
        authConfig = {
          ...authConfig,
          auth: {
            cert: FileService.read(config.certFile),
            key: FileService.read(config.privateKey),
          },
        };
        break;
      default:
        break;
    }

    return authConfig;
  }

  async checkConnection({config, profile}) {
    SpinnerService.start({text: `Checking connection to ${profile} cluster please wait...`});
    const authConfig = this.authConfig({config});
    const core = new k8s.Core(authConfig);

    try {
      await core.nodes.get();
      SpinnerService.stop({text: `Connection to ${profile} cluster successful.`});
    } catch (error) {
      SpinnerService.stop({text: `Failed connecting to ${profile} cluster. Please check your configuration.`, type: 'fail'});
      throw error;
    }
  }

  async inquireAndUpdateOptions({update = false}) {
    let questions = this.defaultQuestions;
    let config;
    let profile;

    if (update) {
      questions = _.filter(this.defaultQuestions, question => question.name !== 'profile');
      profile = await this.existingProfiles();
      config = await InquireService.askQuestions({questions});
    } else {
      const values = await InquireService.askQuestions({questions});
      profile = values.profile; //eslint-disable-line
      config = _.omit(values, ['profile']);
    }

    try {
      await this.checkConnection({config, profile});
      this.writeConfig({ profile, config });
    } catch (error) {
      throw error;
    }
  }

}


module.exports = new K8sService();
