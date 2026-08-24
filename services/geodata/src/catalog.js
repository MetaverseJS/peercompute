import {
  GEO_SOURCE_CATALOG,
  NOWCOAST_LAYERS,
  nowCoastCapabilitiesUrl
} from '@peercompute/geo-core';

const SOURCE_LICENSES = Object.freeze({
  osm: Object.freeze({
    license: 'Open Data Commons Open Database License 1.0',
    licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/',
    attribution: '© OpenStreetMap contributors',
    attributionUrl: 'https://www.openstreetmap.org/copyright'
  })
});

const canonicalSources = new Map(GEO_SOURCE_CATALOG.map((source) => [source.id, source]));

function canonical(id, overrides) {
  const source = canonicalSources.get(id);
  if (!source) throw new Error(`Unknown canonical geodata source ${id}.`);
  return {
    id,
    title: source.name,
    agency: source.agency,
    access: source.access,
    cadence: source.cadence,
    coverage: source.coverage,
    license: source.license,
    operationalUse: source.operationalUse,
    documentationUrl: source.documentationUrl ?? source.sourceUrl,
    ...overrides
  };
}

export function createCatalogLayers() {
  const identifiers = new Set();
  return NOWCOAST_LAYERS.map((layer) => {
    if (identifiers.has(layer.id)) throw new Error(`Duplicate canonical geodata layer ${layer.id}.`);
    if (!canonicalSources.has(layer.sourceId)) {
      throw new Error(`Unknown canonical source ${layer.sourceId} for geodata layer ${layer.id}.`);
    }
    identifiers.add(layer.id);
    return {
      id: layer.id,
      sourceId: layer.sourceId,
      title: layer.title,
      category: 'weather',
      kind: layer.kind,
      url: nowCoastCapabilitiesUrl(layer),
      layerName: layer.layer,
      cadenceMinutes: layer.cadenceMinutes,
      historyMinutes: layer.historyMinutes,
      accessMode: 'browser-direct-optional',
      configured: true
    };
  });
}

function weatherSource(sourceId, layers, overrides) {
  const sourceLayers = layers.filter((layer) => layer.sourceId === sourceId);
  if (sourceLayers.length === 0) {
    throw new Error(`Canonical weather source ${sourceId} has no discoverable layers.`);
  }
  const capabilityUrls = new Set(sourceLayers.map((layer) => layer.url));
  if (capabilityUrls.size !== 1) {
    throw new Error(`Canonical weather source ${sourceId} spans incompatible capabilities endpoints.`);
  }
  return {
    category: 'weather',
    url: sourceLayers[0].url,
    accessMode: 'browser-direct-optional',
    layerIds: sourceLayers.map((layer) => layer.id),
    configured: true,
    transportAuthority: 'browser',
    disclaimer: 'Website and imagery are not certified for navigation; expired frames must not be represented as current.',
    ...overrides
  };
}

function sourceOverrides(id, config, layers) {
  switch (id) {
    case 'noaa-etopo2022':
      return {
        category: 'terrain',
        url: 'https://gis.ngdc.noaa.gov/arcgis/rest/services/DEM_mosaics/DEM_all/ImageServer/exportImage',
        accessMode: 'browser-direct',
        licenseUrl: 'https://www.ncei.noaa.gov/products/etopo-global-relief-model',
        attribution: 'NOAA/NCEI ETOPO 2022 Global Relief',
        configured: true,
        transportAuthority: 'browser'
      };
    case 'aws-terrarium':
      return {
        category: 'terrain',
        url: 'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png',
        accessMode: 'browser-direct-optional',
        licenseUrl: 'https://registry.opendata.aws/terrain-tiles/',
        attribution: 'Mapzen terrain tiles and named upstream elevation sources',
        configured: true,
        transportAuthority: 'browser'
      };
    case 'osm-shortbread':
      return {
        category: 'global-vector-context',
        url: 'https://vector.openstreetmap.org/shortbread_v1/tilejson.json',
        accessMode: 'browser-direct',
        ...SOURCE_LICENSES.osm,
        configured: true,
        transportAuthority: 'browser'
      };
    case 'osm-local-region':
      return {
        category: 'local-vector-region',
        url: '/api/v1/geo/osm',
        upstreamUrl: config.overpass.url,
        accessMode: 'server-adapter',
        ...SOURCE_LICENSES.osm,
        configured: config.overpass.configured,
        providerMode: config.overpass.mode,
        transportAuthority: 'peercompute-geodata-server',
        derivedDatabaseNotice: 'This response is a derived database produced from OpenStreetMap data.',
        disclaimer: 'The road graph is non-navigation-grade and connects ways only through shared OSM node identifiers.'
      };
    case 'noaa-nowcoast-radar':
      return weatherSource(id, layers, {
        license: 'NOAA/NWS source terms and individual layer metadata apply',
        licenseUrl: 'https://nowcoast.noaa.gov/',
        attribution: 'NOAA nowCOAST / contributing NOAA data providers'
      });
    case 'noaa-nowcoast-satellite':
      return weatherSource(id, layers, {
        license: 'NOAA/NESDIS source terms and individual layer metadata apply',
        licenseUrl: 'https://nowcoast.noaa.gov/',
        attribution: 'NOAA nowCOAST / NESDIS'
      });
    default:
      throw new Error(`Canonical geodata source ${id} has no service catalog adapter.`);
  }
}

export function createCatalogSources(config, layers = createCatalogLayers()) {
  return GEO_SOURCE_CATALOG.map((source) => canonical(
    source.id,
    sourceOverrides(source.id, config, layers)
  ));
}

export function createCatalogEnvelope({ config, now }) {
  const fetchedAt = new Date(now).toISOString();
  const staleAt = new Date(now + config.limits.catalogMaxAgeSeconds * 1_000).toISOString();
  const layers = createCatalogLayers();
  return {
    schemaVersion: 'peercompute.geodata.catalog.v1',
    source: 'peercompute-geodata',
    status: 'current',
    synthetic: false,
    operationalUse: 'source discovery and visualization only; not for navigation or safety decisions',
    fetchedAt,
    staleAt,
    notes: [
      'Weather imagery is optional and time-qualified by the browser from live capabilities metadata.',
      'The public Overpass main instance, when explicitly enabled, is a low-volume developer fallback without a production SLA.'
    ],
    data: {
      sources: createCatalogSources(config, layers),
      layers
    }
  };
}

export { SOURCE_LICENSES };
