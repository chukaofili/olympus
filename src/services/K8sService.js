const path = require('path');
const ini = require('ini');
const _ = require('lodash');
const { ConfigService, InquireService, FileService } = require('./');

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
        value: 'provide',
        short: 'cluster ca',
      }],
    }, {
      type: 'input',
      name: 'clusterCa',
      message: 'Provide path to your cluster-ca tls/ssl certificate:',
      when: answers => (answers.tls === 'provide'),
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

  async inquireAndUpdateOptions() {
    const values = await InquireService.askQuestions({
      questions: this.defaultQuestions,
      useDefaults: false,
    });
    const { profile } = values;
    const config = _.omit(values, ['profile']);
    this.writeConfig({ profile, config });
  }

}


module.exports = new K8sService();
