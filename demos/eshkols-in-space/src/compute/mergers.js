const entries = ['index_bodies', 'find_contacts', 'commit_pairs'];

async function mergerSource() {
  const [{ default: laws }, { default: template }] = await Promise.all([
    import('../../physics/laws.wgsl?raw'),
    import('../../physics/mergers.wgsl.in?raw')
  ]);
  return laws + '\n' + template;
}

// Run after gravity and drift. Each radius level indexes its own cells, and
// smaller spheres query the occupied larger levels for cross-scale contacts.
export async function createMerger(hub, count, shaderSource) {
  const device = hub.device;
  const module = device.createShaderModule({ label: 'Eshkol sticky contacts', code: shaderSource ?? await mergerSource() });
  const layout = device.createBindGroupLayout({
    entries: Array.from({ length: 5 }, (_, binding) => ({
      binding, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' }
    }))
  });
  const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [layout] });
  const pipelines = await Promise.all(entries.map(entryPoint => device.createComputePipelineAsync({
    label: entryPoint, layout: pipelineLayout, compute: { module, entryPoint }
  })));
  const bucketCount = 2 ** Math.ceil(Math.log2(count));
  const clearable = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
  const buffer = (name, bytes, usage) => hub.createHotBuffer('merge-' + name, bytes, usage, 'Merge ' + name);
  const buckets = buffer('buckets', 8 * bucketCount, clearable);
  const links = buffer('links', 4 * count, GPUBufferUsage.STORAGE);
  const choices = buffer('choices', 4 * count, clearable);
  const counts = buffer('counts', 4 * 9, clearable | GPUBufferUsage.COPY_SRC);
  const readback = buffer('live count', 4, GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST);
  const bindings = new WeakMap();
  const groups = Math.ceil(count / 128);

  return {
    encode(encoder, bodies) {
      let binding = bindings.get(bodies);
      if (!binding) {
        binding = device.createBindGroup({
          layout,
          entries: [bodies, buckets, links, choices, counts].map((resource, index) => ({
            binding: index, resource: { buffer: resource }
          }))
        });
        bindings.set(bodies, binding);
      }
      encoder.clearBuffer(buckets);
      encoder.clearBuffer(choices);
      encoder.clearBuffer(counts);
      const pass = encoder.beginComputePass({ label: 'Find and merge mutual contacts' });
      pass.setBindGroup(0, binding);
      for (const pipeline of pipelines) {
        pass.setPipeline(pipeline);
        pass.dispatchWorkgroups(groups);
      }
      pass.end();
      encoder.copyBufferToBuffer(counts, 0, readback, 0, 4);
    },
    async readLiveCount() {
      await readback.mapAsync(GPUMapMode.READ);
      try {
        return new Uint32Array(readback.getMappedRange())[0];
      } finally {
        readback.unmap();
      }
    }
  };
}
