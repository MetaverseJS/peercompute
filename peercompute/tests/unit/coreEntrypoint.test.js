import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '../..');
const srcRoot = path.join(packageRoot, 'src/peercompute');

const FORBIDDEN_CORE_SPECIFIERS = [
  /(?:^|\/)inference(?:\/|$)/,
  /peercompute-diffusion-ort/,
  /onnxruntime-web/,
  /@huggingface\/transformers/,
  /@wllama\/wllama/,
  /@kaminos\/webgpu-inference-kit/
];

function collectImportGraph(entryFile) {
  const visited = new Set();
  const edges = [];
  const forbidden = [];

  function walk(absFile) {
    const normalized = path.resolve(absFile);
    if (visited.has(normalized) || !fs.existsSync(normalized)) return;
    visited.add(normalized);
    const source = fs.readFileSync(normalized, 'utf8');
    const relFrom = path.relative(srcRoot, normalized);

    const patterns = [
      /\bfrom\s*(["'])([^"']+)\1/g,
      /\bimport\s*(["'])([^"']+)\1/g,
      /\bimport\s*\(\s*(["'])([^"']+)\1/g,
      /new\s+URL\(\s*(["'])([^"']+)\1\s*,\s*import\.meta\.url\s*\)/g
    ];

    for (const re of patterns) {
      let match;
      while ((match = re.exec(source)) !== null) {
        const spec = match[2];
        edges.push({ from: relFrom, spec });
        if (FORBIDDEN_CORE_SPECIFIERS.some((pattern) => pattern.test(spec))) {
          forbidden.push({ from: relFrom, spec });
        }
        if (spec.startsWith('.')) {
          const target = path.resolve(path.dirname(normalized), spec);
          if (fs.existsSync(target) && fs.statSync(target).isFile()) {
            walk(target);
          }
        }
      }
    }
  }

  walk(entryFile);
  return { visited, edges, forbidden };
}

test('peercompute/package.json exports ".", "./core", and "./inference"', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.exports['.'], './src/peercompute/index.js');
  assert.equal(pkg.exports['./core'], './src/peercompute/core.js');
  assert.equal(pkg.exports['./inference'], './src/peercompute/inference.js');
});

test('peercompute/core has ZERO static, dynamic, or worker-URL import edges into inference or heavy WASM packages', () => {
  const coreEntry = path.join(srcRoot, 'core.js');
  const graph = collectImportGraph(coreEntry);

  assert.ok(graph.visited.size >= 20, `expected core graph to traverse core modules, got ${graph.visited.size}`);
  assert.deepEqual(
    graph.forbidden,
    [],
    `core.js must have zero inference/ORT/Transformers/Wllama edges, found: ${JSON.stringify(graph.forbidden)}`
  );

  // Also ensure none of the visited files reside inside src/peercompute/inference/
  const inferenceFiles = [...graph.visited]
    .map((file) => path.relative(srcRoot, file))
    .filter((rel) => rel.startsWith('inference/') || rel.startsWith('networkManager/inference/'));
  assert.deepEqual(inferenceFiles, []);
});

test('peercompute/core exports the full requested slim surface and fails closed when inference is unregistered', async () => {
  const core = await import('../../src/peercompute/core.js');

  const requiredExports = [
    'NodeKernel',
    'ComputeManager',
    'StateManager',
    'ReservationLedger',
    'SpatialTileLeaseBroker',
    'DataState',
    'LocalArtifactCache',
    'NetworkManager',
    'DIRECT_UNICAST_PROTOCOL',
    'THROUGHPUT_TOPOLOGY_PROFILES',
    'WorkMesh',
    'WORK_MESH_SCHEMA',
    'WORK_MESH_DEFAULTS',
    'WorkMeshService',
    'WORK_MESH_PROTOCOL',
    'GPUHubManager',
    'ResidentStageWorkerBackend',
    'createResidentStageWorkerBackend',
    'GpuResidentLaneManager',
    'SolverRegistry',
    'PlacementAdmissionPolicy',
    'RemoteResultQuorumValidator',
    'serviceOrchestration',
    'ChildWorkerLeaseManager',
    'ResourceLeaseBroker',
    'WorkerSupervisor',
    'CONNECTION_PATHS',
    'ICE_TRANSPORT_POLICIES',
    'classifyConnectionPath'
  ];

  for (const name of requiredExports) {
    assert.ok(name in core && core[name] !== undefined, `core.js must export ${name}`);
  }
  assert.equal(core.serviceOrchestration.ChildWorkerLeaseManager, core.ChildWorkerLeaseManager);
  assert.equal(core.serviceOrchestration.ResourceLeaseBroker, core.ResourceLeaseBroker);
  assert.equal(core.serviceOrchestration.WorkerSupervisor, core.WorkerSupervisor);

  // Save/reset registry to verify fail-closed behavior in an isolated slim runtime.
  const prevModelFactory = core.getModelInferenceFactory();
  const prevPeerFactory = core.getPeerInferenceServiceFactory();
  const prevWorkerUrl = core.getDefaultWorkerBootstrapURL();
  const prevWorkerFactory = core.getDefaultWorkerFactory();
  try {
    core.registerModelInferenceFactory(null);
    core.registerPeerInferenceServiceFactory(null);
    core.registerDefaultWorkerBootstrapURL(null);
    core.registerDefaultWorkerFactory(null);

    const cm = new core.ComputeManager({ enableWorkers: false, enableWebGPU: false });
    await assert.rejects(
      cm.createModelInferenceService(),
      (err) => err?.code === 'ERR_MODEL_INFERENCE_NOT_REGISTERED'
    );

    const nm = new core.NetworkManager({ bootstrapPeers: [] });
    nm.libp2p = {};
    nm.isConnected = true;
    await assert.rejects(
      nm.createPeerInferenceService(),
      (err) => err?.code === 'ERR_PEER_INFERENCE_NOT_REGISTERED'
    );
  } finally {
    core.registerModelInferenceFactory(prevModelFactory);
    core.registerPeerInferenceServiceFactory(prevPeerFactory);
    core.registerDefaultWorkerBootstrapURL(prevWorkerUrl);
    core.registerDefaultWorkerFactory(prevWorkerFactory);
  }
});

test('importing peercompute/inference registers inference factories and worker factory', async (t) => {
  const core = await import('../../src/peercompute/core.js');
  const inference = await import('../../src/peercompute/inference.js');

  assert.equal(typeof inference.ModelInferenceService, 'function');
  assert.equal(typeof inference.PeerInferenceService, 'function');
  assert.equal(typeof inference.registerInferenceRuntime, 'function');
  assert.equal(typeof core.getModelInferenceFactory(), 'function');
  assert.equal(typeof core.getPeerInferenceServiceFactory(), 'function');
  assert.equal(typeof core.getDefaultWorkerFactory(), 'function');

  const originalWorker = globalThis.Worker;
  let capturedUrl = null;
  let capturedOptions = null;
  globalThis.Worker = class MockWorker {
    constructor(url, options) {
      capturedUrl = String(url);
      capturedOptions = options;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) delete globalThis.Worker;
    else globalThis.Worker = originalWorker;
  });
  core.getDefaultWorkerFactory()();
  assert.match(capturedUrl || '', /inference\/computeWorker\.js$/);
  assert.equal(capturedOptions?.type, 'module');

  assert.ok(core.listBuiltinTaskModules().includes('peercompute:model-inference'));
  assert.ok(core.listBuiltinTaskModules().includes('peercompute:diffusion-inference'));
});
