import test from 'node:test';
import assert from 'node:assert/strict';
import { GEODATA_LIMITS } from '../src/config.js';
import { parseAndSnapBbox } from '../src/osm/bbox.js';
import { normalizeOverpassRegion } from '../src/osm/normalize.js';
import { deriveRoadSemantics } from '../src/osm/semantics.js';
import { createOverpassFixture } from './fixture.js';

function normalize(payload = createOverpassFixture(), limits = GEODATA_LIMITS) {
  return normalizeOverpassRegion(payload, {
    bbox: parseAndSnapBbox('-0.02,-0.02,0.04,0.04', limits),
    layers: ['roads', 'buildings'],
    vehicle: 'motorcycle',
    limits
  });
}

test('normalization is deterministic across upstream element and relation-member order', () => {
  const original = createOverpassFixture();
  const reordered = createOverpassFixture();
  reordered.elements.reverse();
  const relation = reordered.elements.find((element) => element.type === 'relation');
  relation.members.reverse();
  assert.equal(JSON.stringify(normalize(original)), JSON.stringify(normalize(reordered)));
});

test('roads retain raw tags, aligned OSM node IDs, units, and stable feature ordering', () => {
  const region = normalize();
  assert.deepEqual(region.roads.features.map((feature) => feature.id), [
    'way/100', 'way/200', 'way/300', 'way/400'
  ]);
  const road = region.roads.features.find((feature) => feature.id === 'way/200');
  assert.deepEqual(road.properties.orderedNodeIds, ['1', '2', '3']);
  assert.deepEqual(Object.keys(road.properties.rawTags), [
    'highway', 'lanes', 'maxspeed', 'name', 'surface'
  ]);
  assert.equal(road.properties.semantics.maxspeed.kph, 48.28);
  assert.equal(road.properties.semantics.lanes, 2);
  assert.equal(road.properties.semantics.surface, 'asphalt');
});

test('road graph is directed, vehicle-filtered, and never joins coordinate-only crossings', () => {
  const graph = normalize().roadGraph;
  assert.equal(graph.schemaVersion, 'peercompute.geo.road-graph.v1');
  assert.equal(graph.navigationGrade, false);
  assert.equal(graph.sourceWayCount, 4);
  assert.equal(graph.eligibleWayCount, 3);
  assert.equal(graph.excludedWayCount, 1);
  assert.equal(graph.edges.length, 9);
  assert.equal(graph.nodes.some((node) => node.id === 'node/10'), false, 'footway omitted from vehicle graph');

  const crossingA = graph.nodes.find((node) => node.id === 'node/2');
  const crossingB = graph.nodes.find((node) => node.id === 'node/4');
  assert.deepEqual(crossingA.coordinates, crossingB.coordinates);
  assert.notDeepEqual(crossingA.outgoingEdgeIds, crossingB.outgoingEdgeIds);
  assert.equal(graph.edges.some((edge) => edge.from === 'node/2' && edge.to === 'node/4'), false);

  const reverse = graph.edges.find((edge) => edge.id === 'way/300/segment/0/reverse');
  assert.equal(reverse.from, 'node/9');
  assert.equal(reverse.to, 'node/8');
  assert.equal(graph.edges.some((edge) => edge.id === 'way/300/segment/0/forward'), false);
});

test('road graph applies implied motorway direction and the OSM access specificity hierarchy', () => {
  const motorway = createOverpassFixture();
  motorway.elements.find((element) => element.id === 100).tags = { highway: 'motorway' };
  const motorwayEdges = normalize(motorway).roadGraph.edges
    .filter((edge) => edge.osmWayId === '100');
  assert.equal(motorwayEdges.length, 2);
  assert.equal(motorwayEdges.every((edge) => edge.direction === 'forward'), true);

  const vehicleOverride = createOverpassFixture();
  vehicleOverride.elements.find((element) => element.id === 100).tags = {
    highway: 'secondary',
    access: 'no',
    vehicle: 'yes'
  };
  assert.equal(
    normalize(vehicleOverride).roadGraph.edges.filter((edge) => edge.osmWayId === '100').length,
    4
  );

  const motorVehicleOverride = createOverpassFixture();
  motorVehicleOverride.elements.find((element) => element.id === 100).tags = {
    highway: 'secondary',
    access: 'no',
    vehicle: 'no',
    motor_vehicle: 'yes'
  };
  assert.equal(
    normalize(motorVehicleOverride).roadGraph.edges.filter((edge) => edge.osmWayId === '100').length,
    4
  );

  const motorcycleDenial = createOverpassFixture();
  motorcycleDenial.elements.find((element) => element.id === 100).tags = {
    highway: 'secondary',
    access: 'yes',
    motor_vehicle: 'yes',
    motorcycle: 'no'
  };
  assert.equal(
    normalize(motorcycleDenial).roadGraph.edges.some((edge) => edge.osmWayId === '100'),
    false
  );
});

test('road semantics retain roundabout, structure, layer, lane, and metric-speed meaning', () => {
  const semantics = deriveRoadSemantics({
    highway: 'primary',
    junction: 'roundabout',
    bridge: 'yes',
    tunnel: 'building_passage',
    layer: '-2',
    lanes: '3',
    maxspeed: '50 km/h',
    surface: 'concrete'
  });
  assert.equal(semantics.oneway, 'forward');
  assert.equal(semantics.bridge, 'yes');
  assert.equal(semantics.tunnel, 'building_passage');
  assert.equal(semantics.layer, -2);
  assert.equal(semantics.lanes, 3);
  assert.equal(semantics.maxspeed.kph, 50);
  assert.equal(semantics.surface, 'concrete');
});

test('road graph preserves bounded OSM turn restrictions without claiming navigation authority', () => {
  const graph = normalize().roadGraph;
  assert.equal(graph.restrictions.length, 1);
  assert.deepEqual(graph.restrictionCoverage, {
    sourceRelationCount: 1,
    machineEvaluableCount: 1,
    unresolvedCount: 0,
    conditionalEvaluated: false,
    navigationGrade: false,
  });
  const restriction = graph.restrictions[0];
  assert.equal(restriction.id, 'relation/700');
  assert.equal(restriction.restriction, 'no_u_turn');
  assert.equal(restriction.mode, 'prohibited-transition');
  assert.equal(restriction.viaNodeId, 'node/1');
  assert.equal(restriction.machineEvaluable, true);
  assert.equal(restriction.navigationGrade, false);
  assert.equal(restriction.fromEdgeIds.length, 1);
  assert.equal(restriction.toEdgeIds.length, 1);

  const conditional = createOverpassFixture();
  conditional.elements.find((element) => element.id === 700)
    .tags['restriction:conditional'] = 'no_u_turn @ (Mo-Fr 07:00-09:00)';
  const unresolved = normalize(conditional).roadGraph.restrictions[0];
  assert.equal(unresolved.machineEvaluable, false);
  assert.match(unresolved.issues.join(','), /conditional-restriction-not-evaluated/u);
});

test('buildings normalize explicit, level-derived, and category-default heights plus relation topology', () => {
  const buildings = normalize().buildings.features;
  assert.deepEqual(buildings.map((feature) => feature.id), [
    'relation/600', 'way/500', 'way/501', 'way/502'
  ]);
  assert.equal(buildings.some((feature) => feature.id === 'way/601'), false, 'relation member is not duplicated');

  const relation = buildings.find((feature) => feature.id === 'relation/600');
  assert.equal(relation.geometry.type, 'Polygon');
  assert.equal(relation.geometry.coordinates.length, 2);
  assert.deepEqual(relation.properties.memberWayIds, ['601', '602', '603']);
  assert.equal(relation.properties.orderedNodeIdsComplete, true);
  assert.deepEqual(relation.properties.memberWays, [
    { osmWayId: '603', role: 'inner', orderedNodeIds: ['70', '71', '72', '73', '70'] },
    { osmWayId: '601', role: 'outer', orderedNodeIds: ['60', '61', '62'] },
    { osmWayId: '602', role: 'outer', orderedNodeIds: ['62', '63', '60'] }
  ]);
  assert.deepEqual(relation.properties.orderedNodeIds, [
    '70', '71', '72', '73', '70',
    '60', '61', '62',
    '62', '63', '60'
  ]);
  assert.equal(relation.properties.heights.heightMeters, 15);
  assert.equal(relation.properties.heights.heightProvenance, 'source-height');

  const feet = buildings.find((feature) => feature.id === 'way/500');
  assert.equal(feet.properties.heights.heightMeters, 12.192);
  assert.equal(feet.properties.heights.heightProvenance, 'source-height');
  assert.deepEqual(feet.properties.orderedNodeIds, ['31', '32', '33', '34', '31']);

  const levels = buildings.find((feature) => feature.id === 'way/501');
  assert.equal(levels.properties.heights.heightMeters, 12);
  assert.equal(levels.properties.heights.heightProvenance, 'building-levels-times-3m');

  const fallback = buildings.find((feature) => feature.id === 'way/502');
  assert.equal(fallback.properties.heights.heightMeters, 3);
  assert.equal(fallback.properties.heights.heightProvenance, 'clamped-category-default');
});

test('normalization carries source base time, bbox orders, counts, and explicit no-timestamp note', () => {
  const region = normalize();
  assert.equal(region.sourceBaseTimestamp, '2026-08-23T20:00:00.000Z');
  assert.deepEqual(region.bbox, [-0.02, -0.02, 0.04, 0.04]);
  assert.deepEqual(region.geoJsonBbox, [-0.02, -0.02, 0.04, 0.04]);
  assert.equal(region.counts.roadWays, 4);
  assert.equal(region.counts.buildings, 4);
  assert.equal(region.counts.directedGraphEdges, 9);
  assert.equal(region.counts.restrictionRelations, 1);
  assert.equal(region.counts.machineEvaluableRestrictions, 1);

  const noTimestamp = createOverpassFixture();
  delete noTimestamp.osm3s.timestamp_osm_base;
  assert.match(normalize(noTimestamp).notes[0], /did not include/u);
});

test('normalization fails closed on category, node, edge, and aligned-geometry bounds', () => {
  assert.throws(() => normalize(createOverpassFixture(), {
    ...GEODATA_LIMITS,
    maxRoadWays: 1
  }), (error) => error.code === 'REGION_RESULT_LIMIT_EXCEEDED');
  assert.throws(() => normalize(createOverpassFixture(), {
    ...GEODATA_LIMITS,
    maxRestrictionRelations: 0
  }), (error) => error.code === 'REGION_RESULT_LIMIT_EXCEEDED');
  assert.throws(() => normalize(createOverpassFixture(), {
    ...GEODATA_LIMITS,
    maxBuildings: 1
  }), (error) => error.code === 'REGION_RESULT_LIMIT_EXCEEDED');
  assert.throws(() => normalize(createOverpassFixture(), {
    ...GEODATA_LIMITS,
    maxUniqueNodes: 2
  }), (error) => error.code === 'REGION_RESULT_LIMIT_EXCEEDED');
  assert.throws(() => normalize(createOverpassFixture(), {
    ...GEODATA_LIMITS,
    maxDirectedGraphEdges: 1
  }), (error) => error.code === 'REGION_RESULT_LIMIT_EXCEEDED');

  const malformed = createOverpassFixture();
  malformed.elements.find((element) => element.id === 200).nodes.pop();
  assert.throws(() => normalize(malformed), (error) => error.code === 'UPSTREAM_SCHEMA_INVALID');
});
