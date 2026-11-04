import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { DEFAULT_MODEL_ID } from '../inference/src/modelPreferences.js';
import { resolveOverviewUrl } from '../inference/src/ui/consoleNavigation.js';

// Real storage and managed GPU execution in an owned, temporary browser profile.
// Only the small, immutable SmolVLM package is downloaded. Never prompt peers.
const url = process.env.PREVIEW_URL || 'https://fastbox.tail5c077c.ts.net:5189/?dev=1';
const output = process.env.LIBRARY_EVIDENCE || '/tmp/peercompute-model-library-selection';
const modelId = 'smolvlm-256m-q4';
const report = { url, startedAt: new Date().toISOString(), modelId,
  scope: 'Owned browser, real IndexedDB and managed WebGPU, normal pinned HF downloads, local inference only',
  pageErrors: [], consoleErrors: [], cleanupErrors: [], modelRequests: [], screenshots: [] };
await mkdir(output, { recursive: true });
let browser, page, forbidModelDownloads = false;
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
async function selected() { return page.getByRole('combobox', { name: 'Model and source', exact: true }).inputValue(); }
async function modelStatus() { return page.evaluate(() => inferencePanel.runtime.service.getStatus()); }
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: process.env.LIBRARY_HEADED !== '1', args: ['--enable-unsafe-webgpu'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('https://**/*', (route) => {
    const request = route.request(), requestUrl = new URL(request.url());
    let modelSource = false;
    for (let link = request; link; link = link.redirectedFrom()) {
      const host = new URL(link.url()).hostname;
      if (host === 'huggingface.co' || host.endsWith('.huggingface.co') || host === 'hf.co' || host.endsWith('.hf.co')) modelSource = true;
    }
    const unexpectedExternal = requestUrl.origin !== new URL(url).origin && requestUrl.hostname !== 'secretworkshop.net';
    if (modelSource || (forbidModelDownloads && unexpectedExternal)) {
      report.modelRequests.push({ url: request.url(), forbidden: forbidModelDownloads });
      if (forbidModelDownloads) return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  page = await context.newPage();
  page.on('pageerror', (error) => report.pageErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  await page.goto(url); await ready();
  assert.equal(await selected(), `hf:${DEFAULT_MODEL_ID}`);
  assert.equal((await modelStatus()).status, 'idle', 'Selecting the default must not auto-load');
  assert.equal(report.modelRequests.length, 0, 'Startup must not download model files');
  const arrow = page.getByRole('link', { name: 'Back to demo overview', exact: true });
  assert.equal(await arrow.getAttribute('href'), resolveOverviewUrl(url));
  report.overviewUrl = resolveOverviewUrl(url);
  assert.equal((await context.request.get(report.overviewUrl)).status(), 200, 'The actual overview link must resolve');
  await page.getByRole('button', { name: 'About and links', exact: true }).click();
  const about = page.getByRole('dialog', { name: 'About PeerCompute', exact: true });
  await about.waitFor({ state: 'visible' });
  assert.deepEqual((await about.locator('a').evaluateAll((links) => links.map((a) => a.href))).sort(),
    ['https://huggingface.co/Tsotchke-Corporation', 'https://tsotchke.org/', 'https://tsotchke.net/'].sort());
  assert.match(await about.innerText(), /WebGPU/); assert.match(await about.innerText(), /IPFS/);
  await snapshot('about-desktop'); await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'About and links', exact: true }).evaluate((e) => e === document.activeElement), true);
  report.sources = await page.evaluate(() => inferencePanel.runtime.listModelSources().map(({ key, totalBytes }) => ({ key, totalBytes })));
  const sizes = report.sources.map((entry) => Number.isFinite(entry.totalBytes) && entry.totalBytes >= 0 ? entry.totalBytes : Infinity);
  assert(sizes.every((size, index) => !index || sizes[index - 1] <= size));
  const picker = page.getByRole('combobox', { name: 'Model and source', exact: true });
  await picker.selectOption(`hf:${modelId}`);
  await page.getByRole('button', { name: 'Import Model', exact: true }).click();
  await page.waitForFunction(() => window.inferencePanel?.runtime.service.getStatus().status === 'ready', null, { timeout: 240000 });
  const initial = await modelStatus(); report.manifestCid = initial.manifestCid;
  await page.waitForFunction(() => !document.querySelector('select[aria-label="Model and source"]').disabled);
  assert.equal(await page.evaluate(() => inferencePanel.runtime.getPreferredModelSourceKey()), `hf:${modelId}`);
  const imported = report.modelRequests.length;
  assert(imported > 0, 'The initial package was imported normally');
  forbidModelDownloads = true;
  await page.reload(); await ready();
  assert.equal(await selected(), `hf:${modelId}`, 'Reload restores the last successfully used stored model');
  assert.equal((await modelStatus()).status, 'idle', 'Restoring a selection must not auto-load');
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  const library = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  const row = library.locator('.pc-stored-model').filter({ hasText: 'SmolVLM 256M' });
  await row.waitFor(); await snapshot('stored-desktop');
  await row.getByRole('button', { name: /^Load / }).click();
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
  await page.getByRole('button', { name: 'About and links', exact: true }).click();
  const bounds = await about.boundingBox(); assert(bounds.x >= -1 && bounds.x + bounds.width <= 391);
  await snapshot('about-mobile'); await page.keyboard.press('Escape');
  await snapshot('loaded-mobile');
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  await row.getByRole('button', { name: /^Delete / }).click();
  await page.waitForFunction(async () => (await inferencePanel.runtime.listStoredModels()).length === 0, null, { timeout: 120000 });
  await page.waitForFunction(() => !document.querySelector('select[aria-label="Model and source"]').disabled);
  await page.reload(); await ready();
  assert.equal(await selected(), `hf:${DEFAULT_MODEL_ID}`, 'Deleted remembered package falls back to the requested Qwen');
  assert.equal((await modelStatus()).status, 'idle');
  assert.equal(report.modelRequests.length, imported);
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
