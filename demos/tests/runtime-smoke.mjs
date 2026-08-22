import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const docsRoot = path.resolve(process.env.RUNTIME_SMOKE_DOCS_ROOT || path.join(repoRoot, 'docs'));
const port = Number(process.env.DOCS_PORT || 4179);
const host = process.env.DOCS_HOST || '127.0.0.1';
const baseUrl = `https://${host}:${port}`;
const defaultWaitMs = Number(process.env.DEMO_WAIT_MS || 6000);
const defaultReadyTimeoutMs = Number(process.env.DEMO_READY_TIMEOUT_MS || 15000);
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || process.env.CHROME_EXECUTABLE_PATH
  || (existsSync('/bin/google-chrome') ? '/bin/google-chrome' : undefined);

const allDemos = [
  { name: 'hyperborea', path: '/hyperborea/cb.html' },
  { name: 'cubechat', path: '/cubechat/' },
  { name: 'sneakywoods', path: '/sneakywoods/' },
  { name: 'daddygo', path: '/daddygo/' },
  { name: 'planetgen', path: '/planetgen/', waitMs: 9000, readyTimeoutMs: 45000 },
  {
    name: 'wxglobe',
    path: '/wxglobe/',
    waitMs: 3000,
    readyTimeoutMs: 45000,
    readyCheck: () => {
      const state = window.__wxglobe?.getState?.();
      return Boolean(
        state?.ready
        && state.frameCount > 0
        && state.imageryLayerCount === 0
        && state.materialType === 'WxGlobeTopoMaterial'
        && state.terrainProviderType === 'CappedHeightmapTerrainProvider'
        && state.terminalLodEnforced === true
        && !state.fatalError
      );
    },
    verify: () => window.__wxglobe?.getState?.() ?? null
  },
  { name: 'universes', path: '/universes/', waitMs: 9000, readyTimeoutMs: 45000 },
  { name: 'fano-reactor', path: '/fano-reactor/', waitMs: 3000 },
  { name: 'webgpuphys', path: '/webgpuphys/demos/toychest.html', waitMs: 9000, readyTimeoutMs: 45000 }
];

const requestedDemoNames = new Set(
  String(process.env.RUNTIME_SMOKE_DEMOS || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
);
const knownDemoNames = new Set(allDemos.map((demo) => demo.name));
const unknownDemoNames = [...requestedDemoNames].filter((name) => !knownDemoNames.has(name));
if (unknownDemoNames.length > 0) {
  throw new Error(`Unknown runtime smoke demo(s): ${unknownDemoNames.join(', ')}`);
}
const demos = requestedDemoNames.size > 0
  ? allDemos.filter((demo) => requestedDemoNames.has(demo.name))
  : allDemos;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const ignoredConsoleErrors = [
  /Failed to acquire a WebGPU adapter/i,
  /WebGPU is not supported/i,
  /WebSocket connection to .* failed/i,
  /UnsupportedListenAddressesError/i,
  /DialDeniedError/i,
  /P2P setup error/i,
  /WebGPU device lost/i,
  /Device was destroyed/i,
  /Failed to load resource: the server responded with a status of 404/i
];

const ignored404Urls = [
  /\/favicon\.ico$/i,
  /\/manifest\.webmanifest$/i,
  /\/relay-config-source\.json$/i,
  /\/\.relay-config-source\.json$/i
];

function resolveRequestPath(reqUrl) {
  const reqPath = decodeURIComponent((reqUrl || '/').split('?')[0]);
  const trimmed = reqPath.replace(/^\/+/, '');
  const rawPath = trimmed.endsWith('/') || trimmed === ''
    ? `${trimmed}index.html`
    : trimmed;
  const normalized = path.normalize(path.join(docsRoot, rawPath));
  if (!normalized.startsWith(docsRoot)) return null;
  return normalized;
}

function startServer() {
  const creds = ensureDevHttpsCert();
  const server = https.createServer({ key: creds.key, cert: creds.cert }, (req, res) => {
    const filePath = resolveRequestPath(req.url);
    if (!filePath) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      const ext = path.extname(filePath);
      const contentType = mime[ext] || 'application/octet-stream';
      const stat = statSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stat.size });
      createReadStream(filePath).pipe(res);
    } catch (_) {
      res.writeHead(404);
      res.end();
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}

function checkDocsBuild() {
  if (!existsSync(docsRoot)) {
    throw new Error('docs/ folder missing. Run `npm run build` first.');
  }
  const missing = demos.filter((demo) => {
    const relPath = demo.path.endsWith('.html')
      ? demo.path
      : `${demo.path.replace(/\/?$/, '/') }index.html`;
    const filePath = path.join(docsRoot, relPath);
    return !existsSync(filePath);
  });
  if (missing.length) {
    throw new Error(
      `Missing demo builds: ${missing.map((demo) => demo.name).join(', ')}. Run \`npm run build\` first.`
    );
  }
}

function isIgnoredError(message) {
  return ignoredConsoleErrors.some((pattern) => pattern.test(message));
}

async function runDemo(context, demo) {
  const errors = [];
  const page = await context.newPage();
  const missing = new Set();

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (isIgnoredError(text)) return;
    errors.push(`[console] ${text}`);
  });

  page.on('pageerror', (err) => {
    const message = err?.message || String(err);
    if (isIgnoredError(message)) return;
    errors.push(`[pageerror] ${message}`);
  });

  page.on('response', (response) => {
    if (response.status() !== 404) return;
    const url = response.url();
    if (ignored404Urls.some((pattern) => pattern.test(url))) return;
    missing.add(url);
  });

  const url = `${baseUrl}${demo.path}`;
  console.log(`→ ${demo.name}: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(
      demo.readyCheck || (() => Boolean(document.querySelector('canvas') || document.querySelector('#app'))),
      null,
      { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs }
    );
    await page.waitForTimeout(demo.waitMs || defaultWaitMs);

    if (demo.name === 'wxglobe' && process.env.WXGLOBE_REQUIRE_LIVE_TERRAIN === '1') {
      await page.waitForFunction(() => {
        const state = window.__wxglobe?.getState?.();
        return state?.terrain?.loaded > 0
          && state.terrain?.providerGeneration === state.providerGeneration
          && state.terrain?.terminalFailures === 0
          && state.tilesLoaded
          && state.ready
          && !state.fatalError;
      }, null, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });
    }

    if (demo.verify) {
      const state = await page.evaluate(demo.verify);
      if (!state) {
        errors.push('[runtime] readiness state unavailable');
      } else if (state.fatalError) {
        errors.push(`[runtime] fatal error: ${state.fatalError}`);
      } else if (demo.name === 'wxglobe' && state.terrain?.terminalFailures > 0) {
        errors.push(`[runtime] ${state.terrain.terminalFailures} terrain tile(s) failed terminally`);
      } else if (demo.name === 'wxglobe' && process.env.WXGLOBE_REQUIRE_LIVE_TERRAIN === '1') {
        if (!(state.terrain?.loaded > 0)) errors.push('[runtime] no live terrain tile loaded');
        if (!state.terrain?.lastLoadedTile) errors.push('[runtime] no successfully loaded terrain tile recorded');
        if (!(state.terrain?.negativeSamples > 0)) errors.push('[runtime] bathymetric heights were not observed');
        if (!(state.terrain?.positiveSamples > 0)) errors.push('[runtime] positive land heights were not observed');
        if (state.terrain?.terminalFailures !== 0) {
          errors.push(`[runtime] ${state.terrain.terminalFailures} live terrain tile(s) failed terminally`);
        }
        if (state.terrain?.providerGeneration !== state.providerGeneration) {
          errors.push('[runtime] terrain telemetry does not belong to the active provider generation');
        }
        if (!state.tilesLoaded) errors.push('[runtime] active globe tiles did not settle');
      }
    }

    if (demo.name === 'wxglobe' && process.env.WXGLOBE_REQUIRE_AWS_TERRAIN === '1') {
      const noaaState = await page.evaluate(demo.verify);
      await page.selectOption('#terrain-source', 'aws-terrarium');
      await page.click('[data-camera="mariana"]');
      await page.waitForFunction(() => {
        const state = window.__wxglobe?.getState?.();
        return state?.terrainSource === 'aws-terrarium'
          && state.providerGeneration > 1
          && state.terrain?.providerGeneration === state.providerGeneration
          && state.terrain?.loaded > 0
          && state.terrain?.maximumLoadedLevel >= 3
          && state.terrain?.lastLoadedTile?.level >= 0
          && state.terrain?.negativeSamples > 0
          && state.terrain?.positiveSamples > 0
          && state.terrain?.terminalFailures === 0
          && state.tilesLoaded
          && !state.fatalError;
      }, null, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });

      const terminalProbe = await page.evaluate(async ({ timeoutMs }) => Promise.race([
        window.__wxglobe.probeTerrainTile({ longitude: 145.4, latitude: 11.2 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('maximum-level terrain probe timed out')), timeoutMs))
      ]), { timeoutMs: demo.readyTimeoutMs || defaultReadyTimeoutMs });
      await page.waitForFunction(() => {
        const state = window.__wxglobe?.getState?.();
        return state?.terrainSource === 'aws-terrarium'
          && state.terrain?.providerGeneration === state.providerGeneration
          && state.terrain?.maximumLoadedLevel === state.maximumLevel
          && state.terrain?.terminalTiles > 0
          && state.terrain?.inFlight === 0
          && state.tilesLoaded;
      }, null, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });

      const stableBefore = await page.evaluate(demo.verify);
      await page.waitForTimeout(1200);
      const awsState = await page.evaluate(demo.verify);
      if (awsState.terrain?.terminalFailures !== 0) {
        errors.push(`[runtime] ${awsState.terrain.terminalFailures} AWS terrain tile(s) failed terminally`);
      }
      if (awsState.imageryLayerCount !== 0) errors.push('[runtime] AWS terrain switch introduced an imagery layer');
      if (awsState.coverage?.maximumLevel !== 15) errors.push('[runtime] AWS terrain z15 boundary is not exposed');
      if (!awsState.terminalLodEnforced) errors.push('[runtime] AWS terrain provider does not enforce terminal LOD');
      if (terminalProbe.childTileMask !== 0) errors.push('[runtime] AWS terminal tile advertises children');
      if (terminalProbe.sampleCount !== 257 * 257) errors.push('[runtime] AWS terrain grid is not 257×257 posts');
      if (awsState.terrain?.requested !== stableBefore.terrain?.requested
        || awsState.terrain?.loaded !== stableBefore.terrain?.loaded
        || awsState.terrain?.sourceTilesRequested !== stableBefore.terrain?.sourceTilesRequested) {
        errors.push('[runtime] AWS terrain requests did not stabilize after terminal LOD settled');
      }

      const awsGeneration = awsState.providerGeneration;
      await page.selectOption('#terrain-source', 'noaa-etopo2022');
      await page.click('[data-camera="world"]');
      await page.waitForFunction((priorGeneration) => {
        const state = window.__wxglobe?.getState?.();
        return state?.terrainSource === 'noaa-etopo2022'
          && state.providerGeneration > priorGeneration
          && state.terrain?.providerGeneration === state.providerGeneration
          && state.terrain?.loaded > 0
          && state.terrain?.terminalFailures === 0
          && state.tilesLoaded
          && state.ready
          && !state.fatalError;
      }, awsGeneration, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });
      const restoredState = await page.evaluate(demo.verify);
      if (restoredState.providerGeneration <= noaaState.providerGeneration) {
        errors.push('[runtime] reverse NOAA activation did not advance provider generation');
      }
      if (restoredState.imageryLayerCount !== 0) errors.push('[runtime] reverse NOAA switch introduced an imagery layer');
    }

    if (missing.size) {
      errors.push(`[404] ${Array.from(missing).join(', ')}`);
    }

    return errors;
  } finally {
    await page.close();
  }
}

async function main() {
  checkDocsBuild();

  const server = await startServer();
  const browser = await chromium.launch({
    ...(chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {}),
    headless: true,
    args: ['--enable-features=WebGPU', '--enable-unsafe-webgpu']
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  const failures = [];
  try {
    for (const demo of demos) {
      const errors = await runDemo(context, demo);
      if (errors.length) {
        failures.push({ demo: demo.name, errors });
      }
    }
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  if (failures.length) {
    const report = failures
      .map((entry) => `${entry.demo}:\n${entry.errors.map((err) => `  - ${err}`).join('\n')}`)
      .join('\n');
    throw new Error(`Runtime smoke failures:\n${report}`);
  }

  console.log('Runtime smoke tests passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
