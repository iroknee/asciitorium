import { defineConfig } from 'vite';
import path from 'path';

const isDemo = process.env.BUILD_MODE === 'demo';

export default defineConfig({
  root: './',
  publicDir: 'public',
  base: isDemo ? '/asciitorium/' : '/',
  build: isDemo ? {
    outDir: 'dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  } : {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'docs/index': path.resolve(__dirname, 'src/docs/index.ts'),
      },
      name: 'asciitorium',
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return `asciitorium.${format}.js`;
        }
        return `${entryName}.js`;
      },
      formats: ['es', 'cjs'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['fs/promises', 'path', 'readline', 'asciitorium/jsx-runtime', 'asciitorium/jsx-dev-runtime'],
    },
  },
  plugins: [],
  assetsInclude: ['**/*.md'],
  resolve: {
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'asciitorium',
  },
});
