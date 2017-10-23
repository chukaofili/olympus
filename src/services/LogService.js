// Libraries
const winston = require('winston');
const config = require('winston/lib/winston/config');


/**
 * LogService represents a singleton LoggerService. We are using a Singleton
 * pattern as the class is holding one logger instance. The logger levels are
 * the following custom levels:
 * success: 0,
 * error: 1,
 * notice: 2,
 * info: 3,
 * verbose: 4.
 * The service is based on the
 * {@link https://www.npmjs.com/package/winston|winston} package.
 * We are not using the Winston CLI configuration as we are using a custom
 * message output which does not contain the logging level. We are using a
 * custom color scheme used only for notice, info and error by the custom
 * formatter.
 * The service is based on the
 * {@link https://www.npmjs.com/package/winston|winston} package.
 * @class
 */
class LogService {

  /**
   * Create the LogService.
   * @constructor
   */
  constructor() {
    this.isEnabled = true;
    const levels = {
      success: 0,
      error: 1,
      notice: 2,
      info: 3,
      verbose: 4,
    };

    const colors = {
      success: 'green',
      error: 'red',
      notice: 'yellow',
      info: 'blue', // currently not used by the formatter
      verbose: 'white', // currently not used by the formatter
    };

    this.logger = new winston.Logger({
      level: 'info',
      levels,
      colors,
      transports: [
        new winston.transports.Console({
          prettyPrint: true,
          colorize: true,
          silent: false,
          timestamp: false,

          // See: https://github.com/winstonjs/winston/issues/603
          formatter: (options) => {
            if (levels[options.level] <= levels.notice) {
              return config.colorize(options.level, options.message);
            }
            return options.message;
          },
        }),
      ],
    });
  }

  /**
   * Enables the logging.
   * @method
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disables the logging.
   * This is used by the testing framework.
   * @method
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * Returns true if verbose level is enabled.
   */
  get isVerbose() {
    return this.logger.level === 'verbose';
  }

  /**
   * Enable verbose for the logger.
   */
  enableVerbose() {
    this.logger.level = 'verbose';
  }

  /**
   * Disable verbose for the logger.
   */
  disableVerbose() {
    this.logger.level = 'info';
  }

  /**
   * Logs the message at the success level.
   * @method
   * @argument message
   */
  success(message) {
    if (this.isEnabled) {
      this.logger.info('');
      this.logger.log('success', message);
    }
  }

  /**
   * Logs the message at the error level.
   * @method
   * @argument message
   */
  error(message) {
    if (this.isEnabled) {
      this.logger.log('error', message);
    }
  }

  /**
   * Logs the message at the notice level.
   * @method
   * @argument message
   */
  notice(message) {
    if (this.isEnabled) {
      this.logger.log('notice', message);
    }
  }

  /**
   * Logs the message at the info level.
   * @method
   * @argument message
   */
  info(message) {
    if (this.isEnabled) {
      this.logger.log('info', message);
    }
  }

  /**
   * Logs the message at the verbose level.
   * @method
   * @argument message
   */
  verbose(message) {
    if (this.isEnabled) {
      this.logger.log('verbose', message);
    }
  }

}


module.exports = new LogService();
