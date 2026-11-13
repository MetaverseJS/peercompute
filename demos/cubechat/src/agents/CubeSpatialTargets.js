import * as CANNON from 'cannon-es';
import { normalizeWorldGoalPosition } from '../../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';
import { NAVIGATION_SENSORS } from '../../../shared/agents/motor/navigationSensors.js';
import { normalizeWorldObjectSize } from '../../../shared/world/WorldModelScale.js';
import { normalizeWorldObjectTarget } from '../../../shared/agents/WorldObjectAction.js';
import { nearestPlacement } from '../../../shared/world/nearestPlacement.js';

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
  function validate(key, input, context = frame(key), { enforceRange = true, checkOccupancy = true } = {}) {
    const position = normalizeWorldGoalPosition(input), { entry, spatial } = context;
    if (position.some(value => Math.abs(value) > CUBE_SPATIAL_LIMITS.maximumCoordinate)) fail('Destination is outside this world');
    const planar = [position[0], position[2]];
    if (planar.some((value, axis) => value < spatial.bounds.min[axis] || value > spatial.bounds.max[axis])) fail('Destination is outside the walking surface');
    if (enforceRange && Math.hypot(position[0] - entry.body.position.x, position[2] - entry.body.position.z) > spatial.maximumLegDistance) {
      fail('Destination is beyond the current movement range');
    }
    if (checkOccupancy && !sensors.sample(key, { kind: 'location', position }).destinationClear) fail('The destination is occupied or obstructed');
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
  /** Local forbidden center regions, shared by strict checks and nearest-space
   * search. Retain navigation's clearance for small props as well as the whole
   * fitted mesh envelope; private collider identities never leave this module. */
  function placementObstacles(context, size, obstacles) {
    const half = size / 2, padding = NAVIGATION_SENSORS.margin, result = [];
    const rectangle = (min, max, radius, message) => result.push({ message, planes: [
      { normal: [1, 0], offset: max[0] + radius }, { normal: [-1, 0], offset: -min[0] + radius },
      { normal: [0, 1], offset: max[2] + radius }, { normal: [0, -1], offset: -min[2] + radius }
    ] });
    const overlapsHeight = (min, max) => context.floorHeight + size > min[1] && context.floorHeight < max[1];
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
          const offset = normal.dot(origin) - normal.y * (context.floorHeight + half);
          const radius = half * (Math.abs(normal.x) + Math.abs(normal.y) + Math.abs(normal.z)) + padding;
          if (Math.hypot(normal.x, normal.z) < 1e-12) {
            if (Math.abs(offset) <= radius) result.push({ planes: [], message: 'The object footprint intersects world geometry' });
          } else result.push({ message: 'The object footprint intersects world geometry', planes: [
            { normal: [normal.x, normal.z], offset: offset + radius },
            { normal: [-normal.x, -normal.z], offset: -offset + radius }
          ] });
          continue;
        }
        shape.calculateWorldAABB(origin, rotation, shapeMin, shapeMax);
        const min = shapeMin.toArray(), max = shapeMax.toArray();
        if (![...min, ...max].every(Number.isFinite) || min.some((value, axis) => value > max[axis])) fail('World placement geometry is unavailable');
        if (overlapsHeight(min, max)) rectangle(min, max, half + padding, 'The object footprint is occupied or obstructed');
        if (body !== context.entry.body && shape.type === CANNON.Shape.types.BOX
            && max[1] > context.entry.body.position.y - NAVIGATION_SENSORS.halfSize
            && min[1] < context.entry.body.position.y + NAVIGATION_SENSORS.halfSize) {
          rectangle(min, max, NAVIGATION_SENSORS.halfSize + padding, 'The destination is occupied or obstructed');
        }
      }
    }
    if (!Array.isArray(obstacles) || obstacles.length > 128) fail('The placed object geometry limit was exceeded');
    for (const obstacle of obstacles) {
      const min = normalizeWorldGoalPosition(obstacle?.min), max = normalizeWorldGoalPosition(obstacle?.max);
      if (min.some((value, axis) => value > max[axis])) fail('Placed object geometry is unavailable');
      if (overlapsHeight(min, max)) rectangle(min, max, half + padding, 'The object footprint overlaps a placed object');
    }
    return result;
  }
  /** Object size is its maximum dimension, so this square/height envelope is
   * conservative before generation and covers the entire uniformly fitted mesh. */
  function validatePlacement(key, input, size, { obstacles = [], transformExisting = false } = {}) {
    normalizeWorldObjectSize(size);
    // Existing-object transforms remain fixed in X/Z, regardless of range.
    const context = frame(key), position = validate(key, input, context, { enforceRange: !transformExisting }), bounds = surfaceBounds();
    const half = size / 2;
    if ([0, 2].some((axis, i) => position[axis] - half < bounds.min[i] || position[axis] + half > bounds.max[i])) {
      fail('The object footprint is outside the placement surface');
    }
    for (const obstacle of placementObstacles(context, size, obstacles)) {
      if (obstacle.planes.every(({ normal, offset }) => normal[0] * position[0] + normal[1] * position[2] <= offset)) fail(obstacle.message);
    }
    return [position[0], context.floorHeight, position[2]];
  }
  return {
    validate,
    validatePlacement,
    placement(key, size, target, options = {}) {
      normalizeWorldObjectSize(size);
      const context = frame(key);
      let position;
      if (target === undefined) {
        const current = context.entry.body.position;
        validate(key, current.toArray(), context, { checkOccupancy: false, enforceRange: !options.transformExisting });
        position = [current.x + 6 + size / 2, context.floorHeight, current.z];
      } else {
        const chosen = normalizeWorldObjectTarget(target);
        if (chosen.kind === 'location') position = validate(key, chosen.position, context,
          { checkOccupancy: false, enforceRange: !options.transformExisting });
        else {
          const participant = getParticipants(key).find(person => person.id === chosen.id && ['human', 'resident'].includes(person.kind));
          if (!participant) fail('The placement participant is no longer observed');
          position = validate(key, participant.position, context, { checkOccupancy: false, enforceRange: !options.transformExisting });
          // A participant reference means beside that body, not inside it.
          // Authorize the observed participant first. This desired offset may
          // move inward at an edge, without replacing the participant identity.
          position[0] += 6 + size / 2;
        }
      }
      if (options.transformExisting) return validatePlacement(key, position, size, options);
      const surface = surfaceBounds(), walking = context.spatial.bounds, half = size / 2;
      const bounds = { min: surface.min.map((value, axis) => Math.max(value + half, walking.min[axis])),
        max: surface.max.map((value, axis) => Math.min(value - half, walking.max[axis])) };
      if (bounds.min.some((value, axis) => value > bounds.max[axis])) fail('The object footprint is outside the placement surface');
      const point = nearestPlacement({ target: [position[0], position[2]], bounds,
        range: { center: [context.entry.body.position.x, context.entry.body.position.z], radius: context.spatial.maximumLegDistance },
        obstacles: placementObstacles(context, size, options.obstacles ?? []) });
      if (!point) fail('No clear placement fits nearby within the walking surface and movement range');
      // Current geometry remains authoritative; this is also called again by
      // the generation/retention pipeline before publishing the exact point.
      return validatePlacement(key, [point[0], context.floorHeight, point[1]], size, options);
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
