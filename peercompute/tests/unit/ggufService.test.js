import test from 'node:test';
import assert from 'node:assert/strict';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';

const payload = Uint8Array.of(3, 5, 7, 11);
const digest = await sha256.digest(payload);
const cid = CID.createV1(0x55, digest).toString();
const manifest = { schema: 'peercompute.artifact.manifest.v1', model: { runtime: 'llama.cpp' },
  files: [{ path: 'weights.gguf', cid, size: payload.length, sha256: Buffer.from(digest.digest).toString('hex') }] };

function fixture({ failLoad = false, failStop = false } = {}) {
  const events = [], tasks = [];
  let port, stopFails = failStop;
  const service = new ModelInferenceService({
    artifactStore: {
      async getManifest() { return manifest; },
      async stat() { return { ...manifest.files[0], status: 'complete' }; },
      async *openRead(_cid, { offset, length }) { yield payload.slice(offset, offset + length); },
    },
    computeManager: {
      async reserveWorkerAffinity() { events.push('reserve'); },
      async releaseWorkerAffinity() { events.push('release-affinity'); },
      async cancelTask() {},
      async terminateWorkerAffinity() {
        events.push('terminate');
        if (stopFails) throw new Error('Stop not acknowledged');
        port?.close();
        events.push('stop-ack');
      },
      async submitTask(task) {
        tasks.push(task);
        if (task.data.command === 'load') {
          port = task.data.artifactPort;
          if (failLoad) throw new Error('Partial native load failed');
          return { status: 'ready' };
        }
        if (task.data.command === 'unload') throw new Error('Native exit is not a disposal acknowledgement');
        return { text: 'ok' };
      },
    },
    admission: { async acquire() { events.push('admit'); return { async release() { events.push('release-admission'); } }; } },
    runtimeDefinition: {
      id: 'llama.cpp', moduleUrl: 'peercompute:gguf-inference',
      retainArtifactBridge: true, terminateOnUnload: true,
      validateManifest(value) { return { manifest: value, resourcePolicy: { minimumCpuBytes: 1, minimumGpuBytes: 1 } }; },
      validateRuntimeAssets(value) { return value; },
      validateRuntimeOptions(value) { assert.deepEqual(value, { n_gpu_layers: 4 }); return { ...value, n_threads: 1 }; },
      validateGenerationInput({ image }) { if (image) throw new Error('This GGUF package is text-only'); },
    },
    runtimeOptions: { n_gpu_layers: 4 }, runtimeAssets: { wasm: 'https://example.test/engine.wasm' },
    resourceEstimate: { cpuBytes: 8, gpuBytes: 16 },
  });
  return { service, events, tasks, allowStop() { stopFails = false; },
    readRange() {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Resident artifact bridge closed too early')), 1000);
        const id = crypto.randomUUID();
        const listener = ({ data }) => {
          if (data.id !== id) return;
          if (data.type === 'ready') port.postMessage({ protocol: 'peercompute.model-artifact-read.v1', type: 'pull', id });
          if (data.type === 'chunk' || data.type === 'error') {
            clearTimeout(timer); port.removeEventListener('message', listener);
            port.postMessage({ protocol: 'peercompute.model-artifact-read.v1', type: 'cancel', id });
            if (data.type === 'error') reject(new Error(data.message)); else resolve(data.bytes);
          }
        };
        port.addEventListener('message', listener); port.start();
        port.postMessage({ protocol: 'peercompute.model-artifact-read.v1', type: 'open', id,
          path: 'weights.gguf', offset: 2, length: 2 });
      });
    },
  };
}

test('GGUF residency keeps verified file reads alive after load and releases only after owned-worker stop', async () => {
  const { service, events, tasks, readRange } = fixture();
  try {
    await service.loadModel({ manifestCid: cid, sessionId: 'gguf-resident' });
    assert.deepEqual(await readRange(), Uint8Array.of(7, 11));
    assert.deepEqual(tasks[0].data.runtimeOptions, { n_gpu_layers: 4, n_threads: 1 });
    assert.equal(tasks[0].module, 'peercompute:gguf-inference');
    assert.equal(service.getStatus().runtime, 'llama.cpp');
    assert.ok(service.getStatus().artifactReads);
    const result = await service.unloadModel();
    assert.equal(result.workerTerminated, true);
    assert.ok(events.indexOf('stop-ack') < events.indexOf('release-admission'));
    assert.ok(events.indexOf('release-admission') < events.indexOf('release-affinity'));
    assert.equal(service.getStatus().artifactReads, null);
  } finally { await service.dispose(); }
});

test('failed GGUF worker stop retains residency, bridge and affinity for explicit cleanup retry', async () => {
  const { service, events, allowStop } = fixture({ failStop: true });
  try {
    await service.loadModel({ manifestCid: cid });
    await assert.rejects(service.unloadModel(), /cleanup is incomplete/);
    assert.equal(service.getStatus().status, 'cleanup-failed');
    assert.ok(service.getStatus().artifactReads);
    assert.ok(!events.includes('release-admission'));
    assert.ok(!events.includes('release-affinity'));
  } finally { allowStop(); await service.dispose(); }
  assert.equal(events.filter((event) => event === 'release-admission').length, 1);
});

test('partial GGUF load retains resources when worker cleanup fails and disposes them on retry', async () => {
  const { service, events, allowStop } = fixture({ failLoad: true, failStop: true });
  try {
    await assert.rejects(service.loadModel({ manifestCid: cid }), /cleanup is incomplete/);
    assert.equal(service.getStatus().status, 'cleanup-failed');
    assert.ok(service.getStatus().artifactReads);
    assert.ok(!events.includes('release-admission'));
  } finally { allowStop(); await service.dispose(); }
  assert.equal(events.filter((event) => event === 'release-admission').length, 1);
});

test('runtime-specific input validation prevents unsupported image dispatch', async () => {
  const { service, tasks } = fixture();
  try {
    await service.loadModel({ manifestCid: cid });
    await assert.rejects(service.generate({ prompt: 'describe', image: {
      width: 1, height: 1, channels: 4, data: Uint8Array.of(0, 0, 0, 255),
    } }), /text-only/);
    assert.equal(tasks.length, 1);
  } finally { await service.dispose(); }
});
