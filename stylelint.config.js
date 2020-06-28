module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order', 'stylelint-prettier'],
  defaultSeverity: 'error',
  rules: {
    'prettier/prettier': true,
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'at-variables',
      'declarations',
      'rules',
      'at-rules',
    ],
    'order/properties-alphabetical-order': true,
    'color-hex-length': 'long',
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
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          // CSS Modules directives
          'global',
          'local',
        ],
      },
    ],
  },
};
