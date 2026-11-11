import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { parseGgufHeader, inspectGgufHeader, resolveGgufHubProfile } from '../../src/peercompute/inference/gguf/hubAdmission.js';
import { resolveGgufLoraProfile, validateGgufLoraPair, validateGgufLoraAdapters,
  verifyGgufLoraAdapters } from '../../src/peercompute/inference/gguf/loraAdmission.js';
import { createModelComposition, modelManifestCid, splitModelComposition } from '../../src/peercompute/inference/modelComposition.js';
import { validateGgufManifest, normalizeGgufGenerationInput } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';
import { validateModelManifest } from '../../src/peercompute/inference/modelManifest.js';
import { validateDiffusionManifest } from '../../src/peercompute/inference/diffusion/runtimeDefinition.js';
import { validateSpeechManifest } from '../../src/peercompute/inference/speech/runtimeDefinition.js';

const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const repository = 'example/base', revision = 'a'.repeat(40);
const u32 = (value) => { const b = Buffer.alloc(4); b.writeUInt32LE(value); return b; };
const u64 = (value) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(value)); return b; };
const f32 = (value) => { const b = Buffer.alloc(4); b.writeFloatLE(value); return b; };
const str = (value) => { const b = Buffer.from(value); return Buffer.concat([u64(b.length), b]); };
const field = (key, type, value) => Buffer.concat([str(key), u32(type),
  type === 8 ? str(value) : type === 4 ? u32(value) : type === 6 ? f32(value) : value]);
const sha = (bytes) => bytesToHex(sha256(bytes));

function fixture({ kind = 'model', architecture = 'qwen2', alpha = 32, alphaType = 6, extra = [], tensors } = {}) {
  const metadata = [field('general.type', 8, kind === 'model' ? 'model' : 'adapter'),
    field('general.architecture', 8, architecture), field('general.file_type', 4, 1), ...extra];
  if (kind === 'model') metadata.push(field('tokenizer.ggml.model', 8, 'gpt2'),
    field('tokenizer.ggml.tokens', 9, Buffer.concat([u32(8), u64(1), str('test')])));
  else metadata.push(field('adapter.type', 8, 'lora'), field('adapter.lora.alpha', alphaType,
    alphaType === 12 ? Buffer.alloc(8) : alpha));
  tensors ??= kind === 'model' ? [
    { name: 'token_embd.weight', shape: [16, 64], type: 1 },
    { name: 'output_norm.weight', shape: [16], type: 0 },
    { name: 'blk.0.attn_q.weight', shape: [16, 32], type: 1 },
  ] : [
    { name: 'blk.0.attn_q.weight.lora_a', shape: [16, 4], type: 1 },
    { name: 'blk.0.attn_q.weight.lora_b', shape: [4, 32], type: 1 },
  ];
  let end = 0;
  tensors = tensors.map((tensor) => {
    const offset = tensor.offset ?? Math.ceil(end / 32) * 32;
    const bytes = tensor.shape.reduce((a, b) => a * b, 1) * (tensor.type === 0 ? 4 : 2);
    end = Math.max(end, offset + bytes); return { ...tensor, offset };
  });
  const header = Buffer.concat([Buffer.from('GGUF'), u32(3), u64(tensors.length), u64(metadata.length), ...metadata,
    ...tensors.map((tensor) => Buffer.concat([str(tensor.name), u32(tensor.shape.length),
      ...tensor.shape.map(u64), u32(tensor.type), u64(tensor.offset)]))]);
  const bytes = Buffer.alloc(Math.ceil(header.length / 32) * 32 + end); header.copy(bytes);
  return { bytes, size: bytes.length, header: parseGgufHeader(bytes, { size: bytes.length, kind, includeTensorInfo: true }) };
}
function base(f = fixture()) {
  const { tensorInfo, ...header } = f.header;
  const profile = resolveGgufHubProfile({ repository, revision, header,
    file: { path: 'model.gguf', size: f.size, sha256: sha(f.bytes) } });
  return { schema: 'peercompute.artifact.manifest.v1', name: 'Example', model: profile.model,
    files: profile.weights.map((file) => ({ ...file, cid })) };
}
function adapter(f = fixture({ kind: 'lora' }), scale = 1) {
  return resolveGgufLoraProfile({ repository: 'example/adapter', revision: 'b'.repeat(40),
    file: { path: 'model.gguf', size: f.size, sha256: sha(f.bytes), cid }, header: f.header, scale });
}

test('ordinary GGUF matrices are admitted separately from text models and compact receipts omit tensors', () => {
  const f = fixture({ kind: 'lora' }), a = adapter(f);
  assert.equal(a.profile.alpha, 32); assert.equal(a.profile.targetCount, 1);
  assert.equal(a.profile.tensorInfo, undefined); assert.equal(a.source.path, 'model.gguf');
  assert.equal(validateGgufLoraPair(fixture().header, f.header).targetCount, 1);
  assert.throws(() => parseGgufHeader(f.bytes, { size: f.size }), /adapter or non-model/);
  assert.throws(() => fixture({ kind: 'lora', alpha: Infinity }), /finite F32/);
  assert.throws(() => fixture({ kind: 'lora', alphaType: 12 }), /finite F32/);
  assert.throws(() => fixture({ kind: 'lora', extra: [field('adapter.alora.invocation_tokens', 9,
    Buffer.concat([u32(4), u64(1), u32(4)]))] }), /nonstandard/);
});

test('pair admission catches architecture, missing target, wrong dimensions and incomplete rank pairs', () => {
  const baseHeader = fixture().header;
  assert.throws(() => validateGgufLoraPair(baseHeader, fixture({ kind: 'lora', architecture: 'llama' }).header), /architecture/);
  const tensor = (name, shape) => ({ name, shape, type: 1 });
  assert.throws(() => validateGgufLoraPair(baseHeader, fixture({ kind: 'lora', tensors: [
    tensor('blk.1.attn_q.weight.lora_a', [16, 4]), tensor('blk.1.attn_q.weight.lora_b', [4, 32]),
  ] }).header), /missing matrix target/);
  assert.throws(() => validateGgufLoraPair(baseHeader, fixture({ kind: 'lora', tensors: [
    tensor('blk.0.attn_q.weight.lora_a', [8, 4]), tensor('blk.0.attn_q.weight.lora_b', [4, 32]),
  ] }).header), /dimensions/);
  assert.throws(() => fixture({ kind: 'lora', tensors: [tensor('blk.0.attn_q.weight.lora_a', [16, 4])] }), /incomplete/);
  assert.throws(() => fixture({ kind: 'lora', tensors: [
    tensor('blk.0.attn_q.weight.lora_a', [16, 4]), tensor('blk.0.attn_q.weight.lora_b', [8, 32]),
  ] }), /rank/);
  assert.throws(() => fixture({ kind: 'lora', tensors: [tensor('output_norm.weight', [16])] }), /replacement tensors/);
  assert.throws(() => validateGgufLoraPair(baseHeader, fixture({ kind: 'lora', tensors: [
    tensor('output_norm.weight.lora_a', [16, 4]), tensor('output_norm.weight.lora_b', [4, 1]),
  ] }).header), /missing matrix target/);
});

test('embedding pairs follow the native transposed embedding layout, never ordinary linear layout', () => {
  const f = fixture({ kind: 'lora', tensors: [
    { name: 'token_embd.weight.lora_a', shape: [4, 64], type: 1 },
    { name: 'token_embd.weight.lora_b', shape: [4, 16], type: 1 },
  ] });
  assert.equal(validateGgufLoraPair(fixture().header, f.header).targetCount, 1);
});

test('header byte limits and complete tensor extents also apply to adapters', async () => {
  const f = fixture({ kind: 'lora' }), calls = [];
  const result = await inspectGgufHeader({ size: f.size, kind: 'lora', includeTensorInfo: true,
    readRange: async (offset, length) => { calls.push([offset, length]); return f.bytes.subarray(offset, offset + length); } });
  assert.deepEqual(result, f.header); assert.equal(calls.length, 1);
  assert.throws(() => parseGgufHeader(f.bytes.subarray(0, 32), { size: f.size, kind: 'lora' }), { code: 'ERR_GGUF_HEADER_TRUNCATED' });
  assert.throws(() => parseGgufHeader(f.bytes.subarray(0, f.size - 1), { size: f.size - 1, kind: 'lora' }), /truncated tensor/);
  const broken = fixture({ kind: 'lora' });
  const name = Buffer.from('blk.0.attn_q.weight.lora_b');
  const at = broken.bytes.indexOf(name) + name.length + 4 + 8 + 8;
  broken.bytes.writeUInt32LE(12, at); // Quantized adapter rows are unsupported even if the base supports them.
  assert.throws(() => parseGgufHeader(broken.bytes, { size: broken.size, kind: 'lora' }), /codec|ordinary/);
});

test('composition binds exact canonical base, reuses file CIDs and changes identity with strength', () => {
  const b = base(), a = adapter();
  const composed = createModelComposition({ baseManifest: b, baseManifestCid: modelManifestCid(b), adapters: [a], name: 'Adapted' });
  const split = splitModelComposition(composed);
  assert.equal(split.baseManifestCid, modelManifestCid(b)); assert.equal(modelManifestCid(split.baseManifest), modelManifestCid(b));
  assert.equal(split.adapters[0].file.cid, a.file.cid); assert.match(split.adapters[0].file.path, /^adapters\/1-/);
  assert.equal(split.adapters[0].source.path, 'model.gguf'); assert.equal(composed.files.length, 2);
  const zero = createModelComposition({ baseManifest: b, adapters: [{ ...a, scale: 0 }] });
  assert.notEqual(modelManifestCid(zero), modelManifestCid(composed));
  assert.deepEqual(zero.files, composed.files); // Strength affects composition identity, not retained weight bytes.
  assert.throws(() => createModelComposition({ baseManifest: b, baseManifestCid: cid, adapters: [a] }), /base manifest CID/);
  assert.throws(() => createModelComposition({ baseManifest: composed, adapters: [a] }), /nested composition/);
  for (const scale of [NaN, Infinity, -2.01, 2.01]) assert.throws(() => createModelComposition({ baseManifest: b, adapters: [{ ...a, scale }] }));
  assert.throws(() => createModelComposition({ baseManifest: b, adapters: [a, a] }), /duplicate adapter/);
  assert.throws(() => createModelComposition({ baseManifest: b, adapters: Array(5).fill(a) }), /one to four/);
});

test('forged compositions cannot mutate base runtime metadata, add weight files or replace the base identity', () => {
  const composed = createModelComposition({ baseManifest: base(), adapters: [adapter()] });
  const mutate = (operation) => { const result = structuredClone(composed); operation(result); return result; };
  assert.throws(() => splitModelComposition(mutate((m) => { m.model.architecture = 'llama'; })), /base runtime identity/);
  assert.throws(() => splitModelComposition(mutate((m) => { m.model.composition.baseManifest.model.dtype = 'q8_0'; })), /base manifest CID/);
  assert.throws(() => splitModelComposition(mutate((m) => { delete m.model.composition.baseManifestCid; })), /schema/);
  assert.throws(() => splitModelComposition(mutate((m) => { m.files[0].sha256 = 'c'.repeat(64); })), /file closure/);
  assert.throws(() => splitModelComposition(mutate((m) => { m.files.push({ ...m.files[0], path: 'unexpected.gguf' }); })), /file closure/);
  const uncomposed = splitModelComposition(base()); assert.deepEqual(uncomposed.adapters, []);
});

test('runtime admission preserves the base profile but loads the composed identity and complete byte budget', () => {
  const b = base(), a = adapter(), composed = createModelComposition({ baseManifest: b, adapters: [a] });
  const admitted = validateGgufManifest(composed), original = validateGgufManifest(b);
  assert.equal(modelManifestCid(admitted.manifest), modelManifestCid(composed));
  assert.equal(modelManifestCid(admitted.baseManifest), modelManifestCid(b));
  assert.deepEqual(admitted.weights, original.weights);
  assert.deepEqual(admitted.resourcePolicy, original.resourcePolicy);
  assert.equal(admitted.totalBytes, original.totalBytes + a.file.size);
  assert.equal(admitted.adapters.length, 1);
  assert.equal(normalizeGgufGenerationInput({ prompt: 'A fresh question' }, composed).messages[0].content, 'A fresh question');
  // A generic composition contract never grants another execution backend adapter support.
  for (const validate of [validateModelManifest, validateDiffusionManifest, validateSpeechManifest]) {
    assert.throws(() => validate(composed), /does not support model adapters/);
  }
});

test('managed admission re-reads actual base and adapter headers and catches substituted bytes before loading', async () => {
  const b = fixture(), a = fixture({ kind: 'lora' }), bManifest = base(b);
  const composed = createModelComposition({ baseManifest: bManifest, adapters: [adapter(a)] });
  const { baseManifest, adapters } = splitModelComposition(composed);
  const paths = new Map([[baseManifest.files[0].path, b.bytes], [adapters[0].file.path, a.bytes]]), reads = [];
  const reader = { read: async (path, offset, length) => { reads.push([path, offset, length]); return paths.get(path).subarray(offset, offset + length); } };
  const result = await verifyGgufLoraAdapters(baseManifest.model, baseManifest.files, adapters, reader);
  assert.equal(result[0].targetCount, 1); assert.equal(reads.length, 2);
  const substituted = fixture({ kind: 'lora', alpha: 16 }); paths.set(adapters[0].file.path, substituted.bytes);
  await assert.rejects(verifyGgufLoraAdapters(baseManifest.model, baseManifest.files, adapters, reader), /stored adapter header differs/);
  assert.throws(() => validateGgufLoraAdapters({ ...baseManifest.model, architecture: 'llama' }, baseManifest.files, adapters), /architectures differ/);
  assert.throws(() => validateGgufLoraAdapters(baseManifest.model, [...baseManifest.files, baseManifest.files[0]], adapters), /one complete base/);
  const cancel = new AbortController(); cancel.abort(); reads.length = 0;
  await assert.rejects(verifyGgufLoraAdapters(baseManifest.model, baseManifest.files, adapters, reader, { signal: cancel.signal }), { name: 'AbortError' });
  assert.equal(reads.length, 0);
});
