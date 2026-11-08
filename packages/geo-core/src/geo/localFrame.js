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

function tuple4(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length !== 4) {
    throw new TypeError(`${label} must be a four-value quaternion.`);
  }
  return Array.from(value, (entry, index) => finite(entry, `${label}[${index}]`));
}

function dot3(left, right) {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function multiplyMatrixVector(matrix, value) {
  return [
    matrix[0] * value[0] + matrix[1] * value[1] + matrix[2] * value[2],
    matrix[3] * value[0] + matrix[4] * value[1] + matrix[5] * value[2],
    matrix[6] * value[0] + matrix[7] * value[1] + matrix[8] * value[2]
  ];
}

function normalizeQuaternion(value, label) {
  const result = tuple4(value, label);
  const length = Math.hypot(...result);
  if (length <= 1e-12) throw new RangeError(`${label} must have non-zero length.`);
  for (let index = 0; index < 4; index += 1) result[index] /= length;
  if (result[3] < 0) {
    for (let index = 0; index < 4; index += 1) result[index] = -result[index];
  }
  return result;
}

function multiplyQuaternion(left, right) {
  const [leftX, leftY, leftZ, leftW] = left;
  const [rightX, rightY, rightZ, rightW] = right;
  return [
    leftW * rightX + leftX * rightW + leftY * rightZ - leftZ * rightY,
    leftW * rightY - leftX * rightZ + leftY * rightW + leftZ * rightX,
    leftW * rightZ + leftX * rightY - leftY * rightX + leftZ * rightW,
    leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ
  ];
}

function quaternionFromRotationMatrix(matrix) {
  const trace = matrix[0] + matrix[4] + matrix[8];
  let quaternion;
  if (trace > 0) {
    const scale = Math.sqrt(trace + 1) * 2;
    quaternion = [
      (matrix[7] - matrix[5]) / scale,
      (matrix[2] - matrix[6]) / scale,
      (matrix[3] - matrix[1]) / scale,
      scale / 4
    ];
  } else if (matrix[0] > matrix[4] && matrix[0] > matrix[8]) {
    const scale = Math.sqrt(1 + matrix[0] - matrix[4] - matrix[8]) * 2;
    quaternion = [
      scale / 4,
      (matrix[1] + matrix[3]) / scale,
      (matrix[2] + matrix[6]) / scale,
      (matrix[7] - matrix[5]) / scale
    ];
  } else if (matrix[4] > matrix[8]) {
    const scale = Math.sqrt(1 + matrix[4] - matrix[0] - matrix[8]) * 2;
    quaternion = [
      (matrix[1] + matrix[3]) / scale,
      scale / 4,
      (matrix[5] + matrix[7]) / scale,
      (matrix[2] - matrix[6]) / scale
    ];
  } else {
    const scale = Math.sqrt(1 + matrix[8] - matrix[0] - matrix[4]) * 2;
    quaternion = [
      (matrix[2] + matrix[6]) / scale,
      (matrix[5] + matrix[7]) / scale,
      scale / 4,
      (matrix[3] - matrix[1]) / scale
    ];
  }
  return normalizeQuaternion(quaternion, 'ENU frame rotation quaternion');
}

function validatedEnuFrame(frame, label) {
  if (frame?.schema !== 'peercompute.geo.local-enu-frame.v1') {
    throw new TypeError(`${label} must be a peercompute.geo.local-enu-frame.v1 frame.`);
  }
  return {
    origin: Object.freeze({
      longitude: finite(frame.origin?.longitude, `${label} origin longitude`),
      latitude: finite(frame.origin?.latitude, `${label} origin latitude`),
      height: finite(frame.origin?.height, `${label} origin height`)
    }),
    originEcef: tuple3(frame.originEcef, `${label} originEcef`),
    axes: [
      tuple3(frame.axes?.east, `${label} east axis`),
      tuple3(frame.axes?.up, `${label} up axis`),
      tuple3(frame.axes?.south, `${label} south axis`)
    ]
  };
}

function createFrozenFrameTransform({
  fromOrigin,
  toOrigin,
  rotation,
  translation
}) {
  const frozenRotation = Object.freeze(tuple3(rotation.slice(0, 3), 'rotation row 0')
    .concat(tuple3(rotation.slice(3, 6), 'rotation row 1'))
    .concat(tuple3(rotation.slice(6, 9), 'rotation row 2')));
  const frozenTranslation = Object.freeze(tuple3(translation, 'translation'));
  const rotationQuaternion = Object.freeze(quaternionFromRotationMatrix(frozenRotation));
  const transformVector = (value) => Object.freeze(multiplyMatrixVector(
    frozenRotation,
    tuple3(value, 'vector')
  ));
  const transformPoint = (value) => {
    const rotated = multiplyMatrixVector(frozenRotation, tuple3(value, 'point'));
    return Object.freeze(rotated.map((entry, index) => entry + frozenTranslation[index]));
  };
  const transformOrientation = (value) => Object.freeze(normalizeQuaternion(
    multiplyQuaternion(
      rotationQuaternion,
      normalizeQuaternion(value, 'orientation')
    ),
    'transformed orientation'
  ));
  return {
    schema: 'peercompute.geo.enu-frame-transform.v1',
    fromOrigin,
    toOrigin,
    rotation: frozenRotation,
    translation: frozenTranslation,
    rotationQuaternion,
    transformPoint,
    transformVector,
    transformOrientation,
    inverse: null
  };
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

/**
 * Builds the exact rigid coordinate change between two local east/up/south
 * frames. `rotation` is row-major and `translation` satisfies
 * `pointTo = rotation * pointFrom + translation`.
 *
 * Orientations use `[x, y, z, w]` quaternions that rotate body-local vectors
 * into the source frame. `transformOrientation` left-composes the frame
 * rotation, returning the same physical body orientation in the destination
 * frame.
 */
export function createEnuFrameTransform(fromFrame, toFrame) {
  const from = validatedEnuFrame(fromFrame, 'Source ENU frame');
  const to = validatedEnuFrame(toFrame, 'Destination ENU frame');
  const rotation = [];
  for (const toAxis of to.axes) {
    for (const fromAxis of from.axes) rotation.push(dot3(toAxis, fromAxis));
  }
  const originDelta = from.originEcef.map((entry, index) => entry - to.originEcef[index]);
  const translation = to.axes.map((axis) => dot3(axis, originDelta));
  const inverseRotation = [
    rotation[0], rotation[3], rotation[6],
    rotation[1], rotation[4], rotation[7],
    rotation[2], rotation[5], rotation[8]
  ];
  const inverseTranslation = multiplyMatrixVector(inverseRotation, translation)
    .map((entry) => -entry);
  const forward = createFrozenFrameTransform({
    fromOrigin: from.origin,
    toOrigin: to.origin,
    rotation,
    translation
  });
  const inverse = createFrozenFrameTransform({
    fromOrigin: to.origin,
    toOrigin: from.origin,
    rotation: inverseRotation,
    translation: inverseTranslation
  });
  forward.inverse = inverse;
  inverse.inverse = forward;
  Object.freeze(inverse);
  return Object.freeze(forward);
}

export function rebaseLocalPoint(localPoint, fromFrame, toFrame) {
  if (typeof fromFrame?.localToEcef !== 'function' || typeof toFrame?.ecefToLocal !== 'function') {
    throw new TypeError('Both source and destination ENU frames are required.');
  }
  return toFrame.ecefToLocal(fromFrame.localToEcef(localPoint));
}
