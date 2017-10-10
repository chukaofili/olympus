#!/usr/bin/env node

const commander = require('commander');

const Config = require('../src/config');
const collect = require('../src/collect');
const { ConfigCommand } = require('../src/commands');

const command = `${Config.COMMAND} config`;
const program = new commander.Command(command)
  .usage('[options]')
  .parse(process.argv);

collect(async () => new ConfigCommand(program.opts()).execute());
