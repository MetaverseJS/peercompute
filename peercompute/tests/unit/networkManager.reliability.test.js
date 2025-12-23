import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';

test('NetworkManager marks reliable events by profile', () => {
  const manager = new NetworkManager({ gameId: 'game', roomId: 'room' });
  let captured = null;
  manager._ensureScheduler = () => {
    manager.scheduler = {
      getProfile: () => ({ reliableEventTypes: ['spawn'] }),
      queueEvent: (payload, options) => {
        captured = { payload, options };
      }
    };
  };

  manager.queueEvent({ type: 'spawn' });
  assert.equal(captured.options.reliable, true);

  manager.queueEvent({ type: 'spawn' }, { reliable: false });
  assert.equal(captured.options.reliable, false);
});
