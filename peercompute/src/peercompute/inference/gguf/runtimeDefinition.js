import { normalizeArtifactManifest } from '../../artifacts/ArtifactManifest.js';
import { GGUF_MODEL_CATALOG } from '../../artifacts/ggufModelCatalog.js';
import { MODEL_POLICY } from '../modelManifest.js';
import { validateGgufHubModel } from './hubAdmission.js';
import { normalizeModelMessages, validateImageInput } from '../modelTask.js';
import { validatePcm } from '../speech/runtimeDefinition.js';
import { validateGgufMediaProfile } from './mediaInput.js';
import { splitModelComposition } from '../modelComposition.js';
import { validateGgufLoraAdapters } from './loraAdmission.js';

export const GGUF_RUNTIME_VERSION = '3.8.1';
export const GGUF_CONTEXT_LIMIT = 2048;
const GiB = 1024 ** 3;

export function validateGgufManifest(input) {
  const composition = splitModelComposition(input);
  const base = validateGgufBaseManifest(composition.baseManifest);
  const adapters = composition.adapters.length
    ? validateGgufLoraAdapters(base.manifest.model, base.weights, composition.adapters) : [];
  const totalBytes = composition.manifest.files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes > base.resourcePolicy.maxModelBytes) {
    throw new Error('GGUF composed package exceeds its byte budget');
  }
  return { ...base, manifest: composition.manifest, baseManifest: base.manifest, adapters,
    totalBytes };
}

function validateGgufBaseManifest(input) {
  const manifest = normalizeArtifactManifest(input);
  const model = manifest.model;
  const mediaProfile = validateGgufMediaProfile(model);
  const candidates = Object.values(GGUF_MODEL_CATALOG).filter((entry) =>
    entry.model.runtime === 'llama.cpp' && entry.repository === model?.repository
      && entry.revision === model?.revision && entry.model.architecture === model?.architecture
      && entry.model.task === model?.task && entry.model.dtype === model?.dtype
      && JSON.stringify(entry.model.ggufMedia ?? null) === JSON.stringify(model?.ggufMedia ?? null));
  const trusted = candidates.length === 1 ? candidates[0] : undefined;
  if (!trusted && model?.gguf && !mediaProfile) {
    const profile = validateGgufHubModel(model, { files: manifest.files });
    // A discovery profile must not override the immutable identity of a file
    // already pinned by the application catalog.
    for (const entry of Object.values(GGUF_MODEL_CATALOG)) {
      if (entry.repository !== model.repository || entry.revision !== model.revision) continue;
      for (const expected of entry.files.filter((file) => file.path.endsWith('.gguf'))) {
        const file = profile.weights.find((item) => item.path === expected.path);
        if (file && (file.size !== expected.size || file.sha256 !== expected.sha256)) {
          throw new Error('GGUF weights do not match the pinned catalog digests');
        }
      }
    }
    return { ...profile, manifest };
  }
  if (!trusted || model.runtime !== 'llama.cpp' || (model.runtimeVersion !== undefined && model.runtimeVersion !== GGUF_RUNTIME_VERSION)
      || (trusted.model.runtimeVersion !== undefined && model.runtimeVersion !== trusted.model.runtimeVersion)
      || model.dtype !== trusted.model.dtype
      || model.format !== 'GGUF'
      || model.task !== 'text-generation'
      || (model.modalities !== undefined && JSON.stringify(model.modalities) !== JSON.stringify(trusted.model.modalities))) {
    throw new Error('GGUF model revision is not in the trusted runtime catalog');
  }
  const allWeights = manifest.files.filter((file) => file.path.endsWith('.gguf'));
  const expected = trusted.files.filter((file) => file.path.endsWith('.gguf'));
  if (!allWeights.length || allWeights.length !== expected.length || allWeights.some((file) =>
    !expected.some((item) => item.path === file.path && item.size === file.size && item.sha256 === file.sha256))) {
    throw new Error('GGUF weights do not match the pinned catalog digests');
  }
  if (mediaProfile && (manifest.files.length !== trusted.files.length || trusted.files.some((expectedFile) =>
    !manifest.files.some((file) => file.path === expectedFile.path && file.size === expectedFile.size && file.sha256 === expectedFile.sha256)))) {
    throw new Error('GGUF multimodal file closure differs from the pinned catalog');
  }
  const projector = mediaProfile ? allWeights.find((file) => file.path === model.ggufMedia.projectorPath) : undefined;
  const weights = allWeights.filter((file) => file !== projector);
  if (mediaProfile && (!projector || weights.length !== 1)) throw new Error('GGUF multimodal package requires its pinned projector and text weights');
  const totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes > 16 * GiB) throw new Error('GGUF package exceeds its byte budget');
  const large = weights.reduce((sum, file) => sum + file.size, 0) > 4 * GiB;
  return { manifest, weights, projector, mediaProfile, totalBytes, resourcePolicy: {
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

export function validateGgufRuntimeOptions(options = {}, mediaProfile = null) {
  if (!options || typeof options !== 'object' || Array.isArray(options)
      || Object.keys(options).some((key) => !['n_ctx', 'n_batch', 'n_gpu_layers', 'n_threads'].includes(key))) {
    throw new Error('Unknown GGUF runtime option');
  }
  const result = { n_ctx: GGUF_CONTEXT_LIMIT, n_batch: mediaProfile ? mediaProfile.batchTokens : 64,
    n_gpu_layers: 99999, n_threads: 1, ...options };
  // Shared services begin with the text profile. Refine its legacy default only
  // after the exact model manifest has selected the trusted media profile.
  if (mediaProfile && result.n_batch === 64) result.n_batch = mediaProfile.batchTokens;
  if (!Number.isInteger(result.n_ctx) || result.n_ctx < 64 || result.n_ctx > GGUF_CONTEXT_LIMIT
      || !Number.isInteger(result.n_batch) || result.n_batch < 1 || result.n_batch > (mediaProfile ? mediaProfile.batchTokens : 128)
      || (mediaProfile && (result.n_batch !== mediaProfile.batchTokens || result.n_ctx !== mediaProfile.contextTokens))
      || !Number.isInteger(result.n_gpu_layers) || result.n_gpu_layers < 1 || result.n_gpu_layers > 99999
      || result.n_threads !== 1) throw new Error('GGUF options exceed the managed GPU runtime bounds');
  return Object.freeze(result);
}

export function normalizeGgufGenerationInput(input, manifest) {
  const { mediaProfile } = validateGgufManifest(manifest);
  const image = validateImageInput(input.image);
  const audio = input.audio == null ? null : validatePcm(input.audio.samples, input.audio.sampleRate);
  if ((image || audio) && !mediaProfile) throw new Error('This GGUF adapter currently accepts text only');
  const maxNewTokens = input.maxNewTokens ?? MODEL_POLICY.maxNewTokens;
  if (!Number.isInteger(maxNewTokens) || maxNewTokens < 1 || maxNewTokens > MODEL_POLICY.maxNewTokens) {
    throw new Error('GGUF output exceeds its token budget');
  }
  const messages = normalizeModelMessages(audio && input.messages == null && input.prompt == null
    ? { prompt: 'Transcribe this audio.' } : input);
  if ((image || audio) && !messages.some((message) => message.role === 'user')) throw new Error('GGUF media needs a current user message');
  return { messages, ...(image ? { image } : {}), ...(audio ? { audio } : {}), maxNewTokens };
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
  acceptsAudio: true, normalizeGenerationInput: normalizeGgufGenerationInput,
  retainArtifactBridge: true, terminateOnUnload: true,
  validateGenerationInput({ image, maxNewTokens }) {
    if (image) throw new Error('This GGUF adapter currently accepts text only');
    if (!Number.isInteger(maxNewTokens) || maxNewTokens < 1 || maxNewTokens > MODEL_POLICY.maxNewTokens) {
      throw new Error('GGUF output exceeds its token budget');
    }
  },
});
