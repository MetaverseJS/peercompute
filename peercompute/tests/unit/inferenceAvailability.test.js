import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyInferenceAvailability, waitForInferenceAvailability } from '../../src/peercompute/inference/InferenceAvailability.js';

const busy = () => Object.assign(new Error('Queue full'), { code: 'ERR_INFERENCE_BUSY' });

test('only typed noncommitted availability failures wait; output and accepted operations cannot replay', () => {
  assert.equal(classifyInferenceAvailability(busy()).kind, 'busy');
  for (const code of ['ERR_AGENT_NO_MODEL', 'ERR_AGENT_STALE_MODEL', 'ERR_MODEL_NOT_READY']) {
    assert.equal(classifyInferenceAvailability({ code }).kind, 'model-unavailable');
  }
  assert.equal(classifyInferenceAvailability({ code: 'ERR_MODEL_RESIDENCY_INACTIVE' }).kind, 'recovering');
  for (const error of [new Error('queue is full'), new Error('bad response'),
    Object.assign(busy(), { committed: true }), Object.assign(busy(), { outputStarted: true }),
    Object.assign(busy(), { name: 'AbortError' })]) assert.equal(classifyInferenceAvailability(error), null);
});

test('capacity waits refresh selection and dispatch remains entirely outside the helper', async () => {
  const events = []; let selections = 0;
  const result = await waitForInferenceAvailability({ pollMs: 1, timeoutMs: 1000,
    onWaiting: event => events.push(event), select: ({ signal }) => {
      signal.throwIfAborted(); if (++selections < 3) throw busy(); return { sessionId: 'fresh' };
    } });
  assert.deepEqual(result, { sessionId: 'fresh' }); assert.equal(selections, 3);
  assert.equal(events.length, 2); assert(events.every(event => event.kind === 'busy' && event.type === 'waiting'));
});

test('wait timeout preserves typed contention and never retries a committed error', async () => {
  await assert.rejects(waitForInferenceAvailability({ pollMs: 1, timeoutMs: 10, select: () => { throw busy(); } }),
    { code: 'ERR_INFERENCE_BUSY' });
  let attempts = 0;
  await assert.rejects(waitForInferenceAvailability({ pollMs: 1, timeoutMs: 100,
    select: () => { attempts++; throw Object.assign(busy(), { committed: true }); } }), { committed: true });
  assert.equal(attempts, 1);
});

test('abort interrupts an unresponsive readiness probe and safely consumes its late rejection', async () => {
  const controller = new AbortController(); let rejectProbe;
  const waiting = waitForInferenceAvailability({ signal: controller.signal, timeoutMs: 1000,
    select: () => new Promise((_resolve, reject) => { rejectProbe = reject; }) });
  await Promise.resolve(); controller.abort();
  await assert.rejects(waiting, { name: 'AbortError' }); rejectProbe(new Error('Late discovery failure'));
});

test('cancelled waits do not run a new selector and throwing observers cannot cause a failed operation', async () => {
  const controller = new AbortController(); let selections = 0;
  const result = waitForInferenceAvailability({ signal: controller.signal, pollMs: 1000, timeoutMs: 2000,
    select: () => { selections++; throw busy(); }, onWaiting: () => { controller.abort(); throw new Error('UI failure'); } });
  await assert.rejects(result, { name: 'AbortError' }); assert.equal(selections, 1);
});
