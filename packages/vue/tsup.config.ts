import autoPropsPlugin from '@vue.ts/tsx-auto-props/esbuild';
import { defineConfig } from 'tsup';

import { name, version } from './package.json';

export default defineConfig(() => {
  return {
    clean: true,
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    bundle: true,
    sourcemap: true,
    minify: false,
    dts: true,
    plugins: [
      // Adds runtime props type generation from TS types
      autoPropsPlugin({
        include: ['**/*.ts'],
      }),
    ],
    define: {
      PACKAGE_NAME: `"${name}"`,
      PACKAGE_VERSION: `"${version}"`,
    },
    external: ['vue'],
  };
});
