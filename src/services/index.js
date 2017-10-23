/* eslint-disable global-require */
module.exports = {
  get ConfigService() { return require('./ConfigService'); },
  get FileService() { return require('./FileService'); },
  get YamlService() { return require('./YamlService'); },
  get InquireService() { return require('./InquireService'); },
  get TemplateService() { return require('./TemplateService'); },
  get LogService() { return require('./LogService'); },
};
