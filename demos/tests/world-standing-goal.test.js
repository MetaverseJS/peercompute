import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as flush } from 'node:timers/promises';
import { IDBFactory } from 'fake-indexeddb';
import { createWorldStandingGoalRunner } from '../shared/agents/WorldStandingGoal.js';
import { WorldStandingGoalStore } from '../../peercompute/src/peercompute/agents/WorldStandingGoalStore.js';

const scope = () => ({ worldId: 'cubechat', agentId: 'guide', goalId: 'welcome', targetId: 'human:owner' });
const speech = () => ({ decision: 'speak', text: 'Welcome to CubeChat!', intent: { type: 'look-at', targetId: 'human:wire-id' } });
const receipt = () => ({ id: 'message-1', status: 'delivered', delivered: 2, total: 2 });
function deferred() {
  let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function fixture(t) {
  const f = { events: [], records: new Map(), claims: 0, sends: 0 };
  const key = value => JSON.stringify(value);
  const get = value => f.records.get(key(value));
  const own = (value, options) => {
    const record = get(value);
    assert.equal(record?.requestId, options.requestId);
    assert(['claimed', 'prepared'].includes(record.status)); return record;
  };
  f.store = {
    async claim(value, options) {
      f.events.push('claim'); f.claims++; options.signal?.throwIfAborted();
      const record = get(value);
      if (record && record.status !== 'failed') return { claimed: false, record,
        reason: record.status === 'complete' ? 'completed' : 'outcome-unknown' };
      const next = { status: 'claimed', requestId: options.requestId }; f.records.set(key(value), next);
      return { claimed: true, record: next };
    },
    async prepare(value, options) {
      f.events.push('prepare'); options.signal?.throwIfAborted();
      const record = own(value, options); assert.equal(record.status, 'claimed');
      Object.assign(record, { status: 'prepared', text: options.text }); return record;
    },
    async finish(value, options) {
      f.events.push(`finish:${options.outcome}`); options.signal?.throwIfAborted();
      const record = own(value, options);
      assert.equal(record.status, options.outcome === 'quiet' ? 'claimed' : 'prepared');
      Object.assign(record, { status: 'complete', outcome: options.outcome, delivery: options.delivery }); return record;
    },
    async fail(value, options) {
      f.events.push('fail'); options.signal?.throwIfAborted();
      const record = own(value, options);
      record.status = record.status === 'prepared' ? 'unknown' : 'failed'; return record;
    }
  };
  f.runner = createWorldStandingGoalRunner({ store: f.store });
  f.input = { scope: scope(), decide: async () => { f.events.push('decide'); return speech(); },
    publish: async () => { f.events.push('publish'); f.sends++; return receipt(); } };
  f.run = extra => f.runner.run({ ...f.input, ...extra });
  f.record = () => get(scope()); t.after(() => f.runner.dispose()); return f;
}

test('speech is prepared before any movement or send, with bounded receipt evidence and one durable encounter', async t => {
  const f = fixture(t); let decisionId;
  const result = await f.run({ decide: async ({ requestId, signal }) => {
    assert.equal(signal.aborted, false); assert.match(requestId, /^[a-f0-9-]{36}$/); decisionId = requestId;
    return speech();
  }, publish: async (decision, { requestId }) => {
    assert.equal(requestId, decisionId); assert.equal(f.record().status, 'prepared');
    assert(Object.isFrozen(decision)); assert(Object.isFrozen(decision.intent));
    f.events.push('publish'); f.sends++;
    return { ...receipt(), recipients: [{ peerId: 'private-recipient' }], cancelled: false };
  } });
  assert.equal(result.status, 'spoken'); assert.equal(result.requestId, decisionId);
  assert.deepEqual(f.events, ['claim', 'prepare', 'publish', 'finish:spoken']);
  assert.deepEqual(f.record().delivery, receipt()); assert.deepEqual(result.delivery, receipt());
  assert.equal((await f.run()).status, 'already-handled'); assert.equal(f.sends, 1);
});

test('a genuine quiet decision completes without publication', async t => {
  const f = fixture(t); const result = await f.run({ decide: async () => ({ decision: 'quiet' }) });
  assert.equal(result.status, 'quiet'); assert.equal(f.record().outcome, 'quiet');
  assert.equal(f.sends, 0); assert.deepEqual(f.events, ['claim', 'finish:quiet']);
  assert.equal((await f.run()).status, 'already-handled');
});

test('claim rejection exposes persisted backoff and terminal reasons without running a model', async t => {
  const f = fixture(t);
  for (const [reason, status] of [['cooldown', 'cooldown'], ['rate-limit', 'cooldown'], ['completed', 'already-handled'],
    ['outcome-unknown', 'unknown'], ['attempts-exhausted', 'blocked'], ['capacity', 'blocked']]) {
    f.store.claim = async () => ({ claimed: false, reason, nextAt: 90000 });
    const result = await f.run(); assert.equal(result.status, status); assert.equal(result.nextAt, 90000);
  }
  assert.deepEqual(f.events, []);
});

test('already cancelled or revoked work does not touch the durable store', async t => {
  const f = fixture(t), controller = new AbortController(); controller.abort();
  assert.equal((await f.run({ signal: controller.signal })).status, 'cancelled');
  assert.equal((await f.run({ isCurrent: () => false })).status, 'cancelled');
  assert.deepEqual(f.events, []);
});

test('cancellation during claim settles its durable attempt before releasing the slot', async t => {
  const f = fixture(t), gate = deferred(), controller = new AbortController(), original = f.store.claim;
  f.store.claim = async (...args) => { const result = await original(...args); await gate.promise; return result; };
  const pending = f.run({ signal: controller.signal }); await flush(); controller.abort();
  assert.equal((await f.run()).status, 'busy'); gate.resolve();
  assert.equal((await pending).status, 'cancelled'); assert.equal(f.record().status, 'failed');
  assert.deepEqual(f.events, ['claim', 'fail']);
});

test('dispose aborts but holds the slot and waits for both inference and durable settlement', async t => {
  const f = fixture(t), inference = deferred(), settlement = deferred(), original = f.store.fail; let seenSignal;
  f.store.fail = async (...args) => { await settlement.promise; return original(...args); };
  const pending = f.run({ decide: async ({ signal }) => { seenSignal = signal; await inference.promise; return speech(); } });
  await flush(); assert.equal((await f.run()).status, 'busy');
  let disposed = false; const disposal = f.runner.dispose().then(() => { disposed = true; });
  assert.strictEqual(f.runner.dispose(), f.runner.dispose()); assert.equal(seenSignal.aborted, true);
  assert.equal((await f.run()).status, 'closed'); await flush(); assert.equal(disposed, false);
  inference.resolve(); await flush(); assert.equal(disposed, false); assert.equal(f.sends, 0);
  settlement.resolve(); assert.equal((await pending).status, 'cancelled'); await disposal;
  assert.equal(disposed, true); assert.equal(f.record().status, 'failed');
});

test('ownership or identity changes during decision invalidate publication and allow a bounded store retry', async t => {
  const f = fixture(t), gate = deferred(); let current = true;
  const pending = f.run({ isCurrent: () => current, decide: async () => { await gate.promise; return speech(); } });
  await flush(); current = false; gate.resolve();
  assert.equal((await pending).status, 'cancelled'); assert.equal(f.record().status, 'failed'); assert.equal(f.sends, 0);
});

test('revocation after preparation becomes terminal unknown and cannot resend', async t => {
  const f = fixture(t), original = f.store.prepare; let current = true;
  f.store.prepare = async (...args) => { const record = await original(...args); current = false; return record; };
  assert.equal((await f.run({ isCurrent: () => current })).status, 'unknown');
  assert.equal(f.record().status, 'unknown'); assert.equal((await f.run()).status, 'unknown'); assert.equal(f.sends, 0);
});

test('preparation storage failure prevents all effects; an ambiguous committed preparation suppresses resend', async t => {
  for (const committed of [false, true]) {
    const f = fixture(t), original = f.store.prepare;
    f.store.prepare = async (...args) => { if (committed) await original(...args); throw Error('Storage interrupted'); };
    const result = await f.run(); assert.equal(result.status, committed ? 'unknown' : 'failed');
    assert.equal(f.record().status, committed ? 'unknown' : 'failed'); assert.equal(f.sends, 0);
    if (committed) assert.equal((await f.run()).status, 'unknown');
  }
});

test('throwing publication leaves terminal unknown even if a message may have been sent', async t => {
  const f = fixture(t);
  const result = await f.run({ publish: async () => { f.sends++; throw Error('Receipt lost after send'); } });
  assert.equal(result.status, 'unknown'); assert.equal(f.record().status, 'unknown');
  assert.equal((await f.run()).status, 'unknown'); assert.equal(f.sends, 1);
});

test('an acknowledged receipt after cancellation is recorded honestly, including partial and local-only delivery', async t => {
  for (const delivery of [receipt(), { ...receipt(), status: 'partial', delivered: 1 },
    { ...receipt(), status: 'failed', delivered: 0 }, { ...receipt(), status: 'local-only', delivered: 0, total: 0 }]) {
    const f = fixture(t), controller = new AbortController();
    const result = await f.run({ signal: controller.signal, publish: async () => { controller.abort(); return delivery; } });
    assert.equal(result.status, 'spoken'); assert.deepEqual(f.record().delivery, delivery);
  }
});

test('failed completion storage preserves uncertainty and does not pretend publication completed', async t => {
  for (const committed of [false, true]) {
    const f = fixture(t), original = f.store.finish;
    f.store.finish = async (...args) => { if (committed) await original(...args); throw Error('Completion write failed'); };
    const result = await f.run(); assert.equal(result.status, 'unknown'); assert.deepEqual(result.delivery, receipt());
    assert.equal(f.record().status, committed ? 'complete' : 'unknown');
    assert.equal((await f.run()).status, committed ? 'already-handled' : 'unknown'); assert.equal(f.sends, 1);
  }
});

test('malformed or oversized decisions fail before preparation without converting errors to permanent quiet', async t => {
  const f = fixture(t);
  for (const decision of [null, 'speak', { decision: 'speak', text: '' }, { decision: 'quiet', reason: 'invalid-output' },
    { decision: 'speak', text: 'hello\0' }, { decision: 'speak', text: '😀'.repeat(451) },
    { decision: 'speak', text: '\ud800' }, { ...speech(), intent: { type: 'teleport', targetId: 'human:x' } }]) {
    assert.equal((await f.run({ decide: async () => decision })).status, 'failed');
    assert.equal(f.record().status, 'failed');
  }
  assert(!f.events.includes('prepare')); assert.equal(f.sends, 0);
});

test('malformed publication receipts cannot masquerade as confirmed delivery', async t => {
  for (const delivery of [undefined, { ...receipt(), status: 'sending' }, { ...receipt(), delivered: 999 },
    { ...receipt(), status: 'local-only' }, { ...receipt(), status: 'delivered', delivered: 0 }]) {
    const f = fixture(t); assert.equal((await f.run({ publish: async () => delivery })).status, 'unknown');
    assert.equal(f.record().status, 'unknown');
  }
});

test('scope mutation while inference is pending cannot retarget the durable record', async t => {
  const f = fixture(t), gate = deferred(), mutableScope = scope();
  const pending = f.run({ scope: mutableScope, decide: async () => { await gate.promise; return speech(); } });
  await flush(); mutableScope.targetId = 'human:other'; gate.resolve();
  assert.equal((await pending).status, 'spoken'); assert.equal(f.record().status, 'complete'); assert.equal(f.records.size, 1);
});

test('a claim storage error fails closed without running inference or publication', async t => {
  const f = fixture(t); f.store.claim = async () => { throw Error('Storage unavailable'); };
  const result = await f.run(); assert.equal(result.status, 'unknown');
  assert.equal(f.sends, 0); assert(!f.events.includes('decide'));
});

test('the active slot survives successful send until its completion write settles', async t => {
  const f = fixture(t), gate = deferred(), original = f.store.finish, controller = new AbortController();
  f.store.finish = async (...args) => { await gate.promise; return original(...args); };
  const pending = f.run({ signal: controller.signal }); await flush(); controller.abort();
  assert.equal((await f.run()).status, 'busy'); assert.equal(f.sends, 1);
  gate.resolve(); assert.equal((await pending).status, 'spoken'); assert.equal(f.record().status, 'complete');
});

test('real IndexedDB ledger suppresses completed welcomes after both runner and store reopen', async t => {
  const indexedDBImpl = new IDBFactory();
  const store = new WorldStandingGoalStore({ indexedDBImpl }); await store.open();
  const runner = createWorldStandingGoalRunner({ store }); let sends = 0;
  const input = { scope: scope(), decide: async () => speech(), publish: async () => { sends++; return receipt(); } };
  assert.equal((await runner.run(input)).status, 'spoken');
  await runner.dispose(); await store.destroy();
  const reopened = new WorldStandingGoalStore({ indexedDBImpl }); await reopened.open();
  const next = createWorldStandingGoalRunner({ store: reopened });
  t.after(async () => { await next.dispose(); await reopened.destroy(); });
  assert.equal((await next.run(input)).status, 'already-handled'); assert.equal(sends, 1);
  assert.deepEqual((await reopened.get(scope())).delivery, receipt());
});

test('real ledger accepts bounded Unicode failures and enforces its retry cooldown', async t => {
  const store = new WorldStandingGoalStore({ indexedDBImpl: new IDBFactory(), now: () => 100_000 }); await store.open();
  const runner = createWorldStandingGoalRunner({ store });
  t.after(async () => { await runner.dispose(); await store.destroy(); });
  const input = { scope: scope(), decide: async () => { throw Error('\0' + '😀'.repeat(500)); },
    publish: async () => { assert.fail('Failed inference cannot publish'); } };
  const result = await runner.run(input); assert.equal(result.status, 'failed');
  assert.equal(new TextEncoder().encode(result.record.error).length, 512);
  const next = await runner.run(input); assert.equal(next.status, 'cooldown'); assert.equal(next.nextAt, 190_000);
});
