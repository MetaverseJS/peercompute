/** Local geometric sensing only. This module does not select routes or controls. */
export const NAVIGATION_SENSORS = Object.freeze({ range: 64, rays: 32, halfSize: 3, margin: 0.5, maximumObstacles: 256 });
const point = value => Array.isArray(value) && value.length === 2 && value.every(v => Number.isFinite(v) && Math.abs(v) <= 1e7);
export function inflateNavigationObstacle(obstacle, padding = NAVIGATION_SENSORS.halfSize + NAVIGATION_SENSORS.margin) {
  if (!point(obstacle?.min) || !point(obstacle?.max) || obstacle.min.some((v, i) => v > obstacle.max[i])
    || !Number.isFinite(padding) || padding < 0 || padding > 100) throw new TypeError('Invalid navigation obstacle');
  return { min: obstacle.min.map(v => v - padding), max: obstacle.max.map(v => v + padding) };
}
/** Distance to a closed AABB along a unit ray; Infinity means no forward hit. */
export function navigationRayDistance(position, direction, obstacle) {
  let near = -Infinity, far = Infinity;
  for (let axis = 0; axis < 2; axis++) {
    if (Math.abs(direction[axis]) < 1e-10) {
      if (position[axis] < obstacle.min[axis] || position[axis] > obstacle.max[axis]) return Infinity;
      continue;
    }
    const a = (obstacle.min[axis] - position[axis]) / direction[axis], b = (obstacle.max[axis] - position[axis]) / direction[axis];
    near = Math.max(near, Math.min(a, b)); far = Math.min(far, Math.max(a, b));
  }
  return far < Math.max(0, near) ? Infinity : Math.max(0, near);
}
export function sampleNavigationSensors({ position, targetPosition, obstacles = [] } = {}) {
  if (!point(position) || !point(targetPosition) || !Array.isArray(obstacles) || obstacles.length > NAVIGATION_SENSORS.maximumObstacles) throw new TypeError('Invalid navigation sensor scene');
  const visibilityBounds = obstacles.map(obstacle => inflateNavigationObstacle(obstacle));
  const expanded = obstacles.map((obstacle, index) => {
    const padded = visibilityBounds[index];
    // The optional preferred margin may overlap after a collision/disturbance.
    // Do not erase every outward ray: retain actual footprint geometry there.
    return position.every((v, i) => v >= padded.min[i] && v <= padded.max[i])
      ? inflateNavigationObstacle(obstacle, NAVIGATION_SENSORS.halfSize - .05) : padded;
  });
  const delta = targetPosition.map((v, i) => v - position[i]), distance = Math.hypot(...delta);
  const heading = distance > 1e-9 ? Math.atan2(delta[1], delta[0]) : 0;
  const clearance = Array.from({ length: NAVIGATION_SENSORS.rays }, (_, index) => {
    const angle = heading + index * Math.PI * 2 / NAVIGATION_SENSORS.rays, direction = [Math.cos(angle), Math.sin(angle)];
    return Math.min(NAVIGATION_SENSORS.range, ...expanded.map(obstacle => navigationRayDistance(position, direction, obstacle))) / NAVIGATION_SENSORS.range;
  });
  const direction = distance > 1e-9 ? delta.map(v => v / distance) : [1, 0];
  // Arrival never borrows recovery's numerical tolerance or relaxed margin.
  // A zero-length segment still occupies its origin. The endpoint tolerance
  // must not turn an embedded source/target into a clear arrival.
  const targetClear = visibilityBounds.every(obstacle => distance <= 1e-6
    ? position.some((value, index) => value < obstacle.min[index] || value > obstacle.max[index])
    : navigationRayDistance(position, direction, obstacle) >= distance - 1e-6);
  return { clearance, targetClear };
}
