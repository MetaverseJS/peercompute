// One database owns blocks, root/pin journals and the network's private routing
// datastore. Values never enter Yjs. Cursor batches bound enumeration memory.
export const ARTIFACT_DATABASE_PREFIX = 'peercompute-ipfs-artifacts-v1-';
const collections = ['blocks', 'roots', 'routing'];
const valueBytes = (value) => value instanceof Uint8Array ? value.byteLength
  : new TextEncoder().encode(JSON.stringify(value)).byteLength;
const copy = (value) => value === undefined ? undefined : structuredClone(value);
const emptyUsage = () => ({ bytes: 0, entries: 0, generation: 0 });

function nextUsage(previous, old, size, { maximumBytes = Number.MAX_SAFE_INTEGER,
  maximumEntries = Number.MAX_SAFE_INTEGER } = {}) {
  const next = { bytes: previous.bytes - (old?.size || 0) + size,
    entries: previous.entries + (old ? 0 : 1), generation: (previous.generation || 0) + 1 };
  if (Object.values(next).some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new RangeError('Artifact storage accounting exceeds safe integer range.');
  }
  if (next.bytes > maximumBytes || next.entries > maximumEntries) {
    throw new DOMException('Artifact storage quota exceeded.', 'QuotaExceededError');
  }
  return next;
}

export class MemoryArtifactBackend {
  constructor({ name = 'memory' } = {}) {
    this.name = name;
    this.data = new Map(collections.map((name) => [name, new Map()]));
    this.usage = new Map(collections.map((name) => [name, emptyUsage()]));
  }
  async open() {}
  async close() {}
  async get(collection, key) { return copy(this.data.get(collection).get(key)?.value); }
  async getUsage(collection) { return { ...this.usage.get(collection) }; }
  async put(collection, key, value, limits) {
    const data = this.data.get(collection);
    const old = data.get(key);
    if (collection === 'blocks' && old) return false;
    const size = valueBytes(value);
    const usage = nextUsage(this.usage.get(collection), old, size, limits);
    data.set(key, { value: copy(value), size, generation: usage.generation });
    this.usage.set(collection, usage);
    return true;
  }
  async delete(collection, key) {
    const data = this.data.get(collection);
    const old = data.get(key);
    if (!old) return false;
    const usage = this.usage.get(collection);
    this.usage.set(collection, { ...usage, bytes: usage.bytes - old.size, entries: usage.entries - 1 });
    data.delete(key);
    return true;
  }
  async scan(collection, { after, limit = 16, keysOnly = false } = {}) {
    return [...this.data.get(collection).keys()].sort().filter((key) => after === undefined || key > after)
      .slice(0, limit).map((key) => ({ key, generation: this.data.get(collection).get(key).generation,
        ...(keysOnly ? {} : { value: copy(this.data.get(collection).get(key).value) }) }));
  }
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class IndexedDBArtifactBackend {
  constructor({ name = 'default', indexedDBImpl = globalThis.indexedDB,
    keyRange = globalThis.IDBKeyRange } = {}) {
    this.name = `${ARTIFACT_DATABASE_PREFIX}${name}`;
    this.indexedDB = indexedDBImpl;
    this.keyRange = keyRange;
    this.database = null;
    this.opening = null;
  }
  async open() {
    if (this.database) return;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open || !this.keyRange) throw new Error('Persistent artifacts require IndexedDB and IDBKeyRange.');
    this.opening = new Promise((resolve, reject) => {
      const request = this.indexedDB.open(this.name, 1);
      let blocked = false;
      request.onupgradeneeded = () => {
        for (const name of [...collections, 'usage']) request.result.createObjectStore(name);
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => { blocked = true; reject(new Error('Artifact database open blocked by another context.')); };
      request.onsuccess = () => {
        if (blocked) { request.result.close(); return; }
        this.database = request.result;
        this.database.onversionchange = () => { this.database?.close(); this.database = null; };
        resolve();
      };
    });
    try { await this.opening; } finally { this.opening = null; }
  }
  async close() { await this.opening; this.database?.close(); this.database = null; }
  async _transaction(names, mode, action) {
    if (!this.database) throw new Error('Artifact database is closed.');
    const transaction = this.database.transaction(names, mode);
    const completed = new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onabort = () => reject(transaction.error || new Error('Artifact transaction aborted.'));
      transaction.onerror = () => {}; // onabort carries the final transaction failure.
    });
    try {
      const result = await action(transaction);
      await completed;
      return result;
    } catch (error) {
      try { transaction.abort(); } catch { /* Already completed or aborted. */ }
      await completed.catch(() => {});
      throw error;
    }
  }
  async get(collection, key) {
    return this._transaction([collection], 'readonly', async (tx) => (await requestResult(tx.objectStore(collection).get(key)))?.value);
  }
  async getUsage(collection) {
    return this._transaction(['usage'], 'readonly', async (tx) => await requestResult(tx.objectStore('usage').get(collection)) || emptyUsage());
  }
  async put(collection, key, value, limits) {
    return this._transaction([collection, 'usage'], 'readwrite', async (tx) => {
      const data = tx.objectStore(collection);
      const usages = tx.objectStore('usage');
      const [old, previous] = await Promise.all([requestResult(data.get(key)), requestResult(usages.get(collection))]);
      if (collection === 'blocks' && old) return false;
      const size = valueBytes(value);
      const next = nextUsage(previous || emptyUsage(), old, size, limits);
      await Promise.all([requestResult(data.put({ value, size, generation: next.generation }, key)), requestResult(usages.put(next, collection))]);
      return true;
    });
  }
  async delete(collection, key) {
    return this._transaction([collection, 'usage'], 'readwrite', async (tx) => {
      const data = tx.objectStore(collection);
      const usages = tx.objectStore('usage');
      const [old, previous] = await Promise.all([requestResult(data.get(key)), requestResult(usages.get(collection))]);
      if (!old) return false;
      const usage = previous || emptyUsage();
      await Promise.all([requestResult(data.delete(key)), requestResult(usages.put({
        ...usage, bytes: usage.bytes - old.size, entries: usage.entries - 1
      }, collection))]);
      return true;
    });
  }
  async scan(collection, { after, limit = 16, keysOnly = false } = {}) {
    return this._transaction([collection], 'readonly', (tx) => new Promise((resolve, reject) => {
      const data = tx.objectStore(collection);
      const range = after === undefined ? undefined : this.keyRange.lowerBound(after, true);
      const request = data.openCursor(range);
      const entries = [];
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor || entries.length >= limit) { resolve(entries); return; }
        entries.push({ key: cursor.key, generation: cursor.value.generation,
          ...(keysOnly ? {} : { value: cursor.value.value }) });
        if (entries.length >= limit) resolve(entries); else cursor.continue();
      };
    }));
  }
}
