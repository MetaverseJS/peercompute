import { createHash } from 'node:crypto';
import { createCatalogEnvelope, SOURCE_LICENSES } from './catalog.js';
import { GeodataError } from './errors.js';
import { CoalescingTtlLruCache } from './lib/cache.js';
import { raceWithSignal } from './lib/semaphore.js';
import { normalizeOverpassRegion } from './osm/normalize.js';
import { createOverpassProvider } from './providers/overpass.js';

export const SERVICE_VERSION = '0.1.0';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function createRegionCacheKey(query) {
  const canonical = JSON.stringify({
    bbox: query.bbox.values,
    layers: query.layers,
    vehicle: query.vehicle
  });
  return sha256(canonical);
}

function staleAtFor(fetchedAt, freshTtlMs) {
  return new Date(Date.parse(fetchedAt) + freshTtlMs).toISOString();
}

export function serializeBoundedOsmRegionEnvelope(envelope, maxBytes) {
  const serialized = JSON.stringify(envelope);
  const byteLength = Buffer.byteLength(serialized, 'utf8');
  if (byteLength > maxBytes) {
    throw new GeodataError(
      'REGION_RESPONSE_LIMIT_EXCEEDED',
      'The normalized region is too dense; request a smaller region.',
      { statusCode: 422, retryable: false }
    );
  }
  return Object.freeze({ serialized, byteLength });
}

function createOsmRegionEnvelope({ cacheKey, config, provider, query, value, stale }) {
  const notes = [
    ...value.region.notes,
    'The road graph is derived from OSM and is not suitable for navigation.',
    'Coordinate crossings are not junctions unless ways share an OSM node identifier.'
  ];
  if (stale) {
    notes.push('A previously verified cached region was served after an upstream refresh failure.');
  }

  return {
    schemaVersion: 'peercompute.geo.osm-region.v1',
    source: 'openstreetmap-overpass',
    status: stale ? 'stale' : 'current',
    synthetic: false,
    operationalUse: 'visualization and gameplay only; not for navigation, routing, or safety decisions',
    fetchedAt: value.fetchedAt,
    staleAt: staleAtFor(value.fetchedAt, config.limits.cacheFreshTtlMs),
    notes,
    bbox: {
      order: query.bbox.requestOrder,
      values: query.bbox.values,
      geoJsonValues: query.bbox.geoJsonValues,
      outwardSnapDegrees: config.limits.bboxSnapDegrees,
      dimensions: query.bbox.dimensions
    },
    cache: {
      key: cacheKey,
      state: stale ? 'stale-on-error' : 'fresh',
      freshForSeconds: config.limits.cacheFreshTtlMs / 1_000,
      staleIfErrorSeconds: config.limits.cacheStaleIfErrorMs / 1_000
    },
    provenance: {
      source: 'OpenStreetMap',
      adapter: 'Overpass API',
      providerMode: provider.mode,
      upstreamUrl: provider.endpoint,
      sourceBaseTimestamp: value.region.sourceBaseTimestamp,
      ...SOURCE_LICENSES.osm,
      derivedDatabaseNotice: 'This response is a derived database produced from OpenStreetMap data.',
      disclaimer: 'Non-navigation-grade road/building data; verify source tags and local conditions independently.'
    },
    data: value.region
  };
}

export function createGeodataService({
  config,
  fetchImpl = globalThis.fetch,
  clock = Date.now,
  cache,
  overpassProvider,
  processInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    uptime: () => process.uptime()
  }
}) {
  const regionCache = cache ?? new CoalescingTtlLruCache({
    maxEntries: config.limits.cacheMaxEntries,
    freshTtlMs: config.limits.cacheFreshTtlMs,
    staleIfErrorMs: config.limits.cacheStaleIfErrorMs,
    clock
  });
  const provider = overpassProvider ?? createOverpassProvider({ config, fetchImpl });

  return Object.freeze({
    cache: regionCache,
    provider,

    getHealthEnvelope() {
      const now = clock();
      const ready = provider.configured;
      return {
        schemaVersion: 'peercompute.geodata.health.v1',
        source: 'peercompute-geodata',
        status: ready ? 'ready' : 'degraded',
        synthetic: false,
        operationalUse: 'service readiness only; not for navigation or safety decisions',
        fetchedAt: new Date(now).toISOString(),
        staleAt: null,
        notes: ready
          ? []
          : ['The OSM region adapter is disabled until a controlled endpoint or explicit public fallback is configured.'],
        data: {
          service: {
            name: '@peercompute/geodata-service',
            version: SERVICE_VERSION,
            environment: config.environment,
            nodeVersion: processInfo.nodeVersion,
            platform: processInfo.platform,
            architecture: processInfo.architecture,
            uptimeSeconds: Number(processInfo.uptime().toFixed(3))
          },
          readiness: {
            ready,
            catalog: true,
            osmRegion: ready
          },
          sourceCapabilities: {
            terrainCatalog: true,
            globalOsmVectorCatalog: true,
            localOsmAdapter: {
              configured: provider.configured,
              mode: provider.mode
            },
            weatherCatalog: true
          },
          cache: regionCache.stats,
          upstream: provider.stats,
          limits: {
            bboxMaxAxisMeters: config.limits.bboxMaxAxisMeters,
            bboxMaxAreaSquareMeters: config.limits.bboxMaxAreaSquareMeters,
            maxConcurrentOverpassCalls: config.limits.maxConcurrentOverpassCalls,
            maxResponseBytes: config.limits.overpassMaxResponseBytes,
            maxNormalizedResponseBytes: config.limits.normalizedResponseMaxBytes
          }
        }
      };
    },

    getCatalogEnvelope() {
      return createCatalogEnvelope({ config, now: clock() });
    },

    async getOsmRegionEnvelope(query, { signal } = {}) {
      const cacheKey = createRegionCacheKey(query);
      const sharedResult = regionCache.getOrLoad(cacheKey, async () => {
        const payload = await provider.fetchRegion({ bbox: query.bbox, layers: query.layers });
        const region = normalizeOverpassRegion(payload, {
          bbox: query.bbox,
          layers: query.layers,
          vehicle: query.vehicle,
          limits: config.limits
        });
        const value = Object.freeze({
          fetchedAt: new Date(clock()).toISOString(),
          region
        });
        // Reject the complete public envelope inside the cache loader. This
        // prevents an oversized normalized result from becoming a verified
        // stale-cache candidate even though no complete response was served.
        serializeBoundedOsmRegionEnvelope(createOsmRegionEnvelope({
          cacheKey,
          config,
          provider,
          query,
          value,
          stale: false
        }), config.limits.normalizedResponseMaxBytes);
        return value;
      });
      const result = await raceWithSignal(sharedResult, signal);
      const stale = !result.fresh;
      const envelope = createOsmRegionEnvelope({
        cacheKey,
        config,
        provider,
        query,
        value: result.value,
        stale
      });
      const serialization = serializeBoundedOsmRegionEnvelope(
        envelope,
        config.limits.normalizedResponseMaxBytes
      );

      return {
        envelope,
        serialized: serialization.serialized,
        serializedBytes: serialization.byteLength,
        cacheStatus: result.cacheStatus
      };
    }
  });
}
