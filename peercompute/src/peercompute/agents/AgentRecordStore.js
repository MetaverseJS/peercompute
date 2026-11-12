import { AGENT_SCHEMA, AGENT_EXPORT_SCHEMA, AGENT_LIMITS, activeAgentOperation,
  agentError, agentIdentifier, boundedAgentJson, normalizeAgentInput, normalizeAgentRecord,
  normalizeAgentOperation, normalizeAgentEvent, normalizeAgentAttachment } from './AgentContracts.js';

const request = (value) => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
const copy = (value) => value === undefined ? undefined : structuredClone(value);
const collections = ['heads', 'events', 'operations', 'attachments'];

/** Private acknowledged state, deliberately independent from Yjs and IPFS.
 * Browser locks protect execution; IDB compare-and-swap protects each checkpoint.
 * These local identifiers confer no authority on another origin or device. */
export class AgentRecordStore {
  constructor({ name = 'default', indexedDBImpl = globalThis.indexedDB, keyRange = globalThis.IDBKeyRange,
    lockManager = globalThis.navigator?.locks, now = Date.now, onDestroy } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/.test(name)) throw new TypeError('Invalid agent store name');
    this.name = name; this.databaseName = `peercompute-agents-v1-${name}`;
    this.lockName = this.databaseName; this.persistent = true;
    this.indexedDB = indexedDBImpl; this.keyRange = keyRange; this.lockManager = lockManager;
    this.now = now; this.onDestroy = onDestroy; this.database = null; this.hostId = null;
    this.runs = new Set(); this.transactions = new Set(); this.lifetime = new AbortController();
  }
  async open() {
    if (this.closing || this.destroyed) throw new Error('Agent store is closed');
    if (this.database) return this;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open || !this.keyRange) throw agentError('ERR_AGENT_STORAGE_UNAVAILABLE', 'Private agent persistence requires IndexedDB');
    this.opening = (async () => {
      this.database = await new Promise((resolve, reject) => {
        const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
        opening.onupgradeneeded = () => {
          const db = opening.result;
          db.createObjectStore('heads', { keyPath: 'id' });
          db.createObjectStore('events', { keyPath: ['agentId', 'sequence'] });
          db.createObjectStore('operations', { keyPath: ['agentId', 'id'] });
          db.createObjectStore('attachments', { keyPath: ['agentId', 'id'] });
          db.createObjectStore('metadata');
        };
        opening.onerror = () => { failed = true; reject(opening.error); };
        opening.onblocked = () => { failed = true; reject(agentError('ERR_AGENT_STORAGE_BLOCKED', 'Another tab is blocking the agent database upgrade')); };
        opening.onsuccess = () => { if (failed) opening.result.close(); else resolve(opening.result); };
      });
      this.database.onversionchange = () => {
        this.database?.close(); this.database = null;
        this.lifetime.abort(agentError('ERR_AGENT_STORAGE_CHANGED', 'Agent storage changed; pause and reload this tab'));
      };
      this.hostId = await this._transaction(['metadata'], 'readwrite', async (tx) => {
        const metadata = tx.objectStore('metadata');
        let id = await request(metadata.get('hostId'));
        if (!id) { id = crypto.randomUUID(); await request(metadata.put(id, 'hostId')); }
        return agentIdentifier(id, 'local host ID');
      });
      return this;
    })();
    try { return await this.opening; } catch (error) { this.database?.close(); this.database = null; throw error; }
    finally { this.opening = null; }
  }
  _time() { const at = this.now(); if (!Number.isSafeInteger(at) || at < 0) throw new Error('Invalid agent clock'); return at; }
  _newWork() { if (this.closing || this.destroyed) throw new Error('Agent store is closing'); }
  async _transaction(names, mode, action, signal) {
    signal?.throwIfAborted();
    if (!this.database || this.destroyed) throw agentError('ERR_AGENT_STORAGE_UNAVAILABLE', 'Agent database is unavailable');
    const tx = this.database.transaction(names, mode);
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onabort = () => reject(tx.error || signal?.reason || new Error('Agent transaction aborted'));
      tx.onerror = () => {};
    });
    this.transactions.add(completion); completion.catch(() => {});
    const abort = () => { try { tx.abort(); } catch { /* A committed transaction remains committed. */ } };
    signal?.addEventListener('abort', abort, { once: true });
    try { const result = await action(tx); await completion; return copy(result); }
    catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); signal?.removeEventListener('abort', abort); }
  }
  _range(id, after, numeric = false) {
    return this.keyRange.bound([id, after ?? (numeric ? 0 : '')], [id, numeric ? Number.MAX_SAFE_INTEGER : '\uffff'], after !== undefined, false);
  }
  _scan(tx, collection, range, limit, map = (value) => value) {
    return new Promise((resolve, reject) => {
      const result = [], cursor = tx.objectStore(collection).openCursor(range);
      cursor.onerror = () => reject(cursor.error);
      cursor.onsuccess = () => {
        const value = cursor.result;
        if (!value || result.length >= limit) return resolve(result);
        result.push(map(value.value));
        if (result.length >= limit) resolve(result); else value.continue();
      };
    });
  }
  _limit(value) { if (!Number.isSafeInteger(value) || value < 1 || value > 100) throw new RangeError('Agent page limit must be 1–100'); return value; }
  async create(input, { signal } = {}) {
    this._newWork(); const fields = normalizeAgentInput(input); const at = this._time();
    const record = normalizeAgentRecord({ schema: AGENT_SCHEMA, agentId: crypto.randomUUID(), agentKind: 'general', ...fields,
      authority: { kind: 'local', hostId: this.hostId, epoch: 0 }, revision: 1, status: 'paused', createdAt: at, updatedAt: at, pendingOperation: null });
    return this._transaction(['heads'], 'readwrite', async (tx) => {
      await request(tx.objectStore('heads').add({ id: record.agentId, record, eventCount: 0,
        eventBytes: 0, nextSequence: 1, operationCount: 0, attachmentCount: 0, attachmentBytes: 0 }));
      return record;
    }, signal);
  }
  /** Provision an installation default once; deletion never grants permission to recreate it. */
  async ensureDefault(key, input, { signal } = {}) {
    this._newWork();
    if (typeof key !== 'string' || !key.trim() || key.includes('\0') || new TextEncoder().encode(key).byteLength > 512) {
      throw new TypeError('Invalid agent default key');
    }
    const fields = normalizeAgentInput(input);
    if ('authority' in input) throw new TypeError('Default agent authority is assigned by the local store');
    const metadataKey = `default-agent:${key}`;
    return this._transaction(['heads', 'metadata'], 'readwrite', async (tx) => {
      const heads = tx.objectStore('heads'), metadata = tx.objectStore('metadata');
      const marker = await request(metadata.get(metadataKey));
      if (marker !== undefined) {
        const id = agentIdentifier(marker?.agentId, 'default ID');
        if (marker.hostId !== this.hostId) throw new Error('This installation does not own the default agent');
        const stored = await request(heads.get(id));
        if (!stored) return { head: null, created: false, removed: true };
        const head = normalizeAgentRecord(stored.record);
        if (head.agentId !== id || head.authority.hostId !== this.hostId) throw new Error('Invalid default agent identity or local authority');
        return { head, created: false, removed: false };
      }
      const at = this._time();
      const head = normalizeAgentRecord({ schema: AGENT_SCHEMA, agentId: crypto.randomUUID(), agentKind: 'general', ...fields,
        authority: { kind: 'local', hostId: this.hostId, epoch: 0 }, revision: 1, status: 'paused', createdAt: at, updatedAt: at, pendingOperation: null });
      await request(heads.add({ id: head.agentId, record: head, eventCount: 0, eventBytes: 0,
        nextSequence: 1, operationCount: 0, attachmentCount: 0, attachmentBytes: 0 }));
      // Kept outside the head and deletion collections, so exports/clones cannot inherit this role.
      await request(metadata.add({ agentId: head.agentId, hostId: this.hostId }, metadataKey));
      return { head, created: true, removed: false };
    }, signal);
  }
  get(id, { signal } = {}) {
    agentIdentifier(id); return this._transaction(['heads'], 'readonly', async (tx) => {
      const record = (await request(tx.objectStore('heads').get(id)))?.record;
      return record && normalizeAgentRecord(record);
    }, signal);
  }
  list({ after, limit = 50, signal } = {}) {
    if (after !== undefined) agentIdentifier(after);
    return this._transaction(['heads'], 'readonly', (tx) => this._scan(tx, 'heads', after === undefined ? null : this.keyRange.lowerBound(after, true), this._limit(limit), (value) => normalizeAgentRecord(value.record)), signal);
  }
  events(id, { after, limit = 50, signal } = {}) {
    agentIdentifier(id);
    if (after !== undefined && (!Number.isSafeInteger(after) || after < 0)) throw new TypeError('Invalid event cursor');
    return this._transaction(['events'], 'readonly', (tx) => this._scan(tx, 'events', this._range(id, after, true), this._limit(limit)), signal);
  }
  operations(id, { after, limit = 50, signal } = {}) {
    agentIdentifier(id); if (after !== undefined) agentIdentifier(after);
    return this._transaction(['operations'], 'readonly', (tx) => this._scan(tx, 'operations', this._range(id, after), this._limit(limit)), signal);
  }
  getOperation(id, operationId, { signal } = {}) {
    agentIdentifier(id); agentIdentifier(operationId);
    return this._transaction(['operations'], 'readonly', (tx) => request(tx.objectStore('operations').get([id, operationId])), signal);
  }
  getAttachment(id, attachmentId, { signal } = {}) {
    agentIdentifier(id); agentIdentifier(attachmentId);
    return this._transaction(['attachments'], 'readonly', (tx) => request(tx.objectStore('attachments').get([id, attachmentId])), signal);
  }
  async commit(id, { expectedRevision, head, event, operation, attachments = [] }, { signal } = {}) {
    agentIdentifier(id);
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1) throw new TypeError('Expected agent revision is required');
    const proposed = head === undefined ? null : normalizeAgentRecord(head);
    const suppliedEvent = event === undefined ? null : normalizeAgentEvent(event);
    const suppliedOperation = operation === undefined ? null : normalizeAgentOperation(operation);
    if (!Array.isArray(attachments) || attachments.length > 4) throw new TypeError('Too many agent attachments');
    const images = attachments.map(normalizeAgentAttachment);
    if (new Set(images.map((image) => image.id)).size !== images.length) throw new TypeError('Duplicate agent attachment');
    if (images.some((image) => !suppliedEvent?.attachmentIds?.includes(image.id))) throw new Error('Agent attachments require event references');
    const at = this._time();
    return this._transaction(collections, 'readwrite', async (tx) => {
      const heads = tx.objectStore('heads'), stored = await request(heads.get(id));
      if (!stored) throw agentError('ERR_AGENT_NOT_FOUND', 'Agent no longer exists');
      const previous = stored.record;
      if (previous.revision !== expectedRevision) throw agentError('ERR_AGENT_CONFLICT', 'Agent changed in another operation; reload before saving');
      const candidate = proposed ?? previous;
      if (candidate.agentId !== id || candidate.authority.hostId !== previous.authority.hostId
          || candidate.createdAt !== previous.createdAt || candidate.authority.hostId !== this.hostId) throw new Error('Agent identity and local authority cannot be changed');
      let pending = previous.pendingOperation;
      if (suppliedOperation) {
        const ops = tx.objectStore('operations');
        const old = await request(ops.get([id, suppliedOperation.id]));
        if (suppliedOperation.status === 'prepared') {
          if (old || pending) throw agentError('ERR_AGENT_OPERATION_CONFLICT', 'An agent operation already exists or awaits reconciliation');
          stored.operationCount++;
        } else if (!old || !activeAgentOperation(old) || pending?.id !== suppliedOperation.id) {
          throw agentError('ERR_AGENT_OPERATION_CONFLICT', 'Agent operation is no longer active');
        }
        if (stored.operationCount > AGENT_LIMITS.operations) throw agentError('ERR_AGENT_HISTORY_FULL', 'Agent operation history is full; export before continuing');
        const updated = normalizeAgentOperation({ ...old, ...suppliedOperation, agentId: id, updatedAt: at });
        await request(ops.put(updated)); pending = activeAgentOperation(updated) ? updated : null;
      }
      for (const image of images) {
        const data = tx.objectStore('attachments');
        if (await request(data.get([id, image.id]))) throw new Error('Agent attachments are immutable');
        stored.attachmentCount++; stored.attachmentBytes += image.data.byteLength;
        if (stored.attachmentCount > AGENT_LIMITS.attachmentCount || stored.attachmentBytes > AGENT_LIMITS.attachmentTotalBytes) throw agentError('ERR_AGENT_HISTORY_FULL', 'Private image history is full');
        await request(data.add({ ...image, agentId: id }));
      }
      if (suppliedEvent) {
        for (const reference of suppliedEvent.attachmentIds ?? []) if (!await request(tx.objectStore('attachments').get([id, reference]))) throw new Error('Agent attachment is missing');
        const value = { ...suppliedEvent, agentId: id, sequence: stored.nextSequence++, at };
        const { bytes } = boundedAgentJson(value, AGENT_LIMITS.eventBytes, 'event');
        stored.eventCount++; stored.eventBytes += bytes;
        if (stored.eventCount > AGENT_LIMITS.events || stored.eventBytes > AGENT_LIMITS.historyBytes) throw agentError('ERR_AGENT_HISTORY_FULL', 'Agent history is full; export before continuing');
        await request(tx.objectStore('events').add(value));
      }
      stored.record = normalizeAgentRecord({ ...candidate, revision: previous.revision + 1,
        updatedAt: at, pendingOperation: pending });
      await request(heads.put(stored)); return stored.record;
    }, signal);
  }
  async withRun(id, callback, { signal } = {}) {
    this._newWork(); agentIdentifier(id); signal?.throwIfAborted();
    if (typeof callback !== 'function') throw new TypeError('Agent run callback is required');
    if (!this.lockManager?.request) throw agentError('ERR_AGENT_LOCK_UNAVAILABLE', 'This browser cannot safely coordinate agent execution between tabs');
    const activeSignal = signal ? AbortSignal.any([signal, this.lifetime.signal]) : this.lifetime.signal;
    const task = this.lockManager.request(`${this.lockName}:run:${id}`, { mode: 'exclusive', ifAvailable: true }, async (lock) => {
      if (!lock) throw agentError('ERR_AGENT_BUSY', 'This agent is running or being edited in another tab');
      activeSignal.throwIfAborted();
      const head = await this.get(id, { signal: activeSignal });
      if (!head) throw agentError('ERR_AGENT_NOT_FOUND', 'Agent no longer exists');
      if (head.authority.hostId !== this.hostId) throw new Error('This installation does not own the agent');
      // Abort asks the runner to stop; the lock remains until acknowledged cleanup.
      return callback({ signal: activeSignal, runId: crypto.randomUUID(), head });
    });
    this.runs.add(task);
    try { return await task; } finally { this.runs.delete(task); }
  }
  async delete(id, { expectedRevision, signal } = {}) {
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1) throw new TypeError('Expected agent revision is required');
    return this.withRun(id, () => this._transaction(collections, 'readwrite', async (tx) => {
      const stored = await request(tx.objectStore('heads').get(id));
      if (stored.record.revision !== expectedRevision) throw agentError('ERR_AGENT_CONFLICT', 'Agent changed before deletion');
      await Promise.all([request(tx.objectStore('heads').delete(id)),
        request(tx.objectStore('events').delete(this._range(id, undefined, true))),
        request(tx.objectStore('operations').delete(this._range(id))),
        request(tx.objectStore('attachments').delete(this._range(id)))]);
      return { deleted: true, agentId: id };
    }, signal), { signal });
  }
  export(id, { signal } = {}) {
    agentIdentifier(id);
    return this._transaction(collections, 'readonly', async (tx) => {
      const stored = await request(tx.objectStore('heads').get(id));
      if (!stored) throw agentError('ERR_AGENT_NOT_FOUND', 'Agent no longer exists');
      const [events, attachments] = await Promise.all([
        this._scan(tx, 'events', this._range(id, undefined, true), AGENT_LIMITS.events),
        this._scan(tx, 'attachments', this._range(id), AGENT_LIMITS.attachmentCount,
          ({ id, width, height, channels }) => ({ id, width, height, channels, omitted: true }))]);
      return boundedAgentJson({ schema: AGENT_EXPORT_SCHEMA, exportedAt: this._time(),
        agent: { ...stored.record, status: 'paused', pauseCause: 'owner', pendingOperation: null }, events, attachments,
        attachmentsOmitted: true }, AGENT_LIMITS.exportBytes, 'export').value;
    }, signal);
  }
  async restoreAsNew(input, { name, signal } = {}) {
    this._newWork(); const data = boundedAgentJson(input, AGENT_LIMITS.exportBytes, 'export').value;
    if (data.schema !== AGENT_EXPORT_SCHEMA || !Array.isArray(data.events) || data.events.length > AGENT_LIMITS.events) throw new TypeError('Unsupported agent export');
    const old = normalizeAgentRecord(data.agent);
    // Restore prose only. Authority, pending work and operation receipts never migrate.
    const fields = normalizeAgentInput({ name: name ?? old.identity.name, instructions: old.identity.instructions,
      goals: old.goals, summary: old.context.summary, inferenceMode: 'local-only' });
    const restoredAt = this._time(), id = crypto.randomUUID();
    const restored = normalizeAgentRecord({ schema: AGENT_SCHEMA, agentId: id, agentKind: 'general', ...fields,
      authority: { kind: 'local', hostId: this.hostId, epoch: 0 }, revision: 1, status: 'paused',
      createdAt: restoredAt, updatedAt: restoredAt, pendingOperation: null });
    let eventBytes = 0;
    const events = data.events.map((event, index) => {
      const { agentId, sequence, at, attachmentIds, ...textEvent } = normalizeAgentEvent(event);
      const value = { ...textEvent, agentId: id, sequence: index + 1, at: restoredAt,
        restoredFrom: old.agentId, ...(attachmentIds?.length ? { attachmentsOmitted: true } : {}) };
      eventBytes += boundedAgentJson(value, AGENT_LIMITS.eventBytes, 'event').bytes;
      return value;
    });
    if (eventBytes > AGENT_LIMITS.historyBytes) throw new RangeError('Restored agent history exceeds its byte budget');
    return this._transaction(['heads', 'events'], 'readwrite', async (tx) => {
      await request(tx.objectStore('heads').add({ id, record: restored, eventCount: events.length,
        eventBytes, nextSequence: events.length + 1, operationCount: 0, attachmentCount: 0, attachmentBytes: 0 }));
      for (const event of events) await request(tx.objectStore('events').add(event));
      return restored;
    }, signal);
  }
  getStatus() { return { persistent: true, available: Boolean(this.database), executionAvailable: Boolean(this.lockManager?.request), activeRuns: this.runs.size }; }
  async destroy() {
    if (this.destroying) return this.destroying;
    this.closing = true;
    this.destroying = (async () => {
      this.lifetime.abort(new DOMException('Agent store closed', 'AbortError'));
      await this.opening?.catch(() => {});
      await Promise.allSettled([...this.runs]); await Promise.allSettled([...this.transactions]);
      this.database?.close(); this.database = null; this.destroyed = true; this.onDestroy?.(this);
    })();
    return this.destroying;
  }
}
