import { bboxFromCenter, snapBboxOutward } from '@peercompute/geo-core';

import {
  createDerivedFlatTerrainGrid,
  loadTerrariumTerrainGrid,
} from '../world/terrainGrid.js';
import { createMotorcycleSceneData } from '../world/sceneData.js';

export const MOTORCYCLE_REGION_RADII_METERS = Object.freeze([1_200, 800, 500]);
export const MOTORCYCLE_TERRAIN_TIMEOUT_MS = 10_000;

const DENSITY_ERROR_CODES = new Set([
  'REGION_RESULT_LIMIT_EXCEEDED',
  'UPSTREAM_RESULT_LIMIT_EXCEEDED',
  'UPSTREAM_BODY_TOO_LARGE',
  'BBOX_TOO_LARGE',
  'ERR_GEODATA_RESPONSE_TOO_LARGE',
  'REGION_RESPONSE_LIMIT_EXCEEDED',
]);

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

function abortError(error) {
  return error?.name === 'AbortError' || error?.code === 'ABORT_ERR';
}

export function normalizeMotorcycleLocation(location) {
  const longitude = finite(location?.longitude, 'longitude');
  const latitude = finite(location?.latitude, 'latitude');
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new RangeError('Location is outside WGS84 bounds.');
  }
  return Object.freeze({
    longitude: Math.round(longitude * 10_000) / 10_000,
    latitude: Math.round(latitude * 10_000) / 10_000,
  });
}

export function motorcycleRegionBbox(location, radiusMeters) {
  return snapBboxOutward(bboxFromCenter(normalizeMotorcycleLocation(location), radiusMeters), 0.001);
}

/**
 * Loads one bounded OSM region, narrowing only for declared density limits.
 * Terrarium terrain failure or timeout produces an explicitly
 * non-authoritative degraded plane so the game remains inspectable without
 * misrepresenting relief provenance.
 */
export async function loadMotorcycleLocation({
  geodata,
  location,
  radiiMeters = MOTORCYCLE_REGION_RADII_METERS,
  fetchImpl = globalThis.fetch,
  signal,
  terrainLoader = loadTerrariumTerrainGrid,
  terrainTimeoutMs = MOTORCYCLE_TERRAIN_TIMEOUT_MS,
  sceneDataFactory = createMotorcycleSceneData,
} = {}) {
  if (!geodata?.osmRegion) throw new TypeError('A GeodataClient-compatible source is required.');
  if (!Array.isArray(radiiMeters) || radiiMeters.length === 0) {
    throw new TypeError('radiiMeters must be a non-empty array.');
  }
  const normalizedLocation = normalizeMotorcycleLocation(location);
  if (!Number.isSafeInteger(terrainTimeoutMs) || terrainTimeoutMs < 1) {
    throw new RangeError('terrainTimeoutMs must be a positive safe integer.');
  }
  const attempts = [];
  let envelope = null;
  let bbox = null;
  let radiusMeters = null;
  for (let index = 0; index < radiiMeters.length; index += 1) {
    radiusMeters = finite(radiiMeters[index], `radiiMeters[${index}]`);
    bbox = motorcycleRegionBbox(normalizedLocation, radiusMeters);
    try {
      envelope = await geodata.osmRegion({ bbox, layers: ['roads'], signal });
      attempts.push(Object.freeze({ radiusMeters, bbox, status: 'loaded' }));
      break;
    } catch (error) {
      if (abortError(error)) throw error;
      const retryableDensity = DENSITY_ERROR_CODES.has(error?.code)
        && index < radiiMeters.length - 1;
      attempts.push(Object.freeze({
        radiusMeters,
        bbox,
        status: retryableDensity ? 'narrowing' : 'failed',
        code: error?.code ?? 'ERR_GEODATA_REGION',
        message: error?.message ?? String(error),
      }));
      if (!retryableDensity) throw error;
    }
  }
  if (!envelope) throw new Error('No OSM region was returned.');

  let terrain;
  let terrainError = null;
  const terrainTimeoutController = new AbortController();
  let terrainTimedOut = false;
  const terrainTimeoutId = setTimeout(() => {
    terrainTimedOut = true;
    const error = new Error(`RoadVector terrain exceeded its ${terrainTimeoutMs} ms deadline.`);
    error.code = 'ERR_MOTORCYCLE_TERRAIN_TIMEOUT';
    terrainTimeoutController.abort(error);
  }, terrainTimeoutMs);
  const terrainSignal = signal
    ? AbortSignal.any([signal, terrainTimeoutController.signal])
    : terrainTimeoutController.signal;
  try {
    terrain = await terrainLoader({ bbox, fetchImpl, signal: terrainSignal });
  } catch (error) {
    if (signal?.aborted || (abortError(error) && !terrainTimedOut)) throw error;
    terrainError = Object.freeze({
      code: terrainTimedOut
        ? 'ERR_MOTORCYCLE_TERRAIN_TIMEOUT'
        : error?.code ?? 'ERR_TERRARIUM_TERRAIN',
      message: terrainTimedOut
        ? `RoadVector terrain exceeded its ${terrainTimeoutMs} ms deadline.`
        : error?.message ?? String(error),
    });
    terrain = createDerivedFlatTerrainGrid({ bbox });
  } finally {
    clearTimeout(terrainTimeoutId);
  }
  const sceneData = sceneDataFactory(envelope, terrain);
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.location-load.v1',
    location: normalizedLocation,
    radiusMeters,
    bbox,
    attempts: Object.freeze(attempts),
    envelope,
    terrain,
    terrainDegraded: terrain.source.derived === true,
    terrainError,
    sceneData,
  });
}
