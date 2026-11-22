import '../../physics/vendor/eshkol-webgpu.js';
import { createGravity } from './gravity.js';
import { createMerger } from './mergers.js';
// Use the live workspace PeerCompute GPUHubManager for resident WebGPU buffers
// and stage execution on the shared device.
import { GPUHubManager } from '@peercompute/gpu-hub';

const STAGE = 'eshkol.nbody.step';
const WORKGROUP_SIZE = 64;
const BODY_STRIDE = 8;
const PARAM_BYTES = 32;
const deviceStates = new WeakMap();

// A renderer can lend the same device to many successive simulation runs.
function observeDevice(device) {
  let state = deviceStates.get(device);
  if (!state) {
    state = { failure: null, listeners: new Set() };
    deviceStates.set(device, state);
    device.lost.then(info => {
      state.failure = new Error(info.message || 'The WebGPU device was lost.');
      for (const listener of state.listeners) listener(state.failure);
      state.listeners.clear();
    });
  }
  return state;
}

function checkBodies(bodies) {
  if (!(bodies instanceof Float32Array) || bodies.length === 0 || bodies.length % BODY_STRIDE) {
    throw new RangeError('Expected a nonempty Float32Array of 8 floats per body.');
  }
  let live = 0;
  for (let i = 0; i < bodies.length; i += BODY_STRIDE) {
    const mass = bodies[i + 3];
    if (mass < 0 || bodies[i + 7] < 0) throw new RangeError('Masses and radii must be nonnegative.');
    for (let k = i; k < i + BODY_STRIDE; k++) {
      if (!Number.isFinite(bodies[k])) throw new RangeError('Body data must be finite.');
      if (mass === 0 && bodies[k] !== 0) throw new RangeError('An absorbed body must have an all-zero record.');
    }
    if (mass > 0) live++;
  }
  return live;
}

// This is the kernel's uniform ABI. Equations and body updates live in Eshkol.
function stepUniform(count, { dt, gravity, softening, collisions }) {
  for (const [name, value] of Object.entries({ dt, gravity, softening })) {
    if (!Number.isFinite(value) || !Number.isFinite(Math.fround(value))) {
      throw new RangeError(name + ' must be a finite f32.');
    }
  }
  if (Math.fround(dt) <= 0 || Math.fround(softening) <= 0 || gravity < 0) {
    throw new RangeError('Expected positive dt and softening, and nonnegative gravity.');
  }
  if (![false, true, 0, 1].includes(collisions)) throw new TypeError('Expected a collision toggle.');

  const bytes = new ArrayBuffer(PARAM_BYTES);
  new Uint32Array(bytes, 0, 4).set([count, 0, count, Number(collisions)]);
  new Float32Array(bytes, 16, 3).set([dt, gravity, softening]);
  return bytes;
}

// A host may lend its device, including a ULG runtime holding a GPU lease.
// Each simulation owns its hub and its buffers. Only self-acquired devices
// are destroyed when the simulation is disposed.
export async function createSimulation(initialBodies, { device: suppliedDevice, onDeviceLost } = {}) {
  let activeCount = checkBodies(initialBodies);
  const count = initialBodies.length / BODY_STRIDE;
  const byteLength = initialBodies.byteLength;
  let device = suppliedDevice;
  if (!device) {
    const result = await globalThis.EshkolWebGPU.create({ precision: 'fast', gateTolerance: 1e-6 });
    if (!result.ok) throw new Error(result.reason || 'Eshkol could not acquire a WebGPU device.');
    device = result.backend.device;
  }

  const hub = new GPUHubManager();
  let disposed = false;
  const deviceState = observeDevice(device);
  const listener = onDeviceLost && (error => onDeviceLost(error));
  if (listener) deviceState.listeners.add(listener);
  let busy = false;
  let stepIndex = 0;
  let source = 0;
  const groups = Math.ceil(count / WORKGROUP_SIZE);

  function releaseBuffers() {
    for (const buffer of hub.getHotStore().values()) buffer.destroy();
    hub.getHotStore().clear();
    if (!suppliedDevice) device.destroy();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    if (listener) deviceState.listeners.delete(listener);
    if (!busy) releaseBuffers();
  }

  try {
    if (deviceState.failure) throw deviceState.failure;
    await hub.initialize({ device });
    if (groups > device.limits.maxComputeWorkgroupsPerDimension ||
        byteLength > device.limits.maxStorageBufferBindingSize || byteLength > device.limits.maxBufferSize) {
      throw new RangeError('Body count exceeds the GPU’s buffer or dispatch limits.');
    }

    const stateUsage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX;
    const state = [0, 1].map(i => hub.createHotBuffer('state' + i, byteLength, stateUsage, 'Body state ' + i));
    const uniform = hub.createHotBuffer('uniform', PARAM_BYTES, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, 'Step parameters');
    let readback;
    let merger;
    const gravity = await createGravity(hub, count, state, uniform);
    device.queue.writeBuffer(state[0], 0, initialBodies);

    hub.registerResidentStageExecutor(STAGE, async ({ input }) => {
      const next = 1 - source;
      if (input.collisions && !merger) merger = await createMerger(hub, count);
      if (disposed) throw new Error('The simulation has been disposed.');
      const encoder = device.createCommandEncoder({ label: STAGE });
      gravity.encode(encoder, source);
      if (input.collisions) merger.encode(encoder, state[next]);
      if (input.snapshot) {
        readback ??= hub.createHotBuffer('snapshot', byteLength, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ, 'Body snapshot');
        encoder.copyBufferToBuffer(state[next], 0, readback, 0, byteLength);
      }
      device.queue.writeBuffer(uniform, 0, input.uniform);
      device.queue.submit([encoder.finish()]);
      source = next;
      stepIndex++;
      if (input.collisions) activeCount = await merger.readLiveCount();
      if (!input.snapshot) return state[source];

      await readback.mapAsync(GPUMapMode.READ);
      try {
        return new Float32Array(readback.getMappedRange().slice(0));
      } finally {
        readback.unmap();
      }
    });

    async function advance(parameters, snapshot) {
      if (disposed) throw new Error('The simulation has been disposed.');
      if (deviceState.failure) throw deviceState.failure;
      if (busy) throw new Error('A simulation step is already in flight.');
      const values = stepUniform(count, parameters);
      busy = true;
      try {
        return await hub.executeResidentStage({ stage: STAGE, input: { uniform: values, snapshot, collisions: parameters.collisions } });
      } finally {
        busy = false;
        if (disposed) releaseBuffers();
      }
    }
    return {
      count,
      gravityMode: gravity.mode,
      get activeCount() { return activeCount; },
      get stepIndex() { return stepIndex; },
      // A same-device renderer can consume the buffer until the next step.
      get buffer() { return state[source]; },
      step: parameters => advance(parameters, true),
      stepResident: parameters => advance(parameters, false),
      dispose
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
