import test from 'node:test';
import assert from 'node:assert/strict';
import { findModelCatalogEntry, modelMemoryEstimate, normalizeModelMemoryBudgets, collectModelDeviceCapabilities, evaluateModelCompatibility } from '../../../demos/inference/src/modelDeviceCompatibility.js';
import { MODEL_CATALOG } from '../../src/peercompute/inference/modelCatalog.js';
import { GGUF_MODEL_CATALOG } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { DIFFUSION_MODEL_CATALOG } from '../../src/peercompute/artifacts/diffusionModelCatalog.js';

const GiB = 1024 ** 3;
const onnx = MODEL_CATALOG['qwen3-0.6b-q4'];
const qwen35 = MODEL_CATALOG['qwen3.5-2b-q4'];
const large = GGUF_MODEL_CATALOG['qwen3.8-27b-georefine-d14-gguf'];
const small = GGUF_MODEL_CATALOG['qwen3.5-0.8b-q4-k-m-gguf'];
const diffusion = DIFFUSION_MODEL_CATALOG['sd-turbo-onnx'];
const device = (overrides = {}) => ({ webgpu: true, features: ['shader-f16'], limits: { maxBufferSize: 256 * 1024 ** 2, maxStorageBufferBindingSize: 128 * 1024 ** 2 },
  crossOriginIsolated: true, sharedArrayBuffer: true, jspi: true, memory64: true, deviceMemoryGiB: 8, ...overrides });
const evaluate = (entry, overrides = {}, budgets) => evaluateModelCompatibility(entry, { device: device(overrides), budgets });

function probeScope({ gpu, deviceMemory = 8, memory64 = true } = {}) {
  return { navigator: { gpu, deviceMemory }, crossOriginIsolated: true, SharedArrayBuffer,
    WebAssembly: { Suspending() {}, promising() {}, Memory: class { constructor(options) {
      assert.equal(options.initial, 0n); assert.equal(options.maximum, 1n); assert.equal(options.shared, true); assert.equal(options.address, 'i64');
      if (!memory64) throw new TypeError('memory64 unavailable');
    } } },
    get Worker() { throw new Error('A compatibility probe must not create workers'); } };
}

test('model reservations match the existing ONNX, GGUF and diffusion runtime envelopes', () => {
  assert.deepEqual(modelMemoryEstimate(onnx), { cpuBytes: 4 * GiB, gpuBytes: 4 * GiB });
  assert.deepEqual(modelMemoryEstimate(qwen35), { cpuBytes: 8 * GiB, gpuBytes: 8 * GiB });
  assert.deepEqual(modelMemoryEstimate(small), { cpuBytes: 2 * GiB, gpuBytes: 2 * GiB });
  assert.deepEqual(modelMemoryEstimate(large), { cpuBytes: 8 * GiB, gpuBytes: 16 * GiB });
  assert.deepEqual(modelMemoryEstimate(diffusion), { cpuBytes: 8 * GiB, gpuBytes: 8 * GiB });
  assert.deepEqual(modelMemoryEstimate({ model: large.model, files: large.files }), modelMemoryEstimate(large));
  assert.deepEqual(modelMemoryEstimate({ model: small.model, files: [{ size: 4 * GiB }] }), { cpuBytes: 2 * GiB, gpuBytes: 2 * GiB });
  assert.deepEqual(modelMemoryEstimate({ model: small.model, files: [{ size: 4 * GiB + 1 }] }), { cpuBytes: 8 * GiB, gpuBytes: 16 * GiB });
});

test('explicit budgets are strictly normalized and can be cleared back to automatic', () => {
  assert.deepEqual(normalizeModelMemoryBudgets(), { cpuBytes: null, gpuBytes: null });
  assert.deepEqual(normalizeModelMemoryBudgets(null), { cpuBytes: null, gpuBytes: null });
  assert.deepEqual(normalizeModelMemoryBudgets({ cpuBytes: 1024 * GiB, gpuBytes: undefined }), { cpuBytes: 1024 * GiB, gpuBytes: null });
  for (const input of [[], '8', 8, false, new Date(), { vram: 8 }, { cpuBytes: 0 }, { cpuBytes: -1 }, { gpuBytes: NaN }, { gpuBytes: Infinity }, { cpuBytes: 1.5 }, { cpuBytes: '8' }, { cpuBytes: 1024 * GiB + 1 }]) assert.throws(() => normalizeModelMemoryBudgets(input));
  assert.equal(evaluate(large, {}, { gpuBytes: 8 * GiB }).code, 'gpu_budget_exceeded');
  assert.equal(evaluate(large, {}, { cpuBytes: 4 * GiB }).code, 'cpu_budget_exceeded');
  assert.match(evaluate(large, {}, { gpuBytes: 8 * GiB }).reason, /configured GPU memory budget/);
  assert.equal(evaluate(large, {}, { cpuBytes: null, gpuBytes: null }).status, 'unknown');
  assert.equal(evaluate(large, {}, { cpuBytes: 8 * GiB, gpuBytes: 16 * GiB }).status, 'unknown');
});

test('all approved catalog profiles remain selectable without claiming physical memory fit', () => {
  for (const entry of [...Object.values(MODEL_CATALOG), ...Object.values(GGUF_MODEL_CATALOG), ...Object.values(DIFFUSION_MODEL_CATALOG)]) {
    assert.equal(evaluate(entry).status, 'unknown', entry.id);
    assert.match(evaluate(entry).reason, /memory fit is unverified/, entry.id);
  }
});

test('same-revision GGUF variants resolve exact profiles and never guess ambiguous peer precision', () => {
  const q4 = GGUF_MODEL_CATALOG['qwen3.5-9b-evil-mradermacher-q4-k-m-gguf'];
  const q8 = GGUF_MODEL_CATALOG['qwen3.5-9b-evil-mradermacher-q8-0-gguf'];
  assert.equal(q4.repository, q8.repository); assert.equal(q4.revision, q8.revision);
  for (const entry of [q4, q8]) {
    assert.equal(findModelCatalogEntry(entry), entry);
    assert.equal(evaluate(entry).code, 'memory_fit_unverified');
    const peer = { runtime: entry.model.runtime, repository: entry.repository, revision: entry.revision,
      task: entry.model.task, modelId: entry.id, totalBytes: 1 };
    assert.equal(findModelCatalogEntry(peer), entry);
    assert.deepEqual(modelMemoryEstimate(peer), { cpuBytes: 8 * GiB, gpuBytes: 16 * GiB });
    assert.equal(evaluate(peer, {}, { gpuBytes: 8 * GiB }).code, 'gpu_budget_exceeded');
    assert.equal(evaluate(peer, { features: [] }).code, 'gpu_feature_unavailable');
    assert.equal(findModelCatalogEntry({ ...peer, modelId: 'unknown' }), undefined);
    assert.equal(evaluate({ ...peer, modelId: 'unknown' }).code, 'catalog_unsupported');
    assert.equal(findModelCatalogEntry({ ...peer, task: 'text-to-image' }), undefined);
  }
  const swapped = structuredClone(q8); swapped.files = structuredClone(q4.files);
  assert.equal(findModelCatalogEntry(swapped), undefined);
  assert.equal(evaluate(swapped).code, 'catalog_unsupported');
  const corrupt = structuredClone(q4); corrupt.files[0].sha256 = '0'.repeat(64);
  assert.equal(findModelCatalogEntry(corrupt), undefined);
  assert.equal(evaluate(corrupt).code, 'catalog_unsupported');
});

test('Qwen2 and Llama text ONNX q4 profiles remain usable without shader-f16', () => {
  for (const architecture of ['qwen2', 'llama']) {
    const entry = structuredClone(onnx); entry.model.architecture = architecture;
    assert.equal(evaluate(entry, { features: [] }).code, 'memory_fit_unverified');
    entry.model.dtype = 'q4f16';
    assert.equal(evaluate(entry, { features: [] }).code, 'gpu_feature_unavailable');
  }
});

test('coarse or capped RAM and per-buffer GPU limits cannot falsely block the tested 27B desktop model', () => {
  assert(large.totalBytes > 14e9);
  for (const deviceMemoryGiB of [null, 2, 4, 8, 32, 64]) {
    const result = evaluate(large, { deviceMemoryGiB, limits: { maxBufferSize: 256 * 1024 ** 2, maxStorageBufferBindingSize: 128 * 1024 ** 2 } });
    assert.equal(result.status, 'unknown'); assert.equal(result.code, 'memory_fit_unverified');
  }
  const untrusted = { ...large, minimumGpuBytes: 128 * GiB, requiredLimits: { maxBufferSize: 128 * GiB } };
  assert.equal(evaluate(untrusted).status, 'unknown');
});

test('confirmed hardware and dtype features fail closed while ordinary q4 does not require f16', () => {
  assert.equal(evaluate(onnx, { webgpu: false }).code, 'webgpu_unavailable');
  assert.equal(evaluate(onnx, { features: [] }).status, 'unknown');
  assert.equal(evaluate(diffusion, { features: [] }).code, 'gpu_feature_unavailable');
  assert.equal(evaluate(small, { features: [] }).code, 'gpu_feature_unavailable');
  const fp16 = structuredClone(onnx); fp16.model.dtype = 'fp16';
  assert.equal(evaluate(fp16, { features: [] }).code, 'gpu_feature_unavailable');
  assert.equal(evaluate(fp16).status, 'unknown');
});

test('GGUF checks browser prerequisites separately from available GPU features', () => {
  for (const field of ['crossOriginIsolated', 'sharedArrayBuffer', 'jspi', 'memory64']) {
    assert.equal(evaluate(small, { [field]: false }).status, 'unavailable', field);
    assert.match(evaluate(small, { [field]: false }).code, new RegExp(field));
  }
  assert.equal(evaluate(small, { memory64: undefined }).status, 'unknown');
});

test('a 16 GiB GPU budget cannot substitute for missing browser FP16 support', () => {
  const budgets = { cpuBytes: 12 * GiB, gpuBytes: 16 * GiB };
  for (const entry of Object.values(MODEL_CATALOG)) assert.equal(evaluate(entry, { features: [] }, budgets).status, 'unknown');
  for (const entry of [...Object.values(GGUF_MODEL_CATALOG), ...Object.values(DIFFUSION_MODEL_CATALOG)]) {
    assert.equal(evaluate(entry, { features: [] }, budgets).code, 'gpu_feature_unavailable');
    assert.equal(evaluate(entry, {}, budgets).status, 'unknown');
  }
});

test('checking and failed or timed-out probes remain distinguishable from missing WebGPU', () => {
  assert.equal(evaluateModelCompatibility(large).status, 'checking');
  assert.equal(evaluate(large, { webgpu: null, probeError: 'Timed out' }).code, 'device_probe_unknown');
});

test('runtime and package bounds reject impossible loads without trusting peer metadata claims', () => {
  const huge = structuredClone(onnx); huge.files[0].size = 2 * GiB;
  assert.equal(evaluate(huge).code, 'package_too_large');
  const hugeGguf = structuredClone(large); hugeGguf.files[0].size = 17 * GiB;
  assert.equal(evaluate(hugeGguf).code, 'package_too_large');
  const wrong = structuredClone(diffusion); wrong.model.revision = '0'.repeat(40);
  assert.equal(evaluate(wrong).code, 'catalog_unsupported');
  const corrupt = structuredClone(large); corrupt.files.find((file) => file.path.endsWith('.gguf')).sha256 = '0'.repeat(64);
  assert.equal(evaluate(corrupt).code, 'catalog_unsupported');
  assert.equal(evaluate({ model: { runtime: 'untrusted' } }).status, 'unavailable');
  const invalid = structuredClone(onnx); invalid.model.requiredFeatures = {};
  assert.equal(evaluate(invalid).status, 'unavailable');
  const peer = { runtime: large.model.runtime, repository: large.repository, revision: large.revision, totalBytes: 1, modelId: 'small-fake', gpuBytes: 1 };
  assert.deepEqual(modelMemoryEstimate(peer), { cpuBytes: 8 * GiB, gpuBytes: 16 * GiB });
  assert.equal(evaluate(peer, {}, { gpuBytes: 8 * GiB }).code, 'gpu_budget_exceeded');
});

test('capability collection inspects the adapter, never allocates a GPU device or large WASM memory', async () => {
  let requests = 0;
  const adapter = { features: new Set(['shader-f16']), limits: { maxBufferSize: 4 * GiB, maxStorageBufferBindingSize: 2 * GiB, nonsense: Infinity },
    requestDevice() { throw new Error('No GPU device allocation allowed'); } };
  const result = await collectModelDeviceCapabilities({ scope: probeScope({ gpu: { async requestAdapter(options) { requests++; assert.equal(options.powerPreference, 'high-performance'); return adapter; } } }) });
  assert.equal(requests, 1); assert.equal(result.webgpu, true); assert.deepEqual(result.features, ['shader-f16']); assert.equal(result.limits.maxBufferSize, 4 * GiB);
  assert.equal(result.memory64, true); assert.equal(result.jspi, true); assert.equal(result.deviceMemoryGiB, 8); assert.equal(result.limits.nonsense, undefined);
});

test('probe absence, fallback and memory64 rejection are reported without inference work', async () => {
  assert.equal((await collectModelDeviceCapabilities({ scope: probeScope() })).webgpu, false);
  for (const adapter of [null, { isFallbackAdapter: true }, { info: { isFallbackAdapter: true } }]) {
    assert.equal((await collectModelDeviceCapabilities({ scope: probeScope({ gpu: { async requestAdapter() { return adapter; } } }) })).webgpu, false);
  }
  const result = await collectModelDeviceCapabilities({ scope: probeScope({ memory64: false, deviceMemory: NaN }) }); assert.equal(result.memory64, false); assert.equal(result.deviceMemoryGiB, null);
});

test('adapter timeout and rejection return promptly as unknown and ignore late results', async () => {
  let resolve; const pending = new Promise((yes) => { resolve = yes; }); const began = Date.now();
  const timed = await collectModelDeviceCapabilities({ scope: probeScope({ gpu: { requestAdapter: () => pending } }), timeoutMs: 10 });
  assert.equal(timed.webgpu, null); assert.match(timed.probeError, /timed out/); assert(Date.now() - began < 1000);
  resolve({ get features() { throw new Error('Late adapter must not be inspected'); } }); await Promise.resolve();
  const rejected = await collectModelDeviceCapabilities({ scope: probeScope({ gpu: { async requestAdapter() { throw new Error('Adapter failed'); } } }) });
  assert.equal(rejected.webgpu, null); assert.match(rejected.probeError, /Adapter failed/);
  await assert.rejects(collectModelDeviceCapabilities({ timeoutMs: Infinity }), /timeout/);
});

test('unknown ONNX peer descriptors await actual manifest checks instead of being falsely disabled', () => {
  const peer = { runtime: 'transformers.js', repository: 'example/new-qwen', revision: 'f'.repeat(40), totalBytes: 1.8 * GiB };
  const result = evaluate(peer); assert.equal(result.status, 'unknown'); assert.equal(result.code, 'model_metadata_unverified');
  // Display-only sizes and omitted precision/architecture cannot replace the
  // bounded manifest verification performed before downloading any weights.
  assert.equal(evaluate({ ...peer, totalBytes: 100 * GiB }).status, 'unknown');
  const invalid = structuredClone(onnx); delete invalid.model.runtimeVersion;
  assert.equal(evaluate(invalid).status, 'unavailable');
  invalid.model.runtimeVersion = '4.3.2'; invalid.model.architecture = 'unsupported';
  assert.equal(evaluate(invalid).status, 'unavailable');
  const unknownGguf = { runtime: 'llama.cpp', repository: 'example/unknown', revision: 'a'.repeat(40) };
  assert.deepEqual(modelMemoryEstimate(unknownGguf), { cpuBytes: 0, gpuBytes: 0 });
  assert.equal(evaluate(unknownGguf).code, 'catalog_unsupported');
});

test('cold null adapter retries once and discovers hardware without creating a device', async () => {
  let calls = 0;
  const hardware = { features: new Set(['shader-f16']), limits: { maxBufferSize: 4 * GiB }, requestDevice() { assert.fail('Must not allocate a device'); } };
  const result = await collectModelDeviceCapabilities({ scope: probeScope({ gpu: { async requestAdapter() { return ++calls === 1 ? null : hardware; } } }), timeoutMs: 1000 });
  assert.equal(calls, 2); assert.equal(result.webgpu, true); assert.deepEqual(result.features, ['shader-f16']);
});

test('repeated null adapters return unavailable after exactly one retry; fallback adapters never retry', async () => {
  for (const fallback of [false, true]) {
    let calls = 0;
    const result = await collectModelDeviceCapabilities({ scope: probeScope({ gpu: { async requestAdapter() { calls++; return fallback ? { isFallbackAdapter: true } : null; } } }), timeoutMs: 1000 });
    assert.equal(result.webgpu, false); assert.equal(calls, fallback ? 1 : 2);
  }
});

test('the original deadline cancels pending retry timers and prevents retry after a late null result', async () => {
  for (const lateFirst of [false, true]) {
    let calls = 0, resolveFirst;
    const first = new Promise((resolve) => { resolveFirst = resolve; });
    const result = await collectModelDeviceCapabilities({ scope: probeScope({ gpu: { requestAdapter() { calls++; return lateFirst ? first : Promise.resolve(null); } } }), timeoutMs: 10 });
    assert.equal(result.webgpu, null); assert.match(result.probeError, /timed out/);
    resolveFirst(null);
    await new Promise((resolve) => setTimeout(resolve, 120));
    assert.equal(calls, 1, 'No retry may run after the shared deadline');
  }
});
