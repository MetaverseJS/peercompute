import { GPUHubManager, probeCapabilities, readCapabilityOverrides } from '@peercompute';
import { initWebGPU } from '../../src/index.js';

let cachedDevice = null;
let gpuHub = null;
let cachedCapabilities = null;

export async function getHardwareCapabilities(options = {}) {
  if (cachedCapabilities && !options.force) return cachedCapabilities;
  const overrides = readCapabilityOverrides();
  cachedCapabilities = await probeCapabilities({
    overrides,
    allowFallback: overrides.allowFallbackGpu === true || options.allowFallback === true
  });
  return cachedCapabilities;
}

export async function getSharedDevice() {
  if (cachedDevice) return cachedDevice;
  const overrides = readCapabilityOverrides();
  try {
    gpuHub = new GPUHubManager({ frameBudgetMs: 6 });
    cachedDevice = await gpuHub.initialize({
      promoteLimits: true,
      allowFallback: overrides.allowFallbackGpu === true,
      label: 'webgpuphys-shared-gpu-hub',
      onDeviceLost: () => {
        cachedDevice = null;
      }
    });
    return cachedDevice;
  } catch (err) {
    console.warn('[webgpuphys] GPU hub unavailable, falling back to local WebGPU init', err);
    const { device } = await initWebGPU({
      allowFallback: overrides.allowFallbackGpu === true,
      onDeviceLost: () => {
        cachedDevice = null;
      }
    });
    cachedDevice = device;
    return cachedDevice;
  }
}

export function getGPUHub() {
  return gpuHub;
}
