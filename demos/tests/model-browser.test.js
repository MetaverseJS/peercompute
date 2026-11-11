import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { filterBrowserModels, repositoryQuery, safeModelUrl, matchingPeerTargets } from '../inference/src/ui/modelBrowserData.js';
import { conversionCandidate } from '../inference/src/ui/modelBrowserConversions.js';

test('multimodal conversation packages match image and audio capability filters', () => {
  const gemma = { key: 'hf:gemma-media', name: 'Gemma media', model: {
    task: 'text-generation', modalities: ['text', 'image', 'audio'] }, totalBytes: 100 };
  const filters = { query: '', source: 'all', task: 'image-text-to-text', precision: 'all',
    size: 'all', compatibility: 'all', sort: 'smallest' };
  assert.equal(filterBrowserModels([gemma], filters).length, 1);
  assert.equal(filterBrowserModels([gemma], { ...filters, task: 'audio-text-to-text' }).length, 1);
  assert.equal(filterBrowserModels([gemma], { ...filters, task: 'text-to-speech' }).length, 0);
  assert.equal(filterBrowserModels([{ ...gemma, model: { ...gemma.model, modalities: ['text'] } }], filters).length, 0);
});

let server, browser, origin;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  server = await createServer({ configFile: false, root: repo, logLevel: 'error',
    optimizeDeps: { entries: ['demos/inference/src/ui/modelBrowser.js'] },
    server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
    plugins: [{ name: 'model-browser-fixture', configureServer(vite) {
      vite.middlewares.use('/__model_browser', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><button id="browse">Browse models</button><main id="root"></main>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); });

async function fixture(t, options = {}) {
  const page = await browser.newPage({ viewport: options.viewport ?? { width: 1150, height: 950 } });
  const errors = [], requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://**/*', (route) => { requests.push(route.request().url()); return route.abort(); });
  t.after(async () => { await page.evaluate(() => window.modelBrowser?.dispose()).catch(() => {}); await page.close(); assert.deepEqual(errors, []); assert.deepEqual(requests, []); });
  await page.goto(origin + '/__model_browser');
  await page.evaluate(async (options) => {
    await import('/demos/inference/src/panel.css');
    document.querySelector('#root').className = 'pc-inference-panel';
    const { createModelBrowser } = await import('/demos/inference/src/ui/modelBrowser.js');
    window.calls = [];
    window.state = { sources: [
      { key: 'hf:vision', name: 'Small vision', source: 'hf', repository: 'fixture/vision', description: 'Describes photographs and diagrams.',
        modelId: 'vision', task: 'image-text-to-text', totalBytes: 268000000, dtype: 'q4', runtime: 'transformers.js', localAvailability: { status: 'unknown', code: 'memory_fit_unverified', cpuBytes: 4 * 1024 ** 3, gpuBytes: 2 * 1024 ** 3 } },
      { key: 'peer:large', name: 'Large text', source: 'peers', manifestCid: 'large', description: 'A coding assistant.', modelId: 'large',
        task: 'text-generation', dtype: 'q8_0', totalBytes: 12 * 1024 ** 3, localAvailability: { status: 'unavailable', reason: 'Needs more GPU memory.' } },
      { key: 'stored:tiny', name: 'Stored tiny', source: 'stored', manifestCid: 'tiny', task: 'text-generation', dtype: 'q4', totalBytes: 8000000, localAvailability: { status: 'available' } },
      { key: 'hf:unknown', name: 'Unknown size', source: 'hf', task: 'text-to-image', localAvailability: { status: 'checking', reason: 'Checking device support.' } },
    ], targets: [{ key: 'local', local: true, available: false }, { key: 'peer:large', name: 'Large text', local: false, available: true, busy: true, providerCount: 2 }],
    searchMode: options.searchMode, inspectMode: options.inspectMode, extraVariant: options.extraVariant,
    conversionMode: options.conversionMode, unsupportedOriginal: options.unsupportedOriginal,
    selected: options.selectedKey ?? 'hf:vision', pending: [], conversionPending: [], storedCount: options.storedCount ?? 0 };
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const storedContent = options.storedContent ? document.createElement('section') : undefined;
    if (storedContent) { storedContent.innerHTML = '<p>Stored fixture library</p><button type="button">Load selected</button>'; }
    window.modelBrowser = createModelBrowser({ container: document.querySelector('#root'), getSources: () => state.sources, getTargets: () => state.targets,
      keepOpenOnAction: !!options.managed,
      onConfigure: options.managed ? () => {
        const content = document.createElement('p'); content.textContent = 'Configuration fixture';
        modelBrowser.showPage({ title: 'Config', content, onBack: () => modelBrowser.showLibrary() });
      } : undefined,
      onDismiss: options.managed ? async () => {
        calls.push({ type: 'dismiss' });
        if (options.pendingDismiss) await new Promise((resolve, reject) => { window.finishDismiss = { resolve, reject }; });
        modelBrowser.close();
      } : undefined,
      storedContent, hasStoredModels: () => state.storedCount > 0,
      async onStoredOpen({ signal }) {
        calls.push({ type: 'stored-open' });
        signal.addEventListener('abort', () => calls.push({ type: 'stored-abort' }), { once: true });
        if (options.pendingStored) await new Promise((resolve) => { window.finishStored = resolve; });
        if (options.storedError) throw new Error('Stored metadata unavailable');
      },
      getCompatibility: (source) => source.localAvailability ?? { status: 'unknown', code: 'memory_fit_unverified', cpuBytes: 1024 ** 3, gpuBytes: 2 * 1024 ** 3 },
      findConversions: options.conversions ? async (reference, { signal }) => {
        const repository = reference.startsWith('https://') ? new URL(reference).pathname.split('/').filter(Boolean).slice(0, 2).join('/') : reference;
        calls.push({ type: 'conversions', repository, reference });
        signal.addEventListener('abort', () => calls.push({ type: 'conversions-abort', repository }), { once: true });
        if (state.conversionMode === 'pending') await new Promise((resolve) => state.conversionPending.push({ resolve, repository }));
        if (state.conversionMode === 'error') throw new Error('HTTP 429: conversion metadata rate limited');
        const revision = 'c'.repeat(40);
        return { cached: state.conversionMode === 'cached', warning: state.conversionMode === 'cached' ? 'Offline metadata' : undefined,
          items: state.conversionMode === 'empty' ? [] : ['onnx', 'gguf', 'finetune'].map((format) => ({
            repository: `converters/${format}`, revision, name: options.longConversions ? 'A_long_conversion_publisher_model_name_'.repeat(4) : `${format} conversion`,
            sourceRepository: repository, formats: [format === 'onnx' ? 'ONNX' : 'GGUF'],
            relationship: format === 'onnx' ? 'converted' : format === 'gguf' ? 'quantized' : 'finetune',
            evidence: { kind: 'publisher-base-model', revision, url: 'javascript:ignored-untrusted-url' },
            task: 'text-generation', description: '<img src=x onerror=alert(1)> is plain publisher metadata',
          })) };
      } : undefined,
      async searchModels({ query, cursor, signal }) {
        calls.push({ type: 'search', query, cursor });
        signal.addEventListener('abort', () => calls.push({ type: 'search-abort', query }), { once: true });
        if (state.searchMode === 'pending') await new Promise((resolve) => state.pending.push({ query, resolve }));
        if (state.searchMode === 'error') throw new Error('HTTP 429: retry later');
        return { items: state.searchMode === 'many' ? Array.from({ length: 20 }, (_, index) => ({ repository: `fixture/result-${String(index).padStart(2, '0')}`, name: `Result ${String(index).padStart(2, '0')}` }))
          : [{ repository: `fixture/${query.replaceAll('/', '-') || 'browse'}${cursor ? '-page2' : ''}`, name: `${query || 'Browse'} result`, description: 'Description from the model card.' }],
          nextCursor: cursor ? null : 'next', warning: state.searchMode === 'cached' ? 'Offline snapshot' : undefined, cached: state.searchMode === 'cached' };
      },
      async inspectModel(reference, { signal, selectedVariant }) {
        const parsed = reference.startsWith('https://') ? new URL(reference).pathname.split('/').filter(Boolean) : null;
        const repository = parsed ? parsed.slice(0, 2).join('/') : reference;
        const revision = state.inspectMode !== 'wrongRevision' && /^[a-f0-9]{40}$/.test(parsed?.[3]) ? parsed[3] : 'a'.repeat(40);
        calls.push({ type: 'inspect', reference, repository, selectedVariant });
        signal.addEventListener('abort', () => calls.push({ type: 'inspect-abort', repository }), { once: true });
        if (state.inspectMode === 'pending') await new Promise((resolve) => { window.finishInspect = resolve; });
        if (state.inspectMode === 'error') throw new Error('Metadata is incomplete');
        const variants = [
          { key: 'q8', id: 'fixture-q8', name: 'Q8 package', dtype: 'q8_0', task: 'text-generation', totalBytes: 2 * 1024 ** 3, loadable: true,
            package: { id: 'fixture-q8', model: { repository, dtype: 'q8_0' }, localAvailability: { status: 'unavailable', reason: 'Exceeds GPU budget.' } } },
          { key: 'q4', id: 'fixture-q4', name: 'Q4 package', dtype: 'q4_k_m', task: 'text-generation', totalBytes: 500000000, loadable: true,
            package: { id: 'fixture-q4', model: { repository, dtype: 'q4_k_m' }, files: [{ path: 'weights.gguf', size: 500000000, sha256: '0'.repeat(64) }] } },
          { key: 'split', name: 'Split package', dtype: 'q4_k_m', task: 'text-generation', totalBytes: 9 * 1024 ** 3, loadable: false, reason: 'Split GGUF packages are unsupported.' },
        ];
        if (state.extraVariant) variants.push({ key: 'fp16', id: 'fixture-fp16', name: 'FP16 package', dtype: 'fp16',
          task: 'text-generation', totalBytes: 4 * 1024 ** 3, loadable: true,
          package: { id: 'fixture-fp16', model: { repository, dtype: 'fp16' } } });
        await delay(1);
        return { repository, revision, license: { spdx: 'apache-2.0', notice: 'Review publisher license terms.' },
          description: '<img src=x onerror=alert(1)> plain model description', variants: state.unsupportedOriginal && repository === 'fixture/original' ? [] : state.inspectMode === 'lazy'
            ? variants.map((variant) => variant.key === selectedVariant || variant.key === 'split' ? variant
              : { ...variant, loadable: false, requiresInspection: true, reason: 'Select this variant to inspect its bounded GGUF header.' }) : variants };
      },
      onLoad: (source) => calls.push({ type: 'load', source }), onUsePeer: (key) => calls.push({ type: 'peer', key }),
      onSetup: (source) => { calls.push({ type: 'setup', key: source.key }); if (options.reopenStoredOnSetup) modelBrowser.open({ tab: 'stored' }); },
    });
    document.querySelector('#browse').onclick = () => modelBrowser.open({ selectedKey: state.selected });
  }, options);
  await page.locator('#browse').click();
  return page;
}
const dialog = (page) => page.getByRole('dialog', { name: 'Models', exact: true });
const rows = (page) => dialog(page).locator('[data-model-key]');
async function choose(page, key) { await dialog(page).locator('[data-model-key]').filter({ has: page.locator('strong') }).evaluateAll((items, key) => items.find((item) => item.dataset.modelKey === key)?.click(), key); }
async function searchFor(page, query) {
  await page.getByRole('searchbox', { name: 'Search models' }).fill(query);
  await page.getByRole('searchbox', { name: 'Search models' }).press('Enter');
  await page.waitForFunction(() => !document.querySelector('.pc-browser-status').textContent.includes('Searching'));
}

test('one Models dialog defaults to Stored for a retained library and Browse for empty storage', async (t) => {
  const stored = await fixture(t, { storedContent: true, storedCount: 2 });
  assert.equal(await stored.getByRole('dialog').count(), 1);
  assert.equal(await dialog(stored).getByRole('tab', { name: 'Stored models', exact: true }).getAttribute('aria-selected'), 'true');
  assert.equal(await dialog(stored).getByRole('tabpanel', { name: 'Stored models', exact: true }).isVisible(), true);
  assert.equal(await stored.evaluate(() => modelBrowser.isStoredOpen()), true);
  assert.equal(await stored.evaluate(() => calls.filter((call) => call.type === 'stored-open').length), 1);
  assert.deepEqual(await stored.evaluate(() => calls.filter((call) => ['search', 'load', 'inspect'].includes(call.type))), []);
  await dialog(stored).getByRole('tab', { name: 'Browse models', exact: true }).click();
  assert.equal(await stored.evaluate(() => modelBrowser.getActiveTab()), 'browse');
  assert.equal(await stored.getByRole('searchbox', { name: 'Search models' }).isVisible(), true);
  const empty = await fixture(t, { storedContent: true });
  assert.equal(await empty.evaluate(() => modelBrowser.getActiveTab()), 'browse');
  assert.equal(await empty.evaluate(() => calls.filter((call) => call.type === 'stored-open').length), 0);
  assert.equal(await dialog(empty).locator('.pc-browser-summary').textContent(), '4 models');
  assert.equal(await dialog(empty).locator('.pc-browser-filters summary .pc-browser-summary').count(), 1);
  assert.doesNotMatch(await dialog(empty).textContent(), /Package bytes are|Search by name or description|Search names, descriptions/);
  assert.equal(await empty.getByLabel('Package size', { exact: true }).count(), 1);
});

test('Models tabs use native accessible selection with Arrow, Home and End focus movement', async (t) => {
  const page = await fixture(t, { storedContent: true });
  const browse = dialog(page).getByRole('tab', { name: 'Browse models', exact: true });
  const stored = dialog(page).getByRole('tab', { name: 'Stored models', exact: true });
  await browse.focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await stored.evaluate((element) => document.activeElement === element), true);
  assert.equal(await stored.getAttribute('aria-selected'), 'true'); assert.equal(await browse.getAttribute('tabindex'), '-1');
  await page.keyboard.press('End'); assert.equal(await browse.getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home'); assert.equal(await stored.getAttribute('aria-selected'), 'true');
  await page.keyboard.press('ArrowLeft'); assert.equal(await browse.getAttribute('aria-selected'), 'true');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-open').length), 2);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 0);
});

test('managed browser navigation and actions keep one dialog without requesting final dismissal', async (t) => {
  const page = await fixture(t, { managed: true, storedContent: true });
  const id = await dialog(page).getAttribute('id');
  await dialog(page).locator('[data-model-key="hf:vision"]').click();
  await dialog(page).getByRole('button', { name: 'Load', exact: true }).click();
  await page.waitForFunction(() => calls.some(call => call.type === 'load'));
  assert.equal(await dialog(page).isVisible(), true);
  await dialog(page).getByRole('button', { name: 'Config', exact: true }).click();
  const config = page.getByRole('dialog', { name: 'Config', exact: true });
  assert.equal(await config.getAttribute('id'), id); assert.equal(await page.locator('dialog[open]').count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await dialog(page).locator('[data-model-key="hf:vision"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await dialog(page).getByRole('tab', { name: 'Browse models', exact: true }).getAttribute('aria-selected'), 'true');
  await page.evaluate(() => modelBrowser.close());
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'dismiss')), []);
});

test('managed final dismissal is coalesced, waits for cleanup and remains retryable on failure', async (t) => {
  const page = await fixture(t, { managed: true, pendingDismiss: true });
  await dialog(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => Boolean(window.finishDismiss));
  await page.keyboard.press('Escape');
  assert.equal(await dialog(page).isVisible(), true);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'dismiss').length), 1);
  await page.evaluate(() => { finishDismiss.reject(new Error('Cleanup is still owned')); });
  await dialog(page).getByText(/Cleanup is still owned/).waitFor();
  assert.equal(await dialog(page).getByRole('button', { name: 'Done', exact: true }).isEnabled(), true);
  await dialog(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => calls.filter(call => call.type === 'dismiss').length === 2);
  await page.evaluate(() => finishDismiss.resolve());
  await dialog(page).waitFor({ state: 'hidden' });
});

test('managed Config pauses and resumes metadata search only when returning to Browse', async (t) => {
  const page = await fixture(t, { managed: true, searchMode: 'pending' });
  await page.getByRole('searchbox', { name: 'Search models' }).fill('garden');
  await page.waitForFunction(() => state.pending.length === 1);
  await dialog(page).getByRole('button', { name: 'Config', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'search-abort').length), 1);
  await page.evaluate(() => { modelBrowser.setBusy(true); modelBrowser.setBusy(false); });
  assert.equal(await page.evaluate(() => state.pending.length), 1);
  await page.getByRole('dialog', { name: 'Config', exact: true }).getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => state.pending.length === 2, undefined, { timeout: 1500 });
  assert.equal(await page.getByRole('searchbox', { name: 'Search models' }).inputValue(), 'garden');
  await page.evaluate(() => { state.pending[0].resolve(); state.pending[1].resolve(); });
  await dialog(page).getByRole('heading', { name: 'garden result', exact: true }).waitFor();
  assert.equal(await page.locator('dialog[open]').count(), 1);
});

test('cached stored startup and polling do not repeat stored reads; closing aborts a late stored callback', async (t) => {
  const page = await fixture(t, { storedContent: true, pendingStored: true, storedError: true });
  await page.evaluate(() => modelBrowser.open({ tab: 'stored', refreshStored: false }));
  assert.equal(await page.evaluate(() => modelBrowser.isStoredOpen()), true);
  await page.evaluate(() => { modelBrowser.refresh(); modelBrowser.setBusy(false); });
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-open').length), 0);
  await dialog(page).getByRole('tab', { name: 'Browse models', exact: true }).click();
  await dialog(page).getByRole('tab', { name: 'Stored models', exact: true }).click();
  await page.waitForFunction(() => typeof finishStored === 'function');
  await page.evaluate(() => modelBrowser.close());
  assert.equal(await page.evaluate(() => modelBrowser.isStoredOpen()), false);
  await page.waitForFunction(() => calls.some((call) => call.type === 'stored-abort'));
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-abort').length), 1);
  await page.evaluate(() => finishStored()); await page.waitForTimeout(20);
  assert.equal(await dialog(page).isVisible(), false);
  await page.evaluate(() => modelBrowser.open({ tab: 'stored', refreshStored: false }));
  assert.doesNotMatch(await dialog(page).textContent(), /Stored models unavailable/);
});

test('mobile details fill the window and Done returns to the same results, query, filters, scroll and selection', async (t) => {
  const page = await fixture(t, { storedContent: true, viewport: { width: 390, height: 844 } });
  await page.evaluate(() => {
    state.sources = Array.from({ length: 40 }, (_, index) => ({ key: `entry:${index}`, name: `Entry ${String(index).padStart(2, '0')}`,
      source: 'hf', task: 'text-generation', totalBytes: 1000 + index, dtype: 'q4', localAvailability: { status: 'unknown' } }));
    modelBrowser.refresh();
  });
  await dialog(page).locator('.pc-browser-filters summary').click();
  await page.getByLabel('Source', { exact: true }).selectOption('catalog');
  await page.getByLabel('Sort models', { exact: true }).selectOption('name');
  await page.getByRole('searchbox', { name: 'Search models' }).fill('Entry');
  await dialog(page).locator('.pc-browser-filters summary').click();
  const row = dialog(page).locator('[data-model-key="entry:20"]'); await row.scrollIntoViewIfNeeded();
  const before = await dialog(page).locator('.pc-browser-results').evaluate((element) => element.scrollTop);
  await row.click();
  const details = dialog(page).getByRole('region', { name: 'Model details', exact: true });
  const box = await dialog(page).boundingBox(), detailBox = await details.boundingBox();
  assert.equal(box.x, 0); assert.equal(box.y, 0); assert.equal(box.width, 390); assert.equal(box.height, 844);
  assert(detailBox.height > 650); assert.equal(await page.getByRole('searchbox', { name: 'Search models' }).isVisible(), false);
  assert.equal(await dialog(page).getByRole('tab', { name: 'Browse models', exact: true }).isVisible(), false);
  const action = await dialog(page).getByRole('button', { name: 'Load', exact: true }).boundingBox();
  assert(action.y + action.height <= 844);
  const directory = process.env.MODEL_BROWSER_SCREENSHOTS || '/tmp/peercompute-model-browser-ui'; await mkdir(directory, { recursive: true });
  await page.screenshot({ path: `${directory}/mobile-full-details.png` });
  await dialog(page).getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await dialog(page).isVisible(), true); assert.equal(await details.isVisible(), false);
  assert.equal(await page.getByRole('searchbox', { name: 'Search models' }).inputValue(), 'Entry');
  assert.equal(await page.getByLabel('Source', { exact: true }).inputValue(), 'catalog');
  assert.equal(await page.getByLabel('Sort models', { exact: true }).inputValue(), 'name');
  assert.equal(await row.getAttribute('aria-pressed'), 'true');
  assert.equal(await row.evaluate((element) => document.activeElement === element), true);
  assert(Math.abs(await dialog(page).locator('.pc-browser-results').evaluate((element) => element.scrollTop) - before) <= 1);
  await page.evaluate(() => { modelBrowser.refresh(); modelBrowser.setBusy(false); });
  assert.equal(await details.isVisible(), false, 'background refresh must not reopen mobile details');
  await page.screenshot({ path: `${directory}/mobile-results-return.png` });
  await row.click(); await page.keyboard.press('Escape');
  assert.equal(await dialog(page).isVisible(), true); assert.equal(await details.isVisible(), false);
  await page.keyboard.press('Escape'); assert.equal(await dialog(page).isVisible(), false);
  assert.equal(await page.locator('#browse').evaluate((element) => document.activeElement === element), true);
});

test('switching Stored and Browse preserves browse scroll and selection without opening details or starting new searches', async (t) => {
  const page = await fixture(t, { storedContent: true });
  await page.evaluate(() => {
    state.sources.push(...Array.from({ length: 30 }, (_, index) => ({ key: `extra:${index}`, name: `Extra ${index}`, source: 'hf', totalBytes: 10000000 + index })));
    modelBrowser.refresh();
  });
  await choose(page, 'extra:20');
  const list = dialog(page).locator('.pc-browser-results'); await list.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  const before = await list.evaluate((element) => element.scrollTop);
  await dialog(page).getByRole('tab', { name: 'Stored models', exact: true }).click();
  await page.evaluate(() => modelBrowser.refresh());
  await dialog(page).getByRole('tab', { name: 'Browse models', exact: true }).click();
  assert.equal(await list.evaluate((element) => element.scrollTop), before);
  assert.equal(await dialog(page).locator('[data-model-key="extra:20"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 0);
});

test('late mobile inspection updates metadata without reopening details after Done', async (t) => {
  const page = await fixture(t, { inspectMode: 'pending', viewport: { width: 390, height: 844 } });
  await searchFor(page, 'https://huggingface.co/fixture/model'); await choose(page, 'hub:fixture/model');
  await page.waitForFunction(() => typeof finishInspect === 'function');
  assert.equal(await dialog(page).getByRole('region', { name: 'Model details', exact: true }).isVisible(), true);
  await dialog(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.evaluate(() => finishInspect());
  await page.waitForFunction(() => !document.querySelector('.pc-browser-status').textContent.includes('Inspecting'));
  assert.equal(await dialog(page).isVisible(), true);
  assert.equal(await dialog(page).getByRole('region', { name: 'Model details', exact: true }).isVisible(), false);
  assert.equal(await dialog(page).locator('[aria-pressed="true"]').getAttribute('data-model-key'), 'hub:fixture/model');
});

test('Setup help can reopen the same Models dialog on Stored without the old close event aborting its new read', async (t) => {
  const page = await fixture(t, { storedContent: true, pendingStored: true, reopenStoredOnSetup: true });
  await choose(page, 'peer:large');
  await dialog(page).getByRole('button', { name: 'Setup help', exact: true }).click();
  await page.waitForFunction(() => typeof finishStored === 'function');
  await page.waitForTimeout(50);
  assert.equal(await page.evaluate(() => modelBrowser.isStoredOpen()), true);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-abort').length), 0);
  assert.equal(await dialog(page).evaluate((element) => element.contains(document.activeElement)), true);
  await page.evaluate(() => finishStored());
});

test('same-turn close and reopen cancels the previous metadata owner synchronously without cancelling its replacement', async (t) => {
  const page = await fixture(t, { storedContent: true, pendingStored: true });
  await dialog(page).getByRole('tab', { name: 'Stored models', exact: true }).click();
  await page.waitForFunction(() => typeof finishStored === 'function');
  const abortsBeforeReopen = await page.evaluate(() => {
    window.finishFirstStored = finishStored;
    modelBrowser.close();
    const count = calls.filter((call) => call.type === 'stored-abort').length;
    modelBrowser.open({ tab: 'stored' });
    return count;
  });
  assert.equal(abortsBeforeReopen, 1);
  await page.waitForFunction(() => calls.filter((call) => call.type === 'stored-open').length === 2);
  await page.waitForTimeout(50);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'stored-abort').length), 1);
  assert.equal(await page.evaluate(() => modelBrowser.isStoredOpen()), true);
  await page.evaluate(() => { finishFirstStored(); finishStored(); });
});

test('unchanged result nodes stay attached during 50ms polling while changed rows and native mobile selection update', async (t) => {
  const page = await fixture(t, { viewport: { width: 390, height: 844 } });
  await page.evaluate(() => {
    window.originalPeerRow = document.querySelector('[data-model-key="peer:large"]');
    window.pollBrowser = setInterval(() => modelBrowser.refresh(), 50);
  });
  t.after(async () => { if (!page.isClosed()) await page.evaluate(() => clearInterval(pollBrowser)); });
  await page.waitForTimeout(160);
  assert.equal(await page.evaluate(() => originalPeerRow.isConnected
    && originalPeerRow === document.querySelector('[data-model-key="peer:large"]')), true);
  await dialog(page).locator('[data-model-key="peer:large"]').click();
  assert.equal(await dialog(page).getByRole('region', { name: 'Model details', exact: true }).isVisible(), true);
  await dialog(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.evaluate(() => {
    window.selectedPeerRow = document.querySelector('[data-model-key="peer:large"]');
    state.sources.find((source) => source.key === 'hf:vision').name = 'Updated vision'; modelBrowser.refresh();
  });
  assert.equal(await page.evaluate(() => selectedPeerRow === document.querySelector('[data-model-key="peer:large"]')), true);
  assert.match(await dialog(page).locator('[data-model-key="hf:vision"]').textContent(), /Updated vision/);
  assert.equal(await page.evaluate(() => document.activeElement === selectedPeerRow), true);
  await page.evaluate(() => clearInterval(pollBrowser));
});

test('opening and periodic refresh are metadata-free, size sorted and keep selection and focused result', async (t) => {
  const page = await fixture(t);
  assert.deepEqual(await rows(page).evaluateAll((items) => items.map((item) => item.dataset.modelKey)), ['stored:tiny', 'hf:vision', 'peer:large', 'hf:unknown']);
  assert.deepEqual(await page.evaluate(() => calls), []);
  await choose(page, 'peer:large');
  await dialog(page).locator('[data-model-key="peer:large"]').focus();
  await page.evaluate(() => { state.sources.reverse(); modelBrowser.refresh(); });
  assert.equal(await dialog(page).locator('[aria-pressed=true]').getAttribute('data-model-key'), 'peer:large');
  assert.equal(await page.evaluate(() => document.activeElement.dataset.modelKey), 'peer:large');
  assert.deepEqual(await page.evaluate(() => calls), []);
});

test('explicit empty-query Hugging Face browsing fetches metadata while initial All stays network-free', async (t) => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(() => calls), []);
  await page.getByLabel('Source', { exact: true }).selectOption('hub');
  await page.waitForFunction(() => document.querySelector('[data-model-key="hub:fixture/browse"]'));
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'search').map((call) => call.query)), ['']);
  assert.equal(await rows(page).count(), 1);
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  for (let index = 0; index < 3; index++) await page.evaluate(() => modelBrowser.refresh());
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 1);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => ['load', 'inspect', 'peer'].includes(call.type))), []);
});

test('closing before debounce and reopening resumes the retained query exactly once', async (t) => {
  const page = await fixture(t);
  await page.getByLabel('Search models', { exact: true }).fill('qwen');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 0);
  await page.locator('#browse').click();
  assert.equal(await page.getByLabel('Search models', { exact: true }).inputValue(), 'qwen');
  await page.waitForFunction(() => document.querySelector('[data-model-key="hub:fixture/qwen"]'));
  for (let index = 0; index < 3; index++) await page.evaluate(() => modelBrowser.refresh());
  await page.waitForTimeout(450);
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'search').map((call) => call.query)), ['qwen']);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('reopening an interrupted request retries once and ignores the aborted response', async (t) => {
  const page = await fixture(t, { searchMode: 'pending' });
  await page.getByLabel('Search models', { exact: true }).fill('qwen');
  await page.waitForFunction(() => state.pending.length === 1);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => calls.some((call) => call.type === 'search-abort'));
  await page.locator('#browse').click();
  await page.waitForFunction(() => state.pending.length === 2);
  await page.evaluate(() => state.pending[0].resolve());
  await page.waitForTimeout(30);
  assert.equal(await dialog(page).locator('[data-model-key^="hub:"]').count(), 0);
  await page.evaluate(() => state.pending[1].resolve());
  await page.waitForFunction(() => document.querySelector('[data-model-key="hub:fixture/qwen"]'));
  await page.evaluate(() => modelBrowser.refresh()); await page.waitForTimeout(450);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 2);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('unknown Hub candidates remain inspectable under size, precision and compatibility filters without becoming loadable', async (t) => {
  const page = await fixture(t);
  await searchFor(page, 'qwen');
  const candidate = dialog(page).locator('[data-model-key="hub:fixture/qwen"]');
  for (const [label, value] of [['Package size', String(1024 ** 3)], ['Precision', 'q4'], ['Compatibility', 'eligible']]) {
    await page.getByLabel(label, { exact: true }).selectOption(value);
    assert.equal(await candidate.count(), 1, `Unknown metadata stays reachable with ${label}`);
    assert.match(await dialog(page).textContent(), /needs inspection/i);
    assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
    assert.equal(await dialog(page).getByRole('button', { name: 'Inspect variants', exact: true }).isEnabled(), true);
  }
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'inspect').length), 0);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('inspected repositories retain alternate matches without silently changing an explicit variant', async (t) => {
  const page = await fixture(t, { extraVariant: true });
  await searchFor(page, 'qwen'); await choose(page, 'hub:fixture/qwen');
  const variant = page.getByLabel('Package variant', { exact: true }); await variant.waitFor();
  assert.ok((await page.getByLabel('Precision', { exact: true }).locator('option').evaluateAll((items) => items.map((item) => item.value))).includes('fp16'),
    'Precision filter must include metadata from unselected variants');
  await variant.selectOption('q8');
  await page.getByLabel('Precision', { exact: true }).selectOption('q4_k_m');
  await page.getByLabel('Package size', { exact: true }).selectOption(String(1024 ** 3));
  await page.getByLabel('Compatibility', { exact: true }).selectOption('eligible');
  assert.equal(await dialog(page).locator('[data-model-key="hub:fixture/qwen"]').count(), 1);
  assert.equal(await variant.inputValue(), 'q8', 'Filtering must not silently change the explicitly selected package');
  assert.match(await dialog(page).getByRole('region', { name: 'Model details' }).textContent(), /variant.*match|match.*variant/i);
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await page.evaluate(() => modelBrowser.refresh());
  assert.equal(await variant.inputValue(), 'q8');
  await variant.selectOption('q4');
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isEnabled(), true);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('needs-inspection inclusion cannot override known size, precision, task or runtime mismatches', () => {
  const base = { browserOrigin: 'hub', key: 'pending', name: 'Pending', browserSummary: false,
    requiresInspection: true, loadable: false, dtype: 'unknown', totalBytes: 500000000, task: 'text-generation' };
  const fixtures = [base,
    { ...base, key: 'too-large', totalBytes: 2 * 1024 ** 3 },
    { ...base, key: 'wrong-precision', dtype: 'q8_0' },
    { ...base, key: 'wrong-task', task: 'text-to-image' },
    { ...base, key: 'unsupported', requiresInspection: false, dtype: 'q4', reason: 'Unsupported architecture' },
  ];
  const filters = { query: '', source: 'all', task: 'text-generation', precision: 'q4', size: String(1024 ** 3), compatibility: 'eligible', sort: 'smallest' };
  const actual = filterBrowserModels(fixtures, filters, () => ({ status: 'unknown', code: 'memory_fit_unverified' }), { includeUninspected: true });
  assert.deepEqual(actual.map((item) => item.key), ['pending']);
  assert.equal(actual[0].browserFilterPending, true);
  assert.deepEqual(filterBrowserModels(fixtures, filters, () => ({ status: 'unknown' })), [], 'Default strict matching remains unchanged');
});

test('local AND description filters, task, precision, size and empty state preserve query across refresh', async (t) => {
  const page = await fixture(t);
  await page.getByLabel('Source', { exact: true }).selectOption('catalog');
  await page.getByLabel('Search models', { exact: true }).fill('describes diagrams q4');
  assert.equal(await rows(page).count(), 1);
  await page.getByLabel('Task', { exact: true }).selectOption('image-text-to-text');
  await page.getByLabel('Package size', { exact: true }).selectOption(String(500 * 1024 ** 2));
  await page.getByLabel('Precision', { exact: true }).selectOption('q4');
  await page.evaluate(() => modelBrowser.refresh());
  assert.equal(await rows(page).count(), 1);
  assert.equal(await page.getByLabel('Search models', { exact: true }).inputValue(), 'describes diagrams q4');
  await page.getByLabel('Search models', { exact: true }).fill('no matches');
  assert.equal(await rows(page).count(), 0); assert.match(await dialog(page).textContent(), /No matching models/);
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).count(), 0);
  await page.getByLabel('Search models', { exact: true }).fill(''); assert.equal(await rows(page).count(), 1);
  assert.deepEqual(await page.evaluate(() => calls), []);
});

test('memory-unknown remains eligible; checking and unavailable block local Load without blocking busy peer use', async (t) => {
  const page = await fixture(t);
  await page.getByLabel('Compatibility', { exact: true }).selectOption('eligible');
  assert.deepEqual(await rows(page).evaluateAll((items) => items.map((item) => item.dataset.modelKey)), ['stored:tiny', 'hf:vision', 'peer:large']);
  await page.getByLabel('Compatibility', { exact: true }).selectOption('all'); await choose(page, 'peer:large');
  const load = dialog(page).getByRole('button', { name: 'Load', exact: true }); assert.equal(await load.isDisabled(), true);
  await load.evaluate((element) => element.onclick());
  assert.deepEqual(await page.evaluate(() => calls), []);
  await dialog(page).getByRole('button', { name: 'Use peer (busy)', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls), [{ type: 'peer', key: 'peer:large' }]);
  assert.equal(await dialog(page).isVisible(), false);
});

test('stale local capability and peer availability are rechecked at the explicit action', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => { state.sources.find((source) => source.key === 'hf:vision').localAvailability = { status: 'unavailable', reason: 'Device lost' }; });
  await dialog(page).getByRole('button', { name: 'Load', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls), []);
  await choose(page, 'peer:large'); await page.evaluate(() => { state.targets = []; });
  await dialog(page).getByRole('button', { name: 'Use peer (busy)', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls), []);
});

test('stored catalog rows are not duplicated and host-only packages remain usable without file advertisements', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => {
    state.sources[0].stored = true;
    state.sources[0].model = { dtype: { vision_encoder: 'q4', decoder_model_merged: 'q4' } }; delete state.sources[0].dtype;
    state.targets.push({ key: 'peer:inference-only', name: 'Inference only', available: true, local: false, busy: false });
    modelBrowser.refresh();
  });
  await page.getByLabel('Source', { exact: true }).selectOption('stored');
  assert.deepEqual(await rows(page).evaluateAll((items) => items.map((item) => item.dataset.modelKey)), ['stored:tiny', 'hf:vision']);
  assert.match(await dialog(page).locator('[data-model-key="hf:vision"]').textContent(), /q4/);
  await page.getByLabel('Source', { exact: true }).selectOption('all');
  await page.getByLabel('Compatibility', { exact: true }).selectOption('eligible');
  await choose(page, 'peer:inference-only');
  assert.match(await dialog(page).textContent(), /Files not advertised; use peer inference/);
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await dialog(page).getByRole('button', { name: 'Use peer', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls), [{ type: 'peer', key: 'peer:inference-only' }]);
});

test('pending GGUF variants request exactly one selected header before explicit Load', async (t) => {
  const page = await fixture(t, { inspectMode: 'lazy' });
  await searchFor(page, 'gguf'); await choose(page, 'hub:fixture/gguf');
  await page.getByLabel('Package variant', { exact: true }).waitFor();
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'inspect').length), 1);
  await dialog(page).getByRole('button', { name: 'Inspect selected variant' }).click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'inspect' && call.selectedVariant === 'q4'));
  assert.equal(await page.evaluate(() => calls.find((call) => call.selectedVariant === 'q4').reference),
    'https://huggingface.co/fixture/gguf/tree/' + 'a'.repeat(40));
  await page.waitForFunction(() => !document.querySelector('.pc-browser-actions button').disabled);
  assert.match(await dialog(page).textContent(), /apache-2.0/); assert.match(await dialog(page).textContent(), /Review publisher license terms/);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
  const variant = page.getByLabel('Package variant', { exact: true }); await variant.focus();
  await page.evaluate(() => modelBrowser.refresh());
  assert.equal(await variant.evaluate((element) => document.activeElement === element), true);
  await variant.selectOption('q8');
  await page.waitForFunction(() => calls.some((call) => call.type === 'inspect' && call.selectedVariant === 'q8'));
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'inspect').length), 3);
});

test('explicit inspection and variant changes reveal the size-sorted selection while refresh preserves scroll', async (t) => {
  const page = await fixture(t, { searchMode: 'many' });
  await searchFor(page, 'results');
  const list = dialog(page).getByRole('list', { name: 'Model results' });
  await list.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  assert.ok(await list.evaluate((element) => element.scrollTop) > 100);
  await choose(page, 'hub:fixture/result-19');
  await page.getByLabel('Package variant', { exact: true }).waitFor();
  const visibleSelection = () => list.evaluate((element) => {
    const selected = element.querySelector('[aria-pressed=true]').getBoundingClientRect();
    const viewport = element.getBoundingClientRect();
    return selected.top >= viewport.top - 1 && selected.bottom <= viewport.bottom + 1;
  });
  assert.equal(await visibleSelection(), true, 'Inspecting a newly sized package reveals its moved row');
  await list.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  const scrolled = await list.evaluate((element) => element.scrollTop);
  await page.evaluate(() => modelBrowser.refresh());
  assert.equal(await list.evaluate((element) => element.scrollTop), scrolled, 'Background refresh must not jump back to selection');
  await page.getByLabel('Package variant', { exact: true }).selectOption('q8');
  assert.equal(await visibleSelection(), true, 'Explicit variant choice reveals the associated model row');
  assert.equal(await dialog(page).locator('[aria-pressed=true]').getAttribute('data-model-key'), 'hub:fixture/result-19');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('search debounces and ignores old requests even when the provider ignores abort', async (t) => {
  const page = await fixture(t, { searchMode: 'pending' });
  await page.getByLabel('Search models', { exact: true }).fill('old');
  await page.waitForFunction(() => state.pending.length === 1);
  await page.getByLabel('Search models', { exact: true }).fill('new');
  await page.waitForFunction(() => state.pending.length === 2);
  await page.evaluate(() => state.pending.find((item) => item.query === 'new').resolve());
  await page.getByText('new result', { exact: true }).first().waitFor();
  await page.evaluate(() => state.pending.find((item) => item.query === 'old').resolve());
  await page.waitForTimeout(30);
  assert.equal(await page.getByText('old result', { exact: true }).count(), 0);
  assert.ok(await page.evaluate(() => calls.some((call) => call.type === 'search-abort' && call.query === 'old')));
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 2);
});

test('inspection selects exact variants and never loads until explicit Load; unsafe description stays plain text', async (t) => {
  const page = await fixture(t);
  await searchFor(page, 'qwen'); await choose(page, 'hub:fixture/qwen');
  await page.getByLabel('Package variant', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Package variant', { exact: true }).inputValue(), 'q4');
  assert.match(await dialog(page).locator('[data-model-key="hub:fixture/qwen"]').textContent(), /476.8 MiB package.*q4_k_m/);
  assert.equal(await dialog(page).locator('img').count(), 0);
  assert.match(await dialog(page).getByRole('region', { name: 'Model details' }).textContent(), /<img src=x onerror=alert\(1\)>/);
  await page.getByLabel('Package variant', { exact: true }).selectOption('split');
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.match(await dialog(page).textContent(), /Split GGUF packages are unsupported/);
  await page.getByLabel('Package variant', { exact: true }).selectOption('q8');
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await page.getByLabel('Package variant', { exact: true }).selectOption('q4');
  await page.evaluate(() => modelBrowser.refresh());
  assert.equal(await page.getByLabel('Package variant', { exact: true }).inputValue(), 'q4');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
  await dialog(page).getByRole('button', { name: 'Load', exact: true }).click();
  const loaded = await page.evaluate(() => calls.find((call) => call.type === 'load').source);
  assert.equal(loaded.id, 'fixture-q4'); assert.equal(loaded.model.dtype, 'q4_k_m'); assert.equal(loaded.key, undefined);
  assert.equal(loaded.files[0].path, 'weights.gguf');
});

test('offline/rate errors preserve local choices; cached pagination remains explicit', async (t) => {
  const page = await fixture(t, { searchMode: 'error' });
  await searchFor(page, 'vision');
  assert.match(await dialog(page).getByRole('status').textContent(), /429.*Catalog, stored models and peer files remain available/);
  assert.equal(await rows(page).count(), 1);
  await page.evaluate(() => { state.searchMode = 'cached'; }); await searchFor(page, 'qwen');
  assert.match(await dialog(page).getByRole('status').textContent(), /Offline snapshot.*cached/);
  await dialog(page).getByRole('button', { name: 'More Hugging Face results' }).click();
  await page.getByText('qwen result', { exact: true }).first().waitFor();
  await page.waitForFunction(() => calls.some((call) => call.cursor === 'next'));
  await page.waitForFunction(() => document.querySelectorAll('[data-model-key^="hub:"]').length === 2);
  assert.equal(await dialog(page).getByRole('button', { name: 'More Hugging Face results' }).isVisible(), false);
});

test('Hugging Face URL resolves a repository choice without trusting arbitrary links', async (t) => {
  const page = await fixture(t);
  await searchFor(page, 'https://huggingface.co/owner/model/tree/main');
  assert.ok(await page.evaluate(() => calls.some((call) => call.type === 'search' && call.query === 'owner/model')));
  await choose(page, 'hub:owner/model'); await page.getByLabel('Package variant', { exact: true }).waitFor();
  assert.equal(await dialog(page).getByRole('link', { name: 'owner/model' }).getAttribute('href'), 'https://huggingface.co/owner/model');
  await searchFor(page, 'https://evil.invalid/owner/model');
  assert.match(await dialog(page).getByRole('status').textContent(), /Enter a Hugging Face model URL/);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 1);
});

test('pinned URLs preserve revision through inspection and reject mismatched metadata', async (t) => {
  const page = await fixture(t), revision = 'b'.repeat(40);
  const url = `https://huggingface.co/owner/model/blob/${revision}/model.gguf`;
  await searchFor(page, url); await choose(page, `hub:owner/model@${revision}`);
  await page.getByLabel('Package variant', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => calls.find((call) => call.type === 'inspect').reference), url);
  assert.match(await dialog(page).getByRole('region', { name: 'Model details' }).textContent(), new RegExp(revision));
  await page.evaluate(() => { state.inspectMode = 'wrongRevision'; });
  const wrong = `https://huggingface.co/owner/another/tree/${revision}`;
  await searchFor(page, wrong); await choose(page, `hub:owner/another@${revision}`);
  await dialog(page).getByRole('status').filter({ hasText: 'different model revision' }).waitFor();
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('Escape aborts pending metadata, restores trigger focus and late inspection cannot reopen the dialog', async (t) => {
  const page = await fixture(t, { inspectMode: 'pending' });
  await searchFor(page, 'qwen'); await choose(page, 'hub:fixture/qwen');
  await page.waitForFunction(() => Boolean(window.finishInspect));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => calls.some((call) => call.type === 'inspect-abort'));
  await page.waitForTimeout(40);
  assert.equal(await page.locator('#browse').evaluate((element) => document.activeElement === element), true,
    await page.evaluate(() => document.activeElement?.outerHTML));
  await page.evaluate(() => finishInspect()); await page.waitForTimeout(20);
  assert.equal(await dialog(page).isVisible(), false);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('busy disables model actions and disposal cancels requests without late DOM mutation', async (t) => {
  const page = await fixture(t, { searchMode: 'pending' });
  await page.getByLabel('Search models', { exact: true }).fill('pending');
  await page.waitForFunction(() => state.pending.length === 1);
  await page.evaluate(() => modelBrowser.setBusy(true));
  assert.equal(await page.getByLabel('Search models', { exact: true }).isDisabled(), true);
  assert.ok(await page.evaluate(() => calls.some((call) => call.type === 'search-abort')));
  await page.evaluate(() => { modelBrowser.dispose(); state.pending[0].resolve(); });
  await page.waitForTimeout(20); assert.equal(await page.locator('dialog').count(), 0);
});

test('idle panel refresh preserves a slow search and a busy-to-idle transition resumes it once', async (t) => {
  const page = await fixture(t, { searchMode: 'pending' });
  await page.getByLabel('Search models', { exact: true }).fill('slow');
  await page.waitForFunction(() => state.pending.length === 1);
  await page.evaluate(() => { modelBrowser.setBusy(false); modelBrowser.refresh(); modelBrowser.setBusy(false); });
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 1);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search-abort').length), 0);
  await page.evaluate(() => { modelBrowser.setBusy(true); modelBrowser.setBusy(false); modelBrowser.setBusy(false); });
  await page.waitForFunction(() => state.pending.length === 2);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search-abort').length), 1);
  await page.evaluate(() => { state.pending[0].resolve(); state.pending[1].resolve(); });
  await dialog(page).locator('[data-model-key="hub:fixture/slow"]').waitFor();
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'search').length), 2);
});

async function inspectOriginal(page) {
  await searchFor(page, 'original'); await choose(page, 'hub:fixture/original');
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).waitFor();
}
const related = (page) => dialog(page).getByRole('region', { name: 'Related browser packages', exact: true });

test('conversion lookup is explicit on supported models, cached across refresh/reopen and never imports a package', async (t) => {
  const page = await fixture(t, { conversions: true }); await inspectOriginal(page);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'conversions').length), 0);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await related(page).locator('[data-conversion-repository="converters/onnx"]').waitFor();
  assert.match(await related(page).textContent(), /Candidate.*Needs inspection/);
  assert.match(await related(page).textContent(), /Publisher-declared source: fixture\/original/);
  assert.match(await related(page).locator('[data-conversion-repository="converters/finetune"]').textContent(), /GGUF · finetune/);
  for (let index = 0; index < 3; index++) await page.evaluate(() => { modelBrowser.setBusy(false); modelBrowser.refresh(); });
  await page.keyboard.press('Escape'); await page.locator('#browse').click(); await choose(page, 'hub:fixture/original');
  assert.equal(await related(page).locator('[data-conversion-repository]').count(), 3);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'conversions').length), 1);
  assert.equal(await page.evaluate(() => calls.find((call) => call.type === 'conversions').reference),
    `https://huggingface.co/fixture/original/tree/${'a'.repeat(40)}`);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'inspect').length), 1);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('an unsupported original leads to a pinned candidate inspection with visible lineage and a separate exact Load', async (t) => {
  const page = await fixture(t, { conversions: true, unsupportedOriginal: true });
  await page.getByLabel('Source', { exact: true }).selectOption('hub');
  await inspectOriginal(page);
  assert.match(await dialog(page).getByRole('region', { name: 'Model details', exact: true }).textContent(), /Unsupported/);
  assert.equal(await dialog(page).getByRole('button', { name: 'Inspect variants', exact: true }).count(), 0);
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await related(page).locator('[data-conversion-repository="converters/onnx"]').click();
  await page.getByLabel('Package variant', { exact: true }).waitFor();
  const detail = dialog(page).getByRole('region', { name: 'Model details', exact: true });
  assert.match(await detail.textContent(), /Publisher-declared source: fixture\/original.*Relationship: converted/);
  assert.match(await detail.textContent(), /does not prove equivalent weights or the same source revision/);
  assert.equal(await detail.locator('img,script').count(), 0);
  assert.equal(await page.getByLabel('Search models', { exact: true }).inputValue(), 'original');
  assert.equal(await page.getByLabel('Source', { exact: true }).inputValue(), 'hub');
  assert.equal(await dialog(page).locator('[data-model-key="hub:fixture/original"]').count(), 1);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'inspect').at(-1).reference),
    `https://huggingface.co/converters/onnx/tree/${'c'.repeat(40)}`);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
  await detail.getByRole('button', { name: 'Back to source model', exact: true }).click();
  assert.equal(await related(page).locator('[data-conversion-repository]').count(), 3);
  await related(page).locator('[data-conversion-repository="converters/onnx"]').click();
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'inspect').length), 2, 'Returning to an inspected candidate reuses its pinned metadata');
  await dialog(page).getByRole('button', { name: 'Load', exact: true }).click();
  const calls = await page.evaluate(() => window.calls.filter((call) => call.type === 'load'));
  assert.equal(calls.length, 1); assert.equal(calls[0].source.model.repository, 'converters/onnx');
  assert.equal(calls[0].source.id, 'fixture-q4');
});

test('conversion discovery preserves the inspected source revision and separates its metadata cache by revision', async (t) => {
  const page = await fixture(t, { conversions: true });
  for (const revision of ['b'.repeat(40), 'd'.repeat(40)]) {
    await searchFor(page, `https://huggingface.co/owner/source/tree/${revision}`);
    await choose(page, `hub:owner/source@${revision}`);
    await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
    await related(page).locator('[data-conversion-repository="converters/onnx"]').waitFor();
  }
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.type === 'conversions').map((call) => call.reference)),
    ['b'.repeat(40), 'd'.repeat(40)].map((revision) => `https://huggingface.co/owner/source/tree/${revision}`));
  await searchFor(page, `https://huggingface.co/owner/source/tree/${'b'.repeat(40)}`);
  await choose(page, `hub:owner/source@${'b'.repeat(40)}`);
  assert.equal(await related(page).locator('[data-conversion-repository]').count(), 3);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'conversions').length), 2);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('a related selection excluded by filters stays explicit, cannot Load, and can be revealed without changing its query', async (t) => {
  const page = await fixture(t, { conversions: true, unsupportedOriginal: true }); await inspectOriginal(page);
  await page.getByLabel('Package size', { exact: true }).selectOption('unknown');
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await related(page).locator('[data-conversion-repository="converters/onnx"]').click();
  await page.getByLabel('Package variant', { exact: true }).waitFor();
  const detail = dialog(page).getByRole('region', { name: 'Model details', exact: true });
  assert.match(await detail.textContent(), /selected package does not match your current filters/i);
  assert.match(await detail.textContent(), /converters\/onnx/);
  assert.equal(await dialog(page).locator('[data-model-key][aria-pressed=true]').count(), 0);
  const load = dialog(page).getByRole('button', { name: 'Load', exact: true });
  assert.equal(await load.isDisabled(), true); await load.evaluate((element) => element.onclick());
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
  await detail.getByRole('button', { name: 'Show selected package', exact: true }).click();
  assert.equal(await page.getByLabel('Search models', { exact: true }).inputValue(), 'original');
  assert.equal(await load.isEnabled(), true);
  await page.getByLabel('Precision', { exact: true }).selectOption('q8_0');
  assert.equal(await page.getByLabel('Package variant', { exact: true }).inputValue(), 'q4');
  assert.match(await detail.textContent(), /Matching variant: Q8 package/);
  assert.equal(await load.isDisabled(), true, 'A matching alternate does not authorize loading a different explicitly selected precision');
  await load.evaluate((element) => element.onclick());
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('conversion cancellation, Escape and disposal ignore late metadata without reopening or retrying automatically', async (t) => {
  const page = await fixture(t, { conversions: true, conversionMode: 'pending' }); await inspectOriginal(page);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await page.waitForFunction(() => state.conversionPending.length === 1);
  assert.equal(await dialog(page).getByRole('button', { name: 'Cancel conversion search', exact: true }).evaluate((element) => document.activeElement === element), true);
  await dialog(page).getByRole('button', { name: 'Cancel conversion search', exact: true }).click();
  assert.match(await related(page).textContent(), /cancelled/);
  assert.equal(await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).evaluate((element) => document.activeElement === element), true);
  await page.evaluate(() => state.conversionPending[0].resolve()); await page.waitForTimeout(30);
  assert.equal(await related(page).locator('[data-conversion-repository]').count(), 0);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await page.waitForFunction(() => state.conversionPending.length === 2);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => calls.filter((call) => call.type === 'conversions-abort').length === 2);
  await page.evaluate(() => state.conversionPending[1].resolve()); await page.waitForTimeout(30);
  assert.equal(await dialog(page).isVisible(), false);
  assert.equal(await page.locator('#browse').evaluate((element) => document.activeElement === element), true);
  await page.locator('#browse').click(); await choose(page, 'hub:fixture/original');
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'conversions').length), 2);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await page.waitForFunction(() => state.conversionPending.length === 3);
  await page.evaluate(() => { modelBrowser.dispose(); state.conversionPending[2].resolve(); });
  await page.waitForTimeout(30); assert.equal(await page.locator('dialog').count(), 0);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('conversion errors and empty cached results remain readable without replacing the original selection', async (t) => {
  const page = await fixture(t, { conversions: true, conversionMode: 'error', unsupportedOriginal: true }); await inspectOriginal(page);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await related(page).getByRole('status').filter({ hasText: '429' }).waitFor();
  assert.equal(await dialog(page).locator('[data-model-key][aria-pressed=true]').getAttribute('data-model-key'), 'hub:fixture/original');
  await page.evaluate(() => { state.conversionMode = 'empty'; });
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await related(page).getByRole('status').filter({ hasText: 'No publisher-declared' }).waitFor();
  await page.evaluate(() => modelBrowser.refresh());
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'conversions').length), 2);
  assert.equal(await dialog(page).getByRole('button', { name: 'Load', exact: true }).isDisabled(), true);
});

test('conversion requests abort on query changes and cannot insert their stale candidates into a new search', async (t) => {
  const page = await fixture(t, { conversions: true, conversionMode: 'pending' }); await inspectOriginal(page);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  await page.waitForFunction(() => state.conversionPending.length === 1);
  await searchFor(page, 'replacement');
  await page.evaluate(() => state.conversionPending[0].resolve()); await page.waitForTimeout(30);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'conversions-abort').length), 1);
  assert.equal(await dialog(page).locator('[data-conversion-repository]').count(), 0);
  assert.equal(await dialog(page).locator('[data-model-key="hub:fixture/replacement"]').count(), 1);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'load').length), 0);
});

test('conversion publishers and lineage wrap on desktop/mobile while Load remains visible', async (t) => {
  const page = await fixture(t, { conversions: true, longConversions: true, conversionMode: 'cached' }); await inspectOriginal(page);
  await dialog(page).getByRole('button', { name: 'Find browser conversions', exact: true }).click();
  const conversion = related(page).locator('[data-conversion-repository="converters/onnx"]'); await conversion.waitFor();
  assert.match(await related(page).textContent(), /Offline metadata.*cached conversion metadata/);
  const directory = process.env.MODEL_BROWSER_SCREENSHOTS || '/tmp/peercompute-model-browser-ui'; await mkdir(directory, { recursive: true });
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    await page.setViewportSize(viewport);
    if (name === 'mobile') await choose(page, 'hub:fixture/original');
    await conversion.scrollIntoViewIfNeeded();
    assert.equal(await dialog(page).evaluate((element) => element.scrollWidth <= element.clientWidth), true);
    assert.equal(await conversion.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
    const action = await dialog(page).getByRole('button', { name: 'Load', exact: true }).boundingBox(), box = await dialog(page).boundingBox();
    assert.ok(action.y >= box.y && action.y + action.height <= box.y + box.height);
    await page.screenshot({ path: `${directory}/conversions-${name}.png` });
  }
});

test('conversion metadata rejects forged source identity and malformed lineage while preserving distinct derivatives', () => {
  const item = { repository: 'publisher/export', sourceRepository: 'owner/source', formats: ['GGUF'], relationship: 'finetune',
    evidence: { kind: 'publisher-base-model', revision: 'a'.repeat(40), url: 'javascript:ignored' } };
  assert.equal(conversionCandidate(item, 'owner/source').relationship, 'finetune');
  assert.equal(conversionCandidate(item, 'owner/source').reference, `https://huggingface.co/publisher/export/tree/${'a'.repeat(40)}`);
  for (const change of [{ sourceRepository: 'spoof/source' }, { sourceRepository: {} }, { repository: 'https://evil.test/export' },
    { formats: ['safetensors'] }, { relationship: 'identical' }, { evidence: { kind: 'name-match', revision: 'a'.repeat(40) } },
    { revision: 'b'.repeat(40) }]) assert.equal(conversionCandidate({ ...item, ...change }, 'owner/source'), null);
});

test('desktop/mobile dialog wraps long content, traps focus and produces owned UI screenshots', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => {
    state.sources[0].description = 'Very long model description '.repeat(30);
    state.sources[0].name = 'A_long_model_name_without_natural_line_breaks_'.repeat(4);
    modelBrowser.refresh();
  });
  const directory = process.env.MODEL_BROWSER_SCREENSHOTS || '/tmp/peercompute-model-browser-ui'; await mkdir(directory, { recursive: true });
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    await page.setViewportSize(viewport);
    const box = await dialog(page).boundingBox();
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width && box.y + box.height <= viewport.height, JSON.stringify(box));
    assert.equal(await dialog(page).evaluate((element) => element.scrollWidth <= element.clientWidth), true);
    const row = dialog(page).locator('[data-model-key="hf:vision"]');
    assert.equal(await row.evaluate((element) => getComputedStyle(element).whiteSpace), 'normal');
    assert.equal(await row.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
    if (name === 'mobile') await choose(page, 'hf:vision');
    const action = await dialog(page).getByRole('button', { name: 'Load', exact: true }).boundingBox();
    assert.ok(action && action.y >= box.y && action.y + action.height <= box.y + box.height, 'Load remains visible below scrolling details');
    await dialog(page).getByRole('button', { name: 'Done', exact: true }).focus(); await page.keyboard.press('Shift+Tab');
    assert.equal(await dialog(page).evaluate((element) => element.contains(document.activeElement)), true);
    await page.screenshot({ path: `${directory}/${name}.png` });
  }
});

test('pure URL and matching helpers reject spoof links and match remote model variants only by identity', () => {
  assert.equal(repositoryQuery('https://huggingface.co/owner/repo/blob/main/model.gguf').repository, 'owner/repo');
  assert.ok(repositoryQuery('https://huggingface.co.evil.test/owner/repo').error);
  assert.ok(repositoryQuery('https://user:pass@huggingface.co/owner/repo').error);
  assert.equal(safeModelUrl('javascript:alert(1)'), null);
  assert.deepEqual(matchingPeerTargets({ repository: 'same/repo', revision: 'same', modelId: 'q4' }, [
    { key: 'peer:q8', modelId: 'q8', repository: 'same/repo', revision: 'same', available: true },
  ]), []);
  const filtered = filterBrowserModels([{ key: 'known', name: 'Known', totalBytes: 10 }, { key: 'unknown', name: 'Unknown' }],
    { query: '', source: 'all', task: 'all', precision: 'all', size: 'all', compatibility: 'all', sort: 'largest' });
  assert.deepEqual(filtered.map((item) => item.key), ['known', 'unknown']);
});
