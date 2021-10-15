import eslint from '@rollup/plugin-eslint'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    alias({
      entries: [
        { find: /^src\/(.*)/, replacement: './src/$1.js' },
        { find: /^lib\/(.*)/, replacement: './lib/$1.js' },
      ]
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: ['src/**', 'lib/**']
    }),
    eslint({
      exclude: 'node_modules/**'
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            'targets': {
              'node': 10
            },
            'useBuiltIns': 'usage',
            'corejs': 3
          }
        ]
      ]
    })
  ],
  external: ['fs', 'chalk']
}

