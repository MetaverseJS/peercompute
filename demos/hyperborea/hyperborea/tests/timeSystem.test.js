import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TimeSystem } from '../src/systems/timeSystem.js';

test('time multiplier preserves elapsed time when changed', () => {
  const originalNow = Date.now;
  try {
    Date.now = () => 1000;
    const system = new TimeSystem();
    system.startTime = 0;
    system.timeOffset = 0;
    system.timeMultiplier = 1;

    Date.now = () => 1000;
    system.setTimeMultiplier(2);

    Date.now = () => 1200;
    assert.equal(system.getTime(), 1400);
  } finally {
    Date.now = originalNow;
  }
});

test('remote sync applies network latency compensation', () => {
  const originalNow = Date.now;
  try {
    Date.now = () => 0;
    const system = new TimeSystem();
    system.startTime = 0;
    system.timeOffset = 0;
    system.timeMultiplier = 1;

    Date.now = () => 2000;
    system.applyRemoteSync({ multiplier: 1, time: 500, sentAt: 1500 });
    assert.equal(system.getTime(), 1000);
  } finally {
    Date.now = originalNow;
  }
});
