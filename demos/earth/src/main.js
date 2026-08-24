import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import {
  createEtopo2022TerrainProvider,
  createTopoOverlayMaterial,
  createTerrariumTerrainProvider,
  ETOPO2022_MAX_LEVEL,
  TERRARIUM_MAX_LEVEL,
  updateTopoMaterial,
  WEB_MERCATOR_MAX_LATITUDE
} from '@peercompute/geo-core';

import { GeodataClient, resolveEarthGeodataBaseUrl } from './api.js';
import { renderLocalOsmRegion } from './layers/localOsm.js';
import { createNowCoastLayer } from './layers/nowcoast.js';
import { loadShortbreadImageryProvider } from './layers/shortbreadImagery.js';
import {
  formatLocalProvenance,
  LOCAL_REGION_RADII_METERS,
  localRegionBbox,
  localScenePresentation,
  localSourceSnapshot,
  requestLocalRegionWithNarrowing
} from './localRegion.js';
import './style.css';

const FALLBACK_LOCATION = Object.freeze({ longitude: -149.9003, latitude: 61.2181, label: 'ANCHORAGE FALLBACK' });

const elements = {
  console: document.querySelector('#console'),
  consoleBody: document.querySelector('#console-body'),
  toggleConsole: document.querySelector('#toggle-console'),
  platformStatus: document.querySelector('#platform-status'),
  terrainStatus: document.querySelector('#terrain-status'),
  osmStatus: document.querySelector('#osm-status'),
  localStatus: document.querySelector('#local-status'),
  localProvenance: document.querySelector('#local-provenance'),
  weatherStatus: document.querySelector('#weather-status'),
  weatherTime: document.querySelector('#weather-time'),
  regionStatus: document.querySelector('#region-status'),
  cursorPosition: document.querySelector('#cursor-position'),
  locate: document.querySelector('#locate'),
  fallback: document.querySelector('#fallback'),
  goLocation: document.querySelector('#go-location'),
  latitude: document.querySelector('#latitude'),
  longitude: document.querySelector('#longitude'),
  terrainSource: document.querySelector('#terrain-source'),
  terrainMode: document.querySelector('#terrain-mode'),
  osmContext: document.querySelector('#osm-context'),
  localScene: document.querySelector('#local-scene'),
  weatherLayer: document.querySelector('#weather-layer'),
  contourSpacing: document.querySelector('#contour-spacing'),
  contourSpacingValue: document.querySelector('#contour-spacing-value'),
  lineWidth: document.querySelector('#line-width'),
  lineWidthValue: document.querySelector('#line-width-value'),
  readout: document.querySelector('#readout')
};

const geodataBaseUrl = resolveEarthGeodataBaseUrl();
const geodata = new GeodataClient({ baseUrl: geodataBaseUrl });

const runtime = {
  ready: false,
  fatalError: null,
  frameCount: 0,
  viewer: null,
  terrainSource: 'noaa-etopo2022',
  terrainStatus: 'initializing',
  terrainGeneration: 0,
  terrain: null,
  osmStatus: 'initializing',
  osmTelemetry: null,
  osmProvider: null,
  osmLayer: null,
  localStatus: geodata.configured ? 'unrequested' : 'backend-unconfigured',
  localEnvelope: null,
  localRender: null,
  localRadiusMeters: LOCAL_REGION_RADII_METERS[0],
  localGeneration: 0,
  localAbortController: null,
  weatherStatus: 'off',
  weather: null,
  weatherGeneration: 0,
  weatherAbortController: null,
  location: null,
  locationSource: null,
  bbox: null,
  contourSpacing: 500,
  contourWidth: 1.5,
  cleanup: []
};

function publicState() {
  const viewer = runtime.viewer;
  return {
    ready: runtime.ready,
    fatalError: runtime.fatalError,
    frameCount: runtime.frameCount,
    terrainSource: runtime.terrainSource,
    terrainStatus: runtime.terrainStatus,
    terrainGeneration: runtime.terrainGeneration,
    terrain: runtime.terrain ? { ...runtime.terrain } : null,
    terrainProviderType: viewer?.terrainProvider?.wxglobe?.providerType ?? null,
    osmStatus: runtime.osmStatus,
    osmTelemetry: runtime.osmTelemetry ? { ...runtime.osmTelemetry } : null,
    osmVisible: Boolean(runtime.osmLayer?.show),
    localStatus: runtime.localStatus,
    localCounts: runtime.localRender ? {
      sourceRoads: runtime.localRender.sourceRoads,
      sourceBuildings: runtime.localRender.sourceBuildings,
      renderedRoads: runtime.localRender.renderedRoads,
      renderedBuildings: runtime.localRender.renderedBuildings,
      displayOmitted: runtime.localRender.displayOmitted
    } : null,
    localVisible: Boolean(runtime.localRender?.dataSource?.show),
    localRadiusMeters: runtime.localRadiusMeters,
    localSource: localSourceSnapshot(runtime.localEnvelope),
    weatherStatus: runtime.weatherStatus,
    weather: runtime.weather ? {
      id: runtime.weather.id,
      time: runtime.weather.time,
      freshness: { ...runtime.weather.freshness }
    } : null,
    location: runtime.location ? { ...runtime.location } : null,
    locationSource: runtime.locationSource,
    bbox: runtime.bbox ? [...runtime.bbox] : null,
    geodataConfigured: geodata.configured,
    geodataTransport: !geodata.configured ? 'unconfigured' : geodataBaseUrl === '' ? 'same-origin' : 'external-origin',
    imageryLayerCount: viewer?.imageryLayers.length ?? 0,
    contourSpacing: runtime.contourSpacing,
    contourWidth: runtime.contourWidth,
    tilesLoaded: viewer?.scene?.globe?.tilesLoaded ?? false
  };
}

window.__earthDemo = {
  getState: publicState,
  setLocation: (location) => applyLocation(location, { source: 'api', fly: true }),
  reloadLocalRegion: () => loadLocalRegion(),
  setOsmVisible: (visible) => setOsmVisibility(Boolean(visible)),
  setWeather: (id) => setWeatherLayer(id),
  get viewer() { return runtime.viewer; }
};

const terrainMetadata = Object.freeze({
  'noaa-etopo2022': Object.freeze({ mode: 'POLE-TO-POLE', maxLevel: ETOPO2022_MAX_LEVEL, maximumLatitude: 90 }),
  'aws-terrarium': Object.freeze({ mode: 'DETAIL ±85°', maxLevel: TERRARIUM_MAX_LEVEL, maximumLatitude: WEB_MERCATOR_MAX_LATITUDE })
});

function updateReadout() {
  const activeSources = [runtime.terrainStatus, runtime.osmStatus, runtime.localStatus, runtime.weatherStatus]
    .filter((status) => ['live', 'local-live', 'loaded'].includes(status)).length;
  elements.readout.textContent = `FRAME ${runtime.frameCount.toLocaleString()} // SOURCES ${activeSources} // ${runtime.locationSource ?? 'WORLD'}`;
}

function updateReady() {
  if (runtime.ready || runtime.fatalError) return;
  const terrainReady = runtime.frameCount > 0 && (runtime.terrain?.loaded ?? 0) > 0;
  const osmSettled = ['unavailable', 'off'].includes(runtime.osmStatus)
    || (runtime.osmTelemetry?.loaded ?? 0) > 0;
  if (!terrainReady || !osmSettled) return;
  runtime.ready = true;
  document.documentElement.dataset.earthReady = 'true';
  elements.platformStatus.textContent = 'PLATFORM: READY // REAL SOURCES QUALIFIED';
}

function updateTerrainTelemetry(telemetry, generation) {
  if (generation !== runtime.terrainGeneration || telemetry.source !== runtime.terrainSource) return;
  runtime.terrain = { ...telemetry };
  if (telemetry.rootTerminalFailures > 0) {
    runtime.terrainStatus = 'fatal';
    runtime.fatalError = telemetry.lastTerminalError ?? telemetry.lastError ?? 'Terrain root failed.';
  } else if (telemetry.terminalFailures > 0) runtime.terrainStatus = 'degraded';
  else if (telemetry.activeRetries > 0) runtime.terrainStatus = 'retrying';
  else if (telemetry.loaded > 0) runtime.terrainStatus = 'live';
  else runtime.terrainStatus = 'connecting';
  elements.terrainStatus.textContent = `${runtime.terrainSource === 'noaa-etopo2022' ? 'NOAA' : 'AWS'} ${runtime.terrainStatus.toUpperCase()} // ${telemetry.loaded}/${telemetry.requested}`;
  elements.console.classList.toggle('console--error', runtime.terrainStatus === 'fatal');
  updateReady();
}

function createTerrainProvider(source, generation) {
  const options = { onTelemetry: (telemetry) => updateTerrainTelemetry(telemetry, generation) };
  const provider = source === 'noaa-etopo2022'
    ? createEtopo2022TerrainProvider(Cesium, options)
    : createTerrariumTerrainProvider(Cesium, options);
  provider.wxglobe.generation = generation;
  return provider;
}

function setTerrainSource(source) {
  if (!terrainMetadata[source]) throw new RangeError(`Unknown terrain source ${source}.`);
  const viewer = runtime.viewer;
  const generation = runtime.terrainGeneration + 1;
  const previous = viewer.terrainProvider;
  const provider = createTerrainProvider(source, generation);
  runtime.terrainGeneration = generation;
  runtime.terrainSource = source;
  runtime.terrainStatus = 'connecting';
  runtime.terrain = null;
  runtime.fatalError = null;
  runtime.ready = false;
  document.documentElement.dataset.earthReady = 'false';
  elements.terrainSource.value = source;
  elements.terrainMode.textContent = terrainMetadata[source].mode;
  elements.terrainStatus.textContent = `${source === 'noaa-etopo2022' ? 'NOAA' : 'AWS'} CONNECTING`;
  viewer.terrainProvider = provider;
  previous?.wxglobe?.abort?.();
  viewer.scene.requestRender();
}

function configureScene(viewer, material) {
  viewer.imageryLayers.removeAll();
  const { scene } = viewer;
  scene.backgroundColor = Cesium.Color.BLACK;
  scene.globe.baseColor = Cesium.Color.BLACK;
  scene.globe.material = material;
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
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-20, 16, 21_000_000),
    orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 }
  });
}

async function startShortbread() {
  runtime.osmStatus = 'connecting';
  elements.osmStatus.textContent = 'SHORTBREAD CONNECTING';
  try {
    const provider = await loadShortbreadImageryProvider(Cesium, {
      onTelemetry: (telemetry) => {
        runtime.osmTelemetry = telemetry;
        if (telemetry.renderedCommands > 0) {
          runtime.osmStatus = telemetry.failed > 0 ? 'degraded' : 'live';
        } else if (telemetry.loaded > 0) {
          // Shortbread's streets layer begins at z5. A globe-scale view can
          // therefore load valid empty low-zoom tiles. That is a settled live
          // source state, not an endless startup failure; disclose that users
          // must zoom for road features instead of inventing geometry.
          runtime.osmStatus = telemetry.failed > 0 ? 'degraded' : 'live';
        }
        elements.osmStatus.textContent = telemetry.renderedCommands > 0
          ? `SHORTBREAD ${runtime.osmStatus.toUpperCase()} // ${telemetry.loaded}/${telemetry.requested}`
          : `SHORTBREAD ${runtime.osmStatus.toUpperCase()} // ${telemetry.loaded}/${telemetry.requested} // ZOOM FOR ROADS`;
        updateReady();
      }
    });
    if (!runtime.viewer || runtime.viewer.isDestroyed()) {
      provider.destroy();
      return;
    }
    runtime.osmProvider = provider;
    runtime.osmLayer = runtime.viewer.imageryLayers.addImageryProvider(provider);
    runtime.osmLayer.show = elements.osmContext.checked;
    if ((runtime.osmTelemetry?.loaded ?? 0) === 0) {
      runtime.osmStatus = 'waiting-tiles';
      elements.osmStatus.textContent = 'SHORTBREAD WAITING FOR FIRST TILE // ODBL';
    }
  } catch (error) {
    runtime.osmStatus = 'unavailable';
    elements.osmStatus.textContent = `UNAVAILABLE // ${error instanceof Error ? error.message : String(error)}`;
  }
  updateReady();
}

function setOsmVisibility(visible) {
  elements.osmContext.checked = visible;
  if (runtime.osmLayer) runtime.osmLayer.show = visible;
  runtime.viewer?.scene?.requestRender();
}

async function loadLocalRegion() {
  runtime.localGeneration += 1;
  const generation = runtime.localGeneration;
  runtime.localAbortController?.abort();
  runtime.localAbortController = new AbortController();
  runtime.localRender?.destroy();
  runtime.localRender = null;
  runtime.localEnvelope = null;
  if (!elements.localScene.checked) {
    runtime.localStatus = 'off';
    elements.localStatus.textContent = 'OFF';
    elements.localProvenance.textContent = formatLocalProvenance(runtime.localEnvelope, { enabled: false });
    return;
  }
  if (!runtime.location || !runtime.bbox) {
    runtime.localStatus = 'awaiting-location';
    elements.localStatus.textContent = 'AWAITING LOCATION';
    elements.localProvenance.textContent = 'LOCAL REGION AWAITING LOCATION';
    return;
  }
  if (!geodata.configured) {
    runtime.localStatus = 'backend-unconfigured';
    elements.localStatus.textContent = 'BACKEND UNCONFIGURED';
    elements.localProvenance.textContent = 'LOCAL REGION BACKEND UNCONFIGURED';
    return;
  }
  runtime.localStatus = 'loading';
  elements.localStatus.textContent = 'LOADING BOUNDED REGION';
  try {
    const result = await requestLocalRegionWithNarrowing({
      geodata,
      location: runtime.location,
      startRadius: runtime.localRadiusMeters,
      signal: runtime.localAbortController.signal,
      onAttempt: ({ bbox, radiusMeters, narrowed }) => {
        if (generation !== runtime.localGeneration) return;
        runtime.localRadiusMeters = radiusMeters;
        runtime.bbox = [...bbox];
        if (narrowed) elements.localStatus.textContent = `DENSE REGION // RETRY ${radiusMeters} M`;
      }
    });
    if (generation !== runtime.localGeneration) return;
    runtime.localRadiusMeters = result.radiusMeters;
    runtime.bbox = [...result.bbox];
    runtime.localEnvelope = result.envelope;
    runtime.localRender = renderLocalOsmRegion(Cesium, runtime.viewer, result.envelope);
    runtime.localRender.dataSource.show = elements.localScene.checked;
    const presentation = localScenePresentation({
      enabled: elements.localScene.checked,
      envelope: runtime.localEnvelope,
      render: runtime.localRender
    });
    runtime.localStatus = presentation.status;
    elements.localStatus.textContent = presentation.statusText;
    elements.localProvenance.textContent = presentation.provenanceText;
    runtime.viewer.scene.requestRender();
  } catch (error) {
    if (error?.name === 'AbortError' || generation !== runtime.localGeneration) return;
    runtime.localStatus = 'unavailable';
    elements.localStatus.textContent = `UNAVAILABLE // ${error instanceof Error ? error.message : String(error)}`;
    elements.localProvenance.textContent = `LOCAL REGION ERROR // ${error?.code ?? 'UNKNOWN'}`;
  }
}

async function setWeatherLayer(id) {
  runtime.weatherGeneration += 1;
  const generation = runtime.weatherGeneration;
  runtime.weatherAbortController?.abort();
  runtime.weatherAbortController = new AbortController();
  runtime.weather?.destroy();
  runtime.weather = null;
  elements.weatherLayer.value = id;
  if (id === 'off') {
    runtime.weatherStatus = 'off';
    elements.weatherStatus.textContent = 'OFF';
    elements.weatherTime.textContent = 'OFF';
    return;
  }
  runtime.weatherStatus = 'loading';
  elements.weatherStatus.textContent = 'NOAA CAPABILITIES';
  elements.weatherTime.textContent = 'LOADING';
  try {
    const weather = await createNowCoastLayer(Cesium, runtime.viewer.imageryLayers, id, {
      signal: runtime.weatherAbortController.signal
    });
    if (generation !== runtime.weatherGeneration) {
      weather.destroy();
      return;
    }
    runtime.weather = weather;
    runtime.weatherStatus = 'live';
    elements.weatherStatus.textContent = `${weather.descriptor.kind.toUpperCase()} LIVE`;
    elements.weatherTime.textContent = new Date(weather.time).toISOString().slice(11, 16) + 'Z';
    runtime.viewer.scene.requestRender();
  } catch (error) {
    if (error?.name === 'AbortError' || generation !== runtime.weatherGeneration) return;
    runtime.weatherStatus = 'unavailable';
    elements.weatherStatus.textContent = `UNAVAILABLE // ${error instanceof Error ? error.message : String(error)}`;
    elements.weatherTime.textContent = 'NO FRAME';
  }
}

function flyToLocation(location, height = 10_000) {
  runtime.viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, height),
    orientation: {
      heading: Cesium.Math.toRadians(18),
      pitch: Cesium.Math.toRadians(-58),
      roll: 0
    },
    duration: 1.35
  });
}

async function applyLocation(location, { source = 'manual', fly = true } = {}) {
  const longitude = Number(location?.longitude);
  const latitude = Number(location?.latitude);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new RangeError('Location must contain valid WGS84 longitude/latitude.');
  }
  const quantized = {
    longitude: Math.round(longitude * 10_000) / 10_000,
    latitude: Math.round(latitude * 10_000) / 10_000
  };
  runtime.location = quantized;
  runtime.locationSource = source;
  runtime.localRadiusMeters = LOCAL_REGION_RADII_METERS[0];
  runtime.bbox = localRegionBbox(runtime.location, runtime.localRadiusMeters);
  elements.longitude.value = String(quantized.longitude);
  elements.latitude.value = String(quantized.latitude);
  elements.regionStatus.textContent = `${source.toUpperCase()} // ${quantized.latitude.toFixed(4)}, ${quantized.longitude.toFixed(4)}`;
  if (fly) flyToLocation(quantized);
  await loadLocalRegion();
  return publicState();
}

function requestBrowserLocation() {
  if (!globalThis.isSecureContext) {
    elements.regionStatus.textContent = 'HTTPS REQUIRED FOR GEOLOCATION';
    return Promise.reject(new Error('Geolocation requires a secure context.'));
  }
  if (!navigator.geolocation) return Promise.reject(new Error('Geolocation is unavailable.'));
  elements.regionStatus.textContent = 'WAITING FOR LOCATION PERMISSION';
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ longitude: position.coords.longitude, latitude: position.coords.latitude }),
      (error) => reject(new Error(error.message || `Geolocation failed (${error.code}).`)),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 }
    );
  });
}

function configureControls(viewer, topoMaterial) {
  elements.toggleConsole.addEventListener('click', () => {
    const collapsed = elements.console.classList.toggle('console--collapsed');
    elements.toggleConsole.textContent = collapsed ? 'SHOW' : 'HIDE';
    elements.toggleConsole.setAttribute('aria-expanded', String(!collapsed));
    elements.consoleBody.inert = collapsed;
  });
  elements.terrainSource.addEventListener('change', () => setTerrainSource(elements.terrainSource.value));
  elements.osmContext.addEventListener('change', () => setOsmVisibility(elements.osmContext.checked));
  elements.localScene.addEventListener('change', () => {
    if (runtime.localRender) {
      runtime.localRender.dataSource.show = elements.localScene.checked;
      const presentation = localScenePresentation({
        enabled: elements.localScene.checked,
        envelope: runtime.localEnvelope,
        render: runtime.localRender
      });
      runtime.localStatus = presentation.status;
      elements.localStatus.textContent = presentation.statusText;
      elements.localProvenance.textContent = presentation.provenanceText;
      viewer.scene.requestRender();
    } else loadLocalRegion();
  });
  elements.weatherLayer.addEventListener('change', () => setWeatherLayer(elements.weatherLayer.value));
  elements.contourSpacing.addEventListener('input', () => {
    runtime.contourSpacing = Number(elements.contourSpacing.value);
    updateTopoMaterial(topoMaterial, { contourSpacing: runtime.contourSpacing });
    elements.contourSpacingValue.textContent = `${runtime.contourSpacing.toLocaleString()} M`;
    viewer.scene.requestRender();
  });
  elements.lineWidth.addEventListener('input', () => {
    runtime.contourWidth = Number(elements.lineWidth.value);
    updateTopoMaterial(topoMaterial, { contourWidth: runtime.contourWidth });
    elements.lineWidthValue.textContent = `${runtime.contourWidth.toFixed(2).replace(/0$/, '')} PX`;
    viewer.scene.requestRender();
  });
  elements.locate.addEventListener('click', async () => {
    try {
      const location = await requestBrowserLocation();
      await applyLocation(location, { source: 'browser-geolocation', fly: true });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      try {
        await applyLocation(FALLBACK_LOCATION, {
          source: 'geolocation-denied-fallback',
          fly: true
        });
        elements.regionStatus.textContent = `LOCATION DENIED // ANCHORAGE FALLBACK // ${reason}`;
      } catch (fallbackError) {
        elements.regionStatus.textContent = `LOCATION DENIED // FALLBACK FAILED // ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`;
      }
    }
  });
  elements.fallback.addEventListener('click', () => applyLocation(FALLBACK_LOCATION, { source: 'anchorage-fallback', fly: true }));
  elements.goLocation.addEventListener('click', () => applyLocation({
    longitude: Number(elements.longitude.value),
    latitude: Number(elements.latitude.value)
  }, { source: 'manual', fly: true }).catch((error) => {
    elements.regionStatus.textContent = `INVALID LOCATION // ${error.message}`;
  }));
  document.querySelectorAll('[data-camera]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.camera === 'local') {
        flyToLocation(runtime.location ?? FALLBACK_LOCATION);
        return;
      }
      const presets = {
        world: [-20, 16, 21_000_000, 0, -90],
        himalaya: [86.8, 28.2, 1_350_000, 345, -58],
        mariana: [145.4, 11.2, 1_500_000, 15, -64]
      };
      const preset = presets[button.dataset.camera];
      if (!preset) return;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(preset[0], preset[1], preset[2]),
        orientation: {
          heading: Cesium.Math.toRadians(preset[3]),
          pitch: Cesium.Math.toRadians(preset[4]),
          roll: 0
        },
        duration: 1.35
      });
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
    const position = Cesium.Cartographic.fromCartesian(cartesian);
    elements.cursorPosition.textContent = `${Cesium.Math.toDegrees(position.latitude).toFixed(3)}°, ${Cesium.Math.toDegrees(position.longitude).toFixed(3)}° // ${Math.round(position.height)} M`;
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  return () => pointerHandler.destroy();
}

async function start() {
  const initialGeneration = 1;
  runtime.terrainGeneration = initialGeneration;
  const terrainProvider = createTerrainProvider(runtime.terrainSource, initialGeneration);
  const topoMaterial = createTopoOverlayMaterial(Cesium);
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
  viewer.scene.canvas.setAttribute('role', 'application');
  viewer.scene.canvas.setAttribute('aria-label', 'Interactive real-data Earth, road, building, terrain, and weather viewer.');
  viewer.scene.canvas.tabIndex = 0;
  configureScene(viewer, topoMaterial);
  const destroyControls = configureControls(viewer, topoMaterial);
  runtime.cleanup.push(destroyControls);
  const removePostRender = viewer.scene.postRender.addEventListener(() => {
    runtime.frameCount += 1;
    if (runtime.frameCount % 20 === 0) updateReadout();
    updateReady();
  });
  runtime.cleanup.push(removePostRender);
  await startShortbread();
}

function destroy() {
  runtime.localGeneration += 1;
  runtime.weatherGeneration += 1;
  runtime.localAbortController?.abort();
  runtime.weatherAbortController?.abort();
  runtime.localRender?.destroy();
  runtime.weather?.destroy();
  runtime.osmProvider?.destroy();
  for (const cleanup of runtime.cleanup.splice(0)) cleanup?.();
  const viewer = runtime.viewer;
  viewer?.terrainProvider?.wxglobe?.abort?.();
  if (viewer && !viewer.isDestroyed()) viewer.destroy();
  runtime.viewer = null;
}

window.addEventListener('pagehide', destroy, { once: true });

start().catch((error) => {
  runtime.fatalError = error instanceof Error ? error.message : String(error);
  runtime.terrainStatus = 'fatal';
  elements.platformStatus.textContent = `PLATFORM: FATAL // ${runtime.fatalError}`;
  elements.platformStatus.setAttribute('role', 'alert');
  elements.console.classList.add('console--error');
  console.error(error);
});
