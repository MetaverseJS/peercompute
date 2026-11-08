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

function tileLongitude(x, zoom) {
  return x / (2 ** zoom) * 360 - 180;
}

function tileLatitude(y, zoom) {
  return Math.atan(Math.sinh(Math.PI * (1 - 2 * y / (2 ** zoom)))) * 180 / Math.PI;
}

function wrapLongitude(longitude) {
  if (longitude === 180) return 180;
  return ((longitude + 180) % 360 + 360) % 360 - 180;
}

export function overviewTileWindowBounds(location, {
  zoom = OVERVIEW_ROAD_ZOOM,
  windowSize = OVERVIEW_TILE_WINDOW_SIZE,
} = {}) {
  const tiles = centeredOverviewTiles(location, { zoom, windowSize });
  const center = slippyTileForLocation(location.longitude, location.latitude, zoom);
  const radius = Math.floor(windowSize / 2);
  const count = 2 ** zoom;
  const northY = Math.max(0, center.y - radius);
  const southY = Math.min(count, center.y + radius + 1);
  // Cesium maps exact rectangle edges inclusively. Move every edge a
  // sub-millimetre angular distance into the selected window so a nominal
  // 5×5 rectangle cannot gain a neighbor at ordinary, wrapped, or polar bounds.
  const edgeInsetDegrees = 1e-9;
  return Object.freeze({
    west: wrapLongitude(tileLongitude(center.x - radius, zoom) + edgeInsetDegrees),
    south: tileLatitude(southY, zoom) + edgeInsetDegrees,
    east: wrapLongitude(tileLongitude(center.x + radius + 1, zoom) - edgeInsetDegrees),
    north: tileLatitude(northY, zoom) - edgeInsetDegrees,
    zoom,
    selectedTiles: tiles.length,
    crossesAntimeridian: center.x - radius < 0 || center.x + radius >= count,
  });
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
