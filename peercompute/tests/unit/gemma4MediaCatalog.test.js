import assert from 'node:assert/strict';
import test from 'node:test';
import { GEMMA4_MODEL_CATALOG } from '../../src/peercompute/artifacts/gemma4ModelCatalog.js';
import { GEMMA4_MEDIA_MODEL_CATALOG } from '../../src/peercompute/artifacts/gemma4MediaModelCatalog.js';
import { GEMMA4_PROJECTOR_RECIPE as recipe, GEMMA4_PROJECTOR_FILE, isTrustedGemma4ProjectorFile }
  from '../../src/peercompute/artifacts/gemma4ProjectorRecipe.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { validateGgufManifest } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';

const text = GEMMA4_MODEL_CATALOG['gemma4-12b-uncensored-q4-k-m-gguf'];
const media = GEMMA4_MEDIA_MODEL_CATALOG['gemma4-12b-uncensored-q4-k-m-multimodal-gguf'];

test('media is a distinct package that reuses every existing decoder artifact byte', () => {
  assert.notEqual(media.id, text.id);
  assert.equal(GGUF_MODEL_CATALOG[media.id], media);
  assert.deepEqual(media.files.slice(0, text.files.length), text.files);
  assert.deepEqual(text.model.modalities, ['text']);
  assert.equal(text.model.ggufMedia, undefined);
  assert.deepEqual(media.model.modalities, ['text', 'image', 'audio']);
  assert.deepEqual(media.model.ggufMedia, { profile: 'gemma4-unified-v1', projectorPath: GEMMA4_PROJECTOR_FILE.path });
  assert.equal(media.model.task, 'text-generation');
  assert.throws(() => ggufModelFileUrl(media.id, media.model.ggufMedia.projectorPath), /derived locally/);
  assert.equal(media.totalBytes, text.totalBytes + 122030944);
  const manifest = { schema: 'peercompute.artifact.manifest.v1', model: media.model,
    files: media.files.map(({ path, size, sha256 }) => ({ path, size, sha256,
      cid: 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku' })) };
  const admitted = validateGgufManifest(manifest);
  assert.equal(admitted.projector.sha256, recipe.sha256);
  assert.deepEqual(admitted.weights.map(({ path, size, sha256 }) => ({ path, size, sha256 })), [text.files[0]]);
});

test('catalog separates recorded browser execution from incomplete publisher ancestry', () => {
  assert.equal(media.capabilities.executionStatus, 'tested');
  assert.match(media.capabilities.executionReason, /retained reload and encrypted peer inference/);
  assert.equal(media.provenance.sourceModel.conversionInputRevisionVerified, false);
  assert.match(media.provenance.outputModalities, /^Text only/);
  const derived = media.provenance.derivedArtifacts[0];
  assert.equal(derived.sourceRepository, recipe.source.repository);
  assert.equal(derived.sourceRevision, recipe.source.revision);
  assert.equal(derived.sourceFileSha256, recipe.source.publisherSha256);
  assert.match(derived.sourceDigestVerification, /entire source checkpoint is not downloaded/);
  assert.equal(derived.converter.revision, recipe.converterRevision);
  assert.equal(derived.processor.repository, 'google/gemma-4-12B-it');
  assert.match(derived.processor.notice, /Trevor source omits/);
  assert.equal(media.license, text.license);
});

test('projector source and output identities are immutable, bounded and explicitly pinned', () => {
  assert.equal(recipe.source.url,
    'https://huggingface.co/TrevorJS/gemma-4-12B-it-uncensored/resolve/159eb7a8a04efb31ed43887e4732ff3edccff8ac/model.safetensors');
  assert.equal(recipe.sha256, 'ee1fed84b7d15ffc4d13c44b59fff59e50fe89f36adcc5ec4900c83efd0edc27');
  assert.equal(recipe.tensors.length, 11);
  assert.equal(recipe.tensors.reduce((sum, tensor) => sum + tensor.sourceBytes, 0), 104759808);
  assert.equal(recipe.sourceTensorBytes < recipe.source.size / 100, true);
  let end = recipe.headerHex.length / 2;
  for (const tensor of recipe.tensors) {
    assert.equal(tensor.sourceOffset >= 88960 && tensor.sourceOffset + tensor.sourceBytes <= recipe.source.size, true);
    assert.match(tensor.sourceSha256, /^[a-f0-9]{64}$/);
    assert.equal(tensor.outputOffset >= end && tensor.outputOffset - end < 32, true);
    end = tensor.outputOffset + tensor.outputBytes;
  }
  assert.equal(end, recipe.size);
  assert.throws(() => { recipe.tensors[0].sourceOffset = 0; }, TypeError);
  assert.throws(() => { media.model.ggufMedia.profile = 'other'; }, TypeError);
  assert.equal(isTrustedGemma4ProjectorFile(GEMMA4_PROJECTOR_FILE), true);
  for (const mutation of [{ path: 'another.gguf' }, { size: recipe.size + 1 }, { sha256: '0'.repeat(64) }]) {
    assert.equal(isTrustedGemma4ProjectorFile({ ...GEMMA4_PROJECTOR_FILE, ...mutation }), false);
  }
});
