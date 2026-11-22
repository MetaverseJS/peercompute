import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('tree GPU gravity matches analytic point clusters and direct preset forces', t => {
  const script = fileURLToPath(new URL('./gravity.check.mjs', import.meta.url));
  const run = spawnSync('deno', ['run', '--unstable-webgpu', '--allow-read', script], {
    encoding: 'utf8'
  });
  if (run.error?.code === 'ENOENT') return t.skip('Deno WebGPU is unavailable');
  assert.equal(run.status, 0, run.stderr);
});
