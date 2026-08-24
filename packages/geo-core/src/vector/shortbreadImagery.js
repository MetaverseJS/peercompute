import { invokeFetch, readResponseBytesBounded } from '../client/http.js';
import { OSM_ATTRIBUTION_HTML } from '../sources/catalog.js';
import {
  decodeShortbreadTile,
  formatShortbreadTileUrl,
  shortbreadDrawCommands,
  SHORTBREAD_TILEJSON_URL,
  SHORTBREAD_WATER_STYLE,
  validateShortbreadTileJson,
} from './shortbread.js';

const TILE_SIZE = 512;
const DEFAULT_MAXIMUM_TILE_BYTES = 2 * 1024 * 1024;
const MAXIMUM_TILEJSON_BYTES = 512 * 1024;

function positiveSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive safe integer.`);
  }
  return value;
}

async function fetchBytesBounded(fetchImpl, url, {
  accept,
  maximumBytes,
  signal,
}) {
  const response = await invokeFetch(fetchImpl, url, {
    method: 'GET',
    headers: { accept },
    credentials: 'omit',
    redirect: 'error',
    signal,
  });
  if (!response.ok) throw new Error(`Shortbread upstream returned HTTP ${response.status}.`);
  const bytes = await readResponseBytesBounded(response, {
    maximumBytes,
    label: 'Shortbread response',
    tooLargeCode: 'ERR_SHORTBREAD_RESPONSE_TOO_LARGE',
  });
  return { bytes, contentType: response.headers.get('content-type') ?? '' };
}

export function projectLonLatToTilePixel([longitude, latitude], {
  x,
  y,
  z,
  size = TILE_SIZE,
}) {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    throw new TypeError('Finite longitude/latitude required.');
  }
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

function coordinatePositionCount(value) {
  if (!Array.isArray(value)) return 0;
  if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) return 1;
  return value.reduce((total, child) => total + coordinatePositionCount(child), 0);
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
  if (!context || typeof context.beginPath !== 'function') {
    throw new TypeError('A 2D canvas context is required.');
  }
  context.clearRect(0, 0, tile.size, tile.size);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const command of commands) {
    traceGeometry(context, command.geometry, tile);
    const hasStroke = typeof command.stroke === 'string' && command.stroke.length > 0 && command.width > 0;
    context.shadowBlur = command.kind === 'road' ? 8 : command.kind === 'building' ? 5 : 0;
    context.shadowColor = hasStroke ? command.stroke : 'transparent';
    if (command.fill) {
      context.fillStyle = command.fill;
      context.fill('evenodd');
    }
    if (hasStroke) {
      context.strokeStyle = command.stroke;
      context.lineWidth = command.width;
      context.stroke();
    }
  }
  context.shadowBlur = 0;
}

export class ShortbreadImageryProvider {
  constructor(Cesium, {
    tileJson,
    fetchImpl = globalThis.fetch,
    canvasFactory = () => document.createElement('canvas'),
    maximumCachedTiles = 96,
    maximumTileBytes = DEFAULT_MAXIMUM_TILE_BYTES,
    maximumTotalBytes = Number.MAX_SAFE_INTEGER,
    maximumRenderedVertices = Number.MAX_SAFE_INTEGER,
    minimumLevel,
    maximumLevel,
    rectangle,
    allowedTileKeys = null,
    commandFilter = null,
    includeWater = false,
    onTelemetry = () => {},
  }) {
    if (!Cesium?.WebMercatorTilingScheme || !Cesium?.Event || !Cesium?.Credit) {
      throw new TypeError('Cesium imagery primitives are required.');
    }
    if (commandFilter !== null && typeof commandFilter !== 'function') {
      throw new TypeError('Shortbread commandFilter must be a function or null.');
    }
    if (allowedTileKeys !== null && typeof allowedTileKeys?.[Symbol.iterator] !== 'function') {
      throw new TypeError('Shortbread allowedTileKeys must be iterable or null.');
    }
    if (typeof includeWater !== 'boolean') throw new TypeError('Shortbread includeWater must be a boolean.');
    this.Cesium = Cesium;
    this.tileJson = validateShortbreadTileJson(tileJson, { requireWater: includeWater });
    this.fetchImpl = fetchImpl;
    this.canvasFactory = canvasFactory;
    this.maximumCachedTiles = positiveSafeInteger(maximumCachedTiles, 'maximumCachedTiles');
    this.maximumTileBytes = positiveSafeInteger(maximumTileBytes, 'maximumTileBytes');
    this.maximumTotalBytes = positiveSafeInteger(maximumTotalBytes, 'maximumTotalBytes');
    this.maximumRenderedVertices = positiveSafeInteger(maximumRenderedVertices, 'maximumRenderedVertices');
    this.minimumZoom = minimumLevel ?? this.tileJson.minzoom;
    this.maximumZoom = maximumLevel ?? this.tileJson.maxzoom;
    if (!Number.isInteger(this.minimumZoom) || !Number.isInteger(this.maximumZoom)
      || this.minimumZoom < this.tileJson.minzoom
      || this.maximumZoom > this.tileJson.maxzoom
      || this.maximumZoom < this.minimumZoom) {
      throw new RangeError('Shortbread imagery zoom bounds must be integers inside the TileJSON range.');
    }
    this.commandFilter = commandFilter;
    this.includeWater = includeWater;
    this.allowedTileKeys = allowedTileKeys === null
      ? null
      : new Set([...allowedTileKeys].map((key) => String(key)));
    this.onTelemetry = onTelemetry;
    this.cache = new Map();
    this.inflight = new Map();
    this.controllers = new Set();
    this.destroyed = false;
    this.requested = 0;
    this.loaded = 0;
    this.failed = 0;
    this.responseBytes = 0;
    this.renderedVertices = 0;
    this.renderedCommands = 0;
    this.roadCommands = 0;
    this.buildingCommands = 0;
    this.waterCommands = 0;
    this.oceanCommands = 0;
    this.inlandWaterCommands = 0;
    this.waterVertices = 0;
    this.emptyTiles = 0;
    this.filteredTileRequests = 0;
    this.transparentCanvas = null;
    this._tilingScheme = new Cesium.WebMercatorTilingScheme();
    this._rectangle = rectangle ?? this._tilingScheme.rectangle;
    this._errorEvent = new Cesium.Event();
    this._credit = new Cesium.Credit(OSM_ATTRIBUTION_HTML, true);
  }

  get tileWidth() { return TILE_SIZE; }
  get tileHeight() { return TILE_SIZE; }
  get maximumLevel() { return this.maximumZoom; }
  get minimumLevel() { return this.minimumZoom; }
  get tilingScheme() { return this._tilingScheme; }
  get rectangle() { return this._rectangle; }
  get tileDiscardPolicy() { return undefined; }
  get errorEvent() { return this._errorEvent; }
  get credit() { return this._credit; }
  get proxy() { return undefined; }
  get hasAlphaChannel() { return true; }

  getTelemetry(lastError = null) {
    return Object.freeze({
      requested: this.requested,
      loaded: this.loaded,
      failed: this.failed,
      cached: this.cache.size,
      inflight: this.inflight.size,
      responseBytes: this.responseBytes,
      maximumTileBytes: this.maximumTileBytes,
      maximumTotalBytes: this.maximumTotalBytes,
      maximumRenderedVertices: this.maximumRenderedVertices,
      aggregateBudgetScope: 'provider-session-lifetime',
      minimumLevel: this.minimumZoom,
      maximumLevel: this.maximumZoom,
      renderedCommands: this.renderedCommands,
      renderedVertices: this.renderedVertices,
      roadCommands: this.roadCommands,
      buildingCommands: this.buildingCommands,
      waterEnabled: this.includeWater,
      waterCommands: this.waterCommands,
      oceanCommands: this.oceanCommands,
      inlandWaterCommands: this.inlandWaterCommands,
      waterVertices: this.waterVertices,
      waterStyle: this.includeWater ? SHORTBREAD_WATER_STYLE : null,
      emptyTiles: this.emptyTiles,
      filteredTileRequests: this.filteredTileRequests,
      lastError,
    });
  }

  #telemetry(lastError = null) {
    this.onTelemetry(this.getTelemetry(lastError));
  }

  #remember(key, canvas) {
    this.cache.delete(key);
    this.cache.set(key, canvas);
    while (this.cache.size > this.maximumCachedTiles) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }

  requestImage(x, y, level, request) {
    if (this.destroyed || request?.cancelled) return undefined;
    const key = `${level}/${x}/${y}`;
    if (this.allowedTileKeys && !this.allowedTileKeys.has(key)) {
      this.filteredTileRequests += 1;
      if (!this.transparentCanvas) {
        this.transparentCanvas = this.canvasFactory();
        this.transparentCanvas.width = TILE_SIZE;
        this.transparentCanvas.height = TILE_SIZE;
        this.transparentCanvas.getContext('2d')?.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
      }
      this.#telemetry();
      return Promise.resolve(this.transparentCanvas);
    }
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
        maximumBytes: this.maximumTileBytes,
        signal: controller.signal,
      });
      if (bytes.byteLength > this.maximumTotalBytes - this.responseBytes) {
        const error = new RangeError(`Shortbread imagery exceeds the ${this.maximumTotalBytes}-byte aggregate cap.`);
        error.code = 'ERR_SHORTBREAD_AGGREGATE_TOO_LARGE';
        throw error;
      }
      this.responseBytes += bytes.byteLength;
      const decoded = decodeShortbreadTile(bytes, {
        x,
        y,
        z: level,
        includeWater: this.includeWater,
      });
      let commands = shortbreadDrawCommands(decoded);
      if (this.commandFilter) commands = commands.filter(this.commandFilter);
      const waterCommands = commands.filter((command) => command.kind === 'water');
      const tileWaterVertices = waterCommands.reduce(
        (total, command) => total + coordinatePositionCount(command.geometry?.coordinates),
        0,
      );
      const tileVertices = commands.reduce(
        (total, command) => total + coordinatePositionCount(command.geometry?.coordinates),
        0,
      );
      if (tileVertices > this.maximumRenderedVertices - this.renderedVertices) {
        const error = new RangeError(`Shortbread imagery exceeds the ${this.maximumRenderedVertices}-vertex cap.`);
        error.code = 'ERR_SHORTBREAD_VERTEX_CAP';
        throw error;
      }
      this.renderedVertices += tileVertices;
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
      this.waterCommands += waterCommands.length;
      this.oceanCommands += waterCommands.filter((command) => command.category === 'ocean').length;
      this.inlandWaterCommands += waterCommands.filter((command) => command.category === 'inland-water').length;
      this.waterVertices += tileWaterVertices;
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
    this.transparentCanvas = null;
  }
}

export async function loadShortbreadImageryProvider(Cesium, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 15_000);
  try {
    const signal = options.signal
      ? AbortSignal.any([options.signal, controller.signal])
      : controller.signal;
    const { bytes } = await fetchBytesBounded(fetchImpl, SHORTBREAD_TILEJSON_URL, {
      accept: 'application/json',
      maximumBytes: MAXIMUM_TILEJSON_BYTES,
      signal,
    });
    const tileJson = JSON.parse(new TextDecoder().decode(bytes));
    return new ShortbreadImageryProvider(Cesium, { ...options, fetchImpl, tileJson });
  } finally {
    clearTimeout(timeoutId);
  }
}
