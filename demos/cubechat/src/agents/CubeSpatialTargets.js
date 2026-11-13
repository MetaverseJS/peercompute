import * as CANNON from 'cannon-es';
import { normalizeWorldGoalPosition } from '../../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';
import { NAVIGATION_SENSORS } from '../../../shared/agents/motor/navigationSensors.js';
import { normalizeWorldObjectSize } from '../../../shared/world/WorldModelScale.js';
import { normalizeWorldObjectTarget } from '../../../shared/agents/WorldObjectAction.js';

export const CUBE_SPATIAL_LIMITS = Object.freeze({ maximumLegDistance: 160, maximumLocations: 12, maximumCoordinate: 1_000_000 });
const fail = message => { const error = new Error(message); error.code = 'SPATIAL_TARGET_UNAVAILABLE'; throw error; };
const pair = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);

/** Grounded destination observations only: no route, itinerary, or body control.
 * CubeChat's actual collision floor is planar; themed height is visual only. */
export function createCubeSpatialTargets({ physics, getEntries, sensors, getBounds, groundHeight,
  getSurfaceBounds = getBounds, getParticipants = () => [] }) {
  if (!physics?.world || !sensors?.sample || ![getEntries, getBounds, groundHeight, getSurfaceBounds, getParticipants].every(value => typeof value === 'function')) {
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
    let floorHeight;
    const supported = physics.world.bodies.some(body => body.collisionResponse !== false
      && (body.collisionFilterGroup & entry.body.collisionFilterMask) && (entry.body.collisionFilterGroup & body.collisionFilterMask)
      && body.shapes.some((shape, index) => {
        if (shape.type !== CANNON.Shape.types.PLANE || shape.collisionResponse === false) return false;
        body.quaternion.mult(body.shapeOrientations[index], rotation); rotation.vmult(new CANNON.Vec3(0, 0, 1), normal);
        body.pointToWorldFrame(body.shapeOffsets[index], origin);
        const supported = normal.y > .999999 && Math.abs(origin.y + NAVIGATION_SENSORS.halfSize - entry.body.position.y) < .1;
        if (supported) floorHeight = origin.y;
        return supported;
      }));
    if (!supported) fail('This world has no supported planar walking surface');
    return { entry, floorHeight, spatial: { frame: 'planar-xz', bounds: { min: [...bounds.min], max: [...bounds.max] },
      maximumLegDistance: CUBE_SPATIAL_LIMITS.maximumLegDistance } };
  }
  function validate(key, input, context = frame(key), { enforceRange = true } = {}) {
    const position = normalizeWorldGoalPosition(input), { entry, spatial } = context;
    if (position.some(value => Math.abs(value) > CUBE_SPATIAL_LIMITS.maximumCoordinate)) fail('Destination is outside this world');
    const planar = [position[0], position[2]];
    if (planar.some((value, axis) => value < spatial.bounds.min[axis] || value > spatial.bounds.max[axis])) fail('Destination is outside the walking surface');
    if (enforceRange && Math.hypot(position[0] - entry.body.position.x, position[2] - entry.body.position.z) > spatial.maximumLegDistance) {
      fail('Destination is beyond the current movement range');
    }
    if (!sensors.sample(key, { kind: 'location', position }).destinationClear) fail('The destination is occupied or obstructed');
    return position;
  }
  function surfaceBounds() {
    const bounds = getSurfaceBounds();
    if (!bounds || !pair(bounds.min) || !pair(bounds.max) || bounds.min.some((value, axis) => value >= bounds.max[axis]
        || Math.abs(value) > CUBE_SPATIAL_LIMITS.maximumCoordinate || Math.abs(bounds.max[axis]) > CUBE_SPATIAL_LIMITS.maximumCoordinate)) {
      fail('This world has no bounded placement surface');
    }
    return bounds;
  }
  /** Object size is its maximum dimension, so this square/height envelope is
   * conservative before generation. It covers the entire uniformly fitted mesh,
   * rather than pretending a castle has the six-unit resident footprint. */
  function validatePlacement(key, input, size, { obstacles = [], transformExisting = false } = {}) {
    normalizeWorldObjectSize(size);
    // Resizing an authenticated existing object is not a navigation leg. The
    // caller binds this permission to that object's fixed retained location.
    const context = frame(key), position = validate(key, input, context, { enforceRange: !transformExisting }), bounds = surfaceBounds();
    const half = size / 2, padding = NAVIGATION_SENSORS.margin;
    const lower = [position[0] - half, context.floorHeight, position[2] - half];
    const upper = [position[0] + half, context.floorHeight + size, position[2] + half];
    if ([0, 2].some((axis, i) => lower[axis] < bounds.min[i] || upper[axis] > bounds.max[i])) {
      fail('The object footprint is outside the placement surface');
    }
    const overlaps = (min, max) => upper[1] > min[1] && lower[1] < max[1]
      && [0, 2].every(axis => upper[axis] + padding >= min[axis] && lower[axis] - padding <= max[axis]);
    const bodies = physics.world.bodies;
    if (bodies.length > 2048) fail('The local placement geometry limit was exceeded');
    const origin = new CANNON.Vec3(), rotation = new CANNON.Quaternion(), normal = new CANNON.Vec3();
    const shapeMin = new CANNON.Vec3(), shapeMax = new CANNON.Vec3();
    let count = 0;
    for (const body of bodies) {
      if (body.collisionResponse === false || !(body.collisionFilterGroup & context.entry.body.collisionFilterMask)
          || !(context.entry.body.collisionFilterGroup & body.collisionFilterMask)) continue;
      for (let index = 0; index < body.shapes.length; index++) {
        if (++count > 4096) fail('The local placement geometry limit was exceeded');
        const shape = body.shapes[index]; if (shape.collisionResponse === false) continue;
        body.pointToWorldFrame(body.shapeOffsets[index], origin);
        body.quaternion.mult(body.shapeOrientations[index], rotation);
        if (shape.type === CANNON.Shape.types.PLANE) {
          rotation.vmult(new CANNON.Vec3(0, 0, 1), normal);
          if (normal.y > .999999 && Math.abs(origin.y - context.floorHeight) < .01) continue;
          const center = [(lower[0] + upper[0]) / 2, (lower[1] + upper[1]) / 2, (lower[2] + upper[2]) / 2];
          const components = normal.toArray(), planeOrigin = origin.toArray();
          const distance = center.reduce((sum, value, axis) => sum + (value - planeOrigin[axis]) * components[axis], 0);
          const radius = components.reduce((sum, value, axis) => sum + Math.abs(value) * (upper[axis] - lower[axis]) / 2, 0);
          if (Math.abs(distance) <= radius + padding) fail('The object footprint intersects world geometry');
          continue;
        }
        shape.calculateWorldAABB(origin, rotation, shapeMin, shapeMax);
        const min = shapeMin.toArray(), max = shapeMax.toArray();
        if (![...min, ...max].every(Number.isFinite) || min.some((value, axis) => value > max[axis])) fail('World placement geometry is unavailable');
        if (overlaps(min, max)) fail('The object footprint is occupied or obstructed');
      }
    }
    if (!Array.isArray(obstacles) || obstacles.length > 128) fail('The placed object geometry limit was exceeded');
    for (const obstacle of obstacles) {
      const min = normalizeWorldGoalPosition(obstacle?.min), max = normalizeWorldGoalPosition(obstacle?.max);
      if (min.some((value, axis) => value > max[axis])) fail('Placed object geometry is unavailable');
      if (overlaps(min, max)) fail('The object footprint overlaps a placed object');
    }
    return [position[0], context.floorHeight, position[2]];
  }
  return {
    validate,
    validatePlacement,
    placement(key, size, target, options) {
      normalizeWorldObjectSize(size);
      const context = frame(key);
      let position;
      if (target === undefined) {
        const bounds = surfaceBounds(), current = context.entry.body.position;
        // Preserve the legacy nearby default. Explicit locations/participants
        // below never clamp or silently choose a different destination.
        position = [Math.min(bounds.max[0] - size, Math.max(bounds.min[0] + size, current.x + 6 + size / 2)),
          context.floorHeight, Math.min(bounds.max[1] - size, Math.max(bounds.min[1] + size, current.z))];
      } else {
        const chosen = normalizeWorldObjectTarget(target);
        if (chosen.kind === 'location') position = chosen.position;
        else {
          const participant = getParticipants(key).find(person => person.id === chosen.id && ['human', 'resident'].includes(person.kind));
          if (!participant) fail('The placement participant is no longer observed');
          position = normalizeWorldGoalPosition(participant.position);
          // A participant reference means beside that body, not inside it.
          // This is the same deterministic offset as the nearby default;
          // there is no search for an alternative unrequested location.
          position[0] += 6 + size / 2;
        }
      }
      return validatePlacement(key, position, size, options);
    },
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
