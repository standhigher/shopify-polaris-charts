import { defineConfig } from 'tsup';

const sharedConfig = {
  dts: true,
  external: ['react', 'react-dom', '@shopify/polaris', 'recharts'],
  format: 'esm' as const,
  sourcemap: true,
  splitting: false
};

export default defineConfig([
  {
    ...sharedConfig,
    clean: true,
    entry: { index: 'src/index.ts' }
  },
  {
    ...sharedConfig,
    clean: false,
    entry: { formatters: 'src/formatters/index.ts' }
  }
]);
