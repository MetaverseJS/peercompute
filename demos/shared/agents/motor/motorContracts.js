import { NAVIGATION_SENSORS } from './navigationSensors.js';
/** Shared by the real Cannon body, seeded training environment and policy host. */
export const MOTOR_DYNAMICS = Object.freeze({ fixedDt: 1 / 60, mass: 5, maxSpeed: 5,
  maxAcceleration: 12, dampingRate: 0.8, linearDamping: 1 - Math.exp(-0.8),
  controlSteps: 6, maximumResidents: 16, defaultStopDistance: 10 });
export const MOTOR_INPUTS = 40;
export const MOTOR_HIDDEN = 64;
export const MOTOR_SCHEMA = 'peercompute.resident-motor.v2';
export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const pair = (value, limit, name) => {
  if (!Array.isArray(value) || value.length !== 2 || value.some(v => !Number.isFinite(v) || Math.abs(v) > limit)) {
    throw new TypeError(`Invalid motor ${name}`);
  }
  return [...value];
};
export function validateMotorObservation(value) {
  const stopDistance = value?.stopDistance;
  if (!Number.isFinite(stopDistance) || stopDistance < 2 || stopDistance > 40) throw new TypeError('Invalid motor stopping distance');
  const clearance = value.clearance ?? Array(NAVIGATION_SENSORS.rays).fill(1);
  if (!Array.isArray(clearance) || clearance.length !== NAVIGATION_SENSORS.rays || clearance.some(v => !Number.isFinite(v) || v < 0 || v > 1)
    || (value.targetClear !== undefined && typeof value.targetClear !== 'boolean')) throw new TypeError('Invalid navigation clearance');
  return { relativePosition: pair(value.relativePosition, 2000, 'relative position'),
    // World participant sensing already bounds each component to ±50. Humans
    // can exceed resident speed; accept that sensor domain before the existing
    // normalized feature saturation below. This does not raise motor output speed.
    velocity: pair(value.velocity, 40, 'velocity'), targetVelocity: pair(value.targetVelocity, 50, 'target velocity'), stopDistance,
    clearance: [...clearance], targetClear: value.targetClear ?? true,
    previousAcceleration: pair(value.previousAcceleration ?? [0, 0], 24, 'previous acceleration') };
}

/** Rotation-equivariant sensor encoding, not a navigation controller. */
export function encodeMotorObservation(raw) {
  const observation = validateMotorObservation(raw), [x, z] = observation.relativePosition;
  const distance = Math.hypot(x, z), direction = distance > 1e-6 ? [x / distance, z / distance] : [1, 0];
  const [dx, dz] = direction, [vx, vz] = observation.velocity, [tx, tz] = observation.targetVelocity;
  const values = [clamp((distance - observation.stopDistance) / 10, -1, 1), Math.min(distance / 80, 1),
    clamp((vx * dx + vz * dz) / 5, -2, 2), clamp((-vx * dz + vz * dx) / 5, -2, 2),
    clamp((tx * dx + tz * dz) / 5, -2, 2), clamp((-tx * dz + tz * dx) / 5, -2, 2), observation.stopDistance / 40,
    ...observation.clearance, observation.targetClear ? 1 : 0];
  return { input: Float32Array.from(values), direction };
}
export function decodeMotorAction(output, direction) {
  if (!output || output.length !== 2 || [...output].some(value => !Number.isFinite(value))) throw new Error('Motor policy produced invalid output');
  const [dx, dz] = direction, a = MOTOR_DYNAMICS.maxAcceleration;
  return [clamp((output[0] * dx - output[1] * dz) * a, -a, a), clamp((output[0] * dz + output[1] * dx) * a, -a, a)];
}
export function validateMotorBatch(batch) {
  if (!Array.isArray(batch) || batch.length < 1 || batch.length > MOTOR_DYNAMICS.maximumResidents) throw new RangeError('Motor batches require 1–16 residents');
  const ids = new Set();
  return batch.map(item => {
    if (typeof item?.id !== 'string' || !item.id || item.id.length > 300 || ids.has(item.id)) throw new TypeError('Motor resident identities must be unique');
    ids.add(item.id); return { id: item.id, observation: validateMotorObservation(item.observation) };
  });
}
