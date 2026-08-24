import assert from 'node:assert/strict';
import test from 'node:test';

import {
  deriveRoadRaceCourse,
  RACE_COURSE_PROVENANCE,
  ROAD_RACE_COURSE_SCHEMA,
} from '../../src/race/index.js';
import { GEODATA_LIMITS } from '../../../../services/geodata/src/config.js';
import { parseAndSnapBbox } from '../../../../services/geodata/src/osm/bbox.js';
import { normalizeOverpassRegion } from '../../../../services/geodata/src/osm/normalize.js';
import { createOverpassFixture } from '../../../../services/geodata/test/fixture.js';
import { createMotorcycleSceneData } from '../../src/world/sceneData.js';
import { createDerivedFlatTerrainGrid } from '../../src/world/terrainGrid.js';
import {
  createLocalRoadGraph,
  createOpenLineGraph,
  createOutAndBackGraph,
  createSquareLoopGraph,
} from './fixtures.mjs';

function assertFiniteNumbers(value, path = 'value') {
  if (typeof value === 'number') {
    assert.equal(Number.isFinite(value), true, `${path} must be finite`);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) assertFiniteNumbers(child, `${path}.${key}`);
}

function assertDeepFrozen(value, path = 'value') {
  if (!value || typeof value !== 'object') return;
  assert.equal(Object.isFrozen(value), true, `${path} must be frozen`);
  for (const [key, child] of Object.entries(value)) assertDeepFrozen(child, `${path}.${key}`);
}

test('closed-loop selection and gate output are deterministic across input ordering', () => {
  const options = {
    gateCount: 4,
    sourceStatus: 'current',
    sourceProvenance: {
      attribution: '© OpenStreetMap contributors',
      licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/',
      sourceBaseTimestamp: '2026-08-23T20:00:00Z',
    },
  };
  const first = deriveRoadRaceCourse(createSquareLoopGraph(), options);
  const reordered = deriveRoadRaceCourse(createSquareLoopGraph({ reverseInput: true }), options);

  assert.deepEqual(first, reordered);
  assert.equal(first.schemaVersion, ROAD_RACE_COURSE_SCHEMA);
  assert.equal(first.truthStatus, 'closed-loop');
  assert.equal(first.closed, true);
  assert.equal(first.lapCapable, true);
  assert.equal(first.fallback, false);
  assert.deepEqual(first.route.edgeIds, [
    'edge/a-b',
    'edge/b-c',
    'edge/c-d',
    'edge/d-a',
  ]);
  assert.equal(first.route.distanceMeters, 400);
  assert.equal(first.gates.length, 4);
  assert.notEqual(first.id, deriveRoadRaceCourse(createSquareLoopGraph(), { gateCount: 3 }).id);
  assert.equal(JSON.stringify(first).includes('[object Map]'), false);
});

test('ordered gates expose stable local/WGS84 headings, corridors, and bright render geometry', () => {
  const course = deriveRoadRaceCourse(createSquareLoopGraph(), { gateCount: 4 });
  course.gates.forEach((gate, index) => {
    assert.equal(gate.order, index);
    assert.equal(gate.positionLocal.length, 3);
    assert.equal(gate.positionWgs84.length, 2);
    assert.equal(gate.crossing.direction, 'forward-only');
    assert.ok(gate.crossing.widthMeters > 0);
    assert.ok(gate.render.emissiveIntensity >= 4);
    assert.match(gate.render.color, /^#[0-9A-F]{6}$/u);
    assert.equal(gate.render.leftPostBaseLocal.length, 3);
    assert.equal(gate.render.rightPostTopLocal.length, 3);
    assert.ok(Number.isFinite(gate.headingRadiansLocal));
    assert.ok(Number.isFinite(gate.headingRadiansWgs84));
  });
  assert.equal(course.gates[0].kind, 'start-finish');
  assert.equal(course.source.data, 'real OSM road graph');
  assert.equal(course.source.synthetic, false);
  assert.equal(course.source.navigationGrade, false);
  assert.equal(course.provenance, RACE_COURSE_PROVENANCE);
  assert.equal(course.provenance.courseNature, 'game-derived course');
  assert.match(course.provenance.disclaimer, /not for navigation/u);
  assertFiniteNumbers(course);
  assertDeepFrozen(course);
});

test('falls back truthfully to graph-authorized out-and-back, then to single-pass open course', () => {
  const outAndBack = deriveRoadRaceCourse(createOutAndBackGraph(), { gateCount: 4 });
  assert.equal(outAndBack.truthStatus, 'fallback-out-and-back');
  assert.equal(outAndBack.fallback, true);
  assert.equal(outAndBack.closed, true);
  assert.equal(outAndBack.lapCapable, true);
  assert.deepEqual(outAndBack.route.edgeIds, ['edge/a-b', 'edge/b-a']);
  assert.match(outAndBack.selectionReason, /outbound and reverse/u);

  const open = deriveRoadRaceCourse(createOpenLineGraph(), { gateCount: 5 });
  assert.equal(open.truthStatus, 'fallback-open');
  assert.equal(open.fallback, true);
  assert.equal(open.closed, false);
  assert.equal(open.lapCapable, false);
  assert.equal(open.raceMode, 'single-pass');
  assert.deepEqual(open.route.edgeIds, ['edge/a-b', 'edge/b-c']);
  assert.equal(open.gates[0].kind, 'start');
  assert.equal(open.gates.at(-1).kind, 'finish');
  assert.match(open.selectionReason, /single-pass open course/u);
});

test('raw canonical graph gets an explicit deterministic flat-local projection fallback', () => {
  const local = createSquareLoopGraph();
  const sourceBefore = structuredClone(local.sourceRoadGraph);
  const course = deriveRoadRaceCourse(local.sourceRoadGraph, { gateCount: 4 });
  assert.equal(course.projection.kind, 'derived-flat-local-tangent');
  assert.equal(course.projection.originWgs84.length, 2);
  assert.ok(course.route.points.every((point) => point.positionLocal.every(Number.isFinite)));
  assert.deepEqual(local.sourceRoadGraph, sourceBefore, 'course derivation must not mutate the canonical graph');
});

test('accepts the actual normalized real-OSM local graph contract used by the motorcycle scene', () => {
  const bbox = parseAndSnapBbox('-0.02,-0.02,0.04,0.04', GEODATA_LIMITS);
  const data = normalizeOverpassRegion(createOverpassFixture(), {
    bbox,
    layers: ['roads', 'buildings'],
    vehicle: 'motorcycle',
    limits: GEODATA_LIMITS,
  });
  const provenance = {
    attribution: '© OpenStreetMap contributors',
    licenseUrl: 'https://www.openstreetmap.org/copyright',
    sourceBaseTimestamp: data.sourceBaseTimestamp,
  };
  const scene = createMotorcycleSceneData({
    schemaVersion: 'peercompute.geo.osm-region.v1',
    source: 'openstreetmap-overpass',
    status: 'current',
    synthetic: false,
    bbox: { values: bbox.values },
    provenance,
    data,
  }, createDerivedFlatTerrainGrid({ bbox: [-0.02, -0.02, 0.04, 0.04] }));
  const course = deriveRoadRaceCourse(scene.localGraph, {
    gateCount: 4,
    sourceStatus: scene.status,
    sourceProvenance: scene.provenance,
  });

  assert.equal(course.projection.kind, 'localized-terrain-frame');
  assert.equal(course.source.schemaVersion, data.roadGraph.schemaVersion);
  assert.equal(course.source.graphNodeCount, data.roadGraph.nodes.length);
  assert.equal(course.source.graphDirectedEdgeCount, data.roadGraph.edges.length);
  assert.equal(course.source.status, 'current');
  assert.equal(course.source.sourceBaseTimestamp, data.sourceBaseTimestamp);
  assert.ok(course.route.edgeIds.every((edgeId) => data.roadGraph.edges.some((edge) => edge.id === edgeId)));
});

test('graph schema, adjacency, finite values, access, and explicit caps fail closed', () => {
  const wrongSchema = createSquareLoopGraph();
  wrongSchema.sourceRoadGraph.schemaVersion = 'other';
  assert.throws(() => deriveRoadRaceCourse(wrongSchema), /schemaVersion/u);

  const wrongConnectivity = createSquareLoopGraph();
  wrongConnectivity.sourceRoadGraph.connectivity = 'coordinate-equality';
  assert.throws(() => deriveRoadRaceCourse(wrongConnectivity), /shared OSM node/u);

  const badAdjacency = createSquareLoopGraph();
  badAdjacency.sourceRoadGraph.nodes[0].outgoingEdgeIds = [];
  assert.throws(() => deriveRoadRaceCourse(badAdjacency), /adjacency/u);

  const nonFinite = createSquareLoopGraph();
  nonFinite.nodes[0].localPosition[0] = Number.NaN;
  assert.throws(() => deriveRoadRaceCourse(nonFinite), /finite/u);

  assert.throws(
    () => deriveRoadRaceCourse(createSquareLoopGraph(), { maxGraphNodes: 3 }),
    /node race cap/u,
  );
  assert.throws(
    () => deriveRoadRaceCourse(createSquareLoopGraph(), { maxGraphEdges: 3 }),
    /edge race cap/u,
  );
  assert.throws(
    () => deriveRoadRaceCourse(createSquareLoopGraph(), { maxGates: 65 }),
    /maxGates/u,
  );
  const oneEdgeCap = deriveRoadRaceCourse(createOpenLineGraph(), {
    maxCourseEdges: 1,
    gateCount: 2,
  });
  assert.equal(oneEdgeCap.route.edgeIds.length, 1);
  assert.equal(oneEdgeCap.caps.courseEdges, 1);

  const inaccessible = createLocalRoadGraph({
    nodes: [
      { id: 'node/a', localPosition: [0, 0, 0] },
      { id: 'node/b', localPosition: [20, 0, 0] },
    ],
    edges: [{ id: 'edge/private', from: 'node/a', to: 'node/b', access: 'private' }],
  });
  assert.throws(() => deriveRoadRaceCourse(inaccessible), /no bounded drivable motorcycle edge/u);
});

test('bounded loop-search exhaustion produces an explicit fallback instead of a false loop claim', () => {
  const course = deriveRoadRaceCourse(createSquareLoopGraph(), {
    maxSearchTransitions: 1,
    gateCount: 3,
  });
  assert.equal(course.truthStatus, 'fallback-open');
  assert.equal(course.selection.search.exhausted, true);
  assert.equal(course.selection.search.transitionCap, 1);
  assert.match(course.selectionReason, /No directed loop/u);
});
