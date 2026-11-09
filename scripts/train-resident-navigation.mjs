import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { homedir } from 'node:os';
import { parseArgs } from 'node:util';
import { MOTOR_DYNAMICS, MOTOR_SCHEMA, MOTOR_INPUTS } from '../demos/shared/agents/motor/motorContracts.js';
import { POLICY_SHAPE, referenceMotorAction } from '../demos/shared/agents/motor/policyReference.js';
import baseline from '../demos/shared/agents/motor/residentMotorBaseline.js';
import { seededRandom, randomObservation, demonstrationAction, evaluatePolicy } from '../demos/shared/agents/motor/trainingEnvironment.js';
import { navigationLayout, createNavigationTeacher, navigationSample, navigationRollout, evaluateNavigation } from '../demos/shared/agents/motor/navigationTrainingEnvironment.js';
const { values: options } = parseArgs({ options: { 'evidence-dir': { type: 'string' }, output: { type: 'string' },
  rounds: { type: 'string', default: '3' }, epochs: { type: 'string', default: '35' }, episodes: { type: 'string', default: '200' }, help: { type: 'boolean', short: 'h' } } });
if (options.help) {
  process.stdout.write('Usage: node scripts/train-resident-navigation.mjs [--evidence-dir PATH] [--output PATH] [--rounds 3] [--epochs 35] [--episodes 200]\nOffline NumPy imitation training and actual Cannon evaluation. Artifacts are saved externally. Only --output explicitly promotes a candidate after acceptance; no live online learning.\n');
  process.exit(0);
}
const evidence = path.resolve(options['evidence-dir'] ?? path.join(process.env.XDG_CACHE_HOME?.trim() || path.join(homedir(), '.cache'), 'peercompute-resident-navigation'));
const rounds = Number(options.rounds), epochs = Number(options.epochs), episodes = Number(options.episodes);
if (![rounds, epochs, episodes].every(v => Number.isSafeInteger(v) && v > 0) || rounds > 10 || epochs > 500 || episodes > 10000) throw Error('Invalid training budget');
await mkdir(evidence, { recursive: true });
const sourceFiles = ['scripts/train-resident-navigation.mjs', 'scripts/train-resident-navigation.py',
  'demos/shared/agents/motor/navigationSensors.js', 'demos/shared/agents/motor/navigationTrainingEnvironment.js',
  'demos/shared/agents/motor/motorContracts.js', 'demos/shared/agents/motor/policyReference.js',
  'demos/shared/agents/motor/trainingEnvironment.js', 'demos/shared/agents/motor/residentMotorBaseline.js'];
const sourceHashes = {};
for (const file of sourceFiles) {
  const source = await readFile(new URL('../' + file, import.meta.url));
  sourceHashes[file] = createHash('sha256').update(source).digest('hex');
  const archive = path.join(evidence, 'source', file); await mkdir(path.dirname(archive), { recursive: true }); await writeFile(archive, source);
}
await writeFile(path.join(evidence, 'source-hashes.json'), JSON.stringify(sourceHashes, null, 2));
const started = performance.now(), samples = [], random = seededRandom(20261109), losses = [], stages = [];
let weights, updates = 0;
for (let i = 0; i < 20000; i++) {
  const obs = randomObservation(random);
  if (i % 2 === 0) {
    const angle = random() * 2 * Math.PI, distance = Math.max(6, obs.stopDistance + random() * 8 - 5);
    obs.relativePosition = [Math.cos(angle) * distance, Math.sin(angle) * distance];
    obs.targetVelocity = [(random() * 2 - 1), (random() * 2 - 1)];
    obs.velocity = obs.targetVelocity.map(v => v + (random() - .5));
  }
  samples.push(navigationSample(obs, demonstrationAction(obs)));
}
const trained = observation => referenceMotorAction(weights, observation);
for (let round = 0; round < rounds; round++) {
  const count = round === 0 ? episodes : Math.ceil(episodes / 2);
  for (let i = 0; i < count; i++) {
    const layout = navigationLayout(110000 + round * 100000 + i * 97), teacher = createNavigationTeacher(layout.obstacles);
    navigationRollout(round === 0 ? (_obs, state) => teacher(state) : trained, layout, {
      teacher, collect: sample => samples.push(sample), seconds: i % 7 === 0 ? 60 : round === 0 ? 35 : 40, follow: i % 7 === 0 });
  }
  const binary = new Float32Array(samples.length * (MOTOR_INPUTS + 2));
  samples.forEach((sample, i) => { binary.set(sample.input, i * (MOTOR_INPUTS + 2)); binary.set(sample.output, i * (MOTOR_INPUTS + 2) + MOTOR_INPUTS); });
  const dataset = path.join(evidence, `dataset-${round}.f32`), fit = path.join(evidence, `fit-${round}.json`);
  await writeFile(dataset, Buffer.from(binary.buffer));
  const args = [fileURLToPath(new URL('./train-resident-navigation.py', import.meta.url)), '--data', dataset, '--output', fit,
    '--epochs', String(epochs), '--seed', String(20261109 + round)];
  if (weights) { const initial = path.join(evidence, `initial-${round}.json`); await writeFile(initial, JSON.stringify(Array.from(weights))); args.push('--initial', initial); }
  process.stdout.write(`Round ${round + 1}: ${samples.length} demonstration/correction samples\n`);
  await new Promise((resolve, reject) => {
    const child = spawn('python3', args, { stdio: 'inherit', env: { ...process.env, OPENBLAS_NUM_THREADS: '1', OMP_NUM_THREADS: '1' } });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(Error(`Training exited ${code}`)));
  });
  const result = JSON.parse(await readFile(fit, 'utf8')); weights = Float32Array.from(result.weights); updates += result.updates; losses.push(...result.losses);
  const validation = evaluateNavigation(trained, { count: 40, seed: 960000 });
  stages.push({ round, samples: samples.length, validation });
  await writeFile(path.join(evidence, `validation-${round}.json`), JSON.stringify(validation, null, 2));
  for (const failure of validation.episodes.filter(item => !item.success).slice(0, 8)) {
    const layout = navigationLayout(failure.seed), teacher = createNavigationTeacher(layout.obstacles), trajectory = [];
    navigationRollout(trained, layout, { teacher, trajectory });
    await writeFile(path.join(evidence, `failure-${round}-${failure.seed}.json`), JSON.stringify({ layout, trajectory }));
  }
  process.stdout.write(`${JSON.stringify({ round, success: validation.successRate, families: validation.families })}\n`);
}
const heldout = evaluateNavigation(trained);
const old = evaluateNavigation(obs => referenceMotorAction(baseline.weights, obs, baseline.shape));
const zero = evaluateNavigation(() => [0, 0]);
const randomWeights = Float32Array.from(weights, () => (random() - .5) * .1);
const untrained = evaluateNavigation(obs => referenceMotorAction(randomWeights, obs));
const open = evaluatePolicy(trained);
const follow = Array.from({ length: 20 }, (_, i) => navigationRollout(trained, navigationLayout(920000 + i * 101), { seconds: 45, follow: true }));
const followLong = Array.from({ length: 20 }, (_, i) => navigationRollout(trained, navigationLayout(920000 + i * 101), { seconds: 60, follow: true }));
const teacherResults = Array.from({ length: 100 }, (_, i) => {
  const layout = navigationLayout(870000 + i * 101), teacher = createNavigationTeacher(layout.obstacles);
  return navigationRollout((_obs, state) => teacher(state), layout);
});
const serialWeights = Array.from(weights), policyId = `sha256:${createHash('sha256').update(JSON.stringify(serialWeights)).digest('hex')}`;
const training = { kind: 'seeded-demonstration-behavioral-cloning', seed: 20261109, rounds, epochs, updates,
  optimizer: 'Adam', activation: 'tanh', demonstration: 'Offline visibility-graph teacher and aggregated learner-state corrections; never live navigation code',
  dynamics: MOTOR_DYNAMICS, sensors: '32 target-relative footprint-clearance rays and target visibility; velocity state, no autoregressive previous-action input',
  limitations: ['Axis-aligned boxes, one wall or one doorway; no maze, climbing or online learning qualification',
    'Feed-forward behavioral cloning; observations/state change but live weights are frozen', 'Native NumPy training; live execution is managed WebGPU'],
  samples: samples.length, finalMse: losses.at(-1), sourceHashes,
  evaluationSeeds: '870000+i*101 development;960000+i*101 validation;920000+i*101 following;110000+round*100000+i*97 training; independent release evaluation is separate',
  evaluation: { trained: open, navigation: heldout, baseline: old, zero, random: untrained, teacher: teacherResults, follow, followLong }, stages };
const accepted = stages.at(-1).validation.successRate >= .9 && heldout.successRate >= .9 && Object.values(heldout.families).every(f => f.successRate >= .84)
  && open.approach.successRate >= .9 && open.follow.successRate >= .9
  && follow.filter(e => e.success).length >= 18 && followLong.filter(e => e.success).length >= 18;
await writeFile(path.join(evidence, 'navigation-training.json'), JSON.stringify({ ...training, accepted, policyId, elapsedMs: performance.now() - started, losses }, null, 2));
process.stdout.write(JSON.stringify({ accepted, heldout: heldout.successRate, families: heldout.families, baseline: old.successRate, zero: zero.successRate, random: untrained.successRate, open }, null, 2) + '\n');
const checkpoint = { schema: MOTOR_SCHEMA, shape: POLICY_SHAPE, policyId, weights: serialWeights, training };
await writeFile(path.join(evidence, 'candidate.js'), `// Offline learned candidate; see navigation-training.json for acceptance.\nexport default ${JSON.stringify(checkpoint)};\n`);
if (accepted && options.output) await writeFile(path.resolve(options.output), `// Generated by scripts/train-resident-navigation.mjs. Never edit learned weights by hand.\nexport default ${JSON.stringify(checkpoint)};\n`);
if (!accepted) process.exitCode = 1;
