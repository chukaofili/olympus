const ora = require('ora');

const spinner = ora();

/**
 * SpinnerService represents a utility service fetch project templates from github.
 *
 * @class
 */
class SpinnerService {

  static start(color = 'yellow', text = '') {
    spinner.color = color;
    return spinner.start(text);
  }

  static stop(text = '') {
    spinner.succeed(text);
    return spinner.clear();
  }

  static startAndStop(color = 'yellow', text = '') {
    console.log(color)
    // this.start(color, text);
    // return this.stop(text);
  }

}


module.exports = SpinnerService;
