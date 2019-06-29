module.exports = {
  presets: ['next/babel', '@zeit/next-typescript/babel'],
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
          '@utils': './utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
