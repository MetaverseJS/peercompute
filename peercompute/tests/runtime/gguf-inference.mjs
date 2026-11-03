import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { once } from 'node:events';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { FileSystemArtifactBackend } from '../../src/peercompute/artifacts/node/FileSystemArtifactBackend.js';
import { GGUF_MODEL_CATALOG } from '../../src/peercompute/artifacts/ggufModelCatalog.js';

const modelId = process.env.GGUF_MODEL_ID || 'qwen3.5-0.8b-q4-k-m-gguf';
const entry = GGUF_MODEL_CATALOG[modelId];
assert(entry, 'GGUF_MODEL_ID must name an approved pinned package');
const cacheRoot = process.env.PEERCOMPUTE_ARTIFACT_CACHE || path.join(homedir(), '.cache/peercompute-artifacts');
const evidencePath = process.env.GGUF_EVIDENCE_PATH || path.join(tmpdir(), `peercompute-gguf-evidence-${Date.now()}.json`);
const mode = process.env.GGUF_ARTIFACT_MODE || (entry.weightBytes > 4 * 1024 ** 3 ? 'external' : 'browser');
assert(['external', 'browser'].includes(mode), 'GGUF_ARTIFACT_MODE must be external or browser');
assert(mode !== 'browser' || entry.weightBytes < 4 * 1024 ** 3, 'Large acceptance must reuse the Node store without a duplicate browser copy');
const gpuLayers = Number(process.env.GGUF_GPU_LAYERS || 99999);
assert(Number.isSafeInteger(gpuLayers) && gpuLayers >= 1 && gpuLayers <= 99999, 'Invalid GGUF_GPU_LAYERS');
const useF16Override = process.env.GGUF_NVIDIA_F16_OVERRIDE === '1';
const report = { startedAt: new Date().toISOString(), node: process.version, modelId, mode,
  scope: mode === 'browser' ? 'Managed WebGPU GGUF from persistent browser artifacts; source disabled after import'
    : 'Managed WebGPU GGUF using a bounded loopback bridge to the verified Node artifact store; no browser persistence or IPFS claim',
  nvidiaF16PolicyOverride: useF16Override, externalRequests: [], pageErrors: [], bridgeErrors: [], workerUrls: [] };
const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-gguf-hardware-'));
const prefix = '/nested/gguf/';
const endpoint = `/verified-artifacts/${randomBytes(18).toString('hex')}/`;
const MAX_RANGE = 1024 * 1024;
const reads = new Set();
const transfer = { requests: 0, deniedRequests: 0, bytes: 0, maximumOffset: 0, maximumRange: 0, peakActiveReads: 0 };
let store, server, context, page, bridgeEnabled = true;
const runFile = promisify(execFile);
let memoryTimer, sampling = false;
report.deviceMemory = { scope: 'Whole NVIDIA GPU, including other applications; not model-only allocation',
  samples: [], peakUsedMiB: 0 };
async function sampleDeviceMemory() {
  if (sampling) return;
  sampling = true;
  try {
    const { stdout } = await runFile('nvidia-smi', ['--query-gpu=memory.used,memory.free', '--format=csv,noheader,nounits'], { timeout: 3000 });
    const [usedMiB, freeMiB] = stdout.trim().split(/[,\n]/).map(Number);
    if (Number.isFinite(usedMiB) && Number.isFinite(freeMiB)) {
      report.deviceMemory.samples.push({ at: new Date().toISOString(), usedMiB, freeMiB });
      report.deviceMemory.peakUsedMiB = Math.max(report.deviceMemory.peakUsedMiB, usedMiB);
    }
  } catch (error) { report.deviceMemory.unavailable = error.message; }
  finally { sampling = false; }
}

try {
  const packageDir = path.join(cacheRoot, 'packages', modelId);
  const descriptor = JSON.parse(await readFile(path.join(packageDir, 'descriptor.json'), 'utf8'));
  const expectedManifest = JSON.parse(await readFile(path.join(packageDir, 'manifest.json'), 'utf8'));
  store = new ArtifactStore({ name: 'gguf-acceptance-node', persistent: true,
    backend: new FileSystemArtifactBackend({ directory: path.join(cacheRoot, 'store') }), ownsBackend: true,
    maximumBytes: 24 * 1024 ** 3, maximumTraversalBlocks: 102400 });
  console.log('Opening existing verified artifact store without copying weights');
  await store.open();
  const manifest = await store.getManifest(descriptor.manifestCid);
  assert.deepEqual(manifest, expectedManifest, 'Cached fixture must match the canonical verified manifest');
  assert.equal(manifest.model.repository, entry.repository);
  assert.equal(manifest.model.revision, entry.revision);
  const files = new Map();
  for (const file of manifest.files) {
    const stat = await store.stat(file.cid);
    assert.equal(stat?.status, 'complete'); assert.equal(stat.size, file.size); assert.equal(stat.sha256, file.sha256);
    files.set(file.cid, file);
  }
  report.manifestCid = descriptor.manifestCid;
  report.revision = entry.revision;
  report.totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0);
  report.runtimeOptions = { n_ctx: 512, n_batch: 64, n_gpu_layers: gpuLayers, n_threads: 1 };
  await sampleDeviceMemory();
  memoryTimer = setInterval(() => { void sampleDeviceMemory(); }, 5000);
  memoryTimer.unref();
  const dist = path.join(temporary, 'dist');
  console.log('Building managed GGUF worker and local WASM assets');
  await build({ configFile: false, root: fileURLToPath(new URL('../fixtures/gguf/', import.meta.url)),
    base: './', logLevel: 'warn', worker: { format: 'es' },
    build: { target: 'esnext', outDir: dist, emptyOutDir: true } });
  server = createServer(async (request, response) => {
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    response.setHeader('Cache-Control', 'no-store');
    try {
      const url = new URL(request.url, 'http://localhost');
      if (url.pathname.startsWith(endpoint)) {
        if (!bridgeEnabled) { transfer.deniedRequests++; response.writeHead(403); response.end('Artifact source disabled after browser import'); return; }
        const cid = decodeURIComponent(url.pathname.slice(endpoint.length));
        const file = files.get(cid);
        const offset = Number(url.searchParams.get('offset')), length = Number(url.searchParams.get('length'));
        if (request.method !== 'GET' || !file || !Number.isSafeInteger(offset) || !Number.isSafeInteger(length)
            || offset < 0 || length < 1 || length > MAX_RANGE || offset > file.size || length > file.size - offset) {
          response.writeHead(400); response.end('Invalid approved artifact range'); return;
        }
        transfer.requests++; transfer.maximumOffset = Math.max(transfer.maximumOffset, offset);
        transfer.maximumRange = Math.max(transfer.maximumRange, length);
        const controller = new AbortController();
        reads.add(controller); transfer.peakActiveReads = Math.max(transfer.peakActiveReads, reads.size);
        const aborted = () => { if (!response.writableFinished) controller.abort('HTTP reader closed'); };
        request.on('aborted', aborted); response.on('close', aborted);
        response.setHeader('Content-Type', 'application/octet-stream'); response.setHeader('Content-Length', length);
        try {
          for await (const bytes of store.openRead(cid, { offset, length, signal: controller.signal })) {
            transfer.bytes += bytes.byteLength;
            if (!response.write(bytes)) await once(response, 'drain', { signal: controller.signal });
          }
          response.end();
        } catch (error) {
          if (!controller.signal.aborted) report.bridgeErrors.push(error.message);
          response.destroy();
        } finally { reads.delete(controller); request.off('aborted', aborted); response.off('close', aborted); }
        return;
      }
      if (!url.pathname.startsWith(prefix)) throw new Error('Wrong deployment prefix');
      const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
      const filename = path.resolve(dist, relative);
      if (!filename.startsWith(`${dist}${path.sep}`)) throw new Error('Invalid static path');
      const bytes = await readFile(filename);
      response.setHeader('Content-Type', filename.endsWith('.wasm') ? 'application/wasm'
        : /\.(?:js|mjs)$/.test(filename) ? 'text/javascript' : 'text/html');
      response.end(bytes);
    } catch { if (!response.headersSent) response.writeHead(404); response.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  async function launch() {
    const flags = ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE',
      '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'];
    if (useF16Override) flags.push('--enable-dawn-features=vulkan_enable_f16_on_nvidia');
    context = await chromium.launchPersistentContext(path.join(temporary, 'profile'), {
      executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: flags });
    const cdp = await context.browser().newBrowserCDPSession();
    const gpu = (await cdp.send('SystemInfo.getInfo')).gpu;
    report.browser = context.browser().version(); report.renderer = gpu.auxAttributes.glRenderer;
    assert.match(report.renderer, /NVIDIA|Intel|AMD/, 'A hardware renderer is required');
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      report.externalRequests.push(url.origin + url.pathname); return route.abort();
    });
    page = await context.newPage();
    page.on('worker', (worker) => report.workerUrls.push(worker.url()));
    page.on('pageerror', (error) => { report.pageErrors.push(error.message); console.error('PAGE', error.message); });
    page.on('console', (message) => {
      if (message.type() === 'error') console.error('BROWSER', message.text().slice(0, 1000));
      else if (/^GGUF (?:LOAD|SEED)/.test(message.text())) console.log(message.text().slice(0, 1500));
    });
    await page.goto(origin + prefix);
    await page.waitForFunction(() => window.ggufAcceptanceReady, null, { timeout: 60_000 });
    return page.evaluate((configuration) => window.ggufAcceptance.start(configuration),
      { manifest, manifestCid: descriptor.manifestCid, endpoint, mode, runtimeOptions: report.runtimeOptions });
  }
  report.start = await launch();
  assert.equal(report.start.crossOriginIsolated, true);
  const importedRequests = transfer.requests;
  if (mode === 'browser') bridgeEnabled = false;
  const started = performance.now();
  console.log(`Loading ${modelId}, ${gpuLayers} GPU layers, source mode ${mode}`);
  report.load = await page.evaluate((cid) => window.ggufAcceptance.load(cid), descriptor.manifestCid);
  report.loadMs = performance.now() - started;
  assert(report.load.workerId, 'ComputeManager worker identity is required');
  assert.equal(report.load.adapter.isFallbackAdapter, false);
  console.log(`GGUF ready on ${report.load.workerId} after ${Math.round(report.loadMs)} ms`);
  let requestStarted = performance.now();
  report.first = await page.evaluate(() => window.ggufAcceptance.generate());
  report.firstMs = performance.now() - requestStarted;
  assert(report.first.text.trim(), 'GGUF must generate text');
  assert(report.first.gpuDispatches > 0 && report.first.gpuSubmissions > 0, 'Actual GGUF GPU kernels must dispatch and submit');
  console.log('GGUF generated greeting with verified GPU dispatches');
  requestStarted = performance.now();
  report.warm = await page.evaluate(() => window.ggufAcceptance.generate({ maxNewTokens: 16 }));
  report.warmMs = performance.now() - requestStarted;
  assert.equal(report.warm.workerId, report.first.workerId, 'Warm inference must reuse the managed worker');
  requestStarted = performance.now();
  report.correctness = await page.evaluate(() => window.ggufAcceptance.generate({ maxNewTokens: 8,
    prompt: 'What is 2 + 2? Reply with only the numeral for the answer. /no_think' }));
  report.correctnessMs = performance.now() - requestStarted;
  assert.match(report.correctness.text.trim(), /^4[.!]?$/, 'The admitted GGUF must answer the arithmetic control correctly');
  console.log('GGUF warm reuse and arithmetic control passed');
  report.resident = await page.evaluate(() => window.ggufAcceptance.evidence());
  assert(report.resident.pressure.activeLeaseCount >= 2, 'Resident CPU and GPU resources must remain admitted');
  requestStarted = performance.now();
  report.cancellation = await page.evaluate(() => window.ggufAcceptance.cancelGeneration());
  report.cancellationMs = performance.now() - requestStarted;
  assert.equal(report.cancellation.requested, true);
  assert(report.cancellation.error, 'Cancellation must reject generation');
  await page.evaluate(() => window.ggufAcceptance.unload());
  report.afterUnload = await page.evaluate(() => window.ggufAcceptance.evidence());
  assert.equal(report.afterUnload.service.status, 'idle');
  assert.equal(report.afterUnload.pressure.activeLeaseCount, 0, 'Acknowledged teardown must release residency');
  console.log('GGUF cancellation and acknowledged residency release passed');
  if (mode === 'browser') assert.equal(transfer.requests, importedRequests, 'Inference must read retained browser artifacts only');
  await page.evaluate(() => window.ggufAcceptance.stop());
  await context.close(); context = null;
  if (process.env.GGUF_SKIP_RESTART !== '1') {
    console.log('Restarting owned browser and managed worker with external downloads blocked');
    report.restartStart = await launch();
    report.restartLoad = await page.evaluate((cid) => window.ggufAcceptance.load(cid), descriptor.manifestCid);
    report.restartGeneration = await page.evaluate(() => window.ggufAcceptance.generate({ maxNewTokens: 8 }));
    assert(report.restartGeneration.text.trim());
    if (mode === 'browser') assert.equal(transfer.requests, importedRequests, 'Restart must use persistent browser artifacts');
    await page.evaluate(() => window.ggufAcceptance.stop());
  } else report.restartSkipped = true;
  assert.deepEqual(report.externalRequests, []); assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.bridgeErrors, []);
  assert.equal(transfer.deniedRequests, 0, 'A disabled weight source must never be requested');
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = { message: error.message, stack: error.stack };
  try { report.failureEvidence = await page?.evaluate(() => window.ggufAcceptance?.evidence()); } catch { /* Realm may have exited. */ }
  console.error(error.stack); process.exitCode = 1;
} finally {
  try { await page?.evaluate(() => window.ggufAcceptance?.stop()); } catch { /* Preserve original error. */ }
  await context?.close();
  for (const controller of reads) controller.abort('Acceptance shutdown');
  if (server) await new Promise((resolve) => server.close(resolve));
  await store?.destroy();
  clearInterval(memoryTimer);
  await sampleDeviceMemory();
  report.transfer = transfer; report.finishedAt = new Date().toISOString();
  await writeFile(evidencePath, JSON.stringify(report, null, 2));
  await rm(temporary, { recursive: true, force: true });
  console.log(`GGUF evidence: ${evidencePath}`);
}
