import assert from 'node:assert/strict';
import test from 'node:test';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { ADDITIONAL_MODEL_CATALOG } from '../../src/peercompute/inference/additionalModelCatalog.js';
import { MODEL_CATALOG, modelFileUrl } from '../../src/peercompute/inference/modelCatalog.js';
import { MODEL_POLICY, validateModelManifest } from '../../src/peercompute/inference/modelManifest.js';

const cid = CID.createV1(0x55, await sha256.digest(new Uint8Array([5]))).toString();
const makeManifest = (entry) => ({ schema: 'peercompute.artifact.manifest.v1',
  model: structuredClone(entry.model), files: entry.files.map((file) => ({
    ...file, cid, sha256: file.sha256 ?? 'a'.repeat(64),
  })) });

test('additional text packages pin distinct q4 exports and their full runtime sidecars', () => {
  const expected = {
    'qwen2.5-coder-0.5b-q4': { revision: '604bb1988ff789d5024d589c63cf9ae81c0c8ab5',
      sha256: '2df7ea9739c3c26bd9d2cad0815768a5a0a985d4b5548b7de80c5e85e9a97b47',
      totalBytes: 877970632, architecture: 'qwen2', count: 10 },
    'smollm2-360m-instruct-q4': { revision: 'a10cc1512eabd3dde888204e902eca88bddb4951',
      sha256: 'a4ffda96e65beafc6f6cef0cbcf9fdc1cbdd79c230906bf3897d190547c7a596',
      totalBytes: 391327556, architecture: 'llama', count: 9 },
  };
  assert.deepEqual(Object.keys(ADDITIONAL_MODEL_CATALOG), Object.keys(expected));
  for (const [id, pin] of Object.entries(expected)) {
    const entry = ADDITIONAL_MODEL_CATALOG[id];
    assert.equal(MODEL_CATALOG[id], entry);
    assert.equal(entry.revision, pin.revision);
    assert.equal(entry.totalBytes, pin.totalBytes);
    assert.equal(entry.files.length, pin.count);
    assert.equal(entry.model.architecture, pin.architecture);
    assert.equal(entry.model.dtype, 'q4');
    assert.deepEqual(entry.model.requiredFeatures, []);
    assert.equal(entry.license.spdx, 'Apache-2.0');
    assert.ok(entry.license.sourceUrl.includes('/blob/'));
    const weights = entry.files.filter((file) => file.path.endsWith('.onnx'));
    assert.equal(weights.length, 1);
    assert.equal(weights[0].path, 'onnx/model_q4.onnx');
    assert.equal(weights[0].sha256, pin.sha256);
    assert.equal(weights[0].size, entry.weightBytes);
    assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
    assert.ok(entry.totalBytes < MODEL_POLICY.maxModelBytes);
    for (const path of ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'generation_config.json', 'README.md']) {
      assert.ok(entry.files.some((file) => file.path === path));
      assert.ok(modelFileUrl(id, path).includes(`/resolve/${pin.revision}/${path}`));
    }
    assert.equal(validateModelManifest(makeManifest(entry)).manifest.model.task, 'text-generation');
    assert.ok(Object.isFrozen(entry.files[0]) && Object.isFrozen(entry.model.requiredFeatures));
  }
});

test('new causal architectures cannot claim vision tasks or omit their selected weights', () => {
  for (const entry of Object.values(ADDITIONAL_MODEL_CATALOG)) {
    const input = makeManifest(entry);
    delete input.model.task;
    assert.equal(validateModelManifest(input).manifest.model.task, 'text-generation');
    input.model.task = 'image-text-to-text';
    assert.throws(() => validateModelManifest(input), /task does not match/);
    input.model.task = 'text-generation';
    input.files = input.files.filter((file) => !file.path.endsWith('.onnx'));
    assert.throws(() => validateModelManifest(input), /Incomplete model package/);
    input.model.architecture = 'unapproved-causal';
    assert.throws(() => validateModelManifest(input), /not approved/);
  }
});

test('additional architectures retain existing package and precision admission limits', () => {
  for (const entry of Object.values(ADDITIONAL_MODEL_CATALOG)) {
    const input = makeManifest(entry);
    input.files.find((file) => file.path.endsWith('.onnx')).size = MODEL_POLICY.maxModelBytes;
    assert.throws(() => validateModelManifest(input), /file budget/);
    const wrongVariant = makeManifest(entry);
    wrongVariant.model.dtype = 'q4f16';
    assert.throws(() => validateModelManifest(wrongVariant), /Incomplete model package/);
  }
});
