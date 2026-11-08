import assert from 'node:assert/strict';
import test from 'node:test';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { validateGgufManifest } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';

const cid = 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku';
const manifestFor = (entry) => ({ schema: 'peercompute.artifact.manifest.v1', name: entry.name,
  model: { ...entry.model }, files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });
const expected = [
  ['qwen3-0.6b-abliterated-q4-k-m-gguf', '92351f431cfdd36f71149aaf072a6490a68e144e', 396704896,
    'a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1', 'qwen3'],
  ['qwen3.5-0.8b-abliterated-q4-k-m-gguf', '6cef073175dbdc81594b27bfcb9804ab6122f119', 541903744,
    'eef9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5ef067c1dd9d61', 'qwen3_5'],
];

for (const [id, revision, weightBytes, digest, architecture] of expected) {
  test(`${id} admits exactly its pinned small GGUF package and includes source/license evidence`, () => {
    const entry = GGUF_MODEL_CATALOG[id];
    assert.equal(entry.revision, revision); assert.equal(entry.weightBytes, weightBytes);
    assert.equal(entry.files[0].sha256, digest); assert.equal(entry.model.architecture, architecture);
    assert.equal(entry.license.spdx, 'Apache-2.0');
    assert.match(entry.behavior.notice, /not a guarantee/);
    assert.equal(entry.capabilities.executionStatus, 'candidate');
    assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
    assert.equal(entry.files.length, 3);
    assert(entry.files.some((file) => file.path === 'README.md'));
    assert(entry.files.some((file) => file.path === 'LICENSE'));
    for (const file of entry.files) {
      assert.match(file.sha256, /^[a-f0-9]{64}$/);
      const source = file.source ?? entry;
      assert(ggufModelFileUrl(id, file.path).includes(`/resolve/${source.revision}/`));
    }
    assert.throws(() => { entry.files[0].sha256 = '0'.repeat(64); }, TypeError);
    const manifest = manifestFor(entry);
    assert.equal(validateGgufManifest(manifest).weights[0].sha256, digest);
    manifest.files[0].sha256 = '0'.repeat(64);
    assert.throws(() => validateGgufManifest(manifest), /digests/);
    const wrongDtype = manifestFor(entry); wrongDtype.model.dtype = 'fp16';
    assert.throws(() => validateGgufManifest(wrongDtype), /trusted runtime catalog/);
    const noVersion = manifestFor(entry); delete noVersion.model.runtimeVersion;
    assert.throws(() => validateGgufManifest(noVersion), /trusted runtime catalog/);
  });
}

test('GGUF metadata source lookup admits only listed files and immutable secondary sources', () => {
  const id = expected[0][0];
  const license = GGUF_MODEL_CATALOG[id].files.find((file) => file.path === 'LICENSE');
  assert.equal(ggufModelFileUrl(id, 'LICENSE'), `https://huggingface.co/${license.source.repository}/resolve/${license.source.revision}/LICENSE`);
  for (const path of ['../LICENSE', 'LICENSE?download=true', 'https://example.com/LICENSE']) {
    assert.throws(() => ggufModelFileUrl(id, path), /Unknown catalog/);
  }
});
