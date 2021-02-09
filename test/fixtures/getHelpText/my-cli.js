#!/usr/bin/env node
'use strict';

require('yargs')
  .options({
    'my-option-1': {
      alias: 'mo1',
      default: 'my option 1 value',
      describe: 'my option 1 description',
      type: 'string',
    },
  })
  .command('my-command-1', 'my command 1 description', {
    'my-command-1-option-1': {
      alias: 'mc1o1',
      default: 'my command 1 option 1 value',
      describe: 'my command 1 option 1 description',
      type: 'string',
    },
    'my-command-1-option-2': {
      alias: 'mc1o2',
      default: 'my command 1 option 2 value',
      describe: 'my command 1 option 2 description',
      type: 'string',
    },
  })
  .command('my-command-2', `my command 2
multi
line
description`, {
    'my-command-2-option-1': {
      alias: 'mc2o1',
      default: 'my command 2 option 1 value',
      describe: 'my command 2 option 1 description',
      type: 'string',
    },
    'my-command-2-option-2': {
      alias: 'mc2o2',
      default: 'my command 2 option 2 value',
      describe: 'my command 2 option 2 description',
      type: 'string',
    },
  })
  .argv;
