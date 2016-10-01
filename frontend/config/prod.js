// Rollup plugins.
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import closure from 'rollup-plugin-closure-compiler-js';

// Import the development configuration.
import config from './dev'

// Inject the production settings.
config.dest = '../public/js/app.js'
config.plugins[1] = replace({ 'process.env.NODE_ENV': JSON.stringify('production') })
config.plugins.push(uglify())
//config.plugins.push(closure());

export default config;
