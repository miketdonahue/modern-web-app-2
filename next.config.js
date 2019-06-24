const path = require('path');
const withTypescript = require('@zeit/next-typescript');
const withLess = require('@zeit/next-less');

module.exports = withTypescript(
  withLess({
    distDir: '.build/client',
    webpack(config) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '../../theme.config$': path.join(
          __dirname,
          'static/styles/theme.config'
        ),
      };

      config.module.rules.push(
        {
          test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              publicPath: '/_next/static/',
              outputPath: 'static/',
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /\.graphql$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        }
      );

      return config;
    },
  })
);
