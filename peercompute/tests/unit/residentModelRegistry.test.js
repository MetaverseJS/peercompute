import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as tick } from 'node:timers/promises';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { ResidentModelRegistry } from '../../src/peercompute/inference/ResidentModelRegistry.js';
import { ResourceLeaseBroker } from '../../src/peercompute/serviceOrchestration/ResourceLeaseBroker.js';
import { ResidentModelAdmission } from '../../src/peercompute/serviceOrchestration/ResidentModelAdmission.js';

const cids = await Promise.all([1, 2, 3, 4].map(async (value) => CID.createV1(0x55, await sha256.digest(new Uint8Array([value]))).toString()));
function deferred() { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; }
function fixture(t, { beforeLoad, beforeFactory, failDispose = () => false } = {}) {
  const broker = new ResourceLeaseBroker({ capacities: { cpu: { units: 8, memoryBytes: 60 }, gpu: { units: 8, memoryBytes: 60 } } });
  const admission = new ResidentModelAdmission({ broker });
  const uses = new Set(), services = [];
  const store = {
    async acquireUse(cid) { uses.add(cid); return () => uses.delete(cid); },
    async getManifest(cid) { return { name: cid, model: { runtime: 'transformers.js', task: 'text-generation' } }; },
  };
  const registry = new ResidentModelRegistry({ artifactStore: store, async createService({ manifestCid }) {
    await beforeFactory?.();
    let status = 'idle', lease;
    const service = {
      closed: false,
      getStatus: () => ({ status, manifestCid: status === 'idle' ? null : manifestCid, sessionId: manifestCid }),
      async loadModel({ signal }) {
        status = 'loading'; await beforeLoad?.(manifestCid, signal); signal.throwIfAborted();
        lease = await admission.acquire({ sessionId: manifestCid, manifestCid, estimatedCpuBytes: 20, estimatedGpuBytes: 20 });
        status = 'ready'; return { workerId: `worker-${services.indexOf(service)}` };
      },
      async dispose() {
        if (failDispose(manifestCid)) { status = 'cleanup-failed'; throw new Error('Worker termination was not acknowledged'); }
        await lease?.release(); status = 'idle'; this.closed = true;
      },
    };
    services.push(service); return service;
  } });
  t.after(() => registry.dispose());
  return { registry, broker, uses, services };
}

test('same-runtime models receive independent services and shared aggregate admission without eviction', async (t) => {
  const f = fixture(t);
  for (const cid of cids.slice(0, 3)) await f.registry.load(cid);
  assert.equal(f.registry.list().length, 3);
  assert.notEqual(f.registry.getService(cids[0]), f.registry.getService(cids[1]));
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 60);
  await assert.rejects(f.registry.load(cids[3]), /memory|capacity/i);
  assert.equal(f.registry.list().length, 3); assert.equal(f.uses.size, 3);
  assert(f.registry.list().every((entry) => entry.status === 'ready'));
  await f.registry.unload(cids[1]);
  assert.equal(f.registry.getService(cids[1]), null);
  assert.equal(f.registry.getService(cids[0]).getStatus().status, 'ready');
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 40);
  await f.registry.load(cids[3]);
});

test('duplicate load joins one session while a joining caller may cancel independently', async (t) => {
  const hold = deferred(); const f = fixture(t, { beforeLoad: () => hold.promise });
  const first = f.registry.load(cids[0]); await tick();
  const abort = new AbortController();
  const second = f.registry.load(cids[0], { signal: abort.signal });
  abort.abort(); await assert.rejects(second, { name: 'AbortError' });
  assert.equal(f.services.length, 1); hold.resolve(); await first;
  assert.equal(f.registry.getService(cids[0]).getStatus().status, 'ready');
  await assert.rejects(f.registry.load(cids[0], { runtimeOptions: { ggufGpuLayers: 5 } }), /changing/);
});

test('failed acknowledged cleanup retains the resident, use lease and capacity until retry', async (t) => {
  let failing = true;
  const f = fixture(t, { failDispose: () => failing });
  await f.registry.load(cids[0]);
  await assert.rejects(f.registry.unload(cids[0]), /termination/);
  assert.equal(f.registry.list()[0].status, 'cleanup-failed');
  assert.equal(f.uses.size, 1); assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 20);
  await assert.rejects(f.registry.load(cids[0]), /cleanup/);
  failing = false; await f.registry.unload(cids[0]);
  assert.equal(f.uses.size, 0); assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 0);
});

test('dispose racing factory creation waits for the created service and releases only after its cleanup', async (t) => {
  const hold = deferred(); const f = fixture(t, { beforeFactory: () => hold.promise });
  const loading = f.registry.load(cids[0]); await tick();
  const rejected = assert.rejects(loading, { name: 'AbortError' });
  const disposing = f.registry.dispose();
  assert.equal(f.uses.size, 1); hold.resolve();
  await rejected; await disposing;
  assert.equal(f.services.length, 1); assert.equal(f.services[0].closed, true);
  assert.equal(f.uses.size, 0); assert.equal(f.registry.list().length, 0);
  await assert.rejects(f.registry.load(cids[1]), /closed/);
});

test('load cancellation cleans only its own service and keeps an existing model admitted', async (t) => {
  const hold = deferred();
  const f = fixture(t, { beforeLoad: (cid) => cid === cids[1] ? hold.promise : undefined });
  await f.registry.load(cids[0]);
  const abort = new AbortController();
  const loading = f.registry.load(cids[1], { signal: abort.signal }); await tick();
  const rejected = assert.rejects(loading, { name: 'AbortError' }); abort.abort(); hold.resolve(); await rejected;
  assert.equal(f.registry.list().length, 1); assert.equal(f.uses.size, 1);
  assert.equal(f.registry.getService(cids[0]).getStatus().status, 'ready');
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 20);
});
