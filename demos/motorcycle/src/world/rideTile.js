import { WEB_MERCATOR_MAX_LATITUDE } from '@peercompute/geo-core';

const WGS84_EQUATORIAL_CIRCUMFERENCE_METERS = 2 * Math.PI * 6_378_137;

export const RIDE_TILE_LIMITS = Object.freeze({
  minimumZoom: 12,
  maximumZoom: 14,
  minimumGroundWidthMeters: 750,
  activeRadius: 1,
  desiredRadius: 2,
  maximumActiveTiles: 9,
  maximumDesiredTiles: 25,
});

export const RIDE_TILE_POLAR_DISCLOSURE = Object.freeze({
  schemaVersion: 'peercompute.motorcycle.ride-tile-polar-disclosure.v1',
  supportedLatitudeRange: Object.freeze([
    -WEB_MERCATOR_MAX_LATITUDE,
    WEB_MERCATOR_MAX_LATITUDE,
  ]),
  sourceProjection: 'web-mercator',
  behavior: 'unsupported-not-clamped',
  reason: 'AWS Terrarium and OpenStreetMap Shortbread do not cover either polar cap.',
});

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

function normalizeLongitude(value) {
  const longitude = finite(value, 'longitude');
  const wrapped = ((longitude + 180) % 360 + 360) % 360 - 180;
  return Object.is(wrapped, -0) ? 0 : wrapped;
}

function zoomLevel(value) {
  if (!Number.isInteger(value)
    || value < RIDE_TILE_LIMITS.minimumZoom
    || value > RIDE_TILE_LIMITS.maximumZoom) {
    throw new RangeError(
      `Ride tile zoom must be an integer between ${RIDE_TILE_LIMITS.minimumZoom} and ${RIDE_TILE_LIMITS.maximumZoom}.`,
    );
  }
  return value;
}

function modulo(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function latitudeForWorldY(worldY, tileCount) {
  const mercatorY = Math.PI * (1 - 2 * worldY / tileCount);
  return Math.atan(Math.sinh(mercatorY)) * 180 / Math.PI;
}

export function normalizeRideTile(tile) {
  if (!tile || typeof tile !== 'object' || Array.isArray(tile)) {
    throw new TypeError('A ride tile coordinate is required.');
  }
  const z = zoomLevel(Number(tile.z));
  if (!Number.isInteger(tile.x) || !Number.isInteger(tile.y)) {
    throw new RangeError('Ride tile x/y coordinates must be integers.');
  }
  const tileCount = 2 ** z;
  if (tile.y < 0 || tile.y >= tileCount) {
    throw new RangeError(`Ride tile y is outside the z${z} Web Mercator matrix.`);
  }
  const x = modulo(tile.x, tileCount);
  return Object.freeze({ z, x, y: tile.y, key: `${z}/${x}/${tile.y}` });
}

export function rideTileKey(tile) {
  return normalizeRideTile(tile).key;
}

export function rideTileBounds(tile) {
  const normalized = normalizeRideTile(tile);
  const tileCount = 2 ** normalized.z;
  const west = normalized.x / tileCount * 360 - 180;
  const east = (normalized.x + 1) / tileCount * 360 - 180;
  const north = latitudeForWorldY(normalized.y, tileCount);
  const south = latitudeForWorldY(normalized.y + 1, tileCount);
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.ride-tile-bounds.v1',
    tile: normalized,
    bbox: Object.freeze([south, west, north, east]),
    south,
    west,
    north,
    east,
  });
}

export function rideTileCoverage({ longitude, latitude } = {}) {
  const normalizedLongitude = normalizeLongitude(longitude);
  const resolvedLatitude = finite(latitude, 'latitude');
  if (resolvedLatitude < -90 || resolvedLatitude > 90) {
    throw new RangeError('latitude must be between -90 and 90 degrees.');
  }
  const supported = Math.abs(resolvedLatitude) <= WEB_MERCATOR_MAX_LATITUDE;
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.ride-tile-coverage.v1',
    supported,
    longitude: normalizedLongitude,
    latitude: resolvedLatitude,
    reason: supported ? null : 'polar-source-coverage-unavailable',
    disclosure: RIDE_TILE_POLAR_DISCLOSURE,
  });
}

export function selectRideTileZoom(latitude, {
  minimumGroundWidthMeters = RIDE_TILE_LIMITS.minimumGroundWidthMeters,
} = {}) {
  const resolvedLatitude = finite(latitude, 'latitude');
  if (Math.abs(resolvedLatitude) > WEB_MERCATOR_MAX_LATITUDE) {
    const error = new RangeError('Ride tile selection is unavailable outside Web Mercator coverage.');
    error.code = 'ERR_RIDE_TILE_POLAR_UNSUPPORTED';
    throw error;
  }
  const minimumWidth = finite(minimumGroundWidthMeters, 'minimumGroundWidthMeters');
  if (minimumWidth <= 0) throw new RangeError('minimumGroundWidthMeters must be positive.');
  const latitudeScale = Math.cos(resolvedLatitude * Math.PI / 180);
  for (let zoom = RIDE_TILE_LIMITS.maximumZoom;
    zoom >= RIDE_TILE_LIMITS.minimumZoom;
    zoom -= 1) {
    const groundWidth = WGS84_EQUATORIAL_CIRCUMFERENCE_METERS * latitudeScale / 2 ** zoom;
    if (groundWidth >= minimumWidth) return zoom;
  }
  return RIDE_TILE_LIMITS.minimumZoom;
}

export function rideTileAt({ longitude, latitude, zoom } = {}) {
  const coverage = rideTileCoverage({ longitude, latitude });
  if (!coverage.supported) {
    const error = new RangeError('Ride tile selection is unavailable outside Web Mercator coverage.');
    error.code = 'ERR_RIDE_TILE_POLAR_UNSUPPORTED';
    error.disclosure = RIDE_TILE_POLAR_DISCLOSURE;
    throw error;
  }
  const z = zoom === undefined ? selectRideTileZoom(coverage.latitude) : zoomLevel(Number(zoom));
  const tileCount = 2 ** z;
  const latitudeRadians = coverage.latitude * Math.PI / 180;
  const worldX = (coverage.longitude + 180) / 360 * tileCount;
  const worldY = (1 - Math.log(
    Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians),
  ) / Math.PI) / 2 * tileCount;
  return normalizeRideTile({
    z,
    x: Math.floor(worldX),
    y: Math.max(0, Math.min(tileCount - 1, Math.floor(worldY))),
  });
}

export function rideTileNeighborhood(center, { radius = RIDE_TILE_LIMITS.activeRadius } = {}) {
  const normalized = normalizeRideTile(center);
  if (!Number.isInteger(radius) || radius < 0 || radius > RIDE_TILE_LIMITS.desiredRadius) {
    throw new RangeError(
      `Ride tile neighborhood radius must be an integer between zero and ${RIDE_TILE_LIMITS.desiredRadius}.`,
    );
  }
  const tileCount = 2 ** normalized.z;
  const candidates = [];
  for (let yOffset = -radius; yOffset <= radius; yOffset += 1) {
    const y = normalized.y + yOffset;
    if (y < 0 || y >= tileCount) continue;
    for (let xOffset = -radius; xOffset <= radius; xOffset += 1) {
      const tile = normalizeRideTile({ z: normalized.z, x: normalized.x + xOffset, y });
      candidates.push({ tile, xOffset, yOffset });
    }
  }
  candidates.sort((left, right) => (
    left.xOffset ** 2 + left.yOffset ** 2 - (right.xOffset ** 2 + right.yOffset ** 2)
    || Math.abs(left.yOffset) - Math.abs(right.yOffset)
    || Math.abs(left.xOffset) - Math.abs(right.xOffset)
    || left.yOffset - right.yOffset
    || left.xOffset - right.xOffset
    || left.tile.key.localeCompare(right.tile.key)
  ));
  return Object.freeze(candidates.map(({ tile }) => tile));
}
