'use strict';

const { replaceFile } = require('./fs');
const path = require('path');

const defaultReplacementSigil = '<!-- CODEGEN_CLI_HELP -->';
const defaultHelpTextModifyReplacements = [];

function assertArgs({
  binPath,
  npmScriptName,
}) {
  if (binPath && npmScriptName || !binPath && !npmScriptName) {
    throw new Error('Must supply either a binPath or a npmScriptName');
  }
}

function replace({
  inputString,
  replacementSigil = defaultReplacementSigil,
  replacementText,
}) {
  let replacementRegex = new RegExp(`(${replacementSigil}).+(${replacementSigil})`, 's');

  if (!replacementRegex.test(inputString)) {
    throw new Error('inputString did not match replacementSigil');
  }

  let outputString = inputString.replace(replacementRegex, `$1

\`\`\`
${replacementText}
\`\`\`

$2`);

  return outputString;
}

async function _getHelpText({
  npmScriptName,
  binPath,
  commandName,
  ...options
}) {
  assertArgs({
    npmScriptName,
    binPath,
  });

  let command;
  let args;

  if (npmScriptName) {
    command = 'npm';
    args = ['run', npmScriptName, '--silent', '--'];
  } else {
    command = binPath;
    args = [];
  }

  if (commandName) {
    args.push(commandName);
  }

  args.push('--help');

  const { execa } = await import('execa');

  let { stdout } = await execa(command, args, {
    preferLocal: true,
    ...options,
  });

  return stdout;
}

async function getHelpText({
  npmScriptName,
  binPath,
  ...options
} = {}) {
  let mainOutput = await _getHelpText({
    npmScriptName,
    binPath,
    ...options,
  });

  let commandOutputs = [];

  let commandsStart = mainOutput.match(/(?:\r?\n){2}Commands:\r?\n/);

  if (commandsStart) {
    let commandsEnd = mainOutput.match(/(?:\r?\n){2}Options:\r?\n/);

    if (!commandsEnd) {
      throw new Error('Could not determine the end of commands');
    }

    let commandsString = mainOutput.substring(
      mainOutput.indexOf(commandsStart[0]) + commandsStart[0].length,
      mainOutput.indexOf(commandsEnd[0]),
    );

    let lines = commandsString.split(/\r?\n/);

    let commandNames = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      let isBlankLineBecauseOfMultiLineDescription = /^(?: {3}|$)/m.test(line);

      if (isBlankLineBecauseOfMultiLineDescription) {
        continue;
      }

      let isAdditionalArgsAfterCommandLine = /^ {2}\W/m.test(line);

      if (isAdditionalArgsAfterCommandLine) {
        continue;
      }

      let isMissingCommandOnFirstLine = /^ {2}\S+ {2}/m.test(line);

      if (isMissingCommandOnFirstLine) {
        line = lines[++i];

        let matches = line.match(/^ {2}(\S+) /m);

        if (!matches) {
          throw new Error('Could not determine a command');
        }

        commandNames.push(matches[1]);

        continue;
      }

      let matches = line.match(/^ {2}\S+ (\S+) /m);

      if (!matches) {
        throw new Error('Could not determine a command');
      }

      commandNames.push(matches[1]);
    }

    let commandPromises = commandNames.map(commandName => _getHelpText({
      npmScriptName,
      binPath,
      commandName,
      ...options,
    }));

    commandOutputs = await Promise.all(commandPromises);
  }

  let totalOutput = [
    mainOutput,
    ...commandOutputs,
  ].join(`

`);

  return totalOutput;
}

async function updateHelpTextByString({
  inputString,
  replacementSigil,
  helpTextModifyReplacements = defaultHelpTextModifyReplacements,
  helpTextModifyCallback = helpText => helpText,
  ...options
}) {
  let helpText = await getHelpText({
    ...options,
  });

  for (let [searchValue, replaceValue] of helpTextModifyReplacements) {
    helpText = helpText.replace(new RegExp(searchValue, 'gm'), replaceValue);
  }

  helpText = await helpTextModifyCallback(helpText);

  return await replace({
    inputString,
    replacementSigil,
    replacementText: helpText,
  });
}

async function updateHelpTextByFile({
  inputFilePath,
  cwd = process.cwd(),
  ...options
}) {
  if (!path.isAbsolute(inputFilePath)) {
    inputFilePath = path.join(cwd, inputFilePath);
  }

  await replaceFile(inputFilePath, async (inputString) => {
    let outputString = await updateHelpTextByString({
      inputString,
      cwd,
      ...options,
    });

    return outputString;
  });
}

module.exports = {
  defaultReplacementSigil,
  defaultHelpTextModifyReplacements,
  assertArgs,
  replace,
  getHelpText,
  updateHelpTextByString,
  updateHelpTextByFile,
};
