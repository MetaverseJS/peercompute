import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { get as httpsGet } from 'node:https';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { build } from 'vite';
import { chromium } from 'playwright';
import { DIFFUSION_MODEL_CATALOG, diffusionModelFileUrl } from '../../src/peercompute/artifacts/diffusionModelCatalog.js';

const ids = (process.env.DIFFUSION_MODEL_IDS || 'dreamshaper-8-lcm-int8-onnx,sd-turbo-onnx').split(',');
const evidencePath = process.env.DIFFUSION_EVIDENCE_PATH || path.join(tmpdir(), `peercompute-diffusion-${Date.now()}.json`);
const fixtureRoot = fileURLToPath(new URL('./diffusion-fixture/', import.meta.url));
const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-diffusion-hardware-'));
const report = { startedAt: new Date().toISOString(), node: process.version, models: [], blockedRequests: [], pageErrors: [], flags: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface', '--enable-dawn-features=vulkan_enable_f16_on_nvidia'] };
let server, context, page, seedEnabled = true, seedBytes = 0, seedRequests = 0;
const requests = new Set();
async function source(input, signal, depth = 0) {
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password || depth > 5 || !(url.hostname === 'huggingface.co' || url.hostname.endsWith('.huggingface.co') || url.hostname === 'hf.co' || url.hostname.endsWith('.hf.co'))) throw new Error('Unapproved model source');
  const response = await new Promise((resolve, reject) => { const request = httpsGet(url, { signal, headers: { 'Accept-Encoding': 'identity' } }, resolve); request.setTimeout(30000, () => request.destroy(new Error('Source stalled'))); request.on('error', reject); });
  if ([301,302,303,307,308].includes(response.statusCode)) { const location = response.headers.location; response.destroy(); return source(new URL(location, url), signal, depth + 1); }
  if (response.statusCode !== 200) { response.destroy(); throw new Error(`Source HTTP ${response.statusCode}`); } return response;
}
try {
  console.log('Building production diffusion worker fixture');
  const dist = path.join(temporary, 'dist');
  await build({ configFile: false, root: fixtureRoot, base: './', logLevel: 'warn', worker: { format: 'es' }, build: { target: 'esnext', outDir: dist, emptyOutDir: true } });
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.startsWith('/seed/')) {
        const [, , id, ...parts] = pathname.split('/'); const file = DIFFUSION_MODEL_CATALOG[id]?.files.find((entry) => entry.path === parts.join('/'));
        if (!seedEnabled || !file || !ids.includes(id)) { response.writeHead(403); response.end(); return; }
        const abort = new AbortController(); requests.add(abort); response.on('close', () => abort.abort());
        try {
          const upstream = await source(diffusionModelFileUrl(id, file.path), abort.signal); seedRequests++;
          response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': file.size, 'Cache-Control': 'no-store' });
          let fileBytes = 0, lastLog = Date.now(); upstream.on('data', (bytes) => { seedBytes += bytes.length; fileBytes += bytes.length; if (Date.now() - lastLog > 15000) { console.log(`Import ${id}/${file.path}: ${Math.round(fileBytes / 1024 ** 2)}/${Math.round(file.size / 1024 ** 2)} MiB`); lastLog = Date.now(); } });
          await pipeline(upstream, response, { signal: abort.signal });
        } finally { requests.delete(abort); }
        return;
      }
      const filename = path.resolve(dist, pathname.slice(1) || 'index.html'); if (!filename.startsWith(dist + path.sep)) throw new Error('Invalid path');
      const bytes = await readFile(filename); response.setHeader('Content-Type', filename.endsWith('.wasm') ? 'application/wasm' : /\.(js|mjs)$/.test(filename) ? 'text/javascript' : 'text/html'); response.end(bytes);
    } catch (error) { if (!response.headersSent) response.writeHead(502); response.end(); if (!request.destroyed) console.error('HTTP', error.message); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve)); const origin = `http://127.0.0.1:${server.address().port}`;
  async function launch(profile) {
    context = await chromium.launchPersistentContext(profile, { executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: report.flags });
    const cdp = await context.browser().newBrowserCDPSession(); const gpu = (await cdp.send('SystemInfo.getInfo')).gpu;
    report.browser = context.browser().version(); report.renderer = gpu.auxAttributes.glRenderer; assert.match(report.renderer, /NVIDIA|Intel|AMD/);
    await context.route('**/*', (route) => { const url = new URL(route.request().url()); if (url.origin === origin) return route.continue(); report.blockedRequests.push(url.origin + url.pathname); return route.abort(); });
    page = await context.newPage(); page.on('pageerror', (error) => { report.pageErrors.push(error.message); console.error('PAGE', error.message); }); page.on('console', (message) => { if (message.text().startsWith('DIFFUSION') || message.type() === 'error') console.log('BROWSER', message.text().slice(0, 1000)); });
    await page.goto(origin); await page.waitForFunction(() => window.diffusionAcceptanceReady, null, { timeout: 60000 });
    const started = await page.evaluate(() => window.diffusionAcceptance.start()); assert.equal(started.persistent, true); return started;
  }
  for (const id of ids) {
    assert(DIFFUSION_MODEL_CATALOG[id], 'Unknown selected diffusion model');
    const profile = path.join(temporary, `profile-${id}`); seedEnabled = true;
    const entry = { id }; report.models.push(entry); entry.start = await launch(profile);
    console.log(`Importing ${id} directly into owned IDB, no source-file copy`); const begun = Date.now();
    entry.import = await page.evaluate((value) => window.diffusionAcceptance.importCatalog(value), id); entry.importMs = Date.now() - begun;
    seedEnabled = false; const bytesAtImport = seedBytes, requestsAtImport = seedRequests;
    console.log(`Loading ${id}, all external model sources blocked`); const loadStart = Date.now(); entry.load = await page.evaluate((cid) => window.diffusionAcceptance.load(cid), entry.import.cid); entry.loadMs = Date.now() - loadStart;
    assert.equal(entry.load.adapter.isFallbackAdapter, false); assert(entry.load.runtimeFeatures.includes('shader-f16')); assert(entry.load.workerId);
    const generationStart = Date.now(); entry.first = await page.evaluate(() => window.diffusionAcceptance.generate()); entry.firstMs = Date.now() - generationStart;
    assert(entry.first.gpuDispatches > 0 && entry.first.gpuSubmissions > 0); assert.equal(entry.first.image.bytes, 1048576); assert(entry.first.image.maximum - entry.first.image.minimum > 50);
    entry.screenshot = evidencePath.replace(/\.json$/, `-${id}.png`); await page.locator('canvas').screenshot({ path: entry.screenshot });
    entry.warm = await page.evaluate(() => window.diffusionAcceptance.generate({ prompt: 'A small blue sailboat on a mountain lake, watercolor painting', seed: 123 })); assert.equal(entry.warm.workerId, entry.first.workerId); assert.notEqual(entry.warm.imageSha256, entry.first.imageSha256);
    entry.warmScreenshot = evidencePath.replace(/\.json$/, `-${id}-warm.png`); await page.locator('canvas').screenshot({ path: entry.warmScreenshot });
    if (process.env.DIFFUSION_SKIP_PEER !== '1') { const { runImagePeerAcceptance } = await import('./image-peer-acceptance.mjs'); entry.peer = await runImagePeerAcceptance({ hostPage: page, descriptor: entry.import.descriptor, steps: DIFFUSION_MODEL_CATALOG[id].steps }); }
    entry.cancellation = await page.evaluate(() => window.diffusionAcceptance.cancelGeneration()); assert.equal(entry.cancellation.requested, true); assert(entry.cancellation.error);
    await page.evaluate(() => window.diffusionAcceptance.unload()); entry.afterUnload = await page.evaluate(() => window.diffusionAcceptance.evidence()); assert.equal(entry.afterUnload.service.status, 'idle'); assert.equal(entry.afterUnload.pressure.activeLeaseCount, 0);
    await page.evaluate(() => window.diffusionAcceptance.stop()); await context.close(); context = null;
    console.log(`Restarting ${id} with retained IDB and every source still blocked`); await launch(profile);
    const restored = await page.evaluate((cid) => window.diffusionAcceptance.stat(cid), entry.import.cid); assert.equal(restored.status, 'complete');
    entry.restartLoad = await page.evaluate((cid) => window.diffusionAcceptance.load(cid), entry.import.cid); entry.restart = await page.evaluate(() => window.diffusionAcceptance.generate({ seed: 42 })); assert(entry.restart.gpuDispatches > 0); assert.equal(entry.restart.image.bytes, 1048576); assert.equal(entry.restart.imageSha256, entry.first.imageSha256);
    assert.equal(seedBytes, bytesAtImport); assert.equal(seedRequests, requestsAtImport); await page.evaluate(() => window.diffusionAcceptance.stop()); await context.close(); context = null;
    entry.passed = true; await rm(profile, { recursive: true, force: true }); await writeFile(evidencePath, JSON.stringify(report, null, 2)); console.log(`${id} passed actual local/peer image execution and restart`);
  }
  assert.deepEqual(report.blockedRequests, []); assert.deepEqual(report.pageErrors, []); report.passed = true;
} catch (error) { report.passed = false; report.error = { message: error.message, stack: error.stack }; console.error(error.stack); try { report.failureEvidence = await page?.evaluate(() => window.diffusionAcceptance?.evidence()); } catch {} process.exitCode = 1;
} finally {
  try { await page?.evaluate(() => window.diffusionAcceptance?.stop()); } catch {} await context?.close(); for (const request of requests) request.abort(); if (server) await new Promise((resolve) => server.close(resolve));
  report.finishedAt = new Date().toISOString(); report.seedBytes = seedBytes; report.seedRequests = seedRequests; await writeFile(evidencePath, JSON.stringify(report, null, 2)); await rm(temporary, { recursive: true, force: true }); console.log(`Diffusion evidence: ${evidencePath}`);
}
