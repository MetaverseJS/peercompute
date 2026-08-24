import {
  applyPairAngularImpulse,
  applyPairImpulse,
  applyPairPositionImpulse,
  angularEffectiveMass,
  bodyPointVelocity,
  directionalEffectiveMass,
} from './bodyMath.js';
import {
  orthogonalTangent,
  vec3,
  vecAdd,
  vecCross,
  vecDot,
  vecLength,
  vecNormalize,
  vecProjectOnPlane,
  vecScale,
  vecSub,
} from './math.js';

function relativeVelocity(contact) {
  const velocityA = bodyPointVelocity(contact.bodyA, contact.pointA);
  const velocityB = contact.bodyB
    ? bodyPointVelocity(contact.bodyB, contact.pointB)
    : contact.surfaceVelocity;
  return vecSub(velocityA, velocityB);
}

function resolveTangents(contact, relative) {
  let longitudinal;
  if (contact.tangentLongitudinal) {
    const projected = vecProjectOnPlane(contact.tangentLongitudinal, contact.normal);
    longitudinal = vecNormalize(projected, orthogonalTangent(contact.normal));
  } else {
    const projected = vecProjectOnPlane(relative, contact.normal);
    longitudinal = vecLength(projected) > 1e-6
      ? vecNormalize(projected)
      : orthogonalTangent(contact.normal);
  }
  const lateral = vecNormalize(vecCross(contact.normal, longitudinal), [0, 0, 1]);
  return { longitudinal, lateral };
}

export function initializeContact(contact) {
  contact.normal = vecNormalize(contact.normal, [0, 1, 0]);
  contact.surfaceVelocity = vec3(contact.surfaceVelocity ?? [0, 0, 0]);
  contact.normalImpulse = 0;
  contact.longitudinalImpulse = 0;
  contact.lateralImpulse = 0;
  contact.rollingImpulse = 0;
  contact.muLongitudinal = Math.max(0, contact.muLongitudinal ?? contact.friction ?? 0.8);
  contact.muLateral = Math.max(0, contact.muLateral ?? contact.friction ?? 0.8);
  return contact;
}

export function solveContactVelocity(contact, dt, options) {
  const relative = relativeVelocity(contact);
  const normalSpeed = vecDot(relative, contact.normal);
  const normalMass = directionalEffectiveMass(
    contact.bodyA,
    contact.pointA,
    contact.bodyB,
    contact.pointB,
    contact.normal,
  );
  if (normalMass <= 0) return;

  let targetSpeed = 0;
  if (contact.penetration > options.contactSlop) {
    targetSpeed = Math.min(
      options.maxDepenetrationSpeed,
      options.baumgarte * (contact.penetration - options.contactSlop) / dt,
    );
  } else if (contact.separation > 0 && contact.separation < options.precontactMargin && normalSpeed < 0) {
    const closeness = 1 - contact.separation / options.precontactMargin;
    targetSpeed = options.precontactSpeed * closeness * closeness * closeness;
  }
  if (normalSpeed < -options.restitutionThreshold) {
    targetSpeed = Math.max(targetSpeed, -contact.restitution * normalSpeed);
  }
  const oldNormalImpulse = contact.normalImpulse;
  contact.normalImpulse = Math.max(0, oldNormalImpulse + (targetSpeed - normalSpeed) * normalMass);
  const normalDelta = contact.normalImpulse - oldNormalImpulse;
  if (normalDelta !== 0) {
    applyPairImpulse(
      contact.bodyA,
      contact.pointA,
      contact.bodyB,
      contact.pointB,
      vecScale(contact.normal, normalDelta),
    );
  }

  const frictionRelative = relativeVelocity(contact);
  const { longitudinal, lateral } = resolveTangents(contact, frictionRelative);
  contact.tangentLongitudinal = longitudinal;
  contact.tangentLateral = lateral;
  const longitudinalMass = directionalEffectiveMass(
    contact.bodyA,
    contact.pointA,
    contact.bodyB,
    contact.pointB,
    longitudinal,
  );
  const lateralMass = directionalEffectiveMass(
    contact.bodyA,
    contact.pointA,
    contact.bodyB,
    contact.pointB,
    lateral,
  );
  let nextLongitudinal = contact.longitudinalImpulse
    - vecDot(frictionRelative, longitudinal) * longitudinalMass;
  let nextLateral = contact.lateralImpulse
    - vecDot(frictionRelative, lateral) * lateralMass;
  const longLimit = contact.muLongitudinal * contact.normalImpulse;
  const lateralLimit = contact.muLateral * contact.normalImpulse;
  if (longLimit <= 0 || lateralLimit <= 0) {
    nextLongitudinal = 0;
    nextLateral = 0;
  } else {
    const ellipse = (nextLongitudinal * nextLongitudinal) / (longLimit * longLimit)
      + (nextLateral * nextLateral) / (lateralLimit * lateralLimit);
    if (ellipse > 1) {
      const scale = 1 / Math.sqrt(ellipse);
      nextLongitudinal *= scale;
      nextLateral *= scale;
    }
  }
  const frictionImpulse = vecAdd(
    vecScale(longitudinal, nextLongitudinal - contact.longitudinalImpulse),
    vecScale(lateral, nextLateral - contact.lateralImpulse),
  );
  contact.longitudinalImpulse = Math.fround(nextLongitudinal);
  contact.lateralImpulse = Math.fround(nextLateral);
  applyPairImpulse(contact.bodyA, contact.pointA, contact.bodyB, contact.pointB, frictionImpulse);

  const rollingLimit = contact.rollingFriction * contact.normalImpulse;
  if (rollingLimit > 0) {
    const relativeAngular = contact.bodyB
      ? vecSub(contact.bodyA.angularVelocity, contact.bodyB.angularVelocity)
      : contact.bodyA.angularVelocity;
    const rollingAxisRaw = vecProjectOnPlane(relativeAngular, contact.normal);
    const rollingSpeed = vecLength(rollingAxisRaw);
    if (rollingSpeed > 1e-6) {
      const rollingAxis = vecScale(rollingAxisRaw, 1 / rollingSpeed);
      const mass = angularEffectiveMass(contact.bodyA, contact.bodyB, rollingAxis);
      const next = Math.max(
        -rollingLimit,
        Math.min(rollingLimit, contact.rollingImpulse - rollingSpeed * mass),
      );
      const delta = next - contact.rollingImpulse;
      contact.rollingImpulse = Math.fround(next);
      applyPairAngularImpulse(contact.bodyA, contact.bodyB, vecScale(rollingAxis, delta));
    }
  }
}

export function correctContactPosition(contact, options) {
  const error = contact.penetration - options.contactSlop;
  if (error <= 0) return;
  const mass = directionalEffectiveMass(
    contact.bodyA,
    contact.pointA,
    contact.bodyB,
    contact.pointB,
    contact.normal,
  );
  if (mass <= 0) return;
  const correction = Math.min(options.maxPositionCorrection ?? 0.08, error * 0.55);
  applyPairPositionImpulse(
    contact.bodyA,
    contact.pointA,
    contact.bodyB,
    contact.pointB,
    vecScale(contact.normal, correction * mass),
  );
}

export function contactImpulseVector(contact, out = vec3()) {
  return vecAdd(
    vecScale(contact.normal, contact.normalImpulse),
    vecAdd(
      vecScale(contact.tangentLongitudinal ?? [0, 0, 0], contact.longitudinalImpulse),
      vecScale(contact.tangentLateral ?? [0, 0, 0], contact.lateralImpulse),
    ),
    out,
  );
}
