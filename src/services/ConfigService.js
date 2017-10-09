const osenv = require('osenv');
const _ = require('lodash');

const FileService = require('./FileService');
const YamlService = require('./YamlService');
const InquireService = require('./InquireService');

/**
 * ConfigService represents a singleton ConfigService. We are using a Singleton
 * pattern as the class is holding the configuration.
 * @class
 */
class ConfigService {

  /**
   * Create the ConfigService.
   * @constructor
   */
  constructor() {
    this.path = `${osenv.home()}/${this.configFilename}`;
  }

  /**
   * The location of the global config file.
   */
  get location() {
    return this.path;
  }

  /**
   * Returns ture/false wether we are in development mode.
   */
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Default options for the CLI stored in the global config.
   */
  get defaultQuestions() {
    return [{
      type: 'confirm',
      name: 'autoupdate',
      message: 'Turn on autoupdate?',
      default: false
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you use?',
      default: 'yarn',
      choices: ['yarn', 'npm'],
      filter: function (val) {
        return val.toLowerCase();
      }
    }, {
      type: 'list',
      name: 'gitProtocol',
      message: 'Which git protocol do you prefer?',
      default: 'ssh',
      choices: ['ssh', 'https'],
      filter: function (val) {
        return val.toLowerCase();
      }
    }]
  }

  /**
   * Creates a YAML representation of the config values.
   */
  toYaml(values) {
    return YamlService.toYaml(values);
  }

  /**
   * Whether or not this config file exists.
   */
  get fileExists() {
    return FileService.exists(this.location);
  }

  /**
   * Writes the configuration content to the file.
   */
  createFile() {
    this.write({});
  }

  /**
   * Reads the location of the config file and returns the contents as an
   * object. Silently fail and return an empty object.
   */
  read() {
    try {
      const config = YamlService.read(this.location);
      return config;
    } catch (error) {
      return {};
    }
  }

  /**
   * Writes the config's YAML to the `location`.
   */
  write(values) {
    FileService.overwrite(this.location, this.toYaml(values));
  }

  async inquireAndUpdateOptions() {
    const values = await InquireService.askQuestions({questions: this.defaultQuestions, useDefaults: true});
    this.write(values);
  }

  /**
   * The name of the config file that we look for.
   */
  get configFilename() {
    return '.olympus_global';
  }

  /**
   * Global cache directory usually in the home directory.
   */
  get cacheDirectory() {
    return '.olympus';
  }

  /**
   * Directory for temporary files used by the CLI when generating.
   */
  get tmpDirectory() {
    return '.tmp';
  }

}


module.exports = new ConfigService();
