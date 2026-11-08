import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { pagesIsolationPlugin } from '../shared/pagesIsolationPlugin.mjs';

export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  worker: { format: 'es' },
  // Keep generated dependency code readable without changing identifiers or licenses.
  esbuild: { lineLimit: 120, legalComments: 'inline' },
  plugins: [pagesIsolationPlugin({ appShell: {
    publicFiles: ['manifest.webmanifest', 'icons/peercompute.svg', 'icons/peercompute-192.png',
      'icons/peercompute-512.png', 'icons/peercompute-maskable-512.png'],
  } })],
  server: { host: '0.0.0.0', port: 5189, https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' },
    fs: { allow: [fileURLToPath(new URL('../../', import.meta.url))] } },
  preview: { headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' } },
  build: { target: 'esnext', outDir: fileURLToPath(new URL('../../docs/inference', import.meta.url)), emptyOutDir: true },
}));
