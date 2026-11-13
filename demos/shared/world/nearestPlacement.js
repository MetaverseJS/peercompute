// Touching an obstacle is blocked. A small world-unit gap makes the closest
// admissible boundary stable under floating-point collision calculations.
export const PLACEMENT_CLEARANCE = 1e-4;
const TOLERANCE = 1e-9;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const distance2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const pair = value => Array.isArray(value) && value.length === 2 && Number.isFinite(value[0]) && Number.isFinite(value[1]);
const limit = () => { const error = new Error('The nearby placement search limit was reached; try another location');
  error.code = 'PLACEMENT_SEARCH_LIMIT'; throw error; };

function clip(polygon, normal, offset) {
  const result = [];
  for (let index = 0; index < polygon.length; index++) {
    const a = polygon[index], b = polygon[(index + 1) % polygon.length];
    const da = dot(normal, a) - offset, db = dot(normal, b) - offset;
    if (da <= 0) result.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const fraction = da / (da - db);
      result.push(a.map((value, axis) => value + fraction * (b[axis] - value)));
    }
  }
  return result.filter((point, index) => !index || distance2(point, result[index - 1]) > 1e-20);
}

function insidePolygon(point, polygon) {
  // A full-width model can leave a line or a single allowed center. Cross
  // products alone would call every point inside such a collapsed polygon.
  if (!polygon.length || [0, 1].some(axis => point[axis] < Math.min(...polygon.map(vertex => vertex[axis])) - TOLERANCE
      || point[axis] > Math.max(...polygon.map(vertex => vertex[axis])) + TOLERANCE)) return false;
  return polygon.every((a, index) => {
    const b = polygon[(index + 1) % polygon.length];
    return (b[0] - a[0]) * (point[1] - a[1]) - (b[1] - a[1]) * (point[0] - a[0]) >= -TOLERANCE;
  });
}

/** Closest point in a convex polygon intersected with a disk. Its boundary is
 * made only of line segments and circle arcs, so these projections/intersections
 * cover the exact continuous candidates; no grid or radial sampling is needed. */
function closestPoint(target, polygon, range) {
  if (!polygon.length) return null;
  const inRange = point => !range || distance2(point, range.center) <= range.radius ** 2 + TOLERANCE;
  let best = null, bestDistance = Infinity;
  const consider = point => {
    if (!inRange(point)) return;
    const distance = distance2(target, point);
    if (distance < bestDistance || (distance === bestDistance && (!best || point[0] < best[0]
        || (point[0] === best[0] && point[1] < best[1])))) { best = point; bestDistance = distance; }
  };
  if (insidePolygon(target, polygon)) consider(target);
  if (range) {
    const delta = target.map((value, axis) => value - range.center[axis]), length = Math.hypot(...delta);
    const radial = length ? range.center.map((value, axis) => value + delta[axis] * range.radius / length) : range.center;
    if (insidePolygon(radial, polygon)) consider(radial);
  }
  for (let index = 0; index < polygon.length; index++) {
    const a = polygon[index], b = polygon[(index + 1) % polygon.length], delta = b.map((value, axis) => value - a[axis]);
    const length2 = dot(delta, delta); consider(a);
    if (!length2) continue;
    const fraction = Math.max(0, Math.min(1, dot(target.map((value, axis) => value - a[axis]), delta) / length2));
    consider(a.map((value, axis) => value + fraction * delta[axis]));
    if (!range) continue;
    const length = Math.sqrt(length2), direction = delta.map(value => value / length);
    const relative = a.map((value, axis) => value - range.center[axis]), projection = dot(relative, direction);
    const perpendicular = relative[0] * direction[1] - relative[1] * direction[0];
    const remainder = range.radius ** 2 - perpendicular ** 2;
    if (remainder < -TOLERANCE) continue;
    const halfChord = Math.sqrt(Math.max(0, remainder));
    const foot = [range.center[0] + perpendicular * direction[1], range.center[1] - perpendicular * direction[0]];
    for (const sign of [-1, 1]) {
      const at = -projection + sign * halfChord;
      if (at >= 0 && at <= length) consider(foot.map((value, axis) => value + sign * halfChord * direction[axis]));
    }
  }
  return best;
}

/** Find the nearest free center in bounds ∩ range. Each forbidden convex region
 * is an intersection of half-planes normal·point <= offset; [] blocks all space.
 * Best-first subtraction preserves all remaining space and orders it by exact
 * distance lower bounds. A budget failure never returns a farther first-fit. */
export function nearestPlacement({ target, bounds, range, obstacles = [], maximumRegions = 4096 } = {}) {
  if (!pair(target) || !pair(bounds?.min) || !pair(bounds?.max)
      || bounds.min.some((value, axis) => value > bounds.max[axis])
      || (range && (!pair(range.center) || !Number.isFinite(range.radius) || range.radius <= 0))
      || !Array.isArray(obstacles) || obstacles.length > 8320
      || !Number.isInteger(maximumRegions) || maximumRegions < 1 || maximumRegions > 4096) {
    throw new TypeError('Invalid nearest placement geometry');
  }
  const blockers = obstacles.map(obstacle => {
    if (!Array.isArray(obstacle?.planes) || obstacle.planes.length > 8) throw new TypeError('Invalid placement obstacle');
    return obstacle.planes.map(({ normal, offset }) => {
      if (!pair(normal) || !Number.isFinite(offset)) throw new TypeError('Invalid placement plane');
      const length = Math.hypot(...normal);
      if (length < 1e-12) throw new TypeError('Invalid placement plane normal');
      return { normal: normal.map(value => value / length), offset: offset / length + PLACEMENT_CLEARANCE };
    });
  });
  const queue = []; let regions = 0, checks = 0;
  const less = (a, b) => a.distance < b.distance || (a.distance === b.distance
    && (a.point[0] < b.point[0] || (a.point[0] === b.point[0] && a.point[1] < b.point[1])));
  const enqueue = polygon => {
    if (polygon.length > 128) limit();
    const point = closestPoint(target, polygon, range); if (!point) return;
    if (++regions > maximumRegions) limit();
    const region = { polygon, point, distance: distance2(target, point) }; queue.push(region);
    for (let child = queue.length - 1; child > 0;) {
      const parent = (child - 1) >> 1; if (!less(queue[child], queue[parent])) break;
      [queue[child], queue[parent]] = [queue[parent], queue[child]]; child = parent;
    }
  };
  const dequeue = () => {
    const first = queue[0], last = queue.pop();
    if (queue.length) {
      queue[0] = last;
      for (let parent = 0;;) {
        let child = parent * 2 + 1; if (child >= queue.length) break;
        if (child + 1 < queue.length && less(queue[child + 1], queue[child])) child++;
        if (!less(queue[child], queue[parent])) break;
        [queue[parent], queue[child]] = [queue[child], queue[parent]]; parent = child;
      }
    }
    return first;
  };
  const [minX, minZ] = bounds.min.map((value, axis) => range ? Math.max(value, range.center[axis] - range.radius) : value);
  const [maxX, maxZ] = bounds.max.map((value, axis) => range ? Math.min(value, range.center[axis] + range.radius) : value);
  if (minX > maxX || minZ > maxZ) return null;
  enqueue([[minX, minZ], [maxX, minZ], [maxX, maxZ], [minX, maxZ]]);
  while (queue.length) {
    const { polygon, point } = dequeue();
    const blocker = blockers.find(planes => planes.every(({ normal, offset }) => {
      if (++checks > 1_000_000) limit();
      // Split boundaries are already beyond the original obstacle by clearance.
      return dot(normal, point) < offset - TOLERANCE;
    }));
    if (!blocker) {
      // Analytic circle intersections can round a few ULPs outside the disk.
      // Move imperceptibly toward its nearest point in the allowed rectangle;
      // the rectangle is convex and the obstacle clearance absorbs this nudge.
      if (range && Math.hypot(point[0] - range.center[0], point[1] - range.center[1]) > range.radius) {
        const inward = range.center.map((value, axis) => Math.max(bounds.min[axis], Math.min(bounds.max[axis], value)));
        for (let fraction = 1e-12; fraction <= 1; fraction *= 10) {
          const adjusted = point.map((value, axis) => value + (inward[axis] - value) * Math.min(1, fraction));
          if (distance2(point, adjusted) > (PLACEMENT_CLEARANCE / 10) ** 2) break;
          if (Math.hypot(adjusted[0] - range.center[0], adjusted[1] - range.center[1]) <= range.radius) return adjusted;
        }
        limit();
      }
      return point;
    }
    let remaining = polygon;
    for (const { normal, offset } of blocker) {
      enqueue(clip(remaining, normal.map(value => -value), -offset));
      remaining = clip(remaining, normal, offset);
      if (!remaining.length) break;
    }
  }
  return null;
}
