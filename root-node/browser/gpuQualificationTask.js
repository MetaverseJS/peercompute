// Self-contained trusted module: Vite emits the URL asset unchanged.
export async function qualifyManagedGpu({ requireHardwareGpu = true } = {}, { workerId, signal } = {}) {
  if (typeof WorkerGlobalScope === 'undefined' || !(globalThis instanceof WorkerGlobalScope) || !workerId) {
    throw new Error('Root GPU qualification requires a managed browser worker');
  }
  signal?.throwIfAborted();
  const adapter = await globalThis.navigator?.gpu?.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) throw new Error('No WebGPU adapter is available in the managed worker');
  const info = adapter.info ?? {};
  const fallback = info.isFallbackAdapter ?? adapter.isFallbackAdapter ?? null;
  const description = [info.vendor, info.architecture, info.device, info.description].filter(Boolean).join(' ');
  if (requireHardwareGpu && (fallback !== false || /swiftshader|llvmpipe|software/i.test(description))) {
    throw new Error('Hardware WebGPU is unverified or a software adapter was selected');
  }
  const buffers = [];
  let device, scoped = false;
  const started = performance.now();
  try {
    device = await adapter.requestDevice();
    signal?.throwIfAborted();
    device.pushErrorScope('validation'); scoped = true;
    const module = device.createShaderModule({ code: `
      @group(0) @binding(0) var<storage, read> input: array<u32>;
      @group(0) @binding(1) var<storage, read_write> output: array<u32>;
      @compute @workgroup_size(32) fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x < arrayLength(&input)) { output[id.x] = input[id.x] * 3u + 7u; }
      }` });
    const compilation = await module.getCompilationInfo();
    const failures = compilation.messages.filter(message => message.type === 'error');
    if (failures.length) throw new Error(`Root WGSL compilation failed: ${failures.map(item => item.message).join('; ')}`);
    const pipeline = await device.createComputePipelineAsync({ layout: 'auto', compute: { module, entryPoint: 'main' } });
    const inputs = Uint32Array.from({ length: 64 }, (_, index) => index * index + 1);
    const createBuffer = usage => {
      const buffer = device.createBuffer({ size: inputs.byteLength, usage }); buffers.push(buffer); return buffer;
    };
    const input = createBuffer(GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
    const output = createBuffer(GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
    const readback = createBuffer(GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
    device.queue.writeBuffer(input, 0, inputs);
    const bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [input, output]
      .map((buffer, binding) => ({ binding, resource: { buffer } })) });
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline); pass.setBindGroup(0, bindGroup); pass.dispatchWorkgroups(2); pass.end();
    encoder.copyBufferToBuffer(output, 0, readback, 0, inputs.byteLength);
    device.queue.submit([encoder.finish()]);
    await readback.mapAsync(GPUMapMode.READ);
    const results = Array.from(new Uint32Array(readback.getMappedRange()));
    readback.unmap();
    const validation = await device.popErrorScope(); scoped = false;
    if (validation) throw new Error(validation.message);
    signal?.throwIfAborted();
    if (results.some((value, index) => value !== inputs[index] * 3 + 7)) throw new Error('Managed WGSL readback did not match expected results');
    return { schema: 'peercompute.host-gpu-qualification.v1', backend: 'webgpu', worker: true, workerId,
      adapter: { vendor: info.vendor ?? '', architecture: info.architecture ?? '', device: info.device ?? '',
        description: info.description ?? '', isFallbackAdapter: fallback },
      features: [...adapter.features].sort(), limits: { maxBufferSize: adapter.limits.maxBufferSize,
        maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize },
      dispatches: 1, submissions: 1, results, durationMs: performance.now() - started };
  } finally {
    if (scoped) await device?.popErrorScope().catch(() => {});
    for (const buffer of buffers) buffer.destroy();
    device?.destroy();
  }
}
