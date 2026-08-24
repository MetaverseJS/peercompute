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
import { buildWaterNurbsOutlines, WATER_NURBS_LIMITS } from './waterNurbs.js';

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

export function prepareWaterNurbsOutlines(commands, tile, limits = {}) {
  const rings = [];
  for (const command of commands) {
    if (command.kind !== 'water' || command.nurbsOutline === false) continue;
    for (const line of coordinatesToLines(command.geometry)) {
      if (!Array.isArray(line)) continue;
      rings.push(line.map((position) => projectLonLatToTilePixel(position, tile)));
    }
  }
  const outlines = buildWaterNurbsOutlines(rings, { tileSize: tile.size, ...limits });
  if (outlines.invalidRingCount > 0) {
    const error = new TypeError(`Shortbread water tile contains ${outlines.invalidRingCount} invalid shoreline ring(s).`);
    error.code = 'ERR_SHORTBREAD_WATER_NURBS_INVALID_RING';
    throw error;
  }
  return outlines;
}

function renderWaterNurbsOutlines(context, outlines) {
  if (outlines.curveCount === 0) return;
  context.beginPath();
  context.lineCap = 'butt';
  for (const curve of outlines.curves) {
    const first = curve.points[0];
    context.moveTo(first[0], first[1]);
    for (let index = 1; index < curve.points.length; index += 1) {
      const point = curve.points[index];
      context.lineTo(point[0], point[1]);
    }
    if (curve.closed) context.closePath();
  }
  context.shadowColor = SHORTBREAD_WATER_STYLE.outline.color;
  context.shadowBlur = SHORTBREAD_WATER_STYLE.outline.glowPixels;
  context.strokeStyle = SHORTBREAD_WATER_STYLE.outline.halo;
  context.lineWidth = SHORTBREAD_WATER_STYLE.outline.haloWidthPixels;
  context.stroke();
  context.shadowBlur = 2;
  context.strokeStyle = SHORTBREAD_WATER_STYLE.outline.color;
  context.lineWidth = SHORTBREAD_WATER_STYLE.outline.coreWidthPixels;
  context.stroke();
  context.lineCap = 'round';
}

function renderCommand(context, command, tile) {
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

export function renderShortbreadCommands(context, commands, tile, { waterOutlines = null } = {}) {
  if (!context || typeof context.beginPath !== 'function') {
    throw new TypeError('A 2D canvas context is required.');
  }
  const outlines = waterOutlines ?? prepareWaterNurbsOutlines(commands, tile);
  context.clearRect(0, 0, tile.size, tile.size);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const command of commands) {
    if (command.kind === 'water') renderCommand(context, command, tile);
  }
  // Cesium drapes this rasterized, NURBS-sampled source boundary over terrain.
  // It is intentionally part of the water pass: buildings and, most
  // importantly, roads render afterward and therefore win every overlap.
  renderWaterNurbsOutlines(context, outlines);
  for (const command of commands) {
    if (command.kind === 'building') renderCommand(context, command, tile);
  }
  for (const command of commands) {
    if (!['water', 'building', 'road'].includes(command.kind)) renderCommand(context, command, tile);
  }
  // Do not rely on decoder/input ordering for this invariant: roads are always
  // the final category so they remain legible over water and buildings.
  for (const command of commands) {
    if (command.kind === 'road') renderCommand(context, command, tile);
  }
  context.shadowBlur = 0;
  context.shadowColor = 'transparent';
  return outlines;
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
    waterNurbsLimits = null,
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
    if (waterNurbsLimits !== null && (!waterNurbsLimits || typeof waterNurbsLimits !== 'object' || Array.isArray(waterNurbsLimits))) {
      throw new TypeError('Shortbread waterNurbsLimits must be an object or null.');
    }
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
    this.waterNurbsLimits = { ...WATER_NURBS_LIMITS };
    for (const [key, value] of Object.entries(waterNurbsLimits ?? {})) {
      if (!(key in WATER_NURBS_LIMITS)) throw new TypeError(`Unknown water NURBS limit ${key}.`);
      const valid = key === 'tileEdgeEpsilonPixels'
        ? Number.isFinite(value) && value >= 0
        : Number.isSafeInteger(value) && value >= 1;
      if (!valid || value > WATER_NURBS_LIMITS[key]) {
        throw new RangeError(`${key} cannot exceed the hard water NURBS limit.`);
      }
      this.waterNurbsLimits[key] = value;
    }
    Object.freeze(this.waterNurbsLimits);
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
    this.waterNurbsSourceRingCount = 0;
    this.waterNurbsValidRingCount = 0;
    this.waterNurbsFullyClippedRingCount = 0;
    this.waterNurbsCurveCount = 0;
    this.waterNurbsOpenCurveCount = 0;
    this.waterNurbsClosedCurveCount = 0;
    this.waterNurbsSourceControlPointCount = 0;
    this.waterNurbsControlPointCount = 0;
    this.waterNurbsSampledVertexCount = 0;
    this.waterNurbsSuppressedBoundarySegmentCount = 0;
    this.waterNurbsOmittedSourcePointCount = 0;
    this.waterNurbsCapRejectedTileCount = 0;
    this.emptyTiles = 0;
    this.filteredTileRequests = 0;
    this.transparentCanvas = null;
    this.lastError = null;
    this.lastErrorCode = null;
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

  getTelemetry() {
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
      waterNurbs: this.includeWater ? Object.freeze({
        schemaVersion: 'peercompute.geo.water-nurbs-outlines.v1',
        curveModel: 'NURBS',
        degree: 1,
        knotModel: 'open-clamped-uniform-per-fragment',
        topologyPolicy: 'exact-degree-one-nurbs-polyline',
        maximumSourceDeviationPixels: 0,
        boundaryModel: 'exact-source-water-boundary-terrain-draped',
        elevationModel: 'source-elevation-not-published',
        sourceRingCount: this.waterNurbsSourceRingCount,
        validRingCount: this.waterNurbsValidRingCount,
        fullyClippedRingCount: this.waterNurbsFullyClippedRingCount,
        curveCount: this.waterNurbsCurveCount,
        openCurveCount: this.waterNurbsOpenCurveCount,
        closedCurveCount: this.waterNurbsClosedCurveCount,
        sourceControlPointCount: this.waterNurbsSourceControlPointCount,
        controlPointCount: this.waterNurbsControlPointCount,
        sampledVertexCount: this.waterNurbsSampledVertexCount,
        suppressedBoundarySegmentCount: this.waterNurbsSuppressedBoundarySegmentCount,
        omittedSourcePointCount: this.waterNurbsOmittedSourcePointCount,
        capped: this.waterNurbsOmittedSourcePointCount > 0,
        capRejectedTileCount: this.waterNurbsCapRejectedTileCount,
        limits: this.waterNurbsLimits,
      }) : null,
      waterStyle: this.includeWater ? SHORTBREAD_WATER_STYLE : null,
      emptyTiles: this.emptyTiles,
      filteredTileRequests: this.filteredTileRequests,
      lastError: this.lastError,
      lastErrorCode: this.lastErrorCode,
    });
  }

  #telemetry(error = null) {
    if (error) {
      this.lastError = error instanceof Error ? error.message : String(error);
      this.lastErrorCode = typeof error?.code === 'string' ? error.code : null;
    }
    this.onTelemetry(this.getTelemetry());
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
      const waterOutlines = prepareWaterNurbsOutlines(commands, {
        x,
        y,
        z: level,
        size: TILE_SIZE,
      }, this.waterNurbsLimits);
      const tileVertices = commands.reduce(
        (total, command) => total + coordinatePositionCount(command.geometry?.coordinates),
        0,
      ) + waterOutlines.sampledVertexCount;
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
      renderShortbreadCommands(context, commands, { x, y, z: level, size: TILE_SIZE }, { waterOutlines });
      this.loaded += 1;
      this.renderedCommands += commands.length;
      this.roadCommands += commands.filter((command) => command.kind === 'road').length;
      this.buildingCommands += commands.filter((command) => command.kind === 'building').length;
      this.waterCommands += waterCommands.length;
      this.oceanCommands += waterCommands.filter((command) => command.category === 'ocean').length;
      this.inlandWaterCommands += waterCommands.filter((command) => command.category === 'inland-water').length;
      this.waterVertices += tileWaterVertices;
      this.waterNurbsSourceRingCount += waterOutlines.sourceRingCount;
      this.waterNurbsValidRingCount += waterOutlines.validRingCount;
      this.waterNurbsFullyClippedRingCount += waterOutlines.fullyClippedRingCount;
      this.waterNurbsCurveCount += waterOutlines.curveCount;
      this.waterNurbsOpenCurveCount += waterOutlines.openCurveCount;
      this.waterNurbsClosedCurveCount += waterOutlines.closedCurveCount;
      this.waterNurbsSourceControlPointCount += waterOutlines.sourceControlPointCount;
      this.waterNurbsControlPointCount += waterOutlines.controlPointCount;
      this.waterNurbsSampledVertexCount += waterOutlines.sampledVertexCount;
      this.waterNurbsSuppressedBoundarySegmentCount += waterOutlines.suppressedBoundarySegmentCount;
      this.waterNurbsOmittedSourcePointCount += waterOutlines.omittedSourcePointCount;
      if (commands.length === 0) this.emptyTiles += 1;
      this.#remember(key, canvas);
      this.#telemetry();
      return canvas;
    })().catch((error) => {
      if (error?.name !== 'AbortError') {
        this.failed += 1;
        if (String(error?.code ?? '').startsWith('ERR_SHORTBREAD_WATER_NURBS_')
          && String(error.code).endsWith('_CAP')) {
          this.waterNurbsCapRejectedTileCount += 1;
        }
        this.#telemetry(error);
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
