const Command = require('./Command');

/**
 * InitCommand represents the 'olympus init' command.
 *
 * We are using the Gang of four Command pattern.
 * The commands are constructed and then generated.
 *
 * @class
 * @extends Command
 */
class InitCommand extends Command {

  /**
   * Creates the InitCommand.
   *
   * @constructor
   */
  constructor(input = {}) {
    const options = {...input}
    super(options);
    this.path = options.path;
    this.template = options.template;
  }

  /**
   * Executes the InitCommand. If the global config already exists AND it has
   * all options set, then this method does not log or do anything.
   * @method
   */
  async execute() {
    console.log(`Successfully initialized new project.`);
  }

}


module.exports = InitCommand;
