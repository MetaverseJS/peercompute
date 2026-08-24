import assert from 'node:assert/strict';
import test from 'node:test';

import { GEODATA_LIMITS } from '../../../services/geodata/src/config.js';
import { parseAndSnapBbox } from '../../../services/geodata/src/osm/bbox.js';
import { normalizeOverpassRegion } from '../../../services/geodata/src/osm/normalize.js';
import { createOverpassFixture } from '../../../services/geodata/test/fixture.js';

import {
  classifyLocalRoad,
  extractLocalOsmCollections,
  normalizeLocalBuilding
} from '../src/layers/localOsm.js';

test('extracts canonical local road, building, graph, count, and provenance fields', () => {
  const roads = { type: 'FeatureCollection', features: [{ id: 'r1' }] };
  const buildings = { type: 'FeatureCollection', features: [{ id: 'b1' }] };
  const graph = { nodes: [{ id: 1 }], edges: [] };
  const result = extractLocalOsmCollections({
    provenance: { id: 'osm-local-region' },
    data: {
      type: 'OsmRegion',
      roads,
      buildings,
      roadGraph: { ...graph, schemaVersion: 'peercompute.geo.road-graph.v1' },
      counts: { roads: 1, buildings: 1 }
    }
  });
  assert.deepEqual(result.roads, roads.features);
  assert.deepEqual(result.buildings, buildings.features);
  assert.deepEqual(result.graph, { ...graph, schemaVersion: 'peercompute.geo.road-graph.v1' });
  assert.deepEqual(result.counts, { roads: 1, buildings: 1 });
  assert.deepEqual(result.provenance, { id: 'osm-local-region' });
});

test('rejects compatibility or malformed collection nesting', () => {
  assert.throws(() => extractLocalOsmCollections({
    collections: {
      roads: { type: 'FeatureCollection', features: [{ id: 1 }] },
      buildings: { type: 'FeatureCollection', features: [] }
    }
  }), /canonical geodata region contract/u);
  assert.throws(() => extractLocalOsmCollections({}), /canonical geodata region contract/u);
});

test('adapts the canonical backend road and building property contract', () => {
  const road = classifyLocalRoad({
    rawTags: { highway: 'service' },
    semantics: { highway: 'primary', motorcycleAccess: { allowed: true } }
  });
  assert.equal(road.category, 'primary');
  assert.equal(road.color, '#ffe74a');

  const building = normalizeLocalBuilding({
    rawTags: { building: 'apartments', 'building:levels': '99' },
    heights: {
      heightMeters: 12.192,
      minimumHeightMeters: 3,
      heightProvenance: 'source-height',
      heightWasClamped: false,
      sourceHeight: '40 ft',
      sourceLevels: null
    }
  });
  assert.equal(building.heightMeters, 12.192);
  assert.equal(building.baseHeightMeters, 3);
  assert.equal(building.heightSource, 'source-height');
  assert.equal(building.heightDerived, false);
  assert.equal(building.sourceHeight, '40 ft');
});

test('consumes the actual geodata normalizer contract without a hand-written shape', () => {
  const bbox = parseAndSnapBbox('-0.02,-0.02,0.04,0.04', GEODATA_LIMITS);
  const region = normalizeOverpassRegion(createOverpassFixture(), {
    bbox,
    layers: ['roads', 'buildings'],
    vehicle: 'motorcycle',
    limits: GEODATA_LIMITS
  });
  const collections = extractLocalOsmCollections({
    provenance: { attribution: '© OpenStreetMap contributors' },
    data: region
  });
  assert.equal(collections.roads.length, 4);
  assert.equal(collections.buildings.length, 4);
  const residential = collections.roads.find((feature) => feature.id === 'way/200');
  assert.equal(classifyLocalRoad(residential.properties).category, 'residential');
  const feet = collections.buildings.find((feature) => feature.id === 'way/500');
  assert.equal(normalizeLocalBuilding(feet.properties).heightMeters, 12.192);
  assert.equal(normalizeLocalBuilding(feet.properties).heightSource, 'source-height');
});
