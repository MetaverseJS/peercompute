function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function distanceMeters(from, to) {
  return Math.hypot(to.localPosition[0] - from.localPosition[0], to.localPosition[2] - from.localPosition[2]);
}

export function createLocalRoadGraph({ nodes, edges, reverseInput = false }) {
  const normalizedNodes = nodes.map((node, index) => ({
    id: node.id,
    osmNodeId: node.id.replace('node/', ''),
    coordinates: node.coordinates ?? [-149.9 + index * 0.001, 61.218 - index * 0.001],
    localPosition: [...node.localPosition],
    incomingEdgeIds: [],
    outgoingEdgeIds: [],
  }));
  const nodeById = new Map(normalizedNodes.map((node) => [node.id, node]));
  const normalizedEdges = edges.map((edge, index) => {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    const normalized = {
      id: edge.id,
      osmWayId: edge.osmWayId ?? String(1_000 + index),
      segmentIndex: edge.segmentIndex ?? index,
      direction: edge.direction ?? 'forward',
      from: edge.from,
      to: edge.to,
      lengthMeters: edge.lengthMeters ?? distanceMeters(from, to),
      highway: edge.highway ?? 'residential',
      access: edge.access ?? null,
      maxspeedKph: edge.maxspeedKph ?? 30,
      ...(edge.motorcycleAccess === undefined ? {} : { motorcycleAccess: edge.motorcycleAccess }),
    };
    from.outgoingEdgeIds.push(normalized.id);
    to.incomingEdgeIds.push(normalized.id);
    return normalized;
  });
  for (const node of normalizedNodes) {
    node.incomingEdgeIds.sort(compareText);
    node.outgoingEdgeIds.sort(compareText);
  }
  const sourceNodes = normalizedNodes.map(({ localPosition: _localPosition, ...node }) => node);
  const sourceGraph = {
    schemaVersion: 'peercompute.geo.road-graph.v1',
    vehicle: 'motorcycle',
    navigationGrade: false,
    connectivity: 'shared-osm-node-identifiers-only',
    nodes: reverseInput ? [...sourceNodes].reverse() : sourceNodes,
    edges: reverseInput ? [...normalizedEdges].reverse() : normalizedEdges,
  };
  const localNodes = normalizedNodes.map((node) => ({
    ...node,
    localPosition: [...node.localPosition],
  }));
  return {
    schemaVersion: 'peercompute.geo.local-road-graph.v1',
    navigationGrade: false,
    sourceSchemaVersion: sourceGraph.schemaVersion,
    sourceRoadGraph: sourceGraph,
    nodes: reverseInput ? [...localNodes].reverse() : localNodes,
    edges: sourceGraph.edges,
  };
}

export function createSquareLoopGraph({ reverseInput = false } = {}) {
  return createLocalRoadGraph({
    reverseInput,
    nodes: [
      { id: 'node/a', coordinates: [-149.9000, 61.2180], localPosition: [0, 0, 0] },
      { id: 'node/b', coordinates: [-149.8982, 61.2180], localPosition: [100, 0, 0] },
      { id: 'node/c', coordinates: [-149.8982, 61.2171], localPosition: [100, 0, 100] },
      { id: 'node/d', coordinates: [-149.9000, 61.2171], localPosition: [0, 0, 100] },
    ],
    edges: [
      { id: 'edge/a-b', from: 'node/a', to: 'node/b' },
      { id: 'edge/b-c', from: 'node/b', to: 'node/c' },
      { id: 'edge/c-d', from: 'node/c', to: 'node/d' },
      { id: 'edge/d-a', from: 'node/d', to: 'node/a' },
    ],
  });
}

export function createOutAndBackGraph() {
  return createLocalRoadGraph({
    nodes: [
      { id: 'node/a', localPosition: [0, 0, 0] },
      { id: 'node/b', localPosition: [100, 0, 0] },
    ],
    edges: [
      { id: 'edge/a-b', from: 'node/a', to: 'node/b', direction: 'forward' },
      { id: 'edge/b-a', from: 'node/b', to: 'node/a', direction: 'reverse' },
    ],
  });
}

export function createOpenLineGraph() {
  return createLocalRoadGraph({
    nodes: [
      { id: 'node/a', coordinates: [-149.9000, 61.2180], localPosition: [0, 0, 0] },
      { id: 'node/b', coordinates: [-149.8982, 61.2180], localPosition: [100, 0, 0] },
      { id: 'node/c', coordinates: [-149.8964, 61.2180], localPosition: [200, 0, 0] },
    ],
    edges: [
      { id: 'edge/a-b', from: 'node/a', to: 'node/b' },
      { id: 'edge/b-c', from: 'node/b', to: 'node/c' },
    ],
  });
}

export function motionAcrossGate(gate, {
  distanceMeters = 3,
  lateralMeters = 0,
  heightMeters = 1,
} = {}) {
  const center = gate.positionLocal;
  const normal = gate.forwardLocal;
  const right = gate.rightLocal;
  const point = (normalDistance) => [
    center[0] + normal[0] * normalDistance + right[0] * lateralMeters,
    center[1] + heightMeters,
    center[2] + normal[2] * normalDistance + right[2] * lateralMeters,
  ];
  return {
    previousLocalPosition: point(-distanceMeters),
    currentLocalPosition: point(distanceMeters),
  };
}
