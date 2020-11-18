module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'airbnb-typescript',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/require-default-props': 0, // Not useful with TypeScript
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/prefer-default-export': 0,
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'no-underscore-dangle': ['error', { allow: ['_headers'] }],
    'no-restricted-syntax': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'class-methods-use-this': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      { controlComponents: ['Input'] },
    ],
    'prefer-destructuring': 0,
    'react/destructuring-assignment': 0,
    '@typescript-eslint/camelcase': 0,

    // Must be turned off in favor of "@typescript-eslint/no-redeclare"
    'no-redeclare': 'off',

    // Rules turned off for Next.js
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-for': 0,
  },
  settings: {
    parser: 'typescript-eslint-parser',
    plugins: ['import'],
    'import/resolver': {
      typescript: {},
      'babel-module': {},
    },
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['src/components/{app,icons,illustrations}/**/*.tsx'],
      rules: {
        'react/jsx-props-no-spreading': 0,
      },
    },
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
};
