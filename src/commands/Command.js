const { LogService } = require('../services');
const Package = require('../../package.json');

/**
 * Command represents the base class for any commands.
 *
 * @class
 * @abstract
 */
class Command {

  /**
   * Creates the Command.
   *
   * @constructor
   * @param event - name of the event to be logged.
   * @param options - command optional values.
   */
  constructor(event, options = {}) {
    this.event = event;
    this.options = options;
    this.package = Package;

    this.execute = this.wrap(this.execute);
  }

  /**
   * Wraps the `execute` function with logging, analytics, and autoupdating.
   * @method
   */
  wrap(execute) {
    return async (...args) => {
      const {verbose} = this.options;

      if (verbose) {
        LogService.enableVerbose();
      }

      await execute.apply(this, args);
    };
  }

  /**
   * `execute` is the method that should be implemented
   * by the classes extending the Command.
   *
   * @method
   * @abstract
   */
  async execute() {
    throw new Error('The method `execute` needs to be implemented!');
  }

}


module.exports = Command;
