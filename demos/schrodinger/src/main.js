import './styles.css';
import { ELEMENTS, getElementBySymbol, maxOrbitalLForN } from './data/elements.js';
import { MATERIALS } from './data/materials.js';
import { BOND_CLASS_STYLE, summarizeBondEvents } from './data/molecularStructures.js';
import { estimateElementProperties, estimateMoleculeProperties } from './materials/materialProperties.js';
import { isPacketFresh, validatePropertyPacket } from './materials/propertyPacket.js';
import { L_LABELS, orbitalRunId } from './quantum/orbitals.js';
import {
  ORBITAL_GRID_WEBGPU_SCHEMA,
  RADIAL_WEBGPU_EIGENSOLVER_SCHEMA,
  buildOrbitalGridGpu,
  getWebGPUStatus,
  runWebGPUProbabilitySmoke,
  solveRadialSchrodingerEigenstateGpu
} from './quantum/webgpuWaveSolver.js';
import { attachPeerComputeSession } from './peercompute/session.js';
import { SchrodingerViewport } from './visualization/orbitalCloud.js';

const app = document.querySelector('#app');
const ATM_PA = 101325;

const state = {
  viewMode: 'water',
  elementSymbol: 'O',
  n: 2,
  l: 1,
  m: 0,
  gridSize: 28,
  pointCount: 70000,
  screeningExchange: true,
  relativisticSpinOrbit: false,
  correlationMixing: false,
  materialId: 'water',
  temperatureK: 293.15,
  pressureAtm: 1,
  gravityMps2: 9.81,
  reactiveElementSymbol: 'H',
  reactiveCount: 5,
  rotating: true,
  guides: false,
  currentPacket: null,
  peerSession: null,
  peerStatus: 'standalone',
  webgpuStatus: 'probing',
  webgpuDetail: '',
  orbitalStats: null,
  radialEigenstate: null
};

const elementOptions = ELEMENTS
  .map((element) => `<option value="${element.symbol}">${element.symbol} :: ${element.name} :: Z=${element.Z}</option>`)
  .join('');

const materialOptions = [
  '<optgroup label="Molecules">',
  ...MATERIALS.map((material) => `<option value="${material.id}">${material.label}</option>`),
  '</optgroup>',
  '<optgroup label="Elements">',
  ...ELEMENTS.map((element) => `<option value="element:${element.symbol}">${element.name} (${element.symbol})</option>`),
  '</optgroup>'
].join('');

const reactiveElementOptions = ELEMENTS
  .map((element) => `<option value="${element.symbol}">${element.symbol} :: ${element.name}</option>`)
  .join('');

app.innerHTML = `
  <div class="terminal-shell">
    <section class="viewport-panel">
      <div id="viewport" class="viewport"></div>
      <div class="viewport-hud">
        <div><span>backend</span><strong id="backend-status">webgpu-required</strong></div>
        <div><span>packet</span><strong id="packet-status">pending</strong></div>
        <div><span>peercompute</span><strong id="peer-status">standalone</strong></div>
      </div>
    </section>

    <aside class="control-panel left-panel">
      <header class="panel-header">
        <div class="eyebrow">MATERIALS CONSOLE</div>
        <h1>Schrodinger</h1>
      </header>

      <label class="field">
        <span>View</span>
        <select id="view-mode">
          <option value="water">Material cell</option>
          <option value="reactive">Reactive atoms</option>
          <option value="orbital">Orbital cloud</option>
          <option value="wave">Wave grid</option>
        </select>
      </label>

      <div class="section-label">Atom</div>
      <label class="field">
        <span>Element</span>
        <select id="element-select">${elementOptions}</select>
      </label>

      <label class="field">
        <span>Principal n</span>
        <input id="n-input" type="range" min="1" max="6" step="1" value="${state.n}" />
        <output id="n-output">${state.n}</output>
      </label>

      <label class="field">
        <span>Angular l</span>
        <select id="l-select"></select>
      </label>

      <label class="field">
        <span>Magnetic m</span>
        <select id="m-select"></select>
      </label>

      <label class="field">
        <span>Point samples</span>
        <input id="point-count" type="range" min="10000" max="140000" step="5000" value="${state.pointCount}" />
        <output id="point-output">${state.pointCount.toLocaleString()}</output>
      </label>

      <label class="toggle"><input id="screening" type="checkbox" checked /> <span>screening/exchange</span></label>
      <label class="toggle"><input id="relativistic" type="checkbox" /> <span>relativistic/spin-orbit</span></label>
      <label class="toggle"><input id="correlation" type="checkbox" /> <span>correlation mixing</span></label>

      <div class="button-row">
        <button id="regenerate">regenerate</button>
        <button id="rotate-toggle">pause</button>
        <button id="guides-toggle">guides</button>
      </div>

      <div class="section-label">Network</div>
      <button id="peercompute-attach">attach peercompute</button>
      <button id="publish-packet">publish packet</button>
      <pre id="network-log" class="mini-log">standalone</pre>
    </aside>

    <aside class="control-panel right-panel">
      <div class="section-label">Material</div>
      <label class="field">
        <span>Sample</span>
        <select id="material-select">${materialOptions}</select>
      </label>

      <label class="field">
        <span>Temperature K</span>
        <input id="temperature" type="range" min="20" max="6000" step="1" value="${state.temperatureK}" />
        <output id="temperature-output">${state.temperatureK.toFixed(0)}</output>
      </label>

      <label class="field">
        <span>Pressure atm</span>
        <input id="pressure" type="range" min="0.05" max="25" step="0.05" value="${state.pressureAtm}" />
        <output id="pressure-output">${state.pressureAtm.toFixed(2)}</output>
      </label>

      <label class="field">
        <span>Gravity m/s2</span>
        <input id="gravity" type="range" min="0" max="30" step="0.1" value="${state.gravityMps2}" />
        <output id="gravity-output">${state.gravityMps2.toFixed(1)}</output>
      </label>

      <div class="section-label">Reactive Atoms</div>
      <label class="field">
        <span>Element</span>
        <select id="reactive-element">${reactiveElementOptions}</select>
      </label>

      <label class="field">
        <span>Count</span>
        <input id="reactive-count" type="range" min="1" max="40" step="1" value="${state.reactiveCount}" />
        <output id="reactive-count-output">${state.reactiveCount}</output>
      </label>

      <div class="button-row">
        <button id="add-reactive-atoms">add atoms</button>
        <button id="add-water-mix">add 5 H2O</button>
        <button id="clear-reactive-atoms">clear</button>
      </div>
      <pre id="reactive-log" class="mini-log">toy-reactive-atoms-v0</pre>

      <div id="stats-panel" class="stats-panel"></div>
      <div class="section-label">Property Packet</div>
      <pre id="property-packet" class="packet-view"></pre>
    </aside>
  </div>
`;

const viewport = new SchrodingerViewport(document.querySelector('#viewport'));

const controls = {
  viewMode: document.querySelector('#view-mode'),
  element: document.querySelector('#element-select'),
  n: document.querySelector('#n-input'),
  nOutput: document.querySelector('#n-output'),
  l: document.querySelector('#l-select'),
  m: document.querySelector('#m-select'),
  pointCount: document.querySelector('#point-count'),
  pointOutput: document.querySelector('#point-output'),
  screening: document.querySelector('#screening'),
  relativistic: document.querySelector('#relativistic'),
  correlation: document.querySelector('#correlation'),
  material: document.querySelector('#material-select'),
  temperature: document.querySelector('#temperature'),
  temperatureOutput: document.querySelector('#temperature-output'),
  pressure: document.querySelector('#pressure'),
  pressureOutput: document.querySelector('#pressure-output'),
  gravity: document.querySelector('#gravity'),
  gravityOutput: document.querySelector('#gravity-output'),
  reactiveElement: document.querySelector('#reactive-element'),
  reactiveCount: document.querySelector('#reactive-count'),
  reactiveCountOutput: document.querySelector('#reactive-count-output'),
  addReactiveAtoms: document.querySelector('#add-reactive-atoms'),
  addWaterMix: document.querySelector('#add-water-mix'),
  clearReactiveAtoms: document.querySelector('#clear-reactive-atoms'),
  reactiveLog: document.querySelector('#reactive-log'),
  regenerate: document.querySelector('#regenerate'),
  rotate: document.querySelector('#rotate-toggle'),
  guides: document.querySelector('#guides-toggle'),
  attach: document.querySelector('#peercompute-attach'),
  publish: document.querySelector('#publish-packet'),
  networkLog: document.querySelector('#network-log'),
  stats: document.querySelector('#stats-panel'),
  packet: document.querySelector('#property-packet'),
  backendStatus: document.querySelector('#backend-status'),
  packetStatus: document.querySelector('#packet-status'),
  peerStatus: document.querySelector('#peer-status')
};

const formatNumber = (value, digits = 3) => {
  if (value === null || value === undefined) return 'n/a';
  if (!Number.isFinite(value)) return String(value);
  const abs = Math.abs(value);
  if (abs >= 1e5 || (abs > 0 && abs < 1e-3)) return value.toExponential(2);
  return value.toFixed(digits).replace(/\.?0+$/, '');
};

const createUnavailableRadialEigenstate = ({ element, n, l, error }) => ({
  schema: RADIAL_WEBGPU_EIGENSOLVER_SCHEMA,
  modelId: 'radial-webgpu-required-v0',
  mode: 'time-independent-radial-schrodinger',
  status: 'webgpu-unavailable',
  backend: 'webgpu-required',
  solver: 'none',
  potentialModel: 'unavailable',
  elementSymbol: element?.symbol || null,
  atomicNumber: element?.Z || null,
  principalN: n,
  angularL: l,
  radialNodeCountTarget: Math.max(0, n - l - 1),
  radialNodeCountObserved: null,
  energyEv: null,
  energyErrorEv: null,
  residualRelativeL2: null,
  meanRadiusBohr: null,
  gridPointCount: 0,
  radialSamples: [],
  webgpuStatus: {
    available: false,
    reason: error?.message || String(error || 'WebGPU unavailable')
  },
  validity: {
    status: 'webgpu-required',
    warnings: ['No CPU fallback was used for the Schrodinger radial solve.']
  }
});

const createUnavailableOrbitalGrid = ({ element, n, l, m, gridSize, error }) => ({
  schema: ORBITAL_GRID_WEBGPU_SCHEMA,
  modelId: 'orbital-grid-webgpu-required-v0',
  status: 'webgpu-unavailable',
  backend: 'webgpu-required',
  elementSymbol: element?.symbol || null,
  atomicNumber: element?.Z || null,
  principalN: n,
  angularL: l,
  magneticM: m,
  gridSize,
  positions: new Float32Array(0),
  probabilities: new Float32Array(0),
  points: new Float32Array(0),
  colors: new Float32Array(0),
  normalization: null,
  boundaryMass: null,
  energyEv: null,
  zEff: null,
  pointSampleCount: 0,
  pointSamplingMode: 'webgpu-required',
  webgpuStatus: {
    available: false,
    reason: error?.message || String(error || 'WebGPU unavailable')
  },
  validity: {
    status: 'webgpu-required',
    warnings: ['No CPU fallback was used for the Schrodinger orbital grid.']
  }
});

const compositionFormula = (packet) => Object.keys(packet?.state?.composition || {})[0] || 'n/a';

const renderBondLegend = (packet) => {
  const bondEvents = packet?.chemical?.bondEvents || [];
  const summary = summarizeBondEvents(bondEvents);
  const entries = Object.entries(summary);
  if (!entries.length) return '<div class="bond-legend empty">no molecular bond template in packet</div>';

  const chips = entries.map(([bondClass, count]) => {
    const style = BOND_CLASS_STYLE[bondClass] || BOND_CLASS_STYLE.unknown;
    return `<span class="bond-chip bond-${bondClass}"><span class="bond-swatch"></span>${style.label}: ${count}</span>`;
  }).join('');
  const details = bondEvents.slice(0, 6).map((event) => (
    `<div class="bond-line">${event.atoms.join('-')} :: ${event.label} :: order ${event.order}</div>`
  )).join('');

  return `<div class="bond-legend">${chips}<div class="bond-detail">${details}</div></div>`;
};

const renderReactiveBondLegend = (summary) => {
  const entries = Object.entries(summary?.bondSummary || {});
  if (!entries.length) return '<div class="bond-legend empty">no active bonds</div>';
  const chips = entries.map(([bondClass, count]) => {
    const style = BOND_CLASS_STYLE[bondClass] || BOND_CLASS_STYLE.unknown;
    return `<span class="bond-chip bond-${bondClass}"><span class="bond-swatch"></span>${style.label}: ${count}</span>`;
  }).join('');
  const molecules = (summary.molecules || [])
    .slice(0, 8)
    .map((item) => `<div class="bond-line">${item.formula} x${item.count}</div>`)
    .join('');
  return `<div class="bond-legend">${chips}<div class="bond-detail">${molecules}</div></div>`;
};

const syncReactiveEnvironment = () => {
  viewport.setReactiveEnvironment({
    temperatureK: state.temperatureK,
    pressureAtm: state.pressureAtm,
    gravityMps2: state.gravityMps2
  });
};

const updateQuantumSelectors = () => {
  const maxL = maxOrbitalLForN(state.n);
  state.l = Math.min(state.l, maxL);
  state.m = Math.max(-state.l, Math.min(state.m, state.l));
  controls.l.innerHTML = Array.from({ length: maxL + 1 }, (_, value) => (
    `<option value="${value}">${value} (${L_LABELS[value] || 'higher'})</option>`
  )).join('');
  controls.l.value = String(state.l);
  controls.m.innerHTML = Array.from({ length: state.l * 2 + 1 }, (_, index) => index - state.l)
    .map((value) => `<option value="${value}">${value}</option>`)
    .join('');
  controls.m.value = String(state.m);
};

const setViewMode = (mode) => {
  state.viewMode = mode;
  controls.viewMode.value = mode;
  viewport.setMode(mode);
};

const readStateFromControls = () => {
  state.viewMode = controls.viewMode.value;
  state.elementSymbol = controls.element.value;
  state.n = Number(controls.n.value);
  state.l = Number(controls.l.value || 0);
  state.m = Number(controls.m.value || 0);
  state.pointCount = Number(controls.pointCount.value);
  state.screeningExchange = controls.screening.checked;
  state.relativisticSpinOrbit = controls.relativistic.checked;
  state.correlationMixing = controls.correlation.checked;
  state.materialId = controls.material.value;
  state.temperatureK = Number(controls.temperature.value);
  state.pressureAtm = Number(controls.pressure.value);
  state.gravityMps2 = Number(controls.gravity.value);
  state.reactiveElementSymbol = controls.reactiveElement.value;
  state.reactiveCount = Number(controls.reactiveCount.value);
  controls.nOutput.textContent = String(state.n);
  controls.pointOutput.textContent = state.pointCount.toLocaleString();
  controls.temperatureOutput.textContent = state.temperatureK.toFixed(0);
  controls.pressureOutput.textContent = state.pressureAtm.toFixed(2);
  controls.gravityOutput.textContent = state.gravityMps2.toFixed(1);
  controls.reactiveCountOutput.textContent = String(state.reactiveCount);
};

const renderStats = () => {
  if (state.viewMode === 'reactive') {
    const summary = viewport.getReactiveSummary();
    controls.packetStatus.textContent = `reactive :: ${summary.atomCount} atoms`;
    controls.peerStatus.textContent = state.peerStatus;
    controls.backendStatus.textContent = 'toy-reactive';
    const composition = Object.entries(summary.composition)
      .map(([symbol, count]) => `${symbol}${count}`)
      .join(' ') || 'empty';
    const moleculeText = summary.molecules
      .map((item) => `${item.formula} x${item.count}`)
      .join(' / ') || 'none';
    const warnings = summary.warnings || [];
    controls.stats.innerHTML = `
      <div class="stat-grid">
        <div><span>atoms</span><strong>${summary.atomCount}</strong></div>
        <div><span>bonds</span><strong>${summary.bondCount}</strong></div>
        <div><span>composition</span><strong>${composition}</strong></div>
        <div><span>molecules</span><strong>${moleculeText}</strong></div>
        <div><span>temperature K</span><strong>${formatNumber(summary.environment.temperatureK, 1)}</strong></div>
        <div><span>pressure atm</span><strong>${formatNumber(summary.environment.pressureAtm, 2)}</strong></div>
        <div><span>gravity m/s2</span><strong>${formatNumber(summary.environment.gravityMps2, 2)}</strong></div>
        <div><span>time s</span><strong>${formatNumber(summary.timeS, 2)}</strong></div>
      </div>
      ${renderReactiveBondLegend(summary)}
      <div class="validation warn">toy-reactive-atoms-v0 :: heuristic</div>
      ${warnings.length ? `<div class="warnings">${warnings.map((warning) => `<div>${warning}</div>`).join('')}</div>` : ''}
      <div class="mini-log">${state.webgpuDetail}</div>
    `;
    controls.packet.textContent = JSON.stringify(viewport.getReactiveSnapshot(), null, 2);
    return;
  }

  const packet = state.currentPacket;
  const orbital = state.orbitalStats;
  const radialEigenstate = state.radialEigenstate;
  const validation = packet ? validatePropertyPacket(packet) : { ok: false };
  controls.packetStatus.textContent = packet
    ? `${packet.state.phase} :: ${isPacketFresh(packet) ? 'fresh' : 'stale'}`
    : 'pending';
  controls.peerStatus.textContent = state.peerStatus;
  controls.backendStatus.textContent = radialEigenstate?.backend || orbital?.backend || 'webgpu-required';

  const warnings = packet?.validation?.warnings || [];
  controls.stats.innerHTML = `
    <div class="stat-grid">
      <div><span>element</span><strong>${getElementBySymbol(state.elementSymbol).name}</strong></div>
      <div><span>orbital</span><strong>n=${state.n} l=${state.l} m=${state.m}</strong></div>
      <div><span>structure</span><strong>${compositionFormula(packet)}</strong></div>
      <div><span>bonds</span><strong>${Object.entries(summarizeBondEvents(packet?.chemical?.bondEvents || [])).map(([type, count]) => `${count} ${type}`).join(' / ') || 'none'}</strong></div>
      <div><span>orbital backend</span><strong>${orbital?.backend || 'pending'}</strong></div>
      <div><span>point sampler</span><strong>${orbital?.pointSamplingMode ? `${orbital.pointSamplingMode} / ${orbital.pointSampleCount?.toLocaleString?.() || orbital.pointSampleCount}` : 'pending'}</strong></div>
      <div><span>Zeff</span><strong>${formatNumber(orbital?.zEff, 4)}</strong></div>
      <div><span>energy eV</span><strong>${formatNumber(orbital?.energyEv, 4)}</strong></div>
      <div><span>GPU radial</span><strong>${radialEigenstate?.status || 'pending'}</strong></div>
      <div><span>GPU energy eV</span><strong>${formatNumber(radialEigenstate?.energyEv, 4)}</strong></div>
      <div><span>GPU error eV</span><strong>${formatNumber(radialEigenstate?.energyErrorEv, 5)}</strong></div>
      <div><span>GPU residual L2</span><strong>${formatNumber(radialEigenstate?.residualRelativeL2, 3)}</strong></div>
      <div><span>GPU nodes</span><strong>${radialEigenstate ? `${radialEigenstate.radialNodeCountObserved ?? 'n/a'}/${radialEigenstate.radialNodeCountTarget}` : 'n/a'}</strong></div>
      <div><span>GPU mean r bohr</span><strong>${formatNumber(radialEigenstate?.meanRadiusBohr, 3)}</strong></div>
      <div><span>norm</span><strong>${formatNumber(orbital?.normalization, 6)}</strong></div>
      <div><span>boundary mass</span><strong>${formatNumber(orbital?.boundaryMass, 5)}</strong></div>
      <div><span>phase</span><strong>${packet?.state.phase || 'n/a'}</strong></div>
      <div><span>density kg/m3</span><strong>${formatNumber(packet?.state.densityKgM3, 3)}</strong></div>
      <div><span>bulk Pa</span><strong>${formatNumber(packet?.mechanics.bulkModulusPa, 3)}</strong></div>
      <div><span>young Pa</span><strong>${formatNumber(packet?.mechanics.youngsModulusPa, 3)}</strong></div>
      <div><span>viscosity Pa*s</span><strong>${formatNumber(packet?.mechanics.viscosityPaS, 6)}</strong></div>
      <div><span>heat J/kgK</span><strong>${formatNumber(packet?.thermal.heatCapacityJkgK, 2)}</strong></div>
      <div><span>n optical</span><strong>${formatNumber(packet?.optical.refractiveIndex, 5)}</strong></div>
      <div><span>dielectric</span><strong>${formatNumber(packet?.electromagnetic.dielectricConstant, 4)}</strong></div>
      <div><span>conductivity S/m</span><strong>${formatNumber(packet?.electromagnetic.electricalConductivitySpm, 4)}</strong></div>
      <div><span>activity Bq/kg</span><strong>${formatNumber(packet?.nuclear.activityBqKg, 3)}</strong></div>
    </div>
    ${renderBondLegend(packet)}
    <div class="validation ${validation.ok ? 'ok' : 'warn'}">${packet?.validation.status || 'pending'} :: ${packet?.validation.referenceSet || 'none'}</div>
    ${warnings.length ? `<div class="warnings">${warnings.map((warning) => `<div>${warning}</div>`).join('')}</div>` : ''}
    <div class="mini-log">${state.webgpuDetail}</div>
  `;
  controls.packet.textContent = packet ? JSON.stringify(packet, null, 2) : '';
};

const updateMaterialPacket = () => {
  const pressurePa = state.pressureAtm * ATM_PA;
  syncReactiveEnvironment();
  state.currentPacket = state.materialId.startsWith('element:')
    ? estimateElementProperties({
        symbol: state.materialId.replace('element:', ''),
        temperatureK: state.temperatureK,
        pressurePa,
        sampleId: 'element-cell'
      })
    : estimateMoleculeProperties({
        materialId: state.materialId,
        temperatureK: state.temperatureK,
        pressurePa,
        sampleId: 'material-cell'
      });
  viewport.setWaterPacket(state.currentPacket);
  if (state.peerSession) publishCurrentPacket();
};

let orbitalRegenerationToken = 0;

const regenerateOrbital = async () => {
  const token = ++orbitalRegenerationToken;
  readStateFromControls();
  updateQuantumSelectors();
  const element = getElementBySymbol(state.elementSymbol);
  const options = {
    screeningExchange: state.screeningExchange,
    relativisticSpinOrbit: state.relativisticSpinOrbit,
    correlationMixing: state.correlationMixing
  };
  const start = performance.now();
  state.orbitalStats = {
    schema: ORBITAL_GRID_WEBGPU_SCHEMA,
    modelId: 'orbital-grid-webgpu-pending-v0',
    status: 'webgpu-pending',
    backend: 'webgpu-orbital-grid-density',
    elementSymbol: element.symbol,
    atomicNumber: element.Z,
    principalN: state.n,
    angularL: state.l,
    magneticM: state.m,
    gridSize: state.gridSize,
    pointSampleCount: state.pointCount,
    pointSamplingMode: 'webgpu-pending'
  };
  state.radialEigenstate = {
    schema: RADIAL_WEBGPU_EIGENSOLVER_SCHEMA,
    modelId: 'radial-webgpu-pending-v0',
    mode: 'time-independent-radial-schrodinger',
    status: 'webgpu-pending',
    backend: 'webgpu-radial-schrodinger',
    elementSymbol: element.symbol,
    atomicNumber: element.Z,
    principalN: state.n,
    angularL: state.l,
    radialNodeCountTarget: Math.max(0, state.n - state.l - 1),
    radialNodeCountObserved: null
  };
  renderStats();
  let grid;
  let radialEigenstate;
  try {
    grid = await buildOrbitalGridGpu({
      element,
      n: state.n,
      l: state.l,
      m: state.m,
      gridSize: state.gridSize,
      sampleCount: state.pointCount,
      sampleSeed: orbitalRunId({ element, n: state.n, l: state.l, m: state.m, gridSize: state.gridSize, options }),
      options
    });
    radialEigenstate = await solveRadialSchrodingerEigenstateGpu({
      element,
      n: state.n,
      l: state.l,
      zEff: grid.zEff,
      options,
      gridPointCount: Math.max(512, state.gridSize * 18)
    });
    state.webgpuStatus = 'ok';
    state.webgpuDetail = `webgpu orbital ${grid.gridSize}^3 norm=${formatNumber(grid.normalization, 6)} / radial ${radialEigenstate.status} E=${formatNumber(radialEigenstate.energyEv, 4)}eV residual=${formatNumber(radialEigenstate.residualRelativeL2, 3)}`;
  } catch (err) {
    grid = createUnavailableOrbitalGrid({
      element,
      n: state.n,
      l: state.l,
      m: state.m,
      gridSize: state.gridSize,
      error: err
    });
    radialEigenstate = createUnavailableRadialEigenstate({
      element,
      n: state.n,
      l: state.l,
      error: err
    });
    state.webgpuStatus = 'unavailable';
    state.webgpuDetail = `webgpu orbital/radial unavailable: ${err.message || String(err)}`;
    state.orbitalStats = {
      ...grid,
      radialEigenstate,
      elapsedMs: performance.now() - start
    };
    state.radialEigenstate = radialEigenstate;
    updateMaterialPacket();
    renderStats();
    return;
  }
  if (token !== orbitalRegenerationToken) return;
  viewport.setOrbital({
    points: grid.points,
    colors: grid.colors,
    element,
    extentBohr: grid.extentBohr
  });
  state.orbitalStats = {
    ...grid,
    radialEigenstate,
    elapsedMs: performance.now() - start
  };
  state.radialEigenstate = radialEigenstate;
  viewport.setMode(state.viewMode);
  updateMaterialPacket();
  renderStats();
};

const publishCurrentPacket = () => {
  if (!state.peerSession || !state.currentPacket) return;
  state.peerSession.publishPacket(state.currentPacket);
  controls.networkLog.textContent = `published ${state.currentPacket.materialId}\npeer ${state.peerSession.getStatus().network?.peerId || 'unknown'}`;
};

const attachPeerCompute = async () => {
  if (state.peerSession) {
    publishCurrentPacket();
    return;
  }
  controls.networkLog.textContent = 'attaching...';
  try {
    state.peerSession = await attachPeerComputeSession({
      onStatus: (status) => {
        state.peerStatus = status;
        controls.peerStatus.textContent = status;
        controls.networkLog.textContent = status;
      }
    });
    state.peerStatus = 'attached';
    publishCurrentPacket();
  } catch (err) {
    state.peerStatus = 'standalone';
    controls.networkLog.textContent = `attach failed: ${err.message || String(err)}`;
  }
  renderStats();
};

const probeWebGPU = async () => {
  const status = await getWebGPUStatus();
  if (!status.available) {
    state.webgpuStatus = 'unavailable';
    state.webgpuDetail = `webgpu: ${status.reason}`;
    renderStats();
    return;
  }
  try {
    const smoke = await runWebGPUProbabilitySmoke();
    state.webgpuStatus = smoke.ok ? 'ok' : 'failed';
    state.webgpuDetail = `webgpu probability smoke total=${formatNumber(smoke.total, 6)}`;
  } catch (err) {
    state.webgpuStatus = 'failed';
    state.webgpuDetail = `webgpu smoke failed: ${err.message || String(err)}`;
  }
  renderStats();
};

const bindControls = () => {
  controls.viewMode.value = state.viewMode;
  controls.element.value = state.elementSymbol;
  controls.material.value = state.materialId;
  controls.reactiveElement.value = state.reactiveElementSymbol;
  updateQuantumSelectors();

  controls.viewMode.addEventListener('change', () => {
    readStateFromControls();
    viewport.setMode(state.viewMode);
    renderStats();
  });
  controls.element.addEventListener('change', regenerateOrbital);
  controls.n.addEventListener('input', () => {
    state.n = Number(controls.n.value);
    controls.nOutput.textContent = String(state.n);
    updateQuantumSelectors();
  });
  controls.n.addEventListener('change', regenerateOrbital);
  controls.l.addEventListener('change', regenerateOrbital);
  controls.m.addEventListener('change', regenerateOrbital);
  controls.pointCount.addEventListener('input', () => {
    controls.pointOutput.textContent = Number(controls.pointCount.value).toLocaleString();
  });
  controls.pointCount.addEventListener('change', regenerateOrbital);
  controls.screening.addEventListener('change', regenerateOrbital);
  controls.relativistic.addEventListener('change', regenerateOrbital);
  controls.correlation.addEventListener('change', regenerateOrbital);
  controls.material.addEventListener('change', () => {
    readStateFromControls();
    if (!state.materialId.startsWith('element:')) setViewMode('water');
    updateMaterialPacket();
    renderStats();
  });
  controls.temperature.addEventListener('input', () => {
    state.temperatureK = Number(controls.temperature.value);
    controls.temperatureOutput.textContent = state.temperatureK.toFixed(0);
    syncReactiveEnvironment();
    updateMaterialPacket();
    renderStats();
  });
  controls.pressure.addEventListener('input', () => {
    state.pressureAtm = Number(controls.pressure.value);
    controls.pressureOutput.textContent = state.pressureAtm.toFixed(2);
    syncReactiveEnvironment();
    updateMaterialPacket();
    renderStats();
  });
  controls.gravity.addEventListener('input', () => {
    state.gravityMps2 = Number(controls.gravity.value);
    controls.gravityOutput.textContent = state.gravityMps2.toFixed(1);
    syncReactiveEnvironment();
    renderStats();
  });
  controls.reactiveElement.addEventListener('change', () => {
    state.reactiveElementSymbol = controls.reactiveElement.value;
  });
  controls.reactiveCount.addEventListener('input', () => {
    state.reactiveCount = Number(controls.reactiveCount.value);
    controls.reactiveCountOutput.textContent = String(state.reactiveCount);
  });
  controls.addReactiveAtoms.addEventListener('click', () => {
    readStateFromControls();
    syncReactiveEnvironment();
    viewport.addReactiveAtoms(state.reactiveElementSymbol, state.reactiveCount);
    setViewMode('reactive');
    const summary = viewport.getReactiveSummary();
    controls.reactiveLog.textContent = `added ${state.reactiveCount} ${state.reactiveElementSymbol}\natoms ${summary.atomCount} bonds ${summary.bondCount}`;
    renderStats();
  });
  controls.addWaterMix.addEventListener('click', () => {
    readStateFromControls();
    syncReactiveEnvironment();
    viewport.addReactiveWaterRecipe(5);
    setViewMode('reactive');
    const summary = viewport.getReactiveSummary();
    controls.reactiveLog.textContent = `added 5 O + 10 H\natoms ${summary.atomCount} bonds ${summary.bondCount}`;
    renderStats();
  });
  controls.clearReactiveAtoms.addEventListener('click', () => {
    viewport.clearReactiveAtoms();
    setViewMode('reactive');
    controls.reactiveLog.textContent = 'cleared reactive atoms';
    renderStats();
  });
  controls.regenerate.addEventListener('click', regenerateOrbital);
  controls.rotate.addEventListener('click', () => {
    state.rotating = !state.rotating;
    controls.rotate.textContent = state.rotating ? 'pause' : 'rotate';
    viewport.setRotationEnabled(state.rotating);
  });
  controls.guides.addEventListener('click', () => {
    state.guides = !state.guides;
    viewport.setGuidesVisible(state.guides);
  });
  controls.attach.addEventListener('click', attachPeerCompute);
  controls.publish.addEventListener('click', publishCurrentPacket);
};

bindControls();
void regenerateOrbital();
void probeWebGPU();
setInterval(() => {
  updateMaterialPacket();
  renderStats();
}, 2000);
setInterval(() => {
  if (state.viewMode === 'reactive') renderStats();
}, 500);

window.__schrodingerDemo = {
  getState: () => ({ ...state, peerSession: Boolean(state.peerSession) }),
  setElement: (symbol) => {
    controls.element.value = symbol;
    void regenerateOrbital();
  },
  setMaterial: (materialId) => {
    controls.material.value = materialId;
    readStateFromControls();
    if (!state.materialId.startsWith('element:')) setViewMode('water');
    updateMaterialPacket();
    renderStats();
  },
  setConditions: ({ temperatureK, pressureAtm, gravityMps2 } = {}) => {
    if (Number.isFinite(temperatureK)) controls.temperature.value = String(temperatureK);
    if (Number.isFinite(pressureAtm)) controls.pressure.value = String(pressureAtm);
    if (Number.isFinite(gravityMps2)) controls.gravity.value = String(gravityMps2);
    readStateFromControls();
    syncReactiveEnvironment();
    updateMaterialPacket();
    renderStats();
  },
  addAtoms: (symbol, count = 1) => {
    viewport.addReactiveAtoms(symbol, count);
    setViewMode('reactive');
    renderStats();
  },
  addWaterMix: (count = 5) => {
    viewport.addReactiveWaterRecipe(count);
    setViewMode('reactive');
    renderStats();
  },
  clearAtoms: () => {
    viewport.clearReactiveAtoms();
    setViewMode('reactive');
    renderStats();
  },
  getReactiveState: () => viewport.getReactiveSnapshot(),
  getRadialEigenstate: () => state.radialEigenstate,
  getPacket: () => state.currentPacket
};
