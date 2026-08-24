export const EARTH_RADIUS_METERS = 6_371_008.8;
export const OVERVIEW_GLOBE_RADIUS = 10;
export const OVERVIEW_ROAD_ZOOM = 5;
export const OVERVIEW_TILE_WINDOW_SIZE = 5;

function finiteNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

export function normalizeOverviewLocation(location) {
  if (!location || typeof location !== 'object') throw new TypeError('Overview location is required.');
  const longitude = finiteNumber(location.longitude, 'Longitude');
  const latitude = finiteNumber(location.latitude, 'Latitude');
  if (longitude < -180 || longitude > 180) throw new RangeError('Longitude must be between -180 and 180.');
  if (latitude < -90 || latitude > 90) throw new RangeError('Latitude must be between -90 and 90.');
  return Object.freeze({ longitude, latitude, label: String(location.label ?? '').trim() || null });
}

export function wgs84ToOverviewCartesian(longitude, latitude, radius = OVERVIEW_GLOBE_RADIUS) {
  const location = normalizeOverviewLocation({ longitude, latitude });
  const safeRadius = finiteNumber(radius, 'Overview radius');
  if (!(safeRadius > 0)) throw new RangeError('Overview radius must be positive.');
  const lon = location.longitude * Math.PI / 180;
  const lat = location.latitude * Math.PI / 180;
  const cosLatitude = Math.cos(lat);
  return Object.freeze([
    safeRadius * cosLatitude * Math.sin(lon),
    safeRadius * Math.sin(lat),
    safeRadius * cosLatitude * Math.cos(lon),
  ]);
}

export function overviewNorthVector(longitude, latitude) {
  const location = normalizeOverviewLocation({ longitude, latitude });
  const lon = location.longitude * Math.PI / 180;
  const lat = location.latitude * Math.PI / 180;
  return Object.freeze([
    -Math.sin(lat) * Math.sin(lon),
    Math.cos(lat),
    -Math.sin(lat) * Math.cos(lon),
  ]);
}

export function overviewCameraPose(location, {
  radius = OVERVIEW_GLOBE_RADIUS,
  distanceMultiplier = 2.55,
} = {}) {
  const normalized = normalizeOverviewLocation(location);
  const surface = wgs84ToOverviewCartesian(normalized.longitude, normalized.latitude, radius);
  const length = Math.hypot(...surface);
  const position = surface.map((value) => value / length * radius * distanceMultiplier);
  return Object.freeze({
    position: Object.freeze(position),
    up: overviewNorthVector(normalized.longitude, normalized.latitude),
    target: Object.freeze([0, 0, 0]),
  });
}

export function slippyTileForLocation(longitude, latitude, zoom = OVERVIEW_ROAD_ZOOM) {
  const location = normalizeOverviewLocation({ longitude, latitude });
  if (!Number.isInteger(zoom) || zoom < 0 || zoom > 22) throw new RangeError('Tile zoom is outside the supported range.');
  const count = 2 ** zoom;
  const boundedLatitude = Math.max(-85.05112878, Math.min(85.05112878, location.latitude));
  const latitudeRadians = boundedLatitude * Math.PI / 180;
  const x = Math.min(count - 1, Math.max(0, Math.floor((location.longitude + 180) / 360 * count)));
  const y = Math.min(count - 1, Math.max(0, Math.floor(
    (1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2 * count,
  )));
  return Object.freeze({ x, y, z: zoom });
}

export function centeredOverviewTiles(location, {
  zoom = OVERVIEW_ROAD_ZOOM,
  windowSize = OVERVIEW_TILE_WINDOW_SIZE,
} = {}) {
  if (!Number.isInteger(windowSize) || windowSize < 1 || windowSize > 5 || windowSize % 2 === 0) {
    throw new RangeError('Overview tile window must be an odd integer between 1 and 5.');
  }
  const center = slippyTileForLocation(location.longitude, location.latitude, zoom);
  const count = 2 ** zoom;
  const radius = Math.floor(windowSize / 2);
  const tiles = [];
  const seen = new Set();
  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const y = center.y + offsetY;
      if (y < 0 || y >= count) continue;
      const x = ((center.x + offsetX) % count + count) % count;
      const key = `${zoom}/${x}/${y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      tiles.push({
        x,
        y,
        z: zoom,
        offsetX,
        offsetY,
        distance: Math.hypot(offsetX, offsetY),
      });
    }
  }
  tiles.sort((left, right) => (
    left.distance - right.distance
    || Math.abs(left.offsetY) - Math.abs(right.offsetY)
    || Math.abs(left.offsetX) - Math.abs(right.offsetX)
    || left.offsetY - right.offsetY
    || left.offsetX - right.offsetX
  ));
  return Object.freeze(tiles.map((tile) => Object.freeze(tile)));
}
