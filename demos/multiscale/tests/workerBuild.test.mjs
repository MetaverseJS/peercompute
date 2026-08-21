import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from 'vite';

import {
  createMultiscaleSolverDescriptors,
  resolveQuantumMaterialPotentialTaskModuleUrl,
  resolveQuantumOrbitalGridTaskModuleUrl,
  resolveUlgRuntimeTaskModuleUrl
} from '../src/compute/solverWorkerDescriptors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoRoot = path.resolve(__dirname, '..');

const stableTaskModules = [
  {
    id: 'quantum-orbital-grid',
    assetName: 'quantumOrbitalGridTasks.js',
    exportName: 'stepQuantumOrbitalGrid',
    resolve: resolveQuantumOrbitalGridTaskModuleUrl
  },
  {
    id: 'quantum-material-potential',
    assetName: 'quantumMaterialPotentialTasks.js',
    exportName: 'stepQuantumMaterialPotential',
    resolve: resolveQuantumMaterialPotentialTaskModuleUrl
  },
  {
    id: 'ulg-runtime',
    assetName: 'ulgRuntimeTasks.js',
    exportName: 'stepUlgRuntime',
    resolve: resolveUlgRuntimeTaskModuleUrl
  }
];

test('custom compute worker acknowledges readiness and preserves result/error messages', async (t) => {
  const priorSelf = globalThis.self;
  const messages = [];
  const workerScope = {
    onmessage: null,
    postMessage(message) {
      messages.push(message);
    }
  };

  globalThis.self = workerScope;
  t.after(() => {
    if (priorSelf === undefined) delete globalThis.self;
    else globalThis.self = priorSelf;
  });

  const workerUrl = pathToFileURL(
    path.resolve(demoRoot, 'src/compute/peercomputeComputeWorker.js')
  );
  workerUrl.searchParams.set('test', `${Date.now()}`);
  await import(workerUrl.href);

  assert.deepEqual(messages, [{ type: 'ready' }]);
  assert.equal(typeof workerScope.onmessage, 'function');

  await workerScope.onmessage({
    data: {
      type: 'run',
      id: 'result-task',
      runtime: 'js',
      fn: '(data) => ({ doubled: data.value * 2 })',
      data: { value: 21 }
    }
  });
  assert.deepEqual(messages[1], {
    type: 'result',
    id: 'result-task',
    result: { doubled: 42 }
  });

  await workerScope.onmessage({
    data: {
      type: 'run',
      id: 'error-task',
      runtime: 'js',
      fn: '() => { throw new Error("expected-worker-error"); }'
    }
  });
  assert.deepEqual(messages[2], {
    type: 'error',
    id: 'error-task',
    error: 'expected-worker-error'
  });
});

test('solver descriptors resolve their three stable task module sources', () => {
  const descriptors = new Map(
    createMultiscaleSolverDescriptors().map((descriptor) => [descriptor.id, descriptor])
  );

  for (const expected of stableTaskModules) {
    const sourceUrl = expected.resolve();
    assert.equal(
      fileURLToPath(sourceUrl),
      path.resolve(demoRoot, `src/compute/${expected.assetName}`)
    );
    assert.equal(descriptors.get(expected.id)?.module, sourceUrl);
    assert.equal(descriptors.get(expected.id)?.exportName, expected.exportName);
  }
});

test('fresh production build emits descriptor-addressable modules with a closed import graph', async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), 'peercompute-multiscale-build-'));

  try {
    const result = await build({
      root: demoRoot,
      configFile: path.resolve(demoRoot, 'vite.config.js'),
      logLevel: 'silent',
      build: {
        outDir: outputDir,
        emptyOutDir: true
      }
    });
    const rollupOutputs = Array.isArray(result) ? result : [result];
    const emitted = rollupOutputs.flatMap((rollupOutput) => rollupOutput.output);
    const emittedPaths = new Set(emitted.map((entry) => entry.fileName));
    const chunkCode = emitted
      .filter((entry) => entry.type === 'chunk')
      .map((entry) => entry.code)
      .join('\n');

    for (const expected of stableTaskModules) {
      const emittedPath = `assets/${expected.assetName}`;
      assert.ok(emittedPaths.has(emittedPath), `${emittedPath} was not emitted`);
      assert.match(chunkCode, new RegExp(`\\./assets/${expected.assetName.replace('.', '\\.')}["']`));
      assert.ok((await stat(path.resolve(outputDir, emittedPath))).isFile());
    }

    assert.ok(emittedPaths.has('assets/peercomputeComputeWorker.js'));
    for (const entry of emitted) {
      if (entry.type !== 'chunk') continue;
      const dependencies = [
        ...entry.imports,
        ...entry.dynamicImports,
        ...entry.implicitlyLoadedBefore
      ];
      for (const dependency of dependencies) {
        assert.ok(
          emittedPaths.has(dependency),
          `${entry.fileName} references missing build output ${dependency}`
        );
      }
    }

    await writeFile(path.resolve(outputDir, 'package.json'), '{"type":"module"}\n');
    for (const expected of stableTaskModules) {
      const moduleUrl = pathToFileURL(
        path.resolve(outputDir, 'assets', expected.assetName)
      );
      moduleUrl.searchParams.set('test', `${Date.now()}-${expected.id}`);
      const builtModule = await import(moduleUrl.href);
      assert.equal(typeof builtModule[expected.exportName], 'function');
    }

    const workerMessages = [];
    const priorSelf = globalThis.self;
    globalThis.self = {
      onmessage: null,
      postMessage(message) {
        workerMessages.push(message);
      }
    };
    try {
      const builtWorkerUrl = pathToFileURL(
        path.resolve(outputDir, 'assets/peercomputeComputeWorker.js')
      );
      builtWorkerUrl.searchParams.set('test', `${Date.now()}`);
      await import(builtWorkerUrl.href);
      assert.deepEqual(workerMessages, [{ type: 'ready' }]);
      assert.equal(typeof globalThis.self.onmessage, 'function');
    } finally {
      if (priorSelf === undefined) delete globalThis.self;
      else globalThis.self = priorSelf;
    }

    const html = await readFile(path.resolve(outputDir, 'index.html'), 'utf8');
    assert.match(html, /<script type="module"/);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
