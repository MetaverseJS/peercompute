import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { WorldMemoryStore } from '../../src/peercompute/agents/WorldMemoryStore.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

const scope = { agentId: 'ada', worldId: 'cubechat:room', audience: 'private', conversationId: 'visitor-a' };
const episode = (id, extra = {}) => ({ ...scope, kind: 'meeting', who: { peerId: 'visitor-a', name: 'Alice' }, where: [1, 3, 2],
  outcome: 'Arrived within measured range', text: 'Met Alice near the blue cube', source: { kind: 'verified-action', eventId: id }, ...extra });
async function fixture(t, options = {}) {
  const indexedDBImpl = options.indexedDBImpl ?? new IDBFactory(); let clock = 100000;
  const store = new WorldMemoryStore({ indexedDBImpl, now: () => clock++, ...options }); await store.open();
  t.after(() => store.close()); return { store, indexedDBImpl, setClock: value => { clock = value; } };
}

test('episodes survive reopening and retrieval never widens agent, world, audience or visitor scope', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const record = await store.append(episode('one'));
  for (const change of [{ agentId: 'bert' }, { worldId: 'cubechat:elsewhere' }, { audience: 'public' }, { conversationId: 'visitor-b' }]) {
    await store.append(episode('other', change)); assert.equal(await store.get({ ...scope, ...change }, record.id), undefined);
  }
  assert.deepEqual(await store.retrieve(scope), [record]); await store.close();
  const reopened = new WorldMemoryStore({ indexedDBImpl, now: () => 100100 }); await reopened.open(); t.after(() => reopened.close());
  assert.deepEqual(await reopened.retrieve(scope), [record]); assert.deepEqual(await reopened.get(scope, record.id), record);
  assert.equal(await reopened.forget(scope), 1); assert.deepEqual(await reopened.retrieve(scope), []);
  assert.equal((await reopened.retrieve({ ...scope, conversationId: 'visitor-b' })).length, 1);
});

test('event retries are idempotent and conflicting verified outcomes reject atomically', async t => {
  const { store } = await fixture(t);
  const first = await store.append(episode('same'));
  assert.deepEqual(await store.append(episode('same')), first);
  await assert.rejects(store.append(episode('same', { outcome: 'Different claim' })), /Conflicting/);
  assert.deepEqual(await store.retrieve(scope), [first]);
});

test('explicit retention and capacity limits discard oldest episodes and persist observable counts', async t => {
  const { store, indexedDBImpl, setClock } = await fixture(t, { maximumPerScope: 2, maximumEntries: 3, retentionMs: 1000 });
  await store.append(episode('first')); await store.append(episode('second')); await store.append(episode('third'));
  assert.deepEqual((await store.retrieve(scope)).map(item => item.source.eventId), ['third', 'second']);
  await store.append(episode('fourth', { conversationId: 'other' })); await store.append(episode('fifth', { conversationId: 'another' }));
  assert.equal((await store.stats()).discardedEntries, 2); assert.equal((await store.stats()).retainedEntries, 3);
  setClock(102000); assert.deepEqual(await store.retrieve(scope), []); assert.equal((await store.stats()).expiredEntries, 3);
  await store.append(episode('new')); assert.equal((await store.stats()).discardedEntries, 5);
  await store.close(); const reopened = new WorldMemoryStore({ indexedDBImpl, now: () => 102100 }); await reopened.open();
  t.after(() => reopened.close()); assert.equal((await reopened.stats()).discardedEntries, 5);
});

test('bounded query retrieval uses text overlap then recency with no implicit embeddings', async t => {
  const { store } = await fixture(t);
  await store.append(episode('old', { text: 'Alice likes blue cubes' }));
  await store.append(episode('recent', { text: 'Walking by a red wall', who: { peerId: 'visitor-b', name: 'Bob' } }));
  assert.equal((await store.retrieve({ ...scope, query: 'Alice blue', limit: 1 }))[0].source.eventId, 'old');
  assert.equal((await store.retrieve({ ...scope, limit: 1 }))[0].source.eventId, 'recent');
  assert.equal((await store.stats()).retrieval, 'text-match-and-recency');
});

test('payload byte capacity and same-millisecond appends retain the current event and report discards', async t => {
  const { store } = await fixture(t, { now: () => 100000, maximumBytes: 1600, maximumPerScope: 1 });
  await store.append(episode('z', { text: 'green'.repeat(80) }));
  const latest = await store.append(episode('a', { text: 'green'.repeat(80) }));
  assert.deepEqual(await store.retrieve(scope), [latest]);
  const stats = await store.stats(); assert(stats.retainedBytes <= 1600); assert.equal(stats.discardedEntries, 1);
  assert.throws(() => store.append(episode('escaped', { text: '\u0001'.repeat(1000) })), /byte budget/);
  const { store: byteStore } = await fixture(t, { maximumBytes: 1600 });
  for (let i = 0; i < 4; i++) await byteStore.append(episode(`bytes${i}`, { text: 'green'.repeat(80) }));
  const byteStats = await byteStore.stats();
  assert(byteStats.retainedBytes <= 1600); assert(byteStats.discardedEntries >= 2);
});

test('independent handles serialize concurrent appends and obey one shared retention bound', async t => {
  const indexedDBImpl = new IDBFactory(); let clock = 100000;
  const { store } = await fixture(t, { indexedDBImpl, now: () => clock++, maximumPerScope: 4 });
  const other = new WorldMemoryStore({ indexedDBImpl, now: () => clock++, maximumPerScope: 4 }); await other.open(); t.after(() => other.close());
  await Promise.all(Array.from({ length: 12 }, (_, i) => (i % 2 ? store : other).append(episode(`event${i}`))));
  assert.equal((await store.retrieve(scope)).length, 4); assert.equal((await other.stats()).discardedEntries, 8);
});

test('failed writes acknowledge failure without losing retained episodes or pruning records', async t => {
  const { store } = await fixture(t, { maximumPerScope: 1 }); const first = await store.append(episode('first'));
  const add = IDBObjectStore.prototype.add;
  IDBObjectStore.prototype.add = function (...args) {
    if (this.name === 'episodes') throw new DOMException('Owned injected write failure', 'QuotaExceededError');
    return add.apply(this, args);
  };
  try { await assert.rejects(store.append(episode('failed')), { name: 'QuotaExceededError' }); }
  finally { IDBObjectStore.prototype.add = add; }
  assert.deepEqual(await store.retrieve(scope), [first]); assert.equal((await store.stats()).discardedEntries, 0);
});

test('invalid, unscoped, oversized and already-aborted events never enter storage', async t => {
  const { store } = await fixture(t);
  for (const change of [{ audience: undefined }, { conversationId: '' }, { where: [NaN, 0, 0] }, { who: {} },
    { text: '😀'.repeat(513) }, { when: 999999999 }, { source: { kind: 'model-claim', eventId: 'bad' } }]) {
    assert.throws(() => store.append(episode('bad', change)));
  }
  await assert.rejects(store.append(episode('cancel'), { signal: AbortSignal.abort() }), { name: 'AbortError' });
  assert.deepEqual(await store.retrieve(scope), []);
});

test('StateManager owns private memory lifecycle without replicating or deleting stored episodes', async () => {
  const indexedDBImpl = new IDBFactory(), manager = new StateManager();
  const store = manager.createWorldMemoryStore({ name: 'owned', indexedDBImpl }); await store.open();
  const record = await store.append(episode('one'));
  assert.equal(manager.getWorldMemoryStore('owned'), store); assert.throws(() => manager.createWorldMemoryStore({ name: 'owned' }), /registered/);
  assert.equal(JSON.stringify(manager.ydoc.toJSON()).includes('Alice'), false);
  await manager.destroy(); assert.equal(manager.getWorldMemoryStore('owned'), null);
  const reopened = new WorldMemoryStore({ name: 'owned', indexedDBImpl }); await reopened.open();
  assert.deepEqual(await reopened.get(scope, record.id), record); await reopened.close();
});

test('inherited episodes preserve their timestamp and attribution with explicit donor provenance under a new agent', async t => {
  const { store } = await fixture(t);
  const inherited = await store.append(episode('inherited', { agentId: 'new-clone', audience: 'public', conversationId: 'public-room', when: 99000,
    outcome: 'Inherited from Ada; not independently verified on this node.',
    source: { kind: 'shared-memory', eventId: 'clone-event', sourceAgentId: 'ada' } }));
  assert.equal(inherited.source.kind, 'shared-memory'); assert.equal(inherited.source.sourceAgentId, 'ada');
  assert.equal(inherited.when, 99000); assert.equal(inherited.who.peerId, 'visitor-a');
  assert.deepEqual(await store.retrieve(scope), []);
  assert.deepEqual(await store.retrieve({ ...scope, agentId: 'new-clone', audience: 'public', conversationId: 'public-room' }), [inherited]);
  assert.throws(() => store.append(episode('bad-inheritance', { source: { kind: 'shared-memory', eventId: 'bad' } })), /identifier/);
});

test('owner snapshots include all retained public history and opt-in private channels without crossing agent or world', async t => {
  const { store, setClock } = await fixture(t, { maximumPerScope: 40, retentionMs: 1000 });
  for (let i = 0; i < 45; i++) await store.append(episode(`public-${i}`, { audience: 'public', conversationId: 'world-chat' }));
  await store.append(episode('private-a')); await store.append(episode('private-b', { conversationId: 'visitor-b' }));
  await store.append(episode('other-agent', { agentId: 'bert', audience: 'public' }));
  await store.append(episode('other-world', { worldId: 'cubechat:elsewhere', audience: 'public' }));
  const selected = { agentId: 'ada', worldId: 'cubechat:room' };
  const publicHistory = await store.snapshot(selected);
  assert.equal(publicHistory.length, 40); assert.equal(publicHistory[0].source.eventId, 'public-5');
  assert.equal(publicHistory.at(-1).source.eventId, 'public-44');
  assert(publicHistory.every(record => record.audience === 'public' && record.conversationId === 'world-chat'));
  const allHistory = await store.snapshot({ ...selected, includePrivate: true });
  assert.equal(allHistory.length, 42);
  assert.deepEqual(allHistory.slice(-2).map(record => record.conversationId), ['visitor-a', 'visitor-b']);
  publicHistory[0].text = 'mutated copy'; assert.notEqual((await store.snapshot(selected))[0].text, 'mutated copy');
  assert.throws(() => store.snapshot({ ...selected, includePrivate: 'yes' }), /private memory/);
  await assert.rejects(store.snapshot(selected, { signal: AbortSignal.abort() }), { name: 'AbortError' });
  setClock(102000); assert.deepEqual(await store.snapshot({ ...selected, includePrivate: true }), []);
});

const template = (id, extra = {}) => ({ ...episode(id, extra), agentId: undefined, sourceAgentId: 'ada', when: 99000 });
test('full inherited history is committed atomically under a new identity with private channels intact', async t => {
  const { store } = await fixture(t);
  const episodes = Array.from({ length: 30 }, (_, i) => template(`memory-${i}`, {
    audience: i < 20 ? 'public' : 'private', conversationId: i < 20 ? 'world-chat' : `visitor-${i % 2}` }));
  const imported = await store.inheritSnapshot({ agentId: 'clone', worldId: scope.worldId, sourceAgentId: 'ada', sourcePeerId: 'owner', episodes });
  assert.equal(imported.length, 30); assert.equal(new Set(imported.map(record => record.id)).size, 30);
  for (let i = 0; i < imported.length; i++) {
    assert.equal(imported[i].agentId, 'clone'); assert.equal(imported[i].source.kind, 'shared-memory');
    assert.equal(imported[i].source.sourceAgentId, 'ada'); assert.equal(imported[i].source.peerId, 'owner');
    for (const key of ['audience', 'conversationId', 'when', 'who', 'where', 'text', 'outcome']) assert.deepEqual(imported[i][key], episodes[i][key]);
  }
  assert.equal((await store.snapshot({ agentId: 'clone', worldId: scope.worldId })).length, 20);
  assert.equal((await store.retrieve({ ...scope, agentId: 'clone', conversationId: 'visitor-0' })).length, 5);
  assert.deepEqual(await store.snapshot({ agentId: 'ada', worldId: scope.worldId, includePrivate: true }), []);
  await assert.rejects(store.inheritSnapshot({ agentId: 'clone', worldId: scope.worldId, sourceAgentId: 'ada', episodes }), /empty destination/);
  assert.equal((await store.stats()).retainedEntries, 30);
});

test('clone imports fail whole when capacity or provenance is wrong and never evict existing residents', async t => {
  const { store } = await fixture(t, { maximumEntries: 2 });
  const prior = await store.append(episode('prior'));
  const input = { agentId: 'clone', worldId: scope.worldId, sourceAgentId: 'ada', episodes: [template('one'), template('two')] };
  await assert.rejects(store.inheritSnapshot(input), /Insufficient memory capacity/);
  assert.equal((await store.stats()).retainedEntries, 1); assert.equal((await store.stats()).discardedEntries, 0);
  assert.deepEqual(await store.retrieve(scope), [prior]);
  for (const change of [{ sourceAgentId: 'bert' }, { worldId: 'other-world' }, { audience: 'unknown' }, { conversationId: '' }]) {
    assert.throws(() => store.inheritSnapshot({ ...input, episodes: [{ ...template('bad'), ...change }] }));
  }
  assert.throws(() => store.inheritSnapshot({ ...input, agentId: 'ada' }), /new resident/);
  const { store: small } = await fixture(t, { maximumBytes: 700 });
  assert.throws(() => small.inheritSnapshot({ ...input, episodes: [template('one', { text: 'a'.repeat(512) })] }), /capacity/);
  const { store: short } = await fixture(t, { maximumPerScope: 1 });
  assert.throws(() => short.inheritSnapshot(input), /capacity/);
  assert.throws(() => short.inheritSnapshot({ ...input, episodes: Array(4097).fill(template('one')) }), /capacity/);
  const { store: occupied } = await fixture(t);
  await occupied.append(episode('already-resident', { agentId: 'clone', worldId: 'other-world' }));
  await assert.rejects(occupied.inheritSnapshot(input), /empty destination/);
});

test('failed and cancelled inherited batches roll back all writes and pruning', async t => {
  const { store, setClock } = await fixture(t, { retentionMs: 1000 });
  await store.append(episode('expired', { when: 99999 }));
  const prior = await store.append(episode('prior', { when: 100000 }));
  setClock(100999);
  const input = { agentId: 'clone', worldId: scope.worldId, sourceAgentId: 'ada',
    episodes: [template('one'), template('two')].map(record => ({ ...record, when: 100998 })) };
  const add = IDBObjectStore.prototype.add; let writes = 0;
  IDBObjectStore.prototype.add = function (...args) {
    if (this.name === 'episodes' && ++writes === 2) throw new DOMException('Injected second-write failure', 'QuotaExceededError');
    return add.apply(this, args);
  };
  try { await assert.rejects(store.inheritSnapshot(input), { name: 'QuotaExceededError' }); }
  finally { IDBObjectStore.prototype.add = add; }
  setClock(100999); const afterFailure = await store.stats();
  assert.equal(afterFailure.retainedEntries, 1); assert.equal(afterFailure.expiredEntries, 1);
  setClock(100999); assert.deepEqual(await store.retrieve(scope), [prior]);
  setClock(100999);
  await assert.rejects(store.inheritSnapshot(input, { signal: AbortSignal.abort() }), { name: 'AbortError' });
  setClock(100999); const control = new AbortController();
  IDBObjectStore.prototype.add = function (...args) {
    const result = add.apply(this, args); if (this.name === 'episodes') control.abort(); return result;
  };
  try { await assert.rejects(store.inheritSnapshot(input, { signal: control.signal }), { name: 'AbortError' }); }
  finally { IDBObjectStore.prototype.add = add; }
  setClock(100999); const afterCancel = await store.stats();
  assert.equal(afterCancel.retainedEntries, 1); assert.equal(afterCancel.expiredEntries, 1); assert.equal(afterCancel.discardedEntries, 0);
});
