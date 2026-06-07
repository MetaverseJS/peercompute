import { chromium } from 'playwright';
import { inflateSync } from 'node:zlib';

const TARGET_URL = process.env.MULTISCALE_SMOKE_URL || 'https://localhost:5185/';
const CHROME_BIN = process.env.CHROME_BIN || '/bin/google-chrome';
const HEADLESS = process.env.HEADLESS !== '0';
const VIEWPORT_WIDTH = Number(process.env.VIEWPORT_WIDTH || 1440);
const VIEWPORT_HEIGHT = Number(process.env.VIEWPORT_HEIGHT || 960);
const LAYER_IDS = ['supergalactic', 'galactic', 'solar', 'planet', 'surface', 'mpm', 'molecular', 'orbital'];
const QUANTUM_GRID_BACKENDS = new Set([
  'cpu-finite-grid-reference',
  'cpu-orbital-grid-reference',
  'webgpu-orbital-grid-probability-evaluation',
  'webgpu-orbital-grid-moment-reduction'
]);
const QUANTUM_WEBGPU_KERNELS = new Set([
  'workgroup-probability-evaluation-reduction',
  'workgroup-moment-reduction'
]);
const QUANTUM_EIGEN_RESIDUAL_SCHEMAS = new Set([
  'peercompute.multiscale.quantum-orbital-eigen-residual.v0',
  'peercompute.multiscale.quantum-orbital-grid.eigen-residual-webgpu.v0'
]);
const QUANTUM_WAVEFUNCTION_EVOLUTION_SCHEMAS = new Set([
  'peercompute.multiscale.quantum-orbital-wavefunction-evolution.v0',
  'peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0'
]);
const QUANTUM_RADIAL_WEBGPU_SCHEMA = 'peercompute.schrodinger.radial-webgpu-eigensolver.v0';
const QUANTUM_QGRID_STATISTICAL_BRIDGE_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.statistical-bridge-webgpu.v0';
const MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA = 'peercompute.multiscale.molecular-geometry-force-law.v0';
const QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA = 'peercompute.multiscale.quantum-material-molecular-geometry-source.v0';
const QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA = 'peercompute.multiscale.quantum-material-electronic-charge-source.v0';
const QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA = 'peercompute.multiscale.quantum-material-reaction-barrier-surface.v0';
const QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA = 'peercompute.multiscale.quantum-material-product-topology.v0';
const SPH_MATERIAL_PHASE_CHANGE_EVIDENCE_SCHEMA = 'peercompute.multiscale.sph-material.phase-change-evidence.v0';
const QUANTUM_FIELD_PROBE = Object.freeze({
  electricFieldVm: 250000000,
  magneticFieldT: 5
});

function screenshotName(label) {
  const safe = label.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  return `/tmp/multiscale-visual-smoke-${safe}.png`;
}

async function waitForLayer(page, id) {
  await page.evaluate((layerId) => window.__multiscaleDemo.setLayerById(layerId), id);
  await page.waitForFunction((layerId) => window.__multiscaleDemo.getState().layer.id === layerId, id, {
    timeout: 30000
  });
}

async function captureStableState(page, validateState, label, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs;
  let lastState = null;
  while (Date.now() < deadline) {
    lastState = await page.evaluate(() => window.__multiscaleDemo.getState());
    if (validateState(lastState)) return lastState;
    await page.waitForTimeout(250);
  }
  throw new Error(`Timed out waiting for stable ${label}: ${JSON.stringify({
    layer: lastState?.layer?.id,
    solverRuntime: lastState?.solverRuntime,
    computeCapacityResize: lastState?.computeCapacityResize
  })}`);
}

async function callMolecularApiWhenIdle(page, method, ...args) {
  let lastResult = null;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await page.waitForFunction(() => !window.__multiscaleDemo.getState().solverRuntime?.molecularDynamics?.pending, null, {
      timeout: 45000
    });
    lastResult = await page.evaluate(({ methodName, methodArgs }) => {
      return window.__multiscaleDemo[methodName](...methodArgs);
    }, { methodName: method, methodArgs: args });
    if (lastResult?.ok) return lastResult;
    if (lastResult?.reason !== 'molecular-solver-pending') break;
    await page.waitForTimeout(250);
  }
  return lastResult;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function analyzePng(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error('Canvas screenshot is not a PNG');
  }
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }
  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG format bitDepth=${bitDepth} colorType=${colorType}`);
  }
  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const rowBytes = width * bytesPerPixel;
  const raw = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(height * rowBytes);
  let rawOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[rawOffset];
    rawOffset += 1;
    const rowStart = y * rowBytes;
    const prevStart = rowStart - rowBytes;
    for (let x = 0; x < rowBytes; x += 1) {
      const value = raw[rawOffset + x];
      const left = x >= bytesPerPixel ? pixels[rowStart + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[prevStart + x] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? pixels[prevStart + x - bytesPerPixel] : 0;
      if (filter === 0) pixels[rowStart + x] = value;
      else if (filter === 1) pixels[rowStart + x] = (value + left) & 255;
      else if (filter === 2) pixels[rowStart + x] = (value + up) & 255;
      else if (filter === 3) pixels[rowStart + x] = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) pixels[rowStart + x] = (value + paeth(left, up, upLeft)) & 255;
      else throw new Error(`Unsupported PNG filter ${filter}`);
    }
    rawOffset += rowBytes;
  }

  let litPixels = 0;
  let sampledPixels = 0;
  const buckets = new Set();
  const stridePixels = 8;
  for (let pixel = 0; pixel < width * height; pixel += stridePixels) {
    sampledPixels += 1;
    const offset = pixel * bytesPerPixel;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];
    const luma = r + g + b;
    if (luma > 24) {
      litPixels += 1;
      buckets.add(`${r >> 5}:${g >> 5}:${b >> 5}`);
    }
  }
  const ok = litPixels > Math.max(16, sampledPixels * 0.0015) && buckets.size >= 2;
  return {
    ok,
    width,
    height,
    sampledPixels,
    litPixels,
    colorBuckets: buckets.size
  };
}

async function verifyCanvasNonBlank(page, label) {
  await page.waitForTimeout(120);
  const box = await page.locator('#multiscale-canvas').boundingBox();
  if (!box) {
    throw new Error(`Canvas pixel smoke failed for ${label}: missing canvas box`);
  }
  const buffer = await page.screenshot({
    clip: {
      x: Math.max(0, box.x),
      y: Math.max(0, box.y),
      width: Math.max(1, box.width),
      height: Math.max(1, box.height)
    }
  });
  const sample = analyzePng(buffer);
  if (!sample.ok) {
    throw new Error(`Canvas pixel smoke failed for ${label}: ${JSON.stringify(sample)}`);
  }
  return { label, ...sample };
}

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME_BIN,
    headless: HEADLESS,
    args: [
      '--ignore-certificate-errors',
      '--enable-unsafe-webgpu',
      '--enable-unsafe-swiftshader'
    ]
  });
  const page = await browser.newPage({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    ignoreHTTPSErrors: true
  });
  const consoleMessages = [];
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', (error) => {
    consoleMessages.push(`pageerror: ${error.message}`);
  });

  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.__multiscaleDemo?.getState, null, { timeout: 60000 });

  const layerSamples = [];
  const genericSnapshotSamples = [];
  for (const layerId of LAYER_IDS) {
    await waitForLayer(page, layerId);
    layerSamples.push(await verifyCanvasNonBlank(page, layerId));
    genericSnapshotSamples.push(await page.evaluate((id) => ({
      layerId: id,
      snapshot: window.__multiscaleDemo.getState().snapshot
    }), layerId));
  }

  await waitForLayer(page, 'supergalactic');
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return state.cosmologyExpansionOverlay?.accepted
      && state.cosmologyExpansionOverlay?.visible
      && state.solverRuntime?.cosmologyExpansion?.lastResult?.backend
      && packet.upward?.aggregateState?.cosmologyExpansion?.backend;
  }, null, { timeout: 45000 });
  const supergalacticState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const supergalacticScreenshot = screenshotName('supergalactic-cosmology');
  await page.screenshot({ path: supergalacticScreenshot, fullPage: true });

  await waitForLayer(page, 'planet');
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return state.hydroAtmosphereOverlay?.accepted
      && state.hydroAtmosphereOverlay?.visible
      && state.radiationOpacityOverlay?.accepted
      && state.radiationOpacityOverlay?.visible
      && state.solverRuntime?.hydroAtmosphere?.lastResult?.backend
      && state.solverRuntime?.radiationOpacity?.lastResult?.backend
      && packet.upward?.aggregateState?.hydroAtmosphere?.backend
      && packet.upward?.aggregateState?.radiationOpacity?.backend;
  }, null, { timeout: 45000 });
  const planetState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const planetScreenshot = screenshotName('planet-hydro');
  await page.screenshot({ path: planetScreenshot, fullPage: true });

  await waitForLayer(page, 'solar');
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return state.nbodyOverlay?.accepted
      && state.nbodyOverlay?.visible
      && state.solverRuntime?.nbody?.lastResult?.backend
      && state.stellarFusionOverlay?.accepted
      && state.stellarFusionOverlay?.visible
      && state.solverRuntime?.stellarFusion?.lastResult?.backend
      && state.magnetospherePlasmaOverlay?.accepted
      && state.magnetospherePlasmaOverlay?.visible
      && state.solverRuntime?.magnetospherePlasma?.lastResult?.backend
      && state.picPlasmaPatchOverlay?.accepted
      && state.picPlasmaPatchOverlay?.visible
      && state.solverRuntime?.picPlasmaPatch?.lastResult?.backend
      && state.relativisticCorrectionOverlay?.accepted
      && state.relativisticCorrectionOverlay?.visible
      && state.solverRuntime?.relativisticCorrection?.lastResult?.backend
      && packet.upward?.aggregateState?.stellarFusion?.backend
      && packet.upward?.aggregateState?.magnetosphere?.backend
      && packet.upward?.aggregateState?.picPlasmaPatch?.backend
      && packet.upward?.aggregateState?.relativity?.backend;
  }, null, { timeout: 45000 });
  const solarState = await captureStableState(page, (state) => {
    return state.nbodyOverlay?.accepted
      && state.nbodyOverlay?.visible
      && state.solverRuntime?.nbody?.lastResult?.backend
      && state.stellarFusionOverlay?.accepted
      && state.stellarFusionOverlay?.visible
      && state.solverRuntime?.stellarFusion?.lastResult?.backend
      && state.magnetospherePlasmaOverlay?.accepted
      && state.magnetospherePlasmaOverlay?.visible
      && state.solverRuntime?.magnetospherePlasma?.lastResult?.backend
      && state.picPlasmaPatchOverlay?.accepted
      && state.picPlasmaPatchOverlay?.visible
      && state.solverRuntime?.picPlasmaPatch?.lastResult?.backend
      && state.relativisticCorrectionOverlay?.accepted
      && state.relativisticCorrectionOverlay?.visible
      && state.solverRuntime?.relativisticCorrection?.lastResult?.backend;
  }, 'solar solver runtime');
  const solarScreenshot = screenshotName('solar-nbody');
  await page.screenshot({ path: solarScreenshot, fullPage: true });

  await waitForLayer(page, 'galactic');
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    return state.maxwellOverlay?.accepted
      && state.maxwellOverlay?.visible
      && state.solverRuntime?.maxwell?.lastResult?.backend;
  }, null, { timeout: 45000 });
  const galacticState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const galacticScreenshot = screenshotName('galactic-maxwell');
  await page.screenshot({ path: galacticScreenshot, fullPage: true });

  await waitForLayer(page, 'molecular');
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return state.molecularDynamicsOverlay?.accepted
      && state.molecularDynamicsOverlay?.visible
      && state.solverRuntime?.molecularDynamics?.lastResult?.backend
      && packet.upward?.aggregateState?.molecularDynamics?.backend;
  }, null, { timeout: 45000 });
  const molecularState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const molecularScreenshot = screenshotName('molecular-dynamics');
  await page.screenshot({ path: molecularScreenshot, fullPage: true });
  const molecularRecipeResult = await callMolecularApiWhenIdle(page, 'setMolecularComposition', { O: 5, H: 10 });
  if (!molecularRecipeResult?.ok) {
    throw new Error(`Molecular composition API rejected water recipe: ${JSON.stringify(molecularRecipeResult)}`);
  }
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return state.molecularComposition?.atomCount === 15
      && state.molecularComposition?.composition?.O === 5
      && state.molecularComposition?.composition?.H === 10
      && state.solverRuntime?.molecularDynamics?.lastResult?.atomCount === 15
      && packet.upward?.aggregateState?.molecularDynamics?.atomCount === 15
      && packet.upward?.aggregateState?.molecularDynamics?.bondCount >= 10;
  }, null, { timeout: 45000 });
  const molecularRecipeState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const molecularAppendNa = await callMolecularApiWhenIdle(page, 'addMolecularAtoms', 'Na', 1);
  if (!molecularAppendNa?.ok) {
    throw new Error(`Molecular append API rejected sodium atom: ${JSON.stringify(molecularAppendNa)}`);
  }
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    return state.molecularComposition?.atomCount === 16
      && state.molecularComposition?.composition?.Na === 1
      && state.solverRuntime?.molecularDynamics?.lastResult?.atomCount === 16;
  }, null, { timeout: 45000 });
  const molecularAppendCl = await callMolecularApiWhenIdle(page, 'addMolecularAtoms', 'Cl', 1);
  if (!molecularAppendCl?.ok) {
    throw new Error(`Molecular append API rejected chlorine atom: ${JSON.stringify(molecularAppendCl)}`);
  }
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return state.molecularComposition?.atomCount === 17
      && state.molecularComposition?.composition?.Na === 1
      && state.molecularComposition?.composition?.Cl === 1
      && state.solverRuntime?.molecularDynamics?.lastResult?.atomCount === 17
      && packet.upward?.aggregateState?.molecularDynamics?.atomCount === 17
      && packet.upward?.aggregateState?.molecularDynamics?.bondCount >= 11;
  }, null, { timeout: 45000 });
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const entry = state.solverLoad?.entries?.molecularDynamics;
    return entry?.neighborListMode === 'active'
      && entry.acceptedNeighborPairCount > 0
      && entry.webgpuCandidatePairCount > 0
      && entry.webgpuNeighborCapacity > 0
      && Number.isFinite(entry.webgpuNeighborCapacityUsage)
      && entry.webgpuNeighborCapacityUsage > 0
      && Number.isFinite(entry.molecularPairPressure)
      && entry.molecularPairPressure > 0
      && entry.molecularOverflowPressure === 0;
  }, null, { timeout: 45000 });
  const molecularAppendState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const molecularSolverLoadEntry = await page.evaluate(() => (
    window.__multiscaleDemo.getState().solverLoad?.entries?.molecularDynamics || null
  ));
  await page.waitForFunction(() => (
    document.querySelector('#layer-readout')?.textContent?.includes('quantum basis')
      && document.querySelector('#layer-readout')?.textContent?.includes('quantum worker')
      && window.__multiscaleDemo.getState().solverRuntime?.quantumOrbitalGrid?.lastResult?.finiteGrid?.schema === 'peercompute.multiscale.quantum-orbital-finite-grid.v0'
  ), null, { timeout: 45000 });
  const quantumWorkerState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const molecularReadoutText = await page.locator('#layer-readout').textContent();
  await page.evaluate((probe) => {
    window.__multiscaleDemo.setLayerById?.('orbital');
    window.__multiscaleDemo.setHudMode?.('focus');
    return window.__multiscaleDemo.setEnvironment?.({
      electricFieldVm: probe.electricFieldVm,
      magneticFieldT: probe.magneticFieldT
    });
  }, QUANTUM_FIELD_PROBE);
  await page.waitForFunction((probe) => {
    const packet = window.__multiscaleDemo.getPacket();
    const quantum = packet.upward?.aggregateState?.quantumOrbital;
    const electricFieldVm = quantum?.finiteGridWavefunctionEvolutionWebgpuElectricFieldVm
      ?? quantum?.finiteGridWavefunctionEvolutionElectricFieldVm;
    const magneticFieldT = quantum?.finiteGridWavefunctionEvolutionWebgpuMagneticFieldT
      ?? quantum?.finiteGridWavefunctionEvolutionMagneticFieldT;
    const zeemanEnergyEv = quantum?.finiteGridWavefunctionEvolutionWebgpuZeemanEnergyExpectationEv
      ?? quantum?.finiteGridWavefunctionEvolutionZeemanEnergyExpectationEv;
    return quantum?.finiteGridWavefunctionEvolutionWebgpuFieldResponseSchema === 'peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0'
      && quantum?.finiteGridWavefunctionEvolutionWebgpuMagneticResponseSchema === 'peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0'
      && Math.abs((electricFieldVm || 0) - probe.electricFieldVm) <= Math.max(1, Math.abs(probe.electricFieldVm) * 0.02)
      && Math.abs((magneticFieldT || 0) - probe.magneticFieldT) <= 0.01
      && Math.abs(zeemanEnergyEv || 0) > 1e-7;
  }, QUANTUM_FIELD_PROBE, { timeout: 45000 });
  const quantumFieldResponseProbe = await page.evaluate((probe) => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    const quantum = packet.upward?.aggregateState?.quantumOrbital || {};
    const runtimeEvolution = state.solverRuntime?.quantumOrbitalGrid?.lastResult?.finiteGrid?.wavefunctionEvolutionWebgpu
      || state.solverRuntime?.quantumOrbitalGrid?.lastResult?.finiteGrid?.wavefunctionEvolution
      || null;
    return {
      probe,
      environment: { ...state.environment },
      packet: {
        electricFieldVm: quantum.finiteGridWavefunctionEvolutionWebgpuElectricFieldVm ?? quantum.finiteGridWavefunctionEvolutionElectricFieldVm,
        fieldEnergyExpectationEv: quantum.finiteGridWavefunctionEvolutionWebgpuFieldEnergyExpectationEv ?? quantum.finiteGridWavefunctionEvolutionFieldEnergyExpectationEv,
        dipoleMomentZBohrElectron: quantum.finiteGridWavefunctionEvolutionWebgpuDipoleMomentZBohrElectron ?? quantum.finiteGridWavefunctionEvolutionDipoleMomentZBohrElectron,
        polarizabilityProxyBohr3: quantum.finiteGridWavefunctionEvolutionWebgpuPolarizabilityProxyBohr3 ?? quantum.finiteGridWavefunctionEvolutionPolarizabilityProxyBohr3,
        fieldResponseSchema: quantum.finiteGridWavefunctionEvolutionWebgpuFieldResponseSchema ?? quantum.finiteGridWavefunctionEvolutionFieldResponseSchema,
        magneticFieldT: quantum.finiteGridWavefunctionEvolutionWebgpuMagneticFieldT ?? quantum.finiteGridWavefunctionEvolutionMagneticFieldT,
        zeemanEnergyExpectationEv: quantum.finiteGridWavefunctionEvolutionWebgpuZeemanEnergyExpectationEv ?? quantum.finiteGridWavefunctionEvolutionZeemanEnergyExpectationEv,
        magneticMomentProjectionBohrMagneton: quantum.finiteGridWavefunctionEvolutionWebgpuMagneticMomentProjectionBohrMagneton ?? quantum.finiteGridWavefunctionEvolutionMagneticMomentProjectionBohrMagneton,
        magneticResponseSchema: quantum.finiteGridWavefunctionEvolutionWebgpuMagneticResponseSchema ?? quantum.finiteGridWavefunctionEvolutionMagneticResponseSchema
      },
      runtime: runtimeEvolution,
      readoutText: document.querySelector('#layer-readout')?.textContent
    };
  }, QUANTUM_FIELD_PROBE);

  await waitForLayer(page, 'surface');
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return state.solverRuntime?.reactiveThermal?.completedTasks > 0
      && state.solverRuntime?.sphMaterial?.completedTasks > 0
      && state.solverRuntime?.combustionPlume?.completedTasks > 0
      && state.solverRuntime?.membraneShell?.completedTasks > 0
      && state.sphMaterialOverlay?.accepted
      && state.sphMaterialOverlay?.visible
      && state.combustionPlumeOverlay?.accepted
      && state.combustionPlumeOverlay?.visible
      && packet.upward?.aggregateState?.reactiveCell?.backend
      && packet.upward?.aggregateState?.sphMaterial?.backend
      && packet.upward?.aggregateState?.combustionPlume?.backend
      && packet.upward?.aggregateState?.membraneShell?.backend
      && packet.upward?.closureResults?.reactiveThermal?.schema
      && packet.upward?.closureResults?.sphMaterial?.schema
      && state.closureState?.warmDeltaCount >= 2
      && state.conservationState?.warmDeltaCount >= 1;
  }, null, { timeout: 45000 });
  const surfaceState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const surfaceScreenshot = screenshotName('surface-reactive');
  await page.screenshot({ path: surfaceScreenshot, fullPage: true });

  await page.locator('#rupture').click();
  await page.evaluate(() => window.__multiscaleDemo.triggerRupture?.());
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return packet.upward?.aggregateState?.spillImpulse > 0
      && packet.upward?.aggregateState?.spillReleasedKg > 0
      && packet.upward?.aggregateState?.sphMaterial?.spillImpulse > 0
      && packet.upward?.aggregateState?.sphMaterial?.fireContactFraction > 0
      && state.solverRuntime?.sphMaterial?.lastResult?.spillImpulse > 0;
  }, null, { timeout: 60000 });
  const ruptureState = await page.evaluate(() => window.__multiscaleDemo.getState());
  const rupturePacket = await page.evaluate(() => window.__multiscaleDemo.getPacket());

  const packet = await page.evaluate(() => window.__multiscaleDemo.getPacket());
  const apiStatus = await page.evaluate(() => {
    const stateBeforeWarm = window.__multiscaleDemo.getState();
    const molecularTransferApplicationConfigBeforeWarm = stateBeforeWarm.molecularTransferApplicationConfig;
    const molecularTransferApplicationConfigApiBeforeWarm = window.__multiscaleDemo.getMolecularTransferApplicationConfig?.();
    const molecularTransferTransactionConfigBeforeWarm = stateBeforeWarm.molecularTransferTransactionConfig;
    const molecularTransferTransactionConfigApiBeforeWarm = window.__multiscaleDemo.getMolecularTransferTransactionConfig?.();
    const molecularTargetMutationApplyConfigBeforeWarm = stateBeforeWarm.molecularTargetMutationApplyConfig;
    const molecularTargetMutationApplyConfigApiBeforeWarm = window.__multiscaleDemo.getMolecularTargetMutationApplyConfig?.();
    const molecularTargetBufferWorkerWriteConfigBeforeWarm = stateBeforeWarm.molecularTargetBufferWorkerWriteConfig;
    const molecularTargetBufferWorkerWriteConfigApiBeforeWarm = window.__multiscaleDemo.getMolecularTargetBufferWorkerWriteConfig?.();
    const molecularSourceBufferWarmApi = window.__multiscaleDemo.warmMolecularSourceBufferTargets?.({
      reason: 'visual-smoke-source-buffer-warm'
    });
    const packetAfterWarm = window.__multiscaleDemo.getPacket();
    const stateAfterWarm = window.__multiscaleDemo.getState();
    return {
    hasResizeSolverWorkloads: typeof window.__multiscaleDemo.resizeSolverWorkloads === 'function',
    hasResizeComputeWorkers: typeof window.__multiscaleDemo.resizeComputeWorkers === 'function',
    hasSetAutoScale: typeof window.__multiscaleDemo.setAutoScale === 'function',
    hasSetMolecularComposition: typeof window.__multiscaleDemo.setMolecularComposition === 'function',
    hasAddMolecularAtoms: typeof window.__multiscaleDemo.addMolecularAtoms === 'function',
    hasSetQuantumOrbital: typeof window.__multiscaleDemo.setQuantumOrbital === 'function',
    hasGetQuantumOrbital: typeof window.__multiscaleDemo.getQuantumOrbital === 'function',
    hasGetRuntimeDebug: typeof window.__multiscaleDemo.getRuntimeDebug === 'function',
    hasSetHudMode: typeof window.__multiscaleDemo.setHudMode === 'function',
    hasGetHudMode: typeof window.__multiscaleDemo.getHudMode === 'function',
    hasGetOutputPanels: typeof window.__multiscaleDemo.getOutputPanels === 'function',
    hasSetOutputPanelVisibility: typeof window.__multiscaleDemo.setOutputPanelVisibility === 'function',
    hasSetOutputPanelsVisibility: typeof window.__multiscaleDemo.setOutputPanelsVisibility === 'function',
    hasToggleOutputPanel: typeof window.__multiscaleDemo.toggleOutputPanel === 'function',
    hasGetPacketPreview: typeof window.__multiscaleDemo.getPacketPreview === 'function',
    hasGetRenderBudget: typeof window.__multiscaleDemo.getRenderBudget === 'function',
    hasGetSolverSubmissionBudget: typeof window.__multiscaleDemo.getSolverSubmissionBudget === 'function',
    hasGetStatePublicationBudget: typeof window.__multiscaleDemo.getStatePublicationBudget === 'function',
    hasGetRuntimeDiagnosticsBudget: typeof window.__multiscaleDemo.getRuntimeDiagnosticsBudget === 'function',
    hasConfigureRemotePlacement: typeof window.__multiscaleDemo.configureRemotePlacement === 'function',
    hasRunLoopbackRemotePlacementProbe: typeof window.__multiscaleDemo.runLoopbackRemotePlacementProbe === 'function',
    hasRunLoopbackRemoteSolverPlacementProbe: typeof window.__multiscaleDemo.runLoopbackRemoteSolverPlacementProbe === 'function',
    hasGetRemotePlacementConfiguration: typeof window.__multiscaleDemo.getRemotePlacementConfiguration === 'function',
    hasConfigureRemoteSolverPlacement: typeof window.__multiscaleDemo.configureRemoteSolverPlacement === 'function',
    hasGetRemoteSolverPlacementPolicy: typeof window.__multiscaleDemo.getRemoteSolverPlacementPolicy === 'function',
    hasGetRemoteSolverPlacementDecisions: typeof window.__multiscaleDemo.getRemoteSolverPlacementDecisions === 'function',
    hasStartPeerNetwork: typeof window.__multiscaleDemo.startPeerNetwork === 'function',
    hasStopPeerNetwork: typeof window.__multiscaleDemo.stopPeerNetwork === 'function',
    hasGetPeerNetworkStatus: typeof window.__multiscaleDemo.getPeerNetworkStatus === 'function',
    hasGetNetVizSession: typeof window.__multiscaleDemo.getNetVizSession === 'function',
    hasGetCouplingDeltas: typeof window.__multiscaleDemo.getCouplingDeltas === 'function',
    hasGetLawGraphDeltas: typeof window.__multiscaleDemo.getLawGraphDeltas === 'function',
    hasGetLawGraphUpdatePlan: typeof window.__multiscaleDemo.getLawGraphUpdatePlan === 'function',
    hasGetLawGraphConsistencySolve: typeof window.__multiscaleDemo.getLawGraphConsistencySolve === 'function',
    hasGetLawGraphProposalAdmission: typeof window.__multiscaleDemo.getLawGraphProposalAdmission === 'function',
    hasGetLawGraphDispatchQueue: typeof window.__multiscaleDemo.getLawGraphDispatchQueue === 'function',
    hasGetLawGraphSchedulerManifest: typeof window.__multiscaleDemo.getLawGraphSchedulerManifest === 'function',
    hasGetLawGraphSchedulerExecutionAudit: typeof window.__multiscaleDemo.getLawGraphSchedulerExecutionAudit === 'function',
    hasGetLawGraphResultAdmission: typeof window.__multiscaleDemo.getLawGraphResultAdmission === 'function',
    hasGetLawGraphStateApplicationPreflight: typeof window.__multiscaleDemo.getLawGraphStateApplicationPreflight === 'function',
    hasGetSourceSinkBalanceDeltas: typeof window.__multiscaleDemo.getSourceSinkBalanceDeltas === 'function',
    hasGetSourceTransferDeltas: typeof window.__multiscaleDemo.getSourceTransferDeltas === 'function',
    hasGetSourceTransferApplicationDeltas: typeof window.__multiscaleDemo.getSourceTransferApplicationDeltas === 'function',
    hasGetSourceTransferTransactionDeltas: typeof window.__multiscaleDemo.getSourceTransferTransactionDeltas === 'function',
    hasGetSourceTransferTargetPreviewDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetPreviewDeltas === 'function',
    hasGetSourceTransferTargetMutatorRegistryDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutatorRegistryDeltas === 'function',
    hasGetSourceTransferTargetMutationPreflightDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutationPreflightDeltas === 'function',
    hasGetSourceTransferTargetMutationOperationPlanDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutationOperationPlanDeltas === 'function',
    hasGetSourceTransferTargetMutationInvariantCheckDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutationInvariantCheckDeltas === 'function',
    hasGetSourceTransferTargetMutationCommitDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutationCommitDeltas === 'function',
    hasGetSourceTransferTargetMutationDispatchDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutationDispatchDeltas === 'function',
    hasGetSourceTransferTargetMutationApplyValidationDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutationApplyValidationDeltas === 'function',
    hasGetSourceTransferTargetMutationApplyExecutionDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetMutationApplyExecutionDeltas === 'function',
    hasGetSourceTransferTargetSourceIntakeDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetSourceIntakeDeltas === 'function',
    hasGetSourceTransferTargetSourceResponseDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetSourceResponseDeltas === 'function',
    hasGetSourceTransferTargetSourceReconciliationDeltas: typeof window.__multiscaleDemo.getSourceTransferTargetSourceReconciliationDeltas === 'function',
    hasGetConservativeSourceBufferDeltas: typeof window.__multiscaleDemo.getConservativeSourceBufferDeltas === 'function',
    hasGetSourceBufferApplicationDeltas: typeof window.__multiscaleDemo.getSourceBufferApplicationDeltas === 'function',
    hasGetSourceBufferAcceptanceDeltas: typeof window.__multiscaleDemo.getSourceBufferAcceptanceDeltas === 'function',
    hasGetTargetBufferReplayValidationDeltas: typeof window.__multiscaleDemo.getTargetBufferReplayValidationDeltas === 'function',
    hasGetTargetBufferMutationAuditDeltas: typeof window.__multiscaleDemo.getTargetBufferMutationAuditDeltas === 'function',
    hasGetTargetBufferWorkerWriteQueueDeltas: typeof window.__multiscaleDemo.getTargetBufferWorkerWriteQueueDeltas === 'function',
    hasGetTargetBufferWorkerWriteExecutionDeltas: typeof window.__multiscaleDemo.getTargetBufferWorkerWriteExecutionDeltas === 'function',
    hasGetTargetBufferWorkerWriteVerificationDeltas: typeof window.__multiscaleDemo.getTargetBufferWorkerWriteVerificationDeltas === 'function',
    hasGetScientificReadinessManifestDeltas: typeof window.__multiscaleDemo.getScientificReadinessManifestDeltas === 'function',
    hasConfigureMolecularTransferApplication: typeof window.__multiscaleDemo.configureMolecularTransferApplication === 'function',
    hasGetMolecularTransferApplicationConfig: typeof window.__multiscaleDemo.getMolecularTransferApplicationConfig === 'function',
    hasConfigureMolecularTransferTransaction: typeof window.__multiscaleDemo.configureMolecularTransferTransaction === 'function',
    hasGetMolecularTransferTransactionConfig: typeof window.__multiscaleDemo.getMolecularTransferTransactionConfig === 'function',
    hasConfigureMolecularTargetMutationApply: typeof window.__multiscaleDemo.configureMolecularTargetMutationApply === 'function',
    hasGetMolecularTargetMutationApplyConfig: typeof window.__multiscaleDemo.getMolecularTargetMutationApplyConfig === 'function',
    hasExecuteMolecularTargetMutationApply: typeof window.__multiscaleDemo.executeMolecularTargetMutationApply === 'function',
    hasWarmMolecularSourceBufferTargets: typeof window.__multiscaleDemo.warmMolecularSourceBufferTargets === 'function',
    hasConfigureMolecularTargetBufferWorkerWrite: typeof window.__multiscaleDemo.configureMolecularTargetBufferWorkerWrite === 'function',
    hasGetMolecularTargetBufferWorkerWriteConfig: typeof window.__multiscaleDemo.getMolecularTargetBufferWorkerWriteConfig === 'function',
    hasExecuteMolecularTargetBufferWorkerWrite: typeof window.__multiscaleDemo.executeMolecularTargetBufferWorkerWrite === 'function',
    molecularTransferApplicationConfig: molecularTransferApplicationConfigBeforeWarm,
    molecularTransferApplicationConfigApi: molecularTransferApplicationConfigApiBeforeWarm,
    molecularTransferTransactionConfig: molecularTransferTransactionConfigBeforeWarm,
    molecularTransferTransactionConfigApi: molecularTransferTransactionConfigApiBeforeWarm,
    molecularTargetMutationApplyConfig: molecularTargetMutationApplyConfigBeforeWarm,
    molecularTargetMutationApplyConfigApi: molecularTargetMutationApplyConfigApiBeforeWarm,
    molecularTargetBufferWorkerWriteConfig: molecularTargetBufferWorkerWriteConfigBeforeWarm,
    molecularTargetBufferWorkerWriteConfigApi: molecularTargetBufferWorkerWriteConfigApiBeforeWarm,
    molecularSourceBufferWarmApi,
    molecularTargetMutationApplyExecutionApi: molecularSourceBufferWarmApi?.sourceApplyReport,
    molecularTargetMutationApplyConfigAfterApi: window.__multiscaleDemo.getMolecularTargetMutationApplyConfig?.(),
    molecularTargetBufferWorkerWriteConfigAfterApi: window.__multiscaleDemo.getMolecularTargetBufferWorkerWriteConfig?.(),
    solverQualityMultiplier: window.__multiscaleDemo.getState().solverQuality?.multiplier,
    solverWorkloadMultipliers: window.__multiscaleDemo.getState().solverQuality?.solverWorkloadMultipliers,
    runtimeScaler: window.__multiscaleDemo.getState().runtimeScaler,
    memoryPressure: window.__multiscaleDemo.getState().memoryPressure,
    computeMemoryPressure: window.__multiscaleDemo.getState().compute?.peercompute?.memoryPressure,
    networkCapacity: window.__multiscaleDemo.getState().networkCapacity,
    computeNetworkCapacity: window.__multiscaleDemo.getState().compute?.peercompute?.networkCapacity,
    placementPlan: window.__multiscaleDemo.getState().placementPlan,
    computePlacementPlan: window.__multiscaleDemo.getState().compute?.peercompute?.placementPlan,
    remotePlacementReadiness: window.__multiscaleDemo.getState().remotePlacementReadiness,
    computeRemotePlacementReadiness: window.__multiscaleDemo.getState().compute?.peercompute?.remotePlacementReadiness,
    remotePlacementConfiguration: window.__multiscaleDemo.getState().remotePlacementConfiguration,
    computeRemotePlacementConfiguration: window.__multiscaleDemo.getState().compute?.peercompute?.remotePlacementConfiguration,
    remoteSolverPlacementPolicy: window.__multiscaleDemo.getState().remoteSolverPlacementPolicy,
    remoteSolverPlacementPolicyApi: window.__multiscaleDemo.getRemoteSolverPlacementPolicy?.(),
    remoteSolverPlacementDecisions: window.__multiscaleDemo.getState().remoteSolverPlacementDecisions,
    remoteSolverPlacementDecisionsApi: window.__multiscaleDemo.getRemoteSolverPlacementDecisions?.(),
    computeRemoteSolverPlacementPolicy: window.__multiscaleDemo.getState().compute?.peercompute?.remoteSolverPlacementPolicy,
    computeRemoteSolverPlacementDecisions: window.__multiscaleDemo.getState().compute?.peercompute?.remoteSolverPlacementDecisions,
    peerNetworkStatus: window.__multiscaleDemo.getPeerNetworkStatus?.(),
    nodeKernelStatus: window.__multiscaleDemo.getState().nodeKernel,
    computeNodeKernelStatus: window.__multiscaleDemo.getState().compute?.peercompute?.nodeKernel,
    solverAdmission: window.__multiscaleDemo.getState().solverAdmission,
    computeSolverAdmission: window.__multiscaleDemo.getState().compute?.peercompute?.solverAdmission,
    solverLoad: window.__multiscaleDemo.getState().solverLoad,
    crossScaleCoupling: window.__multiscaleDemo.getState().crossScaleCoupling,
    couplingState: window.__multiscaleDemo.getState().couplingState,
    lawGraph: window.__multiscaleDemo.getState().lawGraph,
    lawGraphUpdatePlan: window.__multiscaleDemo.getState().lawGraphUpdatePlan,
    lawGraphConsistencySolve: window.__multiscaleDemo.getState().lawGraphConsistencySolve,
    lawGraphProposalAdmission: window.__multiscaleDemo.getState().lawGraphProposalAdmission,
    lawGraphDispatchQueue: window.__multiscaleDemo.getState().lawGraphDispatchQueue,
    lawGraphSchedulerManifest: window.__multiscaleDemo.getState().lawGraphSchedulerManifest,
    lawGraphSchedulerExecutionAudit: window.__multiscaleDemo.getState().lawGraphSchedulerExecutionAudit,
    lawGraphResultAdmission: window.__multiscaleDemo.getState().lawGraphResultAdmission,
    lawGraphStateApplicationPreflight: window.__multiscaleDemo.getState().lawGraphStateApplicationPreflight,
    lawGraphState: window.__multiscaleDemo.getState().lawGraphState,
    lawGraphDeltasApi: window.__multiscaleDemo.getLawGraphDeltas?.(),
    lawGraphUpdatePlanApi: window.__multiscaleDemo.getLawGraphUpdatePlan?.(),
    lawGraphConsistencySolveApi: window.__multiscaleDemo.getLawGraphConsistencySolve?.(),
    lawGraphProposalAdmissionApi: window.__multiscaleDemo.getLawGraphProposalAdmission?.(),
    lawGraphDispatchQueueApi: window.__multiscaleDemo.getLawGraphDispatchQueue?.(),
    lawGraphSchedulerManifestApi: window.__multiscaleDemo.getLawGraphSchedulerManifest?.(),
    lawGraphSchedulerExecutionAuditApi: window.__multiscaleDemo.getLawGraphSchedulerExecutionAudit?.(),
    lawGraphResultAdmissionApi: window.__multiscaleDemo.getLawGraphResultAdmission?.(),
    lawGraphStateApplicationPreflightApi: window.__multiscaleDemo.getLawGraphStateApplicationPreflight?.(),
    sourceSinkBalanceState: window.__multiscaleDemo.getState().sourceSinkBalanceState,
    sourceSinkBalanceDeltasApi: window.__multiscaleDemo.getSourceSinkBalanceDeltas?.(),
    sourceTransferState: window.__multiscaleDemo.getState().sourceTransferState,
    sourceTransferDeltasApi: window.__multiscaleDemo.getSourceTransferDeltas?.(),
    sourceTransferApplicationState: window.__multiscaleDemo.getState().sourceTransferApplicationState,
    sourceTransferApplicationDeltasApi: window.__multiscaleDemo.getSourceTransferApplicationDeltas?.(),
    sourceTransferTransactionState: window.__multiscaleDemo.getState().sourceTransferTransactionState,
    sourceTransferTransactionDeltasApi: window.__multiscaleDemo.getSourceTransferTransactionDeltas?.(),
    sourceTransferTargetPreviewState: window.__multiscaleDemo.getState().sourceTransferTargetPreviewState,
    sourceTransferTargetPreviewDeltasApi: window.__multiscaleDemo.getSourceTransferTargetPreviewDeltas?.(),
    sourceTransferTargetMutatorRegistryState: window.__multiscaleDemo.getState().sourceTransferTargetMutatorRegistryState,
    sourceTransferTargetMutatorRegistryDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutatorRegistryDeltas?.(),
    sourceTransferTargetMutationPreflightState: window.__multiscaleDemo.getState().sourceTransferTargetMutationPreflightState,
    sourceTransferTargetMutationPreflightDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutationPreflightDeltas?.(),
    sourceTransferTargetMutationOperationPlanState: window.__multiscaleDemo.getState().sourceTransferTargetMutationOperationPlanState,
    sourceTransferTargetMutationOperationPlanDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutationOperationPlanDeltas?.(),
    sourceTransferTargetMutationInvariantCheckState: window.__multiscaleDemo.getState().sourceTransferTargetMutationInvariantCheckState,
    sourceTransferTargetMutationInvariantCheckDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutationInvariantCheckDeltas?.(),
    sourceTransferTargetMutationCommitState: window.__multiscaleDemo.getState().sourceTransferTargetMutationCommitState,
    sourceTransferTargetMutationCommitDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutationCommitDeltas?.(),
    sourceTransferTargetMutationDispatchState: window.__multiscaleDemo.getState().sourceTransferTargetMutationDispatchState,
    sourceTransferTargetMutationDispatchDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutationDispatchDeltas?.(),
    sourceTransferTargetMutationApplyValidationState: window.__multiscaleDemo.getState().sourceTransferTargetMutationApplyValidationState,
    sourceTransferTargetMutationApplyValidationDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutationApplyValidationDeltas?.(),
    sourceTransferTargetMutationApplyExecutionState: window.__multiscaleDemo.getState().sourceTransferTargetMutationApplyExecutionState,
    sourceTransferTargetMutationApplyExecutionDeltasApi: window.__multiscaleDemo.getSourceTransferTargetMutationApplyExecutionDeltas?.(),
    sourceTransferTargetSourceIntakeState: window.__multiscaleDemo.getState().sourceTransferTargetSourceIntakeState,
    sourceTransferTargetSourceIntakeDeltasApi: window.__multiscaleDemo.getSourceTransferTargetSourceIntakeDeltas?.(),
    sourceTransferTargetSourceResponseState: window.__multiscaleDemo.getState().sourceTransferTargetSourceResponseState,
    sourceTransferTargetSourceResponseDeltasApi: window.__multiscaleDemo.getSourceTransferTargetSourceResponseDeltas?.(),
    sourceTransferTargetSourceReconciliationState: window.__multiscaleDemo.getState().sourceTransferTargetSourceReconciliationState,
    sourceTransferTargetSourceReconciliationDeltasApi: window.__multiscaleDemo.getSourceTransferTargetSourceReconciliationDeltas?.(),
    conservativeSourceBufferState: window.__multiscaleDemo.getState().conservativeSourceBufferState,
    conservativeSourceBufferDeltasApi: window.__multiscaleDemo.getConservativeSourceBufferDeltas?.(),
    sourceBufferApplicationState: window.__multiscaleDemo.getState().sourceBufferApplicationState,
    sourceBufferApplicationDeltasApi: window.__multiscaleDemo.getSourceBufferApplicationDeltas?.(),
    sourceBufferAcceptance: stateAfterWarm.sourceBufferAcceptance,
    sourceBufferAcceptanceState: window.__multiscaleDemo.getState().sourceBufferAcceptanceState,
    sourceBufferAcceptanceDeltasApi: window.__multiscaleDemo.getSourceBufferAcceptanceDeltas?.(),
    sourceBufferWritebackValidation: stateAfterWarm.sourceBufferWritebackValidation,
    sourceBufferWritebackValidationState: window.__multiscaleDemo.getState().sourceBufferWritebackValidationState,
    sourceBufferWritebackValidationDeltasApi: window.__multiscaleDemo.getSourceBufferWritebackValidationDeltas?.(),
    targetBufferReplayValidation: stateAfterWarm.targetBufferReplayValidation,
    targetBufferReplayValidationState: window.__multiscaleDemo.getState().targetBufferReplayValidationState,
    targetBufferReplayValidationDeltasApi: window.__multiscaleDemo.getTargetBufferReplayValidationDeltas?.(),
    targetBufferMutationAudit: stateAfterWarm.targetBufferMutationAudit,
    targetBufferMutationAuditState: window.__multiscaleDemo.getState().targetBufferMutationAuditState,
    targetBufferMutationAuditDeltasApi: window.__multiscaleDemo.getTargetBufferMutationAuditDeltas?.(),
    targetBufferWorkerWriteQueue: stateAfterWarm.targetBufferWorkerWriteQueue,
    targetBufferWorkerWriteQueueState: window.__multiscaleDemo.getState().targetBufferWorkerWriteQueueState,
    targetBufferWorkerWriteQueueDeltasApi: window.__multiscaleDemo.getTargetBufferWorkerWriteQueueDeltas?.(),
    targetBufferWorkerWriteExecutionState: window.__multiscaleDemo.getState().targetBufferWorkerWriteExecutionState,
    targetBufferWorkerWriteExecutionDeltasApi: window.__multiscaleDemo.getTargetBufferWorkerWriteExecutionDeltas?.(),
    targetBufferWorkerWriteVerificationState: window.__multiscaleDemo.getState().targetBufferWorkerWriteVerificationState,
    targetBufferWorkerWriteVerificationDeltasApi: window.__multiscaleDemo.getTargetBufferWorkerWriteVerificationDeltas?.(),
    scientificInvariantGateState: window.__multiscaleDemo.getState().scientificInvariantGateState,
    scientificInvariantGateDeltasApi: window.__multiscaleDemo.getScientificInvariantGateDeltas?.(),
    scientificReadinessManifestState: window.__multiscaleDemo.getState().scientificReadinessManifestState,
    scientificReadinessManifestDeltasApi: window.__multiscaleDemo.getScientificReadinessManifestDeltas?.(),
    packetCoupling: packetAfterWarm.coupling,
    packetLawGraph: packetAfterWarm.lawGraph,
    packetSourceSinkBalance: packetAfterWarm.sourceSinkBalance,
    packetSourceEquation: packetAfterWarm.sourceEquation,
    packetSourceTransfer: packetAfterWarm.sourceTransfer,
    packetSourceTransferApplication: packetAfterWarm.sourceTransferApplication,
    packetSourceTransferTransaction: packetAfterWarm.sourceTransferTransaction,
    packetSourceTransferTargetPreview: packetAfterWarm.sourceTransferTargetPreview,
    packetSourceTransferTargetMutatorRegistry: packetAfterWarm.sourceTransferTargetMutatorRegistry,
    packetSourceTransferTargetMutationPreflight: packetAfterWarm.sourceTransferTargetMutationPreflight,
    packetSourceTransferTargetMutationOperationPlan: packetAfterWarm.sourceTransferTargetMutationOperationPlan,
    packetSourceTransferTargetMutationInvariantCheck: packetAfterWarm.sourceTransferTargetMutationInvariantCheck,
    packetSourceTransferTargetMutationCommit: packetAfterWarm.sourceTransferTargetMutationCommit,
    packetSourceTransferTargetMutationDispatch: packetAfterWarm.sourceTransferTargetMutationDispatch,
    packetSourceTransferTargetMutationApplyValidation: packetAfterWarm.sourceTransferTargetMutationApplyValidation,
    packetSourceTransferTargetMutationApplyExecution: packetAfterWarm.sourceTransferTargetMutationApplyExecution,
    packetSourceTransferTargetSourceIntake: packetAfterWarm.sourceTransferTargetSourceIntake,
    packetSourceTransferTargetSourceResponse: packetAfterWarm.sourceTransferTargetSourceResponse,
    packetSourceTransferTargetSourceReconciliation: packetAfterWarm.sourceTransferTargetSourceReconciliation,
    packetConservativeSourceBuffer: packetAfterWarm.conservativeSourceBuffer,
    packetSourceBufferApplication: packetAfterWarm.upward?.aggregateState?.molecularSourceBufferApplication,
    packetSourceBufferAcceptance: packetAfterWarm.sourceBufferAcceptance,
    packetSourceBufferAcceptanceAggregate: packetAfterWarm.upward?.aggregateState?.molecularSourceBufferAcceptance,
    packetSourceBufferWritebackValidation: packetAfterWarm.sourceBufferWritebackValidation,
    packetSourceBufferWritebackValidationAggregate: packetAfterWarm.upward?.aggregateState?.molecularSourceBufferWritebackValidation,
    packetTargetBufferReplayValidation: packetAfterWarm.targetBufferReplayValidation,
    packetTargetBufferReplayValidationAggregate: packetAfterWarm.upward?.aggregateState?.molecularTargetBufferReplayValidation,
    packetTargetBufferMutationAudit: packetAfterWarm.targetBufferMutationAudit,
    packetTargetBufferMutationAuditAggregate: packetAfterWarm.upward?.aggregateState?.molecularTargetBufferMutationAudit,
    packetTargetBufferWorkerWriteQueue: packetAfterWarm.targetBufferWorkerWriteQueue,
    packetTargetBufferWorkerWriteQueueAggregate: packetAfterWarm.upward?.aggregateState?.molecularTargetBufferWorkerWriteQueue,
    packetTargetBufferWorkerWriteExecution: packetAfterWarm.targetBufferWorkerWriteExecution,
    packetTargetBufferWorkerWriteExecutionAggregate: packetAfterWarm.upward?.aggregateState?.molecularTargetBufferWorkerWriteExecution,
    packetTargetBufferWorkerWriteVerification: packetAfterWarm.targetBufferWorkerWriteVerification,
    packetTargetBufferWorkerWriteVerificationAggregate: packetAfterWarm.upward?.aggregateState?.molecularTargetBufferWorkerWriteVerification,
    packetMolecularScientificInvariantGate: packetAfterWarm.molecularScientificInvariantGate,
    packetMolecularScientificInvariantGateAggregate: packetAfterWarm.upward?.aggregateState?.molecularScientificInvariantGate,
    packetMolecularScientificReadinessManifest: packetAfterWarm.molecularScientificReadinessManifest,
    packetMolecularScientificReadinessManifestAggregate: packetAfterWarm.upward?.aggregateState?.molecularScientificReadinessManifest,
    runtimeDebugCoupling: window.__multiscaleDemo.getRuntimeDebug?.().crossScaleCoupling,
    runtimeDebugLawGraph: window.__multiscaleDemo.getRuntimeDebug?.().lawGraph,
    runtimeDebug: window.__multiscaleDemo.getRuntimeDebug?.(),
    runtimeDebugFromState: window.__multiscaleDemo.getState().runtimeDebug,
    hud: window.__multiscaleDemo.getState().hud,
    hudModeApi: window.__multiscaleDemo.getHudMode?.(),
    packetPreview: window.__multiscaleDemo.getPacketPreview?.(),
    packetReadoutText: document.querySelector('#packet-readout')?.textContent,
    layerReadoutRowCount: document.querySelectorAll('#layer-readout dt').length,
    runtimeDebugText: document.querySelector('#runtime-debug-readout')?.textContent,
    readoutText: document.querySelector('#layer-readout')?.textContent,
    solverGovernor: window.__multiscaleDemo.getState().solverGovernor,
    runtimeDebugSolverGovernor: window.__multiscaleDemo.getRuntimeDebug?.().solverGovernor,
    lowerScaleRefinement: window.__multiscaleDemo.getState().lowerScaleRefinement,
    runtimeDebugLowerScaleRefinement: window.__multiscaleDemo.getRuntimeDebug?.().lowerScaleRefinement,
    computeLowerScaleRefinement: window.__multiscaleDemo.getState().compute?.peercompute?.lowerScaleRefinement,
    solverSubmissionBudget: window.__multiscaleDemo.getState().solverSubmissionBudget,
    solverSubmissionBudgetApi: window.__multiscaleDemo.getSolverSubmissionBudget?.(),
    runtimeDebugSolverSubmissionBudget: window.__multiscaleDemo.getRuntimeDebug?.().solverSubmissionBudget,
    computeSolverSubmissionBudget: window.__multiscaleDemo.getState().compute?.peercompute?.solverSubmissionBudget,
    visualReference: window.__multiscaleDemo.getState().visualReference,
    runtimeDebugVisualReference: window.__multiscaleDemo.getRuntimeDebug?.().visualReference,
    statePublicationBudget: window.__multiscaleDemo.getState().statePublicationBudget,
    statePublicationBudgetApi: window.__multiscaleDemo.getStatePublicationBudget?.(),
    runtimeDebugStatePublicationBudget: window.__multiscaleDemo.getRuntimeDebug?.().statePublicationBudget,
    computeStatePublicationBudget: window.__multiscaleDemo.getState().compute?.peercompute?.statePublicationBudget,
    runtimeDiagnosticsBudget: window.__multiscaleDemo.getState().runtimeDiagnosticsBudget,
    runtimeDiagnosticsBudgetApi: window.__multiscaleDemo.getRuntimeDiagnosticsBudget?.(),
    runtimeDebugRuntimeDiagnosticsBudget: window.__multiscaleDemo.getRuntimeDebug?.().runtimeDiagnosticsBudget,
    computeRuntimeDiagnosticsBudget: window.__multiscaleDemo.getState().compute?.peercompute?.runtimeDiagnosticsBudget,
    renderBudget: window.__multiscaleDemo.getState().renderBudget,
    renderBudgetApi: window.__multiscaleDemo.getRenderBudget?.(),
    runtimeDebugRenderBudget: window.__multiscaleDemo.getRuntimeDebug?.().renderBudget,
    computeRenderBudget: window.__multiscaleDemo.getState().compute?.peercompute?.renderBudget,
    readbackBudget: window.__multiscaleDemo.getState().readbackBudget,
    readbackBudgetApi: window.__multiscaleDemo.getReadbackBudget?.(),
    runtimeDebugReadbackBudget: window.__multiscaleDemo.getRuntimeDebug?.().readbackBudget,
    computeReadbackBudget: window.__multiscaleDemo.getState().compute?.peercompute?.readbackBudget,
    netVizSession: window.__multiscaleDemo.getNetVizSession?.(),
    netVizSessionFromState: window.__multiscaleDemo.getState().netVizSession,
    computeWorkerCount: window.__multiscaleDemo.getState().compute?.peercompute?.workerCount,
    plannedWorkers: window.__multiscaleDemo.getState().compute?.peercompute?.plannedWorkers,
    plannedShardTasks: window.__multiscaleDemo.getState().compute?.peercompute?.plannedShardTasks,
    managerStats: window.__multiscaleDemo.getState().compute?.peercompute?.managerCapabilities?.stats,
    workerUtilization: window.__multiscaleDemo.getState().workerUtilization,
    computeWorkerUtilization: window.__multiscaleDemo.getState().compute?.peercompute?.managerCapabilities?.stats?.workerUtilization,
    taskPlacement: window.__multiscaleDemo.getState().taskPlacement,
    computeTaskPlacement: window.__multiscaleDemo.getState().compute?.peercompute?.managerCapabilities?.stats?.taskPlacement,
    nbodyBodies: window.__multiscaleDemo.getState().solverBudget?.nbody?.bodyCount,
    maxwellGrid: window.__multiscaleDemo.getState().solverBudget?.maxwell?.width,
    sphParticles: window.__multiscaleDemo.getState().solverBudget?.sphMaterial?.particleCount,
    combustionGrid: window.__multiscaleDemo.getState().solverBudget?.combustionPlume?.width,
    membraneSegments: window.__multiscaleDemo.getState().solverBudget?.membraneShell?.segmentCount,
    stellarGrid: window.__multiscaleDemo.getState().solverBudget?.stellarFusion?.width,
    magnetosphereGrid: window.__multiscaleDemo.getState().solverBudget?.magnetospherePlasma?.width,
    picParticles: window.__multiscaleDemo.getState().solverBudget?.picPlasmaPatch?.particleCount,
    picGrid: window.__multiscaleDemo.getState().solverBudget?.picPlasmaPatch?.gridWidth,
    relativitySamples: window.__multiscaleDemo.getState().solverBudget?.relativisticCorrection?.sampleCount,
    cosmologySamples: window.__multiscaleDemo.getState().solverBudget?.cosmologyExpansion?.sampleCount,
    molecularAtoms: window.__multiscaleDemo.getState().solverBudget?.molecularDynamics?.atomCount
    };
  });
  await page.waitForFunction(() => {
    const application = window.__multiscaleDemo.getPacket().upward?.aggregateState?.molecularSourceBufferApplication;
    const acceptance = window.__multiscaleDemo.getPacket().sourceBufferAcceptance;
    const writeback = window.__multiscaleDemo.getPacket().sourceBufferWritebackValidation;
    const replay = window.__multiscaleDemo.getPacket().targetBufferReplayValidation;
    const audit = window.__multiscaleDemo.getPacket().targetBufferMutationAudit;
    const queue = window.__multiscaleDemo.getPacket().targetBufferWorkerWriteQueue;
    return application?.reactive?.schema === 'peercompute.multiscale.molecular-source-buffer-application.v0'
      && application?.sph?.schema === 'peercompute.multiscale.molecular-source-buffer-application.v0'
      && application?.reactiveReport?.schema === 'peercompute.multiscale.molecular-source-buffer-application.v0'
      && application?.sphReport?.schema === 'peercompute.multiscale.molecular-source-buffer-application.v0'
      && application.appliedTargetCount >= 1
      && application.appliedFieldCount >= 4
      && application.sourceTermCount >= 8
      && acceptance?.schema === 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
      && acceptance.acceptedTargetCount >= 1
      && acceptance.acceptedTargetCount === acceptance.targetCount
      && acceptance.blockedTargetCount === 0
      && acceptance.canMutateProxy === true
      && acceptance.sourceTermCount >= 8
      && writeback?.schema === 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
      && writeback.validatedTargetCount >= 1
      && writeback.validatedTargetCount === writeback.targetCount
      && writeback.blockedTargetCount === 0
      && writeback.canWritebackProxy === true
      && writeback.sourceTermCount >= 8
      && replay?.schema === 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
      && replay.replayedTargetCount >= 1
      && replay.replayedTargetCount === replay.targetCount
      && replay.blockedTargetCount === 0
      && replay.canReplayProxy === true
      && replay.missingFieldCount === 0
      && replay.replayedFieldCount >= 4
      && audit?.schema === 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
      && audit.readyTargetCount >= 1
      && audit.readyTargetCount === audit.targetCount
      && audit.blockedTargetCount === 0
      && audit.canMutateProxy === true
      && audit.canQueueWorkerWrite === false
      && audit.scientificMutationReady === false
      && audit.readyWriteIntentCount >= 4
      && audit.readyWriteIntentCount === audit.writeIntentCount
      && queue?.schema === 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
      && queue.queueReadyBatchCount >= 1
      && queue.queueReadyBatchCount === queue.targetBatchCount
      && queue.canPlanWorkerWrite === true
      && queue.canQueueWorkerWrite === false
      && queue.scientificMutationReady === false
      && queue.queueReadyWriteIntentCount >= 4
      && queue.queueReadyWriteIntentCount === queue.writeIntentCount;
  }, null, { timeout: 60000 });
  const sourceBufferApplicationApi = await page.evaluate(() => {
    const writerExecutionApi = window.__multiscaleDemo.executeMolecularTargetBufferWorkerWrite?.({
      executionRequested: true,
      proxyWorkerWriteEnabled: true,
      targetWorkerWriteImplemented: true
    });
    const packet = window.__multiscaleDemo.getPacket();
    const stateAfterWriter = window.__multiscaleDemo.getState();
    return {
      writerExecutionApi,
      packetSourceBufferApplication: packet.upward?.aggregateState?.molecularSourceBufferApplication,
      packetSourceBufferAcceptance: packet.sourceBufferAcceptance,
      packetSourceBufferAcceptanceAggregate: packet.upward?.aggregateState?.molecularSourceBufferAcceptance,
      packetSourceBufferWritebackValidation: packet.sourceBufferWritebackValidation,
      packetSourceBufferWritebackValidationAggregate: packet.upward?.aggregateState?.molecularSourceBufferWritebackValidation,
      packetTargetBufferReplayValidation: packet.targetBufferReplayValidation,
      packetTargetBufferReplayValidationAggregate: packet.upward?.aggregateState?.molecularTargetBufferReplayValidation,
      packetTargetBufferMutationAudit: packet.targetBufferMutationAudit,
      packetTargetBufferMutationAuditAggregate: packet.upward?.aggregateState?.molecularTargetBufferMutationAudit,
      packetTargetBufferWorkerWriteQueue: packet.targetBufferWorkerWriteQueue,
      packetTargetBufferWorkerWriteQueueAggregate: packet.upward?.aggregateState?.molecularTargetBufferWorkerWriteQueue,
      packetTargetBufferWorkerWriteExecution: packet.targetBufferWorkerWriteExecution,
      packetTargetBufferWorkerWriteExecutionAggregate: packet.upward?.aggregateState?.molecularTargetBufferWorkerWriteExecution,
      packetTargetBufferWorkerWriteVerification: packet.targetBufferWorkerWriteVerification,
      packetTargetBufferWorkerWriteVerificationAggregate: packet.upward?.aggregateState?.molecularTargetBufferWorkerWriteVerification,
      packetMolecularScientificInvariantGate: packet.molecularScientificInvariantGate,
      packetMolecularScientificInvariantGateAggregate: packet.upward?.aggregateState?.molecularScientificInvariantGate,
      packetMolecularScientificReadinessManifest: packet.molecularScientificReadinessManifest,
      packetMolecularScientificReadinessManifestAggregate: packet.upward?.aggregateState?.molecularScientificReadinessManifest,
      directSourceBufferAcceptance: stateAfterWriter.sourceBufferAcceptance,
      directSourceBufferWritebackValidation: stateAfterWriter.sourceBufferWritebackValidation,
      directTargetBufferReplayValidation: stateAfterWriter.targetBufferReplayValidation,
      directTargetBufferMutationAudit: stateAfterWriter.targetBufferMutationAudit,
      directTargetBufferWorkerWriteQueue: stateAfterWriter.targetBufferWorkerWriteQueue,
      directTargetBufferWorkerWriteExecution: stateAfterWriter.targetBufferWorkerWriteExecution,
      directTargetBufferWorkerWriteVerification: stateAfterWriter.targetBufferWorkerWriteVerification,
      directMolecularScientificInvariantGate: stateAfterWriter.molecularScientificInvariantGate,
      directMolecularScientificReadinessManifest: stateAfterWriter.molecularScientificReadinessManifest,
      state: window.__multiscaleDemo.getState().sourceBufferApplicationState,
      deltasApi: window.__multiscaleDemo.getSourceBufferApplicationDeltas?.(),
      acceptanceState: window.__multiscaleDemo.getState().sourceBufferAcceptanceState,
      acceptanceDeltasApi: window.__multiscaleDemo.getSourceBufferAcceptanceDeltas?.(),
      writebackValidationState: window.__multiscaleDemo.getState().sourceBufferWritebackValidationState,
      writebackValidationDeltasApi: window.__multiscaleDemo.getSourceBufferWritebackValidationDeltas?.(),
      replayValidationState: window.__multiscaleDemo.getState().targetBufferReplayValidationState,
      replayValidationDeltasApi: window.__multiscaleDemo.getTargetBufferReplayValidationDeltas?.(),
      mutationAuditState: window.__multiscaleDemo.getState().targetBufferMutationAuditState,
      mutationAuditDeltasApi: window.__multiscaleDemo.getTargetBufferMutationAuditDeltas?.(),
      workerWriteQueueState: window.__multiscaleDemo.getState().targetBufferWorkerWriteQueueState,
      workerWriteQueueDeltasApi: window.__multiscaleDemo.getTargetBufferWorkerWriteQueueDeltas?.(),
      workerWriteExecutionState: window.__multiscaleDemo.getState().targetBufferWorkerWriteExecutionState,
      workerWriteExecutionDeltasApi: window.__multiscaleDemo.getTargetBufferWorkerWriteExecutionDeltas?.(),
      workerWriteVerificationState: window.__multiscaleDemo.getState().targetBufferWorkerWriteVerificationState,
      workerWriteVerificationDeltasApi: window.__multiscaleDemo.getTargetBufferWorkerWriteVerificationDeltas?.(),
      scientificInvariantGateState: window.__multiscaleDemo.getState().scientificInvariantGateState,
      scientificInvariantGateDeltasApi: window.__multiscaleDemo.getScientificInvariantGateDeltas?.(),
      scientificReadinessManifestState: window.__multiscaleDemo.getState().scientificReadinessManifestState,
      scientificReadinessManifestDeltasApi: window.__multiscaleDemo.getScientificReadinessManifestDeltas?.(),
      conservationExchange: packet.conservation?.exchange,
      couplingExchange: packet.coupling?.exchange,
      reactiveLink: packet.coupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source') || null,
      sphLink: packet.coupling?.links?.find((link) => link.id === 'molecular-closure-to-sph-material-source') || null,
      readoutText: document.querySelector('#layer-readout')?.textContent
    };
  });
  const quantumOrbitalResult = await page.evaluate(() => {
    window.__multiscaleDemo.setLayerById?.('orbital');
    window.__multiscaleDemo.setHudMode?.('focus');
    return window.__multiscaleDemo.setQuantumOrbital?.({
      elementSymbol: 'Cl',
      principalN: 3,
      angularL: 1,
      magneticM: -1,
      finiteGridSize: 14
    });
  });
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    const rows = [...document.querySelectorAll('#layer-readout dt')].map((node) => node.textContent);
    const gridRowIndex = rows.indexOf('quantum grid');
    return state.layer?.id === 'orbital'
      && packet.upward?.aggregateState?.quantumOrbital?.elementSymbol === 'Cl'
      && packet.upward?.aggregateState?.quantumOrbital?.finiteGridSize === 14
      && state.solverRuntime?.quantumOrbitalGrid?.lastResult?.parameters?.elementSymbol === 'Cl'
      && state.solverRuntime?.quantumOrbitalGrid?.lastResult?.finiteGrid?.gridSize === 14
      && gridRowIndex >= 0
      && gridRowIndex <= 11;
  }, null, { timeout: 30000 });
  const quantumOrbitalApi = await page.evaluate((result) => {
    const state = window.__multiscaleDemo.getQuantumOrbital?.();
    const packet = window.__multiscaleDemo.getPacket();
    const focusRows = [...document.querySelectorAll('#layer-readout dt')].map((node) => node.textContent);
    return {
      result,
      state,
      packet: packet.upward?.aggregateState?.quantumOrbital,
      readoutText: document.querySelector('#layer-readout')?.textContent,
      focusRows,
      elementControl: document.querySelector('#orbital-element')?.value,
      gridControl: document.querySelector('#orbital-grid')?.value
    };
  }, quantumOrbitalResult);

  const remotePlacementApi = await page.evaluate(() => {
    if (typeof window.__multiscaleDemo.configureRemotePlacement !== 'function') {
      return { hasApi: false };
    }
    window.__multiscaleDemo.setHudMode?.('telemetry');
    const result = window.__multiscaleDemo.configureRemotePlacement({
      enableRemotePlacement: true,
      peerId: 'visual-peer-alpha',
      mode: 'peer',
      timeoutMs: 12000,
      placementExecutorId: 'visual-network-executor',
      placementExecutor: async () => ({
        value: { ok: true, source: 'visual-network-executor' },
        provenance: {
          executorId: 'visual-network-executor',
          peerId: 'visual-peer-alpha'
        }
      }),
      placementAdmissionId: 'visual-admission',
      placementAdmission: () => true,
      placementTaskSignerId: 'visual-signer',
      placementTaskSigner: (taskPacket) => ({
        signature: `visual:${taskPacket?.taskHash || 'unknown'}`,
        signatureAlgorithm: 'visual-smoke-metadata',
        signerId: 'visual-signer'
      }),
      placementResultValidatorId: 'visual-validator',
      placementResultValidator: () => true
    });
    const state = window.__multiscaleDemo.getState();
    return {
      hasApi: true,
      result,
      readiness: state.remotePlacementReadiness,
      configuration: state.remotePlacementConfiguration,
      computeConfiguration: state.compute?.peercompute?.remotePlacementConfiguration,
      runtimeDebug: window.__multiscaleDemo.getRuntimeDebug?.(),
      readoutText: document.querySelector('#layer-readout')?.textContent,
      runtimeDebugText: document.querySelector('#runtime-debug-readout')?.textContent
    };
  });

  const remoteSolverPlacementApi = await page.evaluate(() => {
    if (typeof window.__multiscaleDemo.configureRemoteSolverPlacement !== 'function') {
      return { hasApi: false };
    }
    window.__multiscaleDemo.setHudMode?.('telemetry');
    const result = window.__multiscaleDemo.configureRemoteSolverPlacement({
      enabled: true,
      families: ['cosmologyExpansion', 'nbody'],
      mode: 'auto',
      nonAdvisory: false,
      minimumConfidence: 0.5
    });
    const state = window.__multiscaleDemo.getState();
    return {
      hasApi: true,
      result,
      policy: state.remoteSolverPlacementPolicy,
      decisions: state.remoteSolverPlacementDecisions,
      computePolicy: state.compute?.peercompute?.remoteSolverPlacementPolicy,
      computeDecisions: state.compute?.peercompute?.remoteSolverPlacementDecisions,
      runtimeDebug: window.__multiscaleDemo.getRuntimeDebug?.(),
      readoutText: document.querySelector('#layer-readout')?.textContent,
      runtimeDebugText: document.querySelector('#runtime-debug-readout')?.textContent
    };
  });

  const loopbackRemotePlacementApi = await page.evaluate(async () => {
    if (typeof window.__multiscaleDemo.runLoopbackRemotePlacementProbe !== 'function') {
      return { hasApi: false };
    }
    window.__multiscaleDemo.setHudMode?.('telemetry');
    const result = await window.__multiscaleDemo.runLoopbackRemotePlacementProbe({
      peerId: 'visual-loopback-peer',
      sampleCount: 8
    });
    const state = window.__multiscaleDemo.getState();
    return {
      hasApi: true,
      result,
      readiness: state.remotePlacementReadiness,
      configuration: state.remotePlacementConfiguration,
      taskPlacement: state.taskPlacement,
      managerStats: state.compute?.peercompute?.managerCapabilities?.stats,
      runtimeDebug: window.__multiscaleDemo.getRuntimeDebug?.(),
      readoutText: document.querySelector('#layer-readout')?.textContent,
      runtimeDebugText: document.querySelector('#runtime-debug-readout')?.textContent
    };
  });

  const loopbackRemoteSolverPlacementApi = await page.evaluate(async () => {
    if (typeof window.__multiscaleDemo.runLoopbackRemoteSolverPlacementProbe !== 'function') {
      return { hasApi: false };
    }
    window.__multiscaleDemo.setHudMode?.('telemetry');
    const result = await window.__multiscaleDemo.runLoopbackRemoteSolverPlacementProbe({
      peerId: 'visual-loopback-policy-peer',
      sampleCount: 8
    });
    const state = window.__multiscaleDemo.getState();
    return {
      hasApi: true,
      result,
      readiness: state.remotePlacementReadiness,
      configuration: state.remotePlacementConfiguration,
      policy: state.remoteSolverPlacementPolicy,
      decisions: state.remoteSolverPlacementDecisions,
      taskPlacement: state.taskPlacement,
      managerStats: state.compute?.peercompute?.managerCapabilities?.stats,
      runtimeDebug: window.__multiscaleDemo.getRuntimeDebug?.(),
      readoutText: document.querySelector('#layer-readout')?.textContent,
      runtimeDebugText: document.querySelector('#runtime-debug-readout')?.textContent
    };
  });

  const resizeRemap = await page.evaluate(async () => {
    let last = null;
    const startedAt = Date.now();
    for (let attempt = 0; attempt < 160; attempt += 1) {
      const before = window.__multiscaleDemo.getState();
      const nextBodyCount = Math.min(64, Math.max(3, (before.solverBudget?.nbody?.bodyCount || 3) + 1));
      const result = window.__multiscaleDemo.resizeSolverWorkloads({
        nbodyBodies: nextBodyCount
      });
      const after = window.__multiscaleDemo.getState();
      const fullReport = window.__multiscaleDemo.getSolverRemapReport?.();
      last = {
        attempt,
        elapsedMs: Date.now() - startedAt,
        result,
        solverRemap: after.solverRemapSummary,
        solverRemapApi: window.__multiscaleDemo.getSolverRemapSummary?.(),
        fullSolverCount: fullReport?.solvers?.length || 0,
        fullInvariantCount: fullReport?.invariantCount || 0,
        runtimeDebugRemap: window.__multiscaleDemo.getRuntimeDebug?.().solverRemap,
        pendingSolvers: Object.entries(after.solverRuntime || {})
          .filter(([, entry]) => entry?.pending)
          .map(([key]) => key),
        readoutText: document.querySelector('#layer-readout')?.textContent,
        runtimeText: document.querySelector('#runtime-debug-readout')?.textContent
      };
      if (result?.ok || result?.reason !== 'solver-pending') return last;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return last;
  });
  const workerResizeRequest = await page.evaluate(() => {
    const before = window.__multiscaleDemo.getState();
    const policy = before.computeBudget?.workerPolicy || {};
    const beforeTarget = Number(policy.targetWorkers || before.compute?.peercompute?.workerCount || 1);
    const minWorkers = Number(policy.minWorkers || 1);
    const maxWorkers = Number(policy.maxWorkers || Math.max(beforeTarget, minWorkers));
    const target = beforeTarget > minWorkers
      ? beforeTarget - 1
      : Math.min(maxWorkers, beforeTarget + 1);
    const result = window.__multiscaleDemo.resizeComputeWorkers(target);
    return {
      target,
      beforeTarget,
      minWorkers,
      maxWorkers,
      changedExpected: target !== beforeTarget,
      beforeWorkerPoolRevision: before.compute?.peercompute?.managerCapabilities?.workerPoolRevision ?? 0,
      result,
      beforePlannedShardTasks: before.compute?.peercompute?.plannedShardTasks
    };
  });
  await page.waitForFunction(() => {
    const state = window.__multiscaleDemo.getState();
    return state.computeCapacityResize?.schema === 'peercompute.multiscale.compute-capacity-resize.v0'
      && state.computeCapacityResize.pending === false;
  }, null, { timeout: 45000 });
  const workerResize = await page.evaluate((request) => {
    const state = window.__multiscaleDemo.getState();
    const packet = window.__multiscaleDemo.getPacket();
    return {
      request,
      stateResize: state.computeCapacityResize,
      runtimeDebugResize: window.__multiscaleDemo.getRuntimeDebug?.().computeResize,
      runtimeScaler: state.runtimeScaler,
      workerPoolRevision: state.compute?.peercompute?.managerCapabilities?.workerPoolRevision,
      lastWorkerResize: state.compute?.peercompute?.managerCapabilities?.lastWorkerResize,
      workerAutoScaleHold: state.compute?.peercompute?.managerCapabilities?.workerAutoScaleHold,
      scalePoolResize: state.compute?.peercompute?.lastResize,
      packetConservation: packet.conservation,
      plannedShardTasks: state.compute?.peercompute?.plannedShardTasks,
      computeBudget: state.computeBudget,
      readoutText: document.querySelector('#layer-readout')?.textContent,
      runtimeText: document.querySelector('#runtime-debug-readout')?.textContent
    };
  }, workerResizeRequest);
  const environmentApi = await page.evaluate(() => {
    window.__multiscaleDemo.setHudMode?.('telemetry');
    const environment = window.__multiscaleDemo.setEnvironment({
      ambientTemperatureK: 360,
      ambientPressurePa: 150000,
      oxygenFraction: 0.28,
      gravityMps2: 4.2,
      stellarFlux: 1.1,
      electricFieldVm: 0,
      magneticFieldT: 0
    });
    return {
      environment,
      hud: window.__multiscaleDemo.getState().hud,
      layerReadoutRowCount: document.querySelectorAll('#layer-readout dt').length,
      temperatureControl: document.querySelector('#ambient-temperature')?.value,
      pressureControl: document.querySelector('#ambient-pressure')?.value,
      readoutText: document.querySelector('#layer-readout')?.textContent,
      boundaryConditions: window.__multiscaleDemo.getPacket().downward?.boundaryConditions
    };
  });
  const hudApi = await page.evaluate(() => {
    const telemetry = window.__multiscaleDemo.setHudMode?.('telemetry');
    const telemetryState = window.__multiscaleDemo.getState().hud;
    const telemetryText = document.querySelector('#layer-readout')?.textContent;
    const telemetryPacketText = document.querySelector('#packet-readout')?.textContent;
    const telemetryRows = document.querySelectorAll('#layer-readout dt').length;
    const focus = window.__multiscaleDemo.setHudMode?.('focus');
    const focusState = window.__multiscaleDemo.getState().hud;
    const focusText = document.querySelector('#layer-readout')?.textContent;
    const focusPacketText = document.querySelector('#packet-readout')?.textContent;
    const focusRows = document.querySelectorAll('#layer-readout dt').length;
    return {
      telemetry,
      telemetryState,
      telemetryText,
      telemetryPacketText,
      telemetryRows,
      focus,
      focusState,
      focusText,
      focusPacketText,
      focusRows
    };
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileOutputApi = await page.evaluate(() => {
    const before = window.__multiscaleDemo.getOutputPanels?.();
    const packetOff = window.__multiscaleDemo.toggleOutputPanel?.('packet');
    const packetDisplayAfterOff = window.getComputedStyle(document.querySelector('.packet')).display;
    const readoutOff = window.__multiscaleDemo.setOutputPanelVisibility?.('readout', false);
    const readoutDisplayAfterOff = window.getComputedStyle(document.querySelector('.panel.right')).display;
    const readoutOn = window.__multiscaleDemo.setOutputPanelVisibility?.('readout', true);
    const packetOn = window.__multiscaleDemo.setOutputPanelVisibility?.('packet', true);
    const bulkMinimal = window.__multiscaleDemo.setOutputPanelsVisibility?.({
      controls: true,
      runtime: false,
      readout: true,
      packet: false
    });
    const runtimeDisplayAfterBulk = window.getComputedStyle(document.querySelector('.runtime-panel')).display;
    const packetDisplayAfterBulk = window.getComputedStyle(document.querySelector('.packet')).display;
    const bulkRestore = window.__multiscaleDemo.setOutputPanelsVisibility?.(true);
    const after = window.__multiscaleDemo.getOutputPanels?.();
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      buttonCount: document.querySelectorAll('#output-toggles button').length,
      before,
      packetOff,
      packetDisplayAfterOff,
      readoutOff,
      readoutDisplayAfterOff,
      readoutOn,
      packetOn,
      bulkMinimal,
      runtimeDisplayAfterBulk,
      packetDisplayAfterBulk,
      bulkRestore,
      after,
      stateHud: window.__multiscaleDemo.getState().hud,
      runtimeHud: window.__multiscaleDemo.getRuntimeDebug?.().hud
    };
  });
  await browser.close();

  const summary = {
    url: TARGET_URL,
    solverCount: surfaceState.solverRegistry?.solverCount,
    cosmologyExpansion: {
      backend: supergalacticState.solverRuntime?.cosmologyExpansion?.lastResult?.backend,
      overlay: supergalacticState.cosmologyExpansionOverlay,
      packet: packet.upward?.aggregateState?.cosmologyExpansion
    },
    molecularDynamics: {
      backend: molecularState.solverRuntime?.molecularDynamics?.lastResult?.backend,
      overlay: molecularState.molecularDynamicsOverlay,
      packet: packet.upward?.aggregateState?.molecularDynamics,
      runtime: molecularState.solverRuntime?.molecularDynamics?.lastResult,
      solverLoadEntry: molecularSolverLoadEntry,
      recipe: molecularRecipeState.molecularComposition,
      recipePacket: molecularRecipeState.state?.molecular?.molecularDynamics,
      append: molecularAppendState.molecularComposition,
      appendPacket: molecularAppendState.state?.molecular?.molecularDynamics,
      readoutText: molecularReadoutText
    },
    quantumOrbital: {
      packet: packet.upward?.aggregateState?.quantumOrbital,
      closureResult: packet.upward?.closureResults?.quantumOrbital,
      readoutText: molecularReadoutText,
      runtime: quantumWorkerState.solverRuntime?.quantumOrbitalGrid,
      state: quantumWorkerState.orbital,
      api: quantumOrbitalApi,
      fieldResponseProbe: quantumFieldResponseProbe
    },
    nbody: {
      backend: solarState.solverRuntime?.nbody?.lastResult?.backend,
      overlay: solarState.nbodyOverlay,
      packet: packet.upward?.aggregateState?.nbody
    },
    stellarFusion: {
      backend: solarState.solverRuntime?.stellarFusion?.lastResult?.backend,
      overlay: solarState.stellarFusionOverlay,
      packet: packet.upward?.aggregateState?.stellarFusion
    },
    magnetospherePlasma: {
      backend: solarState.solverRuntime?.magnetospherePlasma?.lastResult?.backend,
      overlay: solarState.magnetospherePlasmaOverlay,
      packet: packet.upward?.aggregateState?.magnetosphere
    },
    picPlasmaPatch: {
      backend: solarState.solverRuntime?.picPlasmaPatch?.lastResult?.backend,
      overlay: solarState.picPlasmaPatchOverlay,
      packet: packet.upward?.aggregateState?.picPlasmaPatch
    },
    relativisticCorrection: {
      backend: solarState.solverRuntime?.relativisticCorrection?.lastResult?.backend,
      overlay: solarState.relativisticCorrectionOverlay,
      packet: packet.upward?.aggregateState?.relativity
    },
    maxwell: {
      backend: galacticState.solverRuntime?.maxwell?.lastResult?.backend,
      overlay: galacticState.maxwellOverlay
    },
    hydroAtmosphere: {
      backend: planetState.solverRuntime?.hydroAtmosphere?.lastResult?.backend,
      overlay: planetState.hydroAtmosphereOverlay,
      packet: packet.upward?.aggregateState?.hydroAtmosphere
    },
    radiationOpacity: {
      backend: planetState.solverRuntime?.radiationOpacity?.lastResult?.backend,
      overlay: planetState.radiationOpacityOverlay,
      packet: packet.upward?.aggregateState?.radiationOpacity
    },
    reactiveThermal: {
      backend: surfaceState.solverRuntime?.reactiveThermal?.lastResult?.backend,
      packet: packet.upward?.aggregateState?.reactiveCell
    },
    sphMaterial: {
      backend: packet.upward?.aggregateState?.sphMaterial?.backend
        || surfaceState.solverRuntime?.sphMaterial?.lastResult?.backend,
      overlay: surfaceState.sphMaterialOverlay,
      packet: packet.upward?.aggregateState?.sphMaterial
    },
    membraneShell: {
      backend: surfaceState.solverRuntime?.membraneShell?.lastResult?.backend,
      runtime: surfaceState.solverRuntime?.membraneShell?.lastResult,
      packet: packet.upward?.aggregateState?.membraneShell
    },
    combustionPlume: {
      backend: surfaceState.solverRuntime?.combustionPlume?.lastResult?.backend,
      overlay: surfaceState.combustionPlumeOverlay,
      packet: packet.upward?.aggregateState?.combustionPlume
    },
    closures: packet.upward?.closures,
    closureResults: packet.upward?.closureResults,
    sourceEquation: packet.sourceEquation,
    sourceTransfer: packet.sourceTransfer,
    sourceTransferApplication: packet.sourceTransferApplication,
    sourceTransferTransaction: packet.sourceTransferTransaction,
    sourceTransferTargetPreview: packet.sourceTransferTargetPreview,
    sourceTransferTargetMutatorRegistry: packet.sourceTransferTargetMutatorRegistry,
    sourceTransferTargetMutationPreflight: packet.sourceTransferTargetMutationPreflight,
    sourceTransferTargetMutationOperationPlan: packet.sourceTransferTargetMutationOperationPlan,
    sourceTransferTargetMutationInvariantCheck: packet.sourceTransferTargetMutationInvariantCheck,
    sourceTransferTargetMutationCommit: packet.sourceTransferTargetMutationCommit,
    sourceTransferTargetMutationDispatch: packet.sourceTransferTargetMutationDispatch,
    sourceTransferTargetMutationApplyValidation: packet.sourceTransferTargetMutationApplyValidation,
    sourceTransferTargetMutationApplyExecution: packet.sourceTransferTargetMutationApplyExecution,
    sourceTransferTargetSourceIntake: packet.sourceTransferTargetSourceIntake,
    sourceTransferTargetSourceResponse: packet.sourceTransferTargetSourceResponse,
    sourceTransferTargetSourceReconciliation: packet.sourceTransferTargetSourceReconciliation,
    conservation: packet.conservation,
    rupture: {
      spillImpulse: rupturePacket.upward?.aggregateState?.spillImpulse,
      spillReleasedKg: rupturePacket.upward?.aggregateState?.spillReleasedKg,
      sphSpillImpulse: rupturePacket.upward?.aggregateState?.sphMaterial?.spillImpulse,
      sphFireContactFraction: rupturePacket.upward?.aggregateState?.sphMaterial?.fireContactFraction,
      sphGroundContactFraction: rupturePacket.upward?.aggregateState?.sphMaterial?.groundContactFraction,
      runtimeSpillImpulse: ruptureState.solverRuntime?.sphMaterial?.lastResult?.spillImpulse,
      conservationSpillImpulse: rupturePacket.conservation?.exchange?.sphSpillImpulse
    },
    conservationState: surfaceState.conservationState,
    sourceSinkBalanceState: surfaceState.sourceSinkBalanceState,
    sourceTransferState: surfaceState.sourceTransferState,
    sourceTransferApplicationState: surfaceState.sourceTransferApplicationState,
    sourceTransferTransactionState: surfaceState.sourceTransferTransactionState,
    sourceTransferTargetPreviewState: surfaceState.sourceTransferTargetPreviewState,
    sourceTransferTargetMutatorRegistryState: surfaceState.sourceTransferTargetMutatorRegistryState,
    sourceTransferTargetMutationPreflightState: surfaceState.sourceTransferTargetMutationPreflightState,
    sourceTransferTargetMutationOperationPlanState: surfaceState.sourceTransferTargetMutationOperationPlanState,
    sourceTransferTargetMutationInvariantCheckState: surfaceState.sourceTransferTargetMutationInvariantCheckState,
    sourceTransferTargetMutationCommitState: surfaceState.sourceTransferTargetMutationCommitState,
    sourceTransferTargetMutationDispatchState: surfaceState.sourceTransferTargetMutationDispatchState,
    sourceTransferTargetMutationApplyValidationState: surfaceState.sourceTransferTargetMutationApplyValidationState,
    sourceTransferTargetMutationApplyExecutionState: surfaceState.sourceTransferTargetMutationApplyExecutionState,
    closureState: surfaceState.closureState,
    visualReference: {
      supergalactic: supergalacticState.visualReference,
      planet: planetState.visualReference,
      surface: surfaceState.visualReference,
      molecular: molecularState.visualReference
    },
    apiStatus,
    sourceBufferApplicationApi,
    remotePlacementApi,
    remoteSolverPlacementApi,
    loopbackRemotePlacementApi,
    loopbackRemoteSolverPlacementApi,
    resizeRemap,
    workerResize,
    environmentApi,
    hudApi,
    mobileOutputApi,
    solverGovernor: surfaceState.solverGovernor,
    lowerScaleRefinement: surfaceState.lowerScaleRefinement,
    layerSamples,
    genericSnapshotSamples,
    warmDeltaCount: surfaceState.solverState?.warmDeltaCount,
    screenshots: [supergalacticScreenshot, planetScreenshot, solarScreenshot, galacticScreenshot, molecularScreenshot, surfaceScreenshot],
    consoleMessages: consoleMessages.slice(0, 8)
  };

  if (summary.solverCount < 15) {
    throw new Error(`Expected at least 15 registered solvers, saw ${summary.solverCount}`);
  }
  const visibleGenericSnapshots = summary.genericSnapshotSamples
    .filter((sample) => sample.snapshot?.visible === true);
  if (visibleGenericSnapshots.length > 0) {
    throw new Error(`Generic ladder snapshot overlay should stay hidden on every scale: ${JSON.stringify(visibleGenericSnapshots)}`);
  }
  const residentGenericSnapshots = summary.genericSnapshotSamples
    .filter((sample) => sample.snapshot?.geometryResident !== false
      || sample.snapshot?.hiddenByPolicy !== true
      || sample.snapshot?.capacity !== 0);
  if (residentGenericSnapshots.length > 0) {
    throw new Error(`Generic ladder snapshot overlay should be policy-disabled without resident scene geometry or render capacity: ${JSON.stringify(residentGenericSnapshots)}`);
  }
  if (summary.visualReference.supergalactic?.activeReference?.sourceDemo !== 'universes') {
    throw new Error(`Expected supergalactic visual reference to follow Universes, saw ${summary.visualReference.supergalactic?.activeReference?.sourceDemo}`);
  }
  if (summary.visualReference.planet?.activeReference?.sourceDemo !== 'planetgen') {
    throw new Error(`Expected planet visual reference to follow PlanetGen, saw ${summary.visualReference.planet?.activeReference?.sourceDemo}`);
  }
  if (!/webgpuphys/.test(summary.visualReference.surface?.activeReference?.sourceDemo || '')) {
    throw new Error(`Expected surface visual reference to include WebGPU Phys dynamics, saw ${summary.visualReference.surface?.activeReference?.sourceDemo}`);
  }
  if (summary.visualReference.molecular?.activeReference?.bottomUpPriority !== 'base-layer') {
    throw new Error(`Expected molecular visual reference to be base-layer priority, saw ${summary.visualReference.molecular?.activeReference?.bottomUpPriority}`);
  }
  if (summary.visualReference.surface?.zoomContinuity?.policy !== 'seamless-scale-ladder-camera-lerp-v0') {
    throw new Error(`Expected zoom continuity policy in state, saw ${summary.visualReference.surface?.zoomContinuity?.policy}`);
  }
  if (!Array.isArray(summary.visualReference.surface?.scaleReferences) || summary.visualReference.surface.scaleReferences.length !== LAYER_IDS.length) {
    throw new Error('Expected visual reference state to include every ladder layer');
  }
  if (summary.apiStatus.visualReference?.schema !== 'peercompute.multiscale.visual-reference.v0') {
    throw new Error(`Expected visual reference schema through getState, saw ${summary.apiStatus.visualReference?.schema}`);
  }
  if (summary.apiStatus.runtimeDebugVisualReference?.schema !== 'peercompute.multiscale.visual-reference.v0') {
    throw new Error(`Expected visual reference schema through runtime debug, saw ${summary.apiStatus.runtimeDebugVisualReference?.schema}`);
  }
  if (!summary.cosmologyExpansion.overlay?.visible) {
    throw new Error('Cosmology expansion overlay did not become visible');
  }
  if (!summary.cosmologyExpansion.backend) {
    throw new Error('Cosmology expansion runtime backend missing');
  }
  if (!summary.cosmologyExpansion.packet?.backend) {
    throw new Error('Cosmology expansion packet state missing backend');
  }
  for (const key of ['sampleCount', 'scaleFactor', 'hubbleRate', 'filamentEnergy', 'structureGrowthProxy', 'voidFraction', 'expansionWorkProxy', 'expansionEnergyDelta']) {
    if (!Number.isFinite(summary.cosmologyExpansion.packet?.[key])) {
      throw new Error(`Cosmology expansion packet missing finite ${key}`);
    }
  }
  for (const key of ['cosmologyScaleFactor', 'cosmologyHubbleRate', 'cosmologyFilamentEnergy', 'cosmologyStructureGrowth', 'cosmologyVoidFraction', 'cosmologyExpansionWork']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Cosmology expansion closure missing finite ${key}`);
    }
  }
  if (!summary.molecularDynamics.overlay?.visible) {
    throw new Error('Molecular dynamics overlay did not become visible');
  }
  if (!summary.molecularDynamics.backend) {
    throw new Error('Molecular dynamics runtime backend missing');
  }
  if (summary.molecularDynamics.backend !== 'webgpu-molecular-dynamics') {
    throw new Error(`Molecular dynamics visual smoke expected WebGPU backend, saw ${summary.molecularDynamics.backend}`);
  }
  if (!summary.molecularDynamics.packet?.backend) {
    throw new Error('Molecular dynamics packet state missing backend');
  }
  for (const key of ['atomCount', 'bondCount', 'meanBondOrder', 'reactionProgress', 'heatReleaseProxy', 'meanTemperatureK', 'totalCharge', 'ionizationFraction', 'dipoleMomentProxy', 'electricalConductivityProxy', 'valenceSaturation', 'energyDelta', 'quantumEvolutionDrive', 'quantumWavefunctionEvolutionNormDrift', 'quantumWavefunctionEvolutionFieldEnergyExpectationEv', 'quantumWavefunctionEvolutionElectricFieldVm', 'quantumWavefunctionEvolutionDipoleMomentZBohrElectron', 'quantumWavefunctionEvolutionPolarizabilityProxyBohr3', 'quantumStatisticalBridgePartitionFunctionLog', 'quantumStatisticalBridgeExcitedOccupation', 'quantumStatisticalBridgeFreeEnergyEv', 'quantumStatisticalBridgeHeatCapacityProxy', 'quantumStatisticalBridgeIonizationFraction', 'quantumStatisticalBridgeOpacityPopulationProxy', 'quantumStatisticalBridgeDegeneracyParameter', 'quantumStatisticalBridgeEnsemblePressurePa', 'quantumStatisticalBridgeTemperatureDeltaKProxy', 'quantumStatisticalBridgeChargeDeltaProxy', 'quantumStatisticalBridgeThermalDampingScale', 'quantumStatisticalBridgeDrive', 'chargeEquilibrationResidualRms', 'chargeEquilibrationChargeRmsDelta', 'chargeEquilibrationNeutralizationResidualCharge', 'forceFieldTotalEnergyProxy', 'forceFieldPotentialEnergyProxy', 'forceFieldElectrostaticEnergyProxy', 'forceFieldRepulsionEnergyProxy', 'forceFieldQeqResidualPenaltyProxy', 'waterGeometryTripletCount', 'waterGeometryMeanAngleDeg', 'waterGeometryMeanAbsAngleErrorDeg', 'waterGeometryRmsAngleErrorDeg', 'waterGeometryMeanOhDistanceReducedNm', 'waterGeometryMeanHhDistanceReducedNm', 'waterGeometryClosureFraction', 'waterGeometryEnergyProxy', 'phaseChangeRateProxy', 'latentHeatSinkProxy', 'latentHeatReleaseProxy', 'solidFraction', 'liquidFraction', 'vaporFraction', 'plasmaFraction', 'waterMoleculeFraction', 'specificFreeEnergyProxy', 'specificEnthalpyProxy', 'phaseEnergyRateProxy', 'phaseStabilityResidualProxy', 'sourceTemperatureDeltaKProxy']) {
    if (!Number.isFinite(summary.molecularDynamics.packet?.[key])) {
      throw new Error(`Molecular dynamics packet missing finite ${key}`);
    }
  }
  for (const key of ['reactiveMolecularPhaseDrive', 'reactiveMolecularPhaseHeatingDrive', 'reactiveMolecularPhaseCoolingDrive', 'reactiveMolecularLatentHeatSinkProxy', 'reactiveMolecularLatentHeatReleaseProxy', 'reactiveMolecularPhaseEosEnergyRateProxy', 'reactiveMolecularPhaseEosStabilityResidual', 'reactiveMolecularPhaseEosFreeEnergyProxy', 'sphMolecularPhaseDrive', 'sphMolecularPhaseHeatingDrive', 'sphMolecularPhaseCoolingDrive', 'sphMolecularLatentHeatSinkProxy', 'sphMolecularLatentHeatReleaseProxy', 'sphMolecularPhaseEosEnergyRateProxy', 'sphMolecularPhaseEosStabilityResidual', 'sphMolecularPhaseEosFreeEnergyProxy']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Cross-scale molecular phase closure missing finite ${key}`);
    }
  }
  for (const [label, packetState] of [
    ['reactive', summary.reactiveThermal.packet],
    ['sph', summary.sphMaterial.packet]
  ]) {
    for (const key of ['molecularPhaseDriveProxy', 'molecularPhaseHeatingDrive', 'molecularPhaseCoolingDrive', 'molecularLatentHeatSinkProxy', 'molecularLatentHeatReleaseProxy', 'molecularPhaseEosSpecificFreeEnergyProxy', 'molecularPhaseEosEnergyRateProxy', 'molecularPhaseEosStabilityResidualProxy']) {
      if (!Number.isFinite(packetState?.[key])) {
        throw new Error(`${label} packet missing finite molecular phase field ${key}: ${JSON.stringify(packetState)}`);
      }
    }
  }
  if (summary.molecularDynamics.packet?.forceEnergyLedger?.schema !== 'peercompute.multiscale.molecular-force-energy-ledger.v0') {
    throw new Error(`Molecular dynamics packet missing force-energy ledger: ${JSON.stringify(summary.molecularDynamics.packet?.forceEnergyLedger)}`);
  }
  const productTopologyOverlayApplied = summary.molecularDynamics.packet?.quantumMaterialReactionProductTopologyOverlayApplied === true
    && summary.molecularDynamics.packet?.quantumMaterialReactionProductTopologySchema === QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA
    && summary.molecularDynamics.packet?.quantumMaterialReactionProductTopologyOverlayBondCount >= 2
    && summary.molecularDynamics.packet?.quantumMaterialReactionProductTopologyNaohMoleculeCount >= 1
    && (summary.molecularDynamics.packet?.quantumMaterialReactionProductTopologyH2MoleculeCount >= 1
      || summary.molecularDynamics.packet?.quantumMaterialReactionProductTopologyPartialHydrogenSiteCount >= 1);
  const qmatWaterGeometryGuardApplied = summary.molecularDynamics.packet?.quantumMaterialReactionBarrierSurfaceApplied === true
    || summary.molecularDynamics.packet?.quantumMaterialReactionProductSourceApplied === true
    || summary.molecularDynamics.packet?.quantumMaterialReactionProductTopologyRequired === true
    || (summary.molecularDynamics.packet?.waterGeometrySourceApplied === true
      && summary.molecularDynamics.packet?.waterGeometrySourceSchema === QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  const minimumWaterTriplets = productTopologyOverlayApplied || qmatWaterGeometryGuardApplied ? 4 : 5;
  const waterGeometryLawAttached = summary.molecularDynamics.packet?.molecularGeometryForceLawSchema === MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA
    && summary.molecularDynamics.packet?.molecularGeometryForceLaw?.schema === MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA
    && summary.molecularDynamics.packet?.forceEnergyLedger?.geometryForceLaw?.schema === MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA;
  if (!waterGeometryLawAttached) {
    throw new Error(`Molecular dynamics packet missing water geometry law: ${JSON.stringify(summary.molecularDynamics.packet)}`);
  }
  const waterGeometryIntact = summary.molecularDynamics.packet?.waterGeometryTripletCount >= minimumWaterTriplets
    && summary.molecularDynamics.packet?.waterGeometryClosureFraction >= 0.8
    && Math.abs((summary.molecularDynamics.packet?.waterGeometryMeanAngleDeg ?? 0) - 104.52) <= 16;
  const phaseDisruptedWaterGeometry = summary.molecularDynamics.packet?.phaseRegime === 'plasma'
    || Number(summary.molecularDynamics.packet?.plasmaFraction || 0) > 0.25
    || Number(summary.molecularDynamics.packet?.waterMoleculeFraction ?? 1) < 0.5;
  if (!waterGeometryIntact && !phaseDisruptedWaterGeometry) {
    throw new Error(`Molecular dynamics packet missing stable water geometry law: ${JSON.stringify(summary.molecularDynamics.packet)}`);
  }
  if (summary.molecularDynamics.packet?.quantumMaterialSourceApplied === true
    && (summary.molecularDynamics.packet?.waterGeometrySourceApplied !== true
      || summary.molecularDynamics.packet?.waterGeometrySourceSchema !== QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA
      || summary.molecularDynamics.packet?.quantumMaterialGeometrySourceSchema !== QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA
      || summary.molecularDynamics.packet?.waterGeometryTargetSource !== 'quantum-material-molecular-geometry-source')) {
    throw new Error(`Molecular qmat packet missing geometry-source handoff: ${JSON.stringify(summary.molecularDynamics.packet)}`);
  }
	  if (summary.molecularDynamics.packet?.quantumMaterialSourceApplied === true
	    && (summary.molecularDynamics.packet?.quantumMaterialElectronicChargeSourceApplied !== true
	      || summary.molecularDynamics.packet?.quantumMaterialElectronicChargeSourceSchema !== QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA
      || !Number.isFinite(summary.molecularDynamics.packet?.quantumMaterialElectronicChargeDeltaProxy)
      || !Number.isFinite(summary.molecularDynamics.packet?.quantumMaterialElectronicIonizationDriveProxy)
	      || !Number.isFinite(summary.molecularDynamics.packet?.quantumMaterialElectronicQeqMixProxy))) {
	    throw new Error(`Molecular qmat packet missing electronic charge-source handoff: ${JSON.stringify(summary.molecularDynamics.packet)}`);
	  }
	  if (summary.molecularDynamics.packet?.quantumMaterialSourceApplied === true
	    && (summary.molecularDynamics.packet?.quantumMaterialReactionBarrierSurfaceApplied !== true
	      || summary.molecularDynamics.packet?.quantumMaterialReactionBarrierSurfaceSchema !== QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA
	      || !Number.isFinite(summary.molecularDynamics.packet?.quantumMaterialReactionBarrierActivationEnergyEvProxy)
	      || !Number.isFinite(summary.molecularDynamics.packet?.quantumMaterialReactionBarrierGateDampingScale)
	      || !Number.isFinite(summary.molecularDynamics.packet?.quantumMaterialReactionBarrierGateProxy)
	      || !Number.isFinite(summary.molecularDynamics.packet?.reactionBarrierGatedCandidateCount))) {
	    throw new Error(`Molecular qmat packet missing reaction-barrier handoff: ${JSON.stringify(summary.molecularDynamics.packet)}`);
	  }
  if (summary.molecularDynamics.packet?.thermoPhaseLedger?.schema !== 'peercompute.multiscale.molecular-thermo-phase-ledger.v0') {
    throw new Error(`Molecular dynamics packet missing thermo-phase ledger: ${JSON.stringify(summary.molecularDynamics.packet?.thermoPhaseLedger)}`);
  }
  const molecularPhaseTotal = (summary.molecularDynamics.packet.solidFraction || 0)
    + (summary.molecularDynamics.packet.liquidFraction || 0)
    + (summary.molecularDynamics.packet.vaporFraction || 0)
    + (summary.molecularDynamics.packet.plasmaFraction || 0);
  if (Math.abs(molecularPhaseTotal - 1) > 0.02) {
    throw new Error(`Molecular phase fractions do not sum to unity: ${JSON.stringify(summary.molecularDynamics.packet?.thermoPhaseLedger)}`);
  }
  if (summary.molecularDynamics.packet?.chargeEquilibration?.schema !== 'peercompute.multiscale.molecular-charge-equilibration.v0') {
    throw new Error(`Molecular dynamics packet missing QEq charge-equilibration report: ${JSON.stringify(summary.molecularDynamics.packet?.chargeEquilibration)}`);
  }
  if (Math.abs(summary.molecularDynamics.packet.chargeEquilibration.neutralizationResidualCharge ?? 0) > 1e-5) {
    throw new Error(`Molecular dynamics packet QEq neutralization residual is too high: ${JSON.stringify(summary.molecularDynamics.packet.chargeEquilibration)}`);
  }
  if (summary.molecularDynamics.packet.atomCount < 3 || summary.molecularDynamics.packet.bondCount < 1) {
    throw new Error(`Molecular dynamics did not produce visible atoms/bonds: ${JSON.stringify(summary.molecularDynamics.packet)}`);
  }
  if (summary.molecularDynamics.recipe?.atomCount !== 15 || summary.molecularDynamics.recipe?.composition?.O !== 5 || summary.molecularDynamics.recipe?.composition?.H !== 10) {
    throw new Error(`Molecular recipe API did not retain H10 O5 composition: ${JSON.stringify(summary.molecularDynamics.recipe)}`);
  }
  if (summary.molecularDynamics.recipePacket?.atomCount !== 15 || summary.molecularDynamics.recipePacket?.bondCount < 10) {
    throw new Error(`Molecular water recipe did not propagate to packet state: ${JSON.stringify(summary.molecularDynamics.recipePacket)}`);
  }
  if (summary.molecularDynamics.recipePacket?.molecularGeometryForceLawSchema !== MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA
    || summary.molecularDynamics.recipePacket?.waterGeometryTripletCount !== 5
    || summary.molecularDynamics.recipePacket?.waterGeometryMeanAbsAngleErrorDeg > 16) {
    throw new Error(`Molecular water recipe did not retain H-O-H geometry telemetry: ${JSON.stringify(summary.molecularDynamics.recipePacket)}`);
  }
  if (summary.molecularDynamics.append?.atomCount !== 17
    || summary.molecularDynamics.append?.composition?.Na !== 1
    || summary.molecularDynamics.append?.composition?.Cl !== 1) {
    throw new Error(`Molecular append API did not retain appended NaCl composition: ${JSON.stringify(summary.molecularDynamics.append)}`);
  }
  if (summary.molecularDynamics.appendPacket?.atomCount !== 17 || summary.molecularDynamics.appendPacket?.bondCount < 11) {
    throw new Error(`Molecular append API did not propagate NaCl pair to packet state: ${JSON.stringify(summary.molecularDynamics.appendPacket)}`);
  }
  if (summary.molecularDynamics.appendPacket?.ionicBondCount < 1) {
    throw new Error(`Molecular append packet did not classify NaCl ionic bond: ${JSON.stringify(summary.molecularDynamics.appendPacket)}`);
  }
  if (summary.molecularDynamics.appendPacket?.species?.Na !== 1 || summary.molecularDynamics.appendPacket?.species?.Cl !== 1) {
    throw new Error(`Molecular append packet did not retain appended species counts: ${JSON.stringify(summary.molecularDynamics.appendPacket?.species)}`);
  }
  if (!summary.molecularDynamics.readoutText?.includes('molecular electrical')
    || !summary.molecularDynamics.readoutText?.includes('molecular bonds')
    || !summary.molecularDynamics.readoutText?.includes('molecular energy')
    || !summary.molecularDynamics.readoutText?.includes('molecular geometry')
    || !summary.molecularDynamics.readoutText?.includes('molecular phase')
    || !summary.molecularDynamics.readoutText?.includes('molecular balance')
    || !summary.molecularDynamics.readoutText?.includes('molecular equation')
	    || !summary.molecularDynamics.readoutText?.includes('molecular transfer')
	    || !summary.molecularDynamics.readoutText?.includes('molecular qeq')
	    || !summary.molecularDynamics.readoutText?.includes('qmat electronic')
	    || !summary.molecularDynamics.readoutText?.includes('qmat barrier')
	    || !summary.molecularDynamics.readoutText?.includes('molecular quantum')
    || !summary.molecularDynamics.readoutText?.includes('molecular qgrid stat')
    || !summary.molecularDynamics.readoutText?.includes('/ evo')
    || !summary.molecularDynamics.readoutText?.includes('molecular search')
    || (!summary.molecularDynamics.readoutText?.includes('cell-neighbor-list')
      && !summary.molecularDynamics.readoutText?.includes('tiled-workgroup-all-pairs'))
    || !summary.molecularDynamics.readoutText?.includes('cell-list')
    || !summary.molecularDynamics.readoutText?.includes('ionic 1')) {
    throw new Error(`Molecular electrical readout missing expected live telemetry: ${summary.molecularDynamics.readoutText}`);
  }
  if (summary.molecularDynamics.packet?.quantumWavefunctionEvolutionSource !== 'webgpu-worker'
    || summary.molecularDynamics.packet?.quantumWavefunctionEvolutionWebgpuExecuted !== true
    || summary.molecularDynamics.packet?.quantumWavefunctionEvolutionLiveBackendPolicy !== 'webgpu-only-no-cpu-fallback'
    || summary.molecularDynamics.packet?.quantumWavefunctionEvolutionFieldResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0'
    || summary.molecularDynamics.packet?.quantumWavefunctionEvolutionMagneticResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0'
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumWavefunctionEvolutionZeemanEnergyExpectationEv)
    || summary.molecularDynamics.packet?.quantumRadialEigenstateSource !== 'webgpu-worker'
    || summary.molecularDynamics.packet?.quantumRadialEigenstateWebgpuExecuted !== true
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumRadialEigenstateResidualRelativeL2)) {
    throw new Error(`Molecular packet did not retain WebGPU Schrodinger source provenance: ${JSON.stringify(summary.molecularDynamics.packet)}`);
  }
  if (summary.molecularDynamics.packet?.quantumStatisticalBridgeSchema !== QUANTUM_QGRID_STATISTICAL_BRIDGE_SCHEMA
    || summary.molecularDynamics.packet?.quantumStatisticalBridgeSource !== 'webgpu-worker'
    || summary.molecularDynamics.packet?.quantumStatisticalBridgeWebgpuExecuted !== true
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumStatisticalBridgePartitionFunctionLog)
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumStatisticalBridgeHeatCapacityProxy)
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumStatisticalBridgeIonizationFraction)
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumStatisticalBridgeTemperatureDeltaKProxy)
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumStatisticalBridgeChargeDeltaProxy)
    || !Number.isFinite(summary.molecularDynamics.packet?.quantumStatisticalBridgeDrive)) {
    throw new Error(`Molecular packet missing qgrid statistical bridge handoff: ${JSON.stringify(summary.molecularDynamics.packet)}`);
  }
  if (summary.molecularDynamics.runtime?.quantumWavefunctionEvolutionSource !== 'webgpu-worker'
    || summary.molecularDynamics.runtime?.quantumWavefunctionEvolutionWebgpuExecuted !== true
    || summary.molecularDynamics.runtime?.quantumWavefunctionEvolutionFieldResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0'
    || summary.molecularDynamics.runtime?.quantumWavefunctionEvolutionMagneticResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0'
    || !Number.isFinite(summary.molecularDynamics.runtime?.quantumWavefunctionEvolutionZeemanEnergyExpectationEv)
    || summary.molecularDynamics.runtime?.quantumRadialEigenstateSource !== 'webgpu-worker'
    || summary.molecularDynamics.runtime?.quantumRadialEigenstateWebgpuExecuted !== true) {
    throw new Error(`Molecular runtime did not retain WebGPU Schrodinger source provenance: ${JSON.stringify(summary.molecularDynamics.runtime)}`);
  }
  const molecularRuntimeQgridStatBridge = summary.molecularDynamics.runtime?.quantumCouplingApplication?.coupling
    || summary.molecularDynamics.runtime?.quantumCouplingApplication
    || summary.molecularDynamics.runtime;
  if (molecularRuntimeQgridStatBridge?.statisticalBridgeSchema !== QUANTUM_QGRID_STATISTICAL_BRIDGE_SCHEMA
    || molecularRuntimeQgridStatBridge?.statisticalBridgeSource !== 'webgpu-worker'
    || molecularRuntimeQgridStatBridge?.statisticalBridgeWebgpuExecuted !== true
    || !Number.isFinite(molecularRuntimeQgridStatBridge?.statisticalBridgeHeatCapacityProxy)
    || !Number.isFinite(molecularRuntimeQgridStatBridge?.statisticalBridgeDrive)) {
    throw new Error(`Molecular runtime missing qgrid statistical bridge handoff: ${JSON.stringify(summary.molecularDynamics.runtime)}`);
  }
  const molecularKernel = summary.molecularDynamics.runtime?.webgpuStatus?.kernelMode;
  if (!['cell-neighbor-list', 'tiled-workgroup-all-pairs'].includes(molecularKernel)) {
    throw new Error(`Molecular WebGPU kernel mode missing: ${JSON.stringify(summary.molecularDynamics.runtime?.webgpuStatus)}`);
  }
  if (molecularKernel === 'cell-neighbor-list') {
    const status = summary.molecularDynamics.runtime.webgpuStatus;
    for (const key of ['neighborCapacity', 'cellCount', 'maxCellOccupancy', 'maxNeighborsPerAtom', 'candidatePairCount', 'acceptedNeighborPairCount', 'overflowAtoms', 'overflowCells', 'cellSize', 'gridOrigin', 'gridExtent']) {
      if (!Number.isFinite(status[key])) {
        throw new Error(`Molecular neighbor-list WebGPU status missing finite ${key}: ${JSON.stringify(status)}`);
      }
    }
    if (typeof status.dynamicBounds !== 'boolean') {
      throw new Error(`Molecular neighbor-list WebGPU status missing dynamic bounds flag: ${JSON.stringify(status)}`);
    }
    if (status.neighborListMode !== 'active' || status.acceptedNeighborPairCount <= 0 || status.overflowAtoms !== 0 || status.overflowCells !== 0) {
      throw new Error(`Molecular neighbor-list WebGPU status not active/healthy: ${JSON.stringify(status)}`);
    }
    if (summary.molecularDynamics.packet?.webgpuKernelMode !== 'cell-neighbor-list'
      || summary.molecularDynamics.packet?.webgpuNeighborListMode !== 'active'
      || summary.molecularDynamics.packet?.webgpuAcceptedNeighborPairCount <= 0
      || summary.molecularDynamics.packet?.webgpuOverflowAtoms !== 0
      || summary.molecularDynamics.packet?.webgpuOverflowCells !== 0) {
      throw new Error(`Molecular packet missing active neighbor-list telemetry: ${JSON.stringify(summary.molecularDynamics.packet)}`);
    }
    const loadEntry = summary.molecularDynamics.solverLoadEntry;
    if (!loadEntry
      || loadEntry.neighborListMode !== 'active'
      || loadEntry.acceptedNeighborPairCount <= 0
      || loadEntry.webgpuCandidatePairCount <= 0
      || loadEntry.webgpuNeighborCapacity <= 0
      || !Number.isFinite(loadEntry.webgpuNeighborCapacityUsage)
      || loadEntry.webgpuNeighborCapacityUsage <= 0
      || !Number.isFinite(loadEntry.molecularPairPressure)
      || loadEntry.molecularPairPressure <= 0
      || loadEntry.molecularOverflowPressure !== 0) {
      throw new Error(`Solver-load molecular entry missing WebGPU neighbor pressure telemetry: ${JSON.stringify(loadEntry)}`);
    }
  }
  if (summary.molecularDynamics.appendPacket?.pairSearchMode !== 'cell-list'
    || summary.molecularDynamics.appendPacket?.neighborCandidatePairCount <= 0
    || summary.molecularDynamics.appendPacket?.spatialCellCount <= 0) {
    throw new Error(`Molecular append packet missing spatial search telemetry: ${JSON.stringify(summary.molecularDynamics.appendPacket)}`);
  }
  for (const key of ['molecularAtomCount', 'molecularBondCount', 'molecularMeanBondOrder', 'molecularHeatReleaseProxy', 'molecularMeanTemperatureK', 'molecularIonizationFraction', 'molecularChargeDrift', 'molecularQuantumEvolutionDrive', 'molecularQuantumWavefunctionNormDrift']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Molecular dynamics closure missing finite ${key}`);
    }
  }
  if (summary.quantumOrbital.packet?.schema !== 'peercompute.multiscale.quantum-orbital-closure.v0') {
    throw new Error(`Quantum orbital packet missing schema: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (summary.quantumOrbital.packet?.elementSymbol !== 'O'
    || summary.quantumOrbital.packet?.activeOrbital !== '2p'
    || summary.quantumOrbital.packet?.electronConfiguration !== '1s2 2s2 2p4') {
    throw new Error(`Quantum orbital packet missing oxygen 2p shell basis: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (summary.quantumOrbital.packet?.bondingTendency !== 'polar-covalent-acceptor') {
    throw new Error(`Quantum orbital oxygen bonding tendency regressed: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (summary.quantumOrbital.packet?.finiteGridSchema !== 'peercompute.multiscale.quantum-orbital-finite-grid.v0'
    || !QUANTUM_GRID_BACKENDS.has(summary.quantumOrbital.packet?.finiteGridBackend)) {
    throw new Error(`Quantum orbital finite-grid summary missing: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (!QUANTUM_EIGEN_RESIDUAL_SCHEMAS.has(summary.quantumOrbital.packet?.finiteGridEigenResidualSchema)) {
    throw new Error(`Quantum orbital eigen residual missing: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (!QUANTUM_WAVEFUNCTION_EVOLUTION_SCHEMAS.has(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionSchema)) {
    throw new Error(`Quantum orbital wavefunction evolution missing: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (String(summary.quantumOrbital.packet?.finiteGridBackend || '').startsWith('webgpu')
    && (summary.quantumOrbital.packet?.finiteGridEigenResidualWebgpuSchema !== 'peercompute.multiscale.quantum-orbital-grid.eigen-residual-webgpu.v0'
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridEigenResidualWebgpuRelativeL2)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridEigenResidualWebgpuWeightedMeanEv))) {
    throw new Error(`Quantum orbital packet missing WebGPU eigen residual: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (String(summary.quantumOrbital.packet?.finiteGridBackend || '').startsWith('webgpu')
    && (summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuSchema !== 'peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0'
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuNormDrift)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuDensityDriftL1)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuEnergyExpectationEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuKineticExpectationEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuPotentialExpectationEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuFieldEnergyExpectationEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuElectricFieldVm)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuDipoleMomentZBohrElectron)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuPolarizabilityProxyBohr3)
      || summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuFieldResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0'
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuMagneticFieldT)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuZeemanEnergyExpectationEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuMagneticMomentProjectionBohrMagneton)
      || summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuMagneticResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0'
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuVirialResidualEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuHamiltonianComponentResidualEv)
      || summary.quantumOrbital.packet?.finiteGridWavefunctionEvolutionWebgpuHamiltonianComponentsSchema !== 'peercompute.multiscale.quantum-orbital-grid.hamiltonian-components-webgpu.v0')) {
    throw new Error(`Quantum orbital packet missing WebGPU wavefunction evolution: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (String(summary.quantumOrbital.packet?.finiteGridBackend || '').startsWith('webgpu')
    && (summary.quantumOrbital.packet?.finiteGridStatisticalBridgeSchema !== QUANTUM_QGRID_STATISTICAL_BRIDGE_SCHEMA
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgePartitionFunctionLog)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeExcitedOccupation)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeFreeEnergyEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeHeatCapacityProxy)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeIonizationFraction)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeOpacityPopulationProxy)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeDegeneracyParameter)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeEnsemblePressurePa)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeTemperatureDeltaKProxy)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeChargeDeltaProxy)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridStatisticalBridgeThermalDampingScale))) {
    throw new Error(`Quantum orbital packet missing qgrid statistical bridge: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  if (String(summary.quantumOrbital.packet?.finiteGridBackend || '').startsWith('webgpu')
    && (summary.quantumOrbital.packet?.finiteGridRadialEigenstateSchema !== QUANTUM_RADIAL_WEBGPU_SCHEMA
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridRadialEigenstateEnergyEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridRadialEigenstateEnergyErrorEv)
      || !Number.isFinite(summary.quantumOrbital.packet?.finiteGridRadialEigenstateResidualRelativeL2)
      || summary.quantumOrbital.packet?.finiteGridRadialEigenstateGridPointCount <= 0)) {
    throw new Error(`Quantum orbital packet missing WebGPU radial eigensolver telemetry: ${JSON.stringify(summary.quantumOrbital.packet)}`);
  }
  for (const key of ['electronCount', 'valenceElectronCount', 'energyEv', 'zEff', 'ionizationEnergyProxyEv', 'ionizationFraction', 'electronegativityProxy', 'polarizabilityProxy', 'dielectricConstant', 'electricalConductivityProxy', 'finiteGridSampleCount', 'finiteGridNormError', 'finiteGridBoundaryMass', 'finiteGridMeanRadiusBohr', 'finiteGridEigenResidualRelativeL2', 'finiteGridEigenResidualWeightedMeanEv', 'finiteGridWavefunctionEvolutionNormDrift', 'finiteGridWavefunctionEvolutionDensityDriftL1', 'finiteGridWavefunctionEvolutionEnergyExpectationEv', 'finiteGridWavefunctionEvolutionKineticExpectationEv', 'finiteGridWavefunctionEvolutionPotentialExpectationEv', 'finiteGridWavefunctionEvolutionFieldEnergyExpectationEv', 'finiteGridWavefunctionEvolutionElectricFieldVm', 'finiteGridWavefunctionEvolutionDipoleMomentZBohrElectron', 'finiteGridWavefunctionEvolutionPolarizabilityProxyBohr3', 'finiteGridWavefunctionEvolutionMagneticFieldT', 'finiteGridWavefunctionEvolutionZeemanEnergyExpectationEv', 'finiteGridWavefunctionEvolutionMagneticMomentProjectionBohrMagneton', 'finiteGridWavefunctionEvolutionVirialResidualEv', 'finiteGridWavefunctionEvolutionHamiltonianComponentResidualEv', 'finiteGridWavefunctionEvolutionPhaseRotationRad', 'finiteGridRadialEigenstateEnergyEv', 'finiteGridRadialEigenstateEnergyErrorEv', 'finiteGridRadialEigenstateResidualRelativeL2', 'finiteGridStatisticalBridgePartitionFunctionLog', 'finiteGridStatisticalBridgeExcitedOccupation', 'finiteGridStatisticalBridgeFreeEnergyEv', 'finiteGridStatisticalBridgeHeatCapacityProxy', 'finiteGridStatisticalBridgeIonizationFraction', 'finiteGridStatisticalBridgeOpacityPopulationProxy', 'finiteGridStatisticalBridgeDegeneracyParameter', 'finiteGridStatisticalBridgeEnsemblePressurePa', 'finiteGridStatisticalBridgeTemperatureDeltaKProxy', 'finiteGridStatisticalBridgeChargeDeltaProxy', 'finiteGridStatisticalBridgeThermalDampingScale']) {
    if (!Number.isFinite(summary.quantumOrbital.packet?.[key])) {
      throw new Error(`Quantum orbital packet missing finite ${key}: ${JSON.stringify(summary.quantumOrbital.packet)}`);
    }
  }
  const quantumGridNormTolerance = String(summary.quantumOrbital.packet?.finiteGridBackend || '').startsWith('webgpu')
    ? 5e-5
    : 1e-8;
  if (summary.quantumOrbital.packet.finiteGridNormError > quantumGridNormTolerance) {
    throw new Error(`Quantum orbital finite-grid normalization drift too high: ${summary.quantumOrbital.packet.finiteGridNormError}`);
  }
  if (summary.quantumOrbital.runtime?.lastResult?.schema !== 'peercompute.multiscale.quantum-orbital-grid.result.v0'
    || !QUANTUM_GRID_BACKENDS.has(summary.quantumOrbital.runtime?.lastResult?.backend)
    || summary.quantumOrbital.runtime?.lastResult?.finiteGrid?.schema !== 'peercompute.multiscale.quantum-orbital-finite-grid.v0'
    || !QUANTUM_EIGEN_RESIDUAL_SCHEMAS.has(summary.quantumOrbital.runtime?.lastResult?.finiteGrid?.eigenResidual?.schema)
    || !QUANTUM_WAVEFUNCTION_EVOLUTION_SCHEMAS.has(summary.quantumOrbital.runtime?.lastResult?.finiteGrid?.wavefunctionEvolution?.schema)) {
    throw new Error(`Quantum orbital worker did not publish a finite-grid result: ${JSON.stringify(summary.quantumOrbital.runtime)}`);
  }
  if (String(summary.quantumOrbital.runtime?.lastResult?.backend || '').startsWith('webgpu')
    && (!QUANTUM_WEBGPU_KERNELS.has(summary.quantumOrbital.runtime.lastResult.webgpuStatus?.kernelMode)
      || summary.quantumOrbital.runtime.lastResult.liveBackendPolicy !== 'webgpu-only-no-cpu-fallback'
      || summary.quantumOrbital.runtime.lastResult.webgpuStatus?.fallback !== false)) {
    throw new Error(`Quantum orbital WebGPU path missing no-fallback runtime telemetry: ${JSON.stringify(summary.quantumOrbital.runtime.lastResult)}`);
  }
  if (String(summary.quantumOrbital.runtime?.lastResult?.backend || '').startsWith('webgpu')) {
    const webgpuResidual = summary.quantumOrbital.runtime.lastResult.finiteGrid?.eigenResidualWebgpu;
    if (webgpuResidual?.schema !== 'peercompute.multiscale.quantum-orbital-grid.eigen-residual-webgpu.v0'
      || !Number.isFinite(webgpuResidual.relativeL2)
      || !Number.isFinite(webgpuResidual.weightedMeanResidualEv)) {
      throw new Error(`Quantum orbital WebGPU eigen residual missing: ${JSON.stringify(summary.quantumOrbital.runtime.lastResult.finiteGrid)}`);
    }
    const webgpuEvolution = summary.quantumOrbital.runtime.lastResult.finiteGrid?.wavefunctionEvolutionWebgpu;
    if (webgpuEvolution?.schema !== 'peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0'
      || !Number.isFinite(webgpuEvolution.normDrift)
      || !Number.isFinite(webgpuEvolution.densityDriftL1)
      || !Number.isFinite(webgpuEvolution.energyExpectationEv)
      || !Number.isFinite(webgpuEvolution.kineticExpectationEv)
      || !Number.isFinite(webgpuEvolution.potentialExpectationEv)
      || !Number.isFinite(webgpuEvolution.fieldEnergyExpectationEv)
      || !Number.isFinite(webgpuEvolution.electricFieldVm)
      || !Number.isFinite(webgpuEvolution.dipoleMomentZBohrElectron)
      || !Number.isFinite(webgpuEvolution.polarizabilityProxyBohr3)
      || webgpuEvolution.fieldResponse?.schema !== 'peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0'
      || !Number.isFinite(webgpuEvolution.magneticFieldT)
      || !Number.isFinite(webgpuEvolution.zeemanEnergyExpectationEv)
      || !Number.isFinite(webgpuEvolution.magneticMomentProjectionBohrMagneton)
      || webgpuEvolution.magneticResponse?.schema !== 'peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0'
      || !Number.isFinite(webgpuEvolution.virialResidualEv)
      || !Number.isFinite(webgpuEvolution.hamiltonianComponentResidualEv)
      || webgpuEvolution.hamiltonianComponents?.schema !== 'peercompute.multiscale.quantum-orbital-grid.hamiltonian-components-webgpu.v0') {
      throw new Error(`Quantum orbital WebGPU wavefunction evolution missing: ${JSON.stringify(summary.quantumOrbital.runtime.lastResult.finiteGrid)}`);
    }
    const statisticalBridge = summary.quantumOrbital.runtime.lastResult.finiteGrid?.statisticalBridge;
    if (statisticalBridge?.schema !== QUANTUM_QGRID_STATISTICAL_BRIDGE_SCHEMA
      || !Number.isFinite(statisticalBridge.partitionFunctionLog)
      || !Number.isFinite(statisticalBridge.heatCapacityProxy)
      || !Number.isFinite(statisticalBridge.ionizationFraction)
      || !Number.isFinite(statisticalBridge.sourceTerms?.temperatureDeltaKProxy)
      || !Number.isFinite(statisticalBridge.sourceTerms?.chargeDeltaProxy)) {
      throw new Error(`Quantum orbital WebGPU statistical bridge missing: ${JSON.stringify(summary.quantumOrbital.runtime.lastResult.finiteGrid)}`);
    }
    const radialEigenstate = summary.quantumOrbital.runtime.lastResult.finiteGrid?.radialEigenstate;
    if (radialEigenstate?.schema !== QUANTUM_RADIAL_WEBGPU_SCHEMA
      || !Number.isFinite(radialEigenstate.energyEv)
      || !Number.isFinite(radialEigenstate.energyErrorEv)
      || !Number.isFinite(radialEigenstate.residualRelativeL2)
      || radialEigenstate.gridPointCount <= 0
      || summary.quantumOrbital.runtime.lastResult.webgpuStatus?.radialEigenstate?.fallback !== false) {
      throw new Error(`Quantum orbital WebGPU radial eigensolver missing: ${JSON.stringify(summary.quantumOrbital.runtime.lastResult.finiteGrid)}`);
    }
  }
  const fieldProbe = summary.quantumOrbital.fieldResponseProbe;
  if (fieldProbe?.packet?.fieldResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0'
    || fieldProbe?.packet?.magneticResponseSchema !== 'peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0'
    || !Number.isFinite(fieldProbe.packet.electricFieldVm)
    || Math.abs(fieldProbe.packet.electricFieldVm - QUANTUM_FIELD_PROBE.electricFieldVm) > Math.max(1, Math.abs(QUANTUM_FIELD_PROBE.electricFieldVm) * 0.02)
    || !Number.isFinite(fieldProbe.packet.magneticFieldT)
    || Math.abs(fieldProbe.packet.magneticFieldT - QUANTUM_FIELD_PROBE.magneticFieldT) > 0.01
    || !Number.isFinite(fieldProbe.packet.zeemanEnergyExpectationEv)
    || Math.abs(fieldProbe.packet.zeemanEnergyExpectationEv) <= 1e-7
    || !Number.isFinite(fieldProbe.packet.magneticMomentProjectionBohrMagneton)
    || !Number.isFinite(fieldProbe.packet.fieldEnergyExpectationEv)
    || !Number.isFinite(fieldProbe.packet.dipoleMomentZBohrElectron)
    || !Number.isFinite(fieldProbe.packet.polarizabilityProxyBohr3)
    || !fieldProbe.readoutText?.includes('B')
    || !fieldProbe.readoutText?.includes('zE')) {
    throw new Error(`Quantum orbital nonzero field-response probe failed: ${JSON.stringify(fieldProbe)}`);
  }
  if (summary.quantumOrbital.closureResult?.schema !== 'peercompute.multiscale.closure-result.v0'
    || summary.quantumOrbital.closureResult?.source?.solverId !== 'quantum-orbital-closure') {
    throw new Error(`Quantum orbital closure result missing shared closure contract: ${JSON.stringify(summary.quantumOrbital.closureResult)}`);
  }
  for (const key of ['quantumElectronCount', 'quantumOrbitalEnergyEv', 'quantumEffectiveZ', 'quantumIonizationFraction', 'quantumElectronegativityProxy', 'quantumPolarizabilityProxy', 'quantumFiniteGridNormError', 'quantumFiniteGridBoundaryMass', 'quantumFiniteGridMeanRadiusBohr', 'quantumFiniteGridEigenResidualRelativeL2', 'quantumFiniteGridWavefunctionEvolutionNormDrift', 'quantumFiniteGridWavefunctionEvolutionWebgpuNormDrift', 'quantumFiniteGridStatisticalBridgePartitionFunctionLog', 'quantumFiniteGridStatisticalBridgeHeatCapacityProxy', 'quantumFiniteGridStatisticalBridgeTemperatureDeltaKProxy']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Quantum orbital closure missing finite ${key}`);
    }
  }
  if (!summary.quantumOrbital.readoutText?.includes('quantum basis')
    || !summary.quantumOrbital.readoutText?.includes('quantum grid')
    || !summary.quantumOrbital.readoutText?.includes('quantum residual')
    || !summary.quantumOrbital.readoutText?.includes('quantum evolve')
    || !summary.quantumOrbital.readoutText?.includes('quantum qgrid stat')
    || !summary.quantumOrbital.readoutText?.includes('quantum radial')
    || !summary.quantumOrbital.readoutText?.includes('quantum worker')
    || !summary.quantumOrbital.readoutText?.includes('quantum closure')) {
    throw new Error(`Quantum orbital rows missing from molecular/orbital readout: ${summary.quantumOrbital.readoutText}`);
  }
  if (!summary.apiStatus?.hasSetQuantumOrbital
    || !summary.apiStatus?.hasGetQuantumOrbital
    || summary.quantumOrbital.api?.packet?.elementSymbol !== 'Cl'
    || summary.quantumOrbital.api?.packet?.activeOrbital !== '3p'
    || summary.quantumOrbital.api?.packet?.finiteGridSize !== 14
    || summary.quantumOrbital.api?.packet?.bondingTendency !== 'ionic-acceptor'
    || summary.quantumOrbital.api?.elementControl !== 'Cl'
    || summary.quantumOrbital.api?.gridControl !== '14') {
    throw new Error(`Quantum orbital API did not switch to Cl 3p finite-grid state: ${JSON.stringify(summary.quantumOrbital.api)}`);
  }
  if (!Array.isArray(summary.quantumOrbital.api?.focusRows)
    || summary.quantumOrbital.api.focusRows.indexOf('quantum grid') < 0
    || summary.quantumOrbital.api.focusRows.indexOf('quantum grid') > 11) {
    throw new Error(`Quantum orbital focus rows do not prioritize grid telemetry: ${JSON.stringify(summary.quantumOrbital.api?.focusRows)}`);
  }
  if (summary.quantumOrbital.api.focusRows.indexOf('quantum worker') < 0
    || summary.quantumOrbital.api.focusRows.indexOf('quantum worker') > 11) {
    throw new Error(`Quantum orbital focus rows do not prioritize worker telemetry: ${JSON.stringify(summary.quantumOrbital.api?.focusRows)}`);
  }
  if (!summary.nbody.overlay?.visible) {
    throw new Error('N-body overlay did not become visible');
  }
  if (!summary.nbody.packet?.approximation) {
    throw new Error('N-body packet approximation diagnostics missing');
  }
  if (!summary.stellarFusion.overlay?.visible) {
    throw new Error('Stellar fusion overlay did not become visible');
  }
  if (!summary.stellarFusion.backend) {
    throw new Error('Stellar fusion runtime backend missing');
  }
  if (!summary.stellarFusion.packet?.backend) {
    throw new Error('Stellar fusion packet state missing backend');
  }
  for (const key of ['coreTemperatureK', 'meanDensityKgM3', 'meanHydrogenFraction', 'meanHeliumFraction', 'fusionPowerProxy', 'luminosityFactor', 'neutrinoLossProxy', 'energyDrift', 'speciesDrift']) {
    if (!Number.isFinite(summary.stellarFusion.packet?.[key])) {
      throw new Error(`Stellar fusion packet missing finite ${key}`);
    }
  }
  for (const key of ['stellarFusionPower', 'stellarLuminosityFactor', 'stellarCoreTemperatureK', 'stellarHydrogenFraction', 'stellarHeliumFraction', 'stellarNeutrinoLoss', 'stellarEnergyDrift']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Stellar fusion closure missing finite ${key}`);
    }
  }
  if (!summary.magnetospherePlasma.overlay?.visible) {
    throw new Error('Magnetosphere plasma overlay did not become visible');
  }
  if (!summary.magnetospherePlasma.backend) {
    throw new Error('Magnetosphere plasma runtime backend missing');
  }
  if (!summary.magnetospherePlasma.packet?.backend) {
    throw new Error('Magnetosphere plasma packet state missing backend');
  }
  for (const key of ['solarWindPressure', 'magnetopauseRadius', 'reconnectionRate', 'alfvenSpeed', 'meanIonizationFraction', 'divergenceBProxy', 'massDrift', 'magneticEnergyDelta', 'plasmaEnergyDelta']) {
    if (!Number.isFinite(summary.magnetospherePlasma.packet?.[key])) {
      throw new Error(`Magnetosphere plasma packet missing finite ${key}`);
    }
  }
  for (const key of ['magnetosphereSolarWindPressure', 'magnetosphereReconnectionRate', 'magnetosphereIonization', 'magnetosphereAlfvenSpeed', 'magnetosphereMagneticEnergy', 'magnetosphereDivergenceB']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Magnetosphere closure missing finite ${key}`);
    }
  }
  if (!summary.picPlasmaPatch.overlay?.visible) {
    throw new Error('PIC plasma patch overlay did not become visible');
  }
  if (!summary.picPlasmaPatch.backend) {
    throw new Error('PIC plasma patch runtime backend missing');
  }
  if (!summary.picPlasmaPatch.packet?.backend) {
    throw new Error('PIC plasma patch packet state missing backend');
  }
  for (const key of ['particleCount', 'gridWidth', 'gridHeight', 'chargeImbalance', 'kineticEnergy', 'fieldEnergy', 'currentDensity', 'particleEscapeFraction', 'reconnectionHeating', 'divergenceEProxy']) {
    if (!Number.isFinite(summary.picPlasmaPatch.packet?.[key])) {
      throw new Error(`PIC plasma patch packet missing finite ${key}`);
    }
  }
  for (const key of ['picChargeImbalance', 'picCurrentDensity', 'picKineticEnergy', 'picFieldEnergy', 'picReconnectionHeating', 'picDivergenceE']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`PIC plasma patch closure missing finite ${key}`);
    }
  }
  if (!summary.relativisticCorrection.overlay?.visible) {
    throw new Error('Relativistic correction overlay did not become visible');
  }
  if (!summary.relativisticCorrection.backend) {
    throw new Error('Relativistic correction runtime backend missing');
  }
  if (!summary.relativisticCorrection.packet?.backend) {
    throw new Error('Relativistic correction packet state missing backend');
  }
  for (const key of ['sampleCount', 'maxSpeedFractionC', 'meanLorentzFactor', 'meanTimeDilation', 'gravitationalRedshiftProxy', 'perihelionPrecessionArcsecProxy', 'frameDraggingProxy', 'lensingDeflectionArcsecProxy', 'relativisticEnergyDelta']) {
    if (!Number.isFinite(summary.relativisticCorrection.packet?.[key])) {
      throw new Error(`Relativistic correction packet missing finite ${key}`);
    }
  }
  for (const key of ['relativisticMaxSpeedFractionC', 'relativisticMeanLorentzFactor', 'relativisticTimeDilation', 'relativisticRedshift', 'relativisticPrecession', 'relativisticLensing']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Relativistic correction closure missing finite ${key}`);
    }
  }
  if (!summary.maxwell.overlay?.visible) {
    throw new Error('Maxwell overlay did not become visible');
  }
  if (!summary.hydroAtmosphere.overlay?.visible) {
    throw new Error('Hydro atmosphere overlay did not become visible');
  }
  if (!summary.hydroAtmosphere.packet?.backend) {
    throw new Error('Hydro atmosphere packet state missing backend');
  }
  for (const key of ['cloudCover', 'precipitationMean', 'maxWindMps']) {
    if (!Number.isFinite(summary.hydroAtmosphere.packet?.[key])) {
      throw new Error(`Hydro atmosphere packet missing finite ${key}`);
    }
  }
  if (!summary.radiationOpacity.overlay?.visible) {
    throw new Error('Radiation opacity overlay did not become visible');
  }
  for (const key of ['opticalDepth', 'greenhouseFactor', 'meanTemperatureK']) {
    if (!Number.isFinite(summary.radiationOpacity.overlay?.[key])) {
      throw new Error(`Radiation opacity overlay missing finite ${key}`);
    }
  }
  if (!summary.radiationOpacity.packet?.backend) {
    throw new Error('Radiation opacity packet state missing backend');
  }
  for (const key of ['opticalDepth', 'greenhouseFactor', 'netHeatingPower']) {
    if (!Number.isFinite(summary.radiationOpacity.packet?.[key])) {
      throw new Error(`Radiation opacity packet missing finite ${key}`);
    }
  }
  if (!Number.isFinite(summary.closures?.surfaceRadiativeHeatFlux)) {
    throw new Error('Radiative heat flux closure missing from packet');
  }
  if (!summary.reactiveThermal.packet?.backend) {
    throw new Error('Reactive thermal packet state missing backend');
  }
  if (!summary.sphMaterial.overlay?.visible) {
    throw new Error('SPH material overlay did not become visible');
  }
  if (!summary.sphMaterial.packet?.backend) {
    throw new Error('SPH material packet state missing backend');
  }
  if (summary.sphMaterial.backend !== 'webgpu-sph-material') {
    throw new Error(`SPH material visual smoke expected WebGPU backend, saw ${summary.sphMaterial.backend}`);
  }
  if (summary.sphMaterial.overlay?.h2oPhaseChangeEvidenceStatus !== 'reduced-sph-phase-change-ready') {
    throw new Error(`SPH material overlay missing H2O phase-change evidence: ${JSON.stringify(summary.sphMaterial.overlay)}`);
  }
  if (summary.sphMaterial.packet?.phaseChangeEvidence?.schema !== SPH_MATERIAL_PHASE_CHANGE_EVIDENCE_SCHEMA) {
    throw new Error(`SPH material packet missing phase-change evidence: ${JSON.stringify(summary.sphMaterial.packet?.phaseChangeEvidence)}`);
  }
  if (summary.sphMaterial.packet?.h2oPhaseChangeValidationStatus !== 'demo-proxy-not-eos-validated') {
    throw new Error(`SPH material packet overstated H2O validation: ${JSON.stringify(summary.sphMaterial.packet)}`);
  }
  if (summary.sphMaterial.packet?.h2oPhaseChangeScientificallyValidated !== false) {
    throw new Error(`SPH material packet should not claim scientific phase validation: ${JSON.stringify(summary.sphMaterial.packet)}`);
  }
  if (summary.sphMaterial.packet?.h2oPhaseChangeBlockerCount !== 3) {
    throw new Error(`SPH material packet should preserve three H2O validation blockers: ${JSON.stringify(summary.sphMaterial.packet)}`);
  }
  for (const key of [
    'iceFraction',
    'liquidFraction',
    'vaporFraction',
    'boilingFraction',
    'freezingFraction',
    'phaseChangeRateProxy',
    'latentHeatSinkProxy',
    'latentHeatReleaseProxy',
    'meanSpecificEnthalpyProxy',
    'fireContactFraction',
    'coolingPotential',
    'groundContactFraction',
    'spillImpulse',
    'centerToFireDistance',
    'momentumDrift',
    'kineticEnergyDrift'
  ]) {
    if (!Number.isFinite(summary.sphMaterial.packet?.[key])) {
      throw new Error(`SPH material packet missing finite ${key}`);
    }
  }
  if (!summary.membraneShell.backend) {
    throw new Error('Membrane shell runtime backend missing');
  }
  if (!summary.membraneShell.packet?.backend) {
    throw new Error('Membrane shell packet state missing backend');
  }
  for (const key of ['segmentCount', 'membraneIntegrity', 'ruptureRisk', 'maxStressPa', 'maxStrain', 'damageMean']) {
    if (!Number.isFinite(summary.membraneShell.packet?.[key])) {
      throw new Error(`Membrane shell packet missing finite ${key}`);
    }
  }
  for (const key of ['membraneRuptureRisk', 'membraneMaxStressPa', 'membraneMaxStrain']) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Membrane closure missing finite ${key}`);
    }
  }
  for (const key of [
    'sphIceFraction',
    'sphLiquidFraction',
    'sphVaporFraction',
    'sphBoilingFraction',
    'sphFreezingFraction',
    'sphPhaseChangeRate',
    'sphLatentHeatSinkProxy',
    'sphLatentHeatReleaseProxy',
    'sphSpillImpulse',
    'sphGroundContactFraction',
    'sphKineticEnergyDrift'
  ]) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`SPH spill closure missing finite ${key}`);
    }
  }
  for (const key of ['spillImpulse', 'spillReleasedKg', 'sphSpillImpulse', 'sphFireContactFraction', 'runtimeSpillImpulse', 'conservationSpillImpulse']) {
    if (!Number.isFinite(summary.rupture?.[key])) {
      throw new Error(`Rupture spill telemetry missing finite ${key}`);
    }
  }
  if (
    summary.rupture.spillImpulse <= 0
    || summary.rupture.sphSpillImpulse <= 0
    || summary.rupture.spillReleasedKg <= 0
    || summary.rupture.sphFireContactFraction <= 0
  ) {
    throw new Error(`Rupture did not drive positive SPH spill telemetry: ${JSON.stringify(summary.rupture)}`);
  }
  if (!summary.combustionPlume.overlay?.visible) {
    throw new Error('Combustion plume overlay did not become visible');
  }
  if (!summary.combustionPlume.backend) {
    throw new Error('Combustion plume runtime backend missing');
  }
  for (const key of [
    'fireAreaFraction',
    'smokeColumn',
    'fuelRemaining',
    'maxTemperatureK',
    'smokeCentroidX',
    'smokeCentroidY',
    'plumeRise',
    'buoyancyFlux',
    'oxygenDepletion',
    'suppressionMean'
  ]) {
    if (!Number.isFinite(summary.combustionPlume.overlay?.[key])) {
      throw new Error(`Combustion plume overlay missing finite ${key}`);
    }
  }
  if (!summary.combustionPlume.packet?.backend) {
    throw new Error('Combustion plume packet state missing backend');
  }
  for (const key of [
    'fireAreaFraction',
    'smokeColumn',
    'fuelRemaining',
    'heatReleaseMean',
    'smokeCentroidX',
    'smokeCentroidY',
    'plumeRise',
    'buoyancyFlux',
    'oxygenDepletion',
    'suppressionMean'
  ]) {
    if (!Number.isFinite(summary.combustionPlume.packet?.[key])) {
      throw new Error(`Combustion plume packet missing finite ${key}`);
    }
  }
  for (const key of [
    'combustionFireArea',
    'combustionSmokeColumn',
    'combustionFuelRemaining',
    'combustionPlumeRise',
    'combustionBuoyancyFlux',
    'combustionOxygenDepletion'
  ]) {
    if (!Number.isFinite(summary.closures?.[key])) {
      throw new Error(`Combustion closure missing finite ${key}`);
    }
  }
  if (!summary.closureResults?.reactiveThermal?.schema || !summary.closureResults?.sphMaterial?.schema) {
    throw new Error('Closure result summaries missing from packet');
  }
  if (summary.conservation?.schema !== 'peercompute.multiscale.conservation-audit.v0') {
    throw new Error('Conservation audit schema missing from packet');
  }
  if (summary.conservation?.fieldMetadata?.schema !== 'peercompute.multiscale.field-metadata-report.v0'
    || !(summary.conservation.fieldMetadata.fieldCount >= 8)
    || !(summary.conservation.fieldMetadata.proxyFieldCount >= 1)
    || summary.conservation?.residuals?.massRelativeError?.metadata?.unit !== '1'
    || summary.conservation?.exchangeMetadata?.surfaceRadiativeHeatFlux?.dimensions !== 'M T^-3') {
    throw new Error(`Conservation audit field metadata missing: ${JSON.stringify(summary.conservation?.fieldMetadata)}`);
  }
  for (const key of ['massRelativeError', 'energyResidualProxy', 'speciesResidualProxy']) {
    if (!Number.isFinite(summary.conservation?.[key])) {
      throw new Error(`Conservation audit missing finite ${key}`);
    }
  }
  if (summary.conservation?.chargeAudit !== 'reduced-pic-and-molecular-proxy') {
    throw new Error('Conservation audit missing reduced PIC/molecular charge audit mode');
  }
  for (const key of ['picChargeImbalance', 'picCurrentDensity', 'picReconnectionHeating', 'picParticleEscapeFraction', 'picDivergenceEProxy']) {
    if (!Number.isFinite(summary.conservation?.exchange?.[key])) {
      throw new Error(`Conservation audit missing finite PIC exchange ${key}`);
    }
  }
  for (const key of ['relativisticMaxSpeedFractionC', 'relativisticMeanLorentzFactor', 'relativisticMeanTimeDilation', 'relativisticGravitationalRedshift', 'relativisticLensingDeflectionArcsecProxy']) {
    if (!Number.isFinite(summary.conservation?.exchange?.[key])) {
      throw new Error(`Conservation audit missing finite relativistic exchange ${key}`);
    }
  }
  for (const key of ['cosmologyScaleFactor', 'cosmologyHubbleRate', 'cosmologyFilamentEnergy', 'cosmologyStructureGrowth', 'cosmologyExpansionWorkProxy']) {
    if (!Number.isFinite(summary.conservation?.exchange?.[key])) {
      throw new Error(`Conservation audit missing finite cosmology exchange ${key}`);
    }
  }
  for (const key of ['molecularAtomCount', 'molecularBondCount', 'molecularHeatReleaseProxy', 'molecularIonizationFraction', 'molecularMeanTemperatureK']) {
    if (!Number.isFinite(summary.conservation?.exchange?.[key])) {
      throw new Error(`Conservation audit missing finite molecular exchange ${key}`);
    }
  }
  if (!Array.isArray(summary.conservation?.trackedCouplings) || summary.conservation.trackedCouplings.length < 2) {
    throw new Error('Conservation audit tracked couplings missing');
  }
  if ((summary.closureState?.warmDeltaCount || 0) < 2) {
    throw new Error(`Expected at least 2 closure warm deltas, saw ${summary.closureState?.warmDeltaCount || 0}`);
  }
  if (summary.conservationState?.scope !== 'multiscale-conservation' || (summary.conservationState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected conservation audit warm delta');
  }
  if (summary.sourceSinkBalanceState?.scope !== 'multiscale-source-sink-balances' || (summary.sourceSinkBalanceState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular source/sink balance warm delta');
  }
  if (summary.sourceTransferState?.scope !== 'multiscale-source-transfers' || (summary.sourceTransferState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular source transfer warm delta');
  }
  if (summary.sourceTransferTargetPreviewState?.scope !== 'multiscale-source-transfer-target-previews'
    || (summary.sourceTransferTargetPreviewState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutator preview warm delta');
  }
  if (summary.sourceTransferTargetMutatorRegistryState?.scope !== 'multiscale-source-transfer-target-mutators'
    || (summary.sourceTransferTargetMutatorRegistryState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutator registry warm delta');
  }
  if (summary.sourceTransferTargetMutationPreflightState?.scope !== 'multiscale-source-transfer-target-preflights'
    || (summary.sourceTransferTargetMutationPreflightState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutation preflight warm delta');
  }
  if (summary.sourceTransferTargetMutationOperationPlanState?.scope !== 'multiscale-source-transfer-target-operation-plans'
    || (summary.sourceTransferTargetMutationOperationPlanState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutation operation plan warm delta');
  }
  if (summary.sourceTransferTargetMutationInvariantCheckState?.scope !== 'multiscale-source-transfer-target-invariant-checks'
    || (summary.sourceTransferTargetMutationInvariantCheckState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutation invariant check warm delta');
  }
  if (summary.sourceTransferTargetMutationCommitState?.scope !== 'multiscale-source-transfer-target-commits'
    || (summary.sourceTransferTargetMutationCommitState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutation commit warm delta');
  }
  if (summary.sourceTransferTargetMutationDispatchState?.scope !== 'multiscale-source-transfer-target-dispatches'
    || (summary.sourceTransferTargetMutationDispatchState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutation dispatch warm delta');
  }
  if (summary.sourceTransferTargetMutationApplyValidationState?.scope !== 'multiscale-source-transfer-target-apply-validations'
    || (summary.sourceTransferTargetMutationApplyValidationState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutation apply validation warm delta');
  }
  if (summary.sourceTransferTargetMutationApplyExecutionState?.scope !== 'multiscale-source-transfer-target-apply-executions'
    || (summary.sourceTransferTargetMutationApplyExecutionState?.warmDeltaCount || 0) < 1) {
    throw new Error('Expected molecular target mutation apply execution warm delta');
  }
  const auditDelta = Object.values(summary.conservationState?.deltas || {})[0];
  if (auditDelta?.schema !== 'peercompute.multiscale.conservation-audit.v0') {
    throw new Error('Conservation audit warm delta schema missing');
  }
  const balanceDelta = Object.values(summary.sourceSinkBalanceState?.deltas || {})[0];
  if (balanceDelta?.schema !== 'peercompute.multiscale.molecular-source-sink-balance.v0'
    || !Number.isFinite(balanceDelta?.sourceDriveCoverage)
    || !Number.isFinite(balanceDelta?.balanceResidualProxy)) {
    throw new Error(`Molecular source/sink balance warm delta schema missing: ${JSON.stringify(balanceDelta)}`);
  }
  const transferDelta = Object.values(summary.sourceTransferState?.deltas || {})[0];
  if (transferDelta?.schema !== 'peercompute.multiscale.molecular-conservative-transfer.v0'
    || transferDelta?.dryRun !== true
    || transferDelta?.applied !== false
    || !(transferDelta?.allocationCount >= 1)
    || transferDelta?.heatUnit !== 'W-proxy'
    || !Number.isFinite(transferDelta?.closedSystemResidualProxy)) {
    throw new Error(`Molecular source transfer warm delta schema missing: ${JSON.stringify(transferDelta)}`);
  }
  if (summary.sourceEquation?.schema !== 'peercompute.multiscale.molecular-source-equation.v0'
    || summary.sourceEquation?.basis?.closedSystem !== false
    || summary.sourceEquation?.basis?.phaseEosSchema !== 'peercompute.multiscale.molecular-phase-eos-basis.v0'
    || summary.sourceEquation?.terms?.energy?.unit !== 'W-proxy'
    || summary.sourceEquation?.terms?.energy?.dimensions !== 'M L^2 T^-3'
    || !Number.isFinite(summary.sourceEquation?.terms?.energy?.temperatureRateKPerSProxy)
    || !Number.isFinite(summary.sourceEquation?.terms?.energy?.phaseEnergyRateWProxy)
    || !Number.isFinite(summary.sourceEquation?.terms?.energy?.phaseEosSpecificFreeEnergyProxy)) {
    throw new Error(`Molecular source equation packet missing unit-aware scaffold: ${JSON.stringify(summary.sourceEquation)}`);
  }
  if (summary.sourceTransfer?.schema !== 'peercompute.multiscale.molecular-conservative-transfer.v0'
    || summary.sourceTransfer?.dryRun !== true
    || summary.sourceTransfer?.applied !== false
    || !(summary.sourceTransfer?.allocations?.length >= 1)
    || summary.sourceTransfer?.units?.heatRate?.unit !== 'W-proxy'
    || !Number.isFinite(summary.sourceTransfer?.residuals?.closedSystemResidualProxy)) {
    throw new Error(`Molecular dry-run transfer packet missing expected scaffold: ${JSON.stringify(summary.sourceTransfer)}`);
  }
  if (summary.sourceTransferApplication?.schema !== 'peercompute.multiscale.molecular-transfer-application.v0'
    || summary.sourceTransferApplication?.sourceTransferSchema !== 'peercompute.multiscale.molecular-conservative-transfer.v0'
    || summary.sourceTransferApplication?.canApply !== false
    || summary.sourceTransferApplication?.applied !== false
    || !(summary.sourceTransferApplication?.allocationCount >= 1)
    || !(summary.sourceTransferApplication?.blockedTargetCount >= 1)
    || !(summary.sourceTransferApplication?.blockers || []).includes('dry-run-disabled')
    || !(summary.sourceTransferApplication?.blockers || []).includes('mutation-enabled')
    || !summary.hudApi?.focusText?.includes('molecular apply')) {
    throw new Error(`Molecular transfer application gate missing expected blockers: ${JSON.stringify(summary.sourceTransferApplication)} focus=${summary.hudApi?.focusText}`);
  }
  if (summary.sourceTransferTransaction?.schema !== 'peercompute.multiscale.molecular-transfer-transaction.v0'
    || summary.sourceTransferTransaction?.sourceApplicationSchema !== 'peercompute.multiscale.molecular-transfer-application.v0'
    || summary.sourceTransferTransaction?.allowed !== false
    || summary.sourceTransferTransaction?.applied !== false
    || summary.sourceTransferTransaction?.transactionEnabled !== false
    || !(summary.sourceTransferTransaction?.targetCount >= 1)
    || !(summary.sourceTransferTransaction?.blockedTargetCount >= 1)
    || summary.sourceTransferTransaction?.appliedTargetCount !== 0
    || !(summary.sourceTransferTransaction?.blockers || []).includes('transaction-disabled')
    || !(summary.sourceTransferTransaction?.blockers || []).includes('mutator-unavailable')
    || !summary.hudApi?.focusText?.includes('molecular txn')) {
    throw new Error(`Molecular transfer transaction scaffold missing expected blockers: ${JSON.stringify(summary.sourceTransferTransaction)} focus=${summary.hudApi?.focusText}`);
  }
  const previewDelta = Object.values(summary.sourceTransferTargetPreviewState?.deltas || {})[0];
  if (summary.sourceTransferTargetPreview?.schema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || summary.sourceTransferTargetPreview?.sourceTransactionSchema !== 'peercompute.multiscale.molecular-transfer-transaction.v0'
    || summary.sourceTransferTargetPreview?.dryRun !== true
    || summary.sourceTransferTargetPreview?.applied !== false
    || summary.sourceTransferTargetPreview?.mutationEnabled !== false
    || !(summary.sourceTransferTargetPreview?.previewTargetCount >= 1)
    || !(summary.sourceTransferTargetPreview?.blockedTargetCount >= 1)
    || summary.sourceTransferTargetPreview?.appliedTargetCount !== 0
    || !(summary.sourceTransferTargetPreview?.blockers || []).includes('target-mutator-not-validated')
    || !(summary.sourceTransferTargetPreview?.blockers || []).includes('preview-only-non-mutating')
    || !Number.isFinite(summary.sourceTransferTargetPreview?.sourceTerms?.maxAbsTemperatureDeltaKProxy)
    || !summary.sourceTransferTargetPreview?.targets?.some((target) => (
      target.targetSolverId === 'reactive-thermal-cell'
      && target.applied === false
      && Number.isFinite(target.before?.temperatureK)
      && Number.isFinite(target.after?.temperatureK)
    ))
    || !summary.sourceTransferTargetPreview?.targets?.some((target) => (
      target.targetSolverId === 'sph-material'
      && target.applied === false
      && Number.isFinite(target.before?.averageTemperatureK)
      && Number.isFinite(target.after?.averageTemperatureK)
    ))
    || previewDelta?.schema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || previewDelta?.dryRun !== true
    || previewDelta?.applied !== false
    || !Number.isFinite(previewDelta?.maxAbsTemperatureDeltaKProxy)
    || !summary.hudApi?.focusText?.includes('molecular preview')) {
    throw new Error(`Molecular target mutator preview missing expected dry-run blockers: ${JSON.stringify(summary.sourceTransferTargetPreview)} delta=${JSON.stringify(previewDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const registryDelta = Object.values(summary.sourceTransferTargetMutatorRegistryState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutatorRegistry?.schema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || summary.sourceTransferTargetMutatorRegistry?.sourcePreviewSchema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || summary.sourceTransferTargetMutatorRegistry?.dryRun !== true
    || summary.sourceTransferTargetMutatorRegistry?.mutationEnabled !== false
    || summary.sourceTransferTargetMutatorRegistry?.canMutate !== false
    || summary.sourceTransferTargetMutatorRegistry?.applied !== false
    || !(summary.sourceTransferTargetMutatorRegistry?.targetCount >= 1)
    || !(summary.sourceTransferTargetMutatorRegistry?.registeredMutatorCount >= 1)
    || summary.sourceTransferTargetMutatorRegistry?.validatedMutatorCount !== 0
    || !(summary.sourceTransferTargetMutatorRegistry?.blockedMutatorCount >= 1)
    || !(summary.sourceTransferTargetMutatorRegistry?.declaredFieldCount >= 6)
    || !(summary.sourceTransferTargetMutatorRegistry?.invariantScopeCount >= 3)
    || !(summary.sourceTransferTargetMutatorRegistry?.blockers || []).includes('target-mutator-validation-pending')
    || !(summary.sourceTransferTargetMutatorRegistry?.blockers || []).includes('conservative-accounting-not-validated')
    || !summary.sourceTransferTargetMutatorRegistry?.targets?.some((target) => (
      target.targetSolverId === 'reactive-thermal-cell'
      && target.registered === true
      && target.validated === false
      && target.fields?.some((field) => field.field === 'temperatureK' && field.unit === 'K')
    ))
    || !summary.sourceTransferTargetMutatorRegistry?.targets?.some((target) => (
      target.targetSolverId === 'sph-material'
      && target.registered === true
      && target.validated === false
      && target.invariants?.required?.includes('phase-proxy')
    ))
    || registryDelta?.schema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || registryDelta?.canMutate !== false
    || registryDelta?.validatedMutatorCount !== 0
    || !summary.hudApi?.focusText?.includes('molecular mutators')) {
    throw new Error(`Molecular target mutator registry missing expected blockers: ${JSON.stringify(summary.sourceTransferTargetMutatorRegistry)} delta=${JSON.stringify(registryDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const preflightDelta = Object.values(summary.sourceTransferTargetMutationPreflightState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutationPreflight?.schema !== 'peercompute.multiscale.molecular-target-mutation-preflight.v0'
    || summary.sourceTransferTargetMutationPreflight?.sourceRegistrySchema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || summary.sourceTransferTargetMutationPreflight?.sourcePreviewSchema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || summary.sourceTransferTargetMutationPreflight?.dryRun !== true
    || summary.sourceTransferTargetMutationPreflight?.canMutate !== false
    || summary.sourceTransferTargetMutationPreflight?.applied !== false
    || !(summary.sourceTransferTargetMutationPreflight?.targetCount >= 1)
    || !(summary.sourceTransferTargetMutationPreflight?.checkedTargetCount >= 1)
    || summary.sourceTransferTargetMutationPreflight?.passedTargetCount !== 0
    || !(summary.sourceTransferTargetMutationPreflight?.blockedTargetCount >= 1)
    || summary.sourceTransferTargetMutationPreflight?.appliedTargetCount !== 0
    || !(summary.sourceTransferTargetMutationPreflight?.declaredFieldCount >= 6)
    || !(summary.sourceTransferTargetMutationPreflight?.invariantScopeCount >= 3)
    || !Number.isFinite(summary.sourceTransferTargetMutationPreflight?.maxResidualRiskProxy)
    || !Number.isFinite(summary.sourceTransferTargetMutationPreflight?.residualToleranceProxy)
    || !(summary.sourceTransferTargetMutationPreflight?.blockers || []).includes('preflight-non-mutating')
    || !(summary.sourceTransferTargetMutationPreflight?.blockers || []).includes('target-mutator-validation-pending')
    || !summary.sourceTransferTargetMutationPreflight?.targets?.some((target) => (
      target.targetSolverId === 'reactive-thermal-cell'
      && target.canMutate === false
      && target.checks?.some((check) => check.id === 'declared-fields' && check.passed === true)
    ))
    || !summary.sourceTransferTargetMutationPreflight?.targets?.some((target) => (
      target.targetSolverId === 'sph-material'
      && target.blockers?.includes('source-state-mutation-disabled')
      && Number.isFinite(target.residuals?.residualRiskProxy)
    ))
    || preflightDelta?.schema !== 'peercompute.multiscale.molecular-target-mutation-preflight.v0'
    || preflightDelta?.canMutate !== false
    || preflightDelta?.passedTargetCount !== 0
    || !Number.isFinite(preflightDelta?.maxResidualRiskProxy)
    || !summary.hudApi?.focusText?.includes('molecular preflight')) {
    throw new Error(`Molecular target mutation preflight missing expected blockers: ${JSON.stringify(summary.sourceTransferTargetMutationPreflight)} delta=${JSON.stringify(preflightDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const operationPlanDelta = Object.values(summary.sourceTransferTargetMutationOperationPlanState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutationOperationPlan?.schema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || summary.sourceTransferTargetMutationOperationPlan?.sourcePreflightSchema !== 'peercompute.multiscale.molecular-target-mutation-preflight.v0'
    || summary.sourceTransferTargetMutationOperationPlan?.sourceRegistrySchema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || summary.sourceTransferTargetMutationOperationPlan?.dryRun !== true
    || summary.sourceTransferTargetMutationOperationPlan?.canApply !== false
    || summary.sourceTransferTargetMutationOperationPlan?.applied !== false
    || !(summary.sourceTransferTargetMutationOperationPlan?.targetCount >= 1)
    || !(summary.sourceTransferTargetMutationOperationPlan?.operationCount >= 6)
    || summary.sourceTransferTargetMutationOperationPlan?.allowedByRegistryOperationCount !== summary.sourceTransferTargetMutationOperationPlan?.operationCount
    || summary.sourceTransferTargetMutationOperationPlan?.blockedOperationCount !== summary.sourceTransferTargetMutationOperationPlan?.operationCount
    || summary.sourceTransferTargetMutationOperationPlan?.appliedOperationCount !== 0
    || !Number.isFinite(summary.sourceTransferTargetMutationOperationPlan?.maxAbsFieldDeltaProxy)
    || !(summary.sourceTransferTargetMutationOperationPlan?.blockers || []).includes('operation-plan-non-mutating')
    || !summary.sourceTransferTargetMutationOperationPlan?.targets?.some((target) => (
      target.targetSolverId === 'reactive-thermal-cell'
      && target.operations?.some((operation) => operation.field === 'temperatureK' && operation.unit === 'K' && operation.applied === false)
    ))
    || !summary.sourceTransferTargetMutationOperationPlan?.targets?.some((target) => (
      target.targetSolverId === 'sph-material'
      && target.operations?.some((operation) => operation.field === 'phaseChangeRateProxy' && operation.sourceTerm === 'phaseDriveDeltaProxy')
    ))
    || operationPlanDelta?.schema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || operationPlanDelta?.canApply !== false
    || !(operationPlanDelta?.operationCount >= 6)
    || !Number.isFinite(operationPlanDelta?.maxAbsFieldDeltaProxy)
    || !summary.hudApi?.focusText?.includes('molecular op plan')) {
    throw new Error(`Molecular target mutation operation plan missing expected blockers: ${JSON.stringify(summary.sourceTransferTargetMutationOperationPlan)} delta=${JSON.stringify(operationPlanDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const invariantCheckDelta = Object.values(summary.sourceTransferTargetMutationInvariantCheckState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutationInvariantCheck?.schema !== 'peercompute.multiscale.molecular-target-mutation-invariant-check.v0'
    || summary.sourceTransferTargetMutationInvariantCheck?.sourceOperationPlanSchema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || summary.sourceTransferTargetMutationInvariantCheck?.sourcePreflightSchema !== 'peercompute.multiscale.molecular-target-mutation-preflight.v0'
    || summary.sourceTransferTargetMutationInvariantCheck?.sourceRegistrySchema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || summary.sourceTransferTargetMutationInvariantCheck?.dryRun !== true
    || summary.sourceTransferTargetMutationInvariantCheck?.canApply !== false
    || summary.sourceTransferTargetMutationInvariantCheck?.applied !== false
    || !(summary.sourceTransferTargetMutationInvariantCheck?.targetCount >= 1)
    || summary.sourceTransferTargetMutationInvariantCheck?.passedTargetCount !== summary.sourceTransferTargetMutationInvariantCheck?.targetCount
    || summary.sourceTransferTargetMutationInvariantCheck?.blockedTargetCount !== summary.sourceTransferTargetMutationInvariantCheck?.targetCount
    || summary.sourceTransferTargetMutationInvariantCheck?.missingInvariantScopeCount !== 0
    || summary.sourceTransferTargetMutationInvariantCheck?.residualBudgetPassCount !== summary.sourceTransferTargetMutationInvariantCheck?.targetCount
    || !Number.isFinite(summary.sourceTransferTargetMutationInvariantCheck?.maxResidualProxy)
    || !(summary.sourceTransferTargetMutationInvariantCheck?.blockers || []).includes('invariant-check-non-mutating')
    || !summary.sourceTransferTargetMutationInvariantCheck?.targets?.some((target) => (
      target.targetSolverId === 'reactive-thermal-cell'
      && target.scopeChecks?.some((check) => check.scope === 'energy-proxy' && check.passed === true)
      && target.scopeChecks?.some((check) => check.scope === 'species-proxy' && check.passed === true)
      && target.scopeChecks?.some((check) => check.scope === 'provenance' && check.passed === true)
    ))
    || !summary.sourceTransferTargetMutationInvariantCheck?.targets?.some((target) => (
      target.targetSolverId === 'sph-material'
      && target.scopeChecks?.some((check) => check.scope === 'phase-proxy' && check.passed === true)
    ))
    || invariantCheckDelta?.schema !== 'peercompute.multiscale.molecular-target-mutation-invariant-check.v0'
    || invariantCheckDelta?.canApply !== false
    || invariantCheckDelta?.missingInvariantScopeCount !== 0
    || !Number.isFinite(invariantCheckDelta?.maxResidualProxy)
    || !summary.hudApi?.focusText?.includes('molecular invariants')) {
    throw new Error(`Molecular target mutation invariant check missing expected blockers: ${JSON.stringify(summary.sourceTransferTargetMutationInvariantCheck)} delta=${JSON.stringify(invariantCheckDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const commitDelta = Object.values(summary.sourceTransferTargetMutationCommitState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutationCommit?.schema !== 'peercompute.multiscale.molecular-target-mutation-commit.v0'
    || summary.sourceTransferTargetMutationCommit?.sourceInvariantCheckSchema !== 'peercompute.multiscale.molecular-target-mutation-invariant-check.v0'
    || summary.sourceTransferTargetMutationCommit?.sourceOperationPlanSchema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || summary.sourceTransferTargetMutationCommit?.dryRun !== true
    || summary.sourceTransferTargetMutationCommit?.canCommit !== false
    || summary.sourceTransferTargetMutationCommit?.committed !== false
    || !(summary.sourceTransferTargetMutationCommit?.targetCount >= 1)
    || summary.sourceTransferTargetMutationCommit?.invariantEligibleTargetCount !== summary.sourceTransferTargetMutationCommit?.targetCount
    || summary.sourceTransferTargetMutationCommit?.committableTargetCount !== 0
    || summary.sourceTransferTargetMutationCommit?.blockedTargetCount !== summary.sourceTransferTargetMutationCommit?.targetCount
    || summary.sourceTransferTargetMutationCommit?.committedTargetCount !== 0
    || !(summary.sourceTransferTargetMutationCommit?.plannedOperationCount >= 1)
    || summary.sourceTransferTargetMutationCommit?.committedOperationCount !== 0
    || !(summary.sourceTransferTargetMutationCommit?.blockers || []).includes('commit-dispatch-not-enabled')
    || !(summary.sourceTransferTargetMutationCommit?.blockers || []).includes('target-mutator-apply-not-implemented')
    || commitDelta?.schema !== 'peercompute.multiscale.molecular-target-mutation-commit.v0'
    || commitDelta?.canCommit !== false
    || commitDelta?.committed !== false
    || commitDelta?.committableTargetCount !== 0
  || !summary.hudApi?.focusText?.includes('molecular commit')) {
    throw new Error(`Molecular target mutation commit missing expected blockers: ${JSON.stringify(summary.sourceTransferTargetMutationCommit)} delta=${JSON.stringify(commitDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const dispatchDelta = Object.values(summary.sourceTransferTargetMutationDispatchState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutationDispatch?.schema !== 'peercompute.multiscale.molecular-target-mutation-dispatch.v0'
    || summary.sourceTransferTargetMutationDispatch?.sourceCommitSchema !== 'peercompute.multiscale.molecular-target-mutation-commit.v0'
    || summary.sourceTransferTargetMutationDispatch?.sourceOperationPlanSchema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || summary.sourceTransferTargetMutationDispatch?.dryRun !== true
    || summary.sourceTransferTargetMutationDispatch?.dispatchEnabled !== false
    || summary.sourceTransferTargetMutationDispatch?.canDispatch !== false
    || summary.sourceTransferTargetMutationDispatch?.queued !== false
    || summary.sourceTransferTargetMutationDispatch?.dispatched !== false
    || !(summary.sourceTransferTargetMutationDispatch?.batchCount >= 1)
    || summary.sourceTransferTargetMutationDispatch?.invariantEligibleBatchCount !== summary.sourceTransferTargetMutationDispatch?.batchCount
    || summary.sourceTransferTargetMutationDispatch?.dispatchableBatchCount !== 0
    || summary.sourceTransferTargetMutationDispatch?.blockedBatchCount !== summary.sourceTransferTargetMutationDispatch?.batchCount
    || !(summary.sourceTransferTargetMutationDispatch?.operationCount >= 1)
    || summary.sourceTransferTargetMutationDispatch?.dispatchedOperationCount !== 0
    || !(summary.sourceTransferTargetMutationDispatch?.blockers || []).includes('dispatch-disabled')
    || !(summary.sourceTransferTargetMutationDispatch?.blockers || []).includes('target-mutator-apply-not-implemented')
    || dispatchDelta?.schema !== 'peercompute.multiscale.molecular-target-mutation-dispatch.v0'
    || dispatchDelta?.canDispatch !== false
    || dispatchDelta?.dispatched !== false
    || dispatchDelta?.dispatchableBatchCount !== 0
    || !summary.hudApi?.focusText?.includes('molecular dispatch')) {
    throw new Error(`Molecular target mutation dispatch missing expected blockers: ${JSON.stringify(summary.sourceTransferTargetMutationDispatch)} delta=${JSON.stringify(dispatchDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const applyValidationDelta = Object.values(summary.sourceTransferTargetMutationApplyValidationState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutationApplyValidation?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-validation.v0'
    || summary.sourceTransferTargetMutationApplyValidation?.sourceDispatchSchema !== 'peercompute.multiscale.molecular-target-mutation-dispatch.v0'
    || summary.sourceTransferTargetMutationApplyValidation?.sourceOperationPlanSchema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || summary.sourceTransferTargetMutationApplyValidation?.dryRun !== true
    || summary.sourceTransferTargetMutationApplyValidation?.applyEnabled !== false
    || summary.sourceTransferTargetMutationApplyValidation?.canApply !== false
    || summary.sourceTransferTargetMutationApplyValidation?.applied !== false
    || !(summary.sourceTransferTargetMutationApplyValidation?.targetCount >= 1)
    || summary.sourceTransferTargetMutationApplyValidation?.validatedTargetCount !== summary.sourceTransferTargetMutationApplyValidation?.targetCount
    || summary.sourceTransferTargetMutationApplyValidation?.applyReadyTargetCount !== 0
    || summary.sourceTransferTargetMutationApplyValidation?.blockedTargetCount !== summary.sourceTransferTargetMutationApplyValidation?.targetCount
    || !(summary.sourceTransferTargetMutationApplyValidation?.operationCount >= 1)
    || summary.sourceTransferTargetMutationApplyValidation?.validatedOperationCount !== summary.sourceTransferTargetMutationApplyValidation?.operationCount
    || summary.sourceTransferTargetMutationApplyValidation?.appliedOperationCount !== 0
    || !(summary.sourceTransferTargetMutationApplyValidation?.maxBeforeAfterResidualProxy <= 1e-9)
    || !(summary.sourceTransferTargetMutationApplyValidation?.blockers || []).includes('apply-disabled')
    || !(summary.sourceTransferTargetMutationApplyValidation?.blockers || []).includes('target-mutator-apply-not-implemented')
    || applyValidationDelta?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-validation.v0'
    || applyValidationDelta?.canApply !== false
    || applyValidationDelta?.applied !== false
    || applyValidationDelta?.applyReadyTargetCount !== 0
    || !summary.hudApi?.focusText?.includes('molecular apply val')) {
    throw new Error(`Molecular target mutation apply validation missing expected blockers: ${JSON.stringify(summary.sourceTransferTargetMutationApplyValidation)} delta=${JSON.stringify(applyValidationDelta)} focus=${summary.hudApi?.focusText}`);
  }
  const applyExecutionDelta = Object.values(summary.sourceTransferTargetMutationApplyExecutionState?.deltas || {})[0];
  if (summary.sourceTransferTargetMutationApplyExecution?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-execution.v0'
    || summary.sourceTransferTargetMutationApplyExecution?.sourceApplyValidationSchema !== 'peercompute.multiscale.molecular-target-mutation-apply-validation.v0'
    || summary.sourceTransferTargetMutationApplyExecution?.validationPassed !== true
    || summary.sourceTransferTargetMutationApplyExecution?.executionRequested !== false
    || summary.sourceTransferTargetMutationApplyExecution?.proxyApplyEnabled !== false
    || summary.sourceTransferTargetMutationApplyExecution?.targetApplyImplemented !== false
    || summary.sourceTransferTargetMutationApplyExecution?.canExecute !== false
    || summary.sourceTransferTargetMutationApplyExecution?.applied !== false
    || !(summary.sourceTransferTargetMutationApplyExecution?.targetCount >= 1)
    || summary.sourceTransferTargetMutationApplyExecution?.appliedTargetCount !== 0
    || !(summary.sourceTransferTargetMutationApplyExecution?.operationCount >= 6)
    || summary.sourceTransferTargetMutationApplyExecution?.appliedOperationCount !== 0
    || !(summary.sourceTransferTargetMutationApplyExecution?.blockers || []).includes('execution-not-requested')
    || !(summary.sourceTransferTargetMutationApplyExecution?.blockers || []).includes('proxy-apply-disabled')
    || !(summary.sourceTransferTargetMutationApplyExecution?.blockers || []).includes('target-mutator-apply-not-implemented')
    || applyExecutionDelta?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-execution.v0'
    || applyExecutionDelta?.applied !== false
    || !summary.hudApi?.focusText?.includes('molecular apply exec')) {
    throw new Error(`Molecular target mutation apply execution missing expected default blockers: ${JSON.stringify(summary.sourceTransferTargetMutationApplyExecution)} delta=${JSON.stringify(applyExecutionDelta)} focus=${summary.hudApi?.focusText}`);
  }
  if (!summary.apiStatus?.hasConfigureMolecularTransferApplication
    || !summary.apiStatus?.hasGetMolecularTransferApplicationConfig
    || summary.apiStatus?.molecularTransferApplicationConfig?.applicationRequested !== false
    || summary.apiStatus?.molecularTransferApplicationConfig?.mutationEnabled !== false
    || summary.apiStatus?.molecularTransferApplicationConfig?.scientificMode !== false
    || summary.apiStatus?.molecularTransferApplicationConfig?.targetAdaptersValidated !== false
    || !Number.isFinite(summary.apiStatus?.molecularTransferApplicationConfig?.closedResidualToleranceProxy)
    || summary.apiStatus?.molecularTransferApplicationConfigApi?.mutationEnabled !== false) {
    throw new Error(`Expected default-off molecular transfer application config API/state: ${JSON.stringify(summary.apiStatus?.molecularTransferApplicationConfig || null)}`);
  }
  if (!summary.apiStatus?.hasConfigureMolecularTransferTransaction
    || !summary.apiStatus?.hasGetMolecularTransferTransactionConfig
    || summary.apiStatus?.molecularTransferTransactionConfig?.transactionEnabled !== false
    || summary.apiStatus?.molecularTransferTransactionConfig?.mutatorId !== null
    || summary.apiStatus?.molecularTransferTransactionConfigApi?.transactionEnabled !== false) {
    throw new Error(`Expected default-off molecular transfer transaction config API/state: ${JSON.stringify(summary.apiStatus?.molecularTransferTransactionConfig || null)}`);
  }
  if (!summary.apiStatus?.hasConfigureMolecularTargetMutationApply
    || !summary.apiStatus?.hasGetMolecularTargetMutationApplyConfig
    || !summary.apiStatus?.hasExecuteMolecularTargetMutationApply
    || !summary.apiStatus?.hasWarmMolecularSourceBufferTargets
    || summary.apiStatus?.molecularTargetMutationApplyConfig?.executionRequested !== false
    || summary.apiStatus?.molecularTargetMutationApplyConfig?.proxyApplyEnabled !== false
    || summary.apiStatus?.molecularTargetMutationApplyConfig?.targetApplyImplemented !== false
    || summary.apiStatus?.molecularTargetMutationApplyConfigApi?.executionRequested !== false
    || summary.apiStatus?.molecularSourceBufferWarmApi?.schema !== 'peercompute.multiscale.molecular-source-buffer-warm-api.v0'
    || summary.apiStatus?.molecularSourceBufferWarmApi?.status !== 'applied-proxy'
    || summary.apiStatus?.molecularSourceBufferWarmApi?.conservativeSourceBuffer?.dispatchableTargetCount !== 2
    || summary.apiStatus?.molecularSourceBufferWarmApi?.sourceBufferApplication?.appliedTargetCount !== 2
    || summary.apiStatus?.molecularSourceBufferWarmApi?.sourceBufferApplication?.quantumMaterialResponseDerivativeActiveTargetCount !== 2
    || summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-execution.v0'
    || summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.status !== 'applied-proxy'
    || summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.applied !== true
    || !(summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.appliedTargetCount >= 1)
    || summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.appliedTargetCount !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.targetCount
    || !(summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.appliedOperationCount >= 6)
    || summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.blockerCount !== 0
    || summary.apiStatus?.molecularTargetMutationApplyConfigAfterApi?.executionRequested !== true
    || summary.apiStatus?.molecularTargetMutationApplyConfigAfterApi?.proxyApplyEnabled !== true
    || summary.apiStatus?.molecularTargetMutationApplyConfigAfterApi?.targetApplyImplemented !== true) {
    throw new Error(`Expected default-off molecular target apply config with explicit API execution: ${JSON.stringify(summary.apiStatus?.molecularTargetMutationApplyExecutionApi || null)}`);
  }
  if (summary.apiStatus?.sourceBufferAcceptance?.schema !== 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
    || summary.apiStatus.sourceBufferAcceptance.acceptedTargetCount !== 2
    || summary.apiStatus.sourceBufferAcceptance.blockedTargetCount !== 0
    || summary.apiStatus.sourceBufferAcceptance.canMutateProxy !== true
    || summary.apiStatus?.sourceBufferWritebackValidation?.schema !== 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
    || summary.apiStatus.sourceBufferWritebackValidation.validatedTargetCount !== 2
    || summary.apiStatus.sourceBufferWritebackValidation.blockedTargetCount !== 0
    || summary.apiStatus.sourceBufferWritebackValidation.canWritebackProxy !== true
    || summary.apiStatus?.targetBufferReplayValidation?.schema !== 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
    || summary.apiStatus.targetBufferReplayValidation.replayedTargetCount !== 2
    || summary.apiStatus.targetBufferReplayValidation.blockedTargetCount !== 0
    || summary.apiStatus.targetBufferReplayValidation.missingFieldCount !== 0
    || summary.apiStatus?.targetBufferMutationAudit?.schema !== 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
    || summary.apiStatus.targetBufferMutationAudit.readyTargetCount !== 2
    || summary.apiStatus.targetBufferMutationAudit.readyWriteIntentCount !== summary.apiStatus.targetBufferMutationAudit.writeIntentCount
    || summary.apiStatus?.targetBufferWorkerWriteQueue?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
    || summary.apiStatus.targetBufferWorkerWriteQueue.queueReadyBatchCount !== summary.apiStatus.targetBufferWorkerWriteQueue.targetBatchCount
    || summary.apiStatus.targetBufferWorkerWriteQueue.queueReadyWriteIntentCount !== summary.apiStatus.targetBufferWorkerWriteQueue.writeIntentCount
    || summary.apiStatus.targetBufferWorkerWriteQueue.queueBlockedBatchCount !== 0) {
    throw new Error(`Expected direct getState source-buffer packets after qmat warm: ${JSON.stringify({
      acceptance: summary.apiStatus?.sourceBufferAcceptance,
      writeback: summary.apiStatus?.sourceBufferWritebackValidation,
      replay: summary.apiStatus?.targetBufferReplayValidation,
      audit: summary.apiStatus?.targetBufferMutationAudit,
      queue: summary.apiStatus?.targetBufferWorkerWriteQueue
    })}`);
  }
  if (summary.apiStatus?.packetSourceTransferTargetSourceIntake?.schema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
	    || summary.apiStatus?.packetSourceTransferTargetSourceIntake?.status !== 'ready'
	    || summary.apiStatus?.packetSourceTransferTargetSourceIntake?.activeTargetCount !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.appliedTargetCount
	    || summary.apiStatus?.packetSourceTransferTargetSourceIntake?.appliedOperationCount !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.appliedOperationCount
	    || !Number.isFinite(summary.apiStatus?.packetSourceTransferTargetSourceIntake?.totalHeatRateWProxy)
	    || !Number.isFinite(summary.apiStatus?.packetSourceTransferTargetSourceIntake?.maxThermalDrive)
	    || summary.apiStatus?.packetSourceTransferTargetSourceIntake?.maxThermalDrive < 0) {
    throw new Error(`Expected explicit apply execution to expose molecular source intake: ${JSON.stringify(summary.apiStatus?.packetSourceTransferTargetSourceIntake || null)}`);
  }
  const sourceIntakeWarmDelta = Object.values(summary.apiStatus?.sourceTransferTargetSourceIntakeDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-target-source-intake.v0');
  if (sourceIntakeWarmDelta?.payload?.status !== 'ready'
    || sourceIntakeWarmDelta?.payload?.activeTargetCount !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.appliedTargetCount
    || sourceIntakeWarmDelta?.payload?.appliedOperationCount !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.appliedOperationCount
    || !Number.isFinite(sourceIntakeWarmDelta?.payload?.totalHeatRateWProxy)
    || !Number.isFinite(sourceIntakeWarmDelta?.payload?.maxThermalDrive)
    || sourceIntakeWarmDelta?.payload?.maxThermalDrive < 0) {
    throw new Error(`Expected molecular source intake warm delta after explicit apply: ${JSON.stringify(sourceIntakeWarmDelta || null)}`);
  }
  if (summary.apiStatus?.packetSourceTransferTargetSourceResponse?.schema !== 'peercompute.multiscale.molecular-target-source-response.v0'
	    || summary.apiStatus?.packetSourceTransferTargetSourceResponse?.sourceIntakeSchema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
	    || summary.apiStatus?.packetSourceTransferTargetSourceResponse?.activeTargetCount !== summary.apiStatus?.packetSourceTransferTargetSourceIntake?.activeTargetCount
	    || summary.apiStatus?.packetSourceTransferTargetSourceResponse?.sourceApplyExecutionSequence !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.sequence
	    || !Number.isFinite(summary.apiStatus?.packetSourceTransferTargetSourceResponse?.pendingTargetCount)
	    || !Number.isFinite(summary.apiStatus?.packetSourceTransferTargetSourceResponse?.totalIntakeThermalDrive)
	    || !Number.isFinite(summary.apiStatus?.packetSourceTransferTargetSourceResponse?.totalResponseThermalDrive)) {
    throw new Error(`Expected molecular target-source response packet after explicit apply: ${JSON.stringify(summary.apiStatus?.packetSourceTransferTargetSourceResponse || null)}`);
  }
  const sourceResponseWarmDelta = Object.values(summary.apiStatus?.sourceTransferTargetSourceResponseDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-target-source-response.v0');
  if (sourceResponseWarmDelta?.payload?.sourceIntakeSchema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
    || sourceResponseWarmDelta?.payload?.activeTargetCount !== summary.apiStatus?.packetSourceTransferTargetSourceIntake?.activeTargetCount
    || sourceResponseWarmDelta?.payload?.sourceApplyExecutionSequence !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.sequence
    || !Number.isFinite(sourceResponseWarmDelta?.payload?.pendingTargetCount)
    || !Number.isFinite(sourceResponseWarmDelta?.payload?.totalIntakeThermalDrive)
    || !Number.isFinite(sourceResponseWarmDelta?.payload?.totalResponseThermalDrive)) {
    throw new Error(`Expected molecular target-source response warm delta after explicit apply: ${JSON.stringify(sourceResponseWarmDelta || null)}`);
  }
  if (summary.apiStatus?.packetSourceTransferTargetSourceReconciliation?.schema !== 'peercompute.multiscale.molecular-target-source-reconciliation.v0'
	    || summary.apiStatus?.packetSourceTransferTargetSourceReconciliation?.sourceIntakeSchema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
	    || summary.apiStatus?.packetSourceTransferTargetSourceReconciliation?.targetResponseSchema !== 'peercompute.multiscale.molecular-target-source-response.v0'
	    || summary.apiStatus?.packetSourceTransferTargetSourceReconciliation?.activeTargetCount !== summary.apiStatus?.packetSourceTransferTargetSourceIntake?.activeTargetCount
	    || summary.apiStatus?.packetSourceTransferTargetSourceReconciliation?.sourceApplyExecutionSequence !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.sequence
	    || !Number.isFinite(summary.apiStatus?.packetSourceTransferTargetSourceReconciliation?.pendingTargetCount)
	    || !Number.isFinite(summary.apiStatus?.packetSourceTransferTargetSourceReconciliation?.reconciliationResidualProxy)) {
    throw new Error(`Expected molecular target-source reconciliation packet after explicit apply: ${JSON.stringify(summary.apiStatus?.packetSourceTransferTargetSourceReconciliation || null)}`);
  }
  const sourceReconciliationWarmDelta = Object.values(summary.apiStatus?.sourceTransferTargetSourceReconciliationDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-target-source-reconciliation.v0');
  if (sourceReconciliationWarmDelta?.payload?.sourceIntakeSchema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
    || sourceReconciliationWarmDelta?.payload?.targetResponseSchema !== 'peercompute.multiscale.molecular-target-source-response.v0'
    || sourceReconciliationWarmDelta?.payload?.activeTargetCount !== summary.apiStatus?.packetSourceTransferTargetSourceIntake?.activeTargetCount
    || sourceReconciliationWarmDelta?.payload?.sourceApplyExecutionSequence !== summary.apiStatus?.molecularTargetMutationApplyExecutionApi?.sequence
    || !Number.isFinite(sourceReconciliationWarmDelta?.payload?.pendingTargetCount)
    || !Number.isFinite(sourceReconciliationWarmDelta?.payload?.reconciliationResidualProxy)) {
    throw new Error(`Expected molecular target-source reconciliation warm delta after explicit apply: ${JSON.stringify(sourceReconciliationWarmDelta || null)}`);
  }
  if (summary.apiStatus?.packetConservativeSourceBuffer?.schema !== 'peercompute.multiscale.molecular-conservative-source-buffer.v0'
	    || summary.apiStatus?.packetConservativeSourceBuffer?.sourceEquationSchema !== 'peercompute.multiscale.molecular-source-equation.v0'
	    || summary.apiStatus?.packetConservativeSourceBuffer?.sourceIntakeSchema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
	    || summary.apiStatus?.packetConservativeSourceBuffer?.targetReconciliationSchema !== 'peercompute.multiscale.molecular-target-source-reconciliation.v0'
	    || summary.apiStatus?.packetConservativeSourceBuffer?.activeTargetCount !== summary.apiStatus?.packetSourceTransferTargetSourceIntake?.activeTargetCount
	    || summary.apiStatus?.packetConservativeSourceBuffer?.dispatchableTargetCount !== summary.apiStatus?.packetSourceTransferTargetSourceIntake?.activeTargetCount
	    || summary.apiStatus?.packetConservativeSourceBuffer?.bufferStrideFloats !== 8
	    || !(summary.apiStatus?.packetConservativeSourceBuffer?.sourceTermCount >= 8)
	    || !Number.isFinite(summary.apiStatus?.packetConservativeSourceBuffer?.totalHeatRateWProxy)
	    || !Number.isFinite(summary.apiStatus?.packetConservativeSourceBuffer?.sourceBufferResidualProxy)) {
    throw new Error(`Expected molecular conservative source buffer packet after explicit apply: ${JSON.stringify(summary.apiStatus?.packetConservativeSourceBuffer || null)}`);
  }
  const conservativeSourceBufferWarmDelta = Object.values(summary.apiStatus?.conservativeSourceBufferDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-conservative-source-buffer.v0');
  if (conservativeSourceBufferWarmDelta?.payload?.sourceIntakeSchema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
    || conservativeSourceBufferWarmDelta?.payload?.activeTargetCount !== summary.apiStatus?.packetConservativeSourceBuffer?.activeTargetCount
    || conservativeSourceBufferWarmDelta?.payload?.bufferStrideFloats !== 8
    || !(conservativeSourceBufferWarmDelta?.payload?.sourceTermCount >= 8)
    || !Number.isFinite(conservativeSourceBufferWarmDelta?.payload?.sourceBufferResidualProxy)) {
    throw new Error(`Expected molecular conservative source buffer warm delta after explicit apply: ${JSON.stringify(conservativeSourceBufferWarmDelta || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetSourceBufferApplication?.reactive?.schema !== 'peercompute.multiscale.molecular-source-buffer-application.v0'
    || summary.sourceBufferApplicationApi?.packetSourceBufferApplication?.sph?.schema !== 'peercompute.multiscale.molecular-source-buffer-application.v0'
    || summary.sourceBufferApplicationApi?.packetSourceBufferApplication?.schema !== 'peercompute.multiscale.molecular-source-buffer-application-aggregate.v0'
    || !(summary.sourceBufferApplicationApi?.packetSourceBufferApplication?.appliedTargetCount >= 1)
    || !(summary.sourceBufferApplicationApi?.packetSourceBufferApplication?.appliedFieldCount >= 4)
    || !(summary.sourceBufferApplicationApi?.packetSourceBufferApplication?.sourceTermCount >= 8)
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetSourceBufferApplication?.residual)) {
    throw new Error(`Expected molecular source-buffer application aggregate after explicit apply: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetSourceBufferApplication || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance?.schema !== 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
    || summary.sourceBufferApplicationApi?.packetSourceBufferAcceptanceAggregate?.schema !== 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
    || !(summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance?.acceptedTargetCount >= 1)
    || summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance?.blockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance?.canMutateProxy !== true
    || summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance?.scientificMutationReady !== false
    || !(summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance?.sourceTermCount >= 8)
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance?.maxApplicationResidualProxy)) {
    throw new Error(`Expected molecular source-buffer acceptance packet after target worker consume: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetSourceBufferAcceptance || null)}`);
  }
  const sourceBufferApplicationWarmDelta = Object.values(summary.sourceBufferApplicationApi?.deltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-source-buffer-application-aggregate.v0');
  if (summary.sourceBufferApplicationApi?.state?.scope !== 'multiscale-source-buffer-applications'
    || !(summary.sourceBufferApplicationApi?.state?.warmDeltaCount >= 1)
    || sourceBufferApplicationWarmDelta?.payload?.reactive?.schema !== 'peercompute.multiscale.molecular-source-buffer-application.v0'
    || sourceBufferApplicationWarmDelta?.payload?.sph?.schema !== 'peercompute.multiscale.molecular-source-buffer-application.v0'
    || !(sourceBufferApplicationWarmDelta?.payload?.appliedTargetCount >= 1)
    || !(sourceBufferApplicationWarmDelta?.payload?.appliedFieldCount >= 4)
    || !(sourceBufferApplicationWarmDelta?.payload?.sourceTermCount >= 8)
    || !Number.isFinite(sourceBufferApplicationWarmDelta?.payload?.residual)) {
    throw new Error(`Expected molecular source-buffer application warm delta after target worker consume: ${JSON.stringify(sourceBufferApplicationWarmDelta || null)}`);
  }
  const sourceBufferAcceptanceWarmDelta = Object.values(summary.sourceBufferApplicationApi?.acceptanceDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
      && entry.payload.blockedTargetCount === 0
      && entry.payload.canMutateProxy === true);
  if (summary.sourceBufferApplicationApi?.acceptanceState?.scope !== 'multiscale-source-buffer-acceptances'
    || !(summary.sourceBufferApplicationApi?.acceptanceState?.warmDeltaCount >= 1)
    || !(sourceBufferAcceptanceWarmDelta?.payload?.acceptedTargetCount >= 1)
    || sourceBufferAcceptanceWarmDelta?.payload?.blockedTargetCount !== 0
    || sourceBufferAcceptanceWarmDelta?.payload?.canMutateProxy !== true
    || sourceBufferAcceptanceWarmDelta?.payload?.scientificMutationReady !== false
    || !(sourceBufferAcceptanceWarmDelta?.payload?.sourceTermCount >= 8)
    || !Number.isFinite(sourceBufferAcceptanceWarmDelta?.payload?.maxApplicationResidualProxy)) {
    throw new Error(`Expected molecular source-buffer acceptance warm delta after target worker consume: ${JSON.stringify(sourceBufferAcceptanceWarmDelta || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation?.schema !== 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
    || summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidationAggregate?.schema !== 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
    || !(summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation?.validatedTargetCount >= 1)
    || summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation?.blockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation?.canWritebackProxy !== true
    || summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation?.scientificWritebackReady !== false
    || !(summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation?.sourceTermCount >= 8)
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation?.maxWritebackResidualProxy)) {
    throw new Error(`Expected molecular source-buffer writeback-validation packet after target worker consume: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetSourceBufferWritebackValidation || null)}`);
  }
  const sourceBufferWritebackValidationWarmDelta = Object.values(summary.sourceBufferApplicationApi?.writebackValidationDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
      && entry.payload.blockedTargetCount === 0
      && entry.payload.canWritebackProxy === true);
  if (summary.sourceBufferApplicationApi?.writebackValidationState?.scope !== 'multiscale-source-buffer-writeback-validations'
    || !(summary.sourceBufferApplicationApi?.writebackValidationState?.warmDeltaCount >= 1)
    || !(sourceBufferWritebackValidationWarmDelta?.payload?.validatedTargetCount >= 1)
    || sourceBufferWritebackValidationWarmDelta?.payload?.blockedTargetCount !== 0
    || sourceBufferWritebackValidationWarmDelta?.payload?.canWritebackProxy !== true
    || sourceBufferWritebackValidationWarmDelta?.payload?.scientificWritebackReady !== false
    || !(sourceBufferWritebackValidationWarmDelta?.payload?.sourceTermCount >= 8)
    || !Number.isFinite(sourceBufferWritebackValidationWarmDelta?.payload?.maxWritebackResidualProxy)) {
    throw new Error(`Expected molecular source-buffer writeback-validation warm delta after target worker consume: ${JSON.stringify(sourceBufferWritebackValidationWarmDelta || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.schema !== 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidationAggregate?.schema !== 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.replayedTargetCount >= 1)
    || summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.blockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.canReplayProxy !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.scientificReplayReady !== false
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.applicationFieldCount >= 4)
    || summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.missingFieldCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation?.maxReplayResidualProxy)) {
    throw new Error(`Expected molecular target-buffer replay-validation packet after writeback validation: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetTargetBufferReplayValidation || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.schema !== 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferMutationAuditAggregate?.schema !== 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.sourceTargetBufferReplayValidationSchema !== 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.readyTargetCount >= 1)
    || summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.blockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.canMutateProxy !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.canQueueWorkerWrite !== false
    || summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.scientificMutationReady !== false
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.readyWriteIntentCount >= 4)
    || summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.readyWriteIntentCount !== summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.writeIntentCount
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit?.maxMutationAuditResidualProxy)) {
    throw new Error(`Expected molecular target-buffer mutation-audit packet after replay validation: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetTargetBufferMutationAudit || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueueAggregate?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.sourceTargetBufferMutationAuditSchema !== 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.queueReadyBatchCount >= 1)
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.queueReadyBatchCount !== summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.targetBatchCount
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.queueBlockedBatchCount !== 0
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.canPlanWorkerWrite !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.canQueueWorkerWrite !== false
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.scientificMutationReady !== false
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.queueReadyWriteIntentCount >= 4)
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.queueReadyWriteIntentCount !== summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.writeIntentCount
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.queuedWriteIntentCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.maxQueueResidualProxy)
    || !summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue?.blockers?.includes('worker-buffer-write-path-not-implemented')) {
    throw new Error(`Expected molecular target-buffer worker-write queue packet after mutation audit: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteQueue || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.writerExecutionApi?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0'
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.sourceTargetBufferWorkerWriteQueueSchema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
    || !(summary.sourceBufferApplicationApi?.writerExecutionApi?.appliedBatchCount >= 1)
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.appliedBatchCount !== summary.sourceBufferApplicationApi?.writerExecutionApi?.targetBatchCount
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.blockedBatchCount !== 0
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.canExecuteProxy !== true
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.workerWriteExecuted !== true
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.applied !== true
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.scientificMutationReady !== false
    || !(summary.sourceBufferApplicationApi?.writerExecutionApi?.appliedWriteIntentCount >= 4)
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.appliedWriteIntentCount !== summary.sourceBufferApplicationApi?.writerExecutionApi?.writeIntentCount
    || summary.sourceBufferApplicationApi?.writerExecutionApi?.skippedWriteIntentCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.writerExecutionApi?.maxWorkerWriteResidualProxy)) {
    throw new Error(`Expected molecular target-buffer worker-write execution API after queue-ready wait: ${JSON.stringify(summary.sourceBufferApplicationApi?.writerExecutionApi || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecutionAggregate?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.sourceTargetBufferWorkerWriteQueueSchema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.appliedBatchCount >= 1)
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.appliedBatchCount !== summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.targetBatchCount
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.blockedBatchCount !== 0
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.canExecuteProxy !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.workerWriteExecuted !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.applied !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.scientificMutationReady !== false
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.appliedWriteIntentCount >= 4)
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.appliedWriteIntentCount !== summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.writeIntentCount
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.skippedWriteIntentCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution?.maxWorkerWriteResidualProxy)) {
    throw new Error(`Expected molecular target-buffer worker-write execution packet after explicit writer API: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteExecution || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerificationAggregate?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0'
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.sourceTargetBufferWorkerWriteExecutionSchema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0'
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.verifiedTargetCount >= 1)
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.verifiedTargetCount !== summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.targetBatchCount
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.blockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.canVerifyProxy !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.verified !== true
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.scientificMutationReady !== false
    || !(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.verifiedFieldWriteCount >= 4)
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.verifiedFieldWriteCount !== summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.fieldWriteCount
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.missingFieldWriteCount !== 0
    || summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.mismatchedFieldWriteCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification?.maxVerificationResidualProxy)) {
    throw new Error(`Expected molecular target-buffer worker-write verification packet after explicit writer API: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetTargetBufferWorkerWriteVerification || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.directSourceBufferAcceptance?.schema !== 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
    || summary.sourceBufferApplicationApi.directSourceBufferAcceptance.acceptedTargetCount !== 2
    || summary.sourceBufferApplicationApi.directSourceBufferAcceptance.blockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.directSourceBufferWritebackValidation?.schema !== 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
    || summary.sourceBufferApplicationApi.directSourceBufferWritebackValidation.validatedTargetCount !== 2
    || summary.sourceBufferApplicationApi.directSourceBufferWritebackValidation.blockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.directTargetBufferReplayValidation?.schema !== 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
    || summary.sourceBufferApplicationApi.directTargetBufferReplayValidation.replayedTargetCount !== 2
    || summary.sourceBufferApplicationApi.directTargetBufferReplayValidation.missingFieldCount !== 0
    || summary.sourceBufferApplicationApi?.directTargetBufferMutationAudit?.schema !== 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
    || summary.sourceBufferApplicationApi.directTargetBufferMutationAudit.readyTargetCount !== 2
    || summary.sourceBufferApplicationApi.directTargetBufferMutationAudit.readyWriteIntentCount !== summary.sourceBufferApplicationApi.directTargetBufferMutationAudit.writeIntentCount
    || summary.sourceBufferApplicationApi?.directTargetBufferWorkerWriteQueue?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteQueue.queueReadyWriteIntentCount !== summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteQueue.writeIntentCount
    || summary.sourceBufferApplicationApi?.directTargetBufferWorkerWriteExecution?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0'
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteExecution.applied !== true
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteExecution.appliedWriteIntentCount !== summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteExecution.writeIntentCount
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteExecution.blockedBatchCount !== 0
    || summary.sourceBufferApplicationApi?.directTargetBufferWorkerWriteVerification?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0'
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteVerification.verified !== true
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteVerification.verifiedFieldWriteCount !== summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteVerification.fieldWriteCount
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteVerification.missingFieldWriteCount !== 0
    || summary.sourceBufferApplicationApi.directTargetBufferWorkerWriteVerification.mismatchedFieldWriteCount !== 0
    || summary.sourceBufferApplicationApi?.directMolecularScientificInvariantGate?.schema !== 'peercompute.multiscale.molecular-scientific-invariant-gate.v0'
    || summary.sourceBufferApplicationApi.directMolecularScientificInvariantGate.canPromoteProxy !== true
    || summary.sourceBufferApplicationApi?.directMolecularScientificReadinessManifest?.schema !== 'peercompute.multiscale.molecular-scientific-readiness-manifest.v0'
    || summary.sourceBufferApplicationApi.directMolecularScientificReadinessManifest.canPromoteProxy !== true) {
    throw new Error(`Expected direct getState source-buffer writer packets after explicit writer API: ${JSON.stringify({
      acceptance: summary.sourceBufferApplicationApi?.directSourceBufferAcceptance,
      writeback: summary.sourceBufferApplicationApi?.directSourceBufferWritebackValidation,
      replay: summary.sourceBufferApplicationApi?.directTargetBufferReplayValidation,
      audit: summary.sourceBufferApplicationApi?.directTargetBufferMutationAudit,
      queue: summary.sourceBufferApplicationApi?.directTargetBufferWorkerWriteQueue,
      execution: summary.sourceBufferApplicationApi?.directTargetBufferWorkerWriteExecution,
      verification: summary.sourceBufferApplicationApi?.directTargetBufferWorkerWriteVerification,
      invariantGate: summary.sourceBufferApplicationApi?.directMolecularScientificInvariantGate,
      readinessManifest: summary.sourceBufferApplicationApi?.directMolecularScientificReadinessManifest
    })}`);
  }
  const targetBufferReplayValidationWarmDelta = Object.values(summary.sourceBufferApplicationApi?.replayValidationDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
      && entry.payload.blockedTargetCount === 0
      && entry.payload.canReplayProxy === true
      && entry.payload.missingFieldCount === 0);
  if (summary.sourceBufferApplicationApi?.replayValidationState?.scope !== 'multiscale-target-buffer-replay-validations'
    || !(summary.sourceBufferApplicationApi?.replayValidationState?.warmDeltaCount >= 1)
    || !(targetBufferReplayValidationWarmDelta?.payload?.replayedTargetCount >= 1)
    || targetBufferReplayValidationWarmDelta?.payload?.blockedTargetCount !== 0
    || targetBufferReplayValidationWarmDelta?.payload?.canReplayProxy !== true
    || targetBufferReplayValidationWarmDelta?.payload?.scientificReplayReady !== false
    || !(targetBufferReplayValidationWarmDelta?.payload?.replayedFieldCount >= 4)
    || targetBufferReplayValidationWarmDelta?.payload?.missingFieldCount !== 0
    || !Number.isFinite(targetBufferReplayValidationWarmDelta?.payload?.maxReplayResidualProxy)) {
    throw new Error(`Expected molecular target-buffer replay-validation warm delta after writeback validation: ${JSON.stringify(targetBufferReplayValidationWarmDelta || null)}`);
  }
  const targetBufferMutationAuditWarmDelta = Object.values(summary.sourceBufferApplicationApi?.mutationAuditDeltasApi || {})
    .find((entry) => entry?.payload?.schema === 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
      && entry.payload.blockedTargetCount === 0
      && entry.payload.canMutateProxy === true
      && entry.payload.canQueueWorkerWrite === false);
  if (summary.sourceBufferApplicationApi?.mutationAuditState?.scope !== 'multiscale-target-buffer-mutation-audits'
    || !(summary.sourceBufferApplicationApi?.mutationAuditState?.warmDeltaCount >= 1)
    || !(targetBufferMutationAuditWarmDelta?.payload?.readyTargetCount >= 1)
    || targetBufferMutationAuditWarmDelta?.payload?.blockedTargetCount !== 0
    || targetBufferMutationAuditWarmDelta?.payload?.canMutateProxy !== true
    || targetBufferMutationAuditWarmDelta?.payload?.canQueueWorkerWrite !== false
    || targetBufferMutationAuditWarmDelta?.payload?.scientificMutationReady !== false
    || !(targetBufferMutationAuditWarmDelta?.payload?.readyWriteIntentCount >= 4)
    || targetBufferMutationAuditWarmDelta?.payload?.readyWriteIntentCount !== targetBufferMutationAuditWarmDelta?.payload?.writeIntentCount
    || !Number.isFinite(targetBufferMutationAuditWarmDelta?.payload?.maxMutationAuditResidualProxy)) {
    throw new Error(`Expected molecular target-buffer mutation-audit warm delta after replay validation: ${JSON.stringify(targetBufferMutationAuditWarmDelta || null)}`);
  }
  const targetBufferWorkerWriteQueueWarmDelta = Object.values(summary.sourceBufferApplicationApi?.workerWriteQueueDeltasApi || {})
    .sort((a, b) => Number(b?.version || 0) - Number(a?.version || 0))[0];
  if (summary.sourceBufferApplicationApi?.workerWriteQueueState?.scope !== 'multiscale-target-buffer-worker-write-queues'
    || !(summary.sourceBufferApplicationApi?.workerWriteQueueState?.warmDeltaCount >= 1)
    || !(targetBufferWorkerWriteQueueWarmDelta?.payload?.queueReadyBatchCount >= 1)
    || targetBufferWorkerWriteQueueWarmDelta?.payload?.queueReadyBatchCount !== targetBufferWorkerWriteQueueWarmDelta?.payload?.targetBatchCount
    || targetBufferWorkerWriteQueueWarmDelta?.payload?.queueBlockedBatchCount !== 0
    || targetBufferWorkerWriteQueueWarmDelta?.payload?.canPlanWorkerWrite !== true
    || targetBufferWorkerWriteQueueWarmDelta?.payload?.canQueueWorkerWrite !== false
    || targetBufferWorkerWriteQueueWarmDelta?.payload?.scientificMutationReady !== false
    || !(targetBufferWorkerWriteQueueWarmDelta?.payload?.queueReadyWriteIntentCount >= 4)
    || targetBufferWorkerWriteQueueWarmDelta?.payload?.queueReadyWriteIntentCount !== targetBufferWorkerWriteQueueWarmDelta?.payload?.writeIntentCount
    || targetBufferWorkerWriteQueueWarmDelta?.payload?.queuedWriteIntentCount !== 0
    || !Number.isFinite(targetBufferWorkerWriteQueueWarmDelta?.payload?.maxQueueResidualProxy)) {
    throw new Error(`Expected molecular target-buffer worker-write queue warm delta after mutation audit: ${JSON.stringify(targetBufferWorkerWriteQueueWarmDelta || null)}`);
  }
  const targetBufferWorkerWriteExecutionWarmDelta = Object.values(summary.sourceBufferApplicationApi?.workerWriteExecutionDeltasApi || {})
    .sort((a, b) => Number(b?.version || 0) - Number(a?.version || 0))[0];
  if (summary.sourceBufferApplicationApi?.workerWriteExecutionState?.scope !== 'multiscale-target-buffer-worker-write-executions'
    || !(summary.sourceBufferApplicationApi?.workerWriteExecutionState?.warmDeltaCount >= 1)
    || !(targetBufferWorkerWriteExecutionWarmDelta?.payload?.appliedBatchCount >= 1)
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.appliedBatchCount !== targetBufferWorkerWriteExecutionWarmDelta?.payload?.targetBatchCount
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.blockedBatchCount !== 0
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.canExecuteProxy !== true
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.workerWriteExecuted !== true
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.applied !== true
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.scientificMutationReady !== false
    || !(targetBufferWorkerWriteExecutionWarmDelta?.payload?.appliedWriteIntentCount >= 4)
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.appliedWriteIntentCount !== targetBufferWorkerWriteExecutionWarmDelta?.payload?.writeIntentCount
    || targetBufferWorkerWriteExecutionWarmDelta?.payload?.skippedWriteIntentCount !== 0
    || !Number.isFinite(targetBufferWorkerWriteExecutionWarmDelta?.payload?.maxWorkerWriteResidualProxy)) {
    throw new Error(`Expected molecular target-buffer worker-write execution warm delta after explicit writer API: ${JSON.stringify(targetBufferWorkerWriteExecutionWarmDelta || null)}`);
  }
  const targetBufferWorkerWriteVerificationWarmDelta = Object.values(summary.sourceBufferApplicationApi?.workerWriteVerificationDeltasApi || {})
    .sort((a, b) => Number(b?.version || 0) - Number(a?.version || 0))[0];
  if (summary.sourceBufferApplicationApi?.workerWriteVerificationState?.scope !== 'multiscale-target-buffer-worker-write-verifications'
    || !(summary.sourceBufferApplicationApi?.workerWriteVerificationState?.warmDeltaCount >= 1)
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0'
    || !(targetBufferWorkerWriteVerificationWarmDelta?.payload?.verifiedTargetCount >= 1)
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.verifiedTargetCount !== targetBufferWorkerWriteVerificationWarmDelta?.payload?.targetBatchCount
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.blockedTargetCount !== 0
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.canVerifyProxy !== true
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.verified !== true
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.scientificMutationReady !== false
    || !(targetBufferWorkerWriteVerificationWarmDelta?.payload?.verifiedFieldWriteCount >= 4)
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.verifiedFieldWriteCount !== targetBufferWorkerWriteVerificationWarmDelta?.payload?.fieldWriteCount
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.missingFieldWriteCount !== 0
    || targetBufferWorkerWriteVerificationWarmDelta?.payload?.mismatchedFieldWriteCount !== 0
    || !Number.isFinite(targetBufferWorkerWriteVerificationWarmDelta?.payload?.maxVerificationResidualProxy)) {
    throw new Error(`Expected molecular target-buffer worker-write verification warm delta after explicit writer API: ${JSON.stringify(targetBufferWorkerWriteVerificationWarmDelta || null)}`);
  }
  const scientificInvariantGateWarmDelta = Object.values(summary.sourceBufferApplicationApi?.scientificInvariantGateDeltasApi || {})
    .sort((a, b) => Number(b?.version || 0) - Number(a?.version || 0))[0];
  if (summary.sourceBufferApplicationApi?.scientificInvariantGateState?.scope !== 'multiscale-scientific-invariant-gates'
    || !(summary.sourceBufferApplicationApi?.scientificInvariantGateState?.warmDeltaCount >= 1)
    || scientificInvariantGateWarmDelta?.payload?.schema !== 'peercompute.multiscale.molecular-scientific-invariant-gate.v0'
    || scientificInvariantGateWarmDelta?.payload?.status !== 'proxy-verified-scientific-blocked'
    || scientificInvariantGateWarmDelta?.payload?.workerWriteVerified !== true
    || scientificInvariantGateWarmDelta?.payload?.canPromoteProxy !== true
    || scientificInvariantGateWarmDelta?.payload?.scientificMutationReady !== false
    || !(scientificInvariantGateWarmDelta?.payload?.requiredScopeCount >= 7)
    || !(scientificInvariantGateWarmDelta?.payload?.proxySatisfiedScopeCount >= 4)
    || scientificInvariantGateWarmDelta?.payload?.authoritativeSatisfiedScopeCount !== 0
    || scientificInvariantGateWarmDelta?.payload?.blockedScopeCount !== scientificInvariantGateWarmDelta?.payload?.requiredScopeCount
    || !scientificInvariantGateWarmDelta?.payload?.scientificBlockers?.includes('authoritative-gpu-buffer-mutation-required')) {
    throw new Error(`Expected molecular scientific invariant gate warm delta after explicit writer API: ${JSON.stringify(scientificInvariantGateWarmDelta || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetMolecularScientificInvariantGate?.schema !== 'peercompute.multiscale.molecular-scientific-invariant-gate.v0'
    || summary.sourceBufferApplicationApi?.packetMolecularScientificInvariantGate?.canPromoteProxy !== true
    || summary.sourceBufferApplicationApi?.packetMolecularScientificInvariantGate?.scientificMutationReady !== false
    || summary.sourceBufferApplicationApi?.packetMolecularScientificInvariantGateAggregate?.schema !== 'peercompute.multiscale.molecular-scientific-invariant-gate.v0') {
    throw new Error(`Expected molecular scientific invariant gate packet after explicit writer API: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetMolecularScientificInvariantGate || null)}`);
  }
  const scientificReadinessManifestWarmDelta = Object.values(summary.sourceBufferApplicationApi?.scientificReadinessManifestDeltasApi || {})
    .sort((a, b) => Number(b?.version || 0) - Number(a?.version || 0))[0];
  if (summary.sourceBufferApplicationApi?.scientificReadinessManifestState?.scope !== 'multiscale-scientific-readiness-manifests'
    || !(summary.sourceBufferApplicationApi?.scientificReadinessManifestState?.warmDeltaCount >= 1)
    || scientificReadinessManifestWarmDelta?.payload?.schema !== 'peercompute.multiscale.molecular-scientific-readiness-manifest.v0'
    || scientificReadinessManifestWarmDelta?.payload?.status !== 'proxy-promotable-authoritative-artifacts-blocked'
    || scientificReadinessManifestWarmDelta?.payload?.canPromoteProxy !== true
    || scientificReadinessManifestWarmDelta?.payload?.scientificMutationReady !== false
    || scientificReadinessManifestWarmDelta?.payload?.manifestComplete !== false
    || !(scientificReadinessManifestWarmDelta?.payload?.requiredArtifactCount >= 7)
    || !(scientificReadinessManifestWarmDelta?.payload?.proxySatisfiedArtifactCount >= 4)
    || scientificReadinessManifestWarmDelta?.payload?.authoritativeReadyArtifactCount !== 0
    || scientificReadinessManifestWarmDelta?.payload?.blockedArtifactCount !== scientificReadinessManifestWarmDelta?.payload?.requiredArtifactCount
    || scientificReadinessManifestWarmDelta?.payload?.nextRequiredArtifactId !== 'authoritative-gpu-worker-buffer-writer'
    || !scientificReadinessManifestWarmDelta?.payload?.blockers?.includes('worker-buffer-writeback-hook-required')) {
    throw new Error(`Expected molecular scientific readiness manifest warm delta after explicit writer API: ${JSON.stringify(scientificReadinessManifestWarmDelta || null)}`);
  }
  if (summary.sourceBufferApplicationApi?.packetMolecularScientificReadinessManifest?.schema !== 'peercompute.multiscale.molecular-scientific-readiness-manifest.v0'
    || summary.sourceBufferApplicationApi?.packetMolecularScientificReadinessManifest?.canPromoteProxy !== true
    || summary.sourceBufferApplicationApi?.packetMolecularScientificReadinessManifest?.scientificMutationReady !== false
    || summary.sourceBufferApplicationApi?.packetMolecularScientificReadinessManifestAggregate?.schema !== 'peercompute.multiscale.molecular-scientific-readiness-manifest.v0') {
    throw new Error(`Expected molecular scientific readiness manifest packet after explicit writer API: ${JSON.stringify(summary.sourceBufferApplicationApi?.packetMolecularScientificReadinessManifest || null)}`);
  }
  if (!(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferReplayValidatedCount >= 1)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferReplayBlockedCount !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferReplayCanReplayProxy !== 1
    || !(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferReplayFieldCount >= 4)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferReplayMissingFieldCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferReplayResidual)) {
    throw new Error(`Expected molecular target-buffer replay conservation exchange: ${JSON.stringify(summary.sourceBufferApplicationApi?.conservationExchange || null)}`);
  }
  if (!(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditReadyCount >= 1)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditBlockedCount !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditCanMutateProxy !== 1
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditCanQueueWorkerWrite !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditScientificReady !== 0
    || !(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditWriteIntentCount >= 4)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditBlockedWriteIntentCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferMutationAuditResidual)) {
    throw new Error(`Expected molecular target-buffer mutation-audit conservation exchange: ${JSON.stringify(summary.sourceBufferApplicationApi?.conservationExchange || null)}`);
  }
  if (!(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueReadyBatchCount >= 1)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueReadyBatchCount !== summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueBatchCount
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueBlockedBatchCount !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueCanPlan !== 1
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite !== 0
    || !(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueWriteIntentCount >= 4)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteQueueResidual)) {
    throw new Error(`Expected molecular target-buffer worker-write queue conservation exchange: ${JSON.stringify(summary.sourceBufferApplicationApi?.conservationExchange || null)}`);
  }
  if (!(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount >= 1)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount !== summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionBatchCount
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionCanExecute !== 1
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionApplied !== 1
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionScientificReady !== 0
    || !(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount >= 4)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteExecutionResidual)) {
    throw new Error(`Expected molecular target-buffer worker-write execution conservation exchange: ${JSON.stringify(summary.sourceBufferApplicationApi?.conservationExchange || null)}`);
  }
  if (!(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount >= 1)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount !== summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationTargetCount
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationCanVerify !== 1
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationVerified !== 1
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationScientificReady !== 0
    || !(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount >= 4)
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount !== 0
    || summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount !== 0
    || !Number.isFinite(summary.sourceBufferApplicationApi?.conservationExchange?.molecularTargetBufferWorkerWriteVerificationResidual)) {
    throw new Error(`Expected molecular target-buffer worker-write verification conservation exchange: ${JSON.stringify(summary.sourceBufferApplicationApi?.conservationExchange || null)}`);
  }
  if (!(summary.conservation?.exchange?.molecularSourceTransferAllocationCount >= 1)
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferAllocatedHeatRateWProxy?.unit !== 'W-proxy'
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferClosedResidualWProxy?.dimensions !== 'M L^2 T^-3'
    || !Number.isFinite(summary.conservation?.exchange?.molecularSourceTransferClosedResidualWProxy)
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferApplicationCanApply?.unit !== '1'
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferApplicationClosedResidualWProxy?.unit !== 'W-proxy'
    || summary.conservation?.exchange?.molecularSourceTransferApplicationCanApply !== 0
    || !(summary.conservation?.exchange?.molecularSourceTransferApplicationBlockedTargetCount >= 1)
    || summary.conservation?.exchange?.molecularSourceTransferApplicationAppliedTargetCount !== 0
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferTargetPreviewCount?.unit !== '1'
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferTargetPreviewTotalHeatRateWProxy?.unit !== 'W-proxy'
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferTargetPreviewTotalHeatRateWProxy?.dimensions !== 'M L^2 T^-3'
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferTargetPreviewMaxDeltaK?.unit !== 'K-proxy'
    || summary.conservation?.exchangeMetadata?.molecularSourceTransferTargetPreviewMaxDeltaK?.dimensions !== 'Theta'
    || !(summary.conservation?.exchange?.molecularSourceTransferTargetPreviewCount >= 1)
    || !(summary.conservation?.exchange?.molecularSourceTransferTargetPreviewBlockedTargetCount >= 1)
    || summary.conservation?.exchange?.molecularSourceTransferTargetPreviewAppliedTargetCount !== 0
    || !Number.isFinite(summary.conservation?.exchange?.molecularSourceTransferTargetPreviewTotalHeatRateWProxy)
    || !Number.isFinite(summary.conservation?.exchange?.molecularSourceTransferTargetPreviewTotalSpeciesRateProxy)
    || !Number.isFinite(summary.conservation?.exchange?.molecularSourceTransferTargetPreviewMaxDeltaK)
    || !Number.isFinite(summary.conservation?.exchange?.molecularSourceTransferTargetPreviewMaxPhaseDrive)
    || summary.conservation?.exchangeMetadata?.molecularTargetMutatorRegistryTargetCount?.unit !== '1'
    || summary.conservation?.exchangeMetadata?.molecularTargetMutatorRegistryValidatedCount?.unit !== '1'
    || !(summary.conservation?.exchange?.molecularTargetMutatorRegistryTargetCount >= 1)
    || !(summary.conservation?.exchange?.molecularTargetMutatorRegistryRegisteredCount >= 1)
    || summary.conservation?.exchange?.molecularTargetMutatorRegistryValidatedCount !== 0
    || !(summary.conservation?.exchange?.molecularTargetMutatorRegistryBlockedCount >= 1)
    || !(summary.conservation?.exchange?.molecularTargetMutatorRegistryDeclaredFieldCount >= 6)
    || !(summary.conservation?.exchange?.molecularTargetMutatorRegistryInvariantScopeCount >= 3)
    || summary.conservation?.exchangeMetadata?.molecularTargetMutationPreflightTargetCount?.unit !== '1'
    || summary.conservation?.exchangeMetadata?.molecularTargetMutationPreflightMaxResidualRisk?.unit !== '1'
    || summary.conservation?.exchangeMetadata?.molecularTargetMutationPreflightMaxDeltaK?.unit !== 'K-proxy'
    || !(summary.conservation?.exchange?.molecularTargetMutationPreflightTargetCount >= 1)
    || summary.conservation?.exchange?.molecularTargetMutationPreflightPassedCount !== 0
    || !(summary.conservation?.exchange?.molecularTargetMutationPreflightBlockedCount >= 1)
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetMutationPreflightMaxResidualRisk)
    || summary.conservation?.exchangeMetadata?.molecularTargetMutationOperationPlanOperationCount?.unit !== '1'
    || summary.conservation?.exchangeMetadata?.molecularTargetMutationOperationPlanMaxDelta?.unit !== 'mixed-proxy'
    || summary.conservation?.exchangeMetadata?.molecularTargetMutationOperationPlanMaxDeltaK?.unit !== 'K-proxy'
    || !(summary.conservation?.exchange?.molecularTargetMutationOperationPlanTargetCount >= 1)
    || !(summary.conservation?.exchange?.molecularTargetMutationOperationPlanOperationCount >= 6)
    || summary.conservation?.exchange?.molecularTargetMutationOperationPlanAllowedCount !== summary.conservation?.exchange?.molecularTargetMutationOperationPlanOperationCount
    || summary.conservation?.exchange?.molecularTargetMutationOperationPlanBlockedCount !== summary.conservation?.exchange?.molecularTargetMutationOperationPlanOperationCount
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetMutationOperationPlanMaxDelta)
    || summary.conservation?.exchangeMetadata?.molecularTargetSourceResponseHeatFlux?.unit !== 'W/m^2-proxy'
    || summary.conservation?.exchangeMetadata?.molecularTargetSourceResponseMaxTemperatureK?.unit !== 'K'
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetSourceIntakeThermalDrive)
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetSourceResponseRespondedCount)
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetSourceResponsePendingCount)
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetSourceResponseHeatFlux)
    || summary.conservation?.exchangeMetadata?.molecularTargetSourceReconciliationHeatFlux?.unit !== 'W/m^2-proxy'
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetSourceReconciliationReconciledCount)
    || !Number.isFinite(summary.conservation?.exchange?.molecularTargetSourceReconciliationResidual)
    || summary.conservation?.exchangeMetadata?.molecularConservativeSourceBufferHeatRate?.unit !== 'W-proxy'
    || summary.conservation?.exchangeMetadata?.molecularConservativeSourceBufferSpeciesRate?.unit !== 'count/s-proxy'
    || !Number.isFinite(summary.conservation?.exchange?.molecularConservativeSourceBufferDispatchableCount)
    || !Number.isFinite(summary.conservation?.exchange?.molecularConservativeSourceBufferSourceTermCount)
    || !Number.isFinite(summary.conservation?.exchange?.molecularConservativeSourceBufferResidual)
    || !summary.conservation?.trackedCouplings?.includes('molecular conservative transfer dry-run -> reactive/SPH allocation telemetry')
    || !summary.conservation?.trackedCouplings?.includes('molecular target-mutator preview -> reactive/SPH dry-run target delta telemetry')
    || !summary.conservation?.trackedCouplings?.includes('molecular target-mutator registry -> allowed-field/invariant mutation gate telemetry')
    || !summary.conservation?.trackedCouplings?.includes('molecular target-mutation preflight -> residual/blocker readiness telemetry')
    || !summary.conservation?.trackedCouplings?.includes('molecular target-mutation operation plan -> field-level before/after delta telemetry')
    || !summary.conservation?.trackedCouplings?.includes('molecular target-source response -> reactive/SPH intake acknowledgement telemetry')
    || !summary.conservation?.trackedCouplings?.includes('molecular target-source reconciliation -> reactive/SPH response audit telemetry')
    || !summary.conservation?.trackedCouplings?.includes('molecular conservative source buffer -> reactive/SPH unit-aware source-vector telemetry')) {
    throw new Error(`Molecular dry-run transfer conservation fields missing: ${JSON.stringify(summary.conservation?.exchange)}`);
  }
  if ((summary.warmDeltaCount || 0) < 15) {
    throw new Error(`Expected at least 15 solver warm deltas, saw ${summary.warmDeltaCount || 0}`);
  }
  if (!summary.apiStatus?.hasResizeSolverWorkloads || !summary.apiStatus?.hasResizeComputeWorkers || !summary.apiStatus?.hasSetAutoScale) {
    throw new Error('Expected live workload resize APIs on window.__multiscaleDemo');
  }
  if (!summary.apiStatus?.hasConfigureRemotePlacement
    || !summary.apiStatus?.hasRunLoopbackRemotePlacementProbe
    || !summary.apiStatus?.hasRunLoopbackRemoteSolverPlacementProbe
    || !summary.apiStatus?.hasGetRemotePlacementConfiguration) {
    throw new Error('Expected remote placement configuration APIs on window.__multiscaleDemo');
  }
  if (!summary.apiStatus?.hasConfigureRemoteSolverPlacement
    || !summary.apiStatus?.hasGetRemoteSolverPlacementPolicy
    || !summary.apiStatus?.hasGetRemoteSolverPlacementDecisions) {
    throw new Error('Expected remote solver placement policy APIs on window.__multiscaleDemo');
  }
  if (!summary.apiStatus?.hasStartPeerNetwork
    || !summary.apiStatus?.hasStopPeerNetwork
    || !summary.apiStatus?.hasGetPeerNetworkStatus) {
    throw new Error('Expected opt-in peer network NodeKernel APIs on window.__multiscaleDemo');
  }
  if (!summary.apiStatus?.hasSetMolecularComposition || !summary.apiStatus?.hasAddMolecularAtoms) {
    throw new Error('Expected molecular composition APIs on window.__multiscaleDemo');
  }
  if (!summary.apiStatus?.hasSetHudMode
    || !summary.apiStatus?.hasGetHudMode
    || !summary.apiStatus?.hasGetOutputPanels
    || !summary.apiStatus?.hasSetOutputPanelVisibility
    || !summary.apiStatus?.hasToggleOutputPanel
    || !summary.apiStatus?.hasGetPacketPreview
    || !summary.apiStatus?.hasGetRenderBudget
    || summary.apiStatus?.hud?.mode !== 'focus'
    || summary.apiStatus?.hudModeApi?.mode !== 'focus'
    || summary.apiStatus?.hudModeApi?.packetPreviewSchema !== 'peercompute.multiscale.packet-preview.v0'
    || summary.apiStatus?.hudModeApi?.runtimeDebugThrottleMs !== 1000
    || !(summary.apiStatus?.hud?.layerReadoutTotalRowCount > summary.apiStatus?.hud?.layerReadoutRowCount)
    || summary.apiStatus?.hud?.layerReadoutRowCount !== summary.apiStatus?.layerReadoutRowCount) {
    throw new Error(`Expected compact HUD APIs and default focus state: ${JSON.stringify(summary.apiStatus?.hudModeApi || summary.apiStatus?.hud)}`);
  }
  let packetPreview;
  try {
    packetPreview = JSON.parse(summary.apiStatus.packetPreview || '{}');
  } catch (error) {
    throw new Error(`Expected packet preview to be compact JSON: ${error.message}`);
  }
  if (packetPreview.schema !== 'peercompute.multiscale.packet-preview.v0'
    || packetPreview.mode !== 'compact-dom-preview'
    || packetPreview.packetSchema !== 'peercompute.multiscale.packet.v0'
    || !packetPreview.focus
    || !packetPreview.material
    || !packetPreview.compute
    || !summary.apiStatus.packetReadoutText?.includes('peercompute.multiscale.packet-preview.v0')
    || summary.apiStatus.packetReadoutText.length > 3000) {
    throw new Error(`Expected compact packet preview instead of full packet JSON: ${summary.apiStatus.packetReadoutText}`);
  }
  if (summary.hudApi?.telemetry?.mode !== 'telemetry'
    || summary.hudApi?.telemetryState?.mode !== 'telemetry'
    || !summary.hudApi?.telemetryText?.includes('hud mode')
    || !summary.hudApi?.telemetryText?.includes('telemetry')
    || !summary.hudApi?.telemetryPacketText?.includes('peercompute.multiscale.packet-preview.v0')
    || summary.hudApi?.focus?.mode !== 'focus'
    || summary.hudApi?.focusState?.mode !== 'focus'
    || !summary.hudApi?.focusText?.includes('hud mode')
    || !summary.hudApi?.focusText?.includes('focus')
    || !summary.hudApi?.focusPacketText?.includes('peercompute.multiscale.packet-preview.v0')
    || !(summary.hudApi?.telemetryRows > summary.hudApi?.focusRows)
    || summary.hudApi?.telemetryRows !== summary.hudApi?.telemetryState?.layerReadoutRowCount
    || summary.hudApi?.focusRows !== summary.hudApi?.focusState?.layerReadoutRowCount
    || !summary.hudApi?.telemetryText?.includes('molecular response')
    || !summary.hudApi?.telemetryText?.includes('molecular reconcile')
    || !summary.hudApi?.focusText?.includes('molecular ledger')
    || !summary.hudApi?.focusText?.includes('molecular eos')
    || !summary.hudApi?.focusText?.includes('molecular balance')
    || !summary.hudApi?.focusText?.includes('molecular equation')
    || !summary.hudApi?.focusText?.includes('molecular transfer')
    || !summary.hudApi?.focusText?.includes('molecular apply')
    || !summary.hudApi?.focusText?.includes('molecular txn')
    || !summary.hudApi?.focusText?.includes('molecular preview')
    || !summary.hudApi?.focusText?.includes('molecular mutators')
    || !summary.hudApi?.focusText?.includes('molecular preflight')
    || !summary.hudApi?.focusText?.includes('molecular op plan')
    || !summary.hudApi?.focusText?.includes('molecular invariants')
    || !summary.hudApi?.focusText?.includes('molecular commit')
    || !summary.hudApi?.focusText?.includes('molecular dispatch')
    || !summary.hudApi?.focusText?.includes('molecular apply val')
    || !summary.hudApi?.focusText?.includes('molecular apply exec')
    || !summary.hudApi?.focusText?.includes('molecular intake')
    || !summary.hudApi?.focusText?.includes('molecular buffer')
    || !summary.hudApi?.focusText?.includes('molecular buffer apply')
    || !summary.hudApi?.focusText?.includes('molecular buffer accept')
    || !summary.hudApi?.focusText?.includes('molecular buffer writeback')
    || !summary.hudApi?.focusText?.includes('molecular buffer replay')
    || !summary.hudApi?.focusText?.includes('molecular buffer mutate')
    || !summary.hudApi?.focusText?.includes('molecular buffer queue')
    || !summary.hudApi?.focusText?.includes('molecular buffer writer')
    || !summary.hudApi?.focusText?.includes('molecular buffer verify')
    || !summary.hudApi?.focusText?.includes('molecular sci gate')
    || !summary.hudApi?.focusText?.includes('molecular sci manifest')) {
    throw new Error(`Expected HUD focus/telemetry API toggle to update readouts: ${JSON.stringify(summary.hudApi)}`);
  }
  if (summary.mobileOutputApi?.viewport?.width !== 390 || summary.mobileOutputApi?.buttonCount < 4) {
    throw new Error(`Expected mobile output toggle controls to render: ${JSON.stringify(summary.mobileOutputApi)}`);
  }
  if (summary.mobileOutputApi?.packetOff?.visible !== false
    || summary.mobileOutputApi?.packetDisplayAfterOff !== 'none'
    || summary.mobileOutputApi?.readoutOff?.visible !== false
    || summary.mobileOutputApi?.readoutDisplayAfterOff !== 'none') {
    throw new Error(`Expected mobile output toggles to hide packet/readout panels: ${JSON.stringify(summary.mobileOutputApi)}`);
  }
  if (summary.mobileOutputApi?.bulkMinimal?.ok !== true
    || summary.mobileOutputApi?.runtimeDisplayAfterBulk !== 'none'
    || summary.mobileOutputApi?.packetDisplayAfterBulk !== 'none'
    || !summary.mobileOutputApi?.bulkMinimal?.panels?.find((panel) => panel.id === 'controls' && panel.visible === true)
    || !summary.mobileOutputApi?.bulkMinimal?.panels?.find((panel) => panel.id === 'readout' && panel.visible === true)) {
    throw new Error(`Expected mobile bulk output visibility to leave ladder controls/readout visible: ${JSON.stringify(summary.mobileOutputApi)}`);
  }
  if (summary.mobileOutputApi?.packetOn?.visible !== true
    || summary.mobileOutputApi?.readoutOn?.visible !== true
    || summary.mobileOutputApi?.bulkRestore?.ok !== true
    || !summary.mobileOutputApi?.after?.panels?.every((panel) => panel.visible === true)
    || !summary.mobileOutputApi?.stateHud?.outputPanels?.every((panel) => panel.visible === true)
    || !summary.mobileOutputApi?.runtimeHud?.outputPanels?.every((panel) => panel.visible === true)) {
    throw new Error(`Expected mobile output toggles to restore packet/readout panels: ${JSON.stringify(summary.mobileOutputApi)}`);
  }
  if (!Number.isFinite(summary.apiStatus.solverQualityMultiplier) || summary.apiStatus.solverQualityMultiplier <= 0) {
    throw new Error('Expected finite positive solver quality multiplier');
  }
  if (!Number.isFinite(summary.apiStatus.combustionGrid) || summary.apiStatus.combustionGrid <= 0) {
    throw new Error('Expected finite positive combustion plume grid budget');
  }
  if (!Number.isFinite(summary.apiStatus.membraneSegments) || summary.apiStatus.membraneSegments <= 0) {
    throw new Error('Expected finite positive membrane shell segment budget');
  }
  if (!Number.isFinite(summary.apiStatus.stellarGrid) || summary.apiStatus.stellarGrid <= 0) {
    throw new Error('Expected finite positive stellar fusion grid budget');
  }
  if (!Number.isFinite(summary.apiStatus.magnetosphereGrid) || summary.apiStatus.magnetosphereGrid <= 0) {
    throw new Error('Expected finite positive magnetosphere plasma grid budget');
  }
  if (!Number.isFinite(summary.apiStatus.picParticles) || summary.apiStatus.picParticles <= 0) {
    throw new Error('Expected finite positive PIC plasma particle budget');
  }
  if (!Number.isFinite(summary.apiStatus.picGrid) || summary.apiStatus.picGrid <= 0) {
    throw new Error('Expected finite positive PIC plasma grid budget');
  }
  if (!Number.isFinite(summary.apiStatus.relativitySamples) || summary.apiStatus.relativitySamples <= 0) {
    throw new Error('Expected finite positive relativistic sample budget');
  }
  if (!Number.isFinite(summary.apiStatus.cosmologySamples) || summary.apiStatus.cosmologySamples <= 0) {
    throw new Error('Expected finite positive cosmology expansion sample budget');
  }
  if (!Number.isFinite(summary.apiStatus.molecularAtoms) || summary.apiStatus.molecularAtoms <= 0) {
    throw new Error('Expected finite positive molecular dynamics atom budget');
  }
  if (!summary.resizeRemap?.result?.ok) {
    throw new Error(`Expected resizeSolverWorkloads remap call to succeed: ${JSON.stringify(summary.resizeRemap?.result)}`);
  }
  if (summary.resizeRemap?.solverRemap?.schema !== 'peercompute.multiscale.solver-state-remap.v0') {
    throw new Error('Expected solver remap schema after workload resize');
  }
  if (summary.resizeRemap?.solverRemapApi?.schema !== 'peercompute.multiscale.solver-state-remap.v0') {
    throw new Error('Expected explicit compact solver remap API after workload resize');
  }
  if (!Number.isFinite(summary.resizeRemap?.solverRemap?.maxRelativeInvariantDelta)
    || !Number.isFinite(summary.resizeRemap?.solverRemap?.maxAbsoluteInvariantDelta)
    || !Number.isFinite(summary.resizeRemap?.solverRemap?.invariantCount)
    || summary.resizeRemap.solverRemap.invariantCount <= 0) {
    throw new Error('Expected finite compact solver remap invariant summary');
  }
  const remappedSolvers = summary.resizeRemap?.solverRemap?.solvers
    ?.filter((entry) => entry.remapped)
    ?.map((entry) => entry.solverKey) || [];
  if (!remappedSolvers.includes('nbody-gravity') || !remappedSolvers.includes('maxwell-em')) {
    throw new Error(`Expected N-body and Maxwell state remaps, saw ${remappedSolvers.join(', ')}`);
  }
  const nbodyRemap = summary.resizeRemap?.solverRemap?.solvers
    ?.find((entry) => entry.solverKey === 'nbody-gravity');
  const maxwellRemap = summary.resizeRemap?.solverRemap?.solvers
    ?.find((entry) => entry.solverKey === 'maxwell-em');
  if (!nbodyRemap?.invariants?.some((entry) => entry.name === 'mass')
    || !nbodyRemap.invariants.some((entry) => entry.name === 'momentumMagnitude')
    || !maxwellRemap?.invariants?.some((entry) => entry.name === 'charge')) {
    throw new Error('Expected N-body and Maxwell remap invariant telemetry');
  }
  if (summary.resizeRemap.fullSolverCount < remappedSolvers.length || summary.resizeRemap.fullInvariantCount <= 0) {
    throw new Error('Expected full solver remap report to remain available through explicit API');
  }
  if (summary.resizeRemap?.runtimeDebugRemap?.schema !== 'peercompute.multiscale.solver-state-remap.v0') {
    throw new Error('Expected runtime debug to expose solver remap report');
  }
  if (!summary.resizeRemap?.readoutText?.includes('solver remap')
    || !summary.resizeRemap?.runtimeText?.includes('state remap')) {
    throw new Error('Expected solver remap telemetry in readout and runtime panel');
  }
  if (summary.workerResize?.stateResize?.schema !== 'peercompute.multiscale.compute-capacity-resize.v0'
    || summary.workerResize.stateResize.pending !== false
    || summary.workerResize.stateResize.reason !== 'demo-api') {
    throw new Error(`Expected compute capacity resize status after worker resize API: ${JSON.stringify(summary.workerResize)}`);
  }
  if (summary.workerResize?.runtimeDebugResize?.schema !== 'peercompute.multiscale.compute-capacity-resize.v0'
    || !summary.workerResize?.runtimeText?.includes('compute resize')
    || !summary.workerResize?.runtimeText?.includes('resize corr')
    || !summary.workerResize?.readoutText?.includes('compute resize')
    || !summary.workerResize?.readoutText?.includes('resize corr')) {
    throw new Error(`Expected runtime/readout compute resize telemetry: ${JSON.stringify(summary.workerResize)}`);
  }
  if (!Number.isFinite(summary.workerResize?.plannedShardTasks)
    || summary.workerResize.plannedShardTasks <= 0
    || summary.workerResize.plannedShardTasks !== summary.workerResize.computeBudget?.plannedWorkers) {
    throw new Error(`Expected worker resize to rebudget shard pool: ${JSON.stringify(summary.workerResize)}`);
  }
  if (summary.workerResize?.computeBudget?.capacity?.schema !== 'peercompute.compute.capacity-budget.v0'
    || !Number.isFinite(summary.workerResize.computeBudget.capacity.budgetScale)
    || !summary.workerResize?.readoutText?.includes('/ cap ')) {
    throw new Error(`Expected capacity-budget telemetry in compute budget/readout: ${JSON.stringify(summary.workerResize)}`);
  }
  const profileLimits = summary.workerResize?.computeBudget?.resourceProfile?.gpuLimits;
  if (profileLimits && !Number.isFinite(profileLimits.maxBufferSize)) {
    throw new Error(`Expected finite GPU maxBufferSize when GPU limits are reported: ${JSON.stringify(summary.workerResize.computeBudget.resourceProfile)}`);
  }
  if (summary.workerResize?.request?.changedExpected
    && (!(summary.workerResize.workerPoolRevision > summary.workerResize.request.beforeWorkerPoolRevision)
      || summary.workerResize.lastWorkerResize?.changed !== true
      || summary.workerResize.stateResize?.previous?.managerTargetWorkers === summary.workerResize.stateResize?.next?.managerTargetWorkers
      || summary.workerResize.workerAutoScaleHold?.active !== true
      || !(summary.workerResize.runtimeScaler?.workerCooldownFrames > 0))) {
    throw new Error(`Expected real worker resize revision and target transition: ${JSON.stringify(summary.workerResize)}`);
  }
  if (summary.workerResize?.stateResize?.previous?.totalParticleCount !== summary.workerResize?.stateResize?.next?.totalParticleCount
    && (!(summary.workerResize?.scalePoolResize?.carriedForwardShardCount > 0)
      || !(summary.workerResize?.scalePoolResize?.carriedForwardRecordShardCount > 0)
      || !(summary.workerResize?.scalePoolResize?.resizeAuditSummary?.auditedShardCount > 0)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeAuditSummary?.maxPositionDelta)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeAuditSummary?.maxVelocityDelta)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeAuditSummary?.massProxyDelta)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeAuditSummary?.maxAbsMassProxyDelta)
      || summary.workerResize?.scalePoolResize?.resizeAuditSummary?.massProxySource !== 'record-scale'
      || summary.workerResize?.scalePoolResize?.resizeAuditSummary?.momentumMode !== 'scale-weighted'
      || !(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.correctedShardCount > 0)
      || !(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.massConservedShardCount > 0)
      || summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.massConservationMode !== 'all-record-scale'
      || !(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.mutableMassProxy > 0)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.maxAbsMassProxyDeltaBefore)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.maxAbsMassProxyDeltaAfter)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.maxAbsMassProxyDelta)
      || summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.maxAbsMassProxyDeltaAfter
        > summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.maxAbsMassProxyDeltaBefore + 1e-3
      || summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.massProxySource !== 'record-scale'
      || summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.momentumMode !== 'scale-weighted'
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.maxAbsMomentumDeltaAfter)
      || !Number.isFinite(summary.workerResize?.scalePoolResize?.resizeCorrectionSummary?.maxAbsKineticEnergyDeltaAfter))) {
    throw new Error(`Expected particle-count resize to carry prior shard records plus audit/correction deltas forward: ${JSON.stringify(summary.workerResize)}`);
  }
  if (summary.workerResize?.stateResize?.previous?.totalParticleCount !== summary.workerResize?.stateResize?.next?.totalParticleCount) {
    const computeResizeAudit = summary.workerResize?.packetConservation?.computeResize;
    if (computeResizeAudit?.schema !== 'peercompute.multiscale.compute-resize-conservation.v0'
      || computeResizeAudit.massConservationMode !== 'all-record-scale'
      || !(computeResizeAudit.massConservedShardCount > 0)
      || !Number.isFinite(computeResizeAudit.maxAbsMassProxyDeltaBefore)
      || !Number.isFinite(computeResizeAudit.maxAbsMassProxyDeltaAfter)
      || computeResizeAudit.maxAbsMassProxyDeltaAfter > computeResizeAudit.maxAbsMassProxyDeltaBefore + 1e-3
      || !summary.workerResize?.packetConservation?.trackedCouplings?.some((entry) => entry.includes('compute-capacity resize'))) {
      throw new Error(`Expected conservation audit to include compute resize residuals: ${JSON.stringify(summary.workerResize?.packetConservation)}`);
    }
  }
  if (summary.environmentApi?.environment?.ambientTemperatureK !== 360
    || summary.environmentApi?.environment?.ambientPressurePa !== 150000
    || summary.environmentApi?.temperatureControl !== '360'
    || summary.environmentApi?.pressureControl !== '150000'
    || summary.environmentApi?.hud?.mode !== 'telemetry'
    || !(summary.environmentApi?.layerReadoutRowCount > summary.apiStatus?.layerReadoutRowCount)) {
    throw new Error(`Environment API did not update ambient controls: ${JSON.stringify(summary.environmentApi)}`);
  }
  if (summary.environmentApi?.boundaryConditions?.ambientTemperatureK !== 360
    || summary.environmentApi?.boundaryConditions?.ambientPressurePa !== 150000
    || summary.environmentApi?.boundaryConditions?.oxygenFraction !== 0.28
    || summary.environmentApi?.boundaryConditions?.gravityMps2 !== 4.2) {
    throw new Error(`Environment packet boundary conditions did not update: ${JSON.stringify(summary.environmentApi?.boundaryConditions)}`);
  }
  if (!summary.environmentApi?.readoutText?.includes('environment')
    || !summary.environmentApi?.readoutText?.includes('360K')
    || !summary.environmentApi?.readoutText?.includes('150000Pa')
    || !summary.environmentApi?.readoutText?.includes('hud mode')) {
    throw new Error(`Environment readout missing ambient telemetry: ${summary.environmentApi?.readoutText}`);
  }
  if (summary.apiStatus.runtimeScaler?.schema !== 'peercompute.multiscale.runtime-scaler.v0') {
    throw new Error('Expected runtime scaler status in multiscale state');
  }
  if (summary.apiStatus.runtimeScaler?.workerUtilizationPressure?.schema !== 'peercompute.multiscale.worker-utilization-pressure.v0'
    || !Number.isFinite(summary.apiStatus.runtimeScaler.workerUtilizationPressure?.pressure)
    || !Number.isFinite(summary.apiStatus.runtimeScaler.workerUtilizationPressure?.saturation)) {
    throw new Error(`Expected worker-utilization pressure in runtime scaler status: ${JSON.stringify(summary.apiStatus.runtimeScaler)}`);
  }
  if (summary.apiStatus.memoryPressure?.schema !== 'peercompute.multiscale.memory-pressure.v0'
    || summary.apiStatus.computeMemoryPressure?.schema !== 'peercompute.multiscale.memory-pressure.v0'
    || summary.apiStatus.runtimeScaler?.memoryPressure?.schema !== 'peercompute.multiscale.memory-pressure.v0'
    || !Number.isFinite(summary.apiStatus.memoryPressure?.pressure)
    || !Number.isFinite(summary.apiStatus.memoryPressure?.memoryBudgetMB)) {
    throw new Error(`Expected memory pressure telemetry in state/scaler/compute status: ${JSON.stringify(summary.apiStatus)}`);
  }
  if (summary.apiStatus.networkCapacity?.schema !== 'peercompute.multiscale.network-capacity.v0'
    || summary.apiStatus.computeNetworkCapacity?.schema !== 'peercompute.multiscale.network-capacity.v0'
    || !Number.isFinite(summary.apiStatus.networkCapacity?.capacityScore)
    || !summary.apiStatus.networkCapacity?.placementMode
    || !summary.apiStatus.networkCapacity?.recommendation) {
    throw new Error(`Expected network/cluster capacity telemetry in state/compute status: ${JSON.stringify(summary.apiStatus)}`);
  }
  if (summary.apiStatus.placementPlan?.schema !== 'peercompute.multiscale.placement-plan.v0'
    || summary.apiStatus.computePlacementPlan?.schema !== 'peercompute.multiscale.placement-plan.v0'
    || summary.apiStatus.placementPlan?.advisoryOnly !== true
    || !summary.apiStatus.placementPlan?.entries?.cosmologyExpansion
    || !summary.apiStatus.placementPlan?.entries?.molecularDynamics
    || !summary.apiStatus.placementPlan?.counts
    || !summary.apiStatus.placementPlan?.dominantPlacement) {
    throw new Error(`Expected advisory placement-plan telemetry in state/compute status: ${JSON.stringify(summary.apiStatus.placementPlan)}`);
  }
  if (!summary.apiStatus.hasGetRuntimeDebug
    || summary.apiStatus.runtimeDebug?.schema !== 'peercompute.multiscale.runtime-debug.v0'
    || summary.apiStatus.runtimeDebugFromState?.schema !== 'peercompute.multiscale.runtime-debug.v0'
    || summary.apiStatus.runtimeDebug?.memoryPressure?.schema !== 'peercompute.multiscale.memory-pressure.v0'
    || summary.apiStatus.runtimeDebug?.networkCapacity?.schema !== 'peercompute.multiscale.network-capacity.v0'
    || summary.apiStatus.runtimeDebug?.placementPlan?.schema !== 'peercompute.multiscale.placement-plan.v0'
    || summary.apiStatus.runtimeDebug?.workerUtilization?.schema !== 'peercompute.compute.worker-utilization.v0'
    || summary.apiStatus.runtimeDebug?.taskPlacement?.schema !== 'peercompute.compute.task-placement.v0'
    || summary.apiStatus.runtimeDebug?.readout?.schema !== 'peercompute.multiscale.readout-cadence.v0'
    || summary.apiStatus.runtimeDebug?.readout?.throttleMs !== 250
    || summary.apiStatus.runtimeDebug?.hud?.mode !== 'focus'
    || summary.apiStatus.runtimeDebug?.hud?.packetPreviewSchema !== 'peercompute.multiscale.packet-preview.v0'
    || summary.apiStatus.runtimeDebug?.hud?.runtimeDebugThrottleMs !== 1000
    || !(summary.apiStatus.runtimeDebug?.hud?.layerReadoutTotalRowCount > summary.apiStatus.runtimeDebug?.hud?.layerReadoutRowCount)
    || !summary.apiStatus.runtimeDebug?.topTaskFamilies?.some((entry) => entry.family === 'multiscale-ladder')
    || !summary.apiStatus.runtimeDebug?.taskFamilies?.some((entry) => entry.family === 'molecular-dynamics')
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.manager?.currentLoad)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.solver)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.coupling)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceSinkBalance)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransfer)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferApplication)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetPreview)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutatorRegistry)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutationPreflight)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutationOperationPlan)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutationInvariantCheck)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutationCommit)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutationDispatch)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutationApplyValidation)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.sourceTransferTargetMutationApplyExecution)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.targetBufferWorkerWriteQueue)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.targetBufferWorkerWriteExecution)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.targetBufferWorkerWriteVerification)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.scientificInvariantGate)
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.scientificReadinessManifest)
    || summary.apiStatus.runtimeDebug?.crossScaleCoupling?.schema !== 'peercompute.multiscale.cross-scale-coupling.v0'
    || summary.apiStatus.runtimeDebug?.lawGraph?.schema !== 'peercompute.multiscale.law-graph-consistency.v0'
    || !Number.isFinite(summary.apiStatus.runtimeDebug?.warmDeltas?.lawGraph)
    || !summary.apiStatus.runtimeDebugText?.includes('runtime-debug')
    || !summary.apiStatus.runtimeDebugText?.includes('worker util')
    || !summary.apiStatus.runtimeDebugText?.includes('task placement')
    || !summary.apiStatus.runtimeDebugText?.includes('memory pressure')
    || !summary.apiStatus.runtimeDebugText?.includes('network capacity')
    || !summary.apiStatus.runtimeDebugText?.includes('placement plan')
    || !summary.apiStatus.runtimeDebugText?.includes('remote place')
    || !summary.apiStatus.runtimeDebugText?.includes('remote config')
    || !summary.apiStatus.runtimeDebugText?.includes('remote solver')
    || !summary.apiStatus.runtimeDebugText?.includes('remote decisions')
    || !summary.apiStatus.runtimeDebugText?.includes('node kernel')
    || !summary.apiStatus.runtimeDebugText?.includes('cross coupling')
    || !summary.apiStatus.runtimeDebugText?.includes('law graph')
    || !summary.apiStatus.runtimeDebugText?.includes('field adapters')
    || !summary.apiStatus.runtimeDebugText?.includes('field transfer')
    || !summary.apiStatus.runtimeDebugText?.includes('readout cadence')
    || !summary.apiStatus.runtimeDebugText?.includes('solver focus')
    || !summary.apiStatus.runtimeDebugText?.includes('hud mode')
    || !summary.apiStatus.runtimeDebugText?.includes('multiscale-ladder')) {
    throw new Error(`Expected runtime debug panel and API telemetry: ${JSON.stringify(summary.apiStatus.runtimeDebug)} text=${summary.apiStatus.runtimeDebugText}`);
  }
  const lawGraphProxyConsistent = summary.apiStatus.lawGraph?.proxyConsistent === true;
  const lawGraphSolve = summary.apiStatus.lawGraph?.consistencySolve || {};
  const lawGraphHasQmatBlocker = Array.isArray(summary.apiStatus.lawGraph?.blockers)
    && summary.apiStatus.lawGraph.blockers.some((blocker) => blocker?.id === 'constraint:qmat-reactive-chemistry');
  if (!summary.apiStatus.hasGetLawGraphDeltas
    || !summary.apiStatus.hasGetLawGraphUpdatePlan
    || !summary.apiStatus.hasGetLawGraphConsistencySolve
    || !summary.apiStatus.hasGetLawGraphProposalAdmission
    || !summary.apiStatus.hasGetLawGraphDispatchQueue
    || !summary.apiStatus.hasGetLawGraphSchedulerManifest
    || !summary.apiStatus.hasGetLawGraphSchedulerExecutionAudit
    || !summary.apiStatus.hasGetLawGraphResultAdmission
    || !summary.apiStatus.hasGetLawGraphStateApplicationPreflight
    || summary.apiStatus.lawGraph?.schema !== 'peercompute.multiscale.law-graph-consistency.v0'
    || summary.apiStatus.packetLawGraph?.schema !== 'peercompute.multiscale.law-graph-consistency.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.schema !== 'peercompute.multiscale.law-graph-consistency.v0'
    || summary.apiStatus.lawGraph?.updatePlan?.schema !== 'peercompute.multiscale.law-graph-update-plan.v0'
    || summary.apiStatus.packetLawGraph?.updatePlan?.schema !== 'peercompute.multiscale.law-graph-update-plan.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.updatePlan?.schema !== 'peercompute.multiscale.law-graph-update-plan.v0'
    || summary.apiStatus.lawGraphUpdatePlan?.schema !== 'peercompute.multiscale.law-graph-update-plan.v0'
    || summary.apiStatus.lawGraphUpdatePlanApi?.schema !== 'peercompute.multiscale.law-graph-update-plan.v0'
    || summary.apiStatus.lawGraph?.consistencySolve?.schema !== 'peercompute.multiscale.law-graph-consistency-solve.v0'
    || summary.apiStatus.packetLawGraph?.consistencySolve?.schema !== 'peercompute.multiscale.law-graph-consistency-solve.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.consistencySolve?.schema !== 'peercompute.multiscale.law-graph-consistency-solve.v0'
    || summary.apiStatus.lawGraphConsistencySolve?.schema !== 'peercompute.multiscale.law-graph-consistency-solve.v0'
    || summary.apiStatus.lawGraphConsistencySolveApi?.schema !== 'peercompute.multiscale.law-graph-consistency-solve.v0'
    || summary.apiStatus.lawGraph?.proposalAdmission?.schema !== 'peercompute.multiscale.law-graph-proposal-admission.v0'
    || summary.apiStatus.packetLawGraph?.proposalAdmission?.schema !== 'peercompute.multiscale.law-graph-proposal-admission.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.proposalAdmission?.schema !== 'peercompute.multiscale.law-graph-proposal-admission.v0'
    || summary.apiStatus.lawGraphProposalAdmission?.schema !== 'peercompute.multiscale.law-graph-proposal-admission.v0'
    || summary.apiStatus.lawGraphProposalAdmissionApi?.schema !== 'peercompute.multiscale.law-graph-proposal-admission.v0'
    || summary.apiStatus.lawGraph?.dispatchQueue?.schema !== 'peercompute.multiscale.law-graph-dispatch-queue.v0'
    || summary.apiStatus.packetLawGraph?.dispatchQueue?.schema !== 'peercompute.multiscale.law-graph-dispatch-queue.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.dispatchQueue?.schema !== 'peercompute.multiscale.law-graph-dispatch-queue.v0'
    || summary.apiStatus.lawGraphDispatchQueue?.schema !== 'peercompute.multiscale.law-graph-dispatch-queue.v0'
    || summary.apiStatus.lawGraphDispatchQueueApi?.schema !== 'peercompute.multiscale.law-graph-dispatch-queue.v0'
    || summary.apiStatus.lawGraph?.schedulerManifest?.schema !== 'peercompute.multiscale.law-graph-scheduler-manifest.v0'
    || summary.apiStatus.packetLawGraph?.schedulerManifest?.schema !== 'peercompute.multiscale.law-graph-scheduler-manifest.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.schedulerManifest?.schema !== 'peercompute.multiscale.law-graph-scheduler-manifest.v0'
    || summary.apiStatus.lawGraphSchedulerManifest?.schema !== 'peercompute.multiscale.law-graph-scheduler-manifest.v0'
    || summary.apiStatus.lawGraphSchedulerManifestApi?.schema !== 'peercompute.multiscale.law-graph-scheduler-manifest.v0'
    || summary.apiStatus.lawGraph?.schedulerExecutionAudit?.schema !== 'peercompute.multiscale.law-graph-scheduler-execution-audit.v0'
    || summary.apiStatus.packetLawGraph?.schedulerExecutionAudit?.schema !== 'peercompute.multiscale.law-graph-scheduler-execution-audit.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.schedulerExecutionAudit?.schema !== 'peercompute.multiscale.law-graph-scheduler-execution-audit.v0'
    || summary.apiStatus.lawGraphSchedulerExecutionAudit?.schema !== 'peercompute.multiscale.law-graph-scheduler-execution-audit.v0'
    || summary.apiStatus.lawGraphSchedulerExecutionAuditApi?.schema !== 'peercompute.multiscale.law-graph-scheduler-execution-audit.v0'
    || summary.apiStatus.lawGraph?.resultAdmission?.schema !== 'peercompute.multiscale.law-graph-result-admission.v0'
    || summary.apiStatus.packetLawGraph?.resultAdmission?.schema !== 'peercompute.multiscale.law-graph-result-admission.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.resultAdmission?.schema !== 'peercompute.multiscale.law-graph-result-admission.v0'
    || summary.apiStatus.lawGraphResultAdmission?.schema !== 'peercompute.multiscale.law-graph-result-admission.v0'
    || summary.apiStatus.lawGraphResultAdmissionApi?.schema !== 'peercompute.multiscale.law-graph-result-admission.v0'
    || summary.apiStatus.lawGraph?.stateApplicationPreflight?.schema !== 'peercompute.multiscale.law-graph-state-application-preflight.v0'
    || summary.apiStatus.packetLawGraph?.stateApplicationPreflight?.schema !== 'peercompute.multiscale.law-graph-state-application-preflight.v0'
    || summary.apiStatus.runtimeDebugLawGraph?.stateApplicationPreflight?.schema !== 'peercompute.multiscale.law-graph-state-application-preflight.v0'
    || summary.apiStatus.lawGraphStateApplicationPreflight?.schema !== 'peercompute.multiscale.law-graph-state-application-preflight.v0'
    || summary.apiStatus.lawGraphStateApplicationPreflightApi?.schema !== 'peercompute.multiscale.law-graph-state-application-preflight.v0'
    || summary.apiStatus.packetLawGraph?.modelId !== 'bipartite-state-law-consistency-v0'
    || typeof summary.apiStatus.lawGraph?.proxyConsistent !== 'boolean'
    || summary.apiStatus.lawGraph?.scientificReady !== false
    || summary.apiStatus.lawGraph?.updatePlan?.operationCount <= 0
    || summary.apiStatus.lawGraph?.updatePlan?.runnableOperationCount <= 0
    || summary.apiStatus.lawGraph?.updatePlan?.scientificBlockedOperationCount <= 0
    || summary.apiStatus.lawGraph?.updatePlan?.authoritativeMutationReady !== false
    || lawGraphSolve.convergedProxy !== lawGraphProxyConsistent
    || lawGraphSolve.convergedScientific !== false
    || lawGraphSolve.iterationCount <= 0
    || lawGraphSolve.proposedStateUpdateCount <= 0
    || summary.apiStatus.lawGraph?.proposalAdmission?.proposalCount <= 0
    || summary.apiStatus.lawGraph?.proposalAdmission?.proxyWarmDeltaReadyCount <= 0
    || summary.apiStatus.lawGraph?.proposalAdmission?.computeManagerDispatchReadyCount <= 0
    || summary.apiStatus.lawGraph?.proposalAdmission?.scientificBlockedApplicationCount <= 0
    || (lawGraphProxyConsistent && summary.apiStatus.lawGraph?.proposalAdmission?.status !== 'proxy-admission-ready-scientific-blocked')
    || (!lawGraphProxyConsistent && summary.apiStatus.lawGraph?.proposalAdmission?.status !== 'proxy-admission-blocked')
    || summary.apiStatus.lawGraph?.dispatchQueue?.queueEntryCount <= 0
    || summary.apiStatus.lawGraph?.dispatchQueue?.readyEntryCount <= 0
    || summary.apiStatus.lawGraph?.dispatchQueue?.computeManagerReadyCount <= 0
    || summary.apiStatus.lawGraph?.dispatchQueue?.scientificBlockedEntryCount <= 0
    || (lawGraphProxyConsistent && summary.apiStatus.lawGraph?.dispatchQueue?.status !== 'proxy-dispatch-ready-scientific-blocked')
    || (!lawGraphProxyConsistent && summary.apiStatus.lawGraph?.dispatchQueue?.status !== 'partial-proxy-dispatch-ready-proxy-blocked')
    || summary.apiStatus.lawGraph?.schedulerManifest?.manifestEntryCount <= 0
    || summary.apiStatus.lawGraph?.schedulerManifest?.readyManifestEntryCount <= 0
    || summary.apiStatus.lawGraph?.schedulerManifest?.schedulerReadyCount <= 0
    || summary.apiStatus.lawGraph?.schedulerManifest?.computeManagerReadyCount <= 0
    || summary.apiStatus.lawGraph?.schedulerManifest?.resolvedDescriptorCount <= 0
    || summary.apiStatus.lawGraph?.schedulerManifest?.unresolvedDescriptorCount !== 0
    || summary.apiStatus.lawGraph?.schedulerManifest?.executorMissingCount !== 0
    || summary.apiStatus.lawGraph?.schedulerManifest?.scientificBlockedEntryCount <= 0
    || (lawGraphProxyConsistent && summary.apiStatus.lawGraph?.schedulerManifest?.status !== 'proxy-scheduler-ready-scientific-blocked')
    || (!lawGraphProxyConsistent && summary.apiStatus.lawGraph?.schedulerManifest?.status !== 'partial-proxy-scheduler-ready-proxy-blocked')
    || summary.apiStatus.lawGraph?.schedulerExecutionAudit?.evidenceAvailable !== true
    || summary.apiStatus.lawGraph?.schedulerExecutionAudit?.executionRequiredCount <= 0
    || summary.apiStatus.lawGraph?.schedulerExecutionAudit?.executionObservedCount <= 0
    || summary.apiStatus.lawGraph?.schedulerExecutionAudit?.runtimeMatchedCount <= 0
    || summary.apiStatus.lawGraph?.schedulerExecutionAudit?.warmDeltaMatchedCount <= 0
    || !['scheduler-execution-partial', 'scheduler-execution-observed-scientific-blocked', 'scheduler-execution-observed'].includes(summary.apiStatus.lawGraph?.schedulerExecutionAudit?.status)
    || summary.apiStatus.lawGraph?.resultAdmission?.evidenceAvailable !== true
    || summary.apiStatus.lawGraph?.resultAdmission?.resultAdmissionRequiredCount <= 0
    || summary.apiStatus.lawGraph?.resultAdmission?.proxyAdmittedCount <= 0
    || ![
      'result-admission-partial-scientific-blocked',
      'result-admission-partial',
      'proxy-result-admission-ready-scientific-blocked',
      'proxy-result-admission-ready'
    ].includes(summary.apiStatus.lawGraph?.resultAdmission?.status)
    || summary.apiStatus.lawGraph?.stateApplicationPreflight?.evidenceAvailable !== true
    || summary.apiStatus.lawGraph?.stateApplicationPreflight?.applicationPreflightRequiredCount <= 0
    || summary.apiStatus.lawGraph?.stateApplicationPreflight?.proxyApplicationReadyCount <= 0
    || ![
      'state-application-partial-scientific-blocked',
      'state-application-partial',
      'proxy-state-application-ready-scientific-blocked',
      'proxy-state-application-ready'
    ].includes(summary.apiStatus.lawGraph?.stateApplicationPreflight?.status)
    || (lawGraphProxyConsistent && lawGraphSolve.closedResidualProxy !== 0)
    || (!lawGraphProxyConsistent && !(lawGraphSolve.closedResidualProxy > 0))
    || (!lawGraphProxyConsistent && !lawGraphHasQmatBlocker)
    || !(lawGraphSolve.scientificResidual > 0)
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.consistencySolveStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.updatePlanStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.proposalAdmissionStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.dispatchQueueStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.schedulerManifestStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.schedulerManifestResolvedDescriptorCount <= 0
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.schedulerExecutionAuditStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.schedulerExecutionObservedCount <= 0
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.resultAdmissionStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.resultAdmissionProxyAdmittedCount <= 0
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.stateApplicationPreflightStatus == null
    || summary.apiStatus.lawGraphState?.deltas?.['law-graph:multiscale-consistency']?.stateApplicationProxyReadyCount <= 0
    || !(summary.apiStatus.lawGraph?.stateNodeCount > 0)
    || !(summary.apiStatus.lawGraph?.lawNodeCount > 0)
    || !(summary.apiStatus.lawGraph?.constraintNodeCount > 0)
    || !(summary.apiStatus.lawGraph?.edgeCount > 0)
    || summary.apiStatus.lawGraphState?.scope !== 'multiscale-law-graph'
    || !(summary.apiStatus.lawGraphState?.warmDeltaCount >= 1)
    || !summary.apiStatus.readoutText?.includes('law graph')) {
    throw new Error(`Expected law graph packet/state/readout/update-plan/admission/queue/scheduler/execution/result/state-application telemetry: ${JSON.stringify(summary.apiStatus.lawGraph)} packet=${JSON.stringify(summary.apiStatus.packetLawGraph)} runtime=${JSON.stringify(summary.apiStatus.runtimeDebugLawGraph)} plan=${JSON.stringify(summary.apiStatus.lawGraphUpdatePlanApi)} admission=${JSON.stringify(summary.apiStatus.lawGraphProposalAdmissionApi)} queue=${JSON.stringify(summary.apiStatus.lawGraphDispatchQueueApi)} scheduler=${JSON.stringify(summary.apiStatus.lawGraphSchedulerManifestApi)} execution=${JSON.stringify(summary.apiStatus.lawGraphSchedulerExecutionAuditApi)} result=${JSON.stringify(summary.apiStatus.lawGraphResultAdmissionApi)} stateApplication=${JSON.stringify(summary.apiStatus.lawGraphStateApplicationPreflightApi)} state=${JSON.stringify(summary.apiStatus.lawGraphState)} api=${JSON.stringify(summary.apiStatus.lawGraphDeltasApi)} text=${summary.apiStatus.readoutText}`);
  }
  if (summary.apiStatus.solverGovernor?.activeLayerPolicy !== 'active-layer-priority-v0'
    || summary.apiStatus.runtimeDebugSolverGovernor?.activeLayerPolicy !== 'active-layer-priority-v0'
    || summary.apiStatus.solverGovernor?.activeLayerId !== 'surface'
    || summary.apiStatus.solverGovernor?.layerDistances?.sphMaterial !== 0
    || !(summary.apiStatus.solverGovernor?.layerDistances?.cosmologyExpansion > 0)
    || !(summary.apiStatus.solverGovernor?.effectiveCadenceFrames?.cosmologyExpansion > summary.apiStatus.solverGovernor?.effectiveCadenceFrames?.sphMaterial)
    || !summary.apiStatus.readoutText?.includes('solver focus')) {
    throw new Error(`Expected active-layer-priority solver cadence telemetry: ${JSON.stringify(summary.apiStatus.solverGovernor)} text=${summary.apiStatus.readoutText}`);
  }
  if (!summary.apiStatus.hasGetCouplingDeltas
    || summary.apiStatus.crossScaleCoupling?.schema !== 'peercompute.multiscale.cross-scale-coupling.v0'
    || summary.apiStatus.packetCoupling?.schema !== 'peercompute.multiscale.cross-scale-coupling.v0'
    || summary.apiStatus.runtimeDebugCoupling?.schema !== 'peercompute.multiscale.cross-scale-coupling.v0'
    || summary.apiStatus.packetCoupling?.fieldMetadata?.schema !== 'peercompute.multiscale.field-metadata-report.v0'
    || !(summary.apiStatus.packetCoupling?.fieldMetadata?.physicalFieldCount >= 1)
    || !(summary.apiStatus.packetCoupling?.fieldMetadata?.proxyFieldCount >= 1)
    || summary.apiStatus.packetCoupling?.fieldCompatibility?.schema !== 'peercompute.multiscale.field-compatibility-report.v0'
    || summary.apiStatus.packetCoupling?.fieldCompatibility?.checkCount !== summary.apiStatus.packetCoupling?.linkCount
    || summary.apiStatus.packetCoupling?.fieldCompatibility?.criticalIssueCount !== 0
    || !(summary.apiStatus.packetCoupling?.fieldCompatibility?.adapterRequiredCount > 0)
    || summary.apiStatus.packetCoupling?.fieldAdapterPlan?.schema !== 'peercompute.multiscale.field-adapter-plan.v0'
    || summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapterCount !== summary.apiStatus.packetCoupling?.linkCount
    || summary.apiStatus.packetCoupling?.fieldAdapterPlan?.blockedAdapterCount !== 0
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.readyAdapterCount > 0)
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.readyNamedAdapterCount >= 9)
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.stubRequiredCount > 0)
    || summary.apiStatus.packetCoupling?.fieldTransfer?.schema !== 'peercompute.multiscale.field-transfer-report.v0'
    || summary.apiStatus.packetCoupling?.fieldTransfer?.transferCount !== summary.apiStatus.packetCoupling?.linkCount
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.executedTransferCount > 0)
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.namedExecutedTransferCount >= 9)
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.skippedStubTransferCount > 0)
    || summary.apiStatus.packetCoupling?.fieldTransfer?.blockedTransferCount !== 0
    || summary.apiStatus.runtimeDebugCoupling?.fieldTransfer?.schema !== 'peercompute.multiscale.field-transfer-report.v0'
    || summary.apiStatus.couplingState?.scope !== 'multiscale-couplings'
    || !summary.apiStatus.hasGetSourceSinkBalanceDeltas
    || !summary.apiStatus.hasGetSourceTransferDeltas
    || !summary.apiStatus.hasGetSourceTransferApplicationDeltas
    || !summary.apiStatus.hasGetSourceTransferTransactionDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetPreviewDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetMutatorRegistryDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetMutationPreflightDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetMutationOperationPlanDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetMutationInvariantCheckDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetMutationCommitDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetMutationDispatchDeltas
    || !summary.apiStatus.hasGetSourceTransferTargetMutationApplyValidationDeltas
	    || !summary.apiStatus.hasGetSourceTransferTargetMutationApplyExecutionDeltas
	    || !summary.apiStatus.hasGetSourceTransferTargetSourceIntakeDeltas
	    || !summary.apiStatus.hasGetSourceTransferTargetSourceResponseDeltas
	    || !summary.apiStatus.hasGetSourceTransferTargetSourceReconciliationDeltas
	    || !summary.apiStatus.hasGetConservativeSourceBufferDeltas
		    || !summary.apiStatus.hasGetSourceBufferApplicationDeltas
		    || !summary.apiStatus.hasGetSourceBufferAcceptanceDeltas
		    || !summary.apiStatus.hasGetTargetBufferReplayValidationDeltas
			    || !summary.apiStatus.hasGetTargetBufferMutationAuditDeltas
			    || !summary.apiStatus.hasGetTargetBufferWorkerWriteQueueDeltas
			    || !summary.apiStatus.hasGetTargetBufferWorkerWriteExecutionDeltas
			    || !summary.apiStatus.hasGetTargetBufferWorkerWriteVerificationDeltas
			    || !summary.apiStatus.hasGetScientificReadinessManifestDeltas
			    || !summary.apiStatus.hasConfigureMolecularTargetBufferWorkerWrite
		    || !summary.apiStatus.hasGetMolecularTargetBufferWorkerWriteConfig
		    || !summary.apiStatus.hasExecuteMolecularTargetBufferWorkerWrite
		    || !summary.apiStatus.hasSetOutputPanelsVisibility
    || summary.apiStatus.sourceSinkBalanceState?.scope !== 'multiscale-source-sink-balances'
    || summary.apiStatus.sourceTransferState?.scope !== 'multiscale-source-transfers'
    || summary.apiStatus.sourceTransferApplicationState?.scope !== 'multiscale-source-transfer-applications'
    || summary.apiStatus.sourceTransferTransactionState?.scope !== 'multiscale-source-transfer-transactions'
    || summary.apiStatus.sourceTransferTargetPreviewState?.scope !== 'multiscale-source-transfer-target-previews'
    || summary.apiStatus.sourceTransferTargetMutatorRegistryState?.scope !== 'multiscale-source-transfer-target-mutators'
    || summary.apiStatus.sourceTransferTargetMutationPreflightState?.scope !== 'multiscale-source-transfer-target-preflights'
    || summary.apiStatus.sourceTransferTargetMutationOperationPlanState?.scope !== 'multiscale-source-transfer-target-operation-plans'
    || summary.apiStatus.sourceTransferTargetMutationInvariantCheckState?.scope !== 'multiscale-source-transfer-target-invariant-checks'
    || summary.apiStatus.sourceTransferTargetMutationCommitState?.scope !== 'multiscale-source-transfer-target-commits'
    || summary.apiStatus.sourceTransferTargetMutationDispatchState?.scope !== 'multiscale-source-transfer-target-dispatches'
    || summary.apiStatus.sourceTransferTargetMutationApplyValidationState?.scope !== 'multiscale-source-transfer-target-apply-validations'
    || summary.apiStatus.sourceTransferTargetMutationApplyExecutionState?.scope !== 'multiscale-source-transfer-target-apply-executions'
	    || summary.apiStatus.sourceTransferTargetSourceIntakeState?.scope !== 'multiscale-source-transfer-target-source-intakes'
	    || summary.apiStatus.sourceTransferTargetSourceResponseState?.scope !== 'multiscale-source-transfer-target-source-responses'
	    || summary.apiStatus.sourceTransferTargetSourceReconciliationState?.scope !== 'multiscale-source-transfer-target-source-reconciliations'
		    || summary.apiStatus.conservativeSourceBufferState?.scope !== 'multiscale-conservative-source-buffers'
		    || summary.apiStatus.sourceBufferApplicationState?.scope !== 'multiscale-source-buffer-applications'
		    || summary.apiStatus.sourceBufferAcceptanceState?.scope !== 'multiscale-source-buffer-acceptances'
			    || summary.apiStatus.targetBufferWorkerWriteExecutionState?.scope !== 'multiscale-target-buffer-worker-write-executions'
			    || summary.apiStatus.targetBufferWorkerWriteVerificationState?.scope !== 'multiscale-target-buffer-worker-write-verifications'
			    || summary.apiStatus.scientificInvariantGateState?.scope !== 'multiscale-scientific-invariant-gates'
			    || summary.apiStatus.scientificReadinessManifestState?.scope !== 'multiscale-scientific-readiness-manifests'
    || !Number.isFinite(summary.apiStatus.sourceSinkBalanceState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferApplicationState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTransactionState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetPreviewState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutatorRegistryState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutationPreflightState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutationOperationPlanState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutationInvariantCheckState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutationCommitState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutationDispatchState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutationApplyValidationState?.warmDeltaCount)
    || !Number.isFinite(summary.apiStatus.sourceTransferTargetMutationApplyExecutionState?.warmDeltaCount)
	    || !Number.isFinite(summary.apiStatus.sourceTransferTargetSourceIntakeState?.warmDeltaCount)
	    || !Number.isFinite(summary.apiStatus.sourceTransferTargetSourceResponseState?.warmDeltaCount)
	    || !Number.isFinite(summary.apiStatus.sourceTransferTargetSourceReconciliationState?.warmDeltaCount)
		    || !Number.isFinite(summary.apiStatus.conservativeSourceBufferState?.warmDeltaCount)
		    || !Number.isFinite(summary.apiStatus.sourceBufferApplicationState?.warmDeltaCount)
		    || !Number.isFinite(summary.apiStatus.sourceBufferAcceptanceState?.warmDeltaCount)
		    || !Number.isFinite(summary.apiStatus.targetBufferReplayValidationState?.warmDeltaCount)
			    || !Number.isFinite(summary.apiStatus.targetBufferMutationAuditState?.warmDeltaCount)
			    || !Number.isFinite(summary.apiStatus.targetBufferWorkerWriteQueueState?.warmDeltaCount)
			    || !Number.isFinite(summary.apiStatus.targetBufferWorkerWriteExecutionState?.warmDeltaCount)
			    || !Number.isFinite(summary.apiStatus.targetBufferWorkerWriteVerificationState?.warmDeltaCount)
			    || !Number.isFinite(summary.apiStatus.scientificInvariantGateState?.warmDeltaCount)
			    || !Number.isFinite(summary.apiStatus.scientificReadinessManifestState?.warmDeltaCount)
    || summary.apiStatus.packetSourceSinkBalance?.schema !== 'peercompute.multiscale.molecular-source-sink-balance.v0'
    || summary.apiStatus.packetSourceEquation?.schema !== 'peercompute.multiscale.molecular-source-equation.v0'
    || summary.apiStatus.packetSourceTransfer?.schema !== 'peercompute.multiscale.molecular-conservative-transfer.v0'
    || summary.apiStatus.packetSourceTransferApplication?.schema !== 'peercompute.multiscale.molecular-transfer-application.v0'
	    || summary.apiStatus.packetSourceTransferApplication?.canApply !== false
    || summary.apiStatus.packetSourceTransferApplication?.applied !== false
    || summary.apiStatus.packetSourceTransferTransaction?.schema !== 'peercompute.multiscale.molecular-transfer-transaction.v0'
    || summary.apiStatus.packetSourceTransferTransaction?.allowed !== false
    || summary.apiStatus.packetSourceTransferTransaction?.applied !== false
    || summary.apiStatus.packetSourceTransferTargetPreview?.schema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || summary.apiStatus.packetSourceTransferTargetPreview?.applied !== false
    || !(summary.apiStatus.packetSourceTransferTargetPreview?.previewTargetCount >= 1)
    || summary.apiStatus.packetSourceTransferTargetMutatorRegistry?.schema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || summary.apiStatus.packetSourceTransferTargetMutatorRegistry?.canMutate !== false
    || summary.apiStatus.packetSourceTransferTargetMutatorRegistry?.validatedMutatorCount !== 0
    || summary.apiStatus.packetSourceTransferTargetMutationPreflight?.schema !== 'peercompute.multiscale.molecular-target-mutation-preflight.v0'
    || summary.apiStatus.packetSourceTransferTargetMutationPreflight?.canMutate !== false
    || summary.apiStatus.packetSourceTransferTargetMutationPreflight?.passedTargetCount !== 0
    || summary.apiStatus.packetSourceTransferTargetMutationOperationPlan?.schema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || summary.apiStatus.packetSourceTransferTargetMutationOperationPlan?.canApply !== false
    || !(summary.apiStatus.packetSourceTransferTargetMutationOperationPlan?.operationCount >= 6)
    || summary.apiStatus.packetSourceTransferTargetMutationInvariantCheck?.schema !== 'peercompute.multiscale.molecular-target-mutation-invariant-check.v0'
    || summary.apiStatus.packetSourceTransferTargetMutationInvariantCheck?.canApply !== false
    || summary.apiStatus.packetSourceTransferTargetMutationInvariantCheck?.missingInvariantScopeCount !== 0
    || summary.apiStatus.packetSourceTransferTargetMutationCommit?.schema !== 'peercompute.multiscale.molecular-target-mutation-commit.v0'
    || summary.apiStatus.packetSourceTransferTargetMutationCommit?.canCommit !== false
    || summary.apiStatus.packetSourceTransferTargetMutationCommit?.committableTargetCount !== 0
    || summary.apiStatus.packetSourceTransferTargetMutationDispatch?.schema !== 'peercompute.multiscale.molecular-target-mutation-dispatch.v0'
    || summary.apiStatus.packetSourceTransferTargetMutationDispatch?.canDispatch !== false
    || summary.apiStatus.packetSourceTransferTargetMutationDispatch?.dispatchableBatchCount !== 0
    || summary.apiStatus.packetSourceTransferTargetMutationApplyValidation?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-validation.v0'
    || summary.apiStatus.packetSourceTransferTargetMutationApplyValidation?.canApply !== false
    || summary.apiStatus.packetSourceTransferTargetMutationApplyValidation?.applyReadyTargetCount !== 0
    || summary.apiStatus.packetSourceTransferTargetMutationApplyExecution?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-execution.v0'
    || summary.apiStatus.packetSourceTransferTargetMutationApplyExecution?.applied !== true
    || summary.apiStatus.packetSourceTransferTargetMutationApplyExecution?.appliedTargetCount !== summary.apiStatus.packetSourceTransferTargetMutationApplyExecution?.targetCount
	    || summary.apiStatus.packetSourceTransferTargetSourceResponse?.schema !== 'peercompute.multiscale.molecular-target-source-response.v0'
		    || summary.apiStatus.packetSourceTransferTargetSourceResponse?.sourceIntakeSchema !== 'peercompute.multiscale.molecular-target-source-intake.v0'
		    || summary.apiStatus.packetSourceTransferTargetSourceReconciliation?.schema !== 'peercompute.multiscale.molecular-target-source-reconciliation.v0'
		    || summary.apiStatus.packetConservativeSourceBuffer?.schema !== 'peercompute.multiscale.molecular-conservative-source-buffer.v0'
	    || summary.apiStatus.packetMolecularScientificInvariantGate?.schema !== 'peercompute.multiscale.molecular-scientific-invariant-gate.v0'
	    || summary.apiStatus.packetMolecularScientificInvariantGate?.scientificMutationReady !== false
	    || !(summary.apiStatus.packetMolecularScientificInvariantGate?.requiredScopeCount >= 7)
	    || summary.apiStatus.packetMolecularScientificInvariantGateAggregate?.schema !== 'peercompute.multiscale.molecular-scientific-invariant-gate.v0'
	    || summary.apiStatus.packetMolecularScientificReadinessManifest?.schema !== 'peercompute.multiscale.molecular-scientific-readiness-manifest.v0'
	    || summary.apiStatus.packetMolecularScientificReadinessManifest?.scientificMutationReady !== false
	    || !(summary.apiStatus.packetMolecularScientificReadinessManifest?.requiredArtifactCount >= 7)
	    || summary.apiStatus.packetMolecularScientificReadinessManifestAggregate?.schema !== 'peercompute.multiscale.molecular-scientific-readiness-manifest.v0'
	    || !(summary.apiStatus.packetSourceTransferApplication?.blockers || []).includes('dry-run-disabled')
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferAllocationCount >= 1)
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferClosedResidualWProxy)
    || summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferApplicationCanApply !== 0
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferApplicationBlockedTargetCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferApplicationAppliedTargetCount !== 0
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferTargetPreviewCount >= 1)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferTargetPreviewBlockedTargetCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferTargetPreviewAppliedTargetCount !== 0
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferTargetPreviewMaxDeltaK)
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularSourceTransferTargetPreviewMaxPhaseDrive)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutatorRegistryTargetCount >= 1)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutatorRegistryRegisteredCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutatorRegistryValidatedCount !== 0
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutatorRegistryBlockedCount >= 1)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationPreflightTargetCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationPreflightPassedCount !== 0
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationPreflightBlockedCount >= 1)
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationPreflightMaxResidualRisk)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationOperationPlanOperationCount >= 6)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationOperationPlanBlockedCount !== summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationOperationPlanOperationCount
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationOperationPlanMaxDelta)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationInvariantCheckTargetCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationInvariantCheckMissingScopeCount !== 0
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationInvariantCheckMaxResidual)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationCommitTargetCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationCommitCommittableCount !== 0
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationCommitBlockedCount >= 1)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationDispatchBatchCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationDispatchDispatchableCount !== 0
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationDispatchBlockedCount >= 1)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyValidationTargetCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyValidationReadyCount !== 0
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyValidationBlockedCount >= 1)
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyValidationMaxResidual)
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyExecutionTargetCount >= 1)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyExecutionAppliedTargetCount !== summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyExecutionTargetCount
    || !(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyExecutionAppliedOperationCount >= 6)
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetMutationApplyExecutionMaxResidual)
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetSourceResponseActiveCount !== summary.apiStatus.packetSourceTransferTargetSourceResponse?.activeTargetCount
    || summary.apiStatus.packetCoupling?.exchange?.molecularTargetSourceReconciliationReconciledCount !== summary.apiStatus.packetSourceTransferTargetSourceReconciliation?.reconciledTargetCount
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetSourceReconciliationResidual)
    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetSourceIntakeThermalDrive)
	    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetSourceResponseRespondedCount)
	    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetSourceResponsePendingCount)
	    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularTargetSourceResponseHeatFlux)
	    || summary.apiStatus.packetCoupling?.exchange?.molecularConservativeSourceBufferDispatchableCount !== summary.apiStatus.packetConservativeSourceBuffer?.dispatchableTargetCount
	    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularConservativeSourceBufferSourceTermCount)
		    || !Number.isFinite(summary.apiStatus.packetCoupling?.exchange?.molecularConservativeSourceBufferResidual)
		    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferApplicationAppliedCount >= 1)
		    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferApplicationAppliedFieldCount >= 4)
		    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferApplicationResidual)
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferAcceptanceAcceptedCount >= 1)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferAcceptanceBlockedCount !== 0
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferAcceptanceCanMutateProxy !== 1
	    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferAcceptanceResidual)
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferWritebackValidatedCount >= 1)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferWritebackBlockedCount !== 0
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferWritebackCanWritebackProxy !== 1
	    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularSourceBufferWritebackResidual)
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferReplayValidatedCount >= 1)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferReplayBlockedCount !== 0
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferReplayCanReplayProxy !== 1
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferReplayFieldCount >= 4)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferReplayMissingFieldCount !== 0
	    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferReplayResidual)
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferMutationAuditReadyCount >= 1)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferMutationAuditBlockedCount !== 0
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferMutationAuditCanMutateProxy !== 1
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferMutationAuditCanQueueWorkerWrite !== 0
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferMutationAuditWriteIntentCount >= 4)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferMutationAuditBlockedWriteIntentCount !== 0
	    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferMutationAuditResidual)
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteQueueReadyBatchCount >= 1)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteQueueBlockedBatchCount !== 0
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteQueueCanPlan !== 1
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite !== 0
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteQueueWriteIntentCount >= 4)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount !== 0
	    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteQueueResidual)
	    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount >= 1)
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount !== 0
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteExecutionCanExecute !== 1
	    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteExecutionApplied !== 1
		    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount >= 4)
		    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount !== 0
		    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteExecutionResidual)
		    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount >= 1)
		    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount !== 0
		    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationCanVerify !== 1
		    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationVerified !== 1
		    || !(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount >= 4)
		    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount !== 0
		    || summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount !== 0
		    || !Number.isFinite(summary.sourceBufferApplicationApi?.couplingExchange?.molecularTargetBufferWorkerWriteVerificationResidual)
		    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.sourceTransfer?.schema !== 'peercompute.multiscale.molecular-conservative-transfer.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.sourceTransferApplication?.schema !== 'peercompute.multiscale.molecular-transfer-application.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.sourceTransferTargetPreview?.schema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.sourceTransferTargetPreviewSummary?.schema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutatorRegistry?.schema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutationPreflight?.schema !== 'peercompute.multiscale.molecular-target-mutation-preflight.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutationOperationPlan?.schema !== 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutationInvariantCheck?.schema !== 'peercompute.multiscale.molecular-target-mutation-invariant-check.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutationCommit?.schema !== 'peercompute.multiscale.molecular-target-mutation-commit.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutationDispatch?.schema !== 'peercompute.multiscale.molecular-target-mutation-dispatch.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutationApplyValidation?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-validation.v0'
	    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetMutationApplyExecution?.schema !== 'peercompute.multiscale.molecular-target-mutation-apply-execution.v0'
		    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.conservativeSourceBuffer?.schema !== 'peercompute.multiscale.molecular-conservative-source-buffer.v0'
		    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.conservativeSourceBufferSummary?.schema !== 'peercompute.multiscale.molecular-conservative-source-buffer.v0'
	    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.sourceBufferApplicationSummary?.schema !== 'peercompute.multiscale.molecular-source-buffer-application.v0'
	    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.sourceBufferAcceptance?.schema !== 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
	    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.sourceBufferWritebackValidation?.schema !== 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
	    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.targetBufferReplayValidation?.schema !== 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
	    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.targetBufferMutationAudit?.schema !== 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
		    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.targetBufferWorkerWriteQueue?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
		    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.targetBufferWorkerWriteExecution?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0'
		    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.targetBufferWorkerWriteExecution?.applied !== true
		    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.targetBufferWorkerWriteVerification?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0'
		    || summary.sourceBufferApplicationApi?.reactiveLink?.adapterContext?.targetBufferWorkerWriteVerification?.verified !== true
	    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetSourceResponse?.schema !== 'peercompute.multiscale.molecular-target-source-response.v0'
    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext?.targetSourceReconciliation?.schema !== 'peercompute.multiscale.molecular-target-source-reconciliation.v0'
	    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext?.targetSourceResponseSummary?.schema !== 'peercompute.multiscale.molecular-target-source-response.v0'
	    || summary.apiStatus.packetCoupling?.links?.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext?.targetSourceReconciliationSummary?.schema !== 'peercompute.multiscale.molecular-target-source-reconciliation.v0'
	    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.sourceBufferApplicationSummary?.schema !== 'peercompute.multiscale.molecular-source-buffer-application.v0'
	    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.sourceBufferAcceptance?.schema !== 'peercompute.multiscale.molecular-source-buffer-acceptance.v0'
	    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.sourceBufferWritebackValidation?.schema !== 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0'
	    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.targetBufferReplayValidation?.schema !== 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0'
	    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.targetBufferMutationAudit?.schema !== 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0'
		    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.targetBufferWorkerWriteQueue?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0'
		    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.targetBufferWorkerWriteExecution?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0'
		    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.targetBufferWorkerWriteExecution?.applied !== true
		    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.targetBufferWorkerWriteVerification?.schema !== 'peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0'
		    || summary.sourceBufferApplicationApi?.sphLink?.adapterContext?.targetBufferWorkerWriteVerification?.verified !== true
    || summary.apiStatus.packetCoupling?.fieldTransfer?.transfers?.find((transfer) => transfer.id === 'molecular-heat-to-reactive-thermal')?.transform?.context?.sourceTransfer?.schema !== 'peercompute.multiscale.molecular-conservative-transfer.v0'
    || summary.apiStatus.packetCoupling?.fieldTransfer?.transfers?.find((transfer) => transfer.id === 'molecular-heat-to-reactive-thermal')?.transform?.context?.sourceTransferApplication?.schema !== 'peercompute.multiscale.molecular-transfer-application.v0'
    || summary.apiStatus.packetCoupling?.fieldTransfer?.transfers?.find((transfer) => transfer.id === 'molecular-heat-to-reactive-thermal')?.transform?.context?.sourceTransferTargetPreview?.schema !== 'peercompute.multiscale.molecular-target-mutator-preview.v0'
    || summary.apiStatus.packetCoupling?.fieldTransfer?.transfers?.find((transfer) => transfer.id === 'molecular-heat-to-reactive-thermal')?.transform?.context?.targetMutatorRegistry?.schema !== 'peercompute.multiscale.molecular-target-mutator-registry.v0'
    || !summary.apiStatus.sourceSinkBalanceDeltasApi
    || !summary.apiStatus.sourceTransferDeltasApi
    || !summary.apiStatus.sourceTransferApplicationDeltasApi
    || !summary.apiStatus.sourceTransferTransactionDeltasApi
    || !summary.apiStatus.sourceTransferTargetPreviewDeltasApi
    || !summary.apiStatus.sourceTransferTargetMutatorRegistryDeltasApi
    || !summary.apiStatus.sourceTransferTargetMutationPreflightDeltasApi
    || !summary.apiStatus.sourceTransferTargetMutationOperationPlanDeltasApi
    || !summary.apiStatus.sourceTransferTargetMutationInvariantCheckDeltasApi
    || !summary.apiStatus.sourceTransferTargetMutationCommitDeltasApi
    || !summary.apiStatus.sourceTransferTargetMutationDispatchDeltasApi
    || !summary.apiStatus.sourceTransferTargetMutationApplyValidationDeltasApi
	    || !summary.apiStatus.sourceTransferTargetMutationApplyExecutionDeltasApi
	    || !summary.apiStatus.sourceTransferTargetSourceIntakeDeltasApi
	    || !summary.apiStatus.sourceTransferTargetSourceResponseDeltasApi
	    || !summary.apiStatus.sourceTransferTargetSourceReconciliationDeltasApi
		    || !summary.apiStatus.conservativeSourceBufferDeltasApi
		    || !summary.apiStatus.sourceBufferApplicationDeltasApi
		    || !summary.apiStatus.sourceBufferAcceptanceDeltasApi
			    || !summary.apiStatus.targetBufferWorkerWriteExecutionDeltasApi
			    || !summary.apiStatus.targetBufferWorkerWriteVerificationDeltasApi
	    || !Number.isFinite(summary.apiStatus.couplingState?.warmDeltaCount)
    || !(summary.apiStatus.crossScaleCoupling?.activeLinkCount > 0)
    || !(summary.apiStatus.packetCoupling?.links || []).some((link) => (
      link.id === 'sph-water-to-fire-suppression'
      && link.source?.metadata?.unit === '1'
      && link.target?.metadata?.dimensions === '1'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'molecular-heat-to-reactive-thermal'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.molecular-reactive-thermal-source-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'molecular-heat-to-reactive-thermal'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.molecular-reactive-thermal-source-response.v0'
      && Number.isFinite(transfer.target?.predictedValue)
    ))
    || !(summary.apiStatus.packetCoupling?.fieldCompatibility?.checks || []).some((check) => (
      check.id === 'sph-water-to-fire-suppression'
      && check.status === 'compatible'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'sph-water-to-fire-suppression'
      && adapter.adapterKind === 'dimensionless-response-adapter'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.sph-water-suppression-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'sph-water-to-fire-suppression'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.sph-water-suppression-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'reactive-thermal-to-combustion'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.thermal-ignition-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'membrane-rupture-to-sph-release'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.membrane-rupture-spill-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'membrane-rupture-to-sph-release'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.membrane-rupture-spill-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'combustion-plume-to-weather'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.plume-weather-cloud-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'combustion-plume-to-weather'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.plume-weather-cloud-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'radiation-opacity-to-surface-heating'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.radiation-surface-heat-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'radiation-opacity-to-surface-heating'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.radiation-surface-heat-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'stellar-fusion-to-radiation-pressure'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.stellar-radiation-pressure-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'stellar-fusion-to-radiation-pressure'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.stellar-radiation-pressure-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'maxwell-field-to-magnetosphere'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.maxwell-magnetosphere-boundary-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'maxwell-field-to-magnetosphere'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.maxwell-magnetosphere-boundary-response.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldAdapterPlan?.adapters || []).some((adapter) => (
      adapter.id === 'pic-kinetic-to-mhd-feedback'
      && adapter.status === 'ready'
      && adapter.executionMode === 'named-response-adapter'
      && adapter.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.pic-mhd-reconnection-feedback.v0'
    ))
    || !(summary.apiStatus.packetCoupling?.fieldTransfer?.transfers || []).some((transfer) => (
      transfer.id === 'pic-kinetic-to-mhd-feedback'
      && transfer.status === 'executed'
      && transfer.executionMode === 'named-response-adapter'
      && transfer.namedAdapterEquation?.adapterEquationId === 'peercompute.multiscale.adapter.pic-mhd-reconnection-feedback.v0'
    ))) {
    throw new Error(`Expected cross-scale coupling packet/state/debug telemetry: ${JSON.stringify({
      crossScaleCoupling: summary.apiStatus.crossScaleCoupling,
      couplingState: summary.apiStatus.couplingState,
      packetCoupling: summary.apiStatus.packetCoupling,
      runtimeDebugCoupling: summary.apiStatus.runtimeDebugCoupling
    })}`);
  }
  if (summary.apiStatus.peerNetworkStatus?.schema !== 'peercompute.multiscale.node-kernel-status.v0'
    || summary.apiStatus.nodeKernelStatus?.schema !== 'peercompute.multiscale.node-kernel-status.v0'
    || summary.apiStatus.computeNodeKernelStatus?.schema !== 'peercompute.multiscale.node-kernel-status.v0'
    || summary.apiStatus.runtimeDebug?.nodeKernel?.schema !== 'peercompute.multiscale.node-kernel-status.v0'
    || summary.apiStatus.peerNetworkStatus?.enabled !== false
    || summary.apiStatus.peerNetworkStatus?.state !== 'disabled'
    || summary.apiStatus.peerNetworkStatus?.remoteExecutorAttached !== false
    || summary.apiStatus.peerNetworkStatus?.autoWireRemotePlacement !== true
    || summary.apiStatus.peerNetworkStatus?.responderEnabled !== false) {
    throw new Error(`Expected default-off NodeKernel peer-network telemetry: ${JSON.stringify(summary.apiStatus.peerNetworkStatus)}`);
  }
  if (summary.apiStatus.remotePlacementReadiness?.schema !== 'peercompute.multiscale.remote-placement-readiness.v0'
    || summary.apiStatus.computeRemotePlacementReadiness?.schema !== 'peercompute.multiscale.remote-placement-readiness.v0'
    || summary.apiStatus.runtimeDebug?.remotePlacementReadiness?.schema !== 'peercompute.multiscale.remote-placement-readiness.v0'
    || summary.apiStatus.remotePlacementReadiness?.enabled !== false
    || summary.apiStatus.remotePlacementReadiness?.dispatchReady !== false
    || summary.apiStatus.remotePlacementReadiness?.advisoryOnly !== true
    || summary.apiStatus.remotePlacementReadiness?.requestSchema !== 'peercompute.compute.remote-request.v0'
    || summary.apiStatus.remotePlacementReadiness?.resultSchema !== 'peercompute.compute.remote-result.v0') {
    throw new Error(`Expected guarded remote-placement readiness telemetry: ${JSON.stringify(summary.apiStatus.remotePlacementReadiness)}`);
  }
  if (summary.apiStatus.remoteSolverPlacementPolicy?.schema !== 'peercompute.multiscale.remote-solver-placement-policy.v0'
    || summary.apiStatus.remoteSolverPlacementPolicyApi?.schema !== 'peercompute.multiscale.remote-solver-placement-policy.v0'
    || summary.apiStatus.computeRemoteSolverPlacementPolicy?.schema !== 'peercompute.multiscale.remote-solver-placement-policy.v0'
    || summary.apiStatus.runtimeDebug?.remoteSolverPlacementPolicy?.schema !== 'peercompute.multiscale.remote-solver-placement-policy.v0'
    || summary.apiStatus.remoteSolverPlacementPolicy?.enabled !== false
    || summary.apiStatus.remoteSolverPlacementPolicy?.active !== false
    || summary.apiStatus.remoteSolverPlacementPolicy?.advisoryOnly !== true
    || !Array.isArray(summary.apiStatus.remoteSolverPlacementPolicy?.families)
    || !summary.apiStatus.remoteSolverPlacementPolicy.families.includes('cosmologyExpansion')) {
    throw new Error(`Expected default-off remote solver placement policy telemetry: ${JSON.stringify(summary.apiStatus.remoteSolverPlacementPolicy)}`);
  }
  if (summary.apiStatus.remoteSolverPlacementDecisions?.schema !== 'peercompute.multiscale.remote-solver-placement-decisions.v0'
    || summary.apiStatus.remoteSolverPlacementDecisionsApi?.schema !== 'peercompute.multiscale.remote-solver-placement-decisions.v0'
    || summary.apiStatus.computeRemoteSolverPlacementDecisions?.schema !== 'peercompute.multiscale.remote-solver-placement-decisions.v0'
    || summary.apiStatus.runtimeDebug?.remoteSolverPlacementDecisions?.schema !== 'peercompute.multiscale.remote-solver-placement-decisions.v0'
    || summary.apiStatus.remoteSolverPlacementDecisions?.policyEnabled !== false
    || summary.apiStatus.remoteSolverPlacementDecisions?.policyActive !== false
    || summary.apiStatus.remoteSolverPlacementDecisions?.counts?.promoted !== 0
    || !(summary.apiStatus.remoteSolverPlacementDecisions?.counts?.advisory > 0)
    || !summary.apiStatus.remoteSolverPlacementDecisions?.entries?.cosmologyExpansion
    || !summary.apiStatus.runtimeDebugText?.includes('remote decisions')) {
    throw new Error(`Expected default-off per-solver remote placement decisions: ${JSON.stringify(summary.apiStatus.remoteSolverPlacementDecisions)}`);
  }
  if (!summary.remotePlacementApi?.hasApi
    || summary.remotePlacementApi.result?.ok !== true
    || summary.remotePlacementApi.readiness?.schema !== 'peercompute.multiscale.remote-placement-readiness.v0'
    || summary.remotePlacementApi.readiness?.enabled !== true
    || summary.remotePlacementApi.readiness?.armed !== true
    || summary.remotePlacementApi.readiness?.executorConfigured !== true
    || summary.remotePlacementApi.readiness?.admissionConfigured !== true
    || summary.remotePlacementApi.readiness?.signerConfigured !== true
    || summary.remotePlacementApi.readiness?.resultValidatorConfigured !== true
    || summary.remotePlacementApi.readiness?.peerId !== 'visual-peer-alpha'
    || summary.remotePlacementApi.configuration?.schema !== 'peercompute.multiscale.remote-placement-configuration.v0'
    || summary.remotePlacementApi.configuration?.executorId !== 'visual-network-executor'
    || summary.remotePlacementApi.computeConfiguration?.schema !== 'peercompute.multiscale.remote-placement-configuration.v0'
    || summary.remotePlacementApi.runtimeDebug?.remotePlacementConfiguration?.schema !== 'peercompute.multiscale.remote-placement-configuration.v0'
    || !summary.remotePlacementApi.readoutText?.includes('remote config')
    || !summary.remotePlacementApi.runtimeDebugText?.includes('remote config')) {
    throw new Error(`Expected explicit remote-placement hook configuration API to update readiness without changing default local execution: ${JSON.stringify(summary.remotePlacementApi)}`);
  }
  if (!summary.remoteSolverPlacementApi?.hasApi
    || summary.remoteSolverPlacementApi.result?.ok !== true
    || summary.remoteSolverPlacementApi.policy?.schema !== 'peercompute.multiscale.remote-solver-placement-policy.v0'
    || summary.remoteSolverPlacementApi.policy?.enabled !== true
    || summary.remoteSolverPlacementApi.policy?.nonAdvisory !== false
    || summary.remoteSolverPlacementApi.policy?.advisoryOnly !== true
    || !summary.remoteSolverPlacementApi.policy?.families?.includes('cosmologyExpansion')
    || summary.remoteSolverPlacementApi.computePolicy?.schema !== 'peercompute.multiscale.remote-solver-placement-policy.v0'
    || summary.remoteSolverPlacementApi.runtimeDebug?.remoteSolverPlacementPolicy?.schema !== 'peercompute.multiscale.remote-solver-placement-policy.v0'
    || summary.remoteSolverPlacementApi.decisions?.schema !== 'peercompute.multiscale.remote-solver-placement-decisions.v0'
    || summary.remoteSolverPlacementApi.computeDecisions?.schema !== 'peercompute.multiscale.remote-solver-placement-decisions.v0'
    || summary.remoteSolverPlacementApi.runtimeDebug?.remoteSolverPlacementDecisions?.schema !== 'peercompute.multiscale.remote-solver-placement-decisions.v0'
    || summary.remoteSolverPlacementApi.decisions?.policyEnabled !== true
    || summary.remoteSolverPlacementApi.decisions?.policyActive !== false
    || summary.remoteSolverPlacementApi.decisions?.counts?.promoted !== 0
    || !(summary.remoteSolverPlacementApi.decisions?.counts?.advisory > 0)
    || !summary.remoteSolverPlacementApi.decisions?.entries?.cosmologyExpansion
    || !summary.remoteSolverPlacementApi.readoutText?.includes('remote solver')
    || !summary.remoteSolverPlacementApi.readoutText?.includes('remote decisions')
    || !summary.remoteSolverPlacementApi.runtimeDebugText?.includes('remote solver')
    || !summary.remoteSolverPlacementApi.runtimeDebugText?.includes('remote decisions')) {
    throw new Error(`Expected remote solver dry-run policy API telemetry without non-advisory task dispatch: ${JSON.stringify(summary.remoteSolverPlacementApi)}`);
  }
  if (!summary.loopbackRemotePlacementApi?.hasApi
    || summary.loopbackRemotePlacementApi.result?.ok !== true
    || summary.loopbackRemotePlacementApi.result?.schema !== 'peercompute.multiscale.loopback-remote-placement.v0'
    || summary.loopbackRemotePlacementApi.result?.result?.schema !== 'peercompute.multiscale.cosmology-expansion.result.v0'
    || summary.loopbackRemotePlacementApi.result?.deltasCommitted < 1
    || summary.loopbackRemotePlacementApi.result?.taskPlacement?.actualPlacement !== 'remote-peer'
    || summary.loopbackRemotePlacementApi.result?.taskPlacement?.provenance?.executorId !== 'multiscale-loopback-placement'
    || summary.loopbackRemotePlacementApi.result?.taskPlacement?.provenance?.verified !== true
    || summary.loopbackRemotePlacementApi.result?.taskPlacement?.provenance?.validation?.valid !== true
    || summary.loopbackRemotePlacementApi.readiness?.loopbackEnabled !== true
    || summary.loopbackRemotePlacementApi.readiness?.dispatchReady !== true
    || summary.loopbackRemotePlacementApi.configuration?.loopbackEnabled !== true
    || summary.loopbackRemotePlacementApi.taskPlacement?.remoteExecuted < 1
    || summary.loopbackRemotePlacementApi.managerStats?.remoteTasksCompleted < 1
    || !summary.loopbackRemotePlacementApi.readoutText?.includes('remote config')
    || !summary.loopbackRemotePlacementApi.runtimeDebugText?.includes('loopback')) {
    throw new Error(`Expected loopback remote placement probe to execute a real non-advisory solver task: ${JSON.stringify(summary.loopbackRemotePlacementApi)}`);
  }
  if (!summary.loopbackRemoteSolverPlacementApi?.hasApi
    || summary.loopbackRemoteSolverPlacementApi.result?.ok !== true
    || summary.loopbackRemoteSolverPlacementApi.result?.schema !== 'peercompute.multiscale.loopback-remote-solver-placement-probe.v0'
    || summary.loopbackRemoteSolverPlacementApi.result?.result?.schema !== 'peercompute.multiscale.cosmology-expansion.result.v0'
    || summary.loopbackRemoteSolverPlacementApi.result?.deltasCommitted < 1
    || summary.loopbackRemoteSolverPlacementApi.result?.placementHint?.remoteSolverPlacement?.promoted !== true
    || summary.loopbackRemoteSolverPlacementApi.result?.placementHint?.advisoryOnly !== false
    || summary.loopbackRemoteSolverPlacementApi.result?.placementHint?.executionMode !== 'non-advisory-remote'
    || summary.loopbackRemoteSolverPlacementApi.result?.taskPlacement?.actualPlacement !== 'remote-peer'
    || summary.loopbackRemoteSolverPlacementApi.result?.taskPlacement?.provenance?.verified !== true
    || summary.loopbackRemoteSolverPlacementApi.result?.taskPlacement?.provenance?.validation?.valid !== true
    || summary.loopbackRemoteSolverPlacementApi.result?.taskPlacementStats?.remoteExecuted < 1
    || summary.loopbackRemoteSolverPlacementApi.result?.remoteTasksCompleted < 1
    || summary.loopbackRemoteSolverPlacementApi.readiness?.loopbackEnabled !== true
    || summary.loopbackRemoteSolverPlacementApi.readiness?.dispatchReady !== true
    || summary.loopbackRemoteSolverPlacementApi.policy?.active !== true
    || summary.loopbackRemoteSolverPlacementApi.policy?.advisoryOnly !== false
    || summary.loopbackRemoteSolverPlacementApi.decisions?.counts?.promoted < 1
    || summary.loopbackRemoteSolverPlacementApi.decisions?.entries?.cosmologyExpansion?.promoted !== true
    || !summary.loopbackRemoteSolverPlacementApi.readoutText?.includes('remote solver')
    || !summary.loopbackRemoteSolverPlacementApi.readoutText?.includes('remote decisions')
    || !summary.loopbackRemoteSolverPlacementApi.runtimeDebugText?.includes('remote solver')
    || !summary.loopbackRemoteSolverPlacementApi.runtimeDebugText?.includes('remote decisions')) {
    throw new Error(`Expected loopback remote solver placement probe to promote policy-selected solver work: ${JSON.stringify(summary.loopbackRemoteSolverPlacementApi)}`);
  }
  if (summary.apiStatus.solverAdmission?.schema !== 'peercompute.multiscale.solver-admission.v0'
    || summary.apiStatus.computeSolverAdmission?.schema !== 'peercompute.multiscale.solver-admission.v0'
    || summary.apiStatus.runtimeScaler?.solverAdmission?.schema !== 'peercompute.multiscale.solver-admission.v0'
    || summary.apiStatus.runtimeDebug?.solverAdmission?.schema !== 'peercompute.multiscale.solver-admission.v0'
    || !Number.isFinite(summary.apiStatus.solverAdmission?.pressure)
    || !summary.apiStatus.runtimeDebugText?.includes('solver admission')) {
    throw new Error(`Expected solver admission telemetry in state/scaler/compute/runtime debug: ${JSON.stringify(summary.apiStatus.solverAdmission)}`);
  }
  if (!summary.apiStatus.hasGetNetVizSession
    || summary.apiStatus.netVizSession?.gameId !== 'multiscale'
    || summary.apiStatus.netVizSession?.metadata?.schema !== 'peercompute.multiscale.netviz-session.v0'
    || summary.apiStatus.netVizSession?.metadata?.runtimeDebug?.schema !== 'peercompute.multiscale.runtime-debug.v0'
    || summary.apiStatus.netVizSession?.metadata?.nodeKernel?.schema !== 'peercompute.multiscale.node-kernel-status.v0'
    || summary.apiStatus.netVizSession?.metadata?.crossScaleCoupling?.schema !== 'peercompute.multiscale.cross-scale-coupling.v0'
    || summary.apiStatus.netVizSessionFromState?.metadata?.runtimeDebug?.schema !== 'peercompute.multiscale.runtime-debug.v0'
    || !summary.apiStatus.netVizSession?.attachUrl?.includes('attachSession=')) {
    throw new Error(`Expected NetViz session metadata with runtime debug snapshot: ${JSON.stringify(summary.apiStatus.netVizSession)}`);
  }
  if (summary.apiStatus.solverLoad?.schema !== 'peercompute.multiscale.solver-load.v0'
    || !summary.apiStatus.solverLoad?.entries?.molecularDynamics
    || !Number.isFinite(summary.apiStatus.solverLoad?.dominantPressure)) {
    throw new Error(`Expected solver load report in multiscale state: ${JSON.stringify(summary.apiStatus.solverLoad)}`);
  }
  if (summary.apiStatus.lowerScaleRefinement?.schema !== 'peercompute.multiscale.lower-scale-refinement.v0'
    || summary.apiStatus.runtimeDebugLowerScaleRefinement?.schema !== 'peercompute.multiscale.lower-scale-refinement.v0'
    || summary.apiStatus.computeLowerScaleRefinement?.schema !== 'peercompute.multiscale.lower-scale-refinement.v0'
    || summary.apiStatus.lowerScaleRefinement.policy !== 'event-sampled-current-view-v0'
    || !Array.isArray(summary.apiStatus.lowerScaleRefinement.triggeredSolvers)
    || !Number.isFinite(summary.apiStatus.lowerScaleRefinement.eventBudget)
    || !Number.isFinite(summary.apiStatus.lowerScaleRefinement.sampleBudget)
    || !summary.apiStatus.readoutText?.includes('refinement schedule')
    || !summary.apiStatus.runtimeDebugText?.includes('refinement schedule')) {
    throw new Error(`Expected lower-scale refinement scheduler telemetry: ${JSON.stringify(summary.apiStatus.lowerScaleRefinement)}`);
  }
  if (!summary.apiStatus.hasGetSolverSubmissionBudget
    || summary.apiStatus.solverSubmissionBudget?.schema !== 'peercompute.multiscale.solver-submission-budget.v0'
    || summary.apiStatus.solverSubmissionBudgetApi?.schema !== 'peercompute.multiscale.solver-submission-budget.v0'
    || summary.apiStatus.runtimeDebugSolverSubmissionBudget?.schema !== 'peercompute.multiscale.solver-submission-budget.v0'
    || summary.apiStatus.computeSolverSubmissionBudget?.schema !== 'peercompute.multiscale.solver-submission-budget.v0'
    || summary.apiStatus.netVizSession?.metadata?.solverSubmissionBudget?.schema !== 'peercompute.multiscale.solver-submission-budget.v0'
    || summary.apiStatus.solverSubmissionBudget.policy !== 'active-layer-submit-backpressure-v0'
    || !Number.isFinite(summary.apiStatus.solverSubmissionBudget.pressure)
    || !Number.isFinite(summary.apiStatus.solverSubmissionBudget.queuePressure)
    || !Number.isFinite(summary.apiStatus.solverSubmissionBudget.maxSubmissions)
    || !Number.isFinite(summary.apiStatus.solverSubmissionBudget.admittedCount)
    || !Number.isFinite(summary.apiStatus.solverSubmissionBudget.deferredCount)
    || !Array.isArray(summary.apiStatus.solverSubmissionBudget.admittedSolvers)
    || !Array.isArray(summary.apiStatus.solverSubmissionBudget.deferredSolvers)
    || !summary.apiStatus.readoutText?.includes('solver submit')
    || !summary.apiStatus.runtimeDebugText?.includes('solver submit')) {
    throw new Error(`Expected solver submission budget telemetry: ${JSON.stringify(summary.apiStatus.solverSubmissionBudget)}`);
  }
  if (!summary.apiStatus.hasGetStatePublicationBudget
    || summary.apiStatus.statePublicationBudget?.schema !== 'peercompute.multiscale.state-publication-budget.v0'
    || summary.apiStatus.statePublicationBudgetApi?.schema !== 'peercompute.multiscale.state-publication-budget.v0'
    || summary.apiStatus.runtimeDebugStatePublicationBudget?.schema !== 'peercompute.multiscale.state-publication-budget.v0'
    || summary.apiStatus.computeStatePublicationBudget?.schema !== 'peercompute.multiscale.state-publication-budget.v0'
    || summary.apiStatus.netVizSession?.metadata?.statePublicationBudget?.schema !== 'peercompute.multiscale.state-publication-budget.v0'
    || summary.apiStatus.statePublicationBudget.policy !== 'adaptive-state-publication-cadence-v0'
    || !Number.isFinite(summary.apiStatus.statePublicationBudget.pressure)
    || !Number.isFinite(summary.apiStatus.statePublicationBudget.packetIntervalFrames)
    || !Number.isFinite(summary.apiStatus.statePublicationBudget.deltaIntervalFrames)
    || !Number.isFinite(summary.apiStatus.statePublicationBudget.publishCount)
    || !Number.isFinite(summary.apiStatus.statePublicationBudget.skippedFrameCount)
    || typeof summary.apiStatus.statePublicationBudget.shouldPublish !== 'boolean'
    || !summary.apiStatus.readoutText?.includes('state publish')
    || !summary.apiStatus.runtimeDebugText?.includes('state publish')) {
    throw new Error(`Expected state publication budget telemetry: ${JSON.stringify(summary.apiStatus.statePublicationBudget)}`);
  }
  if (!summary.apiStatus.hasGetRuntimeDiagnosticsBudget
    || summary.apiStatus.runtimeDiagnosticsBudget?.schema !== 'peercompute.multiscale.runtime-diagnostics-budget.v0'
    || summary.apiStatus.runtimeDiagnosticsBudgetApi?.schema !== 'peercompute.multiscale.runtime-diagnostics-budget.v0'
    || summary.apiStatus.runtimeDebugRuntimeDiagnosticsBudget?.schema !== 'peercompute.multiscale.runtime-diagnostics-budget.v0'
    || summary.apiStatus.computeRuntimeDiagnosticsBudget?.schema !== 'peercompute.multiscale.runtime-diagnostics-budget.v0'
    || summary.apiStatus.netVizSession?.metadata?.runtimeDiagnosticsBudget?.schema !== 'peercompute.multiscale.runtime-diagnostics-budget.v0'
    || summary.apiStatus.runtimeDiagnosticsBudget.policy !== 'adaptive-runtime-diagnostics-cache-v0'
    || !Number.isFinite(summary.apiStatus.runtimeDiagnosticsBudget.pressure)
    || !Number.isFinite(summary.apiStatus.runtimeDiagnosticsBudget.snapshotIntervalFrames)
    || !Number.isFinite(summary.apiStatus.runtimeDiagnosticsBudget.snapshotIntervalMs)
    || !Number.isFinite(summary.apiStatus.runtimeDiagnosticsBudget.snapshotBuildCount)
    || !Number.isFinite(summary.apiStatus.runtimeDiagnosticsBudget.snapshotReuseCount)
    || !Number.isFinite(summary.apiStatus.runtimeDiagnosticsBudget.lastDurationMs)
    || typeof summary.apiStatus.runtimeDiagnosticsBudget.shouldRefresh !== 'boolean'
    || !summary.apiStatus.readoutText?.includes('runtime diag')
    || !summary.apiStatus.runtimeDebugText?.includes('runtime diag')) {
    throw new Error(`Expected runtime diagnostics budget telemetry: ${JSON.stringify(summary.apiStatus.runtimeDiagnosticsBudget)}`);
  }
  if (summary.apiStatus.renderBudget?.schema !== 'peercompute.multiscale.render-budget.v0'
    || summary.apiStatus.renderBudgetApi?.schema !== 'peercompute.multiscale.render-budget.v0'
    || summary.apiStatus.runtimeDebugRenderBudget?.schema !== 'peercompute.multiscale.render-budget.v0'
    || summary.apiStatus.computeRenderBudget?.schema !== 'peercompute.multiscale.render-budget.v0'
    || summary.apiStatus.renderBudget.policy !== 'active-layer-visual-budget-v0'
    || !Number.isFinite(summary.apiStatus.renderBudget.pressure)
    || !Number.isFinite(summary.apiStatus.renderBudget.pointScale)
    || !Number.isFinite(summary.apiStatus.renderBudget.minVisibleScale)
    || !Number.isFinite(summary.apiStatus.renderBudget.pixelRatioScale)
    || !Number.isFinite(summary.apiStatus.renderBudget.effectivePixelRatio)
    || !Number.isFinite(summary.apiStatus.renderBudget.dynamicVisualIntervalFrames)
    || !Number.isFinite(summary.apiStatus.renderBudget.dynamicVisualSkipCount)
    || !Number.isFinite(summary.apiStatus.renderBudget.commitIntervalFrames)
    || !Number.isFinite(summary.apiStatus.renderBudget.maxVisibleCommitsPerFrame)
    || !Number.isFinite(summary.apiStatus.renderBudget.reusedCommitCount)
    || !Number.isFinite(summary.apiStatus.renderBudget.visibleCommitCount)
    || typeof summary.apiStatus.renderBudget.severeFrameRescue !== 'boolean'
    || typeof summary.apiStatus.renderBudget.rescueLevel !== 'string'
    || !Number.isFinite(summary.apiStatus.runtimeDebugRenderBudget?.minVisibleScale)
    || typeof summary.apiStatus.runtimeDebugRenderBudget?.severeFrameRescue !== 'boolean'
    || !Number.isFinite(summary.apiStatus.computeRenderBudget?.minVisibleScale)
    || summary.apiStatus.renderBudget.overlayDataUpdate?.schema !== 'peercompute.multiscale.overlay-data-update.v0'
    || summary.apiStatus.renderBudget.overlayDataUpdate?.policy !== 'partial-buffer-attribute-update-ranges-v0'
    || summary.apiStatus.runtimeDebugRenderBudget?.overlayDataUpdate?.schema !== 'peercompute.multiscale.overlay-data-update.v0'
    || summary.apiStatus.computeRenderBudget?.overlayDataUpdate?.schema !== 'peercompute.multiscale.overlay-data-update.v0'
    || !Number.isFinite(summary.apiStatus.renderBudget.overlayDataUpdate.partialUpdateCount)
    || !Number.isFinite(summary.apiStatus.renderBudget.overlayDataUpdate.fullUploadCount)
    || !Number.isFinite(summary.apiStatus.renderBudget.overlayDataUpdate.updateCallCount)
    || !Number.isFinite(summary.apiStatus.renderBudget.overlayDataUpdate.updatedComponentCount)
    || typeof summary.apiStatus.renderBudget.overlayDataUpdate.updatedFamilies !== 'object'
    || !summary.apiStatus.readoutText?.includes('render budget')
    || !summary.apiStatus.readoutText?.includes('min')
    || !summary.apiStatus.readoutText?.includes('commit')
    || !summary.apiStatus.readoutText?.includes('upd')
    || !summary.apiStatus.runtimeDebugText?.includes('render budget')) {
    throw new Error(`Expected render-budget telemetry in state/API/compute/debug/readout: ${JSON.stringify(summary.apiStatus.renderBudget)}`);
  }
  if (summary.apiStatus.renderBudget.severeFrameRescue === true
    && !summary.apiStatus.readoutText?.includes('rescue')) {
    throw new Error(`Expected severe frame rescue readout when rescue is active: ${summary.apiStatus.readoutText}`);
  }
  if (summary.apiStatus.readbackBudget?.schema !== 'peercompute.multiscale.readback-budget.v0'
    || summary.apiStatus.readbackBudgetApi?.schema !== 'peercompute.multiscale.readback-budget.v0'
    || summary.apiStatus.runtimeDebugReadbackBudget?.schema !== 'peercompute.multiscale.readback-budget.v0'
    || summary.apiStatus.computeReadbackBudget?.schema !== 'peercompute.multiscale.readback-budget.v0'
    || summary.apiStatus.netVizSession?.metadata?.readbackBudget?.schema !== 'peercompute.multiscale.readback-budget.v0'
    || summary.apiStatus.readbackBudget.policy !== 'adaptive-ladder-readback-cadence-v0'
    || !Number.isFinite(summary.apiStatus.readbackBudget.pressure)
    || !Number.isFinite(summary.apiStatus.readbackBudget.readbackInterval)
    || !Number.isFinite(summary.apiStatus.readbackBudget.previousReadbackInterval)
    || !Number.isFinite(summary.apiStatus.readbackBudget.pendingReadbacks)
    || !Number.isFinite(summary.apiStatus.readbackBudget.readbackBacklogFrames)
    || !summary.apiStatus.readoutText?.includes('readback budget')
    || !summary.apiStatus.runtimeDebugText?.includes('readback budget')) {
    throw new Error(`Expected readback-budget telemetry in state/API/compute/debug/readout: ${JSON.stringify(summary.apiStatus.readbackBudget)}`);
  }
  if (summary.apiStatus.managerStats?.schema !== 'peercompute.compute.manager-stats.v0'
    || !Number.isFinite(summary.apiStatus.managerStats?.totalTasksCompleted)
    || summary.apiStatus.managerStats.totalTasksCompleted <= 0
    || !summary.apiStatus.managerStats?.byTaskFamily?.['multiscale-ladder']
    || !summary.apiStatus.managerStats?.byTaskFamily?.['molecular-dynamics']
    || summary.apiStatus.managerStats?.workerUtilization?.schema !== 'peercompute.compute.worker-utilization.v0'
    || summary.apiStatus.workerUtilization?.schema !== 'peercompute.compute.worker-utilization.v0'
    || summary.apiStatus.computeWorkerUtilization?.schema !== 'peercompute.compute.worker-utilization.v0'
    || summary.apiStatus.managerStats?.taskPlacement?.schema !== 'peercompute.compute.task-placement.v0'
    || summary.apiStatus.taskPlacement?.schema !== 'peercompute.compute.task-placement.v0'
    || summary.apiStatus.computeTaskPlacement?.schema !== 'peercompute.compute.task-placement.v0'
    || !(summary.apiStatus.managerStats.taskPlacement.totalSubmitted > 0)
    || !(summary.apiStatus.managerStats.taskPlacement.totalCompleted > 0)
    || !summary.apiStatus.managerStats.taskPlacement.byActualPlacement
    || !Object.keys(summary.apiStatus.managerStats.taskPlacement.byActualPlacement).some((key) => key === 'local-worker' || key === 'local-inline')
    || !(summary.apiStatus.managerStats.workerUtilization.summary?.totalCompleted > 0)
    || !Array.isArray(summary.apiStatus.managerStats.workerUtilization.workers)) {
    throw new Error(`Expected ComputeManager runtime stats in multiscale state: ${JSON.stringify(summary.apiStatus.managerStats)}`);
  }
  if (summary.apiStatus.computeWorkerCount !== summary.apiStatus.managerStats?.workerCount
    || summary.apiStatus.plannedWorkers !== summary.apiStatus.managerStats?.targetWorkers
    || !Number.isFinite(summary.apiStatus.plannedShardTasks)
    || summary.apiStatus.plannedShardTasks <= 0) {
    throw new Error(`Expected readout worker counts to track the shared ComputeManager pool: ${JSON.stringify(summary.apiStatus)}`);
  }
  if (!summary.environmentApi?.readoutText?.includes('solver load')
    || !summary.environmentApi?.readoutText?.includes('solver scales')
    || !summary.environmentApi?.readoutText?.includes('manager stats')
    || !summary.environmentApi?.readoutText?.includes('manager families')
    || !summary.environmentApi?.readoutText?.includes('worker util')
    || !summary.environmentApi?.readoutText?.includes('task placement')
    || !summary.environmentApi?.readoutText?.includes('memory pressure')
    || !summary.environmentApi?.readoutText?.includes('network capacity')
    || !summary.environmentApi?.readoutText?.includes('placement plan')
    || !summary.environmentApi?.readoutText?.includes('remote place')
    || !summary.environmentApi?.readoutText?.includes('remote solver')
    || !summary.environmentApi?.readoutText?.includes('remote decisions')
    || !summary.environmentApi?.readoutText?.includes('node kernel')
    || !summary.environmentApi?.readoutText?.includes('readout cadence')
    || !summary.environmentApi?.readoutText?.includes('hud mode')
    || !summary.environmentApi?.readoutText?.includes('solver admission')
    || !summary.environmentApi?.readoutText?.includes('refinement schedule')
    || !summary.environmentApi?.readoutText?.includes('render budget')
    || !summary.environmentApi?.readoutText?.includes('readback budget')) {
    throw new Error(`Runtime readout missing solver load/scales/manager stats/family telemetry: ${summary.environmentApi?.readoutText}`);
  }
  if (summary.layerSamples.length !== LAYER_IDS.length) {
    throw new Error(`Expected ${LAYER_IDS.length} layer pixel samples, saw ${summary.layerSamples.length}`);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
