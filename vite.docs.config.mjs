import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { ensureDevHttpsCert } from './scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Embedded GGUF and threaded WASM workers inherit isolation from the atlas.
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
};

export default defineConfig(({ command }) => ({
  root: path.resolve(__dirname, 'docs'),
  base: './',
  build: {
    outDir: '.',
    emptyOutDir: false
  },
  server: {
    headers: isolationHeaders,
    port: 4173,
    host: '0.0.0.0',
    https: command === 'serve' ? ensureDevHttpsCert() : undefined
  },
  preview: {
    headers: isolationHeaders,
    port: 4173,
    host: '0.0.0.0',
    https: ensureDevHttpsCert()
  }
}));
