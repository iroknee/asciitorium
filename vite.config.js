import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    root: './',
    publicDir: 'public',
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'asciitorium',
            fileName: (format) => `asciitorium.${format}.js`,
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
