import { createRoadvectorGlobeRenderer } from './globeRenderer.js';
import { normalizeOverviewLocation } from './globeMath.js';
import { createRoadvectorPresenceRuntime } from './playerPresence.js';
import { loadOverviewRelief } from './reliefLoader.js';
import { loadOverviewRoadWindow } from './shortbreadRoadWindow.js';

export function createRoadvectorOverviewRuntime({
  THREE,
  scene,
  camera,
  fetchImpl = globalThis.fetch,
  presenceOptions = {},
} = {}) {
  const globe = createRoadvectorGlobeRenderer(THREE, { scene, camera });
  const presence = createRoadvectorPresenceRuntime({ fetchImpl, ...presenceOptions });
  const reliefAbort = new AbortController();
  let roadAbort = null;
  let roadGeneration = 0;
  let mode = 'overview';
  let location = null;
  let locationSource = null;
  let disposed = false;
  let relief = { status: 'loading', error: null, data: null };
  let roads = { status: 'idle', error: null, data: null };
  let players = presence.getSnapshot();
  let peerSignature = '';

  const reliefPromise = loadOverviewRelief({ fetchImpl, signal: reliefAbort.signal })
    .then((data) => {
      if (disposed) return null;
      globe.setRelief(data);
      relief = { status: 'current', error: null, data };
      return data;
    })
    .catch((error) => {
      if (reliefAbort.signal.aborted) return null;
      relief = { status: 'unavailable', error: error instanceof Error ? error.message : String(error), data: null };
      return null;
    });

  presence.start({ signal: reliefAbort.signal }).then((snapshot) => {
    players = snapshot;
  }).catch(() => {});

  async function setLocation(nextLocation, { source = 'manual' } = {}) {
    if (disposed) throw new Error('RoadVector overview runtime is disposed.');
    location = normalizeOverviewLocation(nextLocation);
    locationSource = source;
    globe.setLocation(location);
    presence.setLocation(location, { source, mode });
    roadAbort?.abort();
    roadAbort = new AbortController();
    const generation = ++roadGeneration;
    roads = { status: 'loading', error: null, data: null };
    try {
      const data = await loadOverviewRoadWindow(location, {
        fetchImpl,
        signal: roadAbort.signal,
      });
      if (disposed || generation !== roadGeneration || roadAbort.signal.aborted) return null;
      globe.setRoads(data);
      roads = { status: 'current', error: null, data };
      return data;
    } catch (error) {
      if (roadAbort.signal.aborted || disposed || generation !== roadGeneration) return null;
      roads = { status: 'unavailable', error: error instanceof Error ? error.message : String(error), data: null };
      return null;
    }
  }

  function setMode(nextMode) {
    if (!['overview', 'ride'].includes(nextMode)) throw new RangeError('RoadVector display mode must be overview or ride.');
    mode = nextMode;
    presence.setMode(mode);
  }

  function update(timeMs) {
    globe.update(timeMs);
    players = presence.getSnapshot();
    const signature = players.players.map((player) => `${player.peerId}:${player.longitude}:${player.latitude}:${player.mode}`).join('|');
    if (signature !== peerSignature) {
      globe.setPeers(players.players);
      peerSignature = signature;
    }
  }

  function getStatus() {
    return Object.freeze({
      schemaVersion: 'peercompute.roadvector.hemisphere-overview.v1',
      ready: true,
      mode,
      location: location ? { ...location } : null,
      locationSource,
      scale: Object.freeze({
        hemisphereDiameterKilometers: 12_742,
        localRegionDiameterMeters: 2_400,
        localWorldUnits: 'meters',
        transition: 'discrete',
      }),
      relief: Object.freeze({
        status: relief.status,
        error: relief.error,
        sourceId: relief.data?.sourceId ?? 'noaa-etopo2022',
        width: relief.data?.width ?? null,
        height: relief.data?.height ?? null,
        bytes: relief.data?.bytes ?? null,
      }),
      roads: Object.freeze({
        status: roads.status,
        error: roads.error,
        sourceId: roads.data?.sourceId ?? 'osm-shortbread',
        coverage: roads.data?.geometryCoverage ?? 'regional-major-roads-only',
        completeHemisphereCoverage: false,
        zoom: roads.data?.zoom ?? 5,
        selectedTiles: roads.data?.tileWindow?.selected ?? 0,
        responseBytes: roads.data?.responseBytes ?? 0,
        renderedRoads: roads.data?.renderedRoads ?? 0,
        renderedVertices: roads.data?.renderedVertices ?? 0,
      }),
      players,
      renderer: globe.getStatus(),
    });
  }

  async function dispose() {
    if (disposed) return;
    disposed = true;
    reliefAbort.abort();
    roadAbort?.abort();
    await reliefPromise.catch(() => {});
    await presence.dispose();
    globe.dispose();
  }

  return Object.freeze({ setLocation, setMode, update, getStatus, dispose });
}
