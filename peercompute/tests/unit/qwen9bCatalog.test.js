import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { QWEN_9B_MODEL_CATALOG } from '../../src/peercompute/artifacts/qwen9bModelCatalog.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { validateGgufManifest, ggufRuntimeDefinition } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';

const cid = 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku';
const manifestFor = (entry) => ({ schema: 'peercompute.artifact.manifest.v1', name: entry.name,
  model: { ...entry.model }, provenance: entry.provenance,
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });
const expected = [
  ['qwen3.5-9b-evil-bowman-q5-k-m-gguf', '9531689a9d2da3897eae104ddf9fff92031a73d8',
    'Qwen3.5-9B-Evil-Q5_K_M.gguf', 6467969824, 'bff5a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc', 'q5_k_m'],
  ['qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf', '84c2de4ce65b7bb33584521767646adf9663b128',
    'Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED.Q4_K_M.gguf', 5627045888,
    'b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d', 'q4_k_m'],
  ['qwen3.5-9b-evil-mradermacher-q8-0-gguf', '8f99fdb7e067bceb703544772e11e97e4e3ce3b3',
    'Qwen3.5-9B-Evil-BF16.Q8_0.gguf', 9786061312, 'e2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247', 'q8_0'],
  ['qwen3.5-9b-evil-mradermacher-q4-k-m-gguf', '8f99fdb7e067bceb703544772e11e97e4e3ce3b3',
    'Qwen3.5-9B-Evil-BF16.Q4_K_M.gguf', 5780091392, 'cfdca30d8666ad7ddf25fa14c24e4e8967c191c70d122185d3bcb612f5f50c95', 'q4_k_m'],
];

for (const [id, revision, path, size, sha256, dtype] of expected) {
  test(`${id} admits its exact immutable package and rejects replaced weights`, () => {
    const entry = QWEN_9B_MODEL_CATALOG[id];
    assert.equal(GGUF_MODEL_CATALOG[id], entry);
    assert.equal(entry.revision, revision); assert.equal(entry.model.dtype, dtype);
    assert.equal(entry.weightBytes, size);
    assert.deepEqual(entry.files.filter((file) => file.path.endsWith('.gguf')), [{ path, size, sha256 }]);
    assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
    assert.equal(validateGgufManifest(manifestFor(entry)).weights[0].sha256, sha256);
    for (const replacement of [{ sha256: '0'.repeat(64) }, { size: size - 1 }, { path: 'other.gguf' }]) {
      const manifest = manifestFor(entry); Object.assign(manifest.files[0], replacement);
      assert.throws(() => validateGgufManifest(manifest), /digests|trusted runtime catalog/);
    }
    const altered = manifestFor(entry); altered.model.revision = '0'.repeat(40);
    assert.throws(() => validateGgufManifest(altered), /trusted runtime catalog/);
    assert.throws(() => { entry.files[0].sha256 = '0'.repeat(64); }, TypeError);
  });
}

test('Q4 and Q8 from one repository revision remain separate admissions', () => {
  const q4 = QWEN_9B_MODEL_CATALOG['qwen3.5-9b-evil-mradermacher-q4-k-m-gguf'];
  const q8 = QWEN_9B_MODEL_CATALOG['qwen3.5-9b-evil-mradermacher-q8-0-gguf'];
  assert.equal(q4.repository, q8.repository); assert.equal(q4.revision, q8.revision);
  assert.equal(validateGgufManifest(manifestFor(q4)).weights[0].size, 5780091392);
  assert.equal(validateGgufManifest(manifestFor(q8)).weights[0].size, 9786061312);
  const swapped = manifestFor(q4); swapped.files = manifestFor(q8).files;
  assert.throws(() => validateGgufManifest(swapped), /digests|trusted runtime catalog/);
});

test('new packages preserve license, model cards and immutable metadata sources', () => {
  assert.equal(Object.keys(QWEN_9B_MODEL_CATALOG).length, 4);
  for (const entry of Object.values(QWEN_9B_MODEL_CATALOG)) {
    assert.equal(entry.license.spdx, 'Apache-2.0');
    assert.ok(entry.files.some((file) => file.path === 'LICENSE'));
    assert.ok(entry.files.some((file) => file.path === 'README.md'));
    if (entry.behavior.kind === 'experimental-behavior-edit') {
      assert.ok(entry.files.some((file) => file.path === 'NOTICE'));
      assert.ok(entry.files.some((file) => file.path === 'EVALUATION.md'));
      assert.match(entry.behavior.notice, /capability damage/);
    }
    for (const file of entry.files) {
      assert.match(file.sha256, /^[a-f0-9]{64}$/);
      const source = file.source ?? { repository: entry.repository, revision: entry.revision, path: file.path };
      assert.match(source.revision, /^[a-f0-9]{40}$/);
      assert.equal(ggufModelFileUrl(entry.id, file.path),
        `https://huggingface.co/${source.repository}/resolve/${source.revision}/${source.path}`);
    }
    for (const path of ['../LICENSE', 'README.md?download=true', 'mmproj.gguf']) {
      assert.throws(() => ggufModelFileUrl(entry.id, path), /Unknown catalog/);
    }
  }
});

test('DavidAU source and its third-party conversion are disclosed separately', () => {
  const entry = QWEN_9B_MODEL_CATALOG['qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf'];
  assert.equal(entry.repository, 'mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF');
  assert.equal(entry.provenance.sourceModel.repository, 'DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED');
  assert.equal(entry.provenance.sourceModel.revision, '22818ca1184f346094524bdd7cda7c7125009808');
  assert.equal(entry.provenance.sourceModel.conversionInputRevisionVerified, false);
  const sourceCard = entry.files.find((file) => file.path === 'SOURCE_README.md');
  assert.equal(sourceCard.source.repository, entry.provenance.sourceModel.repository);
  assert.equal(sourceCard.source.path, 'README.md');
  assert.match(entry.behavior.notice, /not a guarantee/);
});

test('upstream context and vision metadata do not claim qualified browser capabilities', () => {
  for (const entry of Object.values(QWEN_9B_MODEL_CATALOG)) {
    assert.equal(entry.status, 'execution-candidate');
    assert.equal(entry.capabilities.executionStatus, 'candidate');
    assert.equal(entry.model.runtimeVersion, '3.8.1');
    assert.equal(entry.model.architecture, 'qwen3_5');
    assert.deepEqual(entry.model.modalities, ['text']);
    assert.deepEqual(entry.model.requiredFeatures, ['shader-f16']);
    assert.equal(entry.provenance.upstreamContextTokens, 262144);
    assert.equal(entry.provenance.ggufHeader.version, 3);
    assert.equal(entry.provenance.ggufHeader.blockCount - entry.provenance.ggufHeader.nextnPredictLayers, 32);
    assert.match(entry.provenance.vision, /text-only/);
    assert.throws(() => ggufRuntimeDefinition.validateGenerationInput({ image: {}, maxNewTokens: 1 }), /text only/);
  }
});

test('existing GGUF package names, model/provenance and file metadata remain byte-for-byte unchanged', () => {
  const fingerprints = {
    'qwen3.5-0.8b-q4-k-m-gguf': 'dfa9700252d2a54585e68c90e2375be4b6337eb25700a3034fc4c0fe875e44ee',
    'qwen3-0.6b-abliterated-q4-k-m-gguf': 'd36dbc8a0eeb23f89332b01d2e6cb867e0d543f3db23549ddc75f74381739e10',
    'qwen3.5-0.8b-abliterated-q4-k-m-gguf': 'a67019f9a2ba64b55fda648f2b7b99562fc97bb53046446a69107f2d91ca69e6',
    'qwen3.8-27b-georefine-d14-gguf': '79ce0bdebbf3c0ea56da7ae39babf3ded40aad6a3c7c8775070f92b6a0f6203c',
  };
  for (const [id, fingerprint] of Object.entries(fingerprints)) {
    const { name, model, provenance, files } = GGUF_MODEL_CATALOG[id];
    assert.equal(createHash('sha256').update(JSON.stringify({ name, model, provenance, files })).digest('hex'), fingerprint, id);
  }
});
