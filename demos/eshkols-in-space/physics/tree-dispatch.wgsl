// Tree traversal, using the Eshkol pair law for both particles and monopoles.
// DEPTH is supplied by the builder. Root = 0, children = 8 * parent + 1..8.
struct Params {
  count: u32, start: u32, length: u32, collisions: u32,
  dt: f32, gravity: f32, softening: f32, padding: u32
}
@group(0) @binding(0) var<storage, read> snapshot: array<Body>;
@group(0) @binding(1) var<storage, read_write> outputBodies: array<Body>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var<storage, read> nodes: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> bounds: vec4<f32>;
@group(0) @binding(5) var<storage, read> heads: array<u32>;
@group(0) @binding(6) var<storage, read> links: array<u32>;
@group(0) @binding(7) var<storage, read> counts: array<u32>;
@group(0) @binding(8) var<storage, read> order: array<u32>;

const FIRST_LEAF = ((1u << (DEPTH * 3u)) - 1u) / 7u;
const SIDE_CELLS = 1u << DEPTH;
const THETA_SQUARED = 0.25;
const DIRECT_LEAF_LIMIT = 256u;

fn leafFor(position: vec3<f32>) -> u32 {
  let f = clamp((position - bounds.xyz) / bounds.w, vec3<f32>(0.0), vec3<f32>(1.0));
  let cell = min(vec3<u32>(f * f32(SIDE_CELLS)), vec3<u32>(SIDE_CELLS - 1u));
  var code = 0u;
  for (var bit = 0u; bit < DEPTH; bit++) {
    let xyz = (cell >> vec3<u32>(bit)) & vec3<u32>(1u);
    code |= (xyz.x | (xyz.y << 1u) | (xyz.z << 2u)) << (3u * bit);
  }
  return code;
}

fn monopole(positionMass: vec4<f32>) -> Body {
  return Body(positionMass.xyz, positionMass.w, vec3<f32>(0.0), 0.0);
}

fn treeKick(i: u32, a: Body, model: Law) -> vec3<f32> {
  let ownLeaf = leafFor(a.position);
  var kick = vec3<f32>(0.0);
  var node = 0u;
  var width = bounds.w;
  loop {
    let cluster = nodes[node];
    if (cluster.w > 0.0) {
      let gap = cluster.xyz - a.position;
      let far = width * width < THETA_SQUARED * dot(gap, gap);
      if (far) {
        kick += pair_kick(a, monopole(cluster), model);
      } else if (node < FIRST_LEAF) {
        node = 8u * node + 1u;
        width *= 0.5;
        continue;
      } else {
        let leaf = node - FIRST_LEAF;
        if (counts[leaf] <= DIRECT_LEAF_LIMIT) {
          var link = heads[leaf];
          while (link != 0u) {
            let j = link - 1u;
            if (j != i) { kick += pair_kick(a, snapshot[j], model); }
            link = links[j];
          }
        } else if (leaf == ownLeaf) {
          kick += pair_kick(a, excluding_body(monopole(cluster), a), model);
        } else {
          kick += pair_kick(a, monopole(cluster), model);
        }
      }
    }
    // Move to the next sibling, climbing out of any completed octets. This
    // avoids allocating a per-particle traversal stack on the GPU.
    while (node != 0u && ((node - 1u) & 7u) == 7u) {
      node = (node - 1u) / 8u;
      width *= 2.0;
    }
    if (node == 0u) { break; }
    node += 1u;
  }
  return kick;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.count) { return; }
  // Neighboring lanes walk nearby branches, while external body IDs stay stable.
  let i = order[gid.x];
  let a = snapshot[i];
  let model = Law(params.dt, params.gravity, params.softening, params.collisions != 0u);
  var kick = vec3<f32>(0.0);
  if (a.mass > 0.0 && model.gravity > 0.0) { kick = treeKick(i, a, model); }
  outputBodies[i] = advance_body(a, kick, model);
}
