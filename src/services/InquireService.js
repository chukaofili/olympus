const inquirer = require('inquirer');
const _ = require('lodash');

/**
 * InquireService represents a utility service to ask questions via the terminal
 * and returns the list of answers.
 * The service is based on the
 * {@link https://www.npmjs.com/package/inquirer|inquirer} package.
 * @class
 */
class InquireService {

  static async askQuestions({questions, useDefaults = false}) {
    try {
      if (useDefaults) {
        return this.getDefaultAnswers(questions);
      }

      const answers = await inquirer.prompt(questions);
      return answers;
    } catch (error) {
      console.log(error)
      return {};
    }
  }

  static getDefaultAnswers(questions) {
    const accumulate = (answers, {name, default: defaultValue}) => ({
      ...answers,
      [name]: defaultValue,
    });

    return _.reduce(questions, accumulate, {});
  }

}


module.exports = InquireService;
