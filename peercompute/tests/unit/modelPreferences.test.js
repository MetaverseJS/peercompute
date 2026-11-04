import test from 'node:test';
import assert from 'node:assert/strict';
import { createModelPreferences } from '../../../demos/inference/src/modelPreferences.js';

const manifestCid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const record = { version: 1, manifestCid, modelId: 'fixture-model' };
function memoryStorage() {
  const values = new Map();
  return { values, getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key) };
}

test('last loaded hint survives recreation and stays isolated by artifact store', async () => {
  const storage = memoryStorage();
  const first = createModelPreferences({ storeName: 'one', storage });
  assert.equal(first.readLastLoaded(), null);
  const saved = await first.rememberLoaded(record);
  assert.deepEqual(createModelPreferences({ storeName: 'one', storage }).readLastLoaded(), saved);
  assert.equal(saved.manifestCid, record.manifestCid); assert(saved.selectionId);
  assert.equal(createModelPreferences({ storeName: 'two', storage }).readLastLoaded(), null);
  const copy = first.readLastLoaded(); copy.modelId = 'modified';
  assert.equal(first.readLastLoaded().modelId, record.modelId);
  await first.clearLastLoaded();
  assert.equal(createModelPreferences({ storeName: 'one', storage }).readLastLoaded(), null);
});

test('malformed, oversized, old-version and non-CID hints are ignored', () => {
  for (const value of ['{', 'x'.repeat(1025), JSON.stringify({ ...record, version: 2 }),
    JSON.stringify({ ...record, manifestCid: 'not-a-cid' }), JSON.stringify({ ...record, modelId: '' }),
    JSON.stringify({ ...record, modelId: 'x'.repeat(257) })]) {
    const preferences = createModelPreferences({ storage: { getItem: () => value } });
    assert.equal(preferences.readLastLoaded(), null);
  }
});

test('denied browser storage is nonfatal and retains a bounded in-session selection', async () => {
  const denied = () => { throw new DOMException('Storage denied', 'SecurityError'); };
  const preferences = createModelPreferences({ storage: { getItem: denied, setItem: denied, removeItem: denied } });
  assert.equal(preferences.readLastLoaded(), null);
  const saved = await preferences.rememberLoaded(record);
  assert.deepEqual(preferences.readLastLoaded(), saved);
  assert.throws(() => preferences.rememberLoaded({ manifestCid: 'bad', modelId: 'bad' }), /valid CID/);
  assert.deepEqual(preferences.readLastLoaded(), saved);
  await preferences.clearLastLoaded(); assert.equal(preferences.readLastLoaded(), null);
});

test('stale instance clearing an old selection adopts another instance\'s newer record', async () => {
  const storage = memoryStorage();
  const first = createModelPreferences({ storage }), second = createModelPreferences({ storage });
  const previous = await first.rememberLoaded(record);
  const latest = await second.rememberLoaded({ ...record,
    manifestCid: 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q', modelId: 'new-model' });
  assert.deepEqual(await first.clearLastLoaded(previous), latest);
  assert.deepEqual(first.readLastLoaded(), latest);
  assert.deepEqual(createModelPreferences({ storage }).readLastLoaded(), latest);
  await second.clearLastLoaded(latest);
  assert.equal(first.readLastLoaded(), null);
});

test('a later load of the same CID has a different identity and survives stale deletion', async () => {
  const storage = memoryStorage();
  const first = createModelPreferences({ storage }), second = createModelPreferences({ storage });
  const previous = await first.rememberLoaded(record);
  const latest = await second.rememberLoaded(record);
  assert.notEqual(previous.selectionId, latest.selectionId, 'identity must not depend on clock resolution or CID');
  assert.deepEqual(await first.clearLastLoaded(previous), latest);
  assert.deepEqual(createModelPreferences({ storage }).readLastLoaded(), latest);
});

test('cross-tab writes and conditional clearing run under the same browser lock', async () => {
  const storage = memoryStorage(); let tail = Promise.resolve(), active = false;
  const lockNames = [];
  const locks = { request(name, options, callback) {
    assert.equal(options.mode, 'exclusive'); assert(options.signal instanceof AbortSignal); lockNames.push(name);
    const result = tail.then(async () => {
      assert.equal(active, false); active = true;
      try { return await callback(); } finally { active = false; }
    });
    tail = result.catch(() => {}); return result;
  } };
  const first = createModelPreferences({ storage, locks }), second = createModelPreferences({ storage, locks });
  const previous = await first.rememberLoaded(record);
  const writing = second.rememberLoaded(record), clearing = first.clearLastLoaded(previous);
  const latest = await writing;
  assert.deepEqual(await clearing, latest);
  assert.equal(new Set(lockNames).size, 1); assert.equal(lockNames.length, 3);
  assert.deepEqual(first.readLastLoaded(), latest);
});

test('cancelled or denied-lock writes never overwrite another persisted successful load', async () => {
  const storage = memoryStorage(), first = createModelPreferences({ storage });
  const saved = await first.rememberLoaded(record);
  const locks = { async request() { throw new DOMException('Lock unavailable', 'SecurityError'); } };
  const second = createModelPreferences({ storage, locks });
  const abort = new AbortController(); abort.abort();
  assert.deepEqual(await second.rememberLoaded(record, { signal: abort.signal }), saved);
  const session = await second.rememberLoaded(record);
  assert.notEqual(session.selectionId, saved.selectionId);
  assert.deepEqual(second.readLastLoaded(), session);
  assert.deepEqual(createModelPreferences({ storage }).readLastLoaded(), saved);
  await second.clearLastLoaded(session);
  assert.deepEqual(createModelPreferences({ storage }).readLastLoaded(), saved);
});
