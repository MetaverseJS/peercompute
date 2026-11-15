import { MODEL_EVIDENCE_SCHEMA, MODEL_EVIDENCE_LIMITS, normalizeModelEvidence, evidencePeerId } from './ModelEvidenceContracts.js';

/** Optional telemetry boundary. Its failures never reject an inference operation.
 * Supply numeric/structural facts, not the operation input or raw worker event. */
export class ModelEvidenceCollector {
  constructor({ store, reporterPeerId, compatibility, environment, now = Date.now, enqueue = true, sign } = {}) {
    if (!store?.append || !store?.pending || !store?.acknowledge || typeof now !== 'function') throw new TypeError('Invalid evidence collector configuration');
    Object.assign(this, { store, reporterPeerId, compatibility, environment, now, enqueue, sign });
    this.operations = new Set(); this.dropped = 0; this.recorded = 0; this.closed = false; this.lastFailure = null;
  }
  _peer() { return evidencePeerId(typeof this.reporterPeerId === 'function' ? this.reporterPeerId() : this.reporterPeerId); }
  status() { return { closed: this.closed, pending: this.operations.size, recorded: this.recorded, dropped: this.dropped, lastFailure: this.lastFailure }; }
  record(input) {
    if (this.closed || this.operations.size >= 64) { this.dropped++; return Promise.resolve(null); }
    let reporterPeerId, report;
    try {
      reporterPeerId = this._peer();
      report = normalizeModelEvidence({ ...input, schema: MODEL_EVIDENCE_SCHEMA,
        observedAt: input.observedAt ?? this.now(), compatibility: input.compatibility ?? this.compatibility,
        environment: input.environment ?? this.environment,
        ...(['load', 'generation', 'device-loss'].includes(input.stage) ? { executorPeerId: input.executorPeerId ?? reporterPeerId } : {}) });
    } catch { this.dropped++; this.lastFailure = 'record-unavailable'; return Promise.resolve(null); }
    const operation = Promise.resolve().then(async () => {
      const proof = this.sign ? await this.sign(report) : undefined;
      const saved = await this.store.append(report, { reporterPeerId, proofs: proof ? [proof] : [], provenance: 'local', enqueue: typeof this.enqueue === 'function' ? this.enqueue() : this.enqueue });
      this.recorded++; this.lastFailure = null; return saved;
    }).catch(() => { this.dropped++; this.lastFailure = 'record-unavailable'; return null; });
    this.operations.add(operation); operation.finally(() => this.operations.delete(operation)); return operation;
  }
  /** One bounded, replay-safe outbox batch. Caller owns retry/backoff policy. */
  async flush({ service, rootPeerId, signal } = {}) {
    if (this.closed) return { sent: 0, failed: true };
    if (this.flushing) return this.flushing;
    this.flushing = (async () => {
      try {
        const reporterPeerId = this._peer(); evidencePeerId(rootPeerId);
        const pending = await this.store.pending({ ...(this.sign ? {} : { reporterPeerId }), limit: MODEL_EVIDENCE_LIMITS.batch, signal });
        if (!pending.length) return { sent: 0, failed: false };
        const result = this.sign
          ? await service.submitSigned(rootPeerId, pending.map(({ report, proof }) => ({ report, proof })), { signal })
          : await service.submit(rootPeerId, pending.map(value => value.report), { signal });
        const expected = new Set(pending.map(value => value.id));
        if (!Array.isArray(result.ids) || result.ids.length !== expected.size || new Set(result.ids).size !== expected.size
            || result.ids.some(id => !expected.has(id))) throw new Error('Invalid evidence acknowledgment');
        let sent = 0;
        for (const author of new Set(pending.map(value => value.reporterPeerId))) {
          sent += await this.store.acknowledge(pending.filter(value => value.reporterPeerId === author).map(value => value.id),
            { rootPeerId, reporterPeerId: author, signal });
        }
        this.lastFailure = null; return { sent, failed: false };
      } catch { this.lastFailure = 'delivery-unavailable'; return { sent: 0, failed: true }; }
    })();
    try { return await this.flushing; } finally { this.flushing = null; }
  }
  async close() { this.closed = true; await Promise.allSettled([...this.operations]); await this.flushing; }
}
