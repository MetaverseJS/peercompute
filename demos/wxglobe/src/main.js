import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';
import {
  ETOPO2022_MAX_LEVEL,
  createEtopo2022TerrainProvider
} from './terrain/etopo2022.js';
import {
  TERRARIUM_MAX_LEVEL,
  WEB_MERCATOR_MAX_LATITUDE,
  createTerrariumTerrainProvider
} from './terrain/terrarium.js';
import { createTopoMaterial, updateTopoMaterial } from './terrain/topoMaterial.js';

const elements = {
  console: document.querySelector('#console'),
  consoleBody: document.querySelector('#console-body'),
  toggleConsole: document.querySelector('#toggle-console'),
  providerStatus: document.querySelector('#provider-status'),
  tileCount: document.querySelector('#tile-count'),
  heightRange: document.querySelector('#height-range'),
  bathymetryStatus: document.querySelector('#bathymetry-status'),
  cursorPosition: document.querySelector('#cursor-position'),
  terrainSource: document.querySelector('#terrain-source'),
  terrainSourceMode: document.querySelector('#terrain-source-mode'),
  contourSpacing: document.querySelector('#contour-spacing'),
  contourSpacingValue: document.querySelector('#contour-spacing-value'),
  lineWidth: document.querySelector('#line-width'),
  lineWidthValue: document.querySelector('#line-width-value'),
  terrainExaggeration: document.querySelector('#terrain-exaggeration'),
  terrainExaggerationValue: document.querySelector('#terrain-exaggeration-value')
};

const runtime = {
  ready: false,
  fatalError: null,
  frameCount: 0,
  imageryLayerCount: null,
  materialType: null,
  terrainProviderType: null,
  terrainSource: 'noaa-etopo2022',
  terrainStatus: 'initializing',
  providerGeneration: 0,
  coverage: null,
  terrain: null,
  viewer: null,
  contourSpacing: 500,
  contourWidth: 1.5,
  verticalExaggeration: 1
};

window.__wxglobe = {
  ...runtime,
  getState: () => {
    const viewer = runtime.viewer;
    const provider = viewer?.terrainProvider;
    const providerState = provider?.wxglobe;
    const material = viewer?.scene?.globe?.material;
    return {
      ready: runtime.ready,
      fatalError: runtime.fatalError,
      frameCount: runtime.frameCount,
      imageryLayerCount: viewer?.imageryLayers.length ?? runtime.imageryLayerCount,
      materialType: material?.type ?? runtime.materialType,
      terrainProviderType: providerState?.providerType ?? provider?.constructor?.name ?? runtime.terrainProviderType,
      terrainSource: providerState?.source ?? runtime.terrainSource,
      terrainStatus: runtime.terrainStatus,
      providerGeneration: providerState?.generation ?? runtime.providerGeneration,
      terrain: runtime.terrain ? { ...runtime.terrain } : null,
      tilesLoaded: viewer?.scene?.globe?.tilesLoaded ?? false,
      maximumLevel: providerState?.maxLevel ?? null,
      terminalLodEnforced: providerState
        ? provider.getTileDataAvailable(0, 0, providerState.maxLevel + 1) === false
        : false,
      contourSpacing: runtime.contourSpacing,
      contourWidth: runtime.contourWidth,
      verticalExaggeration: viewer?.scene?.verticalExaggeration ?? runtime.verticalExaggeration,
      coverage: runtime.coverage ? { ...runtime.coverage } : null
    };
  },
  probeTerrainTile: async ({ longitude, latitude, level } = {}) => {
    const provider = runtime.viewer?.terrainProvider;
    if (!provider?.wxglobe) throw new Error('WXGlobe terrain provider is unavailable.');
    const targetLevel = level ?? provider.wxglobe.maxLevel;
    const position = Cesium.Cartographic.fromDegrees(longitude, latitude);
    const tile = provider.tilingScheme.positionToTileXY(position, targetLevel);
    if (!tile) throw new RangeError('Probe position is outside the terrain tiling scheme.');
    const data = await provider.requestTileGeometry(tile.x, tile.y, targetLevel);
    return {
      x: tile.x,
      y: tile.y,
      level: targetLevel,
      childTileMask: data.childTileMask,
      sampleCount: (provider.wxglobe.gridSize ?? provider.wxglobe.tileSize) ** 2,
      generation: provider.wxglobe.generation
    };
  }
};

const terrainSourceMetadata = {
  'noaa-etopo2022': {
    modeLabel: 'POLE-TO-POLE',
    projection: 'EPSG:4326',
    maximumLatitude: 90,
    maximumLevel: ETOPO2022_MAX_LEVEL,
    nativeResolution: '1 arc-minute / ~1.85 km north-south at equator'
  },
  'aws-terrarium': {
    modeLabel: 'DETAIL ±85°',
    projection: 'EPSG:3857',
    maximumLatitude: WEB_MERCATOR_MAX_LATITUDE,
    maximumLevel: TERRARIUM_MAX_LEVEL,
    nativeResolution: 'mixed; ETOPO1 bathymetry'
  }
};

const formatMeters = (value) => {
  if (!Number.isFinite(value)) return '--';
  const sign = value < 0 ? '−' : '+';
  return `${sign}${Math.abs(Math.round(value)).toLocaleString()} m`;
};

const markRuntimeReady = () => {
  if (runtime.ready || runtime.fatalError || runtime.frameCount < 1 || !(runtime.terrain?.loaded > 0)) return;
  runtime.ready = true;
  document.documentElement.dataset.wxglobeReady = 'true';
};

const updateTelemetry = (telemetry, providerGeneration) => {
  if (providerGeneration !== runtime.providerGeneration || telemetry.source !== runtime.terrainSource) return;
  runtime.terrain = { ...telemetry, providerGeneration };
  elements.tileCount.textContent = `${telemetry.loaded} / ${telemetry.requested}`;
  elements.heightRange.textContent = telemetry.minimum === null
    ? 'AWAITING DATA'
    : `${formatMeters(telemetry.minimum)} … ${formatMeters(telemetry.maximum)}`;
  elements.bathymetryStatus.textContent = telemetry.negativeSamples > 0 ? 'NEGATIVE RELIEF LIVE' : 'PENDING';
  const sourceLabel = telemetry.source === 'noaa-etopo2022' ? 'WHOLE EARTH' : 'AWS DETAIL';
  if (telemetry.rootTerminalFailures > 0) {
    runtime.terrainStatus = 'fatal';
    runtime.fatalError = `Root terrain tile failed: ${telemetry.lastTerminalError || telemetry.lastError || 'unknown source error'}`;
  } else if (telemetry.terminalFailures > 0) {
    runtime.terrainStatus = 'degraded';
  } else if (telemetry.activeRetries > 0) {
    runtime.terrainStatus = 'retrying';
  } else if (telemetry.loaded > 0) {
    runtime.terrainStatus = 'live';
  } else {
    runtime.terrainStatus = 'connecting';
  }
  elements.providerStatus.textContent = `${sourceLabel}: ${runtime.terrainStatus.toUpperCase()}`;
  elements.providerStatus.setAttribute('role', runtime.terrainStatus === 'fatal' ? 'alert' : 'status');
  elements.providerStatus.setAttribute('aria-live', runtime.terrainStatus === 'fatal' ? 'assertive' : 'polite');
  elements.console.classList.toggle('console--error', telemetry.terminalFailures > 0);
};

const cameraPresets = {
  world: { longitude: -20, latitude: 16, height: 21_000_000, heading: 0, pitch: -90 },
  himalaya: { longitude: 86.8, latitude: 28.2, height: 1_350_000, heading: 345, pitch: -58 },
  mariana: { longitude: 145.4, latitude: 11.2, height: 1_500_000, heading: 15, pitch: -64 },
  alaska: { longitude: -149.5, latitude: 61.4, height: 1_850_000, heading: 20, pitch: -62 }
};

const cameraView = (preset) => ({
  destination: Cesium.Cartesian3.fromDegrees(preset.longitude, preset.latitude, preset.height),
  orientation: {
    heading: Cesium.Math.toRadians(preset.heading),
    pitch: Cesium.Math.toRadians(preset.pitch),
    roll: 0
  }
});

function configureControls(viewer, topoMaterial, setTerrainSource) {
  elements.toggleConsole.addEventListener('click', () => {
    const collapsed = elements.console.classList.toggle('console--collapsed');
    elements.toggleConsole.textContent = collapsed ? 'SHOW' : 'HIDE';
    elements.toggleConsole.setAttribute('aria-expanded', String(!collapsed));
    elements.consoleBody.inert = collapsed;
  });

  elements.contourSpacing.addEventListener('change', () => {
    const contourSpacing = Number(elements.contourSpacing.value);
    updateTopoMaterial(topoMaterial, { contourSpacing });
    runtime.contourSpacing = contourSpacing;
    elements.contourSpacingValue.textContent = `${contourSpacing.toLocaleString()} M`;
    viewer.scene.requestRender();
  });

  elements.terrainSource.addEventListener('change', () => {
    setTerrainSource(elements.terrainSource.value);
  });

  elements.lineWidth.addEventListener('input', () => {
    const contourWidth = Number(elements.lineWidth.value);
    updateTopoMaterial(topoMaterial, { contourWidth });
    runtime.contourWidth = contourWidth;
    elements.lineWidthValue.textContent = `${contourWidth.toFixed(2).replace(/0$/, '')} PX`;
    viewer.scene.requestRender();
  });

  elements.terrainExaggeration.addEventListener('input', () => {
    const verticalExaggeration = Number(elements.terrainExaggeration.value);
    viewer.scene.verticalExaggeration = verticalExaggeration;
    runtime.verticalExaggeration = verticalExaggeration;
    elements.terrainExaggerationValue.textContent = `${verticalExaggeration.toFixed(1)}×`;
    viewer.scene.requestRender();
  });

  document.querySelectorAll('[data-camera]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = cameraPresets[button.dataset.camera];
      if (!preset) return;
      viewer.camera.flyTo({ ...cameraView(preset), duration: 1.4 });
    });
  });

  const pointerHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  pointerHandler.setInputAction((movement) => {
    const ray = viewer.camera.getPickRay(movement.endPosition);
    const cartesian = ray ? viewer.scene.globe.pick(ray, viewer.scene) : undefined;
    if (!cartesian) {
      elements.cursorPosition.textContent = 'OUTSIDE TERRAIN';
      return;
    }
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    elements.cursorPosition.textContent = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}° · ${formatMeters(cartographic.height)}`;
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  const openAwsAttribution = (event) => {
    const anchor = event?.target?.closest?.('a[href="#aws-terrain-attribution"]');
    if (!anchor && window.location.hash !== '#aws-terrain-attribution') return;
    const attribution = document.querySelector('#aws-terrain-attribution');
    if (attribution) attribution.open = true;
  };
  document.addEventListener('click', openAwsAttribution);
  window.addEventListener('hashchange', openAwsAttribution);
  openAwsAttribution();

  return () => {
    pointerHandler.destroy();
    document.removeEventListener('click', openAwsAttribution);
    window.removeEventListener('hashchange', openAwsAttribution);
  };
}

function createTerrainProvider(source, providerGeneration) {
  const options = { onTelemetry: (telemetry) => updateTelemetry(telemetry, providerGeneration) };
  let provider;
  if (source === 'noaa-etopo2022') provider = createEtopo2022TerrainProvider(Cesium, options);
  else if (source === 'aws-terrarium') provider = createTerrariumTerrainProvider(Cesium, options);
  else throw new RangeError(`Unknown terrain source: ${source}`);
  provider.wxglobe.generation = providerGeneration;
  return provider;
}

function setRuntimeTerrainSource(source, provider, providerGeneration) {
  const metadata = terrainSourceMetadata[source];
  runtime.terrainSource = source;
  runtime.coverage = metadata;
  runtime.terrain = null;
  runtime.terrainStatus = 'connecting';
  runtime.providerGeneration = providerGeneration;
  runtime.terrainProviderType = provider.wxglobe.providerType;
  runtime.fatalError = null;
  runtime.ready = false;
  document.documentElement.dataset.wxglobeReady = 'false';
  elements.terrainSource.value = source;
  elements.terrainSourceMode.textContent = metadata.modeLabel;
  elements.providerStatus.textContent = `${source === 'noaa-etopo2022' ? 'WHOLE EARTH' : 'AWS DETAIL'}: CONNECTING`;
  elements.tileCount.textContent = '0 / 0';
  elements.heightRange.textContent = 'AWAITING DATA';
  elements.bathymetryStatus.textContent = 'PENDING';
  elements.console.classList.remove('console--error');
  elements.providerStatus.setAttribute('role', 'status');
  elements.providerStatus.setAttribute('aria-live', 'polite');
}

function configureScene(viewer, topoMaterial) {
  const { scene } = viewer;
  scene.backgroundColor = Cesium.Color.BLACK;
  scene.globe.baseColor = Cesium.Color.BLACK;
  scene.globe.material = topoMaterial;
  scene.globe.depthTestAgainstTerrain = true;
  scene.globe.showGroundAtmosphere = false;
  scene.globe.enableLighting = false;
  scene.globe.maximumScreenSpaceError = 2;
  scene.fog.enabled = false;
  scene.highDynamicRange = false;
  scene.skyAtmosphere.show = false;
  scene.skyBox.show = false;
  scene.sun.show = false;
  scene.moon.show = false;
  scene.verticalExaggeration = 1;
  viewer.imageryLayers.removeAll();
  viewer.camera.setView(cameraView(cameraPresets.world));
}

async function start() {
  const initialGeneration = runtime.providerGeneration + 1;
  runtime.providerGeneration = initialGeneration;
  const terrainProvider = createTerrainProvider('noaa-etopo2022', initialGeneration);
  const topoMaterial = createTopoMaterial(Cesium);

  const viewer = new Cesium.Viewer('viewer', {
    terrainProvider,
    baseLayer: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    vrButton: false,
    selectionIndicator: false,
    infoBox: false,
    scene3DOnly: true,
    requestRenderMode: false
  });

  runtime.viewer = viewer;
  runtime.imageryLayerCount = viewer.imageryLayers.length;
  runtime.materialType = topoMaterial.type;
  setRuntimeTerrainSource('noaa-etopo2022', terrainProvider, initialGeneration);
  window.__wxglobe.viewer = viewer;
  viewer.scene.canvas.setAttribute('role', 'application');
  viewer.scene.canvas.setAttribute('aria-label', 'Interactive whole-Earth terrain globe. Use the controls panel for camera presets.');
  viewer.scene.canvas.tabIndex = 0;

  configureScene(viewer, topoMaterial);
  const setTerrainSource = (source) => {
    const previousProvider = viewer.terrainProvider;
    const providerGeneration = runtime.providerGeneration + 1;
    const provider = createTerrainProvider(source, providerGeneration);
    setRuntimeTerrainSource(source, provider, providerGeneration);
    viewer.terrainProvider = provider;
    previousProvider?.wxglobe?.abort?.();
    viewer.scene.requestRender();
  };
  const destroyControls = configureControls(viewer, topoMaterial, setTerrainSource);

  const removePostRender = viewer.scene.postRender.addEventListener(() => {
    runtime.frameCount += 1;
    markRuntimeReady();
  });

  window.addEventListener('pagehide', () => {
    removePostRender();
    destroyControls();
    viewer.terrainProvider?.wxglobe?.abort?.();
    if (!viewer.isDestroyed()) viewer.destroy();
  }, { once: true });
}

start().catch((error) => {
  runtime.fatalError = error instanceof Error ? error.message : String(error);
  runtime.terrainStatus = 'fatal';
  elements.providerStatus.textContent = 'TERRAIN: FATAL';
  elements.providerStatus.setAttribute('role', 'alert');
  elements.providerStatus.setAttribute('aria-live', 'assertive');
  elements.console.classList.add('console--error');
  console.error('[wxglobe] startup failed', error);
});
