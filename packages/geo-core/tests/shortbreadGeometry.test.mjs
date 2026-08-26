import assert from 'node:assert/strict';
import test from 'node:test';

import * as Cesium from 'cesium';

import { SHORTBREAD_MAXIMUM_FEATURES_PER_TILE } from '../src/vector/shortbread.js';
import {
  createShortbreadBufferTileGeometry,
  loadShortbreadGeometryLayer,
  planShortbreadGeometry,
  projectLonLatToShortbreadTilePixel,
  selectShortbreadGeometryTiles,
  ShortbreadGeometryLayer,
  SHORTBREAD_GEOMETRY_LIMITS,
  SHORTBREAD_GEOMETRY_CATEGORY_ORDER,
  SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS,
  SHORTBREAD_GEOMETRY_STYLE,
  SHORTBREAD_GEOMETRY_Z_INDEX,
  shortbreadTilePixelToLonLat,
} from '../src/vector/shortbreadGeometry.js';

const tileJson = Object.freeze({
  tilejson: '3.0.0',
  name: 'Shortbread',
  minzoom: 0,
  maxzoom: 14,
  tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
  vector_layers: [
    { id: 'ocean' },
    { id: 'water_polygons' },
    { id: 'streets' },
    { id: 'buildings' },
  ],
  attribution: '© OpenStreetMap contributors',
});

function radiansRectangle(west, south, east, north) {
  return Object.freeze({
    west: Cesium.Math.toRadians(west),
    south: Cesium.Math.toRadians(south),
    east: Cesium.Math.toRadians(east),
    north: Cesium.Math.toRadians(north),
  });
}

function geometryCommands(longitude = 0, latitude = 0) {
  return [
    {
      kind: 'road',
      category: 'primary',
      stroke: '#ffe74a',
      width: 3,
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[longitude - 5, latitude + 1], [longitude, latitude + 3], [longitude + 5, latitude + 1]],
          [[longitude - 4, latitude - 2], [longitude + 4, latitude - 2]],
        ],
      },
    },
    {
      kind: 'building',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[
            [longitude - 3, latitude - 3],
            [longitude - 1, latitude - 3],
            [longitude - 1, latitude - 1],
            [longitude - 3, latitude - 3],
          ]],
          [[
            [longitude + 1, latitude - 3],
            [longitude + 3, latitude - 3],
            [longitude + 3, latitude - 1],
            [longitude + 1, latitude - 3],
          ]],
        ],
      },
    },
    {
      kind: 'water',
      category: 'inland-water',
      nurbsOutline: true,
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [longitude - 8, latitude - 8],
              [longitude + 8, latitude - 8],
              [longitude + 8, latitude + 8],
              [longitude - 8, latitude + 8],
              [longitude - 8, latitude - 8],
            ],
            [
              [longitude - 2, latitude - 2],
              [longitude - 2, latitude + 2],
              [longitude + 2, latitude + 2],
              [longitude + 2, latitude - 2],
              [longitude - 2, latitude - 2],
            ],
          ],
          [[
            [longitude + 10, latitude - 6],
            [longitude + 14, latitude - 6],
            [longitude + 14, latitude - 2],
            [longitude + 10, latitude - 2],
            [longitude + 10, latitude - 6],
          ]],
        ],
      },
    },
  ];
}

function roadOnlyCommands(longitude = 0, vertexCount = 2) {
  return [{
    kind: 'road',
    category: 'secondary',
    stroke: '#24eaff',
    width: 2,
    geometry: {
      type: 'LineString',
      coordinates: Array.from({ length: vertexCount }, (_, index) => [longitude + index * 0.01, 10]),
    },
  }];
}

function tileSelection(tiles, requestedZoom = tiles[0]?.z ?? 0) {
  return Object.freeze({
    schemaVersion: 'peercompute.geo.shortbread-tile-selection.v1',
    requestedZoom,
    selectedZoom: tiles[0]?.z ?? 0,
    lodReductions: 0,
    maximumActiveTiles: 24,
    datelineWrapped: false,
    world: false,
    tileCount: tiles.length,
    keys: Object.freeze(tiles.map((tile) => tile.key)),
    tiles: Object.freeze(tiles.map(Object.freeze)),
  });
}

function makeViewer(initialRectangle) {
  let rectangle = initialRectangle;
  const dataSources = [];
  const primitives = [];
  const credits = new Set();
  const moveEnd = new Cesium.Event();
  const postRender = new Cesium.Event();
  const renderError = new Cesium.Event();
  let renderRequests = 0;
  return {
    viewer: {
      dataSources: {
        async add(dataSource) {
          dataSources.push(dataSource);
          return dataSource;
        },
        contains(dataSource) { return dataSources.includes(dataSource); },
        remove(dataSource) {
          const index = dataSources.indexOf(dataSource);
          if (index < 0) return false;
          dataSources.splice(index, 1);
          return true;
        },
      },
      creditDisplay: {
        addStaticCredit(credit) { credits.add(credit); },
        removeStaticCredit(credit) { credits.delete(credit); },
      },
      camera: {
        moveEnd,
        computeViewRectangle() { return rectangle; },
      },
      scene: {
        globe: { ellipsoid: Cesium.Ellipsoid.WGS84 },
        canvas: { clientWidth: 1024, clientHeight: 768 },
        postRender,
        renderError,
        primitives: {
          add(primitive) {
            primitives.push(primitive);
            return primitive;
          },
          contains(primitive) { return primitives.includes(primitive); },
          remove(primitive) {
            const index = primitives.indexOf(primitive);
            if (index < 0) return false;
            primitives.splice(index, 1);
            if (!primitive.isDestroyed?.()) primitive.destroy?.();
            return true;
          },
        },
        requestRender() { renderRequests += 1; },
      },
    },
    dataSources,
    primitives,
    credits,
    moveEnd,
    postRender,
    renderError,
    setRectangle(value) { rectangle = value; },
    get renderRequests() { return renderRequests; },
  };
}

function response(bytes, status = 200, headers = {}) {
  return new Response(Uint8Array.from(bytes), { status, headers });
}

function stubDecode(_bytes, tile) {
  return Object.freeze({ ...tile });
}

function commandsForDecodedTile(decoded) {
  const longitude = decoded.x === 0 ? -90 : 90;
  const latitude = decoded.y === 0 ? 45 : -45;
  return geometryCommands(longitude, latitude);
}

test('geometry decoding uses the shared 25,000-feature hard boundary', async () => {
  assert.equal(
    SHORTBREAD_GEOMETRY_LIMITS.maximumFeaturesPerTile,
    SHORTBREAD_MAXIMUM_FEATURES_PER_TILE,
  );
  const harness = makeViewer(radiansRectangle(-10, -10, 10, 10));
  const oneTile = Object.freeze({ x: 0, y: 0, z: 0, key: '0/0/0' });
  let observedMaximumFeatures = null;
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    fetchImpl: async () => response([1]),
    decodeTile: (_bytes, options) => {
      observedMaximumFeatures = options.maximumFeatures;
      return Object.freeze({ ...options });
    },
    commandsFromTile: () => [],
    tileSelector: () => tileSelection([oneTile]),
  });
  await layer.start();
  await layer.waitForIdle();
  assert.equal(observedMaximumFeatures, SHORTBREAD_MAXIMUM_FEATURES_PER_TILE);
  layer.destroy();
});

test('plans scrambled water, building, and road input in deterministic buffer category order', () => {
  const commands = geometryCommands(0);
  const plan = planShortbreadGeometry(commands, { x: 0, y: 0, z: 0, size: 512 });
  assert.equal(plan.schemaVersion, 'peercompute.geo.shortbread-geometry-plan.v1');
  assert.equal(plan.renderingModel, 'actual-cesium-buffer-geometry');
  assert.equal(plan.renderer, 'cesium-buffer-geometry');
  assert.equal(plan.geometryBackend, 'Cesium.BufferPolygonCollection/Cesium.BufferPolylineCollection');
  assert.deepEqual(plan.categoryOrder, [
    'water-surface', 'shoreline', 'shoreline-landline', 'building-wireframe', 'road',
  ]);
  assert.deepEqual(plan.elevationOffsetsMeters, {
    waterSurface: 0, shoreline: 0.5, landline: 0.75, building: 1, road: 2,
  });
  assert.equal(plan.rasterPainted, false);
  assert.equal(plan.glow, false);
  assert.equal(plan.linePassesPerCurve, 1);
  assert.equal(plan.counts.waterSurfaceCount, 2);
  assert.equal(plan.counts.shorelineCurveCount, 3, 'outer, hole, and second polygon remain separate shoreline curves');
  assert.equal(plan.counts.shorelineLandlineCurveCount, 3);
  assert.equal(plan.counts.buildingWireframeCount, 2);
  assert.equal(plan.counts.roadCurveCount, 2);
  assert.deepEqual(
    plan.descriptors.map(({ kind }) => kind),
    [
      'water-surface',
      'water-surface',
      'shoreline',
      'shoreline',
      'shoreline',
      'shoreline-landline',
      'shoreline-landline',
      'shoreline-landline',
      'building-wireframe',
      'building-wireframe',
      'road',
      'road',
    ],
  );
  assert.ok(plan.descriptors.every((descriptor, index, all) => (
    index === 0 || descriptor.categoryOrderIndex >= all[index - 1].categoryOrderIndex
  )));
  assert.deepEqual(plan.compatibilityZIndex, {
    waterSurface: 10, shoreline: 20, landline: 25, building: 30, road: 40,
  });
  assert.equal(plan.roadPrecedence.independentOfInputOrder, true);
  assert.equal(plan.roadPrecedence.topmost, true);
  const surfaces = plan.descriptors.filter(({ kind }) => kind === 'water-surface');
  const shorelines = plan.descriptors.filter(({ kind }) => kind === 'shoreline');
  const landlines = plan.descriptors.filter(({ kind }) => kind === 'shoreline-landline');
  assert.deepEqual(surfaces.map(({ waterBodyId }) => waterBodyId), ['water-body-000000', 'water-body-000001']);
  assert.deepEqual(
    shorelines.map(({ waterBodyId }) => waterBodyId),
    ['water-body-000000', 'water-body-000000', 'water-body-000001'],
  );
  assert.deepEqual(landlines.map(({ waterBodyId }) => waterBodyId), shorelines.map(({ waterBodyId }) => waterBodyId));
  assert.deepEqual(landlines.map(({ ringRole }) => ringRole), ['outer', 'hole', 'outer']);
  assert.equal(plan.shorelineCompanion.pairedCurveCount, shorelines.length);
  assert.equal(plan.shorelineCompanion.unpairedCurveCount, 0);
});

test('preserves multipart holes and exact source paths with one solid Color pass', () => {
  const commands = geometryCommands(0);
  const sourceRoads = commands[0].geometry.coordinates;
  const plan = planShortbreadGeometry(commands, { x: 0, y: 0, z: 0 });
  const surfaces = plan.descriptors.filter(({ kind }) => kind === 'water-surface');
  assert.equal(surfaces[0].rings.length, 2, 'water hole is a PolygonHierarchy hole, not filled independently');
  assert.equal(surfaces[0].alpha, 0.5);
  assert.equal(surfaces[0].material.type, 'Color');
  assert.equal(surfaces[0].material.alpha, 0.5);
  assert.equal(surfaces[0].clampToGround, undefined);
  assert.equal(surfaces[0].arcType, undefined);
  assert.equal(surfaces[0].elevationOffsetMeters, 0);
  assert.equal(surfaces[0].categoryOrderIndex, 0);

  const shorelines = plan.descriptors.filter(({ kind }) => kind === 'shoreline');
  assert.ok(shorelines.every((line) => line.material.color === '#24cfff'));
  assert.ok(shorelines.every((line) => line.linePassCount === 1 && line.nurbs.degree === 1));
  assert.ok(shorelines.every((line) => line.nurbs.maximumSourceDeviationPixels === 0));
  assert.ok(shorelines.every((line) => line.elevationOffsetMeters === 0.5));

  const landlines = plan.descriptors.filter(({ kind }) => kind === 'shoreline-landline');
  assert.equal(landlines.length, shorelines.length);
  assert.ok(landlines.every((line) => line.material.type === 'Color'));
  assert.ok(landlines.every((line) => line.material.color === '#33ff73'));
  assert.ok(landlines.every((line) => line.linePassCount === 1 && line.nurbs.degree === 1));
  assert.ok(landlines.every((line) => line.categoryOrderIndex === 2));
  assert.ok(landlines.every((line) => line.elevationOffsetMeters === 0.75));
  assert.ok(landlines.every((line, index) => line.sourceShorelineId === shorelines[index].id));
  assert.ok(landlines.some((line, index) => (
    JSON.stringify(line.positions) !== JSON.stringify(shorelines[index].positions)
  )), 'the green companion is distinct offset geometry');

  const buildings = plan.descriptors.filter(({ kind }) => kind === 'building-wireframe');
  assert.ok(buildings.every((line) => line.material.type === 'Color' && line.linePassCount === 1));
  assert.ok(buildings.every((line) => line.categoryOrderIndex === 3));
  assert.ok(buildings.every((line) => line.elevationOffsetMeters === 1));

  const roads = plan.descriptors.filter(({ kind }) => kind === 'road');
  assert.deepEqual(roads.map(({ positions }) => positions), sourceRoads);
  assert.ok(roads.every((line) => line.nurbs.degree === 1));
  assert.ok(roads.every((line) => line.nurbs.maximumSourceDeviationDegrees === 0));
  assert.ok(roads.every((line) => line.material.type === 'Color' && line.linePassCount === 1));
  assert.ok(roads.every((line) => line.categoryOrderIndex === 4));
  assert.ok(roads.every((line) => line.elevationOffsetMeters === 2));

  const serialized = JSON.stringify(plan);
  assert.doesNotMatch(serialized, /PolylineGlow|depthFail|shadowBlur|painted-texture/iu);
  assert.equal(plan.shorelineCompanion.halo, false);
  assert.equal(SHORTBREAD_GEOMETRY_STYLE.rasterPainted, false);
  assert.equal(SHORTBREAD_GEOMETRY_STYLE.glow, false);
  assert.equal(SHORTBREAD_GEOMETRY_STYLE.bloom, false);
  assert.equal(SHORTBREAD_GEOMETRY_STYLE.duplicateLinePass, false);
  assert.equal(SHORTBREAD_GEOMETRY_Z_INDEX.road, 40);
  assert.deepEqual(SHORTBREAD_GEOMETRY_CATEGORY_ORDER, plan.categoryOrder);
  assert.deepEqual(SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS, plan.elevationOffsetsMeters);
});

test('defers broad-view commands below the configured detail zoom without allocating geometry', () => {
  const commands = geometryCommands(0);
  const plan = planShortbreadGeometry(commands, { x: 0, y: 0, z: 0 }, {
    minimumGeometryZoom: 5,
  });
  assert.deepEqual(plan.descriptors, []);
  assert.equal(plan.deferral.active, true);
  assert.equal(plan.deferral.minimumGeometryZoom, 5);
  assert.equal(plan.deferral.tileZoom, 0);
  assert.equal(plan.counts.commandCount, commands.length);
  assert.equal(plan.counts.deferredCommandCount, commands.length);
  assert.equal(plan.counts.deferredWaterCommandCount, 1);
  assert.ok(plan.counts.deferredSourcePositionCount > 0);
  assert.equal(plan.counts.entityCount, 0);
  assert.equal(plan.waterNurbs.curveCount, 0);

  const geometry = createShortbreadBufferTileGeometry(Cesium, plan);
  assert.equal(geometry.primitiveCount, 0);
  assert.equal(geometry.vertexCount, 0);
  geometry.destroy();
});

test('round-trips tile pixels and suppresses synthetic tile-edge shoreline segments', () => {
  const tile = { x: 0, y: 0, z: 0, size: 512 };
  const coordinate = [-149.9, 61.2];
  const pixel = projectLonLatToShortbreadTilePixel(coordinate, tile);
  const roundTrip = shortbreadTilePixelToLonLat(pixel, tile);
  assert.ok(Math.abs(roundTrip[0] - coordinate[0]) < 1e-10);
  assert.ok(Math.abs(roundTrip[1] - coordinate[1]) < 1e-10);

  const plan = planShortbreadGeometry([{
    kind: 'water',
    category: 'ocean',
    nurbsOutline: true,
    geometry: {
      type: 'Polygon',
      coordinates: [[[-180, 10], [-120, 10], [-120, -10], [-180, -10], [-180, 10]]],
    },
  }], tile);
  assert.equal(plan.waterNurbs.suppressedBoundarySegmentCount, 1);
  assert.equal(plan.counts.shorelineCurveCount, 1);
  assert.equal(plan.descriptors.find(({ kind }) => kind === 'shoreline').nurbs.closed, false);
});

test('rejects invalid topology, feature overflow, and vertex overflow before returning a partial plan', () => {
  assert.throws(() => planShortbreadGeometry([{
    kind: 'road',
    geometry: { type: 'LineString', coordinates: [[0, 0], [Number.NaN, 1]] },
  }], { x: 0, y: 0, z: 0 }), (error) => error?.code === 'ERR_SHORTBREAD_GEOMETRY_INVALID_COORDINATE');
  assert.throws(() => planShortbreadGeometry(roadOnlyCommands(0), { x: 0, y: 0, z: 0 }, {
    maximumFeaturesPerTile: 1,
    maximumVertices: 1,
  }), (error) => error?.code === 'ERR_SHORTBREAD_GEOMETRY_VERTEX_CAP');
  assert.throws(() => planShortbreadGeometry([
    ...roadOnlyCommands(0),
    ...roadOnlyCommands(1),
  ], { x: 0, y: 0, z: 0 }, {
    maximumFeaturesPerTile: 1,
  }), (error) => error?.code === 'ERR_SHORTBREAD_GEOMETRY_FEATURE_CAP');
  assert.throws(() => planShortbreadGeometry(geometryCommands(0), { x: 0, y: 0, z: 0 }, {
    landlineLimits: { maximumOutputControlPoints: 1 },
  }), (error) => error?.code === 'ERR_SHORTBREAD_LANDLINE_CONTROL_POINT_CAP');
  assert.throws(() => planShortbreadGeometry(geometryCommands(0), { x: 0, y: 0, z: 0 }, {
    landlineLimits: { maximumOperations: 1 },
  }), (error) => error?.code === 'ERR_SHORTBREAD_LANDLINE_OPERATION_CAP');
});

test('rejects pathological polygon source topology before Cesium triangulation', () => {
  const plan = planShortbreadGeometry(geometryCommands(0), { x: 0, y: 0, z: 0 });
  assert.throws(() => createShortbreadBufferTileGeometry(Cesium, plan, {
    maximumPolygonSourceRingsPerSurface: 1,
  }), (error) => error?.code === 'ERR_SHORTBREAD_BUFFER_POLYGON_SOURCE_TOPOLOGY_CAP');
});

test('selects world and dateline views deterministically and reduces LOD before allocation', () => {
  const world = selectShortbreadGeometryTiles(
    { west: -Math.PI, south: -Math.PI / 2, east: Math.PI, north: Math.PI / 2 },
    { targetZoom: 14, maximumActiveTiles: 24 },
  );
  assert.ok(world.tileCount <= 24);
  assert.ok(world.selectedZoom < world.requestedZoom);
  assert.equal(world.world, true);
  assert.deepEqual(world.keys, world.tiles.map(({ key }) => key));
  assert.equal(new Set(world.keys).size, world.keys.length);

  const dateline = selectShortbreadGeometryTiles(
    radiansRectangle(170, -10, -170, 10),
    { targetZoom: 3, maximumActiveTiles: 24 },
  );
  assert.equal(dateline.datelineWrapped, true);
  assert.equal(dateline.selectedZoom, 3);
  assert.ok(dateline.tiles.some(({ x }) => x === 0));
  assert.ok(dateline.tiles.some(({ x }) => x === 7));
  assert.ok(dateline.tileCount <= 24);
  assert.throws(() => selectShortbreadGeometryTiles(
    { west: -Math.PI, south: -Math.PI / 2, east: Math.PI, north: Math.PI / 2 },
    { minimumZoom: 5, maximumZoom: 5, maximumActiveTiles: 1 },
  ), (error) => error?.code === 'ERR_SHORTBREAD_ACTIVE_TILE_CAP');
});

test('builds exact-capacity Cesium buffer collections with holes, solid materials, and sampled offsets', () => {
  const plan = planShortbreadGeometry(geometryCommands(0), { x: 0, y: 0, z: 0 });
  const resolverCalls = [];
  const tileGeometry = createShortbreadBufferTileGeometry(Cesium, plan, {
    heightResolver(longitude, latitude, descriptor) {
      resolverCalls.push([longitude, latitude, descriptor.kind]);
      if (descriptor.kind === 'road' && longitude > 0) return undefined;
      return 100;
    },
  });
  assert.equal(tileGeometry.collectionCount, 5);
  assert.equal(tileGeometry.primitiveCount, plan.counts.entityCount);
  assert.deepEqual(tileGeometry.categories.map(({ kind }) => kind), SHORTBREAD_GEOMETRY_CATEGORY_ORDER);
  assert.deepEqual(
    tileGeometry.categories.map(({ elevationOffsetMeters }) => elevationOffsetMeters),
    [0, 0.5, 0.75, 1, 2],
  );

  const water = tileGeometry.getCategory('water-surface');
  assert.ok(water.collection instanceof Cesium.BufferPolygonCollection);
  assert.equal(water.collection.primitiveCountMax, water.primitiveCount);
  assert.equal(water.collection.vertexCountMax, water.vertexCount);
  assert.equal(water.collection.holeCount, 0, 'Cesium PolygonGeometry resolves source holes into mesh indices');
  assert.equal(plan.descriptors.find(({ kind }) => kind === 'water-surface').rings.length, 2);
  assert.equal(water.allowPicking, false);
  assert.equal(water.blend, 'translucent');
  const waterPolygon = water.collection.get(0, new Cesium.BufferPolygon());
  assert.ok(waterPolygon.triangleCount > 2, 'the water interior is synchronously surface-tessellated');
  const waterMaterial = waterPolygon.getMaterial(new Cesium.BufferPolygonMaterial());
  assert.ok(Math.abs(waterMaterial.color.alpha - 0.5) <= 1 / 255);
  assert.equal(waterMaterial.outlineWidth, 0);
  const waterPosition = Cesium.Cartesian3.unpack(waterPolygon.getPositions(), 0, new Cesium.Cartesian3());
  assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(waterPosition).height - 100) < 1e-5);
  const waterHeights = [];
  const waterPositions = waterPolygon.getPositions();
  for (let offset = 0; offset < waterPositions.length; offset += 3) {
    const position = Cesium.Cartesian3.unpack(waterPositions, offset, new Cesium.Cartesian3());
    waterHeights.push(Cesium.Ellipsoid.WGS84.cartesianToCartographic(position).height);
  }
  assert.ok(Math.max(...waterHeights) - Math.min(...waterHeights) < 1e-5, 'inland water is flat per body');

  const shoreline = tileGeometry.getCategory('shoreline');
  const shorelineLine = shoreline.collection.get(0, new Cesium.BufferPolyline());
  const shorelinePosition = Cesium.Cartesian3.unpack(
    shorelineLine.getPositions(), 0, new Cesium.Cartesian3(),
  );
  assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(shorelinePosition).height - 100.5) < 1e-5);

  const landline = tileGeometry.getCategory('shoreline-landline');
  assert.ok(landline.collection instanceof Cesium.BufferPolylineCollection);
  assert.equal(landline.collection.primitiveCountMax, landline.primitiveCount);
  assert.equal(landline.collection.vertexCountMax, landline.vertexCount);
  assert.equal(landline.allowPicking, false);
  assert.equal(landline.blend, 'opaque');
  assert.equal(landline.linePassCount, 1);
  const landlineLine = landline.collection.get(0, new Cesium.BufferPolyline());
  const landlineMaterial = landlineLine.getMaterial(new Cesium.BufferPolylineMaterial());
  assert.equal(landlineMaterial.color.toCssColorString(), 'rgb(51,255,115)');
  assert.equal(landlineMaterial.outlineWidth, 0);
  const landlinePosition = Cesium.Cartesian3.unpack(
    landlineLine.getPositions(), 0, new Cesium.Cartesian3(),
  );
  assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(landlinePosition).height - 100.75) < 1e-5);
  assert.notDeepEqual(
    Array.from(landlineLine.getPositions().slice(0, 6)),
    Array.from(shorelineLine.getPositions().slice(0, 6)),
    'landline occupies its own laterally offset Cartesian geometry',
  );

  const road = tileGeometry.getCategory('road');
  assert.ok(road.collection instanceof Cesium.BufferPolylineCollection);
  assert.equal(road.collection.primitiveCountMax, road.primitiveCount);
  assert.equal(road.collection.vertexCountMax, road.vertexCount);
  assert.equal(road.allowPicking, false);
  assert.equal(road.blend, 'opaque');
  assert.equal(road.linePassCount, 1);
  const roadLine = road.collection.get(0, new Cesium.BufferPolyline());
  const roadMaterial = roadLine.getMaterial(new Cesium.BufferPolylineMaterial());
  assert.equal(roadMaterial.color.alpha, 1);
  assert.equal(roadMaterial.outlineWidth, 0);
  const roadPosition = Cesium.Cartesian3.unpack(roadLine.getPositions(), 0, new Cesium.Cartesian3());
  assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(roadPosition).height - 102) < 1e-5);
  const roadHeights = [];
  const roadPositions = roadLine.getPositions();
  for (let offset = 0; offset < roadPositions.length; offset += 3) {
    const position = Cesium.Cartesian3.unpack(roadPositions, offset, new Cesium.Cartesian3());
    roadHeights.push(Cesium.Ellipsoid.WGS84.cartesianToCartographic(position).height);
  }
  assert.ok(Math.min(...roadHeights) >= 102 - 1e-5, 'roads crossing elevated water stay above its flat level');
  assert.ok(resolverCalls.length > 0);
  assert.ok(resolverCalls.every(([, , kind]) => (
    ['water-surface', 'shoreline-landline', 'building-wireframe', 'road'].includes(kind)
  )));
  assert.ok(resolverCalls.some(([, , kind]) => kind === 'shoreline-landline'));
  assert.ok(tileGeometry.heightResolution.waterLevelCoordinateCount > 0);
  assert.ok(tileGeometry.heightResolution.resolvedTerrainCoordinateCount > 0);
  assert.ok(tileGeometry.heightResolution.unresolvedFallbackCoordinateCount > 0);
  assert.equal(tileGeometry.heightResolution.derivedInlandWaterBodyCount, 2);
  assert.equal(tileGeometry.heightResolution.fallbackInlandWaterBodyCount, 0);
  assert.equal(tileGeometry.heightResolution.unmatchedShorelineCount, 0);
  assert.equal(tileGeometry.heightResolution.unmatchedLandlineCount, 0);
  assert.ok(tileGeometry.heightResolution.landlineTerrainResolvedCoordinateCount > 0);
  assert.ok(tileGeometry.heightResolution.waterLevelClampedRoadCoordinateCount > 0);

  tileGeometry.destroy();
  assert.equal(tileGeometry.isDestroyed(), true);

  let oceanResolverCalls = 0;
  const oceanPlan = planShortbreadGeometry([{
    kind: 'water',
    category: 'ocean',
    nurbsOutline: true,
    geometry: { type: 'Polygon', coordinates: [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]] },
  }], { x: 0, y: 0, z: 0 });
  const oceanGeometry = createShortbreadBufferTileGeometry(Cesium, oceanPlan, {
    heightResolver() {
      oceanResolverCalls += 1;
      return 500;
    },
  });
  const oceanPolygon = oceanGeometry.getCategory('water-surface').collection.get(0, new Cesium.BufferPolygon());
  const oceanPosition = Cesium.Cartesian3.unpack(oceanPolygon.getPositions(), 0, new Cesium.Cartesian3());
  assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(oceanPosition).height) < 1e-5);
  const oceanShoreline = oceanGeometry.getCategory('shoreline').collection.get(0, new Cesium.BufferPolyline());
  const oceanShorePosition = Cesium.Cartesian3.unpack(oceanShoreline.getPositions(), 0, new Cesium.Cartesian3());
  assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(oceanShorePosition).height - 0.5) < 1e-5);
  const oceanLandline = oceanGeometry.getCategory('shoreline-landline').collection.get(
    0,
    new Cesium.BufferPolyline(),
  );
  const oceanLandPosition = Cesium.Cartesian3.unpack(
    oceanLandline.getPositions(), 0, new Cesium.Cartesian3(),
  );
  assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(oceanLandPosition).height - 500.75) < 1e-5);
  assert.ok(oceanResolverCalls > 0, 'the land-side companion samples terrain even when ocean water stays at zero');
  assert.equal(oceanGeometry.heightResolution.oceanWaterBodyCount, 1);
  oceanGeometry.destroy();

  const crossingPlan = planShortbreadGeometry([
    {
      kind: 'water',
      category: 'inland-water',
      nurbsOutline: true,
      geometry: { type: 'Polygon', coordinates: [[[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]]] },
    },
    {
      kind: 'road',
      category: 'primary',
      stroke: '#ffffff',
      width: 2,
      geometry: { type: 'LineString', coordinates: [[-2, 0], [2, 0]] },
    },
  ], { x: 0, y: 0, z: 0 });
  const crossingGeometry = createShortbreadBufferTileGeometry(Cesium, crossingPlan, {
    heightResolver(_longitude, _latitude, descriptor) {
      return descriptor.kind === 'water-surface' ? 100 : 50;
    },
  });
  const crossingLine = crossingGeometry.getCategory('road').collection.get(0, new Cesium.BufferPolyline());
  const crossingPositions = crossingLine.getPositions();
  assert.ok(crossingLine.vertexCount > 2, 'long source segments are boundedly RHUMB-tessellated');
  const roadMidpointHeights = [];
  for (let offset = 0; offset < crossingPositions.length; offset += 3) {
    const position = Cesium.Cartesian3.unpack(crossingPositions, offset, new Cesium.Cartesian3());
    assert.ok(Math.abs(Cesium.Ellipsoid.WGS84.cartesianToCartographic(position).height - 102) < 1e-5);
    if (offset + 3 < crossingPositions.length) {
      const next = Cesium.Cartesian3.unpack(crossingPositions, offset + 3, new Cesium.Cartesian3());
      const midpoint = Cesium.Cartesian3.midpoint(position, next, new Cesium.Cartesian3());
      roadMidpointHeights.push(Cesium.Ellipsoid.WGS84.cartesianToCartographic(midpoint).height);
    }
  }
  const crossingWater = crossingGeometry.getCategory('water-surface').collection.get(
    0,
    new Cesium.BufferPolygon(),
  );
  assert.ok(crossingWater.vertexCount > 4, 'water polygon interiors are surface-tessellated');
  const crossingWaterPositions = crossingWater.getPositions();
  const crossingWaterTriangles = crossingWater.getTriangles();
  const waterTriangleCentroidHeights = [];
  for (let index = 0; index < crossingWaterTriangles.length; index += 3) {
    const left = Cesium.Cartesian3.unpack(
      crossingWaterPositions,
      crossingWaterTriangles[index] * 3,
      new Cesium.Cartesian3(),
    );
    const middle = Cesium.Cartesian3.unpack(
      crossingWaterPositions,
      crossingWaterTriangles[index + 1] * 3,
      new Cesium.Cartesian3(),
    );
    const right = Cesium.Cartesian3.unpack(
      crossingWaterPositions,
      crossingWaterTriangles[index + 2] * 3,
      new Cesium.Cartesian3(),
    );
    const centroid = new Cesium.Cartesian3(
      (left.x + middle.x + right.x) / 3,
      (left.y + middle.y + right.y) / 3,
      (left.z + middle.z + right.z) / 3,
    );
    waterTriangleCentroidHeights.push(
      Cesium.Ellipsoid.WGS84.cartesianToCartographic(centroid).height,
    );
  }
  assert.ok(
    Math.min(...roadMidpointHeights) > Math.max(...waterTriangleCentroidHeights),
    'rendered road chords remain physically above rendered water triangles',
  );
  assert.ok(crossingGeometry.heightResolution.waterLevelClampedRoadCoordinateCount > 2);
  assert.ok(crossingGeometry.heightResolution.tessellatedPolylineCoordinateCount > 2);
  assert.ok(crossingGeometry.heightResolution.tessellatedPolygonCoordinateCount > 4);
  assert.ok(crossingGeometry.heightResolution.waterRoadIntersectionTestCount > 0);
  const crossingLandline = crossingGeometry.getCategory('shoreline-landline').collection.get(
    0,
    new Cesium.BufferPolyline(),
  );
  for (let offset = 0; offset < crossingLandline.getPositions().length; offset += 3) {
    const position = Cesium.Cartesian3.unpack(
      crossingLandline.getPositions(), offset, new Cesium.Cartesian3(),
    );
    assert.ok(
      Cesium.Ellipsoid.WGS84.cartesianToCartographic(position).height >= 100.75 - 1e-5,
      'land-side companion terrain is clamped to at least its paired flat water level',
    );
  }
  assert.ok(crossingGeometry.heightResolution.landlineWaterLevelClampedCoordinateCount > 0);
  assert.throws(() => createShortbreadBufferTileGeometry(Cesium, crossingPlan, {
    heightResolver(_longitude, _latitude, descriptor) {
      return descriptor.kind === 'water-surface' ? 100 : 50;
    },
    maximumVertices: 10,
  }), (error) => error?.code === 'ERR_SHORTBREAD_BUFFER_VERTEX_CAP');
  assert.throws(() => createShortbreadBufferTileGeometry(Cesium, crossingPlan, {
    heightResolver: () => 100,
    maximumWaterRoadIntersectionTestsPerTile: 1,
  }), (error) => error?.code === 'ERR_SHORTBREAD_WATER_ROAD_INTERSECTION_CAP');
  assert.throws(() => createShortbreadBufferTileGeometry(Cesium, crossingPlan, {
    heightResolver: () => 100,
    categoryElevationOffsetsMeters: {
      waterSurface: 0, shoreline: 0.5, landline: 0.75, building: 1, road: 0,
    },
  }), /strictly preserve/u);
  assert.throws(() => createShortbreadBufferTileGeometry(Cesium, crossingPlan, {
    heightResolver: () => 100,
    categoryElevationOffsetsMeters: {
      waterSurface: 0,
      shoreline: 0.000001,
      landline: 0.000002,
      building: 0.000003,
      road: 0.000004,
    },
  }), (error) => error?.code === 'ERR_SHORTBREAD_ROAD_WATER_CLEARANCE');
  assert.throws(() => createShortbreadBufferTileGeometry(Cesium, crossingPlan, {
    heightResolver: () => 100_001,
  }), (error) => error?.code === 'ERR_SHORTBREAD_INVALID_RESOLVED_HEIGHT');
  crossingGeometry.destroy();
});

test('samples active flat water through a bounded antimeridian-safe tile/grid index', async () => {
  const harness = makeViewer(radiansRectangle(170, -10, -170, 10));
  const oneTile = Object.freeze({ x: 0, y: 0, z: 0, key: '0/0/0' });
  const datelineWater = [{
    kind: 'water',
    category: 'inland-water',
    nurbsOutline: false,
    geometry: {
      type: 'Polygon',
      coordinates: [[[179, -2], [-179, -2], [-179, 2], [179, 2], [179, -2]]],
    },
  }];
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: () => datelineWater,
    tileSelector: () => tileSelection([oneTile]),
    heightResolver: () => 250,
  });
  await layer.start();
  await layer.waitForIdle();
  assert.equal(layer.sampleWaterSurfaceHeight(180, 0), 250);
  assert.equal(layer.sampleWaterSurfaceHeight(-180, 0), 250);
  assert.equal(layer.sampleWaterSurfaceHeight(0, 0), undefined);
  assert.equal(layer.sampleMaximumWaterSurfaceHeightAlongSegment(178, 0, -178, 0), 250);
  assert.equal(layer.sampleMaximumWaterSurfaceHeightAlongSegment(170, 5, -170, 5), undefined);
  const telemetry = layer.getTelemetry();
  assert.equal(telemetry.waterSurfaceSampling.antimeridianSafe, true);
  assert.equal(telemetry.waterSurfaceSampling.hitCount, 2);
  assert.equal(telemetry.waterSurfaceSampling.missCount, 1);
  assert.ok(telemetry.waterSurfaceSampling.intersectionTestCount > 0);
  assert.equal(telemetry.waterSegmentSampling.antimeridianSafe, true);
  assert.equal(telemetry.waterSegmentSampling.callCount, 2);
  assert.equal(telemetry.waterSegmentSampling.hitCount, 1);
  assert.equal(telemetry.waterSegmentSampling.missCount, 1);
  assert.ok(telemetry.waterSegmentSampling.intersectionTestCount > 0);
  assert.equal(
    telemetry.waterSamplingBudget.intersectionTestCount,
    telemetry.waterSurfaceSampling.intersectionTestCount
      + telemetry.waterSegmentSampling.intersectionTestCount,
  );
  layer.destroy();
  assert.throws(() => layer.sampleWaterSurfaceHeight(180, 0), /destroyed/u);
  assert.throws(
    () => layer.sampleMaximumWaterSurfaceHeightAlongSegment(178, 0, -178, 0),
    /destroyed/u,
  );

  const capHarness = makeViewer(radiansRectangle(170, -10, -170, 10));
  const capLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: capHarness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    maximumWaterSampleIntersectionTestsPerQuery: 1,
    maximumWaterSegmentIntersectionTestsPerCall: 1,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: () => datelineWater,
    tileSelector: () => tileSelection([oneTile]),
    heightResolver: () => 250,
  });
  await capLayer.start();
  await capLayer.waitForIdle();
  assert.throws(
    () => capLayer.sampleWaterSurfaceHeight(180, 0),
    (error) => error?.code === 'ERR_SHORTBREAD_WATER_SAMPLE_INTERSECTION_CAP',
  );
  assert.equal(capLayer.getTelemetry().waterSurfaceSampling.capRejectedCount, 1);
  assert.equal(capLayer.getTelemetry().lastErrorCode, 'ERR_SHORTBREAD_WATER_SAMPLE_INTERSECTION_CAP');
  assert.throws(
    () => capLayer.sampleMaximumWaterSurfaceHeightAlongSegment(178, 0, -178, 0),
    (error) => error?.code === 'ERR_SHORTBREAD_WATER_SEGMENT_INTERSECTION_CAP',
  );
  assert.equal(capLayer.getTelemetry().waterSegmentSampling.capRejectedCount, 1);
  assert.equal(capLayer.getTelemetry().lastErrorCode, 'ERR_SHORTBREAD_WATER_SEGMENT_INTERSECTION_CAP');
  capLayer.destroy();

  const lifetimeHarness = makeViewer(radiansRectangle(170, -10, -170, 10));
  const lifetimeLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: lifetimeHarness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    maximumWaterSampleIntersectionTestsLifetime: 1,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: () => datelineWater,
    tileSelector: () => tileSelection([oneTile]),
    heightResolver: () => 250,
  });
  await lifetimeLayer.start();
  await lifetimeLayer.waitForIdle();
  assert.throws(
    () => lifetimeLayer.sampleMaximumWaterSurfaceHeightAlongSegment(178, 0, -178, 0),
    (error) => error?.code === 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP',
  );
  assert.equal(lifetimeLayer.getTelemetry().waterSegmentSampling.lifetimeCapRejectedCount, 1);
  assert.equal(lifetimeLayer.getTelemetry().waterSamplingBudget.remainingIntersectionTestsLifetime, 0);
  lifetimeLayer.destroy();
});

test('segment sampler detects narrow elevated water wholly between dry road endpoints and returns the maximum hit', async () => {
  const harness = makeViewer(radiansRectangle(-5, -5, 5, 5));
  const oneTile = Object.freeze({ x: 0, y: 0, z: 0, key: '0/0/0' });
  const waters = [
    {
      kind: 'water',
      category: 'inland-water',
      nurbsOutline: false,
      geometry: {
        type: 'Polygon',
        coordinates: [[[-0.1, -0.2], [0.1, -0.2], [0.1, 0.2], [-0.1, 0.2], [-0.1, -0.2]]],
      },
    },
    {
      kind: 'water',
      category: 'inland-water',
      nurbsOutline: false,
      geometry: {
        type: 'Polygon',
        coordinates: [[[0.5, -0.2], [0.7, -0.2], [0.7, 0.2], [0.5, 0.2], [0.5, -0.2]]],
      },
    },
  ];
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: () => waters,
    tileSelector: () => tileSelection([oneTile]),
    heightResolver(_longitude, _latitude, descriptor) {
      return descriptor.id === 'water-surface-000001' ? 700 : 500;
    },
  });
  await layer.start();
  await layer.waitForIdle();
  assert.equal(layer.sampleWaterSurfaceHeight(-1, 0), undefined);
  assert.equal(layer.sampleWaterSurfaceHeight(1, 0), undefined);
  assert.equal(layer.sampleMaximumWaterSurfaceHeightAlongSegment(-1, 0, 1, 0), 700);
  assert.equal(layer.sampleMaximumWaterSurfaceHeightAlongSegment(-1, 1, 1, 1), undefined);
  const telemetry = layer.getTelemetry();
  assert.equal(telemetry.waterSegmentSampling.hitCount, 1);
  assert.equal(telemetry.waterSegmentSampling.missCount, 1);
  assert.equal(telemetry.waterSegmentSampling.returnValue,
    'highest-intersected-visible-water-surface-height-or-undefined');
  layer.destroy();
});

test('camera lifecycle submits ordered buffers, confirms postRender, reuses LRU plans, and keeps roads topmost', async () => {
  const harness = makeViewer(radiansRectangle(-120, 35, -100, 55));
  const requestedUrls = [];
  let terrainHeight = 100;
  let latestTelemetry = null;
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    targetZoom: 1,
    maximumActiveTiles: 1,
    maximumCachedTiles: 2,
    maximumConcurrentRequests: 1,
    fetchImpl: async (url) => {
      requestedUrls.push(String(url));
      return response([1, 2, 3]);
    },
    decodeTile: stubDecode,
    commandsFromTile: commandsForDecodedTile,
    heightResolver: () => terrainHeight,
    onTelemetry: (telemetry) => { latestTelemetry = telemetry; },
  });
  await layer.start();
  await layer.waitForIdle();
  assert.equal(harness.dataSources.length, 0);
  assert.equal(harness.primitives.length, 1);
  assert.equal(harness.credits.size, 1);
  assert.equal(requestedUrls.length, 1);

  const tileGeometry = layer.scenePrimitive.orderedTiles[0];
  assert.equal(tileGeometry.primitiveCount, 12);
  assert.ok(tileGeometry.getCategory('water-surface').collection instanceof Cesium.BufferPolygonCollection);
  assert.ok(tileGeometry.getCategory('road').collection instanceof Cesium.BufferPolylineCollection);
  const submissionOrder = [];
  for (const category of tileGeometry.categories) {
    category.collection.update = () => submissionOrder.push(category.kind);
  }
  layer.scenePrimitive.update({});
  assert.deepEqual(submissionOrder, SHORTBREAD_GEOMETRY_CATEGORY_ORDER);
  assert.equal(layer.getTelemetry().gpuSubmittedFrame, true);
  assert.equal(layer.getTelemetry().gpuPresentedFrame, false);
  harness.postRender.raiseEvent();

  const firstTelemetry = layer.getTelemetry();
  assert.equal(firstTelemetry.renderingModel, 'actual-cesium-buffer-geometry');
  assert.equal(firstTelemetry.renderer, 'cesium-buffer-geometry');
  assert.equal(firstTelemetry.clampToGround, false);
  assert.equal(firstTelemetry.workerGeometryJobs, 0);
  assert.equal(firstTelemetry.groundWorkerQueue, false);
  assert.equal(firstTelemetry.cpuGeometryValidated, true);
  assert.equal(firstTelemetry.gpuSubmittedFrame, true);
  assert.equal(firstTelemetry.gpuPresentedFrame, true);
  assert.equal(firstTelemetry.ready, true);
  assert.equal(firstTelemetry.readiness.bufferCountsExact, true);
  assert.equal(firstTelemetry.postRenderCount, 1);
  assert.equal(firstTelemetry.rasterPainted, false);
  assert.equal(firstTelemetry.canvasCount, 0);
  assert.equal(firstTelemetry.imageryLayerCount, 0);
  assert.equal(firstTelemetry.glow, false);
  assert.equal(firstTelemetry.duplicateLinePass, false);
  assert.equal(firstTelemetry.linePassesPerCurve, 1);
  assert.equal(firstTelemetry.roadsTopmost, true);
  assert.equal(firstTelemetry.roadWaterClearanceMeters, 2);
  assert.ok(firstTelemetry.minimumRoadWaterClearanceMeters > 0);
  assert.deepEqual(firstTelemetry.categoryOrder, SHORTBREAD_GEOMETRY_CATEGORY_ORDER);
  assert.deepEqual(firstTelemetry.categoryElevationOffsetsMeters, {
    waterSurface: 0, shoreline: 0.5, landline: 0.75, building: 1, road: 2,
  });
  assert.equal(firstTelemetry.geometry.tileCount, 1);
  assert.equal(firstTelemetry.geometry.cesiumEntityCount, 0);
  assert.equal(firstTelemetry.geometry.bufferCollectionCount, 5);
  assert.equal(firstTelemetry.geometry.bufferPrimitiveCount, 12);
  assert.equal(firstTelemetry.geometry.bufferPolygonCount, 2);
  assert.equal(firstTelemetry.geometry.bufferPolylineCount, 10);
  assert.equal(firstTelemetry.geometry.waterSurfaceCount, 2);
  assert.equal(firstTelemetry.geometry.shorelineCurveCount, 3);
  assert.equal(firstTelemetry.geometry.shorelineLandlineCurveCount, 3);
  assert.equal(firstTelemetry.geometry.buildingWireframeCount, 2);
  assert.equal(firstTelemetry.geometry.roadCurveCount, 2);
  assert.equal(firstTelemetry.waterNurbs.curveCount, 3);
  assert.equal(firstTelemetry.waterNurbs.companionCurveCount, 3);
  assert.equal(firstTelemetry.shorelineCompanion.kind, 'shoreline-landline');
  assert.equal(firstTelemetry.shorelineCompanion.geometry, 'distinct-actual-cesium-buffer-polyline');
  assert.equal(firstTelemetry.shorelineCompanion.color, '#33ff73');
  assert.equal(firstTelemetry.shorelineCompanion.curveCount, 3);
  assert.equal(firstTelemetry.shorelineCompanion.pairedCurveCount, 3);
  assert.equal(firstTelemetry.shorelineCompanion.unpairedCurveCount, 0);
  assert.equal(firstTelemetry.shorelineCompanion.pairInvariantSatisfied, true);
  assert.equal(firstTelemetry.shorelineCompanion.rasterPainted, false);
  assert.equal(firstTelemetry.shorelineCompanion.glow, false);
  assert.equal(firstTelemetry.shorelineCompanion.halo, false);
  assert.equal(firstTelemetry.shorelineCompanion.linePassesPerCurve, 1);
  assert.equal(
    firstTelemetry.shorelineCompanion.maximumOutputControlPointsPerTile,
    SHORTBREAD_GEOMETRY_LIMITS.maximumLandlineOutputControlPointsPerTile,
  );
  assert.equal(
    firstTelemetry.shorelineCompanion.maximumOffsetOperationsPerTile,
    SHORTBREAD_GEOMETRY_LIMITS.maximumLandlineOffsetOperationsPerTile,
  );
  assert.equal(firstTelemetry.readiness.shorelineCompanionCountsExact, true);
  assert.equal(layer.sampleWaterSurfaceHeight(-95, 40), 100);
  assert.equal(layer.sampleWaterSurfaceHeight(-90, 45), undefined, 'source polygon holes remain dry');
  assert.equal(layer.sampleWaterSurfaceHeight(-70, 40), undefined);
  assert.equal(
    layer.sampleMaximumWaterSurfaceHeightAlongSegment(-91, 45, -89, 45),
    undefined,
    'a segment wholly inside a source polygon hole remains dry',
  );
  assert.equal(layer.sampleMaximumWaterSurfaceHeightAlongSegment(-99, 40, -81, 40), 100);
  assert.equal(layer.getTelemetry().waterSurfaceSampling.queryCount, 3);
  assert.equal(layer.getTelemetry().waterSurfaceSampling.hitCount, 1);
  assert.equal(layer.getTelemetry().waterSurfaceSampling.missCount, 2);
  assert.ok(layer.getTelemetry().waterSurfaceSampling.intersectionTestCount > 0);
  assert.equal(layer.getTelemetry().tessellation.countedAgainstActiveVertexCap, true);
  assert.ok(layer.getTelemetry().tessellation.tessellatedPolylineCoordinateCount
    > layer.getTelemetry().tessellation.sourcePolylineCoordinateCount);

  const presentedRevision = firstTelemetry.readiness.revision;
  const noChangeRefresh = layer.refreshHeights();
  assert.equal(noChangeRefresh.revision, presentedRevision);
  assert.equal(noChangeRefresh.replacedTileCount, 0);
  assert.equal(noChangeRefresh.reusedTileCount, 1);
  assert.equal(layer.scenePrimitive.orderedTiles[0], tileGeometry);
  assert.equal(tileGeometry.isDestroyed(), false);
  terrainHeight = 101;
  const pendingRefresh = layer.refreshHeights();
  assert.ok(pendingRefresh.revision > presentedRevision);
  assert.equal(pendingRefresh.replacedTileCount, 1);
  assert.equal(tileGeometry.isDestroyed(), true);
  const failedTile = layer.scenePrimitive.orderedTiles[0];
  for (const category of failedTile.categories) category.collection.update = () => {};
  layer.scenePrimitive.update({});
  harness.renderError.raiseEvent(harness.viewer.scene, new Error('synthetic GPU submission failure'));
  harness.postRender.raiseEvent();
  const failedRenderTelemetry = layer.getTelemetry();
  assert.equal(failedRenderTelemetry.renderReady, false);
  assert.equal(failedRenderTelemetry.ready, false);
  assert.equal(failedRenderTelemetry.currentRevisionRenderFailed, true);
  assert.equal(failedRenderTelemetry.readiness.renderFailed, true);
  assert.equal(failedRenderTelemetry.renderErrorCount, 1);
  assert.equal(failedRenderTelemetry.lastErrorCode, 'ERR_SHORTBREAD_RENDER_ERROR');
  assert.equal(failedRenderTelemetry.postRenderCount, 1, 'a failed revision is not promoted by postRender');

  const failedRevision = failedRenderTelemetry.readiness.revision;
  terrainHeight = undefined;
  const rebuilt = layer.refreshHeights();
  assert.equal(rebuilt.tileCount, 1);
  assert.ok(rebuilt.revision > failedRevision);
  assert.equal(failedTile.isDestroyed(), true);
  const refreshedTile = layer.scenePrimitive.orderedTiles[0];
  for (const category of refreshedTile.categories) category.collection.update = () => {};
  layer.scenePrimitive.update({});
  harness.postRender.raiseEvent();
  const recoveredTelemetry = layer.getTelemetry();
  assert.equal(recoveredTelemetry.renderReady, true);
  assert.equal(recoveredTelemetry.currentRevisionRenderFailed, false);
  assert.equal(recoveredTelemetry.lastRenderError, null);
  assert.equal(recoveredTelemetry.lastErrorCode, null);
  assert.equal(recoveredTelemetry.postRenderCount, 2);
  assert.ok(recoveredTelemetry.heightResolution.unresolvedFallbackCoordinateCount > 0);
  assert.equal(layer.sampleWaterSurfaceHeight(-95, 40), 0, 'height refresh atomically replaces the water index');

  harness.renderError.raiseEvent(harness.viewer.scene, new Error('unrelated scene error after presentation'));
  const ignoredSceneErrorTelemetry = layer.getTelemetry();
  assert.equal(ignoredSceneErrorTelemetry.renderReady, true);
  assert.equal(ignoredSceneErrorTelemetry.renderErrorCount, 1);
  assert.equal(ignoredSceneErrorTelemetry.lastRenderError, null);

  const stableTile = layer.scenePrimitive.orderedTiles[0];
  terrainHeight = Number.NaN;
  assert.throws(() => layer.refreshHeights(), (error) => error?.code === 'ERR_SHORTBREAD_INVALID_RESOLVED_HEIGHT');
  assert.equal(layer.scenePrimitive.orderedTiles[0], stableTile, 'failed height refresh keeps the old tile atomically');
  assert.equal(stableTile.isDestroyed(), false);
  terrainHeight = 100;
  const repairedBeforeMove = layer.refreshHeights();
  assert.equal(repairedBeforeMove.replacedTileCount, 1);
  const residentWestTile = layer.scenePrimitive.orderedTiles[0];

  harness.setRectangle(radiansRectangle(100, 35, 120, 55));
  harness.moveEnd.raiseEvent();
  const pendingEast = layer.getTelemetry();
  assert.equal(pendingEast.geometry.tileCount, 0, 'retiring geometry is excluded from current-view counts');
  assert.equal(pendingEast.missingDesiredTileCount, 1);
  assert.equal(pendingEast.bufferResidency.retiringTileCount, 1);
  assert.equal(layer.scenePrimitive.orderedTiles[0], residentWestTile, 'old visuals remain attached while the next tile loads');
  await layer.waitForIdle();
  assert.equal(requestedUrls.length, 2);
  const eastTile = layer.scenePrimitive.orderedTiles[0];
  const eastTelemetry = layer.getTelemetry();
  assert.equal(residentWestTile.isDestroyed(), false, 'an inactive compiled tile remains resident');
  assert.equal(eastTelemetry.geometry.tileCount, 1);
  assert.equal(eastTelemetry.bufferResidency.residentTileCount, 2);
  assert.equal(eastTelemetry.bufferResidency.activeTileCount, 1);
  assert.equal(eastTelemetry.bufferResidency.inactiveTileCount, 1);
  assert.equal(eastTelemetry.bufferResidency.attachedTileCount, 1);
  assert.equal(eastTelemetry.bufferResidency.retiringTileCount, 0);
  const buildCountBeforeRevisit = eastTelemetry.bufferResidency.buildCount;
  const reuseCountBeforeRevisit = eastTelemetry.bufferResidency.activationReuseCount;
  harness.setRectangle(radiansRectangle(-120, 35, -100, 55));
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  assert.equal(requestedUrls.length, 2, 'returning to a decoded tile is an LRU cache hit');
  const revisitedWest = layer.getTelemetry();
  assert.equal(layer.scenePrimitive.orderedTiles[0], residentWestTile, 'revisit reattaches the exact compiled buffer object');
  assert.equal(residentWestTile.isDestroyed(), false);
  assert.equal(revisitedWest.bufferResidency.buildCount, buildCountBeforeRevisit);
  assert.equal(revisitedWest.bufferResidency.activationReuseCount, reuseCountBeforeRevisit + 1);
  assert.equal(revisitedWest.bufferResidency.residentTileCount, 2);
  assert.equal(revisitedWest.geometry.tileCount, 1, 'inactive residents remain excluded from readiness geometry');
  assert.equal(revisitedWest.renderReady, false, 'reattached geometry requires current-revision presentation');
  assert.ok(revisitedWest.cacheHits >= 1);

  harness.setRectangle(radiansRectangle(-120, -55, -100, -35));
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  assert.equal(requestedUrls.length, 3);
  assert.equal(layer.getTelemetry().cached, 2);
  assert.equal(layer.getTelemetry().evicted, 1);
  assert.equal(eastTile.isDestroyed(), true, 'decoded LRU eviction destroys its inactive compiled resident');
  assert.equal(layer.getTelemetry().bufferResidency.evictionCount, 1);

  harness.setRectangle(radiansRectangle(100, 35, 120, 55));
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  assert.equal(requestedUrls.length, 4, 'the least-recent inactive decoded tile was evicted and fetched again');
  assert.notEqual(layer.scenePrimitive.orderedTiles[0], eastTile);
  assert.equal(residentWestTile.isDestroyed(), true, 'the next decoded LRU eviction releases the other inactive resident');
  assert.ok(harness.renderRequests > 0);

  layer.show = false;
  assert.equal(layer.show, false);
  assert.equal(latestTelemetry.renderReady, false);
  layer.show = true;
  assert.equal(latestTelemetry.renderReady, false, 're-show requires a newly presented visible frame');
  for (const category of layer.scenePrimitive.orderedTiles[0].categories) category.collection.update = () => {};
  layer.scenePrimitive.update({});
  harness.postRender.raiseEvent();
  assert.equal(latestTelemetry.renderReady, true);
  const residentAtDestroy = [...layer.cache.values()]
    .map((record) => record.bufferGeometry)
    .filter(Boolean);
  layer.destroy();
  assert.ok(residentAtDestroy.length > 0);
  assert.ok(residentAtDestroy.every((buffer) => buffer.isDestroyed()), 'teardown destroys active and inactive residents');
  assert.equal(layer.isDestroyed, true);
  assert.equal(harness.dataSources.length, 0);
  assert.equal(harness.primitives.length, 0);
  assert.equal(harness.credits.size, 0);
  assert.equal(layer.dataSource, null);
});

test('marks inactive compiled residents stale and rebuilds changed heights lazily on revisit', async () => {
  const harness = makeViewer({ mode: 'a' });
  const tileA = Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' });
  const tileB = Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' });
  let terrainHeight = 10;
  let requestCount = 0;
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 2,
    maximumConcurrentRequests: 1,
    fetchImpl: async () => {
      requestCount += 1;
      return response([1]);
    },
    decodeTile: stubDecode,
    commandsFromTile: (decoded) => roadOnlyCommands(decoded.x === 0 ? -90 : 90),
    tileSelector: (rectangle) => tileSelection([rectangle.mode === 'a' ? tileA : tileB], 1),
    heightResolver: () => terrainHeight,
  });
  const firstRoadHeight = (tileGeometry) => {
    const road = tileGeometry.getCategory('road').collection.get(0, new Cesium.BufferPolyline());
    const position = Cesium.Cartesian3.unpack(road.getPositions(), 0, new Cesium.Cartesian3());
    return Cesium.Ellipsoid.WGS84.cartesianToCartographic(position).height;
  };

  await layer.start();
  await layer.waitForIdle();
  const firstA = layer.scenePrimitive.orderedTiles[0];
  assert.ok(Math.abs(firstRoadHeight(firstA) - 12) < 1e-5);

  harness.setRectangle({ mode: 'b' });
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  const firstB = layer.scenePrimitive.orderedTiles[0];
  const beforeRefresh = layer.getTelemetry().bufferResidency;
  assert.equal(requestCount, 2);
  assert.equal(beforeRefresh.residentTileCount, 2);
  assert.equal(firstA.isDestroyed(), false);

  terrainHeight = 20;
  const heightRefresh = layer.refreshHeights();
  const refreshedB = layer.scenePrimitive.orderedTiles[0];
  const afterRefresh = layer.getTelemetry().bufferResidency;
  assert.equal(heightRefresh.rebuiltTileCount, 1, 'only current B is rebuilt eagerly');
  assert.equal(heightRefresh.replacedTileCount, 1);
  assert.equal(firstB.isDestroyed(), true);
  assert.notEqual(refreshedB, firstB);
  assert.equal(firstA.isDestroyed(), false, 'inactive A remains compiled and detached while stale');
  assert.equal(layer.cache.get(tileA.key).bufferGeometry, firstA);
  assert.equal(layer.cache.get(tileA.key).heightStale, true);
  assert.equal(layer.cache.get(tileB.key).heightStale, false);
  assert.equal(afterRefresh.heightInvalidationCount, beforeRefresh.heightInvalidationCount + 2);
  assert.equal(afterRefresh.heightRefreshBuildCount, beforeRefresh.heightRefreshBuildCount + 1);
  assert.equal(afterRefresh.heightRefreshReplacementCount, beforeRefresh.heightRefreshReplacementCount + 1);
  assert.equal(afterRefresh.lazyHeightBuildCount, beforeRefresh.lazyHeightBuildCount);

  const buildsBeforeRevisit = afterRefresh.buildCount;
  const reusesBeforeRevisit = afterRefresh.activationReuseCount;
  harness.setRectangle({ mode: 'a' });
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  const refreshedA = layer.scenePrimitive.orderedTiles[0];
  const afterRevisit = layer.getTelemetry().bufferResidency;
  assert.equal(requestCount, 2, 'lazy height correction reuses A\'s decoded plan without refetching');
  assert.notEqual(refreshedA, firstA, 'changed resolver output replaces stale A during activation');
  assert.equal(firstA.isDestroyed(), true);
  assert.ok(Math.abs(firstRoadHeight(refreshedA) - 22) < 1e-5);
  assert.equal(layer.cache.get(tileA.key).heightStale, false);
  assert.equal(afterRevisit.buildCount, buildsBeforeRevisit + 1);
  assert.equal(afterRevisit.activationReuseCount, reusesBeforeRevisit);
  assert.equal(afterRevisit.lazyHeightBuildCount, afterRefresh.lazyHeightBuildCount + 1);
  assert.equal(afterRevisit.lazyHeightReplacementCount, afterRefresh.lazyHeightReplacementCount + 1);
  assert.equal(afterRevisit.residentTileCount, 2);
  assert.equal(refreshedB.isDestroyed(), false, 'the already-correct B replacement remains resident');
  layer.destroy();
});

test('evicts inactive compiled LRU buffers at resident vertex and byte caps without refetching decoded plans', async (t) => {
  const tileA = Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' });
  const tileB = Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' });
  const probePlan = planShortbreadGeometry(roadOnlyCommands(-90), tileA);
  const probe = createShortbreadBufferTileGeometry(Cesium, probePlan);
  const oneTileVertices = probe.vertexCount;
  const oneTileBytes = probe.byteLength;
  probe.destroy();

  const scenarios = [
    Object.freeze({
      name: 'vertex cap',
      options: Object.freeze({ maximumActiveVertices: oneTileVertices * 2 - 1 }),
      maximumVertices: oneTileVertices * 2 - 1,
      maximumBytes: SHORTBREAD_GEOMETRY_LIMITS.maximumResidentBytes,
    }),
    Object.freeze({
      name: 'byte cap',
      options: Object.freeze({
        maximumActiveVertices: oneTileVertices * 2,
        maximumResidentBytes: oneTileBytes * 2 - 1,
      }),
      maximumVertices: oneTileVertices * 2,
      maximumBytes: oneTileBytes * 2 - 1,
    }),
  ];

  for (const scenario of scenarios) {
    await t.test(scenario.name, async () => {
      const harness = makeViewer({ mode: 'a' });
      let requestCount = 0;
      const layer = new ShortbreadGeometryLayer(Cesium, {
        viewer: harness.viewer,
        tileJson,
        maximumActiveTiles: 1,
        maximumCachedTiles: 2,
        maximumConcurrentRequests: 1,
        ...scenario.options,
        fetchImpl: async () => {
          requestCount += 1;
          return response([1]);
        },
        decodeTile: stubDecode,
        commandsFromTile: (decoded) => roadOnlyCommands(decoded.x === 0 ? -90 : 90),
        tileSelector: (rectangle) => tileSelection([rectangle.mode === 'a' ? tileA : tileB], 1),
      });
      await layer.start();
      await layer.waitForIdle();
      const firstA = layer.scenePrimitive.orderedTiles[0];
      assert.equal(firstA.vertexCount, oneTileVertices);
      assert.equal(firstA.byteLength, oneTileBytes);

      harness.setRectangle({ mode: 'b' });
      harness.moveEnd.raiseEvent();
      await layer.waitForIdle();
      const firstB = layer.scenePrimitive.orderedTiles[0];
      const afterB = layer.getTelemetry();
      assert.equal(requestCount, 2);
      assert.equal(afterB.cached, 2, 'compiled eviction retains the decoded tile plan');
      assert.equal(afterB.bufferResidency.maximumRecords, 2);
      assert.equal(afterB.bufferResidency.maximumVertices, scenario.maximumVertices);
      assert.equal(afterB.bufferResidency.maximumBytes, scenario.maximumBytes);
      assert.equal(afterB.bufferResidency.residentTileCount, 1);
      assert.equal(afterB.bufferResidency.activeTileCount, 1);
      assert.equal(afterB.bufferResidency.inactiveTileCount, 0);
      assert.equal(afterB.bufferResidency.evictionCount, 1);
      assert.equal(afterB.bufferResidency.evictedVertexCount, oneTileVertices);
      assert.equal(afterB.bufferResidency.evictedByteLength, oneTileBytes);
      assert.equal(firstA.isDestroyed(), true);
      assert.equal(layer.cache.has(tileA.key), true);
      assert.equal(layer.cache.get(tileA.key).bufferGeometry, null);

      const buildsBeforeARevisit = afterB.bufferResidency.buildCount;
      const reusesBeforeARevisit = afterB.bufferResidency.activationReuseCount;
      harness.setRectangle({ mode: 'a' });
      harness.moveEnd.raiseEvent();
      await layer.waitForIdle();
      const revisitedA = layer.scenePrimitive.orderedTiles[0];
      const afterARevisit = layer.getTelemetry();
      assert.equal(requestCount, 2, 'revisiting a compiled-evicted tile rebuilds its retained decoded plan');
      assert.notEqual(revisitedA, firstA);
      assert.equal(firstB.isDestroyed(), true);
      assert.equal(afterARevisit.bufferResidency.buildCount, buildsBeforeARevisit + 1);
      assert.equal(afterARevisit.bufferResidency.activationReuseCount, reusesBeforeARevisit);
      assert.equal(afterARevisit.bufferResidency.evictionCount, 2);
      assert.equal(afterARevisit.bufferResidency.residentTileCount, 1);
      layer.destroy();
    });
  }
});

test('settles a valid empty tile without claiming GPU geometry submission or presentation', async () => {
  const harness = makeViewer(radiansRectangle(-10, -10, 10, 10));
  const oneTile = Object.freeze({ x: 0, y: 0, z: 0, key: '0/0/0' });
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: () => [],
    tileSelector: () => tileSelection([oneTile]),
  });
  await layer.start();
  await layer.waitForIdle();
  layer.scenePrimitive.update({});
  harness.postRender.raiseEvent();
  const telemetry = layer.getTelemetry();
  assert.equal(telemetry.loaded, 1);
  assert.equal(telemetry.geometry.tileCount, 1);
  assert.equal(telemetry.geometry.bufferPrimitiveCount, 0);
  assert.equal(telemetry.settledEmpty, true);
  assert.equal(telemetry.gpuSubmittedFrame, false);
  assert.equal(telemetry.gpuPresentedFrame, false);
  assert.equal(telemetry.renderReady, false);
  assert.equal(telemetry.readiness.pending, false);
  layer.destroy();
});

test('reports a broad-view deferred tile as truthfully settled empty and retries on later camera moves', async () => {
  const harness = makeViewer(radiansRectangle(-180, -85, 180, 85));
  const broadTile = Object.freeze({ x: 0, y: 0, z: 0, key: '0/0/0' });
  const detailTile = Object.freeze({ x: 5, y: 10, z: 5, key: '5/5/10' });
  let detail = false;
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    minimumGeometryZoom: 5,
    maximumActiveTiles: 1,
    maximumCachedTiles: 2,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: commandsForDecodedTile,
    tileSelector: () => tileSelection([detail ? detailTile : broadTile], detail ? 5 : 0),
  });
  await layer.start();
  await layer.waitForIdle();
  const broad = layer.getTelemetry();
  assert.equal(broad.settledEmpty, true);
  assert.equal(broad.viewDeferred, true);
  assert.equal(broad.broadViewDeferral.active, true);
  assert.equal(broad.broadViewDeferral.minimumGeometryZoom, 5);
  assert.equal(broad.broadViewDeferral.deferredTileCount, 1);
  assert.equal(broad.geometry.bufferPrimitiveCount, 0);
  assert.equal(broad.gpuSubmittedFrame, false);

  detail = true;
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  const zoomed = layer.getTelemetry();
  assert.equal(zoomed.viewDeferred, false);
  assert.equal(zoomed.broadViewDeferral.active, false);
  assert.ok(zoomed.geometry.bufferPrimitiveCount > 0);
  layer.destroy();
});

test('settles mixed desired HTTP failures as terminal instead of pending or empty', async () => {
  const tiles = [
    Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' }),
    Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' }),
  ];
  const makeLayer = async ({ emptySuccessfulTile = false } = {}) => {
    const harness = makeViewer({ mode: 'both' });
    const layer = new ShortbreadGeometryLayer(Cesium, {
      viewer: harness.viewer,
      tileJson,
      maximumActiveTiles: 2,
      maximumCachedTiles: 2,
      maximumConcurrentRequests: 1,
      fetchImpl: async (url) => (
        String(url).includes('/1/0/0.mvt') ? response([1]) : response([], 503)
      ),
      decodeTile: stubDecode,
      commandsFromTile: () => (emptySuccessfulTile ? [] : roadOnlyCommands()),
      tileSelector: () => tileSelection(tiles, 1),
    });
    await layer.start();
    await layer.waitForIdle();
    return { harness, layer };
  };

  const partial = await makeLayer();
  for (const category of partial.layer.scenePrimitive.orderedTiles[0].categories) {
    category.collection.update = () => {};
  }
  partial.layer.scenePrimitive.update({});
  partial.harness.postRender.raiseEvent();
  const partialTelemetry = partial.layer.getTelemetry();
  assert.equal(partialTelemetry.loaded, 1);
  assert.equal(partialTelemetry.failed, 1);
  assert.equal(partialTelemetry.geometry.tileCount, 1);
  assert.equal(partialTelemetry.missingDesiredTileCount, 1);
  assert.equal(partialTelemetry.terminalFailedTileCount, 1);
  assert.equal(partialTelemetry.settledTerminalFailure, true);
  assert.equal(partialTelemetry.readiness.degraded, true);
  assert.equal(partialTelemetry.readiness.pending, false);
  assert.equal(partialTelemetry.renderReady, false);
  partial.layer.destroy();

  const empty = await makeLayer({ emptySuccessfulTile: true });
  empty.layer.scenePrimitive.update({});
  empty.harness.postRender.raiseEvent();
  const emptyTelemetry = empty.layer.getTelemetry();
  assert.equal(emptyTelemetry.loaded, 1);
  assert.equal(emptyTelemetry.failed, 1);
  assert.equal(emptyTelemetry.geometry.bufferPrimitiveCount, 0);
  assert.equal(emptyTelemetry.missingDesiredTileCount, 1);
  assert.equal(emptyTelemetry.settledEmpty, false);
  assert.equal(emptyTelemetry.settledTerminalFailure, true);
  assert.equal(emptyTelemetry.readiness.pending, false);
  empty.layer.destroy();
});

test('settles cached aggregate-cap rejection as degraded and recovers after capacity is freed', async () => {
  const harness = makeViewer({ mode: 'a' });
  const tileA = Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' });
  const tileB = Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' });
  let requestCount = 0;
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 2,
    maximumCachedTiles: 2,
    maximumActiveVertices: 10,
    maximumConcurrentRequests: 1,
    fetchImpl: async () => {
      requestCount += 1;
      return response([1]);
    },
    decodeTile: stubDecode,
    commandsFromTile: (decoded) => roadOnlyCommands(decoded.x === 0 ? -10 : 10, 6),
    tileSelector: (rectangle) => tileSelection(
      rectangle.mode === 'a' ? [tileA] : rectangle.mode === 'b' ? [tileB] : [tileB, tileA],
      1,
    ),
  });
  const present = () => {
    for (const tile of layer.scenePrimitive.orderedTiles) {
      for (const category of tile.categories) category.collection.update = () => {};
    }
    layer.scenePrimitive.update({});
    harness.postRender.raiseEvent();
  };
  await layer.start();
  await layer.waitForIdle();
  present();
  assert.equal(layer.getTelemetry().renderReady, true);

  harness.setRectangle({ mode: 'b' });
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  present();
  assert.equal(layer.getTelemetry().renderReady, true);
  assert.equal(requestCount, 2);

  harness.setRectangle({ mode: 'both' });
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  const degraded = layer.getTelemetry();
  assert.equal(requestCount, 2, 'the rejected tile came from the decoded LRU cache');
  assert.equal(degraded.loaded, 2);
  assert.equal(degraded.failed, 1);
  assert.equal(degraded.capRejected, 1);
  assert.equal(degraded.geometry.tileCount, 1);
  assert.equal(degraded.missingDesiredTileCount, 1);
  assert.equal(degraded.activationRejectedTileCount, 1);
  assert.equal(degraded.settledActivationFailure, true);
  assert.equal(degraded.terminalFailedTileCount, 1);
  assert.equal(degraded.settledTerminalFailure, true);
  assert.equal(degraded.readiness.degraded, true);
  assert.equal(degraded.renderReady, false, 'partial desired coverage cannot reuse prior readiness');

  harness.setRectangle({ mode: 'a' });
  harness.moveEnd.raiseEvent();
  await layer.waitForIdle();
  present();
  const recovered = layer.getTelemetry();
  assert.equal(recovered.geometry.tileCount, 1);
  assert.equal(recovered.missingDesiredTileCount, 0);
  assert.equal(recovered.activationRejectedTileCount, 0);
  assert.equal(recovered.settledActivationFailure, false);
  assert.equal(recovered.terminalFailedTileCount, 0);
  assert.equal(recovered.settledTerminalFailure, false);
  assert.equal(recovered.renderReady, true);
  layer.destroy();
});

test('coalesces repeated selections, enforces concurrency, aborts stale work, and destroys pending requests', async () => {
  const harness = makeViewer({ mode: 'first' });
  const firstTiles = [
    Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' }),
    Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' }),
  ];
  const secondTiles = [Object.freeze({ x: 0, y: 1, z: 1, key: '1/0/1' })];
  let activeFetches = 0;
  let maximumObservedFetches = 0;
  const abortedKeys = [];
  const fetchImpl = (url, { signal }) => {
    const key = String(url).match(/\/(\d+)\/(\d+)\/(\d+)\.mvt$/u).slice(1).join('/');
    activeFetches += 1;
    maximumObservedFetches = Math.max(maximumObservedFetches, activeFetches);
    if (key === '1/0/1') {
      activeFetches -= 1;
      return Promise.resolve(response([9]));
    }
    return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => {
        abortedKeys.push(key);
        activeFetches -= 1;
        reject(new DOMException('aborted', 'AbortError'));
      }, { once: true });
    });
  };
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 2,
    maximumCachedTiles: 2,
    maximumConcurrentRequests: 2,
    fetchImpl,
    decodeTile: stubDecode,
    commandsFromTile: (decoded) => roadOnlyCommands(decoded.x === 0 ? -90 : 90),
    tileSelector: (rectangle) => tileSelection(rectangle.mode === 'first' ? firstTiles : secondTiles, 1),
  });
  await layer.start();
  assert.equal(layer.getTelemetry().inflight, 2);
  layer.refresh({ mode: 'first' });
  assert.equal(layer.getTelemetry().coalesced, 2);
  layer.refresh({ mode: 'second' });
  await layer.waitForIdle();
  assert.equal(maximumObservedFetches, 2);
  assert.deepEqual(abortedKeys.sort(), ['1/0/0', '1/1/0']);
  assert.equal(layer.getTelemetry().aborted, 2);
  assert.equal(layer.getTelemetry().geometry.tileCount, 1);
  assert.equal(layer.getTelemetry().geometry.roadCurveCount, 1);

  harness.setRectangle({ mode: 'first' });
  harness.moveEnd.raiseEvent();
  assert.equal(layer.getTelemetry().inflight, 2);
  layer.destroy();
  await layer.waitForIdle();
  assert.equal(layer.getTelemetry().destroyed, true);
  assert.equal(layer.getTelemetry().inflight, 0);
  assert.equal(harness.dataSources.length, 0);
  assert.equal(harness.primitives.length, 0);
  assert.equal(harness.credits.size, 0);
});

test('requeues an aborted inflight tile when it becomes desired again before the old request settles', async () => {
  const harness = makeViewer({ mode: 'a' });
  const tileA = Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' });
  const tileB = Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' });
  let aAttempts = 0;
  let settleFirstA;
  let firstAbortObserved = false;
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    maximumConcurrentRequests: 1,
    fetchImpl: (url, { signal }) => {
      if (!String(url).includes('/1/0/0.mvt')) {
        throw new Error('tile B must remain queued and be removed before fetch');
      }
      aAttempts += 1;
      if (aAttempts > 1) return Promise.resolve(response([2]));
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => { firstAbortObserved = true; }, { once: true });
        settleFirstA = () => reject(new DOMException('old A aborted', 'AbortError'));
      });
    },
    decodeTile: stubDecode,
    commandsFromTile: () => roadOnlyCommands(),
    tileSelector: (rectangle) => tileSelection([rectangle.mode === 'a' ? tileA : tileB], 1),
  });
  await layer.start();
  layer.refresh({ mode: 'b' });
  assert.equal(firstAbortObserved, true);
  layer.refresh({ mode: 'a' });
  assert.equal(layer.getTelemetry().queued, 1, 'desired A is queued behind its aborted old generation');
  settleFirstA();
  await layer.waitForIdle();
  const telemetry = layer.getTelemetry();
  assert.equal(aAttempts, 2);
  assert.equal(telemetry.loaded, 1);
  assert.equal(telemetry.failed, 0);
  assert.equal(telemetry.geometry.tileCount, 1);
  assert.equal(telemetry.missingDesiredTileCount, 0);
  assert.equal(telemetry.terminalFailedTileCount, 0);
  assert.equal(telemetry.readiness.pending, true, 'the replacement still awaits GPU presentation');
  layer.destroy();
});

test('charges completed stale tile transfers to the lifetime byte budget before discarding them', async () => {
  const harness = makeViewer({ mode: 'first' });
  const firstTile = Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' });
  const secondTile = Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' });
  let completeFirst;
  const layer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    maximumConcurrentRequests: 1,
    fetchImpl: (url) => {
      if (String(url).includes('/1/0/0.mvt')) {
        return new Promise((resolve) => { completeFirst = () => resolve(response([1, 2, 3])); });
      }
      return Promise.resolve(response([4, 5]));
    },
    decodeTile: stubDecode,
    commandsFromTile: () => roadOnlyCommands(),
    tileSelector: (rectangle) => tileSelection([rectangle.mode === 'first' ? firstTile : secondTile], 1),
  });
  await layer.start();
  layer.refresh({ mode: 'second' });
  completeFirst();
  await layer.waitForIdle();
  const telemetry = layer.getTelemetry();
  assert.equal(telemetry.aborted, 1);
  assert.equal(telemetry.loaded, 1);
  assert.equal(telemetry.responseBytes, 5, 'completed stale bytes still consume the lifetime budget');
  assert.equal(telemetry.aggregateBudgetScope, 'layer-session-lifetime');
  layer.destroy();
});

test('fails closed on byte, active-vertex, buffer-transaction, and hard lifecycle caps', async () => {
  const oneTile = [Object.freeze({ x: 0, y: 0, z: 0, key: '0/0/0' })];
  const harness = makeViewer({ mode: 'one' });
  const byteLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    maximumTileBytes: 3,
    fetchImpl: async () => response([1, 2, 3, 4]),
    decodeTile: stubDecode,
    commandsFromTile: () => roadOnlyCommands(),
    tileSelector: () => tileSelection(oneTile),
  });
  await byteLayer.start();
  await byteLayer.waitForIdle();
  assert.equal(byteLayer.getTelemetry().failed, 1);
  assert.equal(byteLayer.getTelemetry().capRejected, 1);
  assert.equal(byteLayer.getTelemetry().geometry.entityCount, 0);
  assert.equal(byteLayer.getTelemetry().lastErrorCode, 'ERR_SHORTBREAD_RESPONSE_TOO_LARGE');
  byteLayer.destroy();

  const lifetimeHarness = makeViewer({ mode: 'two' });
  const lifetimeTiles = [
    Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' }),
    Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' }),
  ];
  const lifetimeLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: lifetimeHarness.viewer,
    tileJson,
    maximumActiveTiles: 2,
    maximumCachedTiles: 2,
    maximumConcurrentRequests: 1,
    maximumTileBytes: 3,
    maximumTotalBytes: 4,
    fetchImpl: async () => response([1, 2, 3]),
    decodeTile: stubDecode,
    commandsFromTile: (decoded) => roadOnlyCommands(decoded.x === 0 ? -90 : 90),
    tileSelector: () => tileSelection(lifetimeTiles, 1),
  });
  await lifetimeLayer.start();
  await lifetimeLayer.waitForIdle();
  assert.equal(lifetimeLayer.getTelemetry().loaded, 1);
  assert.equal(lifetimeLayer.getTelemetry().failed, 1);
  assert.equal(lifetimeLayer.getTelemetry().responseBytes, 3);
  assert.equal(lifetimeLayer.getTelemetry().lastErrorCode, 'ERR_SHORTBREAD_LIFETIME_BYTE_CAP');
  assert.equal(lifetimeLayer.getTelemetry().capRejected, 1);
  lifetimeLayer.destroy();

  const aggregateHarness = makeViewer({ mode: 'two' });
  const twoTiles = [
    Object.freeze({ x: 0, y: 0, z: 1, key: '1/0/0' }),
    Object.freeze({ x: 1, y: 0, z: 1, key: '1/1/0' }),
  ];
  const vertexLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: aggregateHarness.viewer,
    tileJson,
    maximumActiveTiles: 2,
    maximumCachedTiles: 2,
    maximumConcurrentRequests: 1,
    maximumActiveVertices: 10,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: (decoded) => roadOnlyCommands(decoded.x === 0 ? -90 : 90, 6),
    tileSelector: () => tileSelection(twoTiles, 1),
  });
  await vertexLayer.start();
  await vertexLayer.waitForIdle();
  assert.equal(vertexLayer.getTelemetry().loaded, 1);
  assert.equal(vertexLayer.getTelemetry().failed, 1);
  assert.equal(vertexLayer.getTelemetry().geometry.tileCount, 1);
  assert.equal(vertexLayer.getTelemetry().geometry.vertexCount, 6);
  assert.ok(vertexLayer.getTelemetry().capRejected >= 1);
  assert.equal(vertexLayer.getTelemetry().lastErrorCode, 'ERR_SHORTBREAD_ACTIVE_VERTEX_CAP');
  vertexLayer.destroy();

  const rejectedHarness = makeViewer({ mode: 'one' });
  const rejectedLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: rejectedHarness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    maximumActiveVertices: 5,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: () => [{
      kind: 'road',
      category: 'primary',
      stroke: '#ffffff',
      width: 2,
      geometry: { type: 'LineString', coordinates: [[0, 0], [2, 0]] },
    }],
    tileSelector: () => tileSelection(oneTile),
  });
  await rejectedLayer.start();
  await rejectedLayer.waitForIdle();
  const rejectedTelemetry = rejectedLayer.getTelemetry();
  assert.equal(rejectedTelemetry.loaded, 0);
  assert.equal(rejectedTelemetry.failed, 1);
  assert.equal(rejectedTelemetry.capRejected, 1);
  assert.equal(rejectedTelemetry.geometry.tileCount, 0);
  assert.equal(rejectedTelemetry.settledActivationFailure, true);
  assert.equal(rejectedTelemetry.settledTerminalFailure, true);
  assert.equal(rejectedTelemetry.renderReady, false);
  assert.equal(rejectedTelemetry.lastErrorCode, 'ERR_SHORTBREAD_ACTIVE_VERTEX_CAP');
  rejectedLayer.destroy();

  const transactionHarness = makeViewer({ mode: 'one' });
  const transactionLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: transactionHarness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    fetchImpl: async () => response([1]),
    decodeTile: stubDecode,
    commandsFromTile: () => roadOnlyCommands(),
    tileSelector: () => tileSelection(oneTile),
    geometryPlanner: () => Object.freeze({
      tile: Object.freeze({ ...oneTile[0], size: 512 }),
      counts: Object.freeze({ vertexCount: 4, roadCurveCount: 2 }),
      descriptors: Object.freeze([
        Object.freeze({
          id: 'valid', kind: 'road', geometryModel: 'test', positions: [[0, 0], [1, 1]],
          material: { type: 'Color', color: '#ffffff', alpha: 1 }, width: 1, zIndex: 40, linePassCount: 1,
        }),
        Object.freeze({
          id: 'invalid', kind: 'road', geometryModel: 'test', positions: undefined,
          material: { type: 'Color', color: '#ffffff', alpha: 1 }, width: 1, zIndex: 40, linePassCount: 1,
        }),
      ]),
    }),
  });
  await transactionLayer.start();
  await transactionLayer.waitForIdle();
  assert.equal(transactionLayer.getTelemetry().failed, 1);
  assert.equal(transactionLayer.scenePrimitive.tileCount, 0, 'a failed tile build adds no partial buffer tile');
  assert.equal(transactionLayer.getTelemetry().geometry.bufferPrimitiveCount, 0);
  transactionLayer.destroy();

  assert.throws(() => new ShortbreadGeometryLayer(Cesium, {
    viewer: makeViewer(radiansRectangle(-10, -10, 10, 10)).viewer,
    tileJson,
    maximumConcurrentRequests: SHORTBREAD_GEOMETRY_LIMITS.maximumConcurrentRequests + 1,
  }), /maximumConcurrentRequests/);
  assert.throws(() => new ShortbreadGeometryLayer(Cesium, {
    viewer: makeViewer(radiansRectangle(-10, -10, 10, 10)).viewer,
    tileJson,
    maximumResidentBytes: SHORTBREAD_GEOMETRY_LIMITS.maximumResidentBytes + 1,
  }), /maximumResidentBytes/);
  assert.throws(() => new ShortbreadGeometryLayer(Cesium, {
    viewer: makeViewer(radiansRectangle(-10, -10, 10, 10)).viewer,
    tileJson,
    maximumActiveTiles: 2,
    maximumCachedTiles: 1,
  }), /maximumCachedTiles/);
});

test('rolls back failed startup and reports per-tile request timeout separately from cancellation', async () => {
  const startupHarness = makeViewer(radiansRectangle(-10, -10, 10, 10));
  const startupLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: startupHarness.viewer,
    tileJson,
    tileSelector: () => {
      throw Object.assign(new Error('selection failed'), { code: 'ERR_TEST_SELECTION' });
    },
  });
  await assert.rejects(startupLayer.start(), /selection failed/u);
  assert.equal(startupLayer.started, false);
  assert.equal(startupHarness.dataSources.length, 0);
  assert.equal(startupHarness.primitives.length, 0);
  assert.equal(startupHarness.credits.size, 0);

  const timeoutHarness = makeViewer({ mode: 'one' });
  const oneTile = [Object.freeze({ x: 0, y: 0, z: 0, key: '0/0/0' })];
  const timeoutLayer = new ShortbreadGeometryLayer(Cesium, {
    viewer: timeoutHarness.viewer,
    tileJson,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    requestTimeoutMs: 10,
    fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('timeout', 'AbortError')), { once: true });
    }),
    decodeTile: stubDecode,
    commandsFromTile: () => roadOnlyCommands(),
    tileSelector: () => tileSelection(oneTile),
  });
  await timeoutLayer.start();
  await timeoutLayer.waitForIdle();
  assert.equal(timeoutLayer.getTelemetry().failed, 1);
  assert.equal(timeoutLayer.getTelemetry().aborted, 0);
  assert.equal(timeoutLayer.getTelemetry().lastErrorCode, 'ERR_SHORTBREAD_REQUEST_TIMEOUT');
  assert.equal(timeoutLayer.getTelemetry().requestTimeoutMs, 10);
  timeoutLayer.destroy();
});

test('loader keeps official attribution and uses bounded TileJSON before starting geometry', async () => {
  const harness = makeViewer(radiansRectangle(-120, 35, -100, 55));
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(String(url));
    if (String(url).endsWith('tilejson.json')) {
      return new Response(JSON.stringify(tileJson), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    return response([1]);
  };
  const layer = await loadShortbreadGeometryLayer(Cesium, {
    viewer: harness.viewer,
    fetchImpl,
    targetZoom: 1,
    maximumActiveTiles: 1,
    maximumCachedTiles: 1,
    decodeTile: stubDecode,
    commandsFromTile: commandsForDecodedTile,
  });
  await layer.waitForIdle();
  assert.equal(urls[0], 'https://vector.openstreetmap.org/shortbread_v1/tilejson.json');
  assert.match(layer.getTelemetry().attributionHtml, /OpenStreetMap contributors/u);
  assert.equal(harness.credits.size, 1);
  layer.destroy();
});
