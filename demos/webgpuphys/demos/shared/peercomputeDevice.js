import { GPUHubManager } from '@peercompute';
import { initWebGPU } from '../../src/index.js';

let cachedDevice = null;
let gpuHub = null;

export async function getSharedDevice() {
  if (cachedDevice) return cachedDevice;
  try {
    gpuHub = new GPUHubManager({ frameBudgetMs: 6 });
    cachedDevice = await gpuHub.initialize();
    return cachedDevice;
  } catch (err) {
    console.warn('[webgpuphys] GPU hub unavailable, falling back to local WebGPU init', err);
    const { device } = await initWebGPU();
    cachedDevice = device;
    return cachedDevice;
  }
}

export function getGPUHub() {
  return gpuHub;
}
