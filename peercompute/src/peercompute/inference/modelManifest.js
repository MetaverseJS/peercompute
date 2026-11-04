import { CID } from 'multiformats/cid';

export const MODEL_RUNTIME = 'transformers.js';
export const MODEL_RUNTIME_VERSION = '4.3.2';
export const MODEL_POLICY = Object.freeze({
  maxManifestBytes: 256 * 1024,
  maxFiles: 1024,
  maxModelBytes: 1536 * 1024 * 1024,
  maxContextTokens: 2048,
  maxNewTokens: 1024,
  maxPromptBytes: 64 * 1024,
  maxOutputBytes: 64 * 1024,
  maxMessages: 64,
  maxQueued: 4,
  chunkBytes: 256 * 1024,
  maxReads: 4,
  maxImagePixels: 1024 * 1024,
  maxImageBytes: 4 * 1024 * 1024,
});

const QWEN35_POLICY = Object.freeze({ maxModelBytes: 2 * 1024 ** 3,
  minimumCpuBytes: 8 * 1024 ** 3, minimumGpuBytes: 8 * 1024 ** 3,
  maxProcessedImagePixels: 512 * 512 });
const DEFAULT_RESOURCE_POLICY = Object.freeze({ maxModelBytes: MODEL_POLICY.maxModelBytes,
  minimumCpuBytes: 0, minimumGpuBytes: 0, maxProcessedImagePixels: MODEL_POLICY.maxImagePixels });

/** Trusted application limits; a manifest cannot increase its own resource envelope. */
export function modelResourcePolicy(model) {
  return model?.architecture === 'qwen3_5' ? QWEN35_POLICY : DEFAULT_RESOURCE_POLICY;
}

export function abortError(reason = 'Operation cancelled') {
  if (reason?.name === 'AbortError') return reason;
  return new DOMException(typeof reason === 'string' ? reason : 'Operation cancelled', 'AbortError');
}

export function throwIfAborted(signal) {
  if (signal?.aborted) throw abortError(signal.reason);
}

export function validateSessionId(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) {
    throw new Error('Invalid model session ID');
  }
  return value;
}

export function validateArtifactPath(value) {
  if (typeof value !== 'string' || !value || new TextEncoder().encode(value).length > 512
      || /[\\%?#:\u0000-\u001f\u007f]/.test(value) || value.startsWith('/')
      || value.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error('Invalid model artifact path');
  }
  return value;
}

export function validateModelManifest(input) {
  let serialized;
  try { serialized = JSON.stringify(input); } catch { throw new Error('Invalid model manifest'); }
  if (!serialized || new TextEncoder().encode(serialized).length > MODEL_POLICY.maxManifestBytes) {
    throw new Error('Model manifest exceeds its metadata budget');
  }
  const manifest = JSON.parse(serialized);
  if (manifest.schema !== 'peercompute.artifact.manifest.v1'
      || !Array.isArray(manifest.files) || !manifest.files.length
      || manifest.files.length > MODEL_POLICY.maxFiles) throw new Error('Invalid model manifest files');
  const paths = new Set();
  const resourcePolicy = modelResourcePolicy(manifest.model);
  let totalBytes = 0;
  for (const file of manifest.files) {
    validateArtifactPath(file.path);
    if (paths.has(file.path)) throw new Error('Duplicate model artifact path');
    paths.add(file.path);
    const cid = CID.parse(file.cid);
    if (![0x55, 0x70].includes(cid.code) || cid.multihash.code !== 0x12 || cid.multihash.size !== 32) {
      throw new Error('Unsupported model artifact CID');
    }
    if (!Number.isSafeInteger(file.size) || file.size < 0
        || !/^[a-f0-9]{64}$/i.test(file.sha256 ?? '')) throw new Error('Invalid model file size/digest');
    file.sha256 = file.sha256.toLowerCase();
    totalBytes += file.size;
    if (!Number.isSafeInteger(totalBytes) || totalBytes > resourcePolicy.maxModelBytes) {
      throw new Error('Model exceeds its admitted file budget');
    }
  }
  const model = manifest.model;
  if (model?.runtime !== MODEL_RUNTIME || model.runtimeVersion !== MODEL_RUNTIME_VERSION
      || !['qwen3', 'idefics3', 'smolvlm', 'qwen3_5'].includes(model.architecture)) {
    throw new Error('Model runtime, architecture or dtype is not approved');
  }
  model.task ??= model.architecture === 'qwen3' ? 'text-generation' : 'image-text-to-text';
  if (!['text-generation', 'image-text-to-text'].includes(model.task)
      || (model.architecture === 'qwen3') !== (model.task === 'text-generation')) {
    throw new Error('Model task does not match its admitted architecture');
  }
  const dtypeEntries = typeof model.dtype === 'string' ? [['model', model.dtype]]
    : model.dtype && typeof model.dtype === 'object' && !Array.isArray(model.dtype)
      ? Object.entries(model.dtype) : [];
  if (!dtypeEntries.length || dtypeEntries.length > 16 || dtypeEntries.some(([name, dtype]) =>
    !/^[A-Za-z0-9_-]{1,100}$/.test(name) || !['fp32', 'fp16', 'q4', 'q4f16', 'q8'].includes(dtype))) {
    throw new Error('Invalid model dtype configuration');
  }
  if (model.architecture === 'qwen3_5' && dtypeEntries.some(([, dtype]) => dtype !== 'q4')) {
    throw new Error('Qwen3.5 admits q4 language and vision modules');
  }
  const suffix = (dtype) => dtype === 'fp32' ? '' : dtype === 'q8' ? '_quantized' : `_${dtype}`;
  const required = ['config.json', 'tokenizer.json', 'tokenizer_config.json'];
  if (typeof model.dtype !== 'string' || model.task === 'text-generation') {
    required.push(...dtypeEntries.map(([name, dtype]) => `onnx/${name}${suffix(dtype)}.onnx`));
  }
  if (model.task === 'image-text-to-text') {
    for (const name of ['embed_tokens', 'vision_encoder', 'decoder_model_merged']) {
      const dtype = typeof model.dtype === 'string' ? model.dtype : model.dtype[name];
      if (!dtype) throw new Error('Multimodal dtype configuration is missing a module');
      required.push(`onnx/${name}${suffix(dtype)}.onnx`);
      if (model.architecture === 'qwen3_5') required.push(`onnx/${name}${suffix(dtype)}.onnx_data`);
    }
  }
  if (required.some((path) => !paths.has(path))) throw new Error('Incomplete model package');
  if (model.task === 'image-text-to-text' && !paths.has('preprocessor_config.json')
      && !paths.has('processor_config.json')) throw new Error('Multimodal processor configuration is missing');
  if (model.requiredFeatures !== undefined && (!Array.isArray(model.requiredFeatures)
      || model.requiredFeatures.length > 32
      || model.requiredFeatures.some((feature) => typeof feature !== 'string' || feature.length > 80))) {
    throw new Error('Invalid model GPU features');
  }
  return { manifest, totalBytes, resourcePolicy };
}

export function validateRuntimeAssets(assets, baseUrl) {
  const base = new URL(baseUrl);
  const result = {};
  for (const key of ['mjs', 'wasm']) {
    if (typeof assets?.[key] !== 'string') throw new Error('Trusted ORT runtime assets are required');
    const url = new URL(assets[key], base);
    if (url.origin !== base.origin || url.username || url.password || url.hash
        || !['http:', 'https:'].includes(url.protocol) || !url.pathname.endsWith(`.${key}`)) {
      throw new Error('ORT assets must be approved same-origin runtime files');
    }
    result[key] = url.href;
  }
  return result;
}
