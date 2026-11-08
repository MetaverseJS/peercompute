import test from 'node:test';
import assert from 'node:assert/strict';
import { GGUF_HUB_LIMITS, inspectGgufHeader, parseGgufHeader, resolveGgufHubProfile,
  validateGgufHubModel, verifyGgufHubWeights } from '../../src/peercompute/inference/gguf/hubAdmission.js';
import { validateGgufManifest } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';
import { createGgufTaskRuntime } from '../../src/peercompute/inference/gguf/modelTask.js';
import { GGUF_MODEL_CATALOG } from '../../src/peercompute/artifacts/ggufModelCatalog.js';

const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const repository = 'example/Standard-GGUF', revision = 'a'.repeat(40), digest = 'b'.repeat(64);
const u32 = (value) => { const b = Buffer.alloc(4); b.writeUInt32LE(value); return b; };
const u64 = (value) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(value)); return b; };
const str = (value) => { const b = Buffer.from(value); return Buffer.concat([u64(b.length), b]); };
const field = (key, type, value) => Buffer.concat([str(key), u32(type), type === 8 ? str(value) : type === 4 ? u32(value) : value]);

function fixture({ architecture = 'llama', name = 'Example standard model', type = 12,
  secondOffset = 576, version = 3, extra = [], missing = [], dataOffset = null } = {}) {
  const metadata = [field('general.architecture', 8, architecture), field('general.name', 8, name),
    field('general.type', 8, 'model'), field('general.file_type', 4, 15),
    field('general.quantization_version', 4, 2), field('tokenizer.ggml.model', 8, 'llama'),
    field('tokenizer.ggml.tokens', 9, Buffer.concat([u32(8), u64(3), str('<s>'), str('</s>'), str('hello')]))];
  const tensors = [
    { name: 'token_embd.weight', shape: [256, 4], type, offset: 0 },
    { name: 'output_norm.weight', shape: [4], type: 0, offset: secondOffset },
  ].filter((tensor) => !missing.includes(tensor.name));
  const header = Buffer.concat([Buffer.from('GGUF'), u32(version), u64(tensors.length), u64(metadata.length + extra.length),
    ...metadata, ...extra, ...tensors.map((tensor) => Buffer.concat([str(tensor.name), u32(tensor.shape.length),
      ...tensor.shape.map(u64), u32(tensor.type), u64(tensor.offset)]))]);
  const start = Math.ceil(header.length / 32) * 32;
  const size = Math.max(start + secondOffset + 16, start + 576);
  // Large-offset fixtures keep only the header, never allocate the declared file.
  const bytes = Buffer.alloc(dataOffset === 'large' ? start : size); header.copy(bytes);
  return { bytes, size, headerBytes: header.length };
}
function profile(f = fixture()) {
  return resolveGgufHubProfile({ repository, revision,
    file: { path: 'model.gguf', size: f.size, sha256: digest }, header: parseGgufHeader(f.bytes, { size: f.size }) });
}
function manifest(p = profile()) {
  return { schema: 'peercompute.artifact.manifest.v1', model: p.model,
    files: p.weights.map((file) => ({ ...file, cid })) };
}
function ranged(f, calls = []) {
  return async (offset, length) => {
    calls.push({ offset, length });
    const out = new Uint8Array(length);
    out.set(f.bytes.subarray(offset, Math.min(f.bytes.length, offset + length)));
    return out;
  };
}

test('dynamic standard GGUF profile binds immutable identity, actual tensor codecs and resource bounds', async () => {
  const f = fixture(), calls = [];
  const header = await inspectGgufHeader({ size: f.size, readRange: ranged(f, calls) });
  assert.equal(header.architecture, 'llama'); assert.equal(header.dtype, 'q4_k_m');
  assert.deepEqual(header.tensorTypes, [0, 12]); assert.equal(header.maximumTensorBytes, 576);
  assert.equal(header.headerBytes, f.headerBytes); assert.match(header.headerSha256, /^[a-f0-9]{64}$/);
  const p = profile(f), admitted = validateGgufManifest(manifest(p));
  assert.equal(admitted.weights[0].sha256, digest);
  assert.equal(admitted.resourcePolicy.minimumCpuBytes, 2 * 1024 ** 3);
  assert.deepEqual(admitted.manifest.model.requiredFeatures, ['shader-f16']);
  assert.equal(calls.reduce((sum, call) => sum + call.length, 0), f.size);
  const qwen = profile(fixture({ architecture: 'qwen35' }));
  assert.equal(qwen.model.gguf.architecture, 'qwen35');
  assert.equal(qwen.model.architecture, 'qwen3_5');
  assert.equal(validateGgufHubModel(qwen.model).model.architecture, 'qwen3_5');
});

test('additional dense engine families share registry admission without admitting arbitrary hybrid layouts', () => {
  for (const architecture of ['phi2', 'granite', 'starcoder2', 'olmo', 'olmo2', 'stablelm', 'nemotron', 'smollm3']) {
    const p = profile(fixture({ architecture }));
    assert.equal(validateGgufManifest(manifest(p)).manifest.model.architecture, architecture);
  }
  assert.throws(() => profile(fixture({ architecture: 'nemotron_h_moe' })), /architecture/);
});

test('bounded probe grows metadata prefixes without rereading bytes or downloading tensor payloads', async () => {
  const f = fixture({ extra: [field('general.description', 8, 'x'.repeat(180000))] });
  const calls = [];
  const header = await inspectGgufHeader({ size: f.size + 5 * 1024 ** 3, readRange: ranged(f, calls) });
  assert.equal(header.headerBytes, f.headerBytes);
  let offset = 0;
  for (const call of calls) { assert.equal(call.offset, offset); assert.ok(call.length <= GGUF_HUB_LIMITS.rangeBytes); offset += call.length; }
  assert.equal(offset, 256 * 1024); assert.ok(offset < GGUF_HUB_LIMITS.headerBytes);
});

test('64-bit tensor offsets remain exact above 4GiB and tensor extents are checked against file size', () => {
  const f = fixture({ secondOffset: 2 ** 32 + 64, dataOffset: 'large' });
  const header = parseGgufHeader(f.bytes, { size: f.size });
  assert.equal(header.tensorCount, 2);
  assert.equal(profile(f).resourcePolicy.minimumGpuBytes, 16 * 1024 ** 3);
  assert.throws(() => parseGgufHeader(f.bytes, { size: f.size - 1 }), /truncated tensor data/);
  const malformed = fixture({ secondOffset: Number.MAX_SAFE_INTEGER, dataOffset: 'large' });
  assert.throws(() => parseGgufHeader(malformed.bytes, { size: 1024 ** 3 }), /offset/);
});

test('parser rejects nonstandard architectures/codecs, splits, adapters and custom layout directives', () => {
  const cases = [
    fixture({ architecture: 'unknown_future' }), fixture({ architecture: 'clip' }), fixture({ type: 99 }),
    fixture({ type: 30 }), fixture({ version: 4 }), fixture({ secondOffset: 32 }),
    fixture({ extra: [field('split.count', 4, 2)] }),
    fixture({ extra: [field('general.tensor_data_layout', 8, 'custom')] }),
    fixture({ extra: [field('georefine.codec', 8, 'custom')] }), fixture({ name: 'GeoRefine experiment' }),
    fixture({ missing: ['token_embd.weight'] }),
    fixture({ extra: [field('general.architecture', 8, 'llama')] }),
  ];
  for (const f of cases) assert.throws(() => parseGgufHeader(f.bytes, { size: f.size }), /Unsupported GGUF/);
});

test('hostile metadata lengths and truncated headers fail before unbounded arrays or reads', async () => {
  const f = fixture();
  assert.throws(() => parseGgufHeader(f.bytes.subarray(0, f.headerBytes - 1), { size: f.size }), { code: 'ERR_GGUF_HEADER_TRUNCATED' });
  for (const extra of [
    field('hostile', 9, Buffer.concat([u32(8), u64(2 ** 40)])),
    field('hostile', 9, Buffer.concat([u32(9), u64(1)])),
    field('hostile', 8, 'x'.repeat(GGUF_HUB_LIMITS.stringBytes + 1)),
  ]) {
    const bad = fixture({ extra: [extra] });
    assert.throws(() => parseGgufHeader(bad.bytes, { size: bad.size }), /Unsupported GGUF/);
  }
  const unsafe = Buffer.from(f.bytes); unsafe.writeBigUInt64LE(2n ** 63n, 8);
  assert.throws(() => parseGgufHeader(unsafe, { size: f.size }), /unsafe 64-bit/);
  await assert.rejects(inspectGgufHeader({ size: f.size, readRange: async () => new Uint8Array(2) }), /truncated range/);
  const abort = new AbortController(); let reads = 0;
  await assert.rejects(inspectGgufHeader({ size: f.size, signal: abort.signal, readRange: async (offset, length) => {
    reads++; abort.abort(); return new Uint8Array(length);
  } }), { name: 'AbortError' });
  assert.equal(reads, 1);
});

test('oversized complete headers never exceed the fixed probe budget', async () => {
  const f = fixture({ extra: Array.from({ length: 17 }, (_, index) =>
    field(`description.${index}`, 8, 'x'.repeat(1024 ** 2))) });
  const calls = [];
  await assert.rejects(inspectGgufHeader({ size: f.size, readRange: ranged(f, calls) }), /header byte budget|bounded probe/);
  assert.ok(calls.reduce((sum, call) => sum + call.length, 0) <= GGUF_HUB_LIMITS.headerBytes);
  assert.ok(calls.every((call) => call.length <= GGUF_HUB_LIMITS.rangeBytes));
});

test('Hub profiles reject mutable revisions, unsigned files, mislabels, extra shards and size bypasses', () => {
  const f = fixture(), header = parseGgufHeader(f.bytes, { size: f.size });
  const file = { path: 'model.gguf', size: f.size, sha256: digest };
  for (const change of [{ revision: 'main' }, { repository: '../bad/model' },
    { file: { ...file, sha256: undefined } }, { file: { ...file, path: '../x.gguf' } },
    { file: { ...file, size: GGUF_HUB_LIMITS.maximumBytes + 1 } },
    { header: { ...header, tensorTypes: [99] } }, { header: { ...header, trusted: true } },
    { header: { ...header, fileType: 999, dtype: undefined } }]) {
    assert.throws(() => resolveGgufHubProfile({ repository, revision, file, header, ...change }));
  }
  const p = profile(f);
  for (const change of [{ architecture: 'qwen3' }, { dtype: 'q8_0' }, { task: 'image-text-to-text' },
    { modalities: ['text', 'image'] }, { requiredFeatures: [] }, { runtimeVersion: 'next' }]) {
    assert.throws(() => validateGgufHubModel({ ...p.model, ...change }));
  }
  assert.throws(() => validateGgufHubModel({ trusted: true }), /header profile/);
  assert.throws(() => validateGgufHubModel(p.model, { totalBytes: GGUF_HUB_LIMITS.maximumBytes + 1 }), /package bytes/);
  assert.throws(() => validateGgufManifest({ ...manifest(p), files: [...manifest(p).files,
    { ...manifest(p).files[0], path: 'second.gguf' }] }), /closure/);
  const wrong = manifest(p); wrong.files[0].sha256 = 'c'.repeat(64);
  assert.throws(() => validateGgufManifest(wrong), /digest mismatch/);
});

test('dynamic metadata cannot override an existing catalog file digest', () => {
  const known = Object.values(GGUF_MODEL_CATALOG).find((entry) => entry.repository === 'bartowski/Qwen_Qwen3.5-0.8B-GGUF');
  assert.ok(known);
  const f = fixture(), p = resolveGgufHubProfile({ repository: known.repository, revision: known.revision,
    file: { ...known.files.find((file) => file.path.endsWith('.gguf')), sha256: digest },
    header: parseGgufHeader(f.bytes, { size: f.size }) });
  assert.throws(() => validateGgufManifest(manifest(p)), /catalog digests/);
});

test('worker re-probes CID bytes before native initialization and rejects substituted headers', async () => {
  const f = fixture(), p = profile(f), source = manifest(p);
  let engines = 0, closed = 0;
  const runtime = createGgufTaskRuntime({ assertWorker() {}, baseUrl: 'https://test.local/worker.js',
    checkCapabilities: async () => ({}),
    createReader: () => ({ read: (path, offset, length) => ranged(f)(offset, length), close() { closed++; }, getStats: () => ({}) }),
    loadEngine: async () => { engines++; return { files: [{ name: 'model.gguf' }],
      evidence: { offload: { gpuLayers: 1, totalLayers: 1 } }, memoryBytes: () => 0,
      action: async () => ({ success: true }), close() {} }; },
  });
  assert.equal((await runtime({ command: 'load', sessionId: 'hub_test', manifestCid: cid, manifest: source,
    runtimeAssets: { wasm: '/wllama.wasm' } }, {})).status, 'ready');
  assert.equal(engines, 1);
  await runtime({ command: 'unload', sessionId: 'hub_test' }, {}); assert.equal(closed, 1);
  const changed = fixture({ name: 'Changed authenticated bytes' });
  await assert.rejects(verifyGgufHubWeights(p.model, p.weights,
    { read: (path, offset, length) => ranged(changed)(offset, length) }), /stored header/);
  const badRuntime = createGgufTaskRuntime({ assertWorker() {}, baseUrl: 'https://test.local/worker.js',
    checkCapabilities: async () => ({}), createReader: () => ({
      read: (path, offset, length) => ranged(changed)(offset, length), close() { closed++; } }),
    loadEngine: async () => { engines++; throw new Error('Must not initialize native code'); },
  });
  await assert.rejects(badRuntime({ command: 'load', sessionId: 'changed', manifestCid: cid, manifest: source,
    runtimeAssets: { wasm: '/wllama.wasm' } }, {}), /stored header/);
  assert.equal(engines, 1); assert.equal(closed, 2);
});
