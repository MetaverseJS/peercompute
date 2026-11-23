/**
 * Zero-dependency extension registry for optional PeerCompute runtime modules.
 *
 * Keeping optional inference/model factories and worker task loaders behind this
 * registry guarantees that `peercompute/core` has zero static or dynamic import
 * edges into `src/peercompute/inference/` or heavy inference/WASM packages
 * (`peercompute-diffusion-ort`, `onnxruntime-web`, `@huggingface/transformers`,
 * `@wllama/wllama`, `@kaminos/webgpu-inference-kit`).
 */

let modelInferenceFactory = null;
let peerInferenceServiceFactory = null;
let defaultWorkerBootstrapURL = null;
const builtinTaskModules = new Map();

export function registerModelInferenceFactory(factory) {
  if (factory !== null && typeof factory !== 'function') {
    throw new TypeError('Model inference factory must be a function or null');
  }
  modelInferenceFactory = factory;
}

export function getModelInferenceFactory() {
  return modelInferenceFactory;
}

export function registerPeerInferenceServiceFactory(factory) {
  if (factory !== null && typeof factory !== 'function') {
    throw new TypeError('Peer inference service factory must be a function or null');
  }
  peerInferenceServiceFactory = factory;
}

export function getPeerInferenceServiceFactory() {
  return peerInferenceServiceFactory;
}

export function registerBuiltinTaskModule(modulePath, loader) {
  const key = String(modulePath || '').trim();
  if (!key) {
    throw new TypeError('Built-in task module path must be a non-empty string');
  }
  if (loader === null) {
    builtinTaskModules.delete(key);
    return;
  }
  if (typeof loader !== 'function') {
    throw new TypeError(`Built-in task module loader for ${key} must be a function or null`);
  }
  builtinTaskModules.set(key, loader);
}

export function getBuiltinTaskModule(modulePath) {
  return builtinTaskModules.get(String(modulePath || '').trim()) || null;
}

export function listBuiltinTaskModules() {
  return [...builtinTaskModules.keys()];
}

export function registerDefaultWorkerBootstrapURL(url) {
  if (url === null || url === undefined) {
    defaultWorkerBootstrapURL = null;
    return;
  }
  const normalized = url instanceof URL ? url.href : String(url).trim();
  if (!normalized) {
    throw new TypeError('Default worker bootstrap URL must be a non-empty string, URL, or null');
  }
  defaultWorkerBootstrapURL = normalized;
}

export function getDefaultWorkerBootstrapURL() {
  return defaultWorkerBootstrapURL;
}
