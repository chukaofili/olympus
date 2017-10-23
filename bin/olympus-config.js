#!/usr/bin/env node

const commander = require('commander');

const Config = require('../src/config');
const collect = require('../src/collect');
const { ConfigCommand } = require('../src/commands');
const { LogService } = require('../src/services');

let argument;
const command = `${Config.COMMAND} config`;
const program = new commander.Command(command)
  .arguments('<block>')
  .usage('<block> [options]')
  .action((input) => {
    argument = input;
  })
  .on('--help', () => {
    [
      '',
      '',
      '  Examples:',
      '',
      `    $ ${command} cli`,
      `    $ ${command} cloud`,
      '',
    ].forEach(message => LogService.info(message));
  })
  .parse(process.argv);

collect(async () => new ConfigCommand(argument, program.opts()).execute());
