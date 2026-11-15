import { MODEL_EVIDENCE_LIMITS as LIMITS, normalizeModelEvidence, normalizeEvidenceQuery,
  evidencePeerId, evidenceInteger, evidenceBytes } from './ModelEvidenceContracts.js';

const copy = value => structuredClone(value);
const request = value => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
const receipt = row => copy({ sequence: row.sequence, id: row.report.id, report: row.report,
  reporterPeerId: row.reporterPeerId, receivedAt: row.receivedAt, provenance: row.provenance });

/** Durable immutable reports. Delivery receipts are separate mutable bookkeeping.
 * This store does not replicate its database through room state. */
export class ModelEvidenceStore {
  constructor({ name = 'default', indexedDBImpl = globalThis.indexedDB, now = Date.now,
    maximumEntries = 10000, maximumBytes = 32 * 1024 ** 2, maximumPerReporter = 2000, onDestroy } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/.test(name) || typeof now !== 'function') throw new TypeError('Invalid model evidence store configuration');
    Object.assign(this, { name, indexedDB: indexedDBImpl, now, onDestroy,
      maximumEntries: evidenceInteger(maximumEntries, LIMITS.maximumEntries, 1),
      maximumBytes: evidenceInteger(maximumBytes, LIMITS.maximumBytes, 1),
      maximumPerReporter: evidenceInteger(maximumPerReporter, LIMITS.maximumEntries, 1) });
    this.databaseName = `peercompute-model-evidence-v1-${name}`;
    this.chain = Promise.resolve(); this.transactions = new Set(); this.closed = false; this.evicted = 0;
  }
  status() { return { persistent: true, open: Boolean(this.database), closed: Boolean(this.closed || this.closing), evicted: this.evicted }; }
  async open() {
    if (this.closed) throw new Error('Model evidence store is closed');
    if (this.database) return this;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open) throw new Error('Model evidence requires IndexedDB');
    this.opening = new Promise((resolve, reject) => {
      const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
      opening.onupgradeneeded = () => {
        const rows = opening.result.createObjectStore('reports', { keyPath: 'sequence', autoIncrement: true });
        rows.createIndex('identity', 'identity', { unique: true });
        for (const key of ['reporterPeerId', 'repository', 'manifestCid', 'packageFingerprint']) rows.createIndex(key, key);
      };
      opening.onerror = () => { failed = true; reject(opening.error); };
      opening.onblocked = () => { failed = true; reject(new Error('Model evidence database upgrade is blocked')); };
      opening.onsuccess = () => {
        if (failed || this.closed) { opening.result.close(); if (!failed) reject(new Error('Model evidence store is closed')); return; }
        this.database = opening.result;
        this.database.onversionchange = () => { this.database?.close(); this.database = null; this.closed = true; };
        resolve(this);
      };
    }).finally(() => { this.opening = null; });
    return this.opening;
  }
  _serial(action) {
    if (this.closed || this.closing) return Promise.reject(new Error('Model evidence store is closed'));
    const operation = this.chain.then(action); this.chain = operation.catch(() => {}); return operation;
  }
  async _transaction(mode, action, signal) {
    signal?.throwIfAborted();
    if (!this.database) await this.open();
    if (this.closed) throw new Error('Model evidence store is closed');
    const tx = this.database.transaction('reports', mode, { durability: 'strict' });
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error ?? signal?.reason ?? new Error('Model evidence transaction aborted'));
      tx.onerror = () => {};
    });
    completion.catch(() => {}); this.transactions.add(completion);
    const abort = () => { try { tx.abort(); } catch { /* A committed write stays committed. */ } };
    signal?.addEventListener('abort', abort, { once: true });
    try { const result = await action(tx.objectStore('reports')); await completion; return result; }
    catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); signal?.removeEventListener('abort', abort); }
  }
  async append(report, options) { return (await this.appendBatch([report], options))[0]; }
  appendBatch(reports, { reporterPeerId, provenance = 'local', enqueue = false, signal } = {}) {
    try {
      evidencePeerId(reporterPeerId);
      if (!['local', 'authenticated-peer'].includes(provenance) || enqueue && provenance !== 'local') throw new TypeError('Invalid evidence provenance');
      if (!Array.isArray(reports) || !reports.length || reports.length > LIMITS.batch) throw new TypeError('Invalid evidence batch');
      const receivedAt = evidenceInteger(this.now());
      const prepared = reports.map(input => {
        const report = normalizeModelEvidence(input);
        if (report.executorPeerId !== undefined && report.executorPeerId !== reporterPeerId) throw new TypeError('Evidence executor must be its authenticated reporter');
        const row = { identity: `${reporterPeerId}:${report.id}`, report, reporterPeerId, receivedAt, provenance, pending: enqueue === true,
          repository: report.source.repository, manifestCid: report.source.manifestCid, packageFingerprint: report.source.packageFingerprint };
        // Reserve bounded space for sequence and eventual delivery bookkeeping.
        row.byteLength = evidenceBytes(row) + 512;
        if (row.byteLength > this.maximumBytes) throw new RangeError('Evidence record exceeds storage capacity');
        return row;
      });
      return this._serial(() => this._transaction('readwrite', async store => {
        const saved = [], rows = await request(store.getAll());
        for (const row of prepared) {
          const previous = rows.find(value => value.identity === row.identity);
          if (previous) { saved.push(receipt(previous)); continue; }
          row.sequence = await request(store.add(row)); rows.push(row); saved.push(receipt(row));
        }
        const totals = new Map(); let count = 0, bytes = 0, evicted = 0;
        for (const row of rows.sort((a, b) => b.sequence - a.sequence)) {
          const perReporter = totals.get(row.reporterPeerId) ?? 0;
          if (count >= this.maximumEntries || perReporter >= this.maximumPerReporter || bytes + row.byteLength > this.maximumBytes) {
            await request(store.delete(row.sequence)); evicted++;
          } else { totals.set(row.reporterPeerId, perReporter + 1); count++; bytes += row.byteLength; }
        }
        // Never acknowledge a batch that exceeded its own retention envelope.
        for (const value of saved) if (!await request(store.get(value.sequence))) throw new RangeError('Evidence batch exceeds storage retention capacity');
        return { saved, evicted };
      }, signal)).then(({ saved, evicted }) => { this.evicted += evicted; return saved; });
    } catch (error) { return Promise.reject(error); }
  }
  query(input = {}, { signal } = {}) {
    let query; try { query = normalizeEvidenceQuery(input); } catch (error) { return Promise.reject(error); }
    return this._serial(() => this._transaction('readonly', async store => {
      const indexed = ['manifestCid', 'packageFingerprint', 'repository', 'reporterPeerId'].find(key => query[key] !== undefined);
      const rows = await request(indexed ? store.index(indexed).getAll(query[indexed]) : store.getAll());
      return rows.filter(row => {
        const report = row.report;
        return (query.beforeSequence === undefined || row.sequence < query.beforeSequence)
          && ['repository', 'revision', 'manifestCid', 'packageFingerprint'].every(key => query[key] === undefined || report.source[key] === query[key])
          && ['stage', 'compatibilityDigest', 'environmentDigest'].every(key => query[key] === undefined || report[key] === query[key])
          && (query.reporterPeerId === undefined || row.reporterPeerId === query.reporterPeerId);
      }).sort((a, b) => b.sequence - a.sequence).slice(0, query.limit).map(receipt);
    }, signal));
  }
  pending({ limit = LIMITS.batch, reporterPeerId, signal } = {}) {
    try { evidenceInteger(limit, LIMITS.batch, 1); if (reporterPeerId !== undefined) evidencePeerId(reporterPeerId); }
    catch (error) { return Promise.reject(error); }
    return this._serial(() => this._transaction('readonly', async store => (await request(store.getAll()))
      .filter(row => row.pending && row.provenance === 'local' && (reporterPeerId === undefined || row.reporterPeerId === reporterPeerId))
      .sort((a, b) => a.sequence - b.sequence).slice(0, limit).map(receipt), signal));
  }
  acknowledge(ids, { rootPeerId, reporterPeerId, signal } = {}) {
    try {
      evidencePeerId(rootPeerId); evidencePeerId(reporterPeerId);
      if (!Array.isArray(ids) || ids.length > LIMITS.batch || ids.some(id => !/^sha256-[a-f0-9]{64}$/.test(id))) throw new TypeError('Invalid evidence acknowledgment');
    } catch (error) { return Promise.reject(error); }
    return this._serial(() => this._transaction('readwrite', async store => {
      let acknowledged = 0;
      for (const id of new Set(ids)) {
        const row = await request(store.index('identity').get(`${reporterPeerId}:${id}`));
        if (!row || !row.pending || row.provenance !== 'local') continue;
        row.pending = false; row.delivery = { rootPeerId, receivedAt: evidenceInteger(this.now()) };
        await request(store.put(row)); acknowledged++;
      }
      return acknowledged;
    }, signal));
  }
  close() { return this.destroy(); }
  destroy() {
    if (this.closing) return this.closing;
    this.closing = (async () => {
      await this.chain; await this.opening?.catch(() => {}); await Promise.allSettled([...this.transactions]);
      this.closed = true; this.database?.close(); this.database = null; this.onDestroy?.(this);
    })();
    return this.closing;
  }
}
