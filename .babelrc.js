module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@apollo-setup': './src/apollo',
          '@client': './src/client',
          '@components': './src/components',
          '@config': './config',
          '@pages': './src/pages',
          '@views': './src/views',
          '@server': './src/server',
          '@styles': './src/styles',
          '@modules': './src/modules',
          '@public': './public',
          '@utils': './src/utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
