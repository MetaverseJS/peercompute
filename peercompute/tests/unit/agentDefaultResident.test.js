import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../src/peercompute/agents/AgentRuntime.js';

const input = { name: 'Guide', instructions: 'Introduce CubeChat to new players.', goals: ['Welcome new players'],
  inferenceMode: 'network-assisted', embodiments: [{ worldId: 'cubechat', position: [0, 0, 0], color: '#66ccff', shared: true }] };
const key = 'cubechat:welcome';
function locks() {
  const held = new Set();
  return { async request(name, options, callback) {
    if (held.has(name)) return callback(null);
    held.add(name); try { return await callback({ name }); } finally { held.delete(name); }
  } };
}
async function setup(t, options = {}) {
  const store = new AgentRecordStore({ indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange, lockManager: locks(), ...options });
  await store.open(); t.after(() => store.destroy()); return store;
}

test('racing independent handles create exactly one paused default and acknowledge the committed record', async t => {
  const indexedDBImpl = new IDBFactory();
  const [a, b] = await Promise.all([setup(t, { indexedDBImpl }), setup(t, { indexedDBImpl })]);
  assert.equal(a.hostId, b.hostId);
  const results = await Promise.all([a, b, a, b].map(store => store.ensureDefault(key, input)));
  assert.equal(results.filter(result => result.created).length, 1);
  assert.equal(results.every(result => !result.removed), true);
  const head = results[0].head;
  for (const result of results) assert.deepEqual(result.head, head);
  assert.equal(head.status, 'paused'); assert.equal(head.revision, 1); assert.equal(head.pendingOperation, null);
  assert.equal(head.authority.hostId, a.hostId);
  assert.deepEqual(await b.list(), [head]);
  assert.deepEqual(await a.events(head.agentId), []);
  assert.deepEqual(await a.operations(head.agentId), []);
});

test('reopening preserves owner edits, pause and removed world bindings instead of restoring template fields', async t => {
  const indexedDBImpl = new IDBFactory();
  const first = await setup(t, { indexedDBImpl });
  const { head } = await first.ensureDefault(key, input);
  const edited = await first.commit(head.agentId, { expectedRevision: 1, head: { ...head,
    identity: { name: 'My guide', instructions: 'A different identity.' }, goals: ['Explore'],
    context: { summary: 'Remembered the first visit.' }, policy: { inferenceMode: 'local-only' },
    embodiments: [], status: 'paused' }, event: { type: 'edited' } });
  await first.destroy();
  const second = await setup(t, { indexedDBImpl });
  const result = await second.ensureDefault(key, { ...input, name: 'New template' });
  assert.deepEqual(result, { head: edited, created: false, removed: false });
  assert.deepEqual(await second.list(), [edited]);
  assert.equal((await second.events(head.agentId)).length, 1);
});

test('deleting a default leaves a durable marker; exported and restored clones do not acquire its role', async t => {
  const indexedDBImpl = new IDBFactory();
  const source = await setup(t, { indexedDBImpl });
  const { head } = await source.ensureDefault(key, input);
  const bundle = await source.export(head.agentId);
  assert.equal(JSON.stringify(bundle).includes(key), false);
  const clone = await source.restoreAsNew(bundle);
  assert.notEqual(clone.agentId, head.agentId);
  assert.equal((await source.ensureDefault(key, input)).head.agentId, head.agentId);
  await source.delete(head.agentId, { expectedRevision: head.revision });
  await source.destroy();
  const reopened = await setup(t, { indexedDBImpl });
  assert.deepEqual(await reopened.ensureDefault(key, input), { head: null, created: false, removed: true });
  assert.deepEqual(await reopened.list(), [clone]);
  const destination = await setup(t);
  const imported = await destination.restoreAsNew(bundle);
  const ownDefault = await destination.ensureDefault(key, input);
  assert.equal(ownDefault.created, true);
  assert.notEqual(ownDefault.head.agentId, imported.agentId);
});

test('a failed marker write rolls back the head and permits a later complete provisioning attempt', async t => {
  const store = await setup(t), transaction = store.database.transaction.bind(store.database);
  const quota = new DOMException('Injected native metadata write failure', 'QuotaExceededError');
  store.database.transaction = (names, mode) => {
    const tx = transaction(names, mode);
    if (mode === 'readwrite' && names.includes('metadata')) tx.objectStore('metadata').add = () => { throw quota; };
    return tx;
  };
  try { await assert.rejects(store.ensureDefault(key, input), error => error === quota); }
  finally { store.database.transaction = transaction; }
  assert.deepEqual(await store.list(), []);
  const result = await store.ensureDefault(key, input);
  assert.equal(result.created, true); assert.equal(result.removed, false);
  assert.deepEqual(await store.list(), [result.head]);
});

test('successful write requests followed by transaction abort never acknowledge or retain a default', async t => {
  const store = await setup(t), transaction = store.database.transaction.bind(store.database);
  store.database.transaction = (names, mode) => {
    const tx = transaction(names, mode);
    if (mode === 'readwrite' && names.includes('metadata')) {
      const metadata = tx.objectStore('metadata'), add = metadata.add.bind(metadata);
      metadata.add = (...args) => { const request = add(...args); request.addEventListener('success', () => tx.abort()); return request; };
    }
    return tx;
  };
  try { await assert.rejects(store.ensureDefault(key, input)); }
  finally { store.database.transaction = transaction; }
  assert.deepEqual(await store.list(), []);
  assert.equal((await store.ensureDefault(key, input)).created, true);
});

test('invalid bounded keys, input and supplied authority reject before writing; cancellation preserves absence', async t => {
  const store = await setup(t);
  for (const badKey of ['', '  ', null, 42, 'bad\0key', 'x'.repeat(513), 'é'.repeat(257)]) {
    await assert.rejects(store.ensureDefault(badKey, input), /default key/);
  }
  for (const badInput of [null, {}, { name: '' }, { ...input, inferenceMode: 'anywhere' },
    { ...input, authority: { kind: 'local', hostId: 'foreign', epoch: 0 } }]) {
    await assert.rejects(store.ensureDefault(key, badInput));
  }
  const controller = new AbortController(); controller.abort(new DOMException('Cancelled provisioning', 'AbortError'));
  await assert.rejects(store.ensureDefault(key, input, { signal: controller.signal }), { name: 'AbortError' });
  assert.deepEqual(await store.list(), []);
  assert.equal((await store.ensureDefault('é'.repeat(256), input)).created, true);
  assert.equal((await store.ensureDefault(key, input)).created, true);
});

test('corrupted default identity or authority fails closed without replacement', async t => {
  const store = await setup(t);
  const { head } = await store.ensureDefault(key, input);
  const metadataKey = `default-agent:${key}`;
  const corruptHead = async record => store._transaction(['heads'], 'readwrite', tx => {
    tx.objectStore('heads').put({ id: head.agentId, record });
  });
  await corruptHead({ ...head, authority: { ...head.authority, hostId: 'foreign' } });
  await assert.rejects(store.ensureDefault(key, input), /authority/);
  await corruptHead({ ...head, agentId: 'different-agent' });
  await assert.rejects(store.ensureDefault(key, input), /identity/);
  await corruptHead({ ...head, authority: { ...head.authority, epoch: 1 } });
  await assert.rejects(store.ensureDefault(key, input), /authority/);
  await corruptHead(head);
  await store._transaction(['metadata'], 'readwrite', tx => {
    tx.objectStore('metadata').put({ agentId: head.agentId, hostId: 'foreign' }, metadataKey);
  });
  await assert.rejects(store.ensureDefault(key, input), /does not own/);
  assert.deepEqual(await store.list(), [head]);
});

test('runtime emits changed only for new defaults and never resumes, queues or invokes inference', async t => {
  const store = await setup(t), events = [];
  const inference = { listCandidates() { assert.fail('Provisioning must not discover models'); },
    generate() { assert.fail('Provisioning must not execute inference'); } };
  const runtime = new AgentRuntime({ store, inference });
  t.after(() => runtime.dispose());
  runtime.subscribe(event => events.push(event));
  const first = await runtime.ensureDefault(key, input);
  assert.deepEqual(events, [{ type: 'changed', agentId: first.head.agentId, head: first.head }]);
  assert.equal(first.head.status, 'paused'); assert.equal(runtime.queue.length, 0); assert.equal(runtime.activities.size, 0);
  assert.deepEqual(await runtime.ensureDefault(key, input), { ...first, created: false });
  assert.equal(events.length, 1);
  const controller = new AbortController(); controller.abort(new DOMException('Cancelled', 'AbortError'));
  await assert.rejects(runtime.ensureDefault('another', input, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(events.length, 1);
  await runtime.remove(first.head.agentId);
  const countAfterRemoval = events.length;
  assert.deepEqual(await runtime.ensureDefault(key, input), { head: null, created: false, removed: true });
  assert.equal(events.length, countAfterRemoval);
});
