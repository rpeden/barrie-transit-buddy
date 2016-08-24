const webpack = require('webpack');

module.exports = {
    entry: './src/app.jsx',
    output: {
        path: '../public/js',
        filename: 'app.bundle.js',
    },
    module: {
        loaders: [/*{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader!ts-loader'
        },*/{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query:
              {
                presets:['es2015','stage-1','react']
              }
        }, { test: /\.json$/, loader: "json-loader" } ]
    },
    devtool: 'source-map',
    /*plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]*/
}
