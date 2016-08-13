const webpack = require('webpack');

module.exports = {
    entry: './src/app.jsx',
    output: {
        path: '../public/js',
        filename: 'app.bundle.js',
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query:
              {
                presets:['es2015','stage-1','react']
              }
        } ]
    },
    /*plugins: [
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
