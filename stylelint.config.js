module.exports = {
  extends: 'stylelint-config-standard',
  defaultSeverity: 'error',
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          // Tailwind CSS directives
          'extends',
          'apply',
          'tailwind',
          'components',
          'utilities',
          'screen',
        ],
      },
    ],
  },
};
