import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertBufferGeometrySupport,
  configureTransparentTerrainGlobe,
  EARTH_GEOMETRY_STYLE,
} from '../src/layers/geometryStyle.js';
import { shortbreadGeometryPresentation } from '../src/layers/shortbreadGeometry.js';

test('freezes one-pass actual-geometry styling and road-over-water ordering', () => {
  assert.equal(EARTH_GEOMETRY_STYLE.renderer, 'cesium-buffer-geometry');
  assert.equal(EARTH_GEOMETRY_STYLE.renderingModel, 'actual-cesium-buffer-geometry');
  assert.equal(EARTH_GEOMETRY_STYLE.coordinateModel, 'explicit-geodetic-heights');
  assert.equal(EARTH_GEOMETRY_STYLE.rasterPainted, false);
  assert.equal(EARTH_GEOMETRY_STYLE.canvasTileCount, 0);
  assert.equal(EARTH_GEOMETRY_STYLE.glow, false);
  assert.equal(EARTH_GEOMETRY_STYLE.bloom, false);
  assert.equal(EARTH_GEOMETRY_STYLE.haloPasses, 0);
  assert.equal(EARTH_GEOMETRY_STYLE.linePassesPerPath, 1);
  assert.equal(EARTH_GEOMETRY_STYLE.lineMaterial, 'solid-unlit-color');
  assert.deepEqual(EARTH_GEOMETRY_STYLE.categoryOrder, [
    'terrain-contour',
    'water-surface',
    'shoreline',
    'shoreline-landline',
    'building-wireframe',
    'global-road',
    'local-road',
  ]);
  assert.ok(EARTH_GEOMETRY_STYLE.heightOffsetsMeters.globalRoads > EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelines);
  assert.ok(EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelineLandlines > EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelines);
  assert.ok(EARTH_GEOMETRY_STYLE.heightOffsetsMeters.buildingWires > EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelineLandlines);
  assert.ok(EARTH_GEOMETRY_STYLE.heightOffsetsMeters.globalRoads > EARTH_GEOMETRY_STYLE.heightOffsetsMeters.waterSurfaces);
  assert.ok(EARTH_GEOMETRY_STYLE.heightOffsetsMeters.localRoads > EARTH_GEOMETRY_STYLE.heightOffsetsMeters.globalRoads);
  assert.equal(EARTH_GEOMETRY_STYLE.roadsTopmost, true);
  assert.equal(EARTH_GEOMETRY_STYLE.colors.shoreline, '#24cfff');
  assert.equal(EARTH_GEOMETRY_STYLE.colors.shorelineLandline, '#33ff73');
});

test('configures a translucent real terrain globe without a painted material', () => {
  const BLACK = Object.freeze({ name: 'black' });
  const scene = {
    globe: {
      material: { type: 'painted-contours' },
      baseColor: null,
      depthTestAgainstTerrain: false,
      translucency: { enabled: false, frontFaceAlpha: 1, backFaceAlpha: 1 },
      undergroundColor: { name: 'old' },
    },
  };
  configureTransparentTerrainGlobe({ Color: { BLACK } }, scene);
  assert.equal(scene.globe.material, undefined);
  assert.equal(scene.globe.baseColor, BLACK);
  assert.equal(scene.globe.depthTestAgainstTerrain, true);
  assert.equal(scene.globe.translucency.enabled, true);
  assert.equal(scene.globe.translucency.frontFaceAlpha, 0.035);
  assert.equal(scene.globe.translucency.backFaceAlpha, 0);
  assert.equal(scene.globe.undergroundColor, undefined);
});

test('fails closed when a pinned Cesium buffer-geometry API is unavailable', () => {
  const supported = {
    BufferPolygonCollection: class {},
    BufferPolygon: class {},
    BufferPolygonMaterial: class {},
    BufferPolylineCollection: class {},
    BufferPolyline: class {},
    BufferPolylineMaterial: class {},
  };
  assert.deepEqual(assertBufferGeometrySupport(supported, { primitives: {} }), {
    polygonCollection: true,
    polygon: true,
    polygonMaterial: true,
    polylineCollection: true,
    polyline: true,
    polylineMaterial: true,
  });
  assert.throws(() => assertBufferGeometrySupport({
    ...supported,
    BufferPolyline: undefined,
  }, { primitives: {} }), (error) => error?.code === 'ERR_EARTH_BUFFER_GEOMETRY_UNSUPPORTED');
});

test('qualifies GPU-presented and valid-empty Shortbread revisions without accepting partial failures', () => {
  const presented = shortbreadGeometryPresentation({
    loaded: 2,
    failed: 0,
    missingDesiredTileCount: 0,
    gpuSubmittedFrame: true,
    gpuPresentedFrame: true,
    renderReady: true,
    readiness: { revision: 7, presentedRevision: 7 },
  });
  assert.deepEqual(presented, {
    status: 'live',
    terminalFailure: false,
    geometryPresented: true,
    settledEmpty: false,
    geometrySettled: true,
    qualifiedRevision: 7,
    presentedRevision: 7,
  });

  const empty = shortbreadGeometryPresentation({
    loaded: 1,
    failed: 0,
    missingDesiredTileCount: 0,
    settledEmpty: true,
    gpuSubmittedFrame: false,
    gpuPresentedFrame: false,
    renderReady: false,
    readiness: { revision: 8, presentedRevision: null },
  });
  assert.equal(empty.status, 'live');
  assert.equal(empty.geometrySettled, true);
  assert.equal(empty.geometryPresented, false);
  assert.equal(empty.qualifiedRevision, 8);
  assert.equal(empty.presentedRevision, null);

  const partialFailure = shortbreadGeometryPresentation({
    loaded: 1,
    failed: 1,
    missingDesiredTileCount: 1,
    settledEmpty: false,
    settledTerminalFailure: true,
    gpuSubmittedFrame: true,
    gpuPresentedFrame: true,
    renderReady: false,
    readiness: { revision: 9, presentedRevision: 9 },
  });
  assert.equal(partialFailure.status, 'unavailable');
  assert.equal(partialFailure.terminalFailure, true);
  assert.equal(partialFailure.geometrySettled, false);
  assert.equal(partialFailure.qualifiedRevision, null);
  assert.equal(partialFailure.presentedRevision, null);
});
