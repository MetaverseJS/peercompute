export const TELEMETRY_PREFIX = 'telemetry:';

export class TelemetryStore {
  constructor() {
    this.entries = new Map();
  }

  updateFromWarmDeltas(deltas) {
    if (!deltas || typeof deltas !== 'object') return;
    for (const [key, entry] of Object.entries(deltas)) {
      if (!key.startsWith(TELEMETRY_PREFIX)) continue;
      const payload = entry?.payload;
      if (!payload) continue;
      const peerId = key.slice(TELEMETRY_PREFIX.length) || payload.peerId;
      if (!peerId) continue;
      this.entries.set(peerId, {
        ...payload,
        peerId,
        seenAt: Date.now()
      });
    }
  }

  updateLocal(snapshot) {
    if (!snapshot?.peerId) return;
    this.entries.set(snapshot.peerId, {
      ...snapshot,
      peerId: snapshot.peerId,
      seenAt: Date.now()
    });
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
