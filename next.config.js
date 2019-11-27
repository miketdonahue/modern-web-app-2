const withTypescript = require('@zeit/next-typescript');
const withCss = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const antDesignTheme = require('./static/styles/ant-design/theme');

module.exports = withTypescript(
  withCss(
    withLess({
      distDir: '.build/client',
      poweredByHeader: false,
      cssModules: true,
      cssLoaderOptions: {
        getLocalIdent: (context, localIdentName, localName, options) => {
          if (context.resourcePath.includes('node_modules')) {
            return localName;
          }

          return getCSSModuleLocalIdent(
            context,
            localIdentName,
            localName,
            options
          );
        },
      },
      lessLoaderOptions: {
        modifyVars: antDesignTheme,
        javascriptEnabled: true,
      },
      webpack: (config, { isServer }) => {
        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/;
          const origExternals = [...config.externals];
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback();
              if (typeof origExternals[0] === 'function') {
                origExternals[0](context, request, callback);
              } else {
                callback();
              }
            },
            ...(typeof origExternals[0] === 'function' ? [] : origExternals),
          ];

          config.module.rules.unshift({
            test: antStyles,
            use: 'null-loader',
          });
        }

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
            test: /\.gql$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
          }
        );

        return config;
      },
    })
  )
);
