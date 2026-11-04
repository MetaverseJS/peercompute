import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { MODEL_ARTIFACT_CATALOG } from '../../src/peercompute/artifacts/modelArtifactCatalog.js';

test('GGUF baseline is a bounded pinned qwen35 text package with immutable source checks', () => {
  const item = GGUF_MODEL_CATALOG['qwen3.5-0.8b-q4-k-m-gguf'];
  assert.equal(item.model.architecture, 'qwen3_5');
  assert.equal(item.model.runtime, 'llama.cpp');
  assert.equal(item.model.runtimeVersion, '3.8.1');
  assert.deepEqual(item.model.modalities, ['text']);
  assert.match(item.revision, /^[a-f0-9]{40}$/);
  assert(item.totalBytes < 600_000_000);
  assert.equal(item.totalBytes, item.files.reduce((sum, file) => sum + file.size, 0));
  const weights = item.files.filter((file) => file.path.endsWith('.gguf'));
  assert.equal(weights.length, 1);
  assert.equal(weights[0].size, 579615840);
  assert.equal(weights[0].sha256, 'fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526');
  assert.equal(item.capabilities.requiresCapabilityCheck, true);
  assert.notEqual(item.capabilities.executionStatus, 'verified');
});

test('runtime candidate preserves the exact previously imported 27B package', () => {
  const id = 'qwen3.8-27b-georefine-d14-gguf';
  const original = MODEL_ARTIFACT_CATALOG[id];
  const candidate = GGUF_MODEL_CATALOG[id];
  for (const key of ['files', 'model', 'provenance', 'license', 'revision', 'totalBytes']) {
    assert.deepEqual(candidate[key], original[key], `${key} changes would alter the package CID`);
  }
  assert.equal(candidate.capabilities.requiresCapabilityCheck, true);
  assert.equal(original.capabilities.browserInference, false);
  const { name, model, provenance, files } = candidate;
  assert.equal(createHash('sha256').update(JSON.stringify({ name, model, provenance, files })).digest('hex'),
    '79ce0bdebbf3c0ea56da7ae39babf3ded40aad6a3c7c8775070f92b6a0f6203c');
});

test('GGUF source lookup rejects paths and identifiers outside the pinned catalog', () => {
  const id = 'qwen3.5-0.8b-q4-k-m-gguf';
  const entry = GGUF_MODEL_CATALOG[id];
  assert.equal(ggufModelFileUrl(id, entry.files[0].path),
    `https://huggingface.co/${entry.repository}/resolve/${entry.revision}/${entry.files[0].path}`);
  for (const path of ['../weights.gguf', 'https://example.com/model.gguf', 'unlisted.gguf']) {
    assert.throws(() => ggufModelFileUrl(id, path), /Unknown catalog/);
  }
  assert.throws(() => ggufModelFileUrl('unapproved', 'README.md'), /Unknown catalog/);
});
