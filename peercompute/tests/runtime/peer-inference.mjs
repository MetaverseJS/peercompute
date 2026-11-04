import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';
import { createHeliaLight } from 'helia';
import { withLibp2pLight } from '@helia/libp2p';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { MODEL_CATALOG } from '../../src/peercompute/inference/modelCatalog.js';
import { normalizeArtifactManifest } from '../../src/peercompute/artifacts/ArtifactManifest.js';

const modelId = 'smolvlm-256m-q4';
const catalog = MODEL_CATALOG[modelId];
const cache = process.env.PEERCOMPUTE_ARTIFACT_CACHE || path.join(homedir(), '.cache/peercompute-artifacts');
const manifest = normalizeArtifactManifest(JSON.parse(await readFile(path.join(cache, 'packages', modelId, 'manifest.json'), 'utf8')));
const cached = JSON.parse(await readFile(path.join(cache, 'packages', modelId, 'descriptor.json'), 'utf8'));
assert.equal(manifest.model.revision, catalog.revision);
const descriptor = { manifestCid: cached.manifestCid, modelId, name: catalog.name, runtime: catalog.model.runtime,
  modalities: catalog.model.modalities, repository: catalog.repository, revision: catalog.revision, totalBytes: catalog.totalBytes };
const sourceRoot = path.join(cache, 'sources', modelId, catalog.revision);
const fixtureRoot = fileURLToPath(new URL('../fixtures/peer-inference/', import.meta.url));
const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-peer-inference-'));
const evidencePath = process.env.PEER_INFERENCE_EVIDENCE_PATH || path.join(tmpdir(), `peercompute-peer-inference-${Date.now()}.json`);
const prefix = '/nested/peer-inference/';
const marker = `PRIVATE_PEER_INFERENCE_${crypto.randomUUID()}`;
const networkOnly = process.env.PEER_INFERENCE_NETWORK_ONLY === '1';
const report = { startedAt: new Date().toISOString(), node: process.version, modelId, descriptor,
  scope: networkOnly ? 'independent-browser encrypted directory and no-host preflight' : 'actual remote WebGPU inference and peer artifact transfer',
  externalRequests: [], externalSockets: [], forbiddenSeedRequests: [], pageErrors: [], workers: {}, requesterWasmRequests: [] };
const contexts = [], pages = [];
let server, relay, hostBrowser, requesterBrowser;
let seedEnabled = true, seedRequests = 0, seedBytes = 0;

async function bounded(promise, message, milliseconds = 20_000) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); })]); }
  finally { clearTimeout(timer); }
}

async function run() {
  const dist = path.join(temporary, 'dist');
  console.log('Building independent peer fixture and managed WebGPU worker');
  await build({ configFile: false, root: fixtureRoot, base: './', logLevel: 'warn', worker: { format: 'es' },
    build: { target: 'esnext', outDir: dist, emptyOutDir: true } });
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.startsWith('/seed/')) {
        const relative = pathname.slice('/seed/'.length);
        const file = manifest.files.find((entry) => entry.path === relative);
        if (!seedEnabled || !file) {
          report.forbiddenSeedRequests.push(pathname); response.writeHead(403); response.end(); return;
        }
        seedRequests += 1;
        response.setHeader('Content-Type', 'application/octet-stream'); response.setHeader('Content-Length', file.size);
        const stream = createReadStream(path.join(sourceRoot, file.path));
        stream.on('data', (bytes) => { seedBytes += bytes.byteLength; });
        stream.on('error', () => response.destroy()); response.on('close', () => stream.destroy()); stream.pipe(response); return;
      }
      if (!pathname.startsWith(prefix)) throw new Error('Wrong fixture prefix');
      const filename = path.resolve(dist, pathname.slice(prefix.length) || 'index.html');
      if (!filename.startsWith(`${dist}${path.sep}`)) throw new Error('Invalid fixture path');
      const bytes = await readFile(filename);
      response.setHeader('Content-Type', filename.endsWith('.wasm') ? 'application/wasm'
        : /\.(?:js|mjs)$/.test(filename) ? 'text/javascript' : 'text/html');
      response.end(bytes);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  relay = withLibp2pLight(createHeliaLight(), {
    addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
    connectionEncrypters: [noise()], streamMuxers: [yamux()],
    services: { identify: identify(), relay: circuitRelayServer({ reservations: { applyDefaultLimit: false } }) },
    connectionManager: { inboundConnectionThreshold: Infinity, maxConnections: 32 }, peerDiscovery: [],
  });
  await relay.start();
  const relayAddress = relay.libp2p.getMultiaddrs()[0].toString();
  const chrome = process.env.CHROME_PATH || '/opt/google/chrome/chrome';
  hostBrowser = await chromium.launch({ executablePath: chrome, headless: true,
    args: networkOnly ? ['--disable-gpu', '--disable-software-rasterizer']
      : ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE',
        '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] });
  const cdp = await hostBrowser.newBrowserCDPSession();
  const gpu = (await cdp.send('SystemInfo.getInfo')).gpu;
  report.hostBrowser = hostBrowser.version(); report.renderer = gpu.auxAttributes.glRenderer;
  if (!networkOnly) assert.match(report.renderer, /NVIDIA|Intel|AMD/);
  requesterBrowser = await chromium.launch({ executablePath: chrome, headless: true,
    args: ['--disable-gpu', '--disable-software-rasterizer'] });
  report.requesterBrowser = requesterBrowser.version();
  report.requesterGpuDisabled = true;

  async function open(browser, label) {
    const context = await browser.newContext(); contexts.push(context);
    report.workers[label] = [];
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) { report.externalRequests.push({ label, url: url.origin + url.pathname }); return route.abort(); }
      if (url.pathname.startsWith('/seed/') && (label !== 'host' || !seedEnabled)) {
        report.forbiddenSeedRequests.push(`${label}:${url.pathname}`); return route.abort();
      }
      if (label !== 'host' && url.pathname.endsWith('.wasm')) report.requesterWasmRequests.push(url.pathname);
      return route.continue();
    });
    const page = await context.newPage(); pages.push(page);
    page.on('pageerror', (error) => { report.pageErrors.push({ label, message: error.message }); console.error(label, error.message); });
    page.on('worker', (worker) => report.workers[label].push(worker.url()));
    page.on('websocket', (socket) => {
      if (!/^ws:\/\/127\.0\.0\.1:\d+\/?$/.test(socket.url())) report.externalSockets.push({ label, url: socket.url() });
    });
    await page.goto(origin + prefix);
    await page.waitForFunction(() => window.peerInferenceAcceptanceReady, null, { timeout: 60_000 });
    await page.evaluate((options) => window.peerInferenceAcceptance.start(options), { relayAddress, label, marker });
    await page.waitForFunction(() => window.peerInferenceAcceptance.info().appAddresses.some((address) => address.includes('/webrtc/')),
      null, { timeout: 30_000 });
    return page;
  }

  const host = await open(hostBrowser, 'host');
  const requester = await open(requesterBrowser, 'requester');
  const receiver = await open(requesterBrowser, 'receiver');
  report.initial = await Promise.all([host, requester, receiver].map((page) => page.evaluate(() => window.peerInferenceAcceptance.info())));
  const hostPeerId = report.initial[0].appPeerId;
  const address = report.initial[0].appAddresses.find((value) => value.includes('/webrtc/'));
  await requester.evaluate((value) => window.peerInferenceAcceptance.dial(value), address);
  await receiver.evaluate((value) => window.peerInferenceAcceptance.dial(value), address);
  assert.equal(new Set(report.initial.map((entry) => entry.appPeerId)).size, 3);
  report.unloaded = await requester.evaluate(() => window.peerInferenceAcceptance.refresh());
  assert.equal(report.unloaded.hosts.length, 0, 'Unloaded peers must not advertise executable models');
  report.noHost = await requester.evaluate((cid) => window.peerInferenceAcceptance.run({ requestId: 'no-host', manifestCid: cid, prompt: 'Hello' }), cached.manifestCid);
  assert(report.noHost.error, 'No host must reject instead of falling back to local inference');
  if (networkOnly) {
    report.requester = await requester.evaluate(() => window.peerInferenceAcceptance.evidence());
    assert.equal(report.requester.compute, null);
    const connection = report.requester.connections.find((entry) => entry.peerId === hostPeerId);
    assert(connection); assert.match(connection.encryption ?? '', /noise|^native$/i);
    assert.deepEqual(report.workers.requester, []); assert.deepEqual(report.workers.host, []);
    assert.equal(seedRequests, 0); assert.deepEqual(report.pageErrors, []);
    report.passed = true; return;
  }

  console.log('Importing pinned Smol256 only into the host, then denying all weight HTTP sources');
  report.import = await host.evaluate(({ manifest, descriptor }) => window.peerInferenceAcceptance.importPackage(manifest, descriptor), { manifest, descriptor });
  assert.equal(seedRequests, manifest.files.length); assert.equal(seedBytes, catalog.totalBytes);
  seedEnabled = false;
  report.load = await host.evaluate(() => window.peerInferenceAcceptance.load());
  assert.equal(report.load.adapter.isFallbackAdapter, false);
  assert(report.load.workerId);
  await host.evaluate(() => window.peerInferenceAcceptance.setHosting(true));
  report.discovery = await requester.evaluate(() => window.peerInferenceAcceptance.refresh());
  assert.equal(report.discovery.hosts.length, 1);
  assert.equal(report.discovery.hosts[0].manifestCid, cached.manifestCid);
  assert(report.discovery.hosts[0].hosts.some((entry) => entry.peerId === hostPeerId));

  async function generate(requestId, options) {
    return requester.evaluate((value) => window.peerInferenceAcceptance.run(value),
      { requestId, manifestCid: cached.manifestCid, ...options });
  }
  console.log('Running real remote text, red/blue images, and streamed cancellation');
  report.text = await generate('remote-text', { prompt: `Reply with a short greeting. Private marker: ${marker}`, maxNewTokens: 24 });
  assert.equal(report.text.error, null); assert(report.text.result.text.trim());
  assert.equal(report.text.result.peerId, hostPeerId);
  assert(report.text.tokens.length > 0, 'Remote tokens must stream before final completion');
  assert.equal(report.text.tokens.join(''), report.text.result.text);
  for (const color of ['red', 'blue']) {
    report[color] = await generate(`remote-${color}`, { color, maxNewTokens: 16,
      prompt: 'What is the dominant color in this image? Answer in a few words.' });
    assert.equal(report[color].error, null);
    assert.match(report[color].result.text, new RegExp(color, 'i'));
  }
  report.cancel = await generate('remote-cancel', { cancelAfterToken: true, maxNewTokens: 256,
    prompt: 'List every integer from 1 to 100 in order, separated by spaces. Continue until 100.' });
  assert(report.cancel.tokens.length > 0); assert(report.cancel.error, 'Remote cancellation must reject generation');
  await host.waitForFunction(() => !window.peerInferenceAcceptance.localStatus().model.activeRequestId, null, { timeout: 15_000 });
  report.afterCancel = await host.evaluate(() => window.peerInferenceAcceptance.localStatus());
  assert.equal(report.afterCancel.model.status, 'ready');
  report.reuse = await generate('remote-reuse', { prompt: 'Reply with a short greeting.', maxNewTokens: 16 });
  assert.equal(report.reuse.error, null);

  await host.evaluate(() => window.peerInferenceAcceptance.setSharing(true));
  report.models = await receiver.evaluate(() => window.peerInferenceAcceptance.refresh());
  assert(report.models.models.some((entry) => entry.manifestCid === cached.manifestCid
    && entry.providers.some((provider) => provider.peerId === hostPeerId)));
  console.log('Third empty receiver downloads the advertised package over IPFS, without creating a model worker');
  report.receivedPackage = await receiver.evaluate((cid) => window.peerInferenceAcceptance.ensurePackage(cid), cached.manifestCid);
  assert.deepEqual(report.receivedPackage.files, manifest.files.map(({ path, size, sha256 }) => ({ path, size, sha256 })));
  report.receiver = await receiver.evaluate(() => window.peerInferenceAcceptance.evidence());
  assert(report.receiver.transfer.receivedBlockBytes >= catalog.totalBytes);
  assert.equal(report.receiver.compute, null);

  console.log('Disabling a host rejects new work; disconnecting it cancels an active request');
  await requester.evaluate((manifestCid) => window.peerInferenceAcceptance.startPending({ requestId: 'disabled-active-host', manifestCid,
    maxNewTokens: 256, prompt: 'List every integer from 1 to 100 in order, separated by spaces. Continue until 100.' }), cached.manifestCid);
  await requester.waitForFunction(() => window.peerInferenceAcceptance.pending('disabled-active-host')?.tokens > 0, null, { timeout: 30_000 });
  await host.evaluate(() => window.peerInferenceAcceptance.setHosting(false));
  report.disabledActive = await bounded(requester.evaluate(() => window.peerInferenceAcceptance.awaitPending('disabled-active-host')),
    'Host disable did not cancel active remote inference');
  assert(report.disabledActive.error);
  await host.waitForFunction(() => !window.peerInferenceAcceptance.localStatus().model.activeRequestId, null, { timeout: 15_000 });
  report.disabledDiscovery = await requester.evaluate(() => window.peerInferenceAcceptance.refresh());
  assert.equal(report.disabledDiscovery.hosts.length, 0);
  report.disabled = await generate('disabled-host', { prompt: 'Hello' });
  assert(report.disabled.error);
  await host.evaluate(() => window.peerInferenceAcceptance.setHosting(true));
  await requester.evaluate(() => window.peerInferenceAcceptance.refresh());
  await requester.evaluate((manifestCid) => window.peerInferenceAcceptance.startPending({ requestId: 'disconnected-host', manifestCid,
    maxNewTokens: 256, prompt: 'List every integer from 1 to 100 in order, separated by spaces. Continue until 100.' }), cached.manifestCid);
  await requester.waitForFunction(() => window.peerInferenceAcceptance.pending('disconnected-host')?.tokens > 0, null, { timeout: 30_000 });
  report.beforeDisconnect = await host.evaluate(() => window.peerInferenceAcceptance.evidence());
  await host.evaluate(() => window.peerInferenceAcceptance.disconnect());
  report.disconnected = await bounded(requester.evaluate(() => window.peerInferenceAcceptance.awaitPending('disconnected-host')),
    'Disconnected remote inference did not terminate');
  assert(report.disconnected.error);
  await host.waitForFunction(() => !window.peerInferenceAcceptance.localStatus().model.activeRequestId, null, { timeout: 15_000 });
  report.requester = await requester.evaluate(() => window.peerInferenceAcceptance.evidence());
  assert.equal(report.requester.compute, null); assert.equal(report.requester.storage.storedBytes, 0);
  assert.equal(report.requester.transfer.receivedBlockBytes ?? 0, 0);
  // The host remaps client IDs to prevent collisions between independent peers.
  const successful = report.beforeDisconnect.hostResults.slice(0, 4);
  assert.equal(successful.length, 4);
  assert(successful.every((entry) => entry.gpuDispatches > 0 && entry.gpuSubmissions > 0));
  assert.equal(new Set(successful.map((entry) => entry.workerId)).size, 1);
  for (const { result } of [report.text, report.red, report.blue, report.reuse]) {
    assert.equal(result.connectionEncryption, 'native', 'Remote inference must use native WebRTC encryption');
    assert(result.connectionAddress.includes('/webrtc/'), 'Remote inference must report its actual WebRTC stream connection');
  }
  for (const evidence of [report.beforeDisconnect, report.requester, report.receiver]) {
    assert.equal(evidence.pubsub.privateMarkerSeen, false); assert.equal(evidence.pubsub.contentFieldsSeen, false);
  }
  assert.deepEqual(report.workers.requester, []); assert.deepEqual(report.workers.receiver, []);
  assert.deepEqual(report.requesterWasmRequests, []); assert.deepEqual(report.externalRequests, []);
  assert.deepEqual(report.externalSockets, []); assert.deepEqual(report.forbiddenSeedRequests, []);
  assert.deepEqual(report.pageErrors, []);
  assert.equal(seedRequests, manifest.files.length);
  await host.evaluate(() => window.peerInferenceAcceptance.unload());
  report.afterUnload = await host.evaluate(() => window.peerInferenceAcceptance.evidence());
  assert.equal(report.afterUnload.pressure.activeLeaseCount, 0, 'Unloading must release all resident resource leases');
  assert.equal(report.workers.host.length, 1, 'All host inference must remain in one ComputeManager worker');
  report.passed = true;
}

try { await run(); }
catch (error) {
  report.passed = false; report.error = { message: error.message, stack: error.stack };
  report.failureEvidence = await Promise.all(pages.map((page) => page.evaluate(() => window.peerInferenceAcceptance?.evidence())
    .catch((cause) => ({ unavailable: cause.message }))));
  console.error(error.stack); process.exitCode = 1;
} finally {
  await Promise.allSettled(pages.map((page) => bounded(page.evaluate(() => window.peerInferenceAcceptance?.stop()), 'Peer cleanup timed out', 15_000)));
  await hostBrowser?.close(); await requesterBrowser?.close(); await relay?.stop();
  if (server) await new Promise((resolve) => server.close(resolve));
  report.seedRequests = seedRequests; report.seedBytes = seedBytes; report.finishedAt = new Date().toISOString();
  await writeFile(evidencePath, JSON.stringify(report, null, 2));
  await rm(temporary, { recursive: true, force: true });
  console.log(`Peer inference evidence: ${evidencePath}`);
}
