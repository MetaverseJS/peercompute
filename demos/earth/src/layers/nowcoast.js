import {
  assessNowCoastFreshness,
  latestNowCoastTime,
  nowCoastCapabilitiesUrl,
  nowCoastDescriptor,
  parseNowCoastTimes
} from '@peercompute/geo-core';
import { invokeFetch, readResponseBytesBounded } from '../http.js';

const MAX_CAPABILITIES_BYTES = 5 * 1024 * 1024;

async function fetchCapabilities(fetchImpl, descriptor, signal) {
  const response = await invokeFetch(fetchImpl, nowCoastCapabilitiesUrl(descriptor), {
    method: 'GET',
    headers: { accept: 'application/xml,text/xml' },
    credentials: 'omit',
    redirect: 'error',
    signal
  });
  if (!response.ok) throw new Error(`NOAA nowCOAST returned HTTP ${response.status}.`);
  const bytes = await readResponseBytesBounded(response, {
    maximumBytes: MAX_CAPABILITIES_BYTES,
    label: 'NOAA nowCOAST capabilities',
    tooLargeCode: 'ERR_NOWCOAST_CAPABILITIES_TOO_LARGE'
  });
  return new TextDecoder().decode(bytes);
}

export async function createNowCoastLayer(
  Cesium,
  imageryLayers,
  id,
  { fetchImpl = globalThis.fetch, signal, alpha = 0.68, clock = Date.now } = {}
) {
  const descriptor = nowCoastDescriptor(id);
  if (!descriptor) throw new RangeError(`Unknown nowCOAST layer ${id}.`);
  const xml = await fetchCapabilities(fetchImpl, descriptor, signal);
  const values = parseNowCoastTimes(xml, descriptor);
  const time = latestNowCoastTime(values);
  const freshness = assessNowCoastFreshness(values, descriptor, { now: clock });
  if (freshness.status !== 'current') {
    const error = new Error(
      freshness.status === 'expired'
        ? `NOAA nowCOAST frame expired at ${freshness.expiresAt}.`
        : `NOAA nowCOAST frame time ${freshness.latestTime} is implausibly in the future.`
    );
    error.code = freshness.status === 'expired'
      ? 'ERR_NOWCOAST_FRAME_EXPIRED'
      : 'ERR_NOWCOAST_FRAME_FUTURE';
    error.freshness = freshness;
    throw error;
  }
  const provider = new Cesium.WebMapServiceImageryProvider({
    url: descriptor.url,
    layers: descriptor.layer,
    parameters: {
      transparent: 'true',
      format: 'image/png',
      time
    },
    credit: new Cesium.Credit('NOAA nowCOAST rendered imagery — display context only', true)
  });
  const layer = imageryLayers.addImageryProvider(provider);
  layer.alpha = alpha;
  imageryLayers.lowerToBottom(layer);
  return {
    id,
    descriptor,
    provider,
    layer,
    time,
    freshness,
    values,
    destroy() {
      if (imageryLayers.contains(layer)) imageryLayers.remove(layer, true);
    }
  };
}
