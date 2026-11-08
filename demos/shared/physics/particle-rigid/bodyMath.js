import {
  mat3MulVec,
  quatIntegrateWorld,
  quatRotate,
  rotateTensor,
  vec3,
  vecAdd,
  vecCross,
  vecDot,
  vecScale,
  vecSub,
} from './math.js';

const F = Math.fround;
const inverseInertiaWorldCache = new WeakMap();

function createInverseInertiaWorldCache() {
  return {
    motionType: null,
    orientation: new Float64Array(4),
    inverseInertia: new Float64Array(9),
    rotation: new Float32Array(9),
    transpose: new Float32Array(9),
    intermediate: new Float32Array(9),
    world: new Float32Array(9),
    valid: false,
  };
}

function valuesMatch(value, snapshot, length) {
  if (!value) return false;
  for (let index = 0; index < length; index += 1) {
    if (!Object.is(value[index], snapshot[index])) return false;
  }
  return true;
}

function snapshotValues(value, snapshot, length) {
  for (let index = 0; index < length; index += 1) snapshot[index] = value[index];
}

function multiplyMat3(a, b, out) {
  for (let row = 0; row < 3; row += 1) {
    const offset = row * 3;
    for (let column = 0; column < 3; column += 1) {
      out[offset + column] = F(
        a[offset] * b[column]
        + a[offset + 1] * b[column + 3]
        + a[offset + 2] * b[column + 6],
      );
    }
  }
}

function rotateInverseInertia(cache) {
  const x = cache.orientation[0];
  const y = cache.orientation[1];
  const z = cache.orientation[2];
  const w = cache.orientation[3];
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const xy = x * y;
  const xz = x * z;
  const yz = y * z;
  const wx = w * x;
  const wy = w * y;
  const wz = w * z;
  const rotation = cache.rotation;
  rotation[0] = F(1 - 2 * (yy + zz));
  rotation[1] = F(2 * (xy - wz));
  rotation[2] = F(2 * (xz + wy));
  rotation[3] = F(2 * (xy + wz));
  rotation[4] = F(1 - 2 * (xx + zz));
  rotation[5] = F(2 * (yz - wx));
  rotation[6] = F(2 * (xz - wy));
  rotation[7] = F(2 * (yz + wx));
  rotation[8] = F(1 - 2 * (xx + yy));

  const transpose = cache.transpose;
  transpose[0] = rotation[0];
  transpose[1] = rotation[3];
  transpose[2] = rotation[6];
  transpose[3] = rotation[1];
  transpose[4] = rotation[4];
  transpose[5] = rotation[7];
  transpose[6] = rotation[2];
  transpose[7] = rotation[5];
  transpose[8] = rotation[8];
  multiplyMat3(rotation, cache.inverseInertia, cache.intermediate);
  multiplyMat3(cache.intermediate, transpose, cache.world);
}

function cachedInverseInertiaWorld(body) {
  let cache = inverseInertiaWorldCache.get(body);
  if (!cache) {
    cache = createInverseInertiaWorldCache();
    inverseInertiaWorldCache.set(body, cache);
  }
  const dynamic = body.motionType === 'dynamic';
  const sourceIsCurrent = cache.valid
    && cache.motionType === body.motionType
    && (!dynamic || (
      valuesMatch(body.predictedOrientation, cache.orientation, 4)
      && valuesMatch(body.inverseInertia, cache.inverseInertia, 9)
    ));
  if (!sourceIsCurrent) {
    cache.motionType = body.motionType;
    if (dynamic) {
      snapshotValues(body.predictedOrientation, cache.orientation, 4);
      snapshotValues(body.inverseInertia, cache.inverseInertia, 9);
      rotateInverseInertia(cache);
    } else {
      cache.world.fill(0);
    }
    cache.valid = true;
  }
  return cache.world;
}

export function bodyWorldPoint(body, localPoint, predicted = true, out = vec3()) {
  const orientation = predicted ? body.predictedOrientation : body.orientation;
  const position = predicted ? body.predictedPosition : body.position;
  return vecAdd(position, quatRotate(orientation, localPoint), out);
}

export function bodyWorldVector(body, localVector, predicted = true, out = vec3()) {
  return quatRotate(predicted ? body.predictedOrientation : body.orientation, localVector, out);
}

export function bodyInverseInertiaWorld(body, out = new Float32Array(9)) {
  const cached = cachedInverseInertiaWorld(body);
  for (let index = 0; index < 9; index += 1) out[index] = cached[index];
  return out;
}

export function bodyInertiaWorld(body, out = new Float32Array(9)) {
  return rotateTensor(body.inertia, body.predictedOrientation, out);
}

export function bodyPointVelocity(body, worldPoint, out = vec3()) {
  const relative = vecSub(worldPoint, body.predictedPosition);
  return vecAdd(body.linearVelocity, vecCross(body.angularVelocity, relative), out);
}

export function applyBodyImpulse(body, impulse, worldPoint) {
  if (!body || body.motionType !== 'dynamic') return;
  body.linearVelocity[0] = Math.fround(body.linearVelocity[0] + impulse[0] * body.inverseMass);
  body.linearVelocity[1] = Math.fround(body.linearVelocity[1] + impulse[1] * body.inverseMass);
  body.linearVelocity[2] = Math.fround(body.linearVelocity[2] + impulse[2] * body.inverseMass);
  const relative = vecSub(worldPoint, body.predictedPosition);
  const angularImpulse = vecCross(relative, impulse);
  const angularDelta = mat3MulVec(cachedInverseInertiaWorld(body), angularImpulse);
  body.angularVelocity[0] = Math.fround(body.angularVelocity[0] + angularDelta[0]);
  body.angularVelocity[1] = Math.fround(body.angularVelocity[1] + angularDelta[1]);
  body.angularVelocity[2] = Math.fround(body.angularVelocity[2] + angularDelta[2]);
}

export function applyBodyAngularImpulse(body, impulse) {
  if (!body || body.motionType !== 'dynamic') return;
  const delta = mat3MulVec(cachedInverseInertiaWorld(body), impulse);
  body.angularVelocity[0] = Math.fround(body.angularVelocity[0] + delta[0]);
  body.angularVelocity[1] = Math.fround(body.angularVelocity[1] + delta[1]);
  body.angularVelocity[2] = Math.fround(body.angularVelocity[2] + delta[2]);
}

export function applyBodyAngularPositionImpulse(body, impulse) {
  if (!body || body.motionType !== 'dynamic') return;
  const angularDelta = mat3MulVec(cachedInverseInertiaWorld(body), impulse);
  quatIntegrateWorld(
    body.predictedOrientation,
    angularDelta,
    1,
    body.predictedOrientation,
  );
}

export function directionalEffectiveMass(bodyA, pointA, bodyB, pointB, direction) {
  let inverseEffectiveMass = 0;
  if (bodyA?.motionType === 'dynamic') {
    const rA = vecSub(pointA, bodyA.predictedPosition);
    const crossA = vecCross(rA, direction);
    const angularA = mat3MulVec(cachedInverseInertiaWorld(bodyA), crossA);
    inverseEffectiveMass += bodyA.inverseMass + vecDot(direction, vecCross(angularA, rA));
  }
  if (bodyB?.motionType === 'dynamic') {
    const rB = vecSub(pointB, bodyB.predictedPosition);
    const crossB = vecCross(rB, direction);
    const angularB = mat3MulVec(cachedInverseInertiaWorld(bodyB), crossB);
    inverseEffectiveMass += bodyB.inverseMass + vecDot(direction, vecCross(angularB, rB));
  }
  return inverseEffectiveMass > 1e-8 ? 1 / inverseEffectiveMass : 0;
}

export function angularEffectiveMass(bodyA, bodyB, axis) {
  let inverseEffectiveMass = 0;
  if (bodyA?.motionType === 'dynamic') {
    inverseEffectiveMass += vecDot(axis, mat3MulVec(cachedInverseInertiaWorld(bodyA), axis));
  }
  if (bodyB?.motionType === 'dynamic') {
    inverseEffectiveMass += vecDot(axis, mat3MulVec(cachedInverseInertiaWorld(bodyB), axis));
  }
  return inverseEffectiveMass > 1e-8 ? 1 / inverseEffectiveMass : 0;
}

export function applyPairImpulse(bodyA, pointA, bodyB, pointB, impulseOnA) {
  applyBodyImpulse(bodyA, impulseOnA, pointA);
  if (bodyB) applyBodyImpulse(bodyB, vecScale(impulseOnA, -1), pointB);
}

export function applyPairAngularImpulse(bodyA, bodyB, impulseOnA) {
  applyBodyAngularImpulse(bodyA, impulseOnA);
  if (bodyB) applyBodyAngularImpulse(bodyB, vecScale(impulseOnA, -1));
}

export function applyPairAngularPositionImpulse(bodyA, bodyB, impulseOnA) {
  applyBodyAngularPositionImpulse(bodyA, impulseOnA);
  if (bodyB) applyBodyAngularPositionImpulse(bodyB, vecScale(impulseOnA, -1));
}

export function applyBodyPositionImpulse(body, impulse, worldPoint) {
  if (!body || body.motionType !== 'dynamic') return;
  body.predictedPosition[0] = Math.fround(body.predictedPosition[0] + impulse[0] * body.inverseMass);
  body.predictedPosition[1] = Math.fround(body.predictedPosition[1] + impulse[1] * body.inverseMass);
  body.predictedPosition[2] = Math.fround(body.predictedPosition[2] + impulse[2] * body.inverseMass);
  const relative = vecSub(worldPoint, body.predictedPosition);
  const angularImpulse = vecCross(relative, impulse);
  const angularDelta = mat3MulVec(cachedInverseInertiaWorld(body), angularImpulse);
  quatIntegrateWorld(body.predictedOrientation, angularDelta, 1, body.predictedOrientation);
}

export function applyPairPositionImpulse(bodyA, pointA, bodyB, pointB, impulseOnA) {
  applyBodyPositionImpulse(bodyA, impulseOnA, pointA);
  if (bodyB) applyBodyPositionImpulse(bodyB, vecScale(impulseOnA, -1), pointB);
}
