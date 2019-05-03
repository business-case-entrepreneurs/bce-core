import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'bce',
  globalStyle: './src/index.scss',
  devServer: {
    openBrowser: false,
    devServerDir: './www'
  },
  plugins: [sass({ injectGlobalPaths: ['./scss/index.scss'] })],
  outputTargets: [
    { type: 'dist', dir: './dist' },
    { type: 'www', dir: './www', serviceWorker: null }
  ]
};
