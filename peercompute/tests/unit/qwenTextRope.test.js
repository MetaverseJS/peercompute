import assert from 'node:assert/strict';
import test from 'node:test';
import * as transformers from '@huggingface/transformers';
import { installQwenTextRopeCompatibility } from '../../src/peercompute/inference/qwenTextRope.js';
import { createModelTaskRuntime } from '../../src/peercompute/inference/modelTask.js';
import { MODEL_CATALOG } from '../../src/peercompute/inference/modelCatalog.js';

const { Tensor, Qwen3_5ForConditionalGeneration } = transformers;
const method = '_get_text_only_rope_index';
const originalMethod = Qwen3_5ForConditionalGeneration.prototype[method];

// Execute the installed library's real preparation methods with CPU tensors.
// No model weights, model generation, ONNX sessions, GPU or network are used.
function modelFor(type = 'qwen3_5') {
  const model = Object.create(Qwen3_5ForConditionalGeneration.prototype);
  model.config = { model_type: type, vision_config: { spatial_merge_size: 2 },
    vision_start_token_id: 90, image_token_id: 91, video_token_id: 93 };
  model.sessions = { decoder_model_merged: { inputNames: ['position_ids'] } };
  return model;
}
function textInputs(masks) {
  const batch = masks.length, length = masks[0].length;
  return { input_ids: new Tensor('int64', new BigInt64Array(batch * length).fill(10n), [batch, length]),
    attention_mask: new Tensor('int64', BigInt64Array.from(masks.flat(), BigInt), [batch, length]) };
}
function continuation(model, inputs) {
  const [batch, length] = inputs.input_ids.dims;
  const prepared = model.prepare_inputs_for_generation(inputs.input_ids.tolist(), { ...inputs }, {});
  const next = model.prepare_inputs_for_generation(Array.from({ length: batch }, () => [12n]), {
    ...prepared, input_ids: new Tensor('int64', new BigInt64Array(batch).fill(12n), [batch, 1]),
    position_ids: null, past_key_values: { get_seq_length: () => length },
  }, {});
  return { prepared, next };
}
function dispose(...objects) {
  const seen = new Set();
  for (const object of objects) for (const value of Array.isArray(object) ? object : Object.values(object)) {
    if (value instanceof Tensor && !seen.has(value)) { seen.add(value); value.dispose(); }
  }
}

test('installed 4.3.2 Qwen text continuation exposes the sign bug before adaptation', () => {
  assert.equal(transformers.env.version, '4.3.2', 'Re-evaluate this compatibility adapter when upgrading Transformers');
  const model = modelFor(), inputs = textInputs([[1, 1]]);
  const { prepared, next } = continuation(model, inputs);
  assert.deepEqual(prepared.position_ids.tolist(), [[[0n, 1n]], [[0n, 1n]], [[0n, 1n]]]);
  assert.deepEqual(prepared.rope_deltas.tolist(), [[4n]]);
  assert.deepEqual(next.position_ids.tolist(), [[[6n]], [[6n]], [[6n]]]);
  dispose(inputs, prepared, next);
});

test('actual Qwen preparation continues short and long text at L rather than 3L', () => {
  const model = modelFor();
  assert.equal(installQwenTextRopeCompatibility(model, transformers), true);
  for (const length of [2, 4, 989, 1101, 2048, 3]) {
    const inputs = textInputs([Array(length).fill(1)]);
    const originalIds = inputs.input_ids.tolist(), originalMask = inputs.attention_mask.tolist();
    const { prepared, next } = continuation(model, inputs);
    assert.equal(prepared.position_ids.tolist()[0][0].at(-1), BigInt(length - 1));
    assert.deepEqual(prepared.rope_deltas.tolist(), [[0n]]);
    assert.deepEqual(next.position_ids.tolist(), [[[BigInt(length)]], [[BigInt(length)]], [[BigInt(length)]]]);
    assert.deepEqual(inputs.input_ids.tolist(), originalIds);
    assert.deepEqual(inputs.attention_mask.tolist(), originalMask);
    dispose(inputs, prepared, next);
  }
});

test('padded batch uses maximum returned row position, including one-token padded rows', () => {
  const model = modelFor('qwen3_5_text');
  installQwenTextRopeCompatibility(model, transformers);
  const inputs = textInputs([[1, 1, 1, 1], [0, 0, 1, 1], [0, 0, 0, 1], [1, 1, 0, 0]]);
  const mask = inputs.attention_mask.tolist();
  const { prepared, next } = continuation(model, inputs);
  assert.deepEqual(prepared.position_ids.tolist()[0], [[0n, 1n, 2n, 3n], [1n, 1n, 0n, 1n], [1n, 1n, 1n, 0n], [0n, 1n, 1n, 1n]]);
  assert.deepEqual(prepared.rope_deltas.tolist(), [[0n], [-2n], [-2n], [-2n]]);
  assert.deepEqual(next.position_ids.tolist(), Array.from({ length: 3 }, () => [[4n], [2n], [2n], [2n]]));
  assert.deepEqual(inputs.attention_mask.tolist(), mask);
  dispose(inputs, prepared, next);
});

test('compatibility is instance-local, repeat installation is idempotent, and null mask is unchanged', () => {
  const model = modelFor(), untouched = modelFor();
  installQwenTextRopeCompatibility(model, transformers);
  const wrapped = model[method];
  assert.equal(installQwenTextRopeCompatibility(model, transformers), true);
  assert.equal(model[method], wrapped);
  assert.equal(untouched[method], originalMethod);
  assert.equal(Qwen3_5ForConditionalGeneration.prototype[method], originalMethod);
  const inputs = textInputs([[1, 1, 1, 1]]);
  const original = originalMethod.call(model, inputs.input_ids, null);
  const adapted = model[method](inputs.input_ids, null);
  assert.deepEqual(adapted.map(tensor => tensor.tolist()), original.map(tensor => tensor.tolist()));
  const corrected = model[method](inputs.input_ids, inputs.attention_mask);
  assert.deepEqual(corrected[1].tolist(), [[0n]]);
  dispose(inputs, original, adapted, corrected);
});

test('original image-grid position and continuation calculations remain unchanged', () => {
  const model = modelFor();
  const inputs = { input_ids: new Tensor('int64', [10n, 90n, 91n, 92n, 11n], [1, 5]),
    attention_mask: new Tensor('int64', [1n, 1n, 1n, 1n, 1n], [1, 5]),
    image_grid_thw: new Tensor('int64', [1n, 2n, 2n], [1, 3]) };
  const baseline = continuation(model, inputs);
  installQwenTextRopeCompatibility(model, transformers);
  let textCalls = 0;
  const corrected = model[method];
  model[method] = function (...args) { textCalls++; return corrected.apply(this, args); };
  const actual = continuation(model, inputs);
  assert.equal(textCalls, 0, 'The image-grid branch must not enter text-only correction');
  for (const name of ['position_ids', 'rope_deltas']) {
    assert.deepEqual(actual.prepared[name].tolist(), baseline.prepared[name].tolist());
    assert.deepEqual(actual.next[name].tolist(), baseline.next[name].tolist());
  }
  dispose(inputs, baseline.prepared, baseline.next, actual.prepared, actual.next);
});

test('newer runtimes, other model families and an already repaired 4.3.2 implementation are preserved', () => {
  for (const [type, version] of [['qwen3_5', '4.4.0'], ['qwen3_5', '4.3.1'], ['nemotron_h', '4.3.2'], ['qwen3', '4.3.2'], ['idefics3', '4.3.2']]) {
    const model = modelFor(type);
    assert.equal(installQwenTextRopeCompatibility(model, { ...transformers, env: { version } }), false);
    assert.equal(model[method], originalMethod);
  }
  const repaired = modelFor();
  repaired[method] = function (ids, mask) {
    const result = originalMethod.call(this, ids, mask);
    if (mask) for (let row = 0; row < result[1].data.length; row++) result[1].data[row] -= 2n * BigInt(mask.dims[1]);
    return result;
  };
  const fixed = repaired[method];
  assert.equal(installQwenTextRopeCompatibility(repaired, transformers), false);
  assert.equal(installQwenTextRopeCompatibility(repaired, transformers), false);
  assert.equal(repaired[method], fixed);
});

test('unknown runtime behavior fails safely and always disposes probe tensors', () => {
  for (const failure of ['offset', 'shape', 'throw']) {
    const created = new Map(), returned = [], model = modelFor();
    class TrackedTensor extends Tensor {
      constructor(...args) { super(...args); created.set(this, 0); }
      dispose() { created.set(this, created.get(this) + 1); super.dispose(); }
    }
    model[method] = function (ids, mask) {
      if (failure === 'throw') throw new Error('probe failure');
      const result = originalMethod.call(this, ids, mask);
      for (const tensor of result) {
        let disposed = false;
        const release = tensor.dispose.bind(tensor);
        tensor.dispose = () => { disposed = true; release(); };
        returned.push(() => disposed);
      }
      if (failure === 'offset') result[1].data[0] = 3n;
      else result[1].dims[0] = 2;
      return result;
    };
    const unknown = model[method];
    assert.throws(() => installQwenTextRopeCompatibility(model, { ...transformers, Tensor: TrackedTensor }), /Unsupported Qwen|probe failure/);
    assert.equal(model[method], unknown);
    assert([...created.values()].every(count => count === 1));
    assert(returned.every(check => check()));
  }
  const missing = modelFor(); missing[method] = null;
  assert.throws(() => installQwenTextRopeCompatibility(missing, transformers), /unavailable/);
});

test('wrapped runtime rejects changed delta semantics instead of applying a second correction', () => {
  const model = modelFor(); let changed = false;
  model[method] = function (ids, mask) {
    const result = originalMethod.call(this, ids, mask);
    if (changed) result[1].data[0] = 0n;
    return result;
  };
  installQwenTextRopeCompatibility(model, transformers);
  changed = true;
  const inputs = textInputs([[1, 1]]);
  assert.throws(() => model[method](inputs.input_ids, inputs.attention_mask), /behavior changed/);
  dispose(inputs);
  model[method] = originalMethod;
  assert.throws(() => installQwenTextRopeCompatibility(model, transformers), /was replaced/);
});

test('managed worker load installs compatibility before exposing a ready Qwen session', async () => {
  const model = modelFor(); let disposed = false;
  model.dispose = async () => { disposed = true; };
  const scopes = [], device = { features: new Set(), lost: new Promise(() => {}),
    queue: { async onSubmittedWorkDone() {} }, destroy() {}, addEventListener() {}, removeEventListener() {},
    pushErrorScope(filter) { scopes.push(filter); }, async popErrorScope() { assert(scopes.pop()); return null; } };
  const limits = Object.fromEntries(['maxBindGroups', 'maxComputeWorkgroupStorageSize', 'maxComputeWorkgroupsPerDimension',
    'maxStorageBuffersPerShaderStage', 'maxStorageBufferBindingSize', 'maxBufferSize', 'maxComputeInvocationsPerWorkgroup',
    'maxComputeWorkgroupSizeX', 'maxComputeWorkgroupSizeY', 'maxComputeWorkgroupSizeZ'].map(key => [key, 1024]));
  const library = { ...transformers, env: { version: '4.3.2', backends: { onnx: { wasm: {}, webgpu: {} } } } };
  const runtime = createModelTaskRuntime({ assertWorker() {}, baseUrl: 'https://example.test/worker.js',
    loadLibrary: async () => library, loadModel: async () => ({ model }),
    gpu: { async requestAdapter() { return { info: {}, features: new Set(), limits, async requestDevice() { return device; } }; } } });
  const catalog = MODEL_CATALOG['qwen3.5-2b-q4'];
  const cid = 'bafkreihbfj2knzj47dmtsltvdvjlh7jlxbz32fgwibq4rp7guj4i7lixda';
  const manifest = { schema: 'peercompute.artifact.manifest.v1', model: catalog.model,
    files: catalog.files.map(file => ({ path: file.path, size: file.size, cid, sha256: file.sha256 ?? 'a'.repeat(64) })) };
  const { port1, port2 } = new MessageChannel();
  try {
    const loaded = await runtime({ command: 'load', sessionId: 'rope-load', manifestCid: cid, manifest, artifactPort: port2,
      runtimeAssets: { mjs: 'https://example.test/ort.mjs', wasm: 'https://example.test/ort.wasm' } });
    assert.equal(loaded.status, 'ready');
    assert.equal(loaded.qwenTextRopeCompatibility, true);
    assert.notEqual(model[method], originalMethod);
    const inputs = textInputs([[1, 1]]), { prepared, next } = continuation(model, inputs);
    assert.equal(next.position_ids.data[0], 2n);
    dispose(inputs, prepared, next);
    assert.equal((await runtime({ command: 'status', sessionId: 'rope-load' })).qwenTextRopeCompatibility, true);
  } finally {
    await runtime({ command: 'unload', sessionId: 'rope-load' });
    port1.close(); port2.close();
  }
  assert.equal(disposed, true);
});
