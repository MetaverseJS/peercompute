const WGS84_A = 6_378_137;
const WGS84_F = 1 / 298.257223563;
const WGS84_B = WGS84_A * (1 - WGS84_F);
const WGS84_E2 = WGS84_F * (2 - WGS84_F);
const WGS84_EP2 = (WGS84_A ** 2 - WGS84_B ** 2) / WGS84_B ** 2;
const DEG = Math.PI / 180;

function finite(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
}

function tuple3(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length !== 3) {
    throw new TypeError(`${label} must be a three-value vector.`);
  }
  return Array.from(value, (entry, index) => finite(entry, `${label}[${index}]`));
}

export function geodeticToEcef({ longitude, latitude, height = 0 }) {
  const lonDegrees = finite(longitude, 'longitude');
  const latDegrees = finite(latitude, 'latitude');
  const altitude = finite(height, 'height');
  if (lonDegrees < -180 || lonDegrees > 180 || latDegrees < -90 || latDegrees > 90) {
    throw new RangeError('Geodetic coordinate is outside WGS84 bounds.');
  }
  const longitudeRadians = lonDegrees * DEG;
  const latitudeRadians = latDegrees * DEG;
  const sinLatitude = Math.sin(latitudeRadians);
  const cosLatitude = Math.cos(latitudeRadians);
  const normal = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLatitude * sinLatitude);
  return [
    (normal + altitude) * cosLatitude * Math.cos(longitudeRadians),
    (normal + altitude) * cosLatitude * Math.sin(longitudeRadians),
    (normal * (1 - WGS84_E2) + altitude) * sinLatitude
  ];
}

export function ecefToGeodetic(value) {
  const [x, y, z] = tuple3(value, 'ecef');
  const p = Math.hypot(x, y);
  if (p < 1e-9) {
    return {
      longitude: 0,
      latitude: z >= 0 ? 90 : -90,
      height: Math.abs(z) - WGS84_B
    };
  }
  const theta = Math.atan2(z * WGS84_A, p * WGS84_B);
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const latitude = Math.atan2(
    z + WGS84_EP2 * WGS84_B * sinTheta ** 3,
    p - WGS84_E2 * WGS84_A * cosTheta ** 3
  );
  const longitude = Math.atan2(y, x);
  const sinLatitude = Math.sin(latitude);
  const normal = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLatitude * sinLatitude);
  const height = p / Math.cos(latitude) - normal;
  return {
    longitude: longitude / DEG,
    latitude: latitude / DEG,
    height
  };
}

export function createLocalEnuFrame(origin) {
  const longitude = finite(origin?.longitude, 'origin longitude');
  const latitude = finite(origin?.latitude, 'origin latitude');
  const height = finite(origin?.height ?? 0, 'origin height');
  const originEcef = geodeticToEcef({ longitude, latitude, height });
  const lon = longitude * DEG;
  const lat = latitude * DEG;
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const east = [-sinLon, cosLon, 0];
  const north = [-sinLat * cosLon, -sinLat * sinLon, cosLat];
  const up = [cosLat * cosLon, cosLat * sinLon, sinLat];

  const toEnuFromEcef = (ecef) => {
    const coordinate = tuple3(ecef, 'ecef');
    const delta = coordinate.map((entry, index) => entry - originEcef[index]);
    return [
      delta[0] * east[0] + delta[1] * east[1] + delta[2] * east[2],
      delta[0] * up[0] + delta[1] * up[1] + delta[2] * up[2],
      -(delta[0] * north[0] + delta[1] * north[1] + delta[2] * north[2])
    ];
  };

  const toEcefFromEnu = (enu) => {
    const [eastMeters, upMeters, southMeters] = tuple3(enu, 'enu');
    const northMeters = -southMeters;
    return [0, 1, 2].map((index) => originEcef[index]
      + eastMeters * east[index]
      + northMeters * north[index]
      + upMeters * up[index]);
  };

  return Object.freeze({
    schema: 'peercompute.geo.local-enu-frame.v1',
    origin: Object.freeze({ longitude, latitude, height }),
    originEcef: Object.freeze([...originEcef]),
    axes: Object.freeze({
      east: Object.freeze([...east]),
      up: Object.freeze([...up]),
      south: Object.freeze(north.map((entry) => -entry))
    }),
    toLocal({ longitude: targetLongitude, latitude: targetLatitude, height: targetHeight = 0 }) {
      return toEnuFromEcef(geodeticToEcef({
        longitude: targetLongitude,
        latitude: targetLatitude,
        height: targetHeight
      }));
    },
    fromLocal(local) {
      return ecefToGeodetic(toEcefFromEnu(local));
    },
    ecefToLocal: toEnuFromEcef,
    localToEcef: toEcefFromEnu
  });
}

export function rebaseLocalPoint(localPoint, fromFrame, toFrame) {
  if (typeof fromFrame?.localToEcef !== 'function' || typeof toFrame?.ecefToLocal !== 'function') {
    throw new TypeError('Both source and destination ENU frames are required.');
  }
  return toFrame.ecefToLocal(fromFrame.localToEcef(localPoint));
}
