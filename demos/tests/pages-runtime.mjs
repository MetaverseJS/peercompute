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
import { MODEL_CATALOG, modelFileUrl } from '../../peercompute/src/peercompute/inference/modelCatalog.js';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const prefix = '/peercompute/';
const relayConfigUrl = 'https://secretworkshop.net/peercompute/config/relay-config.json';
const startupModelId = 'smolvlm-256m-q4';
const startupModelUrls = new Set(MODEL_CATALOG[startupModelId].files.map((file) => modelFileUrl(startupModelId, file.path)));
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
  route('earth', 'earth/', 'automatic', { isolation: true }),
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
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml',
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
  const allowModelStartup = env.PAGES_ALLOW_MODEL_STARTUP === '1';
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
    allowModelStartup, gpuLifecycle: env.PAGES_GPU_LIFECYCLE === '1',
    reducedPhysics: env.PAGES_REDUCED_PHYSICS === '1',
    timeoutMs: positiveInteger(env.PAGES_ROUTE_TIMEOUT_MS, allowModelStartup ? 600000 : 180000), settleMs: positiveInteger(env.PAGES_SETTLE_MS, 2500),
    desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 },
  };
}

function modelRequestInfo(request) {
  let modelSource = false, allowed = false;
  for (let link = request; link; link = link.redirectedFrom()) {
    const host = new URL(link.url()).hostname;
    if (host === 'huggingface.co' || host.endsWith('.huggingface.co') || host === 'hf.co' || host.endsWith('.hf.co')) modelSource = true;
    if (startupModelUrls.has(link.url())) allowed = true;
  }
  return { modelSource, allowed };
}

// Existing standalone and world-host diagnostic accessors expose owned runtimes.
// No model CID or native execution is inferred from DOM readiness alone.
export function modelStartupSnapshot() {
  const panel = document.querySelector('.pc-inference-panel');
  const runtime = window.inferencePanel?.runtime ?? window.__cubechat?.worldAgents?.runtime ?? window.__earthDemo?.agentHost?.runtime;
  const services = runtime ? Object.values(runtime.services)
    : (window.__PEERCOMPUTE_KERNELS__ ?? []).flatMap((kernel) => [...(kernel.getComputeManager?.()?.modelServices ?? [])]);
  const statuses = services.map((service) => service.getStatus());
  const toggles = ['Share with peers', 'Host inference'].map((name) => {
    const label = [...(panel?.querySelectorAll('label') ?? [])].find((element) => element.textContent.trim() === name);
    const input = label?.querySelector('input');
    return { name, checked: input?.checked ?? null, disabled: input?.disabled ?? null, wired: typeof input?.onchange === 'function' };
  });
  const message = panel?.querySelector(':scope > [role="status"]')?.textContent ?? '';
  const startup = runtime?.getStartupModel?.();
  const storedPickerOpen = [...(panel?.querySelectorAll('dialog[open]') ?? [])].some((dialog) =>
    [...dialog.querySelectorAll('[role="tab"][aria-selected="true"]')].some((tab) => tab.textContent.trim() === 'Stored models'));
  return { loading: !!panel?.querySelector('.pc-model-loading[open]'), message,
    sourceKey: startup?.sourceKey ?? null, startupManifestCid: startup?.manifestCid ?? null, storedPickerOpen,
    managementOnly: !!panel?.classList.contains('pc-model-management'),
    controlsReady: [...(panel?.querySelectorAll('.pc-model-toolbar button, .pc-browser-tabs button') ?? [])].some((button) => !button.disabled),
    toggles, statuses, runtimeExposed: !!runtime, proof: services.length ? 'managed service status' : 'DOM-only embedded readiness',
    preferences: runtime?.getPreferences?.() ?? null,
    ready: statuses.length ? statuses.some((state) => state.status === 'ready') : /^Loaded .+\. (?:Send a message\.|Compatible tasks can now use it\.)/.test(message) };
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
    const headless = id === 'webgpuphys-mpm-headless', mpm = id === 'webgpuphys-mpm-visual', mass = Number(text('#mass'));
    return { ...base, ready: !error && (headless ? window.__mpmStarted === true : mpm ? canvas && mass > 0 && fps > 0 && !/init|error|fail/i.test(status) : canvas && particles > 0 && fps > 0),
      error, status, particles, fps, mass, mpmStarted: window.__mpmStarted, mpmSteps: window.__mpmStepsRan };
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
async function basicInteraction(page, id, { reducedPhysics = false } = {}) {
  if (reducedPhysics && ['webgpuphys-toychest', 'webgpuphys-mpm-visual'].includes(id)) {
    const controller = (name) => page.locator('.controller').filter({ has: page.locator('.name', { hasText: new RegExp(`^${name}$`) }) });
    const before = Number(await page.locator('#particleCount').textContent());
    const isMpm = id === 'webgpuphys-mpm-visual';
    const input = controller(isMpm ? 'Particle Count' : 'Object Count').locator('input').last();
    await input.fill(isMpm ? '1000' : '128'); await input.press('Enter'); await input.blur();
    if (isMpm) await controller('Render Mode').locator('select').selectOption({ label: 'Particles' });
    await page.waitForFunction((previous) => {
      const count = Number(document.querySelector('#particleCount')?.textContent);
      return count > 0 && count < previous && Number(document.querySelector('#fps')?.textContent) > 0;
    }, before, { timeout: 15000 });
    await page.waitForTimeout(750);
    const after = Number(await page.locator('#particleCount').textContent());
    const evidence = isMpm ? { mass: await page.locator('#mass').textContent(), momentum: await page.locator('#momentum').textContent() } : {};
    if (isMpm) { assert(Number(evidence.mass) > 0, 'Reduced MPM did not compute mass'); await page.locator('#toggleBtn').click(); }
    else await controller('paused').locator('input[type=checkbox]').check();
    return { action: 'native reduced-count controls, running simulation, then pause for bounded software capture',
      scope: 'Reduced-count visual/interaction qualification only; default-count compute is a separate receipt',
      beforeParticles: before, afterParticles: after, renderMode: isMpm ? 'Particles' : 'default', ...evidence };
  }
  if (id === 'overview') {
    const links = await page.locator('[data-demo-dir]').evaluateAll((elements) => elements.map((element) => ({
      demo: element.dataset.demoDir, href: element.href, title: element.textContent.trim().slice(0, 200), origin: location.origin,
    })));
    assert.equal(links.length, 17, 'Gallery card count changed');
    for (const link of links) {
      const target = new URL(link.href);
      assert.equal(target.origin, link.origin, 'Built gallery points outside the Pages origin');
      assert(target.pathname.startsWith(`${prefix}${link.demo}/`), 'Built gallery target escaped its nested demo path');
      assert(PAGES_ROUTES.some((entry) => `${prefix}${entry.pathname}` === target.pathname), `Gallery route lacks acceptance: ${target.pathname}`);
    }
    return { action: 'validate all gallery destinations including model/IPFS console', links };
  }
  if (['cubechat', 'sneakywoods', 'hyperborea', 'hyperborea-cb'].includes(id)) {
    const game = id.startsWith('hyperborea') ? 'hyperborea' : id;
    let started = null;
    if (id === 'cubechat') {
      const loading = page.locator('#loading');
      if (await loading.isVisible()) await loading.click();
      await loading.waitFor({ state: 'hidden' });
      started = true;
      if (await page.locator('#settings-menu').isVisible()) await page.locator('#settings-menu [data-close-settings]').click();
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

async function systemGpuSnapshot(browser) {
  const session = await browser.newBrowserCDPSession();
  try {
    const info = await bounded(session.send('SystemInfo.getInfo'), 5000, 'Browser GPU diagnostics');
    return { devices: info.gpu?.devices, featureStatus: info.gpu?.featureStatus,
      glRenderer: info.gpu?.auxAttributes?.glRenderer };
  } finally { await session.detach(); }
}

async function gpuSnapshot(browser, page) {
  const system = await systemGpuSnapshot(browser);
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
  })), { label: 'inference', manager: window.inferencePanel?.runtime?.networkManager },
    { label: 'cubechat-room', manager: window.__cubechat?.network?.node?.getNetworkManager?.() },
    { label: 'cubechat-models', manager: window.__cubechat?.worldAgents?.runtime?.networkManager },
    { label: 'earth-models', manager: window.__earthDemo?.agentHost?.runtime?.networkManager }].filter(({ manager }) => manager);
  const nodes = managers.map(({ label, manager }) => ({ label, isConnected: manager.isConnected,
    peerId: manager.peerId, bootstrapPeers: [...(manager.bootstrapPeerIds ?? [])],
    connections: (manager.getLibp2pNode?.()?.getConnections?.() ?? []).map(normalize) }));
  const road = window.__motorcycleDemo?.getState?.().overview?.players;
  if (road) nodes.push({ label: 'roadvector-presence', isConnected: road.connected, status: road.status,
    error: road.error, connections: road.connections ?? [], proofExposed: Array.isArray(road.connections) });
  const accepted = nodes.flatMap((node) => node.connections.filter((connection) => connection.status === 'open'
    && expectedPeers.includes(connection.remotePeer)
    && ['/noise', '/tls/1.0.0', 'native'].includes(connection.encryption)).map((connection) => ({ node: node.label, ...connection })));
  const requiredLabels = window.__cubechat ? ['cubechat-room', 'cubechat-models']
    : window.__earthDemo ? ['earth-models'] : [];
  return { nodes, accepted, requiredLabels, relayConnected: accepted.length > 0
    && requiredLabels.every((label) => accepted.some((entry) => entry.node === label)) };
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
    warnings: 0, gpuLossWarnings: 0, pageErrors: 0, httpErrors: 0, failedRequests: 0, websocketErrors: 0, cleanupErrors: [], samples: [], interactions: [],
    modelStartups: [], modelRequests: [], modelResponses: [], heldModelRequests: [], expectedCancelledModelRequests: [], unexpectedModelRequests: [] };
  const eventPath = path.join(options.outputDir, `${definition.id}.events.jsonl`);
  result.events = eventPath;
  const events = createWriteStream(eventPath, { flags: 'w' });
  let browser, context, page, closing = false, eventError, watchdog, cancellingModel = false;
  const heldModelRoutes = new Map();
  const releaseModelRequests = async () => {
    const pending = [...heldModelRoutes.entries()]; heldModelRoutes.clear();
    await Promise.all(pending.map(async ([route, release]) => {
      try { await route.abort('aborted'); } catch { /* The browser may already acknowledge the real AbortSignal. */ }
      finally { release(); }
    }));
  };
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
      try {
        const state = await sample('readiness');
        if (state.error || state.fatalError) throw new Error(`Scene reported a fatal startup error: ${state.error || state.fatalError}`);
        if (state.ready) return true;
      }
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
    // Software-rendered scenes can take longer to capture than UI interactions.
    // The route watchdog still bounds this operation and preserves failures.
    const bytes = await page.screenshot({ path: file, timeout: Math.max(1, Math.min(30000, remaining())) });
    result.screenshots.push({ file, viewport: viewport ?? page.viewportSize(), bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex') });
    await sample(label);
  };
  const modelStartup = async (label) => {
    cancellingModel = false;
    const budget = Math.min(240000, Math.max(1, remaining() - 20000));
    const deadline = Date.now() + budget;
    const entry = { label, startedAt: timestamp(), modelRequestsBefore: result.modelRequests.length,
      mode: options.allowModelStartup ? 'load bounded SmolVLM package; explicitly select saved package' : 'hold startup model requests before network transfer, cancel through native UI; leave stored packages unloaded' };
    result.modelStartups.push(entry);
    await page.waitForFunction(() => {
      const labels = [...document.querySelectorAll('.pc-inference-panel label')];
      return ['Share with peers', 'Host inference'].every((name) =>
        typeof labels.find((label) => label.textContent.trim() === name)?.querySelector('input')?.onchange === 'function');
    }, null, { timeout: Math.min(60000, budget) });
    // Exercise the actual preference handlers even while Config is hidden.
    // No private embedded runtime, capabilities, or admission state is replaced.
    await page.evaluate(() => {
      const labels = [...document.querySelectorAll('.pc-inference-panel label')];
      for (const name of ['Host inference', 'Share with peers']) {
        const input = labels.find((label) => label.textContent.trim() === name).querySelector('input');
        input.checked = false; input.onchange();
      }
    });
    let cancellationRequested = false, storedChoiceHandled = false;
    do {
      const state = await page.evaluate(modelStartupSnapshot); entry.state = state;
      const preferencesOff = state.toggles.every((input) => !input.checked && !input.disabled);
      if (/^Error:/.test(state.message)) throw new Error(`Automatic model startup failed: ${state.message}`);
      if (options.allowModelStartup && state.sourceKey && state.sourceKey !== `hf:${startupModelId}`) throw new Error(`Unexpected startup model ${state.sourceKey}; only ${startupModelId} is authorized by this gate`);
      if (state.storedPickerOpen && state.controlsReady && preferencesOff && !storedChoiceHandled) {
        const dialog = page.getByRole('dialog', { name: 'Models', exact: true });
        assert.equal(await dialog.getByRole('tab', { name: 'Stored models', exact: true }).getAttribute('aria-selected'), 'true');
        if (options.allowModelStartup && !state.managementOnly) {
          const row = state.startupManifestCid
            ? dialog.locator(`[data-model-cid="${state.startupManifestCid}"]`)
            : dialog.locator('.pc-stored-model').filter({ hasText: MODEL_CATALOG[startupModelId].name });
          await row.waitFor({ state: 'visible' });
          assert.equal(await row.count(), 1, 'Only the owned, bounded SmolVLM saved package may be selected');
          await row.getByRole('checkbox').check();
          entry.explicitStoredSelection = { modelId: startupModelId, manifestCid: await row.getAttribute('data-model-cid') };
          await dialog.getByRole('button', { name: 'Load selected', exact: true }).click();
        } else {
          if (!state.managementOnly) await dialog.getByRole('button', { name: 'Done', exact: true }).click();
          entry.savedPackagesLeftUnloaded = true;
        }
        storedChoiceHandled = true;
        continue;
      }
      if (!options.allowModelStartup && state.loading && !cancellationRequested) {
        cancellingModel = true; cancellationRequested = true;
        await page.locator('.pc-model-loading').getByRole('button', { name: 'Cancel', exact: true }).click();
        await releaseModelRequests();
      }
      if (!state.loading && state.controlsReady && preferencesOff) {
        if (options.allowModelStartup && !state.managementOnly) assert(state.ready, `Automatic model did not become ready: ${state.message}`);
        else {
          assert(!state.ready, 'No-model acceptance unexpectedly loaded a resident model');
          if (state.statuses.length) assert(state.statuses.every((status) => status.status === 'idle'), 'Startup cancellation or saved-package choice left a resident model');
          entry.startupBlockedOrDeferred = !cancellationRequested && !entry.savedPackagesLeftUnloaded;
          assert.equal(heldModelRoutes.size, 0, 'Model requests remain held after startup cleanup');
        }
        if (state.preferences) assert.deepEqual(state.preferences, { sharing: false, hostInference: false });
        entry.cancelled = cancellationRequested; entry.finishedAt = timestamp();
        entry.durationMs = Date.now() - Date.parse(entry.startedAt);
        entry.modelRequestsAfter = result.modelRequests.length;
        if (label === 'warm' && options.allowModelStartup) assert.equal(entry.modelRequestsAfter, entry.modelRequestsBefore, 'Warm stored startup fetched model files again');
        return entry;
      }
      if (Date.now() >= deadline) break;
      await page.waitForTimeout(Math.min(100, deadline - Date.now()));
    } while (Date.now() < deadline);
    throw new Error(`Automatic model startup/cleanup exceeded ${budget}ms`);
  };
  try {
    browser = await chromium.launch({ executablePath: options.executablePath, headless: options.headless, args: options.args });
    watchdog = setTimeout(() => {
      result.failures.push({ phase: 'route deadline', error: `Exceeded ${options.timeoutMs}ms; closing owned browser` });
      void browser.close().catch((error) => result.cleanupErrors.push(errorText(error)));
    }, remaining());
    // Observe browser GPU initialization before a demo requests its adapter.
    // This changes no page capabilities and dispatches no GPU workload.
    result.initialGpu = await systemGpuSnapshot(browser);
    context = await browser.newContext({ ignoreHTTPSErrors: false, viewport: options.desktop,
      permissions: definition.id === 'cubechat' ? ['camera', 'microphone'] : [] });
    if (options.gpuLifecycle) await context.addInitScript(() => {
      const trace = { created: 0, destroyCalls: [], losses: [] }; window.__pagesGpuLifecycle = trace;
      if (!globalThis.GPUAdapter || !globalThis.GPUDevice) return;
      const ids = new WeakMap(), request = GPUAdapter.prototype.requestDevice, destroy = GPUDevice.prototype.destroy;
      GPUAdapter.prototype.requestDevice = async function (...args) {
        const device = await request.apply(this, args), id = ++trace.created; ids.set(device, id);
        device.lost.then((loss) => trace.losses.push({ id, reason: loss.reason, message: loss.message, at: performance.now() }));
        return device;
      };
      GPUDevice.prototype.destroy = function (...args) {
        trace.destroyCalls.push({ id: ids.get(this) ?? null, stack: new Error('Application GPUDevice.destroy').stack, at: performance.now() });
        return destroy.apply(this, args);
      };
    });
    if (definition.isolation) await context.route('https://**/*', async (route) => {
      const request = route.request(), info = modelRequestInfo(request);
      if (info.modelSource && !options.allowModelStartup) {
        if (closing) return route.abort('aborted');
        // Hold before network continuation, preserving native startup/cancellation.
        // No synthetic capabilities, responses, model bytes or stored fixtures.
        result.heldModelRequests.push(request.url());
        event('held-model-request', { url: request.url(), reason: 'No model transfer is authorized in this route gate' });
        await new Promise((resolve) => heldModelRoutes.set(route, resolve)); return;
      }
      if (info.modelSource && !info.allowed) {
        result.unexpectedModelRequests.push(request.url());
        event('rejected-model-request', { url: request.url(), reason: 'Only the pinned SmolVLM 256M startup package is allowed' });
        return route.abort('blockedbyclient');
      }
      return route.continue();
    });
    page = await context.newPage(); page.setDefaultTimeout(5000); page.setDefaultNavigationTimeout(60000);
    page.on('console', (message) => { const type = message.type(); event('console', { level: type, text: message.text(), location: message.location() });
      if (!closing && type === 'error') result.consoleErrors++;
      if (!closing && type === 'warning') { result.warnings++; if (/CONTEXT_LOST_WEBGL|context lost|device lost/i.test(message.text())) result.gpuLossWarnings++; } });
    page.on('pageerror', (error) => { event('pageerror', { error: errorText(error) }); if (!closing) result.pageErrors++; });
    page.on('request', (request) => {
      event('request', { method: request.method(), resourceType: request.resourceType(), url: request.url() });
      const info = modelRequestInfo(request);
      if (info.modelSource) result.modelRequests.push({ at: timestamp(), url: request.url(), allowed: info.allowed });
    });
    page.on('response', (response) => { event('response', { url: response.url(), status: response.status(), fromServiceWorker: response.fromServiceWorker(),
      contentType: response.headers()['content-type'], coop: response.headers()['cross-origin-opener-policy'], coep: response.headers()['cross-origin-embedder-policy'] });
      if (modelRequestInfo(response.request()).modelSource) result.modelResponses.push({ url: response.url(), status: response.status() });
      if (!closing && response.status() >= 400) result.httpErrors++; });
    page.on('requestfailed', (request) => {
      const expectedCancellation = cancellingModel && modelRequestInfo(request).modelSource && request.failure()?.errorText === 'net::ERR_ABORTED';
      event('requestfailed', { url: request.url(), failure: request.failure(), resourceType: request.resourceType(), expectedCancellation });
      if (!closing && expectedCancellation) result.expectedCancelledModelRequests.push(request.url());
      else if (!closing) result.failedRequests++;
    });
    page.on('websocket', (socket) => { event('websocket', { url: socket.url() }); socket.on('socketerror', (error) => {
      event('websocket-error', { url: socket.url(), error }); if (!closing) result.websocketErrors++;
    });
      socket.on('close', () => event('websocket-close', { url: socket.url() })); });
    const url = new URL(definition.pathname, baseUrl);
    if (['cubechat', 'daddygo'].includes(definition.id) || definition.id.startsWith('hyperborea')) url.searchParams.set('e2e', '1');
    result.url = url.href;
    await attempt('cold navigation', () => page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: Math.min(60000, remaining()) }));
    if (definition.id === 'inference') await attempt('cold model startup and cancellation', () => modelStartup('cold'));
    const sceneReady = await attempt('scene readiness', ready);
    if (!sceneReady) await attempt('failure diagnostic screenshot', () => screenshot('failure'));
    await attempt('settle and observe', async () => { await page.waitForTimeout(Math.min(options.settleMs, remaining())); await sample('settled'); });
    if (sceneReady) await attempt('basic visitor interaction', async () => {
      result.interactions.push({ at: timestamp(), ...await basicInteraction(page, definition.id, options) });
      await sample('after interaction');
    });
    else result.interactions.push({ action: 'skipped', reason: 'Scene did not become ready; failure preserved' });

    if (definition.network === 'opt-in') await attempt('explicit network opt-in', async () => {
      if (definition.id === 'netviz') await page.evaluate(() => { window.__NETVIZ__.connect(); });
      else if (definition.id === 'multiscale') await page.evaluate(() => { window.__multiscaleDemo.startPeerNetwork().catch(() => {}); });
      else await page.locator('#peercompute-attach').click();
    });
    if (['automatic', 'opt-in'].includes(definition.network)) await attempt('authenticated SecretWorkshop relay', async () => {
      const deadline = Date.now() + Math.min(45000, Math.max(0, remaining() - 20000));
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
    if (definition.id === 'inference') await attempt('standalone Models tabs', async () => {
      const panel = page.locator('.pc-inference-panel'), library = page.locator('dialog.pc-model-browser');
      for (const [label, viewport] of [['desktop', options.desktop], ['mobile', options.mobile]]) {
        await page.setViewportSize(viewport);
        await panel.locator('.pc-model-toolbar').getByRole('button', { name: 'Models', exact: true }).click();
        await library.getByRole('tab', { name: 'Stored models', exact: true }).click();
        await library.getByRole('button', { name: 'Refresh', exact: true }).and(page.locator(':enabled')).waitFor();
        await screenshot(`models-stored-${label}`);
        await library.getByRole('tab', { name: 'Browse models', exact: true }).click();
        await screenshot(`models-browse-${label}`);
        await library.getByRole('button', { name: 'Done', exact: true }).click();
        await library.waitFor({ state: 'hidden' });
      }
    });
    if (definition.id === 'daddygo') await attempt('restore desktop game layout', async () => {
      await page.setViewportSize(options.desktop); await page.waitForTimeout(400);
      result.interactions.push({ action: 'restored desktop game layout', ...await daddygoLayout(page) });
    });
    await attempt('GPU capability diagnostics', async () => { result.gpu = await gpuSnapshot(browser, page);
      if (options.gpuLifecycle) result.gpuLifecycle = await page.evaluate(() => window.__pagesGpuLifecycle); });
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
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
        if (definition.id === 'inference') await modelStartup('warm');
        await ready();
        result.warmIsolation = await isolationSnapshot(page, definition.id === 'inference');
        assert(result.warmIsolation.document.crossOriginIsolated && result.warmIsolation.document.sharedArrayBuffer, 'Warm document isolation did not survive reload');
        if (definition.id === 'inference') assert(result.warmIsolation.workers.length > 0 && result.warmIsolation.workers.every((worker) => worker.crossOriginIsolated && worker.sharedArrayBuffer), 'Warm managed worker isolation failed');
      });
      if (definition.id !== 'inference') await attempt('world model management', async () => {
        if (definition.id === 'cubechat') {
          await basicInteraction(page, definition.id);
          await page.getByRole('button', { name: 'Settings', exact: true }).click();
          await page.locator('#settings-menu').getByRole('button', { name: 'Residents', exact: true }).click();
          const residents = page.getByRole('dialog', { name: 'Residents', exact: true });
          await residents.locator('summary').filter({ hasText: 'Place a resident' }).click();
          await residents.getByRole('textbox', { name: 'Physical appearance', exact: true }).waitFor();
          assert.equal(await residents.getByRole('checkbox', { name: 'Respond to world chat', exact: true }).isChecked(), false);
          await screenshot('residents-mobile');
          await residents.getByRole('button', { name: 'Done', exact: true }).click();
          await page.getByRole('button', { name: 'Settings', exact: true }).click();
          await page.locator('#settings-menu').getByRole('button', { name: 'Models', exact: true }).click();
        } else {
          await page.getByRole('button', { name: 'Agents', exact: true }).click();
          await page.getByRole('dialog', { name: 'Agents · EarthGrid', exact: true }).getByRole('button', { name: 'Models', exact: true }).click();
        }
        await page.locator('.pc-inference-panel').waitFor({ state: 'attached', timeout: Math.min(60000, remaining()) });
        await modelStartup('embedded');
        const panel = page.locator('.pc-inference-panel');
        const library = page.locator('dialog.pc-model-browser');
        if (!await library.isVisible()) await panel.locator('.pc-model-toolbar').getByRole('button', { name: 'Models', exact: true }).click();
        if (definition.id === 'cubechat') assert.equal(await page.locator('dialog[open]').count(), 1, 'Cube model management opened nested dialogs');
        for (const [label, viewport] of [['desktop', options.desktop], ['mobile', options.mobile]]) {
          await page.setViewportSize(viewport);
          await library.getByRole('tab', { name: 'Stored models', exact: true }).click();
          await library.getByRole('button', { name: 'Refresh', exact: true }).and(page.locator(':enabled')).waitFor();
          const bounds = await library.evaluate((node) => {
            const rect = node.getBoundingClientRect();
            return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, width: innerWidth, height: innerHeight };
          });
          assert(bounds.x >= -1 && bounds.y >= -1 && bounds.right <= bounds.width + 1 && bounds.bottom <= bounds.height + 1, 'Models exceeds viewport');
          await screenshot(`models-stored-${label}`);
          await library.getByRole('tab', { name: 'Browse models', exact: true }).click();
          await screenshot(`models-browse-${label}`);
        }
        if (definition.id === 'cubechat') {
          await library.getByRole('button', { name: 'Config', exact: true }).click();
          assert.equal(await page.locator('dialog[open]').count(), 1, 'Config opened a second model dialog');
          await library.getByRole('spinbutton', { name: 'Model RAM budget (GiB)', exact: true }).waitFor();
          await screenshot('models-config-mobile');
          await library.getByRole('button', { name: 'Done', exact: true }).click();
          await library.getByRole('button', { name: 'Done', exact: true }).click();
          await panel.waitFor({ state: 'detached' });
          assert.equal(await page.locator('dialog[open]').count(), 0, 'Closing Models did not return directly to the world');
        } else {
          await library.getByRole('button', { name: 'Done', exact: true }).click();
          await page.locator('dialog.world-agent-models').getByRole('button', { name: 'Back to world', exact: true }).click();
          await panel.waitFor({ state: 'detached' });
          await page.getByRole('dialog', { name: 'Agents · EarthGrid', exact: true }).getByRole('button', { name: 'Close', exact: true }).click();
        }
      });
    }
  } catch (error) { result.failures.push({ phase: 'route setup', error: errorText(error) }); }
  finally {
    closing = true; clearTimeout(watchdog);
    if (page && !page.isClosed()) {
      try { await bounded(page.evaluate(async () => {
        await window.inferencePanel?.dispose?.();
        await window.__cubechat?.destroy?.();
        await window.__earthDemo?.dispose?.();
        for (const kernel of [...(window.__PEERCOMPUTE_KERNELS__ ?? [])].reverse()) await kernel.stop();
        await window.__motorcycleDemo?.dispose?.();
      }), 15000, 'Application cleanup'); } catch (error) { result.cleanupErrors.push(errorText(error)); }
    }
    try { await bounded(releaseModelRequests(), 5000, 'Held model request cleanup'); } catch (error) { result.cleanupErrors.push(errorText(error)); }
    try { await bounded(context?.close(), 15000, 'Browser context cleanup'); } catch (error) { result.cleanupErrors.push(errorText(error)); }
    try { await bounded(browser?.close(), 15000, 'Browser cleanup'); } catch (error) { result.cleanupErrors.push(errorText(error)); }
    events.end(); await new Promise((resolve) => events.closed ? resolve() : events.once('close', resolve));
    if (eventError) result.cleanupErrors.push(errorText(eventError));
    result.finishedAt = timestamp(); result.durationMs = Date.now() - began;
    result.passed = !result.failures.length && !result.cleanupErrors.length && !result.pageErrors
      && (options.allowModelStartup || result.modelResponses.length === 0)
      && !result.consoleErrors && !result.gpuLossWarnings && !result.httpErrors && !result.failedRequests && !result.websocketErrors && !result.unexpectedModelRequests.length;
    await save(); console.log(`[pages] ${definition.id}: ${result.passed ? 'PASS' : 'FAIL'} (${result.durationMs}ms)`);
  }
  return result;
}

export async function runPagesAcceptance(options = pagesOptions()) {
  await mkdir(options.outputDir, { recursive: true });
  const report = { startedAt: timestamp(), scope: options.allowModelStartup
    ? 'Built Pages routes, owned browsers, automatic pinned SmolVLM 256M startup, sharing/hosting disabled, no user-host inference'
    : 'Built Pages routes, owned browsers, model requests held before transfer and native startup cancellation; no weights or user-host inference',
    allowModelStartup: options.allowModelStartup, allowedStartupModel: options.allowModelStartup ? startupModelId : null,
    reducedPhysics: options.reducedPhysics,
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
