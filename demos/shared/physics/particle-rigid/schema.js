import { f32, vec3, vecNormalize } from './math.js';

export const DEFAULT_WORLD_OPTIONS = Object.freeze({
  fixedDt: 1 / 120,
  solverIterations: 12,
  maxSubSteps: 8,
  maxFrameDt: 0.1,
  gravity: Object.freeze([0, -9.81, 0]),
  linearDamping: 0.02,
  angularDamping: 0.04,
  maxLinearSpeed: 120,
  maxAngularSpeed: 180,
  contactSlop: 0.0015,
  precontactMargin: 0.025,
  precontactSpeed: 0.8,
  baumgarte: 0.22,
  maxDepenetrationSpeed: 4,
  restitutionThreshold: 0.75,
  spatialCellSize: 0.5,
  maxEntriesPerCell: 64,
  maxGridCells: 16_384,
  maxCandidatePairs: 65_536,
  maxBodies: 256,
  maxParticles: 8_192,
  maxJoints: 512,
  maxSurfaces: 32,
  maxContacts: 16_384,
  maxSurfaceQueries: 65_536,
  throwOnOverflow: false,
});

export const DEFAULT_MATERIAL = Object.freeze({
  friction: 0.8,
  restitution: 0,
  rollingFriction: 0.015,
  contactStiffness: 1,
  contactDamping: 1,
});

function finite(value, fallback, label) {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved)) throw new TypeError(`${label} must be finite`);
  return f32(resolved);
}

function nonNegative(value, fallback, label) {
  const resolved = finite(value, fallback, label);
  if (resolved < 0) throw new RangeError(`${label} must be non-negative`);
  return resolved;
}

function positive(value, fallback, label) {
  const resolved = finite(value, fallback, label);
  if (resolved <= 0) throw new RangeError(`${label} must be positive`);
  return resolved;
}

function positiveInteger(value, fallback, label) {
  const resolved = value ?? fallback;
  if (!Number.isInteger(resolved) || resolved <= 0) {
    throw new RangeError(`${label} must be a positive integer`);
  }
  return resolved;
}

export function normalizeWorldOptions(options = {}) {
  const normalized = {
    fixedDt: positive(options.fixedDt, DEFAULT_WORLD_OPTIONS.fixedDt, 'fixedDt'),
    solverIterations: positiveInteger(
      options.solverIterations,
      DEFAULT_WORLD_OPTIONS.solverIterations,
      'solverIterations',
    ),
    maxSubSteps: positiveInteger(options.maxSubSteps, DEFAULT_WORLD_OPTIONS.maxSubSteps, 'maxSubSteps'),
    maxFrameDt: positive(options.maxFrameDt, DEFAULT_WORLD_OPTIONS.maxFrameDt, 'maxFrameDt'),
    gravity: vec3(options.gravity ?? DEFAULT_WORLD_OPTIONS.gravity),
    linearDamping: nonNegative(
      options.linearDamping,
      DEFAULT_WORLD_OPTIONS.linearDamping,
      'linearDamping',
    ),
    angularDamping: nonNegative(
      options.angularDamping,
      DEFAULT_WORLD_OPTIONS.angularDamping,
      'angularDamping',
    ),
    maxLinearSpeed: positive(
      options.maxLinearSpeed,
      DEFAULT_WORLD_OPTIONS.maxLinearSpeed,
      'maxLinearSpeed',
    ),
    maxAngularSpeed: positive(
      options.maxAngularSpeed,
      DEFAULT_WORLD_OPTIONS.maxAngularSpeed,
      'maxAngularSpeed',
    ),
    contactSlop: nonNegative(options.contactSlop, DEFAULT_WORLD_OPTIONS.contactSlop, 'contactSlop'),
    precontactMargin: nonNegative(
      options.precontactMargin,
      DEFAULT_WORLD_OPTIONS.precontactMargin,
      'precontactMargin',
    ),
    precontactSpeed: nonNegative(
      options.precontactSpeed,
      DEFAULT_WORLD_OPTIONS.precontactSpeed,
      'precontactSpeed',
    ),
    baumgarte: nonNegative(options.baumgarte, DEFAULT_WORLD_OPTIONS.baumgarte, 'baumgarte'),
    maxDepenetrationSpeed: positive(
      options.maxDepenetrationSpeed,
      DEFAULT_WORLD_OPTIONS.maxDepenetrationSpeed,
      'maxDepenetrationSpeed',
    ),
    restitutionThreshold: nonNegative(
      options.restitutionThreshold,
      DEFAULT_WORLD_OPTIONS.restitutionThreshold,
      'restitutionThreshold',
    ),
    spatialCellSize: positive(
      options.spatialCellSize,
      DEFAULT_WORLD_OPTIONS.spatialCellSize,
      'spatialCellSize',
    ),
    maxEntriesPerCell: positiveInteger(
      options.maxEntriesPerCell,
      DEFAULT_WORLD_OPTIONS.maxEntriesPerCell,
      'maxEntriesPerCell',
    ),
    maxGridCells: positiveInteger(options.maxGridCells, DEFAULT_WORLD_OPTIONS.maxGridCells, 'maxGridCells'),
    maxCandidatePairs: positiveInteger(
      options.maxCandidatePairs,
      DEFAULT_WORLD_OPTIONS.maxCandidatePairs,
      'maxCandidatePairs',
    ),
    maxBodies: positiveInteger(options.maxBodies, DEFAULT_WORLD_OPTIONS.maxBodies, 'maxBodies'),
    maxParticles: positiveInteger(options.maxParticles, DEFAULT_WORLD_OPTIONS.maxParticles, 'maxParticles'),
    maxJoints: positiveInteger(options.maxJoints, DEFAULT_WORLD_OPTIONS.maxJoints, 'maxJoints'),
    maxSurfaces: positiveInteger(options.maxSurfaces, DEFAULT_WORLD_OPTIONS.maxSurfaces, 'maxSurfaces'),
    maxContacts: positiveInteger(options.maxContacts, DEFAULT_WORLD_OPTIONS.maxContacts, 'maxContacts'),
    maxSurfaceQueries: positiveInteger(
      options.maxSurfaceQueries,
      DEFAULT_WORLD_OPTIONS.maxSurfaceQueries,
      'maxSurfaceQueries',
    ),
    throwOnOverflow: Boolean(options.throwOnOverflow ?? DEFAULT_WORLD_OPTIONS.throwOnOverflow),
  };
  if (normalized.maxFrameDt < normalized.fixedDt) {
    throw new RangeError('maxFrameDt must be at least fixedDt');
  }
  return Object.freeze(normalized);
}

export function normalizeMaterial(material = {}) {
  return Object.freeze({
    friction: nonNegative(material.friction, DEFAULT_MATERIAL.friction, 'material.friction'),
    restitution: Math.min(1, nonNegative(
      material.restitution,
      DEFAULT_MATERIAL.restitution,
      'material.restitution',
    )),
    rollingFriction: nonNegative(
      material.rollingFriction,
      DEFAULT_MATERIAL.rollingFriction,
      'material.rollingFriction',
    ),
    contactStiffness: nonNegative(
      material.contactStiffness,
      DEFAULT_MATERIAL.contactStiffness,
      'material.contactStiffness',
    ),
    contactDamping: nonNegative(
      material.contactDamping,
      DEFAULT_MATERIAL.contactDamping,
      'material.contactDamping',
    ),
  });
}

function jointVector(value, fallback, normalize = false) {
  const result = vec3(value ?? fallback);
  return normalize ? vecNormalize(result, fallback) : result;
}

export function normalizeJointDefinition(definition, index = 0) {
  const type = definition?.type;
  if (!['hinge', 'prismatic', 'spring', 'fixed', 'distance'].includes(type)) {
    throw new TypeError(`unsupported joint type: ${type}`);
  }
  const id = definition.id ?? `joint-${index}`;
  if (typeof id !== 'string' || id.length === 0) throw new TypeError('joint id must be a string');
  const bodyA = definition.bodyA;
  const bodyB = definition.bodyB ?? null;
  if (typeof bodyA !== 'string' || (bodyB !== null && typeof bodyB !== 'string')) {
    throw new TypeError(`joint ${id} requires string bodyA and optional bodyB ids`);
  }
  const anchors = definition.anchors ?? {};
  const axes = definition.axes ?? {};
  const limits = definition.limits ?? {};
  const minimum = Array.isArray(limits) ? limits[0] : limits.min;
  const maximum = Array.isArray(limits) ? limits[1] : limits.max;
  if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
    throw new RangeError(`joint ${id} limit min cannot exceed max`);
  }
  const motor = definition.motor
    ? {
        enabled: definition.motor.enabled !== false,
        targetVelocity: finite(definition.motor.targetVelocity, 0, `joint ${id} motor targetVelocity`),
        targetPosition: definition.motor.targetPosition === undefined
          ? null
          : finite(definition.motor.targetPosition, 0, `joint ${id} motor targetPosition`),
        maxImpulse: nonNegative(definition.motor.maxImpulse, 0, `joint ${id} motor maxImpulse`),
      }
    : null;
  return {
    id,
    type,
    bodyA,
    bodyB,
    localAnchorA: jointVector(anchors.bodyA ?? definition.localAnchorA, [0, 0, 0]),
    localAnchorB: jointVector(anchors.bodyB ?? definition.localAnchorB, [0, 0, 0]),
    localAxisA: jointVector(axes.bodyA ?? definition.localAxisA, [1, 0, 0], true),
    localAxisB: jointVector(axes.bodyB ?? definition.localAxisB, [1, 0, 0], true),
    min: minimum === undefined ? null : finite(minimum, 0, `joint ${id} min`),
    max: maximum === undefined ? null : finite(maximum, 0, `joint ${id} max`),
    restLength: definition.restLength === undefined
      ? null
      : nonNegative(definition.restLength, 0, `joint ${id} restLength`),
    stiffness: nonNegative(definition.stiffness, type === 'spring' ? 1_200 : 0, `joint ${id} stiffness`),
    damping: nonNegative(definition.damping, type === 'spring' ? 70 : 0.15, `joint ${id} damping`),
    compliance: nonNegative(definition.compliance, 0, `joint ${id} compliance`),
    motor,
    enabled: definition.enabled !== false,
    collideConnected: Boolean(definition.collideConnected),
    metadata: Object.freeze({ ...(definition.metadata ?? {}) }),
  };
}
