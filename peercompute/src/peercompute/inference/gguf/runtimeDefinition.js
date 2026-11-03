import { normalizeArtifactManifest } from '../../artifacts/ArtifactManifest.js';
import { GGUF_MODEL_CATALOG } from '../../artifacts/ggufModelCatalog.js';
import { MODEL_POLICY } from '../modelManifest.js';

export const GGUF_RUNTIME_VERSION = '3.8.1';
export const GGUF_CONTEXT_LIMIT = 512;
const GiB = 1024 ** 3;

export function validateGgufManifest(input) {
  const manifest = normalizeArtifactManifest(input);
  const model = manifest.model;
  const trusted = Object.values(GGUF_MODEL_CATALOG).find((entry) =>
    entry.model.runtime === 'llama.cpp' && entry.repository === model?.repository
      && entry.revision === model?.revision && entry.model.architecture === model?.architecture);
  if (!trusted || model.runtime !== 'llama.cpp' || (model.runtimeVersion !== undefined && model.runtimeVersion !== GGUF_RUNTIME_VERSION)
      || model.format !== 'GGUF'
      || model.task !== 'text-generation') throw new Error('GGUF model revision is not in the trusted runtime catalog');
  const weights = manifest.files.filter((file) => file.path.endsWith('.gguf'));
  const expected = trusted.files.filter((file) => file.path.endsWith('.gguf'));
  if (!weights.length || weights.length !== expected.length || weights.some((file) =>
    !expected.some((item) => item.path === file.path && item.size === file.size && item.sha256 === file.sha256))) {
    throw new Error('GGUF weights do not match the pinned catalog digests');
  }
  const totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes > 16 * GiB) throw new Error('GGUF package exceeds its byte budget');
  const large = weights.reduce((sum, file) => sum + file.size, 0) > 4 * GiB;
  return { manifest, weights, totalBytes, resourcePolicy: {
    maxModelBytes: 16 * GiB, minimumCpuBytes: large ? 8 * GiB : 2 * GiB,
    minimumGpuBytes: large ? 16 * GiB : 2 * GiB,
  } };
}

export function validateGgufRuntimeAssets(assets, baseUrl = globalThis.location?.href) {
  const base = new URL(baseUrl);
  if (!assets || Object.keys(assets).some((key) => key !== 'wasm') || typeof assets.wasm !== 'string') {
    throw new Error('GGUF runtime needs one trusted WASM asset');
  }
  const wasm = new URL(assets.wasm, base);
  if (wasm.origin !== base.origin || !['http:', 'https:'].includes(wasm.protocol)
      || wasm.username || wasm.password || wasm.search || wasm.hash || !wasm.pathname.endsWith('.wasm')) {
    throw new Error('GGUF runtime WASM must be a fixed same-origin asset');
  }
  return { wasm: wasm.href };
}

export function validateGgufRuntimeOptions(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)
      || Object.keys(options).some((key) => !['n_ctx', 'n_batch', 'n_gpu_layers', 'n_threads'].includes(key))) {
    throw new Error('Unknown GGUF runtime option');
  }
  const result = { n_ctx: 512, n_batch: 64, n_gpu_layers: 99999, n_threads: 1, ...options };
  if (!Number.isInteger(result.n_ctx) || result.n_ctx < 64 || result.n_ctx > GGUF_CONTEXT_LIMIT
      || !Number.isInteger(result.n_batch) || result.n_batch < 1 || result.n_batch > 128
      || !Number.isInteger(result.n_gpu_layers) || result.n_gpu_layers < 1 || result.n_gpu_layers > 99999
      || result.n_threads !== 1) throw new Error('GGUF options exceed the managed GPU runtime bounds');
  return Object.freeze(result);
}

export async function validateGgufCapabilities({ scope = globalThis, gpu = scope.navigator?.gpu } = {}) {
  if (!scope.crossOriginIsolated || !scope.SharedArrayBuffer) throw new Error('GGUF requires cross-origin isolation and SharedArrayBuffer');
  const wasm = scope.WebAssembly;
  if (typeof wasm?.Suspending !== 'function' || typeof wasm?.promising !== 'function') {
    throw new Error('GGUF requires WebAssembly JSPI');
  }
  try { new wasm.Memory({ initial: 0n, maximum: 1n, shared: true, address: 'i64' }); }
  catch { throw new Error('GGUF requires shared WebAssembly memory64'); }
  const adapter = await gpu?.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter) throw new Error('GGUF requires a hardware WebGPU adapter');
  if (!adapter.features.has('shader-f16')) throw new Error('GGUF requires hardware shader-f16; CPU fallback is disabled');
  return { adapter: { vendor: adapter.info?.vendor ?? '', architecture: adapter.info?.architecture ?? '',
    isFallbackAdapter: false, requiredFeatures: ['shader-f16'] }, sharedMemory: true, memory64: true, jspi: true };
}

export const ggufRuntimeDefinition = Object.freeze({
  id: 'llama.cpp', moduleUrl: 'peercompute:gguf-inference',
  validateManifest: validateGgufManifest, validateRuntimeAssets: validateGgufRuntimeAssets,
  validateRuntimeOptions: validateGgufRuntimeOptions,
  retainArtifactBridge: true, terminateOnUnload: true,
  validateGenerationInput({ image, maxNewTokens }) {
    if (image) throw new Error('This GGUF adapter currently accepts text only');
    if (!Number.isInteger(maxNewTokens) || maxNewTokens < 1 || maxNewTokens > MODEL_POLICY.maxNewTokens) {
      throw new Error('GGUF output exceeds its token budget');
    }
  },
});
