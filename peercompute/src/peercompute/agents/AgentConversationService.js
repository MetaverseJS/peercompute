import { channel, encryptedConnection, bytes } from '../networkManager/inference/protocol.js';
import { waitForPeerConnection } from '../networkManager/inference/waitForPeerConnection.js';
import { agentIdentifier } from './AgentContracts.js';
import { normalizePublicAgent, worldAgentText, WORLD_AGENT_LIMITS } from './WorldAgentContracts.js';

export const AGENT_CONVERSATION_PROTOCOL = '/peercompute/world-agents/1.0.0';
export const AGENT_CONVERSATION_LIMITS = Object.freeze({ maximumPeers: 32, maximumRequests: 8,
  maximumPerPeer: 2, queryTimeoutMs: 5000, requestTimeoutMs: 300000, refreshMs: 5000,
  recordTtlMs: 15000, replayEntries: 1024 });
const L = AGENT_CONVERSATION_LIMITS, owners = new WeakMap();
const encoder = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });
const fail = (message, code = 'ERR_AGENT_CONVERSATION') => Object.assign(new Error(message), { code });
const asError = (error) => error instanceof Error ? error : fail(String(error));
const reason = (signal) => signal.reason instanceof Error ? signal.reason : new DOMException('Agent conversation cancelled', 'AbortError');
const bounded = (value, maximum, minimum = 1) => {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new TypeError('Invalid agent conversation limit');
  return value;
};
function operation(signals, timeout) {
  const controller = new AbortController();
  const removers = signals.filter(Boolean).map((signal) => {
    const abort = () => controller.abort(reason(signal));
    signal.addEventListener('abort', abort, { once: true }); if (signal.aborted) abort();
    return () => signal.removeEventListener('abort', abort);
  });
  const timer = setTimeout(() => controller.abort(fail('Agent conversation deadline exceeded', 'ERR_AGENT_DEADLINE')), timeout);
  timer.unref?.();
  return { controller, signal: controller.signal, dispose() { clearTimeout(timer); removers.forEach((remove) => remove()); } };
}
function withAbort(value, signal) {
  const promise = Promise.resolve(value);
  if (signal.aborted) { promise.catch(() => {}); return Promise.reject(reason(signal)); }
  return new Promise((resolve, reject) => {
    const abort = () => reject(reason(signal));
    signal.addEventListener('abort', abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
function fields(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some((key) => !allowed.includes(key))) throw fail('Unexpected agent conversation fields');
}
const envelopeFields = ['type', 'sender', 'recipient', 'scope', 'worldId'];
function prompt(value) {
  if (typeof value !== 'string' || !value.trim() || value.includes('\0') || bytes(value) > WORLD_AGENT_LIMITS.promptBytes) {
    throw fail('Agent prompt exceeds its text bounds', 'ERR_AGENT_INPUT');
  }
  return value;
}
function reply(value) {
  if (typeof value?.text !== 'string' || bytes(value.text) > WORLD_AGENT_LIMITS.replyBytes
      || !['stop', 'length', 'unknown'].includes(value.finishReason ?? 'unknown')) throw fail('Invalid bounded agent reply');
  return { text: value.text, finishReason: value.finishReason ?? 'unknown' };
}

/** Private owner-directed conversations. No remote history, authority, model loading or code is accepted. */
export class AgentConversationService {
  constructor({ networkManager, worldId, listLocalAgents, respond, onDirectory = () => {},
    queryTimeoutMs = L.queryTimeoutMs, requestTimeoutMs = L.requestTimeoutMs, now = () => performance.now() } = {}) {
    if (!networkManager || typeof listLocalAgents !== 'function' || typeof respond !== 'function'
        || typeof onDirectory !== 'function' || typeof now !== 'function') throw new TypeError('Agent conversation callbacks and manager are required');
    Object.assign(this, { manager: networkManager, listLocalAgents, respond, onDirectory, now });
    this.worldId = worldAgentText(worldId, 240, 'world');
    this.queryTimeoutMs = bounded(queryTimeoutMs, 15000, 100);
    this.requestTimeoutMs = bounded(requestTimeoutMs, L.requestTimeoutMs, 100);
    this.controller = new AbortController(); this.records = new Map(); this.seen = new Map();
    this.inbound = new Map(); this.outbound = new Map(); this.operations = new Set(); this.pending = new Set();
    this.closed = false; this.registered = false; this.started = false; this.lastErrors = [];
    this.disconnect = (event) => {
      const peerId = event.detail?.remotePeer?.toString?.() ?? event.detail?.toString?.();
      if (!peerId) return;
      this.records.delete(peerId); this._publish();
      for (const entry of this.pending) if (entry.peerId === peerId) entry.op.controller.abort(fail('Agent owner or requester disconnected', 'ERR_AGENT_DISCONNECTED'));
    };
  }
  get node() { return this.boundNode ?? this.manager.getLibp2pNode?.() ?? this.manager.libp2p; }
  get peerId() { return this.node.peerId.toString(); }
  get scope() {
    return Object.fromEntries(['gameId', 'roomId', 'topologyId'].map((key) => [key, worldAgentText(this.manager.config?.[key], 240, key)]));
  }
  _active() {
    if (this.closed || !this.started) throw fail('Agent conversation service is closed', 'ERR_AGENT_CLOSED');
    if ((this.manager.getLibp2pNode?.() ?? this.manager.libp2p) !== this.boundNode) throw fail('Agent network restarted; reconnect this world service', 'ERR_AGENT_NETWORK_CHANGED');
    if (JSON.stringify(this.scope) !== this.startedScope) throw fail('Agent world network scope changed', 'ERR_AGENT_SCOPE');
  }
  _track(task) { this.operations.add(task); task.catch(() => {}).finally(() => this.operations.delete(task)); return task; }
  async start() {
    if (this.closed) throw fail('Agent conversation service is closed', 'ERR_AGENT_CLOSED');
    if (this.starting) return this.starting;
    this.boundNode = this.node;
    if (!this.boundNode?.handle) throw fail('Agent network is not connected', 'ERR_AGENT_UNREACHABLE');
    if (owners.has(this.node)) throw fail('This network already owns an agent conversation service', 'ERR_AGENT_OWNER_BUSY');
    this.startedScope = JSON.stringify(this.scope); owners.set(this.node, this);
    this.starting = (async () => {
      this.registered = true; // A partially failing registration must still be cleaned up.
      try {
        await this.node.handle(AGENT_CONVERSATION_PROTOCOL, (stream, connection) => {
          if (this.closed || this.operations.size >= 40 || !encryptedConnection(connection)) {
            stream.abort(fail('Encrypted agent connection required', 'ERR_AGENT_AUTH')); return;
          }
          this._track(this._handle(stream, connection));
        }, { maxInboundStreams: 4, maxOutboundStreams: 4, runOnLimitedConnection: true });
        if (this.closed) return this;
        this.started = true;
        this.node.addEventListener('peer:disconnect', this.disconnect);
        this.timer = setInterval(() => { this._publish(); void this.refresh().catch(() => {}); }, L.refreshMs);
        this.timer.unref?.();
        void this.refresh().catch(() => {});
        return this;
      } catch (error) {
        try { await this.node.unhandle(AGENT_CONVERSATION_PROTOCOL); this.registered = false; owners.delete(this.node); }
        catch (cleanup) { throw new AggregateError([error, cleanup], 'Agent protocol startup and cleanup failed'); }
        throw error;
      }
    })();
    return this.starting;
  }
  _envelope(type, recipient, extra = {}) { return { type, sender: this.peerId, recipient, scope: this.scope, worldId: this.worldId, ...extra }; }
  _check(value, peerId) {
    this._active();
    if (value?.sender !== peerId || value.recipient !== this.peerId || value.worldId !== this.worldId
        || ['gameId', 'roomId', 'topologyId'].some((key) => value.scope?.[key] !== this.scope[key])) throw fail('Agent connection identity or world scope mismatch', 'ERR_AGENT_SCOPE');
  }
  async _local(signal) {
    const records = await withAbort(this.listLocalAgents(), signal);
    if (!Array.isArray(records) || records.length > WORLD_AGENT_LIMITS.agents) throw fail('Agent directory exceeds its bound');
    const result = records.map(normalizePublicAgent);
    if (new Set(result.map((entry) => entry.agentId)).size !== result.length) throw fail('Duplicate public agent');
    return result;
  }
  _directory() {
    const result = [];
    for (const [ownerPeerId, record] of this.records) {
      if (this.now() - record.at >= L.recordTtlMs) { this.records.delete(ownerPeerId); continue; }
      result.push(...record.agents.map((agent) => ({ ...agent, position: [...agent.position], ownerPeerId })));
    }
    return result;
  }
  _publish() {
    const records = this._directory();
    try { Promise.resolve(this.onDirectory(records)).catch(() => {}); } catch { /* Observers cannot change protocol state. */ }
    return records;
  }
  _connections(peerId) {
    return this.node.getConnections().filter((entry) => encryptedConnection(entry) && entry.remotePeer.toString() === peerId)
      .sort((a, b) => Number(b.encryption === 'native') - Number(a.encryption === 'native'));
  }
  async _open(peerId, signal) {
    signal.throwIfAborted(); this._active();
    let connections = this._connections(peerId);
    if (!connections.length && this.manager.peers?.has(peerId) && this.manager._maybeDialPeer) {
      // The normal dial policy can return while another dial is still pending.
      // Wait for its authenticated connection without forcing a second dial.
      await waitForPeerConnection({ node: this.node, peerId, signal, timeoutMs: this.queryTimeoutMs,
        dial: () => this.manager._maybeDialPeer(peerId, 'world-agents'),
        assertAllowed: () => {
          this._active();
          const peer = this.manager.peers?.get(peerId);
          if (!peer || ['gameId', 'roomId', 'topologyId'].some((key) => peer[key] !== this.scope[key])) {
            throw fail('Agent owner left this world network scope', 'ERR_AGENT_SCOPE');
          }
        }
      });
      signal.throwIfAborted(); this._active();
      connections = this._connections(peerId);
    }
    const errors = [];
    for (const connection of connections.slice(0, 4)) {
      signal.throwIfAborted(); this._active();
      const op = operation([signal, this.controller.signal], Math.min(2000, this.queryTimeoutMs));
      let opening;
      try {
        opening = Promise.resolve(connection.newStream(AGENT_CONVERSATION_PROTOCOL, { signal: op.signal, runOnLimitedConnection: true }));
        const stream = await withAbort(opening, op.signal); op.signal.throwIfAborted(); this._active();
        return { stream, connection };
      } catch (error) {
        opening?.then((late) => late.abort(asError(error)), () => {}).catch(() => {});
        signal.throwIfAborted(); this.controller.signal.throwIfAborted(); errors.push(asError(error));
      } finally { op.dispose(); }
    }
    throw Object.assign(new AggregateError(errors, 'No authenticated stream to this agent owner', { cause: errors.at(-1) }), { code: 'ERR_AGENT_UNREACHABLE' });
  }
  _entry(peerId, signal, timeout) {
    const entry = { peerId, op: operation([this.controller.signal, signal], timeout) };
    this.pending.add(entry); return entry;
  }
  _finish(entry) { entry.op.dispose(); this.pending.delete(entry); }
  async _query(peerId, signal) {
    const entry = this._entry(peerId, signal, this.queryTimeoutMs), { op } = entry;
    let stream; const abort = () => stream?.abort(reason(op.signal));
    op.signal.addEventListener('abort', abort, { once: true });
    try {
      ({ stream } = await this._open(peerId, op.signal)); const io = channel(stream);
      await io.write(this._envelope('query', peerId), op.signal);
      const data = await io.read(op.signal); this._check(data, peerId);
      if (data.type === 'error') throw fail(String(data.message).slice(0, 256), data.code);
      if (data.type !== 'directory' || !Array.isArray(data.agents) || data.agents.length > WORLD_AGENT_LIMITS.agents) throw fail('Invalid agent directory');
      const agents = data.agents.map(normalizePublicAgent);
      if (new Set(agents.map((agent) => agent.agentId)).size !== agents.length) throw fail('Duplicate public agent');
      if (!this.records.has(peerId) && this.records.size >= L.maximumPeers) this.records.delete(this.records.keys().next().value);
      this.records.set(peerId, { agents, at: this.now() });
      await stream.close({ signal: op.signal });
    } catch (error) { this.records.delete(peerId); stream?.abort(asError(error)); throw error; }
    finally { op.signal.removeEventListener('abort', abort); this._finish(entry); }
  }
  refresh({ signal } = {}) {
    this._active();
    if (this.refreshing) return withAbort(this.refreshing, signal ?? this.controller.signal);
    const run = async () => {
      const op = operation([this.controller.signal, signal], this.queryTimeoutMs * 2 + 100);
      try {
        const peers = [...new Set([...this.node.getConnections().map((entry) => entry.remotePeer.toString()),
          ...(this.manager.peers?.keys() ?? [])])].filter((id) => id !== this.peerId && !this.manager.bootstrapPeerIds?.has(id)).slice(0, L.maximumPeers);
        const results = await Promise.allSettled(peers.map((id) => this._query(id, op.signal)));
        op.signal.throwIfAborted();
        this.lastErrors = results.flatMap((result, index) => result.status === 'rejected'
          ? [{ peerId: peers[index], code: String(result.reason?.code ?? 'ERR_AGENT_DIRECTORY').slice(0, 80),
            message: String(result.reason?.message ?? 'Agent directory unavailable').slice(0, 256) }] : []);
        return this._publish();
      } finally { op.dispose(); }
    };
    this.refreshing = this._track(run().finally(() => { this.refreshing = null; }));
    return this.refreshing;
  }
  _busy(peerId) {
    const entries = [...this.inbound.values(), ...this.outbound.values()];
    return entries.length >= L.maximumRequests || entries.filter((entry) => entry.peerId === peerId).length >= L.maximumPerPeer;
  }
  async _handle(stream, connection) {
    const peerId = connection.remotePeer.toString(), entry = this._entry(peerId, null, this.requestTimeoutMs), { op } = entry;
    const io = channel(stream); let request, key, monitor, run, receiptResolve, receiptReject, sendingResult = false;
    const abort = () => stream.abort(reason(op.signal)); op.signal.addEventListener('abort', abort, { once: true });
    try {
      const first = operation([op.signal], this.queryTimeoutMs);
      try { request = await io.read(first.signal); } finally { first.dispose(); }
      this._check(request, peerId);
      if (request.type === 'query') {
        fields(request, envelopeFields);
        const query = operation([op.signal], this.queryTimeoutMs);
        try { await io.write(this._envelope('directory', peerId, { agents: await this._local(query.signal) }), query.signal);
          await stream.close({ signal: query.signal }); } finally { query.dispose(); }
        return;
      }
      fields(request, [...envelopeFields, 'requestId', 'agentId', 'prompt']);
      if (request.type !== 'request') throw fail('Unknown agent conversation operation');
      agentIdentifier(request.requestId); agentIdentifier(request.agentId); prompt(request.prompt);
      for (const [id, at] of this.seen) if (this.now() - at >= L.requestTimeoutMs) this.seen.delete(id);
      const candidate = `${peerId}:${request.requestId}`;
      if (this.seen.has(candidate)) throw fail('Agent request was already received', 'ERR_AGENT_REPLAY');
      if (this._busy(peerId) || this.seen.size >= L.replayEntries
          || [...this.inbound.values()].some((item) => item.agentId === request.agentId)) throw fail('Agent owner is busy; wait for the current request', 'ERR_AGENT_BUSY');
      key = candidate; entry.agentId = request.agentId; this.inbound.set(key, entry); this.seen.set(key, this.now());
      const local = await this._local(op.signal);
      if (!local.some((agent) => agent.agentId === request.agentId)) throw fail('Agent is no longer shared by this owner', 'ERR_AGENT_NOT_SHARED');
      await io.write(this._envelope('accepted', peerId, { requestId: request.requestId }), op.signal);
      const receipt = new Promise((resolve, reject) => { receiptResolve = resolve; receiptReject = reject; }); receipt.catch(() => {});
      monitor = (async () => {
        try {
          const control = await io.read(op.signal); this._check(control, peerId);
          fields(control, [...envelopeFields, 'requestId']);
          if (control.requestId !== request.requestId) throw fail('Agent control request mismatch');
          if (control.type === 'cancel') throw new DOMException('Requester cancelled the agent conversation', 'AbortError');
          if (control.type !== 'received' || !sendingResult) throw fail('Unexpected agent control');
          receiptResolve();
        } catch (error) { receiptReject(error); op.controller.abort(asError(error)); }
      })();
      // The application derives conversation history/channel and rechecks the shared binding.
      op.signal.throwIfAborted();
      run = Promise.resolve(this.respond({ agentId: request.agentId, prompt: request.prompt,
        requesterPeerId: peerId, signal: op.signal }));
      const result = reply(await withAbort(run, op.signal)); op.signal.throwIfAborted();
      const body = encoder.encode(result.text); sendingResult = true;
      await io.write(this._envelope('result', peerId, { requestId: request.requestId,
        byteLength: body.length, finishReason: result.finishReason }), op.signal);
      if (body.length) await io.rpc.write(body, { signal: op.signal });
      await withAbort(receipt, op.signal);
      await stream.close({ signal: op.signal });
    } catch (cause) {
      const error = asError(cause);
      if (!op.signal.aborted) {
        try { await io.write(this._envelope('error', peerId, { requestId: request?.requestId,
          code: String(error.code ?? 'ERR_AGENT_CONVERSATION').slice(0, 80), message: String(error.message).slice(0, 256) }), op.signal);
          await stream.close({ signal: op.signal }); } catch { stream.abort(error); }
      } else stream.abort(error);
    } finally {
      op.signal.removeEventListener('abort', abort); op.controller.abort(fail('Agent stream finished'));
      await monitor?.catch(() => {});
      // Keep owner admission counted until its cancellation/cleanup actually settles.
      await run?.catch(() => {});
      if (key) this.inbound.delete(key); this._finish(entry);
    }
  }
  request(ownerPeerId, input, { signal } = {}) {
    this._active(); agentIdentifier(ownerPeerId, 'owner peer'); fields(input, ['agentId', 'prompt']);
    const agentId = agentIdentifier(input.agentId), text = prompt(input.prompt), requestId = crypto.randomUUID();
    if (ownerPeerId === this.peerId) throw fail('Local agents must use their owner directly');
    if (this._busy(ownerPeerId)) throw fail('Agent conversation queue is full', 'ERR_AGENT_BUSY');
    const entry = this._entry(ownerPeerId, signal, this.requestTimeoutMs), { op } = entry;
    this.outbound.set(requestId, entry);
    const task = (async () => {
      let stream, committed = false; const abort = () => stream?.abort(reason(op.signal));
      op.signal.addEventListener('abort', abort, { once: true });
      try {
        ({ stream } = await this._open(ownerPeerId, op.signal)); const io = channel(stream);
        committed = true; // A failed write can still have delivered the prompt. Never replay it.
        await io.write(this._envelope('request', ownerPeerId, { requestId, agentId, prompt: text }), op.signal);
        let accepted = false;
        for (;;) {
          const response = await io.read(op.signal); this._check(response, ownerPeerId);
          if (response.requestId !== requestId) throw fail('Agent reply request mismatch');
          if (response.type === 'error') throw fail(String(response.message).slice(0, 256), String(response.code).slice(0, 80));
          if (response.type === 'accepted' && !accepted) { accepted = true; continue; }
          if (!accepted || response.type !== 'result') throw fail('Unexpected agent reply');
          const length = bounded(response.byteLength, WORLD_AGENT_LIMITS.replyBytes, 0);
          const body = length ? (await io.rpc.read({ signal: op.signal })).subarray() : new Uint8Array();
          if (body.length !== length) throw fail('Agent reply byte length mismatch');
          const result = reply({ text: decoder.decode(body), finishReason: response.finishReason });
          await io.write(this._envelope('received', ownerPeerId, { requestId }), op.signal);
          await stream.close({ signal: op.signal });
          return { ...result, ownerPeerId, agentId, requestId };
        }
      } catch (cause) { const error = asError(cause); stream?.abort(error); error.committed = committed; error.requestId = requestId; throw error; }
      finally { op.signal.removeEventListener('abort', abort); this.outbound.delete(requestId); this._finish(entry); }
    })();
    return this._track(task);
  }
  async close() {
    if (this.closing) return this.closing;
    this.closed = true; clearInterval(this.timer);
    this.controller.abort(fail('Agent conversation service closed', 'ERR_AGENT_CLOSED'));
    this.closing = (async () => {
      await this.starting?.catch(() => {});
      let error;
      try { if (this.registered) await this.node.unhandle(AGENT_CONVERSATION_PROTOCOL); this.registered = false; }
      catch (cause) { error = cause; }
      this.node?.removeEventListener('peer:disconnect', this.disconnect);
      await Promise.allSettled([...this.operations]);
      this.records.clear(); this._publish();
      if (error) throw error;
      if (owners.get(this.node) === this) owners.delete(this.node);
      this.started = false;
    })().catch((error) => { this.closing = null; throw error; });
    return this.closing;
  }
}
