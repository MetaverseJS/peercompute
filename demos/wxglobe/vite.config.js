import { createRequire } from 'module';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
const cesiumPkg = path.dirname(require.resolve('cesium/package.json', { paths: [__dirname] }));
const cesiumBuild = path.resolve(cesiumPkg, 'Build/Cesium');

export default defineConfig({
  base: './',
  server: {
    https: ensureDevHttpsCert(),
    fs: {
      allow: [__dirname, peercomputeRoot]
    }
  },
  resolve: {
    alias: {
      '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
    }
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium')
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: path.join(cesiumBuild, 'Workers'), dest: 'cesium' },
        { src: path.join(cesiumBuild, 'ThirdParty'), dest: 'cesium' },
        { src: path.join(cesiumBuild, 'Assets'), dest: 'cesium' },
        { src: path.join(cesiumBuild, 'Widgets'), dest: 'cesium' }
      ]
    })
  ],
  build: {
    chunkSizeWarningLimit: 2000
  }
});
