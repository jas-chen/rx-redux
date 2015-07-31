'use strict';

var path = require('path');
var rxRedux = path.join(__dirname, '..', '..');
var src = path.join(rxRedux, 'src');
var rx = path.join(rxRedux, 'node_modules', 'rx');
var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.OccurenceOrderPlugin()
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: './index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      // 'rx': 'rx-lite-joinpatterns'
      'rx': rx,
      'rx-redux': src
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [
          __dirname,
          src
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: plugins
};