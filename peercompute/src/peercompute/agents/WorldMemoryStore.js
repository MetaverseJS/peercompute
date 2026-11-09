import { agentIdentifier } from './AgentContracts.js';
import { worldAgentText, normalizeWorldPosition } from './WorldAgentContracts.js';

export const WORLD_MEMORY_LIMITS = Object.freeze({ perScope: 512, entries: 4096, bytes: 4 * 1024 * 1024,
  episodeBytes: 4096, retentionMs: 30 * 24 * 60 * 60 * 1000, results: 32 });
const encoder = new TextEncoder();
const copy = value => value === undefined ? undefined : structuredClone(value);
const request = value => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
const bounded = (value, maximum, label) => {
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) throw new TypeError(`Invalid memory ${label}`);
  return value;
};
const text = (value, maximum, label, empty = false) => {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.includes('\0')
      || encoder.encode(value).length > maximum || new TextDecoder().decode(encoder.encode(value)) !== value) {
    throw new TypeError(`Invalid memory ${label}`);
  }
  return value;
};
export function worldMemoryScope(value) {
  if (!['public', 'private'].includes(value?.audience)) throw new TypeError('Memory requires an explicit conversation audience');
  return { agentId: agentIdentifier(value.agentId), worldId: worldAgentText(value.worldId, 240, 'world'),
    audience: value.audience, conversationId: worldAgentText(value.conversationId, 160, 'conversation') };
}
const scopeKey = value => JSON.stringify(Object.values(worldMemoryScope(value)));
function normalizeEpisode(input, now) {
  const scope = worldMemoryScope(input), source = input.source, who = input.who;
  if (!['verified-action', 'authenticated-message', 'local-observation', 'shared-memory'].includes(source?.kind)) throw new TypeError('Memory requires explicit event provenance');
  const when = input.when ?? now;
  if (!Number.isSafeInteger(when) || when < 0 || when > now + 60_000) throw new TypeError('Invalid memory timestamp');
  const record = { ...scope, id: crypto.randomUUID(), kind: worldAgentText(input.kind, 80, 'episode kind'),
    when, recordedAt: now, where: normalizeWorldPosition(input.where),
    who: { ...(who?.peerId ? { peerId: worldAgentText(who.peerId, 160, 'event peer') } : {}),
      ...(who?.agentId ? { agentId: agentIdentifier(who.agentId) } : {}),
      ...(who?.name ? { name: worldAgentText(who.name, 240, 'event name') } : {}) },
    outcome: text(input.outcome, 512, 'outcome'), text: text(input.text ?? '', 2048, 'text', true),
    source: { kind: source.kind, eventId: worldAgentText(source.eventId, 160, 'event ID'),
      ...(source.kind === 'shared-memory' ? { sourceAgentId: agentIdentifier(source.sourceAgentId) } : {}),
      ...(source.peerId ? { peerId: worldAgentText(source.peerId, 160, 'source peer') } : {}) } };
  if (!record.who.peerId && !record.who.agentId) throw new TypeError('Memory requires a participant identity');
  if (encoder.encode(JSON.stringify(record)).length > WORLD_MEMORY_LIMITS.episodeBytes) throw new RangeError('Memory episode exceeds its byte budget');
  return record;
}

/** Private episodic observations, separate from the agent operation journal/Yjs.
 * Callers supply verified events, never per-frame sensor samples or model claims.
 * Retrieval is deterministic text matching and recency, not semantic embeddings. */
export class WorldMemoryStore {
  constructor({ name = 'default', indexedDBImpl = globalThis.indexedDB, now = Date.now, onDestroy,
    maximumPerScope = WORLD_MEMORY_LIMITS.perScope, maximumEntries = WORLD_MEMORY_LIMITS.entries,
    maximumBytes = WORLD_MEMORY_LIMITS.bytes, retentionMs = WORLD_MEMORY_LIMITS.retentionMs } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/.test(name) || typeof now !== 'function') throw new TypeError('Invalid memory store configuration');
    Object.assign(this, { name, indexedDB: indexedDBImpl, now, onDestroy,
      maximumPerScope: bounded(maximumPerScope, WORLD_MEMORY_LIMITS.perScope, 'scope limit'),
      maximumEntries: bounded(maximumEntries, WORLD_MEMORY_LIMITS.entries, 'entry limit'),
      maximumBytes: bounded(maximumBytes, WORLD_MEMORY_LIMITS.bytes, 'byte limit'),
      retentionMs: bounded(retentionMs, WORLD_MEMORY_LIMITS.retentionMs, 'retention') });
    this.databaseName = `peercompute-world-memory-v1-${name}`; this.persistent = true;
    this.transactions = new Set();
  }
  _time() { const now = this.now(); if (!Number.isSafeInteger(now) || now < 0) throw new TypeError('Invalid memory clock'); return now; }
  async open() {
    if (this.closed) throw new Error('World memory store is closed');
    if (this.database) return this;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open) throw new Error('World memory requires IndexedDB');
    this.opening = new Promise((resolve, reject) => {
      const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
      opening.onupgradeneeded = () => {
        const episodes = opening.result.createObjectStore('episodes', { keyPath: 'key' });
        episodes.createIndex('scope', 'scope');
        opening.result.createObjectStore('metadata');
      };
      opening.onerror = () => { failed = true; reject(opening.error); };
      opening.onblocked = () => { failed = true; reject(new Error('World memory database upgrade is blocked')); };
      opening.onsuccess = () => {
        if (failed || this.closed) { opening.result.close(); if (!failed) reject(new Error('World memory store is closed')); return; }
        this.database = opening.result;
        this.database.onversionchange = () => { this.database?.close(); this.database = null; this.closed = true; };
        resolve(this);
      };
    }).finally(() => { this.opening = null; });
    return this.opening;
  }
  async _transaction(mode, action, signal) {
    signal?.throwIfAborted();
    if (this.closed || !this.database) throw new Error('World memory store is not open');
    const tx = this.database.transaction(['episodes', 'metadata'], mode);
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error ?? signal?.reason ?? new Error('World memory transaction aborted'));
      tx.onerror = () => {};
    });
    completion.catch(() => {}); this.transactions.add(completion);
    const abort = () => { try { tx.abort(); } catch { /* A completed write remains acknowledged. */ } };
    signal?.addEventListener('abort', abort, { once: true });
    try { const result = await action(tx.objectStore('episodes'), tx.objectStore('metadata')); await completion; return copy(result); }
    catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); signal?.removeEventListener('abort', abort); }
  }
  append(input, { signal } = {}) {
    const now = this._time(), record = normalizeEpisode(input, now), scope = scopeKey(record);
    if (record.when <= now - this.retentionMs) throw new RangeError('Memory episode is outside retention');
    const key = JSON.stringify([scope, record.source.kind, record.source.peerId ?? '', record.source.eventId]);
    const byteLength = encoder.encode(JSON.stringify(record)).length;
    if (byteLength > this.maximumBytes) throw new RangeError('Memory episode exceeds store capacity');
    return this._transaction('readwrite', async (store, metadata) => {
      const rows = await request(store.getAll()), active = [];
      let discarded = 0;
      for (const row of rows) {
        if (row.record.when <= now - this.retentionMs) { await request(store.delete(row.key)); discarded++; } else active.push(row);
      }
      const recordDiscarded = async () => {
        if (discarded) await request(metadata.put(((await request(metadata.get('discarded'))) ?? 0) + discarded, 'discarded'));
      };
      const previous = active.find(row => row.key === key);
      if (previous) {
        const stable = value => JSON.stringify({ ...value, id: undefined, recordedAt: undefined, when: input.when === undefined ? undefined : value.when });
        if (stable(previous.record) !== stable(record)) throw new Error('Conflicting duplicate world memory event');
        await recordDiscarded(); return previous.record;
      }
      const row = { key, scope, byteLength, record }; active.push(row);
      active.sort((a, b) => a.record.when - b.record.when || a.record.recordedAt - b.record.recordedAt
        || Number(a === row) - Number(b === row) || a.key.localeCompare(b.key));
      let totalBytes = active.reduce((sum, entry) => sum + entry.byteLength, 0);
      const scoped = active.filter(entry => entry.scope === scope);
      const remove = async entry => { const index = active.indexOf(entry); if (index < 0) return;
        active.splice(index, 1); totalBytes -= entry.byteLength; discarded++; await request(store.delete(entry.key)); };
      while (scoped.length > this.maximumPerScope) await remove(scoped.shift());
      while (active.length > this.maximumEntries || totalBytes > this.maximumBytes) await remove(active[0]);
      if (!active.includes(row)) throw new RangeError('Memory event is older than retained capacity');
      await request(store.add(row)); await recordDiscarded(); return record;
    }, signal);
  }
  retrieve(input, { signal } = {}) {
    const scope = scopeKey(input), now = this._time(), limit = bounded(input.limit ?? 8, WORLD_MEMORY_LIMITS.results, 'result limit');
    const query = text(input.query ?? '', 512, 'query', true).toLocaleLowerCase();
    const words = [...new Set(query.split(/\s+/u).filter(Boolean))].slice(0, 16);
    return this._transaction('readonly', async store => {
      const rows = await request(store.index('scope').getAll(scope));
      return rows.filter(row => row.record.when > now - this.retentionMs).map(({ record }) => {
        const haystack = [record.text, record.outcome, record.kind, record.who.name ?? ''].join(' ').toLocaleLowerCase();
        return { record, score: words.filter(word => haystack.includes(word)).length };
      }).sort((a, b) => b.score - a.score || b.record.when - a.record.when || b.record.recordedAt - a.record.recordedAt)
        .slice(0, limit).map(({ record }) => record);
    }, signal);
  }
  /** Owner-selected clone export, unlike the small prompt-retrieval window.
   * Preserve audience and conversation boundaries; private history is opt-in. */
  snapshot({ agentId, worldId, includePrivate = false }, { signal } = {}) {
    agentIdentifier(agentId); worldAgentText(worldId, 240, 'world');
    if (typeof includePrivate !== 'boolean') throw new TypeError('Invalid private memory selection');
    const now = this._time();
    return this._transaction('readonly', async store => {
      const rows = (await request(store.getAll())).filter(({ record }) => record.agentId === agentId
        && record.worldId === worldId && record.when > now - this.retentionMs
        && (record.audience === 'public' || (includePrivate && record.audience === 'private')));
      if (rows.length > this.maximumEntries || rows.reduce((sum, row) => sum + row.byteLength, 0) > this.maximumBytes) {
        throw new RangeError('Memory snapshot exceeds retained store bounds');
      }
      return rows.sort((a, b) => a.record.when - b.record.when || a.record.recordedAt - b.record.recordedAt
        || a.key.localeCompare(b.key)).map(({ record }) => record);
    }, signal);
  }
  /** Import the entire selected donor history or nothing. Capacity pressure
   * must not evict another resident or silently discard part of the clone. */
  inheritSnapshot({ agentId, worldId, episodes, sourceAgentId, sourcePeerId }, { signal } = {}) {
    agentIdentifier(agentId); agentIdentifier(sourceAgentId); worldAgentText(worldId, 240, 'world');
    if (agentId === sourceAgentId) throw new TypeError('Inherited memories require a new resident identity');
    if (sourcePeerId !== undefined) worldAgentText(sourcePeerId, 160, 'source peer');
    if (!Array.isArray(episodes) || episodes.length > this.maximumEntries) throw new RangeError('Inherited memory count exceeds store capacity');
    const now = this._time(), rows = episodes.map(episode => {
      if (episode.sourceAgentId !== sourceAgentId || episode.worldId !== worldId) throw new TypeError('Inherited memory source or world mismatch');
      const record = normalizeEpisode({ ...episode, agentId, worldId,
        source: { kind: 'shared-memory', sourceAgentId, ...(sourcePeerId ? { peerId: sourcePeerId } : {}), eventId: crypto.randomUUID() } }, now);
      if (record.when <= now - this.retentionMs) throw new RangeError('Inherited memory is outside retention');
      const scope = scopeKey(record);
      return { scope, key: JSON.stringify([scope, record.source.kind, sourcePeerId ?? '', record.source.eventId]),
        byteLength: encoder.encode(JSON.stringify(record)).length, record };
    });
    const incomingBytes = rows.reduce((sum, row) => sum + row.byteLength, 0), counts = new Map();
    for (const row of rows) counts.set(row.scope, (counts.get(row.scope) ?? 0) + 1);
    if (incomingBytes > this.maximumBytes || [...counts.values()].some(count => count > this.maximumPerScope)) {
      throw new RangeError('Inherited history exceeds retained store capacity; no memories were imported');
    }
    return this._transaction('readwrite', async (store, metadata) => {
      const existing = await request(store.getAll()), active = existing.filter(row => row.record.when > now - this.retentionMs);
      if (active.some(row => row.record.agentId === agentId)) {
        throw new Error('Inherited history requires an empty destination resident');
      }
      if (active.length + rows.length > this.maximumEntries
          || active.reduce((sum, row) => sum + row.byteLength, 0) + incomingBytes > this.maximumBytes) {
        throw new RangeError('Insufficient memory capacity for the full inherited history; no memories were imported');
      }
      for (const row of existing) if (row.record.when <= now - this.retentionMs) await request(store.delete(row.key));
      for (const row of rows) await request(store.add(row));
      const discarded = existing.length - active.length;
      if (discarded) await request(metadata.put(((await request(metadata.get('discarded'))) ?? 0) + discarded, 'discarded'));
      return rows.map(({ record }) => record);
    }, signal);
  }
  get(scope, id, { signal } = {}) {
    agentIdentifier(id); const key = scopeKey(scope), now = this._time();
    return this._transaction('readonly', async store => (await request(store.index('scope').getAll(key)))
      .find(row => row.record.id === id && row.record.when > now - this.retentionMs)?.record, signal);
  }
  forget(scope, { signal } = {}) {
    const key = scopeKey(scope);
    return this._transaction('readwrite', async store => {
      const rows = await request(store.index('scope').getAll(key));
      for (const row of rows) await request(store.delete(row.key));
      return rows.length;
    }, signal);
  }
  stats({ signal } = {}) {
    const now = this._time();
    return this._transaction('readonly', async (store, metadata) => {
      const rows = await request(store.getAll()), retained = rows.filter(row => row.record.when > now - this.retentionMs);
      return { retainedEntries: retained.length, retainedBytes: retained.reduce((sum, row) => sum + row.byteLength, 0),
        expiredEntries: rows.length - retained.length, discardedEntries: (await request(metadata.get('discarded'))) ?? 0,
        maximumEntries: this.maximumEntries, maximumPerScope: this.maximumPerScope,
        maximumBytes: this.maximumBytes, retentionMs: this.retentionMs, retrieval: 'text-match-and-recency' };
    }, signal);
  }
  /** Close owned handles without deleting durable episodes, like AgentRecordStore. */
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
