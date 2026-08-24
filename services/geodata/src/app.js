import { createHash } from 'node:crypto';
import Fastify, { LogController } from 'fastify';
import fastifyCompress from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { loadConfig } from './config.js';
import { asPublicError, createErrorEnvelope, GeodataError } from './errors.js';
import { parseOsmRegionQuery } from './osm/bbox.js';
import { createGeodataService } from './service.js';

const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
const SECURITY_HEADERS = Object.freeze({
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
  'cross-origin-resource-policy': 'cross-origin',
  'permissions-policy': 'geolocation=(self), xr-spatial-tracking=(self), camera=(), microphone=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY'
});

function mergeVary(...values) {
  const fields = new Set();
  for (const value of values) {
    for (const field of String(value ?? '').split(',')) {
      const trimmed = field.trim();
      if (trimmed) fields.add(trimmed);
    }
  }
  return [...fields].sort((left, right) => left.localeCompare(right)).join(', ');
}

function strongEtag(serialized) {
  const digest = createHash('sha256').update(serialized).digest('base64url');
  return `"sha256-${digest}"`;
}

function requestAcceptsEtag(header, etag) {
  if (typeof header !== 'string') return false;
  return header.split(',').map((value) => value.trim()).some((value) => (
    value === '*' || value === etag || value === `W/${etag}`
  ));
}

function createRequestAbort(request) {
  const controller = new AbortController();
  const onAborted = () => controller.abort(new DOMException('Client disconnected.', 'AbortError'));
  request.raw.once('aborted', onAborted);
  return {
    signal: controller.signal,
    cleanup: () => request.raw.removeListener('aborted', onAborted)
  };
}

export async function buildGeodataApp(options = {}) {
  const config = options.config ?? loadConfig(options.environment);
  const clock = options.clock ?? Date.now;
  const app = Fastify({
    logger: options.logger ?? false,
    logController: new LogController({ disableRequestLogging: true }),
    bodyLimit: config.limits.overpassMaxRequestBytes,
    requestTimeout: config.limits.overpassCallTimeoutMs + 5_000,
    connectionTimeout: config.limits.overpassCallTimeoutMs + 5_000,
    trustProxy: false
  });
  const service = options.service ?? createGeodataService({
    config,
    fetchImpl: options.fetchImpl,
    clock,
    cache: options.cache,
    overpassProvider: options.overpassProvider,
    processInfo: options.processInfo
  });
  app.decorate('geodataService', service);

  const allowedOrigins = new Set(config.corsOrigins);
  await app.register(fastifyCors, {
    origin(origin, callback) {
      callback(null, Boolean(origin && allowedOrigins.has(origin)));
    },
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Content-Type', 'If-None-Match'],
    exposedHeaders: ['ETag', 'X-Geodata-Cache', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials: false,
    maxAge: 600,
    strictPreflight: true,
    optionsSuccessStatus: 204
  });
  await app.register(fastifyCompress, {
    global: true,
    threshold: 1_024,
    encodings: ['br', 'gzip', 'deflate']
  });
  await app.register(fastifyRateLimit, {
    global: false,
    hook: 'onRequest',
    max: config.limits.metadataRateLimitMax,
    timeWindow: config.limits.rateLimitWindow,
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: (_request, context) => new GeodataError(
      'RATE_LIMITED',
      'The geodata request rate limit was exceeded; retry after the advertised delay.',
      { statusCode: context.statusCode, retryable: true }
    )
  });

  app.addHook('onSend', async (_request, reply, payload) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) reply.header(name, value);
    reply.header('vary', mergeVary(reply.getHeader('vary'), 'Origin'));
    return payload;
  });

  app.setNotFoundHandler((request, reply) => {
    reply
      .code(404)
      .type(JSON_CONTENT_TYPE)
      .header('cache-control', 'no-store')
      .send(createErrorEnvelope(new GeodataError(
        'ROUTE_NOT_FOUND',
        `No geodata route exists for ${request.method}.`,
        { statusCode: 404 }
      ), clock()));
  });

  app.setErrorHandler((error, _request, reply) => {
    const statusCode = Number(error?.statusCode);
    const publicError = error instanceof GeodataError
      ? error
      : statusCode >= 400 && statusCode < 500
        ? new GeodataError(
          statusCode === 413 ? 'REQUEST_TOO_LARGE' : 'INVALID_REQUEST',
          statusCode === 413
            ? 'The request exceeded the geodata service body limit.'
            : 'The geodata request could not be accepted.',
          { statusCode, retryable: statusCode === 429, cause: error }
        )
        : asPublicError(error);
    if (reply.sent) return;
    reply
      .code(publicError.statusCode)
      .type(JSON_CONTENT_TYPE)
      .header('cache-control', 'no-store')
      .send(createErrorEnvelope(publicError, clock()));
  });

  app.get('/healthz', {
    config: { rateLimit: { max: config.limits.metadataRateLimitMax, timeWindow: config.limits.rateLimitWindow } }
  }, async (_request, reply) => {
    reply.type(JSON_CONTENT_TYPE).header('cache-control', 'no-store');
    return service.getHealthEnvelope();
  });

  app.get('/api/v1/catalog', {
    config: { rateLimit: { max: config.limits.metadataRateLimitMax, timeWindow: config.limits.rateLimitWindow } }
  }, async (_request, reply) => {
    reply
      .type(JSON_CONTENT_TYPE)
      .header('cache-control', `public, max-age=${config.limits.catalogMaxAgeSeconds}`);
    return service.getCatalogEnvelope();
  });

  app.get('/api/v1/geo/osm', {
    config: { rateLimit: { max: config.limits.osmRateLimitMax, timeWindow: config.limits.rateLimitWindow } }
  }, async (request, reply) => {
    const query = parseOsmRegionQuery(request.query, config.limits);
    const requestAbort = createRequestAbort(request);
    try {
      const result = await service.getOsmRegionEnvelope(query, { signal: requestAbort.signal });
      const etag = strongEtag(result.serialized);
      reply
        .header('cache-control', `public, max-age=${config.limits.publicMaxAgeSeconds}, stale-while-revalidate=${config.limits.publicStaleWhileRevalidateSeconds}`)
        .header('etag', etag)
        .header('x-geodata-cache', result.cacheStatus.toUpperCase());
      if (requestAcceptsEtag(request.headers['if-none-match'], etag)) {
        return reply.code(304).send();
      }
      return reply.type(JSON_CONTENT_TYPE).send(result.serialized);
    } finally {
      requestAbort.cleanup();
    }
  });

  await app.ready();
  return app;
}

export { JSON_CONTENT_TYPE, SECURITY_HEADERS, mergeVary, requestAcceptsEtag, strongEtag };
