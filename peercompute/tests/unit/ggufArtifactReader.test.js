import assert from 'node:assert/strict';
import test from 'node:test';
import { MessageChannel } from 'node:worker_threads';
import { setTimeout as delay } from 'node:timers/promises';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { ARTIFACT_MANIFEST_SCHEMA } from '../../src/peercompute/artifacts/ArtifactManifest.js';
import { serveArtifactPort, ARTIFACT_READ_PROTOCOL } from '../../src/peercompute/inference/ArtifactReadBridge.js';
import { createGgufArtifactReader, GGUF_MAXIMUM_READ_BYTES } from '../../src/peercompute/inference/GgufArtifactReader.js';

const path = 'weights.gguf';
const pattern = (offset, length) => Uint8Array.from({ length }, (_, index) => (offset + index) % 251);
function deferred() {
  let resolve; let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function mockStore(size = 1024) {
  const file = { path, cid: 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku', size, sha256: '0'.repeat(64) };
  const calls = [];
  return { manifest: { schema: ARTIFACT_MANIFEST_SCHEMA, files: [file] }, calls,
    store: { stat: async () => ({ ...file, status: 'complete' }),
      async *openRead(cid, { offset, length, signal }) {
        calls.push({ cid, offset, length });
        for (let at = 0; at < length; at += 256 * 1024) {
          signal.throwIfAborted();
          yield pattern(offset + at, Math.min(length - at, 256 * 1024));
        }
      } } };
}
function connect(t, { store, manifest, ...options }) {
  const { port1, port2 } = new MessageChannel();
  const host = serveArtifactPort(port1, { store, manifest });
  const reader = createGgufArtifactReader(port2, { manifest, ...options });
  t.after(async () => { reader.close(); await host.close(); });
  return { host, reader };
}

test('GGUF range client reads genuine verified UnixFS chunks and interleaves independent requests', async (t) => {
  const store = new ArtifactStore({ persistent: false });
  t.after(() => store.destroy());
  const bytes = pattern(0, 3 * 256 * 1024 + 27);
  const file = await store.importFile(bytes);
  const manifest = { schema: ARTIFACT_MANIFEST_SCHEMA, files: [{ path, cid: file.cid, size: file.size, sha256: file.sha256 }] };
  const { reader, host } = connect(t, { store, manifest, maxReads: 2, maxQueuedReads: 1 });
  const ranges = [[13, 600000], [256 * 1024 - 19, 400000], [file.size - 31, 31]];
  const outputs = await Promise.all(ranges.map(([offset, length]) => reader.read(path, offset, length)));
  outputs.forEach((output, index) => assert.deepEqual(output, bytes.slice(ranges[index][0], ranges[index][0] + ranges[index][1])));
  outputs[0][0] ^= 255;
  assert.deepEqual(await reader.read(path, 13, 1), bytes.slice(13, 14));
  assert.equal(reader.stat(path).size, file.size);
  assert.ok(Object.isFrozen(reader.stat(path)));
  assert.equal(reader.getStats().activeReads, 0);
  assert.equal(reader.getStats().bufferedBytes, 0);
  assert.equal(host.getStats().activeReads, 0);
  assert.ok(reader.getStats().peakBufferedBytes <= 1000000);
});

test('range protocol preserves offsets across both 32-bit boundaries without materializing a large file', async (t) => {
  const mocked = mockStore(2 ** 32 + 1000);
  const { reader } = connect(t, mocked);
  for (const offset of [2 ** 31 - 17, 2 ** 32 - 17]) {
    assert.deepEqual(await reader.read(path, offset, 77), pattern(offset, 77));
  }
  assert.equal((await reader.read(path, mocked.manifest.files[0].size, 0)).length, 0);
  assert.deepEqual(mocked.calls.map(({ offset }) => offset), [2 ** 31 - 17, 2 ** 32 - 17, 2 ** 32 + 1000]);
  assert.equal(reader.getStats().peakBufferedBytes, 77);
});

test('client rejects non-safe offsets, missing paths, oversized buffers and out-of-file ranges before dispatch', async (t) => {
  const mocked = mockStore(2 ** 32 + 1000);
  const { reader } = connect(t, mocked);
  for (const [offset, length] of [[-1, 1], [0.5, 1], [0, -1], [0, 1.5], [2n, 1],
    [Number.MAX_SAFE_INTEGER + 1, 1], [2 ** 32 + 1001, 0], [2 ** 32 + 999, 2], [0, GGUF_MAXIMUM_READ_BYTES + 1]]) {
    await assert.rejects(reader.read(path, offset, length), RangeError);
  }
  await assert.rejects(reader.read('missing.gguf', 0, 1), /not in the manifest/);
  await assert.rejects(reader.read('../weights.gguf', 0, 1), /Invalid model artifact path/);
  await assert.rejects(reader.read(path, 0, 1, { signal: {} }), /AbortSignal/);
  assert.equal(mocked.calls.length, 0);
  assert.equal(reader.getStats().bufferedBytes, 0);
});

test('queued reads hold no result buffers and cancellation releases credits and host iterators', async (t) => {
  const mocked = mockStore(1024 * 1024);
  const entered = deferred();
  let sourceAborted = false;
  mocked.store.openRead = async function* (cid, { signal }) {
    entered.resolve();
    await new Promise((resolve, reject) => signal.addEventListener('abort', () => {
      sourceAborted = true; reject(signal.reason);
    }, { once: true }));
    yield new Uint8Array(1);
  };
  const { reader, host } = connect(t, { ...mocked, maxReads: 1, maxQueuedReads: 1 });
  const first = new AbortController();
  const second = new AbortController();
  const active = reader.read(path, 0, 1024 * 1024, { signal: first.signal });
  const activeRejected = assert.rejects(active, { name: 'AbortError' });
  await entered.promise;
  const queued = reader.read(path, 0, 1024 * 1024, { signal: second.signal });
  const queuedRejected = assert.rejects(queued, { name: 'AbortError' });
  assert.equal(reader.getStats().bufferedBytes, 1024 * 1024);
  assert.equal(reader.getStats().queuedReads, 1);
  await assert.rejects(reader.read(path, 0, 1), /queue is full/);
  second.abort(); await queuedRejected;
  assert.equal(reader.getStats().queuedReads, 0);
  first.abort(); await activeRejected;
  await delay(10);
  assert.equal(sourceAborted, true);
  assert.equal(reader.getStats().bufferedBytes, 0);
  assert.equal(host.getStats().activeReads, 0);
});

test('host rejects an incomplete artifact before returning bytes', async (t) => {
  const mocked = mockStore();
  mocked.store.stat = async () => ({ ...mocked.manifest.files[0], status: 'partial' });
  const { reader, host } = connect(t, mocked);
  await assert.rejects(reader.read(path, 0, 4), /incomplete/);
  assert.equal(mocked.calls.length, 0);
  assert.equal(reader.getStats().bufferedBytes, 0);
  assert.equal(host.getStats().activeReads, 0);
});

for (const problem of ['wrong-size', 'oversized-chunk', 'truncated', 'duplicate-ready']) {
  test(`malformed host response ${problem} fails closed and returns reader credits`, async (t) => {
    const { manifest } = mockStore(512 * 1024);
    const { port1, port2 } = new MessageChannel();
    const reader = createGgufArtifactReader(port2, { manifest });
    t.after(() => { reader.close(); port1.close(); });
    const send = (id, message) => port1.postMessage({ protocol: ARTIFACT_READ_PROTOCOL, id, ...message });
    port1.on('message', (message) => {
      if (message.type === 'open') {
        send(message.id, { type: 'ready', size: problem === 'wrong-size' ? 1 : message.length });
        if (problem === 'duplicate-ready') send(message.id, { type: 'ready', size: message.length });
      } else if (message.type === 'pull') {
        if (problem === 'oversized-chunk') send(message.id, { type: 'chunk', bytes: new Uint8Array(256 * 1024 + 1) });
        else if (problem === 'truncated') send(message.id, { type: 'end' });
      }
    });
    await assert.rejects(reader.read(path, 0, 512 * 1024), /Invalid|Truncated/);
    assert.equal(reader.getStats().activeReads, 0);
    assert.equal(reader.getStats().bufferedBytes, 0);
  });
}

test('a stalled host times out with bounded allocation and sends cancellation', async (t) => {
  const { manifest } = mockStore();
  const { port1, port2 } = new MessageChannel();
  let cancelled = false;
  port1.on('message', (message) => { if (message.type === 'cancel') cancelled = true; });
  const reader = createGgufArtifactReader(port2, { manifest, readTimeoutMs: 15 });
  t.after(() => { reader.close(); port1.close(); });
  await assert.rejects(reader.read(path, 0, 5), { name: 'TimeoutError' });
  await delay(5);
  assert.equal(cancelled, true);
  assert.equal(reader.getStats().bufferedBytes, 0);
});

test('host shutdown immediately rejects an outstanding range instead of leaving a suspended native call', async (t) => {
  const mocked = mockStore();
  const statStarted = deferred();
  const releaseStat = deferred();
  mocked.store.stat = async () => { statStarted.resolve(); await releaseStat.promise; return { ...mocked.manifest.files[0], status: 'complete' }; };
  const { host, reader } = connect(t, mocked);
  const failed = assert.rejects(reader.read(path, 0, 5), /bridge closed/);
  await statStarted.promise;
  await host.close();
  await failed;
  releaseStat.resolve();
  assert.equal(reader.getStats().closed, true);
  assert.equal(reader.getStats().activeReads, 0);
});

test('resident signal closes active and queued requests; one request signal does not close the resident reader', async (t) => {
  const mocked = mockStore();
  const resident = new AbortController();
  const { reader } = connect(t, { ...mocked, signal: resident.signal, maxReads: 1 });
  const cancelled = new AbortController(); cancelled.abort();
  await assert.rejects(reader.read(path, 0, 1, { signal: cancelled.signal }), { name: 'AbortError' });
  assert.deepEqual(await reader.read(path, 2, 3), pattern(2, 3));
  const one = assert.rejects(reader.read(path, 0, 10), { name: 'AbortError' });
  const two = assert.rejects(reader.read(path, 0, 10), { name: 'AbortError' });
  resident.abort();
  await Promise.all([one, two]);
  await assert.rejects(reader.read(path, 0, 1), { name: 'AbortError' });
  assert.equal(reader.getStats().activeReads, 0);
  assert.equal(reader.getStats().queuedReads, 0);
});
