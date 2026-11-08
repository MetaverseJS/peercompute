import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Real public Hub metadata + one small, newly discovered package. No peer prompts
// or weight publication. All browsing and actual loading use the shipped modules.
const repo = fileURLToPath(new URL('../../', import.meta.url));
const evidence = process.env.HF_BROWSER_EVIDENCE || '/tmp/peercompute-huggingface-browser';
const repository = 'onnx-community/SmolLM2-135M-Instruct-ONNX';
const report = { startedAt: new Date().toISOString(), repository, pageErrors: [], consoleErrors: [], requests: [], screenshots: [] };
await mkdir(evidence, { recursive: true });
const profile = await mkdtemp(path.join(os.tmpdir(), 'peercompute-hf-'));
let server, context, page, forbidHub = false, phase = 'browse';
const html = (await readFile(path.join(repo, 'demos/inference/index.html'), 'utf8')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace('</body>', `<script type="module">
import { mountInferencePanel } from '/src/agentPanel.js';
import { createInferenceRuntime } from '/src/runtime.js';
window.inferencePanel = await mountInferencePanel({ container: document.querySelector('#panel'), autoConnect: true,
  runtimeFactory: async (options) => {
    const runtime = await createInferenceRuntime({ ...options, storeName: 'hf-browser-acceptance', collectGpuEvidence: true });
    await runtime.setSharing(false); await runtime.setHostInference(false);
    if (!location.search.includes('restart')) runtime.getStartupModel = () => null;
    return runtime;
  } });
</script></body>`);
async function screenshot(name) {
  const filename = path.join(evidence, `${name}.png`); await page.screenshot({ path: filename, fullPage: true }); report.screenshots.push(filename);
}
async function launch(origin, restart = false) {
  context = await chromium.launchPersistentContext(profile, { executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: true, ignoreHTTPSErrors: true, viewport: { width: 1360, height: 960 },
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE',
      '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] });
  const cdp = await context.browser().newBrowserCDPSession();
  report.renderer = (await cdp.send('SystemInfo.getInfo')).gpu.auxAttributes.glRenderer;
  assert.match(report.renderer, /NVIDIA|AMD|Intel/);
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    report.requests.push({ phase, url: url.origin + url.pathname, range: route.request().headers().range ?? null });
    if (forbidHub && url.hostname !== 'secretworkshop.net') return route.abort('blockedbyclient');
    return route.continue();
  });
  page = await context.newPage();
  page.on('pageerror', (error) => report.pageErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text().slice(0, 1500)); });
  await page.goto(`${origin}/__hf_acceptance${restart ? '?restart=1' : ''}`);
  await page.waitForFunction(() => window.inferencePanel?.runtime?.getDeviceCapabilities(), null, { timeout: 90000 });
}
try {
  server = await createServer({ configFile: path.join(repo, 'demos/inference/vite.config.js'), logLevel: 'error',
    server: { port: 0, host: '127.0.0.1', hmr: false },
    plugins: [{ name: 'hf-acceptance', configureServer(vite) {
      vite.middlewares.use('/__hf_acceptance', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); response.end(html);
      });
    } }] });
  await server.listen(); const origin = 'https://127.0.0.1:' + server.httpServer.address().port;
  report.origin = origin; await launch(origin);
  await page.locator('.pc-model-toolbar').getByRole('button', { name: 'Models', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Models', exact: true });
  await dialog.getByRole('tab', { name: 'Browse models', exact: true }).click();
  await dialog.getByRole('searchbox', { name: 'Search models' }).fill(repository.split('/')[1]);
  await dialog.locator(`[data-model-key="hub:${repository}"]`).click({ timeout: 60000 });
  await dialog.getByRole('combobox', { name: 'Package variant', exact: true }).waitFor({ timeout: 60000 });
  const variants = await dialog.getByRole('combobox', { name: 'Package variant' }).locator('option').evaluateAll((options) => options.map((option) => ({ value: option.value, label: option.textContent })));
  report.variants = variants;
  const q4 = variants.find((variant) => /\bq4\b/i.test(variant.label) && !/q4f16/i.test(variant.label));
  assert(q4, 'Resolver must offer q4 for the novel model');
  await dialog.getByRole('combobox', { name: 'Package variant' }).selectOption(q4.value);
  report.details = await dialog.getByRole('region', { name: 'Model details' }).innerText();
  await page.evaluate(async (repository) => {
    const inspected = await inferencePanel.runtime.inspectModelHub(repository);
    window.selectedHubPackage = inspected.variants.find((variant) => variant.dtype === 'q4').package;
  }, repository);
  assert.match(report.details, /\b[a-f0-9]{40}\b/, 'Details show the resolved immutable revision');
  assert(!report.requests.some((request) => /\.onnx(?:_data)?$|\.gguf$/.test(new URL(request.url).pathname)), 'No model weights may download during ONNX discovery');
  await screenshot('desktop-model-browser');
  await page.setViewportSize({ width: 390, height: 844 });
  await dialog.locator(`[data-model-key="hub:${repository}"]`).click();
  await page.waitForFunction(() => document.querySelector('.pc-model-browser')?.classList.contains('pc-browser-show-details'));
  await screenshot('mobile-model-browser');
  assert(await dialog.evaluate((node) => node.getBoundingClientRect().right <= innerWidth && node.getBoundingClientRect().left >= 0));
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  assert(await dialog.isVisible(), 'Mobile detail Done returns to the model results');
  assert.equal(await dialog.getByRole('searchbox', { name: 'Search models' }).isVisible(), true);
  await page.setViewportSize({ width: 1360, height: 960 });
  phase = 'load';
  await dialog.getByRole('button', { name: 'Load', exact: true }).click();
  await page.getByRole('dialog', { name: 'Loading model', exact: true }).waitFor({ state: 'visible' });
  await page.waitForFunction(() => inferencePanel.runtime.service.getStatus().status === 'ready', null, { timeout: 300000 });
  await page.getByRole('dialog', { name: 'Loading model', exact: true }).waitFor({ state: 'hidden', timeout: 30000 });
  report.load = await page.evaluate(() => inferencePanel.runtime.service.getStatus());
  assert(report.load.evidence.workerId); assert.equal(report.load.evidence.adapter.isFallbackAdapter, false);
  phase = 'generate';
  report.generation = await page.evaluate(() => inferencePanel.runtime.generate('local', { messages: [{ role: 'user', content: 'Write one short sentence about a garden.' }], maxNewTokens: 24 }));
  assert(report.generation.text.trim()); assert(report.generation.gpuDispatches > 0 && report.generation.gpuSubmissions > 0);
  await page.waitForFunction(() => inferencePanel.runtime.getDiscoveryStatus().connected, null, { timeout: 90000 });
  report.discovery = await page.evaluate(() => inferencePanel.runtime.getDiscoveryStatus());
  report.modelSources = await page.evaluate(() => inferencePanel.runtime.listModelSources().filter((source) => source.source === 'stored'));
  assert.equal(report.modelSources.length, 1);
  const manifestCid = report.load.manifestCid;
  phase = 'retained-reacquire'; forbidHub = true;
  await page.evaluate(() => inferencePanel.runtime.acquireHubModel(window.selectedHubPackage));
  assert.equal((await page.evaluate(() => inferencePanel.runtime.service.getStatus())).manifestCid, manifestCid);
  assert(!report.requests.some((request) => request.phase === 'retained-reacquire' && new URL(request.url).hostname !== 'secretworkshop.net'),
    'Exact retained Hub package reuse verifies sidecars locally without re-downloading weights');
  report.retainedReacquire = true;
  await page.evaluate(() => inferencePanel.dispose()); await context.close(); context = null;
  phase = 'source-off-restart'; forbidHub = true;
  await launch(origin, true);
  const retainedDialog = page.getByRole('dialog', { name: 'Models', exact: true });
  await retainedDialog.waitFor({ state: 'visible' });
  assert.equal(await retainedDialog.getByRole('tab', { name: 'Stored models', exact: true }).getAttribute('aria-selected'), 'true');
  const retainedRow = retainedDialog.locator(`[data-model-cid="${manifestCid}"]`);
  await retainedRow.waitFor();
  assert.equal(await page.evaluate(() => inferencePanel.runtime.service.getStatus().status), 'idle', 'Saved packages await explicit startup selection');
  await retainedRow.getByRole('checkbox').check();
  await retainedDialog.getByRole('button', { name: 'Load selected models', exact: true }).click();
  await page.waitForFunction(() => inferencePanel.runtime.service.getStatus().status === 'ready', null, { timeout: 180000 });
  await page.getByRole('dialog', { name: 'Loading model', exact: true }).waitFor({ state: 'hidden', timeout: 30000 });
  if (await retainedDialog.isVisible()) await retainedDialog.getByRole('button', { name: 'Done', exact: true }).first().click();
  report.restart = await page.evaluate(() => inferencePanel.runtime.service.getStatus());
  assert.equal(report.restart.manifestCid, manifestCid);
  report.restartGeneration = await page.evaluate(() => inferencePanel.runtime.generate('local', { messages: [{ role: 'user', content: 'Say hello.' }], maxNewTokens: 8 }));
  assert(report.restartGeneration.text.trim());
  assert(!report.requests.some((request) => request.phase === 'source-off-restart' && new URL(request.url).hostname !== 'secretworkshop.net'));
  await screenshot('stored-source-off-restart');
  assert.deepEqual(report.pageErrors, []);
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = error.stack; process.exitCode = 1;
  if (page && !page.isClosed()) await screenshot('failure').catch(() => {});
} finally {
  if (page && !page.isClosed()) await page.evaluate(() => window.inferencePanel?.dispose()).catch(() => {});
  await context?.close(); await server?.close(); await rm(profile, { recursive: true, force: true });
  report.finishedAt = new Date().toISOString(); await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, error: report.error, renderer: report.renderer, evidence }));
}
