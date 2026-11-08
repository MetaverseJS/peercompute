const modes = new Set(['stationary', 'roam', 'follow']);
const point = (value) => {
  if (!Array.isArray(value) || value.length !== 3 || value.some((part) => !Number.isFinite(part) || Math.abs(part) > 1_000_000)) {
    throw new TypeError('Resident motion requires bounded coordinates');
  }
  return [...value];
};

/** Deterministic, ground-constrained steering. This is a scripted motor, not a learned policy. */
export class WorldResidentMotion {
  constructor({ key, position, mode = 'stationary', speed = 5, radius = 24, followDistance = 10 } = {}) {
    if (typeof key !== 'string' || !key || key.length > 300) throw new TypeError('A resident motion key is required');
    if (!Number.isFinite(speed) || speed <= 0 || speed > 20 || !Number.isFinite(radius) || radius < 1 || radius > 250
        || !Number.isFinite(followDistance) || followDistance < 6 || followDistance > 100) throw new RangeError('Invalid resident motion bounds');
    this.anchor = point(position); this.speed = speed; this.radius = radius; this.followDistance = followDistance;
    this.seed = 2166136261;
    for (const character of key) this.seed = Math.imul(this.seed ^ character.charCodeAt(0), 16777619) >>> 0;
    this.destination = null; this.setMode(mode);
  }

  setMode(mode) {
    if (!modes.has(mode)) throw new TypeError('Unknown resident movement mode');
    this.mode = mode; this.destination = null;
  }

  random() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  step({ position, target, dt, status = 'idle', obstacles = [] } = {}) {
    const current = point(position);
    if (!Number.isFinite(dt) || dt < 0) throw new TypeError('Resident timestep must be nonnegative');
    if (!Array.isArray(obstacles) || obstacles.length > 256) throw new RangeError('Too many resident obstacles');
    const occupied = obstacles.map(point);
    if (this.mode === 'stationary' || status !== 'idle' || dt === 0) return current;
    let destination;
    if (this.mode === 'follow') {
      if (!target) return current;
      destination = point(target);
    } else {
      if (!this.destination || Math.hypot(this.destination[0] - current[0], this.destination[2] - current[2]) < 1) {
        const angle = this.random() * Math.PI * 2, distance = this.radius * (0.3 + this.random() * 0.7);
        this.destination = [this.anchor[0] + Math.sin(angle) * distance, current[1], this.anchor[2] + Math.cos(angle) * distance];
      }
      destination = this.destination;
    }
    const x = destination[0] - current[0], z = destination[2] - current[2], distance = Math.hypot(x, z);
    const remaining = distance - (this.mode === 'follow' ? this.followDistance : 0);
    if (remaining <= 0) return current;
    // Background tabs cannot accumulate a large teleport or a jump on resume.
    const travel = Math.min(this.speed * Math.min(dt, 0.1), remaining);
    const next = [current[0] + x / distance * travel, current[1], current[2] + z / distance * travel];
    if (next.some((part) => Math.abs(part) > 1_000_000)) return current;
    if (occupied.some((other) => Math.hypot(other[0] - next[0], other[2] - next[2]) < 7
        && Math.hypot(other[0] - next[0], other[2] - next[2]) < Math.hypot(other[0] - current[0], other[2] - current[2]))) {
      if (this.mode === 'roam') this.destination = null;
      return current;
    }
    return next;
  }
}
