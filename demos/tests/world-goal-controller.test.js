import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { WorldGoalStore } from '../../peercompute/src/peercompute/agents/WorldGoalStore.js';
import { createWorldGoalController } from '../shared/agents/WorldGoalController.js';

const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const act = targetId => ({ decision: 'act', intent: { type: 'approach', targetId }, reason: `Visit ${targetId}` });
const plan = () => ({ decision: 'plan', milestones: [
  { label: 'Visit Nova', type: 'approach', targetId: 'human:nova' },
  { label: 'Return to owner', type: 'approach', targetRole: 'requester' }] });
async function fixture({ decide, dispatch, stop, observe, planFirst = true, canRun = () => true, indexedDB = new IDBFactory(), name = crypto.randomUUID() } = {}) {
  let clock = 1000, sensed = 0, seedingPlan = false;
  const store = new WorldGoalStore({ name, hostId: 'owner-host', indexedDBImpl: indexedDB, now: () => clock }); await store.open();
  const calls = [], changes = [], pending = [], timers = new Map(); let timerId = 0;
  const options = { store, worldId: 'world', owns: () => true, now: () => clock,
    setTimer(fn, ms) { const id = ++timerId; timers.set(id, { fn, ms }); return id; }, clearTimer(id) { timers.delete(id); },
    canRun, onChange: goal => changes.push(goal),
    observe: (scope, input) => {
      const { goal } = input;
      const current = { observedAt: clock, self: { id: 'resident:owner:agent', intentRevision: 0,
      name: 'Resident', position: [0, 0, 0], velocity: [0, 0, 0] }, requesterId: goal.requesterId,
    participants: ['human:nova', 'human:owner'].map(id => ({ id, kind: 'human', name: id,
      peerId: id.slice(6), position: [10, 0, 0], relativePosition: [10, 0, 0], velocity: [0, 0, 0], distance: 10 })),
      obstacles: [], readSequence: ++sensed };
      return observe?.(scope, input, current) ?? current;
    },
    async decide(scope, input) { calls.push({ kind: 'decide', scope, input: structuredClone({ ...input, signal: undefined }) });
      if (seedingPlan) return plan();
      return decide ? decide(scope, input) : !input.goal.plan ? plan()
        : act(input.goal.completedMilestones.length ? input.goal.requesterId : 'human:nova'); },
    async dispatch(scope, input, options) {
      const saved = await store.get(scope);
      assert.equal(saved.status, 'acting'); assert.equal(saved.pendingAction.requestId, input.requestId);
      calls.push({ kind: 'dispatch', scope, input }); pending.push(input);
      return dispatch?.(scope, input, options) ?? { applied: true };
    },
    async stop(scope, input) { calls.push({ kind: 'stop', scope, input }); return stop?.(scope, input); },
  };
  const controller = createWorldGoalController(options); await controller.ready;
  // Most lifecycle cases begin after a real acknowledged fixture-model plan.
  // Plan-stage cases opt out and inspect that first decision explicitly.
  const assign = async (input = {}) => {
    const assigned = await controller.assign({ agentId: 'agent', objective: 'Visit Nova, then return to me.', requesterId: 'human:owner', ...input });
    if (planFirst) { seedingPlan = true; try { await step(); } finally { seedingPlan = false; } }
    return assigned;
  };
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
      targetId: action.intent.targetId, ...(action.intent.position ? { targetPosition: action.intent.position } : {}),
      status, position: action.intent.position ?? [10, 0, 0], ...override });
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
    assert.equal(result.status, 'completed'); assert.equal(result.steps, 4); assert.equal(result.receipts.length, 2);
    assert.deepEqual(result.completedMilestones.map(item => item.requestId), result.receipts.map(item => item.requestId));
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
    const result = await g.controller.get('agent'); assert.equal(result.status, 'ready'); assert.equal(result.failures, 0); assert.equal(result.steps, 2);
    waiting.resolve(act('human:nova')); await g.step(); assert.equal(g.pending.length, 0);
  } finally { waiting.resolve(act('human:nova')); await g.close(); }
});

test('absent providers wait without spending steps or automatically loading models', async () => {
  const f = await fixture({ planFirst: false, decide: () => ({ status: 'waiting-for-model' }) });
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
    assert.equal(paused.status, 'paused'); assert.ok(paused.pendingDecision); assert.equal(paused.steps, 1);
    unknown = false;
    const resumed = await f.controller.resume({ agentId: 'agent', goalId: paused.goalId, expectedRevision: paused.revision });
    assert.equal(resumed.steps, 2); assert.equal(resumed.pendingDecision, null);
    assert.equal((await f.step()).steps, 3); assert.equal(f.pending.length, 1);
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
    assert.equal((await f.step()).plan.milestones.length, 2);
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

test('initial model plan is acknowledged and charged once without dispatching an itinerary', async () => {
  const f = await fixture({ planFirst: false });
  try {
    await f.assign(); const planned = await f.step();
    assert.equal(planned.status, 'ready'); assert.equal(planned.steps, 1);
    assert.deepEqual(planned.plan, { version: 1, milestones: plan().milestones });
    assert.deepEqual(planned.completedMilestones, []); assert.equal(planned.pendingAction, null);
    assert.equal(f.pending.length, 0); assert.equal(f.calls.filter(call => call.kind === 'decide').length, 1);
    const issued = await f.step();
    assert.equal(issued.pendingAction.milestoneIndex, 0); assert.equal(issued.steps, 2);
    assert.equal(f.pending.length, 1); assert.equal(f.calls.filter(call => call.kind === 'decide').length, 2);
  } finally { await f.close(); }
});

test('wrong active target or type and premature completion cannot create an action checkpoint or effect', async () => {
  let answer = act('human:owner');
  const f = await fixture({ decide: () => answer });
  try {
    await f.assign(); const wrongTarget = await f.step();
    assert.equal(wrongTarget.failures, 1); assert.equal(wrongTarget.pendingAction, null); assert.equal(f.pending.length, 0);
    answer = { decision: 'act', intent: { type: 'look-at', targetId: 'human:nova' } };
    f.advance(30000); assert.equal((await f.step()).failures, 2); assert.equal(f.pending.length, 0);
    answer = act('human:nova'); f.advance(30000); await f.step(); await f.receipt();
    const partial = await f.controller.get('agent');
    assert.equal(partial.completedMilestones.length, 1);
    answer = { decision: 'done', assessment: 'Only the first visit is recorded.', receiptIds: partial.receipts.map(item => item.requestId) };
    const rejected = await f.step();
    assert.equal(rejected.status, 'ready'); assert.equal(rejected.failures, 1); assert.equal(rejected.modelAssessment, '');
    assert.equal(f.pending.length, 1); assert.equal(rejected.completedMilestones.length, 1);
  } finally { await f.close(); }
});

test('blocked and lost effects keep the same milestone for model wait or retry without false progress', async () => {
  let wait = false;
  const f = await fixture({ decide: () => wait ? { decision: 'wait', reason: 'Wait for a clear path to Nova.' } : act('human:nova') });
  try {
    await f.assign(); await f.step(); const first = f.pending[0].requestId;
    await f.receipt('blocked');
    assert.deepEqual((await f.controller.get('agent')).completedMilestones, []);
    wait = true; const waiting = await f.step();
    assert.equal(waiting.currentStep, 'Wait for a clear path to Nova.'); assert.equal(f.pending.length, 1);
    wait = false; f.advance(30000); const retry = await f.step();
    assert.equal(retry.pendingAction.milestoneIndex, 0); assert.notEqual(retry.pendingAction.requestId, first);
    await f.receipt('target-lost'); assert.deepEqual((await f.controller.get('agent')).completedMilestones, []);
    await f.step(); const successful = (await f.controller.get('agent')).pendingAction.requestId;
    await f.receipt(); const progressed = await f.controller.get('agent');
    assert.deepEqual(progressed.completedMilestones, [{ index: 0, requestId: successful }]);
    assert.deepEqual(progressed.receipts.map(item => item.status), ['blocked', 'target-lost', 'arrived']);
  } finally { await f.close(); }
});

test('fresh observation loss or a newer physical revision rejects a selected action before dispatch', async () => {
  for (const changed of ['target', 'revision']) {
    const f = await fixture({ observe(_scope, _input, current) {
      if (current.readSequence === 4) {
        if (changed === 'target') current.participants = current.participants.filter(item => item.id !== 'human:nova');
        else current.self.intentRevision++;
      }
      return current;
    } });
    try {
      await f.assign(); const result = await f.step();
      assert.equal(result.failures, 1); assert.equal(result.pendingAction, null); assert.equal(f.pending.length, 0);
      assert.deepEqual(result.completedMilestones, []);
    } finally { await f.close(); }
  }
});

test('three-step look, approach and stop milestones require separate exact receipt evidence and final model assessment', async () => {
  const chosen = [{ label: 'Face owner', type: 'look-at', targetRole: 'requester' },
    { label: 'Visit Nova', type: 'approach', targetId: 'human:nova' }, { label: 'Stop', type: 'stop' }];
  const f = await fixture({ planFirst: false, decide(_scope, { goal }) {
    if (!goal.plan) return { decision: 'plan', milestones: chosen };
    const next = chosen[goal.completedMilestones.length];
    if (!next) return { decision: 'done', assessment: 'Facing, visit and stop all have exact evidence.',
      receiptIds: goal.completedMilestones.map(item => item.requestId) };
    return { decision: 'act', intent: { type: next.type,
      ...(next.type !== 'stop' ? { targetId: next.targetRole ? goal.requesterId : next.targetId } : {}) } };
  } });
  try {
    await f.assign(); await f.step();
    for (const [index, status] of ['arrived', 'arrived', 'stopped'].entries()) {
      const issued = await f.step(); assert.equal(issued.pendingAction.milestoneIndex, index);
      assert.equal(await f.receipt(status, { type: index === 2 ? 'approach' : 'stop' }), false);
      await f.receipt(status);
      const settled = await f.controller.get('agent'); assert.equal(settled.status, 'ready');
      assert.equal(settled.completedMilestones.length, index + 1);
    }
    const result = await f.step(); assert.equal(result.status, 'completed'); assert.equal(result.steps, 5);
    assert.equal(new Set(result.completedMilestones.map(item => item.requestId)).size, 3);
  } finally { await f.close(); }
});

test('restore and explicit requester refresh continue an unfinished milestone without replaying completed or pending effects', async () => {
  const f = await fixture(); let second;
  try {
    await f.assign(); await f.step(); await f.receipt(); await f.step();
    const before = await f.controller.get('agent'), original = before.pendingAction.requestId;
    const decisions = [], dispatches = [];
    second = createWorldGoalController({ ...f.options,
      observe(scope, input) { const current = f.options.observe(scope, input);
        current.participants.push({ ...current.participants[1], id: 'human:reconnected' }); return current; },
      decide(_scope, { goal }) { decisions.push(structuredClone(goal)); return act(goal.requesterId); },
      dispatch(_scope, action) { dispatches.push(action); return { applied: true }; } });
    await second.ready; await second.tick(); const restored = await second.get('agent');
    assert.equal(restored.status, 'paused'); assert.equal(restored.pendingAction.requestId, original);
    assert.deepEqual(restored.plan, before.plan); assert.deepEqual(restored.completedMilestones, before.completedMilestones);
    assert.equal(dispatches.length, 0); assert.equal(decisions.length, 0);
    await second.resume({ agentId: 'agent', goalId: restored.goalId, expectedRevision: restored.revision, requesterId: 'human:reconnected' });
    await second.tick();
    for (let i = 0; i < 100 && second.getStatus().active; i++) await new Promise(resolve => setImmediate(resolve));
    const resumed = await second.get('agent');
    assert.equal(resumed.status, 'acting'); assert.equal(resumed.pendingAction.milestoneIndex, 1);
    assert.notEqual(resumed.pendingAction.requestId, original); assert.equal(dispatches.length, 1);
    assert.equal(dispatches[0].intent.targetId, 'human:reconnected');
    assert.deepEqual(resumed.completedMilestones, before.completedMilestones); assert.deepEqual(resumed.plan, before.plan);
    assert.equal(decisions.length, 1); assert.equal(decisions[0].plan.milestones[1].targetRole, 'requester');
  } finally { await second?.dispose(); await f.close(); }
});

test('plan construction plus six actions and final assessment exactly exhaust the unchanged eight-decision budget', async () => {
  const chosen = Array.from({ length: 6 }, (_, index) => ({ label: `Look ${index + 1}`, type: 'look-at', targetRole: 'requester' }));
  const f = await fixture({ planFirst: false, decide(_scope, { goal }) {
    if (!goal.plan) return { decision: 'plan', milestones: chosen };
    return goal.completedMilestones.length < 6 ? { decision: 'act', intent: { type: 'look-at', targetId: goal.requesterId } }
      : { decision: 'done', assessment: 'All six requested looks have distinct receipts.',
        receiptIds: goal.completedMilestones.map(item => item.requestId) };
  } });
  try {
    await f.assign(); await f.step();
    for (let i = 0; i < 6; i++) { await f.step(); await f.receipt(); }
    const result = await f.step(); assert.equal(result.status, 'completed'); assert.equal(result.steps, 8);
    assert.equal(result.completedMilestones.length, 6); assert.equal(f.pending.length, 6);
  } finally { await f.close(); }
});

async function spatialFixture({ origin = [4, 2, 6], ...options } = {}) {
  let position = [...origin], locations = [{ id: 'east-far', name: 'East far clear ground', position: [origin[0] + 96, origin[1], origin[2]] }];
  const f = await fixture({ planFirst: false,
    observe(_scope, _input, current) {
      current.self.position = [...position]; current.locations = structuredClone(locations);
      current.spatial = { frame: 'planar-xz', bounds: { min: [-250, -250], max: [250, 250] }, maximumLegDistance: 160 };
      return current;
    },
    decide(_scope, { goal, observed }) {
      if (!goal.plan) return { decision: 'plan', milestones: [
        { label: 'Go far away', type: 'move-to', position: observed.locations[0].position },
        { label: 'Return here', type: 'move-to', position: goal.originPosition }] };
      const next = goal.plan.milestones[goal.completedMilestones.length];
      return next ? { decision: 'act', intent: { type: 'move-to', position: next.position } }
        : { decision: 'done', assessment: 'Both fixed destinations have physical arrival evidence.',
          receiptIds: goal.completedMilestones.map(item => item.requestId) };
    }, ...options });
  return { ...f, place(value) { position = [...value]; }, replaceLocations(value) { locations = structuredClone(value); } };
}

test('fixed-point tasks capture origin before planning and advance only from exact physical arrival receipts', async () => {
  const f = await spatialFixture();
  try {
    const assigned = await f.assign({ objective: 'Go far away and then return here.' });
    assert.deepEqual(assigned.originPosition, [4, 2, 6]); assert.equal(assigned.plan, null);
    const planned = await f.step(); assert.deepEqual(planned.plan.milestones[1].position, assigned.originPosition);
    await f.step(); const leaving = f.pending[0];
    assert.deepEqual(leaving.authorizedPositions, [[100, 2, 6]]);
    assert.equal(await f.receipt('arrived', { targetPosition: [101, 2, 6] }), false);
    assert.equal(await f.receipt('arrived', { position: [4, 2, 6] }), false);
    assert.equal(await f.receipt('arrived', { position: [NaN, 2, 6] }), false);
    assert.deepEqual((await f.controller.get('agent')).completedMilestones, []);
    f.place([100, 4, 6]); f.replaceLocations([]);
    assert.equal(await f.receipt('arrived', { position: [100, 4, 6] }), true);
    const returning = await f.step();
    assert.deepEqual(returning.pendingAction.intent.position, [4, 2, 6]);
    assert.deepEqual(f.pending[1].authorizedPositions, [[4, 2, 6]]);
    assert.equal(await f.receipt('arrived', { targetPosition: [100, 2, 6] }), false);
    f.place([4, 2, 6]); await f.receipt();
    const finished = await f.step(); assert.equal(finished.status, 'completed');
    assert.deepEqual(finished.receipts.map(item => item.targetPosition), [[100, 2, 6], [4, 2, 6]]);
    assert.equal(finished.completedMilestones.length, 2); assert.equal(finished.steps, 4);
  } finally { await f.close(); }
});

test('explicit new task skips an old chat cooldown but a later conversation still yields its execution', async () => {
  const f = await spatialFixture();
  try {
    await f.controller.interrupt({ agentId: 'agent' });
    await f.assign(); await f.step();
    assert.equal((await f.step()).status, 'acting'); assert.equal(f.pending.length, 1);
    await f.controller.interrupt({ agentId: 'agent' });
    f.place([100, 2, 6]); await f.receipt();
    await f.step(); assert.equal(f.pending.length, 1, 'A later chat retains its cooldown');
    f.advance(30000); assert.equal((await f.step()).status, 'acting'); assert.equal(f.pending.length, 2);
  } finally { await f.close(); }
});

test('point-task reload preserves origin and verified progress while requiring explicit resume with a fresh request', async () => {
  const f = await spatialFixture(); let second;
  try {
    await f.assign(); await f.step(); await f.step(); f.place([100, 2, 6]); await f.receipt(); await f.step();
    const before = await f.controller.get('agent'), dispatches = [];
    f.replaceLocations([]);
    second = createWorldGoalController({ ...f.options, dispatch(_scope, input) { dispatches.push(input); return { applied: true }; } });
    await second.ready; await second.tick();
    const restored = await second.get('agent');
    assert.equal(restored.status, 'paused'); assert.equal(dispatches.length, 0);
    assert.deepEqual(restored.originPosition, [4, 2, 6]); assert.deepEqual(restored.completedMilestones, before.completedMilestones);
    await second.resume({ agentId: 'agent', goalId: restored.goalId, expectedRevision: restored.revision, requesterId: 'human:reconnected' });
    await second.tick();
    for (let i = 0; i < 100 && second.getStatus().active; i++) await new Promise(resolve => setImmediate(resolve));
    const resumed = await second.get('agent');
    assert.equal(resumed.status, 'acting'); assert.equal(resumed.pendingAction.milestoneIndex, 1);
    assert.notEqual(resumed.pendingAction.requestId, before.pendingAction.requestId);
    assert.equal(dispatches.length, 1); assert.deepEqual(dispatches[0].intent.position, [4, 2, 6]);
    assert.deepEqual(resumed.originPosition, before.originPosition); assert.deepEqual(resumed.plan, before.plan);
    await second.cancel({ agentId: 'agent', goalId: resumed.goalId, expectedRevision: resumed.revision });
    assert.equal(await second.receiveReceipt({ agentId: 'agent' }, { requestId: resumed.pendingAction.requestId,
      type: 'move-to', targetPosition: [4, 2, 6], position: [4, 2, 6], status: 'arrived' }), false);
    assert.equal((await second.get('agent')).status, 'cancelled');
  } finally { await second?.dispose(); await f.close(); }
});

test('cancelled or stale task admission does not create a durable objective or return anchor', async () => {
  const aborted = new AbortController(); aborted.abort();
  const f = await fixture({ planFirst: false });
  try {
    await assert.rejects(f.assign({ signal: aborted.signal }), { name: 'AbortError' });
    assert.equal(await f.store.get({ agentId: 'agent', worldId: 'world' }), undefined);
  } finally { await f.close(); }
  const stale = await fixture({ planFirst: false, observe(_scope, _input, current) { current.observedAt -= 121000; return current; } });
  try {
    await assert.rejects(stale.assign(), /stale/);
    assert.equal(await stale.store.get({ agentId: 'agent', worldId: 'world' }), undefined);
  } finally { await stale.close(); }
});

test('admission abort during the origin write rolls it back and abort before resume leaves an inert checkpoint', async () => {
  const f = await fixture({ planFirst: false }), controller = new AbortController();
  const assign = f.store.assign.bind(f.store);
  f.store.assign = (input, options) => { const pending = assign(input, options); controller.abort(); return pending; };
  try {
    await assert.rejects(f.assign({ signal: controller.signal }), { name: 'AbortError' });
    assert.equal(await f.store.get({ agentId: 'agent', worldId: 'world' }), undefined);
    await f.step(); assert.equal(f.pending.length, 0);
  } finally { f.store.assign = assign; await f.close(); }

  const g = await fixture({ planFirst: false }), cancellation = new AbortController(), waiting = deferred(), entered = deferred();
  const originalAssign = g.store.assign.bind(g.store), get = g.store.get.bind(g.store); let assigned = false;
  g.store.assign = async (...args) => { const value = await originalAssign(...args); assigned = true; return value; };
  g.store.get = async (scope, options) => {
    if (assigned && options?.signal) { entered.resolve(); await waiting.promise; }
    return get(scope, options);
  };
  try {
    const admission = g.assign({ signal: cancellation.signal });
    await entered.promise; cancellation.abort(); waiting.resolve();
    await assert.rejects(admission, { name: 'AbortError' });
    const saved = await get({ agentId: 'agent', worldId: 'world' });
    assert.equal(saved.status, 'paused'); assert.equal(saved.startedAt, null); assert.equal(saved.plan, null);
    await g.step(); assert.equal(g.pending.length, 0);
  } finally { waiting.resolve(); g.store.assign = originalAssign; g.store.get = get; await g.close(); }
});

test('resident revision changes during admission cannot activate a task from stale chat authority', async () => {
  for (const changedAt of [1, 2]) {
    const f = await fixture({ planFirst: false, observe(_scope, _input, current) {
      current.residentRevision = current.readSequence >= changedAt ? 43 : 42; return current;
    } });
    try {
      await assert.rejects(f.assign({ expectedResidentRevision: 42 }), { code: 'ERR_WORLD_GOAL_ADMISSION_REVISION' });
      const saved = await f.store.get({ agentId: 'agent', worldId: 'world' });
      if (changedAt === 1) assert.equal(saved, undefined);
      else { assert.equal(saved.status, 'paused'); assert.equal(saved.startedAt, null); }
      await f.step(); assert.equal(f.pending.length, 0);
    } finally { await f.close(); }
  }
});
