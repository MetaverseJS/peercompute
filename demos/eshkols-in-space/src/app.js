import { createBodiesAsync } from '../physics/initial.mjs';
import { createSimulation } from './compute/runtime.js';
import { createView } from './view.js';

const FRAME_PREFIX = 'peercompute-atlas-demo:';
const RETURN_SIGNAL = 'peercompute.atlas.return.v1';

function detectEmbeddedMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('embedded') === '1' || params.get('embed') === '1') return true;
    if (window.name && window.name.startsWith(FRAME_PREFIX)) return true;
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  return false;
}

function returnToPeerComputeAtlas() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(RETURN_SIGNAL, '*');
      return true;
    }
  } catch {
    // Ignore cross-origin error.
  }
  return false;
}

const el = id => document.getElementById(id);
const number = id => el(id).valueAsNumber;
const pretty = new Intl.NumberFormat('en-US');
let device, view, simulation;
let revision = 0;
let running = true;
let steps = 0;
let simulatedTime = 0;
let latency = 0;
let lastStart = 0;
let lastMeterUpdate = 0;
let inFlight;
let framePending = false;
let resets = Promise.resolve();
let initialization;

const atlasReturnBtn = el('btn-atlas-return');
if (detectEmbeddedMode() && atlasReturnBtn) {
  document.documentElement.classList.add('is-embedded');
  atlasReturnBtn.hidden = false;
  atlasReturnBtn.addEventListener('click', () => {
    returnToPeerComputeAtlas();
  });
}

window.__eshkolsInSpace = {
  getState() {
    return {
      ready: Boolean(device && view && simulation && el('status')?.dataset.state !== 'error'),
      status: el('status')?.dataset.state || 'boot',
      statusText: el('status')?.textContent || '',
      error: el('notice')?.hidden === false ? el('notice').textContent : null,
      running,
      steps,
      simulatedTime,
      latency,
      preset: el('preset')?.value || '',
      distribution: el('distribution')?.value || '',
      slotCount: simulation?.count ?? 0,
      activeCount: simulation?.activeCount ?? 0,
      gravityMode: simulation?.gravityMode ?? null,
      embedded: detectEmbeddedMode()
    };
  },
  returnToAtlas: returnToPeerComputeAtlas
};

function status(text, state) {
  el('status').textContent = text;
  el('status').dataset.state = state;
}
function playback() {
  el('play').disabled = !simulation;
  el('step').disabled = !simulation || running || Boolean(inFlight);
  el('play-text').textContent = running ? 'Pause' : 'Resume';
  el('play').firstElementChild.className = running ? 'pause-icon' : 'play-icon';
  if (simulation) status(running ? 'Running' : 'Paused', running ? 'running' : 'paused');
}
function reportError(error) {
  simulation?.dispose();
  simulation = undefined;
  running = false;
  playback();
  status('Unavailable', 'error');
  el('notice').textContent = error.message + ' Restart the simulation to try again.';
  el('notice').hidden = false;
}
function meters(force = false) {
  const now = performance.now();
  if (!force && running && steps > 1 && now - lastMeterUpdate < 66) return;
  lastMeterUpdate = now;
  el('body-meter').textContent = pretty.format(simulation.activeCount);
  el('steps-meter').textContent = pretty.format(steps);
  el('time-meter').firstChild.textContent = simulatedTime.toFixed(2) + ' ';
  el('latency-meter').textContent = steps ? latency.toFixed(1) + ' ms' : '—';
}
async function ensureDevice() {
  if (device) return;
  if (!navigator.gpu) throw new Error('WebGPU is unavailable. Open this page on localhost or HTTPS in a WebGPU-enabled browser.');
  const result = await globalThis.EshkolWebGPU.create({ precision: 'fast', gateTolerance: 1e-6 });
  if (!result.ok) throw new Error('WebGPU initialization failed. ' + result.reason);
  const acquired = result.backend.device;
  device = acquired;
  acquired.addEventListener('uncapturederror', event => {
    if (device !== acquired || el('status').dataset.state === 'error') return;
    initialization?.abort();
    revision++;
    reportError(new Error(event.error.message || 'The GPU could not complete this run.'));
  });
  acquired.lost.then(info => {
    if (device !== acquired) return;
    device = undefined;
    initialization?.abort();
    revision++;
    reportError(new Error(info.message || 'The WebGPU device was lost.'));
    view?.dispose();
    view = undefined;
    el('engine').textContent = 'Device lost';
  });
  try {
    const fresh = await createView(el('scene'), el('scale-label'), acquired);
    if (device !== acquired) {
      fresh.dispose();
      throw new Error('The WebGPU device was lost during initialization.');
    }
    view = fresh;
    view.grid.visible = el('grid').getAttribute('aria-pressed') === 'true';
    el('engine').textContent = 'PeerCompute · WebGPU';
    const info = result.adapter.info;
    el('engine').title = [info?.vendor, info?.architecture, info?.description].filter(Boolean).join(' / ') || 'WebGPU adapter';
  } catch (error) {
    device = undefined;
    acquired.destroy();
    throw error;
  }
}
function requestReset() {
  if (!el('seed').reportValidity()) return;
  const id = ++revision;
  initialization?.abort();
  initialization = new AbortController();
  const { signal } = initialization;
  const config = {
    count: Number(el('count').value), seed: number('seed'), preset: el('preset').value,
    distribution: el('distribution').value, gravity: number('gravity')
  };
  el('play').disabled = true;
  el('step').disabled = true;
  el('notice').hidden = true;
  status('Initializing', 'pending');
  el('body-meter').textContent = '—';
  el('gravity-mode').textContent = 'Preparing…';
  el('formation').textContent = el('preset').selectedOptions[0].text;
  resets = resets.then(async () => {
    if (id !== revision) return;
    await inFlight;
    simulation?.dispose();
    simulation = undefined;
    view?.clearBodies();
    await ensureDevice();
    if (id !== revision) return;
    const bodies = await createBodiesAsync(config, { signal });
    if (id !== revision) return;
    const fresh = await createSimulation(bodies, { device });
    if (id !== revision) { fresh.dispose(); return; }
    simulation = fresh;
    await view.reset(bodies);
    if (id !== revision) return;
    steps = 0; simulatedTime = 0; latency = 0;
    el('gravity-mode').textContent = fresh.gravityMode === 'tree' ? 'Barnes–Hut tree' : 'Direct pairs';
    meters(true);
    view.recenter();
    playback();
  }).catch(error => {
    if (id === revision) {
      if (!device) el('engine').textContent = 'Engine offline';
      reportError(error);
    }
  });
}
function advance() {
  if (!simulation || inFlight || el('play').disabled) return;
  const id = revision;
  const parameters = {
    dt: number('dt'), gravity: number('gravity'), softening: number('softening'),
    collisions: el('collisions').checked
  };
  const started = performance.now();
  lastStart = started;
  el('step').disabled = true;
  inFlight = (async () => {
    const buffer = await simulation.stepResident(parameters);
    if (id !== revision) return;
    view.update(buffer);
    // Bound outstanding work even on adapters that submit faster than they execute.
    await device.queue.onSubmittedWorkDone();
    if (id !== revision) return;
    simulatedTime += parameters.dt;
    steps++;
    const elapsed = performance.now() - started;
    latency = steps === 1 ? elapsed : latency * 0.85 + elapsed * 0.15;
    meters();
  })().catch(error => {
    if (id === revision) reportError(error);
  }).finally(() => {
    inFlight = undefined;
    if (id === revision) el('step').disabled = !simulation || running;
  });
}
function setRange(id, digits) {
  const input = el(id);
  const update = () => {
    el(id + '-value').textContent = number(id).toFixed(digits);
    input.style.setProperty('--fill', 100 * (number(id) - Number(input.min)) / (Number(input.max) - Number(input.min)) + '%');
  };
  input.addEventListener('input', update);
  update();
}
setRange('gravity', 2);
setRange('dt', 3);
setRange('softening', 2);
for (const id of ['preset', 'count', 'seed', 'distribution']) el(id).addEventListener('change', requestReset);
el('restart').addEventListener('click', () => { if (!simulation) running = true; requestReset(); });
el('play').addEventListener('click', () => { running = !running; playback(); if (simulation) meters(true); });
el('step').addEventListener('click', () => advance());
el('grid').addEventListener('click', () => {
  if (!view) return;
  view.grid.visible = !view.grid.visible;
  el('grid').setAttribute('aria-pressed', String(view.grid.visible));
});
el('recenter').addEventListener('click', () => view?.recenter());
function toggleMenu(open) {
  el('menu').classList.toggle('open', open);
  el('menu-toggle').setAttribute('aria-expanded', String(open));
}
el('menu-toggle').addEventListener('click', () => toggleMenu(!el('menu').classList.contains('open')));
el('scene').addEventListener('pointerdown', () => toggleMenu(false));
window.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

function frame(now) {
  if (view && simulation) {
    // Allow smooth 60 Hz physics cadence without 60Hz-vsync beat stutter.
    if (running && now - lastStart >= 1000 / 60 - 2) advance();
    if (!framePending) {
      const activeDevice = device;
      try {
        view.render();
        // A software adapter can draw much more slowly than requestAnimationFrame.
        // Allow at most one unfinished render before submitting the next frame.
        framePending = true;
        activeDevice.queue.onSubmittedWorkDone().catch(error => {
          if (device === activeDevice) reportError(error);
        }).finally(() => { framePending = false; });
      } catch (error) {
        revision++;
        reportError(error);
      }
    }
  }
  requestAnimationFrame(frame);
}
requestReset();
requestAnimationFrame(frame);
