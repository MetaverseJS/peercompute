import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
const docsRoot = path.resolve(__dirname, '../../docs');
const disableOpen = process.env.PEERCOMPUTE_NO_OPEN === '1';
const taskUrlId = 'virtual:peercompute-mpm-task-url';
const resolvedTaskUrlId = `\0${taskUrlId}`;

/** A task module is imported by ComputeManager, so its public exports must survive tree shaking. */
export function mpmComputeTaskPlugin() {
  let building = false;
  return {
    name: 'peercompute-mpm-task-module',
    configResolved(config) { building = config.command === 'build'; },
    resolveId(id) { if (id === taskUrlId) return resolvedTaskUrlId; },
    load(id) {
      if (id !== resolvedTaskUrlId) return null;
      if (!building) {
        return 'export default new URL("/demos/shared/mpmComputeTasks.js", import.meta.url).href;';
      }
      const reference = this.emitFile({
        type: 'chunk',
        id: path.resolve(__dirname, 'demos/shared/mpmComputeTasks.js'),
        name: 'mpmComputeTasks',
        preserveSignature: 'strict',
      });
      return `export default import.meta.ROLLUP_FILE_URL_${reference};`;
    },
  };
}

export default defineConfig(({ command }) => ({
  root: __dirname,
  base: './',
  worker: { format: 'es' },
  // Keep generated dependency code readable without changing identifiers or licenses.
  esbuild: { lineLimit: 120, legalComments: 'inline' },
  plugins: [mpmComputeTaskPlugin()],
  build: {
    outDir: path.resolve(docsRoot, 'webgpuphys'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        demos: path.resolve(__dirname, 'demos/index.html'),
        toychest: path.resolve(__dirname, 'demos/toychest.html'),
        ppfCubicBarrier: path.resolve(__dirname, 'demos/ppf-cubic-barrier.html'),
        ppfContactSolver: path.resolve(__dirname, 'demos/ppf-contact-solver.html'),
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
    open: disableOpen ? false : '/demos/index.html',
    fs: {
      allow: [__dirname, peercomputeRoot]
    }
  },
  assetsInclude: ['**/*.wgsl']
}));
