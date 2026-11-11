import test from 'node:test';
import assert from 'node:assert/strict';
import { createMeshEngine } from '../../src/peercompute/inference/mesh/engine.js';
import { MESH_MODEL_CATALOG } from '../../src/peercompute/artifacts/meshModelCatalog.js';
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const entry = MESH_MODEL_CATALOG['triposr-q8-onnx'];
const manifest = () => ({ schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });
const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([128, 64, 16, 255]) };

function harness({ failLoad = false, encoderRun, fallback = false, releaseError = false } = {}) {
  const evidence = { releases: [], options: [], scopes: [], readerClosed: 0, destroys: 0, reads: [], disposedOutputs: 0 };
  const device = { features: new Set(), lost: new Promise(() => {}),
    queue: { submit() {}, async onSubmittedWorkDone() {} }, createCommandEncoder() {},
    pushErrorScope(value) { evidence.scopes.push(value); }, async popErrorScope() { assert(evidence.scopes.pop()); return null; },
    addEventListener() {}, removeEventListener() {}, destroy() { evidence.destroys++; } };
  const adapter = { limits: { maxBufferSize: 1024 ** 3, maxStorageBufferBindingSize: 512 * 1024 ** 2 },
    info: { isFallbackAdapter: fallback }, async requestDevice(options) { evidence.deviceOptions = options; return device; } };
  class Tensor {
    constructor(type, data, dims) { Object.assign(this, { type, data, dims }); }
    dispose() { evidence.disposedOutputs++; }
  }
  const ort = { Tensor, env: { versions: { web: '1.31.1' }, wasm: {} }, InferenceSession: {
    async create(_bytes, options) {
      evidence.options.push(options); const name = evidence.options.length === 1 ? 'encoder' : 'decoder';
      if (failLoad && name === 'decoder') throw new Error('Native load failure');
      return { inputNames: name === 'encoder' ? ['image'] : ['features'], outputNames: name === 'encoder' ? ['triplane'] : ['density', 'color'],
        async release() { evidence.releases.push(name); if (releaseError) throw new Error('native release failed'); }, async run() {
          if (encoderRun) return encoderRun(Tensor);
          return { triplane: new Tensor('float32', new Float32Array(3 * 40 * 64 * 64), [1, 3, 40, 64, 64]) };
        } };
    },
  } };
  const options = { manifest: manifest(), runtimeAssets: {}, gpu: { async requestAdapter() { return adapter; } }, loadOrt: async () => ort,
    createReader: () => ({ close() { evidence.readerClosed++; }, getStats() { return { readCount: evidence.reads.length }; } }),
    readModelFile: async (_reader, file) => { evidence.reads.push(file.path); return new Uint8Array([1]); },
    prepareImage: () => new Float32Array(3 * 512 * 512) };
  return { evidence, device, options };
}

test('both native sessions bind the exact owned device and release model reader/device deterministically', async () => {
  const h = harness(), engine = await createMeshEngine(h.options);
  assert.deepEqual(h.evidence.reads, ['triplane_q8.onnx', 'triplane_q8.onnx.data', 'decoder.onnx']);
  assert(h.evidence.options.every(option => option.executionProviders[0].device === h.device));
  assert.equal(h.evidence.readerClosed, 1); assert.equal(h.evidence.options[0].externalData[0].path, 'triplane_q8.onnx.data');
  assert.equal(engine.getEvidence().artifactReads.readCount, 3);
  await engine.dispose(); await engine.dispose();
  assert.deepEqual(h.evidence.releases, ['encoder', 'decoder']); assert.equal(h.evidence.destroys, 1);
  assert.deepEqual(h.evidence.scopes, []);
});

test('failed second session load releases the successful first session and all owned resources', async () => {
  const h = harness({ failLoad: true }); await assert.rejects(createMeshEngine(h.options), /Native load failure/);
  assert.deepEqual(h.evidence.releases, ['encoder']); assert.equal(h.evidence.readerClosed, 1); assert.equal(h.evidence.destroys, 1);
  assert.deepEqual(h.evidence.scopes, []);
});

test('native inference failure wins over racing cancellation and quarantines the model', async () => {
  const controller = new AbortController();
  const h = harness({ encoderRun: async () => { controller.abort(); throw new WebAssembly.RuntimeError('native trap'); } });
  const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.generate({ image }, { signal: controller.signal }), /Model session lost.*native trap/);
  assert.equal(engine.lost, true); await assert.rejects(engine.generate({ image }), /Model session lost/);
  await engine.dispose(); assert.deepEqual(h.evidence.scopes, []);
});

test('cooperative cancellation disposes encoder outputs without quarantining a healthy model', async () => {
  const controller = new AbortController();
  const h = harness({ encoderRun: async Tensor => { controller.abort(); return { triplane: new Tensor('float32', new Float32Array(3 * 40 * 64 * 64), [1, 3, 40, 64, 64]) }; } });
  const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.generate({ image }, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(engine.lost, false); assert.equal(h.evidence.disposedOutputs, 2); await engine.dispose();
});

test('hardware requirement rejects software fallback before any model bytes are read', async () => {
  const h = harness({ fallback: true }); await assert.rejects(createMeshEngine(h.options), /hardware WebGPU/);
  assert.equal(h.evidence.reads.length, 0); assert.equal(h.evidence.destroys, 0);
});


test('cleanup errors preserve their native cause while still releasing both sessions and device', async () => {
  const h = harness({ releaseError: true }); const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.dispose(), /native release failed/);
  assert.equal(engine.lost, true); assert.equal(h.evidence.destroys, 1);
  assert.deepEqual(h.evidence.releases, ['encoder', 'decoder']); await engine.dispose();
});
