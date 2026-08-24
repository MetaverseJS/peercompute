import { GeodataError } from '../errors.js';
import {
  assembleMultipolygon,
  canonicalizeRing,
  coordinateKey,
  featureCollectionBbox,
  normalizeCoordinate,
  normalizeLineGeometry,
  stitchRelationRings
} from './geometry.js';
import {
  deriveBuildingHeights,
  deriveRoadSemantics,
  normalizeTags
} from './semantics.js';

const EARTH_RADIUS_METERS = 6_371_008.8;

function invalidSchema(message) {
  return new GeodataError('UPSTREAM_SCHEMA_INVALID', message, {
    statusCode: 502,
    retryable: false
  });
}

function resultLimit(message) {
  return new GeodataError('REGION_RESULT_LIMIT_EXCEEDED', `${message}; request a smaller region.`, {
    statusCode: 422,
    retryable: false
  });
}

function normalizeId(value, kind = 'element') {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return String(value);
  if (typeof value === 'string' && /^\d+$/u.test(value)) return BigInt(value).toString();
  throw invalidSchema(`The OSM source returned an invalid ${kind} identifier.`);
}

function compareIds(left, right) {
  const leftValue = BigInt(left);
  const rightValue = BigInt(right);
  if (leftValue < rightValue) return -1;
  if (leftValue > rightValue) return 1;
  return 0;
}

function normalizeTimestamp(value) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function normalizeSourceMetadata(element, type, id) {
  return Object.freeze({
    type,
    id,
    version: Number.isSafeInteger(element.version) && element.version > 0 ? element.version : null,
    timestamp: normalizeTimestamp(element.timestamp)
  });
}

function safeTags(element) {
  try {
    return normalizeTags(element.tags);
  } catch (error) {
    throw invalidSchema(error.message);
  }
}

function isRoad(element) {
  return element?.type === 'way' && typeof element.tags?.highway === 'string';
}

function isBuilding(element) {
  return (element?.type === 'way' || element?.type === 'relation')
    && (typeof element.tags?.building === 'string' || typeof element.tags?.['building:part'] === 'string');
}

function isTurnRestriction(element) {
  return element?.type === 'relation' && element.tags?.type === 'restriction';
}

function normalizeRoadWay(element) {
  const id = normalizeId(element.id, 'way');
  if (!Array.isArray(element.nodes) || !Array.isArray(element.geometry)
    || element.nodes.length !== element.geometry.length || element.nodes.length < 2) {
    throw invalidSchema('The OSM source omitted ordered road node identifiers or aligned geometry.');
  }
  const nodeIds = element.nodes.map((nodeId) => normalizeId(nodeId, 'node'));
  const coordinates = element.geometry.map(normalizeCoordinate);
  const tags = safeTags(element);
  const semantics = deriveRoadSemantics(tags);
  const source = normalizeSourceMetadata(element, 'way', id);
  const feature = Object.freeze({
    type: 'Feature',
    id: `way/${id}`,
    geometry: Object.freeze({ type: 'LineString', coordinates }),
    properties: Object.freeze({
      osmType: 'way',
      osmId: id,
      orderedNodeIds: nodeIds,
      name: tags.name ?? null,
      ref: tags.ref ?? null,
      rawTags: tags,
      semantics,
      source
    })
  });
  return Object.freeze({ id, nodeIds, coordinates, tags, semantics, source, feature });
}

function buildingProperties(
  element,
  type,
  id,
  tags,
  memberWayIds = [],
  orderedNodeIds = [],
  memberWays = [],
  orderedNodeIdsComplete = true
) {
  return Object.freeze({
    osmType: type,
    osmId: id,
    memberWayIds,
    orderedNodeIds,
    orderedNodeIdsComplete,
    memberWays,
    name: tags.name ?? null,
    building: tags.building ?? null,
    buildingPart: tags['building:part'] ?? null,
    rawTags: tags,
    heights: deriveBuildingHeights(tags),
    source: normalizeSourceMetadata(element, type, id)
  });
}

function normalizeBuildingWay(element) {
  const id = normalizeId(element.id, 'way');
  const tags = safeTags(element);
  if (!Array.isArray(element.nodes) || !Array.isArray(element.geometry)
    || element.nodes.length !== element.geometry.length || element.nodes.length < 4) {
    throw invalidSchema('The OSM source omitted ordered building node identifiers or aligned geometry.');
  }
  const line = normalizeLineGeometry(element.geometry, 3);
  const ring = canonicalizeRing(line, 'outer');
  const orderedNodeIds = element.nodes.map((nodeId) => normalizeId(nodeId, 'node'));
  return Object.freeze({
    type: 'Feature',
    id: `way/${id}`,
    geometry: Object.freeze({ type: 'Polygon', coordinates: [ring] }),
    properties: buildingProperties(element, 'way', id, tags, [], orderedNodeIds)
  });
}

function normalizeRelationMember(member) {
  if (member?.type !== 'way') return null;
  const role = member.role === 'inner' ? 'inner' : member.role === 'outer' || member.role === '' ? 'outer' : null;
  if (!role) return null;
  return Object.freeze({
    type: 'way',
    ref: normalizeId(member.ref, 'relation member way'),
    role,
    geometry: member.geometry
  });
}

function normalizeBuildingRelation(element, sourceWaysById) {
  const id = normalizeId(element.id, 'relation');
  const tags = safeTags(element);
  if (!Array.isArray(element.members)) {
    throw invalidSchema('The OSM source omitted building relation members.');
  }
  const members = element.members.map(normalizeRelationMember).filter(Boolean);
  const outerMembers = members.filter((member) => member.role === 'outer');
  const innerMembers = members.filter((member) => member.role === 'inner');
  const outerRings = stitchRelationRings(outerMembers, 'outer');
  const innerRings = stitchRelationRings(innerMembers, 'inner');
  const geometry = assembleMultipolygon(outerRings, innerRings);
  const memberWayIds = [...new Set(members.map((member) => member.ref))].sort(compareIds);
  const memberWays = [...members]
    .sort((left, right) => left.role.localeCompare(right.role) || compareIds(left.ref, right.ref))
    .map((member) => {
      const sourceWay = sourceWaysById.get(member.ref);
      const orderedNodeIds = Array.isArray(sourceWay?.nodes)
        ? sourceWay.nodes.map((nodeId) => normalizeId(nodeId, 'relation member node'))
        : [];
      return Object.freeze({
        osmWayId: member.ref,
        role: member.role,
        orderedNodeIds: Object.freeze(orderedNodeIds)
      });
    });
  const orderedNodeIdsComplete = memberWays.every((member) => member.orderedNodeIds.length >= 2);
  const orderedNodeIds = orderedNodeIdsComplete
    ? Object.freeze(memberWays.flatMap((member) => member.orderedNodeIds))
    : Object.freeze([]);
  return Object.freeze({
    feature: Object.freeze({
      type: 'Feature',
      id: `relation/${id}`,
      geometry,
      properties: buildingProperties(
        element,
        'relation',
        id,
        tags,
        memberWayIds,
        orderedNodeIds,
        Object.freeze(memberWays),
        orderedNodeIdsComplete
      )
    }),
    memberWayIds
  });
}

function degreesToRadians(value) {
  return value * Math.PI / 180;
}

function segmentLengthMeters(left, right) {
  const latitudeDelta = degreesToRadians(right[1] - left[1]);
  const longitudeDelta = degreesToRadians(right[0] - left[0]);
  const leftLatitude = degreesToRadians(left[1]);
  const rightLatitude = degreesToRadians(right[1]);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(leftLatitude) * Math.cos(rightLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return Number((2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(haversine)))).toFixed(3));
}

function createRoadGraph(roads, limits) {
  const nodes = new Map();
  const edges = [];
  let eligibleWayCount = 0;

  const ensureNode = (nodeId, coordinate) => {
    const id = `node/${nodeId}`;
    const existing = nodes.get(id);
    if (existing) {
      if (existing.coordinates[0] !== coordinate[0] || existing.coordinates[1] !== coordinate[1]) {
        throw invalidSchema('The OSM source assigned conflicting coordinates to one road node identifier.');
      }
      return existing;
    }
    const node = { id, osmNodeId: nodeId, coordinates: coordinate, incomingEdgeIds: [], outgoingEdgeIds: [] };
    nodes.set(id, node);
    return node;
  };

  const addEdge = (road, segmentIndex, fromIndex, toIndex, direction) => {
    const fromNode = ensureNode(road.nodeIds[fromIndex], road.coordinates[fromIndex]);
    const toNode = ensureNode(road.nodeIds[toIndex], road.coordinates[toIndex]);
    const lengthMeters = segmentLengthMeters(fromNode.coordinates, toNode.coordinates);
    if (lengthMeters === 0) return;
    const edgeId = `way/${road.id}/segment/${segmentIndex}/${direction}`;
    const edge = Object.freeze({
      id: edgeId,
      osmWayId: road.id,
      segmentIndex,
      direction,
      from: fromNode.id,
      to: toNode.id,
      lengthMeters,
      highway: road.semantics.highway,
      access: road.semantics.access,
      surface: road.semantics.surface,
      lanes: road.semantics.lanes,
      maxspeedKph: road.semantics.maxspeed.kph
    });
    edges.push(edge);
    fromNode.outgoingEdgeIds.push(edgeId);
    toNode.incomingEdgeIds.push(edgeId);
    if (edges.length > limits.maxDirectedGraphEdges) {
      throw resultLimit(`The region contains more than ${limits.maxDirectedGraphEdges} directed road edges`);
    }
  };

  for (const road of roads) {
    if (!road.semantics.motorcycleAccess.allowed) continue;
    eligibleWayCount += 1;
    for (let index = 0; index < road.nodeIds.length - 1; index += 1) {
      if (road.semantics.oneway === 'reverse') {
        addEdge(road, index, index + 1, index, 'reverse');
      } else {
        addEdge(road, index, index, index + 1, 'forward');
        if (road.semantics.oneway === 'both') addEdge(road, index, index + 1, index, 'reverse');
      }
    }
  }

  if (nodes.size > limits.maxUniqueNodes) {
    throw resultLimit(`The region contains more than ${limits.maxUniqueNodes} unique road nodes`);
  }

  const normalizedNodes = [...nodes.values()]
    .sort((left, right) => compareIds(left.osmNodeId, right.osmNodeId))
    .map((node) => Object.freeze({
      ...node,
      incomingEdgeIds: Object.freeze([...node.incomingEdgeIds].sort()),
      outgoingEdgeIds: Object.freeze([...node.outgoingEdgeIds].sort())
    }));
  edges.sort((left, right) => left.id.localeCompare(right.id));

  return Object.freeze({
    schemaVersion: 'peercompute.geo.road-graph.v1',
    vehicle: 'motorcycle',
    navigationGrade: false,
    connectivity: 'shared-osm-node-identifiers-only',
    sourceWayCount: roads.length,
    eligibleWayCount,
    excludedWayCount: roads.length - eligibleWayCount,
    nodes: normalizedNodes,
    edges
  });
}

function restrictionMember(element, role, type) {
  const matches = (element.members ?? []).filter((member) => (
    member?.role === role && member?.type === type
  ));
  if (matches.length !== 1) return null;
  return normalizeId(matches[0].ref, `${role} ${type}`);
}

function normalizeTurnRestriction(element, roadGraph) {
  const id = normalizeId(element.id, 'restriction relation');
  const tags = safeTags(element);
  const fromWayId = restrictionMember(element, 'from', 'way');
  const toWayId = restrictionMember(element, 'to', 'way');
  const viaNodeSourceId = restrictionMember(element, 'via', 'node');
  const viaWayId = restrictionMember(element, 'via', 'way');
  const viaNodeId = viaNodeSourceId === null ? null : `node/${viaNodeSourceId}`;
  const restriction = tags['restriction:motorcycle'] ?? tags.restriction ?? null;
  const conditional = tags['restriction:motorcycle:conditional']
    ?? tags['restriction:conditional']
    ?? null;
  const mode = typeof restriction === 'string' && restriction.startsWith('no_')
    ? 'prohibited-transition'
    : typeof restriction === 'string' && restriction.startsWith('only_')
      ? 'only-transition'
      : 'unsupported';
  const fromEdgeIds = fromWayId && viaNodeId
    ? roadGraph.edges
      .filter((edge) => edge.osmWayId === fromWayId && edge.to === viaNodeId)
      .map((edge) => edge.id)
      .sort()
    : [];
  const toEdgeIds = toWayId && viaNodeId
    ? roadGraph.edges
      .filter((edge) => edge.osmWayId === toWayId && edge.from === viaNodeId)
      .map((edge) => edge.id)
      .sort()
    : [];
  const issues = [];
  if (!fromWayId) issues.push('missing-or-ambiguous-from-way');
  if (!toWayId) issues.push('missing-or-ambiguous-to-way');
  if (!viaNodeId) issues.push(viaWayId ? 'via-way-not-evaluated' : 'missing-or-ambiguous-via');
  if (mode === 'unsupported') issues.push('unsupported-restriction-kind');
  if (conditional) issues.push('conditional-restriction-not-evaluated');
  if (fromEdgeIds.length !== 1) issues.push('from-edge-not-unique-in-bounded-graph');
  if (toEdgeIds.length !== 1) issues.push('to-edge-not-unique-in-bounded-graph');
  const machineEvaluable = issues.length === 0;
  return Object.freeze({
    id: `relation/${id}`,
    osmRelationId: id,
    restriction,
    mode,
    fromWayId,
    toWayId,
    viaNodeId,
    viaWayId,
    fromEdgeIds: Object.freeze(fromEdgeIds),
    toEdgeIds: Object.freeze(toEdgeIds),
    machineEvaluable,
    conditionalRaw: conditional,
    issues: Object.freeze(issues),
    rawTags: tags,
    source: normalizeSourceMetadata(element, 'relation', id),
    navigationGrade: false,
  });
}

function collectUniqueSourceNodes(elements, sourceWaysById, limits) {
  const uniqueNodes = new Set();
  for (const element of elements) {
    if (element?.type === 'way' && Array.isArray(element.nodes)) {
      for (const nodeId of element.nodes) uniqueNodes.add(`node/${normalizeId(nodeId, 'node')}`);
    } else if (element?.type === 'relation' && Array.isArray(element.members)) {
      for (const member of element.members) {
        if (member?.type !== 'way' || !Array.isArray(member.geometry)) continue;
        const memberWay = sourceWaysById.get(normalizeId(member.ref, 'relation member way'));
        if (Array.isArray(memberWay?.nodes) && memberWay.nodes.length >= 2) {
          for (const nodeId of memberWay.nodes) uniqueNodes.add(`node/${normalizeId(nodeId, 'node')}`);
        } else {
          for (const point of member.geometry) uniqueNodes.add(`coordinate/${coordinateKey(normalizeCoordinate(point))}`);
        }
      }
    }
    if (uniqueNodes.size > limits.maxUniqueNodes) {
      throw resultLimit(`The region contains more than ${limits.maxUniqueNodes} unique source nodes`);
    }
  }
  return uniqueNodes.size;
}

export function normalizeOverpassRegion(payload, { bbox, layers, vehicle = 'motorcycle', limits }) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.elements)) {
    throw invalidSchema('The OSM source returned an invalid Overpass document.');
  }
  if (vehicle !== 'motorcycle') throw new TypeError('Only motorcycle road-graph normalization is supported.');

  const sourceWaysById = new Map(payload.elements
    .filter((element) => element?.type === 'way')
    .map((element) => [normalizeId(element.id, 'way'), element]));

  const selectedElements = payload.elements.filter((element) => isRoad(element) || isBuilding(element));
  const roadElements = layers.includes('roads') ? selectedElements.filter(isRoad) : [];
  const buildingElements = layers.includes('buildings') ? selectedElements.filter(isBuilding) : [];
  const restrictionElements = layers.includes('roads')
    ? payload.elements.filter(isTurnRestriction)
    : [];

  if (roadElements.length > limits.maxRoadWays) {
    throw resultLimit(`The region contains more than ${limits.maxRoadWays} road ways`);
  }
  if (buildingElements.length > limits.maxBuildings) {
    throw resultLimit(`The region contains more than ${limits.maxBuildings} buildings and building parts`);
  }
  if (restrictionElements.length > limits.maxRestrictionRelations) {
    throw resultLimit(`The region contains more than ${limits.maxRestrictionRelations} turn restriction relations`);
  }
  const uniqueSourceNodeCount = collectUniqueSourceNodes(
    [...roadElements, ...buildingElements],
    sourceWaysById,
    limits
  );

  const roads = roadElements.map(normalizeRoadWay).sort((left, right) => compareIds(left.id, right.id));
  const baseRoadGraph = createRoadGraph(roads, limits);
  const restrictions = restrictionElements
    .map((element) => normalizeTurnRestriction(element, baseRoadGraph))
    .sort((left, right) => left.id.localeCompare(right.id));
  const roadGraph = Object.freeze({
    ...baseRoadGraph,
    restrictions: Object.freeze(restrictions),
    restrictionCoverage: Object.freeze({
      sourceRelationCount: restrictionElements.length,
      machineEvaluableCount: restrictions.filter((restriction) => restriction.machineEvaluable).length,
      unresolvedCount: restrictions.filter((restriction) => !restriction.machineEvaluable).length,
      conditionalEvaluated: false,
      navigationGrade: false,
    }),
  });
  const roadFeatures = roads.map((road) => road.feature);

  const relationBuildings = buildingElements
    .filter((element) => element.type === 'relation')
    .map((element) => normalizeBuildingRelation(element, sourceWaysById))
    .sort((left, right) => left.feature.id.localeCompare(right.feature.id));
  const relationMemberWayIds = new Set(relationBuildings.flatMap((building) => building.memberWayIds));
  const wayBuildings = buildingElements
    .filter((element) => element.type === 'way')
    .filter((element) => !relationMemberWayIds.has(normalizeId(element.id, 'way')))
    .map(normalizeBuildingWay);
  const buildingFeatures = [
    ...wayBuildings,
    ...relationBuildings.map((building) => building.feature)
  ].sort((left, right) => left.id.localeCompare(right.id));

  const sourceBaseTimestamp = normalizeTimestamp(payload.osm3s?.timestamp_osm_base);
  const notes = [];
  if (!sourceBaseTimestamp) notes.push('The Overpass response did not include a valid OSM base timestamp.');

  return Object.freeze({
    type: 'OsmRegion',
    bbox: bbox.values,
    bboxOrder: bbox.requestOrder,
    geoJsonBbox: bbox.geoJsonValues,
    dimensions: bbox.dimensions,
    requestedLayers: layers,
    vehicle,
    sourceBaseTimestamp,
    roads: Object.freeze({
      type: 'FeatureCollection',
      bbox: featureCollectionBbox(bbox),
      features: roadFeatures
    }),
    buildings: Object.freeze({
      type: 'FeatureCollection',
      bbox: featureCollectionBbox(bbox),
      features: buildingFeatures
    }),
    roadGraph,
    counts: Object.freeze({
      roadWays: roadFeatures.length,
      buildings: buildingFeatures.length,
      uniqueSourceNodes: uniqueSourceNodeCount,
      graphNodes: roadGraph.nodes.length,
      directedGraphEdges: roadGraph.edges.length,
      restrictionRelations: restrictions.length,
      machineEvaluableRestrictions: roadGraph.restrictionCoverage.machineEvaluableCount,
      unresolvedRestrictions: roadGraph.restrictionCoverage.unresolvedCount,
    }),
    notes: Object.freeze(notes)
  });
}
