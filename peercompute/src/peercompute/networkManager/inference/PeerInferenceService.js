import { MODEL_POLICY } from '../../inference/modelManifest.js';
import { PEER_INFERENCE_PROTOCOL, PEER_INFERENCE_PROTOCOL_V2, isSpeechTask, PEER_INFERENCE_LIMITS as LIMITS, LEGACY_MAX_NEW_TOKENS, bytes, cid, integer,
  encryptedConnection, localState, generation, resultData, diffusionProgress, channel } from './protocol.js';
import { monitorResultControls, describeResultImage, writeResultImage, readResultImage } from './imageResult.js';
import { describeAudio, writeInputAudio, readInputAudio, writeResultAudio, readResultAudio } from './audioFrames.js';

const failure = (message, code = 'ERR_PEER_INFERENCE') => Object.assign(new Error(message), { code });
const asError = (error) => error instanceof Error ? error : failure(String(error ?? 'Peer inference failed'));
const aborted = (signal) => signal.reason instanceof Error ? signal.reason : new DOMException('Inference cancelled', 'AbortError');
const transportOpenFailure = (error) => error?.code === 'ERR_INFERENCE_DEADLINE'
  || ['TimeoutError', 'ConnectionClosedError', 'StreamResetError', 'StreamStateError'].includes(error?.name);
const transportRecoveryAllowed = (errors) => errors.some(transportOpenFailure)
  && !errors.some((error) => ['UnsupportedProtocolError', 'TooManyOutboundProtocolStreamsError', 'TooManyInboundProtocolStreamsError',
    'LimitedConnectionError', 'InvalidParametersError'].includes(error?.name));
function operation(signals, timeout) {
  const controller = new AbortController();
  const listeners = signals.filter(Boolean).map((signal) => {
    const abort = () => controller.abort(aborted(signal));
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    return () => signal.removeEventListener('abort', abort);
  });
  const timer = setTimeout(() => controller.abort(failure('Peer inference deadline exceeded', 'ERR_INFERENCE_DEADLINE')), timeout);
  timer.unref?.();
  return { controller, signal: controller.signal, dispose() { clearTimeout(timer); listeners.forEach((remove) => remove()); } };
}
function withAbort(promise, signal) {
  if (signal.aborted) {
    // A synchronous token callback can abort while an async host callback is
    // producing its rejected promise. Consume that rejection before returning.
    Promise.resolve(promise).catch(() => {});
    throw aborted(signal);
  }
  return new Promise((resolve, reject) => {
    const abort = () => reject(aborted(signal));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

/** Private application streams. The injected callback can use an already loaded
 * ModelInferenceService; this protocol has no model loading or executable input. */
export class PeerInferenceService {
  constructor(manager, { owner = Symbol('peer-inference-owner'), getLocalState, generate,
    queryTimeoutMs = LIMITS.queryTimeoutMs, requestTimeoutMs = LIMITS.requestTimeoutMs,
    maximumPeers = LIMITS.maximumPeers } = {}) {
    if (typeof getLocalState !== 'function' || typeof generate !== 'function') throw new Error('Peer inference callbacks are required');
    this.manager = manager; this.owner = owner;
    this.getLocalState = getLocalState; this.generateLocal = generate;
    this.queryTimeoutMs = integer(queryTimeoutMs, 15000, 100);
    this.requestTimeoutMs = integer(requestTimeoutMs, 300000, 100);
    this.maximumPeers = integer(maximumPeers, LIMITS.maximumPeers, 1);
    this.controller = new AbortController(); this.records = new Map();
    this.inbound = new Map(); this.outbound = new Map(); this.operations = new Set();
    this.hostingEnabled = true; this.closed = false; this.refreshing = null;
    this.models = []; this.hosts = []; this.lastErrors = [];
    this.failedConnections = new WeakMap(); this.recoveries = new Map();
    this.disconnectListener = (event) => {
      const peerId = event.detail.toString(); this.records.delete(peerId); this._group();
      for (const item of [...this.inbound.values(), ...this.outbound.values()]) {
        if (item.peerId === peerId) item.controller.abort(failure('Inference peer disconnected', 'ERR_INFERENCE_DISCONNECTED'));
      }
    };
  }

  get peerId() { return this.manager.libp2p.peerId.toString(); }
  get scope() { const { gameId, roomId, topologyId } = this.manager.config; return { gameId, roomId, topologyId }; }
  async start() {
    for (const protocol of [PEER_INFERENCE_PROTOCOL, PEER_INFERENCE_PROTOCOL_V2]) await this.manager.libp2p.handle(protocol, (stream, connection) => {
      if (this.closed || this.operations.size >= 40 || !encryptedConnection(connection)) {
        stream.abort(failure('Encrypted peer inference connection required')); return;
      }
      const task = this._handle(stream, connection, protocol);
      this.operations.add(task); task.catch(() => {}).finally(() => this.operations.delete(task));
    }, { maxInboundStreams: 4, maxOutboundStreams: 4, runOnLimitedConnection: true });
    this.manager.libp2p.addEventListener('peer:disconnect', this.disconnectListener);
    return this;
  }
  _envelope(type, peerId, extra = {}) {
    return { type, scope: this.scope, sender: this.peerId, recipient: peerId, ...extra };
  }
  _checkEnvelope(value, peerId) {
    if (!value || value.sender !== peerId || value.recipient !== this.peerId
        || ['gameId', 'roomId', 'topologyId'].some((key) => value.scope?.[key] !== this.scope[key])) {
      throw failure('Peer inference identity or scope mismatch');
    }
  }
  async _state(signal, ownReservation = 0, manifestCid, statePromise) {
    const state = localState(await withAbort(statePromise ?? this.getLocalState({ signal }), signal), this.hostingEnabled,
      { defaultMaxNewTokens: MODEL_POLICY.maxNewTokens });
    // The application reports local work as well. Inbound work is also busy
    // during upload/admission so simultaneous requestors do not see false idle.
    for (const host of state.hostedModels) {
      const pending = [...this.inbound.values()].filter((entry) => entry.manifestCid === host.manifestCid).length;
      if (pending > (host.manifestCid === manifestCid ? ownReservation : 0)) { host.busy = true; host.idleForMs = 0; }
    }
    if (this.inbound.size > ownReservation) { state.busy = true; state.idleForMs = 0; }
    return state;
  }
  /** Public operational summary of this node's advertised hosts; never queries peers. */
  async getTelemetrySummary({ signal = this.controller.signal } = {}) {
    if (this.closed || !this.hostingEnabled) return [];
    // A broken application callback must not accumulate one pending read every
    // telemetry tick, even when it ignores cancellation.
    if (this.telemetryStatePending) throw new Error('Local hosted-model telemetry read is still pending');
    const pending = Promise.resolve().then(() => this.getLocalState({ signal }));
    this.telemetryStatePending = pending;
    const clear = () => { if (this.telemetryStatePending === pending) this.telemetryStatePending = null; };
    pending.then(clear, clear);
    const state = await this._state(signal, 0, undefined, this.telemetryStatePending);
    if (this.closed || !this.hostingEnabled || signal.aborted) return [];
    return state.hostedModels.map(({ manifestCid, name, task, runtime, modalities, busy }) =>
      ({ manifestCid, name, task, runtime, modalities, busy }));
  }
  setHostingEnabled(enabled) {
    this.hostingEnabled = Boolean(enabled);
    if (!this.hostingEnabled) for (const entry of this.inbound.values()) {
      entry.controller.abort(failure('Peer inference hosting disabled', 'ERR_INFERENCE_HOST_DISABLED'));
    }
    this.records.delete(this.peerId); this._group();
  }
  /** Stop this model's private streams. The caller removes it from getLocalState
   * first and separately awaits its managed worker's cancellation/unload. */
  async cancelHostedModel(manifestCid) {
    manifestCid = cid(manifestCid);
    const entries = [...this.inbound.values()].filter((entry) => entry.manifestCid === manifestCid);
    for (const entry of entries) entry.controller.abort(failure('Hosted model is unloading', 'ERR_INFERENCE_HOST_DISABLED'));
    await Promise.allSettled(entries.map((entry) => entry.finished));
    this.records.delete(this.peerId); this._group();
    return entries.length;
  }
  _remember(peerId, state, protocol = PEER_INFERENCE_PROTOCOL) {
    this.records.set(peerId, { state, protocol, receivedAt: Date.now() });
  }
  _group() {
    const models = new Map(); const hosts = new Map(); const now = Date.now();
    for (const [peerId, record] of this.records) {
      if (now - record.receivedAt > LIMITS.recordTtlMs) { this.records.delete(peerId); continue; }
      const { state } = record; const local = peerId === this.peerId;
      for (const model of state.sharedModels) {
        if (!models.has(model.manifestCid)) models.set(model.manifestCid, { ...model, providers: [] });
        models.get(model.manifestCid).providers.push({ peerId, local });
      }
      for (const hosted of state.hostedModels ?? (state.hostedModel ? [{ ...state.hostedModel,
        busy: state.busy, idleForMs: state.idleForMs, queuedRequests: state.queuedRequests }] : [])) {
        const { maxNewTokens, busy, idleForMs, queuedRequests, queueCapacity, queueAvailable, ...model } = hosted;
        if (!hosts.has(model.manifestCid)) hosts.set(model.manifestCid, { ...model, hosts: [] });
        hosts.get(model.manifestCid).hosts.push({ peerId, local, busy,
          idleForMs: busy ? 0 : idleForMs, queuedRequests, queueCapacity, queueAvailable, maxNewTokens, protocol: record.protocol });
      }
    }
    this.models = [...models.values()]; this.hosts = [...hosts.values()];
  }
  listModels() { this._group(); return structuredClone(this.models); }
  listHosts() { this._group(); return structuredClone(this.hosts); }
  _connections(peerId) {
    return this.manager.libp2p.getConnections()
      .filter((item) => item.remotePeer.toString() === peerId && encryptedConnection(item))
      .sort((a, b) => {
        const score = (item) => (item.encryption === 'native' ? 3
          : item.remoteAddr?.getComponents?.().some(({ name }) => name === 'p2p-circuit') ? 1 : 2)
          - ((this.failedConnections.get(item) ?? 0) > Date.now() ? 10 : 0);
        return score(b) - score(a);
      });
  }
  async _connection(peerId, signal) {
    signal.throwIfAborted();
    const best = () => this._connections(peerId)[0];
    let connection = best();
    if (!connection && this.manager.peers?.has(peerId)) {
      // A missing link needs the same bounded relay repair as a stalled link.
      // Try it before normal WebRTC dialing can consume the directory deadline
      // and its dial throttle. The manager still enforces scope, capacity,
      // backoff and cancellation; no application header has been sent yet.
      if (this.manager.recoverPeerInferenceConnection) {
        try { await withAbort(this._recoverConnection(peerId), signal); }
        catch { signal.throwIfAborted(); this.controller.signal.throwIfAborted(); }
        connection = best();
      }
      // Respect the manager's normal logical capacity, relay and dial backoff.
      if (!connection) {
        await withAbort(this.manager._maybeDialPeer(peerId, 'peer-inference'), signal);
        connection = best();
      }
    }
    if (!connection) throw failure('No authenticated encrypted connection to inference peer', 'ERR_INFERENCE_UNREACHABLE');
    return connection;
  }
  _recoverConnection(peerId) {
    if (this.recoveries.has(peerId)) return this.recoveries.get(peerId);
    const promise = this.manager.recoverPeerInferenceConnection(peerId, { signal: this.controller.signal });
    this.recoveries.set(peerId, promise); this.operations.add(promise);
    const finish = () => { this.operations.delete(promise); if (this.recoveries.get(peerId) === promise) this.recoveries.delete(peerId); };
    promise.then(finish, finish);
    return promise;
  }
  async _openStream(peerId, signal, { audio = false, backgroundRecovery = false } = {}) {
    const first = await this._connection(peerId, signal);
    const candidates = [...new Set([first, ...this._connections(peerId)])].slice(0, 4);
    const errors = [];
    let recoveryError;
    const attempt = async (connection) => {
      signal.throwIfAborted();
      if (connection.remotePeer.toString() !== peerId || !encryptedConnection(connection)) throw failure('Invalid recovered inference connection');
      // Limit stream negotiation, independently of the much longer generation
      // deadline. Never retry after any application header or prompt is written.
      const op = operation([this.controller.signal, signal], Math.min(2000, this.queryTimeoutMs / 2));
      let opening;
      try {
        opening = Promise.resolve(connection.newStream(audio ? PEER_INFERENCE_PROTOCOL : [PEER_INFERENCE_PROTOCOL, PEER_INFERENCE_PROTOCOL_V2],
          { signal: op.signal, runOnLimitedConnection: true }));
        const stream = await withAbort(opening, op.signal);
        op.signal.throwIfAborted();
        const release = this.manager.retainPeerInferenceConnection?.(connection, { timeoutMs: this.requestTimeoutMs + 1000 });
        this.failedConnections.delete(connection);
        return { connection, stream, release, protocol: stream.protocol ?? PEER_INFERENCE_PROTOCOL };
      } catch (cause) {
        const error = asError(cause);
        // A transport that completes after its deadline must not leak a stream.
        opening?.then((late) => late.abort(error), () => {}).catch(() => {});
        if (transportOpenFailure(error)) this.failedConnections.set(connection, Date.now() + 15000);
        errors.push(error);
        throw error;
      } finally { op.dispose(); }
    };
    try {
      for (const connection of candidates) {
        try { return await attempt(connection); }
        catch { signal.throwIfAborted(); this.controller.signal.throwIfAborted(); }
      }
    } catch (error) {
      // A directory's short deadline may expire while normal links are stale.
      // Finish one tracked repair for the next poll, without sending any data.
      if (backgroundRecovery && signal.reason?.code === 'ERR_INFERENCE_DEADLINE'
          && transportRecoveryAllowed(errors) && !this.controller.signal.aborted
          && this.manager.recoverPeerInferenceConnection) this._recoverConnection(peerId).catch(() => {});
      throw error;
    }
    if (transportRecoveryAllowed(errors) && this.manager.recoverPeerInferenceConnection) {
      try {
        const connection = await withAbort(this._recoverConnection(peerId), signal);
        signal.throwIfAborted();
        return await attempt(connection);
      } catch (error) {
        signal.throwIfAborted(); this.controller.signal.throwIfAborted();
        recoveryError = asError(error);
      }
    }
    throw Object.assign(new AggregateError(errors,
      `Unable to open an encrypted inference stream: ${String(errors.at(-1)?.message ?? 'connections closed').slice(0, 160)}`,
      { cause: errors.at(-1) }), { code: 'ERR_INFERENCE_STREAM_UNAVAILABLE', peerId, recoveryError });
  }
  async _closeCompletedStream(stream, signal) {
    // The authenticated directory or complete result has already been checked.
    // A FIN/close failure cannot invalidate it, or justify another generation.
    // Still bound cleanup even when a transport ignores its abort signal.
    const op = operation([this.controller.signal, signal], Math.min(1000, this.queryTimeoutMs / 2));
    try {
      await withAbort(Promise.resolve().then(() => stream.close({ signal: op.signal })), op.signal);
    } catch (cause) {
      try { Promise.resolve(stream.abort(asError(cause))).catch(() => {}); } catch { /* Best-effort transport cleanup. */ }
      // Caller/service cancellation and the original operation deadline retain
      // priority. Only this final stream-cleanup failure is non-fatal.
      this.controller.signal.throwIfAborted(); signal.throwIfAborted();
    } finally { op.dispose(); }
    this.controller.signal.throwIfAborted(); signal.throwIfAborted();
  }
  async _query(peerId, signal) {
    const op = operation([this.controller.signal, signal], this.queryTimeoutMs);
    let stream, release;
    const abort = () => stream?.abort(aborted(op.signal));
    op.signal.addEventListener('abort', abort, { once: true });
    try {
      let protocol;
      ({ stream, protocol, release } = await this._openStream(peerId, op.signal, { backgroundRecovery: true }));
      const io = channel(stream);
      await io.write(this._envelope('query', peerId), op.signal);
      const response = await io.read(op.signal);
      if (response?.type === 'error') {
        // Legacy v2 error frames have no envelope. They are only failures from
        // this already authenticated, explicitly queried stream, never directory
        // data. A partial or complete envelope must still pass every check.
        if (['sender', 'recipient', 'scope'].some((key) => Object.hasOwn(response, key))) this._checkEnvelope(response, peerId);
        if (typeof response.message !== 'string' || (response.code !== undefined && typeof response.code !== 'string')) {
          throw failure('Invalid inference directory error response', 'ERR_INFERENCE_DIRECTORY_INVALID');
        }
        throw failure(response.message.slice(0, 256) || 'Peer inference directory unavailable',
          response.code?.slice(0, 80) || 'ERR_PEER_INFERENCE');
      }
      this._checkEnvelope(response, peerId);
      if (response.type !== 'directory') throw failure('Invalid inference directory response');
      this._remember(peerId, localState(response.state, true, { protocol }), protocol);
      await this._closeCompletedStream(stream, op.signal);
    } catch (error) { this.records.delete(peerId); stream?.abort(error); throw error; }
    finally { release?.(); op.signal.removeEventListener('abort', abort); op.dispose(); }
  }
  async refresh({ signal } = {}) {
    if (this.closed) throw failure('Peer inference service is stopped');
    if (this.refreshing) return withAbort(this.refreshing, signal ?? this.controller.signal);
    const run = async () => {
      const op = operation([this.controller.signal, signal], this.queryTimeoutMs * 2 + 100);
      try {
        this._remember(this.peerId, await this._state(op.signal));
        const peers = [...new Set([...this.manager.libp2p.getConnections().map((item) => item.remotePeer.toString()),
          ...(this.manager.peers?.keys() ?? [])])].filter((id) => id !== this.peerId && !this.manager.bootstrapPeerIds?.has(id)).slice(0, this.maximumPeers);
        const results = await Promise.allSettled(peers.map((peerId) => this._query(peerId, op.signal)));
        op.signal.throwIfAborted();
        this.lastErrors = results.flatMap((result, index) => result.status === 'rejected'
          ? [{ peerId: peers[index], code: String(result.reason?.code ?? 'ERR_PEER_INFERENCE').slice(0, 80),
            message: String(result.reason?.message ?? 'Directory unavailable').slice(0, 256) }] : []);
        return { models: this.listModels(), hosts: this.listHosts(), errors: structuredClone(this.lastErrors) };
      } finally { op.dispose(); }
    };
    this.refreshing = run(); this.operations.add(this.refreshing);
    try { return await this.refreshing; } finally { this.operations.delete(this.refreshing); this.refreshing = null; }
  }

  async _handle(stream, connection, protocol = PEER_INFERENCE_PROTOCOL) {
    const peerId = connection.remotePeer.toString();
    const op = operation([this.controller.signal], this.requestTimeoutMs);
    const abort = () => stream.abort(aborted(op.signal));
    op.signal.addEventListener('abort', abort, { once: true });
    const io = channel(stream); let key; let monitor; let request;
    let resolveFinished;
    const finished = new Promise((resolve) => { resolveFinished = resolve; });
    let release;
    try {
      release = this.manager.retainPeerInferenceConnection?.(connection, { timeoutMs: this.requestTimeoutMs + 1000 });
      const first = operation([op.signal], this.queryTimeoutMs);
      try { request = await io.read(first.signal); } finally { first.dispose(); }
      this._checkEnvelope(request, peerId);
      if (request.type === 'query') {
        const state = await this._state(op.signal);
        await io.write(this._envelope('directory', peerId, { state: protocol === PEER_INFERENCE_PROTOCOL_V2
          ? localState(state, this.hostingEnabled, { protocol }) : state }), op.signal);
        await this._closeCompletedStream(stream, op.signal); return;
      }
      if (request.type !== 'generate') throw failure('Unknown inference request');
      const input = generation(request);
      if (protocol === PEER_INFERENCE_PROTOCOL_V2 && isSpeechTask(input.task)) throw failure('Speech requires inference protocol v3');
      key = `${peerId}:${input.requestId}`;
      if (this.inbound.has(key) || this.inbound.size >= LIMITS.maximumInbound
          || [...this.inbound.values()].filter((entry) => entry.peerId === peerId).length >= LIMITS.maximumPerPeer) {
        key = null; throw failure('Peer inference queue is full', 'ERR_INFERENCE_BUSY');
      }
      // Reserve before awaiting application state: concurrent uploads cannot
      // all pass a stale capacity check while the callback is suspended.
      this.inbound.set(key, { peerId, manifestCid: input.manifestCid, controller: op.controller, finished });
      const selectedHost = (state) => protocol === PEER_INFERENCE_PROTOCOL_V2
        ? (state.hostedModel?.manifestCid === input.manifestCid ? state.hostedModel : null)
        : state.hostedModels.find((host) => host.manifestCid === input.manifestCid);
      const state = await this._state(op.signal, 1, input.manifestCid), hosted = selectedHost(state);
      if (!hosted) throw failure('Requested model is not hosted', 'ERR_INFERENCE_NOT_HOSTED');
      if (input.maxNewTokens > hosted.maxNewTokens) throw failure('Requested token limit exceeds hosted capacity', 'ERR_INFERENCE_TOKEN_LIMIT');
      if (input.task !== undefined && input.task !== hosted.task) throw failure('Requested task does not match hosted model');
      input.task = hosted.task;
      if (hosted.queueAvailable === false || (hosted.busy && hosted.queuedRequests >= hosted.queueCapacity)) throw failure('Hosted model queue is full', 'ERR_INFERENCE_BUSY');
      generation(input); // Validate task-dependent input before admitting an upload.
      if (input.image && !hosted.modalities.includes('image')) throw failure('Hosted model does not accept images');
      await io.write({ type: 'upload', requestId: input.requestId }, op.signal);
      if (input.image) {
        input.image.data = new Uint8Array(input.image.width * input.image.height * 4);
        let offset = 0;
        while (offset < input.image.data.length) {
          const frame = await io.rpc.read({ signal: op.signal });
          if (!frame.byteLength || frame.byteLength > LIMITS.imageChunkBytes || frame.byteLength > input.image.data.length - offset) throw failure('Invalid image transfer frame');
          input.image.data.set(frame.subarray(), offset); offset += frame.byteLength;
          // Explicit upload credits prevent a sender buffering the whole image in the receiver stream.
          await io.write({ type: 'image-credit', offset }, op.signal);
        }
      }
      if (input.audio) input.audio = await readInputAudio(io, { audio: input.audio, requestId: input.requestId, signal: op.signal });
      const current = selectedHost(await this._state(op.signal, 1, input.manifestCid));
      if (!current || current.task !== hosted.task) throw failure('Inference host changed during upload');
      if (input.maxNewTokens > current.maxNewTokens) throw failure('Requested token limit exceeds hosted capacity', 'ERR_INFERENCE_TOKEN_LIMIT');
      if (current.queueAvailable === false || (current.busy && current.queuedRequests >= current.queueCapacity)) throw failure('Hosted model queue is full', 'ERR_INFERENCE_BUSY');
      await io.write({ type: 'accepted', requestId: input.requestId, queued: current.busy }, op.signal);
      // No work can start merely because our admission reply was sent. A lost
      // reply is safely retryable until the caller commits with this start ack.
      const start = await io.read(op.signal);
      if (start.type !== 'start' || start.requestId !== input.requestId) throw failure('Missing inference start acknowledgement');
      const controls = monitorResultControls(io, input.requestId, op.controller);
      monitor = controls.task;
      let written = Promise.resolve(); let totalBytes = 0; let sequence = 0; let pendingBytes = 0;
      const maximumOutputBytes = input.task === 'automatic-speech-recognition' ? 8192 : MODEL_POLICY.maxOutputBytes;
      const onToken = (text) => {
        op.signal.throwIfAborted();
        if (typeof text !== 'string') throw failure('Invalid host token');
        if (!text.length) return;
        totalBytes += bytes(text); pendingBytes += bytes(text) + 128;
        if (totalBytes > maximumOutputBytes || pendingBytes > maximumOutputBytes + 8192
            || sequence >= 4096) {
          const error = failure('Inference token consumer exceeded its bounded output queue');
          op.controller.abort(error); throw error;
        }
        const frame = { type: 'token', requestId: input.requestId, sequence: sequence++, text };
        written = written.then(() => io.write(frame, op.signal)).then(() => { pendingBytes -= bytes(text) + 128; });
        written.catch((error) => op.controller.abort(error));
      };
      let progressFrames = 0;
      const onProgress = (event) => {
        if (event?.type !== 'diffusion-progress') return;
        op.signal.throwIfAborted();
        if (input.task !== 'text-to-image' || ++progressFrames > 32) throw failure('Invalid image generation progress');
        const progress = diffusionProgress(event);
        written = written.then(() => io.write({ type: 'progress', requestId: input.requestId, progress }, op.signal));
        written.catch((error) => op.controller.abort(error));
      };
      // Application request IDs are locally unique even if different remote peers choose the same ID.
      const result = await withAbort(this.generateLocal({ ...input, requestId: `remote-${crypto.randomUUID()}`,
        signal: op.signal, onToken, onProgress }), op.signal);
      await written; op.signal.throwIfAborted();
      if (Boolean(result?.image) !== (input.task === 'text-to-image') || Boolean(result?.audio) !== (input.task === 'text-to-speech')) throw failure('Inference output does not match hosted task');
      const metadata = resultData({ ...result,
        ...(result.image ? { image: describeResultImage(result.image) } : {}),
        ...(result.audio ? { audio: describeAudio(result.audio, result.sampleRate) } : {}) });
      if (bytes(metadata.text) > maximumOutputBytes) throw failure('Inference output exceeds its task byte budget');
      if (result.image) await writeResultImage(io, { image: result.image, metadata: metadata.image,
        requestId: input.requestId, controls, signal: op.signal });
      if (result.audio) await writeResultAudio(io, { samples: result.audio, metadata: metadata.audio,
        requestId: input.requestId, controls, signal: op.signal });
      await io.write({ type: 'done', requestId: input.requestId, result: metadata }, op.signal);
      await this._closeCompletedStream(stream, op.signal);
    } catch (cause) {
      const error = asError(cause);
      if (!op.signal.aborted) {
        const details = { code: String(error.code ?? 'ERR_PEER_INFERENCE').slice(0, 80),
          message: String(error.message ?? 'Peer inference failed').slice(0, 256) };
        try { await io.write(request?.type === 'query' ? this._envelope('error', peerId, details)
          : { type: 'error', ...details }, op.signal); await stream.close({ signal: op.signal }); }
        catch { stream.abort(error); }
      } else stream.abort(error);
    } finally {
      if (key) this.inbound.delete(key);
      op.signal.removeEventListener('abort', abort); op.controller.abort(new Error('Inference stream finished')); op.dispose();
      await monitor?.catch(() => {});
      release?.();
      resolveFinished();
    }
  }

  async generate(manifestCid, options = {}) {
    if (this.closed) throw failure('Peer inference service is stopped');
    const input = generation({ ...options, requestId: options.requestId ?? crypto.randomUUID(), manifestCid }, { imageBytes: true });
    if (this.outbound.has(input.requestId) || this.outbound.size >= LIMITS.maximumOutbound) throw failure('Outgoing inference queue is full');
    const op = operation([this.controller.signal, options.signal], this.requestTimeoutMs);
    const entry = { controller: op.controller, peerId: null };
    this.outbound.set(input.requestId, entry);
    const run = async () => {
      let candidates = this.listHosts().find((group) => group.manifestCid === input.manifestCid)?.hosts.filter((host) => !host.local) ?? [];
      if (!candidates.length) {
        await this.refresh({ signal: op.signal });
        candidates = this.listHosts().find((group) => group.manifestCid === input.manifestCid)?.hosts.filter((host) => !host.local) ?? [];
      }
      const model = this.listHosts().find((group) => group.manifestCid === input.manifestCid);
      if (model) {
        if (input.task !== undefined && input.task !== model.task) throw failure('Requested task does not match discovered model');
        input.task = model.task;
        generation(input); // Pixel bytes were already validated and copied at admission.
      }
      candidates = candidates.filter((candidate) => candidate.queueAvailable !== false
        && (!candidate.busy || (candidate.queuedRequests ?? 0) < (candidate.queueCapacity ?? MODEL_POLICY.maxQueued))
        && (!isSpeechTask(input.task) || candidate.protocol === PEER_INFERENCE_PROTOCOL));
      candidates.sort((a, b) => Number(a.busy) - Number(b.busy) || (a.queuedRequests ?? 0) - (b.queuedRequests ?? 0)
        || (a.busy ? 0 : b.idleForMs - a.idleForMs) || a.peerId.localeCompare(b.peerId));
      let lastError = failure('No remote peer hosts the requested model', 'ERR_INFERENCE_NOT_HOSTED');
      for (const candidate of candidates) {
        op.signal.throwIfAborted(); entry.peerId = candidate.peerId;
        const route = { target: `peer:${input.manifestCid}`, manifestCid: input.manifestCid, modelName: model?.name,
          local: false, task: input.task, peerId: candidate.peerId };
        options.onProgress?.({ type: 'routing', requestId: input.requestId, ...route, route, busy: candidate.busy });
        const candidateInput = { ...input, ...(input.maxNewTokens === undefined ? {} : {
          maxNewTokens: Math.min(input.maxNewTokens, candidate.maxNewTokens ?? LEGACY_MAX_NEW_TOKENS) }) };
        try { return await this._generateAt(candidate.peerId, candidateInput, options, op.signal); }
        catch (error) { lastError = error; if (error.committed || op.signal.aborted) throw error; }
      }
      throw lastError;
    };
    const task = run(); this.operations.add(task);
    try { return await task; }
    finally { this.operations.delete(task); this.outbound.delete(input.requestId); op.dispose(); }
  }
  async _generateAt(peerId, input, options, signal) {
    let stream, release; let committed = false;
    const abort = () => stream?.abort(aborted(signal));
    signal.addEventListener('abort', abort, { once: true });
    try {
      const opened = await this._openStream(peerId, signal, { audio: isSpeechTask(input.task) });
      const { connection } = opened; stream = opened.stream; release = opened.release;
      const io = channel(stream);
      const header = { ...input, image: input.image ? { width: input.image.width, height: input.image.height, channels: 4 } : undefined,
        audio: input.audio ? Object.fromEntries(Object.entries(input.audio).filter(([key]) => key !== 'samples')) : undefined };
      await io.write(this._envelope('generate', peerId, header), signal);
      const ready = await io.read(signal);
      if (ready.type === 'error') throw failure(String(ready.message).slice(0, 256), ready.code);
      if (ready.type !== 'upload' || ready.requestId !== input.requestId) throw failure('Invalid inference upload acknowledgement');
      if (input.image) for (let offset = 0; offset < input.image.data.length;) {
        const end = Math.min(offset + LIMITS.imageChunkBytes, input.image.data.length);
        await io.rpc.write(input.image.data.subarray(offset, end), { signal });
        const credit = await io.read(signal);
        if (credit.type !== 'image-credit' || credit.offset !== end) throw failure('Invalid image transfer credit');
        offset = end;
      }
      if (input.audio) await writeInputAudio(io, { samples: input.audio.samples, requestId: input.requestId, signal });
      let sequence = 0; let totalBytes = 0; let accepted = false; let image; let audio; let progressFrames = 0;
      for (;;) {
        const frame = await io.read(signal);
        if (frame.type === 'error') throw failure(String(frame.message).slice(0, 256), frame.code);
        if (frame.requestId !== input.requestId) throw failure('Inference response ID mismatch');
        if (frame.type === 'accepted' && !accepted) {
          // Mark before writing: a failed write may already have reached the
          // host, so subsequent failures must never run on a second peer.
          committed = true;
          await io.write({ type: 'start', requestId: input.requestId }, signal);
          const route = { target: `peer:${input.manifestCid}`, manifestCid: input.manifestCid, local: false, task: input.task, peerId };
          accepted = true; options.onProgress?.({ type: 'accepted', requestId: input.requestId, ...route, route, queued: Boolean(frame.queued) }); continue;
        }
        if (!accepted) throw failure('Inference output preceded admission');
        if (frame.type === 'token') {
          if (frame.sequence !== sequence++ || sequence > 4096 || typeof frame.text !== 'string') throw failure('Invalid token sequence');
          totalBytes += bytes(frame.text);
          if (totalBytes > (input.task === 'automatic-speech-recognition' ? 8192 : MODEL_POLICY.maxOutputBytes)) throw failure('Inference output exceeds its byte budget');
          await withAbort(options.onToken?.(frame.text, { ...frame, peerId }), signal);
        } else if (frame.type === 'progress') {
          if (input.task !== 'text-to-image' || ++progressFrames > 32) throw failure('Invalid image generation progress');
          await withAbort(options.onProgress?.({ ...diffusionProgress(frame.progress), requestId: input.requestId, peerId }), signal);
        } else if (frame.type === 'result-image') {
          if (input.task !== 'text-to-image' || image) throw failure('Unexpected generated image');
          image = await readResultImage(io, { image: frame.image, requestId: input.requestId, signal });
        } else if (frame.type === 'result-audio') {
          if (input.task !== 'text-to-speech' || audio) throw failure('Unexpected generated audio');
          audio = await readResultAudio(io, { audio: frame.audio, requestId: input.requestId, signal });
        } else if (frame.type === 'done') {
          const result = resultData(frame.result);
          if (input.task === 'automatic-speech-recognition' && bytes(result.text) > 8192) throw failure('Speech transcript exceeds its byte budget');
          if (Boolean(result.image) !== (input.task === 'text-to-image') || Boolean(result.image) !== Boolean(image)
              || Boolean(result.audio) !== (input.task === 'text-to-speech') || Boolean(result.audio) !== Boolean(audio)) {
            throw failure('Inference output does not match requested task');
          }
          if (image) {
            if (['width', 'height', 'channels', 'sha256'].some((key) => image[key] !== result.image[key])) {
              throw failure('Generated image metadata changed during transfer');
            }
            result.image = image;
          }
          if (audio) {
            if (Object.keys(audio.metadata).some((key) => audio.metadata[key] !== result.audio[key])) throw failure('Generated audio metadata changed during transfer');
            result.audio = audio.audio; result.sampleRate = audio.sampleRate;
          }
          await this._closeCompletedStream(stream, signal); return { ...result, requestId: input.requestId, peerId, manifestCid: input.manifestCid,
            protocol: opened.protocol, connectionEncryption: connection.encryption, connectionAddress: connection.remoteAddr?.toString() };
        } else throw failure('Unknown inference output frame');
      }
    } catch (cause) { const error = asError(cause); stream?.abort(error); error.committed = committed;
      if (committed) error.remoteCleanupAcknowledged = false;
      throw error; }
    finally { release?.(); signal.removeEventListener('abort', abort); }
  }
  cancel(requestId) {
    const entry = this.outbound.get(requestId);
    if (!entry) return false;
    entry.controller.abort(failure('Caller cancelled peer inference', 'ERR_INFERENCE_CANCELLED')); return true;
  }
  async stop() {
    if (this.stopping) return this.stopping;
    this.closed = true;
    this.controller.abort(failure('Peer inference service stopped', 'ERR_INFERENCE_STOPPED'));
    this.stopping = (async () => {
      try { await this.manager.libp2p.unhandle([PEER_INFERENCE_PROTOCOL, PEER_INFERENCE_PROTOCOL_V2]); }
      finally {
        this.manager.libp2p.removeEventListener('peer:disconnect', this.disconnectListener);
        await Promise.allSettled([...this.operations]);
        this.records.clear(); this.models = []; this.hosts = [];
        this.getLocalState = null; this.generateLocal = null;
      }
      this.requiresCleanup = false;
    })().catch((error) => { this.stopping = null; this.requiresCleanup = true; throw error; });
    return this.stopping;
  }
}
