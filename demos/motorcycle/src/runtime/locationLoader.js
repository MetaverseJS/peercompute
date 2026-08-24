import { bboxFromCenter, snapBboxOutward } from '@peercompute/geo-core';

import {
  createDerivedFlatTerrainGrid,
  loadEtopoTerrainGrid,
} from '../world/terrainGrid.js';
import { createMotorcycleSceneData } from '../world/sceneData.js';

export const MOTORCYCLE_REGION_RADII_METERS = Object.freeze([1_200, 800, 500]);

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
 * NOAA terrain failure produces an explicitly non-authoritative degraded plane
 * so the game remains inspectable without misrepresenting relief provenance.
 */
export async function loadMotorcycleLocation({
  geodata,
  location,
  radiiMeters = MOTORCYCLE_REGION_RADII_METERS,
  fetchImpl = globalThis.fetch,
  signal,
  terrainLoader = loadEtopoTerrainGrid,
  sceneDataFactory = createMotorcycleSceneData,
} = {}) {
  if (!geodata?.osmRegion) throw new TypeError('A GeodataClient-compatible source is required.');
  if (!Array.isArray(radiiMeters) || radiiMeters.length === 0) {
    throw new TypeError('radiiMeters must be a non-empty array.');
  }
  const normalizedLocation = normalizeMotorcycleLocation(location);
  const attempts = [];
  let envelope = null;
  let bbox = null;
  let radiusMeters = null;
  for (let index = 0; index < radiiMeters.length; index += 1) {
    radiusMeters = finite(radiiMeters[index], `radiiMeters[${index}]`);
    bbox = motorcycleRegionBbox(normalizedLocation, radiusMeters);
    try {
      envelope = await geodata.osmRegion({ bbox, signal });
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
  try {
    terrain = await terrainLoader({ bbox, fetchImpl, signal });
  } catch (error) {
    if (abortError(error)) throw error;
    terrainError = Object.freeze({
      code: error?.code ?? 'ERR_NOAA_TERRAIN',
      message: error?.message ?? String(error),
    });
    terrain = createDerivedFlatTerrainGrid({ bbox });
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
