import { GeodataError, isAbortError } from '../errors.js';
import { fetchBoundedJson } from '../lib/fetch-json.js';
import { BoundedSemaphore } from '../lib/semaphore.js';
import { buildOverpassQuery, encodeOverpassQuery, OVERPASS_OUTPUT_LIMIT } from '../osm/query.js';

export const MAXIMUM_OVERPASS_ATTEMPTS = 2;
export const MAXIMUM_OVERPASS_RETRY_BACKOFF_MS = 1_000;

function abortReason(signal) {
  if (signal?.reason instanceof Error) return signal.reason;
  return new DOMException('The operation was aborted.', 'AbortError');
}

function joinSignals(signals) {
  const active = signals.filter(Boolean);
  if (active.length === 0) return undefined;
  if (active.length === 1) return active[0];
  return AbortSignal.any(active);
}

export function waitForRetryBackoff(delayMs, signal) {
  if (!Number.isSafeInteger(delayMs) || delayMs < 0 || delayMs > MAXIMUM_OVERPASS_RETRY_BACKOFF_MS) {
    throw new RangeError(
      `Overpass retry backoff must be between zero and ${MAXIMUM_OVERPASS_RETRY_BACKOFF_MS} milliseconds.`
    );
  }
  if (signal?.aborted) return Promise.reject(abortReason(signal));
  if (delayMs === 0) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortReason(signal));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export function shouldRetryOverpassError(error) {
  if (!(error instanceof GeodataError) || error.retryable !== true) return false;
  return error.code === 'UPSTREAM_FETCH_FAILED'
    || error.code === 'UPSTREAM_TIMEOUT'
    || error.code === 'UPSTREAM_HTTP_ERROR';
}

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

export function createOverpassProvider({
  config,
  fetchImpl = globalThis.fetch,
  semaphore,
  waitForRetry = waitForRetryBackoff
} = {}) {
  const limits = config.limits;
  if (!Number.isSafeInteger(limits.overpassRetryBackoffMs)
    || limits.overpassRetryBackoffMs < 0
    || limits.overpassRetryBackoffMs > MAXIMUM_OVERPASS_RETRY_BACKOFF_MS) {
    throw new RangeError(
      `Overpass retry backoff must be between zero and ${MAXIMUM_OVERPASS_RETRY_BACKOFF_MS} milliseconds.`
    );
  }
  if (typeof waitForRetry !== 'function') throw new TypeError('Overpass retry waiter must be a function.');
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

    async fetchRegion({ bbox, layers, signal } = {}) {
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
      const deadlineSignal = AbortSignal.timeout(limits.overpassCallTimeoutMs);
      const wholeCallSignal = joinSignals([signal, deadlineSignal]);

      try {
        return await callSemaphore.run(async () => {
          for (let attempt = 1; attempt <= MAXIMUM_OVERPASS_ATTEMPTS; attempt += 1) {
            if (wholeCallSignal.aborted) throw abortReason(wholeCallSignal);
            try {
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
              if (wholeCallSignal.aborted) throw abortReason(wholeCallSignal);
              return validateOverpassPayload(payload);
            } catch (error) {
              if (signal?.aborted) throw abortReason(signal);
              if (deadlineSignal.aborted) throw abortReason(deadlineSignal);
              if (attempt >= MAXIMUM_OVERPASS_ATTEMPTS || !shouldRetryOverpassError(error)) throw error;
              await waitForRetry(limits.overpassRetryBackoffMs, wholeCallSignal);
            }
          }
          throw new Error('Unreachable Overpass retry state.');
        }, wholeCallSignal);
      } catch (error) {
        if (signal?.aborted) throw abortReason(signal);
        if (error instanceof GeodataError) throw error;
        if (isAbortError(error) || deadlineSignal.aborted) {
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
