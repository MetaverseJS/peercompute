// Breadth-first octree. Grid cells use x, y, z as Morton bits 0, 1, 2.
// Constants DEPTH and SMALL_LEAF are supplied by createTree.
const GRID = 1u << DEPTH;
const LEAVES = GRID * GRID * GRID;
const FIRST_LEAF = (LEAVES - 1u) / 7u;
const LANES = 128u;
const FMAX = 3.4028234663852886e38;
const BASE32 = 4294967296.0;
const QUANT = 1099511627776.0; // 2^40 units per leaf's largest mass.

struct TreeBody { position: vec3<f32>, mass: f32, velocity: vec3<f32>, radius: f32 }
struct Box { lo: vec4<f32>, hi: vec4<f32> }
@group(0) @binding(0) var<storage, read> bodies: array<TreeBody>;
@group(0) @binding(1) var<storage, read_write> boxes: array<Box>;
@group(0) @binding(2) var<storage, read_write> cube: vec4<f32>;
@group(0) @binding(3) var<storage, read_write> heads: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> links: array<u32>;
@group(0) @binding(5) var<storage, read_write> counts: array<atomic<u32>>;
// Per leaf: largest positive f32 mass as bits, dense-moment slot. Last element: allocator.
@group(0) @binding(6) var<storage, read_write> leafInfo: array<atomic<u32>>;
@group(0) @binding(7) var<storage, read_write> sums: array<atomic<u32>>;
@group(0) @binding(8) var<storage, read_write> nodes: array<vec4<f32>>;

var<workgroup> lows: array<vec3<f32>, LANES>;
var<workgroup> highs: array<vec3<f32>, LANES>;

fn live(b: TreeBody) -> bool {
  let bits = bitcast<vec4<u32>>(vec4<f32>(b.position, b.mass));
  return b.mass > 0.0 && all((bits & vec4<u32>(0x7f800000u)) != vec4<u32>(0x7f800000u));
}

fn reduceBox(lane: u32, lo: vec3<f32>, hi: vec3<f32>) {
  lows[lane] = lo;
  highs[lane] = hi;
  workgroupBarrier();
  for (var n = LANES / 2u; n > 0u; n /= 2u) {
    if (lane < n) {
      lows[lane] = min(lows[lane], lows[lane+n]);
      highs[lane] = max(highs[lane], highs[lane+n]);
    }
    workgroupBarrier();
  }
}

@compute @workgroup_size(128)
fn bound_groups(@builtin(local_invocation_index) lane: u32, @builtin(workgroup_id) group: vec3<u32>) {
  let i = group.x * LANES + lane;
  var lo = vec3<f32>(FMAX);
  var hi = vec3<f32>(-FMAX);
  if (i < arrayLength(&bodies)) {
    let b = bodies[i];
    if (live(b)) { lo = b.position; hi = b.position; }
  }
  reduceBox(lane, lo, hi);
  if (lane == 0u) { boxes[group.x] = Box(vec4<f32>(lows[0],0.0), vec4<f32>(highs[0],0.0)); }
}

@compute @workgroup_size(128)
fn bound_world(@builtin(local_invocation_index) lane: u32) {
  var lo = vec3<f32>(FMAX);
  var hi = vec3<f32>(-FMAX);
  for (var i = lane; i < arrayLength(&boxes); i += LANES) {
    lo = min(lo, boxes[i].lo.xyz);
    hi = max(hi, boxes[i].hi.xyz);
  }
  reduceBox(lane, lo, hi);
  if (lane == 0u) {
    let low = lows[0];
    let span = highs[0] - low;
    if (span.x < 0.0) { cube = vec4<f32>(0.0, 0.0, 0.0, 1.0); }
    else {
      let side = max(max(span.x, max(span.y, span.z)), 1e-12);
      cube = vec4<f32>(low, side);
    }
  }
}

fn spread(x: u32) -> u32 {
  var v = (x | (x << 16u)) & 0x030000ffu;
  v = (v | (v << 8u)) & 0x0300f00fu;
  v = (v | (v << 4u)) & 0x030c30c3u;
  return (v | (v << 2u)) & 0x09249249u;
}

fn compact(x: u32) -> u32 {
  var v = x & 0x09249249u;
  v = (v ^ (v >> 2u)) & 0x030c30c3u;
  v = (v ^ (v >> 4u)) & 0x0300f00fu;
  v = (v ^ (v >> 8u)) & 0x030000ffu;
  return (v ^ (v >> 16u)) & 0x000003ffu;
}

fn gridPoint(position: vec3<f32>) -> vec3<f32> {
  return clamp((position - cube.xyz) / cube.w, vec3<f32>(0.0), vec3<f32>(1.0)) * f32(GRID);
}
fn gridCell(p: vec3<f32>) -> vec3<u32> { return min(vec3<u32>(p), vec3<u32>(GRID - 1u)); }
fn morton(c: vec3<u32>) -> u32 { return spread(c.x) | (spread(c.y) << 1u) | (spread(c.z) << 2u); }

@compute @workgroup_size(128)
fn index_sources(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&bodies)) { return; }
  let b = bodies[i];
  if (!live(b)) { return; }
  let leaf = morton(gridCell(gridPoint(b.position)));
  links[i] = atomicExchange(&heads[leaf], i + 1u);
  atomicMax(&leafInfo[2u * leaf], bitcast<u32>(b.mass));
  if (atomicAdd(&counts[leaf], 1u) == SMALL_LEAF) {
    let slot = atomicAdd(&leafInfo[2u * LEAVES], 1u);
    atomicStore(&leafInfo[2u * leaf + 1u], slot);
  }
}

// Exact addition of a nonnegative fixed-point value into a pair of uint32s.
// With up to 2^23 particles per world the 2^40 units/body fit within 64 bits.
fn accumulate(slot: u32, v: f32) {
  if (v <= 0.0) { return; }
  let value = round(v);
  var hi = u32(value / BASE32);
  let lo = u32(value - f32(hi) * BASE32);
  if (lo > 0u) {
    let old = atomicAdd(&sums[slot], lo);
    hi += u32(old > 0xffffffffu - lo);
  }
  if (hi > 0u) { atomicAdd(&sums[slot + 1u], hi); }
}
fn moment(slot: u32) -> f32 {
  return f32(atomicLoad(&sums[slot])) + BASE32 * f32(atomicLoad(&sums[slot + 1u]));
}

@compute @workgroup_size(128)
fn weigh_dense(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&bodies)) { return; }
  let b = bodies[i];
  if (!live(b)) { return; }
  let point = gridPoint(b.position);
  let cell = gridCell(point);
  let leaf = morton(cell);
  if (atomicLoad(&counts[leaf]) <= SMALL_LEAF) { return; }
  let slot = 8u * atomicLoad(&leafInfo[2u * leaf + 1u]);
  let heaviest = bitcast<f32>(atomicLoad(&leafInfo[2u * leaf]));
  let w = (b.mass / heaviest) * QUANT;
  let offset = (point - vec3<f32>(cell)) * w;
  accumulate(slot, w);
  accumulate(slot + 2u, offset.x);
  accumulate(slot + 4u, offset.y);
  accumulate(slot + 6u, offset.z);
}

fn finishSmall(leaf: u32, n: u32) -> vec4<f32> {
  // Sorting short lists makes their sums and downstream direct traversal reproducible.
  var ids: array<u32, SMALL_LEAF>;
  var id = atomicLoad(&heads[leaf]);
  for (var k = 0u; k < n; k++) {
    var j = k;
    while (j > 0u) {
      if (ids[j-1u] < id) { break; }
      ids[j] = ids[j-1u];
      j--;
    }
    ids[j] = id;
    id = links[id - 1u];
  }
  atomicStore(&heads[leaf], ids[0]);
  var mean = bodies[ids[0] - 1u].position;
  var weight = 0.0;
  for (var k = 0u; k < n; k++) {
    let i = ids[k] - 1u;
    let b = bodies[i];
    weight += b.mass;
    mean += (b.position - mean) * (b.mass / weight);
    var next = 0u;
    if (k + 1u < n) { next = ids[k + 1u]; }
    links[i] = next;
  }
  return vec4<f32>(mean, weight);
}

@compute @workgroup_size(128)
fn finish_leaves(@builtin(global_invocation_id) gid: vec3<u32>) {
  let leaf = gid.x;
  if (leaf >= LEAVES) { return; }
  let n = atomicLoad(&counts[leaf]);
  var body = vec4<f32>(0.0);
  if (n > SMALL_LEAF) {
    let slot = 8u * atomicLoad(&leafInfo[2u * leaf + 1u]);
    let w = moment(slot);
    let offset = vec3<f32>(moment(slot+2u), moment(slot+4u), moment(slot+6u)) / w;
    let cell = vec3<u32>(compact(leaf), compact(leaf >> 1u), compact(leaf >> 2u));
    let center = cube.xyz + (vec3<f32>(cell) + offset) * (cube.w / f32(GRID));
    let mass = (w / QUANT) * bitcast<f32>(atomicLoad(&leafInfo[2u * leaf]));
    body = vec4<f32>(center, mass);
  } else if (n > 0u) { body = finishSmall(leaf, n); }
  nodes[FIRST_LEAF + leaf] = body;
}

override PARENT_BASE: u32 = 0u;

@compute @workgroup_size(128)
fn reduce_parents(@builtin(global_invocation_id) gid: vec3<u32>) {
  let parent = PARENT_BASE + gid.x;
  if (gid.x >= 7u * PARENT_BASE + 1u) { return; }
  let first = parent * 8u + 1u;
  var mean = vec3<f32>(0.0);
  var weight = 0.0;
  for (var k = 0u; k < 8u; k++) {
    let child = nodes[first + k];
    if (child.w > 0.0) {
      weight += child.w;
      mean += (child.xyz - mean) * (child.w / weight);
    }
  }
  nodes[parent] = vec4<f32>(mean, weight);
}

// Work adjacent lanes on adjacent Morton cells, keeping body storage in stable ID order.
// After finish_leaves the even leafInfo slots hold local scatter cursors. The
// former dense-slot allocator holds the write cursor for the inactive suffix.
const BLOCKS = LEAVES / LANES;
const SUPERBLOCKS = BLOCKS / LANES;
@group(0) @binding(9) var<storage, read_write> scanTotals: array<u32>;
@group(0) @binding(10) var<storage, read_write> targetIds: array<u32>;
var<workgroup> scanValues: array<u32, LANES>;

fn scanLane(lane: u32, value: u32) -> vec2<u32> {
  scanValues[lane] = value;
  for (var stride = 1u; stride < LANES; stride *= 2u) {
    workgroupBarrier();
    var preceding = 0u;
    if (lane >= stride) { preceding = scanValues[lane - stride]; }
    let sum = scanValues[lane] + preceding;
    workgroupBarrier();
    scanValues[lane] = sum;
  }
  workgroupBarrier();
  return vec2<u32>(scanValues[lane] - value, scanValues[LANES - 1u]);
}

@compute @workgroup_size(128)
fn scan_cells(@builtin(workgroup_id) group: vec3<u32>, @builtin(local_invocation_index) lane: u32) {
  let leaf = group.x * LANES + lane;
  let prefix = scanLane(lane, atomicLoad(&counts[leaf]));
  atomicStore(&leafInfo[2u * leaf], prefix.x);
  if (lane == 0u) { scanTotals[group.x] = prefix.y; }
}

@compute @workgroup_size(128)
fn scan_blocks(@builtin(workgroup_id) group: vec3<u32>, @builtin(local_invocation_index) lane: u32) {
  let block = group.x * LANES + lane;
  let prefix = scanLane(lane, scanTotals[block]);
  scanTotals[block] = prefix.x;
  if (lane == 0u) { scanTotals[BLOCKS + group.x] = prefix.y; }
}

@compute @workgroup_size(128)
fn scan_superblocks(@builtin(local_invocation_index) lane: u32) {
  var weight = 0u;
  if (lane < SUPERBLOCKS) { weight = scanTotals[BLOCKS + lane]; }
  let prefix = scanLane(lane, weight);
  if (lane < SUPERBLOCKS) { scanTotals[BLOCKS + lane] = prefix.x; }
  if (lane == 0u) { atomicStore(&leafInfo[2u * LEAVES], prefix.y); }
}

@compute @workgroup_size(128)
fn scatter_targets(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&bodies)) { return; }
  let b = bodies[i];
  var position: u32;
  if (live(b)) {
    let leaf = morton(gridCell(gridPoint(b.position)));
    let block = leaf / LANES;
    position = scanTotals[BLOCKS + block / LANES] + scanTotals[block] + atomicAdd(&leafInfo[2u * leaf], 1u);
  } else {
    position = atomicAdd(&leafInfo[2u * LEAVES], 1u);
  }
  targetIds[position] = i;
}
