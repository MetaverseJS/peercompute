const e=`// Append to Eshkol's generated laws.wgsl. This file indexes contacts and
// schedules disjoint writes; touching(), merge_body() and absorbed_body()
// are supplied by the simulation module.
struct Bucket { head: atomic<u32>, smallest: atomic<u32> }
struct MergeCounts { live: atomic<u32>, occupied: array<atomic<u32>, 8> }

@group(0) @binding(0) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(1) var<storage, read_write> buckets: array<Bucket>;
@group(0) @binding(2) var<storage, read_write> links: array<u32>;
@group(0) @binding(3) var<storage, read_write> choices: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> counts: MergeCounts;
var<workgroup> localCount: atomic<u32>;
var<workgroup> occupiedLevels: array<atomic<u32>, 8>;

// A level's cell spans at least the diameter of each sphere assigned to it.
// Power-of-two widths give a common exact quantization for negative as well
// as positive coordinates. The largest level uses one unbounded cell.
fn radius_level(r: f32) -> u32 {
  let exponent = bitcast<u32>(r) >> 23u;
  return clamp(exponent + 2u, 103u, 254u);
}
fn cell(p: vec3<f32>, level: u32) -> vec3<i32> {
  if (level == 254u) { return vec3<i32>(0); }
  let width = bitcast<f32>(level << 23u);
  return vec3<i32>(clamp(floor(p / width), vec3<f32>(-536870912.0), vec3<f32>(536870912.0)));
}
fn bucket_for(c: vec3<i32>, level: u32) -> u32 {
  let p = vec3<u32>(c);
  var h = (p.x * 73856093u) ^ (p.y * 19349663u) ^ (p.z * 83492791u) ^ (level * 2654435761u);
  h = (h ^ (h >> 16u)) * 0x7feb352du;
  return (h ^ (h >> 15u)) & (arrayLength(&buckets) - 1u);
}

@compute @workgroup_size(128)
fn index_bodies(@builtin(global_invocation_id) id: vec3<u32>, @builtin(local_invocation_index) lane: u32) {
  let i = id.x;
  if (i < arrayLength(&bodies)) {
    let a = bodies[i];
    if (a.mass > 0.0) {
      let level = radius_level(a.radius);
      let h = bucket_for(cell(a.position, level), level);
      // Zero encodes the empty list. A complemented index lets atomicMax pick
      // the lowest slot; link order may vary between workgroup schedules.
      links[i] = atomicExchange(&buckets[h].head, i + 1u);
      atomicMax(&buckets[h].smallest, ~i);
      atomicOr(&occupiedLevels[level >> 5u], 1u << (level & 31u));
      atomicAdd(&localCount, 1u);
    }
  }
  workgroupBarrier();
  if (lane < 8u) {
    let mask = atomicLoad(&occupiedLevels[lane]);
    if (mask != 0u) { atomicOr(&counts.occupied[lane], mask); }
  }
  if (lane == 0u) { atomicAdd(&counts.live, atomicLoad(&localCount)); }
}

fn visit_bucket(i: u32, a: Body, ownLevel: u32, level: u32, h: u32, prior: u32) -> u32 {
  let top = atomicLoad(&buckets[h].smallest);
  var best = prior;
  if (top == 0u) { return best; }
  if (ownLevel == level) {
    // In the same size class each body performs its own directed search.
    // A tested minimum slot can settle even an extremely crowded bucket.
    if (top <= best) { return best; }
    let first = ~top;
    if (first != i && radius_level(bodies[first].radius) == level && touching(a, bodies[first])) {
      return top;
    }
  }
  var link = atomicLoad(&buckets[h].head);
  while (link != 0u) {
    let j = link - 1u;
    let b = bodies[j];
    // Hash aliases may cost a comparison but can never create a false contact.
    if (j != i && (ownLevel != level || ~j > best) && radius_level(b.radius) == level && touching(a, b)) {
      best = max(best, ~j);
      // A small body searches larger levels; the larger body never needs to
      // enumerate the many small cells covered by its sphere.
      if (ownLevel != level) { atomicMax(&choices[j], ~i); }
    }
    link = links[j];
  }
  return best;
}

@compute @workgroup_size(128)
fn find_contacts(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  if (i >= arrayLength(&bodies)) { return; }
  let a = bodies[i];
  if (a.mass <= 0.0) { return; }
  let own = radius_level(a.radius);
  var best = 0u;
  for (var word = own >> 5u; word < 8u; word++) {
    var mask = atomicLoad(&counts.occupied[word]);
    if (word == (own >> 5u)) { mask &= 0xffffffffu << (own & 31u); }
    while (mask != 0u) {
      let level = 32u * word + countTrailingZeros(mask);
      mask &= mask - 1u;
      let reach = a.radius + 0.5 * bitcast<f32>(level << 23u);
      let lo = cell(a.position - reach, level);
      let hi = cell(a.position + reach, level);
      for (var z = lo.z; z <= hi.z; z++) {
        for (var y = lo.y; y <= hi.y; y++) {
          for (var x = lo.x; x <= hi.x; x++) {
            best = visit_bucket(i, a, own, level, bucket_for(vec3<i32>(x, y, z), level), best);
          }
        }
      }
    }
  }
  if (best != 0u) { atomicMax(&choices[i], best); }
}

@compute @workgroup_size(128)
fn commit_pairs(@builtin(global_invocation_id) id: vec3<u32>, @builtin(local_invocation_index) lane: u32) {
  let i = id.x;
  if (i < arrayLength(&bodies)) {
    let j = ~atomicLoad(&choices[i]);
    if (i < j && j < arrayLength(&bodies)) {
      if (~atomicLoad(&choices[j]) == i) {
        // Only the lower slot of a mutual pair enters this block. All other
        // invocations inspect choices only, so both writes can occur in place.
        bodies[i] = merge_body(bodies[i], bodies[j]);
        bodies[j] = absorbed_body();
        atomicAdd(&localCount, 1u);
      }
    }
  }
  workgroupBarrier();
  if (lane == 0u) {
    let merged = atomicLoad(&localCount);
    if (merged != 0u) { atomicSub(&counts.live, merged); }
  }
}
`;export{e as default};
