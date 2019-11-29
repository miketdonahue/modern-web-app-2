module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@client': './client',
          '@config': './config',
          '@pages': './pages',
          '@server': './server',
          '@styles': './styles',
          '@utils': './utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
