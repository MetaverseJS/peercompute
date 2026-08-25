import { createCappedHeightmapTerrainProvider } from './cappedHeightmapProvider.js';
import { retryTerrainRequest } from './terrainRequest.js';

export const TERRARIUM_TILE_SIZE = 256;
export const TERRARIUM_GRID_SIZE = TERRARIUM_TILE_SIZE + 1;
export const TERRARIUM_MAX_LEVEL = 15;
export const WEB_MERCATOR_MAX_LATITUDE = 85.0511287798066;
export const TERRARIUM_URL_TEMPLATE =
  'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png';

export const TERRARIUM_CREDIT_HTML = [
  '<a href="#aws-terrain-attribution">AWS Terrain Tiles required attribution</a>',
  '<a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noreferrer">dataset registry</a>'
].join(' · ');

export function decodeTerrariumHeight(red, green, blue) {
  return red * 256 + green + blue / 256 - 32768;
}

export function decodeTerrariumPixels(rgba, width, height) {
  if (!rgba || !Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new TypeError('Terrarium pixels require a positive integer width and height.');
  }

  const pixelCount = width * height;
  if (rgba.length !== pixelCount * 4) {
    throw new RangeError(`Expected ${pixelCount * 4} RGBA values, received ${rgba.length}.`);
  }

  const heights = new Float32Array(pixelCount);
  for (let sourceIndex = 0, targetIndex = 0; sourceIndex < rgba.length; sourceIndex += 4, targetIndex += 1) {
    heights[targetIndex] = decodeTerrariumHeight(
      rgba[sourceIndex],
      rgba[sourceIndex + 1],
      rgba[sourceIndex + 2]
    );
  }
  return heights;
}

export function summarizeHeightmap(heights) {
  if (!heights || heights.length === 0) {
    return { minimum: null, maximum: null, negativeCount: 0, positiveCount: 0 };
  }

  let minimum = Number.POSITIVE_INFINITY;
  let maximum = Number.NEGATIVE_INFINITY;
  let negativeCount = 0;
  let positiveCount = 0;

  for (const height of heights) {
    if (!Number.isFinite(height)) continue;
    minimum = Math.min(minimum, height);
    maximum = Math.max(maximum, height);
    if (height < 0) negativeCount += 1;
    if (height > 0) positiveCount += 1;
  }

  return {
    minimum: Number.isFinite(minimum) ? minimum : null,
    maximum: Number.isFinite(maximum) ? maximum : null,
    negativeCount,
    positiveCount
  };
}

export function formatTerrariumTileUrl(x, y, level, template = TERRARIUM_URL_TEMPLATE) {
  for (const [label, value] of [['x', x], ['y', y], ['level', level]]) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(`Terrarium ${label} must be a non-negative integer.`);
    }
  }

  return template
    .replaceAll('{z}', String(level))
    .replaceAll('{x}', String(x))
    .replaceAll('{y}', String(y));
}

export async function decodeTerrariumBlob(blob) {
  if (typeof createImageBitmap !== 'function') {
    throw new Error('This browser does not support createImageBitmap for terrain decoding.');
  }

  const image = await createImageBitmap(blob, { colorSpaceConversion: 'none' });
  try {
    const canvas = typeof OffscreenCanvas === 'function'
      ? new OffscreenCanvas(image.width, image.height)
      : Object.assign(document.createElement('canvas'), { width: image.width, height: image.height });
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Unable to create a 2D terrain decode context.');
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height);
    return {
      heights: decodeTerrariumPixels(pixels.data, pixels.width, pixels.height),
      width: pixels.width,
      height: pixels.height
    };
  } finally {
    image.close();
  }
}

export async function fetchTerrariumHeightmap(
  url,
  { fetchImpl = globalThis.fetch, imageDecoder = decodeTerrariumBlob, signal } = {}
) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  const response = await fetchImpl(url, { mode: 'cors', cache: 'force-cache', signal });
  if (!response.ok) {
    throw new Error(`Terrarium request failed with HTTP ${response.status}: ${url}`);
  }
  return imageDecoder(await response.blob());
}

const modulo = (value, modulus) => ((value % modulus) + modulus) % modulus;

export async function resampleTerrariumVertexGrid({
  x,
  y,
  level,
  sourceTileSize,
  gridSize = sourceTileSize + 1,
  loadTile
}) {
  if (![x, y, level].every((value) => Number.isInteger(value) && value >= 0)) {
    throw new RangeError('Terrarium resampling requires non-negative integer tile coordinates.');
  }
  if (
    !Number.isInteger(sourceTileSize)
    || sourceTileSize < 1
    || !Number.isInteger(gridSize)
    || gridSize < 2
    || typeof loadTile !== 'function'
  ) {
    throw new TypeError('Terrarium resampling requires positive source cells, a vertex grid, and a tile loader.');
  }

  const tilesPerAxis = 2 ** level;
  if (x >= tilesPerAxis || y >= tilesPerAxis) {
    throw new RangeError(`Terrarium tile ${level}/${x}/${y} is outside the Web Mercator matrix.`);
  }
  const sourceTiles = new Map();
  const requestedKeys = new Set();
  for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
    const sourceY = Math.max(0, Math.min(tilesPerAxis - 1, y + yOffset));
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      const sourceX = modulo(x + xOffset, tilesPerAxis);
      requestedKeys.add(`${sourceX}/${sourceY}`);
    }
  }

  await Promise.all([...requestedKeys].map(async (key) => {
    const [sourceX, sourceY] = key.split('/').map(Number);
    const result = await loadTile(sourceX, sourceY, level);
    const heights = ArrayBuffer.isView(result)
      ? result
      : result?.heights ?? result?.buffer ?? result;
    if (!ArrayBuffer.isView(heights) || heights.length !== sourceTileSize * sourceTileSize) {
      throw new RangeError(
        `Terrarium source tile ${level}/${sourceX}/${sourceY} must contain ${sourceTileSize * sourceTileSize} heights.`
      );
    }
    sourceTiles.set(key, heights);
  }));

  const globalPixelSpan = tilesPerAxis * sourceTileSize;
  const sample = (globalX, globalY) => {
    const wrappedX = modulo(globalX, globalPixelSpan);
    const clampedY = Math.max(0, Math.min(globalPixelSpan - 1, globalY));
    const sourceX = Math.floor(wrappedX / sourceTileSize);
    const sourceY = Math.floor(clampedY / sourceTileSize);
    const localX = wrappedX % sourceTileSize;
    const localY = clampedY % sourceTileSize;
    return sourceTiles.get(`${sourceX}/${sourceY}`)[localY * sourceTileSize + localX];
  };

  const vertices = new Float32Array(gridSize * gridSize);
  for (let row = 0; row < gridSize; row += 1) {
    const sourceY = y * sourceTileSize + (sourceTileSize * row) / (gridSize - 1) - 0.5;
    const y0 = Math.floor(sourceY);
    const y1 = y0 + 1;
    const yWeight = sourceY - y0;
    for (let column = 0; column < gridSize; column += 1) {
      const sourceX = x * sourceTileSize + (sourceTileSize * column) / (gridSize - 1) - 0.5;
      const x0 = Math.floor(sourceX);
      const x1 = x0 + 1;
      const xWeight = sourceX - x0;
      const northWest = sample(x0, y0);
      const northEast = sample(x1, y0);
      const southWest = sample(x0, y1);
      const southEast = sample(x1, y1);
      const north = northWest + (northEast - northWest) * xWeight;
      const south = southWest + (southEast - southWest) * xWeight;
      vertices[row * gridSize + column] = north + (south - north) * yWeight;
    }
  }
  return vertices;
}

export function createTerrariumSourceTileLoader({
  fetchHeightmap,
  urlTemplate,
  tileSize,
  signal,
  maximumEntries = 128,
  onSourceRequest = () => {}
}) {
  if (typeof fetchHeightmap !== 'function') throw new TypeError('A Terrarium heightmap fetcher is required.');
  if (!Number.isInteger(maximumEntries) || maximumEntries < 9) {
    throw new RangeError('Terrarium source cache must retain at least nine tiles.');
  }
  const cache = new Map();
  return (x, y, level) => {
    const key = `${level}/${x}/${y}`;
    if (cache.has(key)) {
      const cached = cache.get(key);
      cache.delete(key);
      cache.set(key, cached);
      return cached;
    }

    const url = formatTerrariumTileUrl(x, y, level, urlTemplate);
    onSourceRequest({ x, y, level, url });
    const request = Promise.resolve()
      .then(() => fetchHeightmap(url, { signal }))
      .catch((error) => {
        if (cache.get(key) === request) cache.delete(key);
        throw error;
      });
    cache.set(key, request);
    while (cache.size > maximumEntries) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey === key) break;
      cache.delete(oldestKey);
    }
    return request;
  };
}

export function createTerrariumTerrainProvider(
  Cesium,
  {
    maxLevel = TERRARIUM_MAX_LEVEL,
    sourceTileSize = TERRARIUM_TILE_SIZE,
    gridSize = TERRARIUM_GRID_SIZE,
    urlTemplate = TERRARIUM_URL_TEMPLATE,
    fetchHeightmap = fetchTerrariumHeightmap,
    onTelemetry = () => {},
    onHeightmap,
    retryAttempts = 3,
    retryDelayMs = 180
  } = {}
) {
  if (!Cesium?.WebMercatorTilingScheme) {
    throw new TypeError('Cesium terrain provider constructors are required.');
  }
  if (!Number.isInteger(maxLevel) || maxLevel < 0) {
    throw new RangeError('maxLevel must be a non-negative integer.');
  }
  if (gridSize !== sourceTileSize + 1) {
    throw new RangeError('Terrarium vertex grids must contain one more post than source cells.');
  }

  const abortController = new AbortController();
  const telemetry = {
    source: 'aws-terrarium',
    requested: 0,
    loaded: 0,
    failed: 0,
    terminalFailures: 0,
    rootTerminalFailures: 0,
    inFlight: 0,
    activeRetries: 0,
    retries: 0,
    cancellations: 0,
    terminalTiles: 0,
    sourceTilesRequested: 0,
    maximumLoadedLevel: null,
    minimum: null,
    maximum: null,
    negativeSamples: 0,
    positiveSamples: 0,
    lastTile: null,
    lastLoadedTile: null,
    lastError: null,
    lastTerminalError: null
  };

  const emit = () => onTelemetry({ ...telemetry });
  const loadSourceTile = createTerrariumSourceTileLoader({
    fetchHeightmap,
    urlTemplate,
    tileSize: sourceTileSize,
    signal: abortController.signal,
    onSourceRequest: () => {
      telemetry.sourceTilesRequested += 1;
      emit();
    }
  });
  const callback = (x, y, level) => {
    const url = formatTerrariumTileUrl(x, y, level, urlTemplate);
    const tile = { x, y, level, url };
    telemetry.requested += 1;
    telemetry.inFlight += 1;
    telemetry.lastTile = tile;
    emit();

    return retryTerrainRequest(
      () => resampleTerrariumVertexGrid({
        x,
        y,
        level,
        sourceTileSize,
        gridSize,
        loadTile: loadSourceTile
      }),
      {
        attempts: retryAttempts,
        delayMs: retryDelayMs,
        signal: abortController.signal,
        onRetryStart: () => {
          telemetry.retries += 1;
          telemetry.activeRetries += 1;
          emit();
        },
        onRetryEnd: () => {
          telemetry.activeRetries = Math.max(0, telemetry.activeRetries - 1);
          emit();
        }
      }
    ).then((heights) => {
      const summary = summarizeHeightmap(heights);
      telemetry.loaded += 1;
      telemetry.inFlight = Math.max(0, telemetry.inFlight - 1);
      if (level === maxLevel) telemetry.terminalTiles += 1;
      telemetry.maximumLoadedLevel = telemetry.maximumLoadedLevel === null
        ? level
        : Math.max(telemetry.maximumLoadedLevel, level);
      telemetry.minimum = telemetry.minimum === null
        ? summary.minimum
        : Math.min(telemetry.minimum, summary.minimum);
      telemetry.maximum = telemetry.maximum === null
        ? summary.maximum
        : Math.max(telemetry.maximum, summary.maximum);
      telemetry.negativeSamples += summary.negativeCount;
      telemetry.positiveSamples += summary.positiveCount;
      telemetry.lastLoadedTile = tile;
      if (telemetry.terminalFailures === 0) telemetry.lastError = null;
      emit();
      return heights;
    }).catch((error) => {
      telemetry.inFlight = Math.max(0, telemetry.inFlight - 1);
      if (error?.name === 'AbortError') telemetry.cancellations += 1;
      else {
        telemetry.failed += 1;
        telemetry.terminalFailures += 1;
        if (level === 0) telemetry.rootTerminalFailures += 1;
        telemetry.lastTerminalError = error instanceof Error ? error.message : String(error);
      }
      telemetry.lastError = error instanceof Error ? error.message : String(error);
      emit();
      throw error;
    });
  };

  const provider = createCappedHeightmapTerrainProvider(Cesium, {
    maximumLevel: maxLevel,
    width: gridSize,
    height: gridSize,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    credit: new Cesium.Credit(TERRARIUM_CREDIT_HTML),
    callback,
    onHeightmap
  });

  provider.wxglobe = {
    providerType: 'CappedHeightmapTerrainProvider',
    source: 'aws-terrarium',
    maxLevel,
    sourceTileSize,
    gridSize,
    urlTemplate,
    telemetry,
    snapshot: () => ({ ...telemetry }),
    abort: () => abortController.abort()
  };
  return provider;
}
