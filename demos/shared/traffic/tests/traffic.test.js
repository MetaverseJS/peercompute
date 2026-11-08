import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRoadTrafficSimulation,
  LANE_GEOMETRY_PROVENANCE,
  ROAD_GRAPH_SCHEMA,
  TRAFFIC_LIMITS,
  TRAFFIC_PROVENANCE,
  TRAFFIC_SNAPSHOT_SCHEMA,
  TURN_RESTRICTION_PROVENANCE
} from '../index.js';
import {
  createJunctionGraph,
  createLoopGraph,
  createReciprocalLaneGraph,
  createRestrictionGraph,
  freezeRecursively
} from './fixtures.js';

function assertFiniteNumbers(value, path = 'snapshot') {
  if (typeof value === 'number') {
    assert.equal(Number.isFinite(value), true, `${path} must be finite`);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assertFiniteNumbers(child, `${path}.${key}`);
  }
}

function assertDeepFrozen(value, path = 'snapshot') {
  if (!value || typeof value !== 'object') return;
  assert.equal(Object.isFrozen(value), true, `${path} must be frozen`);
  for (const [key, child] of Object.entries(value)) {
    assertDeepFrozen(child, `${path}.${key}`);
  }
}

test('same graph, seed, controls, and frame deltas replay byte-for-byte', () => {
  const graph = createLoopGraph();
  const options = {
    seed: 'anchorage-traffic',
    vehicleCount: 5,
    fixedDtSeconds: 1 / 20,
    maxFrameDeltaSeconds: 0.2,
    maxSubsteps: 4
  };
  const left = createRoadTrafficSimulation(graph, options);
  const right = createRoadTrafficSimulation(graph, options);
  const deltas = [0.013, 0.08, 0.021, 0.2, 0.04, 0.1, 0.006];

  for (const delta of deltas) {
    assert.equal(
      JSON.stringify(left.advance(delta)),
      JSON.stringify(right.advance(delta))
    );
  }
  assert.deepEqual(left.getSnapshot(), right.getSnapshot());
});

test('WGS84 snapshots interpolate between fixed states and speed defaults stay bounded', () => {
  const graph = createLoopGraph();
  graph.edges[0].maxspeedKph = null;
  graph.edges[1].maxspeedKph = 300;
  const simulation = createRoadTrafficSimulation(graph, {
    seed: 11,
    vehicleCount: 2,
    spawnEdgeIds: ['edge/a-b', 'edge/b-c'],
    fixedDtSeconds: 0.1,
    maxFrameDeltaSeconds: 0.1,
    maxSubsteps: 1
  });
  const before = simulation.getSnapshot();
  simulation.advance(0.1);
  const current = simulation.getSnapshot();
  const halfway = simulation.getInterpolatedSnapshot(0.5);

  assert.equal(current.vehicles[0].speedLimitKph, 30);
  assert.equal(current.vehicles[0].speedLimitProvenance, 'bounded-highway-class-default');
  assert.equal(current.vehicles[1].speedLimitKph, 110);
  assert.equal(current.vehicles[1].speedLimitProvenance, 'reported-maxspeed-simulation-cap');
  for (let axis = 0; axis < 2; axis += 1) {
    const expected = (before.vehicles[0].coordinates[axis] + current.vehicles[0].coordinates[axis]) / 2;
    assert.ok(Math.abs(halfway.vehicles[0].coordinates[axis] - expected) < 1e-8);
  }
});

test('reported 1, 2, and 4 total lanes produce deterministic separated right-hand directional lane centers', () => {
  for (const reportedLanes of [1, 2, 4]) {
    const graph = createReciprocalLaneGraph({ lanes: reportedLanes });
    const options = {
      seed: `lanes-${reportedLanes}`,
      vehicleCount: 2,
      spawnEdgeIds: ['edge/eastbound', 'edge/westbound']
    };
    const snapshot = createRoadTrafficSimulation(graph, options).getSnapshot();
    const replay = createRoadTrafficSimulation(graph, options).getSnapshot();
    assert.equal(JSON.stringify(snapshot), JSON.stringify(replay));

    const eastbound = snapshot.vehicles.find((vehicle) => vehicle.edgeId === 'edge/eastbound');
    const westbound = snapshot.vehicles.find((vehicle) => vehicle.edgeId === 'edge/westbound');
    const expectedDirectionalLanes = reportedLanes === 4 ? 2 : 1;
    assert.equal(eastbound.reportedTotalLaneCount, reportedLanes);
    assert.equal(westbound.reportedTotalLaneCount, reportedLanes);
    assert.equal(eastbound.directionalLaneCount, expectedDirectionalLanes);
    assert.equal(westbound.directionalLaneCount, expectedDirectionalLanes);
    assert.ok(eastbound.coordinates[1] < eastbound.centerlineCoordinates[1], 'eastbound right is south');
    assert.ok(westbound.coordinates[1] > westbound.centerlineCoordinates[1], 'westbound right is north');
    assert.notEqual(eastbound.coordinates[1], westbound.coordinates[1]);
    assert.ok(Math.abs(eastbound.laneCenterOffsetMeters)
      <= TRAFFIC_LIMITS.absoluteMaxLaneCenterOffsetMeters);
    assert.equal(eastbound.lane.placement, 'right-of-directed-centerline');
    assert.equal(eastbound.lane.gameOnly, true);
    assert.equal(eastbound.lane.minimumExpandedForGame, reportedLanes === 1);
  }
});

test('one-way lane geometry remains centered for one lane and preserves source/derived semantics', () => {
  const simulation = createRoadTrafficSimulation(
    createReciprocalLaneGraph({ lanes: 1, oneWay: true }),
    { seed: 'one-way', vehicleCount: 1, spawnEdgeIds: ['edge/eastbound'] }
  );
  const snapshot = simulation.getSnapshot();
  const vehicle = snapshot.vehicles[0];
  assert.deepEqual(vehicle.coordinates, vehicle.centerlineCoordinates);
  assert.equal(vehicle.laneCenterOffsetMeters, 0);
  assert.equal(vehicle.lane.directionalLaneCount, 1);
  assert.equal(vehicle.lane.reciprocalDirection, false);
  assert.equal(vehicle.lane.placement, 'one-way-carriageway-centered-on-source-line');
  assert.equal(snapshot.telemetry.graph.laneCoverage.oneWayDirectedEdgeCount, 1);
  assert.equal(snapshot.telemetry.graph.laneCoverage.reciprocalDirectedEdgeCount, 0);
});

test('missing, fractional, and excessive source totals stay preserved while game lanes are disclosed and capped', () => {
  const missing = createRoadTrafficSimulation(
    createReciprocalLaneGraph({ lanes: null }),
    { vehicleCount: 1, spawnEdgeIds: ['edge/eastbound'] }
  ).getSnapshot().vehicles[0];
  assert.equal(missing.reportedTotalLaneCount, null);
  assert.equal(missing.lane.reportedTotalLaneCountProvenance, 'source-lanes-unavailable');
  assert.equal(missing.lane.derivedTotalLaneCount, 2);
  assert.equal(missing.lane.directionalLaneCount, 1);

  const fractionalSnapshot = createRoadTrafficSimulation(
    createReciprocalLaneGraph({ lanes: 1.5 }),
    { vehicleCount: 1, spawnEdgeIds: ['edge/eastbound'] }
  ).getSnapshot();
  const fractional = fractionalSnapshot.vehicles[0];
  assert.equal(fractional.reportedTotalLaneCount, 1.5);
  assert.equal(fractional.lane.derivedTotalLaneCount, 2);
  assert.equal(fractional.lane.sourceRoundedForGame, true);
  assert.equal(fractionalSnapshot.telemetry.graph.laneCoverage.fractionalTotalLaneCountEdgeCount, 2);

  const capped = createRoadTrafficSimulation(
    createReciprocalLaneGraph({ lanes: 99, oneWay: true }),
    { vehicleCount: 1, spawnEdgeIds: ['edge/eastbound'] }
  ).getSnapshot();
  assert.equal(capped.vehicles[0].reportedTotalLaneCount, 99);
  assert.equal(capped.vehicles[0].lane.derivedTotalLaneCount, TRAFFIC_LIMITS.absoluteMaxDerivedTotalLanes);
  assert.equal(capped.vehicles[0].lane.sourceCappedForGame, true);
  assert.equal(capped.telemetry.graph.laneCoverage.cappedDerivedLaneEdgeCount, 1);
  assert.equal(capped.telemetry.caps.maxLaneCenterOffsetMeters, 20);
});

test('vehicles follow directed shared-node adjacency and ignore access-denied and coordinate-only edges', () => {
  const simulation = createRoadTrafficSimulation(createJunctionGraph(), {
    seed: 7,
    vehicleCount: 1,
    spawnEdgeIds: ['edge/start'],
    fixedDtSeconds: 0.1,
    maxFrameDeltaSeconds: 0.1,
    maxSubsteps: 1
  });
  const initial = simulation.getSnapshot().vehicles[0];
  assert.equal(initial.edgeId, 'edge/start');
  assert.equal(initial.fromNodeId, 'node/a');
  assert.equal(initial.toNodeId, 'node/b');
  assert.equal(initial.speedLimitKph, 20);
  assert.ok(initial.speedMetersPerSecond <= 20 / 3.6);

  let vehicle = initial;
  for (let index = 0; index < 4 && vehicle.edgeId === 'edge/start'; index += 1) {
    simulation.advance(0.1);
    vehicle = simulation.getSnapshot().vehicles[0];
  }
  assert.ok(['edge/turn-east', 'edge/turn-north'].includes(vehicle.edgeId));
  assert.equal(vehicle.fromNodeId, 'node/b');
  assert.notEqual(vehicle.edgeId, 'edge/back', 'avoids an immediate U-turn when another turn exists');
  assert.notEqual(vehicle.edgeId, 'edge/access-denied');
  assert.notEqual(vehicle.edgeId, 'edge/crossing-only');
  assert.equal(simulation.getTelemetry().routeTransitionCount, 1);
});

test('machine-evaluable prohibited and only turn restrictions deterministically constrain transitions', () => {
  const cases = [
    { only: false, expected: 'edge/north', rejected: 'edge/east' },
    { only: true, expected: 'edge/east', rejected: 'edge/north' }
  ];
  for (const { only, expected, rejected } of cases) {
    const simulation = createRoadTrafficSimulation(createRestrictionGraph({ only }), {
      seed: `restriction-${only}`,
      vehicleCount: 1,
      spawnEdgeIds: ['edge/start'],
      fixedDtSeconds: 0.1,
      maxFrameDeltaSeconds: 0.1,
      maxSubsteps: 1
    });
    let vehicle = simulation.getSnapshot().vehicles[0];
    for (let step = 0; step < 10 && vehicle.edgeId === 'edge/start'; step += 1) {
      simulation.advance(0.1);
      vehicle = simulation.getSnapshot().vehicles[0];
    }
    assert.equal(vehicle.edgeId, expected);
    assert.notEqual(vehicle.edgeId, rejected);
    const telemetry = simulation.getTelemetry();
    assert.equal(telemetry.restrictionAppliedDecisionCount, 1);
    assert.equal(telemetry.restrictionBlockedCandidateCount, 1);
    assert.equal(telemetry.graph.restrictionCoverage.machineEvaluableCount, 1);
    assert.equal(telemetry.graph.restrictionCoverage.unresolvedCount, 0);
    assert.equal(
      only ? telemetry.onlyRestrictionDecisionCount : telemetry.prohibitedRestrictionDecisionCount,
      1
    );
  }
});

test('unresolved conditional restrictions are preserved and disclosed without being silently enforced', () => {
  const simulation = createRoadTrafficSimulation(createRestrictionGraph({ unresolved: true }), {
    seed: 'unresolved-restriction',
    vehicleCount: 1,
    spawnEdgeIds: ['edge/start'],
    fixedDtSeconds: 0.1,
    maxFrameDeltaSeconds: 0.1,
    maxSubsteps: 1
  });
  let vehicle = simulation.getSnapshot().vehicles[0];
  for (let step = 0; step < 10 && vehicle.edgeId === 'edge/start'; step += 1) {
    simulation.advance(0.1);
    vehicle = simulation.getSnapshot().vehicles[0];
  }
  assert.notEqual(vehicle.edgeId, 'edge/start', 'unresolved metadata does not invent a turn ban');
  const coverage = simulation.getTelemetry().graph.restrictionCoverage;
  assert.equal(coverage.totalCount, 1);
  assert.equal(coverage.machineEvaluableCount, 0);
  assert.equal(coverage.unresolvedCount, 1);
  assert.equal(coverage.declaredCoverageMatchesCompiled, true);
  assert.equal(coverage.unresolvedRestrictionDetailCount, 1);
  assert.equal(coverage.unresolvedRestrictionDetailOmittedCount, 0);
  assert.equal(coverage.unresolvedRestrictionDetails[0].id, 'relation/700');
  assert.equal(coverage.unresolvedRestrictionDetails[0].conditionalRaw, 'no_right_turn @ (Mo-Fr 07:00-09:00)');
  assert.match(coverage.unresolvedRestrictionDetails[0].issues.join(','), /conditional-restriction-not-evaluated/u);
  assert.equal(simulation.getTelemetry().restrictionAppliedDecisionCount, 0);
});

test('vehicle, frame-delta, substep, transition, graph-node, and graph-edge work is bounded', () => {
  const graph = createLoopGraph({ edgeLengthMeters: 0.01 });
  const simulation = createRoadTrafficSimulation(graph, {
    seed: 3,
    vehicleCount: 999,
    maxVehicles: 3,
    fixedDtSeconds: 0.1,
    maxFrameDeltaSeconds: 0.25,
    maxSubsteps: 1,
    maxTransitionsPerVehicleStep: 1
  });
  assert.equal(simulation.getSnapshot().vehicleCount, 3);
  assert.equal(simulation.getTelemetry().vehicleCapApplied, true);

  simulation.advance(10);
  const telemetry = simulation.getTelemetry();
  assert.equal(telemetry.fixedStepCount, 1);
  assert.equal(telemetry.lastFrameSubsteps, 1);
  assert.equal(telemetry.lastAcceptedDeltaSeconds, 0.1);
  assert.equal(telemetry.lastDroppedDeltaSeconds, 9.9);
  assert.equal(telemetry.cappedFrameCount, 1);
  assert.equal(telemetry.transitionOverflowCount, 3);

  assert.throws(() => createRoadTrafficSimulation(graph, { maxGraphNodes: 2 }), /node simulation cap/u);
  assert.throws(() => createRoadTrafficSimulation(graph, { maxGraphEdges: 2 }), /edge simulation cap/u);
});

test('snapshots are finite, transitively immutable, input-safe, and explicitly synthetic/non-navigation', () => {
  const mutableGraph = createLoopGraph();
  const original = structuredClone(mutableGraph);
  const graph = freezeRecursively(mutableGraph);
  const simulation = createRoadTrafficSimulation(graph, { seed: 'provenance', vehicleCount: 2 });
  simulation.advance(0.1);
  const snapshot = simulation.getInterpolatedSnapshot(0.5);

  assert.deepEqual(graph, original, 'constructor and simulation never mutate the canonical graph');
  assert.equal(snapshot.schemaVersion, TRAFFIC_SNAPSHOT_SCHEMA);
  assert.equal(snapshot.provenance, TRAFFIC_PROVENANCE);
  assert.equal(snapshot.provenance.synthetic, true);
  assert.equal(snapshot.provenance.liveTraffic, false);
  assert.equal(snapshot.provenance.navigationGrade, false);
  assert.equal(snapshot.provenance.laneGeometry, LANE_GEOMETRY_PROVENANCE);
  assert.equal(snapshot.provenance.turnRestrictions, TURN_RESTRICTION_PROVENANCE);
  assert.equal(snapshot.provenance.laneGeometry.gameOnly, true);
  assert.equal(snapshot.provenance.laneGeometry.trafficSideAssumption, 'right-hand traffic');
  assert.equal(snapshot.provenance.turnRestrictions.conditionalEvaluated, false);
  assert.match(snapshot.provenance.disclaimer, /not for navigation/u);
  assert.equal(snapshot.telemetry.synthetic, true);
  assert.equal(snapshot.telemetry.liveTraffic, false);
  assert.equal(snapshot.telemetry.navigationGrade, false);
  assert.equal(snapshot.telemetry.graph.schemaVersion, ROAD_GRAPH_SCHEMA);
  assert.equal(snapshot.telemetry.caps.maxDerivedTotalLanes, 12);
  assert.equal(snapshot.telemetry.caps.maxRestrictions, 2_000);
  assert.ok(snapshot.vehicles.every((vehicle) => vehicle.synthetic));
  assertFiniteNumbers(snapshot);
  assertDeepFrozen(snapshot);
  assert.throws(() => snapshot.vehicles.push({}), TypeError);
  assert.throws(() => {
    snapshot.vehicles[0].coordinates[0] = 999;
  }, TypeError);
});

test('reset reproduces the initial state and dispose is terminal and idempotent', () => {
  const simulation = createRoadTrafficSimulation(createLoopGraph(), {
    seed: 42,
    vehicleCount: 3,
    fixedDtSeconds: 0.05
  });
  const initial = simulation.getSnapshot();
  simulation.advance(0.2);
  assert.notDeepEqual(simulation.getSnapshot(), initial);
  assert.deepEqual(simulation.reset(), initial);

  assert.equal(simulation.dispose(), true);
  assert.equal(simulation.dispose(), false);
  assert.equal(simulation.disposed, true);
  assert.equal(simulation.getSnapshot().status, 'disposed');
  assert.equal(simulation.getSnapshot().vehicleCount, 0);
  assert.throws(() => simulation.advance(0.1), /disposed/u);
  assert.throws(() => simulation.reset(), /disposed/u);
});

test('invalid schema, connectivity, declared adjacency, and restricted spawn edges fail closed', () => {
  const wrongSchema = createLoopGraph();
  wrongSchema.schemaVersion = 'other';
  assert.throws(() => createRoadTrafficSimulation(wrongSchema), /schemaVersion/u);

  const coordinateConnectivity = createLoopGraph();
  coordinateConnectivity.connectivity = 'coordinate-equality';
  assert.throws(() => createRoadTrafficSimulation(coordinateConnectivity), /shared OSM node/u);

  const badAdjacency = createLoopGraph();
  badAdjacency.nodes[0].outgoingEdgeIds = [];
  assert.throws(() => createRoadTrafficSimulation(badAdjacency), /does not match/u);

  assert.throws(() => createRoadTrafficSimulation(createJunctionGraph(), {
    spawnEdgeIds: ['edge/access-denied']
  }), /access-restricted/u);

  const closedBySpeed = createLoopGraph();
  closedBySpeed.edges[0].maxspeedKph = 0;
  assert.throws(() => createRoadTrafficSimulation(closedBySpeed, {
    spawnEdgeIds: ['edge/a-b']
  }), /access-restricted/u);

  const invalidLanes = createLoopGraph();
  invalidLanes.edges[0].lanes = '2';
  assert.throws(() => createRoadTrafficSimulation(invalidLanes), /lanes/u);

  const tooManyRestrictions = createRestrictionGraph();
  tooManyRestrictions.restrictions.push({
    ...structuredClone(tooManyRestrictions.restrictions[0]),
    id: 'relation/701'
  });
  assert.throws(() => createRoadTrafficSimulation(tooManyRestrictions, {
    maxRestrictions: 1
  }), /restriction simulation cap/u);
});
