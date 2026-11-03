import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { mkdtemp, rm, mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import * as dagPb from '@ipld/dag-pb';
import { UnixFS } from 'ipfs-unixfs';
import { Key } from 'interface-datastore';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { ArtifactStore, ARTIFACT_IMPORT_PROFILE } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { MemoryArtifactBackend, IndexedDBArtifactBackend } from '../../src/peercompute/artifacts/ArtifactBackends.js';
import { ARTIFACT_MANIFEST_SCHEMA, normalizeArtifactManifest, encodeArtifactManifest } from '../../src/peercompute/artifacts/ArtifactManifest.js';
import { FileSystemArtifactBackend } from '../../src/peercompute/artifacts/node/FileSystemArtifactBackend.js';
import { importArtifactPackage, prefetchArtifactModelSources, IMPORT_MODEL_CATALOG } from '../../../scripts/import-ipfs-artifact.mjs';
import { MODEL_ARTIFACT_CATALOG, modelArtifactFileUrl } from '../../src/peercompute/artifacts/modelArtifactCatalog.js';

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
function createStore(t, options = {}) {
  const store = new ArtifactStore({ name: `test-${Math.random().toString(16).slice(2)}`, persistent: false, ...options });
  t.after(() => store.destroy());
  return store;
}
function fixture(size = ARTIFACT_IMPORT_PROFILE.chunkSize * 2 + 73) {
  const bytes = new Uint8Array(size);
  // Different leaves exercise shared and nonshared DAG branches.
  for (let i = 0; i < size; i++) bytes[i] = (i * 29 + Math.floor(i / 65537)) % 256;
  return bytes;
}
async function collect(source) {
  const buffers = [];
  for await (const bytes of source) buffers.push(Buffer.from(bytes));
  return Buffer.concat(buffers);
}
async function* pieces(bytes, step = 27011) {
  for (let offset = 0; offset < bytes.length; offset += step) yield bytes.subarray(offset, offset + step);
}

test('real UnixFS imports are deterministic across chunk boundaries and support exact ranges', async (t) => {
  const store = createStore(t);
  const bytes = fixture();
  const first = await store.importFile(pieces(bytes), { expectedSize: bytes.length, expectedSha256: digest(bytes) });
  const second = await store.importFile(bytes);
  assert.equal(first.cid, second.cid);
  assert.equal(first.sha256, digest(bytes));
  assert.equal(first.size, bytes.length);
  assert.equal(CID.parse(first.cid).code, 0x70);
  assert.deepEqual(await collect(store.openRead(first.cid)), Buffer.from(bytes));
  const offset = ARTIFACT_IMPORT_PROFILE.chunkSize - 17;
  assert.deepEqual(await collect(store.openRead(first.cid, { offset, length: 77 })), Buffer.from(bytes.subarray(offset, offset + 77)));
  assert.equal((await collect(store.openRead(first.cid, { offset: bytes.length }))).length, 0);
  await assert.rejects(collect(store.openRead(first.cid, { offset: bytes.length + 1 })), /range/u);
  assert.equal(store.getStats().rootCount, 1);
  assert.equal(store.getStats().blockCount, 4);
});

test('raw and empty files have stable genuine SHA-256 CIDs', async (t) => {
  const store = createStore(t);
  const file = await store.importFile(new TextEncoder().encode('hello world'));
  assert.equal(file.cid, 'bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e');
  const empty = await store.importFile(new Uint8Array());
  assert.equal(empty.cid, CID.createV1(0x55, await sha256.digest(new Uint8Array())).toString());
  assert.equal((await collect(store.openRead(empty.cid))).length, 0);
});

test('guarded block facade verifies CID, accepts streaming puts, deduplicates and enforces quota', async (t) => {
  const store = createStore(t, { maximumBytes: 20 });
  const bytes = new Uint8Array(12).fill(7);
  const cid = CID.createV1(0x55, await sha256.digest(bytes));
  await store.getBlockstore().put(cid, pieces(bytes, 5));
  await store.getBlockstore().put(cid, bytes);
  assert.equal(store.getStats().storedBytes, 12);
  assert.equal(store.getStats().blockCount, 1);
  await assert.rejects(store.getBlockstore().put(cid, new Uint8Array(12)), /verification/u);
  const other = new Uint8Array(12).fill(8);
  await assert.rejects(store.getBlockstore().put(CID.createV1(0x55, await sha256.digest(other)), other), { name: 'QuotaExceededError' });
  assert.equal(store.getStats().storedBytes, 12);
  assert.deepEqual(await collect(store.getBlockstore().get(cid)), Buffer.from(bytes));
  const all = [];
  for await (const entry of store.getBlockstore().getAll()) all.push(await collect(entry.bytes));
  assert.deepEqual(all, [Buffer.from(bytes)]);
});

test('manifest pins retain the explicit file closure and shared blocks across GC', async (t) => {
  const store = createStore(t);
  const bytes = fixture();
  const file = await store.importFile(bytes, { pin: false });
  const manifest = { schema: ARTIFACT_MANIFEST_SCHEMA, files: [
    { path: 'onnx/model_q4.onnx', cid: file.cid, size: file.size, sha256: file.sha256 },
    { path: 'copies/shared.onnx', cid: file.cid, size: file.size }
  ], model: { task: 'image-text-to-text', modalities: ['image', 'text'], dtype: { vision: 'fp16', decoder: 'q4' } } };
  const imported = await store.importManifest(manifest);
  assert.deepEqual(imported.manifest, normalizeArtifactManifest(manifest));
  assert.equal((await store.gc()).deletedBlocks, 0);
  assert.deepEqual(await collect(store.openRead(file.cid)), Buffer.from(bytes));
  await store.pin(file.cid);
  await store.unpin(imported.cid);
  assert.equal((await store.gc()).deletedBlocks, 1);
  assert.deepEqual(await collect(store.openRead(file.cid)), Buffer.from(bytes));
  await store.unpin(file.cid);
  assert.equal((await store.gc()).deletedBlocks, 4);
  assert.equal(store.getStats().storedBytes, 0);
});

test('a paused read protects unpinned blocks until iterator return; cancellation releases protection', async (t) => {
  const store = createStore(t);
  const file = await store.importFile(fixture(), { pin: false });
  const stream = store.openRead(file.cid)[Symbol.asyncIterator]();
  await stream.next();
  let finished = false;
  const gc = store.gc().then((result) => { finished = true; return result; });
  await delay(15);
  assert.equal(finished, false);
  await stream.return();
  assert.equal((await gc).deletedBlocks, 4);

  const another = await store.importFile(fixture(), { pin: false });
  const abort = new AbortController();
  const paused = store.openRead(another.cid, { signal: abort.signal })[Symbol.asyncIterator]();
  await paused.next();
  abort.abort();
  await store.gc();
  await assert.rejects(paused.next(), { name: 'AbortError' });
});

test('known-CID download resumes from verified blocks after restart and reuses the pin journal', async (t) => {
  const source = createStore(t);
  const bytes = fixture();
  const file = await source.importFile(bytes);
  const backend = new MemoryArtifactBackend({ name: 'resume-test' });
  const first = createStore(t, { backend });
  let received = 0;
  await assert.rejects(first.ensureLocal(file.cid, { fetchBlock: async (cid) => {
    if (++received === 3) throw new Error('peer departed');
    return collect(source.getBlockstore().get(cid));
  } }), /peer departed/u);
  assert.equal((await first.stat(file.cid)).status, 'partial');
  assert.equal(first.getStats().blockCount, 2);
  await first.gc();
  assert.equal(first.getStats().blockCount, 2);
  await first.destroy();
  const second = createStore(t, { backend });
  const requested = [];
  const result = await second.ensureLocal(file.cid, { fetchBlock: async (cid) => {
    requested.push(cid.toString()); return collect(source.getBlockstore().get(cid));
  } });
  assert.equal(requested.length, 2);
  assert.equal(result.status, 'complete');
  assert.equal(result.sha256, digest(bytes));
});

test('manifest download fetches child roots and rejects mismatched provenance hashes', async (t) => {
  const source = createStore(t);
  const target = createStore(t);
  const file = await source.importFile(fixture());
  const root = await source.importManifest({ schema: ARTIFACT_MANIFEST_SCHEMA,
    files: [{ path: 'config.json', cid: file.cid, size: file.size, sha256: file.sha256 }] });
  const result = await target.ensureLocal(root.cid, { kind: 'manifest', fetchBlock: (cid) => collect(source.getBlockstore().get(cid)) });
  assert.equal(result.kind, 'manifest');
  assert.deepEqual(await target.getManifest(root.cid), root.manifest);
  assert.equal(target.getStats().blockCount, 5);
  await target.gc();
  assert.equal(target.getStats().blockCount, 5);
  const incorrect = { schema: ARTIFACT_MANIFEST_SCHEMA,
    files: [{ path: 'weights.bin', cid: file.cid, size: file.size, sha256: '0'.repeat(64) }] };
  await assert.rejects(target.importManifest(incorrect), /integrity/u);
});

test('bounded manifest schema accepts large models and rejects paths, unsupported hashes and oversized metadata', () => {
  const cid = 'bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e';
  const manifest = { schema: ARTIFACT_MANIFEST_SCHEMA, files: [{ path: 'onnx/model_q4.onnx', cid, size: 919096585 }] };
  assert.equal(normalizeArtifactManifest(manifest).files[0].size, 919096585);
  for (const path of ['../a', '/a', 'a//b', 'a\\b', '%2e%2e/x', 'a?x', 'https:x']) {
    assert.throws(() => normalizeArtifactManifest({ ...manifest, files: [{ ...manifest.files[0], path }] }), /paths/u);
  }
  assert.throws(() => encodeArtifactManifest({ ...manifest, model: { data: 'x'.repeat(300000) } }), /limit/u);
  assert.throws(() => normalizeArtifactManifest({ ...manifest, files: [...manifest.files, ...manifest.files] }), /paths/u);
});

test('failed imports leave no complete root and can reclaim orphan blocks', async (t) => {
  const store = createStore(t);
  await assert.rejects(store.importFile(fixture(), { expectedSha256: '0'.repeat(64) }), /SHA-256/u);
  assert.equal(store.getStats().rootCount, 0);
  assert.ok(store.getStats().blockCount > 0);
  await store.gc();
  assert.equal(store.getStats().blockCount, 0);
  await assert.rejects(store.importFile(new Uint8Array(7), { expectedSize: 6 }), /limit/u);
});

test('IndexedDB persists blocks, pins, routing data and atomic quota across reopen', async (t) => {
  const indexedDBImpl = new IDBFactory();
  const backend = () => new IndexedDBArtifactBackend({ name: 'persistent-test', indexedDBImpl, keyRange: IDBKeyRange });
  const first = createStore(t, { backend: backend(), ownsBackend: true });
  const file = await first.importFile(fixture());
  const key = new Key('/peercompute/identity');
  await first.getDatastore().put(key, new Uint8Array([1, 2, 3]));
  const before = first.getStats();
  await first.destroy();
  const second = createStore(t, { backend: backend(), ownsBackend: true });
  await second.open();
  assert.equal(second.getStats().storedBytes, before.storedBytes);
  assert.equal((await second.stat(file.cid)).pinned, true);
  assert.deepEqual(await second.getDatastore().get(key), new Uint8Array([1, 2, 3]));
  assert.equal((await second.gc()).deletedBlocks, 0);
  assert.deepEqual(await collect(second.openRead(file.cid)), Buffer.from(fixture()));
});

test('borrowed network lifecycle never closes physical storage; teardown drains and rejects new work', async (t) => {
  const backend = new MemoryArtifactBackend();
  let closes = 0;
  backend.close = async () => { closes++; };
  const store = createStore(t, { backend, ownsBackend: true });
  const file = await store.importFile(fixture());
  await store.getBlockstore().close(); await store.getBlockstore().stop();
  await store.getDatastore().close(); await store.getDatastore().stop();
  assert.equal(closes, 0);
  const reader = store.openRead(file.cid)[Symbol.asyncIterator]();
  await reader.next();
  await store.destroy();
  await store.destroy();
  assert.equal(closes, 1);
  await assert.rejects(reader.next(), { name: 'AbortError' });
  await assert.rejects(store.importFile(new Uint8Array()), /destroyed/u);
  const borrowed = createStore(t, { backend });
  await borrowed.open(); await borrowed.destroy();
  assert.equal(closes, 1);
});

test('datastore queries/batches remain isolated from artifact roots and bounds are enforced', async (t) => {
  const store = createStore(t);
  const data = store.getDatastore();
  const batch = data.batch();
  batch.put(new Key('/b'), new Uint8Array([2]));
  batch.put(new Key('/a'), new Uint8Array([1]));
  await batch.commit();
  const keys = [];
  for await (const key of data.queryKeys({ orders: [(a, b) => b.toString().localeCompare(a.toString())], limit: 1 })) keys.push(key.toString());
  assert.deepEqual(keys, ['/b']);
  assert.equal(store.getStats().blockCount, 0);
  assert.equal(store.getStats().rootCount, 0);
  await assert.rejects(data.put(new Key('/huge'), new Uint8Array(300000)), /limit/u);
  await data.delete(new Key('/a'));
  await assert.rejects(data.get(new Key('/a')), { name: 'NotFoundError' });
});

test('GC queued during a Helia-style fetch cannot deadlock the borrowed blockstore put', async (t) => {
  const source = createStore(t);
  const file = await source.importFile(new Uint8Array([4, 5, 6]));
  const target = createStore(t);
  let entered;
  const started = new Promise((resolve) => { entered = resolve; });
  let resume;
  const gate = new Promise((resolve) => { resume = resolve; });
  const transfer = target.ensureLocal(file.cid, { fetchBlock: async (cid) => {
    entered(); await gate;
    const bytes = await collect(source.getBlockstore().get(cid));
    await target.getBlockstore().put(cid, bytes);
    return bytes;
  } });
  await started;
  const gc = target.gc();
  resume();
  assert.equal((await transfer).status, 'complete');
  assert.equal((await gc).deletedBlocks, 0);
});

test('GC insertion generations preserve blocks arriving during its sweep', async (t) => {
  const backend = new MemoryArtifactBackend();
  const store = createStore(t, { backend });
  await store.importFile(new Uint8Array([1]), { pin: false });
  const bytes = new Uint8Array([9]);
  const cid = CID.createV1(0x55, await sha256.digest(bytes));
  const scan = backend.scan.bind(backend);
  let inserted = false;
  backend.scan = async (collection, options) => {
    if (collection === 'blocks' && !inserted) {
      inserted = true;
      await store.getBlockstore().put(cid, bytes);
    }
    return scan(collection, options);
  };
  assert.equal((await store.gc()).deletedBlocks, 1);
  assert.deepEqual(await collect(store.getBlockstore().get(cid)), Buffer.from(bytes));
  assert.equal((await store.gc()).deletedBlocks, 1);
});

test('teardown aborts an import awaiting an uncooperative source without publishing a root', async (t) => {
  const store = createStore(t);
  let entered;
  const started = new Promise((resolve) => { entered = resolve; });
  const source = { [Symbol.asyncIterator]: () => ({ next: () => { entered(); return new Promise(() => {}); } }) };
  const importing = store.importFile(source);
  await started;
  const rejected = assert.rejects(importing, { name: 'AbortError' });
  await store.destroy();
  await rejected;
  assert.equal(store.getStats().rootCount, 0);
});

test('concurrent IndexedDB writers reserve quota transactionally across separate handles', async (t) => {
  const indexedDBImpl = new IDBFactory();
  const stores = [0, 1].map(() => createStore(t, { maximumBytes: 15, ownsBackend: true,
    backend: new IndexedDBArtifactBackend({ name: 'quota-race', indexedDBImpl, keyRange: IDBKeyRange }) }));
  const results = await Promise.allSettled(stores.map((store, index) => store.importFile(new Uint8Array(10).fill(index))));
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  assert.equal(results.find((result) => result.status === 'rejected').reason.name, 'QuotaExceededError');
  assert.equal((await stores[0].backend.getUsage('blocks')).bytes, 10);
});

test('revalidation marks a formerly complete root partial if a stored block is missing', async (t) => {
  const store = createStore(t);
  const file = await store.importFile(new Uint8Array([8, 9, 10]));
  await store.backend.delete('blocks', file.cid);
  await assert.rejects(store.ensureLocal(file.cid), { name: 'NotFoundError' });
  assert.equal((await store.stat(file.cid)).status, 'partial');
  assert.equal((await store.stat(file.cid)).pinned, true);
  await store.unpin(file.cid);
  await store.gc();
  assert.equal(store.getStats().rootCount, 0);
});

test('aborting a stalled ReadableStream cancels its reader without awaiting arbitrary source cleanup', async (t) => {
  const store = createStore(t);
  let cancelled = false;
  let entered;
  const started = new Promise((resolve) => { entered = resolve; });
  const source = new ReadableStream({
    pull: () => { entered(); return new Promise(() => {}); },
    cancel: () => { cancelled = true; return new Promise(() => {}); }
  }, { highWaterMark: 0 });
  const importing = store.importFile(source);
  await started;
  const rejected = assert.rejects(importing, { name: 'AbortError' });
  await store.destroy();
  await rejected;
  assert.equal(cancelled, true);
});

test('serving closure verifies manifest members, deduplicates blocks, and preserves file descriptors through GC', async (t) => {
  const store = createStore(t);
  const file = await store.importFile(fixture(), { pin: false });
  const manifest = await store.importManifest({ schema: ARTIFACT_MANIFEST_SCHEMA,
    files: [{ path: 'model.onnx', cid: file.cid, size: file.size }, { path: 'copy.onnx', cid: file.cid, size: file.size }] });
  const ids = [];
  for await (const cid of store.listBlockCids(manifest.cid)) ids.push(cid);
  assert.equal(ids.length, 5);
  assert.equal(new Set(ids).size, ids.length);
  await store.gc();
  assert.equal((await store.stat(file.cid)).status, 'complete');
  assert.equal((await store.stat(file.cid)).pinned, false);
  await store.backend.delete('blocks', file.cid);
  await assert.rejects(async () => { for await (const _ of store.listBlockCids(manifest.cid)) { /* Require full traversal. */ } }, { name: 'NotFoundError' });
});

test('remote manifest imports publish verified per-file descriptors for runtime admission', async (t) => {
  const source = createStore(t);
  const target = createStore(t);
  const file = await source.importFile(new Uint8Array([1, 5, 9]));
  const manifest = await source.importManifest({ schema: ARTIFACT_MANIFEST_SCHEMA,
    files: [{ path: 'config.json', cid: file.cid, size: file.size }] });
  await target.ensureLocal(manifest.cid, { fetchBlock: (cid) => collect(source.getBlockstore().get(cid)) });
  const restored = await target.stat(file.cid);
  assert.equal(restored.status, 'complete');
  assert.equal(restored.sha256, file.sha256);
  assert.equal(restored.pinned, false);
  await target.gc();
  assert.equal((await target.stat(file.cid)).status, 'complete');
});

test('filesystem backend streams a multi-block fixture, restores pins/quotas, and locks out a second owner', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'peercompute-artifacts-'));
  const backend = new FileSystemArtifactBackend({ directory });
  const store = createStore(t, { persistent: true, backend, ownsBackend: true, maximumBytes: 32 * 1024 ** 2 });
  const other = new FileSystemArtifactBackend({ directory });
  let restored;
  t.after(async () => { await store.destroy(); await restored?.destroy(); await other.close(); await rm(directory, { recursive: true, force: true }); });
  const hash = createHash('sha256');
  let supplied = 0;
  async function* generated() {
    for (let i = 0; i < 64; i++) {
      const bytes = fixture(128 * 1024);
      bytes[0] = i;
      supplied += bytes.length;
      hash.update(bytes);
      yield bytes;
    }
  }
  const file = await store.importFile(generated(), { expectedSize: 8 * 1024 ** 2 });
  assert.equal(supplied, file.size);
  assert.equal(file.sha256, hash.digest('hex'));
  await assert.rejects(other.open(), /exclusively locked/u);
  const before = store.getStats();
  await store.destroy();
  restored = new ArtifactStore({ persistent: true, backend: new FileSystemArtifactBackend({ directory }), ownsBackend: true });
  await restored.open();
  assert.equal(restored.getStats().storedBytes, before.storedBytes);
  assert.equal(restored.getStats().blockCount, before.blockCount);
  assert.equal((await restored.stat(file.cid)).pinned, true);
  const reread = createHash('sha256');
  for await (const chunk of restored.openRead(file.cid)) reread.update(chunk);
  assert.equal(reread.digest('hex'), file.sha256);
  const small = new Uint8Array([4, 3, 2, 1]);
  const smallCid = CID.createV1(0x55, await sha256.digest(small));
  await assert.rejects(restored.backend.put('blocks', smallCid.toString(), small, { maximumBytes: before.storedBytes }), { name: 'QuotaExceededError' });
  assert.equal((await restored.backend.getUsage('blocks')).bytes, before.storedBytes);
  assert.equal((await restored.gc()).deletedBlocks, 0);
  await restored.unpin(file.cid);
  assert.ok((await restored.gc()).deletedBlocks > 0);
  assert.equal(restored.getStats().storedBytes, 0);
});

test('block write admission bounds active writes and cancels queued work before buffering', async (t) => {
  const backend = new MemoryArtifactBackend();
  const put = backend.put.bind(backend);
  let enter;
  const entered = new Promise((resolve) => { enter = resolve; });
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  backend.put = async (...args) => { if (args[0] === 'blocks') { enter(); await gate; } return put(...args); };
  const store = createStore(t, { backend, maximumConcurrentBlockWrites: 1, maximumQueuedBlockWrites: 1 });
  const bytes = new Uint8Array([1, 7, 8]);
  const cid = CID.createV1(0x55, await sha256.digest(bytes));
  const first = store.getBlockstore().put(cid, bytes);
  await entered;
  const abort = new AbortController();
  const second = store.getBlockstore().put(cid, bytes, { signal: abort.signal });
  await delay(0);
  await assert.rejects(store.getBlockstore().put(cid, bytes), /queue is full/u);
  const cancelled = assert.rejects(second, { name: 'AbortError' });
  abort.abort();
  await cancelled;
  release();
  await first;
  assert.equal(store.activeBlockWrites, 0);
  assert.equal(store.waitingBlockWrites.length, 0);
});

test('generic CLI importer creates a verified directory manifest and rejects a mismatched file hash', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'peercompute-import-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const source = join(directory, 'input');
  await mkdir(join(source, 'nested'), { recursive: true });
  await writeFile(join(source, 'nested', 'data.bin'), fixture());
  await writeFile(join(source, 'config.json'), '{"value":7}\n');
  const report = await importArtifactPackage({ directory: source, cache: join(directory, 'cache'), quotaBytes: 4 * 1024 ** 2 });
  const manifest = JSON.parse(await readFile(report.manifestPath, 'utf8'));
  assert.equal(report.fileCount, 2);
  assert.deepEqual(manifest.files.map((file) => file.path), ['config.json', 'nested/data.bin']);
  assert.equal(manifest.files[1].sha256, digest(fixture()));
  assert.equal(manifest.schema, ARTIFACT_MANIFEST_SCHEMA);
  assert.ok(report.manifestCid.startsWith('bafkrei'));
  await assert.rejects(importArtifactPackage({ file: join(source, 'config.json'), cache: join(directory, 'failure'), expectedSha256: '0'.repeat(64) }), /mismatch/u);
  await assert.rejects(access(join(directory, 'failure', 'packages')), { code: 'ENOENT' });
});

test('HF importer rejects pinned Git-blob mismatch without publishing an artifact manifest', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'peercompute-hf-failure-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await assert.rejects(importArtifactPackage({ model: 'smolvlm-256m-q4', cache: directory,
    fetchImpl: async () => new Response(new Uint8Array(16400), { headers: { 'content-length': '16400' } }) }), /Git blob SHA-1 mismatch/u);
  await assert.rejects(access(join(directory, 'packages')), { code: 'ENOENT' });
});

test('storage-only GGUF catalog pins the exact published closure without admitting browser execution', () => {
  const id = 'qwen3.8-27b-georefine-d14-gguf';
  const model = MODEL_ARTIFACT_CATALOG[id];
  assert.equal(IMPORT_MODEL_CATALOG[id], model);
  assert.equal(model.revision, '5ce3fd841676adf2c1a10d7193637d46007e88f7');
  assert.equal(model.status, 'storage-only');
  assert.equal(model.capabilities.browserInference, false);
  assert.equal(model.capabilities.executionStatus, 'unavailable');
  assert.equal(model.model.architecture, 'qwen3_5');
  assert.equal(model.model.executionStatus, undefined);
  assert.equal(model.model.executionReason, undefined);
  assert.match(model.capabilities.executionReason, /Execution is admitted separately by the managed llama\.cpp runtime/u);
  assert.deepEqual(model.files.map((file) => file.path), ['.gitattributes', 'LICENSE', 'NOTICE',
    'Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf', 'README.md', 'artifact-manifest.json',
    'chat_template.jinja', 'config.json', 'generation_config.json', 'tokenizer_config.json', 'verify_artifact.py']);
  const weight = model.files.find((file) => file.path.endsWith('.gguf'));
  assert.equal(weight.size, 14199740480);
  assert.equal(weight.sha256, 'afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d');
  assert.equal(model.totalBytes, model.files.reduce((total, file) => total + file.size, 0));
  assert.ok(model.files.every((file) => /^[a-f0-9]{64}$/u.test(file.sha256 || '') || /^[a-f0-9]{40}$/u.test(file.gitBlobSha1 || '')));
  assert.ok(Object.isFrozen(model.files[0]));
  assert.equal(new URL(modelArtifactFileUrl(id, weight.path)).hostname, 'huggingface.co');
  assert.ok(modelArtifactFileUrl(id, weight.path).includes(`/resolve/${model.revision}/`));
  assert.throws(() => modelArtifactFileUrl(id, '../other'), /Unknown/u);
});

test('large catalog imports reject quota or disk shortage before any model download', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'peercompute-large-preflight-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let downloads = 0;
  const options = { model: 'qwen3.8-27b-georefine-d14-gguf', cache: directory,
    fetchImpl: async () => { downloads++; throw new Error('Unexpected download'); } };
  await assert.rejects(importArtifactPackage(options), { name: 'QuotaExceededError' });
  assert.equal(downloads, 0);
  await assert.rejects(importArtifactPackage({ ...options, quotaBytes: 24 * 1024 ** 3,
    diskAvailable: async () => 8 * 1024 ** 3 }), /free bytes plus 8589934592 reserved/u);
  assert.equal(downloads, 0);
  await assert.rejects(access(join(directory, 'sources')), { code: 'ENOENT' });
  await assert.rejects(access(join(directory, 'packages')), { code: 'ENOENT' });
});

test('source-only prefetch checks its disk reserve without acquiring or creating an artifact store', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'peercompute-prefetch-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let downloads = 0;
  await assert.rejects(prefetchArtifactModelSources({ model: 'smolvlm-256m-q4', cache: directory,
    diskAvailable: async () => 0,
    fetchImpl: async () => { downloads++; throw new Error('Unexpected download'); } }), /reserved free disk/u);
  assert.equal(downloads, 0);
  await assert.rejects(access(join(directory, 'store')), { code: 'ENOENT' });
});

test('paused UnixFS reads apply actual block backpressure instead of buffering the remaining file', async (t) => {
  const backend = new MemoryArtifactBackend();
  const store = createStore(t, { backend });
  const file = await store.importFile(fixture(ARTIFACT_IMPORT_PROFILE.chunkSize * 12));
  const get = backend.get.bind(backend);
  let reads = 0;
  backend.get = async (collection, key) => { if (collection === 'blocks') reads++; return get(collection, key); };
  const reader = store.openRead(file.cid)[Symbol.asyncIterator]();
  await reader.next();
  const atPause = reads;
  assert.ok(atPause <= 3, `Expected root metadata, root and first leaf only; received ${atPause} reads`);
  await delay(25);
  assert.equal(reads, atPause);
  await reader.return();
});

test('pull-driven ranges cross multiple UnixFS levels and reject inconsistent linked sizes', async (t) => {
  const store = createStore(t);
  const put = async (bytes, codec) => {
    const cid = CID.createV1(codec, await sha256.digest(bytes));
    await store.getBlockstore().put(cid, bytes);
    return cid.toString();
  };
  const leaf = async (value) => ({ cid: await put(new Uint8Array(value), 0x55), size: value.length, dagSize: value.length });
  const node = async (children, data = [], corrupt = false) => {
    const unixfs = new UnixFS({ type: 'file', data: new Uint8Array(data) });
    for (const child of children) unixfs.addBlockSize(BigInt(child.size));
    const bytes = dagPb.encode(dagPb.prepare({ Data: unixfs.marshal(), Links: children.map((child) => ({
      Hash: child.cid, Name: '', Tsize: corrupt ? 0 : child.dagSize
    })) }));
    return { cid: await put(bytes, 0x70), size: Number(unixfs.fileSize()), dagSize: bytes.length + children.reduce((n, child) => n + child.dagSize, 0) };
  };
  const first = await leaf([2, 3, 4]);
  const second = await leaf([5, 6]);
  const inner = await node([first, second], [1]);
  const last = await leaf([7, 8, 9]);
  const root = await node([inner, last], [0]);
  assert.deepEqual(await collect(store.openRead(root.cid)), Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
  assert.deepEqual(await collect(store.openRead(root.cid, { offset: 3, length: 5 })), Buffer.from([3, 4, 5, 6, 7]));
  assert.equal((await collect(store.openRead(root.cid, { offset: 6, length: 0 }))).length, 0);
  const invalidSize = await node([first], [], true);
  await assert.rejects(collect(store.openRead(invalidSize.cid)), /link DAG size/u);
  const invalidLogicalSize = await node([{ ...first, size: first.size + 1, dagSize: first.dagSize + 1 }]);
  await assert.rejects(collect(store.openRead(invalidLogicalSize.cid)), /block size/u);
  // Type=file, declared filesize=4, child logical size=3: the upstream UnixFS
  // class recalculates fileSize(), so validate the serialized field as well.
  const mismatchedHeader = dagPb.encode(dagPb.prepare({ Data: new Uint8Array([8, 2, 24, 4, 32, 3]),
    Links: [{ Hash: first.cid, Name: '', Tsize: first.dagSize }] }));
  const mismatchedCid = await put(mismatchedHeader, 0x70);
  await assert.rejects(collect(store.openRead(mismatchedCid)), /metadata is inconsistent/u);
});

test('sparse UnixFS ranges preserve offsets beyond signed and unsigned 32-bit boundaries', async (t) => {
  const store = createStore(t);
  const leafBytes = fixture(ARTIFACT_IMPORT_PROFILE.chunkSize);
  const put = async (bytes, codec) => {
    const cid = CID.createV1(codec, await sha256.digest(bytes));
    await store.getBlockstore().put(cid, bytes);
    return cid.toString();
  };
  const repeatNode = async (child, count) => {
    const unixfs = new UnixFS({ type: 'file' });
    for (let i = 0; i < count; i++) unixfs.addBlockSize(BigInt(child.size));
    const bytes = dagPb.encode(dagPb.prepare({ Data: unixfs.marshal(),
      Links: Array.from({ length: count }, () => ({ Hash: child.cid, Name: '', Tsize: child.dagSize })) }));
    return { cid: await put(bytes, 0x70), size: child.size * count, dagSize: bytes.length + child.dagSize * count };
  };
  const leaf = { cid: await put(leafBytes, 0x55), size: leafBytes.length, dagSize: leafBytes.length };
  const middle = await repeatNode(leaf, 174);
  const root = await repeatNode(middle, 100); // 4.56 GB logical file, three stored blocks.
  assert.ok(root.size > 2 ** 32);
  for (const offset of [2 ** 31 - 17, 2 ** 32 - 17, root.size - 77]) {
    const expected = Uint8Array.from({ length: 77 }, (_, index) => leafBytes[(offset + index) % leafBytes.length]);
    assert.deepEqual(await collect(store.openRead(root.cid, { offset, length: 77 })), Buffer.from(expected));
  }
  assert.equal(store.getStats().blockCount, 3);
});
