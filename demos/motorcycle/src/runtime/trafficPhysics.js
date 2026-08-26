import { createBoxParticleCloud } from '../../../shared/physics/particle-rigid/index.js';

const TRAFFIC_BODY_PREFIX = 'traffic-body:';
const TRAFFIC_PARTICLE_RADIUS_METERS = 0.48;

function finiteOriginOffset(originOffset = [0, 0, 0]) {
  if ((!Array.isArray(originOffset) && !ArrayBuffer.isView(originOffset)) || originOffset.length < 3) {
    throw new TypeError('Traffic origin offset must contain three components.');
  }
  const result = Array.from(originOffset).slice(0, 3).map(Number);
  if (!result.every(Number.isFinite)) throw new TypeError('Traffic origin offset must be finite.');
  return result;
}

function validateReferenceTransform(referenceTransform) {
  if (referenceTransform === null || referenceTransform === undefined) return null;
  if (typeof referenceTransform.transformPoint !== 'function'
    || typeof referenceTransform.transformOrientation !== 'function') {
    throw new TypeError('Traffic reference transform must map points and orientations.');
  }
  return referenceTransform;
}

export function trafficPose(
  vehicle,
  terrain,
  originOffset = [0, 0, 0],
  referenceTransform = null,
) {
  const [longitude, latitude] = vehicle.coordinates;
  const groundHeight = terrain.sampleRawHeight(longitude, latitude);
  const local = terrain.frame.toLocal({ longitude, latitude, height: groundHeight });
  const offset = finiteOriginOffset(originOffset);
  const vehicleHeight = vehicle.dimensionsMeters[2];
  const yaw = Math.PI - vehicle.headingRadians;
  const sourcePosition = [
      local[0] - offset[0],
      local[1] + vehicleHeight / 2 - offset[1],
      local[2] - offset[2],
  ];
  const sourceOrientation = [0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)];
  const transform = validateReferenceTransform(referenceTransform);
  return Object.freeze({
    position: Object.freeze(transform
      ? Array.from(transform.transformPoint(sourcePosition))
      : sourcePosition),
    orientation: Object.freeze(transform
      ? Array.from(transform.transformOrientation(sourceOrientation))
      : sourceOrientation),
  });
}

function bodyId(vehicleId) {
  return `${TRAFFIC_BODY_PREFIX}${vehicleId}`;
}

export function createTrafficCollisionCloud(vehicle) {
  const [length, width, height] = vehicle.dimensionsMeters;
  const radius = TRAFFIC_PARTICLE_RADIUS_METERS;
  const particleCenterHalfExtents = [width, height, length].map((dimension) => dimension / 2 - radius);
  if (!particleCenterHalfExtents.every((extent) => Number.isFinite(extent) && extent > 0)) {
    throw new RangeError('Traffic dimensions must contain the collision particle radius.');
  }
  return createBoxParticleCloud({
    // createBoxParticleCloud treats halfExtents as particle-center bounds.
    // Inset them by the particle radius so the collision cage outer surface
    // matches the reported/rendered vehicle dimensions exactly.
    halfExtents: particleCenterHalfExtents,
    // Kinematic traffic needs a collision cage, not a dense mass sample. A
    // coarse shell keeps real player impacts while bounding CPU contact work.
    radius,
    spacing: 1.7,
    shell: true,
    tag: `synthetic-traffic:${vehicle.kind}`,
  });
}

export function addTrafficPhysicsBodies(world, trafficSnapshot, terrain, {
  maximumVehicles = 18,
  originOffset = [0, 0, 0],
  referenceTransform = null,
} = {}) {
  if (!world?.addBody || !world?.setKinematicTarget) throw new TypeError('A particle-rigid world is required.');
  if (trafficSnapshot?.schemaVersion !== 'peercompute.synthetic-road-traffic.snapshot.v1') {
    throw new TypeError('A canonical synthetic traffic snapshot is required.');
  }
  if (!Number.isInteger(maximumVehicles) || maximumVehicles < 0 || maximumVehicles > 64) {
    throw new RangeError('maximumVehicles must be an integer between 0 and 64.');
  }
  const vehicles = trafficSnapshot.vehicles.slice(0, maximumVehicles);
  const bindings = [];
  for (const vehicle of vehicles) {
    const id = bodyId(vehicle.id);
    const pose = trafficPose(vehicle, terrain, originOffset, referenceTransform);
    world.addBody({
      id,
      motionType: 'kinematic',
      position: pose.position,
      orientation: pose.orientation,
      mass: 1_200,
      particleCloud: createTrafficCollisionCloud(vehicle),
      material: { friction: 0.72, restitution: 0.04, rollingFriction: 0.01 },
      collisionGroup: 2,
      collisionMask: 0x7fffffff,
      groups: ['synthetic-traffic', vehicle.kind],
      metadata: {
        vehicleId: vehicle.id,
        kind: vehicle.kind,
        synthetic: true,
        liveTraffic: false,
        navigationGrade: false,
      },
    });
    world.setKinematicTarget(id, pose);
    bindings.push(Object.freeze({
      bodyId: id,
      vehicleId: vehicle.id,
      collisionMask: 0x7fffffff,
    }));
  }
  for (let left = 0; left < bindings.length; left += 1) {
    for (let right = left + 1; right < bindings.length; right += 1) {
      world.setBodiesCollide(bindings[left].bodyId, bindings[right].bodyId, false);
    }
  }
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.traffic-physics-bindings.v1',
    bindings: Object.freeze(bindings),
    requested: trafficSnapshot.vehicleCount,
    added: bindings.length,
    omitted: Math.max(0, trafficSnapshot.vehicleCount - bindings.length),
    synthetic: true,
    liveTraffic: false,
  });
}

export function setTrafficPhysicsActive(world, bindingSet, active) {
  if (bindingSet?.schemaVersion !== 'peercompute.motorcycle.traffic-physics-bindings.v1') {
    throw new TypeError('Canonical traffic physics bindings are required.');
  }
  const enabled = Boolean(active);
  for (const binding of bindingSet.bindings) {
    const body = world.getBody(binding.bodyId);
    body.collisionMask = enabled ? binding.collisionMask : 0;
    body.metadata.physicsActive = enabled;
  }
  return Object.freeze({ active: enabled, bodyCount: bindingSet.bindings.length });
}

export function updateTrafficPhysicsBodies(
  world,
  trafficSnapshot,
  terrain,
  bindingSet,
  { originOffset = [0, 0, 0], referenceTransform = null } = {},
) {
  if (bindingSet?.schemaVersion !== 'peercompute.motorcycle.traffic-physics-bindings.v1') {
    throw new TypeError('Canonical traffic physics bindings are required.');
  }
  const vehicleById = new Map(trafficSnapshot.vehicles.map((vehicle) => [vehicle.id, vehicle]));
  let updated = 0;
  for (const binding of bindingSet.bindings) {
    const vehicle = vehicleById.get(binding.vehicleId);
    if (!vehicle) continue;
    world.setKinematicTarget(
      binding.bodyId,
      trafficPose(vehicle, terrain, originOffset, referenceTransform),
    );
    updated += 1;
  }
  return Object.freeze({ updated, missing: bindingSet.bindings.length - updated });
}
