import test from 'node:test';
import assert from 'node:assert/strict';
import { MESH_MODEL_CATALOG, LEGACY_MESH_PACKAGES, meshModelFileUrl } from '../../src/peercompute/artifacts/meshModelCatalog.js';
import { validateMeshManifest } from '../../src/peercompute/inference/mesh/runtimeDefinition.js';
const entry = MESH_MODEL_CATALOG['triposr-q8-onnx'];
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const manifest = () => ({ schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });

test('TripoSR pins complete geometry and foreground closures with both upstream licenses', () => {
  assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
  assert.equal(entry.license.spdx, 'MIT AND Apache-2.0');
  assert.match(entry.license.components[0].notice, /Copyright.*2024/);
  assert.match(entry.license.components[1].notice, /Apache License/);
  assert.match(entry.license.components[2].notice, /Copyright.*2020.*Daniel Gatis/);
  assert(entry.license.notice.length < 300, 'display notice must not fill the model details with full license texts');
  assert.equal(entry.model.backgroundRemoval, 'u2netp');
  const foreground = entry.files.find(file => file.path === 'u2netp.onnx');
  assert.equal(foreground.size, 4574861);
  assert.equal(foreground.sha256, '309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8');
  assert.match(meshModelFileUrl(entry.id, 'u2netp.onnx'), /edgetools\/u2netp\/resolve\/25dee37ab19c5b6ad64ba6578eba63f1ae07720c\/u2netp.onnx$/);
  assert.equal(entry.model.requiredFeatures.length, 0);
  assert.match(meshModelFileUrl(entry.id, 'triplane_q8.onnx.data'), /048725e957f485cc6bc082a9d6a239fcf7d8880a\/triplane_q8.onnx.data$/);
  assert.throws(() => meshModelFileUrl(entry.id, '../weights'));
  assert.throws(() => { entry.files[0].size = 1; }, TypeError);
});

test('runtime cannot substitute graph, external data, preprocessing, or an unqualified export', () => {
  assert.equal(validateMeshManifest(manifest()).trusted.id, entry.id);
  for (const key of ['pipeline', 'radius', 'resolution', 'runtimeVersion', 'backgroundRemoval']) {
    const changed = manifest(); changed.model[key] = 'different'; assert.throws(() => validateMeshManifest(changed), /catalog/);
  }
  for (const index of entry.files.keys()) {
    const changed = manifest(); changed.files[index].sha256 = '0'.repeat(64); assert.throws(() => validateMeshManifest(changed), /catalog/);
  }
  const incomplete = manifest(); incomplete.files.splice(1, 1); assert.throws(() => validateMeshManifest(incomplete), /catalog/);
});

test('old retained alpha-only packages remain admitted without appearing twice in the catalog', () => {
  const legacy = LEGACY_MESH_PACKAGES[0];
  assert.equal(Object.values(MESH_MODEL_CATALOG).length, 1);
  assert.equal(legacy.model.backgroundRemoval, undefined);
  const old = { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(legacy.model),
    files: legacy.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) };
  assert.equal(validateMeshManifest(old).trusted, legacy);
  old.model.backgroundRemoval = 'u2netp';
  assert.throws(() => validateMeshManifest(old), /catalog/);
});
