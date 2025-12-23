import test from 'node:test';
import assert from 'node:assert/strict';
import { NodeKernel } from '../../src/peercompute/nodeKernel/NodeKernel.js';

test('NodeKernel clock policy defaults to independent', () => {
  const node = new NodeKernel();
  assert.equal(node.config.clockPolicy.mode, 'independent');
  assert.equal(node.config.clockPolicy.tickHz, 30);
  assert.equal(node.config.clockPolicy.networkProfile, null);
});

test('NodeKernel clock policy updates scheduler clock mode and ticks', () => {
  const node = new NodeKernel();
  let schedulerClock = null;
  let lastTick = null;
  let configuredProfile = null;

  node.networkManager = {
    setSchedulerClock: (mode) => {
      schedulerClock = mode;
    },
    configureScheduler: (profile) => {
      configuredProfile = profile;
    },
    tickScheduler: (now) => {
      lastTick = now;
    }
  };

  node.setClockPolicy({ mode: 'kernel', tickHz: 20, networkProfile: { snapshotHz: 12 } });
  assert.equal(node.config.clockPolicy.mode, 'kernel');
  assert.equal(node.config.clockPolicy.tickHz, 20);
  assert.equal(schedulerClock, 'external');
  assert.deepEqual(configuredProfile, { snapshotHz: 12 });

  node.tick(123);
  assert.equal(lastTick, 123);

  node.setClockPolicy({ mode: 'independent' });
  assert.equal(schedulerClock, 'internal');
});

test('NodeKernel kernel clock drives scheduler ticks', async () => {
  const node = new NodeKernel({ clockPolicy: { mode: 'kernel', tickHz: 50 } });
  let tickCount = 0;
  node.networkManager = {
    setSchedulerClock: () => {},
    configureScheduler: () => {},
    tickScheduler: () => {
      tickCount += 1;
    }
  };
  node.isStarted = true;
  node.setClockPolicy({ mode: 'kernel', tickHz: 50 });
  await new Promise((resolve) => setTimeout(resolve, 70));
  node.setClockPolicy({ mode: 'independent' });
  assert.ok(tickCount >= 2);
});
