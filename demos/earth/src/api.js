import {
  GEODATA_DEFAULT_MAX_RESPONSE_BYTES as SHARED_DEFAULT_MAX_RESPONSE_BYTES,
  OSM_REGION_SCHEMA_VERSION as SHARED_OSM_REGION_SCHEMA_VERSION
} from '@peercompute/geo-core';

import { invokeFetch, readResponseBytesBounded } from './http.js';

export const GEODATA_DEFAULT_MAX_RESPONSE_BYTES = SHARED_DEFAULT_MAX_RESPONSE_BYTES;
export const OSM_REGION_SCHEMA_VERSION = SHARED_OSM_REGION_SCHEMA_VERSION;

const GEODATA_HEALTH_SCHEMA_VERSION = 'peercompute.geodata.health.v1';
const GEODATA_CATALOG_SCHEMA_VERSION = 'peercompute.geodata.catalog.v1';
const GEODATA_ERROR_SCHEMA_VERSION = 'peercompute.geodata.error.v1';
const ROAD_GRAPH_SCHEMA_VERSION = 'peercompute.geo.road-graph.v1';
const GEODATA_SOURCE = 'peercompute-geodata';
const OSM_SOURCE = 'openstreetmap-overpass';
const OSM_ATTRIBUTION = '© OpenStreetMap contributors';
const ODBL_LICENSE_URL = 'https://opendatacommons.org/licenses/odbl/1-0/';
const REQUIRED_CATALOG_SOURCE_IDS = Object.freeze([
  'noaa-etopo2022',
  'aws-terrarium',
  'osm-shortbread',
  'osm-local-region',
  'noaa-nowcoast-radar',
  'noaa-nowcoast-satellite'
]);

function clientError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function schemaError(message) {
  return clientError('ERR_GEODATA_SCHEMA', message);
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertRecord(value, label) {
  if (!isRecord(value)) throw schemaError(`${label} must be an object.`);
  return value;
}

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw schemaError(`${label} must be a non-empty string.`);
  }
  return value;
}

function assertExactIsoDate(value, label, { nullable = false } = {}) {
  if (nullable && value === null) return null;
  if (typeof value !== 'string') throw schemaError(`${label} must be an ISO timestamp.`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.toISOString() !== value) {
    throw schemaError(`${label} must be an exact ISO timestamp.`);
  }
  return value;
}

function assertInteger(value, label, { minimum = 0 } = {}) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw schemaError(`${label} must be an integer greater than or equal to ${minimum}.`);
  }
  return value;
}

function assertFiniteNumber(value, label, { minimum = -Infinity, exclusiveMinimum = false } = {}) {
  const invalidMinimum = exclusiveMinimum ? value <= minimum : value < minimum;
  if (!Number.isFinite(value) || invalidMinimum) {
    throw schemaError(`${label} must be a finite number in its supported range.`);
  }
  return value;
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw schemaError(`${label} must be an array of strings.`);
  }
  return value;
}

function assertNullableString(value, label) {
  if (value !== null && typeof value !== 'string') {
    throw schemaError(`${label} must be a string or null.`);
  }
  return value;
}

function assertTuple(value, label, length, validator) {
  if (!Array.isArray(value) || value.length !== length) {
    throw schemaError(`${label} must contain exactly ${length} values.`);
  }
  value.forEach((entry, index) => validator(entry, `${label}[${index}]`));
  return value;
}

function assertCommonEnvelope(payload, { schemaVersion, source, statuses, staleAt }) {
  assertRecord(payload, 'Geodata envelope');
  if (payload.schemaVersion !== schemaVersion || payload.source !== source) {
    throw schemaError('Geodata API returned an unsupported envelope discriminator.');
  }
  if (!statuses.includes(payload.status) || payload.synthetic !== false) {
    throw schemaError('Geodata API returned an unsupported source status.');
  }
  assertNonEmptyString(payload.operationalUse, 'operationalUse');
  assertExactIsoDate(payload.fetchedAt, 'fetchedAt');
  assertExactIsoDate(payload.staleAt, 'staleAt', { nullable: staleAt === 'nullable' });
  assertStringArray(payload.notes, 'notes');
  return payload;
}

function assertHttpUrl(value, label) {
  assertNonEmptyString(value, label);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw schemaError(`${label} must be an absolute HTTP(S) URL.`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw schemaError(`${label} must be a credential-free HTTP(S) URL.`);
  }
  return value;
}

function assertPosition(position, label) {
  assertTuple(position, label, 2, (value, valueLabel) => assertFiniteNumber(value, valueLabel));
  if (position[0] < -180 || position[0] > 180 || position[1] < -90 || position[1] > 90) {
    throw schemaError(`${label} contains coordinates outside WGS84 bounds.`);
  }
}

function assertLine(line, label) {
  if (!Array.isArray(line) || line.length < 2) throw schemaError(`${label} must contain at least two positions.`);
  line.forEach((position, index) => assertPosition(position, `${label}[${index}]`));
}

function assertRing(ring, label) {
  if (!Array.isArray(ring) || ring.length < 4) throw schemaError(`${label} must contain at least four positions.`);
  ring.forEach((position, index) => assertPosition(position, `${label}[${index}]`));
  const first = ring[0];
  const last = ring.at(-1);
  if (first[0] !== last[0] || first[1] !== last[1]) throw schemaError(`${label} must be closed.`);
}

function assertGeometry(geometry, label, allowedTypes) {
  assertRecord(geometry, `${label}.geometry`);
  if (!allowedTypes.has(geometry.type)) throw schemaError(`${label} has an unsupported geometry type.`);
  if (geometry.type === 'LineString') assertLine(geometry.coordinates, `${label}.geometry.coordinates`);
  if (geometry.type === 'MultiLineString') {
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
      throw schemaError(`${label}.geometry.coordinates must contain at least one line.`);
    }
    geometry.coordinates.forEach((line, index) => assertLine(line, `${label}.geometry.coordinates[${index}]`));
  }
  if (geometry.type === 'Polygon') {
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
      throw schemaError(`${label}.geometry.coordinates must contain at least one ring.`);
    }
    geometry.coordinates.forEach((ring, index) => assertRing(ring, `${label}.geometry.coordinates[${index}]`));
  }
  if (geometry.type === 'MultiPolygon') {
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
      throw schemaError(`${label}.geometry.coordinates must contain at least one polygon.`);
    }
    geometry.coordinates.forEach((polygon, polygonIndex) => {
      if (!Array.isArray(polygon) || polygon.length === 0) {
        throw schemaError(`${label}.geometry.coordinates[${polygonIndex}] must contain at least one ring.`);
      }
      polygon.forEach((ring, ringIndex) => (
        assertRing(ring, `${label}.geometry.coordinates[${polygonIndex}][${ringIndex}]`)
      ));
    });
  }
}

function assertFeatureCollection(value, label, geometryTypes, expectedBbox) {
  assertRecord(value, label);
  if (value.type !== 'FeatureCollection' || !Array.isArray(value.features)) {
    throw schemaError(`${label} must be a canonical GeoJSON FeatureCollection.`);
  }
  assertTuple(value.bbox, `${label}.bbox`, 4, (entry, entryLabel) => assertFiniteNumber(entry, entryLabel));
  if (!value.bbox.every((entry, index) => entry === expectedBbox[index])) {
    throw schemaError(`${label}.bbox does not match the region bounds.`);
  }
  const identifiers = new Set();
  value.features.forEach((feature, index) => {
    const featureLabel = `${label}.features[${index}]`;
    assertRecord(feature, featureLabel);
    if (feature.type !== 'Feature') throw schemaError(`${featureLabel} must be a GeoJSON Feature.`);
    assertNonEmptyString(feature.id, `${featureLabel}.id`);
    if (identifiers.has(feature.id)) throw schemaError(`${label} contains a duplicate feature id.`);
    identifiers.add(feature.id);
    assertGeometry(feature.geometry, featureLabel, geometryTypes);
    assertRecord(feature.properties, `${featureLabel}.properties`);
  });
}

function assertRoadGraph(graph, counts, roadCount) {
  assertRecord(graph, 'data.roadGraph');
  if (graph.schemaVersion !== ROAD_GRAPH_SCHEMA_VERSION
    || graph.vehicle !== 'motorcycle'
    || graph.navigationGrade !== false
    || graph.connectivity !== 'shared-osm-node-identifiers-only') {
    throw schemaError('Geodata API omitted the canonical motorcycle road graph contract.');
  }
  assertInteger(graph.sourceWayCount, 'data.roadGraph.sourceWayCount');
  assertInteger(graph.eligibleWayCount, 'data.roadGraph.eligibleWayCount');
  assertInteger(graph.excludedWayCount, 'data.roadGraph.excludedWayCount');
  if (graph.sourceWayCount !== roadCount
    || graph.eligibleWayCount + graph.excludedWayCount !== graph.sourceWayCount) {
    throw schemaError('Road graph source-way counts do not match the road collection.');
  }
  if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges) || !Array.isArray(graph.restrictions)) {
    throw schemaError('Road graph nodes, edges, and restrictions must be arrays.');
  }
  const nodes = new Map();
  const incomingByNode = new Map();
  const outgoingByNode = new Map();
  graph.nodes.forEach((node, index) => {
    const label = `data.roadGraph.nodes[${index}]`;
    assertRecord(node, label);
    assertNonEmptyString(node.id, `${label}.id`);
    if (typeof node.osmNodeId !== 'string' || !/^\d+$/u.test(node.osmNodeId)
      || node.id !== `node/${node.osmNodeId}`) {
      throw schemaError(`${label} has an invalid OSM node identifier.`);
    }
    if (nodes.has(node.id)) throw schemaError('Road graph contains a duplicate node id.');
    assertPosition(node.coordinates, `${label}.coordinates`);
    assertStringArray(node.incomingEdgeIds, `${label}.incomingEdgeIds`);
    assertStringArray(node.outgoingEdgeIds, `${label}.outgoingEdgeIds`);
    const incoming = new Set(node.incomingEdgeIds);
    const outgoing = new Set(node.outgoingEdgeIds);
    if (incoming.size !== node.incomingEdgeIds.length || outgoing.size !== node.outgoingEdgeIds.length) {
      throw schemaError(`${label} contains duplicate edge indexes.`);
    }
    nodes.set(node.id, node);
    incomingByNode.set(node.id, incoming);
    outgoingByNode.set(node.id, outgoing);
  });
  const edges = new Map();
  graph.edges.forEach((edge, index) => {
    const label = `data.roadGraph.edges[${index}]`;
    assertRecord(edge, label);
    assertNonEmptyString(edge.id, `${label}.id`);
    if (edges.has(edge.id)) throw schemaError('Road graph contains a duplicate edge id.');
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) throw schemaError(`${label} references a missing node.`);
    if (typeof edge.osmWayId !== 'string' || !/^\d+$/u.test(edge.osmWayId)
      || !Number.isSafeInteger(edge.segmentIndex) || edge.segmentIndex < 0
      || !['forward', 'reverse'].includes(edge.direction)
      || typeof edge.highway !== 'string') {
      throw schemaError(`${label} has invalid source-way or direction semantics.`);
    }
    assertFiniteNumber(edge.lengthMeters, `${label}.lengthMeters`, { minimum: 0, exclusiveMinimum: true });
    edges.set(edge.id, edge);
  });
  for (const node of nodes.values()) {
    for (const edgeId of node.outgoingEdgeIds) {
      if (edges.get(edgeId)?.from !== node.id) throw schemaError('Road graph outgoing-edge indexes are incoherent.');
    }
    for (const edgeId of node.incomingEdgeIds) {
      if (edges.get(edgeId)?.to !== node.id) throw schemaError('Road graph incoming-edge indexes are incoherent.');
    }
  }
  for (const edge of edges.values()) {
    if (!outgoingByNode.get(edge.from).has(edge.id)
      || !incomingByNode.get(edge.to).has(edge.id)) {
      throw schemaError('Road graph edges are missing from their node indexes.');
    }
  }

  assertRecord(graph.restrictionCoverage, 'data.roadGraph.restrictionCoverage');
  const coverage = graph.restrictionCoverage;
  const restrictionIds = new Set();
  graph.restrictions.forEach((restriction, index) => {
    const label = `data.roadGraph.restrictions[${index}]`;
    assertRecord(restriction, label);
    assertNonEmptyString(restriction.id, `${label}.id`);
    if (restrictionIds.has(restriction.id)) throw schemaError('Road graph contains a duplicate restriction id.');
    restrictionIds.add(restriction.id);
    if (typeof restriction.osmRelationId !== 'string' || !/^\d+$/u.test(restriction.osmRelationId)
      || restriction.id !== `relation/${restriction.osmRelationId}`
      || !['prohibited-transition', 'only-transition', 'unsupported'].includes(restriction.mode)
      || typeof restriction.machineEvaluable !== 'boolean'
      || restriction.navigationGrade !== false) {
      throw schemaError(`${label} has invalid restriction semantics.`);
    }
    for (const field of ['restriction', 'fromWayId', 'toWayId', 'viaNodeId', 'viaWayId', 'conditionalRaw']) {
      assertNullableString(restriction[field], `${label}.${field}`);
    }
    assertStringArray(restriction.fromEdgeIds, `${label}.fromEdgeIds`);
    assertStringArray(restriction.toEdgeIds, `${label}.toEdgeIds`);
    assertStringArray(restriction.issues, `${label}.issues`);
    for (const edgeId of [...restriction.fromEdgeIds, ...restriction.toEdgeIds]) {
      if (!edges.has(edgeId)) throw schemaError(`${label} references a missing graph edge.`);
    }
    assertRecord(restriction.rawTags, `${label}.rawTags`);
    const source = assertRecord(restriction.source, `${label}.source`);
    if (source.type !== 'relation' || source.id !== restriction.osmRelationId) {
      throw schemaError(`${label}.source does not match its relation id.`);
    }
  });
  assertInteger(coverage.sourceRelationCount, 'data.roadGraph.restrictionCoverage.sourceRelationCount');
  assertInteger(coverage.machineEvaluableCount, 'data.roadGraph.restrictionCoverage.machineEvaluableCount');
  assertInteger(coverage.unresolvedCount, 'data.roadGraph.restrictionCoverage.unresolvedCount');
  const actualMachineEvaluableCount = graph.restrictions.filter((restriction) => restriction.machineEvaluable).length;
  if (coverage.conditionalEvaluated !== false || coverage.navigationGrade !== false
    || coverage.sourceRelationCount !== graph.restrictions.length
    || coverage.machineEvaluableCount !== actualMachineEvaluableCount
    || coverage.unresolvedCount !== graph.restrictions.length - actualMachineEvaluableCount
    || coverage.machineEvaluableCount + coverage.unresolvedCount !== coverage.sourceRelationCount) {
    throw schemaError('Road graph restriction coverage is incoherent.');
  }

  if (counts.graphNodes !== graph.nodes.length
    || counts.directedGraphEdges !== graph.edges.length
    || counts.restrictionRelations !== graph.restrictions.length
    || counts.machineEvaluableRestrictions !== coverage.machineEvaluableCount
    || counts.unresolvedRestrictions !== coverage.unresolvedCount) {
    throw schemaError('Road graph counts do not match the serialized graph.');
  }
}

export function validateHealthEnvelope(payload) {
  assertCommonEnvelope(payload, {
    schemaVersion: GEODATA_HEALTH_SCHEMA_VERSION,
    source: GEODATA_SOURCE,
    statuses: ['ready', 'degraded'],
    staleAt: 'nullable'
  });
  if (payload.staleAt !== null) throw schemaError('Health staleAt must be null.');
  const data = assertRecord(payload.data, 'health.data');
  const readiness = assertRecord(data.readiness, 'health.data.readiness');
  if (typeof readiness.ready !== 'boolean'
    || typeof readiness.catalog !== 'boolean'
    || typeof readiness.osmRegion !== 'boolean'
    || readiness.ready !== (payload.status === 'ready')) {
    throw schemaError('Health readiness does not match the envelope status.');
  }
  assertRecord(data.sourceCapabilities, 'health.data.sourceCapabilities');
  assertRecord(data.limits, 'health.data.limits');
  return payload;
}

export function validateCatalogEnvelope(payload) {
  assertCommonEnvelope(payload, {
    schemaVersion: GEODATA_CATALOG_SCHEMA_VERSION,
    source: GEODATA_SOURCE,
    statuses: ['current'],
    staleAt: 'required'
  });
  if (Date.parse(payload.staleAt) < Date.parse(payload.fetchedAt)) {
    throw schemaError('Catalog staleAt precedes fetchedAt.');
  }
  const data = assertRecord(payload.data, 'catalog.data');
  if (!Array.isArray(data.sources)) throw schemaError('catalog.data.sources must be an array.');
  const sources = new Map();
  data.sources.forEach((source, index) => {
    const label = `catalog.data.sources[${index}]`;
    assertRecord(source, label);
    assertNonEmptyString(source.id, `${label}.id`);
    if (sources.has(source.id)) throw schemaError('Catalog contains a duplicate source id.');
    for (const field of ['title', 'agency', 'category', 'access', 'accessMode', 'cadence', 'coverage', 'license', 'licenseUrl', 'attribution', 'transportAuthority']) {
      assertNonEmptyString(source[field], `${label}.${field}`);
    }
    if (typeof source.configured !== 'boolean' || source.operationalUse !== false) {
      throw schemaError(`${label} has an invalid configured/operationalUse contract.`);
    }
    if (source.url !== null && typeof source.url !== 'string') {
      throw schemaError(`${label}.url must be a string or null.`);
    }
    sources.set(source.id, source);
  });
  for (const id of REQUIRED_CATALOG_SOURCE_IDS) {
    if (!sources.has(id)) throw schemaError(`Catalog omitted required source ${id}.`);
  }
  for (const id of ['osm-shortbread', 'osm-local-region']) {
    const source = sources.get(id);
    if (source.attribution !== OSM_ATTRIBUTION || source.licenseUrl !== ODBL_LICENSE_URL) {
      throw schemaError(`Catalog source ${id} omitted exact OpenStreetMap/ODbL attribution.`);
    }
  }
  return payload;
}

export function validateErrorEnvelope(payload) {
  assertCommonEnvelope(payload, {
    schemaVersion: GEODATA_ERROR_SCHEMA_VERSION,
    source: GEODATA_SOURCE,
    statuses: ['error'],
    staleAt: 'nullable'
  });
  if (payload.staleAt !== null || payload.data !== null) {
    throw schemaError('Error envelopes require null staleAt and data.');
  }
  const error = assertRecord(payload.error, 'error');
  if (typeof error.code !== 'string' || !/^[A-Z][A-Z0-9_]*$/u.test(error.code)) {
    throw schemaError('error.code must be a canonical public error code.');
  }
  assertNonEmptyString(error.message, 'error.message');
  if (typeof error.retryable !== 'boolean') throw schemaError('error.retryable must be boolean.');
  return payload;
}

export function validateOsmRegionEnvelope(payload) {
  assertCommonEnvelope(payload, {
    schemaVersion: OSM_REGION_SCHEMA_VERSION,
    source: OSM_SOURCE,
    statuses: ['current', 'stale'],
    staleAt: 'required'
  });
  if (Date.parse(payload.staleAt) < Date.parse(payload.fetchedAt)) {
    throw schemaError('Region staleAt precedes fetchedAt.');
  }

  const bbox = assertRecord(payload.bbox, 'bbox');
  if (bbox.order !== 'south,west,north,east') throw schemaError('bbox.order is unsupported.');
  assertTuple(bbox.values, 'bbox.values', 4, (entry, label) => assertFiniteNumber(entry, label));
  const [south, west, north, east] = bbox.values;
  if (south < -90 || north > 90 || west < -180 || east > 180 || south >= north || west >= east) {
    throw schemaError('bbox.values do not describe a bounded non-wrapping WGS84 region.');
  }
  assertTuple(bbox.geoJsonValues, 'bbox.geoJsonValues', 4, (entry, label) => assertFiniteNumber(entry, label));
  const expectedGeoJsonBbox = [west, south, east, north];
  if (!bbox.geoJsonValues.every((entry, index) => entry === expectedGeoJsonBbox[index])) {
    throw schemaError('bbox.geoJsonValues do not match bbox.values.');
  }
  assertFiniteNumber(bbox.outwardSnapDegrees, 'bbox.outwardSnapDegrees', { minimum: 0, exclusiveMinimum: true });
  const dimensions = assertRecord(bbox.dimensions, 'bbox.dimensions');
  for (const field of ['northSouthMeters', 'eastWestMeters', 'areaSquareMeters']) {
    assertFiniteNumber(dimensions[field], `bbox.dimensions.${field}`, { minimum: 0, exclusiveMinimum: true });
  }

  const cache = assertRecord(payload.cache, 'cache');
  if (typeof cache.key !== 'string' || !/^[a-f0-9]{64}$/u.test(cache.key)) {
    throw schemaError('cache.key must be a SHA-256 hex digest.');
  }
  const expectedCacheState = payload.status === 'stale' ? 'stale-on-error' : 'fresh';
  if (cache.state !== expectedCacheState) throw schemaError('Region status and cache state disagree.');
  assertInteger(cache.freshForSeconds, 'cache.freshForSeconds', { minimum: 1 });
  assertInteger(cache.staleIfErrorSeconds, 'cache.staleIfErrorSeconds', { minimum: 0 });

  const provenance = assertRecord(payload.provenance, 'provenance');
  if (provenance.source !== 'OpenStreetMap'
    || provenance.adapter !== 'Overpass API'
    || provenance.attribution !== OSM_ATTRIBUTION
    || provenance.licenseUrl !== ODBL_LICENSE_URL) {
    throw schemaError('Region omitted exact OpenStreetMap/ODbL provenance.');
  }
  for (const field of ['providerMode', 'license', 'attributionUrl', 'derivedDatabaseNotice', 'disclaimer']) {
    assertNonEmptyString(provenance[field], `provenance.${field}`);
  }
  assertHttpUrl(provenance.upstreamUrl, 'provenance.upstreamUrl');
  assertExactIsoDate(provenance.sourceBaseTimestamp, 'provenance.sourceBaseTimestamp', { nullable: true });

  const data = assertRecord(payload.data, 'data');
  if (data.type !== 'OsmRegion'
    || data.bboxOrder !== bbox.order
    || data.vehicle !== 'motorcycle'
    || data.sourceBaseTimestamp !== provenance.sourceBaseTimestamp) {
    throw schemaError('Geodata API omitted canonical OSM region data.');
  }
  assertTuple(data.bbox, 'data.bbox', 4, (entry, label) => assertFiniteNumber(entry, label));
  assertTuple(data.geoJsonBbox, 'data.geoJsonBbox', 4, (entry, label) => assertFiniteNumber(entry, label));
  if (!data.bbox.every((entry, index) => entry === bbox.values[index])
    || !data.geoJsonBbox.every((entry, index) => entry === bbox.geoJsonValues[index])) {
    throw schemaError('Region data bounds disagree with envelope bounds.');
  }
  const dataDimensions = assertRecord(data.dimensions, 'data.dimensions');
  for (const field of ['northSouthMeters', 'eastWestMeters', 'areaSquareMeters']) {
    if (dataDimensions[field] !== dimensions[field]) {
      throw schemaError('Region data dimensions disagree with envelope dimensions.');
    }
  }
  if (!Array.isArray(data.requestedLayers)
    || data.requestedLayers.length < 1
    || data.requestedLayers.some((layer) => !['roads', 'buildings'].includes(layer))
    || new Set(data.requestedLayers).size !== data.requestedLayers.length
    || data.requestedLayers.join(',') !== ['roads', 'buildings']
      .filter((layer) => data.requestedLayers.includes(layer))
      .join(',')) {
    throw schemaError('data.requestedLayers is invalid.');
  }
  assertStringArray(data.notes, 'data.notes');
  const counts = assertRecord(data.counts, 'data.counts');
  for (const key of [
    'roadWays',
    'buildings',
    'uniqueSourceNodes',
    'graphNodes',
    'directedGraphEdges',
    'restrictionRelations',
    'machineEvaluableRestrictions',
    'unresolvedRestrictions'
  ]) assertInteger(counts[key], `data.counts.${key}`);
  if (counts.uniqueSourceNodes < counts.graphNodes) {
    throw schemaError('Unique source-node count cannot be smaller than the road-graph node count.');
  }

  assertFeatureCollection(data.roads, 'data.roads', new Set(['LineString', 'MultiLineString']), bbox.geoJsonValues);
  assertFeatureCollection(data.buildings, 'data.buildings', new Set(['Polygon', 'MultiPolygon']), bbox.geoJsonValues);
  if (counts.roadWays !== data.roads.features.length || counts.buildings !== data.buildings.features.length) {
    throw schemaError('Feature counts do not match the serialized collections.');
  }
  assertRoadGraph(data.roadGraph, counts, data.roads.features.length);
  return payload;
}

export function normalizeGeodataBaseUrl(value, locationLike = globalThis.location) {
  if (value === null) return null;
  const normalized = value === undefined ? '' : String(value).trim();
  if (normalized === '' || normalized.toLowerCase() === 'same-origin') return '';
  let url;
  try {
    url = new URL(normalized, locationLike?.href ?? 'https://localhost/');
  } catch {
    throw new TypeError('Geodata API URL must be a valid HTTP(S) origin.');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new TypeError('Geodata API URL may not contain credentials, query, or fragment.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new TypeError('Geodata API URL must use HTTP(S).');
  if (url.pathname !== '/') throw new TypeError('Geodata API URL must be an origin without a path prefix.');
  if (locationLike?.protocol === 'https:' && url.protocol !== 'https:') {
    throw new TypeError('HTTPS pages require an HTTPS or same-origin geodata API.');
  }
  return url.origin;
}

function explicitBoolean(value, label) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === '') return false;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  throw new TypeError(`${label} must be an explicit boolean.`);
}

export function configuredGeodataBaseUrl(env = import.meta.env) {
  const explicit = String(env?.VITE_GEODATA_API_URL ?? '').trim();
  const sameOrigin = explicitBoolean(env?.VITE_GEODATA_SAME_ORIGIN, 'VITE_GEODATA_SAME_ORIGIN');
  if (explicit && sameOrigin && explicit.toLowerCase() !== 'same-origin') {
    throw new TypeError('Choose either VITE_GEODATA_API_URL or VITE_GEODATA_SAME_ORIGIN, not both.');
  }
  if (explicit) return explicit.toLowerCase() === 'same-origin' ? '' : explicit;
  if (sameOrigin || env?.DEV === true) return '';
  return null;
}

export function resolveEarthGeodataBaseUrl({
  env = import.meta.env,
  locationLike = globalThis.location
} = {}) {
  const query = new URLSearchParams(locationLike?.search ?? '');
  const override = query.get('geodata');
  if (override === 'same-origin') return '';
  if (override === 'off') return null;
  return configuredGeodataBaseUrl(env);
}

async function readJsonBounded(response, maximumBytes) {
  const contentType = response?.headers?.get?.('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw clientError(
      'ERR_GEODATA_CONTENT_TYPE',
      `Geodata API returned unsupported content type ${contentType || '(missing)'}.`
    );
  }
  const bytes = await readResponseBytesBounded(response, {
    maximumBytes,
    label: 'Geodata API response',
    tooLargeCode: 'ERR_GEODATA_RESPONSE_TOO_LARGE'
  });
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw clientError('ERR_GEODATA_INVALID_JSON', 'Geodata API returned invalid UTF-8 JSON.');
  }
  try {
    return JSON.parse(text);
  } catch {
    throw clientError('ERR_GEODATA_INVALID_JSON', 'Geodata API returned invalid JSON.');
  }
}

export class GeodataClient {
  constructor({
    baseUrl = '',
    fetchImpl = globalThis.fetch,
    maximumBytes = GEODATA_DEFAULT_MAX_RESPONSE_BYTES,
    locationLike = globalThis.location
  } = {}) {
    if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
    if (!Number.isInteger(maximumBytes) || maximumBytes < 1024 || maximumBytes > 16 * 1024 * 1024) {
      throw new RangeError('maximumBytes must be between 1 KiB and 16 MiB.');
    }
    this.locationLike = locationLike;
    this.baseUrl = normalizeGeodataBaseUrl(baseUrl, locationLike);
    this.fetchImpl = fetchImpl;
    this.maximumBytes = maximumBytes;
  }

  get configured() {
    return this.baseUrl !== null;
  }

  #url(path, searchParams) {
    if (this.baseUrl === null) throw new Error('Geodata API is not configured in this build.');
    const base = this.baseUrl || this.locationLike?.origin || 'http://127.0.0.1';
    const url = new URL(path, `${base}/`);
    if (searchParams) url.search = new URLSearchParams(searchParams).toString();
    return url.toString();
  }

  async #get(path, { searchParams, signal } = {}) {
    const response = await invokeFetch(this.fetchImpl, this.#url(path, searchParams), {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'omit',
      redirect: 'error',
      signal
    });
    const payload = await readJsonBounded(response, this.maximumBytes);
    if (!response.ok) {
      try {
        validateErrorEnvelope(payload);
      } catch (error) {
        error.status = response.status;
        throw error;
      }
      const error = new Error(payload.error.message);
      error.code = payload.error.code;
      error.status = response.status;
      error.retryable = payload.error.retryable;
      error.notes = [...payload.notes];
      throw error;
    }
    return payload;
  }

  async health(options) {
    return validateHealthEnvelope(await this.#get('/healthz', options));
  }

  async catalog(options) {
    return validateCatalogEnvelope(await this.#get('/api/v1/catalog', options));
  }

  async osmRegion({ bbox, layers = ['roads', 'buildings'], vehicle = 'motorcycle', signal } = {}) {
    if (!Array.isArray(bbox) || bbox.length !== 4 || bbox.some((value) => !Number.isFinite(value))) {
      throw new TypeError('OSM region requires a four-value finite bbox.');
    }
    if (!Array.isArray(layers)
      || layers.length < 1
      || layers.some((layer) => !['roads', 'buildings'].includes(layer))
      || new Set(layers).size !== layers.length) {
      throw new TypeError('OSM region layers must be a unique subset of roads and buildings.');
    }
    if (vehicle !== 'motorcycle') throw new TypeError('OSM region vehicle must be motorcycle.');
    const payload = await this.#get('/api/v1/geo/osm', {
      searchParams: {
        bbox: bbox.join(','),
        layers: layers.join(','),
        vehicle
      },
      signal
    });
    return validateOsmRegionEnvelope(payload);
  }
}
