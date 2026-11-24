import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../peercompute/src/peercompute/networkManager/NetworkManager.js';
import { RoomDirectory, buildRoomDirectoryTopic } from '../cubechat/src/p2p/roomDirectory.js';

test('RoomDirectory shares existing NetworkManager topic without spawning a second NodeKernel', async (t) => {
  const bus = new Map();
  const makeFakeNetworkManager = (peerId) => {
    const nm = new NetworkManager({ gameId: 'cubechat', roomId: 'global', enableNetworkTelemetry: false });
    nm.peerId = peerId;
    const origSubscribe = nm.subscribeTopic.bind(nm);
    const origPublish = nm.publishTopic.bind(nm);
    nm.subscribeTopic = (topic, handler) => {
      const unsub = origSubscribe(topic, handler);
      let listeners = bus.get(topic);
      if (!listeners) { listeners = new Set(); bus.set(topic, listeners); }
      const entry = { nm, handler };
      listeners.add(entry);
      return () => { listeners.delete(entry); unsub(); };
    };
    nm.publishTopic = async (topic, message) => {
      for (const entry of (bus.get(topic) || [])) {
        if (entry.nm !== nm) entry.handler(peerId, message, { from: peerId, payload: message }, topic);
      }
      await origPublish(topic, message).catch(() => {});
    };
    return nm;
  };

  const nm1 = makeFakeNetworkManager('peer-1');
  const nm2 = makeFakeNetworkManager('peer-2');
  const dir1 = new RoomDirectory({ gameId: 'cubechat', networkManager: nm1 });
  const dir2 = new RoomDirectory({ gameId: 'cubechat', networkManager: nm2 });
  t.after(async () => { await dir1.stop(); await dir2.stop(); });

  await dir1.init();
  await dir2.init();
  assert.equal(dir1.node, null, 'shared RoomDirectory must not spawn a second NodeKernel');
  assert.equal(dir1.topic, buildRoomDirectoryTopic('cubechat'));

  dir1.announceRoom({ name: 'LAN Lounge', visibility: 'public', roomId: 'lan-lounge' });
  const discovered = dir2.getRooms();
  assert.equal(discovered.length, 1);
  assert.equal(discovered[0].name, 'LAN Lounge');
  assert.equal(discovered[0].roomId, 'lan-lounge');

  assert.equal(dir1.stateManager?.readScoped('rooms', 'room-lan-lounge')?.roomId, 'lan-lounge');
  assert.equal(dir2.stateManager?.readScoped('rooms', 'room-lan-lounge')?.roomId, 'lan-lounge');

  const observed = [];
  const unsubObs = dir2.stateManager.observeNamespace('rooms', (value, key) => {
    observed.push({ key, roomId: value?.roomId ?? null });
  });
  dir1.stateManager.writeScoped('rooms', 'room-scoped-probe', {
    name: 'Scoped Probe',
    slug: 'scoped-probe',
    visibility: 'public',
    updatedAt: Date.now(),
    roomId: 'scoped-probe'
  });
  unsubObs();
  assert.equal(dir2.stateManager.readScoped('rooms', 'room-scoped-probe')?.roomId, 'scoped-probe');
  assert.ok(observed.some((e) => e.key === 'room-scoped-probe' && e.roomId === 'scoped-probe'));

  const nm3 = makeFakeNetworkManager('peer-3');
  const dir3 = new RoomDirectory({ gameId: 'cubechat', networkManager: nm3 });
  t.after(async () => { await dir3.stop(); });
  await dir3.init();
  assert.equal(dir3.stateManager?.readScoped('rooms', 'room-lan-lounge')?.roomId, 'lan-lounge');

  const nm2New = makeFakeNetworkManager('peer-2-new');
  dir2.attachNetworkManager(nm2New);
  assert.equal(dir2.getRooms().length, 2);
});
