import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { WorldGoalStore, WORLD_GOAL_LIMITS } from '../../src/peercompute/agents/WorldGoalStore.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

const scope = { worldId: 'cubechat:room', agentId: 'ada' };
const assignment = { ...scope, objective: 'Visit Nova, then return to me.', requesterId: 'owner-peer' };
const scopeOf = record => ({ worldId: record.worldId, agentId: record.agentId });
const change = (store, record, patch, event, options) => store.commit(scopeOf(record), {
  goalId: record.goalId, expectedRevision: record.revision, patch, ...(event ? { event } : {}) }, options);
const start = (store, record) => change(store, record, { status: 'ready', startedAt: 100000, deadlineAt: 700000 });
const decision = (store, record, id = 'decision-1') => change(store, record, { status: 'planning', pendingDecision: { id, startedAt: 100000 } });
const action = (store, record, id = 'action-1') => change(store, record, { status: 'acting', pendingDecision: null,
  steps: record.steps + 1, pendingAction: { requestId: id, intent: { type: 'approach', targetId: 'nova', stopDistance: 10 }, issuedAt: 100000, observationAt: 99999 } });
const outcome = (id = 'action-1', extra = {}) => ({ requestId: id, type: 'approach', targetId: 'nova', status: 'arrived', at: 100000, position: [10, 3, 4], ...extra });
async function fixture(t, options = {}) {
  const indexedDBImpl = options.indexedDBImpl ?? new IDBFactory();
  const store = new WorldGoalStore({ hostId: 'host-a', indexedDBImpl, now: () => 100000, ...options });
  await store.open(); t.after(() => store.close()); return { store, indexedDBImpl };
}

test('private paused goals survive reopen without replay, stay scoped, and return detached records', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const first = await store.assign(assignment);
  assert.equal(first.status, 'paused'); assert.equal(first.startedAt, null); assert.equal(first.pendingAction, null);
  assert.deepEqual(first.limits, WORLD_GOAL_LIMITS); assert.deepEqual(first.receipts, []);
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
  for (const patch of [{ ownerHostId: 'host-b' }, { objective: 'Changed' }, { goalId: 'elsewhere' }, { limits: { maxSteps: 99 } }, { receipts: [] }]) {
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

test('trace is bounded while all eight verified action receipts remain available', async t => {
  const { store } = await fixture(t); let record = await start(store, await store.assign(assignment));
  for (let i = 0; i < 8; i++) {
    record = await decision(store, record, `decision-${i}`); record = await action(store, record, `action-${i}`);
    record = await change(store, record, { status: 'ready', pendingAction: null, lastReceipt: outcome(`action-${i}`) }, { type: 'arrived', requestId: `action-${i}` });
  }
  for (let i = 0; i < 20; i++) record = await change(store, record, { reason: `inspection-${i}` }, { type: 'inspection', text: `event-${i}` });
  assert.equal(record.steps, 8); assert.equal(record.receipts.length, 8); assert.equal(record.trace.length, 16);
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
