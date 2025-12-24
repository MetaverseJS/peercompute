import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
const docsRoot = path.resolve(__dirname, '../../docs');

export default defineConfig(({ command }) => ({
  root: __dirname,
  base: './',
  build: {
    outDir: path.resolve(docsRoot, 'webgpuphys'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        demos: path.resolve(__dirname, 'demos/index.html'),
        toychest: path.resolve(__dirname, 'demos/toychest.html'),
        mpmHeadless: path.resolve(__dirname, 'demos/mpm-headless.html'),
        mpmVisual: path.resolve(__dirname, 'demos/mpm-visual.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
    }
  },
  server: {
    port: 5179,
    https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    open: '/demos/toychest.html',
    fs: {
      allow: [__dirname, peercomputeRoot]
    }
  },
  assetsInclude: ['**/*.wgsl']
}));
