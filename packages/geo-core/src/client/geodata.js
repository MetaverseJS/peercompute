export const GEODATA_DEFAULT_MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
export const OSM_REGION_SCHEMA_VERSION = 'peercompute.geo.osm-region.v1';

function clientError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function normalizeBaseUrl(value, locationLike = globalThis.location) {
  if (value === null) return null;
  const normalized = value === undefined ? '' : String(value).trim();
  if (normalized === '' || normalized.toLowerCase() === 'same-origin') return '';
  const url = new URL(normalized, locationLike?.href ?? 'https://localhost/');
  if (url.username || url.password || url.search || url.hash) {
    throw new TypeError('Geodata API URL may not contain credentials, query, or fragment.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new TypeError('Geodata API URL must use HTTP(S).');
  if (url.pathname !== '/') throw new TypeError('Geodata API URL must be an origin without a path prefix.');
  if (locationLike?.protocol === 'https:' && url.protocol !== 'https:' && url.origin !== locationLike.origin) {
    throw new TypeError('HTTPS pages require an HTTPS or same-origin geodata API.');
  }
  return url.toString().replace(/\/$/, '');
}

function explicitBoolean(value, label) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === '') return false;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  throw new TypeError(`${label} must be an explicit boolean.`);
}

async function readJsonBounded(response, maximumBytes) {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(`Geodata API returned unsupported content type ${contentType || '(missing)'}.`);
  }
  const declared = Number(response.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maximumBytes) {
    throw clientError('ERR_GEODATA_RESPONSE_TOO_LARGE', 'Geodata API response exceeds the byte cap.');
  }
  let bytes;
  if (typeof response.body?.getReader === 'function') {
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
          throw clientError('ERR_GEODATA_RESPONSE_TOO_LARGE', 'Geodata API response exceeds the byte cap.');
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
  } else {
    bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maximumBytes) {
      throw clientError('ERR_GEODATA_RESPONSE_TOO_LARGE', 'Geodata API response exceeds the byte cap.');
    }
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error('Geodata API returned invalid JSON.');
  }
}

function assertFeatureCollection(value, label, geometryTypes) {
  if (value?.type !== 'FeatureCollection' || !Array.isArray(value.features)) {
    throw clientError('ERR_GEODATA_SCHEMA', `${label} must be a canonical GeoJSON FeatureCollection.`);
  }
  for (const feature of value.features) {
    if (feature?.type !== 'Feature'
      || !geometryTypes.has(feature.geometry?.type)
      || !feature.properties
      || typeof feature.properties !== 'object') {
      throw clientError('ERR_GEODATA_SCHEMA', `${label} contains an invalid feature.`);
    }
  }
}

export function validateOsmRegionEnvelope(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw clientError('ERR_GEODATA_SCHEMA', 'Geodata API returned an invalid region envelope.');
  }
  if (payload.schemaVersion !== OSM_REGION_SCHEMA_VERSION
    || !['current', 'stale'].includes(payload.status)
    || payload.synthetic !== false) {
    throw clientError('ERR_GEODATA_SCHEMA', 'Geodata API returned an unsupported region contract.');
  }
  const data = payload.data;
  if (data?.type !== 'OsmRegion' || !data.counts || typeof data.counts !== 'object') {
    throw clientError('ERR_GEODATA_SCHEMA', 'Geodata API omitted canonical OSM region data.');
  }
  assertFeatureCollection(data.roads, 'roads', new Set(['LineString', 'MultiLineString']));
  assertFeatureCollection(data.buildings, 'buildings', new Set(['Polygon', 'MultiPolygon']));
  if (data.roadGraph?.schemaVersion !== 'peercompute.geo.road-graph.v1'
    || !Array.isArray(data.roadGraph.nodes)
    || !Array.isArray(data.roadGraph.edges)) {
    throw clientError('ERR_GEODATA_SCHEMA', 'Geodata API omitted the canonical motorcycle road graph.');
  }
  const expectedCounts = {
    roadWays: data.roads.features.length,
    buildings: data.buildings.features.length,
    graphNodes: data.roadGraph.nodes.length,
    directedGraphEdges: data.roadGraph.edges.length
  };
  for (const [key, expected] of Object.entries(expectedCounts)) {
    if (data.counts[key] !== expected) {
      throw clientError('ERR_GEODATA_SCHEMA', `Geodata API ${key} count does not match its payload.`);
    }
  }
  if (!payload.provenance
    || typeof payload.provenance.attribution !== 'string'
    || typeof payload.provenance.licenseUrl !== 'string'
    || !Array.isArray(payload.bbox?.values)) {
    throw clientError('ERR_GEODATA_SCHEMA', 'Geodata API omitted region provenance or bounds.');
  }
  return payload;
}

export class GeodataClient {
  constructor({ baseUrl = '', fetchImpl = globalThis.fetch, maximumBytes = GEODATA_DEFAULT_MAX_RESPONSE_BYTES } = {}) {
    if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
    if (!Number.isInteger(maximumBytes) || maximumBytes < 1024 || maximumBytes > 16 * 1024 * 1024) {
      throw new RangeError('maximumBytes must be between 1 KiB and 16 MiB.');
    }
    this.baseUrl = normalizeBaseUrl(baseUrl);
    // Chromium's Window.fetch requires its host receiver. Keep injected test
    // transports compatible while preventing an illegal invocation when the
    // native function is stored on this client.
    this.fetchImpl = fetchImpl.bind(globalThis);
    this.maximumBytes = maximumBytes;
  }

  get configured() {
    return this.baseUrl !== null;
  }

  #url(path, searchParams) {
    if (this.baseUrl === null) throw new Error('Geodata API is not configured in this build.');
    const base = this.baseUrl || globalThis.location?.origin || 'http://127.0.0.1';
    const url = new URL(path, `${base}/`);
    if (searchParams) url.search = new URLSearchParams(searchParams).toString();
    return url.toString();
  }

  async #get(path, { searchParams, signal } = {}) {
    const response = await this.fetchImpl(this.#url(path, searchParams), {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'omit',
      redirect: 'error',
      signal
    });
    const payload = await readJsonBounded(response, this.maximumBytes);
    if (!response.ok) {
      const error = new Error(payload?.error?.message ?? `Geodata API returned HTTP ${response.status}.`);
      error.code = payload?.error?.code ?? 'ERR_GEODATA_HTTP';
      error.status = response.status;
      error.retryable = payload?.error?.retryable === true;
      error.notes = Array.isArray(payload?.notes) ? [...payload.notes] : [];
      throw error;
    }
    return payload;
  }

  health(options) {
    return this.#get('/healthz', options);
  }

  catalog(options) {
    return this.#get('/api/v1/catalog', options);
  }

  async osmRegion({ bbox, layers = ['roads', 'buildings'], vehicle = 'motorcycle', signal } = {}) {
    if (!Array.isArray(bbox) || bbox.length !== 4) throw new TypeError('OSM region requires a four-value bbox.');
    const payload = await this.#get('/api/v1/geo/osm', {
      searchParams: {
        bbox: bbox.join(','),
        layers: layers.join(','),
        vehicle
      },
      signal
    });
    return validateOsmRegionEnvelope(payload);
  }
}

export function configuredGeodataBaseUrl(env = import.meta.env) {
  const explicit = String(env?.VITE_GEODATA_API_URL ?? '').trim();
  const sameOrigin = explicitBoolean(env?.VITE_GEODATA_SAME_ORIGIN, 'VITE_GEODATA_SAME_ORIGIN');
  if (explicit && sameOrigin && explicit.toLowerCase() !== 'same-origin') {
    throw new TypeError('Choose either VITE_GEODATA_API_URL or VITE_GEODATA_SAME_ORIGIN, not both.');
  }
  if (explicit) return explicit.toLowerCase() === 'same-origin' ? '' : explicit;
  if (sameOrigin || env?.DEV === true) return '';
  return null;
}
