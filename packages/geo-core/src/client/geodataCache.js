import {
  decodeShortbreadTile,
  SHORTBREAD_ALLOWED_ORIGIN,
  SHORTBREAD_MAXIMUM_FEATURES_PER_TILE,
  SHORTBREAD_MAX_ZOOM,
  SHORTBREAD_TILEJSON_URL,
  validateShortbreadTileJson
} from '../vector/shortbread.js';
import {
  TERRARIUM_MAX_LEVEL,
  TERRARIUM_TILE_SIZE
} from '../terrain/terrarium.js';

export const CACHED_GEO_ROUTE_PREFIX = '/api/v1/cache';

const SHORTBREAD_FRESH_MS = 60 * 60 * 1_000;
const SHORTBREAD_STALE_MS = 24 * 60 * 60 * 1_000;
const TERRARIUM_FRESH_MS = 24 * 60 * 60 * 1_000;
const TERRARIUM_STALE_MS = 30 * 24 * 60 * 60 * 1_000;
const SHORTBREAD_TILEJSON_MAXIMUM_BYTES = 256 * 1024;
const SHORTBREAD_TILE_MAXIMUM_BYTES = 2 * 1024 * 1024;
const TERRARIUM_TILE_MAXIMUM_BYTES = 512 * 1024;
const TERRARIUM_ORIGIN = 'https://elevation-tiles-prod.s3.amazonaws.com';
const RESPONSE_HEADER_ALLOWLIST = Object.freeze([
  'cache-control',
  'content-language',
  'content-type',
  'etag',
  'expires',
  'last-modified',
  'x-geodata-cache',
  'x-geodata-source'
]);

function codedError(ErrorType, code, message) {
  const error = new ErrorType(message);
  error.code = code;
  return error;
}

function normalizeGeodataBaseUrl(value, locationLike = globalThis.location) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  if (normalized === '' || normalized.toLowerCase() === 'same-origin') return '';
  const url = new URL(normalized, locationLike?.href ?? 'https://localhost/');
  if (!['http:', 'https:'].includes(url.protocol)
    || url.username
    || url.password
    || url.pathname !== '/'
    || url.search
    || url.hash) {
    throw new TypeError('geodataBaseUrl must be null, same-origin, or an HTTP(S) origin without a path.');
  }
  if (locationLike?.protocol === 'https:' && url.protocol !== 'https:' && url.origin !== locationLike.origin) {
    throw new TypeError('HTTPS pages require an HTTPS or same-origin geodata API.');
  }
  return url.origin;
}

function inputUrl(input) {
  if (typeof input === 'string' || input instanceof URL) return String(input);
  if (input && typeof input.url === 'string') return input.url;
  return String(input);
}

function inputMethod(input, init) {
  return String(init?.method ?? input?.method ?? 'GET').toUpperCase();
}

function inputSignal(input, init) {
  return init?.signal ?? input?.signal;
}

function combinedSignal(signals) {
  const active = signals.filter(Boolean);
  if (active.length === 0) return undefined;
  if (active.length === 1) return active[0];
  if (typeof AbortSignal?.any === 'function') return AbortSignal.any(active);
  const controller = new AbortController();
  const abort = (signal) => controller.abort(signal.reason);
  for (const signal of active) {
    if (signal.aborted) {
      abort(signal);
      break;
    }
    signal.addEventListener('abort', () => abort(signal), { once: true });
  }
  return controller.signal;
}

function requestInitFor(input, init, signal) {
  const inherited = input && typeof input === 'object' && typeof input.url === 'string'
    ? {
      method: input.method,
      headers: input.headers,
      mode: input.mode,
      credentials: input.credentials,
      cache: input.cache,
      redirect: input.redirect,
      referrer: input.referrer,
      referrerPolicy: input.referrerPolicy,
      integrity: input.integrity,
      keepalive: input.keepalive
    }
    : {};
  const options = { ...inherited, ...init, signal };
  delete options.body;
  const headers = new Headers(options.headers);
  const accept = headers.get('accept');
  options.headers = accept ? { accept } : {};
  options.method = 'GET';
  options.credentials = 'omit';
  options.redirect = 'error';
  options.referrerPolicy = 'no-referrer';
  return options;
}

function coordinate(value, maximum, label) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0 || number >= maximum) {
    throw codedError(RangeError, 'ERR_CACHED_GEO_COORDINATE', `${label} is outside the source tile matrix.`);
  }
  return number;
}

function parseTile(pathname, expression, maximumZoom) {
  const match = expression.exec(pathname);
  if (!match) return null;
  const z = Number(match.groups.z);
  if (!Number.isSafeInteger(z) || z < 0 || z > maximumZoom) return null;
  const limit = 2 ** z;
  try {
    return {
      z,
      x: coordinate(match.groups.x, limit, 'x'),
      y: coordinate(match.groups.y, limit, 'y')
    };
  } catch {
    return null;
  }
}

function recognizeOfficialSource(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return null;

  if (url.origin === SHORTBREAD_ALLOWED_ORIGIN) {
    if (url.toString() === SHORTBREAD_TILEJSON_URL) {
      return {
        sourceId: 'osm-shortbread',
        kind: 'shortbread-tilejson',
        cacheKind: 'road',
        mediaType: 'application/json',
        maximumBytes: SHORTBREAD_TILEJSON_MAXIMUM_BYTES,
        freshMs: SHORTBREAD_FRESH_MS,
        staleMs: SHORTBREAD_STALE_MS,
        proxyPath: `${CACHED_GEO_ROUTE_PREFIX}/osm-shortbread/tilejson`,
        key: `osm-shortbread:tilejson`,
        validate: validateTileJsonBytes
      };
    }
    const tile = parseTile(
      url.pathname,
      /^\/shortbread_v1\/(?<z>\d+)\/(?<x>\d+)\/(?<y>\d+)\.mvt$/u,
      SHORTBREAD_MAX_ZOOM
    );
    if (tile) {
      return {
        sourceId: 'osm-shortbread',
        kind: 'shortbread-tile',
        cacheKind: 'road',
        mediaType: 'application/vnd.mapbox-vector-tile',
        maximumBytes: SHORTBREAD_TILE_MAXIMUM_BYTES,
        freshMs: SHORTBREAD_FRESH_MS,
        staleMs: SHORTBREAD_STALE_MS,
        proxyPath: `${CACHED_GEO_ROUTE_PREFIX}/osm-shortbread/${tile.z}/${tile.x}/${tile.y}.mvt`,
        key: `osm-shortbread:${tile.z}/${tile.x}/${tile.y}`,
        tile,
        validate: (bytes, metadata) => validateShortbreadBytes(bytes, metadata, tile)
      };
    }
    return null;
  }

  if (url.origin === TERRARIUM_ORIGIN) {
    const tile = parseTile(
      url.pathname,
      /^\/terrarium\/(?<z>\d+)\/(?<x>\d+)\/(?<y>\d+)\.png$/u,
      TERRARIUM_MAX_LEVEL
    );
    if (tile) {
      return {
        sourceId: 'aws-terrarium',
        kind: 'terrarium-tile',
        cacheKind: 'terrain',
        mediaType: 'image/png',
        maximumBytes: TERRARIUM_TILE_MAXIMUM_BYTES,
        freshMs: TERRARIUM_FRESH_MS,
        staleMs: TERRARIUM_STALE_MS,
        proxyPath: `${CACHED_GEO_ROUTE_PREFIX}/aws-terrarium/${tile.z}/${tile.x}/${tile.y}.png`,
        key: `aws-terrarium:${tile.z}/${tile.x}/${tile.y}`,
        tile,
        validate: validateTerrariumBytes
      };
    }
  }
  return null;
}

function responseMediaType(metadata) {
  return String(metadata?.responseHeaders?.['content-type'] ?? '')
    .split(';', 1)[0]
    .trim()
    .toLowerCase();
}

function validateTileJsonBytes(bytes, metadata) {
  if (responseMediaType(metadata) !== 'application/json') {
    throw codedError(TypeError, 'ERR_CACHED_GEO_MEDIA_TYPE', 'Shortbread TileJSON must use application/json.');
  }
  let payload;
  try {
    payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw codedError(TypeError, 'ERR_CACHED_GEO_TILEJSON', 'Shortbread TileJSON bytes are invalid.');
  }
  const validated = validateShortbreadTileJson(payload, { requireWater: true });
  if (!/^\d+\.\d+(?:\.\d+)?$/u.test(validated.tilejson)
    || !Number.isInteger(validated.minzoom)
    || validated.minzoom < 0
    || validated.minzoom > validated.maxzoom) {
    throw codedError(TypeError, 'ERR_CACHED_GEO_TILEJSON', 'Shortbread TileJSON pyramid metadata is invalid.');
  }
  for (const template of validated.tiles) {
    const url = new URL(template, SHORTBREAD_TILEJSON_URL);
    if (url.origin !== SHORTBREAD_ALLOWED_ORIGIN
      || decodeURIComponent(url.pathname) !== '/shortbread_v1/{z}/{x}/{y}.mvt') {
      throw codedError(TypeError, 'ERR_CACHED_GEO_TILEJSON', 'Shortbread TileJSON left the fixed official v1 path.');
    }
  }
  return true;
}

function countCoordinates(value, state) {
  if (!Array.isArray(value)) return;
  if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) {
    state.count += 1;
    if (state.count > 1_000_000) {
      throw codedError(RangeError, 'ERR_CACHED_GEO_SHORTBREAD_COORDINATES', 'Shortbread coordinate cap exceeded.');
    }
    return;
  }
  for (const child of value) countCoordinates(child, state);
}

function validateShortbreadBytes(bytes, metadata, tile) {
  const mediaType = responseMediaType(metadata);
  if (![
    'application/vnd.mapbox-vector-tile',
    'application/x-protobuf',
    'application/protobuf',
    'application/octet-stream'
  ].includes(mediaType)) {
    throw codedError(TypeError, 'ERR_CACHED_GEO_MEDIA_TYPE', 'Shortbread vector tiles use an unsupported media type.');
  }
  try {
    const decoded = decodeShortbreadTile(bytes, {
      ...tile,
      maximumFeatures: SHORTBREAD_MAXIMUM_FEATURES_PER_TILE,
      includeWater: true
    });
    const coordinates = { count: 0 };
    for (const collection of [
      decoded.ocean,
      decoded.waterPolygons,
      decoded.streets,
      decoded.buildings
    ]) {
      for (const feature of collection) countCoordinates(feature.geometry?.coordinates, coordinates);
    }
  } catch (error) {
    if (!error?.code) error.code = 'ERR_CACHED_GEO_SHORTBREAD';
    throw error;
  }
  return true;
}

function readUint32(bytes, offset) {
  return ((bytes[offset] << 24) >>> 0)
    + (bytes[offset + 1] << 16)
    + (bytes[offset + 2] << 8)
    + bytes[offset + 3];
}

function validateTerrariumBytes(bytes, metadata) {
  if (responseMediaType(metadata) !== 'image/png') {
    throw codedError(TypeError, 'ERR_CACHED_GEO_MEDIA_TYPE', 'Terrarium tiles must use image/png.');
  }
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.byteLength < 33 || !signature.every((value, index) => bytes[index] === value)
    || String.fromCharCode(...bytes.subarray(12, 16)) !== 'IHDR'
    || readUint32(bytes, 8) !== 13
    || readUint32(bytes, 16) !== TERRARIUM_TILE_SIZE
    || readUint32(bytes, 20) !== TERRARIUM_TILE_SIZE
    || bytes[24] !== 8
    || ![2, 6].includes(bytes[25])
    || bytes[26] !== 0
    || bytes[27] !== 0
    || ![0, 1].includes(bytes[28])) {
    throw codedError(TypeError, 'ERR_CACHED_GEO_TERRARIUM_PNG', 'Terrarium PNG must have a 256 by 256 IHDR.');
  }
  return true;
}

async function readResponseBytes(response, maximumBytes) {
  const declared = Number(response.headers?.get?.('content-length'));
  if (Number.isFinite(declared) && declared > maximumBytes) {
    throw codedError(RangeError, 'ERR_CACHED_GEO_RESPONSE_TOO_LARGE', 'Geo source response exceeds its byte cap.');
  }
  if (typeof response.body?.getReader !== 'function') {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maximumBytes) {
      throw codedError(RangeError, 'ERR_CACHED_GEO_RESPONSE_TOO_LARGE', 'Geo source response exceeds its byte cap.');
    }
    return bytes;
  }
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        throw codedError(RangeError, 'ERR_CACHED_GEO_RESPONSE_TOO_LARGE', 'Geo source response exceeds its byte cap.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function responseHeaders(response) {
  const headers = {};
  for (const name of RESPONSE_HEADER_ALLOWLIST) {
    const value = response.headers?.get?.(name);
    if (value) headers[name] = value;
  }
  return headers;
}

function cacheControlMilliseconds(value) {
  const directives = new Map();
  for (const part of String(value ?? '').split(',')) {
    const [rawName, rawValue] = part.trim().split('=', 2);
    if (!rawName) continue;
    directives.set(rawName.toLowerCase(), rawValue?.replace(/^"|"$/gu, '') ?? true);
  }
  const seconds = (name) => {
    const parsed = Number(directives.get(name));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed * 1_000 : null;
  };
  return {
    maxAgeMs: seconds('s-maxage') ?? seconds('max-age'),
    staleWhileRevalidateMs: seconds('stale-while-revalidate')
  };
}

function boundedFreshness(descriptor, headers, now, proxied) {
  if (!proxied) {
    return {
      freshUntil: now + descriptor.freshMs,
      staleUntil: now + descriptor.staleMs
    };
  }
  const parsed = cacheControlMilliseconds(headers['cache-control']);
  const freshMs = Math.min(descriptor.freshMs, parsed.maxAgeMs ?? 0);
  const backendStaleMs = parsed.maxAgeMs === null
    ? 0
    : parsed.maxAgeMs + (parsed.staleWhileRevalidateMs ?? 0);
  return {
    freshUntil: now + freshMs,
    staleUntil: now + Math.min(descriptor.staleMs, Math.max(freshMs, backendStaleMs))
  };
}

function proxyUrl(baseUrl, path) {
  if (baseUrl === null) return null;
  if (baseUrl === '') return path;
  return new URL(path, `${baseUrl}/`).toString();
}

class GeoResponseError extends Error {
  constructor(response, transport) {
    super(`Geo source returned HTTP ${response.status}.`);
    this.name = 'GeoResponseError';
    this.code = 'ERR_CACHED_GEO_HTTP';
    this.response = response;
    this.transport = transport;
  }
}

function responseFromCache(result) {
  const metadata = result.metadata ?? {};
  return new Response(result.bytes, {
    status: Number(metadata.status ?? 200),
    statusText: String(metadata.statusText ?? ''),
    headers: metadata.responseHeaders ?? {}
  });
}

function isCacheAdmissionError(error) {
  return [
    'ERR_LOCAL_ARTIFACT_CACHE_BUSY',
    'ERR_LOCAL_ARTIFACT_CACHE_DESTROYED',
    'ERR_LOCAL_ARTIFACT_HASH_UNAVAILABLE',
    'ERR_LOCAL_ARTIFACT_METADATA_TOO_LARGE'
  ].includes(error?.code);
}

/**
 * Create a fetch-compatible wrapper for the official Shortbread and AWS
 * Terrarium source URLs. `geodataBaseUrl` is an origin selector: null keeps
 * direct source URLs, '' selects same-origin, and an absolute origin selects
 * that API. The fixed /api/v1/cache path is always appended internally.
 */
export function createCachedGeoFetch({
  fetchImpl = globalThis.fetch,
  geodataBaseUrl = null,
  localRoadCache = null,
  localTerrainCache = null,
  directFallback = true,
  onTelemetry = () => {},
  clock = Date.now
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  if (typeof directFallback !== 'boolean') throw new TypeError('directFallback must be a boolean.');
  if (typeof onTelemetry !== 'function' || typeof clock !== 'function') {
    throw new TypeError('onTelemetry and clock must be functions.');
  }
  for (const [label, cache] of [['localRoadCache', localRoadCache], ['localTerrainCache', localTerrainCache]]) {
    if (cache !== null && typeof cache?.getOrLoad !== 'function') {
      throw new TypeError(`${label} must expose getOrLoad() or be null.`);
    }
  }
  const baseUrl = normalizeGeodataBaseUrl(geodataBaseUrl);
  const transportFetch = fetchImpl.bind(globalThis);
  const lifecycle = new AbortController();
  let destroyed = false;
  const telemetry = {
    schema: 'peercompute.geo.cached-fetch-telemetry.v1',
    requests: 0,
    recognized: 0,
    passThrough: 0,
    proxyRequests: 0,
    directRequests: 0,
    directFallbacks: 0,
    proxyFailures: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cacheCoalesced: 0,
    staleServed: 0,
    cacheBypasses: 0,
    bytesServed: 0,
    lastSourceId: null,
    lastTransport: null,
    lastCacheStatus: null,
    lastErrorCode: null
  };
  const emit = () => {
    try { onTelemetry(Object.freeze({ ...telemetry })); } catch { /* Telemetry cannot break source loading. */ }
  };

  const invoke = (url, input, init, signal) => transportFetch(
    url,
    requestInitFor(input, init, combinedSignal([signal, lifecycle.signal]))
  );

  const fetchTransport = async (descriptor, originalUrl, input, init, signal) => {
    const proxiedUrl = proxyUrl(baseUrl, descriptor.proxyPath);
    if (proxiedUrl !== null) {
      telemetry.proxyRequests += 1;
      telemetry.lastTransport = 'backend-proxy';
      emit();
      try {
        const response = await invoke(proxiedUrl, input, init, signal);
        if (response.ok) return { response, proxied: true, transport: 'backend-proxy' };
        if (!directFallback) throw new GeoResponseError(response, 'backend-proxy');
        telemetry.proxyFailures += 1;
        telemetry.directFallbacks += 1;
        telemetry.lastErrorCode = `HTTP_${response.status}`;
      } catch (error) {
        if (error?.name === 'AbortError') throw error;
        if (!directFallback) throw error;
        telemetry.proxyFailures += error instanceof GeoResponseError ? 0 : 1;
        telemetry.directFallbacks += error instanceof GeoResponseError ? 0 : 1;
        telemetry.lastErrorCode = error?.code ?? error?.name ?? 'PROXY_REQUEST_FAILED';
      }
      telemetry.directRequests += 1;
      telemetry.lastTransport = 'direct-fallback';
      emit();
      const response = await invoke(originalUrl, input, init, signal);
      if (!response.ok) throw new GeoResponseError(response, 'direct-fallback');
      return { response, proxied: false, transport: 'direct-fallback' };
    }

    telemetry.directRequests += 1;
    telemetry.lastTransport = 'direct';
    emit();
    const response = await invoke(originalUrl, input, init, signal);
    if (!response.ok) throw new GeoResponseError(response, 'direct');
    return { response, proxied: false, transport: 'direct' };
  };

  const cachedGeoFetch = async (input, init) => {
    if (destroyed) throw codedError(Error, 'ERR_CACHED_GEO_FETCH_DESTROYED', 'Cached geo fetch is destroyed.');
    telemetry.requests += 1;
    const originalUrl = inputUrl(input);
    const descriptor = inputMethod(input, init) === 'GET' ? recognizeOfficialSource(originalUrl) : null;
    if (!descriptor) {
      telemetry.passThrough += 1;
      telemetry.lastTransport = 'pass-through';
      telemetry.lastSourceId = null;
      emit();
      return transportFetch(input, init);
    }

    telemetry.recognized += 1;
    telemetry.lastSourceId = descriptor.sourceId;
    const signal = inputSignal(input, init);
    const cache = descriptor.cacheKind === 'road' ? localRoadCache : localTerrainCache;
    if (!cache) {
      try {
        return (await fetchTransport(descriptor, originalUrl, input, init, signal)).response;
      } catch (error) {
        telemetry.lastErrorCode = error?.code ?? error?.name ?? 'SOURCE_REQUEST_FAILED';
        emit();
        if (error instanceof GeoResponseError) return error.response;
        throw error;
      }
    }

    const now = clock();
    try {
      const result = await cache.getOrLoad({
        key: descriptor.key,
        sourceId: descriptor.sourceId,
        mediaType: descriptor.mediaType,
        freshUntil: now + descriptor.freshMs,
        staleUntil: now + descriptor.staleMs,
        signal,
        validate: descriptor.validate,
        loader: async ({ signal: sharedSignal, maximumBytes }) => {
          const loaded = await fetchTransport(descriptor, originalUrl, input, init, sharedSignal);
          const headers = responseHeaders(loaded.response);
          const loadedAt = clock();
          const freshness = boundedFreshness(descriptor, headers, loadedAt, loaded.proxied);
          const bytes = await readResponseBytes(
            loaded.response,
            Math.min(descriptor.maximumBytes, maximumBytes ?? descriptor.maximumBytes)
          );
          return {
            bytes,
            metadata: {
              status: loaded.response.status,
              statusText: loaded.response.statusText,
              responseHeaders: headers,
              transport: loaded.transport,
              ...freshness
            }
          };
        }
      });
      telemetry.lastCacheStatus = result.cacheStatus;
      telemetry.lastTransport = result.metadata?.transport ?? telemetry.lastTransport;
      telemetry.bytesServed += result.bytes.byteLength;
      if (result.cacheStatus === 'hit') telemetry.cacheHits += 1;
      else if (result.cacheStatus === 'miss') telemetry.cacheMisses += 1;
      else if (result.cacheStatus === 'coalesced') telemetry.cacheCoalesced += 1;
      else if (result.cacheStatus === 'stale') telemetry.staleServed += 1;
      telemetry.lastErrorCode = result.refreshErrorCode ?? null;
      emit();
      return responseFromCache(result);
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      if (error instanceof GeoResponseError) {
        telemetry.lastErrorCode = error.code;
        emit();
        return error.response;
      }
      if (isCacheAdmissionError(error)) {
        telemetry.cacheBypasses += 1;
        telemetry.lastCacheStatus = 'bypass';
        telemetry.lastErrorCode = error.code;
        emit();
        try {
          return (await fetchTransport(descriptor, originalUrl, input, init, signal)).response;
        } catch (transportError) {
          telemetry.lastErrorCode = transportError?.code ?? transportError?.name ?? 'SOURCE_REQUEST_FAILED';
          emit();
          if (transportError instanceof GeoResponseError) return transportError.response;
          throw transportError;
        }
      }
      telemetry.lastErrorCode = error?.code ?? error?.name ?? 'CACHED_SOURCE_REQUEST_FAILED';
      emit();
      throw error;
    }
  };

  cachedGeoFetch.getTelemetry = () => Object.freeze({ ...telemetry });
  cachedGeoFetch.destroy = async () => {
    if (destroyed) return;
    destroyed = true;
    lifecycle.abort();
  };
  return cachedGeoFetch;
}
