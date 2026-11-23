/**
 * Pure static geometry descriptor validation shared by artifact/avatar contracts
 * and mesh inference without pulling inference runtimes into `peercompute/core`.
 */
export const GENERATED_MESH_LIMITS = Object.freeze({
  byteLength: 16 * 1024 ** 2,
  jsonBytes: 256 * 1024,
  vertices: 100000,
  triangles: 150000,
  coordinate: 1000000
});

const MIME = 'model/gltf-binary';
const fail = (message) => { throw new Error(`Invalid generated mesh: ${message}`); };

function integer(value, minimum, maximum) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) fail('numeric limit');
  return value;
}

function vector(value, size, minimum = -GENERATED_MESH_LIMITS.coordinate, maximum = GENERATED_MESH_LIMITS.coordinate) {
  if (!Array.isArray(value) || value.length !== size
      || value.some((n) => !Number.isFinite(n) || n < minimum || n > maximum)) fail('invalid vector');
  return [...value];
}

/** Validate transfer metadata before allocating the binary buffer. */
export function normalizeGeneratedMeshDescriptor(value) {
  if (!value || value.format !== 'glb' || value.mimeType !== MIME
      || !/^[a-f0-9]{64}$/u.test(value.sha256 ?? '')) fail('format or SHA-256');
  const bounds = { min: vector(value.bounds?.min, 3), max: vector(value.bounds?.max, 3) };
  if (bounds.min.some((n, i) => n > bounds.max[i])) fail('inverted bounds');
  return {
    format: 'glb',
    mimeType: MIME,
    byteLength: integer(value.byteLength, 32, GENERATED_MESH_LIMITS.byteLength),
    sha256: value.sha256,
    vertexCount: integer(value.vertexCount, 3, GENERATED_MESH_LIMITS.vertices),
    triangleCount: integer(value.triangleCount, 1, GENERATED_MESH_LIMITS.triangles),
    bounds
  };
}
