import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import { StateManager, STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE } from '../../src/peercompute/stateManager/StateManager.js';
import { PeerComputeProvider, isEmptyYjsUpdate } from '../../src/peercompute/stateManager/PeerComputeProvider.js';
import { ReservationLedger } from '../../src/peercompute/stateManager/ReservationLedger.js';
import { SpatialTileLeaseBroker } from '../../src/peercompute/stateManager/SpatialTileLeaseBroker.js';
import { LocalArtifactCache } from '../../src/peercompute/stateManager/LocalArtifactCache.js';
import { GPUHubManager, ResidentStageWorkerBackend } from '../../src/peercompute/gpu/GPUHubManager.js';
import { NodeKernel } from '../../src/peercompute/nodeKernel/NodeKernel.js';

function createMesh(peerIds) {
  const peers = new Map();
  const broadcasts = [];
  const directs = [];
  for (const peerId of peerIds) {
    const handlers = [];
    const nm = {
      peerId,
      getLibp2pNode: () => ({ peerId }),
      addMessageHandler(fn) {
        handlers.push(fn);
        return () => {
          const idx = handlers.indexOf(fn);
          if (idx !== -1) handlers.splice(idx, 1);
        };
      },
      removeMessageHandler(fn) {
        const idx = handlers.indexOf(fn);
        if (idx !== -1) handlers.splice(idx, 1);
      },
      getHandlerCount: () => handlers.length,
      async broadcast(message, options = {}) {
        broadcasts.push({ from: peerId, type: message?.type, topic: options.topic, data: message?.data });
        for (const [otherId, other] of peers.entries()) {
          if (otherId === peerId) continue;
          for (const h of [...other.handlers]) {
            await h(peerId, message);
          }
        }
      },
      async sendToPeer(targetId, message) {
        directs.push({ from: peerId, to: targetId, type: message?.type, data: message?.data });
        const target = peers.get(targetId);
        if (!target) return;
        for (const h of [...target.handlers]) {
          await h(peerId, message);
        }
      }
    };
    peers.set(peerId, { nm, handlers });
  }
  return { peers, broadcasts, directs };
}

test('Slice 1: PeerComputeProvider suppresses dual state-set amplification, empty 2-byte responses, and unsubscribes on destroy', async (t) => {
  const mesh = createMesh(['peer-a', 'peer-b']);
  const smA = new StateManager(mesh.peers.get('peer-a').nm, {
    enablePersistence: false,
    disableNetworkProvider: false,
    disableBroadcast: false,
    topic: 'sync-test'
  });
  const smB = new StateManager(mesh.peers.get('peer-b').nm, {
    enablePersistence: false,
    disableNetworkProvider: false,
    disableBroadcast: false,
    topic: 'sync-test'
  });
  t.after(async () => {
    await smA.destroy();
    await smB.destroy();
  });

  await smA.initialize();
  await smB.initialize();
  await new Promise((r) => setTimeout(r, 10));

  // Initial sync between two empty docs must NOT send empty 2-byte [0, 0] sync responses.
  assert.equal(
    mesh.directs.filter((d) => d.type === 'yjs-sync-response').length,
    0,
    'up-to-date peers must skip empty 2-byte Yjs sync responses'
  );
  assert.equal(isEmptyYjsUpdate(new Uint8Array([0, 0])), true);

  mesh.broadcasts.length = 0;
  smA.writeScoped('players', 'p1', { x: 10 });
  await new Promise((r) => setTimeout(r, 10));

  // Exactly one compact base64 yjs-update broadcast; zero duplicate state-set broadcasts; zero echo loop from peer-b!
  assert.equal(mesh.broadcasts.filter((b) => b.type === 'state-set').length, 0);
  const yjsUpdates = mesh.broadcasts.filter((b) => b.type === 'yjs-update');
  assert.equal(yjsUpdates.length, 1);
  assert.equal(yjsUpdates[0].from, 'peer-a');
  assert.equal(typeof yjsUpdates[0].data, 'string', 'yjs-update payload should be compact base64');
  assert.deepEqual(smB.readScoped('players', 'p1'), { x: 10 });

  // Applying a legacy remote state-set must NOT cause PeerComputeProvider to re-broadcast.
  mesh.broadcasts.length = 0;
  smB.applyStateSet('legacyKey', 42, 'players');
  assert.equal(mesh.broadcasts.length, 0);
  assert.equal(smB.readScoped('players', 'legacyKey'), 42);

  // Destroy detaches handler cleanly from NetworkManager.
  assert.equal(mesh.peers.get('peer-a').nm.getHandlerCount(), 1);
  await smA.destroy();
  assert.equal(mesh.peers.get('peer-a').nm.getHandlerCount(), 0);
});

test('Slice 1: StateManager degrades cleanly when IndexedDB is unavailable and bounds invalidation records', async (t) => {
  const sm = new StateManager(null, {
    enablePersistence: true,
    disableNetworkProvider: true,
    maxTaskGraphInvalidationRecords: 3
  });
  t.after(() => sm.destroy());

  // Concurrent initialize() calls coalesce safely without crashing in Node (no IndexedDB).
  await Promise.all([sm.initialize(), sm.initialize()]);
  assert.equal(sm.isInitialized, true);
  assert.equal(sm.persistenceFailed, true);
  assert.equal(sm.indexeddbProvider, null);

  for (let i = 0; i < 6; i += 1) {
    sm.invalidateTaskGraphCacheArtifact(`cache-${i}`, {
      invalidationId: `inv-${i}`,
      invalidatedAt: 1000 + i
    });
  }
  const remaining = sm.listNamespaceKeys(STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE).sort();
  assert.deepEqual(remaining, ['inv-3', 'inv-4', 'inv-5']);

  // Direct ledger/broker/cache destroy unregisters from StateManager and forwards onDestroy.
  let cacheDestroyed = false;
  let ledgerDestroyed = false;
  let brokerDestroyed = false;
  const cache = sm.createLocalArtifactCache({
    name: 'c1',
    persistent: false,
    onDestroy: () => { cacheDestroyed = true; }
  });
  const ledger = sm.createReservationLedger({
    name: 'l1',
    onDestroy: () => { ledgerDestroyed = true; }
  });
  const broker = sm.createSpatialTileLeaseBroker({
    name: 'b1',
    onDestroy: () => { brokerDestroyed = true; }
  });
  await cache.destroy();
  ledger.destroy();
  broker.destroy();
  assert.equal(cacheDestroyed, true);
  assert.equal(ledgerDestroyed, true);
  assert.equal(brokerDestroyed, true);
  assert.equal(sm.getLocalArtifactCache('c1'), null);
  assert.equal(sm.getReservationLedger('l1'), null);
  assert.equal(sm.getSpatialTileLeaseBroker('b1'), null);
});

test('Slice 1: ReservationLedger does not consume capacity on stale-epoch probe of missing key', () => {
  const ledger = new ReservationLedger({ maxKeys: 2 });
  const stale = ledger.reserve({ key: 'missing-1', consumerId: 'c1', expectedEpoch: 5 });
  assert.equal(stale.ok, false);
  assert.equal(stale.reason, 'stale-epoch');
  assert.equal(ledger.snapshot().keyCount, 0);

  assert.equal(ledger.reserve({ key: 'real-1', consumerId: 'c1', expectedEpoch: 0 }).ok, true);
  assert.equal(ledger.reserve({ key: 'real-2', consumerId: 'c2', expectedEpoch: 0 }).ok, true);
  assert.equal(ledger.snapshot().keyCount, 2);
});

test('Slice 1: SpatialTileLeaseBroker enforces boundary budget, value token equality, anti-reentrancy, and external ledger cleanup', () => {
  let clock = 1000;
  const sharedLedger = new ReservationLedger({ name: 'shared', maxKeys: 16 });
  const broker = new SpatialTileLeaseBroker({
    name: 'tiles',
    ledger: sharedLedger,
    defaultTtlMs: 500,
    maxPayloadBytes: 32,
    maxTotalBoundaryBytes: 48,
    now: () => clock
  });

  const l1 = broker.acquireTile({ tileId: 't1', peerId: 'p1' });
  const l2 = broker.acquireTile({ tileId: 't2', peerId: 'p1' });
  assert.ok(l1.ok && l2.ok);

  // Structured-cloned token matches by value.
  const clonedToken = structuredClone(l1.lease.token);
  const renewed = broker.renewTile(clonedToken, { ttlMs: 500 });
  assert.equal(renewed.ok, true);

  // Total boundary budget enforced (32 + 24 > 48).
  assert.equal(broker.admitBoundarySummary({
    tileId: 't1', peerId: 'p1', epoch: 0, token: clonedToken, payload: new Uint8Array(32)
  }).ok, true);
  const overBudget = broker.admitBoundarySummary({
    tileId: 't2', peerId: 'p1', epoch: 0, payload: new Uint8Array(24)
  });
  assert.equal(overBudget.ok, false);
  assert.equal(overBudget.reason, 'boundary-budget-exceeded');

  // Releasing t1 clears its boundary bytes and frees budget for t2.
  assert.equal(broker.releaseTile(clonedToken).ok, true);
  assert.equal(broker.getStats().totalBoundaryBytes, 0);
  assert.equal(broker.getBoundarySummary('t1'), null);
  assert.equal(broker.admitBoundarySummary({
    tileId: 't2', peerId: 'p1', epoch: 0, payload: new Uint8Array(24)
  }).ok, true);

  // Reentrant listener during expireLeases sees coherent state without corrupting iteration.
  let reacquiredInListener = false;
  broker.subscribe((evt) => {
    if (evt.type === 'tile-expired' && evt.tileId === 't2') {
      const res = broker.acquireTile({ tileId: 't2', peerId: 'p2', expectedEpoch: evt.nextEpoch });
      reacquiredInListener = res.ok;
    }
  });
  clock = 2000;
  broker.expireLeases();
  assert.equal(reacquiredInListener, true);

  // Destroying a broker with an injected ledger retires its active leases cleanly.
  assert.equal(broker.destroy(), true);
  assert.equal(sharedLedger.destroyed, false);
  assert.equal(sharedLedger.fence('t2').state, 'free');
  assert.equal(sharedLedger.fence('t2').epoch, 2);
});

test('Slice 1: LocalArtifactCache validates memory hits, isolates coalesced buffers, and prevents stale resurrection on clear/delete', async (t) => {
  let now = 0;
  const cache = new LocalArtifactCache({
    name: 'slice1-cache',
    persistent: false,
    clock: () => now
  });
  t.after(() => cache.destroy());

  // Coalesced callers get independent byte buffers.
  let releaseLoader;
  const gate = new Promise((r) => { releaseLoader = r; });
  const p1 = cache.getOrLoad({
    key: 'k1',
    sourceId: 's',
    mediaType: 'application/octet-stream',
    freshUntil: 100,
    staleUntil: 200,
    loader: async () => { await gate; return new Uint8Array([1, 2, 3]); }
  });
  await new Promise((r) => setImmediate(r));
  const p2 = cache.getOrLoad({
    key: 'k1',
    sourceId: 's',
    mediaType: 'application/octet-stream',
    freshUntil: 100,
    staleUntil: 200,
    loader: async () => new Uint8Array([9, 9, 9])
  });
  releaseLoader();
  const [r1, r2] = await Promise.all([p1, p2]);
  r1.bytes[0] = 99;
  assert.equal(r2.bytes[0], 1, 'coalesced callers must not share a mutable Uint8Array');

  // Caller validator runs on in-memory hits too.
  const rejected = await cache.read('k1', { validate: () => false });
  assert.equal(rejected, null);

  // Delete during stale refresh must not resurrect the deleted stale entry on refresh error.
  await cache.getOrLoad({
    key: 'k2',
    sourceId: 's',
    mediaType: 'application/octet-stream',
    freshUntil: 10,
    staleUntil: 100,
    loader: async () => new Uint8Array([7, 7])
  });
  now = 50;
  const staleRefresh = cache.getOrLoad({
    key: 'k2',
    sourceId: 's',
    mediaType: 'application/octet-stream',
    freshUntil: 60,
    staleUntil: 120,
    loader: async ({ signal }) => {
      await new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    }
  });
  await new Promise((r) => setImmediate(r));
  await cache.delete('k2');
  await assert.rejects(staleRefresh, /aborted/);
});

test('Slice 1: GPUHubManager.destroy releases owned buffers, worker backends, and owned device; ResidentStageWorkerBackend handles worker error', async () => {
  let deviceDestroyed = false;
  let bufferDestroyedCount = 0;
  let workerTerminated = false;

  const mockDevice = {
    createBuffer: () => ({ destroy: () => { bufferDestroyedCount += 1; } }),
    destroy: () => { deviceDestroyed = true; }
  };

  const hub = new GPUHubManager();
  hub.setDevice(mockDevice, { owned: true });
  hub.createHotBuffer('pos', 64, 1, 'pos');
  hub.createHotBuffer('pos', 128, 1, 'pos-v2');
  assert.equal(bufferDestroyedCount, 1, 'overwriting an owned hot buffer destroys the previous buffer');

  let errorListener = null;
  const backend = new ResidentStageWorkerBackend({
    workerModuleUrl: '/mock-worker.js',
    timeoutMs: 5000,
    workerFactory: () => ({
      addEventListener(type, fn) {
        if (type === 'error') errorListener = fn;
      },
      removeEventListener() {},
      postMessage() {
        queueMicrotask(() => errorListener?.({ message: 'worker boom' }));
      },
      terminate() { workerTerminated = true; }
    })
  });
  await assert.rejects(backend.runStage({ stage: { id: 's1' } }), /worker boom/);
  assert.equal(workerTerminated, true);

  let backendDisposed = false;
  hub.registerResidentStageExecutor({
    stageId: 's2',
    workerBackend: { runStage: async () => ({}), dispose: () => { backendDisposed = true; } }
  });
  hub.destroy();
  assert.equal(bufferDestroyedCount, 2);
  assert.equal(backendDisposed, true);
  assert.equal(deviceDestroyed, true);
  assert.equal(hub.device, null);
});

test('Slice 1: NodeKernel keeps local lifecycle keys out of CRDT, rejects pending RPCs on stop, ignores spoofed compute results, and checks real WebGPU availability', async (t) => {
  const node = new NodeKernel({
    enableWebGPU: true,
    enableWorkers: false,
    enablePersistence: false,
    disableStateNetworkProvider: true,
    disableStateBroadcast: true,
    enableNetVizSessionBroadcast: false
  });
  t.after(() => node.stop().catch(() => {}));

  await Promise.all([node.initialize(), node.initialize()]);

  // Shared room CRDT root must NOT be polluted by per-node metadata.
  assert.equal(node.stateManager.getYMap().size, 0);
  assert.equal(node.stateManager.read('nodeId'), undefined);
  assert.equal(node.stateManager.read('status'), undefined);

  // Without actual WebGPU support in Node, enableWebGPU config alone must not advertise gpuAvailable.
  const caps = node._buildPresenceCapabilities();
  assert.equal(caps.compute.gpuAvailable, false);
  assert.equal(caps.compute.webgpuAvailable, false);

  // Peer connect/disconnect updates localConnectedPeers without polluting shared CRDT.
  node._handlePeerConnect('peer-x');
  assert.equal(node.stateManager.read('connectedPeers'), undefined);
  assert.equal(node.localConnectedPeers.has('peer-x'), true);
  node._handlePeerDisconnect('peer-x');
  assert.equal(node.localConnectedPeers.has('peer-x'), false);

  // Spoofed compute result from unexpected peer must NOT cancel in-flight request; duplicate requestId rejects; stop() rejects pending.
  node.isStarted = true;
  node.networkManager = {
    sendToPeer: async () => {},
    disconnect: async () => {},
    getNetworkStats: () => ({}),
    getConnectedPeers: () => []
  };
  const pendingPromise = node.submitRemoteComputeTask(
    'real-peer',
    { runtime: 'js', module: '/tasks/add.js', data: { a: 1 } },
    { requestId: 'req-1', timeoutMs: 60000 }
  );

  await assert.rejects(
    node.submitRemoteComputeTask(
      'real-peer',
      { runtime: 'js', module: '/tasks/add.js', data: { a: 2 } },
      { requestId: 'req-1', timeoutMs: 60000 }
    ),
    (err) => err.code === 'ERR_DUPLICATE_REQUEST_ID'
  );

  // Spoofed reply from wrong peer is ignored; pending request stays alive.
  node._handleComputeResult('spoof-peer', { requestId: 'req-1', ok: true, result: { value: 999 } });
  assert.equal(node.pendingRemoteComputeRequests.has('req-1'), true);

  // Stop rejects pending RPC cleanly without waiting for 60s timeout.
  await node.stop();
  await assert.rejects(pendingPromise, (err) => err.code === 'ERR_NODE_STOPPED');
  assert.equal(node.pendingRemoteComputeRequests.size, 0);
});
