import typescript from 'rollup-plugin-typescript2';
import alias from 'rollup-plugin-alias';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/index.system.js',
      format: 'system'
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    alias({
      resolve: ['ts'],
      entries: {
        '@bcase/core/loader': './loader.ts'
      }
    }),
    typescript()
  ]
};
