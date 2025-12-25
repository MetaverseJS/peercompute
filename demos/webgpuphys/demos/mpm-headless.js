import { mpm } from "../src/index.js";
import { ComputeManager } from "@peercompute";
import { getSharedDevice } from "./shared/peercomputeDevice.js";

const statusEl = document.getElementById("status");
const particleCountEl = document.getElementById("particleCount");
const gridSizeEl = document.getElementById("gridSize");
const massEl = document.getElementById("mass");
const massDeltaEl = document.getElementById("massDelta");
const momentumEl = document.getElementById("momentum");
const momentumDeltaEl = document.getElementById("momentumDelta");
const checksEl = document.getElementById("checks");
const toggleBtn = document.getElementById("toggleBtn");
const resetBtn = document.getElementById("resetBtn");
const errorEl = document.getElementById("error");

const ELEMENTS = [
  "Hydrogen", "Oxygen", "Sodium", "Potassium", "Magnesium",
  "Aluminum", "Silicon", "Calcium", "Titanium", "Iron", "Lead"
];

const COMPUTE_MODULE_URL = new URL("./shared/mpmComputeTasks.js", import.meta.url).href;

let sim = null;
let running = true;
let lastCheck = 0;
let checksPerSecond = 0;
let pendingDiag = false;
let baseline = null;
const MASS_TOL = 1e-2;
const MOM_TOL = 1e-2;
const PHYSICS_DT = 0.005;

const BASE_SPACING = [0.8, 0.8, 1.0, 1.1, 0.95, 1.0, 0.95, 1.1, 1.0, 1.0, 1.0];
const EXPANSION_COEFF = [2e-4, 2e-4, 3e-4, 3e-4, 2.5e-4, 2e-4, 1.5e-4, 2.5e-4, 1.8e-4, 1.7e-4, 1.6e-4];
const BASE_JITTER = [0.05, 0.05, 0.08, 0.1, 0.07, 0.05, 0.05, 0.08, 0.06, 0.05, 0.05];

function deriveSpawnParams(elementId, temperature, ambientPressure) {
  const idx = Math.max(0, Math.min(elementId, BASE_SPACING.length - 1));
  const base = BASE_SPACING[idx];
  const alpha = EXPANSION_COEFF[idx];
  const jitterBase = BASE_JITTER[idx];
  const deltaT = temperature - 300.0;
  let spacing = base * (1.0 + alpha * deltaT);
  const pressureScale = 1.0 / Math.max(0.2, 1.0 + 0.1 * (ambientPressure - 1.0));
  spacing *= pressureScale;
  spacing = Math.min(Math.max(spacing, 0.4), 2.5);
  let jitter = jitterBase + Math.abs(deltaT) * 1e-4 + Math.max(0, ambientPressure - 1.0) * 0.02;
  jitter = Math.min(Math.max(jitter, 0.0), 0.6);
  return { spacing, jitter };
}
const constants = {
  stiffness: 2.5,
  restDensity: 4.0,
  dynamicViscosity: 0.08,
  dt: PHYSICS_DT,
  fixedPointScale: 1e5
};

function setStatus(text) {
  statusEl.textContent = text;
}

function setError(err) {
  console.error(err);
  errorEl.textContent = err?.stack || String(err);
  setStatus("error");
  running = false;
  toggleBtn.disabled = true;
}

function applyDiagnostics({ mass, momentum }) {
  checksPerSecond = checksPerSecond * 0.7 + 0.3 * 2;
  massEl.textContent = mass.toFixed(4);
  momentumEl.textContent = momentum.map((v) => v.toFixed(4)).join(", ");
  if (!baseline) {
    baseline = { mass, momentum };
  }
  const massDelta = baseline ? mass - baseline.mass : 0;
  const momDelta = baseline
    ? momentum.map((v, i) => v - baseline.momentum[i])
    : [0, 0, 0];
  massDeltaEl.textContent = massDelta.toExponential(3);
  momentumDeltaEl.textContent = momDelta.map((v) => v.toExponential(3)).join(", ");
  const momMag = Math.hypot(momDelta[0], momDelta[1], momDelta[2]);
  if (Math.abs(massDelta) > MASS_TOL || momMag > MOM_TOL) {
    statusEl.textContent = `drift detected (Δm=${massDelta.toExponential(2)}, |Δp|=${momMag.toExponential(2)})`;
  } else if (running) {
    statusEl.textContent = "running";
  }
  checksEl.textContent = checksPerSecond.toFixed(1);
}

toggleBtn.addEventListener("click", () => {
  running = !running;
  toggleBtn.textContent = running ? "Pause" : "Resume";
  setStatus(running ? "running" : "paused");
});

resetBtn.addEventListener("click", () => {
  baseline = null;
  statusEl.textContent = "baseline reset";
});

async function runIsolatedHeadless({
  particleCount,
  gridSize,
  iterations,
  blockOptions,
  stepsRequested
}) {
  const computeManager = new ComputeManager({ maxWorkers: 1 });
  await computeManager.initialize();
  await computeManager.submitTask({
    module: COMPUTE_MODULE_URL,
    exportName: "initHeadlessSim",
    data: {
      particleCount,
      gridSize,
      iterations,
      blockOptions,
      constants
    }
  });

  let stepsRan = 0;
  let pendingStep = false;
  window.__mpmStarted = false;

  function loop(ts) {
    if (running && !pendingStep) {
      pendingStep = true;
      computeManager.submitTask({
        module: COMPUTE_MODULE_URL,
        exportName: "stepHeadlessSim",
        data: { steps: 1, diagnostics: false }
      })
        .then(() => {
          stepsRan += 1;
          window.__mpmStarted = true;
        })
        .catch(setError)
        .finally(() => { pendingStep = false; });
    }

    if (!pendingDiag && (ts - lastCheck) > 500) {
      pendingDiag = true;
      lastCheck = ts;
      computeManager.submitTask({
        module: COMPUTE_MODULE_URL,
        exportName: "stepHeadlessSim",
        data: { steps: 0, diagnostics: true }
      })
        .then(({ mass, momentum }) => applyDiagnostics({ mass, momentum }))
        .catch(setError)
        .finally(() => { pendingDiag = false; });
    }

    if (stepsRequested > 0 && stepsRan >= stepsRequested) {
      window.__mpmDone = true;
      window.__mpmStepsRan = stepsRan;
      return;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

async function runSharedHeadless({
  device,
  particleCount,
  gridSize,
  iterations,
  blockOptions,
  stepsRequested
}) {
  sim = mpm.createHeadlessMpm({
    device,
    particleCount,
    gridSize,
    iterations,
    blockOptions,
    constants
  });
  window.__mpmStarted = false;

  let stepsRan = 0;
  function loop(ts) {
    if (running && sim) {
      sim.step();
      window.__mpmStarted = true;
      stepsRan += 1;
    }
    if (sim && !pendingDiag && (ts - lastCheck) > 500) {
      pendingDiag = true;
      lastCheck = ts;
      mpm.computeMassMomentum(device, sim.buffers.particleBuffer, particleCount)
        .then(({ mass, momentum }) => applyDiagnostics({ mass, momentum }))
        .catch(setError)
        .finally(() => { pendingDiag = false; });
    }
    if (stepsRequested > 0 && stepsRan >= stepsRequested) {
      window.__mpmDone = true;
      window.__mpmStepsRan = stepsRan;
      return;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

async function setup() {
  try {
    setStatus("initializing WebGPU…");

    const params = new URLSearchParams(window.location.search);
    const computeMode = (params.get("compute") || "isolated").toLowerCase();
    const useIsolated = computeMode !== "shared";

    const particleCount = parseInt(params.get("count") || "1000", 10);
    const gridSize = { x: 32, y: 32, z: 32 };
    const materialName = params.get("material") || "Oxygen";
    const matIndex = Math.max(0, ELEMENTS.indexOf(materialName));
    const tempOverride = params.get("temp");
    const stepsRequested = parseInt(params.get("steps") || "0", 10);

    const sideCount = Math.ceil(Math.cbrt(particleCount));
    const spawn = deriveSpawnParams(matIndex, tempOverride ? parseFloat(tempOverride) : 300.0, constants.ambientPressure || 1.0);
    const blockOptions = {
      start: [2, 2, 2],
      gridSize,
      jitter: spawn.jitter,
      spacing: spawn.spacing,
      materialType: matIndex,
      cubeSideCount: sideCount,
      temperature: tempOverride ? parseFloat(tempOverride) : undefined
    };

    const targetDt = 0.05;
    const iterations = Math.ceil(targetDt / PHYSICS_DT);

    particleCountEl.textContent = particleCount.toString();
    gridSizeEl.textContent = `${gridSize.x}×${gridSize.y}×${gridSize.z}`;
    setStatus(useIsolated ? "initializing isolated worker" : "initializing shared GPU");

    if (useIsolated) {
      await runIsolatedHeadless({
        particleCount,
        gridSize,
        iterations,
        blockOptions,
        stepsRequested
      });
    } else {
      const device = await getSharedDevice();
      if (!device) {
        throw new Error("Shared GPU device unavailable");
      }
      await runSharedHeadless({
        device,
        particleCount,
        gridSize,
        iterations,
        blockOptions,
        stepsRequested
      });
    }

    setStatus("running");
  } catch (err) {
    setError(err);
  }
}

setup();
