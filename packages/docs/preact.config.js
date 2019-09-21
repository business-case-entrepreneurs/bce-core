import Typescript from 'preact-cli-plugin-typescript';
import FastAsync from 'preact-cli-plugin-fast-async';

/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config original webpack config.
 * @param {object} env options passed to CLI.
 * @param {WebpackConfigHelpers} helpers object with useful helpers when working with config.
 **/
export default function(config, env, helpers) {
  const uglifyJS = helpers.getPluginsByName(config, 'UglifyJsPlugin')[0];
  if (uglifyJS) {
    config.plugins.splice(uglifyJS.index, 1);
  }

  Typescript(config);
  FastAsync(config);
}
