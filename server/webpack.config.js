const path = require('path');
const nodeExternals = require('webpack-node-externals');

const serverConfig = {
  context: __dirname,
  name: 'server',
  target: 'node',
  entry: {
    index: ['./index.ts'],
  },
  output: {
    path: path.resolve(process.cwd(), '.server'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current',
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  externals: [nodeExternals()],
  devtool: 'source-map',

  // Do not replace node globals with polyfills
  // https://webpack.js.org/configuration/node/
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

module.exports = serverConfig;
