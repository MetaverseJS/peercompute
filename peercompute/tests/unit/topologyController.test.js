import test from 'node:test';
import assert from 'node:assert/strict';
import { TopologyController } from '../../src/peercompute/networkManager/TopologyController.js';

test('TopologyController always includes the closest peer in distributed mode', () => {
  const controller = new TopologyController({
    topologyId: 'topo-a',
    maxConnections: 1,
    connectionRadius: 6,
    longRangeCount: 0,
    enforceTopologyScope: true,
    metric: { x: 0, y: 0, z: 0 }
  });

  const peers = [
    {
      peerId: 'peer-near',
      topologyId: 'topo-a',
      metric: { x: 1, y: 0, z: 0 },
      targetConnections: 2,
      activeConnections: 2
    },
    {
      peerId: 'peer-far-isolated',
      topologyId: 'topo-a',
      metric: { x: 5, y: 0, z: 0 },
      targetConnections: 2,
      activeConnections: 0
    },
    {
      peerId: 'peer-wrong-topo',
      topologyId: 'topo-b',
      metric: { x: 0.1, y: 0, z: 0 },
      targetConnections: 3,
      activeConnections: 0
    }
  ];

  const desired = controller.computeDesiredPeers({ peers, connections: [] });
  assert.ok(desired.has('peer-near'));
  assert.ok(!desired.has('peer-far-isolated'));
  assert.ok(!desired.has('peer-wrong-topo'));
});

test('TopologyController favors no-connection peers after the closest slot', () => {
  const controller = new TopologyController({
    topologyId: 'topo-a',
    maxConnections: 2,
    connectionRadius: 6,
    longRangeCount: 0,
    enforceTopologyScope: true,
    metric: { x: 0, y: 0, z: 0 }
  });

  const peers = [
    {
      peerId: 'peer-near',
      topologyId: 'topo-a',
      metric: { x: 1, y: 0, z: 0 },
      targetConnections: 2,
      activeConnections: 2
    },
    {
      peerId: 'peer-no-conn',
      topologyId: 'topo-a',
      metric: { x: 3, y: 0, z: 0 },
      targetConnections: 2,
      activeConnections: 0
    },
    {
      peerId: 'peer-with-conn',
      topologyId: 'topo-a',
      metric: { x: 2, y: 0, z: 0 },
      targetConnections: 2,
      activeConnections: 1
    }
  ];

  const desired = controller.computeDesiredPeers({ peers, connections: [] });
  assert.ok(desired.has('peer-near'));
  assert.ok(desired.has('peer-no-conn'));
  assert.ok(!desired.has('peer-with-conn'));
});

test('TopologyController keeps priority peers even outside radius', () => {
  const controller = new TopologyController({
    topologyId: 'topo-a',
    topologyType: 'hierarchical',
    maxConnections: 1,
    connectionRadius: 1,
    enforceTopologyScope: true,
    metric: { x: 0, y: 0, z: 0 }
  });

  controller.setPriorityPeers(['peer-far']);

  const peers = [
    {
      peerId: 'peer-near',
      topologyId: 'topo-a',
      metric: { x: 0.5, y: 0, z: 0 }
    },
    {
      peerId: 'peer-far',
      topologyId: 'topo-a',
      metric: { x: 4, y: 0, z: 0 }
    }
  ];

  const desired = controller.computeDesiredPeers({ peers, connections: [] });
  assert.ok(desired.has('peer-far'));
  assert.ok(!desired.has('peer-near'));
});

test('TopologyController falls back to closest peers when isolated', () => {
  const controller = new TopologyController({
    topologyId: 'topo-a',
    maxConnections: 5,
    connectionRadius: 6,
    isolationMinConnections: 2,
    longRangeCount: 0,
    enforceTopologyScope: true,
    metric: { x: 0, y: 0, z: 0 }
  });

  const peers = [
    {
      peerId: 'peer-a',
      topologyId: 'topo-a',
      metric: { x: 10, y: 0, z: 0 },
      activeConnections: 1
    },
    {
      peerId: 'peer-b',
      topologyId: 'topo-a',
      metric: { x: 8, y: 0, z: 0 },
      activeConnections: 1
    },
    {
      peerId: 'peer-c',
      topologyId: 'topo-a',
      metric: { x: 12, y: 0, z: 0 },
      activeConnections: 0
    },
    {
      peerId: 'peer-wrong-topo',
      topologyId: 'topo-b',
      metric: { x: 7, y: 0, z: 0 },
      activeConnections: 0
    }
  ];

  const desired = controller.computeDesiredPeers({ peers, connections: [] });
  assert.equal(desired.size, 2);
  assert.ok(desired.has('peer-b'));
  assert.ok(desired.has('peer-a'));
  assert.ok(!desired.has('peer-c'));
  assert.ok(!desired.has('peer-wrong-topo'));
});

test('TopologyController computes shard ids and neighbors', () => {
  const controller = new TopologyController({ shardSize: 4, shardRadius: 1 });
  const shardId = controller.getShardId({ x: 4, y: 4, z: 4 });
  assert.equal(shardId, '1:1:1');

  const neighbors = controller.getNeighborShardIds({ x: 4, y: 4, z: 4 });
  assert.equal(neighbors.length, 27);
  assert.ok(neighbors.includes('1:1:1'));
});

test('TopologyController shouldDialPeer honors desired peers', () => {
  const controller = new TopologyController({ targetConnections: 1 });
  assert.ok(controller.shouldDialPeer('peer-a'));
  controller.computeDesiredPeers({ peers: [{ peerId: 'peer-b' }], connections: [] });
  assert.ok(!controller.shouldDialPeer('peer-a'));
  assert.ok(controller.shouldDialPeer('peer-b'));
});
