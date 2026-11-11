import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ArtifactStore } from '../../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { parseGgufHeader, resolveGgufHubProfile } from '../../../peercompute/src/peercompute/inference/gguf/hubAdmission.js';
import { resolveGgufLoraProfile } from '../../../peercompute/src/peercompute/inference/gguf/loraAdmission.js';
import { splitModelComposition } from '../../../peercompute/src/peercompute/inference/modelComposition.js';
import { inspectLoraHub, createStoredLoraComposition } from '../src/modelLora.js';

const revision = 'a'.repeat(40), repository = 'fixture/adapter';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };
const u64 = (n) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(n)); return b; };
const string = (value) => Buffer.concat([u64(Buffer.byteLength(value)), Buffer.from(value)]);
function fixture({ adapter = false, width = 16, alpha = 8 } = {}) {
  const field = (name, type, value) => Buffer.concat([string(name), u32(type), value]);
  const metadata = [field('general.type', 8, string(adapter ? 'adapter' : 'model')),
    field('general.architecture', 8, string('qwen2')), field('general.file_type', 4, u32(1))];
  if (adapter) {
    const a = Buffer.alloc(4); a.writeFloatLE(alpha);
    metadata.push(field('adapter.type', 8, string('lora')), field('adapter.lora.alpha', 6, a));
  } else metadata.push(field('tokenizer.ggml.model', 8, string('gpt2')),
    field('tokenizer.ggml.tokens', 9, Buffer.concat([u32(8), u64(1), string('token')])));
  const tensors = adapter ? [['blk.0.attn_q.weight.lora_a', [width, 4]], ['blk.0.attn_q.weight.lora_b', [4, 32]]]
    : [['token_embd.weight', [16, 64]], ['output_norm.weight', [16]], ['blk.0.attn_q.weight', [16, 32]]];
  let end = 0;
  const directory = tensors.map(([name, shape]) => {
    const at = Math.ceil(end / 32) * 32; end = at + shape.reduce((a, b) => a * b) * 2;
    return Buffer.concat([string(name), u32(shape.length), ...shape.map(u64), u32(1), u64(at)]);
  });
  const header = Buffer.concat([Buffer.from('GGUF'), u32(3), u64(tensors.length), u64(metadata.length), ...metadata, ...directory]);
  const bytes = Buffer.alloc(Math.ceil(header.length / 32) * 32 + end, 1); header.copy(bytes); return bytes;
}
const fileFor = (bytes, path = 'adapter.gguf') => ({ path, size: bytes.length, sha256: sha(bytes) });
function variant(bytes, path) {
  const file = fileFor(bytes, path), header = parseGgufHeader(bytes, { size: bytes.length, kind: 'lora', includeTensorInfo: true });
  return { repository, revision, file, name: file.path,
    profile: resolveGgufLoraProfile({ repository, revision, file, header }).profile };
}
async function baseStore(t) {
  const store = new ArtifactStore({ persistent: false, capacity: 'browser' }); await store.open();
  t.after(() => store.destroy());
  const bytes = fixture(), imported = await store.importFile(bytes);
  const file = { path: 'base.gguf', size: bytes.length, sha256: sha(bytes), cid: imported.cid };
  const profile = resolveGgufHubProfile({ repository: 'fixture/base', revision, file,
    header: parseGgufHeader(bytes, { size: bytes.length }) });
  const record = await store.importManifest({ schema: 'peercompute.artifact.manifest.v1', name: 'Base', model: profile.model, files: [file] });
  return { store, record, file };
}
function source(bytes, calls = [], { corrupt = false, onFull } = {}) {
  return async (url, options = {}) => {
    calls.push({ url, options }); options.signal?.throwIfAborted();
    const range = options.headers?.Range;
    if (range) {
      const [, start, end] = /^bytes=(\d+)-(\d+)$/.exec(range);
      return new Response(bytes.subarray(Number(start), Number(end) + 1), { status: 206,
        headers: { 'content-range': `bytes ${start}-${end}/${bytes.length}` } });
    }
    if (onFull) return onFull(options);
    const body = Buffer.from(bytes); if (corrupt) body[body.length - 1] ^= 1;
    return new Response(body);
  };
}

test('Hub inspection pins the revision and only accepts independently parsed GGUF adapters', async () => {
  const bytes = fixture({ adapter: true }), calls = [];
  const client = { getModel: async () => ({ sha: revision }), listFiles: async () => [
    { path: 'adapter.gguf', size: bytes.length, lfs: { size: bytes.length, sha256: sha(bytes) } },
    { path: 'weights.safetensors', size: 1000 },
  ], readRange: async (...args) => { calls.push(args); return bytes.subarray(args[3], args[3] + args[4]); } };
  const result = await inspectLoraHub(`https://huggingface.co/${repository}/blob/${revision}/adapter.gguf`, { client });
  assert.equal(result.variants.length, 1); assert.equal(result.revision, revision);
  assert.equal(result.variants[0].profile.targetCount, 1); assert.equal(result.variants[0].profile.tensorInfo, undefined);
  assert(calls.every((args) => args[1] === revision && args[4] <= 1024 ** 2));
  await assert.rejects(inspectLoraHub('https://evil.invalid/file', { client }), /public huggingface/);
  await assert.rejects(inspectLoraHub(repository, { client: { ...client, getModel: async () => ({ sha: revision, gated: true }) } }), /anonymous/);
  await assert.rejects(inspectLoraHub(repository, { client: { ...client, getModel: async () => ({ sha: 'main' }) } }), /immutable/);
  await assert.rejects(inspectLoraHub(repository, { client: { ...client, listFiles: async () => Array(17).fill({ path: 'a.gguf' }) } }), /specific adapter file/);
  await assert.rejects(inspectLoraHub(repository, { client: { ...client, readRange: async () => fixture() } }), /adapter|type|range/);
});

test('Hub inspection respects cancellation before another file or metadata request', async () => {
  const controller = new AbortController(); controller.abort(); let calls = 0;
  await assert.rejects(inspectLoraHub(repository, { signal: controller.signal, client: { getModel() { calls++; } } }), { name: 'AbortError' });
  assert.equal(calls, 0);
  await assert.rejects(inspectLoraHub(repository, { client: {
    getModel: async () => ({ sha: revision }), listFiles: async () => [{ path: 'adapter.safetensors' }],
  } }), /Safetensors.*conversion/);
});

test('composition acquisition retains exact base files, streams verified adapter bytes and reuses them at another strength', async (t) => {
  const { store, record, file } = await baseStore(t), bytes = fixture({ adapter: true }), calls = [], events = [];
  const first = await createStoredLoraComposition(store, record.cid, { adapter: variant(bytes), fetchImpl: source(bytes, calls), onProgress: (e) => events.push(e) });
  assert(first.pinned); const split = splitModelComposition(first.manifest);
  assert.equal(split.baseManifestCid, record.cid); assert.equal(split.adapters[0].scale, 1);
  assert.equal(first.manifest.files.find((entry) => entry.path === file.path).cid, file.cid);
  assert.equal((await store.stat(split.adapters[0].file.cid)).pinned, false, 'composition owns the adapter; no independent permanent pin');
  assert(calls.every(({ options }) => options.credentials === 'omit'));
  assert.equal(calls.filter(({ options }) => !options.headers?.Range).length, 1);
  assert.equal(events.at(-1).stage, 'verify');
  const second = await createStoredLoraComposition(store, record.cid, { adapter: variant(bytes), scale: 0, fetchImpl: source(bytes, calls) });
  assert.notEqual(first.cid, second.cid);
  assert.deepEqual(first.manifest.files, second.manifest.files);
  assert.equal(calls.filter(({ options }) => !options.headers?.Range).length, 1, 'retained adapter bytes are reused');
  await store.gc(); assert.equal((await store.stat(record.cid)).status, 'complete');
  assert.equal((await store.stat(split.adapters[0].file.cid)).status, 'complete');
});

test('adding another adapter preserves existing adapters and the original base identity', async (t) => {
  const { store, record } = await baseStore(t), one = fixture({ adapter: true }), two = fixture({ adapter: true, alpha: 16 });
  const first = await createStoredLoraComposition(store, record.cid, { adapter: variant(one), fetchImpl: source(one) });
  const second = await createStoredLoraComposition(store, first.cid, { adapter: variant(two, 'second.gguf'), fetchImpl: source(two) });
  const split = splitModelComposition(second.manifest);
  assert.equal(split.baseManifestCid, record.cid); assert.equal(split.adapters.length, 2);
  assert.equal(split.adapters[0].file.cid, first.manifest.model.composition.adapters[0].file.cid);
  await assert.rejects(createStoredLoraComposition(store, second.cid, { adapter: variant(one), fetchImpl() { throw new Error('Must not fetch'); } }), /already part/);
});

test('shape mismatch and forged inspection receipts fail before downloading or retaining adapter weights', async (t) => {
  const { store, record } = await baseStore(t), bytes = fixture({ adapter: true, width: 8 }), calls = [];
  await assert.rejects(createStoredLoraComposition(store, record.cid, { adapter: variant(bytes), fetchImpl: source(bytes, calls) }), /dimensions/);
  assert(calls.every(({ options }) => options.headers?.Range));
  const forged = variant(bytes); forged.profile.alpha = 100;
  await assert.rejects(createStoredLoraComposition(store, record.cid, { adapter: forged, fetchImpl: source(bytes) }), /header differs/);
  assert.equal((await store.stat(record.cid)).status, 'complete');
});

test('full-file hash mismatch and cancellation do not pin a composition or damage the stored base', async (t) => {
  const { store, record, file } = await baseStore(t), bytes = fixture({ adapter: true });
  await assert.rejects(createStoredLoraComposition(store, record.cid, { adapter: variant(bytes), fetchImpl: source(bytes, [], { corrupt: true }) }), /SHA|digest|hash/i);
  const controller = new AbortController();
  await assert.rejects(createStoredLoraComposition(store, record.cid, { adapter: variant(bytes), fetchImpl: source(bytes), signal: controller.signal,
    onProgress(event) { if (event.stage === 'verify') controller.abort(); } }), { name: 'AbortError' });
  const records = []; for await (const entry of store.list()) records.push(entry);
  assert.deepEqual(records.filter((entry) => entry.kind === 'manifest').map((entry) => entry.cid), [record.cid]);
  await store.gc(); assert.equal((await store.stat(file.cid)).status, 'complete');
});

test('a queued garbage collection cannot remove the adapter between its import and composition retention', async (t) => {
  const { store, record, file } = await baseStore(t), bytes = fixture({ adapter: true });
  let release, entered;
  const began = new Promise((resolve) => { entered = resolve; });
  const pending = createStoredLoraComposition(store, record.cid, { adapter: variant(bytes),
    fetchImpl: source(bytes, [], { onFull: () => {
      entered(); return new Promise((resolve) => { release = () => resolve(new Response(bytes)); });
    } }) });
  await began;
  let collected = false;
  const gc = store.gc().then(() => { collected = true; });
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(collected, false, 'GC waits for the import retention scope');
  release(); const composition = await pending; await gc;
  assert.equal((await store.stat(file.cid)).status, 'complete');
  assert.equal((await store.stat(composition.manifest.model.composition.adapters[0].file.cid)).status, 'complete');
});
