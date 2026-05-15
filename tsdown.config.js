import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  outDir: 'dist',
});
