import test from 'node:test';
import assert from 'node:assert/strict';
import { createResidentMotorService } from '../shared/agents/motor/ResidentMotorService.js';
import { evaluateNetwork } from '../shared/agents/motor/policyReference.js';
import { MOTOR_INPUTS } from '../shared/agents/motor/motorContracts.js';

const observation = { relativePosition: [20, 0], velocity: [0, 0], targetVelocity: [0, 0], stopDistance: 10 };
const batch = [{ id: 'ada', observation }];
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
function fixture(options = {}) {
  const calls = []; let weights, policyId, reserved = false, dispatches = 0;
  const manager = {
    async reserveWorkerAffinity(key) { calls.push(['reserve', key]); reserved = true; },
    getWorkerAffinityState() { return { workerId: reserved ? 'test-worker' : null }; },
    async submitTask(task) {
      assert.equal(task.requireWorker, true); assert.equal(task.fn, undefined); assert.match(task.module, /residentMotorTask\.js/);
      assert.equal(task.exportName, 'handleResidentMotorTask'); calls.push([task.data.command, task]);
      task.signal.throwIfAborted();
      if (task.data.command === 'load') {
        if (options.failLoad) throw Error('WebGPU unavailable');
        weights = task.data.weights; policyId = task.data.policyId;
        return { backend: 'webgpu', worker: true, policyId };
      }
      if (task.data.command === 'infer') {
        await options.gate?.promise; task.signal.throwIfAborted(); dispatches++;
        const inputs = task.data.inputs, values = new Float32Array(inputs.length / MOTOR_INPUTS * 2);
        // Explicit simulated worker for host lifecycle tests only, not GPU evidence.
        for (let i = 0; i < inputs.length / MOTOR_INPUTS; i++) values.set(evaluateNetwork(weights, inputs.subarray(i * MOTOR_INPUTS, (i + 1) * MOTOR_INPUTS)), i * 2);
        return { backend: 'webgpu', worker: true, policyId, dispatches, values };
      }
      return { disposed: true };
    },
    async terminateWorkerAffinity() { calls.push(['terminate']); },
    async releaseWorkerAffinity() { calls.push(['release']); reserved = false; },
  };
  return { service: createResidentMotorService({ computeManager: manager }), calls, manager };
}
test('managed motor pins one worker, batches independent identities and releases owned GPU session', async () => {
  const f = fixture();
  try {
    const result = await f.service.infer([...batch, { id: 'bert', observation: { ...observation, relativePosition: [-20, 0] } }]);
    assert.equal(result.backend, 'webgpu'); assert.equal(result.results.length, 2);
    assert.deepEqual(result.results.map(item => item.id), ['ada', 'bert']);
    assert(result.results[0].acceleration[0] > 0); assert(result.results[1].acceleration[0] < 0);
    await f.service.infer(batch); assert.equal(f.calls.filter(call => call[0] === 'reserve').length, 1);
    assert.equal(f.service.getStatus().dispatches, 2);
  } finally { await f.service.dispose(); }
  assert.deepEqual(f.calls.slice(-2).map(call => call[0]), ['unload', 'release']);
  assert.equal(f.service.getStatus().status, 'closed'); await assert.rejects(f.service.infer(batch), { name: 'AbortError' });
});
test('dispose cancels and awaits in-flight work before unloading or releasing the worker', async () => {
  const gate = deferred(), f = fixture({ gate });
  const run = f.service.infer(batch); const rejected = assert.rejects(run, { name: 'AbortError' });
  while (!f.calls.some(call => call[0] === 'infer')) await new Promise(resolve => setTimeout(resolve, 1));
  await assert.rejects(f.service.infer(batch), /busy/);
  const closing = f.service.dispose(); assert.equal(f.calls.some(call => call[0] === 'release'), false);
  gate.resolve(); await rejected; await closing;
  assert.deepEqual(f.calls.slice(-2).map(call => call[0]), ['unload', 'release']);
});
test('missing WebGPU produces an explicit failure and never runs a substitute movement controller', async () => {
  const f = fixture({ failLoad: true });
  await assert.rejects(f.service.infer(batch), /WebGPU unavailable/);
  assert.equal(f.service.getStatus().status, 'error'); assert.equal(f.calls.some(call => call[0] === 'infer'), false);
  await f.service.dispose(); assert.equal(f.service.getStatus().reserved, false);
});
test('cancelling the first body request does not poison the shared policy initialization', async () => {
  const f = fixture(), controller = new AbortController();
  try {
    const pending = f.service.infer(batch, { signal: controller.signal }); controller.abort();
    await assert.rejects(pending, { name: 'AbortError' });
    const next = await f.service.infer(batch);
    assert.equal(next.results[0].id, 'ada');
    assert.equal(f.calls.filter(call => call[0] === 'load').length, 1);
  } finally { await f.service.dispose(); }
});
