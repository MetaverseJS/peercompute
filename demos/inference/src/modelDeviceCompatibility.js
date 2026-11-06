import { validateGgufHubModel } from '../../../peercompute/src/peercompute/inference/gguf/hubAdmission.js';
import { MODEL_POLICY, MODEL_RUNTIME_VERSION, modelResourcePolicy } from '../../../peercompute/src/peercompute/inference/modelManifest.js';
import { getModelCapability, ONNX_CAPABILITY_LIMITS } from '../../../peercompute/src/peercompute/inference/modelCapabilities.js';
import { MODEL_CATALOG } from '../../../peercompute/src/peercompute/inference/modelCatalog.js';
import { GGUF_MODEL_CATALOG } from '../../../peercompute/src/peercompute/artifacts/ggufModelCatalog.js';
import { DIFFUSION_MODEL_CATALOG } from '../../../peercompute/src/peercompute/artifacts/diffusionModelCatalog.js';

const GiB = 1024 ** 3;
const catalogs = [...Object.values(MODEL_CATALOG), ...Object.values(GGUF_MODEL_CATALOG), ...Object.values(DIFFUSION_MODEL_CATALOG)];
const limitNames = ['maxBufferSize', 'maxStorageBufferBindingSize', 'maxComputeWorkgroupStorageSize',
  'maxComputeInvocationsPerWorkgroup', 'maxComputeWorkgroupSizeX', 'maxComputeWorkgroupSizeY',
  'maxComputeWorkgroupSizeZ', 'maxComputeWorkgroupsPerDimension'];
const runtimes = new Set(['transformers.js', 'llama.cpp', 'onnx-diffusion']);

/** Resolve a catalog identity without choosing the first same-revision variant. */
export function findModelCatalogEntry(entry, entries = catalogs) {
  const input = entry?.model ?? entry ?? {};
  const candidates = entries.filter((candidate) => candidate.model.runtime === input.runtime
    && (candidate.repository ?? candidate.model.repository) === (input.repository ?? entry?.repository)
    && (candidate.revision ?? candidate.model.revision) === (input.revision ?? entry?.revision)
    && ['architecture', 'task', 'format', 'dtype'].every((key) =>
      (!entry?.model && input[key] === undefined) || sameValue(input[key], candidate.model[key]))
    && (!entry?.model || !Array.isArray(entry.files) || !Array.isArray(candidate.files)
      || catalogFilesMatch(input.runtime, entry.files, candidate.files)));
  // Repositories may publish several quantizations at the same immutable
  // revision. A peer's catalog ID can disambiguate omitted display metadata,
  // but cannot override conflicting provenance or an explicit precision.
  return candidates.length === 1 ? candidates[0]
    : !entry?.model ? candidates.find((candidate) => candidate.id === entry?.modelId) : undefined;
}

function catalogFilesMatch(runtime, actualFiles, expectedFiles) {
  const weight = (file) => runtime !== 'llama.cpp' || file.path?.endsWith('.gguf');
  const actual = actualFiles.filter(weight), expected = expectedFiles.filter(weight);
  return actual.length === expected.length && actual.every((file) => expected.some((item) =>
    item.path === file.path && item.size === file.size && (item.sha256 === undefined || item.sha256 === file.sha256)));
}

function profile(entry) {
  const input = entry?.model ?? entry ?? {};
  const trusted = findModelCatalogEntry(entry);
  // Display-only peer descriptors may identify a catalog entry; their memory
  // claims and purported allocation requirements are never trusted.
  const model = entry?.model ? input : trusted?.model ?? input;
  const files = entry?.files ?? trusted?.files;
  let totalBytes = null;
  if (files !== undefined) {
    if (!Array.isArray(files) || !files.length || files.length > MODEL_POLICY.maxFiles) throw new Error('Invalid model file list');
    totalBytes = 0;
    for (const file of files) {
      if (!file || !Number.isSafeInteger(file.size) || file.size < 0) throw new Error('Invalid model file size');
      totalBytes += file.size;
      if (!Number.isSafeInteger(totalBytes)) throw new Error('Invalid model package size');
    }
  } else if (Number.isSafeInteger(entry?.totalBytes) && entry.totalBytes >= 0) totalBytes = entry.totalBytes;
  return { model, files, trusted, totalBytes, descriptorOnly: !entry?.model && !trusted && files === undefined };
}

/** Configured resident reservations, deliberately not detected device memory. */
export function modelMemoryEstimate(entryOrManifest) {
  const { model, totalBytes, files, descriptorOnly } = profile(entryOrManifest);
  if (model.runtime === 'onnx-diffusion') return { cpuBytes: 8 * GiB, gpuBytes: 8 * GiB };
  if (model.runtime === 'llama.cpp') {
    if (totalBytes === null) return { cpuBytes: 0, gpuBytes: 0 };
    const large = totalBytes > 4 * GiB;
    return { cpuBytes: (large ? 8 : 2) * GiB, gpuBytes: (large ? 16 : 2) * GiB };
  }
  if (model.runtime === 'transformers.js') {
    if (descriptorOnly) return { cpuBytes: 4 * GiB, gpuBytes: 4 * GiB };
    const policy = modelResourcePolicy(model, { ...(files ? { files } : {}), ...(totalBytes !== null ? { totalBytes } : {}) });
    return { cpuBytes: Math.max(4 * GiB, policy.minimumCpuBytes), gpuBytes: Math.max(4 * GiB, policy.minimumGpuBytes) };
  }
  throw new Error('Unsupported model runtime');
}

export function normalizeModelMemoryBudgets(input = {}) {
  if (input === null) input = {};
  if (typeof input !== 'object' || Array.isArray(input)
      || ![Object.prototype, null].includes(Object.getPrototypeOf(input))
      || Object.keys(input).some((key) => !['cpuBytes', 'gpuBytes'].includes(key))) throw new TypeError('Invalid model memory budgets');
  const result = {};
  for (const key of ['cpuBytes', 'gpuBytes']) {
    const value = input[key];
    if (value == null) result[key] = null;
    else if (!Number.isSafeInteger(value) || value <= 0 || value > 1024 * GiB) throw new RangeError(`Invalid ${key} memory budget`);
    else result[key] = value;
  }
  return result;
}

/** Read-only capability probe: no devices, workers, weight requests or large
 * allocation tests. A timeout is unknown, not proof that WebGPU is absent. */
export async function collectModelDeviceCapabilities({ scope = globalThis, timeoutMs = 3000 } = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) throw new RangeError('Invalid device probe timeout');
  const wasm = scope.WebAssembly;
  const memoryHint = scope.navigator?.deviceMemory;
  const result = { webgpu: null, features: [], limits: {}, crossOriginIsolated: scope.crossOriginIsolated === true,
    sharedArrayBuffer: typeof scope.SharedArrayBuffer === 'function',
    jspi: typeof wasm?.Suspending === 'function' && typeof wasm?.promising === 'function', memory64: false,
    deviceMemoryGiB: typeof memoryHint === 'number' && Number.isFinite(memoryHint) && memoryHint > 0 ? memoryHint : null };
  if (result.sharedArrayBuffer && typeof wasm?.Memory === 'function') {
    try { new wasm.Memory({ initial: 0n, maximum: 1n, shared: true, address: 'i64' }); result.memory64 = true; }
    catch { /* This runtime does not support the GGUF memory64 prerequisite. */ }
  }
  const gpu = scope.navigator?.gpu;
  if (typeof gpu?.requestAdapter !== 'function') return { ...result, webgpu: false };
  const deadline = performance.now() + timeoutMs;
  const timedOut = new Error('GPU capability check timed out');
  let timer, retryTimer, resumeRetry, finished = false;
  const withinDeadline = () => {
    if (finished || performance.now() >= deadline) throw timedOut;
  };
  const requestAdapter = async () => {
    withinDeadline();
    let adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    withinDeadline();
    // Cold Chromium can transiently return null while Dawn starts. Retry once
    // within the original deadline, without requesting a device or more memory.
    if (adapter == null) {
      await new Promise((resolve) => { resumeRetry = resolve; retryTimer = setTimeout(resolve, 100); });
      retryTimer = resumeRetry = undefined;
      withinDeadline();
      adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
      withinDeadline();
    }
    return adapter;
  };
  try {
    const adapter = await Promise.race([
      requestAdapter(),
      new Promise((_, reject) => { timer = setTimeout(() => reject(timedOut), timeoutMs); }),
    ]);
    if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter) return { ...result, webgpu: false };
    result.features = [...adapter.features].filter((feature) => typeof feature === 'string' && feature.length <= 80).slice(0, 64).sort();
    for (const key of limitNames) {
      const value = adapter.limits?.[key];
      if (Number.isSafeInteger(value) && value > 0) result.limits[key] = value;
    }
    result.webgpu = true;
  } catch (error) {
    result.probeError = String(error?.message ?? error).slice(0, 300);
  } finally {
    finished = true;
    clearTimeout(timer); clearTimeout(retryTimer);
    resumeRetry?.(); // Release a pending retry wait without allowing another request.
  }
  return result;
}

function runtimeProblem({ model, files, totalBytes, trusted, descriptorOnly }) {
  if (!runtimes.has(model.runtime)) return ['runtime_unsupported', 'This model runtime is not supported locally'];
  if (model.requiredFeatures !== undefined && (!Array.isArray(model.requiredFeatures) || model.requiredFeatures.length > 32
      || model.requiredFeatures.some((feature) => typeof feature !== 'string' || !feature || feature.length > 80)))
    return ['model_invalid', 'Invalid model GPU feature requirements'];
  const maximum = model.runtime === 'llama.cpp' ? 16 * GiB
    : model.runtime === 'onnx-diffusion' ? 3 * GiB : modelResourcePolicy(model).maxModelBytes;
  if (!descriptorOnly && totalBytes !== null && totalBytes > maximum) return ['package_too_large',
    `Model package is ${(totalBytes / GiB).toFixed(2)} GiB; this runtime supports up to ${Number((maximum / GiB).toFixed(2))} GiB.`];
  if (model.runtime === 'transformers.js') {
    const capability = getModelCapability('transformers.js', model.architecture);
    if (((!descriptorOnly || model.runtimeVersion !== undefined) && model.runtimeVersion !== MODEL_RUNTIME_VERSION)
        || ((!descriptorOnly || model.architecture !== undefined) && !capability)) {
      return ['runtime_unsupported', 'Model version or architecture is not supported locally'];
    }
    if (!descriptorOnly && (model.task !== undefined && model.task !== capability.task)) return ['runtime_unsupported', 'Model task does not match its supported architecture'];
    if (!descriptorOnly && (capability.requiresMemoryProfile || (capability.task === 'text-generation' && totalBytes > ONNX_CAPABILITY_LIMITS.legacyMaximumBytes))
        && !model.memoryProfile) return ['model_invalid', 'Inspect the model config to verify its memory profile before loading'];
    const dtypes = typeof model.dtype === 'string' ? [model.dtype]
      : model.dtype && typeof model.dtype === 'object' && !Array.isArray(model.dtype) ? Object.values(model.dtype) : [];
    if ((!descriptorOnly || model.dtype !== undefined) && (!dtypes.length || dtypes.some((dtype) => !['fp32', 'fp16', 'q4', 'q4f16', 'q8'].includes(dtype))
        || (model.architecture === 'qwen3_5' && dtypes.some((dtype) => dtype !== 'q4')))) {
      return ['runtime_unsupported', 'Model precision is not supported by this runtime'];
    }
  } else if (model.runtime === 'llama.cpp' && descriptorOnly) {
    // A directory row is only a hint. The controller fetches and validates the
    // bounded CID manifest before accepting any peer model weights.
    if ((model.runtimeVersion !== undefined && model.runtimeVersion !== '3.8.1')
        || (model.task !== undefined && model.task !== 'text-generation'))
      return ['runtime_unsupported', 'Model version or task is not supported locally'];
  } else if (model.runtime === 'llama.cpp' && !trusted && model.gguf) {
    try { validateGgufHubModel(model, { totalBytes, ...(files?.every((file) => file.sha256) ? { files } : {}) }); }
    catch (error) { return ['catalog_unsupported', error.message]; }
  } else {
    if (!trusted || (model.runtimeVersion !== trusted.model.runtimeVersion && !(model.runtime === 'llama.cpp' && trusted.model.runtimeVersion === undefined && model.runtimeVersion === '3.8.1')))
      return ['catalog_unsupported', 'This package is not in the approved local runtime catalog'];
    for (const key of model.runtime === 'onnx-diffusion'
      ? ['architecture', 'task', 'format', 'dtype', 'pipeline', 'width', 'height', 'steps', 'padTokenId', 'weightQuantization', 'modalities', 'outputModalities', 'requiredFeatures']
      : ['architecture', 'task', 'format', 'dtype']) {
      if (!sameValue(model[key], trusted.model[key])) return ['catalog_unsupported', 'Model profile differs from the approved runtime catalog'];
    }
    if (files) {
      const expected = model.runtime === 'llama.cpp' ? trusted.files.filter((file) => file.path.endsWith('.gguf')) : trusted.files;
      const actual = model.runtime === 'llama.cpp' ? files.filter((file) => file.path?.endsWith('.gguf')) : files;
      if (actual.length !== expected.length || actual.some((file) => !expected.some((item) => item.path === file.path && item.size === file.size && item.sha256 === file.sha256)))
        return ['catalog_unsupported', 'Model files differ from the approved runtime catalog'];
    }
  }
  if (model.runtime === 'onnx-diffusion' && files?.some((file) => file.size <= 0 || file.size >= 2 * GiB))
    return ['file_too_large', 'A file exceeds the diffusion loader’s supported buffer size'];
  return null;
}

function sameValue(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
  return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((key) => sameValue(a[key], b[key]));
}

export function evaluateModelCompatibility(entry, { device, budgets = {} } = {}) {
  const configured = normalizeModelMemoryBudgets(budgets);
  let details, estimate, invalid;
  try { details = profile(entry); estimate = modelMemoryEstimate(entry); }
  catch (error) { invalid = error; estimate = { cpuBytes: 0, gpuBytes: 0 }; }
  const result = (status, code, reason) => ({ status, reason, code, ...estimate });
  if (!device) return result('checking', 'device_checking', 'Checking device compatibility');
  if (invalid) return result('unavailable', invalid.code === 'ERR_MODEL_FILE_TOO_LARGE' ? 'file_too_large'
    : invalid.code === 'ERR_MODEL_PACKAGE_TOO_LARGE' ? 'package_too_large' : 'model_invalid', invalid.message);
  const problem = runtimeProblem(details);
  if (problem) return result('unavailable', ...problem);
  if (configured.cpuBytes !== null && estimate.cpuBytes > configured.cpuBytes)
    return result('unavailable', 'cpu_budget_exceeded', 'Exceeds configured RAM memory budget');
  if (configured.gpuBytes !== null && estimate.gpuBytes > configured.gpuBytes)
    return result('unavailable', 'gpu_budget_exceeded', 'Exceeds configured GPU memory budget');
  if (device.webgpu === false) return result('unavailable', 'webgpu_unavailable', 'Hardware WebGPU is unavailable in this browser');
  if (details.model.runtime === 'llama.cpp') {
    for (const [key, reason] of [['crossOriginIsolated', 'GGUF requires cross-origin isolation'], ['sharedArrayBuffer', 'GGUF requires SharedArrayBuffer'],
      ['jspi', 'GGUF requires WebAssembly JSPI'], ['memory64', 'GGUF requires shared WebAssembly memory64']]) {
      if (device[key] === false) return result('unavailable', `gguf_${key}_unavailable`, reason);
      if (device[key] !== true) return result('unknown', 'device_probe_unknown', 'GGUF browser prerequisites have not been verified');
    }
  }
  if (device.webgpu !== true) return result('unknown', 'device_probe_unknown', 'GPU capability check is incomplete; RAM/GPU memory fit is unverified');
  const features = new Set(device.features ?? []);
  const required = new Set(details.model.requiredFeatures ?? []);
  const dtype = details.model.dtype;
  if (details.model.runtime !== 'transformers.js' || (typeof dtype === 'string' ? [dtype] : Object.values(dtype ?? {})).some((type) => ['fp16', 'q4f16'].includes(type))) required.add('shader-f16');
  for (const feature of required) if (!features.has(feature)) return result('unavailable', 'gpu_feature_unavailable', feature === 'shader-f16'
    ? 'Required FP16 GPU math (shader-f16) is unavailable in this browser'
    : `Required GPU feature ${feature} is unavailable in this browser`);
  if (details.descriptorOnly) return result('unknown', 'model_metadata_unverified', 'Model metadata and RAM/GPU memory fit require verification before loading');
  // No current catalog provides verified per-allocation minima. maxBufferSize
  // limits one allocation; neither it nor a coarse deviceMemory hint measures
  // total/free VRAM or proves that a package cannot fit. Do not stress-probe RAM.
  return result('unknown', 'memory_fit_unverified', 'Required features are supported; RAM/GPU memory fit is unverified');
}
