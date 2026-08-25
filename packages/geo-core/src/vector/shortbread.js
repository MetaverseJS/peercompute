import { VectorTile } from '@mapbox/vector-tile';
import { PbfReader } from 'pbf';

export const SHORTBREAD_TILEJSON_URL = 'https://vector.openstreetmap.org/shortbread_v1/tilejson.json';
export const SHORTBREAD_ALLOWED_ORIGIN = 'https://vector.openstreetmap.org';
export const SHORTBREAD_MAX_ZOOM = 14;
export const SHORTBREAD_MAXIMUM_FEATURES_PER_TILE = 25_000;
export const SHORTBREAD_WATER_STYLE = Object.freeze({
  schemaVersion: 'peercompute.geo.shortbread-water-style.v2',
  color: '#0080ff',
  opacity: 0.5,
  fill: 'rgba(0, 128, 255, 0.5)',
  surface: 'flat',
  rendering: 'flat-blue-water-surface',
  geometry: 'non-extruded-terrain-draped-imagery',
  sourceLayers: Object.freeze(['ocean', 'water_polygons']),
  excludedKinds: Object.freeze(['glacier']),
  outline: Object.freeze({
    schemaVersion: 'peercompute.geo.shortbread-water-nurbs-outline.v1',
    color: '#24cfff',
    colorComponents: Object.freeze([36 / 255, 207 / 255, 1, 1]),
    halo: 'rgba(36, 207, 255, 0.32)',
    haloWidthPixels: 4.5,
    coreWidthPixels: 1.5,
    glowPixels: 7,
    curveModel: 'NURBS',
    degree: 1,
    knotModel: 'open-clamped-uniform-per-fragment',
    boundaryModel: 'exact-source-water-boundary-terrain-draped',
    topologyPolicy: 'exact-degree-one-nurbs-polyline',
    maximumSourceDeviationPixels: 0,
    elevationModel: 'source-elevation-not-published',
  }),
  submergedContours: Object.freeze({
    color: '#24cfff',
    colorComponents: Object.freeze([36 / 255, 207 / 255, 1, 1]),
    waterLineElevationMeters: 0,
    verticalDatum: 'terrain-source-native',
    waterLineReference: 'terrain-source-native-zero',
    comparison: 'at-or-below',
  }),
});

const ROAD_STYLES = Object.freeze({
  motorway: Object.freeze({ category: 'motorway', color: '#ff31f6', width: 3.5 }),
  trunk: Object.freeze({ category: 'trunk', color: '#ff6b2c', width: 3.2 }),
  primary: Object.freeze({ category: 'primary', color: '#ffe74a', width: 3 }),
  secondary: Object.freeze({ category: 'secondary', color: '#24eaff', width: 2.5 }),
  tertiary: Object.freeze({ category: 'tertiary', color: '#6eff8d', width: 2.2 }),
  residential: Object.freeze({ category: 'residential', color: '#37ff78', width: 1.6 }),
  service: Object.freeze({ category: 'service', color: '#16ba58', width: 1.2 }),
  path: Object.freeze({ category: 'path', color: '#a4ff4f', width: 0.9 }),
  rail: Object.freeze({ category: 'rail', color: '#b45cff', width: 1.5 }),
  default: Object.freeze({ category: 'other', color: '#35ff76', width: 1.2 })
});

function assertTileCoordinate(value, label) {
  if (!Number.isInteger(value) || value < 0) throw new RangeError(`${label} must be a non-negative integer.`);
  return value;
}

export function validateShortbreadTileJson(payload, { requireWater = false } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new TypeError('TileJSON must be an object.');
  if (typeof requireWater !== 'boolean') throw new TypeError('requireWater must be a boolean.');
  if (typeof payload.tilejson !== 'string') throw new TypeError('TileJSON version is missing.');
  const maxzoom = Number(payload.maxzoom);
  if (!Number.isInteger(maxzoom) || maxzoom < 0 || maxzoom > SHORTBREAD_MAX_ZOOM) {
    throw new RangeError(`Shortbread maxzoom must be between zero and ${SHORTBREAD_MAX_ZOOM}.`);
  }
  if (!Array.isArray(payload.tiles) || payload.tiles.length < 1) throw new TypeError('Shortbread TileJSON has no tile templates.');
  const tiles = payload.tiles.map((entry) => {
    if (typeof entry !== 'string' || !entry.includes('{z}') || !entry.includes('{x}') || !entry.includes('{y}')) {
      throw new TypeError('Shortbread tile template must contain z/x/y placeholders.');
    }
    const url = new URL(entry, SHORTBREAD_TILEJSON_URL);
    if (url.origin !== SHORTBREAD_ALLOWED_ORIGIN || url.username || url.password || url.search || url.hash) {
      throw new TypeError('Shortbread tile template must use the official credential-free origin.');
    }
    return entry;
  });
  const vectorLayerIds = new Set((payload.vector_layers ?? []).map((layer) => layer?.id).filter(Boolean));
  if (!vectorLayerIds.has('streets') || !vectorLayerIds.has('buildings')) {
    throw new TypeError('Shortbread TileJSON must advertise streets and buildings layers.');
  }
  if (requireWater && (!vectorLayerIds.has('ocean') || !vectorLayerIds.has('water_polygons'))) {
    throw new TypeError('Shortbread TileJSON must advertise ocean and water_polygons layers when water is enabled.');
  }
  return Object.freeze({
    tilejson: payload.tilejson,
    name: String(payload.name ?? 'OpenStreetMap Shortbread'),
    attribution: String(payload.attribution ?? ''),
    minzoom: Number(payload.minzoom ?? 0),
    maxzoom,
    tiles: Object.freeze(tiles),
    vectorLayerIds: Object.freeze([...vectorLayerIds])
  });
}

export function formatShortbreadTileUrl(template, { x, y, z }) {
  const zoom = assertTileCoordinate(z, 'z');
  const tileX = assertTileCoordinate(x, 'x');
  const tileY = assertTileCoordinate(y, 'y');
  if (zoom > SHORTBREAD_MAX_ZOOM) throw new RangeError(`Shortbread supports at most z${SHORTBREAD_MAX_ZOOM}.`);
  const limit = 2 ** zoom;
  if (tileX >= limit || tileY >= limit) throw new RangeError('Tile x/y is outside the zoom pyramid.');
  const url = new URL(
    template.replace('{z}', String(zoom)).replace('{x}', String(tileX)).replace('{y}', String(tileY)),
    SHORTBREAD_TILEJSON_URL
  );
  if (url.origin !== SHORTBREAD_ALLOWED_ORIGIN || url.username || url.password || url.search || url.hash) {
    throw new TypeError('Shortbread tile URL left the official credential-free origin.');
  }
  return url.toString();
}

export function classifyShortbreadRoad(properties = {}) {
  const raw = String(
    properties.kind
      ?? properties.highway
      ?? properties.class
      ?? properties.type
      ?? ''
  ).toLowerCase();
  if (raw.includes('motorway')) return ROAD_STYLES.motorway;
  if (raw.includes('trunk')) return ROAD_STYLES.trunk;
  if (raw.includes('primary')) return ROAD_STYLES.primary;
  if (raw.includes('secondary')) return ROAD_STYLES.secondary;
  if (raw.includes('tertiary')) return ROAD_STYLES.tertiary;
  if (raw.includes('residential') || raw.includes('street')) return ROAD_STYLES.residential;
  if (raw.includes('service')) return ROAD_STYLES.service;
  if (raw.includes('path') || raw.includes('foot') || raw.includes('cycle')) return ROAD_STYLES.path;
  if (raw.includes('rail')) return ROAD_STYLES.rail;
  return ROAD_STYLES.default;
}

export function decodeShortbreadTile(arrayBuffer, {
  x,
  y,
  z,
  maximumFeatures = SHORTBREAD_MAXIMUM_FEATURES_PER_TILE,
  includeWater = false,
} = {}) {
  assertTileCoordinate(x, 'x');
  assertTileCoordinate(y, 'y');
  assertTileCoordinate(z, 'z');
  if (!(arrayBuffer instanceof ArrayBuffer) && !ArrayBuffer.isView(arrayBuffer)) {
    throw new TypeError('Shortbread tile must be an ArrayBuffer or typed-array view.');
  }
  if (!Number.isInteger(maximumFeatures)
    || maximumFeatures < 1
    || maximumFeatures > SHORTBREAD_MAXIMUM_FEATURES_PER_TILE) {
    throw new RangeError('maximumFeatures must be between 1 and 25,000.');
  }
  if (typeof includeWater !== 'boolean') throw new TypeError('includeWater must be a boolean.');
  const bytes = arrayBuffer instanceof ArrayBuffer
    ? new Uint8Array(arrayBuffer)
    : new Uint8Array(arrayBuffer.buffer, arrayBuffer.byteOffset, arrayBuffer.byteLength);
  const tile = new VectorTile(new PbfReader(bytes));
  const output = { ocean: [], waterPolygons: [], streets: [], buildings: [] };
  const layers = includeWater
    ? [
      ['ocean', 'ocean'],
      ['water_polygons', 'waterPolygons'],
      ['streets', 'streets'],
      ['buildings', 'buildings'],
      ]
    : [
      ['streets', 'streets'],
      ['buildings', 'buildings'],
      ];
  let count = 0;
  for (const [layerName, outputName] of layers) {
    const layer = tile.layers[layerName];
    if (!layer) continue;
    for (let index = 0; index < layer.length; index += 1) {
      count += 1;
      if (count > maximumFeatures) throw new RangeError('Shortbread tile exceeds the decoded feature cap.');
      const feature = layer.feature(index).toGeoJSON(x, y, z);
      feature.properties = { ...feature.properties, shortbreadLayer: layerName };
      output[outputName].push(feature);
    }
  }
  return Object.freeze({
    schema: 'peercompute.geo.shortbread-tile.v1',
    tile: Object.freeze({ x, y, z }),
    counts: Object.freeze({
      ocean: output.ocean.length,
      waterPolygons: output.waterPolygons.length,
      streets: output.streets.length,
      buildings: output.buildings.length,
    }),
    includeWater,
    ocean: Object.freeze(output.ocean),
    waterPolygons: Object.freeze(output.waterPolygons),
    streets: Object.freeze(output.streets),
    buildings: Object.freeze(output.buildings)
  });
}

export function shortbreadDrawCommands(decoded) {
  if (!decoded?.streets || !decoded?.buildings) throw new TypeError('Decoded Shortbread tile is required.');
  const commands = [];
  for (const feature of decoded.ocean ?? []) {
    commands.push(Object.freeze({
      kind: 'water',
      category: 'ocean',
      geometry: feature.geometry,
      fill: SHORTBREAD_WATER_STYLE.fill,
      stroke: null,
      width: 0,
      opacity: SHORTBREAD_WATER_STYLE.opacity,
      flatSurface: true,
      nurbsOutline: true,
      sourceLayer: 'ocean',
      properties: feature.properties,
    }));
  }
  for (const feature of decoded.waterPolygons ?? []) {
    const sourceKind = String(feature.properties?.kind ?? '').toLowerCase();
    if (SHORTBREAD_WATER_STYLE.excludedKinds.includes(sourceKind)) continue;
    commands.push(Object.freeze({
      kind: 'water',
      category: 'inland-water',
      geometry: feature.geometry,
      fill: SHORTBREAD_WATER_STYLE.fill,
      stroke: null,
      width: 0,
      opacity: SHORTBREAD_WATER_STYLE.opacity,
      flatSurface: true,
      nurbsOutline: true,
      sourceLayer: 'water_polygons',
      properties: feature.properties,
    }));
  }
  for (const feature of decoded.buildings) {
    commands.push(Object.freeze({
      kind: 'building',
      geometry: feature.geometry,
      fill: 'rgba(42, 127, 255, 0.16)',
      stroke: '#32aaff',
      width: 0.9,
      properties: feature.properties
    }));
  }
  for (const feature of decoded.streets) {
    const style = classifyShortbreadRoad(feature.properties);
    commands.push(Object.freeze({
      kind: 'road',
      geometry: feature.geometry,
      stroke: style.color,
      width: style.width,
      category: style.category,
      properties: feature.properties
    }));
  }
  return Object.freeze(commands);
}
