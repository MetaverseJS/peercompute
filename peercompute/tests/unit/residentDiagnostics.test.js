import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { ResidentDiagnosticsStore } from '../../src/peercompute/agents/ResidentDiagnosticsStore.js';
import { normalizeResidentDiagnostic, RESIDENT_DIAGNOSTICS_LIMITS as LIMITS,
  residentDiagnosticBytes } from '../../src/peercompute/agents/ResidentDiagnosticsContracts.js';

const scope = { agentId: 'skeletor', worldId: 'cubechat:room' };
const row = (status = 'waiting', change = {}) => ({ ...scope, source: 'room-chat', stage: 'inference', status,
  message: 'Waiting for a model', operationId: 'operation-1', route: { modelLabel: 'Qwen', manifestCid: 'bafy-model', local: false, peerId: 'host' }, ...change });
async function fixture(t, options = {}) {
  const indexedDBImpl = options.indexedDBImpl ?? new IDBFactory(); let when = 10000;
  const store = new ResidentDiagnosticsStore({ indexedDBImpl, flushDelayMs: 0, now: () => when++, ...options });
  await store.open(); t.after(() => store.close()); return { store, indexedDBImpl, setTime: time => { when = time; } };
}

test('owner-local diagnostic ring survives reload, scopes worlds/residents, and returns detached rows', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const first = await store.append(row('error', { errorCode: 'ERR_MODEL_CONTEXT_BUDGET', details: { inputTokens: 9000, contextLength: 8192 } }));
  await store.append(row('waiting', { agentId: 'heman' })); await store.append(row('waiting', { worldId: 'earth:room' }));
  assert.deepEqual(await store.list(scope), [first]);
  const detached = await store.list(scope); detached[0].route.modelLabel = 'mutated';
  assert.equal((await store.list(scope))[0].route.modelLabel, 'Qwen');
  await store.close(); const reopened = new ResidentDiagnosticsStore({ indexedDBImpl }); await reopened.open(); t.after(() => reopened.close());
  assert.deepEqual(await reopened.list(scope), [first]); assert.equal(reopened.status().lastError, null);
});

test('strict projection excludes transcripts, arrays, raw errors and unknown nested metadata', () => {
  const input = row('error', { prompt: 'secret prompt', output: 'secret answer', image: new Uint8Array([1]),
    rawEvent: { prompt: 'private' }, route: { modelLabel: 'Qwen', manifestCID: 'bafy-model', local: true, secret: 'secret route' },
    details: { task: 'text-generation', inputTokens: 1, requiredTokens: 2, contextLength: 3, outputTokens: 4,
      committed: false, outputStarted: false, pauseCause: 'automatic', prompt: 'secret detail', tensor: [1, 2] } });
  const normalized = normalizeResidentDiagnostic(input, { when: 123, id: 'row-1' }), serialized = JSON.stringify(normalized);
  assert.equal(normalized.route.manifestCid, 'bafy-model'); assert(!Object.hasOwn(normalized.route, 'manifestCID'));
  for (const secret of ['secret', 'rawEvent', 'tensor', 'image', 'prompt', 'output"']) assert(!serialized.includes(secret));
  assert.equal(normalized.details.requiredTokens, 2); assert.equal(normalized.details.pauseCause, 'automatic');
  for (const value of [NaN, Infinity, -1, '123', {}, []]) {
    assert.throws(() => normalizeResidentDiagnostic(row('error', { details: { latencyMs: value } }), { when: 1 }), /latencyMs/);
  }
  assert.throws(() => normalizeResidentDiagnostic(row('error', { details: { committed: 'true' } }), { when: 1 }), /committed/);
});

test('messages are UTF8 bounded and signed URL credentials do not persist', async t => {
  const { store } = await fixture(t);
  const saved = await store.append(row('error', { message: 'Fetch https://user:pw@example.test/path?token=PRIVATE#private failed ' + '💡'.repeat(300) }));
  assert(saved.message.startsWith('Fetch https://example.test/path failed '));
  assert(!saved.message.includes('PRIVATE')); assert(!saved.message.includes('user')); assert(!saved.message.includes('pw'));
  assert(new TextEncoder().encode(saved.message).length <= LIMITS.messageBytes);
});

test('scheduler duplicates coalesce while distinct requests, errors, routes and outcomes remain separate', async t => {
  const { store, setTime } = await fixture(t, { flushDelayMs: 1000 });
  const queued = [store.append(row()), store.append(row()), store.append(row())]; await store.flush();
  const results = await Promise.all(queued); assert(results.every(value => value.id === results[0].id));
  assert.equal((await store.list(scope))[0].repeatCount, 3);
  const fourth = store.append(row()); await store.flush(); assert.equal((await fourth).repeatCount, 4);
  for (const change of [{ operationId: 'operation-2' }, { messageId: 'message-2' }, { errorCode: 'ERR_OTHER' },
    { route: { modelLabel: 'Another' } }, { message: 'A different reason' }, { details: { attempt: 2 } }]) {
    const next = store.append(row('waiting', change)); await store.flush(); await next;
  }
  assert.equal((await store.list(scope)).length, 7);
  setTime(30000); const later = store.append(row()); await store.flush(); await later;
  assert.equal((await store.list(scope)).length, 8);
});

test('retention evicts diagnostics atomically at resident, total and byte bounds', async t => {
  const { store } = await fixture(t, { maximumPerResident: 2, maximumEntries: 3 });
  for (let i = 0; i < 3; i += 1) await store.append(row('waiting', { operationId: `op-${i}` }));
  assert.deepEqual((await store.list(scope)).map(value => value.operationId), ['op-2', 'op-1']);
  for (let i = 0; i < 2; i += 1) await store.append(row('waiting', { agentId: 'heman', operationId: `other-${i}` }));
  assert.deepEqual((await store.list(scope)).map(value => value.operationId), ['op-2']); assert.equal(store.status().evicted, 2);
  const byteBound = await fixture(t, { maximumBytes: 700 });
  for (let i = 0; i < 6; i += 1) await byteBound.store.append(row('waiting', { operationId: `byte-${i}` }));
  const rows = await byteBound.store.list(scope);
  assert(rows.length > 0 && rows.length < 6); assert(rows.reduce((sum, value) => sum + residentDiagnosticBytes(value), 0) <= 700);
  assert.equal(rows[0].operationId, 'byte-5');
});

test('pending telemetry is bounded and subscriptions cannot interrupt a write', async t => {
  const { store } = await fixture(t, { flushDelayMs: 1000 }); const seen = [];
  store.subscribe(() => { throw new Error('broken observer'); }); store.subscribe(async () => { throw new Error('broken async observer'); });
  const unsubscribe = store.subscribe(event => seen.push(event));
  const pending = Array.from({ length: LIMITS.pending + 3 }, (_, i) => store.append(row('waiting', { operationId: `op-${i}` })));
  assert.equal(store.status().pending, LIMITS.pending); await store.flush();
  assert.equal((await Promise.all(pending)).filter(value => value === null).length, 3);
  assert.equal(store.status().dropped, 3); assert(seen.some(event => event.type === 'status'));
  assert.equal((await store.list(scope)).length, LIMITS.pending); unsubscribe();
});

test('storage failures remain visible and never reject append or fabricate a retained row', async t => {
  const { store } = await fixture(t), original = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function () { throw new DOMException('Quota reached', 'QuotaExceededError'); };
  try { assert.equal(await store.append(row()), null); } finally { IDBObjectStore.prototype.put = original; }
  assert.equal(store.status().lastError.code, 'QuotaExceededError'); assert.equal(store.status().lastError.operation, 'write');
  assert.deepEqual(await store.list(scope), []);
  assert(await store.append(row('ready'))); assert.equal((await store.list(scope)).length, 1);
  assert.equal(store.status().lastError.code, 'QuotaExceededError'); // Successful later writes do not erase the evidence.
  assert.equal(await store.append(row('error', { details: { latencyMs: Infinity } })), null);
  assert.equal(store.status().lastError.operation, 'append');
});

test('unavailable IndexedDB is fail-soft and observable, without unhandled rejected promises', async () => {
  const store = new ResidentDiagnosticsStore({ indexedDBImpl: null, flushDelayMs: 0 });
  assert.equal(await store.append(row()), null); assert.match(store.status().lastError.message, /IndexedDB/);
  await store.destroy(); assert.equal(await store.append(row()), null); assert.equal(store.status().closed, true);
});

test('abort fences pending diagnostics and scoped clear preserves unrelated history', async t => {
  const { store } = await fixture(t, { flushDelayMs: 1000 }), controller = new AbortController();
  const pending = store.append(row(), { signal: controller.signal }); controller.abort(); await store.flush();
  assert.equal(await pending, null); assert.deepEqual(await store.list(scope), []);
  const retained = store.append(row('error')); await store.flush(); await retained;
  const other = store.append(row('error', { agentId: 'heman' })); await store.flush(); await other;
  const late = store.append(row('ready')); assert.equal(await store.clear(scope), 2); await late;
  assert.deepEqual(await store.list(scope), []); assert.equal((await store.list({ ...scope, agentId: 'heman' })).length, 1);
  await assert.rejects(store.list(scope, { signal: controller.signal }), { name: 'AbortError' });
  await assert.rejects(store.clear(scope, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(store.status().lastError, null);
});

test('concurrent handles retain both requests and honor atomic global capacity', async t => {
  const { store, indexedDBImpl } = await fixture(t, { maximumEntries: 2 });
  const other = new ResidentDiagnosticsStore({ indexedDBImpl, maximumEntries: 2, flushDelayMs: 0, now: () => 10002 });
  await other.open(); t.after(() => other.close());
  await Promise.all([store.append(row('running', { operationId: 'op-a' })), other.append(row('running', { operationId: 'op-b' }))]);
  assert.deepEqual(new Set((await store.list(scope)).map(value => value.operationId)), new Set(['op-a', 'op-b']));
  await other.append(row('completed', { operationId: 'op-c' })); assert.equal((await store.list(scope)).length, 2);
});

test('destroy flushes pending diagnostics once and never deletes persistent data', async t => {
  let destroyed = 0;
  const { store, indexedDBImpl } = await fixture(t, { flushDelayMs: 1000, onDestroy: () => { destroyed += 1; } });
  const pending = store.append(row('error')); await Promise.all([store.close(), store.dispose(), store.destroy()]);
  assert(await pending); assert.equal(destroyed, 1); assert.equal(store.status().closed, true);
  const reopened = new ResidentDiagnosticsStore({ indexedDBImpl }); await reopened.open(); t.after(() => reopened.close());
  assert.equal((await reopened.list(scope)).length, 1);
});

test('an idle flush does not strand an immediately following append', { timeout: 1000 }, async t => {
  const { store } = await fixture(t);
  const idle = store.flush(), appended = store.append(row('ready'));
  await idle; assert(await appended); assert.equal((await store.list(scope)).length, 1);
});
