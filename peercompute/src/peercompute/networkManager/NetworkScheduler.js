const clampHz = (value, fallback) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(60, value));
};

export const DEFAULT_SCHEDULER_PROFILE = {
  snapshotHz: 20,
  commandHz: 30,
  keepaliveMs: 1000,
  maxEventsPerTick: 20,
  eventRetryMs: 500,
  eventRetryMax: 5,
  reliableEventTypes: [],
  reconnectStallMs: 8000,
  reconnectBackoffMs: 5000,
  snapshotsRequireAuthority: false,
  snapshotTopic: null,
  commandTopic: null,
  eventTopic: null
};

export class NetworkScheduler {
  constructor(adapter, profile = {}) {
    this.adapter = adapter;
    this.stateProviders = new Map();
    this.commandProviders = new Map();
    this.eventQueue = [];
    this.pendingReliableEvents = new Map();
    this.reliabilityStats = {
      sent: 0,
      acked: 0,
      dropped: 0
    };

    this.snapshotHandlers = [];
    this.commandHandlers = [];
    this.eventHandlers = [];

    this.seq = {
      snapshot: 0,
      command: 0,
      event: 0
    };

    this.lastSnapshotAt = -Infinity;
    this.lastCommandAt = -Infinity;
    this.lastEventAt = -Infinity;
    this.lastRxAt = 0;
    this.lastTxAt = 0;
    this.lastReconnectAt = -Infinity;
    this.stateDirty = true;
    this.authorityId = null;

    this.configure(profile);
  }

  configure(profile = {}) {
    const eventRetryMs = Number.isFinite(profile.eventRetryMs)
      ? profile.eventRetryMs
      : DEFAULT_SCHEDULER_PROFILE.eventRetryMs;
    const eventRetryMax = Number.isFinite(profile.eventRetryMax)
      ? profile.eventRetryMax
      : DEFAULT_SCHEDULER_PROFILE.eventRetryMax;
    this.profile = {
      ...DEFAULT_SCHEDULER_PROFILE,
      ...profile,
      snapshotHz: clampHz(profile.snapshotHz, DEFAULT_SCHEDULER_PROFILE.snapshotHz),
      commandHz: clampHz(profile.commandHz, DEFAULT_SCHEDULER_PROFILE.commandHz),
      eventRetryMs: Math.max(0, eventRetryMs),
      eventRetryMax: Math.max(1, eventRetryMax),
      reliableEventTypes: Array.isArray(profile.reliableEventTypes)
        ? profile.reliableEventTypes
        : DEFAULT_SCHEDULER_PROFILE.reliableEventTypes
    };
    this.snapshotIntervalMs = Math.round(1000 / this.profile.snapshotHz);
    this.commandIntervalMs = Math.round(1000 / this.profile.commandHz);
    const maxHz = Math.max(this.profile.snapshotHz, this.profile.commandHz);
    this.tickIntervalMs = Math.max(10, Math.round(1000 / maxHz));
  }

  getProfile() {
    return { ...this.profile };
  }

  getTickIntervalMs() {
    return this.tickIntervalMs;
  }

  setAuthority(peerId) {
    this.authorityId = peerId || null;
  }

  getAuthority() {
    return this.authorityId;
  }

  registerStateProvider(fn, options = {}) {
    const id = options.id || `state-${Math.random().toString(36).slice(2)}`;
    this.stateProviders.set(id, { fn, options });
    return id;
  }

  registerCommandProvider(fn, options = {}) {
    const id = options.id || `cmd-${Math.random().toString(36).slice(2)}`;
    this.commandProviders.set(id, { fn, options });
    return id;
  }

  unregisterStateProvider(id) {
    this.stateProviders.delete(id);
  }

  unregisterCommandProvider(id) {
    this.commandProviders.delete(id);
  }

  addSnapshotHandler(handler) {
    this.snapshotHandlers.push(handler);
  }

  addCommandHandler(handler) {
    this.commandHandlers.push(handler);
  }

  addEventHandler(handler) {
    this.eventHandlers.push(handler);
  }

  markStateDirty() {
    this.stateDirty = true;
  }

  queueEvent(payload, options = {}) {
    const now = Date.now();
    const reliable = options.reliable || options.critical;
    const id = options.id || `evt-${now}-${Math.random().toString(36).slice(2, 8)}`;
    if (reliable) {
      if (!this.pendingReliableEvents.has(id)) {
        this.pendingReliableEvents.set(id, {
          id,
          payload,
          options,
          createdAt: now,
          lastSentAt: 0,
          attempts: 0,
          nextSendAt: 0
        });
      }
      return id;
    }
    this.eventQueue.push({ id, payload, options, reliable: false });
    return id;
  }

  recordRx(now = Date.now()) {
    this.lastRxAt = now;
  }

  recordTx(now = Date.now()) {
    this.lastTxAt = now;
  }

  handleMessage(message, peerId) {
    if (!message || typeof message.type !== 'string') return false;
    if (!message.type.startsWith('pc-')) return false;
    if (this.adapter?.isInScope && !this.adapter.isInScope(message)) return true;
    if (message.target && this.adapter?.getPeerId && message.target !== this.adapter.getPeerId()) {
      return true;
    }
    this.recordRx(message.header?.ts || Date.now());

    if (message.type === 'pc-snapshot') {
      this.snapshotHandlers.forEach((fn) => fn(peerId, message));
      return true;
    }
    if (message.type === 'pc-command') {
      this.commandHandlers.forEach((fn) => fn(peerId, message));
      return true;
    }
    if (message.type === 'pc-ack') {
      const ids = message?.payload?.eventIds;
      if (Array.isArray(ids)) {
        let removed = 0;
        ids.forEach((id) => {
          if (this.pendingReliableEvents.delete(id)) {
            removed += 1;
          }
        });
        this.reliabilityStats.acked += removed;
      }
      return true;
    }
    if (message.type === 'pc-event') {
      this.eventHandlers.forEach((fn) => fn(peerId, message));
      this._ackReliableEvents(message, peerId);
      return true;
    }
    return true;
  }

  tick(now = Date.now()) {
    this._flushCommands(now);
    this._flushSnapshots(now);
    this._flushEvents(now);
    this._checkReconnect(now);
  }

  _buildHeader(type, now) {
    return {
      type,
      seq: this.seq[type]++,
      ts: now,
      peerId: this.adapter?.getPeerId?.() || null,
      authorityId: this.authorityId || this.adapter?.getAuthority?.() || null
    };
  }

  _collectStatePayload() {
    const payload = [];
    for (const [id, entry] of this.stateProviders.entries()) {
      try {
        const data = entry.fn();
        if (data === undefined || data === null) continue;
        payload.push({ id, data });
      } catch (_) {
        // ignore provider errors to avoid stalling scheduler
      }
    }
    return payload;
  }

  _collectCommandPayload() {
    const payload = [];
    for (const [id, entry] of this.commandProviders.entries()) {
      try {
        const data = entry.fn();
        if (data === undefined || data === null) continue;
        if (Array.isArray(data)) {
          data.forEach((item) => payload.push({ id, data: item }));
        } else {
          payload.push({ id, data });
        }
      } catch (_) {
        // ignore provider errors to avoid stalling scheduler
      }
    }
    return payload;
  }

  _flushSnapshots(now) {
    if (this.stateProviders.size === 0) return;
    if (now - this.lastSnapshotAt < this.snapshotIntervalMs) return;
    const keepalive = now - this.lastSnapshotAt >= this.profile.keepaliveMs;
    if (!this.stateDirty && !keepalive) return;

    const payload = this._collectStatePayload();
    if (payload.length === 0 && !keepalive) return;

    const message = {
      type: 'pc-snapshot',
      header: this._buildHeader('snapshot', now),
      gameId: this.adapter?.getGameId?.() || null,
      roomId: this.adapter?.getRoomId?.() || null,
      payload,
      keepalive
    };

    this.lastSnapshotAt = now;
    this.stateDirty = false;
    this.adapter?.sendSnapshot?.(message);
    this.recordTx(now);
  }

  _flushCommands(now) {
    if (this.commandProviders.size === 0) return;
    if (now - this.lastCommandAt < this.commandIntervalMs) return;

    const payload = this._collectCommandPayload();
    if (payload.length === 0) return;

    const message = {
      type: 'pc-command',
      header: this._buildHeader('command', now),
      gameId: this.adapter?.getGameId?.() || null,
      roomId: this.adapter?.getRoomId?.() || null,
      payload
    };

    this.lastCommandAt = now;
    this.adapter?.sendCommand?.(message);
    this.recordTx(now);
  }

  _flushEvents(now) {
    if (this.eventQueue.length === 0 && this.pendingReliableEvents.size === 0) return;
    const max = this.profile.maxEventsPerTick;
    const batch = [];
    const dueReliable = [];
    for (const entry of this.pendingReliableEvents.values()) {
      if (entry.attempts >= this.profile.eventRetryMax) {
        this.reliabilityStats.dropped += 1;
        this.pendingReliableEvents.delete(entry.id);
        continue;
      }
      if (now >= entry.nextSendAt) {
        dueReliable.push(entry);
      }
    }

    const pushEntry = (entry) => {
      if (batch.length >= max) return false;
      batch.push(entry);
      return true;
    };

    for (const entry of dueReliable) {
      if (!pushEntry({
        id: entry.id,
        payload: entry.payload,
        reliable: true,
        ts: now
      })) {
        break;
      }
      entry.attempts += 1;
      entry.lastSentAt = now;
      this.reliabilityStats.sent += 1;
      const baseRetry = entry.options?.retryMs ?? this.profile.eventRetryMs;
      const backoff = baseRetry * Math.pow(2, Math.max(0, entry.attempts - 1));
      entry.nextSendAt = now + backoff;
    }

    while (batch.length < max && this.eventQueue.length > 0) {
      const entry = this.eventQueue.shift();
      if (!entry) break;
      batch.push({
        id: entry.id,
        payload: entry.payload,
        reliable: false,
        ts: now
      });
    }

    if (batch.length === 0) return;

    const message = {
      type: 'pc-event',
      header: this._buildHeader('event', now),
      gameId: this.adapter?.getGameId?.() || null,
      roomId: this.adapter?.getRoomId?.() || null,
      payload: batch
    };

    this.lastEventAt = now;
    this.adapter?.sendEvent?.(message);
    this.recordTx(now);
  }

  getReliabilityStats() {
    return {
      sent: this.reliabilityStats.sent,
      acked: this.reliabilityStats.acked,
      dropped: this.reliabilityStats.dropped,
      pending: this.pendingReliableEvents.size,
      retryMs: this.profile.eventRetryMs,
      retryMax: this.profile.eventRetryMax
    };
  }

  _checkReconnect(now) {
    if (!this.adapter?.reconnect) return;
    if (this.profile.reconnectStallMs <= 0) return;
    const lastRx = this.lastRxAt || 0;
    if (now - lastRx < this.profile.reconnectStallMs) return;
    if (now - this.lastReconnectAt < this.profile.reconnectBackoffMs) return;

    this.lastReconnectAt = now;
    this.adapter.reconnect();
  }

  _ackReliableEvents(message, peerId) {
    const entries = Array.isArray(message?.payload) ? message.payload : [];
    const ids = entries
      .filter((entry) => entry?.reliable && entry?.id)
      .map((entry) => entry.id);
    if (ids.length === 0) return;
    const now = Date.now();
    const ack = {
      type: 'pc-ack',
      header: this._buildHeader('event', now),
      gameId: this.adapter?.getGameId?.() || null,
      roomId: this.adapter?.getRoomId?.() || null,
      target: peerId || null,
      payload: { eventIds: ids }
    };
    this.adapter?.sendEvent?.(ack);
  }
}
