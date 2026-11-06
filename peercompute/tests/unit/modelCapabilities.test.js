import test from 'node:test';
import assert from 'node:assert/strict';
import { getModelCapability, listModelCapabilities, onnxExternalDataFiles, onnxRequiredFeatures,
  onnxMemoryProfile, normalizeOnnxMemoryProfile, onnxCacheBytes, validateOnnxModelConfig } from '../../src/peercompute/inference/modelCapabilities.js';

const config = (model_type = 'phi3') => ({ model_type, hidden_size: 1536, num_attention_heads: 12,
  num_key_value_heads: 2, num_hidden_layers: 28, vocab_size: 151936 });
const nano = () => ({ model_type: 'nemotron_h', hidden_size: 3136, num_attention_heads: 40,
  num_key_value_heads: 8, head_dim: 128, vocab_size: 131072,
  layers_block_type: ['mamba', 'mlp', 'attention', 'mamba'], mamba_num_heads: 96,
  mamba_head_dim: 80, ssm_state_size: 128, n_groups: 8, conv_kernel: 4 });

test('shared registry admits only explicit pinned-engine families, with candidate qualification', () => {
  for (const architecture of ['phi', 'phi3', 'gemma', 'gemma2', 'gemma3_text', 'mistral', 'granite', 'starcoder2', 'smollm3', 'olmo', 'olmo2', 'nemotron_h']) {
    const capability = getModelCapability('transformers.js', architecture);
    assert.equal(capability.task, 'text-generation'); assert.equal(capability.qualification, 'candidate');
    assert.equal(capability.runtimeVersion, '4.3.2'); assert.deepEqual(capability.modules, ['model']);
    assert.equal(capability.requiresMemoryProfile, true); assert(Object.isFrozen(capability));
  }
  assert.equal(getModelCapability('transformers.js', 'custom_remote_code'), null);
  assert.equal(getModelCapability('llama.cpp', 'nemotron_h_moe'), null);
  assert.deepEqual(getModelCapability('transformers.js', 'qwen3_5').dtypes, ['q4']);
  const copy = listModelCapabilities('llama.cpp'); copy.pop();
  assert(listModelCapabilities('llama.cpp').some((item) => item.architecture === 'smollm3'));
});

test('shared ONNX layout follows external chunk and per-dtype GPU cache configuration', () => {
  const c = { 'transformers.js_config': { use_external_data_format: { 'model_q4.onnx': 2 },
    kv_cache_dtype: { q4: 'float16' }, device_config: { webgpu: { use_external_data_format: { model: 3 } } } } };
  assert.deepEqual(onnxExternalDataFiles(c, 'nemotron_h', 'model', 'q4'), ['onnx/model_q4.onnx_data', 'onnx/model_q4.onnx_data_1', 'onnx/model_q4.onnx_data_2']);
  assert.deepEqual(onnxRequiredFeatures('q4', c), ['shader-f16']);
  assert.deepEqual(onnxRequiredFeatures({ model: 'q4', vision_encoder: 'fp32' }), []);
  assert.deepEqual(onnxRequiredFeatures({ model: 'q4', vision_encoder: 'fp16' }), ['shader-f16']);
  assert.deepEqual(onnxExternalDataFiles(c, 'qwen3_5', 'vision_encoder', 'q4'), ['onnx/vision_encoder_q4.onnx_data']);
  assert.deepEqual(onnxExternalDataFiles({ 'transformers.js_config': { use_external_data_format: 2 } }, 'qwen3_5', 'vision_encoder', 'fp16'), ['onnx/vision_encoder_fp16.onnx_data', 'onnx/vision_encoder_fp16.onnx_data_1']);
  assert.throws(() => onnxRequiredFeatures('custom'), /precision/);
  assert.throws(() => onnxExternalDataFiles({ 'transformers.js_config': { use_external_data_format: 33 } }, 'phi3', 'model', 'q4'), /chunk/);
  assert.throws(() => onnxExternalDataFiles({}, 'phi3', '../weights', 'q4'), /module/);
});

test('Nemotron cache estimates include exact recurrent geometry and attention, not just weight bytes', () => {
  const p = onnxMemoryProfile(nano());
  assert.equal(p.layers, 4, 'published exports can omit num_hidden_layers');
  assert.equal(p.attentionLayers, 1); assert.equal(p.recurrentLayers, 2);
  assert.equal(p.convChannels, 96 * 80 + 2 * 8 * 128);
  const oneBuffer = 2 * 8 * 128 * 2048 * 4 + 2 * (96 * 80 * 128 + (96 * 80 + 2 * 8 * 128) * 4) * 4;
  assert.equal(onnxCacheBytes(p), 2 * oneBuffer);
  const dense = onnxMemoryProfile(config());
  assert.equal(onnxCacheBytes(dense), 2 * 2 * 28 * 2 * 128 * 2048 * 4);
  assert.equal(dense.recurrentLayers, 0);
});

test('bounded memory profiles cannot lower the actual verified config dimensions or execute custom code', () => {
  const c = nano(), model = { architecture: c.model_type, dtype: 'q4', memoryProfile: onnxMemoryProfile(c) };
  assert.deepEqual(validateOnnxModelConfig(model, c), []);
  assert.throws(() => validateOnnxModelConfig(model, { ...c, ssm_state_size: 256 }), /verified config/);
  assert.throws(() => validateOnnxModelConfig(model, { ...c, auto_map: { AutoModel: 'code.Run' } }), /Custom/);
  assert.throws(() => validateOnnxModelConfig(model, config()), /architecture/);
  for (const mutate of [
    (value) => { delete value.layers_block_type; },
    (value) => { value.mamba_num_heads = 0; },
    (value) => { value.num_hidden_layers = 99; },
    (value) => { value.layers_block_type[0] = 'unknown'; },
    (value) => { value.ssm_state_size = 1e12; },
  ]) { const bad = nano(); mutate(bad); assert.throws(() => onnxMemoryProfile(bad)); }
  assert.throws(() => normalizeOnnxMemoryProfile({ ...model.memoryProfile, gpuBytes: 1 }), /profile/);
  assert.throws(() => normalizeOnnxMemoryProfile({ ...model.memoryProfile, layers: 1000000 }), /geometry/);
});

test('dynamic memory admission rejects effective native dimension overrides using WebGPU overlay precedence', () => {
  const base = config(), profile = onnxMemoryProfile(base);
  const model = { architecture: base.model_type, dtype: 'q4', memoryProfile: profile };
  const huge = { batch_size: 1048576, sequence_length: 1048576 };
  for (const custom of [
    { free_dimension_overrides: huge },
    { free_dimension_overrides: {}, device_config: { webgpu: { free_dimension_overrides: huge } } },
    { free_dimension_overrides: huge, device_config: { wasm: { free_dimension_overrides: {} } } },
    { free_dimension_overrides: huge, device_config: { webgpu: { kv_cache_dtype: 'float32' } } },
    { free_dimension_overrides: [] }, { free_dimension_overrides: 'unsupported' },
  ]) {
    const c = { ...base, 'transformers.js_config': custom };
    assert.throws(() => onnxMemoryProfile(c), /free_dimension_overrides/);
    assert.throws(() => validateOnnxModelConfig(model, c), /free_dimension_overrides/);
  }
  for (const custom of [
    { free_dimension_overrides: {} },
    { free_dimension_overrides: huge, device_config: { webgpu: { free_dimension_overrides: {} } } },
    { free_dimension_overrides: huge, device_config: { webgpu: { free_dimension_overrides: null } } },
    { device_config: { wasm: { free_dimension_overrides: huge } } },
  ]) assert.deepEqual(onnxMemoryProfile({ ...base, 'transformers.js_config': custom }), profile);
  // Curated pre-existing manifests retain their original admission path; this
  // additional gate belongs to new config-backed dynamic memory profiles.
  assert.deepEqual(validateOnnxModelConfig({ architecture: base.model_type, dtype: 'q4' },
    { ...base, 'transformers.js_config': { free_dimension_overrides: huge } }), []);
  const inherited = Object.create({ webgpu: { free_dimension_overrides: null } });
  assert.throws(() => onnxMemoryProfile({ ...base, 'transformers.js_config': {
    free_dimension_overrides: huge, device_config: inherited } }), /free_dimension_overrides/);
  assert.equal(onnxMemoryProfile(nano()).recurrentLayers, 2, 'Nemotron geometry without overrides remains admitted');
});
