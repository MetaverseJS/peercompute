import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../src/peercompute/agents/AgentRecordStore.js';
import { AGENT_LIMITS, normalizeAgentInput, normalizeAgentRecord } from '../../src/peercompute/agents/AgentContracts.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

function locks() {
  const held = new Set();
  return { async request(name, options, callback) {
    assert.equal(options.mode, 'exclusive'); assert.equal(options.ifAvailable, true);
    if (held.has(name)) return callback(null);
    held.add(name); try { return await callback({ name }); } finally { held.delete(name); }
  } };
}
async function setup(t, options = {}) {
  const store = new AgentRecordStore({ indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange, lockManager: locks(), ...options });
  await store.open(); t.after(() => store.destroy()); return store;
}
const input = { name: 'Ada', instructions: 'Describe local scenes.', goals: ['Observe'], summary: '', inferenceMode: 'local-only' };
const deferred = () => { let resolve; const promise = new Promise((r) => { resolve = r; }); return { promise, resolve }; };

test('pause provenance survives storage and ambiguous legacy or restored pauses remain owner-controlled', async t => {
  const store = await setup(t), created = await store.create(input);
  assert.equal(created.pauseCause, 'owner');
  const automatic = await store.commit(created.agentId, { expectedRevision: created.revision,
    head: { ...created, pauseCause: 'automatic' } });
  assert.equal((await store.get(created.agentId)).pauseCause, 'automatic');
  const exported = await store.export(created.agentId);
  assert.equal(exported.agent.pauseCause, 'owner');
  assert.equal((await store.restoreAsNew(exported)).pauseCause, 'owner');
  const legacy = { ...automatic }; delete legacy.pauseCause;
  await store._transaction(['heads'], 'readwrite', async tx => {
    const data = tx.objectStore('heads');
    const row = await new Promise((resolve, reject) => { const req = data.get(created.agentId); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
    row.record = legacy; data.put(row);
  });
  assert.equal((await store.get(created.agentId)).pauseCause, 'owner');
  assert.equal((await store.list()).find(head => head.agentId === created.agentId).pauseCause, 'owner');
  assert.throws(() => normalizeAgentRecord({ ...created, pauseCause: 'any-peer' }), /pause cause/);
  assert.equal(normalizeAgentRecord({ ...created, status: 'waiting' }).pauseCause, null);
});

test('private record and atomic operation journal survive reopening without replay', async (t) => {
  const indexedDBImpl = new IDBFactory(), lockManager = locks();
  const first = await setup(t, { name: 'reopen', indexedDBImpl, lockManager });
  const head = await first.create(input);
  assert.equal(head.agentKind, 'general'); assert.equal(head.status, 'paused'); assert.equal(head.revision, 1);
  const prepared = await first.commit(head.agentId, { expectedRevision: 1, head: { ...head, status: 'running' },
    event: { type: 'intent', text: 'Observe now' }, operation: { id: 'step-1', status: 'prepared', policyRevision: 1 } });
  assert.equal(prepared.pendingOperation.id, 'step-1');
  await first.destroy();
  const second = await setup(t, { name: 'reopen', indexedDBImpl, lockManager });
  assert.equal(second.hostId, head.authority.hostId);
  assert.deepEqual(await second.get(head.agentId), prepared);
  assert.equal((await second.events(head.agentId))[0].sequence, 1);
  await second.withRun(head.agentId, async ({ head: restored }) => {
    assert.equal(restored.pendingOperation.status, 'prepared');
    const paused = await second.commit(head.agentId, { expectedRevision: restored.revision,
      head: { ...restored, status: 'paused' }, operation: { id: 'step-1', status: 'outcome-unknown' } });
    assert.equal(paused.pendingOperation, null);
  });
  assert.equal((await second.getOperation(head.agentId, 'step-1')).status, 'outcome-unknown');
  await assert.rejects(second.commit(head.agentId, { expectedRevision: 3, operation: { id: 'step-1', status: 'prepared' } }), { code: 'ERR_AGENT_OPERATION_CONFLICT' });
});

test('two independent handles race revisions: only one complete checkpoint wins', async (t) => {
  const indexedDBImpl = new IDBFactory(), lockManager = locks();
  const a = await setup(t, { indexedDBImpl, lockManager }), b = await setup(t, { indexedDBImpl, lockManager });
  const head = await a.create(input);
  const results = await Promise.allSettled([a, b].map((store, index) => store.commit(head.agentId, {
    expectedRevision: head.revision, head: { ...head, context: { summary: `Writer ${index}` } },
    event: { type: 'note', text: `Writer ${index}` }, operation: { id: `step-${index}`, status: 'prepared' },
  })));
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  assert.equal(results.find((result) => result.status === 'rejected').reason.code, 'ERR_AGENT_CONFLICT');
  assert.equal((await a.events(head.agentId)).length, 1); assert.equal((await a.operations(head.agentId)).length, 1);
  assert.equal((await a.get(head.agentId)).revision, 2);
});

test('request success followed by transaction abort is never acknowledged or partially journaled', async (t) => {
  const store = await setup(t); const head = await store.create(input);
  const transaction = store.database.transaction.bind(store.database);
  store.database.transaction = (names, mode) => {
    const tx = transaction(names, mode);
    if (mode === 'readwrite') {
      const heads = tx.objectStore('heads'), put = heads.put.bind(heads);
      heads.put = (...args) => { const req = put(...args); req.addEventListener('success', () => tx.abort()); return req; };
    }
    return tx;
  };
  await assert.rejects(store.commit(head.agentId, { expectedRevision: 1, event: { type: 'intent' },
    operation: { id: 'failed', status: 'prepared' } }));
  store.database.transaction = transaction;
  assert.deepEqual(await store.get(head.agentId), head);
  assert.deepEqual(await store.events(head.agentId), []); assert.deepEqual(await store.operations(head.agentId), []);
});

test('real quota failure propagates and rollback preserves old head and unrelated agents', async (t) => {
  const store = await setup(t), head = await store.create(input), other = await store.create({ ...input, name: 'Other' });
  const transaction = store.database.transaction.bind(store.database);
  const quota = new DOMException('Injected native write failure', 'QuotaExceededError');
  store.database.transaction = (names, mode) => {
    const tx = transaction(names, mode);
    if (mode === 'readwrite') tx.objectStore('heads').put = () => { throw quota; };
    return tx;
  };
  await assert.rejects(store.commit(head.agentId, { expectedRevision: 1, event: { text: 'Unsaved' } }), (error) => error === quota);
  store.database.transaction = transaction;
  assert.deepEqual(await store.get(head.agentId), head); assert.deepEqual(await store.get(other.agentId), other);
  assert.deepEqual(await store.events(head.agentId), []);
});

test('run exclusion stays held through cancellation cleanup; missing locks fail closed', async (t) => {
  const indexedDBImpl = new IDBFactory(), lockManager = locks();
  const a = await setup(t, { indexedDBImpl, lockManager }), b = await setup(t, { indexedDBImpl, lockManager });
  const head = await a.create(input), controller = new AbortController(), entered = deferred(), cleanup = deferred();
  const running = a.withRun(head.agentId, async ({ signal }) => {
    entered.resolve();
    await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
    await cleanup.promise;
  }, { signal: controller.signal });
  await entered.promise; controller.abort();
  await assert.rejects(b.withRun(head.agentId, () => {}), { code: 'ERR_AGENT_BUSY' });
  await assert.rejects(b.delete(head.agentId, { expectedRevision: 1 }), { code: 'ERR_AGENT_BUSY' });
  cleanup.resolve(); await running;
  assert.equal(await b.withRun(head.agentId, () => 'available'), 'available');
  b.lockManager = null;
  await assert.rejects(b.withRun(head.agentId, () => assert.fail('Must not execute')), { code: 'ERR_AGENT_LOCK_UNAVAILABLE' });
});

test('private RGBA, events and operation completion are committed together and export omits bytes', async (t) => {
  const store = await setup(t), head = await store.create(input);
  const image = { id: 'image-1', width: 2, height: 1, channels: 4, data: new Uint8Array([255, 0, 0, 255, 0, 0, 255, 255]) };
  const saved = await store.commit(head.agentId, { expectedRevision: 1,
    event: { type: 'user', text: 'Describe image', attachmentIds: ['image-1'] }, attachments: [image] });
  image.data.fill(0);
  assert.equal((await store.getAttachment(head.agentId, 'image-1')).data[0], 255);
  const exported = await store.export(head.agentId);
  assert.equal(exported.agent.status, 'paused'); assert.equal(exported.attachmentsOmitted, true);
  assert.deepEqual(exported.attachments, [{ id: 'image-1', width: 2, height: 1, channels: 4, omitted: true }]);
  assert.equal(JSON.stringify(exported).includes('"data"'), false);
  const restored = await store.restoreAsNew(exported);
  assert.notEqual(restored.agentId, head.agentId); assert.equal(restored.status, 'paused');
  assert.equal(restored.pendingOperation, null); assert.deepEqual(await store.operations(restored.agentId), []);
  assert.equal((await store.events(restored.agentId))[0].attachmentsOmitted, true);
  assert.equal((await store.events(restored.agentId))[0].attachmentIds, undefined);
  await store.delete(head.agentId, { expectedRevision: saved.revision });
  assert.equal(await store.get(head.agentId), undefined); assert.equal(await store.getAttachment(head.agentId, 'image-1'), undefined);
  assert.equal((await store.get(restored.agentId)).agentId, restored.agentId);
});

test('schema and byte bounds reject hostile edits without mutating authority or history', async (t) => {
  const store = await setup(t), head = await store.create(input);
  assert.throws(() => normalizeAgentInput({ ...input, instructions: '😀'.repeat(5000) }), /instructions/);
  assert.throws(() => normalizeAgentRecord({ ...head, schema: 'peercompute.agent.v99' }), /schema/);
  assert.throws(() => normalizeAgentRecord({ ...head, authority: { ...head.authority, epoch: 1 } }), /authority/);
  await assert.rejects(store.commit(head.agentId, { expectedRevision: 1,
    head: { ...head, authority: { ...head.authority, hostId: 'other-host' } } }), /authority/);
  await assert.rejects(store.commit(head.agentId, { expectedRevision: 1, event: { text: 'a'.repeat(AGENT_LIMITS.eventBytes) } }), /byte budget/);
  await assert.rejects(store.commit(head.agentId, { expectedRevision: 1,
    event: JSON.parse('{"__proto__":{"inferenceMode":"network-assisted"}}') }), /key/);
  await assert.rejects(store.commit(head.agentId, { expectedRevision: 1, event: { attachmentIds: ['missing'] } }), /missing/);
  assert.deepEqual(await store.get(head.agentId), head); assert.deepEqual(await store.events(head.agentId), []);
});

test('events page independently from revisions and returned records are detached copies', async (t) => {
  const store = await setup(t); let head = await store.create(input);
  head = await store.commit(head.agentId, { expectedRevision: head.revision, head: { ...head, status: 'waiting' } });
  for (let i = 0; i < 3; i++) head = await store.commit(head.agentId, { expectedRevision: head.revision, event: { text: `${i}` } });
  assert.equal(head.revision, 5);
  assert.deepEqual((await store.events(head.agentId, { after: 1, limit: 1 })).map((value) => value.sequence), [2]);
  const results = await store.list(); results[0].identity.name = 'Mutated';
  assert.equal((await store.get(head.agentId)).identity.name, 'Ada');
});

test('restore failures are atomic and never revive exported ownership or requests', async (t) => {
  const store = await setup(t); let head = await store.create({ ...input, inferenceMode: 'network-assisted' });
  head = await store.commit(head.agentId, { expectedRevision: 1, event: { text: 'Saved text' },
    operation: { id: 'pending', status: 'prepared' } });
  const exported = await store.export(head.agentId);
  const transaction = store.database.transaction.bind(store.database);
  store.database.transaction = (names, mode) => {
    const tx = transaction(names, mode);
    if (mode === 'readwrite') tx.objectStore('events').add = () => { throw new DOMException('Injected restore quota', 'QuotaExceededError'); };
    return tx;
  };
  await assert.rejects(store.restoreAsNew(exported), { name: 'QuotaExceededError' });
  store.database.transaction = transaction;
  assert.equal((await store.list()).length, 1);
  assert.deepEqual(await store.get(head.agentId), head);
  const restored = await store.restoreAsNew(exported);
  assert.equal(restored.policy.inferenceMode, 'local-only'); assert.equal(restored.pendingOperation, null);
  assert.equal(restored.revision, 1); assert.equal(restored.authority.hostId, store.hostId);
});

test('unavailable persistence never falls back, and destroy awaits owned runner cleanup', async (t) => {
  const denied = new AgentRecordStore({ indexedDBImpl: null, keyRange: IDBKeyRange });
  await assert.rejects(denied.open(), { code: 'ERR_AGENT_STORAGE_UNAVAILABLE' });
  const store = await setup(t), head = await store.create(input), entered = deferred(), cleanup = deferred();
  const running = store.withRun(head.agentId, async ({ signal }) => {
    entered.resolve(); await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
    await cleanup.promise;
  });
  await entered.promise; let closed = false;
  const closing = store.destroy().then(() => { closed = true; });
  await new Promise((resolve) => setTimeout(resolve, 5)); assert.equal(closed, false);
  cleanup.resolve(); await running; await closing; assert.equal(store.database, null);
});

test('StateManager owns private stores without initializing or writing Yjs', async () => {
  const state = new StateManager(null, { enablePersistence: false, disableNetworkProvider: true });
  let updates = 0; state.ydoc.on('update', () => updates++);
  const store = state.createAgentRecordStore({ name: 'private', indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange, lockManager: locks() });
  await store.open(); await store.create(input);
  assert.equal(state.getAgentRecordStore('private'), store); assert.equal(updates, 0); assert.equal(state.state.size, 0);
  assert.throws(() => state.createAgentRecordStore({ name: 'private' }), /already registered/);
  await state.destroy(); assert.equal(store.destroyed, true); assert.equal(state.getAgentRecordStore('private'), null);
});
