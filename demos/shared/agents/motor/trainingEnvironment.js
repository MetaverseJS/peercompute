import { MOTOR_DYNAMICS as D, clamp, encodeMotorObservation, decodeMotorAction } from './motorContracts.js';

export function seededRandom(seed) {
  let state = seed >>> 0 || 1;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
/** Cannon damps first; the scene's preStep hook clamps speed before force integration. */
export function stepMotorState(state, acceleration, dt = D.fixedDt) {
  const damping = Math.pow(1 - D.linearDamping, dt);
  const speed = Math.hypot(...state.velocity) * damping, scale = Math.min(1, D.maxSpeed / Math.max(speed, 1e-9));
  const velocity = state.velocity.map((v, i) => v * damping * scale + clamp(acceleration[i], -D.maxAcceleration, D.maxAcceleration) * dt);
  return { position: state.position.map((p, i) => p + velocity[i] * dt), velocity };
}
/** Explicit demonstration teacher. This is never used to move a live resident. */
export function demonstrationAction(observation) {
  const sample = demonstrationSample(observation);
  return decodeMotorAction(sample.output, encodeMotorObservation(observation).direction);
}
export function demonstrationSample(observation) {
  const encoded = encodeMotorObservation(observation), input = encoded.input;
  const speed = Math.min(D.maxSpeed, Math.max(0, Math.hypot(...observation.relativePosition) - observation.stopDistance) * 0.85);
  // Teach in the same egocentric actuator frame as the actor. World-axis clamps
  // happen after decoding for both teacher and learner; orientation is not hidden.
  return { input, output: Float32Array.from([0, 1].map(i => clamp((3.5 * ((i ? 0 : speed)
    + input[4 + i] * 5 - input[2 + i] * 5) + D.dampingRate * input[2 + i] * 5) / D.maxAcceleration, -0.999, 0.999))) };
}
export function randomObservation(random) {
  const angle = random() * Math.PI * 2, stopDistance = 6 + random() * 10;
  const error = random() < 0.6 ? (random() * 12 - 3) : random() * 70;
  const distance = Math.max(0.1, stopDistance + error), moving = random() < 0.45;
  const zero = random() < 0.2;
  return { relativePosition: [Math.cos(angle) * distance, Math.sin(angle) * distance],
    velocity: zero ? [0, 0] : [(random() * 2 - 1) * 5, (random() * 2 - 1) * 5],
    targetVelocity: moving ? [(random() * 2 - 1) * 2, (random() * 2 - 1) * 2] : [0, 0], stopDistance };
}
export function rolloutPolicy(action, { seed = 9001, follow = false, seconds = 24 } = {}) {
  const random = seededRandom(seed), angle = random() * Math.PI * 2, distance = 18 + random() * 35;
  let state = { position: [Math.cos(angle) * distance, Math.sin(angle) * distance], velocity: [0, 0] };
  let target = [0, 0], acceleration = [0, 0], settled = 0, success = false, errorTotal = 0, samples = 0, maximumSpeed = 0;
  const stopDistance = 8 + random() * 4;
  for (let tick = 0; tick < seconds / D.fixedDt; tick++) {
    const time = tick * D.fixedDt;
    const targetVelocity = follow && time >= 6 ? [1.4 * Math.cos(time / 5 + angle), 1.4 * Math.sin(time / 5 + angle)] : [0, 0];
    if (tick % D.controlSteps === 0) acceleration = action({ relativePosition: target.map((v, i) => v - state.position[i]), velocity: state.velocity,
      targetVelocity, stopDistance });
    state = stepMotorState(state, acceleration); target = target.map((v, i) => v + targetVelocity[i] * D.fixedDt);
    const error = Math.hypot(...target.map((v, i) => v - state.position[i])) - stopDistance;
    const relativeSpeed = Math.hypot(...state.velocity.map((v, i) => v - targetVelocity[i]));
    maximumSpeed = Math.max(maximumSpeed, Math.hypot(...state.velocity));
    if (Math.abs(error) <= 1.5 && relativeSpeed < 0.5) settled += D.fixedDt; else settled = 0;
    if (settled >= 0.75 && (!follow || time > seconds - 6)) success = true;
    if (time > seconds - 6) { errorTotal += Math.abs(error); samples++; }
  }
  return { success, finalError: Math.abs(Math.hypot(...target.map((v, i) => v - state.position[i])) - stopDistance),
    meanTailError: errorTotal / samples, maximumSpeed, finite: [...state.position, ...state.velocity].every(Number.isFinite) };
}
export function evaluatePolicy(action, count = 40) {
  const summarize = follow => {
    const episodes = Array.from({ length: count }, (_, i) => rolloutPolicy(action, { seed: 810000 + i * 101, follow }));
    return { episodes: count, successRate: episodes.filter(e => e.success && e.finite).length / count,
      meanTailError: episodes.reduce((sum, e) => sum + e.meanTailError, 0) / count,
      maxSpeed: Math.max(...episodes.map(e => e.maximumSpeed)), finite: episodes.every(e => e.finite) };
  };
  return { approach: summarize(false), follow: summarize(true) };
}
