import { multiaddr } from '@multiformats/multiaddr';

const failure = (message, code = 'ERR_INFERENCE_RECOVERY') => Object.assign(new Error(message), { code });
const reason = (signal) => signal.reason ?? new DOMException('Connection recovery cancelled', 'AbortError');
const open = (connection) => connection?.status === 'open';
const address = (connection) => connection?.remoteAddr?.toString() ?? '';
const relay = (connection) => address(connection).includes('/p2p-circuit');
const bounded = (value, minimum, maximum) => {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new RangeError('Invalid connection recovery bound');
  return value;
};
function wait(promise, signal) {
  if (signal.aborted) { Promise.resolve(promise).catch(() => {}); return Promise.reject(reason(signal)); }
  return new Promise((resolve, reject) => {
    const abort = () => reject(reason(signal));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

/** Manager-owned repair of a transport, never a retry of an application request. */
export class PeerConnectionRecovery {
  constructor(manager, { now = Date.now, dialTimeoutMs = 5000, cooldownMs = 15000,
    freshGraceMs = 10000, idleGraceMs = 15000, maxConcurrent = 2 } = {}) {
    this.manager = manager; this.now = now;
    this.dialTimeoutMs = bounded(dialTimeoutMs, 10, 15000);
    this.cooldownMs = bounded(cooldownMs, 1, 60000);
    this.freshGraceMs = bounded(freshGraceMs, 0, 30000);
    this.idleGraceMs = bounded(idleGraceMs, 0, 30000);
    this.maxConcurrent = bounded(maxConcurrent, 1, 4);
    this.pending = new Map(); this.cooldowns = new Map();
    this.protections = new WeakMap(); this.closed = false;
  }

  observe(connection, { openedNow = false } = {}) {
    if (!connection || this.protections.has(connection)) return;
    const timestamp = connection.timeline?.open ?? connection.stat?.timeline?.open;
    const opened = timestamp instanceof Date ? timestamp.getTime() : Number(timestamp?.timestamp ?? timestamp);
    this.protections.set(connection, { freshUntil: Number.isFinite(opened) ? opened + this.freshGraceMs
      : openedNow ? this.now() + this.freshGraceMs : 0,
      idleUntil: 0, leases: new Map() });
  }

  protectionMs(connection) {
    if (this.closed || !open(connection)) return 0;
    this.observe(connection);
    const value = this.protections.get(connection), now = this.now();
    for (const [id, until] of value.leases) if (until <= now) value.leases.delete(id);
    return Math.max(0, value.freshUntil - now, value.idleUntil - now,
      ...[...value.leases.values()].map((until) => until - now));
  }

  retain(connection, { timeoutMs = 300000 } = {}) {
    bounded(timeoutMs, 1, 301000);
    if (this.closed || !open(connection)) throw failure('Inference connection is closed');
    if (!this.manager.libp2p?.getConnections().includes(connection)) throw failure('Inference connection is not owned by this manager');
    this.observe(connection);
    const value = this.protections.get(connection), id = Symbol('inference-stream');
    value.leases.set(id, this.now() + timeoutMs);
    let released = false;
    const schedule = () => this.manager._scheduleRelayPrune?.(connection.remotePeer.toString(), Math.max(1, this.protectionMs(connection)));
    schedule();
    return () => {
      if (released) return;
      released = true; value.leases.delete(id);
      value.idleUntil = this.now() + this.idleGraceMs;
      if (!this.closed) schedule();
    };
  }

  notifyRelayReady(peerId) { this.pending.get(peerId)?.ready(); }

  recover(peerId, { signal } = {}) {
    try {
      signal?.throwIfAborted();
      const manager = this.manager, now = this.now(), peer = manager.peers?.get(peerId);
      if (this.closed || !manager.isConnected || !manager.libp2p) throw failure('Network is not connected');
      if (!peer || peerId === manager.peerId || manager.bootstrapPeerIds?.has(peerId)
          || ['gameId', 'roomId', 'topologyId'].some((key) => peer[key] !== manager.config[key])) {
        throw failure('Connection recovery requires a known peer in this application scope');
      }
      const pending = this.pending.get(peerId);
      if (pending) return this._join(pending, signal);
      if (manager.pendingPeerDials?.has(peerId)) throw failure('A normal peer dial is already in progress');
      const lastDial = manager.recentDialAttempts?.get(peerId);
      if (Number.isFinite(lastDial) && now - lastDial < 5000) throw failure('Peer connection recovery is limited by the normal dial throttle');
      for (const [id, until] of this.cooldowns) if (until <= now) this.cooldowns.delete(id);
      if (this.cooldowns.has(peerId)) throw failure('Peer connection recovery is cooling down', 'ERR_INFERENCE_RECOVERY_COOLDOWN');
      if (this.pending.size >= this.maxConcurrent || this.cooldowns.size >= 64) throw failure('Connection recovery is busy');
      if (!manager._hasAvailableLogicalPeerSlot(peerId, now) || manager._getDialBackoffEntry(peerId, now)) {
        throw failure('Peer connection recovery is limited by the normal dial policy');
      }
      const target = manager._buildCircuitAddr(peerId);
      if (!target) throw failure('No configured relay route for this peer');
      const route = multiaddr(target.toString()), parts = route.getComponents();
      const ids = parts.filter((part) => part.name === 'p2p').map((part) => part.value);
      const configured = manager.config.bootstrapPeers?.some((item) =>
        `${String(item).replace(/\/p2p-circuit\/?$/, '')}/p2p-circuit/p2p/${peerId}` === route.toString());
      if (!configured || ids.length !== 2 || ids[1] !== peerId || !manager.bootstrapPeerIds.has(ids[0])
          || parts.filter((part) => part.name === 'p2p-circuit').length !== 1 || parts.some((part) => part.name.startsWith('webrtc'))) {
        throw failure('Connection recovery requires an exact configured relay and peer identity');
      }
      const requireHeadroom = (queued = manager.libp2p.getDialQueue?.() ?? []) => {
        const connections = manager.libp2p.getConnections().filter(open);
        // A disconnected bootstrap adds its own outer connection as well as
        // the requested circuit. Do not provoke pruning of unrelated links.
        const needed = connections.some((item) => item.remotePeer.toString() === ids[0]) ? 1 : 2;
        const otherQueued = queued.filter((item) => ['queued', 'active'].includes(item.status)
          && !this.pending.has(item.peerId?.toString())).length;
        const reserved = [...this.pending.entries()].reduce((sum, [id, value]) => sum + (id === peerId ? 0 : value.slots), 0);
        if (connections.length + reserved + otherQueued + needed > manager._getTransportMaxConnections()) {
          throw failure('No physical connection headroom for recovery');
        }
        return needed;
      };
      const entry = { controller: new AbortController(), waiters: 0, slots: requireHeadroom() };
      entry.relayReady = new Promise((resolve) => { entry.ready = resolve; });
      const originals = new Set(manager.libp2p.getConnections());
      this.pending.set(peerId, entry); this.cooldowns.set(peerId, now + this.cooldownMs);
      manager.recentDialAttempts?.set(peerId, now);
      const timer = setTimeout(() => entry.controller.abort(failure('Peer connection recovery deadline exceeded', 'ERR_INFERENCE_RECOVERY_DEADLINE')), this.dialTimeoutMs);
      timer.unref?.();
      const closeOwned = (connection) => {
        if (!connection || originals.has(connection)) return;
        try { Promise.resolve(connection.abort(reason(entry.controller.signal))).catch(() => {}); } catch { /* Already closed. */ }
      };
      const dial = async () => {
        entry.controller.signal.throwIfAborted();
        const queued = manager.libp2p.getDialQueue?.() ?? [];
        if (queued.some((item) => ['queued', 'active'].includes(item.status) && item.peerId?.toString() === peerId)) {
          throw failure('A native peer dial is already in progress');
        }
        entry.slots = requireHeadroom(queued);
        // The ownership check and dial start are synchronous: libp2p force does
        // not prevent joining a dial that another caller already queued.
        const promise = Promise.resolve(manager.libp2p.dial(route, { force: true, signal: entry.controller.signal }));
        promise.then((connection) => { if (entry.controller.signal.aborted || this.closed) closeOwned(connection); }, () => {});
        const connection = await wait(promise, entry.controller.signal);
        if (entry.controller.signal.aborted || this.closed) { closeOwned(connection); throw reason(entry.controller.signal); }
        if (originals.has(connection) || !open(connection) || connection.remotePeer.toString() !== peerId
            || !['/noise', '/tls/1.0.0'].includes(connection.encryption) || !relay(connection) || address(connection).includes('/webrtc')) {
          closeOwned(connection); throw failure('Recovery did not establish a fresh authenticated relay connection');
        }
        this.observe(connection, { openedNow: true }); manager._clearDialFailureBackoff?.(peerId);
        return connection;
      };
      entry.promise = (async () => {
        try { return await dial(); }
        catch (error) {
          if (entry.controller.signal.aborted || !manager._isRelayReservationError?.(error)) throw error;
          // The other browser may have dropped its bootstrap reservation. Its
          // existing scoped pubsub route can request restoration without data.
          const requested = await wait(Promise.resolve(manager._requestRelayAssist(peerId, 'inference-stream-recovery')), entry.controller.signal);
          if (!requested) throw error;
          await wait(entry.relayReady, entry.controller.signal);
          return dial();
        }
      })().catch((error) => {
        if (!entry.controller.signal.aborted) manager._recordDialFailureBackoff?.(peerId, 'relay', error);
        throw error;
      }).finally(() => {
        clearTimeout(timer);
        if (this.pending.get(peerId) === entry) this.pending.delete(peerId);
      });
      return this._join(entry, signal);
    } catch (error) { return Promise.reject(error); }
  }

  _join(entry, signal) {
    entry.waiters++;
    const promise = signal ? wait(entry.promise, signal) : entry.promise;
    return promise.finally(() => {
      if (--entry.waiters === 0 && [...this.pending.values()].includes(entry)) {
        entry.controller.abort(new DOMException('Connection recovery has no remaining callers', 'AbortError'));
      }
    });
  }

  async stop() {
    this.closed = true;
    const pending = [...this.pending.values()];
    for (const entry of pending) entry.controller.abort(new DOMException('Network manager stopped', 'AbortError'));
    await Promise.allSettled(pending.map((entry) => entry.promise));
    this.cooldowns.clear(); this.protections = new WeakMap();
  }
}
