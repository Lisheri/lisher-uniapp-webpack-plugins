import commonjs from '@rollup/plugin-commonjs'; // 你的包用到的第三方只有commonjs形式的包
import { terser } from 'rollup-plugin-terser'; // 压缩
import ts from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';

// 模块路径
const packagesDir = path.resolve(__dirname, 'packages');

// 获取构建路径
const resolve = p => path.resolve(path.resolve(packagesDir, 'vue'), p);

export default {
  input: resolve('./src/index.ts'),
  output: [
    // cjs -> commonjs
    // es module
    {
      format: 'cjs',
      file: resolve('lib/guide-mini-vue.cjs.js')
    },
    {
      format: 'esm',
      file: resolve('lib/guide-mini-vue.esm.js')
    }
  ],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      cacheRoot: path.resolve(__dirname, 'node_modules/.rollupTS_cache'),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
          outDir: 'lib/index.d.ts'
        }
      }
    }),
    commonjs(),
    terser(),]
};