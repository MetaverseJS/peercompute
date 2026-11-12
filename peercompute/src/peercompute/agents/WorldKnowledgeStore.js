import { agentIdentifier } from './AgentContracts.js';
import { WORLD_KNOWLEDGE_LIMITS, normalizeWorldKnowledgeRecord, worldKnowledgeScope, worldKnowledgeScopeKey,
  worldKnowledgeText, worldKnowledgeArray, worldKnowledgeBytes } from './WorldKnowledgeContracts.js';

const copy = value => value === undefined ? undefined : structuredClone(value);
const request = value => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
const failure = (code, message) => Object.assign(new Error(message), { code });
function bounded(value, maximum, label) {
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) throw new TypeError(`Invalid knowledge ${label}`);
  return value;
}
function revision(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw new TypeError('Knowledge writes require an explicit expectedRevision');
  return value;
}
function checkGuard(isCurrent) {
  if (isCurrent !== undefined && typeof isCurrent !== 'function') throw new TypeError('Knowledge isCurrent must be a synchronous function');
}
function assertCurrent(isCurrent, signal) {
  signal?.throwIfAborted();
  if (isCurrent === undefined) return;
  const current = isCurrent();
  if (typeof current !== 'boolean') throw new TypeError('Knowledge isCurrent must return a synchronous boolean');
  if (!current) throw new DOMException('Knowledge authority changed before commit', 'AbortError');
}
const keyFor = (scope, id) => JSON.stringify([worldKnowledgeScopeKey(scope), agentIdentifier(id)]);
const semanticFor = record => JSON.stringify([worldKnowledgeScopeKey(record), record.kind, record.subjectType, record.subjectId]);
const rowFor = record => ({ key: keyFor(record, record.id), scope: worldKnowledgeScopeKey(record),
  semantic: semanticFor(record), record, byteLength: worldKnowledgeBytes(record), forgotten: false });

/** Durable, scoped facts with evidence. IndexedDB transactions serialize CAS
 * across tabs. Bounds reject writes atomically; useful knowledge is never
 * silently evicted. Minimal tombstones fence late inference after Forget. */
export class WorldKnowledgeStore {
  constructor({ name = 'default', indexedDBImpl = globalThis.indexedDB, now = Date.now, onDestroy,
    maximumPerResident = WORLD_KNOWLEDGE_LIMITS.perResident, maximumEntries = WORLD_KNOWLEDGE_LIMITS.entries,
    maximumBytes = WORLD_KNOWLEDGE_LIMITS.bytes } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/.test(name) || typeof now !== 'function') throw new TypeError('Invalid knowledge store configuration');
    Object.assign(this, { name, indexedDB: indexedDBImpl, now, onDestroy,
      maximumPerResident: bounded(maximumPerResident, WORLD_KNOWLEDGE_LIMITS.perResident, 'resident limit'),
      maximumEntries: bounded(maximumEntries, WORLD_KNOWLEDGE_LIMITS.entries, 'entry limit'),
      maximumBytes: bounded(maximumBytes, WORLD_KNOWLEDGE_LIMITS.bytes, 'byte limit') });
    this.databaseName = `peercompute-world-knowledge-v1-${name}`; this.persistent = true; this.transactions = new Set();
  }
  _time() { const now = this.now(); if (!Number.isSafeInteger(now) || now < 0) throw new TypeError('Invalid knowledge clock'); return now; }
  async open() {
    if (this.closed) throw new Error('World knowledge store is closed');
    if (this.database) return this;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open) throw new Error('World knowledge requires IndexedDB');
    this.opening = new Promise((resolve, reject) => {
      const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
      opening.onupgradeneeded = () => {
        const records = opening.result.createObjectStore('records', { keyPath: 'key' });
        records.createIndex('scope', 'scope'); records.createIndex('semantic', 'semantic', { unique: true });
      };
      opening.onerror = () => { failed = true; reject(opening.error); };
      opening.onblocked = () => { failed = true; reject(new Error('World knowledge database upgrade is blocked')); };
      opening.onsuccess = () => {
        if (failed || this.closed) { opening.result.close(); if (!failed) reject(new Error('World knowledge store is closed')); return; }
        this.database = opening.result;
        this.database.onversionchange = () => { this.database?.close(); this.database = null; this.closed = true; };
        resolve(this);
      };
    }).finally(() => { this.opening = null; });
    return this.opening;
  }
  async _transaction(mode, action, signal) {
    signal?.throwIfAborted();
    if (this.closed || !this.database) throw new Error('World knowledge store is not open');
    const tx = this.database.transaction('records', mode);
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error ?? signal?.reason ?? new Error('World knowledge transaction aborted'));
      tx.onerror = () => {};
    });
    completion.catch(() => {}); this.transactions.add(completion);
    const abort = () => { try { tx.abort(); } catch { /* Completed writes remain acknowledged. */ } };
    signal?.addEventListener('abort', abort, { once: true });
    try { const result = await action(tx.objectStore('records')); await completion; return copy(result); }
    catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); signal?.removeEventListener('abort', abort); }
  }
  _capacity(rows) {
    const counts = new Map();
    for (const row of rows) {
      const owner = JSON.stringify([row.record.agentId, row.record.worldId]); counts.set(owner, (counts.get(owner) ?? 0) + 1);
    }
    if (rows.length > this.maximumEntries || rows.reduce((sum, row) => sum + row.byteLength, 0) > this.maximumBytes
        || [...counts.values()].some(count => count > this.maximumPerResident)) {
      throw new RangeError('Knowledge capacity exceeded; retained knowledge was not removed');
    }
  }
  /** expectedRevision=0 creates; updates require the current persisted revision.
   * Scope, id and authenticated subject identity cannot be corrected by prose. */
  put(input, { expectedRevision, signal, isCurrent } = {}) {
    revision(expectedRevision); checkGuard(isCurrent);
    if (!input || ![Object.prototype, null].includes(Object.getPrototypeOf(input))) throw new TypeError('Invalid knowledge record');
    const now = this._time(), id = input.id ?? (expectedRevision === 0 ? crypto.randomUUID() : undefined);
    const candidate = normalizeWorldKnowledgeRecord({ ...input, id, revision: expectedRevision + 1,
      createdAt: now, updatedAt: now }, { now });
    const row = rowFor(candidate);
    return this._transaction('readwrite', async store => {
      const rows = await request(store.getAll()), previous = rows.find(item => item.key === row.key), semantic = rows.find(item => item.semantic === row.semantic);
      if (previous?.forgotten || semantic?.forgotten) throw failure('ERR_WORLD_KNOWLEDGE_FORGOTTEN', 'This knowledge was forgotten; stale evidence cannot recreate it');
      if ((previous?.record.revision ?? 0) !== expectedRevision || (!previous && semantic)) {
        throw failure('ERR_WORLD_KNOWLEDGE_CONFLICT', 'Knowledge changed; reload its current revision before editing');
      }
      if (previous && previous.semantic !== row.semantic) throw new TypeError('Knowledge subject identity is immutable');
      if (previous) {
        candidate.createdAt = previous.record.createdAt;
        candidate.updatedAt = Math.max(now, previous.record.updatedAt);
        if (JSON.stringify(candidate.origin) !== JSON.stringify(previous.record.origin)) throw new TypeError('Knowledge inheritance provenance is immutable');
      }
      row.byteLength = worldKnowledgeBytes(candidate);
      this._capacity([...rows.filter(item => item.key !== row.key), row]);
      assertCurrent(isCurrent, signal);
      await request(store.put(row)); return candidate;
    }, signal);
  }
  get(scope, id, { signal } = {}) {
    const key = keyFor(scope, id);
    return this._transaction('readonly', async store => { const row = await request(store.get(key)); return row?.forgotten ? undefined : row?.record; }, signal);
  }
  list(scope, { signal } = {}) {
    const key = worldKnowledgeScopeKey(scope);
    return this._transaction('readonly', async store => (await request(store.index('scope').getAll(key)))
      .filter(row => !row.forgotten).map(row => row.record).sort((a, b) => a.label.localeCompare(b.label) || a.id.localeCompare(b.id)), signal);
  }
  retrieve(input, { signal } = {}) {
    const key = worldKnowledgeScopeKey(input), limit = bounded(input.limit ?? 8, WORLD_KNOWLEDGE_LIMITS.results, 'result limit');
    const words = [...new Set(worldKnowledgeText(input.query ?? '', 512, 'query', true).toLocaleLowerCase().split(/\s+/u).filter(Boolean))].slice(0, 16);
    return this._transaction('readonly', async store => (await request(store.index('scope').getAll(key)))
      .filter(row => !row.forgotten).map(({ record }) => {
        const haystack = `${record.label} ${record.note} ${record.kind}`.toLocaleLowerCase();
        return { record, score: words.filter(word => haystack.includes(word)).length };
      }).sort((a, b) => b.score - a.score || b.record.updatedAt - a.record.updatedAt || a.record.id.localeCompare(b.record.id))
      .slice(0, limit).map(({ record }) => record), signal);
  }
  forget(scope, id, { expectedRevision, signal, isCurrent } = {}) {
    revision(expectedRevision); checkGuard(isCurrent); const key = keyFor(scope, id), now = this._time();
    return this._transaction('readwrite', async store => {
      const row = await request(store.get(key));
      if (!row || row.forgotten || row.record.revision !== expectedRevision) {
        throw failure('ERR_WORLD_KNOWLEDGE_CONFLICT', 'Knowledge changed; reload its current revision before forgetting');
      }
      const previous = row.record;
      row.forgotten = true;
      row.record = { ...worldKnowledgeScope(previous), id, revision: previous.revision + 1, kind: previous.kind,
        subjectType: previous.subjectType, subjectId: previous.subjectId, forgottenAt: now };
      row.byteLength = worldKnowledgeBytes(row.record);
      assertCurrent(isCurrent, signal);
      await request(store.put(row)); return { id, revision: row.record.revision, forgottenAt: now };
    }, signal);
  }
  /** Owner-only explicit export. No implicit widening from one private visitor
   * conversation to another, and forgotten facts never enter clone snapshots. */
  snapshot({ agentId, worldId, includePrivate = false }, { signal } = {}) {
    agentIdentifier(agentId); worldKnowledgeText(worldId, 240, 'world');
    if (typeof includePrivate !== 'boolean') throw new TypeError('Invalid private knowledge selection');
    return this._transaction('readonly', async store => (await request(store.getAll()))
      .filter(({ record, forgotten }) => !forgotten && record.agentId === agentId && record.worldId === worldId
        && (record.audience === 'public' || includePrivate))
      .map(row => row.record).sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)), signal);
  }
  /** An entire donor snapshot, or nothing. Evidence keeps its original episode
   * attribution; the clone never claims it observed the donor's experiences. */
  inheritSnapshot({ agentId, worldId, records, sourceAgentId, sourcePeerId }, { signal } = {}) {
    agentIdentifier(agentId); agentIdentifier(sourceAgentId); worldKnowledgeText(worldId, 240, 'world');
    if (sourcePeerId !== undefined) worldKnowledgeText(sourcePeerId, 160, 'source peer');
    if (agentId === sourceAgentId) throw new TypeError('Inherited knowledge requires a new resident identity');
    const now = this._time(), rows = worldKnowledgeArray(records, this.maximumPerResident, 'snapshot').map(input => {
      const source = normalizeWorldKnowledgeRecord(input, { now });
      if (source.agentId !== sourceAgentId || source.worldId !== worldId) throw new TypeError('Inherited knowledge source or world mismatch');
      return rowFor(normalizeWorldKnowledgeRecord({ ...source, agentId, id: crypto.randomUUID(), revision: 1,
        createdAt: now, updatedAt: now, confidence: 'shared', evidence: source.evidence.map(item => ({ ...item, provenance: 'shared' })),
        origin: { sourceAgentId, sourceRecordId: source.id, ...(sourcePeerId !== undefined ? { sourcePeerId } : {}) } }, { now }));
    });
    if (new Set(rows.map(row => row.semantic)).size !== rows.length) throw new TypeError('Duplicate inherited knowledge subjects');
    this._capacity(rows);
    return this._transaction('readwrite', async store => {
      const existing = await request(store.getAll());
      if (existing.some(row => row.record.agentId === agentId)) throw new Error('Inherited knowledge requires an empty destination resident');
      this._capacity([...existing, ...rows]);
      for (const row of rows) await request(store.add(row));
      return rows.map(row => row.record);
    }, signal);
  }
  /** Roll back an unexposed staged clone, never normal owner forgetting. Any
   * local observation, correction or forgotten fact makes this ineligible. */
  clearAgent({ agentId, worldId }, { signal } = {}) {
    agentIdentifier(agentId); worldKnowledgeText(worldId, 240, 'world');
    return this._transaction('readwrite', async store => {
      const rows = (await request(store.getAll())).filter(row => row.record.agentId === agentId && row.record.worldId === worldId);
      if (rows.some(row => row.forgotten || !row.record.origin || row.record.revision !== 1)) throw new Error('Knowledge cleanup requires an untouched staged clone');
      for (const row of rows) await request(store.delete(row.key));
      return rows.length;
    }, signal);
  }
  stats({ signal } = {}) {
    return this._transaction('readonly', async store => {
      const rows = await request(store.getAll());
      return { retainedEntries: rows.filter(row => !row.forgotten).length, forgottenEntries: rows.filter(row => row.forgotten).length,
        retainedBytes: rows.reduce((sum, row) => sum + row.byteLength, 0), maximumEntries: this.maximumEntries,
        maximumPerResident: this.maximumPerResident, maximumBytes: this.maximumBytes, retrieval: 'text-match-and-recency' };
    }, signal);
  }
  close() { return this.destroy(); }
  destroy() {
    if (this.closing) return this.closing;
    this.closed = true;
    this.closing = (async () => {
      await this.opening?.catch(() => {}); await Promise.allSettled([...this.transactions]);
      this.database?.close(); this.database = null; this.onDestroy?.(this);
    })();
    return this.closing;
  }
}
