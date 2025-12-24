import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');

export default defineConfig({
  root: '.',
  base: './',
  server: {
    port: 5175,
    fs: {
      allow: [__dirname, peercomputeRoot]
    }
  },
  resolve: {
    alias: {
      '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        cb: path.resolve(__dirname, 'cb.html')
      }
    }
  }
});
