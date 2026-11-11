import { GGUF_HUB_ARCHITECTURES, GGUF_HUB_LIMITS, inspectGgufHeader } from './hubAdmission.js';
import { throwIfAborted, validateArtifactPath } from '../modelManifest.js';

export const GGUF_LORA_SCHEMA = 'peercompute.gguf.lora-header.v1';
const invalid = (message) => new Error(`Unsupported GGUF LoRA: ${message}`);
const digest = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const integer = (value, maximum, minimum = 1) => Number.isSafeInteger(value) && value >= minimum && value <= maximum;
const architectureOf = (value) => value === 'qwen3_5' ? 'qwen35' : value;

/** Compact inspection receipt; tensors are re-read and paired inside the worker. */
export function normalizeGgufLoraProfile(header) {
  if (!header || header.schema !== GGUF_LORA_SCHEMA || ![2, 3].includes(header.version)
      || !GGUF_HUB_ARCHITECTURES.includes(header.architecture) || ![null, 0, 1].includes(header.fileType)
      || header.dtype !== (header.fileType === 0 ? 'f32' : header.fileType === 1 ? 'f16' : 'float')
      || !digest(header.headerSha256) || !Number.isFinite(header.alpha) || header.alpha < 0 || header.alpha > 65536
      || !integer(header.tensorCount, GGUF_HUB_LIMITS.tensors) || header.tensorCount % 2
      || !integer(header.targetCount, GGUF_HUB_LIMITS.tensors / 2) || header.tensorCount !== header.targetCount * 2
      || !integer(header.metadataCount, GGUF_HUB_LIMITS.metadata)
      || !integer(header.headerBytes, GGUF_HUB_LIMITS.headerBytes)
      || !integer(header.dataOffset, GGUF_HUB_LIMITS.headerBytes + 4096) || header.dataOffset < header.headerBytes
      || !integer(header.maximumTensorBytes, GGUF_HUB_LIMITS.maximumBytes)
      || !Array.isArray(header.tensorTypes) || !header.tensorTypes.length || header.tensorTypes.length > 2
      || header.tensorTypes.some((type, index) => ![0, 1].includes(type) || (index && type <= header.tensorTypes[index - 1]))) {
    throw invalid('invalid bounded adapter header profile');
  }
  const keys = ['schema', 'version', 'architecture', 'fileType', 'dtype', 'tensorCount', 'metadataCount',
    'headerBytes', 'dataOffset', 'maximumTensorBytes', 'tensorTypes', 'headerSha256', 'alpha', 'targetCount'];
  if (Object.keys(header).some((key) => !keys.includes(key) && key !== 'tensorInfo')) throw invalid('unexpected adapter profile field');
  return Object.fromEntries(keys.map((key) => [key, key === 'tensorTypes' ? [...header[key]] : header[key]]));
}

/** A source revision identifies adapter bytes, not an asserted training revision. */
export function resolveGgufLoraProfile({ repository, revision, path, file, header, scale = 1 } = {}) {
  if (typeof repository !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(repository)
      || !/^[a-f0-9]{40}$/.test(revision ?? '')) throw invalid('immutable adapter repository and revision required');
  validateArtifactPath(file?.path);
  validateArtifactPath(path ?? file.path);
  if (!file.path.endsWith('.gguf') || !digest(file.sha256) || !integer(file.size, GGUF_HUB_LIMITS.maximumBytes, 24)
      || !Number.isFinite(scale) || scale < -2 || scale > 2) throw invalid('invalid adapter file or scale');
  const profile = normalizeGgufLoraProfile(header);
  if (profile.dataOffset + profile.maximumTensorBytes > file.size) throw invalid('adapter profile exceeds file size');
  return { role: 'lora', format: 'GGUF', file: { ...file }, scale,
    source: { repository, revision, path: path ?? file.path }, profile };
}

/** Shape compatibility is necessary, but does not prove training provenance or quality. */
export function validateGgufLoraPair(baseHeader, adapterHeader) {
  const profile = normalizeGgufLoraProfile(adapterHeader);
  if (baseHeader?.schema !== 'peercompute.gguf.header.v1' || baseHeader.architecture !== profile.architecture
      || !Array.isArray(baseHeader.tensorInfo) || baseHeader.tensorInfo.length !== baseHeader.tensorCount
      || !integer(baseHeader.tensorCount, GGUF_HUB_LIMITS.tensors)
      || !Array.isArray(adapterHeader.tensorInfo) || adapterHeader.tensorInfo.length !== profile.tensorCount) {
    throw invalid('base architecture or complete tensor directories do not match');
  }
  const bases = new Map(baseHeader.tensorInfo.map((tensor) => [tensor.name, tensor]));
  const tensors = new Map(adapterHeader.tensorInfo.map((tensor) => [tensor.name, tensor]));
  if (bases.size !== baseHeader.tensorCount || tensors.size !== profile.tensorCount) throw invalid('duplicate tensor directory entries');
  let targetCount = 0;
  for (const tensor of tensors.values()) {
    const match = /^(.+\.weight)\.lora_([ab])$/.exec(tensor.name);
    if (!match || /\.lora_[ab]/.test(match[1]) || ![0, 1].includes(tensor.type)
        || !Array.isArray(tensor.shape) || tensor.shape.length !== 2
        || tensor.shape.some((n) => !integer(n, GGUF_HUB_LIMITS.maximumBytes))) throw invalid('ordinary matrix adapter required');
    if (match[2] === 'b') continue;
    const target = bases.get(match[1]), a = tensor, b = tensors.get(`${match[1]}.lora_b`);
    if (!target || !b || target.shape?.length !== 2) throw invalid('missing matrix target or LoRA pair in selected base');
    const embedding = match[1] === 'token_embd.weight';
    const rank = embedding ? a.shape[0] : a.shape[1];
    if (!integer(rank, 1024) || rank !== b.shape?.[0]
        || (embedding ? target.shape[0] !== b.shape?.[1] || target.shape[1] !== a.shape[1]
          : target.shape[0] !== a.shape[0] || target.shape[1] !== b.shape?.[1])) {
      throw invalid('adapter tensor dimensions do not match selected base');
    }
    targetCount++;
  }
  if (targetCount !== profile.targetCount) throw invalid('incomplete LoRA tensor pairs');
  return { architecture: profile.architecture, targetCount, tensorCount: profile.tensorCount, alpha: profile.alpha };
}

export function validateGgufLoraAdapters(baseModel, weights, adapters) {
  if (!Array.isArray(adapters) || adapters.length < 1 || adapters.length > 4
      || baseModel?.runtime !== 'llama.cpp' || !Array.isArray(weights) || weights.length !== 1) {
    throw invalid('one complete base GGUF and one to four adapters required');
  }
  const paths = new Set(weights.map((file) => file.path));
  let totalBytes = weights[0].size;
  return adapters.map((adapter) => {
    if (!adapter || adapter.role !== 'lora' || adapter.format !== 'GGUF') throw invalid('unsupported adapter runtime or role');
    const normalized = resolveGgufLoraProfile({ ...adapter.source, file: adapter.file,
      header: adapter.profile, scale: adapter.scale });
    if (normalized.profile.architecture !== architectureOf(baseModel.architecture)) throw invalid('adapter and base architectures differ');
    if (paths.has(normalized.file.path)) throw invalid('duplicate adapter or base file path');
    paths.add(normalized.file.path); totalBytes += normalized.file.size;
    if (!integer(totalBytes, GGUF_HUB_LIMITS.maximumBytes)) throw invalid('combined package exceeds runtime byte budget');
    return normalized;
  });
}

/** Verify bytes via the retained CID reader, never trust client tensor/target claims. */
export async function verifyGgufLoraAdapters(baseModel, weights, adapters, reader, { signal } = {}) {
  const normalized = validateGgufLoraAdapters(baseModel, weights, adapters);
  const inspect = (file, kind) => inspectGgufHeader({ size: file.size, kind, includeTensorInfo: true, signal,
    readRange: (offset, length, options) => reader.read(file.path, offset, length, options) });
  throwIfAborted(signal);
  const baseHeader = await inspect(weights[0], 'model');
  if (baseHeader.architecture !== architectureOf(baseModel.architecture)
      || (baseModel.gguf && baseHeader.headerSha256 !== baseModel.gguf.headerSha256)) throw invalid('stored base header differs from selected model');
  const receipts = [];
  for (const adapter of normalized) {
    throwIfAborted(signal);
    const actual = await inspect(adapter.file, 'lora');
    if (JSON.stringify(normalizeGgufLoraProfile(actual)) !== JSON.stringify(adapter.profile)) {
      throw invalid('stored adapter header differs from inspected file');
    }
    receipts.push({ path: adapter.file.path, ...validateGgufLoraPair(baseHeader, actual) });
  }
  return receipts;
}
