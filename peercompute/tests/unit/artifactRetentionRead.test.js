import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as nextTurn, setTimeout as delay } from 'node:timers/promises';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { IndexedDBArtifactBackend } from '../../src/peercompute/artifacts/ArtifactBackends.js';

function store(t, options = {}) {
  const value = new ArtifactStore({ persistent: false, name: crypto.randomUUID(), ...options });
  t.after(() => value.destroy()); return value;
}
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
async function collect(iterator) { const parts = []; for await (const part of iterator) parts.push(Buffer.from(part)); return Buffer.concat(parts); }
const fixture = () => Uint8Array.from({ length: 600000 }, (_, i) => (i + Math.floor(i / 4097)) % 251);

async function source(t) {
  const value = store(t), bytes = fixture(), file = await value.importFile(bytes);
  return { file, bytes, fetchBlock: cid => collect(value.getBlockstore().get(cid)) };
}

test('scoped ensure and ranged reads cross a queued GC writer without deadlock or persistent pins', { timeout: 5000 }, async t => {
  const origin = await source(t), indexedDBImpl = new IDBFactory();
  const backend = () => new IndexedDBArtifactBackend({ name: 'scoped-read-fair-writer', indexedDBImpl, keyRange: IDBKeyRange });
  const first = store(t, { backend: backend(), ownsBackend: true }), second = store(t, { backend: backend(), ownsBackend: true });
  const entered = deferred(), proceed = deferred(); let scope;
  const task = first.withRetention(async scoped => {
    scope = scoped; entered.resolve(); await proceed.promise;
    const root = await scoped.ensureLocal(origin.file.cid, { fetchBlock: origin.fetchBlock, pin: false });
    assert.equal(root.pinned, false); assert.equal(root.retain, false);
    const actual = await collect(scoped.openRead(root.cid, { offset: 262140, length: 40 }));
    assert.deepEqual(actual, Buffer.from(origin.bytes.subarray(262140, 262180)));
    assert.equal((await scoped.stat(root.cid)).pinned, false);
  });
  await entered.promise; let collected = false;
  const gc = second.gc().then(result => { collected = true; return result; });
  await delay(15); assert.equal(collected, false); proceed.resolve(); await task;
  assert((await gc).deletedBlocks > 0); assert.equal(await second.stat(origin.file.cid), undefined);
  await assert.rejects(scope.ensureLocal(origin.file.cid), /scope.*active/);
  assert.throws(() => scope.openRead(origin.file.cid), /scope.*active/);
});

test('abandoned iterators close on success and cannot yield bytes after their scope', { timeout: 3000 }, async t => {
  const value = store(t), file = await value.importFile(fixture(), { pin: false }); let reader;
  await value.withRetention(async scoped => {
    reader = scoped.openRead(file.cid); assert.equal((await reader.next()).done, false);
  });
  assert.equal(value.operations.size, 0);
  await assert.rejects(reader.next(), /scope.*active/);
  assert((await value.gc()).deletedBlocks > 0);
});

test('unused and concurrent scoped iterators are bounded and do not leak the GC lease', { timeout: 3000 }, async t => {
  const value = store(t), file = await value.importFile(new Uint8Array([1]), { pin: false }); let escaped;
  await value.withRetention(async scoped => {
    escaped = scoped.openRead(file.cid);
    const active = escaped.next(); await assert.rejects(escaped.next(), /Concurrent/); await active;
    for (let i = 1; i < 32; i++) scoped.openRead(file.cid);
    assert.throws(() => scoped.openRead(file.cid), /queue is full/);
  });
  await assert.rejects(escaped.next(), /scope.*active/); assert.equal(value.operations.size, 0);
  assert.equal((await value.gc()).deletedBlocks, 1);
});

test('callback failure closes a paused iterator and cancels an unawaited pending ensure', { timeout: 3000 }, async t => {
  const origin = await source(t), value = store(t), existing = await value.importFile(new Uint8Array([7]), { pin: false });
  let reader, pending;
  await assert.rejects(value.withRetention(async scoped => {
    reader = scoped.openRead(existing.cid); await reader.next();
    const entered = deferred(); pending = scoped.ensureLocal(origin.file.cid, { pin: false,
      fetchBlock: async () => { entered.resolve(); return new Promise(() => {}); } });
    pending.catch(() => {}); await entered.promise;
    throw new Error('caller failed');
  }), /caller failed/);
  await assert.rejects(pending, /scope.*active/);
  await assert.rejects(reader.next(), /scope.*active/); assert.equal(value.operations.size, 0);
  await value.gc(); assert.equal(value.getStats().rootCount, 0);
});

test('cancelled ephemeral download leaves no retained partial root while ordinary resume behavior is preserved', { timeout: 3000 }, async t => {
  const origin = await source(t), value = store(t); const controller = new AbortController();
  let fetched = 0;
  await assert.rejects(value.withRetention(async scoped => scoped.ensureLocal(origin.file.cid, { pin: false,
    fetchBlock: async cid => { if (++fetched === 2) controller.abort(); return origin.fetchBlock(cid); } }),
  { signal: controller.signal }), { name: 'AbortError' });
  const partial = await value.stat(origin.file.cid);
  assert.equal(partial?.pinned, false); assert.equal(partial?.retain, false);
  await value.gc(); assert.equal(value.getStats().rootCount, 0); assert.equal(value.getStats().blockCount, 0);
  const ordinary = store(t), cancel = new AbortController(); fetched = 0;
  await assert.rejects(ordinary.ensureLocal(origin.file.cid, { pin: false, signal: cancel.signal,
    fetchBlock: async cid => { if (++fetched === 2) cancel.abort(); return origin.fetchBlock(cid); } }), { name: 'AbortError' });
  assert.equal((await ordinary.stat(origin.file.cid)).retain, true, 'explicit download remains resumable');
});

test('store destruction cancels a live scope and releases an abandoned reader without hanging', { timeout: 3000 }, async t => {
  const value = store(t), file = await value.importFile(fixture(), { pin: false }); const entered = deferred(); let reader;
  const running = value.withRetention(async scoped => { reader = scoped.openRead(file.cid); await reader.next(); entered.resolve(); await new Promise(() => {}); });
  const rejected = assert.rejects(running, { name: 'AbortError' }); await entered.promise;
  await value.destroy(); await rejected; assert.equal(value.operations.size, 0);
  await assert.rejects(reader.next(), /scope.*active/);
});

test('ephemeral verification preserves existing retained roots and serializes concurrent audits', { timeout: 3000 }, async t => {
  const value = store(t), file = await value.importFile(new Uint8Array([9])); let active = 0, maximum = 0;
  const verify = value._verifyFile.bind(value);
  value._verifyFile = async (...args) => { active++; maximum = Math.max(maximum, active); try { await nextTurn(); return await verify(...args); } finally { active--; } };
  await value.withRetention(async scoped => {
    await Promise.all([scoped.ensureLocal(file.cid, { pin: false }), scoped.ensureLocal(file.cid, { pin: false })]);
    assert.equal((await scoped.stat(file.cid)).pinned, true);
  });
  assert.equal(maximum, 1); assert.equal((await value.gc()).deletedBlocks, 0);
});

test('a concurrent independent pin survives an ephemeral scope finishing', { timeout: 3000 }, async t => {
  const origin = await source(t), value = store(t), entered = deferred(), proceed = deferred(), downloaded = deferred(), finish = deferred();
  let first = true;
  const reading = value.withRetention(async scoped => {
    await scoped.ensureLocal(origin.file.cid, { pin: false, fetchBlock: async cid => {
      if (first) { first = false; entered.resolve(); await proceed.promise; }
      return origin.fetchBlock(cid);
    } });
    downloaded.resolve(); await finish.promise;
  });
  await entered.promise;
  const pinning = value.pin(origin.file.cid); await nextTurn(); proceed.resolve(); await downloaded.promise;
  assert.equal((await pinning).pinned, true); finish.resolve(); await reading;
  assert.equal((await value.stat(origin.file.cid)).pinned, true);
  assert.equal((await value.gc()).deletedBlocks, 0);
});
