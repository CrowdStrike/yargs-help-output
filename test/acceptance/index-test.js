'use strict';

const { describe, it, setUpTmpDir } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const path = require('path');
const fs = require('fs').promises;
const execa = require('execa');

const _fixturesPath = path.join(__dirname, '../fixtures');
const binPath = require.resolve('../../bin');

describe(function() {
  this.timeout(5e3);

  const fixturesPath = path.join(_fixturesPath, 'bin');

  setUpTmpDir();

  beforeEach(async function() {
    await fs.copyFile(path.join(fixturesPath, 'input.md'), path.join(this.tmpPath, 'input.md'));
  });

  it('works with bin', async function() {
    let input = path.join(this.tmpPath, 'input.md');
    let expected = path.join(fixturesPath, 'expected.md');

    await execa(binPath, [
      input,
      '--bin-path',
      './my-cli.js',
      '--replacement-sigil',
      '<!-- CUSTOM_SIGIL -->',
      '--help-text-modify.search',
      '^Options:$\r?\n',
      '--help-text-modify.replacement',
      '',
    ], {
      cwd: fixturesPath,
    });

    expect(input).to.be.a.file().and.equal(expected);
  });

  it('works with script', async function() {
    let input = path.join(this.tmpPath, 'input.md');
    let expected = path.join(fixturesPath, 'expected.md');

    await execa(binPath, [
      input,
      '--npm-script-name',
      'start',
      '--replacement-sigil',
      '<!-- CUSTOM_SIGIL -->',
      '--help-text-modify.search',
      '^Options:$\r?\n',
      '--help-text-modify.replacement',
      '',
    ], {
      cwd: fixturesPath,
    });

    expect(input).to.be.a.file().and.equal(expected);
  });
});
