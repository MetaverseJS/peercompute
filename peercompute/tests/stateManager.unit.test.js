import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import {
  STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_SCHEMA,
  STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_SCHEMA,
  StateManager
} from '../src/peercompute/stateManager/StateManager.js';

const makeStateManager = async () => {
  const sm = new StateManager(null, { enablePersistence: false });
  await sm.initialize();
  return sm;
};

function exchangeYjsUpdates(left, right) {
  const leftUpdate = Y.encodeStateAsUpdate(left.getYDoc());
  const rightUpdate = Y.encodeStateAsUpdate(right.getYDoc());
  Y.applyUpdate(left.getYDoc(), rightUpdate);
  Y.applyUpdate(right.getYDoc(), leftUpdate);
}

function syncYjsUpdate(source, target) {
  const stateVector = Y.encodeStateVector(target.getYDoc());
  const update = Y.encodeStateAsUpdate(source.getYDoc(), stateVector);
  Y.applyUpdate(target.getYDoc(), update);
}

function createInMemoryProviderMesh(peerIds = []) {
  const managers = new Map();
  const deliveries = [];
  for (const peerId of peerIds) {
    const manager = {
      peerId,
      handlers: [],
      getLibp2pNode: () => ({ peerId }),
      addMessageHandler(handler) {
        this.handlers.push(handler);
      },
      async broadcast(message, options = {}) {
        deliveries.push({
          mode: 'broadcast',
          from: peerId,
          type: message?.type || null,
          topic: options.topic || null
        });
        for (const [targetPeerId, target] of managers.entries()) {
          if (targetPeerId === peerId) continue;
          for (const handler of target.handlers) {
            await handler(peerId, message);
          }
        }
      },
      async sendToPeer(targetPeerId, message) {
        deliveries.push({
          mode: 'direct',
          from: peerId,
          to: targetPeerId,
          type: message?.type || null
        });
        const target = managers.get(targetPeerId);
        if (!target) throw new Error(`Unknown in-memory peer ${targetPeerId}`);
        for (const handler of target.handlers) {
          await handler(peerId, message);
        }
      }
    };
    managers.set(peerId, manager);
  }
  return { managers, deliveries };
}

async function waitForWarmDelta(stateManager, { scope, taskId, timeoutMs = 500 } = {}) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const entry = stateManager.getWarmDeltas(scope)[taskId];
    if (entry) return entry;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  return null;
}

test('listNamespaceKeys enumerates scoped entries', async () => {
  const sm = await makeStateManager();
  sm.writeScoped('ns', 'a', 1);
  sm.writeScoped('ns', 'b', 2);
  const keys = sm.listNamespaceKeys('ns').sort();
  assert.deepEqual(keys, ['a', 'b']);
});

test('clearNamespace removes entries and broadcasts delete intent', async () => {
  const sm = await makeStateManager();
  sm.writeScoped('ns', 'a', 1);
  sm.writeScoped('ns', 'b', 2);
  sm.clearNamespace('ns');
  assert.deepEqual(sm.listNamespaceKeys('ns'), []);
  assert.equal(sm.readScoped('ns', 'a'), undefined);
});

test('observeNamespace follows the winning concurrent namespace map', async (t) => {
  const left = await makeStateManager();
  const right = await makeStateManager();
  const namespace = 'concurrent-observer-test';
  const leftEvents = [];
  const rightEvents = [];
  const unsubscribeLeft = left.observeNamespace(namespace, (value, key) => {
    leftEvents.push({ key, value });
  });
  const unsubscribeRight = right.observeNamespace(namespace, (value, key) => {
    rightEvents.push({ key, value });
  });
  t.after(async () => {
    unsubscribeLeft();
    unsubscribeRight();
    await left.destroy();
    await right.destroy();
  });

  const leftInitialMap = left.getYMap().get(namespace);
  const rightInitialMap = right.getYMap().get(namespace);
  left.writeScoped(namespace, 'left-only', 'left-value');
  right.writeScoped(namespace, 'right-only', 'right-value');
  leftEvents.length = 0;
  rightEvents.length = 0;

  exchangeYjsUpdates(left, right);

  const leftLost = left.getYMap().get(namespace) !== leftInitialMap;
  const rightLost = right.getYMap().get(namespace) !== rightInitialMap;
  assert.notEqual(leftLost, rightLost, 'exactly one locally-created namespace map should lose');

  const loser = leftLost ? left : right;
  const winner = leftLost ? right : left;
  const losingEvents = leftLost ? leftEvents : rightEvents;
  const losingKey = leftLost ? 'left-only' : 'right-only';
  const winningKey = leftLost ? 'right-only' : 'left-only';
  const winningValue = leftLost ? 'right-value' : 'left-value';
  const unsubscribeLoser = leftLost ? unsubscribeLeft : unsubscribeRight;

  assert.deepEqual(losingEvents, [
    { key: losingKey, value: undefined },
    { key: winningKey, value: winningValue }
  ], 'replacement notification should remove stale keys and replay the winning snapshot');

  losingEvents.length = 0;
  winner.writeScoped(namespace, 'after-merge', 'visible-to-loser');
  syncYjsUpdate(winner, loser);
  assert.deepEqual(losingEvents, [
    { key: 'after-merge', value: 'visible-to-loser' }
  ], 'the observer formerly attached to the losing map should follow later writes');

  unsubscribeLoser();
  losingEvents.length = 0;
  winner.writeScoped(namespace, 'after-unsubscribe', 'must-not-notify');
  syncYjsUpdate(winner, loser);
  assert.deepEqual(losingEvents, [], 'unsubscribe should detach the rebound child observer');

  const finalNamespaceMap = new Y.Map();
  winner.getYMap().set(namespace, finalNamespaceMap);
  finalNamespaceMap.set('replacement-after-unsubscribe', 'must-not-replay');
  syncYjsUpdate(winner, loser);
  assert.deepEqual(losingEvents, [], 'unsubscribe should detach the root replacement observer');
});

test('observeNamespace replays a recreated namespace before following callback writes', async (t) => {
  const source = await makeStateManager();
  const replica = await makeStateManager();
  const namespace = 'recreated-observer-test';
  source.writeScoped(namespace, 'stale', 'old-value');
  syncYjsUpdate(source, replica);

  const events = [];
  const unsubscribe = replica.observeNamespace(namespace, (value, key) => {
    events.push({ key, value });
    if (key === 'recreated' && !replica.hasScoped(namespace, 'derived')) {
      replica.writeScoped(namespace, 'derived', `derived-from-${value}`);
    }
  });
  t.after(async () => {
    unsubscribe();
    await source.destroy();
    await replica.destroy();
  });

  source.delete(namespace);
  syncYjsUpdate(source, replica);
  assert.deepEqual(events, [
    { key: 'stale', value: undefined }
  ], 'deleting the root namespace should remove keys from the observed snapshot');

  events.length = 0;
  const recreatedMap = new Y.Map();
  source.getYDoc().transact(() => {
    source.getYMap().set(namespace, recreatedMap);
    recreatedMap.set('recreated', 'new-value');
  });
  syncYjsUpdate(source, replica);

  assert.deepEqual(events, [
    { key: 'recreated', value: 'new-value' },
    { key: 'derived', value: 'derived-from-new-value' }
  ]);
  assert.equal(replica.readScoped(namespace, 'derived'), 'derived-from-new-value');
});

test('StateManager admits and invalidates task graph cache artifacts as authority records', async () => {
  const sm = await makeStateManager();
  const artifact = {
    schema: 'peercompute.compute.task-graph-cache-artifact.v0',
    artifactId: 'scope:fnv1a32-12345678:artifact',
    cacheKey: 'scope:fnv1a32-12345678',
    cacheScope: 'scope',
    cacheKeySource: 'content-addressed-inputs',
    inputHash: 'fnv1a32-12345678',
    resultHash: 'fnv1a32-abcdef00',
    status: 'recorded-not-admitted',
    admitted: false,
    invalidationRefs: ['law:h2o:v1']
  };

  const admission = sm.admitTaskGraphCacheArtifact(artifact, {
    validatorId: 'cpu-oracle',
    reason: 'unit-test-admission'
  });
  assert.equal(admission.schema, STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_SCHEMA);
  assert.equal(admission.cacheKey, artifact.cacheKey);
  assert.equal(admission.admitted, true);
  assert.equal(admission.status, 'admitted');
  assert.equal(admission.authority, 'state-manager');
  assert.equal(admission.validatorId, 'cpu-oracle');
  assert.deepEqual(admission.invalidationRefs, ['law:h2o:v1']);
  assert.equal(sm.getTaskGraphCacheArtifactAdmission(artifact.cacheKey).resultHash, artifact.resultHash);
  assert.equal(sm.listTaskGraphCacheArtifactAdmissions().length, 1);

  const invalidation = sm.invalidateTaskGraphCacheArtifact(artifact.cacheKey, {
    reason: 'law-closure-updated'
  });
  assert.equal(invalidation.schema, STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_SCHEMA);
  assert.equal(invalidation.cacheKey, artifact.cacheKey);
  assert.equal(invalidation.previousAdmissionStatus, 'admitted');
  const invalidated = sm.getTaskGraphCacheArtifactAdmission(artifact.cacheKey);
  assert.equal(invalidated.status, 'invalidated');
  assert.equal(invalidated.admitted, false);
  assert.equal(sm.listTaskGraphCacheArtifactAdmissions({ includeInvalidated: false }).length, 0);
});

test('PeerComputeProvider initial sync sends missed warm deltas to late peers', async (t) => {
  const mesh = createInMemoryProviderMesh(['source-peer', 'replica-peer']);
  const topic = 'peercompute-provider-initial-sync-test';
  const source = new StateManager(mesh.managers.get('source-peer'), {
    docName: `provider-source-${Date.now()}`,
    topic,
    enablePersistence: false,
    disableNetworkProvider: false,
    disableBroadcast: true,
    deltaNamespace: 'deltas'
  });
  await source.initialize({
    nodeId: 'source-peer',
    topology: 'provider-initial-sync',
    createdAt: Date.now()
  });
  source.commitDelta({
    taskId: 'preexisting-resident-delta',
    scope: 'ulg-sph-resident-pass-dag',
    version: 4,
    timestamp: 1234,
    payload: {
      schema: 'peercompute.ulg.mls-mpm-resident-steps-state-delta.v0',
      stateKey: 'state:preexisting',
      completedStepCount: 4,
      gpuFence: {
        schema: 'peercompute.compute.gpu-fence-report.v0',
        fenceSatisfied: true,
        stateKey: 'state:preexisting'
      }
    }
  });

  const replica = new StateManager(mesh.managers.get('replica-peer'), {
    docName: `provider-replica-${Date.now()}`,
    topic,
    enablePersistence: false,
    disableNetworkProvider: false,
    disableBroadcast: true,
    deltaNamespace: 'deltas'
  });
  await replica.initialize({
    nodeId: 'replica-peer',
    topology: 'provider-initial-sync',
    createdAt: Date.now()
  });
  t.after(async () => {
    await source.destroy?.();
    await replica.destroy?.();
  });

  const replicated = await waitForWarmDelta(replica, {
    scope: 'ulg-sph-resident-pass-dag',
    taskId: 'preexisting-resident-delta',
    timeoutMs: 1000
  });
  assert.ok(replicated);
  assert.equal(replicated.version, 4);
  assert.equal(replicated.payload.stateKey, 'state:preexisting');
  assert.equal(replicated.payload.gpuFence.fenceSatisfied, true);
  assert.ok(mesh.deliveries.some((entry) => entry.type === 'yjs-sync-request' && entry.from === 'replica-peer'));
  assert.ok(mesh.deliveries.some((entry) => entry.type === 'yjs-sync-response' && entry.from === 'source-peer' && entry.to === 'replica-peer'));
});

test('StateManager requestProviderSync publishes sync request after provider initialization', async (t) => {
  const mesh = createInMemoryProviderMesh(['sync-peer']);
  const sm = new StateManager(mesh.managers.get('sync-peer'), {
    docName: `provider-sync-request-${Date.now()}`,
    topic: 'peercompute-provider-request-sync-test',
    enablePersistence: false,
    disableNetworkProvider: false,
    disableBroadcast: true
  });
  await sm.initialize({
    nodeId: 'sync-peer',
    topology: 'provider-request-sync',
    createdAt: Date.now()
  });
  t.after(async () => {
    await sm.destroy?.();
  });

  await new Promise((resolve) => setTimeout(resolve, 0));
  mesh.deliveries.length = 0;
  const requested = await sm.requestProviderSync();

  assert.equal(requested, true);
  assert.equal(mesh.deliveries.length, 1);
  assert.equal(mesh.deliveries[0].mode, 'broadcast');
  assert.equal(mesh.deliveries[0].type, 'yjs-sync-request');
  assert.equal(mesh.deliveries[0].topic, 'peercompute-provider-request-sync-test');
});

test('StateManager requestProviderSync is a no-op without a network provider', async (t) => {
  const sm = new StateManager(null, {
    docName: `provider-sync-absent-${Date.now()}`,
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true
  });
  await sm.initialize({ nodeId: 'local-only' });
  t.after(async () => {
    await sm.destroy?.();
  });

  assert.equal(await sm.requestProviderSync(), false);
});
