import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/zod3/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/zod3',
  },
  {
    entry: ['src/zod4/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/zod4',
  },
]);
