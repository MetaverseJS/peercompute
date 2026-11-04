import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { readFile } from 'node:fs/promises';
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

async function fixture(t, scenario = {}) {
  const page = await browser.newPage({ viewport: { width: 420, height: 820 } });
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://**/*', (route) => { external.push(route.request().url()); return route.abort(); });
  t.after(async () => {
    await page.evaluate(() => window.panel?.dispose()).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__ui_fixture');
  await page.evaluate(async (scenario) => {
    const { mountInferencePanel } = await import('/demos/inference/src/agentPanel.js');
    window.calls = []; window.contextCalls = [];
    window.uiState = { loaded: !!scenario.loaded, providers: [true, false], remote: true, refreshCalls: 0,
      refreshActive: 0, refreshPeak: 0, disposed: false, sharing: true, hostInference: true,
      stored: scenario.stored ?? [], rejectStoredList: !!scenario.rejectStoredList };
    const state = window.uiState;
    const delay = (ms, signal) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, ms);
      const abort = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); };
      if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
    });
    const runtime = {
      networkReady: true,
      store: { maximumBytes: 4 * 1024 ** 3, async importFile() { calls.push({ type: 'pin' }); } },
      getPreferences: () => ({ sharing: state.sharing, hostInference: state.hostInference }),
      getSharingErrors: () => state.stored.filter((model) => model.shareError).map((model) => ({ manifestCid: model.manifestCid, message: model.shareError })),
      listModelSources: () => [
        { key: 'hf:vision', name: 'Fixture vision', source: 'hf', modelId: 'smolvlm-256m-q4', modalities: ['text', 'image'] },
        { key: 'peer:fixture', name: 'Peer text model', source: 'peers', manifestCid: 'fixture', modalities: ['text'] }],
      listInferenceTargets: () => [{ key: 'local', name: state.loaded ? 'Fixture vision' : 'No model loaded', local: true,
        available: state.loaded, busy: false, modalities: ['text', 'image'] }, ...(state.remote ? [{ key: 'peer:fixture',
        name: 'Peer text model', local: false, available: true, busy: state.providers.every(Boolean),
        providerCount: state.providers.length, modalities: ['text'] }] : [])],
      async refreshPeers({ signal }) {
        state.refreshCalls++; state.refreshPeak = Math.max(state.refreshPeak, ++state.refreshActive);
        try { await delay(scenario.refreshDelay ?? 1, signal); if (state.refreshError) throw new Error('Offline'); }
        finally { state.refreshActive--; }
      },
      async acquireModel(key, options) { calls.push({ type: 'acquire', key, gpuLayers: options.ggufGpuLayers });
        await delay(5, options.signal); state.loaded = true; calls.push({ type: 'loaded' }); },
      async setSharing(value) { if (state.rejectSharing) throw new Error('Sharing failed'); state.sharing = value; calls.push({ type: 'sharing', value }); },
      async setHostInference(value) { state.hostInference = value; calls.push({ type: 'hosting', value }); },
      async generate(target, options) {
        calls.push({ type: 'generate', target, requestId: options.requestId, messages: options.messages,
          image: options.image ? { width: options.image.width, height: options.image.height, bytes: options.image.data.length } : null });
        await delay(scenario.generateDelay ?? 1, options.signal);
        const text = scenario.longReply ? Array.from({ length: 70 }, (_, i) => 'Reply line ' + i).join('\n') : 'Reply to ' + options.messages.at(-1).content;
        options.onToken?.(text); return { text, inputTokens: 4, outputTokens: 8 };
      },
      async cancel(requestId) { calls.push({ type: 'cancel', requestId }); return true; },
      async unload() { state.loaded = false; calls.push({ type: 'unload' }); },
      async listStoredModels({ signal } = {}) {
        calls.push({ type: 'stored-list' }); await delay(10, signal);
        if (state.rejectStoredList) throw new Error('Storage is temporarily unavailable');
        return state.stored.map((model) => ({ ...model, loaded: state.loaded && model.manifestCid === 'fixture-vision' }));
      },
      async deleteStoredModel(cid, { signal } = {}) {
        calls.push({ type: 'delete', cid }); await delay(scenario.deleteDelay ?? 20, signal);
        if (state.rejectDelete) throw new Error('Model is still in use');
        const unloaded = state.loaded && cid === 'fixture-vision';
        if (unloaded) state.loaded = false;
        if (state.cleanupFails) {
          state.stored.find((model) => model.manifestCid === cid).cleanupPending = true;
          throw new Error('Storage cleanup interrupted');
        }
        state.stored = state.stored.filter((model) => model.manifestCid !== cid);
        return { deleted: true, unloaded, freedBytes: 1024 ** 2 };
      },
      setStorageQuota(bytes) { runtime.store.maximumBytes = bytes; },
      async connectBackend() {}, async connect() {}, async dispose() {
        state.disposeAttempts = (state.disposeAttempts ?? 0) + 1;
        if (scenario.disposeFailsOnce && state.disposeAttempts === 1) throw new Error('Worker stop not acknowledged');
        state.disposed = true;
      },
    };
    window.panel = await mountInferencePanel({ container: document.querySelector('#panel'), runtimeFactory: async () => runtime,
      refreshIntervalMs: scenario.interval ?? 5000,
      ...(scenario.context ? { getContext: (options) => { contextCalls.push(options); return { text: 'Optional embedded scene context', image: { forbidden: true } }; },
        actions: { instructions: 'Suggest an approved action.', invalidate() {}, propose() { return [{ label: 'test action', apply() { calls.push({ type: 'action' }); } }]; } } } : {}) });
  }, scenario);
  return page;
}

test('compact unloaded console defaults sharing and hosting on without importing, Close, CID or scene controls', async (t) => {
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
  await page.getByRole('button', { name: 'Configure model chat' }).click();
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
  await page.getByRole('button', { name: 'Import Model', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'loaded'));
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'local');
  await page.getByLabel('Message', { exact: true }).fill('Hello');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), [{ type: 'acquire', key: 'peer:fixture', gpuLayers: 99999 }]);
  await page.getByRole('button', { name: 'Configure model chat' }).click();
  await page.getByLabel('Share with peers', { exact: true }).uncheck();
  await page.getByLabel('Host inference', { exact: true }).uncheck();
  await page.waitForFunction(() => !uiState.sharing && !uiState.hostInference);
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
  assert.match(result.request.messages[0].content, /Optional embedded scene context/);
  assert.deepEqual(result.contextCalls, [{ includeImage: false }]); assert.equal(result.actions, 0); assert(result.bottom < 3);
  await page.getByRole('button', { name: 'Apply: test action', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'action').length), 1);
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

test('default discovery refresh runs every five seconds without startup inference', async (t) => {
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
  await page.getByRole('button', { name: 'Configure model chat' }).click();
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
  await page.getByRole('button', { name: 'Configure model chat' }).click();
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

test('independent modal windows trap focus, close on Escape and return to their toolbar buttons', async (t) => {
  const page = await fixture(t, { interval: 50 });
  const config = page.getByRole('button', { name: 'Configure model chat' });
  const stored = page.getByRole('button', { name: 'Stored Models', exact: true });
  for (const [trigger, name] of [[config, 'Config'], [stored, 'Stored Models']]) {
    await trigger.click();
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
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
  }
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'delete' || call.type === 'acquire')), false);
});

test('stored models list offers explicit deletion and removes a loaded package without changing another model', async (t) => {
  const page = await fixture(t, { loaded: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024 ** 3, shared: true },
    { manifestCid: 'fixture-text', name: 'Fixture text', totalBytes: 2 * 1024 ** 2, shared: false },
  ], deleteDelay: 100 });
  await page.getByLabel('Message', { exact: true }).fill('Keep my draft');
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
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
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  await modal.getByRole('button', { name: 'Delete Fixture text', exact: true }).click();
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

test('stored model read and deletion failures stay visible and retryable without removing rows', async (t) => {
  const page = await fixture(t, { rejectStoredList: true, stored: [
    { manifestCid: 'fixture-text', name: 'Fixture text', totalBytes: 1024, shared: false },
  ] });
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
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
      await page.getByRole('button', { name: trigger, exact: true }).click();
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
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  const modal = page.getByRole('dialog', { name: 'Stored Models', exact: true });
  await modal.getByRole('button', { name: 'Delete Fixture vision', exact: true }).click();
  await modal.getByText('Error: Storage cleanup interrupted', { exact: true }).waitFor();
  assert.match(await modal.textContent(), /Cleanup pending/);
  assert.doesNotMatch(await modal.textContent(), /Loaded/);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 2);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  await page.evaluate(() => { uiState.cleanupFails = false; });
  await modal.getByRole('button', { name: 'Retry delete Fixture vision', exact: true }).click();
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

test('a sharing failure keeps the imported model usable and explains its library status', async (t) => {
  const page = await fixture(t, { stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024, shared: false, shareError: 'Peer network is offline' },
  ] });
  await page.getByRole('button', { name: 'Import Model', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Model ready. Sharing is unavailable'));
  await page.getByLabel('Message', { exact: true }).fill('Still usable');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  await page.getByRole('button', { name: 'Stored Models', exact: true }).click();
  await page.getByRole('dialog', { name: 'Stored Models', exact: true }).getByText('Sharing unavailable: Peer network is offline', { exact: true }).waitFor();
});
