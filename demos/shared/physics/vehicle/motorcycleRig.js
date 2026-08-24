import {
  createBoxParticleCloud,
  createParticleCloud,
  createRingParticleCloud,
} from '../particle-rigid/particleCloud.js';
import { quat, quatRotate, vec3, vecAdd } from '../particle-rigid/math.js';

function prefixed(prefix, name) {
  return prefix ? `${prefix}:${name}` : name;
}

function transformPosition(rootPosition, rootOrientation, localPosition) {
  return vecAdd(rootPosition, quatRotate(rootOrientation, localPosition));
}

function createForkCloud({ lower = false } = {}) {
  const particles = [];
  const yValues = lower ? [-0.23, -0.08, 0.08, 0.23] : [-0.22, -0.07, 0.08, 0.23];
  for (const x of [-0.12, 0.12]) {
    for (const y of yValues) {
      particles.push({ position: [x, y, 0], radius: 0.075, mass: 1, tag: lower ? 'fork-lower' : 'fork-upper' });
    }
  }
  if (!lower) {
    for (const x of [-0.28, -0.14, 0, 0.14, 0.28]) {
      particles.push({ position: [x, 0.24, -0.02], radius: 0.065, mass: 0.7, tag: 'handlebar' });
    }
  }
  return createParticleCloud(particles);
}

function createSwingarmCloud() {
  const particles = [];
  for (const x of [-0.15, 0.15]) {
    for (let index = 0; index < 6; index += 1) {
      const alpha = index / 5;
      particles.push({
        position: [x, 0.2 - alpha * 0.42, 0.2 - alpha * 0.48],
        radius: 0.075,
        mass: 1,
        tag: 'swingarm',
      });
    }
  }
  return createParticleCloud(particles);
}

export function createMotorcycleParticleClouds(options = {}) {
  const wheelRadius = options.wheelRadius ?? 0.34;
  const tireRadius = options.tireRadius ?? 0.072;
  const wheelSegments = options.wheelSegments ?? 20;
  return Object.freeze({
    chassis: createBoxParticleCloud({
      halfExtents: [0.24, 0.23, 0.55],
      radius: 0.095,
      spacing: 0.24,
      shell: true,
      tag: 'chassis',
    }),
    rearSwingarm: createSwingarmCloud(),
    rearWheel: createRingParticleCloud({
      radius: wheelRadius,
      tubeRadius: tireRadius,
      segments: wheelSegments,
      axis: 'x',
      tag: 'rear-tire',
    }),
    upperFork: createForkCloud(),
    lowerFork: createForkCloud({ lower: true }),
    frontWheel: createRingParticleCloud({
      radius: wheelRadius,
      tubeRadius: tireRadius,
      segments: wheelSegments,
      axis: 'x',
      tag: 'front-tire',
    }),
  });
}

export function createMotorcycleRig(world, {
  id = 'motorcycle',
  position = [0, 0, 0],
  orientation = [0, 0, 0, 1],
  wheelRadius = 0.34,
  tireRadius = 0.072,
  wheelSegments = 20,
  material = {},
} = {}) {
  if (!world || typeof world.addBody !== 'function' || typeof world.addJoint !== 'function') {
    throw new TypeError('createMotorcycleRig requires a particle-rigid world');
  }
  const rootPosition = vec3(position);
  const rootOrientation = quat(orientation);
  const clouds = createMotorcycleParticleClouds({ wheelRadius, tireRadius, wheelSegments });
  const bodyIds = Object.freeze({
    chassis: prefixed(id, 'chassis'),
    rearSwingarm: prefixed(id, 'rear-swingarm'),
    rearWheel: prefixed(id, 'rear-wheel'),
    upperFork: prefixed(id, 'upper-fork'),
    lowerFork: prefixed(id, 'lower-fork'),
    frontWheel: prefixed(id, 'front-wheel'),
  });
  const localPositions = {
    chassis: [0, 1.05, 0],
    rearSwingarm: [0, 0.72, -0.48],
    rearWheel: [0, 0.42, -0.82],
    upperFork: [0, 1.0, 0.55],
    lowerFork: [0, 0.70, 0.68],
    frontWheel: [0, 0.42, 0.85],
  };
  const masses = {
    chassis: 150,
    rearSwingarm: 14,
    rearWheel: 12,
    upperFork: 16,
    lowerFork: 12,
    frontWheel: 12,
  };
  const componentGroups = {
    chassis: ['motorcycle', 'rider-cage'],
    rearSwingarm: ['motorcycle', 'suspension'],
    rearWheel: ['motorcycle', 'wheel', 'driven-wheel'],
    upperFork: ['motorcycle', 'steering', 'handlebars'],
    lowerFork: ['motorcycle', 'suspension'],
    frontWheel: ['motorcycle', 'wheel', 'steered-wheel'],
  };
  for (const component of Object.keys(bodyIds)) {
    world.addBody({
      id: bodyIds[component],
      motionType: 'dynamic',
      position: transformPosition(rootPosition, rootOrientation, localPositions[component]),
      orientation: rootOrientation,
      mass: masses[component],
      particleCloud: clouds[component],
      material: {
        friction: component.endsWith('Wheel') ? 1.05 : 0.55,
        restitution: 0.02,
        rollingFriction: component.endsWith('Wheel') ? 0.008 : 0.02,
        ...material,
      },
      groups: componentGroups[component],
      metadata: {
        system: 'particle-motorcycle',
        motorcycleId: id,
        component,
      },
    });
  }
  if (typeof world.setBodiesCollide === 'function') {
    const ids = Object.values(bodyIds);
    for (let left = 0; left < ids.length; left += 1) {
      for (let right = left + 1; right < ids.length; right += 1) {
        world.setBodiesCollide(ids[left], ids[right], false);
      }
    }
  }

  const jointIds = Object.freeze({
    rearSwingarm: prefixed(id, 'joint-rear-swingarm'),
    rearSuspension: prefixed(id, 'joint-rear-suspension'),
    rearAxle: prefixed(id, 'joint-rear-axle'),
    steering: prefixed(id, 'joint-steering'),
    forkSlide: prefixed(id, 'joint-fork-slide'),
    frontSuspension: prefixed(id, 'joint-front-suspension'),
    frontAxle: prefixed(id, 'joint-front-axle'),
  });
  world.addJoint({
    id: jointIds.rearSwingarm,
    type: 'hinge',
    bodyA: bodyIds.rearSwingarm,
    bodyB: bodyIds.chassis,
    anchors: { bodyA: [0, 0.06, 0.06], bodyB: [0, -0.27, -0.42] },
    axes: { bodyA: [1, 0, 0], bodyB: [1, 0, 0] },
    limits: { min: -0.38, max: 0.32 },
    compliance: 2e-8,
    damping: 0.25,
  });
  world.addJoint({
    id: jointIds.rearSuspension,
    type: 'spring',
    bodyA: bodyIds.rearSwingarm,
    bodyB: bodyIds.chassis,
    // Keep the shock close to the rear axle and behind the swingarm pivot.
    // This gives it a useful, single-signed motion ratio across the whole
    // travel instead of the near-dead-centre linkage that rested on a stop.
    anchors: { bodyA: [0, -0.24, -0.28], bodyB: [0, 0.03, -0.72] },
    restLength: 0.631,
    stiffness: 25_000,
    damping: 1_200,
  });
  world.addJoint({
    id: jointIds.rearAxle,
    type: 'hinge',
    bodyA: bodyIds.rearWheel,
    bodyB: bodyIds.rearSwingarm,
    anchors: { bodyA: [0, 0, 0], bodyB: [0, -0.30, -0.34] },
    axes: { bodyA: [1, 0, 0], bodyB: [1, 0, 0] },
    compliance: 1e-9,
  });
  world.addJoint({
    id: jointIds.steering,
    type: 'hinge',
    bodyA: bodyIds.upperFork,
    bodyB: bodyIds.chassis,
    anchors: { bodyA: [0, 0.05, -0.07], bodyB: [0, 0, 0.48] },
    axes: { bodyA: [0, 1, 0], bodyB: [0, 1, 0] },
    limits: { min: -0.58, max: 0.58 },
    stiffness: 14,
    damping: 0.4,
    motor: { enabled: true, targetPosition: 0, targetVelocity: 0, maxImpulse: 11 },
  });
  world.addJoint({
    id: jointIds.forkSlide,
    type: 'prismatic',
    bodyA: bodyIds.lowerFork,
    bodyB: bodyIds.upperFork,
    anchors: { bodyA: [0, 0.10, -0.05], bodyB: [0, -0.20, 0.08] },
    axes: { bodyA: [0, 1, 0], bodyB: [0, 1, 0] },
    limits: { min: -0.12, max: 0.08 },
    compliance: 8e-8,
    damping: 0.3,
  });
  world.addJoint({
    id: jointIds.frontSuspension,
    type: 'spring',
    bodyA: bodyIds.lowerFork,
    bodyB: bodyIds.upperFork,
    // The spring axis remains separated throughout the prismatic stroke. The
    // old anchors crossed through zero at q=0.04 m and snapped to the opposite
    // branch near full extension.
    anchors: { bodyA: [0, -0.10, -0.05], bodyB: [0, -0.15, 0.08] },
    restLength: 0.303,
    stiffness: 10_500,
    damping: 950,
  });
  world.addJoint({
    id: jointIds.frontAxle,
    type: 'hinge',
    bodyA: bodyIds.frontWheel,
    bodyB: bodyIds.lowerFork,
    anchors: { bodyA: [0, 0, 0], bodyB: [0, -0.28, 0.17] },
    axes: { bodyA: [1, 0, 0], bodyB: [1, 0, 0] },
    compliance: 1e-9,
  });

  const rig = Object.freeze({
    id,
    bodyIds,
    jointIds,
    wheelRadius,
    tireRadius,
    componentCount: 6,
    bodyIdList: Object.freeze(Object.values(bodyIds)),
    jointIdList: Object.freeze(Object.values(jointIds)),
    rootPosition: vec3(rootPosition),
    rootOrientation: quat(rootOrientation),
  });
  world.captureInitialState();
  return rig;
}
