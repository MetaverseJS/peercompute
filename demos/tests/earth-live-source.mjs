import assert from 'node:assert/strict';

import {
  assessNowCoastFreshness,
  decodeEtopo2022Bip,
  decodeShortbreadTile,
  formatEtopo2022ExportUrl,
  formatShortbreadTileUrl,
  formatTerrariumTileUrl,
  nowCoastCapabilitiesUrl,
  nowCoastDescriptor,
  parseNowCoastTimes,
  SHORTBREAD_TILEJSON_URL,
  validateShortbreadTileJson
} from '../../packages/geo-core/src/index.js';
import { GEODATA_LIMITS } from '../../services/geodata/src/config.js';
import { parseAndSnapBbox } from '../../services/geodata/src/osm/bbox.js';
import { normalizeOverpassRegion } from '../../services/geodata/src/osm/normalize.js';
import { buildOverpassQuery, encodeOverpassQuery } from '../../services/geodata/src/osm/query.js';

const LIVE_TIMEOUT_MS = 25_000;
const FIXED_BBOX = Object.freeze([61.2165, -149.901, 61.2195, -149.892]);
const OVERPASS_URL = process.env.GEODATA_LIVE_OVERPASS_URL
  ?? 'https://overpass-api.de/api/interpreter';

async function fetchBytes(url, {
  method = 'GET',
  headers = {},
  body,
  maximumBytes,
  expectedContentType
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`Live source timeout after ${LIVE_TIMEOUT_MS} ms.`)), LIVE_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      redirect: 'error',
      signal: controller.signal
    });
    if (!response.ok) {
      const error = new Error(`${new URL(url).hostname} returned HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (expectedContentType) {
      assert.match(contentType, expectedContentType, `unexpected content type from ${new URL(url).hostname}`);
    }
    const declared = Number(response.headers.get('content-length'));
    if (Number.isFinite(declared)) {
      assert.ok(declared <= maximumBytes, `declared response exceeds ${maximumBytes} bytes`);
    }
    const reader = response.body?.getReader();
    assert.ok(reader, 'live source response must expose a bounded readable body');
    const chunks = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      assert.ok(length <= maximumBytes, `observed response exceeds ${maximumBytes} bytes`);
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { bytes, contentType };
  } finally {
    clearTimeout(timer);
  }
}

function tileForCoordinate(longitude, latitude, zoom) {
  const scale = 2 ** zoom;
  const latitudeRadians = latitude * Math.PI / 180;
  return {
    x: Math.floor((longitude + 180) / 360 * scale),
    y: Math.floor((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2 * scale),
    z: zoom
  };
}

async function probeShortbread() {
  const tileJsonResponse = await fetchBytes(SHORTBREAD_TILEJSON_URL, {
    headers: { accept: 'application/json' },
    maximumBytes: 512 * 1024,
    expectedContentType: /json/iu
  });
  const tileJson = validateShortbreadTileJson(
    JSON.parse(new TextDecoder().decode(tileJsonResponse.bytes)),
    { requireWater: true }
  );
  const tile = tileForCoordinate(-149.8965, 61.218, Math.min(14, tileJson.maxzoom));
  const url = formatShortbreadTileUrl(tileJson.tiles[0], tile);
  const tileResponse = await fetchBytes(url, {
    headers: { accept: 'application/vnd.mapbox-vector-tile,application/x-protobuf' },
    maximumBytes: 2 * 1024 * 1024
  });
  const decoded = decodeShortbreadTile(tileResponse.bytes, {
    ...tile,
    maximumFeatures: 10_000,
    includeWater: true
  });
  assert.ok(decoded.counts.streets + decoded.counts.buildings > 0, 'fixed Shortbread tile returned no streets or buildings');
  assert.ok(decoded.counts.ocean > 0, 'fixed Shortbread tile returned no ocean polygons');
  assert.ok(decoded.counts.waterPolygons > 0, 'fixed Shortbread tile returned no inland-water polygons');
  return {
    tile,
    bytes: tileResponse.bytes.byteLength,
    counts: decoded.counts,
    maxzoom: tileJson.maxzoom
  };
}

async function probeOverpassOnce() {
  const bbox = parseAndSnapBbox(FIXED_BBOX.join(','), GEODATA_LIMITS);
  const query = buildOverpassQuery({
    bbox,
    layers: ['roads', 'buildings'],
    timeoutSeconds: 20
  });
  const response = await fetchBytes(OVERPASS_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'user-agent': 'PeerComputeEarthLiveProbe/0.1'
    },
    body: encodeOverpassQuery(query),
    maximumBytes: 8 * 1024 * 1024,
    expectedContentType: /json/iu
  });
  const payload = JSON.parse(new TextDecoder().decode(response.bytes));
  const normalized = normalizeOverpassRegion(payload, {
    bbox,
    layers: ['roads', 'buildings'],
    vehicle: 'motorcycle',
    limits: GEODATA_LIMITS
  });
  assert.ok(normalized.roadGraph.edges.length > 0, 'fixed Overpass region returned no motorcycle graph edges');
  assert.ok(normalized.buildings.features.length > 0, 'fixed Overpass region returned no buildings');
  return {
    origin: new URL(OVERPASS_URL).origin,
    bytes: response.bytes.byteLength,
    sourceBaseTimestamp: normalized.sourceBaseTimestamp,
    roadWays: normalized.roads.features.length,
    buildings: normalized.buildings.features.length,
    directedEdges: normalized.roadGraph.edges.length
  };
}

function retryableLiveError(error) {
  const status = Number(error?.status);
  if (status === 429 || status >= 500) return true;
  const code = error?.cause?.code ?? error?.code;
  return [
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
    'UND_ERR_SOCKET',
    'ECONNRESET',
    'ETIMEDOUT'
  ].includes(code) || error?.name === 'AbortError';
}

async function probeOverpass() {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return { ...(await probeOverpassOnce()), attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt === 2 || !retryableLiveError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw lastError;
}

async function probeNowCoast() {
  const descriptor = nowCoastDescriptor('noaa-radar-alaska');
  const response = await fetchBytes(nowCoastCapabilitiesUrl(descriptor), {
    headers: { accept: 'application/xml,text/xml' },
    maximumBytes: 5 * 1024 * 1024,
    expectedContentType: /xml/iu
  });
  const values = parseNowCoastTimes(new TextDecoder().decode(response.bytes), descriptor);
  const freshness = assessNowCoastFreshness(values, descriptor);
  assert.equal(freshness.status, 'current', `nowCOAST frame is ${freshness.status}`);
  return {
    bytes: response.bytes.byteLength,
    valueCount: values.length,
    ...freshness
  };
}

async function probeEtopo() {
  const url = formatEtopo2022ExportUrl({
    west: -149.901,
    south: 61.2165,
    east: -149.892,
    north: 61.2195
  }, { width: 4, height: 4 });
  const response = await fetchBytes(url, {
    headers: { accept: 'application/octet-stream' },
    maximumBytes: 128 * 1024
  });
  const buffer = response.bytes.buffer.slice(
    response.bytes.byteOffset,
    response.bytes.byteOffset + response.bytes.byteLength
  );
  const heights = decodeEtopo2022Bip(buffer, 4, 4);
  assert.equal(heights.length, 16);
  assert.equal([...heights].every(Number.isFinite), true);
  return {
    bytes: response.bytes.byteLength,
    minimumMeters: Math.min(...heights),
    maximumMeters: Math.max(...heights)
  };
}

async function probeTerrarium() {
  const tile = tileForCoordinate(-149.8965, 61.218, 8);
  const response = await fetchBytes(formatTerrariumTileUrl(tile.x, tile.y, tile.z), {
    headers: { accept: 'image/png' },
    maximumBytes: 2 * 1024 * 1024,
    expectedContentType: /image\/png/iu
  });
  assert.deepEqual([...response.bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return { tile, bytes: response.bytes.byteLength };
}

const startedAt = new Date().toISOString();
const [shortbread, overpass, nowCoast, etopo2022, terrarium] = await Promise.all([
  probeShortbread(),
  probeOverpass(),
  probeNowCoast(),
  probeEtopo(),
  probeTerrarium()
]);

console.log(JSON.stringify({
  schemaVersion: 'peercompute.earth-platform.live-probe.v1',
  startedAt,
  completedAt: new Date().toISOString(),
  fixedPublicBbox: FIXED_BBOX,
  shortbread,
  overpass,
  nowCoast,
  etopo2022,
  terrarium
}, null, 2));
