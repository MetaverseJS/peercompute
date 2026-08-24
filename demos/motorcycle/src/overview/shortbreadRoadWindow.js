import {
  SHORTBREAD_TILEJSON_URL,
  classifyShortbreadRoad,
  decodeShortbreadTile,
  formatShortbreadTileUrl,
  validateShortbreadTileJson,
} from '@peercompute/geo-core';

import { centeredOverviewTiles, normalizeOverviewLocation } from './globeMath.js';
import { fetchCappedJson, readCappedResponse } from './http.js';

export const OVERVIEW_MAXIMUM_TILES = 25;
export const OVERVIEW_MAXIMUM_TILE_BYTES = 1024 * 1024;
export const OVERVIEW_MAXIMUM_TOTAL_TILE_BYTES = 8 * 1024 * 1024;
export const OVERVIEW_MAXIMUM_ROAD_VERTICES = 100_000;
export const OVERVIEW_TILE_CONCURRENCY = 4;
export const OVERVIEW_MAJOR_ROAD_CATEGORIES = Object.freeze(['motorway', 'trunk', 'primary']);

function linesFromGeometry(geometry) {
  if (geometry?.type === 'LineString') return [geometry.coordinates];
  if (geometry?.type === 'MultiLineString') return geometry.coordinates;
  return [];
}

export function majorRoadCategory(properties) {
  const category = classifyShortbreadRoad(properties).category;
  return OVERVIEW_MAJOR_ROAD_CATEGORIES.includes(category) ? category : null;
}

export async function loadOverviewRoadWindow(location, {
  fetchImpl = globalThis.fetch,
  signal,
  tileJsonUrl = SHORTBREAD_TILEJSON_URL,
} = {}) {
  const normalized = normalizeOverviewLocation(location);
  const rawTileJson = await fetchCappedJson(tileJsonUrl, {
    fetchImpl,
    signal,
    maximumBytes: 256 * 1024,
    label: 'OSM Shortbread TileJSON',
  });
  const tileJson = validateShortbreadTileJson(rawTileJson);
  const streetLayer = rawTileJson.vector_layers?.find((layer) => layer?.id === 'streets');
  if (Number(streetLayer?.minzoom) > 5 || Number(streetLayer?.maxzoom) < 5) {
    throw new RangeError('OSM Shortbread streets do not advertise the required z5 overview layer.');
  }
  const tiles = centeredOverviewTiles(normalized);
  if (tiles.length > OVERVIEW_MAXIMUM_TILES) throw new RangeError('Overview road tile selection exceeded its cap.');
  let nextIndex = 0;
  let totalBytes = 0;
  const loaded = new Array(tiles.length);
  async function worker() {
    while (nextIndex < tiles.length) {
      const index = nextIndex;
      nextIndex += 1;
      const tile = tiles[index];
      const url = formatShortbreadTileUrl(tileJson.tiles[0], tile);
      const response = await fetchImpl(url, { mode: 'cors', cache: 'force-cache', signal });
      if (!response.ok) throw new Error(`OSM Shortbread tile ${tile.z}/${tile.x}/${tile.y} returned HTTP ${response.status}.`);
      const bytes = await readCappedResponse(response, OVERVIEW_MAXIMUM_TILE_BYTES, 'OSM Shortbread tile');
      totalBytes += bytes.byteLength;
      if (totalBytes > OVERVIEW_MAXIMUM_TOTAL_TILE_BYTES) {
        throw new RangeError('Overview road tiles exceed the aggregate byte cap.');
      }
      const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
      loaded[index] = Object.freeze({ tile, bytes: bytes.byteLength, decoded: decodeShortbreadTile(buffer, tile) });
    }
  }
  await Promise.all(Array.from(
    { length: Math.min(OVERVIEW_TILE_CONCURRENCY, tiles.length) },
    () => worker(),
  ));

  const roads = [];
  let sourceFeatures = 0;
  let renderedVertices = 0;
  for (const entry of loaded) {
    sourceFeatures += entry.decoded.streets.length;
    for (const feature of entry.decoded.streets) {
      const category = majorRoadCategory(feature.properties);
      if (!category) continue;
      for (const coordinates of linesFromGeometry(feature.geometry)) {
        if (!Array.isArray(coordinates) || coordinates.length < 2) continue;
        const line = coordinates.map((coordinate) => [Number(coordinate[0]), Number(coordinate[1])]);
        if (line.some((coordinate) => !coordinate.every(Number.isFinite))) continue;
        renderedVertices += line.length;
        if (renderedVertices > OVERVIEW_MAXIMUM_ROAD_VERTICES) {
          throw new RangeError('Overview roads exceed the rendered-vertex cap.');
        }
        roads.push(Object.freeze({ category, coordinates: Object.freeze(line.map(Object.freeze)) }));
      }
    }
  }
  return Object.freeze({
    schemaVersion: 'peercompute.roadvector.overview-road-window.v1',
    sourceId: 'osm-shortbread',
    attribution: '© OpenStreetMap contributors · ODbL 1.0',
    geometryCoverage: 'regional-major-roads-only',
    completeHemisphereCoverage: false,
    zoom: 5,
    center: normalized,
    tileWindow: Object.freeze({ width: 5, height: 5, selected: tiles.length, loaded: loaded.length }),
    tiles: Object.freeze(loaded.map((entry) => Object.freeze({ ...entry.tile, bytes: entry.bytes }))),
    responseBytes: totalBytes,
    sourceFeatures,
    renderedRoads: roads.length,
    renderedVertices,
    roads: Object.freeze(roads),
  });
}
