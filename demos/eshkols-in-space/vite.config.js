import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { pagesSharedRuntimePlugin } from '../../scripts/pagesSharedRuntimePlugin.mjs';

const demoRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const peercomputeRoot = path.resolve(repoRoot, 'peercompute');
const docsRoot = path.resolve(repoRoot, 'docs');

export default defineConfig(({ command }) => ({
  root: demoRoot,
  base: './',
  worker: { format: 'es' },
  plugins: [pagesSharedRuntimePlugin()],
  resolve: {
    alias: [
      { find: '@peercompute/gpu-hub', replacement: path.resolve(peercomputeRoot, 'src/peercompute/gpu/GPUHubManager.js') },
      { find: '@peercompute', replacement: path.resolve(peercomputeRoot, 'src/peercompute/index.js') }
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 5191,
    allowedHosts: true,
    https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    },
    fs: {
      allow: [demoRoot, repoRoot, peercomputeRoot]
    }
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    }
  },
  build: {
    target: 'esnext',
    outDir: path.resolve(docsRoot, 'eshkols-in-space'),
    assetsDir: 'assets',
    emptyOutDir: true
  }
}));
