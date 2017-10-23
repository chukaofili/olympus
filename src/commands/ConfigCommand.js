const Command = require('./Command');
const {ConfigService, LogService} = require('../services');
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
  constructor(block, input = {}) {
    const options = {block, ...input, autoconfig: false};
    super(options);
    this.block = block;
  }

  /**
   * Executes the ConfigCommand.
   * @method
   */
  async execute() {
    const {block} = this;

    switch (block) {
      case 'cli':
        if (!ConfigService.fileExists) {
          ConfigService.createFile();
        }

        await ConfigService.inquireAndUpdateOptions();

        LogService.success(`Successfully updated the ${Package.name} configuration.`);
        break;
      case 'cloud':
        LogService.success(`Successfully updated the ${Package.name} configuration.`);
        break;
      default:
        LogService.error(`Block does not exist.`);
        break;
    }


  }

}


module.exports = ConfigCommand;
