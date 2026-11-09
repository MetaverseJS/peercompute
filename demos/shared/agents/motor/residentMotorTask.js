// Self-contained trusted task asset: Vite's new URL emits this module unchanged.
// No relative imports, network-selected code, FP16 or silent CPU fallback.
let session;
const IN = 40, H = 64, OUT = 2, MAX_BATCH = 16, PARAMETERS = 6914;
const error = message => Object.assign(new Error(message), { code: 'ERR_RESIDENT_MOTOR_GPU' });
const shader = `
@group(0) @binding(0) var<storage, read> weights: array<f32>;
@group(0) @binding(1) var<storage, read> inputs: array<f32>;
@group(0) @binding(2) var<storage, read_write> outputs: array<f32>;
@compute @workgroup_size(1) fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let sample = id.x;
  var first: array<f32, 64>; var second: array<f32, 64>;
  for (var row = 0u; row < 64u; row++) {
    var value = weights[2560u + row];
    for (var col = 0u; col < 40u; col++) { value += weights[row * 40u + col] * inputs[sample * 40u + col]; }
    first[row] = tanh(value);
  }
  for (var row = 0u; row < 64u; row++) {
    var value = weights[6720u + row];
    for (var col = 0u; col < 64u; col++) { value += weights[2624u + row * 64u + col] * first[col]; }
    second[row] = tanh(value);
  }
  for (var row = 0u; row < 2u; row++) {
    var value = weights[6912u + row];
    for (var col = 0u; col < 64u; col++) { value += weights[6784u + row * 64u + col] * second[col]; }
    outputs[sample * 2u + row] = tanh(value);
  }
}`;
function close() {
  const current = session; session = undefined;
  if (!current) return;
  for (const buffer of current.buffers ?? []) buffer.destroy();
  current.device?.destroy();
}
export async function handleResidentMotorTask(data, { signal } = {}) {
  signal?.throwIfAborted();
  if (data?.command === 'load') {
    if (session) throw error('Resident motor is already loaded');
    if (typeof data.sessionId !== 'string' || !data.sessionId || typeof data.policyId !== 'string'
        || !(data.weights instanceof Float32Array) || data.weights.length !== PARAMETERS
        || data.weights.some(v => !Number.isFinite(v) || Math.abs(v) > 100)) throw error('Invalid resident motor weights');
    if (!globalThis.navigator?.gpu) throw error('WebGPU is unavailable for resident movement');
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    signal?.throwIfAborted(); if (!adapter) throw error('No WebGPU adapter is available for resident movement');
    const device = await adapter.requestDevice();
    session = { sessionId: data.sessionId, policyId: data.policyId, device, buffers: [], dispatches: 0, lost: false, busy: false };
    const current = session;
    device.lost.then(() => { current.lost = true; });
    device.addEventListener('uncapturederror', event => { current.failure = event.error?.message ?? 'WebGPU motor failed'; });
    try {
      signal?.throwIfAborted(); device.pushErrorScope('validation');
      const module = device.createShaderModule({ code: shader });
      const info = await module.getCompilationInfo();
      if (info.messages.some(message => message.type === 'error')) throw error('Resident motor shader compilation failed');
      current.pipeline = await device.createComputePipelineAsync({ layout: 'auto', compute: { module, entryPoint: 'main' } });
      const buffer = (size, usage) => { const result = device.createBuffer({ size, usage }); current.buffers.push(result); return result; };
      current.weights = buffer(PARAMETERS * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
      current.inputs = buffer(MAX_BATCH * IN * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
      current.outputs = buffer(MAX_BATCH * OUT * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
      current.readback = buffer(MAX_BATCH * OUT * 4, GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST);
      device.queue.writeBuffer(current.weights, 0, data.weights);
      current.bindGroup = device.createBindGroup({ layout: current.pipeline.getBindGroupLayout(0), entries: [current.weights, current.inputs, current.outputs]
        .map((value, binding) => ({ binding, resource: { buffer: value } })) });
      const validation = await device.popErrorScope(); if (validation) throw error(validation.message);
      signal?.throwIfAborted();
      return { backend: 'webgpu', worker: true, policyId: current.policyId, parameters: PARAMETERS,
        adapter: { vendor: adapter.info?.vendor ?? '', architecture: adapter.info?.architecture ?? '' } };
    } catch (failure) { close(); throw failure; }
  }
  if (!session || data?.sessionId !== session.sessionId) throw error('Resident motor session is not loaded');
  if (data.command === 'unload') { close(); return { disposed: true }; }
  if (data.command !== 'infer' || session.lost || session.failure) throw error(session.failure ?? 'Resident motor session is unavailable');
  if (session.busy) throw error('Resident motor is busy');
  if (!(data.inputs instanceof Float32Array) || data.inputs.length < IN || data.inputs.length % IN
      || data.inputs.length > MAX_BATCH * IN || data.inputs.some(v => !Number.isFinite(v) || Math.abs(v) > 4)) throw error('Invalid resident motor inputs');
  const current = session, count = data.inputs.length / IN; current.busy = true;
  let scoped = false;
  try {
    signal?.throwIfAborted(); current.device.pushErrorScope('validation'); scoped = true;
    current.device.queue.writeBuffer(current.inputs, 0, data.inputs);
    const encoder = current.device.createCommandEncoder(), pass = encoder.beginComputePass();
    pass.setPipeline(current.pipeline); pass.setBindGroup(0, current.bindGroup); pass.dispatchWorkgroups(count); pass.end();
    encoder.copyBufferToBuffer(current.outputs, 0, current.readback, 0, count * OUT * 4);
    current.device.queue.submit([encoder.finish()]); current.dispatches++;
    await current.readback.mapAsync(GPUMapMode.READ);
    const values = new Float32Array(current.readback.getMappedRange()).slice(0, count * OUT);
    current.readback.unmap();
    const validation = await current.device.popErrorScope(); scoped = false; if (validation) throw error(validation.message);
    signal?.throwIfAborted(); if (current.lost || current.failure) throw error('Resident motor GPU was lost');
    if (values.some(v => !Number.isFinite(v))) throw error('Resident motor produced nonfinite output');
    return { backend: 'webgpu', worker: true, policyId: current.policyId, values, dispatches: current.dispatches };
  } finally {
    if (current.readback.mapState === 'mapped') current.readback.unmap();
    if (scoped) await current.device.popErrorScope().catch(() => {});
    current.busy = false;
  }
}
