import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { build } from 'vite';
import { chromium } from 'playwright';

// Real IndexedDB and SHA/CID validation; inference below is explicitly a fake.
// Seed the legacy partial catalog state directly, never change a user's database.
const repo = fileURLToPath(new URL('../../../', import.meta.url));
let temporary, server, browser, origin;
const sockets = new Set();

function installFixture() {
  const model = { runtime: 'transformers.js', repository: 'fixture/retained', revision: 'a'.repeat(40),
    task: 'text-generation', architecture: 'qwen3', dtype: 'q4', modalities: ['text'] };
  window.seedRetention = async (name, fault, remember) => {
    const store = new ArtifactStore({ name, capacity: 'browser' }); await store.open();
    try {
      const bytes = Uint8Array.from({ length: 1024 * 1024 + 137 }, (_, i) => (i * 31 + (i >>> 15)) % 251);
      const file = await store.importFile(bytes, { pin: false });
      const config = await store.importFile(new TextEncoder().encode('{"model_type":"qwen3"}'), { pin: false });
      const kept = await store.importFile(new TextEncoder().encode('unrelated pinned data'), { pin: true });
      const record = await store.importManifest({ schema: 'peercompute.artifact.manifest.v1', name: 'Retained test package', model,
        files: [{ path: 'weights.bin', cid: file.cid, size: file.size, sha256: file.sha256 },
          { path: 'config.json', cid: config.cid, size: config.size, sha256: config.sha256 }] }, { pin: true });
      const saved = await store.stat(record.cid);
      // An older release wrote this transient state before a tab navigated away.
      await store.backend.put('roots', record.cid, { ...saved, status: 'partial', pinned: true, retain: true });
      if (fault === 'missing' || fault === 'corrupt') {
        const block = await store.backend.get('blocks', file.cid);
        await store.backend.delete('blocks', file.cid);
        if (fault === 'corrupt') { block[0] ^= 1; await store.backend.put('blocks', file.cid, block); }
      }
      const preferences = createModelPreferences({ storeName: store.lockName });
      if (remember) await preferences.rememberLoaded({ manifestCid: record.cid, modelId: 'fixture' });
      return { cid: record.cid, fileCid: file.cid, sha256: file.sha256, size: file.size,
        keptCid: kept.cid, manifest: record.manifest, storeName: store.name };
    } finally { await store.destroy(); }
  };
  window.openRetention = async (name, metadata) => {
    const store = new ArtifactStore({ name, capacity: 'browser' }); await store.open();
    let status = { status: 'idle' };
    const calls = [], progress = [], preferences = createModelPreferences({ storeName: store.lockName });
    const runtime = { store, networkReady: false,
      service: { getStatus: () => status, async unloadModel() { status = { status: 'idle' }; } },
      async load(cid) { calls.push('fake-load'); status = { status: 'ready', manifestCid: cid }; return { fake: true }; },
      async importCatalog() { calls.push('FORBIDDEN-import'); throw new Error('Unexpected download'); },
      async ensure() { calls.push('FORBIDDEN-peer-fetch'); throw new Error('Unexpected peer fetch'); },
      async dispose() { await store.destroy(); },
    };
    const entry = { id: 'fixture', name: metadata.manifest.name, model, files: metadata.manifest.files,
      totalBytes: metadata.manifest.files.reduce((sum, file) => sum + file.size, 0) };
    const controller = attachModelRuntimeController(runtime, { catalog: { fixture: entry }, preferences });
    await controller.initialize();
    window.retention = { runtime, store, calls, progress, preferences, metadata };
    return { rows: await runtime.listStoredModels(), startup: runtime.getStartupModel(), preferred: preferences.readLastLoaded() };
  };
  window.recoverRetention = async (cancel) => {
    const { runtime, store, calls, progress, preferences, metadata } = window.retention;
    const controller = new AbortController(); let error, result;
    try {
      result = await runtime.recoverStoredModel(metadata.cid, { signal: controller.signal, onProgress(event) {
        progress.push(event);
        if (cancel && event.loaded > 0) controller.abort(new DOMException('Cancelled local verification', 'AbortError'));
      } });
    } catch (failure) { error = { name: failure.name, message: failure.message }; }
    return { result, error, rows: await runtime.listStoredModels(), startup: runtime.getStartupModel(),
      preferred: preferences.readLastLoaded(), calls, progress, stats: store.getStats(),
      record: await store.stat(metadata.cid), kept: await store.stat(metadata.keptCid) };
  };
}

before(async () => {
  temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-retention-browser-'));
  const source = [
    ['ArtifactStore', 'peercompute/src/peercompute/artifacts/ArtifactStore.js'],
    ['attachModelRuntimeController', 'demos/inference/src/modelRuntimeController.js'],
    ['createModelPreferences', 'demos/inference/src/modelPreferences.js'],
  ].map(([name, file]) => `import { ${name} } from ${JSON.stringify(path.join(repo, file))};`).join('\n');
  await writeFile(path.join(temporary, 'fixture.js'), `${source}\n(${installFixture})();`);
  await writeFile(path.join(temporary, 'index.html'), '<!doctype html><link rel="icon" href="data:,"><script type="module" src="/fixture.js"></script>');
  const dist = path.join(temporary, 'dist');
  await build({ configFile: false, root: temporary, logLevel: 'silent', build: { target: 'esnext', outDir: dist } });
  server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://fixture.invalid').pathname;
      const filename = path.join(dist, pathname === '/' ? 'index.html' : pathname.slice(1));
      response.setHeader('Content-Type', filename.endsWith('.js') ? 'text/javascript' : 'text/html');
      response.setHeader('Cache-Control', 'no-store'); response.end(await readFile(filename));
    } catch { response.writeHead(404); response.end(); }
  });
  server.on('connection', (socket) => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: true, args: ['--disable-gpu', '--disable-software-rasterizer'] });
});
after(async () => {
  await browser?.close(); for (const socket of sockets) socket.destroy();
  if (server) await new Promise((resolve) => server.close(resolve));
  if (temporary) await rm(temporary, { recursive: true, force: true });
});

async function fixture(t, { fault, remember = true } = {}) {
  const context = await browser.newContext(), page = await context.newPage();
  const errors = [], fetched = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => { if (['fetch', 'xhr'].includes(request.resourceType())) fetched.push(new URL(request.url()).pathname); });
  await context.route('https://**/*', (route) => { fetched.push('external'); return route.abort(); });
  t.after(async () => {
    await page.evaluate(() => window.retention?.runtime.dispose()).catch(() => {});
    await context.close(); assert.deepEqual(errors, []); assert.deepEqual(fetched, [], 'No model or peer fetch is permitted');
  });
  await page.goto(origin); await page.waitForFunction(() => window.seedRetention);
  const name = `retention-${crypto.randomUUID()}`;
  const metadata = await page.evaluate(({ name, fault, remember }) => seedRetention(name, fault, remember), { name, fault, remember });
  await page.reload(); await page.waitForFunction(() => window.openRetention);
  const opened = await page.evaluate(({ name, metadata }) => openRetention(name, metadata), { name, metadata });
  assert.equal(opened.rows.length, 1); assert.equal(opened.rows[0].needsVerification, true);
  assert.equal(opened.startup.manifestCid, metadata.cid); assert.equal(opened.startup.needsVerification, true);
  assert.equal(opened.preferred?.manifestCid ?? null, remember ? metadata.cid : null);
  const blocked = await page.evaluate(async () => {
    try { await retention.runtime.acquireModel('hf:fixture'); } catch (error) { return error.code; }
  });
  assert.equal(blocked, 'ERR_MODEL_VERIFICATION_REQUIRED');
  return { context, page, name, metadata };
}

test('native IndexedDB reopen preserves partial package and verifies the same CID locally without HTTP', { timeout: 60000 }, async (t) => {
  const { page, name, metadata } = await fixture(t);
  const verified = await page.evaluate(() => recoverRetention(false));
  assert.equal(verified.error, undefined); assert.equal(verified.result.manifestCid, metadata.cid);
  assert.equal(verified.record.status, 'complete'); assert.equal(verified.rows[0].needsVerification, undefined);
  assert.equal(verified.kept.pinned, true); assert.equal(verified.stats.pending, 0); assert.deepEqual(verified.calls, []);
  assert(verified.progress.some((event) => event.loaded > 0));
  assert(verified.progress.every((event, i, all) => !i || event.loaded >= all[i - 1].loaded));
  const hash = await page.evaluate(async () => {
    const chunks = []; for await (const bytes of retention.store.openRead(retention.metadata.fileCid)) chunks.push(bytes);
    const buffer = new Uint8Array(retention.metadata.size); let offset = 0;
    for (const bytes of chunks) { buffer.set(bytes, offset); offset += bytes.length; }
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))].map((v) => v.toString(16).padStart(2, '0')).join('');
  });
  assert.equal(hash, metadata.sha256);
  await page.evaluate(() => retention.runtime.dispose()); await page.reload(); await page.waitForFunction(() => window.openRetention);
  const reopened = await page.evaluate(({ name, metadata }) => openRetention(name, metadata), { name, metadata });
  assert.equal(reopened.rows[0].needsVerification, undefined); assert.equal(reopened.preferred.manifestCid, metadata.cid);
  const calls = await page.evaluate(async () => { await retention.runtime.loadStoredModel(retention.metadata.cid); return retention.calls; });
  assert.deepEqual(calls, ['fake-load']); assert.equal(page.workers().length, 0);
});

test('native IndexedDB recovery cancellation and missing/corrupt blocks stay visible without default download', { timeout: 60000 }, async (t) => {
  for (const fault of ['missing', 'corrupt', 'cancel']) await t.test(fault, async (subtest) => {
    const { page, metadata } = await fixture(subtest, { fault, remember: fault !== 'missing' });
    const result = await page.evaluate((cancel) => recoverRetention(cancel), fault === 'cancel');
    assert(result.error); assert.equal(result.record.status, 'partial'); assert.equal(result.record.pinned, true);
    assert.equal(result.rows[0].needsVerification, true); assert.equal(result.startup.manifestCid, metadata.cid);
    assert.equal(result.kept.pinned, true); assert.equal(result.stats.pending, 0); assert.deepEqual(result.calls, []);
    if (fault === 'cancel') assert.equal(result.error.name, 'AbortError');
    else assert.match(result.error.message, /No files were downloaded/);
  });
});
