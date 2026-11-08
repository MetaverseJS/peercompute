import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
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

async function bounded(promise, message, milliseconds) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); })]); }
  finally { clearTimeout(timer); }
}

/** Runs against an already loaded, caller-owned GPU host. No model imports or
 * host browser lifecycle changes occur here; stopPeerHost closes networking only.
 */
export async function runImagePeerAcceptance({ hostPage, descriptor,
  prompt = 'A red sailboat on a blue lake.', seed = 12345, steps,
  hostApi = 'diffusionAcceptance', timeoutMs = 300_000, testCancellation = false,
  evidencePath } = {}) {
  assert(hostPage && descriptor?.manifestCid, 'An existing host page and model descriptor are required');
  assert.equal(descriptor.task, 'text-to-image'); assert.deepEqual(descriptor.outputModalities, ['image']);
  assert.match(hostApi, /^[A-Za-z_$][\w$]*$/);
  const report = { startedAt: new Date().toISOString(), manifestCid: descriptor.manifestCid,
    scope: 'independent GPU-disabled requester; resident managed host; native encrypted WebRTC image output',
    requesterGpuDisabled: true, externalRequests: [], externalSockets: [], forbiddenRequests: [], pageErrors: [], workers: [] };
  const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-image-peer-'));
  let relay, server, browser, requester, hostStarted = false, failure;
  const callHost = (method, value) => hostPage.evaluate(({ api, method, value }) => window[api][method](value), { api: hostApi, method, value });
  try {
    if (await hostPage.locator('canvas').count()) {
      const modelName = String(descriptor.modelId ?? 'model').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 100);
      report.warmImagePath = path.join(tmpdir(), `peercompute-diffusion-warm-${modelName}.png`);
      await hostPage.locator('canvas').first().screenshot({ path: report.warmImagePath });
    }
    const fixture = fileURLToPath(new URL('../fixtures/image-peer-inference/', import.meta.url));
    const dist = path.join(temporary, 'dist');
    await build({ configFile: false, root: fixture, base: './', logLevel: 'warn', worker: { format: 'es' },
      build: { target: 'esnext', outDir: dist, emptyOutDir: true } });
    server = createServer(async (request, response) => {
      try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const filename = path.resolve(dist, `.${pathname === '/' ? '/index.html' : pathname}`);
        if (!filename.startsWith(`${dist}${path.sep}`) || !/\.(?:html|js|mjs|css|json)$/.test(filename)) {
          report.forbiddenRequests.push(pathname); throw new Error('Only requester application assets are served');
        }
        const bytes = await readFile(filename);
        response.setHeader('Content-Type', /\.(?:js|mjs)$/.test(filename) ? 'text/javascript'
          : filename.endsWith('.css') ? 'text/css' : filename.endsWith('.json') ? 'application/json' : 'text/html');
        response.setHeader('Cache-Control', 'no-store'); response.end(bytes);
      } catch { response.writeHead(404); response.end(); }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    relay = withLibp2pLight(createHeliaLight(), {
      addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
      connectionEncrypters: [noise()], streamMuxers: [yamux()],
      services: { identify: identify(), relay: circuitRelayServer({ reservations: { applyDefaultLimit: false } }) },
      connectionManager: { inboundConnectionThreshold: Infinity, maxConnections: 16 }, peerDiscovery: [],
    });
    await relay.start();
    const relayAddress = relay.libp2p.getMultiaddrs()[0].toString();
    const scopeName = `image-peer-${crypto.randomUUID()}`;
    const scope = { gameId: scopeName, roomId: scopeName, topologyId: scopeName };
    const marker = `PRIVATE_IMAGE_${crypto.randomUUID()}`;
    hostStarted = true;
    report.host = await bounded(callHost('startPeerHost', { relayAddress, scope: scopeName, descriptor, marker }), 'Host peer setup timed out', 40_000);
    assert(report.host.peerId);
    await hostPage.waitForFunction(async (api) => (await window[api].peerEvidence()).addresses.some((address) => address.includes('/webrtc/')),
      hostApi, { timeout: 30_000, polling: 100 });
    const hostReady = await callHost('peerEvidence'); report.host.addresses = hostReady.addresses;
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
      args: ['--disable-gpu', '--disable-software-rasterizer'] });
    report.requesterBrowser = browser.version();
    const context = await browser.newContext();
    await context.addInitScript(() => {
      window.__imagePeerWorkerAttempts = [];
      const OriginalWorker = window.Worker;
      window.Worker = new Proxy(OriginalWorker, { construct(_target, args) {
        window.__imagePeerWorkerAttempts.push(String(args[0]));
        throw new Error('Network-only image requester must not construct a worker');
      } });
    });
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) { report.externalRequests.push(url.origin + url.pathname); return route.abort(); }
      if (/\.(?:wasm|onnx|onnx_data|gguf|safetensors|bin)$/.test(url.pathname) || url.pathname.startsWith('/seed/')) {
        report.forbiddenRequests.push(url.pathname); return route.abort();
      }
      return route.continue();
    });
    requester = await context.newPage();
    requester.on('pageerror', (error) => report.pageErrors.push(error.message));
    requester.on('worker', (worker) => report.workers.push(worker.url()));
    requester.on('websocket', (socket) => {
      if (!/^ws:\/\/127\.0\.0\.1:\d+\/?$/.test(socket.url())) report.externalSockets.push(socket.url());
    });
    await requester.goto(origin, { waitUntil: 'domcontentloaded' });
    await requester.waitForFunction(() => window.imagePeerRequesterReady, null, { timeout: 30_000 });
    report.requesterInitial = await requester.evaluate((options) => imagePeerRequester.start(options),
      { relayAddress, scope, marker, requestTimeoutMs: timeoutMs });
    assert.notEqual(report.requesterInitial.peerId, report.host.peerId);
    const address = report.host.addresses.find((candidate) => candidate.includes('/webrtc/'));
    await bounded(requester.evaluate((address) => imagePeerRequester.dial(address), address), 'Native WebRTC dial timed out', 30_000);
    await requester.waitForFunction(async (peerId) => (await imagePeerRequester.evidence()).connections.some((connection) =>
      connection.peerId === peerId && connection.encryption === 'native' && connection.status === 'open'), report.host.peerId, { timeout: 30_000 });
    report.discovery = await requester.evaluate(() => imagePeerRequester.refresh());
    const host = report.discovery.hosts.find((entry) => entry.manifestCid === descriptor.manifestCid);
    assert(host, 'Requester must discover the actual loaded model'); assert.equal(host.task, 'text-to-image');
    assert.deepEqual(host.modalities, ['text']); assert.deepEqual(host.outputModalities, ['image']);
    assert(host.hosts.some((provider) => provider.peerId === report.host.peerId));
    const before = await callHost('peerEvidence');
    const request = { manifestCid: descriptor.manifestCid, requestId: `image-${crypto.randomUUID()}`,
      prompt: `${prompt}\nPrivate request marker: ${marker}`, seed, steps };
    report.generation = await bounded(requester.evaluate((input) => imagePeerRequester.run(input), request),
      'Remote image generation timed out', timeoutMs + 10_000);
    assert.equal(report.generation.error, null, report.generation.error?.message);
    const result = report.generation.result;
    assert.equal(result.peerId, report.host.peerId); assert.equal(result.connectionEncryption, 'native');
    assert.match(result.connectionAddress, /\/webrtc(?:\/|$)/);
    assert.equal(result.image.bytes, 512 * 512 * 4); assert.equal(result.image.sha256, result.image.advertisedSha256);
    assert.equal(result.seed, seed); if (steps !== undefined) assert.equal(result.steps, steps);
    report.hostAfterGeneration = await callHost('peerEvidence');
    assert(report.hostAfterGeneration.hostResults.length > (before.hostResults?.length ?? 0));
    const sent = report.hostAfterGeneration.hostResults.at(-1);
    assert.equal(result.image.sha256, sent.imageSha256, 'Received RGBA must match the actual host result');
    assert(sent.workerId); assert(sent.gpuDispatches > 0 && sent.gpuSubmissions > 0, 'Host must execute actual managed WebGPU work');
    assert(result.gpuDispatches > 0 && result.gpuSubmissions > 0);
    assert.equal(report.hostAfterGeneration.pubsub.privateMarkerSeen, false);
    assert.equal(report.hostAfterGeneration.pubsub.contentFieldsSeen, false);
    await callHost('setPeerHosting', false);
    report.disabledDiscovery = await requester.evaluate(() => imagePeerRequester.refresh());
    assert(!report.disabledDiscovery.hosts.some((entry) => entry.manifestCid === descriptor.manifestCid));
    report.disabled = await bounded(requester.evaluate((input) => imagePeerRequester.run(input),
      { ...request, requestId: `disabled-${crypto.randomUUID()}` }), 'Disabled host did not reject', 15_000);
    assert(report.disabled.error, 'Disabled host must reject instead of running locally');
    assert.equal((await callHost('peerEvidence')).hostResults.length, report.hostAfterGeneration.hostResults.length);
    await callHost('setPeerHosting', true);
    if (testCancellation) {
      await requester.evaluate(() => imagePeerRequester.refresh());
      report.cancelled = await bounded(requester.evaluate((input) => imagePeerRequester.run(input),
        { ...request, requestId: `cancel-${crypto.randomUUID()}`, cancelAfterProgress: true }),
      'Remote cancellation did not settle', timeoutMs + 10_000);
      assert(report.cancelled.events.some((event) => event.type === 'diffusion-progress'));
      assert(report.cancelled.error, 'Cancelling after actual progress must reject');
      report.hostAfterCancellation = await callHost('peerEvidence');
    } else report.cancellation = 'Not requested; caller retains the loaded model for subsequent local gates.';
    report.requester = await requester.evaluate(() => imagePeerRequester.evidence());
    assert.equal(report.requester.hasComputeManager, false); assert.equal(report.requester.hasArtifactTransport, false);
    assert.deepEqual(report.requester.databases, []); assert.deepEqual(report.requester.workerAttempts, []);
    assert.equal(report.requester.pubsub.privateMarkerSeen, false); assert.equal(report.requester.pubsub.contentFieldsSeen, false);
    assert.deepEqual(report.externalRequests, []); assert.deepEqual(report.externalSockets, []);
    assert.deepEqual(report.forbiddenRequests, []); assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.workers, []);
    report.passed = true;
  } catch (error) { failure = error; report.passed = false; report.error = { name: error.name, message: error.message, stack: error.stack }; }
  finally {
    const cleanup = async (label, operation) => {
      try { await bounded(operation(), `${label} cleanup timed out`, 30_000); }
      catch (error) { (report.cleanupErrors ??= []).push({ label, message: error.message }); report.passed = false; failure ??= error; }
    };
    if (requester) await cleanup('requester', () => requester.evaluate(() => window.imagePeerRequester?.stop()));
    if (hostStarted) await cleanup('host-network', () => callHost('stopPeerHost'));
    if (browser) await cleanup('browser', () => browser.close());
    if (relay) await cleanup('relay', () => relay.stop());
    if (server) await cleanup('server', () => new Promise((resolve) => server.close(resolve)));
    await rm(temporary, { recursive: true, force: true }); report.finishedAt = new Date().toISOString();
    if (evidencePath) await writeFile(evidencePath, JSON.stringify(report, null, 2));
  }
  if (failure) { failure.imagePeerEvidence = report; throw failure; }
  return report;
}
