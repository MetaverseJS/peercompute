import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from '@noble/hashes/sha2.js';
import { sha1 } from '@noble/hashes/legacy.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { downloadModelFile } from '../../../demos/inference/src/modelDownload.js';
import { importModelPackage, listStoredModelRecords } from '../../../demos/inference/src/modelLibrary.js';

const bytes = Uint8Array.from({ length: 1024 * 1024 + 23 }, (_, index) => index % 251);
const file = { path: 'model_q4.onnx_data', size: bytes.length, sha256: bytesToHex(sha256(bytes)) };
const source = () => 'https://huggingface.co/test/model/resolve/' + 'a'.repeat(40) + '/' + file.path;
const spec = (metadata = file) => ({ schema: 'peercompute.artifact.manifest.v1', name: 'Download fixture',
  model: { runtime: 'transformers.js' }, files: [metadata] });
const fault = () => new TypeError('Failed to fetch');
const response = (parts, { status = 200, headers = {}, error } = {}) => ({
  ok: status >= 200 && status < 300, status, headers: new Headers(headers),
  body: (async function* () { yield* parts; if (error) throw error; })(),
});
const ranged = (start, options = {}) => response([bytes.subarray(start)], { status: 206,
  headers: { 'content-range': `bytes ${start}-${file.size - 1}/${file.size}`, etag: '"fixture"' }, ...options });
async function collect(options, metadata = file) {
  const parts = [];
  for await (const part of downloadModelFile(metadata, source, { baseRetryMs: 1, ...options })) parts.push(part);
  return Buffer.concat(parts);
}

test('multiple body interruptions resume the canonical source at precisely yielded offsets', async () => {
  const calls = [], events = [];
  const result = await collect({ onRetry: (event) => events.push(event), fetchImpl: async (url, options) => {
    calls.push({ url, ...options });
    const start = [0, 12345, 600000][calls.length - 1];
    const end = [12345, 600000, file.size][calls.length - 1];
    return response([bytes.subarray(start, end)], { status: start ? 206 : 200,
      headers: { etag: '"fixture"', ...(start ? { 'content-range': `bytes ${start}-${file.size - 1}/${file.size}` } : {}) },
      ...(end < file.size ? { error: fault() } : {}) });
  } });
  assert.deepEqual(result, Buffer.from(bytes));
  assert.deepEqual(calls.map((call) => call.headers?.Range), [undefined, `bytes=12345-${file.size - 1}`, `bytes=600000-${file.size - 1}`]);
  assert(calls.every((call) => call.url === source() && call.cache === 'no-store' && call.credentials === 'omit' && call.signal.aborted));
  assert.deepEqual(events.map(({ loaded, retryAttempt }) => [loaded, retryAttempt]), [[12345, 1], [600000, 2]]);
});

test('recovery feeds one verified UnixFS import and preserves both SHA256 and Git identity', async () => {
  const store = new ArtifactStore({ persistent: false, capacity: 'browser' }); await store.open();
  try {
    const gitBlobSha1 = bytesToHex(sha1.create().update(new TextEncoder().encode(`blob ${bytes.length}\0`)).update(bytes).digest());
    const expected = await store.importFile(bytes, { expectedSha256: file.sha256 });
    let count = 0;
    const events = [];
    const result = await importModelPackage(store, spec({ ...file, gitBlobSha1 }), source, {
      fetchImpl: async () => ++count === 1 ? response([bytes.subarray(0, 524301)], { error: fault() }) : ranged(524301),
      onProgress: (event) => events.push(event),
    });
    assert.equal(count, 2); assert.equal(result.manifest.files[0].cid, expected.cid);
    assert.equal(result.manifest.files[0].sha256, file.sha256);
    const progress = events.filter((event) => event.stage === 'import');
    assert(progress.some((event) => event.retryAttempt === 1 && event.loaded === 524301));
    assert(progress.every((event, index) => !index || event.loaded >= progress[index - 1].loaded));
    assert.equal(events.at(-1).stage, 'verify'); assert.equal((await listStoredModelRecords(store)).length, 1);
  } finally { await store.destroy(); }
});

test('ignored/malformed ranges, changed objects and encoded responses cannot be appended', async (t) => {
  const cases = [
    ['ignored range', () => response([bytes])],
    ['wrong offset', () => ranged(9)],
    ['wrong total', () => ranged(10, { headers: { 'content-range': `bytes 10-${file.size - 1}/${file.size + 1}` } })],
    ['missing range', () => ranged(10, { headers: {} })],
    ['changed object', () => ranged(10, { headers: { 'content-range': `bytes 10-${file.size - 1}/${file.size}`, etag: '"changed"' } })],
    ['encoded range', () => ranged(10, { headers: { 'content-range': `bytes 10-${file.size - 1}/${file.size}`, 'content-encoding': 'gzip' } })],
  ];
  for (const [name, second] of cases) await t.test(name, async () => {
    let count = 0;
    await assert.rejects(collect({ fetchImpl: async () => ++count === 1
      ? response([bytes.subarray(0, 10)], { error: fault(), headers: { etag: '"fixture"' } }) : second() }),
    /invalid or ignored byte range|source changed|encoded model/);
    assert.equal(count, 2);
  });
});

test('short successful bodies resume, but oversized bodies and unverified partial files stop', async () => {
  let count = 0;
  assert.deepEqual(await collect({ fetchImpl: async () => ++count === 1 ? response([bytes.subarray(0, 10)]) : ranged(10) }), Buffer.from(bytes));
  count = 0;
  await assert.rejects(collect({ fetchImpl: async () => { count++; return response([bytes, new Uint8Array(1)]); } }), /declared size/);
  assert.equal(count, 1); count = 0;
  await assert.rejects(collect({ fetchImpl: async () => { count++; return response([bytes.subarray(0, 10)], { error: fault() }); } },
    { path: file.path, size: file.size }), /cannot be safely resumed/);
  assert.equal(count, 1);
});

test('header failures and transient HTTP errors have a finite retry budget; permanent errors stop', async () => {
  for (const first of [() => { throw fault(); }, () => response([], { status: 503 }), () => response([], { status: 429 })]) {
    let count = 0;
    assert.deepEqual(await collect({ fetchImpl: async () => ++count === 1 ? first() : response([bytes]) }), Buffer.from(bytes));
    assert.equal(count, 2);
  }
  let count = 0;
  await assert.rejects(collect({ maxRetries: 2, fetchImpl: async () => { count++; throw fault(); } }),
    (error) => error.code === 'ERR_MODEL_DOWNLOAD_INTERRUPTED' && /after 2 retries/.test(error.message));
  assert.equal(count, 3); count = 0;
  await assert.rejects(collect({ fetchImpl: async () => { count++; return response([], { status: 404 }); } }), /404/);
  assert.equal(count, 1);
});

test('cancel during retry backoff does not start another fetch', async () => {
  const controller = new AbortController(); let count = 0;
  await assert.rejects(collect({ signal: controller.signal, baseRetryMs: 10000,
    fetchImpl: async () => { count++; throw fault(); }, onRetry: () => setTimeout(() => controller.abort(), 5) }), { name: 'AbortError' });
  assert.equal(count, 1);
});

test('request and body inactivity deadlines recover; explicit abort during a read stops', async () => {
  let count = 0;
  const hang = (signal) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
  assert.deepEqual(await collect({ inactivityTimeoutMs: 10, fetchImpl: async (_, { signal }) =>
    ++count === 1 ? hang(signal) : response([bytes]) }), Buffer.from(bytes));
  assert.equal(count, 2); count = 0;
  assert.deepEqual(await collect({ inactivityTimeoutMs: 10, fetchImpl: async (_, { signal }) => {
    if (++count > 1) return ranged(10);
    return { ok: true, status: 200, body: (async function* () { yield bytes.subarray(0, 10); await hang(signal); })() };
  } }), Buffer.from(bytes));
  assert.equal(count, 2); count = 0;
  const controller = new AbortController();
  await assert.rejects(collect({ signal: controller.signal, fetchImpl: async (_, { signal }) => {
    count++;
    return { ok: true, status: 200, body: (async function* () {
      yield bytes.subarray(0, 10); setTimeout(() => controller.abort(), 5); await hang(signal);
    })() };
  } }), { name: 'AbortError' });
  assert.equal(count, 1);
});

test('corrupted resumed data never publishes a package; quota failures do not retry transport', async () => {
  const store = new ArtifactStore({ persistent: false, capacity: 'browser' }); await store.open();
  try {
    const keepBytes = new TextEncoder().encode('Unrelated retained bytes');
    const keep = await importModelPackage(store, { ...spec({ path: 'keep.bin', size: keepBytes.length,
      sha256: bytesToHex(sha256(keepBytes)) }), name: 'Keep' }, source, { fetchImpl: async () => response([keepBytes]) });
    let count = 0;
    // Correct framing with corrupted bytes must reach (and fail) the final SHA check.
    await assert.rejects(importModelPackage(store, spec(), source, { fetchImpl: async () => ++count === 1
      ? response([bytes.subarray(0, 10)], { error: fault() })
      : response([new Uint8Array(file.size - 10)], { status: 206, headers: { 'content-range': `bytes 10-${file.size - 1}/${file.size}` } }) }), /SHA-256/);
    assert.equal(count, 2); assert.equal((await listStoredModelRecords(store)).length, 1);
    const original = store.backend.put.bind(store.backend);
    store.backend.put = async (collection, ...args) => {
      if (collection === 'blocks') throw new DOMException('No room', 'QuotaExceededError');
      return original(collection, ...args);
    };
    count = 0;
    await assert.rejects(importModelPackage(store, spec(), source, { fetchImpl: async () => { count++; return response([bytes]); } }),
      (error) => error.code === 'ERR_MODEL_STORAGE_FULL');
    assert.equal(count, 1); store.backend.put = original;
    assert.equal((await store.stat(keep.cid)).pinned, true);
  } finally { await store.destroy(); }
});

test('stalled reads/cleanup cannot prevent deadlines, cancellation or late-response disposal', { timeout: 2000 }, async () => {
  const stuck = () => new Promise(() => {});
  const body = { [Symbol.asyncIterator]: () => ({ next: stuck, return: stuck }) };
  let count = 0;
  assert.deepEqual(await collect({ inactivityTimeoutMs: 10, fetchImpl: async () => ++count === 1
    ? { ok: true, status: 200, body } : response([bytes]) }), Buffer.from(bytes));
  assert.equal(count, 2);
  const controller = new AbortController(); count = 0;
  await assert.rejects(collect({ signal: controller.signal, fetchImpl: async () => {
    count++; setTimeout(() => controller.abort(), 5); return { ok: true, status: 200, body };
  } }), { name: 'AbortError' });
  assert.equal(count, 1);
  let resolveLate, cancelled = false; count = 0;
  await collect({ inactivityTimeoutMs: 10, fetchImpl: async () => ++count === 1
    ? new Promise((resolve) => { resolveLate = resolve; }) : response([bytes]) });
  resolveLate({ body: { cancel: () => { cancelled = true; return stuck(); } } });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(cancelled, true);
});
