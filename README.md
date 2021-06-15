# yargs-help-output

[![npm version](https://badge.fury.io/js/yargs-help-output.svg)](https://badge.fury.io/js/yargs-help-output)

Update docs to include the full output of yargs help

## CLI API

<!-- CODEGEN_CLI_HELP -->

```
yargs-help-output <input-file-path>

Update docs to include the full output of yargs help

Positionals:
  input-file-path  The file to be updated                               [string]

Options:
  --help               Show help                                       [boolean]
  --version            Show version number                             [boolean]
  --bin-path           The yargs entry file if you're running it directly
                                                                        [string]
  --npm-script-name    The NPM script that runs your yargs CLI          [string]
  --replacement-sigil  The metadata divider used to find the replacement
                                 [string] [default: "<!-- CODEGEN_CLI_HELP -->"]
  --help-text-modify   String/regex replacements to modify the help text (ex
                       --help-text-modify.search "^foo$"
                       --help-text-modify.replacement "")  [array] [default: []]
```

<!-- CODEGEN_CLI_HELP -->

## JS API

```js
let outputString = await updateHelpTextByString({
  // required
  inputString,

  // optional
  replacementSigil = '<!-- CUSTOM_SIGIL -->',

  // optional
  helpTextModifyReplacements: [
    [/^Options:$\r?\n/m, ''],
  ],
  // and/or
  helpTextModifyCallback(helpText) {
    return helpText.replace(/^Options:$\r?\n/m, '');
  },

  binPath: './my-cli.js',
  // or
  npmScriptName: 'start',

  // optional
  cwd,
});

await updateHelpTextByFile({
  // required
  inputFilePath,

  // optional
  replacementSigil = '<!-- CUSTOM_SIGIL -->',

  // optional
  helpTextModifyReplacements: [
    [/^Options:$\r?\n/m, ''],
  ],
  // and/or
  helpTextModifyCallback(helpText) {
    return helpText.replace(/^Options:$\r?\n/m, '');
  },

  binPath: './my-cli.js',
  // or
  npmScriptName: 'start',

  // optional
  cwd,
});
```
