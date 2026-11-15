import { multiaddr } from '@multiformats/multiaddr';
import { ModelEvidenceCollector } from './ModelEvidenceCollector.js';
import { ModelEvidenceService, MODEL_EVIDENCE_PROTOCOL } from './ModelEvidenceService.js';
import { signModelEvidence } from './ModelEvidenceProof.js';
import { evidenceApplicability, evidencePeerId } from './ModelEvidenceContracts.js';

export const MODEL_EVIDENCE_DIRECTORY_SCHEMA = 'peercompute.model-evidence-directory.v1';
export function normalizeEvidenceDirectory(input, now = Date.now()) {
  if (input?.schema !== MODEL_EVIDENCE_DIRECTORY_SCHEMA || input.protocol !== MODEL_EVIDENCE_PROTOCOL
      || !Number.isSafeInteger(input.expiresAt) || input.expiresAt <= now || input.expiresAt > now + 86400000
      || !Array.isArray(input.addresses) || !input.addresses.length || input.addresses.length > 8) throw new TypeError('Invalid model evidence directory');
  const peerId = evidencePeerId(input.peerId);
  const addresses = input.addresses.map(value => {
    if (typeof value !== 'string' || value.length > 2048 || !value.endsWith(`/p2p/${peerId}`)
        || !/(?:\/wss|\/tls\/ws)(?:\/|$)/.test(value)) throw new TypeError('Evidence root needs authenticated secure WebSocket addresses');
    return multiaddr(value).toString();
  });
  return { peerId, addresses, expiresAt: input.expiresAt };
}
async function readDirectory(url, fetchImpl, signal) {
  if (new URL(url).protocol !== 'https:') throw new TypeError('Evidence discovery requires HTTPS');
  const response = await fetchImpl(url, { signal, credentials: 'omit', cache: 'no-store', redirect: 'error' });
  if (!response.ok || !response.body) throw new Error('Model evidence directory unavailable');
  const reader = response.body.getReader(), chunks = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.length; if (size > 32768) throw new Error('Evidence directory exceeds budget'); chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return normalizeEvidenceDirectory(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
}

/** App-independent local journal and opt-in uploader. A root outage never gates inference. */
export class ModelEvidenceClient {
  constructor({ store, getManager, environment, compatibility, directoryUrl, storage,
    preferenceKey = 'peercompute:model-evidence:share:v1', fetchImpl = globalThis.fetch, retryMs = 30000 } = {}) {
    if (!Number.isInteger(retryMs) || retryMs < 1000 || retryMs > 300000) throw new TypeError('Invalid evidence retry interval');
    this.controller = new AbortController();
    Object.assign(this, { store, getManager, environment, compatibility, directoryUrl, storage, preferenceKey, fetchImpl });
    this.shared = false; this.closed = false; this.pending = new Set(); this.lastDelivery = null;
    try { this.shared = storage?.getItem(preferenceKey) === 'true'; } catch { /* Local-only default. */ }
    this.collector = new ModelEvidenceCollector({ store, reporterPeerId: () => getManager()?.libp2p?.peerId?.toString(),
      enqueue: () => this.shared, sign: report => signModelEvidence(report, getManager()?._applicationPrivateKey) });
    this.timer = setInterval(() => { if (this.shared) void this.flush(); }, retryMs); this.timer.unref?.();
  }
  status() { return { sharing: this.shared, ...this.collector.status(), lastDelivery: this.lastDelivery }; }
  setSharing(value) {
    this.shared = value === true;
    try { this.storage?.setItem(this.preferenceKey, String(this.shared)); } catch { /* Session choice remains usable. */ }
    if (!this.shared) this.deliveryController?.abort(); else void this.flush();
    return this.shared;
  }
  compatibilityFor(facts = {}) {
    return { ...this.compatibility, ...(facts.runtime ? { runtime: facts.runtime, runtimeVersion: facts.runtimeVersion ?? 'managed-v1' } : {}) };
  }
  record(facts) {
    if (this.closed) return Promise.resolve(null);
    // facts are already structural; snapshot before caller/session reuse.
    const snapshot = structuredClone(facts);
    const operation = Promise.resolve(this.environment()).then(environment => this.collector.record({ ...snapshot,
      compatibility: this.compatibilityFor(snapshot), environment: { ...environment,
        ...(snapshot.adapter ? { gpu: { ...environment.gpu, vendor: snapshot.adapter.vendor || 'unknown',
          architecture: snapshot.adapter.architecture || 'unknown' } } : {}) } })).catch(() => null);
    this.pending.add(operation); operation.finally(() => this.pending.delete(operation)); return operation;
  }
  async connect(signal) {
    if (this.closed) throw new Error('Model evidence client is closed');
    signal = AbortSignal.any([this.controller.signal, ...(signal ? [signal] : []), AbortSignal.timeout(20000)]);
    signal.throwIfAborted();
    const manager = this.getManager();
    if (!manager?.libp2p) throw new Error('Peer network is not ready');
    if (!this.directory || this.directory.expiresAt <= Date.now() + 10000) {
      this.directory = await readDirectory(this.directoryUrl, this.fetchImpl, signal);
    }
    signal.throwIfAborted();
    if (this.service?.manager !== manager) {
      const previous = this.service; this.service = new ModelEvidenceService(manager); await previous?.stop();
    }
    signal.throwIfAborted(); await this.service.start();
    if (!manager.libp2p.getConnections().some(connection => connection.status === 'open' && connection.remotePeer.toString() === this.directory.peerId)) {
      await manager.libp2p.dial(this.directory.addresses.map(value => multiaddr(value)), { signal });
    }
    signal.throwIfAborted();
    return { service: this.service, rootPeerId: this.directory.peerId };
  }
  async flush() {
    if (this.closed || !this.shared) return { sent: 0 };
    if (this.flushing) return this.flushing;
    const controller = new AbortController(); this.deliveryController = controller;
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]);
    this.flushing = (async () => {
      try {
        if (!(await this.store.pending({ limit: 1, signal })).length) return { sent: 0 };
        const connection = await this.connect(signal);
        if (!this.shared) return { sent: 0 };
        const result = await this.collector.flush({ ...connection, signal });
        this.lastDelivery = result.failed ? 'unavailable' : 'delivered'; return result;
      } catch { this.lastDelivery = 'unavailable'; return { sent: 0, failed: true }; }
    })();
    try { return await this.flushing; } finally { this.flushing = null; this.deliveryController = null; }
  }
  async query(source, { signal, current = {} } = {}) {
    const filter = { ...source, limit: 20 };
    if (filter.selectionDigest && !filter.manifestCid) delete filter.packageFingerprint;
    const local = await this.store.query(filter, { signal });
    let remote = [], network = 'unavailable';
    try {
      const connection = await this.connect(signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000));
      remote = await connection.service.query(connection.rootPeerId, filter, { signal }); network = 'connected';
    } catch { signal?.throwIfAborted(); }
    const environment = await this.environment(), byId = new Map();
    for (const row of [...remote, ...local]) byId.set(`${row.reporterPeerId}:${row.id}`, { ...row,
      applicability: evidenceApplicability(row.report, { compatibility: this.compatibilityFor(current), environment }) });
    return { network, records: [...byId.values()].sort((a, b) => b.report.observedAt - a.report.observedAt).slice(0, 20) };
  }
  async close() {
    this.closed = true; this.controller.abort(new DOMException('Evidence client closed', 'AbortError')); clearInterval(this.timer); this.deliveryController?.abort();
    await this.service?.stop(); await this.flushing; await Promise.allSettled([...this.pending]); await this.collector.close();
  }
}
