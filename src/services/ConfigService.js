const osenv = require('osenv');
const _ = require('lodash');

const FileService = require('./FileService');
const YamlService = require('./YamlService');

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
    // this.defaults = PromptService.getDefaultValues(this.defaultOptions);
    this.path = `${osenv.home()}/${this.configFilename}`;
    this.config = this.read();
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
  get defaultOptions() {
    return {
      autoupdate: true,
      packageManager: {
        type: 'list',
        question: 'Which package manager do you use?',
        default: 'yarn',
        choices: ['yarn', 'npm'],
      },
      gitProtocol: {
        type: 'list',
        question: 'Which git protocol do you prefer?',
        default: 'ssh',
        choices: ['ssh', 'https'],
      }
    };
  }

  /**
   * Provides the default values.
   */
  // get defaultValues() {
  //   return this.defaults;
  // }

  /**
   * Provides a safe default when reading the global config file.
   */
  // get savedValues() {
  //   return this.config;
  // }

  /**
   * Returns a merged set of the defaultValues and the savedValues.
   */
  // get values() {
  //   return {...this.defaultValues, ...this.savedValues};
  // }

  /**
   * These are the options we'll write to the file. We filter out options
   * that no longer exist.
   */
  filterValues(values) {
    return _.pickBy(values, (value, key) => key in this.defaultOptions);
  }

  /**
   * Creates a YAML representation of the config values.
   */
  toYaml(values) {
    return YamlService.toYaml(this.filterValues(values));
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
      // ValidationService.validate(config, ConfigSchema);
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

  async promptAndUpdateOptions() {
    console.log(`Get's here`);
    // const values = await PromptService.askForVariables({
    //   // Only prompt the user for missing options, keep the rest.
    //   options: onlyNew ? this.missingOptions : this.defaultOptions,
    // });

    // Merge the results of the current config with the new answers.
    // Write the global config back.
    // this.write({...this.values, ...values});
  }

  /**
   * The name of the config file that we look for.
   */
  get configFilename() {
    return '.olympus_config';
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
