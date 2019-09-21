import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'bce',
  globalStyle: './src/index.scss',
  plugins: [sass({ injectGlobalPaths: ['./scss/index.scss'] })],
  outputTargets: [{ type: 'dist', dir: './dist', esmLoaderPath: '../loader' }],
  copy: [{ src: 'logo' }]
};
