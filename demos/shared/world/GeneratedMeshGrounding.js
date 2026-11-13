import * as THREE from 'three';

// A bounded lower envelope from actual mesh vertices. This is contact sampling,
// not a claim that an arbitrary generated base is planar or physically stable.
export function generatedMeshSupport(root, { resolution = 8 } = {}) {
  if (!Number.isInteger(resolution) || resolution < 1 || resolution > 32) throw new RangeError('Invalid support resolution');
  root.updateWorldMatrix(true, true);
  const bounds = new THREE.Box3().setFromObject(root), extent = bounds.getSize(new THREE.Vector3());
  if (bounds.isEmpty() || ![...bounds.min, ...bounds.max].every(Number.isFinite)) throw new TypeError('Invalid support geometry');
  const cells = new Map(), point = new THREE.Vector3();
  root.traverse(object => {
    const positions = object.geometry?.getAttribute('position');
    if (!positions) return;
    const indices = object.geometry.index, seen = indices ? new Uint8Array(positions.count) : null;
    for (let vertex = 0; vertex < (indices?.count ?? positions.count); vertex++) {
      const i = indices ? indices.getX(vertex) : vertex;
      if (seen?.[i]) continue;
      if (seen) seen[i] = 1;
      point.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld);
      const x = Math.min(resolution - 1, Math.floor((point.x - bounds.min.x) / (extent.x || 1) * resolution));
      const z = Math.min(resolution - 1, Math.floor((point.z - bounds.min.z) / (extent.z || 1) * resolution));
      const key = x + z * resolution, previous = cells.get(key);
      if (!previous || point.y < previous[1]) cells.set(key, point.toArray());
    }
  });
  if (!cells.size) throw new TypeError('Generated mesh has no support vertices');
  return [...cells.values()];
}

/** Apply only a vertical visual offset; stored world coordinates and rotation
 * remain authoritative. At least one sampled mesh point contacts the surface. */
export function groundGeneratedMeshView(view, position, sampleHeight) {
  if (!Array.isArray(position) || position.length !== 3 || !position.every(Number.isFinite)
      || typeof sampleHeight !== 'function' || !view.support?.length) throw new TypeError('Invalid generated mesh grounding');
  const point = new THREE.Vector3();
  let y = -Infinity, contacts = 0;
  for (const sample of view.support) {
    point.fromArray(sample).multiply(view.group.scale).applyQuaternion(view.group.quaternion);
    const height = sampleHeight(position[0] + point.x, position[2] + point.z);
    if (!Number.isFinite(height)) throw new Error('The generated object has no visible supporting surface');
    y = Math.max(y, height - point.y); contacts++;
  }
  view.group.position.set(position[0], y, position[2]);
  return { method: 'sampled-support', samples: contacts, visualY: y, authoritativeY: position[1] };
}

/** Sample the actual displaced PlaneGeometry triangles in constant time.
 * Cube terrain keeps local X/Y horizontal and displaces local Z vertically.
 * Other meshes use bounded vertical raycasts, without changing the surface. */
export function generatedGroundSurfaceSampler(floor) {
  if (!floor?.isMesh || !floor.geometry) throw new TypeError('A mesh surface is required');
  floor.updateWorldMatrix(true, false);
  const matrix = floor.matrixWorld.clone(), inverse = matrix.clone().invert(), geometry = floor.geometry;
  const parameters = geometry.parameters ?? {}, positions = geometry.getAttribute('position');
  const width = parameters.width, height = parameters.height;
  const columns = parameters.widthSegments ?? 1, rows = parameters.heightSegments ?? 1;
  const regular = geometry.type === 'PlaneGeometry' && width > 0 && height > 0
    && Number.isInteger(columns) && Number.isInteger(rows) && columns > 0 && rows > 0
    && positions?.count === (columns + 1) * (rows + 1)
    && Math.abs(matrix.elements[1]) < 1e-9 && Math.abs(matrix.elements[5]) < 1e-9 && matrix.elements[9] > 0;
  const point = new THREE.Vector3();
  if (regular) return (x, z) => {
    point.set(x, 0, z).applyMatrix4(inverse);
    const u = (point.x / width + .5) * columns, v = (.5 - point.y / height) * rows;
    if (u < -1e-7 || v < -1e-7 || u > columns + 1e-7 || v > rows + 1e-7) return undefined;
    const column = Math.min(columns - 1, Math.max(0, Math.floor(u))), row = Math.min(rows - 1, Math.max(0, Math.floor(v)));
    const fx = Math.max(0, Math.min(1, u - column)), fy = Math.max(0, Math.min(1, v - row));
    const a = column + (columns + 1) * row, b = a + columns + 1, c = b + 1, d = a + 1;
    point.z = fx + fy <= 1 ? positions.getZ(a) * (1 - fx - fy) + positions.getZ(b) * fy + positions.getZ(d) * fx
      : positions.getZ(b) * (1 - fx) + positions.getZ(c) * (fx + fy - 1) + positions.getZ(d) * (1 - fy);
    return point.applyMatrix4(matrix).y;
  };
  const bounds = new THREE.Box3().setFromObject(floor), ray = new THREE.Raycaster();
  if (bounds.isEmpty()) throw new TypeError('The visible floor has no bounds');
  ray.ray.direction.set(0, -1, 0); ray.near = 0; ray.far = Math.max(2, bounds.max.y - bounds.min.y + 2);
  return (x, z) => { ray.ray.origin.set(x, bounds.max.y + 1, z); return ray.intersectObject(floor, true)[0]?.point.y; };
}
