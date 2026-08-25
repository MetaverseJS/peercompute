import {
  createTerrariumTerrainProvider,
  createTopoOverlayMaterial,
  loadFederalHighwayImageryProvider,
  loadShortbreadImageryProvider,
} from '@peercompute/geo-core';

import {
  centeredOverviewTiles,
  normalizeOverviewLocation,
  overviewTileWindowBounds,
} from './globeMath.js';
import { createRoadvectorPresenceRuntime } from './playerPresence.js';

export const ROADVECTOR_OVERVIEW_CAMERA_HEIGHT_METERS = 10_500_000;
export const ROADVECTOR_OVERVIEW_ROAD_ZOOM = 5;
export const ROADVECTOR_OVERVIEW_MAXIMUM_TILES = 25;
export const ROADVECTOR_OVERVIEW_MAXIMUM_TILE_BYTES = 1024 * 1024;
export const ROADVECTOR_OVERVIEW_MAXIMUM_TOTAL_BYTES = 8 * 1024 * 1024;
export const ROADVECTOR_OVERVIEW_MAXIMUM_VERTICES = 100_000;
export const ROADVECTOR_OVERVIEW_TERRAIN_MAX_LEVEL = 3;
// The complete z0..z3 Web Mercator pyramid is finite: 1 + 4 + 16 + 64.
// This is a structural cap, so returning to another hemisphere cannot exhaust
// a location-scoped or lifetime request budget.
export const ROADVECTOR_OVERVIEW_MAXIMUM_TERRAIN_TILES = 85;
export const ROADVECTOR_FEDERAL_HIGHWAY_VERSION = '2025.08.08';
export const ROADVECTOR_FEDERAL_HIGHWAY_MANIFEST_PATH = `data/fhwa-nhs/${ROADVECTOR_FEDERAL_HIGHWAY_VERSION}/manifest.json`;
export const ROADVECTOR_OVERVIEW_MAJOR_CATEGORIES = Object.freeze([
  'motorway',
  'trunk',
  'primary',
]);

export function isRoadvectorOverviewCommand(command) {
  return command?.kind === 'road'
    && ROADVECTOR_OVERVIEW_MAJOR_CATEGORIES.includes(command.category);
}

function defaultViewerFactory(Cesium, container, options) {
  return new Cesium.Viewer(container, options);
}

function createRoadvectorOverviewTerrainProvider(Cesium, {
  onTelemetry,
  maximumTileRequests,
} = {}) {
  if (maximumTileRequests !== ROADVECTOR_OVERVIEW_MAXIMUM_TERRAIN_TILES) {
    throw new RangeError('RoadVector terrain must retain the complete bounded z0..z3 pyramid.');
  }
  return createTerrariumTerrainProvider(Cesium, {
    maxLevel: ROADVECTOR_OVERVIEW_TERRAIN_MAX_LEVEL,
    onTelemetry,
  });
}

function configureViewer(Cesium, viewer, topoMaterial) {
  viewer.imageryLayers.removeAll();
  const { scene } = viewer;
  scene.backgroundColor = Cesium.Color.BLACK;
  scene.globe.baseColor = Cesium.Color.BLACK;
  scene.globe.material = topoMaterial;
  scene.globe.depthTestAgainstTerrain = true;
  scene.globe.showGroundAtmosphere = false;
  scene.globe.enableLighting = false;
  scene.globe.maximumScreenSpaceError = 2.5;
  scene.requestRenderMode = true;
  scene.maximumRenderTimeChange = Number.POSITIVE_INFINITY;
  scene.fog.enabled = false;
  scene.highDynamicRange = false;
  scene.skyAtmosphere.show = false;
  scene.skyBox.show = false;
  scene.sun.show = false;
  scene.moon.show = false;
  scene.canvas.setAttribute?.('role', 'application');
  scene.canvas.setAttribute?.('aria-label', 'Cesium globe with real terrain, regional OpenStreetMap roads, and live RoadVector players.');
  scene.canvas.classList?.add('roadvector-cesium-canvas');
  scene.canvas.tabIndex = 0;
}

function terrainStatusFromTelemetry(telemetry) {
  if (!telemetry) return 'loading';
  if ((telemetry.rootTerminalFailures ?? 0) > 0) return 'unavailable';
  if ((telemetry.loaded ?? 0) > 0) {
    return (telemetry.terminalFailures ?? 0) > 0 ? 'degraded' : 'current';
  }
  if ((telemetry.activeRetries ?? 0) > 0) return 'retrying';
  return 'loading';
}

function roadStatusFromTelemetry(telemetry) {
  if (!telemetry) return 'loading';
  if ((telemetry.loaded ?? 0) > 0) return (telemetry.failed ?? 0) > 0 ? 'degraded' : 'current';
  if ((telemetry.failed ?? 0) > 0) return 'unavailable';
  return 'loading';
}

function removeImageryLayer(viewer, layer) {
  if (!layer || viewer.isDestroyed?.()) return;
  viewer.imageryLayers.remove(layer, true);
}

export function pickRoadvectorGlobeLocation(Cesium, viewer, screenPosition) {
  if (!Cesium?.Cartographic?.fromCartesian || !Cesium?.Math?.toDegrees) {
    throw new TypeError('Cesium cartographic conversion primitives are required.');
  }
  if (!viewer?.camera || !viewer?.scene?.globe) throw new TypeError('A Cesium viewer is required.');
  const ray = viewer.camera.getPickRay?.(screenPosition);
  const cartesian = (ray ? viewer.scene.globe.pick?.(ray, viewer.scene) : null)
    ?? viewer.camera.pickEllipsoid?.(screenPosition, viewer.scene.globe.ellipsoid)
    ?? null;
  if (!cartesian) return null;
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  const longitude = Cesium.Math.toDegrees(cartographic.longitude);
  const latitude = Cesium.Math.toDegrees(cartographic.latitude);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)
    || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    return null;
  }
  return Object.freeze({
    longitude: Math.round(longitude * 10_000) / 10_000,
    latitude: Math.round(latitude * 10_000) / 10_000,
  });
}

export function createRoadvectorOverviewRuntime({
  Cesium,
  container,
  fetchImpl = globalThis.fetch,
  presenceOptions = {},
  viewerFactory = defaultViewerFactory,
  terrainProviderFactory = createRoadvectorOverviewTerrainProvider,
  topoMaterialFactory = createTopoOverlayMaterial,
  shortbreadProviderLoader = loadShortbreadImageryProvider,
  federalHighwayProviderLoader = loadFederalHighwayImageryProvider,
  federalHighwayManifestUrl = new URL(
    ROADVECTOR_FEDERAL_HIGHWAY_MANIFEST_PATH,
    globalThis.document?.baseURI ?? globalThis.location?.href ?? 'http://localhost/',
  ).toString(),
  onLocationSelected = null,
  screenSpaceEventHandlerFactory = (canvas) => (
    Cesium.ScreenSpaceEventHandler ? new Cesium.ScreenSpaceEventHandler(canvas) : null
  ),
} = {}) {
  if (!Cesium?.Cartesian3 || !Cesium?.Rectangle || !Cesium?.Color) {
    throw new TypeError('RoadVector Cesium overview requires Cesium geospatial primitives.');
  }
  if (!container) throw new TypeError('RoadVector Cesium overview requires a container.');

  let terrainTelemetry = null;
  let terrainProvider = null;
  let terrainGeneration = 0;
  const topoMaterial = topoMaterialFactory(Cesium);
  const viewer = viewerFactory(Cesium, container, {
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
    useDefaultRenderLoop: false,
  });
  configureViewer(Cesium, viewer, topoMaterial);

  const presenceAbort = new AbortController();
  const presence = createRoadvectorPresenceRuntime({ fetchImpl, ...presenceOptions });
  const federalHighwayAbort = new AbortController();
  let federalHighwayLayer = null;
  let federalHighwayProvider = null;
  let federalHighwayTelemetry = null;
  let federalHighwayError = null;
  let roadAbort = null;
  let roadGeneration = 0;
  let roadLayer = null;
  let roadProvider = null;
  let roadTelemetry = null;
  let roadBounds = null;
  let roadError = null;
  let mode = 'overview';
  let location = null;
  let locationSource = null;
  let disposed = false;
  let renderedFrames = 0;
  let selection = Object.freeze({ status: 'idle', location: null, error: null });
  let selectionGeneration = 0;
  let players = presence.getSnapshot();
  let peerSignature = '';
  const remoteEntities = new Map();
  const removePostRender = viewer.scene.postRender?.addEventListener?.(() => {
    renderedFrames += 1;
  }) ?? (() => {});

  presence.start({ signal: presenceAbort.signal }).then((snapshot) => {
    players = snapshot;
  }).catch(() => {});

  const federalHighwayReady = federalHighwayProviderLoader(Cesium, {
    manifestUrl: federalHighwayManifestUrl,
    fetchImpl,
    signal: federalHighwayAbort.signal,
    onTelemetry(telemetry) {
      if (disposed) return;
      federalHighwayTelemetry = Object.freeze({ ...telemetry });
      requestRender();
    },
  }).then((provider) => {
    if (disposed || federalHighwayAbort.signal.aborted) {
      provider.destroy?.();
      return;
    }
    federalHighwayProvider = provider;
    federalHighwayLayer = viewer.imageryLayers.addImageryProvider(provider, 0);
    requestRender();
  }).catch((error) => {
    if (disposed || federalHighwayAbort.signal.aborted) return;
    federalHighwayError = error instanceof Error ? error.message : String(error);
    requestRender();
  });

  const screenSpaceHandler = typeof onLocationSelected === 'function'
    ? screenSpaceEventHandlerFactory(viewer.scene.canvas)
    : null;
  screenSpaceHandler?.setInputAction?.((event) => {
    const generation = ++selectionGeneration;
    const picked = pickRoadvectorGlobeLocation(Cesium, viewer, event?.position);
    if (!picked) {
      selection = Object.freeze({ generation, status: 'missed', location: null, clickedLocation: null, error: null });
      return;
    }
    selection = Object.freeze({
      generation,
      status: 'loading',
      location: picked,
      clickedLocation: picked,
      highwaySnap: null,
      error: null,
    });
    Promise.resolve(onLocationSelected(picked, {
      source: 'user-selected-anchor',
      clickedLocation: picked,
    })).then((result) => {
      if (generation !== selectionGeneration) return;
      selection = Object.freeze({
        status: result ? 'playable' : 'superseded',
        generation,
        location: picked,
        clickedLocation: picked,
        highwaySnap: null,
        error: null,
      });
    }).catch((error) => {
      if (generation !== selectionGeneration) return;
      selection = Object.freeze({
        generation,
        status: 'unavailable',
        location: picked,
        clickedLocation: picked,
        highwaySnap: null,
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }, Cesium.ScreenSpaceEventType?.LEFT_CLICK);

  function requestRender() {
    if (!viewer.isDestroyed?.()) viewer.scene.requestRender?.();
  }

  function replaceTerrainProvider() {
    const previousProvider = terrainProvider;
    const generation = ++terrainGeneration;
    terrainTelemetry = null;
    terrainProvider = terrainProviderFactory(Cesium, {
      maximumTileRequests: ROADVECTOR_OVERVIEW_MAXIMUM_TERRAIN_TILES,
      onTelemetry(telemetry) {
        if (disposed || generation !== terrainGeneration) return;
        terrainTelemetry = Object.freeze({ ...telemetry });
      },
    });
    viewer.terrainProvider = terrainProvider;
    previousProvider?.wxglobe?.abort?.();
  }

  function setLocalMarker(nextLocation) {
    viewer.entities.removeById?.('roadvector-local-player');
    viewer.entities.add({
      id: 'roadvector-local-player',
      name: 'Selected RoadVector region',
      position: Cesium.Cartesian3.fromDegrees(nextLocation.longitude, nextLocation.latitude, 50_000),
      point: {
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString('#34ff73'),
        outlineWidth: 2,
        pixelSize: 10,
      },
      properties: {
        kind: 'selected-roadvector-region',
        source: locationSource,
      },
    });
  }

  function setPeerEntities(nextPlayers) {
    const nextIds = new Set(nextPlayers.map((player) => player.peerId));
    for (const [peerId, entity] of remoteEntities) {
      if (nextIds.has(peerId)) continue;
      viewer.entities.remove(entity);
      remoteEntities.delete(peerId);
    }
    for (const player of nextPlayers) {
      let entity = remoteEntities.get(player.peerId);
      if (!entity) {
        entity = viewer.entities.add({
          id: `roadvector-remote-player-${player.peerId}`,
          name: 'Live RoadVector player (coarse location)',
          position: Cesium.Cartesian3.fromDegrees(player.longitude, player.latitude, 50_000),
          point: {
            color: Cesium.Color.fromCssColorString('#ff334f'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1,
            pixelSize: 12,
          },
          properties: {
            kind: 'live-roadvector-player',
            peerId: player.peerId,
            precisionDegrees: player.precisionDegrees,
            colorPolicy: 'fixed-red',
          },
        });
        remoteEntities.set(player.peerId, entity);
      } else {
        entity.position = Cesium.Cartesian3.fromDegrees(player.longitude, player.latitude, 50_000);
      }
    }
    requestRender();
  }

  async function setLocation(nextLocation, { source = 'manual' } = {}) {
    if (disposed) throw new Error('RoadVector overview runtime is disposed.');
    location = normalizeOverviewLocation(nextLocation);
    locationSource = source;
    replaceTerrainProvider();
    setLocalMarker(location);
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        location.longitude,
        location.latitude,
        ROADVECTOR_OVERVIEW_CAMERA_HEIGHT_METERS,
      ),
      orientation: {
        heading: 0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0,
      },
    });
    requestRender();

    roadAbort?.abort();
    removeImageryLayer(viewer, roadLayer);
    roadProvider?.destroy?.();
    roadLayer = null;
    roadProvider = null;
    roadTelemetry = null;
    roadError = null;
    roadAbort = new AbortController();
    const generation = ++roadGeneration;
    const bounds = overviewTileWindowBounds(location, {
      zoom: ROADVECTOR_OVERVIEW_ROAD_ZOOM,
      windowSize: 5,
    });
    roadBounds = bounds;
    const allowedTileKeys = centeredOverviewTiles(location, {
      zoom: ROADVECTOR_OVERVIEW_ROAD_ZOOM,
      windowSize: 5,
    }).map((tile) => `${tile.z}/${tile.x}/${tile.y}`);
    const rectangle = Cesium.Rectangle.fromDegrees(
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north,
    );
    try {
      const provider = await shortbreadProviderLoader(Cesium, {
        fetchImpl,
        signal: roadAbort.signal,
        rectangle,
        allowedTileKeys,
        minimumLevel: ROADVECTOR_OVERVIEW_ROAD_ZOOM,
        maximumLevel: ROADVECTOR_OVERVIEW_ROAD_ZOOM,
        maximumCachedTiles: ROADVECTOR_OVERVIEW_MAXIMUM_TILES,
        maximumTileBytes: ROADVECTOR_OVERVIEW_MAXIMUM_TILE_BYTES,
        maximumTotalBytes: ROADVECTOR_OVERVIEW_MAXIMUM_TOTAL_BYTES,
        maximumRenderedVertices: ROADVECTOR_OVERVIEW_MAXIMUM_VERTICES,
        commandFilter: isRoadvectorOverviewCommand,
        onTelemetry(telemetry) {
          if (disposed || generation !== roadGeneration) return;
          roadTelemetry = Object.freeze({ ...telemetry });
        },
      });
      if (disposed || generation !== roadGeneration || roadAbort.signal.aborted) {
        provider.destroy?.();
        return null;
      }
      roadProvider = provider;
      roadLayer = viewer.imageryLayers.addImageryProvider(provider);
      requestRender();
      return provider;
    } catch (error) {
      if (roadAbort.signal.aborted || disposed || generation !== roadGeneration) return null;
      roadError = error instanceof Error ? error.message : String(error);
      return null;
    }
  }

  function publishLocation(nextLocation, { source = 'manual' } = {}) {
    const published = normalizeOverviewLocation(nextLocation);
    presence.setLocation(published, { source, mode });
    players = presence.getSnapshot();
    return players.publishingLocation;
  }

  function clearPublishedLocation() {
    presence.clearLocation();
    players = presence.getSnapshot();
  }

  function setMode(nextMode) {
    if (!['overview', 'ride'].includes(nextMode)) {
      throw new RangeError('RoadVector display mode must be overview or ride.');
    }
    mode = nextMode;
    presence.setMode(mode);
    container.hidden = mode !== 'overview';
    container.inert = mode !== 'overview';
    container.setAttribute?.('aria-hidden', String(mode !== 'overview'));
    if (mode === 'overview') {
      viewer.resize?.();
      requestRender();
    }
  }

  function update() {
    players = presence.getSnapshot();
    const signature = players.players
      .map((player) => `${player.peerId}:${player.longitude}:${player.latitude}:${player.mode}`)
      .join('|');
    if (signature !== peerSignature) {
      setPeerEntities(players.players);
      peerSignature = signature;
    }
  }

  function getStatus() {
    const terrainStatus = terrainStatusFromTelemetry(terrainTelemetry);
    const roadStatus = roadError ? 'unavailable' : roadStatusFromTelemetry(roadTelemetry);
    return Object.freeze({
      schemaVersion: 'peercompute.roadvector.hemisphere-overview.v1',
      ready: true,
      mode,
      engine: 'CesiumJS',
      engineVersion: String(Cesium.VERSION ?? 'unknown'),
      renderingBasis: 'cesium-globe',
      renderedFrames,
      location: location ? { ...location } : null,
      locationSource,
      scale: Object.freeze({
        hemisphereDiameterKilometers: 12_742,
        localRegionDiameterMeters: 2_400,
        localWorldUnits: 'meters',
        geospatialCoordinates: 'WGS84/ECEF via Cesium',
        transition: 'discrete',
      }),
      relief: Object.freeze({
        status: terrainStatus,
        error: terrainTelemetry?.lastTerminalError ?? terrainTelemetry?.lastError ?? null,
        sourceId: terrainProvider?.wxglobe?.source ?? 'aws-terrarium',
        providerType: terrainProvider?.wxglobe?.providerType ?? null,
        requested: terrainTelemetry?.requested ?? 0,
        loaded: terrainTelemetry?.loaded ?? 0,
        failed: terrainTelemetry?.terminalFailures ?? 0,
        maximumTiles: ROADVECTOR_OVERVIEW_MAXIMUM_TERRAIN_TILES,
        uniqueTiles: terrainTelemetry?.sourceTilesRequested ?? terrainTelemetry?.uniqueTileRequests ?? 0,
        requestLimitExceeded: false,
      }),
      roads: Object.freeze({
        status: roadStatus,
        error: roadError ?? roadTelemetry?.lastError ?? null,
        sourceId: 'osm-shortbread',
        coverage: 'regional-major-roads-only',
        completeHemisphereCoverage: false,
        zoom: ROADVECTOR_OVERVIEW_ROAD_ZOOM,
        selectedTiles: roadBounds?.selectedTiles ?? 0,
        requestedTiles: roadTelemetry?.requested ?? 0,
        loadedTiles: roadTelemetry?.loaded ?? 0,
        responseBytes: roadTelemetry?.responseBytes ?? 0,
        renderedRoads: roadTelemetry?.roadCommands ?? 0,
        renderedVertices: roadTelemetry?.renderedVertices ?? 0,
        bounds: roadBounds ? { ...roadBounds } : null,
      }),
      federalHighways: Object.freeze({
        status: federalHighwayError
          ? 'unavailable'
          : federalHighwayTelemetry?.status ?? (federalHighwayProvider ? 'loading' : 'loading'),
        error: federalHighwayError ?? federalHighwayTelemetry?.lastError ?? null,
        sourceId: 'fhwa-national-highway-system',
        authority: 'Federal Highway Administration',
        publisher: 'U.S. DOT Bureau of Transportation Statistics',
        datasetVersion: federalHighwayTelemetry?.version ?? null,
        sourceRecordCount: federalHighwayTelemetry?.sourceRecordCount ?? null,
        retainedRecordCount: federalHighwayTelemetry?.retainedRecordCount ?? null,
        availableTiles: federalHighwayTelemetry?.availableTiles ?? null,
        loadedTiles: federalHighwayTelemetry?.loaded ?? 0,
        responseBytes: federalHighwayTelemetry?.responseBytes ?? 0,
        renderedRoads: federalHighwayTelemetry?.renderedRoads ?? 0,
        renderedVertices: federalHighwayTelemetry?.renderedVertices ?? 0,
        coverage: '50 states, District of Columbia, and Puerto Rico',
        includesAlaska: federalHighwayTelemetry?.includesAlaska === true,
        currentSourceSnapshot: Boolean(
          federalHighwayProvider
          && !federalHighwayError
          && federalHighwayTelemetry?.version === ROADVECTOR_FEDERAL_HIGHWAY_VERSION
          && federalHighwayTelemetry?.includesAlaska === true
        ),
        geometryExact: false,
        displayOnly: true,
        navigationGrade: false,
        metadataPath: `data/fhwa-nhs/${ROADVECTOR_FEDERAL_HIGHWAY_VERSION}/source-metadata.xml`,
      }),
      selection,
      players,
      renderer: Object.freeze({
        schemaVersion: 'peercompute.roadvector.cesium-overview-renderer.v1',
        worldUnits: 'WGS84/ECEF',
        materialType: topoMaterial?.type ?? 'ElevationContour',
        imageryLayerCount: viewer.imageryLayers.length,
        terrainTilesLoaded: Boolean(viewer.scene.globe.tilesLoaded),
        cameraHeightMeters: ROADVECTOR_OVERVIEW_CAMERA_HEIGHT_METERS,
        remotePlayerCount: players.remotePlayerCount,
        remotePlayerColor: '#ff334f',
        localScaleTransition: 'discrete',
      }),
    });
  }

  function resize() {
    if (disposed || viewer.isDestroyed?.()) return;
    viewer.resize?.();
    requestRender();
  }

  function render() {
    if (disposed || mode !== 'overview' || viewer.isDestroyed?.()) return false;
    viewer.render?.();
    return true;
  }

  async function dispose() {
    if (disposed) return;
    disposed = true;
    screenSpaceHandler?.destroy?.();
    presenceAbort.abort();
    federalHighwayAbort.abort();
    roadAbort?.abort();
    removeImageryLayer(viewer, federalHighwayLayer);
    federalHighwayProvider?.destroy?.();
    federalHighwayLayer = null;
    federalHighwayProvider = null;
    removeImageryLayer(viewer, roadLayer);
    roadProvider?.destroy?.();
    roadLayer = null;
    roadProvider = null;
    await presence.dispose();
    removePostRender();
    terrainProvider?.wxglobe?.abort?.();
    if (!viewer.isDestroyed?.()) viewer.destroy();
  }

  return Object.freeze({
    setLocation,
    publishLocation,
    clearPublishedLocation,
    setMode,
    update,
    getStatus,
    resize,
    render,
    dispose,
    get viewer() { return viewer; },
  });
}
