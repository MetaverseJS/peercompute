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
    port: 5185,
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
    outDir: path.resolve(docsRoot, 'multiscale'),
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      input: {
        index: path.resolve(__dirname, 'index.html'),
        peercomputeComputeWorker: path.resolve(__dirname, 'src/compute/peercomputeComputeWorker.js'),
        peercomputeLadderTasks: path.resolve(__dirname, 'src/compute/peercomputeLadderTasks.js'),
        nbodyGravityTasks: path.resolve(__dirname, 'src/compute/nbodyGravityTasks.js'),
        cosmologyExpansionTasks: path.resolve(__dirname, 'src/compute/cosmologyExpansionTasks.js'),
        molecularDynamicsTasks: path.resolve(__dirname, 'src/compute/molecularDynamicsTasks.js'),
        reactiveThermalTasks: path.resolve(__dirname, 'src/compute/reactiveThermalTasks.js'),
        maxwellTasks: path.resolve(__dirname, 'src/compute/maxwellTasks.js'),
        sphMaterialTasks: path.resolve(__dirname, 'src/compute/sphMaterialTasks.js'),
        hydroAtmosphereTasks: path.resolve(__dirname, 'src/compute/hydroAtmosphereTasks.js'),
        radiationOpacityTasks: path.resolve(__dirname, 'src/compute/radiationOpacityTasks.js'),
        stellarFusionTasks: path.resolve(__dirname, 'src/compute/stellarFusionTasks.js'),
        magnetospherePlasmaTasks: path.resolve(__dirname, 'src/compute/magnetospherePlasmaTasks.js'),
        picPlasmaPatchTasks: path.resolve(__dirname, 'src/compute/picPlasmaPatchTasks.js'),
        relativisticCorrectionTasks: path.resolve(__dirname, 'src/compute/relativisticCorrectionTasks.js'),
        combustionPlumeTasks: path.resolve(__dirname, 'src/compute/combustionPlumeTasks.js'),
        membraneShellTasks: path.resolve(__dirname, 'src/compute/membraneShellTasks.js')
      },
      output: {
        entryFileNames: (chunkInfo) => (
          ['peercomputeComputeWorker', 'peercomputeLadderTasks', 'nbodyGravityTasks', 'cosmologyExpansionTasks', 'molecularDynamicsTasks', 'reactiveThermalTasks', 'maxwellTasks', 'sphMaterialTasks', 'hydroAtmosphereTasks', 'radiationOpacityTasks', 'stellarFusionTasks', 'magnetospherePlasmaTasks', 'picPlasmaPatchTasks', 'relativisticCorrectionTasks', 'combustionPlumeTasks', 'membraneShellTasks'].includes(chunkInfo.name)
            ? `assets/${chunkInfo.name}.js`
            : 'assets/[name]-[hash].js'
        )
      }
    }
  }
}));
