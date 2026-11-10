import * as CANNON from 'cannon-es';
import { normalizeWorldGoalPosition } from '../../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';
import { NAVIGATION_SENSORS } from '../../../shared/agents/motor/navigationSensors.js';

export const CUBE_SPATIAL_LIMITS = Object.freeze({ maximumLegDistance: 160, maximumLocations: 12, maximumCoordinate: 1_000_000 });
const fail = message => { const error = new Error(message); error.code = 'SPATIAL_TARGET_UNAVAILABLE'; throw error; };
const pair = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);

/** Grounded destination observations only: no route, itinerary, or body control.
 * CubeChat's actual collision floor is planar; themed height is visual only. */
export function createCubeSpatialTargets({ physics, getEntries, sensors, getBounds, groundHeight }) {
  if (!physics?.world || !sensors?.sample || ![getEntries, getBounds, groundHeight].every(value => typeof value === 'function')) {
    throw new TypeError('Spatial destinations require local geometry and floor bounds');
  }
  function frame(key) {
    const entry = getEntries().get(key), bounds = getBounds();
    if (!entry?.descriptor.local) fail('Only the resident owner can choose a destination');
    if (!bounds || !pair(bounds.min) || !pair(bounds.max) || bounds.min.some((value, axis) => value >= bounds.max[axis]
        || Math.abs(value) > CUBE_SPATIAL_LIMITS.maximumCoordinate || Math.abs(bounds.max[axis]) > CUBE_SPATIAL_LIMITS.maximumCoordinate)) {
      fail('This world has no bounded walking surface');
    }
    const normal = new CANNON.Vec3(), origin = new CANNON.Vec3(), rotation = new CANNON.Quaternion();
    const supported = physics.world.bodies.some(body => body.collisionResponse !== false
      && (body.collisionFilterGroup & entry.body.collisionFilterMask) && (entry.body.collisionFilterGroup & body.collisionFilterMask)
      && body.shapes.some((shape, index) => {
        if (shape.type !== CANNON.Shape.types.PLANE || shape.collisionResponse === false) return false;
        body.quaternion.mult(body.shapeOrientations[index], rotation); rotation.vmult(new CANNON.Vec3(0, 0, 1), normal);
        body.pointToWorldFrame(body.shapeOffsets[index], origin);
        return normal.y > .999999 && Math.abs(origin.y + NAVIGATION_SENSORS.halfSize - entry.body.position.y) < .1;
      }));
    if (!supported) fail('This world has no supported planar walking surface');
    return { entry, spatial: { frame: 'planar-xz', bounds: { min: [...bounds.min], max: [...bounds.max] },
      maximumLegDistance: CUBE_SPATIAL_LIMITS.maximumLegDistance } };
  }
  function validate(key, input, context = frame(key)) {
    const position = normalizeWorldGoalPosition(input), { entry, spatial } = context;
    if (position.some(value => Math.abs(value) > CUBE_SPATIAL_LIMITS.maximumCoordinate)) fail('Destination is outside this world');
    const planar = [position[0], position[2]];
    if (planar.some((value, axis) => value < spatial.bounds.min[axis] || value > spatial.bounds.max[axis])) fail('Destination is outside the walking surface');
    if (Math.hypot(position[0] - entry.body.position.x, position[2] - entry.body.position.z) > spatial.maximumLegDistance) {
      fail('Destination is beyond the current movement range');
    }
    if (!sensors.sample(key, { kind: 'location', position }).destinationClear) fail('The destination is occupied or obstructed');
    return position;
  }
  return {
    validate,
    describe(key) {
      let context;
      try { context = frame(key); } catch (error) { if (error.code === 'SPATIAL_TARGET_UNAVAILABLE') return {}; throw error; }
      const { entry, spatial } = context, locations = [];
      // Sampling nearby and distant free ground is perception, not a planned
      // sequence. The language planner chooses which observations to use.
      for (const [radius, count] of [[32, 4], [96, 8]]) for (let index = 0; index < count; index++) {
        const angle = index * Math.PI * 2 / count;
        const x = Math.round((entry.body.position.x + Math.cos(angle) * radius) * 1000) / 1000;
        const z = Math.round((entry.body.position.z + Math.sin(angle) * radius) * 1000) / 1000;
        const position = [x, groundHeight(x, z) + NAVIGATION_SENSORS.halfSize, z];
        try { validate(key, position, context); }
        catch (error) { if (error.code === 'SPATIAL_TARGET_UNAVAILABLE') continue; throw error; }
        locations.push({ id: `ground:${x}:${z}`, name: `Clear ground ${radius} units away`, position,
          distance: Math.hypot(x - entry.body.position.x, z - entry.body.position.z) });
      }
      return { spatial, locations };
    },
  };
}
