import { channel, encryptedConnection } from '../../../peercompute/src/peercompute/networkManager/inference/protocol.js';
import { waitForPeerConnection } from '../../../peercompute/src/peercompute/networkManager/inference/waitForPeerConnection.js';
import { writeResultImage, readResultImage } from '../../../peercompute/src/peercompute/networkManager/inference/imageResult.js';
import { writeResultAudio, readResultAudio } from '../../../peercompute/src/peercompute/networkManager/inference/audioFrames.js';
import { GLOBAL_INFERENCE_CHAT_PROTOCOL as PROTOCOL, GLOBAL_INFERENCE_CHAT_LIMITS as L,
  globalChatError as failure, globalChatFields as fields, globalChatScope, globalChatIdentifier,
  prepareGlobalChatInput, globalChatWire, globalChatDigest, globalChatBytes,
  cloneGlobalChatEvent, globalChatDelivery } from './globalInferenceChatContracts.js';
export { GLOBAL_INFERENCE_CHAT_PROTOCOL, GLOBAL_INFERENCE_CHAT_LIMITS } from './globalInferenceChatContracts.js';

const owners = new WeakMap(), baseFields = ['type', 'recipient', 'scope'];
const errorOf = (error) => error instanceof Error ? error : failure(String(error));
const reason = (signal) => signal.reason instanceof Error ? signal.reason : new DOMException('Global chat cancelled', 'AbortError');
function operation(signals, ms) {
  const controller = new AbortController(), removers = signals.filter(Boolean).map((signal) => {
    const abort = () => controller.abort(reason(signal)); signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort(); return () => signal.removeEventListener('abort', abort);
  });
  const timer = setTimeout(() => controller.abort(failure('Global chat delivery timed out', 'ERR_GLOBAL_CHAT_DEADLINE')), ms);
  timer.unref?.();
  return { signal: controller.signal, dispose() { clearTimeout(timer); removers.forEach((remove) => remove()); } };
}
function abortable(value, signal) {
  const promise = Promise.resolve(value);
  if (signal.aborted) { promise.catch(() => {}); return Promise.reject(reason(signal)); }
  return new Promise((resolve, reject) => {
    const abort = () => reject(reason(signal)); signal.addEventListener('abort', abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
function abortStream(stream, error) { try { Promise.resolve(stream?.abort(errorOf(error))).catch(() => {}); } catch { /* Cleanup only. */ } }
async function closeStream(stream) {
  const op = operation([], 250);
  try { await abortable(stream.close({ signal: op.signal }), op.signal); } catch (error) { abortStream(stream, error); }
  finally { op.dispose(); }
}
function observe(callback, value) { try { Promise.resolve(callback(value)).catch(() => {}); } catch { /* Observers never change delivery. */ } }
const safeMessage = (error) => String(error?.message ?? error).slice(0, 256);

/** Explicit public turns on authenticated inference-network streams. Never executes prompts.
 * History is bounded, in-memory, and fetched only from its authenticated original author. */
export class GlobalInferenceChatService {
  constructor({ networkManager, onEvent = () => {}, onStatus = () => {}, requestTimeoutMs = L.requestMs,
    now = () => performance.now() } = {}) {
    if (!networkManager || typeof onEvent !== 'function' || typeof onStatus !== 'function' || typeof now !== 'function'
        || !Number.isInteger(requestTimeoutMs) || requestTimeoutMs < 100 || requestTimeoutMs > L.requestMs) {
      throw new TypeError('Global inference chat requires a network manager, callbacks and a bounded timeout');
    }
    Object.assign(this, { manager: networkManager, onEvent, onStatus, requestTimeoutMs, now });
    this.controller = new AbortController(); this.session = crypto.randomUUID();
    this.operations = new Set(); this.inbound = new Map(); this.cache = new Map(); this.seen = new Map(); this.rates = new Map();
    this.cacheBytes = 0; this.sends = 0; this.started = false; this.closed = false; this.registered = false;
    this.peerCursors = { publish: 0, history: 0 };
    this.lastError = null; this.lastDelivery = null;
  }
  get node() { return this.boundNode ?? this.manager.getLibp2pNode?.() ?? this.manager.libp2p; }
  get peerId() { return this.node?.peerId?.toString(); }
  _active() {
    if (this.closed || !this.started) throw failure('Global chat is not connected', 'ERR_GLOBAL_CHAT_CLOSED');
    if ((this.manager.getLibp2pNode?.() ?? this.manager.libp2p) !== this.boundNode
        || JSON.stringify(globalChatScope(this.manager.config)) !== JSON.stringify(this.scope)) {
      throw failure('Inference network changed; reconnect global chat', 'ERR_GLOBAL_CHAT_SCOPE');
    }
  }
  _known(peerId) {
    const meta = this.manager.peers?.get(peerId);
    return Boolean(this.scope && peerId !== this.peerId && !this.manager.bootstrapPeerIds?.has(peerId)
      && meta && Object.keys(this.scope).every((key) => meta[key] === this.scope[key]));
  }
  _peers() { return [...(this.manager.peers?.keys() ?? [])].filter((id) => this._known(id)); }
  _peerBatch(kind) {
    const peers = this._peers();
    if (!peers.length) { this.peerCursors[kind] = 0; return []; }
    const start = this.peerCursors[kind] % peers.length, count = Math.min(L.maximumPeers, peers.length);
    this.peerCursors[kind] = (start + count) % peers.length;
    return Array.from({ length: count }, (_, index) => peers[(start + index) % peers.length]);
  }
  _track(promise) { this.operations.add(promise); promise.catch(() => {}).finally(() => this.operations.delete(promise)); return promise; }
  _envelope(type, recipient, data = {}) { return { type, recipient, scope: this.scope, ...data }; }
  _check(value, peerId) {
    this._active();
    if (!this._known(peerId) || value?.recipient !== this.peerId
        || Object.keys(this.scope).some((key) => value.scope?.[key] !== this.scope[key])) {
      throw failure('Global chat authenticated peer or scope mismatch', 'ERR_GLOBAL_CHAT_SCOPE');
    }
    fields(value.scope, Object.keys(this.scope));
  }
  _rate(peerId) {
    const now = this.now();
    for (const [key, times] of this.rates) {
      const active = times.filter((at) => now - at < L.rateWindowMs);
      if (active.length) this.rates.set(key, active); else this.rates.delete(key);
    }
    const times = this.rates.get(peerId) ?? [];
    if (times.length >= L.rateMessages || (!this.rates.has(peerId) && this.rates.size >= L.ratePeers + 1)) {
      throw failure('Global chat rate limit reached; wait a few seconds', 'ERR_GLOBAL_CHAT_RATE');
    }
    times.push(now); this.rates.set(peerId, times);
  }
  getStatus() {
    let connected = false; try { this._active(); connected = true; } catch { /* No active scope. */ }
    return { connected, peerCount: connected ? this._peers().length : 0, eventCount: this.cache.size,
      cacheBytes: this.cacheBytes, sending: this.sends, refreshing: Boolean(this.refreshing),
      error: this.lastError, delivery: this.lastDelivery };
  }
  _status(extra = {}) { observe(this.onStatus, { ...this.getStatus(), ...extra }); }
  async start() {
    if (this.closed) throw failure('Global chat is closed', 'ERR_GLOBAL_CHAT_CLOSED');
    if (this.starting) return this.starting;
    this.boundNode = this.node;
    if (!this.boundNode?.handle || !this.peerId) throw failure('Inference network is not connected', 'ERR_GLOBAL_CHAT_UNREACHABLE');
    if (owners.has(this.node)) throw failure('This inference network already owns global chat', 'ERR_GLOBAL_CHAT_OWNER');
    this.scope = Object.freeze(globalChatScope(this.manager.config)); owners.set(this.node, this);
    this.starting = (async () => {
      this.registered = true;
      try {
        await this.node.handle(PROTOCOL, (stream, connection) => {
          const peerId = connection?.remotePeer?.toString?.();
          if (this.closed || !encryptedConnection(connection) || !this._known(peerId)
              || [...this.inbound.values()].reduce((a, b) => a + b, 0) >= L.maximumInbound
              || (this.inbound.get(peerId) ?? 0) >= L.perPeerInbound) {
            abortStream(stream, failure('Encrypted inference peer required or global chat is busy', 'ERR_GLOBAL_CHAT_AUTH')); return;
          }
          this.inbound.set(peerId, (this.inbound.get(peerId) ?? 0) + 1);
          this._track(this._handle(stream, connection).finally(() => {
            const remaining = this.inbound.get(peerId) - 1;
            if (remaining) this.inbound.set(peerId, remaining); else this.inbound.delete(peerId);
          }));
        }, { maxInboundStreams: L.perPeerInbound, maxOutboundStreams: L.maximumSends + 1, runOnLimitedConnection: true });
        if (!this.closed) this.started = true; this._status(); return this;
      } catch (error) {
        try { await this.node.unhandle(PROTOCOL); this.registered = false; owners.delete(this.node); }
        catch (cleanup) { throw new AggregateError([error, cleanup], 'Global chat startup and cleanup failed'); }
        throw error;
      }
    })();
    return this.starting;
  }
  async _open(peerId, signal) {
    const connections = () => this.node.getConnections().filter((entry) => encryptedConnection(entry)
      && entry.remotePeer.toString() === peerId).sort((a, b) => Number(b.encryption === 'native') - Number(a.encryption === 'native'));
    if (!connections().length && this._known(peerId) && this.manager._maybeDialPeer) {
      await waitForPeerConnection({ node: this.node, peerId, signal, timeoutMs: Math.min(this.requestTimeoutMs, L.connectMs),
        dial: () => this.manager._maybeDialPeer(peerId, 'global-inference-chat'), assertAllowed: () => {
          this._active(); if (!this._known(peerId)) throw failure('Peer left the inference network', 'ERR_GLOBAL_CHAT_SCOPE');
        } });
    }
    let lastError;
    for (const connection of connections().slice(0, 4)) {
      signal.throwIfAborted(); const op = operation([signal], Math.min(this.requestTimeoutMs, 1500)); let opening;
      try {
        opening = Promise.resolve(connection.newStream(PROTOCOL, { signal: op.signal, runOnLimitedConnection: true }));
        const stream = await abortable(opening, op.signal); op.signal.throwIfAborted(); return { stream, connection };
      } catch (error) {
        lastError = error; opening?.then((late) => abortStream(late, error), () => {}); signal.throwIfAborted();
      } finally { op.dispose(); }
    }
    throw failure(`Unable to reach global chat peer${lastError ? `: ${safeMessage(lastError)}` : ''}`, 'ERR_GLOBAL_CHAT_UNREACHABLE');
  }
  _accept(peerId, wire, media) {
    const key = `${peerId}:${wire.id}`, digest = globalChatDigest(wire), now = this.now();
    for (const [id, entry] of this.seen) if (now - entry.at >= L.replayMs) this.seen.delete(id);
    const previous = this.seen.get(key);
    if (previous) {
      if (previous.digest !== digest) throw failure('Conflicting duplicate global event');
      return this.cache.get(key)?.event ?? null;
    }
    if (this.seen.size >= L.replayEntries) throw failure('Global chat replay window is full', 'ERR_GLOBAL_CHAT_BUSY');
    const { image: ignoredImage, audio: ignoredAudio, ...scalar } = wire;
    const event = Object.freeze({ ...scalar, ...media, peerId, local: peerId === this.peerId, receivedAt: Date.now() });
    const size = globalChatBytes(wire);
    if (size > L.peerCacheBytes) throw failure('Global event exceeds retained media allowance');
    const peerBytes = () => [...this.cache.values()].filter((entry) => entry.event.peerId === peerId).reduce((sum, entry) => sum + entry.size, 0);
    const evict = (candidate) => { this.cacheBytes -= candidate[1].size; this.cache.delete(candidate[0]); };
    while (peerBytes() + size > L.peerCacheBytes) evict([...this.cache].find(([, entry]) => entry.event.peerId === peerId));
    while (this.cache.size >= L.cacheEvents || this.cacheBytes + size > L.cacheBytes) {
      evict([...this.cache].find(([, entry]) => entry.event.peerId !== this.peerId) ?? this.cache.entries().next().value);
    }
    this.cache.set(key, { event, wire, digest, size }); this.cacheBytes += size;
    this.seen.set(key, { digest, at: now }); observe(this.onEvent, cloneGlobalChatEvent(event)); this._status(); return event;
  }
  _credits(io, requestId, signal) {
    return { expect(offset) {
      const pending = abortable(io.read(signal), signal).then((frame) => {
        fields(frame, ['type', 'requestId', 'offset']);
        if (frame.type !== 'result-credit' || frame.requestId !== requestId || frame.offset !== offset) throw failure('Invalid global media credit');
      });
      pending.catch(() => {}); return pending;
    } };
  }
  async _writeEvent(io, peerId, session, entry, signal) {
    await abortable(io.write(this._envelope('event', peerId, { session, event: entry.wire }), signal), signal);
    const requestId = entry.wire.id, controls = this._credits(io, requestId, signal);
    if (entry.wire.image) await abortable(writeResultImage(io, { image: entry.event.image,
      metadata: entry.wire.image, requestId, controls, signal }), signal);
    if (entry.wire.audio) await abortable(writeResultAudio(io, { samples: entry.event.audio.samples,
      metadata: entry.wire.audio, requestId, controls, signal }), signal);
  }
  async _readEvent(io, peerId, session, value, signal) {
    this._check(value, peerId); fields(value, [...baseFields, 'session', 'event']);
    if (value.type !== 'event' || value.session !== session) throw failure('Global event session changed');
    const wire = globalChatWire(value.event), media = {};
    if (wire.image) {
      const frame = await abortable(io.read(signal), signal); fields(frame, ['type', 'requestId', 'image']);
      if (frame.type !== 'result-image' || frame.requestId !== wire.id || JSON.stringify(frame.image) !== JSON.stringify(wire.image)) {
        throw failure('Global image descriptor mismatch');
      }
      const image = await abortable(readResultImage(io, { image: wire.image, requestId: wire.id, signal }), signal);
      media.image = { width: image.width, height: image.height, channels: 4, data: image.data };
    }
    if (wire.audio) {
      const frame = await abortable(io.read(signal), signal); fields(frame, ['type', 'requestId', 'audio']);
      if (frame.type !== 'result-audio' || frame.requestId !== wire.id || JSON.stringify(frame.audio) !== JSON.stringify(wire.audio)) {
        throw failure('Global audio descriptor mismatch');
      }
      const audio = await abortable(readResultAudio(io, { audio: wire.audio, requestId: wire.id, signal }), signal);
      media.audio = { samples: audio.audio, sampleRate: audio.sampleRate };
    }
    signal.throwIfAborted(); this._check(value, peerId); return { wire, media };
  }
  async _ack(io, peerId, session, id, signal) {
    await abortable(io.write(this._envelope('ack', peerId, { session, id }), signal), signal);
  }
  async _readAck(io, peerId, session, id, signal) {
    const ack = await abortable(io.read(signal), signal); this._check(ack, peerId);
    if (ack.type === 'error') throw Object.assign(failure(safeMessage(ack.message)), { rejected: true });
    fields(ack, [...baseFields, 'session', 'id']);
    if (ack.type !== 'ack' || ack.session !== session || ack.id !== id) throw failure('Invalid global chat acknowledgement');
  }
  async _connect(peerId, kind, signal) {
    this._active(); if (!this._known(peerId)) throw failure('Peer left inference network');
    const { stream, connection } = await this._open(peerId, signal);
    const release = this.manager.retainPeerInferenceConnection?.(connection, { timeoutMs: this.requestTimeoutMs + 500 });
    try {
      const io = channel(stream);
      await abortable(io.write(this._envelope('hello', peerId, { operation: kind }), signal), signal);
      const ready = await abortable(io.read(signal), signal); this._check(ready, peerId);
      if (ready.type === 'error') throw failure(safeMessage(ready.message));
      fields(ready, [...baseFields, 'session']);
      if (ready.type !== 'ready') throw failure('Invalid global chat handshake');
      globalChatIdentifier(ready.session); return { stream, io, release, session: ready.session };
    } catch (error) { abortStream(stream, error); release?.(); throw error; }
  }
  async _deliver(peerId, entry, signal) {
    const op = operation([this.controller.signal, signal], this.requestTimeoutMs);
    let connection, committed = false, acknowledged = false;
    const abort = () => abortStream(connection?.stream, reason(op.signal)); op.signal.addEventListener('abort', abort, { once: true });
    try {
      connection = await this._connect(peerId, 'publish', op.signal); committed = true;
      await this._writeEvent(connection.io, peerId, connection.session, entry, op.signal);
      await this._readAck(connection.io, peerId, connection.session, entry.wire.id, op.signal); acknowledged = true;
      await closeStream(connection.stream); return { peerId, status: 'acknowledged' };
    } catch (error) {
      abortStream(connection?.stream, error);
      return { peerId, status: acknowledged ? 'acknowledged' : committed && !error.rejected ? 'unconfirmed' : 'failed',
        ...(acknowledged ? {} : { error: safeMessage(error) }) };
    } finally { op.signal.removeEventListener('abort', abort); op.dispose(); connection?.release?.(); }
  }
  publish(input, { signal } = {}) {
    this._active(); signal?.throwIfAborted();
    if (this.sends >= L.maximumSends) throw failure('Global chat is still sending', 'ERR_GLOBAL_CHAT_BUSY');
    const prepared = prepareGlobalChatInput(input), wire = globalChatWire({ id: crypto.randomUUID(), ...prepared.wire });
    this._rate('local'); const event = this._accept(this.peerId, wire, {
      ...(prepared.input.image ? { image: prepared.input.image } : {}), ...(prepared.input.audio ? { audio: prepared.input.audio } : {}) });
    const entry = { event, wire }, peers = this._peerBatch('publish'), recipients = peers.map((peerId) => ({ peerId, status: 'pending' }));
    this.sends++; this._status({ delivery: globalChatDelivery(event.id, recipients, { sending: true }) });
    const run = async () => {
      const op = operation([this.controller.signal, signal], L.sendMs); let next = 0;
      try {
        await Promise.all(Array.from({ length: Math.min(L.fanout, peers.length) }, async () => {
          for (;;) {
            const index = next++; if (index >= peers.length) return;
            recipients[index] = op.signal.aborted ? { peerId: peers[index], status: 'failed', error: 'Global sharing cancelled' }
              : await this._deliver(peers[index], entry, op.signal);
          }
        }));
        const delivery = globalChatDelivery(event.id, recipients, { cancelled: op.signal.aborted });
        this.lastDelivery = delivery; this.lastError = recipients.find((entry) => entry.error)?.error ?? null;
        return { event: cloneGlobalChatEvent(event), delivery };
      } finally { op.dispose(); this.sends--; this._status(); }
    };
    return this._track(run());
  }
  _ownHistory() { return [...this.cache.values()].filter((entry) => entry.event.peerId === this.peerId).slice(-L.historyEvents); }
  async _sendHistory(io, peerId, session, signal) {
    const inventory = this._ownHistory().map(({ wire, digest }) => ({ id: wire.id, digest }));
    await abortable(io.write(this._envelope('inventory', peerId, { session, events: inventory }), signal), signal);
    const wanted = await abortable(io.read(signal), signal); this._check(wanted, peerId); fields(wanted, [...baseFields, 'session', 'ids']);
    if (wanted.type !== 'select' || wanted.session !== session || !Array.isArray(wanted.ids)
        || wanted.ids.length > L.historyEvents || new Set(wanted.ids).size !== wanted.ids.length
        || wanted.ids.some((id) => !inventory.some((entry) => entry.id === id))) throw failure('Invalid global history selection');
    for (const id of wanted.ids) {
      this._active(); signal.throwIfAborted(); const entry = this.cache.get(`${this.peerId}:${id}`);
      if (!entry) { await abortable(io.write(this._envelope('missing', peerId, { session, id }), signal), signal); continue; }
      await this._writeEvent(io, peerId, session, entry, signal); await this._readAck(io, peerId, session, id, signal);
    }
    await abortable(io.write(this._envelope('done', peerId, { session }), signal), signal);
  }
  async _fetchHistory(peerId, signal) {
    const op = operation([this.controller.signal, signal], this.requestTimeoutMs); let connection;
    const abort = () => abortStream(connection?.stream, reason(op.signal)); op.signal.addEventListener('abort', abort, { once: true });
    try {
      connection = await this._connect(peerId, 'history', op.signal); const { io, session } = connection;
      const inventory = await abortable(io.read(op.signal), op.signal); this._check(inventory, peerId);
      fields(inventory, [...baseFields, 'session', 'events']);
      if (inventory.type !== 'inventory' || inventory.session !== session || !Array.isArray(inventory.events)
          || inventory.events.length > L.historyEvents) throw failure('Invalid global history inventory');
      const missing = new Map();
      const ids = new Set();
      for (const entry of inventory.events) {
        fields(entry, ['id', 'digest']); globalChatIdentifier(entry.id);
        if (!/^[a-f0-9]{64}$/.test(entry.digest ?? '') || ids.has(entry.id)) throw failure('Invalid global history fingerprint');
        ids.add(entry.id); const prior = this.seen.get(`${peerId}:${entry.id}`);
        if (prior && prior.digest !== entry.digest) throw failure('Conflicting global history event');
        if (!prior) missing.set(entry.id, entry.digest);
      }
      await abortable(io.write(this._envelope('select', peerId, { session, ids: [...missing.keys()] }), op.signal), op.signal);
      for (const [id, digest] of missing) {
        const value = await abortable(io.read(op.signal), op.signal); this._check(value, peerId);
        if (value.type === 'missing') {
          fields(value, [...baseFields, 'session', 'id']);
          if (value.session !== session || value.id !== id) throw failure('Invalid missing global history event');
          continue;
        }
        const entry = await this._readEvent(io, peerId, session, value, op.signal);
        if (entry.wire.id !== id || globalChatDigest(entry.wire) !== digest) throw failure('Global history content changed');
        this._accept(peerId, entry.wire, entry.media); await this._ack(io, peerId, session, id, op.signal);
      }
      const done = await abortable(io.read(op.signal), op.signal); this._check(done, peerId); fields(done, [...baseFields, 'session']);
      if (done.type !== 'done' || done.session !== session) throw failure('Invalid global history completion');
      await closeStream(connection.stream); return { peerId, status: 'acknowledged' };
    } catch (error) { abortStream(connection?.stream, error); return { peerId, status: 'failed', error: safeMessage(error) }; }
    finally { op.signal.removeEventListener('abort', abort); op.dispose(); connection?.release?.(); }
  }
  refresh({ signal } = {}) {
    this._active(); signal?.throwIfAborted(); if (this.refreshing) return this.refreshing;
    const run = async () => {
      // Bound work per refresh, not the discovery set: later known authors must
      // eventually be queried even when the network has more than 32 peers.
      const op = operation([this.controller.signal, signal], L.sendMs), peers = this._peerBatch('history'), results = []; let next = 0;
      try {
        await Promise.all(Array.from({ length: Math.min(L.fanout, peers.length) }, async () => {
          for (;;) {
            const index = next++; if (index >= peers.length || op.signal.aborted) return;
            results.push(await this._fetchHistory(peers[index], op.signal));
          }
        }));
        this.lastError = results.find((entry) => entry.error)?.error ?? null;
      } finally { op.dispose(); this.refreshing = null; this._status(); }
      return this.getStatus();
    };
    this.refreshing = this._track(Promise.resolve().then(run)); return this.refreshing;
  }
  async _handle(stream, connection) {
    const peerId = connection.remotePeer.toString(), op = operation([this.controller.signal], this.requestTimeoutMs);
    const io = channel(stream); let release, accepted = false;
    const abort = () => abortStream(stream, reason(op.signal)); op.signal.addEventListener('abort', abort, { once: true });
    try {
      release = this.manager.retainPeerInferenceConnection?.(connection, { timeoutMs: this.requestTimeoutMs + 500 });
      const hello = await abortable(io.read(op.signal), op.signal); this._check(hello, peerId);
      fields(hello, [...baseFields, 'operation']);
      if (hello.type !== 'hello' || !['publish', 'history'].includes(hello.operation)) throw failure('Global chat handshake required');
      this._rate(peerId); await abortable(io.write(this._envelope('ready', peerId, { session: this.session }), op.signal), op.signal);
      if (hello.operation === 'history') await this._sendHistory(io, peerId, this.session, op.signal);
      else {
        const value = await abortable(io.read(op.signal), op.signal);
        const entry = await this._readEvent(io, peerId, this.session, value, op.signal);
        this._accept(peerId, entry.wire, entry.media); accepted = true;
        await this._ack(io, peerId, this.session, entry.wire.id, op.signal);
      }
      await closeStream(stream);
    } catch (error) {
      if (!op.signal.aborted && !accepted) {
        try { await abortable(io.write(this._envelope('error', peerId, { message: safeMessage(error) }), op.signal), op.signal);
          await closeStream(stream); } catch (cleanup) { abortStream(stream, cleanup); }
      } else abortStream(stream, error);
    } finally { op.signal.removeEventListener('abort', abort); op.dispose(); release?.(); }
  }
  close() {
    if (this.closing) return this.closing;
    this.closed = true; this.controller.abort(new DOMException('Global chat closed', 'AbortError'));
    this.closing = (async () => {
      await this.starting?.catch(() => {});
      if (this.registered) { await this.boundNode.unhandle(PROTOCOL); this.registered = false; }
      await Promise.allSettled([...this.operations]); if (owners.get(this.boundNode) === this) owners.delete(this.boundNode);
      this.started = false; this.cache.clear(); this.cacheBytes = 0; this.seen.clear(); this.rates.clear(); this._status();
    })().catch((error) => { this.closing = null; throw error; });
    return this.closing;
  }
}
