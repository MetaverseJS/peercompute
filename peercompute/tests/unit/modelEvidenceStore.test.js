import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { ModelEvidenceStore } from '../../src/peercompute/modelEvidence/ModelEvidenceStore.js';
import { ModelEvidenceCollector } from '../../src/peercompute/modelEvidence/ModelEvidenceCollector.js';
import { MODEL_EVIDENCE_SCHEMA } from '../../src/peercompute/modelEvidence/ModelEvidenceContracts.js';

const row = (observedAt = 1, change = {}) => ({ schema: MODEL_EVIDENCE_SCHEMA, observedAt,
  source: { repository: 'fixture/model', revision: 'a'.repeat(40), packageFingerprint: 'b'.repeat(64) },
  compatibility: { clientBuild: 'test', inspectorVersion: '1', policyVersion: '1', runtime: 'llama.cpp', runtimeVersion: '3.8.1' },
  environment: { kind: 'browser' }, executorPeerId: 'peer-one', stage: 'load', outcome: 'success', ...change });
const author = { reporterPeerId: 'peer-one' };
async function fixture(t, options = {}) {
  const indexedDBImpl = options.indexedDBImpl ?? new IDBFactory();
  const store = new ModelEvidenceStore({ indexedDBImpl, ...options }); await store.open(); t.after(() => store.destroy());
  return { store, indexedDBImpl };
}

test('durable immutable receipts survive restart and preserve authenticated origin and outbox acknowledgment', async t => {
  const { store, indexedDBImpl } = await fixture(t, { now: () => 100 });
  const saved = await store.append(row(), { ...author, enqueue: true });
  saved.report.source.repository = 'mutated/model';
  const duplicate = await store.append(row(), author);
  assert.equal(duplicate.sequence, saved.sequence); assert.equal(duplicate.receivedAt, 100);
  assert.equal((await store.query()).length, 1); assert.equal((await store.pending()).length, 1);
  await store.destroy();
  const reopened = new ModelEvidenceStore({ indexedDBImpl, now: () => 200 }); await reopened.open(); t.after(() => reopened.destroy());
  assert.equal((await reopened.query())[0].report.source.repository, 'fixture/model');
  assert.equal((await reopened.pending())[0].id, saved.id);
  assert.equal(await reopened.acknowledge([saved.id], { rootPeerId: 'root-one', ...author }), 1);
  assert.equal((await reopened.pending()).length, 0); assert.equal((await reopened.query()).length, 1);
  await reopened.append(row(), { ...author, enqueue: true });
  assert.equal((await reopened.pending()).length, 0, 'duplicate recording cannot undo a durable delivery receipt');
});

test('forged executor, changed immutable identity and aborted writes do not alter retained evidence', async t => {
  const { store } = await fixture(t);
  const saved = await store.append(row(), author);
  await assert.rejects(store.append(row(), { reporterPeerId: 'impostor', provenance: 'authenticated-peer' }), /authenticated reporter/);
  await assert.rejects(store.append({ ...saved.report, outcome: 'failed' }, author), /identity/);
  const abort = new AbortController(); abort.abort();
  await assert.rejects(store.append(row(2), { ...author, signal: abort.signal }), { name: 'AbortError' });
  assert.equal((await store.query()).length, 1);
  await assert.rejects(store.append(row(3), { ...author, provenance: 'authenticated-peer', enqueue: true }), /provenance/);
});

test('retention is bounded atomically and query pagination follows receipt sequence instead of client clocks', async t => {
  const { store } = await fixture(t, { maximumEntries: 3, maximumPerReporter: 2, now: () => 10 });
  await store.append(row(1000), author); await store.append(row(1), author); await store.append(row(0), author);
  assert.deepEqual((await store.query()).map(value => value.report.observedAt), [0, 1]);
  await store.append(row(5, { executorPeerId: 'peer-two' }), { reporterPeerId: 'peer-two', provenance: 'authenticated-peer' });
  await store.append(row(6, { executorPeerId: 'peer-two', source: { repository: 'other/model', revision: 'b'.repeat(40), packageFingerprint: 'c'.repeat(64) } }), { reporterPeerId: 'peer-two' });
  const latest = await store.query({ limit: 2 }); assert.equal(latest.length, 2);
  const page = await store.query({ beforeSequence: latest.at(-1).sequence }); assert.equal(page.length, 1);
  assert.equal((await store.query({ repository: 'fixture/model', reporterPeerId: 'peer-two' })).length, 1);
  assert(store.status().evicted >= 2);
  const previous = await store.query();
  await assert.rejects(store.appendBatch([row(7), row(8), row(9)], author), /retention capacity/);
  assert.deepEqual(await store.query(), previous, 'failed batch rolls back additions and evictions');
});

test('closing drains accepted writes, releases handles and rejects subsequent work', async t => {
  const { store, indexedDBImpl } = await fixture(t);
  const writing = store.append(row(), author), closing = store.destroy();
  await writing; await closing;
  await assert.rejects(store.query(), /closed/);
  const reopened = new ModelEvidenceStore({ indexedDBImpl }); t.after(() => reopened.destroy());
  assert.equal((await reopened.query()).length, 1);
});

test('collector failure cannot fail inference, and failed delivery remains pending until exact acknowledgment', async t => {
  const { store } = await fixture(t);
  const collector = new ModelEvidenceCollector({ store, reporterPeerId: 'peer-one', compatibility: row().compatibility, environment: row().environment });
  t.after(() => collector.close());
  const saved = await collector.record({ ...row(), prompt: 'PRIVATE' }); assert(saved);
  assert(!JSON.stringify(saved).includes('PRIVATE'));
  assert.equal(await collector.record({ ...row(), executorPeerId: 'different-host' }), null);
  assert.equal(collector.status().dropped, 1);
  const bad = await collector.flush({ rootPeerId: 'root-one', service: { submit: async () => ({ ids: ['sha256-' + 'f'.repeat(64)] }) } });
  assert.equal(bad.failed, true); assert.equal((await store.pending()).length, 1);
  const good = await collector.flush({ rootPeerId: 'root-one', service: { submit: async (_peer, reports) => ({ ids: reports.map(value => value.id) }) } });
  assert.deepEqual(good, { sent: 1, failed: false }); assert.equal((await store.pending()).length, 0);
  await store.destroy(); assert.equal(await collector.record(row(5)), null);
  assert.equal(collector.status().lastFailure, 'record-unavailable');
});

test('collector snapshots the actual operation before callers reuse their objects', async t => {
  const { store } = await fixture(t), input = row();
  const collector = new ModelEvidenceCollector({ store, reporterPeerId: 'peer-one' }); t.after(() => collector.close());
  const recording = collector.record(input); input.source.repository = 'different/model'; input.outcome = 'failed';
  const saved = await recording; assert.equal(saved.report.source.repository, 'fixture/model'); assert.equal(saved.report.outcome, 'success');
});
