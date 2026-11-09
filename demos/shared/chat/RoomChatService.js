import { channel, encryptedConnection } from '../../../peercompute/src/peercompute/networkManager/inference/protocol.js';
import { waitForPeerConnection } from '../../../peercompute/src/peercompute/networkManager/inference/waitForPeerConnection.js';
import { ROOM_CHAT_PROTOCOL, ROOM_CHAT_PROTOCOL_V1, ROOM_CHAT_LIMITS as L, chatError, chatText, chatFields,
  normalizeChatInput, validateSocialAuthor, chatScope, chatIdentifier, deliveryStatus } from './roomChatContracts.js';
export { ROOM_CHAT_PROTOCOL, ROOM_CHAT_PROTOCOL_V1, ROOM_CHAT_LIMITS } from './roomChatContracts.js';
const protocols = [ROOM_CHAT_PROTOCOL, ROOM_CHAT_PROTOCOL_V1];

const owners = new WeakMap(), baseFields = ['type', 'recipient', 'scope', 'worldId'];
const errorOf = (error) => error instanceof Error ? error : chatError(String(error));
const abortReason = (signal) => signal.reason instanceof Error ? signal.reason : new DOMException('Room chat cancelled', 'AbortError');
function operation(signals, timeoutMs) {
  const controller = new AbortController(), removers = signals.filter(Boolean).map((signal) => {
    const abort = () => controller.abort(abortReason(signal));
    signal.addEventListener('abort', abort, { once: true }); if (signal.aborted) abort();
    return () => signal.removeEventListener('abort', abort);
  });
  const timer = setTimeout(() => controller.abort(chatError('Room chat delivery timed out', 'ERR_ROOM_CHAT_DEADLINE')), timeoutMs);
  timer.unref?.();
  return { signal: controller.signal, controller, dispose() { clearTimeout(timer); removers.forEach((remove) => remove()); } };
}
function withAbort(value, signal) {
  const promise = Promise.resolve(value);
  if (signal.aborted) { promise.catch(() => {}); return Promise.reject(abortReason(signal)); }
  return new Promise((resolve, reject) => {
    const abort = () => reject(abortReason(signal)); signal.addEventListener('abort', abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
function abortStream(stream, error) {
  try { Promise.resolve(stream?.abort(errorOf(error))).catch(() => {}); } catch { /* Best-effort transport cleanup. */ }
}
async function closeStream(stream) {
  const op = operation([], 250);
  try { await withAbort(stream.close({ signal: op.signal }), op.signal); }
  catch (error) { abortStream(stream, error); }
  finally { op.dispose(); }
}
function observe(callback, value) {
  try { Promise.resolve(callback(value)).catch(() => {}); } catch { /* UI observers cannot change delivery. */ }
}
function timeout(value) {
  if (!Number.isInteger(value) || value < 100 || value > L.requestMs) throw new TypeError('Invalid chat request timeout');
  return value;
}

/** Live room messages only. Acknowledged means accepted by the remote service, not read by a person. */
export class RoomChatService {
  constructor({ networkManager, worldId, onMessage = () => {}, onStatus = () => {},
    requestTimeoutMs = L.requestMs, now = () => performance.now() } = {}) {
    if (!networkManager || typeof onMessage !== 'function' || typeof onStatus !== 'function' || typeof now !== 'function') {
      throw new TypeError('Room chat requires a network manager and callbacks');
    }
    Object.assign(this, { manager: networkManager, onMessage, onStatus, now });
    this.worldId = chatText(worldId, 240, 'World'); this.requestTimeoutMs = timeout(requestTimeoutMs);
    this.controller = new AbortController(); this.session = crypto.randomUUID();
    this.operations = new Set(); this.inbound = new Map(); this.seen = new Map(); this.rates = new Map();
    this.sends = 0; this.closed = false; this.started = false; this.registered = false;
  }
  get node() { return this.boundNode ?? this.manager.getLibp2pNode?.() ?? this.manager.libp2p; }
  get peerId() { return this.node.peerId.toString(); }
  _active() {
    if (this.closed || !this.started) throw chatError('Room chat is not connected', 'ERR_ROOM_CHAT_CLOSED');
    if ((this.manager.getLibp2pNode?.() ?? this.manager.libp2p) !== this.boundNode
        || JSON.stringify(chatScope(this.manager.config)) !== JSON.stringify(this.scope)) {
      throw chatError('Room network changed; reconnect room chat', 'ERR_ROOM_CHAT_SCOPE');
    }
  }
  _track(promise) {
    this.operations.add(promise); promise.catch(() => {}).finally(() => this.operations.delete(promise)); return promise;
  }
  _known(peerId) {
    const meta = this.manager.peers?.get(peerId);
    return peerId !== this.peerId && !this.manager.bootstrapPeerIds?.has(peerId)
      && meta && Object.keys(this.scope).every((key) => meta[key] === this.scope[key]);
  }
  _envelope(type, recipient, data = {}) { return { type, recipient, scope: this.scope, worldId: this.worldId, ...data }; }
  _check(value, peerId) {
    this._active();
    if (!this._known(peerId) || value?.recipient !== this.peerId || value.worldId !== this.worldId
        || Object.keys(this.scope).some((key) => value.scope?.[key] !== this.scope[key])) {
      throw chatError('Room chat identity or room scope mismatch', 'ERR_ROOM_CHAT_SCOPE');
    }
    chatFields(value.scope, Object.keys(this.scope));
  }
  _rate(key) {
    const now = this.now();
    for (const [id, times] of this.rates) {
      const active = times.filter((at) => now - at < L.rateWindowMs);
      if (active.length) this.rates.set(id, active); else this.rates.delete(id);
    }
    const times = this.rates.get(key) ?? [];
    if (times.length >= L.rateMessages || (!this.rates.has(key) && this.rates.size >= L.maximumPeers + 1)) {
      throw chatError('Room chat rate limit reached; wait a few seconds', 'ERR_ROOM_CHAT_RATE');
    }
    times.push(now); this.rates.set(key, times);
  }
  async start() {
    if (this.closed) throw chatError('Room chat is closed', 'ERR_ROOM_CHAT_CLOSED');
    if (this.starting) return this.starting;
    this.boundNode = this.node;
    if (!this.boundNode?.handle) throw chatError('Room network is not connected', 'ERR_ROOM_CHAT_UNREACHABLE');
    if (owners.has(this.node)) throw chatError('This room network already owns chat', 'ERR_ROOM_CHAT_OWNER');
    this.scope = Object.freeze(chatScope(this.manager.config)); owners.set(this.node, this);
    this.starting = (async () => {
      this.registered = true;
      try {
        for (const protocol of protocols) await this.node.handle(protocol, (stream, connection) => {
          const peerId = connection?.remotePeer?.toString?.();
          if (this.closed || !encryptedConnection(connection) || !this._known(peerId)
              || [...this.inbound.values()].reduce((a, b) => a + b, 0) >= L.maximumInbound
              || (this.inbound.get(peerId) ?? 0) >= L.perPeerInbound) {
            abortStream(stream, chatError('Encrypted room peer connection required or chat is busy', 'ERR_ROOM_CHAT_AUTH')); return;
          }
          this.inbound.set(peerId, (this.inbound.get(peerId) ?? 0) + 1);
          this._track(this._handle(stream, connection, protocol).finally(() => {
            const count = this.inbound.get(peerId) - 1;
            if (count) this.inbound.set(peerId, count); else this.inbound.delete(peerId);
          }));
        }, { maxInboundStreams: L.perPeerInbound, maxOutboundStreams: L.maximumSends, runOnLimitedConnection: true });
        if (!this.closed) this.started = true;
        return this;
      } catch (error) {
        try { await this.node.unhandle(protocols); this.registered = false; owners.delete(this.node); }
        catch (cleanup) { throw new AggregateError([error, cleanup], 'Room chat startup and cleanup failed'); }
        throw error;
      }
    })();
    return this.starting;
  }
  async _open(peerId, signal) {
    const connections = () => this.node.getConnections().filter((entry) => encryptedConnection(entry)
      && entry.remotePeer.toString() === peerId).sort((a, b) => Number(b.encryption === 'native') - Number(a.encryption === 'native'));
    if (!connections().length && this._known(peerId) && this.manager._maybeDialPeer) {
      await waitForPeerConnection({ node: this.node, peerId, signal, timeoutMs: this.requestTimeoutMs,
        dial: () => this.manager._maybeDialPeer(peerId, 'room-chat'),
        assertAllowed: () => {
          this._active();
          if (!this._known(peerId)) throw chatError('Peer left this room', 'ERR_ROOM_CHAT_SCOPE');
        }
      });
    }
    let lastError;
    for (const connection of connections().slice(0, 4)) {
      signal.throwIfAborted(); const op = operation([signal], Math.min(this.requestTimeoutMs, 1500)); let opening;
      try {
        opening = Promise.resolve(connection.newStream(protocols, { signal: op.signal, runOnLimitedConnection: true }));
        const stream = await withAbort(opening, op.signal); op.signal.throwIfAborted();
        return { stream, connection };
      } catch (error) {
        lastError = error; opening?.then((late) => abortStream(late, error), () => {}); signal.throwIfAborted();
      } finally { op.dispose(); }
    }
    throw chatError(`Unable to reach room peer${lastError ? `: ${String(lastError.message).slice(0, 160)}` : ''}`, 'ERR_ROOM_CHAT_UNREACHABLE');
  }
  async _deliver(peerId, message, signal) {
    const op = operation([this.controller.signal, signal], this.requestTimeoutMs);
    let stream, release, committed = false, acknowledged = false;
    const abort = () => abortStream(stream, abortReason(op.signal)); op.signal.addEventListener('abort', abort, { once: true });
    try {
      this._active(); if (!this._known(peerId)) throw chatError('Peer left this room', 'ERR_ROOM_CHAT_SCOPE');
      const opened = await this._open(peerId, op.signal); stream = opened.stream;
      release = this.manager.retainPeerInferenceConnection?.(opened.connection, { timeoutMs: this.requestTimeoutMs + 500 });
      const io = channel(stream);
      await withAbort(io.write(this._envelope('hello', peerId), op.signal), op.signal);
      const ready = await withAbort(io.read(op.signal), op.signal); this._check(ready, peerId);
      if (ready.type === 'error') throw chatError(String(ready.message).slice(0, 256));
      chatFields(ready, [...baseFields, 'session']);
      if (ready.type !== 'ready') throw chatError('Invalid room chat handshake');
      chatIdentifier(ready.session); op.signal.throwIfAborted(); committed = true;
      await withAbort(io.write(this._envelope('message', peerId, { session: ready.session, id: message.id,
        text: message.text, name: message.name,
        ...(message.agentId === undefined ? {} : { agentId: message.agentId }),
        ...(message.social && stream.protocol === ROOM_CHAT_PROTOCOL ? { social: message.social } : {}) }), op.signal), op.signal);
      const ack = await withAbort(io.read(op.signal), op.signal); this._check(ack, peerId);
      if (ack.type === 'error') throw Object.assign(chatError(String(ack.message).slice(0, 256)), { rejected: true });
      chatFields(ack, [...baseFields, 'id', 'session']);
      if (ack.type !== 'ack' || ack.id !== message.id || ack.session !== ready.session) throw chatError('Invalid room chat acknowledgment');
      op.signal.throwIfAborted(); acknowledged = true;
      await closeStream(stream);
      return { peerId, status: 'acknowledged' };
    } catch (error) {
      abortStream(stream, error);
      return { peerId, status: acknowledged ? 'acknowledged' : committed && !error.rejected ? 'unconfirmed' : 'failed',
        ...(acknowledged ? {} : { error: String(error?.message ?? error).slice(0, 256) }) };
    } finally { op.signal.removeEventListener('abort', abort); op.dispose(); release?.(); }
  }
  send(input, { signal } = {}) {
    this._active(); signal?.throwIfAborted(); const normalized = normalizeChatInput(input);
    validateSocialAuthor(normalized, this.peerId);
    if (this.sends >= L.maximumSends) throw chatError('Room chat is still sending; wait for delivery', 'ERR_ROOM_CHAT_BUSY');
    const peers = [...(this.manager.peers?.keys() ?? [])].filter((id) => this._known(id));
    if (peers.length > L.maximumPeers) throw chatError('Room chat peer limit reached', 'ERR_ROOM_CHAT_BUSY');
    this._rate('local'); this.sends++;
    const message = Object.freeze({ id: crypto.randomUUID(), peerId: this.peerId, ...normalized,
      local: true, receivedAt: Date.now(), delivery: 'sending' });
    const recipients = peers.map((peerId) => ({ peerId, status: 'pending' }));
    observe(this.onMessage, message); observe(this.onStatus, deliveryStatus(message.id, recipients, { sending: true }));
    const run = async () => {
      const op = operation([this.controller.signal, signal], L.sendMs); let next = 0;
      try {
        await Promise.all(Array.from({ length: Math.min(L.fanout, peers.length) }, async () => {
          for (;;) {
            const index = next++; if (index >= peers.length) return;
            recipients[index] = op.signal.aborted ? { peerId: peers[index], status: 'failed', error: 'Room chat cancelled before sending' }
              : await this._deliver(peers[index], message, op.signal);
          }
        }));
        const delivery = deliveryStatus(message.id, recipients, { cancelled: op.signal.aborted });
        observe(this.onStatus, delivery); return { message, delivery };
      } finally { op.dispose(); this.sends--; }
    };
    return this._track(run());
  }
  async _handle(stream, connection, protocol = ROOM_CHAT_PROTOCOL) {
    const peerId = connection.remotePeer.toString(), op = operation([this.controller.signal], this.requestTimeoutMs);
    let release, accepted = false; const io = channel(stream);
    const abort = () => abortStream(stream, abortReason(op.signal)); op.signal.addEventListener('abort', abort, { once: true });
    try {
      release = this.manager.retainPeerInferenceConnection?.(connection, { timeoutMs: this.requestTimeoutMs + 500 });
      const hello = await withAbort(io.read(op.signal), op.signal);
      this._check(hello, peerId); chatFields(hello, baseFields);
      if (hello.type !== 'hello') throw chatError('Room chat handshake required');
      await withAbort(io.write(this._envelope('ready', peerId, { session: this.session }), op.signal), op.signal);
      const value = await withAbort(io.read(op.signal), op.signal); this._check(value, peerId);
      chatFields(value, [...baseFields, 'session', 'id', 'name', 'text', 'agentId', ...(protocol === ROOM_CHAT_PROTOCOL ? ['social'] : [])]);
      if (value.type !== 'message' || value.session !== this.session) throw chatError('Room chat session changed; message was not accepted');
      const id = chatIdentifier(value.id), input = normalizeChatInput({ name: value.name, text: value.text,
        ...(value.agentId === undefined ? {} : { agentId: value.agentId }),
        ...(value.social === undefined ? {} : { social: value.social }) });
      validateSocialAuthor(input, peerId);
      const key = `${peerId}:${id}`, now = this.now();
      for (const [seenKey, entry] of this.seen) if (now - entry.at >= L.replayMs) this.seen.delete(seenKey);
      const previous = this.seen.get(key);
      if (previous && (previous.text !== input.text || previous.name !== input.name || previous.agentId !== input.agentId
          || JSON.stringify(previous.social) !== JSON.stringify(input.social))) throw chatError('Conflicting duplicate room message');
      if (!previous) {
        if (this.seen.size >= L.replayEntries) throw chatError('Room chat replay window is full; try later', 'ERR_ROOM_CHAT_BUSY');
        this._rate(peerId); op.signal.throwIfAborted();
        this.seen.set(key, { ...input, at: now });
        accepted = true;
        observe(this.onMessage, Object.freeze({ id, peerId, ...input, local: false, receivedAt: Date.now(), delivery: 'received' }));
      }
      accepted = true;
      await withAbort(io.write(this._envelope('ack', peerId, { id, session: this.session }), op.signal), op.signal);
      await closeStream(stream);
    } catch (error) {
      if (!op.signal.aborted && !accepted) {
        try { await withAbort(io.write(this._envelope('error', peerId, { message: String(error.message).slice(0, 256) }), op.signal), op.signal);
          await closeStream(stream); } catch (failure) { abortStream(stream, failure); }
      } else abortStream(stream, error);
    } finally { op.signal.removeEventListener('abort', abort); op.dispose(); release?.(); }
  }
  close() {
    if (this.closing) return this.closing;
    this.closed = true; this.controller.abort(new DOMException('Room chat closed', 'AbortError'));
    this.closing = (async () => {
      await this.starting?.catch(() => {});
      if (this.registered) { await this.boundNode.unhandle(protocols); this.registered = false; }
      await Promise.allSettled([...this.operations]);
      if (owners.get(this.boundNode) === this) owners.delete(this.boundNode);
      this.started = false; this.seen.clear(); this.rates.clear();
    })().catch((error) => { this.closing = null; throw error; });
    return this.closing;
  }
  dispose() { return this.close(); }
}
