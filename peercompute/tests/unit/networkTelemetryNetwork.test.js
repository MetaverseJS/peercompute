import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { gossipsub } from '@libp2p/gossipsub';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { NETWORK_TELEMETRY_TOPIC as TOPIC, NETWORK_TELEMETRY_TYPE as TYPE,
  NETWORK_TELEMETRY_SCHEMA as SCHEMA } from '../../src/peercompute/networkManager/NetworkTelemetryService.js';

async function until(check) {
  for (let i = 0; i < 200; i++) { if (check()) return; await delay(25); }
  throw new Error('Signed telemetry did not arrive');
}

test('real signed gossipsub joins different game rooms without entering game handlers; hosted state updates locally', { timeout: 15000 }, async t => {
  const entries = [];
  t.after(async () => { await Promise.allSettled(entries.map(({ manager }) => manager.disconnect())); });
  for (const game of ['world-fixture', 'model-fixture']) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] },
      transports: [webSockets()], connectionEncrypters: [noise()], streamMuxers: [yamux()],
      services: { identify: identify(), pubsub: gossipsub({ allowPublishToZeroTopicPeers: true }) } });
    const manager = new NetworkManager({ gameId: game, roomId: `${game}-room`, topologyId: game,
      enableTopologyController: false, enablePeerDirectory: false, networkTelemetryPublish: false });
    manager.libp2p = node; manager.peerId = node.peerId.toString(); manager.isConnected = true;
    const gameMessages = [];
    manager.onMessage = (...args) => gameMessages.push(args);
    manager._wireLibp2pEvents(); node.services.pubsub.subscribe(TOPIC);
    const telemetry = manager.getNetworkTelemetryService(); telemetry.start();
    entries.push({ node, manager, telemetry, gameMessages });
  }
  const [world, models] = entries;
  await world.node.dial(models.node.getMultiaddrs());
  await until(() => world.node.services.pubsub.getSubscribers(TOPIC).length > 0
    && models.node.services.pubsub.getSubscribers(TOPIC).length > 0);
  models.manager.config.networkTelemetryPublish = true;
  models.manager.setNetworkTelemetryProvider(() => ({ application: 'inference', role: 'models', compute: { workerCount: 2 } }));
  const model = { manifestCid: 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou',
    modelId: 'fixture', name: 'Telemetry fixture (no inference)', modalities: ['text'],
    task: 'text-generation', runtime: 'fixture', repository: 'fixture/model', revision: 'test', totalBytes: 1 };
  let state = { sharedModels: [], hostedModels: [model] }, generations = 0;
  const inference = await models.manager.createPeerInferenceService({ getLocalState: () => state,
    generate: () => { generations++; throw new Error('Telemetry must never request inference'); } });
  await models.telemetry.publish();
  await until(() => world.telemetry.list().some(report => report.peerId === models.manager.peerId));
  const actual = world.telemetry.list()[0];
  assert.equal(actual.gameId, 'model-fixture');
  assert.equal(actual.application, 'inference'); assert.equal(actual.role, 'models');
  assert.equal(actual.models[0].name, model.name); assert.equal(actual.authenticated, true);
  assert.equal(actual.compute.workerCount, 2); assert.equal(actual.modelsStatus, 'available');
  assert.deepEqual(world.gameMessages, []);

  // A real signed publisher cannot impersonate somebody else through JSON.
  await models.node.services.pubsub.publish(TOPIC, new TextEncoder().encode(JSON.stringify({
    type: TYPE, schema: SCHEMA, instanceId: 'spoof', sequence: 1,
    snapshot: { ...actual, peerId: world.manager.peerId }
  })));
  await delay(550);
  inference.setHostingEnabled(false);
  await models.telemetry.publish();
  await until(() => world.telemetry.list()[0].models.length === 0);
  assert.equal(world.telemetry.list().length, 1, 'spoof did not create a record');
  assert.equal(generations, 0);
  state = { sharedModels: [], hostedModels: [] }; inference.setHostingEnabled(true);
  await delay(550); await models.telemetry.publish();
  await until(() => world.telemetry.list()[0].models.length === 0);
  assert.equal(generations, 0);
});
