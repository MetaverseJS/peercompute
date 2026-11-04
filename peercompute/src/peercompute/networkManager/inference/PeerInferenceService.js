import { MODEL_POLICY } from '../../inference/modelManifest.js';
import { PEER_INFERENCE_PROTOCOL, PEER_INFERENCE_LIMITS as LIMITS, LEGACY_MAX_NEW_TOKENS, bytes, cid, integer,
  encryptedConnection, localState, generation, resultData, diffusionProgress, channel } from './protocol.js';
import { monitorResultControls, describeResultImage, writeResultImage, readResultImage } from './imageResult.js';

const failure = (message, code = 'ERR_PEER_INFERENCE') => Object.assign(new Error(message), { code });
const asError = (error) => error instanceof Error ? error : failure(String(error ?? 'Peer inference failed'));
const aborted = (signal) => signal.reason instanceof Error ? signal.reason : new DOMException('Inference cancelled', 'AbortError');
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
    await this.manager.libp2p.handle(PEER_INFERENCE_PROTOCOL, (stream, connection) => {
      if (this.closed || this.operations.size >= 40 || !encryptedConnection(connection)) {
        stream.abort(failure('Encrypted peer inference connection required')); return;
      }
      const task = this._handle(stream, connection);
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
  async _state(signal, ownReservation = 0) {
    const state = localState(await withAbort(this.getLocalState(), signal), this.hostingEnabled,
      { defaultMaxNewTokens: MODEL_POLICY.maxNewTokens });
    // The application reports local work as well. Inbound work is also busy
    // during upload/admission so simultaneous requestors do not see false idle.
    if (this.inbound.size > ownReservation) { state.busy = true; state.idleForMs = 0; }
    return state;
  }
  setHostingEnabled(enabled) {
    this.hostingEnabled = Boolean(enabled);
    if (!this.hostingEnabled) for (const entry of this.inbound.values()) {
      entry.controller.abort(failure('Peer inference hosting disabled', 'ERR_INFERENCE_HOST_DISABLED'));
    }
    this.records.delete(this.peerId); this._group();
  }
  _remember(peerId, state) {
    this.records.set(peerId, { state, receivedAt: Date.now() });
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
      if (state.hostedModel) {
        const { maxNewTokens, ...model } = state.hostedModel;
        if (!hosts.has(model.manifestCid)) hosts.set(model.manifestCid, { ...model, hosts: [] });
        hosts.get(model.manifestCid).hosts.push({ peerId, local, busy: state.busy,
          idleForMs: state.busy ? 0 : state.idleForMs, queuedRequests: state.queuedRequests, maxNewTokens });
      }
    }
    this.models = [...models.values()]; this.hosts = [...hosts.values()];
  }
  listModels() { this._group(); return structuredClone(this.models); }
  listHosts() { this._group(); return structuredClone(this.hosts); }
  async _connection(peerId, signal) {
    signal.throwIfAborted();
    const best = () => this.manager.libp2p.getConnections()
      .filter((item) => item.remotePeer.toString() === peerId && encryptedConnection(item))
      .sort((a, b) => {
        const score = (item) => item.encryption === 'native' ? 3
          : item.remoteAddr?.getComponents?.().some(({ name }) => name === 'p2p-circuit') ? 1 : 2;
        return score(b) - score(a);
      })[0];
    let connection = best();
    if (!connection && this.manager.peers?.has(peerId)) {
      // Respect the manager's normal logical capacity, relay and dial backoff.
      await withAbort(this.manager._maybeDialPeer(peerId, 'peer-inference'), signal);
      connection = best();
    }
    if (!connection) throw failure('No authenticated encrypted connection to inference peer', 'ERR_INFERENCE_UNREACHABLE');
    return connection;
  }
  async _query(peerId, signal) {
    const op = operation([this.controller.signal, signal], this.queryTimeoutMs);
    let stream;
    const abort = () => stream?.abort(aborted(op.signal));
    op.signal.addEventListener('abort', abort, { once: true });
    try {
      const connection = await this._connection(peerId, op.signal);
      stream = await connection.newStream(PEER_INFERENCE_PROTOCOL, { signal: op.signal, runOnLimitedConnection: true });
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
      this._remember(peerId, localState(response.state));
      await stream.close({ signal: op.signal });
    } catch (error) { this.records.delete(peerId); stream?.abort(error); throw error; }
    finally { op.signal.removeEventListener('abort', abort); op.dispose(); }
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

  async _handle(stream, connection) {
    const peerId = connection.remotePeer.toString();
    const op = operation([this.controller.signal], this.requestTimeoutMs);
    const abort = () => stream.abort(aborted(op.signal));
    op.signal.addEventListener('abort', abort, { once: true });
    const io = channel(stream); let key; let monitor; let request;
    try {
      const first = operation([op.signal], this.queryTimeoutMs);
      try { request = await io.read(first.signal); } finally { first.dispose(); }
      this._checkEnvelope(request, peerId);
      if (request.type === 'query') {
        await io.write(this._envelope('directory', peerId, { state: await this._state(op.signal) }), op.signal);
        await stream.close({ signal: op.signal }); return;
      }
      if (request.type !== 'generate') throw failure('Unknown inference request');
      const input = generation(request);
      key = `${peerId}:${input.requestId}`;
      if (this.inbound.has(key) || this.inbound.size >= LIMITS.maximumInbound
          || [...this.inbound.values()].filter((entry) => entry.peerId === peerId).length >= LIMITS.maximumPerPeer) {
        key = null; throw failure('Peer inference queue is full', 'ERR_INFERENCE_BUSY');
      }
      // Reserve before awaiting application state: concurrent uploads cannot
      // all pass a stale capacity check while the callback is suspended.
      this.inbound.set(key, { peerId, controller: op.controller });
      const state = await this._state(op.signal, 1);
      if (!state.hostedModel || state.hostedModel.manifestCid !== input.manifestCid) throw failure('Requested model is not hosted', 'ERR_INFERENCE_NOT_HOSTED');
      if (input.maxNewTokens > state.hostedModel.maxNewTokens) throw failure('Requested token limit exceeds hosted capacity', 'ERR_INFERENCE_TOKEN_LIMIT');
      if (input.task !== undefined && input.task !== state.hostedModel.task) throw failure('Requested task does not match hosted model');
      input.task = state.hostedModel.task;
      generation(input); // Validate task-dependent input before admitting an upload.
      if (input.image && !state.hostedModel.modalities.includes('image')) throw failure('Hosted model does not accept images');
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
      const current = await this._state(op.signal, 1);
      if (!current.hostedModel || current.hostedModel.manifestCid !== input.manifestCid) throw failure('Inference host changed during upload');
      if (input.maxNewTokens > current.hostedModel.maxNewTokens) throw failure('Requested token limit exceeds hosted capacity', 'ERR_INFERENCE_TOKEN_LIMIT');
      await io.write({ type: 'accepted', requestId: input.requestId, queued: current.busy }, op.signal);
      // No work can start merely because our admission reply was sent. A lost
      // reply is safely retryable until the caller commits with this start ack.
      const start = await io.read(op.signal);
      if (start.type !== 'start' || start.requestId !== input.requestId) throw failure('Missing inference start acknowledgement');
      const controls = monitorResultControls(io, input.requestId, op.controller);
      monitor = controls.task;
      let written = Promise.resolve(); let totalBytes = 0; let sequence = 0; let pendingBytes = 0;
      const onToken = (text) => {
        op.signal.throwIfAborted();
        if (typeof text !== 'string') throw failure('Invalid host token');
        if (!text.length) return;
        totalBytes += bytes(text); pendingBytes += bytes(text) + 128;
        if (totalBytes > MODEL_POLICY.maxOutputBytes || pendingBytes > MODEL_POLICY.maxOutputBytes + 8192
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
      if (Boolean(result?.image) !== (input.task === 'text-to-image')) throw failure('Inference output does not match hosted task');
      const metadata = resultData({ ...result,
        ...(result.image ? { image: describeResultImage(result.image) } : {}) });
      if (result.image) await writeResultImage(io, { image: result.image, metadata: metadata.image,
        requestId: input.requestId, controls, signal: op.signal });
      await io.write({ type: 'done', requestId: input.requestId, result: metadata }, op.signal);
      await stream.close({ signal: op.signal });
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
      candidates.sort((a, b) => Number(a.busy) - Number(b.busy) || (a.busy ? 0 : b.idleForMs - a.idleForMs));
      let lastError = failure('No remote peer hosts the requested model', 'ERR_INFERENCE_NOT_HOSTED');
      for (const candidate of candidates) {
        op.signal.throwIfAborted(); entry.peerId = candidate.peerId;
        options.onProgress?.({ type: 'routing', requestId: input.requestId, peerId: candidate.peerId, busy: candidate.busy });
        const candidateInput = { ...input, maxNewTokens: Math.min(input.maxNewTokens, candidate.maxNewTokens ?? LEGACY_MAX_NEW_TOKENS) };
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
    let stream; let committed = false;
    const abort = () => stream?.abort(aborted(signal));
    signal.addEventListener('abort', abort, { once: true });
    try {
      const connection = await this._connection(peerId, signal);
      stream = await connection.newStream(PEER_INFERENCE_PROTOCOL, { signal, runOnLimitedConnection: true });
      const io = channel(stream);
      const header = { ...input, image: input.image ? { width: input.image.width, height: input.image.height, channels: 4 } : undefined };
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
      let sequence = 0; let totalBytes = 0; let accepted = false; let image; let progressFrames = 0;
      for (;;) {
        const frame = await io.read(signal);
        if (frame.type === 'error') throw failure(String(frame.message).slice(0, 256), frame.code);
        if (frame.requestId !== input.requestId) throw failure('Inference response ID mismatch');
        if (frame.type === 'accepted' && !accepted) {
          // Mark before writing: a failed write may already have reached the
          // host, so subsequent failures must never run on a second peer.
          committed = true;
          await io.write({ type: 'start', requestId: input.requestId }, signal);
          accepted = true; options.onProgress?.({ type: 'accepted', requestId: input.requestId, peerId, queued: Boolean(frame.queued) }); continue;
        }
        if (!accepted) throw failure('Inference output preceded admission');
        if (frame.type === 'token') {
          if (frame.sequence !== sequence++ || sequence > 4096 || typeof frame.text !== 'string') throw failure('Invalid token sequence');
          totalBytes += bytes(frame.text);
          if (totalBytes > MODEL_POLICY.maxOutputBytes) throw failure('Inference output exceeds its byte budget');
          await withAbort(options.onToken?.(frame.text, { ...frame, peerId }), signal);
        } else if (frame.type === 'progress') {
          if (input.task !== 'text-to-image' || ++progressFrames > 32) throw failure('Invalid image generation progress');
          await withAbort(options.onProgress?.({ ...diffusionProgress(frame.progress), requestId: input.requestId, peerId }), signal);
        } else if (frame.type === 'result-image') {
          if (input.task !== 'text-to-image' || image) throw failure('Unexpected generated image');
          image = await readResultImage(io, { image: frame.image, requestId: input.requestId, signal });
        } else if (frame.type === 'done') {
          const result = resultData(frame.result);
          if (Boolean(result.image) !== (input.task === 'text-to-image') || Boolean(result.image) !== Boolean(image)) {
            throw failure('Inference output does not match requested task');
          }
          if (image) {
            if (['width', 'height', 'channels', 'sha256'].some((key) => image[key] !== result.image[key])) {
              throw failure('Generated image metadata changed during transfer');
            }
            result.image = image;
          }
          await stream.close({ signal }); return { ...result, requestId: input.requestId, peerId, manifestCid: input.manifestCid,
            connectionEncryption: connection.encryption, connectionAddress: connection.remoteAddr?.toString() };
        } else throw failure('Unknown inference output frame');
      }
    } catch (cause) { const error = asError(cause); stream?.abort(error); error.committed = committed; throw error; }
    finally { signal.removeEventListener('abort', abort); }
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
      try { await this.manager.libp2p.unhandle(PEER_INFERENCE_PROTOCOL); }
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
