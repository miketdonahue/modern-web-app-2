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
          '@utils': './utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    ['import', { libraryName: 'antd', style: true }],
  ],
};
