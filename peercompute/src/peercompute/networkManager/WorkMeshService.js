import { lpStream } from '@libp2p/utils';
import { WorkMesh, WORK_MESH_SCHEMA } from '../workMesh/WorkMesh.js';

export const WORK_MESH_PROTOCOL = '/peercompute/work-mesh/1.0.0';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Length-prefixed JSON frames over one libp2p stream. */
function jsonChannel(stream, maxFrameBytes, onReadBytes = null) {
  const rpc = lpStream(stream, { maxDataLength: maxFrameBytes, maxBufferSize: maxFrameBytes * 2 + 32 });
  return {
    async read() {
      const raw = (await rpc.read()).subarray();
      onReadBytes?.(raw.byteLength);
      return JSON.parse(decoder.decode(raw));
    },
    async write(value) {
      const data = encoder.encode(JSON.stringify(value));
      if (data.length > maxFrameBytes) throw new Error('Work mesh frame exceeds its byte limit');
      await rpc.write(data);
      return data.length;
    },
    abort(error) { try { stream.abort(error); } catch { /* already closed */ } }
  };
}

/**
 * Runs a WorkMesh over a NetworkManager: every direct connection to a peer is a
 * link, and tasks and results travel on a dedicated stream to that peer only.
 * (Messages sent with NetworkManager.sendToPeer go to the whole pubsub mesh.)
 * Work exchanged with each peer is reported to NetworkManager.recordPeerWork,
 * which is what the 'throughput' topology ranks links by.
 *
 * The service is opt-in: nothing uses it unless an application creates one.
 */
export class WorkMeshService {
  /**
   * @param {object} manager a connected NetworkManager
   * @param {object} options
   * @param {(task: object, done: (value: any) => void) => void} options.execute runs one task
   * @param {object} [options.config] WorkMesh overrides
   * @param {number} [options.tickMs]
   * @param {(peerId: string, message: object) => number} [options.shape] extra
   *   milliseconds to hold a payload message before sending it (experiments only)
   * @param {(stream: object, maxFrameBytes: number) => object} [options.channel]
   */
  constructor(manager, { execute, config = {}, tickMs = 100, maxFrameBytes = 16 * 1024 * 1024, maxOutbox = 128, shape = null,
    channel = jsonChannel } = {}) {
    if (!manager || typeof execute !== 'function') throw new TypeError('WorkMeshService requires a manager and execute');
    this.manager = manager;
    this.tickMs = tickMs;
    this.maxFrameBytes = maxFrameBytes;
    this.maxOutbox = Number.isInteger(maxOutbox) && maxOutbox > 0 ? maxOutbox : 128;
    this.shape = typeof shape === 'function' ? shape : null;
    this.channel = channel;
    this.peers = new Map(); // peerId -> { outbox, out, opening, writing }
    this.inbound = new Map(); // channel -> peerId
    this.released = new Map(); // peerId -> time until which the link stays down
    this.releaseLink = (peerId) => this._release(peerId);
    this.timer = null;
    this.closed = false;
    this.bytesSent = 0;
    this.bytesReceived = 0;
    this.streamResets = 0;
    this.peerStreamResets = new Map();
    this.mesh = new WorkMesh({
      nodeId: manager.peerId, config, execute,
      send: (peerId, message) => this._send(peerId, message),
      onWork: (peerId, units) => manager.recordPeerWork?.(peerId, units)
    });
    this._telemetryProvider = (peerId) => this.getPeerTelemetry(peerId);
  }

  getPeerTelemetry(peerId) {
    if (!peerId || this.closed || !this.peers.has(peerId)) return null;
    const rate = this.manager.peerWork?.get?.(peerId)?.rate || 0;
    const linkState = this.mesh?.links?.get?.(peerId) || null;
    const inFlight = linkState?.inFlight?.size || 0;
    const linkCost = Number.isFinite(linkState?.cost) ? linkState.cost : 0;
    const streamResets = this.peerStreamResets.get(peerId) || 0;
    return {
      tasksPerSec: Number(rate.toFixed(3)),
      linkCost: Number(linkCost.toFixed(3)),
      inFlight,
      streamResets
    };
  }

  async start() {
    await this.manager.libp2p.handle(WORK_MESH_PROTOCOL, (stream, connection) => {
      const peerId = connection?.remotePeer?.toString?.();
      if (this.closed || !peerId) { try { stream.abort(new Error('Work mesh is closed')); } catch { /* closed */ } return; }
      let lastReadBytes = 0;
      const channel = this.channel(stream, this.maxFrameBytes, (byteLength) => {
        lastReadBytes = byteLength || 0;
      });
      this._readFrom(peerId, channel, () => {
        const bytes = lastReadBytes;
        lastReadBytes = 0;
        return bytes;
      });
    }, { maxInboundStreams: 64, maxOutboundStreams: 64 });
    // The topology closes a link by asking for it here first.
    this.manager.topologyLinkReleasers?.add(this.releaseLink);
    this.manager.workMeshTelemetryProvider = this._telemetryProvider;
    this.timer = setInterval(() => this.tick(), this.tickMs);
    return this;
  }

  submitJob(job) { return this.mesh.submitJob(job); }

  /** Match links to the current direct connections, then advance the mesh. */
  tick(now = Date.now()) {
    if (this.closed) return;
    const linked = new Map();
    for (const [peerId, until] of this.released) if (until <= now) this.released.delete(peerId);
    for (const peer of this.manager._getConnectionPeers()) {
      if (!peer?.peerId || this.manager.bootstrapPeerIds?.has(peer.peerId) || this.released.has(peer.peerId)) continue;
      const connection = this._directConnection(peer.peerId);
      if (connection) linked.set(peer.peerId, connection);
    }
    for (const peerId of [...this.peers.keys()]) if (!linked.has(peerId)) this._drop(peerId);
    for (const [peerId, connection] of linked) this._link(peerId, connection);
    this.mesh.tick(now);
  }

  snapshot() { return { ...this.mesh.snapshot(), bytesSent: this.bytesSent, bytesReceived: this.bytesReceived, streamResets: this.streamResets, peers: [...this.peers.keys()] }; }

  async stop() {
    if (this.closed) return;
    this.closed = true;
    clearInterval(this.timer);
    this.manager.topologyLinkReleasers?.delete(this.releaseLink);
    if (this.manager.workMeshTelemetryProvider === this._telemetryProvider) {
      this.manager.workMeshTelemetryProvider = null;
    }
    for (const peerId of [...this.peers.keys()]) this._drop(peerId);
    for (const channel of this.inbound.keys()) channel.abort(new Error('Work mesh is closed'));
    this.mesh.destroy();
    try { await this.manager.libp2p.unhandle(WORK_MESH_PROTOCOL); } catch { /* node already stopped */ }
  }

  /**
   * A connection through a relay circuit is not a link: its traffic goes via the
   * relay. Work uses only peer-to-peer connections (WebRTC, or a direct dial).
   * Selects deterministically with the same priority order as NetworkManager's
   * duplicate-connection pruner so both ends open streams on the primary link.
   */
  _directConnection(peerId) {
    const candidates = this.manager._getConnectionsForPeer(peerId).filter((connection) => {
      if (connection?.status !== 'open' || connection.limits) return false;
      const address = String(connection.remoteAddr ?? '');
      return !address.includes('/p2p-circuit') || address.includes('/webrtc');
    });
    if (candidates.length <= 1) return candidates[0] || null;
    const selfId = this.manager.peerId;
    const preferredDir = (selfId && String(selfId) < String(peerId)) ? 'outbound' : 'inbound';
    candidates.sort((a, b) => {
      const aDirect = !String(a.remoteAddr ?? '').includes('/p2p-circuit') ? 1 : 0;
      const bDirect = !String(b.remoteAddr ?? '').includes('/p2p-circuit') ? 1 : 0;
      if (aDirect !== bDirect) return bDirect - aDirect;
      const aDir = String(a?.direction || a?.stat?.direction || '').toLowerCase() === preferredDir ? 1 : 0;
      const bDir = String(b?.direction || b?.stat?.direction || '').toLowerCase() === preferredDir ? 1 : 0;
      if (aDir !== bDir) return bDir - aDir;
      const aOpen = Number(a?.timeline?.open ?? a?.stat?.timeline?.open ?? Number.MAX_SAFE_INTEGER);
      const bOpen = Number(b?.timeline?.open ?? b?.stat?.timeline?.open ?? Number.MAX_SAFE_INTEGER);
      return aOpen - bOpen;
    });
    return candidates[0] || null;
  }

  _link(peerId, connection) {
    let peer = this.peers.get(peerId);
    if (!peer) {
      peer = { outbox: [], out: null, opening: false, writing: false };
      this.peers.set(peerId, peer);
      this.mesh.linkUp(peerId);
    }
    if (peer.out || peer.opening || !connection) return;
    peer.opening = true;
    Promise.resolve().then(() => connection.newStream(WORK_MESH_PROTOCOL)).then((stream) => {
      peer.opening = false;
      const channel = this.channel(stream, this.maxFrameBytes);
      if (this.closed || this.peers.get(peerId) !== peer) { channel.abort(new Error('Work mesh link is gone')); return; }
      peer.out = channel;
      this._flush(peerId, peer);
    }, () => { peer.opening = false; }); // retried on the next tick
  }

  /** Close this link's streams so the connection can be retired, and keep it down briefly. */
  _release(peerId) {
    this.released.set(peerId, Date.now() + 5000);
    this._drop(peerId);
    for (const [channel, owner] of this.inbound) if (owner === peerId) channel.abort(new Error('Work mesh link released'));
  }

  _reset(peerId, peer) {
    peer.out?.abort(new Error('Work mesh stream failed'));
    peer.out = null;
    peer.outbox = [];
    this.streamResets += 1;
    this.peerStreamResets.set(peerId, (this.peerStreamResets.get(peerId) || 0) + 1);
    this.mesh.linkDown(peerId);
    this.mesh.linkUp(peerId);
  }

  _drop(peerId) {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    this.peers.delete(peerId);
    peer.out?.abort(new Error('Work mesh link closed'));
    this.mesh.linkDown(peerId);
  }

  _send(peerId, message) {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    // Only the latest queue report matters; coalesce any queued 'state' frame
    // so heartbeats never pile up behind payloads or bloat the outbox.
    if (message.type === 'state') {
      const existingIdx = peer.outbox.findIndex((entry) => entry?.type === 'state');
      if (existingIdx !== -1) {
        peer.outbox[existingIdx] = message;
        this._flush(peerId, peer);
        return;
      }
    }
    if (peer.outbox.length >= this.maxOutbox) {
      // Drop stale 'state' frames first to make room; if still saturated,
      // reset the stalled stream cleanly so unacknowledged work is recovered
      // without unbounded memory growth.
      peer.outbox = peer.outbox.filter((entry) => entry?.type !== 'state');
      if (peer.outbox.length >= this.maxOutbox) {
        this._reset(peerId, peer);
        return;
      }
    }
    peer.outbox.push(message);
    this._flush(peerId, peer);
  }

  async _flush(peerId, peer) {
    if (peer.writing || !peer.out) return;
    peer.writing = true;
    try {
      while (peer.outbox.length && this.peers.get(peerId) === peer && peer.out) {
        const message = peer.outbox.shift();
        if (this.shape && (message.type === 'work' || message.type === 'results')) {
          const wait = this.shape(peerId, message);
          if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
        }
        const written = await peer.out.write(message);
        const txBytes = Number.isFinite(written) && written > 0 ? written : 0;
        this.bytesSent += txBytes;
        if (txBytes > 0) {
          this.manager.recordPeerBytes?.(peerId, { txBytes });
        }
      }
    } catch {
      // A frame may be lost, so the mesh takes back whatever was unacknowledged.
      // If the underlying direct connection itself closed (e.g., remote topology
      // eviction), drop the link cleanly instead of counting a stream reset on a
      // dead connection. If a direct connection is still open, keep the link and
      // open a fresh stream on the next tick.
      peer.writing = false;
      if (this.peers.get(peerId) === peer) {
        if (!this._directConnection(peerId)) this._drop(peerId);
        else this._reset(peerId, peer);
      }
    } finally {
      peer.writing = false;
    }
  }

  async _readFrom(peerId, channel, takeReadBytes = null) {
    this.inbound.set(channel, peerId);
    try {
      for (;;) {
        const message = await channel.read();
        if (this.closed) break;
        const measured = typeof takeReadBytes === 'function' ? takeReadBytes() : 0;
        const rxBytes = measured > 0 ? measured : (message ? encoder.encode(JSON.stringify(message)).byteLength : 0);
        if (rxBytes > 0) {
          this.bytesReceived += rxBytes;
          this.manager.recordPeerBytes?.(peerId, { rxBytes });
        }
        if (message?.schema !== WORK_MESH_SCHEMA) continue;
        // The peer may open its stream before this node has noticed the connection.
        if (this.released.has(peerId)) break;
        if (!this.peers.has(peerId)) this._link(peerId, this._directConnection(peerId));
        this.mesh.receive(peerId, message);
      }
    } catch { /* the stream ended */ } finally {
      this.inbound.delete(channel);
      channel.abort(new Error('Work mesh stream ended'));
    }
  }
}
