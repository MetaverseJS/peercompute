import test from 'node:test';
import assert from 'node:assert/strict';
import { MESH_MODEL_CATALOG, LEGACY_MESH_PACKAGES } from '../../peercompute/src/peercompute/artifacts/meshModelCatalog.js';
import { evaluateModelCompatibility, findModelCatalogEntry } from '../inference/src/modelDeviceCompatibility.js';

const device = { webgpu: true, features: [], limits: { maxBufferSize: 1024 ** 3, maxStorageBufferBindingSize: 1024 ** 3 } };
const current = Object.values(MESH_MODEL_CATALOG)[0], legacy = LEGACY_MESH_PACKAGES[0];

test('retained alpha-only TripoSR manifests remain loadable without changing the current catalog default', () => {
  assert.equal(evaluateModelCompatibility(legacy, { device }).code, 'memory_fit_unverified');
  assert.equal(evaluateModelCompatibility(current, { device }).code, 'memory_fit_unverified');
  assert.equal(findModelCatalogEntry(legacy), undefined);
  assert.equal(findModelCatalogEntry(current), current);
  assert.equal(Object.values(MESH_MODEL_CATALOG).filter(entry => entry.model.pipeline === 'triposr').length, 1);
  const descriptor = { modelId: legacy.id, repository: legacy.repository, revision: legacy.revision,
    runtime: legacy.model.runtime, architecture: legacy.model.architecture, dtype: legacy.model.dtype,
    task: legacy.model.task, format: legacy.model.format };
  assert.equal(findModelCatalogEntry(descriptor), current);
});

test('legacy compatibility requires the complete pinned profile and file hashes', () => {
  for (const mutate of [
    value => { delete value.files; },
    value => { value.files.pop(); },
    value => { value.files[0].sha256 = '0'.repeat(64); },
    value => { value.files[0].size++; },
    value => { value.model.backgroundRemoval = current.model.backgroundRemoval; },
    value => { value.model.profile = 'unqualified'; },
  ]) {
    const changed = structuredClone(legacy); mutate(changed);
    assert.equal(evaluateModelCompatibility(changed, { device }).code, 'catalog_unsupported');
  }
  assert.equal(evaluateModelCompatibility({ ...legacy.model }, { device }).code, 'memory_fit_unverified');
  assert.equal(evaluateModelCompatibility(legacy, { device: { ...device, webgpu: false } }).code, 'webgpu_unavailable');
});
