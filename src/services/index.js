/* eslint-disable global-require */
module.exports = {
    get ConfigService() { return require('./ConfigService'); },
    get FileService() { return require('./FileService'); },
    get YamlService() { return require('./YamlService'); },
  };
  