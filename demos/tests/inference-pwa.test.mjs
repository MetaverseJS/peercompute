import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, mkdtemp, cp, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build } from 'vite';
import { chromium } from 'playwright';
import { createPwaInstallController, registerConsoleAppShell } from '../inference/src/pwa.js';
import { pagesIsolationPlugin } from '../shared/pagesIsolationPlugin.mjs';

function fixture() {
  const scope = new EventTarget(), media = new EventTarget();
  media.matches = false;
  Object.assign(scope, { isSecureContext: true, onbeforeinstallprompt: null,
    navigator: { userAgent: 'Chrome desktop' }, matchMedia: () => media });
  return { scope, media };
}

test('install prompt is explicit, one-shot, observable and does not claim success before appinstalled', async () => {
  const { scope } = fixture(), controller = createPwaInstallController({ scope });
  const changes = [], unsubscribe = controller.subscribe((state) => changes.push(state));
  let prompts = 0, resolvePrompt;
  const event = new Event('beforeinstallprompt', { cancelable: true });
  event.prompt = () => { prompts++; return new Promise((resolve) => { resolvePrompt = resolve; }); };
  scope.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true); assert.equal(prompts, 0);
  assert.equal(controller.getState().available, true);
  const result = controller.install();
  assert.equal(prompts, 1); assert.equal(controller.getState().installing, true);
  assert.equal((await controller.install()).outcome, 'unavailable');
  resolvePrompt({ outcome: 'accepted' });
  assert.deepEqual(await result, { outcome: 'accepted' });
  assert.equal(controller.getState().installed, false);
  scope.dispatchEvent(new Event('appinstalled'));
  assert.equal(controller.getState().installed, true);
  assert.equal((await controller.install()).outcome, 'installed');
  unsubscribe(); controller.dispose();
  assert.equal(changes.length, 5);
});

test('unsupported, dismissed and disposed installation leaves the ordinary console usable', async () => {
  const { scope } = fixture(); scope.navigator.userAgent = 'iPhone'; delete scope.onbeforeinstallprompt;
  const controller = createPwaInstallController({ scope });
  assert.equal(controller.getState().supported, false);
  assert.match((await controller.install()).instructions, /Safari.*Add to Home Screen/);
  const event = new Event('beforeinstallprompt', { cancelable: true });
  event.prompt = async () => ({ outcome: 'dismissed' });
  scope.dispatchEvent(event);
  assert.equal((await controller.install()).outcome, 'dismissed');
  assert.equal(controller.getState().available, false);
  controller.dispose();
  const later = new Event('beforeinstallprompt', { cancelable: true }); later.prompt = () => assert.fail('disposed prompt');
  scope.dispatchEvent(later);
  assert.equal(later.defaultPrevented, false);
  assert.equal((await controller.install()).outcome, 'unavailable');
});

test('registration reuses the isolation URL and never replaces another controlling worker', async () => {
  const calls = [], scope = { isSecureContext: true, location: { href: 'https://example.test/peercompute/inference/?dev=1' },
    navigator: { serviceWorker: { controller: null, register: async (...args) => { calls.push(args); return 'registration'; } } } };
  assert.equal(await registerConsoleAppShell({ scope }), 'registration');
  assert.deepEqual(calls, [['https://example.test/peercompute/inference/pages-isolation-sw.js',
    { scope: 'https://example.test/peercompute/inference/', type: 'module', updateViaCache: 'none' }]]);
  scope.navigator.serviceWorker.controller = { scriptURL: 'https://example.test/other-sw.js' };
  assert.equal(await registerConsoleAppShell({ scope }), null); assert.equal(calls.length, 1);
});

test('manifest uses a relative install identity and valid opaque 192/512/maskable PNG icons', async () => {
  const root = new URL('../inference/public/', import.meta.url);
  const manifest = JSON.parse(await readFile(new URL('manifest.webmanifest', root), 'utf8'));
  assert.equal(manifest.id, './'); assert.equal(manifest.scope, './'); assert.equal(manifest.start_url, './');
  assert.equal(manifest.display, 'standalone');
  for (const size of [192, 512]) assert.ok(manifest.icons.some((icon) => icon.sizes === `${size}x${size}` && icon.purpose === 'any'));
  assert.ok(manifest.icons.some((icon) => icon.purpose === 'maskable'));
  for (const icon of manifest.icons) {
    const bytes = await readFile(new URL(icon.src, root));
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    const [width, height] = icon.sizes.split('x').map(Number);
    assert.equal(bytes.readUInt32BE(16), width); assert.equal(bytes.readUInt32BE(20), height);
    assert.equal(bytes[25], 2, 'RGB image has an opaque background');
  }
});

test('headless browser sees an installable manifest, one isolated worker and an offline shell without model caching', { timeout: 60000 }, async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'peercompute-pwa-'));
  let server, browser;
  try {
    await cp(new URL('../inference/public/', import.meta.url), path.join(directory, 'public'), { recursive: true });
    const source = fileURLToPath(new URL('../inference/src/pwa.js', import.meta.url));
    await writeFile(path.join(directory, 'index.html'), '<html><head><title>PeerCompute PWA fixture</title><link rel="manifest" href="./manifest.webmanifest"></head><body><main id="status">Starting</main><script type="module" src="./main.js"></script></body></html>');
    await writeFile(path.join(directory, 'main.js'), `import { registerConsoleAppShell } from ${JSON.stringify(source)};\nvoid registerConsoleAppShell();document.querySelector('#status').textContent='Offline shell ready';`);
    const output = await build({ configFile: false, root: directory, base: './', logLevel: 'silent',
      plugins: [pagesIsolationPlugin({ appShell: { publicFiles: ['manifest.webmanifest', 'icons/peercompute-192.png',
        'icons/peercompute-512.png', 'icons/peercompute-maskable-512.png'] } })], build: { write: false } });
    const files = new Map(output.output.map((asset) => [asset.fileName, asset.type === 'chunk' ? asset.code : asset.source]));
    for (const name of ['manifest.webmanifest', 'icons/peercompute-192.png', 'icons/peercompute-512.png', 'icons/peercompute-maskable-512.png']) {
      files.set(name, await readFile(path.join(directory, 'public', name)));
    }
    const requests = [];
    server = createServer((request, response) => {
      const name = new URL(request.url, 'http://localhost').pathname.replace(/^\/peercompute\/inference\//, '') || 'index.html';
      requests.push(name);
      const body = files.get(name);
      if (body == null) { response.writeHead(404); response.end(); return; }
      const mime = name.endsWith('.js') ? 'text/javascript' : name.endsWith('.html') ? 'text/html'
        : name.endsWith('.png') ? 'image/png' : 'application/manifest+json';
      response.writeHead(200, { 'Content-Type': mime }); response.end(body);
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}/peercompute/inference/`;
    browser = await chromium.launchPersistentContext(path.join(directory, 'owned-browser-profile'), {
      executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
    const context = browser, page = await context.newPage();
    const errors = []; page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(origin);
    await page.waitForFunction(() => crossOriginIsolated && document.querySelector('#status')?.textContent === 'Offline shell ready');
    await page.waitForFunction(async () => {
      const name = (await caches.keys()).find((key) => key.startsWith('peercompute-app-shell:'));
      return name && !!await (await caches.open(name)).match(new URL('index.html', location.href).href);
    });
    const cdp = await context.newCDPSession(page);
    const manifest = await cdp.send('Page.getAppManifest');
    assert.deepEqual(manifest.errors, []); assert.ok(manifest.data.includes('PeerCompute Chat'));
    const installability = await cdp.send('Page.getInstallabilityErrors');
    assert.deepEqual(installability.installabilityErrors, []);
    const workers = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).map((registration) => ({ scope: registration.scope, script: registration.active.scriptURL })));
    assert.deepEqual(workers, [{ scope: origin, script: origin + 'pages-isolation-sw.js' }]);
    const cached = await page.evaluate(async () => {
      const names = await caches.keys();
      return (await Promise.all(names.map(async (name) => (await (await caches.open(name)).keys()).map((request) => request.url)))).flat();
    });
    assert.ok(cached.every((url) => /\/(?:index\.html|manifest\.webmanifest|assets\/[\w.-]+\.js|icons\/[\w.-]+\.png)$/.test(url)));
    // A new shell worker must wait, preserving a resident session's open page.
    files.set('pages-isolation-sw.js', files.get('pages-isolation-sw.js') + '\n// owned update probe\n');
    await page.evaluate(async () => {
      window.sessionSentinel = 'resident-session';
      await (await navigator.serviceWorker.getRegistration()).update();
    });
    await page.waitForFunction(async () => (await navigator.serviceWorker.getRegistration())?.waiting?.state === 'installed');
    assert.equal(await page.evaluate(() => window.sessionSentinel), 'resident-session');
    const before = requests.length;
    await context.setOffline(true); await page.reload();
    await page.waitForFunction(() => crossOriginIsolated && document.querySelector('#status')?.textContent === 'Offline shell ready');
    assert.equal(requests.length, before); assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    if (server) await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  }
});
