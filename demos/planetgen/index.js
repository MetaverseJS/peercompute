import * as THREE from 'three';
import { TinyPlanetControls } from './TinyPlanetControls.js';
import { PlanetManager } from './PlanetManager.js';
import { SceneManager } from './SceneManager.js';
import { InputRouter } from './InputRouter.js';
import { WaterCycleSystem } from './WaterCycleSystem.js';
import { WaterCycleVolumeSystem } from './WaterCycleVolumeSystem.js';
import { RainSystem } from './RainSystem.js';
import { WindVisualizationSystem } from './WindVisualizationSystem.js';
import { clamp, isMobileDevice, sampleDataTextureRGBA } from './utils.js';
import { BASE_RADIUS_UNITS, DEFAULT_DIAMETER_KM, DEFAULT_RADIUS_M, PERSON_HEIGHT_M, MAX_DELTA_TIME, PRESETS } from './constants.js';
import { UIManager } from './UIManager.js';
import { WindSystem } from './WindSystem.js';
import { getSharedDevice } from './peercomputeDevice.js';

const canvas = document.getElementById('viewport');
const hudEl = document.getElementById('hud');
const hudToggleEl = document.getElementById('hudToggle');
const hudContentEl = document.getElementById('hudContent');
const statusEl = document.getElementById('status');
const presetEl = document.getElementById('preset');
const regenBtn = document.getElementById('regen');
const helpToggleEl = document.getElementById('helpToggle');
const helpPanelEl = document.getElementById('helpPanel');
const helpContentEl = document.getElementById('helpContent');
const resolutionEl = document.getElementById('resolution');
const platesEl = document.getElementById('plates');
const plateSizeVarianceEl = document.getElementById('plateSizeVariance');
const jitterEl = document.getElementById('jitter');
const heightScaleEl = document.getElementById('heightScale');
const iterationsEl = document.getElementById('iterations');
const erosionRateEl = document.getElementById('erosionRate');
const evaporationEl = document.getElementById('evaporation');
const seaLevelEl = document.getElementById('seaLevel');
const smoothPassesEl = document.getElementById('smoothPasses');
const subdivisionsEl = document.getElementById('subdivisions');
const iceCapEl = document.getElementById('iceCap');
const plateDeltaEl = document.getElementById('plateDelta');
const faultTypeEl = document.getElementById('faultType');
const desymmetrizeTilingEl = document.getElementById('desymmetrizeTiling');
const atmosphereEl = document.getElementById('atmosphere');
const jitterValueEl = document.getElementById('jitterValue');
const heightScaleValueEl = document.getElementById('heightScaleValue');
const erosionRateValueEl = document.getElementById('erosionRateValue');
const evaporationValueEl = document.getElementById('evaporationValue');
const seaLevelValueEl = document.getElementById('seaLevelValue');
const smoothPassesValueEl = document.getElementById('smoothPassesValue');
const subdivisionsValueEl = document.getElementById('subdivisionsValue');
const iceCapValueEl = document.getElementById('iceCapValue');
const plateDeltaValueEl = document.getElementById('plateDeltaValue');
const plateSizeVarianceValueEl = document.getElementById('plateSizeVarianceValue');
const atmosphereValueEl = document.getElementById('atmosphereValue');
const atmosphereHeightEl = document.getElementById('atmosphereHeight');
const atmosphereHeightValueEl = document.getElementById('atmosphereHeightValue');
const atmosphereToggleEl = document.getElementById('atmosphereToggle');
const atmosphereAlphaEl = document.getElementById('atmosphereAlpha');
const atmosphereAlphaValueEl = document.getElementById('atmosphereAlphaValue');
const atmosphereColorEl = document.getElementById('atmosphereColor');
const cloudToggleEl = document.getElementById('cloudToggle');
const cloudAlphaEl = document.getElementById('cloudAlpha');
const cloudAlphaValueEl = document.getElementById('cloudAlphaValue');
const cloudSpeedEl = document.getElementById('cloudSpeed');
const cloudSpeedValueEl = document.getElementById('cloudSpeedValue');
const cloudQuantityEl = document.getElementById('cloudQuantity');
const cloudQuantityValueEl = document.getElementById('cloudQuantityValue');
const cloudHeightEl = document.getElementById('cloudHeight');
const cloudHeightValueEl = document.getElementById('cloudHeightValue');
const cloudColorEl = document.getElementById('cloudColor');
const cloudResolutionEl = document.getElementById('cloudResolution');
const cloudResolutionValueEl = document.getElementById('cloudResolutionValue');
const cloudShaderEl = document.getElementById('cloudShader');
const cloudLayersEl = document.getElementById('cloudLayers');
if (cloudToggleEl) {
    // Default to volumetric/water-cycle clouds; leave the simple layer off unless user opts in.
    cloudToggleEl.checked = false;
}
const addCloudLayerBtn = document.getElementById('addCloudLayer');
const waterCycleToggleEl = document.getElementById('waterCycleToggle');
const waterCycleCloudToggleEl = document.getElementById('waterCycleCloudToggle');
const waterCycleRunEl = document.getElementById('waterCycleRun');
const waterCycleStepBtn = document.getElementById('waterCycleStep');
const weatherAutoScaleEl = document.getElementById('weatherAutoScale');
const weatherSimModeEl = document.getElementById('weatherSimMode');
const weatherVolumeResEl = document.getElementById('weatherVolumeRes');
const weatherVolumeResValueEl = document.getElementById('weatherVolumeResValue');
const weatherRayStepsMinEl = document.getElementById('weatherRayStepsMin');
const weatherRayStepsMinValueEl = document.getElementById('weatherRayStepsMinValue');
const weatherRayStepsMaxEl = document.getElementById('weatherRayStepsMax');
const weatherRayStepsMaxValueEl = document.getElementById('weatherRayStepsMaxValue');
const weatherRayBundleEl = document.getElementById('weatherRayBundle');
const weatherRayBundleValueEl = document.getElementById('weatherRayBundleValue');
const weatherAtmoThicknessEl = document.getElementById('weatherAtmoThickness');
const weatherAtmoThicknessValueEl = document.getElementById('weatherAtmoThicknessValue');
const axialTiltEl = document.getElementById('axialTilt');
const axialTiltValueEl = document.getElementById('axialTiltValue');
const seasonProgressEl = document.getElementById('seasonProgress');
const seasonProgressValueEl = document.getElementById('seasonProgressValue');
const weatherDebugEl = document.getElementById('weatherDebug');
const volumeSliceEl = document.getElementById('volumeSlice');
const volumeSliceValueEl = document.getElementById('volumeSliceValue');
let volumeDebugSprite = null;
const weatherSpeedEl = document.getElementById('weatherSpeed');
const weatherSpeedValueEl = document.getElementById('weatherSpeedValue');
const weatherUpdateHzEl = document.getElementById('weatherUpdateHz');
const weatherUpdateHzValueEl = document.getElementById('weatherUpdateHzValue');
const weatherMoistureLayersEl = document.getElementById('weatherMoistureLayers');
const weatherMoistureLayersValueEl = document.getElementById('weatherMoistureLayersValue');
const weatherEvapEl = document.getElementById('weatherEvap');
const weatherEvapValueEl = document.getElementById('weatherEvapValue');
const weatherPrecipEl = document.getElementById('weatherPrecip');
const weatherPrecipValueEl = document.getElementById('weatherPrecipValue');
const weatherWindEl = document.getElementById('weatherWind');
const weatherWindValueEl = document.getElementById('weatherWindValue');
const weatherWetnessEl = document.getElementById('weatherWetness');
const weatherWetnessValueEl = document.getElementById('weatherWetnessValue');
const weatherOceanInertiaEl = document.getElementById('weatherOceanInertia');
const weatherOceanInertiaValueEl = document.getElementById('weatherOceanInertiaValue');
const weatherRainFxToggleEl = document.getElementById('weatherRainFxToggle');
const weatherRainFxEl = document.getElementById('weatherRainFx');
const weatherRainFxValueEl = document.getElementById('weatherRainFxValue');
const weatherRainHazeEl = document.getElementById('weatherRainHaze');
const weatherRainHazeValueEl = document.getElementById('weatherRainHazeValue');
const waterShaderEl = document.getElementById('waterShader');
const movePadEl = document.getElementById('movePad');
const lookPadEl = document.getElementById('lookPad');
const mobileControlsEl = document.getElementById('mobileControls');
const surfaceOnlyBtn = document.getElementById('surfaceOnly');
const configToggleEl = document.getElementById('configToggle');
const configPanelEl = document.getElementById('configPanel');
const vrToggleEl = document.getElementById('vrToggle');
const reticleEl = document.getElementById('reticle');
const leftStickSensitivityEl = document.getElementById('leftStickSensitivity');
const leftStickSensitivityValueEl = document.getElementById('leftStickSensitivityValue');
const lookSensitivityXEl = document.getElementById('lookSensitivityX');
const lookSensitivityXValueEl = document.getElementById('lookSensitivityXValue');
const lookSensitivityYEl = document.getElementById('lookSensitivityY');
const lookSensitivityYValueEl = document.getElementById('lookSensitivityYValue');
const invertLookEl = document.getElementById('invertLook');
const planetDiameterEl = document.getElementById('planetDiameter');
const planetDiameterValueEl = document.getElementById('planetDiameterValue');

// Constants now imported from constants.js

const DEFAULT_WEATHER_TEX = (() => {
    const data = new Uint8Array([110, 0, 128, 0]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
})();

const DEFAULT_WEATHER_AUX_TEX = (() => {
    const data = new Uint8Array([160, 0, 128, 128]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
})();

function ensureVolumeDebugSprite() {
    if (volumeDebugSprite) return volumeDebugSprite;
    const material = new THREE.SpriteMaterial({
        map: DEFAULT_WEATHER_TEX,
        transparent: true,
        opacity: 1.0,
        depthTest: false,
        depthWrite: false,
        toneMapped: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 999;
    sprite.scale.set(5, 5, 1); // in camera space units
    // Move to top-right but keep fully visible.
    sprite.position.set(7.2, 7.5, -12);
    camera.add(sprite);
    volumeDebugSprite = sprite;
    return sprite;
}

function setVolumeDebugEnabled(enabled) {
    volumeDebugEnabled = enabled;
    if (!enabled && volumeDebugSprite) {
        volumeDebugSprite.visible = false;
    }
    if (enabled) {
        ensureVolumeDebugSprite();
        volumeDebugSprite.visible = true;
    }
}

function setVolumeSliceVisibility(show) {
    const field = document.getElementById('volumeSliceField');
    if (field) field.style.display = show ? 'block' : 'none';
}

function setVolumeSliceFromUI(val) {
    if (!volumeSliceEl) return;
    const max = Math.max(0, Number(volumeSliceEl.max) || 0);
    const v = Math.min(Math.max(Math.floor(val), 0), max);
    volumeDebugSlice = v;
    if (volumeSliceEl.value !== String(v)) volumeSliceEl.value = v;
    if (volumeSliceValueEl) volumeSliceValueEl.textContent = v;
    updateVolumeDebugSprite();
}

function syncVolumeSliceRange() {
    if (!volumeSliceEl) return;
    const meta = getWeatherVolumeMeta();
    const n = meta?.n ?? 0;
    const max = Math.max(0, n - 1);
    volumeSliceEl.max = String(max);
    if (volumeDebugSlice > max) {
        volumeDebugSlice = max;
        if (volumeSliceValueEl) volumeSliceValueEl.textContent = max;
    }
}

function getVolumeDebugTexture() {
    const atlas = getWeatherVolumeTexture();
    const meta = getWeatherVolumeMeta();
    if (!atlas || !meta) return null;
    const N = meta.n || 0;
    const cellSize = volumeDebugGrid ? 4 : 1;
    const width = Math.max(1, N * cellSize);
    if (!volumeSliceTexture || volumeSliceTexture.image.width !== width || volumeSliceTexture.image.height !== width) {
        const data = new Uint8Array(Math.max(1, width * width * 4));
        volumeSliceTexture = new THREE.DataTexture(data, width, width, THREE.RGBAFormat, THREE.UnsignedByteType);
        volumeSliceTexture.needsUpdate = true;
        volumeSliceTexture.wrapS = THREE.ClampToEdgeWrapping;
        volumeSliceTexture.wrapT = THREE.ClampToEdgeWrapping;
        volumeSliceTexture.minFilter = THREE.NearestFilter;
        volumeSliceTexture.magFilter = THREE.NearestFilter;
        volumeSliceTexture.generateMipmaps = false;
        volumeSliceTexture.colorSpace = THREE.NoColorSpace;
    }
    const slice = Math.min(Math.max(volumeDebugSlice | 0, 0), Math.max(0, N - 1));
    const tilesX = meta.tilesX || 1;
    const tileX = slice % tilesX;
    const tileY = Math.floor(slice / tilesX);
    const atlasData = atlas.image?.data;
    if (!(atlasData && atlasData.length >= meta.atlasW * meta.atlasH * 4)) return atlas;
    const out = volumeSliceTexture.image.data;
    const line = 0;
    for (let y = 0; y < N; y++) {
        const srcRow = ((tileY * N + y) * meta.atlasW + tileX * N) * 4;
        for (let x = 0; x < N; x++) {
            const si = srcRow + x * 4;
            const cloud = atlasData[si] ?? 0;
            const rain = atlasData[si + 1] ?? 0;
            const p = atlasData[si + 2] ?? 128;
            const rh = atlasData[si + 3] ?? 0;
            const c = Math.min(255, cloud * 2); // boost contrast
            const r = c;
            const g = Math.min(255, rain + c * 0.3);
            const b = Math.min(255, p);
            const a = Math.max(160, rh); // keep visible
            if (!volumeDebugGrid) {
                const dstRow = y * width * 4;
                const di = dstRow + x * 4;
                out[di + 0] = r;
                out[di + 1] = g;
                out[di + 2] = b;
                out[di + 3] = a;
                continue;
            }
            const baseX = x * cellSize;
            const baseY = y * cellSize;
            for (let yy = 0; yy < cellSize; yy++) {
                const dstRow = (baseY + yy) * width * 4;
                for (let xx = 0; xx < cellSize; xx++) {
                    const di = dstRow + (baseX + xx) * 4;
                    const isLine = (xx === 0 || yy === 0);
                    out[di + 0] = isLine ? line : r;
                    out[di + 1] = isLine ? line : g;
                    out[di + 2] = isLine ? line : b;
                    out[di + 3] = isLine ? 255 : a;
                }
            }
        }
    }
    if (volumeDebugGrid && width > 1) {
        const last = width - 1;
        for (let y = 0; y < width; y++) {
            const di = (y * width + last) * 4;
            out[di + 0] = line;
            out[di + 1] = line;
            out[di + 2] = line;
            out[di + 3] = 255;
        }
        const base = last * width * 4;
        for (let x = 0; x < width; x++) {
            const di = base + x * 4;
            out[di + 0] = line;
            out[di + 1] = line;
            out[di + 2] = line;
            out[di + 3] = 255;
        }
    }
    volumeSliceTexture.needsUpdate = true;
    return volumeSliceTexture;
}

function updateVolumeDebugSprite() {
    if (!volumeDebugEnabled || !volumeDebugSprite) return;
    const tex = getVolumeDebugTexture();
    if (!tex) {
        volumeDebugSprite.visible = false;
        return;
    }
    volumeDebugSprite.visible = true;
    volumeDebugSprite.material.map = tex;
    volumeDebugSprite.material.needsUpdate = true;
}

// isMobileDevice now imported from utils.js

const ui = new UIManager({
    onRegen: () => queueAutoRegen(),
    onPreset: (key) => {
        applyPreset(key);
        updateQualityParam(key);
        ui.setStatus('Preset applied. Regenerating…');
        queueAutoRegen();
    },
    onDiameterChange: (km) => handleDiameterChange(km),
    onAtmosphereUpdate: () => handleAtmosphereUpdate(),
    onCloudUpdate: () => handleCloudUpdate(),
    onVRToggle: () => {
        if (xrSession) stopVR();
        else startVR();
    }
});
let sceneManager;
try {
    sceneManager = new SceneManager(canvas);
} catch (err) {
    console.error('WebGL init failed', err);
    ui.setStatus('WebGL context could not be created. Enable WebGL/hardware acceleration or disable XR emulation.');
    throw err;
}
const renderer = sceneManager.renderer;
const scene = sceneManager.scene;
const planetGroup = sceneManager.planetGroup;
const userGroup = sceneManager.userGroup;
const camera = sceneManager.camera;
const controls = sceneManager.controls;
const dirLight = sceneManager.dirLight;
const planetManager = new PlanetManager(sceneManager);
let moon = null;
let moonOrbitPhase = 0;
const moonUniforms = {
    sunDir: { value: new THREE.Vector3(0, 1, 0) }
};
function rebuildMoon() {
    if (moon) {
        scene.remove(moon);
        moon.geometry.dispose();
        moon.material.dispose?.();
    }
    const radiusUnits = Math.max(0.05, (lastPlanetSettings?.radius ?? BASE_RADIUS_UNITS) * 0.2);
    const geom = new THREE.SphereGeometry(radiusUnits, 96, 48);
    // Crater displacement: generate random crater centers for round pits.
    const craterCount = 42;
    const centers = [];
    for (let i = 0; i < craterCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const s = Math.sin(phi);
        centers.push(new THREE.Vector3(Math.cos(theta) * s, Math.cos(phi), Math.sin(theta) * s));
    }
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).normalize();
        let depth = 0;
        for (const c of centers) {
            const d = v.angleTo(c);
            if (d < 0.25) {
                const t = 1 - d / 0.25;
                depth -= t * t * 0.08;
            }
        }
        v.multiplyScalar(1 + depth);
        pos.setXYZ(i, v.x * radiusUnits, v.y * radiusUnits, v.z * radiusUnits);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
        color: 0xe0e6ed,
        roughness: 0.7,
        metalness: 0.0,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.15
    });
    moon = new THREE.Mesh(geom, mat);
    moon.castShadow = true;
    moon.receiveShadow = true;
    scene.add(moon);
}

const input = new InputRouter();
input.setMode(isMobileDevice() ? 'mobile' : 'desktop');
input.setLookMode('orbit');

// Desktop keyboard helpers to ensure jump/down actions are seen even if pointer-lock/key events are swallowed elsewhere.
function bindDesktopKeyboard() {
    const isEditableTarget = (el) => {
        if (!el) return false;
        const tag = el.tagName;
        if (!tag) return false;
        return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
    };
    const handler = (e) => {
        if (isEditableTarget(e.target)) return;
        const down = e.type === 'keydown';
        switch (e.code) {
            case 'ControlLeft':
            case 'ControlRight':
            case 'KeyC':
                input.setAction('down', down);
                break;
            case 'Space':
            case 'Numpad0':
                if (down) input.trigger('jump');
                break;
            default:
                return;
        }
    };
    window.addEventListener('keydown', handler, { passive: false });
    window.addEventListener('keyup', handler, { passive: false });
}
bindDesktopKeyboard();

const tinyControls = new TinyPlanetControls(camera, renderer.domElement, scene, () => {
    controls.enabled = true;
    ui.setStatus('');
    if (savedOrbitState) {
        controls.target.copy(savedOrbitState.target);
        camera.position.copy(savedOrbitState.position);
        savedOrbitState = null;
    }
    updateOrbitBounds();
    resetTrackballState();
    input.setLookMode('orbit');
}, input);
const clock = new THREE.Clock();

let planet = null;
let generating = false;
let autoRegenTimer = null;
let water = null;
let freshwater = null;
let atmosphere = null;
let clouds = [];
let waterCycleCloud = null;
let cloudLayerSettings = planetManager.cloudLayerSettings;
let lastPlanetSettings = null;
let waterCycleSystem = null;
let waterCycleSystem2D = null;
let waterCycleSystem3D = null;
let pendingWaterCycleSurface = null;
let savedOrbitState = null;
let xrSession = null;
let xrPrevButtons = new Map();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let vrSupported = false;
const weatherTmpQuat = new THREE.Quaternion();
const weatherTmpMat4 = new THREE.Matrix4();
const weatherInvRot = new THREE.Matrix3();
const weatherSunWorld = new THREE.Vector3();
const weatherSunLocal = new THREE.Vector3();
const weatherTmpMat3 = new THREE.Matrix3();
const weatherTmpVecA = new THREE.Vector3();
const weatherTmpVecB = new THREE.Vector3();
const weatherTmpVecC = new THREE.Vector3();
const weatherTmpVecD = new THREE.Vector3();
const weatherWindWorld = new THREE.Vector3();
let volumeDebugEnabled = false;
let volumeDebugGrid = false;
let volumeDebugSlice = 0;
let volumeSliceTexture = null;
let volumeRayStepsMin = 28;
let volumeRayStepsMax = 48;
let volumeRayBundle = 1;
let fpsDiv = null;
let fpsSMA = 60;
const WEATHER_AUTO_TIERS_3D = [
    { n: 16, updateHz: 4, rayMin: 10, rayMax: 20, bundle: 4 },
    { n: 24, updateHz: 5, rayMin: 14, rayMax: 26, bundle: 3 },
    { n: 32, updateHz: 6, rayMin: 18, rayMax: 32, bundle: 2 },
    { n: 48, updateHz: 7, rayMin: 22, rayMax: 38, bundle: 2 },
    { n: 64, updateHz: 8, rayMin: 28, rayMax: 48, bundle: 1 }
];
const WEATHER_AUTO_TIERS_2D = [
    { updateHz: 4, moistureLayers: 1 },
    { updateHz: 6, moistureLayers: 2 },
    { updateHz: 8, moistureLayers: 3 },
    { updateHz: 10, moistureLayers: 4 }
];
const WEATHER_AUTO_LIMITS = {
    lowMs: 20,
    highMs: 33,
    downDelayS: 1.5,
    upDelayS: 6.0,
    cooldownDownS: 2.0,
    cooldownUpS: 4.0
};
const weatherAutoState = {
    manual: null,
    tier3d: 0,
    tier2d: 0,
    emaMs: 16.7,
    overBudgetS: 0,
    underBudgetS: 0,
    cooldownS: 0
};

const rainSystem = new RainSystem(scene, { maxDrops: 12000 });
const windSystem = new WindSystem(scene, { maxSprites: 950 });
const windVizSystem = new WindVisualizationSystem(planetGroup);

fpsDiv = document.createElement('div');
fpsDiv.style.position = 'fixed';
fpsDiv.style.top = '8px';
fpsDiv.style.right = '60px';
fpsDiv.style.padding = '4px 8px';
fpsDiv.style.background = 'rgba(0,0,0,0.35)';
fpsDiv.style.color = '#fff';
fpsDiv.style.fontSize = '12px';
fpsDiv.style.fontFamily = 'monospace';
fpsDiv.style.borderRadius = '6px';
fpsDiv.style.pointerEvents = 'none';
fpsDiv.textContent = 'fps: --';
document.body.appendChild(fpsDiv);

window.addEventListener('mousedown', (event) => {
    if (event.button === 1) { // Middle Click
        event.preventDefault();
        
        if (tinyControls.enabled) {
            tinyControls.exit();
            controls.enabled = true;
            return;
        }

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        
        // Raycast against the planet mesh
        if (planet) {
            savedOrbitState = {
                position: camera.position.clone(),
                target: controls.target.clone()
            };
            const intersects = raycaster.intersectObject(planet, false);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                tinyControls.enter(point, planet, camera);
                controls.enabled = false;
                ui.setStatus('Mode: Tiny Planet Explorer (ESC to exit)');
            }
        }
    }
});
renderer.domElement.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    if (!tinyControls.enabled) return;
    if (isMobileDevice()) return;
    if (hudEl && hudEl.contains(event.target)) return;
    if (document.pointerLockElement === renderer.domElement) return;
    renderer.domElement.requestPointerLock?.();
});

function handleSurfaceAction() {
    if (tinyControls.enabled) {
        tinyControls.snapToSurface();
        return;
    }
    if (!planet) return;
    input.setLookMode('surface');
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hit = raycaster.intersectObject(planet, false);
    if (!hit.length) return;
    savedOrbitState = {
        position: camera.position.clone(),
        target: controls.target.clone()
    };
    // Use the same entry path as middle-click so orientation matches.
    tinyControls.enter(hit[0].point, planet, camera);
    controls.enabled = false;
    ui.setStatus('Mode: Tiny Planet Explorer (ESC to exit)');
}

ui.setHudCollapsed(isMobileDevice());

function bindMobileControls() {
    if (!mobileControlsEl || !movePadEl || !lookPadEl) return;
    const set = (action, pressed) => input?.setAction(action, pressed);
    const trigger = (name) => input?.trigger(name);
    const bindPad = (padEl, onMove, onRelease) => {
        let active = false;
        let rect = null;
        const updateRect = () => { rect = padEl.getBoundingClientRect(); };
        const handle = (e) => {
            if (!rect) updateRect();
            const point = e.touches ? e.touches[0] : e;
            const x = point.clientX - rect.left - rect.width / 2;
            const y = point.clientY - rect.top - rect.height / 2;
            const maxR = Math.min(rect.width, rect.height) / 2;
            const dx = Math.max(-maxR, Math.min(maxR, x));
            const dy = Math.max(-maxR, Math.min(maxR, y));
            const nx = dx / maxR;
            const ny = dy / maxR;
            onMove(nx, ny);
        };
        const stop = () => {
            active = false;
            onRelease();
        };
        padEl.addEventListener('pointerdown', (e) => { e.preventDefault(); active = true; updateRect(); handle(e); });
        window.addEventListener('pointermove', (e) => { if (active) { e.preventDefault(); handle(e); } });
        window.addEventListener('pointerup', (e) => { if (active) { e.preventDefault(); stop(); } });
        padEl.addEventListener('touchstart', (e) => { active = true; updateRect(); handle(e); }, { passive: false });
        padEl.addEventListener('touchmove', (e) => { if (active) handle(e); }, { passive: false });
        padEl.addEventListener('touchend', (e) => { if (active) { stop(); } }, { passive: false });
        padEl.addEventListener('touchcancel', (e) => { if (active) { stop(); } }, { passive: false });
    };

    bindPad(movePadEl, (nx, ny) => {
        const sens = Math.max(0.1, getLeftStickSensitivity());
        const threshold = Math.max(0.1, 0.25 / sens);
        set('forward', ny < -threshold);
        set('backward', ny > threshold);
        set('left', nx < -threshold);
        set('right', nx > threshold);
    }, () => {
        set('forward', false);
        set('backward', false);
        set('left', false);
        set('right', false);
    });

    bindPad(lookPadEl, (nx, ny) => {
        // scale look
        const sx = Math.max(0.1, getLookSensitivityX());
        const sy = Math.max(0.1, getLookSensitivityY());
        const invert = isInvertLook() ? -1 : 1;
        input?.addLookDelta(nx * 6 * sx, ny * 6 * sy * invert);
    }, () => {});

    mobileControlsEl.querySelectorAll('[data-trigger]').forEach((btn) => {
        const action = btn.getAttribute('data-trigger');
        const fire = () => {
            trigger(action);
            if (action === 'surface') handleSurfaceAction();
        };
        btn.addEventListener('pointerdown', (e) => { e.preventDefault(); fire(); });
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); fire(); }, { passive: false });
    });
    mobileControlsEl.querySelectorAll('.action-btn[data-action]').forEach((btn) => {
        const action = btn.getAttribute('data-action');
        const down = () => set(action, true);
        const up = () => set(action, false);
        btn.addEventListener('pointerdown', (e) => { e.preventDefault(); down(); });
        btn.addEventListener('pointerup', (e) => { e.preventDefault(); up(); });
        btn.addEventListener('pointerleave', up);
        btn.addEventListener('pointercancel', up);
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); down(); }, { passive: false });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); up(); }, { passive: false });
        btn.addEventListener('touchcancel', (e) => { e.preventDefault(); up(); }, { passive: false });
    });

    if (surfaceOnlyBtn) {
        surfaceOnlyBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); trigger('surface'); });
        surfaceOnlyBtn.addEventListener('touchstart', (e) => { e.preventDefault(); trigger('surface'); }, { passive: false });
    }
}

function getPlanetDiameterKm() {
    return ui.getPlanetDiameterKm();
}

function getPlanetScale() {
    return getPlanetDiameterKm() / DEFAULT_DIAMETER_KM;
}

function getWeatherTexture() {
    if (waterCycleToggleEl?.checked && waterCycleSystem?.enabled && waterCycleSystem.ready && waterCycleSystem.hasSurface) {
        return waterCycleSystem.getTexture();
    }
    return DEFAULT_WEATHER_TEX;
}

function getWeatherAuxTexture() {
    if (waterCycleToggleEl?.checked && waterCycleSystem?.enabled && waterCycleSystem.ready && waterCycleSystem.hasSurface) {
        return waterCycleSystem.getAuxTexture();
    }
    return DEFAULT_WEATHER_AUX_TEX;
}

function getWeatherVolumeTexture() {
    if (!(waterCycleToggleEl?.checked ?? false)) return null;
    if (!(waterCycleCloudToggleEl?.checked ?? false)) return null;
    if (!waterCycleSystem?.enabled || !waterCycleSystem.ready || !waterCycleSystem.hasSurface) return null;
    if (typeof waterCycleSystem.getVolumeTexture !== 'function') return null;
    return waterCycleSystem.getVolumeTexture();
}

function getWeatherVolumeMeta() {
    if (!waterCycleSystem?.enabled || !waterCycleSystem.ready || !waterCycleSystem.hasSurface) return null;
    if (typeof waterCycleSystem.getVolumeMeta !== 'function') return null;
    return waterCycleSystem.getVolumeMeta();
}

function computeWindWorldFromAux(tex, invScale, planetInvRot, out) {
    if (!tex?.image?.data || !planetInvRot) {
        (out ?? weatherWindWorld).set(0, 0, 0);
        return out ?? weatherWindWorld;
    }

    // Camera direction in planet-local unscaled coordinates.
    weatherTmpVecA.copy(camera.position).multiplyScalar(invScale).applyMatrix3(planetInvRot);
    if (weatherTmpVecA.lengthSq() < 1e-12) {
        (out ?? weatherWindWorld).set(0, 0, 0);
        return out ?? weatherWindWorld;
    }
    const dirLocal = weatherTmpVecA.normalize();
    const u = Math.atan2(dirLocal.z, dirLocal.x) / (2 * Math.PI) + 0.5;
    const v = Math.asin(clamp(dirLocal.y, -1, 1)) / Math.PI + 0.5;
    const px = sampleDataTextureRGBA(tex, u, v);
    const uNorm = ((px.b ?? 128) / 255 - 0.5) * 2;
    const vNorm = ((px.a ?? 128) / 255 - 0.5) * 2;
    // Scale decoded winds up so ground FX remain visible.
    const windScale = 40;

    // Local tangent basis (east/north).
    weatherTmpVecB.set(-dirLocal.z, 0, dirLocal.x);
    if (weatherTmpVecB.lengthSq() < 1e-8) weatherTmpVecB.set(1, 0, 0);
    weatherTmpVecB.normalize();
    weatherTmpVecC.crossVectors(dirLocal, weatherTmpVecB).normalize();

    // Wind vector in planet-local (tangent plane).
    weatherTmpVecD.copy(weatherTmpVecB).multiplyScalar(uNorm).addScaledVector(weatherTmpVecC, vNorm).multiplyScalar(windScale);

    // Rotate into world space (rot = transpose(invRot) for pure rotation).
    weatherTmpMat3.copy(planetInvRot).transpose();
    const windWorld = (out ?? weatherWindWorld).copy(weatherTmpVecD).applyMatrix3(weatherTmpMat3);

    // Keep mostly tangent at the camera location.
    const upWorld = weatherTmpVecA.copy(camera.position).normalize();
    windWorld.addScaledVector(upWorld, -windWorld.dot(upWorld));

    // Avoid NaNs.
    const len = windWorld.length();
    if (!(len > 1e-6)) windWorld.set(0, 0, 0);
    return windWorld;
}

function setPlanetWeatherTexture(texture) {
    if (!planet) return;
    const material = planet.material;
    if (!material?.userData) return;
    if (material.userData.weather) {
        material.userData.weather.texture = texture;
    }
    if (material.userData.shader?.uniforms?.uWeatherMap) {
        material.userData.shader.uniforms.uWeatherMap.value = texture;
    }
}

function setPlanetWeatherAuxTexture(texture) {
    if (!planet) return;
    const material = planet.material;
    if (!material?.userData) return;
    if (material.userData.weather) {
        material.userData.weather.auxTexture = texture;
    }
    if (material.userData.shader?.uniforms?.uWeatherAuxMap) {
        material.userData.shader.uniforms.uWeatherAuxMap.value = texture;
    }
}

function setPlanetWeatherStrength(strength) {
    if (!planet) return;
    const material = planet.material;
    if (!material?.userData) return;
    if (material.userData.weather) {
        material.userData.weather.strength = strength;
    }
    if (material.userData.shader?.uniforms?.uWeatherStrength) {
        material.userData.shader.uniforms.uWeatherStrength.value = strength;
    }
}

function setPlanetWeatherDebugMode(mode) {
    if (!planet) return;
    const material = planet.material;
    if (!material?.userData) return;
    if (material.userData.weather) {
        material.userData.weather.debug = mode;
    }
    if (material.userData.shader?.uniforms?.uWeatherDebug) {
        material.userData.shader.uniforms.uWeatherDebug.value = mode;
    }
}

function syncWaterCycleSurfaceFromForge(forge, settings) {
    if (!forge || !settings) return;
    const planetRadiusM = (settings.planetDiameterKm ?? getPlanetDiameterKm()) * 1000 * 0.5;
    const args = { heightmap: forge.data, size: forge.size, seaLevel: settings.seaLevel, planetRadiusM };
    pendingWaterCycleSurface = args;

    const systems = [waterCycleSystem, waterCycleSystem2D, waterCycleSystem3D].filter(Boolean);
    for (const sys of systems) {
        if (sys?.enabled && sys.ready) {
            sys.setPlanetSurface(args);
        }
    }

    setPlanetWeatherTexture(getWeatherTexture());
    setPlanetWeatherAuxTexture(getWeatherAuxTexture());
}

function getPersonHeightUnits() {
    const defaultRadiusMeters = (DEFAULT_DIAMETER_KM * 1000) * 0.5;
    const metersPerUnit = defaultRadiusMeters / BASE_RADIUS_UNITS;
    const baseHeightUnits = PERSON_HEIGHT_M / metersPerUnit;
    return baseHeightUnits * getPlanetScale();
}

function getLeftStickSensitivity() {
    const v = parseFloat(leftStickSensitivityEl?.value);
    return Number.isFinite(v) ? v : 1;
}
function getLookSensitivityX() {
    const v = parseFloat(lookSensitivityXEl?.value);
    return Number.isFinite(v) ? v : 0.4;
}
function getLookSensitivityY() {
    const v = parseFloat(lookSensitivityYEl?.value);
    return Number.isFinite(v) ? v : 0.4;
}
function isInvertLook() {
    return !!invertLookEl?.checked;
}

function updateOrbitBounds() {
    if (!lastPlanetSettings) return;
    const planetRadius = (lastPlanetSettings.radius ?? BASE_RADIUS_UNITS) + (lastPlanetSettings.heightScale ?? 0);
    const scale = getPlanetScale();
    const surfaceRadius = Math.max(0.5, planetRadius * scale);
    controls.minDistance = Math.max(0.2, surfaceRadius * 0.1);
    controls.maxDistance = Math.max(surfaceRadius * 16, controls.minDistance + 1);
    const camOffset = camera.position.clone().sub(controls.target);
    const dist = camOffset.length();
    const clampedDist = clamp(dist, controls.minDistance, controls.maxDistance);
    if (Math.abs(clampedDist - dist) > 1e-4) {
        camOffset.setLength(clampedDist);
        camera.position.copy(controls.target).add(camOffset);
    }
    camera.near = Math.max(0.002, surfaceRadius * 0.0005);
    camera.far = Math.max(150, surfaceRadius * 14);
    camera.updateProjectionMatrix();
}

function resetTrackballState() {
    if (!controls) return;
    if (controls.state !== undefined) controls.state = -1;
    if (controls.keyState !== undefined) controls.keyState = -1;
    if (controls._movePrev && controls._moveCurr) controls._movePrev.copy(controls._moveCurr);
    if (controls._zoomStart && controls._zoomEnd) controls._zoomStart.copy(controls._zoomEnd);
    if (controls._panStart && controls._panEnd) controls._panStart.copy(controls._panEnd);
}

function applyPlanetScale() {
    planetManager.applyPlanetScale(getPlanetDiameterKm());
    updateOrbitBounds();
}

function syncMobileVisibility() {
    if (!mobileControlsEl) return;
    const mobile = isMobileDevice();
    const inTiny = tinyControls.enabled;
    mobileControlsEl.style.display = 'block';
    if (movePadEl) movePadEl.style.display = mobile && inTiny ? 'grid' : 'none';
    if (lookPadEl) lookPadEl.style.display = mobile && inTiny ? 'grid' : 'none';
    const actionColumn = mobileControlsEl.querySelector('.action-column');
    if (actionColumn) actionColumn.style.display = inTiny ? 'grid' : 'none';
    if (surfaceOnlyBtn) surfaceOnlyBtn.style.display = inTiny ? 'none' : 'inline-flex';
    if (reticleEl) {
        const showReticle = !mobile || inTiny;
        reticleEl.style.display = showReticle ? 'block' : 'none';
    }
    updateHelpContent();
}

function updateHelpContent() {
    if (!helpContentEl) return;
    const mobile = isMobileDevice();
    const inTiny = tinyControls.enabled;
    let html = '';

    if (inTiny) {
        html += '<h4>First Person</h4><ul>';
        if (!mobile) html += '<li>Mouse move to look (click to capture)</li>';
        html += '<li>WASD to move, Shift to run, Space to jump</li>';
        html += '<li>Arrow keys to look, Q/E to roll</li>';
        html += '<li>F to toggle fly, Ctrl to descend, Esc to exit</li>';
        html += '<li>On-screen buttons: Jump, Fly, Surface, Exit, Run</li>';
        html += '</ul>';
        if (mobile) {
            html += '<h4>Touch</h4><ul>';
            html += '<li>Left stick moves, right stick looks</li>';
            html += '</ul>';
        }
    } else {
        html += '<h4>Orbit</h4><ul>';
        html += '<li>Drag to orbit, scroll to zoom</li>';
        html += '<li>Middle click or Surface button to enter first person</li>';
        html += '</ul>';
    }

    helpContentEl.innerHTML = html;
}

function toggleHelpPanel() {
    if (!helpPanelEl || !helpToggleEl) return;
    const next = helpPanelEl.style.display !== 'block';
    helpPanelEl.style.display = next ? 'block' : 'none';
    helpToggleEl.setAttribute('aria-expanded', next.toString());
    if (next) updateHelpContent();
}

function getWalkSpeed() {
    return 0.35 * Math.max(0.1, getPlanetScale());
}

function updateRangeLabels() {
    ui.updateRangeLabels();
    if (weatherSpeedEl && weatherSpeedValueEl) weatherSpeedValueEl.textContent = Number(weatherSpeedEl.value).toFixed(0);
    if (weatherUpdateHzEl && weatherUpdateHzValueEl) weatherUpdateHzValueEl.textContent = Number(weatherUpdateHzEl.value).toFixed(0);
    if (weatherVolumeResEl && weatherVolumeResValueEl) weatherVolumeResValueEl.textContent = Number(weatherVolumeResEl.value).toFixed(0);
    if (weatherRayStepsMinEl && weatherRayStepsMinValueEl) weatherRayStepsMinValueEl.textContent = Number(weatherRayStepsMinEl.value).toFixed(0);
    if (weatherRayStepsMaxEl && weatherRayStepsMaxValueEl) weatherRayStepsMaxValueEl.textContent = Number(weatherRayStepsMaxEl.value).toFixed(0);
    if (weatherRayBundleEl && weatherRayBundleValueEl) weatherRayBundleValueEl.textContent = Number(weatherRayBundleEl.value).toFixed(0);
    if (weatherAtmoThicknessEl && weatherAtmoThicknessValueEl) weatherAtmoThicknessValueEl.textContent = Number(weatherAtmoThicknessEl.value).toFixed(0);
    if (axialTiltEl && axialTiltValueEl) axialTiltValueEl.textContent = Number(axialTiltEl.value).toFixed(1);
    if (seasonProgressEl && seasonProgressValueEl) seasonProgressValueEl.textContent = Number(seasonProgressEl.value).toFixed(2);
    if (weatherMoistureLayersEl && weatherMoistureLayersValueEl) weatherMoistureLayersValueEl.textContent = Number(weatherMoistureLayersEl.value).toFixed(0);
    if (weatherEvapEl && weatherEvapValueEl) weatherEvapValueEl.textContent = Number(weatherEvapEl.value).toFixed(2);
    if (weatherPrecipEl && weatherPrecipValueEl) weatherPrecipValueEl.textContent = Number(weatherPrecipEl.value).toFixed(2);
    if (weatherWindEl && weatherWindValueEl) weatherWindValueEl.textContent = Number(weatherWindEl.value).toFixed(2);
    if (weatherWetnessEl && weatherWetnessValueEl) weatherWetnessValueEl.textContent = Number(weatherWetnessEl.value).toFixed(2);
    if (weatherOceanInertiaEl && weatherOceanInertiaValueEl) weatherOceanInertiaValueEl.textContent = Number(weatherOceanInertiaEl.value).toFixed(2);
    if (weatherRainFxEl && weatherRainFxValueEl) weatherRainFxValueEl.textContent = Number(weatherRainFxEl.value).toFixed(2);
    if (weatherRainHazeEl && weatherRainHazeValueEl) weatherRainHazeValueEl.textContent = Number(weatherRainHazeEl.value).toFixed(2);
}

function applyPreset(key) {
    ui.applyPreset(key);
    const preset = PRESETS[key] || PRESETS.balanced;
    applyWeatherPreset(preset);
    if (waterShaderEl) waterShaderEl.value = key === 'fast' ? 'fast' : 'balanced';
}

function readSettings() {
    const base = ui.readSettings();
    base.waterShader = getWaterShader();
    return base;
}

function writeSettings(settings) {
    ui.writeSettings(settings);
}

function getQualityPresetFromUrl() {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search || '');
    const quality = (params.get('quality') || '').toLowerCase();
    if (quality === 'fast' || quality === 'balanced' || quality === 'high') return quality;
    return null;
}

function getWaterShader() {
    return waterShaderEl?.value || 'balanced';
}

function updateQualityParam(key) {
    if (typeof window === 'undefined') return;
    const quality = (key || '').toLowerCase();
    if (quality !== 'fast' && quality !== 'balanced' && quality !== 'high') return;
    const url = new URL(window.location.href);
    url.searchParams.set('quality', quality);
    window.history.replaceState({}, '', url);
}

function applyWeatherPreset(preset) {
    const setValue = (el, value) => {
        if (!el || value === undefined || value === null) return false;
        el.value = String(value);
        return true;
    };
    const setChecked = (el, value) => {
        if (!el || value === undefined || value === null) return false;
        el.checked = !!value;
        return true;
    };

    let touched = false;
    touched = setChecked(waterCycleToggleEl, preset.waterCycleEnabled) || touched;
    touched = setChecked(waterCycleCloudToggleEl, preset.waterCycleCloudEnabled) || touched;
    touched = setChecked(waterCycleRunEl, preset.waterCycleRun) || touched;
    touched = setValue(weatherSimModeEl, preset.weatherSimMode) || touched;
    touched = setValue(weatherVolumeResEl, preset.weatherVolumeRes) || touched;
    touched = setValue(weatherRayStepsMinEl, preset.weatherRayStepsMin) || touched;
    touched = setValue(weatherRayStepsMaxEl, preset.weatherRayStepsMax) || touched;
    touched = setValue(weatherRayBundleEl, preset.weatherRayBundle) || touched;
    touched = setValue(weatherAtmoThicknessEl, preset.weatherAtmoThickness) || touched;
    touched = setValue(axialTiltEl, preset.axialTilt) || touched;
    touched = setValue(seasonProgressEl, preset.seasonProgress) || touched;
    touched = setValue(weatherDebugEl, preset.weatherDebug) || touched;
    touched = setValue(weatherSpeedEl, preset.weatherSpeed) || touched;
    touched = setValue(weatherUpdateHzEl, preset.weatherUpdateHz) || touched;
    touched = setValue(weatherMoistureLayersEl, preset.weatherMoistureLayers) || touched;
    touched = setValue(weatherEvapEl, preset.weatherEvap) || touched;
    touched = setValue(weatherPrecipEl, preset.weatherPrecip) || touched;
    touched = setValue(weatherWindEl, preset.weatherWind) || touched;
    touched = setValue(weatherWetnessEl, preset.weatherWetness) || touched;
    touched = setValue(weatherOceanInertiaEl, preset.weatherOceanInertia) || touched;
    touched = setChecked(weatherRainFxToggleEl, preset.weatherRainFxEnabled) || touched;
    touched = setValue(weatherRainFxEl, preset.weatherRainFx) || touched;
    touched = setValue(weatherRainHazeEl, preset.weatherRainHaze) || touched;

    let autoScaleApplied = false;
    if (weatherAutoScaleEl && preset.weatherAutoScale !== undefined && preset.weatherAutoScale !== null) {
        weatherAutoScaleEl.checked = !!preset.weatherAutoScale;
        if (weatherAutoScaleEl.checked) {
            enableWeatherAutoScale();
            autoScaleApplied = true;
        } else {
            disableWeatherAutoScale({ keepCurrent: true });
        }
    }

    if (touched && !autoScaleApplied) {
        handleWaterCycleUpdate();
    }
}

async function generateWorld(presetKey) {
    if (generating) return;
    
    // Exit FPS mode if active
    if (tinyControls.enabled) {
        tinyControls.exit();
        controls.enabled = true;
    }

    generating = true;
    clearTimeout(autoRegenTimer);
    regenBtn.disabled = true;
    presetEl.disabled = true;
    resolutionEl.disabled = true;
    platesEl.disabled = true;
    plateSizeVarianceEl.disabled = true;
    desymmetrizeTilingEl.disabled = true;
    jitterEl.disabled = true;
    heightScaleEl.disabled = true;
    iterationsEl.disabled = true;
    erosionRateEl.disabled = true;
    evaporationEl.disabled = true;
    seaLevelEl.disabled = true;
    atmosphereEl.disabled = true;
    atmosphereHeightEl.disabled = true;
    smoothPassesEl.disabled = true;
    subdivisionsEl.disabled = true;
    iceCapEl.disabled = true;
    atmosphereHeightEl.disabled = true;

    const settings = {
        ...readSettings(),
        planetDiameterKm: getPlanetDiameterKm(),
        atmosphereEnabled: atmosphereToggleEl?.checked ?? true,
        waterShader: getWaterShader()
    };
    writeSettings(settings); // ensure UI reflects clamped values

    // Sync cloud layers to PlanetManager before generation
    const layers = [];
    const baseLayer = getBaseCloudSettings();
    if (baseLayer.enabled) layers.push(baseLayer);
    for (const layer of cloudLayerSettings) {
        if (layer.enabled) layers.push(layer);
    }
    planetManager.cloudLayerSettings = layers;

    try {
        await planetManager.generate(settings, (msg) => ui.setStatus(msg));
        lastPlanetSettings = { ...(planetManager.lastSettings || settings) };
        planet = planetManager.planet;
        water = planetManager.water;
        freshwater = planetManager.freshwater;
        atmosphere = planetManager.atmosphereSystem?.mesh || null;
        clouds = planetManager.cloudSystem?.clouds || [];

        if (planetManager.forge) {
            syncWaterCycleSurfaceFromForge(planetManager.forge, settings);
        }

        setPlanetWeatherTexture(getWeatherTexture());
        setPlanetWeatherAuxTexture(getWeatherAuxTexture());
        applyWaterCycleConfig();

        const sunDir = new THREE.Vector3().copy(dirLight.position).normalize();
        rebuildClouds(sunDir);
        rebuildWaterCycleClouds(sunDir);
        rebuildMoon();
        applyPlanetScale();

        ui.setStatus(`${settings.resolution}² map · ${settings.iterations.toLocaleString()} steps`);
    } catch (err) {
        console.error(err);
        ui.setStatus('Generation failed – check console');
    } finally {
        generating = false;
        regenBtn.disabled = false;
        presetEl.disabled = false;
        resolutionEl.disabled = false;
        platesEl.disabled = false;
        plateSizeVarianceEl.disabled = false;
        desymmetrizeTilingEl.disabled = false;
        jitterEl.disabled = false;
        heightScaleEl.disabled = false;
        iterationsEl.disabled = false;
        erosionRateEl.disabled = false;
        evaporationEl.disabled = false;
        seaLevelEl.disabled = false;
        atmosphereEl.disabled = false;
        atmosphereHeightEl.disabled = false;
        smoothPassesEl.disabled = false;
        subdivisionsEl.disabled = false;
        iceCapEl.disabled = false;
    }
}

function buildCloudMesh(radius, baseSubdivisions, sunDir, planetRadius, seaLevel, heightScale, settings) {
    return planetManager.cloudSystem.buildCloudMesh(
        radius,
        baseSubdivisions,
        sunDir,
        planetRadius,
        seaLevel,
        heightScale,
        settings
    );
}

function rebuildWaterCycleClouds(sunDir) {
    if (!lastPlanetSettings) return;
    clearWaterCycleCloudMesh();

    const enabled = (waterCycleToggleEl?.checked ?? false) && (waterCycleCloudToggleEl?.checked ?? false);
    if (!enabled) return;

    const settings = getWaterCycleCloudSettings();
    const volTex = getWeatherVolumeTexture();
    const volMeta = getWeatherVolumeMeta();

    // Only render the water-cycle cloud layer when the 3D volume is available;
    // avoid falling back to the simple procedural layer to keep visuals aligned with the sim.
    if (!volTex || !volMeta) return;

    const baseRadius = lastPlanetSettings.radius + lastPlanetSettings.heightScale * 0.2;
    const mesh = planetManager.cloudSystem.buildVolumeCloudMesh(
        baseRadius,
        lastPlanetSettings.subdivisions,
        sunDir,
        lastPlanetSettings.radius,
        lastPlanetSettings.seaLevel,
        lastPlanetSettings.heightScale,
        settings,
        volTex,
        volMeta
    );

    waterCycleCloud = mesh;
    planetGroup.add(mesh);
}

function clearWaterCycleCloudMesh() {
    if (!waterCycleCloud) return;
    planetGroup.remove(waterCycleCloud);
    waterCycleCloud.geometry.dispose();
    waterCycleCloud.material.dispose?.();
    waterCycleCloud = null;
}

function getBaseCloudSettings() {
    return {
        id: 'base',
        enabled: cloudToggleEl.checked,
        alpha: clamp(parseFloat(cloudAlphaEl.value) || 0.74, 0, 1),
        speed: clamp(parseFloat(cloudSpeedEl.value) || 0.9, 0, 2),
        quantity: clamp(parseFloat(cloudQuantityEl.value) || 0.76, 0, 1),
        height: clamp(parseFloat(cloudHeightEl.value) || -2.4, -5, 5),
        color: cloudColorEl.value || '#ffffff',
        resolution: Math.max(1, Math.floor(parseFloat(cloudResolutionEl.value) || 256)),
        mode: cloudShaderEl.value || 'billow'
    };
}

function getWaterCycleCloudSettings() {
    return {
        id: 'water-cycle',
        enabled: waterCycleCloudToggleEl?.checked ?? false,
        alpha: clamp(parseFloat(cloudAlphaEl?.value) || 0.74, 0, 1),
        speed: clamp(parseFloat(cloudSpeedEl?.value) || 0.9, 0, 2),
        quantity: clamp(parseFloat(cloudQuantityEl?.value) || 0.76, 0, 2),
        height: clamp(parseFloat(cloudHeightEl?.value) || -2.4, -5, 5),
        color: cloudColorEl?.value || '#ffffff',
        resolution: Math.max(1, Math.floor(parseFloat(cloudResolutionEl?.value) || 256)),
        mode: cloudShaderEl?.value || 'billow'
    };
}

function rebuildClouds(sunDir) {
    if (!lastPlanetSettings) return;
    const layers = [];
    const base = getBaseCloudSettings();
    if (base.enabled) layers.push(base);
    for (const layer of cloudLayerSettings) {
        if (layer.enabled) layers.push(layer);
    }
    planetManager.cloudLayerSettings = layers;
    planetManager.rebuildClouds(sunDir);
    clouds = planetManager.cloudSystem?.clouds || [];
}

function updateAtmosphereVisuals(sunDir) {
    if (!lastPlanetSettings) return;
    const thickness = clamp(parseFloat(atmosphereEl.value) || 0.35, 0.05, 1.5);
    const heightOffset = clamp(parseFloat(atmosphereHeightEl.value) || 0.5, 0, 5);
    const alpha = clamp(parseFloat(atmosphereAlphaEl.value) || 1.0, 0, 1);
    const color = atmosphereColorEl.value || '#4da8ff';
    const rainHaze = clamp(parseFloat(weatherRainHazeEl?.value) || 0.9, 0, 2);
    const atmoSettings = {
        ...lastPlanetSettings,
        atmosphereEnabled: atmosphereToggleEl?.checked ?? true,
        atmosphere: thickness,
        atmosphereHeight: heightOffset,
        atmosphereAlpha: alpha,
        atmosphereColor: color
    };
    planetManager.updateAtmosphere(atmoSettings, { map: getWeatherTexture(), rainHaze });
    atmosphere = planetManager.atmosphereSystem?.mesh || null;
    planetManager.lastSettings = { ...(planetManager.lastSettings || {}), ...atmoSettings };
    lastPlanetSettings = { ...lastPlanetSettings, ...atmoSettings };
}

function createCloudLayerControls(layer) {
    const wrapper = document.createElement('div');
    wrapper.className = 'layer';
    wrapper.style.border = '1px solid var(--border)';
    wrapper.style.padding = '8px';
    wrapper.style.marginBottom = '8px';
    const idLabel = document.createElement('div');
    idLabel.textContent = `Layer ${layer.label || cloudLayerSettings.length + 1}`;
    idLabel.style.fontSize = '12px';
    idLabel.style.color = 'var(--muted)';
    wrapper.appendChild(idLabel);

    const makeRange = (label, key, min, max, step) => {
        const field = document.createElement('div');
        field.className = 'field';
        const l = document.createElement('label');
        l.textContent = label;
        const row = document.createElement('div');
        row.className = 'range-row';
        const input = document.createElement('input');
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = layer[key];
        const span = document.createElement('span');
        span.className = 'value';
        span.textContent = Number(layer[key]).toFixed(step < 1 ? 2 : 0);
        row.appendChild(input);
        row.appendChild(span);
        field.appendChild(l);
        field.appendChild(row);
        input.addEventListener('input', () => {
            layer[key] = parseFloat(input.value);
            span.textContent = Number(layer[key]).toFixed(step < 1 ? 2 : 0);
            rebuildClouds(new THREE.Vector3().copy(dirLight.position).normalize());
        });
        return field;
    };

    const enabled = document.createElement('label');
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = layer.enabled;
    toggle.addEventListener('change', () => {
        layer.enabled = toggle.checked;
        rebuildClouds(new THREE.Vector3().copy(dirLight.position).normalize());
    });
    enabled.appendChild(toggle);
    enabled.append(' Layer enabled');
    wrapper.appendChild(enabled);

    wrapper.appendChild(makeRange('Alpha', 'alpha', 0, 1, 0.01));
    wrapper.appendChild(makeRange('Speed', 'speed', 0, 2, 0.05));
    wrapper.appendChild(makeRange('Quantity', 'quantity', 0, 1, 0.01));
    wrapper.appendChild(makeRange('Height', 'height', -5, 5, 0.05));
    wrapper.appendChild(makeRange('Resolution', 'resolution', 1, 256, 1));

    const shaderField = document.createElement('div');
    shaderField.className = 'field';
    const shaderLabel = document.createElement('label');
    shaderLabel.textContent = 'Shader';
    const shaderSelect = document.createElement('select');
    ['fbm','billow','cellular'].forEach((m) => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m.charAt(0).toUpperCase() + m.slice(1);
        if (layer.mode === m) opt.selected = true;
        shaderSelect.appendChild(opt);
    });
    shaderSelect.addEventListener('change', () => {
        layer.mode = shaderSelect.value;
        rebuildClouds(new THREE.Vector3().copy(dirLight.position).normalize());
    });
    shaderField.appendChild(shaderLabel);
    shaderField.appendChild(shaderSelect);
    wrapper.appendChild(shaderField);

    const colorField = document.createElement('div');
    colorField.className = 'field';
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Color';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = layer.color;
    colorInput.addEventListener('input', () => {
        layer.color = colorInput.value;
        rebuildClouds(new THREE.Vector3().copy(dirLight.position).normalize());
    });
    colorField.appendChild(colorLabel);
    colorField.appendChild(colorInput);
    wrapper.appendChild(colorField);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove layer';
    removeBtn.addEventListener('click', () => {
        cloudLayerSettings = cloudLayerSettings.filter((l) => l !== layer);
        renderCloudLayerControls();
        rebuildClouds(new THREE.Vector3().copy(dirLight.position).normalize());
    });
    wrapper.appendChild(removeBtn);

    return wrapper;
}

function renderCloudLayerControls() {
    cloudLayersEl.innerHTML = '';
    for (const layer of cloudLayerSettings) {
        cloudLayersEl.appendChild(createCloudLayerControls(layer));
    }
}

function onResize() {
    if (input) {
        input.setMode(isMobileDevice() ? 'mobile' : 'desktop');
    }
    syncMobileVisibility();
}

function updateWeatherFrame() {
    const invScale = planetGroup.scale.x ? (1 / planetGroup.scale.x) : 1;

    // Update sun direction from axial tilt + season phase.
    const tiltDeg = clamp(parseFloat(axialTiltEl?.value) || 23.4, 0, 45);
    const season = clamp(parseFloat(seasonProgressEl?.value) || 0, 0, 1);
    const tiltRad = THREE.MathUtils.degToRad(tiltDeg);
    const seasonAng = season * Math.PI * 2;
    const decl = tiltRad * Math.sin(seasonAng);
    const sunVec = new THREE.Vector3(Math.cos(decl), Math.sin(decl), 0.6).normalize().multiplyScalar(16);
    dirLight.position.copy(sunVec);

    weatherSunWorld.copy(dirLight.position).normalize();
    weatherInvRot.identity();
    weatherSunLocal.copy(weatherSunWorld);
    if (planet) {
        planet.getWorldQuaternion(weatherTmpQuat);
        weatherTmpQuat.invert();
        weatherTmpMat4.makeRotationFromQuaternion(weatherTmpQuat);
        weatherInvRot.setFromMatrix4(weatherTmpMat4);
        weatherSunLocal.copy(weatherSunWorld).applyQuaternion(weatherTmpQuat).normalize();
    }

    return invScale;
}

function updateMoon(delta) {
    if (!moon) return;
    const radiusUnits = Math.max(0.05, (lastPlanetSettings?.radius ?? BASE_RADIUS_UNITS) * 0.2);
    const orbitRadius = Math.max(3, (lastPlanetSettings?.radius ?? BASE_RADIUS_UNITS) * 4);
    const orbitIncline = THREE.MathUtils.degToRad(8.0);
    moonOrbitPhase += delta * 0.02; // slower drift
    const cosP = Math.cos(moonOrbitPhase);
    const sinP = Math.sin(moonOrbitPhase);
    const x = orbitRadius * cosP;
    const y = orbitRadius * Math.sin(orbitIncline) * sinP;
    const z = orbitRadius * Math.cos(orbitIncline) * sinP;
    moon.position.set(x, y, z);
    moon.lookAt(planetGroup.position);
    moonUniforms.sunDir.value.copy(weatherSunWorld);
    updateMoonMaterialForPhase();
    // Aim the light shadow camera to include moon + planet.
    dirLight.target.position.set(0, 0, 0);
    dirLight.target.updateMatrixWorld();
}

function animate() {
    const delta = clock.getDelta();
    // FPS overlay (simple EMA).
    const fps = delta > 1e-6 ? 1 / delta : 0;
    fpsSMA = fpsSMA * 0.9 + fps * 0.1;
    if (fpsDiv) fpsDiv.textContent = `fps: ${fpsSMA.toFixed(1)}`;
    
    updateRangeLabels();
    updateWeatherAutoScale(delta);
    
    if (xrSession) {
        pollVRInputs();
    }

    if (tinyControls.enabled) {
        tinyControls.update(delta);
    } else {
        if (input.consume('surface')) {
            handleSurfaceAction();
        }
    }
    planetManager.update(delta, !tinyControls.enabled && !generating);
    syncMobileVisibility();

    // Planet-local sun direction (for water cycle + cloud sampling)
    const invScale = updateWeatherFrame();
    updateMoon(delta);
    const runWeather = (waterCycleToggleEl?.checked ?? false) && (waterCycleRunEl?.checked ?? true);
    if (runWeather && waterCycleSystem?.enabled) {
        waterCycleSystem.update(delta, weatherSunLocal);
    }

    // Keep AtmosphereSystem uniforms in sync with moving sun/scale/weather.
    if (planetManager.atmosphereSystem?.uniforms) {
        const u = planetManager.atmosphereSystem.uniforms;
        if (u.sunDir?.value) u.sunDir.value.copy(weatherSunWorld);
        if (u.planetInvRot?.value) u.planetInvRot.value.copy(weatherInvRot);
        if ('planetInvScale' in u) u.planetInvScale.value = invScale;
        const weatherTex = getWeatherTexture() || planetManager.atmosphereSystem.defaultWeatherTexture;
        if (!u.weatherMap) u.weatherMap = { value: weatherTex };
        else u.weatherMap.value = weatherTex;
        const rainHaze = clamp(parseFloat(weatherRainHazeEl?.value) || 0.9, 0, 2);
        if (u.rainHaze) u.rainHaze.value = rainHaze;
    }
    if (waterCycleCloud) {
        const dt = Math.min(delta, 0.25);
        const u = waterCycleCloud.userData?.uniforms || {};
        const s = waterCycleCloud.userData?.settings || {};
        const speed = s?.speed || 1;
        if (u.windOffset?.value !== undefined) u.windOffset.value += dt * speed * 0.3;
        if (u.planetInvRot) u.planetInvRot.value.copy(weatherInvRot);
        if (u.planetInvScale) u.planetInvScale.value = invScale;
        if (u.weatherMap) u.weatherMap.value = getWeatherTexture();
        if (u.weatherAuxMap) u.weatherAuxMap.value = getWeatherAuxTexture();
        if (u.volumeAtlas) u.volumeAtlas.value = getWeatherVolumeTexture() ?? u.volumeAtlas.value;
        const meta = getWeatherVolumeMeta();
        if (meta) {
            if (u.volumeN) u.volumeN.value = meta.n;
            if (u.tilesX) u.tilesX.value = meta.tilesX;
            if (u.atlasW) u.atlasW.value = meta.atlasW;
            if (u.atlasH) u.atlasH.value = meta.atlasH;
            if (u.volumeExtentM) u.volumeExtentM.value = meta.extentM;
            if (u.metersPerUnit) u.metersPerUnit.value = (meta.planetRadiusM ?? DEFAULT_RADIUS_M) / BASE_RADIUS_UNITS;
        }
        if (u.debugGrid) u.debugGrid.value = volumeDebugGrid ? 1.0 : 0.0;
        if (u.rayStepsMin) u.rayStepsMin.value = volumeRayStepsMin;
        if (u.rayStepsMax) u.rayStepsMax.value = volumeRayStepsMax;
        if (u.bundleSize) u.bundleSize.value = volumeRayBundle;
    }
    updateVolumeDebugSprite();

    if (rainSystem) {
        rainSystem.setWeatherFrame({ planetInvRot: weatherInvRot, planetInvScale: invScale });
        rainSystem.setWeatherMap(getWeatherTexture());
    }
    const windVec = computeWindWorldFromAux(getWeatherAuxTexture(), invScale, weatherInvRot, weatherWindWorld);
    if (rainSystem) rainSystem.setWindWorld(windVec);
    if (windSystem) {
        windSystem.setCenter(camera.position);
        windSystem.setWind(windVec);
        windSystem.update(delta);
    }
    if (planetManager?.waterUniforms?.windStrength) {
        planetManager.waterUniforms.windStrength.value = Math.min(Math.max(windVec.length() * 1.5, 0.05), 3.0);
    }
    if (rainSystem) rainSystem.update(delta);
    
    // Update 3D wind visualization on the globe (only in volume debug mode)
    if (windVizSystem && lastPlanetSettings) {
        const showWindViz = volumeDebugEnabled;
        windVizSystem.setVisible(showWindViz);
        if (showWindViz) {
            windVizSystem.setWeatherTextures(getWeatherTexture(), getWeatherAuxTexture());
            windVizSystem.setPlanetRadius(lastPlanetSettings.radius + (lastPlanetSettings.heightScale * 0.1));
            windVizSystem.update();
        }
    }
    
    setPlanetWeatherTexture(getWeatherTexture());
    setPlanetWeatherAuxTexture(getWeatherAuxTexture());
    
    // Connect weather wind texture to ocean shader for wind-driven waves
    planetManager.setOceanWindTexture(getWeatherAuxTexture());
    
    sceneManager.update(!tinyControls.enabled);
}

async function checkVRSupport() {
    if (!navigator.xr || !vrToggleEl) return;
    try {
        vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
        vrToggleEl.style.display = vrSupported ? 'block' : 'none';
        if (vrToggleEl) vrToggleEl.disabled = !vrSupported;
    } catch (err) {
        console.warn('XR support check failed', err);
    }
}

async function startVR() {
    if (!navigator.xr) {
        ui.setStatus('WebXR not available');
        return;
    }
    try {
        const session = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] });
        xrSession = session;
        renderer.xr.enabled = true;
        await renderer.xr.setSession(session);

        if (controls) controls.enabled = false;

        // Ensure orbit camera is outside the planet before entering XR
        if (planet && !tinyControls.enabled) {
            const surfaceRadius = (lastPlanetSettings?.radius ?? BASE_RADIUS_UNITS) * getPlanetScale() + (lastPlanetSettings?.heightScale ?? 0);
            const minDist = Math.max(surfaceRadius * 2.0, 30);
            const dir = camera.position.clone().sub(controls.target);
            if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
            dir.normalize();
            const target = new THREE.Vector3(0, 0, 0);
            const newPos = target.clone().sub(dir.multiplyScalar(minDist));
            
            userGroup.position.copy(newPos);
            userGroup.lookAt(target);
            
            // Reset camera local transform as it's now relative to userGroup
            camera.position.set(0, 0, 0);
            camera.rotation.set(0, 0, 0);
        }
        vrToggleEl.textContent = 'Exit VR';
        ui.setStatus('VR session started');
        session.addEventListener('end', () => {
            xrSession = null;
            xrPrevButtons.clear();
            renderer.xr.enabled = false;
            
            userGroup.position.set(0, 0, 0);
            userGroup.rotation.set(0, 0, 0);
            userGroup.quaternion.identity();
            if (controls) controls.enabled = true;

            vrToggleEl.textContent = 'Enter VR';
            ui.setStatus('');
        });
    } catch (err) {
        console.error(err);
        ui.setStatus('VR start failed');
    }
}

function stopVR() {
    if (xrSession) {
        xrSession.end();
    }
}

function pollVRInputs() {
    if (!xrSession || !input) return;
    let moveX = 0;
    let moveY = 0;
    const dead = 0.15;
    for (const source of xrSession.inputSources) {
        const gp = source.gamepad;
        if (!gp) continue;
        const prev = xrPrevButtons.get(source) || [];
        const buttons = gp.buttons || [];
        const axes = gp.axes || [];
        if (axes.length >= 4) {
            moveX = axes[2];
            moveY = axes[3];
        }
        // Button mapping: 0 jump, 1 fly toggle, 3 exit
        const pressed = buttons.map((b) => !!b && b.pressed);
        if (pressed[0] && !prev[0]) input.trigger('jump');
        if (pressed[1] && !prev[1]) input.trigger('flyToggle');
        if (pressed[3] && !prev[3]) input.trigger('exit');
        xrPrevButtons.set(source, pressed);
    }
    input.setAction('forward', moveY > dead);
    input.setAction('backward', moveY < -dead);
    input.setAction('left', moveX > dead);
    input.setAction('right', moveX < -dead);
}

if (vrToggleEl) {
    vrToggleEl.addEventListener('click', () => {
        if (xrSession) stopVR();
        else startVR();
    });
}

regenBtn.addEventListener('click', () => generateWorld(presetEl.value));

function handleDiameterChange(kmOverride) {
    const km = Number.isFinite(kmOverride) ? kmOverride : getPlanetDiameterKm();
    updateRangeLabels();
    if (lastPlanetSettings) {
        lastPlanetSettings.planetDiameterKm = km;
    }
    applyPlanetScale();
    if (!generating) {
        ui.setStatus(`Planet diameter set to ${km.toLocaleString()} km`);
    }
}

function queueAutoRegen() {
    if (generating) return;
    clearTimeout(autoRegenTimer);
    autoRegenTimer = setTimeout(() => generateWorld(presetEl.value), 400);
}

// Atmosphere/Cloud controls (no regen)
function handleAtmosphereUpdate() {
    updateRangeLabels();
    updateAtmosphereVisuals(new THREE.Vector3().copy(dirLight.position).normalize());
}
function handleCloudUpdate() {
    updateRangeLabels();
    const sunDir = new THREE.Vector3().copy(dirLight.position).normalize();
    rebuildClouds(sunDir);
    rebuildWaterCycleClouds(sunDir);
}

const waterCycleUiControls = [
    waterCycleToggleEl,
    waterCycleCloudToggleEl,
    waterCycleRunEl,
    waterCycleStepBtn,
    weatherAutoScaleEl,
    weatherSimModeEl,
    weatherVolumeResEl,
    weatherRayStepsMinEl,
    weatherRayStepsMaxEl,
    weatherRayBundleEl,
    weatherDebugEl,
    weatherSpeedEl,
    weatherUpdateHzEl,
    weatherMoistureLayersEl,
    weatherEvapEl,
    weatherPrecipEl,
    weatherWindEl,
    weatherWetnessEl,
    weatherOceanInertiaEl,
    weatherRainFxToggleEl,
    weatherRainFxEl,
    weatherRainHazeEl
].filter(Boolean);

function setWaterCycleUiDisabled(disabled) {
    for (const el of waterCycleUiControls) el.disabled = disabled;
}

const weatherAutoManagedControls = [
    weatherUpdateHzEl,
    weatherVolumeResEl,
    weatherRayStepsMinEl,
    weatherRayStepsMaxEl,
    weatherRayBundleEl,
    weatherMoistureLayersEl
].filter(Boolean);

function setWeatherAutoUiDisabled(disabled) {
    for (const el of weatherAutoManagedControls) el.disabled = disabled;
}

function snapshotWeatherManualSettings() {
    return {
        updateHz: weatherUpdateHzEl?.value,
        volumeRes: weatherVolumeResEl?.value,
        rayMin: weatherRayStepsMinEl?.value,
        rayMax: weatherRayStepsMaxEl?.value,
        rayBundle: weatherRayBundleEl?.value,
        moistureLayers: weatherMoistureLayersEl?.value
    };
}

function restoreWeatherManualSettings(snapshot) {
    if (!snapshot) return;
    if (weatherUpdateHzEl && snapshot.updateHz != null) weatherUpdateHzEl.value = snapshot.updateHz;
    if (weatherVolumeResEl && snapshot.volumeRes != null) weatherVolumeResEl.value = snapshot.volumeRes;
    if (weatherRayStepsMinEl && snapshot.rayMin != null) weatherRayStepsMinEl.value = snapshot.rayMin;
    if (weatherRayStepsMaxEl && snapshot.rayMax != null) weatherRayStepsMaxEl.value = snapshot.rayMax;
    if (weatherRayBundleEl && snapshot.rayBundle != null) weatherRayBundleEl.value = snapshot.rayBundle;
    if (weatherMoistureLayersEl && snapshot.moistureLayers != null) weatherMoistureLayersEl.value = snapshot.moistureLayers;
    handleWaterCycleUpdate();
}

function getWeatherAutoTierIndex(mode) {
    if (mode === '3d') {
        const n = clamp(parseFloat(weatherVolumeResEl?.value) || 8, 1, 128);
        const hz = clamp(parseFloat(weatherUpdateHzEl?.value) || 1, 1, 20);
        const rayMin = clamp(parseFloat(weatherRayStepsMinEl?.value) || 28, 1, 128);
        const rayMax = clamp(parseFloat(weatherRayStepsMaxEl?.value) || 48, 1, 128);
        const bundle = clamp(parseFloat(weatherRayBundleEl?.value) || 1, 1, 100);
        let best = 0;
        let bestScore = Infinity;
        WEATHER_AUTO_TIERS_3D.forEach((tier, idx) => {
            const score = Math.abs(tier.n - n)
                + Math.abs(tier.updateHz - hz) * 2
                + Math.abs(tier.rayMin - rayMin) * 0.5
                + Math.abs(tier.rayMax - rayMax) * 0.5
                + Math.abs(tier.bundle - bundle) * 2;
            if (score < bestScore) {
                bestScore = score;
                best = idx;
            }
        });
        return best;
    }
    const hz = clamp(parseFloat(weatherUpdateHzEl?.value) || 1, 1, 20);
    const layers = clamp(parseFloat(weatherMoistureLayersEl?.value) || 2, 1, 4);
    let best = 0;
    let bestScore = Infinity;
    WEATHER_AUTO_TIERS_2D.forEach((tier, idx) => {
        const score = Math.abs(tier.updateHz - hz) * 2 + Math.abs(tier.moistureLayers - layers);
        if (score < bestScore) {
            bestScore = score;
            best = idx;
        }
    });
    return best;
}

function applyWeatherAutoTier(mode) {
    if (mode === '3d') {
        const tier = WEATHER_AUTO_TIERS_3D[weatherAutoState.tier3d];
        if (!tier) return;
        if (weatherVolumeResEl) weatherVolumeResEl.value = String(tier.n);
        if (weatherUpdateHzEl) weatherUpdateHzEl.value = String(tier.updateHz);
        if (weatherRayStepsMinEl) weatherRayStepsMinEl.value = String(tier.rayMin);
        if (weatherRayStepsMaxEl) weatherRayStepsMaxEl.value = String(tier.rayMax);
        if (weatherRayBundleEl) weatherRayBundleEl.value = String(tier.bundle);
    } else {
        const tier = WEATHER_AUTO_TIERS_2D[weatherAutoState.tier2d];
        if (!tier) return;
        if (weatherUpdateHzEl) weatherUpdateHzEl.value = String(tier.updateHz);
        if (weatherMoistureLayersEl) weatherMoistureLayersEl.value = String(tier.moistureLayers);
    }
    handleWaterCycleUpdate();
}

function enableWeatherAutoScale() {
    weatherAutoState.manual = snapshotWeatherManualSettings();
    weatherAutoState.emaMs = 16.7;
    weatherAutoState.overBudgetS = 0;
    weatherAutoState.underBudgetS = 0;
    weatherAutoState.cooldownS = 0;

    const mode = getWeatherSimMode();
    if (mode === '3d') {
        weatherAutoState.tier3d = getWeatherAutoTierIndex(mode);
    } else {
        weatherAutoState.tier2d = getWeatherAutoTierIndex(mode);
    }
    setWeatherAutoUiDisabled(true);
    applyWeatherAutoTier(mode);
}

function disableWeatherAutoScale(options = {}) {
    const keepCurrent = !!options.keepCurrent;
    setWeatherAutoUiDisabled(false);
    if (!keepCurrent) {
        restoreWeatherManualSettings(weatherAutoState.manual);
    }
    weatherAutoState.manual = null;
}

function getWeatherSimMode() {
    const v = (weatherSimModeEl?.value || '3d').toLowerCase();
    return v === '2d' ? '2d' : '3d';
}

function getWeatherVolumeResolutionN() {
    const v = parseFloat(weatherVolumeResEl?.value);
    const n = Number.isFinite(v) ? v : 8;
    return clamp(Math.round(n), 1, 128);
}

function updateWaterCycleModeUi(mode) {
    const is3d = mode === '3d';
    if (weatherMoistureLayersEl) weatherMoistureLayersEl.disabled = is3d;
    if (weatherVolumeResEl) weatherVolumeResEl.disabled = !is3d;
}

let selectingWeatherSim = 0;
async function selectWaterCycleSystemIfNeeded() {
    const mode = getWeatherSimMode();
    updateWaterCycleModeUi(mode);

    const token = ++selectingWeatherSim;

    try {
        if (mode === '3d') {
            const desiredN = getWeatherVolumeResolutionN();
            if (waterCycleSystem3D && waterCycleSystem3D.volumeN !== desiredN) {
                waterCycleSystem3D = null;
            }
            if (!waterCycleSystem3D) {
                const device = await getSharedDevice();
                waterCycleSystem3D = await WaterCycleVolumeSystem.create({
                    volumeN: desiredN,
                    surfaceW: 256,
                    surfaceH: 128,
                    device: device || undefined
                });
            }
            if (token !== selectingWeatherSim) return;
            waterCycleSystem = waterCycleSystem3D;
        } else {
            if (!waterCycleSystem2D) {
                const device = await getSharedDevice();
                waterCycleSystem2D = await WaterCycleSystem.create({
                    gridWidth: 256,
                    gridHeight: 128,
                    device: device || undefined
                });
            }
            if (token !== selectingWeatherSim) return;
            waterCycleSystem = waterCycleSystem2D;
        }
    } catch (err) {
        console.warn('[WaterCycle] init failed', err);
        if (token !== selectingWeatherSim) return;
        setWaterCycleUiDisabled(true);
        if (waterCycleToggleEl) {
            waterCycleToggleEl.checked = false;
            waterCycleToggleEl.disabled = true;
        }
        return;
    }

    if (!waterCycleSystem?.enabled) {
        setWaterCycleUiDisabled(true);
        if (waterCycleToggleEl) {
            waterCycleToggleEl.checked = false;
            waterCycleToggleEl.disabled = true;
        }
        if (waterCycleRunEl) {
            waterCycleRunEl.checked = false;
            waterCycleRunEl.disabled = true;
        }
        if (waterCycleStepBtn) waterCycleStepBtn.disabled = true;
        return;
    }

    setWaterCycleUiDisabled(false);
    updateWaterCycleModeUi(mode);

    if (pendingWaterCycleSurface && waterCycleSystem.enabled && waterCycleSystem.ready) {
        waterCycleSystem.setPlanetSurface(pendingWaterCycleSurface);
    }

    applyWaterCycleConfig();
    setPlanetWeatherTexture(getWeatherTexture());
    setPlanetWeatherAuxTexture(getWeatherAuxTexture());
    rebuildWaterCycleClouds(new THREE.Vector3().copy(dirLight.position).normalize());
}

function applyWaterCycleConfig() {
    const mode = getWeatherSimMode();
    const minutesPerSec = clamp(parseFloat(weatherSpeedEl?.value) || 1, 0, 60);
    const updateHz = clamp(parseFloat(weatherUpdateHzEl?.value) || 1, 1, 20);
    const moistureLayers = clamp(parseFloat(weatherMoistureLayersEl?.value) || 2, 1, 4);
    const evapStrength = clamp(parseFloat(weatherEvapEl?.value) || 1, 0, 3);
    const precipStrength = clamp(parseFloat(weatherPrecipEl?.value) || 1, 0, 3);
    const windStrength = clamp(parseFloat(weatherWindEl?.value) || 1, 0, 3);
    const wetnessStrength = clamp(parseFloat(weatherWetnessEl?.value) || 0.75, 0, 2);
    const oceanInertia = clamp(parseFloat(weatherOceanInertiaEl?.value) || 0.25, 0.05, 1);
    const rainFxEnabled = (weatherRainFxToggleEl?.checked ?? true);
    const rainFxStrength = clamp(parseFloat(weatherRainFxEl?.value) || 1, 0, 2);
    const rainHaze = clamp(parseFloat(weatherRainHazeEl?.value) || 0.9, 0, 2);
    const debugKey = (weatherDebugEl?.value || 'off').toLowerCase();
    const debugMode = debugKey === 'cloud' ? 1
        : debugKey === 'rain' ? 2
        : debugKey === 'pressure' ? 3
        : debugKey === 'soil' ? 4
        : debugKey === 'temp' ? 5
        : debugKey === 'snow' ? 6
        : debugKey === 'wind' ? 7
        : 0;
    const debugVolume = debugKey === 'volume' || debugKey === 'volume-grid';
    volumeDebugGrid = debugKey === 'volume-grid';

    let rayMin = clamp(parseFloat(weatherRayStepsMinEl?.value) || 28, 1, 128);
    let rayMax = clamp(parseFloat(weatherRayStepsMaxEl?.value) || 48, 1, 128);
    if (rayMin > rayMax) {
        const swap = rayMin;
        rayMin = rayMax;
        rayMax = swap;
        if (weatherRayStepsMinEl) weatherRayStepsMinEl.value = String(rayMin);
        if (weatherRayStepsMaxEl) weatherRayStepsMaxEl.value = String(rayMax);
    }
    volumeRayStepsMin = rayMin;
    volumeRayStepsMax = rayMax;
    volumeRayBundle = clamp(parseFloat(weatherRayBundleEl?.value) || 1, 1, 100);
    if (weatherRayBundleEl && weatherRayBundleEl.value !== String(volumeRayBundle)) {
        weatherRayBundleEl.value = String(volumeRayBundle);
    }

    const atmoThicknessKm = clamp(parseFloat(weatherAtmoThicknessEl?.value) || 20, 5, 60);
    const axialTiltDeg = clamp(parseFloat(axialTiltEl?.value) || 23.4, 0, 45);
    const seasonPhase = clamp(parseFloat(seasonProgressEl?.value) || 0, 0, 1);

    if (waterCycleSystem?.enabled && waterCycleSystem.ready) {
        const cfg = {
            timeScale: minutesPerSec * 60,
            readbackIntervalS: 1 / updateHz,
            evapStrength,
            precipStrength,
            windStrength,
            oceanInertia,
            atmoThicknessM: atmoThicknessKm * 1000,
            axialTiltDeg,
            seasonPhase
        };
        if (mode === '2d') cfg.moistureLayers = moistureLayers;
        waterCycleSystem.setConfig(cfg);
    }
    setPlanetWeatherStrength(wetnessStrength);
    setPlanetWeatherDebugMode(debugMode);
    setVolumeDebugEnabled(debugVolume);
    setVolumeSliceVisibility(debugVolume);
    planetManager.setAtmosphereWeather(getWeatherTexture(), rainHaze);
    syncVolumeSliceRange();
    syncVolumeSliceRange();

    if (rainSystem) {
        const showRain = (waterCycleToggleEl?.checked ?? false) && rainFxEnabled;
        rainSystem.setEnabled(showRain);
        rainSystem.setStrength(rainFxStrength);
        rainSystem.setDensity(clamp(0.15 + rainFxStrength * 0.35, 0, 1));

        if (lastPlanetSettings) {
            const nearR = (lastPlanetSettings.radius ?? BASE_RADIUS_UNITS) + (lastPlanetSettings.heightScale ?? 0);
            rainSystem.setPlanetNearRadius(nearR);
        }

        // Size rain relative to player scale so it looks sensible in Tiny mode.
        const person = getPersonHeightUnits();
        const sizeMul = 0.7 + rainFxStrength * 0.65;
        rainSystem.setSizes({
            dropLength: person * (6.0 * sizeMul),
            dropWidth: person * (0.08 * sizeMul),
            volumeRadius: person * (340.0 * sizeMul),
            volumeHeight: person * (260.0 * sizeMul),
            fallDistance: person * (420.0 * sizeMul)
        });
    }
}

function updateWeatherAutoScale(deltaSeconds) {
    if (!weatherAutoScaleEl?.checked) return;
    if (!(waterCycleToggleEl?.checked ?? false)) return;
    const dt = Math.min(Math.max(deltaSeconds ?? 0, 0), 0.25);
    if (dt <= 0) return;

    const ms = dt * 1000;
    weatherAutoState.emaMs = weatherAutoState.emaMs * 0.9 + ms * 0.1;

    const over = weatherAutoState.emaMs > WEATHER_AUTO_LIMITS.highMs;
    const under = weatherAutoState.emaMs < WEATHER_AUTO_LIMITS.lowMs;
    if (over) {
        weatherAutoState.overBudgetS += dt;
        weatherAutoState.underBudgetS = 0;
    } else if (under) {
        weatherAutoState.underBudgetS += dt;
        weatherAutoState.overBudgetS = 0;
    } else {
        weatherAutoState.overBudgetS = 0;
        weatherAutoState.underBudgetS = 0;
    }

    if (weatherAutoState.cooldownS > 0) {
        weatherAutoState.cooldownS = Math.max(0, weatherAutoState.cooldownS - dt);
        return;
    }

    const mode = getWeatherSimMode();
    if (weatherAutoState.overBudgetS >= WEATHER_AUTO_LIMITS.downDelayS) {
        if (mode === '3d' && weatherAutoState.tier3d > 0) {
            weatherAutoState.tier3d -= 1;
            applyWeatherAutoTier(mode);
        } else if (mode === '2d' && weatherAutoState.tier2d > 0) {
            weatherAutoState.tier2d -= 1;
            applyWeatherAutoTier(mode);
        }
        weatherAutoState.cooldownS = WEATHER_AUTO_LIMITS.cooldownDownS;
        weatherAutoState.overBudgetS = 0;
    } else if (weatherAutoState.underBudgetS >= WEATHER_AUTO_LIMITS.upDelayS) {
        if (mode === '3d' && weatherAutoState.tier3d < WEATHER_AUTO_TIERS_3D.length - 1) {
            weatherAutoState.tier3d += 1;
            applyWeatherAutoTier(mode);
        } else if (mode === '2d' && weatherAutoState.tier2d < WEATHER_AUTO_TIERS_2D.length - 1) {
            weatherAutoState.tier2d += 1;
            applyWeatherAutoTier(mode);
        }
        weatherAutoState.cooldownS = WEATHER_AUTO_LIMITS.cooldownUpS;
        weatherAutoState.underBudgetS = 0;
    }
}
function handleWaterCycleUpdate() {
    updateRangeLabels();
    void selectWaterCycleSystemIfNeeded();
    syncVolumeSliceRange();
    applyWaterCycleConfig();
    rebuildWaterCycleClouds(new THREE.Vector3().copy(dirLight.position).normalize());
}

function handleWeatherAutoToggle() {
    if (weatherAutoScaleEl?.checked) {
        enableWeatherAutoScale();
    } else {
        disableWeatherAutoScale();
    }
}

[atmosphereEl, atmosphereAlphaEl, atmosphereColorEl, atmosphereToggleEl].forEach((el) => {
    el.addEventListener(el.type === 'color' ? 'input' : 'change', handleAtmosphereUpdate);
    if (el.type === 'range') el.addEventListener('input', handleAtmosphereUpdate);
});
[cloudToggleEl, cloudAlphaEl, cloudSpeedEl, cloudQuantityEl, cloudHeightEl, cloudColorEl, cloudResolutionEl, cloudShaderEl].forEach((el) => {
    el.addEventListener(el.type === 'color' ? 'input' : 'change', handleCloudUpdate);
    if (el.type === 'range') el.addEventListener('input', handleCloudUpdate);
});
[waterCycleToggleEl, waterCycleCloudToggleEl, waterCycleRunEl, weatherSimModeEl, weatherVolumeResEl, weatherRayStepsMinEl, weatherRayStepsMaxEl, weatherRayBundleEl, weatherAtmoThicknessEl, weatherDebugEl, weatherSpeedEl, weatherUpdateHzEl, weatherMoistureLayersEl, weatherEvapEl, weatherPrecipEl, weatherWindEl, weatherWetnessEl, weatherOceanInertiaEl, weatherRainFxToggleEl, weatherRainFxEl, weatherRainHazeEl].forEach((el) => {
    if (!el) return;
    el.addEventListener(el.type === 'checkbox' ? 'change' : (el.type === 'color' ? 'input' : 'change'), handleWaterCycleUpdate);
    if (el.type === 'range') el.addEventListener('input', handleWaterCycleUpdate);
});
if (weatherAutoScaleEl) {
    weatherAutoScaleEl.addEventListener('change', handleWeatherAutoToggle);
}
if (helpToggleEl) {
    helpToggleEl.addEventListener('click', toggleHelpPanel);
}
if (volumeSliceEl) {
    volumeSliceEl.addEventListener('input', (e) => setVolumeSliceFromUI(Number(e.target.value)));
    volumeSliceEl.addEventListener('change', (e) => setVolumeSliceFromUI(Number(e.target.value)));
    if (volumeSliceValueEl) volumeSliceValueEl.textContent = volumeSliceEl.value;
}
if (waterCycleStepBtn) {
    waterCycleStepBtn.addEventListener('click', () => {
        if (!(waterCycleToggleEl?.checked)) return;
        if (!(waterCycleSystem?.enabled && waterCycleSystem.ready && waterCycleSystem.hasSurface)) return;
        updateWeatherFrame();
        // Advance by 10 simulated minutes and force a readback so visuals update immediately.
        waterCycleSystem.update(0, weatherSunLocal, { dtSimOverride: 600, forceReadback: true });
    });
}
if (weatherAutoScaleEl?.checked) {
    enableWeatherAutoScale();
}

// Surface action global trigger
document.addEventListener('surface', handleSurfaceAction);

addCloudLayerBtn.addEventListener('click', () => {
    const base = getBaseCloudSettings();
    const bump = cloudLayerSettings.length ? cloudLayerSettings[cloudLayerSettings.length - 1].height : base.height;
    const newLayer = { ...base, id: `extra-${Date.now()}`, height: bump + 0.3 };
    cloudLayerSettings.push(newLayer);
    renderCloudLayerControls();
    rebuildClouds(new THREE.Vector3().copy(dirLight.position).normalize());
});
window.addEventListener('resize', onResize);

// Config inputs
[leftStickSensitivityEl, lookSensitivityXEl, lookSensitivityYEl].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', updateRangeLabels);
});
if (invertLookEl) invertLookEl.addEventListener('change', updateRangeLabels);
setWaterCycleUiDisabled(true);
void selectWaterCycleSystemIfNeeded();

// Initialize ocean compute system for WebGPU wave simulation
(async () => {
    try {
        await planetManager.initOceanCompute();
        if (planetManager.oceanComputeSystem?.enabled) {
            console.log('[Ocean] WebGPU compute ocean initialized');
        }
    } catch (err) {
        console.warn('[Ocean] Failed to init compute ocean:', err);
    }
})();

// Water shader change handler
if (waterShaderEl) {
    waterShaderEl.addEventListener('change', () => {
        if (!lastPlanetSettings || !planetManager.planet) return;
        const shaderType = getWaterShader();
        const s = lastPlanetSettings;
        // Rebuild water mesh with new shader type
        const newWater = planetManager.buildWaterMesh(
            s.radius,
            s.subdivisions,
            s.seaLevel,
            s.heightScale,
            s.iceCap,
            shaderType
        );
        planetManager.replaceWater(newWater);
        water = planetManager.water;
        ui.setStatus(`Water shader: ${shaderType}`);
    });
}

const urlQualityPreset = getQualityPresetFromUrl();
if (urlQualityPreset && presetEl) {
    presetEl.value = urlQualityPreset;
}

applyPreset(presetEl.value);
generateWorld(presetEl.value);
renderCloudLayerControls();
bindMobileControls();
renderer.setAnimationLoop(animate);
checkVRSupport();
function updateMoonMaterialForPhase() {
    if (!moon) return;
    const dirToSun = new THREE.Vector3().copy(weatherSunWorld).normalize().multiplyScalar(-1);
    const viewDir = new THREE.Vector3().copy(camera.position).sub(moon.position).normalize();
    // Phase factor based on angle between sun direction and view.
    const phase = Math.max(0, dirToSun.dot(viewDir));
    const mat = moon.material;
    mat.emissiveIntensity = 0.0;
    mat.color.setScalar(0.75 + 0.25 * phase);
    mat.needsUpdate = true;
}
