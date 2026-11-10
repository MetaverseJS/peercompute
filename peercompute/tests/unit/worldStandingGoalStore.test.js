import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { WorldStandingGoalStore, WORLD_STANDING_GOAL_LIMITS as LIMITS } from '../../src/peercompute/agents/WorldStandingGoalStore.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

const scope = { worldId: 'cubechat:welcome', agentId: 'guide', goalId: 'welcome-v1', targetId: 'owner:stable-installation' };
const otherTarget = targetId => ({ ...scope, targetId });
async function fixture(t, options = {}) {
  const indexedDBImpl = options.indexedDBImpl ?? new IDBFactory();
  const clock = { value: 100_000 };
  const store = new WorldStandingGoalStore({ indexedDBImpl, now: () => clock.value, ...options });
  await store.open(); t.after(() => store.destroy()); return { store, clock, indexedDBImpl };
}
const claim = (store, requestId = 'first', target = scope, options = {}) => store.claim(target, { requestId, ...options });

test('one durable claim wins across competing handles and returned records are detached', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const { store: other } = await fixture(t, { indexedDBImpl });
  assert.equal(await store.get(scope), null);
  const outcomes = await Promise.all([claim(store), claim(other, 'second')]);
  assert.equal(outcomes.filter(item => item.claimed).length, 1);
  assert.equal(outcomes.find(item => !item.claimed).reason, 'outcome-unknown');
  const winner = outcomes.find(item => item.claimed).record;
  winner.status = 'failed'; winner.requestIds.push('mutated');
  assert.equal((await other.get(scope)).status, 'claimed');
  assert.equal((await other.get(scope)).attempts, 1);
  // The losing observer must not invalidate the winner's active request.
  const requestId = (await store.get(scope)).requestId;
  assert.equal((await store.prepare(scope, { requestId, text: 'Hello, welcome to CubeChat.' })).status, 'prepared');
});

test('reload never reclaims claimed, prepared, spoken, quiet, or unknown encounters', async t => {
  for (const state of ['claimed', 'prepared', 'spoken', 'quiet', 'unknown']) {
    const indexedDBImpl = new IDBFactory();
    const { store } = await fixture(t, { indexedDBImpl }); await claim(store);
    if (['prepared', 'spoken', 'unknown'].includes(state)) await store.prepare(scope, { requestId: 'first', text: 'Welcome!' });
    if (['spoken', 'quiet', 'unknown'].includes(state)) await store.finish(scope, { requestId: 'first', outcome: state });
    const before = await store.get(scope); await store.destroy();
    const { store: reopened } = await fixture(t, { indexedDBImpl, now: () => 100_000_000 });
    assert.deepEqual(await reopened.get(scope), before, state);
    const denied = await claim(reopened, 'new-request');
    assert.equal(denied.claimed, false, state);
    assert.equal(denied.reason, ['spoken', 'quiet'].includes(state) ? 'completed' : 'outcome-unknown', state);
    assert.deepEqual(await reopened.get(scope), before, state);
  }
});

test('failed inference retries at most three times and respects both retry delay and agent cooldown', async t => {
  const { store, clock, indexedDBImpl } = await fixture(t);
  await claim(store); clock.value += 80_000;
  let record = await store.fail(scope, { requestId: 'first', error: new Error('Model disconnected') });
  assert.equal(record.status, 'failed'); assert.equal(record.error, 'Model disconnected');
  assert.equal(record.nextAt, 210_000);
  await store.destroy(); const { store: reopened } = await fixture(t, { indexedDBImpl, now: () => clock.value });
  assert.equal((await claim(reopened, 'second')).nextAt, 210_000);
  clock.value = 210_000; assert.equal((await claim(reopened, 'second')).record.attempts, 2);
  record = await reopened.fail(scope, { requestId: 'second', error: 'Still unavailable' });
  assert.equal((await claim(reopened, 'third')).nextAt, 300_000);
  clock.value = 300_000; assert.equal((await claim(reopened, 'third')).record.attempts, 3);
  await reopened.fail(scope, { requestId: 'third', error: 'Unavailable' });
  clock.value += 10_000_000;
  assert.equal((await claim(reopened, 'fourth')).reason, 'attempts-exhausted');
});

test('a failure after prepare is unknown and never retries even without a delivery receipt', async t => {
  const { store, clock } = await fixture(t); await claim(store);
  await store.prepare(scope, { requestId: 'first', text: 'Potentially published text' });
  const record = await store.fail(scope, { requestId: 'first', error: 'Connection lost during publication' });
  assert.equal(record.status, 'unknown'); assert.equal(record.outcome, 'unknown'); assert.equal(record.nextAt, null);
  clock.value += 10_000_000; assert.equal((await claim(store, 'again')).reason, 'outcome-unknown');
});

test('cooldown is atomic across targets and goals; unrelated worlds and agents are independent', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const { store: other } = await fixture(t, { indexedDBImpl });
  const outcomes = await Promise.all([claim(store), claim(other, 'other', otherTarget('visitor'))]);
  assert.equal(outcomes.filter(item => item.claimed).length, 1);
  assert.equal(outcomes.find(item => !item.claimed).reason, 'cooldown');
  assert.equal((await claim(store, 'goal-two', { ...scope, goalId: 'another-goal' })).reason, 'cooldown');
  assert.equal((await claim(store, 'world-two', { ...scope, worldId: 'other-world' })).claimed, true);
  assert.equal((await claim(store, 'agent-two', { ...scope, agentId: 'another-agent' })).claimed, true);
  assert.equal(await store.get(otherTarget('never-reserved')), null);
});

test('rolling six-per-hour budget survives reload, denied claims do not charge, and clock rollback fails closed', async t => {
  const { store, clock, indexedDBImpl } = await fixture(t);
  for (let i = 0; i < 6; i++) {
    const target = otherTarget(`visitor-${i}`);
    assert.equal((await claim(store, `request-${i}`, target)).claimed, true);
    await store.finish(target, { requestId: `request-${i}`, outcome: 'quiet' });
    assert.equal((await claim(store, 'denied', otherTarget('waiting'))).reason, 'cooldown');
    clock.value += LIMITS.cooldownMs;
  }
  await store.destroy(); const { store: reopened } = await fixture(t, { indexedDBImpl, now: () => clock.value });
  let denied = await claim(reopened, 'seventh', otherTarget('visitor-6'));
  assert.equal(denied.reason, 'rate-limit'); assert.equal(denied.nextAt, 100_000 + LIMITS.windowMs);
  clock.value = 1; denied = await claim(reopened, 'rollback', otherTarget('visitor-6'));
  assert.equal(denied.reason, 'cooldown');
  clock.value = 100_000 + LIMITS.windowMs;
  assert.equal((await claim(reopened, 'seventh', otherTarget('visitor-6'))).claimed, true);
});

test('bounded capacity never evicts prior encounters and does not prevent retrying existing failures', async t => {
  const { store, clock } = await fixture(t, { maxRecords: 1 }); await claim(store);
  await store.fail(scope, { requestId: 'first', error: 'offline' }); clock.value += LIMITS.cooldownMs;
  assert.equal((await claim(store, 'new', otherTarget('visitor'))).reason, 'capacity');
  assert.equal(await store.get(otherTarget('visitor')), null);
  assert.equal((await claim(store, 'retry')).claimed, true);
  await store.finish(scope, { requestId: 'retry', outcome: 'quiet' }); clock.value += LIMITS.windowMs;
  assert.equal((await claim(store, 'new', otherTarget('visitor'))).reason, 'capacity');
  assert.equal((await claim(store, 'repeat')).reason, 'completed');
});

test('transitions reject stale IDs, duplicate settlement, reused attempt IDs, and publication without prepare', async t => {
  const { store, clock } = await fixture(t); await claim(store);
  for (const action of [
    () => store.prepare(scope, { requestId: 'stale', text: 'Do not send' }),
    () => store.finish(scope, { requestId: 'first', outcome: 'spoken' }),
    () => store.fail(scope, { requestId: 'stale', error: 'Do not settle' })
  ]) await assert.rejects(action(), { code: 'ERR_WORLD_STANDING_GOAL_CONFLICT' });
  await store.fail(scope, { requestId: 'first', error: 'Retry this' }); clock.value += LIMITS.cooldownMs;
  await assert.rejects(claim(store), /already used/); await claim(store, 'second');
  await assert.rejects(store.prepare(scope, { requestId: 'first', text: 'Old attempt' }), /conflict/);
  await store.prepare(scope, { requestId: 'second', text: 'Current attempt' });
  await assert.rejects(store.prepare(scope, { requestId: 'second', text: 'Replace prepared text' }), /conflict/);
  await assert.rejects(store.finish(scope, { requestId: 'second', outcome: 'quiet' }), /conflict/);
  const settled = await Promise.allSettled([
    store.finish(scope, { requestId: 'second', outcome: 'spoken', delivery: { id: 'chat-1', status: 'delivered', delivered: 1, total: 1 } }),
    store.finish(scope, { requestId: 'second', outcome: 'unknown' })
  ]);
  assert.equal(settled.filter(result => result.status === 'fulfilled').length, 1);
  await assert.rejects(store.fail(scope, { requestId: 'second', error: 'Late error' }), /conflict/);
});

test('scope bounds use UTF8 bytes and stored output/receipts reject private or unbounded fields', async t => {
  const { store } = await fixture(t);
  for (const [field, bytes] of [['worldId', 240], ['agentId', 128], ['goalId', 128], ['targetId', 320]]) {
    assert.throws(() => store.get({ ...scope, [field]: 'é'.repeat(bytes / 2 + 1) }), TypeError);
  }
  for (const invalid of [{ ...scope, owner: 'hidden' }, { ...scope, worldId: '\ud800' }, { ...scope, targetId: 'a\0b' }]) {
    assert.throws(() => store.get(invalid), TypeError);
  }
  assert.throws(() => claim(store, 'x'.repeat(129)), TypeError);
  await claim(store);
  assert.throws(() => store.prepare(scope, { requestId: 'first', text: 'é'.repeat(901) }), TypeError);
  await store.prepare(scope, { requestId: 'first', text: 'Hello' });
  for (const delivery of [{ status: 'delivered', recipients: ['private-peer'] }, { status: 'bogus' },
    { status: 'partial', delivered: 2, total: 1 }, { status: 'delivered', total: 1_000_001 },
    { status: 'delivered', id: 'x'.repeat(129) }]) {
    assert.throws(() => store.finish(scope, { requestId: 'first', outcome: 'spoken', delivery }), TypeError);
  }
  assert.throws(() => store.fail(scope, { requestId: 'first', error: 'x'.repeat(513) }), TypeError);
  assert.equal((await store.get(scope)).status, 'prepared');
  const result = await store.finish(scope, { requestId: 'first', outcome: 'spoken', delivery: { id: 'chat-1', status: 'local-only', delivered: 0, total: 0 } });
  assert.deepEqual(result.delivery, { id: 'chat-1', status: 'local-only', delivered: 0, total: 0 });
});

test('abort before or during claim commits neither encounter nor budget', async t => {
  const { store } = await fixture(t);
  await assert.rejects(claim(store, 'aborted', scope, { signal: AbortSignal.abort() }), { name: 'AbortError' });
  const control = new AbortController(); const put = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args) {
    const result = put.apply(this, args); if (this.name === 'budgets') control.abort(); return result;
  };
  try { await assert.rejects(claim(store, 'aborted', scope, { signal: control.signal }), { name: 'AbortError' }); }
  finally { IDBObjectStore.prototype.put = put; }
  assert.equal(await store.get(scope), null);
  assert.equal((await claim(store, 'successful')).claimed, true);
});

test('publication checkpoints request strict durability and resolve after transaction completion', async t => {
  const { store } = await fixture(t); const original = store.database.transaction.bind(store.database);
  const transactions = [];
  store.database.transaction = (...args) => {
    const transaction = original(...args), observed = { mode: transaction.mode, durability: transaction.durability, completed: false };
    transaction.addEventListener('complete', () => { observed.completed = true; });
    transactions.push(observed); return transaction;
  };
  await claim(store); await store.prepare(scope, { requestId: 'first', text: 'Now safe to publish' });
  assert.equal(transactions.length, 2);
  assert.ok(transactions.every(item => item.mode === 'readwrite' && item.durability === 'strict' && item.completed));
});

test('quota failure rolls claim and budget back together; failed prepare remains retryable', async t => {
  const { store, clock } = await fixture(t); const put = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args) {
    if (this.name === 'budgets') throw new DOMException('Disk full', 'QuotaExceededError');
    return put.apply(this, args);
  };
  try { await assert.rejects(claim(store), { name: 'QuotaExceededError' }); }
  finally { IDBObjectStore.prototype.put = put; }
  assert.equal(await store.get(scope), null); await claim(store);
  const control = new AbortController();
  IDBObjectStore.prototype.put = function (...args) {
    const result = put.apply(this, args); if (this.name === 'encounters') control.abort(); return result;
  };
  try { await assert.rejects(store.prepare(scope, { requestId: 'first', text: 'Never publish', signal: control.signal }), { name: 'AbortError' }); }
  finally { IDBObjectStore.prototype.put = put; }
  assert.equal((await store.get(scope)).status, 'claimed');
  assert.equal((await store.fail(scope, { requestId: 'first', error: 'Prepare aborted' })).status, 'failed');
  clock.value += LIMITS.cooldownMs; assert.equal((await claim(store, 'retry')).claimed, true);
});

test('aborted outcome acknowledgement leaves a prepared checkpoint that cannot be reclaimed', async t => {
  const { store } = await fixture(t); await claim(store); await store.prepare(scope, { requestId: 'first', text: 'Sent text' });
  const control = new AbortController(), put = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args) {
    const result = put.apply(this, args); if (this.name === 'encounters') control.abort(); return result;
  };
  try { await assert.rejects(store.finish(scope, { requestId: 'first', outcome: 'spoken', signal: control.signal }), { name: 'AbortError' }); }
  finally { IDBObjectStore.prototype.put = put; }
  assert.equal((await store.get(scope)).status, 'prepared');
  assert.equal((await claim(store, 'recovery')).reason, 'outcome-unknown');
  assert.equal((await store.fail(scope, { requestId: 'first', error: 'Acknowledgement lost' })).status, 'unknown');
});

test('destroy drains writes, closes once, and preserves records for a fresh handle', async t => {
  let closes = 0; const { store, indexedDBImpl } = await fixture(t, { onDestroy: () => { closes++; } });
  const pending = claim(store), closing = store.destroy();
  assert.equal((await pending).claimed, true); await closing; await store.destroy(); assert.equal(closes, 1);
  await assert.rejects(store.get(scope), /not open/); await assert.rejects(store.open(), /closed/);
  const { store: reopened } = await fixture(t, { indexedDBImpl }); assert.equal((await reopened.get(scope)).status, 'claimed');
  const opening = new WorldStandingGoalStore({ name: 'closing', indexedDBImpl });
  const ready = opening.open(); const destroyed = opening.destroy();
  await assert.rejects(ready, /closed/); await destroyed; assert.equal(opening.database, null);
});

test('StateManager owns handles and duplicate registration without deleting durable history', async t => {
  const indexedDBImpl = new IDBFactory(); const manager = new StateManager(); t.after(() => manager.destroy());
  let closes = 0; const store = manager.createWorldStandingGoalStore({ name: 'owned', indexedDBImpl, onDestroy: () => { closes++; } });
  assert.equal(manager.getWorldStandingGoalStore('owned'), store);
  assert.throws(() => manager.createWorldStandingGoalStore({ name: 'owned' }), /already registered/);
  await store.open(); await claim(store); await manager.destroy();
  assert.equal(closes, 1); assert.equal(manager.getWorldStandingGoalStore('owned'), null);
  assert.throws(() => manager.createWorldStandingGoalStore(), /destroyed/);
  const { store: reopened } = await fixture(t, { name: 'owned', indexedDBImpl });
  assert.equal((await reopened.get(scope)).status, 'claimed');
});
