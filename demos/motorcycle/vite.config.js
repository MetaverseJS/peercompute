import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, '../../docs');

export default defineConfig(({ command }) => ({
  root: '.',
  base: './',
  server: {
    port: 5188,
    https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: false,
      },
      '/healthz': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: false,
      },
    },
  },
  preview: {
    port: 5188,
    https: ensureDevHttpsCert(),
  },
  build: {
    outDir: path.resolve(docsRoot, 'motorcycle'),
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1_200,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
      },
    },
  },
}));
