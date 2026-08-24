import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeOverpassRegion } from '../../../services/geodata/src/osm/normalize.js';
import { parseAndSnapBbox } from '../../../services/geodata/src/osm/bbox.js';
import { GEODATA_LIMITS } from '../../../services/geodata/src/config.js';
import { createOverpassFixture } from '../../../services/geodata/test/fixture.js';
import { createDerivedFlatTerrainGrid } from '../src/world/terrainGrid.js';
import {
  createMotorcycleSceneData,
  localizeRoadGraph,
  selectMotorcycleSpawn,
} from '../src/world/sceneData.js';

function envelope() {
  const bbox = parseAndSnapBbox('-0.02,-0.02,0.04,0.04', GEODATA_LIMITS);
  const data = normalizeOverpassRegion(createOverpassFixture(), {
    bbox,
    layers: ['roads', 'buildings'],
    vehicle: 'motorcycle',
    limits: GEODATA_LIMITS,
  });
  return {
    schemaVersion: 'peercompute.geo.osm-region.v1',
    status: 'current',
    source: 'openstreetmap-overpass',
    synthetic: false,
    bbox: { values: bbox.values },
    provenance: {
      attribution: '© OpenStreetMap contributors',
      licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/',
      sourceBaseTimestamp: data.sourceBaseTimestamp,
    },
    data,
  };
}

test('adapts the exact backend envelope into local roads, buildings, and graph', () => {
  const terrain = createDerivedFlatTerrainGrid({ bbox: [-0.02, -0.02, 0.04, 0.04] });
  const scene = createMotorcycleSceneData(envelope(), terrain);
  assert.equal(scene.schemaVersion, 'peercompute.motorcycle.scene-data.v1');
  assert.equal(scene.counts.sourceRoads, 4);
  assert.equal(scene.counts.sourceRoadSegments, 6);
  assert.equal(scene.counts.sourceBuildings, 4);
  assert.ok(scene.roadSegments.length >= 5);
  assert.equal(scene.counts.omittedRoadSegments, 0);
  assert.equal(scene.buildings.length, 4);
  assert.equal(scene.localGraph.nodes.length, 8);
  assert.equal(scene.localGraph.edges.length, 9);
  assert.equal(scene.spawn.source, 'osm-directed-road-edge');
  assert.equal(scene.spawn.navigationGrade, false);
  assert.ok(scene.spawn.position.every(Number.isFinite));
  assert.ok(scene.spawn.orientation.every(Number.isFinite));
  const feetBuilding = scene.buildings.find((building) => building.properties.osmId === '500');
  assert.equal(feetBuilding.heightMeters, 12.192);
  assert.equal(feetBuilding.heightSource, 'source-height');
});

test('local graph keeps shared OSM identifiers and deterministically selects a spawn', () => {
  const source = envelope();
  const terrain = createDerivedFlatTerrainGrid({ bbox: [-0.02, -0.02, 0.04, 0.04] });
  const graph = localizeRoadGraph(source.data.roadGraph, terrain);
  assert.equal(graph.nodeById.get('node/2').localPosition.length, 3);
  const first = selectMotorcycleSpawn(graph);
  const second = selectMotorcycleSpawn(graph);
  assert.deepEqual(first, second);
});

test('fails closed when no usable directed road exists', () => {
  assert.throws(() => selectMotorcycleSpawn({
    schemaVersion: 'peercompute.geo.local-road-graph.v1',
    edges: [],
  }), /no usable motorcycle road segment/i);
});
