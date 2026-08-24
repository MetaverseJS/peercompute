import {
  decodeEtopo2022Bip,
  formatEtopo2022ExportUrl,
} from '@peercompute/geo-core';

import { readCappedResponse } from './http.js';

export const OVERVIEW_RELIEF_WIDTH = 257;
export const OVERVIEW_RELIEF_HEIGHT = 129;
export const OVERVIEW_RELIEF_MAXIMUM_BYTES = 96 * 1024;

export async function loadOverviewRelief({
  fetchImpl = globalThis.fetch,
  signal,
  width = OVERVIEW_RELIEF_WIDTH,
  height = OVERVIEW_RELIEF_HEIGHT,
} = {}) {
  const url = formatEtopo2022ExportUrl(
    { west: -180, south: -90, east: 180, north: 90 },
    { width, height },
  );
  const response = await fetchImpl(url, { mode: 'cors', cache: 'force-cache', signal });
  if (!response.ok) throw new Error(`NOAA ETOPO overview returned HTTP ${response.status}.`);
  const bytes = await readCappedResponse(response, OVERVIEW_RELIEF_MAXIMUM_BYTES, 'NOAA ETOPO overview');
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const heights = decodeEtopo2022Bip(arrayBuffer, width, height);
  let minimumHeightMeters = Infinity;
  let maximumHeightMeters = -Infinity;
  for (const heightMeters of heights) {
    if (!Number.isFinite(heightMeters)) throw new RangeError('NOAA ETOPO overview contains a non-finite height.');
    minimumHeightMeters = Math.min(minimumHeightMeters, heightMeters);
    maximumHeightMeters = Math.max(maximumHeightMeters, heightMeters);
  }
  return Object.freeze({
    schemaVersion: 'peercompute.roadvector.overview-relief.v1',
    sourceId: 'noaa-etopo2022',
    sourceUrl: url,
    attribution: 'NOAA/NCEI ETOPO 2022',
    notForNavigation: true,
    width,
    height,
    bytes: bytes.byteLength,
    heights,
    minimumHeightMeters,
    maximumHeightMeters,
  });
}
