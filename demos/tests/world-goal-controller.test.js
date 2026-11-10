import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { WorldGoalStore } from '../../peercompute/src/peercompute/agents/WorldGoalStore.js';
import { createWorldGoalController } from '../shared/agents/WorldGoalController.js';

const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const act = targetId => ({ decision: 'act', intent: { type: 'approach', targetId }, reason: `Visit ${targetId}` });
async function fixture({ decide, dispatch, stop, canRun = () => true, indexedDB = new IDBFactory(), name = crypto.randomUUID() } = {}) {
  let clock = 1000, sensed = 0;
  const store = new WorldGoalStore({ name, hostId: 'owner-host', indexedDBImpl: indexedDB, now: () => clock }); await store.open();
  const calls = [], changes = [], pending = [], timers = new Map(); let timerId = 0;
  const options = { store, worldId: 'world', owns: () => true, now: () => clock,
    setTimer(fn, ms) { const id = ++timerId; timers.set(id, { fn, ms }); return id; }, clearTimer(id) { timers.delete(id); },
    canRun, onChange: goal => changes.push(goal),
    observe: (_scope, { goal }) => ({ observedAt: clock, self: { id: 'resident:owner:agent', intentRevision: 0,
      name: 'Resident', position: [0, 0, 0], velocity: [0, 0, 0] }, requesterId: goal.requesterId,
    participants: ['human:nova', 'human:owner'].map(id => ({ id, kind: 'human', name: id,
      peerId: id.slice(6), position: [10, 0, 0], relativePosition: [10, 0, 0], velocity: [0, 0, 0], distance: 10 })),
    obstacles: [], readSequence: ++sensed }),
    async decide(scope, input) { calls.push({ kind: 'decide', scope, input: structuredClone({ ...input, signal: undefined }) });
      return decide ? decide(scope, input) : act('human:nova'); },
    async dispatch(scope, input, options) {
      const saved = await store.get(scope);
      assert.equal(saved.status, 'acting'); assert.equal(saved.pendingAction.requestId, input.requestId);
      calls.push({ kind: 'dispatch', scope, input }); pending.push(input);
      return dispatch?.(scope, input, options) ?? { applied: true };
    },
    async stop(scope, input) { calls.push({ kind: 'stop', scope, input }); return stop?.(scope, input); },
  };
  const controller = createWorldGoalController(options); await controller.ready;
  const assign = () => controller.assign({ agentId: 'agent', objective: 'Visit Nova, then return to me.', requesterId: 'human:owner' });
  const idle = async () => {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      if (!controller.getStatus().active) return;
      await new Promise(resolve => setImmediate(resolve));
    }
    assert.fail('Controller did not settle');
  };
  const step = async () => { await controller.tick(); await idle(); return controller.get('agent'); };
  const receipt = async (status = 'arrived', override = {}) => {
    const goal = await store.get({ worldId: 'world', agentId: 'agent' });
    const action = goal.pendingAction;
    return controller.receiveReceipt({ agentId: 'agent' }, { requestId: action.requestId, type: action.intent.type,
      targetId: action.intent.targetId, status, position: [10, 0, 0], ...override });
  };
  return { controller, store, options, calls, changes, pending, assign, idle, step, receipt, timers,
    advance: ms => { clock += ms; }, get sensed() { return sensed; },
    async close() { await controller.dispose(); await store.destroy(); } };
}

test('two physical steps and a model assessment use fresh senses, durable checkpoints and matching receipts', async () => {
  const f = await fixture({ decide(_scope, { goal }) {
    if (!goal.receipts.length) return act('human:nova');
    if (goal.receipts.length === 1) return act('human:owner');
    return { decision: 'done', assessment: 'I assess both visits as finished.', receiptIds: goal.receipts.map(receipt => receipt.requestId) };
  } });
  try {
    await f.assign(); assert.equal((await f.step()).status, 'acting');
    assert.equal(f.pending[0].intent.targetId, 'human:nova');
    assert.equal(await f.receipt('arrived', { requestId: 'unrelated' }), false);
    assert.equal(await f.receipt(), true);
    assert.equal((await f.step()).status, 'acting'); assert.equal(f.pending[1].intent.targetId, 'human:owner');
    await f.receipt(); const result = await f.step();
    assert.equal(result.status, 'completed'); assert.equal(result.steps, 3); assert.equal(result.receipts.length, 2);
    assert.equal(result.modelAssessment, 'I assess both visits as finished.');
    assert.equal(f.calls.filter(call => call.kind === 'stop').length, 2);
    assert.ok(f.calls.filter(call => call.kind === 'decide').map(call => call.input.observed.readSequence).every((value, index, values) => index === 0 || value > values[index - 1]));
  } finally { await f.close(); }
});

test('arrival waits for exact motor cleanup and ignores its duplicate cancellation receipt', async () => {
  const gate = deferred(); let f;
  f = await fixture({ async stop(_scope, input) {
    assert.equal(await f.controller.receiveReceipt({ agentId: 'agent' }, { requestId: input.requestId,
      type: 'approach', targetId: 'human:nova', status: 'cancelled' }), false);
    await gate.promise;
  } });
  try {
    await f.assign(); await f.step();
    const settling = f.receipt();
    for (let i = 0; i < 20 && !f.calls.some(call => call.kind === 'stop'); i++) await new Promise(resolve => setImmediate(resolve));
    assert.equal((await f.controller.get('agent')).status, 'paused');
    await f.controller.tick(); assert.equal(f.pending.length, 1);
    gate.resolve(); await settling; assert.equal((await f.controller.get('agent')).status, 'ready');
  } finally { gate.resolve(); await f.close(); }
});

test('manual movement cancellation pauses the objective instead of fighting the player', async () => {
  const f = await fixture();
  try {
    await f.assign(); await f.step(); await f.receipt('cancelled');
    const result = await f.controller.get('agent'); assert.equal(result.status, 'paused');
    await f.step(); assert.equal(f.pending.length, 1); assert.equal(f.calls.filter(call => call.kind === 'stop').length, 0);
  } finally { await f.close(); }
});

test('a newer acknowledged pause wins over receipt settlement after motor cleanup', async () => {
  const gate = deferred(), entered = deferred();
  const f = await fixture({ stop: async () => { entered.resolve(); await gate.promise; return true; } });
  try {
    await f.assign(); await f.step();
    const settling = f.receipt('arrived'); await entered.promise;
    const checkpoint = await f.controller.get('agent');
    const paused = await f.store.commit({ worldId: 'world', agentId: 'agent' }, {
      goalId: checkpoint.goalId, expectedRevision: checkpoint.revision,
      patch: { status: 'paused', reason: 'Paused by the owner.' }, event: { type: 'paused' } });
    gate.resolve(); await settling;
    const result = await f.controller.get('agent');
    assert.equal(result.revision, paused.revision); assert.equal(result.status, 'paused');
    assert.equal(result.reason, 'Paused by the owner.');
    assert.equal(result.lastReceipt.status, 'arrived');
    await f.step(); assert.equal(f.pending.length, 1, 'Late settlement cannot restart planning');
  } finally { gate.resolve(); await f.close(); }
});

test('ordinary chat preserves a running motor but interrupts only a pending planner and waits30seconds', async () => {
  const f = await fixture();
  try {
    await f.assign(); await f.step(); await f.controller.interrupt({ agentId: 'agent' });
    assert.equal((await f.controller.get('agent')).status, 'acting'); assert.equal(f.calls.filter(call => call.kind === 'stop').length, 0);
    await f.receipt(); await f.step(); assert.equal(f.pending.length, 1);
    f.advance(30000); await f.step(); assert.equal(f.pending.length, 2);
  } finally { await f.close(); }
  const waiting = deferred(); let entered;
  const began = new Promise(resolve => { entered = resolve; });
  const g = await fixture({ decide(_scope, { signal }) { entered(); return new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true }); waiting.promise.then(resolve);
  }); } });
  try {
    await g.assign(); await g.controller.tick(); await began;
    await g.controller.interrupt({ agentId: 'agent' });
    const result = await g.controller.get('agent'); assert.equal(result.status, 'ready'); assert.equal(result.failures, 0); assert.equal(result.steps, 1);
    waiting.resolve(act('human:nova')); await g.step(); assert.equal(g.pending.length, 0);
  } finally { waiting.resolve(act('human:nova')); await g.close(); }
});

test('absent providers wait without spending steps or automatically loading models', async () => {
  const f = await fixture({ decide: () => ({ status: 'waiting-for-model' }) });
  try {
    await f.assign(); const result = await f.step(); assert.equal(result.status, 'waiting-for-model'); assert.equal(result.steps, 0);
    await f.step(); assert.equal(f.calls.filter(call => call.kind === 'decide').length, 1);
    f.advance(30000); await f.step(); assert.equal(f.calls.filter(call => call.kind === 'decide').length, 2);
  } finally { await f.close(); }
});

test('three consecutive planner failures pause; owner Resume resets failure streak without replay', async () => {
  let fail = true;
  const f = await fixture({ decide: () => { if (fail) throw new Error('Provider unavailable'); return act('human:nova'); } });
  try {
    await f.assign();
    for (let i = 1; i <= 3; i++) { const result = await f.step(); assert.equal(result.failures, i);
      assert.equal(result.status, i === 3 ? 'paused' : 'ready'); f.advance(30000); }
    const goal = await f.controller.get('agent'); fail = false;
    await f.controller.resume({ agentId: 'agent', goalId: goal.goalId, expectedRevision: goal.revision });
    assert.equal((await f.step()).status, 'acting'); assert.equal(f.pending.length, 1);
  } finally { await f.close(); }
});

test('step and elapsed budgets survive Resume and prevent unbounded model loops', async () => {
  const f = await fixture({ decide: () => ({ decision: 'wait', reason: 'Wait for the target.' }) });
  try {
    await f.assign(); for (let i = 0; i < 8; i++) { await f.step(); f.advance(30000); }
    const paused = await f.step(); assert.equal(paused.status, 'paused'); assert.equal(paused.steps, 8);
    const resumed = await f.controller.resume({ agentId: 'agent', goalId: paused.goalId, expectedRevision: paused.revision });
    assert.equal(resumed.status, 'paused'); assert.equal(resumed.steps, 8);
  } finally { await f.close(); }
  const g = await fixture();
  try { await g.assign(); await g.step(); g.advance(600000); await g.step();
    assert.equal((await g.controller.get('agent')).status, 'paused'); assert.equal(g.calls.filter(call => call.kind === 'stop').length, 1);
  } finally { await g.close(); }
});

test('restore retains progress and pending evidence but never runs without explicit owner Resume', async () => {
  const f = await fixture();
  try {
    await f.assign(); await f.step();
    const original = await f.controller.get('agent');
    const second = createWorldGoalController({ ...f.options, dispatch() { throw new Error('Must not replay'); } });
    try {
      await second.ready; await second.tick(); const restored = await second.get('agent');
      assert.equal(restored.status, 'paused'); assert.equal(restored.pendingAction.requestId, original.pendingAction.requestId);
      assert.equal(restored.steps, original.steps); assert.equal(restored.deadlineAt, original.deadlineAt);
    } finally { await second.dispose(); }
  } finally { await f.close(); }
});

test('write failures before an action prevent dispatch and retain visible explicit recovery', async () => {
  const f = await fixture();
  const original = f.store.commit.bind(f.store); let reject = true;
  f.store.commit = (scope, change, options) => {
    if (reject && change.patch.status === 'acting') throw new Error('Disk full');
    return original(scope, change, options);
  };
  try {
    await f.assign(); await f.step(); assert.equal(f.pending.length, 0);
    // A failed planning-to-action write can itself be durably recorded as a
    // failed attempt; either way, no physical side effect precedes its checkpoint.
    assert.ok(['ready', 'paused'].includes((await f.controller.get('agent')).status));
    reject = false; f.advance(30000); assert.equal((await f.step()).status, 'acting');
  } finally { reject = false; await f.close(); }
});

test('unacknowledged action dispatch stops only its request and requires owner reconciliation', async () => {
  const f = await fixture({ dispatch: () => { throw new Error('Lost physical acknowledgement'); } });
  try { await f.assign(); const result = await f.step(); assert.equal(result.status, 'paused');
    assert.equal(f.calls.find(call => call.kind === 'stop').input.requestId, f.pending[0].requestId);
    assert.equal(result.pendingAction, null);
  } finally { await f.close(); }
});

test('failed dispatch cleanup notifies paused recovery without requiring a subsequent UI read', async () => {
  let reject = true;
  const f = await fixture({ dispatch: () => { throw new Error('Lost physical acknowledgement'); },
    stop: () => { if (reject) throw new Error('Motor cleanup failed'); return true; } });
  try {
    await f.assign(); await f.controller.tick(); await f.idle();
    assert.equal(f.changes.at(-1).status, 'paused');
    assert.equal(f.changes.at(-1).recoveryRequired, true);
    assert.equal(f.changes.at(-1).pendingAction.requestId, f.pending[0].requestId);
    assert.deepEqual(f.controller.getStatus().unresolved, ['agent']);
  } finally { reject = false; await f.close(); }
});

test('stale owner controls and replacing a paused active objective are rejected', async () => {
  const f = await fixture();
  try { const assigned = await f.assign(); await f.step();
    await assert.rejects(f.controller.pause({ agentId: 'agent', goalId: assigned.goalId, expectedRevision: assigned.revision }), { code: 'ERR_WORLD_GOAL_REVISION' });
    await assert.rejects(f.assign(), /current objective/);
    const current = await f.controller.get('agent'); await f.controller.cancel({ agentId: 'agent', goalId: current.goalId, expectedRevision: current.revision });
    assert.equal((await f.assign()).status, 'ready');
  } finally { await f.close(); }
});

test('unknown planner outcomes preserve the pending attempt and explicit Resume charges it once', async () => {
  let unknown = true;
  const f = await fixture({ decide: () => { if (unknown) throw Object.assign(new Error('Remote outcome unknown'), { committed: true }); return act('human:nova'); } });
  try {
    await f.assign(); const paused = await f.step();
    assert.equal(paused.status, 'paused'); assert.ok(paused.pendingDecision); assert.equal(paused.steps, 0);
    unknown = false;
    const resumed = await f.controller.resume({ agentId: 'agent', goalId: paused.goalId, expectedRevision: paused.revision });
    assert.equal(resumed.steps, 1); assert.equal(resumed.pendingDecision, null);
    assert.equal((await f.step()).steps, 2); assert.equal(f.pending.length, 1);
  } finally { await f.close(); }
});

test('persistent storage failures quarantine planning; owner recovery acknowledges saved state before fresh work', async () => {
  const f = await fixture(); const original = f.store.commit.bind(f.store); let fail = false;
  f.store.commit = (scope, change, options) => {
    if (fail && change.patch.status !== 'planning') throw new Error('Disk unavailable');
    if (change.patch.status === 'planning') fail = true;
    return original(scope, change, options);
  };
  try {
    await f.assign(); const paused = await f.step();
    assert.equal(paused.status, 'paused'); assert.equal(paused.recoveryRequired, true); assert.equal(f.pending.length, 0);
    assert.deepEqual(f.controller.getStatus().unresolved, ['agent']);
    f.store.commit = original;
    await f.controller.resume({ agentId: 'agent', goalId: paused.goalId, expectedRevision: paused.revision });
    assert.equal((await f.step()).status, 'acting'); assert.equal(f.pending.length, 1);
  } finally { f.store.commit = original; await f.close(); }
});

test('failed receipt persistence stops its physical effect and leaves recovery visible', async () => {
  const f = await fixture(); const original = f.store.commit.bind(f.store);
  try {
    await f.assign(); await f.step();
    f.store.commit = (scope, change, options) => {
      if (change.patch.lastReceipt) throw new Error('Disk unavailable'); return original(scope, change, options);
    };
    await assert.rejects(f.receipt(), /Disk unavailable/);
    assert.equal(f.calls.filter(call => call.kind === 'stop').length, 1);
    const paused = await f.controller.get('agent'); assert.equal(paused.status, 'paused'); assert.equal(paused.recoveryRequired, true);
    f.store.commit = original;
    await f.controller.resume({ agentId: 'agent', goalId: paused.goalId, expectedRevision: paused.revision });
    assert.equal((await f.controller.get('agent')).status, 'ready');
  } finally { f.store.commit = original; await f.close(); }
});

test('external pause fences a delayed planner and late physical receipt from automatic continuation', async () => {
  const gate = deferred(), entered = deferred();
  const f = await fixture({ decide: async () => { entered.resolve(); return gate.promise; } });
  try {
    await f.assign(); await f.controller.tick(); await entered.promise;
    const saved = await f.store.get({ worldId: 'world', agentId: 'agent' });
    await f.store.commit({ worldId: 'world', agentId: 'agent' }, { goalId: saved.goalId, expectedRevision: saved.revision,
      patch: { status: 'paused', reason: 'Another owner control paused this objective.' } });
    gate.resolve(act('human:nova')); await f.idle();
    assert.equal(f.pending.length, 0); assert.equal((await f.controller.get('agent')).status, 'paused');
  } finally { gate.resolve(act('human:nova')); await f.close(); }
  const g = await fixture();
  try {
    await g.assign(); await g.step();
    const saved = await g.store.get({ worldId: 'world', agentId: 'agent' });
    await g.store.commit({ worldId: 'world', agentId: 'agent' }, { goalId: saved.goalId, expectedRevision: saved.revision,
      patch: { status: 'paused', reason: 'Restored.' } });
    assert.equal(await g.receipt(), false); assert.equal((await g.controller.get('agent')).status, 'paused');
  } finally { await g.close(); }
});

test('consecutive physical failures count toward the bounded failure streak', async () => {
  const f = await fixture();
  try {
    await f.assign();
    for (let i = 1; i <= 3; i++) { await f.step(); await f.receipt('failed');
      const current = await f.controller.get('agent'); assert.equal(current.failures, i);
      assert.equal(current.status, i === 3 ? 'paused' : 'ready'); }
  } finally { await f.close(); }
});

test('a second tab without the body lease cannot pause, read or mutate owner objectives; later adoption pauses without replay', async () => {
  const f = await fixture(); let ownsSecond = false;
  try {
    await f.assign(); await f.step();
    const before = await f.store.get({ worldId: 'world', agentId: 'agent' });
    const second = createWorldGoalController({ ...f.options, owns: () => ownsSecond });
    try {
      await second.ready; await second.tick();
      assert.deepEqual(await f.store.get({ worldId: 'world', agentId: 'agent' }), before);
      await assert.rejects(second.get('agent'), { code: 'ERR_WORLD_GOAL_OWNERSHIP' });
      await assert.rejects(second.pause({ agentId: 'agent', goalId: before.goalId, expectedRevision: before.revision }), { code: 'ERR_WORLD_GOAL_OWNERSHIP' });
      assert.equal(second.list().length, 0);
      ownsSecond = true; await second.syncOwnership();
      const adopted = await second.get('agent');
      assert.equal(adopted.status, 'paused'); assert.equal(adopted.pendingAction.requestId, before.pendingAction.requestId);
      await second.tick(); assert.equal(f.pending.length, 1);
      ownsSecond = false; await second.syncOwnership();
      const foreign = await f.store.get({ worldId: 'world', agentId: 'agent' });
      await second.dispose();
      assert.deepEqual(await f.store.get({ worldId: 'world', agentId: 'agent' }), foreign);
    } finally { ownsSecond = false; await second.dispose(); }
  } finally { await f.close(); }
});

test('losing ownership aborts a pending planner without committing into the new owner checkpoint', async () => {
  const f = await fixture(); let owned = true;
  const gate = deferred(), entered = deferred();
  const controller = createWorldGoalController({ ...f.options, owns: () => owned,
    decide: async (_scope, { signal }) => { entered.resolve(); return new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true }); gate.promise.then(resolve);
    }); } });
  try {
    await controller.ready; await controller.assign({ agentId: 'agent', objective: 'Visit Nova.', requesterId: 'human:owner' });
    await controller.tick(); await entered.promise;
    const before = await f.store.get({ worldId: 'world', agentId: 'agent' });
    owned = false; await controller.syncOwnership();
    for (let i = 0; i < 30 && controller.getStatus().active; i++) await new Promise(resolve => setImmediate(resolve));
    assert.equal(controller.getStatus().active, null); assert.equal(f.pending.length, 0);
    assert.deepEqual(await f.store.get({ worldId: 'world', agentId: 'agent' }), before);
    await controller.dispose(); assert.deepEqual(await f.store.get({ worldId: 'world', agentId: 'agent' }), before);
  } finally { gate.resolve(act('human:nova')); await controller.dispose(); await f.close(); }
});

test('a manual command replacing an arrived action during cleanup pauses the objective', async () => {
  const f = await fixture({ stop: () => false });
  try {
    await f.assign(); await f.step(); await f.receipt();
    const result = await f.controller.get('agent');
    assert.equal(result.lastReceipt.status, 'arrived'); assert.equal(result.status, 'paused');
    assert.match(result.reason, /newer movement command/);
    await f.step(); assert.equal(f.pending.length, 1);
  } finally { await f.close(); }
});

test('failed physical cleanup remains owned for Cancel and disposal retry', async () => {
  let reject = true;
  const f = await fixture({ stop: () => { if (reject) throw new Error('Motor cleanup failed'); return true; } });
  try {
    await f.assign(); await f.step(); await assert.rejects(f.receipt(), /Motor cleanup failed/);
    const paused = await f.controller.get('agent'); assert.equal(paused.recoveryRequired, true); assert.equal(paused.pendingAction, null);
    reject = false;
    await f.controller.cancel({ agentId: 'agent', goalId: paused.goalId, expectedRevision: paused.revision });
    assert.equal((await f.controller.get('agent')).status, 'cancelled');
    assert.deepEqual(f.controller.getStatus().unresolved, []);
    await f.assign(); await f.step(); reject = true;
    await assert.rejects(f.controller.dispose(), /Motor cleanup failed/);
    reject = false; await f.controller.dispose();
    assert.equal((await f.store.get({ worldId: 'world', agentId: 'agent' })).status, 'paused');
  } finally { reject = false; await f.close(); }
});
