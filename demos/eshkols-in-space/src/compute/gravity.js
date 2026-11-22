import { createTree } from './tree.js';

const DIRECT_LIMIT = 16384;

// Both paths call the Eshkol pair law and integrator. State is read from a
// single time slice; a tree, when used, is rebuilt from that slice every step.
export async function createGravity(hub, count, state, uniform, sources) {
  const device = hub.device;
  const tree = count > DIRECT_LIMIT ? await createTree(hub, count, state, sources?.build) : null;
  let code;
  if (tree) {
    const [laws, dispatch] = sources ? [sources.laws, sources.dispatch] : await Promise.all([
      import('../../physics/laws.wgsl?raw').then(m => m.default),
      import('../../physics/tree-dispatch.wgsl?raw').then(m => m.default)
    ]);
    code = [laws, `const DEPTH = ${tree.depth}u;`, dispatch].join('\n');
  } else {
    code = sources?.direct ?? (await import('../../physics/nbody.wgsl?raw')).default;
  }
  const module = device.createShaderModule({ code, label: tree ? 'Barnes–Hut tree walk' : 'Direct gravity' });
  const pipeline = await device.createComputePipelineAsync({ layout: 'auto', compute: { module, entryPoint: 'main' } });
  const bindings = state.map((buffer, i) => {
    const buffers = [buffer, state[1 - i], uniform];
    if (tree) buffers.push(tree.nodes, tree.bounds, tree.heads, tree.links, tree.counts, tree.order);
    return device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: buffers.map((buffer, binding) => ({ binding, resource: { buffer } }))
    });
  });
  return {
    mode: tree ? 'tree' : 'direct',
    encode(encoder, source) {
      tree?.encode(encoder, source);
      const pass = encoder.beginComputePass({ label: 'Gravity and drift' });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindings[source]);
      pass.dispatchWorkgroups(Math.ceil(count / 64));
      pass.end();
    }
  };
}
