import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'

export default {
  entry: 'src/app.jsx',
  dest: 'example/rollup-bundle.js',
  format: 'iife',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve({
      jsnext: true
    }),
    commonjs({
      include: ['node_modules/**', 'vendor/**'],
      namedExports: {
          'node_modules/react/react.js': ['Component', 'PropTypes', 'createElement', 'Children', 'isValidElement', 'cloneElement']
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    json()
  ]
}