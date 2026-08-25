import { buildTerrainNurbsContours, TERRAIN_NURBS_LIMITS } from '@peercompute/geo-core';

import { EARTH_GEOMETRY_STYLE } from './geometryStyle.js';

export const EARTH_TERRAIN_GEOMETRY_LIMITS = Object.freeze({
  maximumCachedGrids: 64,
  maximumActiveGrids: 24,
  maximumActiveVertices: 2_000_000,
});

export const TERRAIN_CONTOUR_LIFT_METERS = EARTH_GEOMETRY_STYLE.heightOffsetsMeters.terrainContours;

const ACTUAL_BUFFER_RENDERER = EARTH_GEOMETRY_STYLE.renderingModel;
// At WGS84's maximum radius, a 0.025° Cartesian chord sags under 0.16 m,
// leaving margin inside the shared 0.25 m contour lift with terrain depth test.
const MAXIMUM_SEGMENT_ANGLE_DEGREES = 0.025;
const MAXIMUM_SEGMENT_ANGLE_RADIANS = MAXIMUM_SEGMENT_ANGLE_DEGREES * Math.PI / 180;
const PI = Math.PI;
const TWO_PI = 2 * PI;
const FRACTION_EPSILON = 1e-12;
const terrainHeightSamplers = new WeakMap();

function boundedInteger(value, fallback, maximum, label) {
  const selected = value ?? fallback;
  if (!Number.isInteger(selected) || selected < 1 || selected > maximum) {
    throw new RangeError(`${label} must be an integer between 1 and ${maximum}.`);
  }
  return selected;
}

function positive(value, fallback, label) {
  const selected = value ?? fallback;
  if (!Number.isFinite(selected) || selected <= 0) throw new RangeError(`${label} must be positive.`);
  return Number(selected);
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function normalizeLongitudeRadians(value) {
  let longitude = value;
  while (longitude < -PI) longitude += TWO_PI;
  while (longitude > PI) longitude -= TWO_PI;
  return longitude;
}

function longitudeRanges(rectangle) {
  if (!rectangle) return [[-PI, PI]];
  const west = Number(rectangle.west);
  const east = Number(rectangle.east);
  if (!Number.isFinite(west) || !Number.isFinite(east)) return [[-PI, PI]];
  if (east >= west) return [[west, east]];
  return [[west, PI], [-PI, east]];
}

function rectanglesIntersect(left, right) {
  if (!left || !right) return true;
  if (left.north < right.south || left.south > right.north) return false;
  return longitudeRanges(left).some(([leftWest, leftEast]) => (
    longitudeRanges(right).some(([rightWest, rightEast]) => (
      leftWest <= rightEast && leftEast >= rightWest
    ))
  ));
}

function longitudeFraction(rectangle, longitude) {
  let west = Number(rectangle.west);
  let east = Number(rectangle.east);
  if (!Number.isFinite(west) || !Number.isFinite(east)) return null;
  if (east < west) east += TWO_PI;
  let candidate = normalizeLongitudeRadians(longitude);
  while (candidate < west - FRACTION_EPSILON) candidate += TWO_PI;
  while (candidate > east + FRACTION_EPSILON && candidate - TWO_PI >= west - FRACTION_EPSILON) {
    candidate -= TWO_PI;
  }
  const span = east - west;
  if (span <= 0 || candidate < west - FRACTION_EPSILON || candidate > east + FRACTION_EPSILON) return null;
  return clamp01((candidate - west) / span);
}

function geographicFractions(rectangle, longitude, latitude) {
  if (!rectangle || !Number.isFinite(latitude)) return null;
  const north = Number(rectangle.north);
  const south = Number(rectangle.south);
  const latitudeSpan = north - south;
  const columnFraction = longitudeFraction(rectangle, longitude);
  if (columnFraction === null
    || !Number.isFinite(north)
    || !Number.isFinite(south)
    || latitudeSpan <= 0
    || latitude < south - FRACTION_EPSILON
    || latitude > north + FRACTION_EPSILON) {
    return null;
  }
  return {
    columnFraction,
    rowFraction: clamp01((north - latitude) / latitudeSpan),
  };
}

function desiredTerrainLevel(cameraHeight, maximumLevel) {
  const height = Math.max(100, Number.isFinite(cameraHeight) ? cameraHeight : 20_000_000);
  const selected = Math.floor(Math.log2(40_000_000 / height));
  return Math.max(0, Math.min(maximumLevel, selected));
}

function centerDistanceSquared(rectangle, center) {
  if (!rectangle || !center) return 0;
  const longitude = rectangle.east >= rectangle.west
    ? (rectangle.west + rectangle.east) / 2
    : normalizeLongitudeRadians((rectangle.west + rectangle.east + TWO_PI) / 2);
  const latitude = (rectangle.south + rectangle.north) / 2;
  let longitudeDelta = Math.abs(longitude - center.longitude);
  longitudeDelta = Math.min(longitudeDelta, TWO_PI - longitudeDelta);
  return longitudeDelta ** 2 + (latitude - center.latitude) ** 2;
}

function angularDistance(left, right) {
  const latitudeDelta = right.latitude - left.latitude;
  const longitudeDelta = normalizeLongitudeRadians(right.longitude - left.longitude);
  const sinLatitude = Math.sin(latitudeDelta / 2);
  const sinLongitude = Math.sin(longitudeDelta / 2);
  const haversine = sinLatitude ** 2
    + Math.cos(left.latitude) * Math.cos(right.latitude) * sinLongitude ** 2;
  return 2 * Math.asin(Math.min(1, Math.sqrt(Math.max(0, haversine))));
}

function bilinearSample(record, columnFraction, rowFraction) {
  const column = clamp01(columnFraction) * (record.width - 1);
  const row = clamp01(rowFraction) * (record.height - 1);
  const left = Math.floor(column);
  const right = Math.min(record.width - 1, left + 1);
  const top = Math.floor(row);
  const bottom = Math.min(record.height - 1, top + 1);
  const columnMix = column - left;
  const rowMix = row - top;
  const topLeft = record.heights[top * record.width + left];
  const topRight = record.heights[top * record.width + right];
  const bottomLeft = record.heights[bottom * record.width + left];
  const bottomRight = record.heights[bottom * record.width + right];
  if (![topLeft, topRight, bottomLeft, bottomRight].every(Number.isFinite)) return undefined;
  const topValue = topLeft + (topRight - topLeft) * columnMix;
  const bottomValue = bottomLeft + (bottomRight - bottomLeft) * columnMix;
  return topValue + (bottomValue - topValue) * rowMix;
}

function cloneTelemetry(value) {
  return value ? JSON.parse(JSON.stringify(value)) : null;
}

function errorMessage(sceneOrError, possibleError) {
  const value = possibleError ?? sceneOrError;
  return value instanceof Error ? value.message : String(value ?? 'Cesium render failed.');
}

export function terrainHeightSamplerForViewer(viewer) {
  return terrainHeightSamplers.get(viewer);
}

export class TerrainNurbsGeometryLayer {
  #Cesium;
  #viewer;
  #dataSource;
  #cache = new Map();
  #primitive = null;
  #destroyed = false;
  #scheduled = null;
  #refreshQueued = false;
  #renderGeneration = 0;
  #maximumCachedGrids;
  #maximumActiveGrids;
  #maximumActiveVertices;
  #contourSpacingMeters;
  #lineWidthPixels;
  #show = true;
  #lastError = null;
  #telemetry = null;
  #dynamicTelemetry = {};
  #sampleHeightCallback;
  #removePostRender = () => {};
  #removeRenderError = () => {};
  #awaitingGpuSubmission = false;

  constructor(Cesium, {
    viewer,
    contourSpacingMeters = 500,
    lineWidthPixels = 1.5,
    maximumCachedGrids = EARTH_TERRAIN_GEOMETRY_LIMITS.maximumCachedGrids,
    maximumActiveGrids = EARTH_TERRAIN_GEOMETRY_LIMITS.maximumActiveGrids,
    maximumActiveVertices = EARTH_TERRAIN_GEOMETRY_LIMITS.maximumActiveVertices,
  } = {}) {
    if (!Cesium?.BufferPolylineCollection
      || !Cesium?.BufferPolyline
      || !Cesium?.BufferPolylineMaterial
      || !Cesium?.Cartesian3
      || !Cesium?.Color
      || Cesium?.BlendOption?.OPAQUE === undefined) {
      throw new TypeError('Cesium buffer-polyline, position, and color primitives are required.');
    }
    const scene = viewer?.scene;
    if (!viewer?.camera
      || typeof scene?.primitives?.add !== 'function'
      || typeof scene?.primitives?.remove !== 'function'
      || typeof scene?.postRender?.addEventListener !== 'function'
      || typeof scene?.renderError?.addEventListener !== 'function') {
      throw new TypeError('A Cesium Viewer with public primitive and render events is required.');
    }
    this.#Cesium = Cesium;
    this.#viewer = viewer;
    this.#maximumCachedGrids = boundedInteger(maximumCachedGrids, 64, 256, 'maximumCachedGrids');
    this.#maximumActiveGrids = boundedInteger(maximumActiveGrids, 24, 64, 'maximumActiveGrids');
    this.#maximumActiveVertices = boundedInteger(maximumActiveVertices, 2_000_000, 4_000_000, 'maximumActiveVertices');
    this.#contourSpacingMeters = positive(contourSpacingMeters, 500, 'contourSpacingMeters');
    this.#lineWidthPixels = positive(lineWidthPixels, 1.5, 'lineWidthPixels');
    const layer = this;
    const facade = { name: 'earthgrid-terrain-nurbs-geometry' };
    Object.defineProperty(facade, 'show', {
      enumerable: true,
      get() { return layer.show; },
      set(value) { layer.show = value; },
    });
    this.#dataSource = Object.freeze(facade);
    this.#sampleHeightCallback = (longitudeDegrees, latitudeDegrees) => (
      this.sampleHeight(longitudeDegrees, latitudeDegrees)
    );
    terrainHeightSamplers.set(viewer, this.#sampleHeightCallback);
    const removeMoveEnd = viewer.camera.moveEnd?.addEventListener?.(() => this.refresh());
    this.removeMoveEnd = typeof removeMoveEnd === 'function' ? removeMoveEnd : () => {};
    this.#removeRenderError = scene.renderError.addEventListener((sceneOrError, possibleError) => {
      if (this.#destroyed || !this.#awaitingGpuSubmission) return;
      this.#lastError = errorMessage(sceneOrError, possibleError);
      this.#awaitingGpuSubmission = false;
      this.#removePostRender();
      this.#removePostRender = () => {};
      this.#publishTelemetry({
        gpuSubmittedFrame: false,
        renderReady: false,
        observedSceneRenderError: true,
      });
    });
    this.#publishTelemetry({
      selectedLevel: null,
      selectedGridCount: 0,
      omittedGridCount: 0,
      activePathCount: 0,
      activeVertexCount: 0,
      sourceVertexCount: 0,
      aboveWaterPathCount: 0,
      atOrBelowWaterPathCount: 0,
      adaptedGridCount: 0,
      capped: false,
      cpuGeometryValidated: true,
      gpuSubmittedFrame: false,
      renderReady: false,
      observedSceneRenderError: false,
    });
  }

  get dataSource() { return this.#dataSource; }
  get primitiveCollection() { return this.#primitive; }
  get show() { return this.#show; }
  set show(value) {
    this.#show = Boolean(value);
    if (this.#primitive) this.#primitive.show = this.#show;
    this.#viewer.scene.requestRender?.();
  }

  acceptHeightmap({ x, y, level, width, height, heights, tilingScheme }) {
    if (this.#destroyed) return;
    if (![x, y, level].every((value) => Number.isInteger(value) && value >= 0)
      || !Number.isInteger(width) || width < 2
      || !Number.isInteger(height) || height < 2
      || !ArrayBuffer.isView(heights) || heights.length !== width * height
      || !tilingScheme?.tileXYToRectangle) {
      throw new TypeError('A canonical successful terrain heightmap is required.');
    }
    if (width * height > TERRAIN_NURBS_LIMITS.maximumGridSamples) {
      throw new RangeError(
        `Terrain heightmap exceeds the ${TERRAIN_NURBS_LIMITS.maximumGridSamples}-sample cache limit.`,
      );
    }
    const key = `${level}/${x}/${y}`;
    const record = Object.freeze({
      key,
      x,
      y,
      level,
      width,
      height,
      heights: Float32Array.from(heights),
      tilingScheme,
      rectangle: tilingScheme.tileXYToRectangle(x, y, level),
    });
    this.#cache.delete(key);
    this.#cache.set(key, record);
    while (this.#cache.size > this.#maximumCachedGrids) {
      this.#cache.delete(this.#cache.keys().next().value);
    }
    this.refresh();
  }

  /**
   * Bilinearly samples the highest-resolution cached terrain grid covering a
   * WGS84 degree coordinate. Returns undefined until a covering grid exists.
   */
  sampleHeight(longitudeDegrees, latitudeDegrees) {
    if (this.#destroyed
      || !Number.isFinite(longitudeDegrees)
      || !Number.isFinite(latitudeDegrees)
      || longitudeDegrees < -180
      || longitudeDegrees > 180
      || latitudeDegrees < -90
      || latitudeDegrees > 90) {
      return undefined;
    }
    let longitude = Number(longitudeDegrees) * PI / 180;
    if (longitude === -PI && longitudeDegrees > 0) longitude = PI;
    longitude = normalizeLongitudeRadians(longitude);
    const latitude = Number(latitudeDegrees) * PI / 180;
    const records = [...this.#cache.values()].sort((left, right) => (
      right.level - left.level
      || right.width * right.height - left.width * left.height
      || left.key.localeCompare(right.key)
    ));
    for (const record of records) {
      const fractions = this.#sampleFractions(record, longitude, latitude);
      if (!fractions) continue;
      const sampled = bilinearSample(record, fractions.columnFraction, fractions.rowFraction);
      if (Number.isFinite(sampled)) return sampled;
    }
    return undefined;
  }

  setStyle({ contourSpacingMeters, lineWidthPixels } = {}) {
    if (contourSpacingMeters !== undefined) {
      this.#contourSpacingMeters = positive(contourSpacingMeters, 500, 'contourSpacingMeters');
    }
    if (lineWidthPixels !== undefined) {
      this.#lineWidthPixels = positive(lineWidthPixels, 1.5, 'lineWidthPixels');
    }
    this.refresh({ force: true });
  }

  refresh() {
    if (this.#destroyed) return Promise.resolve();
    this.#refreshQueued = true;
    if (this.#scheduled) return this.#scheduled;
    this.#scheduled = Promise.resolve()
      .then(async () => {
        while (this.#refreshQueued && !this.#destroyed) {
          this.#refreshQueued = false;
          const generation = ++this.#renderGeneration;
          try {
            this.#reconcile(generation);
          } catch (error) {
            if (!this.#destroyed && generation === this.#renderGeneration) {
              this.#lastError = error instanceof Error ? error.message : String(error);
              this.#publishTelemetry({ gpuSubmittedFrame: false, renderReady: false });
            }
          }
          // Let heightmap observers queued by the same Cesium request burst
          // mark another immutable snapshot before this drain is considered idle.
          await Promise.resolve();
        }
      })
      .finally(() => {
        this.#scheduled = null;
      });
    return this.#scheduled;
  }

  waitForIdle() { return this.#scheduled ?? Promise.resolve(); }

  #sampleFractions(record, longitude, latitude) {
    const geographic = geographicFractions(record.rectangle, longitude, latitude);
    if (!geographic) return null;
    const isGeographic = this.#Cesium.GeographicTilingScheme
      && record.tilingScheme instanceof this.#Cesium.GeographicTilingScheme;
    if (isGeographic
      || !record.tilingScheme.tileXYToNativeRectangle
      || typeof record.tilingScheme.projection?.project !== 'function') {
      return geographic;
    }
    const native = record.tilingScheme.tileXYToNativeRectangle(record.x, record.y, record.level);
    const cartographic = new this.#Cesium.Cartographic(longitude, latitude, 0);
    const projected = record.tilingScheme.projection.project(
      cartographic,
      new this.#Cesium.Cartesian3(),
    );
    const width = native.east - native.west;
    const height = native.north - native.south;
    if (!Number.isFinite(projected?.x)
      || !Number.isFinite(projected?.y)
      || !Number.isFinite(width)
      || !Number.isFinite(height)
      || width <= 0
      || height <= 0) {
      return null;
    }
    return {
      columnFraction: clamp01((projected.x - native.west) / width),
      rowFraction: clamp01((native.north - projected.y) / height),
    };
  }

  #selectedRecords() {
    const records = [...this.#cache.values()];
    if (records.length === 0) return [];
    const view = this.#viewer.camera.computeViewRectangle?.() ?? null;
    const candidates = records.filter((record) => rectanglesIntersect(record.rectangle, view));
    const pool = candidates.length > 0 ? candidates : records;
    const maximumLoadedLevel = Math.max(...pool.map((record) => record.level));
    const target = desiredTerrainLevel(this.#viewer.camera.positionCartographic?.height, maximumLoadedLevel);
    const availableLevels = [...new Set(pool.map((record) => record.level))].sort((left, right) => left - right);
    const selectedLevel = availableLevels.filter((level) => level <= target).at(-1) ?? availableLevels[0];
    const center = this.#viewer.camera.positionCartographic ?? null;
    return pool
      .filter((record) => record.level === selectedLevel)
      .sort((left, right) => centerDistanceSquared(left.rectangle, center) - centerDistanceSquared(right.rectangle, center)
        || left.key.localeCompare(right.key))
      .slice(0, this.#maximumActiveGrids);
  }

  #cartographicPoint(record, point) {
    const columnFraction = point.gridColumn / (record.width - 1);
    const rowFraction = point.gridRow / (record.height - 1);
    const isGeographic = this.#Cesium.GeographicTilingScheme
      && record.tilingScheme instanceof this.#Cesium.GeographicTilingScheme;
    if (isGeographic || !record.tilingScheme.tileXYToNativeRectangle || !record.tilingScheme.projection?.unproject) {
      const rectangle = record.rectangle;
      const longitudeSpan = rectangle.east >= rectangle.west
        ? rectangle.east - rectangle.west
        : rectangle.east + TWO_PI - rectangle.west;
      return {
        longitude: normalizeLongitudeRadians(rectangle.west + longitudeSpan * columnFraction),
        latitude: rectangle.north + (rectangle.south - rectangle.north) * rowFraction,
      };
    }
    const native = record.tilingScheme.tileXYToNativeRectangle(record.x, record.y, record.level);
    const projected = new this.#Cesium.Cartesian3(
      native.west + (native.east - native.west) * columnFraction,
      native.north + (native.south - native.north) * rowFraction,
      0,
    );
    return record.tilingScheme.projection.unproject(projected);
  }

  #packPath(record, path, remainingVertices) {
    const points = path.points;
    if (!Array.isArray(points) || points.length < 2) return null;
    const steps = new Uint32Array(points.length - 1);
    let vertexCount = 1;
    for (let index = 1; index < points.length; index += 1) {
      const left = this.#cartographicPoint(record, points[index - 1]);
      const right = this.#cartographicPoint(record, points[index]);
      const subdivisions = Math.max(1, Math.ceil(angularDistance(left, right) / MAXIMUM_SEGMENT_ANGLE_RADIANS));
      steps[index - 1] = subdivisions;
      vertexCount += subdivisions;
      if (vertexCount > remainingVertices) return { capped: true };
    }
    const packed = new Float64Array(vertexCount * 3);
    const scratch = new this.#Cesium.Cartesian3();
    const elevation = Number(path.elevationMeters) + TERRAIN_CONTOUR_LIFT_METERS;
    let packedIndex = 0;
    const append = (point) => {
      const cartographic = this.#cartographicPoint(record, point);
      this.#Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        elevation,
        this.#Cesium.Ellipsoid.WGS84,
        scratch,
      );
      packed[packedIndex++] = scratch.x;
      packed[packedIndex++] = scratch.y;
      packed[packedIndex++] = scratch.z;
    };
    append(points[0]);
    for (let index = 1; index < points.length; index += 1) {
      const left = points[index - 1];
      const right = points[index];
      const subdivisions = steps[index - 1];
      for (let step = 1; step <= subdivisions; step += 1) {
        const mix = step / subdivisions;
        append({
          gridColumn: left.gridColumn + (right.gridColumn - left.gridColumn) * mix,
          gridRow: left.gridRow + (right.gridRow - left.gridRow) * mix,
        });
      }
    }
    return { positions: packed, vertexCount, capped: false };
  }

  #reconcile(generation) {
    const selected = this.#selectedRecords();
    const plans = [];
    let activeVertices = 0;
    let sourceVertices = 0;
    let omittedGridCount = 0;
    let capped = false;
    for (const record of selected) {
      const contour = buildTerrainNurbsContours(record.heights, {
        width: record.width,
        height: record.height,
        contourSpacingMeters: this.#contourSpacingMeters,
      });
      const pathPlans = [];
      let recordVertices = 0;
      let recordSourceVertices = 0;
      let recordCapped = false;
      for (const path of contour.paths) {
        if (!Array.isArray(path.points) || path.points.length < 2) continue;
        const packed = this.#packPath(
          record,
          path,
          this.#maximumActiveVertices - activeVertices - recordVertices,
        );
        if (packed?.capped) {
          recordCapped = true;
          break;
        }
        if (!packed) continue;
        pathPlans.push({ path, ...packed });
        recordVertices += packed.vertexCount;
        recordSourceVertices += path.points.length;
      }
      if (recordCapped) {
        omittedGridCount += 1;
        capped = true;
        continue;
      }
      activeVertices += recordVertices;
      sourceVertices += recordSourceVertices;
      plans.push({ record, contour, paths: pathPlans });
    }
    if (this.#destroyed || generation !== this.#renderGeneration) return;

    const activePathCount = plans.reduce((total, plan) => total + plan.paths.length, 0);
    let aboveWaterPathCount = 0;
    let atOrBelowWaterPathCount = 0;
    let adaptedGridCount = 0;
    let collection = null;
    if (activePathCount > 0) {
      collection = new this.#Cesium.BufferPolylineCollection({
        primitiveCountMax: activePathCount,
        vertexCountMax: activeVertices,
        allowPicking: false,
        show: this.#show,
        blendOption: this.#Cesium.BlendOption.OPAQUE,
      });
      const materialCache = new Map();
      const primitive = new this.#Cesium.BufferPolyline();
      let featureId = 0;
      for (const { contour, paths } of plans) {
        if (contour.adapted || contour.capped) adaptedGridCount += 1;
        for (const { path, positions } of paths) {
          const submerged = path.elevationMeters <= 0;
          const color = submerged
            ? EARTH_GEOMETRY_STYLE.colors.terrainAtOrBelowWater
            : EARTH_GEOMETRY_STYLE.colors.terrainAboveWater;
          const levelNumber = Math.round(path.elevationMeters / contour.effectiveContourSpacingMeters);
          const major = Math.abs(levelNumber) % 5 === 0;
          const width = Math.max(1, Math.min(255, Math.round(this.#lineWidthPixels * (major ? 1.35 : 1))));
          const materialKey = `${color}/${width}`;
          let material = materialCache.get(materialKey);
          if (!material) {
            material = new this.#Cesium.BufferPolylineMaterial({
              color: this.#Cesium.Color.fromCssColorString(color),
              outlineWidth: 0,
              width,
            });
            materialCache.set(materialKey, material);
          }
          collection.add({ positions, material, featureId }, primitive);
          featureId += 1;
          if (submerged) atOrBelowWaterPathCount += 1;
          else aboveWaterPathCount += 1;
        }
      }
    }

    const cpuGeometryValidated = !collection || (
      collection.primitiveCount === activePathCount
      && collection.vertexCount === activeVertices
    );
    if (!cpuGeometryValidated) {
      collection?.destroy?.();
      throw new Error('Terrain buffer snapshot counts did not match the validated contour plan.');
    }
    this.#lastError = null;
    this.#installSnapshot(collection, generation, {
      selectedLevel: plans[0]?.record.level ?? null,
      selectedGridCount: plans.length,
      omittedGridCount,
      activePathCount,
      activeVertexCount: activeVertices,
      sourceVertexCount: sourceVertices,
      aboveWaterPathCount,
      atOrBelowWaterPathCount,
      adaptedGridCount,
      capped,
      cpuGeometryValidated,
    });
  }

  #installSnapshot(collection, generation, dynamic) {
    const primitives = this.#viewer.scene.primitives;
    const previous = this.#primitive;
    if (collection) {
      try {
        primitives.add(collection);
      } catch (error) {
        collection.destroy?.();
        throw error;
      }
    }
    this.#primitive = collection;
    if (previous) primitives.remove(previous);
    this.#removePostRender();
    this.#awaitingGpuSubmission = false;
    this.#publishTelemetry({
      ...dynamic,
      gpuSubmittedFrame: false,
      renderReady: false,
      observedSceneRenderError: false,
    });
    if (!collection) {
      this.#viewer.scene.requestRender?.();
      return;
    }
    this.#awaitingGpuSubmission = true;
    let removeListener = null;
    const remove = this.#viewer.scene.postRender.addEventListener(() => {
      if (!this.#show) return;
      removeListener?.();
      removeListener = null;
      this.#awaitingGpuSubmission = false;
      if (this.#destroyed || generation !== this.#renderGeneration || this.#primitive !== collection || this.#lastError) return;
      const countsStillValid = !collection || (
        collection.primitiveCount === dynamic.activePathCount
        && collection.vertexCount === dynamic.activeVertexCount
      );
      if (!countsStillValid) {
        this.#lastError = 'Terrain buffer snapshot counts changed after installation.';
        this.#publishTelemetry({ gpuSubmittedFrame: false, renderReady: false });
        return;
      }
      this.#publishTelemetry({ gpuSubmittedFrame: true, renderReady: true });
    });
    removeListener = typeof remove === 'function' ? remove : null;
    this.#removePostRender = () => {
      removeListener?.();
      removeListener = null;
    };
    this.#viewer.scene.requestRender?.();
  }

  #publishTelemetry(dynamic) {
    this.#dynamicTelemetry = { ...this.#dynamicTelemetry, ...dynamic };
    this.#telemetry = Object.freeze({
      schemaVersion: 'peercompute.earthgrid.terrain-nurbs-geometry.v1',
      renderer: ACTUAL_BUFFER_RENDERER,
      geometryType: 'cesium-buffer-polyline',
      curveModel: 'NURBS',
      degree: 1,
      topologyPolicy: 'exact-degree-one-nurbs-polyline',
      lineMaterial: 'solid-buffer-polyline',
      linePassesPerPath: 1,
      rasterPainted: false,
      glow: false,
      immutableSnapshotCollections: true,
      workerGeometryJobs: 0,
      contourSpacingMeters: this.#contourSpacingMeters,
      lineWidthPixels: this.#lineWidthPixels,
      maximumSegmentAngleDegrees: MAXIMUM_SEGMENT_ANGLE_DEGREES,
      contourLiftMeters: TERRAIN_CONTOUR_LIFT_METERS,
      categoryOrder: [...EARTH_GEOMETRY_STYLE.categoryOrder],
      heightOffsetsMeters: { ...EARTH_GEOMETRY_STYLE.heightOffsetsMeters },
      waterLineElevationMeters: 0,
      waterLineReference: 'terrain-source-native-zero',
      aboveWaterColor: EARTH_GEOMETRY_STYLE.colors.terrainAboveWater,
      atOrBelowWaterColor: EARTH_GEOMETRY_STYLE.colors.terrainAtOrBelowWater,
      cachedGridCount: this.#cache.size,
      maximumCachedGrids: this.#maximumCachedGrids,
      maximumActiveGrids: this.#maximumActiveGrids,
      maximumActiveVertices: this.#maximumActiveVertices,
      extractorLimits: TERRAIN_NURBS_LIMITS,
      lastError: this.#lastError,
      ...this.#dynamicTelemetry,
    });
  }

  getTelemetry() { return cloneTelemetry(this.#telemetry); }

  destroy() {
    if (this.#destroyed) return;
    this.#destroyed = true;
    this.#refreshQueued = false;
    this.#renderGeneration += 1;
    this.removeMoveEnd?.();
    this.#removePostRender();
    this.#removeRenderError();
    this.#cache.clear();
    if (terrainHeightSamplers.get(this.#viewer) === this.#sampleHeightCallback) {
      terrainHeightSamplers.delete(this.#viewer);
    }
    if (this.#primitive) {
      this.#viewer.scene.primitives.remove(this.#primitive);
      this.#primitive = null;
    }
  }
}
