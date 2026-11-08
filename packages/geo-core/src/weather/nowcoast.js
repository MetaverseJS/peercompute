export const NOWCOAST_LAYERS = Object.freeze([
  Object.freeze({
    id: 'noaa-radar-alaska',
    title: 'NOAA Alaska base reflectivity mosaic',
    kind: 'radar',
    sourceId: 'noaa-nowcoast-radar',
    url: 'https://nowcoast.noaa.gov/geoserver/observations/weather_radar/ows',
    layer: 'alaska_base_reflectivity_mosaic',
    cadenceMinutes: 4,
    historyMinutes: 360
  }),
  Object.freeze({
    id: 'noaa-radar-conus',
    title: 'NOAA CONUS base reflectivity mosaic',
    kind: 'radar',
    sourceId: 'noaa-nowcoast-radar',
    url: 'https://nowcoast.noaa.gov/geoserver/observations/weather_radar/ows',
    layer: 'conus_base_reflectivity_mosaic',
    cadenceMinutes: 4,
    historyMinutes: 360
  }),
  Object.freeze({
    id: 'noaa-goes-visible',
    title: 'NOAA GOES visible imagery',
    kind: 'satellite',
    sourceId: 'noaa-nowcoast-satellite',
    url: 'https://nowcoast.noaa.gov/geoserver/observations/satellite/ows',
    layer: 'goes_visible_imagery',
    cadenceMinutes: 5,
    historyMinutes: 360
  }),
  Object.freeze({
    id: 'noaa-goes-infrared',
    title: 'NOAA GOES longwave infrared imagery',
    kind: 'satellite',
    sourceId: 'noaa-nowcoast-satellite',
    url: 'https://nowcoast.noaa.gov/geoserver/observations/satellite/ows',
    layer: 'goes_longwave_imagery',
    cadenceMinutes: 5,
    historyMinutes: 360
  })
]);

export function nowCoastDescriptor(id) {
  const descriptor = NOWCOAST_LAYERS.find((entry) => entry.id === id);
  return descriptor ? { ...descriptor } : null;
}

export function nowCoastCapabilitiesUrl(descriptorOrId) {
  const descriptor = typeof descriptorOrId === 'string'
    ? nowCoastDescriptor(descriptorOrId)
    : descriptorOrId;
  if (!descriptor) throw new RangeError('Unknown nowCOAST layer.');
  const url = new URL(descriptor.url);
  if (url.protocol !== 'https:' || url.hostname !== 'nowcoast.noaa.gov') {
    throw new TypeError('nowCOAST descriptors must use the official HTTPS host.');
  }
  url.search = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetCapabilities'
  }).toString();
  return url.toString();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseNowCoastTimes(xml, descriptorOrId) {
  if (typeof xml !== 'string' || xml.length < 20) throw new TypeError('nowCOAST capabilities XML is required.');
  const descriptor = typeof descriptorOrId === 'string'
    ? nowCoastDescriptor(descriptorOrId)
    : descriptorOrId;
  if (!descriptor) throw new RangeError('Unknown nowCOAST layer.');
  const layerPattern = new RegExp(
    `<Layer(?:\\s[^>]*)?>[\\s\\S]*?<Name>\\s*${escapeRegex(descriptor.layer)}\\s*</Name>([\\s\\S]*?)</Layer>`,
    'i'
  );
  const layerMatch = xml.match(layerPattern);
  if (!layerMatch) throw new Error(`nowCOAST capabilities omit ${descriptor.layer}.`);
  const dimensionMatch = layerMatch[1].match(
    /<(?:Dimension|Extent)[^>]*(?:name|Name)=["']time["'][^>]*>([\s\S]*?)<\/(?:Dimension|Extent)>/i
  );
  if (!dimensionMatch) throw new Error(`nowCOAST layer ${descriptor.layer} has no time dimension.`);
  const raw = dimensionMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
  const tokens = raw.split(',').map((entry) => entry.trim()).filter(Boolean);
  const values = [];
  for (const token of tokens) {
    if (token.includes('/')) {
      const [startText, endText, period = ''] = token.split('/');
      const start = new Date(startText);
      const end = new Date(endText);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
        throw new Error('nowCOAST time range is invalid.');
      }
      values.push({ kind: 'range', start: start.toISOString(), end: end.toISOString(), period });
    } else {
      const instant = new Date(token);
      if (Number.isNaN(instant.getTime())) throw new Error(`Invalid nowCOAST time value: ${token}`);
      values.push({ kind: 'instant', value: instant.toISOString() });
    }
  }
  if (values.length < 1) throw new Error('nowCOAST time dimension is empty.');
  return Object.freeze(values.map((entry) => Object.freeze(entry)));
}

export function latestNowCoastTime(values) {
  if (!Array.isArray(values) || values.length < 1) throw new TypeError('Parsed nowCOAST values are required.');
  let latest = null;
  for (const value of values) {
    const candidate = value.kind === 'range' ? value.end : value.value;
    const milliseconds = Date.parse(candidate);
    if (!Number.isNaN(milliseconds) && (latest === null || milliseconds > latest.milliseconds)) {
      latest = { value: new Date(milliseconds).toISOString(), milliseconds };
    }
  }
  if (!latest) throw new Error('No finite nowCOAST time is available.');
  return latest.value;
}

function observedMilliseconds(now) {
  const value = typeof now === 'function' ? now() : now;
  const milliseconds = value instanceof Date ? value.getTime() : Number(value);
  if (!Number.isFinite(milliseconds)) throw new TypeError('A finite nowCOAST observation clock is required.');
  return milliseconds;
}

export function assessNowCoastFreshness(
  values,
  descriptorOrId,
  { now = Date.now, maximumCadenceMultiples = 6, futureCadenceMultiples = 2 } = {}
) {
  const descriptor = typeof descriptorOrId === 'string'
    ? nowCoastDescriptor(descriptorOrId)
    : descriptorOrId;
  if (!descriptor) throw new RangeError('Unknown nowCOAST layer.');
  if (!Number.isFinite(descriptor.cadenceMinutes) || descriptor.cadenceMinutes <= 0) {
    throw new TypeError('nowCOAST layer cadence must be a positive finite number.');
  }
  if (!Number.isInteger(maximumCadenceMultiples) || maximumCadenceMultiples < 1) {
    throw new RangeError('maximumCadenceMultiples must be a positive integer.');
  }
  if (!Number.isInteger(futureCadenceMultiples) || futureCadenceMultiples < 0) {
    throw new RangeError('futureCadenceMultiples must be a nonnegative integer.');
  }

  const latestTime = latestNowCoastTime(values);
  const latestMilliseconds = Date.parse(latestTime);
  const nowMilliseconds = observedMilliseconds(now);
  const cadenceMilliseconds = descriptor.cadenceMinutes * 60_000;
  const maximumAgeMilliseconds = cadenceMilliseconds * maximumCadenceMultiples;
  const maximumFutureMilliseconds = cadenceMilliseconds * futureCadenceMultiples;
  const ageMilliseconds = nowMilliseconds - latestMilliseconds;
  const status = ageMilliseconds > maximumAgeMilliseconds
    ? 'expired'
    : ageMilliseconds < -maximumFutureMilliseconds
      ? 'future'
      : 'current';

  return Object.freeze({
    status,
    latestTime,
    observedAt: new Date(nowMilliseconds).toISOString(),
    ageMinutes: ageMilliseconds / 60_000,
    maximumAgeMinutes: maximumAgeMilliseconds / 60_000,
    expiresAt: new Date(latestMilliseconds + maximumAgeMilliseconds).toISOString()
  });
}
