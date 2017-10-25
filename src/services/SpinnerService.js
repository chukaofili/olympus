const ora = require('ora');

const spinner = ora();

/**
 * SpinnerService represents a utility service to show cli spinners.
 *
 * @class
 */
class SpinnerService {

  static start({color = 'yellow', text = ''}) {
    spinner.color = color;
    return spinner.start(text);
  }

  static stop({text = '', type = 'succeed'}) {
    switch (type) {
      case 'succeed':
      case 'fail':
      case 'warn':
      case 'info':
        spinner[type](text);
        break;
      default:
        spinner.succeed(text);
        break;
    }
    return spinner.clear();
  }

  static startAndStop({text = '', color = 'yellow', type = 'succeed'}) {
    this.start({color, text});
    return this.stop({text, type});
  }

}


module.exports = SpinnerService;
