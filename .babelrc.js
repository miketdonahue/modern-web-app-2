module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@client': './src/client',
          '@components': './src/components',
          '@config': './config',
          '@pages': './src/pages',
          '@server': './src/server',
          '@styles': './src/styles',
          '@utils': './src/utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
