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
function fixture(t, { beforeLoad, beforeFactory, beforeDispose, recovery, now, random, failDispose = () => false } = {}) {
  const broker = new ResourceLeaseBroker({ capacities: { cpu: { units: 8, memoryBytes: 60 }, gpu: { units: 8, memoryBytes: 60 } } });
  const admission = new ResidentModelAdmission({ broker });
  const uses = new Set(), services = [], useEvents = [], factories = [];
  const store = {
    async acquireUse(cid) { uses.add(cid); useEvents.push(['acquire', cid]); return () => { useEvents.push(['release', cid]); uses.delete(cid); }; },
    async getManifest(cid) { return { name: cid, model: { runtime: 'transformers.js', task: 'text-generation' } }; },
  };
  const registry = new ResidentModelRegistry({ artifactStore: store, recovery, now, random, async createService({ manifestCid, runtimeOptions }) {
    factories.push({ manifestCid, runtimeOptions: structuredClone(runtimeOptions) });
    await beforeFactory?.();
    let status = 'idle', lease, loss;
    const service = {
      closed: false,
      getStatus: () => ({ status, loss, manifestCid: status === 'idle' ? null : manifestCid, sessionId: `session-${services.indexOf(service)}` }),
      lose({ recoverable = true } = {}) { status = 'lost'; loss = { recoverable, manifestCid, sessionId: `session-${services.indexOf(service)}` }; },
      async loadModel({ signal }) {
        status = 'loading'; await beforeLoad?.(manifestCid, signal); signal.throwIfAborted();
        lease = await admission.acquire({ sessionId: manifestCid, manifestCid, estimatedCpuBytes: 20, estimatedGpuBytes: 20 });
        status = 'ready'; return { workerId: `worker-${services.indexOf(service)}` };
      },
      async dispose() {
        await beforeDispose?.(manifestCid);
        if (failDispose(manifestCid)) { status = 'cleanup-failed'; throw new Error('Worker termination was not acknowledged'); }
        await lease?.release(); status = 'idle'; this.closed = true;
      },
    };
    services.push(service); return service;
  } });
  t.after(() => registry.dispose());
  return { registry, broker, uses, services, factories, useEvents };
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

const recovery = { pollMs: 100_000, retryMs: 10, stableMs: 1000, maximumAttempts: 3 };

test('recovery keeps the exact package/options and file lease while awaiting old worker acknowledgement', async (t) => {
  const hold = deferred(); let delayCleanup = true;
  const f = fixture(t, { recovery, beforeDispose: () => delayCleanup ? hold.promise : undefined });
  const options = { ggufGpuLayers: 17 };
  await f.registry.load(cids[0], { runtimeOptions: options });
  const original = f.services[0], events = []; f.registry.subscribe(event => events.push(event));
  original.lose();
  const first = f.registry.checkRecovery(), second = f.registry.checkRecovery();
  await tick();
  assert.equal(f.services.length, 1, 'a second worker cannot be created before old disposal acknowledges');
  assert.equal(f.registry.list()[0].status, 'recovering');
  assert.equal(f.uses.size, 1); assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 20);
  delayCleanup = false; hold.resolve(); await first; await second;
  assert.equal(f.services.length, 2); assert.equal(f.services[0].closed, true);
  assert.equal(f.registry.list()[0].status, 'ready');
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 20);
  assert.deepEqual(f.factories, [0, 1].map(() => ({ manifestCid: cids[0], runtimeOptions: options })));
  assert.deepEqual(f.useEvents, [['acquire', cids[0]]], 'artifact-use ownership must have no gap');
  const recovered = events.find(event => event.type === 'recovered');
  assert.equal(recovered.previousService, original); assert.equal(recovered.service, f.services[1]);
  assert.equal(recovered.previousSessionId, 'session-0'); assert.equal(recovered.sessionId, 'session-1');
});

test('explicit unload racing a replacement load cancels recovery and never resurrects the model', async (t) => {
  const hold = deferred(); let loads = 0;
  const f = fixture(t, { recovery, beforeLoad: async () => { if (++loads === 2) await hold.promise; } });
  await f.registry.load(cids[0]); f.services[0].lose();
  const repair = f.registry.checkRecovery(); await tick();
  const unloading = f.registry.unload(cids[0]); hold.resolve();
  await repair; await unloading; await f.registry.checkRecovery();
  assert.equal(f.registry.list().length, 0); assert.equal(f.uses.size, 0);
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 0);
  assert.equal(f.services.length, 2); assert(f.services.every(service => service.closed));
});

test('failed cleanup remains quarantined and recovery can retry only after acknowledgement', async (t) => {
  let at = 0, fail = true;
  const f = fixture(t, { recovery, now: () => at, failDispose: () => fail });
  await f.registry.load(cids[0]); f.services[0].lose();
  const original = f.services[0], events = []; f.registry.subscribe(event => events.push(event));
  await f.registry.checkRecovery();
  assert.equal(f.services.length, 1); assert.equal(f.registry.list()[0].status, 'cleanup-failed');
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 20); assert.equal(f.uses.size, 1);
  await f.registry.checkRecovery(); assert.equal(f.registry.list()[0].recovery.attempts, 1, 'backoff must prevent a hot loop');
  fail = false; at = 10; await f.registry.checkRecovery();
  assert.equal(f.services.length, 2); assert.equal(f.registry.list()[0].status, 'ready');
  assert.equal(events.find(event => event.type === 'recovered').previousService, original);
});

test('replacement failures use bounded bursts and randomized cooldown, then retry retained intent', async (t) => {
  let at = 0, loads = 0, fail = true;
  const f = fixture(t, { recovery, now: () => at, random: () => 0.5,
    beforeLoad: () => { if (++loads > 1 && fail) throw new Error('GPU unavailable'); } });
  await f.registry.load(cids[0]); f.services[0].lose();
  await f.registry.checkRecovery();
  await f.registry.checkRecovery(); assert.equal(loads, 2);
  at = 10; await f.registry.checkRecovery(); assert.equal(loads, 3);
  at = 30; await f.registry.checkRecovery(); assert.equal(loads, 4);
  at = 10000; await f.registry.checkRecovery(); assert.equal(loads, 4);
  assert.equal(f.registry.list()[0].recovery.status, 'cooldown'); assert.equal(f.uses.size, 1);
  assert.equal(f.registry.list()[0].recovery.nextAttemptAt, 120030, 'cooldown is randomized within 60–180 seconds');
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 0);
  at = 120029; await f.registry.checkRecovery(); assert.equal(loads, 4);
  fail = false; at = 120030; await f.registry.checkRecovery(); assert.equal(loads, 5);
  assert.equal(f.registry.list()[0].status, 'ready'); assert.equal(f.registry.list()[0].recovery.attempts, 1);
  await f.registry.unload(cids[0]); assert.equal(f.uses.size, 0);
});

test('unload during cooldown cancels future recovery bursts and releases retained artifacts', async (t) => {
  let at = 0, loads = 0;
  const f = fixture(t, { recovery: { ...recovery, maximumAttempts: 1 }, now: () => at, random: () => 1,
    beforeLoad: () => { if (++loads > 1) throw new Error('GPU memory occupied'); } });
  await f.registry.load(cids[0]); f.services[0].lose(); await f.registry.checkRecovery();
  assert.equal(f.registry.list()[0].recovery.nextAttemptAt, 180000);
  await f.registry.unload(cids[0]); at = 300000; await f.registry.checkRecovery();
  assert.equal(loads, 2); assert.equal(f.registry.list().length, 0); assert.equal(f.uses.size, 0);
});

test('rapid successful reloads that immediately lose residency also cool down without abandoning intent', async (t) => {
  let at = 0;
  const f = fixture(t, { recovery: { ...recovery, maximumAttempts: 1 }, now: () => at, random: () => 0 });
  await f.registry.load(cids[0]); f.services[0].lose(); await f.registry.checkRecovery();
  f.services[1].lose(); await f.registry.checkRecovery();
  assert.equal(f.registry.list()[0].recovery.status, 'cooldown'); assert.equal(f.services.length, 2);
  at = 60000; await f.registry.checkRecovery();
  assert.equal(f.services.length, 3); assert.equal(f.registry.list()[0].status, 'ready');
});

test('a later recovery burst still cannot load over quarantined resources without cleanup acknowledgement', async (t) => {
  let at = 0, fail = true;
  const f = fixture(t, { recovery: { ...recovery, maximumAttempts: 1 }, now: () => at,
    random: () => 0, failDispose: () => fail });
  await f.registry.load(cids[0]); f.services[0].lose(); await f.registry.checkRecovery();
  assert.equal(f.registry.list()[0].recovery.status, 'cooldown');
  at = 60000; await f.registry.checkRecovery();
  assert.equal(f.services.length, 1); assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 20);
  assert.equal(f.registry.list()[0].recovery.nextAttemptAt, 120000);
  fail = false; at = 120000; await f.registry.checkRecovery();
  assert.equal(f.services.length, 2); assert.equal(f.registry.list()[0].status, 'ready');
  assert.equal(f.broker.reportPressure().pools.gpu.activeMemoryBytes, 20);
});

test('a service explicitly reporting nonrecoverable loss and direct disposal do not authorize recovery', async (t) => {
  const f = fixture(t, { recovery });
  await f.registry.load(cids[0]); f.services[0].lose({ recoverable: false });
  await f.registry.checkRecovery(); assert.equal(f.services.length, 1);
  await f.registry.unload(cids[0]); await f.registry.load(cids[0]);
  await f.services[1].dispose(); await f.registry.checkRecovery(); assert.equal(f.services.length, 2);
});

test('an explicitly nonrecoverable loss does not reuse old recovery state', async (t) => {
  const f = fixture(t, { recovery });
  await f.registry.load(cids[0]); f.services[0].lose(); await f.registry.checkRecovery();
  f.services[1].lose({ recoverable: false }); await f.registry.checkRecovery();
  assert.equal(f.services.length, 2);
});

test('cancelling a recovery waiter does not cancel the owner and disposal aborts a late factory', async (t) => {
  const hold = deferred(); let factories = 0;
  const f = fixture(t, { recovery, beforeFactory: async () => { if (++factories === 2) await hold.promise; } });
  await f.registry.load(cids[0]); f.services[0].lose(); const repair = f.registry.checkRecovery(); await tick();
  const caller = new AbortController();
  const joined = f.registry.load(cids[0], { signal: caller.signal });
  caller.abort(); await assert.rejects(joined, { name: 'AbortError' });
  const disposing = f.registry.dispose(); hold.resolve(); await repair; await disposing;
  assert.equal(f.registry.list().length, 0); assert.equal(f.uses.size, 0);
  assert(f.services.every(service => service.closed));
});
