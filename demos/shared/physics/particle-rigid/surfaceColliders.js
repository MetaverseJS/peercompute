import {
  f32,
  vec3,
  vecDot,
  vecMulAdd,
  vecNormalize,
} from './math.js';

function validateSurfaceId(id) {
  if (typeof id !== 'string' || id.length === 0) {
    throw new TypeError('surface collider id must be a non-empty string');
  }
  return id;
}

export function createPlaneSurfaceCollider({
  id = 'ground',
  normal = [0, 1, 0],
  offset = 0,
  friction = 0.9,
  restitution = 0,
  surfaceVelocity = [0, 0, 0],
  metadata = {},
} = {}) {
  validateSurfaceId(id);
  const unitNormal = vecNormalize(vec3(normal), [0, 1, 0]);
  const velocity = vec3(surfaceVelocity);
  const sampleSphere = ({ center, radius }) => {
    const centerDistance = vecDot(unitNormal, center) - offset;
    const signedDistance = centerDistance - radius;
    return {
      hit: signedDistance <= 0,
      signedDistance: f32(signedDistance),
      penetration: f32(Math.max(0, -signedDistance)),
      normal: vec3(unitNormal),
      point: vecMulAdd(center, unitNormal, -radius),
      surfaceVelocity: vec3(velocity),
      friction,
      restitution,
      metadata,
    };
  };
  const sweepSphere = ({ from, to, radius }) => {
    const fromDistance = vecDot(unitNormal, from) - offset - radius;
    const toDistance = vecDot(unitNormal, to) - offset - radius;
    if (fromDistance <= 0) return sampleSphere({ center: to, radius });
    if (toDistance > 0 || fromDistance === toDistance) return { hit: false };
    const toi = Math.min(1, Math.max(0, fromDistance / (fromDistance - toDistance)));
    const center = vec3([
      from[0] + (to[0] - from[0]) * toi,
      from[1] + (to[1] - from[1]) * toi,
      from[2] + (to[2] - from[2]) * toi,
    ]);
    return {
      ...sampleSphere({ center, radius }),
      hit: true,
      swept: true,
      toi: f32(toi),
      penetration: f32(Math.max(0, -toDistance)),
    };
  };
  return Object.freeze({
    id,
    type: 'plane',
    sampleSphere,
    sweepSphere,
    metadata: Object.freeze({ ...metadata }),
  });
}

export function createHeightfieldSurfaceCollider({
  id = 'heightfield',
  sampleHeight,
  sampleNormal = null,
  bounds = null,
  normalStep = 0.25,
  friction = 0.9,
  restitution = 0,
  metadata = {},
} = {}) {
  validateSurfaceId(id);
  if (typeof sampleHeight !== 'function') {
    throw new TypeError('heightfield sampleHeight must be a function');
  }
  const contains = (x, z) => !bounds
    || (x >= bounds.minX && x <= bounds.maxX && z >= bounds.minZ && z <= bounds.maxZ);
  const resolveNormal = (x, z) => {
    if (sampleNormal) return vecNormalize(vec3(sampleNormal(x, z)), [0, 1, 0]);
    const left = sampleHeight(x - normalStep, z);
    const right = sampleHeight(x + normalStep, z);
    const down = sampleHeight(x, z - normalStep);
    const up = sampleHeight(x, z + normalStep);
    return vecNormalize(vec3([
      left - right,
      normalStep * 2,
      down - up,
    ]), [0, 1, 0]);
  };
  const sampleSphere = ({ center, radius }) => {
    if (!contains(center[0], center[2])) return { hit: false, outside: true };
    const height = sampleHeight(center[0], center[2]);
    if (!Number.isFinite(height)) return { hit: false, unavailable: true };
    const normal = resolveNormal(center[0], center[2]);
    const groundPoint = vec3([center[0], height, center[2]]);
    const signedDistance = vecDot(normal, [
      center[0] - groundPoint[0],
      center[1] - groundPoint[1],
      center[2] - groundPoint[2],
    ]) - radius;
    return {
      hit: signedDistance <= 0,
      signedDistance: f32(signedDistance),
      penetration: f32(Math.max(0, -signedDistance)),
      normal,
      point: vecMulAdd(center, normal, -radius),
      surfaceVelocity: vec3(),
      friction,
      restitution,
      metadata,
    };
  };
  return Object.freeze({
    id,
    type: 'heightfield',
    sampleSphere,
    // Conservative sub-stepped sweep prevents fast spheres crossing narrow relief.
    sweepSphere({ from, to, radius }) {
      const steps = 8;
      for (let index = 1; index <= steps; index += 1) {
        const alpha = index / steps;
        const center = vec3([
          from[0] + (to[0] - from[0]) * alpha,
          from[1] + (to[1] - from[1]) * alpha,
          from[2] + (to[2] - from[2]) * alpha,
        ]);
        const sample = sampleSphere({ center, radius });
        if (sample.hit) return { ...sample, swept: true, toi: f32(alpha) };
      }
      return { hit: false };
    },
    metadata: Object.freeze({ ...metadata }),
  });
}

export function normalizeSurfaceCollider(collider) {
  if (!collider || typeof collider !== 'object') {
    throw new TypeError('surface collider must be an object');
  }
  validateSurfaceId(collider.id);
  if (typeof collider.sampleSphere !== 'function' && typeof collider.sweepSphere !== 'function') {
    throw new TypeError(`surface collider ${collider.id} must provide sampleSphere or sweepSphere`);
  }
  return collider;
}
