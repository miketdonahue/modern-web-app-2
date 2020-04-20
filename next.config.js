const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  distDir: '.build/client',
  poweredByHeader: false,
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: false,
  },
  onDemandEntries: {
    maxInactiveAge: 300000, // 5 minutes
    pagesBufferLength: 5,
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(png|jpg|svg|eot|otf|ttf|woff|woff2)$/,
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
});
