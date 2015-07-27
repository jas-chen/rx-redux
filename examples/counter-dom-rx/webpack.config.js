'use strict';

var path = require('path');
var src = path.join(__dirname, '..', '..', 'src');
var webpack = require('webpack');

var plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
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
    devtool: 'eval',
    entry: './index',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
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