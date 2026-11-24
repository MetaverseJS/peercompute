import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig, loadEnv, mergeConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { ensureDevHttpsCert } from '../scripts/https.mjs';
import { modelEvidenceBuildPlugin } from '../scripts/modelEvidenceBuildPlugin.mjs';
import { pagesSharedRuntimePlugin } from '../scripts/pagesSharedRuntimePlugin.mjs';
import { pagesIsolationPlugin } from './shared/pagesIsolationPlugin.mjs';

const require = createRequire(import.meta.url);
const demosRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(demosRoot, '..');
const peercomputeRoot = path.resolve(repoRoot, 'peercompute');
const docsRoot = path.resolve(repoRoot, 'docs');
const galleryStaticRoot = path.resolve(demosRoot, 'gallery/static');
const devRelayDir = path.resolve(demosRoot, '.dev-relay');
const inferenceSrc = path.resolve(demosRoot, 'inference/src');
const sharedDemosDir = path.resolve(demosRoot, 'shared');
const exotuiDir = process.env.EXOTUI_DIR
  ? path.resolve(process.env.EXOTUI_DIR)
  : path.resolve(repoRoot, '../exotui');

const manifest = JSON.parse(fs.readFileSync(path.join(demosRoot, 'manifest.json'), 'utf8'));
const demoByName = new Map(manifest.demos.map((entry) => [entry.name, entry]));
const demoNames = new Set(manifest.demos.map((entry) => entry.name));

const cesiumPackageRoot = path.dirname(require.resolve('cesium/package.json'));
const cesiumBuildRoot = path.join(cesiumPackageRoot, 'Build', 'Cesium');

const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless'
};

const mimeByExt = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.glb', 'model/gltf-binary'],
  ['.gltf', 'model/gltf+json'],
  ['.ktx2', 'image/ktx2'],
  ['.pbf', 'application/x-protobuf'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.wgsl', 'text/plain; charset=utf-8'],
  ['.woff2', 'font/woff2'],
  ['.woff', 'font/woff'],
  ['.ttf', 'font/ttf']
]);

const MULTISCALE_WORKER_ENTRIES = [
  'peercomputeComputeWorker',
  'peercomputeLadderTasks',
  'nbodyGravityTasks',
  'cosmologyExpansionTasks',
  'molecularDynamicsTasks',
  'quantumOrbitalGridTasks',
  'quantumMaterialPotentialTasks',
  'ulgRuntimeTasks',
  'reactiveThermalTasks',
  'maxwellTasks',
  'sphMaterialTasks',
  'hydroAtmosphereTasks',
  'radiationOpacityTasks',
  'stellarFusionTasks',
  'magnetospherePlasmaTasks',
  'picPlasmaPatchTasks',
  'relativisticCorrectionTasks',
  'combustionPlumeTasks',
  'membraneShellTasks',
  'ulgMoonLabDispatchServiceHost',
  'ulgEshkolDispatchServiceHost'
];

const siblingRequireFrom = [
  path.join(exotuiDir, 'package.json'),
  path.join(repoRoot, 'package.json')
]
  .filter((pkg) => fs.existsSync(pkg))
  .map((pkg) => createRequire(pkg));

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

const mpmTaskUrlId = 'virtual:peercompute-mpm-task-url';
const resolvedMpmTaskUrlId = `\0${mpmTaskUrlId}`;

export function mpmComputeTaskPlugin({ unifiedDev = false } = {}) {
  let building = false;
  return {
    name: 'peercompute-mpm-task-module',
    configResolved(config) {
      building = config.command === 'build';
    },
    resolveId(id) {
      if (id === mpmTaskUrlId) return resolvedMpmTaskUrlId;
      return null;
    },
    load(id) {
      if (id !== resolvedMpmTaskUrlId) return null;
      if (!building) {
        const devPath = unifiedDev
          ? '/webgpuphys/demos/shared/mpmComputeTasks.js'
          : '/demos/shared/mpmComputeTasks.js';
        return `export default new URL(${JSON.stringify(devPath)}, import.meta.url).href;`;
      }
      const reference = this.emitFile({
        type: 'chunk',
        id: path.resolve(demosRoot, 'webgpuphys/demos/shared/mpmComputeTasks.js'),
        name: 'mpmComputeTasks',
        preserveSignature: 'strict'
      });
      return `export default import.meta.ROLLUP_FILE_URL_${reference};`;
    }
  };
}

function createCesiumStaticCopyPlugin() {
  return viteStaticCopy({
    targets: [
      ...['Workers', 'ThirdParty', 'Assets', 'Widgets'].map((directory) => {
        const sourceDir = path.join(cesiumBuildRoot, directory);
        return {
          src: path.join(sourceDir, '**', '*'),
          dest: path.posix.join('cesium', directory),
          rename: (_name, _ext, fullPath) => ({
            stripBase: true,
            name: path.relative(sourceDir, fullPath).split(path.sep).join(path.posix.sep)
          })
        };
      }),
      ...['LICENSE.md', 'ThirdParty.json'].map((file) => ({
        src: path.join(cesiumPackageRoot, file),
        dest: 'cesium',
        rename: { stripBase: true, name: file }
      }))
    ]
  });
}

function chaosApiFallbackPayload(urlPath = '') {
  const pathOnly = String(urlPath || '').split('?')[0];
  if (pathOnly.endsWith('/api/events') || pathOnly.endsWith('/events')) {
    return { events: [], degraded: true };
  }
  if (pathOnly.endsWith('/api/topology') || pathOnly.endsWith('/topology')) {
    return { run_id: null, updated_at: null, topology: null, degraded: true };
  }
  return { run_id: null, updated_at: null, degraded: true };
}

function writeChaosApiFallback(res, req) {
  if (!res || res.headersSent || res.writableEnded) return;
  const payload = chaosApiFallbackPayload(req?.url || '');
  const body = Buffer.from(JSON.stringify(payload), 'utf8');
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': String(body.length)
  });
  res.end(body);
}

function isWithin(baseDir, candidate) {
  const rel = path.relative(baseDir, candidate);
  return rel !== '' && !rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel);
}

function sendFile(res, filePath) {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mimeByExt.get(ext) || 'application/octet-stream',
    'Content-Length': String(stat.size),
    'Cache-Control': 'no-cache',
    ...isolationHeaders
  });
  fs.createReadStream(filePath).pipe(res);
}

function tryServeStatic(res, baseDir, relPath) {
  const target = path.resolve(baseDir, relPath);
  if (!isWithin(baseDir, target)) return false;
  try {
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      sendFile(res, target);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function createExotuiAliases() {
  return [
    { find: '@exotui/web', replacement: path.join(exotuiDir, 'src/web/web_presenter.ts') },
    { find: '@exotui/mermaid', replacement: path.join(exotuiDir, 'mod.mermaid.ts') },
    { find: '@exotui/shell', replacement: path.join(exotuiDir, 'src/app/workbench_shell.ts') },
    { find: '@exotui/theme', replacement: path.join(exotuiDir, 'src/app/shell_theme.ts') },
    { find: '@exotui/tiled', replacement: path.join(exotuiDir, 'src/layout/tiled_workspace.ts') },
    { find: '@exotui/window-host', replacement: path.join(exotuiDir, 'src/app/workbench_window_host.ts') },
    { find: '@exotui/viz', replacement: path.join(exotuiDir, 'src/viz/mod.ts') }
  ];
}

function unifiedDemosDevPlugin() {
  const cesiumDemos = new Set(manifest.demos.filter((d) => d.cesium).map((d) => d.name));
  const webgpuphysSrc = path.resolve(demosRoot, 'webgpuphys/src');
  const universesRoot = path.resolve(demosRoot, 'universes');

  return {
    name: 'peercompute-unified-demos-dev',
    resolveId(source, importer) {
      if (source && source.startsWith('@/') && importer) {
        if (importer.startsWith(path.join(demosRoot, 'webgpuphys'))) {
          return this.resolve(path.join(webgpuphysSrc, source.slice(2)), importer, { skipSelf: true });
        }
        if (importer.startsWith(universesRoot)) {
          return this.resolve(path.join(universesRoot, source.slice(2)), importer, { skipSelf: true });
        }
      }
      return null;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !['GET', 'HEAD'].includes(req.method || 'GET')) return next();
        const parsed = new URL(req.url, 'https://localhost');
        const pathname = decodeURIComponent(parsed.pathname);

        // Redirect bare /<demo> to /<demo>/ so relative ./ assets resolve inside the demo directory.
        const bareMatch = pathname.match(/^\/([a-z0-9-]+)$/);
        if (bareMatch && demoNames.has(bareMatch[1])) {
          res.writeHead(302, { Location: `${pathname}/${parsed.search}` });
          res.end();
          return;
        }

        // Dev gallery root & static assets: prefer built docs/ (for exowebtui.js + guides), fallback to demos/gallery/static/.
        if (pathname === '/' || pathname === '/index.html') {
          if (tryServeStatic(res, docsRoot, 'index.html')) return;
          if (tryServeStatic(res, galleryStaticRoot, 'index.html')) return;
        }
        if (pathname.startsWith('/assets/') || pathname.startsWith('/guides/')) {
          const rel = pathname.slice(1);
          if (tryServeStatic(res, docsRoot, rel)) return;
          if (tryServeStatic(res, galleryStaticRoot, rel)) return;
        }

        // VibeSlopDB live native multi-window host module in dev mode.
        if (pathname === '/vibeslopdb/host.js') {
          req.url = `/vibeslopdb/src/peercomputeHost.js${parsed.search}`;
          return next();
        }

        const segMatch = pathname.match(/^\/([a-z0-9-]+)\/(.+)$/);
        if (segMatch && demoNames.has(segMatch[1])) {
          const [, demoName, rest] = segMatch;

          // Serve Cesium static runtime directly out of node_modules/cesium in dev.
          if (cesiumDemos.has(demoName) && rest.startsWith('cesium/')) {
            const cesiumRel = rest.slice('cesium/'.length);
            if (tryServeStatic(res, cesiumBuildRoot, cesiumRel)) return;
            if (tryServeStatic(res, cesiumPackageRoot, cesiumRel)) return;
          }

          // Central dev relay config overrides per-demo relay-config*.json when active.
          if (
            rest === 'relay-config.json'
            || rest === '.relay-config.json'
            || rest === 'relay-config-source.json'
            || rest === '.relay-config-source.json'
          ) {
            if (tryServeStatic(res, devRelayDir, rest)) return;
          }

          // Per-demo public/ overlay (models, FHWA tiles, manifest.webmanifest, icons, relay-config.json).
          const demoPublicDir = path.join(demosRoot, demoName, 'public');
          if (tryServeStatic(res, demoPublicDir, rest)) return;
        }

        return next();
      });
    }
  };
}

export function createDemoBuildConfig(demoName, { command = 'build', mode = 'production' } = {}) {
  const demo = demoByName.get(demoName);
  if (!demo) {
    throw new Error(`Unknown demo "${demoName}". Known demos: ${[...demoNames].join(', ')}`);
  }

  const demoRoot = path.join(demosRoot, demoName);
  const env = demo.universesEnv ? loadEnv(mode, demoRoot, '') : {};
  const aliases = [
    { find: /^@peercompute\/core$/, replacement: path.resolve(peercomputeRoot, 'src/peercompute/core.js') },
    { find: /^@peercompute\/gpu-hub$/, replacement: path.resolve(peercomputeRoot, 'src/peercompute/gpu/GPUHubManager.js') }
  ];

  if (demo.usesInference) {
    aliases.push({ find: /^@peercompute$/, replacement: path.resolve(peercomputeRoot, 'src/peercompute/index.js') });
  }
  if (demo.vibeslopdb) {
    aliases.push(
      { find: '@peercompute-inference', replacement: inferenceSrc },
      { find: '@peercompute-shared', replacement: sharedDemosDir },
      ...createExotuiAliases()
    );
  }
  if (demo.webgpuphys) {
    aliases.push({ find: '@', replacement: path.resolve(demoRoot, 'src') });
  } else if (demo.universesEnv) {
    aliases.push({ find: '@', replacement: demoRoot });
  }

  const plugins = [];
  if (demo.vibeslopdb) plugins.push(exotuiDependencyFallbackPlugin());
  if (demo.usesInference) plugins.push(modelEvidenceBuildPlugin());
  plugins.push(pagesSharedRuntimePlugin());
  if (demo.pagesIsolation) {
    plugins.push(pagesIsolationPlugin(demo.pagesIsolation === true ? {} : demo.pagesIsolation));
  }
  if (demo.cesium) plugins.push(createCesiumStaticCopyPlugin());
  if (demo.webgpuphys) plugins.push(mpmComputeTaskPlugin({ unifiedDev: false }));

  const define = {};
  if (demo.cesium) define.CESIUM_BASE_URL = JSON.stringify('./cesium/');
  if (demo.universesEnv) {
    define['process.env.API_KEY'] = JSON.stringify(env.GEMINI_API_KEY);
    define['process.env.GEMINI_API_KEY'] = JSON.stringify(env.GEMINI_API_KEY);
  }

  let rollupOptions;
  if (demo.multiscaleWorkers) {
    const input = { index: path.resolve(demoRoot, 'index.html') };
    for (const workerName of MULTISCALE_WORKER_ENTRIES) {
      input[workerName] = path.resolve(demoRoot, `src/compute/${workerName}.js`);
    }
    const namedWorkerSet = new Set(MULTISCALE_WORKER_ENTRIES);
    rollupOptions = {
      preserveEntrySignatures: 'exports-only',
      input,
      output: {
        entryFileNames: (chunkInfo) => (
          namedWorkerSet.has(chunkInfo.name) ? `assets/${chunkInfo.name}.js` : 'assets/[name]-[hash].js'
        )
      }
    };
  } else if (demo.webgpuphys) {
    rollupOptions = {
      input: {
        main: path.resolve(demoRoot, 'index.html'),
        demos: path.resolve(demoRoot, 'demos/index.html'),
        toychest: path.resolve(demoRoot, 'demos/toychest.html'),
        ppfCubicBarrier: path.resolve(demoRoot, 'demos/ppf-cubic-barrier.html'),
        ppfContactSolver: path.resolve(demoRoot, 'demos/ppf-contact-solver.html'),
        mpmHeadless: path.resolve(demoRoot, 'demos/mpm-headless.html'),
        mpmVisual: path.resolve(demoRoot, 'demos/mpm-visual.html')
      }
    };
  } else if (demo.vibeslopdb) {
    rollupOptions = {
      preserveEntrySignatures: 'exports-only',
      input: {
        index: path.resolve(demoRoot, 'index.html'),
        host: path.resolve(demoRoot, 'src/peercomputeHost.js')
      },
      output: {
        entryFileNames: (chunkInfo) => (
          chunkInfo.name === 'host' ? 'host.js' : 'assets/[name]-[hash].js'
        )
      }
    };
  } else if (demo.inputs) {
    rollupOptions = {
      input: Object.fromEntries(
        Object.entries(demo.inputs).map(([key, rel]) => [key, path.resolve(demoRoot, rel)])
      )
    };
  } else {
    rollupOptions = {
      input: { index: path.resolve(demoRoot, 'index.html') }
    };
  }

  const serveHeaders = demoName === 'inference' || demo.vibeslopdb
    ? { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' }
    : isolationHeaders;

  return {
    configFile: false,
    root: demoRoot,
    base: './',
    worker: { format: 'es' },
    ...(demo.readableEsbuild || demo.webgpuphys ? { esbuild: { lineLimit: 120, legalComments: 'inline' } } : {}),
    ...(Object.keys(define).length ? { define } : {}),
    ...(demo.webgpuphys ? { assetsInclude: ['**/*.wgsl'] } : {}),
    ...(demo.vibeslopdb ? { optimizeDeps: { exclude: ['@electric-sql/pglite'] } } : {}),
    resolve: { alias: aliases },
    plugins: plugins.filter(Boolean),
    server: {
      host: '0.0.0.0',
      port: Number(process.env.DEMOS_PORT || manifest.devPort),
      allowedHosts: true,
      https: command === 'serve' ? ensureDevHttpsCert() : undefined,
      headers: serveHeaders,
      fs: { allow: [repoRoot, exotuiDir] }
    },
    build: {
      ...(demo.target ? { target: demo.target } : {}),
      outDir: path.resolve(docsRoot, demoName),
      assetsDir: 'assets',
      emptyOutDir: true,
      ...(demo.vibeslopdb ? { cssCodeSplit: false } : {}),
      ...(demo.chunkSizeWarningLimit ? { chunkSizeWarningLimit: demo.chunkSizeWarningLimit } : {}),
      rollupOptions
    }
  };
}

export function createDemoServerConfig(demoName, overrides = {}) {
  return mergeConfig(createDemoBuildConfig(demoName, { command: 'serve', mode: 'development' }), overrides);
}

export default defineConfig(({ command, mode }) => {
  const singleDemo = process.env.PEERCOMPUTE_DEMO;
  if (singleDemo) {
    return createDemoBuildConfig(singleDemo, { command, mode });
  }

  const universesEnv = loadEnv(mode, path.join(demosRoot, 'universes'), '');
  const chaosApiProxyTarget = process.env.VITE_CHAOS_API_PROXY_TARGET || 'http://127.0.0.1:8866';
  const geodataProxyTarget = process.env.VITE_GEODATA_PROXY_TARGET || 'http://127.0.0.1:8788';
  const port = Number(process.env.DEMOS_PORT || manifest.devPort);

  return {
    root: demosRoot,
    base: '/',
    publicDir: false,
    worker: { format: 'es' },
    assetsInclude: ['**/*.wgsl'],
    define: {
      CESIUM_BASE_URL: JSON.stringify('./cesium/'),
      'process.env.API_KEY': JSON.stringify(universesEnv.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(universesEnv.GEMINI_API_KEY)
    },
    optimizeDeps: {
      exclude: ['@electric-sql/pglite'],
      esbuildOptions: { target: 'esnext' }
    },
    resolve: {
      alias: [
        { find: /^@peercompute\/core$/, replacement: path.resolve(peercomputeRoot, 'src/peercompute/core.js') },
        { find: /^@peercompute\/gpu-hub$/, replacement: path.resolve(peercomputeRoot, 'src/peercompute/gpu/GPUHubManager.js') },
        { find: /^@peercompute$/, replacement: path.resolve(peercomputeRoot, 'src/peercompute/index.js') },
        { find: '@peercompute-inference', replacement: inferenceSrc },
        { find: '@peercompute-shared', replacement: sharedDemosDir },
        ...createExotuiAliases()
      ]
    },
    plugins: [
      unifiedDemosDevPlugin(),
      exotuiDependencyFallbackPlugin(),
      modelEvidenceBuildPlugin(),
      mpmComputeTaskPlugin({ unifiedDev: true })
    ],
    server: {
      host: '0.0.0.0',
      port,
      allowedHosts: true,
      https: command === 'serve' ? ensureDevHttpsCert() : undefined,
      headers: isolationHeaders,
      watch: {
        ignored: ['**/docs/**', '**/node_modules/**', '**/.git/**', '**/net-chaos-lab/**']
      },
      proxy: {
        '/api': {
          target: geodataProxyTarget,
          changeOrigin: false
        },
        '/healthz': {
          target: geodataProxyTarget,
          changeOrigin: false
        },
        '/chaos-api': {
          target: chaosApiProxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (pathValue) => pathValue.replace(/^\/chaos-api/, ''),
          configure: (proxy) => {
            proxy.on('error', (_err, req, res) => {
              writeChaosApiFallback(res, req);
            });
          }
        }
      },
      fs: {
        allow: [repoRoot, exotuiDir]
      }
    }
  };
});
