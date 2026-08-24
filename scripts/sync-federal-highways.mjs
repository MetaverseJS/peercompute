#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFile as execFileCallback } from 'node:child_process';
import {
  access,
  copyFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';

import geojsonvt from 'geojson-vt';
import vtpbf from 'vt-pbf';
import { validateFederalHighwayDbfVersion } from './federal-highway-sync-support.mjs';

const require = createRequire(import.meta.url);
const execFile = promisify(execFileCallback);

const ITEM_ID = 'dce9f09392eb474c8ad8e6a78416279b';
const ITEM_URL = `https://www.arcgis.com/sharing/rest/content/items/${ITEM_ID}?f=pjson`;
const LAYER_URL = 'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Highway_System/FeatureServer/0';
const DOWNLOAD_URL = `https://hub.arcgis.com/api/download/v1/items/${ITEM_ID}/shapefile?layers=0`;
const DICTIONARY_URL = 'https://doi.org/10.21949/1529838';
const SOURCE_BASENAME = 'National_Highway_System_(NHS)';
const SOURCE_MEMBERS = Object.freeze([
  `${SOURCE_BASENAME}.cpg`,
  `${SOURCE_BASENAME}.dbf`,
  `${SOURCE_BASENAME}.prj`,
  `${SOURCE_BASENAME}.shp`,
  `${SOURCE_BASENAME}.shp.xml`,
  `${SOURCE_BASENAME}.shx`,
]);
const NHS_CLASSES = Object.freeze({
  1: 'Interstate',
  3: 'Non-Interstate STRAHNET',
  4: 'STRAHNET Connector',
  7: 'Other NHS',
  8: 'Approved Intermodal Connector',
  9: 'Intermodal/STRAHNET dual designation',
  10: 'MAP-21 Principal Arterial',
});
const MAXIMUM_ARCHIVE_BYTES = 128 * 1024 * 1024;
const MAXIMUM_EXPANDED_BYTES = 600 * 1024 * 1024;
const MAXIMUM_SIMPLIFIED_POINTS = 600_000;
const MAXIMUM_TILE_BYTES = 64 * 1024;
const MAXIMUM_TILE_COUNT = 2_048;
const MAXIMUM_TOTAL_TILE_BYTES = 4 * 1024 * 1024;
const MAXIMUM_EXPORT_STATUS_BYTES = 64 * 1024;
const MAXIMUM_EXPORT_ATTEMPTS = 6;
const MINIMUM_ZOOM = 0;
const MAXIMUM_ZOOM = 8;

function parseArgs(argv) {
  const options = { archive: null, outputBase: null, keepWork: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--archive') options.archive = resolve(argv[++index] ?? '');
    else if (value === '--output-base') options.outputBase = resolve(argv[++index] ?? '');
    else if (value === '--keep-work') options.keepWork = true;
    else if (value === '--help') {
      process.stdout.write([
        'Usage: node scripts/sync-federal-highways.mjs [options]',
        '',
        '  --archive PATH      Use an already downloaded official Hub SHP archive.',
        '  --output-base PATH  Base directory for versioned static artifacts.',
        '  --keep-work         Retain the temporary extraction/intermediate directory.',
        '',
      ].join('\n'));
      process.exit(0);
    } else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function sha256File(path) {
  return sha256(await readFile(path));
}

function allowedOfficialUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) return false;
  return url.hostname === 'hub.arcgis.com'
    || url.hostname === 'www.arcgis.com'
    || url.hostname === 'services.arcgis.com'
    || url.hostname.endsWith('.az.arcgis.com');
}

async function fetchOfficial(url, { timeoutMs = 30_000, ...options } = {}, redirects = 0) {
  if (!allowedOfficialUrl(url)) throw new Error(`Refusing non-official download URL: ${url}`);
  if (redirects > 4) throw new Error('Official download exceeded the redirect cap.');
  const requestTimeout = AbortSignal.timeout(timeoutMs);
  const signal = options.signal
    ? AbortSignal.any([options.signal, requestTimeout])
    : requestTimeout;
  const response = await fetch(url, { ...options, redirect: 'manual', signal });
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = response.headers.get('location');
    if (!location) throw new Error('Official download redirect omitted Location.');
    const next = new URL(location, url).toString();
    response.body?.cancel().catch(() => {});
    return fetchOfficial(next, { ...options, timeoutMs }, redirects + 1);
  }
  return response;
}

function retryDelay(attempt, response = null) {
  const retryAfter = Number(response?.headers?.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter >= 0) return Math.min(10_000, retryAfter * 1_000);
  return Math.min(10_000, 1_000 * (2 ** attempt));
}

async function waitForRetry(attempt, response = null) {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, retryDelay(attempt, response)));
}

function retryableFetchError(error) {
  return error?.name === 'TimeoutError'
    || error?.name === 'AbortError'
    || error?.code === 'UND_ERR_CONNECT_TIMEOUT'
    || error?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT';
}

async function fetchText(url, maximumBytes) {
  let response = null;
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await fetchOfficial(url, { headers: { accept: 'application/json,application/xml,text/plain' } });
      if (response.status !== 429 && response.status < 500) break;
      response.body?.cancel().catch(() => {});
    } catch (error) {
      if (!retryableFetchError(error)) throw error;
      lastError = error;
    }
    if (attempt < 2) await waitForRetry(attempt, response);
  }
  if (!response) throw lastError ?? new Error(`Official source was unavailable: ${url}`);
  if (!response.ok) throw new Error(`Official source returned HTTP ${response.status}: ${url}`);
  const length = Number(response.headers.get('content-length'));
  if (Number.isFinite(length) && length > maximumBytes) throw new Error(`Official source exceeds ${maximumBytes} bytes.`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > maximumBytes) throw new Error(`Official source exceeds ${maximumBytes} bytes.`);
  return new TextDecoder().decode(bytes);
}

async function downloadArchive(targetPath) {
  let response = null;
  let lastError = null;
  for (let attempt = 0; attempt < MAXIMUM_EXPORT_ATTEMPTS; attempt += 1) {
    try {
      response = await fetchOfficial(DOWNLOAD_URL, {
        headers: { accept: 'application/zip,application/octet-stream,application/json' },
        timeoutMs: 5 * 60_000,
      });
    } catch (error) {
      if (!retryableFetchError(error)) throw error;
      lastError = error;
      if (attempt === MAXIMUM_EXPORT_ATTEMPTS - 1) break;
      await waitForRetry(attempt);
      continue;
    }
    if (response.status === 429 || response.status >= 500) {
      response.body?.cancel().catch(() => {});
      if (attempt === MAXIMUM_EXPORT_ATTEMPTS - 1) break;
      await waitForRetry(attempt, response);
      continue;
    }
    if (!response.headers.get('content-type')?.includes('application/json')) break;
    const declared = Number(response.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > MAXIMUM_EXPORT_STATUS_BYTES) {
      throw new Error('Hub export status response exceeds the byte cap.');
    }
    const statusBytes = new Uint8Array(await response.arrayBuffer());
    if (statusBytes.byteLength > MAXIMUM_EXPORT_STATUS_BYTES) {
      throw new Error('Hub export status response exceeds the byte cap.');
    }
    const body = JSON.parse(new TextDecoder().decode(statusBytes));
    if (body.status === 'Completed' && typeof body.resultUrl === 'string') {
      try {
        response = await fetchOfficial(body.resultUrl, {
          headers: { accept: 'application/zip,application/octet-stream' },
          timeoutMs: 5 * 60_000,
        });
      } catch (error) {
        if (!retryableFetchError(error)) throw error;
        lastError = error;
        response = null;
      }
      if (response?.ok) break;
      response?.body?.cancel().catch(() => {});
    } else if (!['Pending', 'Processing', 'InProgress'].includes(body.status)) {
      throw new Error(`Hub export failed with status ${String(body.status ?? 'unknown')}.`);
    }
    if (attempt === MAXIMUM_EXPORT_ATTEMPTS - 1) break;
    await waitForRetry(attempt, response);
  }
  if (!response?.ok || !response.body
    || response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Hub archive did not become available after ${MAXIMUM_EXPORT_ATTEMPTS} bounded attempts (last HTTP ${response?.status ?? 'none'}${lastError ? `; ${lastError.message}` : ''}).`);
  }
  const declared = Number(response.headers.get('content-length'));
  if (!Number.isSafeInteger(declared) || declared < 1 || declared > MAXIMUM_ARCHIVE_BYTES) {
    throw new Error('Hub archive has an invalid or oversized Content-Length.');
  }
  let observed = 0;
  const digest = createHash('sha256');
  const limiter = new TransformStream({
    transform(chunk, controller) {
      const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
      observed += bytes.byteLength;
      if (observed > MAXIMUM_ARCHIVE_BYTES) throw new Error('Hub archive exceeded the byte cap.');
      digest.update(bytes);
      controller.enqueue(bytes);
    },
  });
  const { createWriteStream } = await import('node:fs');
  await pipeline(
    Readable.fromWeb(response.body.pipeThrough(limiter)),
    createWriteStream(targetPath, { flags: 'wx' }),
  );
  if (observed !== declared) throw new Error(`Hub archive length mismatch: declared ${declared}, observed ${observed}.`);
  return Object.freeze({
    bytes: observed,
    sha256: digest.digest('hex'),
    lastEditDate: response.headers.get('x-ms-meta-lasteditdate'),
    recordCount: response.headers.get('x-ms-meta-recordcount'),
  });
}

function parseJson(raw, label) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function requireField(layer, name, type) {
  const field = layer.fields?.find((entry) => entry.name === name);
  if (!field || field.type !== type) throw new Error(`Official layer field ${name} is missing or changed type.`);
}

async function inspectLiveSource() {
  const [itemRaw, layerRaw, countRaw, retainedRaw, versionRaw] = await Promise.all([
    fetchText(ITEM_URL, 64 * 1024),
    fetchText(`${LAYER_URL}?f=pjson`, 128 * 1024),
    fetchText(`${LAYER_URL}/query?where=1%3D1&returnCountOnly=true&f=json`, 16 * 1024),
    fetchText(`${LAYER_URL}/query?where=STATUS%3D1%20AND%20FACILITYT%3C%3E7&returnCountOnly=true&f=json`, 16 * 1024),
    fetchText(`${LAYER_URL}/query?where=1%3D1&outFields=VERSION&returnGeometry=false&returnDistinctValues=true&f=json`, 32 * 1024),
  ]);
  const item = parseJson(itemRaw, 'ArcGIS item metadata');
  const layer = parseJson(layerRaw, 'ArcGIS layer metadata');
  const count = Number(parseJson(countRaw, 'ArcGIS count').count);
  const retainedCount = Number(parseJson(retainedRaw, 'ArcGIS retained count').count);
  const versions = [...new Set((parseJson(versionRaw, 'ArcGIS version query').features ?? [])
    .map((feature) => String(feature?.attributes?.VERSION ?? '').trim())
    .filter(Boolean))];
  if (item.id !== ITEM_ID || item.owner !== 'USDOT_BTS' || item.type !== 'Feature Service'
    || item.url !== LAYER_URL.replace(/\/0$/, '')) {
    throw new Error('ArcGIS NHS item identity drifted.');
  }
  if (layer.id !== 0 || layer.name !== 'National Highway System (NHS)'
    || layer.geometryType !== 'esriGeometryPolyline' || layer.hasZ !== false || layer.hasM !== false
    || layer.extent?.spatialReference?.wkid !== 4326) {
    throw new Error('ArcGIS NHS layer geometry contract drifted.');
  }
  if (layer.maxRecordCount < 2_000
    || !String(layer.capabilities).split(',').includes('Query')
    || !String(layer.capabilities).split(',').includes('Extract')) {
    throw new Error('ArcGIS NHS layer query/extract capabilities drifted.');
  }
  const formats = new Set(String(layer.supportedQueryFormats).split(',').map((value) => value.trim().toLowerCase()));
  for (const format of ['json', 'geojson', 'pbf']) {
    if (!formats.has(format)) throw new Error(`ArcGIS NHS layer no longer advertises ${format}.`);
  }
  for (const [name, type] of [
    ['OBJECTID', 'esriFieldTypeOID'],
    ['VERSION', 'esriFieldTypeString'],
    ['STFIPS', 'esriFieldTypeDouble'],
    ['ROUTEID', 'esriFieldTypeString'],
    ['SIGNT1', 'esriFieldTypeString'],
    ['SIGNN1', 'esriFieldTypeString'],
    ['LNAME', 'esriFieldTypeString'],
  ]) requireField(layer, name, type);
  for (const name of ['NHS', 'STATUS', 'FACILITYT', 'MILES']) {
    const field = layer.fields?.find((entry) => entry.name === name);
    if (!field || !['esriFieldTypeDouble', 'esriFieldTypeInteger', 'esriFieldTypeSmallInteger'].includes(field.type)) {
      throw new Error(`Official numeric layer field ${name} is missing or changed type.`);
    }
  }
  if (!Number.isSafeInteger(count) || count < 1 || !Number.isSafeInteger(retainedCount)
    || retainedCount < 1 || retainedCount > count || versions.length !== 1) {
    throw new Error('ArcGIS NHS live count/version contract is invalid.');
  }
  const extent = [layer.extent.xmin, layer.extent.ymin, layer.extent.xmax, layer.extent.ymax];
  if (extent.some((value) => !Number.isFinite(value)) || extent[0] > -159 || extent[3] < 70) {
    throw new Error('ArcGIS NHS layer no longer demonstrates Alaska coverage.');
  }
  return Object.freeze({
    item,
    itemRaw,
    layer,
    layerRaw,
    count,
    retainedCount,
    version: versions[0],
    extent,
  });
}

async function validateAndExtractArchive(
  archivePath,
  extractionPath,
  expectedRecordCount,
  expectedVersion,
) {
  const archive = await stat(archivePath);
  if (!archive.isFile() || archive.size < 1 || archive.size > MAXIMUM_ARCHIVE_BYTES) {
    throw new Error('NHS archive is missing or exceeds the compressed byte cap.');
  }
  const { stdout } = await execFile('unzip', ['-Z1', archivePath], { maxBuffer: 64 * 1024 });
  const members = stdout.split(/\r?\n/).filter(Boolean).sort();
  if (members.length !== SOURCE_MEMBERS.length
    || members.some((member, index) => member !== [...SOURCE_MEMBERS].sort()[index])
    || members.some((member) => member.includes('/') || member.includes('\\') || member.includes('..'))) {
    throw new Error(`NHS archive member allowlist mismatch: ${members.join(', ')}`);
  }
  await execFile('unzip', ['-tqq', archivePath], { maxBuffer: 64 * 1024 });
  await mkdir(extractionPath, { recursive: true });
  await execFile('unzip', ['-qq', archivePath, '-d', extractionPath], { maxBuffer: 64 * 1024 });
  let expandedBytes = 0;
  const memberInfo = {};
  for (const member of SOURCE_MEMBERS) {
    const path = join(extractionPath, member);
    const info = await stat(path);
    if (!info.isFile()) throw new Error(`NHS archive member is not a file: ${member}`);
    expandedBytes += info.size;
    memberInfo[member] = Object.freeze({ bytes: info.size, sha256: await sha256File(path) });
  }
  if (expandedBytes > MAXIMUM_EXPANDED_BYTES) throw new Error('NHS archive exceeds the expanded byte cap.');
  const dbf = await validateFederalHighwayDbfVersion(
    join(extractionPath, `${SOURCE_BASENAME}.dbf`),
    { expectedRecordCount, expectedVersion },
  );
  return Object.freeze({ expandedBytes, dbfRecordCount: dbf.recordCount, dbf, memberInfo: Object.freeze(memberInfo) });
}

async function createSimplifiedGeoJson(extractionPath, outputPath) {
  const mapshaperBin = require.resolve('mapshaper/bin/mapshaper');
  const source = join(extractionPath, `${SOURCE_BASENAME}.shp`);
  const { stdout, stderr } = await execFile(process.execPath, [
    mapshaperBin,
    source,
    '-filter', 'STATUS == 1 && FACILITYT != 7',
    '-filter-fields', 'NHS',
    '-dissolve', 'fields=NHS',
    '-simplify', 'dp', 'interval=1km', 'no-repair',
    '-o', 'format=geojson', 'precision=0.001', outputPath,
  ], {
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' },
    maxBuffer: 2 * 1024 * 1024,
    timeout: 10 * 60 * 1_000,
  });
  return `${stdout}${stderr}`;
}

function coordinateCount(value) {
  if (!Array.isArray(value)) return 0;
  if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) return 1;
  return value.reduce((total, child) => total + coordinateCount(child), 0);
}

function tileRange(bounds, zoom) {
  const tiles = 2 ** zoom;
  const xFor = (longitude) => Math.floor((longitude + 180) / 360 * tiles);
  const yFor = (latitude) => {
    const clamped = Math.max(-85.0511287798066, Math.min(85.0511287798066, latitude));
    const radians = clamped * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2 * tiles);
  };
  return {
    minX: Math.max(0, xFor(bounds[0]) - 1),
    maxX: Math.min(tiles - 1, xFor(bounds[2]) + 1),
    minY: Math.max(0, yFor(bounds[3]) - 1),
    maxY: Math.min(tiles - 1, yFor(bounds[1]) + 1),
  };
}

async function createTiles(geojson, tileRoot, sourceExtent) {
  const index = geojsonvt(geojson, {
    maxZoom: MAXIMUM_ZOOM,
    indexMaxZoom: 5,
    indexMaxPoints: 100_000,
    tolerance: 3,
    extent: 4096,
    buffer: 64,
    lineMetrics: false,
  });
  const tiles = [];
  let totalBytes = 0;
  let largestTileBytes = 0;
  for (let z = MINIMUM_ZOOM; z <= MAXIMUM_ZOOM; z += 1) {
    const range = tileRange(sourceExtent, z);
    for (let x = range.minX; x <= range.maxX; x += 1) {
      for (let y = range.minY; y <= range.maxY; y += 1) {
        const tile = index.getTile(z, x, y);
        if (!tile || tile.features.length === 0) continue;
        const bytes = Buffer.from(vtpbf.fromGeojsonVt({ nhs: tile }));
        if (bytes.byteLength > MAXIMUM_TILE_BYTES) {
          throw new Error(`NHS tile ${z}/${x}/${y} exceeds ${MAXIMUM_TILE_BYTES} bytes.`);
        }
        totalBytes += bytes.byteLength;
        largestTileBytes = Math.max(largestTileBytes, bytes.byteLength);
        if (totalBytes > MAXIMUM_TOTAL_TILE_BYTES) throw new Error('NHS tile pyramid exceeds the aggregate byte cap.');
        if (tiles.length >= MAXIMUM_TILE_COUNT) throw new Error('NHS tile pyramid exceeds the tile-count cap.');
        const directory = join(tileRoot, String(z), String(x));
        await mkdir(directory, { recursive: true });
        await writeFile(join(directory, `${y}.pbf`), bytes, { flag: 'wx' });
        tiles.push(Object.freeze({
          key: `${z}/${x}/${y}`,
          bytes: bytes.byteLength,
          sha256: sha256(bytes),
          features: tile.features.length,
          sourcePoints: tile.numPoints,
          renderedPoints: tile.numSimplified,
        }));
      }
    }
  }
  return Object.freeze({
    tiles: Object.freeze(tiles),
    tileCount: tiles.length,
    totalBytes,
    largestTileBytes,
  });
}

async function replaceDirectory(stagingPath, outputPath) {
  const parent = dirname(outputPath);
  await mkdir(parent, { recursive: true });
  const previous = `${outputPath}.previous-${process.pid}`;
  let hadPrevious = false;
  try {
    await access(outputPath);
    await rename(outputPath, previous);
    hadPrevious = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  try {
    await rename(stagingPath, outputPath);
    if (hadPrevious) await rm(previous, { recursive: true, force: true });
  } catch (error) {
    if (hadPrevious) await rename(previous, outputPath).catch(() => {});
    throw error;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), '..');
  const outputBase = options.outputBase
    ?? join(projectRoot, 'demos', 'motorcycle', 'public', 'data', 'fhwa-nhs');
  const allowedOutputBase = join(projectRoot, 'demos', 'motorcycle', 'public', 'data', 'fhwa-nhs');
  if (outputBase !== allowedOutputBase && !options.outputBase) throw new Error('Unexpected NHS output base.');
  const work = await mkdtemp(join(tmpdir(), 'peercompute-fhwa-nhs-'));
  let preserveWork = options.keepWork;
  try {
    const live = await inspectLiveSource();
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(live.version)) throw new Error(`Unexpected NHS version: ${live.version}`);
    const archivePath = options.archive ?? join(work, 'nhs.zip');
    let download = null;
    if (!options.archive) download = await downloadArchive(archivePath);
    const archiveSha256 = await sha256File(archivePath);
    const archiveBytes = (await stat(archivePath)).size;
    const sourcePath = join(work, 'source');
    const archive = await validateAndExtractArchive(
      archivePath,
      sourcePath,
      live.count,
      live.version,
    );
    const simplifiedPath = join(work, 'nhs-overview.geojson');
    const mapshaperLog = await createSimplifiedGeoJson(sourcePath, simplifiedPath);
    const geojson = parseJson(await readFile(simplifiedPath, 'utf8'), 'Simplified NHS GeoJSON');
    if (geojson.type !== 'FeatureCollection' || geojson.features.length !== Object.keys(NHS_CLASSES).length) {
      throw new Error('Simplified NHS output must contain exactly one dissolved feature per NHS class.');
    }
    const classes = [...new Set(geojson.features.map((feature) => Number(feature.properties?.NHS)))].sort((a, b) => a - b);
    const expectedClasses = Object.keys(NHS_CLASSES).map(Number).sort((a, b) => a - b);
    if (classes.some((value, index) => value !== expectedClasses[index])) {
      throw new Error(`Simplified NHS class set drifted: ${classes.join(',')}`);
    }
    const simplifiedPointCount = geojson.features.reduce(
      (total, feature) => total + coordinateCount(feature.geometry?.coordinates),
      0,
    );
    if (simplifiedPointCount < 1 || simplifiedPointCount > MAXIMUM_SIMPLIFIED_POINTS) {
      throw new Error(`Simplified NHS point count ${simplifiedPointCount} is outside the cap.`);
    }

    const stagingPath = join(outputBase, `.staging-${live.version}-${process.pid}`);
    await rm(stagingPath, { recursive: true, force: true });
    await mkdir(stagingPath, { recursive: true });
    const pyramid = await createTiles(geojson, join(stagingPath, 'tiles'), live.extent);
    const metadataSource = join(sourcePath, `${SOURCE_BASENAME}.shp.xml`);
    await copyFile(metadataSource, join(stagingPath, 'source-metadata.xml'));
    await writeFile(join(stagingPath, 'source-item.json'), live.itemRaw, { flag: 'wx' });
    await writeFile(join(stagingPath, 'source-layer.json'), live.layerRaw, { flag: 'wx' });
    const manifest = {
      schemaVersion: 'peercompute.geo.fhwa-nhs-tile-manifest.v1',
      datasetId: `fhwa-national-highway-system-${live.version}`,
      version: live.version,
      generatedAt: new Date().toISOString(),
      source: {
        itemId: ITEM_ID,
        owner: live.item.owner,
        authority: 'Federal Highway Administration',
        publisher: 'U.S. Department of Transportation, Bureau of Transportation Statistics',
        title: live.layer.name,
        itemUrl: ITEM_URL,
        layerUrl: LAYER_URL,
        downloadUrl: DOWNLOAD_URL,
        metadataFile: 'source-metadata.xml',
        dictionaryUrl: DICTIONARY_URL,
        license: 'Work of the United States Government; unrestricted public use with original metadata retained.',
        geometryRole: 'official source geometry generalized into derived display-only vector tiles',
        navigationGrade: false,
        sourceRecordCount: live.count,
        retainedRecordCount: live.retainedCount,
        layerLastEditDate: live.layer.editingInfo?.lastEditDate ?? null,
        itemModified: live.item.modified ?? null,
        extent: live.extent,
        archive: {
          bytes: archiveBytes,
          sha256: archiveSha256,
          expandedBytes: archive.expandedBytes,
          memberInfo: archive.memberInfo,
          transportLastEditDate: download?.lastEditDate ?? null,
          transportRecordCount: download?.recordCount ?? null,
          dbfVersion: archive.dbf.versions[0],
          dbfActiveRecords: archive.dbf.activeRecords,
          dbfDeletedRecords: archive.dbf.deletedRecords,
        },
      },
      derivation: {
        statusFilter: 'STATUS == 1',
        facilityFilter: 'FACILITYT != 7',
        dissolveField: 'NHS',
        simplification: 'Douglas-Peucker interval=1km no-repair',
        coordinatePrecisionDegrees: 0.001,
        geometryExact: false,
        displayOnly: true,
        mapshaperVersion: '0.7.55',
        geojsonVtVersion: '4.0.3',
        vtPbfVersion: '3.1.3',
        simplifiedPointCount,
      },
      classes: NHS_CLASSES,
      tilejson: '3.0.0',
      name: 'FHWA National Highway System',
      description: 'Current official NHS snapshot generalized for bounded Cesium globe display.',
      attribution: 'Federal Highway Administration / U.S. DOT Bureau of Transportation Statistics',
      bounds: live.extent,
      minzoom: MINIMUM_ZOOM,
      maxzoom: MAXIMUM_ZOOM,
      vector_layers: [{ id: 'nhs', fields: { NHS: 'Number' } }],
      tileTemplate: 'tiles/{z}/{x}/{y}.pbf',
      tileCount: pyramid.tileCount,
      totalTileBytes: pyramid.totalBytes,
      largestTileBytes: pyramid.largestTileBytes,
      maximumTileBytes: MAXIMUM_TILE_BYTES,
      maximumTotalTileBytes: MAXIMUM_TOTAL_TILE_BYTES,
      tiles: pyramid.tiles,
      coverage: {
        completeSourceSnapshot: true,
        completeExactGeometry: false,
        includesAlaska: live.extent[0] <= -159 && live.extent[3] >= 70,
        jurisdictions: '50 states, District of Columbia, and Puerto Rico',
      },
      notes: [
        'The NHS is a nationally important road network, not a statement of federal road ownership.',
        'Geometry is intentionally generalized for overview display and must not be used for navigation or route clearance.',
        'The official source metadata is redistributed byte-for-byte as source-metadata.xml.',
      ],
    };
    const manifestRaw = `${JSON.stringify(manifest, null, 2)}\n`;
    if (Buffer.byteLength(manifestRaw) > 256 * 1024) throw new Error('NHS manifest exceeds 256 KiB.');
    await writeFile(join(stagingPath, 'manifest.json'), manifestRaw, { flag: 'wx' });
    await writeFile(join(stagingPath, 'BUILD.txt'), [
      'Generated by: npm run sync:federal-highways',
      `Dataset: ${manifest.datasetId}`,
      `Source archive SHA-256: ${archiveSha256}`,
      `Source records: ${live.count}`,
      `Retained records: ${live.retainedCount}`,
      `Simplified points: ${simplifiedPointCount}`,
      `Tiles: ${pyramid.tileCount}`,
      `Tile bytes: ${pyramid.totalBytes}`,
      '',
      mapshaperLog.trim(),
      '',
    ].join('\n'), { flag: 'wx' });
    const outputPath = join(outputBase, live.version);
    if (!outputPath.startsWith(`${outputBase}${sep}`)) throw new Error('Unsafe NHS output path.');
    await replaceDirectory(stagingPath, outputPath);
    process.stdout.write(`${JSON.stringify({
      outputPath,
      datasetId: manifest.datasetId,
      sourceRecords: live.count,
      retainedRecords: live.retainedCount,
      simplifiedPointCount,
      tileCount: pyramid.tileCount,
      tileBytes: pyramid.totalBytes,
      largestTileBytes: pyramid.largestTileBytes,
      archiveBytes,
      archiveSha256,
    }, null, 2)}\n`);
  } catch (error) {
    preserveWork = true;
    process.stderr.write(`Federal-highway sync failed; retained work directory ${work}\n`);
    throw error;
  } finally {
    if (!preserveWork) await rm(work, { recursive: true, force: true });
  }
}

await main();
