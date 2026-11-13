import { RESIDENT_DIAGNOSTICS_LIMITS as LIMITS, normalizeResidentDiagnostic, residentDiagnosticScope,
  residentDiagnosticScopeKey, residentDiagnosticSignature, residentDiagnosticBytes,
  residentDiagnosticMessage } from './ResidentDiagnosticsContracts.js';

const copy = value => value === undefined ? undefined : structuredClone(value);
const request = value => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
function bounded(value, maximum, label, minimum = 1) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new TypeError(`Invalid resident diagnostic ${label}`);
  return value;
}

/** Owner-private, expendable telemetry. Separate from conversation history and
 * transferable memory: retaining diagnostics cannot fill an agent's journal,
 * change inference input, or pause model work. The caller authorizes access. */
export class ResidentDiagnosticsStore {
  constructor({ name = 'default', indexedDBImpl = globalThis.indexedDB, now = Date.now, onDestroy,
    maximumPerResident = LIMITS.perResident, maximumEntries = LIMITS.entries, maximumBytes = LIMITS.bytes,
    flushDelayMs = 75 } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/.test(name) || typeof now !== 'function') throw new TypeError('Invalid resident diagnostics configuration');
    Object.assign(this, { name, indexedDB: indexedDBImpl, now, onDestroy,
      maximumPerResident: bounded(maximumPerResident, LIMITS.perResident, 'resident limit'),
      maximumEntries: bounded(maximumEntries, LIMITS.entries, 'entry limit'),
      maximumBytes: bounded(maximumBytes, LIMITS.bytes, 'byte limit'),
      flushDelayMs: bounded(flushDelayMs, 1000, 'flush delay', 0) });
    this.databaseName = `peercompute-resident-diagnostics-v1-${name}`;
    this.persistent = true; this.pending = []; this.listeners = new Set(); this.transactions = new Set();
    this.chain = Promise.resolve(); this.dropped = 0; this.evicted = 0; this.lastError = null;
  }
  _time() {
    const when = this.now();
    if (!Number.isSafeInteger(when) || when < 0) throw new TypeError('Invalid resident diagnostic clock');
    return when;
  }
  _emit(event) {
    for (const listener of this.listeners) {
      try { Promise.resolve(listener(copy(event))).catch(() => {}); } catch { /* Observers cannot affect agents. */ }
    }
  }
  _error(error, operation) {
    this.lastError = { when: Date.now(), operation, message: residentDiagnosticMessage(error?.message ?? error),
      code: String(typeof error?.code === 'string' ? error.code : error?.name ?? 'Error').slice(0, 96) };
    this._emit({ type: 'status', status: this.status() });
  }
  status() {
    return copy({ persistent: this.persistent, open: Boolean(this.database), closed: Boolean(this.closed || this.closing),
      pending: this.pending.length, dropped: this.dropped, evicted: this.evicted, lastError: this.lastError,
      maximumPerResident: this.maximumPerResident, maximumEntries: this.maximumEntries, maximumBytes: this.maximumBytes });
  }
  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('Resident diagnostic listener must be a function');
    this.listeners.add(listener); return () => this.listeners.delete(listener);
  }
  async open() {
    if (this.closed) throw new Error('Resident diagnostics store is closed');
    if (this.database) return this;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open) throw new Error('Resident diagnostics require IndexedDB');
    this.opening = new Promise((resolve, reject) => {
      const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
      opening.onupgradeneeded = () => {
        const rows = opening.result.createObjectStore('rows', { keyPath: 'sequence', autoIncrement: true });
        rows.createIndex('scope', 'scope');
      };
      opening.onerror = () => { failed = true; reject(opening.error); };
      opening.onblocked = () => { failed = true; reject(new Error('Resident diagnostics database upgrade is blocked')); };
      opening.onsuccess = () => {
        if (failed || this.closed) { opening.result.close(); if (!failed) reject(new Error('Resident diagnostics store is closed')); return; }
        this.database = opening.result;
        this.database.onversionchange = () => { this.database?.close(); this.database = null; this.closed = true; };
        resolve(this);
      };
    }).catch(error => { this._error(error, 'open'); throw error; }).finally(() => { this.opening = null; });
    return this.opening;
  }
  async _transaction(mode, action, signal) {
    signal?.throwIfAborted();
    if (!this.database || this.closed) throw new Error('Resident diagnostics store is not open');
    const tx = this.database.transaction('rows', mode);
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error ?? signal?.reason ?? new Error('Resident diagnostic transaction aborted'));
      tx.onerror = () => {};
    });
    completion.catch(() => {}); this.transactions.add(completion);
    const abort = () => { try { tx.abort(); } catch { /* A completed transaction stays complete. */ } };
    signal?.addEventListener('abort', abort, { once: true });
    try { const result = await action(tx.objectStore('rows')); await completion; return copy(result); }
    catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); signal?.removeEventListener('abort', abort); }
  }
  _serial(action) {
    const task = this.chain.then(action); this.chain = task.catch(() => {}); return task;
  }
  /** Fail-soft even for malformed events or a full/unavailable database. Call
   * status() to surface diagnostic failures separately from resident failures. */
  append(input, { signal } = {}) {
    try {
      if (signal?.aborted) return Promise.resolve(null);
      if (this.closed || this.closing) throw new Error('Resident diagnostics store is closed');
      const row = normalizeResidentDiagnostic(input, { when: this._time() }), signature = residentDiagnosticSignature(row);
      const existing = this.pending.find(item => item.signature === signature && item.signal === signal
        && row.when >= item.row.lastWhen && row.when - item.row.lastWhen <= LIMITS.dedupeMs);
      if (existing) {
        existing.row.repeatCount = Math.min(Number.MAX_SAFE_INTEGER, existing.row.repeatCount + 1);
        existing.row.lastWhen = row.when; return existing.promise.then(copy);
      }
      if (this.pending.length >= LIMITS.pending) {
        this.dropped += 1; this._emit({ type: 'status', status: this.status() }); return Promise.resolve(null);
      }
      let resolve;
      const promise = new Promise(done => { resolve = done; });
      this.pending.push({ row, signature, signal, promise, resolve });
      if (!this.timer && !this.flushing) this.timer = setTimeout(() => { this.timer = null; void this.flush(); }, this.flushDelayMs);
      return promise.then(copy);
    } catch (error) { this.dropped += 1; this._error(error, 'append'); return Promise.resolve(null); }
  }
  async _write(batch) {
    await this.open();
    const result = await this._transaction('readwrite', async store => {
      const rows = await request(store.getAll()), results = [];
      for (const item of batch) {
        if (item.signal?.aborted) { results.push(null); continue; }
        const { row, signature } = item;
        const previous = rows.filter(value => value.signature === signature && row.when >= value.record.lastWhen
          && row.when - value.record.lastWhen <= LIMITS.dedupeMs).sort((a, b) => b.sequence - a.sequence)[0];
        const record = previous ? { ...previous.record, lastWhen: row.lastWhen,
          repeatCount: Math.min(Number.MAX_SAFE_INTEGER, previous.record.repeatCount + row.repeatCount) } : row;
        const value = { ...(previous ? { sequence: previous.sequence } : {}), scope: residentDiagnosticScopeKey(record),
          signature, record, byteLength: residentDiagnosticBytes(record) };
        if (value.byteLength > this.maximumBytes) throw new RangeError('Resident diagnostic exceeds the configured storage budget');
        if (item.signal?.aborted) { results.push(null); continue; }
        value.sequence = await request(store.put(value));
        if (previous) rows.splice(rows.indexOf(previous), 1);
        rows.push(value); results.push(record);
      }
      const sorted = rows.sort((a, b) => b.record.lastWhen - a.record.lastWhen || b.sequence - a.sequence);
      const counts = new Map(); let bytes = 0, kept = 0, evicted = 0;
      for (const row of sorted) {
        const count = counts.get(row.record.agentId) ?? 0;
        if (count >= this.maximumPerResident || kept >= this.maximumEntries || bytes + row.byteLength > this.maximumBytes) {
          await request(store.delete(row.sequence)); evicted += 1;
        } else { counts.set(row.record.agentId, count + 1); bytes += row.byteLength; kept += 1; }
      }
      return { results, evicted };
    });
    this.evicted += result.evicted;
    for (let index = 0; index < batch.length; index += 1) {
      batch[index].resolve(result.results[index]);
      if (result.results[index]) this._emit({ type: 'changed', ...residentDiagnosticScope(batch[index].row) });
    }
  }
  flush() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.flushing) return this.flushing;
    if (!this.pending.length) return Promise.resolve();
    this.flushing = (async () => {
      while (this.pending.length) {
        const batch = this.pending.splice(0);
        try { await this._serial(() => this._write(batch)); }
        catch (error) {
          this.dropped += batch.reduce((sum, item) => sum + item.row.repeatCount, 0);
          this._error(error, 'write'); for (const item of batch) item.resolve(null);
        }
      }
    })().finally(() => {
      this.flushing = null;
      // An observer may enqueue after the last loop check, while this promise
      // is settling. Such a row still needs a write timer.
      if (this.pending.length && !this.timer) this.timer = setTimeout(() => { this.timer = null; void this.flush(); }, this.flushDelayMs);
    });
    return this.flushing;
  }
  async list(scope, { limit = 100, before, signal } = {}) {
    const key = residentDiagnosticScopeKey(scope); bounded(limit, LIMITS.perResident, 'list limit');
    if (before !== undefined) bounded(before, Number.MAX_SAFE_INTEGER, 'cursor', 0);
    signal?.throwIfAborted(); await this.flush();
    try {
      return await this._serial(async () => {
        await this.open();
        return this._transaction('readonly', async store => (await request(store.index('scope').getAll(key)))
          .filter(row => before === undefined || row.record.lastWhen < before)
          .sort((a, b) => b.record.lastWhen - a.record.lastWhen || b.sequence - a.sequence)
          .slice(0, limit).map(row => row.record), signal);
      });
    } catch (error) { if (!signal?.aborted) this._error(error, 'list'); throw error; }
  }
  async clear(scope, { signal } = {}) {
    const key = residentDiagnosticScopeKey(scope); signal?.throwIfAborted(); await this.flush();
    try {
      const count = await this._serial(async () => {
        await this.open();
        return this._transaction('readwrite', async store => {
          const rows = await request(store.index('scope').getAll(key));
          for (const row of rows) await request(store.delete(row.sequence)); return rows.length;
        }, signal);
      });
      this._emit({ type: 'changed', ...residentDiagnosticScope(scope) }); return count;
    } catch (error) { if (!signal?.aborted) this._error(error, 'clear'); throw error; }
  }
  close() { return this.destroy(); }
  dispose() { return this.destroy(); }
  destroy() {
    if (this.closing) return this.closing;
    this.closing = (async () => {
      await this.flush(); await this.chain; await this.opening?.catch(() => {});
      await Promise.allSettled([...this.transactions]); this.closed = true;
      this.database?.close(); this.database = null; this.listeners.clear(); this.onDestroy?.(this);
    })();
    return this.closing;
  }
}
