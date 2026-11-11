import test from 'node:test';
import assert from 'node:assert/strict';
import { MESH_MODEL_CATALOG, meshModelFileUrl } from '../../src/peercompute/artifacts/meshModelCatalog.js';
import { validateMeshManifest } from '../../src/peercompute/inference/mesh/runtimeDefinition.js';
const entry = MESH_MODEL_CATALOG['triposr-q8-onnx'];
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const manifest = () => ({ schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });

test('TripoSR catalog pins a complete graph/external-data closure and original MIT notice', () => {
  assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
  assert.equal(entry.license.spdx, 'MIT'); assert.match(entry.license.notice, /Copyright.*2024/);
  assert.equal(entry.model.requiredFeatures.length, 0);
  assert.match(meshModelFileUrl(entry.id, 'triplane_q8.onnx.data'), /048725e957f485cc6bc082a9d6a239fcf7d8880a\/triplane_q8.onnx.data$/);
  assert.throws(() => meshModelFileUrl(entry.id, '../weights'));
  assert.throws(() => { entry.files[0].size = 1; }, TypeError);
});

test('runtime cannot substitute graph, external data, preprocessing, or an unqualified export', () => {
  assert.equal(validateMeshManifest(manifest()).trusted.id, entry.id);
  for (const key of ['pipeline', 'radius', 'resolution', 'runtimeVersion']) {
    const changed = manifest(); changed.model[key] = 'different'; assert.throws(() => validateMeshManifest(changed), /catalog/);
  }
  for (const index of [0, 1, 2]) {
    const changed = manifest(); changed.files[index].sha256 = '0'.repeat(64); assert.throws(() => validateMeshManifest(changed), /catalog/);
  }
  const incomplete = manifest(); incomplete.files.splice(1, 1); assert.throws(() => validateMeshManifest(incomplete), /catalog/);
});
