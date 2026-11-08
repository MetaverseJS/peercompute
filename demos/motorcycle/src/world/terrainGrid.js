import {
  createLocalEnuFrame,
  fetchTerrariumHeightmap,
  formatTerrariumTileUrl,
  TERRARIUM_TILE_SIZE,
  TERRARIUM_URL_TEMPLATE,
  WEB_MERCATOR_MAX_LATITUDE,
} from '@peercompute/geo-core';
import { normalizeRideTile, rideTileBounds } from './rideTile.js';

export const MOTORCYCLE_TERRAIN_GRID_SIZE = 65;
export const MOTORCYCLE_TERRAIN_SOURCE_ID = 'aws-terrarium';
export const MOTORCYCLE_TERRAIN_TILE_ZOOM = 12;
export const MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES = 9;
export const MOTORCYCLE_RIDE_TERRAIN_GRID_SIZE = 129;
export const MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS = 1;
export const MOTORCYCLE_TERRARIUM_HEIGHTMAP_CACHE_MAXIMUM_ENTRIES = 64;

function abortReason(signal) {
  if (signal?.reason instanceof Error) return signal.reason;
  const error = new Error('Terrarium heightmap request was aborted.');
  error.name = 'AbortError';
  return error;
}

function awaitWithAbort(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(abortReason(signal));
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(abortReason(signal));
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
}

/**
 * Keeps decoded Terrarium posts local to one RoadVector session. Adjacent
 * logical ride chunks need the same 3x3 source PNGs for their collision halo;
 * the byte cache avoids another transfer, while this tier also avoids decoding
 * the same PNG repeatedly. Caller aborts are isolated from a shared decode so
 * a superseding terrain generation can reuse the bounded result.
 */
export function createTerrariumHeightmapCache({
  fetchImpl = globalThis.fetch,
  fetchHeightmap = fetchTerrariumHeightmap,
  maximumEntries = MOTORCYCLE_TERRARIUM_HEIGHTMAP_CACHE_MAXIMUM_ENTRIES,
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A Terrarium cache fetch implementation is required.');
  if (typeof fetchHeightmap !== 'function') throw new TypeError('A Terrarium heightmap loader is required.');
  if (!Number.isInteger(maximumEntries) || maximumEntries < 1 || maximumEntries > 256) {
    throw new RangeError('Terrarium decoded cache maximumEntries must be between 1 and 256.');
  }
  const records = new Map();
  let accessSequence = 0;
  let destroyed = false;
  const counters = {
    hits: 0,
    misses: 0,
    coalesced: 0,
    callerAborts: 0,
    failures: 0,
    evictions: 0,
    orphanAborts: 0,
    lateDiscards: 0,
  };
  const evictOne = () => {
    let oldest = null;
    for (const record of records.values()) {
      if (!record.value) continue;
      if (!oldest || record.lastAccess < oldest.lastAccess) oldest = record;
    }
    if (!oldest) return false;
    records.delete(oldest.url);
    counters.evictions += 1;
    return true;
  };
  const admit = () => {
    while (records.size >= maximumEntries) {
      if (!evictOne()) {
        const error = new Error('Terrarium decoded cache is busy.');
        error.code = 'ERR_MOTORCYCLE_TERRARIUM_CACHE_BUSY';
        error.retryable = true;
        error.transient = true;
        throw error;
      }
    }
  };
  const load = async (url, { signal } = {}) => {
    if (destroyed) throw new Error('Terrarium decoded cache is destroyed.');
    if (typeof url !== 'string' || url.length === 0) {
      throw new TypeError('Terrarium decoded cache URL must be a non-empty string.');
    }
    if (signal?.aborted) {
      counters.callerAborts += 1;
      throw abortReason(signal);
    }
    let record = records.get(url);
    if (record?.value) {
      record.lastAccess = ++accessSequence;
      counters.hits += 1;
      return record.value;
    }
    if (record?.promise) {
      record.lastAccess = ++accessSequence;
      counters.coalesced += 1;
      record.waiters += 1;
      try {
        return await awaitWithAbort(record.promise, signal);
      } catch (error) {
        if (signal?.aborted) counters.callerAborts += 1;
        throw error;
      } finally {
        record.waiters -= 1;
        if (signal?.aborted && record.waiters === 0 && record.promise) {
          if (records.get(url) === record) records.delete(url);
          record.controller?.abort();
          counters.orphanAborts += 1;
        }
      }
    }
    admit();
    counters.misses += 1;
    const controller = new AbortController();
    record = {
      url,
      controller,
      lastAccess: ++accessSequence,
      promise: null,
      value: null,
      waiters: 1,
    };
    record.promise = Promise.resolve()
      .then(() => fetchHeightmap(url, { fetchImpl, signal: controller.signal }))
      .then((result) => {
        const heights = ArrayBuffer.isView(result)
          ? result
          : result?.heights ?? result?.buffer ?? result;
        const width = result?.width ?? TERRARIUM_TILE_SIZE;
        const height = result?.height ?? TERRARIUM_TILE_SIZE;
        if (!ArrayBuffer.isView(heights)
          || width !== TERRARIUM_TILE_SIZE
          || height !== TERRARIUM_TILE_SIZE
          || heights.length !== TERRARIUM_TILE_SIZE * TERRARIUM_TILE_SIZE) {
          throw new RangeError('Decoded Terrarium cache entry has an invalid sample grid.');
        }
        const ownedHeights = Float32Array.from(heights);
        if (destroyed || records.get(url) !== record) {
          counters.lateDiscards += 1;
          throw abortReason(controller.signal);
        }
        const value = Object.freeze({ heights: ownedHeights, width, height });
        record.value = value;
        record.promise = null;
        record.controller = null;
        record.lastAccess = ++accessSequence;
        return value;
      })
      .catch((error) => {
        if (records.get(url) === record) records.delete(url);
        counters.failures += 1;
        throw error;
      });
    records.set(url, record);
    try {
      return await awaitWithAbort(record.promise, signal);
    } catch (error) {
      if (signal?.aborted) counters.callerAborts += 1;
      throw error;
    } finally {
      record.waiters -= 1;
      if (signal?.aborted && record.waiters === 0 && record.promise) {
        if (records.get(url) === record) records.delete(url);
        record.controller?.abort();
        counters.orphanAborts += 1;
      }
    }
  };
  const getTelemetry = () => {
    const resident = [...records.values()].filter((record) => record.value);
    return Object.freeze({
      schemaVersion: 'peercompute.motorcycle.terrarium-decoded-cache.v1',
      model: 'session-local-bounded-decoded-heightmap-lru',
      owner: 'RoadVector terrain stream',
      storage: 'memory-only',
      yjsReplicated: false,
      destroyed,
      maximumEntries,
      maximumResidentBytes: maximumEntries * TERRARIUM_TILE_SIZE ** 2 * Float32Array.BYTES_PER_ELEMENT,
      entries: records.size,
      residentEntries: resident.length,
      pendingEntries: records.size - resident.length,
      residentBytes: resident.reduce((sum, record) => sum + record.value.heights.byteLength, 0),
      ...counters,
    });
  };
  const destroy = () => {
    if (destroyed) return false;
    destroyed = true;
    for (const record of records.values()) record.controller?.abort();
    records.clear();
    return true;
  };
  return Object.freeze({ load, getTelemetry, destroy });
}

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

function normalizeBbox(value, { allowUnwrappedLongitude = false } = {}) {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new TypeError('Terrain bbox must be [south, west, north, east].');
  }
  const [south, west, north, east] = value.map((entry, index) => finite(entry, `bbox[${index}]`));
  const longitudeInvalid = allowUnwrappedLongitude
    ? west >= east || east - west > 360
    : west < -180 || east > 180 || west >= east;
  if (south < -90 || north > 90 || south >= north || longitudeInvalid) {
    throw new RangeError('Terrain bbox must be ordered, finite, and must not cross the antimeridian.');
  }
  return Object.freeze([south, west, north, east]);
}

function gridDimension(value, label, maximum = 129) {
  if (!Number.isInteger(value) || value < 3 || value > maximum) {
    throw new RangeError(`${label} must be an integer between 3 and ${maximum}.`);
  }
  return value;
}

function bilinear(values, width, height, column, row) {
  const x = Math.min(width - 1, Math.max(0, column));
  const y = Math.min(height - 1, Math.max(0, row));
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;
  const top = values[y0 * width + x0] * (1 - fx) + values[y0 * width + x1] * fx;
  const bottom = values[y1 * width + x0] * (1 - fx) + values[y1 * width + x1] * fx;
  return top * (1 - fy) + bottom * fy;
}

function triangleSurfaceSample(positions, first, second, third, x, z) {
  const offsetA = first * 3;
  const offsetB = second * 3;
  const offsetC = third * 3;
  const ax = positions[offsetA];
  const ay = positions[offsetA + 1];
  const az = positions[offsetA + 2];
  const bx = positions[offsetB];
  const by = positions[offsetB + 1];
  const bz = positions[offsetB + 2];
  const cx = positions[offsetC];
  const cy = positions[offsetC + 1];
  const cz = positions[offsetC + 2];
  const denominator = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
  if (Math.abs(denominator) <= 1e-9) return null;
  const weightA = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / denominator;
  const weightB = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / denominator;
  const weightC = 1 - weightA - weightB;
  // Float32 mesh vertices can move a mathematically on-edge barycentric query
  // by a few tens of microunits after WGS84→ENU projection.
  const epsilon = 1e-4;
  if (weightA < -epsilon || weightB < -epsilon || weightC < -epsilon) return null;
  const edgeAB = [bx - ax, by - ay, bz - az];
  const edgeAC = [cx - ax, cy - ay, cz - az];
  let nx = edgeAB[1] * edgeAC[2] - edgeAB[2] * edgeAC[1];
  let ny = edgeAB[2] * edgeAC[0] - edgeAB[0] * edgeAC[2];
  let nz = edgeAB[0] * edgeAC[1] - edgeAB[1] * edgeAC[0];
  if (ny < 0) {
    nx = -nx;
    ny = -ny;
    nz = -nz;
  }
  const normalLength = Math.hypot(nx, ny, nz) || 1;
  return Object.freeze({
    height: ay * weightA + by * weightB + cy * weightC,
    normal: Object.freeze([nx / normalLength, ny / normalLength, nz / normalLength]),
    barycentric: Object.freeze([weightA, weightB, weightC]),
  });
}

function surfaceBin(value, minimum, maximum, count) {
  if (maximum <= minimum) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(
    ((value - minimum) / (maximum - minimum)) * count,
  )));
}

function createLocalSurfaceIndex(positions, columns, rows, localBounds) {
  const binColumns = columns - 1;
  const binRows = rows - 1;
  const bins = Array.from({ length: binColumns * binRows }, () => []);
  const triangleCount = binColumns * binRows * 2;
  const triangles = new Uint32Array(triangleCount * 3);
  // Match the renderer's tolerance so a float-rounded edge is indexed in both
  // neighboring bins instead of falling through a microscopic crack.
  const epsilon = 1e-4;
  let triangleId = 0;
  let referenceCount = 0;
  let maximumCandidatesPerBin = 0;

  const addTriangle = (first, second, third) => {
    const triangleOffset = triangleId * 3;
    triangles[triangleOffset] = first;
    triangles[triangleOffset + 1] = second;
    triangles[triangleOffset + 2] = third;
    const firstOffset = first * 3;
    const secondOffset = second * 3;
    const thirdOffset = third * 3;
    const minimumX = Math.min(
      positions[firstOffset], positions[secondOffset], positions[thirdOffset],
    ) - epsilon;
    const maximumX = Math.max(
      positions[firstOffset], positions[secondOffset], positions[thirdOffset],
    ) + epsilon;
    const minimumZ = Math.min(
      positions[firstOffset + 2], positions[secondOffset + 2], positions[thirdOffset + 2],
    ) - epsilon;
    const maximumZ = Math.max(
      positions[firstOffset + 2], positions[secondOffset + 2], positions[thirdOffset + 2],
    ) + epsilon;
    const firstColumn = surfaceBin(
      minimumX, localBounds.minX, localBounds.maxX, binColumns,
    );
    const lastColumn = surfaceBin(
      maximumX, localBounds.minX, localBounds.maxX, binColumns,
    );
    const firstRow = surfaceBin(
      minimumZ, localBounds.minZ, localBounds.maxZ, binRows,
    );
    const lastRow = surfaceBin(
      maximumZ, localBounds.minZ, localBounds.maxZ, binRows,
    );
    for (let row = firstRow; row <= lastRow; row += 1) {
      for (let column = firstColumn; column <= lastColumn; column += 1) {
        const bin = bins[row * binColumns + column];
        bin.push(triangleId);
        referenceCount += 1;
        maximumCandidatesPerBin = Math.max(maximumCandidatesPerBin, bin.length);
      }
    }
    triangleId += 1;
  };

  // Renderer index order is part of shared-edge determinism: the first exact
  // triangle wins when a query lies on a diagonal or cell boundary.
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const a = row * columns + column;
      const b = a + 1;
      const c = a + columns;
      const d = c + 1;
      addTriangle(a, b, c);
      addTriangle(b, d, c);
    }
  }

  return Object.freeze({
    bins: Object.freeze(bins.map((bin) => Object.freeze(bin))),
    triangles,
    telemetry: Object.freeze({
      schemaVersion: 'peercompute.geo.local-surface-index.v1',
      coordinateModel: 'local-xz-triangle-aabb-grid',
      rendererTriangleOrder: true,
      geodeticInversionPerQuery: false,
      binColumns,
      binRows,
      triangleCount,
      referenceCount,
      maximumCandidatesPerBin,
    }),
  });
}

export function createTerrainGrid({
  bbox,
  width = MOTORCYCLE_TERRAIN_GRID_SIZE,
  height = MOTORCYCLE_TERRAIN_GRID_SIZE,
  heights,
  source = {},
  allowUnwrappedLongitude = false,
  maximumGridDimension = 129,
} = {}) {
  const normalizedBbox = normalizeBbox(bbox, { allowUnwrappedLongitude });
  const columns = gridDimension(width, 'Terrain width', maximumGridDimension);
  const rows = gridDimension(height, 'Terrain height', maximumGridDimension);
  if (!ArrayBuffer.isView(heights) && !Array.isArray(heights)) {
    throw new TypeError('Terrain heights must be an array or typed array.');
  }
  if (heights.length !== columns * rows) {
    throw new RangeError(`Terrain grid requires ${columns * rows} heights.`);
  }
  const values = Float32Array.from(heights, (value, index) => finite(value, `heights[${index}]`));
  const [south, west, north, east] = normalizedBbox;
  const centerColumn = (columns - 1) / 2;
  const centerRow = (rows - 1) / 2;
  const referenceHeight = bilinear(values, columns, rows, centerColumn, centerRow);
  const centerLongitude = (west + east) / 2;
  const wrapLongitude = (longitude) => {
    const wrapped = ((longitude + 180) % 360 + 360) % 360 - 180;
    return Object.is(wrapped, -0) ? 0 : wrapped;
  };
  const unwrapLongitude = (longitude) => {
    if (!allowUnwrappedLongitude) return longitude;
    const wrapped = wrapLongitude(longitude);
    const candidates = [wrapped - 360, wrapped, wrapped + 360];
    return candidates.sort((left, right) => (
      Math.abs(left - centerLongitude) - Math.abs(right - centerLongitude)
    ))[0];
  };
  const origin = Object.freeze({
    longitude: wrapLongitude(centerLongitude),
    latitude: (south + north) / 2,
    height: referenceHeight,
  });
  const frame = createLocalEnuFrame(origin);
  const positions = new Float32Array(columns * rows * 3);
  const localBounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
    minZ: Number.POSITIVE_INFINITY,
    maxZ: Number.NEGATIVE_INFINITY,
  };

  for (let row = 0; row < rows; row += 1) {
    const latitude = north - (row / (rows - 1)) * (north - south);
    for (let column = 0; column < columns; column += 1) {
      const unwrappedLongitude = west + (column / (columns - 1)) * (east - west);
      const longitude = wrapLongitude(unwrappedLongitude);
      const index = row * columns + column;
      const local = frame.toLocal({ longitude, latitude, height: values[index] });
      positions.set(local, index * 3);
      // Rendering and collision both consume the Float32 mesh. Derive bounds
      // from those stored coordinates as well: a rounded edge vertex can sit a
      // few micrometres outside the original Float64 ENU value.
      const positionOffset = index * 3;
      const storedX = positions[positionOffset];
      const storedY = positions[positionOffset + 1];
      const storedZ = positions[positionOffset + 2];
      localBounds.minX = Math.min(localBounds.minX, storedX);
      localBounds.maxX = Math.max(localBounds.maxX, storedX);
      localBounds.minY = Math.min(localBounds.minY, storedY);
      localBounds.maxY = Math.max(localBounds.maxY, storedY);
      localBounds.minZ = Math.min(localBounds.minZ, storedZ);
      localBounds.maxZ = Math.max(localBounds.maxZ, storedZ);
    }
  }

  const localSurfaceIndex = createLocalSurfaceIndex(
    positions, columns, rows, localBounds,
  );

  const sampleRawHeight = (longitude, latitude) => {
    const column = ((unwrapLongitude(longitude) - west) / (east - west)) * (columns - 1);
    const row = ((north - latitude) / (north - south)) * (rows - 1);
    return bilinear(values, columns, rows, column, row);
  };
  const containsLocal = (x, z) => (
    x >= localBounds.minX && x <= localBounds.maxX
    && z >= localBounds.minZ && z <= localBounds.maxZ
  );
  let cachedSurfaceX = Number.NaN;
  let cachedSurfaceZ = Number.NaN;
  let cachedSurface = null;
  const sampleLocalSurface = (x, z) => {
    if (x === cachedSurfaceX && z === cachedSurfaceZ) return cachedSurface;
    cachedSurfaceX = x;
    cachedSurfaceZ = z;
    if (!containsLocal(x, z)) {
      cachedSurface = null;
      return null;
    }
    const column = surfaceBin(x, localBounds.minX, localBounds.maxX, columns - 1);
    const row = surfaceBin(z, localBounds.minZ, localBounds.maxZ, rows - 1);
    const candidates = localSurfaceIndex.bins[row * (columns - 1) + column];
    for (const triangleId of candidates) {
      const triangleOffset = triangleId * 3;
      const sample = triangleSurfaceSample(
        positions,
        localSurfaceIndex.triangles[triangleOffset],
        localSurfaceIndex.triangles[triangleOffset + 1],
        localSurfaceIndex.triangles[triangleOffset + 2],
        x,
        z,
      );
      if (sample) {
        cachedSurface = sample;
        return sample;
      }
    }
    cachedSurface = null;
    return null;
  };
  const sampleLocalHeight = (x, z) => sampleLocalSurface(x, z)?.height ?? Number.NaN;
  const normalStep = Math.max(0.5, Math.min(
    (localBounds.maxX - localBounds.minX) / (columns - 1),
    (localBounds.maxZ - localBounds.minZ) / (rows - 1),
  ));
  const sampleLocalNormal = (x, z) => sampleLocalSurface(x, z)?.normal
    ?? Object.freeze([0, 1, 0]);

  return Object.freeze({
    schemaVersion: 'peercompute.geo.local-terrain-grid.v1',
    bbox: normalizedBbox,
    width: columns,
    height: rows,
    heights: values,
    positions,
    origin,
    frame,
    localBounds: Object.freeze(localBounds),
    surfaceIndex: localSurfaceIndex.telemetry,
    referenceHeight,
    normalStep,
    source: Object.freeze({
      id: source.id ?? MOTORCYCLE_TERRAIN_SOURCE_ID,
      authoritative: source.authoritative !== false,
      derived: source.derived === true,
      fetchedAt: source.fetchedAt ?? null,
      url: source.url ?? null,
      attribution: source.attribution ?? 'NOAA/NCEI ETOPO 2022 Global Relief',
      operationalUse: false,
    }),
    containsLocal,
    sampleRawHeight,
    sampleLocalSurface,
    sampleLocalHeight,
    sampleLocalNormal,
  });
}

function terrariumGlobalPixel(longitude, latitude, zoom) {
  const tileCount = 2 ** zoom;
  const worldSize = tileCount * TERRARIUM_TILE_SIZE;
  const clampedLatitude = Math.max(
    -WEB_MERCATOR_MAX_LATITUDE,
    Math.min(WEB_MERCATOR_MAX_LATITUDE, latitude),
  );
  const latitudeRadians = clampedLatitude * Math.PI / 180;
  return Object.freeze({
    x: ((longitude + 180) / 360) * worldSize - 0.5,
    y: (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI)
      / 2 * worldSize - 0.5,
    tileCount,
    worldSize,
  });
}

function terrariumPixelAddress(x, y, { tileCount, worldSize }) {
  const wrappedX = ((x % worldSize) + worldSize) % worldSize;
  const clampedY = Math.max(0, Math.min(worldSize - 1, y));
  const pixelX = Math.floor(wrappedX);
  const pixelY = Math.floor(clampedY);
  const tileX = Math.floor(pixelX / TERRARIUM_TILE_SIZE) % tileCount;
  const tileY = Math.min(tileCount - 1, Math.floor(pixelY / TERRARIUM_TILE_SIZE));
  return Object.freeze({
    key: `${tileX}/${tileY}`,
    tileX,
    tileY,
    column: pixelX % TERRARIUM_TILE_SIZE,
    row: pixelY % TERRARIUM_TILE_SIZE,
  });
}

/**
 * Loads a small, bounded AWS Terrarium tile set and resamples it onto the
 * exact WGS84 vertex grid consumed by both the RoadVector renderer and
 * collision surface. The half-pixel convention matches the shared Cesium
 * Terrarium provider, so local and overview relief use the same source posts.
 */
export async function loadTerrariumTerrainGrid({
  bbox,
  width = MOTORCYCLE_TERRAIN_GRID_SIZE,
  height = MOTORCYCLE_TERRAIN_GRID_SIZE,
  zoom = MOTORCYCLE_TERRAIN_TILE_ZOOM,
  fetchImpl = globalThis.fetch,
  fetchHeightmap = fetchTerrariumHeightmap,
  signal,
  clock = () => new Date(),
} = {}) {
  const normalizedBbox = normalizeBbox(bbox);
  const columns = gridDimension(width, 'Terrain width');
  const rows = gridDimension(height, 'Terrain height');
  if (!Number.isInteger(zoom) || zoom < 0 || zoom > 15) {
    throw new RangeError('Terrain zoom must be an integer between zero and 15.');
  }
  if (typeof fetchHeightmap !== 'function') throw new TypeError('A Terrarium heightmap loader is required.');
  const [south, west, north, east] = normalizedBbox;
  const samples = [];
  const addresses = new Map();
  for (let row = 0; row < rows; row += 1) {
    const latitude = north - (row / (rows - 1)) * (north - south);
    for (let column = 0; column < columns; column += 1) {
      const longitude = west + (column / (columns - 1)) * (east - west);
      const pixel = terrariumGlobalPixel(longitude, latitude, zoom);
      const x0 = Math.floor(pixel.x);
      const y0 = Math.floor(pixel.y);
      const corners = [
        terrariumPixelAddress(x0, y0, pixel),
        terrariumPixelAddress(x0 + 1, y0, pixel),
        terrariumPixelAddress(x0, y0 + 1, pixel),
        terrariumPixelAddress(x0 + 1, y0 + 1, pixel),
      ];
      for (const address of corners) addresses.set(address.key, address);
      samples.push(Object.freeze({
        xWeight: pixel.x - x0,
        yWeight: pixel.y - y0,
        corners,
      }));
    }
  }
  if (addresses.size > MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES) {
    const error = new RangeError(
      `RoadVector terrain requires ${addresses.size} Terrarium tiles, exceeding the ${MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES}-tile cap.`,
    );
    error.code = 'ERR_MOTORCYCLE_TERRAIN_TILE_CAP';
    throw error;
  }

  const tiles = new Map();
  await Promise.all([...addresses.values()].map(async ({ key, tileX, tileY }) => {
    const url = formatTerrariumTileUrl(tileX, tileY, zoom);
    const result = await fetchHeightmap(url, { fetchImpl, signal });
    const tileHeights = ArrayBuffer.isView(result)
      ? result
      : result?.heights ?? result?.buffer ?? result;
    const tileWidth = result?.width ?? TERRARIUM_TILE_SIZE;
    const tileHeight = result?.height ?? TERRARIUM_TILE_SIZE;
    if (!ArrayBuffer.isView(tileHeights)
      || tileWidth !== TERRARIUM_TILE_SIZE
      || tileHeight !== TERRARIUM_TILE_SIZE
      || tileHeights.length !== TERRARIUM_TILE_SIZE * TERRARIUM_TILE_SIZE) {
      throw new RangeError(`Terrarium tile ${zoom}/${tileX}/${tileY} has an invalid sample grid.`);
    }
    tiles.set(key, tileHeights);
  }));

  const sampleCorner = ({ key, column, row }) => {
    const tile = tiles.get(key);
    if (!tile) throw new Error(`Terrarium tile ${key} was not loaded.`);
    return tile[row * TERRARIUM_TILE_SIZE + column];
  };
  const heights = Float32Array.from(samples, ({ xWeight, yWeight, corners }) => {
    const northWest = sampleCorner(corners[0]);
    const northEast = sampleCorner(corners[1]);
    const southWest = sampleCorner(corners[2]);
    const southEast = sampleCorner(corners[3]);
    const northValue = northWest + (northEast - northWest) * xWeight;
    const southValue = southWest + (southEast - southWest) * xWeight;
    return northValue + (southValue - northValue) * yWeight;
  });
  return createTerrainGrid({
    bbox: normalizedBbox,
    width: columns,
    height: rows,
    heights,
    source: {
      id: MOTORCYCLE_TERRAIN_SOURCE_ID,
      authoritative: true,
      derived: false,
      fetchedAt: clock().toISOString(),
      url: TERRARIUM_URL_TEMPLATE,
      attribution: 'AWS Terrain Tiles (Terrarium elevation encoding; source registry attribution required)',
    },
  });
}

/**
 * Loads one wrapped RoadVector ride tile into an immutable, tile-owned ENU
 * terrain chunk. One vertex outside every core edge overlaps the neighboring
 * chunk, while the Terrarium sampler applies the same half-pixel convention as
 * the Cesium overview provider. Adjacent chunks therefore share exact core
 * boundary posts and retain geometry on both sides of a rounded ENU seam.
 */
export async function loadTerrariumTerrainTile({
  tile,
  width = MOTORCYCLE_RIDE_TERRAIN_GRID_SIZE,
  height = MOTORCYCLE_RIDE_TERRAIN_GRID_SIZE,
  halo = MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS,
  fetchImpl = globalThis.fetch,
  fetchHeightmap = fetchTerrariumHeightmap,
  signal,
  clock = () => new Date(),
} = {}) {
  const normalizedTile = normalizeRideTile(tile);
  const columns = gridDimension(width, 'Ride terrain width');
  const rows = gridDimension(height, 'Ride terrain height');
  if (columns !== rows) {
    throw new RangeError('Ride terrain width and height must match for deterministic tile resampling.');
  }
  if (halo !== MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS) {
    throw new RangeError(
      `Ride terrain source halo must be ${MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS} pixel.`,
    );
  }
  if (typeof fetchHeightmap !== 'function') throw new TypeError('A Terrarium heightmap loader is required.');
  if (signal?.aborted) throw signal.reason ?? new DOMException('Aborted', 'AbortError');

  const bounds = rideTileBounds(normalizedTile);
  const [coreSouth, coreWest, coreNorth, coreEast] = bounds.bbox;
  const longitudeStep = (coreEast - coreWest) / (columns - 1);
  const latitudeStep = (coreNorth - coreSouth) / (rows - 1);
  const expandedBbox = Object.freeze([
    coreSouth - latitudeStep * halo,
    coreWest - longitudeStep * halo,
    coreNorth + latitudeStep * halo,
    coreEast + longitudeStep * halo,
  ]);
  const expandedColumns = columns + halo * 2;
  const expandedRows = rows + halo * 2;
  const [south, west, north, east] = expandedBbox;
  const samples = [];
  const addresses = new Map();
  for (let row = 0; row < expandedRows; row += 1) {
    const latitude = north - (row / (expandedRows - 1)) * (north - south);
    for (let column = 0; column < expandedColumns; column += 1) {
      const longitude = west + (column / (expandedColumns - 1)) * (east - west);
      const pixel = terrariumGlobalPixel(longitude, latitude, normalizedTile.z);
      const x0 = Math.floor(pixel.x);
      const y0 = Math.floor(pixel.y);
      const corners = [
        terrariumPixelAddress(x0, y0, pixel),
        terrariumPixelAddress(x0 + 1, y0, pixel),
        terrariumPixelAddress(x0, y0 + 1, pixel),
        terrariumPixelAddress(x0 + 1, y0 + 1, pixel),
      ];
      for (const address of corners) addresses.set(address.key, address);
      samples.push(Object.freeze({
        xWeight: pixel.x - x0,
        yWeight: pixel.y - y0,
        corners,
      }));
    }
  }
  const requestedSourceTiles = new Map([...addresses.values()].map((address) => {
    const sourceKey = `${normalizedTile.z}/${address.tileX}/${address.tileY}`;
    const url = formatTerrariumTileUrl(address.tileX, address.tileY, normalizedTile.z);
    return [sourceKey, Object.freeze({
      key: sourceKey,
      x: address.tileX,
      y: address.tileY,
      z: normalizedTile.z,
      url,
    })];
  }));
  if (requestedSourceTiles.size > MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES) {
    const error = new RangeError(
      `Ride terrain source halo exceeded the ${MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES}-tile cap.`,
    );
    error.code = 'ERR_MOTORCYCLE_TERRAIN_TILE_CAP';
    throw error;
  }
  const sourceHeights = new Map();
  // The globe stream admits at most six tile loaders. Keep each loader to one
  // source request at a time so that nested 3x3 halo reads cannot multiply the
  // browser's authoritative-source concurrency beyond that outer cap.
  for (const sourceTile of requestedSourceTiles.values()) {
    const result = await fetchHeightmap(sourceTile.url, { fetchImpl, signal });
    const tileHeights = ArrayBuffer.isView(result)
      ? result
      : result?.heights ?? result?.buffer ?? result;
    const tileWidth = result?.width ?? TERRARIUM_TILE_SIZE;
    const tileHeight = result?.height ?? TERRARIUM_TILE_SIZE;
    if (!ArrayBuffer.isView(tileHeights)
      || tileWidth !== TERRARIUM_TILE_SIZE
      || tileHeight !== TERRARIUM_TILE_SIZE
      || tileHeights.length !== TERRARIUM_TILE_SIZE * TERRARIUM_TILE_SIZE) {
      throw new RangeError(`Terrarium tile ${sourceTile.key} has an invalid sample grid.`);
    }
    sourceHeights.set(`${sourceTile.x}/${sourceTile.y}`, tileHeights);
  }
  const sampleCorner = ({ key, column, row }) => {
    const tileHeights = sourceHeights.get(key);
    if (!tileHeights) throw new Error(`Terrarium tile ${key} was not loaded.`);
    return tileHeights[row * TERRARIUM_TILE_SIZE + column];
  };
  const heights = Float32Array.from(samples, ({ xWeight, yWeight, corners }) => {
    const northWest = sampleCorner(corners[0]);
    const northEast = sampleCorner(corners[1]);
    const southWest = sampleCorner(corners[2]);
    const southEast = sampleCorner(corners[3]);
    const northValue = northWest + (northEast - northWest) * xWeight;
    const southValue = southWest + (southEast - southWest) * xWeight;
    return northValue + (southValue - northValue) * yWeight;
  });
  const terrain = createTerrainGrid({
    bbox: expandedBbox,
    width: expandedColumns,
    height: expandedRows,
    heights,
    allowUnwrappedLongitude: true,
    maximumGridDimension: MOTORCYCLE_RIDE_TERRAIN_GRID_SIZE
      + MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS * 2,
    source: {
      id: MOTORCYCLE_TERRAIN_SOURCE_ID,
      authoritative: true,
      derived: false,
      fetchedAt: clock().toISOString(),
      url: TERRARIUM_URL_TEMPLATE,
      attribution: 'AWS Terrain Tiles (Terrarium elevation encoding; source registry attribution required)',
    },
  });
  const triangleIndexBytes = terrain.surfaceIndex.triangleCount * 3 * Uint32Array.BYTES_PER_ELEMENT;
  const binReferenceBytes = terrain.surfaceIndex.referenceCount * Uint32Array.BYTES_PER_ELEMENT;
  const residentBytes = terrain.heights.byteLength
    + terrain.positions.byteLength
    + triangleIndexBytes
    + binReferenceBytes;
  return Object.freeze({
    ...terrain,
    rideTile: normalizedTile,
    coreBbox: bounds.bbox,
    halo: Object.freeze({
      sourcePixels: TERRARIUM_TILE_SIZE / (columns - 1) * halo,
      geometryOverlapVertices: halo,
      edgeModel: 'overlapped-shared-half-pixel-terrarium-posts',
    }),
    sourceTiles: Object.freeze(
      [...requestedSourceTiles.values()].sort((left, right) => left.key.localeCompare(right.key)),
    ),
    resource: Object.freeze({
      schemaVersion: 'peercompute.motorcycle.ride-terrain-resource.v1',
      residentBytes,
      vertexCount: terrain.positions.length / 3,
      triangleCount: terrain.surfaceIndex.triangleCount,
    }),
  });
}

export function createDerivedFlatTerrainGrid({ bbox, heightMeters = 0 } = {}) {
  const width = 3;
  const height = 3;
  return createTerrainGrid({
    bbox,
    width,
    height,
    heights: new Float32Array(width * height).fill(finite(heightMeters, 'heightMeters')),
    source: {
      id: 'peercompute-derived-flat-terrain',
      authoritative: false,
      derived: true,
      attribution: 'Application-derived degraded fallback plane',
    },
  });
}
