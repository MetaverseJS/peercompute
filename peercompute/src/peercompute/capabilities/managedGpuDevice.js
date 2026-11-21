import {
  GPU_CAPABILITY_LIMIT_KEYS,
  extractAdapterFeatures,
  extractAdapterLimits,
  isSoftwareAdapterInfo
} from './probeCapabilities.js';

export const MANAGED_GPU_DEVICE_SCHEMA = 'peercompute.capabilities.gpu-device.v1';

// Vetted WebGPU limits safe to promote from adapter.limits into requestDevice({ requiredLimits }).
// Avoids requesting deprecated or experimental limit keys that can cause requestDevice() rejection.
export const PROMOTED_GPU_LIMIT_KEYS = Object.freeze([
  'maxBufferSize',
  'maxStorageBufferBindingSize',
  'maxComputeWorkgroupStorageSize',
  'maxComputeInvocationsPerWorkgroup',
  'maxComputeWorkgroupSizeX',
  'maxComputeWorkgroupSizeY',
  'maxComputeWorkgroupSizeZ',
  'maxComputeWorkgroupsPerDimension',
  'maxStorageBuffersPerShaderStage',
  'maxTextureDimension2D',
  'maxTextureDimension3D',
  'maxTextureArrayLayers'
]);

export function buildPromotedRequiredLimits(adapterLimits = null, { limitCeilings = null, extraLimits = null } = {}) {
  const promoted = {};
  if (adapterLimits && typeof adapterLimits === 'object') {
    for (const key of PROMOTED_GPU_LIMIT_KEYS) {
      const value = adapterLimits[key];
      if (!Number.isSafeInteger(value) || value <= 0) continue;
      const ceiling = limitCeilings?.[key];
      promoted[key] = Number.isSafeInteger(ceiling) && ceiling > 0
        ? Math.min(value, ceiling)
        : value;
    }
  }
  if (extraLimits && typeof extraLimits === 'object') {
    for (const [key, value] of Object.entries(extraLimits)) {
      if (!Number.isSafeInteger(value) || value <= 0) continue;
      const adapterMax = adapterLimits?.[key];
      promoted[key] = Number.isSafeInteger(adapterMax) && adapterMax > 0
        ? Math.min(value, adapterMax)
        : value;
    }
  }
  return promoted;
}

/**
 * Acquire a WebGPU GPUDevice with hardened cold-Dawn retry, fallback-adapter guard,
 * optional feature negotiation, and safe adapter-limit promotion so device.limits
 * actually match what PeerCompute's workload sizer plans against.
 */
export async function requestManagedGpuDevice({
  scope = globalThis,
  adapter: suppliedAdapter = null,
  adapterOptions = null,
  powerPreference = 'high-performance',
  allowFallback = false,
  requiredFeatures = [],
  optionalFeatures = ['timestamp-query', 'shader-f16'],
  promoteLimits = true,
  limitCeilings = null,
  deviceDescriptor = null,
  timeoutMs = 5000,
  label = 'peercompute-managed-gpu',
  onDeviceLost = null,
  onUncapturedError = null
} = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) {
    throw new RangeError('Invalid WebGPU device acquisition timeout');
  }

  const effectiveAdapterOptions = adapterOptions && typeof adapterOptions === 'object'
    ? { powerPreference, ...adapterOptions }
    : { powerPreference };
  const effectiveAllowFallback = allowFallback === true || effectiveAdapterOptions.forceFallbackAdapter === true;

  const perf = scope?.performance ?? globalThis.performance;
  const now = () => (typeof perf?.now === 'function' ? perf.now() : Date.now());
  const deadline = now() + timeoutMs;
  const timedOut = Object.assign(new Error('WebGPU adapter acquisition timed out'), {
    code: 'ERR_GPU_ADAPTER_TIMEOUT'
  });

  let adapter = suppliedAdapter;
  if (!adapter) {
    const gpu = scope?.navigator?.gpu;
    if (typeof gpu?.requestAdapter !== 'function') {
      throw Object.assign(new Error('WebGPU is unavailable in this environment'), {
        code: 'ERR_WEBGPU_UNAVAILABLE'
      });
    }
    let timer;
    let retryTimer;
    let resumeRetry;
    let finished = false;
    const withinDeadline = () => {
      if (finished || now() >= deadline) throw timedOut;
    };
    const acquire = async () => {
      withinDeadline();
      let candidate = await gpu.requestAdapter(effectiveAdapterOptions);
      withinDeadline();
      if (candidate == null) {
        await new Promise((resolve) => {
          resumeRetry = resolve;
          retryTimer = setTimeout(resolve, 100);
        });
        retryTimer = undefined;
        resumeRetry = undefined;
        withinDeadline();
        candidate = await gpu.requestAdapter(effectiveAdapterOptions);
        withinDeadline();
      }
      return candidate;
    };
    try {
      adapter = await Promise.race([
        acquire(),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(timedOut), timeoutMs);
        })
      ]);
    } finally {
      finished = true;
      clearTimeout(timer);
      clearTimeout(retryTimer);
      resumeRetry?.();
    }
  }

  if (!adapter) {
    throw Object.assign(new Error('Failed to acquire a WebGPU adapter'), {
      code: 'ERR_GPU_ADAPTER_UNAVAILABLE'
    });
  }

  const isFallback = isSoftwareAdapterInfo(adapter);
  if (isFallback && !effectiveAllowFallback) {
    throw Object.assign(new Error('Hardware WebGPU adapter unavailable (only software/fallback adapter exposed)'), {
      code: 'ERR_GPU_FALLBACK_REJECTED'
    });
  }

  const adapterFeatures = extractAdapterFeatures(adapter.features);
  const featureSet = new Set(adapterFeatures);
  const requestedRequired = [
    ...new Set([
      ...(Array.isArray(requiredFeatures) ? requiredFeatures : []),
      ...(Array.isArray(deviceDescriptor?.requiredFeatures) ? deviceDescriptor.requiredFeatures : [])
    ].filter((feature) => typeof feature === 'string' && feature.length > 0))
  ];
  for (const feature of requestedRequired) {
    if (!featureSet.has(feature)) {
      throw Object.assign(new Error(`Required WebGPU feature unavailable: ${feature}`), {
        code: 'ERR_GPU_FEATURE_UNAVAILABLE',
        missingFeature: feature
      });
    }
  }
  const negotiatedFeatures = [...requestedRequired];
  for (const feature of Array.isArray(optionalFeatures) ? optionalFeatures : []) {
    if (typeof feature === 'string' && featureSet.has(feature) && !negotiatedFeatures.includes(feature)) {
      negotiatedFeatures.push(feature);
    }
  }

  const baseDescriptor = deviceDescriptor && typeof deviceDescriptor === 'object' ? { ...deviceDescriptor } : {};
  const descriptor = {
    ...baseDescriptor,
    label: baseDescriptor.label || label
  };
  if (negotiatedFeatures.length > 0) {
    descriptor.requiredFeatures = negotiatedFeatures;
  }

  const promotedLimits = promoteLimits
    ? buildPromotedRequiredLimits(adapter.limits, {
      limitCeilings,
      extraLimits: baseDescriptor.requiredLimits || null
    })
    : (baseDescriptor.requiredLimits ? { ...baseDescriptor.requiredLimits } : null);

  if (promotedLimits && Object.keys(promotedLimits).length > 0) {
    descriptor.requiredLimits = promotedLimits;
  }

  let device;
  try {
    device = await adapter.requestDevice(descriptor);
  } catch (error) {
    // If limit promotion failed on a strict/quirky driver, retry cleanly with only explicit caller limits.
    if (promoteLimits && descriptor.requiredLimits && !baseDescriptor.requiredLimits) {
      const fallbackDescriptor = { ...descriptor };
      delete fallbackDescriptor.requiredLimits;
      device = await adapter.requestDevice(fallbackDescriptor);
    } else {
      throw error;
    }
  }

  if (typeof onDeviceLost === 'function' && device?.lost && typeof device.lost.then === 'function') {
    device.lost.then((lossInfo) => {
      try {
        onDeviceLost(lossInfo, device);
      } catch {
        // Ignore observer errors on device loss.
      }
    }).catch(() => {});
  }
  if (typeof onUncapturedError === 'function' && device) {
    try {
      device.addEventListener?.('uncapturederror', (event) => {
        try {
          onUncapturedError(event?.error ?? event, device);
        } catch {
          // Ignore observer errors.
        }
      });
    } catch {
      device.onuncapturederror = (event) => onUncapturedError(event?.error ?? event, device);
    }
  }

  const features = extractAdapterFeatures(device?.features ?? adapter.features);
  const limits = extractAdapterLimits(device?.limits ?? adapter.limits, GPU_CAPABILITY_LIMIT_KEYS);
  const info = adapter.info && typeof adapter.info === 'object' ? adapter.info : {};

  return {
    schema: MANAGED_GPU_DEVICE_SCHEMA,
    adapter,
    device,
    adapterInfo: {
      vendor: typeof info.vendor === 'string' ? info.vendor : 'unknown',
      architecture: typeof info.architecture === 'string' ? info.architecture : 'unknown',
      device: typeof info.device === 'string' ? info.device : '',
      description: typeof info.description === 'string' ? info.description : ''
    },
    isFallbackAdapter: isFallback,
    features,
    limits,
    hasTimestampQuery: features.includes('timestamp-query'),
    hasShaderF16: features.includes('shader-f16'),
    lost: device?.lost ?? null,
    destroy() {
      try {
        device?.destroy?.();
      } catch {
        // Already destroyed.
      }
    }
  };
}
