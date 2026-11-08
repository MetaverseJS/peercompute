// This fallback coordinates hosts in one JavaScript realm only. Cross-tab
// ownership requires Web Locks; callers must expose that limitation.
const localClaims = new Map();

/** A body lifetime is separate from the short AgentRecordStore inference/run lock. */
export class WorldEmbodimentLease {
  constructor({ namespace, worldId, lockManager = globalThis.navigator?.locks } = {}) {
    if (typeof namespace !== 'string' || !namespace || namespace.length > 512
        || typeof worldId !== 'string' || !worldId || worldId.length > 240) throw new TypeError('Body ownership needs a store and world');
    this.prefix = `peercompute:embodiment:${JSON.stringify([namespace, worldId])}:`;
    this.lockManager = lockManager; this.supported = typeof lockManager?.request === 'function';
    this.entries = new Map(); this.pending = new Map(); this.closed = false;
  }

  acquire(agentId) {
    if (typeof agentId !== 'string' || !agentId || agentId.length > 128) return Promise.reject(new TypeError('Invalid body agent ID'));
    if (this.closed) return Promise.resolve(false);
    if (this.entries.has(agentId)) return Promise.resolve(true);
    if (this.pending.has(agentId)) return this.pending.get(agentId);
    const name = this.prefix + agentId;
    if (!this.supported) {
      if (localClaims.has(name)) return Promise.resolve(false);
      const token = {}; localClaims.set(name, token);
      this.entries.set(agentId, { release: () => { if (localClaims.get(name) === token) localClaims.delete(name); }, done: Promise.resolve() });
      return Promise.resolve(true);
    }
    let answer, reject;
    const pending = new Promise((resolve, fail) => { answer = resolve; reject = fail; });
    this.pending.set(agentId, pending);
    let request;
    try {
      // ifAvailable is non-queuing and cannot be combined with signal in the
      // native API. The closed check releases a callback arriving after close.
      request = this.lockManager.request(name, { mode: 'exclusive', ifAvailable: true }, async (lock) => {
        if (!lock || this.closed) { answer(false); return; }
        let release;
        const held = new Promise((resolve) => { release = resolve; });
        // The native callback starts asynchronously, after request has been assigned.
        this.entries.set(agentId, { release, get done() { return request; } });
        answer(true); await held;
      });
      Promise.resolve(request).catch((error) => { if (this.closed) answer(false); else reject(error); });
    } catch (error) { reject(error); }
    void pending.finally(() => this.pending.delete(agentId)).catch(() => {});
    return pending;
  }

  async release(agentId) {
    await this.pending.get(agentId);
    const entry = this.entries.get(agentId);
    if (!entry) return;
    entry.release(); await entry.done; this.entries.delete(agentId);
  }

  async close() {
    this.closed = true;
    await Promise.allSettled(this.pending.values());
    await Promise.all([...this.entries.keys()].map((id) => this.release(id)));
  }
}
