import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { importModelPackage, modelStorageError, listStoredModelRecords } from '../../../demos/inference/src/modelLibrary.js';
import { sha1 } from '@noble/hashes/legacy.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const model = { runtime: 'transformers.js', repository: 'test/library', revision: 'a'.repeat(40) };
const entry = (name, bytes) => ({ schema: 'peercompute.artifact.manifest.v1', name, model,
  files: [{ path: 'weights.bin', size: bytes.length }] });

test('package progress is throttled, ordered, and finishes files before manifest verification without changing CIDs', async (t) => {
  const store = new ArtifactStore({ persistent: false, capacity: 'browser' }); await store.open();
  let at = 0;
  t.mock.method(performance, 'now', () => at);
  const weights = new Uint8Array(12 * 1024).map((_, index) => index % 251);
  const license = new TextEncoder().encode('Fixture license');
  const source = { schema: 'peercompute.artifact.manifest.v1', name: 'Progress fixture', model, files: [
    { path: 'weights.bin', size: weights.length, sha256: bytesToHex(sha256(weights)) },
    { path: 'LICENSE', size: license.length, gitBlobSha1: bytesToHex(sha1.create()
      .update(new TextEncoder().encode(`blob ${license.length}\0`)).update(license).digest()) },
  ] };
  const events = [];
  const originalManifest = store.importManifest.bind(store);
  store.importManifest = async (...args) => {
    assert.equal(events.at(-1).stage, 'verify');
    return originalManifest(...args);
  };
  const fetchImpl = async (url) => ({ ok: true, body: (async function* () {
    const bytes = url === 'weights.bin' ? weights : license;
    for (let offset = 0; offset < bytes.length; offset += 1024) {
      at += 25; yield bytes.subarray(offset, offset + 1024);
    }
  })() });
  try {
    const result = await importModelPackage(store, source, (path) => path, { fetchImpl,
      onProgress(event) { events.push({ ...event }); } });
    const weightEvents = events.filter((event) => event.path === 'weights.bin');
    assert.deepEqual(weightEvents.map((event) => event.loaded), [0, 4096, 8192, 12288]);
    assert(weightEvents.every((event) => event.index === 0 && event.total === 2 && event.totalBytes === weights.length));
    assert.deepEqual(events.filter((event) => event.path === 'LICENSE').map((event) => event.loaded), [0, license.length]);
    assert.deepEqual(events.at(-1), { stage: 'verify', total: 2, totalBytes: weights.length + license.length });
    assert.equal(result.pinned, true);
    assert.deepEqual(Object.fromEntries(result.manifest.files.map((file) => [file.path, file.sha256])),
      { 'weights.bin': bytesToHex(sha256(weights)), LICENSE: bytesToHex(sha256(license)) });
    events.length = 0;
    const cached = await importModelPackage(store, result.manifest, () => { throw new Error('Cached file must not download'); }, {
      onProgress(event) { events.push({ ...event }); },
    });
    assert.equal(cached.cid, result.cid);
    assert.deepEqual(cached.manifest, result.manifest);
    assert.deepEqual(events.map((event) => event.stage), ['import', 'import', 'import', 'import', 'verify']);
  } finally { await store.destroy(); }
});

test('failed integrity checks never report a verified file and cancelling verification leaves no manifest', async () => {
  const store = new ArtifactStore({ persistent: false, capacity: 'browser' }); await store.open();
  const bytes = new TextEncoder().encode('Benign model fixture');
  try {
    for (const metadata of [{ sha256: '0'.repeat(64) }, { gitBlobSha1: '0'.repeat(40) }]) {
      const events = [], spec = entry('Corrupt', bytes); Object.assign(spec.files[0], metadata);
      await assert.rejects(importModelPackage(store, spec, () => 'fixture', {
        fetchImpl: async () => new Response(bytes), onProgress(event) { events.push(event); },
      }), /mismatch|does not match/i);
      assert.deepEqual(events.map((event) => event.loaded), [0]);
      assert.equal((await listStoredModelRecords(store)).length, 0);
    }
    const controller = new AbortController(), events = [];
    await assert.rejects(importModelPackage(store, entry('Cancelled', bytes), () => 'fixture', {
      signal: controller.signal, fetchImpl: async () => new Response(bytes),
      onProgress(event) { events.push(event); if (event.stage === 'verify') controller.abort(new DOMException('Cancelled', 'AbortError')); },
    }), { name: 'AbortError' });
    assert.equal(events.at(-1).stage, 'verify');
    assert.equal((await listStoredModelRecords(store)).length, 0);
  } finally { await store.destroy(); }
});

test('completed SHA256 files are reused without a CID and reverified before publishing', async () => {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const bytes = new TextEncoder().encode('Completed weights from an interrupted package');
  const spec = entry('Reuse', bytes); spec.files[0].sha256 = bytesToHex(sha256(bytes));
  try {
    const file = await store.importFile(bytes, { expectedSha256: spec.files[0].sha256, pin: false });
    const progress = [];
    const result = await importModelPackage(store, spec, () => { throw new Error('No weight HTTP allowed'); }, {
      onProgress: (event) => progress.push(event),
    });
    assert.equal(result.manifest.files[0].cid, file.cid);
    assert(progress.some((event) => event.reused && event.loaded === bytes.length));
    // A durable descriptor alone does not bypass verification of the actual bytes.
    await store.backend.delete('blocks', file.cid);
    await store.backend.put('blocks', file.cid, new Uint8Array(bytes.length));
    await assert.rejects(importModelPackage(store, { ...spec, name: 'Corrupt retained bytes' }, () => {
      throw new Error('The retained file should be verified locally');
    }), /mismatch|verification|CID|SHA-256/i);
    assert.equal((await listStoredModelRecords(store)).length, 1);
  } finally { await store.destroy(); }
});

test('SHA256 reuse rejects mismatched sizes, digests and partial descriptors', async (t) => {
  const bytes = new TextEncoder().encode('Immutable bounded weight fixture');
  for (const mutation of [{ size: bytes.length + 1 }, { sha256: '0'.repeat(64) }, { status: 'partial' }]) {
    await t.test(JSON.stringify(mutation), async () => {
      const store = new ArtifactStore({ persistent: false }); await store.open();
      try {
        const file = await store.importFile(bytes, { pin: false });
        await store.backend.put('roots', file.cid, { ...file, ...mutation });
        const spec = entry('Fresh verified file', bytes); spec.files[0].sha256 = bytesToHex(sha256(bytes));
        let fetches = 0;
        const result = await importModelPackage(store, spec, () => 'fixture', {
          fetchImpl: async () => { fetches++; return new Response(bytes); },
        });
        assert.equal(fetches, 1); assert.equal(result.status, 'complete');
      } finally { await store.destroy(); }
    });
  }
});

test('candidate reuse is rechecked after GC and cancellation releases retention without a manifest', async () => {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const bytes = new TextEncoder().encode('Candidate swept before acquiring retention');
  const spec = entry('GC race', bytes); spec.files[0].sha256 = bytesToHex(sha256(bytes));
  try {
    const file = await store.importFile(bytes, { pin: false });
    const originalRetention = store.withRetention.bind(store);
    store.withRetention = async (...args) => {
      await store.gc(); assert.equal(await store.stat(file.cid), undefined);
      return originalRetention(...args);
    };
    let fetches = 0;
    const result = await importModelPackage(store, spec, () => 'fixture', {
      fetchImpl: async () => { fetches++; return new Response(bytes); },
    });
    assert.equal(fetches, 1); assert.equal(result.status, 'complete');
    store.withRetention = originalRetention;
    const controller = new AbortController();
    await assert.rejects(importModelPackage(store, { ...spec, name: 'Cancelled reuse' }, () => {
      throw new Error('Cancelled cache hit must not fetch');
    }, { signal: controller.signal, onProgress: () => controller.abort() }), { name: 'AbortError' });
    assert.equal(store.getStats().pending, 0);
    await store.gc(); assert.equal((await store.stat(result.cid)).pinned, true);
    assert.equal((await listStoredModelRecords(store)).length, 1);
  } finally { await store.destroy(); }
});

test('library listing exposes retained partial manifests and reports invalid recovery metadata', async () => {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  try {
    const bytes = new TextEncoder().encode('Retained package needing local recovery');
    const complete = await importModelPackage(store, entry('Recovery', bytes), () => 'fixture', {
      fetchImpl: async () => new Response(bytes),
    });
    const partial = { ...complete, status: 'partial', pinned: true, retain: true };
    await store.backend.put('roots', complete.cid, partial);
    assert.deepEqual(await listStoredModelRecords(store), [partial]);
    await store.backend.put('roots', complete.cid, { ...partial, pinned: false, retain: false });
    assert.deepEqual(await listStoredModelRecords(store), []);
    await store.backend.put('roots', complete.cid, { ...partial, manifest: { ...partial.manifest,
      files: [{ ...partial.manifest.files[0], path: '../bad' }] } });
    await assert.rejects(listStoredModelRecords(store), (error) =>
      error.message.includes(complete.cid) && /invalid recovery metadata/.test(error.message) && !!error.cause);
  } finally { await store.destroy(); }
});

test('package import preserves the original storage failure and leaves another pinned model intact', async () => {
  const store = new ArtifactStore({ persistent: false, capacity: 'browser' }); await store.open();
  try {
    const bytes = new TextEncoder().encode('retained model');
    const first = await importModelPackage(store, entry('Keep', bytes), () => 'fixture', {
      fetchImpl: async () => new Response(bytes),
    });
    const original = store.backend.put.bind(store.backend);
    const quota = new DOMException('Injected write failure', 'QuotaExceededError');
    store.backend.put = async (collection, ...args) => { if (collection === 'blocks') throw quota; return original(collection, ...args); };
    await assert.rejects(importModelPackage(store, entry('Fail', bytes), () => 'fixture', {
      fetchImpl: async () => new Response(bytes),
    }), (error) => error.code === 'ERR_MODEL_STORAGE_FULL' && error.cause === quota && modelStorageError(error) === error);
    assert.equal((await store.stat(first.cid)).pinned, true);
    assert.equal((await listStoredModelRecords(store)).length, 1);
    store.backend.put = original;
    const second = await importModelPackage(store, entry('Retry', bytes), () => 'fixture', {
      fetchImpl: async () => new Response(bytes),
    });
    await store.remove(second.cid);
    assert.equal((await store.stat(first.cid)).pinned, true);
  } finally { await store.destroy(); }
});

test('real IndexedDB ignores low storage estimates, handles a failed native write and retries safe deletion', { timeout: 60_000 }, async () => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-library-runtime-'));
  let browser, server;
  try {
    await writeFile(path.join(temporary, 'index.html'), '<script type="module" src="/fixture.js"></script>');
    await writeFile(path.join(temporary, 'fixture.js'), `
      import { ArtifactStore } from ${JSON.stringify(path.join(repo, 'peercompute/src/peercompute/artifacts/ArtifactStore.js'))};
      import { importModelPackage, listStoredModelRecords, withModelDeletionOwnership } from ${JSON.stringify(path.join(repo, 'demos/inference/src/modelLibrary.js'))};
      import { MODEL_ARTIFACT_CATALOG } from ${JSON.stringify(path.join(repo, 'peercompute/src/peercompute/artifacts/modelArtifactCatalog.js'))};
      window.runLibraryCheck = async () => {
        const store = new ArtifactStore({ name: 'isolated-library-' + crypto.randomUUID(), capacity: 'browser' });
        await store.open();
        let estimates = 0;
        Object.defineProperty(navigator.storage, 'estimate', { configurable: true, value: async () => {
          estimates++; return { usage: 0, quota: 10 * 1024 ** 3 };
        }});
        const large = MODEL_ARTIFACT_CATALOG['qwen3.8-27b-georefine-d14-gguf'];
        let fetches = 0, largeError;
        const model = { runtime: 'transformers.js', repository: 'test/library', revision: 'a'.repeat(40) };
        const bytes = new TextEncoder().encode('isolated model bytes');
        const spec = (name) => ({ schema:'peercompute.artifact.manifest.v1', name, model,
          files:[{path:'weights.bin',size:bytes.length}] });
        let nativeError, wrapped, releaseUse, releaseNetwork, other;
        const originalPut = IDBObjectStore.prototype.put;
        try {
          try { await importModelPackage(store, large, () => '/blocked-model-source', {
            fetchImpl: async () => { fetches++; return new Response('', {status:418}); }
          }); } catch(error) { largeError = error.message; }
          Object.defineProperty(navigator.storage, 'estimate', { configurable: true, value: async () => {
            estimates++; return { usage: 100, quota: 100 };
          }});
          const kept = await importModelPackage(store, spec('Keep'), () => 'fixture', { fetchImpl: async () => new Response(bytes) });
          IDBObjectStore.prototype.put = function(...args) {
            if (this.name === 'blocks') { nativeError = new DOMException('Injected IndexedDB quota failure', 'QuotaExceededError'); throw nativeError; }
            return originalPut.apply(this,args);
          };
          try { await importModelPackage(store, spec('Fail'), () => 'fixture', { fetchImpl: async () => new Response(new Uint8Array(bytes.length).fill(7)) }); }
          catch(error) { wrapped = { code:error.code, directCause:error.cause===nativeError, name:error.cause?.name }; }
          finally { IDBObjectStore.prototype.put = originalPut; }
          const retry = await importModelPackage(store, spec('Retry'), () => 'fixture', { fetchImpl: async () => new Response(bytes) });
          other = new ArtifactStore({ name: store.name, capacity: 'browser' }); await other.open();
          const caller = new AbortController();
          releaseUse = await store.acquireUse(retry.cid, { signal: caller.signal }); caller.abort();
          let busyError;
          try { await other.remove(retry.cid, { useWaitMs: 25 }); } catch(error) { busyError = error.code; }
          await releaseUse(); releaseUse = null;
          let ownerReady;
          const ready = new Promise(resolve => { ownerReady = resolve; });
          const held = new Promise(resolve => { releaseNetwork = resolve; });
          const networkOwner = navigator.locks.request(store.lockName + ':network-owner', async()=>{ ownerReady(); await held; });
          await ready;
          let ownerError, deletionCalled = false;
          try { await withModelDeletionOwnership({store}, async()=>{deletionCalled=true;}); }
          catch(error) { ownerError=error.message; }
          releaseNetwork(); await networkOwner; releaseNetwork=null;
          const removal = await withModelDeletionOwnership({store}, ()=>store.remove(retry.cid));
          const keptRecord = await store.stat(kept.cid);
          const records = await listStoredModelRecords(store);
          return { persistent:store.persistent, limits:store.getStats(), estimates, fetches, largeBytes:large.totalBytes,
            largeError, wrapped, removal, busyError, ownerError, deletionCalled, keptPinned:keptRecord.pinned, count:records.length };
        } finally { IDBObjectStore.prototype.put = originalPut; releaseNetwork?.(); await releaseUse?.(); await other?.destroy(); await store.destroy(); }
      };`);
    const dist = path.join(temporary, 'dist');
    await build({ configFile: false, root: temporary, logLevel: 'silent', build: { target: 'esnext', outDir: dist } });
    server = createServer(async (request, response) => {
      try {
        const filename = path.join(dist, new URL(request.url, 'http://localhost').pathname === '/' ? 'index.html'
          : new URL(request.url, 'http://localhost').pathname.slice(1));
        response.setHeader('Content-Type', filename.endsWith('.js') ? 'text/javascript' : 'text/html');
        response.end(await readFile(filename));
      } catch { response.writeHead(404); response.end(); }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
      args: ['--disable-gpu', '--disable-software-rasterizer'] });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForFunction(() => window.runLibraryCheck);
    const result = await page.evaluate(() => window.runLibraryCheck());
    assert.equal(result.persistent, true); assert.equal(result.estimates, 0);
    assert(result.largeBytes > 13 * 1024 ** 3); assert.equal(result.fetches, 1); assert.match(result.largeError, /418/);
    assert.deepEqual(result.wrapped, { code: 'ERR_MODEL_STORAGE_FULL', directCause: true, name: 'QuotaExceededError' });
    assert.equal(result.limits.maximumBytes, Number.MAX_SAFE_INTEGER);
    assert.equal(result.limits.maximumStoredBlocks, Number.MAX_SAFE_INTEGER);
    assert.equal(result.keptPinned, true); assert.equal(result.count, 1);
    assert.equal(result.busyError, 'ERR_ARTIFACT_IN_USE');
    assert.match(result.ownerError, /Another tab owns file sharing/); assert.equal(result.deletionCalled, false);
    assert.equal(result.removal.removed, true); assert(result.removal.freedBytes > 0);
  } finally {
    await browser?.close();
    if (server) await new Promise((resolve) => server.close(resolve));
    await rm(temporary, { recursive: true, force: true });
  }
});
