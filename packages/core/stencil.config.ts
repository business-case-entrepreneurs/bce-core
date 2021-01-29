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
    { type: 'dist-custom-elements-bundle' },
    {
      type: 'www',
      dir: './www',
      copy: [
        {
          src: '../node_modules/@fortawesome/fontawesome-svg-core/index.es.js',
          dest: 'static/fa-core.js'
        },
        {
          src:
            '../node_modules/@fortawesome/free-regular-svg-icons/index.es.js',
          dest: 'static/fa-far.js'
        },
        {
          src: '../node_modules/@fortawesome/free-solid-svg-icons/index.es.js',
          dest: 'static/fa-fas.js'
        }
      ],
      serviceWorker: null
    },
    reactOutputTarget({
      componentCorePackage: '@bcase/core',
      proxiesFile: '../react/src/components.ts'
    })
  ]
};
