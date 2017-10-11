const ejs = require('ejs');
const path = require('path');
const FileService = require('./FileService');


/**
 * TemplateService represents a utility service fetch project templates from github.
 * 
 * @class
 */
class TemplateService {
    constructor() {
        this.templates = ['api'];
    }

    renderSource(source, variables = {}) {
        return ejs.render(source, variables);
    }

    async renderFile(filename, output) {
        const ejsSource = FileService.read(filename);
        const source = this.renderSource(ejsSource);
        return FileService.overwrite(output, source);
    }
    
    async setupInitFile(projectCache){
        const scaffoldFile = path.resolve(__dirname, '..', 'ejs', 'olympusfile.yaml.ejs');
        const initFile = path.join(projectCache, 'olympusfile.yaml');

        if (FileService.exists(initFile)){
            return console.log(`Skipping: Already initialized olympusfile...`);
        }

        await this.renderFile(scaffoldFile, initFile);
        return;
    }

    async setupProjectTemplate(path, template = false) {
        // console.log(this.templates)
        // console.log(path)
        // console.log(template)
        return
    }
}


module.exports = new TemplateService();
