import test from 'node:test';
import assert from 'node:assert/strict';
import { attachedScope, buildObservedNetwork, describeObservedPeer } from '../src/observedNetwork.js';

const now = 1_000_000;
const report = (peerId, fields = {}) => ({ peerId, application: 'cubechat', role: 'world',
  receivedAt: now, ts: now, peers: [], models: [], ...fields });
const model = { manifestCid: 'model-cid', name: 'Test vision', task: 'image-text-to-text', busy: false };

test('all demos deduplicates network identities and model hosts without conflating separate connections', () => {
  const records = [report('world'), report('model-a', { role: 'models', models: [model, model] }),
    report('model-b', { application: 'inference', role: 'models', models: [{ ...model, busy: true }] }),
    report('world', { receivedAt: now - 1, compute: { activeTasks: 999 } })];
  const view = buildObservedNetwork(records, { now });
  assert.equal(view.summary.reporting, 3);
  assert.equal(view.models.length, 1);
  assert.equal(view.models[0].hostCount, 2);
  assert.equal(view.models[0].busyCount, 1);
  assert.equal(view.models[0].busy, false);
  assert.equal(view.compute.activeTasks, 0);
  assert.deepEqual(view.applications, ['cubechat', 'inference']);
});

test('filters do not reintroduce excluded reporters as inferred endpoints', () => {
  const world = report('world', { peers: [{ peerId: 'model' }, { peerId: 'relay' }] });
  const models = report('model', { application: 'inference', role: 'models', models: [model] });
  const view = buildObservedNetwork([world, models], { now, application: 'cubechat', role: 'world' });
  assert.deepEqual(view.peers.map((p) => p.peerId), ['world', 'relay']);
  assert.deepEqual(view.edges.map((e) => e.to), ['relay']);
  assert.equal(view.models.length, 0);
});

test('only endpoint reports create edges; known relays can show while unknown endpoints are hidden', () => {
  const view = buildObservedNetwork([report('a', { peers: [{ peerId: 'relay', via: 'relay' }, { peerId: 'unknown' }] }), report('b')],
    { now, includeGhosts: false, relayIds: new Set(['relay']) });
  assert.equal(view.edges.length, 1);
  assert.equal(view.edges[0].to, 'relay');
  assert.equal(view.peers.find((p) => p.peerId === 'relay').isRelay, true);
  assert.ok(!view.edges.some((e) => e.to === 'b'));
});

test('opposite endpoint observations merge one link without double-counting bandwidth', () => {
  const view = buildObservedNetwork([report('a', { peers: [{ peerId: 'b', rxBps: 4, txBps: 6 }] }),
    report('b', { peers: [{ peerId: 'a', rxBps: 6, txBps: 4 }] })], { now });
  assert.equal(view.edges.length, 1);
  assert.deepEqual(view.edges[0].reportedBy, ['a', 'b']);
  assert.equal(view.edges[0].rxBps, 4);
  assert.equal(view.edges[0].txBps, 6);
});

test('stale reporters remain visible but contribute no live hosts or compute; expired ones disappear', () => {
  const view = buildObservedNetwork([report('stale', { receivedAt: now - 16_000, models: [model], compute: { workerCount: 4 } }),
    report('expired', { receivedAt: now - 61_000, models: [model] }),
    report('live', { compute: { workerCount: 2, activeTasks: 1, queuedTasks: 3, totalTasksCompleted: 5, totalTasksFailed: 0 } })], { now });
  assert.equal(view.summary.stale, 1);
  assert.equal(view.summary.active, 1);
  assert.equal(view.models.length, 0);
  assert.equal(view.compute.workerCount, 2);
  assert.equal(view.compute.totalTasksCompleted, 5);
  assert.ok(!view.peers.some((p) => p.peerId === 'expired'));
});

test('legacy beacons are distinct session-only evidence and cannot provide model or compute claims', () => {
  const legacySessions = [{ peerId: 'old', gameId: 'earth', ts: now, metadata: { models: [model], compute: { workerCount: 99 } } },
    { peerId: 'new', gameId: 'cubechat', ts: now }, { peerId: 'gone', gameId: 'old', ts: now - 20_000 }];
  const view = buildObservedNetwork([report('new')], { now, legacySessions });
  assert.equal(view.summary.sessionOnly, 1);
  assert.equal(view.summary.reporting, 1);
  assert.equal(view.compute.workerCount, 0);
  assert.deepEqual(view.models, []);
  assert.match(describeObservedPeer(view.peers.find((p) => p.peerId === 'old')).lines.join(' '), /telemetry unavailable/);
});

test('selected session scope preserves the game identity required by snapshot admission', () => {
  assert.deepEqual(attachedScope({ gameId: 'cubechat', roomId: 'global', topologyId: 'cubechat', topologyType: 'distributed' }),
    { gameId: 'cubechat', roomId: 'global', topologyId: 'cubechat', topologyType: 'distributed' });
  assert.equal(attachedScope(null).gameId, 'netviz');
});

test('model summary marks all busy only when every fresh host is busy', () => {
  const view = buildObservedNetwork([report('a', { models: [{ ...model, busy: true }] }), report('b', { models: [{ ...model, busy: true }] })], { now });
  assert.equal(view.models[0].busy, true);
  assert.equal(view.models[0].busyCount, 2);
});

test('unavailable model summary is explicit partial evidence, never a live host', () => {
  const unavailable = report('a', { modelsStatus: 'unavailable', models: [model] });
  const view = buildObservedNetwork([unavailable, report('b', { models: [model] })], { now });
  assert.equal(view.summary.modelsUnavailable, 1);
  assert.equal(view.models[0].hostCount, 1);
  assert.match(describeObservedPeer(unavailable, now).lines.join(' '), /not a confirmed empty/);
});
