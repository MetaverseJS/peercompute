import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { build } from 'vite';
import { ensurePagesIsolation, startPagesDemo } from '../shared/pagesIsolation.js';
import { createIsolationFetchHandler } from '../shared/pagesIsolationWorker.js';
import { pagesIsolationPlugin } from '../shared/pagesIsolationPlugin.mjs';

function fixture() {
  const values = new Map(), registrations = [], reloads = [];
  const serviceWorker = new EventTarget();
  serviceWorker.controller = null;
  serviceWorker.register = async (url, options) => {
    registrations.push({ url, options });
    serviceWorker.controller = { scriptURL: url };
    serviceWorker.dispatchEvent(new Event('controllerchange'));
    return { active: serviceWorker.controller };
  };
  const scope = { crossOriginIsolated: false, isSecureContext: true,
    navigator: { serviceWorker },
    location: { href: 'http://localhost:43900/peercompute/inference/?room=test#chat',
      reload() { reloads.push(scope.location.href); } },
    sessionStorage: { getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value) },
  };
  return { scope, values, registrations, reloads, serviceWorker };
}

test('cold bootstrap scopes the module worker per demo and reloads the unchanged URL once', async () => {
  for (const demo of ['inference', 'cubechat', 'earth']) {
    const f = fixture();
    f.scope.location.href = `http://localhost:43900/peercompute/${demo}/?room=test#chat`;
    let starts = 0;
    await startPagesDemo(() => { starts += 1; }, { scope: f.scope });
    assert.equal(starts, 0);
    assert.deepEqual(f.reloads, [f.scope.location.href]);
    assert.deepEqual(f.registrations, [{ url: `http://localhost:43900/peercompute/${demo}/pages-isolation-sw.js`,
      options: { scope: `http://localhost:43900/peercompute/${demo}/`, type: 'module', updateViaCache: 'none' } }]);
    // Simulate a browser that failed to isolate even after the requested reload.
    await startPagesDemo(() => { starts += 1; }, { scope: f.scope });
    assert.equal(starts, 1);
    assert.equal(f.reloads.length, 1);
    assert.equal(f.scope.__peercomputeIsolation.status, 'unavailable');
    assert.match(f.scope.__peercomputeIsolation.reason, /already attempted/);
  }
});

test('already isolated warm navigation starts the app without registration or reload', async () => {
  const f = fixture(); f.scope.crossOriginIsolated = true;
  let starts = 0;
  await startPagesDemo(() => { starts += 1; }, { scope: f.scope });
  assert.equal(starts, 1);
  assert.equal(f.scope.__peercomputeIsolation.status, 'isolated');
  assert.equal(f.registrations.length, 0);
  assert.equal(f.reloads.length, 0);
});

test('registration rejection, unavailable storage and unsupported contexts preserve app startup', async () => {
  for (const modify of [
    (f) => { f.serviceWorker.register = async () => { throw new Error('Registration refused'); }; },
    (f) => { f.scope.sessionStorage.getItem = () => { throw new Error('Storage unavailable'); }; },
    (f) => { f.scope.isSecureContext = false; },
    (f) => { f.scope.navigator.serviceWorker = undefined; },
    (f) => { f.serviceWorker.controller = { scriptURL: 'http://localhost:43900/unrelated.js' }; },
  ]) {
    const f = fixture(); modify(f);
    let starts = 0;
    await startPagesDemo(() => { starts += 1; }, { scope: f.scope });
    assert.equal(starts, 1);
    assert.equal(f.scope.__peercomputeIsolation.status, 'unavailable');
    assert.equal(f.reloads.length, 0);
  }
});

test('registration deadline starts the app and a late completion cannot reload it', async () => {
  const f = fixture(); let resolveRegistration, starts = 0;
  f.serviceWorker.register = () => new Promise((resolve) => { resolveRegistration = resolve; });
  await startPagesDemo(() => { starts += 1; }, { scope: f.scope, timeoutMs: 10 });
  assert.equal(starts, 1);
  assert.match(f.scope.__peercomputeIsolation.reason, /timed out/);
  resolveRegistration({ active: {} });
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(f.reloads.length, 0);
  assert.equal(starts, 1);
});

test('controller timeout removes listeners and does not reload on a later claim', async () => {
  const f = fixture(); let listeners = 0;
  const add = f.serviceWorker.addEventListener.bind(f.serviceWorker);
  const remove = f.serviceWorker.removeEventListener.bind(f.serviceWorker);
  f.serviceWorker.addEventListener = (...args) => { listeners += 1; add(...args); };
  f.serviceWorker.removeEventListener = (...args) => { listeners -= 1; remove(...args); };
  f.serviceWorker.register = async () => ({ active: {} });
  const result = await ensurePagesIsolation({ scope: f.scope, timeoutMs: 10 });
  assert.equal(result.status, 'unavailable');
  assert.equal(listeners, 0);
  f.serviceWorker.controller = { scriptURL: 'http://localhost:43900/peercompute/inference/pages-isolation-sw.js' };
  f.serviceWorker.dispatchEvent(new Event('controllerchange'));
  assert.equal(f.reloads.length, 0);
});

test('header shim preserves streamed ranges, MIME, errors and original requests', async () => {
  const request = new Request('https://example.test/peercompute/inference/assets/engine.wasm',
    { headers: { Range: 'bytes=20-23' } });
  const source = new Response(new Uint8Array([1, 2, 3, 4]), { status: 206,
    headers: { 'Content-Type': 'application/wasm', 'Content-Range': 'bytes 20-23/100', ETag: 'pinned' } });
  let seen;
  const handle = createIsolationFetchHandler({ scopeUrl: 'https://example.test/peercompute/inference/',
    fetchImpl: async (value) => { seen = value; return source; } });
  const response = await handle(request);
  assert.equal(seen, request);
  assert.equal(response.status, 206);
  assert.equal(response.body, source.body);
  assert.equal(response.headers.get('Content-Range'), 'bytes 20-23/100');
  assert.equal(response.headers.get('Content-Type'), 'application/wasm');
  assert.equal(response.headers.get('ETag'), 'pinned');
  assert.equal(response.headers.get('Cross-Origin-Opener-Policy'), 'same-origin');
  assert.equal(response.headers.get('Cross-Origin-Embedder-Policy'), 'credentialless');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), new Uint8Array([1, 2, 3, 4]));
  const missing = createIsolationFetchHandler({ scopeUrl: 'https://example.test/peercompute/inference/',
    fetchImpl: async () => new Response('missing', { status: 404 }) });
  assert.equal((await missing(request)).status, 404);
  const broken = createIsolationFetchHandler({ scopeUrl: 'https://example.test/peercompute/inference/',
    fetchImpl: async () => { throw new Error('offline'); } });
  await assert.rejects(broken(request), /offline/);
});

test('worker never intercepts neighboring scopes, cross-origin weights or mutation requests', () => {
  const handle = createIsolationFetchHandler({ scopeUrl: 'https://example.test/peercompute/inference/',
    fetchImpl: () => { throw new Error('Unexpected fetch'); } });
  for (const request of [
    new Request('https://example.test/peercompute/cubechat/'),
    new Request('https://example.test/peercompute/inference-elsewhere/'),
    new Request('https://huggingface.co/repository/resolve/revision/model.onnx'),
    new Request('https://example.test/peercompute/inference/send', { method: 'POST', body: 'private' }),
  ]) assert.equal(handle(request), undefined);
});

test('Vite emits a relative entry and unbundled scoped worker without changing app code', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'peercompute-pages-isolation-'));
  try {
    await writeFile(path.join(root, 'index.html'), '<html><body><script type="module" src="./main.js"></script></body></html>');
    await writeFile(path.join(root, 'main.js'), 'globalThis.demoReady = true;');
    const result = await build({ configFile: false, root, base: './', logLevel: 'silent',
      plugins: [pagesIsolationPlugin()], build: { write: false, minify: false } });
    const output = result.output;
    const html = output.find((asset) => asset.fileName === 'index.html').source;
    assert.match(html, /src="\.\/assets\//);
    const worker = output.find((asset) => asset.fileName === 'pages-isolation-sw.js');
    assert.ok(worker && worker.source.includes('Cross-Origin-Embedder-Policy'));
    const entry = output.find((asset) => asset.type === 'chunk' && asset.isEntry);
    assert.match(entry.code, /startPagesDemo/);
    assert.ok(entry.dynamicImports.length > 0);
    assert.ok(!entry.code.includes('globalThis.demoReady = true'));
  } finally { await rm(root, { recursive: true, force: true }); }
});
