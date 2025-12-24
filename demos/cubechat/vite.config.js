import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
const docsRoot = path.resolve(__dirname, '../../docs');

export default defineConfig({
  root: '.',
  base: './',
  server: {
    port: 5176,
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
    outDir: path.resolve(docsRoot, 'cubechat'),
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html')
      }
    }
  }
});
