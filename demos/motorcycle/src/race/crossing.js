import { deepFreeze } from './constants.js';

function finiteNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  return value;
}

function finiteVector3(value, name) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${name} must be an [x, y, z] array.`);
  }
  return [
    finiteNumber(value[0], `${name}[0]`),
    finiteNumber(value[1], `${name}[1]`),
    finiteNumber(value[2], `${name}[2]`),
  ];
}

function normalizeOptions(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Gate crossing options must be an object.');
  }
  const planeEpsilonMeters = finiteNumber(options.planeEpsilonMeters ?? 1e-6, 'planeEpsilonMeters');
  const corridorEpsilonMeters = finiteNumber(options.corridorEpsilonMeters ?? 1e-6, 'corridorEpsilonMeters');
  if (planeEpsilonMeters <= 0 || planeEpsilonMeters > 1) {
    throw new RangeError('planeEpsilonMeters must be greater than zero and at most one meter.');
  }
  if (corridorEpsilonMeters < 0 || corridorEpsilonMeters > 10) {
    throw new RangeError('corridorEpsilonMeters must be between zero and ten meters.');
  }
  return { planeEpsilonMeters, corridorEpsilonMeters };
}

function normalizeGate(gate) {
  if (!gate || typeof gate !== 'object' || typeof gate.id !== 'string' || gate.id.length === 0) {
    throw new TypeError('A race gate with a stable id is required.');
  }
  const crossing = gate.crossing;
  if (!crossing || typeof crossing !== 'object' || crossing.direction !== 'forward-only') {
    throw new TypeError(`Gate ${gate.id} must expose a forward-only crossing corridor.`);
  }
  const point = finiteVector3(crossing.planePointLocal, `Gate ${gate.id} planePointLocal`);
  const normal = finiteVector3(crossing.planeNormalLocal, `Gate ${gate.id} planeNormalLocal`);
  const right = finiteVector3(crossing.corridorRightLocal, `Gate ${gate.id} corridorRightLocal`);
  const normalLength = Math.hypot(normal[0], normal[1], normal[2]);
  const rightLength = Math.hypot(right[0], right[1], right[2]);
  if (normalLength <= 1e-9 || rightLength <= 1e-9) {
    throw new RangeError(`Gate ${gate.id} crossing axes must have finite non-zero length.`);
  }
  const halfWidthMeters = finiteNumber(crossing.halfWidthMeters, `Gate ${gate.id} halfWidthMeters`);
  const minimumHeightMeters = finiteNumber(
    crossing.minimumHeightMeters,
    `Gate ${gate.id} minimumHeightMeters`,
  );
  const maximumHeightMeters = finiteNumber(
    crossing.maximumHeightMeters,
    `Gate ${gate.id} maximumHeightMeters`,
  );
  if (halfWidthMeters <= 0 || minimumHeightMeters >= maximumHeightMeters) {
    throw new RangeError(`Gate ${gate.id} crossing corridor dimensions are invalid.`);
  }
  return {
    point,
    normal: normal.map((component) => component / normalLength),
    right: right.map((component) => component / rightLength),
    halfWidthMeters,
    minimumHeightMeters,
    maximumHeightMeters,
  };
}

function dotOffset(position, origin, direction) {
  return (position[0] - origin[0]) * direction[0]
    + (position[1] - origin[1]) * direction[1]
    + (position[2] - origin[2]) * direction[2];
}

/**
 * Inspect a swept point against a gate plane and bounded gate corridor.
 * Reverse travel and motion that does not cross the plane return null.
 */
export function inspectGateCrossing(gate, previousLocalPosition, currentLocalPosition, options = {}) {
  const config = normalizeOptions(options);
  const normalizedGate = normalizeGate(gate);
  const from = finiteVector3(previousLocalPosition, 'previousLocalPosition');
  const to = finiteVector3(currentLocalPosition, 'currentLocalPosition');
  const fromSignedDistance = dotOffset(from, normalizedGate.point, normalizedGate.normal);
  const toSignedDistance = dotOffset(to, normalizedGate.point, normalizedGate.normal);

  if (fromSignedDistance >= -config.planeEpsilonMeters || toSignedDistance < 0) return null;
  const signedTravel = toSignedDistance - fromSignedDistance;
  if (signedTravel <= config.planeEpsilonMeters) return null;
  const alpha = -fromSignedDistance / signedTravel;
  if (alpha < 0 || alpha > 1) return null;
  const pointLocal = [
    from[0] + (to[0] - from[0]) * alpha,
    from[1] + (to[1] - from[1]) * alpha,
    from[2] + (to[2] - from[2]) * alpha,
  ];
  const lateralMeters = dotOffset(pointLocal, normalizedGate.point, normalizedGate.right);
  const heightMeters = pointLocal[1] - normalizedGate.point[1];
  const withinLateral = Math.abs(lateralMeters)
    <= normalizedGate.halfWidthMeters + config.corridorEpsilonMeters;
  const withinHeight = heightMeters
    >= normalizedGate.minimumHeightMeters - config.corridorEpsilonMeters
    && heightMeters <= normalizedGate.maximumHeightMeters + config.corridorEpsilonMeters;
  return deepFreeze({
    gateId: gate.id,
    gateOrder: gate.order,
    status: withinLateral && withinHeight ? 'crossed' : 'missed-corridor',
    alpha,
    pointLocal,
    fromSignedDistance,
    toSignedDistance,
    lateralMeters,
    heightMeters,
    withinLateral,
    withinHeight,
  });
}

/** Return only successful forward corridor crossings. */
export function detectGateCrossing(gate, previousLocalPosition, currentLocalPosition, options = {}) {
  const result = inspectGateCrossing(gate, previousLocalPosition, currentLocalPosition, options);
  return result?.status === 'crossed' ? result : null;
}
