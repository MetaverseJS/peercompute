import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Real models in an owned disk-backed browser profile. Run one GPU case at a time.
// All model import/generation goes through the shipped runtime and ComputeManager.
const repo = fileURLToPath(new URL('../../', import.meta.url));
const evidence = process.env.MODEL_SUPPORT_EVIDENCE || '/tmp/peercompute-model-support';
const dataRoot = process.env.MODEL_SUPPORT_DATA_DIR || os.tmpdir();
const repository = process.env.MODEL_SUPPORT_REPO || 'onnx-community/OpenReasoning-Nemotron-1.5B-ONNX';
const dtype = process.env.MODEL_SUPPORT_DTYPE || 'q4';
const selectedVariant = process.env.MODEL_SUPPORT_VARIANT;
const source = process.env.MODEL_SUPPORT_SOURCE;
const report = { startedAt: new Date().toISOString(), repository, dtype, selectedVariant, source,
  pageErrors: [], consoleErrors: [], requests: [], progress: [], screenshots: [] };
await mkdir(evidence, { recursive: true }); await mkdir(dataRoot, { recursive: true });
const persistent = process.env.MODEL_SUPPORT_PROFILE;
const profile = persistent || await mkdtemp(path.join(dataRoot, 'peercompute-model-support-'));
let server, context, page, phase = 'inspect', forbidHub = false;
const html = (await readFile(path.join(repo, 'demos/inference/index.html'), 'utf8'))
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace('</body>', `<script type="module">
import { mountInferencePanel } from '/src/agentPanel.js';
import { createInferenceRuntime } from '/src/runtime.js';
window.inferencePanel = await mountInferencePanel({ container: document.querySelector('#panel'), autoConnect: false,
  runtimeFactory: async (options) => {
    const runtime = await createInferenceRuntime({ ...options, storeName: 'model-support-acceptance', collectGpuEvidence: true });
    await runtime.setSharing(false); await runtime.setHostInference(false); runtime.getStartupModel = () => null;
    return runtime;
  } });
</script></body>`);
async function screenshot(name) {
  const file = path.join(evidence, name + '.png'); await page.screenshot({ path: file, fullPage: true, timeout: 10000 }); report.screenshots.push(file);
}
async function bounded(promise, milliseconds, label) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} exceeded ${milliseconds}ms`)), milliseconds);
  })]); } finally { clearTimeout(timer); }
}
async function launch(origin) {
  context = await chromium.launchPersistentContext(profile, {
    executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
    ignoreHTTPSErrors: true, viewport: { width: 1360, height: 960 },
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE',
      '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface',
      ...(process.env.MODEL_SUPPORT_ENABLE_F16 === '1' ? ['--enable-dawn-features=vulkan_enable_f16_on_nvidia'] : [])],
  });
  const cdp = await context.browser().newBrowserCDPSession();
  report.renderer = (await cdp.send('SystemInfo.getInfo')).gpu.auxAttributes.glRenderer;
  assert.match(report.renderer, /NVIDIA|AMD|Intel/);
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    report.requests.push({ phase, url: url.origin + url.pathname, range: route.request().headers().range ?? null });
    if (forbidHub || !(url.hostname === 'huggingface.co' || url.hostname.endsWith('.huggingface.co') || url.hostname.endsWith('.hf.co'))) {
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  page = await context.newPage();
  page.on('crash', () => {
    (report.crashes ??= []).push({ phase, at: new Date().toISOString() });
    console.log('PAGE_CRASH', phase);
    // Close this owned context to release a hung evaluate after renderer OOM.
    void context?.close().catch(() => {});
  });
  page.on('pageerror', (error) => { report.pageErrors.push({ phase, message: error.message }); console.log('PAGE_ERROR', error.message); });
  page.on('console', (message) => {
    if (message.type() === 'error') { report.consoleErrors.push({ phase, message: message.text().slice(0, 1200) }); console.log('CONSOLE_ERROR', message.text().slice(0, 1200)); }
    if (message.text().startsWith('SUPPORT_PROGRESS ')) console.log(message.text());
  });
  await page.goto(origin + '/__model_support');
  await page.waitForFunction(() => window.inferencePanel?.runtime?.getDeviceCapabilities(), null, { timeout: 90000 });
  report.device = await page.evaluate(() => inferencePanel.runtime.getDeviceCapabilities());
  assert.equal(report.device.webgpu, true);
}
async function generate(prompt, maxNewTokens = 32) {
  return bounded(page.evaluate(async ({ prompt, maxNewTokens }) => inferencePanel.runtime.generate('local', {
    messages: Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }], maxNewTokens,
  }), { prompt, maxNewTokens }), 300000, 'Generation');
}
try {
  server = await createServer({ configFile: path.join(repo, 'demos/inference/vite.config.js'), logLevel: 'error',
    server: { port: Number(process.env.MODEL_SUPPORT_PORT || 0), strictPort: true, host: '127.0.0.1', hmr: false }, plugins: [{ name: 'model-support-acceptance', configureServer(vite) {
      vite.middlewares.use('/__model_support', (_request, response) => {
        response.setHeader('Content-Type', 'text/html'); response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); response.end(html);
      });
    } }] });
  await server.listen(); const origin = 'https://127.0.0.1:' + server.httpServer.address().port; report.origin = origin;
  await launch(origin);
  if (source) {
    report.conversions = await bounded(page.evaluate((source) => inferencePanel.runtime.findModelConversions(source), source), 120000, 'Conversion lookup');
    assert(report.conversions.items.some((item) => item.repository === repository), 'Source model must discover the selected conversion');
  }
  report.inspection = await bounded(page.evaluate(async ({ repository, dtype, selectedVariant }) => {
    let result = await inferencePanel.runtime.inspectModelHub(repository);
    if (selectedVariant) result = await inferencePanel.runtime.inspectModelHub(
      `https://huggingface.co/${repository}/tree/${result.revision}`, { selectedVariant });
    const variant = result.variants.find((item) => selectedVariant
      ? item.filePath === selectedVariant || item.files?.some((file) => file.path === selectedVariant)
      : item.dtype === dtype);
    if (!variant?.loadable) throw new Error(variant?.reason || 'Requested package is absent');
    window.supportPackage = variant.package;
    return { revision: result.revision, totalBytes: variant.totalBytes, model: variant.model,
      compatibility: inferencePanel.runtime.getModelCompatibility(variant.package) };
  }, { repository, dtype, selectedVariant }), 120000, 'Inspection');
  assert.notEqual(report.inspection.compatibility.status, 'unavailable', JSON.stringify(report.inspection.compatibility));
  const weightRequests = report.requests.filter((request) => /\.(onnx|gguf)(?:_data(?:_\d+)?)?$/.test(new URL(request.url).pathname));
  assert(weightRequests.every((request) => selectedVariant && request.range
    && /^bytes=\d+-\d+$/.test(request.range)), 'Inspection may only read bounded GGUF header ranges');
  console.log(JSON.stringify({ phase, repository, inspection: report.inspection }));
  phase = 'load';
  report.load = await bounded(page.evaluate(async () => {
    const runtime = inferencePanel.runtime;
    window.supportProgress = [];
    await runtime.acquireHubModel(window.supportPackage, { onProgress: (event) => {
      if (event.type === 'model-load' || event.phase || event.stage) {
        const item = { type: event.type, phase: event.phase, stage: event.stage, file: event.file ?? event.path, status: event.status, loaded: event.loaded, total: event.total, totalBytes: event.totalBytes };
        window.supportProgress.push(item);
        if (window.supportProgress.length > 100) window.supportProgress.shift();
        const key = [item.type, item.phase, item.stage, item.file, item.status].join(':');
        const changed = key !== window.supportProgressKey;
        const byteProgress = item.status?.startsWith('progress');
        const interval = Date.now() - (window.supportProgressAt ?? 0) > 5000;
        if ((changed && (!byteProgress || interval)) || (item.stage === 'import' && interval)) {
          console.log('SUPPORT_PROGRESS ' + JSON.stringify(item)); window.supportProgressAt = Date.now();
        }
        window.supportProgressKey = key;
      }
    } });
    return runtime.service.getStatus();
  }), report.inspection.totalBytes > 4 * 1024 ** 3 ? 3600000 : 900000, 'Import and managed worker load');
  assert.equal(report.load.status, 'ready'); assert(report.load.evidence.workerId);
  assert.equal(report.load.evidence.adapter.isFallbackAdapter, false);
  report.progress = await page.evaluate(() => window.supportProgress);
  const manifestCid = report.load.manifestCid;
  phase = 'generate'; report.first = await generate('Reply with one short sentence about a garden.');
  assert(report.first.text.trim()); assert(report.first.gpuDispatches > 0 && report.first.gpuSubmissions > 0);
  report.second = await generate('Reply with one short sentence about the ocean.');
  assert(report.second.text.trim()); assert(report.second.gpuDispatches > 0);
  assert.notEqual(report.second.text, report.first.text, 'Different prompts must not reuse the previous answer');
  report.repeat = await generate('Reply with one short sentence about a garden.');
  assert.equal(report.repeat.text, report.first.text, 'A fresh request must reset model state and reproduce deterministic output');
  report.multiTurn = await generate([
    { role: 'system', content: 'Answer the latest user question briefly.' },
    { role: 'user', content: 'What is one plus one?' }, { role: 'assistant', content: '2' },
    { role: 'user', content: 'What is two plus three? Reply using the numeral.' },
  ], 32);
  assert.match(report.multiTurn.text, /(?:^|\s)5(?:[.\s]|$)/, 'System and multi-turn template must preserve the latest request');
  console.log(JSON.stringify({ phase, repository, first: report.first.text, second: report.second.text }));
  phase = 'cancel';
  report.cancel = await bounded(page.evaluate(async () => {
    const runtime = inferencePanel.runtime, requestId = 'support-cancel';
    let cancelled = false;
    const result = runtime.generate('local', { requestId,
      messages: [{ role: 'user', content: 'Write a long description of the history of gardens.' }], maxNewTokens: 128,
      onToken: () => { if (!cancelled) { cancelled = true; void runtime.cancel(requestId); } },
    }).then((value) => ({ finished: true, text: value.text }), (error) => ({ error: error.message, name: error.name }));
    const value = await result; return { ...value, cancelled };
  }), 180000, 'Cancellation');
  assert(report.cancel.cancelled, 'Cancellation must be exercised during generation');
  assert.equal(report.cancel.name, 'AbortError', 'Streaming cancellation must reject the active request');
  phase = 'after-cancel'; report.afterCancel = await generate('Say hello.', 8); assert(report.afterCancel.text.trim());
  await screenshot('loaded');
  phase = 'unload';
  report.unload = await page.evaluate(async () => {
    await inferencePanel.runtime.unload();
    return { status: inferencePanel.runtime.service.getStatus(), pressure: inferencePanel.runtime.computeManager.resourceBroker.reportPressure() };
  });
  assert.notEqual(report.unload.status.status, 'ready');
  assert.equal(report.unload.pressure.activeLeaseCount, 0, 'Unload must release all model resource reservations');
  await page.evaluate(() => inferencePanel.dispose()); await context.close(); context = null;
  phase = 'source-off-restart'; forbidHub = true;
  await launch(origin);
  report.restart = await bounded(page.evaluate(async (cid) => {
    await inferencePanel.runtime.loadStoredModel(cid); return inferencePanel.runtime.service.getStatus();
  }, manifestCid), 300000, 'Stored restart');
  assert.equal(report.restart.manifestCid, manifestCid);
  report.restartGeneration = await generate('Say hello.', 8); assert(report.restartGeneration.text.trim());
  assert(report.restartGeneration.gpuDispatches > 0);
  assert(!report.requests.some((request) => request.phase === phase), 'Stored reload must use no external sources');
  await screenshot('source-off-restart'); assert.deepEqual(report.pageErrors, []);
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = error.stack; report.failedPhase = phase; process.exitCode = 1;
  if (page && !page.isClosed()) {
    report.progress = await bounded(page.evaluate(() => window.supportProgress ?? []), 5000, 'Failure progress').catch(() => []);
    await screenshot('failure').catch(() => {});
  }
} finally {
  if (page && !page.isClosed()) await bounded(page.evaluate(() => window.inferencePanel?.dispose()), 30000, 'Cleanup').catch(() => {});
  await context?.close(); await server?.close();
  if (!persistent) await rm(profile, { recursive: true, force: true });
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, phase, error: report.error, repository, evidence }));
}
