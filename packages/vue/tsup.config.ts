import autoPropsPlugin from '@vue.ts/tsx-auto-props/esbuild';
import { defineConfig, type Options } from 'tsup';

import { name, version } from './package.json';

type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number];

export default defineConfig(() => {
  return {
    clean: true,
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    bundle: true,
    sourcemap: true,
    minify: false,
    dts: true,
    esbuildPlugins: [
      // Automatically generates runtime props from TypeScript types/interfaces, adding
      // them to Vue components during build via Object.defineProperty.
      autoPropsPlugin({
        include: ['**/*.ts'],
      }) as EsbuildPlugin,
    ],
    define: {
      PACKAGE_NAME: `"${name}"`,
      PACKAGE_VERSION: `"${version}"`,
    },
    external: ['vue'],
  };
});
