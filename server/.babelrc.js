module.exports = {
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
