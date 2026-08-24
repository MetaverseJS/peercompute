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

const renderedMvtFixture = Buffer.from(
  'Gh8KB3N0cmVldHMSDwgBGAIiCQmACIAgCoAwACiAIHgCGigKCWJ1aWxkaW5ncxIWCAIYAyIQCYAQgBAagBAAAIAQ/w8ADyiAIHgC',
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

test('renders buildings before neon road commands with even-odd holes', () => {
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
  assert.ok(calls.some((call) => call[0] === 'fill' && call[1] === 'evenodd'));
  assert.equal(calls.filter((call) => call[0] === 'stroke').length, 2);
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
