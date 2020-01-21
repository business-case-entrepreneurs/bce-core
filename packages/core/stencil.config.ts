import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'bce',
  globalStyle: './src/global/global.scss',
  globalScript: './src/global/global.ts',
  devServer: {
    openBrowser: false
  },
  plugins: [sass({ injectGlobalPaths: ['./scss/index.scss'] })],
  outputTargets: [
    { type: 'dist', dir: './dist', esmLoaderPath: '../loader' },
    { type: 'www', dir: './www', serviceWorker: null }
  ],
  copy: [{ src: 'logo' }]
};
