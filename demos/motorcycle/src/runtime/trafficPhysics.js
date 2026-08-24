import { createBoxParticleCloud } from '../../../shared/physics/particle-rigid/index.js';

const TRAFFIC_BODY_PREFIX = 'traffic-body:';

function finiteOriginOffset(originOffset = [0, 0, 0]) {
  if ((!Array.isArray(originOffset) && !ArrayBuffer.isView(originOffset)) || originOffset.length < 3) {
    throw new TypeError('Traffic origin offset must contain three components.');
  }
  const result = Array.from(originOffset).slice(0, 3).map(Number);
  if (!result.every(Number.isFinite)) throw new TypeError('Traffic origin offset must be finite.');
  return result;
}

export function trafficPose(vehicle, terrain, originOffset = [0, 0, 0]) {
  const [longitude, latitude] = vehicle.coordinates;
  const groundHeight = terrain.sampleRawHeight(longitude, latitude);
  const local = terrain.frame.toLocal({ longitude, latitude, height: groundHeight });
  const offset = finiteOriginOffset(originOffset);
  const vehicleHeight = vehicle.dimensionsMeters[2];
  const yaw = Math.PI - vehicle.headingRadians;
  return Object.freeze({
    position: Object.freeze([
      local[0] - offset[0],
      local[1] + vehicleHeight / 2 - offset[1],
      local[2] - offset[2],
    ]),
    orientation: Object.freeze([0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)]),
  });
}

function bodyId(vehicleId) {
  return `${TRAFFIC_BODY_PREFIX}${vehicleId}`;
}

function trafficCloud(vehicle) {
  const [length, width, height] = vehicle.dimensionsMeters;
  return createBoxParticleCloud({
    halfExtents: [width / 2, height / 2, length / 2],
    // Kinematic traffic needs a collision cage, not a dense mass sample. A
    // coarse shell keeps real player impacts while bounding CPU contact work.
    radius: 0.48,
    spacing: 1.7,
    shell: true,
    tag: `synthetic-traffic:${vehicle.kind}`,
  });
}

export function addTrafficPhysicsBodies(world, trafficSnapshot, terrain, {
  maximumVehicles = 18,
  originOffset = [0, 0, 0],
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
    const pose = trafficPose(vehicle, terrain, originOffset);
    world.addBody({
      id,
      motionType: 'kinematic',
      position: pose.position,
      orientation: pose.orientation,
      mass: 1_200,
      particleCloud: trafficCloud(vehicle),
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
    bindings.push(Object.freeze({ bodyId: id, vehicleId: vehicle.id }));
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

export function updateTrafficPhysicsBodies(
  world,
  trafficSnapshot,
  terrain,
  bindingSet,
  { originOffset = [0, 0, 0] } = {},
) {
  if (bindingSet?.schemaVersion !== 'peercompute.motorcycle.traffic-physics-bindings.v1') {
    throw new TypeError('Canonical traffic physics bindings are required.');
  }
  const vehicleById = new Map(trafficSnapshot.vehicles.map((vehicle) => [vehicle.id, vehicle]));
  let updated = 0;
  for (const binding of bindingSet.bindings) {
    const vehicle = vehicleById.get(binding.vehicleId);
    if (!vehicle) continue;
    world.setKinematicTarget(binding.bodyId, trafficPose(vehicle, terrain, originOffset));
    updated += 1;
  }
  return Object.freeze({ updated, missing: bindingSet.bindings.length - updated });
}
