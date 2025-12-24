import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';

test('NetworkManager registerWarmDeltaProvider uses provided deltas', () => {
  const manager = new NetworkManager({ enableScheduler: true });
  let registered = null;

  manager._ensureScheduler = () => {
    manager.scheduler = {
      registerStateProvider: (fn, options) => {
        registered = { fn, options };
        return options.id;
      }
    };
  };
  manager._startScheduler = () => {};

  const id = manager.registerWarmDeltaProvider(() => ({ example: 1 }), { id: 'warm' });
  assert.equal(id, 'warm');
  assert.ok(registered);
  assert.deepEqual(registered.fn(), { example: 1 });
});
