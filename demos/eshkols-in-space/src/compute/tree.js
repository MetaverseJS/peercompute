const LANES = 128;
const SMALL_LEAF = 16;
const groups = count => Math.ceil(count / LANES);

/** Build a complete spatial octree over the current live body positions. All storage stays resident. */
export async function createTree(hub, count, state, shaderSource) {
  const depth = count >= 524288 ? 7 : 6;
  const leafCount = 8 ** depth;
  const firstLeaf = (leafCount - 1) / 7;
  const nodeCount = firstLeaf + leafCount;
  const device = hub.device;
  const template = shaderSource ?? (await import('../../physics/tree-build.wgsl?raw')).default;
  const code = `const DEPTH = ${depth}u; const SMALL_LEAF = ${SMALL_LEAF}u;\n` + template;
  const module = device.createShaderModule({code, label: 'Spatial octree construction'});
  const storage = GPUBufferUsage.STORAGE;
  const clearable = storage | GPUBufferUsage.COPY_DST;
  const readable = storage | GPUBufferUsage.COPY_SRC;
  const buffer = (name, bytes, usage) => hub.createHotBuffer('tree-' + name, bytes, usage, 'Octree ' + name);
  const nodes = buffer('nodes', 16 * nodeCount, readable);
  const bounds = buffer('cube', 16, readable);
  const boxes = buffer('partial bounds', 32 * groups(count), storage);
  const heads = buffer('leaf heads', 4 * leafCount, clearable);
  const links = buffer('source links', 4 * count, storage);
  const counts = buffer('leaf counts', 4 * leafCount, clearable);
  const meta = buffer('leaf metadata', 4 * (2 * leafCount + 1), clearable);
  // Each dense slot represents at least SMALL_LEAF + 1 input bodies.
  const sums = buffer('dense moments', 32 * Math.max(1, Math.floor(count / (SMALL_LEAF + 1))), clearable);
  const blocks = groups(leafCount);
  const superblocks = groups(blocks);
  const scans = buffer('Morton prefix sums', 4 * (blocks + superblocks), storage);
  const order = buffer('Morton target IDs', 4 * count, readable);
  const allocations = [null, boxes, bounds, heads, links, counts, meta, sums, nodes, scans, order];

  async function stage(entryPoint, indices, dispatch, constants = {}) {
    const pipeline = await device.createComputePipelineAsync({
      layout: 'auto', label: entryPoint, compute: {module, entryPoint, constants}
    });
    const bindings = (indices.includes(0) ? state : [null]).map(input => device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: indices.map(binding => ({binding, resource: {buffer: binding === 0 ? input : allocations[binding]}}))
    }));
    return {pipeline, bindings, dispatch};
  }
  const levels = Array.from({length: depth}, (_, i) => 8 ** (depth - 1 - i));
  const stages = await Promise.all([
    stage('bound_groups', [0, 1], groups(count)),
    stage('bound_world', [1, 2], 1),
    stage('index_sources', [0, 2, 3, 4, 5, 6], groups(count)),
    stage('weigh_dense', [0, 2, 5, 6, 7], groups(count)),
    stage('finish_leaves', [0, 2, 3, 4, 5, 6, 7, 8], groups(leafCount)),
    ...levels.map(width => stage('reduce_parents', [8], groups(width), {PARENT_BASE: (width - 1) / 7})),
    stage('scan_cells', [5, 6, 9], blocks),
    stage('scan_blocks', [9], superblocks),
    stage('scan_superblocks', [6, 9], 1),
    stage('scatter_targets', [0, 2, 6, 9, 10], groups(count))
  ]);
  return {
    nodes, bounds, heads, links, counts, order, depth, firstLeaf, leafCount, smallLeaf: SMALL_LEAF,
    encode(encoder, sourceIndex) {
      for (const data of [heads, counts, meta, sums]) encoder.clearBuffer(data);
      const pass = encoder.beginComputePass({label: 'Build spatial octree'});
      for (const {pipeline, bindings, dispatch} of stages) {
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindings[sourceIndex] ?? bindings[0]);
        pass.dispatchWorkgroups(dispatch);
      }
      pass.end();
    }
  };
}
