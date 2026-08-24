import {
  classifyShortbreadRoad,
  normalizeBuildingHeight,
  validateOsmRegionEnvelope,
} from '@peercompute/geo-core';

const HIGHWAY_WIDTH_METERS = Object.freeze({
  motorway: 10,
  trunk: 9,
  primary: 8,
  secondary: 7,
  tertiary: 6.5,
  residential: 5.5,
  living_street: 4.5,
  service: 4,
  unclassified: 4.5,
  road: 4.5,
});

function geometryLines(geometry) {
  if (geometry?.type === 'LineString') return [geometry.coordinates];
  if (geometry?.type === 'MultiLineString') return geometry.coordinates;
  return [];
}

function geometryPolygons(geometry) {
  if (geometry?.type === 'Polygon') return [geometry.coordinates];
  if (geometry?.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

function localPoint(terrain, coordinate, heightOffset = 0) {
  const [longitude, latitude] = coordinate;
  const rawHeight = terrain.sampleRawHeight(longitude, latitude);
  const point = terrain.frame.toLocal({ longitude, latitude, height: rawHeight + heightOffset });
  return Object.freeze(Array.from(point));
}

function backendBuildingHeight(properties = {}) {
  const heights = properties.heights;
  if (Number.isFinite(heights?.heightMeters) && heights.heightMeters > 0) {
    return Object.freeze({
      heightMeters: heights.heightMeters,
      baseHeightMeters: Number.isFinite(heights.minimumHeightMeters) ? heights.minimumHeightMeters : 0,
      heightSource: heights.heightProvenance ?? 'backend-normalized',
      heightDerived: heights.heightProvenance !== 'source-height',
      heightClamped: heights.heightWasClamped === true,
    });
  }
  return normalizeBuildingHeight(properties.rawTags ?? properties);
}

function roadWidth(properties = {}) {
  const highway = properties.semantics?.highway ?? properties.rawTags?.highway ?? 'road';
  const lanes = Number(properties.semantics?.lanes ?? properties.rawTags?.lanes);
  const laneWidth = Number.isFinite(lanes) && lanes > 0 ? lanes * 3.2 : 0;
  return Math.max(HIGHWAY_WIDTH_METERS[highway] ?? HIGHWAY_WIDTH_METERS.road, laneWidth);
}

export function localizeRoadGraph(roadGraph, terrain) {
  if (roadGraph?.schemaVersion !== 'peercompute.geo.road-graph.v1'
    || !Array.isArray(roadGraph.nodes)
    || !Array.isArray(roadGraph.edges)) {
    throw new TypeError('A canonical geodata road graph is required.');
  }
  const nodes = roadGraph.nodes.map((node) => Object.freeze({
    ...node,
    localPosition: localPoint(terrain, node.coordinates, 0.03),
  }));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edges = roadGraph.edges.map((edge) => {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) throw new TypeError(`Road edge ${edge.id} references an unknown node.`);
    return Object.freeze({ ...edge, fromNode: from, toNode: to });
  });
  return Object.freeze({
    schemaVersion: 'peercompute.geo.local-road-graph.v1',
    navigationGrade: false,
    sourceSchemaVersion: roadGraph.schemaVersion,
    sourceRoadGraph: roadGraph,
    nodes: Object.freeze(nodes),
    edges: Object.freeze(edges),
    nodeById,
  });
}

export function selectMotorcycleSpawn(localGraph) {
  if (localGraph?.schemaVersion !== 'peercompute.geo.local-road-graph.v1') {
    throw new TypeError('A localized road graph is required.');
  }
  const candidates = localGraph.edges
    .filter((edge) => edge.motorcycleAccess?.allowed !== false && edge.lengthMeters >= 5)
    .map((edge) => {
      const from = edge.fromNode.localPosition;
      const to = edge.toNode.localPosition;
      const midpointX = (from[0] + to[0]) / 2;
      const midpointZ = (from[2] + to[2]) / 2;
      return { edge, distanceFromOrigin: Math.hypot(midpointX, midpointZ) };
    })
    .sort((left, right) => (
      left.distanceFromOrigin - right.distanceFromOrigin
      || right.edge.lengthMeters - left.edge.lengthMeters
      || left.edge.id.localeCompare(right.edge.id)
    ));
  if (candidates.length === 0) throw new RangeError('The bounded region contains no usable motorcycle road segment.');
  const edge = candidates[0].edge;
  const from = edge.fromNode.localPosition;
  const to = edge.toNode.localPosition;
  const alpha = 0.3;
  const position = [
    from[0] + (to[0] - from[0]) * alpha,
    from[1] + (to[1] - from[1]) * alpha,
    from[2] + (to[2] - from[2]) * alpha,
  ];
  const yaw = Math.atan2(to[0] - from[0], to[2] - from[2]);
  return Object.freeze({
    edgeId: edge.id,
    position: Object.freeze(position),
    orientation: Object.freeze([0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)]),
    headingRadians: yaw,
    source: 'osm-directed-road-edge',
    navigationGrade: false,
  });
}

export function createMotorcycleSceneData(envelope, terrain, {
  maximumRoadSegments = 5_000,
  maximumBuildings = 1_500,
} = {}) {
  const region = validateOsmRegionEnvelope(envelope);
  const sourceRoadSegmentCount = region.data.roads.features.reduce((total, feature) => (
    total + geometryLines(feature.geometry).reduce(
      (lineTotal, line) => lineTotal + Math.max(0, line.length - 1),
      0,
    )
  ), 0);
  const roadSegments = [];
  for (const feature of region.data.roads.features) {
    const style = classifyShortbreadRoad({
      highway: feature.properties?.semantics?.highway ?? feature.properties?.rawTags?.highway,
    });
    for (const line of geometryLines(feature.geometry)) {
      for (let index = 0; index < line.length - 1; index += 1) {
        if (roadSegments.length >= maximumRoadSegments) break;
        roadSegments.push(Object.freeze({
          id: `${feature.id}/segment/${index}`,
          from: localPoint(terrain, line[index], 0.08),
          to: localPoint(terrain, line[index + 1], 0.08),
          widthMeters: roadWidth(feature.properties),
          category: style.category,
          color: style.color,
          osmWayId: feature.properties?.osmId ?? null,
          sourceAuthoritative: true,
          navigationGrade: false,
        }));
      }
    }
    if (roadSegments.length >= maximumRoadSegments) break;
  }

  const buildings = [];
  for (const feature of region.data.buildings.features.slice(0, maximumBuildings)) {
    const height = backendBuildingHeight(feature.properties);
    for (const polygon of geometryPolygons(feature.geometry)) {
      if (!Array.isArray(polygon) || polygon.length === 0) continue;
      const rings = polygon.map((ring) => Object.freeze(ring.map((coordinate) => localPoint(
        terrain,
        coordinate,
        height.baseHeightMeters,
      ))));
      if (rings[0]?.length < 4) continue;
      buildings.push(Object.freeze({
        id: `${feature.id}/part/${buildings.length}`,
        rings: Object.freeze(rings),
        ...height,
        properties: feature.properties,
        sourceAuthoritative: true,
        navigationGrade: false,
      }));
    }
  }

  const localGraph = localizeRoadGraph(region.data.roadGraph, terrain);
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.scene-data.v1',
    roadSegments: Object.freeze(roadSegments),
    buildings: Object.freeze(buildings),
    localGraph,
    spawn: selectMotorcycleSpawn(localGraph),
    counts: Object.freeze({
      sourceRoads: region.data.roads.features.length,
      sourceRoadSegments: sourceRoadSegmentCount,
      renderedRoadSegments: roadSegments.length,
      sourceBuildings: region.data.buildings.features.length,
      renderedBuildings: buildings.length,
      omittedRoadSegments: Math.max(0, sourceRoadSegmentCount - roadSegments.length),
      omittedBuildings: Math.max(0, region.data.buildings.features.length - buildings.length),
    }),
    provenance: region.provenance,
    status: region.status,
    operationalUse: false,
  });
}
