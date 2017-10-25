const Command = require('./Command');
const {
  ConfigService, FileService, LogService, TemplateService,
} = require('../services');

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
    const options = {...input};
    super(options);
    this.projectPath = options.path;
    this.template = options.template;
  }

  /**
   * Executes the InitCommand.
   * @method
   */
  async execute() {
    if (!FileService.exists(this.projectPath)) {
      return LogService.error(`Error: path ${this.projectPath} does not exist.`);
    }

    const projectCache = ConfigService.createProjectCache(this.projectPath);
    await TemplateService.setupInitFile(projectCache);

    await TemplateService.setupProjectTemplate(this.projectPath, this.template);
    return LogService.success(`Initialization complete.`);
  }

}


module.exports = InitCommand;
