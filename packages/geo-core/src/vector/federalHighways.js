import { VectorTile } from '@mapbox/vector-tile';
import { PbfReader } from 'pbf';

import { invokeFetch, readResponseBytesBounded } from '../client/http.js';
import { renderShortbreadCommands } from './shortbreadImagery.js';

export const FHWA_NHS_MANIFEST_SCHEMA = 'peercompute.geo.fhwa-nhs-tile-manifest.v1';
export const FHWA_NHS_SOURCE_ID = 'fhwa-national-highway-system';
export const FHWA_NHS_MAXIMUM_MANIFEST_BYTES = 256 * 1024;
export const FHWA_NHS_MAXIMUM_TILE_BYTES = 64 * 1024;
export const FHWA_NHS_MAXIMUM_TOTAL_BYTES = 4 * 1024 * 1024;
export const FHWA_NHS_MAXIMUM_TILES = 2_048;
export const FHWA_NHS_MAXIMUM_TILE_FEATURES = 32;
export const FHWA_NHS_MAXIMUM_TILE_VERTICES = 50_000;

export const FHWA_NHS_CLASSES = Object.freeze({
  1: Object.freeze({ label: 'Interstate', color: '#ff39dc', width: 3.4 }),
  3: Object.freeze({ label: 'Non-Interstate STRAHNET', color: '#ff7438', width: 2.8 }),
  4: Object.freeze({ label: 'STRAHNET Connector', color: '#ffbd3d', width: 2.5 }),
  7: Object.freeze({ label: 'Other NHS', color: '#39ff73', width: 1.8 }),
  8: Object.freeze({ label: 'Approved Intermodal Connector', color: '#25dfff', width: 2.4 }),
  9: Object.freeze({ label: 'Intermodal/STRAHNET dual designation', color: '#bd62ff', width: 2.6 }),
  10: Object.freeze({ label: 'MAP-21 Principal Arterial', color: '#d9ff45', width: 2.0 }),
});

const TILE_SIZE = 512;
const MAXIMUM_INFLIGHT = 32;

function positiveSafeInteger(value, label, maximum = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new RangeError(`${label} must be a positive safe integer no greater than ${maximum}.`);
  }
  return value;
}

function validateBounds(value) {
  if (!Array.isArray(value) || value.length !== 4) throw new TypeError('FHWA NHS bounds must contain west/south/east/north.');
  const bounds = value.map(Number);
  const [west, south, east, north] = bounds;
  if (bounds.some((entry) => !Number.isFinite(entry))
    || west < -180 || east > 180 || south < -90 || north > 90
    || west >= east || south >= north || west > -159 || north < 70) {
    throw new RangeError('FHWA NHS bounds are invalid or no longer demonstrate Alaska coverage.');
  }
  return Object.freeze(bounds);
}

function validateRelativeTileTemplate(template) {
  if (typeof template !== 'string' || !template.includes('{z}') || !template.includes('{x}') || !template.includes('{y}')) {
    throw new TypeError('FHWA NHS tile template must contain z/x/y placeholders.');
  }
  if (template.startsWith('/') || template.includes('..') || /[?#]/u.test(template)) {
    throw new TypeError('FHWA NHS tile template must be a same-directory relative path.');
  }
  return template;
}

function validateHexSha256(value, label) {
  const normalized = String(value ?? '').toLowerCase();
  if (!/^[a-f0-9]{64}$/u.test(normalized)) throw new TypeError(`${label} must be a SHA-256 hex digest.`);
  return normalized;
}

export function validateFederalHighwayManifest(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new TypeError('FHWA NHS manifest must be an object.');
  if (payload.schemaVersion !== FHWA_NHS_MANIFEST_SCHEMA) throw new TypeError('FHWA NHS manifest schema is unsupported.');
  if (!/^fhwa-national-highway-system-\d{4}\.\d{2}\.\d{2}$/u.test(String(payload.datasetId))) {
    throw new TypeError('FHWA NHS dataset ID is invalid.');
  }
  if (!/^\d{4}\.\d{2}\.\d{2}$/u.test(String(payload.version))) throw new TypeError('FHWA NHS version is invalid.');
  if (payload.datasetId !== `fhwa-national-highway-system-${payload.version}`) {
    throw new TypeError('FHWA NHS dataset ID and source version do not match.');
  }
  const archive = payload.source?.archive;
  const sourceRecordCount = Number(payload.source?.sourceRecordCount);
  const retainedRecordCount = Number(payload.source?.retainedRecordCount);
  const dbfActiveRecords = Number(archive?.dbfActiveRecords);
  const dbfDeletedRecords = Number(archive?.dbfDeletedRecords);
  if (payload.source?.itemId !== 'dce9f09392eb474c8ad8e6a78416279b'
    || payload.source?.owner !== 'USDOT_BTS'
    || payload.source?.authority !== 'Federal Highway Administration'
    || !Number.isSafeInteger(sourceRecordCount) || sourceRecordCount < 1
    || !Number.isSafeInteger(retainedRecordCount) || retainedRecordCount < 1
    || retainedRecordCount > sourceRecordCount
    || !Number.isSafeInteger(archive?.bytes) || archive.bytes < 1 || archive.bytes > 128 * 1024 * 1024
    || validateHexSha256(archive?.sha256, 'FHWA NHS source archive') !== archive.sha256
    || archive?.dbfVersion !== payload.version
    || !Number.isSafeInteger(dbfActiveRecords) || dbfActiveRecords < retainedRecordCount
    || !Number.isSafeInteger(dbfDeletedRecords) || dbfDeletedRecords < 0
    || dbfActiveRecords + dbfDeletedRecords !== sourceRecordCount
    || payload.source?.navigationGrade !== false) {
    throw new TypeError('FHWA NHS source identity or provenance is invalid.');
  }
  if (payload.derivation?.geometryExact !== false || payload.derivation?.displayOnly !== true
    || payload.coverage?.completeSourceSnapshot !== true
    || payload.coverage?.completeExactGeometry !== false
    || payload.coverage?.includesAlaska !== true) {
    throw new TypeError('FHWA NHS derivation/coverage disclosure is invalid.');
  }
  const classKeys = Object.keys(payload.classes ?? {}).map(Number).sort((left, right) => left - right);
  const expectedClasses = Object.keys(FHWA_NHS_CLASSES).map(Number).sort((left, right) => left - right);
  if (classKeys.length !== expectedClasses.length
    || classKeys.some((value, index) => value !== expectedClasses[index])) {
    throw new TypeError('FHWA NHS class dictionary drifted.');
  }
  const minzoom = Number(payload.minzoom);
  const maxzoom = Number(payload.maxzoom);
  if (!Number.isInteger(minzoom) || !Number.isInteger(maxzoom) || minzoom < 0 || maxzoom > 12 || minzoom > maxzoom) {
    throw new RangeError('FHWA NHS zoom range is invalid.');
  }
  const maximumTileBytes = positiveSafeInteger(
    Number(payload.maximumTileBytes),
    'FHWA NHS maximumTileBytes',
    FHWA_NHS_MAXIMUM_TILE_BYTES,
  );
  const totalTileBytes = positiveSafeInteger(
    Number(payload.totalTileBytes),
    'FHWA NHS totalTileBytes',
    FHWA_NHS_MAXIMUM_TOTAL_BYTES,
  );
  const tileCount = positiveSafeInteger(
    Number(payload.tileCount),
    'FHWA NHS tileCount',
    FHWA_NHS_MAXIMUM_TILES,
  );
  if (!Array.isArray(payload.tiles) || payload.tiles.length !== tileCount) throw new TypeError('FHWA NHS tile inventory count is invalid.');
  const tiles = new Map();
  let observedTotal = 0;
  for (const entry of payload.tiles) {
    const key = String(entry?.key ?? '');
    const match = /^(\d+)\/(\d+)\/(\d+)$/u.exec(key);
    if (!match) throw new TypeError(`FHWA NHS tile key is invalid: ${key}`);
    const [z, x, y] = match.slice(1).map(Number);
    const limit = 2 ** z;
    if (z < minzoom || z > maxzoom || x < 0 || y < 0 || x >= limit || y >= limit || tiles.has(key)) {
      throw new RangeError(`FHWA NHS tile coordinate is invalid or duplicated: ${key}`);
    }
    const bytes = positiveSafeInteger(Number(entry.bytes), `FHWA NHS tile ${key} bytes`, maximumTileBytes);
    observedTotal += bytes;
    tiles.set(key, Object.freeze({
      key,
      bytes,
      sha256: validateHexSha256(entry.sha256, `FHWA NHS tile ${key}`),
      features: positiveSafeInteger(Number(entry.features), `FHWA NHS tile ${key} features`, FHWA_NHS_MAXIMUM_TILE_FEATURES),
      sourcePoints: Number(entry.sourcePoints ?? 0),
      renderedPoints: Number(entry.renderedPoints ?? 0),
    }));
  }
  if (observedTotal !== totalTileBytes) throw new TypeError('FHWA NHS tile byte inventory does not match its aggregate.');
  const vectorLayerIds = (payload.vector_layers ?? []).map((entry) => entry?.id);
  if (!vectorLayerIds.includes('nhs')) throw new TypeError('FHWA NHS manifest must advertise the nhs MVT layer.');
  return Object.freeze({
    schemaVersion: FHWA_NHS_MANIFEST_SCHEMA,
    datasetId: payload.datasetId,
    version: payload.version,
    generatedAt: payload.generatedAt,
    source: Object.freeze(structuredClone(payload.source)),
    derivation: Object.freeze(structuredClone(payload.derivation)),
    coverage: Object.freeze(structuredClone(payload.coverage)),
    classes: Object.freeze(structuredClone(payload.classes)),
    attribution: String(payload.attribution ?? 'Federal Highway Administration / U.S. DOT BTS'),
    bounds: validateBounds(payload.bounds),
    minzoom,
    maxzoom,
    tileTemplate: validateRelativeTileTemplate(payload.tileTemplate),
    tileCount,
    totalTileBytes,
    maximumTileBytes,
    tiles,
    notes: Object.freeze((Array.isArray(payload.notes) ? payload.notes : []).map(String)),
  });
}

function coordinatesToLines(geometry) {
  if (geometry?.type === 'LineString') return [geometry.coordinates];
  if (geometry?.type === 'MultiLineString') return geometry.coordinates;
  return [];
}

function coordinateCount(geometry) {
  return coordinatesToLines(geometry).reduce((total, line) => total + line.length, 0);
}

function wrappedLongitudeDelta(longitude, origin) {
  let delta = longitude - origin;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

function normalizedLongitude(longitude) {
  let value = longitude;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

export function nearestFederalHighwayPoint(commands, location) {
  if (!Array.isArray(commands)) throw new TypeError('FHWA NHS commands must be an array.');
  const longitude = Number(location?.longitude);
  const latitude = Number(location?.latitude);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)
    || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new RangeError('FHWA NHS snap location is outside WGS84 bounds.');
  }
  const cosine = Math.max(0.01, Math.cos(latitude * Math.PI / 180));
  const metersPerLongitudeDegree = 111_320 * cosine;
  const metersPerLatitudeDegree = 110_574;
  let nearest = null;
  for (const command of commands) {
    for (const line of coordinatesToLines(command?.geometry)) {
      for (let index = 1; index < line.length; index += 1) {
        const left = line[index - 1];
        const right = line[index];
        if (![left?.[0], left?.[1], right?.[0], right?.[1]].every(Number.isFinite)) continue;
        const ax = wrappedLongitudeDelta(left[0], longitude) * metersPerLongitudeDegree;
        const ay = (left[1] - latitude) * metersPerLatitudeDegree;
        const bx = wrappedLongitudeDelta(right[0], longitude) * metersPerLongitudeDegree;
        const by = (right[1] - latitude) * metersPerLatitudeDegree;
        const dx = bx - ax;
        const dy = by - ay;
        const lengthSquared = dx * dx + dy * dy;
        const fraction = lengthSquared <= 1e-9
          ? 0
          : Math.min(1, Math.max(0, -(ax * dx + ay * dy) / lengthSquared));
        const x = ax + dx * fraction;
        const y = ay + dy * fraction;
        const distanceMeters = Math.hypot(x, y);
        if (nearest && distanceMeters >= nearest.distanceMeters) continue;
        nearest = {
          location: {
            longitude: normalizedLongitude(longitude + x / metersPerLongitudeDegree),
            latitude: latitude + y / metersPerLatitudeDegree,
          },
          distanceMeters,
          nhsCode: command.properties?.nhsCode ?? null,
          nhsClass: command.properties?.nhsClass ?? null,
        };
      }
    }
  }
  return nearest ? Object.freeze({
    ...nearest,
    location: Object.freeze({
      longitude: Number(nearest.location.longitude.toFixed(6)),
      latitude: Number(nearest.location.latitude.toFixed(6)),
    }),
  }) : null;
}

function webMercatorTile(location, zoom) {
  const tiles = 2 ** zoom;
  const longitude = normalizedLongitude(Number(location.longitude));
  const latitude = Math.max(-85.0511287798066, Math.min(85.0511287798066, Number(location.latitude)));
  const radians = latitude * Math.PI / 180;
  return {
    x: Math.min(tiles - 1, Math.max(0, Math.floor((longitude + 180) / 360 * tiles))),
    y: Math.min(tiles - 1, Math.max(0, Math.floor(
      (1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2 * tiles,
    ))),
  };
}

function centerOutTileKeys(location, zoom, maximumTiles) {
  const center = webMercatorTile(location, zoom);
  const width = 2 ** zoom;
  const keys = [];
  for (let radius = 0; keys.length < maximumTiles && radius <= 2; radius += 1) {
    for (let dy = -radius; dy <= radius && keys.length < maximumTiles; dy += 1) {
      for (let dx = -radius; dx <= radius && keys.length < maximumTiles; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const y = center.y + dy;
        if (y < 0 || y >= width) continue;
        const x = (center.x + dx + width) % width;
        keys.push(Object.freeze({ key: `${zoom}/${x}/${y}`, x, y, z: zoom }));
      }
    }
  }
  return keys;
}

export function decodeFederalHighwayTile(bytes, { x, y, z } = {}) {
  if (!(bytes instanceof ArrayBuffer) && !ArrayBuffer.isView(bytes)) throw new TypeError('FHWA NHS tile must be bytes.');
  for (const [value, label] of [[x, 'x'], [y, 'y'], [z, 'z']]) {
    if (!Number.isInteger(value) || value < 0) throw new RangeError(`FHWA NHS tile ${label} is invalid.`);
  }
  const input = bytes instanceof ArrayBuffer
    ? new Uint8Array(bytes)
    : new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tile = new VectorTile(new PbfReader(input));
  const layer = tile.layers.nhs;
  if (!layer) throw new TypeError('FHWA NHS tile omitted the nhs vector layer.');
  if (layer.length < 1 || layer.length > FHWA_NHS_MAXIMUM_TILE_FEATURES) {
    throw new RangeError('FHWA NHS tile feature count is outside the cap.');
  }
  const commands = [];
  let vertices = 0;
  for (let index = 0; index < layer.length; index += 1) {
    const feature = layer.feature(index).toGeoJSON(x, y, z);
    const code = Number(feature.properties?.NHS);
    const style = FHWA_NHS_CLASSES[code];
    if (!style) throw new TypeError(`FHWA NHS tile contains unsupported class ${feature.properties?.NHS}.`);
    const count = coordinateCount(feature.geometry);
    if (count < 2) continue;
    vertices += count;
    if (vertices > FHWA_NHS_MAXIMUM_TILE_VERTICES) throw new RangeError('FHWA NHS tile exceeds the rendered-vertex cap.');
    commands.push(Object.freeze({
      kind: 'road',
      geometry: feature.geometry,
      stroke: style.color,
      width: style.width,
      category: `nhs-${code}`,
      properties: Object.freeze({
        nhsCode: code,
        nhsClass: style.label,
        sourceId: FHWA_NHS_SOURCE_ID,
        sourceAuthoritative: true,
        geometryExact: false,
        displayOnly: true,
        navigationGrade: false,
      }),
    }));
  }
  return Object.freeze({ commands: Object.freeze(commands), vertices });
}

async function sha256Hex(bytes) {
  if (!globalThis.crypto?.subtle) throw new Error('WebCrypto is required to verify FHWA NHS tiles.');
  const input = bytes instanceof Uint8Array
    ? bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
    : bytes;
  const digest = await globalThis.crypto.subtle.digest('SHA-256', input);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

function formatTileUrl(manifestUrl, template, key) {
  const [z, x, y] = key.split('/');
  const relative = template.replace('{z}', z).replace('{x}', x).replace('{y}', y);
  const url = new URL(relative, manifestUrl);
  const manifest = new URL(manifestUrl);
  if (url.origin !== manifest.origin || url.username || url.password || url.search || url.hash) {
    throw new TypeError('FHWA NHS tile URL must remain on the manifest origin.');
  }
  return url.toString();
}

function transparentCanvas(canvasFactory) {
  const canvas = canvasFactory();
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  canvas.getContext('2d')?.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
  return canvas;
}

export class FederalHighwayImageryProvider {
  constructor(Cesium, {
    manifest,
    manifestUrl,
    fetchImpl = globalThis.fetch,
    canvasFactory = () => document.createElement('canvas'),
    maximumCachedCanvases = 64,
    onTelemetry = () => {},
  } = {}) {
    if (!Cesium?.WebMercatorTilingScheme || !Cesium?.Event || !Cesium?.Credit || !Cesium?.Rectangle) {
      throw new TypeError('Cesium imagery primitives are required for FHWA NHS tiles.');
    }
    this.Cesium = Cesium;
    this.manifest = validateFederalHighwayManifest(manifest);
    this.manifestUrl = new URL(manifestUrl).toString();
    this.fetchImpl = fetchImpl;
    this.canvasFactory = canvasFactory;
    this.maximumCachedCanvases = positiveSafeInteger(maximumCachedCanvases, 'maximumCachedCanvases', 256);
    this.onTelemetry = onTelemetry;
    this.byteCache = new Map();
    this.canvasCache = new Map();
    this.inflight = new Map();
    this.controllers = new Set();
    this.destroyed = false;
    this.requested = 0;
    this.loaded = 0;
    this.failed = 0;
    this.responseBytes = 0;
    this.renderedRoads = 0;
    this.renderedVertices = 0;
    this.emptyTileRequests = 0;
    this._tilingScheme = new Cesium.WebMercatorTilingScheme();
    this._rectangle = Cesium.Rectangle.fromDegrees(...this.manifest.bounds);
    this._errorEvent = new Cesium.Event();
    this._credit = new Cesium.Credit(
      '<a href="https://www.fhwa.dot.gov/Planning/national_highway_system/" target="_blank" rel="noopener">FHWA National Highway System</a> / U.S. DOT BTS · generalized display',
      true,
    );
    this._transparentCanvas = null;
  }

  get tileWidth() { return TILE_SIZE; }
  get tileHeight() { return TILE_SIZE; }
  get minimumLevel() { return this.manifest.minzoom; }
  get maximumLevel() { return this.manifest.maxzoom; }
  get tilingScheme() { return this._tilingScheme; }
  get rectangle() { return this._rectangle; }
  get tileDiscardPolicy() { return undefined; }
  get errorEvent() { return this._errorEvent; }
  get credit() { return this._credit; }
  get proxy() { return undefined; }
  get hasAlphaChannel() { return true; }

  getTelemetry(lastError = null) {
    return Object.freeze({
      status: this.failed > 0 && this.loaded === 0 ? 'unavailable' : this.loaded > 0 ? 'current' : 'loading',
      datasetId: this.manifest.datasetId,
      version: this.manifest.version,
      sourceRecordCount: this.manifest.source.sourceRecordCount,
      retainedRecordCount: this.manifest.source.retainedRecordCount,
      requested: this.requested,
      loaded: this.loaded,
      failed: this.failed,
      availableTiles: this.manifest.tileCount,
      byteCache: this.byteCache.size,
      canvasCache: this.canvasCache.size,
      inflight: this.inflight.size,
      responseBytes: this.responseBytes,
      renderedRoads: this.renderedRoads,
      renderedVertices: this.renderedVertices,
      emptyTileRequests: this.emptyTileRequests,
      geometryExact: false,
      displayOnly: true,
      includesAlaska: true,
      lastError,
    });
  }

  #telemetry(lastError = null) {
    this.onTelemetry(this.getTelemetry(lastError));
  }

  #rememberCanvas(key, canvas) {
    this.canvasCache.delete(key);
    this.canvasCache.set(key, canvas);
    while (this.canvasCache.size > this.maximumCachedCanvases) {
      this.canvasCache.delete(this.canvasCache.keys().next().value);
    }
  }

  async #loadTile(key, entry, x, y, level, controller) {
    let bytes = this.byteCache.get(key);
    if (!bytes) {
      this.requested += 1;
      const response = await invokeFetch(this.fetchImpl, formatTileUrl(this.manifestUrl, this.manifest.tileTemplate, key), {
        method: 'GET',
        headers: { accept: 'application/vnd.mapbox-vector-tile,application/x-protobuf,application/octet-stream' },
        credentials: 'omit',
        cache: 'force-cache',
        redirect: 'error',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`FHWA NHS tile ${key} returned HTTP ${response.status}.`);
      bytes = await readResponseBytesBounded(response, {
        maximumBytes: entry.bytes,
        label: `FHWA NHS tile ${key}`,
        tooLargeCode: 'ERR_FHWA_NHS_TILE_TOO_LARGE',
      });
      if (bytes.byteLength !== entry.bytes) throw new Error(`FHWA NHS tile ${key} length mismatch.`);
      if (await sha256Hex(bytes) !== entry.sha256) throw new Error(`FHWA NHS tile ${key} checksum mismatch.`);
      if (this.responseBytes + bytes.byteLength > this.manifest.totalTileBytes) {
        throw new RangeError('FHWA NHS tile responses exceed the manifest aggregate byte cap.');
      }
      this.byteCache.set(key, bytes);
      this.responseBytes += bytes.byteLength;
      this.loaded += 1;
    }
    const decoded = decodeFederalHighwayTile(bytes, { x, y, z: level });
    const canvas = this.canvasFactory();
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('FHWA NHS canvas has no 2D context.');
    renderShortbreadCommands(context, decoded.commands, { x, y, z: level, size: TILE_SIZE });
    this.renderedRoads += decoded.commands.length;
    this.renderedVertices += decoded.vertices;
    this.#rememberCanvas(key, canvas);
    this.#telemetry();
    return canvas;
  }

  requestImage(x, y, level, request) {
    if (this.destroyed || request?.cancelled) return undefined;
    const key = `${level}/${x}/${y}`;
    const entry = this.manifest.tiles.get(key);
    if (!entry) {
      this.emptyTileRequests += 1;
      this._transparentCanvas ??= transparentCanvas(this.canvasFactory);
      this.#telemetry();
      return Promise.resolve(this._transparentCanvas);
    }
    const cached = this.canvasCache.get(key);
    if (cached) {
      this.#rememberCanvas(key, cached);
      return Promise.resolve(cached);
    }
    if (this.inflight.has(key)) return this.inflight.get(key);
    if (this.inflight.size >= MAXIMUM_INFLIGHT) return undefined;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    this.controllers.add(controller);
    const promise = this.#loadTile(key, entry, x, y, level, controller).catch((error) => {
      if (error?.name !== 'AbortError') {
        this.failed += 1;
        this.#telemetry(error instanceof Error ? error.message : String(error));
        this._errorEvent.raiseEvent(error);
      }
      throw error;
    }).finally(() => {
      clearTimeout(timeout);
      this.controllers.delete(controller);
      this.inflight.delete(key);
    });
    this.inflight.set(key, promise);
    return promise;
  }

  async findNearestHighway(location, {
    maximumTiles = 25,
    maximumDistanceMeters = 100_000,
    signal,
  } = {}) {
    if (this.destroyed) throw new Error('FHWA NHS provider is destroyed.');
    const tileLimit = positiveSafeInteger(maximumTiles, 'maximumTiles', 25);
    if (!Number.isFinite(maximumDistanceMeters) || maximumDistanceMeters <= 0 || maximumDistanceMeters > 500_000) {
      throw new RangeError('maximumDistanceMeters must be between zero and 500000.');
    }
    // Search the most detailed derived display tiles, center-out. The source
    // was simplified at 1 km, while z8 avoids adding the much larger z5 tile
    // tolerance to the point used for the bounded local OSM request.
    const zoom = this.manifest.maxzoom;
    const commands = [];
    let searchedTiles = 0;
    let availableTiles = 0;
    for (const tile of centerOutTileKeys(location, zoom, tileLimit)) {
      if (signal?.aborted) throw signal.reason ?? new DOMException('Aborted', 'AbortError');
      searchedTiles += 1;
      if (!this.manifest.tiles.has(tile.key)) continue;
      availableTiles += 1;
      await this.requestImage(tile.x, tile.y, tile.z);
      const bytes = this.byteCache.get(tile.key);
      if (!bytes) continue;
      commands.push(...decodeFederalHighwayTile(bytes, tile).commands);
    }
    const nearest = nearestFederalHighwayPoint(commands, location);
    if (!nearest || nearest.distanceMeters > maximumDistanceMeters) return null;
    return Object.freeze({
      ...nearest,
      clickedLocation: Object.freeze({
        longitude: Number(location.longitude),
        latitude: Number(location.latitude),
      }),
      searchedTiles,
      availableTiles,
      maximumTiles: tileLimit,
      maximumDistanceMeters,
      sourceId: FHWA_NHS_SOURCE_ID,
      geometryExact: false,
      displayOnly: true,
      navigationGrade: false,
    });
  }

  pickFeatures() { return undefined; }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
    this.byteCache.clear();
    this.canvasCache.clear();
    this.inflight.clear();
    this._transparentCanvas = null;
  }
}

export async function loadFederalHighwayImageryProvider(Cesium, {
  manifestUrl,
  fetchImpl = globalThis.fetch,
  signal,
  timeoutMs = 15_000,
  ...options
} = {}) {
  const url = new URL(manifestUrl, globalThis.location?.href).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const combined = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
    const response = await invokeFetch(fetchImpl, url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'omit',
      cache: 'force-cache',
      redirect: 'error',
      signal: combined,
    });
    if (!response.ok) throw new Error(`FHWA NHS manifest returned HTTP ${response.status}.`);
    const bytes = await readResponseBytesBounded(response, {
      maximumBytes: FHWA_NHS_MAXIMUM_MANIFEST_BYTES,
      label: 'FHWA NHS manifest',
      tooLargeCode: 'ERR_FHWA_NHS_MANIFEST_TOO_LARGE',
    });
    const manifest = JSON.parse(new TextDecoder().decode(bytes));
    return new FederalHighwayImageryProvider(Cesium, {
      ...options,
      manifest,
      manifestUrl: url,
      fetchImpl,
    });
  } finally {
    clearTimeout(timeout);
  }
}
