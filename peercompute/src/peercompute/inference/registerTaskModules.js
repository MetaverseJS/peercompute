import { registerBuiltinTaskModule } from '../runtime/extensionRegistry.js';

let registered = false;

/**
 * Register the built-in inference worker task modules with the runtime task
 * dispatcher. Kept outside `computeManager/taskRuntime.js` so `peercompute/core`
 * bundles never pull inference runtimes or WASM assets.
 */
export function registerInferenceTaskModules() {
  if (registered) return;
  registered = true;

  // Fixed lazy imports allow bundlers (Vite/Rollup/Webpack) to bundle trusted
  // inference runtimes when `peercompute` or `peercompute/inference` is imported.
  registerBuiltinTaskModule('peercompute:model-inference', () => import('./modelTask.js'));
  registerBuiltinTaskModule('peercompute:gguf-inference', () => import('./gguf/modelTask.js'));
  registerBuiltinTaskModule('peercompute:diffusion-inference', () => import('./diffusion/modelTask.js'));
  registerBuiltinTaskModule('peercompute:speech-inference', () => import('./speech/modelTask.js'));
  registerBuiltinTaskModule('peercompute:mesh-inference', () => import('./mesh/modelTask.js'));
  registerBuiltinTaskModule('peercompute:sf3d-inference', () => import('./sf3dModelTask.js'));
}

registerInferenceTaskModules();
