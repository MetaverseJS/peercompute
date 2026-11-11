import assert from 'node:assert/strict';
import test from 'node:test';
import { GEMMA4_MODEL_CATALOG } from '../../src/peercompute/artifacts/gemma4ModelCatalog.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { validateGgufManifest, ggufRuntimeDefinition } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';

const cid = 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku';
const entry = GEMMA4_MODEL_CATALOG['gemma4-12b-uncensored-q4-k-m-gguf'];
const manifestFor = () => ({ schema: 'peercompute.artifact.manifest.v1', name: entry.name,
  model: { ...entry.model }, provenance: entry.provenance,
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });

test('Gemma4 Q4 admits the pinned package and rejects a changed weight or quantization', () => {
  assert.equal(GGUF_MODEL_CATALOG[entry.id], entry);
  assert.equal(entry.revision, 'd878d412b001a720b9a62eaac432d00aac9d1b4f');
  assert.deepEqual(entry.files.filter((file) => file.path.endsWith('.gguf')), [{
    path: 'gemma-4-12B-it-uncensored-Q4_K_M.gguf', size: 7381382208,
    sha256: '6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494',
  }]);
  assert.equal(entry.weightBytes, 7381382208);
  assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
  assert.equal(validateGgufManifest(manifestFor()).weights[0].sha256, entry.files[0].sha256);
  for (const replacement of [{ sha256: '0'.repeat(64) }, { size: entry.weightBytes - 1 }, { path: 'other.gguf' }]) {
    const manifest = manifestFor(); Object.assign(manifest.files[0], replacement);
    assert.throws(() => validateGgufManifest(manifest), /digests|trusted runtime catalog/);
  }
  for (const replacement of [{ dtype: 'q8_0' }, { architecture: 'gemma3' }, { revision: '0'.repeat(40) }]) {
    const manifest = manifestFor(); Object.assign(manifest.model, replacement);
    assert.throws(() => validateGgufManifest(manifest), /trusted runtime catalog/);
  }
});

test('Gemma4 links immutable source provenance while keeping Hub files in the conversion repository', () => {
  assert.equal(entry.license.spdx, 'Apache-2.0');
  assert.equal(entry.license.sourceUrl, 'https://ai.google.dev/gemma/apache_2');
  assert.match(entry.license.notice, /do not provide a separate LICENSE/);
  assert.equal(entry.files.some((file) => file.path === 'LICENSE'), false);
  assert.deepEqual(entry.files.map((file) => file.path), ['gemma-4-12B-it-uncensored-Q4_K_M.gguf', 'README.md']);
  const source = entry.provenance.sourceModel;
  assert.equal(source.modelCardUrl, `https://huggingface.co/${source.repository}/blob/${source.revision}/README.md`);
  assert.equal(source.modelCardBytes, 4929);
  assert.equal(source.modelCardSha256, 'd2994dbe94e6a1c3fce070b0b6efc5fe8e9aa4a7803b41f29c1479713bad352b');
  assert.equal(entry.provenance.sourceModel.conversionInputRevisionVerified, false);
  for (const file of entry.files) {
    assert.equal(file.source, undefined, 'Hub catalog variants must resolve all files in their own repository');
    const source = file.source ?? { repository: entry.repository, revision: entry.revision, path: file.path };
    assert.match(file.sha256, /^[a-f0-9]{64}$/);
    assert.match(source.revision, /^[a-f0-9]{40}$/);
    assert.equal(ggufModelFileUrl(entry.id, file.path),
      `https://huggingface.co/${source.repository}/resolve/${source.revision}/${source.path}`);
  }
  assert.throws(() => ggufModelFileUrl(entry.id, 'mmproj.gguf'), /Unknown catalog/);
  assert.throws(() => { entry.files[0].size = 1; }, TypeError);
});

test('Gemma4 candidate uses its actual architecture and remains text-only despite multimodal ancestry', () => {
  assert.equal(entry.model.architecture, 'gemma4');
  assert.equal(entry.model.runtimeVersion, '3.8.1');
  assert.equal(entry.provenance.ggufHeader.tokenizer, 'gemma4');
  assert.equal(entry.provenance.ggufHeader.completeHeaderBytes, 15822379);
  assert.equal(entry.provenance.upstreamModel.architecture, 'Gemma4UnifiedForConditionalGeneration');
  assert.deepEqual(entry.provenance.upstreamModel.modalities, ['text', 'image', 'audio']);
  assert.deepEqual(entry.model.modalities, ['text']);
  assert.deepEqual(entry.model.requiredFeatures, ['shader-f16']);
  assert.equal(entry.status, 'execution-candidate');
  assert.equal(entry.capabilities.executionStatus, 'candidate');
  assert.equal(entry.capabilities.requiresCapabilityCheck, true);
  assert.match(entry.capabilities.executionReason, /Unverified/);
  assert.match(entry.provenance.vision, /text-only/);
  assert.match(entry.provenance.publisherEvaluation, /does not establish Q4_K_M browser/);
  assert.throws(() => ggufRuntimeDefinition.validateGenerationInput({ image: {}, maxNewTokens: 1 }), /text only/);
});
