import { z } from 'zod';

const PUBLIC_OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const DEFAULT_USER_AGENT = 'PeerCompute-Geodata/0.1 (+https://github.com/MetaverseJS/peercompute)';
const DEFAULT_DEVELOPMENT_ORIGINS = [
  'http://127.0.0.1:5187',
  'http://localhost:5187',
  'https://127.0.0.1:5187',
  'https://localhost:5187',
  'http://127.0.0.1:5188',
  'http://localhost:5188',
  'https://127.0.0.1:5188',
  'https://localhost:5188'
].join(',');

export const GEODATA_LIMITS = Object.freeze({
  bboxMaxAxisMeters: 8_000,
  bboxMaxAreaSquareMeters: 64_000_000,
  bboxSnapDegrees: 0.001,
  overpassQueryTimeoutSeconds: 20,
  overpassCallTimeoutMs: 25_000,
  overpassMaxResponseBytes: 8 * 1024 * 1024,
  normalizedResponseMaxBytes: 8 * 1024 * 1024,
  overpassMaxRequestBytes: 64 * 1024,
  maxRoadWays: 5_000,
  maxBuildings: 5_000,
  maxRestrictionRelations: 2_000,
  maxUniqueNodes: 50_000,
  maxDirectedGraphEdges: 100_000,
  maxConcurrentOverpassCalls: 2,
  maxQueuedOverpassCalls: 32,
  cacheMaxEntries: 128,
  cacheFreshTtlMs: 6 * 60 * 60 * 1_000,
  cacheStaleIfErrorMs: 7 * 24 * 60 * 60 * 1_000,
  publicMaxAgeSeconds: 3_600,
  publicStaleWhileRevalidateSeconds: 86_400,
  catalogMaxAgeSeconds: 300,
  osmRateLimitMax: 30,
  metadataRateLimitMax: 120,
  rateLimitWindow: '1 minute'
});

const booleanFromEnvironment = z.union([z.boolean(), z.string()]).transform((value, context) => {
  if (typeof value === 'boolean') return value;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off', ''].includes(normalized)) return false;
  context.addIssue({ code: 'custom', message: 'must be an explicit boolean' });
  return z.NEVER;
});

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  GEODATA_HOST: z.string().trim().min(1).max(255).default('127.0.0.1'),
  GEODATA_PORT: z.coerce.number().int().min(1).max(65_535).default(8788),
  GEODATA_CORS_ORIGINS: z.string().max(8_192).optional(),
  GEODATA_OVERPASS_URL: z.string().trim().max(2_048).optional(),
  GEODATA_ALLOW_PUBLIC_OVERPASS: booleanFromEnvironment.default(false),
  GEODATA_USER_AGENT: z.string().trim().min(10).max(256).default(DEFAULT_USER_AGENT)
}).passthrough();

function validateHeaderValue(value, label) {
  if (/[^\t\x20-\x7e]/u.test(value)) {
    throw new Error(`${label} contains characters that are not valid in an HTTP header.`);
  }
  return value;
}

function parseExactOrigins(value) {
  if (!value?.trim()) return [];

  const origins = value.split(',').map((entry) => entry.trim()).filter(Boolean);
  const normalized = new Set();

  for (const origin of origins) {
    if (origin === '*') {
      throw new Error('GEODATA_CORS_ORIGINS does not accept wildcard origins.');
    }
    let url;
    try {
      url = new URL(origin);
    } catch {
      throw new Error('GEODATA_CORS_ORIGINS contains an invalid origin.');
    }
    if (!['http:', 'https:'].includes(url.protocol)
      || url.username
      || url.password
      || url.pathname !== '/'
      || url.search
      || url.hash
      || url.origin !== origin) {
      throw new Error('GEODATA_CORS_ORIGINS entries must be exact HTTP(S) origins.');
    }
    normalized.add(url.origin);
  }

  return [...normalized].sort();
}

function parseOverpassEndpoint(value) {
  if (!value) return null;
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('GEODATA_OVERPASS_URL must be a valid HTTP(S) URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol)
    || url.username
    || url.password
    || url.search
    || url.hash) {
    throw new Error('GEODATA_OVERPASS_URL must be a secret-free fixed HTTP(S) endpoint.');
  }
  return url.href;
}

function isPublicOverpassEndpoint(value) {
  if (!value) return false;
  const hostname = new URL(value).hostname.toLowerCase().replace(/\.+$/u, '');
  return hostname === 'overpass-api.de' || hostname.endsWith('.overpass-api.de');
}

export function loadConfig(environment = process.env, overrides = {}) {
  const parsed = environmentSchema.safeParse(environment);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.') || 'environment'))];
    throw new Error(`Invalid geodata configuration: ${fields.join(', ')}.`);
  }

  const values = parsed.data;
  validateHeaderValue(values.GEODATA_USER_AGENT, 'GEODATA_USER_AGENT');

  const configuredEndpoint = parseOverpassEndpoint(values.GEODATA_OVERPASS_URL);
  const implicitPublicFallback = !configuredEndpoint && values.GEODATA_ALLOW_PUBLIC_OVERPASS;
  const publicFallback = implicitPublicFallback || isPublicOverpassEndpoint(configuredEndpoint);
  if (values.NODE_ENV === 'production' && publicFallback) {
    throw new Error(
      'Public overpass-api.de endpoints are development/test-only; production requires GEODATA_OVERPASS_URL on a controlled host.'
    );
  }
  const overpassUrl = configuredEndpoint ?? (implicitPublicFallback ? PUBLIC_OVERPASS_URL : null);
  const developmentOrigins = values.NODE_ENV === 'development' ? DEFAULT_DEVELOPMENT_ORIGINS : '';

  return Object.freeze({
    environment: values.NODE_ENV,
    host: values.GEODATA_HOST,
    port: values.GEODATA_PORT,
    corsOrigins: Object.freeze(parseExactOrigins(
      values.GEODATA_CORS_ORIGINS ?? developmentOrigins
    )),
    userAgent: values.GEODATA_USER_AGENT,
    overpass: Object.freeze({
      configured: Boolean(overpassUrl),
      url: overpassUrl,
      mode: publicFallback
        ? 'public-development-fallback'
        : configuredEndpoint
          ? 'configured'
          : 'unconfigured',
      publicFallback: Boolean(publicFallback)
    }),
    ...overrides,
    limits: Object.freeze({ ...GEODATA_LIMITS, ...(overrides.limits ?? {}) })
  });
}

export { DEFAULT_USER_AGENT, isPublicOverpassEndpoint, PUBLIC_OVERPASS_URL };
