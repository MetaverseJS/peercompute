const EARTH_RADIUS_METERS = 6_371_008.8;
const DEGREES_TO_RADIANS = Math.PI / 180;

function finiteNumber(value, label) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be a finite number.`);
  return number;
}

function parseBboxValue(value) {
  if (typeof value === 'string') return value.split(',').map((entry) => entry.trim());
  if (Array.isArray(value) || ArrayBuffer.isView(value)) return Array.from(value);
  throw new TypeError('bbox must be a south,west,north,east string or four-value array.');
}

export function haversineDistanceMeters(left, right) {
  const latitude1 = finiteNumber(left?.latitude ?? left?.lat ?? left?.[1], 'left latitude') * DEGREES_TO_RADIANS;
  const longitude1 = finiteNumber(left?.longitude ?? left?.lon ?? left?.[0], 'left longitude') * DEGREES_TO_RADIANS;
  const latitude2 = finiteNumber(right?.latitude ?? right?.lat ?? right?.[1], 'right latitude') * DEGREES_TO_RADIANS;
  const longitude2 = finiteNumber(right?.longitude ?? right?.lon ?? right?.[0], 'right longitude') * DEGREES_TO_RADIANS;
  const latitudeDelta = latitude2 - latitude1;
  const longitudeDelta = longitude2 - longitude1;
  const sinLatitude = Math.sin(latitudeDelta / 2);
  const sinLongitude = Math.sin(longitudeDelta / 2);
  const a = sinLatitude * sinLatitude
    + Math.cos(latitude1) * Math.cos(latitude2) * sinLongitude * sinLongitude;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function measureBbox(bbox) {
  const [south, west, north, east] = normalizeBbox(bbox, {
    maxAxisKm: Number.POSITIVE_INFINITY,
    maxAreaKm2: Number.POSITIVE_INFINITY
  });
  const middleLatitude = (south + north) / 2;
  const heightMeters = haversineDistanceMeters([west, south], [west, north]);
  const widthMeters = haversineDistanceMeters([west, middleLatitude], [east, middleLatitude]);
  return {
    widthMeters,
    heightMeters,
    widthKm: widthMeters / 1000,
    heightKm: heightMeters / 1000,
    areaKm2: (widthMeters * heightMeters) / 1_000_000,
    center: [(west + east) / 2, middleLatitude]
  };
}

export function normalizeBbox(
  value,
  {
    maxAxisKm = 8,
    maxAreaKm2 = 64,
    minimumAxisMeters = 1
  } = {}
) {
  const values = parseBboxValue(value);
  if (values.length !== 4) throw new RangeError('bbox must contain exactly south,west,north,east.');
  const [south, west, north, east] = values.map((entry, index) => finiteNumber(entry, `bbox[${index}]`));
  if (south < -90 || north > 90 || west < -180 || east > 180) {
    throw new RangeError('bbox coordinates exceed WGS84 latitude/longitude bounds.');
  }
  if (south >= north) throw new RangeError('bbox south must be less than north.');
  if (west >= east) throw new RangeError('bbox west must be less than east; antimeridian regions are unsupported in v1.');
  if (!(maxAxisKm > 0) || !(maxAreaKm2 > 0) || !(minimumAxisMeters >= 0)) {
    throw new RangeError('bbox measurement limits must be positive.');
  }

  const middleLatitude = (south + north) / 2;
  const heightMeters = haversineDistanceMeters([west, south], [west, north]);
  const widthMeters = haversineDistanceMeters([west, middleLatitude], [east, middleLatitude]);
  if (Math.min(widthMeters, heightMeters) < minimumAxisMeters) {
    throw new RangeError(`bbox axes must each span at least ${minimumAxisMeters} meters.`);
  }
  if (Math.max(widthMeters, heightMeters) > maxAxisKm * 1000 + 0.01) {
    throw new RangeError(`bbox axes may not exceed ${maxAxisKm} km.`);
  }
  const areaKm2 = (widthMeters * heightMeters) / 1_000_000;
  if (areaKm2 > maxAreaKm2 + 1e-9) throw new RangeError(`bbox area may not exceed ${maxAreaKm2} km².`);
  return Object.freeze([south, west, north, east]);
}

export function bboxFromCenter(
  { longitude, latitude },
  radiusMeters,
  options
) {
  const lon = finiteNumber(longitude, 'longitude');
  const lat = finiteNumber(latitude, 'latitude');
  const radius = finiteNumber(radiusMeters, 'radiusMeters');
  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) throw new RangeError('Center is outside WGS84 bounds.');
  if (!(radius > 0)) throw new RangeError('radiusMeters must be positive.');
  const latitudeDelta = (radius / EARTH_RADIUS_METERS) / DEGREES_TO_RADIANS;
  const longitudeScale = Math.cos(lat * DEGREES_TO_RADIANS);
  if (Math.abs(longitudeScale) < 1e-6) throw new RangeError('Polar center cannot be represented by a v1 non-wrapping bbox.');
  const longitudeDelta = latitudeDelta / Math.abs(longitudeScale);
  if (lon - longitudeDelta < -180 || lon + longitudeDelta > 180) {
    throw new RangeError('Center radius crosses the antimeridian, which v1 does not support.');
  }
  return normalizeBbox([
    Math.max(-90, lat - latitudeDelta),
    lon - longitudeDelta,
    Math.min(90, lat + latitudeDelta),
    lon + longitudeDelta
  ], options);
}

export function snapBboxOutward(bbox, stepDegrees = 0.0025) {
  const normalized = normalizeBbox(bbox, {
    maxAxisKm: Number.POSITIVE_INFINITY,
    maxAreaKm2: Number.POSITIVE_INFINITY,
    minimumAxisMeters: 0
  });
  if (!Number.isFinite(stepDegrees) || stepDegrees <= 0 || stepDegrees > 1) {
    throw new RangeError('stepDegrees must be greater than zero and at most one degree.');
  }
  const [south, west, north, east] = normalized;
  return Object.freeze([
    Math.max(-90, Math.floor(south / stepDegrees) * stepDegrees),
    Math.max(-180, Math.floor(west / stepDegrees) * stepDegrees),
    Math.min(90, Math.ceil(north / stepDegrees) * stepDegrees),
    Math.min(180, Math.ceil(east / stepDegrees) * stepDegrees)
  ]);
}

export function pointWithinBbox([longitude, latitude], bbox) {
  const [south, west, north, east] = normalizeBbox(bbox, {
    maxAxisKm: Number.POSITIVE_INFINITY,
    maxAreaKm2: Number.POSITIVE_INFINITY,
    minimumAxisMeters: 0
  });
  return Number.isFinite(longitude)
    && Number.isFinite(latitude)
    && longitude >= west
    && longitude <= east
    && latitude >= south
    && latitude <= north;
}
