import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Opt-in hardware acceptance using an owned, preseeded browser profile. No downloads.
const repo = fileURLToPath(new URL('../../', import.meta.url));
const profile = process.env.AGENT_MODEL_PROFILE;
assert(profile, 'Set AGENT_MODEL_PROFILE to an owned profile containing a previously verified model package');
const repository = process.env.AGENT_MODEL_REPOSITORY || 'onnx-community/gemma-3-270m-it-ONNX';
const evidence = process.env.AGENT_EVIDENCE || '/tmp/peercompute-agent-browser';
const port = Number(process.env.AGENT_MODEL_PORT || 5291);
const report = { startedAt: new Date().toISOString(), repository, scope: 'Actual managed WebGPU agent execution and private persistence; all external requests blocked',
  pageErrors: [], consoleErrors: [], external: [], screenshots: [], cleanupErrors: [] };
await mkdir(evidence, { recursive: true });
let server, context, page, phase = 'startup';
const save = () => writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
const html = (await readFile(path.join(repo, 'demos/inference/index.html'), 'utf8'))
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace('</body>', `<script type="module">
    import { mountInferencePanel } from '/src/agentPanel.js';
    import { createInferenceRuntime } from '/src/runtime.js';
    window.agentCalls = [];
    window.inferencePanel = await mountInferencePanel({container:document.querySelector('#panel'),autoConnect:false,
      runtimeFactory:async options=>{
        const runtime=await createInferenceRuntime({...options,storeName:'model-support-acceptance',collectGpuEvidence:true});
        await runtime.setSharing(false); await runtime.setHostInference(false); runtime.getStartupModel=()=>null;
        const generate=runtime.generate.bind(runtime);
        runtime.generate=(target,input)=>{agentCalls.push({target,messages:input.messages,prompt:input.prompt}); return generate(target,input);};
        return runtime;
      }});
    window.agentController=await inferencePanel.runtime.getAgentController();
  </script></body>`);
async function bounded(promise, ms, name) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timed out`)), ms); })]); }
  finally { clearTimeout(timer); }
}
async function launch(origin) {
  context = await chromium.launchPersistentContext(profile, { executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: true, ignoreHTTPSErrors: true, viewport: { width: 1320, height: 960 },
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE',
      '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] });
  const cdp = await context.browser().newBrowserCDPSession();
  report.renderer = (await cdp.send('SystemInfo.getInfo')).gpu.auxAttributes.glRenderer;
  assert.match(report.renderer, /NVIDIA|AMD|Intel/);
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    report.external.push({ phase, url: url.origin + url.pathname }); return route.abort();
  });
  page = await context.newPage();
  page.on('pageerror', (error) => report.pageErrors.push({ phase, message: error.message }));
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push({ phase, message: message.text().slice(0, 2000) }); });
  page.on('crash', () => { report.crash = phase; void context.close(); });
  await page.goto(origin + '/__agent_acceptance');
  await page.waitForFunction(() => window.agentController, null, { timeout: 90000 });
}
async function loadStored() {
  return bounded(page.evaluate(async (repository) => {
    const runtime = inferencePanel.runtime;
    const records = await runtime.listStoredModels();
    let entry;
    for (const item of records) {
      const manifest = await runtime.store.getManifest(item.manifestCid);
      if (manifest.model?.repository === repository) { entry = item; break; }
    }
    if (!entry) throw new Error('No retained package for ' + repository);
    const loaded = await runtime.loadStoredModel(entry.manifestCid);
    return { manifestCid: entry.manifestCid, loaded, status: runtime.service.getStatus() };
  }, repository), 300000, 'Stored model load');
}
try {
  server = await createServer({ configFile: path.join(repo, 'demos/inference/vite.config.js'), logLevel: 'error',
    server: { host: '127.0.0.1', port, strictPort: true, hmr: false }, plugins: [{ name: 'agent-acceptance', configureServer(vite) {
      vite.middlewares.use('/__agent_acceptance', (_request, response) => {
        response.setHeader('Content-Type', 'text/html'); response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); response.end(html);
      });
    } }] });
  await server.listen(); const origin = `https://127.0.0.1:${port}`; report.origin = origin;
  await launch(origin); report.load = await loadStored();
  assert.equal(report.load.status.status, 'ready');
  phase = 'local-agent';
  report.created = await page.evaluate(async () => {
    const head = await agentController.create({ name: 'Acceptance Ada', instructions: 'You are a concise helpful agent.',
      goals: ['Answer short questions about the saved context.'], summary: 'The garden has blue flowers.', inferenceMode: 'local-only' });
    await agentController.resume(head.agentId); return head;
  });
  const id = report.created.agentId;
  report.first = await bounded(page.evaluate(async (id) => {
    const result = await agentController.run(id, { prompt: 'What color are the flowers in the garden? Answer briefly.', maxNewTokens: 32 });
    return { ...result, calls: agentCalls, events: await agentController.events(id, { limit: 100 }) };
  }, id), 300000, 'First agent response');
  assert.match(report.first.result.text, /blue/i); assert.equal(report.first.route.local, true);
  assert.equal(report.first.route.manifestCid, report.load.manifestCid);
  assert.match(JSON.stringify(report.first.calls[0].messages), /blue flowers/);
  assert(report.first.events.some((event) => event.type === 'result'));
  assert(report.first.result.gpuDispatches > 0 || report.first.result.gpuSubmissions > 0);
  await page.getByRole('button', { name: 'Agents', exact: true }).click();
  await page.getByRole('dialog', { name: 'Agents', exact: true }).waitFor();
  const screenshot = path.join(evidence, 'agent-local.png'); await page.screenshot({ path: screenshot, fullPage: true }); report.screenshots.push(screenshot);
  await page.evaluate(() => inferencePanel.dispose()); await context.close(); context = null;
  phase = 'restart'; await launch(origin);
  report.restarted = await page.evaluate(async (id) => ({ head: await agentController.get(id),
    events: await agentController.events(id, { limit: 100 }), calls: agentCalls }), id);
  assert.equal(report.restarted.head.agentId, id); assert.equal(report.restarted.head.identity.name, 'Acceptance Ada');
  assert.equal(report.restarted.head.context.summary, 'The garden has blue flowers.');
  assert(report.restarted.events.some((event) => event.type === 'result')); assert.deepEqual(report.restarted.calls, []);
  report.reload = await loadStored();
  report.second = await bounded(page.evaluate(async (id) => {
    await agentController.resume(id);
    const result = await agentController.run(id, { prompt: 'Describe that garden in one short sentence.', maxNewTokens: 32 });
    return { ...result, calls: agentCalls };
  }, id), 300000, 'Agent response after restart');
  assert.match(report.second.result.text, /blue/i);
  assert(report.second.calls[0].messages.some((message) => message.role === 'assistant' && message.content === report.first.result.text));
  phase = 'cancel';
  report.cancel = await bounded(page.evaluate(async (id) => {
    let tokens = 0, error;
    const controller = new AbortController();
    try { await agentController.run(id, { prompt: 'Write a long list of garden plants with descriptions.', maxNewTokens: 128,
      signal: controller.signal, onEvent(event) { if (event.type === 'token' && ++tokens === 1) controller.abort(new DOMException('Acceptance cancel', 'AbortError')); } }); }
    catch (cause) { error = { name: cause.name, message: cause.message }; }
    return { tokens, error, head: await agentController.get(id), status: inferencePanel.runtime.service.getStatus() };
  }, id), 300000, 'Agent cancellation');
  assert(report.cancel.tokens > 0); assert.equal(report.cancel.error.name, 'AbortError');
  assert.equal(report.cancel.status.status, 'ready');
  phase = 'cleanup';
  report.cleanup = await page.evaluate(async (id) => {
    await agentController.remove(id);
    await inferencePanel.runtime.service.unloadModel();
    const pressure = inferencePanel.runtime.computeManager.resourceBroker.reportPressure();
    await inferencePanel.dispose(); return pressure;
  }, id);
  assert.equal(report.cleanup.activeLeaseCount, 0);
  assert.equal(report.cleanup.pools.cpu.activeMemoryBytes, 0);
  assert.equal(report.cleanup.pools.gpu.activeMemoryBytes, 0);
  assert.deepEqual(report.external, []); assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.consoleErrors, []);
  report.passed = true;
} catch (error) {
  report.passed = false; report.failedPhase = phase; report.error = error.stack; process.exitCode = 1;
} finally {
  if (page && !page.isClosed()) await bounded(page.evaluate(() => window.inferencePanel?.dispose()), 20000, 'Runtime cleanup')
    .catch((error) => report.cleanupErrors.push(error.message));
  if (context) await bounded(context.close(), 15000, 'Browser close').catch((error) => report.cleanupErrors.push(error.message));
  if (server) await server.close().catch((error) => report.cleanupErrors.push(error.message));
  if (report.cleanupErrors.length) { report.passed = false; process.exitCode = 1; }
  report.finishedAt = new Date().toISOString(); await save();
  console.log(JSON.stringify({ passed: report.passed, evidence, failedPhase: report.failedPhase, error: report.error }));
}
