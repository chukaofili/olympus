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
    return this.read({filename: this.configPath});
  }


  get defaultQuestions() {
    return [{
      type: 'list',
      name: 'provider',
      message: 'Which cloud provider is your kubernetes cluster hosted?',
      default: 'GKE',
      choices: ['AWS', 'GKE', 'Other'],
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
      name: 'authType',
      message: 'Which authentication protocal does your kubernetes cluster use?',
      default: 'user-pass',
      choices: ['user-pass', 'token', 'client-cert'],
      filter(val) {
        return val.toLowerCase();
      },
    }];
  }

  read({filename}) {
    if (!FileService.exists(filename)) {
      return {};
    }
    return ini.parse(FileService.read(filename));
  }

  write({filename, source}) {
    FileService.overwrite(filename, ini.stringify(source, {whitespace: true}));
  }

  readConfig({profile}) {
    return _.get(this.config, profile);
  }

  writeConfig({profile, config}) {
    this.write({
      filename: this.configPath,
      source: {...this.config, [profile]: config},
    });
  }

  async inquireAndUpdateOptions() {
    const values = await InquireService.askQuestions({
      questions: this.defaultQuestions,
      useDefaults: false,
    });
    const {profile} = values;
    const config = _.omit(values, ['profile']);
    this.writeConfig({profile, config});
  }
}


module.exports = new K8sService();
