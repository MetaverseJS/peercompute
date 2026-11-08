const FEET_TO_METERS = 0.3048;

const DEFAULT_HEIGHTS = Object.freeze({
  apartments: 18,
  commercial: 15,
  office: 15,
  industrial: 12,
  warehouse: 10,
  church: 14,
  cathedral: 24,
  house: 8,
  residential: 9,
  garage: 3,
  garages: 3,
  shed: 3,
  roof: 3,
  yes: 9
});

function parseMetricLength(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const text = value.trim().toLowerCase().replace(',', '.');
  if (!text) return null;
  const feet = text.match(/^(-?\d+(?:\.\d+)?)\s*(?:ft|feet|foot|')$/);
  if (feet) return Number(feet[1]) * FEET_TO_METERS;
  const meters = text.match(/^(-?\d+(?:\.\d+)?)\s*(?:m|meter|meters|metre|metres)?$/);
  return meters ? Number(meters[1]) : null;
}

function parseLevels(value) {
  const levels = typeof value === 'number' ? value : Number.parseFloat(String(value ?? '').trim());
  return Number.isFinite(levels) && levels >= 0 ? levels : null;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function normalizeBuildingHeight(
  tags = {},
  { levelHeightMeters = 3, minimumHeightMeters = 2.5, maximumHeightMeters = 320 } = {}
) {
  if (!tags || typeof tags !== 'object' || Array.isArray(tags)) throw new TypeError('Building tags must be an object.');
  if (!(levelHeightMeters > 0) || !(minimumHeightMeters > 0) || !(maximumHeightMeters > minimumHeightMeters)) {
    throw new RangeError('Building height bounds are invalid.');
  }
  const buildingType = String(tags.building ?? tags['building:part'] ?? 'yes').toLowerCase();
  const explicitHeight = parseMetricLength(tags.height);
  const levels = parseLevels(tags['building:levels']);
  let heightMeters;
  let heightSource;
  let heightDerived;
  if (explicitHeight !== null && explicitHeight > 0) {
    heightMeters = explicitHeight;
    heightSource = 'height';
    heightDerived = false;
  } else if (levels !== null && levels > 0) {
    heightMeters = levels * levelHeightMeters;
    heightSource = 'building:levels';
    heightDerived = true;
  } else {
    heightMeters = DEFAULT_HEIGHTS[buildingType] ?? DEFAULT_HEIGHTS.yes;
    heightSource = 'category-default';
    heightDerived = true;
  }

  const explicitMinimum = parseMetricLength(tags.min_height);
  const minimumLevels = parseLevels(tags['building:min_level']);
  let baseHeightMeters = 0;
  let baseHeightSource = 'ground';
  if (explicitMinimum !== null && explicitMinimum >= 0) {
    baseHeightMeters = explicitMinimum;
    baseHeightSource = 'min_height';
  } else if (minimumLevels !== null && minimumLevels > 0) {
    baseHeightMeters = minimumLevels * levelHeightMeters;
    baseHeightSource = 'building:min_level';
  }
  const unclampedHeightMeters = heightMeters;
  heightMeters = clamp(heightMeters, minimumHeightMeters, maximumHeightMeters);
  baseHeightMeters = clamp(baseHeightMeters, 0, Math.max(0, heightMeters - 0.25));
  return Object.freeze({
    buildingType,
    heightMeters,
    baseHeightMeters,
    heightSource,
    baseHeightSource,
    heightDerived,
    heightClamped: heightMeters !== unclampedHeightMeters,
    levels,
    explicitHeightMeters: explicitHeight
  });
}
