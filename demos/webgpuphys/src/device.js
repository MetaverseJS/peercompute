/**
 * WebGPU device initialization and helper utilities (plain JS + WebGPU)
 */

/**
 * Check if WebGPU is available in the current environment.
 */
export function isWebGPUSupported() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/**
 * Initialize WebGPU and return adapter/device details.
 * Throws if WebGPU is missing or a device cannot be created.
 */
export async function initWebGPU() {
  if (!isWebGPUSupported()) {
    throw new Error('WebGPU is not supported in this browser. Use Chrome/Edge 113+ with WebGPU enabled.');
  }

  const gpu = navigator.gpu;

  // Request adapter with high-performance preference.
  const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) {
    throw new Error('Failed to acquire a WebGPU adapter. Your GPU may not support WebGPU.');
  }

  // Log basic adapter info for debugging.
  const info = adapter.info || {};
  console.log('WebGPU Adapter:', {
    vendor: info.vendor,
    architecture: info.architecture,
    device: info.device,
    description: info.description,
  });

  // Request the device, forwarding the current limits and optional timestamp feature.
  const requiredFeatures = [];
  if (adapter.features && adapter.features.has && adapter.features.has('timestamp-query')) {
    requiredFeatures.push('timestamp-query');
  }

  const device = await adapter.requestDevice({
    requiredFeatures,
    requiredLimits: {
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxBufferSize: adapter.limits.maxBufferSize,
      maxComputeWorkgroupsPerDimension: adapter.limits.maxComputeWorkgroupsPerDimension,
      maxComputeInvocationsPerWorkgroup: adapter.limits.maxComputeInvocationsPerWorkgroup,
      maxComputeWorkgroupSizeX: adapter.limits.maxComputeWorkgroupSizeX,
      maxComputeWorkgroupSizeY: adapter.limits.maxComputeWorkgroupSizeY,
      maxComputeWorkgroupSizeZ: adapter.limits.maxComputeWorkgroupSizeZ,
    },
  });

  // Device loss handling.
  device.lost.then((lossInfo) => {
    console.error('WebGPU device lost:', lossInfo.message);
    if (lossInfo.reason !== 'destroyed') {
      console.error('Device loss reason:', lossInfo.reason);
    }
  });

  // Uncaptured error hook.
  device.onuncapturederror = (event) => {
    console.error('WebGPU uncaptured error:', event.error);
  };

  return {
    adapter,
    device,
    features: device.features,
    limits: device.limits,
  };
}

/**
 * Create a shader module from WGSL source.
 */
export function createShaderModule(device, code, label) {
  return device.createShaderModule({
    label: label || 'shader',
    code,
  });
}

/**
 * Create a compute pipeline.
 */
export function createComputePipeline(device, shaderModule, entryPoint, layout, label) {
  return device.createComputePipeline({
    label: label || 'compute-pipeline',
    layout,
    compute: {
      module: shaderModule,
      entryPoint,
    },
  });
}

/**
 * Create a storage buffer.
 */
export function createStorageBuffer(device, size, label, mappedAtCreation = false) {
  return device.createBuffer({
    label: label || 'storage-buffer',
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    mappedAtCreation,
  });
}

/**
 * Create a uniform buffer.
 */
export function createUniformBuffer(device, size, label) {
  return device.createBuffer({
    label: label || 'uniform-buffer',
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
}

/**
 * Create a staging buffer for GPU -> CPU readback.
 */
export function createStagingBuffer(device, size, label) {
  return device.createBuffer({
    label: label || 'staging-buffer',
    size,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });
}

/**
 * Write data to a buffer.
 */
export function writeBuffer(device, buffer, data, offset = 0) {
  device.queue.writeBuffer(buffer, offset, data);
}

/**
 * Read data from a buffer asynchronously using a staging buffer.
 */
export async function readBuffer(device, sourceBuffer, stagingBuffer, size) {
  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyBufferToBuffer(sourceBuffer, 0, stagingBuffer, 0, size);
  device.queue.submit([commandEncoder.finish()]);

  await stagingBuffer.mapAsync(GPUMapMode.READ);
  const copyData = stagingBuffer.getMappedRange().slice(0);
  stagingBuffer.unmap();
  return copyData;
}

/**
 * Align a size to the next multiple of alignment.
 */
export function alignTo(size, alignment) {
  return Math.ceil(size / alignment) * alignment;
}

/**
 * Compute workgroup dispatch size for a given element count.
 */
export function getDispatchSize(numElements, workgroupSize) {
  return Math.ceil(numElements / workgroupSize);
}
