import {
  DEFAULT_SPEED_LIMITS_KPH,
  ROAD_GRAPH_SCHEMA,
  TRAFFIC_LIMITS
} from './schema.js';
import { validateWgs84Coordinate } from './geo.js';

const DENIED_ACCESS = new Set(['no', 'private', 'agricultural', 'forestry']);

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function finitePositive(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new TypeError(`${name} must be a finite number greater than zero.`);
  }
  return number;
}

function finiteNonNegative(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new TypeError(`${name} must be a finite number greater than or equal to zero.`);
  }
  return number;
}

function normalizeReportedTotalLanes(value, name) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new TypeError(`${name} must be a finite number greater than zero or null.`);
  }
  return value;
}

function boundedInteger(value, fallback, maximum, name) {
  const selected = value ?? fallback;
  if (!Number.isSafeInteger(selected) || selected < 1 || selected > maximum) {
    throw new RangeError(`${name} must be an integer between 1 and ${maximum}.`);
  }
  return selected;
}

function requireId(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${name} must be a non-empty string.`);
  }
  return value;
}

function normalizeIdList(value, name) {
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array.`);
  const normalized = value.map((id, index) => requireId(id, `${name}[${index}]`));
  const unique = new Set(normalized);
  if (unique.size !== normalized.length) throw new TypeError(`${name} must not contain duplicates.`);
  return Object.freeze([...normalized].sort(compareText));
}

function assertSameIds(actual, expected, name) {
  if (actual.length !== expected.length
    || actual.some((value, index) => value !== expected[index])) {
    throw new TypeError(`${name} does not match the directed graph edges.`);
  }
}

function uniqueSortedStrings(value, issueName, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${issueName}-not-an-array`);
    return Object.freeze([]);
  }
  const strings = [];
  for (const item of value) {
    if (typeof item !== 'string' || item.length === 0) {
      issues.push(`${issueName}-contains-invalid-id`);
      continue;
    }
    strings.push(item);
  }
  const unique = [...new Set(strings)].sort(compareText);
  if (unique.length !== strings.length) issues.push(`${issueName}-contains-duplicates`);
  return Object.freeze(unique);
}

function normalizeRestrictionSource(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return Object.freeze({
    type: typeof value.type === 'string' ? value.type : null,
    id: value.id === undefined || value.id === null ? null : String(value.id),
    version: Number.isSafeInteger(value.version) && value.version > 0 ? value.version : null,
    timestamp: typeof value.timestamp === 'string' ? value.timestamp : null
  });
}

function laneSegmentKey(edge) {
  if (edge.osmWayId === null || edge.segmentIndex === null) return null;
  return `${edge.osmWayId}\u0000${edge.segmentIndex}`;
}

function findReciprocalEdge(edge, edgesBySegment) {
  const key = laneSegmentKey(edge);
  if (key === null) return null;
  return (edgesBySegment.get(key) ?? []).find((candidate) => (
    candidate.id !== edge.id
      && candidate.direction !== edge.direction
      && candidate.from === edge.to
      && candidate.to === edge.from
  )) ?? null;
}

function deriveLaneModel(edge, reciprocalEdge) {
  const reportedTotalLaneCount = edge.lanes;
  const reciprocalDirection = Boolean(reciprocalEdge);
  const assumedTotalLaneCount = reciprocalDirection ? 2 : 1;
  const roundedLaneCount = reportedTotalLaneCount === null
    ? assumedTotalLaneCount
    : Math.max(1, Math.round(reportedTotalLaneCount));
  const derivedTotalLaneCount = Math.min(
    TRAFFIC_LIMITS.absoluteMaxDerivedTotalLanes,
    roundedLaneCount
  );
  const sourceRoundedForGame = reportedTotalLaneCount !== null
    && !Number.isInteger(reportedTotalLaneCount);
  const sourceCappedForGame = roundedLaneCount > TRAFFIC_LIMITS.absoluteMaxDerivedTotalLanes;
  const minimumExpandedForGame = reciprocalDirection && derivedTotalLaneCount < 2;
  let directionalLaneCount = derivedTotalLaneCount;
  if (reciprocalDirection) {
    directionalLaneCount = edge.direction === 'forward'
      ? Math.max(1, Math.ceil(derivedTotalLaneCount / 2))
      : Math.max(1, Math.floor(derivedTotalLaneCount / 2));
  }
  const derivation = [];
  derivation.push(reportedTotalLaneCount === null
    ? 'missing-source-total-lanes-assumed-for-game'
    : 'osm-reported-total-lanes-preserved');
  if (sourceRoundedForGame) derivation.push('fractional-source-total-rounded-for-game');
  if (sourceCappedForGame) derivation.push('derived-total-lanes-capped-for-game');
  if (minimumExpandedForGame) derivation.push('reciprocal-directions-expanded-to-one-game-lane-each');
  derivation.push(reciprocalDirection
    ? 'total-lanes-split-across-reciprocal-directions'
    : 'total-lanes-applied-to-one-way-direction');
  return Object.freeze({
    reportedTotalLaneCount,
    reportedTotalLaneCountProvenance: reportedTotalLaneCount === null
      ? 'source-lanes-unavailable'
      : 'osm-reported-total-lanes',
    derivedTotalLaneCount,
    directionalLaneCount,
    reciprocalDirection,
    sourceRoundedForGame,
    sourceCappedForGame,
    minimumExpandedForGame,
    laneWidthMeters: TRAFFIC_LIMITS.derivedLaneWidthMeters,
    placement: reciprocalDirection
      ? 'right-of-directed-centerline'
      : 'one-way-carriageway-centered-on-source-line',
    derivation: Object.freeze(derivation),
    derived: true,
    gameOnly: true,
    navigationGrade: false
  });
}

function normalizeRestriction(rawRestriction, index, edgeById) {
  const issues = [];
  const raw = rawRestriction && typeof rawRestriction === 'object' && !Array.isArray(rawRestriction)
    ? rawRestriction
    : {};
  if (raw !== rawRestriction) issues.push('restriction-not-an-object');
  const id = typeof raw.id === 'string' && raw.id.length > 0
    ? raw.id
    : `unresolved-graph-restriction/${index}`;
  if (id !== raw.id) issues.push('missing-or-invalid-restriction-id');
  const sourceIssues = Array.isArray(raw.issues)
    ? raw.issues.filter((issue) => typeof issue === 'string' && issue.length > 0)
    : [];
  issues.push(...sourceIssues);
  const fromEdgeIds = uniqueSortedStrings(raw.fromEdgeIds, 'from-edge-ids', issues);
  const toEdgeIds = uniqueSortedStrings(raw.toEdgeIds, 'to-edge-ids', issues);
  const mode = typeof raw.mode === 'string' ? raw.mode : 'unsupported';
  const sourceMachineEvaluable = raw.machineEvaluable === true;

  if (!['prohibited-transition', 'only-transition'].includes(mode)) {
    issues.push('traffic-unsupported-restriction-mode');
  }
  if (fromEdgeIds.length !== 1) issues.push('traffic-simple-from-edge-required');
  if (toEdgeIds.length !== 1) issues.push('traffic-simple-to-edge-required');
  const fromEdge = fromEdgeIds.length === 1 ? edgeById.get(fromEdgeIds[0]) : null;
  const toEdge = toEdgeIds.length === 1 ? edgeById.get(toEdgeIds[0]) : null;
  if (fromEdgeIds.length === 1 && !fromEdge) issues.push('traffic-from-edge-not-in-bounded-graph');
  if (toEdgeIds.length === 1 && !toEdge) issues.push('traffic-to-edge-not-in-bounded-graph');
  const viaNodeId = typeof raw.viaNodeId === 'string' && raw.viaNodeId.length > 0
    ? raw.viaNodeId
    : null;
  if (fromEdge && toEdge && (
    fromEdge.to !== toEdge.from
      || (viaNodeId !== null && (fromEdge.to !== viaNodeId || toEdge.from !== viaNodeId))
  )) {
    issues.push('traffic-restriction-transition-is-not-contiguous');
  }
  const normalizedIssues = Object.freeze([...new Set(issues)].sort(compareText));
  const machineEvaluable = sourceMachineEvaluable && normalizedIssues.length === 0;
  return Object.freeze({
    id,
    osmRelationId: raw.osmRelationId === undefined || raw.osmRelationId === null
      ? null
      : String(raw.osmRelationId),
    restriction: typeof raw.restriction === 'string' ? raw.restriction : null,
    mode,
    fromWayId: raw.fromWayId === undefined || raw.fromWayId === null ? null : String(raw.fromWayId),
    toWayId: raw.toWayId === undefined || raw.toWayId === null ? null : String(raw.toWayId),
    viaNodeId,
    viaWayId: raw.viaWayId === undefined || raw.viaWayId === null ? null : String(raw.viaWayId),
    fromEdgeIds,
    toEdgeIds,
    sourceMachineEvaluable,
    machineEvaluable,
    conditionalRaw: typeof raw.conditionalRaw === 'string' ? raw.conditionalRaw : null,
    issues: normalizedIssues,
    source: normalizeRestrictionSource(raw.source),
    navigationGrade: false
  });
}

function normalizeDeclaredCoverage(value) {
  const coverage = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const count = (candidate) => Number.isSafeInteger(candidate) && candidate >= 0 ? candidate : null;
  return Object.freeze({
    totalCount: count(coverage.totalCount ?? coverage.sourceRelationCount),
    machineEvaluableCount: count(coverage.machineEvaluableCount),
    unresolvedCount: count(coverage.unresolvedCount),
    conditionalEvaluated: coverage.conditionalEvaluated === true,
    navigationGrade: false
  });
}

export function isTrafficEdgeAccessible(edge) {
  if (edge.motorcycleAccess?.allowed === false) return false;
  if (edge.maxspeedKph !== null && edge.maxspeedKph !== undefined
    && finiteNonNegative(edge.maxspeedKph, `Edge ${edge.id} maxspeedKph`) === 0) return false;
  if (typeof edge.access !== 'string') return true;
  return !DENIED_ACCESS.has(edge.access.trim().toLowerCase());
}

export function resolveEdgeSpeedLimitKph(edge) {
  if (edge.maxspeedKph !== null && edge.maxspeedKph !== undefined) {
    const reported = finiteNonNegative(edge.maxspeedKph, `Edge ${edge.id} maxspeedKph`);
    return Object.freeze({
      kph: Math.min(TRAFFIC_LIMITS.maximumTrafficSpeedKph, reported),
      provenance: reported > TRAFFIC_LIMITS.maximumTrafficSpeedKph
        ? 'reported-maxspeed-simulation-cap'
        : 'reported-maxspeed'
    });
  }
  const highway = typeof edge.highway === 'string' ? edge.highway.trim().toLowerCase() : 'road';
  const fallback = DEFAULT_SPEED_LIMITS_KPH[highway] ?? DEFAULT_SPEED_LIMITS_KPH.road;
  return Object.freeze({ kph: fallback, provenance: 'bounded-highway-class-default' });
}

export function compileRoadGraph(roadGraph, options = {}) {
  if (!roadGraph || typeof roadGraph !== 'object' || Array.isArray(roadGraph)) {
    throw new TypeError('roadGraph must be an object.');
  }
  if (roadGraph.schemaVersion !== ROAD_GRAPH_SCHEMA) {
    throw new TypeError(`roadGraph.schemaVersion must be ${ROAD_GRAPH_SCHEMA}.`);
  }
  if (roadGraph.navigationGrade !== false) {
    throw new TypeError('roadGraph.navigationGrade must explicitly be false.');
  }
  if (roadGraph.connectivity !== 'shared-osm-node-identifiers-only') {
    throw new TypeError('roadGraph must use shared OSM node identifiers for connectivity.');
  }
  if (!Array.isArray(roadGraph.nodes) || !Array.isArray(roadGraph.edges)) {
    throw new TypeError('roadGraph.nodes and roadGraph.edges must be arrays.');
  }

  const maxNodes = boundedInteger(
    options.maxGraphNodes,
    TRAFFIC_LIMITS.absoluteMaxGraphNodes,
    TRAFFIC_LIMITS.absoluteMaxGraphNodes,
    'maxGraphNodes'
  );
  const maxEdges = boundedInteger(
    options.maxGraphEdges,
    TRAFFIC_LIMITS.absoluteMaxGraphEdges,
    TRAFFIC_LIMITS.absoluteMaxGraphEdges,
    'maxGraphEdges'
  );
  const maxRestrictions = boundedInteger(
    options.maxRestrictions,
    TRAFFIC_LIMITS.absoluteMaxRestrictions,
    TRAFFIC_LIMITS.absoluteMaxRestrictions,
    'maxRestrictions'
  );
  if (roadGraph.nodes.length > maxNodes) {
    throw new RangeError(`roadGraph exceeds the ${maxNodes} node simulation cap.`);
  }
  if (roadGraph.edges.length > maxEdges) {
    throw new RangeError(`roadGraph exceeds the ${maxEdges} edge simulation cap.`);
  }
  const rawRestrictions = roadGraph.restrictions ?? [];
  if (!Array.isArray(rawRestrictions)) {
    throw new TypeError('roadGraph.restrictions must be an array when provided.');
  }
  if (rawRestrictions.length > maxRestrictions) {
    throw new RangeError(`roadGraph exceeds the ${maxRestrictions} restriction simulation cap.`);
  }

  const nodeById = new Map();
  const declaredConnections = new Map();
  for (const rawNode of roadGraph.nodes) {
    if (!rawNode || typeof rawNode !== 'object') throw new TypeError('Every road graph node must be an object.');
    const id = requireId(rawNode.id, 'Road graph node id');
    if (nodeById.has(id)) throw new TypeError(`Duplicate road graph node id: ${id}.`);
    const node = Object.freeze({
      id,
      osmNodeId: rawNode.osmNodeId === undefined ? null : String(rawNode.osmNodeId),
      coordinates: validateWgs84Coordinate(rawNode.coordinates, `Node ${id} coordinates`)
    });
    nodeById.set(id, node);
    declaredConnections.set(id, Object.freeze({
      incoming: normalizeIdList(rawNode.incomingEdgeIds, `Node ${id} incomingEdgeIds`),
      outgoing: normalizeIdList(rawNode.outgoingEdgeIds, `Node ${id} outgoingEdgeIds`)
    }));
  }

  const edgeById = new Map();
  for (const rawEdge of roadGraph.edges) {
    if (!rawEdge || typeof rawEdge !== 'object') throw new TypeError('Every road graph edge must be an object.');
    const id = requireId(rawEdge.id, 'Road graph edge id');
    if (edgeById.has(id)) throw new TypeError(`Duplicate road graph edge id: ${id}.`);
    const from = requireId(rawEdge.from, `Edge ${id} from`);
    const to = requireId(rawEdge.to, `Edge ${id} to`);
    if (!nodeById.has(from) || !nodeById.has(to)) {
      throw new TypeError(`Edge ${id} references an unknown node.`);
    }
    if (from === to) throw new TypeError(`Edge ${id} must connect two distinct OSM node identifiers.`);
    if (rawEdge.direction !== 'forward' && rawEdge.direction !== 'reverse') {
      throw new TypeError(`Edge ${id} direction must be forward or reverse.`);
    }
    const edge = {
      id,
      osmWayId: rawEdge.osmWayId === undefined ? null : String(rawEdge.osmWayId),
      segmentIndex: Number.isSafeInteger(rawEdge.segmentIndex) ? rawEdge.segmentIndex : null,
      direction: rawEdge.direction,
      from,
      to,
      lengthMeters: finitePositive(rawEdge.lengthMeters, `Edge ${id} lengthMeters`),
      highway: typeof rawEdge.highway === 'string' ? rawEdge.highway : null,
      access: typeof rawEdge.access === 'string' ? rawEdge.access : null,
      surface: typeof rawEdge.surface === 'string' ? rawEdge.surface : null,
      lanes: normalizeReportedTotalLanes(rawEdge.lanes, `Edge ${id} lanes`),
      maxspeedKph: rawEdge.maxspeedKph ?? null,
      motorcycleAccess: rawEdge.motorcycleAccess && typeof rawEdge.motorcycleAccess === 'object'
        ? Object.freeze({
          allowed: rawEdge.motorcycleAccess.allowed !== false,
          reason: typeof rawEdge.motorcycleAccess.reason === 'string'
            ? rawEdge.motorcycleAccess.reason
            : null
        })
        : null
    };
    const speedLimit = resolveEdgeSpeedLimitKph(edge);
    edgeById.set(id, { ...edge, speedLimit });
  }

  const edgesBySegment = new Map();
  for (const edge of edgeById.values()) {
    const key = laneSegmentKey(edge);
    if (key === null) continue;
    if (!edgesBySegment.has(key)) edgesBySegment.set(key, []);
    edgesBySegment.get(key).push(edge);
  }
  for (const edge of [...edgeById.values()]) {
    const reciprocalEdge = findReciprocalEdge(edge, edgesBySegment);
    edgeById.set(edge.id, Object.freeze({
      ...edge,
      laneModel: deriveLaneModel(edge, reciprocalEdge)
    }));
  }

  const incomingByNode = new Map([...nodeById.keys()].map((id) => [id, []]));
  const outgoingByNode = new Map([...nodeById.keys()].map((id) => [id, []]));
  for (const edge of edgeById.values()) {
    incomingByNode.get(edge.to).push(edge);
    outgoingByNode.get(edge.from).push(edge);
  }
  for (const nodeId of nodeById.keys()) {
    const incoming = incomingByNode.get(nodeId).sort((left, right) => compareText(left.id, right.id));
    const outgoing = outgoingByNode.get(nodeId).sort((left, right) => compareText(left.id, right.id));
    incomingByNode.set(nodeId, Object.freeze(incoming));
    outgoingByNode.set(nodeId, Object.freeze(outgoing));
    const declared = declaredConnections.get(nodeId);
    assertSameIds(declared.incoming, incoming.map((edge) => edge.id), `Node ${nodeId} incomingEdgeIds`);
    assertSameIds(declared.outgoing, outgoing.map((edge) => edge.id), `Node ${nodeId} outgoingEdgeIds`);
  }

  const nodes = Object.freeze([...nodeById.values()].sort((left, right) => compareText(left.id, right.id)));
  const edges = Object.freeze([...edgeById.values()].sort((left, right) => compareText(left.id, right.id)));
  const eligibleEdges = Object.freeze(edges.filter(isTrafficEdgeAccessible));
  const restrictions = Object.freeze(rawRestrictions
    .map((restriction, index) => normalizeRestriction(restriction, index, edgeById))
    .sort((left, right) => compareText(left.id, right.id)));
  const machineEvaluableRestrictions = Object.freeze(
    restrictions.filter((restriction) => restriction.machineEvaluable)
  );
  const unresolvedRestrictions = Object.freeze(
    restrictions.filter((restriction) => !restriction.machineEvaluable)
  );
  const restrictionByFromEdge = new Map();
  for (const restriction of machineEvaluableRestrictions) {
    const fromEdgeId = restriction.fromEdgeIds[0];
    if (!restrictionByFromEdge.has(fromEdgeId)) {
      restrictionByFromEdge.set(fromEdgeId, {
        prohibitedToEdgeIds: new Set(),
        onlyToEdgeIds: new Set(),
        restrictionIds: []
      });
    }
    const entry = restrictionByFromEdge.get(fromEdgeId);
    const destination = restriction.mode === 'only-transition'
      ? entry.onlyToEdgeIds
      : entry.prohibitedToEdgeIds;
    destination.add(restriction.toEdgeIds[0]);
    entry.restrictionIds.push(restriction.id);
  }
  for (const [edgeId, entry] of restrictionByFromEdge) {
    restrictionByFromEdge.set(edgeId, Object.freeze({
      prohibitedToEdgeIds: entry.prohibitedToEdgeIds,
      onlyToEdgeIds: entry.onlyToEdgeIds,
      restrictionIds: Object.freeze([...entry.restrictionIds].sort(compareText))
    }));
  }
  const laneCoverage = Object.freeze({
    sourceField: 'graph.edges[].lanes',
    sourceSemantics: 'osm-reported-total-lanes',
    directedEdgeCount: edges.length,
    reportedTotalLaneCountEdgeCount: edges.filter((edge) => edge.lanes !== null).length,
    missingTotalLaneCountEdgeCount: edges.filter((edge) => edge.lanes === null).length,
    fractionalTotalLaneCountEdgeCount: edges.filter((edge) => edge.laneModel.sourceRoundedForGame).length,
    cappedDerivedLaneEdgeCount: edges.filter((edge) => edge.laneModel.sourceCappedForGame).length,
    minimumExpandedDirectedEdgeCount: edges.filter((edge) => edge.laneModel.minimumExpandedForGame).length,
    reciprocalDirectedEdgeCount: edges.filter((edge) => edge.laneModel.reciprocalDirection).length,
    oneWayDirectedEdgeCount: edges.filter((edge) => !edge.laneModel.reciprocalDirection).length,
    maximumDerivedDirectionalLaneCount: edges.reduce(
      (maximum, edge) => Math.max(maximum, edge.laneModel.directionalLaneCount),
      0
    ),
    derived: true,
    gameOnly: true,
    navigationGrade: false
  });
  const declaredRestrictionCoverage = normalizeDeclaredCoverage(roadGraph.restrictionCoverage);
  const unresolvedRestrictionDetails = Object.freeze(unresolvedRestrictions.slice(
    0,
    TRAFFIC_LIMITS.unresolvedRestrictionDetailCap
  ));
  const restrictionCoverage = Object.freeze({
    sourceField: 'graph.restrictions',
    totalCount: restrictions.length,
    machineEvaluableCount: machineEvaluableRestrictions.length,
    unresolvedCount: unresolvedRestrictions.length,
    prohibitedTransitionCount: machineEvaluableRestrictions.filter(
      (restriction) => restriction.mode === 'prohibited-transition'
    ).length,
    onlyTransitionCount: machineEvaluableRestrictions.filter(
      (restriction) => restriction.mode === 'only-transition'
    ).length,
    declared: declaredRestrictionCoverage,
    declaredCoverageMatchesCompiled: (
      (declaredRestrictionCoverage.totalCount === null
        || declaredRestrictionCoverage.totalCount === restrictions.length)
      && (declaredRestrictionCoverage.machineEvaluableCount === null
        || declaredRestrictionCoverage.machineEvaluableCount === machineEvaluableRestrictions.length)
      && (declaredRestrictionCoverage.unresolvedCount === null
        || declaredRestrictionCoverage.unresolvedCount === unresolvedRestrictions.length)
    ),
    unresolvedRestrictionDetails,
    unresolvedRestrictionDetailCount: unresolvedRestrictionDetails.length,
    unresolvedRestrictionDetailOmittedCount: Math.max(
      0,
      unresolvedRestrictions.length - unresolvedRestrictionDetails.length
    ),
    conditionalEvaluated: false,
    navigationGrade: false
  });
  return Object.freeze({
    nodes,
    edges,
    eligibleEdges,
    nodeById,
    edgeById,
    outgoingByNode,
    restrictions,
    restrictionByFromEdge,
    vehicle: typeof roadGraph.vehicle === 'string' ? roadGraph.vehicle : null,
    graphSummary: Object.freeze({
      schemaVersion: ROAD_GRAPH_SCHEMA,
      navigationGrade: false,
      connectivity: 'shared-osm-node-identifiers-only',
      nodeCount: nodes.length,
      directedEdgeCount: edges.length,
      eligibleDirectedEdgeCount: eligibleEdges.length,
      accessExcludedEdgeCount: edges.length - eligibleEdges.length,
      laneCoverage,
      restrictionCoverage,
      caps: Object.freeze({
        maxGraphNodes: maxNodes,
        maxGraphEdges: maxEdges,
        maxRestrictions,
        maxDerivedTotalLanes: TRAFFIC_LIMITS.absoluteMaxDerivedTotalLanes,
        maxLaneCenterOffsetMeters: TRAFFIC_LIMITS.absoluteMaxLaneCenterOffsetMeters,
        unresolvedRestrictionDetailCap: TRAFFIC_LIMITS.unresolvedRestrictionDetailCap
      })
    })
  });
}
