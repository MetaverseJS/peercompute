import assert from 'node:assert/strict';
import test from 'node:test';

import { ShortbreadImageryProvider } from '@peercompute/geo-core';
import {
  createRoadvectorOverviewRuntime,
  isRoadvectorOverviewCommand,
} from '../../src/overview/overviewRuntime.js';

const renderedMvtFixture = Buffer.from(
  'GjR4AgoHc3RyZWV0cxISCAESAgAAGAIiCAkAgCAK/j8AGgRraW5kIgoKCG1vdG9yd2F5KIAgGih4AgoJYnVpbGRpbmdzEhYIAhgDIhAJ0A/QDxrQDwAA0A/PDwAPKIAg',
  'base64',
);

const tileJson = Object.freeze({
  tilejson: '3.0.0',
  name: 'Shortbread',
  minzoom: 0,
  maxzoom: 14,
  tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
  vector_layers: [{ id: 'streets' }, { id: 'buildings' }],
});

class FakeEvent {
  raiseEvent(error) { this.error = error; }
}

class FakeCredit {
  constructor(html, show) {
    this.html = html;
    this.show = show;
  }
}

class FakeTilingScheme {
  constructor() { this.rectangle = { global: true }; }
}

function fakeCanvas() {
  const context = {
    beginPath() {},
    clearRect() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    fill() {},
    stroke() {},
  };
  return { width: 0, height: 0, getContext: () => context };
}

test('bounded shared Cesium imagery fetches only allowlisted z5 tiles and renders major roads', async () => {
  let fetches = 0;
  const telemetry = [];
  const Cesium = {
    Event: FakeEvent,
    Credit: FakeCredit,
    WebMercatorTilingScheme: FakeTilingScheme,
  };
  const provider = new ShortbreadImageryProvider(Cesium, {
    tileJson,
    minimumLevel: 5,
    maximumLevel: 5,
    allowedTileKeys: ['5/5/9'],
    maximumCachedTiles: 25,
    maximumTileBytes: 1024,
    maximumTotalBytes: 1024,
    maximumRenderedVertices: 100,
    commandFilter: isRoadvectorOverviewCommand,
    fetchImpl: async () => {
      fetches += 1;
      return new Response(renderedMvtFixture, {
        status: 200,
        headers: { 'content-type': 'application/vnd.mapbox-vector-tile' },
      });
    },
    canvasFactory: fakeCanvas,
    onTelemetry: (value) => telemetry.push(value),
  });

  await provider.requestImage(5, 9, 5);
  await provider.requestImage(6, 9, 5);
  const status = telemetry.at(-1);
  assert.equal(fetches, 1);
  assert.equal(provider.minimumLevel, 5);
  assert.equal(provider.maximumLevel, 5);
  assert.equal(status.loaded, 1);
  assert.equal(status.roadCommands, 1);
  assert.equal(status.buildingCommands, 0);
  assert.equal(status.renderedCommands, 1);
  assert.equal(status.renderedVertices, 2);
  assert.equal(status.filteredTileRequests, 1);
  assert.ok(status.responseBytes <= 1024);
  provider.destroy();
});

function createFakeCesium() {
  class Color {
    constructor(value) { this.value = value; }
    static fromCssColorString(value) { return new Color(value); }
  }
  Color.BLACK = new Color('#000000');
  Color.WHITE = new Color('#ffffff');
  return {
    VERSION: '1.144.0',
    Color,
    Math: { PI_OVER_TWO: Math.PI / 2 },
    Cartesian3: {
      fromDegrees(longitude, latitude, height = 0) {
        return { longitude, latitude, height };
      },
    },
    Rectangle: {
      fromDegrees(west, south, east, north) {
        return { west, south, east, north };
      },
    },
  };
}

function createFakeViewer(options) {
  const entityById = new Map();
  const layers = [];
  let destroyed = false;
  const canvasAttributes = new Map();
  const postRenderListeners = new Set();
  const viewer = {
    options,
    scene: {
      backgroundColor: null,
      globe: {
        baseColor: null,
        material: null,
        tilesLoaded: true,
      },
      fog: {},
      skyAtmosphere: {},
      skyBox: {},
      sun: {},
      moon: {},
      canvas: {
        tabIndex: -1,
        classList: { add(value) { this.value = value; } },
        setAttribute(name, value) { canvasAttributes.set(name, value); },
      },
      requestRender() { viewer.requestRenderCount += 1; },
      postRender: {
        addEventListener(listener) {
          postRenderListeners.add(listener);
          return () => postRenderListeners.delete(listener);
        },
      },
    },
    camera: {
      setView(value) { viewer.cameraView = value; },
    },
    entities: {
      add(value) {
        const entity = { ...value };
        entityById.set(entity.id, entity);
        return entity;
      },
      remove(entity) { return entityById.delete(entity.id); },
      removeById(id) { return entityById.delete(id); },
      getById(id) { return entityById.get(id); },
    },
    imageryLayers: {
      get length() { return layers.length; },
      removeAll() { layers.length = 0; },
      addImageryProvider(provider) {
        const layer = { provider };
        layers.push(layer);
        return layer;
      },
      remove(layer) {
        const index = layers.indexOf(layer);
        if (index >= 0) layers.splice(index, 1);
      },
    },
    requestRenderCount: 0,
    renderCount: 0,
    resizeCount: 0,
    resize() { this.resizeCount += 1; },
    render() {
      this.renderCount += 1;
      for (const listener of postRenderListeners) listener();
    },
    isDestroyed() { return destroyed; },
    destroy() { destroyed = true; },
  };
  return viewer;
}

test('Cesium overview owns terrain, roads, camera, mode, players, and teardown', async () => {
  const Cesium = createFakeCesium();
  const container = {
    hidden: false,
    attributes: new Map(),
    setAttribute(name, value) { this.attributes.set(name, value); },
  };
  let viewer = null;
  let terrainAborted = false;
  const roadProviders = [];
  const terrainProviders = [];
  const manager = {
    async initialize() {},
    async connect() {},
    async disconnect() {},
    getConnectedPeers() {
      return [{
        peerId: 'remote',
        lastSeen: Date.now(),
        capabilities: {
          roadvector: {
            schema: 'peercompute.roadvector.presence.v1',
            longitudeCell: -149.8,
            latitudeCell: 61.3,
            precisionDegrees: 0.1,
            mode: 'overview',
          },
        },
      }];
    },
  };
  const runtime = createRoadvectorOverviewRuntime({
    Cesium,
    container,
    fetchImpl: async () => new Response(
      JSON.stringify({ bootstrapPeers: ['/dns4/relay.example/tcp/443/wss'] }),
      { headers: { 'content-type': 'application/json' } },
    ),
    presenceOptions: { networkManagerFactory: async () => manager },
    viewerFactory(_Cesium, _container, options) {
      viewer = createFakeViewer(options);
      return viewer;
    },
    terrainProviderFactory(_Cesium, { onTelemetry, maximumTileRequests }) {
      assert.equal(maximumTileRequests, 128);
      onTelemetry({ requested: 2, loaded: 1, terminalFailures: 0, uniqueTileRequests: 2 });
      const provider = {
        aborted: false,
        wxglobe: {
          providerType: 'CappedHeightmapTerrainProvider',
          abort() {
            provider.aborted = true;
            terrainAborted = true;
          },
        },
      };
      terrainProviders.push(provider);
      return provider;
    },
    topoMaterialFactory: () => ({ type: 'ElevationContour' }),
    async shortbreadProviderLoader(_Cesium, options) {
      assert.equal(options.minimumLevel, 5);
      assert.equal(options.maximumLevel, 5);
      assert.equal(options.allowedTileKeys.length, 25);
      assert.equal(options.commandFilter({ kind: 'road', category: 'motorway' }), true);
      assert.equal(options.commandFilter({ kind: 'building' }), false);
      options.onTelemetry({
        requested: 25,
        loaded: 25,
        failed: 0,
        responseBytes: 4096,
        roadCommands: 25,
        renderedVertices: 50,
      });
      const provider = { destroyed: false, destroy() { this.destroyed = true; } };
      roadProviders.push(provider);
      return provider;
    },
  });

  await runtime.setLocation({ longitude: -149.9, latitude: 61.2 }, { source: 'browser-geolocation' });
  for (let attempt = 0; attempt < 10 && runtime.getStatus().players.remotePlayerCount === 0; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    runtime.update();
  }
  assert.equal(runtime.render(), true);
  let status = runtime.getStatus();
  assert.equal(status.engine, 'CesiumJS');
  assert.equal(status.renderingBasis, 'cesium-globe');
  assert.equal(status.relief.status, 'current');
  assert.equal(status.relief.providerType, 'CappedHeightmapTerrainProvider');
  assert.equal(status.roads.status, 'current');
  assert.equal(status.roads.selectedTiles, 25);
  assert.equal(status.roads.renderedRoads, 25);
  assert.equal(status.roads.renderedVertices, 50);
  assert.equal(status.players.remotePlayerCount, 1);
  assert.equal(status.renderer.remotePlayerColor, '#ff334f');
  assert.equal(viewer.entities.getById('roadvector-remote-player-remote').point.color.value, '#ff334f');
  assert.equal(viewer.entities.getById('roadvector-remote-player-remote').position.height, 50_000);
  assert.equal(
    viewer.entities.getById('roadvector-remote-player-remote').point.disableDepthTestDistance,
    undefined,
    'remote players must not render through the far side of the Cesium globe',
  );
  assert.equal(viewer.options.baseLayer, false);
  assert.equal(viewer.options.useDefaultRenderLoop, false);
  assert.equal(viewer.renderCount, 1);
  assert.equal(status.renderedFrames, 1);

  runtime.setMode('ride');
  assert.equal(container.hidden, true);
  assert.equal(runtime.render(), false);
  runtime.setMode('overview');
  assert.equal(container.hidden, false);
  assert.equal(runtime.render(), true);

  await runtime.setLocation({ longitude: -122.4, latitude: 37.8 }, { source: 'manual' });
  assert.equal(roadProviders[0].destroyed, true, 'location replacement must destroy the prior provider');
  assert.equal(terrainProviders[0].aborted, true, 'location replacement must reset the terrain budget');
  status = runtime.getStatus();
  assert.equal(status.location.longitude, -122.4);

  await runtime.dispose();
  await runtime.dispose();
  assert.equal(roadProviders[1].destroyed, true);
  assert.equal(terrainAborted, true);
  assert.equal(viewer.isDestroyed(), true);
});
