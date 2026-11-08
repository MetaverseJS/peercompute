import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import { build } from 'vite';
import { mpmComputeTaskPlugin } from '../vite.config.js';

test('production MPM task URL resolves to a bundled worker-importable module with all handlers', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'peercompute-mpm-task-bundle-'));
  let worker;
  try {
    await writeFile(path.join(root, 'package.json'), '{"type":"module"}');
    const entry = path.join(root, 'entry.js');
    const physicsSource = fileURLToPath(new URL('../src/index.js', import.meta.url));
    await writeFile(entry, `import { mpm } from ${JSON.stringify(physicsSource)};
      export const particleStride = mpm.MPM_PARTICLE_STRIDE;
      export { default as taskUrl } from "virtual:peercompute-mpm-task-url";`);
    const outDir = path.join(root, 'nested', 'peercompute', 'webgpuphys');
    const built = await build({
      configFile: false,
      root,
      base: './',
      logLevel: 'silent',
      plugins: [mpmComputeTaskPlugin()],
      build: {
        outDir,
        minify: true,
        rollupOptions: { input: entry, preserveEntrySignatures: 'strict' },
      },
    });
    const chunks = built.output.filter((item) => item.type === 'chunk');
    const appChunk = chunks.find((item) => item.facadeModuleId === entry);
    const taskChunk = chunks.find((item) => item.facadeModuleId?.endsWith('/demos/shared/mpmComputeTasks.js'));
    assert.ok(appChunk && taskChunk, 'Both the URL entry and executable task entry must be emitted');
    const handlers = ['initHeadlessSim', 'resetHeadlessSim', 'stepHeadlessSim'];
    assert.deepEqual([...taskChunk.exports].sort(), handlers);
    const { taskUrl } = await import(pathToFileURL(path.join(outDir, appChunk.fileName)).href);
    assert.equal(fileURLToPath(taskUrl), path.join(outDir, taskChunk.fileName));
    assert.ok(!taskUrl.startsWith('data:'), 'The task cannot be an unbundled data URL');

    // Import the emitted artifact in a real separate JS worker, without requesting a GPU.
    // Broken relative source imports or stripped handler exports fail this round trip.
    const source = `import { parentPort, workerData } from 'node:worker_threads';
      const tasks = await import(workerData);
      let initError;
      try { await tasks.initHeadlessSim(); } catch (error) { initError = error.message; }
      let stepError;
      try { await tasks.stepHeadlessSim(); } catch (error) { stepError = error.message; }
      parentPort.postMessage({ exports: Object.keys(tasks).sort(), reset: tasks.resetHeadlessSim(), initError, stepError });`;
    worker = new Worker(new URL(`data:text/javascript,${encodeURIComponent(source)}`), { workerData: taskUrl });
    const result = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Bundled task worker did not respond')), 10000);
      const finish = (callback, value) => { clearTimeout(timer); callback(value); };
      worker.once('message', (value) => finish(resolve, value));
      worker.once('error', (error) => finish(reject, error));
      worker.once('exit', (code) => { if (code !== 0) finish(reject, new Error(`Task worker exited ${code}`)); });
    });
    assert.deepEqual(result.exports, handlers);
    assert.deepEqual(result.reset, { ok: true });
    assert.match(result.initError, /Missing required initialization data/);
    assert.match(result.stepError, /Simulation not initialized/);
  } finally {
    await worker?.terminate();
    await rm(root, { recursive: true, force: true });
  }
});
