import { isIP } from 'node:net';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';
import { floodsub } from '@libp2p/floodsub';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { peerIdFromString } from '@libp2p/peer-id';
import { multiaddr } from '@multiformats/multiaddr';
import { acquireIdentity } from './identity.js';

export const NATIVE_RELAY_DEFAULTS = Object.freeze({
  enabled: false, maxReservations: 16, reservationTtlMs: 3_600_000,
  maxCircuitDurationMs: 300_000, maxCircuitBytes: 64 * 1024 * 1024, maxStreamsPerPeer: 8,
});

function integer(value, name, minimum = 1, maximum = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new TypeError(`${name} must be an integer from ${minimum} to ${maximum}.`);
  return value;
}

function peerIds(values) {
  if (!Array.isArray(values)) throw new TypeError('hostedPeerIds must be an array.');
  return new Set(values.map((value) => peerIdFromString(String(value)).toString()));
}

/** A native socket/relay companion, not a second compute runtime or root authority.
 * TLS cert/key are PEM strings or Buffers. No process signals or global config
 * are installed. The caller owns start/stop and its browser's separate identity.
 */
export function createNativeCompanion(options = {}) {
  if (typeof options.identityPath !== 'string' || !options.identityPath.trim()) throw new TypeError('identityPath is required.');
  const host = options.listenHost === 'localhost' ? '127.0.0.1' : options.listenHost ?? '127.0.0.1';
  if (!isIP(host)) throw new TypeError('listenHost must be an IP address or localhost.');
  const port = integer(options.listenPort ?? 0, 'listenPort', 0, 65535);
  const maxConnections = integer(options.maxConnections ?? 64, 'maxConnections', 1, 4096);
  const relay = { ...NATIVE_RELAY_DEFAULTS, ...options.relay };
  if (typeof relay.enabled !== 'boolean') throw new TypeError('relay.enabled must be a boolean.');
  for (const name of ['maxReservations', 'reservationTtlMs', 'maxCircuitDurationMs', 'maxCircuitBytes', 'maxStreamsPerPeer']) integer(relay[name], `relay.${name}`);
  integer(relay.reservationTtlMs, 'relay.reservationTtlMs', 1, 2_147_483_647);
  integer(relay.maxCircuitDurationMs, 'relay.maxCircuitDurationMs', 1, 2_147_483_647);
  const tls = options.tls;
  if (tls && (!tls.cert || !tls.key)) throw new TypeError('tls requires both cert and key.');
  const announce = (options.announce ?? []).map((value) => {
    const address = multiaddr(value).toString();
    if (!/\/(?:ws|wss)(?:\/p2p\/[^/]+)?$/.test(address) || address.includes('/p2p-circuit')) throw new TypeError('announce must contain direct WS/WSS multiaddrs.');
    return address;
  });
  let hosted = peerIds(options.hostedPeerIds ?? []);
  let state = 'stopped', node, identity, starting, stopping, lastError = null, peerId = null;
  const topics = new Set();
  const allows = (id) => relay.enabled || hosted.has(id.toString());

  function getStatus() {
    const listenMultiaddrs = node?.getMultiaddrs().map(String) ?? [];
    // Announce addresses may replace getMultiaddrs(), so take actual bound
    // addresses from the transport listeners for local browser bootstrapping.
    const bound = node?.services.hostAddresses.getListenMultiaddrs().map(String) ?? [];
    const withPeer = (address) => address.endsWith(`/p2p/${peerId}`) ? address : `${address}/p2p/${peerId}`;
    const localMultiaddrs = [...new Set(bound.map((address) => withPeer(address
      .replace('/ip4/0.0.0.0/', '/ip4/127.0.0.1/').replace('/ip6/::/', '/ip6/::1/'))))];
    return { state, peerId, localMultiaddrs, listenMultiaddrs: bound.map(withPeer),
      advertisedMultiaddrs: listenMultiaddrs, connections: node?.getConnections().length ?? 0,
      reservations: node?.services.relay.reservations.size ?? 0, hostedPeerIds: [...hosted],
      maxConnections, relay: { ...relay, mode: relay.enabled ? 'public' : 'hosted-only' },
      pubsubTopics: [...topics], lastError };
  }

  async function setHostedPeerIds(values) {
    const previous = hosted;
    hosted = peerIds(values);
    if (node && !relay.enabled) {
      for (const value of previous) {
        if (hosted.has(value)) continue;
        const id = peerIdFromString(value);
        node.services.relay.reservations.delete(id);
        await node.hangUp(id);
      }
    }
    return getStatus();
  }

  async function start() {
    if (stopping) await stopping;
    if (state === 'running') return getStatus();
    if (starting) return starting;
    state = 'starting';
    starting = (async () => {
      try {
        identity = await acquireIdentity(options.identityPath);
        peerId = identity.peerId.toString();
        for (const address of announce) {
          const advertisedPeer = address.match(/\/p2p\/([^/]+)$/)?.[1];
          if (advertisedPeer && advertisedPeer !== peerId) throw new Error('Announce address has a different native peer identity.');
        }
        node = await createLibp2p({
          privateKey: identity.privateKey, start: false,
          addresses: { listen: [`/ip${isIP(host)}/${host}/tcp/${port}/${tls ? 'wss' : 'ws'}`], ...(announce.length ? { announce } : {}) },
          transports: [webSockets(tls ? { https: { cert: tls.cert, key: tls.key } } : {})],
          connectionEncrypters: [noise()], streamMuxers: [yamux()],
          connectionManager: { maxConnections, maxIncomingPendingConnections: Math.min(maxConnections, 16),
            inboundConnectionThreshold: Math.max(5, Math.min(maxConnections, 32)) },
          connectionGater: {
            denyInboundRelayReservation: (id) => !allows(id),
            denyOutboundRelayedConnection: (_source, destination) => !allows(destination),
          },
          services: { identify: identify(), ping: ping(), pubsub: floodsub({ emitSelf: false }),
            hostAddresses: (components) => ({ getListenMultiaddrs: () => components.transportManager.getListeners()
              .flatMap((listener) => listener.getAddrs()) }),
            relay: circuitRelayServer({
              maxInboundHopStreams: relay.maxStreamsPerPeer, maxOutboundStopStreams: relay.maxStreamsPerPeer,
              reservations: { maxReservations: relay.maxReservations, reservationTtl: relay.reservationTtlMs,
                // Installed circuit-relay-v2 enforces this in milliseconds;
                // its wire metadata is currently interpreted as seconds by
                // clients. The server cutoff and our status are authoritative.
                applyDefaultLimit: true, defaultDurationLimit: relay.maxCircuitDurationMs, defaultDataLimit: BigInt(relay.maxCircuitBytes) },
            }) },
        });
        // Room-specific subscriptions requested by owned clients are bounded.
        // This mirrors the existing relay's discovery forwarding without its
        // global configuration writers, directory or process-level handlers.
        node.services.pubsub.addEventListener('subscription-change', (event) => {
          if (!event.detail?.peerId || !allows(event.detail.peerId)) return;
          for (const entry of event.detail.subscriptions ?? []) {
            const topic = entry.topic;
            if (!entry.subscribe || typeof topic !== 'string' || topic.length > 256 || topics.size >= 128) continue;
            if (!/^(?:pc\.|peercompute[.-])/.test(topic) || topics.has(topic)) continue;
            topics.add(topic); node.services.pubsub.subscribe(topic);
          }
        });
        await node.start();
        state = 'running'; lastError = null;
        return getStatus();
      } catch (error) {
        lastError = error.message;
        await node?.stop().catch(() => {}); node = undefined;
        await identity?.release(); identity = undefined;
        state = 'failed'; throw error;
      } finally { starting = undefined; }
    })();
    return starting;
  }

  async function stop() {
    if (stopping) return stopping;
    stopping = (async () => {
      await starting?.catch(() => {});
      state = 'stopping';
      try { await node?.stop(); } finally {
        node = undefined; topics.clear();
        await identity?.release(); identity = undefined; state = 'stopped';
      }
      return getStatus();
    })();
    try { return await stopping; } finally { stopping = undefined; }
  }
  return Object.freeze({ start, stop, getStatus, setHostedPeerIds });
}
