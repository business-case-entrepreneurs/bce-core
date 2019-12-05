const { createModelDirective } = require('@bcase/core-vue');
const path = require('path');

module.exports = {
  outputDir: path.join(__dirname, 'dist'),
  publicPath: process.env.NODE_ENV === 'production' ? '/bce-core/' : '/',
  chainWebpack: config => {
    config.resolve.symlinks(false);
    config.plugins.delete('progress');

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions = options.compilerOptions || {};
        options.compilerOptions.directives = {
          ...options.compilerOptions.directives,
          input: createModelDirective()
        };
        return options;
      });
  },
  css: {
    loaderOptions: {
      sass: {
        data: [`@import '@bcase/core/scss/index.scss';`, ''].join('\n'),
        includePaths: [path.resolve(__dirname)]
      }
    }
  }
};
