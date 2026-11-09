import * as CANNON from 'cannon-es';
import { MOTOR_DYNAMICS as D, clamp, encodeMotorObservation } from './motorContracts.js';
import { seededRandom } from './trainingEnvironment.js';
import { inflateNavigationObstacle, navigationRayDistance, sampleNavigationSensors } from './navigationSensors.js';

const length = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const clearSegment = (a, b, obstacles) => {
  const d = length(a, b); if (d < 1e-6) return true;
  const direction = b.map((v, i) => (v - a[i]) / d);
  return obstacles.every(box => navigationRayDistance(a, direction, box) > d - 1e-5);
};
export function navigationLayout(seed, kind = ['wall', 'doorway', 'box', 'clear'][seed % 4]) {
  const random = seededRandom(seed), x = random() * 6 - 3, z = random() * 10 - 5;
  const obstacles = [], span = 10 + random() * 9, thickness = 1 + random() * 1.5;
  if (kind === 'wall') obstacles.push({ min: [x - thickness, z - span], max: [x + thickness, z + span] });
  if (kind === 'box') {
    const half = 3 + random() * 4;
    obstacles.push({ min: [x - half, z - half], max: [x + half, z + half] });
  }
  if (kind === 'doorway') {
    const gap = 6 + random() * 4, door = z + random() * 8 - 4;
    obstacles.push({ min: [x - thickness, -30], max: [x + thickness, door - gap] },
      { min: [x - thickness, door + gap], max: [x + thickness, 30] });
  }
  const start = [-22 - random() * 12, random() * 20 - 10], target = [22 + random() * 12, random() * 20 - 10];
  const turns = Math.floor(random() * 4), rotate = p => {
    for (let i = 0; i < turns; i++) p = [-p[1], p[0]];
    return p;
  };
  return { seed, kind, start: rotate(start), target: rotate(target), stopDistance: 8 + random() * 4,
    obstacles: obstacles.map(box => { const a = rotate(box.min), b = rotate(box.max);
      return { min: a.map((v, i) => Math.min(v, b[i])), max: a.map((v, i) => Math.max(v, b[i])) }; }) };
}

/** Training-only full-geometry route teacher. Never imported by the live worker. */
export function createNavigationTeacher(obstacles) {
  const expanded = obstacles.map(box => inflateNavigationObstacle(box));
  const corners = expanded.flatMap(box => [[box.min[0] - .1, box.min[1] - .1], [box.max[0] + .1, box.min[1] - .1],
    [box.max[0] + .1, box.max[1] + .1], [box.min[0] - .1, box.max[1] + .1]])
    .filter(p => expanded.every(box => p.some((v, i) => v < box.min[i] || v > box.max[i])));
  const edges = corners.map(a => corners.map(b => clearSegment(a, b, expanded) ? length(a, b) : Infinity));
  return ({ position, target, velocity, targetVelocity = [0, 0], stopDistance }) => {
    let destination = target;
    const overlapping = expanded.filter(box => position.every((v, i) => v >= box.min[i] && v <= box.max[i]));
    if (overlapping.length) {
      // Recovery demonstrations, not runtime logic. A planning margin overlap
      // must not turn failed learner trajectories into labels that stay stuck.
      const exits = overlapping.flatMap(box => [[box.min[0] - .5, position[1]], [box.max[0] + .5, position[1]],
        [position[0], box.min[1] - .5], [position[0], box.max[1] + .5]])
        .filter(p => expanded.every(box => p.some((v, i) => v < box.min[i] || v > box.max[i])));
      exits.sort((a, b) => length(a, position) - length(b, position));
      if (exits.length) destination = exits[0];
    } else if (!clearSegment(position, target, expanded)) {
      const nodes = [...corners, position, target], start = nodes.length - 2, end = nodes.length - 1;
      const distance = Array(nodes.length).fill(Infinity), predecessor = [], done = new Set(); distance[start] = 0;
      const delta = target.map((v, i) => v - position[i]), goalLength = Math.max(1, Math.hypot(...delta));
      for (let iter = 0; iter < nodes.length; iter++) {
        let u = -1; for (let i = 0; i < nodes.length; i++) if (!done.has(i) && (u < 0 || distance[i] < distance[u])) u = i;
        if (u < 0 || !Number.isFinite(distance[u])) break; if (u === end) break; done.add(u);
        for (let v = 0; v < nodes.length; v++) {
          if (done.has(v) || v === u) continue;
          const cost = u < corners.length && v < corners.length ? edges[u][v]
            : clearSegment(nodes[u], nodes[v], expanded) ? length(nodes[u], nodes[v]) : Infinity;
          // Resolve symmetric demonstrations consistently in the target frame.
          const lateral = ((nodes[v][1] - position[1]) * delta[0] - (nodes[v][0] - position[0]) * delta[1]) / goalLength;
          const value = distance[u] + cost + (v === end ? 0 : Math.max(0, -lateral) * .002);
          if (value < distance[v]) { distance[v] = value; predecessor[v] = u; }
        }
      }
      let next = end; while (predecessor[next] !== undefined && predecessor[next] !== start) next = predecessor[next];
      if (predecessor[next] === start) destination = nodes[next];
      else return velocity.map(v => clamp(-v * 4, -D.maxAcceleration, D.maxAcceleration));
    }
    const delta = destination.map((v, i) => v - position[i]), distance = Math.hypot(...delta);
    const final = destination === target;
    const speed = final ? clamp((distance - stopDistance) * .85, -3, 5)
      : Math.min(3.5, Math.max(1.25, distance * 1.1));
    return velocity.map((v, i) => clamp(3.5 * ((distance > 1e-6 ? delta[i] / distance * speed : 0)
      + (final ? targetVelocity[i] : 0) - v) + D.dampingRate * v, -D.maxAcceleration, D.maxAcceleration));
  };
}

/** Actual Cannon contacts and the same owner force/damping contract as CubeChat. */
export function createNavigationEpisode(layout) {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -40, 0) });
  world.solver.iterations = 20; world.defaultContactMaterial.friction = .0001; world.defaultContactMaterial.restitution = .05;
  const body = new CANNON.Body({ mass: D.mass, linearDamping: D.linearDamping, fixedRotation: true,
    shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3)) });
  body.linearFactor.set(1, 0, 1); body.position.set(layout.start[0], 3, layout.start[1]); world.addBody(body);
  const targetBody = new CANNON.Body({ mass: 0, type: CANNON.Body.KINEMATIC,
    shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3)), position: new CANNON.Vec3(layout.target[0], 3, layout.target[1]) });
  world.addBody(targetBody);
  const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); world.addBody(ground);
  for (const box of layout.obstacles) {
    const half = box.max.map((v, i) => (v - box.min[i]) / 2), center = box.max.map((v, i) => (v + box.min[i]) / 2);
    const collider = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(half[0], 6, half[1])),
      position: new CANNON.Vec3(center[0], 3, center[1]) }); world.addBody(collider);
  }
  let action = [0, 0], control, target = [...layout.target], targetVelocity = [0, 0], contacts = 0, targetContacts = 0, ticks = 0;
  world.addEventListener('preStep', () => {
    const speed = Math.hypot(body.velocity.x, body.velocity.z), scale = Math.min(1, D.maxSpeed / Math.max(speed, 1e-9));
    body.velocity.x *= scale; body.velocity.z *= scale;
    body.force.x += action[0] * D.mass; body.force.z += action[1] * D.mass;
    // Like the live asynchronous worker, a fresh action starts next physics step.
    if (control) action = control().map(v => clamp(v, -D.maxAcceleration, D.maxAcceleration));
  });
  const state = () => ({ position: [body.position.x, body.position.z], target: [...target],
    velocity: [body.velocity.x, body.velocity.z], targetVelocity: [...targetVelocity], stopDistance: layout.stopDistance });
  const observation = () => {
    const s = state(); return { relativePosition: target.map((v, i) => v - s.position[i]), velocity: s.velocity,
      targetVelocity, stopDistance: layout.stopDistance, previousAcceleration: [...action],
      ...sampleNavigationSensors({ position: s.position, targetPosition: target, obstacles: layout.obstacles }) };
  };
  return { body, world, state, observation,
    step(next = action, moving = [0, 0], nextControl) {
      action = next.map(v => clamp(v, -D.maxAcceleration, D.maxAcceleration)); targetVelocity = moving;
      control = nextControl;
      targetBody.velocity.set(moving[0], 0, moving[1]); world.step(D.fixedDt); ticks++;
      target = [targetBody.position.x, targetBody.position.z];
      if (world.contacts.some(contact => (contact.bi === body || contact.bj === body)
        && contact.bi !== ground && contact.bj !== ground && contact.bi !== targetBody && contact.bj !== targetBody)) contacts++;
      if (world.contacts.some(contact => (contact.bi === body && contact.bj === targetBody) || (contact.bj === body && contact.bi === targetBody))) targetContacts++;
    }, get counters() { return { contacts, targetContacts, ticks }; } };
}

export function navigationSample(observation, action) {
  const encoded = encodeMotorObservation(observation), [dx, dz] = encoded.direction;
  return { input: encoded.input, output: Float32Array.from([
    clamp((action[0] * dx + action[1] * dz) / 12, -.999, .999),
    clamp((-action[0] * dz + action[1] * dx) / 12, -.999, .999)]) };
}

export function navigationRollout(action, layout, { seconds = 45, collect, teacher, follow = false, trajectory } = {}) {
  const episode = createNavigationEpisode(layout); let command = [0, 0], settled = 0, success = false, pathLength = 0, previous = [...layout.start];
  let stationarySeconds = 0, targetError = Infinity;
  for (let tick = 0; tick < seconds / D.fixedDt; tick++) {
    const nextControl = tick % D.controlSteps === 0 ? () => {
      const obs = episode.observation(); command = action(obs, episode.state());
      if (collect) collect(navigationSample(obs, teacher(episode.state())));
      trajectory?.push({ time: tick * D.fixedDt, ...episode.state(), observation: obs, action: [...command],
        ...(teacher ? { teacher: teacher(episode.state()) } : {}) });
      return command;
    } : undefined;
    const motion = follow && tick * D.fixedDt > 18 ? [0, Math.sin(tick * D.fixedDt / 6) * .8] : [0, 0];
    episode.step(undefined, motion, nextControl); const state = episode.state();
    pathLength += length(previous, state.position); previous = state.position;
    const obs = episode.observation(), speed = Math.hypot(...state.velocity.map((v, i) => v - state.targetVelocity[i]));
    targetError = Math.abs(Math.hypot(...obs.relativePosition) - layout.stopDistance);
    if (Math.hypot(...state.velocity) < .2 && targetError > 2) stationarySeconds += D.fixedDt;
    if (obs.targetClear && targetError <= 1.5 && speed < .6) settled += D.fixedDt; else settled = 0;
    if (settled > .75 && (!follow || tick * D.fixedDt > seconds - 4)) { success = true; if (!follow) break; }
    if (!command.every(Number.isFinite) || Math.hypot(...state.position) > 200) break;
  }
  return { seed: layout.seed, kind: layout.kind, success, targetError, pathLength, stationarySeconds,
    collisionSeconds: episode.counters.contacts * D.fixedDt, targetContactSeconds: episode.counters.targetContacts * D.fixedDt,
    elapsedSeconds: episode.counters.ticks * D.fixedDt,
    finite: [...episode.state().position, ...episode.state().velocity].every(Number.isFinite) };
}
export function evaluateNavigation(action, { count = 100, seed = 870000, seconds = 45 } = {}) {
  const episodes = Array.from({ length: count }, (_, i) => navigationRollout(action, navigationLayout(seed + i * 101), { seconds }));
  const summarize = rows => ({ episodes: rows.length, successRate: rows.filter(e => e.success && e.finite).length / rows.length,
    collisionSeconds: rows.reduce((s, e) => s + e.collisionSeconds, 0) / rows.length,
    stuckSeconds: rows.reduce((s, e) => s + e.stationarySeconds, 0) / rows.length });
  return { ...summarize(episodes), families: Object.fromEntries(['wall', 'doorway', 'box', 'clear'].map(kind => [kind, summarize(episodes.filter(e => e.kind === kind))])), episodes };
}
