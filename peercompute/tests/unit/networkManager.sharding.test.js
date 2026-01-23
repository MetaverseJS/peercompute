import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';

test('NetworkManager publishes snapshots to shard topic when sharding is enabled', async () => {
  const manager = new NetworkManager({
    enableSharding: true,
    useScopedTopics: true,
    topicPrefix: 'pc',
    topologyId: 'topo',
    roomId: 'room'
  });
  manager.isConnected = true;
  manager.topologyShardId = '0:0:0';

  let sent = null;
  manager._publish = async (topic, message) => {
    sent = { topic, message };
  };

  await manager._sendScheduledSnapshot({ type: 'pc-snapshot', payload: [] });

  assert.ok(sent);
  assert.equal(sent.topic, 'pc.topo.room.shard.0:0:0');
  assert.equal(sent.message.shardId, '0:0:0');
});

test('NetworkManager snapshotTopic override bypasses sharded topic', async () => {
  const manager = new NetworkManager({
    enableSharding: true,
    useScopedTopics: true,
    topicPrefix: 'pc',
    topologyId: 'topo',
    roomId: 'room'
  });
  manager.isConnected = true;
  manager.topologyShardId = '1:0:0';
  manager.scheduler = { getProfile: () => ({ snapshotTopic: 'pc.custom.snapshot' }) };

  let sent = null;
  manager._publish = async (topic, message) => {
    sent = { topic, message };
  };

  await manager._sendScheduledSnapshot({ type: 'pc-snapshot', payload: [] });

  assert.ok(sent);
  assert.equal(sent.topic, 'pc.custom.snapshot');
  assert.equal(sent.message.shardId, undefined);
});
