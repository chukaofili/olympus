const Command = require('./Command');
const {ConfigService, FileService, TemplateService} = require('../services');

/**
 * InitCommand represents the 'olympus init' command.
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
    this.projectPath = options.path;
    this.template = options.template;
  }

  /**
   * Create the project cahce.
   */
  createProjectCache(directory) {
    return FileService.createDirectory(directory);
  }

  /**
   * Executes the InitCommand.
   * @method
   */
  async execute() {
    if (!FileService.exists(this.projectPath)) {
      console.log(`Error: path ${this.projectPath} does not exist.`)
      return;
    }

    ConfigService.createProjectCache(this.projectPath);

    await TemplateService.setupTemplate(this.projectPath, this.template);

    console.log(`Successfully initialized new project.`);
  }

}


module.exports = InitCommand;
