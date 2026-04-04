export const TELEMETRY_PREFIX = 'telemetry:';

export class TelemetryStore {
  constructor() {
    this.entries = new Map();
  }

  _getTimestamp(entry) {
    const ts = Number(entry?.ts);
    return Number.isFinite(ts) ? ts : null;
  }

  _shouldReplace(existing, incoming) {
    if (!existing) return true;
    const existingTs = this._getTimestamp(existing);
    const incomingTs = this._getTimestamp(incoming);
    if (existingTs !== null && incomingTs !== null) {
      return incomingTs >= existingTs;
    }
    if (existingTs !== null && incomingTs === null) {
      return false;
    }
    return true;
  }

  _upsert(peerId, payload) {
    if (!peerId || !payload || typeof payload !== 'object') return;
    const existing = this.entries.get(peerId);
    if (!this._shouldReplace(existing, payload)) return;
    this.entries.set(peerId, {
      ...payload,
      peerId,
      seenAt: Date.now()
    });
  }

  updateFromWarmDeltas(deltas) {
    if (!deltas || typeof deltas !== 'object') return;
    for (const [key, entry] of Object.entries(deltas)) {
      if (!key.startsWith(TELEMETRY_PREFIX)) continue;
      const payload = entry?.payload;
      if (!payload) continue;
      const peerId = key.slice(TELEMETRY_PREFIX.length) || payload.peerId;
      if (!peerId) continue;
      this._upsert(peerId, payload);
    }
  }

  updateLocal(snapshot) {
    if (!snapshot?.peerId) return;
    this._upsert(snapshot.peerId, snapshot);
  }

  prune(maxAgeMs) {
    const now = Date.now();
    for (const [peerId, entry] of this.entries.entries()) {
      const ts = entry?.ts || entry?.seenAt || 0;
      if (now - ts > maxAgeMs) {
        this.entries.delete(peerId);
      }
    }
  }

  get(peerId) {
    return this.entries.get(peerId);
  }

  list() {
    return Array.from(this.entries.values());
  }

  clear() {
    this.entries.clear();
  }
}
