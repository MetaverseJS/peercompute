import { bboxFromCenter, snapBboxOutward } from '@peercompute/geo-core';

export const LOCAL_REGION_RADII_METERS = Object.freeze([1_200, 800, 500]);

export const DENSE_REGION_ERROR_CODES = Object.freeze(new Set([
  'BBOX_TOO_LARGE',
  'ERR_GEODATA_RESPONSE_TOO_LARGE',
  'REGION_RESPONSE_LIMIT_EXCEEDED',
  'REGION_RESULT_LIMIT_EXCEEDED',
  'UPSTREAM_BODY_TOO_LARGE'
]));

function assertRadii(radii) {
  if (!Array.isArray(radii)
    || radii.length === 0
    || radii.some((radius) => !Number.isSafeInteger(radius) || radius <= 0)
    || radii.some((radius, index) => index > 0 && radius >= radii[index - 1])) {
    throw new TypeError('Local-region radii must be positive integers in strictly descending order.');
  }
}

function compactTimestamp(value) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return 'TIME UNKNOWN';
  return new Date(value).toISOString().replace('.000Z', 'Z');
}

export function isDenseRegionError(error) {
  return DENSE_REGION_ERROR_CODES.has(error?.code);
}

export function localRegionBbox(location, radiusMeters) {
  if (!location || !Number.isFinite(location.longitude) || !Number.isFinite(location.latitude)) {
    throw new TypeError('A finite WGS84 location is required.');
  }
  if (!Number.isSafeInteger(radiusMeters) || radiusMeters <= 0) {
    throw new TypeError('A positive integer radius is required.');
  }
  return snapBboxOutward(bboxFromCenter(location, radiusMeters), 0.001);
}

export async function requestLocalRegionWithNarrowing({
  geodata,
  location,
  radii = LOCAL_REGION_RADII_METERS,
  startRadius = radii[0],
  signal,
  bboxForRadius = localRegionBbox,
  onAttempt = () => {}
} = {}) {
  if (!geodata || typeof geodata.osmRegion !== 'function') {
    throw new TypeError('A GeodataClient-compatible source is required.');
  }
  assertRadii(radii);
  if (typeof bboxForRadius !== 'function' || typeof onAttempt !== 'function') {
    throw new TypeError('bboxForRadius and onAttempt must be functions.');
  }
  const startIndex = radii.indexOf(startRadius);
  if (startIndex < 0) throw new RangeError('startRadius must be one of the bounded local-region radii.');

  const attemptedRadii = [];
  for (let index = startIndex; index < radii.length; index += 1) {
    const radiusMeters = radii[index];
    const bbox = bboxForRadius(location, radiusMeters);
    attemptedRadii.push(radiusMeters);
    onAttempt(Object.freeze({
      bbox: [...bbox],
      radiusMeters,
      attempt: attemptedRadii.length,
      narrowed: index > startIndex
    }));
    try {
      const envelope = await geodata.osmRegion({ bbox, signal });
      return Object.freeze({
        envelope,
        bbox: Object.freeze([...bbox]),
        radiusMeters,
        attemptedRadii: Object.freeze([...attemptedRadii])
      });
    } catch (error) {
      if (!isDenseRegionError(error) || index === radii.length - 1) throw error;
    }
  }
  throw new Error('Local-region radius policy exhausted without a result.');
}

export function localStatusForEnvelope(envelope) {
  if (!envelope) return 'unrequested';
  return envelope.status === 'stale' ? 'stale' : 'local-live';
}

export function formatLocalProvenance(envelope, { enabled = true } = {}) {
  if (!envelope) return enabled ? 'LOCAL REGION UNREQUESTED' : 'LOCAL REGION OFF';
  const status = envelope.status === 'stale' ? 'STALE ON UPSTREAM ERROR' : 'CURRENT';
  const visibility = enabled ? 'VISIBLE' : 'HIDDEN / VERIFIED DATA RETAINED';
  const sourceTime = compactTimestamp(envelope.provenance?.sourceBaseTimestamp);
  const fetchedAt = compactTimestamp(envelope.fetchedAt);
  const freshnessBoundary = compactTimestamp(envelope.staleAt);
  const freshnessLabel = envelope.status === 'stale' ? 'FRESHNESS EXPIRED' : 'FRESH UNTIL';
  const providerMode = String(envelope.provenance?.providerMode ?? 'TRANSPORT UNKNOWN').toUpperCase();
  const cacheState = String(envelope.cache?.state ?? 'CACHE UNKNOWN').toUpperCase();
  return `${status} // ${visibility} // OSM BASE ${sourceTime} // FETCHED ${fetchedAt} // ${freshnessLabel} ${freshnessBoundary} // ${cacheState} // ${providerMode} // ODBL 1.0 DERIVED DATABASE`;
}

export function localScenePresentation({ enabled, envelope, render } = {}) {
  if (!enabled) {
    return Object.freeze({
      status: 'off',
      statusText: 'OFF',
      provenanceText: formatLocalProvenance(envelope, { enabled: false })
    });
  }
  if (!envelope || !render) {
    return Object.freeze({
      status: 'unrequested',
      statusText: 'UNREQUESTED',
      provenanceText: formatLocalProvenance(null)
    });
  }
  const status = localStatusForEnvelope(envelope);
  return Object.freeze({
    status,
    statusText: `${status.toUpperCase()} // ${render.renderedRoads} R / ${render.renderedBuildings} B`,
    provenanceText: formatLocalProvenance(envelope)
  });
}

export function localSourceSnapshot(envelope) {
  if (!envelope) return null;
  return {
    status: envelope.status,
    fetchedAt: envelope.fetchedAt,
    staleAt: envelope.staleAt,
    freshness: envelope.status === 'stale' ? 'stale-on-error' : 'current',
    notes: [...envelope.notes],
    cache: { ...envelope.cache },
    provenance: { ...envelope.provenance }
  };
}
