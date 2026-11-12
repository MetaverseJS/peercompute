/**
 * WebGPU initialization and device management.
 */

let activeBufferAllocationSink = null;

function recordBufferAllocation(buffer, size, label) {
  if (activeBufferAllocationSink) {
    activeBufferAllocationSink.push({
      buffer,
      size: Math.ceil(size / 4) * 4,
      label: label || buffer.label || '',
    });
  }
  return buffer;
}

/**
 * Capture buffers allocated synchronously through this module while `fn` runs.
 * A caller-owned inventory receives allocations before `fn` can reject, so
 * terminal drain/recovery retains custody independently of the thrown value.
 * Without that inventory, the existing unsubmitted-failure cleanup applies.
 * Nested scopes restore the outer sink afterward.
 */
export function captureGpuBufferAllocations(fn, { ownedAllocations = null } = {}) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  if (ownedAllocations !== null && !Array.isArray(ownedAllocations)) throw new TypeError('ownedAllocations must be an array');
  const previous = activeBufferAllocationSink;
  const allocations = ownedAllocations ?? [];
  const start = allocations.length;
  activeBufferAllocationSink = allocations;
  try {
    return { value: fn(), allocations: ownedAllocations ? allocations.slice(start) : allocations };
  } catch (error) {
    if (ownedAllocations) throw error;
    const cleanupErrors = [];
    for (const allocation of allocations) {
      try {
        allocation.buffer.destroy();
      } catch (cleanupError) {
        cleanupErrors.push(cleanupError.message);
      }
    }
    const cleanup = Object.freeze({
      retiredCount: allocations.length - cleanupErrors.length,
      cleanupErrors: Object.freeze(cleanupErrors),
    });
    if ((typeof error === 'object' && error !== null) || typeof error === 'function') {
      try {
        Object.defineProperty(error, 'gpuAllocationCleanup', {
          configurable: true,
          enumerable: true,
          value: cleanup,
        });
      } catch {
        // Ownership/error handling must not depend on mutating a thrown value.
      }
    }
    throw error;
  } finally {
    activeBufferAllocationSink = previous;
  }
}

/** A duty-local uniform enters capture before mapping can fail. */
export function createUniformBuffer(device, data, label = '') {
  const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  const size = Math.max(16, Math.ceil(bytes.byteLength / 4) * 4);
  const buffer = device.createBuffer({
    size, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true, label,
  });
  recordBufferAllocation(buffer, size, label);
  try {
    new Uint8Array(buffer.getMappedRange()).set(bytes);
    buffer.unmap();
    return buffer;
  } catch (error) {
    if (!activeBufferAllocationSink) {
      try { buffer.destroy(); }
      catch (cleanup) { throw new AggregateError([error, cleanup], 'uniform initialization and cleanup failed', {cause:error}); }
    }
    throw error;
  }
}

/**
 * Acquire the GPU for SF3D.
 *
 * A host that already owns a live GPUDevice (the Kaminos kiln, whose renderer
 * must share one device and queue with inference) injects it:
 *   initGPU({ device, adapter })  → { device, adapter, injected: true }
 * SF3D then never requests its own device, so its cooperative duties and the
 * host's frames interleave on the same queue. Without injection SF3D requests
 * a high-performance adapter/device as before.
 */
export async function initGPU({ device: injectedDevice, adapter: injectedAdapter = null } = {}) {
  if (injectedDevice != null) {
    if (typeof injectedDevice !== 'object' || typeof injectedDevice.queue?.submit !== 'function') {
      throw new Error('injected device must expose queue.submit (a live GPUDevice)');
    }
    return { adapter: injectedAdapter, device: injectedDevice, injected: true };
  }
  if (!globalThis.navigator?.gpu) {
    throw new Error('WebGPU is not supported in this browser. Try Chrome 113+ or Edge 113+.');
  }

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: 'high-performance',
  });
  if (!adapter) {
    throw new Error('No WebGPU adapter found. Your GPU may not support WebGPU.');
  }

  // Request max limits for large model inference
  const device = await adapter.requestDevice({
    requiredLimits: {
      maxBufferSize: adapter.limits.maxBufferSize,
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxComputeWorkgroupStorageSize: adapter.limits.maxComputeWorkgroupStorageSize,
      maxComputeInvocationsPerWorkgroup: adapter.limits.maxComputeInvocationsPerWorkgroup,
      maxComputeWorkgroupSizeX: adapter.limits.maxComputeWorkgroupSizeX,
      maxComputeWorkgroupSizeY: adapter.limits.maxComputeWorkgroupSizeY,
    },
  });

  device.lost.then((info) => {
    console.error('WebGPU device lost:', info.message);
    if (info.reason !== 'destroyed') {
      // Could attempt recovery here
    }
  });

  return { adapter, device, injected: false };
}

/**
 * Create a storage buffer initialized with data.
 */
export function createStorageBuffer(device, data, usage = 0, label = '') {
  if (data.byteLength % 4 !== 0) {
    console.warn(`createStorageBuffer: non-4-aligned size ${data.byteLength} (label: ${label})`);
  }
  const size = Math.ceil(data.byteLength / 4) * 4;
  const buffer = device.createBuffer({
    size, // ensure 4-byte alignment
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | usage,
    mappedAtCreation: true,
    label: label || `storage_${data.byteLength}`,
  });
  try {
    new (data.constructor)(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return recordBufferAllocation(buffer, size, label);
  } catch (error) {
    // Allocation succeeded but no caller can own the buffer until return.
    try { buffer.destroy(); }
    catch (cleanupError) { throw new AggregateError([error,cleanupError],'storage buffer initialization and cleanup failed',{cause:error}); }
    throw error;
  }
}

/**
 * Initialize mapped GPU-owned storage without a separate complete CPU payload.
 */
export function createMappedStorageBuffer(device,size,initialize,{usage=0,label='',ownedBuffers=null}={}){
  if(!Number.isSafeInteger(size)||size<=0||size%4||typeof initialize!=='function'||
    (ownedBuffers!==null&&!(ownedBuffers instanceof Set)))
    throw TypeError('aligned mapped storage size, initializer and optional owned inventory required');
  const buffer=device.createBuffer({size,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|usage,
    mappedAtCreation:true,label:label||`storage_${size}`});
  ownedBuffers?.add(buffer);
  try{
    initialize(buffer.getMappedRange());buffer.unmap();
    return recordBufferAllocation(buffer,size,label);
  }catch(error){
    try{buffer.destroy();ownedBuffers?.delete(buffer);}
    catch(cleanup){
      const failure=new AggregateError([error,cleanup],'mapped storage initialization and cleanup failed',{cause:error});
      failure.unresolvedGpuBuffer=buffer;throw failure;
    }
    throw error;
  }
}

/**
 * Create an empty storage buffer.
 */
export function createEmptyBuffer(device, size, usage = 0, label = '') {
  if (size % 4 !== 0) {
    console.warn(`createEmptyBuffer: non-4-aligned size ${size} (label: ${label})`);
  }
  const alignedSize = Math.ceil(size / 4) * 4;
  const buffer = device.createBuffer({
    size: alignedSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | usage,
    mappedAtCreation: false,
    label: label || `empty_${size}`,
  });
  return recordBufferAllocation(buffer, alignedSize, label);
}

/**
 * Read back buffer contents to CPU.
 */
export async function readBuffer(device, buffer, size) {
  const staging = device.createBuffer({
    size,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });
  const encoder = device.createCommandEncoder();
  encoder.copyBufferToBuffer(buffer, 0, staging, 0, size);
  device.queue.submit([encoder.finish()]);
  await staging.mapAsync(GPUMapMode.READ);
  const result = new Float32Array(staging.getMappedRange().slice(0));
  staging.unmap();
  staging.destroy();
  return result;
}
