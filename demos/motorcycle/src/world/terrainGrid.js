import {
  createLocalEnuFrame,
  fetchTerrariumHeightmap,
  formatTerrariumTileUrl,
  TERRARIUM_TILE_SIZE,
  TERRARIUM_URL_TEMPLATE,
  WEB_MERCATOR_MAX_LATITUDE,
} from '@peercompute/geo-core';

export const MOTORCYCLE_TERRAIN_GRID_SIZE = 65;
export const MOTORCYCLE_TERRAIN_SOURCE_ID = 'aws-terrarium';
export const MOTORCYCLE_TERRAIN_TILE_ZOOM = 12;
export const MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES = 9;

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

function normalizeBbox(value) {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new TypeError('Terrain bbox must be [south, west, north, east].');
  }
  const [south, west, north, east] = value.map((entry, index) => finite(entry, `bbox[${index}]`));
  if (south < -90 || north > 90 || west < -180 || east > 180 || south >= north || west >= east) {
    throw new RangeError('Terrain bbox must be ordered, finite, and must not cross the antimeridian.');
  }
  return Object.freeze([south, west, north, east]);
}

function gridDimension(value, label) {
  if (!Number.isInteger(value) || value < 3 || value > 129) {
    throw new RangeError(`${label} must be an integer between 3 and 129.`);
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
} = {}) {
  const normalizedBbox = normalizeBbox(bbox);
  const columns = gridDimension(width, 'Terrain width');
  const rows = gridDimension(height, 'Terrain height');
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
  const origin = Object.freeze({
    longitude: (west + east) / 2,
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
      const longitude = west + (column / (columns - 1)) * (east - west);
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
    const column = ((longitude - west) / (east - west)) * (columns - 1);
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
