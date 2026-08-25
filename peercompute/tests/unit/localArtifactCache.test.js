import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LOCAL_ARTIFACT_CACHE_DATABASE,
  LOCAL_ARTIFACT_CACHE_SCHEMA,
  LOCAL_ARTIFACT_CACHE_STORE,
  LocalArtifactCache
} from '../../src/peercompute/stateManager/LocalArtifactCache.js';

function bytes(value, length = 32) {
  return new Uint8Array(length).fill(value);
}

function cacheOptions(overrides = {}) {
  return {
    name: `test-${Math.random().toString(16).slice(2)}`,
    maximumEntries: 8,
    maximumBytes: 64 * 1024,
    maximumEntryBytes: 8 * 1024,
    persistent: false,
    clock: () => 0,
    ...overrides
  };
}

async function load(cache, key, value, overrides = {}) {
  return cache.getOrLoad({
    key,
    sourceId: 'unit-source',
    mediaType: 'application/octet-stream',
    freshUntil: 1_000,
    staleUntil: 2_000,
    loader: async () => bytes(value),
    validate: (artifactBytes) => artifactBytes.byteLength > 0,
    ...overrides
  });
}

function clone(value) {
  return structuredClone(value);
}

class MemoryObjectStore {
  constructor(transaction, records) {
    this.transaction = transaction;
    this.records = records;
  }

  #request(operation) {
    const request = {};
    this.transaction.pending += 1;
    queueMicrotask(() => {
      try {
        request.result = operation();
        request.onsuccess?.();
      } catch (error) {
        request.error = error;
        request.onerror?.();
      } finally {
        this.transaction.pending -= 1;
        this.transaction.maybeComplete();
      }
    });
    return request;
  }

  get(id) {
    return this.#request(() => {
      const value = this.records.get(id);
      return value === undefined ? undefined : clone(value);
    });
  }

  getAll() {
    return this.#request(() => [...this.records.values()].map(clone));
  }

  put(value) {
    return this.#request(() => {
      this.records.set(value.id, clone(value));
      return value.id;
    });
  }

  delete(id) {
    return this.#request(() => this.records.delete(id));
  }
}

class MemoryTransaction {
  constructor(records) {
    this.records = records;
    this.pending = 0;
    this.completed = false;
  }

  objectStore() {
    return new MemoryObjectStore(this, this.records);
  }

  maybeComplete() {
    queueMicrotask(() => {
      if (!this.completed && this.pending === 0) {
        this.completed = true;
        this.oncomplete?.();
      }
    });
  }
}

class MemoryDatabase {
  constructor(records) {
    this.records = records;
    this.objectStoreNames = { contains: (name) => name === LOCAL_ARTIFACT_CACHE_STORE };
  }

  createObjectStore() {}

  transaction() {
    return new MemoryTransaction(this.records);
  }

  close() {}
}

function createMemoryIndexedDB() {
  const records = new Map();
  const database = new MemoryDatabase(records);
  return {
    records,
    open(name) {
      assert.equal(name, LOCAL_ARTIFACT_CACHE_DATABASE);
      const request = { result: database };
      queueMicrotask(() => request.onsuccess?.());
      return request;
    }
  };
}

test('fresh local artifacts are immutable byte hits with SHA-256 metadata', async (t) => {
  const cache = new LocalArtifactCache(cacheOptions());
  t.after(() => cache.destroy());

  const first = await load(cache, 'alpha', 7);
  assert.equal(first.cacheStatus, 'miss');
  assert.equal(first.metadata.schema, LOCAL_ARTIFACT_CACHE_SCHEMA);
  assert.match(first.metadata.sha256, /^sha256:[a-f0-9]{64}$/u);
  first.bytes[0] = 99;

  const hit = await load(cache, 'alpha', 8);
  assert.equal(hit.cacheStatus, 'hit');
  assert.equal(hit.bytes[0], 7);
  assert.equal(cache.getStats().entries, 1);
  assert.equal(cache.getStats().hits, 1);
});

test('LRU order and byte capacity evict deterministically', async (t) => {
  const cache = new LocalArtifactCache(cacheOptions({
    maximumEntries: 2,
    maximumBytes: 8 * 1024,
    maximumEntryBytes: 2 * 1024
  }));
  t.after(() => cache.destroy());

  await load(cache, 'alpha', 1, { loader: async () => bytes(1, 1_500) });
  await load(cache, 'bravo', 2, { loader: async () => bytes(2, 1_500) });
  assert.equal((await cache.read('alpha')).bytes[0], 1);
  await load(cache, 'charlie', 3, { loader: async () => bytes(3, 1_500) });

  assert.equal(await cache.read('bravo'), null);
  assert.equal((await cache.read('alpha')).bytes[0], 1);
  assert.equal((await cache.read('charlie')).bytes[0], 3);
  assert.equal(cache.getStats().entries, 2);
  assert.equal(cache.getStats().evictions, 1);
  assert.ok(cache.getStats().residentBytes <= cache.getStats().maximumBytes);
});

test('stale artifacts are served only when refresh fails inside the stale bound', async (t) => {
  let now = 10;
  const cache = new LocalArtifactCache(cacheOptions({ clock: () => now }));
  t.after(() => cache.destroy());
  await load(cache, 'stale-key', 4, { freshUntil: 20, staleUntil: 40 });

  now = 30;
  const stale = await load(cache, 'stale-key', 9, {
    freshUntil: 35,
    staleUntil: 50,
    loader: async () => { throw Object.assign(new Error('offline'), { code: 'UPSTREAM_OFFLINE' }); }
  });
  assert.equal(stale.cacheStatus, 'stale');
  assert.equal(stale.bytes[0], 4);
  assert.equal(stale.refreshErrorCode, 'UPSTREAM_OFFLINE');

  now = 41;
  await assert.rejects(load(cache, 'stale-key', 9, {
    freshUntil: 45,
    staleUntil: 60,
    loader: async () => { throw new Error('still offline'); }
  }), /still offline/u);
});

test('coalesced callers have isolated aborts and share one bounded loader', async (t) => {
  const cache = new LocalArtifactCache(cacheOptions());
  t.after(() => cache.destroy());
  const firstAbort = new AbortController();
  let loaderCalls = 0;
  let sharedSignal;
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const loader = async ({ signal }) => {
    loaderCalls += 1;
    sharedSignal = signal;
    await gate;
    return bytes(6);
  };
  const options = {
    key: 'coalesced',
    sourceId: 'unit-source',
    mediaType: 'application/octet-stream',
    freshUntil: 1_000,
    staleUntil: 2_000,
    loader
  };

  const first = cache.getOrLoad({ ...options, signal: firstAbort.signal });
  await new Promise((resolve) => setImmediate(resolve));
  const second = cache.getOrLoad(options);
  firstAbort.abort();
  await assert.rejects(first, (error) => error?.name === 'AbortError');
  assert.equal(sharedSignal.aborted, false);
  release();
  const result = await second;
  assert.equal(result.cacheStatus, 'coalesced');
  assert.equal(result.bytes[0], 6);
  assert.equal(loaderCalls, 1);
  assert.equal(cache.getStats().reservedBytes, 0);
});

test('entry caps reject oversize loads without retaining bytes', async (t) => {
  const cache = new LocalArtifactCache(cacheOptions({ maximumEntryBytes: 64 }));
  t.after(() => cache.destroy());
  await assert.rejects(load(cache, 'oversize', 1, {
    loader: async () => bytes(1, 65)
  }), (error) => error?.code === 'ERR_LOCAL_ARTIFACT_ENTRY_TOO_LARGE');
  assert.equal(cache.getStats().entries, 0);
  assert.equal(cache.getStats().residentBytes, 0);
  assert.equal(cache.getStats().reservedBytes, 0);
});

test('IndexedDB cold recovery revalidates integrity and deletes corrupt records', async () => {
  const indexedDBImpl = createMemoryIndexedDB();
  const options = cacheOptions({
    name: 'persistent-recovery',
    persistent: true,
    indexedDBImpl
  });
  const first = new LocalArtifactCache(options);
  await load(first, 'persisted', 5);
  await first.destroy();

  const recovered = new LocalArtifactCache(options);
  const cold = await recovered.read('persisted', { allowStale: true });
  assert.equal(cold.cacheStatus, 'hit');
  assert.equal(cold.bytes[0], 5);
  await recovered.destroy();

  const record = [...indexedDBImpl.records.values()][0];
  record.bytes[0] = 88;
  indexedDBImpl.records.set(record.id, record);
  const corrupted = new LocalArtifactCache(options);
  assert.equal(await corrupted.read('persisted', { allowStale: true }), null);
  assert.equal(corrupted.getStats().validationFailures, 1);
  assert.equal(indexedDBImpl.records.size, 0);
  await corrupted.destroy();
});

test('IndexedDB open failure degrades to the bounded memory tier', async (t) => {
  const cache = new LocalArtifactCache(cacheOptions({
    persistent: true,
    indexedDBImpl: { open: () => { throw new Error('storage denied'); } }
  }));
  t.after(() => cache.destroy());

  assert.equal((await load(cache, 'fallback', 3)).cacheStatus, 'miss');
  assert.equal((await load(cache, 'fallback', 9)).cacheStatus, 'hit');
  assert.equal(cache.getStats().persistenceConfigured, true);
  assert.equal(cache.getStats().persistenceAvailable, false);
  assert.equal(cache.getStats().persistenceFailures, 1);
  assert.ok(cache.getStats().residentBytes <= cache.getStats().maximumBytes);
});

test('clear and destroy are namespace-local and lifecycle-safe', async () => {
  const indexedDBImpl = createMemoryIndexedDB();
  const left = new LocalArtifactCache(cacheOptions({ name: 'left', persistent: true, indexedDBImpl }));
  const right = new LocalArtifactCache(cacheOptions({ name: 'right', persistent: true, indexedDBImpl }));
  await load(left, 'same-key', 1);
  await load(right, 'same-key', 2);
  await left.clear();
  assert.equal(await left.read('same-key', { allowStale: true }), null);
  assert.equal((await right.read('same-key', { allowStale: true })).bytes[0], 2);
  await left.destroy();
  await assert.rejects(() => left.read('same-key'), (error) => error?.code === 'ERR_LOCAL_ARTIFACT_CACHE_DESTROYED');
  await right.destroy();
});
