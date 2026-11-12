import { normalizeArtifactManifest } from '../artifacts/ArtifactManifest.js';
import { SF3D_MODEL_CATALOG } from '../artifacts/sf3dModelCatalog.js';
import { validateImageInput } from './modelTask.js';
import { validateMeshRuntimeAssets } from './mesh/runtimeDefinition.js';

export const SF3D_RUNTIME_VERSION = '0.1.60';
const GiB = 1024 ** 3;
// Planning reservations, not a measurement of browser/free device memory.
export const SF3D_RESOURCE_POLICY = Object.freeze({ maxModelBytes: 3 * GiB,
  minimumCpuBytes: 8 * GiB, minimumGpuBytes: 8 * GiB });
const same = (a, b) => a === b || (a && b && typeof a === 'object' && typeof b === 'object'
  && Array.isArray(a) === Array.isArray(b) && Object.keys(a).length === Object.keys(b).length
  && Object.keys(a).every(key => same(a[key], b[key])));

/** Both kernel identity and the complete multi-source model package are pinned. */
export function validateSf3dManifest(input) {
  const manifest = normalizeArtifactManifest(input);
  const trusted = Object.values(SF3D_MODEL_CATALOG).find(entry => same(entry.model, manifest.model));
  if (!trusted || manifest.files.length !== trusted.files.length || trusted.files.some(expected =>
    !manifest.files.some(file => file.path === expected.path && file.size === expected.size && file.sha256 === expected.sha256))) {
    throw new Error('SF3D model package differs from its qualified runtime catalog');
  }
  const totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes > SF3D_RESOURCE_POLICY.maxModelBytes) {
    throw new Error('SF3D model package exceeds its byte budget');
  }
  return { manifest, trusted, totalBytes, resourcePolicy: SF3D_RESOURCE_POLICY };
}

export function normalizeSf3dInput(input, manifest) {
  validateSf3dManifest(manifest);
  if (input.task != null && input.task !== 'image-to-3d') throw new Error('SF3D generates 3D objects from images');
  if (input.audio != null) throw new Error('SF3D does not accept audio');
  const image = validateImageInput(input.image);
  if (!image) throw new Error('SF3D requires an image of one object');
  if (input.prompt?.trim() || input.messages?.length) throw new Error('SF3D requires image input; generate an image from text first');
  return { task: 'image-to-3d', image };
}

export const sf3dRuntimeDefinition = Object.freeze({
  id: 'webgpu-sf3d', moduleUrl: 'peercompute:sf3d-inference',
  validateManifest: validateSf3dManifest, validateRuntimeAssets: validateMeshRuntimeAssets,
  normalizeGenerationInput: normalizeSf3dInput,
  validateRuntimeOptions(options = {}) {
    if (!options || typeof options !== 'object' || Array.isArray(options) || Object.keys(options).length) {
      throw new Error('SF3D runtime options are fixed by the qualified profile');
    }
    return {};
  },
  // An interrupted GPU pipeline destroys its device. Do not advertise that
  // worker as ready after AbortError; a later load gets a fresh managed session.
  retainArtifactBridge: true, terminateOnUnload: true, terminateOnGenerationAbort: true,
});
