import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';

test('NetworkManager telemetry snapshot reports counts and peers', () => {
  const manager = new NetworkManager({ gameId: 'demo', roomId: 'room' });
  manager.peerId = 'local-peer';
  manager.isConnected = true;
  manager.telemetry.rxCount = 4;
  manager.telemetry.txCount = 2;
  manager.telemetry.rxBytes = 120;
  manager.telemetry.txBytes = 80;
  manager._sampleTelemetry(1000);
  manager.telemetry.rxBytes = 220;
  manager.telemetry.txBytes = 180;
  manager._sampleTelemetry(2000);

  manager._touchPeer('peer-a', {
    gameId: 'demo',
    roomId: 'room',
    topologyId: manager.config.topologyId,
    connectedAt: 100,
    rxCount: 3,
    txCount: 1,
    rxBytes: 64,
    txBytes: 32,
    via: 'presence'
  });

  const snapshot = manager.getTelemetrySnapshot();
  assert.equal(snapshot.peerId, 'local-peer');
  assert.equal(snapshot.counts.rx, 4);
  assert.equal(snapshot.counts.tx, 2);
  assert.ok(snapshot.rates.rxBps > 0);
  assert.ok(snapshot.rates.txBps > 0);
  assert.equal(snapshot.peers.length, 1);
  assert.equal(snapshot.peers[0].peerId, 'peer-a');
  assert.equal(snapshot.peers[0].rxCount, 3);
  assert.equal(snapshot.peers[0].txBytes, 32);
});
