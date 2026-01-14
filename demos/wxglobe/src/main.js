import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';
import { NodeKernel } from '@peercompute';
import { listDataSources, getDefaultDataSource, getDataSource } from './dataSources.js';
import { WeatherManager } from './weatherManager.js';

const TERRARIUM_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

const statusEl = document.getElementById('provider-status');
const resolutionSelect = document.getElementById('resolution');
const datasetSelect = document.getElementById('dataset');
const datasetNotes = document.getElementById('dataset-notes');
const reloadBtn = document.getElementById('reload-terrain');
const flyHomeBtn = document.getElementById('fly-home');
const overlayEl = document.getElementById('overlay');
const toggleBtn = document.getElementById('toggle-controls');

const weatherManager = new WeatherManager({
  onStatus: (msg) => setStatus(msg)
});

const osmImagery = new Cesium.UrlTemplateImageryProvider({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  credit: '© OpenStreetMap'
});

function safeTerrainProvider(mode) {
  try {
    const p = createTerrainProvider(mode);
    if (!p.tilingScheme || !p.rectangle) {
      throw new Error('terrain provider missing tilingScheme/rectangle');
    }
    return p;
  } catch (err) {
    console.warn('[terrain] falling back to ellipsoid', err);
    setStatus('terrain fallback (ellipsoid)', true);
    return new Cesium.EllipsoidTerrainProvider();
  }
}

class TerrariumTerrainProvider {
  constructor(options = {}) {
    this._template = options.urlTemplate || TERRARIUM_URL;
    this._maxLevel = options.maxLevel ?? 14;
    this._ellipsoid = Cesium.Ellipsoid.WGS84;
    this._tilingScheme = new Cesium.WebMercatorTilingScheme({ ellipsoid: this._ellipsoid });
    this._tileWidth = 256;
    this._tileHeight = 256;
    this._onError = options.onError;
    this.credit = options.credit || new Cesium.Credit('AWS Terrarium');
    this.hasWaterMask = false;
    this.hasVertexNormals = false;
    this.ready = true;
    this.readyPromise = Promise.resolve(true);
    this._errorEvent = new Cesium.Event();
    Object.defineProperty(this, 'tilingScheme', { value: this._tilingScheme });
    Object.defineProperty(this, 'rectangle', { value: this._tilingScheme.rectangle });
    Object.defineProperty(this, 'errorEvent', { value: this._errorEvent });
    this._levelZeroMaximumGeometricError = Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
      this._ellipsoid,
      this._tileWidth
    );
  }

  getLevelMaximumGeometricError(level) {
    return this._levelZeroMaximumGeometricError / Math.pow(2, level);
  }

  getTileDataAvailable() {
    return true;
  }

  async requestTileGeometry(x, y, level) {
    if (level > this._maxLevel) {
      return undefined;
    }
    const url = this._template.replace('{z}', level).replace('{x}', x).replace('{y}', y);
    try {
      const { buffer, width, height } = await loadTerrariumTile(url);
      return new Cesium.HeightmapTerrainData({
        buffer,
        width,
        height,
        structure: {
          heightScale: 1,
          heightOffset: 0,
          elementsPerHeight: 1,
          stride: 1,
          elementMultiplier: 1,
          isBigEndian: false
        }
      });
    } catch (err) {
      this._onError?.(err, { x, y, level, url });
      return undefined;
    }
  }
}

async function loadTerrariumTile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Terrarium fetch failed ${response.status} for ${url}`);
  }
  const blob = await response.blob();
  const image = await createImageBitmap(blob);
  const canvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(image.width, image.height)
      : Object.assign(document.createElement('canvas'), { width: image.width, height: image.height });
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const { data, width, height } = context.getImageData(0, 0, image.width, image.height);
  image.close();
  const total = width * height;
  const heights = new Float32Array(total);
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    heights[p] = r * 256 + g + b / 256 - 32768;
  }
  return { buffer: heights, width, height };
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
}

function createTerrainProvider(mode) {
  const maxLevel = mode === '90m' ? 11 : 14; // clamp zoom for ~90m; 30m uses higher zooms
  return new TerrariumTerrainProvider({
    maxLevel,
    onError: (err, info) => {
      console.error('[terrain] tile error', info, err);
      setStatus(`terrain error z${info.level}/${info.x}/${info.y}`, true);
    },
    credit: new Cesium.Credit(`Terrarium ${mode}`)
  });
}

const viewer = new Cesium.Viewer('viewer', {
  imageryProvider: osmImagery,
  terrainProvider: new Cesium.EllipsoidTerrainProvider(), // temporary fallback to avoid terrain crashes
  baseLayerPicker: false,
  geocoder: false,
  animation: false,
  timeline: false,
  homeButton: false,
  sceneModePicker: false,
  navigationHelpButton: false,
  selectionIndicator: false,
  infoBox: false
});
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.showGroundAtmosphere = true;

function applyTerrain(mode) {
  const provider = safeTerrainProvider(mode);
  setStatus(`terrain: ${mode} (loading)`);
  viewer.terrainProvider = provider;
  if (provider.readyPromise?.then) {
    provider.readyPromise
      .then(() => setStatus(`terrain: ${mode} ready`))
      .catch((err) => {
        console.error('[terrain] provider failed', err);
        setStatus(`terrain: ${mode} failed`, true);
      });
  } else {
    setStatus(`terrain: ${mode} ready`);
  }
}

resolutionSelect.addEventListener('change', (e) => {
  applyTerrain(e.target.value);
});

reloadBtn.addEventListener('click', () => {
  applyTerrain(resolutionSelect.value);
});

flyHomeBtn.addEventListener('click', () => {
  viewer.camera.flyHome(1.5);
});

toggleBtn.addEventListener('click', () => {
  const next = !overlayEl.classList.contains('collapsed');
  overlayEl.classList.toggle('collapsed', next);
  toggleBtn.textContent = next ? 'Show' : 'Hide';
});

// Start with ellipsoid terrain; user can reload terrarium via controls.
setStatus('terrain: ellipsoid fallback');

function renderDatasetInfo(source) {
  if (!source) {
    datasetNotes.textContent = '';
    return;
  }
  datasetNotes.innerHTML = [
    `${source.region} | ${source.resolution} | ${source.cadence} | ${source.dimension}`,
    `Vars: ${source.variables.join(', ')}`,
    `URL: ${source.example}`
  ].join(' · ');
}

function populateDatasets() {
  const sources = listDataSources();
  datasetSelect.innerHTML = '';
  for (const src of sources) {
    const opt = document.createElement('option');
    opt.value = src.id;
    opt.textContent = `${src.title} (${src.region})`;
    datasetSelect.appendChild(opt);
  }
  const def = getDefaultDataSource();
  if (def) {
    datasetSelect.value = def.id;
    renderDatasetInfo(def);
  }
}

datasetSelect.addEventListener('change', (e) => {
  const src = getDataSource(e.target.value);
  renderDatasetInfo(src);
  console.info('[wxglobe] selected dataset', src?.id, src?.urlPattern);
  if (src) {
    weatherManager
      .load(src.id)
      .then((res) => {
        console.info('[wxglobe] dataset loaded (stub)', res);
      })
      .catch((err) => {
        console.error('[wxglobe] dataset load failed', err);
        setStatus(`dataset load failed: ${src.id}`, true);
      });
  }
});

populateDatasets();

// Kick off default dataset load
const def = getDefaultDataSource();
if (def) {
  weatherManager
    .load(def.id)
    .then((res) => console.info('[wxglobe] default dataset loaded', res))
    .catch((err) => {
      console.error('[wxglobe] default dataset load failed', err);
      setStatus(`dataset load failed: ${def.id}`, true);
    });
}

async function bootstrapPeerCompute() {
  try {
    const kernel = new NodeKernel({
      topology: 'distributed',
      topicPrefix: 'pc',
      enableWebGPU: false,
      enablePersistence: false,
      disableStateNetworkProvider: true,
      disableStateBroadcast: true,
      clockPolicy: { mode: 'independent', tickHz: 5 }
    });
    await kernel.initialize();
    console.info('[wxglobe] PeerCompute kernel initialized (network disabled until start)');
    return kernel;
  } catch (err) {
    console.warn('[wxglobe] PeerCompute init skipped', err);
    return null;
  }
}

bootstrapPeerCompute();
