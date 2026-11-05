import { sha256 } from '@noble/hashes/sha2.js';
import { throwIfAborted, validateArtifactPath } from '../modelManifest.js';

export const GGUF_HUB_LIMITS = Object.freeze({ maximumBytes: 16 * 1024 ** 3,
  headerBytes: 16 * 1024 ** 2, rangeBytes: 1024 ** 2, metadata: 4096,
  tensors: 65536, arrayItems: 1048576, stringBytes: 1024 ** 2 });
export const GGUF_HUB_ARCHITECTURES = Object.freeze(['llama', 'qwen2', 'qwen3', 'qwen35', 'gemma', 'gemma2', 'gemma3', 'phi3']);
const SCHEMA = 'peercompute.gguf.header.v1';
const VERSION = '3.8.1';
// ggml/gguf constants and WebGPU supported_qtype at the runtime's pinned llama.cpp
// 46ca246de9bb1c35269722a6240d37d9dfd79cad. New codecs require explicit review.
const TYPES = new Map([
  [0, ['F32', 1, 4]], [1, ['F16', 1, 2]], [2, ['Q4_0', 32, 18]], [3, ['Q4_1', 32, 20]],
  [6, ['Q5_0', 32, 22]], [7, ['Q5_1', 32, 24]], [8, ['Q8_0', 32, 34]],
  [10, ['Q2_K', 256, 84]], [11, ['Q3_K', 256, 110]], [12, ['Q4_K', 256, 144]],
  [13, ['Q5_K', 256, 176]], [14, ['Q6_K', 256, 210]], [16, ['IQ2_XXS', 256, 66]],
  [17, ['IQ2_XS', 256, 74]], [18, ['IQ3_XXS', 256, 98]], [19, ['IQ1_S', 256, 50]],
  [20, ['IQ4_NL', 32, 18]], [21, ['IQ3_S', 256, 110]], [22, ['IQ2_S', 256, 82]],
  [23, ['IQ4_XS', 256, 136]], [29, ['IQ1_M', 256, 56]],
]);
const FILE_TYPES = new Map([[0, 'f32'], [1, 'f16'], [2, 'q4_0'], [3, 'q4_1'], [7, 'q8_0'],
  [8, 'q5_0'], [9, 'q5_1'], [10, 'q2_k'], [11, 'q3_k_s'], [12, 'q3_k_m'], [13, 'q3_k_l'],
  [14, 'q4_k_s'], [15, 'q4_k_m'], [16, 'q5_k_s'], [17, 'q5_k_m'], [18, 'q6_k'],
  [19, 'iq2_xxs'], [20, 'iq2_xs'], [21, 'q2_k_s'], [22, 'iq3_xs'], [23, 'iq3_xxs'],
  [24, 'iq1_s'], [25, 'iq4_nl'], [26, 'iq3_s'], [27, 'iq3_m'], [28, 'iq2_s'],
  [29, 'iq2_m'], [30, 'iq4_xs'], [31, 'iq1_m']]);
const decode = new TextDecoder('utf-8', { fatal: true });
const hex = (value) => Array.from(value, (byte) => byte.toString(16).padStart(2, '0')).join('');
const invalid = (message) => new Error(`Unsupported GGUF Hub package: ${message}`);
function bound(value, maximum, label, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw invalid(`invalid ${label}`);
  return value;
}
class IncompleteHeader extends Error { constructor() { super('Truncated GGUF header'); this.code = 'ERR_GGUF_HEADER_TRUNCATED'; } }

/** Parse metadata and the COMPLETE tensor directory; never interpret tensor data.
 * Token arrays are skipped in place rather than materialized. */
export function parseGgufHeader(bytes, { size } = {}) {
  if (!(bytes instanceof Uint8Array)) throw invalid('header bytes required');
  bound(size, GGUF_HUB_LIMITS.maximumBytes, 'file size', 24);
  if (bytes.length > GGUF_HUB_LIMITS.headerBytes || bytes.length > size) throw invalid('header byte budget exceeded');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  function take(length) {
    bound(length, GGUF_HUB_LIMITS.headerBytes, 'header field length');
    if (offset + length > GGUF_HUB_LIMITS.headerBytes) throw invalid('header byte budget exceeded');
    if (offset + length > bytes.length) throw new IncompleteHeader();
    const start = offset; offset += length; return start;
  }
  const u32 = () => view.getUint32(take(4), true);
  const u64 = () => {
    const value = view.getBigUint64(take(8), true);
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw invalid('unsafe 64-bit value');
    return Number(value);
  };
  function string(limit = GGUF_HUB_LIMITS.stringBytes, keep = true) {
    const length = bound(u64(), limit, 'string length');
    const start = take(length);
    return keep ? decode.decode(bytes.subarray(start, start + length)) : undefined;
  }
  function value(type, keep = true, array = false) {
    if (type === 8) return string(GGUF_HUB_LIMITS.stringBytes, keep);
    if (type === 9) {
      if (array) throw invalid('nested metadata arrays');
      const element = u32(), count = bound(u64(), GGUF_HUB_LIMITS.arrayItems, 'array count');
      if (element === 9 || element > 12) throw invalid('metadata array type');
      if (element === 8) for (let i = 0; i < count; i++) string(GGUF_HUB_LIMITS.stringBytes, false);
      else { const widths = [1, 1, 2, 2, 4, 4, 4, 1, 0, 0, 8, 8, 8]; take(count * widths[element]); }
      return { array: true, element, count };
    }
    const widths = [1, 1, 2, 2, 4, 4, 4, 1, 0, 0, 8, 8, 8];
    if (!widths[type]) throw invalid('metadata value type');
    const at = take(widths[type]);
    if (!keep) return undefined;
    if (type === 0) return view.getUint8(at);
    if (type === 1) return view.getInt8(at);
    if (type === 2) return view.getUint16(at, true);
    if (type === 3) return view.getInt16(at, true);
    if (type === 4) return view.getUint32(at, true);
    if (type === 5) return view.getInt32(at, true);
    if (type === 6) return view.getFloat32(at, true);
    if (type === 7) { const boolean = view.getUint8(at); if (boolean > 1) throw invalid('boolean value'); return Boolean(boolean); }
    if (type === 12) return view.getFloat64(at, true);
    const number = type === 10 ? view.getBigUint64(at, true) : view.getBigInt64(at, true);
    if (number > BigInt(Number.MAX_SAFE_INTEGER) || number < BigInt(Number.MIN_SAFE_INTEGER)) throw invalid('unsafe metadata integer');
    return Number(number);
  }
  if (u32() !== 0x46554747) throw invalid('magic or byte order');
  const version = u32(); if (![2, 3].includes(version)) throw invalid('version');
  const tensorCount = bound(u64(), GGUF_HUB_LIMITS.tensors, 'tensor count', 1);
  const metadataCount = bound(u64(), GGUF_HUB_LIMITS.metadata, 'metadata count', 1);
  const metadata = new Map();
  for (let i = 0; i < metadataCount; i++) {
    const key = string(512);
    if (!key || metadata.has(key) || /[\u0000-\u001f\u007f]/u.test(key)) throw invalid('duplicate or invalid metadata key');
    if (/georefine|tensor_extra|tensor_data_layout/i.test(key)) throw invalid('custom tensor layout requires catalog review');
    const type = u32();
    const keep = ['general.architecture', 'general.type', 'general.file_type', 'general.alignment',
      'general.name', 'general.quantization_version', 'split.count', 'split.no', 'split.tensors.count',
      'tokenizer.ggml.model', 'tokenizer.ggml.tokens'].includes(key);
    metadata.set(key, value(type, keep));
  }
  const architecture = metadata.get('general.architecture');
  if (!GGUF_HUB_ARCHITECTURES.includes(architecture)) throw invalid('architecture');
  if (metadata.has('general.type') && metadata.get('general.type') !== 'model') throw invalid('adapter or non-model GGUF');
  if (/georefine/i.test(metadata.get('general.name') ?? '')) throw invalid('custom GeoRefine model requires catalog review');
  if ((metadata.get('split.count') ?? 1) !== 1 || (metadata.get('split.no') ?? 0) !== 0
      || (metadata.get('split.tensors.count') ?? tensorCount) !== tensorCount) throw invalid('split GGUF requires complete shard admission');
  if (![undefined, 2].includes(metadata.get('general.quantization_version'))) throw invalid('quantization version');
  const fileType = metadata.get('general.file_type');
  if (!FILE_TYPES.has(fileType)) throw invalid('file quantization type');
  if (!['llama', 'gpt2'].includes(metadata.get('tokenizer.ggml.model'))
      || metadata.get('tokenizer.ggml.tokens')?.element !== 8
      || !metadata.get('tokenizer.ggml.tokens')?.count) throw invalid('self-contained supported tokenizer required');
  const alignment = bound(metadata.get('general.alignment') ?? 32, 4096, 'alignment', 1);
  if (alignment & (alignment - 1)) throw invalid('alignment must be a power of two');
  const names = new Set(), tensorTypes = new Set(), regions = [];
  let maximumTensorBytes = 0;
  for (let i = 0; i < tensorCount; i++) {
    const name = string(512);
    if (!name || names.has(name) || /georefine|[\u0000-\u001f\u007f]/iu.test(name)) throw invalid('duplicate or custom tensor name');
    names.add(name);
    const dimensions = bound(u32(), 4, 'tensor dimensions', 1);
    let elements = 1, row = 0;
    for (let d = 0; d < dimensions; d++) {
      const dimension = bound(u64(), GGUF_HUB_LIMITS.maximumBytes, 'tensor dimension', 1);
      if (d === 0) row = dimension;
      elements *= dimension; bound(elements, Number.MAX_SAFE_INTEGER, 'tensor element count', 1);
    }
    const type = u32(), codec = TYPES.get(type);
    if (!codec || row % codec[1]) throw invalid('unsupported tensor codec or quantized row shape');
    const tensorBytes = bound(elements / codec[1] * codec[2], size, 'tensor bytes', 1);
    const start = u64();
    if (start % alignment || start + tensorBytes > size) throw invalid('tensor offset exceeds file or alignment');
    regions.push({ start, end: start + tensorBytes }); tensorTypes.add(type);
    maximumTensorBytes = Math.max(maximumTensorBytes, tensorBytes);
  }
  if (!names.has('token_embd.weight') || !names.has('output_norm.weight')) throw invalid('text model tensor layout');
  const headerBytes = offset, dataOffset = Math.ceil(offset / alignment) * alignment;
  regions.sort((a, b) => a.start - b.start);
  let end = 0;
  for (const region of regions) {
    if (region.start < end || dataOffset + region.end > size) throw invalid('overlapping or truncated tensor data');
    end = region.end;
  }
  return { schema: SCHEMA, version, architecture, fileType, dtype: FILE_TYPES.get(fileType),
    tensorCount, metadataCount, headerBytes, dataOffset, maximumTensorBytes,
    tensorTypes: [...tensorTypes].sort((a, b) => a - b), headerSha256: hex(sha256(bytes.subarray(0, headerBytes))) };
}

/** At most 16MiB total reads, in <=1MiB ranges; no full weight download. */
export async function inspectGgufHeader({ readRange, size, signal } = {}) {
  if (typeof readRange !== 'function') throw invalid('range reader required');
  bound(size, GGUF_HUB_LIMITS.maximumBytes, 'file size', 24);
  let prefix = new Uint8Array(0), target = Math.min(64 * 1024, size);
  for (;;) {
    throwIfAborted(signal);
    const next = new Uint8Array(target); next.set(prefix);
    for (let at = prefix.length; at < target;) {
      const length = Math.min(GGUF_HUB_LIMITS.rangeBytes, target - at);
      const chunk = await readRange(at, length, { signal });
      throwIfAborted(signal);
      if (!(chunk instanceof Uint8Array) || chunk.length !== length) throw invalid('truncated range response');
      next.set(chunk, at); at += length;
    }
    prefix = next;
    try { return parseGgufHeader(prefix, { size }); }
    catch (error) {
      if (error.code !== 'ERR_GGUF_HEADER_TRUNCATED') throw error;
      if (target === size) throw error;
      if (target === GGUF_HUB_LIMITS.headerBytes) throw invalid('header exceeds bounded probe');
      target = Math.min(target * 2, size, GGUF_HUB_LIMITS.headerBytes);
    }
  }
}

function normalizeHeader(header) {
  if (!header || header.schema !== SCHEMA || ![2, 3].includes(header.version)
      || !GGUF_HUB_ARCHITECTURES.includes(header.architecture) || !FILE_TYPES.has(header.fileType)
      || FILE_TYPES.get(header.fileType) !== header.dtype
      || !/^[a-f0-9]{64}$/.test(header.headerSha256 ?? '')) throw invalid('header profile');
  for (const [key, maximum] of [['tensorCount', GGUF_HUB_LIMITS.tensors], ['metadataCount', GGUF_HUB_LIMITS.metadata],
    ['headerBytes', GGUF_HUB_LIMITS.headerBytes], ['dataOffset', GGUF_HUB_LIMITS.headerBytes + 4096],
    ['maximumTensorBytes', GGUF_HUB_LIMITS.maximumBytes]]) bound(header[key], maximum, key, 1);
  if (header.dataOffset < header.headerBytes || !Array.isArray(header.tensorTypes) || !header.tensorTypes.length
      || header.tensorTypes.length > TYPES.size || header.tensorTypes.some((type, index) =>
        !TYPES.has(type) || (index > 0 && type <= header.tensorTypes[index - 1]))) throw invalid('tensor profile');
  const keys = ['schema', 'version', 'architecture', 'fileType', 'dtype', 'tensorCount', 'metadataCount',
    'headerBytes', 'dataOffset', 'maximumTensorBytes', 'tensorTypes', 'headerSha256'];
  if (Object.keys(header).some((key) => !keys.includes(key))) throw invalid('unexpected header profile field');
  return Object.fromEntries(keys.map((key) => [key, header[key]]));
}

export function resolveGgufHubProfile({ repository, revision, file, header } = {}) {
  if (typeof repository !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(repository)
      || !/^[a-f0-9]{40}$/.test(revision ?? '')) throw invalid('immutable Hugging Face repository/revision required');
  validateArtifactPath(file?.path);
  if (!file.path.endsWith('.gguf') || !/^[a-f0-9]{64}$/.test(file.sha256 ?? '')) throw invalid('pinned GGUF SHA-256 required');
  bound(file.size, GGUF_HUB_LIMITS.maximumBytes, 'weight size', 24);
  const normalized = normalizeHeader(header);
  if (normalized.dataOffset + normalized.maximumTensorBytes > file.size) throw invalid('header/file size mismatch');
  const large = file.size > 4 * 1024 ** 3;
  return { model: { runtime: 'llama.cpp', runtimeVersion: VERSION,
    architecture: normalized.architecture === 'qwen35' ? 'qwen3_5' : normalized.architecture,
    format: 'GGUF', task: 'text-generation', dtype: normalized.dtype, modalities: ['text'],
    requiredFeatures: ['shader-f16'], repository, revision,
    gguf: { ...normalized, path: file.path, size: file.size, sha256: file.sha256 } },
  weights: [file], totalBytes: file.size, resourcePolicy: { maxModelBytes: GGUF_HUB_LIMITS.maximumBytes,
    minimumCpuBytes: (large ? 8 : 2) * 1024 ** 3, minimumGpuBytes: (large ? 16 : 2) * 1024 ** 3 } };
}

/** Metadata admission only. Actual bytes MUST also pass verifyGgufHubWeights in
 * the managed worker before native initialization. No boolean trust shortcut. */
export function validateGgufHubModel(model, { files, totalBytes } = {}) {
  if (!model?.gguf) throw invalid('bounded header profile required');
  const { path, size, sha256: digest, ...header } = model.gguf;
  const profile = resolveGgufHubProfile({ repository: model.repository, revision: model.revision,
    file: { path, size, sha256: digest }, header });
  for (const key of ['runtime', 'runtimeVersion', 'architecture', 'format', 'task', 'dtype']) {
    if (model[key] !== profile.model[key]) throw invalid(`model ${key} disagrees with header`);
  }
  if (JSON.stringify(model.modalities) !== '["text"]' || JSON.stringify(model.requiredFeatures) !== '["shader-f16"]') {
    throw invalid('text-only/f16 capability profile required');
  }
  if (files) {
    const weights = files.filter((file) => file.path.endsWith('.gguf'));
    if (weights.length !== 1 || weights[0].path !== path || weights[0].size !== size || weights[0].sha256 !== digest
        || files.some((file) => !/^[a-f0-9]{64}$/.test(file.sha256 ?? ''))) throw invalid('file closure/digest mismatch');
    profile.weights = weights;
    totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  }
  profile.totalBytes = bound(totalBytes ?? size, GGUF_HUB_LIMITS.maximumBytes, 'package bytes', size);
  return profile;
}

export async function verifyGgufHubWeights(model, weights, reader, { signal } = {}) {
  if (!model.gguf) return; // Existing immutable catalog packages retain their admission path.
  const declared = validateGgufHubModel(model, { files: weights }).model.gguf;
  const actual = await inspectGgufHeader({ size: weights[0].size, signal,
    readRange: (offset, length, options) => reader.read(weights[0].path, offset, length, options) });
  const { path, size, sha256: digest, ...expected } = declared;
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw invalid('stored header does not match inspected package');
}
