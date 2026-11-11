import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { ARTIFACT_MANIFEST_SCHEMA } from '../artifacts/ArtifactManifest.js';

/** Deliberately small, self-contained static geometry profile. Validate before
 * handing remote bytes to a renderer; a GLB container alone is not a trust boundary. */
export const GENERATED_MESH_LIMITS = Object.freeze({ byteLength: 16 * 1024 ** 2,
  jsonBytes: 256 * 1024, vertices: 100000, triangles: 150000, coordinate: 1000000 });
const MIME = 'model/gltf-binary';
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8', { fatal: true });
const fail = (message) => { throw new Error(`Invalid generated mesh: ${message}`); };
function integer(value, minimum, maximum) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) fail('numeric limit');
  return value;
}
function object(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some((key) => !keys.includes(key))) fail('unsupported GLB field');
  return value;
}
function vector(value, size, minimum = -GENERATED_MESH_LIMITS.coordinate, maximum = GENERATED_MESH_LIMITS.coordinate) {
  if (!Array.isArray(value) || value.length !== size
      || value.some((n) => !Number.isFinite(n) || n < minimum || n > maximum)) fail('invalid vector');
  return [...value];
}
function one(value) { if (!Array.isArray(value) || value.length !== 1) fail('expected one static mesh'); return value[0]; }
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

/** Validate transfer metadata before allocating the binary buffer. */
export function normalizeGeneratedMeshDescriptor(value) {
  if (!value || value.format !== 'glb' || value.mimeType !== MIME
      || !/^[a-f0-9]{64}$/u.test(value.sha256 ?? '')) fail('format or SHA-256');
  const bounds = { min: vector(value.bounds?.min, 3), max: vector(value.bounds?.max, 3) };
  if (bounds.min.some((n, i) => n > bounds.max[i])) fail('inverted bounds');
  return { format: 'glb', mimeType: MIME,
    byteLength: integer(value.byteLength, 32, GENERATED_MESH_LIMITS.byteLength), sha256: value.sha256,
    vertexCount: integer(value.vertexCount, 3, GENERATED_MESH_LIMITS.vertices),
    triangleCount: integer(value.triangleCount, 1, GENERATED_MESH_LIMITS.triangles), bounds };
}

function parseGeometry(data) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2
      || view.getUint32(8, true) !== data.byteLength) fail('GLB header');
  const jsonLength = view.getUint32(12, true);
  if (!jsonLength || jsonLength % 4 || jsonLength > GENERATED_MESH_LIMITS.jsonBytes
      || 20 + jsonLength + 8 > data.byteLength || view.getUint32(16, true) !== 0x4e4f534a) fail('JSON chunk');
  let gltf;
  try { gltf = JSON.parse(textDecoder.decode(data.subarray(20, 20 + jsonLength))); }
  catch { fail('JSON syntax'); }
  const binHeader = 20 + jsonLength;
  const binLength = view.getUint32(binHeader, true);
  if (binLength % 4 || view.getUint32(binHeader + 4, true) !== 0x004e4942
      || binHeader + 8 + binLength !== data.byteLength) fail('BIN chunk');
  object(gltf, ['asset', 'scene', 'scenes', 'nodes', 'meshes', 'buffers', 'bufferViews', 'accessors', 'materials']);
  object(gltf.asset, ['version', 'generator']);
  if (gltf.asset.version !== '2.0' || (gltf.asset.generator !== undefined
      && (typeof gltf.asset.generator !== 'string' || gltf.asset.generator.length > 128))) fail('asset version');
  if (gltf.scene !== 0) fail('scene');
  const scene = object(one(gltf.scenes), ['nodes']);
  if (!same(scene.nodes, [0])) fail('scene nodes');
  const node = object(one(gltf.nodes), ['mesh']);
  if (node.mesh !== 0) fail('node mesh');
  const mesh = object(one(gltf.meshes), ['primitives']);
  const primitive = object(one(mesh.primitives), ['attributes', 'indices', 'mode', 'material']);
  if (primitive.mode !== undefined && primitive.mode !== 4) fail('only triangles are supported');
  object(primitive.attributes, ['POSITION', 'NORMAL', 'COLOR_0']);
  if (!Object.hasOwn(primitive.attributes, 'POSITION')) fail('missing positions');
  const buffer = object(one(gltf.buffers), ['byteLength']);
  integer(buffer.byteLength, 1, binLength);
  if (binLength - buffer.byteLength > 3) fail('BIN padding');
  if (!Array.isArray(gltf.bufferViews) || gltf.bufferViews.length < 2 || gltf.bufferViews.length > 4
      || !Array.isArray(gltf.accessors) || gltf.accessors.length !== gltf.bufferViews.length) fail('accessor count');
  const ranges = [];
  for (const entry of gltf.bufferViews) {
    object(entry, ['buffer', 'byteOffset', 'byteLength', 'target']);
    if (entry.buffer !== 0 || (entry.target !== undefined && ![34962, 34963].includes(entry.target))) fail('buffer view');
    const offset = integer(entry.byteOffset ?? 0, 0, buffer.byteLength);
    const length = integer(entry.byteLength, 1, buffer.byteLength - offset);
    if (offset % 4) fail('buffer alignment');
    if (ranges.some(([a, b]) => offset < b && offset + length > a)) fail('overlapping buffer views');
    ranges.push([offset, offset + length]);
  }
  const usedAccessors = new Set(), usedViews = new Set();
  function accessor(index, kind) {
    integer(index, 0, gltf.accessors.length - 1);
    if (usedAccessors.has(index)) fail('reused accessor');
    usedAccessors.add(index);
    const entry = object(gltf.accessors[index], ['bufferView', 'byteOffset', 'componentType', 'count', 'type', 'min', 'max']);
    integer(entry.bufferView, 0, gltf.bufferViews.length - 1);
    if (usedViews.has(entry.bufferView)) fail('reused buffer view');
    usedViews.add(entry.bufferView);
    const components = kind === 'indices' ? 1 : kind === 'colors' && entry.type === 'VEC4' ? 4 : 3;
    if (entry.type !== (components === 1 ? 'SCALAR' : `VEC${components}`)
        || (kind === 'indices' ? ![5123, 5125].includes(entry.componentType) : entry.componentType !== 5126)) fail('accessor format');
    const bytes = entry.componentType === 5123 ? 2 : 4;
    const count = integer(entry.count, kind === 'indices' ? 3 : 3,
      kind === 'indices' ? GENERATED_MESH_LIMITS.triangles * 3 : GENERATED_MESH_LIMITS.vertices);
    const range = ranges[entry.bufferView];
    const offset = integer(entry.byteOffset ?? 0, 0, range[1] - range[0]);
    if (offset % bytes || offset + count * components * bytes !== range[1] - range[0]) fail('accessor byte range');
    const values = new DataView(data.buffer, data.byteOffset + binHeader + 8 + range[0] + offset, count * components * bytes);
    const get = entry.componentType === 5126 ? (i) => values.getFloat32(i * 4, true)
      : entry.componentType === 5125 ? (i) => values.getUint32(i * 4, true) : (i) => values.getUint16(i * 2, true);
    return { entry, count, components, get };
  }
  const positions = accessor(primitive.attributes.POSITION, 'positions');
  const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  for (let i = 0; i < positions.count * 3; i++) {
    const value = positions.get(i);
    if (!Number.isFinite(value) || Math.abs(value) > GENERATED_MESH_LIMITS.coordinate) fail('nonfinite or excessive position');
    bounds.min[i % 3] = Math.min(bounds.min[i % 3], value); bounds.max[i % 3] = Math.max(bounds.max[i % 3], value);
  }
  for (const key of ['min', 'max']) {
    if (!same(vector(positions.entry[key], 3), bounds[key])) fail('position bounds mismatch');
  }
  if (bounds.min.every((n, i) => n === bounds.max[i])) fail('empty geometry');
  for (const [attribute, kind] of [['NORMAL', 'normals'], ['COLOR_0', 'colors']]) {
    if (!Object.hasOwn(primitive.attributes, attribute)) continue;
    const values = accessor(primitive.attributes[attribute], kind);
    if (values.count !== positions.count || values.entry.min !== undefined || values.entry.max !== undefined) fail('attribute count or bounds');
    for (let i = 0; i < values.count * values.components; i++) {
      const value = values.get(i);
      if (!Number.isFinite(value) || value < (kind === 'colors' ? 0 : -1.001)
          || value > (kind === 'colors' ? 1 : 1.001)) fail('invalid attribute value');
    }
    if (kind === 'normals') for (let i = 0; i < values.count; i++) {
      const length = Math.hypot(values.get(i * 3), values.get(i * 3 + 1), values.get(i * 3 + 2));
      if (Math.abs(length - 1) > 0.001) fail('normal must be a unit vector');
    }
  }
  const indices = accessor(primitive.indices, 'indices');
  if (indices.count % 3 || indices.entry.min !== undefined || indices.entry.max !== undefined) fail('triangle indices');
  for (let i = 0; i < indices.count; i++) {
    const index = indices.get(i);
    if (index >= positions.count) fail('index outside positions');
    if (indices.entry.componentType === 5123 && index === 65535) fail('primitive restart index');
  }
  if (usedAccessors.size !== gltf.accessors.length || usedViews.size !== gltf.bufferViews.length) fail('unused accessor');
  if (gltf.materials !== undefined) {
    const material = object(one(gltf.materials), ['pbrMetallicRoughness', 'doubleSided', 'alphaMode']);
    if (material.doubleSided !== undefined && typeof material.doubleSided !== 'boolean') fail('material');
    if (material.alphaMode !== undefined && material.alphaMode !== 'OPAQUE') fail('material alpha');
    const pbr = object(material.pbrMetallicRoughness, ['baseColorFactor', 'metallicFactor', 'roughnessFactor']);
    if (pbr.baseColorFactor !== undefined) vector(pbr.baseColorFactor, 4, 0, 1);
    for (const key of ['metallicFactor', 'roughnessFactor']) if (pbr[key] !== undefined
        && (!Number.isFinite(pbr[key]) || pbr[key] < 0 || pbr[key] > 1)) fail('material factor');
    if (primitive.material !== 0) fail('material index');
  } else if (primitive.material !== undefined) fail('missing material');
  return { vertexCount: positions.count, triangleCount: indices.count / 3, bounds };
}

export function validateGeneratedMesh(value) {
  if (!(value?.data instanceof Uint8Array) || value.data.byteLength < 32
      || value.data.byteLength > GENERATED_MESH_LIMITS.byteLength) fail('binary byte limit');
  // Own the checked bytes across later async writes and renderer construction.
  const data = new Uint8Array(value.data);
  const result = { format: 'glb', mimeType: MIME, byteLength: data.byteLength,
    sha256: bytesToHex(sha256(data)), ...parseGeometry(data) };
  for (const key of Object.keys(result)) if (value[key] !== undefined && !same(value[key], result[key])) fail(`${key} mismatch`);
  return { ...result, data };
}

/** Encode actual generated geometry; this does not synthesize fallback content. */
export function encodeGeneratedMesh({ positions, indices, normals, colors }) {
  if (!(positions instanceof Float32Array) || positions.length % 3
      || !(indices instanceof Uint16Array || indices instanceof Uint32Array) || indices.length % 3) fail('geometry arrays');
  const vertexCount = integer(positions.length / 3, 3, GENERATED_MESH_LIMITS.vertices);
  integer(indices.length / 3, 1, GENERATED_MESH_LIMITS.triangles);
  if (normals !== undefined && (!(normals instanceof Float32Array) || normals.length !== positions.length)) fail('normal array');
  if (colors !== undefined && (!(colors instanceof Float32Array) || ![vertexCount * 3, vertexCount * 4].includes(colors.length))) fail('color array');
  const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  for (let i = 0; i < positions.length; i++) {
    bounds.min[i % 3] = Math.min(bounds.min[i % 3], positions[i]); bounds.max[i % 3] = Math.max(bounds.max[i % 3], positions[i]);
  }
  const chunks = [], accessors = [], bufferViews = [], attributes = {};
  let binaryLength = 0;
  const add = (values, type, target, extra = {}) => {
    const index = accessors.length;
    const data = new Uint8Array(values.byteLength), view = new DataView(data.buffer);
    for (let i = 0; i < values.length; i++) {
      if (values instanceof Float32Array) view.setFloat32(i * 4, values[i], true);
      else if (values instanceof Uint32Array) view.setUint32(i * 4, values[i], true);
      else view.setUint16(i * 2, values[i], true);
    }
    chunks.push({ offset: binaryLength, data });
    bufferViews.push({ buffer: 0, byteOffset: binaryLength, byteLength: data.byteLength, target });
    accessors.push({ bufferView: index, componentType: values instanceof Float32Array ? 5126 : values instanceof Uint32Array ? 5125 : 5123,
      count: type === 'SCALAR' ? values.length : vertexCount, type, ...extra });
    binaryLength += Math.ceil(data.byteLength / 4) * 4;
    return index;
  };
  attributes.POSITION = add(positions, 'VEC3', 34962, bounds);
  if (normals !== undefined) attributes.NORMAL = add(normals, 'VEC3', 34962);
  if (colors !== undefined) attributes.COLOR_0 = add(colors, colors.length === vertexCount * 4 ? 'VEC4' : 'VEC3', 34962);
  const indexAccessor = add(indices, 'SCALAR', 34963);
  const json = textEncoder.encode(JSON.stringify({ asset: { version: '2.0', generator: 'PeerCompute generated mesh' },
    scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }], meshes: [{ primitives: [{ attributes, indices: indexAccessor, mode: 4, material: 0 }] }],
    materials: [{ pbrMetallicRoughness: { metallicFactor: 0, roughnessFactor: 1 }, doubleSided: true }],
    buffers: [{ byteLength: binaryLength }], bufferViews, accessors }));
  const jsonLength = Math.ceil(json.byteLength / 4) * 4, length = 28 + jsonLength + binaryLength;
  if (length > GENERATED_MESH_LIMITS.byteLength || jsonLength > GENERATED_MESH_LIMITS.jsonBytes) fail('encoded byte limit');
  const data = new Uint8Array(length), view = new DataView(data.buffer);
  view.setUint32(0, 0x46546c67, true); view.setUint32(4, 2, true); view.setUint32(8, length, true);
  view.setUint32(12, jsonLength, true); view.setUint32(16, 0x4e4f534a, true);
  data.fill(32, 20, 20 + jsonLength); data.set(json, 20);
  view.setUint32(20 + jsonLength, binaryLength, true); view.setUint32(24 + jsonLength, 0x004e4942, true);
  for (const chunk of chunks) data.set(chunk.data, 28 + jsonLength + chunk.offset);
  return validateGeneratedMesh({ data });
}

export async function retainGeneratedMesh(store, input, { name = 'Generated mesh', provenance = {}, signal, beforeCommit } = {}) {
  signal?.throwIfAborted();
  const { data, ...mesh } = validateGeneratedMesh(input);
  return store.withRetention(async (retained) => {
    const file = await retained.importFile(data, { signal, expectedSize: mesh.byteLength, expectedSha256: mesh.sha256, pin: false });
    await beforeCommit?.();
    signal?.throwIfAborted();
    const record = await retained.importManifest({ schema: ARTIFACT_MANIFEST_SCHEMA, name,
      files: [{ path: 'mesh.glb', cid: file.cid, size: file.size, sha256: file.sha256, mediaType: MIME }],
      provenance: { ...provenance, generatedMesh: mesh } }, { signal, pin: true });
    return { ...record, artifactCid: record.cid, fileCid: file.cid, mesh };
  }, { signal });
}

export async function readGeneratedMesh(store, artifactCid, { signal } = {}) {
  signal?.throwIfAborted();
  const manifest = await store.getManifest(artifactCid, { signal });
  const file = one(manifest?.files);
  const metadata = normalizeGeneratedMeshDescriptor(manifest?.provenance?.generatedMesh);
  if (manifest.model !== undefined || file.path !== 'mesh.glb' || file.mediaType !== MIME
      || file.size !== metadata.byteLength || file.sha256 !== metadata.sha256) fail('artifact manifest');
  const data = new Uint8Array(metadata.byteLength);
  let offset = 0;
  // Read through EOF rather than requesting only a prefix. Allocation remains
  // fixed at the bounded manifest size; unexpected trailing bytes fail closed.
  for await (const chunk of store.openRead(file.cid, { signal })) {
    signal?.throwIfAborted();
    if (chunk.byteLength > data.byteLength - offset) fail('artifact byte length');
    data.set(chunk, offset); offset += chunk.byteLength;
  }
  if (offset !== data.byteLength) fail('incomplete artifact');
  return { ...validateGeneratedMesh({ ...metadata, data }), artifactCid, fileCid: file.cid };
}
