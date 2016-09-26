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
                  loader: 'babel',
                  query:
                    {
                      comments: false,
                      presets:['es2015-native-modules','stage-1','stage-0','react']
                    }
                }
              ]
            },
            {
              test: /\.json$/,
              loaders: [ { loader: 'json' } ]
            }
            /*
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
    //devtool: 'source-map'
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
}
