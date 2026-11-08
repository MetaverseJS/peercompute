export function createCappedHeightmapTerrainProvider(
  Cesium,
  {
    callback,
    width,
    height,
    tilingScheme,
    credit,
    maximumLevel,
    onHeightmap
  }
) {
  if (
    !Cesium?.TerrainProvider
    || !Cesium?.HeightmapTerrainData
    || !Cesium?.Event
    || !Cesium?.Credit
  ) {
    throw new TypeError('Cesium terrain-provider primitives are required.');
  }
  if (typeof callback !== 'function') throw new TypeError('A heightmap callback is required.');
  if (onHeightmap !== undefined && typeof onHeightmap !== 'function') {
    throw new TypeError('onHeightmap must be a function when provided.');
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 2 || height < 2) {
    throw new RangeError('Heightmap width and height must be integers greater than one.');
  }
  if (!Number.isInteger(maximumLevel) || maximumLevel < 0) {
    throw new RangeError('maximumLevel must be a non-negative integer.');
  }
  if (!tilingScheme?.ellipsoid || typeof tilingScheme.getNumberOfXTilesAtLevel !== 'function') {
    throw new TypeError('A Cesium tiling scheme is required.');
  }

  const errorEvent = new Cesium.Event();
  const providerCredit = typeof credit === 'string' ? new Cesium.Credit(credit) : credit;
  const levelZeroMaximumGeometricError =
    Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
      tilingScheme.ellipsoid,
      Math.max(width, height),
      tilingScheme.getNumberOfXTilesAtLevel(0)
    );

  return {
    get errorEvent() {
      return errorEvent;
    },
    get credit() {
      return providerCredit;
    },
    get tilingScheme() {
      return tilingScheme;
    },
    get hasWaterMask() {
      return false;
    },
    get hasVertexNormals() {
      return false;
    },
    get availability() {
      return undefined;
    },
    getTileDataAvailable(x, y, level) {
      return Number.isInteger(x)
        && Number.isInteger(y)
        && Number.isInteger(level)
        && x >= 0
        && y >= 0
        && level >= 0
        && level <= maximumLevel
        && x < tilingScheme.getNumberOfXTilesAtLevel(level)
        && y < tilingScheme.getNumberOfYTilesAtLevel(level);
    },
    loadTileDataAvailability() {
      return undefined;
    },
    getLevelMaximumGeometricError(level) {
      return levelZeroMaximumGeometricError / (1 << level);
    },
    requestTileGeometry(x, y, level, request) {
      if (!this.getTileDataAvailable(x, y, level)) {
        return Promise.reject(new RangeError(`Terrain tile ${level}/${x}/${y} is outside the available pyramid.`));
      }

      const sourceRequest = callback(x, y, level, request);
      if (sourceRequest === undefined) return undefined;
      return Promise.resolve(sourceRequest).then((buffer) => {
        const typedBuffer = Array.isArray(buffer) ? Float64Array.from(buffer) : buffer;
        if (!ArrayBuffer.isView(typedBuffer) || typedBuffer.length !== width * height) {
          throw new RangeError(`Terrain tile must contain exactly ${width * height} typed height samples.`);
        }
        const terrainData = new Cesium.HeightmapTerrainData({
          buffer: typedBuffer,
          width,
          height,
          childTileMask: level < maximumLevel ? 15 : 0
        });
        if (onHeightmap) {
          try {
            const observation = onHeightmap(Object.freeze({
              x,
              y,
              level,
              width,
              height,
              heights: typedBuffer,
              tilingScheme
            }));
            if (observation && typeof observation.then === 'function') {
              Promise.resolve(observation).catch(() => {});
            }
          } catch {
            // Heightmap observers are diagnostic/rendering sidecars and must
            // never turn valid source terrain into a failed Cesium request.
          }
        }
        return terrainData;
      });
    }
  };
}
