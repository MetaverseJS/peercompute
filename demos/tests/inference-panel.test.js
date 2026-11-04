import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

let server, browser, origin;
const repo = fileURLToPath(new URL('../../', import.meta.url));
before(async () => {
  // Exercise the real standalone shell without bootstrapping its actual runtime.
  const standaloneHtml = (await readFile(new URL('../inference/index.html', import.meta.url), 'utf8'))
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  server = await createServer({ configFile: false, root: repo, logLevel: 'error',
    optimizeDeps: { entries: ['demos/inference/src/agentPanel.js'] },
    server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
    plugins: [{ name: 'inference-ui-fixture', configureServer(vite) {
      vite.middlewares.use('/__ui_fixture', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end(standaloneHtml);
      });
    } }] });
  await server.listen(); origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); });

async function openMenuAction(page, name) {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog', { name: 'Menu', exact: true }).getByRole('button', { name, exact: true }).click();
}

async function fixture(t, scenario = {}) {
  const page = await browser.newPage({ viewport: { width: 420, height: 820 } });
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://**/*', (route) => { external.push(route.request().url()); return route.abort(); });
  t.after(async () => {
    await page.evaluate(() => { window.cleaningUpFixture = true; window.finishLoadCleanup?.(); return window.panel?.dispose(); }).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__ui_fixture');
  await page.evaluate(async (scenario) => {
    const { mountInferencePanel } = await import('/demos/inference/src/agentPanel.js');
    window.calls = []; window.contextCalls = [];
    window.previewUrls = { created: [], revoked: [] };
    const createUrl = URL.createObjectURL.bind(URL), revokeUrl = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (blob) => { const url = createUrl(blob); previewUrls.created.push(url); return url; };
    URL.revokeObjectURL = (url) => { previewUrls.revoked.push(url); revokeUrl(url); };
    window.uiState = { loaded: !!scenario.loaded, providers: [true, false], remote: true, refreshCalls: 0,
      refreshActive: 0, refreshPeak: 0, disposed: false, sharing: true, hostInference: true,
      stored: scenario.stored ?? [], rejectStoredList: !!scenario.rejectStoredList,
      rejectLoad: !!scenario.rejectLoad, rejectAcquire: !!scenario.rejectAcquire,
      loadedCid: scenario.loaded ? 'fixture-vision' : null, preferredSourceKey: scenario.preferredSourceKey, sources: scenario.sources,
      availability: scenario.availability ?? {}, memoryBudgets: scenario.memoryBudgets ?? { cpuBytes: null, gpuBytes: null } };
    const state = window.uiState;
    const delay = (ms, signal) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, ms);
      const abort = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); };
      if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
    });
    const modelDelay = async (ms, signal) => {
      try { await delay(ms, signal); }
      catch (error) {
        if (scenario.waitForLoadCleanup && !window.cleaningUpFixture) {
          state.cleaning = true; calls.push({ type: 'load-cleanup' });
          await new Promise((resolve) => { window.finishLoadCleanup = resolve; });
          state.cleaning = false;
        }
        if (scenario.cleanupFailure) throw new AggregateError([error], 'Model cleanup is incomplete');
        throw error;
      }
    };
    const runtime = {
      networkReady: !scenario.connectFailure,
      getDiscoveryStatus: () => scenario.discovery,
      getArtifactNetworkStatus: () => scenario.artifactNetwork,
      store: { maximumBytes: 4 * 1024 ** 3, async importFile() { calls.push({ type: 'pin' }); } },
      getPreferences: () => ({ sharing: state.sharing, hostInference: state.hostInference }),
      getDeviceCapabilities: () => ({ deviceMemoryGiB: 8 }),
      getMemoryBudgets: () => ({ ...state.memoryBudgets }),
      setMemoryBudgets(budgets) { state.memoryBudgets = budgets; calls.push({ type: 'budgets', ...budgets }); return budgets; },
      getSharingErrors: () => state.stored.filter((model) => model.shareError).map((model) => ({ manifestCid: model.manifestCid, message: model.shareError })),
      listModelSources: () => (state.sources ?? [
        { key: 'hf:vision', name: 'Fixture vision', source: 'hf', modelId: 'smolvlm-256m-q4', runtime: 'transformers.js', modalities: scenario.diffusion ? ['text'] : ['text', 'image'],
          task: scenario.diffusion ? 'text-to-image' : 'image-text-to-text', outputModalities: scenario.diffusion ? ['image'] : ['text'] },
        { key: 'peer:fixture', name: 'Peer text model', source: 'peers', modelId: 'peer-text', manifestCid: 'fixture', runtime: 'llama.cpp', task: 'text-generation', modalities: ['text'] }])
        .map((source) => ({ ...source, localAvailability: scenario.memoryPolicy && state.memoryBudgets.cpuBytes != null
          && state.memoryBudgets.cpuBytes < 4 * 1024 ** 3 ? { status: 'unavailable', reason: 'Needs 4 GiB RAM.' }
          : state.availability[source.key] ?? { status: 'unknown', cpuBytes: 4 * 1024 ** 3, gpuBytes: 8 * 1024 ** 3 } })),
      listInferenceTargets: () => [{ key: 'local', name: state.loaded ? 'Fixture vision' : 'No model loaded', local: true,
        available: state.loaded, busy: false, modalities: scenario.diffusion ? ['text'] : ['text', 'image'],
        task: scenario.diffusion ? 'text-to-image' : 'image-text-to-text', outputModalities: scenario.diffusion ? ['image'] : ['text'] }, ...(state.remote ? [{ key: 'peer:fixture',
        name: 'Peer text model', local: false, available: true, busy: state.providers.every(Boolean),
        providerCount: state.providers.length, modalities: ['text'],
        task: scenario.diffusion ? 'text-to-image' : 'text-generation', outputModalities: scenario.diffusion ? ['image'] : ['text'] }] : [])],
      async refreshPeers({ signal }) {
        state.refreshCalls++; state.refreshPeak = Math.max(state.refreshPeak, ++state.refreshActive);
        try { await delay(scenario.refreshDelay ?? 1, signal); if (state.refreshError) throw new Error('Offline'); }
        finally { state.refreshActive--; }
      },
      async acquireModel(key, options) { calls.push({ type: 'acquire', key, gpuLayers: options.ggufGpuLayers });
        if (scenario.importProgress) {
          window.emitImportProgress = options.onProgress;
          for (const event of [
            { stage: 'import', path: 'LICENSE', index: 6, total: 7, loaded: 1024, totalBytes: 1024 },
            { stage: 'verify' }, { stage: 'load' }, { type: 'model-load', stage: 'unet', loaded: 0, total: 1000 },
          ]) { options.onProgress(event); await delay(150, options.signal); }
        }
        await modelDelay(scenario.acquireDelay ?? 5, options.signal);
        if (state.rejectAcquire) throw new Error('Model download failed');
        state.loaded = true; state.loadedCid = 'fixture-vision'; calls.push({ type: 'loaded' }); },
      ...(scenario.startup ? { getStartupModel: () => ({ ...scenario.startup, localAvailability: state.availability[scenario.startup.sourceKey] ?? scenario.startup.localAvailability }) } : {}),
      ...(scenario.preferredSourceKey ? { getPreferredModelSourceKey: () => state.preferredSourceKey } : {}),
      async loadStoredModel(cid, options) {
        calls.push({ type: 'load-stored', cid, gpuLayers: options.ggufGpuLayers });
        options.onProgress?.({ stage: 'verify' });
        await modelDelay(scenario.loadStoredDelay ?? 20, options.signal);
        if (state.rejectLoad) throw new Error('Stored model could not be loaded');
        state.loaded = true; state.loadedCid = cid;
        state.preferredSourceKey = (state.sources ?? []).find((source) => source.manifestCid === cid)?.key ?? 'hf:vision';
        return { manifestCid: cid };
      },
      async setSharing(value) { if (state.rejectSharing) throw new Error('Sharing failed'); state.sharing = value; calls.push({ type: 'sharing', value }); },
      async setHostInference(value) { state.hostInference = value; calls.push({ type: 'hosting', value }); },
      async generate(target, options) {
        calls.push({ type: 'generate', target, requestId: options.requestId, messages: options.messages,
          prompt: options.prompt, maxNewTokens: options.maxNewTokens,
          image: options.image ? { width: options.image.width, height: options.image.height, bytes: options.image.data.length } : null });
        await delay(scenario.generateDelay ?? 1, scenario.ignoreAbort ? undefined : options.signal);
        if (scenario.diffusion) {
          options.onProgress?.({ type: 'diffusion-progress', stage: 'denoise', step: 1, steps: 1 });
          const data = new Uint8Array(512 * 512 * 4);
          for (let index = 0; index < data.length; index += 4) { data[index] = 220; data[index + 3] = 255; }
          return { text: '', seed: 42, steps: 1, image: scenario.invalidImage
            ? { width: 2048, height: 2048, channels: 4, data } : { width: 512, height: 512, channels: 4, data } };
        }
        const text = scenario.longReply ? Array.from({ length: 70 }, (_, i) => 'Reply line ' + i).join('\n') : 'Reply to ' + options.messages.at(-1).content;
        options.onToken?.(text); return { text, inputTokens: 4, outputTokens: scenario.outputTokens ?? 8,
          finishReason: scenario.finishReason ?? 'stop', contextTruncated: !!scenario.contextTruncated };
      },
      async cancel(requestId) { calls.push({ type: 'cancel', requestId }); return true; },
      async unload() { state.loaded = false; state.loadedCid = null; calls.push({ type: 'unload' }); },
      async listStoredModels({ signal } = {}) {
        calls.push({ type: 'stored-list' }); await delay(10, signal);
        if (state.rejectStoredList) throw new Error('Storage is temporarily unavailable');
        return state.stored.map((model) => ({ ...model, loaded: state.loaded && model.manifestCid === state.loadedCid }));
      },
      async deleteStoredModel(cid, { signal } = {}) {
        calls.push({ type: 'delete', cid }); await delay(scenario.deleteDelay ?? 20, signal);
        if (state.rejectDelete) throw new Error('Model is still in use');
        const unloaded = state.loaded && cid === state.loadedCid;
        if (unloaded) state.loaded = false;
        if (state.cleanupFails) {
          state.stored.find((model) => model.manifestCid === cid).cleanupPending = true;
          throw new Error('Storage cleanup interrupted');
        }
        state.stored = state.stored.filter((model) => model.manifestCid !== cid);
        return { deleted: true, unloaded, freedBytes: 1024 ** 2 };
      },
      setStorageQuota(bytes) { runtime.store.maximumBytes = bytes; },
      async connectBackend() { if (scenario.connectFailure) throw new Error('Relay unavailable'); }, async connect() {}, async dispose() {
        state.disposeAttempts = (state.disposeAttempts ?? 0) + 1;
        if (scenario.disposeFailsOnce && state.disposeAttempts === 1) throw new Error('Worker stop not acknowledged');
        state.disposed = true;
      },
    };
    let installListener;
    window.installState = { available: !!scenario.pwaAvailable, installed: false, installing: false, supported: true, instructions: 'Use your browser menu to install this app.' };
    window.emitInstall = (state) => { Object.assign(installState, state); installListener?.({ ...installState }); };
    const pwaInstallController = scenario.pwa ? {
      getState: () => ({ ...installState }),
      subscribe(listener) { installListener = listener; listener({ ...installState }); return () => { installListener = null; calls.push({ type: 'unsubscribe-install' }); }; },
      async install() { calls.push({ type: 'install' });
        if (scenario.installDelay) await delay(scenario.installDelay);
        if (!installState.available) return { outcome: 'unavailable', instructions: installState.instructions };
        emitInstall({ installed: true, available: false }); return { outcome: 'accepted' }; },
      dispose() { calls.push({ type: 'dispose-install-controller' }); },
    } : undefined;
    window.panel = await mountInferencePanel({ pwaInstallController, container: document.querySelector('#panel'), runtimeFactory: async () => runtime,
      autoConnect: !!scenario.connectFailure,
      refreshIntervalMs: scenario.interval ?? 5000,
      ...(scenario.context ? { getContext: (options) => { contextCalls.push(options); return { text: 'Optional embedded scene context', image: { forbidden: true } }; },
        actions: { instructions: 'Suggest an approved action.', invalidate() {}, propose() { return [{ label: 'test action', apply() { calls.push({ type: 'action' }); } }]; } } } : {}) });
  }, scenario);
  return page;
}

test('unloaded injected runtime defaults sharing and hosting on without Close, CID or scene controls', async (t) => {
  const page = await fixture(t);
  assert.equal(await page.getByLabel('Share with peers', { exact: true }).isChecked(), true);
  assert.equal(await page.getByLabel('Host inference', { exact: true }).isChecked(), true);
  assert.equal(await page.getByLabel('Share with peers', { exact: true }).isVisible(), false);
  assert.equal(await page.getByLabel('Host inference', { exact: true }).isVisible(), false);
  assert.equal(await page.getByRole('button', { name: 'Close', exact: true }).count(), 0);
  assert.equal(await page.locator('input[placeholder*="CID"],canvas').count(), 0);
  assert.equal(await page.getByLabel('Local artifact storage limit').count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
  await openMenuAction(page, 'Configure model chat');
  assert.equal(await page.getByRole('dialog', { name: 'Config', exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Share with peers', { exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Host inference', { exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Local artifact storage limit').count(), 0);
  assert.equal(await page.getByLabel('GGUF GPU layer limit').isVisible(), true);
  assert.equal(await page.locator('input[placeholder*="CID"]').count(), 0);
  const html = await readFile(new URL('../inference/index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../inference/src/main.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html + main, /<canvas|LOCAL MODEL LAB|getContext|square|circle/);
});

test('unified import selects either source and automatically makes local chat available', async (t) => {
  const page = await fixture(t);
  await page.getByLabel('Model and source').selectOption('peer:fixture');
  await page.getByRole('button', { name: 'Load', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'loaded'));
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'local');
  await page.getByLabel('Message', { exact: true }).fill('Hello');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), [{ type: 'acquire', key: 'peer:fixture', gpuLayers: 99999 }]);
  await openMenuAction(page, 'Configure model chat');
  await page.getByLabel('Share with peers', { exact: true }).uncheck();
  await page.getByLabel('Host inference', { exact: true }).uncheck();
  await page.waitForFunction(() => !uiState.sharing && !uiState.hostInference);
});

test('model filter uses AND terms across source, name, ID, task and runtime without changing chat targets', async (t) => {
  const page = await fixture(t, { interval: 50 });
  const filter = page.getByRole('searchbox', { name: 'Filter models' });
  const source = page.getByLabel('Model and source');
  const target = page.getByLabel('Chat target');
  await source.selectOption('peer:fixture'); await target.selectOption('peer:fixture');
  const targetOptions = await target.locator('option').allTextContents();
  await filter.fill('HUGGING fixture smolvlm image-text transformers');
  assert.equal(await source.inputValue(), 'hf:vision'); assert.equal(await source.locator('option').count(), 1);
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await filter.inputValue(), 'HUGGING fixture smolvlm image-text transformers');
  assert.equal(await source.inputValue(), 'hf:vision');
  assert.deepEqual(await target.locator('option').allTextContents(), targetOptions);
  assert.equal(await target.inputValue(), 'peer:fixture');
  await filter.fill('no such model');
  assert.equal(await source.locator('option:checked').textContent(), 'No matching models');
  assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.match(await page.locator('.pc-model-availability').textContent(), /No matching models/);
  await filter.fill(''); assert.equal(await source.inputValue(), 'peer:fixture');
  await filter.fill('Peers llama text-generation');
  assert.equal(await source.inputValue(), 'peer:fixture'); assert.equal(await source.locator('option').count(), 1);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
});

test('unavailable and checking models offer setup help and cannot import even through a stale handler', async (t) => {
  const page = await fixture(t, { loaded: true, interval: 50, availability: {
    'hf:vision': { status: 'unavailable', reason: 'Needs 12 GiB GPU memory.' },
    'peer:fixture': { status: 'checking', reason: 'Checking WebGPU support…' },
  } });
  const source = page.getByLabel('Model and source');
  assert.equal(await source.locator('option[data-unavailable=true]').count(), 2);
  assert.match(await source.locator('option[value="hf:vision"]').textContent(), /Setup required/);
  assert.match(await page.locator('.pc-model-availability').textContent(), /Checking WebGPU support/);
  const acquire = page.getByRole('button', { name: 'Load', exact: true });
  assert.equal(await acquire.isDisabled(), true);
  await acquire.evaluate((button) => button.onclick());
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
  await source.selectOption('hf:vision');
  const help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  assert.match(await help.textContent(), /Needs 12 GiB GPU memory/);
  await help.getByRole('button', { name: 'Done', exact: true }).click();
  await page.evaluate(() => { uiState.availability['hf:vision'] = { status: 'unknown', reason: 'Free GPU memory is unknown.' }; });
  await page.waitForFunction(() => !document.querySelector('[aria-label="Model and source"] option').disabled);
  assert.equal(await acquire.isEnabled(), true);
  assert.match(await page.locator('.pc-model-availability').textContent(), /Free GPU memory is unknown/);
  // Runtime state changes before the next UI refresh; the click handler still rechecks it.
  await page.evaluate(() => {
    uiState.availability['hf:vision'] = { status: 'unavailable', reason: 'Device is incompatible.' };
    return [...document.querySelectorAll('button')].find((button) => button.textContent === 'Load').onclick();
  });
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
  await help.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Use the peer instead.');
  await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  assert.equal(await page.evaluate(() => calls.find((call) => call.type === 'generate').target), 'peer:fixture');
});

test('Config memory budgets convert GiB, refresh restrictions, clear to auto and reject invalid values', async (t) => {
  const page = await fixture(t, { memoryPolicy: true });
  await openMenuAction(page, 'Configure model chat');
  const cpu = page.getByLabel('Model RAM budget (GiB)', { exact: true });
  const gpu = page.getByLabel('Model GPU memory budget (GiB)', { exact: true });
  assert.equal(await cpu.inputValue(), ''); assert.equal(await gpu.inputValue(), '');
  assert.match(await page.getByRole('dialog', { name: 'Config', exact: true }).textContent(), /approximately 8 GiB.*cannot report free GPU memory/);
  await cpu.fill('2.5'); await cpu.dispatchEvent('change');
  assert.deepEqual(await page.evaluate(() => uiState.memoryBudgets), { cpuBytes: 2.5 * 1024 ** 3, gpuBytes: null });
  assert.equal(await page.getByLabel('Model and source').locator('option[data-unavailable=true]').count(), 2);
  await gpu.fill('6'); await gpu.dispatchEvent('change');
  assert.deepEqual(await page.evaluate(() => uiState.memoryBudgets), { cpuBytes: 2.5 * 1024 ** 3, gpuBytes: 6 * 1024 ** 3 });
  await cpu.focus(); // Commit the GPU field's native blur/change before counting rejected edits.
  const before = await page.evaluate(() => calls.filter((call) => call.type === 'budgets').length);
  for (const invalid of ['0', '-2', '1025', '1e309']) {
    await cpu.fill(invalid); await cpu.dispatchEvent('change');
    assert.equal(await cpu.getAttribute('aria-invalid'), 'true');
    assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'budgets').length), before, invalid);
  }
  await cpu.fill(''); await cpu.dispatchEvent('change');
  await gpu.fill(''); await gpu.dispatchEvent('change');
  assert.deepEqual(await page.evaluate(() => uiState.memoryBudgets), { cpuBytes: null, gpuBytes: null });
  assert.equal(await page.getByLabel('Model and source').locator('option:disabled').count(), 0);
  assert.equal(await cpu.getAttribute('aria-invalid'), null);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire' || call.type === 'pin')), []);
});

test('model filtering and memory budgets are disabled during an active import', async (t) => {
  const page = await fixture(t, { acquireDelay: 10000 });
  await page.getByRole('button', { name: 'Load', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'acquire'));
  assert.equal(await page.getByRole('searchbox', { name: 'Filter models' }).isDisabled(), true);
  assert.equal(await page.getByRole('dialog', { name: 'Loading model', exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Model RAM budget (GiB)', { exact: true }).isDisabled(), true);
  assert.equal(await page.getByLabel('Model GPU memory budget (GiB)', { exact: true }).isDisabled(), true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[aria-label="Filter models"]').disabled);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'budgets')), []);
});

test('Enter sends, Shift+Enter preserves a newline, optional embedded context stays text-only and actions require clicks', async (t) => {
  const page = await fixture(t, { loaded: true, context: true, longReply: true });
  const input = page.getByLabel('Message', { exact: true });
  await input.fill('First'); await input.press('Shift+Enter'); await input.type('Second');
  assert.equal(await input.inputValue(), 'First\nSecond');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'generate').length), 0);
  await input.press('Enter');
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent === 'Ready.' && calls.some((c) => c.type === 'generate'));
  const result = await page.evaluate(() => ({ request: calls.find((call) => call.type === 'generate'), contextCalls,
    actions: calls.filter((call) => call.type === 'action').length,
    bottom: document.querySelector('[role=log]').scrollHeight - document.querySelector('[role=log]').clientHeight - document.querySelector('[role=log]').scrollTop }));
  assert.equal(result.request.messages.at(-1).content, 'First\nSecond'); assert.equal(result.request.image, null);
  assert.equal(result.request.maxNewTokens, 1024);
  assert.match(result.request.messages[0].content, /Optional embedded scene context/);
  assert.deepEqual(result.contextCalls, [{ includeImage: false }]); assert.equal(result.actions, 0); assert(result.bottom < 3);
  await page.getByRole('button', { name: 'Apply: test action', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'action').length), 1);
});

test('local and peer replies retain their full text and visibly report generation limits', async (t) => {
  for (const target of ['local', 'peer:fixture']) {
    const page = await fixture(t, { loaded: true, longReply: true, finishReason: 'length', outputTokens: 1024, contextTruncated: true });
    await page.getByLabel('Chat target').selectOption(target);
    await page.getByLabel('Message', { exact: true }).fill('Explain how rainbows form in detail.');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('log').getByText(/Response reached the model’s output or context limit/).waitFor();
    const reply = page.locator('.pc-chat-message-assistant').last();
    assert.match(await reply.textContent(), /Reply line 69/);
    assert.match(await reply.textContent(), /Older conversation turns were omitted/);
    assert.equal(await page.evaluate(() => calls.find((call) => call.type === 'generate').maxNewTokens), 1024);
    const bottom = await page.getByRole('log').evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop);
    assert.ok(bottom < 3);
    await page.getByLabel('Message', { exact: true }).fill('Explain the colors.');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.waitForFunction(() => calls.filter((call) => call.type === 'generate').length === 2);
    assert.doesNotMatch(await page.evaluate(() => JSON.stringify(calls.filter((call) => call.type === 'generate')[1].messages)), /Response reached|Older conversation/);
  }
});

test('unknown completion is distinguished from an explicit normal stop', async (t) => {
  for (const finishReason of ['unknown', 'stop']) {
    const page = await fixture(t, { loaded: true, finishReason, outputTokens: 1024 });
    await page.getByLabel('Message', { exact: true }).fill('Describe a rainbow.');
    await page.getByLabel('Message', { exact: true }).press('Enter');
    await page.waitForFunction(() => document.querySelector('.pc-chat-message-assistant p')?.textContent);
    const message = await page.locator('.pc-chat-message-assistant').textContent();
    assert.equal(message.includes('did not report whether'), finishReason === 'unknown');
    assert.doesNotMatch(message, /Response reached/);
  }
});

test('Config clears conversation context without unloading a model or changing storage', async (t) => {
  const page = await fixture(t, { loaded: true, generateDelay: 300 });
  const input = page.getByLabel('Message', { exact: true });
  await input.fill('Explain clouds.'); await input.press('Enter');
  await openMenuAction(page, 'Configure model chat');
  const clear = page.getByRole('button', { name: 'Clear conversation', exact: true });
  assert.equal(await clear.isDisabled(), true);
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent === 'Ready.');
  await clear.click();
  assert.equal(await page.locator('.pc-chat-message').count(), 0);
  assert.equal(await page.evaluate(() => uiState.loaded), true);
  await page.keyboard.press('Escape'); await input.fill('Explain rain.'); await input.press('Enter');
  await page.waitForFunction(() => calls.filter((call) => call.type === 'generate').length === 2);
  const request = await page.evaluate(() => calls.filter((call) => call.type === 'generate')[1]);
  assert.deepEqual(request.messages, [{ role: 'user', content: 'Explain rain.' }]);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['unload', 'delete', 'acquire', 'pin'].includes(call.type))), []);
});

test('model entries show estimated RAM and GPU requirements without claiming detected capacity', async (t) => {
  const page = await fixture(t, { availability: { 'peer:fixture': { status: 'unknown', cpuBytes: 0, gpuBytes: 0 } } });
  const source = page.getByLabel('Model and source');
  assert.match(await source.locator('option[value="hf:vision"]').textContent(), /est\. RAM 4 GiB \/ GPU 8 GiB/);
  assert.match(await source.locator('option[value="peer:fixture"]').textContent(), /est\. RAM unknown \/ GPU unknown/);
  assert.match(await page.locator('.pc-model-availability').textContent(), /Planning estimates; actual memory use varies/);
});

test('peer status distinguishes empty directories, query failures and unavailable file sharing', async (t) => {
  const page = await fixture(t, { discovery: { connected: true, peerCount: 2, sharedModelCount: 0, hostedModelCount: 0,
    errors: [{ peerId: 'fixture', code: 'ERR_DIRECTORY', message: 'Directory timed out' }] },
    artifactNetwork: { status: 'error', error: 'Another tab owns file sharing' } });
  const summary = page.locator('.pc-network-summary');
  await page.waitForFunction(() => document.querySelector('.pc-network-summary').textContent.includes('Directory timed out'));
  assert.match(await summary.textContent(), /2 peers · 0 shared models · 0 hosted models/);
  assert.match(await summary.textContent(), /File sharing unavailable: Another tab owns file sharing/);
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Hello');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), false);
});

test('discovery stays visible while file sharing prepares retained packages', async (t) => {
  const page = await fixture(t, { discovery: { connected: true, peerCount: 3, sharedModelCount: 5, hostedModelCount: 1, errors: [] },
    artifactNetwork: { status: 'starting' } });
  await page.waitForFunction(() => document.querySelector('.pc-network-summary').textContent.includes('5 shared models'));
  assert.match(await page.locator('.pc-network-summary').textContent(), /1 hosted models/);
  assert.match(await page.locator('.pc-network-summary').textContent(), /Inference discovery remains available/);
});

test('failed auto-connect stays offline with its error through later directory refreshes', async (t) => {
  const page = await fixture(t, { connectFailure: true, interval: 30 });
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  const text = await page.locator('.pc-network-summary').textContent();
  assert.match(text, /Peer network is offline/);
  assert.match(text, /Relay unavailable/);
  assert.doesNotMatch(text, /Connecting/);
});

test('opened model pickers wrap long names inside desktop and mobile viewports and retain focus during refresh', async (t) => {
  const page = await fixture(t, { interval: 50, loaded: true });
  for (const viewport of [{ width: 866, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const name of ['Model and source', 'Chat target']) {
      const select = page.getByLabel(name, { exact: true });
      await select.click();
      await page.waitForFunction((name) => document.querySelector(`select[aria-label="${name}"]`).matches(':open'), name);
      await select.locator('option').last().evaluate((option) => { option.textContent = 'Qwen very long model name '.repeat(12) + ' · Peers · est. RAM 8 GiB / GPU 16 GiB'; });
      const option = select.locator('option').last();
      const box = await option.boundingBox();
      assert.ok(box && box.x >= 0 && box.x + box.width <= viewport.width, JSON.stringify(box));
      assert.ok(box.height > 50, 'Long option must wrap over multiple lines');
      assert.equal(await option.evaluate((element) => getComputedStyle(element).whiteSpace), 'normal');
      const before = await page.evaluate(() => uiState.refreshCalls);
      await page.waitForFunction((before) => uiState.refreshCalls > before + 1, before);
      assert.equal(await select.evaluate((element) => element.matches(':open')), true);
      await page.keyboard.press('Escape');
      assert.equal(await select.evaluate((element) => element === document.activeElement), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
  }
});

test('import progress advances past the last file into verification and GPU loading', async (t) => {
  const page = await fixture(t, { importProgress: true, acquireDelay: 1200 });
  await page.getByRole('button', { name: 'Load', exact: true }).click();
  const status = page.locator('.pc-inference-panel > [role=status]');
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Downloading 7/7: LICENSE'));
  assert.match(await status.textContent(), /1.0 KiB|1 KiB/);
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Verifying stored model files'));
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Loading model into RAM'));
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Loading model: unet'));
  await page.waitForFunction(() => /Loading model: unet \(\d+s\)/.test(document.querySelector('[role=status]').textContent));
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Model ready.'));
  assert.doesNotMatch(await status.textContent(), /LICENSE|undefined/);
  await page.waitForTimeout(1050); assert.match(await status.textContent(), /Model ready/);
});

test('peer refresh marks busy only for all-busy providers and never silently changes a selected target', async (t) => {
  const page = await fixture(t, { loaded: true, interval: 50, refreshDelay: 80 });
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  assert.doesNotMatch(await page.getByLabel('Chat target').locator('option:checked').textContent(), /busy/);
  await page.evaluate(() => { uiState.providers = [true, true]; });
  await page.waitForFunction(() => document.querySelector('[aria-label="Chat target"]').selectedOptions[0].textContent.includes('(busy)'));
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Queue this for an available host.');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate' && call.target === 'peer:fixture'));
  await page.evaluate(() => { uiState.remote = false; });
  await page.waitForFunction(() => document.querySelector('[aria-label="Chat target"]').selectedOptions[0].textContent.includes('(unavailable)'));
  await page.waitForTimeout(250);
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  assert.equal(await page.evaluate(() => uiState.refreshPeak), 1);
  await page.evaluate(() => { uiState.refreshError = true; }); await page.waitForTimeout(140);
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  await page.evaluate(() => panel.dispose());
  const count = await page.evaluate(() => uiState.refreshCalls); await page.waitForTimeout(130);
  assert.equal(await page.evaluate(() => uiState.refreshCalls), count); assert.equal(await page.evaluate(() => uiState.disposed), true);
});

test('explicit file attachment is bounded and consumed by its request; standalone sends no scene context', async (t) => {
  const page = await fixture(t, { loaded: true });
  const data = await page.evaluate(() => { const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 320;
    canvas.getContext('2d').fillRect(0, 0, 640, 320); return canvas.toDataURL('image/png').split(',')[1]; });
  await page.getByLabel('Choose image attachment').setInputFiles({ name: 'selected.png', mimeType: 'image/png', buffer: Buffer.from(data, 'base64') });
  await page.getByAltText('Selected image', { exact: true }).waitFor({ state: 'visible' });
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Describe this.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('This model accepts text only'));
  assert.equal(await page.getByAltText('Selected image', { exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Describe this.');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'generate').length), 0);
  await page.getByLabel('Chat target').selectOption('local');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  const request = await page.evaluate(() => calls.find((call) => call.type === 'generate'));
  assert.deepEqual(request.image, { width: 512, height: 256, bytes: 512 * 256 * 4 });
  assert.equal(request.messages.length, 1); assert.equal(await page.getByAltText('Selected image', { exact: true }).isVisible(), false);
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
});

test('dispose aborts active generation and stops refresh before releasing the runtime', async (t) => {
  const page = await fixture(t, { loaded: true, generateDelay: 10000, interval: 50 });
  await page.getByLabel('Message', { exact: true }).fill('Pending request'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await page.evaluate(() => panel.dispose());
  assert.equal(await page.getByRole('region', { name: 'Model chat' }).count(), 0);
  assert.equal(await page.evaluate(() => uiState.disposed), true);
  const count = await page.evaluate(() => uiState.refreshCalls); await page.waitForTimeout(120);
  assert.equal(await page.evaluate(() => uiState.refreshCalls), count);
});

test('discovery refresh runs every five seconds without inventing a startup choice for an injected runtime', async (t) => {
  const page = await fixture(t);
  await page.waitForFunction(() => uiState.refreshCalls === 1);
  await page.waitForTimeout(4500);
  assert.equal(await page.evaluate(() => uiState.refreshCalls), 1);
  await page.waitForFunction(() => uiState.refreshCalls === 2, null, { timeout: 1500 });
  assert.equal(await page.evaluate(() => calls.length), 0);
});

test('Stop cancels an active request and failed preferences restore their prior value', async (t) => {
  const page = await fixture(t, { loaded: true, generateDelay: 10000 });
  await page.evaluate(() => { uiState.rejectSharing = true; });
  await openMenuAction(page, 'Configure model chat');
  await page.getByLabel('Share with peers', { exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Sharing failed'));
  assert.equal(await page.getByLabel('Share with peers', { exact: true }).isChecked(), true);
  await page.getByRole('dialog', { name: 'Config', exact: true }).getByRole('button', { name: 'Done' }).click();
  await page.getByLabel('Message', { exact: true }).fill('Cancel me'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'cancel') && document.querySelector('[role=status]').textContent.startsWith('Cancelled'));
  assert.equal(await page.getByRole('button', { name: 'Stop', exact: true }).isVisible(), false);
});

test('failed runtime teardown blocks new UI work and permits an explicit disposal retry', async (t) => {
  const page = await fixture(t, { loaded: true, disposeFailsOnce: true, interval: 50 });
  await openMenuAction(page, 'Configure model chat');
  const error = await page.evaluate(async () => { try { await panel.dispose(); } catch (error) { return error.message; } });
  assert.equal(error, 'Worker stop not acknowledged');
  assert.equal(await page.locator('.pc-inference-panel').evaluate((element) => element.inert), true);
  assert.equal(await page.locator('dialog[open]').count(), 0);
  const count = await page.evaluate(() => uiState.refreshCalls); await page.waitForTimeout(130);
  assert.equal(await page.evaluate(() => uiState.refreshCalls), count);
  await page.evaluate(() => panel.dispose());
  assert.equal(await page.evaluate(() => uiState.disposed), true);
  assert.equal(await page.locator('.pc-inference-panel').count(), 0);
});

test('standalone chat fills wide, tall and mobile viewports while embedded sizing remains bounded', async (t) => {
  const page = await fixture(t);
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 1280, height: 1600 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const bounds = await page.locator('.pc-inference-panel').boundingBox();
    assert.deepEqual(bounds, { x: 0, y: 0, ...viewport });
    const shell = await page.evaluate(() => ({ width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight, samples: document.querySelectorAll('h1,canvas,img[src]').length }));
    assert.deepEqual(shell, { width: viewport.width, height: viewport.height, samples: 0 });
  }
  await page.setViewportSize({ width: 1280, height: 1600 });
  await page.locator('#panel').evaluate((element) => { element.classList.remove('pc-inference-standalone'); element.style.width = '620px'; });
  const embedded = await page.locator('.pc-inference-panel').boundingBox();
  assert.equal(embedded.width, 620); assert.equal(embedded.height, 740);
});

test('independent menu windows trap focus, close on Escape and return to the hamburger', async (t) => {
  const page = await fixture(t, { interval: 50 });
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  for (const [trigger, name] of [['Configure model chat', 'Config'], ['Stored Models', 'Stored Models']]) {
    await openMenuAction(page, trigger);
    const modal = page.getByRole('dialog', { name, exact: true });
    assert.equal(await modal.isVisible(), true);
    assert.equal(await page.locator('dialog[open]').count(), 1);
    for (let index = 0; index < 12; index++) {
      await page.keyboard.press('Tab');
      assert.equal(await modal.evaluate((element) => element.contains(document.activeElement)), true);
    }
    const count = await page.evaluate(() => uiState.refreshCalls);
    await page.waitForFunction((count) => uiState.refreshCalls > count, count);
    await page.keyboard.press('Escape');
    assert.equal(await modal.isVisible(), false);
    assert.equal(await menu.evaluate((element) => element === document.activeElement), true);
  }
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'delete' || call.type === 'acquire')), false);
});

test('stored models list offers explicit deletion and removes a loaded package without changing another model', async (t) => {
  const page = await fixture(t, { loaded: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024 ** 3, shared: true },
    { manifestCid: 'fixture-text', name: 'Fixture text', totalBytes: 2 * 1024 ** 2, shared: false },
  ], deleteDelay: 100 });
  await page.getByLabel('Message', { exact: true }).fill('Keep my draft');
  await openMenuAction(page, 'Stored Models');
  const modal = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  const vision = modal.getByRole('button', { name: 'Delete Fixture vision', exact: true });
  await vision.waitFor();
  assert.match(await modal.textContent(), /1.00 GiB · Loaded · Shared/);
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'delete')), false);
  await vision.click();
  assert.equal(await modal.getByRole('button', { name: 'Delete Fixture text', exact: true }).isDisabled(), true);
  await page.waitForFunction(() => !uiState.loaded && uiState.stored.length === 1);
  await page.waitForFunction(() => document.querySelector('.pc-model-dialog[open] [role=status]').textContent.includes('Deleted Fixture vision.'));
  assert.equal(await vision.count(), 0);
  assert.equal(await modal.getByRole('button', { name: 'Delete Fixture text', exact: true }).isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'delete')), [{ type: 'delete', cid: 'fixture-vision' }]);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Keep my draft');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  await openMenuAction(page, 'Stored Models');
  await modal.getByRole('button', { name: 'Delete Fixture text', exact: true }).click();
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

test('stored model read and deletion failures stay visible and retryable without removing rows', async (t) => {
  const page = await fixture(t, { rejectStoredList: true, stored: [
    { manifestCid: 'fixture-text', name: 'Fixture text', totalBytes: 1024, shared: false },
  ] });
  await openMenuAction(page, 'Stored Models');
  const modal = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  await modal.getByText('Error: Storage is temporarily unavailable', { exact: true }).waitFor();
  await page.evaluate(() => { uiState.rejectStoredList = false; uiState.rejectDelete = true; });
  await modal.getByRole('button', { name: 'Refresh', exact: true }).click();
  const remove = modal.getByRole('button', { name: 'Delete Fixture text', exact: true });
  await remove.click();
  await modal.getByText('Error: Model is still in use', { exact: true }).waitFor();
  assert.equal(await remove.isEnabled(), true);
  assert.equal(await page.evaluate(() => uiState.stored.length), 1);
  await page.evaluate(() => { uiState.rejectDelete = false; }); await remove.click();
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

test('stored deletion stays disabled during a request and modal bounds fit mobile and desktop', async (t) => {
  const page = await fixture(t, { loaded: true, generateDelay: 10000, stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024, shared: true },
  ] });
  await page.getByLabel('Message', { exact: true }).fill('Pending'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const [trigger, name] of [['Stored Models', 'Stored Models'], ['Configure model chat', 'Config']]) {
      await openMenuAction(page, trigger);
      const modal = page.getByRole('dialog', { name, exact: true });
      if (name === 'Stored Models') {
        await modal.getByRole('button', { name: 'Delete Fixture vision', exact: true }).waitFor();
        assert.equal(await modal.getByRole('button', { name: 'Delete Fixture vision', exact: true }).isDisabled(), true);
      }
      const bounds = await modal.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height);
      assert.equal(await modal.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
      await page.keyboard.press('Escape');
    }
  }
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'cancel'));
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'delete')), false);
});

test('interrupted deletion refreshes the actual catalog and exposes a cleanup retry', async (t) => {
  const page = await fixture(t, { loaded: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024, shared: false },
  ] });
  await page.evaluate(() => { uiState.cleanupFails = true; });
  await openMenuAction(page, 'Stored Models');
  const modal = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  await modal.getByRole('button', { name: 'Delete Fixture vision', exact: true }).click();
  await modal.getByText('Error: Storage cleanup interrupted', { exact: true }).waitFor();
  assert.match(await modal.textContent(), /Cleanup pending/);
  assert.doesNotMatch(await modal.textContent(), /Loaded/);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 2);
  await page.keyboard.press('Escape');
  await openMenuAction(page, 'Stored Models');
  await page.evaluate(() => { uiState.cleanupFails = false; });
  await modal.getByRole('button', { name: 'Retry delete Fixture vision', exact: true }).click();
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

test('a sharing failure keeps the imported model usable and explains its library status', async (t) => {
  const page = await fixture(t, { stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024, shared: false, shareError: 'Peer network is offline' },
  ] });
  await page.getByRole('button', { name: 'Load', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Model ready. Sharing is unavailable'));
  await page.getByLabel('Message', { exact: true }).fill('Still usable');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  await openMenuAction(page, 'Stored Models');
  await page.getByRole('dialog', { name: 'Stored Models', exact: true }).getByText('Sharing unavailable: Peer network is offline', { exact: true }).waitFor();
});

test('local and peer image targets turn each prompt into a bounded image without chat context or attachments', async (t) => {
  const page = await fixture(t, { loaded: true, diffusion: true, context: true });
  const prompt = page.getByLabel('Message', { exact: true });
  assert.equal(await prompt.getAttribute('placeholder'), 'Describe an image…');
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
  for (const [target, text] of [['local', 'A red circle'], ['peer:fixture', 'A blue square']]) {
    await page.getByLabel('Chat target').selectOption(target);
    await prompt.fill(text); await prompt.press('Enter');
    await page.getByAltText(`Generated image: ${text}`, { exact: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('[role=status]').textContent === 'Ready.');
    const generated = page.getByAltText(`Generated image: ${text}`, { exact: true });
    await generated.evaluate((image) => image.decode());
    assert.deepEqual(await generated.evaluate((image) => ({ width: image.naturalWidth, height: image.naturalHeight, local: image.src.startsWith('blob:') })),
      { width: 512, height: 512, local: true });
    const bounds = await generated.boundingBox(); assert.ok(bounds.width <= 420);
  }
  const evidence = await page.evaluate(() => ({ requests: calls.filter((call) => call.type === 'generate'), contextCalls,
    actions: calls.filter((call) => call.type === 'action'), previews: previewUrls.created.length,
    writes: calls.filter((call) => ['pin', 'acquire', 'sharing'].includes(call.type)) }));
  assert.deepEqual(evidence.requests.map((call) => ({ target: call.target, prompt: call.prompt, messages: call.messages, image: call.image, maxNewTokens: call.maxNewTokens })),
    [{ target: 'local', prompt: 'A red circle', messages: undefined, image: null, maxNewTokens: undefined },
      { target: 'peer:fixture', prompt: 'A blue square', messages: undefined, image: null, maxNewTokens: undefined }]);
  assert.deepEqual(evidence.contextCalls, []); assert.deepEqual(evidence.actions, []); assert.deepEqual(evidence.writes, []);
  assert.equal(evidence.previews, 2);
  assert.equal(await page.getByRole('button', { name: 'Apply: test action', exact: true }).count(), 0);
});

test('generated image previews have a bounded history and revoke every URL on disposal', async (t) => {
  const page = await fixture(t, { loaded: true, diffusion: true });
  for (let index = 0; index < 8; index++) {
    await page.getByLabel('Message', { exact: true }).fill('Image ' + index);
    await page.getByLabel('Message', { exact: true }).press('Enter');
    await page.getByAltText('Generated image: Image ' + index, { exact: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('[role=status]').textContent === 'Ready.');
  }
  assert.equal(await page.locator('.pc-generated-image').count(), 6);
  assert.equal(await page.evaluate(() => previewUrls.revoked.length), 2);
  await page.evaluate(() => panel.dispose());
  assert.deepEqual(await page.evaluate(() => [...previewUrls.revoked].sort()), await page.evaluate(() => [...previewUrls.created].sort()));
});

test('invalid pixels and late cancelled image results never become preview URLs', async (t) => {
  const invalid = await fixture(t, { loaded: true, diffusion: true, invalidImage: true });
  await invalid.getByLabel('Message', { exact: true }).fill('Invalid output'); await invalid.getByLabel('Message', { exact: true }).press('Enter');
  await invalid.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('bounded RGBA'));
  assert.equal(await invalid.evaluate(() => previewUrls.created.length), 0);
  const cancelled = await fixture(t, { loaded: true, diffusion: true, generateDelay: 100, ignoreAbort: true });
  await cancelled.getByLabel('Message', { exact: true }).fill('Cancel output'); await cancelled.getByLabel('Message', { exact: true }).press('Enter');
  await cancelled.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await cancelled.getByRole('button', { name: 'Stop', exact: true }).click();
  await cancelled.waitForFunction(() => document.querySelector('[role=status]').textContent.startsWith('Cancelled'));
  assert.equal(await cancelled.evaluate(() => previewUrls.created.length), 0);
});

test('unsupported selection opens repeatable setup help, preserves selection and never imports', async (t) => {
  const page = await fixture(t, { interval: 50, loaded: true, availability: {
    'peer:fixture': { status: 'unavailable', code: 'gpu_feature_unavailable', reason: 'Required FP16 GPU math (shader-f16) is unavailable in this browser' },
  } });
  const source = page.getByLabel('Model and source');
  const help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  await source.selectOption('peer:fixture'); await help.waitFor();
  assert.equal(await source.inputValue(), 'hf:vision');
  assert.match(await help.textContent(), /Peer text model/);
  await help.getByLabel('Operating system', { exact: true }).selectOption('linux');
  await help.getByLabel('Browser', { exact: true }).selectOption('chrome');
  const command = help.getByLabel('Browser launch command', { exact: true });
  assert.equal(await command.inputValue(), 'google-chrome --enable-dawn-features=vulkan_enable_f16_on_nvidia');
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await help.isVisible(), true);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { async writeText(text) { window.copiedCommand = text; } } }));
  await help.getByRole('button', { name: 'Copy command', exact: true }).click();
  await page.waitForFunction(() => window.copiedCommand?.includes('vulkan_enable_f16_on_nvidia'));
  assert.equal(await page.evaluate(() => copiedCommand), await command.inputValue());
  await help.getByLabel('Browser', { exact: true }).selectOption('firefox');
  assert.equal(await command.isVisible(), false);
  assert.equal(await help.getByRole('button', { name: 'Copy command', exact: true }).isVisible(), false);
  assert.doesNotMatch(await help.textContent(), /firefox --enable-dawn/);
  await page.keyboard.press('Escape'); assert.equal(await help.isVisible(), false);
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Model and source');
  assert.equal(await source.evaluate((element) => element === document.activeElement), true);
  await source.selectOption('peer:fixture'); await help.waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'unload', 'pin', 'budgets'].includes(call.type))), []);
  assert.equal(await page.evaluate(() => uiState.loaded), true);
});

test('keyboard can open an all-unavailable choice and budget help links to Config', async (t) => {
  const unavailable = { status: 'unavailable', code: 'gpu_budget_exceeded', reason: 'Exceeds configured GPU memory budget' };
  const page = await fixture(t, { availability: { 'hf:vision': unavailable, 'peer:fixture': unavailable } });
  const source = page.getByLabel('Model and source'), help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  assert.equal(await source.inputValue(), '');
  await source.focus(); await page.keyboard.press('Space'); await page.keyboard.press('End'); await page.keyboard.press('Enter'); await help.waitFor();
  assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.equal(await help.getByLabel('Browser launch command', { exact: true }).isVisible(), false);
  await help.getByRole('button', { name: 'Open Config', exact: true }).click();
  const config = page.getByRole('dialog', { name: 'Config', exact: true });
  assert.equal(await config.isVisible(), true); assert.equal(await help.isVisible(), false);
  assert.equal(await config.evaluate((element) => element.contains(document.activeElement)), true);
  await page.keyboard.press('Escape');
  await source.selectOption('hf:vision'); await help.waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
});

test('setup command has a manual-copy fallback and dialog fits mobile with focus trapping', async (t) => {
  const page = await fixture(t, { availability: { 'hf:vision': { status: 'unavailable', code: 'gpu_feature_unavailable', reason: 'shader-f16 is required' } } });
  await page.setViewportSize({ width: 390, height: 660 });
  await page.getByLabel('Model and source').selectOption('hf:vision');
  const help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  await help.getByLabel('Browser', { exact: true }).selectOption('edge');
  await help.getByLabel('Operating system', { exact: true }).selectOption('linux');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { async writeText() { throw new Error('Denied'); } } }));
  await help.getByRole('button', { name: 'Copy command', exact: true }).click();
  await help.getByText('Clipboard unavailable. Select and copy the command above.').waitFor();
  const command = help.getByLabel('Browser launch command', { exact: true });
  const selected = await command.evaluate((element) => ({ start: element.selectionStart, end: element.selectionEnd, value: element.value, focused: document.activeElement === element }));
  assert.equal(selected.start, 0); assert.equal(selected.end, selected.value.length); assert.equal(selected.focused, true);
  assert.match(selected.value, /^microsoft-edge --enable-dawn-features=/);
  await help.getByRole('button', { name: 'Done', exact: true }).focus(); await page.keyboard.press('Shift+Tab');
  assert.equal(await help.getByRole('button', { name: 'Copy command', exact: true }).evaluate((element) => document.activeElement === element), true);
  await page.keyboard.press('Tab'); assert.equal(await help.getByRole('button', { name: 'Done', exact: true }).evaluate((element) => document.activeElement === element), true);
  const box = await help.boundingBox(); assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= 390 && box.y + box.height <= 660);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= 390), true);
  await page.evaluate(() => panel.dispose()); assert.equal(await page.locator('dialog[open]').count(), 0);
});

test('a pending clipboard response cannot change a newly reopened setup dialog', async (t) => {
  const page = await fixture(t, { availability: { 'peer:fixture': { status: 'unavailable', code: 'gpu_feature_unavailable', reason: 'shader-f16 is required' } } });
  const source = page.getByLabel('Model and source'), help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText() {
    return new Promise((resolve, reject) => { window.finishCopy = resolve; window.rejectCopy = reject; });
  } } }));
  for (const fail of [false, true]) {
    await source.selectOption('peer:fixture');
    await help.getByLabel('Browser', { exact: true }).selectOption('chrome');
    await help.getByLabel('Operating system', { exact: true }).selectOption('linux');
    await help.getByRole('button', { name: 'Copy command', exact: true }).click();
    await help.getByRole('button', { name: 'Done', exact: true }).click();
    await source.selectOption('peer:fixture');
    await help.getByLabel('Browser', { exact: true }).selectOption('chrome');
    await help.getByLabel('Operating system', { exact: true }).selectOption('linux');
    const done = help.getByRole('button', { name: 'Done', exact: true }); await done.focus();
    await page.evaluate(async (fail) => { if (fail) rejectCopy(new Error('Denied')); else finishCopy(); await new Promise((resolve) => setTimeout(resolve, 0)); }, fail);
    assert.equal(await done.evaluate((element) => element === document.activeElement), true);
    assert.equal(await help.getByRole('status').textContent(), '');
    await done.click();
  }
});

test('About menu has safe links, keyboard focus and an independent visible overview arrow', async (t) => {
  const page = await fixture(t, { interval: 50 });
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  const back = page.getByRole('link', { name: 'Back to demo overview', exact: true });
  assert.equal(await back.isVisible(), true);
  assert.equal(await page.locator('dialog[open]').count(), 0);
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const menuBox = await menu.boundingBox(), backBox = await back.boundingBox();
    assert.ok(menuBox.x > backBox.x && menuBox.x + menuBox.width <= viewport.width);
    await menu.focus(); await page.keyboard.press('Enter');
    const menuDialog = page.getByRole('dialog', { name: 'Menu', exact: true });
    assert.deepEqual(await menuDialog.getByRole('button').allTextContents(), ['Done', 'Stored Models', 'Config', 'About']);
    assert.equal(await page.locator('.pc-model-toolbar button').allTextContents().then((labels) => labels.join(',')), 'Load');
    for (let index = 0; index < 6; index++) {
      await page.keyboard.press('Tab');
      assert.equal(await menuDialog.evaluate((element) => element.contains(document.activeElement)), true);
    }
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate((element) => document.activeElement === element), true);
    await openMenuAction(page, 'About');
    assert.equal(await menuDialog.isVisible(), false);
    const modal = page.getByRole('dialog', { name: 'About PeerCompute', exact: true });
    await modal.waitFor();
    assert.match(await modal.textContent(), /WebGPU/); assert.match(await modal.textContent(), /IPFS/);
    assert.match(await modal.textContent(), /hosting browser stays online/);
    const links = await modal.getByRole('link').evaluateAll((anchors) => anchors.map((a) => ({ href: a.href, target: a.target, rel: a.rel })));
    assert.deepEqual(links.map((link) => link.href), ['https://huggingface.co/Tsotchke-Corporation', 'https://tsotchke.org/', 'https://tsotchke.net/']);
    assert.ok(links.every((link) => link.target === '_blank' && link.rel === 'noopener noreferrer'));
    for (let index = 0; index < 8; index++) {
      await page.keyboard.press('Tab');
      assert.equal(await modal.evaluate((element) => element.contains(document.activeElement)), true);
    }
    const bounds = await modal.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height);
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate((element) => document.activeElement === element), true);
  }
  assert.deepEqual(await page.evaluate(() => calls), []);
  await menu.click(); await page.evaluate(() => panel.dispose());
  assert.equal(await page.locator('dialog[open]').count(), 0);
});

test('package bytes determine source order while manual selection and peer targets survive refresh', async (t) => {
  const sources = [
    { key: 'hf:huge', name: 'A huge model', source: 'hf', totalBytes: 8 * 1024 ** 3 },
    { key: 'peer:unknown', name: 'Unknown model', source: 'peers' },
    { key: 'stored:small', name: 'Stored model', source: 'stored', manifestCid: 'small', totalBytes: 2 * 1024 ** 2 },
    { key: 'hf:tie', name: 'Tie model', source: 'hf', totalBytes: 2 * 1024 ** 2 },
    { key: 'hf:invalid', name: 'Bad size', source: 'hf', totalBytes: -1 },
  ];
  const page = await fixture(t, { sources, preferredSourceKey: 'hf:huge', interval: 50 });
  const source = page.getByLabel('Model and source');
  assert.deepEqual(await source.locator('option').evaluateAll((items) => items.map((item) => item.value)),
    ['stored:small', 'hf:tie', 'hf:huge', 'hf:invalid', 'peer:unknown']);
  assert.match(await source.locator('option[value="stored:small"]').textContent(), /Stored on this device · 2.0 MiB package/);
  assert.match(await source.locator('option[value="hf:huge"]').textContent(), /8.00 GiB package/);
  assert.match(await source.locator('option[value="peer:unknown"]').textContent(), /Unknown size/);
  assert.equal(await source.inputValue(), 'hf:huge');
  await source.selectOption('stored:small');
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  await page.evaluate(() => uiState.sources.reverse());
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await source.inputValue(), 'stored:small');
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  await page.getByLabel('Filter models').fill('local stored');
  assert.equal(await source.locator('option').count(), 1);
  await page.getByLabel('Filter models').fill('');
  assert.equal(await source.inputValue(), 'stored:small');
  assert.deepEqual(await page.evaluate(() => calls), []);
});

test('an unavailable preferred model remains selected without autoload and has explicit setup help', async (t) => {
  const page = await fixture(t, { preferredSourceKey: 'peer:fixture', interval: 50, availability: {
    'peer:fixture': { status: 'unavailable', code: 'gpu_feature_unavailable', reason: 'shader-f16 is unavailable' },
  } });
  const source = page.getByLabel('Model and source');
  assert.equal(await source.inputValue(), 'peer:fixture');
  assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await source.inputValue(), 'peer:fixture');
  await page.getByRole('button', { name: 'Set up selected model' }).click();
  const help = page.getByRole('dialog', { name: 'Model setup', exact: true }); await help.waitFor();
  assert.match(await help.textContent(), /shader-f16/);
  await page.keyboard.press('Escape'); await source.selectOption('hf:vision');
  await page.waitForTimeout(120);
  assert.equal(await source.inputValue(), 'hf:vision');
  assert.equal(await page.getByRole('button', { name: 'Set up selected model' }).isVisible(), false);
  assert.deepEqual(await page.evaluate(() => calls), []);
});

test('Stored Models loads one local package atomically, selects local chat and remembers its source', async (t) => {
  const page = await fixture(t, { loaded: true, preferredSourceKey: 'hf:vision', loadStoredDelay: 100,
    stored: [{ manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024 ** 3 },
      { manifestCid: 'small', name: 'Small stored', totalBytes: 2 * 1024 ** 2 }],
    sources: [{ key: 'hf:vision', name: 'Fixture vision', source: 'hf', totalBytes: 1024 ** 3 },
      { key: 'stored:small', name: 'Small stored', source: 'stored', manifestCid: 'small', totalBytes: 2 * 1024 ** 2 }],
  });
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  await openMenuAction(page, 'Stored Models');
  const modal = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  const load = modal.getByRole('button', { name: 'Load Small stored', exact: true }); await load.waitFor();
  assert.deepEqual(await modal.locator('.pc-stored-model strong').allTextContents(), ['Small stored', 'Fixture vision']);
  assert.equal(await modal.getByRole('button', { name: 'Loaded Fixture vision', exact: true }).isDisabled(), true);
  await load.click();
  assert.equal(await modal.getByRole('button', { name: 'Delete Fixture vision', exact: true }).isDisabled(), true);
  await load.evaluate((element) => element.onclick());
  await page.waitForFunction(() => uiState.loadedCid === 'small');
  await modal.waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 1, 'Successful loading must not leave a cancellable metadata-refresh tail');
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'local');
  assert.equal(await page.getByLabel('Model and source').inputValue(), 'stored:small');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire', 'unload', 'pin'].includes(call.type))),
    [{ type: 'load-stored', cid: 'small', gpuLayers: 99999 }]);
  await openMenuAction(page, 'Stored Models');
  await modal.getByRole('button', { name: 'Loaded Small stored', exact: true }).waitFor();
  assert.equal(await modal.getByRole('button', { name: 'Loaded Small stored', exact: true }).isDisabled(), true);
});

test('stored loading failures and cancellation remain retryable without import or download fallback', async (t) => {
  const page = await fixture(t, { loadStoredDelay: 150, stored: [{ manifestCid: 'small', name: 'Stored model', totalBytes: 1024 }] });
  await page.evaluate(() => { uiState.rejectLoad = true; });
  await openMenuAction(page, 'Stored Models');
  const modal = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  const load = modal.getByRole('button', { name: 'Load Stored model', exact: true }); await load.click();
  await modal.getByText('Error: Stored model could not be loaded', { exact: true }).waitFor();
  assert.equal(await load.isEnabled(), true);
  await page.evaluate(() => { uiState.rejectLoad = false; }); await load.click();
  await page.getByRole('dialog', { name: 'Loading model', exact: true }).getByRole('button', { name: 'Cancel', exact: true }).click();
  await modal.getByText('Cancelled: Cancelled', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => uiState.loaded), false);
  assert.equal(await load.isEnabled(), true);
  await load.click(); await modal.waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => uiState.loadedCid), 'small');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').length), 3);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'pin', 'unload'].includes(call.type))), []);
});

test('unavailable, deleting and loaded stored packages cannot start another load', async (t) => {
  const page = await fixture(t, { loaded: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Resident', totalBytes: 1024 },
    { manifestCid: 'deleting', name: 'Deleting', totalBytes: 2048, cleanupPending: true },
    { manifestCid: 'blocked', name: 'Blocked', totalBytes: 4096, localAvailability: { status: 'unavailable', code: 'gpu_budget_exceeded', reason: 'Needs more GPU memory.' } },
  ] });
  await openMenuAction(page, 'Stored Models');
  const modal = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  for (const name of ['Loaded Resident', 'Load Deleting', 'Load Blocked']) {
    const button = modal.getByRole('button', { name, exact: true }); await button.waitFor();
    assert.equal(await button.isDisabled(), true);
    if (name !== 'Load Blocked') await button.evaluate((element) => element.onclick());
  }
  assert.match(await modal.textContent(), /Needs more GPU memory/);
  await modal.getByRole('button', { name: 'Load Blocked', exact: true }).evaluate((element) => element.onclick());
  await page.getByRole('dialog', { name: 'Model setup', exact: true }).waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire', 'unload'].includes(call.type))), []);
});

test('startup downloads the default once, without waiting for the peer network', async (t) => {
  const page = await fixture(t, { startup: { sourceKey: 'hf:vision', name: 'Fixture vision' },
    acquireDelay: 100, connectFailure: true, interval: 50 });
  await page.waitForFunction(() => uiState.loaded);
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')),
    [{ type: 'acquire', key: 'hf:vision', gpuLayers: 99999 }]);
  assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Loaded Fixture vision/);
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  await page.getByLabel('Model and source').selectOption('peer:fixture');
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  assert.equal(await page.getByLabel('Model and source').inputValue(), 'peer:fixture');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'acquire').length), 1);
});

test('startup loads the remembered stored package directly with no download fallback', async (t) => {
  const page = await fixture(t, { preferredSourceKey: 'peer:fixture',
    startup: { sourceKey: 'peer:fixture', manifestCid: 'fixture', name: 'Remembered model' },
    loadStoredDelay: 100, interval: 50 });
  assert.equal(await page.getByLabel('Model and source').inputValue(), 'peer:fixture');
  await page.waitForFunction(() => uiState.loadedCid === 'fixture');
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire', 'unload', 'pin'].includes(call.type))),
    [{ type: 'load-stored', cid: 'fixture', gpuLayers: 99999 }]);
  assert.equal(await page.locator('dialog[open]').count(), 0);
});

test('blocked startup remains selected with inline help and keeps remote inference available', async (t) => {
  const page = await fixture(t, { preferredSourceKey: 'hf:vision',
    startup: { sourceKey: 'hf:vision', name: 'Fixture vision' }, interval: 50,
    availability: { 'hf:vision': { status: 'unavailable', reason: 'shader-f16 is unavailable' } } });
  assert.equal(await page.getByLabel('Model and source').inputValue(), 'hf:vision');
  assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Cannot load Fixture vision: shader-f16/);
  assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Set up selected model', exact: true }).isVisible(), true);
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.getByLabel('Chat target').selectOption('peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Hello peer');
  await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored'].includes(call.type))), []);
});

test('startup cancellation releases controls and a manual Load is an explicit retry', async (t) => {
  const page = await fixture(t, { startup: { sourceKey: 'hf:vision', name: 'Fixture vision' }, acquireDelay: 500, interval: 50 });
  assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.startsWith('Cancelled:'));
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.equal(await page.evaluate(() => uiState.loaded), false);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'acquire').length), 1);
  await page.getByRole('button', { name: 'Load', exact: true }).click();
  await page.waitForFunction(() => uiState.loaded);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'acquire').length), 2);
});

test('failed stored startup reports the error without downloading or retrying on polling', async (t) => {
  const page = await fixture(t, { startup: { sourceKey: 'hf:vision', manifestCid: 'missing', name: 'Stored model' }, rejectLoad: true, interval: 50 });
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Stored model could not be loaded'));
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire'].includes(call.type))),
    [{ type: 'load-stored', cid: 'missing', gpuLayers: 99999 }]);
  assert.equal(await page.locator('dialog[open]').count(), 0);
});

test('disposing during startup cancels the load and releases the panel', async (t) => {
  const page = await fixture(t, { startup: { sourceKey: 'hf:vision', name: 'Fixture vision' }, acquireDelay: 10000 });
  await page.evaluate(() => panel.dispose());
  assert.equal(await page.evaluate(() => uiState.loaded), false);
  assert.equal(await page.evaluate(() => uiState.disposed), true);
  assert.equal(await page.locator('.pc-inference-panel').count(), 0);
});

test('Install is explicit in the menu, supports browser guidance and unsubscribes on dispose', async (t) => {
  const page = await fixture(t, { pwa: true });
  assert.deepEqual(await page.evaluate(() => calls), []);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menu = page.getByRole('dialog', { name: 'Menu', exact: true });
  assert.match(await menu.textContent(), /Use your browser menu to install/);
  await menu.getByRole('button', { name: 'Install', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'install').length), 1);
  await page.evaluate(() => emitInstall({ available: true, instructions: 'Install this app on your device.' }));
  await menu.getByRole('button', { name: 'Install', exact: true }).click();
  assert.equal(await menu.getByRole('button', { name: 'Installed', exact: true }).isDisabled(), true);
  await page.evaluate(() => panel.dispose());
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'unsubscribe-install').length), 1);
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'dispose-install-controller')), false);
  await page.evaluate(() => emitInstall({ installed: false }));
  assert.equal(await page.locator('dialog[open]').count(), 0);
});

test('HF and peer loading overlays follow download, verification and engine progress until ready', async (t) => {
  for (const key of ['hf:vision', 'peer:fixture']) {
    const page = await fixture(t, { importProgress: true, acquireDelay: 600 });
    await page.getByLabel('Model and source').selectOption(key);
    await page.getByRole('button', { name: 'Load', exact: true }).click();
    const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
    await overlay.waitFor();
    assert.match(await overlay.textContent(), key === 'hf:vision' ? /Fixture vision/ : /Peer text model/);
    assert.equal(await overlay.getByRole('button', { name: 'Done', exact: true }).count(), 0);
    assert.equal(await overlay.getByRole('button', { name: 'Close', exact: true }).count(), 0);
    await overlay.getByRole('status').filter({ hasText: 'Downloading 7/7' }).waitFor();
    await overlay.getByRole('status').filter({ hasText: 'Verifying stored model files' }).waitFor();
    await overlay.getByRole('status').filter({ hasText: 'Loading model into RAM' }).waitFor();
    await overlay.getByRole('status').filter({ hasText: 'Loading model: unet' }).waitFor();
    await overlay.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => uiState.loaded), true);
    assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Model ready/);
    assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).evaluate((button) => button === document.activeElement), true);
  }
});

test('startup overlays cover saved and default loads and Escape waits for cancellation cleanup', async (t) => {
  for (const manifestCid of [undefined, 'saved']) {
    const page = await fixture(t, { startup: { sourceKey: 'hf:vision', manifestCid, name: 'Startup model' },
      acquireDelay: 10000, loadStoredDelay: 10000, waitForLoadCleanup: true });
    const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
    assert.equal(await overlay.isVisible(), true);
    assert.equal(await overlay.getByRole('button', { name: 'Cancel', exact: true }).evaluate((button) => button === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await overlay.evaluate((element) => element.contains(document.activeElement)), true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => uiState.cleaning === true);
    assert.equal(await overlay.isVisible(), true);
    assert.equal(await overlay.getByRole('button', { name: 'Cancel', exact: true }).isDisabled(), true);
    assert.match(await overlay.getByRole('status').textContent(), /Cancelling load.*Waiting for cleanup/);
    await page.keyboard.press('Escape'); await page.keyboard.press('Tab');
    assert.equal(await overlay.isVisible(), true);
    assert.equal(await overlay.evaluate((element) => element.contains(document.activeElement)), true);
    await page.evaluate(() => document.querySelector('[aria-label="Menu"]').onclick());
    assert.equal(await page.getByRole('dialog', { name: 'Menu', exact: true }).isVisible(), false);
    assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load-cleanup').length), 1);
    await page.evaluate(() => finishLoadCleanup()); await overlay.waitFor({ state: 'hidden' });
    assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Cancelled:/);
    assert.equal(await page.evaluate(() => uiState.loaded), false);
    assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).isEnabled(), true);
  }
});

test('stored-library overlay keeps cleanup failures visible without reporting successful cancellation', async (t) => {
  const page = await fixture(t, { stored: [{ manifestCid: 'saved', name: 'Stored package', totalBytes: 1024 }],
    loadStoredDelay: 10000, waitForLoadCleanup: true, cleanupFailure: true });
  await openMenuAction(page, 'Stored Models');
  const library = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  await library.getByRole('button', { name: 'Load Stored package', exact: true }).click();
  const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
  await overlay.waitFor(); assert.match(await overlay.textContent(), /Stored package/);
  await overlay.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => uiState.cleaning === true);
  assert.equal(await overlay.isVisible(), true);
  await page.evaluate(() => finishLoadCleanup()); await overlay.waitFor({ state: 'hidden' });
  assert.equal(await library.isVisible(), true);
  assert.match(await library.getByRole('status').textContent(), /Error: Model cleanup is incomplete/);
  assert.doesNotMatch(await library.getByRole('status').textContent(), /Cancelled:/);
  assert.equal(await library.evaluate((element) => element.contains(document.activeElement)), true);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').length), 1);
});

test('loading overlay fits desktop, mobile and embedded panels and honors reduced motion', async (t) => {
  const page = await fixture(t, { acquireDelay: 10000, waitForLoadCleanup: true });
  const output = '/tmp/peercompute-model-loading-overlay'; await mkdir(output, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Load', exact: true }).click();
  const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
  for (const [label, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    await page.setViewportSize(viewport);
    const bounds = await overlay.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height);
    assert.equal(await overlay.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
    await page.screenshot({ path: `${output}/${label}.png` });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await overlay.locator('.pc-loading-spinner').evaluate((element) => getComputedStyle(element).animationName), 'none');
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.locator('#panel').evaluate((element) => { element.classList.remove('pc-inference-standalone'); element.style.width = '620px'; });
  const embedded = await page.locator('.pc-inference-panel').boundingBox();
  assert.equal(embedded.width, 620); assert.equal(embedded.height, 720);
  await overlay.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => uiState.cleaning === true);
  await page.screenshot({ path: `${output}/cancelling-embedded.png` });
  await page.evaluate(() => finishLoadCleanup()); await overlay.waitFor({ state: 'hidden' });
});

test('chat generation keeps its Stop control and never opens the model-loading overlay', async (t) => {
  const page = await fixture(t, { loaded: true, generateDelay: 10000 });
  await page.getByLabel('Message', { exact: true }).fill('Hello');
  await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  assert.equal(await page.getByRole('dialog', { name: 'Loading model', exact: true }).isVisible(), false);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'cancel'));
});

test('panel disposal waits for load cleanup before removing its loading overlay', async (t) => {
  const page = await fixture(t, { startup: { sourceKey: 'hf:vision', name: 'Pending model' },
    acquireDelay: 10000, waitForLoadCleanup: true });
  await page.evaluate(() => { window.pendingDispose = panel.dispose(); });
  await page.waitForFunction(() => uiState.cleaning === true);
  const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
  assert.equal(await overlay.isVisible(), true);
  assert.equal(await overlay.getByRole('button', { name: 'Cancel', exact: true }).isDisabled(), true);
  assert.equal(await page.evaluate(() => uiState.disposed), false);
  await page.evaluate(async () => { finishLoadCleanup(); await pendingDispose; });
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await page.locator('.pc-inference-panel').count(), 0);
  assert.equal(await page.evaluate(() => uiState.disposed), true);
});
