'use strict';

const { describe, it, setUpTmpDir } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const {
  replace,
  getHelpText,
  updateHelpTextByString,
  updateHelpTextByFile,
} = require('../../src');
const path = require('path');
const fs = require('fs').promises;

const _fixturesPath = path.join(__dirname, '../fixtures');

describe(function() {
  describe(replace, function() {
    const fixturesPath = path.join(_fixturesPath, replace.name);

    it('works with default regex', async function() {
      let input = await fs.readFile(path.join(fixturesPath, 'default/input.md'), 'utf8');
      let expected = await fs.readFile(path.join(fixturesPath, 'default/expected.md'), 'utf8');

      let replacementText = 'the replaced content';

      let outputString = replace({
        inputString: input,
        replacementText,
      });

      expect(outputString).to.equal(expected);
    });

    it('works with custom regex', async function() {
      let input = await fs.readFile(path.join(fixturesPath, 'custom/input.md'), 'utf8');
      let expected = await fs.readFile(path.join(fixturesPath, 'custom/expected.md'), 'utf8');

      let replacementSigil = '<!-- CUSTOM_SIGIL -->';
      let replacementText = 'the replaced content';

      let outputString = replace({
        inputString: input,
        replacementSigil,
        replacementText,
      });

      expect(outputString).to.equal(expected);
    });
  });

  describe(getHelpText, function() {
    const fixturesPath = path.join(_fixturesPath, getHelpText.name);

    let expected;

    before(async function() {
      expected = await fs.readFile(path.join(fixturesPath, 'expected.txt'), 'utf8');
    });

    it('requires an executable', async function() {
      let promise = getHelpText();

      await expect(promise).to.eventually.be.rejectedWith('Must supply either a binPath or a npmScriptName');
    });

    it('runs a script', async function() {
      let actual = await getHelpText({
        npmScriptName: 'start',
        cwd: fixturesPath,
      });

      expect(actual).to.equal(expected);
    });

    it('runs a bin', async function() {
      let actual = await getHelpText({
        binPath: './my-cli.js',
        cwd: fixturesPath,
      });

      expect(actual).to.equal(expected);
    });
  });

  describe(updateHelpTextByString, function() {
    const fixturesPath = path.join(_fixturesPath, updateHelpTextByString.name);

    it('works', async function() {
      let input = await fs.readFile(path.join(fixturesPath, 'input.md'), 'utf8');
      let expected = await fs.readFile(path.join(fixturesPath, 'default.md'), 'utf8');

      let actual = await updateHelpTextByString({
        inputString: input,
        binPath: './my-cli.js',
        cwd: fixturesPath,
      });

      expect(actual).to.equal(expected);
    });

    it('can modify the help output via replacements', async function() {
      let input = await fs.readFile(path.join(fixturesPath, 'input.md'), 'utf8');
      let expected = await fs.readFile(path.join(fixturesPath, 'modified.md'), 'utf8');

      let actual = await updateHelpTextByString({
        inputString: input,
        helpTextModifyReplacements: [
          [/^Options:$\r?\n/m, ''],
        ],
        binPath: './my-cli.js',
        cwd: fixturesPath,
      });

      expect(actual).to.equal(expected);
    });

    it('can modify the help output via callback', async function() {
      let input = await fs.readFile(path.join(fixturesPath, 'input.md'), 'utf8');
      let expected = await fs.readFile(path.join(fixturesPath, 'modified.md'), 'utf8');

      let actual = await updateHelpTextByString({
        inputString: input,
        helpTextModifyCallback(helpText) {
          return helpText.replace(/^Options:$\r?\n/m, '');
        },
        binPath: './my-cli.js',
        cwd: fixturesPath,
      });

      expect(actual).to.equal(expected);
    });
  });

  describe(updateHelpTextByFile, function() {
    const fixturesPath = path.join(_fixturesPath, updateHelpTextByString.name);

    setUpTmpDir();

    beforeEach(async function() {
      await fs.copyFile(path.join(fixturesPath, 'input.md'), path.join(this.tmpPath, 'input.md'));
    });

    it('works', async function() {
      let input = path.join(this.tmpPath, 'input.md');
      let expected = path.join(fixturesPath, 'default.md');

      await updateHelpTextByFile({
        inputFilePath: input,
        binPath: './my-cli.js',
        cwd: fixturesPath,
      });

      expect(input).to.be.a.file().and.equal(expected);
    });
  });
});
