import assert from 'node:assert/strict';
import test from 'node:test';

import * as Cesium from 'cesium';

import { EARTH_GEOMETRY_STYLE } from '../src/layers/geometryStyle.js';
import {
  TERRAIN_CONTOUR_LIFT_METERS,
  TerrainNurbsGeometryLayer,
  terrainHeightSamplerForViewer,
} from '../src/layers/terrainGeometry.js';

function createViewer({ onPrimitiveAdd } = {}) {
  const collection = new Cesium.PrimitiveCollection();
  const primitives = {
    add(primitive) {
      const added = collection.add(primitive);
      onPrimitiveAdd?.(primitive);
      return added;
    },
    contains(primitive) { return collection.contains(primitive); },
    remove(primitive) { return collection.remove(primitive); },
    get length() { return collection.length; },
    get(index) { return collection.get(index); },
  };
  return {
    camera: {
      moveEnd: new Cesium.Event(),
      positionCartographic: new Cesium.Cartographic(0, 0, 2_000_000),
      computeViewRectangle: () => Cesium.Rectangle.MAX_VALUE,
    },
    scene: {
      primitives,
      postRender: new Cesium.Event(),
      renderError: new Cesium.Event(),
      requestRenderCount: 0,
      requestRender() { this.requestRenderCount += 1; },
    },
  };
}

function acceptGrid(layer, {
  heights,
  level = 8,
  tilingScheme = new Cesium.GeographicTilingScheme(),
  width = 3,
  height = 3,
  x = 80,
  y = 40,
} = {}) {
  layer.acceptHeightmap({ x, y, level, width, height, heights, tilingScheme });
}

function cartographicPositions(polyline) {
  const packed = polyline.getPositions();
  const result = [];
  for (let index = 0; index < packed.length; index += 3) {
    result.push(Cesium.Cartographic.fromCartesian(new Cesium.Cartesian3(
      packed[index],
      packed[index + 1],
      packed[index + 2],
    )));
  }
  return result;
}

test('publishes exact opaque buffer NURBS contours and waits for a public postRender', async () => {
  const viewer = createViewer();
  const layer = new TerrainNurbsGeometryLayer(Cesium, {
    viewer,
    contourSpacingMeters: 500,
    lineWidthPixels: 2,
  });
  acceptGrid(layer, {
    heights: new Float32Array([
      -1_000, -500, 0,
      -500, 0, 500,
      0, 500, 1_000,
    ]),
  });
  await layer.waitForIdle();

  const collection = layer.primitiveCollection;
  const pending = layer.getTelemetry();
  assert.ok(collection instanceof Cesium.BufferPolylineCollection);
  assert.equal(viewer.scene.primitives.length, 1);
  assert.equal(collection.primitiveCount, pending.activePathCount);
  assert.equal(collection.vertexCount, pending.activeVertexCount);
  assert.equal(pending.renderer, 'actual-cesium-buffer-geometry');
  assert.equal(pending.geometryType, 'cesium-buffer-polyline');
  assert.equal(pending.workerGeometryJobs, 0);
  assert.equal(pending.gpuSubmittedFrame, false);
  assert.equal(pending.renderReady, false);
  assert.equal(pending.linePassesPerPath, 1);
  assert.equal(pending.rasterPainted, false);
  assert.equal(pending.glow, false);
  assert.equal(pending.contourLiftMeters, EARTH_GEOMETRY_STYLE.heightOffsetsMeters.terrainContours);

  const colors = new Set();
  const line = new Cesium.BufferPolyline();
  for (let index = 0; index < collection.primitiveCount; index += 1) {
    collection.get(index, line);
    const material = line.getMaterial(new Cesium.BufferPolylineMaterial());
    const color = material.color.toCssHexString();
    colors.add(color);
    assert.equal(material.color.alpha, 1);
    assert.equal(material.outlineWidth, 0);
    const positions = cartographicPositions(line);
    assert.ok(positions.length >= 2);
    const sourceElevation = positions[0].height - TERRAIN_CONTOUR_LIFT_METERS;
    for (const position of positions) {
      assert.ok(Math.abs((position.height - TERRAIN_CONTOUR_LIFT_METERS) - sourceElevation) < 1e-5);
    }
    const packed = line.getPositions();
    for (let positionIndex = 3; positionIndex < packed.length; positionIndex += 3) {
      const midpoint = new Cesium.Cartesian3(
        (packed[positionIndex - 3] + packed[positionIndex]) / 2,
        (packed[positionIndex - 2] + packed[positionIndex + 1]) / 2,
        (packed[positionIndex - 1] + packed[positionIndex + 2]) / 2,
      );
      assert.ok(
        Cesium.Cartographic.fromCartesian(midpoint).height > sourceElevation,
        'every Cartesian chord midpoint must remain above its constant-elevation terrain contour',
      );
    }
    if (color === EARTH_GEOMETRY_STYLE.colors.terrainAtOrBelowWater) {
      assert.ok(sourceElevation <= 1e-5);
    } else {
      assert.equal(color, EARTH_GEOMETRY_STYLE.colors.terrainAboveWater);
      assert.ok(sourceElevation > 0);
    }
  }
  assert.deepEqual(colors, new Set([
    EARTH_GEOMETRY_STYLE.colors.terrainAtOrBelowWater,
    EARTH_GEOMETRY_STYLE.colors.terrainAboveWater,
  ]));

  viewer.scene.postRender.raiseEvent(viewer.scene);
  assert.equal(layer.getTelemetry().gpuSubmittedFrame, true);
  assert.equal(layer.getTelemetry().renderReady, true);
  layer.dataSource.show = false;
  assert.equal(collection.show, false);
  layer.show = true;
  assert.equal(layer.dataSource.show, true);

  assert.equal(terrainHeightSamplerForViewer(viewer)(-123.3984375, 61.5234375), layer.sampleHeight(-123.3984375, 61.5234375));
  layer.destroy();
  assert.equal(viewer.scene.primitives.length, 0);
  assert.equal(terrainHeightSamplerForViewer(viewer), undefined);
});

test('samples the highest-resolution geographic grid bilinearly at centers and tile edges', async () => {
  const viewer = createViewer();
  const layer = new TerrainNurbsGeometryLayer(Cesium, { viewer });
  const tilingScheme = new Cesium.GeographicTilingScheme();
  acceptGrid(layer, {
    x: 0,
    y: 0,
    level: 0,
    width: 2,
    height: 2,
    tilingScheme,
    heights: new Float32Array([0, 10, 20, 30]),
  });
  assert.equal(layer.sampleHeight(-180, 90), 0);
  assert.equal(layer.sampleHeight(0, -90), 30);
  assert.equal(layer.sampleHeight(-90, 0), 15);
  assert.equal(layer.sampleHeight(90, 0), undefined);
  assert.equal(layer.sampleHeight(Number.NaN, 0), undefined);
  assert.equal(layer.sampleHeight(1e100, 0), undefined);
  assert.equal(layer.sampleHeight(-181, 0), undefined);

  acceptGrid(layer, {
    x: 0,
    y: 0,
    level: 1,
    width: 2,
    height: 2,
    tilingScheme,
    heights: new Float32Array([100, 100, 100, 100]),
  });
  assert.equal(layer.sampleHeight(-135, 45), 100);
  assert.notEqual(layer.sampleHeight(-45, 45), 100);
  await layer.waitForIdle();
  layer.destroy();
});

test('rejects an oversized height grid before admitting it to the cache', () => {
  const viewer = createViewer();
  const layer = new TerrainNurbsGeometryLayer(Cesium, { viewer });
  assert.throws(() => acceptGrid(layer, {
    x: 0,
    y: 0,
    level: 0,
    width: 513,
    height: 512,
    tilingScheme: new Cesium.GeographicTilingScheme(),
    heights: new Float32Array(513 * 512),
  }), /262144-sample cache limit/u);
  assert.equal(layer.getTelemetry().cachedGridCount, 0);
  layer.destroy();
});

test('maps WebMercator latitude through native projection before bilinear sampling', async () => {
  const viewer = createViewer();
  const layer = new TerrainNurbsGeometryLayer(Cesium, { viewer });
  const tilingScheme = new Cesium.WebMercatorTilingScheme();
  acceptGrid(layer, {
    x: 0,
    y: 0,
    level: 0,
    width: 2,
    height: 2,
    tilingScheme,
    heights: new Float32Array([0, 0, 100, 100]),
  });
  const native = tilingScheme.tileXYToNativeRectangle(0, 0, 0);
  const projected = new Cesium.Cartesian3(
    (native.west + native.east) / 2,
    native.north - (native.north - native.south) * 0.25,
    0,
  );
  const cartographic = tilingScheme.projection.unproject(projected);
  const longitude = Cesium.Math.toDegrees(cartographic.longitude);
  const latitude = Cesium.Math.toDegrees(cartographic.latitude);
  assert.ok(Math.abs(layer.sampleHeight(longitude, latitude) - 25) < 1e-9);
  assert.equal(layer.sampleHeight(0, 0), 50);
  await layer.waitForIdle();
  layer.destroy();
});

test('coalesces a heightmap accepted during primitive installation and rebuilds immutable style snapshots', async () => {
  let layer;
  let injected = false;
  const tilingScheme = new Cesium.GeographicTilingScheme();
  const viewer = createViewer({
    onPrimitiveAdd() {
      if (injected) return;
      injected = true;
      acceptGrid(layer, {
        x: 0,
        y: 0,
        level: 2,
        width: 2,
        height: 2,
        tilingScheme,
        heights: new Float32Array([-1_000, 1_000, -1_000, 1_000]),
      });
    },
  });
  layer = new TerrainNurbsGeometryLayer(Cesium, { viewer, contourSpacingMeters: 250 });
  acceptGrid(layer, {
    x: 0,
    y: 0,
    level: 1,
    width: 2,
    height: 2,
    tilingScheme,
    heights: new Float32Array([-500, 500, -500, 500]),
  });
  await layer.waitForIdle();
  assert.equal(layer.getTelemetry().cachedGridCount, 2);
  assert.equal(layer.getTelemetry().selectedLevel, 2);
  assert.equal(viewer.scene.primitives.length, 1);

  const before = layer.primitiveCollection;
  layer.setStyle({ contourSpacingMeters: 500, lineWidthPixels: 3 });
  await layer.waitForIdle();
  assert.notEqual(layer.primitiveCollection, before);
  assert.equal(viewer.scene.primitives.length, 1);
  assert.equal(layer.getTelemetry().contourSpacingMeters, 500);
  assert.equal(layer.getTelemetry().lineWidthPixels, 3);
  assert.equal(layer.getTelemetry().gpuSubmittedFrame, false);
  viewer.scene.postRender.raiseEvent(viewer.scene);
  assert.equal(layer.getTelemetry().gpuSubmittedFrame, true);
  layer.setStyle({ lineWidthPixels: 4 });
  await layer.waitForIdle();
  viewer.scene.renderError.raiseEvent(viewer.scene, new Error('synthetic terrain render failure'));
  assert.equal(layer.getTelemetry().gpuSubmittedFrame, false);
  assert.equal(layer.getTelemetry().renderReady, false);
  assert.equal(layer.getTelemetry().observedSceneRenderError, true);
  assert.equal(layer.getTelemetry().lastError, 'synthetic terrain render failure');
  layer.destroy();
});
