import { verifyModelEvidence } from './ModelEvidenceProof.js';
import { lpStream } from '@libp2p/utils';
import { MODEL_EVIDENCE_LIMITS as LIMITS, normalizeModelEvidence, normalizeEvidenceQuery,
  evidenceInteger, evidencePeerId, evidenceBytes } from './ModelEvidenceContracts.js';

export const MODEL_EVIDENCE_PROTOCOL = '/peercompute/model-evidence/1.0.0';
export const MODEL_EVIDENCE_RPC_SCHEMA = 'peercompute.model-evidence-rpc.v1';
const encoder = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });
const failure = (code = 'ERR_MODEL_EVIDENCE_REJECTED') => Object.assign(new Error(code), { code });

export function evidenceEncryptedConnection(connection) {
  return connection?.status === 'open' && Boolean(connection.remotePeer)
    && (connection.encryption === '/noise' || connection.encryption === '/tls/1.0.0'
      || connection.encryption === 'native'
        && connection.remoteAddr?.getComponents?.().some(({ name }) => name === 'webrtc' || name === 'webrtc-direct'));
}
function channel(stream) {
  const rpc = lpStream(stream, { maxDataLength: LIMITS.frameBytes, maxBufferSize: LIMITS.frameBytes * 2 + 32 });
  return { async read(signal) { return JSON.parse(decoder.decode((await rpc.read({ signal })).subarray())); },
    async write(value, signal) {
      const bytes = encoder.encode(JSON.stringify(value));
      if (bytes.length > LIMITS.frameBytes) throw failure('ERR_MODEL_EVIDENCE_FRAME');
      await rpc.write(bytes, { signal });
    } };
}
function deadline(signals, milliseconds) {
  const controller = new AbortController(), listeners = [];
  const timer = setTimeout(() => controller.abort(failure('ERR_MODEL_EVIDENCE_TIMEOUT')), milliseconds); timer.unref?.();
  for (const signal of signals.filter(Boolean)) {
    const abort = () => controller.abort(signal.reason ?? failure('ERR_MODEL_EVIDENCE_CANCELLED'));
    signal.addEventListener('abort', abort, { once: true }); listeners.push([signal, abort]); if (signal.aborted) abort();
  }
  return { signal: controller.signal, dispose() { clearTimeout(timer); for (const [signal, abort] of listeners) signal.removeEventListener('abort', abort); } };
}
function wait(promise, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason ?? failure('ERR_MODEL_EVIDENCE_CANCELLED'));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    if (signal.aborted) abort();
  });
}
function normalizedReceipt(value) {
  const report = normalizeModelEvidence(value?.report), reporterPeerId = evidencePeerId(value.reporterPeerId);
  if (value.id !== report.id || report.executorPeerId && report.executorPeerId !== reporterPeerId
      || !['local', 'authenticated-peer', 'verified-signature'].includes(value.provenance)) throw failure();
  return { sequence: evidenceInteger(value.sequence, Number.MAX_SAFE_INTEGER, 1), id: report.id, report,
    reporterPeerId, receivedAt: evidenceInteger(value.receivedAt), provenance: value.provenance };
}

/** Model evidence has its own network-wide protocol, independent of demo rooms.
 * Reports are authenticated claims, not certifications or admission overrides.
 * No remote executable input, URL fetching or model execution is accepted here. */
export class ModelEvidenceService {
  constructor(manager, { store, serve = false, timeoutMs = 8000, now = Date.now } = {}) {
    if (!manager?.libp2p || serve && (!store?.appendBatch || !store?.query) || typeof now !== 'function') throw new TypeError('Invalid evidence service configuration');
    Object.assign(this, { manager, store, serve: serve === true, now, timeoutMs: evidenceInteger(timeoutMs, 30000, 100) });
    this.controller = new AbortController(); this.operations = new Set(); this.inbound = new Map(); this.rates = new Map();
    this.started = false; this.closed = false;
  }
  get peerId() { return this.manager.libp2p.peerId.toString(); }
  status() { return { started: this.started, closed: this.closed, serving: this.started && this.serve && !this.closed,
    activeOperations: this.operations.size, peerId: this.peerId }; }
  async start() {
    if (this.closed) throw failure('ERR_MODEL_EVIDENCE_STOPPED');
    if (this.started) return this;
    if (this.starting) return this.starting;
    this.starting = (async () => {
      if (this.serve) await this.manager.libp2p.handle(MODEL_EVIDENCE_PROTOCOL, (stream, connection) => {
        const peerId = connection?.remotePeer?.toString();
        if (this.closed || !evidenceEncryptedConnection(connection) || this.operations.size >= 16 || (this.inbound.get(peerId) ?? 0) >= 2) {
          stream.abort(failure()); return;
        }
        this.inbound.set(peerId, (this.inbound.get(peerId) ?? 0) + 1);
        const operation = this._handle(stream, connection);
        this.operations.add(operation);
        operation.catch(() => {}).finally(() => {
          this.operations.delete(operation); const count = (this.inbound.get(peerId) ?? 1) - 1;
          if (count) this.inbound.set(peerId, count); else this.inbound.delete(peerId);
        });
      }, { maxInboundStreams: 8, maxOutboundStreams: 8, runOnLimitedConnection: true });
      this.handlerRegistered = this.serve;
      this.started = true; return this;
    })();
    try { return await this.starting; } finally { this.starting = null; }
  }
  _envelope(type, recipient, requestId, fields = {}) {
    return { schema: MODEL_EVIDENCE_RPC_SCHEMA, type, sender: this.peerId, recipient, requestId, ...fields };
  }
  _check(value, peerId, requestId) {
    if (value?.schema !== MODEL_EVIDENCE_RPC_SCHEMA || value.sender !== peerId || value.recipient !== this.peerId
        || !/^[a-zA-Z0-9_-]{1,64}$/.test(value.requestId) || requestId !== undefined && value.requestId !== requestId) throw failure();
  }
  _rate(peerId, records = 0) {
    const now = evidenceInteger(this.now()); let entry = this.rates.get(peerId);
    if (!entry || now - entry.startedAt >= 60000 || now < entry.startedAt) entry = { startedAt: now, requests: 0, records: 0 };
    if (entry.requests >= 60 || entry.records + records > 60) throw failure('ERR_MODEL_EVIDENCE_RATE');
    if (!records) entry.requests++; entry.records += records;
    this.rates.delete(peerId); this.rates.set(peerId, entry);
    while (this.rates.size > 256) this.rates.delete(this.rates.keys().next().value);
  }
  async _close(stream, signal) {
    const closing = deadline([signal], 500);
    try { await wait(stream.close({ signal: closing.signal }), closing.signal); }
    catch { try { stream.abort(failure('ERR_MODEL_EVIDENCE_CLOSED')); } catch { /* Already closed. */ } }
    finally { closing.dispose(); }
  }
  async _handle(stream, connection) {
    const peerId = connection.remotePeer.toString(), operation = deadline([this.controller.signal], this.timeoutMs), io = channel(stream);
    const abort = () => { try { stream.abort(operation.signal.reason); } catch { /* Already closed. */ } };
    operation.signal.addEventListener('abort', abort, { once: true }); let input;
    try {
      this._rate(peerId); input = await wait(io.read(operation.signal), operation.signal); this._check(input, peerId);
      if (input.type === 'submit') {
        if (!Array.isArray(input.reports) || !input.reports.length || input.reports.length > LIMITS.batch) throw failure();
        this._rate(peerId, input.reports.length);
        const saved = await wait(this.store.appendBatch(input.reports,
          { reporterPeerId: peerId, provenance: 'authenticated-peer', signal: operation.signal }), operation.signal);
        await wait(io.write(this._envelope('accepted', peerId, input.requestId, { ids: [...new Set(saved.map(value => value.id))] }), operation.signal), operation.signal);
      } else if (input.type === 'submit-signed') {
        if (!Array.isArray(input.statements) || !input.statements.length || input.statements.length > LIMITS.batch) throw failure();
        this._rate(peerId, input.statements.length);
        // Validate the entire bounded batch before committing any claim. A new
        // uploader may forward old signed observations but cannot rewrite them.
        const verified = await Promise.all(input.statements.map(verifyModelEvidence)), ids = [];
        for (const { report, proof, reporterPeerId } of verified) {
          const saved = await wait(this.store.append(report, { reporterPeerId, proofs: [proof],
            provenance: 'verified-signature', signal: operation.signal }), operation.signal);
          ids.push(saved.id);
        }
        await wait(io.write(this._envelope('accepted', peerId, input.requestId, { ids: [...new Set(ids)] }), operation.signal), operation.signal);
      } else if (input.type === 'query') {
        const query = normalizeEvidenceQuery(input.query), records = await wait(this.store.query(query, { signal: operation.signal }), operation.signal);
        const response = this._envelope('results', peerId, input.requestId, { records: [] });
        for (const record of records) {
          response.records.push(record);
          if (evidenceBytes(response) > LIMITS.frameBytes) { response.records.pop(); break; }
        }
        await wait(io.write(response, operation.signal), operation.signal);
      } else throw failure();
      await this._close(stream, operation.signal);
    } catch {
      if (input?.requestId && !operation.signal.aborted) {
        // Do not expose raw storage/runtime errors or a malicious request field.
        try {
          this._check(input, peerId);
          await wait(io.write(this._envelope('error', peerId, input.requestId, { code: 'ERR_MODEL_EVIDENCE_REJECTED' }), operation.signal), operation.signal);
          await this._close(stream, operation.signal);
        } catch { abort(); }
      } else abort();
    } finally { operation.signal.removeEventListener('abort', abort); operation.dispose(); }
  }
  async _request(peerId, type, fields, signal) {
    evidencePeerId(peerId);
    if (!this.started || this.closed) throw failure('ERR_MODEL_EVIDENCE_STOPPED');
    if (this.operations.size >= 16) throw failure('ERR_MODEL_EVIDENCE_BUSY');
    const operation = deadline([this.controller.signal, signal], this.timeoutMs); let stream, release;
    const abort = () => { try { stream?.abort(operation.signal.reason); } catch { /* Already closed. */ } };
    operation.signal.addEventListener('abort', abort, { once: true });
    const promise = (async () => {
      try {
        operation.signal.throwIfAborted();
        const connection = this.manager.libp2p.getConnections().find(value => value.remotePeer.toString() === peerId && evidenceEncryptedConnection(value));
        if (!connection) throw failure('ERR_MODEL_EVIDENCE_UNREACHABLE');
        const opening = Promise.resolve(connection.newStream(MODEL_EVIDENCE_PROTOCOL, { signal: operation.signal, runOnLimitedConnection: true }));
        opening.then(value => { if (operation.signal.aborted) value.abort(operation.signal.reason); }, () => {}).catch(() => {});
        stream = await wait(opening, operation.signal);
        release = this.manager.retainPeerInferenceConnection?.(connection, { timeoutMs: this.timeoutMs + 1000 });
        const requestId = globalThis.crypto.randomUUID(), io = channel(stream);
        await wait(io.write(this._envelope(type, peerId, requestId, fields), operation.signal), operation.signal);
        const response = await wait(io.read(operation.signal), operation.signal); this._check(response, peerId, requestId);
        if (response.type === 'error') throw failure();
        await this._close(stream, operation.signal); operation.signal.throwIfAborted(); return response;
      } catch (error) { try { stream?.abort(error); } catch { /* Already closed. */ } throw error; }
      finally { release?.(); operation.signal.removeEventListener('abort', abort); operation.dispose(); }
    })();
    this.operations.add(promise);
    try { return await promise; } finally { this.operations.delete(promise); }
  }
  async submit(peerId, reports, { signal } = {}) {
    if (!Array.isArray(reports) || !reports.length || reports.length > LIMITS.batch) throw new TypeError('Invalid evidence batch');
    const normalized = reports.map(normalizeModelEvidence), ids = new Set(normalized.map(value => value.id));
    const response = await this._request(peerId, 'submit', { reports: normalized }, signal);
    if (response.type !== 'accepted' || !Array.isArray(response.ids) || response.ids.length !== ids.size
        || new Set(response.ids).size !== ids.size || response.ids.some(id => !ids.has(id))) throw failure();
    return { ids: [...response.ids] };
  }
  async submitSigned(peerId, statements, { signal } = {}) {
    if (!Array.isArray(statements) || !statements.length || statements.length > LIMITS.batch) throw new TypeError('Invalid evidence batch');
    const verified = await Promise.all(statements.map(verifyModelEvidence));
    const ids = new Set(verified.map(value => value.report.id));
    const response = await this._request(peerId, 'submit-signed', {
      statements: verified.map(({ report, proof }) => ({ report, proof })) }, signal);
    if (response.type !== 'accepted' || !Array.isArray(response.ids) || response.ids.length !== ids.size
        || new Set(response.ids).size !== ids.size || response.ids.some(id => !ids.has(id))) throw failure();
    return { ids: response.ids };
  }
  async query(peerId, input = {}, { signal } = {}) {
    const query = normalizeEvidenceQuery(input), response = await this._request(peerId, 'query', { query }, signal);
    if (response.type !== 'results' || !Array.isArray(response.records) || response.records.length > query.limit) throw failure();
    const records = response.records.map(normalizedReceipt); let previous = query.beforeSequence ?? Infinity;
    for (const row of records) {
      if (row.sequence >= previous
          || ['repository', 'revision', 'manifestCid', 'packageFingerprint', 'selectionDigest'].some(key => query[key] !== undefined && row.report.source[key] !== query[key])
          || ['stage', 'compatibilityDigest', 'environmentDigest'].some(key => query[key] !== undefined && row.report[key] !== query[key])
          || query.reporterPeerId !== undefined && row.reporterPeerId !== query.reporterPeerId) throw failure();
      previous = row.sequence;
    }
    return records;
  }
  stop() {
    if (this.stopping) return this.stopping;
    this.closed = true; this.controller.abort(failure('ERR_MODEL_EVIDENCE_STOPPED'));
    this.stopping = (async () => {
      await this.starting?.catch(() => {});
      try {
        if (this.handlerRegistered) { await this.manager.libp2p.unhandle(MODEL_EVIDENCE_PROTOCOL); this.handlerRegistered = false; }
      }
      finally { await Promise.allSettled([...this.operations]); this.started = false; this.inbound.clear(); this.rates.clear(); }
    })().catch(error => { this.stopping = null; throw error; });
    return this.stopping;
  }
}
