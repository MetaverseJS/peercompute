const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_TO_DEGREES = 180 / Math.PI;
const WGS84_MEAN_RADIUS_METERS = 6_371_008.8;

function finite(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be finite.`);
  return number;
}

export function validateWgs84Coordinate(value, name = 'coordinate') {
  if (!Array.isArray(value) || value.length < 2) {
    throw new TypeError(`${name} must be a [longitude, latitude] array.`);
  }
  const longitude = finite(value[0], `${name} longitude`);
  const latitude = finite(value[1], `${name} latitude`);
  if (longitude < -180 || longitude > 180) {
    throw new RangeError(`${name} longitude must be between -180 and 180 degrees.`);
  }
  if (latitude < -90 || latitude > 90) {
    throw new RangeError(`${name} latitude must be between -90 and 90 degrees.`);
  }
  return Object.freeze([longitude, latitude]);
}

function shortestLongitudeDelta(from, to) {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

function normalizeLongitude(value) {
  let longitude = ((value + 180) % 360 + 360) % 360 - 180;
  if (longitude === -180 && value > 0) longitude = 180;
  return longitude;
}

export function interpolateWgs84(from, to, alpha) {
  const fraction = Math.min(1, Math.max(0, finite(alpha, 'alpha')));
  const longitude = normalizeLongitude(
    from[0] + shortestLongitudeDelta(from[0], to[0]) * fraction
  );
  const latitude = from[1] + (to[1] - from[1]) * fraction;
  return Object.freeze([longitude, latitude]);
}

export function bearingRadians(from, to) {
  const fromLatitude = from[1] * DEGREES_TO_RADIANS;
  const toLatitude = to[1] * DEGREES_TO_RADIANS;
  const longitudeDelta = shortestLongitudeDelta(from[0], to[0]) * DEGREES_TO_RADIANS;
  const y = Math.sin(longitudeDelta) * Math.cos(toLatitude);
  const x = Math.cos(fromLatitude) * Math.sin(toLatitude)
    - Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(longitudeDelta);
  if (Math.abs(x) < Number.EPSILON && Math.abs(y) < Number.EPSILON) return 0;
  return Math.atan2(y, x);
}

/**
 * Offsets a WGS84 coordinate perpendicular to travel using a bounded caller-
 * supplied distance. Positive distances are to the right of the heading;
 * negative distances are to the left. The spherical direct solution remains
 * finite across the antimeridian and near the poles, which is sufficient for
 * the simulator's sub-20-metre derived game lane geometry.
 */
export function offsetWgs84Right(coordinate, headingRadians, offsetMeters) {
  const source = validateWgs84Coordinate(coordinate);
  const heading = finite(headingRadians, 'headingRadians');
  const distance = finite(offsetMeters, 'offsetMeters');
  if (distance === 0) return source;

  const angularDistance = distance / WGS84_MEAN_RADIUS_METERS;
  const bearing = heading + Math.PI / 2;
  const latitude = source[1] * DEGREES_TO_RADIANS;
  const longitude = source[0] * DEGREES_TO_RADIANS;
  const destinationLatitude = Math.asin(Math.min(1, Math.max(-1,
    Math.sin(latitude) * Math.cos(angularDistance)
      + Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(bearing)
  )));
  const destinationLongitude = longitude + Math.atan2(
    Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude),
    Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(destinationLatitude)
  );
  return Object.freeze([
    normalizeLongitude(destinationLongitude * RADIANS_TO_DEGREES),
    destinationLatitude * RADIANS_TO_DEGREES
  ]);
}

export function interpolateHeadingRadians(from, to, alpha) {
  const fraction = Math.min(1, Math.max(0, finite(alpha, 'alpha')));
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta * fraction;
}
