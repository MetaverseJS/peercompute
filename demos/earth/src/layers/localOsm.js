import { classifyShortbreadRoad, normalizeBuildingHeight } from '@peercompute/geo-core';

function featureCollection(value) {
  return value?.type === 'FeatureCollection' && Array.isArray(value.features) ? value.features : [];
}

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

function positions(Cesium, coordinates, height = 0) {
  return coordinates.map(([longitude, latitude]) => Cesium.Cartesian3.fromDegrees(longitude, latitude, height));
}

function polygonHierarchy(Cesium, rings) {
  if (!Array.isArray(rings) || rings.length < 1) return null;
  const outer = positions(Cesium, rings[0]);
  if (outer.length < 3) return null;
  return new Cesium.PolygonHierarchy(
    outer,
    rings.slice(1)
      .map((ring) => positions(Cesium, ring))
      .filter((ring) => ring.length >= 3)
      .map((ring) => new Cesium.PolygonHierarchy(ring))
  );
}

export function extractLocalOsmCollections(envelope) {
  const data = envelope?.data;
  if (data?.type !== 'OsmRegion'
    || data.roads?.type !== 'FeatureCollection'
    || data.buildings?.type !== 'FeatureCollection'
    || data.roadGraph?.schemaVersion !== 'peercompute.geo.road-graph.v1') {
    throw new TypeError('Local OSM rendering requires the canonical geodata region contract.');
  }
  return {
    roads: featureCollection(data.roads),
    buildings: featureCollection(data.buildings),
    graph: data.roadGraph,
    counts: data.counts,
    provenance: envelope?.provenance ?? null
  };
}

export function classifyLocalRoad(properties = {}) {
  return classifyShortbreadRoad({
    highway: properties?.semantics?.highway
      ?? properties?.rawTags?.highway
      ?? properties?.highway
  });
}

export function normalizeLocalBuilding(properties = {}) {
  const backend = properties?.heights;
  if (Number.isFinite(backend?.heightMeters) && backend.heightMeters > 0) {
    return Object.freeze({
      heightMeters: backend.heightMeters,
      baseHeightMeters: Number.isFinite(backend.minimumHeightMeters)
        ? backend.minimumHeightMeters
        : 0,
      heightSource: backend.heightProvenance ?? 'backend-normalized',
      baseHeightSource: backend.minimumHeightMeters > 0 ? 'backend-normalized' : 'ground',
      heightDerived: backend.heightProvenance !== 'source-height',
      heightClamped: backend.heightWasClamped === true,
      sourceHeight: backend.sourceHeight ?? null,
      sourceLevels: backend.sourceLevels ?? null
    });
  }
  return normalizeBuildingHeight(properties?.rawTags ?? properties?.tags ?? properties);
}

export function renderLocalOsmRegion(
  Cesium,
  viewer,
  envelope,
  { maximumRoads = 1_500, maximumBuildings = 1_500 } = {}
) {
  const collections = extractLocalOsmCollections(envelope);
  const dataSource = new Cesium.CustomDataSource('earthgrid-local-osm');
  let renderedRoads = 0;
  let renderedBuildings = 0;

  for (const feature of collections.roads.slice(0, maximumRoads)) {
    const style = classifyLocalRoad(feature.properties);
    for (const line of geometryLines(feature.geometry)) {
      if (!Array.isArray(line) || line.length < 2) continue;
      dataSource.entities.add({
        id: `osm-road-${feature.id ?? feature.properties?.osmWayId ?? renderedRoads}-${renderedRoads}`,
        name: feature.properties?.name ?? `${style.category.toUpperCase()} ROAD`,
        properties: { ...feature.properties, sourceAuthoritative: true, operationalUse: false },
        polyline: {
          positions: positions(Cesium, line),
          width: Math.max(2, style.width + 1),
          material: Cesium.Color.fromCssColorString(style.color).withAlpha(0.96),
          clampToGround: true,
          classificationType: Cesium.ClassificationType.TERRAIN
        }
      });
      renderedRoads += 1;
    }
  }

  for (const feature of collections.buildings.slice(0, maximumBuildings)) {
    const normalized = normalizeLocalBuilding(feature.properties);
    for (const rings of geometryPolygons(feature.geometry)) {
      const hierarchy = polygonHierarchy(Cesium, rings);
      if (!hierarchy) continue;
      dataSource.entities.add({
        id: `osm-building-${feature.id ?? feature.properties?.osmWayId ?? renderedBuildings}-${renderedBuildings}`,
        name: feature.properties?.name ?? 'OSM BUILDING',
        properties: {
          ...feature.properties,
          ...normalized,
          sourceAuthoritative: true,
          operationalUse: false
        },
        polygon: {
          hierarchy,
          height: normalized.baseHeightMeters,
          extrudedHeight: normalized.heightMeters,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          material: Cesium.Color.fromCssColorString('#178cff').withAlpha(0.2),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#32aaff').withAlpha(0.95),
          closeTop: true,
          closeBottom: true
        }
      });
      renderedBuildings += 1;
    }
  }

  viewer.dataSources.add(dataSource);
  return {
    dataSource,
    sourceRoads: collections.roads.length,
    sourceBuildings: collections.buildings.length,
    renderedRoads,
    renderedBuildings,
    graph: collections.graph,
    displayOmitted: Math.max(0, collections.roads.length - maximumRoads)
      + Math.max(0, collections.buildings.length - maximumBuildings),
    destroy() {
      if (viewer.dataSources.contains(dataSource)) viewer.dataSources.remove(dataSource, true);
    }
  };
}
