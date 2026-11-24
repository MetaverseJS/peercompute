const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const repoRoot = path.resolve(process.cwd());
const demosRoot = path.join(repoRoot, 'demos');

const demoSpecs = [
  { name: 'inference', requiresRelayConfig: false, entryCandidates: ['index.html'] },
  {
    name: 'hyperborea',
    requiresRelayConfig: true,
    entryCandidates: ['index.html', 'cb.html']
  },
  {
    name: 'cubechat',
    requiresRelayConfig: true,
    entryCandidates: ['index.html']
  },
  {
    name: 'sneakywoods',
    requiresRelayConfig: true,
    entryCandidates: ['index.html']
  },
  {
    name: 'daddygo',
    requiresRelayConfig: true,
    entryCandidates: ['index.html', 'daddyGo.html']
  },
  {
    name: 'fano-reactor',
    requiresRelayConfig: true,
    entryCandidates: ['index.html']
  },
  {
    name: 'schrodinger',
    requiresRelayConfig: true,
    entryCandidates: ['index.html']
  },
  {
    name: 'planetgen',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'wxglobe',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'earth',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'motorcycle',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'multiscale',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'universes',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'webgpuphys',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'vibeslopdb',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'eshkols-in-space',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  }
];

const exists = (filePath) => fs.existsSync(filePath);

for (const demo of demoSpecs) {
  test(`${demo.name} demo scaffold`, () => {
    const demoRoot = path.join(demosRoot, demo.name);
    assert.ok(exists(demoRoot), `${demo.name} folder missing`);

    const demosPackage = path.join(demosRoot, 'package.json');
    assert.ok(exists(demosPackage), 'unified demos/package.json missing');

    const unifiedViteConfig = path.join(demosRoot, 'vite.config.js');
    assert.ok(exists(unifiedViteConfig), 'unified demos/vite.config.js missing');

    const manifest = JSON.parse(fs.readFileSync(path.join(demosRoot, 'manifest.json'), 'utf8'));
    assert.ok(
      manifest.demos.some((entry) => entry.name === demo.name),
      `${demo.name} missing from demos/manifest.json`
    );

    const entry = demo.entryCandidates.map((file) => path.join(demoRoot, file)).find(exists);
    assert.ok(entry, `${demo.name} entry HTML missing`);

    if (demo.requiresRelayConfig) {
      const relayConfig = path.join(demoRoot, 'public', 'relay-config.json');
      assert.ok(exists(relayConfig), `${demo.name} relay-config.json missing`);
    }
  });
}

test('wxglobe is wired as a first-class imagery-free Cesium demo', () => {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const demoPackage = JSON.parse(fs.readFileSync(path.join(demosRoot, 'package.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(demosRoot, 'manifest.json'), 'utf8'));
  const wxglobeSpec = manifest.demos.find((entry) => entry.name === 'wxglobe');
  const indexHtml = fs.readFileSync(path.join(demosRoot, 'wxglobe', 'index.html'), 'utf8');
  const viteConfig = fs.readFileSync(path.join(demosRoot, 'vite.config.js'), 'utf8');
  const main = fs.readFileSync(path.join(demosRoot, 'wxglobe', 'src', 'main.js'), 'utf8');
  const etopoTerrain = fs.readFileSync(path.join(demosRoot, 'wxglobe', 'src', 'terrain', 'etopo2022.js'), 'utf8');
  const terrariumTerrain = fs.readFileSync(path.join(demosRoot, 'wxglobe', 'src', 'terrain', 'terrarium.js'), 'utf8');
  const sharedEtopoTerrain = fs.readFileSync(path.join(repoRoot, 'packages', 'geo-core', 'src', 'terrain', 'etopo2022.js'), 'utf8');
  const sharedTerrariumTerrain = fs.readFileSync(path.join(repoRoot, 'packages', 'geo-core', 'src', 'terrain', 'terrarium.js'), 'utf8');
  const devAll = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-all.sh'), 'utf8');
  const devLocalRelay = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-local-relay.sh'), 'utf8');
  const docsIndex = fs.readFileSync(path.join(repoRoot, 'docs', 'index.html'), 'utf8');

  assert.ok(rootPackage.workspaces.includes('demos'), 'root workspaces missing unified demos workspace');
  assert.equal(rootPackage.scripts['dev:wxglobe'], 'node scripts/dev-demo.mjs wxglobe');
  assert.equal(rootPackage.scripts['build:wxglobe'], 'node scripts/build-demos.mjs wxglobe');
  assert.equal(rootPackage.scripts['build:demos'], 'node scripts/build-demos.mjs');
  assert.equal(manifest.devPort, 5173, 'unified demos devPort must default to 5173');
  assert.equal(wxglobeSpec?.cesium, true, 'wxglobe manifest entry must enable Cesium');
  assert.ok(viteConfig.includes('path.resolve(docsRoot, demoName)'), 'unified Vite config must build demos to docs/<demo>');
  assert.ok(viteConfig.includes("CESIUM_BASE_URL = JSON.stringify('./cesium/')"), 'wxglobe Cesium base URL must be nested-path safe');
  assert.ok(viteConfig.includes("['Workers', 'ThirdParty', 'Assets', 'Widgets']"), 'wxglobe must copy Cesium runtime assets');
  assert.equal(demoPackage.dependencies.cesium, '1.144.0');
  assert.equal(demoPackage.dependencies['grib-js'], undefined, 'retired GRIB dependency must stay absent');
  assert.equal(demoPackage.dependencies.netcdfjs, undefined, 'retired NetCDF dependency must stay absent');
  assert.ok(main.includes('baseLayer: false'), 'wxglobe default must not add tiled imagery');
  assert.ok(main.includes('viewer.imageryLayers.removeAll()'), 'wxglobe must enforce zero imagery layers');
  assert.ok(etopoTerrain.includes('@peercompute/geo-core/terrain/etopo2022'), 'wxglobe must consume shared ETOPO terrain');
  assert.ok(terrariumTerrain.includes('@peercompute/geo-core/terrain/terrarium'), 'wxglobe must consume shared Terrarium terrain');
  assert.ok(sharedEtopoTerrain.includes("ETOPO_2022_v1_60s_surface"), 'shared terrain must pin the current ETOPO 2022 surface');
  assert.ok(sharedEtopoTerrain.includes('pixelType'), 'shared terrain missing NOAA S16 BIP request');
  assert.ok(sharedEtopoTerrain.includes('getInt16(index * Int16Array.BYTES_PER_ELEMENT, true)'), 'shared terrain missing little-endian BIP decode');
  assert.ok(sharedEtopoTerrain.includes('ETOPO2022_TILE_SIZE = 257'), 'shared ETOPO grid must use 256 dyadic intervals');
  assert.ok(sharedTerrariumTerrain.includes('elevation-tiles-prod.s3.amazonaws.com/terrarium'), 'shared terrain missing AWS Terrarium source');
  assert.ok(sharedTerrariumTerrain.includes('blue / 256 - 32768'), 'shared terrain missing Terrarium height decode');
  assert.ok(sharedTerrariumTerrain.includes('TERRARIUM_GRID_SIZE = TERRARIUM_TILE_SIZE + 1'), 'shared AWS grid must use endpoint posts');
  assert.ok(main.includes('providerGeneration'), 'wxglobe source switching must reject stale provider telemetry');
  assert.ok(indexHtml.includes('NO IMAGERY LAYER'), 'wxglobe UI must disclose the imagery-free default');
  assert.ok(indexHtml.includes('id="aws-terrain-attribution"'), 'wxglobe must expose required AWS source attribution');
  assert.ok(!indexHtml.includes('RTMA'), 'wxglobe UI must not retain retired RTMA controls');

  [devAll, devLocalRelay].forEach((script) => {
    assert.ok(script.includes('demos/.dev-relay'), 'dev launcher missing unified relay-config dir');
    assert.ok(script.includes('npm run dev:demos'), 'dev launcher missing unified dev:demos server');
    assert.ok(script.includes('DEMOS_PORT:-5173'), 'dev launcher missing unified port 5173');
  });

  assert.ok(docsIndex.includes('href="./wxglobe/"'), 'docs overview missing wxglobe link');
  assert.ok(docsIndex.includes('data-demo-dir="wxglobe"'), 'docs overview missing wxglobe metadata');
  assert.ok(docsIndex.includes('data-demo-port="5173"'), 'docs overview missing unified dev port');
});

test('earth and motorcycle are first-class real-data demos with a shared backend', () => {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const demoPackage = JSON.parse(fs.readFileSync(path.join(demosRoot, 'package.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(demosRoot, 'manifest.json'), 'utf8'));
  const earthSpec = manifest.demos.find((entry) => entry.name === 'earth');
  const motorcycleSpec = manifest.demos.find((entry) => entry.name === 'motorcycle');
  const viteConfig = fs.readFileSync(path.join(demosRoot, 'vite.config.js'), 'utf8');
  const motorcycleHtml = fs.readFileSync(path.join(demosRoot, 'motorcycle', 'index.html'), 'utf8');
  const motorcycleMain = fs.readFileSync(path.join(demosRoot, 'motorcycle', 'src', 'main.js'), 'utf8');
  const devAll = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-all.sh'), 'utf8');
  const devLocalRelay = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-local-relay.sh'), 'utf8');
  const docsIndex = fs.readFileSync(path.join(repoRoot, 'docs', 'index.html'), 'utf8');

  assert.ok(rootPackage.workspaces.includes('packages/geo-core'));
  assert.ok(rootPackage.workspaces.includes('services/geodata'));
  assert.ok(rootPackage.workspaces.includes('demos'));
  assert.equal(rootPackage.scripts['dev:earth'], 'node scripts/dev-demo.mjs earth');
  assert.equal(rootPackage.scripts['dev:motorcycle'], 'node scripts/dev-demo.mjs motorcycle');
  assert.equal(rootPackage.scripts['build:earth'], 'node scripts/build-demos.mjs earth');
  assert.equal(rootPackage.scripts['build:motorcycle'], 'node scripts/build-demos.mjs motorcycle');
  assert.equal(earthSpec?.cesium, true);
  assert.equal(earthSpec?.geodataProxy, true);
  assert.equal(motorcycleSpec?.cesium, true);
  assert.equal(motorcycleSpec?.geodataProxy, true);
  assert.equal(demoPackage.dependencies.cesium, '1.144.0');
  assert.equal(demoPackage.devDependencies['vite-plugin-static-copy'], '^4.1.1');
  assert.ok(viteConfig.includes("CESIUM_BASE_URL = JSON.stringify('./cesium/')"));
  assert.ok(viteConfig.includes("['Workers', 'ThirdParty', 'Assets', 'Widgets']"));
  assert.ok(viteConfig.includes("'/api'"), 'unified dev server must proxy the geodata API');
  assert.ok(motorcycleHtml.includes('id="overview-viewport"'));
  assert.ok(motorcycleMain.includes("import * as Cesium from 'cesium'"));
  assert.ok(motorcycleMain.includes('createRoadvectorOverviewRuntime'));
  assert.ok(motorcycleMain.includes('createMotorcycleGameRuntime'));
  assert.ok(motorcycleMain.includes('createMotorcycleWorldRenderer'));
  assert.ok(motorcycleMain.includes('createMotorcycleInputRuntime'));
  assert.ok(motorcycleMain.includes('createMotorcycleXrPanel'));
  [devAll, devLocalRelay].forEach((script) => {
    assert.ok(script.includes('services/geodata'));
    assert.ok(script.includes('npm run dev:demos'));
    assert.ok(script.includes('DEMOS_PORT:-5173'));
  });
  assert.ok(docsIndex.includes('href="./earth/"'));
  assert.ok(docsIndex.includes('href="./motorcycle/"'));
  assert.ok(docsIndex.includes('data-demo-port="5173"'));
});

test('multiscale ladder is wired as a first-class repo demo', () => {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(demosRoot, 'manifest.json'), 'utf8'));
  const demoOrder = manifest.demos.map((entry) => entry.name);
  const multiscaleSpec = manifest.demos.find((entry) => entry.name === 'multiscale');
  const indexHtml = fs.readFileSync(path.join(demosRoot, 'multiscale', 'index.html'), 'utf8');
  const viteConfig = fs.readFileSync(path.join(demosRoot, 'vite.config.js'), 'utf8');
  const main = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'main.js'), 'utf8');
  const runtime = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'peercomputeLadderRuntime.js'), 'utf8');
  const orchestrator = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'scaleComputeOrchestrator.js'), 'utf8');
  const worker = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'peercomputeComputeWorker.js'), 'utf8');
  const tasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'peercomputeLadderTasks.js'), 'utf8');
  const nbodyTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'nbodyGravityTasks.js'), 'utf8');
  const reactiveTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'reactiveThermalTasks.js'), 'utf8');
  const maxwellTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'maxwellTasks.js'), 'utf8');
  const stellarTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'stellarFusionTasks.js'), 'utf8');
  const magnetosphereTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'magnetospherePlasmaTasks.js'), 'utf8');
  const picTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'picPlasmaPatchTasks.js'), 'utf8');
  const relativityTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'relativisticCorrectionTasks.js'), 'utf8');
  const cosmologyTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'cosmologyExpansionTasks.js'), 'utf8');
  const molecularTasks = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'molecularDynamicsTasks.js'), 'utf8');
  const solverDescriptors = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'solverWorkerDescriptors.js'), 'utf8');
  const webgpuCompute = fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'compute', 'webgpuLadderCompute.js'), 'utf8');
  const devAll = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-all.sh'), 'utf8');
  const devLocalRelay = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-local-relay.sh'), 'utf8');
  const docsIndex = fs.readFileSync(path.join(repoRoot, 'docs', 'index.html'), 'utf8');

  assert.ok(rootPackage.workspaces.includes('demos'), 'root workspaces missing demos');
  assert.equal(
    rootPackage.scripts['dev:multiscale'],
    'node scripts/dev-demo.mjs multiscale',
    'root dev:multiscale script mismatch'
  );
  assert.equal(
    rootPackage.scripts['build:multiscale'],
    'node scripts/build-demos.mjs multiscale',
    'root build:multiscale script mismatch'
  );
  assert.equal(
    rootPackage.scripts['build:demos'],
    'node scripts/build-demos.mjs',
    'build:demos must use unified build driver'
  );
  assert.equal(multiscaleSpec?.multiscaleWorkers, true, 'multiscale manifest entry missing multiscaleWorkers flag');
  assert.ok(
    demoOrder.indexOf('planetgen') < demoOrder.indexOf('multiscale')
      && demoOrder.indexOf('multiscale') < demoOrder.indexOf('universes'),
    'demos/manifest.json should build multiscale between planetgen and universes'
  );

  assert.ok(
    viteConfig.includes('path.resolve(docsRoot, demoName)'),
    'unified Vite config must build multiscale to docs/multiscale'
  );
  assert.ok(viteConfig.includes('@peercompute\\/core'), 'unified Vite config missing @peercompute/core alias');
  assert.ok(viteConfig.includes('peercomputeLadderTasks'), 'unified Vite config must emit ladder task entry');
  assert.ok(viteConfig.includes('nbodyGravityTasks'), 'unified Vite config must emit N-body solver task entry');
  assert.ok(viteConfig.includes('reactiveThermalTasks'), 'unified Vite config must emit reactive thermal solver task entry');
  assert.ok(viteConfig.includes('maxwellTasks'), 'unified Vite config must emit Maxwell solver task entry');
  assert.ok(viteConfig.includes('stellarFusionTasks'), 'unified Vite config must emit stellar fusion solver task entry');
  assert.ok(viteConfig.includes('magnetospherePlasmaTasks'), 'unified Vite config must emit magnetosphere plasma solver task entry');
  assert.ok(viteConfig.includes('picPlasmaPatchTasks'), 'unified Vite config must emit PIC plasma patch solver task entry');
  assert.ok(viteConfig.includes('relativisticCorrectionTasks'), 'unified Vite config must emit relativistic correction solver task entry');
  assert.ok(viteConfig.includes('cosmologyExpansionTasks'), 'unified Vite config must emit cosmology expansion solver task entry');
  assert.ok(viteConfig.includes('molecularDynamicsTasks'), 'unified Vite config must emit molecular dynamics solver task entry');
  assert.ok(viteConfig.includes('peercomputeComputeWorker'), 'unified Vite config must emit ComputeManager worker entry');
  const peercomputeImport = main.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]@peercompute\/core['"]/);
  assert.ok(peercomputeImport, 'multiscale main must import from @peercompute/core');
  assert.match(peercomputeImport[1], /\bComputeManager\b/, 'multiscale main must import PeerCompute ComputeManager');
  assert.match(peercomputeImport[1], /\bStateManager\b/, 'multiscale main must import PeerCompute StateManager');
  assert.ok(main.includes('workerBootstrapURL'), 'multiscale main must provide a bundled ComputeManager worker URL');
  assert.ok(main.includes('new ScaleComputeOrchestrator'), 'multiscale main must use the per-scale worker orchestrator');
  assert.ok(main.includes('new StateManager'), 'multiscale main must own a StateManager for compute deltas');
  assert.ok(main.includes('setCommitDeltaHandler'), 'multiscale main must route ComputeManager deltas into StateManager');
  assert.ok(main.includes('computeManager,'), 'multiscale main must pass one shared ComputeManager into the orchestrator');
  assert.ok(main.includes('createMultiscaleComputeBudget'), 'multiscale main must use adaptive compute budgeting');
  assert.ok(main.includes('readComputeOverrides'), 'multiscale main must expose compute budget overrides');
  assert.ok(main.includes('registerSolver'), 'multiscale main must register solver-worker descriptors');
  assert.ok(main.includes('applyNBodySolverState'), 'multiscale main must route N-body solver output into the scene');
  assert.ok(main.includes('applyMaxwellFieldState'), 'multiscale main must route Maxwell solver output into the scene');
  assert.ok(main.includes('applyStellarFusionState'), 'multiscale main must route stellar fusion solver output into the scene');
  assert.ok(main.includes('applyMagnetospherePlasmaState'), 'multiscale main must route magnetosphere plasma solver output into the scene');
  assert.ok(main.includes('applyPicPlasmaPatchState'), 'multiscale main must route PIC plasma patch solver output into the scene');
  assert.ok(main.includes('applyRelativisticCorrectionState'), 'multiscale main must route relativistic correction solver output into the scene');
  assert.ok(main.includes('applyCosmologyExpansionState'), 'multiscale main must route cosmology expansion solver output into the scene');
  assert.ok(main.includes('applyMolecularDynamicsState'), 'multiscale main must route molecular dynamics solver output into the scene');
  assert.ok(main.includes('SUPPORTED_MOLECULAR_ELEMENTS'), 'multiscale main must expose periodic-table molecular controls');
  assert.ok(main.includes('setMolecularComposition'), 'multiscale demo API must expose molecular composition replacement');
  assert.ok(main.includes('addMolecularAtoms'), 'multiscale demo API must expose atom insertion');
  assert.ok(indexHtml.includes('id="atom-symbol"'), 'multiscale UI missing atom symbol selector');
  assert.ok(indexHtml.includes('id="atom-count"'), 'multiscale UI missing atom count input');
  assert.ok(indexHtml.includes('id="atom-water"'), 'multiscale UI missing water molecule preset');
  assert.ok(indexHtml.includes('id="ambient-temperature"'), 'multiscale UI missing ambient temperature control');
  assert.ok(indexHtml.includes('id="ambient-pressure"'), 'multiscale UI missing ambient pressure control');
  assert.ok(main.includes('ambientTemperatureK'), 'multiscale main must wire ambient temperature into environment state');
  assert.ok(main.includes('ambientPressurePa'), 'multiscale main must wire ambient pressure into environment state');
  assert.ok(!main.includes('createManager:'), 'multiscale main must not create one ComputeManager per shard');
  assert.ok(orchestrator.includes('workersPerScale'), 'multiscale orchestrator missing per-scale worker plan');
  assert.ok(orchestrator.includes('computeBudget'), 'multiscale orchestrator missing compute budget telemetry');
  assert.ok(orchestrator.includes('peercompute-scale-worker-pool'), 'multiscale orchestrator missing scale-pool telemetry');
  assert.ok(orchestrator.includes('new PeerComputeLadderRuntime'), 'multiscale orchestrator must compose PeerCompute ladder shard runtimes');
  assert.ok(orchestrator.includes('stateManager.getDataState'), 'multiscale orchestrator must read compute deltas through StateManager/DataState');
  assert.ok(orchestrator.includes('readWarm'), 'multiscale orchestrator must consume warm compute deltas');
  assert.ok(orchestrator.includes('stateBacked'), 'multiscale orchestrator telemetry must expose StateManager backing');
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getNBodyOverlayStatus'),
    'multiscale scene missing N-body overlay telemetry'
  );
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getMaxwellOverlayStatus'),
    'multiscale scene missing Maxwell overlay telemetry'
  );
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getStellarFusionOverlayStatus'),
    'multiscale scene missing stellar fusion overlay telemetry'
  );
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getMagnetospherePlasmaOverlayStatus'),
    'multiscale scene missing magnetosphere plasma overlay telemetry'
  );
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getPicPlasmaPatchOverlayStatus'),
    'multiscale scene missing PIC plasma patch overlay telemetry'
  );
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getRelativisticCorrectionOverlayStatus'),
    'multiscale scene missing relativistic correction overlay telemetry'
  );
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getCosmologyExpansionOverlayStatus'),
    'multiscale scene missing cosmology expansion overlay telemetry'
  );
  assert.ok(
    fs.readFileSync(path.join(demosRoot, 'multiscale', 'src', 'visualization', 'multiscaleScene.js'), 'utf8').includes('getMolecularDynamicsOverlayStatus'),
    'multiscale scene missing molecular dynamics overlay telemetry'
  );
  assert.ok(runtime.includes('manager.submitTask'), 'multiscale runtime must submit work through ComputeManager');
  assert.ok(runtime.includes('resolvePeerComputeWorkerBootstrapUrl'), 'multiscale runtime missing worker bootstrap URL resolver');
  assert.ok(worker.includes('executeTaskPayload'), 'multiscale worker bootstrap must call PeerCompute task runtime');
  assert.ok(tasks.includes('initLadderCompute'), 'multiscale task module missing init export');
  assert.ok(tasks.includes('stepLadderCompute'), 'multiscale task module missing step export');
  assert.ok(tasks.includes('commitDelta'), 'multiscale task module must emit DataState commit deltas');
  assert.ok(nbodyTasks.includes('stepNBodyGravity'), 'multiscale N-body task module missing step export');
  assert.ok(nbodyTasks.includes('computeNBodyDiagnostics'), 'multiscale N-body task module missing diagnostics export');
  assert.ok(nbodyTasks.includes('createComputePipeline'), 'multiscale N-body task module missing WebGPU compute pipeline');
  assert.ok(nbodyTasks.includes('webgpu-direct-sum'), 'multiscale N-body task module missing WebGPU backend label');
  assert.ok(nbodyTasks.includes('cpu-direct-sum'), 'multiscale N-body task module missing CPU fallback backend label');
  assert.ok(nbodyTasks.includes('commitDelta'), 'multiscale N-body task module must emit DataState commit deltas');
  assert.ok(reactiveTasks.includes('stepReactiveThermalCell'), 'multiscale reactive thermal task module missing step export');
  assert.ok(reactiveTasks.includes('cpu-reactive-thermal'), 'multiscale reactive thermal task module missing backend label');
  assert.ok(reactiveTasks.includes('commitDelta'), 'multiscale reactive thermal task module must emit DataState commit deltas');
  assert.ok(maxwellTasks.includes('stepMaxwellFields'), 'multiscale Maxwell task module missing step export');
  assert.ok(maxwellTasks.includes('computeMaxwellDiagnostics'), 'multiscale Maxwell task module missing diagnostics export');
  assert.ok(maxwellTasks.includes('createComputePipeline'), 'multiscale Maxwell task module missing WebGPU compute pipeline');
  assert.ok(maxwellTasks.includes('webgpu-maxwell-fdtd'), 'multiscale Maxwell task module missing WebGPU backend label');
  assert.ok(maxwellTasks.includes('cpu-maxwell-fdtd'), 'multiscale Maxwell task module missing backend label');
  assert.ok(maxwellTasks.includes('commitDelta'), 'multiscale Maxwell task module must emit DataState commit deltas');
  assert.ok(stellarTasks.includes('stepStellarFusion'), 'multiscale stellar fusion task module missing step export');
  assert.ok(stellarTasks.includes('computeStellarFusionDiagnostics'), 'multiscale stellar fusion task module missing diagnostics export');
  assert.ok(stellarTasks.includes('createComputePipeline'), 'multiscale stellar fusion task module missing WebGPU compute pipeline');
  assert.ok(stellarTasks.includes('webgpu-stellar-fusion'), 'multiscale stellar fusion task module missing WebGPU backend label');
  assert.ok(stellarTasks.includes('cpu-stellar-fusion'), 'multiscale stellar fusion task module missing backend label');
  assert.ok(stellarTasks.includes('commitDelta'), 'multiscale stellar fusion task module must emit DataState commit deltas');
  assert.ok(magnetosphereTasks.includes('stepMagnetospherePlasma'), 'multiscale magnetosphere plasma task module missing step export');
  assert.ok(magnetosphereTasks.includes('computeMagnetosphereDiagnostics'), 'multiscale magnetosphere plasma task module missing diagnostics export');
  assert.ok(magnetosphereTasks.includes('createComputePipeline'), 'multiscale magnetosphere plasma task module missing WebGPU compute pipeline');
  assert.ok(magnetosphereTasks.includes('webgpu-magnetosphere-plasma'), 'multiscale magnetosphere plasma task module missing WebGPU backend label');
  assert.ok(magnetosphereTasks.includes('cpu-magnetosphere-plasma'), 'multiscale magnetosphere plasma task module missing backend label');
  assert.ok(magnetosphereTasks.includes('commitDelta'), 'multiscale magnetosphere plasma task module must emit DataState commit deltas');
  assert.ok(picTasks.includes('stepPicPlasmaPatch'), 'multiscale PIC plasma patch task module missing step export');
  assert.ok(picTasks.includes('computePicPlasmaDiagnostics'), 'multiscale PIC plasma patch task module missing diagnostics export');
  assert.ok(picTasks.includes('createComputePipeline'), 'multiscale PIC plasma patch task module missing WebGPU compute pipeline');
  assert.ok(picTasks.includes('webgpu-pic-plasma-patch'), 'multiscale PIC plasma patch task module missing WebGPU backend label');
  assert.ok(picTasks.includes('cpu-pic-plasma-patch'), 'multiscale PIC plasma patch task module missing backend label');
  assert.ok(picTasks.includes('commitDelta'), 'multiscale PIC plasma patch task module must emit DataState commit deltas');
  assert.ok(relativityTasks.includes('stepRelativisticCorrection'), 'multiscale relativistic correction task module missing step export');
  assert.ok(relativityTasks.includes('computeRelativisticCorrectionDiagnostics'), 'multiscale relativistic correction task module missing diagnostics export');
  assert.ok(relativityTasks.includes('createComputePipeline'), 'multiscale relativistic correction task module missing WebGPU compute pipeline');
  assert.ok(relativityTasks.includes('webgpu-relativistic-correction'), 'multiscale relativistic correction task module missing WebGPU backend label');
  assert.ok(relativityTasks.includes('cpu-relativistic-correction'), 'multiscale relativistic correction task module missing backend label');
  assert.ok(relativityTasks.includes('commitDelta'), 'multiscale relativistic correction task module must emit DataState commit deltas');
  assert.ok(cosmologyTasks.includes('stepCosmologyExpansion'), 'multiscale cosmology expansion task module missing step export');
  assert.ok(cosmologyTasks.includes('computeCosmologyExpansionDiagnostics'), 'multiscale cosmology expansion task module missing diagnostics export');
  assert.ok(cosmologyTasks.includes('createComputePipeline'), 'multiscale cosmology expansion task module missing WebGPU compute pipeline');
  assert.ok(cosmologyTasks.includes('webgpu-cosmology-expansion'), 'multiscale cosmology expansion task module missing WebGPU backend label');
  assert.ok(cosmologyTasks.includes('cpu-cosmology-expansion'), 'multiscale cosmology expansion task module missing backend label');
  assert.ok(cosmologyTasks.includes('commitDelta'), 'multiscale cosmology expansion task module must emit DataState commit deltas');
  assert.ok(molecularTasks.includes('stepMolecularDynamics'), 'multiscale molecular dynamics task module missing step export');
  assert.ok(molecularTasks.includes('computeMolecularDynamicsDiagnostics'), 'multiscale molecular dynamics task module missing diagnostics export');
  assert.ok(molecularTasks.includes('SUPPORTED_MOLECULAR_ELEMENTS'), 'multiscale molecular dynamics task module missing periodic-table element metadata');
  assert.ok(molecularTasks.includes('normalizeMolecularComposition'), 'multiscale molecular dynamics task module missing composition normalizer');
  assert.ok(molecularTasks.includes('createComputePipeline'), 'multiscale molecular dynamics task module missing WebGPU compute pipeline');
  assert.ok(molecularTasks.includes('webgpu-molecular-dynamics'), 'multiscale molecular dynamics task module missing WebGPU backend label');
  assert.ok(molecularTasks.includes('cpu-molecular-dynamics'), 'multiscale molecular dynamics task module missing backend label');
  assert.ok(molecularTasks.includes('commitDelta'), 'multiscale molecular dynamics task module must emit DataState commit deltas');
  assert.ok(solverDescriptors.includes('nbody-gravity'), 'multiscale solver descriptors missing N-body family');
  assert.ok(solverDescriptors.includes('createMultiscaleSolverDescriptors'), 'multiscale solver descriptors missing executable factory');
  assert.ok(solverDescriptors.includes('resolveNBodyGravityTaskModuleUrl'), 'multiscale solver descriptors missing N-body module URL resolver');
  assert.ok(solverDescriptors.includes('resolveReactiveThermalTaskModuleUrl'), 'multiscale solver descriptors missing reactive thermal module URL resolver');
  assert.ok(solverDescriptors.includes('resolveMaxwellTaskModuleUrl'), 'multiscale solver descriptors missing Maxwell module URL resolver');
  assert.ok(solverDescriptors.includes('resolveStellarFusionTaskModuleUrl'), 'multiscale solver descriptors missing stellar fusion module URL resolver');
  assert.ok(solverDescriptors.includes('resolveMagnetospherePlasmaTaskModuleUrl'), 'multiscale solver descriptors missing magnetosphere plasma module URL resolver');
  assert.ok(solverDescriptors.includes('resolvePicPlasmaPatchTaskModuleUrl'), 'multiscale solver descriptors missing PIC plasma patch module URL resolver');
  assert.ok(solverDescriptors.includes('resolveRelativisticCorrectionTaskModuleUrl'), 'multiscale solver descriptors missing relativistic correction module URL resolver');
  assert.ok(solverDescriptors.includes('resolveCosmologyExpansionTaskModuleUrl'), 'multiscale solver descriptors missing cosmology expansion module URL resolver');
  assert.ok(solverDescriptors.includes('resolveMolecularDynamicsTaskModuleUrl'), 'multiscale solver descriptors missing molecular dynamics module URL resolver');
  assert.ok(solverDescriptors.includes('stepNBodyGravity'), 'multiscale solver descriptors missing N-body task export wiring');
  assert.ok(solverDescriptors.includes('stepReactiveThermalCell'), 'multiscale solver descriptors missing reactive thermal task export wiring');
  assert.ok(solverDescriptors.includes('stepMaxwellFields'), 'multiscale solver descriptors missing Maxwell task export wiring');
  assert.ok(solverDescriptors.includes('stepStellarFusion'), 'multiscale solver descriptors missing stellar fusion task export wiring');
  assert.ok(solverDescriptors.includes('stepMagnetospherePlasma'), 'multiscale solver descriptors missing magnetosphere plasma task export wiring');
  assert.ok(solverDescriptors.includes('stepPicPlasmaPatch'), 'multiscale solver descriptors missing PIC plasma patch task export wiring');
  assert.ok(solverDescriptors.includes('stepRelativisticCorrection'), 'multiscale solver descriptors missing relativistic correction task export wiring');
  assert.ok(solverDescriptors.includes('stepCosmologyExpansion'), 'multiscale solver descriptors missing cosmology expansion task export wiring');
  assert.ok(solverDescriptors.includes('maxwell-em'), 'multiscale solver descriptors missing Maxwell family');
  assert.ok(solverDescriptors.includes('stellar-fusion'), 'multiscale solver descriptors missing stellar fusion family');
  assert.ok(solverDescriptors.includes('magnetosphere-plasma'), 'multiscale solver descriptors missing magnetosphere plasma family');
  assert.ok(solverDescriptors.includes('pic-plasma-patch'), 'multiscale solver descriptors missing PIC plasma patch family');
  assert.ok(solverDescriptors.includes('relativistic-correction'), 'multiscale solver descriptors missing relativistic correction family');
  assert.ok(solverDescriptors.includes('cosmology-expansion'), 'multiscale solver descriptors missing cosmology expansion family');
  assert.ok(solverDescriptors.includes('reactive-thermal-cell'), 'multiscale solver descriptors missing reactive thermal family');
  assert.ok(webgpuCompute.includes('createComputePipeline'), 'multiscale WebGPU compute pipeline missing');

  [devAll, devLocalRelay].forEach((script) => {
    assert.ok(script.includes('demos/.dev-relay'), 'dev launcher missing unified relay-config dir');
    assert.ok(script.includes('npm run dev:demos'), 'dev launcher missing unified dev:demos command');
    assert.ok(script.includes('DEMOS_PORT:-5173'), 'dev launcher missing unified port 5173');
  });

  assert.ok(docsIndex.includes('href="./multiscale/"'), 'docs overview missing multiscale folder link');
  assert.ok(docsIndex.includes('data-demo-dir="multiscale"'), 'docs overview missing multiscale demo metadata');
  assert.ok(docsIndex.includes('data-demo-port="5173"'), 'docs overview missing unified dev port');
});

test('cubechat uses PeerCompute for WebRTC signaling', () => {
  const networkFile = path.join(demosRoot, 'cubechat', 'src', 'p2p', 'network.js');
  const content = fs.readFileSync(networkFile, 'utf8');
  assert.ok(content.includes('RTCPeerConnection'), 'cubechat WebRTC adapter missing');
  assert.ok(content.includes('webrtc-offer'), 'cubechat WebRTC signaling missing');
  assert.ok(content.includes('queueEvent'), 'cubechat PeerCompute event usage missing');
  assert.ok(content.includes('_handleSignalError'), 'cubechat async signaling guard missing');
  assert.ok(content.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'), 'cubechat missing non-fatal transport startup');
  assert.ok(
    content.includes('cannot create an answer in a state other than have-remote-offer'),
    'cubechat stable-state answer guard missing'
  );
});

test('hyperborea opts into non-fatal relay listen startup', () => {
  const gameFile = path.join(demosRoot, 'hyperborea', 'src', 'game', 'Game.js');
  const cubechatRoomDirectory = path.join(demosRoot, 'cubechat', 'src', 'p2p', 'roomDirectory.js');
  const roomDirectoryFile = path.join(demosRoot, 'hyperborea', 'src', 'game', 'roomDirectory.js');
  const gameContent = fs.readFileSync(gameFile, 'utf8');
  const cubechatRoomDirectoryContent = fs.readFileSync(cubechatRoomDirectory, 'utf8');
  const roomDirectoryContent = fs.readFileSync(roomDirectoryFile, 'utf8');
  assert.ok(
    gameContent.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'),
    'hyperborea main node missing non-fatal transport startup'
  );
  assert.ok(
    cubechatRoomDirectoryContent.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'),
    'cubechat room directory missing non-fatal transport startup'
  );
  assert.ok(
    roomDirectoryContent.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'),
    'hyperborea room directory missing non-fatal transport startup'
  );
});

test('cubechat, hyperborea, and sneakywoods register bot bridges for shared harness control', () => {
  const bridgeHelper = path.join(demosRoot, 'shared', 'peercomputeBotBridge.js');
  const botHelper = path.join(demosRoot, 'shared', 'peercomputeBots.js');
  const cubechatMain = path.join(demosRoot, 'cubechat', 'src', 'main.js');
  const hyperboreaGame = path.join(demosRoot, 'hyperborea', 'src', 'game', 'Game.js');
  const sneakywoodsMain = path.join(demosRoot, 'sneakywoods', 'main.js');
  assert.ok(exists(bridgeHelper), 'shared bot bridge helper missing');
  assert.ok(exists(botHelper), 'shared bot runtime helper missing');
  const cubechatContent = fs.readFileSync(cubechatMain, 'utf8');
  const hyperboreaContent = fs.readFileSync(hyperboreaGame, 'utf8');
  const sneakywoodsContent = fs.readFileSync(sneakywoodsMain, 'utf8');
  assert.ok(
    cubechatContent.includes("registerPeercomputeBotBridge('cubechat'"),
    'cubechat bot bridge registration missing'
  );
  assert.ok(
    hyperboreaContent.includes("registerPeercomputeBotBridge('hyperborea'"),
    'hyperborea bot bridge registration missing'
  );
  assert.ok(
    sneakywoodsContent.includes("registerPeercomputeBotBridge('sneakywoods'"),
    'sneakywoods bot bridge registration missing'
  );
});

test('CubeChat exposes native Residents while Hyperborea and SneakyWoods retain bot controls', () => {
  const cubechatMain = fs.readFileSync(path.join(demosRoot, 'cubechat', 'src', 'main.js'), 'utf8');
  const cubechatSettings = fs.readFileSync(path.join(demosRoot, 'cubechat', 'src', 'ui', 'CubeSettingsUi.js'), 'utf8');
  const cubechatResidents = fs.readFileSync(path.join(demosRoot, 'cubechat', 'src', 'ui', 'CubeWorldUi.js'), 'utf8');
  const hyperboreaHtml = fs.readFileSync(path.join(demosRoot, 'hyperborea', 'cb.html'), 'utf8');
  const sneakywoodsHtml = fs.readFileSync(path.join(demosRoot, 'sneakywoods', 'index.html'), 'utf8');
  assert.ok(cubechatSettings.includes('data-world-action="residents"'), 'CubeChat Residents menu entry missing');
  assert.ok(cubechatMain.includes('onResidents: () => this.worldUi?.openResidents()'), 'CubeChat Residents menu is not connected to the world UI');
  assert.ok(cubechatResidents.includes("button('Place resident')"), 'CubeChat resident creation control missing');
  assert.ok(hyperboreaHtml.includes('id="bot-preset"'), 'hyperborea bot preset control missing');
  assert.ok(hyperboreaHtml.includes('id="bot-status"'), 'hyperborea bot status control missing');
  assert.ok(sneakywoodsHtml.includes('id="bot-clear"'), 'sneakywoods bot clear control missing');
  assert.ok(sneakywoodsHtml.includes('id="bot-status"'), 'sneakywoods bot status control missing');
});

test('shared bot runtime helper builds iframe launch URLs and parses private-room bot params', async () => {
  const modulePath = pathToFileURL(path.join(demosRoot, 'shared', 'peercomputeBots.js')).href;
  const {
    buildPeercomputeBotUrl,
    readPeercomputeBotParams,
    readPeercomputeRoomParams
  } = await import(modulePath);
  const url = buildPeercomputeBotUrl(
    'https://metaversejs.github.io/peercompute/sneakywoods/?relayConfigUrl=https%3A%2F%2Fsecretworkshop.net%2Fpeercompute%2Fconfig%2Frelay-config.json',
    {
      room: { name: 'Lab Room', visibility: 'private' },
      password: 'secret'
    },
    {
      demoId: 'sneakywoods',
      botIndex: 2,
      preset: 'sentinel'
    }
  );
  const params = readPeercomputeBotParams(new URL(url).search);
  const room = readPeercomputeRoomParams(new URL(url).search, {
    buildRoomId: ({ name, visibility, password }) => `${visibility}:${name}:${password}`,
    normalizeRoomName: (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, '-')
  });
  assert.equal(params.enabled, true, 'bot launch flag missing');
  assert.equal(params.demoId, 'sneakywoods', 'bot demo id missing');
  assert.equal(params.botIndex, 2, 'bot index mismatch');
  assert.equal(params.preset, 'sentinel', 'bot preset mismatch');
  assert.equal(room?.visibility, 'private', 'room visibility mismatch');
  assert.equal(room?.password, 'secret', 'room password missing');
  assert.equal(room?.roomId, 'private:lab-room:secret', 'room id normalizer mismatch');
});

test('planetgen uses shared GPU hub device', () => {
  const helperPath = path.join(demosRoot, 'planetgen', 'src', 'peercomputeDevice.js');
  assert.ok(exists(helperPath), 'planetgen peercomputeDevice helper missing');
  const oceanContent = fs.readFileSync(path.join(demosRoot, 'planetgen', 'src', 'OceanComputeSystem.js'), 'utf8');
  assert.ok(oceanContent.includes('init({ device'), 'OceanComputeSystem device injection missing');
  const indexContent = fs.readFileSync(path.join(demosRoot, 'planetgen', 'src', 'index.js'), 'utf8');
  assert.ok(indexContent.includes('getSharedDevice'), 'planetgen missing shared device usage');
});

test('universes offloads generation to ComputeManager', () => {
  const computePath = path.join(demosRoot, 'universes', 'compute', 'universeTasks.js');
  assert.ok(exists(computePath), 'universes compute tasks missing');
  const mainContent = fs.readFileSync(path.join(demosRoot, 'universes', 'main.js'), 'utf8');
  assert.ok(mainContent.includes('ComputeManager'), 'universes missing ComputeManager usage');
  assert.ok(mainContent.includes('runComputeTask'), 'universes missing compute task runner');
});

test('multiscale ladder is WebGPU-compute first and exposes packet hooks', () => {
  const computePath = path.join(demosRoot, 'multiscale', 'src', 'compute', 'webgpuLadderCompute.js');
  const mainPath = path.join(demosRoot, 'multiscale', 'src', 'main.js');
  const modelPath = path.join(demosRoot, 'multiscale', 'src', 'simulation', 'multiscaleModel.js');
  assert.ok(exists(computePath), 'multiscale WebGPU compute backend missing');
  assert.ok(exists(mainPath), 'multiscale main.js missing');
  assert.ok(exists(modelPath), 'multiscale model missing');
  const computeContent = fs.readFileSync(computePath, 'utf8');
  const mainContent = fs.readFileSync(mainPath, 'utf8');
  const modelContent = fs.readFileSync(modelPath, 'utf8');
  assert.ok(computeContent.includes('createComputePipeline'), 'multiscale missing WebGPU compute pipeline');
  assert.ok(computeContent.includes('WEBGPU_PARTICLE_COUNT'), 'multiscale missing particle-count constant');
  assert.ok(mainContent.includes('window.__multiscaleDemo'), 'multiscale missing browser test hook');
  assert.ok(modelContent.includes('peercompute.multiscale.packet.v0'), 'multiscale missing packet schema');
});

test('webgpuphys headless uses isolated compute tasks', () => {
  const computePath = path.join(demosRoot, 'webgpuphys', 'demos', 'shared', 'mpmComputeTasks.js');
  assert.ok(exists(computePath), 'webgpuphys compute tasks missing');
  const headlessContent = fs.readFileSync(path.join(demosRoot, 'webgpuphys', 'demos', 'mpm-headless.js'), 'utf8');
  assert.ok(headlessContent.includes('ComputeManager'), 'webgpuphys headless ComputeManager usage missing');
  assert.ok(headlessContent.includes('virtual:peercompute-mpm-task-url'), 'webgpuphys bundled compute module URL missing');
  assert.ok(headlessContent.includes('module: COMPUTE_MODULE_URL'), 'webgpuphys tasks must use the bundled module URL');
  const config = fs.readFileSync(path.join(demosRoot, 'vite.config.js'), 'utf8');
  assert.ok(config.includes('webgpuphys/demos/shared/mpmComputeTasks.js') && config.includes("preserveSignature: 'strict'"), 'webgpuphys task exports must survive bundling');
});

test('fano-reactor ships sedenion chemistry model modules', () => {
  const mainPath = path.join(demosRoot, 'fano-reactor', 'src', 'main.js');
  const chemistryPath = path.join(demosRoot, 'fano-reactor', 'src', 'model', 'chemistry.js');
  const algebraPath = path.join(demosRoot, 'fano-reactor', 'src', 'algebra', 'sedenion.js');
  assert.ok(exists(mainPath), 'fano-reactor main.js missing');
  assert.ok(exists(chemistryPath), 'fano-reactor chemistry model missing');
  assert.ok(exists(algebraPath), 'fano-reactor sedenion algebra missing');
  const main = fs.readFileSync(mainPath, 'utf8');
  const chemistry = fs.readFileSync(chemistryPath, 'utf8');
  assert.ok(main.includes('bond-lab'), 'fano-reactor bond-lab UI missing');
  assert.ok(main.includes('fano-map'), 'fano-reactor fano-map UI missing');
  assert.ok(chemistry.includes('summarizeInteraction'), 'fano-reactor interaction summarizer missing');
});

test('schrodinger ships material packet and visualization modules', () => {
  const mainPath = path.join(demosRoot, 'schrodinger', 'src', 'main.js');
  const packetPath = path.join(demosRoot, 'schrodinger', 'src', 'materials', 'propertyPacket.js');
  const waterPath = path.join(demosRoot, 'schrodinger', 'src', 'materials', 'waterProperties.js');
  const structurePath = path.join(demosRoot, 'schrodinger', 'src', 'data', 'molecularStructures.js');
  const reactivePath = path.join(demosRoot, 'schrodinger', 'src', 'simulation', 'reactiveAtoms.js');
  const orbitalPath = path.join(demosRoot, 'schrodinger', 'src', 'quantum', 'orbitals.js');
  const viewPath = path.join(demosRoot, 'schrodinger', 'src', 'visualization', 'orbitalCloud.js');
  assert.ok(exists(mainPath), 'schrodinger main.js missing');
  assert.ok(exists(packetPath), 'schrodinger property packet schema missing');
  assert.ok(exists(waterPath), 'schrodinger water property model missing');
  assert.ok(exists(structurePath), 'schrodinger molecular structure templates missing');
  assert.ok(exists(reactivePath), 'schrodinger reactive atom sandbox missing');
  assert.ok(exists(orbitalPath), 'schrodinger orbital model missing');
  assert.ok(exists(viewPath), 'schrodinger orbital visualization missing');
  const main = fs.readFileSync(mainPath, 'utf8');
  const structures = fs.readFileSync(structurePath, 'utf8');
  const reactive = fs.readFileSync(reactivePath, 'utf8');
  assert.ok(main.includes('peercompute-attach'), 'schrodinger PeerCompute attach UI missing');
  assert.ok(main.includes('__schrodingerDemo'), 'schrodinger test/introspection hook missing');
  assert.ok(main.includes('Reactive atoms'), 'schrodinger reactive atoms UI missing');
  assert.ok(structures.includes('bondClass'), 'schrodinger bond classification metadata missing');
  assert.ok(structures.includes('ionic'), 'schrodinger ionic bond template missing');
  assert.ok(reactive.includes('toy-reactive-atoms-v0'), 'schrodinger reactive toy model label missing');
});

test('vibeslopdb is wired as a first-class PeerCompute ExoWebTUI demo', () => {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(demosRoot, 'manifest.json'), 'utf8'));
  const vibeSpec = manifest.demos.find((entry) => entry.name === 'vibeslopdb');
  const viteConfig = fs.readFileSync(path.join(demosRoot, 'vite.config.js'), 'utf8');
  const main = fs.readFileSync(path.join(demosRoot, 'vibeslopdb', 'src', 'main.js'), 'utf8');
  const devAll = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-all.sh'), 'utf8');
  const devLocalRelay = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-local-relay.sh'), 'utf8');
  const docsIndex = fs.readFileSync(path.join(repoRoot, 'docs', 'index.html'), 'utf8');

  assert.ok(rootPackage.workspaces.includes('demos'), 'root workspaces missing demos');
  assert.equal(rootPackage.scripts['dev:vibeslopdb'], 'node scripts/dev-demo.mjs vibeslopdb');
  assert.equal(rootPackage.scripts['build:vibeslopdb'], 'node scripts/build-demos.mjs vibeslopdb');
  assert.equal(rootPackage.scripts['build:demos'], 'node scripts/build-demos.mjs');
  assert.equal(vibeSpec?.vibeslopdb, true, 'vibeslopdb manifest flag missing');
  assert.equal(vibeSpec?.pagesIsolation, true, 'vibeslopdb must enable pagesIsolation');
  assert.ok(viteConfig.includes('pagesIsolationPlugin'), 'unified Vite config must wire pagesIsolationPlugin');
  assert.ok(main.includes('createLocalStateStore'), 'vibeslopdb must persist state via PeerCompute StateManager');
  assert.ok(main.includes('createPeerComputeAiBridge'), 'vibeslopdb must wire PeerCompute AI bridge');
  assert.ok(main.includes('returnToPeerComputeAtlas'), 'vibeslopdb must support PeerCompute ExoWebTUI return protocol');
  [devAll, devLocalRelay].forEach((script) => {
    assert.ok(script.includes('npm run dev:demos'), 'dev launcher missing unified dev:demos');
    assert.ok(script.includes('DEMOS_PORT:-5173'), 'dev launcher missing unified port 5173');
  });
  assert.ok(docsIndex.includes('href="./vibeslopdb/"'), 'docs overview missing vibeslopdb link');
  assert.ok(docsIndex.includes('data-demo-dir="vibeslopdb"'), 'docs overview missing vibeslopdb metadata');
  assert.ok(docsIndex.includes('data-demo-port="5173"'), 'docs overview missing unified dev port');
  assert.ok(docsIndex.includes('data-host-module="./vibeslopdb/host.js"'), 'docs overview missing vibeslopdb multi-window host module');
  assert.ok(fs.existsSync(path.join(demosRoot, 'vibeslopdb', 'src', 'peercomputeHost.js')), 'vibeslopdb peercomputeHost.js missing');
});

test('eshkols-in-space is wired as a first-class PeerCompute WebGPU N-body demo', () => {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(demosRoot, 'manifest.json'), 'utf8'));
  const eshkolSpec = manifest.demos.find((entry) => entry.name === 'eshkols-in-space');
  const runtime = fs.readFileSync(path.join(demosRoot, 'eshkols-in-space', 'src', 'compute', 'runtime.js'), 'utf8');
  const app = fs.readFileSync(path.join(demosRoot, 'eshkols-in-space', 'src', 'app.js'), 'utf8');
  const devAll = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-all.sh'), 'utf8');
  const devLocalRelay = fs.readFileSync(path.join(repoRoot, 'scripts', 'dev-local-relay.sh'), 'utf8');
  const docsIndex = fs.readFileSync(path.join(repoRoot, 'docs', 'index.html'), 'utf8');

  assert.ok(rootPackage.workspaces.includes('demos'), 'root workspaces missing demos');
  assert.equal(rootPackage.scripts['dev:eshkols-in-space'], 'node scripts/dev-demo.mjs eshkols-in-space');
  assert.equal(rootPackage.scripts['build:eshkols-in-space'], 'node scripts/build-demos.mjs eshkols-in-space');
  assert.ok(rootPackage.scripts['test:eshkols-in-space'].includes('demos/eshkols-in-space/physics/physics.test.mjs'));
  assert.equal(rootPackage.scripts['build:demos'], 'node scripts/build-demos.mjs');
  assert.equal(eshkolSpec?.target, 'esnext', 'eshkols-in-space manifest must target esnext');
  assert.ok(runtime.includes("from '@peercompute/gpu-hub'"), 'eshkols-in-space runtime must import GPUHubManager from @peercompute/gpu-hub');
  assert.ok(app.includes('returnToPeerComputeAtlas'), 'eshkols-in-space must support PeerCompute ExoWebTUI return protocol');
  assert.ok(app.includes('window.__eshkolsInSpace'), 'eshkols-in-space must expose diagnostics handle');
  [devAll, devLocalRelay].forEach((script) => {
    assert.ok(script.includes('npm run dev:demos'), 'dev launcher missing unified dev:demos');
    assert.ok(script.includes('DEMOS_PORT:-5173'), 'dev launcher missing unified port 5173');
  });
  assert.ok(docsIndex.includes('href="./eshkols-in-space/"'), 'docs overview missing eshkols-in-space link');
  assert.ok(docsIndex.includes('data-demo-dir="eshkols-in-space"'), 'docs overview missing eshkols-in-space metadata');
  assert.ok(docsIndex.includes('data-demo-port="5173"'), 'docs overview missing unified dev port');
  assert.ok(docsIndex.includes('data-live-gpu="1"'), 'docs overview missing eshkols-in-space live GPU shader flag');
});
