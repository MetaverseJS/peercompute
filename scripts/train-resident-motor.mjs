import { writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { MOTOR_DYNAMICS, MOTOR_SCHEMA } from '../demos/shared/agents/motor/motorContracts.js';
import { POLICY_SHAPE, PARAMETER_COUNT, evaluateNetwork, referenceMotorAction } from '../demos/shared/agents/motor/policyReference.js';
import { seededRandom, randomObservation, demonstrationSample, demonstrationAction, evaluatePolicy } from '../demos/shared/agents/motor/trainingEnvironment.js';

const defaultOutput = fileURLToPath(new URL('../demos/shared/agents/motor/residentMotorCheckpoint.js', import.meta.url));
const defaultEvidence = path.join(process.env.XDG_CACHE_HOME?.trim() || path.join(homedir(), '.cache'), 'peercompute-resident-motor');
let options;
try {
  options = parseArgs({ options: { help: { type: 'boolean', short: 'h' }, output: { type: 'string' }, 'evidence-dir': { type: 'string' } },
    strict: true, allowPositionals: false }).values;
  for (const key of ['output', 'evidence-dir']) if (options[key] !== undefined && !options[key].trim()) throw new Error(`--${key} requires a nonempty path`);
} catch (error) {
  process.stderr.write(`${error.message}\nUse --help for trainer options.\n`); process.exit(2);
}
if (options.help) {
  process.stdout.write(`Usage: node scripts/train-resident-motor.mjs [options]

Train and evaluate the seeded resident movement policy.

  --output PATH        Checkpoint JavaScript file (default: ${defaultOutput})
  --evidence-dir PATH  Training report directory (default: ${defaultEvidence})
  -h, --help           Show this help without training or writing files

MOTOR_EPOCHS sets the positive integer epoch count (default: 80).
The checkpoint is written only after held-out acceptance passes. The default
output replaces the repository checkpoint; use --output to save a candidate.
Failed acceptance still writes the training report and exits unsuccessfully.
`);
  process.exit(0);
}
const target = options.output === undefined ? defaultOutput : path.resolve(options.output);
const evidence = path.resolve(options['evidence-dir'] ?? defaultEvidence);
const seed = 20261109, random = seededRandom(seed), epochs = Number(process.env.MOTOR_EPOCHS ?? 80), samples = 16000, batchSize = 64;
if (!Number.isSafeInteger(epochs) || epochs < 1) {
  process.stderr.write('MOTOR_EPOCHS must be a positive integer.\n'); process.exit(2);
}
const weights = new Float32Array(PARAMETER_COUNT), initial = new Float32Array(PARAMETER_COUNT);
const offsets = []; let offset = 0;
for (let layer = 1; layer < POLICY_SHAPE.length; layer++) {
  offsets.push(offset); const previous = POLICY_SHAPE[layer - 1], width = POLICY_SHAPE[layer];
  for (let i = 0; i < previous * width; i++) weights[offset + i] = (random() * 2 - 1) * Math.sqrt(6 / (previous + width));
  offset += (previous + 1) * width;
}
initial.set(weights);
const dataset = Array.from({ length: samples }, (_, index) => {
  const observation = randomObservation(random);
  if (index % 4 === 0) {
    // Stopping demonstrations are oversampled: low global MSE alone can hide
    // small residual forces that make a supposedly resting body slowly orbit.
    const angle = random() * Math.PI * 2, distance = observation.stopDistance + random() * 5 - 3;
    observation.relativePosition = [distance * Math.cos(angle), distance * Math.sin(angle)];
    observation.velocity = [0, 0]; observation.targetVelocity = [0, 0];
  }
  return demonstrationSample(observation);
});
const first = new Float64Array(PARAMETER_COUNT), second = new Float64Array(PARAMETER_COUNT), gradient = new Float64Array(PARAMETER_COUNT);
const order = Array.from({ length: samples }, (_, i) => i), losses = []; let updates = 0;
const started = performance.now();
for (let epoch = 0; epoch < epochs; epoch++) {
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  let loss = 0;
  for (let start = 0; start < samples; start += batchSize) {
    gradient.fill(0); const end = Math.min(start + batchSize, samples);
    for (let index = start; index < end; index++) {
      const sample = dataset[order[index]], activations = [];
      const output = evaluateNetwork(weights, sample.input, activations);
      let delta = Float64Array.from(output, (v, i) => { const error = v - sample.output[i]; loss += error * error; return error * (1 - v * v); });
      for (let layer = POLICY_SHAPE.length - 2; layer >= 0; layer--) {
        const width = POLICY_SHAPE[layer + 1], previous = POLICY_SHAPE[layer], at = offsets[layer];
        const input = layer ? activations[layer - 1] : sample.input, nextDelta = new Float64Array(previous);
        for (let row = 0; row < width; row++) {
          gradient[at + previous * width + row] += delta[row];
          for (let col = 0; col < previous; col++) { gradient[at + row * previous + col] += delta[row] * input[col]; nextDelta[col] += weights[at + row * previous + col] * delta[row]; }
        }
        for (let col = 0; col < previous; col++) nextDelta[col] *= 1 - input[col] * input[col];
        delta = nextDelta;
      }
    }
    updates++; const learningRate = 0.0015 * (0.3 + 0.7 * (1 - epoch / epochs));
    for (let i = 0; i < weights.length; i++) {
      const g = gradient[i] / (end - start); first[i] = 0.9 * first[i] + 0.1 * g; second[i] = 0.999 * second[i] + 0.001 * g * g;
      weights[i] -= learningRate * (first[i] / (1 - 0.9 ** updates)) / (Math.sqrt(second[i] / (1 - 0.999 ** updates)) + 1e-8);
    }
  }
  losses.push(loss / (samples * 2)); if (epoch % 5 === 0 || epoch === epochs - 1) process.stdout.write(`Epoch ${epoch + 1}/${epochs}: MSE ${losses.at(-1).toFixed(6)}\n`);
}
const evaluation = { trained: evaluatePolicy(obs => referenceMotorAction(weights, obs)),
  zero: evaluatePolicy(() => [0, 0]), random: evaluatePolicy(obs => referenceMotorAction(initial, obs)), teacher: evaluatePolicy(demonstrationAction) };
const serialWeights = Array.from(weights), sha256 = createHash('sha256').update(JSON.stringify(serialWeights)).digest('hex');
const checkpoint = { schema: MOTOR_SCHEMA, shape: POLICY_SHAPE, policyId: `sha256:${sha256}`, weights: serialWeights,
  training: { kind: 'seeded-demonstration-behavioral-cloning', seed, samples, epochs, batchSize, updates,
    optimizer: 'Adam', activation: 'tanh', demonstration: 'bounded proportional-velocity controller; not autonomous RL', dynamics: MOTOR_DYNAMICS,
    limitations: ['Planar obstacle-free reaching and following only', 'Fixed body dynamics; no online learning or learned obstacle avoidance',
      'Teacher-labeled synthetic observations; not human demonstrations or self-discovered behavior'],
    finalMse: losses.at(-1), evaluationSeeds: '810000 + i*101; excluded from demonstration RNG', evaluation } };
await mkdir(evidence, { recursive: true });
await writeFile(path.join(evidence, 'motor-training.json'), JSON.stringify({ ...checkpoint.training, policyId: checkpoint.policyId, elapsedMs: performance.now() - started, losses }, null, 2));
process.stdout.write(`${JSON.stringify({ policyId: checkpoint.policyId, evaluation, elapsedMs: performance.now() - started }, null, 2)}\n`);
if (!(evaluation.trained.approach.successRate >= 0.9 && evaluation.trained.follow.meanTailError <= 2)) {
  process.stderr.write('Held-out acceptance failed; checkpoint was not written.\n'); process.exitCode = 1;
} else {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `// Generated by scripts/train-resident-motor.mjs. Do not edit learned weights by hand.\nexport default ${JSON.stringify(checkpoint)};\n`);
}
