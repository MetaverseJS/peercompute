import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { WorldGoalStore, WORLD_GOAL_LIMITS } from '../../src/peercompute/agents/WorldGoalStore.js';
import { activeWorldGoalMilestone, worldGoalMilestonesComplete } from '../../src/peercompute/agents/WorldGoalPlan.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

const scope = { worldId: 'cubechat:room', agentId: 'ada' };
const assignment = { ...scope, objective: 'Visit Nova, then return to me.', requesterId: 'owner-peer' };
const scopeOf = record => ({ worldId: record.worldId, agentId: record.agentId });
const change = (store, record, patch, event, options) => store.commit(scopeOf(record), {
  goalId: record.goalId, expectedRevision: record.revision, patch, ...(event ? { event } : {}) }, options);
const start = (store, record) => change(store, record, { status: 'ready', startedAt: 100000, deadlineAt: 700000 });
const decision = (store, record, id = 'decision-1') => change(store, record, { status: 'planning', pendingDecision: { id, startedAt: 100000 } });
const planOf = (...milestones) => ({ version: 1, milestones });
const visit = { label: 'Visit Nova', type: 'approach', targetId: 'nova' };
const planned = async (store, record, plan = planOf(visit)) => change(store, await decision(store, record, 'plan-decision'), {
  status: 'ready', pendingDecision: null, plan, steps: record.steps + 1 });
const action = (store, record, id = 'action-1') => change(store, record, { status: 'acting', pendingDecision: null,
  steps: record.steps + 1, pendingAction: { requestId: id, intent: { ...activeWorldGoalMilestone(record).intent,
    ...(activeWorldGoalMilestone(record).intent.type !== 'stop' ? { stopDistance: 10 } : {}) },
    milestoneIndex: activeWorldGoalMilestone(record).index, issuedAt: 100000, observationAt: 99999 } });
const outcome = (id = 'action-1', extra = {}) => ({ requestId: id, type: 'approach', status: 'arrived', at: 100000, targetId: 'nova', position: [10, 3, 4], ...extra });
async function fixture(t, options = {}) {
  const indexedDBImpl = options.indexedDBImpl ?? new IDBFactory();
  const store = new WorldGoalStore({ hostId: 'host-a', indexedDBImpl, now: () => 100000, ...options });
  await store.open(); t.after(() => store.close()); return { store, indexedDBImpl };
}
async function seedLegacy(store, record) {
  const legacy = structuredClone(record); delete legacy.plan; delete legacy.completedMilestones;
  if (legacy.pendingAction) delete legacy.pendingAction.milestoneIndex;
  await new Promise((resolve, reject) => {
    const transaction = store.database.transaction('goals', 'readwrite');
    transaction.oncomplete = resolve; transaction.onabort = () => reject(transaction.error);
    transaction.objectStore('goals').put({ key: JSON.stringify([legacy.worldId, legacy.agentId]), record: legacy });
  });
  return legacy;
}

test('private paused goals survive reopen without replay, stay scoped, and return detached records', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const first = await store.assign(assignment);
  assert.equal(first.status, 'paused'); assert.equal(first.startedAt, null); assert.equal(first.pendingAction, null);
  assert.deepEqual(first.limits, WORLD_GOAL_LIMITS); assert.deepEqual(first.receipts, []);
  assert.equal(first.plan, null); assert.deepEqual(first.completedMilestones, []);
  first.objective = 'Changed only in caller'; assert.equal((await store.get(scope)).objective, assignment.objective);
  const other = await store.assign({ ...assignment, worldId: 'earth:elsewhere' });
  await store.assign({ ...assignment, agentId: 'nova' });
  assert.equal((await store.list()).length, 3); assert.equal((await store.list({ worldId: scope.worldId })).length, 2);
  await store.close(); const { store: reopened } = await fixture(t, { indexedDBImpl });
  assert.equal((await reopened.get(scope)).status, 'paused'); assert.equal((await reopened.get(scopeOf(other))).goalId, other.goalId);
});

test('database owner binding blocks foreign handles and owner identity cannot be mutated', async t => {
  const { store, indexedDBImpl } = await fixture(t); const first = await store.assign(assignment);
  const foreign = new WorldGoalStore({ hostId: 'host-b', indexedDBImpl }); t.after(() => foreign.close());
  await assert.rejects(foreign.open(), /another host/); await assert.rejects(foreign.get(scope), /not open/);
  assert.throws(() => { store.hostId = 'host-b'; }, TypeError);
  for (const patch of [{ ownerHostId: 'host-b' }, { objective: 'Changed' }, { goalId: 'elsewhere' }, { limits: { maxSteps: 99 } },
    { receipts: [] }, { completedMilestones: [] }]) {
    assert.throws(() => change(store, first, patch), /patch fields/);
  }
  assert.deepEqual(await store.get(scope), first);
});

test('operations cannot race database owner binding, and close during open leaves no usable handle', async t => {
  const indexedDBImpl = new IDBFactory(); let premature;
  const store = new WorldGoalStore({ hostId: 'host-a', indexedDBImpl }); t.after(() => store.close());
  const get = IDBObjectStore.prototype.get;
  IDBObjectStore.prototype.get = function (...args) {
    if (this.name === 'metadata' && args[0] === 'hostId') {
      premature = assert.rejects(store.assign(assignment), /not open/);
    }
    return get.apply(this, args);
  };
  try { await store.open(); await premature; }
  finally { IDBObjectStore.prototype.get = get; }
  assert.deepEqual(await store.list(), []);
  const closing = new WorldGoalStore({ name: 'closing', hostId: 'host-a', indexedDBImpl });
  const opening = closing.open(); const closed = closing.destroy();
  await assert.rejects(opening, /closed/); await closed; assert.equal(closing.database, null);
});

test('two independent handles serialize CAS before any authorized model or motor effect', async t => {
  const indexedDBImpl = new IDBFactory(); const { store } = await fixture(t, { indexedDBImpl });
  const { store: other } = await fixture(t, { indexedDBImpl }); const initial = await store.assign(assignment);
  const record = await start(store, initial); let dispatched = 0;
  const attempts = await Promise.allSettled([store, other].map(async handle => {
    const committed = await decision(handle, record); dispatched++; return committed;
  }));
  assert.equal(dispatched, 1); assert.equal(attempts.filter(item => item.status === 'fulfilled').length, 1);
  assert.equal(attempts.find(item => item.status === 'rejected').reason.code, 'ERR_WORLD_GOAL_CONFLICT');
  assert.equal((await other.get(scope)).revision, record.revision + 1);
  await assert.rejects(store.assign(assignment), { code: 'ERR_WORLD_GOAL_CONFLICT' });
});

test('checkpoint input identity and payload are captured before yielding to IndexedDB', async t => {
  const { store } = await fixture(t); const record = await store.assign(assignment);
  const input = { goalId: record.goalId, expectedRevision: record.revision, patch: { reason: 'Original checkpoint' }, event: { type: 'owner-inspected' } };
  const pending = store.commit(scope, input);
  input.goalId = 'another'; input.expectedRevision = 999; input.patch.reason = 'Mutated after call'; input.event.type = 'changed';
  const changed = await pending;
  assert.equal(changed.reason, 'Original checkpoint'); assert.equal(changed.trace[0].type, 'owner-inspected');
});

test('receipts require an acknowledged matching action and remain evidence distinct from model assessment', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  await assert.rejects(change(store, record, { lastReceipt: outcome() }), /acknowledged action/);
  record = await planned(store, record);
  record = await decision(store, record); record = await action(store, record);
  for (const invalid of [outcome('other'), outcome('action-1', { targetId: 'other' }), outcome('action-1', { type: 'look-at' }),
    outcome('action-1', { at: 99999 }), outcome('action-1', { position: [NaN, 0, 0] }), outcome('action-1', { extra: 'untrusted' })]) {
    await assert.rejects(change(store, record, { status: 'ready', pendingAction: null, lastReceipt: invalid }));
    assert.deepEqual(await store.get(scope), record);
  }
  await assert.rejects(change(store, record, { lastReceipt: outcome() }), /settle the pending action/);
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome() });
  assert.deepEqual(record.receipts, [outcome()]);
  await assert.rejects(change(store, record, { status: 'completed' }), /assessment/);
  await assert.rejects(change(store, record, { status: 'acting', pendingAction: { requestId: 'action-1', intent: { type: 'approach', targetId: 'nova' }, issuedAt: 100000, observationAt: 100000 } }), /already settled/);
  record = await change(store, record, { status: 'completed', modelAssessment: 'I believe the objective is done; action-1 confirms the visit.' });
  assert.equal(record.status, 'completed'); assert.equal(record.receipts[0].status, 'arrived');
  await assert.rejects(change(store, record, { status: 'ready' }), /Terminal/);
});

test('interrupted checkpoints persist until explicit owner recovery and fixed budgets cannot reset', async t => {
  const { store, indexedDBImpl } = await fixture(t); let record = await start(store, await store.assign(assignment));
  record = await decision(store, record); await store.close();
  const { store: reopened } = await fixture(t, { indexedDBImpl }); assert.deepEqual(await reopened.get(scope), record);
  record = await change(reopened, record, { status: 'paused', reason: 'Interrupted; owner Resume required.' });
  assert.equal(record.pendingDecision.id, 'decision-1');
  await assert.rejects(change(reopened, record, { status: 'ready' }), /pending work/);
  await assert.rejects(change(reopened, record, { startedAt: 100001, deadlineAt: 700001 }), /cannot be reset/);
  record = await change(reopened, record, { status: 'ready', requesterId: 'new-owner-peer', pendingDecision: null, steps: 1 });
  assert.equal(record.startedAt, 100000); assert.equal(record.steps, 1);
  await assert.rejects(change(reopened, record, { requesterId: 'visitor' }), /explicit owner Resume/);
  for (const patch of [{ steps: 0 }, { steps: 9 }, { failures: 4 }, { steps: 1.5 }]) await assert.rejects(change(reopened, record, patch));
  record = await change(reopened, record, { status: 'waiting-for-model', nextDecisionAt: 130000 });
  assert.equal(record.steps, 1); assert.equal(record.pendingDecision, null);
});

test('active replacement/removal reject; terminal replacement has a fresh identity and revision', async t => {
  const { store } = await fixture(t); let record = await store.assign(assignment);
  await assert.rejects(store.assign(assignment, { expectedRevision: record.revision }), /Cancel/);
  await assert.rejects(store.remove(scope, { goalId: record.goalId, expectedRevision: record.revision }), /Cancel/);
  record = await change(store, record, { status: 'cancelled' });
  const replacement = await store.assign({ ...assignment, objective: 'Look at Nova.' }, { expectedRevision: record.revision });
  assert.notEqual(replacement.goalId, record.goalId); assert.equal(replacement.revision, record.revision + 1);
  await assert.rejects(store.remove(scope, { goalId: record.goalId, expectedRevision: replacement.revision }), /conflict/);
  const cancelled = await change(store, replacement, { status: 'cancelled' });
  assert.equal(await store.remove(scope, { goalId: cancelled.goalId, expectedRevision: cancelled.revision }), true);
  assert.equal(await store.get(scope), undefined);
});

test('strict bounds reject hostile objects, invalid Unicode, oversized prompts, unsupported actions and impossible timestamps', async t => {
  const { store } = await fixture(t);
  for (const extra of [{ objective: '😀'.repeat(257) }, { objective: '\ud800' }, { objective: 'bad\0text' }, { requesterId: '' }, { arbitrary: true }]) {
    assert.throws(() => store.assign({ ...assignment, ...extra }));
  }
  assert.throws(() => store.assign(Object.assign(Object.create({ injected: true }), assignment)));
  let record = await start(store, await store.assign(assignment));
  for (const patch of [{ status: 'unknown' }, { status: 'planning' }, { status: 'acting' }, { currentStep: 'x'.repeat(241) },
    { modelAssessment: 'x'.repeat(513) }, { deadlineAt: 700001 }]) await assert.rejects(change(store, record, patch));
  for (const intent of [{ type: 'follow', targetId: 'nova' }, { type: 'stop', targetId: 'nova' },
    { type: 'approach', targetId: 'nova', stopDistance: 1 }, { type: 'approach', targetId: 'nova', position: [0, 0, 0] }]) {
    await assert.rejects(change(store, record, { status: 'acting', pendingAction: { requestId: 'bad', intent, issuedAt: 100000, observationAt: 100000 } }));
  }
  assert.deepEqual(await store.get(scope), record);
});

test('trace is bounded while receipts and ordered progress survive the eight-decision budget', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  record = await planned(store, record, planOf(...Array.from({ length: 6 }, (_, i) => ({ ...visit, label: `Visit Nova ${i + 1}` }))));
  for (let i = 0; i < 7; i++) {
    record = await decision(store, record, `decision-${i}`); record = await action(store, record, `action-${i}`);
    record = await change(store, record, { status: 'ready', pendingAction: null,
      lastReceipt: outcome(`action-${i}`, { status: i === 0 ? 'blocked' : 'arrived' }) }, { type: 'arrived', requestId: `action-${i}` });
  }
  for (let i = 0; i < 20; i++) record = await change(store, record, { reason: `inspection-${i}` }, { type: 'inspection', text: `event-${i}` });
  assert.equal(record.steps, 8); assert.equal(record.receipts.length, 7); assert.equal(record.completedMilestones.length, 6);
  assert.equal(record.trace.length, 16);
  assert.equal(record.trace[0].text, 'event-4'); assert.equal(record.receipts[0].requestId, 'action-0');
  await assert.rejects(change(store, record, { steps: 9 }));
});

test('capacity prunes only terminal records, and failed writes roll pruning back atomically', async t => {
  const { store } = await fixture(t, { maximumEntries: 1 }); let record = await store.assign(assignment);
  const second = { ...assignment, agentId: 'other' };
  await assert.rejects(store.assign(second), /capacity reached/);
  record = await change(store, record, { status: 'cancelled' });
  const put = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args) {
    if (this.name === 'goals') throw new DOMException('Owned injected failure', 'QuotaExceededError');
    return put.apply(this, args);
  };
  try { await assert.rejects(store.assign(second), { name: 'QuotaExceededError' }); }
  finally { IDBObjectStore.prototype.put = put; }
  assert.deepEqual(await store.get(scope), record); assert.equal((await store.list()).length, 1);
  await store.assign(second); assert.equal(await store.get(scope), undefined); assert.equal((await store.list()).length, 1);
});

test('cancelled writes acknowledge failure, preserve previous state and cannot authorize dispatch', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  await assert.rejects(change(store, record, { reason: 'before abort' }, undefined, { signal: AbortSignal.abort() }), { name: 'AbortError' });
  const control = new AbortController(), put = IDBObjectStore.prototype.put; let dispatched = 0;
  IDBObjectStore.prototype.put = function (...args) {
    const result = put.apply(this, args); if (this.name === 'goals') control.abort(); return result;
  };
  try {
    await assert.rejects(change(store, record, { status: 'planning', pendingDecision: { id: 'cancelled', startedAt: 100000 } }, undefined,
      { signal: control.signal }).then(() => { dispatched++; }), { name: 'AbortError' });
  } finally { IDBObjectStore.prototype.put = put; }
  assert.equal(dispatched, 0); assert.deepEqual(await store.get(scope), record);
});

test('destroy acknowledges an in-flight write and rejects future operations without deleting it', async t => {
  const { store, indexedDBImpl } = await fixture(t); const record = await store.assign(assignment);
  const pending = change(store, record, { reason: 'Durable before close' }); const closing = store.destroy();
  const changed = await pending; await closing;
  await assert.rejects(store.get(scope), /not open/); await assert.rejects(store.open(), /closed/);
  const { store: reopened } = await fixture(t, { indexedDBImpl }); assert.deepEqual(await reopened.get(scope), changed);
});

test('StateManager owns goal handles without publishing objectives or cloning jobs into another identity', async () => {
  const indexedDBImpl = new IDBFactory(), manager = new StateManager(); let updates = 0;
  manager.ydoc.on('update', () => { updates++; });
  const store = manager.createWorldGoalStore({ name: 'owned', hostId: 'host-a', indexedDBImpl }); await store.open();
  const record = await store.assign(assignment);
  assert.equal(manager.getWorldGoalStore('owned'), store);
  assert.throws(() => manager.createWorldGoalStore({ name: 'owned', hostId: 'host-a' }), /registered/);
  assert.equal(updates, 0); assert.equal(JSON.stringify(manager.ydoc.toJSON()).includes(assignment.objective), false);
  assert.equal(await store.get({ ...scope, agentId: 'clone' }), undefined);
  await manager.destroy(); assert.equal(manager.getWorldGoalStore('owned'), null);
  assert.throws(() => manager.createWorldGoalStore({ hostId: 'host-a' }), /destroyed/);
  const reopened = new WorldGoalStore({ name: 'owned', hostId: 'host-a', indexedDBImpl }); await reopened.open();
  assert.deepEqual(await reopened.get(scope), record); await reopened.close();
});

test('a plan requires an acknowledged decision, settles without dispatch, and is immutable', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  await assert.rejects(change(store, record, { plan: planOf(visit) }), /acknowledged planning/);
  record = await decision(store, record);
  await assert.rejects(change(store, record, { plan: planOf(visit) }), /acknowledged planning/);
  await assert.rejects(change(store, record, { plan: planOf(visit), status: 'acting', pendingDecision: null,
    pendingAction: { requestId: 'unplanned', intent: { type: 'approach', targetId: 'nova' }, milestoneIndex: 0,
      issuedAt: 100000, observationAt: 100000 } }), /without an action/);
  const paused = await change(store, record, { status: 'paused' });
  await assert.rejects(change(store, paused, { plan: planOf(visit), pendingDecision: null }), /acknowledged planning/);
  record = await change(store, paused, { status: 'ready', pendingDecision: null, steps: 1 });
  record = await planned(store, record);
  assert.equal(record.steps, 2); assert.equal(record.pendingDecision, null); assert.equal(record.pendingAction, null);
  assert.deepEqual(record.completedMilestones, []);
  await assert.rejects(change(store, record, { plan: planOf(visit) }), /cannot be replaced/);
  await assert.rejects(change(store, record, { plan: planOf({ ...visit, targetId: 'another' }) }), /cannot be replaced/);
  assert.throws(() => change(store, record, { completedMilestones: [{ index: 0, requestId: 'forged' }] }), /patch fields/);
  assert.deepEqual(await store.get(scope), record);
});

test('plan payload is captured before IndexedDB and hostile nested fields cannot disappear through cloning', async t => {
  const { store } = await fixture(t); let record = await decision(store, await start(store, await store.assign(assignment)));
  const plan = planOf({ ...visit }), pending = change(store, record, { status: 'ready', pendingDecision: null, plan, steps: 1 });
  plan.milestones[0].targetId = 'mutated'; plan.milestones.push({ label: 'Injected', type: 'stop' });
  record = await pending; assert.deepEqual(record.plan, planOf(visit));
  assert.throws(() => change(store, record, { plan: planOf({ ...visit, [Symbol('hidden')]: true }) }), /milestone fields/);
  assert.deepEqual(await store.get(scope), record);
});

test('new actions cannot bypass the plan, skip milestones, change types, or target another participant', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  const pending = { requestId: 'proposed', intent: { type: 'approach', targetId: 'nova' }, milestoneIndex: 0,
    issuedAt: 100000, observationAt: 100000 };
  await assert.rejects(change(store, record, { status: 'acting', pendingAction: pending }), /active planned milestone/);
  record = await planned(store, record, planOf(visit, { label: 'Face owner', type: 'look-at', targetRole: 'requester' }));
  for (const invalid of [{ ...pending, milestoneIndex: 1 }, { ...pending, milestoneIndex: undefined },
    { ...pending, intent: { type: 'look-at', targetId: 'nova' } }, { ...pending, intent: { type: 'approach', targetId: 'owner-peer' } },
    { ...pending, intent: { type: 'stop' } }]) {
    await assert.rejects(change(store, record, { status: 'acting', pendingAction: invalid }));
    assert.deepEqual(await store.get(scope), record);
  }
  record = await action(store, await decision(store, record));
  await assert.rejects(change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('action-1', { type: 'look-at' }) }), /acknowledged action/);
  assert.deepEqual((await store.get(scope)).completedMilestones, []);
});

test('repeated destinations require separate successful requests and every milestone precedes final assessment', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  record = await planned(store, record, planOf(visit, { ...visit, label: 'Visit Nova again' }, { label: 'Look at Nova', type: 'look-at', targetId: 'nova' }));
  record = await action(store, await decision(store, record), 'first');
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('first') });
  assert.deepEqual(record.completedMilestones, [{ index: 0, requestId: 'first' }]);
  await assert.rejects(change(store, record, { status: 'completed', modelAssessment: 'I visited Nova once.' }), /every planned milestone/);
  await assert.rejects(action(store, record, 'first'), /already settled/);
  await assert.rejects(change(store, record, { lastReceipt: outcome('invented') }), /acknowledged action/);
  record = await action(store, await decision(store, record), 'blocked');
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('blocked', { status: 'blocked' }) });
  assert.equal(record.completedMilestones.length, 1);
  record = await action(store, await decision(store, record), 'second');
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('second') });
  record = await action(store, await decision(store, record), 'look');
  await assert.rejects(change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('look') }), /acknowledged action/);
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('look', { type: 'look-at' }) });
  assert.deepEqual(record.completedMilestones, [{ index: 0, requestId: 'first' }, { index: 1, requestId: 'second' }, { index: 2, requestId: 'look' }]);
  assert.equal(worldGoalMilestonesComplete(record), true);
  record = await change(store, await decision(store, record, 'assessment'), { status: 'completed', pendingDecision: null,
    steps: record.steps + 1, modelAssessment: 'Both visits and the final look have distinct physical receipts.' });
  assert.equal(record.status, 'completed'); assert.equal(record.steps, 6);
});

test('requester milestones resolve after owner Resume while prior completion retains its exact earlier target', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  const returnToOwner = { label: 'Visit requester', type: 'approach', targetRole: 'requester' };
  record = await planned(store, record, planOf(returnToOwner, visit, { ...returnToOwner, label: 'Return to requester' }));
  record = await action(store, await decision(store, record), 'old-requester');
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('old-requester', { targetId: 'owner-peer' }) });
  record = await change(store, record, { status: 'paused' });
  record = await change(store, record, { status: 'ready', requesterId: 'new-owner-peer' });
  record = await action(store, await decision(store, record), 'nova');
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('nova') });
  assert.equal(activeWorldGoalMilestone(record).intent.targetId, 'new-owner-peer');
  await assert.rejects(change(store, record, { status: 'acting', pendingAction: { requestId: 'stale-owner', milestoneIndex: 2,
    intent: { type: 'approach', targetId: 'owner-peer' }, issuedAt: 100000, observationAt: 100000 } }), /active planned milestone/);
  record = await action(store, await decision(store, record), 'new-requester');
  await assert.rejects(change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('new-requester', { targetId: 'owner-peer' }) }), /acknowledged action/);
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('new-requester', { targetId: 'new-owner-peer' }) });
  assert.equal(worldGoalMilestonesComplete(record), true); assert.equal(record.receipts[0].targetId, 'owner-peer');
  assert.deepEqual(record.plan, planOf(returnToOwner, visit, { ...returnToOwner, label: 'Return to requester' }));
});

test('legacy history and pending checkpoints hydrate unchanged and never receive retrospective milestone credit', async t => {
  const { store, indexedDBImpl } = await fixture(t); let record = await start(store, await store.assign(assignment));
  const legacy = await seedLegacy(store, { ...record, status: 'acting', steps: 2, receipts: [outcome('legacy-first')],
    lastReceipt: outcome('legacy-first'), pendingAction: { requestId: 'legacy-pending',
      intent: { type: 'approach', targetId: 'nova', stopDistance: 10 }, issuedAt: 100000, observationAt: 99999 },
    trace: [{ type: 'old-history', text: 'Keep the original evidence.', at: 100000 }] });
  await store.close(); const { store: reopened } = await fixture(t, { indexedDBImpl });
  record = await reopened.get(scope);
  assert.deepEqual(record, { ...legacy, plan: null, completedMilestones: [] });
  assert.deepEqual((await reopened.list())[0], record);
  await assert.rejects(change(reopened, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('legacy-pending') }), /settle paused/);
  record = await change(reopened, record, { status: 'paused', pendingAction: null, lastReceipt: outcome('legacy-pending') });
  assert.equal(record.receipts.length, 2); assert.deepEqual(record.completedMilestones, []);
  record = await change(reopened, record, { status: 'ready' }); record = await planned(reopened, record);
  assert.deepEqual(record.completedMilestones, []); assert.equal(activeWorldGoalMilestone(record).index, 0);
  await assert.rejects(change(reopened, record, { status: 'completed', modelAssessment: 'The old receipts prove the new plan.' }), /every planned milestone/);
  record = await action(reopened, await decision(reopened, record), 'new-action');
  record = await change(reopened, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('new-action') });
  assert.deepEqual(record.completedMilestones, [{ index: 0, requestId: 'new-action' }]);
  assert.deepEqual(record.trace, legacy.trace); assert.deepEqual(record.receipts.slice(0, 2), [outcome('legacy-first'), outcome('legacy-pending')]);
});

test('all eight legacy receipts and interrupted planning remain intact without expanding budgets', async t => {
  const { store } = await fixture(t); const initial = await start(store, await store.assign(assignment));
  const receipts = Array.from({ length: 8 }, (_, i) => outcome(`legacy-${i}`));
  const legacy = await seedLegacy(store, { ...initial, steps: 8, receipts, lastReceipt: receipts.at(-1), status: 'paused',
    pendingDecision: { id: 'legacy-decision', startedAt: 100000 } });
  let record = await store.get(scope); assert.deepEqual(record, { ...legacy, plan: null, completedMilestones: [] });
  for (const patch of [{ steps: 9 }, { steps: 7 }, { failures: 4 }, { deadlineAt: 700001 }]) await assert.rejects(change(store, record, patch));
  record = await change(store, record, { reason: 'Still needs owner recovery.' });
  assert.equal(record.receipts.length, 8); assert.deepEqual(record.pendingDecision, legacy.pendingDecision);
  assert.deepEqual(record.limits, WORLD_GOAL_LIMITS); assert.deepEqual(record.completedMilestones, []);
});

test('planned progress survives reload and pending recovery without replay, deadline reset or revision', async t => {
  const { store, indexedDBImpl } = await fixture(t); let record = await start(store, await store.assign(assignment));
  record = await planned(store, record, planOf(visit, { label: 'Return', type: 'approach', targetRole: 'requester' }));
  record = await action(store, await decision(store, record), 'visit');
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome('visit') });
  record = await action(store, await decision(store, record), 'interrupted-return');
  await store.close(); const { store: reopened } = await fixture(t, { indexedDBImpl });
  assert.deepEqual(await reopened.get(scope), record);
  record = await change(reopened, record, { status: 'paused' });
  assert.equal(record.pendingAction.requestId, 'interrupted-return'); assert.equal(record.pendingAction.milestoneIndex, 1);
  record = await change(reopened, record, { status: 'ready', pendingAction: null, requesterId: 'owner-after-reload' });
  assert.equal(record.steps, 3); assert.equal(record.deadlineAt, 700000);
  assert.deepEqual(record.completedMilestones, [{ index: 0, requestId: 'visit' }]);
  assert.equal(activeWorldGoalMilestone(record).intent.targetId, 'owner-after-reload');
  await assert.rejects(change(reopened, record, { lastReceipt: outcome('interrupted-return', { targetId: 'owner-peer' }) }), /acknowledged action/);
  await assert.rejects(change(reopened, record, { deadlineAt: 700001 }), /deadline/);
  await assert.rejects(change(reopened, record, { plan: planOf(visit) }), /cannot be replaced/);
});

test('receipt persistence abort rolls milestone credit back atomically, and concurrent settlement appends once', async t => {
  const { store, indexedDBImpl } = await fixture(t); const { store: other } = await fixture(t, { indexedDBImpl });
  let record = await planned(store, await start(store, await store.assign(assignment)));
  record = await action(store, await decision(store, record));
  const patch = { status: 'ready', pendingAction: null, lastReceipt: outcome() };
  const put = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args) {
    if (this.name === 'goals') throw new DOMException('Owned injected failure', 'QuotaExceededError');
    return put.apply(this, args);
  };
  try { await assert.rejects(change(store, record, patch), { name: 'QuotaExceededError' }); }
  finally { IDBObjectStore.prototype.put = put; }
  assert.deepEqual(await store.get(scope), record);
  const attempts = await Promise.allSettled([store, other].map(handle => change(handle, record, patch)));
  assert.equal(attempts.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(attempts.find(result => result.status === 'rejected').reason.code, 'ERR_WORLD_GOAL_CONFLICT');
  record = await store.get(scope); assert.deepEqual(record.completedMilestones, [{ index: 0, requestId: 'action-1' }]);
  assert.equal(record.receipts.length, 1);
});

test('stop milestone requires its own acknowledged stopped receipt', async t => {
  const { store } = await fixture(t); let record = await planned(store, await start(store, await store.assign(assignment)),
    planOf({ label: 'Stop moving', type: 'stop' }));
  record = await action(store, await decision(store, record), 'stop');
  await assert.rejects(change(store, record, { status: 'ready', pendingAction: null,
    lastReceipt: { requestId: 'stop', type: 'stop', status: 'arrived', at: 100000 } }), /outcome/);
  record = await change(store, record, { status: 'ready', pendingAction: null,
    lastReceipt: { requestId: 'stop', type: 'stop', status: 'stopped', at: 100000 } });
  assert.deepEqual(record.completedMilestones, [{ index: 0, requestId: 'stop' }]);
  assert.equal(worldGoalMilestonesComplete(record), true);
});

test('assignment captures an immutable origin across reload and requester reassignment', async t => {
  const { store, indexedDBImpl } = await fixture(t), originPosition = [12, 4, -20];
  const saving = store.assign({ ...assignment, originPosition });
  originPosition[0] = 700;
  let record = await saving;
  assert.deepEqual(record.originPosition, [12, 4, -20]);
  assert.throws(() => change(store, record, { originPosition: [0, 0, 0] }), /patch fields/);
  record = await start(store, record);
  record = await planned(store, record, planOf({ label: 'Return to the starting place', type: 'move-to', position: record.originPosition }));
  record = await change(store, record, { status: 'paused' });
  await store.close(); const { store: reopened } = await fixture(t, { indexedDBImpl });
  record = await reopened.get(scope);
  record = await change(reopened, record, { status: 'ready', requesterId: 'human:new-session' });
  assert.deepEqual(record.originPosition, [12, 4, -20]);
  assert.deepEqual(activeWorldGoalMilestone(record).intent, { type: 'move-to', position: [12, 4, -20] });
  assert.equal(record.pendingAction, null);
  const sparse = []; sparse.length = 3;
  for (const position of [null, [0, Infinity, 0], sparse, [0, 0, 0, 0]]) {
    assert.throws(() => reopened.assign({ ...assignment, agentId: 'invalid-origin', originPosition: position }));
  }
});

test('fixed point arrivals require matching requested coordinates and measured XZ proximity before credit', async t => {
  const { store } = await fixture(t), point = [120, 4, -30];
  let record = await start(store, await store.assign({ ...assignment, originPosition: [0, 4, 0] }));
  record = await planned(store, record, planOf({ label: 'Explore east', type: 'move-to', position: point },
    { label: 'Return to origin', type: 'move-to', position: record.originPosition }));
  record = await action(store, await decision(store, record), 'outbound');
  assert.deepEqual(record.pendingAction.intent, { type: 'move-to', position: point, stopDistance: 10 });
  const arrived = { requestId: 'outbound', type: 'move-to', status: 'arrived', at: 100000,
    targetPosition: point, position: [126, 100, -22] }; // XZ distance 10; Y is decorative.
  for (const invalid of [{ ...arrived, targetPosition: [120, 4, -29] }, { ...arrived, position: [126, 4, -21.99] },
    { ...arrived, position: undefined }, { ...arrived, targetId: 'nova' }, { ...arrived, targetPosition: undefined }]) {
    await assert.rejects(change(store, record, { status: 'ready', pendingAction: null, lastReceipt: invalid }));
    assert.deepEqual(await store.get(scope), record);
  }
  record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: arrived });
  assert.deepEqual(record.completedMilestones, [{ index: 0, requestId: 'outbound' }]);
  assert.equal(worldGoalMilestonesComplete(record), false);
  assert.deepEqual(activeWorldGoalMilestone(record).intent, { type: 'move-to', position: [0, 4, 0] });
  await assert.rejects(change(store, record, { status: 'completed', modelAssessment: 'Went out, but not back yet.' }), /every planned milestone/);
  record = await action(store, await decision(store, record), 'return');
  record = await change(store, record, { status: 'ready', pendingAction: null,
    lastReceipt: { ...arrived, requestId: 'return', targetPosition: [0, 4, 0], position: [0, 2, 0] } });
  record = await change(store, record, { status: 'completed', modelAssessment: 'The outbound and return legs each have an arrival receipt.' });
  assert.equal(worldGoalMilestonesComplete(record), true);
  assert.deepEqual(record.receipts.map(item => item.targetPosition), [point, [0, 4, 0]]);
});

test('blocked point receipts preserve the destination without granting progress or replaying it after reload', async t => {
  const { store, indexedDBImpl } = await fixture(t), point = [70, 4, 90];
  let record = await start(store, await store.assign(assignment));
  record = await planned(store, record, planOf({ label: 'Visit clearing', type: 'move-to', position: point }));
  record = await action(store, await decision(store, record), 'blocked-point');
  record = await change(store, record, { status: 'paused', pendingAction: null,
    lastReceipt: { requestId: 'blocked-point', type: 'move-to', targetPosition: point, status: 'blocked', at: 100000,
      position: [3, 4, 0], reason: 'Terrain blocked the route.' } });
  await store.close(); const { store: reopened } = await fixture(t, { indexedDBImpl });
  assert.deepEqual(await reopened.get(scope), record);
  assert.equal(record.pendingAction, null); assert.deepEqual(record.completedMilestones, []);
  assert.equal(worldGoalMilestonesComplete(record), false);
  assert.deepEqual(activeWorldGoalMilestone(record).intent.position, point);
});
