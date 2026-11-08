import {
  CANONICAL_ROAD_GRAPH_SCHEMA,
  deepFreeze,
  LOCAL_ROAD_GRAPH_SCHEMA,
  RACE_COURSE_PROVENANCE,
  RACE_GATE_COLORS,
  RACE_LIMITS,
  ROAD_RACE_COURSE_SCHEMA,
} from './constants.js';

const EARTH_RADIUS_METERS = 6_378_137;
const DEGREES_TO_RADIANS = Math.PI / 180;
const DENIED_ACCESS = new Set(['no', 'private', 'agricultural', 'forestry']);
const SOURCE_PROVENANCE_FIELDS = Object.freeze([
  'source',
  'adapter',
  'providerMode',
  'upstreamUrl',
  'sourceBaseTimestamp',
  'attribution',
  'licenseUrl',
  'derivedDatabaseNotice',
  'disclaimer',
]);

export class RoadRaceCourseError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'RoadRaceCourseError';
    this.code = code;
  }
}

function fail(code, message, ErrorType = RoadRaceCourseError) {
  if (ErrorType === RoadRaceCourseError) throw new RoadRaceCourseError(code, message);
  const error = new ErrorType(message);
  error.code = code;
  throw error;
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function finiteNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail('ERR_RACE_NON_FINITE', `${name} must be a finite number.`, TypeError);
  }
  return value;
}

function positiveNumber(value, fallback, name, maximum = Number.MAX_VALUE) {
  const number = finiteNumber(value ?? fallback, name);
  if (number <= 0 || number > maximum) {
    fail('ERR_RACE_OPTION_BOUNDS', `${name} must be greater than zero and at most ${maximum}.`, RangeError);
  }
  return number;
}

function nonNegativeNumber(value, fallback, name, maximum = Number.MAX_VALUE) {
  const number = finiteNumber(value ?? fallback, name);
  if (number < 0 || number > maximum) {
    fail('ERR_RACE_OPTION_BOUNDS', `${name} must be between zero and ${maximum}.`, RangeError);
  }
  return number;
}

function boundedInteger(value, fallback, minimum, maximum, name) {
  const selected = value ?? fallback;
  if (!Number.isSafeInteger(selected) || selected < minimum || selected > maximum) {
    fail('ERR_RACE_OPTION_BOUNDS', `${name} must be an integer between ${minimum} and ${maximum}.`, RangeError);
  }
  return selected;
}

function requireId(value, name) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 512) {
    fail('ERR_RACE_GRAPH_SCHEMA', `${name} must be a non-empty string of at most 512 characters.`, TypeError);
  }
  return value;
}

function finiteLocalPosition(value, name) {
  if (!Array.isArray(value) && !ArrayBuffer.isView(value)) {
    fail('ERR_RACE_LOCAL_POSITION', `${name} must be an [x, y, z] array.`, TypeError);
  }
  if (value.length < 3) fail('ERR_RACE_LOCAL_POSITION', `${name} must have three components.`, TypeError);
  return Object.freeze([
    finiteNumber(value[0], `${name}[0]`),
    finiteNumber(value[1], `${name}[1]`),
    finiteNumber(value[2], `${name}[2]`),
  ]);
}

function finiteWgs84(value, name) {
  if (!Array.isArray(value) || value.length < 2) {
    fail('ERR_RACE_WGS84_POSITION', `${name} must be a [longitude, latitude] array.`, TypeError);
  }
  const longitude = finiteNumber(value[0], `${name}[0]`);
  const latitude = finiteNumber(value[1], `${name}[1]`);
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    fail('ERR_RACE_WGS84_POSITION', `${name} is outside WGS84 longitude/latitude bounds.`, RangeError);
  }
  return Object.freeze([longitude, latitude]);
}

function shortestLongitudeDelta(from, to) {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

function normalizeLongitude(value) {
  let longitude = ((value + 180) % 360 + 360) % 360 - 180;
  if (longitude === -180 && value > 0) longitude = 180;
  return longitude;
}

function interpolateWgs84(from, to, alpha) {
  return Object.freeze([
    normalizeLongitude(from[0] + shortestLongitudeDelta(from[0], to[0]) * alpha),
    from[1] + (to[1] - from[1]) * alpha,
  ]);
}

function bearingRadians(from, to) {
  const fromLatitude = from[1] * DEGREES_TO_RADIANS;
  const toLatitude = to[1] * DEGREES_TO_RADIANS;
  const longitudeDelta = shortestLongitudeDelta(from[0], to[0]) * DEGREES_TO_RADIANS;
  const y = Math.sin(longitudeDelta) * Math.cos(toLatitude);
  const x = Math.cos(fromLatitude) * Math.sin(toLatitude)
    - Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(longitudeDelta);
  if (Math.abs(x) < Number.EPSILON && Math.abs(y) < Number.EPSILON) return 0;
  return Math.atan2(y, x);
}

function interpolateLocal(from, to, alpha) {
  return Object.freeze([
    from[0] + (to[0] - from[0]) * alpha,
    from[1] + (to[1] - from[1]) * alpha,
    from[2] + (to[2] - from[2]) * alpha,
  ]);
}

function pairKey(from, to) {
  return `${from}\u0000${to}`;
}

function normalizeStatus(value) {
  const selected = value ?? 'unknown';
  if (!['current', 'stale', 'unknown'].includes(selected)) {
    fail('ERR_RACE_SOURCE_STATUS', 'sourceStatus must be current, stale, or unknown.', TypeError);
  }
  return selected;
}

function selectSourceProvenance(value) {
  if (value === undefined || value === null) return Object.freeze({});
  if (typeof value !== 'object' || Array.isArray(value)) {
    fail('ERR_RACE_SOURCE_PROVENANCE', 'sourceProvenance must be an object when provided.', TypeError);
  }
  const selected = {};
  for (const field of SOURCE_PROVENANCE_FIELDS) {
    const fieldValue = value[field];
    if (fieldValue === undefined || fieldValue === null) continue;
    if (typeof fieldValue !== 'string' || fieldValue.length > 2_048) {
      fail('ERR_RACE_SOURCE_PROVENANCE', `sourceProvenance.${field} must be a bounded string.`, TypeError);
    }
    selected[field] = fieldValue;
  }
  return Object.freeze(selected);
}

function normalizeOptions(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    fail('ERR_RACE_OPTIONS', 'Race course options must be an object.', TypeError);
  }
  const maxGraphNodes = boundedInteger(
    options.maxGraphNodes,
    RACE_LIMITS.absoluteMaxGraphNodes,
    1,
    RACE_LIMITS.absoluteMaxGraphNodes,
    'maxGraphNodes',
  );
  const maxGraphEdges = boundedInteger(
    options.maxGraphEdges,
    RACE_LIMITS.absoluteMaxGraphEdges,
    1,
    RACE_LIMITS.absoluteMaxGraphEdges,
    'maxGraphEdges',
  );
  const maxCourseEdges = boundedInteger(
    options.maxCourseEdges,
    RACE_LIMITS.defaultMaxCourseEdges,
    1,
    RACE_LIMITS.absoluteMaxCourseEdges,
    'maxCourseEdges',
  );
  const maxGates = boundedInteger(
    options.maxGates,
    RACE_LIMITS.defaultMaxGates,
    2,
    RACE_LIMITS.absoluteMaxGates,
    'maxGates',
  );
  const maxSearchTransitions = boundedInteger(
    options.maxSearchTransitions,
    RACE_LIMITS.defaultMaxSearchTransitions,
    1,
    RACE_LIMITS.absoluteMaxSearchTransitions,
    'maxSearchTransitions',
  );
  const maxSearchStartNodes = boundedInteger(
    options.maxSearchStartNodes,
    RACE_LIMITS.defaultMaxSearchStartNodes,
    1,
    RACE_LIMITS.absoluteMaxSearchStartNodes,
    'maxSearchStartNodes',
  );
  const maxCourseLengthMeters = positiveNumber(
    options.maxCourseLengthMeters,
    RACE_LIMITS.defaultMaxCourseLengthMeters,
    'maxCourseLengthMeters',
    RACE_LIMITS.absoluteMaxCourseLengthMeters,
  );
  const preferredCourseLengthMeters = positiveNumber(
    options.preferredCourseLengthMeters,
    Math.min(RACE_LIMITS.defaultPreferredCourseLengthMeters, maxCourseLengthMeters),
    'preferredCourseLengthMeters',
    maxCourseLengthMeters,
  );
  const preferredMinimumCourseLengthMeters = nonNegativeNumber(
    options.preferredMinimumCourseLengthMeters,
    Math.min(RACE_LIMITS.defaultPreferredMinimumCourseLengthMeters, maxCourseLengthMeters),
    'preferredMinimumCourseLengthMeters',
    maxCourseLengthMeters,
  );
  const checkpointSpacingMeters = positiveNumber(
    options.checkpointSpacingMeters,
    Math.min(RACE_LIMITS.defaultCheckpointSpacingMeters, maxCourseLengthMeters),
    'checkpointSpacingMeters',
    maxCourseLengthMeters,
  );
  const gateWidthMeters = positiveNumber(
    options.gateWidthMeters,
    RACE_LIMITS.defaultGateWidthMeters,
    'gateWidthMeters',
    100,
  );
  const gateHeightMeters = positiveNumber(
    options.gateHeightMeters,
    RACE_LIMITS.defaultGateHeightMeters,
    'gateHeightMeters',
    50,
  );
  const gateVisualWidthMeters = positiveNumber(
    options.gateVisualWidthMeters,
    RACE_LIMITS.defaultGateVisualWidthMeters,
    'gateVisualWidthMeters',
    gateWidthMeters,
  );
  const gateVisualHeightMeters = positiveNumber(
    options.gateVisualHeightMeters,
    RACE_LIMITS.defaultGateVisualHeightMeters,
    'gateVisualHeightMeters',
    gateHeightMeters,
  );
  const spawnBackMeters = nonNegativeNumber(
    options.spawnBackMeters,
    RACE_LIMITS.defaultSpawnBackMeters,
    'spawnBackMeters',
    100,
  );
  const gateCount = options.gateCount === undefined
    ? null
    : boundedInteger(options.gateCount, null, 2, maxGates, 'gateCount');
  const minimumClosedLoopEdges = boundedInteger(
    options.minimumClosedLoopEdges,
    3,
    3,
    RACE_LIMITS.absoluteMaxCourseEdges,
    'minimumClosedLoopEdges',
  );
  if (options.projectWgs84 !== undefined && typeof options.projectWgs84 !== 'function') {
    fail('ERR_RACE_PROJECTOR', 'projectWgs84 must be a function when provided.', TypeError);
  }
  return Object.freeze({
    maxGraphNodes,
    maxGraphEdges,
    maxCourseEdges,
    maxGates,
    maxSearchTransitions,
    maxSearchStartNodes,
    maxCourseLengthMeters,
    preferredCourseLengthMeters,
    preferredMinimumCourseLengthMeters,
    checkpointSpacingMeters,
    gateWidthMeters,
    gateHeightMeters,
    gateVisualWidthMeters,
    gateVisualHeightMeters,
    spawnBackMeters,
    spawnHeightMeters: positiveNumber(options.spawnHeightMeters, 0.9, 'spawnHeightMeters', 10),
    gateCount,
    minimumClosedLoopEdges,
    referenceLocalPosition: finiteLocalPosition(
      options.referenceLocalPosition ?? [0, 0, 0],
      'referenceLocalPosition',
    ),
    localOriginWgs84: options.localOriginWgs84 === undefined
      ? null
      : finiteWgs84(options.localOriginWgs84, 'localOriginWgs84'),
    projectWgs84: options.projectWgs84 ?? null,
    sourceStatus: normalizeStatus(options.sourceStatus),
    sourceProvenance: selectSourceProvenance(options.sourceProvenance),
  });
}

function assertCanonicalSourceGraph(sourceGraph, config) {
  if (!sourceGraph || typeof sourceGraph !== 'object' || Array.isArray(sourceGraph)) {
    fail('ERR_RACE_GRAPH_REQUIRED', 'A canonical real directed road graph is required.', TypeError);
  }
  if (sourceGraph.schemaVersion !== CANONICAL_ROAD_GRAPH_SCHEMA) {
    fail('ERR_RACE_GRAPH_SCHEMA', `roadGraph.schemaVersion must be ${CANONICAL_ROAD_GRAPH_SCHEMA}.`, TypeError);
  }
  if (sourceGraph.navigationGrade !== false) {
    fail('ERR_RACE_GRAPH_TRUTH', 'roadGraph.navigationGrade must explicitly be false.', TypeError);
  }
  if (sourceGraph.connectivity !== 'shared-osm-node-identifiers-only') {
    fail('ERR_RACE_GRAPH_CONNECTIVITY', 'roadGraph connectivity must use shared OSM node identifiers only.', TypeError);
  }
  if (!Array.isArray(sourceGraph.nodes) || !Array.isArray(sourceGraph.edges)) {
    fail('ERR_RACE_GRAPH_SCHEMA', 'roadGraph.nodes and roadGraph.edges must be arrays.', TypeError);
  }
  if (sourceGraph.nodes.length > config.maxGraphNodes) {
    fail('ERR_RACE_GRAPH_NODE_CAP', `roadGraph exceeds the ${config.maxGraphNodes} node race cap.`, RangeError);
  }
  if (sourceGraph.edges.length > config.maxGraphEdges) {
    fail('ERR_RACE_GRAPH_EDGE_CAP', `roadGraph exceeds the ${config.maxGraphEdges} edge race cap.`, RangeError);
  }
}

function defaultLocalProjector(nodes, configuredOrigin) {
  const ordered = [...nodes].sort((left, right) => compareText(left.id, right.id));
  const origin = configuredOrigin ?? ordered[0]?.coordinates;
  if (!origin) fail('ERR_RACE_GRAPH_EMPTY', 'The road graph has no nodes to localize.', RangeError);
  const longitudeScale = Math.cos(origin[1] * DEGREES_TO_RADIANS);
  return {
    origin,
    project(coordinate) {
      const east = shortestLongitudeDelta(origin[0], coordinate[0])
        * DEGREES_TO_RADIANS * EARTH_RADIUS_METERS * longitudeScale;
      const north = (coordinate[1] - origin[1]) * DEGREES_TO_RADIANS * EARTH_RADIUS_METERS;
      return [east, 0, -north];
    },
  };
}

function normalizeGraph(graphInput, config) {
  const isLocal = graphInput?.schemaVersion === LOCAL_ROAD_GRAPH_SCHEMA;
  const sourceGraph = isLocal ? graphInput.sourceRoadGraph : graphInput;
  assertCanonicalSourceGraph(sourceGraph, config);
  if (isLocal) {
    if (graphInput.navigationGrade !== false
      || graphInput.sourceSchemaVersion !== CANONICAL_ROAD_GRAPH_SCHEMA
      || !Array.isArray(graphInput.nodes)) {
      fail('ERR_RACE_LOCAL_GRAPH_SCHEMA', 'Localized road graph truth/schema fields are invalid.', TypeError);
    }
    if (graphInput.nodes.length !== sourceGraph.nodes.length) {
      fail('ERR_RACE_LOCAL_GRAPH_SCHEMA', 'Localized road graph must contain every canonical graph node exactly once.', TypeError);
    }
  }

  const sourceNodes = new Map();
  for (const rawNode of sourceGraph.nodes) {
    if (!rawNode || typeof rawNode !== 'object' || Array.isArray(rawNode)) {
      fail('ERR_RACE_GRAPH_SCHEMA', 'Every road graph node must be an object.', TypeError);
    }
    const id = requireId(rawNode.id, 'Road graph node id');
    if (sourceNodes.has(id)) fail('ERR_RACE_GRAPH_DUPLICATE_NODE', `Duplicate road graph node id: ${id}.`, TypeError);
    if (!Array.isArray(rawNode.incomingEdgeIds) || !Array.isArray(rawNode.outgoingEdgeIds)) {
      fail('ERR_RACE_GRAPH_ADJACENCY', `Road graph node ${id} must declare incomingEdgeIds and outgoingEdgeIds.`, TypeError);
    }
    sourceNodes.set(id, {
      id,
      osmNodeId: rawNode.osmNodeId === undefined ? null : String(rawNode.osmNodeId),
      coordinates: finiteWgs84(rawNode.coordinates, `Node ${id} coordinates`),
      declaredIncoming: rawNode.incomingEdgeIds.map((edgeId, index) => (
        requireId(edgeId, `Node ${id} incomingEdgeIds[${index}]`)
      )).sort(compareText),
      declaredOutgoing: rawNode.outgoingEdgeIds.map((edgeId, index) => (
        requireId(edgeId, `Node ${id} outgoingEdgeIds[${index}]`)
      )).sort(compareText),
    });
  }

  const localById = new Map();
  let projectionKind = 'localized-terrain-frame';
  let projectionOrigin = null;
  if (isLocal) {
    for (const localNode of graphInput.nodes) {
      const id = requireId(localNode?.id, 'Localized road graph node id');
      if (localById.has(id)) fail('ERR_RACE_GRAPH_DUPLICATE_NODE', `Duplicate localized road graph node id: ${id}.`, TypeError);
      if (!sourceNodes.has(id)) fail('ERR_RACE_LOCAL_GRAPH_SCHEMA', `Localized node ${id} is absent from the canonical graph.`, TypeError);
      localById.set(id, finiteLocalPosition(localNode.localPosition, `Node ${id} localPosition`));
    }
  } else {
    const orderedSourceNodes = [...sourceNodes.values()].sort((left, right) => compareText(left.id, right.id));
    const fallbackProjector = config.projectWgs84
      ? null
      : defaultLocalProjector(orderedSourceNodes, config.localOriginWgs84);
    projectionKind = config.projectWgs84 ? 'caller-projected-local-frame' : 'derived-flat-local-tangent';
    projectionOrigin = fallbackProjector?.origin ?? config.localOriginWgs84;
    for (const node of orderedSourceNodes) {
      const projected = config.projectWgs84
        ? config.projectWgs84([...node.coordinates], Object.freeze({ id: node.id, osmNodeId: node.osmNodeId }))
        : fallbackProjector.project(node.coordinates);
      localById.set(node.id, finiteLocalPosition(projected, `Projected node ${node.id}`));
    }
  }

  const nodes = [...sourceNodes.values()].map((node) => deepFreeze({
    id: node.id,
    osmNodeId: node.osmNodeId,
    coordinates: node.coordinates,
    localPosition: localById.get(node.id),
  })).sort((left, right) => compareText(left.id, right.id));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const incomingIds = new Map(nodes.map((node) => [node.id, []]));
  const outgoingIds = new Map(nodes.map((node) => [node.id, []]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));
  const edgeById = new Map();
  const edges = [];
  const eligibleEdges = [];
  for (const rawEdge of sourceGraph.edges) {
    if (!rawEdge || typeof rawEdge !== 'object' || Array.isArray(rawEdge)) {
      fail('ERR_RACE_GRAPH_SCHEMA', 'Every road graph edge must be an object.', TypeError);
    }
    const id = requireId(rawEdge.id, 'Road graph edge id');
    if (edgeById.has(id)) fail('ERR_RACE_GRAPH_DUPLICATE_EDGE', `Duplicate road graph edge id: ${id}.`, TypeError);
    const from = requireId(rawEdge.from, `Edge ${id} from`);
    const to = requireId(rawEdge.to, `Edge ${id} to`);
    if (!nodeById.has(from) || !nodeById.has(to) || from === to) {
      fail('ERR_RACE_GRAPH_EDGE_ENDPOINT', `Edge ${id} must connect two distinct known OSM nodes.`, TypeError);
    }
    if (rawEdge.direction !== 'forward' && rawEdge.direction !== 'reverse') {
      fail('ERR_RACE_GRAPH_DIRECTION', `Edge ${id} direction must be forward or reverse.`, TypeError);
    }
    const lengthMeters = positiveNumber(rawEdge.lengthMeters, null, `Edge ${id} lengthMeters`);
    const fromLocal = nodeById.get(from).localPosition;
    const toLocal = nodeById.get(to).localPosition;
    if (Math.hypot(toLocal[0] - fromLocal[0], toLocal[2] - fromLocal[2]) <= 1e-6) {
      fail('ERR_RACE_GRAPH_LOCAL_DEGENERATE', `Edge ${id} has no finite horizontal extent in the local frame.`, RangeError);
    }
    let maxspeedKph = null;
    if (rawEdge.maxspeedKph !== undefined && rawEdge.maxspeedKph !== null) {
      maxspeedKph = nonNegativeNumber(rawEdge.maxspeedKph, null, `Edge ${id} maxspeedKph`, 1_000);
    }
    const edge = deepFreeze({
      id,
      osmWayId: rawEdge.osmWayId === undefined ? null : String(rawEdge.osmWayId),
      segmentIndex: Number.isSafeInteger(rawEdge.segmentIndex) ? rawEdge.segmentIndex : null,
      direction: rawEdge.direction,
      from,
      to,
      lengthMeters,
      highway: typeof rawEdge.highway === 'string' ? rawEdge.highway : null,
      access: typeof rawEdge.access === 'string' ? rawEdge.access : null,
      maxspeedKph,
      motorcycleAllowed: rawEdge.motorcycleAccess?.allowed !== false,
    });
    edges.push(edge);
    edgeById.set(id, edge);
    incomingIds.get(to).push(id);
    outgoingIds.get(from).push(id);
    const access = edge.access?.trim().toLowerCase();
    if (edge.motorcycleAllowed && maxspeedKph !== 0 && !DENIED_ACCESS.has(access)) {
      eligibleEdges.push(edge);
      outgoing.get(from).push(edge);
    }
  }

  for (const node of sourceNodes.values()) {
    const actualIncoming = incomingIds.get(node.id).sort(compareText);
    const actualOutgoing = outgoingIds.get(node.id).sort(compareText);
    if (new Set(node.declaredIncoming).size !== node.declaredIncoming.length
      || new Set(node.declaredOutgoing).size !== node.declaredOutgoing.length
      || actualIncoming.join('\u0000') !== node.declaredIncoming.join('\u0000')
      || actualOutgoing.join('\u0000') !== node.declaredOutgoing.join('\u0000')) {
      fail('ERR_RACE_GRAPH_ADJACENCY', `Node ${node.id} declared adjacency does not match graph edges.`, TypeError);
    }
    outgoing.get(node.id).sort((left, right) => compareText(left.id, right.id));
  }
  edges.sort((left, right) => compareText(left.id, right.id));
  eligibleEdges.sort((left, right) => compareText(left.id, right.id));
  return {
    nodes,
    nodeById,
    edges,
    eligibleEdges,
    edgeById,
    outgoing,
    sourceGraph,
    projectionKind,
    projectionOrigin,
  };
}

function orderedStartNodes(graph, config) {
  const [referenceX, , referenceZ] = config.referenceLocalPosition;
  return graph.nodes
    .filter((node) => graph.outgoing.get(node.id).length > 0)
    .map((node) => ({
      node,
      distance: Math.hypot(node.localPosition[0] - referenceX, node.localPosition[2] - referenceZ),
    }))
    .sort((left, right) => left.distance - right.distance || compareText(left.node.id, right.node.id))
    .slice(0, config.maxSearchStartNodes);
}

function routeLength(edges) {
  return edges.reduce((total, edge) => total + edge.lengthMeters, 0);
}

function routeSignature(edges) {
  return edges.map((edge) => edge.id).join('\u001f');
}

function candidateIsBetter(candidate, current, config) {
  if (!current) return true;
  const candidatePreferred = candidate.lengthMeters >= config.preferredMinimumCourseLengthMeters;
  const currentPreferred = current.lengthMeters >= config.preferredMinimumCourseLengthMeters;
  if (candidatePreferred !== currentPreferred) return candidatePreferred;
  const candidateTargetDelta = Math.abs(candidate.lengthMeters - config.preferredCourseLengthMeters);
  const currentTargetDelta = Math.abs(current.lengthMeters - config.preferredCourseLengthMeters);
  if (candidateTargetDelta !== currentTargetDelta) return candidateTargetDelta < currentTargetDelta;
  if (candidate.startDistance !== current.startDistance) return candidate.startDistance < current.startDistance;
  return compareText(candidate.signature, current.signature) < 0;
}

function findClosedLoop(graph, starts, config) {
  let transitions = 0;
  let best = null;
  let exhausted = false;
  for (const startEntry of starts) {
    const startId = startEntry.node.id;
    const visited = new Set([startId]);
    const pathEdges = [];
    const stack = [{ nodeId: startId, nextIndex: 0 }];
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const candidates = graph.outgoing.get(frame.nodeId);
      if (frame.nextIndex >= candidates.length) {
        stack.pop();
        if (pathEdges.length >= stack.length && pathEdges.length > 0) {
          const removed = pathEdges.pop();
          visited.delete(removed.to);
        }
        continue;
      }
      const edge = candidates[frame.nextIndex];
      frame.nextIndex += 1;
      if (transitions >= config.maxSearchTransitions) {
        exhausted = true;
        break;
      }
      transitions += 1;
      const nextEdgeCount = pathEdges.length + 1;
      if (nextEdgeCount > config.maxCourseEdges) continue;
      if (edge.to === startId) {
        if (nextEdgeCount < config.minimumClosedLoopEdges) continue;
        const selectedEdges = [...pathEdges, edge];
        const lengthMeters = routeLength(selectedEdges);
        if (lengthMeters > config.maxCourseLengthMeters) continue;
        const candidate = {
          edges: selectedEdges,
          lengthMeters,
          startDistance: startEntry.distance,
          signature: routeSignature(selectedEdges),
        };
        if (candidateIsBetter(candidate, best, config)) best = candidate;
        if (Math.abs(lengthMeters - config.preferredCourseLengthMeters)
          <= config.preferredCourseLengthMeters * 0.05) {
          return { candidate: best, transitions, exhausted };
        }
        continue;
      }
      if (nextEdgeCount >= config.maxCourseEdges || visited.has(edge.to)) continue;
      visited.add(edge.to);
      pathEdges.push(edge);
      stack.push({ nodeId: edge.to, nextIndex: 0 });
    }
    if (exhausted) break;
  }
  return { candidate: best, transitions, exhausted };
}

function buildPairMap(edges) {
  const map = new Map();
  for (const edge of edges) {
    const key = pairKey(edge.from, edge.to);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(edge);
  }
  for (const values of map.values()) values.sort((left, right) => compareText(left.id, right.id));
  return map;
}

function findOutAndBack(graph, starts, config) {
  const pairs = buildPairMap(graph.eligibleEdges);
  const maximumOutboundEdges = Math.floor(config.maxCourseEdges / 2);
  if (maximumOutboundEdges < 1) {
    return { candidate: null, examinedTransitions: 0, exhausted: false };
  }
  let best = null;
  let examinedTransitions = 0;
  let exhausted = false;
  for (const startEntry of starts) {
    const visited = new Set([startEntry.node.id]);
    const outbound = [];
    let currentId = startEntry.node.id;
    while (outbound.length < maximumOutboundEdges) {
      const candidates = [];
      for (const edge of graph.outgoing.get(currentId)) {
        if (examinedTransitions >= config.maxSearchTransitions) {
          exhausted = true;
          break;
        }
        examinedTransitions += 1;
        if (!visited.has(edge.to) && pairs.has(pairKey(edge.to, edge.from))) candidates.push(edge);
      }
      if (candidates.length === 0) break;
      const edge = candidates[0];
      const reverse = pairs.get(pairKey(edge.to, edge.from))[0];
      const projectedLength = (routeLength(outbound) + edge.lengthMeters) * 2;
      if (projectedLength > config.maxCourseLengthMeters) break;
      outbound.push(edge);
      visited.add(edge.to);
      currentId = edge.to;
      const returnEdges = [...outbound].reverse().map((outboundEdge) => (
        pairs.get(pairKey(outboundEdge.to, outboundEdge.from))[0]
      ));
      const selectedEdges = [...outbound, ...returnEdges];
      const candidate = {
        edges: selectedEdges,
        lengthMeters: routeLength(selectedEdges),
        startDistance: startEntry.distance,
        signature: routeSignature(selectedEdges),
      };
      if (candidateIsBetter(candidate, best, config)) best = candidate;
      if (exhausted) break;
    }
    if (exhausted) break;
  }
  return { candidate: best, examinedTransitions, exhausted };
}

function findOpenCourse(graph, starts, config) {
  let best = null;
  let examinedTransitions = 0;
  let exhausted = false;
  for (const startEntry of starts) {
    const visited = new Set([startEntry.node.id]);
    const path = [];
    let currentId = startEntry.node.id;
    while (path.length < config.maxCourseEdges) {
      const candidates = [];
      for (const edge of graph.outgoing.get(currentId)) {
        if (examinedTransitions >= config.maxSearchTransitions) {
          exhausted = true;
          break;
        }
        examinedTransitions += 1;
        if (!visited.has(edge.to)) candidates.push(edge);
      }
      if (candidates.length === 0) break;
      const edge = candidates[0];
      if (routeLength(path) + edge.lengthMeters > config.maxCourseLengthMeters) break;
      path.push(edge);
      visited.add(edge.to);
      currentId = edge.to;
      const candidate = {
        edges: [...path],
        lengthMeters: routeLength(path),
        startDistance: startEntry.distance,
        signature: routeSignature(path),
      };
      if (candidateIsBetter(candidate, best, config)) best = candidate;
      if (exhausted) break;
    }
    if (exhausted) break;
  }
  return { candidate: best, examinedTransitions, exhausted };
}

function chooseRoute(graph, config) {
  if (graph.nodes.length === 0 || graph.eligibleEdges.length === 0) {
    fail('ERR_RACE_GRAPH_NO_DRIVABLE_EDGES', 'The canonical graph contains no bounded drivable motorcycle edge.', RangeError);
  }
  const starts = orderedStartNodes(graph, config);
  if (starts.length === 0) {
    fail('ERR_RACE_GRAPH_NO_START', 'The canonical graph contains no deterministic course start.', RangeError);
  }
  const loop = findClosedLoop(graph, starts, config);
  if (loop.candidate) {
    return {
      ...loop.candidate,
      truthStatus: 'closed-loop',
      fallback: false,
      closed: true,
      lapCapable: true,
      reason: loop.exhausted
        ? 'Selected the best qualifying directed loop found before the bounded search cap.'
        : 'Selected a deterministic directed closed loop from the canonical road graph.',
      search: {
        transitions: Math.min(loop.transitions, config.maxSearchTransitions),
        transitionCap: config.maxSearchTransitions,
        exhausted: loop.exhausted,
        startNodesExamined: starts.length,
        startNodeCapApplied: starts.length < graph.nodes.length,
      },
    };
  }
  const outAndBack = findOutAndBack(graph, starts, config);
  if (outAndBack.candidate) {
    return {
      ...outAndBack.candidate,
      truthStatus: 'fallback-out-and-back',
      fallback: true,
      closed: true,
      lapCapable: true,
      reason: 'No qualifying multi-node directed loop was found within bounds; using graph-authorized outbound and reverse edges.',
      search: {
        transitions: Math.min(loop.transitions, config.maxSearchTransitions),
        transitionCap: config.maxSearchTransitions,
        exhausted: loop.exhausted,
        fallbackTransitions: outAndBack.examinedTransitions,
        fallbackExhausted: outAndBack.exhausted,
        startNodesExamined: starts.length,
        startNodeCapApplied: starts.length < graph.nodes.length,
      },
    };
  }
  const open = findOpenCourse(graph, starts, config);
  if (open.candidate) {
    return {
      ...open.candidate,
      truthStatus: 'fallback-open',
      fallback: true,
      closed: false,
      lapCapable: false,
      reason: 'No directed loop or graph-authorized out-and-back was found within bounds; using an explicit single-pass open course.',
      search: {
        transitions: Math.min(loop.transitions, config.maxSearchTransitions),
        transitionCap: config.maxSearchTransitions,
        exhausted: loop.exhausted,
        fallbackTransitions: outAndBack.examinedTransitions + open.examinedTransitions,
        fallbackExhausted: outAndBack.exhausted || open.exhausted,
        startNodesExamined: starts.length,
        startNodeCapApplied: starts.length < graph.nodes.length,
      },
    };
  }
  fail('ERR_RACE_COURSE_UNAVAILABLE', 'The canonical graph cannot produce a finite bounded race course.', RangeError);
}

function sampleRoute(graph, selected, distanceMeters) {
  let remaining = distanceMeters;
  if (selected.closed) {
    remaining = ((remaining % selected.lengthMeters) + selected.lengthMeters) % selected.lengthMeters;
  } else {
    remaining = Math.min(selected.lengthMeters, Math.max(0, remaining));
  }
  let edge = selected.edges[selected.edges.length - 1];
  let alpha = 1;
  for (const candidate of selected.edges) {
    if (remaining <= candidate.lengthMeters) {
      edge = candidate;
      alpha = candidate.lengthMeters === 0 ? 0 : remaining / candidate.lengthMeters;
      break;
    }
    remaining -= candidate.lengthMeters;
  }
  const from = graph.nodeById.get(edge.from);
  const to = graph.nodeById.get(edge.to);
  const localPosition = interpolateLocal(from.localPosition, to.localPosition, alpha);
  const wgs84Position = interpolateWgs84(from.coordinates, to.coordinates, alpha);
  const deltaX = to.localPosition[0] - from.localPosition[0];
  const deltaZ = to.localPosition[2] - from.localPosition[2];
  const horizontalLength = Math.hypot(deltaX, deltaZ);
  const forwardLocal = Object.freeze([deltaX / horizontalLength, 0, deltaZ / horizontalLength]);
  const headingRadiansLocal = Math.atan2(forwardLocal[0], forwardLocal[2]);
  const rightLocal = Object.freeze([forwardLocal[2], 0, -forwardLocal[0]]);
  return {
    edge,
    edgeAlpha: alpha,
    localPosition,
    wgs84Position,
    headingRadiansLocal,
    headingRadiansWgs84: bearingRadians(from.coordinates, to.coordinates),
    forwardLocal,
    rightLocal,
  };
}

function hashText(value) {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

function gateCountForCourse(selected, config) {
  if (config.gateCount !== null) return config.gateCount;
  const estimated = selected.closed
    ? Math.ceil(selected.lengthMeters / config.checkpointSpacingMeters)
    : Math.ceil(selected.lengthMeters / config.checkpointSpacingMeters) + 1;
  return Math.min(config.maxGates, Math.max(selected.closed ? 3 : 2, estimated));
}

function gateDistanceLayout(selected, gateCount) {
  const firstEdge = selected.edges[0];
  if (selected.closed) {
    const spacing = selected.lengthMeters / gateCount;
    const startOffset = Math.min(firstEdge.lengthMeters * 0.35, Math.max(0.5, spacing * 0.25));
    return Array.from({ length: gateCount }, (_, index) => ({
      courseDistanceMeters: spacing * index,
      sourceRouteDistanceMeters: (startOffset + spacing * index) % selected.lengthMeters,
    }));
  }
  const lastEdge = selected.edges[selected.edges.length - 1];
  const startInset = Math.min(firstEdge.lengthMeters * 0.2, selected.lengthMeters * 0.05, 5);
  const finishInset = Math.min(lastEdge.lengthMeters * 0.2, selected.lengthMeters * 0.05, 5);
  const startDistance = startInset;
  const finishDistance = Math.max(startDistance, selected.lengthMeters - finishInset);
  const spacing = gateCount === 1 ? 0 : (finishDistance - startDistance) / (gateCount - 1);
  return Array.from({ length: gateCount }, (_, index) => ({
    courseDistanceMeters: spacing * index,
    sourceRouteDistanceMeters: startDistance + spacing * index,
  }));
}

function offsetLocal(position, direction, amount, vertical = 0) {
  return Object.freeze([
    position[0] + direction[0] * amount,
    position[1] + vertical,
    position[2] + direction[2] * amount,
  ]);
}

function createGates(graph, selected, config, courseId, gateCount) {
  const distances = gateDistanceLayout(selected, gateCount);
  const halfWidthMeters = config.gateWidthMeters / 2;
  const visualHalfWidthMeters = config.gateVisualWidthMeters / 2;
  return Object.freeze(distances.map((distance, index) => {
    const sample = sampleRoute(graph, selected, distance.sourceRouteDistanceMeters);
    const isStart = index === 0;
    const isOpenFinish = !selected.closed && index === gateCount - 1;
    const kind = isStart ? (selected.closed ? 'start-finish' : 'start') : (isOpenFinish ? 'finish' : 'checkpoint');
    const color = isStart
      ? RACE_GATE_COLORS.startFinish
      : isOpenFinish ? RACE_GATE_COLORS.finish : RACE_GATE_COLORS.checkpoint;
    const leftBase = offsetLocal(sample.localPosition, sample.rightLocal, -visualHalfWidthMeters);
    const rightBase = offsetLocal(sample.localPosition, sample.rightLocal, visualHalfWidthMeters);
    return deepFreeze({
      id: `${courseId}/gate/${index}`,
      order: index,
      kind,
      label: isStart ? 'START / FINISH' : isOpenFinish ? 'FINISH' : `CHECKPOINT ${index}`,
      positionLocal: sample.localPosition,
      positionWgs84: sample.wgs84Position,
      headingRadiansLocal: sample.headingRadiansLocal,
      headingRadiansWgs84: sample.headingRadiansWgs84,
      forwardLocal: sample.forwardLocal,
      rightLocal: sample.rightLocal,
      sourceEdgeId: sample.edge.id,
      sourceOsmWayId: sample.edge.osmWayId,
      sourceEdgeAlpha: sample.edgeAlpha,
      courseDistanceMeters: distance.courseDistanceMeters,
      sourceRouteDistanceMeters: distance.sourceRouteDistanceMeters,
      crossing: {
        planePointLocal: sample.localPosition,
        planeNormalLocal: sample.forwardLocal,
        corridorRightLocal: sample.rightLocal,
        widthMeters: config.gateWidthMeters,
        halfWidthMeters,
        minimumHeightMeters: -1,
        maximumHeightMeters: config.gateHeightMeters,
        direction: 'forward-only',
      },
      render: {
        color,
        colorCategory: isStart ? 'race-start-finish' : isOpenFinish ? 'race-finish' : 'race-checkpoint',
        emissiveIntensity: 4,
        postRadiusMeters: 0.12,
        widthMeters: config.gateVisualWidthMeters,
        heightMeters: config.gateVisualHeightMeters,
        leftPostBaseLocal: leftBase,
        leftPostTopLocal: offsetLocal(leftBase, [0, 0, 0], 0, config.gateVisualHeightMeters),
        rightPostBaseLocal: rightBase,
        rightPostTopLocal: offsetLocal(rightBase, [0, 0, 0], 0, config.gateVisualHeightMeters),
        bannerLeftLocal: offsetLocal(leftBase, [0, 0, 0], 0, config.gateVisualHeightMeters),
        bannerRightLocal: offsetLocal(rightBase, [0, 0, 0], 0, config.gateVisualHeightMeters),
      },
    });
  }));
}

function courseRouteData(graph, selected) {
  const nodeIds = [selected.edges[0].from, ...selected.edges.map((edge) => edge.to)];
  const points = nodeIds.map((nodeId, index) => {
    const node = graph.nodeById.get(nodeId);
    return deepFreeze({
      order: index,
      nodeId,
      osmNodeId: node.osmNodeId,
      positionLocal: node.localPosition,
      positionWgs84: node.coordinates,
    });
  });
  return deepFreeze({
    edgeIds: selected.edges.map((edge) => edge.id),
    nodeIds,
    points,
    distanceMeters: selected.lengthMeters,
  });
}

/**
 * Derive a deterministic bounded game course from a canonical OSM directed
 * road graph or its canonical localized motorcycle-scene form.
 */
export function deriveRoadRaceCourse(roadGraph, options = {}) {
  const config = normalizeOptions(options);
  const graph = normalizeGraph(roadGraph, config);
  const selected = chooseRoute(graph, config);
  const resolvedGateCount = gateCountForCourse(selected, config);
  const routeGeometryFingerprint = [selected.edges[0].from, ...selected.edges.map((edge) => edge.to)]
    .map((nodeId) => {
      const node = graph.nodeById.get(nodeId);
      return `${nodeId}:${node.coordinates.join(',')}`;
    }).join('\u001d');
  const courseId = `road-race-${hashText([
    selected.truthStatus,
    selected.edges.map((edge) => `${edge.id}:${edge.lengthMeters}`).join('\u001f'),
    routeGeometryFingerprint,
    resolvedGateCount,
    config.gateWidthMeters,
    config.gateHeightMeters,
  ].join('\u001e'))}`;
  const gates = createGates(graph, selected, config, courseId, resolvedGateCount);
  const startGate = gates[0];
  const startEdge = graph.edgeById.get(startGate.sourceEdgeId);
  const startFrom = graph.nodeById.get(startEdge.from);
  const startTo = graph.nodeById.get(startEdge.to);
  const startEdgeLocalLength = Math.hypot(
    startTo.localPosition[0] - startFrom.localPosition[0],
    startTo.localPosition[2] - startFrom.localPosition[2],
  );
  const availableBackMeters = startEdgeLocalLength * startGate.sourceEdgeAlpha;
  const appliedSpawnBackMeters = Math.min(config.spawnBackMeters, availableBackMeters * 0.8);
  const spawnPosition = offsetLocal(
    startGate.positionLocal,
    startGate.forwardLocal,
    -appliedSpawnBackMeters,
    config.spawnHeightMeters,
  );
  const spawnEdgeAlpha = Math.max(
    0,
    startGate.sourceEdgeAlpha - appliedSpawnBackMeters / startEdgeLocalLength,
  );
  const spawnWgs84 = interpolateWgs84(
    startFrom.coordinates,
    startTo.coordinates,
    spawnEdgeAlpha,
  );
  const sourceProvenance = config.sourceProvenance;
  return deepFreeze({
    schemaVersion: ROAD_RACE_COURSE_SCHEMA,
    id: courseId,
    truthStatus: selected.truthStatus,
    fallback: selected.fallback,
    closed: selected.closed,
    lapCapable: selected.lapCapable,
    raceMode: selected.lapCapable ? 'multi-lap' : 'single-pass',
    selectionReason: selected.reason,
    source: {
      data: 'real OSM road graph',
      schemaVersion: CANONICAL_ROAD_GRAPH_SCHEMA,
      status: config.sourceStatus,
      synthetic: false,
      navigationGrade: false,
      connectivity: 'shared-osm-node-identifiers-only',
      graphNodeCount: graph.nodes.length,
      graphDirectedEdgeCount: graph.edges.length,
      graphEligibleDirectedEdgeCount: graph.eligibleEdges.length,
      attribution: sourceProvenance.attribution ?? RACE_COURSE_PROVENANCE.attribution,
      licenseUrl: sourceProvenance.licenseUrl ?? RACE_COURSE_PROVENANCE.licenseUrl,
      sourceBaseTimestamp: sourceProvenance.sourceBaseTimestamp ?? null,
      suppliedProvenance: sourceProvenance,
    },
    provenance: RACE_COURSE_PROVENANCE,
    projection: {
      kind: graph.projectionKind,
      originWgs84: graph.projectionOrigin,
    },
    selection: {
      status: selected.truthStatus,
      fallback: selected.fallback,
      closed: selected.closed,
      lapCapable: selected.lapCapable,
      preferredMinimumMet: selected.lengthMeters >= config.preferredMinimumCourseLengthMeters,
      search: selected.search,
    },
    route: courseRouteData(graph, selected),
    gates,
    start: {
      gateId: startGate.id,
      positionLocal: spawnPosition,
      positionWgs84: spawnWgs84,
      headingRadiansLocal: startGate.headingRadiansLocal,
      headingRadiansWgs84: startGate.headingRadiansWgs84,
      sourceEdgeId: startGate.sourceEdgeId,
      sourceEdgeAlpha: spawnEdgeAlpha,
      requestedBackMeters: config.spawnBackMeters,
      appliedBackMeters: appliedSpawnBackMeters,
    },
    caps: {
      graphNodes: config.maxGraphNodes,
      graphEdges: config.maxGraphEdges,
      courseEdges: config.maxCourseEdges,
      gates: config.maxGates,
      searchTransitions: config.maxSearchTransitions,
      searchStartNodes: config.maxSearchStartNodes,
      courseLengthMeters: config.maxCourseLengthMeters,
    },
  });
}
