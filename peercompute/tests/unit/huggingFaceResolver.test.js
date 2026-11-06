import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { inspectHuggingFaceModel, normalizeHubFile, resolveOnnxVariants } from '../../../demos/inference/src/huggingface/packageResolver.js';

const revision = 'a'.repeat(40), repository = 'org/small-model';
const digest = '1'.repeat(64), git = '2'.repeat(40);
const file = (path, size = 20) => ({ path, size, sha256: digest });
const common = ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'README.md'].map((path) => file(path));
const geometry = { num_hidden_layers: 2, hidden_size: 64, num_attention_heads: 2, num_key_value_heads: 1, head_dim: 32, vocab_size: 128 };
const resolve = (options) => resolveOnnxVariants({ repository, revision, description: 'Test model', license: { spdx: 'mit' }, ...options,
  config: { ...geometry, ...options.config } });

test('resolves selected ONNX precision only with exact metadata closure and no other weights', () => {
  const files = [...common, file('onnx/model_q4.onnx', 100), file('onnx/model_fp16.onnx', 200), file('model.safetensors', 5000), file('training_args.bin')];
  const variants = resolve({ files, config: { model_type: 'llama' } });
  assert.equal(variants.length, 2);
  const q4 = variants.find((item) => item.dtype === 'q4');
  assert.equal(q4.totalBytes, 180); assert.equal(q4.loadable, true);
  assert.deepEqual(q4.files.map((item) => item.path), ['README.md', 'config.json', 'onnx/model_q4.onnx', 'tokenizer.json', 'tokenizer_config.json']);
  assert.equal(q4.package.revision, revision); assert.deepEqual(q4.model.requiredFeatures, []);
  assert.deepEqual(variants.find((item) => item.dtype === 'fp16').model.requiredFeatures, ['shader-f16']);
});

test('external ONNX data honors exact-file precedence and includes every numbered chunk', () => {
  const files = [...common, file('onnx/model_q4.onnx'), file('onnx/model_q4.onnx_data'), file('onnx/model_q4.onnx_data_1')];
  const options = { files, config: { model_type: 'qwen2', 'transformers.js_config': {
    use_external_data_format: { model: 1, 'model_q4.onnx': 2 },
  } } };
  assert.equal(resolve(options)[0].loadable, true);
  assert.equal(resolve(options)[0].files.length, 7);
  assert.match(resolve({ ...options, files: files.slice(0, -1) })[0].reason, /missing.*_data_1/);
  assert.match(resolve({ files, config: { model_type: 'qwen2' } })[0].reason, /not fully declared/);
});

test('multimodal package requires all modules and preprocessing; Qwen3.5 remains all-q4 bounded', () => {
  const modules = ['embed_tokens', 'vision_encoder', 'decoder_model_merged'];
  const files = [...common, file('preprocessor_config.json'), ...modules.flatMap((name) => [file(`onnx/${name}_q4.onnx`), file(`onnx/${name}_q4.onnx_data`)])];
  const qwen = resolve({ files, config: { model_type: 'qwen3_5' } })[0];
  assert.equal(qwen.loadable, true); assert.equal(qwen.task, 'image-text-to-text');
  assert.deepEqual(qwen.model.dtype, { embed_tokens: 'q4', vision_encoder: 'q4', decoder_model_merged: 'q4' });
  assert.match(resolve({ files: files.filter((item) => item.path !== 'preprocessor_config.json'), config: { model_type: 'qwen3_5' } })[0].reason, /preprocessor/);
  assert.match(resolve({ files: [...common, file('onnx/model_q4.onnx', 2 * 1024 ** 3)], config: { model_type: 'llama' } })[0].reason, /file budget/);
});

test('unsupported Qwen3.5 precisions still report all declared external-data bytes', () => {
  const modules = ['embed_tokens', 'vision_encoder', 'decoder_model_merged'];
  const files = [...common, file('preprocessor_config.json'), ...modules.flatMap((name) => [
    file(`onnx/${name}.onnx`, 10), ...Array.from({ length: 4 }, (_, index) => file(`onnx/${name}.onnx_data${index ? `_${index}` : ''}`, 100)),
  ])];
  const variant = resolve({ files, config: { model_type: 'qwen3_5', 'transformers.js_config': { use_external_data_format: 4 } } })[0];
  assert.equal(variant.dtype, 'fp32'); assert.equal(variant.loadable, false);
  assert.match(variant.reason, /only all-q4/);
  assert.equal(variant.totalBytes, files.reduce((sum, item) => sum + item.size, 0));
  assert.equal(variant.files.filter((item) => item.path.includes('.onnx_data')).length, 12);
});

test('unsupported architecture, custom code, gated repositories and undeclared data cannot become loadable', () => {
  const files = [...common, file('onnx/model_q4.onnx')];
  for (const config of [{ model_type: 'unsupported_custom_model' }, { model_type: 'llama', auto_map: { AutoModel: 'code.Model' } }]) {
    assert.equal(resolve({ files, config })[0].loadable, false);
  }
  assert.equal(resolve({ files, config: { model_type: 'llama' }, gated: true })[0].loadable, false);
  assert.throws(() => normalizeHubFile({ path: '../escape', size: 1, oid: git }), /path/);
  assert.throws(() => normalizeHubFile({ path: 'x.onnx', size: 100, lfs: { oid: digest, size: 99 } }), /digest or size/);
});

function fixture(config = { model_type: 'llama', ...geometry }) {
  const texts = { 'config.json': JSON.stringify(config), 'README.md': '# Small model\nUseful text inference.', 'tokenizer.json': '{}', 'tokenizer_config.json': '{}' };
  const files = Object.entries(texts).map(([path, text]) => ({ type: 'file', path, size: Buffer.byteLength(text),
    oid: createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex') }));
  files.push({ type: 'file', path: 'onnx/model_q4.onnx', size: 100, lfs: { oid: digest, size: 100 } });
  const requests = [];
  const client = { async getModel(repo, options) { requests.push({ type: 'info', repo, options }); return { sha: revision, cardData: { license: 'mit' } }; },
    async listFiles(repo, rev) { requests.push({ type: 'tree', repo, rev }); return files; },
    async readText(repo, rev, path) { requests.push({ type: 'text', repo, rev, path }); return texts[path]; } };
  return { texts, files, requests, client };
}

test('inspection pins resolved revision, verifies small metadata, and never downloads model/tokenizer weights', async () => {
  const { client, requests } = fixture();
  const inspected = await inspectHuggingFaceModel(repository, { client });
  assert.equal(inspected.revision, revision); assert.equal(inspected.variants[0].loadable, true);
  assert.match(inspected.description, /Useful text inference/);
  assert.ok(inspected.variants[0].files.find((item) => item.path === 'config.json').sha256);
  assert.ok(inspected.variants[0].files.find((item) => item.path === 'tokenizer.json').gitBlobSha1);
  assert.deepEqual(requests.filter((request) => request.type === 'text').map((request) => request.path), ['README.md', 'config.json']);
  assert.ok(requests.filter((request) => request.type !== 'info').every((request) => request.rev === revision));
});

test('known pinned catalog manifest is preserved exactly while variants from the same repository stay distinct', async () => {
  const data = fixture();
  const initial = await inspectHuggingFaceModel(repository, { client: data.client });
  const existing = { ...initial.variants[0].package, id: 'curated-small', name: 'Original curated name', provenance: { preserve: 'original CID metadata' } };
  const inspected = await inspectHuggingFaceModel(repository, { client: data.client, catalog: { existing } });
  assert.equal(inspected.variants.length, 1); assert.deepEqual(inspected.variants[0].package, existing);
  data.client.getModel = async () => ({ sha: revision, gated: 'manual' });
  const gated = await inspectHuggingFaceModel(repository, { client: data.client, catalog: { existing } });
  assert.equal(gated.variants[0].loadable, false); assert.match(gated.variants[0].reason, /access approval/);
  assert.deepEqual(gated.variants[0].package, existing);
});

test('tampered config is not accepted merely because the repository metadata claims an admitted architecture', async () => {
  const data = fixture(); data.texts['config.json'] = JSON.stringify({ model_type: 'qwen3' });
  const result = await inspectHuggingFaceModel(repository, { client: data.client });
  assert.equal(result.variants[0].loadable, false); assert.match(result.variants[0].reason, /configuration unavailable/);
});

test('gated repositories remain inspectable when their file tree denies anonymous access', async () => {
  const client = { async getModel() { return { sha: revision, gated: 'manual', pipeline_tag: 'text-generation' }; },
    async listFiles() { throw Object.assign(new Error('Access denied'), { status: 401 }); }, async readText() { assert.fail('No file read authorized'); } };
  const result = await inspectHuggingFaceModel(repository, { client });
  assert.equal(result.gated, true); assert.equal(result.variants[0].loadable, false);
  assert.match(result.variants[0].reason, /access approval/);
});

function tinyGguf() {
  const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };
  const u64 = (n) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(n)); return b; };
  const str = (s) => Buffer.concat([u64(Buffer.byteLength(s)), Buffer.from(s)]);
  const meta = [
    Buffer.concat([str('general.architecture'), u32(8), str('llama')]),
    Buffer.concat([str('general.file_type'), u32(4), u32(15)]),
    Buffer.concat([str('tokenizer.ggml.model'), u32(8), str('gpt2')]),
    Buffer.concat([str('tokenizer.ggml.tokens'), u32(9), u32(8), u64(1), str('token')]),
  ];
  const tensors = ['token_embd.weight', 'output_norm.weight'].map((name, index) =>
    Buffer.concat([str(name), u32(1), u64(8), u32(0), u64(index * 32)]));
  const bytes = new Uint8Array(4096);
  bytes.set(Buffer.concat([u32(0x46554747), u32(3), u64(2), u64(meta.length), ...meta, ...tensors]));
  return bytes;
}

test('GGUF browsing is metadata-only; explicit selection probes one variant with a stable key', async () => {
  const bytes = tinyGguf(); let reads = 0;
  const client = { async getModel() { return { sha: revision }; },
    async listFiles() { return ['model-Q4_K_M.gguf', 'model-Q8_0.gguf'].map((path) => ({ path, size: bytes.length, lfs: { oid: digest, size: bytes.length } })); },
    async readText() { assert.fail('No text metadata exists'); },
    async readRange(_repo, rev, path, offset, length) { reads += 1; assert.equal(rev, revision); assert.equal(path, 'model-Q4_K_M.gguf'); return bytes.slice(offset, offset + length); } };
  const listed = await inspectHuggingFaceModel(repository, { client });
  assert.equal(reads, 0); assert.equal(listed.variants.length, 2);
  assert.ok(listed.variants.every((variant) => variant.requiresInspection && !variant.loadable));
  assert.equal(listed.variants[0].dtype, 'q4_k_m');
  const checked = await inspectHuggingFaceModel(repository, { client, selectedVariant: listed.variants[0].key });
  assert.equal(reads, 1); assert.equal(checked.variants[0].key, listed.variants[0].key);
  assert.equal(checked.variants[0].loadable, true); assert.equal(checked.variants[1].requiresInspection, true);
  assert.equal(checked.variants[0].model.gguf.path, 'model-Q4_K_M.gguf');
});

test('additional built-in ONNX families use shared capabilities and verified memory geometry', () => {
  for (const architecture of ['phi', 'phi3', 'gemma', 'gemma2', 'gemma3_text', 'mistral', 'granite', 'starcoder2', 'smollm3', 'olmo', 'olmo2']) {
    const variant = resolve({ files: [...common, file('onnx/model_q4.onnx')], config: { model_type: architecture } })[0];
    assert.equal(variant.loadable, true, architecture);
    assert.equal(variant.model.memoryProfile.architecture, architecture);
    assert.equal(variant.status, 'candidate');
  }
  const invalid = resolve({ files: [...common, file('onnx/model_q4.onnx')], config: { model_type: 'phi3', hidden_size: -1 } })[0];
  assert.equal(invalid.loadable, false); assert.match(invalid.reason, /memory profile/);
});

test('Nemotron hybrid variants include recurrent-state profile and exact multi-part ONNX closure', () => {
  const config = { model_type: 'nemotron_h', num_hidden_layers: 3, layers_block_type: ['mamba', 'attention', 'mlp'],
    mamba_num_heads: 2, mamba_head_dim: 16, ssm_state_size: 8, n_groups: 1, conv_kernel: 4,
    'transformers.js_config': { use_external_data_format: { 'model_q4.onnx': 2 } } };
  const files = [...common, file('onnx/model_q4.onnx', 1000), file('onnx/model_q4.onnx_data', 1_900_000_000), file('onnx/model_q4.onnx_data_1', 500_000_000)];
  const variant = resolve({ files, config })[0];
  assert.equal(variant.loadable, true); assert.equal(variant.model.memoryProfile.recurrentLayers, 1);
  assert.equal(variant.model.memoryProfile.attentionLayers, 1); assert.equal(variant.totalBytes, 2_400_001_080);
  const absent = resolve({ files, config: { ...config, mamba_num_heads: undefined } })[0];
  assert.equal(absent.loadable, false); assert.match(absent.reason, /SSM heads/);
  const incomplete = resolve({ files: files.slice(0, -1), config })[0];
  assert.equal(incomplete.loadable, false); assert.match(incomplete.reason, /missing.*data_1/);
});

test('larger valid text packages remain bounded per file and by total package size', () => {
  const config = { model_type: 'qwen2', 'transformers.js_config': { use_external_data_format: 1 } };
  const files = [...common, file('onnx/model_q4.onnx', 1000), file('onnx/model_q4.onnx_data', 1_820_055_552)];
  assert.equal(resolve({ files, config })[0].loadable, true);
  const tooLargeFile = resolve({ files: [...common, file('onnx/model_q4.onnx', 2 * 1024 ** 3)], config: { model_type: 'qwen2' } })[0];
  assert.equal(tooLargeFile.loadable, false); assert.match(tooLargeFile.reason, /file budget/);
  const huge = [...common, file('onnx/model_q4.onnx'), ...Array.from({ length: 5 }, (_, i) => file(`onnx/model_q4.onnx_data${i ? `_${i}` : ''}`, 1_900_000_000))];
  const tooLargePackage = resolve({ files: huge, config: { ...config, 'transformers.js_config': { use_external_data_format: 5 } } })[0];
  assert.equal(tooLargePackage.loadable, false); assert.match(tooLargePackage.reason, /file budget/);
});
