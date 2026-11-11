import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';

// Real panel, browser, modal and event wiring. Only the injected runtime is
// controlled. Bundle in memory and fulfill browser routes: no server, GPU,
// external network, microphone or user browser profile is used.
const repo = fileURLToPath(new URL('../../../', import.meta.url));
const origin = 'https://lora-panel-fixture.invalid';
let browser, bundle, entryPath, styles;
before(async () => {
  const output = await build({ configFile: false, root: repo, logLevel: 'error',
    plugins: [{ name: 'lora-panel-injected-runtime', enforce: 'pre',
      resolveId(source, importer) {
        if (source === './runtime.js' && importer?.endsWith('/demos/inference/src/agentPanel.js')) return '\0injected-runtime';
      },
      load(id) { if (id === '\0injected-runtime') return 'export function createInferenceRuntime() { throw new Error("Runtime injection is required for this fixture"); }'; },
    }],
    build: { write: false, minify: false, target: 'esnext', lib: { entry: `${repo}/demos/inference/src/agentPanel.js`,
      formats: ['es'], fileName: 'panel' }, rollupOptions: { output: { inlineDynamicImports: true } } },
  });
  const generated = (Array.isArray(output) ? output : [output]).flatMap((part) => part.output);
  bundle = new Map(generated.map((item) => [`/${item.fileName}`, item.type === 'chunk' ? item.code : item.source]));
  entryPath = `/${generated.find((item) => item.type === 'chunk' && item.isEntry).fileName}`;
  styles = (await Promise.all(['panel.css', 'ui/modelBrowser.css', 'ui/networkStatus.css']
    .map((name) => readFile(new URL(`../src/${name}`, import.meta.url), 'utf8')))).join('\n');
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); });

async function fixture(t, { managementOnly = false } = {}) {
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(6000);
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { external.push(url.href); return route.abort(); }
    if (url.pathname === '/') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width"><link rel="icon" href="data:,"><main class="pc-inference-standalone" id="app"></main>' });
    if (!bundle.has(url.pathname)) return route.fulfill({ status: 404, body: 'Unknown fixture resource' });
    return route.fulfill({ contentType: url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript', body: bundle.get(url.pathname) });
  });
  t.after(async () => {
    await page.evaluate(() => window.panel?.dispose()).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin); await page.addStyleTag({ content: styles });
  await page.evaluate(async ({ entryPath, managementOnly }) => {
    const { mountInferencePanel } = await import(entryPath);
    window.calls = []; window.control = { mode: 'success', lost: false };
    const row = (manifestCid, name, runtime = 'llama.cpp') => ({ manifestCid, name, runtime, task: 'text-generation',
      modalities: ['text'], outputModalities: ['text'], totalBytes: 1024, loaded: false,
      localAvailability: { status: 'available' } });
    window.stored = [row('gguf-one', 'First GGUF'), row('gguf-two', 'Second GGUF'), row('onnx-one', 'ONNX model', 'transformers.js')];
    window.runtime = {
      store: {}, networkReady: true, getPreferences: () => ({ sharing: true, hostInference: true }),
      listModelSources: () => stored.map((item) => ({ ...item, key: `stored:${item.manifestCid}`, source: 'stored' })),
      listInferenceTargets: () => [], listStoredModels: async () => structuredClone(stored),
      getResidentModelStates: () => control.lost ? [{ manifestCid: 'gguf-one', status: 'lost' }] : [],
      getModelCompatibility: () => ({ status: 'available' }),
      async refreshPeers() {}, async setSharing() {}, async setHostInference() {}, async loadStoredModel() {}, async deleteStoredModel() {},
      async unload() { control.lost = false; calls.push({ action: 'unload' }); },
      async inspectLoraHub(reference, { signal }) {
        calls.push({ action: 'inspect', reference }); window.inspectionSignal = signal;
        if (control.holdInspection) await new Promise((resolve) => { window.releaseInspection = resolve; });
        signal.throwIfAborted();
        return { variants: [{ name: 'Fixture adapter', key: 'adapter', file: { path: 'adapter.gguf', size: 1024 }, profile: { architecture: 'qwen2' } }] };
      },
      async createLoraModel(baseManifestCid, options) {
        calls.push({ action: 'compose', baseManifestCid, load: options.load, name: options.name, scale: options.scale });
        window.compositionSignal = options.signal;
        options.onProgress?.({ stage: options.load ? 'load' : 'import', loaded: 100, totalBytes: 1024 });
        if (control.mode === 'hold') {
          await new Promise((resolve) => options.signal.addEventListener('abort', resolve, { once: true }));
          calls.push({ action: 'abort-compose' });
          if (control.cleanupFailure) { control.lost = true; throw new AggregateError([options.signal.reason], 'Model cleanup is incomplete'); }
          options.signal.throwIfAborted();
        }
        if (control.mode === 'fail') throw new Error('Adapter dimensions do not match selected base');
        const cid = `composed-${calls.filter((call) => call.action === 'compose').length}`;
        stored.push(row(cid, options.name));
        return { cid, manifest: { name: options.name } };
      },
      async dispose() { calls.push({ action: 'dispose-runtime' }); },
    };
    window.panel = await mountInferencePanel({ container: document.querySelector('#app'), runtimeFactory: async () => runtime,
      autoConnect: false, enableGlobalChat: false, managementOnly,
      onRequestClose: managementOnly ? async () => { calls.push({ action: 'request-close' }); await panel.dispose(); } : undefined });
    await panel.startupReady;
  }, { entryPath, managementOnly });
  await page.getByRole('checkbox', { name: 'Select First GGUF', exact: true }).waitFor();
  return page;
}
const models = (page) => page.getByRole('dialog', { name: 'Models', exact: true });
const composer = (page) => page.getByRole('dialog', { name: 'Add LoRA', exact: true });
const choose = (page, name) => models(page).getByRole('checkbox', { name: `Select ${name}`, exact: true });
async function openComposer(page) {
  await choose(page, 'First GGUF').check();
  await models(page).getByRole('button', { name: 'Add LoRA', exact: true }).click();
  await composer(page).getByLabel('Hugging Face adapter').fill('fixture/adapter');
  await composer(page).getByRole('button', { name: 'Inspect', exact: true }).click();
  await composer(page).getByRole('radio').waitFor();
}

test('panel allows exactly one stored GGUF and save-only returns to the stored model list', async (t) => {
  const page = await fixture(t), add = models(page).getByRole('button', { name: 'Add LoRA', exact: true });
  assert(await add.isDisabled());
  await choose(page, 'ONNX model').check(); assert(await add.isDisabled());
  await choose(page, 'ONNX model').uncheck(); await choose(page, 'First GGUF').check(); assert(await add.isEnabled());
  await choose(page, 'Second GGUF').check(); assert(await add.isDisabled());
  await choose(page, 'Second GGUF').uncheck(); await openComposer(page);
  await composer(page).getByLabel('Load after saving').uncheck();
  await composer(page).getByRole('button', { name: 'Save model', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.pc-lora-composer').open);
  assert.equal(await page.getByRole('dialog', { name: 'Loading model', exact: true }).isVisible(), false);
  assert(await choose(page, 'First GGUF + Fixture adapter').isVisible());
  assert.deepEqual(await page.evaluate(() => calls.filter((call) => call.action === 'compose').map(({ load, baseManifestCid }) => ({ load, baseManifestCid }))),
    [{ load: false, baseManifestCid: 'gguf-one' }]);
});

test('standalone load overlay cancels the actual composed request and leaves errors visible in the composer', async (t) => {
  const page = await fixture(t); await openComposer(page);
  await page.evaluate(() => { control.mode = 'hold'; });
  await composer(page).getByRole('button', { name: 'Save and load', exact: true }).click();
  const loading = page.getByRole('dialog', { name: 'Loading model', exact: true });
  await loading.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => compositionSignal.aborted && !document.querySelector('.pc-model-loading')?.open);
  await composer(page).getByRole('button', { name: 'Save and load', exact: true }).waitFor({ state: 'visible' });
  assert.equal(await page.evaluate(() => calls.some((call) => call.action === 'abort-compose')), true);
  assert.match(await composer(page).getByRole('status').textContent(), /cancel/i);
  await page.evaluate(() => { control.mode = 'fail'; });
  await composer(page).getByRole('button', { name: 'Save and load', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.pc-lora-composer [role="status"]').textContent.includes('dimensions'));
  assert(await composer(page).isVisible());
  assert.equal(await loading.isVisible(), false);
});

test('CubeChat management keeps cancellable LoRA progress visible and prevents closing after failed cleanup', async (t) => {
  const page = await fixture(t, { managementOnly: true }); await openComposer(page);
  await page.evaluate(() => { control.mode = 'hold'; control.cleanupFailure = true; });
  await composer(page).getByRole('button', { name: 'Save and load', exact: true }).click();
  assert.equal(await page.getByRole('dialog', { name: 'Loading model', exact: true }).isVisible(), false);
  await composer(page).getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => calls.some((call) => call.action === 'abort-compose'));
  await models(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.pc-browser-status').textContent.includes('cleanup'));
  assert.equal(await page.evaluate(() => calls.some((call) => call.action === 'dispose-runtime')), false);
  assert(await models(page).isVisible());
});

test('panel teardown aborts standalone adapter inspection before waiting for its runtime', async (t) => {
  const page = await fixture(t, { managementOnly: true });
  await choose(page, 'First GGUF').check(); await models(page).getByRole('button', { name: 'Add LoRA', exact: true }).click();
  await page.evaluate(() => { control.holdInspection = true; });
  await composer(page).getByLabel('Hugging Face adapter').fill('fixture/adapter');
  await composer(page).getByRole('button', { name: 'Inspect', exact: true }).click();
  await page.evaluate(async () => { await panel.dispose(); releaseInspection(); });
  assert.equal(await page.evaluate(() => inspectionSignal.aborted), true);
  assert.equal(await page.locator('.pc-inference-panel').count(), 0);
});
