import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { MODEL_CATALOG, modelFileUrl } from '../../peercompute/src/peercompute/inference/modelCatalog.js';
import { resolveOverviewUrl } from '../inference/src/ui/consoleNavigation.js';

// Real storage and managed GPU execution in an owned, temporary browser profile.
// Only the small, immutable SmolVLM package is downloaded. Never prompt peers.
const url = process.env.PREVIEW_URL || 'https://fastbox.tail5c077c.ts.net:5189/?dev=1';
const output = process.env.LIBRARY_EVIDENCE || '/tmp/peercompute-model-library-selection';
const modelId = 'smolvlm-256m-q4';
const verifyCancellation = process.env.LIBRARY_VERIFY_LOAD_CANCEL === '1';
const allowedModelUrls = new Set(MODEL_CATALOG[modelId].files.map((file) => modelFileUrl(modelId, file.path)));
const report = { url, startedAt: new Date().toISOString(), modelId,
  scope: 'Owned browser, real IndexedDB and managed WebGPU, normal pinned HF downloads, local inference only',
  verifyCancellation, pageErrors: [], consoleErrors: [], cleanupErrors: [], modelRequests: [], unexpectedModelRequests: [], screenshots: [] };
await mkdir(output, { recursive: true });
let browser, page, forbidModelDownloads = false, phase = 'initial-fallback';
const snapshot = async (name) => {
  const file = path.join(output, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true }); report.screenshots.push(file);
};
async function ready() {
  await page.waitForFunction(() => window.inferencePanel?.runtime?.getDeviceCapabilities(), null, { timeout: 90000 });
  // This test checks local storage/load behavior, not availability to strangers.
  await page.evaluate(async () => {
    inferencePanel.runtime.services.onnx.collectGpuEvidence = true;
    await inferencePanel.runtime.setHostInference(false);
    await inferencePanel.runtime.setSharing(false);
  });
}
async function selected() { return page.locator('[aria-label="Current model"]').getAttribute('data-source-key'); }
async function modelStatus() { return page.evaluate(() => inferencePanel.runtime.service.getStatus()); }
async function loaded() {
  await page.waitForFunction(() => window.inferencePanel?.runtime.service.getStatus().status === 'ready', null, { timeout: 240000 });
  await page.locator('.pc-model-loading').waitFor({ state: 'hidden', timeout: 30000 });
  await page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent === 'Browse models').disabled);
}
async function cancelLoad(method, label) {
  const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
  await overlay.waitFor({ state: 'visible', timeout: 30000 });
  await snapshot(`${label}-loading`);
  if (method === 'escape') await page.keyboard.press('Escape');
  else await overlay.getByRole('button', { name: 'Cancel', exact: true }).click();
  // Cancellation is complete only after the actual runtime promise settles.
  await overlay.waitFor({ state: 'hidden', timeout: 120000 });
  await page.waitForFunction(() => inferencePanel.runtime.service.getStatus().status === 'idle', null, { timeout: 30000 });
  await page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent === 'Browse models').disabled);
  const status = await page.locator('.pc-inference-panel > [role="status"]').innerText();
  assert(!/Error:|cleanup.*incomplete/i.test(status), status);
  report[label] = { status: await modelStatus(), message: status, method,
    retained: await page.evaluate(() => inferencePanel.runtime.listStoredModels()) };
}
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: process.env.LIBRARY_HEADED !== '1', args: ['--enable-unsafe-webgpu'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('https://**/*', (route) => {
    const request = route.request(), requestUrl = new URL(request.url());
    let modelSource = false, allowedModel = false;
    for (let link = request; link; link = link.redirectedFrom()) {
      const host = new URL(link.url()).hostname;
      if (host === 'huggingface.co' || host.endsWith('.huggingface.co') || host === 'hf.co' || host.endsWith('.hf.co')) modelSource = true;
      if (allowedModelUrls.has(link.url())) allowedModel = true;
    }
    const unexpectedExternal = requestUrl.origin !== new URL(url).origin && requestUrl.hostname !== 'secretworkshop.net';
    if (modelSource || (forbidModelDownloads && unexpectedExternal)) {
      report.modelRequests.push({ url: request.url(), forbidden: forbidModelDownloads, phase, allowedModel });
      if (modelSource && !allowedModel) {
        report.unexpectedModelRequests.push(request.url()); return route.abort('blockedbyclient');
      }
      if (forbidModelDownloads) return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  page = await context.newPage();
  page.on('pageerror', (error) => report.pageErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  await page.goto(url); await ready();
  report.defaultStartup = await page.evaluate(() => inferencePanel.runtime.getStartupModel());
  assert.equal(report.defaultStartup.sourceKey, `hf:${modelId}`, 'The actual no-f16 fallback must be the bounded SmolVLM package');
  assert(!['unavailable', 'checking'].includes(report.defaultStartup.localAvailability.status));
  assert.equal(await selected(), report.defaultStartup.sourceKey);
  if (verifyCancellation) {
    await cancelLoad('button', 'initialCancellation');
    phase = 'manual-retry';
    await page.getByRole('button', { name: 'Load', exact: true }).click();
  }
  await loaded();
  report.initialAutoStart = { ...await modelStatus(), retriedAfterCancellation: verifyCancellation };
  report.manifestCid = report.initialAutoStart.manifestCid;
  const arrow = page.getByRole('link', { name: 'Back to demo overview', exact: true });
  assert.equal(await arrow.getAttribute('href'), resolveOverviewUrl(url));
  report.overviewUrl = resolveOverviewUrl(url);
  assert.equal((await context.request.get(report.overviewUrl)).status(), 200, 'The actual overview link must resolve');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'About', exact: true }).click();
  const about = page.getByRole('dialog', { name: 'About PeerCompute', exact: true });
  await about.waitFor({ state: 'visible' });
  assert.deepEqual((await about.locator('a').evaluateAll((links) => links.map((a) => a.href))).sort(),
    ['https://huggingface.co/Tsotchke-Corporation', 'https://tsotchke.org/', 'https://tsotchke.net/'].sort());
  assert.match(await about.innerText(), /WebGPU/); assert.match(await about.innerText(), /IPFS/);
  await snapshot('about-desktop'); await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).evaluate((e) => e === document.activeElement), true);
  report.sources = await page.evaluate(() => inferencePanel.runtime.listModelSources().map(({ key, totalBytes }) => ({ key, totalBytes })));
  const sizes = report.sources.map((entry) => Number.isFinite(entry.totalBytes) && entry.totalBytes >= 0 ? entry.totalBytes : Infinity);
  assert(sizes.every((size, index) => !index || sizes[index - 1] <= size));
  assert.equal(await page.evaluate(() => inferencePanel.runtime.getPreferredModelSourceKey()), `hf:${modelId}`);
  const imported = report.modelRequests.length;
  assert(imported > 0, 'The initial package was imported normally');
  forbidModelDownloads = true;
  phase = 'retained-startup-picker';
  await page.reload(); await ready();
  assert.equal(await selected(), `hf:${modelId}`, 'Reload restores the last successfully used stored model');
  const library = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  const row = library.locator('.pc-stored-model').filter({ hasText: 'SmolVLM 256M' });
  await library.waitFor({ state: 'visible' }); await row.waitFor();
  const startupState = () => page.evaluate(() => ({
    residents: inferencePanel.runtime.listResidentModels(),
    services: Object.fromEntries(Object.entries(inferencePanel.runtime.services).map(([key, service]) => [key, service.getStatus().status])),
    leases: inferencePanel.runtime.computeManager.resourceBroker.reportPressure().activeLeaseCount,
  }));
  report.storedStartupPicker = await startupState();
  assert.deepEqual(report.storedStartupPicker.residents, [], 'Saved packages must wait for explicit selection before loading');
  assert(Object.values(report.storedStartupPicker.services).every((status) => status === 'idle'));
  assert.equal(report.storedStartupPicker.leases, 0);
  assert.equal(await library.getByRole('button', { name: 'Load selected models', exact: true }).isDisabled(), true);
  await snapshot('stored-startup-desktop');
  // Keep the real saved-library picker open through the normal peer refresh.
  await page.waitForTimeout(5500);
  assert.deepEqual(await startupState(), report.storedStartupPicker, 'Background refresh must not start a saved model');
  assert.equal(report.modelRequests.length, imported, 'Opening the saved-library picker must not fetch model files');
  await row.getByRole('checkbox').check();
  phase = 'explicit-stored-startup-load';
  await library.getByRole('button', { name: 'Load selected models', exact: true }).click();
  await loaded();
  report.storedSelectedLoad = await modelStatus();
  assert.equal(report.storedSelectedLoad.manifestCid, report.manifestCid, 'Explicit selection loads the remembered local package');
  assert.equal(report.modelRequests.length, imported, 'Explicit stored selection must not fetch model files');
  if (await library.isVisible()) await library.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Configure model chat', exact: true }).click();
  await page.getByRole('button', { name: 'Unload all local models', exact: true }).click();
  await page.waitForFunction(() => window.inferencePanel.runtime.service.getStatus().status === 'idle');
  await page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent === 'Browse models').disabled);
  await page.keyboard.press('Escape');
  await page.evaluate(() => { inferencePanel.runtime.services.onnx.collectGpuEvidence = true; });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  await row.waitFor(); await snapshot('stored-desktop');
  phase = 'stored-load';
  await row.getByRole('button', { name: /^Load / }).click();
  if (verifyCancellation) {
    await page.waitForFunction(() => inferencePanel.runtime.service.getStatus().status === 'loading', null, { timeout: 30000 });
    await cancelLoad('escape', 'storedCancellation');
    assert(report.storedCancellation.retained.some((entry) => entry.manifestCid === report.manifestCid));
    assert.equal(report.modelRequests.length, imported, 'Cancelled stored load must keep its verified package and avoid downloads');
    await row.getByRole('button', { name: /^Load / }).click();
  }
  await loaded();
  await library.waitFor({ state: 'hidden', timeout: 120000 });
  assert.equal((await modelStatus()).manifestCid, report.manifestCid);
  assert.equal(report.modelRequests.length, imported, 'Stored Models Load must not fetch model files');
  report.reply = await page.evaluate(async () => {
    const runtime = inferencePanel.runtime;
    return runtime.generate('local', { prompt: 'Say hello in one short sentence.', maxNewTokens: 16 });
  });
  assert(report.reply.text.trim()); assert(report.reply.gpuDispatches > 0);
  report.preferences = await page.evaluate(() => inferencePanel.runtime.getPreferences());
  assert.deepEqual(report.preferences, { sharing: false, hostInference: false });
  await snapshot('loaded-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'About', exact: true }).click();
  const bounds = await about.boundingBox(); assert(bounds.x >= -1 && bounds.x + bounds.width <= 391);
  await snapshot('about-mobile'); await page.keyboard.press('Escape');
  await snapshot('loaded-mobile');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  await row.getByRole('button', { name: /^Delete / }).click();
  await page.waitForFunction(async () => (await inferencePanel.runtime.listStoredModels()).length === 0, null, { timeout: 120000 });
  await page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent === 'Browse models').disabled);
  phase = 'deleted-library-fallback'; forbidModelDownloads = false;
  await page.reload(); await ready();
  report.deletedStartup = await page.evaluate(() => inferencePanel.runtime.getStartupModel());
  assert.equal(report.deletedStartup.sourceKey, `hf:${modelId}`, 'Deleting the saved model must reselect a supported catalog fallback');
  assert.equal(await selected(), report.deletedStartup.sourceKey);
  // Prove the fallback actually starts, then cancel instead of downloading it twice.
  await cancelLoad('button', 'deletedFallbackCancellation');
  assert.deepEqual(report.unexpectedModelRequests, []);
  assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.consoleErrors, []);
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = error.stack || String(error);
} finally {
  try { await page?.evaluate(() => window.inferencePanel?.dispose()); } catch (error) { report.cleanupErrors.push(String(error)); }
  try { await browser?.close(); } catch (error) { report.cleanupErrors.push(String(error)); }
  if (report.cleanupErrors.length) report.passed = false;
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, error: report.error, output, cleanupErrors: report.cleanupErrors }));
  if (!report.passed) process.exitCode = 1;
}
