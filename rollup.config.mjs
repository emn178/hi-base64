import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/base64.mjs',
    output: {
      file: 'build/base64.mjs',
      format: 'es'
    },
    plugins: [commonjs({
      strictRequires: false
    })]
  },
  {
    input: 'build/base64.mjs',
    output: {
      file: 'build/base64.min.mjs',
      format: 'es'
    },
    plugins: [terser()]
  }
];
