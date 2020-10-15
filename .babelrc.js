module.exports = {
  presets: ['next/babel'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-optional-chaining',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './src/components',
          '@features': './src/features',
          '@config': './config',
          '@pages': './src/pages',
          '@views': './src/views',
          '@server': './src/server',
          '@styles': './src/styles',
          '@modules': './src/modules',
          '@public': './public',
          '@utils': './src/utils',
          '@typings': './typings',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
