import assert from 'node:assert/strict';
import test from 'node:test';

import {
  projectLonLatToTilePixel,
  renderShortbreadCommands,
  ShortbreadImageryProvider
} from '../src/layers/shortbreadImagery.js';

const tileJson = {
  tilejson: '3.0.0',
  name: 'Shortbread',
  minzoom: 0,
  maxzoom: 14,
  tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
  vector_layers: [{ id: 'streets' }, { id: 'buildings' }]
};

const waterTileJson = {
  ...tileJson,
  vector_layers: [
    { id: 'ocean' },
    { id: 'water_polygons' },
    { id: 'streets' },
    { id: 'buildings' }
  ]
};

const renderedMvtFixture = Buffer.from(
  'Gh8KB3N0cmVldHMSDwgBGAIiCQmACIAgCoAwACiAIHgCGigKCWJ1aWxkaW5ncxIWCAIYAyIQCYAQgBAagBAAAIAQ/w8ADyiAIHgC',
  'base64'
);

const waterMvtFixture = Buffer.from(
  'Gjd4AgoFb2NlYW4ogCASGggBEgIAABgDIhAJ5AHWMRoAhQ64PAAAhg4PGgRraW5kIgcKBW9jZWFuGlB4AgoOd2F0ZXJfcG9seWdvbnMogCASHAgCEgQAAAEBGAMiEAm4HOQhGgDHA5AHAADIAw8aBGtpbmQaCHdheV9hcmVhIgYKBGxha2UiAyjSCRoneAIKCWJ1aWxkaW5ncyiAIBIVCAMSABgDIg0JqiWcHhoAFxgAABgPGjV4AgoHc3RyZWV0cyiAIBITCAQSAgAAGAIiCQnWGrAcCtQKABoEa2luZCIKCghtb3RvcndheQ==',
  'base64'
);

class Event { raiseEvent(error) { this.error = error; } }
class Credit { constructor(html, show) { this.html = html; this.show = show; } }
class WebMercatorTilingScheme { constructor() { this.rectangle = {}; } }
const Cesium = { Event, Credit, WebMercatorTilingScheme };

test('projects WGS84 positions onto exact Web Mercator tile pixels', () => {
  assert.deepEqual(projectLonLatToTilePixel([0, 0], { x: 0, y: 0, z: 0, size: 512 }), [256, 256]);
  const topLeft = projectLonLatToTilePixel([-180, 85.0511287798066], { x: 0, y: 0, z: 0, size: 512 });
  assert.ok(Math.abs(topLeft[0]) < 1e-9);
  assert.ok(Math.abs(topLeft[1]) < 1e-6);
  const westTileEdge = projectLonLatToTilePixel([0, 0], { x: 0, y: 1, z: 1, size: 512 });
  const eastTileEdge = projectLonLatToTilePixel([0, 0], { x: 1, y: 1, z: 1, size: 512 });
  assert.ok(Math.abs(westTileEdge[0] - 512) < 1e-9);
  assert.ok(Math.abs(eastTileEdge[0]) < 1e-9);
  assert.ok(Math.abs(westTileEdge[1] - eastTileEdge[1]) < 1e-9);
});

test('provider evicts the least-recently-used decoded tile at its hard cache cap', async () => {
  let fetches = 0;
  const telemetry = [];
  const context = {
    beginPath() {}, clearRect() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}
  };
  const provider = new ShortbreadImageryProvider(Cesium, {
    tileJson,
    maximumCachedTiles: 2,
    fetchImpl: async () => {
      fetches += 1;
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/vnd.mapbox-vector-tile' }),
        arrayBuffer: async () => new ArrayBuffer(0)
      };
    },
    canvasFactory: () => ({ width: 0, height: 0, getContext: () => context }),
    onTelemetry: (value) => telemetry.push(value)
  });
  const first = await provider.requestImage(0, 0, 1);
  await provider.requestImage(1, 0, 1);
  assert.equal(await provider.requestImage(0, 0, 1), first, 'cache hit refreshes LRU order');
  await provider.requestImage(0, 1, 1);
  await provider.requestImage(1, 0, 1);
  assert.equal(fetches, 4, 'the least-recently-used second tile was fetched again');
  assert.equal(telemetry.at(-1).cached, 2);
  provider.destroy();
});

test('renders flat blue water beneath buildings and roads without an outline or alpha leakage', () => {
  const calls = [];
  const context = new Proxy({}, {
    get(target, property) {
      if (property in target) return target[property];
      if (['beginPath', 'clearRect', 'moveTo', 'lineTo', 'closePath', 'fill', 'stroke'].includes(property)) {
        return (...args) => calls.push([property, ...args]);
      }
      return undefined;
    },
    set(target, property, value) {
      target[property] = value;
      calls.push(['set', property, value]);
      return true;
    }
  });
  renderShortbreadCommands(context, [
    {
      kind: 'water',
      geometry: { type: 'Polygon', coordinates: [[[-2, -2], [2, -2], [2, 2], [-2, -2]]] },
      fill: 'rgba(0, 128, 255, 0.5)',
      stroke: null,
      width: 0,
      opacity: 0.5
    },
    {
      kind: 'building',
      geometry: { type: 'Polygon', coordinates: [[[-1, -1], [1, -1], [1, 1], [-1, -1]]] },
      fill: 'rgba(0,0,255,.2)',
      stroke: '#00f',
      width: 1
    },
    {
      kind: 'road',
      geometry: { type: 'LineString', coordinates: [[-1, 0], [1, 0]] },
      stroke: '#ff0',
      width: 3
    }
  ], { x: 0, y: 0, z: 0, size: 512 });
  const fillStyles = calls.filter((call) => call[0] === 'set' && call[1] === 'fillStyle');
  assert.deepEqual(fillStyles.map((call) => call[2]), [
    'rgba(0, 128, 255, 0.5)',
    'rgba(0,0,255,.2)'
  ]);
  assert.equal(calls.filter((call) => call[0] === 'fill' && call[1] === 'evenodd').length, 2);
  assert.equal(calls.filter((call) => call[0] === 'stroke').length, 2);
  assert.ok(calls.findIndex((call) => call[0] === 'fillStyle' || (call[0] === 'set' && call[2] === 'rgba(0, 128, 255, 0.5)'))
    < calls.findIndex((call) => call[0] === 'set' && call[2] === 'rgba(0,0,255,.2)'));
  assert.ok(!calls.some((call) => call[0] === 'set' && call[1] === 'globalAlpha'));
});

test('provider coalesces and caches the same decoded transparent tile', async () => {
  let fetches = 0;
  const telemetry = [];
  const context = {
    beginPath() {}, clearRect() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}
  };
  const provider = new ShortbreadImageryProvider(Cesium, {
    tileJson,
    fetchImpl: async () => {
      fetches += 1;
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/vnd.mapbox-vector-tile' }),
        arrayBuffer: async () => new ArrayBuffer(0)
      };
    },
    canvasFactory: () => ({ width: 0, height: 0, getContext: () => context }),
    onTelemetry: (value) => telemetry.push(value)
  });
  const [first, second] = await Promise.all([provider.requestImage(0, 0, 0), provider.requestImage(0, 0, 0)]);
  assert.equal(first, second);
  assert.equal(fetches, 1);
  assert.equal(await provider.requestImage(0, 0, 0), first);
  assert.equal(fetches, 1);
  assert.equal(telemetry.at(-1).loaded, 1);
  assert.equal(telemetry.at(-1).emptyTiles, 1);
  assert.equal(telemetry.at(-1).renderedCommands, 0);
  provider.destroy();
});

test('provider telemetry proves both required Shortbread categories were rendered', async () => {
  const telemetry = [];
  const context = {
    beginPath() {}, clearRect() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}
  };
  const provider = new ShortbreadImageryProvider(Cesium, {
    tileJson,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/vnd.mapbox-vector-tile' }),
      arrayBuffer: async () => renderedMvtFixture.buffer.slice(
        renderedMvtFixture.byteOffset,
        renderedMvtFixture.byteOffset + renderedMvtFixture.byteLength
      )
    }),
    canvasFactory: () => ({ width: 0, height: 0, getContext: () => context }),
    onTelemetry: (value) => telemetry.push(value)
  });
  await provider.requestImage(0, 0, 0);
  assert.equal(telemetry.at(-1).loaded, 1);
  assert.equal(telemetry.at(-1).roadCommands, 1);
  assert.equal(telemetry.at(-1).buildingCommands, 1);
  assert.equal(telemetry.at(-1).renderedCommands, 2);
  assert.equal(telemetry.at(-1).emptyTiles, 0);
  provider.destroy();
});

test('Earth water mode decodes ocean and inland bodies with exact flat-blue telemetry', async () => {
  const telemetry = [];
  const calls = [];
  const context = new Proxy({}, {
    get(target, property) {
      if (property in target) return target[property];
      if (['beginPath', 'clearRect', 'moveTo', 'lineTo', 'closePath', 'fill', 'stroke'].includes(property)) {
        return (...args) => calls.push([property, ...args]);
      }
      return undefined;
    },
    set(target, property, value) {
      target[property] = value;
      calls.push(['set', property, value]);
      return true;
    }
  });
  const provider = new ShortbreadImageryProvider(Cesium, {
    tileJson: waterTileJson,
    includeWater: true,
    maximumTotalBytes: 2 * 1024 * 1024,
    maximumRenderedVertices: 10_000,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/vnd.mapbox-vector-tile' }),
      arrayBuffer: async () => waterMvtFixture.buffer.slice(
        waterMvtFixture.byteOffset,
        waterMvtFixture.byteOffset + waterMvtFixture.byteLength
      )
    }),
    canvasFactory: () => ({ width: 0, height: 0, getContext: () => context }),
    onTelemetry: (value) => telemetry.push(value)
  });

  await provider.requestImage(0, 0, 0);
  const state = telemetry.at(-1);
  assert.equal(state.loaded, 1);
  assert.equal(state.waterEnabled, true);
  assert.equal(state.waterCommands, 2);
  assert.equal(state.oceanCommands, 1);
  assert.equal(state.inlandWaterCommands, 1);
  assert.ok(state.waterVertices > 0);
  assert.equal(state.roadCommands, 1);
  assert.equal(state.buildingCommands, 1);
  assert.equal(state.renderedCommands, 4);
  assert.equal(state.aggregateBudgetScope, 'provider-session-lifetime');
  assert.equal(state.waterStyle.schemaVersion, 'peercompute.geo.shortbread-water-style.v1');
  assert.equal(state.waterStyle.color, '#0080ff');
  assert.equal(state.waterStyle.opacity, 0.5);
  assert.equal(state.waterStyle.surface, 'flat');
  assert.equal(state.waterStyle.geometry, 'non-extruded-terrain-draped-imagery');
  assert.equal(calls.filter((call) => call[0] === 'stroke').length, 2);
  provider.destroy();
});

test('shared provider keeps water disabled unless the consumer opts in', async () => {
  const telemetry = [];
  const context = {
    beginPath() {}, clearRect() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}
  };
  const provider = new ShortbreadImageryProvider(Cesium, {
    tileJson: waterTileJson,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/vnd.mapbox-vector-tile' }),
      arrayBuffer: async () => waterMvtFixture.buffer.slice(
        waterMvtFixture.byteOffset,
        waterMvtFixture.byteOffset + waterMvtFixture.byteLength
      )
    }),
    canvasFactory: () => ({ width: 0, height: 0, getContext: () => context }),
    onTelemetry: (value) => telemetry.push(value)
  });

  await provider.requestImage(0, 0, 0);
  assert.equal(telemetry.at(-1).waterEnabled, false);
  assert.equal(telemetry.at(-1).waterCommands, 0);
  assert.equal(telemetry.at(-1).waterVertices, 0);
  assert.equal(telemetry.at(-1).waterStyle, null);
  assert.equal(telemetry.at(-1).roadCommands, 1);
  assert.equal(telemetry.at(-1).buildingCommands, 1);
  provider.destroy();
});
