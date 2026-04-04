const PUBSUB_ACTIVE_MS = 12000;

const normalizeTransportVia = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;
  if (raw === 'webrtc' || raw === 'webrtc-direct') return 'webrtc';
  if (raw === 'relay-webrtc' || raw === 'webrtc-relay') return 'relay-webrtc';
  if (raw === 'relay') return 'relay';
  if (raw === 'direct' || raw === 'direct-websocket') return 'direct';
  if (raw === 'presence' || raw === 'connection') return null;
  return raw;
};

const normalizeSignalingPath = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;
  if (raw === 'direct') return 'direct';
  if (raw === 'relay-scoped') return 'relay-scoped';
  return null;
};

export const isActiveRelayTransportNeighbor = (neighbor, relayIds) => {
  if (!neighbor) return false;
  const relaySet = relayIds instanceof Set ? relayIds : new Set(relayIds || []);
  const peerId = neighbor?.peerId || neighbor?.id || null;
  if (!peerId || !relaySet.has(peerId)) return false;
  if (!Number.isFinite(neighbor.connectedAt)) return false;
  const via = normalizeTransportVia(neighbor.via);
  const signalingPath = normalizeSignalingPath(neighbor.signalingPath);
  return via === 'direct' || signalingPath === 'direct';
};

export const buildRelayState = (entries, relayIds) => {
  const relaySet = relayIds instanceof Set ? relayIds : new Set(relayIds || []);
  const activeRelayIds = new Set();
  const peerRelayMap = new Map();
  if (!Array.isArray(entries) || relaySet.size === 0) {
    return { relayIds: Array.from(relaySet), activeRelayIds: [], peerRelayMap };
  }
  entries.forEach((peer) => {
    const peerId = peer?.peerId;
    if (!peerId) return;
    const neighbors = Array.isArray(peer.peers) ? peer.peers : [];
    let relayId = null;
    neighbors.forEach((neighbor) => {
      if (!isActiveRelayTransportNeighbor(neighbor, relaySet)) return;
      const id = neighbor?.peerId || neighbor?.id || null;
      if (!id) return;
      activeRelayIds.add(id);
      if (!relayId) relayId = id;
    });
    if (relayId) {
      peerRelayMap.set(peerId, relayId);
    }
  });
  return { relayIds: Array.from(relaySet), activeRelayIds: Array.from(activeRelayIds), peerRelayMap };
};

export const buildPubsubEdges = (peers, relayState = null, now = Date.now()) => {
  const edges = [];
  const peerRelayMap = relayState?.peerRelayMap;

  peers.forEach((peer) => {
    if (!peer?.peerId || peer.isRelay) return;
    const pubsub = peer.pubsub || {};
    const txCount = Number(pubsub.txCount) || 0;
    const rxCount = Number(pubsub.rxCount) || 0;
    const relayPeerId = peerRelayMap?.get(peer.peerId);
    if (!relayPeerId) return;
    const lastTxAt = Number(pubsub.lastTxAt);
    const lastRxAt = Number(pubsub.lastRxAt);
    const txActive = Number.isFinite(lastTxAt) && now - lastTxAt < PUBSUB_ACTIVE_MS;
    const rxActive = Number.isFinite(lastRxAt) && now - lastRxAt < PUBSUB_ACTIVE_MS;
    edges.push({
      from: peer.peerId,
      to: relayPeerId,
      lastTxAt: txActive ? lastTxAt : null,
      lastRxAt: rxActive ? lastRxAt : null,
      txCount,
      rxCount
    });
  });

  return edges;
};
