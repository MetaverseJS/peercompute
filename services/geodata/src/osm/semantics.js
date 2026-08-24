function finiteNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseSimpleNumber(value) {
  if (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/u.test(value.trim())) return null;
  return finiteNumber(value.trim());
}

export function normalizeTags(tags) {
  if (tags === undefined) return Object.freeze({});
  if (!tags || typeof tags !== 'object' || Array.isArray(tags)) {
    throw new TypeError('OSM tags must be an object.');
  }
  const entries = Object.entries(tags).map(([key, value]) => {
    if (typeof value !== 'string') throw new TypeError('OSM tag values must be strings.');
    return [key, value];
  }).sort(([left], [right]) => left.localeCompare(right));
  return Object.freeze(Object.fromEntries(entries));
}

export function parseOneway(tags) {
  const value = tags.oneway?.trim().toLowerCase();
  if (value === '-1' || value === 'reverse') return 'reverse';
  if (
    ['yes', '1', 'true'].includes(value)
    || (
      value === undefined
      && (
        tags.junction === 'roundabout'
        || tags.highway === 'motorway'
        || tags.highway === 'motorway_link'
      )
    )
  ) {
    return 'forward';
  }
  return 'both';
}

export function parseMaxspeed(tags) {
  const raw = tags.maxspeed ?? null;
  if (!raw) return Object.freeze({ raw: null, kph: null });
  const first = raw.split(';', 1)[0].trim().toLowerCase();
  let match = first.match(/^(\d+(?:\.\d+)?)\s*(?:km\/?h|kph)?$/u);
  if (match) return Object.freeze({ raw, kph: Number(Number(match[1]).toFixed(3)) });
  match = first.match(/^(\d+(?:\.\d+)?)\s*mph$/u);
  if (match) return Object.freeze({ raw, kph: Number((Number(match[1]) * 1.609344).toFixed(3)) });
  match = first.match(/^(\d+(?:\.\d+)?)\s*(?:knots?|kt)$/u);
  if (match) return Object.freeze({ raw, kph: Number((Number(match[1]) * 1.852).toFixed(3)) });
  return Object.freeze({ raw, kph: null });
}

function parseAccessValue(value) {
  if (!value) return null;
  return value.trim().toLowerCase();
}

export function motorcycleAccess(tags) {
  const highway = tags.highway;
  const excludedHighways = new Set([
    'bridleway', 'construction', 'corridor', 'cycleway', 'elevator', 'footway',
    'path', 'pedestrian', 'platform', 'proposed', 'steps'
  ]);

  const denied = new Set(['no', 'private', 'agricultural', 'forestry']);
  const allowed = new Set(['yes', 'designated', 'permissive', 'destination', 'customers', 'delivery']);
  const hierarchy = [
    ['motorcycle', tags.motorcycle, 'motorcycle-tag'],
    ['motor_vehicle', tags.motor_vehicle, 'motor-vehicle-tag'],
    ['vehicle', tags.vehicle, 'vehicle-tag'],
    ['access', tags.access, 'access-tag']
  ];
  for (const [key, rawValue, reason] of hierarchy) {
    const value = parseAccessValue(rawValue);
    if (!value) continue;
    if (allowed.has(value)) return Object.freeze({ allowed: true, reason });
    if (denied.has(value)) return Object.freeze({ allowed: false, reason });
    return Object.freeze({ allowed: false, reason: `unsupported-${key}-tag` });
  }
  if (excludedHighways.has(highway)) return Object.freeze({ allowed: false, reason: 'highway-class' });
  return Object.freeze({ allowed: Boolean(highway), reason: highway ? 'highway-default' : 'not-a-road' });
}

function parseMeters(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  let match = normalized.match(/^(\d+(?:\.\d+)?)\s*(?:m|meter|meters|metre|metres)?$/u);
  if (match) return finiteNumber(match[1]);
  match = normalized.match(/^(\d+(?:\.\d+)?)\s*(?:ft|feet|foot|')$/u);
  if (match) return Number((Number(match[1]) * 0.3048).toFixed(3));
  return null;
}

function clampedHeight(value) {
  return Number(Math.min(500, Math.max(1, value)).toFixed(3));
}

function categoryDefaultHeight(tags) {
  const category = tags['building:part'] ?? tags.building ?? 'yes';
  const defaults = {
    apartments: 12,
    cathedral: 18,
    chapel: 12,
    church: 18,
    commercial: 12,
    detached: 6,
    garage: 3,
    garages: 3,
    house: 6,
    hut: 3,
    industrial: 9,
    office: 12,
    residential: 9,
    retail: 9,
    shed: 3,
    yes: 9
  };
  return defaults[category] ?? 9;
}

export function deriveBuildingHeights(tags) {
  const explicit = parseMeters(tags.height);
  const levels = parseSimpleNumber(tags['building:levels']);
  const minimumExplicit = parseMeters(tags.min_height);
  const minimumLevel = parseSimpleNumber(tags['building:min_level']);
  const rawHeight = explicit ?? (levels === null ? categoryDefaultHeight(tags) : levels * 3);
  const heightProvenance = explicit !== null
    ? 'source-height'
    : levels !== null
      ? 'building-levels-times-3m'
      : 'clamped-category-default';
  const heightMeters = clampedHeight(rawHeight);
  const minimumHeightMeters = Math.min(
    heightMeters,
    Math.max(0, minimumExplicit ?? (minimumLevel === null ? 0 : minimumLevel * 3))
  );

  return Object.freeze({
    heightMeters,
    heightProvenance,
    heightWasClamped: heightMeters !== rawHeight,
    minimumHeightMeters: Number(minimumHeightMeters.toFixed(3)),
    sourceHeight: tags.height ?? null,
    sourceLevels: tags['building:levels'] ?? null
  });
}

export function deriveRoadSemantics(tags) {
  const access = motorcycleAccess(tags);
  const lanes = parseSimpleNumber(tags.lanes);
  const layer = /^[-+]?\d+$/u.test(tags.layer ?? '') ? Number(tags.layer) : 0;
  return Object.freeze({
    highway: tags.highway ?? null,
    access: tags.access ?? null,
    motorcycleAccess: access,
    oneway: parseOneway(tags),
    surface: tags.surface ?? null,
    layer,
    bridge: tags.bridge && !['no', 'false', '0'].includes(tags.bridge) ? tags.bridge : null,
    tunnel: tags.tunnel && !['no', 'false', '0'].includes(tags.tunnel) ? tags.tunnel : null,
    lanes,
    maxspeed: parseMaxspeed(tags)
  });
}
