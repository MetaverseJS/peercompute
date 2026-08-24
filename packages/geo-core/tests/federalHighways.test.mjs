import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  decodeFederalHighwayTile,
  FHWA_NHS_CLASSES,
  loadFederalHighwayImageryProvider,
  nearestFederalHighwayPoint,
  validateFederalHighwayManifest,
} from '../src/vector/federalHighways.js';
import { validateFederalHighwayDbfVersion } from '../../../scripts/federal-highway-sync-support.mjs';

const artifactRoot = new URL('../../../demos/motorcycle/public/data/fhwa-nhs/2025.08.08/', import.meta.url);
const manifestRaw = await readFile(new URL('manifest.json', artifactRoot), 'utf8');
const manifestFixture = JSON.parse(manifestRaw);

function tileBytes(key) {
  return readFile(new URL(`tiles/${key}.pbf`, artifactRoot));
}

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
  constructor() { this.rectangle = { world: true }; }
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

const fakeCesium = {
  Credit: FakeCredit,
  Event: FakeEvent,
  Rectangle: { fromDegrees: (...bounds) => ({ bounds }) },
  WebMercatorTilingScheme: FakeTilingScheme,
};

function dbfFixture(versions) {
  const recordBytes = 11;
  const headerBytes = 65;
  const bytes = Buffer.alloc(headerBytes + versions.length * recordBytes + 1, 0);
  bytes[0] = 0x03;
  bytes.writeUInt32LE(versions.length, 4);
  bytes.writeUInt16LE(headerBytes, 8);
  bytes.writeUInt16LE(recordBytes, 10);
  bytes.write('VERSION', 32, 'ascii');
  bytes[43] = 'C'.charCodeAt(0);
  bytes[48] = 10;
  bytes[64] = 0x0d;
  versions.forEach((version, index) => {
    const offset = headerBytes + index * recordBytes;
    bytes[offset] = 0x20;
    bytes.fill(0x20, offset + 1, offset + recordBytes);
    bytes.write(version, offset + 1, 'ascii');
  });
  bytes[bytes.length - 1] = 0x1a;
  return bytes;
}

test('current FHWA NHS artifact is complete, bounded, and includes Alaska and the contiguous US', async () => {
  const manifest = validateFederalHighwayManifest(manifestFixture);
  assert.equal(manifest.datasetId, 'fhwa-national-highway-system-2025.08.08');
  assert.equal(manifest.source.sourceRecordCount, 492_005);
  assert.equal(manifest.source.retainedRecordCount, 491_545);
  assert.equal(manifest.source.archive.dbfVersion, manifest.version);
  assert.equal(manifest.source.archive.dbfActiveRecords, 492_005);
  assert.equal(manifest.source.archive.dbfDeletedRecords, 0);
  assert.equal(manifest.tileCount, 1_028);
  assert.ok(manifest.totalTileBytes < 4 * 1024 * 1024);
  assert.deepEqual([...manifest.tiles.keys()].sort().slice(0, 2), ['0/0/0', '1/0/0']);
  assert.deepEqual(Object.keys(FHWA_NHS_CLASSES).map(Number), [1, 3, 4, 7, 8, 9, 10]);

  for (const key of ['5/2/9', '5/7/12']) {
    const [z, x, y] = key.split('/').map(Number);
    const decoded = decodeFederalHighwayTile(await tileBytes(key), { x, y, z });
    assert.ok(decoded.commands.length > 0, `${key} must contain official highways`);
    assert.ok(decoded.vertices > 0);
    assert.ok(decoded.commands.every((command) => (
      command.properties.sourceAuthoritative === true
      && command.properties.geometryExact === false
      && command.properties.displayOnly === true
      && command.properties.navigationGrade === false
    )));
  }
});

test('manifest validation rejects inventory and provenance drift', () => {
  assert.throws(
    () => validateFederalHighwayManifest({ ...manifestFixture, tileCount: manifestFixture.tileCount + 1 }),
    /inventory count/u,
  );
  assert.throws(
    () => validateFederalHighwayManifest({
      ...manifestFixture,
      source: { ...manifestFixture.source, owner: 'not-usdot' },
    }),
    /identity or provenance/u,
  );
  assert.throws(
    () => validateFederalHighwayManifest({
      ...manifestFixture,
      source: {
        ...manifestFixture.source,
        archive: { ...manifestFixture.source.archive, dbfVersion: '2024.12.31' },
      },
    }),
    /identity or provenance/u,
  );
  assert.throws(
    () => validateFederalHighwayManifest({
      ...manifestFixture,
      coverage: { ...manifestFixture.coverage, includesAlaska: false },
    }),
    /derivation\/coverage/u,
  );
});

test('offline NHS archives must carry the exact live VERSION in every active DBF row', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'peercompute-nhs-dbf-test-'));
  try {
    const valid = join(directory, 'valid.dbf');
    await writeFile(valid, dbfFixture(['2025.08.08', '2025.08.08']));
    const result = await validateFederalHighwayDbfVersion(valid, {
      expectedRecordCount: 2,
      expectedVersion: '2025.08.08',
    });
    assert.deepEqual(result.versions, ['2025.08.08']);
    assert.equal(result.activeRecords, 2);

    const stale = join(directory, 'stale.dbf');
    await writeFile(stale, dbfFixture(['2025.08.08', '2024.12.31']));
    await assert.rejects(
      validateFederalHighwayDbfVersion(stale, {
        expectedRecordCount: 2,
        expectedVersion: '2025.08.08',
      }),
      /VERSION 2024\.12\.31 differs from live 2025\.08\.08/u,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('nearest highway projection is deterministic and preserves source disclosure', () => {
  const nearest = nearestFederalHighwayPoint([{
    geometry: { type: 'LineString', coordinates: [[-150, 61], [-149, 61]] },
    properties: { nhsCode: 1, nhsClass: 'Interstate' },
  }], { longitude: -149.5, latitude: 61.1 });
  assert.ok(nearest.distanceMeters > 11_000 && nearest.distanceMeters < 11_100);
  assert.deepEqual(nearest.location, { longitude: -149.5, latitude: 61 });
  assert.equal(nearest.nhsCode, 1);
  assert.equal(nearest.nhsClass, 'Interstate');
});

test('Cesium NHS provider verifies checksums, reuses bounded bytes, and returns transparent missing tiles', async () => {
  const fetchCounts = new Map();
  const telemetry = [];
  const manifestUrl = 'https://roadvector.example/data/fhwa-nhs/2025.08.08/manifest.json';
  const provider = await loadFederalHighwayImageryProvider(fakeCesium, {
    manifestUrl,
    canvasFactory: fakeCanvas,
    onTelemetry: (value) => telemetry.push(value),
    fetchImpl: async (input) => {
      const url = new URL(String(input));
      fetchCounts.set(url.pathname, (fetchCounts.get(url.pathname) ?? 0) + 1);
      if (url.pathname.endsWith('/manifest.json')) {
        return new Response(manifestRaw, {
          status: 200,
          headers: { 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(manifestRaw)) },
        });
      }
      const match = /\/tiles\/(\d+\/\d+\/\d+)\.pbf$/u.exec(url.pathname);
      if (!match) return new Response(null, { status: 404 });
      const bytes = await tileBytes(match[1]);
      return new Response(bytes, {
        status: 200,
        headers: { 'content-type': 'application/x-protobuf', 'content-length': String(bytes.byteLength) },
      });
    },
  });

  await provider.requestImage(2, 9, 5);
  await provider.requestImage(2, 9, 5);
  await provider.requestImage(31, 31, 5);
  const decoded = decodeFederalHighwayTile(await tileBytes('5/2/9'), { x: 2, y: 9, z: 5 });
  const line = decoded.commands.flatMap((command) => (
    command.geometry.type === 'LineString' ? [command.geometry.coordinates] : command.geometry.coordinates
  )).find((candidate) => candidate.length >= 2);
  const clicked = {
    longitude: line[0][0] + 0.01,
    latitude: line[0][1] + 0.01,
  };
  const snapped = await provider.findNearestHighway(clicked, {
    maximumTiles: 25,
    maximumDistanceMeters: 100_000,
  });
  assert.ok(snapped);
  assert.ok(snapped.distanceMeters < 100_000);
  assert.equal(snapped.sourceId, 'fhwa-national-highway-system');
  assert.equal(snapped.geometryExact, false);
  assert.equal(snapped.navigationGrade, false);
  const status = telemetry.at(-1);
  assert.equal(fetchCounts.get('/data/fhwa-nhs/2025.08.08/manifest.json'), 1);
  assert.equal(fetchCounts.get('/data/fhwa-nhs/2025.08.08/tiles/5/2/9.pbf'), 1);
  assert.ok(status.loaded >= 1 && status.loaded <= 25);
  assert.ok(status.renderedRoads > 0);
  assert.ok(status.renderedVertices > 0);
  assert.equal(status.emptyTileRequests, 1);
  assert.equal(status.includesAlaska, true);
  provider.destroy();
});

test('Cesium NHS provider fails closed on a modified tile', async () => {
  const manifestUrl = 'https://roadvector.example/data/fhwa-nhs/2025.08.08/manifest.json';
  const provider = await loadFederalHighwayImageryProvider(fakeCesium, {
    manifestUrl,
    canvasFactory: fakeCanvas,
    fetchImpl: async (input) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith('/manifest.json')) return new Response(manifestRaw, { status: 200 });
      const bytes = Buffer.from(await tileBytes('5/2/9'));
      bytes[bytes.length - 1] ^= 1;
      return new Response(bytes, {
        status: 200,
        headers: { 'content-length': String(bytes.length) },
      });
    },
  });
  await assert.rejects(provider.requestImage(2, 9, 5), /checksum mismatch/u);
  assert.equal(provider.getTelemetry().status, 'unavailable');
  provider.destroy();
});
