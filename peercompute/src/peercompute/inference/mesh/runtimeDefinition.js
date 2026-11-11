import { normalizeArtifactManifest } from '../../artifacts/ArtifactManifest.js';
import { MESH_MODEL_CATALOG, LEGACY_MESH_PACKAGES } from '../../artifacts/meshModelCatalog.js';
import { validateImageInput } from '../modelTask.js';

export const MESH_RUNTIME_VERSION = '1.31.1';
const GiB = 1024 ** 3;
export const MESH_RESOURCE_POLICY = Object.freeze({ maxModelBytes: GiB,
  minimumCpuBytes: 4 * GiB, minimumGpuBytes: 3 * GiB });
const same = (a, b) => a === b || (a && b && typeof a === 'object' && typeof b === 'object'
  && Array.isArray(a) === Array.isArray(b) && Object.keys(a).length === Object.keys(b).length
  && Object.keys(a).every(key => same(a[key], b[key])));

/** Only a qualified complete package grants execution. Hub metadata and peer
 * descriptions never select code, preprocessing, or additional model files. */
export function validateMeshManifest(input) {
  const manifest = normalizeArtifactManifest(input), model = manifest.model;
  const trusted = [...Object.values(MESH_MODEL_CATALOG), ...LEGACY_MESH_PACKAGES].find(entry => same(entry.model, model));
  if (!trusted || manifest.files.length !== trusted.files.length || trusted.files.some(expected =>
    !manifest.files.some(file => file.path === expected.path && file.size === expected.size && file.sha256 === expected.sha256))) {
    throw new Error('3D model package differs from its qualified runtime catalog');
  }
  const totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes > MESH_RESOURCE_POLICY.maxModelBytes) {
    throw new Error('3D model package exceeds its byte budget');
  }
  return { manifest, trusted, totalBytes, resourcePolicy: MESH_RESOURCE_POLICY };
}

export function normalizeMeshInput(input, manifest) {
  validateMeshManifest(manifest);
  if (input.task != null && input.task !== 'image-to-3d') throw new Error('This model generates 3D objects from images');
  if (input.audio != null) throw new Error('3D generation does not accept audio');
  const image = validateImageInput(input.image);
  if (!image) throw new Error('3D generation requires an image of one object');
  // Input text is not a conditioning channel for this checkpoint. Callers may
  // first route a prompt through an image generator, then submit those pixels.
  if (input.prompt?.trim() || input.messages?.length) throw new Error('TripoSR requires image input; generate an image from text first');
  return { task: 'image-to-3d', image };
}

export function validateMeshRuntimeAssets(assets, baseUrl = globalThis.location?.href) {
  if (!assets || Object.keys(assets).some(key => !['mjs', 'wasm'].includes(key))) throw new Error('Unexpected 3D runtime assets');
  const base = new URL(baseUrl), result = {};
  for (const key of ['mjs', 'wasm']) {
    if (typeof assets[key] !== 'string') throw new Error('Trusted 3D runtime assets are required');
    const value = new URL(assets[key], base);
    if (value.origin !== base.origin || value.username || value.password || value.search || value.hash
      || !['http:', 'https:'].includes(value.protocol)
      || !new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.asyncify(?:-[A-Za-z0-9_-]+)?\\.${key}$`).test(value.pathname)) {
      throw new Error('3D runtime requires fixed same-origin ORT asyncify assets');
    }
    result[key] = value.href;
  }
  return result;
}

export const meshRuntimeDefinition = Object.freeze({
  id: 'onnx-mesh', moduleUrl: 'peercompute:mesh-inference',
  validateManifest: validateMeshManifest, validateRuntimeAssets: validateMeshRuntimeAssets,
  normalizeGenerationInput: normalizeMeshInput,
  validateRuntimeOptions(options = {}) {
    if (!options || typeof options !== 'object' || Array.isArray(options) || Object.keys(options).length) {
      throw new Error('3D runtime options are fixed by the qualified profile');
    }
    return {};
  },
  retainArtifactBridge: true, terminateOnUnload: true,
});
