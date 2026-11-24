import {
  GPUHubManager,
  probeCapabilities,
  readCapabilityOverrides,
  requestManagedGpuDevice
} from '@peercompute/core';

let cachedDevice = null;
let gpuHub = null;
let cachedCapabilities = null;

export async function getHardwareCapabilities(options = {}) {
  if (cachedCapabilities && !options.force) return cachedCapabilities;
  const overrides = readCapabilityOverrides();
  cachedCapabilities = await probeCapabilities({
    includeWebGL: true,
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
      label: 'planetgen-shared-gpu-hub',
      onDeviceLost: () => {
        cachedDevice = null;
      }
    });
    return cachedDevice;
  } catch (err) {
    console.warn('[planetgen] GPU hub unavailable, falling back to managed WebGPU init', err);
    try {
      const managed = await requestManagedGpuDevice({
        allowFallback: overrides.allowFallbackGpu === true,
        promoteLimits: true,
        label: 'planetgen-fallback-gpu',
        onDeviceLost: () => {
          cachedDevice = null;
        }
      });
      cachedDevice = managed.device;
      return cachedDevice;
    } catch {
      return null;
    }
  }
}

export function getGPUHub() {
  return gpuHub;
}
