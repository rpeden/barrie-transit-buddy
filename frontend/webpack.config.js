const webpack = require('webpack');
const CCP = require('webpack-closure-compiler');
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
    /*resolve: {
      alias: {
        "react": "preact-compat",
        "react-dom": "preact-compat",
        "react-addons-transition-group": "preact-transition-group"
      }
    },*/
    //devtool: 'source-map',
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        /*new CCP({
          compiler: {
            "language_in": "ECMASCRIPT6",
            "language_out": "ECMASCRIPT5_STRICT",
            "compilation_level": "SIMPLE"
          },
          concurrency: 6
        })*/
        new webpack.DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify('production')
          }
        }),
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
