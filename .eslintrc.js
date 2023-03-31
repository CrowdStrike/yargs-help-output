'use strict';

module.exports = {
  root: true,
  extends: [
    'crowdstrike-node',
  ],
  parserOptions: {
    // eslint bug, not inheriting from eslint-config-crowdstrike correctly
    ecmaVersion: require('eslint-config-crowdstrike').parserOptions.ecmaVersion,
  },
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
