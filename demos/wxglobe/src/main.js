import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';
import { NodeKernel } from '@peercompute';
import { listDataSources, getDefaultDataSource, getDataSource } from './dataSources.js';
import { WeatherManager } from './weatherManager.js';
import { WindLayer } from './windLayer.js';

const TERRARIUM_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

const statusEl = document.getElementById('provider-status');
const baseLayerSelect = document.getElementById('base-layer');
const resolutionSelect = document.getElementById('resolution');
const datasetSelect = document.getElementById('dataset');
const datasetNotes = document.getElementById('dataset-notes');
const windCanvas = document.getElementById('wind-canvas');
const altitudeSliderEl = document.getElementById('altitude-slider');
const altitudeMinEl = document.getElementById('altitude-min');
const altitudeMaxEl = document.getElementById('altitude-max');
const windStatusEl = document.getElementById('wind-status');
const reloadBtn = document.getElementById('reload-terrain');
const flyHomeBtn = document.getElementById('fly-home');
const overlayEl = document.getElementById('overlay');
const toggleBtn = document.getElementById('toggle-controls');

const weatherManager = new WeatherManager({
  onStatus: (msg) => setStatus(msg)
});

const blueMarbleImagery = await Cesium.SingleTileImageryProvider.fromUrl('/earth-blue-marble-5400x2700.jpg', {
  rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
  credit: '© NASA Blue Marble'
});

const osmImagery = new Cesium.UrlTemplateImageryProvider({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  credit: '© OpenStreetMap'
});

const darkImagery = new Cesium.UrlTemplateImageryProvider({
  url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
  subdomains: ['a', 'b', 'c', 'd'],
  credit: '© CartoDB, © OpenStreetMap'
});

function safeTerrainProvider(mode) {
  try {
    const p = createTerrainProvider(mode);
    return p;
  } catch (err) {
    console.warn('[terrain] falling back to ellipsoid', err);
    setStatus('terrain fallback (ellipsoid)', true);
    return new Cesium.EllipsoidTerrainProvider();
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

function setWindStatus(text, isError = false) {
  if (!windStatusEl) return;
  windStatusEl.textContent = text;
  windStatusEl.classList.toggle('error', isError);
}

function normalizePressureMb(value) {
  if (!Number.isFinite(value)) return null;
  return value > 2000 ? value / 100 : value;
}

function pressureToAltitudeMeters(pressureMb) {
  const normalized = normalizePressureMb(pressureMb);
  if (!Number.isFinite(normalized)) return null;
  return 44330 * (1 - Math.pow(normalized / 1013.25, 0.1903));
}

function formatLevelLabel(level) {
  const normalized = normalizePressureMb(level);
  if (!Number.isFinite(normalized)) return '--';
  const altitudeMeters = pressureToAltitudeMeters(normalized);
  const altitudeKm = altitudeMeters ? (altitudeMeters / 1000).toFixed(1) : null;
  return altitudeKm ? `${Math.round(normalized)} mb (~${altitudeKm} km)` : `${Math.round(normalized)} mb`;
}

class AltitudeRangeSlider {
  constructor(container, { onChange } = {}) {
    this.container = container;
    this.track = container.querySelector('.altitude-track');
    this.rangeEl = container.querySelector('.altitude-range');
    this.minHandle = container.querySelector('[data-handle="min"]');
    this.maxHandle = container.querySelector('[data-handle="max"]');
    this.onChange = onChange || (() => {});

    this.levels = [];
    this.minIndex = 0;
    this.maxIndex = 0;
    this.activeHandle = null;

    const startDrag = (handle) => (evt) => {
      if (!this.levels.length) return;
      this.activeHandle = handle;
      evt.preventDefault();
      evt.currentTarget.setPointerCapture(evt.pointerId);
    };

    this.minHandle.addEventListener('pointerdown', startDrag('min'));
    this.maxHandle.addEventListener('pointerdown', startDrag('max'));

    window.addEventListener('pointermove', (evt) => {
      if (!this.activeHandle || !this.levels.length) return;
      this.updateFromPointer(evt.clientY);
    });

    window.addEventListener('pointerup', () => {
      this.activeHandle = null;
    });
  }

  setDisabled(disabled) {
    this.container.classList.toggle('disabled', disabled);
  }

  setLevels(levels) {
    if (!Array.isArray(levels) || levels.length === 0) {
      this.levels = [];
      this.setDisabled(true);
      return;
    }
    this.setDisabled(false);
    this.levels = [...levels].sort((a, b) => b - a);
    this.minIndex = 0;
    this.maxIndex = this.levels.length - 1;
    this.updateUI();
    this.emitChange();
  }

  updateFromPointer(clientY) {
    const rect = this.track.getBoundingClientRect();
    const clamped = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const ratio = 1 - clamped / rect.height;
    const index = Math.round(ratio * (this.levels.length - 1));

    if (this.activeHandle === 'min') {
      this.minIndex = Math.min(index, this.maxIndex);
    } else if (this.activeHandle === 'max') {
      this.maxIndex = Math.max(index, this.minIndex);
    }
    this.updateUI();
    this.emitChange();
  }

  updateUI() {
    if (!this.levels.length) return;
    const steps = Math.max(this.levels.length - 1, 1);
    const height = this.track.clientHeight;
    const handleOffset = this.minHandle.offsetHeight / 2 || 12;
    const minRatio = this.minIndex / steps;
    const maxRatio = this.maxIndex / steps;
    const minY = height * (1 - minRatio);
    const maxY = height * (1 - maxRatio);
    const minTop = -handleOffset;
    const maxTop = height - handleOffset;

    this.minHandle.style.top = `${Math.min(Math.max(minY - handleOffset, minTop), maxTop)}px`;
    this.maxHandle.style.top = `${Math.min(Math.max(maxY - handleOffset, minTop), maxTop)}px`;

    const rangeTop = Math.min(minY, maxY);
    const rangeBottom = Math.max(minY, maxY);
    this.rangeEl.style.top = `${rangeTop}px`;
    this.rangeEl.style.height = `${rangeBottom - rangeTop}px`;
  }

  emitChange() {
    const minLevel = this.levels[this.minIndex];
    const maxLevel = this.levels[this.maxIndex];
    this.onChange({
      minIndex: this.minIndex,
      maxIndex: this.maxIndex,
      minLevel,
      maxLevel
    });
  }
}

function createTerrainProvider(mode) {
  const maxLevel = mode === '90m' ? 11 : 14; // clamp zoom for ~90m; 30m uses higher zooms

  return new Cesium.CustomHeightmapTerrainProvider({
    width: 256,
    height: 256,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    credit: new Cesium.Credit(`Terrarium ${mode}`),
    callback: async (x, y, level) => {
      // Don't fetch tiles beyond maxLevel
      if (level > maxLevel) {
        return undefined;
      }

      const url = TERRARIUM_URL
        .replace('{z}', level)
        .replace('{x}', x)
        .replace('{y}', y);

      try {
        const { buffer } = await loadTerrariumTile(url);
        return buffer; // Return Float32Array directly
      } catch (err) {
        console.error('[terrain] tile error', { x, y, level, url }, err);
        setStatus(`terrain error z${level}/${x}/${y}`, true);
        return undefined; // Fallback to parent tile
      }
    }
  });
}

const viewer = new Cesium.Viewer('viewer', {
  imageryProvider: blueMarbleImagery, // Use Blue Marble as base; can add OSM layer on top
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

const windLayer = new WindLayer(viewer, windCanvas, {
  onStatus: (msg, isError) => setWindStatus(msg, isError)
});
windLayer.start();

const altitudeSlider = new AltitudeRangeSlider(altitudeSliderEl, {
  onChange: ({ minIndex, maxIndex, minLevel, maxLevel }) => {
    altitudeMinEl.textContent = formatLevelLabel(minLevel);
    altitudeMaxEl.textContent = formatLevelLabel(maxLevel);
    windLayer.setAltitudeRange(minIndex, maxIndex);
  }
});
altitudeSlider.setDisabled(true);
altitudeMinEl.textContent = '--';
altitudeMaxEl.textContent = '--';

function applyBaseLayer(layerType) {
  try {
    // Remove all imagery layers
    viewer.imageryLayers.removeAll();

    switch (layerType) {
      case 'blue-marble':
        viewer.imageryLayers.addImageryProvider(blueMarbleImagery);
        setStatus('imagery: Blue Marble (offline)');
        break;

      case 'dark':
        viewer.imageryLayers.addImageryProvider(darkImagery);
        setStatus('imagery: Dark (no labels)');
        break;

      case 'osm':
        viewer.imageryLayers.addImageryProvider(osmImagery);
        setStatus('imagery: OpenStreetMap');
        break;

      case 'osm-overlay':
        // Add Blue Marble first (base)
        viewer.imageryLayers.addImageryProvider(blueMarbleImagery);
        // Add OSM on top with transparency
        const osmLayer = viewer.imageryLayers.addImageryProvider(osmImagery);
        osmLayer.alpha = 0.8;
        setStatus('imagery: OSM + Blue Marble');
        break;

      default:
        console.warn('[imagery] unknown layer type', layerType);
    }
  } catch (err) {
    console.error('[imagery] failed to apply base layer', err);
    setStatus('imagery: layer switch failed', true);
  }
}

// Initialize with dark basemap (default)
applyBaseLayer('dark');

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

baseLayerSelect.addEventListener('change', (e) => {
  applyBaseLayer(e.target.value);
});

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
  if (!next) {
    altitudeSlider.updateUI();
  }
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

let datasetLoadToken = 0;

function applyWindLevels(result) {
  const levels = result?.grid?.levels;
  const levelValues = windLayer.setData(levels);
  if (!levelValues || levelValues.length === 0) {
    altitudeSlider.setDisabled(true);
    altitudeMinEl.textContent = '--';
    altitudeMaxEl.textContent = '--';
    return;
  }
  altitudeSlider.setLevels(levelValues);
}

function loadWeatherDataset(id) {
  const src = getDataSource(id);
  renderDatasetInfo(src);
  if (!src) return Promise.reject(new Error(`Unknown source ${id}`));

  const token = ++datasetLoadToken;
  setWindStatus('wind: loading');
  return weatherManager
    .load(src.id)
    .then((res) => {
      if (token !== datasetLoadToken) return;
      applyWindLevels(res.result);
      return res;
    })
    .catch((err) => {
      if (token !== datasetLoadToken) return;
      setWindStatus('wind: load failed', true);
      throw err;
    });
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
  const id = e.target.value;
  const src = getDataSource(id);
  console.info('[wxglobe] selected dataset', src?.id, src?.urlPattern);
  loadWeatherDataset(id)
    .then((res) => {
      if (res) {
        console.info('[wxglobe] dataset loaded (stub)', res);
      }
    })
    .catch((err) => {
      console.error('[wxglobe] dataset load failed', err);
      setStatus(`dataset load failed: ${id}`, true);
    });
});

populateDatasets();

// Kick off default dataset load
const def = getDefaultDataSource();
if (def) {
  loadWeatherDataset(def.id)
    .then((res) => {
      if (res) {
        console.info('[wxglobe] default dataset loaded', res);
      }
    })
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
