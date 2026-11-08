import { fetchCappedJson } from './http.js';
import { normalizeOverviewLocation } from './globeMath.js';

export const ROADVECTOR_PRESENCE_SCHEMA = 'peercompute.roadvector.presence.v1';
export const ROADVECTOR_PRESENCE_PRECISION_DEGREES = 0.1;
export const ROADVECTOR_PRESENCE_MAXIMUM_PEERS = 64;
export const ROADVECTOR_PRESENCE_MAXIMUM_AGE_MS = 15_000;
export const ROADVECTOR_PRESENCE_MAXIMUM_CONNECTIONS = 8;

const PUBLIC_ADDRESS_VALUE_PROTOCOLS = new Set([
  'ip4', 'ip6', 'dns', 'dns4', 'dns6', 'dnsaddr', 'tcp', 'udp', 'sni', 'p2p', 'certhash',
]);
const PUBLIC_ADDRESS_FLAG_PROTOCOLS = new Set([
  'ws', 'wss', 'tls', 'quic', 'quic-v1', 'p2p-circuit', 'webrtc', 'webrtc-direct', 'webtransport',
]);
const CONNECTION_STATUSES = new Set(['open', 'closing', 'closed']);
const CONNECTION_ENCRYPTIONS = new Set(['/noise', '/tls/1.0.0', 'native']);

function publicConnectionString(value, maximumLength, pattern) {
  try {
    const text = typeof value === 'string' ? value : value?.toString?.();
    return typeof text === 'string' && text.length <= maximumLength && pattern.test(text)
      ? text
      : null;
  } catch (_) {
    return null;
  }
}

function publicConnectionAddress(value) {
  const address = publicConnectionString(value, 2_048, /^\/[A-Za-z0-9.:/_~-]+$/);
  if (!address) return null;
  const components = address.slice(1).split('/');
  for (let index = 0; index < components.length; index += 1) {
    const protocol = components[index];
    if (PUBLIC_ADDRESS_VALUE_PROTOCOLS.has(protocol)) {
      if (!components[++index]) return null;
    } else if (!PUBLIC_ADDRESS_FLAG_PROTOCOLS.has(protocol)) {
      // In particular, do not expose HTTP paths, URL credentials, or queries.
      return null;
    }
  }
  return address;
}

function connectionSnapshots(manager) {
  let connections;
  try {
    connections = manager?.getLibp2pNode?.()?.getConnections?.();
  } catch (_) {
    return Object.freeze([]);
  }
  if (!Array.isArray(connections)) return Object.freeze([]);
  const snapshots = [];
  // Prefer open connections if libp2p retains closing entries during a transition.
  for (const open of [true, false]) {
    for (const connection of connections) {
      if (!connection || (connection.status === 'open') !== open) continue;
      snapshots.push(Object.freeze({
        remotePeer: publicConnectionString(connection.remotePeer, 256, /^[A-Za-z0-9]+$/),
        address: publicConnectionAddress(connection.remoteAddr),
        status: CONNECTION_STATUSES.has(connection.status) ? connection.status : 'unknown',
        encryption: CONNECTION_ENCRYPTIONS.has(connection.encryption) ? connection.encryption : 'unknown',
        limited: Boolean(connection.limits),
      }));
      if (snapshots.length === ROADVECTOR_PRESENCE_MAXIMUM_CONNECTIONS) return Object.freeze(snapshots);
    }
  }
  return Object.freeze(snapshots);
}

const ELIGIBLE_LOCATION_SOURCES = new Set([
  'api',
  'browser-geolocation',
  'manual',
  'user-selected-anchor',
]);

function roundCell(value, precision) {
  const rounded = Math.round(value / precision) * precision;
  return Object.is(rounded, -0) ? 0 : Number(rounded.toFixed(6));
}

export function coarseRoadvectorPresence(location, {
  source,
  mode = 'overview',
  precisionDegrees = ROADVECTOR_PRESENCE_PRECISION_DEGREES,
} = {}) {
  if (!ELIGIBLE_LOCATION_SOURCES.has(source)) return null;
  if (!Number.isFinite(precisionDegrees) || precisionDegrees < 0.1 || precisionDegrees > 5) {
    throw new RangeError('Presence precision must be between 0.1 and 5 degrees.');
  }
  const normalized = normalizeOverviewLocation(location);
  if (!['overview', 'ride'].includes(mode)) throw new RangeError('Presence mode must be overview or ride.');
  return Object.freeze({
    schema: ROADVECTOR_PRESENCE_SCHEMA,
    longitudeCell: roundCell(normalized.longitude, precisionDegrees),
    latitudeCell: roundCell(normalized.latitude, precisionDegrees),
    precisionDegrees,
    mode,
  });
}

export function validateRoadvectorPresence(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (value.schema !== ROADVECTOR_PRESENCE_SCHEMA) return null;
  const longitude = Number(value.longitudeCell);
  const latitude = Number(value.latitudeCell);
  const precision = Number(value.precisionDegrees);
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null;
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null;
  if (!Number.isFinite(precision) || precision < 0.1 || precision > 5) return null;
  if (!['overview', 'ride'].includes(value.mode)) return null;
  const longitudeSteps = longitude / precision;
  const latitudeSteps = latitude / precision;
  if (Math.abs(longitudeSteps - Math.round(longitudeSteps)) > 1e-6) return null;
  if (Math.abs(latitudeSteps - Math.round(latitudeSteps)) > 1e-6) return null;
  return Object.freeze({
    schema: ROADVECTOR_PRESENCE_SCHEMA,
    longitude,
    latitude,
    precisionDegrees: precision,
    mode: value.mode,
  });
}

export function collectRoadvectorPeers(peers, {
  now = Date.now(),
  maximumAgeMs = ROADVECTOR_PRESENCE_MAXIMUM_AGE_MS,
  maximumPeers = ROADVECTOR_PRESENCE_MAXIMUM_PEERS,
} = {}) {
  if (!Array.isArray(peers)) return Object.freeze([]);
  const markers = [];
  const seen = new Set();
  for (const peer of peers) {
    const peerId = String(peer?.peerId ?? '').trim();
    const lastSeen = Number(peer?.lastSeen);
    if (!peerId || seen.has(peerId) || !Number.isFinite(lastSeen) || now - lastSeen > maximumAgeMs || lastSeen > now + 1_000) {
      continue;
    }
    const presence = validateRoadvectorPresence(peer?.capabilities?.roadvector);
    if (!presence) continue;
    seen.add(peerId);
    markers.push(Object.freeze({
      peerId,
      longitude: presence.longitude,
      latitude: presence.latitude,
      precisionDegrees: presence.precisionDegrees,
      mode: presence.mode,
      lastSeen,
      color: '#ff334f',
    }));
  }
  markers.sort((left, right) => left.peerId.localeCompare(right.peerId));
  return Object.freeze(markers.slice(0, maximumPeers));
}

function relayConfigSubset(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const bootstrapPeers = [...new Set((Array.isArray(payload.bootstrapPeers) ? payload.bootstrapPeers : [])
    .map((entry) => String(entry ?? '').trim())
    .filter((entry) => entry.startsWith('/') && entry.length <= 2_048))]
    .slice(0, 16);
  if (bootstrapPeers.length === 0) return null;
  return Object.freeze({
    bootstrapPeers: Object.freeze(bootstrapPeers),
    webrtc: payload.webrtc && typeof payload.webrtc === 'object' ? structuredClone(payload.webrtc) : undefined,
    pubsubType: payload.pubsubType === 'gossipsub' ? 'gossipsub' : 'floodsub',
    gossipsub: payload.gossipsub && typeof payload.gossipsub === 'object'
      ? structuredClone(payload.gossipsub)
      : undefined,
  });
}

export async function loadRoadvectorRelayConfig({
  fetchImpl = globalThis.fetch,
  signal,
} = {}) {
  let source = null;
  for (const path of ['./relay-config-source.json', './.relay-config-source.json']) {
    try {
      source = await fetchCappedJson(path, {
        fetchImpl,
        signal,
        cache: 'no-store',
        maximumBytes: 16 * 1024,
        label: 'PeerCompute relay config source',
      });
      if (source) break;
    } catch (_) {
      // Continue to the checked-in config fallback.
    }
  }
  const sourceUrl = typeof source?.relayConfigUrl === 'string' ? source.relayConfigUrl.trim() : '';
  if (sourceUrl) {
    const parsed = new URL(sourceUrl, globalThis.location?.href);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'secretworkshop.net') {
      throw new TypeError('PeerCompute relay config source is outside the approved HTTPS host.');
    }
    const remote = relayConfigSubset(await fetchCappedJson(parsed.toString(), {
      fetchImpl,
      signal,
      cache: 'no-store',
      maximumBytes: 64 * 1024,
      label: 'PeerCompute relay config',
    }));
    if (remote) return remote;
  }
  for (const path of ['./relay-config.json', './.relay-config.json']) {
    try {
      const local = relayConfigSubset(await fetchCappedJson(path, {
        fetchImpl,
        signal,
        cache: 'no-store',
        maximumBytes: 64 * 1024,
        label: 'PeerCompute relay config',
      }));
      if (local) return local;
    } catch (_) {
      // Try the next bounded fallback.
    }
  }
  throw new Error('No verified PeerCompute relay configuration is available.');
}

async function defaultNetworkManagerFactory(config) {
  const { NetworkManager } = await import('../../../../peercompute/src/peercompute/networkManager/NetworkManager.js');
  return new NetworkManager(config);
}

export class RoadvectorPresenceRuntime {
  #fetchImpl;
  #networkManagerFactory;
  #clock;
  #manager = null;
  #localPresence = null;
  #status = 'idle';
  #error = null;
  #disposed = false;

  constructor({
    fetchImpl = globalThis.fetch,
    networkManagerFactory = defaultNetworkManagerFactory,
    clock = () => Date.now(),
  } = {}) {
    this.#fetchImpl = fetchImpl;
    this.#networkManagerFactory = networkManagerFactory;
    this.#clock = clock;
  }

  setLocation(location, { source, mode = 'overview' } = {}) {
    this.#localPresence = coarseRoadvectorPresence(location, { source, mode });
  }

  clearLocation() {
    this.#localPresence = null;
  }

  setMode(mode) {
    if (!this.#localPresence) return;
    this.#localPresence = Object.freeze({ ...this.#localPresence, mode });
  }

  async start({ signal } = {}) {
    if (this.#disposed) throw new Error('RoadVector presence runtime is disposed.');
    if (this.#manager) return this.getSnapshot();
    this.#status = 'connecting';
    try {
      const relay = await loadRoadvectorRelayConfig({ fetchImpl: this.#fetchImpl, signal });
      if (signal?.aborted) throw signal.reason ?? new DOMException('Aborted', 'AbortError');
      const manager = await this.#networkManagerFactory({
        ...relay,
        gameId: 'roadvector',
        roomId: 'roadvector-world',
        topologyId: 'roadvector-presence',
        topology: 'distributed',
        maxConnections: ROADVECTOR_PRESENCE_MAXIMUM_CONNECTIONS,
        targetConnections: 4,
        connectionRadius: 1,
        enableScheduler: false,
        presenceIntervalMs: 3_000,
        presenceCapabilitiesProvider: () => (
          this.#localPresence ? { roadvector: this.#localPresence } : null
        ),
      });
      await manager.initialize();
      await manager.connect();
      this.#manager = manager;
      this.#status = 'connected';
      this.#error = null;
    } catch (error) {
      this.#status = 'unavailable';
      this.#error = error instanceof Error ? error.message : String(error);
    }
    return this.getSnapshot();
  }

  getSnapshot() {
    const connections = connectionSnapshots(this.#manager);
    const connected = connections.some((connection) => connection.status === 'open');
    const status = this.#status === 'connected' && !connected ? 'disconnected' : this.#status;
    const peers = collectRoadvectorPeers(this.#manager?.getConnectedPeers?.() ?? [], {
      now: this.#clock(),
    });
    return Object.freeze({
      schemaVersion: 'peercompute.roadvector.player-presence-snapshot.v1',
      status,
      error: this.#error,
      connected,
      connections,
      maximumConnections: ROADVECTOR_PRESENCE_MAXIMUM_CONNECTIONS,
      publishingLocation: Boolean(this.#localPresence),
      localPrecisionDegrees: this.#localPresence?.precisionDegrees ?? null,
      remotePlayerCount: peers.length,
      maximumPlayers: ROADVECTOR_PRESENCE_MAXIMUM_PEERS,
      players: peers,
      synthetic: false,
      liveTraffic: false,
      colorPolicy: 'fixed-red-remote-players',
    });
  }

  async dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    const manager = this.#manager;
    this.#manager = null;
    if (manager?.disconnect) await manager.disconnect().catch(() => {});
    this.#status = 'disposed';
  }
}

export function createRoadvectorPresenceRuntime(options) {
  return new RoadvectorPresenceRuntime(options);
}
