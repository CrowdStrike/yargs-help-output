# yargs-help-output

Update docs to include the full output of yargs help

## CLI API

<!-- CODEGEN_CLI_HELP -->
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
