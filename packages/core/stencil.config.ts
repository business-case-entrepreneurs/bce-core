import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
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
    { type: 'www', dir: './www', serviceWorker: null },
    reactOutputTarget({
      componentCorePackage: '@bcase/core',
      proxiesFile: '../react/src/components.ts'
    })
  ],
  copy: [{ src: 'logo' }]
};
