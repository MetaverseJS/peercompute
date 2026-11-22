import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { modelEvidenceBuildPlugin } from '../../scripts/modelEvidenceBuildPlugin.mjs';
import { pagesSharedRuntimePlugin } from '../../scripts/pagesSharedRuntimePlugin.mjs';
import { pagesIsolationPlugin } from '../shared/pagesIsolationPlugin.mjs';

const demoRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const docsRoot = path.resolve(repoRoot, 'docs');
const peercomputePkgRoot = path.resolve(repoRoot, 'peercompute');
const inferenceSrc = path.resolve(repoRoot, 'demos/inference/src');
const sharedDemosDir = path.resolve(repoRoot, 'demos/shared');
const exotuiDir = process.env.EXOTUI_DIR
  ? path.resolve(process.env.EXOTUI_DIR)
  : path.resolve(repoRoot, '../exotui');

const siblingRequireFrom = [
  path.join(exotuiDir, 'package.json'),
  path.join(repoRoot, 'package.json')
]
  .filter((pkg) => fs.existsSync(pkg))
  .map((pkg) => createRequire(pkg));

/**
 * Fallback bare-specifier resolver for sibling ExoTUI TypeScript sources imported
 * into Vite without interfering with nested node_modules inside peercompute.
 */
function exotuiDependencyFallbackPlugin() {
  return {
    name: 'vibeslopdb-exotui-dep-fallback',
    resolveId(source, importer) {
      if (!source || source.startsWith('.') || source.startsWith('/') || source.startsWith('\0') || source.includes(':')) {
        return null;
      }
      if (importer && (importer.includes('/node_modules/') || !importer.startsWith(exotuiDir))) {
        return null;
      }
      for (const req of siblingRequireFrom) {
        try {
          return req.resolve(source);
        } catch {
          // Try next search root.
        }
      }
      return null;
    }
  };
}

export default defineConfig(({ command }) => ({
  root: demoRoot,
  base: './',
  worker: { format: 'es' },
  esbuild: { lineLimit: 120, legalComments: 'inline' },
  resolve: {
    alias: [
      { find: '@peercompute', replacement: path.join(peercomputePkgRoot, 'src/peercompute/index.js') },
      { find: '@peercompute-inference', replacement: inferenceSrc },
      { find: '@peercompute-shared', replacement: sharedDemosDir },
      { find: '@exotui/web', replacement: path.join(exotuiDir, 'src/web/web_presenter.ts') },
      { find: '@exotui/mermaid', replacement: path.join(exotuiDir, 'mod.mermaid.ts') },
      { find: '@exotui/shell', replacement: path.join(exotuiDir, 'src/app/workbench_shell.ts') },
      { find: '@exotui/theme', replacement: path.join(exotuiDir, 'src/app/shell_theme.ts') },
      { find: '@exotui/tiled', replacement: path.join(exotuiDir, 'src/layout/tiled_workspace.ts') },
      { find: '@exotui/window-host', replacement: path.join(exotuiDir, 'src/app/workbench_window_host.ts') },
      { find: '@exotui/viz', replacement: path.join(exotuiDir, 'src/viz/mod.ts') }
    ]
  },
  plugins: [
    exotuiDependencyFallbackPlugin(),
    modelEvidenceBuildPlugin(),
    pagesSharedRuntimePlugin(),
    pagesIsolationPlugin()
  ],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite', 'sql.js']
  },
  server: {
    host: '0.0.0.0',
    port: 5190,
    allowedHosts: true,
    https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    fs: {
      allow: [demoRoot, repoRoot, exotuiDir]
    }
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  build: {
    target: 'esnext',
    outDir: path.join(docsRoot, 'vibeslopdb'),
    emptyOutDir: true
  }
}));
