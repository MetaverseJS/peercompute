import { createHash } from 'node:crypto';
import {
  decodeShortbreadTile,
  SHORTBREAD_MAX_ZOOM,
  SHORTBREAD_TILEJSON_URL,
  TERRARIUM_MAX_LEVEL,
  TERRARIUM_TILE_SIZE,
  validateShortbreadTileJson
} from '@peercompute/geo-core';
import { GeodataError } from '../errors.js';
import { fetchBoundedBytes } from '../lib/fetch-bytes.js';
import { BoundedSemaphore } from '../lib/semaphore.js';

export const SOURCE_CACHE_ROUTES = Object.freeze({
  shortbreadTileJson: '/api/v1/cache/osm-shortbread/tilejson',
  shortbreadTile: '/api/v1/cache/osm-shortbread/:z/:x/:y.mvt',
  terrariumTile: '/api/v1/cache/aws-terrarium/:z/:x/:y.png'
});
export const SOURCE_CACHE_URL_TEMPLATES = Object.freeze({
  shortbreadTileJson: SOURCE_CACHE_ROUTES.shortbreadTileJson,
  shortbreadTile: '/api/v1/cache/osm-shortbread/{z}/{x}/{y}.mvt',
  terrariumTile: '/api/v1/cache/aws-terrarium/{z}/{x}/{y}.png'
});

const SHORTBREAD_TILE_ORIGIN = 'https://vector.openstreetmap.org';
const TERRARIUM_TILE_ORIGIN = 'https://elevation-tiles-prod.s3.amazonaws.com';
const SHORTBREAD_VECTOR_CONTENT_TYPES = Object.freeze([
  'application/vnd.mapbox-vector-tile',
  'application/x-protobuf',
  'application/protobuf',
  'application/octet-stream'
]);
const PNG_SIGNATURE = Object.freeze([137, 80, 78, 71, 13, 10, 26, 10]);
const MAXIMUM_SHORTBREAD_FEATURES = 25_000;
const MAXIMUM_SHORTBREAD_COORDINATES = 1_000_000;

function strongByteEtag(bytes) {
  const digest = createHash('sha256').update(bytes).digest('base64url');
  return `"sha256-${digest}"`;
}

function schemaError(message, cause) {
  return new GeodataError(
    'UPSTREAM_SCHEMA_REJECTED',
    message,
    { statusCode: 502, retryable: false, cause }
  );
}

function decodeJson(bytes) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (error) {
    throw schemaError('The Shortbread TileJSON source returned invalid UTF-8.', error);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw schemaError('The Shortbread TileJSON source returned invalid JSON.', error);
  }
}

export function validateCanonicalShortbreadTileJson(bytes) {
  try {
    const validated = validateShortbreadTileJson(decodeJson(bytes), { requireWater: true });
    if (!/^\d+\.\d+(?:\.\d+)?$/u.test(validated.tilejson)) {
      throw new TypeError('TileJSON version must be canonical dotted decimal notation.');
    }
    if (!Number.isInteger(validated.minzoom)
      || validated.minzoom < 0
      || validated.minzoom > validated.maxzoom) {
      throw new RangeError('Shortbread minzoom is outside the advertised pyramid.');
    }
    for (const template of validated.tiles) {
      const resolved = new URL(template, SHORTBREAD_TILEJSON_URL);
      if (resolved.origin !== SHORTBREAD_TILE_ORIGIN
        || decodeURIComponent(resolved.pathname) !== '/shortbread_v1/{z}/{x}/{y}.mvt') {
        throw new TypeError('Shortbread TileJSON must advertise the fixed official v1 tile path.');
      }
    }
    return validated;
  } catch (error) {
    if (error instanceof GeodataError) throw error;
    throw schemaError('The Shortbread TileJSON source failed canonical schema validation.', error);
  }
}

function countCoordinates(value, state, maximumCoordinates) {
  if (!Array.isArray(value)) return;
  if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) {
    state.count += 1;
    if (state.count > maximumCoordinates) {
      throw new RangeError('Shortbread decoded coordinate cap exceeded.');
    }
    return;
  }
  for (const child of value) countCoordinates(child, state, maximumCoordinates);
}

export function validateBoundedShortbreadMvt(bytes, tile, {
  maximumFeatures = MAXIMUM_SHORTBREAD_FEATURES,
  maximumCoordinates = MAXIMUM_SHORTBREAD_COORDINATES
} = {}) {
  try {
    if (!Number.isSafeInteger(maximumFeatures)
      || maximumFeatures < 1
      || maximumFeatures > MAXIMUM_SHORTBREAD_FEATURES) {
      throw new RangeError('Shortbread feature cap is outside the fixed service bound.');
    }
    if (!Number.isSafeInteger(maximumCoordinates)
      || maximumCoordinates < 1
      || maximumCoordinates > MAXIMUM_SHORTBREAD_COORDINATES) {
      throw new RangeError('Shortbread coordinate cap is outside the fixed service bound.');
    }
    const decoded = decodeShortbreadTile(bytes, {
      ...tile,
      maximumFeatures,
      includeWater: true
    });
    const state = { count: 0 };
    for (const collection of [
      decoded.ocean,
      decoded.waterPolygons,
      decoded.streets,
      decoded.buildings
    ]) {
      for (const feature of collection) {
        countCoordinates(feature.geometry?.coordinates, state, maximumCoordinates);
      }
    }
    return decoded.counts;
  } catch (error) {
    throw schemaError('The Shortbread vector tile failed bounded MVT decoding.', error);
  }
}

function readUint32(bytes, offset) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, false);
}

export function validateTerrariumPng(bytes) {
  try {
    if (!(bytes instanceof Uint8Array) || bytes.byteLength < 33) {
      throw new RangeError('Terrarium PNG is shorter than its required IHDR.');
    }
    if (!PNG_SIGNATURE.every((value, index) => bytes[index] === value)) {
      throw new TypeError('Terrarium payload has no PNG signature.');
    }
    if (readUint32(bytes, 8) !== 13
      || String.fromCharCode(...bytes.subarray(12, 16)) !== 'IHDR') {
      throw new TypeError('Terrarium PNG has no canonical IHDR first chunk.');
    }
    const width = readUint32(bytes, 16);
    const height = readUint32(bytes, 20);
    const bitDepth = bytes[24];
    const colorType = bytes[25];
    if (width !== TERRARIUM_TILE_SIZE || height !== TERRARIUM_TILE_SIZE) {
      throw new RangeError(`Terrarium PNG must be ${TERRARIUM_TILE_SIZE}x${TERRARIUM_TILE_SIZE}.`);
    }
    if (bitDepth !== 8 || ![2, 6].includes(colorType)
      || bytes[26] !== 0 || bytes[27] !== 0 || ![0, 1].includes(bytes[28])) {
      throw new TypeError('Terrarium PNG IHDR uses an unsupported pixel encoding.');
    }
    return Object.freeze({ width, height, bitDepth, colorType });
  } catch (error) {
    if (error instanceof GeodataError) throw error;
    throw schemaError('The AWS Terrarium tile failed PNG schema validation.', error);
  }
}

function parseCoordinate(value, label) {
  if (Number.isSafeInteger(value) && value >= 0) return value;
  if (typeof value !== 'string' || !/^(?:0|[1-9][0-9]{0,9})$/u.test(value)) {
    throw new GeodataError(
      'INVALID_TILE_COORDINATE',
      `Tile ${label} must be a canonical non-negative integer.`,
      { statusCode: 400, retryable: false }
    );
  }
  return Number(value);
}

export function parseTileCoordinates(params, maximumZoom) {
  const z = parseCoordinate(params?.z, 'z');
  const x = parseCoordinate(params?.x, 'x');
  const y = parseCoordinate(params?.y, 'y');
  if (z > maximumZoom) {
    throw new GeodataError(
      'INVALID_TILE_COORDINATE',
      `Tile z exceeds the fixed source maximum of ${maximumZoom}.`,
      { statusCode: 400, retryable: false }
    );
  }
  const tilesPerAxis = 2 ** z;
  if (x >= tilesPerAxis || y >= tilesPerAxis) {
    throw new GeodataError(
      'INVALID_TILE_COORDINATE',
      'Tile x/y is outside the selected zoom pyramid.',
      { statusCode: 400, retryable: false }
    );
  }
  return Object.freeze({ z, x, y });
}

function artifact(sourceId, contentType, bytes) {
  const immutableBytes = Buffer.from(bytes);
  return Object.freeze({
    sourceId,
    contentType,
    bytes: immutableBytes,
    etag: strongByteEtag(immutableBytes)
  });
}

export function createSourceArtifactProvider({ config, fetchImpl = globalThis.fetch }) {
  const semaphore = new BoundedSemaphore({
    concurrency: config.limits.sourceMaxConcurrentCalls,
    maxQueue: config.limits.sourceMaxQueuedCalls,
    busyMessage: 'The fixed geodata source adapter is busy; retry after a short delay.'
  });
  const commonHeaders = Object.freeze({
    'user-agent': config.userAgent
  });
  const get = (url, options) => semaphore.run(() => fetchBoundedBytes({
    fetchImpl,
    url,
    headers: { ...commonHeaders, accept: options.accept },
    timeoutMs: config.limits.sourceRequestTimeoutMs,
    maxResponseBytes: options.maxResponseBytes,
    allowedContentTypes: options.allowedContentTypes
  }));

  return Object.freeze({
    get stats() {
      return Object.freeze({
        active: semaphore.active,
        queued: semaphore.queued,
        concurrency: semaphore.concurrency,
        maxQueue: semaphore.maxQueue
      });
    },

    async fetchShortbreadTileJson() {
      const result = await get(new URL(SHORTBREAD_TILEJSON_URL), {
        accept: 'application/json',
        maxResponseBytes: config.limits.shortbreadTileJsonMaxBytes,
        allowedContentTypes: ['application/json']
      });
      validateCanonicalShortbreadTileJson(result.bytes);
      return artifact('osm-shortbread-tilejson', result.contentType, result.bytes);
    },

    async fetchShortbreadTile(params) {
      const tile = parseTileCoordinates(params, SHORTBREAD_MAX_ZOOM);
      const url = new URL(`/shortbread_v1/${tile.z}/${tile.x}/${tile.y}.mvt`, SHORTBREAD_TILE_ORIGIN);
      const result = await get(url, {
        accept: SHORTBREAD_VECTOR_CONTENT_TYPES.join(','),
        maxResponseBytes: config.limits.shortbreadTileMaxBytes,
        allowedContentTypes: SHORTBREAD_VECTOR_CONTENT_TYPES
      });
      validateBoundedShortbreadMvt(result.bytes, tile, {
        maximumFeatures: config.limits.shortbreadMaxFeaturesPerTile,
        maximumCoordinates: config.limits.shortbreadMaxCoordinatesPerTile
      });
      return artifact('osm-shortbread-mvt', result.contentType, result.bytes);
    },

    async fetchTerrariumTile(params) {
      const tile = parseTileCoordinates(params, TERRARIUM_MAX_LEVEL);
      const url = new URL(`/terrarium/${tile.z}/${tile.x}/${tile.y}.png`, TERRARIUM_TILE_ORIGIN);
      const result = await get(url, {
        accept: 'image/png',
        maxResponseBytes: config.limits.terrariumTileMaxBytes,
        allowedContentTypes: ['image/png']
      });
      validateTerrariumPng(result.bytes);
      return artifact('aws-terrarium-png', result.contentType, result.bytes);
    }
  });
}

export {
  MAXIMUM_SHORTBREAD_COORDINATES,
  MAXIMUM_SHORTBREAD_FEATURES,
  SHORTBREAD_TILE_ORIGIN,
  TERRARIUM_TILE_ORIGIN
};
