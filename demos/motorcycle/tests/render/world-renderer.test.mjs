import assert from 'node:assert/strict';
import test from 'node:test';

import * as THREE from 'three';

import { createMotorcyclePhysics } from '../../../shared/physics/vehicle/index.js';
import { deriveRoadRaceCourse } from '../../src/race/index.js';
import { createSquareLoopGraph } from '../race/fixtures.mjs';

import {
  createBuildingGeometry,
  createMotorcycleWorldRenderer,
  createNurbsCircleCurve,
  createNurbsCurveFromPoints,
  createRoadRibbonGeometry,
  createTerrainGeometry,
  createTerrainNurbsContourGeometry,
  createTopoTerrainMaterial,
  geometryHasOnlyFiniteAttributes,
  groupRoadSegmentsByStyle,
} from '../../src/render/index.js';

const BODY_IDS = Object.freeze({
  chassis: 'bike:chassis',
  rearSwingarm: 'bike:rear-swingarm',
  rearWheel: 'bike:rear-wheel',
  upperFork: 'bike:upper-fork',
  lowerFork: 'bike:lower-fork',
  frontWheel: 'bike:front-wheel',
});

function makeTerrain() {
  return {
    schemaVersion: 'peercompute.geo.local-terrain-grid.v1',
    width: 3,
    height: 3,
    positions: new Float32Array([
      -10, 1, 10, 0, 2, 10, 10, 3, 10,
      -10, 0, 0, 0, 1, 0, 10, 2, 0,
      -10, -1, -10, 0, 0, -10, 10, 1, -10,
    ]),
    heights: new Float32Array([
      101, 102, 103,
      100, 101, 102,
      99, 100, 101,
    ]),
    localBounds: Object.freeze({ minX: -10, maxX: 10, minY: -1, maxY: 3, minZ: -10, maxZ: 10 }),
    source: Object.freeze({
      id: 'noaa-etopo2022',
      authoritative: true,
      derived: false,
      attribution: 'NOAA/NCEI ETOPO 2022 Global Relief',
    }),
    sampleRawHeight(longitude, latitude) {
      return 1 + (longitude + 150) * 0.1 + (latitude - 61) * 0.1;
    },
    frame: {
      toLocal({ longitude, latitude, height }) {
        return [(longitude + 150) * 1_000, height - 1, (latitude - 61) * 1_000];
      },
    },
  };
}

function makeRoadSegments() {
  return [
    {
      id: 'primary',
      from: [-8, 0.25, -4],
      to: [8, 1.85, -4],
      widthMeters: 7,
      category: 'primary',
      color: '#ffe74a',
      sourceAuthoritative: true,
    },
    {
      id: 'residential',
      from: [-6, 0.42, 2],
      to: [6, 1.62, 2],
      widthMeters: 5,
      category: 'residential',
      color: '#37ff78',
      sourceAuthoritative: true,
    },
    {
      id: 'service',
      from: [-3, 0.7, 6],
      to: [3, 1.3, 6],
      widthMeters: 3.5,
      category: 'service',
      color: '#16ba58',
      sourceAuthoritative: true,
    },
  ];
}

function makeBuilding(id = 'building/1') {
  return {
    id,
    heightMeters: 12,
    baseHeightMeters: 0,
    heightSource: 'source-height',
    heightDerived: false,
    sourceAuthoritative: true,
    rings: [
      [[-4, 2, -4], [4, 2, -4], [4, 2, 4], [-4, 2, 4], [-4, 2, -4]],
      [[-1, 2, -1], [-1, 2, 1], [1, 2, 1], [1, 2, -1], [-1, 2, -1]],
    ],
  };
}

function makeSceneData() {
  return {
    schemaVersion: 'peercompute.motorcycle.scene-data.v1',
    roadSegments: makeRoadSegments(),
    buildings: [makeBuilding()],
    localGraph: { schemaVersion: 'peercompute.geo.local-road-graph.v1' },
    spawn: { position: [0, 2, 0], headingRadians: 0 },
    counts: {
      sourceRoads: 3,
      renderedRoadSegments: 3,
      sourceBuildings: 3,
      renderedBuildings: 1,
      omittedRoadSegments: 2,
      omittedBuildings: 2,
    },
    provenance: {
      source: 'OpenStreetMap contributors',
      synthetic: false,
      licenseUrl: 'https://www.openstreetmap.org/copyright',
    },
    status: 'current',
    operationalUse: false,
  };
}

function makePhysics() {
  let offset = 0;
  let particleTransformCalls = 0;
  let interpolatedTransformCalls = 0;
  let contactCount = 2;
  const bodyIdList = Object.values(BODY_IDS);
  const particles = bodyIdList.flatMap((bodyId, bodyIndex) => [0, 1].map((particleIndex) => ({
    id: `${bodyId}#${particleIndex}`,
    bodyId,
    particleIndex,
    position: [bodyIndex + particleIndex * 0.2, 2 + particleIndex * 0.1, bodyIndex * 0.25],
    radius: 0.08 + particleIndex * 0.01,
    tag: `${bodyId}-particle`,
  })));
  const contacts = [
    {
      id: 'contact/0',
      point: [0.5, 0.1, -0.5],
      normalImpulse: 4,
      penetration: 0.01,
    },
    {
      id: 'contact/1',
      point: [1.5, 0.15, -1.5],
      normalImpulse: 1,
      penetration: 0.005,
    },
  ];
  return {
    rig: {
      bodyIds: BODY_IDS,
      bodyIdList,
      wheelRadius: 0.34,
      tireRadius: 0.072,
    },
    setOffset(value) {
      offset = value;
    },
    getParticleTransformCallCount() {
      return particleTransformCalls;
    },
    getInterpolatedTransformCallCount() {
      return interpolatedTransformCalls;
    },
    setContactCount(value) {
      contactCount = value;
    },
    getInterpolatedTransforms(alpha) {
      interpolatedTransformCalls += 1;
      return bodyIdList.map((id, index) => ({
        id,
        position: [index + offset + alpha, 2, index * 0.25],
        orientation: [0, 0, 0, 1],
      }));
    },
    getParticleTransforms(alpha) {
      particleTransformCalls += 1;
      return particles.map((particle) => ({
        ...particle,
        position: [particle.position[0] + offset + alpha, particle.position[1], particle.position[2]],
      }));
    },
    getContacts() {
      return contacts.slice(0, contactCount).map((contact) => ({ ...contact, point: [...contact.point] }));
    },
  };
}

function makeModelInstance() {
  const root = new THREE.Group();
  root.name = 'test-licensed-motorcycle-model';
  const geometry = new THREE.BoxGeometry(1.67, 0.72, 0.58);
  const material = new THREE.MeshBasicMaterial({ color: 0xff3131 });
  root.add(new THREE.Mesh(geometry, material));
  let released = false;
  let releaseCount = 0;
  return {
    root,
    geometry,
    material,
    get releaseCount() { return releaseCount; },
    getTelemetry() {
      return {
        schemaVersion: 'peercompute.motorcycle.model-instance.telemetry.v1',
        id: 'test-model-instance',
        released,
        attached: Boolean(root.parent),
        visible: root.visible,
        assetId: 'akira-bike-ryanwill679-optimized-v1',
        physicsAuthority: 'six-body-particle-rigid',
        collisionAuthority: false,
        sharedResources: true,
        targetWheelbaseMeters: 1.67,
      };
    },
    release() {
      if (released) return false;
      root.removeFromParent();
      root.clear();
      released = true;
      releaseCount += 1;
      return true;
    },
  };
}

function makeRaceCourse() {
  return deriveRoadRaceCourse(createSquareLoopGraph(), {
    gateCount: 4,
    sourceStatus: 'current',
    sourceProvenance: {
      attribution: '© OpenStreetMap contributors',
      licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/',
    },
  });
}

function trafficSnapshot(vehicleCount = 3) {
  const categories = ['traffic-cyan', 'traffic-magenta', 'traffic-amber'];
  return {
    schemaVersion: 'peercompute.synthetic-road-traffic.snapshot.v1',
    provenance: {
      dataNature: 'synthetic-game-simulation',
      synthetic: true,
      liveTraffic: false,
      navigationGrade: false,
      geometrySource: 'OpenStreetMap-derived directed road geometry',
    },
    status: 'running',
    vehicles: Array.from({ length: vehicleCount }, (_, index) => ({
      id: `synthetic-traffic/${index}`,
      synthetic: true,
      colorCategory: categories[index % categories.length],
      coordinates: [-150 + index * 0.001, 61 + index * 0.001],
      headingRadians: index * 0.25,
      dimensionsMeters: [4.2 + index * 0.1, 1.8, 1.5],
    })),
  };
}

function geometryTopArea(geometry) {
  const position = geometry.getAttribute('position');
  const index = geometry.index;
  geometry.computeBoundingBox();
  const topY = geometry.boundingBox.max.y;
  let area = 0;
  for (let cursor = 0; cursor < index.count; cursor += 3) {
    const ids = [index.getX(cursor), index.getX(cursor + 1), index.getX(cursor + 2)];
    const points = ids.map((id) => [position.getX(id), position.getY(id), position.getZ(id)]);
    if (!points.every((point) => Math.abs(point[1] - topY) < 1e-6)) continue;
    const [a, b, c] = points;
    area += Math.abs(
      (b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0]),
    ) * 0.5;
    const centroidX = (a[0] + b[0] + c[0]) / 3;
    const centroidZ = (a[2] + b[2] + c[2]) / 3;
    assert.equal(
      centroidX > -1 && centroidX < 1 && centroidZ > -1 && centroidZ < 1,
      false,
      'roof triangles must not cover the courtyard hole',
    );
  }
  return area;
}

test('terrain and category road helpers produce finite Three r182 geometry and distinct styling', () => {
  assert.equal(THREE.REVISION, '182');
  const terrain = createTerrainGeometry(THREE, makeTerrain());
  assert.equal(terrain.getAttribute('position').count, 9);
  assert.equal(terrain.index.count, 24);
  assert.equal(terrain.userData.triangleCount, 8);
  assert.equal(geometryHasOnlyFiniteAttributes(terrain), true);
  assert.ok(terrain.boundingSphere.radius > 0);

  const material = createTopoTerrainMaterial(THREE);
  assert.equal(material.transparent, true);
  assert.equal(material.depthWrite, true);
  assert.equal(material.polygonOffset, true);
  assert.equal(material.polygonOffsetFactor, 1);
  assert.equal(material.polygonOffsetUnits, 1);
  assert.equal(material.uniforms.surfaceOpacity.value, 0.035);
  assert.equal(material.userData.style, 'transparent-terrain-surface-under-nurbs-contours');

  const contours = createTerrainNurbsContourGeometry(THREE, makeTerrain(), {
    contourSpacingMeters: 1,
    maximumNurbsCurves: 32,
    maximumSampledVertices: 2_048,
  });
  assert.equal(contours.telemetry.curveModel, 'NURBS');
  assert.equal(contours.telemetry.contourBasis, 'source-elevation-meters');
  assert.equal(contours.telemetry.firstContourElevationMeters, 99);
  assert.ok(contours.telemetry.nurbsCurveCount > 0);
  assert.ok(contours.telemetry.sampledVertexCount <= 2_048);
  assert.equal(geometryHasOnlyFiniteAttributes(contours.minor), true);
  assert.equal(geometryHasOnlyFiniteAttributes(contours.major), true);
  const wheelCurve = createNurbsCircleCurve(THREE, 0.412, { plane: 'yz' });
  assert.equal(wheelCurve.userData.curveModel, 'NURBS');
  assert.ok(wheelCurve.getPoints(64).every((point) => Math.abs(Math.hypot(point.y, point.z) - 0.412) < 1e-12));

  const hairpinPoints = [[0, 0, 0], [4, 0, 0], [4, 0, 1], [0, 0, 1], [0, 0, 2]];
  const hairpin = createNurbsCurveFromPoints(THREE, hairpinPoints, { degree: 1 });
  assert.deepEqual(
    hairpin.getPoints(hairpinPoints.length - 1).map((point) => point.toArray()),
    hairpinPoints,
    'degree-one terrain NURBS preserves every sharp source turn exactly',
  );
  assert.throws(
    () => createNurbsCurveFromPoints(THREE, hairpinPoints, { maximumControlPoints: 1 }),
    /between 2 and 256/u,
  );

  const roads = makeRoadSegments();
  const ribbon = createRoadRibbonGeometry(THREE, roads);
  assert.equal(ribbon.userData.renderedSegmentCount, 3);
  assert.equal(ribbon.index.count, 18);
  assert.equal(geometryHasOnlyFiniteAttributes(ribbon), true);
  const styles = groupRoadSegmentsByStyle(roads);
  assert.equal(styles.length, 3);
  assert.equal(new Set(styles.map((style) => style.color)).size, 3);
  assert.deepEqual(styles.map((style) => style.category).sort(), ['primary', 'residential', 'service']);

  terrain.dispose();
  contours.minor.dispose();
  contours.major.dispose();
  ribbon.dispose();
  material.dispose();
});

test('building extrusion preserves source height and triangulates an interior hole', () => {
  const geometry = createBuildingGeometry(THREE, makeBuilding());
  assert.equal(geometryHasOnlyFiniteAttributes(geometry), true);
  assert.equal(geometry.userData.heightMeters, 12);
  assert.equal(geometry.userData.holeCount, 1);
  assert.equal(geometry.boundingBox.min.y, 2);
  assert.equal(geometry.boundingBox.max.y, 14);
  assert.ok(Math.abs(geometryTopArea(geometry) - 60) < 1e-6, `roof area=${geometryTopArea(geometry)}`);
  geometry.dispose();

  const elevated = createBuildingGeometry(THREE, {
    ...makeBuilding('building/elevated'),
    baseHeightMeters: 2,
  });
  assert.equal(elevated.boundingBox.min.y, 2);
  assert.equal(elevated.boundingBox.max.y, 12, 'source height is an absolute top, not base plus total height');
  assert.equal(elevated.userData.extrusionMeters, 10);
  elevated.dispose();
});

test('terrain NURBS contours adapt deterministically and never exceed curve or vertex caps', () => {
  const width = 17;
  const height = 17;
  const heights = new Float32Array(width * height);
  const positions = new Float32Array(width * height * 3);
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const index = row * width + column;
      const elevation = row * 32 + column * 2;
      heights[index] = elevation;
      positions.set([column, elevation * 0.1, -row], index * 3);
    }
  }
  const options = {
    contourSpacingMeters: 1,
    maximumContourLevels: 4,
    maximumNurbsCurves: 3,
    maximumSampledVertices: 64,
  };
  const first = createTerrainNurbsContourGeometry(THREE, { width, height, heights, positions }, options);
  const second = createTerrainNurbsContourGeometry(THREE, { width, height, heights, positions }, options);
  assert.ok(first.telemetry.effectiveContourSpacingMeters > 1);
  assert.ok(first.telemetry.selectedLevelCount <= 4);
  assert.equal(first.telemetry.levelCapApplied, true);
  assert.ok(first.telemetry.omittedLevelCount > 0);
  assert.ok(first.telemetry.nurbsCurveCount <= 3);
  assert.ok(first.telemetry.sampledVertexCount <= 64);
  assert.equal(first.telemetry.capped, true);
  assert.equal(first.telemetry.topologyPolicy, 'exact-degree-one-nurbs-polyline');
  assert.equal(first.telemetry.maximumSourcePathDeviationMeters, 0);
  assert.deepEqual(first.telemetry, second.telemetry);
  assert.deepEqual(
    Array.from(first.minor.getAttribute('position').array),
    Array.from(second.minor.getAttribute('position').array),
  );
  first.minor.dispose();
  first.major.dispose();
  second.minor.dispose();
  second.major.dispose();
});

test('flat terrain stays transparent without inventing checkerboard contour curves', () => {
  const flat = createTerrainNurbsContourGeometry(THREE, {
    width: 3,
    height: 3,
    heights: new Float32Array(9).fill(100),
    positions: new Float32Array([
      -1, 0, 1, 0, 0, 1, 1, 0, 1,
      -1, 0, 0, 0, 0, 0, 1, 0, 0,
      -1, 0, -1, 0, 0, -1, 1, 0, -1,
    ]),
  });
  assert.equal(flat.telemetry.selectedLevelCount, 0);
  assert.equal(flat.telemetry.nurbsCurveCount, 0);
  assert.equal(flat.telemetry.sampledVertexCount, 0);
  assert.equal(flat.minor.getAttribute('position').count, 0);
  assert.equal(flat.major.getAttribute('position').count, 0);
  flat.minor.dispose();
  flat.major.dispose();
});

test('world renderer uses transparent NURBS terrain and a licensed optimized motorcycle model', () => {
  const scene = new THREE.Scene();
  const terrain = makeTerrain();
  const physics = makePhysics();
  const modelInstance = makeModelInstance();
  const renderer = createMotorcycleWorldRenderer({
    THREE,
    scene,
    terrain,
    sceneData: makeSceneData(),
    world: physics,
    rig: physics.rig,
    raceCourse: makeRaceCourse(),
    maximumRoadSegments: 2,
    maximumBuildings: 1,
    maximumMotorcycleParticles: 5,
    maximumContactMarkers: 1,
    maximumTrafficVehicles: 2,
    motorcycleModelInstance: modelInstance,
  });
  assert.equal(renderer.root.parent, scene);
  const initial = renderer.getTelemetry();
  assert.deepEqual(renderer.getStatus(), initial);
  assert.equal(initial.terrain.source.id, 'noaa-etopo2022');
  assert.equal(initial.terrain.authoritative, true);
  assert.equal(initial.terrain.style, 'transparent-terrain-with-bounded-nurbs-contours');
  assert.equal(initial.terrain.surfaceOpacity, 0.035);
  assert.equal(initial.terrain.contours.curveModel, 'NURBS');
  assert.ok(initial.terrain.contours.nurbsCurveCount > 0);
  assert.ok(initial.terrain.contours.sampledVertexCount <= 60_000);
  assert.equal(initial.roads.renderedSegmentCount, 2);
  assert.equal(initial.roads.rendererCapOmittedCount, 1);
  assert.equal(initial.roads.totalKnownOmittedCount, 3);
  assert.equal(initial.buildings.renderedBuildingCount, 1);
  assert.equal(initial.buildings.sceneOmittedCount, 2);
  assert.equal(initial.motorcycle.componentCount, 6);
  assert.equal(initial.motorcycle.sourceParticleCount, 12);
  assert.equal(initial.motorcycle.renderedParticleCount, 0);
  assert.equal(initial.motorcycle.rendererCapOmittedCount, 0);
  assert.equal(initial.motorcycle.debugDisabledOmittedCount, 12);
  assert.equal(initial.motorcycle.style, 'licensed-optimized-akira-model');
  assert.equal(initial.motorcycle.physicsAuthority, 'six-body-particle-rigid');
  assert.equal(initial.motorcycle.collisionAuthority, false);
  assert.equal(initial.motorcycle.model.assetId, 'akira-bike-ryanwill679-optimized-v1');
  assert.equal(initial.motorcycle.model.sharedResources, true);
  assert.equal(initial.motorcycle.physicsDebugEnabled, false);
  assert.equal(initial.contacts.sourceContactCount, 2);
  assert.equal(initial.contacts.renderedContactCount, 0);
  assert.equal(initial.contacts.rendererCapOmittedCount, 0);
  assert.equal(initial.contacts.debugDisabledOmittedCount, 2);
  assert.equal(initial.contacts.physicsDebugEnabled, false);
  assert.equal(initial.contacts.derivedVisualization, true);
  assert.equal(initial.contacts.category, 'physics-contact');
  assert.equal(initial.race.truthStatus, 'closed-loop');
  assert.equal(initial.race.gateCount, 4);
  assert.equal(initial.race.renderedGateCount, 4);
  assert.equal(initial.race.navigationGrade, false);
  assert.equal(initial.race.offscreenGateCulling, true);
  const raceGateRoot = renderer.root.getObjectByName('motorcycle-race-gates');
  assert.equal(raceGateRoot.children.length, 4);
  let raceBeamCount = 0;
  raceGateRoot.traverse((object) => {
    if (!object.isMesh) return;
    raceBeamCount += 1;
    assert.equal(object.frustumCulled, true);
  });
  assert.equal(raceBeamCount, 12);

  const roadColors = [];
  renderer.root.getObjectByName('motorcycle-osm-road-ribbons').traverse((object) => {
    if (object.isMesh) roadColors.push(object.material.color.getHex());
  });
  assert.equal(new Set(roadColors).size, 2, 'rendered road categories retain distinct neon colors');
  const modelBike = renderer.root.getObjectByName('motorcycle-licensed-model-bike');
  assert.ok(modelBike);
  assert.ok(modelBike.getObjectByName('test-licensed-motorcycle-model'));
  assert.equal(renderer.root.getObjectByName('motorcycle-minimal-nurbs-line-bike'), undefined);
  assert.equal(renderer.root.getObjectByName('motorcycle-debug-particle-clouds'), undefined);
  assert.equal(renderer.root.getObjectByName('motorcycle-contact-marker-instances'), undefined);
  const terrainRoot = renderer.root.getObjectByName('motorcycle-real-topographic-terrain');
  assert.equal(terrainRoot.getObjectByName('motorcycle-transparent-terrain-surface').material.transparent, true);
  assert.ok(terrainRoot.getObjectByName('motorcycle-terrain-nurbs-contours').children.length > 0);
  assert.ok(terrainRoot.getObjectByName('motorcycle-terrain-nurbs-contours').children.length <= 4);
  assert.equal(
    terrainRoot.getObjectByName('motorcycle-transparent-terrain-surface').material.polygonOffset,
    true,
  );
  const beforePosition = renderer.root
    .getObjectByName('motorcycle-physics-body-chassis-model-pose').position.clone();
  const particleCallsAfterConstruction = physics.getParticleTransformCallCount();
  const interpolationCallsAfterConstruction = physics.getInterpolatedTransformCallCount();
  physics.setOffset(5);
  physics.setContactCount(0);
  const interpolatedTransforms = physics.getInterpolatedTransforms(0.5);
  const updated = renderer.update({
    alpha: 0.5,
    trafficSnapshot: trafficSnapshot(3),
    interpolatedTransforms,
  });
  const afterPosition = renderer.root
    .getObjectByName('motorcycle-physics-body-chassis-model-pose').position.clone();
  assert.ok(afterPosition.x - beforePosition.x > 5.49, 'model pose follows interpolated chassis physics');
  assert.equal(
    physics.getParticleTransformCallCount(),
    particleCallsAfterConstruction,
    'default line rendering does not sample dense collision particles each frame',
  );
  assert.equal(
    physics.getInterpolatedTransformCallCount(),
    interpolationCallsAfterConstruction + 1,
    'a caller-provided interpolation snapshot is reused instead of rebuilt',
  );
  assert.equal(updated.frameCount, 1);
  assert.equal(updated.motorcycle.renderedParticleCount, 0);
  assert.equal(updated.contacts.renderedContactCount, 0);
  assert.equal(updated.contacts.sourceContactCount, 0, 'disabled contact telemetry still refreshes each frame');
  assert.equal(updated.contacts.debugDisabledOmittedCount, 0);
  assert.equal(updated.limits.maximumContactMarkers, 1);
  assert.equal(updated.traffic.snapshotVehicleCount, 3);
  assert.equal(updated.traffic.renderedVehicleCount, 2);
  assert.equal(updated.traffic.rendererCapOmittedCount, 1);
  assert.equal(updated.traffic.invalidOmittedCount, 0);
  assert.equal(updated.traffic.synthetic, true);
  assert.equal(updated.traffic.liveTraffic, false);
  assert.equal(updated.traffic.provenance.geometrySource, 'OpenStreetMap-derived directed road geometry');
  assert.equal(renderer.update({
    alpha: 0.5,
    interpolatedTransforms,
    trafficSnapshot: trafficSnapshot(3),
    collectTelemetry: false,
  }), 2);
  assert.throws(() => renderer.update({ collectTelemetry: 'yes' }), /collectTelemetry/u);
  const trafficMeshes = renderer.root.getObjectByName('motorcycle-synthetic-traffic').children;
  assert.equal(trafficMeshes.reduce((sum, mesh) => sum + mesh.count, 0), 2);
  assert.equal(new Set(trafficMeshes.filter((mesh) => mesh.count > 0).map((mesh) => mesh.material.color.getHex())).size, 2);
  const northbound = trafficMeshes.find((mesh) => mesh.name === 'motorcycle-traffic-cyan');
  const northboundMatrix = new THREE.Matrix4();
  northbound.getMatrixAt(0, northboundMatrix);
  const northboundQuaternion = new THREE.Quaternion();
  northboundMatrix.decompose(new THREE.Vector3(), northboundQuaternion, new THREE.Vector3());
  const expectedNorthbound = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  assert.ok(
    Math.abs(northboundQuaternion.dot(expectedNorthbound)) > 1 - 1e-6,
    'geodetic north traffic must face local -Z like its physical collision cage',
  );

  const shifted = renderer.shiftOrigin([25, 0, -12]);
  assert.deepEqual(shifted, [25, 0, -12]);
  assert.deepEqual(renderer.getTelemetry().origin.offset, [25, 0, -12]);
  const geospatialPosition = renderer.root
    .getObjectByName('motorcycle-geospatial-origin').position.toArray();
  assert.ok(Math.abs(geospatialPosition[0] + 25) < 1e-9);
  assert.ok(Math.abs(geospatialPosition[1]) < 1e-9);
  assert.ok(Math.abs(geospatialPosition[2] - 12) < 1e-9);
  assert.ok(
    Math.abs(renderer.root.getObjectByName('motorcycle-race-course').parent.position.x + 25) < 1e-9,
    'race gates share the rebased geospatial root',
  );
  assert.equal(
    renderer.root.getObjectByName('motorcycle-licensed-model-bike').position.x,
    0,
    'model transforms are already shifted by the physics authority',
  );

  assert.throws(
    () => renderer.update({ trafficSnapshot: { ...trafficSnapshot(1), provenance: { synthetic: false } } }),
    /provenance/,
  );
  const watchedGeometry = renderer.root.getObjectByName('motorcycle-transparent-terrain-surface').geometry;
  let disposedGeometry = false;
  let disposedModelGeometry = false;
  watchedGeometry.addEventListener('dispose', () => { disposedGeometry = true; });
  modelInstance.geometry.addEventListener('dispose', () => { disposedModelGeometry = true; });
  assert.equal(renderer.dispose(), true);
  assert.equal(renderer.root.parent, null);
  assert.equal(disposedGeometry, true);
  assert.equal(disposedModelGeometry, false, 'location disposal leaves shared model assets to their owner');
  assert.equal(modelInstance.releaseCount, 1);
  assert.equal(renderer.getTelemetry().disposed, true);
  assert.equal(renderer.getTelemetry().disposal.geometries > 0, true);
  assert.equal(renderer.dispose(), false);
  assert.throws(() => renderer.update(), /disposed/);
  assert.throws(() => renderer.shiftOrigin([1, 0, 0]), /disposed/);
});

test('renderer hard-clamps terrain work even when material options request larger limits', () => {
  const scene = new THREE.Scene();
  const physics = makePhysics();
  const renderer = createMotorcycleWorldRenderer({
    THREE,
    scene,
    terrain: makeTerrain(),
    sceneData: makeSceneData(),
    world: physics,
    rig: physics.rig,
    raceCourse: makeRaceCourse(),
    maximumTrafficVehicles: 0,
    terrainMaterial: {
      maximumContourLevels: 512,
      maximumNurbsCurves: 4_096,
      maximumSampledVertices: 500_000,
    },
    motorcycleModelInstance: makeModelInstance(),
  });
  const status = renderer.getTelemetry();
  assert.equal(status.terrain.contours.maximumContourLevels, 96);
  assert.equal(status.terrain.contours.maximumNurbsCurves, 512);
  assert.equal(status.terrain.contours.maximumSampledVertices, 60_000);
  assert.equal(status.limits.maximumTerrainContourLevels, 96);
  assert.equal(status.limits.maximumTerrainNurbsCurves, 512);
  assert.equal(status.limits.maximumTerrainContourVertices, 60_000);
  renderer.dispose();
});

test('renderer consumes the real six-body particle motorcycle as chassis-driven model presentation', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { gravity: [0, 0, 0], maxParticles: 512 },
    rigOptions: { id: 'render-contract-bike' },
  });
  const scene = new THREE.Scene();
  const renderer = createMotorcycleWorldRenderer(THREE, {
    scene,
    terrain: makeTerrain(),
    sceneData: makeSceneData(),
    physicsWorld: game.world,
    rig: game.rig,
    raceCourse: makeRaceCourse(),
    maximumTrafficVehicles: 0,
    motorcycleModelInstance: makeModelInstance(),
  });
  const initial = renderer.getTelemetry().motorcycle;
  assert.equal(initial.componentCount, 6);
  assert.equal(initial.bodyTransformCount, 1);
  assert.ok(initial.sourceParticleCount > 50);
  assert.equal(initial.renderedParticleCount, 0);
  assert.equal(initial.poseBodyId, game.rig.bodyIds.chassis);
  assert.equal(initial.style, 'licensed-optimized-akira-model');
  assert.equal(initial.physicsAuthority, 'six-body-particle-rigid');
  assert.equal(renderer.getTelemetry().contacts.sourceContactCount, 0);
  game.stepFrame(1 / 120, { sequence: 1, throttle: 0.2 });
  const updated = renderer.update({ alpha: 0.25 });
  assert.equal(updated.motorcycle.renderedParticleCount, 0);
  assert.equal(updated.motorcycle.invalidOmittedCount, 0);
  renderer.dispose();
  game.dispose();
});

test('physics debug mode remains explicit, capped, and separate from the licensed model', () => {
  const scene = new THREE.Scene();
  const physics = makePhysics();
  const renderer = createMotorcycleWorldRenderer({
    THREE,
    scene,
    terrain: makeTerrain(),
    sceneData: makeSceneData(),
    world: physics,
    rig: physics.rig,
    raceCourse: makeRaceCourse(),
    physicsDebug: true,
    maximumMotorcycleParticles: 5,
    maximumContactMarkers: 1,
    maximumTrafficVehicles: 0,
    motorcycleModelInstance: makeModelInstance(),
  });
  const status = renderer.getTelemetry();
  assert.equal(status.motorcycle.physicsDebugEnabled, true);
  assert.equal(status.motorcycle.renderedParticleCount, 5);
  assert.equal(status.motorcycle.rendererCapOmittedCount, 7);
  assert.equal(status.contacts.physicsDebugEnabled, true);
  assert.equal(status.contacts.renderedContactCount, 1);
  assert.ok(renderer.root.getObjectByName('motorcycle-debug-particle-instances'));
  assert.ok(renderer.root.getObjectByName('motorcycle-contact-marker-instances'));
  renderer.dispose();
});
