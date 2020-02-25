import typescript from 'rollup-plugin-typescript2';

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
  external: ['@bcase/core/loader', 'react', 'react-dom'],
  plugins: [typescript()]
};
