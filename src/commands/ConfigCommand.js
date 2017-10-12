const Command = require('./Command');
const {ConfigService} = require('../services');
const Package = require('../../package.json');

/**
 * ConfigCommand represents the 'olympus config' command.
 *
 * @class
 * @extends Command
 */
class ConfigCommand extends Command {

  /**
   * Creates the ConfigCommand.
   *
   * @constructor
   */
  constructor(input = {}) {
    const options = {...input, autoconfig: false};
    super(options);
  }

  /**
   * Executes the ConfigCommand.
   * @method
   */
  async execute() {
    if (!ConfigService.fileExists) {
      ConfigService.createFile();
    }

    await ConfigService.inquireAndUpdateOptions();

    console.log(`Successfully updated the ${Package.name} configuration.`);
  }

}


module.exports = ConfigCommand;
