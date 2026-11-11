import test from 'node:test';
import assert from 'node:assert/strict';
import { createMeshEngine } from '../../src/peercompute/inference/mesh/engine.js';
import { MESH_MODEL_CATALOG, LEGACY_MESH_PACKAGES } from '../../src/peercompute/artifacts/meshModelCatalog.js';
import { hasForegroundAlpha, requireForegroundAlpha } from '../../src/peercompute/inference/mesh/imagePreparation.js';
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const entry = MESH_MODEL_CATALOG['triposr-q8-onnx'];
const manifest = (entry = MESH_MODEL_CATALOG['triposr-q8-onnx']) => ({ schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });
const image = { width: 3, height: 3, channels: 4, data: new Uint8Array(36) }; image.data.set([128, 64, 16, 255], 16);
const opaque = { width: 1, height: 1, channels: 4, data: new Uint8Array([128, 64, 16, 255]) };
const foregroundOutputs = ['1959', '1960', '1961', '1962', '1963', '1964', '1965'];

function harness({ failLoad = false, encoderRun, foregroundRun, fallback = false, releaseError = false, badForegroundInterface = false, legacy = false } = {}) {
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
      evidence.options.push(options); const name = ['encoder', 'decoder', 'foreground'][evidence.options.length - 1];
      if ((failLoad === true && name === 'decoder') || failLoad === name) throw new Error('Native load failure');
      return { inputNames: name === 'foreground' ? [badForegroundInterface ? 'wrong' : 'input.1'] : name === 'encoder' ? ['image'] : ['features'],
        outputNames: name === 'foreground' ? foregroundOutputs : name === 'encoder' ? ['triplane'] : ['density', 'color'],
        async release() { evidence.releases.push(name); if (releaseError) throw new Error('native release failed'); }, async run() {
          if (name === 'foreground') {
            evidence.foregroundRuns = (evidence.foregroundRuns ?? 0) + 1;
            if (foregroundRun) return foregroundRun(Tensor);
            return Object.fromEntries(foregroundOutputs.map(key => [key, new Tensor('float32', new Float32Array(320 * 320), [1, 1, 320, 320])]));
          }
          if (encoderRun) return encoderRun(Tensor);
          return { triplane: new Tensor('float32', new Float32Array(3 * 40 * 64 * 64), [1, 3, 40, 64, 64]) };
        } };
    },
  } };
  const options = { manifest: manifest(legacy ? LEGACY_MESH_PACKAGES[0] : entry), runtimeAssets: {}, gpu: { async requestAdapter() { return adapter; } }, loadOrt: async () => ort,
    createReader: () => ({ close() { evidence.readerClosed++; }, getStats() { return { readCount: evidence.reads.length }; } }),
    readModelFile: async (_reader, file) => { evidence.reads.push(file.path); return new Uint8Array([1]); },
    prepareImage: () => new Float32Array(3 * 512 * 512),
    prepareForeground: () => new Float32Array(3 * 320 * 320), applyMask: () => image };
  return { evidence, device, options };
}

test('all three native sessions bind the exact owned device and release model reader/device deterministically', async () => {
  const h = harness(), engine = await createMeshEngine(h.options);
  assert.deepEqual(h.evidence.reads, ['triplane_q8.onnx', 'triplane_q8.onnx.data', 'decoder.onnx', 'u2netp.onnx']);
  assert(h.evidence.options.every(option => option.executionProviders[0].device === h.device));
  assert.equal(h.evidence.readerClosed, 1); assert.equal(h.evidence.options[0].externalData[0].path, 'triplane_q8.onnx.data');
  assert.equal(engine.getEvidence().artifactReads.readCount, 4);
  await engine.dispose(); await engine.dispose();
  assert.deepEqual(h.evidence.releases, ['encoder', 'decoder', 'foreground']); assert.equal(h.evidence.destroys, 1);
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


test('cleanup errors preserve their native cause while still releasing all sessions and device', async () => {
  const h = harness({ releaseError: true }); const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.dispose(), /native release failed/);
  assert.equal(engine.lost, true); assert.equal(h.evidence.destroys, 1);
  assert.deepEqual(h.evidence.releases, ['encoder', 'decoder', 'foreground']); await engine.dispose();
});

test('failed foreground load and wrong graph interface release every successfully created session', async () => {
  for (const input of [{ failLoad: 'foreground' }, { badForegroundInterface: true }]) {
    const h = harness(input); await assert.rejects(createMeshEngine(h.options), /Native load failure|graph interfaces/);
    assert.deepEqual(h.evidence.releases, input.failLoad ? ['encoder', 'decoder'] : ['encoder', 'decoder', 'foreground']);
    assert.equal(h.evidence.readerClosed, 1); assert.equal(h.evidence.destroys, 1); assert.deepEqual(h.evidence.scopes, []);
  }
});

test('opaque pixels pass through learned separation before TripoSR and all mask outputs are disposed', async () => {
  const controller = new AbortController();
  const h = harness({ encoderRun: async Tensor => { controller.abort(); return { triplane: new Tensor('float32', new Float32Array(3 * 40 * 64 * 64), [1, 3, 40, 64, 64]) }; } });
  let prepared = false;
  h.options.prepareImage = input => { assert(hasForegroundAlpha(input)); prepared = true; return new Float32Array(3 * 512 * 512); };
  const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.generate({ image: opaque }, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(prepared, true); assert.equal(h.evidence.foregroundRuns, 1); assert.equal(engine.getEvidence().foregroundRequests, 1);
  assert.equal(h.evidence.disposedOutputs, 10); assert.equal(engine.lost, false); await engine.dispose();
});

test('cancelling foreground inference disposes seven outputs before any TripoSR encoding', async () => {
  const controller = new AbortController(); let encoded = false;
  const h = harness({ foregroundRun: async Tensor => {
    controller.abort(); return Object.fromEntries(foregroundOutputs.map(key => [key, new Tensor('float32', new Float32Array(320 * 320), [1, 1, 320, 320])]));
  }, encoderRun: async () => { encoded = true; throw new Error('should not encode'); } });
  const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.generate({ image: opaque }, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(encoded, false); assert.equal(h.evidence.disposedOutputs, 8); assert.equal(engine.lost, false); await engine.dispose();
});

test('legacy opaque rejection precedes GPU encoding and a later transparent request reaches a healthy encoder', async () => {
  const controller = new AbortController(); let encoded = 0;
  const h = harness({ legacy: true, encoderRun: async Tensor => {
    encoded++; controller.abort(); return { triplane: new Tensor('float32', new Float32Array(3 * 40 * 64 * 64), [1, 3, 40, 64, 64]) };
  } });
  h.options.prepareImage = input => { requireForegroundAlpha(input); return new Float32Array(3 * 512 * 512); };
  const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.generate({ image: opaque }), error => error.code === 'ERR_MESH_FOREGROUND' && /current TripoSR/.test(error.message));
  assert.equal(encoded, 0); assert.equal(engine.lost, false); assert.deepEqual(h.evidence.releases, []);
  await assert.rejects(engine.generate({ image }, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(encoded, 1); assert.equal(h.evidence.foregroundRuns, undefined); assert.equal(engine.lost, false);
  assert.equal(h.evidence.options.length, 2); await engine.dispose();
  assert.deepEqual(h.evidence.releases, ['encoder', 'decoder']);
});

test('ambiguous learned mask rejects only that request; valid cutout still bypasses segmentation afterward', async () => {
  const controller = new AbortController(); let encoded = 0;
  const h = harness({ encoderRun: async Tensor => { encoded++; controller.abort(); return { triplane: new Tensor('float32', new Float32Array(3 * 40 * 64 * 64), [1, 3, 40, 64, 64]) }; } });
  h.options.applyMask = () => { throw Object.assign(new Error('Could not isolate foreground'), { code: 'ERR_MESH_FOREGROUND' }); };
  const engine = await createMeshEngine(h.options);
  await assert.rejects(engine.generate({ image: opaque }), { code: 'ERR_MESH_FOREGROUND' });
  assert.equal(encoded, 0); assert.equal(engine.lost, false); assert.equal(h.evidence.disposedOutputs, 8);
  await assert.rejects(engine.generate({ image }, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(encoded, 1); assert.equal(h.evidence.foregroundRuns, 1); assert.equal(engine.lost, false); await engine.dispose();
});
