import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const turn = () => new Promise(resolve => setImmediate(resolve));

function fixture(t) {
  const failures = [], subscriptions = [], events = [];
  const manager = new NetworkManager({ enableNetworkTelemetry: false, enableTelemetry: false,
    enableTopologyController: false, enablePeerDirectory: false, bootstrapPeers: [],
    onConnectionFailure: event => failures.push(event) });
  function node(name) {
    let started = true;
    return { peerId: { toString: () => name }, getConnections: () => [],
      services: { pubsub: {
        isStarted: () => started,
        subscribe(topic) {
          if (!started) throw new Error('Pubsub has not started');
          subscriptions.push({ node: name, topic });
        }
      } },
      async stop() { started = false; events.push(`stop:${name}`); },
      restart() { started = true; }
    };
  }
  manager.libp2p = node('original'); manager.peerId = 'original'; manager.isConnected = true;
  manager._dialBootstrapPeers = async () => {};
  manager._reserveBootstrapRelayAddrs = async () => { events.push('reserve'); };
  manager._logLocalAnnounceAddrs = async () => {};
  manager._maybeUpdateBootstrapRelayConnections = () => {};
  manager._ensureRelayReservation = () => {};
  manager._publishPresenceNow = async () => { events.push('presence'); };
  t.after(() => manager.disconnect());
  return { manager, failures, subscriptions, events, node };
}

test('disconnect invalidates a pending reconnect before yielding and does not wait for its dial', { timeout: 2000 }, async t => {
  const f = fixture(t), dial = deferred();
  f.manager._dialBootstrapPeers = () => dial.promise;
  const reconnect = f.manager._schedulerReconnect();
  const stopping = f.manager.disconnect();
  assert.equal(f.manager.isConnected, false, 'No new recovery is admitted during awaited cleanup');
  await stopping;
  assert.deepEqual(f.events, ['stop:original']);
  dial.resolve();
  await reconnect;
  assert.deepEqual(f.subscriptions, []);
  assert.deepEqual(f.events, ['stop:original'], 'Late dialing cannot reserve relays or publish presence');
  assert.equal(f.manager.presenceInterval, null);
});

test('a late failed reconnect after disconnect settles without an active-session failure', async t => {
  const f = fixture(t), dial = deferred();
  f.manager._dialBootstrapPeers = () => dial.promise;
  const reconnect = f.manager._schedulerReconnect();
  const settled = assert.doesNotReject(reconnect);
  await f.manager.disconnect();
  dial.reject(new Error('Dial rejected after shutdown'));
  await settled;
  assert.deepEqual(f.failures, []);
  assert.deepEqual(f.subscriptions, []);
  assert.equal(f.manager.presenceInterval, null);
});

for (const replaceNode of [false, true]) {
  test(`old reconnect cannot alter a later ${replaceNode ? 'replacement-node' : 'same-node'} session or clear its pending recovery`, async t => {
    const f = fixture(t), oldDial = deferred(), newDial = deferred();
    let dials = 0;
    f.manager._dialBootstrapPeers = () => (++dials === 1 ? oldDial : newDial).promise;
    const oldReconnect = f.manager._schedulerReconnect();
    await f.manager.disconnect();
    if (replaceNode) f.manager.libp2p = f.node('replacement');
    else f.manager.libp2p.restart();
    f.manager.isConnected = true;
    const newReconnect = f.manager._schedulerReconnect();
    oldDial.resolve(); await oldReconnect;
    assert.deepEqual(f.subscriptions, []);
    assert.equal(f.manager.presenceInterval, null);
    assert.equal(f.manager._schedulerReconnect(), newReconnect, 'Old settlement cannot remove the new single-flight recovery');
    assert.equal(dials, 2);
    newDial.resolve(); await newReconnect;
    assert.equal(f.subscriptions.length, 3);
    assert(f.subscriptions.every(entry => entry.node === (replaceNode ? 'replacement' : 'original')));
    assert.equal(f.events.filter(event => event === 'presence').length, 1);
  });
}

test('node replacement alone fences a pending recovery even while the manager stays connected', async t => {
  const f = fixture(t), dial = deferred();
  f.manager._dialBootstrapPeers = () => dial.promise;
  const reconnect = f.manager._schedulerReconnect();
  f.manager.libp2p = f.node('replacement');
  dial.resolve(); await reconnect;
  assert.deepEqual(f.subscriptions, []);
  assert.deepEqual(f.events, []);
  assert.equal(f.manager.presenceInterval, null);
});

test('connected reconnects share one dial and resume subscriptions and presence exactly once', async t => {
  const f = fixture(t), dial = deferred();
  let dials = 0;
  f.manager._dialBootstrapPeers = () => { dials++; return dial.promise; };
  const first = f.manager._schedulerReconnect();
  assert.equal(f.manager._schedulerReconnect(), first);
  assert.equal(dials, 1);
  dial.resolve(); await first;
  assert.deepEqual(f.subscriptions.map(entry => entry.topic), [f.manager.config.pubsubTopic,
    f.manager.config.directTopic, f.manager.config.presenceTopic]);
  assert.equal(f.events.filter(event => event === 'presence').length, 1);
  assert.notEqual(f.manager.presenceInterval, null);
  const next = f.manager._schedulerReconnect(); await next;
  assert.notEqual(next, first);
  assert.equal(dials, 2, 'A settled recovery does not prevent a later legitimate retry');
});

test('active reconnect rejection is reported once and the scheduler can retry', async t => {
  const f = fixture(t), failure = new Error('Active dial failure');
  f.manager._dialBootstrapPeers = async () => { throw failure; };
  f.manager._ensureScheduler();
  f.manager.scheduler.tick(10000);
  await turn();
  assert.equal(f.failures.length, 1);
  assert.equal(f.failures[0].source, 'scheduler');
  assert.equal(f.failures[0].stage, 'reconnect');
  assert.equal(f.failures[0].error, failure);
  assert.deepEqual(f.subscriptions, []);
  f.manager._dialBootstrapPeers = async () => {};
  f.manager.scheduler.tick(16000);
  await turn();
  assert.equal(f.subscriptions.length, 3);
  assert.equal(f.events.filter(event => event === 'presence').length, 1);
  assert.equal(f.failures.length, 1);
});

test('disconnected or stopped pubsub cannot begin reconnect work', async t => {
  const f = fixture(t);
  let dials = 0;
  f.manager._dialBootstrapPeers = async () => { dials++; };
  f.manager.isConnected = false;
  await f.manager._schedulerReconnect();
  f.manager.isConnected = true;
  await f.manager.libp2p.stop();
  await f.manager._schedulerReconnect();
  assert.equal(dials, 0);
  assert.deepEqual(f.subscriptions, []);
  assert.equal(f.manager.presenceInterval, null);
});
