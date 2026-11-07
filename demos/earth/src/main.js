import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import {
  createCachedGeoFetch,
  createEtopo2022TerrainProvider,
  createTerrariumTerrainProvider,
  ETOPO2022_MAX_LEVEL,
  fetchEtopo2022Heightmap,
  fetchEtopo2022Samples,
  fetchTerrariumHeightmap,
  WEB_MERCATOR_MAX_LATITUDE
} from '@peercompute/geo-core';
import { StateManager } from '../../../peercompute/src/peercompute/stateManager/StateManager.js';
import { installWorldAgents } from '../../shared/agents/WorldAgentHost.js';
import { EarthAgentLayer } from './agents/EarthAgentLayer.js';

import { GeodataClient, resolveEarthGeodataBaseUrl } from './api.js';
import {
  assertBufferGeometrySupport,
  configureTransparentTerrainGlobe,
  EARTH_GEOMETRY_STYLE,
} from './layers/geometryStyle.js';
import { renderLocalOsmRegion } from './layers/localOsm.js';
import { createNowCoastLayer } from './layers/nowcoast.js';
import {
  loadShortbreadGeometryLayer,
  shortbreadGeometryPresentation,
  SHORTBREAD_GEOMETRY_DETAIL_MINIMUM_ZOOM,
} from './layers/shortbreadGeometry.js';
import { TerrainNurbsGeometryLayer, terrainHeightSamplerForViewer } from './layers/terrainGeometry.js';
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
const EARTH_SHORTBREAD_MAXIMUM_TOTAL_BYTES = 192 * 1024 * 1024;
const EARTH_SHORTBREAD_MAXIMUM_RENDERED_VERTICES = 4_000_000;
const EARTH_VECTOR_HEIGHT_REFRESH_DELAY_MS = 750;
const EARTH_SCENE_RENDER_RECOVERY_LIMIT = 3;
const EARTH_ROAD_SOURCE_CACHE_MAXIMUM_BYTES = 32 * 1024 * 1024;
const EARTH_TERRAIN_SOURCE_CACHE_MAXIMUM_BYTES = 64 * 1024 * 1024;
const EARTH_TERRARIUM_MAX_LEVEL = 10;

const elements = {
  console: document.querySelector('#console'),
  consoleBody: document.querySelector('#console-body'),
  toggleConsole: document.querySelector('#toggle-console'),
  platformStatus: document.querySelector('#platform-status'),
  terrainStatus: document.querySelector('#terrain-status'),
  osmStatus: document.querySelector('#osm-status'),
  waterStatus: document.querySelector('#water-status'),
  localStatus: document.querySelector('#local-status'),
  localProvenance: document.querySelector('#local-provenance'),
  weatherStatus: document.querySelector('#weather-status'),
  weatherTime: document.querySelector('#weather-time'),
  cacheStatus: document.querySelector('#cache-status'),
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
const directSourceFetch = globalThis.fetch.bind(globalThis);
let activeSourceFetch = directSourceFetch;
const sourceFetch = (input, init) => activeSourceFetch(input, init);
const geodata = new GeodataClient({ baseUrl: geodataBaseUrl, fetchImpl: sourceFetch });

const runtime = {
  ready: false,
  destroying: false,
  destroyPromise: null,
  agentHost: null,
  agentLayer: null,
  fatalError: null,
  sceneRenderError: null,
  lastSceneRenderError: null,
  sceneRenderErrorCount: 0,
  sceneRenderErrorFrame: -1,
  sceneRenderConsecutiveFailures: 0,
  sceneRenderRecoveryAttempts: 0,
  frameCount: 0,
  viewer: null,
  terrainSource: 'aws-terrarium',
  terrainStatus: 'initializing',
  terrainGeneration: 0,
  terrain: null,
  osmStatus: 'initializing',
  osmTelemetry: null,
  osmQualifiedRevision: null,
  osmPresentedRevision: null,
  osmGeometry: null,
  waterStatus: 'initializing',
  terrainContours: null,
  vectorHeightRefreshTimer: null,
  sourceCacheManager: null,
  roadSourceCache: null,
  terrainSourceCache: null,
  cachedGeoFetch: null,
  sourceCacheTelemetry: null,
  sourceCacheError: null,
  localStatus: geodata.configured ? 'unrequested' : 'backend-unconfigured',
  localEnvelope: null,
  localRender: null,
  localWaterRevision: null,
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
  const terrainContourStyle = runtime.terrainContours?.getTelemetry?.() ?? null;
  const localGeometry = runtime.localRender?.getTelemetry?.() ?? null;
  const waterHeightResolution = runtime.osmTelemetry?.heightResolution ?? null;
  return {
    ready: runtime.ready,
    fatalError: runtime.fatalError,
    sceneRenderError: runtime.sceneRenderError,
    lastSceneRenderError: runtime.lastSceneRenderError,
    sceneRenderErrorCount: runtime.sceneRenderErrorCount,
    sceneRenderConsecutiveFailures: runtime.sceneRenderConsecutiveFailures,
    sceneRenderRecoveryAttempts: runtime.sceneRenderRecoveryAttempts,
    frameCount: runtime.frameCount,
    agents: runtime.agentLayer?.getState() ?? { count: 0, dataSourcePresent: false, error: null, bodies: [] },
    sourceCache: sourceCacheSnapshot(),
    terrainSource: runtime.terrainSource,
    terrainStatus: runtime.terrainStatus,
    terrainGeneration: runtime.terrainGeneration,
    terrain: runtime.terrain ? { ...runtime.terrain } : null,
    terrainProviderType: viewer?.terrainProvider?.wxglobe?.providerType ?? null,
    osmStatus: runtime.osmStatus,
    osmTelemetry: runtime.osmTelemetry ? { ...runtime.osmTelemetry } : null,
    osmQualifiedRevision: runtime.osmQualifiedRevision,
    osmPresentedRevision: runtime.osmPresentedRevision,
    osmVisible: Boolean(runtime.osmGeometry?.show),
    waterStatus: runtime.waterStatus,
    waterVisible: Boolean(runtime.osmGeometry?.show),
    waterStyle: {
      schemaVersion: 'peercompute.earthgrid.water-buffer-geometry.v2',
      color: EARTH_GEOMETRY_STYLE.colors.waterSurface,
      opacity: 0.5,
      surface: 'flat-cesium-buffer-polygon',
      sourcePublishesWaterElevation: false,
      waterLevelModel: waterHeightResolution?.waterSurfaceModel
        ?? 'ocean-native-zero-inland-bounded-terrain-median-or-zero-fallback',
      ocean: {
        elevationMeters: 0,
        reference: 'terrain-source-native-zero',
        renderedBodyCount: waterHeightResolution?.oceanWaterBodyCount ?? 0,
      },
      inland: {
        reference: 'bounded-terrain-sample-median-or-zero-fallback',
        maximumSamplesPerBody: waterHeightResolution?.maximumWaterLevelSamplesPerBody ?? 32,
        derivedBodyCount: waterHeightResolution?.derivedInlandWaterBodyCount ?? 0,
        fallbackBodyCount: waterHeightResolution?.fallbackInlandWaterBodyCount ?? 0,
        crossTileIdentity: waterHeightResolution?.crossTileWaterBodyIdentity
          ?? 'unavailable-in-shortbread-draw-commands',
      },
      elevationOffsetMeters: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.waterSurfaces,
      rasterPainted: false,
      outline: {
        color: EARTH_GEOMETRY_STYLE.colors.shoreline,
        curveModel: 'NURBS',
        degree: 1,
        geometry: 'degree-one-nurbs-buffer-polyline',
        elevationOffsetMeters: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelines,
        topologyPolicy: 'exact-degree-one-nurbs-polyline',
        maximumSourceDeviationPixels: 0,
        linePassesPerPath: 1,
        glow: false,
        landCompanion: {
          color: EARTH_GEOMETRY_STYLE.colors.shorelineLandline,
          geometry: 'distinct-degree-one-nurbs-buffer-polyline',
          side: 'land',
          offsetSpace: runtime.osmTelemetry?.shorelineCompanion?.offsetSpace
            ?? 'global-web-mercator-tile-pixels',
          requestedOffsetPixels: runtime.osmTelemetry?.shorelineCompanion?.requestedOffsetPixels ?? 2,
          elevationOffsetMeters: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelineLandlines,
          curveCount: runtime.osmTelemetry?.geometry?.shorelineLandlineCurveCount ?? 0,
          linePassesPerPath: 1,
          displayDerived: true,
          glow: false,
          halo: false,
        },
      },
    },
    geometryStyle: {
      ...EARTH_GEOMETRY_STYLE,
      terrainSurface: { ...EARTH_GEOMETRY_STYLE.terrainSurface },
      colors: { ...EARTH_GEOMETRY_STYLE.colors },
      categoryOrder: [...EARTH_GEOMETRY_STYLE.categoryOrder],
      heightOffsetsMeters: { ...EARTH_GEOMETRY_STYLE.heightOffsetsMeters },
    },
    terrainContourStyle,
    localStatus: runtime.localStatus,
    localCounts: runtime.localRender ? {
      sourceRoads: runtime.localRender.sourceRoads,
      sourceBuildings: runtime.localRender.sourceBuildings,
      renderedRoads: runtime.localRender.renderedRoads,
      renderedBuildings: runtime.localRender.renderedBuildings,
      displayOmitted: runtime.localRender.displayOmitted
    } : null,
    localVisible: Boolean(runtime.localRender?.dataSource?.show),
    localGeometry,
    localWaterRevision: runtime.localWaterRevision,
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
    dataSourceCount: viewer?.dataSources?.length ?? 0,
    scenePrimitiveCount: viewer?.scene?.primitives?.length ?? 0,
    contourSpacing: runtime.contourSpacing,
    contourWidth: runtime.contourWidth,
    tilesLoaded: viewer?.scene?.globe?.tilesLoaded ?? false
  };
}

function sourceCacheSnapshot() {
  return {
    schemaVersion: 'peercompute.earthgrid.source-cache.v1',
    owner: 'PeerCompute StateManager',
    storage: 'local-only-memory-indexeddb',
    yjsReplicated: false,
    backendProxyConfigured: geodataBaseUrl !== null,
    backendRoutePolicy: 'fixed-same-origin-or-configured-origin-no-upstream-url-input',
    road: runtime.roadSourceCache?.getStats?.() ?? null,
    terrain: runtime.terrainSourceCache?.getStats?.() ?? null,
    transport: runtime.cachedGeoFetch?.getTelemetry?.() ?? runtime.sourceCacheTelemetry,
    error: runtime.sourceCacheError,
  };
}

function updateSourceCacheStatus(telemetry = runtime.cachedGeoFetch?.getTelemetry?.()) {
  runtime.sourceCacheTelemetry = telemetry ? { ...telemetry } : null;
  if (runtime.sourceCacheError) {
    elements.cacheStatus.textContent = `LOCAL CACHE UNAVAILABLE // ${runtime.sourceCacheError}`;
    return;
  }
  const hits = telemetry?.cacheHits ?? 0;
  const misses = telemetry?.cacheMisses ?? 0;
  const backend = geodataBaseUrl === null ? 'DIRECT SOURCE' : 'BACKEND + LOCAL';
  elements.cacheStatus.textContent = `${backend} // ${hits} HIT // ${misses} MISS`;
}

function initializeSourceCaches() {
  try {
    const manager = new StateManager(null, {
      enablePersistence: false,
      disableNetworkProvider: true,
      disableBroadcast: true,
    });
    const roadCache = manager.createLocalArtifactCache({
      name: 'earthgrid-road-source-v1',
      maximumEntries: 64,
      maximumBytes: EARTH_ROAD_SOURCE_CACHE_MAXIMUM_BYTES,
      maximumEntryBytes: 2 * 1024 * 1024,
      persistent: true,
    });
    const terrainCache = manager.createLocalArtifactCache({
      name: 'earthgrid-terrain-source-v1',
      maximumEntries: 192,
      maximumBytes: EARTH_TERRAIN_SOURCE_CACHE_MAXIMUM_BYTES,
      maximumEntryBytes: 512 * 1024,
      persistent: true,
    });
    const cachedFetch = createCachedGeoFetch({
      fetchImpl: directSourceFetch,
      geodataBaseUrl,
      localRoadCache: roadCache,
      localTerrainCache: terrainCache,
      directFallback: true,
      onTelemetry: updateSourceCacheStatus,
    });
    runtime.sourceCacheManager = manager;
    runtime.roadSourceCache = roadCache;
    runtime.terrainSourceCache = terrainCache;
    runtime.cachedGeoFetch = cachedFetch;
    activeSourceFetch = cachedFetch;
    updateSourceCacheStatus(cachedFetch.getTelemetry());
  } catch (error) {
    runtime.sourceCacheError = error instanceof Error ? error.message : String(error);
    activeSourceFetch = directSourceFetch;
    updateSourceCacheStatus(null);
  }
}

window.__earthDemo = {
  getState: publicState,
  dispose: () => destroy(),
  get agentHost() { return runtime.agentHost; },
  setLocation: (location) => applyLocation(location, { source: 'api', fly: true }),
  reloadLocalRegion: () => loadLocalRegion(),
  setOsmVisible: (visible) => setOsmVisibility(Boolean(visible)),
  setWeather: (id) => setWeatherLayer(id),
  get viewer() { return runtime.viewer; }
};

const terrainMetadata = Object.freeze({
  'noaa-etopo2022': Object.freeze({ mode: 'POLE-TO-POLE', maxLevel: ETOPO2022_MAX_LEVEL, maximumLatitude: 90 }),
  'aws-terrarium': Object.freeze({ mode: 'BOUNDED DETAIL ±85°', maxLevel: EARTH_TERRARIUM_MAX_LEVEL, maximumLatitude: WEB_MERCATOR_MAX_LATITUDE })
});

function updateReadout() {
  const activeSources = [runtime.terrainStatus, runtime.osmStatus, runtime.localStatus, runtime.weatherStatus]
    .filter((status) => ['live', 'local-live', 'loaded'].includes(status)).length;
  elements.readout.textContent = `FRAME ${runtime.frameCount.toLocaleString()} // SOURCES ${activeSources} // ${runtime.locationSource ?? 'WORLD'}`;
}

function recordSceneRenderError(sceneOrError, possibleError) {
  const value = possibleError ?? sceneOrError;
  runtime.sceneRenderError = value instanceof Error ? value.message : String(value ?? 'Cesium render failed.');
  runtime.lastSceneRenderError = runtime.sceneRenderError;
  runtime.sceneRenderErrorCount += 1;
  runtime.sceneRenderErrorFrame = runtime.frameCount;
  runtime.sceneRenderConsecutiveFailures += 1;
  runtime.ready = false;
  document.documentElement.dataset.earthReady = 'false';
  elements.platformStatus.textContent = `PLATFORM: RENDER ERROR // ${runtime.sceneRenderError}`;
  elements.platformStatus.setAttribute('role', 'alert');
  elements.console.classList.add('console--error');
  if (runtime.sceneRenderConsecutiveFailures <= EARTH_SCENE_RENDER_RECOVERY_LIMIT) {
    const recoveryErrorCount = runtime.sceneRenderErrorCount;
    runtime.sceneRenderRecoveryAttempts += 1;
    requestAnimationFrame(() => {
      if (!runtime.viewer || runtime.viewer.isDestroyed()) return;
      if (runtime.sceneRenderErrorCount !== recoveryErrorCount || runtime.sceneRenderError === null) return;
      runtime.viewer.useDefaultRenderLoop = true;
      runtime.viewer.scene.requestRender();
    });
  } else {
    runtime.fatalError = `Cesium rendering failed repeatedly: ${runtime.sceneRenderError}`;
  }
}

function updateReady() {
  if (runtime.destroying) return;
  if (runtime.fatalError) {
    runtime.ready = false;
    document.documentElement.dataset.earthReady = 'false';
    return;
  }
  const terrainReady = runtime.frameCount > 0 && (runtime.terrain?.loaded ?? 0) > 0;
  const contourTelemetry = runtime.terrainContours?.getTelemetry?.();
  const contourReady = (contourTelemetry?.activePathCount ?? 0) > 0
    && contourTelemetry?.cpuGeometryValidated === true
    && contourTelemetry?.gpuSubmittedFrame === true
    && contourTelemetry?.renderReady === true;
  const osmPresentation = shortbreadGeometryPresentation(runtime.osmTelemetry);
  const osmSettled = (!elements.osmContext.checked)
    || ((runtime.osmTelemetry?.loaded ?? 0) > 0
      && (runtime.osmTelemetry?.cpuGeometryValidated === true
        || runtime.osmTelemetry?.readiness?.bufferCountsExact === true)
      && osmPresentation.geometrySettled);
  const waterSettled = !elements.osmContext.checked
    || ['live', 'degraded'].includes(runtime.waterStatus);
  const sourcesReady = terrainReady && contourReady && osmSettled && waterSettled;
  if (sourcesReady
    && runtime.sceneRenderError !== null
    && runtime.frameCount > runtime.sceneRenderErrorFrame) {
    runtime.sceneRenderError = null;
    runtime.sceneRenderConsecutiveFailures = 0;
    elements.platformStatus.removeAttribute('role');
    elements.console.classList.remove('console--error');
  }
  const ready = sourcesReady && runtime.sceneRenderError === null;
  runtime.ready = ready;
  document.documentElement.dataset.earthReady = String(ready);
  elements.platformStatus.textContent = ready
    ? 'PLATFORM: READY // REAL SOURCES QUALIFIED'
    : 'PLATFORM: RENDERING // VALIDATING BUFFER GEOMETRY';
}

function scheduleVectorHeightRefresh() {
  if (runtime.vectorHeightRefreshTimer !== null) {
    clearTimeout(runtime.vectorHeightRefreshTimer);
  }
  const refreshWhenTerrainSettles = () => {
    runtime.vectorHeightRefreshTimer = null;
    if ((runtime.terrain?.inFlight ?? 0) > 0 || (runtime.terrain?.activeRetries ?? 0) > 0) {
      runtime.vectorHeightRefreshTimer = setTimeout(
        refreshWhenTerrainSettles,
        EARTH_VECTOR_HEIGHT_REFRESH_DELAY_MS,
      );
      return;
    }
    try {
      runtime.osmGeometry?.refreshHeights?.();
      if (!elements.osmContext.checked && elements.localScene.checked) {
        runtime.localRender?.refreshHeights?.();
      }
    } catch (error) {
      runtime.fatalError = error instanceof Error ? error.message : String(error);
      elements.platformStatus.textContent = `PLATFORM: GEOMETRY ERROR // ${runtime.fatalError}`;
      elements.platformStatus.setAttribute('role', 'alert');
      elements.console.classList.add('console--error');
    }
    runtime.viewer?.scene?.requestRender?.();
  };
  runtime.vectorHeightRefreshTimer = setTimeout(
    refreshWhenTerrainSettles,
    EARTH_VECTOR_HEIGHT_REFRESH_DELAY_MS,
  );
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
  const options = {
    maxLevel: source === 'noaa-etopo2022' ? ETOPO2022_MAX_LEVEL : EARTH_TERRARIUM_MAX_LEVEL,
    fetchHeightmap: source === 'noaa-etopo2022'
      ? (url, requestOptions = {}) => fetchEtopo2022Heightmap(url, {
        ...requestOptions,
        fetchImpl: sourceFetch,
      })
      : (url, requestOptions = {}) => fetchTerrariumHeightmap(url, {
        ...requestOptions,
        fetchImpl: sourceFetch,
      }),
    ...(source === 'noaa-etopo2022' ? {
      fetchSamples: (points, requestOptions = {}) => fetchEtopo2022Samples(points, {
        ...requestOptions,
        fetchImpl: sourceFetch,
      }),
    } : {}),
    onTelemetry: (telemetry) => updateTerrainTelemetry(telemetry, generation),
    onHeightmap: (heightmap) => {
      if (generation !== runtime.terrainGeneration) return;
      runtime.terrainContours?.acceptHeightmap(heightmap);
      scheduleVectorHeightRefresh();
    },
  };
  const provider = source === 'noaa-etopo2022'
    ? createEtopo2022TerrainProvider(Cesium, options)
    : createTerrariumTerrainProvider(Cesium, options);
  provider.wxglobe.generation = generation;
  return provider;
}

function setTerrainSource(source) {
  if (!terrainMetadata[source]) throw new RangeError(`Unknown terrain source ${source}.`);
  const viewer = runtime.viewer;
  if (runtime.vectorHeightRefreshTimer !== null) {
    clearTimeout(runtime.vectorHeightRefreshTimer);
    runtime.vectorHeightRefreshTimer = null;
  }
  const generation = runtime.terrainGeneration + 1;
  const previous = viewer.terrainProvider;
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
  runtime.terrainContours?.destroy();
  runtime.terrainContours = new TerrainNurbsGeometryLayer(Cesium, {
    viewer,
    contourSpacingMeters: runtime.contourSpacing,
    lineWidthPixels: runtime.contourWidth,
  });
  const provider = createTerrainProvider(source, generation);
  viewer.terrainProvider = provider;
  previous?.wxglobe?.abort?.();
  viewer.scene.requestRender();
}

function configureScene(viewer) {
  viewer.imageryLayers.removeAll();
  const { scene } = viewer;
  assertBufferGeometrySupport(Cesium, scene);
  scene.backgroundColor = Cesium.Color.BLACK;
  configureTransparentTerrainGlobe(Cesium, scene);
  scene.globe.showGroundAtmosphere = false;
  scene.globe.enableLighting = false;
  scene.globe.maximumScreenSpaceError = 6;
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
  runtime.waterStatus = 'connecting';
  elements.osmStatus.textContent = 'SHORTBREAD CONNECTING';
  elements.waterStatus.textContent = 'SHORTBREAD WATER CONNECTING';
  try {
    const layer = await loadShortbreadGeometryLayer(Cesium, {
      viewer: runtime.viewer,
      fetchImpl: sourceFetch,
      maximumTotalBytes: EARTH_SHORTBREAD_MAXIMUM_TOTAL_BYTES,
      maximumActiveVertices: EARTH_SHORTBREAD_MAXIMUM_RENDERED_VERTICES,
      minimumGeometryZoom: SHORTBREAD_GEOMETRY_DETAIL_MINIMUM_ZOOM,
      heightResolver: (longitude, latitude) => runtime.terrainContours?.sampleHeight(longitude, latitude),
      categoryElevationOffsetsMeters: {
        waterSurface: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.waterSurfaces,
        shoreline: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelines,
        landline: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.shorelineLandlines,
        building: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.buildingWires,
        road: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.globalRoads,
      },
      onTelemetry: (telemetry) => {
        runtime.osmTelemetry = telemetry;
        const presentation = shortbreadGeometryPresentation(telemetry);
        if (!presentation.geometrySettled && elements.osmContext.checked) {
          runtime.osmQualifiedRevision = null;
          runtime.osmPresentedRevision = null;
          runtime.localWaterRevision = null;
          if (runtime.localRender) runtime.localRender.dataSource.show = false;
          if (runtime.localRender && elements.localScene.checked) {
            runtime.localStatus = presentation.terminalFailure ? 'unavailable' : 'rendering';
            elements.localStatus.textContent = presentation.terminalFailure
              ? 'MATCHED WATER GEOMETRY UNAVAILABLE'
              : 'WAITING FOR MATCHED WATER GEOMETRY';
          }
        }
        runtime.osmStatus = presentation.status;
        runtime.waterStatus = presentation.status;
        if (runtime.osmGeometry) {
          runtime.osmGeometry.show = elements.osmContext.checked && !presentation.terminalFailure;
        }
        elements.osmStatus.textContent = telemetry.broadViewDeferral?.active
          ? `SHORTBREAD VIEW DEFERRED // ZOOM TO Z${telemetry.broadViewDeferral.minimumGeometryZoom} FOR BUFFER GEOMETRY`
          : telemetry.geometry?.roadCurveCount > 0
          ? `SHORTBREAD ${runtime.osmStatus.toUpperCase()} // ${telemetry.geometry.roadCurveCount} ROAD CURVES // ${telemetry.loaded}/${telemetry.requested}`
          : `SHORTBREAD ${runtime.osmStatus.toUpperCase()} // ${telemetry.loaded}/${telemetry.requested} // ZOOM FOR ROADS`;
        elements.waterStatus.textContent = telemetry.broadViewDeferral?.active
          ? `BLUE VIEW DEFERRED // ZOOM TO Z${telemetry.broadViewDeferral.minimumGeometryZoom} FOR WATER SURFACES`
          : telemetry.geometry?.waterSurfaceCount > 0
          ? `BLUE/GREEN ${runtime.waterStatus.toUpperCase()} // ${telemetry.geometry.waterSurfaceCount} SURFACES // ${telemetry.geometry.shorelineCurveCount} WATER + ${telemetry.geometry.shorelineLandlineCurveCount ?? 0} LAND EDGES`
          : telemetry.loaded > 0
            ? `BLUE/GREEN ${runtime.waterStatus.toUpperCase()} // 0 SURFACES IN VIEW // 0 PAIRED EDGES`
            : 'BLUE/GREEN CONNECTING // WAITING FOR FIRST TILE';
        if (presentation.geometrySettled
          && Number.isInteger(presentation.qualifiedRevision)
          && presentation.qualifiedRevision !== runtime.osmQualifiedRevision) {
          runtime.osmQualifiedRevision = presentation.qualifiedRevision;
          runtime.osmPresentedRevision = presentation.presentedRevision;
          if (runtime.localRender && elements.localScene.checked) {
            const installed = runtime.localRender.refreshHeights?.() === true;
            if (installed) {
              runtime.localWaterRevision = presentation.qualifiedRevision;
            }
            updateLocalGeometryStatus(runtime.localRender.getTelemetry(), runtime.localGeneration);
          }
        }
        updateReady();
      }
    });
    if (!runtime.viewer || runtime.viewer.isDestroyed()) {
      layer.destroy();
      return;
    }
    runtime.osmGeometry = layer;
    const presentation = shortbreadGeometryPresentation(runtime.osmTelemetry);
    runtime.osmGeometry.show = elements.osmContext.checked && !presentation.terminalFailure;
    if ((runtime.osmTelemetry?.loaded ?? 0) === 0 && presentation.status === 'connecting') {
      runtime.osmStatus = 'waiting-tiles';
      runtime.waterStatus = 'waiting-tiles';
      elements.osmStatus.textContent = 'SHORTBREAD WAITING FOR FIRST TILE // ODBL';
      elements.waterStatus.textContent = 'SHORTBREAD WATER WAITING FOR FIRST TILE // ODBL';
    }
  } catch (error) {
    runtime.osmStatus = 'unavailable';
    runtime.waterStatus = 'unavailable';
    elements.osmStatus.textContent = `UNAVAILABLE // ${error instanceof Error ? error.message : String(error)}`;
    elements.waterStatus.textContent = `UNAVAILABLE // ${error instanceof Error ? error.message : String(error)}`;
  }
  updateReady();
}

function setOsmVisibility(visible) {
  elements.osmContext.checked = visible;
  if (runtime.osmGeometry) {
    const presentation = shortbreadGeometryPresentation(runtime.osmTelemetry);
    runtime.osmGeometry.show = visible && !presentation.terminalFailure;
    if (visible && !presentation.geometrySettled) {
      runtime.osmQualifiedRevision = null;
      runtime.osmPresentedRevision = null;
      runtime.localWaterRevision = null;
      if (runtime.localRender?.dataSource) runtime.localRender.dataSource.show = false;
    }
    runtime.osmTelemetry = runtime.osmGeometry.getTelemetry();
  }
  if (runtime.localRender) {
    updateLocalGeometryStatus(runtime.localRender.getTelemetry(), runtime.localGeneration);
  }
  updateReady();
  runtime.viewer?.scene?.requestRender();
}

function updateLocalGeometryStatus(telemetry, generation) {
  if (generation !== runtime.localGeneration) return;
  if (!elements.localScene.checked) {
    const presentation = localScenePresentation({
      enabled: false,
      envelope: runtime.localEnvelope,
      render: runtime.localRender,
    });
    runtime.localStatus = presentation.status;
    elements.localStatus.textContent = presentation.statusText;
    elements.localProvenance.textContent = presentation.provenanceText;
    updateReady();
    return;
  }
  if (telemetry?.lastError) {
    if (runtime.localRender?.dataSource) runtime.localRender.dataSource.show = false;
    runtime.localStatus = 'unavailable';
    elements.localStatus.textContent = `GEOMETRY UNAVAILABLE // ${telemetry.lastError}`;
    elements.localProvenance.textContent = `LOCAL REGION GEOMETRY ERROR // ${telemetry.lifecycleReason ?? 'UNKNOWN'}`;
    updateReady();
    return;
  }
  const osmPresentation = shortbreadGeometryPresentation(runtime.osmTelemetry);
  if (elements.osmContext.checked && osmPresentation.terminalFailure) {
    if (runtime.localRender?.dataSource) runtime.localRender.dataSource.show = false;
    runtime.localStatus = 'unavailable';
    elements.localStatus.textContent = 'MATCHED WATER GEOMETRY UNAVAILABLE';
    elements.localProvenance.textContent = 'LOCAL REGION HIDDEN // GLOBAL WATER GEOMETRY UNAVAILABLE';
    updateReady();
    return;
  }
  if (elements.osmContext.checked
    && (!Number.isInteger(runtime.localWaterRevision)
      || runtime.localWaterRevision !== runtime.osmQualifiedRevision)) {
    if (runtime.localRender?.dataSource) runtime.localRender.dataSource.show = false;
    runtime.localStatus = 'rendering';
    elements.localStatus.textContent = 'WAITING FOR MATCHED WATER GEOMETRY';
    updateReady();
    return;
  }
  const localGeometrySettled = telemetry?.settledEmpty === true
    || (telemetry?.renderReady === true && telemetry?.gpuSubmittedFrame === true);
  if (!localGeometrySettled) {
    if (runtime.localRender?.dataSource) runtime.localRender.dataSource.show = true;
    runtime.localStatus = 'rendering';
    elements.localStatus.textContent = 'VALIDATING BUFFER GEOMETRY';
    updateReady();
    return;
  }
  const presentation = localScenePresentation({
    enabled: elements.localScene.checked,
    envelope: runtime.localEnvelope,
    render: runtime.localRender,
  });
  runtime.localStatus = presentation.status;
  elements.localStatus.textContent = presentation.statusText;
  elements.localProvenance.textContent = presentation.provenanceText;
  updateReady();
}

async function loadLocalRegion() {
  runtime.localGeneration += 1;
  const generation = runtime.localGeneration;
  runtime.localAbortController?.abort();
  runtime.localAbortController = new AbortController();
  runtime.localRender?.destroy();
  runtime.localRender = null;
  runtime.localWaterRevision = null;
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
    runtime.localStatus = 'rendering';
    const osmPresentation = shortbreadGeometryPresentation(runtime.osmTelemetry);
    const installedWaterRevision = osmPresentation.geometrySettled
      ? osmPresentation.qualifiedRevision
      : null;
    runtime.localRender = renderLocalOsmRegion(Cesium, runtime.viewer, result.envelope, {
      sampleHeight: (longitude, latitude) => runtime.terrainContours?.sampleHeight(longitude, latitude),
      sampleWaterHeight: (longitude, latitude) => (
        runtime.osmGeometry?.sampleWaterSurfaceHeight?.(longitude, latitude)
      ),
      sampleWaterHeightAlongSegment: (
        longitude1,
        latitude1,
        longitude2,
        latitude2,
      ) => runtime.osmGeometry?.sampleMaximumWaterSurfaceHeightAlongSegment?.(
        longitude1,
        latitude1,
        longitude2,
        latitude2,
      ),
      onTelemetry: (telemetry) => updateLocalGeometryStatus(telemetry, generation),
    });
    runtime.localWaterRevision = Number.isInteger(installedWaterRevision)
      ? installedWaterRevision
      : null;
    runtime.localRender.dataSource.show = elements.localScene.checked
      && (!elements.osmContext.checked || Number.isInteger(runtime.localWaterRevision));
    updateLocalGeometryStatus(runtime.localRender.getTelemetry(), generation);
    runtime.viewer.scene.requestRender();
  } catch (error) {
    if (error?.name === 'AbortError' || generation !== runtime.localGeneration) return;
    runtime.localWaterRevision = null;
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

function configureControls(viewer) {
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
      if (elements.localScene.checked) {
        updateLocalGeometryStatus(runtime.localRender.getTelemetry(), runtime.localGeneration);
      } else {
        const presentation = localScenePresentation({
          enabled: false,
          envelope: runtime.localEnvelope,
          render: runtime.localRender
        });
        runtime.localStatus = presentation.status;
        elements.localStatus.textContent = presentation.statusText;
        elements.localProvenance.textContent = presentation.provenanceText;
        updateReady();
      }
      viewer.scene.requestRender();
    } else loadLocalRegion();
  });
  elements.weatherLayer.addEventListener('change', () => setWeatherLayer(elements.weatherLayer.value));
  elements.contourSpacing.addEventListener('input', () => {
    runtime.contourSpacing = Number(elements.contourSpacing.value);
    runtime.terrainContours?.setStyle({ contourSpacingMeters: runtime.contourSpacing });
    elements.contourSpacingValue.textContent = `${runtime.contourSpacing.toLocaleString()} M`;
    viewer.scene.requestRender();
  });
  elements.lineWidth.addEventListener('input', () => {
    runtime.contourWidth = Number(elements.lineWidth.value);
    runtime.terrainContours?.setStyle({ lineWidthPixels: runtime.contourWidth });
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
  initializeSourceCaches();
  const initialGeneration = 1;
  runtime.terrainGeneration = initialGeneration;
  const viewer = new Cesium.Viewer('viewer', {
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
    requestRenderMode: true,
    maximumRenderTimeChange: Number.POSITIVE_INFINITY,
    showRenderLoopErrors: false
  });
  runtime.viewer = viewer;
  runtime.agentLayer = new EarthAgentLayer({ Cesium, viewer,
    onSelect: (key) => runtime.agentHost?.openConversation(key),
    sampleHeight: (longitude, latitude) => terrainHeightSamplerForViewer(viewer)?.(longitude, latitude),
    getWorldContext: () => {
      const camera = viewer.camera.positionCartographic;
      return { terrain: runtime.terrainSource,
        terrainStatus: runtime.terrainStatus, weather: runtime.weatherStatus,
        camera: { latitude: Number(Cesium.Math.toDegrees(camera.latitude).toFixed(3)),
          longitude: Number(Cesium.Math.toDegrees(camera.longitude).toFixed(3)), height: Math.round(camera.height) } };
    }
  });
  runtime.agentHost = installWorldAgents({ worldId: 'earthgrid:global', worldLabel: 'EarthGrid',
    adapter: runtime.agentLayer,
    getRuntimeOptions: () => ({ stateManager: runtime.sourceCacheManager || undefined }) });
  runtime.agentHost.ready.catch((error) => console.warn('Earth agent host unavailable:', error));
  viewer.scene.canvas.setAttribute('role', 'application');
  viewer.scene.canvas.setAttribute('aria-label', 'Interactive real-data Earth with actual water, road, building-wire, and terrain-contour geometry plus optional source weather imagery.');
  viewer.scene.canvas.tabIndex = 0;
  configureScene(viewer);
  const removeRenderError = viewer.scene.renderError.addEventListener(recordSceneRenderError);
  runtime.cleanup.push(removeRenderError);
  runtime.terrainContours = new TerrainNurbsGeometryLayer(Cesium, {
    viewer,
    contourSpacingMeters: runtime.contourSpacing,
    lineWidthPixels: runtime.contourWidth,
  });
  viewer.terrainProvider = createTerrainProvider(runtime.terrainSource, initialGeneration);
  const destroyControls = configureControls(viewer);
  runtime.cleanup.push(destroyControls);
  const removePostRender = viewer.scene.postRender.addEventListener(() => {
    runtime.frameCount += 1;
    updateReadout();
    updateReady();
  });
  runtime.cleanup.push(removePostRender);
  await startShortbread();
}

function destroy() {
  if (runtime.destroyPromise) return runtime.destroyPromise;
  runtime.destroying = true;
  runtime.ready = false;
  runtime.localGeneration += 1;
  runtime.weatherGeneration += 1;
  runtime.localAbortController?.abort();
  runtime.weatherAbortController?.abort();
  if (runtime.vectorHeightRefreshTimer !== null) {
    clearTimeout(runtime.vectorHeightRefreshTimer);
    runtime.vectorHeightRefreshTimer = null;
  }
  runtime.viewer?.terrainProvider?.wxglobe?.abort?.();
  runtime.destroyPromise = (async () => {
    // Keep storage and renderer alive until model/agent cancellation is acknowledged.
    await runtime.agentHost?.dispose();
    await runtime.agentLayer?.dispose();
    runtime.localRender?.destroy();
    runtime.weather?.destroy();
    runtime.osmGeometry?.destroy();
    runtime.terrainContours?.destroy();
    await runtime.cachedGeoFetch?.destroy?.();
    await runtime.sourceCacheManager?.destroy?.();
    for (const cleanup of runtime.cleanup.splice(0)) cleanup?.();
    const viewer = runtime.viewer;
    if (viewer && !viewer.isDestroyed()) viewer.destroy();
    runtime.viewer = null;
  })().catch((error) => { runtime.destroyPromise = null; throw error; });
  return runtime.destroyPromise;
}

// Explicit dispose can be awaited; browser page termination cannot guarantee async completion.
window.addEventListener('pagehide', () => { void destroy().catch(console.error); }, { once: true });

start().catch((error) => {
  runtime.fatalError = error instanceof Error ? error.message : String(error);
  runtime.terrainStatus = 'fatal';
  elements.platformStatus.textContent = `PLATFORM: FATAL // ${runtime.fatalError}`;
  elements.platformStatus.setAttribute('role', 'alert');
  elements.console.classList.add('console--error');
  console.error(error);
});
