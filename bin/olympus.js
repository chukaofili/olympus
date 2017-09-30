#!/usr/bin/env node
'use strict';

const commander = require('commander');
const Package = require('../package.json');
const Utils = require('../src/utils');

Utils.checkNodeVersion(Package);

const program = new commander.Command(Package.name)
.version(Package.version, '-v, --version')
.arguments('<command>')
.usage('<command> [options]');

const run = (args) => {
    // eslint-disable-next-line no-underscore-dangle
    const names = program.commands.map(command => command._name).concat('help');
    const input = args[2];
  
    if (input && !input.startsWith('-') && !names.includes(input)) {
      const message = (
        `  '${Package.name} ${input}' is not a valid command. Please see ` +
        `the list of commands below:`
      );
  
      console.log(message)
      program.outputHelp();
      process.exit(1);
    } else {
      program.parse(args);
    }
  };
  
  run(process.argv);