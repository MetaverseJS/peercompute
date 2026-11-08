import assert from 'node:assert/strict';
import test from 'node:test';
import { TSOTCHKE_MODEL_CATALOG, TSOTCHKE_SOURCE_INVENTORY } from '../../src/peercompute/artifacts/tsotchkeModelCatalog.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { validateGgufManifest } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';
import { evaluateModelCompatibility, findModelCatalogEntry } from '../../../demos/inference/src/modelDeviceCompatibility.js';

const cid = 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku';
const manifestFor = (entry) => ({ schema: 'peercompute.artifact.manifest.v1', name: entry.name,
  model: { ...entry.model }, provenance: entry.provenance,
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, cid, ...(sha256 ? { sha256 } : {}) })) });
const capable = { webgpu: true, features: ['shader-f16'], crossOriginIsolated: true,
  sharedArrayBuffer: true, jspi: true, memory64: true };
const expected = [
  ['qwen3-coder-30b-a3b-georefine-c30-gguf', 'b88c1f0ded829f2195958b8f1129aa2d13a9232f',
    'Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-MIXED-Q4_K.gguf', 18587950144,
    '2f005a4633b7783c4cdf8e924a0d9ddae28efd7a4d4812d3d94ea97c57aabf51', 18587989294, 11],
  ['qwen3.6-35b-a3b-georefine-c20-gguf', '7f385b4ae408eeb81def3013bf2e5ac671898b95',
    'Qwen3.6-35B-A3B-GeoRefine-C20-MIXED-IQ4_XS.gguf', 19998783936,
    '027f3c99a065fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce911c96', 20021208438, 13],
  ['qwen3.8-27b-georefine-l162-gguf', '4268ff007ddb5e8813a391fbdd3e198e56a4c6da',
    'Qwen3.8-27B-GeoRefine-L162-abl-MIXED-Q4_K_M_CUSTOM.gguf', 16249419840,
    '191cd8fea54421e402c25d540d90358d27e5678ce8b4f73643d91111cbc223fd', 16249475820, 11],
];

test('all four non-codec releases and all three codec exclusions are accounted for', () => {
  const sources = TSOTCHKE_SOURCE_INVENTORY.repositories;
  assert.equal(sources.length, 7);
  assert.equal(new Set(sources.map((entry) => entry.repository)).size, 7);
  assert.equal(Object.keys(TSOTCHKE_MODEL_CATALOG).length, 3);
  for (const source of sources) {
    assert.match(source.repository, /^Tsotchke-Corporation\//);
    assert.match(source.revision, /^[a-f0-9]{40}$/);
    if (source.codecRequired) {
      assert.equal(Object.values(GGUF_MODEL_CATALOG).some((entry) => entry.repository === source.repository), false);
      assert.equal(source.catalogId, undefined);
      assert.ok(source.exclusionReason);
    } else {
      const entry = GGUF_MODEL_CATALOG[source.catalogId];
      assert.equal(entry.repository, source.repository);
      assert.equal(entry.revision, source.revision);
    }
  }
  assert.deepEqual(sources.filter((entry) => entry.codecRequired).map((entry) => entry.repository.split('/')[1]).sort(), [
    'Qwen3.8-27B-GeoRefine-Context', 'Qwen3.8-27B-GeoRefine-Context-abliterated', 'Qwen3.8-27B-GeoRefine-TBE',
  ]);
});

test('new releases retain pinned complete packages, provenance, and immutable URL allowlists', () => {
  for (const [id, revision, path, size, sha256, totalBytes, fileCount] of expected) {
    const entry = TSOTCHKE_MODEL_CATALOG[id];
    assert.equal(GGUF_MODEL_CATALOG[id], entry);
    assert.equal(findModelCatalogEntry(entry), entry);
    assert.equal(entry.revision, revision);
    assert.equal(entry.totalBytes, totalBytes);
    assert.equal(entry.weightBytes, size);
    assert.equal(entry.files.length, fileCount);
    assert.equal(entry.files.reduce((sum, file) => sum + file.size, 0), totalBytes);
    assert.deepEqual(entry.files.filter((file) => file.path.endsWith('.gguf')), [{ path, size, sha256 }]);
    for (const required of ['README.md', 'LICENSE', 'NOTICE', 'artifact-manifest.json']) {
      assert.ok(entry.files.some((file) => file.path === required));
    }
    assert.equal(entry.license.spdx, 'Apache-2.0');
    assert.match(entry.provenance.sourceModel.revision, /^[a-f0-9]{40}$/);
    assert.equal(entry.provenance.codecRequired, false);
    assert.equal(entry.provenance.modelCardUrl, `https://huggingface.co/${entry.repository}/blob/${revision}/README.md`);
    for (const file of entry.files) {
      assert.ok(Number.isSafeInteger(file.size) && file.size > 0);
      assert.match(file.sha256 ?? file.gitBlobSha1, file.sha256 ? /^[a-f0-9]{64}$/ : /^[a-f0-9]{40}$/);
      assert.equal(ggufModelFileUrl(id, file.path), `https://huggingface.co/${entry.repository}/resolve/${revision}/${file.path}`);
    }
    for (const path of ['../README.md', 'README.md?download=true', 'https://example.com/model.gguf', 'shards/model.safetensors']) {
      assert.throws(() => ggufModelFileUrl(id, path), /Unknown catalog/);
    }
    assert.throws(() => { entry.files[0].size = 0; }, TypeError);
    assert.throws(() => { entry.provenance.sourceModel.revision = '0'.repeat(40); }, TypeError);
  }
});

test('C30 and C20 remain unavailable under existing size policy even with ample configured memory', () => {
  for (const id of expected.slice(0, 2).map(([id]) => id)) {
    const entry = TSOTCHKE_MODEL_CATALOG[id];
    const result = evaluateModelCompatibility(entry, { device: capable,
      budgets: { cpuBytes: 512 * 1024 ** 3, gpuBytes: 512 * 1024 ** 3 } });
    assert.equal(result.status, 'unavailable');
    assert.equal(result.code, 'package_too_large');
    assert.throws(() => validateGgufManifest(manifestFor(entry)), /Invalid file size|byte budget/);
  }
});

test('L162 exact weights enter the managed allowlist while identity changes and device limits still reject', () => {
  const entry = TSOTCHKE_MODEL_CATALOG['qwen3.8-27b-georefine-l162-gguf'];
  const admitted = validateGgufManifest(manifestFor(entry));
  assert.equal(admitted.weights[0].sha256, expected[2][4]);
  assert.equal(admitted.resourcePolicy.maxModelBytes, 16 * 1024 ** 3);
  assert.equal(admitted.resourcePolicy.minimumCpuBytes, 8 * 1024 ** 3);
  assert.equal(admitted.resourcePolicy.minimumGpuBytes, 16 * 1024 ** 3);
  assert.equal(evaluateModelCompatibility(entry, { device: capable }).code, 'memory_fit_unverified');
  assert.equal(evaluateModelCompatibility(entry, { device: { ...capable, features: [] } }).code, 'gpu_feature_unavailable');
  assert.equal(evaluateModelCompatibility(entry, { device: capable, budgets: { gpuBytes: 8 * 1024 ** 3 } }).code, 'gpu_budget_exceeded');
  for (const changes of [{ sha256: '0'.repeat(64) }, { size: entry.weightBytes - 1 }, { path: 'substituted.gguf' }]) {
    const manifest = manifestFor(entry);
    Object.assign(manifest.files.find((file) => file.path.endsWith('.gguf')), changes);
    assert.throws(() => validateGgufManifest(manifest), /digests|trusted runtime catalog/);
  }
  for (const changes of [{ architecture: 'qwen3_moe' }, { revision: '0'.repeat(40) }, { dtype: 'q4_k_m' }]) {
    const manifest = manifestFor(entry); Object.assign(manifest.model, changes);
    assert.throws(() => validateGgufManifest(manifest), /trusted runtime catalog/);
  }
});

test('candidate metadata preserves publisher caveats without asserting new hardware or behavioral qualification', () => {
  for (const entry of Object.values(TSOTCHKE_MODEL_CATALOG)) {
    assert.equal(entry.status, 'execution-candidate');
    assert.equal(entry.capabilities.executionStatus, 'candidate');
    assert.equal(entry.capabilities.requiresCapabilityCheck, true);
    assert.equal(entry.model.runtime, 'llama.cpp');
    assert.equal(entry.model.runtimeVersion, '3.8.1');
    assert.deepEqual(entry.model.requiredFeatures, ['shader-f16']);
    assert.deepEqual(entry.model.modalities, ['text']);
    assert.equal(entry.model.dtype, 'mixed');
    assert.match(entry.provenance.vision, /text-only/);
  }
  const c20 = TSOTCHKE_MODEL_CATALOG['qwen3.6-35b-a3b-georefine-c20-gguf'];
  assert.match(c20.provenance.publisherLimitations, /failed coding-quality gate/);
  assert.match(c20.provenance.publisherLimitations, /clean-machine recipe remains unverified/);
  assert.ok(c20.files.some((file) => file.path === 'C20-MANIFEST.json'));
  assert.match(TSOTCHKE_MODEL_CATALOG['qwen3.8-27b-georefine-l162-gguf'].provenance.publisherLimitations, /not a custom codec/);
});
