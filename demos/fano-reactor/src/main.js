import './style.css';
import {
  CHEMISTRY_CATALOG,
  PERIOD_META,
  getBondLegend,
  getConnectedLowerIndices,
  getDisplayReactiveDegree,
  getStateById,
  getZeroTargets,
  summarizeInteraction
} from './model/chemistry.js';

const app = document.querySelector('#app');

const periodOptions = PERIOD_META.map((item) => (
  `<option value="${item.lowerIndex}">Period ${item.period} :: e${item.lowerIndex} :: noble ${item.nobleGas}</option>`
)).join('');

const stateOptions = CHEMISTRY_CATALOG.showcaseStates
  .map((state) => `<option value="${state.id}">${state.label}</option>`)
  .join('');

const cascadeSample = CHEMISTRY_CATALOG.cascadeSample;
const defaultLeft = cascadeSample?.atomA?.id || CHEMISTRY_CATALOG.reactiveStates[0]?.id || '';
const defaultRight = cascadeSample?.atomB?.id || getZeroTargets(getStateById(defaultLeft))[0]?.id || defaultLeft;
const defaultNoble = CHEMISTRY_CATALOG.nobleGasStates.find((state) => state.id === 'e1+e9')?.id || CHEMISTRY_CATALOG.nobleGasStates[0]?.id || '';

app.innerHTML = `
  <div class="shell">
    <div class="screen-noise"></div>
    <div class="grid"></div>
    <header class="hero panel">
      <div>
        <div class="eyebrow">ALGORITHMIC CHEMISTRY CONSOLE</div>
        <h1>Fano Reactor</h1>
        <p>
          big dog, this first scaffold keeps the chemistry model exact and the interaction surface explainable.
          Atoms are canonical sedenion states, reactions are classified from the composition norm defect,
          and the Fano plane exposes which period families can talk to each other.
        </p>
      </div>
      <div class="hero-stats">
        <div><span>Reactive States</span><strong>${CHEMISTRY_CATALOG.counts.reactiveStates}</strong></div>
        <div><span>Reactive Families</span><strong>${CHEMISTRY_CATALOG.counts.reactiveFamilies}</strong></div>
        <div><span>Directed ZD Pairs</span><strong>${CHEMISTRY_CATALOG.counts.directedZeroDivisorPairs}</strong></div>
        <div><span>Noble Channels</span><strong>${CHEMISTRY_CATALOG.counts.nobleGasChannels}</strong></div>
      </div>
    </header>

    <div class="toolbar panel">
      <button class="mode-tab active" data-mode-tab="bond-lab">bond-lab</button>
      <button class="mode-tab" data-mode-tab="fano-map">fano-map</button>
      <div class="toolbar-note"><code>swarm</code> and live PeerCompute task sharding are planned next.</div>
    </div>

    <main class="layout">
      <section class="panel mode-panel active" data-mode-panel="bond-lab">
        <div class="panel-title">Bond Lab</div>
        <div class="selectors">
          <label>
            <span>Atom A</span>
            <select id="left-state">${stateOptions}</select>
          </label>
          <label>
            <span>Atom B</span>
            <select id="right-state">${stateOptions}</select>
          </label>
          <div class="selector-actions">
            <button id="pick-target">Pick valid target</button>
            <button id="load-cascade">Load cascade sample</button>
            <button id="load-noble">Load noble gas guard</button>
          </div>
        </div>

        <div class="reaction-board">
          <article class="state-card">
            <div class="label">Atom A</div>
            <div id="left-label" class="state-label"></div>
            <div id="left-meta" class="meta-list"></div>
          </article>
          <article class="state-card center">
            <div class="label">Reaction</div>
            <div id="delta-badge" class="delta-badge"></div>
            <div id="bond-detail" class="bond-detail"></div>
            <div id="product-label" class="product-label"></div>
          </article>
          <article class="state-card">
            <div class="label">Atom B</div>
            <div id="right-label" class="state-label"></div>
            <div id="right-meta" class="meta-list"></div>
          </article>
        </div>

        <div class="molecule-grid">
          <article class="panel inset">
            <div class="panel-title">Molecule</div>
            <div id="molecule-label" class="state-label"></div>
            <div id="molecule-meta" class="meta-list"></div>
          </article>
          <article class="panel inset">
            <div class="panel-title">Target Console</div>
            <div id="target-list" class="chip-list"></div>
          </article>
          <article class="panel inset">
            <div class="panel-title">Cascade Probe</div>
            <div id="cascade-output" class="cascade-output"></div>
          </article>
        </div>
      </section>

      <section class="panel mode-panel" data-mode-panel="fano-map">
        <div class="panel-title">Fano Map</div>
        <div class="map-layout">
          <div class="map-shell">
            <svg id="fano-map" viewBox="0 0 520 420" role="img" aria-label="Fano period map"></svg>
          </div>
          <aside class="map-sidebar">
            <label>
              <span>Focus period family</span>
              <select id="period-select">${periodOptions}</select>
            </label>
            <div id="period-meta" class="meta-list"></div>
            <div class="panel inset">
              <div class="panel-title">Reactive States</div>
              <div id="period-states" class="chip-list"></div>
            </div>
            <div class="panel inset">
              <div class="panel-title">Connected Families</div>
              <div id="connected-families" class="chip-list"></div>
            </div>
          </aside>
        </div>
      </section>

      <aside class="panel side-console">
        <div class="panel-title">System Console</div>
        <div id="console-lines" class="console-lines"></div>
        <div class="legend">
          ${Object.values(getBondLegend()).map((item) => `
            <div class="legend-row">
              <span class="swatch ${item.tone}"></span>
              <div><strong>${item.label}</strong><small>${item.detail}</small></div>
            </div>
          `).join('')}
        </div>
      </aside>
    </main>
  </div>
`;

const leftSelect = document.querySelector('#left-state');
const rightSelect = document.querySelector('#right-state');
const pickTargetButton = document.querySelector('#pick-target');
const loadCascadeButton = document.querySelector('#load-cascade');
const loadNobleButton = document.querySelector('#load-noble');
const periodSelect = document.querySelector('#period-select');
const modeTabs = Array.from(document.querySelectorAll('[data-mode-tab]'));
const modePanels = Array.from(document.querySelectorAll('[data-mode-panel]'));

leftSelect.value = defaultLeft;
rightSelect.value = defaultRight;
if (cascadeSample) {
  periodSelect.value = String(cascadeSample.atomA.lowerIndex);
}

const periodPositions = {
  1: { x: 260, y: 48 },
  2: { x: 112, y: 144 },
  3: { x: 408, y: 144 },
  4: { x: 92, y: 310 },
  5: { x: 428, y: 310 },
  6: { x: 260, y: 360 },
  7: { x: 260, y: 210 }
};

const formatMetaList = (entries) => entries.map(([label, value]) => (
  `<div><span>${label}</span><strong>${value}</strong></div>`
)).join('');

const renderChipList = (values, tone = '') => {
  if (!values.length) return '<div class="empty">none</div>';
  return values.map((value) => `<span class="chip ${tone}">${value}</span>`).join('');
};

const renderConsole = (interaction) => {
  const targets = getZeroTargets(interaction.left);
  const connectedPeriods = getConnectedLowerIndices(interaction.left.lowerIndex);
  document.querySelector('#console-lines').innerHTML = [
    `A = ${interaction.left.label}`,
    `B = ${interaction.right.label}`,
    `A * B = ${interaction.zeroDivisor ? '0' : interaction.productLabel}`,
    `N(A * B) = ${interaction.productNorm}`,
    `Delta = ${interaction.delta}`,
    `Zero-divisor path = ${interaction.zeroDivisor ? 'YES' : 'NO'}`,
    `A target set = ${targets.map((state) => state.label).join(', ')}`,
    `Fano-linked lower families = ${connectedPeriods.join(', ')}`
  ].map((line) => `<div>${line}</div>`).join('');
};

const renderFanoMap = (focusLowerIndex) => {
  const svg = document.querySelector('#fano-map');
  const connected = new Set(getConnectedLowerIndices(focusLowerIndex));

  svg.innerHTML = `
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    ${[
      [1, 2, 3],
      [1, 4, 5],
      [1, 6, 7],
      [2, 4, 6],
      [2, 5, 7],
      [3, 4, 7],
      [3, 5, 6]
    ].map((triple) => {
      const active = triple.includes(focusLowerIndex);
      const points = triple.map((index) => `${periodPositions[index].x},${periodPositions[index].y}`).join(' ');
      return `<polyline class="fano-line ${active ? 'active' : ''}" points="${points}" />`;
    }).join('')}
    ${PERIOD_META.map((item) => {
      const position = periodPositions[item.lowerIndex];
      const active = item.lowerIndex === focusLowerIndex;
      const linked = connected.has(item.lowerIndex);
      const stateClass = active ? 'active' : (linked ? 'linked' : '');
      return `
        <g class="period-node ${stateClass}" transform="translate(${position.x}, ${position.y})">
          <circle r="${active ? 40 : 32}" />
          <text class="period-number" y="-6">P${item.period}</text>
          <text class="period-label" y="16">e${item.lowerIndex}</text>
        </g>
      `;
    }).join('')}
  `;

  const focusMeta = PERIOD_META.find((item) => item.lowerIndex === focusLowerIndex);
  const states = CHEMISTRY_CATALOG.reactiveStates.filter((state) => state.lowerIndex === focusLowerIndex);
  const connectedFamilies = getConnectedLowerIndices(focusLowerIndex).map((index) => {
    const item = PERIOD_META.find((entry) => entry.lowerIndex === index);
    return `P${item.period} / e${index}`;
  });

  document.querySelector('#period-meta').innerHTML = formatMetaList([
    ['Period', focusMeta.period],
    ['Shell length', focusMeta.shellLength],
    ['Layer', focusMeta.layer],
    ['Partner', `${focusMeta.nobleGas} :: e${focusMeta.partnerIndex}`]
  ]);
  document.querySelector('#period-states').innerHTML = renderChipList(states.map((state) => state.label));
  document.querySelector('#connected-families').innerHTML = renderChipList(connectedFamilies, 'linked');
};

const renderInteraction = () => {
  const leftState = getStateById(leftSelect.value);
  const rightState = getStateById(rightSelect.value);
  const interaction = summarizeInteraction(leftState, rightState);

  document.querySelector('#left-label').textContent = leftState.label;
  document.querySelector('#right-label').textContent = rightState.label;
  document.querySelector('#left-meta').innerHTML = formatMetaList([
    ['Period', `P${leftState.period}`],
    ['Layer', leftState.layer],
    ['Targets', getDisplayReactiveDegree(leftState)],
    ['Partner', `${leftState.nobleGas} :: e${leftState.lowerIndex + 8}`]
  ]);
  document.querySelector('#right-meta').innerHTML = formatMetaList([
    ['Period', `P${rightState.period}`],
    ['Layer', rightState.layer],
    ['Targets', getDisplayReactiveDegree(rightState)],
    ['Partner', `${rightState.nobleGas} :: e${rightState.lowerIndex + 8}`]
  ]);

  const deltaBadge = document.querySelector('#delta-badge');
  deltaBadge.className = `delta-badge ${interaction.bond.tone}`;
  deltaBadge.textContent = `Delta ${interaction.delta >= 0 ? '+' : ''}${interaction.delta}`;
  document.querySelector('#bond-detail').textContent = `${interaction.bond.label} :: ${interaction.bond.detail}`;
  document.querySelector('#product-label').textContent = interaction.zeroDivisor
    ? 'A * B = 0'
    : `A * B = ${interaction.productLabel}`;

  document.querySelector('#molecule-label').textContent = interaction.molecule.label;
  document.querySelector('#molecule-meta').innerHTML = formatMetaList([
    ['Norm', interaction.molecule.norm],
    ['Canonical targets', interaction.moleculeCanonicalTargets],
    ['Paper score', interaction.moleculePaperTargets],
    ['Zero-divisor escape', interaction.zeroDivisor ? 'bond path available' : 'not forced']
  ]);

  document.querySelector('#target-list').innerHTML = renderChipList(
    getZeroTargets(leftState).map((state) => state.label),
    interaction.bond.tone
  );

  const cascadeLines = [];
  const sampleTargets = interaction.moleculeTargets.map((state) => state.label);
  cascadeLines.push(`<div><span>atom</span><strong>${getDisplayReactiveDegree(leftState)}</strong></div>`);
  cascadeLines.push(`<div><span>molecule</span><strong>${interaction.moleculePaperTargets}</strong></div>`);
  if (sampleTargets.length) {
    cascadeLines.push(`<div><span>next target</span><strong>${sampleTargets[0]}</strong></div>`);
  } else {
    cascadeLines.push('<div><span>next target</span><strong>none</strong></div>');
  }
  if (cascadeSample) {
    cascadeLines.push(`<div><span>reference path</span><strong>${cascadeSample.atomA.label} + ${cascadeSample.atomB.label} -> ${cascadeSample.atomC.label}</strong></div>`);
    cascadeLines.push(`<div><span>reference score</span><strong>${cascadeSample.molecule.paperTargets} -> ${cascadeSample.superMolecule.paperTargets}</strong></div>`);
  }
  if (leftState.isCdPartner || rightState.isCdPartner) {
    cascadeLines.push('<div><span>noble guard</span><strong>CD partner selected :: inert channel</strong></div>');
  }
  document.querySelector('#cascade-output').innerHTML = cascadeLines.join('');

  renderConsole(interaction);
  periodSelect.value = String(leftState.lowerIndex);
  renderFanoMap(leftState.lowerIndex);
};

const setCompanionTarget = () => {
  const leftState = getStateById(leftSelect.value);
  const targets = getZeroTargets(leftState);
  if (!targets.length) return;
  rightSelect.value = targets[0].id;
  renderInteraction();
};

const loadCascadeSample = () => {
  if (!cascadeSample) return;
  leftSelect.value = cascadeSample.atomA.id;
  rightSelect.value = cascadeSample.atomB.id;
  renderInteraction();
};

const loadNobleSample = () => {
  if (!defaultNoble) return;
  leftSelect.value = defaultNoble;
  rightSelect.value = defaultRight;
  renderInteraction();
};

for (const tab of modeTabs) {
  tab.addEventListener('click', () => {
    const target = tab.dataset.modeTab;
    modeTabs.forEach((item) => item.classList.toggle('active', item === tab));
    modePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.modePanel === target));
  });
}

leftSelect.addEventListener('change', renderInteraction);
rightSelect.addEventListener('change', renderInteraction);
pickTargetButton.addEventListener('click', setCompanionTarget);
loadCascadeButton.addEventListener('click', loadCascadeSample);
loadNobleButton.addEventListener('click', loadNobleSample);
periodSelect.addEventListener('change', () => renderFanoMap(Number(periodSelect.value)));

renderInteraction();
