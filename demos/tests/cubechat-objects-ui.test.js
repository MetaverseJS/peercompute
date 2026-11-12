import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Actual DOM/input checks with a controlled owned-object service. These do not
// delete user artifacts or stand in for ArtifactStore/network acceptance.
let server, browser, origin, cache;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  cache = await mkdtemp(join(tmpdir(), 'cube-objects-ui-'));
  server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'cube-objects-ui-fixture', configureServer(vite) {
      vite.middlewares.use('/__cube_objects_ui', (_req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><div id="app"></div>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
    args: ['--disable-gpu', '--disable-webgpu'] });
});
after(async () => {
  try { await browser?.close(); } finally { await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); }
});
async function fixture(t, { mobile = false } = {}) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1200, height: 900 }, hasTouch: mobile });
  const page = await context.newPage(), errors = [], external = [];
  page.setDefaultTimeout(5000); page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__cube_objects_ui');
  await page.evaluate(async () => {
    await import('/demos/cubechat/src/style.css');
    const { cubeShell, createCubeSettingsUi } = await import('/demos/cubechat/src/ui/CubeSettingsUi.js');
    document.getElementById('app').innerHTML = cubeShell;
    document.getElementById('loading').remove();
    window.calls = []; window.failed = new Set(); window.heldId = null;
    const descriptor = (id, name) => ({ artifactCid: 'fixture:' + id, placement: { objectId: id, name, size: 6 } });
    window.makeService = function(values) {
      const records = new Map(values.map(value => [value.placement.objectId, value]));
      return { records, ready: Promise.resolve(), list: () => structuredClone([...records.values()]),
        async remove(id, { signal }) {
          calls.push({ type: 'remove', id });
          if (id === heldId) await new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => reject(signal.reason), { once: true }); window.releaseDelete = resolve;
          });
          signal.throwIfAborted();
          if (failed.has(id)) throw new Error('Storage write failed');
          if (!records.has(id)) throw new Error('Object not owned');
          records.delete(id);
        }
      };
    };
    window.owner = makeService([descriptor('chair', 'Wooden chair'), descriptor('car', 'Blue car'), descriptor('lamp', 'Desk lamp')]);
    window.currentService = owner;
    window.ui = createCubeSettingsUi({ beforeOpen: () => calls.push({ type: 'release-input' }),
      getGeneratedObjects: async () => { if (window.pendingService) return pendingService; return currentService; },
      onResidents: () => calls.push({ type: 'residents' }), onModels: () => calls.push({ type: 'models' }) });
  });
  return page;
}
const panel = page => page.getByRole('dialog', { name: 'Placed objects', exact: true });
async function open(page) {
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Objects', exact: true }).click();
  await panel(page).waitFor();
}

test('hamburger Objects opens an owned-only list and removes only selected placed objects', async t => {
  const page = await fixture(t);
  await page.evaluate(() => owner.records.set('foreign', { local: false, placement: { objectId: 'foreign', name: 'Someone else’s statue' } }));
  await open(page);
  assert.equal(await panel(page).getByRole('checkbox').count(), 3);
  assert.equal(await panel(page).getByText('Someone else’s statue').count(), 0);
  assert.equal(await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).isDisabled(), true);
  await panel(page).getByRole('checkbox', { name: 'Wooden chair', exact: true }).check();
  await panel(page).getByRole('checkbox', { name: 'Desk lamp', exact: true }).check();
  if (process.env.CUBE_OBJECTS_SCREENSHOT_DIR) await page.screenshot({ path: join(process.env.CUBE_OBJECTS_SCREENSHOT_DIR, 'objects-desktop.png') });
  await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).click();
  await panel(page).getByRole('status').filter({ hasText: 'Removed 2 objects.' }).waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'remove').map(call => call.id)), ['chair', 'lamp']);
  assert.deepEqual(await page.evaluate(() => [...owner.records.keys()]), ['car', 'foreign']);
  assert.equal(await panel(page).getByRole('checkbox', { name: 'Blue car', exact: true }).isChecked(), false);
  await panel(page).getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Settings', exact: true }).evaluate(node => node === document.activeElement), true);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Models', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'models').length), 1);
});

test('a failed deletion reports the affected object and retains selection for retry', async t => {
  const page = await fixture(t); await page.evaluate(() => failed.add('car')); await open(page);
  await panel(page).getByRole('button', { name: 'Select all', exact: true }).click();
  await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).click();
  await panel(page).getByRole('status').filter({ hasText: 'Blue car: Storage write failed' }).waitFor();
  assert.match(await panel(page).getByRole('status').innerText(), /Removed 2 objects/);
  assert.equal(await panel(page).getByRole('checkbox', { name: 'Blue car', exact: true }).isChecked(), true);
  await page.evaluate(() => failed.clear());
  await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).click();
  await panel(page).getByRole('status').filter({ hasText: 'Removed 1 object.' }).waitFor();
  assert.equal(await panel(page).getByRole('checkbox').count(), 0);
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'remove').map(call => call.id)), ['chair', 'car', 'lamp', 'car']);
});

test('closing a pending batch stops later removals without undoing completed removals', async t => {
  const page = await fixture(t); await page.evaluate(() => window.heldId = 'car'); await open(page);
  await panel(page).getByRole('button', { name: 'Select all', exact: true }).click();
  await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).click();
  await page.waitForFunction(() => calls.some(call => call.type === 'remove' && call.id === 'car'));
  await panel(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.evaluate(() => window.heldId = null); await open(page);
  await panel(page).getByRole('status').filter({ hasText: '2 objects placed by this device.' }).waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'remove').map(call => call.id)), ['chair', 'car']);
  assert.equal(await panel(page).getByRole('checkbox', { name: 'Wooden chair', exact: true }).count(), 0);
  assert.equal(await panel(page).getByRole('checkbox', { name: 'Desk lamp', exact: true }).count(), 1);
});

test('a changed room service clears stale selection before any removal', async t => {
  const page = await fixture(t); await open(page);
  await panel(page).getByRole('checkbox', { name: 'Wooden chair', exact: true }).check();
  await page.evaluate(() => window.currentService = makeService([{ placement: { objectId: 'other', name: 'New room object' } }]));
  await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).click();
  await panel(page).getByRole('status').filter({ hasText: 'The room changed.' }).waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'remove')), []);
  assert.equal(await panel(page).getByRole('checkbox', { name: 'New room object', exact: true }).isChecked(), false);
  assert.equal(await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).isDisabled(), true);
});

test('mobile long names wrap, markup stays text, and disposal cancels only unfinished work', async t => {
  const page = await fixture(t, { mobile: true });
  await page.evaluate(() => {
    owner.records.set('long', { placement: { objectId: 'long', name: '<img src=x onerror=alert(1)> ' + 'LongGeneratedObject'.repeat(12) } });
    window.heldId = 'car';
  });
  await open(page); assert.equal(await panel(page).locator('img').count(), 0);
  assert.equal(await panel(page).evaluate(node => node.scrollWidth > node.clientWidth), false);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  if (process.env.CUBE_OBJECTS_SCREENSHOT_DIR) await page.screenshot({ path: join(process.env.CUBE_OBJECTS_SCREENSHOT_DIR, 'objects-mobile.png') });
  await panel(page).getByRole('checkbox', { name: 'Blue car', exact: true }).check();
  await panel(page).getByRole('button', { name: 'Delete selected', exact: true }).click();
  await page.waitForFunction(() => calls.some(call => call.type === 'remove'));
  await page.evaluate(() => { ui.dispose(); ui.dispose(); });
  assert.equal(await panel(page).count(), 0);
  assert.equal(await page.evaluate(() => owner.records.has('car')), true);
});

test('closing during service startup never reopens the dialog; Refresh retries unavailable services', async t => {
  const page = await fixture(t);
  await page.evaluate(() => { window.pendingService = new Promise(resolve => window.resolveService = resolve); });
  await open(page); await page.keyboard.press('Escape');
  await page.evaluate(() => { resolveService(owner); window.pendingService = null; window.currentService = null; });
  assert.equal(await panel(page).isVisible(), false);
  await open(page); await panel(page).getByRole('status').filter({ hasText: 'Object controls are still starting.' }).waitFor();
  await page.evaluate(() => window.currentService = owner);
  await panel(page).getByRole('button', { name: 'Refresh', exact: true }).click();
  await panel(page).getByRole('checkbox', { name: 'Wooden chair', exact: true }).waitFor();
  assert.equal(await panel(page).getByRole('checkbox').count(), 3);
});
