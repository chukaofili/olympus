#!/usr/bin/env node

const commander = require('commander');

const Config = require('../src/config');
const collect = require('../src/collect');
const { InitCommand } = require('../src/commands');

const command = `${Config.COMMAND} init`;
const program = new commander.Command(command)
  .usage('[options]')
  .option(
    '-p, --path [projectPath]',
    'Specify path to your project directory.',
    '.',
  )
  .option(
    '-t, --template [templateName]',
    'Specify sample template to use.',
  )
  .on('--help', () => {
    [
      '',
      '',
      '  Examples:',
      '',
      `    $ ${command}`,
      `    $ ${command} -t api`,
      `    $ ${command} -t api -p /www/example/project`,
      '',
    ].forEach(message => console.log(message));
  })
  .parse(process.argv);

collect(async () => new InitCommand(program.opts()).execute());
