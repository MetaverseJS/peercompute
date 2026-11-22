// Run by physics.test.mjs using Deno's native WebGPU implementation.
import '../vendor/eshkol-webgpu.js';
import { GPUHubManager } from '../../../../peercompute/src/peercompute/gpu/GPUHubManager.js';
import { createMerger } from '../../src/compute/mergers.js';

const cases = JSON.parse(await new Response(Deno.stdin.readable).text());
const backend = await globalThis.EshkolWebGPU.create({precision: 'fast', gateTolerance: 1e-6});
if (!backend.ok) throw new Error(backend.reason);
const device = backend.backend.device;
try {
  const code = await Deno.readTextFile(new URL('../nbody.wgsl', import.meta.url));
  const module = device.createShaderModule({code});
  const pipeline = await device.createComputePipelineAsync({layout: 'auto', compute: {module, entryPoint: 'main'}});
  const mergeSource = (await Deno.readTextFile(new URL('../laws.wgsl', import.meta.url))) + '\n'
    + await Deno.readTextFile(new URL('../mergers.wgsl.in', import.meta.url));
  const results = {};
  for (const {name, input, start, length, parameters} of cases) {
    const bodies = Float32Array.from(input);
    const count = bodies.length / 8;
    const size = length * 32;
    const uniform = new ArrayBuffer(32);
    new Uint32Array(uniform).set([count, start, length, parameters.collisions]);
    new Float32Array(uniform, 16).set([parameters.dt, parameters.gravity, parameters.softening, 0]);
    const buffer = (size, usage) => device.createBuffer({size, usage});
    const src = buffer(bodies.byteLength, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
    const dst = buffer(size, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
    const settings = buffer(32, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    const readback = buffer(size, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
    device.queue.writeBuffer(src, 0, bodies);
    device.queue.writeBuffer(settings, 0, uniform);
    const group = device.createBindGroup({layout: pipeline.getBindGroupLayout(0),
      entries: [src, dst, settings].map((buffer, binding) => ({binding, resource: {buffer}}))});
    const hub = new GPUHubManager();
    await hub.initialize({device});
    const merger = parameters.collisions ? await createMerger(hub, length, mergeSource) : null;
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, group);
    pass.dispatchWorkgroups(Math.ceil(length / 64));
    pass.end();
    if (merger) merger.encode(encoder, dst);
    encoder.copyBufferToBuffer(dst, 0, readback, 0, size);
    device.queue.submit([encoder.finish()]);
    await readback.mapAsync(GPUMapMode.READ);
    results[name] = Array.from(new Float32Array(readback.getMappedRange()));
    readback.unmap();
    for (const allocation of hub.getHotStore().values()) allocation.destroy();
    for (const allocation of [readback, settings, dst, src]) allocation.destroy();
  }
  console.log(JSON.stringify(results));
} finally {
  device.destroy();
}
