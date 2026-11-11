import assert from 'node:assert/strict';
import test from 'node:test';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { encodeGeneratedMesh, validateGeneratedMesh, normalizeGeneratedMeshDescriptor,
  retainGeneratedMesh, readGeneratedMesh, GENERATED_MESH_LIMITS } from '../../src/peercompute/inference/GeneratedMeshArtifact.js';

const geometry = () => ({ positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
  indices: new Uint16Array([0, 1, 2]), colors: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) });
function mutateJson(data, mutate) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength), oldLength = view.getUint32(12, true);
  const json = JSON.parse(new TextDecoder().decode(data.subarray(20, 20 + oldLength)));
  mutate(json);
  const text = new TextEncoder().encode(JSON.stringify(json)), length = Math.ceil(text.length / 4) * 4;
  const result = new Uint8Array(data.length + length - oldLength), next = new DataView(result.buffer);
  result.set(data.subarray(0, 20)); next.setUint32(8, result.length, true); next.setUint32(12, length, true);
  result.fill(32, 20, 20 + length); result.set(text, 20); result.set(data.subarray(20 + oldLength), 20 + length);
  return result;
}
function mutateBinary(data, edit) {
  const next = new Uint8Array(data), header = new DataView(next.buffer), jsonLength = header.getUint32(12, true);
  const json = JSON.parse(new TextDecoder().decode(next.subarray(20, 20 + jsonLength)));
  edit(new DataView(next.buffer, 28 + jsonLength), json);
  return next;
}
const rejects = (data, pattern) => assert.throws(() => validateGeneratedMesh({ data }), pattern ?? /Invalid generated mesh/u);

test('generated colored GLB is deterministic and derived metadata owns its checked bytes', () => {
  const first = encodeGeneratedMesh(geometry()), next = encodeGeneratedMesh(geometry());
  assert.deepEqual(first, next);
  assert.deepEqual(first.bounds, { min: [0, 0, 0], max: [1, 1, 0] });
  assert.equal(first.vertexCount, 3); assert.equal(first.triangleCount, 1);
  const checked = validateGeneratedMesh(first); first.data.fill(0);
  assert.equal(validateGeneratedMesh(checked).sha256, checked.sha256);
  for (const mismatch of [{ sha256: '0'.repeat(64) }, { vertexCount: 4 }, { triangleCount: 2 },
    { byteLength: checked.byteLength + 1 }, { bounds: { min: [0, 0, 0], max: [2, 1, 0] } }]) {
    assert.throws(() => validateGeneratedMesh({ ...checked, ...mismatch }), /mismatch/u);
  }
});

test('mesh admission rejects container corruption, excess bytes and malformed allocation metadata', () => {
  const { data, ...metadata } = encodeGeneratedMesh(geometry());
  for (const offset of [0, 4, 8, 12, 16, 20 + new DataView(data.buffer).getUint32(12, true) + 4]) {
    const bad = new Uint8Array(data); bad[offset] ^= 255; rejects(bad);
  }
  rejects(data.subarray(0, data.length - 1));
  rejects(new Uint8Array(GENERATED_MESH_LIMITS.byteLength + 1), /byte limit/u);
  for (const bad of [{ byteLength: 1e10 }, { vertexCount: 100001 }, { triangleCount: 150001 },
    { bounds: { min: [NaN, 0, 0], max: [1, 1, 1] } }, { sha256: 'bad' }]) {
    assert.throws(() => normalizeGeneratedMeshDescriptor({ ...metadata, ...bad }), /Invalid generated mesh/u);
  }
});

test('GLB whitelist blocks URI fetches, extensions, scene execution and unbounded topology', () => {
  const { data } = encodeGeneratedMesh(geometry());
  const changes = [
    (g) => { g.buffers[0].uri = 'https://attacker.invalid/mesh'; },
    (g) => { g.images = [{ uri: 'data:image/png;base64,AAAA' }]; },
    (g) => { g.extensionsUsed = ['KHR_draco_mesh_compression']; },
    (g) => { g.meshes[0].extensions = {}; },
    (g) => { g.nodes[0].translation = [10, 0, 0]; },
    (g) => { g.nodes[0].children = [0]; },
    (g) => { g.animations = []; },
    (g) => { g.meshes[0].primitives[0].mode = 1; },
    (g) => { g.meshes[0].primitives[0].targets = []; },
    (g) => { g.materials[0].pbrMetallicRoughness.baseColorTexture = { index: 0 }; },
    (g) => { g.materials[0].alphaMode = 'BLEND'; },
    (g) => { g.meshes.push(g.meshes[0]); },
    (g) => { g.accessors.push(g.accessors[0]); g.bufferViews.push(g.bufferViews[0]); }
  ];
  for (const change of changes) rejects(mutateJson(data, change));
});

test('accessor and binary validation checks ranges, indices, floats and truthful bounds', () => {
  const { data } = encodeGeneratedMesh(geometry());
  const changes = [
    (g) => { g.accessors[0].sparse = {}; },
    (g) => { g.accessors[0].count = 100001; },
    (g) => { g.accessors[0].byteOffset = 4; },
    (g) => { g.accessors[0].componentType = 5125; },
    (g) => { g.accessors[0].normalized = true; },
    (g) => { g.bufferViews[0].byteStride = 12; },
    (g) => { g.bufferViews[0].byteLength = 1e10; },
    (g) => { g.bufferViews[1].byteOffset = 0; },
    (g) => { g.accessors[0].max = [2, 1, 0]; },
    (g) => { g.accessors[1].count = 2; },
    (g) => { g.meshes[0].primitives[0].indices = 0; }
  ];
  for (const change of changes) rejects(mutateJson(data, change));
  rejects(mutateBinary(data, (v) => v.setFloat32(0, NaN, true)), /nonfinite/u);
  rejects(mutateBinary(data, (v, g) => v.setFloat32(g.bufferViews[1].byteOffset, 2, true)), /attribute value/u);
  rejects(mutateBinary(data, (v, g) => v.setUint16(g.bufferViews[2].byteOffset, 3, true)), /index outside/u);
});

test('optional normals must be finite unit vectors, not merely individually bounded components', () => {
  const input = geometry(), normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
  assert.equal(encodeGeneratedMesh({ ...input, normals }).vertexCount, 3);
  for (const normal of [[0, 0, 0], [1, 1, 1], [NaN, 0, 1]]) {
    const bad = new Float32Array(normals); bad.set(normal);
    assert.throws(() => encodeGeneratedMesh({ ...input, normals: bad }), /attribute value|unit vector/u);
  }
});

test('uint16 primitive restart sentinel is rejected even when it indexes an existing vertex', () => {
  const positions = new Float32Array(65536 * 3); positions[3] = 1;
  assert.throws(() => encodeGeneratedMesh({ positions, indices: new Uint16Array([0, 1, 65535]) }), /primitive restart/u);
  assert.equal(encodeGeneratedMesh({ positions, indices: new Uint32Array([0, 1, 65535]) }).vertexCount, 65536);
});

test('a retained mesh has one pinned manifest, survives GC and reopens with verified provenance', async (t) => {
  const store = new ArtifactStore({ name: `mesh-${Math.random()}`, persistent: false });
  t.after(() => store.destroy());
  const source = encodeGeneratedMesh(geometry());
  let beforeCommit = 0;
  const record = await retainGeneratedMesh(store, source, { name: 'A resident object',
    provenance: { worldObject: { worldId: 'cubechat', objectId: 'test' } }, beforeCommit: () => { beforeCommit++; } });
  assert.equal(beforeCommit, 1);
  assert.equal(record.cid, record.artifactCid); assert.equal(record.manifest.files[0].path, 'mesh.glb');
  assert.equal(record.manifest.model, undefined);
  assert.equal(record.manifest.provenance.worldObject.worldId, 'cubechat');
  assert.equal((await store.stat(record.fileCid)).pinned, false);
  assert.equal((await store.stat(record.artifactCid)).pinned, true);
  await store.gc();
  const read = await readGeneratedMesh(store, record.artifactCid);
  assert.deepEqual(read.data, source.data); assert.equal(read.sha256, source.sha256);
  await store.unpin(record.artifactCid); await store.gc();
  await assert.rejects(readGeneratedMesh(store, record.artifactCid));
});

test('cancelled or no-longer-authorized placement never commits a manifest pin', async (t) => {
  const store = new ArtifactStore({ name: `mesh-cancel-${Math.random()}`, persistent: false });
  t.after(() => store.destroy());
  const source = encodeGeneratedMesh(geometry());
  const controller = new AbortController();
  await assert.rejects(retainGeneratedMesh(store, source, { signal: controller.signal,
    beforeCommit: () => { controller.abort(new DOMException('removed', 'AbortError')); } }), { name: 'AbortError' });
  await store.gc(); assert.equal(store.getStats().rootCount, 0);
  await assert.rejects(retainGeneratedMesh(store, source, { beforeCommit: () => { throw new Error('resident changed'); } }), /resident changed/u);
  await store.gc(); assert.equal(store.getStats().rootCount, 0);
});

test('artifact reads reject valid GLB prefixes with unexpected trailing bytes without growing the buffer', async () => {
  const { data, ...metadata } = encodeGeneratedMesh(geometry());
  const source = {
    async getManifest() { return { files: [{ path: 'mesh.glb', cid: 'fixture-file', size: data.byteLength,
      sha256: metadata.sha256, mediaType: metadata.mimeType }], provenance: { generatedMesh: metadata } }; },
    async *openRead(cid, options) {
      assert.equal(cid, 'fixture-file'); assert.equal(options.length, undefined, 'Validation must consume EOF');
      yield data; yield new Uint8Array([1]);
      assert.fail('Oversized content must terminate iteration immediately');
    }
  };
  await assert.rejects(readGeneratedMesh(source, 'fixture-manifest'), /artifact byte length/u);
});
