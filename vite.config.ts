import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@jsx': path.resolve(__dirname, 'src/core/jsx'),
    },
  },
});
