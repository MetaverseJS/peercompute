import { GeodataError, isAbortError } from '../errors.js';
import { fetchBoundedJson } from '../lib/fetch-json.js';
import { BoundedSemaphore } from '../lib/semaphore.js';
import { buildOverpassQuery, encodeOverpassQuery, OVERPASS_OUTPUT_LIMIT } from '../osm/query.js';

function validateOverpassPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !Array.isArray(payload.elements)) {
    throw new GeodataError('UPSTREAM_SCHEMA_INVALID', 'The configured OSM source returned an invalid Overpass document.', {
      statusCode: 502,
      retryable: false
    });
  }
  if (payload.elements.length >= OVERPASS_OUTPUT_LIMIT) {
    throw new GeodataError(
      'UPSTREAM_RESULT_LIMIT_EXCEEDED',
      'The OSM source reached its hard element bound; request a smaller region.',
      { statusCode: 422, retryable: false }
    );
  }
  return payload;
}

export function createOverpassProvider({ config, fetchImpl = globalThis.fetch, semaphore } = {}) {
  const limits = config.limits;
  const callSemaphore = semaphore ?? new BoundedSemaphore({
    concurrency: limits.maxConcurrentOverpassCalls,
    maxQueue: limits.maxQueuedOverpassCalls
  });

  return Object.freeze({
    configured: config.overpass.configured,
    mode: config.overpass.mode,
    endpoint: config.overpass.url,

    get stats() {
      return Object.freeze({ active: callSemaphore.active, queued: callSemaphore.queued });
    },

    async fetchRegion({ bbox, layers }) {
      if (!config.overpass.configured || !config.overpass.url) {
        throw new GeodataError(
          'OVERPASS_NOT_CONFIGURED',
          'The local OSM region adapter is not configured on this server.',
          {
            statusCode: 503,
            retryable: false,
            notes: [
              'Set GEODATA_OVERPASS_URL to a controlled endpoint, or explicitly allow the public demo fallback.'
            ]
          }
        );
      }

      const query = buildOverpassQuery({
        bbox,
        layers,
        timeoutSeconds: limits.overpassQueryTimeoutSeconds
      });
      const body = encodeOverpassQuery(query);
      const wholeCallSignal = AbortSignal.timeout(limits.overpassCallTimeoutMs);

      try {
        return await callSemaphore.run(async () => {
          const payload = await fetchBoundedJson({
            fetchImpl,
            url: config.overpass.url,
            method: 'POST',
            headers: {
              accept: 'application/json',
              'accept-encoding': 'gzip, br',
              'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
              'user-agent': config.userAgent
            },
            body,
            signal: wholeCallSignal,
            timeoutMs: limits.overpassCallTimeoutMs,
            maxRequestBytes: limits.overpassMaxRequestBytes,
            maxResponseBytes: limits.overpassMaxResponseBytes,
            allowedContentTypes: ['application/json']
          });
          return validateOverpassPayload(payload);
        }, wholeCallSignal);
      } catch (error) {
        if (error instanceof GeodataError) throw error;
        if (isAbortError(error) || wholeCallSignal.aborted) {
          throw new GeodataError('UPSTREAM_TIMEOUT', 'The configured OSM source did not respond within 25 seconds.', {
            statusCode: 504,
            retryable: true,
            cause: error
          });
        }
        throw error;
      }
    }
  });
}
