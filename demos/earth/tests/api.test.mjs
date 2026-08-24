import assert from 'node:assert/strict';
import test from 'node:test';

import {
  configuredGeodataBaseUrl,
  GeodataClient,
  normalizeGeodataBaseUrl,
  resolveEarthGeodataBaseUrl,
  validateCatalogEnvelope,
  validateHealthEnvelope,
  validateOsmRegionEnvelope
} from '../src/api.js';

const FETCHED_AT = '2026-08-23T22:00:00.000Z';
const STALE_AT = '2026-08-24T04:00:00.000Z';
const BBOX = [61.2, -149.95, 61.23, -149.87];
const GEOJSON_BBOX = [-149.95, 61.2, -149.87, 61.23];

function jsonResponse(payload, { status = 200, headers = {} } = {}) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json; charset=utf-8', 'content-length': String(bytes.byteLength), ...headers }),
    arrayBuffer: async () => bytes.buffer
  };
}

function osmRegionEnvelope(overrides = {}) {
  return {
    schemaVersion: 'peercompute.geo.osm-region.v1',
    source: 'openstreetmap-overpass',
    status: 'current',
    synthetic: false,
    operationalUse: 'visualization and gameplay only; not for navigation, routing, or safety decisions',
    fetchedAt: FETCHED_AT,
    staleAt: STALE_AT,
    notes: [],
    bbox: {
      order: 'south,west,north,east',
      values: BBOX,
      geoJsonValues: GEOJSON_BBOX,
      outwardSnapDegrees: 0.001,
      dimensions: { northSouthMeters: 3335.852, eastWestMeters: 4261.331, areaSquareMeters: 14215899.1 }
    },
    cache: {
      key: 'a'.repeat(64),
      state: 'fresh',
      freshForSeconds: 21_600,
      staleIfErrorSeconds: 604_800
    },
    provenance: {
      source: 'OpenStreetMap',
      adapter: 'Overpass API',
      providerMode: 'configured',
      upstreamUrl: 'https://overpass.example/interpreter',
      sourceBaseTimestamp: FETCHED_AT,
      license: 'Open Data Commons Open Database License 1.0',
      attribution: '© OpenStreetMap contributors',
      attributionUrl: 'https://www.openstreetmap.org/copyright',
      licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/',
      derivedDatabaseNotice: 'This response is a derived database produced from OpenStreetMap data.',
      disclaimer: 'Non-navigation-grade road/building data.'
    },
    data: {
      type: 'OsmRegion',
      bbox: BBOX,
      bboxOrder: 'south,west,north,east',
      geoJsonBbox: GEOJSON_BBOX,
      dimensions: { northSouthMeters: 3335.852, eastWestMeters: 4261.331, areaSquareMeters: 14215899.1 },
      requestedLayers: ['roads', 'buildings'],
      vehicle: 'motorcycle',
      sourceBaseTimestamp: FETCHED_AT,
      roads: { type: 'FeatureCollection', bbox: GEOJSON_BBOX, features: [] },
      buildings: { type: 'FeatureCollection', bbox: GEOJSON_BBOX, features: [] },
      roadGraph: {
        schemaVersion: 'peercompute.geo.road-graph.v1',
        vehicle: 'motorcycle',
        navigationGrade: false,
        connectivity: 'shared-osm-node-identifiers-only',
        sourceWayCount: 0,
        eligibleWayCount: 0,
        excludedWayCount: 0,
        nodes: [],
        edges: [],
        restrictions: [],
        restrictionCoverage: {
          sourceRelationCount: 0,
          machineEvaluableCount: 0,
          unresolvedCount: 0,
          conditionalEvaluated: false,
          navigationGrade: false
        }
      },
      counts: {
        roadWays: 0,
        buildings: 0,
        uniqueSourceNodes: 0,
        graphNodes: 0,
        directedGraphEdges: 0,
        restrictionRelations: 0,
        machineEvaluableRestrictions: 0,
        unresolvedRestrictions: 0
      },
      notes: []
    },
    ...overrides
  };
}

function commonMetadata({ schemaVersion, status, staleAt }) {
  return {
    schemaVersion,
    source: 'peercompute-geodata',
    status,
    synthetic: false,
    operationalUse: 'metadata only',
    fetchedAt: FETCHED_AT,
    staleAt,
    notes: []
  };
}

function healthEnvelope() {
  return {
    ...commonMetadata({ schemaVersion: 'peercompute.geodata.health.v1', status: 'ready', staleAt: null }),
    data: {
      readiness: { ready: true, catalog: true, osmRegion: true },
      sourceCapabilities: {},
      limits: {}
    }
  };
}

function catalogEnvelope() {
  const ids = [
    'noaa-etopo2022',
    'aws-terrarium',
    'osm-shortbread',
    'osm-local-region',
    'noaa-nowcoast-radar',
    'noaa-nowcoast-satellite'
  ];
  return {
    ...commonMetadata({ schemaVersion: 'peercompute.geodata.catalog.v1', status: 'current', staleAt: STALE_AT }),
    data: {
      sources: ids.map((id) => ({
        id,
        title: id,
        agency: 'source agency',
        category: 'source category',
        url: id === 'osm-local-region' ? '/api/v1/geo/osm' : `https://sources.example/${id}`,
        access: 'public-no-key',
        accessMode: 'browser-direct',
        cadence: 'source cadence',
        coverage: 'source coverage',
        license: id.startsWith('osm-') ? 'ODbL 1.0' : 'source license',
        licenseUrl: id.startsWith('osm-')
          ? 'https://opendatacommons.org/licenses/odbl/1-0/'
          : 'https://sources.example/license',
        attribution: id.startsWith('osm-') ? '© OpenStreetMap contributors' : 'source attribution',
        configured: true,
        transportAuthority: 'browser',
        operationalUse: false
      }))
    }
  };
}

function errorEnvelope(code = 'REGION_RESULT_LIMIT_EXCEEDED') {
  return {
    ...commonMetadata({ schemaVersion: 'peercompute.geodata.error.v1', status: 'error', staleAt: null }),
    data: null,
    error: { code, message: 'Use a smaller region.', retryable: false }
  };
}

test('builds bounded OSM region requests without credentials', async () => {
  const requests = [];
  const client = new GeodataClient({
    baseUrl: 'https://geo.example',
    locationLike: new URL('https://earth.example/app/'),
    fetchImpl: async (url, options) => {
      requests.push({ url: new URL(url), options });
      return jsonResponse(osmRegionEnvelope());
    }
  });
  const result = await client.osmRegion({ bbox: BBOX });
  assert.equal(result.status, 'current');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url.pathname, '/api/v1/geo/osm');
  assert.equal(requests[0].url.searchParams.get('bbox'), '61.2,-149.95,61.23,-149.87');
  assert.equal(requests[0].url.searchParams.get('layers'), 'roads,buildings');
  assert.equal(requests[0].url.searchParams.get('vehicle'), 'motorcycle');
  assert.equal(requests[0].options.credentials, 'omit');
  assert.equal(requests[0].options.redirect, 'error');
});

test('rejects unconfigured, credential-bearing, malformed, and oversized responses', async () => {
  const unconfigured = new GeodataClient({ baseUrl: null, fetchImpl: async () => jsonResponse({}) });
  assert.equal(unconfigured.configured, false);
  await assert.rejects(() => unconfigured.catalog(), /not configured/);
  assert.throws(() => new GeodataClient({ baseUrl: 'https://user:pass@geo.example' }), /credentials/);
  assert.throws(() => new GeodataClient({ baseUrl: 'https://geo.example/base' }), /path prefix/);
  const wrongContent = new GeodataClient({
    baseUrl: 'https://geo.example',
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/html' }),
      arrayBuffer: async () => new ArrayBuffer(0)
    })
  });
  await assert.rejects(() => wrongContent.catalog(), /content type/);
  const oversized = new GeodataClient({
    baseUrl: 'https://geo.example',
    maximumBytes: 1024,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json', 'content-length': '2048' }),
      arrayBuffer: async () => new ArrayBuffer(0)
    })
  });
  await assert.rejects(() => oversized.catalog(), /byte cap/);
});

test('surfaces safe API error code and status', async () => {
  const client = new GeodataClient({
    baseUrl: 'https://geo.example',
    fetchImpl: async () => jsonResponse({
      ...errorEnvelope('REGION_RESULT_LIMIT_EXCEEDED'),
      notes: ['The requested density exceeded the bounded adapter.']
    }, { status: 422 })
  });
  await assert.rejects(
    () => client.osmRegion({ bbox: [0, 0, 1, 1] }),
    (error) => error.code === 'REGION_RESULT_LIMIT_EXCEEDED'
      && error.status === 422
      && error.retryable === false
      && error.notes[0] === 'The requested density exceeded the bounded adapter.'
  );
});

test('binds the browser fetch receiver instead of detaching Window.fetch', async () => {
  let receiver = null;
  function receiverAwareFetch() {
    receiver = this;
    return jsonResponse(healthEnvelope());
  }
  const client = new GeodataClient({ baseUrl: 'https://geo.example', fetchImpl: receiverAwareFetch });
  await client.health();
  assert.equal(receiver, globalThis);
});

test('rejects malformed, count-incoherent, and provenance-incoherent OSM envelopes', async () => {
  const malformed = new GeodataClient({
    baseUrl: 'https://geo.example',
    fetchImpl: async () => jsonResponse({ schemaVersion: '1.0', status: 'live', data: {} })
  });
  await assert.rejects(() => malformed.osmRegion({ bbox: [0, 0, 0.01, 0.01] }), (error) => (
    error.code === 'ERR_GEODATA_SCHEMA'
  ));

  const incoherent = new GeodataClient({
    baseUrl: 'https://geo.example',
    fetchImpl: async () => jsonResponse(osmRegionEnvelope({
      data: {
        ...osmRegionEnvelope().data,
        counts: { ...osmRegionEnvelope().data.counts, roadWays: 1 }
      }
    }))
  });
  await assert.rejects(() => incoherent.osmRegion({ bbox: [0, 0, 0.01, 0.01] }), (error) => (
    error.code === 'ERR_GEODATA_SCHEMA'
  ));

  assert.throws(() => validateOsmRegionEnvelope(osmRegionEnvelope({
    status: 'stale',
    cache: { ...osmRegionEnvelope().cache, state: 'fresh' }
  })), (error) => error.code === 'ERR_GEODATA_SCHEMA');

  assert.throws(() => validateOsmRegionEnvelope(osmRegionEnvelope({
    provenance: { ...osmRegionEnvelope().provenance, attribution: 'anonymous map data' }
  })), (error) => error.code === 'ERR_GEODATA_SCHEMA');
});

test('validates exact health and catalog discriminators plus required source attribution', () => {
  assert.equal(validateHealthEnvelope(healthEnvelope()).status, 'ready');
  assert.equal(validateCatalogEnvelope(catalogEnvelope()).data.sources.length, 6);
  assert.throws(() => validateHealthEnvelope({ ...healthEnvelope(), source: 'other-service' }), (error) => (
    error.code === 'ERR_GEODATA_SCHEMA'
  ));
  const missingOsmAttribution = catalogEnvelope();
  missingOsmAttribution.data.sources.find((source) => source.id === 'osm-local-region').attribution = 'missing';
  assert.throws(() => validateCatalogEnvelope(missingOsmAttribution), (error) => (
    error.code === 'ERR_GEODATA_SCHEMA'
  ));
});

test('supports explicit production same-origin mode without accepting unsafe base URLs', async () => {
  const locationLike = new URL('https://earth.example/demos/earth/?view=local');
  assert.equal(configuredGeodataBaseUrl({ DEV: false }), null);
  assert.equal(configuredGeodataBaseUrl({ DEV: false, VITE_GEODATA_SAME_ORIGIN: 'true' }), '');
  assert.equal(configuredGeodataBaseUrl({ DEV: false, VITE_GEODATA_API_URL: 'same-origin' }), '');
  assert.equal(configuredGeodataBaseUrl({ DEV: false, VITE_GEODATA_API_URL: 'https://geo.example' }), 'https://geo.example');
  assert.throws(() => configuredGeodataBaseUrl({
    DEV: false,
    VITE_GEODATA_SAME_ORIGIN: 'true',
    VITE_GEODATA_API_URL: 'https://geo.example'
  }), /either/u);
  assert.equal(resolveEarthGeodataBaseUrl({
    env: { DEV: false },
    locationLike: new URL('https://earth.example/demos/earth/?geodata=same-origin')
  }), '');
  assert.equal(resolveEarthGeodataBaseUrl({
    env: { DEV: true },
    locationLike: new URL('https://earth.example/demos/earth/?geodata=off')
  }), null);
  assert.equal(normalizeGeodataBaseUrl('https://geo.example/', locationLike), 'https://geo.example');
  assert.throws(() => normalizeGeodataBaseUrl('http://geo.example', locationLike), /HTTPS/u);
  assert.throws(() => normalizeGeodataBaseUrl('https://geo.example/api', locationLike), /path prefix/u);

  let requestedUrl;
  const client = new GeodataClient({
    baseUrl: '',
    locationLike,
    fetchImpl: async (url) => {
      requestedUrl = url;
      return jsonResponse(healthEnvelope());
    }
  });
  await client.health();
  assert.equal(requestedUrl, 'https://earth.example/healthz');
});
