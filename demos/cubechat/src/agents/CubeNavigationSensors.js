import * as CANNON from 'cannon-es';
import { NAVIGATION_SENSORS, sampleNavigationSensors } from '../../../shared/agents/motor/navigationSensors.js';

const MAXIMUM_BODIES = 2048;

/** Local collision sensing only. Never publish these bounds as resident context.
 * Rotated/compound boxes use their conservative world AABBs; visual terrain and
 * display names do not establish collision geometry or target identity. */
export function createCubeNavigationSensors({ physics, getEntries }) {
  if (!physics?.world || typeof getEntries !== 'function') throw new TypeError('Navigation requires local physics and bodies');
  const origin = new CANNON.Vec3(), rotation = new CANNON.Quaternion();
  const lower = new CANNON.Vec3(), upper = new CANNON.Vec3();
  return {
    sample(key, target) {
      const entry = getEntries().get(key);
      if (!entry?.descriptor.local) throw new Error('Navigation observations belong to the resident owner');
      const self = entry.body;
      const targetBody = target.kind === 'human'
        ? physics.getPlayerBody?.(target.peerId) ?? physics.bodies?.get(target.peerId)
        : [...getEntries().values()].find(other => other.descriptor.agentId === target.agentId
          && other.descriptor.ownerPeerId === target.ownerPeerId)?.body;
      const position = [self.position.x, self.position.z];
      const targetPosition = targetBody ? [targetBody.position.x, targetBody.position.z] : [target.position[0], target.position[2]];
      const padding = NAVIGATION_SENSORS.halfSize + NAVIGATION_SENSORS.margin;
      const range = NAVIGATION_SENSORS.range + padding;
      const area = { min: position.map((v, i) => Math.min(v - range, targetPosition[i] - padding)),
        max: position.map((v, i) => Math.max(v + range, targetPosition[i] + padding)) };
      const obstacles = [], bodies = physics.world.bodies;
      if (bodies.length > MAXIMUM_BODIES) throw new RangeError('Local navigation body limit exceeded');
      for (const body of bodies) {
        if (body === self || body === targetBody || body.collisionResponse === false
            || !(body.collisionFilterGroup & self.collisionFilterMask)
            || !(self.collisionFilterGroup & body.collisionFilterMask)) continue;
        for (let i = 0; i < body.shapes.length; i++) {
          const shape = body.shapes[i];
          if (shape.type !== CANNON.Shape.types.BOX || shape.collisionResponse === false) continue;
          body.pointToWorldFrame(body.shapeOffsets[i], origin);
          body.quaternion.mult(body.shapeOrientations[i], rotation);
          shape.calculateWorldAABB(origin, rotation, lower, upper);
          if (upper.y <= self.position.y - NAVIGATION_SENSORS.halfSize
              || lower.y >= self.position.y + NAVIGATION_SENSORS.halfSize
              || upper.x < area.min[0] || lower.x > area.max[0]
              || upper.z < area.min[1] || lower.z > area.max[1]) continue;
          if (obstacles.length >= NAVIGATION_SENSORS.maximumObstacles) throw new RangeError('Local navigation collider limit exceeded');
          obstacles.push({ min: [lower.x, lower.z], max: [upper.x, upper.z] });
        }
      }
      return { ...sampleNavigationSensors({ position, targetPosition, obstacles }),
        relativePosition: targetPosition.map((value, index) => value - position[index]) };
    },
  };
}
