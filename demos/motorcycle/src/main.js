import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

import {
  GeodataClient,
  configuredGeodataBaseUrl,
} from '@peercompute/geo-core';
import { ViewRig } from '../../shared/xr/index.js';
import { createMotorcycleInputRuntime } from './input/runtimeInput.js';
import { createRoadvectorOverviewRuntime } from './overview/overviewRuntime.js';
import {
  createMotorcycleWorldRenderer,
  disposeThreeObject,
} from './render/index.js';
import { createMotorcycleGameRuntime } from './runtime/gameRuntime.js';
import { loadMotorcycleLocation } from './runtime/locationLoader.js';
import { createMotorcycleXrPanel } from './runtime/xrPanel.js';
import {
  ROADVECTOR_CAMERA_CONFIG,
  ROADVECTOR_SCALE_DISCLOSURE,
} from './view/cameraConfig.js';
import './style.css';

const FALLBACK_LOCATION = Object.freeze({
  longitude: -149.9003,
  latitude: 61.2181,
  label: 'ANCHORAGE FALLBACK',
});
const MAXIMUM_TRAFFIC_VEHICLES = 14;
const MAXIMUM_PHYSICAL_TRAFFIC_VEHICLES = MAXIMUM_TRAFFIC_VEHICLES;
const MAXIMUM_FRAME_DELTA_SECONDS = 0.1;
const FIRST_CAMERA_OFFSET = ROADVECTOR_CAMERA_CONFIG.firstOffsetMeters;
const THIRD_CAMERA_OFFSET = ROADVECTOR_CAMERA_CONFIG.thirdOffsetMeters;

const elements = Object.freeze({
  overviewViewport: document.querySelector('#overview-viewport'),
  viewport: document.querySelector('#viewport'),
  console: document.querySelector('#console'),
  toggleConsole: document.querySelector('#toggle-console'),
  platformStatus: document.querySelector('#platform-status'),
  osmStatus: document.querySelector('#osm-status'),
  terrainStatus: document.querySelector('#terrain-status'),
  overviewStatus: document.querySelector('#overview-status'),
  playerStatus: document.querySelector('#player-status'),
  physicsStatus: document.querySelector('#physics-status'),
  trafficStatus: document.querySelector('#traffic-status'),
  raceStatus: document.querySelector('#race-status'),
  speed: document.querySelector('#speed'),
  powertrain: document.querySelector('#powertrain'),
  cameraStatus: document.querySelector('#camera-status'),
  xrStatus: document.querySelector('#xr-status'),
  locate: document.querySelector('#locate'),
  fallback: document.querySelector('#fallback'),
  latitude: document.querySelector('#latitude'),
  longitude: document.querySelector('#longitude'),
  goLocation: document.querySelector('#go-location'),
  regionStatus: document.querySelector('#region-status'),
  cameraToggle: document.querySelector('#camera-toggle'),
  worldMode: document.querySelector('#world-mode'),
  resetBike: document.querySelector('#reset-bike'),
  enterXr: document.querySelector('#enter-xr'),
  leanAssist: document.querySelector('#lean-assist'),
  provenance: document.querySelector('#provenance'),
  touchSteer: document.querySelector('#touch-steer'),
  touchThrottle: document.querySelector('#touch-throttle'),
  touchShiftDown: document.querySelector('#touch-shift-down'),
  touchRearBrake: document.querySelector('#touch-rear-brake'),
  touchFrontBrake: document.querySelector('#touch-front-brake'),
  touchShiftUp: document.querySelector('#touch-shift-up'),
  touchCamera: document.querySelector('#touch-camera'),
  touchReset: document.querySelector('#touch-reset'),
  hud: document.querySelector('#hud'),
  error: document.querySelector('#error'),
});

function apiBaseUrl() {
  const query = new URLSearchParams(globalThis.location.search);
  if (query.get('geodata') === 'same-origin') return '';
  return configuredGeodataBaseUrl(import.meta.env);
}

const geodata = new GeodataClient({
  baseUrl: apiBaseUrl(),
  fetchImpl: globalThis.fetch,
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000300);
scene.fog = new THREE.FogExp2(0x000300, ROADVECTOR_CAMERA_CONFIG.fogDensityPerMeter);
scene.add(new THREE.HemisphereLight(0x7aff9a, 0x001105, 1.1));
scene.add(new THREE.DirectionalLight(0xffffff, 0.45));

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.xr.enabled = true;
renderer.domElement.classList.add('roadvector-ride-canvas');
elements.viewport.append(renderer.domElement);

const firstCamera = new THREE.PerspectiveCamera(
  ROADVECTOR_CAMERA_CONFIG.firstPersonFovDegrees,
  globalThis.innerWidth / globalThis.innerHeight,
  ROADVECTOR_CAMERA_CONFIG.nearMeters,
  ROADVECTOR_CAMERA_CONFIG.farMeters,
);
const thirdCamera = new THREE.PerspectiveCamera(
  ROADVECTOR_CAMERA_CONFIG.thirdPersonFovDegrees,
  globalThis.innerWidth / globalThis.innerHeight,
  ROADVECTOR_CAMERA_CONFIG.nearMeters,
  ROADVECTOR_CAMERA_CONFIG.farMeters,
);
const xrCamera = new THREE.PerspectiveCamera(
  ROADVECTOR_CAMERA_CONFIG.xrFallbackFovDegrees,
  globalThis.innerWidth / globalThis.innerHeight,
  ROADVECTOR_CAMERA_CONFIG.nearMeters,
  ROADVECTOR_CAMERA_CONFIG.farMeters,
);
const xrRoot = new THREE.Group();
xrRoot.name = 'motorcycle-xr-root';
xrRoot.add(xrCamera);
scene.add(xrRoot);
let activeCamera = thirdCamera;

const runtime = {
  ready: false,
  displayMode: 'overview',
  disposed: false,
  fatalError: null,
  frameCount: 0,
  generation: 0,
  abortController: null,
  location: null,
  locationSource: null,
  locationNotice: null,
  load: null,
  game: null,
  worldRenderer: null,
  lastStep: null,
  lastControl: null,
  lastOriginRebaseView: null,
  lastInputResetView: null,
  xrUiCapture: false,
  lastHudAt: 0,
  cleanup: [],
};

const overviewRuntime = createRoadvectorOverviewRuntime({
  Cesium,
  container: elements.overviewViewport,
  fetchImpl: globalThis.fetch,
});

function addListener(target, type, listener, options) {
  target.addEventListener(type, listener, options);
  const cleanup = () => target.removeEventListener(type, listener, options);
  runtime.cleanup.push(cleanup);
  return cleanup;
}

function userMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function setError(error = null) {
  runtime.fatalError = error ? userMessage(error) : null;
  elements.error.textContent = runtime.fatalError ?? '';
  elements.console.classList.toggle('console--error', Boolean(error));
}

function setPlatform(status, message) {
  elements.platformStatus.textContent = `${status.toUpperCase()} // ${message}`;
}

function setDisplayMode(mode) {
  if (!['overview', 'ride'].includes(mode)) throw new RangeError('Display mode must be overview or ride.');
  if (mode === 'ride' && !runtime.ready) return false;
  if (mode === 'overview' && inputRuntime.sessions?.getStatus().presenting) return false;
  if (mode === 'overview') {
    if (globalThis.document?.pointerLockElement) globalThis.document.exitPointerLock?.();
    inputRuntime.clearControls();
  }
  runtime.displayMode = mode;
  overviewRuntime.setMode(mode);
  elements.viewport.hidden = mode === 'overview';
  elements.viewport.inert = mode === 'overview';
  elements.viewport.setAttribute('aria-hidden', String(mode === 'overview'));
  document.documentElement.dataset.roadvectorMode = mode;
  elements.worldMode.textContent = mode === 'overview' ? 'RIDE THIS REGION' : 'GLOBE OVERVIEW';
  elements.worldMode.disabled = mode === 'overview' && !runtime.ready;
  elements.cameraToggle.disabled = mode === 'overview';
  elements.resetBike.disabled = mode === 'overview';
  elements.touchSteer.closest('#touch-controls')?.classList.toggle('touch-controls--hidden', mode === 'overview');
  return true;
}

function setLeanAssist(enabled) {
  const active = Boolean(enabled);
  elements.leanAssist.checked = active;
  if (runtime.game) runtime.game.controller.leanAssistEnabled = active;
}

function formatRaceSeconds(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return '--:--.---';
  const minutes = Math.floor(value / 60);
  return `${minutes}:${(value - minutes * 60).toFixed(3).padStart(6, '0')}`;
}

function raceStatusText(race, course) {
  if (!race || !course) return 'WAITING FOR REAL ROAD COURSE';
  if (race.status === 'finished') {
    return `FINISHED // ${formatRaceSeconds(race.timing.finishTimeSeconds)}`;
  }
  if (race.status === 'ready') {
    return `${course.raceMode === 'single-pass' ? 'SINGLE PASS' : `${race.laps.total} LAPS`} // CROSS START`;
  }
  const expected = race.progress.expectedGateIndex === null
    ? 'FINISH'
    : `${race.progress.expectedGateIndex + 1}/${course.gates.length}`;
  return `LAP ${race.laps.current}/${race.laps.total} // GATE ${expected} // ${formatRaceSeconds(race.timing.currentLapSeconds)}`;
}

function resetBike() {
  if (!runtime.game) return false;
  runtime.game.reset();
  viewRig.resetPose?.({ recenter: true });
  return true;
}

function recenterXrViewer() {
  try {
    const frame = renderer.xr.getFrame?.();
    const referenceSpace = renderer.xr.getReferenceSpace?.();
    const viewerPose = frame?.getViewerPose?.(referenceSpace);
    const inverse = viewerPose?.transform?.inverse;
    if (!inverse || typeof referenceSpace?.getOffsetReferenceSpace !== 'function') return false;
    renderer.xr.setReferenceSpace(referenceSpace.getOffsetReferenceSpace(inverse));
    return true;
  } catch {
    return false;
  }
}

const inputRuntime = createMotorcycleInputRuntime({
  eventTarget: globalThis.window,
  pointerTarget: renderer.domElement,
  rendererXR: renderer.xr,
  xrRoot,
  camera: xrCamera,
  xrSystem: globalThis.navigator?.xr,
  domOverlayRoot: elements.console,
  controllerModelFactory: new XRControllerModelFactory(),
  handModelFactory: new XRHandModelFactory(),
  disposeObject: disposeThreeObject,
  touchControls: [
    { element: elements.touchSteer, action: 'steer', mode: 'axis-x' },
    { element: elements.touchThrottle, action: 'throttle', mode: 'axis-y', invert: true },
    { element: elements.touchShiftDown, action: 'shiftDelta', mode: 'button', value: -1 },
    { element: elements.touchRearBrake, action: 'rearBrake', mode: 'button' },
    { element: elements.touchFrontBrake, action: 'frontBrake', mode: 'button' },
    { element: elements.touchShiftUp, action: 'shiftDelta', mode: 'button', value: 1 },
    { element: elements.touchCamera, action: 'cameraToggle', mode: 'button' },
    { element: elements.touchReset, action: 'reset', mode: 'button' },
  ],
});

const viewRig = new ViewRig({
  firstCamera,
  thirdCamera,
  xrCamera,
  xrAnchor: xrRoot,
  mode: 'third',
  firstOffset: FIRST_CAMERA_OFFSET,
  firstOrientation: [0, 1, 0, 0],
  xrOrientation: [0, 1, 0, 0],
  thirdOffset: THIRD_CAMERA_OFFSET,
  thirdLookOffset: ROADVECTOR_CAMERA_CONFIG.thirdLookOffsetMeters,
  thirdDamping: 7,
  recenter: recenterXrViewer,
  setActiveCamera(camera, mode) {
    activeCamera = camera;
    elements.cameraStatus.textContent = mode === 'first'
      ? 'FIRST PERSON'
      : mode === 'third'
        ? 'THIRD PERSON'
        : 'WEBXR RIDER';
  },
});

const xrPanel = inputRuntime.registry ? createMotorcycleXrPanel({
  THREE,
  scene: xrRoot,
  registry: inputRuntime.registry,
  onCameraToggle: () => viewRig.toggle(),
  onReset: resetBike,
  onLeanAssist: setLeanAssist,
}) : null;

inputRuntime.sessions?.subscribe((event) => {
  const presenting = event.status.presenting;
  viewRig.setXRActive(presenting);
  elements.enterXr.textContent = presenting ? 'EXIT XR' : 'ENTER XR';
  elements.xrStatus.textContent = presenting
    ? `PRESENTING // ${event.status.enabledFeatures.join(', ') || 'BASE'}`
    : 'READY';
});

function publicState() {
  const gameState = runtime.game?.getState() ?? null;
  return {
    ready: runtime.ready,
    disposed: runtime.disposed,
    fatalError: runtime.fatalError,
    frameCount: runtime.frameCount,
    generation: runtime.generation,
    displayMode: runtime.displayMode,
    overview: overviewRuntime.getStatus(),
    scale: {
      ...ROADVECTOR_SCALE_DISCLOSURE,
      camera: {
        firstPersonFovDegrees: ROADVECTOR_CAMERA_CONFIG.firstPersonFovDegrees,
        thirdPersonFovDegrees: ROADVECTOR_CAMERA_CONFIG.thirdPersonFovDegrees,
        thirdOffsetMeters: [...ROADVECTOR_CAMERA_CONFIG.thirdOffsetMeters],
        fogDensityPerMeter: ROADVECTOR_CAMERA_CONFIG.fogDensityPerMeter,
      },
      bike: runtime.game ? {
        worldUnits: runtime.game.rig.worldUnits,
        wheelbaseMeters: runtime.game.rig.wheelbaseMeters,
        wheelOuterDiameterMeters: runtime.game.rig.wheelOuterDiameterMeters,
      } : null,
    },
    location: runtime.location ? { ...runtime.location } : null,
    locationSource: runtime.locationSource,
    locationNotice: runtime.locationNotice,
    bbox: runtime.load ? [...runtime.load.bbox] : null,
    radiusMeters: runtime.load?.radiusMeters ?? null,
    regionAttempts: runtime.load?.attempts?.map((attempt) => ({ ...attempt, bbox: [...attempt.bbox] })) ?? [],
    osmStatus: runtime.load?.sceneData?.status ?? (geodata.configured ? 'unrequested' : 'backend-unconfigured'),
    osmSource: runtime.load ? {
      status: runtime.load.envelope.status,
      fetchedAt: runtime.load.envelope.fetchedAt,
      staleAt: runtime.load.envelope.staleAt,
      cache: structuredClone(runtime.load.envelope.cache),
      provenance: structuredClone(runtime.load.envelope.provenance),
      notes: [...runtime.load.envelope.notes],
    } : null,
    terrain: runtime.load ? {
      source: { ...runtime.load.terrain.source },
      degraded: runtime.load.terrainDegraded,
      error: runtime.load.terrainError ? { ...runtime.load.terrainError } : null,
    } : null,
    scene: runtime.load ? {
      counts: { ...runtime.load.sceneData.counts },
      provenance: { ...runtime.load.sceneData.provenance },
    } : null,
    game: gameState ? {
      frameCount: gameState.frameCount,
      motorcycle: gameState.motorcycle,
      physics: gameState.physics,
      physicsProfile: gameState.physicsProfile,
      traffic: gameState.traffic,
      trafficPhysics: gameState.trafficPhysics,
      race: gameState.race,
      raceCourse: gameState.raceCourse,
      origin: gameState.origin,
      boundary: gameState.boundary,
      pendingInputEdges: gameState.pendingInputEdges,
      syntheticTraffic: gameState.syntheticTraffic,
      liveTraffic: gameState.liveTraffic,
    } : null,
    renderer: runtime.worldRenderer?.getStatus() ?? null,
    input: inputRuntime.getStatus(),
    lastControl: runtime.lastControl ? { ...runtime.lastControl } : null,
    view: {
      ...viewRig.getStatus(),
      lastOriginRebase: runtime.lastOriginRebaseView
        ? structuredClone(runtime.lastOriginRebaseView)
        : null,
      lastInputReset: runtime.lastInputResetView
        ? structuredClone(runtime.lastInputResetView)
        : null,
      cameraPose: {
        position: activeCamera.position.toArray(),
        orientation: activeCamera.quaternion.toArray(),
      },
    },
    xrPanel: xrPanel?.getStatus() ?? null,
    geodataConfigured: geodata.configured,
  };
}

globalThis.__motorcycleDemo = {
  getState: publicState,
  setControlFrame: (control) => inputRuntime.setVirtualControl(control),
  clearControlFrame: () => inputRuntime.clearVirtualControl(),
  reset: resetBike,
  setCamera(mode) {
    if (!['first', 'third'].includes(mode)) throw new RangeError('Camera mode must be first or third.');
    viewRig.setMode(mode);
  },
  toggleCamera: () => viewRig.toggle(),
  setDisplayMode,
  enterRide: () => setDisplayMode('ride'),
  showOverview: () => setDisplayMode('overview'),
  requestPointerLock: (options) => inputRuntime.requestPointerLock(options),
  loadLocation: (location) => loadLocation(location, { source: 'api' }),
  runScenario(name) {
    if (name === 'traffic-impact') {
      if (!runtime.game) throw new Error('Motorcycle world is not ready.');
      const result = runtime.game.runTrafficImpactScenario();
      viewRig.resetPose?.({ recenter: true });
      return result;
    }
    const frames = {
      accelerate: { throttle: 1 },
      brake: { frontBrake: 1, rearBrake: 1 },
      left: { throttle: 0.7, steer: -0.6 },
      right: { throttle: 0.7, steer: 0.6 },
      neutral: {},
    };
    if (!(name in frames)) throw new RangeError(`Unknown scenario ${name}.`);
    inputRuntime.setVirtualControl(frames[name]);
    return frames[name];
  },
  get gameRuntime() { return runtime.game; },
  get renderer() { return renderer; },
  get cesiumViewer() { return overviewRuntime.viewer; },
  get scene() { return scene; },
};

function teardownWorld({ clearLoad = false } = {}) {
  runtime.worldRenderer?.dispose();
  runtime.game?.dispose();
  runtime.worldRenderer = null;
  runtime.game = null;
  runtime.lastStep = null;
  runtime.lastOriginRebaseView = null;
  runtime.lastInputResetView = null;
  runtime.ready = false;
  if (clearLoad) {
    runtime.load = null;
    runtime.location = null;
    runtime.locationSource = null;
    runtime.locationNotice = null;
  }
  document.documentElement.dataset.motorcycleReady = 'false';
}

async function loadLocation(location, { source = 'manual' } = {}) {
  if (inputRuntime.sessions?.getStatus().presenting) {
    throw new Error('Exit immersive XR before changing the RoadVector location.');
  }
  if (!setDisplayMode('overview')) throw new Error('RoadVector could not enter the Cesium overview.');
  void overviewRuntime.setLocation(location, { source }).catch(() => {});
  if (!geodata.configured) {
    throw new Error('The geodata backend is not configured in this build. Start the Earth stack or configure VITE_GEODATA_API_URL.');
  }
  const generation = runtime.generation + 1;
  runtime.generation = generation;
  runtime.abortController?.abort();
  const abortController = new AbortController();
  runtime.abortController = abortController;
  // Remove the prior region before any new asynchronous request begins. A
  // failed or superseded load must never leave stale geometry/provenance under
  // controls that now describe a different physical location.
  teardownWorld({ clearLoad: true });
  setError();
  setPlatform('loading', 'OSM ROADS + NOAA TERRAIN');
  elements.osmStatus.textContent = 'LOADING BOUNDED REGION';
  elements.terrainStatus.textContent = 'LOADING NOAA ETOPO 2022';
  elements.regionStatus.textContent = `REQUESTED ${Number(location.latitude).toFixed(4)}, ${Number(location.longitude).toFixed(4)}`;

  try {
    const loaded = await loadMotorcycleLocation({
      geodata,
      location,
      signal: abortController.signal,
      fetchImpl: globalThis.fetch,
    });
    if (generation !== runtime.generation || abortController.signal.aborted) return null;
    teardownWorld();
    const game = createMotorcycleGameRuntime({
      terrain: loaded.terrain,
      sceneData: loaded.sceneData,
      trafficVehicleCount: MAXIMUM_TRAFFIC_VEHICLES,
      maximumPhysicalTrafficVehicles: MAXIMUM_PHYSICAL_TRAFFIC_VEHICLES,
      controllerOptions: { leanAssist: elements.leanAssist.checked },
    });
    const worldRenderer = createMotorcycleWorldRenderer({
      THREE,
      scene,
      terrain: loaded.terrain,
      sceneData: loaded.sceneData,
      world: game.world,
      rig: game.rig,
      raceCourse: game.raceCourse,
      maximumTrafficVehicles: MAXIMUM_TRAFFIC_VEHICLES,
    });
    const initial = game.getState();
    worldRenderer.update({ alpha: 0, trafficSnapshot: initial.trafficSnapshot });
    runtime.load = loaded;
    runtime.location = loaded.location;
    runtime.locationSource = source;
    runtime.game = game;
    runtime.worldRenderer = worldRenderer;
    runtime.ready = true;
    runtime.frameCount = 0;
    runtime.lastStep = null;
    document.documentElement.dataset.motorcycleReady = 'true';
    elements.worldMode.disabled = false;
    elements.latitude.value = String(loaded.location.latitude);
    elements.longitude.value = String(loaded.location.longitude);
    elements.osmStatus.textContent = `${loaded.sceneData.status.toUpperCase()} // ${loaded.sceneData.counts.sourceRoads} ROADS`;
    elements.terrainStatus.textContent = loaded.terrainDegraded
      ? `DEGRADED PLANE // ${loaded.terrainError?.message ?? 'NOAA UNAVAILABLE'}`
      : `NOAA LIVE // ${loaded.terrain.width}×${loaded.terrain.height}`;
    elements.regionStatus.textContent = `${loaded.radiusMeters} M RADIUS // ${loaded.sceneData.counts.renderedRoadSegments} ROAD SEGMENTS // ${loaded.sceneData.counts.renderedBuildings} BUILDINGS`;
    elements.provenance.textContent = `OSM ${loaded.sceneData.status.toUpperCase()} // FETCHED ${loaded.envelope.fetchedAt ?? 'UNKNOWN'} // ${loaded.sceneData.provenance.attribution}`;
    elements.trafficStatus.textContent = `${initial.traffic.spawnedVehicleCount} SYNTHETIC // ${initial.trafficPhysics.added} PHYSICAL`;
    elements.raceStatus.textContent = raceStatusText(initial.race, initial.raceCourse);
    setPlatform('ready', 'REAL ROADS // PARTICLE BIKE');
    return publicState();
  } catch (error) {
    if (abortController.signal.aborted || generation !== runtime.generation) return null;
    teardownWorld({ clearLoad: true });
    setError(error);
    elements.osmStatus.textContent = `UNAVAILABLE // ${error?.code ?? 'LOAD ERROR'}`;
    elements.terrainStatus.textContent = 'NOT LOADED';
    setPlatform('unavailable', userMessage(error));
    throw error;
  }
}

async function locateUser() {
  if (!globalThis.isSecureContext) throw new Error('Geolocation requires a trusted HTTPS context.');
  if (!globalThis.navigator?.geolocation) throw new Error('Geolocation is unavailable in this browser.');
  const position = await new Promise((resolve, reject) => {
    globalThis.navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12_000,
      maximumAge: 30_000,
    });
  });
  return loadLocation({
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
  }, { source: 'browser-geolocation' });
}

async function locateUserOrFallback() {
  try {
    return await locateUser();
  } catch (error) {
    const reason = userMessage(error);
    const state = await loadLocation(FALLBACK_LOCATION, { source: 'geolocation-denied-fallback' });
    if (state) {
      runtime.locationNotice = `BROWSER GEOLOCATION UNAVAILABLE (${reason}) // USING DISCLOSED ANCHORAGE FALLBACK`;
      elements.regionStatus.textContent = `${elements.regionStatus.textContent} // GEOLOCATION FALLBACK`;
      elements.provenance.textContent = `${elements.provenance.textContent} // LOCATION IS FALLBACK, NOT DEVICE POSITION`;
    }
    return state;
  }
}

function chassisPose(alpha) {
  if (!runtime.game) return null;
  const chassisId = runtime.game.rig.bodyIds.chassis;
  return runtime.game.world.getInterpolatedTransforms(alpha)
    .find((transform) => transform.id === chassisId) ?? null;
}

function updateHud(time) {
  if (time - runtime.lastHudAt < 80) return;
  runtime.lastHudAt = time;
  const overview = overviewRuntime.getStatus();
  const roadStatus = overview.roads.status === 'current'
    ? `${overview.roads.renderedRoads} MAJOR ROADS // ${overview.roads.selectedTiles} Z5 TILES`
    : `${overview.roads.status.toUpperCase()}${overview.roads.error ? ' // BOUNDED LOAD FAILED' : ''}`;
  elements.overviewStatus.textContent = `${overview.relief.status.toUpperCase()} TOPO // ${roadStatus}`;
  elements.playerStatus.textContent = overview.players.status === 'connected'
    ? `${overview.players.remotePlayerCount} LIVE // RED // ${overview.players.publishingLocation ? 'COARSE LOCATION SHARED' : 'LOCATION PRIVATE'}`
    : `${overview.players.status.toUpperCase()} // 0 LIVE PLAYERS`;
  if (runtime.displayMode === 'overview') {
    elements.hud.textContent = `HEMISPHERE ≈${ROADVECTOR_SCALE_DISCLOSURE.hemisphereDiameterKilometers.toLocaleString()} KM // REGIONAL MAJOR ROADS // ${overview.players.remotePlayerCount} LIVE PLAYERS // ENTER LOCAL ${ROADVECTOR_SCALE_DISCLOSURE.localRegionDiameterMeters} M`;
    return;
  }
  if (!runtime.game) return;
  const state = runtime.game.getState();
  const bike = state.motorcycle;
  const speedKph = Math.abs(bike.forwardSpeed) * 3.6;
  const gear = bike.gear === 0 ? 'N' : bike.gear;
  elements.speed.textContent = `${speedKph.toFixed(1)} KM/H`;
  elements.powertrain.textContent = `${gear} // ${Math.round(bike.engineRpm).toLocaleString()} RPM`;
  const overflowCount = Object.entries(state.physics.overflows ?? {})
    .filter(([key]) => key !== 'overflowed')
    .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);
  const droppedMilliseconds = Math.round((state.lastStep?.droppedTime ?? 0) * 1_000);
  elements.physicsStatus.textContent = `${state.physics.contactCount} CONTACTS // ${overflowCount} OVERFLOWS${droppedMilliseconds > 0 ? ` // ${droppedMilliseconds} MS DROP` : ''}`;
  elements.trafficStatus.textContent = `${state.traffic.spawnedVehicleCount} SYNTHETIC // ${state.trafficPhysics.added} PHYSICAL`;
  elements.raceStatus.textContent = raceStatusText(state.race, state.raceCourse);
  const boundary = state.boundary?.active ? ' // BOUNDARY RESET' : '';
  const rebases = state.origin?.rebaseCount ? ` // REBASE ${state.origin.rebaseCount}` : '';
  const race = state.race.status === 'ready'
    ? 'RACE READY'
    : state.race.status === 'finished'
      ? `FINISH ${formatRaceSeconds(state.race.timing.finishTimeSeconds)}`
      : `LAP ${state.race.laps.current}/${state.race.laps.total} · GATE ${(state.race.progress.expectedGateIndex ?? state.raceCourse.gates.length - 1) + 1}/${state.raceCourse.gates.length}`;
  elements.hud.textContent = `${race} // ${speedKph.toFixed(1)} KM/H // GEAR ${gear} // ${Math.round(bike.engineRpm)} RPM // ${viewRig.getStatus().mode.toUpperCase()}${rebases}${boundary}`;
}

let previousTime = null;
renderer.setAnimationLoop((time, xrFrame) => {
  if (runtime.disposed) return;
  const deltaSeconds = previousTime === null
    ? 0
    : Math.min(MAXIMUM_FRAME_DELTA_SECONDS, Math.max(0, (time - previousTime) / 1_000));
  previousTime = time;
  overviewRuntime.update(time);
  const xrUi = runtime.displayMode === 'ride'
    ? (xrPanel?.update() ?? { captureGameplay: false })
    : { captureGameplay: false };
  runtime.xrUiCapture = xrUi.captureGameplay;
  inputRuntime.setUiContextActive(runtime.xrUiCapture);
  const actionFrame = inputRuntime.poll({
    time,
    xrFrame,
    referenceSpace: renderer.xr.getReferenceSpace?.() ?? null,
  });
  const control = actionFrame.control;
  runtime.lastControl = control;
  viewRig.consumeControlFrame(control);

  if (runtime.displayMode === 'ride' && runtime.game && deltaSeconds > 0) {
    const viewModeBeforeStep = viewRig.getStatus().mode;
    const viewFrameObject = viewModeBeforeStep === 'xr' ? xrRoot : activeCamera;
    viewFrameObject.updateMatrixWorld?.(true);
    const viewFrameBeforeStep = viewFrameObject.position.toArray();
    runtime.lastStep = runtime.game.stepFrame(deltaSeconds, control);
    if (runtime.lastStep.resetApplied) viewRig.resetPose?.({ recenter: true });
    if (runtime.lastStep.originRebase) {
      const shift = Array.from(runtime.lastStep.originRebase.shift);
      runtime.worldRenderer.shiftOrigin(shift);
      viewRig.shiftOrigin(shift);
      viewFrameObject.updateMatrixWorld?.(true);
      const viewFrameAfterShift = viewFrameObject.position.toArray();
      const expected = viewFrameBeforeStep.map((value, index) => value - shift[index]);
      runtime.lastOriginRebaseView = Object.freeze({
        sequence: runtime.lastStep.originRebase.sequence,
        shift: Object.freeze(shift),
        mode: viewRig.getStatus().mode,
        coordinateSpace: viewModeBeforeStep === 'xr'
          ? 'xr-anchor-in-world-parent'
          : 'active-camera-in-world-parent',
        viewFrameName: viewFrameObject.name || null,
        cameraBeforeShift: Object.freeze(viewFrameBeforeStep),
        cameraAfterShift: Object.freeze(viewFrameAfterShift),
        expectedCameraAfterShift: Object.freeze(expected),
        shiftErrorMeters: Math.hypot(...viewFrameAfterShift.map((value, index) => value - expected[index])),
      });
    }
    if (runtime.lastStep.boundaryReset) viewRig.resetPose?.({ recenter: true });
    runtime.worldRenderer.update({
      alpha: runtime.lastStep.physicsAlpha,
      trafficSnapshot: runtime.lastStep.trafficSnapshot,
    });
    const pose = chassisPose(runtime.lastStep.physicsAlpha);
    if (pose) {
      viewRig.update({
        position: pose.position,
        orientation: pose.orientation,
        deltaTime: deltaSeconds,
      });
      if (runtime.lastStep.resetApplied) {
        const mode = viewRig.getStatus().mode;
        const viewFrameObject = mode === 'xr' ? xrRoot : activeCamera;
        const offset = mode === 'first'
          ? FIRST_CAMERA_OFFSET
          : mode === 'third'
            ? THIRD_CAMERA_OFFSET
            : [0, 0, 0];
        const expected = new THREE.Vector3(...offset)
          .applyQuaternion(new THREE.Quaternion().fromArray(pose.orientation))
          .add(new THREE.Vector3().fromArray(pose.position));
        viewFrameObject.updateMatrixWorld?.(true);
        runtime.lastInputResetView = Object.freeze({
          frameCount: runtime.frameCount,
          mode,
          coordinateSpace: mode === 'xr'
            ? 'xr-anchor-in-world-parent'
            : 'active-camera-in-world-parent',
          viewFrameName: viewFrameObject.name || null,
          cameraPosition: Object.freeze(viewFrameObject.position.toArray()),
          expectedCameraPosition: Object.freeze(expected.toArray()),
          positionErrorMeters: viewFrameObject.position.distanceTo(expected),
          recentered: true,
        });
      }
    }
    runtime.frameCount += 1;
  }

  updateHud(time);
  if (runtime.displayMode === 'overview') overviewRuntime.render();
  else renderer.render(scene, activeCamera);
});

function resize() {
  const width = globalThis.innerWidth;
  const height = globalThis.innerHeight;
  renderer.setSize(width, height);
  for (const camera of [firstCamera, thirdCamera, xrCamera]) {
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }
  overviewRuntime.resize();
}

addListener(globalThis, 'resize', resize);
addListener(elements.toggleConsole, 'click', () => {
  const collapsed = elements.console.classList.toggle('console--collapsed');
  elements.toggleConsole.textContent = collapsed ? 'SHOW' : 'HIDE';
  elements.toggleConsole.setAttribute('aria-expanded', String(!collapsed));
});
addListener(elements.fallback, 'click', () => loadLocation(FALLBACK_LOCATION, { source: 'anchorage-fallback' }).catch(() => {}));
addListener(elements.locate, 'click', () => locateUserOrFallback().catch(setError));
addListener(elements.goLocation, 'click', () => loadLocation({
  latitude: elements.latitude.value,
  longitude: elements.longitude.value,
}, { source: 'manual' }).catch(() => {}));
addListener(elements.cameraToggle, 'click', () => viewRig.toggle());
addListener(elements.worldMode, 'click', () => {
  setDisplayMode(runtime.displayMode === 'overview' ? 'ride' : 'overview');
});
addListener(elements.resetBike, 'click', resetBike);
addListener(elements.leanAssist, 'change', () => setLeanAssist(elements.leanAssist.checked));
addListener(elements.enterXr, 'click', async () => {
  try {
    if (inputRuntime.sessions?.getStatus().presenting) await inputRuntime.exitXR();
    else {
      if (!setDisplayMode('ride')) throw new Error('Load a local ride region before entering XR.');
      await inputRuntime.enterXR();
    }
  } catch (error) {
    setError(error);
    elements.xrStatus.textContent = `ERROR // ${userMessage(error)}`;
  }
});

async function probeXR() {
  const supported = await inputRuntime.checkXRSupport();
  elements.enterXr.disabled = !supported;
  elements.xrStatus.textContent = supported ? 'READY // IMMERSIVE VR' : 'UNAVAILABLE';
}

async function dispose() {
  if (runtime.disposed) return;
  runtime.disposed = true;
  runtime.abortController?.abort();
  renderer.setAnimationLoop(null);
  for (const cleanup of runtime.cleanup.splice(0)) cleanup();
  xrPanel?.dispose();
  viewRig.dispose();
  await inputRuntime.dispose();
  await overviewRuntime.dispose();
  teardownWorld();
  scene.remove(xrRoot);
  renderer.dispose();
}

addListener(globalThis, 'pagehide', () => { void dispose(); }, { once: true });
globalThis.__motorcycleDemo.dispose = dispose;

probeXR().catch(() => {
  elements.xrStatus.textContent = 'UNAVAILABLE';
});

if (geodata.configured) {
  // RoadVector now opens on the viewer's hemisphere. The browser permission
  // boundary still controls whether a device position is available; denial or
  // an unavailable API falls back to the explicitly labeled Anchorage view.
  locateUserOrFallback().catch(() => {});
} else {
  elements.osmStatus.textContent = 'BACKEND UNCONFIGURED';
  elements.terrainStatus.textContent = 'WAITING FOR REGION';
  elements.regionStatus.textContent = 'START THE GEODATA + MOTORCYCLE STACK';
  setPlatform('unavailable', 'GEODATA BACKEND NOT CONFIGURED');
}

setDisplayMode('overview');
