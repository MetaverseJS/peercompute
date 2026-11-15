import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { CID } from 'multiformats/cid';

export const MODEL_EVIDENCE_SCHEMA = 'peercompute.model-evidence.v1';
export const MODEL_EVIDENCE_LIMITS = Object.freeze({ recordBytes: 16 * 1024, frameBytes: 128 * 1024,
  batch: 6, query: 50, metrics: 16, features: 64, maximumEntries: 100000, maximumBytes: 256 * 1024 ** 2 });
const encoder = new TextEncoder();
const stages = ['inspection', 'admission', 'download', 'load', 'generation', 'device-loss'];
const outcomes = ['success', 'unsupported', 'failed', 'cancelled', 'incomplete', 'blocked'];
const reasons = ['architecture-unsupported', 'incomplete-package', 'access-required', 'policy-budget',
  'feature-unavailable', 'resource-exhausted', 'transport', 'artifact-invalid', 'runtime-error',
  'device-lost', 'timeout', 'cancelled', 'unknown'];
const gpuLimits = ['maxBufferSize', 'maxStorageBufferBindingSize', 'maxComputeWorkgroupStorageSize',
  'maxComputeInvocationsPerWorkgroup', 'maxStorageBuffersPerShaderStage'];
const workloadNumbers = ['inputTokens', 'outputTokens', 'maxNewTokens', 'contextTokens', 'imageWidth',
  'imageHeight', 'audioSamples', 'audioSampleRate', 'steps', 'concurrentModels'];
const optionNumbers = ['contextTokens', 'gpuLayers', 'threads', 'batchSize'];
const metricDefinitions = Object.freeze({
  durationMs: { unit: 'ms', scopes: ['operation'], methods: ['clock'] },
  requestedGpuBufferPeakBytes: { unit: 'bytes', scopes: ['runtime-owned-buffers'], methods: ['allocation-counter'] },
  wasmMemoryBytes: { unit: 'bytes', scopes: ['worker-wasm-memory'], methods: ['wasm-memory-buffer'] },
  processRssPeakBytes: { unit: 'bytes', scopes: ['process'], methods: ['native-process-sampler'] },
  physicalGpuPeakBytes: { unit: 'bytes', scopes: ['device', 'process'], methods: ['native-driver-sampler'] },
  estimatedCpuBytes: { unit: 'bytes', scopes: ['model-planning-envelope'], methods: ['planner'] },
  estimatedGpuBytes: { unit: 'bytes', scopes: ['model-planning-envelope'], methods: ['planner'] },
  gpuDispatches: { unit: 'count', scopes: ['operation', 'runtime-session'], methods: ['dispatch-counter'] },
  gpuSubmissions: { unit: 'count', scopes: ['operation', 'runtime-session'], methods: ['dispatch-counter'] }
});

function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(`Invalid evidence ${label}`);
  return value;
}
export function evidenceInteger(value, maximum = Number.MAX_SAFE_INTEGER, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new TypeError('Invalid evidence integer');
  return value;
}
function text(value, maximum = 128) {
  if (typeof value !== 'string' || !value.length || encoder.encode(value).length > maximum
      || /[\u0000-\u001f\u007f]/u.test(value)) throw new TypeError('Invalid evidence text');
  return value;
}
export function evidencePeerId(value) {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(text(value))) throw new TypeError('Invalid evidence peer identity');
  return value;
}
function token(value, maximum = 128) {
  if (!/^[a-zA-Z0-9_.+ -]+$/.test(text(value, maximum))) throw new TypeError('Invalid evidence version or label');
  return value;
}
function choice(value, choices, label) {
  if (!choices.includes(value)) throw new TypeError(`Invalid evidence ${label}`);
  return value;
}
function digest(value) {
  if (!/^[a-f0-9]{64}$/.test(value)) throw new TypeError('Invalid evidence digest');
  return value;
}
function cid(value) { return CID.parse(text(value, 128)).toV1().toString(); }
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
export function evidenceDigest(value) { return bytesToHex(sha256(encoder.encode(JSON.stringify(canonical(value))))); }
export function evidenceBytes(value) { return encoder.encode(JSON.stringify(value)).length; }

/** Identity of immutable package bytes, independent of manifest/runtime metadata. */
export function modelPackageFingerprint(files) {
  if (!Array.isArray(files) || !files.length || files.length > 1024) throw new TypeError('Invalid evidence package files');
  const seen = new Set();
  return evidenceDigest(files.map(file => {
    const path = text(file.path, 512);
    if (/[\\%?#:\u0000-\u001f\u007f]/u.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')
        || seen.has(path)) throw new TypeError('Invalid evidence package path');
    seen.add(path);
    const hash = file.sha256 ? { sha256: digest(file.sha256) } : { gitBlobSha1: file.gitBlobSha1 };
    if (hash.gitBlobSha1 !== undefined && !/^[a-f0-9]{40}$/.test(hash.gitBlobSha1)) throw new TypeError('Invalid evidence Git digest');
    if (!hash.sha256 && !hash.gitBlobSha1) throw new TypeError('Evidence package requires source digests');
    return { path, size: evidenceInteger(file.size), ...hash };
  }).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}
function source(input) {
  object(input, 'source'); const result = {};
  if (input.repository !== undefined || input.revision !== undefined) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(text(input.repository, 256)) || !/^[a-f0-9]{40}$/.test(input.revision)) {
      throw new TypeError('Evidence requires an immutable Hugging Face repository revision');
    }
    result.repository = input.repository; result.revision = input.revision;
  }
  if (input.manifestCid !== undefined) result.manifestCid = cid(input.manifestCid);
  if (!result.repository && !result.manifestCid) throw new TypeError('Evidence requires immutable model identity');
  if (input.packageFingerprint !== undefined) result.packageFingerprint = digest(input.packageFingerprint);
  if (input.variant !== undefined) {
    result.variant = text(input.variant, 512);
    if (/[\\%?#:]/.test(result.variant) || result.variant.split('/').some(part => !part || part === '.' || part === '..')) throw new TypeError('Invalid evidence variant');
  }
  return result;
}
function compatibility(input) {
  object(input, 'compatibility');
  const result = { clientBuild: token(input.clientBuild), inspectorVersion: token(input.inspectorVersion), policyVersion: token(input.policyVersion) };
  for (const field of ['runtime', 'runtimeVersion']) if (input[field] !== undefined) result[field] = token(input[field]);
  if (input.runtimeDigest !== undefined) result.runtimeDigest = digest(input.runtimeDigest);
  return result;
}
function environment(input) {
  object(input, 'environment'); const result = { kind: choice(input.kind, ['browser', 'native', 'unknown'], 'environment kind') };
  for (const key of ['browserFamily', 'browserVersion', 'os']) if (input[key] !== undefined) result[key] = token(input[key]);
  if (input.deviceMemoryGiB !== undefined) {
    if (!Number.isFinite(input.deviceMemoryGiB) || input.deviceMemoryGiB <= 0 || input.deviceMemoryGiB > 65536) throw new TypeError('Invalid coarse device memory');
    result.deviceMemoryGiB = input.deviceMemoryGiB;
  }
  if (input.capabilities !== undefined) {
    object(input.capabilities, 'capabilities'); result.capabilities = {};
    for (const key of ['webgpu', 'crossOriginIsolated', 'sharedArrayBuffer', 'wasmMemory64', 'wasmJSPI']) {
      if (input.capabilities[key] === undefined) continue;
      if (typeof input.capabilities[key] !== 'boolean') throw new TypeError('Invalid evidence capability');
      result.capabilities[key] = input.capabilities[key];
    }
  }
  if (input.gpu !== undefined) {
    object(input.gpu, 'GPU'); result.gpu = {};
    for (const key of ['vendor', 'architecture']) if (input.gpu[key] !== undefined) result.gpu[key] = token(input.gpu[key]);
    if (input.gpu.features !== undefined) {
      if (!Array.isArray(input.gpu.features) || input.gpu.features.length > MODEL_EVIDENCE_LIMITS.features) throw new TypeError('Invalid evidence GPU features');
      result.gpu.features = [...new Set(input.gpu.features.map(value => token(value, 80)))].sort();
    }
    if (input.gpu.limits !== undefined) {
      object(input.gpu.limits, 'GPU limits'); result.gpu.limits = {};
      for (const key of gpuLimits) if (input.gpu.limits[key] !== undefined) result.gpu.limits[key] = evidenceInteger(input.gpu.limits[key]);
    }
  }
  return result;
}
function numericFields(input, keys) {
  object(input, 'numeric fields'); const result = {};
  for (const key of keys) if (input[key] !== undefined) result[key] = evidenceInteger(input[key]);
  return result;
}

/** Explicit projection: arbitrary metadata, model output and errors never escape. */
export function normalizeModelEvidence(input) {
  object(input, 'record');
  if (input.schema !== MODEL_EVIDENCE_SCHEMA) throw new TypeError('Unsupported model evidence schema');
  const record = { schema: MODEL_EVIDENCE_SCHEMA, observedAt: evidenceInteger(input.observedAt),
    source: source(input.source), compatibility: compatibility(input.compatibility), environment: environment(input.environment),
    stage: choice(input.stage, stages, 'stage'), outcome: choice(input.outcome, outcomes, 'outcome') };
  if (input.executorPeerId !== undefined) record.executorPeerId = evidencePeerId(input.executorPeerId);
  if (['load', 'generation', 'device-loss'].includes(record.stage)
      && (!record.executorPeerId || !record.compatibility.runtime || !record.compatibility.runtimeVersion || record.environment.kind === 'unknown')) {
    throw new TypeError('Execution evidence requires the actual host, runtime version and environment');
  }
  if (['load', 'generation', 'device-loss'].includes(record.stage) && !record.source.manifestCid && !record.source.packageFingerprint) {
    throw new TypeError('Execution evidence requires an exact package fingerprint or manifest CID');
  }
  if (input.reason !== undefined) record.reason = choice(input.reason, reasons, 'reason');
  if (input.errorCode !== undefined) {
    if (!/^ERR_[A-Z0-9_]{1,76}$/.test(input.errorCode)) throw new TypeError('Invalid evidence error code');
    record.errorCode = input.errorCode;
  }
  if (input.workload !== undefined) {
    record.workload = numericFields(input.workload, workloadNumbers);
    if (input.workload.task !== undefined) record.workload.task = choice(input.workload.task,
      ['text-generation', 'image-text-to-text', 'audio-text-to-text', 'text-to-image', 'image-to-3d', 'automatic-speech-recognition', 'text-to-speech'], 'task');
  }
  if (input.runtimeOptions !== undefined) record.runtimeOptions = numericFields(input.runtimeOptions, optionNumbers);
  if (input.metrics !== undefined) {
    if (!Array.isArray(input.metrics) || input.metrics.length > MODEL_EVIDENCE_LIMITS.metrics) throw new TypeError('Invalid evidence metrics');
    record.metrics = input.metrics.map(metric => {
      const definition = metricDefinitions[metric?.name];
      if (!definition) throw new TypeError('Invalid evidence metric');
      const result = { name: metric.name, value: evidenceInteger(metric.value), unit: choice(metric.unit, [definition.unit], 'metric unit'),
        scope: choice(metric.scope, definition.scopes, 'metric scope'), method: choice(metric.method, definition.methods, 'metric method') };
      if (result.method.startsWith('native-') && record.environment.kind !== 'native') throw new TypeError('Native memory observation cannot be attributed to a browser');
      if (metric.sampleIntervalMs !== undefined) result.sampleIntervalMs = evidenceInteger(metric.sampleIntervalMs, 60000, 1);
      return result;
    });
  }
  record.compatibilityDigest = evidenceDigest(record.compatibility);
  record.environmentDigest = evidenceDigest(record.environment);
  record.id = `sha256-${evidenceDigest(record)}`;
  if (input.id !== undefined && input.id !== record.id) throw new TypeError('Evidence identity does not match normalized contents');
  if (evidenceBytes(record) > MODEL_EVIDENCE_LIMITS.recordBytes) throw new RangeError('Evidence record exceeds its byte limit');
  return record;
}

export function normalizeEvidenceQuery(input = {}) {
  object(input, 'query'); const query = { limit: evidenceInteger(input.limit ?? 50, MODEL_EVIDENCE_LIMITS.query, 1) };
  for (const key of ['manifestCid', 'packageFingerprint', 'compatibilityDigest', 'environmentDigest']) {
    if (input[key] !== undefined) query[key] = key === 'manifestCid' ? cid(input[key]) : digest(input[key]);
  }
  if (input.repository !== undefined) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(text(input.repository, 256))) throw new TypeError('Invalid evidence repository');
    query.repository = input.repository;
  }
  if (input.revision !== undefined) {
    if (!/^[a-f0-9]{40}$/.test(input.revision)) throw new TypeError('Invalid evidence revision'); query.revision = input.revision;
  }
  if (input.stage !== undefined) query.stage = choice(input.stage, stages, 'query stage');
  if (input.reporterPeerId !== undefined) query.reporterPeerId = evidencePeerId(input.reporterPeerId);
  if (input.beforeSequence !== undefined) query.beforeSequence = evidenceInteger(input.beforeSequence, Number.MAX_SAFE_INTEGER, 1);
  return query;
}

/** Different policy/runtime/hardware observations remain historical, never a veto. */
export function evidenceApplicability(report, current) {
  const saved = normalizeModelEvidence(report), target = compatibility(current.compatibility);
  const changed = [];
  for (const key of ['inspectorVersion', 'policyVersion', 'runtime', 'runtimeVersion', 'runtimeDigest']) {
    if (saved.compatibility[key] !== target[key]) changed.push(key);
  }
  if (current.environment && saved.environmentDigest !== evidenceDigest(environment(current.environment))) changed.push('environment');
  return { current: changed.length === 0, changed, action: changed.length ? saved.stage === 'inspection' ? 'reinspect' : 'retest' : 'compare-workload' };
}
