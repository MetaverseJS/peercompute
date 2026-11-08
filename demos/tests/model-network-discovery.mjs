import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createServer } from 'node:https';
import path from 'node:path';
import { homedir } from 'node:os';
import { chromium } from 'playwright';
import { MODEL_CATALOG } from '../../peercompute/src/peercompute/inference/modelCatalog.js';

// Actual application, production relay, independent browsers and an owned GPU
// host. Only the pinned model downloads are served from the existing local cache.
const url = process.env.PREVIEW_URL || 'https://fastbox.tail5c077c.ts.net:5197/?dev=1';
const output = process.env.DISCOVERY_EVIDENCE || '/tmp/peercompute-discovery-browser.json';
const modelId = 'smolvlm-256m-q4', model = MODEL_CATALOG[modelId];
const cache = process.env.PEERCOMPUTE_ARTIFACT_CACHE || path.join(homedir(), '.cache/peercompute-artifacts');
const source = path.join(cache, 'sources', modelId, model.revision);
const descriptor = JSON.parse(await readFile(path.join(cache, 'packages', modelId, 'descriptor.json'), 'utf8'));
const report = { startedAt: new Date().toISOString(), url, modelId, manifestCid: descriptor.manifestCid,
  scope: 'Owned GPU host, same-library tab and independent GPU-disabled browser over SecretWorkshop; cached pinned model bytes',
  pageErrors: [], modelFiles: [], samples: [] };
const browsers = [], pages = [];
let seedServer;
const bounded = async (promise, label, ms = 120000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(label)), ms); })]); }
  finally { clearTimeout(timer); }
};
async function snapshot(page, label) {
  const state = await page.evaluate(() => {
    const r = inferencePanel.runtime;
    return { peerId: r.networkManager?.peerId, ready: r.networkReady,
      artifacts: r.getArtifactNetworkStatus(), discovery: r.getDiscoveryStatus(),
      sources: r.listModelSources().filter((s) => s.source === 'peers').map((s) => ({ key: s.key, name: s.name })),
      targets: r.listInferenceTargets().filter((s) => !s.local),
      summary: document.querySelector('.pc-network-summary').textContent };
  });
  report.samples.push({ label, at: new Date().toISOString(), ...state }); return state;
}
async function open(context, label) {
  const page = await context.newPage(); pages.push(page);
  page.on('pageerror', (error) => report.pageErrors.push({ label, message: error.message }));
  await page.goto(url);
  await page.waitForFunction(() => window.inferencePanel?.runtime.networkReady, null, { timeout: 60000 });
  await page.waitForFunction(() => window.inferencePanel.runtime.getDiscoveryStatus, null, { timeout: 5000 });
  return page;
}
async function discover(page, hostId, hosted = true) {
  await page.waitForFunction(({ cid, hostId, hosted }) => {
    const r = inferencePanel.runtime;
    const found = r.listInferenceTargets().some((t) => !t.local && t.manifestCid === cid && t.hosts?.some((h) => h.peerId === hostId));
    return found === hosted;
  }, { cid: descriptor.manifestCid, hostId, hosted }, { timeout: 60000 });
}
try {
  const previewCache = path.join(homedir(), '.cache/peercompute-preview');
  seedServer = createServer({
    cert: await readFile(process.env.SSL_CERT || path.join(previewCache, 'tls/fastbox.crt')),
    key: await readFile(process.env.SSL_KEY || path.join(previewCache, 'tls/fastbox.key')),
  }, (request, response) => {
    const file = decodeURIComponent(new URL(request.url, 'https://localhost').pathname.slice('/seed/'.length));
    const entry = model.files.find((item) => item.path === file);
    if (request.method !== 'GET' || !request.url.startsWith('/seed/') || !entry) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'content-type': 'application/octet-stream', 'content-length': entry.size,
      'access-control-allow-origin': '*', 'cross-origin-resource-policy': 'cross-origin' });
    const stream = createReadStream(path.join(source, file));
    stream.on('error', () => response.destroy()); response.on('close', () => stream.destroy()); stream.pipe(response);
  });
  await new Promise((resolve) => seedServer.listen(0, '0.0.0.0', resolve));
  const seedOrigin = `https://${new URL(url).hostname}:${seedServer.address().port}`;
  const hostBrowser = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', headless: true,
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] });
  browsers.push(hostBrowser);
  const hostContext = await hostBrowser.newContext();
  const expectedPrefix = `https://huggingface.co/${model.repository}/resolve/${model.revision}/`;
  await hostContext.route('https://huggingface.co/**', async (route) => {
    const request = route.request().url();
    const file = request.startsWith(expectedPrefix) ? decodeURIComponent(request.slice(expectedPrefix.length).split('?')[0]) : null;
    if (!file || !model.files.some((entry) => entry.path === file)) return route.abort();
    report.modelFiles.push(file);
    await route.fulfill({ status: 307, headers: { location: `${seedOrigin}/seed/${file}`,
      'access-control-allow-origin': '*', 'cross-origin-resource-policy': 'cross-origin' } });
  });
  const host = await open(hostContext, 'host');
  const hostId = (await snapshot(host, 'host-connected')).peerId;
  await host.evaluate(() => { inferencePanel.runtime.services.onnx.collectGpuEvidence = true; });
  await bounded(host.evaluate((modelId) => inferencePanel.runtime.acquireModel(`hf:${modelId}`), modelId), 'Owned model load timed out', 180000);
  const hostState = await host.evaluate(() => inferencePanel.runtime.service.getStatus());
  assert.equal(hostState.status, 'ready'); report.hostModel = hostState;
  descriptor.manifestCid = report.manifestCid = hostState.manifestCid;
  const sameLibrary = await open(hostContext, 'same-library');
  await sameLibrary.waitForFunction(() => inferencePanel.runtime.getArtifactNetworkStatus().status === 'error', null, { timeout: 30000 });
  const same = await snapshot(sameLibrary, 'same-library-artifact-conflict');
  assert.equal(same.ready, true); assert.notEqual(same.peerId, hostId);
  const requesterBrowser = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
  browsers.push(requesterBrowser); const requester = await open(await requesterBrowser.newContext(), 'independent');
  for (const [label, page] of [['same-library', sameLibrary], ['independent', requester]]) {
    await discover(page, hostId);
    await page.waitForFunction((cid) => Array.from(document.querySelectorAll('[aria-label="Chat target"] option')).some((o) => o.value === `peer:${cid}`), descriptor.manifestCid);
    await page.waitForFunction((cid) => inferencePanel.runtime.listModelSources().some((s) => s.key === `peer:${cid}`), descriptor.manifestCid, { timeout: 60000 });
    const state = await snapshot(page, label + '-discovered');
    assert(state.sources.some((s) => s.key === `peer:${descriptor.manifestCid}`));
    assert(state.targets.some((t) => t.hosts.some((h) => h.peerId === hostId)));
  }
  // Send only when this exact model is hosted solely by our owned browser.
  const hosts = await requester.evaluate((cid) => inferencePanel.runtime.listInferenceTargets().find((t) => t.manifestCid === cid)?.hosts, descriptor.manifestCid);
  assert.deepEqual(hosts.map((h) => h.peerId), [hostId], 'Avoid submitting a test prompt to an unrelated host');
  report.reply = await bounded(requester.evaluate((cid) => inferencePanel.runtime.generate(`peer:${cid}`, {
    prompt: 'Say hello in one short sentence.', maxNewTokens: 32,
  }), descriptor.manifestCid), 'Remote inference timed out');
  assert(report.reply.text.trim()); assert(report.reply.gpuDispatches > 0);
  for (const viewport of [{ width: 866, height: 900 }, { width: 390, height: 844 }]) {
    await requester.setViewportSize(viewport);
    await requester.locator('.pc-model-toolbar').getByRole('button', { name: 'Models', exact: true }).click();
    const browser = requester.getByRole('dialog', { name: 'Models', exact: true });
    await browser.waitFor({ state: 'visible' });
    await browser.getByRole('tab', { name: 'Browse models', exact: true }).click();
    const boxes = await browser.locator('[data-model-key]').evaluateAll((options) => options.map((option) => {
      const b = option.getBoundingClientRect(); return { x: b.x, right: b.right, width: b.width, height: b.height };
    }));
    assert(boxes.length > 0, 'Model browser must contain discovered/catalog rows');
    assert(boxes.every((b) => b.x >= 0 && b.right <= viewport.width));
    await requester.screenshot({ path: output.replace('.json', `-${viewport.width}.png`) });
    await requester.keyboard.press('Escape');
  }
  await host.evaluate(() => inferencePanel.runtime.setHostInference(false));
  await discover(requester, hostId, false);
  await snapshot(requester, 'hosting-disabled');
  await host.evaluate(() => inferencePanel.runtime.setHostInference(true));
  await discover(requester, hostId); await snapshot(requester, 'hosting-restored');
  assert.deepEqual(report.pageErrors, []); report.passed = true;
} catch (error) { report.passed = false; report.error = error.stack; process.exitCode = 1; }
finally {
  for (const page of pages.slice().reverse()) {
    try { await bounded(page.evaluate(() => window.inferencePanel?.dispose()), 'Panel disposal timed out', 30000); }
    catch (error) { (report.cleanupErrors ??= []).push(error.message); }
  }
  for (const browser of browsers.reverse()) await browser.close();
  if (seedServer) { seedServer.closeAllConnections(); await new Promise((resolve) => seedServer.close(resolve)); }
  if (report.cleanupErrors?.length) { report.passed = false; process.exitCode = 1; }
  report.finishedAt = new Date().toISOString(); report.closedOwnedBrowsers = true;
  await writeFile(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, error: report.error, output, samples: report.samples.length, cleanupErrors: report.cleanupErrors }));
}
