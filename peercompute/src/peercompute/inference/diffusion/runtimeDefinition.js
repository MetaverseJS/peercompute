import { normalizeArtifactManifest } from '../../artifacts/ArtifactManifest.js';
import { DIFFUSION_MODEL_CATALOG } from '../../artifacts/diffusionModelCatalog.js';
import { normalizeModelMessages } from '../modelTask.js';

export const DIFFUSION_RUNTIME_VERSION = '1.31.1';
export const DIFFUSION_IMAGE_BYTES = 512 * 512 * 4;
const GiB = 1024 ** 3;

export function validateDiffusionManifest(input) {
  const manifest = normalizeArtifactManifest(input);
  const model = manifest.model;
  if (model?.composition !== undefined) throw new Error('This diffusion runtime does not support model adapters');
  const trusted = Object.values(DIFFUSION_MODEL_CATALOG).find((entry) =>
    entry.model.repository === model?.repository && entry.model.revision === model?.revision
      && entry.model.pipeline === model?.pipeline);
  if (!trusted || model.runtime !== 'onnx-diffusion' || model.runtimeVersion !== DIFFUSION_RUNTIME_VERSION
      || model.task !== 'text-to-image' || model.architecture !== trusted.model.architecture
      || JSON.stringify(model.modalities) !== '["text"]' || JSON.stringify(model.outputModalities) !== '["image"]'
      || manifest.files.length !== trusted.files.length) throw new Error('Diffusion package is not in the trusted runtime catalog');
  for (const key of ['format', 'dtype', 'steps', 'width', 'height', 'padTokenId', 'weightQuantization', 'requiredFeatures']) {
    const equal = (a, b) => a && b && typeof a === 'object' && typeof b === 'object'
      ? Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((name) => equal(a[name], b[name]))
      : a === b;
    if (!equal(model[key], trusted.model[key])) throw new Error(`Diffusion ${key} differs from the trusted profile`);
  }
  for (const expected of trusted.files) {
    const file = manifest.files.find((item) => item.path === expected.path);
    if (!file || file.size !== expected.size || file.sha256 !== expected.sha256) throw new Error('Diffusion files differ from pinned catalog digests');
  }
  const totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes > 3 * GiB) throw new Error('Diffusion package exceeds its admitted byte budget');
  return { manifest, trusted, totalBytes, resourcePolicy: {
    maxModelBytes: 3 * GiB, minimumCpuBytes: 8 * GiB, minimumGpuBytes: 8 * GiB,
  } };
}

export function normalizeDiffusionInput(input, manifest) {
  const { trusted } = validateDiffusionManifest(manifest);
  if (input.image) throw new Error('This diffusion runtime accepts text only');
  const messages = normalizeModelMessages(input);
  if (messages.length !== 1 || messages[0].role !== 'user') throw new Error('Diffusion requires exactly one user prompt');
  const prompt = messages[0].content.trim();
  if (!prompt || new TextEncoder().encode(prompt).length > 4096) throw new Error('Diffusion needs a text prompt of at most 4096 bytes');
  const seed = input.seed ?? crypto.getRandomValues(new Uint32Array(1))[0];
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('Diffusion seed must be uint32');
  const steps = input.steps ?? trusted.steps;
  if (steps !== trusted.steps || (input.width ?? 512) !== 512 || (input.height ?? 512) !== 512) {
    throw new Error(`This diffusion profile requires 512×512 and ${trusted.steps} steps`);
  }
  return { task: 'text-to-image', prompt, messages: [{ role: 'user', content: prompt }], seed, steps, width: 512, height: 512 };
}

export function validateDiffusionRuntimeAssets(assets, baseUrl = globalThis.location?.href) {
  if (!assets || Object.keys(assets).some((key) => !['mjs', 'wasm'].includes(key))) throw new Error('Unexpected diffusion runtime assets');
  const base = new URL(baseUrl), result = {};
  for (const key of ['mjs', 'wasm']) {
    if (typeof assets[key] !== 'string') throw new Error('Trusted diffusion runtime assets are required');
    const value = new URL(assets[key], base);
    if (value.origin !== base.origin || value.username || value.password || value.hash
        || !['http:', 'https:'].includes(value.protocol)
        || !new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.jsep(?:-[A-Za-z0-9_-]+)?\\.${key}$`).test(value.pathname)) {
      throw new Error('Diffusion assets must be same-origin ORT JSEP files');
    }
    result[key] = value.href;
  }
  return result;
}

export const diffusionRuntimeDefinition = Object.freeze({
  id: 'onnx-diffusion', moduleUrl: 'peercompute:diffusion-inference',
  validateManifest: validateDiffusionManifest, validateRuntimeAssets: validateDiffusionRuntimeAssets,
  normalizeGenerationInput: normalizeDiffusionInput,
  validateRuntimeOptions(options) {
    if (!options || typeof options !== 'object' || Array.isArray(options) || Object.keys(options).length) {
      throw new Error('Diffusion runtime options are fixed by the trusted model profile');
    }
    return {};
  },
  terminateOnUnload: true,
});
