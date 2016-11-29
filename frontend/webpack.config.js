/* eslint-disable */
const webpack = require('webpack');

module.exports = {
    entry: './src/app.jsx',
    output: {
        path: '../public/js',
        filename: 'app.bundle.js',
    },
    module: {
        rules: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loaders: [
                {
                  loader: 'babel-loader',
                  query:
                    {
                      comments: false,
                      presets:[["es2015", { "modules": false }],'stage-1','stage-0','react']
                    }
                }
              ]
            },
            {
              test: /\.json$/,
              loaders: [ { loader: 'json-loader' } ]
            },
            /*{
                test: /\.tsx?/,
                loader: "ts-loader"
            }

            {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query:
              {
                comments: false,
                presets:['es2015-native-modules','stage-1','stage-0','react']
              }
        }, { test: /\.json$/, loader: "json-loader" } */]
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
        /*new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        })*/
    ]
}
