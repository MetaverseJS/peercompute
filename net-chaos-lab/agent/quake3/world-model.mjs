import { clamp, distance2d, distance3d, length2d } from './math.mjs';

export const DEFAULT_STALE_PEER_MS = 12000;

export const DEFAULT_Q3_CAPABILITIES = Object.freeze({
  primaryAttack: false,
  primaryRange: 3.2,
  interact: false,
  descend: false,
  verticalMovement: false
});

const toFiniteNumber = (value, fallback = 0) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

const normalizePosition = (value) => {
  if (!value || typeof value !== 'object') return null;
  return {
    x: toFiniteNumber(value.x, 0),
    y: toFiniteNumber(value.y, 0),
    z: toFiniteNumber(value.z, 0)
  };
};

const normalizeVelocity = (value) => {
  if (!value || typeof value !== 'object') return { x: 0, y: 0, z: 0 };
  return {
    x: toFiniteNumber(value.x, 0),
    y: toFiniteNumber(value.y, 0),
    z: toFiniteNumber(value.z, 0)
  };
};

const normalizeBounds = (value) => {
  if (!value || typeof value !== 'object') return null;
  const center = normalizePosition(value.center);
  const radius = toFiniteNumber(value.radius, 0);
  if (!center || radius <= 0) return null;
  return { center, radius };
};

const normalizePeer = (peer, localPosition, stalePeerMs) => {
  const id = peer?.id ? String(peer.id) : '';
  const position = normalizePosition(peer?.position);
  if (!id || !position) return null;
  const lastSeenAgeMs = toFiniteNumber(peer?.lastSeenAgeMs, 0);
  const health = Number.isFinite(Number(peer?.health)) ? clamp(Number(peer.health), 0, 1) : null;
  const threat = toFiniteNumber(peer?.threat, 0);
  return {
    id,
    position,
    velocity: normalizeVelocity(peer?.velocity),
    health,
    threat,
    visible: peer?.visible !== false,
    primaryRange: Number.isFinite(Number(peer?.primaryRange)) ? Math.max(0, Number(peer.primaryRange)) : null,
    lastSeenAgeMs,
    stale: lastSeenAgeMs > stalePeerMs,
    distance2d: distance2d(localPosition, position),
    distance3d: distance3d(localPosition, position)
  };
};

const normalizeItem = (item, localPosition) => {
  const id = item?.id ? String(item.id) : '';
  const position = normalizePosition(item?.position);
  if (!id || !position) return null;
  return {
    id,
    kind: String(item?.kind || 'generic').trim().toLowerCase() || 'generic',
    position,
    value: toFiniteNumber(item?.value, 1),
    available: item?.available !== false,
    distance2d: distance2d(localPosition, position)
  };
};

const normalizeObjective = (objective, localPosition) => {
  const id = objective?.id ? String(objective.id) : '';
  const position = normalizePosition(objective?.position);
  if (!id || !position) return null;
  return {
    id,
    kind: String(objective?.kind || 'objective').trim().toLowerCase() || 'objective',
    position,
    value: toFiniteNumber(objective?.value, 1),
    distance2d: distance2d(localPosition, position)
  };
};

const normalizeHazard = (hazard, localPosition) => {
  const position = normalizePosition(hazard?.position);
  if (!position) return null;
  return {
    id: hazard?.id ? String(hazard.id) : `hazard-${position.x}-${position.z}`,
    position,
    radius: Math.max(0, toFiniteNumber(hazard?.radius, 0)),
    intensity: toFiniteNumber(hazard?.intensity, 1),
    distance2d: distance2d(localPosition, position)
  };
};

const normalizeNavPoint = (navPoint, localPosition) => {
  const id = navPoint?.id ? String(navPoint.id) : '';
  const position = normalizePosition(navPoint?.position);
  if (!id || !position) return null;
  return {
    id,
    position,
    distance2d: distance2d(localPosition, position)
  };
};

export const normalizeQuake3Snapshot = (
  snapshot,
  { stalePeerMs = DEFAULT_STALE_PEER_MS } = {}
) => {
  const localPosition = normalizePosition(snapshot?.localPosition);
  const world = {
    gameId: String(snapshot?.gameId || 'arena').trim().toLowerCase() || 'arena',
    localId: snapshot?.localId ? String(snapshot.localId) : null,
    localPosition,
    localVelocity: normalizeVelocity(snapshot?.localVelocity),
    localSpeed2d: length2d(snapshot?.localVelocity),
    localRotation: toFiniteNumber(snapshot?.localRotation, 0),
    localPitch: toFiniteNumber(snapshot?.localPitch, 0),
    localHealth: Number.isFinite(Number(snapshot?.localHealth))
      ? clamp(Number(snapshot.localHealth), 0, 1)
      : null,
    capabilities: {
      ...DEFAULT_Q3_CAPABILITIES,
      ...(snapshot?.capabilities && typeof snapshot.capabilities === 'object' ? snapshot.capabilities : {})
    },
    peers: [],
    freshPeers: [],
    visiblePeers: [],
    items: [],
    objectives: [],
    hazards: [],
    navPoints: [],
    bounds: normalizeBounds(snapshot?.bounds),
    metadata: snapshot?.metadata && typeof snapshot.metadata === 'object' ? { ...snapshot.metadata } : {}
  };

  if (!localPosition) {
    return world;
  }

  world.peers = Array.isArray(snapshot?.peers)
    ? snapshot.peers
        .map((peer) => normalizePeer(peer, localPosition, stalePeerMs))
        .filter(Boolean)
        .sort((left, right) => left.distance2d - right.distance2d || right.threat - left.threat)
    : [];
  world.freshPeers = world.peers.filter((peer) => !peer.stale);
  world.visiblePeers = world.freshPeers.filter((peer) => peer.visible !== false);
  world.nearestPeer = world.freshPeers[0] || null;

  world.items = Array.isArray(snapshot?.items)
    ? snapshot.items
        .map((item) => normalizeItem(item, localPosition))
        .filter(Boolean)
        .filter((item) => item.available)
        .sort((left, right) => left.distance2d - right.distance2d || right.value - left.value)
    : [];

  world.objectives = Array.isArray(snapshot?.objectives)
    ? snapshot.objectives
        .map((objective) => normalizeObjective(objective, localPosition))
        .filter(Boolean)
        .sort((left, right) => left.distance2d - right.distance2d || right.value - left.value)
    : [];

  world.hazards = Array.isArray(snapshot?.hazards)
    ? snapshot.hazards
        .map((hazard) => normalizeHazard(hazard, localPosition))
        .filter(Boolean)
        .sort((left, right) => left.distance2d - right.distance2d)
    : [];

  world.navPoints = Array.isArray(snapshot?.navPoints)
    ? snapshot.navPoints
        .map((navPoint) => normalizeNavPoint(navPoint, localPosition))
        .filter(Boolean)
        .sort((left, right) => left.distance2d - right.distance2d)
    : [];

  return world;
};
