'use strict';

module.exports = {
  root: true,
  extends: [
    'crowdstrike-node',
  ],
  overrides: [
    {
      files: 'test/**/*-test.js',
      env: {
        mocha: true,
      },
      plugins: ['mocha'],
      extends: 'plugin:mocha/recommended',
      rules: {
        'mocha/no-setup-in-describe': 'off',
        'mocha/no-empty-description': 'off',
      },
    },
  ],
};
