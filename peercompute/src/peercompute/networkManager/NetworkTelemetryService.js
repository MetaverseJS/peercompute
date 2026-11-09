/** Cross-demo operational telemetry. Reports are signed peer claims, never game state. */
export const NETWORK_TELEMETRY_TOPIC = 'peercompute-netviz-sessions';
export const NETWORK_TELEMETRY_TYPE = 'netviz-telemetry-v1';
export const NETWORK_TELEMETRY_SCHEMA = 'peercompute.network-telemetry.v1';
export const NETWORK_TELEMETRY_LIMITS = Object.freeze({
  maximumBytes: 24 * 1024, maximumPeers: 32, maximumModels: 16,
  maximumReports: 256, intervalMs: 5000, minimumReceiveIntervalMs: 500,
  staleMs: 15000, expiryMs: 60000, orderExpiryMs: 300000, providerTimeoutMs: 1000
});

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const text = (value, maximum = 128) => typeof value === 'string'
  ? value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, maximum) : '';
const count = value => Number.isFinite(value) && value >= 0 ? Math.min(Number.MAX_SAFE_INTEGER, value) : 0;
const choice = (value, allowed, fallback = null) => allowed.includes(value) ? value : fallback;
const ROLES = ['world', 'models', 'compute', 'observer'];
const VIA = ['webrtc', 'relay-webrtc', 'relay', 'direct', 'direct-websocket', 'websocket', 'presence', 'unknown'];
const countFields = (input, fields) => Object.fromEntries(fields.map(key => [key, count(input?.[key])]));

/** Rebuild every field. No provider metadata, prompts, file paths, addresses or positions escape. */
export function normalizeNetworkTelemetry(value) {
  const input = object(value), compute = object(input.compute);
  const peerId = text(input.peerId);
  if (!peerId) return null;
  const seenPeers = new Set(), seenModels = new Set();
  const peers = (Array.isArray(input.peers) ? input.peers : []).slice(0, NETWORK_TELEMETRY_LIMITS.maximumPeers)
    .flatMap(candidate => {
      const peer = object(candidate), id = text(peer.peerId);
      if (!id || id === peerId || seenPeers.has(id)) return [];
      seenPeers.add(id);
      return [{ peerId: id, via: choice(peer.via, VIA, 'unknown'),
        signalingPath: choice(peer.signalingPath, ['direct', 'relay-scoped']),
        mediaPath: choice(peer.mediaPath, ['direct', 'turn-relay', 'unknown']),
        rttMs: Number.isFinite(peer.rttMs) && peer.rttMs >= 0 ? Math.min(peer.rttMs, 600000) : null,
        ...countFields(peer, ['rxCount', 'txCount', 'rxBytes', 'txBytes', 'rxBps', 'txBps']) }];
    });
  const models = (Array.isArray(input.models) ? input.models : []).slice(0, NETWORK_TELEMETRY_LIMITS.maximumModels)
    .flatMap(candidate => {
      const model = object(candidate), manifestCid = text(model.manifestCid);
      if (!manifestCid || seenModels.has(manifestCid)) return [];
      seenModels.add(manifestCid);
      return [{ manifestCid, name: text(model.name, 160), task: text(model.task, 64),
        runtime: text(model.runtime, 48), busy: model.busy === true,
        modalities: [...new Set((Array.isArray(model.modalities) ? model.modalities : [])
          .slice(0, 8).map(value => text(value, 32)).filter(Boolean))] }];
    });
  return { peerId, ts: count(input.ts), application: text(input.application || input.gameId, 80),
    role: choice(input.role, ROLES, models.length ? 'models' : 'compute'),
    gameId: text(input.gameId), roomId: text(input.roomId), topologyId: text(input.topologyId),
    topology: choice(input.topology, ['distributed', 'hierarchical', 'emergent'], 'distributed'),
    isConnected: input.isConnected === true, peerCount: count(input.peerCount),
    counts: countFields(input.counts, ['rx', 'tx', 'rxBytes', 'txBytes']),
    rates: countFields(input.rates, ['rxBps', 'txBps']), peers, models,
    modelsStatus: choice(input.modelsStatus, ['available', 'unavailable'], 'available'),
    compute: input.compute && typeof input.compute === 'object' ? {
      workerCount: count(compute.workerCount), activeTasks: count(compute.activeTasks ?? compute.activeTaskCount),
      queuedTasks: count(compute.queuedTasks ?? compute.queuedTaskCount),
      totalTasksCompleted: count(compute.totalTasksCompleted), totalTasksFailed: count(compute.totalTasksFailed)
    } : null };
}

function bounded(callback, signal, timeoutMs) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController(); let settled = false;
    const done = (fn, value) => {
      if (settled) return; settled = true;
      clearTimeout(timer); signal.removeEventListener('abort', abort); fn(value);
    };
    const cancel = reason => { controller.abort(reason); done(reject, reason); };
    const abort = () => cancel(signal.reason ?? new DOMException('Telemetry stopped', 'AbortError'));
    const timer = setTimeout(() => cancel(new Error('Telemetry provider deadline exceeded')), timeoutMs);
    timer.unref?.();
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { abort(); return; }
    Promise.resolve().then(() => callback(controller.signal)).then(value => done(resolve, value), error => done(reject, error));
  });
}

export class NetworkTelemetryService {
  constructor(manager, { now = Date.now } = {}) {
    this.manager = manager; this.now = now; this.providers = [];
    this.records = new Map(); this.order = new Map(); this.timer = null;
    this.controller = null; this.pending = null; this.error = null;
    this.instanceId = globalThis.crypto.randomUUID(); this.sequence = 0;
  }

  get enabled() { return this.manager.config.enableNetworkTelemetry !== false; }
  get publishing() { return this.enabled && this.manager.config.networkTelemetryPublish !== false; }
  get provider() { return this.providers.at(-1)?.provider ?? null; }

  setProvider(provider) {
    if (provider !== null && typeof provider !== 'function') throw new TypeError('Telemetry provider must be a function');
    if (provider === null) { this.providers.length = 0; return () => {}; }
    const entry = { provider }; this.providers.push(entry);
    return () => {
      const index = this.providers.indexOf(entry);
      if (index !== -1) this.providers.splice(index, 1);
    };
  }

  start() {
    if (!this.enabled || this.controller) return;
    this.controller = new AbortController();
    if (this.publishing) {
      void this.publish();
      this.timer = setInterval(() => { void this.publish(); }, NETWORK_TELEMETRY_LIMITS.intervalMs);
      this.timer.unref?.();
    }
  }

  async stop() {
    clearInterval(this.timer); this.timer = null;
    this.controller?.abort(new DOMException('Telemetry stopped', 'AbortError'));
    await this.pending;
    this.controller = null; this.records.clear(); this.order.clear();
  }

  publish() {
    if (this.pending) return this.pending;
    if (!this.publishing || !this.controller || this.controller.signal.aborted || !this.manager.isConnected) return Promise.resolve();
    const signal = this.controller.signal;
    const operation = (async () => {
      try {
        const pubsub = this.manager.libp2p?.services?.pubsub;
        if (!pubsub || pubsub.globalSignaturePolicy === 'StrictNoSign') throw new Error('Signed pubsub is required for network telemetry');
        const provider = this.provider;
        const extras = provider ? await bounded(operationSignal => provider({ signal: operationSignal }), signal, NETWORK_TELEMETRY_LIMITS.providerTimeoutMs) : {};
        let models = [], reportError = null;
        const inference = this.manager.getPeerInferenceService?.();
        if (inference && !inference.closed) {
          try { models = await bounded(operationSignal => inference.getTelemetrySummary({ signal: operationSignal }), signal, NETWORK_TELEMETRY_LIMITS.providerTimeoutMs); }
          catch (error) { if (signal.aborted) throw error; reportError = 'Hosted-model telemetry unavailable'; }
        }
        if (signal.aborted || !this.manager.isConnected || provider !== this.provider) return;
        const snapshot = normalizeNetworkTelemetry({ ...this.manager.getTelemetrySnapshot(),
          application: extras?.application || this.manager.config.gameId,
          role: extras?.role, compute: extras?.compute, models,
          modelsStatus: reportError ? 'unavailable' : 'available', ts: this.now() });
        if (!snapshot) return;
        const packet = { type: NETWORK_TELEMETRY_TYPE, schema: NETWORK_TELEMETRY_SCHEMA,
          instanceId: this.instanceId, sequence: ++this.sequence, snapshot };
        const bytes = encoder.encode(JSON.stringify(packet));
        if (bytes.byteLength > NETWORK_TELEMETRY_LIMITS.maximumBytes) throw new Error('Network telemetry exceeds its byte limit');
        await bounded(() => pubsub.publish(NETWORK_TELEMETRY_TOPIC, bytes), signal, NETWORK_TELEMETRY_LIMITS.providerTimeoutMs);
        if (signal.aborted || !this.manager.isConnected) return;
        this._remember(snapshot, this.now(), true);
        this.error = reportError;
      } catch (error) {
        if (!signal.aborted) this.error = String(error?.message ?? 'Network telemetry unavailable').slice(0, 160);
      }
    })();
    this.pending = operation;
    operation.finally(() => { if (this.pending === operation) this.pending = null; });
    return operation;
  }

  /** Returns true only when consumed. Legacy session beacons keep their existing path. */
  handlePubsubMessage(detail) {
    if (detail?.topic !== NETWORK_TELEMETRY_TOPIC) return false;
    const data = detail.data;
    if (!(data instanceof Uint8Array) || data.byteLength > NETWORK_TELEMETRY_LIMITS.maximumBytes) return true;
    let packet;
    try { packet = JSON.parse(decoder.decode(data)); } catch (_) { return true; }
    if (packet?.type !== NETWORK_TELEMETRY_TYPE) return false;
    if (!this.enabled || !this.controller || this.controller.signal.aborted || detail.type !== 'signed') return true;
    const sender = detail.from?.toString?.();
    if (!sender || sender === this.manager.peerId || sender.length > 128
        || packet.schema !== NETWORK_TELEMETRY_SCHEMA || packet.snapshot?.peerId !== sender
        || typeof packet.instanceId !== 'string' || !/^[a-zA-Z0-9-]{1,64}$/.test(packet.instanceId)
        || !Number.isSafeInteger(packet.sequence) || packet.sequence < 1) return true;
    this.prune();
    const now = this.now(), previous = this.order.get(sender);
    if (previous) {
      if (now - previous.receivedAt < NETWORK_TELEMETRY_LIMITS.minimumReceiveIntervalMs) return true;
      if (previous.instanceId === packet.instanceId && packet.sequence <= previous.sequence) return true;
      if (previous.retired.includes(packet.instanceId)) return true;
    }
    const snapshot = normalizeNetworkTelemetry(packet.snapshot);
    if (!snapshot) return true;
    // Receipt time governs freshness; a peer clock cannot keep itself alive indefinitely.
    const retired = previous?.retired ?? [];
    if (previous && previous.instanceId !== packet.instanceId) retired.push(previous.instanceId);
    this.order.set(sender, { instanceId: packet.instanceId, sequence: packet.sequence, receivedAt: now, retired: retired.slice(-8) });
    if (this.order.size > NETWORK_TELEMETRY_LIMITS.maximumReports) this.order.delete(this.order.keys().next().value);
    this._remember(snapshot, now, false);
    return true;
  }

  _remember(snapshot, receivedAt, local) {
    this.records.delete(snapshot.peerId);
    this.records.set(snapshot.peerId, { ...snapshot, receivedAt, local, authenticated: true, provenance: 'peer-reported' });
    while (this.records.size > NETWORK_TELEMETRY_LIMITS.maximumReports) this.records.delete(this.records.keys().next().value);
  }

  prune() {
    const now = this.now();
    for (const [id, entry] of this.records) if (now - entry.receivedAt > NETWORK_TELEMETRY_LIMITS.expiryMs) this.records.delete(id);
    for (const [id, entry] of this.order) if (now - entry.receivedAt > NETWORK_TELEMETRY_LIMITS.orderExpiryMs) this.order.delete(id);
  }

  list() {
    this.prune(); const now = this.now();
    return [...this.records.values()].map(entry => ({ ...structuredClone(entry), stale: now - entry.receivedAt > NETWORK_TELEMETRY_LIMITS.staleMs }));
  }

  getStatus() {
    this.prune();
    return { enabled: this.enabled, publishing: this.publishing && !!this.controller,
      reportCount: this.records.size, error: this.error };
  }
}
