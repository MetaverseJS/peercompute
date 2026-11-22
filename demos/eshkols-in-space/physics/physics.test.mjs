import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBodies, createBodiesAsync } from './initial.mjs';

const local = path => fileURLToPath(new URL(path, import.meta.url));
const presets = ['disk', 'binary', 'sphere'];
const distributions = ['equal', 'spectrum', 'heavy'];

test('generated kernels match their pure Eshkol sources', () => {
  const check = spawnSync('python3', [local('../scripts/build-physics.py'), '--check'], {encoding: 'utf8'});
  assert.equal(check.status, 0, check.stderr);
});

test('initial states are reproducible, finite, positive-mass and seed sensitive for all presets', () => {
  for (const preset of presets) for (const distribution of distributions) {
    const config = {count: 129, preset, distribution, seed: 42, gravity: 1};
    const state = createBodies(config);
    assert.equal(state.length, 129 * 8);
    assert(state.every(Number.isFinite));
    for (let i = 0; i < state.length; i += 8) assert(state[i + 3] > 0 && state[i + 7] > 0);
    assert.deepEqual(state, createBodies(config));
    assert.notDeepEqual(state, createBodies({...config, seed: 43}));
  }
});

test('chunked population matches synchronous packing and accepts cancellation', async () => {
  const config = {count: 70000, preset: 'disk', distribution: 'spectrum', seed: 825};
  const result = await createBodiesAsync(config);
  assert.deepEqual(result, createBodies(config));
  assert.notDeepEqual(result.subarray(0, 8), result.subarray(65521 * 8, 65522 * 8));
  const controller = new AbortController();
  const cancelled = createBodiesAsync({...config, count: 2000000}, {signal: controller.signal});
  controller.abort();
  await assert.rejects(cancelled, {name: 'AbortError'});
});

function near(actual, expected, tolerance = 0.00004) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < actual.length; i++) {
    assert(Math.abs(actual[i] - expected[i]) <= tolerance * Math.max(1, Math.abs(expected[i])),
      `component ${i}: ${actual[i]} vs ${expected[i]}`);
  }
}

test('native Eshkol reference agrees with analytic pairs and the browser artifacts', async t => {
  const command = process.env.ESHKOL_RUN || 'eshkol-run';
  if (spawnSync(command, ['--version']).error?.code === 'ENOENT') return t.skip('eshkol-run is unavailable');
  const cwd = mkdtempSync(join(tmpdir(), 'space-eshkol-'));
  let run;
  try {
    run = spawnSync(command, ['-r', '-I', local('./'), local('./checks/reference.esk')], {cwd, encoding: 'utf8'});
  } finally {
    rmSync(cwd, {recursive: true, force: true});
  }
  assert.equal(run.status, 0, run.stderr);
  const cases = {};
  let section;
  let sample;
  for (const line of run.stdout.split(/\r?\n/)) {
    if (line.startsWith('CASE ')) {
      sample = {input: [], next: []};
      cases[line.slice(5)] = sample;
      section = sample.input;
    } else if (line === 'NEXT') {
      section = sample.next;
    } else if (line.startsWith('BODY ')) {
      section.push(...line.slice(5).split(' ').map(Number));
    }
  }
  near([cases.gravity.next[0], cases.gravity.next[4], cases.gravity.next[8], cases.gravity.next[12]],
    [-0.995, 0.05, 0.995, -0.05]);
  near(cases.merge.next, [2 / 15, 0, 0, 3, 0, 0, 0, Math.cbrt(0.25), ...Array(8).fill(0)]);
  near(cases.absorbed.next, cases.merge.next);
  near(cases.legacy.next, cases.merge.next);
  near([cases.disabled.next[4], cases.disabled.next[12]], [2, -1]);
  near([cases.separating.next[4], cases.separating.next[12]], [-2, 1]);
  near([cases.triple.next[3], cases.triple.next[11], cases.triple.next[19]], [3, 0, 3]);
  near([cases.second.next[3], cases.second.next[11], cases.second.next[19]], [6, 0, 0]);
  near(cases.oblique.next, [0.16, 0.06, 0.03, 5, -0.2, 0.8, -0.1, Math.cbrt(0.28), ...Array(8).fill(0)]);
  const count = 67;
  assert.equal(cases.tiled.input.length, count * 8);
  for (let i = 0; i < count; i++) {
    const packed = createBodies({count, seed: 17, preset: presets[i % 3],
      distribution: distributions[Math.floor(i / 3) % 3]});
    near(packed.subarray(i * 8, i * 8 + 8), cases.tiled.input.slice(i * 8, i * 8 + 8), 0.000001);
  }

  await t.test('WebGPU on the Eshkol device matches native Eshkol, including a target subrange', t => {
    if (spawnSync('deno', ['--version']).error?.code === 'ENOENT') return t.skip('Deno WebGPU is unavailable');
    const work = Object.entries(cases).map(([name, {input}]) => ({
      name, input, start: 0, length: input.length / 8,
      parameters: {
        dt: name === 'tiled' ? 0.015 : 0.1,
        gravity: ['gravity', 'tiled', 'absorbed', 'oblique'].includes(name) ? 1 : 0,
        softening: name === 'gravity' ? 0 : name === 'tiled' ? 0.18 : 0.1,
        collisions: !['gravity', 'tiled', 'disabled'].includes(name)
      }
    }));
    work.push({...work.find(job => job.name === 'tiled'), name: 'slice', start: 62, length: 5});
    const gpu = spawnSync('deno', ['run', '--unstable-webgpu', '--allow-read', local('./checks/dispatch.mjs')], {
      encoding: 'utf8', input: JSON.stringify(work)
    });
    assert.equal(gpu.status, 0, gpu.stderr);
    const outputs = JSON.parse(gpu.stdout);
    for (const [name, {next}] of Object.entries(cases)) near(outputs[name], next);
    near(outputs.slice, cases.tiled.next.slice(62 * 8));
  });
});
