const Command = require('./Command');
const {ConfigService, LogService, K8sService} = require('../services');

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
  constructor(command, block, input = {}) {
    const options = {block, ...input};
    super(options);
    this.block = block;
    this.command = command;
    this.update = options.update;
  }

  /**
   * Executes the ConfigCommand.
   * @method
   */
  async execute() {
    switch (this.block) {
      case 'cli':
        if (!ConfigService.fileExists) {
          ConfigService.createFile();
        }

        await ConfigService.inquireAndUpdateOptions();
        LogService.success(`Successfully updated the ${this.package.name} configuration.`);
        break;
      case 'cloud':
        try {
          await K8sService.inquireAndUpdateOptions({update: this.update});
          LogService.success(`Successfully updated ${this.package.name} cloud configuration.`);
        } catch (error) {
          LogService.error(`Did not update the ${this.package.name} configuration.`);
        }
        break;
      default:
        [
          '',
          '  Please use a valid block.',
          '',
          '',
          '  Block options:',
          '',
          `    $ ${this.command} cli`,
          `    $ ${this.command} cloud`,
          '',
        ].forEach(message => LogService.info(message));
        break;
    }
  }

}


module.exports = ConfigCommand;
