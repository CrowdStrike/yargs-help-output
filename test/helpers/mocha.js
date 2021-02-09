'use strict';

require('mocha-helpers')(module);

function setUpTmpDir() {
  const { createTmpDir } = require('./fs');

  global.beforeEach(async function() {
    this.tmpPath = await createTmpDir();
  });
}

Object.assign(module.exports, {
  setUpTmpDir,
});
