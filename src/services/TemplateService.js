const isUndefined = require('lodash/isUndefined');

/**
 * TemplateService represents a utility service fetch project templates from github.
 * 
 * @class
 */
class TemplateService {
    constructor() {
        this.templates = ['api'];
    }

    
    
    async setupTemplate(path, template = false) {
        // console.log(this.templates)
        // console.log(path)
        // console.log(template)
        return
    }
}


module.exports = new TemplateService();
