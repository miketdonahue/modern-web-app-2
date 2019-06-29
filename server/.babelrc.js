module.exports = {
  extends: '../.babelrc.js',
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: {
            node: 'current',
          },
        },
      },
    ],
    '@zeit/next-typescript/babel',
  ],
};
