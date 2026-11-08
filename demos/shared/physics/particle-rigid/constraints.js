import {
  angularEffectiveMass,
  applyPairAngularPositionImpulse,
  applyPairAngularImpulse,
  applyPairImpulse,
  applyPairPositionImpulse,
  bodyPointVelocity,
  bodyWorldPoint,
  bodyWorldVector,
  directionalEffectiveMass,
} from './bodyMath.js';
import {
  orthogonalTangent,
  quatConjugate,
  quatDeltaVector,
  quatMultiply,
  quatRotate,
  quatToRotationVector,
  vec3,
  vecCross,
  vecDot,
  vecLength,
  vecNormalize,
  vecScale,
  vecSub,
} from './math.js';

function anchorWorld(body, localAnchor) {
  return body ? bodyWorldPoint(body, localAnchor) : vec3(localAnchor);
}

function axisWorld(body, localAxis) {
  return body ? bodyWorldVector(body, localAxis) : vecNormalize(vec3(localAxis));
}

function pointVelocity(body, point) {
  return body ? bodyPointVelocity(body, point) : vec3();
}

function angularVelocity(body) {
  return body?.angularVelocity ?? vec3();
}

function compliantMass(baseMass, compliance, dt) {
  if (baseMass <= 0) return 0;
  return 1 / (1 / baseMass + compliance / (dt * dt));
}

function solveLinearAxis(joint, bodyA, pointA, bodyB, pointB, axis, error, dt, options, clamp = null) {
  let mass = directionalEffectiveMass(bodyA, pointA, bodyB, pointB, axis);
  mass = compliantMass(mass, joint.compliance, dt);
  if (mass <= 0) return 0;
  const relative = vecSub(pointVelocity(bodyA, pointA), pointVelocity(bodyB, pointB));
  const targetSpeed = -options.baumgarte * error / dt;
  let impulse = (targetSpeed - vecDot(relative, axis)) * mass;
  if (clamp) impulse = Math.min(clamp.max, Math.max(clamp.min, impulse));
  applyPairImpulse(bodyA, pointA, bodyB, pointB, vecScale(axis, impulse));
  return impulse;
}

function solveAngularAxis(joint, bodyA, bodyB, axis, error, dt, options, targetVelocity = 0, clamp = null) {
  let mass = angularEffectiveMass(bodyA, bodyB, axis);
  mass = compliantMass(mass, joint.compliance, dt);
  if (mass <= 0) return 0;
  const relativeSpeed = vecDot(vecSub(angularVelocity(bodyA), angularVelocity(bodyB)), axis);
  const bias = -options.baumgarte * error / dt;
  let impulse = (targetVelocity + bias - relativeSpeed) * mass;
  if (clamp) impulse = Math.min(clamp.max, Math.max(clamp.min, impulse));
  applyPairAngularImpulse(bodyA, bodyB, vecScale(axis, impulse));
  return impulse;
}

function orientationError(joint, bodyA, bodyB) {
  const orientationB = bodyB?.predictedOrientation ?? new Float32Array([0, 0, 0, 1]);
  const inverseB = quatConjugate(orientationB, new Float32Array(4));
  const current = quatMultiply(bodyA.predictedOrientation, inverseB, new Float32Array(4));
  const inverseInitial = quatConjugate(joint.runtime.initialRelativeOrientation, new Float32Array(4));
  return quatToRotationVector(quatMultiply(current, inverseInitial, new Float32Array(4)));
}

function hingeAngle(joint, bodyA, bodyB, hingeAxis) {
  const referenceA = bodyWorldVector(bodyA, joint.runtime.referenceA);
  const referenceB = bodyB
    ? bodyWorldVector(bodyB, joint.runtime.referenceB)
    : vec3(joint.runtime.referenceB);
  const cross = vecCross(referenceB, referenceA);
  return Math.atan2(vecDot(hingeAxis, cross), vecDot(referenceA, referenceB));
}

function correctHingeLimitPosition(joint, bodyA, bodyB) {
  const hingeAxis = axisWorld(bodyA, joint.localAxisA);
  const angle = hingeAngle(joint, bodyA, bodyB, hingeAxis);
  const target = joint.min !== null && angle < joint.min
    ? joint.min
    : joint.max !== null && angle > joint.max
      ? joint.max
      : null;
  if (target !== null) {
    const mass = angularEffectiveMass(bodyA, bodyB, hingeAxis);
    applyPairAngularPositionImpulse(
      bodyA,
      bodyB,
      vecScale(hingeAxis, -(angle - target) * mass),
    );
  }
  joint.runtime.angle = Math.fround(hingeAngle(
    joint,
    bodyA,
    bodyB,
    axisWorld(bodyA, joint.localAxisA),
  ));
}

function correctPrismaticLimitPosition(joint, bodyA, bodyB) {
  const pointA = anchorWorld(bodyA, joint.localAnchorA);
  const pointB = anchorWorld(bodyB, joint.localAnchorB);
  const axis = axisWorld(bodyA, joint.localAxisA);
  const translation = vecDot(vecSub(pointA, pointB), axis);
  const target = joint.min !== null && translation < joint.min
    ? joint.min
    : joint.max !== null && translation > joint.max
      ? joint.max
      : null;
  if (target !== null) {
    const mass = directionalEffectiveMass(bodyA, pointA, bodyB, pointB, axis);
    applyPairPositionImpulse(
      bodyA,
      pointA,
      bodyB,
      pointB,
      vecScale(axis, -(translation - target) * mass),
    );
  }
  const correctedPointA = anchorWorld(bodyA, joint.localAnchorA);
  const correctedPointB = anchorWorld(bodyB, joint.localAnchorB);
  joint.runtime.position = Math.fround(vecDot(
    vecSub(correctedPointA, correctedPointB),
    axisWorld(bodyA, joint.localAxisA),
  ));
}

export function initializeJointRuntime(joint, bodyA, bodyB) {
  const pointA = anchorWorld(bodyA, joint.localAnchorA);
  const pointB = anchorWorld(bodyB, joint.localAnchorB);
  const orientationB = bodyB?.orientation ?? new Float32Array([0, 0, 0, 1]);
  joint.runtime = {
    restLength: joint.restLength ?? vecLength(vecSub(pointA, pointB)),
    referenceA: orthogonalTangent(joint.localAxisA),
    referenceB: null,
    initialRelativeOrientation: quatMultiply(
      bodyA.orientation,
      quatConjugate(orientationB, new Float32Array(4)),
      new Float32Array(4),
    ),
    motorImpulse: 0,
    position: 0,
    angle: 0,
    springForce: 0,
  };
  const worldReferenceA = quatRotate(bodyA.orientation, joint.runtime.referenceA);
  joint.runtime.referenceB = bodyB
    ? quatRotate(quatConjugate(bodyB.orientation, new Float32Array(4)), worldReferenceA)
    : vec3(worldReferenceA);
}

export function beginJointStep(joint, bodyA, bodyB, dt) {
  joint.runtime.motorImpulse = 0;
  joint.runtime.springForce = 0;
  if (!joint.enabled || joint.type !== 'spring') return;
  const pointA = anchorWorld(bodyA, joint.localAnchorA);
  const pointB = anchorWorld(bodyB, joint.localAnchorB);
  const delta = vecSub(pointA, pointB);
  const length = vecLength(delta);
  if (length <= 1e-7) return;
  const axis = vecScale(delta, 1 / length);
  const relativeVelocity = vecSub(pointVelocity(bodyA, pointA), pointVelocity(bodyB, pointB));
  const stretch = length - joint.runtime.restLength;
  const speed = vecDot(relativeVelocity, axis);
  const force = -joint.stiffness * stretch - joint.damping * speed;
  joint.runtime.springForce = Math.fround(force);
  applyPairImpulse(bodyA, pointA, bodyB, pointB, vecScale(axis, force * dt));
}

export function solveJointVelocity(joint, bodyA, bodyB, dt, options) {
  if (!joint.enabled || joint.type === 'spring') return;
  const pointA = anchorWorld(bodyA, joint.localAnchorA);
  const pointB = anchorWorld(bodyB, joint.localAnchorB);
  const delta = vecSub(pointA, pointB);
  const worldAxes = [vec3([1, 0, 0]), vec3([0, 1, 0]), vec3([0, 0, 1])];

  if (joint.type === 'hinge' || joint.type === 'fixed') {
    for (const axis of worldAxes) {
      solveLinearAxis(joint, bodyA, pointA, bodyB, pointB, axis, vecDot(delta, axis), dt, options);
    }
  }

  if (joint.type === 'distance') {
    const distance = vecLength(delta);
    if (distance > 1e-7) {
      const axis = vecScale(delta, 1 / distance);
      solveLinearAxis(
        joint,
        bodyA,
        pointA,
        bodyB,
        pointB,
        axis,
        distance - joint.runtime.restLength,
        dt,
        options,
      );
    }
  }

  if (joint.type === 'hinge') {
    const axisA = axisWorld(bodyA, joint.localAxisA);
    const axisB = axisWorld(bodyB, joint.localAxisB);
    const tangentA = orthogonalTangent(axisA);
    const tangentB = vecNormalize(vecCross(axisA, tangentA));
    // For a small rotation of A relative to B, cross(axisB, axisA) points in
    // the corrective error direction. The reverse order injects angular energy.
    const alignmentError = vecCross(axisB, axisA);
    solveAngularAxis(joint, bodyA, bodyB, tangentA, vecDot(alignmentError, tangentA), dt, options);
    solveAngularAxis(joint, bodyA, bodyB, tangentB, vecDot(alignmentError, tangentB), dt, options);

    const angle = hingeAngle(joint, bodyA, bodyB, axisA);
    joint.runtime.angle = Math.fround(angle);
    if (joint.min !== null && angle < joint.min) {
      solveAngularAxis(joint, bodyA, bodyB, axisA, angle - joint.min, dt, options);
    } else if (joint.max !== null && angle > joint.max) {
      solveAngularAxis(joint, bodyA, bodyB, axisA, angle - joint.max, dt, options);
    }
    if (joint.motor?.enabled && joint.motor.maxImpulse > 0) {
      let targetVelocity = joint.motor.targetVelocity;
      if (joint.motor.targetPosition !== null) {
        targetVelocity += (joint.motor.targetPosition - angle) * Math.min(20, joint.stiffness || 12);
      }
      const remaining = Math.max(0, joint.motor.maxImpulse - Math.abs(joint.runtime.motorImpulse));
      const impulse = solveAngularAxis(
        { ...joint, compliance: 0 },
        bodyA,
        bodyB,
        axisA,
        0,
        dt,
        { ...options, baumgarte: 0 },
        targetVelocity,
        { min: -remaining, max: remaining },
      );
      joint.runtime.motorImpulse = Math.fround(joint.runtime.motorImpulse + impulse);
    }
  }

  if (joint.type === 'prismatic') {
    const axis = axisWorld(bodyA, joint.localAxisA);
    const tangentA = orthogonalTangent(axis);
    const tangentB = vecNormalize(vecCross(axis, tangentA));
    solveLinearAxis(joint, bodyA, pointA, bodyB, pointB, tangentA, vecDot(delta, tangentA), dt, options);
    solveLinearAxis(joint, bodyA, pointA, bodyB, pointB, tangentB, vecDot(delta, tangentB), dt, options);
    const translation = vecDot(delta, axis);
    joint.runtime.position = Math.fround(translation);
    if (joint.min !== null && translation < joint.min) {
      solveLinearAxis(joint, bodyA, pointA, bodyB, pointB, axis, translation - joint.min, dt, options);
    } else if (joint.max !== null && translation > joint.max) {
      solveLinearAxis(joint, bodyA, pointA, bodyB, pointB, axis, translation - joint.max, dt, options);
    }
    const error = orientationError(joint, bodyA, bodyB);
    for (const angularAxis of worldAxes) {
      solveAngularAxis(
        joint,
        bodyA,
        bodyB,
        angularAxis,
        vecDot(error, angularAxis),
        dt,
        options,
      );
    }
    if (joint.motor?.enabled && joint.motor.maxImpulse > 0) {
      let targetVelocity = joint.motor.targetVelocity;
      if (joint.motor.targetPosition !== null) {
        targetVelocity += (joint.motor.targetPosition - translation) * Math.min(20, joint.stiffness || 12);
      }
      const relativeSpeed = vecDot(
        vecSub(pointVelocity(bodyA, pointA), pointVelocity(bodyB, pointB)),
        axis,
      );
      const mass = directionalEffectiveMass(bodyA, pointA, bodyB, pointB, axis);
      const oldImpulse = joint.runtime.motorImpulse;
      const nextImpulse = Math.max(
        -joint.motor.maxImpulse,
        Math.min(joint.motor.maxImpulse, oldImpulse + (targetVelocity - relativeSpeed) * mass),
      );
      const deltaImpulse = nextImpulse - oldImpulse;
      applyPairImpulse(bodyA, pointA, bodyB, pointB, vecScale(axis, deltaImpulse));
      joint.runtime.motorImpulse = Math.fround(nextImpulse);
    }
  }

  if (joint.type === 'fixed') {
    const error = orientationError(joint, bodyA, bodyB);
    for (const axis of worldAxes) {
      solveAngularAxis(joint, bodyA, bodyB, axis, vecDot(error, axis), dt, options);
    }
  }
}

export function correctJointPosition(joint, bodyA, bodyB) {
  if (!joint.enabled || joint.type === 'spring') return;
  const pointA = anchorWorld(bodyA, joint.localAnchorA);
  const pointB = anchorWorld(bodyB, joint.localAnchorB);
  const delta = vecSub(pointA, pointB);
  const axes = [vec3([1, 0, 0]), vec3([0, 1, 0]), vec3([0, 0, 1])];
  if (joint.type === 'hinge' || joint.type === 'fixed') {
    for (const axis of axes) {
      const error = vecDot(delta, axis);
      const mass = directionalEffectiveMass(bodyA, pointA, bodyB, pointB, axis);
      applyPairPositionImpulse(bodyA, pointA, bodyB, pointB, vecScale(axis, -error * mass * 0.35));
    }
    if (joint.type === 'hinge') {
      correctHingeLimitPosition(joint, bodyA, bodyB);
    }
  } else if (joint.type === 'distance') {
    const length = vecLength(delta);
    if (length > 1e-7) {
      const axis = vecScale(delta, 1 / length);
      const mass = directionalEffectiveMass(bodyA, pointA, bodyB, pointB, axis);
      applyPairPositionImpulse(
        bodyA,
        pointA,
        bodyB,
        pointB,
        vecScale(axis, -(length - joint.runtime.restLength) * mass * 0.35),
      );
    }
  } else if (joint.type === 'prismatic') {
    const axis = axisWorld(bodyA, joint.localAxisA);
    const tangentA = orthogonalTangent(axis);
    const tangentB = vecNormalize(vecCross(axis, tangentA));
    for (const tangent of [tangentA, tangentB]) {
      const error = vecDot(delta, tangent);
      const mass = directionalEffectiveMass(bodyA, pointA, bodyB, pointB, tangent);
      applyPairPositionImpulse(bodyA, pointA, bodyB, pointB, vecScale(tangent, -error * mass * 0.35));
    }
    correctPrismaticLimitPosition(joint, bodyA, bodyB);
  }
}

export function correctJointLimitPosition(joint, bodyA, bodyB) {
  if (!joint.enabled) return;
  if (joint.type === 'hinge') correctHingeLimitPosition(joint, bodyA, bodyB);
  if (joint.type === 'prismatic') correctPrismaticLimitPosition(joint, bodyA, bodyB);
}

export function snapshotJoint(joint) {
  return {
    id: joint.id,
    enabled: joint.enabled,
    motor: joint.motor ? { ...joint.motor } : null,
    runtime: {
      ...joint.runtime,
      referenceA: Array.from(joint.runtime.referenceA),
      referenceB: Array.from(joint.runtime.referenceB),
      initialRelativeOrientation: Array.from(joint.runtime.initialRelativeOrientation),
    },
  };
}
