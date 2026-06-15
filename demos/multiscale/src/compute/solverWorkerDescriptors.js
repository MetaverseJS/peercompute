export const MULTISCALE_SOLVER_DESCRIPTORS_SCHEMA = 'peercompute.multiscale.solver-descriptors.v0';
export const MULTISCALE_ULG_RUNTIME_GPU_LANE_ID = 'ulg-runtime:webgpu-pass-dag';
export const MULTISCALE_ULG_RUNTIME_GPU_QUEUE_FENCE_POLICY = 'queue.onSubmittedWorkDone-before-readback-map';

export const MULTISCALE_SOLVER_DESCRIPTORS = [
  {
    id: 'nbody-gravity',
    kind: 'gravity.nbody',
    version: '0.1.0',
    label: 'N-body gravity',
    description: 'Tree/direct gravity task family for orbital, planetary-formation, galactic, and supergalactic layers.',
    inputFields: [
      { name: 'mass', unit: 'kg', dimensions: 'M', location: 'particle' },
      { name: 'position', unit: 'm', dimensions: 'L', location: 'particle' },
      { name: 'velocity', unit: 'm/s', dimensions: 'L T^-1', location: 'particle' }
    ],
    outputFields: [
      { name: 'acceleration', unit: 'm/s^2', dimensions: 'L T^-2', location: 'particle' },
      { name: 'potentialEnergy', unit: 'J', dimensions: 'M L^2 T^-2', location: 'region' }
    ],
    conservedFields: ['mass', 'momentum', 'energy'],
    timestep: { mode: 'symplectic', maxDt: null, subcycles: 1 },
    validity: { regimes: ['solar', 'galactic', 'supergalactic'], approximation: 'direct-sum-reference-or-barnes-hut-tree' },
    affinity: { policy: 'region-state', keyFields: ['solverId', 'layerId', 'regionId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.nbody.delta.v0' }
  },
  {
    id: 'maxwell-em',
    kind: 'field.maxwell',
    version: '0.1.0',
    label: 'Maxwell electromagnetic fields',
    description: 'Electromagnetic field evolution for plasma, magnetosphere, optical, conductivity, and MHD-coupled regimes.',
    inputFields: [
      { name: 'electricField', unit: 'V/m', dimensions: 'M L T^-3 I^-1', location: 'cell' },
      { name: 'magneticField', unit: 'T', dimensions: 'M T^-2 I^-1', location: 'face' },
      { name: 'chargeDensity', unit: 'C/m^3', dimensions: 'I T L^-3', location: 'cell' },
      { name: 'currentDensity', unit: 'A/m^2', dimensions: 'I L^-2', location: 'cell' }
    ],
    outputFields: [
      { name: 'electricFieldDelta', unit: 'V/m', dimensions: 'M L T^-3 I^-1', location: 'cell' },
      { name: 'magneticFieldDelta', unit: 'T', dimensions: 'M T^-2 I^-1', location: 'face' },
      { name: 'poyntingFlux', unit: 'W/m^2', dimensions: 'M T^-3', location: 'face' }
    ],
    conservedFields: ['charge', 'fieldEnergy'],
    timestep: { mode: 'cfl', maxDt: null, subcycles: 1 },
    validity: { regimes: ['planet', 'solar', 'galactic', 'molecular'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'field-tile', keyFields: ['solverId', 'layerId', 'tileId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.maxwell.delta.v0' }
  },
  {
    id: 'cosmology-expansion',
    kind: 'cosmology.expansion',
    version: '0.1.0',
    label: 'Cosmology expansion web',
    description: 'Reduced expansion, density-contrast, filament, void, and structure-growth worker for the supergalactic layer.',
    inputFields: [
      { name: 'position', unit: 'reduced-Mpc', dimensions: 'L', location: 'sample' },
      { name: 'densityContrast', unit: '1', dimensions: '1', location: 'sample' },
      { name: 'scaleFactor', unit: '1', dimensions: '1', location: 'region' },
      { name: 'hubbleRate', unit: 'reduced-H0', dimensions: 'T^-1', location: 'region' },
      { name: 'omegaMatter', unit: '1', dimensions: '1', location: 'region' },
      { name: 'omegaLambda', unit: '1', dimensions: '1', location: 'region' }
    ],
    outputFields: [
      { name: 'expandedPosition', unit: 'reduced-Mpc', dimensions: 'L', location: 'sample' },
      { name: 'velocityDivergence', unit: 'reduced-H0', dimensions: 'T^-1', location: 'sample' },
      { name: 'filamentEnergy', unit: 'reduced', dimensions: 'mixed', location: 'region' },
      { name: 'structureGrowth', unit: 'reduced', dimensions: 'mixed', location: 'region' },
      { name: 'voidFraction', unit: '1', dimensions: '1', location: 'region' }
    ],
    conservedFields: ['mass-density-contrast', 'expansion-energy'],
    timestep: { mode: 'explicit-reduced-cosmology', maxDt: null, subcycles: 1 },
    validity: { regimes: ['supergalactic'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'cosmology-web-tile', keyFields: ['solverId', 'layerId', 'tileId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.cosmology-expansion.delta.v0' }
  },
  {
    id: 'reactive-thermal-cell',
    kind: 'chemistry.reactive-thermal',
    version: '0.1.0',
    label: 'Reactive thermal cell',
    description: 'Reduced chemistry, heat release, phase, and transport closure worker for water/fire/material patches.',
    inputFields: [
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'cell' },
      { name: 'pressure', unit: 'Pa', dimensions: 'M L^-1 T^-2', location: 'cell' },
      { name: 'speciesMassFractions', unit: '1', dimensions: '1', location: 'cell' },
      { name: 'phaseFractions', unit: '1', dimensions: '1', location: 'cell' }
    ],
    outputFields: [
      { name: 'heatSource', unit: 'W/m^3', dimensions: 'M L^-1 T^-3', location: 'cell' },
      { name: 'speciesRates', unit: 'kg kg^-1 s^-1', dimensions: 'T^-1', location: 'cell' },
      { name: 'phaseRates', unit: 's^-1', dimensions: 'T^-1', location: 'cell' },
      { name: 'closureResult', unit: 'mixed', dimensions: 'mixed', location: 'cell' }
    ],
    conservedFields: ['mass', 'species', 'energy'],
    timestep: { mode: 'operator-split', maxDt: null, subcycles: 1 },
    validity: { regimes: ['surface', 'mpm', 'molecular'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'material-cell', keyFields: ['solverId', 'materialId', 'cellId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.reactive-thermal.delta.v0' }
  },
  {
    id: 'molecular-dynamics',
    kind: 'chemistry.molecular-dynamics',
    version: '0.1.0',
    label: 'Molecular dynamics patch',
    description: 'Reduced atom, bond, temperature, charge, and reaction telemetry worker for the molecular layer and closure feedback.',
    inputFields: [
      { name: 'position', unit: 'reduced-nm', dimensions: 'L', location: 'atom' },
      { name: 'velocity', unit: 'reduced-nm/ps', dimensions: 'L T^-1', location: 'atom' },
      { name: 'elementZ', unit: 'atomic-number', dimensions: '1', location: 'atom' },
      { name: 'partialCharge', unit: 'e', dimensions: 'I T', location: 'atom' },
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'atom' }
    ],
    outputFields: [
      { name: 'atomState', unit: 'mixed', dimensions: 'mixed', location: 'atom' },
      { name: 'bondOrder', unit: '1', dimensions: '1', location: 'bond' },
      { name: 'heatReleaseProxy', unit: 'reduced-eV/step', dimensions: 'mixed', location: 'region' },
      { name: 'ionizationFraction', unit: '1', dimensions: '1', location: 'region' }
    ],
    conservedFields: ['mass', 'charge', 'energy', 'bond-topology'],
    timestep: { mode: 'explicit-reduced-md', maxDt: null, subcycles: 1 },
    validity: { regimes: ['molecular', 'mpm', 'surface'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'molecular-patch', keyFields: ['solverId', 'layerId', 'patchId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.molecular-dynamics.delta.v0' }
  },
  {
    id: 'quantum-orbital-grid',
    kind: 'quantum.schrodinger.orbital-grid',
    version: '0.1.0',
    label: 'Quantum orbital finite grid',
    description: 'Screened hydrogenic orbital-grid provider for the orbital layer, requiring WebGPU finite-grid density/residual/evolution reductions and reporting blocked status instead of CPU fallback when unavailable.',
    inputFields: [
      { name: 'elementSymbol', unit: 'periodic-table-symbol', dimensions: '1', location: 'region' },
      { name: 'principalN', unit: '1', dimensions: '1', location: 'orbital' },
      { name: 'angularL', unit: '1', dimensions: '1', location: 'orbital' },
      { name: 'magneticM', unit: '1', dimensions: '1', location: 'orbital' },
      { name: 'gridSize', unit: 'samples-per-axis', dimensions: '1', location: 'grid' }
    ],
    outputFields: [
      { name: 'probabilityMass', unit: '1', dimensions: '1', location: 'grid' },
      { name: 'meanRadius', unit: 'Bohr', dimensions: 'L', location: 'grid' },
      { name: 'rmsRadius', unit: 'Bohr', dimensions: 'L', location: 'grid' },
      { name: 'finiteGrid', unit: 'mixed', dimensions: 'mixed', location: 'grid' }
    ],
    conservedFields: ['probability-mass', 'electron-count'],
    timestep: { mode: 'event-or-cadence-grid-refresh', maxDt: null, subcycles: 1 },
    validity: { regimes: ['orbital', 'molecular'], approximation: 'webgpu-screened-hydrogenic-density-evaluation-no-cpu-fallback' },
    affinity: { policy: 'orbital-state', keyFields: ['solverId', 'elementSymbol', 'principalN', 'angularL', 'magneticM', 'gridSize'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.quantum-orbital-grid.delta.v0' }
  },
  {
    id: 'quantum-material-potential',
    kind: 'quantum.schrodinger.material-potential',
    version: '0.1.0',
    label: 'Quantum material potential batch',
    description: 'Batched atom, molecule, bond, and condition-aware material property evaluator for the Schrodinger bottom layer, requiring WebGPU storage-buffer parallelism and reporting blocked status instead of CPU fallback when unavailable.',
    inputFields: [
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'record' },
      { name: 'pressure', unit: 'Pa', dimensions: 'M L^-1 T^-2', location: 'record' },
      { name: 'gravity', unit: 'm/s^2', dimensions: 'L T^-2', location: 'record' },
      { name: 'electricField', unit: 'V/m', dimensions: 'M L T^-3 I^-1', location: 'record' },
      { name: 'magneticField', unit: 'T', dimensions: 'M T^-2 I^-1', location: 'record' },
      { name: 'materialRecord', unit: 'mixed', dimensions: 'mixed', location: 'record' }
    ],
    outputFields: [
      { name: 'conditionAdjustedDensity', unit: 'kg/m^3', dimensions: 'M L^-3', location: 'record' },
      { name: 'conditionAdjustedMechanicalResponse', unit: 'Pa', dimensions: 'M L^-1 T^-2', location: 'record' },
      { name: 'opticalElectricalResponse', unit: 'mixed', dimensions: 'mixed', location: 'record' },
      { name: 'behaviorDrive', unit: '1', dimensions: '1', location: 'record' },
      { name: 'forceSurfacePreview', unit: 'eV/angstrom', dimensions: 'mixed', location: 'record' },
      { name: 'partitionFunctionLog', unit: '1', dimensions: '1', location: 'record' },
      { name: 'excitedStatePopulation', unit: '1', dimensions: '1', location: 'record' },
      { name: 'ionizationFraction', unit: '1', dimensions: '1', location: 'record' },
      { name: 'ensemblePressure', unit: 'Pa', dimensions: 'M L^-1 T^-2', location: 'record' },
      { name: 'opacityProxy', unit: 'reduced', dimensions: 'mixed', location: 'record' },
      { name: 'degeneracyParameter', unit: '1', dimensions: '1', location: 'record' }
    ],
    conservedFields: ['property-evaluation-only'],
    timestep: { mode: 'batched-property-refresh', maxDt: null, subcycles: 1 },
    validity: { regimes: ['orbital', 'molecular', 'mpm'], approximation: 'webgpu-reference-property-force-and-ensemble-batch' },
    affinity: { policy: 'material-record-batch', keyFields: ['solverId', 'materialId', 'conditionHash', 'recordCount'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.quantum-material-potential.delta.v0' }
  },
  {
    id: 'ulg-runtime',
    kind: 'lawgraph.ulg.webgpu-runtime',
    version: '0.1.0',
    label: 'ULG WebGPU runtime',
    description: 'Manifest-triggered ULG pass-DAG executor that proves canonical law-graph passes through worker-local WebGPU buffers with no CPU fallback.',
    inputFields: [
      { name: 'runtimeManifest', unit: 'schema-object', dimensions: 'mixed', location: 'worker-task' },
      { name: 'passDag', unit: 'peercompute.ulg.worker-pass-dag.v0', dimensions: 'mixed', location: 'worker-task' },
      { name: 'kernelPasses', unit: 'peercompute.ulg.kernel-pass-spec.v0[]', dimensions: 'mixed', location: 'worker-task' },
      { name: 'carrierChannels', unit: 'peercompute.ulg.state-channel-decl.v0[]', dimensions: 'mixed', location: 'manifest' }
    ],
    outputFields: [
      { name: 'passExecutionEvidence', unit: 'peercompute.ulg.webgpu-pass-execution.v0', dimensions: 'mixed', location: 'worker-task' },
      { name: 'executedPassCount', unit: 'count', dimensions: '1', location: 'region' },
      { name: 'evidenceHash', unit: 'hash', dimensions: '1', location: 'region' },
      { name: 'gpuFence', unit: 'peercompute.compute.gpu-fence-report.v0', dimensions: 'mixed', location: 'worker-task' },
      { name: 'compactExecutionDelta', unit: 'peercompute.ulg.webgpu-execution-delta.v0', dimensions: 'mixed', location: 'warm-state' }
    ],
    conservedFields: ['unit-hash', 'closure-provenance', 'live-backend-policy'],
    timestep: { mode: 'manifest-triggered-webgpu-pass-dag', maxDt: null, subcycles: 1 },
    validity: { regimes: ['orbital', 'molecular', 'mpm', 'surface', 'solar', 'galactic', 'supergalactic'], approximation: 'webgpu-pass-execution-evidence-not-scientific-solve' },
    affinity: { policy: 'ulg-manifest', keyFields: ['solverId', 'manifestHash', 'activeLayerId'] },
    webgpu: {
      required: true,
      fenceRequired: true,
      requiresQueueFence: true,
      laneId: MULTISCALE_ULG_RUNTIME_GPU_LANE_ID,
      queueFencePolicy: MULTISCALE_ULG_RUNTIME_GPU_QUEUE_FENCE_POLICY,
      source: 'solver-descriptor:webgpu'
    },
    warmDelta: { scope: 'multiscale-ulg-runtime-execution', schema: 'peercompute.ulg.webgpu-execution-delta.v0' }
  },
  {
    id: 'sph-material',
    kind: 'material.sph',
    version: '0.1.0',
    label: 'SPH material particles',
    description: 'Reduced SPH/MPM bridge worker for water, vapor, heat exchange, and deformable material patches.',
    inputFields: [
      { name: 'position', unit: 'm', dimensions: 'L', location: 'particle' },
      { name: 'velocity', unit: 'm/s', dimensions: 'L T^-1', location: 'particle' },
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'particle' },
      { name: 'phase', unit: '1', dimensions: '1', location: 'particle' }
    ],
    outputFields: [
      { name: 'particleState', unit: 'mixed', dimensions: 'mixed', location: 'particle' },
      { name: 'phaseMix', unit: '1', dimensions: '1', location: 'region' },
      { name: 'heatTransport', unit: 'reduced', dimensions: 'mixed', location: 'region' }
    ],
    conservedFields: ['mass', 'momentum', 'energy'],
    timestep: { mode: 'explicit-particle', maxDt: null, subcycles: 1 },
    validity: { regimes: ['surface', 'mpm'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'material-particle-patch', keyFields: ['solverId', 'layerId', 'patchId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.sph-material.delta.v0' }
  },
  {
    id: 'membrane-shell',
    kind: 'mechanics.thin-shell',
    version: '0.1.0',
    label: 'Membrane thin shell',
    description: 'Reduced pressure, heat-damage, stress, strain, and rupture worker for balloon membranes and future deformable surface shells.',
    inputFields: [
      { name: 'strain', unit: '1', dimensions: '1', location: 'segment' },
      { name: 'stress', unit: 'Pa', dimensions: 'M L^-1 T^-2', location: 'segment' },
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'segment' },
      { name: 'damage', unit: '1', dimensions: '1', location: 'segment' },
      { name: 'internalPressure', unit: 'Pa', dimensions: 'M L^-1 T^-2', location: 'region' }
    ],
    outputFields: [
      { name: 'membraneState', unit: 'mixed', dimensions: 'mixed', location: 'segment' },
      { name: 'ruptureRisk', unit: '1', dimensions: '1', location: 'region' },
      { name: 'membraneIntegrity', unit: '1', dimensions: '1', location: 'region' },
      { name: 'stressDiagnostics', unit: 'mixed', dimensions: 'mixed', location: 'region' }
    ],
    conservedFields: ['energy', 'strainEnergy'],
    timestep: { mode: 'explicit-thin-shell', maxDt: null, subcycles: 1 },
    validity: { regimes: ['surface', 'mpm'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'thin-shell-ring', keyFields: ['solverId', 'layerId', 'shellId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.membrane-shell.delta.v0' }
  },
  {
    id: 'hydro-atmosphere',
    kind: 'fluid.finite-volume.atmosphere',
    version: '0.1.0',
    label: 'Hydro atmosphere tile',
    description: 'Reduced finite-volume moist shallow-water atmosphere tile for planetary weather and future hydro solvers.',
    inputFields: [
      { name: 'columnMass', unit: 'kg/m^2', dimensions: 'M L^-2', location: 'cell' },
      { name: 'momentum', unit: 'kg m^-1 s^-1', dimensions: 'M L^-1 T^-1', location: 'cell' },
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'cell' },
      { name: 'moisture', unit: '1', dimensions: '1', location: 'cell' }
    ],
    outputFields: [
      { name: 'columnState', unit: 'mixed', dimensions: 'mixed', location: 'cell' },
      { name: 'cloudCover', unit: '1', dimensions: '1', location: 'region' },
      { name: 'precipitation', unit: 'reduced', dimensions: 'mixed', location: 'region' },
      { name: 'stormEnergy', unit: 'reduced', dimensions: 'mixed', location: 'region' }
    ],
    conservedFields: ['mass', 'momentum', 'moisture', 'energy'],
    timestep: { mode: 'explicit-finite-volume', maxDt: null, subcycles: 1 },
    validity: { regimes: ['planet', 'surface'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'field-tile', keyFields: ['solverId', 'layerId', 'tileId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.hydro-atmosphere.delta.v0' }
  },
  {
    id: 'radiation-opacity',
    kind: 'radiation.grey-opacity',
    version: '0.1.0',
    label: 'Radiation and opacity',
    description: 'Reduced grey radiation diffusion, absorption, emission, and opacity worker for fire, climate, stellar, and optical-property coupling.',
    inputFields: [
      { name: 'radiationEnergy', unit: 'J/m^3', dimensions: 'M L^-1 T^-2', location: 'cell' },
      { name: 'materialTemperature', unit: 'K', dimensions: 'Theta', location: 'cell' },
      { name: 'opacity', unit: '1/m', dimensions: 'L^-1', location: 'cell' },
      { name: 'sourceStrength', unit: 'W/m^3', dimensions: 'M L^-1 T^-3', location: 'cell' }
    ],
    outputFields: [
      { name: 'radiationEnergyDelta', unit: 'J/m^3', dimensions: 'M L^-1 T^-2', location: 'cell' },
      { name: 'absorbedPower', unit: 'W/m^3', dimensions: 'M L^-1 T^-3', location: 'cell' },
      { name: 'radiativeFlux', unit: 'W/m^2', dimensions: 'M T^-3', location: 'face' },
      { name: 'opticalDepth', unit: '1', dimensions: '1', location: 'region' }
    ],
    conservedFields: ['radiationEnergy'],
    timestep: { mode: 'diffusion-cfl', maxDt: null, subcycles: 1 },
    validity: { regimes: ['surface', 'planet', 'solar', 'galactic'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'field-tile', keyFields: ['solverId', 'layerId', 'tileId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.radiation-opacity.delta.v0' }
  },
  {
    id: 'stellar-fusion',
    kind: 'plasma.stellar-fusion',
    version: '0.1.0',
    label: 'Stellar fusion plasma',
    description: 'Reduced proton-proton-chain plasma tile for stellar-core energy, composition, pressure, and radiation-source coupling.',
    inputFields: [
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'cell' },
      { name: 'density', unit: 'kg/m^3', dimensions: 'M L^-3', location: 'cell' },
      { name: 'hydrogenFraction', unit: '1', dimensions: '1', location: 'cell' },
      { name: 'heliumFraction', unit: '1', dimensions: '1', location: 'cell' }
    ],
    outputFields: [
      { name: 'fusionPower', unit: 'reduced-W/m^3', dimensions: 'M L^-1 T^-3', location: 'cell' },
      { name: 'neutrinoLoss', unit: 'reduced-W/m^3', dimensions: 'M L^-1 T^-3', location: 'cell' },
      { name: 'pressure', unit: 'Pa', dimensions: 'M L^-1 T^-2', location: 'cell' },
      { name: 'compositionDelta', unit: '1', dimensions: '1', location: 'cell' }
    ],
    conservedFields: ['energy', 'species'],
    timestep: { mode: 'operator-split-plasma', maxDt: null, subcycles: 1 },
    validity: { regimes: ['solar'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'field-tile', keyFields: ['solverId', 'layerId', 'tileId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.stellar-fusion.delta.v0' }
  },
  {
    id: 'magnetosphere-plasma',
    kind: 'plasma.mhd.magnetosphere',
    version: '0.1.0',
    label: 'Magnetosphere MHD plasma',
    description: 'Reduced ideal-MHD plasma tile for solar wind, magnetopause, reconnection, and magnetar/nebula-style plasma coupling.',
    inputFields: [
      { name: 'plasmaDensity', unit: 'kg/m^3', dimensions: 'M L^-3', location: 'cell' },
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'cell' },
      { name: 'velocity', unit: 'm/s', dimensions: 'L T^-1', location: 'cell' },
      { name: 'magneticField', unit: 'T', dimensions: 'M T^-2 I^-1', location: 'face' },
      { name: 'ionizationFraction', unit: '1', dimensions: '1', location: 'cell' }
    ],
    outputFields: [
      { name: 'solarWindPressure', unit: 'reduced Pa', dimensions: 'M L^-1 T^-2', location: 'region' },
      { name: 'magnetopauseRadius', unit: 'reduced m', dimensions: 'L', location: 'region' },
      { name: 'reconnectionRate', unit: 'reduced s^-1', dimensions: 'T^-1', location: 'region' },
      { name: 'alfvenSpeed', unit: 'reduced m/s', dimensions: 'L T^-1', location: 'region' },
      { name: 'divergenceBProxy', unit: 'reduced', dimensions: 'mixed', location: 'region' }
    ],
    conservedFields: ['mass', 'momentum', 'energy', 'magneticFlux'],
    timestep: { mode: 'explicit-reduced-mhd', maxDt: null, subcycles: 1 },
    validity: { regimes: ['solar', 'galactic'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'field-tile', keyFields: ['solverId', 'layerId', 'tileId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.magnetosphere-plasma.delta.v0' }
  },
  {
    id: 'pic-plasma-patch',
    kind: 'plasma.pic.kinetic-patch',
    version: '0.1.0',
    label: 'PIC plasma patch',
    description: 'Reduced particle-in-cell refinement patch for reconnection, charge separation, kinetic plasma, and future magnetar/nebula coupling.',
    inputFields: [
      { name: 'particlePosition', unit: 'm', dimensions: 'L', location: 'particle' },
      { name: 'particleVelocity', unit: 'm/s', dimensions: 'L T^-1', location: 'particle' },
      { name: 'charge', unit: 'C', dimensions: 'I T', location: 'particle' },
      { name: 'electricField', unit: 'V/m', dimensions: 'M L T^-3 I^-1', location: 'cell' },
      { name: 'magneticField', unit: 'T', dimensions: 'M T^-2 I^-1', location: 'cell' }
    ],
    outputFields: [
      { name: 'particleState', unit: 'mixed', dimensions: 'mixed', location: 'particle' },
      { name: 'chargeDensity', unit: 'C/m^3', dimensions: 'I T L^-3', location: 'cell' },
      { name: 'currentDensity', unit: 'A/m^2', dimensions: 'I L^-2', location: 'cell' },
      { name: 'kineticDiagnostics', unit: 'mixed', dimensions: 'mixed', location: 'region' }
    ],
    conservedFields: ['charge', 'particleCount', 'energy'],
    timestep: { mode: 'explicit-pic-push-deposit', maxDt: null, subcycles: 1 },
    validity: { regimes: ['solar', 'galactic'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'kinetic-plasma-patch', keyFields: ['solverId', 'layerId', 'patchId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.pic-plasma-patch.delta.v0' }
  },
  {
    id: 'relativistic-correction',
    kind: 'relativity.post-newtonian-correction',
    version: '0.1.0',
    label: 'Relativistic correction law',
    description: 'Reduced post-Newtonian correction worker for high-speed orbital, compact-object, plasma, lensing, and time-dilation telemetry.',
    inputFields: [
      { name: 'radius', unit: 'AU', dimensions: 'L', location: 'sample' },
      { name: 'speedFractionC', unit: '1', dimensions: '1', location: 'sample' },
      { name: 'compactness', unit: 'GM/(rc^2)', dimensions: '1', location: 'region' },
      { name: 'spin', unit: '1', dimensions: '1', location: 'region' },
      { name: 'fieldCoupling', unit: 'reduced', dimensions: 'mixed', location: 'region' }
    ],
    outputFields: [
      { name: 'lorentzFactor', unit: '1', dimensions: '1', location: 'sample' },
      { name: 'timeDilation', unit: '1', dimensions: '1', location: 'sample' },
      { name: 'gravitationalRedshift', unit: '1', dimensions: '1', location: 'region' },
      { name: 'perihelionPrecession', unit: 'arcsec-proxy', dimensions: '1', location: 'region' },
      { name: 'lensingDeflection', unit: 'arcsec-proxy', dimensions: '1', location: 'region' }
    ],
    conservedFields: ['energy', 'causal-speed-bound'],
    timestep: { mode: 'explicit-post-newtonian-proxy', maxDt: null, subcycles: 1 },
    validity: { regimes: ['solar', 'galactic', 'supergalactic'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'relativistic-region', keyFields: ['solverId', 'layerId', 'regionId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.relativistic-correction.delta.v0' }
  },
  {
    id: 'combustion-plume',
    kind: 'chemistry.combustion-plume',
    version: '0.1.0',
    label: 'Combustion plume tile',
    description: 'Reduced spatial combustion, smoke, fuel, oxygen, and suppression tile for surface fire spread and plume coupling.',
    inputFields: [
      { name: 'temperature', unit: 'K', dimensions: 'Theta', location: 'cell' },
      { name: 'fuel', unit: '1', dimensions: '1', location: 'cell' },
      { name: 'oxygen', unit: '1', dimensions: '1', location: 'cell' },
      { name: 'water', unit: '1', dimensions: '1', location: 'cell' }
    ],
    outputFields: [
      { name: 'heatRelease', unit: 'W/m^3', dimensions: 'M L^-1 T^-3', location: 'cell' },
      { name: 'smoke', unit: '1', dimensions: '1', location: 'cell' },
      { name: 'fireArea', unit: '1', dimensions: '1', location: 'region' },
      { name: 'fuelRemaining', unit: '1', dimensions: '1', location: 'region' }
    ],
    conservedFields: ['fuel', 'oxygen', 'energy'],
    timestep: { mode: 'operator-split-tile', maxDt: null, subcycles: 1 },
    validity: { regimes: ['surface', 'mpm'], approximation: 'proxy-descriptor' },
    affinity: { policy: 'field-tile', keyFields: ['solverId', 'layerId', 'tileId'] },
    warmDelta: { scope: 'multiscale-solver-deltas', schema: 'peercompute.multiscale.combustion-plume.delta.v0' }
  }
];

export function resolveNBodyGravityTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/nbodyGravityTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./nbodyGravityTasks.js', import.meta.url).href;
}

export function resolveReactiveThermalTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/reactiveThermalTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./reactiveThermalTasks.js', import.meta.url).href;
}

export function resolveMolecularDynamicsTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/molecularDynamicsTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./molecularDynamicsTasks.js', import.meta.url).href;
}

export function resolveQuantumOrbitalGridTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/quantumOrbitalGridTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./quantumOrbitalGridTasks.js', import.meta.url).href;
}

export function resolveQuantumMaterialPotentialTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/quantumMaterialPotentialTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./quantumMaterialPotentialTasks.js', import.meta.url).href;
}

export function resolveUlgRuntimeTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/ulgRuntimeTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./ulgRuntimeTasks.js', import.meta.url).href;
}

export function resolveMaxwellTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/maxwellTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./maxwellTasks.js', import.meta.url).href;
}

export function resolveCosmologyExpansionTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/cosmologyExpansionTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./cosmologyExpansionTasks.js', import.meta.url).href;
}

export function resolveSphMaterialTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/sphMaterialTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./sphMaterialTasks.js', import.meta.url).href;
}

export function resolveHydroAtmosphereTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/hydroAtmosphereTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./hydroAtmosphereTasks.js', import.meta.url).href;
}

export function resolveRadiationOpacityTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/radiationOpacityTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./radiationOpacityTasks.js', import.meta.url).href;
}

export function resolveStellarFusionTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/stellarFusionTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./stellarFusionTasks.js', import.meta.url).href;
}

export function resolveMagnetospherePlasmaTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/magnetospherePlasmaTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./magnetospherePlasmaTasks.js', import.meta.url).href;
}

export function resolvePicPlasmaPatchTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/picPlasmaPatchTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./picPlasmaPatchTasks.js', import.meta.url).href;
}

export function resolveRelativisticCorrectionTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/relativisticCorrectionTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./relativisticCorrectionTasks.js', import.meta.url).href;
}

export function resolveCombustionPlumeTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/combustionPlumeTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./combustionPlumeTasks.js', import.meta.url).href;
}

export function resolveMembraneShellTaskModuleUrl() {
  if (import.meta.env?.PROD && globalThis.document?.baseURI) {
    return new URL('./assets/membraneShellTasks.js', globalThis.document.baseURI).href;
  }
  return new URL('./membraneShellTasks.js', import.meta.url).href;
}

export function createMultiscaleSolverDescriptors({
  nbodyModuleUrl = resolveNBodyGravityTaskModuleUrl(),
  reactiveThermalModuleUrl = resolveReactiveThermalTaskModuleUrl(),
  molecularDynamicsModuleUrl = resolveMolecularDynamicsTaskModuleUrl(),
  quantumOrbitalGridModuleUrl = resolveQuantumOrbitalGridTaskModuleUrl(),
  quantumMaterialPotentialModuleUrl = resolveQuantumMaterialPotentialTaskModuleUrl(),
  ulgRuntimeModuleUrl = resolveUlgRuntimeTaskModuleUrl(),
  maxwellModuleUrl = resolveMaxwellTaskModuleUrl(),
  cosmologyExpansionModuleUrl = resolveCosmologyExpansionTaskModuleUrl(),
  sphMaterialModuleUrl = resolveSphMaterialTaskModuleUrl(),
  hydroAtmosphereModuleUrl = resolveHydroAtmosphereTaskModuleUrl(),
  radiationOpacityModuleUrl = resolveRadiationOpacityTaskModuleUrl(),
  stellarFusionModuleUrl = resolveStellarFusionTaskModuleUrl(),
  magnetospherePlasmaModuleUrl = resolveMagnetospherePlasmaTaskModuleUrl(),
  picPlasmaPatchModuleUrl = resolvePicPlasmaPatchTaskModuleUrl(),
  relativisticCorrectionModuleUrl = resolveRelativisticCorrectionTaskModuleUrl(),
  combustionPlumeModuleUrl = resolveCombustionPlumeTaskModuleUrl(),
  membraneShellModuleUrl = resolveMembraneShellTaskModuleUrl()
} = {}) {
  return MULTISCALE_SOLVER_DESCRIPTORS.map((descriptor) => {
    if (descriptor.id === 'nbody-gravity') {
      return {
        ...descriptor,
        runtime: 'js',
        module: nbodyModuleUrl,
        exportName: 'stepNBodyGravity',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-direct-sum-reference-or-cpu-barnes-hut'
        }
      };
    }
    if (descriptor.id === 'reactive-thermal-cell') {
      return {
        ...descriptor,
        runtime: 'js',
        module: reactiveThermalModuleUrl,
        exportName: 'stepReactiveThermalCell',
        validity: {
          ...descriptor.validity,
          approximation: 'reduced-reactive-thermal-cell'
        }
      };
    }
    if (descriptor.id === 'molecular-dynamics') {
      return {
        ...descriptor,
        runtime: 'js',
        module: molecularDynamicsModuleUrl,
        exportName: 'stepMolecularDynamics',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-molecular-dynamics'
        }
      };
    }
    if (descriptor.id === 'quantum-orbital-grid') {
      return {
        ...descriptor,
        runtime: 'js',
        module: quantumOrbitalGridModuleUrl,
        exportName: 'stepQuantumOrbitalGrid',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-screened-hydrogenic-density-evaluation-no-cpu-fallback'
        }
      };
    }
    if (descriptor.id === 'quantum-material-potential') {
      return {
        ...descriptor,
        runtime: 'js',
        module: quantumMaterialPotentialModuleUrl,
        exportName: 'stepQuantumMaterialPotential',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reference-property-force-and-ensemble-batch'
        }
      };
    }
    if (descriptor.id === 'ulg-runtime') {
      return {
        ...descriptor,
        runtime: 'js',
        module: ulgRuntimeModuleUrl,
        exportName: 'stepUlgRuntime',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-pass-dag-state-delta-queue-fenced-no-cpu-fallback'
        }
      };
    }
    if (descriptor.id === 'maxwell-em') {
      return {
        ...descriptor,
        runtime: 'js',
        module: maxwellModuleUrl,
        exportName: 'stepMaxwellFields',
        validity: {
          ...descriptor.validity,
          approximation: 'reduced-periodic-fdtd-tile'
        }
      };
    }
    if (descriptor.id === 'cosmology-expansion') {
      return {
        ...descriptor,
        runtime: 'js',
        module: cosmologyExpansionModuleUrl,
        exportName: 'stepCosmologyExpansion',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-cosmology-expansion'
        }
      };
    }
    if (descriptor.id === 'sph-material') {
      return {
        ...descriptor,
        runtime: 'js',
        module: sphMaterialModuleUrl,
        exportName: 'stepSphMaterial',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-sph-material'
        }
      };
    }
    if (descriptor.id === 'membrane-shell') {
      return {
        ...descriptor,
        runtime: 'js',
        module: membraneShellModuleUrl,
        exportName: 'stepMembraneShell',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-membrane-shell'
        }
      };
    }
    if (descriptor.id === 'hydro-atmosphere') {
      return {
        ...descriptor,
        runtime: 'js',
        module: hydroAtmosphereModuleUrl,
        exportName: 'stepHydroAtmosphere',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-moist-shallow-water'
        }
      };
    }
    if (descriptor.id === 'radiation-opacity') {
      return {
        ...descriptor,
        runtime: 'js',
        module: radiationOpacityModuleUrl,
        exportName: 'stepRadiationOpacity',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-grey-radiation-opacity'
        }
      };
    }
    if (descriptor.id === 'stellar-fusion') {
      return {
        ...descriptor,
        runtime: 'js',
        module: stellarFusionModuleUrl,
        exportName: 'stepStellarFusion',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-stellar-fusion'
        }
      };
    }
    if (descriptor.id === 'magnetosphere-plasma') {
      return {
        ...descriptor,
        runtime: 'js',
        module: magnetospherePlasmaModuleUrl,
        exportName: 'stepMagnetospherePlasma',
        validity: {
          ...descriptor.validity,
          approximation: 'reduced-ideal-mhd-plasma'
        }
      };
    }
    if (descriptor.id === 'pic-plasma-patch') {
      return {
        ...descriptor,
        runtime: 'js',
        module: picPlasmaPatchModuleUrl,
        exportName: 'stepPicPlasmaPatch',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-pic-plasma-patch'
        }
      };
    }
    if (descriptor.id === 'relativistic-correction') {
      return {
        ...descriptor,
        runtime: 'js',
        module: relativisticCorrectionModuleUrl,
        exportName: 'stepRelativisticCorrection',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-post-newtonian-correction'
        }
      };
    }
    if (descriptor.id === 'combustion-plume') {
      return {
        ...descriptor,
        runtime: 'js',
        module: combustionPlumeModuleUrl,
        exportName: 'stepCombustionPlume',
        validity: {
          ...descriptor.validity,
          approximation: 'webgpu-reduced-combustion-plume'
        }
      };
    }
    return { ...descriptor };
  });
}
