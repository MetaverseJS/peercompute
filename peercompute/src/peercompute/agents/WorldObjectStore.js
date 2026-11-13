import { artifactCID } from '../artifacts/ArtifactManifest.js';

const copy = value => value === undefined ? undefined : structuredClone(value);
const request = value => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
const conflict = () => Object.assign(new Error('World object changed; inspect its current revision before editing'), { code: 'ERR_WORLD_OBJECT_CONFLICT' });
function text(value, limit) {
  if (typeof value !== 'string' || !value.trim() || value.length > limit || /[\u0000-\u001f]/.test(value)) throw new TypeError('Invalid world object store identity');
  return value;
}
function scopeFor(value) { return JSON.stringify([text(value.worldId, 240), text(value.ownerHostId, 128)]); }
const keyFor = value => JSON.stringify([scopeFor(value), text(value.objectId, 128)]);
const operationKey = (scope, id) => JSON.stringify([scopeFor(scope), text(id, 128)]);
function guard({ signal, isCurrent } = {}) {
  signal?.throwIfAborted();
  if (isCurrent !== undefined && (typeof isCurrent !== 'function' || isCurrent() !== true)) {
    throw new DOMException('World object authority changed before commit', 'AbortError');
  }
}

/** StateManager-owned durable heads over immutable manifests. One transaction
 * commits the current revision and idempotency receipt; candidates are never
 * restored just because their manifest happened to reach disk. */
export class WorldObjectStore {
  constructor({ name = 'default', persistent = true, indexedDBImpl = globalThis.indexedDB, onDestroy } = {}) {
    if (!/^[\w.-]{1,80}$/.test(name)) throw new TypeError('Invalid world object store name');
    Object.assign(this, { name, persistent, indexedDB: indexedDBImpl, onDestroy });
    this.databaseName = `peercompute-world-objects-v1-${name}`;
    this.transactions = new Set(); this.memory = { heads: new Map(), operations: new Map() }; this.queue = Promise.resolve();
  }
  async open() {
    if (this.closed) throw new Error('World object store is closed');
    if (!this.persistent || this.database) return this;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open) throw new Error('World objects require IndexedDB');
    this.opening = new Promise((resolve, reject) => {
      const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
      opening.onupgradeneeded = () => {
        opening.result.createObjectStore('heads', { keyPath: 'key' });
        opening.result.createObjectStore('operations', { keyPath: 'key' });
      };
      opening.onerror = () => { failed = true; reject(opening.error); };
      opening.onblocked = () => { failed = true; reject(new Error('World object database upgrade is blocked')); };
      opening.onsuccess = () => {
        if (failed || this.closed) { opening.result.close(); if (!failed) reject(new Error('World object store is closed')); return; }
        this.database = opening.result;
        this.database.onversionchange = () => { this.database?.close(); this.database = null; this.closed = true; };
        resolve(this);
      };
    }).finally(() => { this.opening = null; });
    return this.opening;
  }
  async _transaction(mode, action, options = {}) {
    await this.open(); options.signal?.throwIfAborted();
    if (!this.persistent) {
      const work = this.queue.then(async () => {
        if (this.closed) throw new Error('World object store is closed');
        const data = structuredClone(this.memory);
        const result = await action(Object.fromEntries(Object.entries(data).map(([name, map]) => [name, {
          get: async key => copy(map.get(key)), all: async () => [...map.values()].map(copy),
          put: async row => { map.set(row.key, copy(row)); },
        }])));
        if (mode === 'readwrite') this.memory = data;
        return copy(result);
      });
      this.queue = work.catch(() => {}); return work;
    }
    const tx = this.database.transaction(['heads', 'operations'], mode);
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error ?? options.signal?.reason ?? new Error('World object transaction aborted'));
      tx.onerror = () => {};
    });
    completion.catch(() => {}); this.transactions.add(completion);
    const abort = () => { try { tx.abort(); } catch { /* Already committed. */ } };
    options.signal?.addEventListener('abort', abort, { once: true });
    try {
      const result = await action(Object.fromEntries(['heads', 'operations'].map(name => {
        const store = tx.objectStore(name);
        return [name, { get: key => request(store.get(key)), all: () => request(store.getAll()), put: row => request(store.put(row)) }];
      })));
      await completion; return copy(result);
    } catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); options.signal?.removeEventListener('abort', abort); }
  }
  get(scope, objectId, options) { return this._transaction('readonly', ({ heads }) => heads.get(keyFor({ ...scope, objectId })), options); }
  list(scope, options) { const key = scopeFor(scope); return this._transaction('readonly', async ({ heads }) => (await heads.all()).filter(row => row.scope === key), options); }
  operation(scope, requestId, options) { return this._transaction('readonly', ({ operations }) => operations.get(operationKey(scope, requestId)), options); }
  /** Only legacy/create manifests are adopted. A later orphan transform must
   * never become a head during scanning, and tombstones cannot be resurrected. */
  adopt(input, options = {}) {
    const key = keyFor(input), artifactCid = artifactCID(input.artifactCid).toString();
    return this._transaction('readwrite', async ({ heads, operations }) => {
      const previous = await heads.get(key); if (previous) return previous;
      const head = { key, scope: scopeFor(input), worldId: input.worldId, ownerHostId: input.ownerHostId,
        objectId: input.objectId, revision: 0, artifactCid, deleted: false };
      guard(options); await heads.put(head);
      if (input.requestId && /^[a-f0-9]{64}$/.test(input.requestHash)) {
        const op = { key: operationKey(input, input.requestId), scope: head.scope, objectId: input.objectId,
          agentId: text(input.agentId, 128), requestId: input.requestId, requestHash: input.requestHash,
          revision: 0, artifactCid, deleted: false };
        if (await operations.get(op.key)) throw conflict();
        guard(options);
        await operations.put(op);
      }
      return head;
    }, options);
  }
  commit(input, options = {}) {
    const key = keyFor(input), opKey = operationKey(input, input.requestId);
    if (!Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0 || input.expectedRevision >= Number.MAX_SAFE_INTEGER
        || !/^[a-f0-9]{64}$/.test(input.requestHash)) throw new TypeError('Invalid world object revision or request fingerprint');
    const artifactCid = artifactCID(input.artifactCid).toString(), previousArtifactCid = artifactCID(input.expectedArtifactCid).toString();
    text(input.agentId, 128);
    return this._transaction('readwrite', async ({ heads, operations }) => {
      const prior = await operations.get(opKey);
      if (prior) {
        if (prior.requestHash !== input.requestHash || prior.objectId !== input.objectId || prior.agentId !== input.agentId) throw conflict();
        guard(options); return { operation: prior, head: await heads.get(key), replayed: true };
      }
      const previous = await heads.get(key);
      if (!previous || previous.deleted || previous.revision !== input.expectedRevision || previous.artifactCid !== previousArtifactCid) throw conflict();
      const head = { ...previous, revision: previous.revision + 1, artifactCid, deleted: input.deleted === true };
      const operation = { key: opKey, scope: head.scope, objectId: input.objectId, agentId: input.agentId, requestId: input.requestId,
        requestHash: input.requestHash, revision: head.revision, artifactCid, previousArtifactCid, deleted: head.deleted };
      guard(options); await heads.put(head); guard(options); await operations.put(operation);
      return { head, operation, replayed: false };
    }, options);
  }
  close() { return this.destroy(); }
  destroy() {
    if (this.closing) return this.closing;
    this.closed = true;
    this.closing = (async () => {
      await this.opening?.catch(() => {}); await this.queue; await Promise.allSettled([...this.transactions]);
      this.database?.close(); this.database = null; this.onDestroy?.(this);
    })();
    return this.closing;
  }
}
