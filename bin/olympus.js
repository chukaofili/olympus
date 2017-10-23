#!/usr/bin/env node


const commander = require('commander');
const Package = require('../package.json');
const Config = require('../src/config');
const Utils = require('../src/utils');
const { LogService } = require('../src/services');

Utils.checkNodeVersion(Package);

const program = new commander.Command(Config.COMMAND)
  .version(`v${Package.version}`, '-v, --version')
  .arguments('<command>')
  .usage('<command> [options]')
  .command('config', 'configure the CLI')
  .command('init', 'initialize new project');

const run = (args) => {
  // eslint-disable-next-line no-underscore-dangle
  const names = program.commands.map(command => command._name).concat('help');
  const input = args[2];

  if (input && !input.startsWith('-') && !names.includes(input)) {
    const message = (
      `  '${Package.name} ${input}' is not a valid command. Please see ` +
      `the list of commands below:`
    );

    LogService.info(message);
    program.outputHelp();
    process.exit(1);
  } else {
    program.parse(args);
  }
};

run(process.argv);
