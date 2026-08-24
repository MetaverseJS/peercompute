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

export function bodyWorldPoint(body, localPoint, predicted = true, out = vec3()) {
  const orientation = predicted ? body.predictedOrientation : body.orientation;
  const position = predicted ? body.predictedPosition : body.position;
  return vecAdd(position, quatRotate(orientation, localPoint), out);
}

export function bodyWorldVector(body, localVector, predicted = true, out = vec3()) {
  return quatRotate(predicted ? body.predictedOrientation : body.orientation, localVector, out);
}

export function bodyInverseInertiaWorld(body, out = new Float32Array(9)) {
  if (body.motionType !== 'dynamic') {
    out.fill(0);
    return out;
  }
  return rotateTensor(body.inverseInertia, body.predictedOrientation, out);
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
  const angularDelta = mat3MulVec(bodyInverseInertiaWorld(body), angularImpulse);
  body.angularVelocity[0] = Math.fround(body.angularVelocity[0] + angularDelta[0]);
  body.angularVelocity[1] = Math.fround(body.angularVelocity[1] + angularDelta[1]);
  body.angularVelocity[2] = Math.fround(body.angularVelocity[2] + angularDelta[2]);
}

export function applyBodyAngularImpulse(body, impulse) {
  if (!body || body.motionType !== 'dynamic') return;
  const delta = mat3MulVec(bodyInverseInertiaWorld(body), impulse);
  body.angularVelocity[0] = Math.fround(body.angularVelocity[0] + delta[0]);
  body.angularVelocity[1] = Math.fround(body.angularVelocity[1] + delta[1]);
  body.angularVelocity[2] = Math.fround(body.angularVelocity[2] + delta[2]);
}

export function applyBodyAngularPositionImpulse(body, impulse) {
  if (!body || body.motionType !== 'dynamic') return;
  const angularDelta = mat3MulVec(bodyInverseInertiaWorld(body), impulse);
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
    const angularA = mat3MulVec(bodyInverseInertiaWorld(bodyA), crossA);
    inverseEffectiveMass += bodyA.inverseMass + vecDot(direction, vecCross(angularA, rA));
  }
  if (bodyB?.motionType === 'dynamic') {
    const rB = vecSub(pointB, bodyB.predictedPosition);
    const crossB = vecCross(rB, direction);
    const angularB = mat3MulVec(bodyInverseInertiaWorld(bodyB), crossB);
    inverseEffectiveMass += bodyB.inverseMass + vecDot(direction, vecCross(angularB, rB));
  }
  return inverseEffectiveMass > 1e-8 ? 1 / inverseEffectiveMass : 0;
}

export function angularEffectiveMass(bodyA, bodyB, axis) {
  let inverseEffectiveMass = 0;
  if (bodyA?.motionType === 'dynamic') {
    inverseEffectiveMass += vecDot(axis, mat3MulVec(bodyInverseInertiaWorld(bodyA), axis));
  }
  if (bodyB?.motionType === 'dynamic') {
    inverseEffectiveMass += vecDot(axis, mat3MulVec(bodyInverseInertiaWorld(bodyB), axis));
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
  const angularDelta = mat3MulVec(bodyInverseInertiaWorld(body), angularImpulse);
  quatIntegrateWorld(body.predictedOrientation, angularDelta, 1, body.predictedOrientation);
}

export function applyPairPositionImpulse(bodyA, pointA, bodyB, pointB, impulseOnA) {
  applyBodyPositionImpulse(bodyA, impulseOnA, pointA);
  if (bodyB) applyBodyPositionImpulse(bodyB, vecScale(impulseOnA, -1), pointB);
}
