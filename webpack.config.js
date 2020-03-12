const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const isNode = process.argv.indexOf('--node') !== -1;

module.exports = {
  target: isNode ? 'node' : 'web',
  entry: ['babel-polyfill', './src/index.ts'],
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },

  externals: [isNode ? nodeExternals() : null].filter((p) => !!p),

  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },

  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',

  plugins: [
    !isNode
      ? new HtmlWebpackPlugin({
          template: './index.tpl.html',
        })
      : null,

    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
  ].filter((p) => !!p),
};
