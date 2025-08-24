import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'examples/index': path.resolve(__dirname, 'src/examples/index.ts'),
      },
      name: 'asciitorium',
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return `asciitorium.${format}.js`;
        }
        return `${entryName}.js`;
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['fs/promises', 'path', 'readline'],
    },
  },
  plugins: [],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@jsx': path.resolve(__dirname, 'src/jsx'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@jsx',
  },
});
