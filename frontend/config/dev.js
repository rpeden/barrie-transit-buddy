// Rollup plugins.
import buble from 'rollup-plugin-buble'
import cjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json';

export default {
  dest: '../public/js/app.js',
  entry: 'src/app.jsx',
  format: 'iife',
  plugins: [
    resolve({
      browser: true,
      jsnext: true,
      main: true
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    json(),
    buble({ transforms: { dangerousForOf: true }}),
    cjs({
      exclude: 'node_modules/process-es6/**',
      include: [
        'node_modules/fbjs/**',
        'node_modules/object-assign/**',
        'node_modules/react/**',
        'node_modules/react-dom/**',
        'node_modules/react-router-redux/**',
        'node_modules/react-router/**',
        'node_modules/react-redux/**',
        'node_modules/material-ui/**',
        'node_modules/redux/**',
        'node_modules/lodash/**',
        'vendor/moment-timezone/**',
        'node_modules/socket.io-client/**',
        'vendor/react-google-maps/**',
        'node_modules/**'
      ],
      namedExports: { "node_modules/react/react.js": ["Component", "PropTypes", "createElement"] }
    }),
    globals()
  ],
  sourceMap: true
}
