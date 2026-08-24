import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { buildGeodataApp } from '../../services/geodata/src/app.js';
import { loadConfig as loadGeodataConfig } from '../../services/geodata/src/config.js';
import { createOverpassFixture, responseForJson } from '../../services/geodata/test/fixture.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const docsRoot = path.resolve(process.env.RUNTIME_SMOKE_DOCS_ROOT || path.join(repoRoot, 'docs'));
const port = Number(process.env.DOCS_PORT || 4179);
const host = process.env.DOCS_HOST || '127.0.0.1';
const baseUrl = `https://${host}:${port}`;
const defaultWaitMs = Number(process.env.DEMO_WAIT_MS || 6000);
const defaultReadyTimeoutMs = Number(process.env.DEMO_READY_TIMEOUT_MS || 15000);
const screenshotDirectory = process.env.RUNTIME_SMOKE_SCREENSHOT_DIR
  ? path.resolve(process.env.RUNTIME_SMOKE_SCREENSHOT_DIR)
  : null;
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || process.env.CHROME_EXECUTABLE_PATH
  || (existsSync('/bin/google-chrome') ? '/bin/google-chrome' : undefined);
let runtimeGeodataApp = null;

const shortbreadTileJsonFixture = Object.freeze({
  tilejson: '3.0.0',
  name: 'OpenStreetMap Shortbread runtime fixture',
  minzoom: 0,
  maxzoom: 14,
  tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
  vector_layers: [{ id: 'streets' }, { id: 'buildings' }]
});

// Canonical MVT v2 fixture with one street LineString and one building
// Polygon. An empty protobuf is valid but cannot prove that the live renderer
// decoded or drew either required Shortbread category.
const shortbreadMvtFixture = Buffer.from(
  'GjR4AgoHc3RyZWV0cxISCAESAgAAGAIiCAkAgCAK/j8AGgRraW5kIgoKCG1vdG9yd2F5KIAgGih4AgoJYnVpbGRpbmdzEhYIAhgDIhAJ0A/QDxrQDwAA0A/PDwAPKIAg',
  'base64'
);

const nowCoastFrameMilliseconds = Math.floor(Date.now() / (4 * 60_000)) * 4 * 60_000;
const nowCoastFrameTime = new Date(nowCoastFrameMilliseconds).toISOString();
const nowCoastCapabilitiesFixture = `<?xml version="1.0"?>
<WMS_Capabilities><Capability><Layer><Layer>
  <Name>alaska_base_reflectivity_mosaic</Name>
  <Dimension name="time">${new Date(nowCoastFrameMilliseconds - 8 * 60_000).toISOString()},${new Date(nowCoastFrameMilliseconds - 4 * 60_000).toISOString()},${nowCoastFrameTime}</Dimension>
</Layer></Layer></Capability></WMS_Capabilities>`;
const expiredNowCoastCapabilitiesFixture = `<?xml version="1.0"?>
<WMS_Capabilities><Capability><Layer><Layer>
  <Name>alaska_base_reflectivity_mosaic</Name>
  <Dimension name="time">2020-01-01T00:00:00Z</Dimension>
</Layer></Layer></Capability></WMS_Capabilities>`;

const transparentPngFixture = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+9tQYAAAAAElFTkSuQmCC',
  'base64'
);

function createAnchorageOverpassFixture() {
  const fixture = structuredClone(createOverpassFixture());
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Number.isFinite(value.latitude) && Number.isFinite(value.longitude)) {
      value.latitude += 61.21;
      value.longitude -= 149.9;
    }
    if (Number.isFinite(value.lat) && Number.isFinite(value.lon)) {
      value.lat += 61.21;
      value.lon -= 149.9;
    }
    for (const child of Object.values(value)) visit(child);
  };
  visit(fixture);
  return fixture;
}

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
  {
    name: 'earth',
    path: '/earth/?geodata=same-origin',
    waitMs: 3000,
    readyTimeoutMs: 45000,
    readyCheck: () => {
      const state = window.__earthDemo?.getState?.();
      return Boolean(
        state?.ready
        && state.frameCount > 0
        && state.terrainStatus === 'live'
        && state.terrain?.loaded > 0
        && state.osmStatus === 'live'
        && state.osmTelemetry?.loaded > 0
        && state.osmTelemetry?.roadCommands > 0
        && state.osmTelemetry?.buildingCommands > 0
        && state.imageryLayerCount === 1
        && state.geodataConfigured === true
        && state.localVisible === false
        && state.weatherStatus === 'off'
        && !state.fatalError
      );
    },
    verify: () => window.__earthDemo?.getState?.() ?? null
  },
  {
    name: 'motorcycle',
    path: '/motorcycle/?geodata=same-origin',
    waitMs: 1_000,
    readyTimeoutMs: 45_000,
    readyCheck: () => {
      const state = window.__motorcycleDemo?.getState?.();
      return Boolean(
        state?.ready
        && state.frameCount === 0
        && state.displayMode === 'overview'
        && state.overview?.engine === 'CesiumJS'
        && state.overview?.renderingBasis === 'cesium-globe'
        && state.overview?.renderedFrames > 0
        && state.overview?.relief?.status === 'current'
        && state.overview?.relief?.providerType === 'CappedHeightmapTerrainProvider'
        && state.overview?.roads?.status === 'current'
        && state.overview?.roads?.selectedTiles === 25
        && state.overview?.roads?.loadedTiles > 0
        && state.overview?.roads?.renderedRoads > 0
        && state.overview?.roads?.renderedVertices > 0
        && state.overview?.federalHighways?.status === 'current'
        && state.overview?.federalHighways?.sourceRecordCount === 492005
        && state.overview?.federalHighways?.includesAlaska === true
        && state.overview?.federalHighways?.loadedTiles > 0
        && state.overview?.federalHighways?.renderedRoads > 0
        && state.overview?.renderer?.terrainTilesLoaded === true
        && state.overview?.players?.synthetic === false
        && state.locationSource === 'browser-geolocation'
        && state.scene?.counts?.sourceRoads > 0
        && state.game?.motorcycle?.componentCount === 6
        && state.game?.physics?.overflows?.overflowed === false
        && state.game?.traffic?.spawnedVehicleCount > 0
        && state.game?.traffic?.graph?.laneCoverage
        && state.game?.traffic?.graph?.restrictionCoverage
        && state.game?.syntheticTraffic === true
        && state.game?.liveTraffic === false
        && state.game?.raceCourse?.source?.data === 'real OSM road graph'
        && state.game?.raceCourse?.gates?.length >= 2
        && ['ready', 'racing', 'finished'].includes(state.game?.race?.status)
        && state.renderer?.motorcycle?.componentCount === 6
        && state.renderer?.motorcycle?.style === 'minimal-nurbs-line-bike'
        && state.renderer?.motorcycle?.wheelCurveCount === 2
        && state.renderer?.motorcycle?.renderedParticleCount === 0
        && state.renderer?.terrain?.style === 'transparent-terrain-with-bounded-nurbs-contours'
        && state.renderer?.terrain?.contours?.curveModel === 'NURBS'
        && state.renderer?.race?.renderedGateCount === state.game?.raceCourse?.gates?.length
        && !state.fatalError
      );
    },
    verify: () => window.__motorcycleDemo?.getState?.() ?? null
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
    const pathname = new URL(demo.path, baseUrl).pathname;
    const relPath = pathname.endsWith('.html')
      ? pathname
      : `${pathname.replace(/\/?$/, '/') }index.html`;
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

async function installDeniedGeolocationFixture(page) {
  await page.evaluate(() => {
    Object.defineProperty(navigator.geolocation, 'getCurrentPosition', {
      configurable: true,
      value(_success, failure) {
        queueMicrotask(() => failure({
          code: 1,
          message: 'Permission denied by deterministic runtime fixture.',
        }));
      },
    });
  });
}

async function runDemo(context, demo) {
  const errors = [];
  const page = await context.newPage();
  const missing = new Set();
  const osmControl = {
    denseFailures: 0,
    invalidResponses: 0,
    staleResponses: false,
    delayNextMs: 0,
    requestCount: 0
  };
  const weatherControl = { expired: false };
  let expectedHttpConsoleErrors = 0;

  if (
    demo.name === 'earth'
    || demo.name === 'motorcycle'
    || (demo.name === 'wxglobe' && process.env.WXGLOBE_REQUIRE_LIVE_TERRAIN !== '1')
  ) {
    await page.route('**/api/v1/geo/osm?**', async (route) => {
      const url = new URL(route.request().url());
      osmControl.requestCount += 1;
      const delayMs = osmControl.delayNextMs;
      osmControl.delayNextMs = 0;
      if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (osmControl.denseFailures > 0) {
        osmControl.denseFailures -= 1;
        await route.fulfill({
          status: 422,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({
            schemaVersion: 'peercompute.geodata.error.v1',
            source: 'peercompute-geodata',
            status: 'error',
            synthetic: false,
            operationalUse: 'visualization and gameplay only; not for navigation or safety decisions',
            fetchedAt: '2026-08-23T00:00:00.000Z',
            staleAt: null,
            data: null,
            error: {
              code: 'REGION_RESULT_LIMIT_EXCEEDED',
              message: 'The deterministic dense-region fixture requires a narrower bbox.',
              retryable: true
            },
            notes: ['Retry with a smaller bounded region.']
          })
        });
        return;
      }
      if (osmControl.invalidResponses > 0) {
        osmControl.invalidResponses -= 1;
        await route.fulfill({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({ schemaVersion: 'unexpected.runtime-smoke.contract' })
        });
        return;
      }
      const response = await runtimeGeodataApp.inject({
        method: 'GET',
        url: `${url.pathname}${url.search}`,
        headers: { accept: 'application/json' }
      });
      const payload = JSON.parse(response.body);
      if (osmControl.staleResponses) {
        payload.status = 'stale';
        payload.cache.state = 'stale-on-error';
        payload.notes = [...payload.notes, 'Deterministic stale-cache runtime fixture.'];
      }
      await route.fulfill({
        status: response.statusCode,
        headers: { 'content-type': response.headers['content-type'] || 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });
    });
    await page.route('https://vector.openstreetmap.org/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/tilejson.json')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify(shortbreadTileJsonFixture)
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.mapbox-vector-tile',
        body: shortbreadMvtFixture
      });
    });
    await page.route('https://gis.ngdc.noaa.gov/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/getSamples')) {
        const body = new URLSearchParams(route.request().postData() ?? '');
        const geometry = JSON.parse(body.get('geometry') ?? '{}');
        const points = Array.isArray(geometry.points)
          ? geometry.points
          : Number.isFinite(geometry.x) && Number.isFinite(geometry.y)
            ? [[geometry.x, geometry.y]]
            : [];
        await route.fulfill({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({
            samples: points.map((_, index) => ({ locationId: index, value: 35 + index }))
          })
        });
        return;
      }
      const [width, height] = String(url.searchParams.get('size') || '65,65')
        .split(',')
        .map(Number);
      const body = Buffer.alloc(width * height * Int16Array.BYTES_PER_ELEMENT);
      for (let row = 0; row < height; row += 1) {
        for (let column = 0; column < width; column += 1) {
          const index = row * width + column;
          const elevation = Math.round(35 + Math.sin(column / 7) * 8 + Math.cos(row / 9) * 5);
          body.writeInt16LE(elevation, index * Int16Array.BYTES_PER_ELEMENT);
        }
      }
      await route.fulfill({ status: 200, contentType: 'application/octet-stream', body });
    });
    await page.route('https://nowcoast.noaa.gov/**', async (route) => {
      const url = new URL(route.request().url());
      if (String(url.searchParams.get('REQUEST')).toLowerCase() === 'getcapabilities') {
        await route.fulfill({
          status: 200,
          contentType: 'application/xml',
          body: weatherControl.expired
            ? expiredNowCoastCapabilitiesFixture
            : nowCoastCapabilitiesFixture
        });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'image/png', body: transparentPngFixture });
    });
  }

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (isIgnoredError(text)) return;
    if (expectedHttpConsoleErrors > 0 && /Failed to load resource/i.test(text)) {
      expectedHttpConsoleErrors -= 1;
      return;
    }
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
    try {
      await page.waitForFunction(
        demo.readyCheck || (() => Boolean(document.querySelector('canvas') || document.querySelector('#app'))),
        null,
        { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs }
      );
    } catch (error) {
      const state = demo.verify ? await page.evaluate(demo.verify).catch(() => null) : null;
      errors.push(`[runtime] readiness timeout: ${error instanceof Error ? error.message : String(error)} // ${JSON.stringify(state)}`);
      return errors;
    }
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

    if (demo.name === 'motorcycle') {
      const before = await page.evaluate(demo.verify);
      const overviewCanvas = await page.locator('.roadvector-cesium-canvas').boundingBox();
      if (!overviewCanvas) {
        errors.push('[runtime] Cesium overview canvas unavailable for click-to-start.');
      } else {
        await page.mouse.click(
          overviewCanvas.x + overviewCanvas.width / 2,
          overviewCanvas.y + overviewCanvas.height / 2,
        );
        await page.waitForFunction((priorGeneration) => {
          const state = window.__motorcycleDemo?.getState?.();
          return state?.overview?.selection?.status === 'playable'
            && state?.ready === true
            && state?.generation > priorGeneration
            && state?.locationSource === 'user-selected-anchor'
            && state?.overview?.players?.publishingLocation === true;
        }, before.generation, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });
      }
      await page.click('#world-mode');
      await page.waitForFunction(() => {
        const state = window.__motorcycleDemo?.getState?.();
        return state?.displayMode === 'ride' && state.frameCount > 0;
      });
      await page.evaluate(() => window.__motorcycleDemo.runScenario('accelerate'));
      await page.waitForTimeout(750);
      await page.evaluate(() => window.__motorcycleDemo.clearControlFrame());
      await page.click('#camera-toggle');
      await page.waitForFunction(() => window.__motorcycleDemo?.getState?.().view?.mode === 'first');
      await page.click('#locate');
      await page.waitForFunction(() => {
        const state = window.__motorcycleDemo?.getState?.();
        return state?.ready
          && state.locationSource === 'browser-geolocation'
          && state.displayMode === 'overview'
          && state.overview?.locationSource === 'browser-geolocation';
      }, null, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });
      await page.click('#world-mode');
      await page.waitForFunction(() => {
        const state = window.__motorcycleDemo?.getState?.();
        return state?.displayMode === 'ride' && state.frameCount > 0;
      });
      const after = await page.evaluate(demo.verify);
      if (!(after.frameCount > 0)) errors.push('[runtime] motorcycle animation did not advance');
      if (after.locationSource !== 'browser-geolocation') errors.push('[runtime] motorcycle did not accept permissioned geolocation');
      if (after.osmSource?.status !== 'current' || !after.osmSource?.cache?.state) {
        errors.push('[runtime] RoadVector did not expose exact OSM source status/cache provenance.');
      }
      if (!after.osmSource?.staleAt || !/OpenStreetMap/i.test(after.osmSource?.provenance?.source ?? '')) {
        errors.push('[runtime] RoadVector did not expose OSM freshness/source provenance.');
      }
      if (after.terrain?.degraded !== false) errors.push('[runtime] motorcycle did not decode the bounded NOAA terrain fixture');
      if (after.overview?.federalHighways?.status !== 'current'
        || !(after.overview?.federalHighways?.renderedRoads > 0)
        || after.overview?.federalHighways?.sourceRecordCount !== 492_005) {
        errors.push('[runtime] official FHWA NHS nationwide layer did not load and render.');
      }
      if (after.game?.physicsProfile?.authority !== 'deterministic-cpu') errors.push('[runtime] motorcycle physics is not CPU-authoritative');
      if (after.game?.traffic?.spawnedVehicleCount !== 14) errors.push('[runtime] synthetic traffic population mismatch');
      if (after.game?.trafficPhysics?.added !== 14) errors.push('[runtime] physical traffic cage population mismatch');
      if (!after.game?.traffic?.graph?.laneCoverage) errors.push('[runtime] lane-aware traffic coverage missing');
      if (!after.game?.traffic?.graph?.restrictionCoverage) errors.push('[runtime] turn-restriction coverage missing');
      if (after.game?.raceCourse?.source?.data !== 'real OSM road graph') errors.push('[runtime] real-road race provenance missing');
      if (!(after.game?.raceCourse?.gates?.length >= 2)) errors.push('[runtime] deterministic race gates missing');
      if (after.renderer?.race?.renderedGateCount !== after.game?.raceCourse?.gates?.length) errors.push('[runtime] race gate renderer mismatch');
      if (after.renderer?.motorcycle?.componentCount !== 6) errors.push('[runtime] six-component motorcycle renderer contract missing');
      if (after.renderer?.motorcycle?.style !== 'minimal-nurbs-line-bike'
        || after.renderer?.motorcycle?.wheelCurveCount !== 2
        || after.renderer?.motorcycle?.renderedParticleCount !== 0
        || after.renderer?.motorcycle?.physicsDebugEnabled !== false) {
        errors.push('[runtime] minimalist two-wheel NURBS motorcycle contract missing.');
      }
      if (after.renderer?.terrain?.style !== 'transparent-terrain-with-bounded-nurbs-contours'
        || after.renderer?.terrain?.surfaceOpacity > 0.05
        || after.renderer?.terrain?.contours?.curveModel !== 'NURBS'
        || !(after.renderer?.terrain?.contours?.nurbsCurveCount > 0)
        || after.renderer?.terrain?.contours?.sampledVertexCount > 60_000
        || after.renderer?.terrain?.contours?.drawCallCount > 4) {
        errors.push('[runtime] transparent bounded NURBS terrain contract missing.');
      }
      if (after.renderer?.contacts?.renderedContactCount !== 0
        || after.renderer?.contacts?.physicsDebugEnabled !== false) {
        errors.push('[runtime] default renderer exposed debug-only contact geometry.');
      }
      if (after.view?.mode !== 'first') errors.push('[runtime] first-person camera control did not persist');
      if (!['clear', 'clamped'].includes(after.view?.terrainFloor?.status)
        || !Number.isFinite(after.view?.terrainFloor?.minimumCameraHeightMeters)
        || !Number.isFinite(after.view?.terrainFloor?.constrainedPosition?.[1])
        || after.view.terrainFloor.constrainedPosition[1]
          < after.view.terrainFloor.minimumCameraHeightMeters - 1e-6) {
        errors.push('[runtime] camera terrain-floor constraint was not active or remained underground.');
      }
      const suspension = after.game?.motorcycle?.suspension;
      const tires = after.game?.motorcycle?.tires;
      const finiteTelemetry = [
        suspension?.front?.positionMeters,
        suspension?.front?.normalizedTravel,
        suspension?.rear?.swingarmAngleRadians,
        tires?.front?.normalLoad,
        tires?.front?.longitudinalSlip,
        tires?.rear?.normalLoad,
        tires?.rear?.lateralSlip,
      ].every(Number.isFinite);
      if (!finiteTelemetry) errors.push('[runtime] wheel/tire/suspension telemetry was not finite in the built game.');
      const provenanceText = await page.locator('#provenance').textContent();
      if (!/OpenStreetMap contributors/i.test(provenanceText ?? '')) {
        errors.push('[runtime] visible RoadVector OpenStreetMap attribution was missing.');
      }
      if (!(after.generation > before.generation)) {
        errors.push('[runtime] geolocation reload did not replace the prior world generation');
      }

      const trafficImpact = await page.evaluate(() => window.__motorcycleDemo.runScenario('traffic-impact'));
      if (!(trafficImpact?.maximumImpulse > 0) || trafficImpact?.collisionStep === null) {
        errors.push('[runtime] built RoadVector did not prove a physical synthetic-traffic impact.');
      }
      if (!trafficImpact?.finite || trafficImpact?.overflowed) {
        errors.push('[runtime] built RoadVector traffic impact was non-finite or overflowed.');
      }

      await page.keyboard.down('KeyW');
      await page.keyboard.down('KeyD');
      await page.waitForFunction(() => {
        const state = window.__motorcycleDemo?.getState?.();
        return state?.lastControl?.steer > 0.9
          && state?.game?.motorcycle?.steeringTarget < 0;
      });
      await page.keyboard.up('KeyD');
      await page.keyboard.down('KeyA');
      await page.waitForFunction(() => {
        const state = window.__motorcycleDemo?.getState?.();
        return state?.lastControl?.throttle > 0.9
          && state?.lastControl?.steer < -0.9
          && state?.game?.motorcycle?.steeringTarget > 0;
      });
      await page.keyboard.up('KeyA');
      await page.keyboard.up('KeyW');

      await page.evaluate(() => {
        for (const target of [document.querySelector('#touch-steer'), document.querySelector('#touch-throttle')]) {
          target.setPointerCapture = () => {};
          target.releasePointerCapture = () => {};
        }
        const event = (type, id, target, values = {}) => target.dispatchEvent(new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          pointerId: id,
          pointerType: 'touch',
          clientX: values.clientX ?? 0,
          clientY: values.clientY ?? 0,
          pressure: values.pressure ?? 1,
        }));
        event('pointerdown', 41, document.querySelector('#touch-steer'), { clientX: 1 });
        event('pointerdown', 42, document.querySelector('#touch-throttle'), { clientY: 0 });
      });
      await page.waitForFunction(() => {
        const control = window.__motorcycleDemo?.getState?.().lastControl;
        return control?.steer > 0.9 && control?.throttle > 0.9;
      });
      await page.evaluate(() => {
        const release = (id, target) => target.dispatchEvent(new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: id,
          pointerType: 'touch',
        }));
        release(41, document.querySelector('#touch-steer'));
        release(42, document.querySelector('#touch-throttle'));
      });

      await page.evaluate(() => {
        const gamepad = {
          id: 'Runtime Smoke Standard Gamepad',
          index: 0,
          connected: true,
          mapping: 'standard',
          timestamp: performance.now(),
          axes: [0.75, 0, 0, 0],
          buttons: Array.from({ length: 17 }, (_, index) => ({
            pressed: index === 7,
            touched: index === 7,
            value: index === 7 ? 1 : 0,
          })),
        };
        Object.defineProperty(navigator, 'getGamepads', {
          configurable: true,
          value: () => [gamepad],
        });
      });
      await page.waitForFunction(() => {
        const state = window.__motorcycleDemo?.getState?.();
        return state?.input?.gamepads?.length === 1
          && Math.abs(state.lastControl?.steer ?? 0) > 0.7
          && (state.lastControl?.throttle ?? 0) > 0.9;
      });

      const motorcycleCanvas = await page.locator('#viewport canvas').boundingBox();
      if (!motorcycleCanvas) {
        errors.push('[runtime] motorcycle canvas bounds unavailable for pointer-lock gesture');
      } else {
        await page.mouse.click(
          motorcycleCanvas.x + motorcycleCanvas.width - 30,
          motorcycleCanvas.y + motorcycleCanvas.height / 2,
        );
      }
      await page.waitForFunction(() => window.__motorcycleDemo?.getState?.().input?.keyboard?.pointerLocked === true);
      await page.evaluate(() => document.exitPointerLock());
      await page.waitForFunction(() => window.__motorcycleDemo?.getState?.().input?.keyboard?.pointerLocked === false);

      await page.evaluate(() => {
        Object.defineProperty(navigator, 'getGamepads', {
          configurable: true,
          value: () => [],
        });
        window.__motorcycleDemo.clearControlFrame();
        window.__motorcycleDemo.setCamera('third');
        window.__motorcycleDemo.reset();
      });
      await page.waitForTimeout(350);
      const priorInputResetFrame = await page.evaluate(() => (
        window.__motorcycleDemo.getState().view.lastInputReset?.frameCount ?? -1
      ));
      await page.keyboard.down('KeyR');
      await page.waitForFunction((prior) => {
        const reset = window.__motorcycleDemo?.getState?.().view?.lastInputReset;
        return reset?.frameCount > prior;
      }, priorInputResetFrame);
      await page.keyboard.up('KeyR');
      const inputReset = await page.evaluate(() => window.__motorcycleDemo.getState().view.lastInputReset);
      if (inputReset.mode !== 'third' || !inputReset.recentered || !(inputReset.positionErrorMeters < 1e-6)) {
        errors.push(`[runtime] normalized reset did not atomically reset the chase view: ${JSON.stringify(inputReset)}`);
      }
      const beforeRebase = await page.evaluate(() => {
        const api = window.__motorcycleDemo;
        const game = api.gameRuntime;
        const state = api.getState();
        return {
          rebaseCount: state.game.origin.rebaseCount,
        };
      });
      await page.evaluate(() => {
        const game = window.__motorcycleDemo.gameRuntime;
        const state = game.getState();
        const chassis = game.world.getBody(game.rig.bodyIds.chassis);
        const magnitude = state.origin.rebaseThresholdMeters + 25;
        const targetX = Math.sign(chassis.position[0] || 1) * magnitude;
        const translation = targetX - chassis.position[0];
        for (const bodyId of game.rig.bodyIdList) {
          const body = game.world.getBody(bodyId);
          for (const field of ['position', 'previousPosition', 'predictedPosition']) {
            body[field][0] += translation;
          }
        }
      });
      await page.waitForFunction((prior) => (
        window.__motorcycleDemo?.getState?.().game?.origin?.rebaseCount > prior
      ), beforeRebase.rebaseCount);
      const afterRebase = await page.evaluate(() => {
        return window.__motorcycleDemo.getState().view.lastOriginRebase;
      });
      if (!afterRebase || afterRebase.sequence <= beforeRebase.rebaseCount) {
        errors.push('[runtime] origin rebase did not publish an atomic camera-frame snapshot');
      } else if (!(afterRebase.shiftErrorMeters < 1e-6)) {
        errors.push(`[runtime] camera did not shift atomically with origin rebase: ${afterRebase.shiftErrorMeters.toFixed(6)} m`);
      }

      osmControl.invalidResponses = 1;
      const failedLoad = await page.evaluate(async () => {
        try {
          await window.__motorcycleDemo.loadLocation({ longitude: -149.892, latitude: 61.223 });
          return null;
        } catch (error) {
          return { name: error?.name ?? null, message: error?.message ?? String(error) };
        }
      });
      const unavailable = await page.evaluate(demo.verify);
      if (!failedLoad?.message || unavailable.ready || unavailable.location || unavailable.scene || unavailable.game) {
        errors.push('[runtime] RoadVector did not fail closed and clear its prior world after an invalid backend contract.');
      }
      await page.evaluate(() => window.__motorcycleDemo.loadLocation({ longitude: -149.891, latitude: 61.224 }));
      await page.waitForFunction(() => window.__motorcycleDemo?.getState?.().ready === true);

      osmControl.delayNextMs = 350;
      await page.evaluate(() => {
        window.__motorcycleDelayedLoad = window.__motorcycleDemo.loadLocation({
          longitude: -149.890,
          latitude: 61.225,
        });
      });
      await page.waitForTimeout(50);
      await page.evaluate(() => window.__motorcycleDemo.loadLocation({ longitude: -149.889, latitude: 61.226 }));
      await page.evaluate(() => Promise.allSettled([window.__motorcycleDelayedLoad]));
      const raced = await page.evaluate(demo.verify);
      if (raced.location?.longitude !== -149.889 || raced.location?.latitude !== 61.226 || !raced.ready) {
        errors.push('[runtime] An older delayed RoadVector generation replaced the current world.');
      }

      await installDeniedGeolocationFixture(page);
      await page.click('#locate');
      await page.waitForFunction(() => {
        const state = window.__motorcycleDemo?.getState?.();
        return state?.ready && state.locationSource === 'geolocation-denied-fallback';
      }, null, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });
      const denied = await page.evaluate(demo.verify);
      if (!/BROWSER GEOLOCATION UNAVAILABLE/i.test(denied.locationNotice ?? '')) {
        errors.push('[runtime] RoadVector did not disclose its geolocation-denied fallback.');
      }
      if (osmControl.requestCount < 7) {
        errors.push('[runtime] RoadVector source lifecycle did not exercise every bounded request path.');
      }
    }

    if (demo.name === 'earth') {
      const initial = await page.evaluate(demo.verify);
      if (initial.geodataConfigured !== true) errors.push('[runtime] Earth did not select the same-origin geodata API.');
      if (!(initial.osmTelemetry?.loaded > 0)) errors.push('[runtime] Earth did not decode a Shortbread tile.');
      if (!(initial.osmTelemetry?.roadCommands > 0 && initial.osmTelemetry?.buildingCommands > 0)) {
        errors.push('[runtime] Earth did not render both Shortbread road and building categories.');
      }

      await page.click('#locate');
      await page.waitForFunction(() => {
        const state = window.__earthDemo?.getState?.();
        return state?.locationSource === 'browser-geolocation'
          && state.localStatus === 'local-live'
          && state.localVisible
          && state.localCounts?.renderedRoads > 0
          && state.localCounts?.renderedBuildings > 0;
      }, null, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });
      const located = await page.evaluate(demo.verify);
      if (located.localSource?.status !== 'current') errors.push('[runtime] Earth local source status/provenance was not retained.');
      if (!located.localSource?.provenance?.licenseUrl) errors.push('[runtime] Earth omitted the ODbL provenance link.');

      await page.evaluate(() => window.__earthDemo.setWeather('noaa-radar-alaska'));
      await page.waitForFunction(() => window.__earthDemo?.getState?.().weatherStatus === 'live');
      const weather = await page.evaluate(demo.verify);
      if (weather.weather?.time !== nowCoastFrameTime) errors.push('[runtime] Earth did not retain the selected NOAA frame time.');
      if (weather.imageryLayerCount !== 2) errors.push('[runtime] Earth NOAA weather layer was not attached.');

      weatherControl.expired = true;
      await page.evaluate(async () => {
        await window.__earthDemo.setWeather('off');
        await window.__earthDemo.setWeather('noaa-radar-alaska');
      });
      await page.waitForFunction(() => window.__earthDemo?.getState?.().weatherStatus === 'unavailable');
      const expiredWeather = await page.evaluate(demo.verify);
      if (expiredWeather.weather !== null || expiredWeather.imageryLayerCount !== 1) {
        errors.push('[runtime] Earth rendered an expired NOAA frame.');
      }
      weatherControl.expired = false;
      await page.evaluate(() => window.__earthDemo.setWeather('noaa-radar-alaska'));
      await page.waitForFunction(() => window.__earthDemo?.getState?.().weatherStatus === 'live');

      osmControl.invalidResponses = 1;
      await page.evaluate(() => window.__earthDemo.setLocation({ longitude: -149.894, latitude: 61.221 }));
      const failed = await page.evaluate(demo.verify);
      if (failed.localStatus !== 'unavailable') errors.push('[runtime] Earth did not expose the invalid backend contract as unavailable.');
      if (failed.localVisible || failed.localCounts !== null || failed.localSource !== null) {
        errors.push('[runtime] Earth retained stale local entities/provenance after a scope failure.');
      }

      expectedHttpConsoleErrors += 1;
      osmControl.denseFailures = 1;
      await page.evaluate(() => window.__earthDemo.setLocation({ longitude: -149.895, latitude: 61.2205 }));
      await page.waitForFunction(() => window.__earthDemo?.getState?.().localStatus === 'local-live');
      const narrowed = await page.evaluate(demo.verify);
      if (narrowed.localRadiusMeters !== 800) errors.push('[runtime] Earth did not retry a dense region with the next bounded radius.');

      osmControl.staleResponses = true;
      await page.evaluate(() => window.__earthDemo.reloadLocalRegion());
      await page.waitForFunction(() => window.__earthDemo?.getState?.().localStatus === 'stale');
      await page.uncheck('#local-scene');
      await page.check('#local-scene');
      const stale = await page.evaluate(demo.verify);
      if (stale.localStatus !== 'stale' || stale.localSource?.status !== 'stale') {
        errors.push('[runtime] Earth relabeled a retained stale envelope as live after toggling the layer.');
      }

      osmControl.staleResponses = false;
      osmControl.delayNextMs = 350;
      await page.evaluate(() => {
        window.__earthDelayedLoad = window.__earthDemo.setLocation({ longitude: -149.896, latitude: 61.2195 });
      });
      await page.waitForTimeout(50);
      await page.evaluate(() => window.__earthDemo.setLocation({ longitude: -149.893, latitude: 61.222 }));
      await page.evaluate(() => Promise.allSettled([window.__earthDelayedLoad]));
      const raced = await page.evaluate(demo.verify);
      if (raced.location?.longitude !== -149.893 || raced.location?.latitude !== 61.222) {
        errors.push('[runtime] An older delayed Earth generation replaced the current scope.');
      }
      if (raced.localStatus !== 'local-live' || !raced.localVisible) {
        errors.push('[runtime] Earth did not recover after the delayed-generation replacement.');
      }
      await installDeniedGeolocationFixture(page);
      await page.click('#locate');
      await page.waitForFunction(() => {
        const state = window.__earthDemo?.getState?.();
        return state?.locationSource === 'geolocation-denied-fallback'
          && state.localStatus === 'local-live'
          && state.localVisible;
      }, null, { timeout: demo.readyTimeoutMs || defaultReadyTimeoutMs });
      const deniedStatus = await page.locator('#region-status').textContent();
      if (!/LOCATION DENIED \/\/ ANCHORAGE FALLBACK/i.test(deniedStatus ?? '')) {
        errors.push('[runtime] Earth did not visibly disclose its geolocation-denied fallback.');
      }
      if (expectedHttpConsoleErrors !== 0) errors.push('[runtime] Expected dense-region HTTP failure was not observed exactly once.');
      if (osmControl.requestCount < 7) errors.push('[runtime] Earth local-source lifecycle did not exercise every bounded request path.');
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
    if (screenshotDirectory && ['earth', 'motorcycle'].includes(demo.name)) {
      mkdirSync(screenshotDirectory, { recursive: true });
      await page.screenshot({
        path: path.join(screenshotDirectory, `${demo.name}.png`),
        type: 'png'
      });
    }

    return errors;
  } finally {
    await page.close();
  }
}

async function main() {
  checkDocsBuild();

  const server = await startServer();
  runtimeGeodataApp = await buildGeodataApp({
    config: loadGeodataConfig({
      NODE_ENV: 'test',
      GEODATA_OVERPASS_URL: 'https://overpass.runtime-smoke.invalid/interpreter',
      GEODATA_CORS_ORIGINS: baseUrl,
      GEODATA_USER_AGENT: 'PeerCompute-Runtime-Smoke/1.0 (+https://github.com/MetaverseJS/peercompute)'
    }),
    clock: () => Date.parse('2026-08-23T23:00:00Z'),
    fetchImpl: async () => responseForJson(createAnchorageOverpassFixture()),
    processInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      uptime: () => 1
    }
  });
  const browser = await chromium.launch({
    ...(chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {}),
    headless: true,
    args: ['--enable-features=WebGPU', '--enable-unsafe-webgpu']
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    geolocation: { longitude: -149.895, latitude: 61.2205 },
    permissions: ['geolocation']
  });

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
    await runtimeGeodataApp.close();
    runtimeGeodataApp = null;
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
