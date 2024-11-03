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
      // Automatically extracts prop names from TypeScript interfaces/types and adds them
      // as runtime props to Vue components during build. This enables proper runtime prop
      // validation without manually declaring props. For example, if a component uses
      // SignInProps type, the plugin will generate Object.defineProperty to add all prop
      // names from that type to the component's props definition.
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
