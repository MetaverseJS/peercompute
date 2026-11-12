import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { WorldKnowledgeStore } from '../../src/peercompute/agents/WorldKnowledgeStore.js';
import { normalizeWorldKnowledgeRecord, worldKnowledgeStatus, WORLD_KNOWLEDGE_LIMITS } from '../../src/peercompute/agents/WorldKnowledgeContracts.js';

const scope = { agentId: 'ada', worldId: 'cubechat:room', audience: 'private', conversationId: 'owner-a' };
const evidence = (id, change = {}) => ({ ...scope, episodeId: `episode-${id}`, eventId: `event-${id}`,
  sourceKind: 'authenticated-message', provenance: 'observed', when: 99000, peerId: 'owner-a', ...change });
const place = (id = 'meeting', change = {}) => ({ ...scope, id, kind: 'place', subjectType: 'place', subjectId: `place-${id}`,
  label: 'Our meeting spot', note: 'The owner named this spot.', position: [2, 3, 4], confidence: 'observed',
  lastSeenAt: 99000, evidence: [evidence(id)], ...change });
const create = (store, input) => store.put(input, { expectedRevision: 0 });
async function fixture(t, options = {}) {
  const indexedDBImpl = options.indexedDBImpl ?? new IDBFactory(); let clock = 100000;
  const store = new WorldKnowledgeStore({ indexedDBImpl, now: () => clock++, ...options });
  await store.open(); t.after(() => store.close()); return { store, indexedDBImpl, setClock: value => { clock = value; } };
}
function scopedPlace(id, change) {
  const attribution = Object.fromEntries(Object.entries(change).filter(([key]) => Object.hasOwn(scope, key)));
  return place(id, { ...change, evidence: [evidence(id, attribution)] });
}

test('durable knowledge survives reload and episode-retention ages without widening conversation scope', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const record = await create(store, place());
  for (const [index, change] of [{ agentId: 'bert' }, { worldId: 'cubechat:other' }, { audience: 'public' }, { conversationId: 'visitor' }].entries()) {
    await create(store, scopedPlace(`other-${index}`, change));
    assert.equal(await store.get({ ...scope, ...change }, record.id), undefined);
  }
  assert.deepEqual(await store.list(scope), [record]); await store.close();
  const reopened = new WorldKnowledgeStore({ indexedDBImpl, now: () => 100000 + 60 * 86400000 }); await reopened.open(); t.after(() => reopened.close());
  assert.deepEqual(await reopened.get(scope, record.id), record);
  assert.equal(worldKnowledgeStatus(record, 100000 + 60 * 86400000), 'stale');
  const detached = await reopened.list(scope); detached[0].position[0] = 100;
  assert.deepEqual((await reopened.get(scope, record.id)).position, [2, 3, 4]);
});

test('familiarity is keyed by exact subject identity, never a display name or last-seen position', async t => {
  const { store } = await fixture(t);
  for (const id of ['alice-a', 'alice-b']) await create(store, place(id, { kind: 'person', subjectType: 'peer', subjectId: id,
    label: 'Alice', note: 'Said hello', position: [1, 2, 3] }));
  const records = await store.list(scope);
  assert.deepEqual(records.map(record => record.subjectId), ['alice-a', 'alice-b']);
  assert.equal(worldKnowledgeStatus(records[0], 100000), 'fresh');
  assert.equal(worldKnowledgeStatus(records[0], 100000 + WORLD_KNOWLEDGE_LIMITS.personFreshMs), 'stale');
  assert.deepEqual(records[0].position, [1, 2, 3]); // Historical evidence is not a new live observation.
  assert.equal(worldKnowledgeStatus({ ...records[0], confidence: 'reported' }, 100000), 'unverified');
});

test('independent handles serialize revisions and preserve an owner correction against stale inference', async t => {
  const { store, indexedDBImpl } = await fixture(t), first = await create(store, place());
  const second = new WorldKnowledgeStore({ indexedDBImpl, now: () => 100100 }); await second.open(); t.after(() => second.close());
  const results = await Promise.allSettled([
    store.put({ ...first, note: 'Corrected by owner' }, { expectedRevision: 1 }),
    second.put({ ...first, note: 'Late inference overwrite' }, { expectedRevision: 1 })
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.code, 'ERR_WORLD_KNOWLEDGE_CONFLICT');
  const updated = await store.get(scope, first.id); assert.equal(updated.revision, 2); assert.equal(updated.createdAt, first.createdAt);
  await assert.rejects(store.put({ ...updated, subjectId: 'another-place' }, { expectedRevision: 2 }), /immutable/);
  await assert.rejects(store.forget(scope, first.id, { expectedRevision: 1 }), { code: 'ERR_WORLD_KNOWLEDGE_CONFLICT' });
  assert.throws(() => store.put(place()), /expectedRevision/);
});

test('forget persists a content-free tombstone and prevents late recreation under both old and fresh IDs', async t => {
  const { store, indexedDBImpl } = await fixture(t), first = await create(store, place());
  const forgotten = await store.forget(scope, first.id, { expectedRevision: 1 }); assert.equal(forgotten.revision, 2);
  assert.equal(await store.get(scope, first.id), undefined); assert.deepEqual(await store.list(scope), []);
  assert.deepEqual(await store.snapshot({ ...scope, includePrivate: true }), []);
  const rows = await store._transaction('readonly', records => new Promise((resolve, reject) => {
    const req = records.getAll(); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  }));
  const serialized = JSON.stringify(rows);
  for (const field of ['Our meeting spot', 'The owner named', 'position', 'evidence', 'event-meeting']) assert(!serialized.includes(field));
  await store.close(); const reopened = new WorldKnowledgeStore({ indexedDBImpl, now: () => 101000 }); await reopened.open(); t.after(() => reopened.close());
  await assert.rejects(reopened.put(first, { expectedRevision: 1 }), { code: 'ERR_WORLD_KNOWLEDGE_FORGOTTEN' });
  await assert.rejects(create(reopened, place('new-id', { subjectId: first.subjectId })), { code: 'ERR_WORLD_KNOWLEDGE_FORGOTTEN' });
  assert.equal((await reopened.stats()).forgottenEntries, 1);
});

test('capacity rejects atomically and includes forgotten identities without evicting other residents', async t => {
  const { store } = await fixture(t, { maximumEntries: 2, maximumPerResident: 1 });
  const first = await create(store, place());
  await assert.rejects(create(store, place('other')), /capacity/);
  await create(store, scopedPlace('bert', { agentId: 'bert' }));
  await assert.rejects(create(store, scopedPlace('carol', { agentId: 'carol' })), /capacity/);
  assert.deepEqual(await store.get(scope, first.id), first);
  await store.forget(scope, first.id, { expectedRevision: 1 });
  await assert.rejects(create(store, place('after-forget')), /capacity/);
  assert.deepEqual((await store.stats()).retainedEntries, 1);
  const { store: tiny } = await fixture(t, { name: 'tiny', maximumBytes: 300 });
  await assert.rejects(create(tiny, place()), /capacity/); assert.equal((await tiny.stats()).retainedEntries, 0);
});

test('quota failure and cancellation preserve prior data and acknowledge no successful mutation', async t => {
  const { store } = await fixture(t), first = await create(store, place());
  const put = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args) {
    if (this.name === 'records') throw new DOMException('Owned injected storage failure', 'QuotaExceededError');
    return put.apply(this, args);
  };
  try {
    await assert.rejects(store.put({ ...first, note: 'Lost update' }, { expectedRevision: 1 }), { name: 'QuotaExceededError' });
    await assert.rejects(store.forget(scope, first.id, { expectedRevision: 1 }), { name: 'QuotaExceededError' });
  } finally { IDBObjectStore.prototype.put = put; }
  assert.deepEqual(await store.get(scope, first.id), first);
  await assert.rejects(store.put({ ...first, note: 'Cancelled' }, { expectedRevision: 1, signal: AbortSignal.abort() }), { name: 'AbortError' });
  assert.deepEqual(await store.get(scope, first.id), first);
});

test('authority is rechecked after IndexedDB reads and before mutation with no asynchronous guard acceptance', async t => {
  const { store } = await fixture(t); let current = true;
  const pending = store.put(place(), { expectedRevision: 0, isCurrent: () => current });
  current = false;
  await assert.rejects(pending, { name: 'AbortError' }); assert.deepEqual(await store.list(scope), []);
  const record = await store.put(place(), { expectedRevision: 0, isCurrent: () => true });
  current = true;
  const forgetting = store.forget(scope, record.id, { expectedRevision: 1, isCurrent: () => current });
  current = false;
  await assert.rejects(forgetting, { name: 'AbortError' }); assert.deepEqual(await store.get(scope, record.id), record);
  await assert.rejects(store.put({ ...record, note: 'async guard' }, { expectedRevision: 1, isCurrent: async () => true }), /synchronous boolean/);
  assert.throws(() => store.put(place(), { expectedRevision: 0, isCurrent: true }), /synchronous function/);
  assert.deepEqual(await store.get(scope, record.id), record);
});

test('query retrieval is bounded text overlap followed by recency and never merges private scopes', async t => {
  const { store } = await fixture(t);
  await create(store, place('old', { label: 'Blue meeting spot' }));
  await create(store, place('recent', { label: 'Red tower' }));
  await create(store, scopedPlace('private-secret', { conversationId: 'visitor-b', label: 'Blue meeting spot' }));
  assert.equal((await store.retrieve({ ...scope, query: 'blue meeting', limit: 1 }))[0].id, 'old');
  assert.equal((await store.retrieve({ ...scope, limit: 1 }))[0].id, 'recent');
  assert.throws(() => store.retrieve({ ...scope, query: 'a'.repeat(513) }), /query/);
  assert.throws(() => store.retrieve({ ...scope, limit: 33 }), /limit/);
});

test('snapshot exports all eligible records while private conversation histories require explicit selection', async t => {
  const { store } = await fixture(t);
  await create(store, scopedPlace('public', { audience: 'public', conversationId: 'world-chat' }));
  await create(store, place('private')); await create(store, scopedPlace('visitor', { conversationId: 'visitor-b' }));
  await create(store, scopedPlace('other', { agentId: 'bert', audience: 'public' }));
  assert.equal((await store.snapshot(scope)).length, 1);
  const selected = await store.snapshot({ ...scope, includePrivate: true }); assert.equal(selected.length, 3);
  assert.deepEqual(new Set(selected.map(record => record.conversationId)), new Set(['world-chat', 'owner-a', 'visitor-b']));
  assert.throws(() => store.snapshot({ ...scope, includePrivate: 'true' }), /selection/);
});

test('inherited knowledge gets new local IDs with original evidence and audience retained as shared provenance', async t => {
  const { store } = await fixture(t);
  const original = [await create(store, place()), await create(store, scopedPlace('public', { audience: 'public', conversationId: 'room' }))];
  const input = { agentId: 'clone', worldId: scope.worldId, records: original, sourceAgentId: 'ada', sourcePeerId: 'source-peer' };
  const inherited = await store.inheritSnapshot(input); assert.equal(inherited.length, 2);
  for (let index = 0; index < original.length; index++) {
    const old = original[index], next = inherited[index];
    assert.notEqual(next.id, old.id); assert.equal(next.agentId, 'clone'); assert.equal(next.revision, 1);
    assert.equal(next.confidence, 'shared'); assert.equal(worldKnowledgeStatus(next, 100100), 'unverified');
    assert.deepEqual(next.evidence, old.evidence.map(item => ({ ...item, provenance: 'shared' })));
    assert.deepEqual(next.origin, { sourceAgentId: 'ada', sourceRecordId: old.id, sourcePeerId: 'source-peer' });
    for (const field of ['audience', 'conversationId', 'lastSeenAt', 'position', 'label', 'note']) assert.deepEqual(next[field], old[field]);
  }
  assert.equal((await store.snapshot({ agentId: 'clone', worldId: scope.worldId })).length, 1);
  await assert.rejects(store.inheritSnapshot(input), /empty destination/);
  const descendant = await store.inheritSnapshot({ ...input, agentId: 'grandchild', sourceAgentId: 'clone', records: inherited });
  assert.equal(descendant[0].evidence[0].agentId, 'ada'); assert.equal(descendant[0].origin.sourceAgentId, 'clone');
});

test('inherited snapshots reject capacity, duplicates and source mismatch without partial records', async t => {
  const { store } = await fixture(t, { maximumEntries: 2 }); const first = await create(store, place());
  const records = [first, { ...first, id: 'other', subjectId: 'other' }];
  const input = { agentId: 'clone', worldId: scope.worldId, sourceAgentId: 'ada', records };
  await assert.rejects(store.inheritSnapshot(input), /capacity/);
  assert.deepEqual(await store.snapshot({ agentId: 'clone', worldId: scope.worldId, includePrivate: true }), []);
  assert.throws(() => store.inheritSnapshot({ ...input, sourceAgentId: 'bert' }), /mismatch/);
  assert.throws(() => store.inheritSnapshot({ ...input, records: [first, first] }), /Duplicate/);
  assert.throws(() => store.inheritSnapshot({ ...input, agentId: 'ada' }), /new resident/);
  assert.deepEqual(await store.get(scope, first.id), first);
});

test('multi-record clone import aborts as a whole on a later failed write', async t => {
  const { store } = await fixture(t);
  const records = [await create(store, place()), await create(store, place('second'))];
  const add = IDBObjectStore.prototype.add; let count = 0;
  IDBObjectStore.prototype.add = function (...args) {
    if (this.name === 'records' && ++count === 2) throw new DOMException('Owned clone failure', 'QuotaExceededError');
    return add.apply(this, args);
  };
  try { await assert.rejects(store.inheritSnapshot({ agentId: 'clone', worldId: scope.worldId, sourceAgentId: 'ada', records }), { name: 'QuotaExceededError' }); }
  finally { IDBObjectStore.prototype.add = add; }
  assert.deepEqual(await store.snapshot({ agentId: 'clone', worldId: scope.worldId, includePrivate: true }), []);
  assert.equal((await store.stats()).retainedEntries, 2);
});

test('failed staged clones can be cleared but observed, corrected or forgotten resident knowledge cannot', async t => {
  const { store } = await fixture(t), original = await create(store, place());
  const input = { agentId: 'clone', worldId: scope.worldId, sourceAgentId: 'ada', records: [original] };
  await store.inheritSnapshot(input); assert.equal(await store.clearAgent(input), 1);
  assert.equal((await store.stats()).forgottenEntries, 0);
  const [record] = await store.inheritSnapshot(input);
  await store.put({ ...record, note: 'Owner correction' }, { expectedRevision: 1 });
  await assert.rejects(store.clearAgent(input), /untouched staged clone/);
  await assert.rejects(store.clearAgent(scope), /untouched staged clone/);
  const [forgotten] = await store.inheritSnapshot({ ...input, agentId: 'other-clone' });
  await store.forget(forgotten, forgotten.id, { expectedRevision: 1 });
  await assert.rejects(store.clearAgent({ ...input, agentId: 'other-clone' }), /untouched staged clone/);
});

test('malformed, ungrounded and cross-scope knowledge cannot enter persistence', async t => {
  const { store } = await fixture(t);
  const badEvidence = change => ({ evidence: [evidence('bad', change)] });
  for (const change of [{ audience: undefined }, { subjectType: 'peer' }, { note: '😀'.repeat(257) }, { label: '\ud800' },
    { position: [NaN, 2, 3] }, { position: [1e9, 2, 3] }, { evidence: [] }, { lastSeenAt: 100001 }, { surprise: 'secret' },
    badEvidence({ sourceKind: 'model-claim' }), badEvidence({ agentId: 'other' }), badEvidence({ conversationId: 'other' }),
    badEvidence({ audience: 'public' }), badEvidence({ worldId: 'other' }), badEvidence({ provenance: 'shared' }),
    badEvidence({ when: 999999999 }), { confidence: 'shared' }]) {
    assert.throws(() => create(store, place('bad', change)));
  }
  const position = [1, 2, 3]; position.extra = 'hidden'; assert.throws(() => create(store, place('bad', { position })));
  assert.throws(() => create(store, place('bad', { evidence: Array(1) })), /array/);
  assert.deepEqual(await store.list(scope), []);
});

test('closed stores retain durable knowledge, complete owned transactions and invoke destroy once', async t => {
  let destroyed = 0; const { store, indexedDBImpl } = await fixture(t, { onDestroy: () => { destroyed++; } });
  const pending = create(store, place()); const closing = store.destroy();
  const record = await pending; await closing; await store.destroy(); assert.equal(destroyed, 1);
  await assert.rejects(store.open(), /closed/); await assert.rejects(store.list(scope), /not open/);
  const reopened = new WorldKnowledgeStore({ indexedDBImpl }); await reopened.open(); t.after(() => reopened.close());
  assert.deepEqual(await reopened.get(scope, record.id), record);
  assert.deepEqual(normalizeWorldKnowledgeRecord(record), record);
});
