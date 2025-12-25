import { GPUHubManager } from '@peercompute';

let cachedDevice = null;
let gpuHub = null;

export async function getSharedDevice() {
  if (cachedDevice) return cachedDevice;
  try {
    gpuHub = new GPUHubManager({ frameBudgetMs: 6 });
    cachedDevice = await gpuHub.initialize();
    return cachedDevice;
  } catch (err) {
    console.warn('[planetgen] GPU hub unavailable, falling back to local WebGPU init', err);
    if (typeof navigator === 'undefined' || !navigator.gpu) {
      return null;
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return null;
    cachedDevice = await adapter.requestDevice();
    return cachedDevice;
  }
}

export function getGPUHub() {
  return gpuHub;
}
