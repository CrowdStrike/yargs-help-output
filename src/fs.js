'use strict';

const fs = require('fs').promises;

async function replaceFile(path, callback) {
  let oldContents = await fs.readFile(path, 'utf8');

  let newContents = await callback(oldContents);

  await fs.writeFile(path, newContents);

  return newContents;
}

module.exports = {
  replaceFile,
};
