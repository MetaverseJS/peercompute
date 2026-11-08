import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { readFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

let server, browser, origin, cacheDir;
const repo = fileURLToPath(new URL('../../', import.meta.url));
before(async () => {
  cacheDir = await mkdtemp(path.join(tmpdir(), 'peercompute-model-panel-vite-'));
  // Exercise the real standalone shell without bootstrapping its actual runtime.
  const standaloneHtml = (await readFile(new URL('../inference/index.html', import.meta.url), 'utf8'))
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  server = await createServer({ configFile: false, root: repo, logLevel: 'error', cacheDir,
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
after(async () => { await browser?.close(); await server?.close(); if (cacheDir) await rm(cacheDir, { recursive: true, force: true }); });

async function openMenuAction(page, name) {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog', { name: 'Menu', exact: true }).getByRole('button', { name, exact: true }).click();
  if (name === 'Models') {
    const storedTab = libraryDialog(page).getByRole('tab', { name: 'Stored models', exact: true });
    if (await storedTab.getAttribute('aria-selected') !== 'true') await storedTab.click();
    await storedPanel(page).getByRole('status').filter({ hasNotText: 'Reading stored models…' }).waitFor();
  }
}

const rememberedModelKey = (page) => page.evaluate(() => uiState.preferredSourceKey ?? 'hf:vision');
const libraryDialog = (page) => page.getByRole('dialog', { name: 'Models', exact: true });
const storedPanel = (page) => libraryDialog(page).getByRole('tabpanel', { name: 'Stored models', exact: true });
const storedChoice = (page, name) => storedPanel(page).getByRole('checkbox', { name: `Select ${name}`, exact: true });
const storedLoad = (page) => storedPanel(page).getByRole('button', { name: 'Load selected', exact: true });
const storedDelete = (page) => storedPanel(page).getByRole('button', { name: 'Delete selected', exact: true });
async function selectStored(page, names) {
  for (const name of names) await storedChoice(page, name).check();
}
async function loadStored(page, names) { await selectStored(page, names); await storedLoad(page).click(); }
async function deleteStored(page, names) { await selectStored(page, names); await storedDelete(page).click(); }
async function openModelsBrowse(page) {
  const modal = libraryDialog(page);
  if (!await modal.isVisible()) await page.getByRole('button', { name: 'Models', exact: true }).click();
  await showBrowseResults(page);
  await modal.getByRole('tab', { name: 'Browse models', exact: true }).click();
  if (!await modal.locator('.pc-browser-filters').evaluate((element) => element.open)) {
    await modal.locator('.pc-browser-filters summary').click();
  }
  return modal;
}
async function showBrowseResults(page) {
  const modal = libraryDialog(page);
  if (await page.evaluate(() => matchMedia('(max-width:650px)').matches)
      && await modal.getByRole('region', { name: 'Model details', exact: true }).isVisible()) {
    await modal.getByRole('button', { name: 'Done', exact: true }).click();
  }
  return modal;
}
async function closeModels(page) {
  const modal = libraryDialog(page);
  for (let count = 0; count < 2 && await modal.isVisible(); count++) await page.keyboard.press('Escape');
  assert.equal(await modal.isVisible(), false);
}
async function browseChoice(page, key, action) {
  const modal = await openModelsBrowse(page);
  await showBrowseResults(page);
  await modal.locator('[data-model-key]').evaluateAll((items, key) => {
    const item = items.find((element) => element.dataset.modelKey === key);
    if (!item) throw new Error('Missing model choice: ' + key);
  }, key);
  await modal.locator(`[data-model-key=${JSON.stringify(key)}]`).click();
  if (action) await modal.getByRole('button', { name: action, exact: true }).click();
  return modal;
}


async function openChatOptions(page) {
  const dialog = page.getByRole('dialog', { name: 'Chat options', exact: true });
  if (!await dialog.isVisible()) await page.getByRole('button', { name: 'Chat options', exact: true }).click();
  return dialog;
}
async function selectChatTarget(page, target) {
  const dialog = await openChatOptions(page);
  await dialog.getByLabel('Chat target', { exact: true }).selectOption(target);
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Chat options');
}
async function setChatOption(page, name, checked) {
  const dialog = await openChatOptions(page);
  await dialog.getByLabel(name, { exact: true }).setChecked(checked);
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Chat options');
}
async function openNetworkStatus(page) {
  await page.getByRole('button', { name: 'Network status', exact: true }).click();
  return page.getByRole('dialog', { name: 'Network status', exact: true });
}

async function fixture(t, scenario = {}) {
  const page = await browser.newPage({ viewport: { width: 420, height: 820 } });
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://**/*', (route) => { external.push(route.request().url()); return route.abort(); });
  t.after(async () => {
    await page.evaluate(() => { window.cleaningUpFixture = true; window.finishLoadCleanup?.(); window.finishDeleteCleanup?.(); window.releaseStoredRead?.(); return window.panel?.dispose(); }).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__ui_fixture');
  await page.evaluate(async (scenario) => {
    const { mountInferencePanel } = await import('/demos/inference/src/agentPanel.js');
    window.calls = []; window.contextCalls = []; window.pixelRequests = [];
    if (scenario.holdBlobFetch) {
      const fetchOriginal = window.fetch.bind(window);
      window.fetch = (url, options) => String(url).startsWith('blob:')
        ? new Promise((resolve) => { window.failNewBlob = () => resolve(new Response('', { status: 404 })); }) : fetchOriginal(url, options);
    }
    window.previewUrls = { created: [], revoked: [] };
    const createUrl = URL.createObjectURL.bind(URL), revokeUrl = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (blob) => { const url = createUrl(blob); previewUrls.created.push(url); return url; };
    URL.revokeObjectURL = (url) => { previewUrls.revoked.push(url); revokeUrl(url); };
    window.uiState = { loaded: !!scenario.loaded, providers: [true, false], remote: true, refreshCalls: 0,
      refreshActive: 0, refreshPeak: 0, disposed: false, sharing: true, hostInference: true,
      stored: scenario.stored ?? [], rejectStoredList: !!scenario.rejectStoredList,
      rejectLoad: !!scenario.rejectLoad, rejectAcquire: !!scenario.rejectAcquire,
      loadedCid: scenario.loaded ? 'fixture-vision' : null, preferredSourceKey: scenario.preferredSourceKey, sources: scenario.sources,
      residentCids: scenario.loaded ? ['fixture-vision'] : [],
      failedDeleteCids: scenario.failedDeleteCids ?? [],
      peerCapacity: scenario.peerCapacity ?? {},
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
      getMemoryBudgetStatus: () => state.memoryPressure ?? scenario.memoryPressure,
      setMemoryBudgets(budgets) { state.memoryBudgets = budgets; calls.push({ type: 'budgets', ...budgets }); return budgets; },
      getSharingErrors: () => state.stored.filter((model) => model.shareError).map((model) => ({ manifestCid: model.manifestCid, message: model.shareError })),
      listModelSources: () => (state.sources ?? [
        { key: 'hf:vision', name: 'Fixture vision', source: 'hf', modelId: 'smolvlm-256m-q4', runtime: 'transformers.js', modalities: scenario.diffusion ? ['text'] : ['text', 'image'],
          task: scenario.diffusion ? 'text-to-image' : 'image-text-to-text', outputModalities: scenario.diffusion ? ['image'] : ['text'] },
        { key: 'peer:fixture', name: 'Peer text model', source: 'peers', modelId: 'peer-text', manifestCid: 'fixture', runtime: 'llama.cpp', task: 'text-generation', modalities: ['text'] }])
        .map((source) => ({ ...source, localAvailability: scenario.memoryPolicy && state.memoryBudgets.cpuBytes != null
          && state.memoryBudgets.cpuBytes < 4 * 1024 ** 3 ? { status: 'unavailable', reason: 'Needs 4 GiB RAM.' }
          : state.availability[source.key] ?? { status: 'unknown', cpuBytes: 4 * 1024 ** 3, gpuBytes: 8 * 1024 ** 3 } })),
      listInferenceTargets: () => [{ key: 'local:fixture-vision', name: state.loaded ? 'Fixture vision' : 'No model loaded', local: true, manifestCid: 'fixture-vision',
        runtime: 'transformers.js', available: state.loaded, busy: false, modalities: scenario.diffusion ? ['text'] : ['text', 'image'],
        task: scenario.diffusion ? 'text-to-image' : 'image-text-to-text', outputModalities: scenario.diffusion ? ['image'] : ['text'] }, ...(state.remote ? [{ key: 'peer:fixture',
        name: 'Peer text model', manifestCid: 'fixture', runtime: 'transformers.js', local: false, available: true, busy: state.providers.every(Boolean), ...state.peerCapacity,
        providerCount: state.providers.length, modalities: scenario.peerVision ? ['text', 'image'] : ['text'],
        task: scenario.diffusion ? 'text-to-image' : scenario.peerVision ? 'image-text-to-text' : 'text-generation', outputModalities: scenario.diffusion ? ['image'] : ['text'] }] : [])],
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
            { stage: 'import', path: 'LICENSE', index: 6, total: 7, loaded: 1024, totalBytes: 1024, reused: true },
            { stage: 'verify' }, { stage: 'load' }, { type: 'model-load', stage: 'unet', loaded: 0, total: 1000 },
          ]) { options.onProgress(event); await delay(150, options.signal); }
        }
        await modelDelay(scenario.acquireDelay ?? 5, options.signal);
        if (state.rejectAcquire) throw new Error('Model download failed');
        state.loaded = true; state.loadedCid = 'fixture-vision';
        if (!state.residentCids.includes(state.loadedCid)) state.residentCids.push(state.loadedCid);
        calls.push({ type: 'loaded' }); },
      ...(scenario.startup ? { getStartupModel: () => ({ ...scenario.startup, localAvailability: state.availability[scenario.startup.sourceKey] ?? scenario.startup.localAvailability }) } : {}),
      ...(scenario.preferredSourceKey ? { getPreferredModelSourceKey: () => state.preferredSourceKey } : {}),
      async loadStoredModel(cid, options) {
        calls.push({ type: 'load-stored', cid, gpuLayers: options.ggufGpuLayers });
        options.onProgress?.({ stage: 'verify' });
        await modelDelay(scenario.loadStoredDelays?.[cid] ?? scenario.loadStoredDelay ?? 20, options.signal);
        if (state.rejectLoad || scenario.failedCids?.includes(cid)) throw new Error('Stored model could not be loaded');
        state.loaded = true; state.loadedCid = cid;
        if (!state.residentCids.includes(cid)) state.residentCids.push(cid);
        state.preferredSourceKey = (state.sources ?? []).find((source) => source.manifestCid === cid)?.key ?? 'hf:vision';
        return { manifestCid: cid };
      },
      async recoverStoredModel(cid, options) {
        calls.push({ type: 'verify-local', cid });
        options.onProgress?.({ stage: 'verify', loaded: 1024, totalBytes: 2048 });
        await modelDelay(scenario.verifyDelay ?? 20, options.signal);
        if (scenario.rejectVerification) throw new Error('Local verification failed: missing block. No files were downloaded.');
        const record = state.stored.find((model) => model.manifestCid === cid);
        delete record.needsVerification; record.localAvailability = { status: 'unknown' };
        return { verified: true, manifestCid: cid };
      },
      async setSharing(value) { if (state.rejectSharing) throw new Error('Sharing failed'); state.sharing = value; calls.push({ type: 'sharing', value }); },
      async setHostInference(value) { state.hostInference = value; calls.push({ type: 'hosting', value }); },
      async generate(target, options) {
        const actualLocal = target.startsWith('local:') || target === 'local-only' || (target === 'mixed' && state.loaded);
        const route = { local: actualLocal, modelName: actualLocal ? 'Fixture vision' : 'Peer text model',
          target: actualLocal ? 'local:fixture-vision' : 'peer:fixture', manifestCid: actualLocal ? 'fixture-vision' : 'fixture', task: options.task };
        options.onProgress?.({ type: 'routing', route });
        calls.push({ type: 'generate', target, task: options.task, requestId: options.requestId, messages: options.messages,
          prompt: options.prompt, maxNewTokens: options.maxNewTokens,
          image: options.image ? { width: options.image.width, height: options.image.height, bytes: options.image.data.length } : null });
        if (scenario.capturePixels && options.image) {
          const pixels = new Uint8Array(options.image.data);
          const digest = await crypto.subtle.digest('SHA-256', pixels);
          pixelRequests.push({ requestId: options.requestId, width: options.image.width, height: options.image.height,
            channels: options.image.channels, pixels: [...pixels], sha256: [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('') });
        }
        await delay(state.generateDelay ?? scenario.generateDelay ?? 1, scenario.ignoreAbort ? undefined : options.signal);
        if (state.rejectGeneration) throw new Error(scenario.generationError ?? 'Vision fixture generation failed');
        if (scenario.diffusion) {
          options.onProgress?.({ type: 'diffusion-progress', stage: 'denoise', step: 1, steps: 1 });
          const data = new Uint8Array(512 * 512 * 4);
          for (let index = 0; index < data.length; index += 4) { data[index] = 220; data[index + 3] = 255; }
          return { text: '', route, seed: 42, steps: 1, image: scenario.invalidImage
            ? { width: 2048, height: 2048, channels: 4, data } : { width: 512, height: 512, channels: 4, data } };
        }
        const text = scenario.longReply ? Array.from({ length: 70 }, (_, i) => 'Reply line ' + i).join('\n') : 'Reply to ' + options.messages.at(-1).content;
        options.onToken?.(text); return { text, route, inputTokens: 4, outputTokens: scenario.outputTokens ?? 8,
          finishReason: scenario.finishReason ?? 'stop', contextTruncated: !!scenario.contextTruncated };
      },
      async cancel(requestId) { calls.push({ type: 'cancel', requestId }); return true; },
      async unload(cid) { state.residentCids = cid ? state.residentCids.filter((item) => item !== cid) : [];
        state.loadedCid = state.residentCids.at(-1) ?? null; state.loaded = !!state.loadedCid; calls.push({ type: 'unload', ...(cid ? { cid } : {}) }); },
      async listStoredModels({ signal } = {}) {
        calls.push({ type: 'stored-list' });
        if (scenario.holdStoredReadOnce && calls.filter((call) => call.type === 'stored-list').length === 2) {
          const snapshot = state.stored.map((model) => ({ ...model, loaded: state.residentCids.includes(model.manifestCid) }));
          await new Promise((resolve) => { window.releaseStoredRead = resolve; });
          return snapshot; // Deliberately ignores abort, like an already-running IDB read.
        }
        await delay(state.storedListDelay ?? scenario.storedListDelay ?? 10, signal);
        if (state.rejectStoredList) throw new Error('Storage is temporarily unavailable');
        return state.stored.map((model) => ({ ...model, loaded: state.residentCids.includes(model.manifestCid) }));
      },
      async deleteStoredModel(cid, { signal } = {}) {
        calls.push({ type: 'delete', cid });
        try { await delay(scenario.deleteDelays?.[cid] ?? scenario.deleteDelay ?? 20, signal); }
        catch (error) {
          if (scenario.waitForDeleteCleanup && !window.cleaningUpFixture) {
            state.deletingCleanup = true; calls.push({ type: 'delete-cleanup', cid });
            await new Promise((resolve) => { window.finishDeleteCleanup = resolve; });
            state.deletingCleanup = false;
          }
          if (scenario.deleteCommitsBeforeAbort) state.stored = state.stored.filter((model) => model.manifestCid !== cid);
          throw error;
        }
        if (state.rejectDelete || state.failedDeleteCids.includes(cid)) throw new Error('Model is still in use');
        if (!state.stored.some((model) => model.manifestCid === cid)) return { deleted: false, unloaded: false, freedBytes: 0 };
        const unloaded = state.loaded && cid === state.loadedCid;
        state.residentCids = state.residentCids.filter((item) => item !== cid);
        state.loadedCid = state.residentCids.at(-1) ?? null; state.loaded = !!state.loadedCid;
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
    if (scenario.noStoredLoader) delete runtime.loadStoredModel;
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
      navigate: (url) => calls.push({ type: 'navigate', url, disposed: state.disposed }),
      autoConnect: !!scenario.connectFailure,
      refreshIntervalMs: scenario.interval ?? 5000,
      ...(scenario.context ? { getContext: (options) => { contextCalls.push(options); return { text: 'Optional embedded scene context', image: { forbidden: true } }; },
        actions: { instructions: 'Suggest an approved action.', invalidate() {}, propose() { return [{ label: 'test action', apply() { calls.push({ type: 'action' }); } }]; } } } : {}) });
    await panel.startupReady;
  }, scenario);
  // Unrelated legacy scenarios begin after the user dismisses the startup picker.
  // Dedicated startup tests keep it open and assert no loading has occurred.
  if (!scenario.keepStartupPicker) {
    const picker = page.getByRole('dialog', { name: 'Models', exact: true });
    if (await picker.isVisible()) await picker.getByRole('button', { name: 'Done', exact: true }).click();
  }
  return page;
}

test('Models launcher and menu share one tabbed dialog and reuse the startup stored snapshot', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, stored: [
    { manifestCid: 'saved', name: 'Saved model', totalBytes: 1024 },
  ] });
  const models = libraryDialog(page);
  assert.equal(await models.count(), 1);
  assert.equal(await page.locator('dialog[open]').count(), 1);
  assert.equal(await models.getByRole('tab', { name: 'Stored models', exact: true }).getAttribute('aria-selected'), 'true');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 1,
    'Opening the startup picker uses its already-read storage snapshot');
  const select = models.getByRole('checkbox', { name: 'Select Saved model', exact: true });
  await select.check();
  await models.getByRole('tab', { name: 'Browse models', exact: true }).click();
  assert.equal(await storedPanel(page).isVisible(), false);
  assert.equal(await models.getByRole('tabpanel', { name: 'Browse models', exact: true }).isVisible(), true);
  await models.getByRole('tab', { name: 'Stored models', exact: true }).click();
  await storedPanel(page).getByRole('status').filter({ hasNotText: 'Reading stored models…' }).waitFor();
  assert.equal(await select.isChecked(), true, 'Tab switching preserves explicit batch selections');
  assert.equal(await models.getByRole('button', { name: 'Load selected', exact: true }).isEnabled(), true);
  await models.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Models', exact: true }).click();
  assert.equal(await models.getByRole('tab', { name: 'Stored models', exact: true }).getAttribute('aria-selected'), 'true');
  await models.getByRole('button', { name: 'Done', exact: true }).click();
  await openMenuAction(page, 'Models');
  assert.equal(await models.count(), 1);
  assert.equal(await page.getByRole('dialog', { name: 'Stored Models', exact: true }).count(), 0);
  assert.equal(await page.getByRole('dialog', { name: 'Browse models', exact: true }).count(), 0);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored', 'delete', 'verify-local'].includes(call.type))), []);
});

test('phone model rows open full-screen details and Done returns the same filtered results without loading', async (t) => {
  const page = await fixture(t, { interval: 50 });
  await page.setViewportSize({ width: 390, height: 844 });
  const models = await openModelsBrowse(page);
  const search = models.getByLabel('Search models', { exact: true });
  await search.fill('fixture');
  await models.locator('[data-model-key="hf:vision"]').click();
  const details = models.getByRole('region', { name: 'Model details', exact: true });
  assert.equal(await details.isVisible(), true);
  assert.equal(await search.isVisible(), false);
  const bounds = await models.boundingBox();
  assert(bounds.x >= 0 && bounds.y >= 0 && bounds.width >= 380 && bounds.height >= 830
    && bounds.x + bounds.width <= 391 && bounds.y + bounds.height <= 845, JSON.stringify(bounds));
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await details.isVisible(), true, 'Directory refresh does not dismiss the explicit details view');
  await models.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await models.isVisible(), true);
  assert.equal(await details.isVisible(), false);
  assert.equal(await search.inputValue(), 'fixture');
  assert.equal(await models.locator('[data-model-key="hf:vision"]').getAttribute('aria-pressed'), 'true');
  await page.waitForTimeout(100);
  assert.equal(await details.isVisible(), false, 'Polling cannot reopen mobile details after Done');
  await models.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await models.isVisible(), false);
  assert.equal(await page.getByRole('button', { name: 'Models', exact: true }).evaluate((element) => document.activeElement === element), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
});

test('Stored to Browse to Stored retries an aborted pending read and never presents its stale snapshot', async (t) => {
  const page = await fixture(t, { holdStoredReadOnce: true, stored: [
    { manifestCid: 'old', name: 'Old package', totalBytes: 1024 },
  ] });
  await page.getByRole('button', { name: 'Models', exact: true }).click();
  const models = libraryDialog(page);
  await page.waitForFunction(() => typeof releaseStoredRead === 'function');
  await models.getByRole('tab', { name: 'Browse models', exact: true }).click();
  await models.getByRole('tab', { name: 'Stored models', exact: true }).click();
  await page.evaluate(() => {
    uiState.stored = [{ manifestCid: 'new', name: 'Current package', totalBytes: 2048 }];
    releaseStoredRead();
  });
  await storedChoice(page, 'Current package').waitFor();
  await storedPanel(page).getByRole('status').filter({ hasText: '1 model stored.' }).waitFor();
  assert.equal(await storedChoice(page, 'Old package').count(), 0);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 3);
  assert.equal(await models.getByRole('tab', { name: 'Stored models', exact: true }).getAttribute('aria-selected'), 'true');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored', 'delete'].includes(call.type))), []);
});

test('unloaded injected runtime defaults sharing and hosting on without Close, CID or scene controls', async (t) => {
  const page = await fixture(t);
  assert.equal(await page.getByLabel('Current model', { exact: true }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Load', exact: true }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Set up selected model', exact: true }).count(), 0);
  assert.equal(await page.locator('.pc-source-help').count(), 0);
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

test('compact navigation and composer preserve native control order at 320 and 390 pixels', async (t) => {
  const page = await fixture(t, { loaded: true });
  const navigation = page.getByRole('navigation', { name: 'Console navigation', exact: true });
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const controls = [navigation.getByRole('link', { name: 'Back to demo overview', exact: true }),
      navigation.getByRole('button', { name: 'Models', exact: true }), navigation.getByRole('button', { name: 'Agents', exact: true }),
      navigation.getByRole('button', { name: 'Network status', exact: true }), navigation.getByRole('button', { name: 'Menu', exact: true })];
    const bounds = await Promise.all(controls.map((control) => control.boundingBox()));
    assert(bounds.every((box) => box && box.x >= 0 && box.x + box.width <= width && box.y >= 0), JSON.stringify(bounds));
    for (let index = 1; index < bounds.length; index++) {
      assert(bounds[index].x >= bounds[index - 1].x + bounds[index - 1].width - 1, JSON.stringify(bounds));
      assert(Math.abs(bounds[index].y - bounds[0].y) < 5, JSON.stringify(bounds));
    }
    const options = await page.getByRole('button', { name: 'Chat options', exact: true }).boundingBox();
    const attach = await page.getByRole('button', { name: 'Attach image', exact: true }).boundingBox();
    assert(options.x + options.width <= attach.x + 1 && Math.abs(options.y - attach.y) < 5);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    for (const name of ['Chat target', 'Generate image', 'Speak replies']) assert.equal(await page.getByLabel(name, { exact: true }).isVisible(), false, name);
    assert.equal(await page.locator('.pc-route-policy').isVisible(), false);
    assert.equal(await page.locator('.pc-inference-panel > .pc-network-summary').count(), 0);
  }
});

test('Chat options preserves draft and history, routes the selected target, and returns keyboard focus', async (t) => {
  const page = await fixture(t, { loaded: true, interval: 50 });
  await selectChatTarget(page, 'peer:fixture');
  const message = page.getByLabel('Message', { exact: true });
  await message.fill('First conversation turn'); await message.press('Enter');
  await page.getByText('Reply to First conversation turn', { exact: true }).waitFor();
  await message.fill('Retained draft\nsecond line');
  const options = await openChatOptions(page);
  await options.getByLabel('Chat target', { exact: true }).selectOption('peer:fixture');
  await options.getByLabel('Generate image', { exact: true }).check();
  await options.getByLabel('Generate image', { exact: true }).uncheck();
  await options.getByLabel('Speak replies', { exact: true }).check();
  await options.getByLabel('Speak replies', { exact: true }).uncheck();
  assert.match(await options.locator('.pc-route-policy').textContent(), /another peer/);
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    assert.equal(await options.evaluate((element) => element.contains(document.activeElement)), true);
  }
  await options.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Chat options', exact: true }).evaluate((element) => document.activeElement === element), true);
  assert.equal(await message.inputValue(), 'Retained draft\nsecond line');
  assert.equal(await page.locator('.pc-chat-message').count(), 2);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'generate').length), 1);
  await message.press('Enter');
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.'
    && window.calls.filter((call) => call.type === 'generate').length === 2);
  assert.match(await page.getByRole('log', { name: 'Conversation', exact: true }).textContent(), /Reply to Retained draft\s+second line/);
  const request = await page.evaluate(() => calls.filter((call) => call.type === 'generate').at(-1));
  assert.equal(request.target, 'peer:fixture');
  assert.match(JSON.stringify(request.messages), /First conversation turn/);
  await openChatOptions(page); await page.keyboard.press('Escape');
  assert.equal(await options.isVisible(), false);
  assert.equal(await page.getByRole('button', { name: 'Chat options', exact: true }).evaluate((element) => document.activeElement === element), true);
  assert.equal(await page.getByLabel('Chat target', { exact: true }).inputValue(), 'peer:fixture');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored', 'unload', 'pin'].includes(call.type))), []);
});

test('routine main status is quiet while errors remain visible and successful replies stay in the transcript', async (t) => {
  const page = await fixture(t, { loaded: true });
  const status = page.locator('.pc-inference-panel > [role=status]');
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').classList.contains('pc-status-quiet'));
  const quiet = await status.boundingBox(); assert(quiet === null || quiet.height <= 1, JSON.stringify(quiet));
  assert.match(await page.locator('.pc-chat-empty').textContent(), /Ask a question/);
  assert.match(await page.locator('.pc-chat-empty').textContent(), /⚙.*models, images and voice/);
  await page.evaluate(() => { uiState.rejectGeneration = true; });
  const message = page.getByLabel('Message', { exact: true });
  await message.fill('Show an actionable error'); await message.press('Enter');
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.startsWith('Error:'));
  assert.equal(await status.evaluate((element) => element.classList.contains('pc-status-quiet')), false);
  assert((await status.boundingBox()).height > 1);
  assert.match(await status.textContent(), /Vision fixture generation failed/);
  await page.evaluate(() => { uiState.rejectGeneration = false; });
  await message.fill('Successful retry'); await message.press('Enter');
  await page.getByText('Reply to Successful retry', { exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.'
    && document.querySelector('.pc-inference-panel > [role=status]').classList.contains('pc-status-quiet'));
  assert.match(await page.getByRole('log', { name: 'Conversation', exact: true }).textContent(), /Successful retry/);
});

test('a queued native Chat options close event preserves newer explicit composer focus', async (t) => {
  const page = await fixture(t, { loaded: true });
  await openChatOptions(page);
  assert.equal(await page.evaluate(() => {
    const dialog = document.querySelector('.pc-chat-options');
    dialog.addEventListener('close', () => { window.closeFocus = document.activeElement?.getAttribute('aria-label'); }, { once: true });
    dialog.close(); document.querySelector('[aria-label="Message"]').focus();
    return document.activeElement?.getAttribute('aria-label');
  }), 'Message');
  await page.waitForFunction(() => window.closeFocus !== undefined);
  assert.equal(await page.evaluate(() => closeFocus), 'Message');
  await page.getByLabel('Message', { exact: true }).fill('Keep the composer focus');
  await page.keyboard.press('Enter');
  await page.getByText('Reply to Keep the composer focus', { exact: true }).waitFor();
});

test('unified import adds local capability and preserves default Mixed routing', async (t) => {
  const page = await fixture(t);
  await browseChoice(page, 'peer:fixture', 'Load');
  await page.waitForFunction(() => calls.some((call) => call.type === 'loaded'));
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'mixed');
  await page.getByLabel('Message', { exact: true }).fill('Hello');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), [{ type: 'acquire', key: 'peer:fixture', gpuLayers: 99999 }]);
  await openMenuAction(page, 'Configure model chat');
  await page.getByLabel('Share with peers', { exact: true }).uncheck();
  await page.getByLabel('Host inference', { exact: true }).uncheck();
  await page.waitForFunction(() => !uiState.sharing && !uiState.hostInference);
});

test('Mixed sends explicit text tasks and labels the actual route; Local only never substitutes the peer selector', async (t) => {
  const page = await fixture(t, { interval: 40 });
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'mixed');
  assert.match(await page.locator('.pc-route-policy').textContent(), /Messages, images and voice may be sent/);
  await page.getByLabel('Message', { exact: true }).fill('First request');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await page.getByText('Reply to First request', { exact: true }).waitFor();
  assert.match(await page.locator('.pc-chat-message-assistant .pc-chat-speaker').last().textContent(), /Peer · Peer text model/);
  await page.evaluate(() => { uiState.loaded = true; uiState.residentCids = ['fixture-vision']; });
  await page.waitForFunction(() => document.querySelector('[aria-label="Chat target"] option[value="local:fixture-vision"]').textContent.includes('Fixture vision'));
  await page.getByLabel('Message', { exact: true }).fill('Second request'); await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByText('Reply to Second request', { exact: true }).waitFor();
  assert.match(await page.locator('.pc-chat-message-assistant .pc-chat-speaker').last().textContent(), /Local · Fixture vision/);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'generate').map((call) => [call.target, call.task])),
    [['mixed', 'text-generation'], ['mixed', 'text-generation']]);
  await selectChatTarget(page, 'local-only');
  await page.evaluate(() => { uiState.loaded = false; });
  await page.getByLabel('Message', { exact: true }).fill('Keep local');
  await page.waitForFunction(() => document.querySelector('.pc-route-policy').textContent.includes('No compatible text'));
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'local-only');
});

test('speech catalog choices remain visible and explicitly loadable through task filters', async (t) => {
  const page = await fixture(t, { sources: [
    { key: 'hf:asr', source: 'hf', name: 'Speech recognition fixture', modelId: 'asr', task: 'automatic-speech-recognition', runtime: 'transformers-speech', modalities: ['audio'], outputModalities: ['text'] },
    { key: 'hf:tts', source: 'hf', name: 'Speech synthesis fixture', modelId: 'tts', task: 'text-to-speech', runtime: 'transformers-speech', modalities: ['text'], outputModalities: ['audio'] },
  ] });
  const modal = await browseChoice(page, 'hf:asr');
  await showBrowseResults(page);
  await modal.getByLabel('Task', { exact: true }).selectOption('automatic-speech-recognition');
  assert.equal(await modal.locator('[data-model-key="hf:asr"]').count(), 1);
  assert.equal(await modal.locator('[data-model-key="hf:tts"]').count(), 0);
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'acquire')), false);
  await browseChoice(page, 'hf:asr', 'Load');
  await page.waitForFunction(() => calls.some((call) => call.type === 'loaded'));
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'mixed');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire').map((call) => call.key)), ['hf:asr']);
});

test('modal filtering preserves selection and does not change the remote chat target during refresh', async (t) => {
  const page = await fixture(t, { interval: 50 });
  await selectChatTarget(page, 'peer:fixture');
  const modal = await browseChoice(page, 'peer:fixture');
  await showBrowseResults(page);
  const filter = modal.getByLabel('Search models', { exact: true });
  await modal.getByLabel('Source', { exact: true }).selectOption('catalog');
  await filter.fill('fixture smolvlm image-text transformers');
  assert.equal(await modal.locator('[data-model-key]').count(), 1);
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await filter.inputValue(), 'fixture smolvlm image-text transformers');
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  await filter.fill('no such model');
  assert.match(await modal.textContent(), /No matching models/);
  assert.equal(await modal.getByRole('button', { name: 'Load', exact: true }).count(), 0);
  await filter.fill(''); await modal.getByLabel('Source', { exact: true }).selectOption('all');
  assert.equal(await modal.locator('[aria-pressed=true]').getAttribute('data-model-key'), 'peer:fixture');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
});

test('unavailable and checking choices offer explicit setup help and stale handlers cannot load', async (t) => {
  const page = await fixture(t, { loaded: true, interval: 50, availability: {
    'hf:vision': { status: 'unavailable', reason: 'Needs 12 GiB GPU memory.' },
    'peer:fixture': { status: 'checking', reason: 'Checking WebGPU support…' },
  } });
  let modal = await browseChoice(page, 'hf:vision');
  const load = modal.getByRole('button', { name: 'Load', exact: true });
  assert.equal(await load.isDisabled(), true); await load.evaluate((element) => element.onclick());
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
  await modal.getByRole('button', { name: 'Setup help', exact: true }).click();
  const help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  assert.match(await help.textContent(), /Needs 12 GiB GPU memory/); await page.keyboard.press('Escape');
  await page.evaluate(() => { uiState.availability['hf:vision'] = { status: 'unknown', reason: 'Free GPU memory is unknown.' }; });
  await page.waitForTimeout(100);
  modal = await browseChoice(page, 'hf:vision');
  assert.equal(await modal.getByRole('button', { name: 'Load', exact: true }).isEnabled(), true);
  await modal.getByRole('button', { name: 'Load', exact: true }).evaluate((element) => {
    uiState.availability['hf:vision'] = { status: 'unavailable', reason: 'Device is incompatible.' }; element.onclick();
  });
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
  await page.keyboard.press('Escape');
  if (await help.isVisible()) await page.keyboard.press('Escape');
  await selectChatTarget(page, 'peer:fixture');
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
  await page.keyboard.press('Escape');
  let details = await browseChoice(page, 'hf:vision');
  assert.equal(await details.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await closeModels(page); await openMenuAction(page, 'Configure model chat');
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
  assert.equal(await cpu.getAttribute('aria-invalid'), null);
  await page.keyboard.press('Escape');
  details = await browseChoice(page, 'hf:vision');
  assert.equal(await details.getByRole('button', { name: 'Load', exact: true }).isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire' || call.type === 'pin')), []);
});

test('Config distinguishes estimated combined reservations, Auto and borrowed resource caps without unloading', async (t) => {
  const GiB = 1024 ** 3;
  const pool = (reserved, budget, extra = {}) => ({ reservedBytes: reserved * GiB,
    budgetBytes: budget === null ? null : budget * GiB, configuredBytes: null, brokerBytes: null,
    overBudget: budget !== null && reserved > budget, ...extra });
  const page = await fixture(t, { loaded: true, memoryPressure: {
    owned: true, cpu: pool(16, null), gpu: pool(16, null),
  } });
  await openMenuAction(page, 'Configure model chat');
  const note = page.getByLabel('Estimated model memory reservations');
  assert.match(await note.textContent(), /RAM: 16(?:\.\d+)? GiB estimated reserved; no application cap/);
  assert.match(await note.textContent(), /GPU: 16(?:\.\d+)? GiB estimated reserved; no application cap/);
  assert.match(await note.textContent(), /not measured RAM or VRAM/);
  const cpu = page.getByLabel('Model RAM budget (GiB)', { exact: true });
  await cpu.fill('24');
  await page.evaluate((pressure) => { uiState.memoryPressure = pressure; }, {
    owned: false, cpu: pool(16, 12, { brokerBytes: 12 * GiB }), gpu: pool(16, 16, { brokerBytes: 16 * GiB }),
  });
  await page.waitForFunction(() => document.querySelector('[aria-label="Estimated model memory reservations"]').textContent.includes('over budget'));
  assert.match(await note.textContent(), /12(?:\.\d+)? GiB combined budget \(over budget/);
  assert.match(await note.textContent(), /embedding app owns.*cannot be raised here/);
  assert.equal(await cpu.inputValue(), '24', 'Pressure refresh does not overwrite a draft budget');
  assert.equal(await page.evaluate(() => uiState.loaded), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'unload', 'pin'].includes(call.type))), []);
});

test('model filtering and memory budgets are disabled during an active import', async (t) => {
  const page = await fixture(t, { acquireDelay: 10000 });
  await browseChoice(page, 'hf:vision', 'Load');
  await page.waitForFunction(() => calls.some((call) => call.type === 'acquire'));
  assert.equal(await page.getByRole('button', { name: 'Models', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('dialog', { name: 'Loading model', exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Model RAM budget (GiB)', { exact: true }).isDisabled(), true);
  assert.equal(await page.getByLabel('Model GPU memory budget (GiB)', { exact: true }).isDisabled(), true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent === 'Models').disabled);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'budgets')), []);
});

test('Enter sends, Shift+Enter preserves a newline, optional embedded context stays text-only and actions require clicks', async (t) => {
  const page = await fixture(t, { loaded: true, context: true, longReply: true });
  const input = page.getByLabel('Message', { exact: true });
  await input.fill('First'); await input.press('Shift+Enter'); await input.type('Second');
  assert.equal(await input.inputValue(), 'First\nSecond');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'generate').length), 0);
  await input.press('Enter');
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.' && calls.some((c) => c.type === 'generate'));
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
  for (const target of ['local:fixture-vision', 'peer:fixture']) {
    const page = await fixture(t, { loaded: true, longReply: true, finishReason: 'length', outputTokens: 1024, contextTruncated: true });
    await selectChatTarget(page, target);
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
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.');
  await clear.click();
  assert.equal(await page.locator('.pc-chat-message').count(), 0);
  assert.equal(await page.evaluate(() => uiState.loaded), true);
  await page.keyboard.press('Escape'); await input.fill('Explain rain.'); await input.press('Enter');
  await page.waitForFunction(() => calls.filter((call) => call.type === 'generate').length === 2);
  const request = await page.evaluate(() => calls.filter((call) => call.type === 'generate')[1]);
  assert.deepEqual(request.messages, [{ role: 'user', content: 'Explain rain.' }]);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['unload', 'delete', 'acquire', 'pin'].includes(call.type))), []);
});

test('model details show estimated RAM and GPU requirements separately from package size', async (t) => {
  const page = await fixture(t, { sources: [{ key: 'hf:vision', source: 'hf', name: 'Fixture vision',
    runtime: 'transformers.js', task: 'image-text-to-text', modalities: ['text', 'image'], totalBytes: 512 * 1024 ** 2 }] });
  const modal = await browseChoice(page, 'hf:vision');
  const facts = await modal.locator('.pc-browser-facts dt').evaluateAll((labels) => Object.fromEntries(
    labels.map((label) => [label.textContent, label.nextElementSibling.textContent])));
  assert.match(facts.Package, /^512(?:\.0)? MiB$/);
  assert.equal(facts['Estimated RAM'], '4.00 GiB');
  assert.equal(facts['Estimated GPU memory'], '8.00 GiB');
  assert.doesNotMatch(await modal.textContent(), /download size, not RAM or GPU memory/);
  assert.match(await modal.textContent(), /memory fit|Memory fit/i);
});

test('peer status distinguishes empty directories, query failures and unavailable file sharing', async (t) => {
  const page = await fixture(t, { discovery: { connected: true, peerCount: 2, sharedModelCount: 0, hostedModelCount: 0,
    errors: [{ peerId: 'fixture', code: 'ERR_DIRECTORY', message: 'Directory timed out' }] },
    artifactNetwork: { status: 'error', error: 'Another tab owns file sharing' } });
  const network = await openNetworkStatus(page);
  const summary = network.locator('.pc-network-summary');
  await page.waitForFunction(() => document.querySelector('.pc-network-summary').textContent.includes('Directory timed out'));
  assert.match(await summary.textContent(), /2 peers · 0 shared models · 0 hosted models/);
  assert.match(await summary.textContent(), /File sharing unavailable: Another tab owns file sharing/);
  await network.getByRole('button', { name: 'Close network status', exact: true }).click();
  await selectChatTarget(page, 'peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Hello');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), false);
});

test('discovery stays visible while file sharing prepares retained packages', async (t) => {
  const page = await fixture(t, { discovery: { connected: true, peerCount: 3, sharedModelCount: 5, hostedModelCount: 1, errors: [] },
    artifactNetwork: { status: 'starting' } });
  const network = await openNetworkStatus(page);
  await page.waitForFunction(() => document.querySelector('.pc-network-summary').textContent.includes('5 shared models'));
  assert.match(await network.locator('.pc-network-summary').textContent(), /1 hosted models/);
  assert.match(await network.locator('.pc-network-summary').textContent(), /Inference discovery remains available/);
});

test('failed auto-connect stays offline with its error through later directory refreshes', async (t) => {
  const page = await fixture(t, { connectFailure: true, interval: 30 });
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  const network = await openNetworkStatus(page);
  const text = await network.locator('.pc-network-summary').textContent();
  assert.match(text, /Peer network is offline/);
  assert.match(text, /Relay unavailable/);
  assert.doesNotMatch(text, /Connecting/);
});

test('opened model pickers wrap long names inside desktop and mobile viewports and retain focus during refresh', async (t) => {
  const page = await fixture(t, { interval: 50, loaded: true });
  for (const viewport of [{ width: 866, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const options = await openChatOptions(page);
    for (const name of ['Chat target']) {
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
    await options.getByRole('button', { name: 'Done', exact: true }).click();
  }
});

test('import progress advances past the last file into verification and GPU loading', async (t) => {
  const page = await fixture(t, { importProgress: true, acquireDelay: 1200 });
  await browseChoice(page, 'hf:vision', 'Load');
  const status = page.locator('.pc-inference-panel > [role=status]');
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Downloading 7/7: LICENSE'));
  assert.match(await status.textContent(), /1.0 KiB|1 KiB/);
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Using saved file 7/7: LICENSE'));
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Verifying stored model files'));
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Loading model into RAM'));
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Loading model: unet'));
  await page.waitForFunction(() => /Loading model: unet \(\d+s\)/.test(document.querySelector('.pc-inference-panel > [role=status]').textContent));
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Model ready.'));
  assert.doesNotMatch(await status.textContent(), /LICENSE|undefined/);
  await page.waitForTimeout(1050); assert.match(await status.textContent(), /Model ready/);
});

test('peer refresh marks busy only for all-busy providers and never silently changes a selected target', async (t) => {
  const page = await fixture(t, { loaded: true, interval: 50, refreshDelay: 80 });
  await selectChatTarget(page, 'peer:fixture');
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
  await selectChatTarget(page, 'peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Describe this.');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  assert.match(await page.locator('.pc-route-policy').textContent(), /No compatible vision/);
  await page.getByLabel('Message', { exact: true }).press('Enter');
  assert.equal(await page.getByAltText('Selected image', { exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Describe this.');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'generate').length), 0);
  await selectChatTarget(page, 'local:fixture-vision');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  const request = await page.evaluate(() => calls.find((call) => call.type === 'generate'));
  assert.deepEqual(request.image, { width: 512, height: 256, bytes: 512 * 256 * 4 });
  assert.equal(request.messages.length, 1); assert.equal(await page.getByAltText('Selected image', { exact: true }).isVisible(), false);
  await selectChatTarget(page, 'peer:fixture');
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
});

async function patternedImage(page, phase) {
  const result = await page.evaluate((phase) => {
    const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 24;
    const context = canvas.getContext('2d'); const image = context.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      image.data[index] = (x * 7 + phase * 101) % 256;
      image.data[index + 1] = (y * 11 + phase * 43) % 256;
      image.data[index + 2] = (x + y * 3 + phase * 71) % 256;
      image.data[index + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    return { png: canvas.toDataURL('image/png').split(',')[1], pixels: [...image.data], width: canvas.width, height: canvas.height };
  }, phase);
  return { ...result, sha256: createHash('sha256').update(Buffer.from(result.pixels)).digest('hex'),
    file: { name: 'same-name.png', mimeType: 'image/png', buffer: Buffer.from(result.png, 'base64') } };
}

test('Mixed and an exact peer accept vision attachments without a compatible local GPU or resident', async (t) => {
  const page = await fixture(t, { peerVision: true, availability: {
    'hf:vision': { status: 'unavailable', reason: 'WebGPU is unavailable on this device.' },
    'peer:fixture': { status: 'unavailable', reason: 'WebGPU is unavailable on this device.' },
  } });
  for (const target of ['mixed', 'peer:fixture']) {
    await selectChatTarget(page, target);
    assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isEnabled(), true);
    const input = await patternedImage(page, target === 'mixed' ? 4 : 5);
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Attach image', exact: true }).click();
    await (await chooser).setFiles(input.file);
    await page.getByAltText('Selected image', { exact: true }).waitFor();
    await page.getByLabel('Message', { exact: true }).fill(`Describe via ${target}`);
    await page.getByLabel('Message', { exact: true }).press('Enter');
    await page.getByText(`Reply to Describe via ${target}`, { exact: true }).waitFor();
  }
  const requests = await page.evaluate(() => calls.filter((call) => call.type === 'generate'));
  assert.deepEqual(requests.map(({ target, task }) => [target, task]),
    [['mixed', 'image-text-to-text'], ['peer:fixture', 'image-text-to-text']]);
  assert.ok(requests.every((request) => request.image.bytes > 0));
  assert.equal(await page.evaluate(() => calls.some((call) => ['acquire', 'load-stored'].includes(call.type))), false);
});

test('busy peer vision keeps attachments and drafts while full queues block sends until capacity returns', async (t) => {
  const page = await fixture(t, { peerVision: true,
    peerCapacity: { busy: true, queueAvailable: false, queueCapacity: 2, queuedRequests: 2 } });
  const input = await patternedImage(page, 6);
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isEnabled(), true);
  await page.getByLabel('Choose image attachment').setInputFiles(input.file);
  await page.getByAltText('Selected image', { exact: true }).waitFor();
  await page.getByLabel('Message', { exact: true }).fill('Keep this draft');
  assert.match(await page.locator('.pc-route-policy').textContent(), /no available queue capacity/);
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  await page.getByLabel('Message', { exact: true }).press('Enter');
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'generate')), false);
  await page.evaluate(() => { uiState.remote = false; return panel.refreshPeers(); });
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
  assert.equal(await page.getByAltText('Selected image', { exact: true }).isVisible(), true);
  await page.evaluate(() => { uiState.remote = true;
    uiState.peerCapacity = { busy: true, queueAvailable: true, queueCapacity: 2, queuedRequests: 1 };
    return panel.refreshPeers(); });
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isEnabled(), true);
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Keep this draft');
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'generate')), false);
  await selectChatTarget(page, 'local-only');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
  await selectChatTarget(page, 'mixed');
  await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.getByText('Reply to Keep this draft', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'generate').length), 1);
});

test('peer image generation does not claim vision input capability', async (t) => {
  const page = await fixture(t, { diffusion: true });
  await selectChatTarget(page, 'peer:fixture');
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
  await setChatOption(page, 'Generate image', true);
  await page.getByLabel('Message', { exact: true }).fill('A blue flower');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
});

test('Generate image requires an explicit choice and never discards a conflicting attached image', async (t) => {
  const page = await fixture(t, { loaded: true });
  const input = await patternedImage(page, 3);
  await page.getByLabel('Choose image attachment').setInputFiles(input.file);
  await page.getByAltText('Selected image', { exact: true }).waitFor({ state: 'visible' });
  await setChatOption(page, 'Generate image', true);
  await page.getByLabel('Message', { exact: true }).fill('Describe my photo');
  assert.match(await page.locator('.pc-route-policy').textContent(), /Remove the attached image or uncheck/);
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  await page.getByLabel('Message', { exact: true }).press('Enter');
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'generate')), false);
  assert.equal(await page.getByAltText('Selected image', { exact: true }).isVisible(), true);
  await setChatOption(page, 'Generate image', false);
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByText('Reply to Describe my photo', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => calls.find((call) => call.type === 'generate').task), 'image-text-to-text');
});

test('consecutive different images with the same filename send fresh complete pixels and unique requests', async (t) => {
  const page = await fixture(t, { loaded: true, capturePixels: true });
  const images = [await patternedImage(page, 0), await patternedImage(page, 1)];
  const previews = [];
  for (let index = 0; index < images.length; index++) {
    await page.getByLabel('Choose image attachment').setInputFiles(images[index].file);
    const preview = page.getByAltText('Selected image', { exact: true }); await preview.waitFor({ state: 'visible' });
    previews.push(await preview.getAttribute('src'));
    await page.getByLabel('Message', { exact: true }).fill('Describe the attached image.');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.waitForFunction((count) => pixelRequests.length === count
      && document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.', index + 1);
    assert.equal(await preview.isVisible(), false);
    assert.equal(await page.getByLabel('Choose image attachment').inputValue(), '');
  }
  const requests = await page.evaluate(() => pixelRequests);
  assert.equal(new Set(requests.map((request) => request.requestId)).size, 2);
  assert.notEqual(previews[0], previews[1]); assert.notEqual(requests[0].sha256, requests[1].sha256);
  for (let index = 0; index < images.length; index++) {
    assert.deepEqual(requests[index].pixels, images[index].pixels, `All pixels in request ${index + 1} must match its file`);
    assert.equal(requests[index].sha256, images[index].sha256);
    assert.deepEqual([requests[index].width, requests[index].height, requests[index].channels], [32, 24, 4]);
  }
  const visualCalls = await page.evaluate(() => calls.filter((call) => call.type === 'generate'));
  for (const request of visualCalls) assert.deepEqual(request.messages, [{ role: 'user', content: 'Describe the attached image.' }]);
  assert.equal(await page.locator('.pc-chat-message-user img').count(), 2, 'Earlier images remain in the visible transcript');
  await page.getByLabel('Message', { exact: true }).fill('Now a text-only follow-up.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => calls.filter((call) => call.type === 'generate').length === 3);
  const followup = await page.evaluate(() => calls.filter((call) => call.type === 'generate')[2]);
  assert.equal(followup.image, null);
  assert.deepEqual(followup.messages, [
    { role: 'user', content: 'Describe the attached image.' },
    { role: 'assistant', content: 'Reply to Describe the attached image.' },
    { role: 'user', content: 'Now a text-only follow-up.' },
  ], 'Only the latest successful image exchange becomes text follow-up context');
});

for (const target of ['local:fixture-vision', 'peer:fixture']) test(`new vision context on ${target} preserves system instructions and visible transcript`, async (t) => {
  const page = await fixture(t, { loaded: true, peerVision: true, context: true });
  await selectChatTarget(page, target);
  const send = async (text, count, file) => {
    if (file) { await page.getByLabel('Choose image attachment').setInputFiles(file); await page.getByAltText('Selected image', { exact: true }).waitFor({ state: 'visible' }); }
    await page.getByLabel('Message', { exact: true }).fill(text); await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.waitForFunction((count) => calls.filter((call) => call.type === 'generate').length === count
      && document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.', count);
  };
  await send('Earlier text conversation.', 1);
  await send('The first image.', 2, (await patternedImage(page, 4)).file);
  await send('A different second image.', 3, (await patternedImage(page, 5)).file);
  await send('Explain that latest description.', 4);
  const requests = await page.evaluate(() => calls.filter((call) => call.type === 'generate'));
  const system = { role: 'system', content: 'Optional embedded scene context\nSuggest an approved action.' };
  assert.deepEqual(requests[1].messages, [system, { role: 'user', content: 'The first image.' }]);
  assert.deepEqual(requests[2].messages, [system, { role: 'user', content: 'A different second image.' }]);
  assert.deepEqual(requests[3].messages, [system,
    { role: 'user', content: 'A different second image.' }, { role: 'assistant', content: 'Reply to A different second image.' },
    { role: 'user', content: 'Explain that latest description.' }]);
  assert(requests.every((request) => request.target === target));
  const transcript = await page.getByRole('log', { name: 'Conversation', exact: true }).textContent();
  for (const text of ['Reply to Earlier text conversation.', 'Reply to The first image.', 'Reply to A different second image.']) assert(transcript.includes(text));
  assert.equal(await page.locator('.pc-chat-message-user img').count(), 2);
  assert.deepEqual(await page.evaluate(() => contextCalls), Array.from({ length: 4 }, () => ({ includeImage: false })));
});

for (const outcome of ['failed', 'cancelled']) test(`${outcome} new image preserves the last committed vision context`, async (t) => {
  const page = await fixture(t, { loaded: true });
  await page.getByLabel('Choose image attachment').setInputFiles((await patternedImage(page, 6)).file);
  await page.getByAltText('Selected image', { exact: true }).waitFor({ state: 'visible' });
  await page.getByLabel('Message', { exact: true }).fill('Committed original image.'); await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.');
  await page.evaluate((outcome) => { uiState.rejectGeneration = outcome === 'failed'; uiState.generateDelay = outcome === 'cancelled' ? 10000 : 1; }, outcome);
  await page.getByLabel('Choose image attachment').setInputFiles((await patternedImage(page, 7)).file);
  await page.getByAltText('Selected image', { exact: true }).waitFor({ state: 'visible' });
  await page.getByLabel('Message', { exact: true }).fill('Uncommitted replacement image.'); await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => calls.filter((call) => call.type === 'generate').length === 2);
  if (outcome === 'cancelled') await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.waitForFunction((outcome) => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes(outcome === 'failed' ? 'Vision fixture generation failed' : 'Cancelled:'), outcome);
  await page.evaluate(() => { uiState.rejectGeneration = false; uiState.generateDelay = 1; });
  await page.getByLabel('Message', { exact: true }).fill('Continue the last completed description.'); await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => calls.filter((call) => call.type === 'generate').length === 3);
  const requests = await page.evaluate(() => calls.filter((call) => call.type === 'generate'));
  assert.deepEqual(requests[1].messages, [{ role: 'user', content: 'Uncommitted replacement image.' }]);
  assert.deepEqual(requests[2].messages, [
    { role: 'user', content: 'Committed original image.' }, { role: 'assistant', content: 'Reply to Committed original image.' },
    { role: 'user', content: 'Continue the last completed description.' },
  ]);
  assert.equal(requests[2].image, null);
});

test('a superseded image decode cannot replace the newer selected file or its transmitted pixels', async (t) => {
  const page = await fixture(t, { loaded: true, capturePixels: true });
  const first = await patternedImage(page, 2), second = await patternedImage(page, 3);
  await page.evaluate(() => {
    const original = createImageBitmap.bind(window); let count = 0;
    window.decodeProof = { started: 0, firstClosed: false };
    window.createImageBitmap = async (...args) => {
      const index = count++; decodeProof.started++;
      const bitmap = await original(...args);
      if (index !== 0) return bitmap;
      // Hold the first real decoded bitmap; the second still uses the native decoder.
      const close = bitmap.close.bind(bitmap);
      bitmap.close = () => { decodeProof.firstClosed = true; close(); };
      await new Promise((resolve) => { window.releaseFirstDecode = resolve; });
      return bitmap;
    };
  });
  t.after(() => page.isClosed() ? undefined : page.evaluate(() => window.releaseFirstDecode?.()));
  await page.getByLabel('Choose image attachment').setInputFiles(first.file);
  await page.waitForFunction(() => typeof releaseFirstDecode === 'function');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  await page.getByLabel('Choose image attachment').setInputFiles(second.file);
  const preview = page.getByAltText('Selected image', { exact: true }); await preview.waitFor({ state: 'visible' });
  const latestPreview = await preview.getAttribute('src');
  await page.evaluate(() => releaseFirstDecode()); await page.waitForFunction(() => decodeProof.firstClosed);
  assert.equal(await preview.getAttribute('src'), latestPreview);
  await page.getByLabel('Message', { exact: true }).fill('Describe only this selected image.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => pixelRequests.length === 1);
  const request = await page.evaluate(() => pixelRequests[0]);
  assert.equal(request.sha256, second.sha256); assert.deepEqual(request.pixels, second.pixels);
  assert.notEqual(request.sha256, first.sha256);
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
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type !== 'stored-list').length), 0);
});

test('Stop cancels an active request and failed preferences restore their prior value', async (t) => {
  const page = await fixture(t, { loaded: true, generateDelay: 10000 });
  await page.evaluate(() => { uiState.rejectSharing = true; });
  await openMenuAction(page, 'Configure model chat');
  await page.getByLabel('Share with peers', { exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Sharing failed'));
  assert.equal(await page.getByLabel('Share with peers', { exact: true }).isChecked(), true);
  await page.getByRole('dialog', { name: 'Config', exact: true }).getByRole('button', { name: 'Done' }).click();
  await page.getByLabel('Message', { exact: true }).fill('Cancel me'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'cancel') && document.querySelector('.pc-inference-panel > [role=status]').textContent.startsWith('Cancelled'));
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
  for (const [trigger, name] of [['Configure model chat', 'Config'], ['Models', 'Models']]) {
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
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  const vision = storedChoice(page, 'Fixture vision');
  await vision.waitFor();
  assert.match(await modal.textContent(), /1.00 GiB · Loaded · Shared/);
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'delete')), false);
  await deleteStored(page, ['Fixture vision']);
  assert.equal(await storedChoice(page, 'Fixture text').isDisabled(), true);
  assert.equal(await storedDelete(page).isDisabled(), true);
  await page.waitForFunction(() => !uiState.loaded && uiState.stored.length === 1);
  await storedPanel(page).getByRole('status').filter({ hasText: /Deleted Fixture vision/ }).waitFor();
  assert.equal(await vision.count(), 0);
  assert.equal(await storedChoice(page, 'Fixture text').isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'delete')), [{ type: 'delete', cid: 'fixture-vision' }]);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Keep my draft');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true, 'Mixed may still use the available peer after local deletion');
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'mixed');
  await openMenuAction(page, 'Models');
  await deleteStored(page, ['Fixture text']);
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

test('stored model read and deletion failures stay visible and retryable without removing rows', async (t) => {
  const page = await fixture(t, { rejectStoredList: true, stored: [
    { manifestCid: 'fixture-text', name: 'Fixture text', totalBytes: 1024, shared: false },
  ] });
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await modal.getByText('Error: Storage is temporarily unavailable', { exact: true }).waitFor();
  await page.evaluate(() => { uiState.rejectStoredList = false; uiState.rejectDelete = true; });
  await modal.getByRole('button', { name: 'Refresh', exact: true }).click();
  await selectStored(page, ['Fixture text']);
  const remove = storedDelete(page); await remove.click();
  await storedPanel(page).getByRole('status').filter({ hasText: /Model is still in use/ }).waitFor();
  assert.equal(await remove.isEnabled(), true);
  assert.equal(await page.evaluate(() => uiState.stored.length), 1);
  await page.evaluate(() => { uiState.rejectDelete = false; }); await remove.click();
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

const pendingStoredModel = { manifestCid: 'fixture-vision', name: 'Saved package', totalBytes: 2048,
  needsVerification: true, localAvailability: { status: 'unavailable', code: 'model_verification_required',
    reason: 'Saved files need local verification. No download is required.' } };

test('retained pending startup guides to local verification without import or automatic load', async (t) => {
  const page = await fixture(t, { interval: 40, keepStartupPicker: true, stored: [pendingStoredModel],
    startup: { ...pendingStoredModel, sourceKey: 'hf:vision' },
    availability: { 'hf:vision': pendingStoredModel.localAvailability } });
  await page.getByText(/Choose stored models to load/).waitFor();
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await libraryDialog(page).getByRole('button', { name: 'Load selected', exact: true }).isDisabled(), true);
  assert.equal(await page.evaluate(() => calls.some((call) => ['acquire', 'load-stored', 'verify-local'].includes(call.type))), false);
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await modal.getByRole('button', { name: 'Verify locally Saved package' }).waitFor();
  assert.equal(await page.getByRole('dialog', { name: 'Model setup', exact: true }).isVisible(), false);
  assert.match(await modal.textContent(), /Needs local verification/);
  assert.equal(await modal.getByRole('button', { name: 'Load Saved package', exact: true }).count(), 0);
});

test('Verify locally shows byte progress, retains the dialog and requires a separate explicit Load', async (t) => {
  const page = await fixture(t, { stored: [pendingStoredModel], verifyDelay: 200 });
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await modal.getByRole('button', { name: 'Verify locally Saved package' }).click();
  await modal.getByText(/Verifying stored model files.*1 KiB.*2 KiB/).waitFor();
  assert.equal(await storedDelete(page).isDisabled(), true);
  await modal.getByText('Verified Saved package from local files. You can now load it.', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => calls.some((call) => ['acquire', 'load-stored'].includes(call.type))), false);
  await loadStored(page, ['Saved package']);
  await page.waitForFunction(() => uiState.loaded);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['verify-local', 'load-stored'].includes(call.type)).map((call) => call.type)),
    ['verify-local', 'load-stored']);
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'acquire')), false);
});

test('local verification cancel waits for cleanup and failed verification remains retryable', async (t) => {
  const page = await fixture(t, { stored: [pendingStoredModel], verifyDelay: 60000, waitForLoadCleanup: true });
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await modal.getByRole('button', { name: 'Verify locally Saved package' }).click();
  const cancel = modal.getByRole('button', { name: 'Cancel verification', exact: true });
  await cancel.click();
  await page.waitForFunction(() => uiState.cleaning);
  assert.equal(await cancel.isDisabled(), true);
  assert.match(await modal.textContent(), /Cancelling verification.*Waiting for cleanup/);
  assert.equal(await modal.getByRole('button', { name: 'Verify locally Saved package' }).isDisabled(), true);
  await page.evaluate(() => finishLoadCleanup());
  await modal.getByText(/Cancelled:/).waitFor();
  assert.equal(await modal.getByRole('button', { name: 'Verify locally Saved package' }).isEnabled(), true);
  assert.equal(await page.evaluate(() => uiState.stored[0].needsVerification), true);
  assert.equal(await page.evaluate(() => calls.some((call) => ['acquire', 'load-stored'].includes(call.type))), false);

  const failed = await fixture(t, { stored: [pendingStoredModel], rejectVerification: true });
  await openMenuAction(failed, 'Models');
  const failureModal = failed.getByRole('dialog', { name: 'Models', exact: true });
  await failureModal.getByRole('button', { name: 'Verify locally Saved package' }).click();
  await failureModal.getByText(/Local verification failed: missing block/).waitFor();
  assert.equal(await failureModal.getByRole('button', { name: 'Verify locally Saved package' }).isEnabled(), true);
  await selectStored(failed, ['Saved package']);
  assert.equal(await storedDelete(failed).isEnabled(), true);
});

test('stored deletion stays disabled during a request and modal bounds fit mobile and desktop', async (t) => {
  const page = await fixture(t, { loaded: true, generateDelay: 10000, stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024, shared: true },
  ] });
  await page.getByLabel('Message', { exact: true }).fill('Pending'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const [trigger, name] of [['Models', 'Models'], ['Configure model chat', 'Config']]) {
      await openMenuAction(page, trigger);
      const modal = page.getByRole('dialog', { name, exact: true });
      if (name === 'Models') {
        await storedChoice(page, 'Fixture vision').waitFor();
        assert.equal(await storedChoice(page, 'Fixture vision').isDisabled(), true);
        assert.equal(await storedDelete(page).isDisabled(), true);
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
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await deleteStored(page, ['Fixture vision']);
  await storedPanel(page).getByRole('status').filter({ hasText: /Storage cleanup interrupted/ }).waitFor();
  assert.match(await modal.textContent(), /Cleanup pending/);
  assert.doesNotMatch(await modal.textContent(), /Loaded/);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 3);
  await page.keyboard.press('Escape');
  await openMenuAction(page, 'Models');
  await page.evaluate(() => { uiState.cleanupFails = false; });
  await deleteStored(page, ['Fixture vision']);
  await modal.getByText('No models stored on this device.', { exact: true }).waitFor();
});

test('a sharing failure keeps the imported model usable and explains its library status', async (t) => {
  const page = await fixture(t, { stored: [
    { manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024, shared: false, shareError: 'Peer network is offline' },
  ] });
  await browseChoice(page, 'hf:vision', 'Load');
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Model ready. Sharing is unavailable'));
  await page.getByLabel('Message', { exact: true }).fill('Still usable');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  await openMenuAction(page, 'Models');
  await page.getByRole('dialog', { name: 'Models', exact: true }).getByText('Sharing unavailable: Peer network is offline', { exact: true }).waitFor();
});

test('local and peer image targets turn each prompt into a bounded image without chat context or attachments', async (t) => {
  const page = await fixture(t, { loaded: true, diffusion: true, context: true });
  assert.equal(await page.getByLabel('Generate image', { exact: true }).isChecked(), false);
  await setChatOption(page, 'Generate image', true);
  const prompt = page.getByLabel('Message', { exact: true });
  assert.equal(await prompt.getAttribute('placeholder'), 'Describe an image…');
  assert.equal(await page.getByRole('button', { name: 'Attach image', exact: true }).isDisabled(), true);
  for (const [target, text] of [['local:fixture-vision', 'A red circle'], ['peer:fixture', 'A blue square']]) {
    await selectChatTarget(page, target);
    await prompt.fill(text); await prompt.press('Enter');
    await page.getByAltText(`Generated image: ${text}`, { exact: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.');
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
    [{ target: 'local:fixture-vision', prompt: 'A red circle', messages: undefined, image: null, maxNewTokens: undefined },
      { target: 'peer:fixture', prompt: 'A blue square', messages: undefined, image: null, maxNewTokens: undefined }]);
  assert.deepEqual(evidence.contextCalls, []); assert.deepEqual(evidence.actions, []); assert.deepEqual(evidence.writes, []);
  assert.equal(evidence.previews, 2);
  assert.equal(await page.getByRole('button', { name: 'Apply: test action', exact: true }).count(), 0);
});

test('generated image previews have a bounded history and revoke every URL on disposal', async (t) => {
  const page = await fixture(t, { loaded: true, diffusion: true });
  await setChatOption(page, 'Generate image', true);
  for (let index = 0; index < 8; index++) {
    await page.getByLabel('Message', { exact: true }).fill('Image ' + index);
    await page.getByLabel('Message', { exact: true }).press('Enter');
    await page.getByAltText('Generated image: Image ' + index, { exact: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent === 'Ready.');
  }
  assert.equal(await page.locator('.pc-generated-image').count(), 6);
  assert.equal(await page.evaluate(() => previewUrls.revoked.length), 2);
  await page.evaluate(() => panel.dispose());
  assert.deepEqual(await page.evaluate(() => [...previewUrls.revoked].sort()), await page.evaluate(() => [...previewUrls.created].sort()));
});

test('invalid pixels and late cancelled image results never become preview URLs', async (t) => {
  const invalid = await fixture(t, { loaded: true, diffusion: true, invalidImage: true });
  await setChatOption(invalid, 'Generate image', true);
  await invalid.getByLabel('Message', { exact: true }).fill('Invalid output'); await invalid.getByLabel('Message', { exact: true }).press('Enter');
  await invalid.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('bounded RGBA'));
  assert.equal(await invalid.evaluate(() => previewUrls.created.length), 0);
  const cancelled = await fixture(t, { loaded: true, diffusion: true, generateDelay: 100, ignoreAbort: true });
  await setChatOption(cancelled, 'Generate image', true);
  await cancelled.getByLabel('Message', { exact: true }).fill('Cancel output'); await cancelled.getByLabel('Message', { exact: true }).press('Enter');
  await cancelled.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await cancelled.getByRole('button', { name: 'Stop', exact: true }).click();
  await cancelled.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.startsWith('Cancelled'));
  assert.equal(await cancelled.evaluate(() => previewUrls.created.length), 0);
});

test('unsupported selection opens repeatable setup help, preserves selection and never imports', async (t) => {
  const page = await fixture(t, { interval: 50, loaded: true, availability: {
    'peer:fixture': { status: 'unavailable', code: 'gpu_feature_unavailable', reason: 'Required FP16 GPU math (shader-f16) is unavailable in this browser' },
  } });
  const source = page.getByRole('button', { name: 'Models', exact: true });
  const help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  await browseChoice(page, 'peer:fixture', 'Setup help'); await help.waitFor();
  assert.equal(await rememberedModelKey(page), 'hf:vision');
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
  await page.waitForFunction(() => document.activeElement?.textContent === 'Models');
  assert.equal(await source.evaluate((element) => element === document.activeElement), true);
  await browseChoice(page, 'peer:fixture', 'Setup help'); await help.waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'unload', 'pin', 'budgets'].includes(call.type))), []);
  assert.equal(await page.evaluate(() => uiState.loaded), true);
});

test('keyboard can open an all-unavailable choice and budget help links to Config', async (t) => {
  const unavailable = { status: 'unavailable', code: 'gpu_budget_exceeded', reason: 'Exceeds configured GPU memory budget' };
  const page = await fixture(t, { availability: { 'hf:vision': unavailable, 'peer:fixture': unavailable } });
  const source = page.getByRole('button', { name: 'Models', exact: true }), help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  assert.equal(await rememberedModelKey(page), 'hf:vision');
  await source.focus(); await page.keyboard.press('Enter');
  const browser = page.getByRole('dialog', { name: 'Models', exact: true });
  await browser.getByRole('tab', { name: 'Browse models', exact: true }).click();
  await browser.locator('[data-model-key="hf:vision"]').focus(); await page.keyboard.press('Enter');
  assert.equal(await browser.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await browser.getByRole('button', { name: 'Setup help', exact: true }).focus(); await page.keyboard.press('Enter'); await help.waitFor();
  assert.equal(await help.getByLabel('Browser launch command', { exact: true }).isVisible(), false);
  await help.getByRole('button', { name: 'Open Config', exact: true }).click();
  const config = page.getByRole('dialog', { name: 'Config', exact: true });
  assert.equal(await config.isVisible(), true); assert.equal(await help.isVisible(), false);
  assert.equal(await config.evaluate((element) => element.contains(document.activeElement)), true);
  await page.keyboard.press('Escape');
  await browseChoice(page, 'hf:vision', 'Setup help'); await help.waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')), []);
});

test('setup command has a manual-copy fallback and dialog fits mobile with focus trapping', async (t) => {
  const page = await fixture(t, { availability: { 'hf:vision': { status: 'unavailable', code: 'gpu_feature_unavailable', reason: 'shader-f16 is required' } } });
  await page.setViewportSize({ width: 390, height: 660 });
  await browseChoice(page, 'hf:vision', 'Setup help');
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
  const source = page.getByRole('button', { name: 'Models', exact: true }), help = page.getByRole('dialog', { name: 'Model setup', exact: true });
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText() {
    return new Promise((resolve, reject) => { window.finishCopy = resolve; window.rejectCopy = reject; });
  } } }));
  for (const fail of [false, true]) {
    await browseChoice(page, 'peer:fixture', 'Setup help');
    await help.getByLabel('Browser', { exact: true }).selectOption('chrome');
    await help.getByLabel('Operating system', { exact: true }).selectOption('linux');
    await help.getByRole('button', { name: 'Copy command', exact: true }).click();
    await help.getByRole('button', { name: 'Done', exact: true }).click();
    await browseChoice(page, 'peer:fixture', 'Setup help');
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
    assert.deepEqual(await menuDialog.getByRole('button').allTextContents(), ['Done', 'Models', 'Config', 'About']);
    assert.equal(await page.locator('.pc-model-toolbar button').allTextContents().then((labels) => labels.join(',')), 'Models,Agents');
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
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type !== 'stored-list')), []);
  await menu.click(); await page.evaluate(() => panel.dispose());
  assert.equal(await page.locator('dialog[open]').count(), 0);
});

test('modal package order and selection survive directory refresh without loading or changing peer targets', async (t) => {
  const sources = [
    { key: 'hf:huge', name: 'A huge model', source: 'hf', totalBytes: 8 * 1024 ** 3 },
    { key: 'peer:unknown', name: 'Unknown model', source: 'peers' },
    { key: 'stored:small', name: 'Stored model', source: 'stored', manifestCid: 'small', totalBytes: 2 * 1024 ** 2 },
    { key: 'hf:tie', name: 'Tie model', source: 'hf', totalBytes: 2 * 1024 ** 2 },
    { key: 'hf:invalid', name: 'Bad size', source: 'hf', totalBytes: -1 },
  ];
  const page = await fixture(t, { sources, preferredSourceKey: 'hf:huge', interval: 50 });
  await selectChatTarget(page, 'peer:fixture');
  const modal = await browseChoice(page, 'stored:small');
  assert.deepEqual(await modal.locator('[data-model-key]').evaluateAll((items) => items.map((item) => item.dataset.modelKey)),
    ['stored:small', 'hf:tie', 'hf:huge', 'hf:invalid', 'peer:fixture', 'peer:unknown']);
  assert.match(await modal.locator('[data-model-key="stored:small"]').textContent(), /Stored on this device · 2.0 MiB package/);
  assert.match(await modal.locator('[data-model-key="hf:huge"]').textContent(), /8.00 GiB package/);
  assert.match(await modal.locator('[data-model-key="peer:unknown"]').textContent(), /Unknown size/);
  await page.evaluate(() => uiState.sources.reverse()); await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.equal(await modal.locator('[aria-pressed=true]').getAttribute('data-model-key'), 'stored:small');
  assert.equal(await rememberedModelKey(page), 'hf:huge');
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  await showBrowseResults(page);
  await modal.getByLabel('Source', { exact: true }).selectOption('stored');
  assert.equal(await modal.locator('[data-model-key]').count(), 1);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type !== 'stored-list')), []);
});

test('an unavailable preferred model stays visible with setup help while browsing does not autoload', async (t) => {
  const page = await fixture(t, { preferredSourceKey: 'peer:fixture', interval: 50, availability: {
    'peer:fixture': { status: 'unavailable', code: 'gpu_feature_unavailable', reason: 'shader-f16 is unavailable' },
  } });
  assert.equal(await rememberedModelKey(page), 'peer:fixture');
  const modal = await openModelsBrowse(page);
  assert.equal(await modal.locator('[data-model-key="peer:fixture"]').getAttribute('aria-pressed'), 'true');
  await modal.locator('[data-model-key="peer:fixture"]').click();
  assert.equal(await modal.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  await modal.getByRole('button', { name: 'Setup help', exact: true }).click();
  const help = page.getByRole('dialog', { name: 'Model setup', exact: true }); await help.waitFor();
  assert.match(await help.textContent(), /shader-f16/); await page.keyboard.press('Escape');
  await browseChoice(page, 'hf:vision'); await closeModels(page);
  assert.equal(await rememberedModelKey(page), 'peer:fixture');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type !== 'stored-list')), []);
});

test('Stored Models adds a package atomically, preserves the chosen target and remembers its source', async (t) => {
  const page = await fixture(t, { loaded: true, preferredSourceKey: 'hf:vision', loadStoredDelay: 100,
    stored: [{ manifestCid: 'fixture-vision', name: 'Fixture vision', totalBytes: 1024 ** 3 },
      { manifestCid: 'small', name: 'Small stored', totalBytes: 2 * 1024 ** 2 }],
    sources: [{ key: 'hf:vision', name: 'Fixture vision', source: 'hf', totalBytes: 1024 ** 3 },
      { key: 'stored:small', name: 'Small stored', source: 'stored', manifestCid: 'small', totalBytes: 2 * 1024 ** 2 }],
  });
  await selectChatTarget(page, 'peer:fixture');
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await storedChoice(page, 'Small stored').waitFor();
  await selectStored(page, ['Small stored']); const load = storedLoad(page);
  assert.deepEqual(await modal.locator('.pc-stored-model strong').allTextContents(), ['Small stored', 'Fixture vision']);
  assert.equal(await modal.getByRole('button', { name: 'Unload Fixture vision', exact: true }).isEnabled(), true);
  await load.click();
  assert.equal(await storedDelete(page).isDisabled(), true);
  await load.evaluate((element) => element.onclick());
  await page.waitForFunction(() => uiState.loadedCid === 'small');
  await modal.waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 3, 'Startup, explicit reopening and the cancellable final refresh each read the library once');
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  assert.equal(await rememberedModelKey(page), 'stored:small');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire', 'unload', 'pin'].includes(call.type))),
    [{ type: 'load-stored', cid: 'small', gpuLayers: 99999 }]);
  await openMenuAction(page, 'Models');
  await modal.getByRole('button', { name: 'Unload Small stored', exact: true }).waitFor();
  assert.equal(await modal.getByRole('button', { name: 'Unload Small stored', exact: true }).isEnabled(), true);
  await modal.getByRole('button', { name: 'Unload Small stored', exact: true }).click();
  await modal.getByText('Unloaded Small stored. Its files remain stored.', { exact: true }).waitFor();
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['fixture-vision']);
  assert.equal(await modal.getByRole('button', { name: 'Unload Fixture vision', exact: true }).isEnabled(), true);
  assert.equal(await page.evaluate(() => uiState.stored.length), 2);
});

test('stored loading failures and cancellation remain retryable without import or download fallback', async (t) => {
  const page = await fixture(t, { loadStoredDelay: 150, stored: [{ manifestCid: 'small', name: 'Stored model', totalBytes: 1024 }] });
  await page.evaluate(() => { uiState.rejectLoad = true; });
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await selectStored(page, ['Stored model']); const load = storedLoad(page); await load.click();
  await storedPanel(page).getByRole('status').filter({ hasText: /Stored model could not be loaded/ }).waitFor();
  assert.equal(await load.isEnabled(), true);
  await page.evaluate(() => { uiState.rejectLoad = false; }); await load.click();
  await page.getByRole('dialog', { name: 'Loading model', exact: true }).getByRole('button', { name: 'Cancel', exact: true }).click();
  await modal.getByRole('status').filter({ hasText: /^Cancelled:/ }).waitFor();
  assert.equal(await page.evaluate(() => uiState.loaded), false);
  await load.and(page.locator(':enabled')).waitFor();
  await load.click(); await modal.waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => uiState.loadedCid), 'small');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').length), 3);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'pin', 'unload'].includes(call.type))), []);
});

test('unavailable, deleting and loaded stored packages are selectable but cannot start another load', async (t) => {
  const page = await fixture(t, { loaded: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Resident', totalBytes: 1024 },
    { manifestCid: 'deleting', name: 'Deleting', totalBytes: 2048, cleanupPending: true },
    { manifestCid: 'blocked', name: 'Blocked', totalBytes: 4096, localAvailability: { status: 'unavailable', code: 'gpu_budget_exceeded', reason: 'Needs more GPU memory.' } },
  ] });
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await selectStored(page, ['Resident', 'Deleting', 'Blocked']);
  for (const name of ['Resident', 'Deleting', 'Blocked']) assert.equal(await storedChoice(page, name).isChecked(), true);
  assert.equal(await storedLoad(page).isDisabled(), true);
  assert.equal(await storedDelete(page).isEnabled(), true);
  await storedLoad(page).evaluate((element) => element.onclick());
  assert.match(await modal.textContent(), /Needs more GPU memory/);
  assert.equal(await modal.locator('.pc-stored-model').getByRole('button', { name: /^(Load |Delete |Retry delete )/ }).count(), 0);
  assert.equal(await page.getByRole('dialog', { name: 'Model setup', exact: true }).isVisible(), false);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire', 'unload'].includes(call.type))), []);
});

test('Stored Models loads speech as an additional capability without dispatching it to chat', async (t) => {
  const page = await fixture(t, { loaded: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Moonshine Tiny', totalBytes: 113009473, runtime: 'transformers-speech',
      task: 'automatic-speech-recognition', localAvailability: { status: 'unknown' } },
    { manifestCid: 'saved-voice', name: 'Supertonic', totalBytes: 262000000, runtime: 'transformers-speech',
      task: 'text-to-speech', localAvailability: { status: 'unknown' } },
    { manifestCid: 'bad-voice', name: 'Changed voice package', totalBytes: 1024, runtime: 'transformers-speech',
      loadMode: 'voice', localAvailability: { status: 'unavailable', code: 'catalog_unsupported', reason: 'Speech package differs from the pinned voice catalog' } },
  ] });
  await openMenuAction(page, 'Models');
  const modal = page.getByRole('dialog', { name: 'Models', exact: true });
  await modal.getByRole('button', { name: 'Unload Moonshine Tiny', exact: true }).waitFor();
  await selectStored(page, ['Changed voice package']);
  assert.equal(await storedLoad(page).isDisabled(), true);
  await storedChoice(page, 'Changed voice package').uncheck(); await selectStored(page, ['Supertonic']);
  assert.equal(await storedLoad(page).isEnabled(), true);
  assert.match(await modal.textContent(), /Speech recognition.*Talk/);
  assert.match(await modal.textContent(), /differs from the pinned voice catalog/);
  assert.doesNotMatch(await modal.textContent(), /Unsupported model runtime/);
  await storedLoad(page).click();
  await modal.waitFor({ state: 'hidden' });
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['fixture-vision', 'saved-voice']);
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'mixed');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['generate', 'acquire', 'unload'].includes(call.type))), []);
  await openMenuAction(page, 'Models');
  await deleteStored(page, ['Supertonic']);
  await page.waitForFunction(() => !uiState.stored.some((model) => model.manifestCid === 'saved-voice'));
  // The storage mutation precedes acknowledged UI cleanup and library refresh.
  await modal.getByRole('button', { name: 'Unload Moonshine Tiny', exact: true }).and(page.locator(':enabled')).waitFor();
  assert.equal(await modal.getByRole('button', { name: 'Unload Moonshine Tiny', exact: true }).isEnabled(), true);
});

test('startup downloads the default once, without waiting for the peer network', async (t) => {
  const page = await fixture(t, { startup: { sourceKey: 'hf:vision', name: 'Fixture vision' },
    acquireDelay: 100, connectFailure: true, interval: 50 });
  await page.waitForFunction(() => uiState.loaded);
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'acquire')),
    [{ type: 'acquire', key: 'hf:vision', gpuLayers: 99999 }]);
  assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Loaded Fixture vision/);
  await selectChatTarget(page, 'peer:fixture');
  await browseChoice(page, 'peer:fixture'); await closeModels(page);
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'peer:fixture');
  assert.equal(await rememberedModelKey(page), 'hf:vision');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'acquire').length), 1);
});

test('startup opens stored choices and waits for explicit loading without download fallback', async (t) => {
  const page = await fixture(t, { preferredSourceKey: 'peer:fixture', keepStartupPicker: true,
    stored: [{ manifestCid: 'fixture', name: 'Remembered model', totalBytes: 1024 }],
    startup: { sourceKey: 'peer:fixture', manifestCid: 'fixture', name: 'Remembered model' },
    loadStoredDelay: 100, interval: 50 });
  assert.equal(await rememberedModelKey(page), 'peer:fixture');
  const picker = page.getByRole('dialog', { name: 'Models', exact: true });
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored'].includes(call.type))), []);
  await picker.getByRole('checkbox', { name: 'Select Remembered model', exact: true }).check();
  await picker.getByRole('button', { name: 'Load selected', exact: true }).click();
  await page.waitForFunction(() => uiState.loadedCid === 'fixture');
  await picker.waitFor({ state: 'hidden' });
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire', 'unload', 'pin'].includes(call.type))),
    [{ type: 'load-stored', cid: 'fixture', gpuLayers: 99999 }]);
  assert.equal(await page.locator('dialog[open]').count(), 0);
});

test('blocked startup keeps setup help in Models details and remote inference available', async (t) => {
  const page = await fixture(t, { preferredSourceKey: 'hf:vision',
    startup: { sourceKey: 'hf:vision', name: 'Fixture vision' }, interval: 50,
    availability: { 'hf:vision': { status: 'unavailable', reason: 'shader-f16 is unavailable' } } });
  assert.equal(await rememberedModelKey(page), 'hf:vision');
  assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Cannot load Fixture vision: shader-f16/);
  assert.equal(await page.getByRole('button', { name: 'Set up selected model', exact: true }).count(), 0);
  assert.equal(await page.locator('dialog[open]').count(), 0);
  const models = await browseChoice(page, 'hf:vision');
  assert.equal(await models.getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.equal(await models.getByRole('button', { name: 'Setup help', exact: true }).isVisible(), true);
  await closeModels(page);
  await selectChatTarget(page, 'peer:fixture');
  await page.getByLabel('Message', { exact: true }).fill('Hello peer');
  await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => calls.some((call) => call.type === 'generate'));
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored'].includes(call.type))), []);
});

test('startup cancellation releases controls and Models details Load is an explicit retry', async (t) => {
  const page = await fixture(t, { startup: { sourceKey: 'hf:vision', name: 'Fixture vision' }, acquireDelay: 500, interval: 50 });
  assert.equal(await page.getByRole('button', { name: 'Models', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.startsWith('Cancelled:'));
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.equal(await page.evaluate(() => uiState.loaded), false);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'acquire').length), 1);
  await browseChoice(page, 'hf:vision', 'Load');
  await page.waitForFunction(() => uiState.loaded);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'acquire').length), 2);
});

test('failed explicit stored selection reports the error without downloading or retrying on polling', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, stored: [{ manifestCid: 'missing', name: 'Stored model', totalBytes: 1024 }],
    startup: { sourceKey: 'hf:vision', manifestCid: 'missing', name: 'Stored model' }, rejectLoad: true, interval: 50 });
  const picker = page.getByRole('dialog', { name: 'Models', exact: true });
  await picker.getByRole('checkbox', { name: 'Select Stored model', exact: true }).check();
  await picker.getByRole('button', { name: 'Load selected', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.includes('Stored model could not be loaded'));
  await page.waitForFunction(() => uiState.refreshCalls >= 4);
  assert.equal(await storedLoad(page).isEnabled(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load-stored', 'acquire'].includes(call.type))),
    [{ type: 'load-stored', cid: 'missing', gpuLayers: 99999 }]);
  assert.equal(await picker.isVisible(), true);
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
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type !== 'stored-list')), []);
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
    await page.evaluate(() => {
      window.visibleLoadStages = [];
      const dialog = document.querySelector('.pc-model-loading');
      // Capture real rendered stage changes rather than racing 150ms stages
      // against locator polling and browser scheduling under parallel suites.
      const observer = new MutationObserver(() => {
        if (dialog.open) visibleLoadStages.push(dialog.querySelector('[role=status]').textContent);
      });
      observer.observe(dialog, { subtree: true, childList: true, characterData: true });
      window.stopLoadStageObserver = () => observer.disconnect();
    });
    await browseChoice(page, key, 'Load');
    const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
    await overlay.waitFor();
    assert.match(await overlay.textContent(), key === 'hf:vision' ? /Fixture vision/ : /Peer text model/);
    assert.equal(await overlay.getByRole('button', { name: 'Done', exact: true }).count(), 0);
    assert.equal(await overlay.getByRole('button', { name: 'Close', exact: true }).count(), 0);
    await overlay.waitFor({ state: 'hidden' });
    const stages = await page.evaluate(() => { stopLoadStageObserver(); return visibleLoadStages; });
    for (const label of ['Downloading 7/7', 'Using saved file 7/7', 'Verifying stored model files', 'Loading model into RAM', 'Loading model: unet']) {
      assert(stages.some((text) => text.includes(label)), `Loading overlay displayed ${label}`);
    }
    assert.equal(await page.evaluate(() => uiState.loaded), true);
    assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Model ready/);
    assert.equal(await page.getByRole('button', { name: 'Models', exact: true }).evaluate((button) => button === document.activeElement), true);
  }
});

test('overlays cover selected saved and default loads and Escape waits for cancellation cleanup', async (t) => {
  for (const manifestCid of [undefined, 'saved']) {
    const page = await fixture(t, { startup: { sourceKey: 'hf:vision', manifestCid, name: 'Startup model' },
      keepStartupPicker: true, stored: manifestCid ? [{ manifestCid, name: 'Startup model', totalBytes: 1024 }] : [],
      acquireDelay: 10000, loadStoredDelay: 10000, waitForLoadCleanup: true });
    if (manifestCid) {
      const picker = page.getByRole('dialog', { name: 'Models', exact: true });
      await picker.getByRole('checkbox', { name: 'Select Startup model', exact: true }).check();
      await picker.getByRole('button', { name: 'Load selected', exact: true }).click();
    }
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
    if (manifestCid) {
      const retry = storedLoad(page);
      await retry.and(page.locator(':enabled')).waitFor();
      assert.equal(await retry.isEnabled(), true, 'Stored retry becomes available after canceled-load reconciliation');
      assert.match(await storedPanel(page).getByRole('status').textContent(), /Cancelled:/);
    }
    else assert.equal(await page.getByRole('button', { name: 'Models', exact: true }).isEnabled(), true);
  }
});

test('stored-library overlay keeps cleanup failures visible without reporting successful cancellation', async (t) => {
  const page = await fixture(t, { stored: [{ manifestCid: 'saved', name: 'Stored package', totalBytes: 1024 }],
    loadStoredDelay: 10000, waitForLoadCleanup: true, cleanupFailure: true });
  await openMenuAction(page, 'Models');
  const library = page.getByRole('dialog', { name: 'Models', exact: true });
  await loadStored(page, ['Stored package']);
  const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
  await overlay.waitFor(); assert.match(await overlay.textContent(), /Stored package/);
  await overlay.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => uiState.cleaning === true);
  assert.equal(await overlay.isVisible(), true);
  await page.evaluate(() => finishLoadCleanup()); await overlay.waitFor({ state: 'hidden' });
  assert.equal(await library.isVisible(), true);
  await storedLoad(page).and(page.locator(':enabled')).waitFor();
  assert.match(await library.getByRole('status').textContent(), /Error: Model cleanup is incomplete/);
  assert.doesNotMatch(await library.getByRole('status').textContent(), /Cancelled:/);
  const focus = await library.evaluate((element) => ({ inside: element.contains(document.activeElement),
    active: document.activeElement?.outerHTML.slice(0, 512), open: element.open }));
  assert.equal(focus.inside, true, JSON.stringify(focus));
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').length), 1);
});

test('loading overlay fits desktop, mobile and embedded panels and honors reduced motion', async (t) => {
  const page = await fixture(t, { acquireDelay: 10000, waitForLoadCleanup: true });
  const output = '/tmp/peercompute-model-loading-overlay'; await mkdir(output, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await browseChoice(page, 'hf:vision', 'Load');
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

const batchPackages = ['Alpha', 'Beta', 'Gamma'].map((name, index) => ({ manifestCid: name.toLowerCase(), name, totalBytes: 1024 * (index + 1) }));
async function chooseBatch(page, names = ['Alpha', 'Beta', 'Gamma']) {
  const picker = libraryDialog(page);
  for (const name of names) await picker.getByRole('checkbox', { name: `Select ${name}`, exact: true }).check();
  await picker.getByRole('button', { name: 'Load selected', exact: true }).click();
}

test('Load selected adds only eligible packages and preserves incompatible, loaded and pending selections', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, loaded: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Resident', totalBytes: 1 },
    { manifestCid: 'eligible', name: 'Eligible', totalBytes: 2 },
    { manifestCid: 'blocked', name: 'Blocked', totalBytes: 3, localAvailability: { status: 'unavailable', reason: 'Unsupported runtime' } },
    { ...pendingStoredModel, manifestCid: 'partial' },
    { manifestCid: 'cleanup', name: 'Cleanup', totalBytes: 5, cleanupPending: true },
    { manifestCid: 'checking', name: 'Checking', totalBytes: 6, localAvailability: { status: 'checking' } },
  ] });
  const names = ['Resident', 'Eligible', 'Blocked', 'Saved package', 'Cleanup', 'Checking'];
  await selectStored(page, names);
  assert.equal(await storedLoad(page).isEnabled(), true); assert.equal(await storedDelete(page).isEnabled(), true);
  assert.match(await storedPanel(page).textContent(), /6 models selected.*1 ready to load/);
  assert.equal(await storedPanel(page).locator('.pc-stored-model').getByRole('button', { name: /^(Load |Delete |Retry delete )/ }).count(), 0);
  await storedLoad(page).click();
  await page.waitForFunction(() => uiState.residentCids.includes('eligible') && !document.querySelector('[aria-label="Chat options"]').disabled);
  assert.equal(await libraryDialog(page).isVisible(), true, 'Ineligible selections remain available for explicit deletion');
  for (const name of names.filter((item) => item !== 'Eligible')) assert.equal(await storedChoice(page, name).isChecked(), true, name);
  assert.equal(await storedChoice(page, 'Eligible').isChecked(), false);
  assert.equal(await storedLoad(page).isDisabled(), true);
  await storedLoad(page).evaluate((element) => element.onclick());
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').map((call) => call.cid)), ['eligible']);
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['fixture-vision', 'eligible']);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['delete', 'acquire', 'pin', 'unload'].includes(call.type))), []);
});

test('Delete selected accepts loaded, unsupported and incomplete packages even without a stored-load API', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, loaded: true, noStoredLoader: true, stored: [
    { manifestCid: 'fixture-vision', name: 'Resident', totalBytes: 1 },
    { manifestCid: 'blocked', name: 'Blocked', totalBytes: 2, localAvailability: { status: 'unavailable' } },
    { ...pendingStoredModel, manifestCid: 'partial' },
    { manifestCid: 'cleanup', name: 'Cleanup', totalBytes: 4, cleanupPending: true },
    { manifestCid: 'keep', name: 'Keep', totalBytes: 5 },
  ] });
  await selectStored(page, ['Resident', 'Blocked', 'Saved package', 'Cleanup']);
  assert.equal(await storedLoad(page).isDisabled(), true); assert.equal(await storedDelete(page).isEnabled(), true);
  await storedDelete(page).click();
  await storedPanel(page).getByRole('status').filter({ hasText: /Deleted 4 models/ }).waitFor();
  assert.equal(await libraryDialog(page).evaluate((element) => element.contains(document.activeElement)), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'delete').map((call) => call.cid)), ['fixture-vision', 'blocked', 'partial', 'cleanup']);
  assert.deepEqual(await page.evaluate(() => uiState.stored.map((model) => model.manifestCid)), ['keep']);
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), []);
  assert.equal(await storedChoice(page, 'Keep').isChecked(), false);
  assert.equal(await storedDelete(page).isDisabled(), true);
  assert.equal(await page.evaluate(() => calls.some((call) => ['load-stored', 'acquire', 'verify-local'].includes(call.type))), false);
});

test('Delete selected stops at the first failure and retries only failed or unstarted packages', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, loaded: true, stored: batchPackages,
    failedDeleteCids: ['beta'], deleteDelays: { alpha: 10, beta: 100 } });
  await selectStored(page, ['Alpha', 'Beta', 'Gamma']);
  await storedDelete(page).evaluate((element) => { window.repeatDelete = element.onclick; });
  await storedDelete(page).click();
  await page.evaluate(() => { repeatDelete(); repeatDelete(); });
  const done = libraryDialog(page).getByRole('button', { name: 'Done', exact: true });
  await done.focus();
  await storedPanel(page).getByRole('status').filter({ hasText: /Completed 1 of 3 deletions.*Model is still in use/ }).waitFor();
  assert.equal(await libraryDialog(page).evaluate((element) => element.contains(document.activeElement)), true);
  assert.equal(await done.evaluate((element) => document.activeElement === element), true, 'Deletion cleanup preserves newer explicit focus');
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'delete').map((call) => call.cid)), ['alpha', 'beta']);
  assert.equal(await storedChoice(page, 'Alpha').count(), 0);
  for (const name of ['Beta', 'Gamma']) assert.equal(await storedChoice(page, name).isChecked(), true);
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['fixture-vision']);
  await page.evaluate(() => { uiState.failedDeleteCids = []; }); await storedDelete(page).click();
  await storedPanel(page).getByText('No models stored on this device.', { exact: true }).waitFor();
  await page.evaluate(() => repeatDelete());
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'delete').map((call) => call.cid)), ['alpha', 'beta', 'beta', 'gamma']);
  assert.equal(await page.evaluate(() => calls.some((call) => ['load-stored', 'acquire', 'unload'].includes(call.type))), false);
});

for (const committedBeforeAbort of [false, true]) test(`Stop deleting owns cleanup and reconciles actual rows when interrupted deletion ${committedBeforeAbort ? 'committed' : 'did not commit'}`, async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, loaded: true, stored: batchPackages,
    deleteDelays: { alpha: 10, beta: 10000 }, waitForDeleteCleanup: true, deleteCommitsBeforeAbort: committedBeforeAbort });
  await selectStored(page, ['Alpha', 'Beta', 'Gamma']); await storedDelete(page).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'delete' && call.cid === 'beta'));
  const stop = libraryDialog(page).getByRole('button', { name: 'Stop deleting', exact: true });
  await stop.click(); await page.waitForFunction(() => uiState.deletingCleanup);
  assert.equal(await stop.isDisabled(), true);
  assert.match(await storedPanel(page).getByRole('status').textContent(), /Cancelling deletion.*Waiting for cleanup/);
  assert.equal(await storedChoice(page, 'Gamma').isDisabled(), true);
  assert.equal(await storedDelete(page).isDisabled(), true); assert.equal(await storedLoad(page).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Chat options', exact: true }).isDisabled(), true);
  await storedDelete(page).evaluate((element) => element.onclick());
  await page.evaluate(() => finishDeleteCleanup());
  await storedPanel(page).getByRole('status').filter({ hasText: /^Cancelled:/ }).waitFor();
  await storedChoice(page, 'Gamma').and(page.locator(':enabled')).waitFor();
  assert.equal(await libraryDialog(page).evaluate((element) => element.contains(document.activeElement)), true);
  assert.equal(await storedChoice(page, 'Alpha').count(), 0);
  assert.equal(await storedChoice(page, 'Beta').count(), committedBeforeAbort ? 0 : 1);
  if (!committedBeforeAbort) assert.equal(await storedChoice(page, 'Beta').isChecked(), true);
  assert.equal(await storedChoice(page, 'Gamma').isChecked(), true);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'delete').map((call) => call.cid)), ['alpha', 'beta']);
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['fixture-vision']);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'delete-cleanup').length), 1);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-list').length), 2);
});

test('a selected package removed elsewhere is reconciled without repeating a stale deletion handler', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, stored: batchPackages.slice(0, 2) });
  await selectStored(page, ['Alpha']);
  await storedDelete(page).evaluate((element) => { window.staleDelete = element.onclick; });
  await page.evaluate(() => { uiState.stored = uiState.stored.filter((model) => model.manifestCid !== 'alpha'); });
  await storedDelete(page).click();
  await storedPanel(page).getByRole('status').filter({ hasText: /no longer stored/ }).waitFor();
  assert.equal(await storedChoice(page, 'Alpha').count(), 0); assert.equal(await storedChoice(page, 'Beta').isChecked(), false);
  await page.evaluate(() => staleDelete());
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'delete').map((call) => call.cid)), ['alpha']);
  assert.equal(await storedDelete(page).isDisabled(), true);
});

test('stored startup includes auxiliary and blocked models, and refresh reconciles selection without loading', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, loaded: true, interval: 30, stored: [
    ...batchPackages, { manifestCid: 'voice', name: 'Voice', task: 'text-to-speech', totalBytes: 512 },
    { manifestCid: 'fixture-vision', name: 'Already loaded', totalBytes: 1 }, pendingStoredModel,
    { manifestCid: 'deleting', name: 'Deleting', cleanupPending: true, totalBytes: 2 },
    { manifestCid: 'unsupported', name: 'Unsupported', localAvailability: { status: 'unavailable', reason: 'Unsupported runtime' } },
    { manifestCid: 'checking', name: 'Checking', localAvailability: { status: 'checking' } },
  ], startup: { sourceKey: 'hf:vision', name: 'Default' } });
  const picker = libraryDialog(page);
  assert.equal(await picker.isVisible(), true);
  for (const name of ['Already loaded', 'Saved package', 'Deleting', 'Unsupported', 'Checking']) {
    assert.equal(await picker.getByRole('checkbox', { name: `Select ${name}`, exact: true }).isEnabled(), true);
  }
  assert.equal(await picker.getByRole('checkbox', { name: 'Select Voice', exact: true }).isEnabled(), true);
  assert.equal(await picker.getByRole('button', { name: 'Load selected', exact: true }).isDisabled(), true);
  await picker.getByRole('checkbox', { name: 'Select Alpha', exact: true }).check();
  await picker.getByRole('checkbox', { name: 'Select Beta', exact: true }).check();
  await page.evaluate(() => { uiState.stored = uiState.stored.filter((model) => model.manifestCid !== 'beta'); });
  await picker.getByRole('button', { name: 'Refresh', exact: true }).click();
  await picker.getByRole('checkbox', { name: 'Select Beta', exact: true }).waitFor({ state: 'detached' });
  assert.equal(await picker.getByRole('checkbox', { name: 'Select Alpha', exact: true }).isChecked(), true);
  await picker.getByText('1 model selected.', { exact: true }).waitFor();
  await picker.getByRole('button', { name: 'Done', exact: true }).click(); await openMenuAction(page, 'Models');
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored'].includes(call.type))), []);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const box = await picker.boundingBox();
    assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width && box.y + box.height <= viewport.height);
    assert.equal(await picker.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
    await page.screenshot({ path: `/home/cos/.cache/peercompute-stored-batch-20261107/stored-picker-${viewport.width}.png` });
  }
});

test('sequential batch keeps other residents, continues ordinary failures and retries only remaining selections', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, loaded: true, stored: batchPackages, failedCids: ['beta'] });
  await chooseBatch(page);
  const picker = libraryDialog(page);
  await picker.getByRole('status').filter({ hasText: /Loaded 2 of 3 models/ }).waitFor();
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['fixture-vision', 'alpha', 'gamma']);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').map((call) => call.cid)), ['alpha', 'beta', 'gamma']);
  assert.equal(await picker.getByRole('checkbox', { name: 'Select Alpha', exact: true }).isEnabled(), true);
  assert.equal(await picker.getByRole('checkbox', { name: 'Select Alpha', exact: true }).isChecked(), false);
  assert.equal(await picker.getByRole('checkbox', { name: 'Select Beta', exact: true }).isChecked(), true);
  await picker.getByRole('button', { name: 'Load selected', exact: true }).click();
  await picker.getByText('Error: Stored model could not be loaded', { exact: true }).waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').map((call) => call.cid)), ['alpha', 'beta', 'gamma', 'beta']);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'unload'].includes(call.type))), []);
});

test('cancel during second batch item preserves the first and never starts the third', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, stored: batchPackages,
    loadStoredDelays: { alpha: 10, beta: 10000 }, waitForLoadCleanup: true });
  await chooseBatch(page);
  await page.waitForFunction(() => calls.some((call) => call.type === 'load-stored' && call.cid === 'beta'));
  const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
  assert.match(await overlay.textContent(), /2 \/ 3 · Beta/);
  await overlay.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => uiState.cleaning);
  assert.equal(await overlay.isVisible(), true);
  await page.evaluate(() => finishLoadCleanup()); await overlay.waitFor({ state: 'hidden' });
  await libraryDialog(page).getByRole('button', { name: 'Unload Alpha', exact: true }).and(page.locator(':enabled')).waitFor();
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['alpha']);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'load-stored').map((call) => call.cid)), ['alpha', 'beta']);
  assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Cancelled:/);
});

test('cancel during final library refresh releases the loading overlay without reporting success', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, stored: batchPackages.slice(0, 1) });
  await page.evaluate(() => { uiState.storedListDelay = 10000; });
  await chooseBatch(page, ['Alpha']);
  await page.waitForFunction(() => calls.filter((call) => call.type === 'stored-list').length >= 2);
  const overlay = page.getByRole('dialog', { name: 'Loading model', exact: true });
  await overlay.getByRole('button', { name: 'Cancel', exact: true }).click();
  await overlay.waitFor({ state: 'hidden', timeout: 2000 });
  assert.equal(await libraryDialog(page).isVisible(), true);
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['alpha']);
  assert.match(await page.locator('.pc-inference-panel > [role=status]').textContent(), /Cancelled:/);
});

test('startup library errors prevent default downloads and permit an explicit Refresh', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, rejectStoredList: true, interval: 30,
    startup: { sourceKey: 'hf:vision', name: 'Default' }, stored: batchPackages });
  const picker = libraryDialog(page);
  assert.equal(await picker.isVisible(), true);
  assert.match(await picker.getByRole('status').textContent(), /Storage is temporarily unavailable/);
  await page.evaluate(() => { uiState.rejectStoredList = false; });
  await picker.getByRole('button', { name: 'Refresh', exact: true }).click();
  await picker.getByRole('checkbox', { name: 'Select Alpha', exact: true }).waitFor();
  await page.waitForFunction(() => uiState.refreshCalls >= 3);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['acquire', 'load-stored'].includes(call.type))), []);
});

test('back confirmation preserves the draft on Stay and navigates only after acknowledged cleanup', async (t) => {
  const page = await fixture(t, { loaded: true, disposeFailsOnce: true });
  const original = page.url();
  await page.getByLabel('Message', { exact: true }).fill('Keep this draft');
  await page.getByRole('link', { name: 'Back to demo overview', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Leave model console?', exact: true });
  assert.match(await dialog.textContent(), /Are you sure/);
  assert.equal(await dialog.getByRole('button', { name: 'Stay here' }).evaluate((element) => element === document.activeElement), true);
  await dialog.getByRole('button', { name: 'Stay here' }).click();
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Keep this draft');
  assert.equal(page.url(), original);
  assert.equal(await page.evaluate(() => uiState.disposed), false);
  await page.getByRole('link', { name: 'Back to demo overview', exact: true }).click();
  await page.keyboard.press('Escape'); assert.equal(await dialog.isVisible(), false);
  await page.getByRole('link', { name: 'Back to demo overview', exact: true }).click();
  await dialog.getByRole('button', { name: 'Leave', exact: true }).click();
  await dialog.getByRole('status').filter({ hasText: /Worker stop not acknowledged/ }).waitFor();
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'navigate')), false);
  assert.equal(await dialog.getByRole('button', { name: 'Stay here' }).isDisabled(), true);
  await page.keyboard.press('Escape'); assert.equal(await dialog.isVisible(), true);
  await dialog.getByRole('button', { name: 'Leave', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'navigate'));
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'navigate').map((call) => call.disposed)), [true]);
  assert.equal(await page.locator('.pc-inference-panel').count(), 0);
});

test('paste and drop attach fresh pixels to Mixed peer vision while preserving the prompt without blob text', async (t) => {
  const page = await fixture(t, { peerVision: true, capturePixels: true });
  const images = [await patternedImage(page, 14), await patternedImage(page, 15)];
  for (const [index, input] of images.entries()) {
    await page.getByLabel('Message', { exact: true }).fill(`Look at image ${index + 1}`);
    const prevented = await page.evaluate(({ png, index }) => {
      const bytes = Uint8Array.from(atob(png), (char) => char.charCodeAt(0));
      const file = new File([bytes], 'same-name.png', { type: 'image/png' });
      const data = new DataTransfer();
      if (index === 0) {
        data.items.add(file); data.setData('text/plain', 'blob:https://example.test/ignored');
      } else {
        window.dropBlob = URL.createObjectURL(file); data.setData('text/uri-list', dropBlob);
      }
      const event = index === 0 ? new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })
        : new DragEvent('drop', { dataTransfer: data, bubbles: true, cancelable: true });
      document.querySelector('[aria-label="Message"]').dispatchEvent(event); return event.defaultPrevented;
    }, { png: input.png, index });
    assert.equal(prevented, true);
    await page.getByAltText('Selected image', { exact: true }).waitFor();
    assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), `Look at image ${index + 1}`);
    await page.getByRole('button', { name: 'Send', exact: true }).and(page.locator(':enabled')).waitFor();
    await page.getByLabel('Message', { exact: true }).press('Enter');
    await page.waitForFunction((count) => pixelRequests.length === count, index + 1);
    await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
    if (index === 1) await page.evaluate(() => URL.revokeObjectURL(dropBlob));
  }
  assert.deepEqual(await page.evaluate(() => pixelRequests.map((request) => request.sha256)), images.map((image) => image.sha256));
  assert.equal(await page.evaluate(() => uiState.residentCids.length), 0);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'generate').map((call) => call.target)), ['mixed', 'mixed']);
});

test('new blob input supersedes a pending picker decode even when the blob read fails', async (t) => {
  const page = await fixture(t, { peerVision: true, holdBlobFetch: true });
  const input = await patternedImage(page, 22);
  await page.evaluate(() => {
    const decode = window.createImageBitmap.bind(window);
    window.createImageBitmap = async (...args) => {
      await new Promise((resolve) => { window.releaseOldDecode = resolve; });
      return decode(...args);
    };
  });
  await page.getByLabel('Choose image attachment').setInputFiles(input.file);
  await page.waitForFunction(() => !!window.releaseOldDecode);
  await page.evaluate(() => {
    const data = new DataTransfer(); data.setData('text/plain', 'blob:' + location.origin + '/new-image');
    document.querySelector('[aria-label="Message"]').dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    releaseOldDecode();
  });
  await page.waitForFunction(() => !!window.failNewBlob);
  await page.evaluate(() => failNewBlob());
  await page.getByText(/image link is unavailable/).waitFor();
  assert.equal(await page.getByAltText('Selected image', { exact: true }).isVisible(), false);
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), '');
});

test('final library read failure preserves residents and never reports a fully successful batch', async (t) => {
  const page = await fixture(t, { keepStartupPicker: true, stored: batchPackages.slice(0, 1) });
  await page.evaluate(() => { uiState.rejectStoredList = true; });
  await chooseBatch(page, ['Alpha']);
  const picker = libraryDialog(page);
  await picker.getByRole('status').filter({ hasText: /stored library could not be refreshed/ }).waitFor();
  assert.equal(await picker.isVisible(), true);
  assert.deepEqual(await page.evaluate(() => uiState.residentCids), ['alpha']);
  assert.equal(await page.evaluate(() => calls.some((call) => call.type === 'acquire')), false);
});

test('embedded phone model panel can scroll to its composer instead of clipping Talk and Send', async (t) => {
  const page = await fixture(t, { loaded: true,
    generationError: 'Model execution failed. Close unused models and retry the request. '.repeat(25) });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { uiState.rejectGeneration = true; });
  await page.getByLabel('Message', { exact: true }).fill('Exercise a long actionable error');
  await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel > [role=status]').textContent.startsWith('Error: Model execution failed'));
  await page.evaluate(() => {
    const container = document.querySelector('#panel'); container.classList.remove('pc-inference-standalone');
    const shell = document.createElement('dialog'); shell.className = 'world-agent-models';
    shell.style.cssText = 'box-sizing:border-box;margin:auto;width:96vw;height:90dvh;max-width:none;padding:12px;overflow:auto;';
    document.body.append(shell); shell.append(container); shell.showModal();
  });
  const panel = page.locator('.pc-inference-panel');
  const initial = await panel.evaluate((element) => ({ overflow: getComputedStyle(element).overflowY, height: element.clientHeight, scrollHeight: element.scrollHeight }));
  assert.equal(initial.overflow, 'auto'); assert(initial.scrollHeight > initial.height);
  const box = await panel.boundingBox();
  await page.mouse.move(box.x + box.width - 8, box.y + box.height / 2); await page.mouse.wheel(0, 1200);
  await page.waitForFunction(() => document.querySelector('.pc-inference-panel').scrollTop > 0);
  const bounds = await page.getByRole('button', { name: 'Talk', exact: true }).evaluate((element) => {
    const r = element.getBoundingClientRect(), parent = element.closest('.pc-inference-panel').getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, panelTop: parent.top, panelBottom: parent.bottom, hit: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === element };
  });
  assert(bounds.top >= bounds.panelTop && bounds.bottom <= bounds.panelBottom && bounds.bottom <= 844 && bounds.hit, JSON.stringify(bounds));
  await page.screenshot({ path: '/home/cos/.cache/peercompute-picker-inputs-20261107/embedded-composer-mobile.png' });
});
