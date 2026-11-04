import assert from 'node:assert/strict';
import { createServer } from 'node:https';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { mkdir, readFile, realpath, stat, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const prefix = '/peercompute/';
const relayConfigUrl = 'https://secretworkshop.net/peercompute/config/relay-config.json';
const route = (id, pathname, network = 'local-only', extra = {}) => Object.freeze({ id, pathname, network, ...extra });

// Seventeen overview cards, five additional built HTML entries, and overview.
// Network-free demos deliberately have no relay-connect acceptance condition.
export const PAGES_ROUTES = Object.freeze([
  route('overview', '', 'none'),
  route('inference', 'inference/', 'automatic', { isolation: true }),
  route('cubechat', 'cubechat/', 'automatic', { isolation: true }),
  route('universes', 'universes/'),
  route('multiscale', 'multiscale/', 'opt-in'),
  route('planetgen', 'planetgen/'),
  route('wxglobe', 'wxglobe/'),
  route('earth', 'earth/', 'local-only', { isolation: true }),
  route('motorcycle', 'motorcycle/', 'automatic'),
  route('netviz', 'netviz/', 'opt-in'),
  route('fano-reactor', 'fano-reactor/'),
  route('schrodinger', 'schrodinger/', 'opt-in'),
  route('sneakywoods', 'sneakywoods/', 'automatic'),
  route('daddygo', 'daddygo/', 'automatic'),
  route('webgpuphys-toychest', 'webgpuphys/demos/toychest.html'),
  route('webgpuphys-mpm-visual', 'webgpuphys/demos/mpm-visual.html'),
  route('webgpuphys-ppf-contact', 'webgpuphys/demos/ppf-contact-solver.html'),
  route('hyperborea', 'hyperborea/', 'automatic'),
  route('hyperborea-cb', 'hyperborea/cb.html', 'automatic'),
  route('webgpuphys-index', 'webgpuphys/'),
  route('webgpuphys-gallery', 'webgpuphys/demos/'),
  route('webgpuphys-ppf-cubic', 'webgpuphys/demos/ppf-cubic-barrier.html'),
  route('webgpuphys-mpm-headless', 'webgpuphys/demos/mpm-headless.html'),
]);

const mime = new Map(Object.entries({
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json', '.ktx2': 'image/ktx2', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.txt': 'text/plain', '.xml': 'application/xml',
}));
const inside = (root, file) => { const relative = path.relative(root, file); return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative); };
const timestamp = () => new Date().toISOString();
const errorText = (error) => error?.stack ?? String(error);
async function bounded(promise, timeoutMs, label) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
  })]); } finally { clearTimeout(timer); }
}

/** A real static Pages-shaped server: no SPA fallback, source fixtures, or
 * isolation headers. The application must establish isolation itself. */
export async function createPagesServer({ docsRoot, host = '127.0.0.1', publicHost, port = 0, cert, key }) {
  const root = await realpath(docsRoot);
  const server = createServer({ cert, key }, async (request, response) => {
    const finish = (status) => { response.writeHead(status); response.end(); };
    try {
      if (!['GET', 'HEAD'].includes(request.method)) return finish(405);
      const pathname = decodeURIComponent(new URL(request.url, 'https://localhost').pathname);
      if (!pathname.startsWith(prefix) || pathname.includes('\0')) return finish(404);
      let file = path.resolve(root, pathname.slice(prefix.length));
      if (!inside(root, file)) return finish(404);
      let info = await stat(file);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) {
          response.writeHead(301, { location: `${pathname}/${new URL(request.url, 'https://localhost').search}` });
          response.end(); return;
        }
        file = path.join(file, 'index.html'); info = await stat(file);
      }
      file = await realpath(file);
      if (!info.isFile() || !inside(root, file)) return finish(404);
      response.writeHead(200, { 'content-type': mime.get(path.extname(file).toLowerCase()) ?? 'application/octet-stream',
        'content-length': info.size, 'cache-control': 'no-cache' });
      if (request.method === 'HEAD') return response.end();
      const stream = createReadStream(file);
      stream.on('error', () => response.destroy()); response.on('close', () => stream.destroy()); stream.pipe(response);
    } catch (error) { if (!response.headersSent) finish(['ENOENT', 'ENOTDIR', 'URIError'].includes(error.code ?? error.name) ? 404 : 500); else response.destroy(); }
  });
  server.listen(port, host); await once(server, 'listening');
  return { server, baseUrl: `https://${publicHost || (host === '0.0.0.0' ? '127.0.0.1' : host)}:${server.address().port}${prefix}`,
    async close() { server.closeAllConnections(); await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); } };
}

function positiveInteger(value, fallback, maximum = 600000) {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > maximum) throw new Error(`Invalid positive integer: ${value}`);
  return number;
}

export function pagesOptions(env = process.env) {
  const selected = String(env.PAGES_ROUTES ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  const matches = (definition, key) => definition.id === key || definition.pathname === key || definition.pathname.split('/')[0] === key;
  for (const name of selected) assert(PAGES_ROUTES.some((definition) => matches(definition, name)), `Unknown Pages route: ${name}`);
  const outputDir = path.resolve(env.PAGES_OUTPUT_DIR ?? path.join(tmpdir(), `peercompute-pages-${Date.now()}`));
  assert(!inside(repo, outputDir), 'Runtime evidence must be outside the repository');
  const args = env.PAGES_CHROME_ARGS ? JSON.parse(env.PAGES_CHROME_ARGS) : ['--enable-unsafe-webgpu'];
  assert(Array.isArray(args) && args.every((arg) => typeof arg === 'string'), 'PAGES_CHROME_ARGS must be a JSON string array');
  return { docsRoot: path.resolve(env.PAGES_DOCS_ROOT ?? path.join(repo, 'docs')), outputDir,
    routes: selected.length ? PAGES_ROUTES.filter((definition) => selected.some((key) => matches(definition, key))) : PAGES_ROUTES,
    headless: env.PAGES_HEADED !== '1', host: env.PAGES_HOST ?? '127.0.0.1', publicHost: env.PAGES_PUBLIC_HOST || null, port: Number(env.PAGES_PORT ?? 0),
    baseUrl: env.PAGES_BASE_URL || null,
    certPath: env.PAGES_TLS_CERT ?? path.join(homedir(), '.cache/peercompute-preview/tls/fastbox.crt'),
    keyPath: env.PAGES_TLS_KEY ?? path.join(homedir(), '.cache/peercompute-preview/tls/fastbox.key'),
    executablePath: env.PAGES_CHROME_PATH ?? env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ?? (existsSync('/opt/google/chrome/chrome') ? '/opt/google/chrome/chrome' : undefined),
    args: [...args, '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    timeoutMs: positiveInteger(env.PAGES_ROUTE_TIMEOUT_MS, 180000), settleMs: positiveInteger(env.PAGES_SETTLE_MS, 2500),
    desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 },
  };
}

// Runs inside the actual page. Keep observations narrow: no user chats, prompts,
// storage contents, broad getState dumps, or material packet publication.
export function sceneSnapshot(id) {
  const text = (selector) => document.querySelector(selector)?.textContent?.trim() ?? '';
  const visible = (selector) => [...document.querySelectorAll(selector)].some((element) => {
    const box = element.getBoundingClientRect(); return box.width > 4 && box.height > 4 && getComputedStyle(element).visibility !== 'hidden';
  });
  const base = { title: document.title, ready: false,
    canvases: [...document.querySelectorAll('canvas')].map((canvas) => ({ width: canvas.width, height: canvas.height,
      visible: canvas.getBoundingClientRect().width > 4 && canvas.getBoundingClientRect().height > 4 })),
    scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth };
  const canvas = visible('canvas');
  if (id === 'overview') return { ...base, ready: document.querySelectorAll('[data-demo-dir]').length === 17,
    cardCount: document.querySelectorAll('[data-demo-dir]').length };
  if (id === 'inference') {
    const runtime = window.inferencePanel?.runtime;
    return { ...base, ready: !!runtime && visible('.pc-inference-panel'),
      models: runtime?.listModelSources?.().length ?? 0,
      services: runtime ? Object.fromEntries(Object.entries(runtime.services).map(([key, service]) => [key, service.getStatus().status])) : null,
      networkSummary: text('.pc-network-summary') };
  }
  if (id === 'earth' || id === 'wxglobe') {
    const state = (id === 'earth' ? window.__earthDemo : window.__wxglobe)?.getState?.();
    return { ...base, ready: !!state?.ready && state.frameCount > 0 && state.terrain?.loaded > 0 && !state.fatalError && !state.sceneRenderError,
      frameCount: state?.frameCount, terrainLoaded: state?.terrain?.loaded, terrainStatus: state?.terrainStatus,
      fatalError: state?.fatalError, renderErrors: state?.sceneRenderErrorCount, geodataConfigured: state?.geodataConfigured,
      materialType: state?.materialType, providerType: state?.terrainProviderType,
      osmDeferred: state?.osmTelemetry?.broadViewDeferral?.active, imageryLayerCount: state?.imageryLayerCount };
  }
  if (id === 'motorcycle') {
    const state = window.__motorcycleDemo?.getState?.();
    return { ...base, ready: !!state?.overview?.ready && state.overview.renderedFrames > 0 && !state.fatalError,
      frameCount: state?.frameCount, displayMode: state?.displayMode, overviewFrames: state?.overview?.renderedFrames,
      fatalError: state?.fatalError, geodataConfigured: state?.geodataConfigured, osmStatus: state?.osmStatus,
      modelAssetStatus: state?.modelAsset?.status, modelVerified: state?.modelAsset?.verification?.sha256,
      presence: state?.overview?.players && { status: state.overview.players.status, connected: state.overview.players.connected,
        error: state.overview.players.error, publishingLocation: state.overview.players.publishingLocation } };
  }
  if (id === 'multiscale') return { ...base, ready: canvas && !!window.__multiscaleDemo,
    network: window.__multiscaleDemo?.getPeerNetworkStatus?.() };
  if (id === 'schrodinger') {
    const state = window.__schrodingerDemo?.getState?.();
    return { ...base, ready: canvas && state?.orbitalStats?.status === 'webgpu-grid-ready'
      && Number.isFinite(state?.radialEigenstate?.energyEv) && !/pending|unavailable/.test(state?.radialEigenstate?.status ?? 'pending'),
      orbitalStatus: state?.orbitalStats?.status, webgpuStatus: state?.webgpuStatus, peerStatus: state?.peerStatus,
      radialStatus: state?.radialEigenstate?.status, energyEv: state?.radialEigenstate?.energyEv };
  }
  if (id === 'netviz') return { ...base, ready: !!window.__NETVIZ__ && visible('#app,canvas,svg'),
    connectionState: window.__NETVIZ__?.getStatus?.().connectionState };
  if (id === 'fano-reactor') return { ...base, ready: !!text('#product-label') && !!text('#delta-badge') && !!text('#bond-detail'), product: text('#product-label') };
  if (id === 'planetgen') return { ...base, ready: canvas && /map.*steps/.test(text('#status')) && !document.querySelector('#regen')?.disabled, status: text('#status') };
  if (id === 'webgpuphys-index' || id === 'webgpuphys-gallery') return { ...base, ready: document.querySelectorAll('a[href]').length >= 2 };
  if (id.startsWith('webgpuphys-')) {
    const error = text('#error'), status = text('#status'), particles = Number(text('#particleCount')), fps = Number(text('#fps'));
    const headless = id === 'webgpuphys-mpm-headless', mpm = id === 'webgpuphys-mpm-visual';
    return { ...base, ready: !error && (headless ? window.__mpmStarted === true : mpm ? canvas && !/init|error|fail/i.test(status) : canvas && particles > 0 && fps > 0),
      error, status, particles, fps, mpmStarted: window.__mpmStarted, mpmSteps: window.__mpmStepsRan };
  }
  if (['cubechat', 'sneakywoods', 'hyperborea', 'hyperborea-cb'].includes(id)) {
    const game = id.startsWith('hyperborea') ? 'hyperborea' : id;
    const position = window.__PEERCOMPUTE_BOT_BRIDGES__?.[game]?.snapshot?.()?.localPosition;
    return { ...base, ready: canvas && !!position && ['x', 'y', 'z'].every((key) => Number.isFinite(position[key])),
      localPosition: position, loading: text('#loading'), loadingVisible: visible('#loading') };
  }
  if (id === 'daddygo') return { ...base, ready: canvas && !!window.__daddygoTest?.localPeerId && visible('#toggleObstacles'),
    obstacleControl: text('#toggleObstacles') };
  if (id === 'universes') return { ...base, ready: canvas && Number(text('#objects').replaceAll(',', '')) > 0 && visible('#sim-toggle-btn'),
    objects: text('#objects'), fps: text('#fps') };
  return { ...base, ready: canvas && !/failed to initialize|initialization failed/i.test(text('#loading')), loading: text('#loading') };
}

// Use the same controls a visitor uses, and read only existing diagnostic
// snapshots. Never manufacture game state, scores, model output, or peers.
async function basicInteraction(page, id) {
  if (['cubechat', 'sneakywoods', 'hyperborea', 'hyperborea-cb'].includes(id)) {
    const game = id.startsWith('hyperborea') ? 'hyperborea' : id;
    let started = null;
    if (id === 'cubechat') {
      const loading = page.locator('#loading');
      if (await loading.isVisible()) await loading.click();
      await loading.waitFor({ state: 'hidden' });
      started = true;
      if (await page.locator('#settings-menu').isVisible()) await page.locator('#close-settings').click();
      await page.locator('#settings-menu').waitFor({ state: 'hidden' });
    }
    const position = () => page.evaluate((key) => {
      const value = window.__PEERCOMPUTE_BOT_BRIDGES__?.[key]?.snapshot?.()?.localPosition;
      return value ? { x: value.x, y: value.y, z: value.z } : null;
    }, game);
    // Blur controls without clicking the scene: SneakyWoods maps clicks to attack.
    await page.evaluate(() => document.activeElement?.blur?.());
    const before = await position();
    try { await page.keyboard.down('w'); await page.waitForTimeout(800); }
    finally { await page.keyboard.up('w'); }
    const after = await position();
    assert(before && after && Object.values(after).every(Number.isFinite), 'Player position is unavailable');
    const horizontalDistance = Math.hypot(after.x - before.x, after.z - before.z);
    assert(horizontalDistance > 0.01, 'Forward key did not move the player');
    return { action: 'start and move forward', started, before, after, horizontalDistance };
  }
  if (id === 'daddygo') {
    const button = page.locator('#toggleObstacles'), before = await button.textContent();
    await button.click(); const changed = await button.textContent();
    assert.notEqual(changed, before, 'Obstacle control did not change');
    await button.click(); assert.equal(await button.textContent(), before, 'Obstacle control did not restore');
    return { action: 'toggle obstacles and restore', before, changed };
  }
  if (id === 'universes') {
    const panel = page.locator('#controls-panel'), wasOpen = await panel.isVisible();
    if (!wasOpen) await page.locator('#sim-toggle-btn').click();
    const button = page.locator('#pause-btn'), before = await button.textContent();
    await button.click(); const changed = await button.textContent();
    assert.notEqual(changed, before, 'Pause control did not change');
    await button.click(); assert.equal(await button.textContent(), before, 'Simulation did not resume');
    if (!wasOpen) await page.locator('#sim-toggle-btn').click();
    return { action: 'pause simulation and resume', before, changed };
  }
  if (id === 'fano-reactor') {
    await page.locator('[data-mode-tab="fano-map"]').click();
    await page.locator('[data-mode-panel="fano-map"]').waitFor({ state: 'visible' });
    const elements = await page.locator('#fano-map > *').count();
    assert(elements > 0, 'Fano map is empty');
    await page.locator('[data-mode-tab="bond-lab"]').click();
    await page.locator('[data-mode-panel="bond-lab"]').waitFor({ state: 'visible' });
    return { action: 'show Fano map and return to bond lab', elements };
  }
  if (id === 'schrodinger') {
    const before = await page.evaluate(() => window.__schrodingerDemo.getState().rotating);
    await page.locator('#rotate-toggle').click();
    const changed = await page.evaluate(() => window.__schrodingerDemo.getState().rotating);
    assert.equal(changed, !before, 'Orbital rotation toggle did not change');
    await page.locator('#rotate-toggle').click();
    assert.equal(await page.evaluate(() => window.__schrodingerDemo.getState().rotating), before, 'Orbital rotation did not restore');
    return { action: 'toggle orbital rotation and restore', before, changed };
  }
  return { action: 'none', scope: 'scene and route-specific readiness only' };
}

async function gpuSnapshot(browser, page) {
  const session = await browser.newBrowserCDPSession();
  let system;
  try {
    const info = await bounded(session.send('SystemInfo.getInfo'), 5000, 'Browser GPU diagnostics');
    system = { devices: info.gpu?.devices, featureStatus: info.gpu?.featureStatus };
  } finally { await session.detach(); }
  let adapter;
  try {
    adapter = await bounded(page.evaluate(async () => {
      if (!navigator.gpu) return { available: false, reason: 'navigator.gpu is unavailable' };
      const value = await navigator.gpu.requestAdapter();
      if (!value) return { available: false, reason: 'requestAdapter returned null' };
      return { available: true, info: { vendor: value.info?.vendor, architecture: value.info?.architecture,
        device: value.info?.device, description: value.info?.description, isFallbackAdapter: value.info?.isFallbackAdapter },
        features: [...value.features] };
    }), 5000, 'Page WebGPU adapter diagnostics');
  } catch (error) { adapter = { available: null, error: error.message }; }
  return { system, adapter, scope: 'Capabilities only; no device requested and no workload dispatched by this probe' };
}

async function daddygoLayout(page) {
  const layout = await page.evaluate(() => {
    const canvas = document.querySelector('#canvas3d');
    const rect = canvas.getBoundingClientRect();
    return { viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth,
      devicePixelRatio, canvas: { width: rect.width, height: rect.height, backingWidth: canvas.width, backingHeight: canvas.height },
      controls: ['#video-container', '#instructions', '#toggleObstacles'].map((selector) => {
        const box = document.querySelector(selector).getBoundingClientRect();
        return { selector, left: box.left, right: box.right, top: box.top, bottom: box.bottom };
      }) };
  });
  assert(layout.scrollWidth <= layout.viewport.width, 'DaddyGo overflows the viewport');
  assert(Math.abs(layout.canvas.width - layout.viewport.width) <= 1, 'DaddyGo canvas CSS width did not resize');
  assert(Math.abs(layout.canvas.backingWidth - layout.canvas.width * layout.devicePixelRatio) <= 1, 'DaddyGo canvas backing width did not resize');
  assert(Math.abs(layout.canvas.backingHeight - layout.canvas.height * layout.devicePixelRatio) <= 1, 'DaddyGo canvas backing height did not resize');
  assert(layout.controls.every((box) => box.left >= 0 && box.top >= 0
    && box.right <= layout.viewport.width + 1 && box.bottom <= layout.viewport.height + 1), 'DaddyGo controls extend outside the viewport');
  return layout;
}

export function networkSnapshot({ expectedPeers }) {
  const normalize = (connection) => ({ remotePeer: connection.remotePeer?.toString?.() ?? '',
    address: connection.remoteAddr?.toString?.() ?? connection.address ?? '', status: connection.status,
    encryption: connection.encryption ?? null, limited: !!connection.limits });
  const managers = [...(window.__PEERCOMPUTE_KERNELS__ ?? []).map((kernel) => ({
    label: `${kernel.config?.gameId}:${kernel.config?.roomId}`, manager: kernel.getNetworkManager?.(),
  })), { label: 'inference', manager: window.inferencePanel?.runtime.networkManager }].filter(({ manager }) => manager);
  const nodes = managers.map(({ label, manager }) => ({ label, isConnected: manager.isConnected,
    peerId: manager.peerId, bootstrapPeers: [...(manager.bootstrapPeerIds ?? [])],
    connections: (manager.getLibp2pNode?.()?.getConnections?.() ?? []).map(normalize) }));
  const road = window.__motorcycleDemo?.getState?.().overview?.players;
  if (road) nodes.push({ label: 'roadvector-presence', isConnected: road.connected, status: road.status,
    error: road.error, connections: road.connections ?? [], proofExposed: Array.isArray(road.connections) });
  const accepted = nodes.flatMap((node) => node.connections.filter((connection) => connection.status === 'open'
    && expectedPeers.includes(connection.remotePeer)
    && ['/noise', '/tls/1.0.0', 'native'].includes(connection.encryption)).map((connection) => ({ node: node.label, ...connection })));
  return { nodes, accepted, relayConnected: accepted.length > 0 };
}

async function isolationSnapshot(page, initializeWorker = false) {
  if (initializeWorker) await page.evaluate(() => window.inferencePanel.runtime.computeManager.initialize());
  const readCapabilities = () => {
    let memory64 = false;
    try { new WebAssembly.Memory({ initial: 0n, maximum: 1n, shared: true, address: 'i64' }); memory64 = true; } catch { /* Report absence. */ }
    return { crossOriginIsolated, sharedArrayBuffer: typeof SharedArrayBuffer === 'function',
      jspi: typeof WebAssembly.Suspending === 'function' && typeof WebAssembly.promising === 'function', memory64 };
  };
  const documentState = await page.evaluate(() => ({ status: window.__peercomputeIsolation ?? null,
    crossOriginIsolated, sharedArrayBuffer: typeof SharedArrayBuffer === 'function',
    controller: navigator.serviceWorker?.controller?.scriptURL ?? null }));
  const workers = [];
  for (const worker of page.workers()) {
    try { workers.push({ url: worker.url(), ...await worker.evaluate(readCapabilities) }); }
    catch (error) { workers.push({ url: worker.url(), error: error.message }); }
  }
  return { document: documentState, workers };
}

async function runRoute(definition, options, baseUrl, expectedPeers) {
  const result = { id: definition.id, pathname: definition.pathname, networkPolicy: definition.network,
    startedAt: timestamp(), passed: false, failures: [], screenshots: [], consoleErrors: 0,
    warnings: 0, gpuLossWarnings: 0, pageErrors: 0, httpErrors: 0, failedRequests: 0, websocketErrors: 0, cleanupErrors: [], samples: [], interactions: [] };
  const eventPath = path.join(options.outputDir, `${definition.id}.events.jsonl`);
  result.events = eventPath;
  const events = createWriteStream(eventPath, { flags: 'w' });
  let browser, context, page, closing = false, eventError, watchdog;
  events.on('error', (error) => { eventError = error; });
  const event = (type, data) => events.write(`${JSON.stringify({ at: timestamp(), type, duringCleanup: closing, ...data })}\n`);
  const began = Date.now();
  const remaining = () => Math.max(0, options.timeoutMs - (Date.now() - began));
  const save = () => writeFile(path.join(options.outputDir, `${definition.id}.json`), JSON.stringify(result, null, 2));
  const attempt = async (label, action) => {
    console.log(`[pages] ${definition.id}: ${label}`); event('phase', { label });
    try { return await action(); } catch (error) { result.failures.push({ phase: label, error: errorText(error) }); return null; }
    finally { await save(); }
  };
  const sample = async (label) => { const data = await page.evaluate(sceneSnapshot, definition.id); result.samples.push({ label, at: timestamp(), ...data }); return data; };
  const ready = async () => {
    // Leave time to capture actual failures before the whole-route watchdog.
    const deadline = Date.now() + Math.min(60000, Math.max(0, remaining() - 20000));
    do {
      try { if ((await sample('readiness')).ready) return true; }
      catch (error) {
        // A cold isolation bootstrap may perform its one real document reload.
        if (!/Execution context was destroyed|Cannot find context|most likely because of a navigation/.test(error.message)) throw error;
      }
      if (Date.now() >= deadline) break;
      await page.waitForTimeout(Math.min(500, deadline - Date.now()));
    } while (Date.now() < deadline);
    throw new Error('Scene readiness timed out; remaining route time reserved for failure evidence');
  };
  const screenshot = async (label, viewport) => {
    if (viewport) { await page.setViewportSize(viewport); await page.waitForTimeout(400); }
    const file = path.join(options.outputDir, `${definition.id}-${label}.png`);
    const bytes = await page.screenshot({ path: file, timeout: Math.max(1, Math.min(5000, remaining())) });
    result.screenshots.push({ file, viewport: viewport ?? page.viewportSize(), bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex') });
    await sample(label);
  };
  try {
    browser = await chromium.launch({ executablePath: options.executablePath, headless: options.headless, args: options.args });
    watchdog = setTimeout(() => {
      result.failures.push({ phase: 'route deadline', error: `Exceeded ${options.timeoutMs}ms; closing owned browser` });
      void browser.close().catch((error) => result.cleanupErrors.push(errorText(error)));
    }, remaining());
    context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: options.desktop,
      permissions: definition.id === 'cubechat' ? ['camera', 'microphone'] : [] });
    page = await context.newPage(); page.setDefaultTimeout(5000); page.setDefaultNavigationTimeout(60000);
    page.on('console', (message) => { const type = message.type(); event('console', { level: type, text: message.text(), location: message.location() });
      if (!closing && type === 'error') result.consoleErrors++;
      if (!closing && type === 'warning') { result.warnings++; if (/CONTEXT_LOST_WEBGL|context lost|device lost/i.test(message.text())) result.gpuLossWarnings++; } });
    page.on('pageerror', (error) => { event('pageerror', { error: errorText(error) }); if (!closing) result.pageErrors++; });
    page.on('request', (request) => event('request', { method: request.method(), resourceType: request.resourceType(), url: request.url() }));
    page.on('response', (response) => { event('response', { url: response.url(), status: response.status(), fromServiceWorker: response.fromServiceWorker(),
      contentType: response.headers()['content-type'], coop: response.headers()['cross-origin-opener-policy'], coep: response.headers()['cross-origin-embedder-policy'] });
      if (!closing && response.status() >= 400) result.httpErrors++; });
    page.on('requestfailed', (request) => { event('requestfailed', { url: request.url(), failure: request.failure(), resourceType: request.resourceType() }); if (!closing) result.failedRequests++; });
    page.on('websocket', (socket) => { event('websocket', { url: socket.url() }); socket.on('socketerror', (error) => {
      event('websocket-error', { url: socket.url(), error }); if (!closing) result.websocketErrors++;
    });
      socket.on('close', () => event('websocket-close', { url: socket.url() })); });
    const url = new URL(definition.pathname, baseUrl);
    if (['cubechat', 'daddygo'].includes(definition.id) || definition.id.startsWith('hyperborea')) url.searchParams.set('e2e', '1');
    result.url = url.href;
    await attempt('cold navigation', () => page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: Math.min(60000, remaining()) }));
    const sceneReady = await attempt('scene readiness', ready);
    if (!sceneReady) await attempt('failure diagnostic screenshot', () => screenshot('failure'));
    await attempt('settle and observe', async () => { await page.waitForTimeout(Math.min(options.settleMs, remaining())); await sample('settled'); });
    if (sceneReady) await attempt('basic visitor interaction', async () => {
      result.interactions.push({ at: timestamp(), ...await basicInteraction(page, definition.id) });
      await sample('after interaction');
    });
    else result.interactions.push({ action: 'skipped', reason: 'Scene did not become ready; failure preserved' });

    if (definition.network === 'opt-in') await attempt('explicit network opt-in', async () => {
      if (definition.id === 'netviz') await page.evaluate(() => { window.__NETVIZ__.connect(); });
      else if (definition.id === 'multiscale') await page.evaluate(() => { window.__multiscaleDemo.startPeerNetwork().catch(() => {}); });
      else await page.locator('#peercompute-attach').click();
    });
    if (['automatic', 'opt-in'].includes(definition.network)) await attempt('authenticated SecretWorkshop relay', async () => {
      const deadline = Date.now() + Math.max(0, remaining() - 12000);
      do {
        result.network = await page.evaluate(networkSnapshot, { expectedPeers });
        if (result.network.relayConnected) return;
        if (Date.now() >= deadline) break;
        await page.waitForTimeout(Math.min(500, deadline - Date.now()));
      } while (Date.now() < deadline);
      throw new Error('No open authenticated connection to an approved SecretWorkshop relay was observed');
    });

    for (const [label, viewport] of [['desktop', options.desktop], ['mobile', options.mobile]]) {
      await attempt(`${label} screenshot`, () => screenshot(label, viewport));
      if (definition.id === 'daddygo') await attempt(`${label} responsive game layout`, async () => {
        result.interactions.push({ action: `${label} responsive game layout`, ...await daddygoLayout(page) });
        if (label === 'mobile') result.interactions.push({ viewport: label, ...await basicInteraction(page, definition.id) });
      });
    }
    if (definition.id === 'daddygo') await attempt('restore desktop game layout', async () => {
      await page.setViewportSize(options.desktop); await page.waitForTimeout(400);
      result.interactions.push({ action: 'restored desktop game layout', ...await daddygoLayout(page) });
    });
    await attempt('GPU capability diagnostics', async () => { result.gpu = await gpuSnapshot(browser, page); });
    if (definition.isolation) {
      await attempt('cold document and worker isolation', async () => {
        result.coldIsolation = await isolationSnapshot(page, definition.id === 'inference');
        assert(result.coldIsolation.document.crossOriginIsolated, 'Cold document is not cross-origin isolated');
        assert(result.coldIsolation.document.sharedArrayBuffer, 'SharedArrayBuffer is unavailable');
        if (definition.id === 'inference') {
          assert(result.coldIsolation.workers.length > 0, 'Managed inference worker did not start');
          assert(result.coldIsolation.workers.every((worker) => worker.crossOriginIsolated && worker.sharedArrayBuffer && worker.jspi && worker.memory64), 'Managed worker lacks isolated GGUF prerequisites');
        }
      });
      await attempt('warm isolation reload', async () => {
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 }); await ready();
        result.warmIsolation = await isolationSnapshot(page, definition.id === 'inference');
        assert(result.warmIsolation.document.crossOriginIsolated && result.warmIsolation.document.sharedArrayBuffer, 'Warm document isolation did not survive reload');
        if (definition.id === 'inference') assert(result.warmIsolation.workers.length > 0 && result.warmIsolation.workers.every((worker) => worker.crossOriginIsolated && worker.sharedArrayBuffer), 'Warm managed worker isolation failed');
      });
      if (definition.id !== 'inference') await attempt('embedded model panel startup', async () => {
        await page.getByRole('button', { name: '> LOCAL AGENT', exact: true }).click();
        await page.locator('.pc-inference-panel').waitFor({ state: 'visible', timeout: Math.min(60000, remaining()) });
        await page.getByRole('button', { name: 'CLOSE / UNLOAD', exact: true }).click();
        await page.locator('.pc-inference-panel').waitFor({ state: 'detached' });
      });
    }
  } catch (error) { result.failures.push({ phase: 'route setup', error: errorText(error) }); }
  finally {
    closing = true; clearTimeout(watchdog);
    if (page && !page.isClosed()) {
      try { await bounded(page.evaluate(async () => {
        if (window.inferencePanel) await window.inferencePanel.dispose();
        for (const kernel of [...(window.__PEERCOMPUTE_KERNELS__ ?? [])].reverse()) await kernel.stop();
        await window.__motorcycleDemo?.dispose?.();
      }), 15000, 'Application cleanup'); } catch (error) { result.cleanupErrors.push(errorText(error)); }
    }
    try { await bounded(context?.close(), 15000, 'Browser context cleanup'); } catch (error) { result.cleanupErrors.push(errorText(error)); }
    try { await bounded(browser?.close(), 15000, 'Browser cleanup'); } catch (error) { result.cleanupErrors.push(errorText(error)); }
    events.end(); await new Promise((resolve) => events.closed ? resolve() : events.once('close', resolve));
    if (eventError) result.cleanupErrors.push(errorText(eventError));
    result.finishedAt = timestamp(); result.durationMs = Date.now() - began;
    result.passed = !result.failures.length && !result.cleanupErrors.length && !result.pageErrors
      && !result.consoleErrors && !result.gpuLossWarnings && !result.httpErrors && !result.failedRequests && !result.websocketErrors;
    await save(); console.log(`[pages] ${definition.id}: ${result.passed ? 'PASS' : 'FAIL'} (${result.durationMs}ms)`);
  }
  return result;
}

export async function runPagesAcceptance(options = pagesOptions()) {
  await mkdir(options.outputDir, { recursive: true });
  const report = { startedAt: timestamp(), scope: 'Built Pages routes, genuine external sources, owned browsers, no model downloads or user-host inference',
    docsRoot: options.docsRoot, chrome: options.executablePath, chromeArgs: options.args, headless: options.headless, routes: [], cleanupErrors: [], passed: false };
  const file = path.join(options.outputDir, 'report.json');
  const save = () => writeFile(file, JSON.stringify(report, null, 2));
  let owned;
  try {
    let baseUrl = options.baseUrl;
    if (!baseUrl) {
      owned = await createPagesServer({ ...options, cert: await readFile(options.certPath), key: await readFile(options.keyPath) });
      baseUrl = owned.baseUrl;
    }
    assert(new URL(baseUrl).protocol === 'https:' && new URL(baseUrl).pathname.endsWith('/'), 'Pages base must be HTTPS with a trailing slash');
    report.baseUrl = baseUrl;
    const pinned = JSON.parse(await readFile(path.join(repo, 'config/relay.json'), 'utf8'));
    const expected = new Set([pinned.relayPeerId].filter(Boolean));
    report.relay = { configUrl: relayConfigUrl };
    try {
      const response = await fetch(relayConfigUrl, { signal: AbortSignal.timeout(15000) });
      assert(response.ok && response.headers.get('content-type')?.includes('application/json'), 'Relay configuration is not successful JSON');
      const config = await response.json();
      for (const address of config.bootstrapPeers ?? []) { const peer = String(address).match(/\/p2p\/([^/]+)/)?.[1]; if (peer) expected.add(peer); }
    } catch (error) { report.relay.configError = errorText(error); }
    report.relay.expectedPeers = [...expected]; await save();
    for (const definition of options.routes) {
      report.routes.push(await runRoute(definition, options, baseUrl, [...expected]));
      await save();
    }
    report.passed = report.routes.length === options.routes.length && report.routes.every((result) => result.passed);
  } catch (error) { report.error = errorText(error); }
  finally {
    try { await owned?.close(); } catch (error) { report.cleanupErrors.push(errorText(error)); }
    report.closedOwnedServer = !owned || !owned.server.listening;
    report.finishedAt = timestamp(); report.passed &&= !report.cleanupErrors.length;
    await save();
  }
  console.log(JSON.stringify({ passed: report.passed, report: file, routes: report.routes.length }));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--list')) console.log(JSON.stringify(pagesOptions().routes, null, 2));
  else runPagesAcceptance().then((report) => { if (!report.passed) process.exitCode = 1; })
    .catch((error) => { console.error(error); process.exitCode = 1; });
}
