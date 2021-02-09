#!/usr/bin/env node
'use strict';

const {
  defaultReplacementSigil,
  defaultHelpTextModifyReplacements,
  assertArgs,
  updateHelpTextByFile,
} = require('../src');

const { argv } = require('yargs')
  .usage('$0 <input-file-path>', require('../package').description, (yargs) => {
    yargs.positional('input-file-path', {
      type: 'string',
      description: 'The file to be updated',
    });
  })
  .options({
    'bin-path': {
      type: 'string',
      description: 'The yargs entry file if you\'re running it directly',
    },
    'npm-script-name': {
      type: 'string',
      description: 'The NPM script that runs your yargs CLI',
    },
    'replacement-sigil': {
      type: 'string',
      default: defaultReplacementSigil,
      description: 'The metadata divider used to find the replacement',
    },
    'help-text-modify': {
      type: 'array',
      default: defaultHelpTextModifyReplacements,
      description: 'String/regex replacements to modify the help text (ex --help-text-modify.search "^foo$" --help-text-modify.replacement "")',
    },
  })
  .check((argv) => {
    assertArgs(argv);

    return true;
  });

(async () => {
  // https://github.com/yargs/yargs/issues/1336
  if (!Array.isArray(argv.helpTextModify)) {
    argv.helpTextModify = [argv.helpTextModify];
  }

  let helpTextModifyReplacements = argv.helpTextModify.map(({
    search,
    replacement,
  }) => [
    search,
    replacement,
  ]);

  await updateHelpTextByFile({
    helpTextModifyReplacements,
    ...argv,
  });
})();
