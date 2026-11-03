import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  worker: { format: 'es' },
  server: { host: '0.0.0.0', port: 5189, https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    fs: { allow: [fileURLToPath(new URL('../../', import.meta.url))] } },
  build: { target: 'esnext', outDir: fileURLToPath(new URL('../../docs/inference', import.meta.url)), emptyOutDir: true },
}));
