import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { filterBrowserModels, repositoryQuery, safeModelUrl, matchingPeerTargets } from '../inference/src/ui/modelBrowserData.js';

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
  const page = await browser.newPage({ viewport: { width: 1150, height: 950 } });
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
    searchMode: options.searchMode, inspectMode: options.inspectMode, selected: options.selectedKey ?? 'hf:vision', pending: [] };
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    window.modelBrowser = createModelBrowser({ container: document.querySelector('#root'), getSources: () => state.sources, getTargets: () => state.targets,
      getCompatibility: (source) => source.localAvailability ?? { status: 'unknown', code: 'memory_fit_unverified', cpuBytes: 1024 ** 3, gpuBytes: 2 * 1024 ** 3 },
      async searchModels({ query, cursor, signal }) {
        calls.push({ type: 'search', query, cursor });
        signal.addEventListener('abort', () => calls.push({ type: 'search-abort', query }), { once: true });
        if (state.searchMode === 'pending') await new Promise((resolve) => state.pending.push({ query, resolve }));
        if (state.searchMode === 'error') throw new Error('HTTP 429: retry later');
        return { items: state.searchMode === 'many' ? Array.from({ length: 20 }, (_, index) => ({ repository: `fixture/result-${String(index).padStart(2, '0')}`, name: `Result ${String(index).padStart(2, '0')}` }))
          : [{ repository: `fixture/${query.replaceAll('/', '-')}${cursor ? '-page2' : ''}`, name: `${query} result`, description: 'Description from the model card.' }],
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
        await delay(1);
        return { repository, revision, license: { spdx: 'apache-2.0', notice: 'Review publisher license terms.' },
          description: '<img src=x onerror=alert(1)> plain model description', variants: state.inspectMode === 'lazy'
            ? variants.map((variant) => variant.key === selectedVariant || variant.key === 'split' ? variant
              : { ...variant, loadable: false, requiresInspection: true, reason: 'Select this variant to inspect its bounded GGUF header.' }) : variants };
      },
      onLoad: (source) => calls.push({ type: 'load', source }), onUsePeer: (key) => calls.push({ type: 'peer', key }), onSetup: (source) => calls.push({ type: 'setup', key: source.key }),
    });
    document.querySelector('#browse').onclick = () => modelBrowser.open({ selectedKey: state.selected });
  }, options);
  await page.locator('#browse').click();
  return page;
}
const dialog = (page) => page.getByRole('dialog', { name: 'Browse models', exact: true });
const rows = (page) => dialog(page).locator('[data-model-key]');
async function choose(page, key) { await dialog(page).locator('[data-model-key]').filter({ has: page.locator('strong') }).evaluateAll((items, key) => items.find((item) => item.dataset.modelKey === key)?.click(), key); }
async function searchFor(page, query) {
  await page.getByRole('searchbox', { name: 'Search models' }).fill(query);
  await page.getByRole('searchbox', { name: 'Search models' }).press('Enter');
  await page.waitForFunction(() => !document.querySelector('.pc-browser-status').textContent.includes('Searching'));
}

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
