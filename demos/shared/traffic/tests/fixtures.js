function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function createRoadGraph({ nodes, edges, restrictions = [], restrictionCoverage = null }) {
  const incoming = new Map(nodes.map((node) => [node.id, []]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));
  for (const edge of edges) {
    outgoing.get(edge.from).push(edge.id);
    incoming.get(edge.to).push(edge.id);
  }
  const graph = {
    schemaVersion: 'peercompute.geo.road-graph.v1',
    vehicle: 'motorcycle',
    navigationGrade: false,
    connectivity: 'shared-osm-node-identifiers-only',
    nodes: nodes.map((node) => ({
      id: node.id,
      osmNodeId: node.id.replace('node/', ''),
      coordinates: [...node.coordinates],
      incomingEdgeIds: incoming.get(node.id).sort(compareText),
      outgoingEdgeIds: outgoing.get(node.id).sort(compareText)
    })),
    edges: edges.map((edge, index) => ({
      osmWayId: String(1_000 + index),
      segmentIndex: index,
      direction: 'forward',
      highway: 'residential',
      access: null,
      maxspeedKph: 30,
      ...edge
    }))
  };
  if (restrictions.length > 0 || restrictionCoverage) {
    graph.restrictions = restrictions.map((restriction) => ({
      navigationGrade: false,
      ...restriction,
      fromEdgeIds: [...(restriction.fromEdgeIds ?? [])],
      toEdgeIds: [...(restriction.toEdgeIds ?? [])],
      issues: [...(restriction.issues ?? [])]
    }));
    graph.restrictionCoverage = restrictionCoverage ?? {
      totalCount: restrictions.length,
      machineEvaluableCount: restrictions.filter((restriction) => restriction.machineEvaluable).length,
      unresolvedCount: restrictions.filter((restriction) => !restriction.machineEvaluable).length,
      conditionalEvaluated: false,
      navigationGrade: false
    };
  }
  return graph;
}

export function createReciprocalLaneGraph({ lanes = null, oneWay = false } = {}) {
  const edges = [{
    id: 'edge/eastbound',
    osmWayId: '9000',
    segmentIndex: 0,
    direction: 'forward',
    from: 'node/west',
    to: 'node/east',
    lengthMeters: 100,
    lanes
  }];
  if (!oneWay) {
    edges.push({
      id: 'edge/westbound',
      osmWayId: '9000',
      segmentIndex: 0,
      direction: 'reverse',
      from: 'node/east',
      to: 'node/west',
      lengthMeters: 100,
      lanes
    });
  }
  return createRoadGraph({
    nodes: [
      { id: 'node/west', coordinates: [-149.9, 61.218] },
      { id: 'node/east', coordinates: [-149.898, 61.218] }
    ],
    edges
  });
}

export function createRestrictionGraph({ unresolved = false, only = false } = {}) {
  const mode = only ? 'only-transition' : 'prohibited-transition';
  return createRoadGraph({
    nodes: [
      { id: 'node/a', coordinates: [0, 0] },
      { id: 'node/b', coordinates: [0.00001, 0] },
      { id: 'node/c', coordinates: [0.001, 0] },
      { id: 'node/d', coordinates: [0.00001, 0.001] }
    ],
    edges: [
      {
        id: 'edge/start',
        osmWayId: '100',
        from: 'node/a',
        to: 'node/b',
        lengthMeters: 1,
        maxspeedKph: 30
      },
      {
        id: 'edge/east',
        osmWayId: '200',
        from: 'node/b',
        to: 'node/c',
        lengthMeters: 100
      },
      {
        id: 'edge/north',
        osmWayId: '300',
        from: 'node/b',
        to: 'node/d',
        lengthMeters: 100
      }
    ],
    restrictions: [{
      id: 'relation/700',
      osmRelationId: '700',
      restriction: only ? 'only_straight_on' : 'no_right_turn',
      mode,
      fromWayId: '100',
      toWayId: '200',
      viaNodeId: 'node/b',
      viaWayId: null,
      fromEdgeIds: ['edge/start'],
      toEdgeIds: ['edge/east'],
      machineEvaluable: !unresolved,
      conditionalRaw: unresolved ? 'no_right_turn @ (Mo-Fr 07:00-09:00)' : null,
      issues: unresolved ? ['conditional-restriction-not-evaluated'] : [],
      source: { type: 'relation', id: '700', version: 1, timestamp: '2026-08-23T19:45:00.000Z' }
    }]
  });
}

export function createLoopGraph({ edgeLengthMeters = 50 } = {}) {
  return createRoadGraph({
    nodes: [
      { id: 'node/a', coordinates: [-149.9000, 61.2180] },
      { id: 'node/b', coordinates: [-149.8990, 61.2180] },
      { id: 'node/c', coordinates: [-149.8990, 61.2190] }
    ],
    edges: [
      { id: 'edge/a-b', from: 'node/a', to: 'node/b', lengthMeters: edgeLengthMeters },
      { id: 'edge/b-c', from: 'node/b', to: 'node/c', lengthMeters: edgeLengthMeters },
      { id: 'edge/c-a', from: 'node/c', to: 'node/a', lengthMeters: edgeLengthMeters }
    ]
  });
}

export function createJunctionGraph() {
  return createRoadGraph({
    nodes: [
      { id: 'node/a', coordinates: [0, 0] },
      { id: 'node/b', coordinates: [0.00001, 0] },
      { id: 'node/c', coordinates: [0.001, 0] },
      { id: 'node/d', coordinates: [0.00001, 0.001] },
      { id: 'node/x', coordinates: [0.00001, 0] },
      { id: 'node/y', coordinates: [-0.001, 0] },
      { id: 'node/z', coordinates: [0.00001, -0.001] }
    ],
    edges: [
      {
        id: 'edge/start',
        from: 'node/a',
        to: 'node/b',
        lengthMeters: 1,
        maxspeedKph: 20
      },
      {
        id: 'edge/back',
        from: 'node/b',
        to: 'node/a',
        lengthMeters: 1,
        direction: 'reverse'
      },
      { id: 'edge/turn-east', from: 'node/b', to: 'node/c', lengthMeters: 100 },
      { id: 'edge/turn-north', from: 'node/b', to: 'node/d', lengthMeters: 100 },
      { id: 'edge/crossing-only', from: 'node/x', to: 'node/y', lengthMeters: 100 },
      {
        id: 'edge/access-denied',
        from: 'node/b',
        to: 'node/z',
        lengthMeters: 100,
        access: 'private'
      }
    ]
  });
}

export function freezeRecursively(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeRecursively(child);
  return Object.freeze(value);
}
