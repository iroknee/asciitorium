import { defineConfig, Plugin } from 'vite';

// Minimal virtual shim for Node built-ins on the web build
function nodeBuiltinsShim(): Plugin {
  const ids = new Set([
    'fs',
    'fs/promises',
    'path',
    'readline',
    'node:fs',
    'node:fs/promises',
    'node:path',
    'node:readline',
  ]);
  return {
    name: 'node-builtins-shim',
    resolveId(id) {
      if (ids.has(id)) return id; // mark as resolved virtual id
      return null;
    },
    load(id) {
      if (ids.has(id)) return 'export {}'; // empty ESM module
      return null;
    },
  };
}

export default defineConfig({
  esbuild: { 
    target: 'esnext',
    jsx: 'automatic',
    jsxImportSource: 'asciitorium',
  },
  build: { target: 'esnext' },
  plugins: [nodeBuiltinsShim()],
  server: {
    port: 5173,
  },
});
