const ejs = require('ejs');
const path = require('path');
const Git = require('nodegit');
const _ = require('lodash');
const {ConfigService, FileService, LogService, SpinnerService} = require('./');
const templateRepos = require('../schemas/templates.json');


/**
 * TemplateService represents a utility service fetch project templates from github.
 *
 * @class
 */
class TemplateService {

  renderSource(source, variables = {}) {
    return ejs.render(source, variables);
  }

  renderFile(filename, output) {
    const ejsSource = FileService.read(filename);
    const source = this.renderSource(ejsSource);
    return FileService.overwrite(output, source);
  }

  async setupInitFile(projectCache) {
    const scaffoldFile = path.resolve(__dirname, '..', 'ejs', 'olympusfile.yaml.ejs');
    const initFile = path.join(projectCache, 'olympusfile.yaml');

    if (FileService.exists(initFile)) {
      return SpinnerService.startAndStop(`>> Already initialized olympusfile, skipping...`);
    }

    return this.renderFile(scaffoldFile, initFile);
  }

  async cloneRepo(sourceRepo, outputDirectory) {
    ConfigService.purgeTempDirectory();
    await Git.Clone(sourceRepo, outputDirectory);
  }

  async setupProjectTemplate(projectPath, template = false) {
    const templateRepo = _.find(templateRepos, { name: template});
    if (!templateRepo || _.isBoolean(template)) {
      return [
        `>> Template [${template}] not found, skipping...`,
        '',
        '  Sample templates:',
        '',
        `    sample-api: A sample SailsJS (Node,Express) application`,
        `    sample-frontend: A sample ReactJS (Node) application`,
        '',
      ].forEach(message => LogService.info(message));
    }

    const repoPath = path.join(ConfigService.tmp, templateRepo.repoName);
    LogService.info(`>> Fetching ${template} template, please wait...`);
    await this.cloneRepo(templateRepo.repo, repoPath);

    const templateRepoPath = path.join(repoPath, template);
    const templateProjectPath = path.join(projectPath, template);
    return FileService.move(templateRepoPath, templateProjectPath, {overwrite: true});
  }

}


module.exports = new TemplateService();
