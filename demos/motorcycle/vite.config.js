import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, '../../docs');
const cesiumPackageRoot = path.dirname(require.resolve('cesium/package.json'));
const cesiumBuildRoot = path.join(cesiumPackageRoot, 'Build', 'Cesium');

export default defineConfig(({ command }) => ({
  root: '.',
  base: './',
  worker: { format: 'es' },
  define: {
    CESIUM_BASE_URL: JSON.stringify('./cesium/'),
  },
  plugins: [
    viteStaticCopy({
      targets: [
        ...['Workers', 'ThirdParty', 'Assets', 'Widgets'].map((directory) => ({
          src: path.join(cesiumBuildRoot, directory, '**', '*'),
          dest: path.posix.join('cesium', directory),
          rename: { stripBase: 5 },
        })),
        ...['LICENSE.md', 'ThirdParty.json'].map((file) => ({
          src: path.join(cesiumPackageRoot, file),
          dest: 'cesium',
          rename: { stripBase: true, name: file },
        })),
      ],
    }),
  ],
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
    chunkSizeWarningLimit: 2_200,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
      },
    },
  },
}));
