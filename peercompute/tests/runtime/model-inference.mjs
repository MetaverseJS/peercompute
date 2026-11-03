import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';
import { MODEL_CATALOG } from '../../src/peercompute/inference/modelCatalog.js';

const modelIds = (process.env.MODEL_IDS || 'smolvlm-256m-q4').split(',').map((id) => id.trim());
const cacheRoot = process.env.PEERCOMPUTE_ARTIFACT_CACHE || path.join(homedir(), '.cache/peercompute-artifacts');
const evidencePath = process.env.MODEL_EVIDENCE_PATH || path.join(tmpdir(), `peercompute-model-evidence-${Date.now()}.json`);
const fixtureRoot = fileURLToPath(new URL('../fixtures/inference/', import.meta.url));
const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-model-hardware-'));
const prefix = '/nested/inference/';
const report = { startedAt: new Date().toISOString(), node: process.version, models: [], externalRequests: [], pageErrors: [] };
let context, page, server;
let seedEnabled = true;
let seedBytes = 0;
let seedRequests = 0;
const packages = [];

try {
  for (const id of modelIds) {
    const catalog = MODEL_CATALOG[id];
    assert(catalog, `Unknown MODEL_IDS entry: ${id}`);
    const directory = path.join(cacheRoot, 'packages', id);
    const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
    const descriptor = JSON.parse(await readFile(path.join(directory, 'descriptor.json'), 'utf8'));
    packages.push({ id, catalog, manifest, manifestCid: descriptor.manifestCid,
      sourceRoot: path.join(cacheRoot, 'sources', id, catalog.revision) });
  }
  const dist = path.join(temporary, 'dist');
  console.log('Building production worker and nested-path local runtime assets');
  await build({ configFile: false, root: fixtureRoot, base: './', logLevel: 'warn',
    worker: { format: 'es' }, build: { target: 'esnext', outDir: dist, emptyOutDir: true } });
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.startsWith('/seed/')) {
        if (!seedEnabled) { response.writeHead(403); response.end('Source disabled after import'); return; }
        const [, , id, ...parts] = pathname.split('/');
        const item = packages.find((entry) => entry.id === id);
        const relative = parts.join('/');
        const file = item?.manifest.files.find((entry) => entry.path === relative);
        if (!file) throw new Error('Unknown seed file');
        seedRequests += 1;
        response.setHeader('Content-Type', 'application/octet-stream');
        response.setHeader('Content-Length', file.size);
        const stream = createReadStream(path.join(item.sourceRoot, relative));
        stream.on('data', (bytes) => { seedBytes += bytes.byteLength; });
        stream.on('error', () => response.destroy());
        stream.pipe(response);
        return;
      }
      if (!pathname.startsWith(prefix)) throw new Error('Wrong deployment prefix');
      const relative = pathname.slice(prefix.length) || 'index.html';
      const filename = path.resolve(dist, relative);
      if (!filename.startsWith(`${dist}${path.sep}`)) throw new Error('Invalid static path');
      const bytes = await readFile(filename);
      const type = filename.endsWith('.wasm') ? 'application/wasm'
        : /\.(?:js|mjs)$/.test(filename) ? 'text/javascript' : 'text/html';
      response.setHeader('Content-Type', type);
      response.end(bytes);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  async function launch() {
    context = await chromium.launchPersistentContext(path.join(temporary, 'profile'), {
      executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
      args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE',
        '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'],
    });
    const cdp = await context.browser().newBrowserCDPSession();
    const gpu = (await cdp.send('SystemInfo.getInfo')).gpu;
    report.browser = context.browser().version();
    report.renderer = gpu.auxAttributes.glRenderer;
    assert.match(report.renderer, /NVIDIA|Intel|AMD/, 'A hardware renderer is required');
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      report.externalRequests.push(url.origin + url.pathname);
      return route.abort();
    });
    page = await context.newPage();
    page.on('pageerror', (error) => { report.pageErrors.push(error.message); console.error('PAGE', error.message); });
    page.on('console', (message) => {
      if (message.type() === 'error') console.error('BROWSER', message.text().slice(0,500));
      else if (message.text().startsWith('MODEL LOAD')) console.log(message.text());
    });
    await page.goto(origin + prefix);
    await page.waitForFunction(() => window.inferenceAcceptanceReady === true, null, { timeout: 60_000 });
    return page.evaluate(() => window.inferenceAcceptance.start());
  }
  report.start = await launch();
  assert.equal(report.start.persistent, true);
  for (const item of packages) {
    const result = { id: item.id, manifestCid: item.manifestCid, revision: item.catalog.revision };
    report.models.push(result);
    console.log(`Importing ${item.id} into StateManager-owned IndexedDB`);
    const started = performance.now();
    await page.evaluate(({ manifest, source, cid }) => window.inferenceAcceptance.importPackage(manifest, source, cid),
      { manifest: item.manifest, source: `${origin}/seed/${item.id}/`, cid: item.manifestCid });
    result.importMs = performance.now() - started;
  }
  seedEnabled = false;
  const importedSeedRequests = seedRequests;
  for (const item of packages) {
    const result = report.models.find((model) => model.id === item.id);
    console.log(`Loading ${item.id} in ComputeManager's hardware WebGPU worker; origin/CDNs blocked`);
    const loadStart = performance.now();
    result.load = await page.evaluate((cid) => window.inferenceAcceptance.load(cid), item.manifestCid);
    result.loadMs = performance.now() - loadStart;
    assert.equal(result.load.adapter.isFallbackAdapter, false);
    assert(result.load.workerId, 'ComputeManager worker identity is required');
    const image = item.catalog.model.modalities.includes('image');
    const generateStart = performance.now();
    result.first = await page.evaluate((withImage) => window.inferenceAcceptance.generate({ image: withImage }), image);
    result.firstMs = performance.now() - generateStart;
    assert(result.first.text.trim(), 'Model must produce nonempty generated text');
    assert(result.first.gpuDispatches > 0 && result.first.gpuSubmissions > 0,
      'ORT-owned WebGPU device must dispatch and submit actual model kernels');
    result.warm = await page.evaluate((withImage) => window.inferenceAcceptance.generate({ image: withImage, color: 'blue', maxNewTokens: 16 }), image);
    if (image) {
      assert.match(result.first.text, /red/i, 'Red pixels must produce the correct image-dependent answer');
      assert.match(result.warm.text, /blue/i, 'Blue pixels must change the model answer');
    }
    assert.equal(result.warm.workerId, result.first.workerId);
    result.status = await page.evaluate(() => window.inferenceAcceptance.status());
    assert.equal(result.status.generatedRequests, 2);
    result.cancellation = await page.evaluate(() => window.inferenceAcceptance.cancelGeneration());
    assert.equal(result.cancellation.requested, true);
    assert(result.cancellation.error, 'Cancellation must reject generation');
    await page.evaluate(() => window.inferenceAcceptance.unload());
    result.afterUnload = await page.evaluate(() => window.inferenceAcceptance.evidence());
    assert.equal(result.afterUnload.service.status, 'idle');
    console.log(`${item.id}: generated ${JSON.stringify(result.first.text)}, GPU dispatches ${result.first.gpuDispatches}`);
  }
  assert.equal(seedRequests, importedSeedRequests, 'Inference must use retained artifacts only');
  await page.evaluate(() => window.inferenceAcceptance.stop());
  await context.close(); context = null;
  console.log('Restarting owned browser profile with seed/HF/CDNs still unavailable');
  await launch();
  const first = packages[0];
  const restored = await page.evaluate((cid) => window.inferenceAcceptance.stat(cid), first.manifestCid);
  assert.equal(restored.status, 'complete');
  report.restartLoad = await page.evaluate((cid) => window.inferenceAcceptance.load(cid), first.manifestCid);
  report.restartGeneration = await page.evaluate((image) => window.inferenceAcceptance.generate({ image, maxNewTokens: 8 }),
    first.catalog.model.modalities.includes('image'));
  assert(report.restartGeneration.text.trim());
  assert.equal(seedRequests, importedSeedRequests);
  await page.evaluate(() => window.inferenceAcceptance.stop());
  assert.deepEqual(report.externalRequests, []);
  assert.deepEqual(report.pageErrors, []);
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.error = { message: error.message, stack: error.stack };
  try { report.failureEvidence = await page?.evaluate(() => window.inferenceAcceptance?.evidence()); } catch { /* Page may have exited. */ }
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  try { await page?.evaluate(() => window.inferenceAcceptance?.stop()); } catch { /* Preserve the original failure. */ }
  await context?.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  report.seedBytes = seedBytes;
  report.seedRequests = seedRequests;
  report.finishedAt = new Date().toISOString();
  await writeFile(evidencePath, JSON.stringify(report, null, 2));
  await rm(temporary, { recursive: true, force: true });
  console.log(`Model evidence: ${evidencePath}`);
}
