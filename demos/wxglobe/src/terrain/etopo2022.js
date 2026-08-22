import { createCappedHeightmapTerrainProvider } from './cappedHeightmapProvider.js';
import { retryTerrainRequest } from './terrainRequest.js';

// Cesium heightmaps are endpoint posts, so 256 source intervals require 257
// samples. The power-of-two interval count keeps parent and child vertices
// nested across the terrain quadtree.
export const ETOPO2022_TILE_SIZE = 257;
export const ETOPO2022_MAX_LEVEL = 6;
export const ETOPO2022_DATASET = 'ETOPO_2022_v1_60s_surface';
export const ETOPO2022_IMAGE_SERVER_URL =
  'https://gis.ngdc.noaa.gov/arcgis/rest/services/DEM_mosaics/DEM_all/ImageServer/exportImage';
export const ETOPO2022_SAMPLE_SERVER_URL =
  'https://gis.ngdc.noaa.gov/arcgis/rest/services/DEM_mosaics/DEM_all/ImageServer/getSamples';

export const ETOPO2022_CREDIT_HTML = [
  '<a href="https://doi.org/10.25921/fd45-gt74" target="_blank" rel="noreferrer">NOAA/NCEI ETOPO 2022 Global Relief</a>',
  '<span>not for navigation</span>'
].join(' · ');

export function formatEtopo2022ExportUrl(
  { west, south, east, north },
  { width = ETOPO2022_TILE_SIZE, height = ETOPO2022_TILE_SIZE } = {}
) {
  const bounds = [west, south, east, north];
  if (!bounds.every(Number.isFinite) || west >= east || south >= north) {
    throw new RangeError('ETOPO 2022 export requires finite west/south/east/north bounds.');
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new RangeError('ETOPO 2022 export dimensions must be positive integers.');
  }

  const url = new URL(ETOPO2022_IMAGE_SERVER_URL);
  url.searchParams.set('bbox', bounds.join(','));
  url.searchParams.set('bboxSR', '4326');
  url.searchParams.set('imageSR', '4326');
  url.searchParams.set('size', `${width},${height}`);
  url.searchParams.set('adjustAspectRatio', 'false');
  url.searchParams.set('format', 'bip');
  url.searchParams.set('pixelType', 'S16');
  url.searchParams.set('noData', '-32768');
  url.searchParams.set('interpolation', 'RSP_BilinearInterpolation');
  url.searchParams.set('mosaicRule', JSON.stringify({
    where: `DemName = '${ETOPO2022_DATASET}'`
  }));
  url.searchParams.set('f', 'image');
  return url.toString();
}

export function padEtopo2022BoundsForVertexGrid(
  { west, south, east, north },
  { width = ETOPO2022_TILE_SIZE, height = ETOPO2022_TILE_SIZE } = {}
) {
  if (![west, south, east, north].every(Number.isFinite) || west >= east || south >= north) {
    throw new RangeError('ETOPO 2022 vertex-grid padding requires finite ordered bounds.');
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 2 || height < 2) {
    throw new RangeError('ETOPO 2022 vertex-grid dimensions must be integers greater than one.');
  }
  const halfLongitudePost = (east - west) / (width - 1) / 2;
  const halfLatitudePost = (north - south) / (height - 1) / 2;
  return {
    west: west - halfLongitudePost,
    south: south - halfLatitudePost,
    east: east + halfLongitudePost,
    north: north + halfLatitudePost
  };
}

export function decodeEtopo2022Bip(arrayBuffer, width, height, { allowNoData = false } = {}) {
  if (!(arrayBuffer instanceof ArrayBuffer)) throw new TypeError('ETOPO 2022 BIP data must be an ArrayBuffer.');
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new RangeError('ETOPO 2022 BIP dimensions must be positive integers.');
  }

  const pixelCount = width * height;
  const pixelByteLength = pixelCount * Int16Array.BYTES_PER_ELEMENT;
  const maskByteLength = Math.ceil(pixelCount / 8);
  const hasMask = arrayBuffer.byteLength === pixelByteLength + maskByteLength;
  if (arrayBuffer.byteLength !== pixelByteLength && !hasMask) {
    throw new RangeError(
      `Expected ${pixelByteLength} pixel bytes with an optional ${maskByteLength}-byte mask, received ${arrayBuffer.byteLength}.`
    );
  }

  const view = new DataView(arrayBuffer, 0, pixelByteLength);
  const mask = hasMask ? new Uint8Array(arrayBuffer, pixelByteLength, maskByteLength) : null;
  const heights = new Float32Array(pixelCount);

  for (let index = 0; index < pixelCount; index += 1) {
    const valid = !mask || (mask[index >> 3] & (0x80 >> (index & 7))) !== 0;
    if (!valid) {
      if (!allowNoData) throw new RangeError(`ETOPO 2022 tile contains NoData at sample ${index}.`);
      heights[index] = Number.NaN;
    } else {
      heights[index] = view.getInt16(index * Int16Array.BYTES_PER_ELEMENT, true);
    }
  }

  return heights;
}

export async function fetchEtopo2022Heightmap(
  url,
  {
    fetchImpl = globalThis.fetch,
    width = ETOPO2022_TILE_SIZE,
    height = ETOPO2022_TILE_SIZE,
    allowNoData = false,
    signal
  } = {}
) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  const response = await fetchImpl(url, { mode: 'cors', cache: 'force-cache', signal });
  if (!response.ok) {
    throw new Error(`ETOPO 2022 request failed with HTTP ${response.status}: ${url}`);
  }
  return decodeEtopo2022Bip(await response.arrayBuffer(), width, height, { allowNoData });
}

export async function fetchEtopo2022Samples(
  points,
  { fetchImpl = globalThis.fetch, signal } = {}
) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  if (!Array.isArray(points) || points.length === 0 || points.some(
    (point) => !Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite)
  )) {
    throw new TypeError('ETOPO 2022 samples require one or more finite [longitude, latitude] points.');
  }

  const isSinglePoint = points.length === 1;
  const geometry = isSinglePoint
    ? { x: points[0][0], y: points[0][1], spatialReference: { wkid: 4326 } }
    : { points, spatialReference: { wkid: 4326 } };
  const body = new URLSearchParams({
    geometry: JSON.stringify(geometry),
    geometryType: isSinglePoint ? 'esriGeometryPoint' : 'esriGeometryMultipoint',
    mosaicRule: JSON.stringify({ where: `DemName = '${ETOPO2022_DATASET}'` }),
    returnFirstValueOnly: 'true',
    interpolation: 'RSP_BilinearInterpolation',
    f: 'json'
  });
  const response = await fetchImpl(ETOPO2022_SAMPLE_SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
    mode: 'cors',
    cache: 'force-cache',
    signal
  });
  if (!response.ok) {
    throw new Error(`ETOPO 2022 sample request failed with HTTP ${response.status}.`);
  }
  const payload = await response.json();
  const samples = Array.isArray(payload?.samples) ? [...payload.samples] : [];
  samples.sort((left, right) => (left.locationId ?? 0) - (right.locationId ?? 0));
  const values = samples.map((sample) => Number(sample?.value));
  if (values.length !== points.length || values.some((value) => !Number.isFinite(value))) {
    throw new RangeError(`ETOPO 2022 returned ${values.length}/${points.length} finite samples.`);
  }
  return Float32Array.from(values);
}

export async function stitchEtopo2022BoundaryPosts(
  heights,
  {
    x,
    y,
    level,
    width,
    height,
    bounds,
    xTileCount,
    yTileCount,
    loadDateline,
    loadPole
  }
) {
  if (!ArrayBuffer.isView(heights) || heights.length !== width * height) {
    throw new RangeError(`ETOPO 2022 boundary stitching requires ${width * height} typed samples.`);
  }
  const stitched = Float32Array.from(heights);
  const isWestDateline = x === 0;
  const isEastDateline = x === xTileCount - 1;
  const isNorthPole = y === 0;
  const isSouthPole = y === yTileCount - 1;
  const isRepairableBoundary = (row, column) => (
    (isWestDateline && column === 0)
    || (isEastDateline && column === width - 1)
    || (isNorthPole && row === 0)
    || (isSouthPole && row === height - 1)
  );

  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const index = row * width + column;
      if (!Number.isFinite(stitched[index]) && !isRepairableBoundary(row, column)) {
        throw new RangeError(`ETOPO 2022 tile contains interior NoData at sample ${index}.`);
      }
    }
  }

  if (isWestDateline || isEastDateline) {
    const dateline = await loadDateline({ level, y, bounds, height });
    if (!ArrayBuffer.isView(dateline) || dateline.length !== height) {
      throw new RangeError(`ETOPO 2022 dateline repair requires ${height} samples.`);
    }
    const column = isWestDateline ? 0 : width - 1;
    for (let row = 0; row < height; row += 1) {
      stitched[row * width + column] = dateline[row];
    }
  }

  if (isNorthPole) {
    const northPole = Number(await loadPole(90));
    if (!Number.isFinite(northPole)) throw new RangeError('ETOPO 2022 north-pole sample is not finite.');
    stitched.fill(northPole, 0, width);
  }
  if (isSouthPole) {
    const southPole = Number(await loadPole(-90));
    if (!Number.isFinite(southPole)) throw new RangeError('ETOPO 2022 south-pole sample is not finite.');
    stitched.fill(southPole, (height - 1) * width, height * width);
  }

  for (const value of stitched) {
    if (!Number.isFinite(value)) {
      throw new RangeError('ETOPO 2022 boundary repair left non-finite samples.');
    }
  }
  return stitched;
}

export function canonicalizeEtopo2022BoundaryVertices(
  heights,
  {
    x,
    y,
    level,
    width,
    height,
    maximumLevel,
    tilingScheme,
    vertexCache,
    maximumCacheEntries = Number.POSITIVE_INFINITY
  }
) {
  if (!ArrayBuffer.isView(heights) || heights.length !== width * height) {
    throw new RangeError(`ETOPO 2022 vertex canonicalization requires ${width * height} typed samples.`);
  }
  if (width !== height || width < 2 || ((width - 1) & (width - 2)) !== 0) {
    throw new RangeError('ETOPO 2022 vertex grids must use a square power-of-two interval count.');
  }
  if (!(vertexCache instanceof Map)) throw new TypeError('ETOPO 2022 vertex canonicalization requires a Map cache.');
  if (!(maximumCacheEntries === Number.POSITIVE_INFINITY
    || (Number.isInteger(maximumCacheEntries) && maximumCacheEntries > 0))) {
    throw new RangeError('ETOPO 2022 vertex cache size must be positive.');
  }

  const canonical = Float32Array.from(heights);
  const intervals = width - 1;
  const scale = 2 ** (maximumLevel - level);
  const maximumXTiles = tilingScheme.getNumberOfXTilesAtLevel(maximumLevel);
  const maximumYTiles = tilingScheme.getNumberOfYTilesAtLevel(maximumLevel);
  const worldXIntervals = maximumXTiles * intervals;
  const worldYIntervals = maximumYTiles * intervals;

  const canonicalize = (row, column) => {
    const globalY = (y * intervals + row) * scale;
    let key;
    if (globalY === 0) {
      key = -1;
    } else if (globalY === worldYIntervals) {
      key = -2;
    } else {
      const globalX = ((x * intervals + column) * scale) % worldXIntervals;
      key = globalY * worldXIntervals + globalX;
    }
    const index = row * width + column;
    if (vertexCache.has(key)) {
      const value = vertexCache.get(key);
      canonical[index] = value;
      vertexCache.delete(key);
      vertexCache.set(key, value);
    } else {
      while (vertexCache.size >= maximumCacheEntries) {
        vertexCache.delete(vertexCache.keys().next().value);
      }
      vertexCache.set(key, canonical[index]);
    }
  };

  for (let column = 0; column < width; column += 1) canonicalize(0, column);
  for (let row = 1; row < height - 1; row += 1) {
    canonicalize(row, 0);
    canonicalize(row, width - 1);
  }
  for (let column = 0; column < width; column += 1) canonicalize(height - 1, column);
  return canonical;
}

export function createEtopo2022TerrainProvider(
  Cesium,
  {
    maxLevel = ETOPO2022_MAX_LEVEL,
    tileSize = ETOPO2022_TILE_SIZE,
    fetchHeightmap = fetchEtopo2022Heightmap,
    fetchSamples = fetchEtopo2022Samples,
    onTelemetry = () => {},
    retryAttempts = 3,
    retryDelayMs = 180,
    boundaryCacheSize = 131_072
  } = {}
) {
  if (!Cesium?.GeographicTilingScheme || !Cesium?.Math) {
    throw new TypeError('Cesium geographic terrain constructors are required.');
  }
  if (!Number.isInteger(maxLevel) || maxLevel < 0) {
    throw new RangeError('maxLevel must be a non-negative integer.');
  }
  if (!Number.isInteger(boundaryCacheSize) || boundaryCacheSize < tileSize * 4) {
    throw new RangeError('boundaryCacheSize must retain at least four terrain-grid edges.');
  }

  const tilingScheme = new Cesium.GeographicTilingScheme();
  const abortController = new AbortController();
  const datelineCache = new Map();
  const poleCache = new Map();
  const boundaryVertexCache = new Map();
  const telemetry = {
    source: 'noaa-etopo2022',
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
  const loadDateline = ({ level, y, bounds, height }) => {
    const key = `${level}/${y}/${height}`;
    if (!datelineCache.has(key)) {
      const latitudeStep = (bounds.north - bounds.south) / (height - 1);
      const points = Array.from({ length: height }, (_, row) => [
        180,
        bounds.north - latitudeStep * row
      ]);
      const request = Promise.resolve(fetchSamples(points, { signal: abortController.signal }));
      datelineCache.set(key, request);
      request.catch(() => datelineCache.delete(key));
    }
    return datelineCache.get(key);
  };
  const loadPole = (latitude) => {
    const key = String(latitude);
    if (!poleCache.has(key)) {
      const request = Promise.resolve(fetchSamples([[0, latitude]], {
        signal: abortController.signal
      })).then((values) => values[0]);
      poleCache.set(key, request);
      request.catch(() => poleCache.delete(key));
    }
    return poleCache.get(key);
  };
  const callback = (x, y, level) => {
    const rectangle = tilingScheme.tileXYToRectangle(x, y, level);
    const bounds = {
      west: Cesium.Math.toDegrees(rectangle.west),
      south: Cesium.Math.toDegrees(rectangle.south),
      east: Cesium.Math.toDegrees(rectangle.east),
      north: Cesium.Math.toDegrees(rectangle.north)
    };
    const requestBounds = padEtopo2022BoundsForVertexGrid(bounds, { width: tileSize, height: tileSize });
    const url = formatEtopo2022ExportUrl(requestBounds, { width: tileSize, height: tileSize });
    const tile = { x, y, level, url, bounds, requestBounds };
    telemetry.requested += 1;
    telemetry.inFlight += 1;
    telemetry.lastTile = tile;
    emit();

    return retryTerrainRequest(async () => {
      const result = await fetchHeightmap(url, {
        width: tileSize,
        height: tileSize,
        allowNoData: true,
        signal: abortController.signal
      });
      const rawHeights = ArrayBuffer.isView(result)
        ? result
        : result?.heights ?? result?.buffer ?? result;
      if (!ArrayBuffer.isView(rawHeights) || rawHeights.length !== tileSize * tileSize) {
        throw new RangeError(`ETOPO 2022 tile must decode to ${tileSize * tileSize} typed heights.`);
      }
      const stitchedHeights = await stitchEtopo2022BoundaryPosts(rawHeights, {
        x,
        y,
        level,
        width: tileSize,
        height: tileSize,
        bounds,
        xTileCount: tilingScheme.getNumberOfXTilesAtLevel(level),
        yTileCount: tilingScheme.getNumberOfYTilesAtLevel(level),
        loadDateline,
        loadPole
      });
      return canonicalizeEtopo2022BoundaryVertices(stitchedHeights, {
        x,
        y,
        level,
        width: tileSize,
        height: tileSize,
        maximumLevel: maxLevel,
        tilingScheme,
        vertexCache: boundaryVertexCache,
        maximumCacheEntries: boundaryCacheSize
      });
    }, {
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
    }).then((heights) => {

      let minimum = Number.POSITIVE_INFINITY;
      let maximum = Number.NEGATIVE_INFINITY;
      let negativeCount = 0;
      let positiveCount = 0;
      for (const value of heights) {
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
        if (value < 0) negativeCount += 1;
        if (value > 0) positiveCount += 1;
      }

      telemetry.loaded += 1;
      telemetry.inFlight = Math.max(0, telemetry.inFlight - 1);
      if (level === maxLevel) telemetry.terminalTiles += 1;
      telemetry.maximumLoadedLevel = telemetry.maximumLoadedLevel === null
        ? level
        : Math.max(telemetry.maximumLoadedLevel, level);
      telemetry.minimum = telemetry.minimum === null ? minimum : Math.min(telemetry.minimum, minimum);
      telemetry.maximum = telemetry.maximum === null ? maximum : Math.max(telemetry.maximum, maximum);
      telemetry.negativeSamples += negativeCount;
      telemetry.positiveSamples += positiveCount;
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
    width: tileSize,
    height: tileSize,
    tilingScheme,
    credit: new Cesium.Credit(ETOPO2022_CREDIT_HTML),
    callback
  });

  provider.wxglobe = {
    providerType: 'CappedHeightmapTerrainProvider',
    source: 'noaa-etopo2022',
    maxLevel,
    tileSize,
    telemetry,
    snapshot: () => ({ ...telemetry }),
    boundaryVertexCacheSize: () => boundaryVertexCache.size,
    abort: () => abortController.abort()
  };
  return provider;
}
