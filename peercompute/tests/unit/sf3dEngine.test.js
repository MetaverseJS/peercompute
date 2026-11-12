import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createSf3dEngine, createSf3dProgressReporter } from '../../src/peercompute/inference/sf3d/engine.js';
import { meshProgress } from '../../src/peercompute/networkManager/inference/protocol.js';
import { createSf3dArtifactSource, SF3D_READ_BYTES } from '../../src/peercompute/inference/sf3d/artifactSource.js';
import { SF3D_MODEL_CATALOG } from '../../src/peercompute/artifacts/sf3dModelCatalog.js';
import { encodeGeneratedMesh } from '../../src/peercompute/inference/GeneratedMeshArtifact.js';

const entry = Object.values(SF3D_MODEL_CATALOG)[0];
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const manifest = () => ({ schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
  files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) });
const image = { width: 3, height: 3, channels: 4, data: new Uint8Array(36) };
image.data.set([200, 80, 40, 255], 16);
const triangle = encodeGeneratedMesh({ positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), indices: new Uint32Array([0, 1, 2]) });

test('production SF3D diagnostics normalize to bounded peer mesh progress', async () => {
  const events = [], report = createSf3dProgressReporter(value => events.push(meshProgress(value)));
  const source = await readFile(new URL('../../src/peercompute/inference/sf3d/vendor/src/lib/inference.js', import.meta.url), 'utf8');
  const literalStages = [...source.matchAll(/report\('([^']+)'\)/g)].map(match => match[1]);
  assert(literalStages.includes('Preprocessing image...'));
  assert(literalStages.includes('Extracting mesh...'));
  report('foreground');
  report(literalStages.find(stage => stage.startsWith('Preprocessing')));
  report(literalStages.find(stage => stage.startsWith('Computing camera')));
  report(literalStages.find(stage => stage.startsWith('Running DINOv2')));
  // Real production templates can emit thousands of duty updates. Every one
  // traverses the production reporter, then the unchanged network validator.
  for (let i = 0; i <= 24; i++) report(`DINOv2 blocks ${i}/24 (${(i / .24).toFixed(0)}%)`);
  report(literalStages.find(stage => stage.startsWith('Running two-stream')));
  for (let i = 0; i <= 3000; i++) report(`Two-stream duties ${i}/3000 (${(i / 30).toFixed(0)}%)`);
  report(literalStages.find(stage => stage.startsWith('Running post-processor')));
  for (let i = 0; i <= 702; i++) report(`Post-processor duties ${i}/702 (${(i / 7.02).toFixed(0)}%)`);
  for (const stage of literalStages.filter(stage => /Querying|Reading back|Extracting/.test(stage))) report(stage);
  report('Mesh extracted: 100 vertices, 200 faces');
  report('clip-material-estimate'); report('uv-unwrap'); report('uv-rasterize'); report('texture-bake');
  for (let i = 0; i <= 1048576; i += 4096) report(`Texture bake ${i}/1048576 (${(i / 10485.76).toFixed(0)}%)`);
  report('glb-export'); report('done'); report('done');
  assert(events.length <= 32);
  assert.equal(events.length, 32);
  assert.deepEqual([...new Set(events.map(value => value.stage))], ['image', 'shape', 'color', 'done']);
  assert.deepEqual(events.filter(value => value.stage === 'shape' && value.loaded >= 10 && value.loaded <= 55)
    .map(value => value.loaded), [10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  assert.equal(events.at(-1).loaded, 1);
  assert.equal(events.at(-1).total, 1);
  for (let i = 1; i < events.length; i++) if (events[i].stage === events[i - 1].stage) {
    assert(events[i].loaded > events[i - 1].loaded);
  }
});

function harness({ loadFailure = false, producerRun, noDispatch = false, invalidGraph = false, foregroundAllocations = false } = {}) {
  const state = { resources: [], destroys: 0, readClosed: 0, releases: 0, producerDisposals: 0, weightDisposals: 0, scopes: [] };
  const resource = descriptor => {
    const result = { descriptor, destroyed: 0, destroy() { result.destroyed++; } };
    result.originalDestroy = result.destroy;
    state.resources.push(result); return result;
  };
  const device = { features: new Set(), limits: { maxBufferSize: 2 ** 30, maxStorageBufferBindingSize: 2 ** 30 },
    lost: new Promise(() => {}), queue: { submit() {}, async onSubmittedWorkDone() {} },
    createBuffer: resource, createTexture: resource,
    createCommandEncoder() { return { beginComputePass: () => ({ dispatchWorkgroups() {}, end() {} }), finish: () => ({}) }; },
    pushErrorScope(filter) { state.scopes.push(filter); }, async popErrorScope() { assert(state.scopes.pop()); return null; },
    addEventListener() {}, removeEventListener() {}, destroy() { state.destroys++; } };
  const adapter = { limits: device.limits, info: {}, async requestDevice(options) { state.deviceOptions = options; return device; } };
  const weights = { backbone: {}, _rawGet() { state.lazyWeight ??= device.createBuffer({ label: 'lazy-weight', size: 64 }); return state.lazyWeight; },
    dispose() { state.weightDisposals++; state.weight?.destroy(); state.lazyWeight?.destroy(); } };
  const producer = { pipelines: {}, async run(input, options) {
    state.input = input; state.runOptions = options;
    state.scratch = device.createBuffer({ label: 'scratch', size: 4096 });
    weights._rawGet();
    producer.pipelines.bias ??= device.createBuffer({ label: 'pipeline-bias', size: 128 });
    weights.backbone._rearrangedEmbeddings ??= device.createBuffer({ label: 'rearranged-embedding', size: 256 });
    options.onProgress('shape');
    if (producerRun) await producerRun({ input, options, device, state });
    if (!noDispatch) {
      const encoder = device.createCommandEncoder(), pass = encoder.beginComputePass();
      pass.dispatchWorkgroups(1); pass.end(); device.queue.submit([encoder.finish()]);
    }
    return { glb: triangle.data.buffer, totalMs: 1, offloads: { preprocess: 'main' } };
  }, dispose() { state.producerDisposals++; return { completion: Promise.resolve() }; } };
  class Tensor { constructor(type, data, dims) { Object.assign(this, { type, data, dims }); } dispose() {} }
  const ort = { Tensor, env: { versions: { web: '1.31.1' }, wasm: {} }, InferenceSession: { async create(graph, options) {
    state.foregroundOptions = options;
    if (foregroundAllocations) state.foregroundWeight = device.createBuffer({ label: 'ort-weight', size: 1024 ** 3 });
    return { inputNames: invalidGraph ? ['wrong'] : ['input.1'], outputNames: ['1959', '1960', '1961', '1962', '1963', '1964', '1965'],
      async run() {
        const temporary = device.createBuffer({ label: 'ort-temporary', size: 2 * 1024 ** 3 });
        (state.foregroundTemporary ??= []).push(temporary);
        assert.equal(temporary.destroy, temporary.originalDestroy, 'ORT buffer methods stay untouched');
        const encoder = device.createCommandEncoder(), pass = encoder.beginComputePass();
        pass.dispatchWorkgroups(1); pass.end(); device.queue.submit([encoder.finish()]);
        return { '1959': { type: 'float32', dims: [1, 1, 320, 320], data: new Float32Array(320 * 320),
          dispose() { temporary.destroy(); } } };
      },
      async release() { state.releases++; state.foregroundWeight?.destroy(); } };
  } } };
  const options = { manifest: manifest(), runtimeAssets: { mjs: 'trusted.mjs', wasm: 'trusted.wasm' },
    gpu: { async requestAdapter() { return adapter; } }, loadOrt: async () => ort,
    createReader(port, config) {
      state.readerOptions = config;
      return { close() { state.readClosed++; }, stat(path) { return { path, size: 4 }; }, getStats: () => ({ completedReads: 4 }) };
    },
    createSource: () => ({ async weights() { return { tensors: new Map() }; },
      async tetData() { return { gridVertices: new Float32Array(12), indices: new Int32Array([0, 1, 2, 3]) }; },
      async read() { return new Uint8Array(4); } }),
    loadVendor: async () => ({ async loadWeights(receivedDevice) {
      assert.equal(receivedDevice, device);
      state.weight = device.createBuffer({ label: 'weight', size: 1024 });
      if (loadFailure) throw new Error('weight upload failed');
      return weights;
    }, async createProducer(config) { state.producerOptions = config; return producer; } }),
  };
  return { options, state, device, weights, producer };
}

test('foreground ORT allocation wrappers remain unowned across cutout and repeated opaque requests', async () => {
  const h = harness({ foregroundAllocations: true });
  const engine = await createSf3dEngine({ ...h.options,
    prepareForeground: () => new Float32Array(3 * 320 * 320), applyMask: () => image });
  assert.equal(h.state.foregroundWeight.destroy, h.state.foregroundWeight.originalDestroy);
  assert.equal(engine.getEvidence().liveBufferBytes, 1024, 'ORT session weight excluded from SF3D byte inventory');
  assert.equal(engine.getEvidence().ortBufferAllocations, 1);
  await engine.generate({ image });
  const opaque = { width: 1, height: 1, channels: 4, data: new Uint8Array([50, 100, 200, 255]) };
  for (let i = 0; i < 2; i++) {
    await engine.generate({ image: opaque });
    assert.equal(h.state.foregroundWeight.destroyed, 0, 'SF3D phases cannot retire ORT weights');
    assert.equal(h.state.foregroundTemporary[i].destroyed, 1, 'ORT output disposal owns temporary lifetime');
    assert.equal(engine.getEvidence().liveBufferBytes, 1472);
  }
  const evidence = engine.getEvidence();
  assert.equal(evidence.generatedRequests, 3);
  assert.equal(evidence.foregroundRequests, 2);
  assert.equal(evidence.ortBufferAllocations, 3);
  assert.equal(evidence.gpuDispatches, 5, 'both runtimes remain covered by dispatch instrumentation');
  assert.equal(evidence.peakBufferBytes, 5568, 'peak explicitly covers only owned SF3D buffers');
  assert.match(evidence.allocationAuthority, /excludes ORT foreground buffers/);
  await engine.dispose();
  assert.equal(h.state.foregroundWeight.destroyed, 1, 'only ORT session release destroys its weight');
  assert.equal(h.state.foregroundWeight.destroy, h.state.foregroundWeight.originalDestroy);
  assert.equal(engine.getEvidence().liveBufferBytes, 0);
});

test('SF3D loads into one managed device without children and retires only generation scratch', async () => {
  const h = harness(), engine = await createSf3dEngine(h.options);
  assert.equal(h.state.producerOptions.device, h.device);
  assert.equal(h.state.foregroundOptions.executionProviders[0].device, h.device);
  assert.deepEqual(h.state.producerOptions.workers, {});
  assert.equal(h.state.readerOptions.maxReadBytes, SF3D_READ_BYTES);
  assert.equal(h.state.readClosed, 1);
  for (let i = 0; i < 2; i++) {
    const output = await engine.generate({ image });
    assert.equal(output.mesh.sha256, triangle.sha256);
    assert.equal(output.gpuDispatches, 1);
    assert.equal(h.state.scratch.destroyed, 1);
    assert.equal(h.state.lazyWeight.destroyed, 0);
    assert.equal(h.producer.pipelines.bias.destroyed, 0);
  }
  assert.equal(engine.getEvidence().generatedRequests, 2);
  assert.equal(engine.getEvidence().subordinateWorkers, 0);
  assert.equal(h.state.input, image);
  assert(h.state.runOptions.routeOverrides.tetData.indices);
  await engine.dispose(); await engine.dispose();
  assert.equal(h.state.weight.destroyed, 1);
  assert.equal(h.state.lazyWeight.destroyed, 1);
  assert.equal(h.producer.pipelines.bias.destroyed, 1);
  assert.equal(h.state.producerDisposals, 1);
  assert.equal(h.state.releases, 1);
  assert.equal(engine.getEvidence().liveBufferBytes, 0);
  await assert.rejects(engine.generate({ image }), /unloaded/);
});

test('cached uniforms in nested Map/Set containers survive phases and repeated requests', async () => {
  const h = harness({ producerRun: async ({ device, options }) => {
    const pipelines = h.producer.pipelines;
    if (!pipelines.uniforms) {
      const uniform = device.createBuffer({ label: 'cached-uniform', size: 64 });
      pipelines.uniforms = new Map([['shape', new Set([uniform])]]);
      pipelines.uniforms.set('cycle', pipelines);
      h.state.uniform = uniform;
    }
    assert.equal(h.state.uniform.destroyed, 0, 'next request must not reuse a destroyed uniform');
    await options.routeOverrides.retirePhase('shape', []);
    assert.equal(h.state.uniform.destroyed, 0, 'phase cleanup preserves cached uniforms');
    assert.equal(h.state.scratch.destroyed, 1, 'unrelated scratch still retires');
  } });
  const engine = await createSf3dEngine(h.options);
  for (let index = 0; index < 3; index++) {
    await engine.generate({ image });
    assert.equal(h.state.uniform.destroyed, 0);
  }
  await engine.dispose();
  assert.equal(h.state.uniform.destroyed, 1);
  assert.equal(engine.getEvidence().liveBufferBytes, 0);
});

test('module-private shader uniforms remain resident until engine disposal', async () => {
  const cache = new Map();
  const h = harness({ producerRun: async ({ device, options }) => {
    if (!cache.has('conv')) cache.set('conv', device.createBuffer({ label: 'module-uniform', size: 64 }));
    assert.equal(cache.get('conv').destroyed, 0);
    await options.routeOverrides.retirePhase('post-processor', []);
    assert.equal(cache.get('conv').destroyed, 0);
    assert.equal(h.state.scratch.destroyed, 1);
  } });
  const loadVendor = h.options.loadVendor;
  h.options.loadVendor = async () => ({ ...await loadVendor(), getPersistentResources: () => ({ cache }) });
  const engine = await createSf3dEngine(h.options);
  for (let index = 0; index < 3; index++) await engine.generate({ image });
  assert.equal(cache.get('conv').destroyed, 0);
  await engine.dispose();
  assert.equal(cache.get('conv').destroyed, 1);
});

test('queue-fenced phases retire dead scratch while retaining outputs and weight caches', async () => {
  const h = harness({ producerRun: async ({ options, device, state }) => {
    const retained = device.createBuffer({ size: 512, label: 'phase-output' });
    await options.routeOverrides.retirePhase('shape', [retained]);
    assert.equal(state.scratch.destroyed, 1);
    assert.equal(retained.destroyed, 0);
    assert.equal(state.lazyWeight.destroyed, 0);
    assert.equal(h.weights.backbone._rearrangedEmbeddings.destroyed, 0);
    const next = device.createBuffer({ size: 256, label: 'later-phase-scratch' });
    await options.routeOverrides.retirePhase('color', []);
    assert.equal(retained.destroyed, 1);
    assert.equal(next.destroyed, 1);
  } });
  const engine = await createSf3dEngine(h.options);
  await engine.generate({ image });
  const evidence = engine.getEvidence();
  assert.equal(evidence.peakBufferBytes, 6080);
  assert.equal(evidence.liveBufferBytes, 1472);
  assert.deepEqual(evidence.phaseAllocations.map(value => value.retiredBytes), [4096, 768]);
  assert.equal(h.weights.backbone._rearrangedEmbeddings.destroyed, 0);
  await engine.dispose();
  assert.equal(engine.getEvidence().liveBufferBytes, 0);
});

test('actual inference orchestration requests upstream retirement and preserves stage outputs', async () => {
  const source = await readFile(new URL('../../src/peercompute/inference/sf3d/vendor/src/lib/inference.js', import.meta.url), 'utf8');
  const seen = {}, tokensBuf = {}, backboneBuffer = {}, stop = new Error('reached-backbone-boundary');
  // Isolate imported GPU kernels, while executing the unmodified production
  // orchestration body. This test performs no shader compilation or GPU work.
  const imports = {
    createStorageBuffer: () => ({}), createEmptyBuffer: () => ({}), readBuffer() {},
    prepareConditionImage: () => ({ chw: new Float32Array(12), rgba: new Uint8Array(16) }), validateConditionReply() {},
    SF3D_IMAGE_PREPROCESS: { condImageSize: 512 }, callWorker() {},
    withForegroundScope: async (_options, _phase, work) => work(),
    SF3DImageTokenizer: class {}, TwoStreamBackbone: class {}, TriplaneDecoder: class {},
    async runCooperativeDino(options) { seen.dino = options; return { result: { tokensBuf, N: 1297 }, report: {} }; },
    async runCooperativeTwoStream(options) { seen.backbone = options; return { result: { buffer: backboneBuffer }, report: {} }; },
    dispatchTokenizerEmbedding: () => ({}), dispatchPostProcessor() {}, runCooperativePostProcessor() {},
    loadTetData() {}, loadTetGridVertices() {}, marchingTetrahedra() {}, runMarchingTetOnWorker() {}, scaleTensor() {},
  };
  const key = `sf3d-kernel-seams-${Date.now()}`;
  globalThis[key] = imports;
  try {
    const isolated = source.replace(/^import\s*\{([\s\S]*?)\}\s*from\s*'[^']+';/gm,
      (_match, names) => `const {${names}} = globalThis[${JSON.stringify(key)}];`);
    const { runInference } = await import(`data:text/javascript;base64,${Buffer.from(isolated).toString('base64')}`);
    const device = { queue: { submit() {} }, createCommandEncoder: () => ({ finish: () => ({}) }) };
    const pipelines = { imageTokenizer: { _dispatchLinear() {} }, twoStream: {} };
    await assert.rejects(runInference(device, pipelines, { cameraEmbedder: {}, backbone: {}, tokenizer: {} }, image, () => {}, {
      cooperativeDino: true, cooperativeTwoStream: true, twoStreamDutyGranularity: 'attention-tile',
      async retirePhase(phase, keep) {
        if (phase === 'dinov2-tokenizer') assert.equal(keep[0], tokensBuf);
        if (phase === 'two-stream-backbone') { assert.equal(keep[0], backboneBuffer); throw stop; }
      },
    }), error => error === stop);
    assert.equal(seen.dino.retireIntermediateBuffers, true);
    assert.equal(seen.backbone.retireIntermediateBuffers, true);
    assert.equal(seen.backbone.dutyGranularity, 'attention-tile');
  } finally { delete globalThis[key]; }
});

test('partial weight upload failure frees allocations even without a returned owner', async () => {
  const h = harness({ loadFailure: true });
  await assert.rejects(createSf3dEngine(h.options), /weight upload failed/);
  assert.equal(h.state.weight.destroyed, 1);
  assert.equal(h.state.readClosed, 1);
  assert(h.state.destroys >= 1);
});

test('wrong foreground graph unwinds weights, session, bridge and device', async () => {
  const h = harness({ invalidGraph: true });
  await assert.rejects(createSf3dEngine(h.options), /pinned interface/);
  assert.equal(h.state.weight.destroyed, 1);
  assert.equal(h.state.releases, 1);
  assert.equal(h.state.readClosed, 1);
});

test('completed CPU-only output is not accepted as WebGPU evidence', async () => {
  const h = harness({ noDispatch: true }), engine = await createSf3dEngine(h.options);
  await assert.rejects(engine.generate({ image }), /did not dispatch/);
  assert.equal(engine.lost, true);
  await assert.rejects(engine.generate({ image }), /session lost/);
  await engine.dispose();
});

test('pre-abort leaves session available, while mid-run cancellation quarantines and cleans', async () => {
  let release, started;
  const ready = new Promise(resolve => { started = resolve; });
  const gate = new Promise(resolve => { release = resolve; });
  const h = harness({ producerRun: async () => { started(); await gate; } });
  const engine = await createSf3dEngine(h.options), before = new AbortController();
  before.abort();
  await assert.rejects(engine.generate({ image }, { signal: before.signal }), { name: 'AbortError' });
  assert.equal(engine.lost, false);
  const controller = new AbortController(), pending = engine.generate({ image }, { signal: controller.signal });
  await ready;
  await assert.rejects(engine.generate({ image }), /already generating/);
  controller.abort(); release();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(engine.lost, true);
  assert.equal(h.state.scratch.destroyed, 1);
  await engine.dispose();
  assert.equal(h.state.weight.destroyed, 1);
});

test('disposal during inference waits for admitted work and forbids publication', async () => {
  let release, started;
  const ready = new Promise(resolve => { started = resolve; });
  const gate = new Promise(resolve => { release = resolve; });
  const h = harness({ producerRun: async ({ options }) => { started(); await gate; options.onProgress('export'); } });
  const engine = await createSf3dEngine(h.options), pending = engine.generate({ image });
  await ready;
  const disposal = engine.dispose();
  assert.equal(engine.dispose(), disposal);
  release(); await assert.rejects(pending, /unloaded/); await disposal;
  assert.equal(engine.getEvidence().generatedRequests, 0);
  assert.equal(h.state.producerDisposals, 1);
  assert.equal(h.state.weight.destroyed, 1);
});

function weightFixture(payloadSize = SF3D_READ_BYTES + 16) {
  const bytes = new Uint8Array(176 + payloadSize), view = new DataView(bytes.buffer);
  view.setUint32(0, 0x33445346, true); view.setUint32(4, 1, true);
  view.setUint32(8, 1, true); view.setUint32(12, 176, true);
  bytes.set(new TextEncoder().encode('tensor'), 16);
  view.setUint32(16 + 128, 1, true); view.setUint32(16 + 132, 1, true);
  view.setUint32(16 + 136, payloadSize / 2, true); view.setUint32(16 + 152, 0, true);
  view.setUint32(16 + 156, payloadSize, true);
  return bytes;
}
function sourceHarness(bytes, { signal, truncate = false } = {}) {
  const reads = [], reader = { stat: path => ({ path, size: bytes.length, sha256: 'a'.repeat(64) }),
    async read(path, offset, size) { reads.push({ path, offset, size }); return bytes.slice(offset, offset + size - (truncate ? 1 : 0)); } };
  return { source: createSf3dArtifactSource(reader, { signal }), reads };
}

test('artifact tensor streaming honors exact bounded ranges across a large tensor', async () => {
  const bytes = weightFixture(), { source, reads } = sourceHarness(bytes);
  const weights = await source.weights();
  assert.equal(weights.tensors.get('tensor').offset, 176);
  let received = 0;
  await weights.consumeTensor('tensor', (chunk, offset) => { assert.equal(offset, received); received += chunk.length; });
  assert.equal(received, bytes.length - 176);
  assert(reads.every(read => read.size <= SF3D_READ_BYTES));
  assert.deepEqual(reads.slice(2).map(read => read.size), [SF3D_READ_BYTES, 16]);
  await assert.rejects(weights.readTensor('absent'), /Missing SF3D tensor/);
});

test('artifact loader rejects malformed tables, truncated bytes and cancellation', async () => {
  const bytes = weightFixture(16), malformed = bytes.slice();
  new DataView(malformed.buffer).setUint32(12, SF3D_READ_BYTES * 2, true);
  await assert.rejects(sourceHarness(malformed).source.weights(), /table bounds/);
  await assert.rejects(sourceHarness(bytes, { truncate: true }).source.weights(), /Truncated/);
  const controller = new AbortController(), h = sourceHarness(bytes, { signal: controller.signal });
  const weights = await h.source.weights(); controller.abort();
  await assert.rejects(weights.consumeTensor('tensor', () => {}), { name: 'AbortError' });
  await assert.rejects(h.source.read('weights.bin', 0, 2 ** 30), /allocation exceeds/);
});

test('tet admission preserves pinned boundary roundoff and rejects malformed indices', async () => {
  const original = new Float32Array([-9.015202806494926e-8, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const load = async (vertices, indices) => {
    const files = { 'tets/vertices.bin': new Uint8Array(vertices.buffer), 'tets/indices.bin': new Uint8Array(indices.buffer) };
    const reader = { stat: path => ({ path, size: files[path].byteLength }),
      read: async (path, offset, size) => files[path].slice(offset, offset + size) };
    return createSf3dArtifactSource(reader).tetData();
  };
  const result = await load(original, new Int32Array([0, 1, 2, 3]));
  assert.deepEqual(new Uint8Array(result.gridVertices.buffer), new Uint8Array(original.buffer));
  assert.equal(result.gridVertices[0], original[0]);
  await assert.rejects(load(original, new Int32Array([0, 1, 2, 4])), /tet values/);
  await assert.rejects(load(original, new Int32Array([-1, 1, 2, 3])), /tet values/);
  await assert.rejects(load(original, new Int32Array([0, 1, 2])), /array layout/);
  const excessive = original.slice(); excessive[0] = -0.001;
  await assert.rejects(load(excessive, new Int32Array([0, 1, 2, 3])), /tet values/);
  excessive[0] = NaN;
  await assert.rejects(load(excessive, new Int32Array([0, 1, 2, 3])), /tet values/);
});
