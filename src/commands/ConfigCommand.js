const Command = require('./Command');
const {ConfigService} = require('../services');
const Package = require('../../package.json');

/**
 * ConfigCommand represents the 'gig config' command.
 *
 * We are using the Gang of four Command pattern.
 * The commands are constructed and then generated.
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
   * Executes the ConfigCommand. If the global config already exists AND it has
   * all options set, then this method does not log or do anything.
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
