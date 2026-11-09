import { MOTOR_INPUTS, MOTOR_HIDDEN, MOTOR_SCHEMA, encodeMotorObservation, decodeMotorAction } from './motorContracts.js';

/** CPU numerical reference for training/evaluation only; the live service uses WebGPU in a managed worker. */
export const POLICY_SHAPE = Object.freeze([MOTOR_INPUTS, MOTOR_HIDDEN, MOTOR_HIDDEN, 2]);
export const PARAMETER_COUNT = POLICY_SHAPE.slice(1).reduce((sum, width, i) => sum + (POLICY_SHAPE[i] + 1) * width, 0);
export function validateCheckpoint(checkpoint) {
  if (checkpoint?.schema !== MOTOR_SCHEMA || JSON.stringify(checkpoint.shape) !== JSON.stringify(POLICY_SHAPE)
      || !Array.isArray(checkpoint.weights) || checkpoint.weights.length !== PARAMETER_COUNT
      || checkpoint.weights.some(v => !Number.isFinite(v) || Math.abs(v) > 100)) throw new Error('Invalid resident motor checkpoint');
  return checkpoint;
}
export function evaluateNetwork(weights, input, activations) {
  let current = input, offset = 0;
  if (activations) activations.length = 0;
  for (let layer = 1; layer < POLICY_SHAPE.length; layer++) {
    const width = POLICY_SHAPE[layer], previous = POLICY_SHAPE[layer - 1], next = new Float32Array(width);
    for (let row = 0; row < width; row++) {
      let total = weights[offset + width * previous + row];
      for (let col = 0; col < previous; col++) total += weights[offset + row * previous + col] * current[col];
      next[row] = Math.tanh(total);
    }
    activations?.push(next); current = next; offset += (previous + 1) * width;
  }
  return current;
}
export function referenceMotorAction(weights, observation) {
  const encoded = encodeMotorObservation(observation);
  return decodeMotorAction(evaluateNetwork(weights, encoded.input), encoded.direction);
}
