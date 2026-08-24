import {
  decodeShortbreadTile,
  formatShortbreadTileUrl,
  OSM_ATTRIBUTION_HTML,
  shortbreadDrawCommands,
  SHORTBREAD_TILEJSON_URL,
  validateShortbreadTileJson
} from '@peercompute/geo-core';
import { invokeFetch, readResponseBytesBounded } from '../http.js';

const TILE_SIZE = 512;
const MAX_TILE_BYTES = 2 * 1024 * 1024;
const MAX_TILEJSON_BYTES = 512 * 1024;

async function fetchBytesBounded(fetchImpl, url, { accept, maximumBytes, signal }) {
  const response = await invokeFetch(fetchImpl, url, {
    method: 'GET',
    headers: { accept },
    credentials: 'omit',
    redirect: 'error',
    signal
  });
  if (!response.ok) throw new Error(`Shortbread upstream returned HTTP ${response.status}.`);
  const bytes = await readResponseBytesBounded(response, {
    maximumBytes,
    label: 'Shortbread response',
    tooLargeCode: 'ERR_SHORTBREAD_RESPONSE_TOO_LARGE'
  });
  return { bytes, contentType: response.headers.get('content-type') ?? '' };
}

export function projectLonLatToTilePixel([longitude, latitude], { x, y, z, size = TILE_SIZE }) {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) throw new TypeError('Finite longitude/latitude required.');
  const tiles = 2 ** z;
  const clampedLatitude = Math.max(-85.0511287798066, Math.min(85.0511287798066, latitude));
  const latitudeRadians = clampedLatitude * Math.PI / 180;
  const worldX = ((longitude + 180) / 360) * tiles;
  const worldY = (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2 * tiles;
  return [(worldX - x) * size, (worldY - y) * size];
}

function coordinatesToLines(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'LineString') return [geometry.coordinates];
  if (geometry.type === 'MultiLineString' || geometry.type === 'Polygon') return geometry.coordinates;
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat();
  return [];
}

function traceGeometry(context, geometry, tile) {
  const lines = coordinatesToLines(geometry);
  context.beginPath();
  for (const line of lines) {
    if (!Array.isArray(line) || line.length < 2) continue;
    const first = projectLonLatToTilePixel(line[0], tile);
    context.moveTo(first[0], first[1]);
    for (let index = 1; index < line.length; index += 1) {
      const point = projectLonLatToTilePixel(line[index], tile);
      context.lineTo(point[0], point[1]);
    }
    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') context.closePath();
  }
}

export function renderShortbreadCommands(context, commands, tile) {
  if (!context || typeof context.beginPath !== 'function') throw new TypeError('A 2D canvas context is required.');
  context.clearRect(0, 0, tile.size, tile.size);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const command of commands) {
    traceGeometry(context, command.geometry, tile);
    context.shadowBlur = command.kind === 'road' ? 8 : 5;
    context.shadowColor = command.stroke;
    context.strokeStyle = command.stroke;
    context.lineWidth = command.width;
    if (command.fill) {
      context.fillStyle = command.fill;
      context.fill('evenodd');
    }
    context.stroke();
  }
  context.shadowBlur = 0;
}

export class ShortbreadImageryProvider {
  constructor(Cesium, {
    tileJson,
    fetchImpl = globalThis.fetch,
    canvasFactory = () => document.createElement('canvas'),
    maximumCachedTiles = 96,
    onTelemetry = () => {}
  }) {
    if (!Cesium?.WebMercatorTilingScheme || !Cesium?.Event || !Cesium?.Credit) {
      throw new TypeError('Cesium imagery primitives are required.');
    }
    this.Cesium = Cesium;
    this.tileJson = validateShortbreadTileJson(tileJson);
    this.fetchImpl = fetchImpl;
    this.canvasFactory = canvasFactory;
    this.maximumCachedTiles = maximumCachedTiles;
    this.onTelemetry = onTelemetry;
    this.cache = new Map();
    this.inflight = new Map();
    this.controllers = new Set();
    this.destroyed = false;
    this.requested = 0;
    this.loaded = 0;
    this.failed = 0;
    this.renderedCommands = 0;
    this.roadCommands = 0;
    this.buildingCommands = 0;
    this.emptyTiles = 0;
    this._tilingScheme = new Cesium.WebMercatorTilingScheme();
    this._errorEvent = new Cesium.Event();
    this._credit = new Cesium.Credit(OSM_ATTRIBUTION_HTML, true);
  }

  get tileWidth() { return TILE_SIZE; }
  get tileHeight() { return TILE_SIZE; }
  get maximumLevel() { return this.tileJson.maxzoom; }
  get minimumLevel() { return this.tileJson.minzoom; }
  get tilingScheme() { return this._tilingScheme; }
  get rectangle() { return this._tilingScheme.rectangle; }
  get tileDiscardPolicy() { return undefined; }
  get errorEvent() { return this._errorEvent; }
  get credit() { return this._credit; }
  get proxy() { return undefined; }
  get hasAlphaChannel() { return true; }

  #telemetry(lastError = null) {
    this.onTelemetry({
      requested: this.requested,
      loaded: this.loaded,
      failed: this.failed,
      cached: this.cache.size,
      inflight: this.inflight.size,
      renderedCommands: this.renderedCommands,
      roadCommands: this.roadCommands,
      buildingCommands: this.buildingCommands,
      emptyTiles: this.emptyTiles,
      lastError
    });
  }

  #remember(key, canvas) {
    this.cache.delete(key);
    this.cache.set(key, canvas);
    while (this.cache.size > this.maximumCachedTiles) this.cache.delete(this.cache.keys().next().value);
  }

  requestImage(x, y, level, request) {
    if (this.destroyed || request?.cancelled) return undefined;
    const key = `${level}/${x}/${y}`;
    const cached = this.cache.get(key);
    if (cached) {
      this.cache.delete(key);
      this.cache.set(key, cached);
      return Promise.resolve(cached);
    }
    if (this.inflight.has(key)) return this.inflight.get(key);
    this.requested += 1;
    const controller = new AbortController();
    this.controllers.add(controller);
    const promise = (async () => {
      const url = formatShortbreadTileUrl(this.tileJson.tiles[0], { x, y, z: level });
      const { bytes } = await fetchBytesBounded(this.fetchImpl, url, {
        accept: 'application/vnd.mapbox-vector-tile,application/x-protobuf,application/octet-stream',
        maximumBytes: MAX_TILE_BYTES,
        signal: controller.signal
      });
      const decoded = decodeShortbreadTile(bytes, { x, y, z: level });
      const commands = shortbreadDrawCommands(decoded);
      const canvas = this.canvasFactory();
      canvas.width = TILE_SIZE;
      canvas.height = TILE_SIZE;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Shortbread canvas has no 2D context.');
      renderShortbreadCommands(context, commands, { x, y, z: level, size: TILE_SIZE });
      this.loaded += 1;
      this.renderedCommands += commands.length;
      this.roadCommands += commands.filter((command) => command.kind === 'road').length;
      this.buildingCommands += commands.filter((command) => command.kind === 'building').length;
      if (commands.length === 0) this.emptyTiles += 1;
      this.#remember(key, canvas);
      this.#telemetry();
      return canvas;
    })().catch((error) => {
      if (error?.name !== 'AbortError') {
        this.failed += 1;
        this.#telemetry(error instanceof Error ? error.message : String(error));
        this._errorEvent.raiseEvent(error);
      }
      throw error;
    }).finally(() => {
      this.controllers.delete(controller);
      this.inflight.delete(key);
    });
    this.inflight.set(key, promise);
    return promise;
  }

  pickFeatures() { return undefined; }

  destroy() {
    this.destroyed = true;
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
    this.cache.clear();
    this.inflight.clear();
  }
}

export async function loadShortbreadImageryProvider(Cesium, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 15_000);
  try {
    const { bytes } = await fetchBytesBounded(fetchImpl, SHORTBREAD_TILEJSON_URL, {
      accept: 'application/json',
      maximumBytes: MAX_TILEJSON_BYTES,
      signal: options.signal ? AbortSignal.any([options.signal, controller.signal]) : controller.signal
    });
    const tileJson = JSON.parse(new TextDecoder().decode(bytes));
    return new ShortbreadImageryProvider(Cesium, { ...options, fetchImpl, tileJson });
  } finally {
    clearTimeout(timeoutId);
  }
}
