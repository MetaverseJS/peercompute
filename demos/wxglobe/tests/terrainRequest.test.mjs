import test from 'node:test';
import assert from 'node:assert/strict';
import { retryTerrainRequest } from '../src/terrain/terrainRequest.js';

test('terrain requests retry a bounded number of times and expose retry lifecycle hooks', async () => {
  let calls = 0;
  let starts = 0;
  let ends = 0;
  let retryActive = 0;
  const result = await retryTerrainRequest(async () => {
    calls += 1;
    if (calls > 1) assert.equal(retryActive, 1, 'retry status must remain active during the source attempt');
    if (calls < 3) throw new Error(`attempt ${calls}`);
    return 'loaded';
  }, {
    attempts: 3,
    delayMs: 0,
    onRetryStart: () => { starts += 1; retryActive += 1; },
    onRetryEnd: () => { ends += 1; retryActive -= 1; }
  });

  assert.equal(result, 'loaded');
  assert.equal(calls, 3);
  assert.equal(starts, 2);
  assert.equal(ends, 2);
  assert.equal(retryActive, 0);
});

test('aborting while an operation rejects normally is still classified as cancellation', async () => {
  const controller = new AbortController();
  const pending = retryTerrainRequest(async () => {
    controller.abort();
    throw new Error('ordinary operation error after retirement');
  }, { signal: controller.signal });

  await assert.rejects(pending, (error) => error?.name === 'AbortError');
});

test('terrain request abort interrupts backoff without another source attempt', async () => {
  const controller = new AbortController();
  let calls = 0;
  let retryStarted;
  const started = new Promise((resolve) => { retryStarted = resolve; });
  const pending = retryTerrainRequest(async () => {
    calls += 1;
    throw new Error('offline');
  }, {
    attempts: 3,
    delayMs: 10_000,
    signal: controller.signal,
    onRetryStart: retryStarted
  });

  await started;
  controller.abort();
  await assert.rejects(pending, /aborted/i);
  assert.equal(calls, 1);
});
