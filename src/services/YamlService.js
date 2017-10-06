const yaml = require('node-yaml');
const FileService = require('./FileService');

/**
 * YamlService represents a utility service to manipulate YAML files.
 * The service is based on the
 * {@link https://www.npmjs.com/package/node-yaml|node-yaml} package.
 * @see http://yaml.org/
 * @class
 */
class YamlService {

  /**
   * Reads and returns the content of a YAML file.
   * @method
   * @param {String} filename - Location of the file.
   * @returns {Object} Object representation of the YAML file.
   * @static
   */
  static read(filename) {
    const content = FileService.read(filename);
    try {
      return yaml.parse(content);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Writes an object as a YAML file.
   * @method
   * @param {String} filename - Location of the file.
   * @param {Object} object - Object to be written.
   * @static
   */
  static write(filename, object) {
    FileService.write(filename, this.toYaml(object));
  }

  /**
   * Overwrites a file with the provided object using YAML.
   * @method
   * @param {String} filename - Location of the file.
   * @param {Object} object - Object to be written.
   * @static
   */
  static overwrite(filename, object) {
    return FileService.overwrite(filename, this.toYaml(object));
  }

  /**
   * Translates an object to YAML.
   * @method
   * @param {Object} object - Object to be translated.
   * @returns {String} String representation of the object as YAML.
   * @static
   */
  static toYaml(object) {
    return yaml.dump(object);
  }

}


module.exports = YamlService;
