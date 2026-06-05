import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
const docsRoot = path.resolve(__dirname, '../../docs');
const demosSharedRoot = path.resolve(__dirname, '../shared');

export default defineConfig(({ command }) => ({
  root: '.',
  base: './',
  server: {
    port: 5184,
    https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    fs: {
      allow: [__dirname, peercomputeRoot, demosSharedRoot]
    }
  },
  resolve: {
    alias: {
      '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
    }
  },
  build: {
    outDir: path.resolve(docsRoot, 'schrodinger'),
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html')
      }
    }
  }
}));
