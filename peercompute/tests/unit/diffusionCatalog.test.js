import assert from 'node:assert/strict';
import test from 'node:test';
import { DIFFUSION_MODEL_CATALOG, diffusionModelFileUrl } from '../../src/peercompute/artifacts/diffusionModelCatalog.js';

test('diffusion candidates pin complete bounded ONNX, tokenizer, card and license closures', () => {
  const expected = { 'sd-turbo-onnx': 2516150032, 'dreamshaper-8-lcm-int8-onnx': 1037003247 };
  for (const [id, bytes] of Object.entries(expected)) {
    const entry = DIFFUSION_MODEL_CATALOG[id];
    assert.equal(entry.totalBytes, bytes); assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
    assert.equal(entry.model.runtime, 'onnx-diffusion'); assert.equal(entry.model.runtimeVersion, '1.31.1');
    assert.equal(entry.model.task, 'text-to-image'); assert.deepEqual(entry.model.outputModalities, ['image']);
    assert.deepEqual(entry.model.modalities, ['text']); assert.deepEqual(entry.model.requiredFeatures, ['shader-f16']);
    assert.equal(entry.model.width, 512); assert.equal(entry.model.height, 512);
    assert.equal(entry.files.length, 7); assert.equal(entry.capabilities.executionStatus, 'candidate');
    assert.deepEqual(entry.files.filter((file) => file.path.endsWith('.onnx')).map((file) => file.path),
      ['text_encoder/model.onnx', 'unet/model.onnx', 'vae_decoder/model.onnx']);
    assert(entry.files.some((file) => file.path === 'tokenizer/tokenizer.json'));
    assert(entry.files.some((file) => file.path === 'tokenizer/tokenizer_config.json'));
    assert(entry.files.some((file) => file.path === 'README.md'));
    assert(entry.files.some((file) => file.path.startsWith('LICENSE')));
    for (const file of entry.files) {
      assert.match(file.sha256, /^[a-f0-9]{64}$/); assert.match(file.source.revision, /^[a-f0-9]{40}$/);
      assert(file.size < 2 * 1024 ** 3, 'Every ONNX graph stays below the single-buffer 2GiB boundary');
      assert.equal(diffusionModelFileUrl(id, file.path), `https://huggingface.co/${file.source.repository}/resolve/${file.source.revision}/${file.source.path}`);
    }
    assert.throws(() => { entry.model.steps = 99; }, TypeError);
  }
});

test('pipeline metadata distinguishes Turbo from LCM and weight quantization from execution precision', () => {
  const sd = DIFFUSION_MODEL_CATALOG['sd-turbo-onnx'];
  const dream = DIFFUSION_MODEL_CATALOG['dreamshaper-8-lcm-int8-onnx'];
  assert.equal(sd.model.pipeline, 'sd-turbo'); assert.equal(sd.model.steps, 1); assert.equal(sd.model.padTokenId, 0);
  assert.match(sd.license.notice, /November 2023/);
  assert.equal(dream.model.pipeline, 'lcm'); assert.equal(dream.model.steps, 4); assert.equal(dream.model.padTokenId, 49407);
  assert.equal(dream.model.weightQuantization, 'int8-per-channel');
  assert.deepEqual(dream.model.dtype, { text_encoder: 'fp16', unet: 'fp16', vae_decoder: 'fp32' });
  assert.equal(dream.license.spdx, 'CreativeML-OpenRAIL-M');
  assert.equal(dream.provenance.baseRevision, '4645d8bc6a8e6b106d21606d63e8460cdad4f1a6');
});

test('diffusion URL mapping rejects undeclared paths, revisions, and identifiers', () => {
  for (const path of ['../README.md', 'unet/model.onnx?download=1', 'https://example.com/model.onnx', 'int8/unet_int8.onnx']) {
    assert.throws(() => diffusionModelFileUrl('dreamshaper-8-lcm-int8-onnx', path), /Unknown catalog/);
  }
  assert.throws(() => diffusionModelFileUrl('unapproved', 'README.md'), /Unknown catalog/);
});
