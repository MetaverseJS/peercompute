import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';

import { createRoadvectorGlobeRenderer } from '../../src/overview/globeRenderer.js';
import { loadOverviewRelief } from '../../src/overview/reliefLoader.js';
import {
  loadOverviewRoadWindow,
  majorRoadCategory,
} from '../../src/overview/shortbreadRoadWindow.js';

const renderedMvtFixture = Buffer.from(
  'Gh8KB3N0cmVldHMSDwgBGAIiCQmACIAgCoAwACiAIHgCGigKCWJ1aWxkaW5ncxIWCAIYAyIQCYAQgBAagBAAAIAQ/w8ADyiAIHgC',
  'base64',
);

function responseBytes(bytes, type = 'application/octet-stream') {
  return new Response(bytes, { status: 200, headers: { 'content-type': type, 'content-length': String(bytes.byteLength) } });
}

test('global NOAA relief loader decodes one bounded finite BIP grid', async () => {
  const width = 5;
  const height = 3;
  const bytes = new Uint8Array(width * height * 2);
  const view = new DataView(bytes.buffer);
  for (let index = 0; index < width * height; index += 1) view.setInt16(index * 2, index - 7, true);
  let requested = null;
  const relief = await loadOverviewRelief({
    width,
    height,
    fetchImpl: async (url) => {
      requested = new URL(url);
      return responseBytes(bytes);
    },
  });
  assert.equal(requested.searchParams.get('bbox'), '-180,-90,180,90');
  assert.equal(requested.searchParams.get('size'), '5,3');
  assert.equal(relief.heights.length, 15);
  assert.equal(relief.minimumHeightMeters, -7);
  assert.equal(relief.maximumHeightMeters, 7);
  assert.equal(relief.bytes, 30);
});

test('bounded Shortbread window loads at most 25 z5 tiles and filters road classes', async () => {
  const tileJson = {
    tilejson: '3.0.0',
    minzoom: 0,
    maxzoom: 14,
    tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
    vector_layers: [
      { id: 'streets', minzoom: 5, maxzoom: 14 },
      { id: 'buildings', minzoom: 12, maxzoom: 14 },
    ],
  };
  let tileRequests = 0;
  const fetchImpl = async (url) => {
    if (String(url).includes('tilejson.json')) {
      return responseBytes(Buffer.from(JSON.stringify(tileJson)), 'application/json');
    }
    tileRequests += 1;
    return responseBytes(renderedMvtFixture, 'application/vnd.mapbox-vector-tile');
  };
  const window = await loadOverviewRoadWindow({ longitude: -149.9, latitude: 61.2 }, { fetchImpl });
  assert.equal(tileRequests, 25);
  assert.equal(window.tileWindow.selected, 25);
  assert.equal(window.tileWindow.loaded, 25);
  assert.equal(window.completeHemisphereCoverage, false);
  assert.equal(window.geometryCoverage, 'regional-major-roads-only');
  assert.ok(window.responseBytes <= 8 * 1024 * 1024);
  assert.equal(majorRoadCategory({ kind: 'motorway' }), 'motorway');
  assert.equal(majorRoadCategory({ highway: 'primary_link' }), 'primary');
  assert.equal(majorRoadCategory({ kind: 'residential' }), null);
});

test('globe renderer exposes real relief, major roads, and fixed-red live players', () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  const renderer = createRoadvectorGlobeRenderer(THREE, { scene, camera });
  renderer.setLocation({ longitude: -149.9, latitude: 61.2 });
  renderer.setRelief({
    sourceId: 'noaa-etopo2022',
    width: 3,
    height: 2,
    bytes: 12,
    heights: Float32Array.from([0, 100, 0, -50, 500, -100]),
    minimumHeightMeters: -100,
    maximumHeightMeters: 500,
  });
  renderer.setRoads({
    sourceId: 'osm-shortbread',
    geometryCoverage: 'regional-major-roads-only',
    responseBytes: 100,
    zoom: 5,
    tileWindow: { selected: 1 },
    renderedRoads: 1,
    renderedVertices: 2,
    roads: [{ category: 'motorway', coordinates: [[-150, 61], [-149, 61.5]] }],
  });
  renderer.setPeers([{ peerId: 'remote', longitude: -149.8, latitude: 61.3 }]);
  renderer.update(1_000);
  const status = renderer.getStatus();
  assert.equal(status.relief.sourceId, 'noaa-etopo2022');
  assert.equal(status.roads.coverage, 'regional-major-roads-only');
  assert.equal(status.remotePlayerCount, 1);
  assert.equal(status.remotePlayerColor, '#ff334f');
  const marker = scene.getObjectByName('roadvector-live-player-remote');
  assert.equal(marker.material.color.getHex(), 0xff334f);
  renderer.dispose();
  assert.equal(scene.children.length, 0);
});
