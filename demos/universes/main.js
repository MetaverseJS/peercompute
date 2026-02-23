import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { NURBSCurve } from 'three/addons/curves/NURBSCurve.js';
import html2canvas from 'html2canvas';
import { ComputeManager } from '@peercompute';
import { generateUniverseData, generateUniverseDensity, generateGalaxyData } from './compute/universeTasks.js';

// --- Physical Units (meters, kg, s) ---
const UNITS = { 
    M: 1,
    KM: 1000,
    AU: 1.495978707e11,
    LY: 9.4607e15,
    KLY: 9.4607e18,
    MLY: 9.4607e21,
    GLY: 9.4607e24
};
const SOLAR_RADIUS_M = 6.957e8;
const SOLAR_MASS_KG = 1.98847e30;
const SOLAR_POINT_LIGHT_INTENSITY = UNITS.AU * UNITS.AU;
const STAR_LIGHT_VISIBILITY_BOOST = 3.0;
const STAR_MIN_LUMINOSITY_FACTOR = 0.18;
const STAR_SYSTEM_LIGHT_BOOST = 10.0;
const MIN_STAR_SIZE_MULTIPLIER = 1.0;
const MAX_STAR_SIZE_MULTIPLIER = 12.0;
const DEFAULT_STAR_SIZE_MULTIPLIER = 6.0;
const SYSTEM_OVERVIEW_MARKER_COLOR = 0x00ff66;
const SYSTEM_OVERVIEW_CAMERA_DIST = 1.8;
const GALAXY_FOG_DENSITY = 1e-9;
const MAX_PICK_SCAN_POINTS = 300_000;
const EARTH_RADIUS_M = 6.371e6;
const EARTH_MASS_KG = 5.972e24;
const JUPITER_RADIUS_M = 6.9911e7;
const JUPITER_MASS_KG = 1.898e27;
const G_M = 6.67430e-11; // m^3 / kg / s^2
const C_M_S = 299_792_458;
const PHYSICS_SECONDS_PER_UNIT = 86_400; // 1 sim unit = 1 day

// --- Configuration ---
const SCALES = {
    UNIVERSE: 46.5 * UNITS.GLY,
    GALAXY: 52_000 * UNITS.LY,
    SYSTEM: 100 * UNITS.AU,
    G: G_M
};

// Quality Presets
const DENSITY_RES_SCALE = Math.pow(10, 1 / 3);
const QUALITY_PRESETS = {
    LOW: { starCount: 100_000, clusterCount: 200, densityRes: 64 },
    MED: { starCount: 250_000, clusterCount: 300, densityRes: Math.round(80 * DENSITY_RES_SCALE) },
    HIGH: { starCount: 500_000, clusterCount: 400, densityRes: Math.round(96 * DENSITY_RES_SCALE) },
    ULTRA: { starCount: 1_000_000, clusterCount: 500, densityRes: Math.round(128 * DENSITY_RES_SCALE) }
};

const MAX_DENSITY_RES = 320;

// Debug flags and settings from query string
const urlParams = new URLSearchParams(window.location.search);
const DEBUG_WEB = urlParams.get('debugweb') === 'true';
const URL_QUALITY = urlParams.get('quality')?.toUpperCase();
const URL_PIXELATION = urlParams.get('pixelation');
const URL_STAR_SIZE = Number.parseFloat(urlParams.get('starSize') ?? urlParams.get('starsize') ?? '');

// Determine quality preset from URL or default to HIGH
const SELECTED_QUALITY = QUALITY_PRESETS[URL_QUALITY] || QUALITY_PRESETS.HIGH;

const CONFIG = {
    starCount: SELECTED_QUALITY.starCount,
    clusterCount: SELECTED_QUALITY.clusterCount,
    filamentScatter: 0.04,
    seed: 1337,
    densityRes: SELECTED_QUALITY.densityRes
};

// Pixelation from URL (will be applied after renderer init)
const INITIAL_PIXELATION = URL_PIXELATION ? parseInt(URL_PIXELATION, 10) : null;
const INITIAL_STAR_SIZE_MULTIPLIER = Number.isFinite(URL_STAR_SIZE)
    ? Math.min(MAX_STAR_SIZE_MULTIPLIER, Math.max(MIN_STAR_SIZE_MULTIPLIER, URL_STAR_SIZE))
    : DEFAULT_STAR_SIZE_MULTIPLIER;

const computeModuleUrl = new URL('./compute/universeTasks.js', import.meta.url).href;
const computeManager = new ComputeManager({ maxWorkers: 1 });
let computeInitPromise = null;

function ensureComputeManager() {
    if (computeInitPromise) return computeInitPromise;
    computeInitPromise = computeManager.initialize()
        .then(() => computeManager)
        .catch((err) => {
            console.warn('[Universes] ComputeManager unavailable:', err);
            return null;
        });
    return computeInitPromise;
}

async function runComputeTask(exportName, data) {
    const manager = await ensureComputeManager();
    if (!manager) return null;
    try {
        return await manager.submitTask({
            module: computeModuleUrl,
            exportName,
            data
        });
    } catch (err) {
        console.warn(`[Universes] Compute task ${exportName} failed:`, err);
        return null;
    }
}

// --- Astrophysics Data ---
const STAR_CLASSES = [
    { id: 'O', prob: 0.0001, color: 0x9999ff, temp: '30,000+', mass: 60, rad: 8, lum: '30,000+', lifespan: 0.01 },
    { id: 'B', prob: 0.0013, color: 0xaaaaff, temp: '10,000-30,000', mass: 10, rad: 5, lum: '25-30,000', lifespan: 0.1 },
    { id: 'A', prob: 0.006,  color: 0xffffff, temp: '7,500-10,000', mass: 3, rad: 2.5, lum: '5-25', lifespan: 1.0 },
    { id: 'F', prob: 0.03,   color: 0xffffee, temp: '6,000-7,500', mass: 1.5, rad: 1.3, lum: '1.5-5', lifespan: 4.0 },
    { id: 'G', prob: 0.076,  color: 0xffdd00, temp: '5,200-6,000', mass: 1.0, rad: 1.0, lum: '0.6-1.5', lifespan: 10.0 },
    { id: 'K', prob: 0.121,  color: 0xffaa22, temp: '3,700-5,200', mass: 0.7, rad: 0.8, lum: '0.08-0.6', lifespan: 30.0 },
    { id: 'M', prob: 0.7645, color: 0xff3300, temp: '2,400-3,700', mass: 0.3, rad: 0.4, lum: '< 0.08', lifespan: 1000.0 },
    { id: 'BH', prob: 0, color: 0x000000, temp: 'UNDEFINED', mass: 20, rad: 0.05, lum: '0', lifespan: 9999 }, 
    { id: 'N', prob: 0, color: 0x00ffff, temp: '600,000', mass: 2.5, rad: 0.02, lum: '0.001', lifespan: 9999 },
    { id: 'WD', prob: 0, color: 0xbbffff, temp: '100,000', mass: 0.9, rad: 0.1, lum: '0.01', lifespan: 9999 } 
];

// --- Shared GLSL ---
const NOISE_GLSL = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
`;

// --- Global State ---
let camera, scene, renderer, controls, composer;
let points, localGalaxy, localSystem, smbhGroup, supernovaSystem, nebulaSystem, nebulaNursery;
const galaxyCache = [];
let galaxyCacheGroup;
const nebulaStars = [];
const coronaMeshes = [];
let nebulaSpawnTimer = 0;
let volumeMeshes = [], volumeTexture, volumeMaterials = [];
let volumeGroup; // Group containing all 27 sub-volumes
let volumeSupportChecked = false;
let raycaster, mouse;
let clock = new THREE.Clock();

let isDragging = false;
let dragStartPos = new THREE.Vector2();
let isPointerDown = false;
let activePointerId = null;
const activePointers = new Set();
let hadMultiTouch = false;
let xrForceDirectFrames = 0;
let onDocumentMouseMove = null;
let onBodyMouseOver = null;
let onWheelZoom = null;
let preXRCameraState = null;
let vrUI = null;
let starGlowTexture = null;
let systemOverviewMarkerTexture = null;
const vrUiRaycaster = new THREE.Raycaster();
const vrTmpMat4 = new THREE.Matrix4();
const vrTmpVec3a = new THREE.Vector3();
const vrTmpVec3b = new THREE.Vector3();
const tmpWorldPos = new THREE.Vector3();
const tmpPickPos = new THREE.Vector3();
const tmpPickNdc = new THREE.Vector3();
const tmpBhPos = new THREE.Vector3();
const tmpBhNdc = new THREE.Vector3();
const tmpBhOffset = new THREE.Vector3();
const tmpBhNdcOffset = new THREE.Vector3();
const tmpBhRight = new THREE.Vector3();
const tmpBhScale = new THREE.Vector3();
const tmpCmeVec = new THREE.Vector3();
const tmpFocusDir = new THREE.Vector3();
const tmpZoomVec = new THREE.Vector3();
const tmpInspectDelta = new THREE.Vector3();

function makeDebugLineMaterial() {
    const mat = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: false,
        opacity: 1.0,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false
    });
    return mat;
}

function formatCoord(value) {
    const abs = Math.abs(value);
    if (abs >= 1e7) return value.toExponential(2);
    if (abs >= 1e4) return Math.round(value).toLocaleString();
    return value.toFixed(1);
}

function clampStarSizeMultiplier(value) {
    if (!Number.isFinite(value)) return DEFAULT_STAR_SIZE_MULTIPLIER;
    return Math.min(MAX_STAR_SIZE_MULTIPLIER, Math.max(MIN_STAR_SIZE_MULTIPLIER, value));
}

function formatStarSizeMultiplier(value) {
    return `${value.toFixed(2).replace(/\.?0+$/, '')}x`;
}

function getGalaxyPointSizeFloorPx(mesh, starSizeMultiplier) {
    if (!mesh?.material?.uniforms?.uPointFloorPx) return 0;
    if (simState.viewLevel < 1) return 0;
    if (mesh?.userData?.isCachedGalaxy) return 0;
    return starSizeMultiplier * 0.5;
}

function seededRandom(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 0xffffffff;
    };
}

function randomSphericalLocal(rand, radius) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const sinPhi = Math.sin(phi);
    return new THREE.Vector3(
        radius * sinPhi * Math.cos(theta),
        radius * sinPhi * Math.sin(theta),
        radius * Math.cos(phi)
    );
}

function estimateStellarLightFactor(starMassSolar) {
    if (!Number.isFinite(starMassSolar) || starMassSolar <= 0) return 0.05;
    const mainSequence = Math.pow(starMassSolar, 3.2) * STAR_LIGHT_VISIBILITY_BOOST;
    return Math.max(STAR_MIN_LUMINOSITY_FACTOR, Math.min(mainSequence, 700));
}

function getStarGlowTexture() {
    if (starGlowTexture) return starGlowTexture;
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const r = size * 0.5;
    const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0.0, 'rgba(255,255,255,1.0)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    grad.addColorStop(0.55, 'rgba(255,255,255,0.25)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0.0)');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    starGlowTexture = tex;
    return starGlowTexture;
}

function getSystemOverviewMarkerTexture() {
    if (systemOverviewMarkerTexture) return systemOverviewMarkerTexture;
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const padOuter = 10;
    const padInner = 28;

    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.32;
    ctx.strokeRect(
        padOuter,
        padOuter,
        size - (padOuter * 2),
        size - (padOuter * 2)
    );

    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 3;
    ctx.strokeRect(
        padInner,
        padInner,
        size - (padInner * 2),
        size - (padInner * 2)
    );

    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#00ff66';
    const corner = 5;
    ctx.fillRect(padOuter - 2, padOuter - 2, corner, corner);
    ctx.fillRect(size - padOuter - corner + 2, padOuter - 2, corner, corner);
    ctx.fillRect(padOuter - 2, size - padOuter - corner + 2, corner, corner);
    ctx.fillRect(size - padOuter - corner + 2, size - padOuter - corner + 2, corner, corner);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    systemOverviewMarkerTexture = tex;
    return systemOverviewMarkerTexture;
}

function markMaterialsForUpdate(root) {
    if (!root || typeof root.traverse !== 'function') return;
    root.traverse((obj) => {
        if (!obj?.material) return;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
            if (m) m.needsUpdate = true;
        });
    });
}

function disposeObjectRecursive(root) {
    if (!root) return;
    root.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (!obj.material) return;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m?.dispose?.());
    });
}

function getUniversePointWorldPosition(index, out = tmpPickPos) {
    const posAttr = points?.geometry?.attributes?.position;
    if (!posAttr || index < 0 || index >= posAttr.count) return null;
    const i3 = index * 3;
    const positions = posAttr.array;
    const expansion = 1.0 - Math.exp(-simState.universeSimTime * 2.0);
    const offset = points?.position || tmpWorldPos.set(0, 0, 0);
    out.set(
        positions[i3] * expansion + offset.x,
        positions[i3 + 1] * expansion + offset.y,
        positions[i3 + 2] * expansion + offset.z
    );
    return out;
}

function isGalaxyPointInsideCloudLocal(x, y, z) {
    const radial = Math.sqrt(x * x + z * z);
    if (radial > SCALES.GALAXY * 1.15) return false;
    if (Math.abs(y) > SCALES.GALAXY * 0.35) return false;
    return true;
}

function getGalaxyPointWorldPosition(index, out = tmpPickPos) {
    const posAttr = localGalaxy?.geometry?.attributes?.position;
    const orbitAttr = localGalaxy?.geometry?.attributes?.aOrbit;
    if (!posAttr || !orbitAttr || index < 0 || index >= posAttr.count) return null;
    const i3 = index * 3;
    const positions = posAttr.array;
    const orbits = orbitAttr.array;
    const radius = orbits[i3];
    const speed = orbits[i3 + 1];
    const initAngle = orbits[i3 + 2];
    let x = positions[i3];
    let z = positions[i3 + 2];
    if (radius > 0) {
        const angle = initAngle + simState.galaxySimTime * speed * 0.005;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
    }
    const y = positions[i3 + 1];
    if (!isGalaxyPointInsideCloudLocal(x, y, z)) return null;
    const offset = localGalaxy?.position || tmpWorldPos.set(0, 0, 0);
    out.set(x + offset.x, y + offset.y, z + offset.z);
    return out;
}

function findUniversePickFallback(clientX, clientY, rect) {
    const posAttr = points?.geometry?.attributes?.position;
    if (!posAttr || !camera) return null;
    const positions = posAttr.array;
    const count = posAttr.count || 0;
    if (count === 0) return null;
    const expansion = 1.0 - Math.exp(-simState.universeSimTime * 2.0);
    const offset = points?.position || new THREE.Vector3();
    const maxPx = Math.max(18, Math.min(rect.width, rect.height) * 0.06);
    let bestDist2 = maxPx * maxPx;
    let bestIndex = -1;
    const bestWorld = new THREE.Vector3();

    for (let i = 0, i3 = 0; i < count; i++, i3 += 3) {
        tmpPickPos.set(
            positions[i3] * expansion + offset.x,
            positions[i3 + 1] * expansion + offset.y,
            positions[i3 + 2] * expansion + offset.z
        );
        tmpPickNdc.copy(tmpPickPos).project(camera);
        if (tmpPickNdc.z < -1 || tmpPickNdc.z > 1) continue;
        const px = rect.left + (tmpPickNdc.x * 0.5 + 0.5) * rect.width;
        const py = rect.top + (-tmpPickNdc.y * 0.5 + 0.5) * rect.height;
        const dx = clientX - px;
        const dy = clientY - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestDist2) {
            bestDist2 = d2;
            bestIndex = i;
            bestWorld.copy(tmpPickPos);
        }
    }

    if (bestIndex === -1) return null;
    return { index: bestIndex, position: bestWorld };
}

function findGalaxyPickFallback(clientX, clientY, rect) {
    const posAttr = localGalaxy?.geometry?.attributes?.position;
    const orbitAttr = localGalaxy?.geometry?.attributes?.aOrbit;
    if (!posAttr || !orbitAttr || !camera) return null;
    const positions = posAttr.array;
    const orbits = orbitAttr.array;
    const count = posAttr.count || 0;
    if (count === 0) return null;
    const offset = localGalaxy?.position || new THREE.Vector3();
    const stride = Math.max(1, Math.ceil(count / MAX_PICK_SCAN_POINTS));
    const maxPx = Math.max(20, Math.min(rect.width, rect.height) * 0.07);
    let bestDist2 = maxPx * maxPx;
    let bestIndex = -1;
    const bestWorld = new THREE.Vector3();
    const simTime = simState.galaxySimTime;

    for (let i = 0, i3 = 0; i < count; i += stride, i3 = i * 3) {
        const radius = orbits[i3];
        const speed = orbits[i3 + 1];
        const initAngle = orbits[i3 + 2];
        let x = positions[i3];
        let z = positions[i3 + 2];
        if (radius > 0) {
            const angle = initAngle + simTime * speed * 0.005;
            x = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
        }
        const y = positions[i3 + 1];
        if (!isGalaxyPointInsideCloudLocal(x, y, z)) continue;
        tmpPickPos.set(x + offset.x, y + offset.y, z + offset.z);
        tmpPickNdc.copy(tmpPickPos).project(camera);
        if (tmpPickNdc.z < -1 || tmpPickNdc.z > 1) continue;
        const px = rect.left + (tmpPickNdc.x * 0.5 + 0.5) * rect.width;
        const py = rect.top + (-tmpPickNdc.y * 0.5 + 0.5) * rect.height;
        const dx = clientX - px;
        const dy = clientY - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestDist2) {
            bestDist2 = d2;
            bestIndex = i;
            bestWorld.copy(tmpPickPos);
        }
    }

    if (bestIndex === -1) return null;
    return { index: bestIndex, position: bestWorld };
}

function resolveStarClass(typeObj) {
    const fallback = STAR_CLASSES[4];
    if (!typeObj || typeof typeObj !== 'object') return fallback;
    const byId = typeObj.id ? STAR_CLASSES.find((c) => c.id === typeObj.id) : null;
    const candidate = byId || typeObj;
    if (!Number.isFinite(candidate.mass) || !Number.isFinite(candidate.rad)) {
        return byId || fallback;
    }
    return candidate;
}

function schwarzschildRadiusM(massKg) {
    return (2 * G_M * massKg) / (C_M_S * C_M_S);
}

function getSmbhInfo() {
    const baseSeed = (simState.activeGalaxyData?.designation || `SEED-${CONFIG.seed}`).split('')
        .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0);
    const isQuasar = /QUASAR|AGN/i.test(simState.activeGalaxyData?.type || '');
    const massSolar = 1_000_000 + (baseSeed % 900_000_000);
    const radiusM = schwarzschildRadiusM(massSolar * SOLAR_MASS_KG);
    const radius = (radiusM / SOLAR_RADIUS_M).toFixed(3);
    return {
        designation: simState.activeGalaxyData?.designation
            ? `${simState.activeGalaxyData.designation} ${isQuasar ? 'QUASAR' : 'CORE'}`
            : (isQuasar ? "QUASAR CORE" : "GALACTIC CORE"),
        typeObj: { id: 'BH', color: 0x00ff00 },
        state: 'REMNANT',
        age: simState.universeSimTime.toFixed(3),
        mass: massSolar.toLocaleString(),
        radius,
        lum: isQuasar ? "ACTIVE" : "0",
        spectrum: [],
        massSolar,
        radiusM,
        composition: isQuasar
            ? `AGN: ACTIVE (QUASAR)\nACCRETION: EXTREME\nMASS: ${massSolar.toLocaleString()} M☉`
            : `EVENT HORIZON: STABLE\nACCRETION: ACTIVE\nMASS: ${massSolar.toLocaleString()} M☉`
    };
}

function queueAutopilotGalaxyPriorityTargets() {
    simState.autopilotPriorityTargets = [];
    if (!simState.isAutopilot) return;
    if (simState.viewLevel !== 1) return;
    if (!smbhGroup || smbhGroup.children.length === 0) return;

    const data = getSmbhInfo();
    smbhGroup.children.forEach((obj) => {
        if (!obj || typeof obj.getWorldPosition !== 'function') return;
        simState.autopilotPriorityTargets.push({ object: obj, data });
    });
}

function disableAutopilot() {
    if (!simState.isAutopilot) return;
    simState.isAutopilot = false;
    simState.autopilotPriorityTargets = [];
    if (elAutopilotToggle) elAutopilotToggle.checked = false;
}

function buildClampedKnots(pointCount, degree) {
    const knotCount = pointCount + degree + 1;
    const knots = [];
    for (let i = 0; i <= degree; i++) knots.push(0);
    const interiorCount = knotCount - 2 * (degree + 1);
    for (let i = 1; i <= interiorCount; i++) {
        knots.push(i / (interiorCount + 1));
    }
    for (let i = 0; i <= degree; i++) knots.push(1);
    return knots;
}

function updateTravelPathLine() {
    if (!simState.showTravelPath) {
        if (travelPathLine) travelPathLine.visible = false;
        return;
    }
    if (travelPathPoints.length === 0) {
        travelPathPoints.push(simState.worldOffset.clone());
    }
    if (travelPathPoints.length < 2) {
        if (travelPathLine) travelPathLine.visible = false;
        return;
    }

    const degree = Math.min(3, travelPathPoints.length - 1);
    const controlPoints = travelPathPoints.map((p) => new THREE.Vector4(p.x, p.y, p.z, 1));
    const knots = buildClampedKnots(controlPoints.length, degree);
    const curve = new NURBSCurve(degree, knots, controlPoints);
    const sampleCount = Math.min(1024, 64 + travelPathPoints.length * 32);
    const curvePoints = curve.getPoints(sampleCount);
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

    if (!travelPathLine) {
        const material = makeDebugLineMaterial();
        travelPathLine = new THREE.Line(geometry, material);
        travelPathLine.frustumCulled = false;
        travelPathLine.renderOrder = 1000;
        scene.add(travelPathLine);
    } else {
        travelPathLine.geometry.dispose();
        travelPathLine.geometry = geometry;
        travelPathLine.visible = true;
        // Update material color in case it changed
        if (travelPathLine.material) {
            travelPathLine.material.dispose?.();
            travelPathLine.material = makeDebugLineMaterial();
        }
    }
    if (travelPathLine) {
        travelPathLine.position.copy(simState.worldOffset).multiplyScalar(-1);
    }
}

function recordTravelPoint(point) {
    travelPathPoints.push(point.clone());
    updateTravelPathLine();
}

function shiftTravelPath(offset) {
    for (let i = 0; i < travelPathPoints.length; i++) {
        travelPathPoints[i].sub(offset);
    }
    updateTravelPathLine();
}

function clearTravelPath() {
    travelPathPoints.length = 0;
    if (travelPathLine) {
        scene.remove(travelPathLine);
        if (travelPathLine.geometry) travelPathLine.geometry.dispose();
        if (travelPathLine.material) travelPathLine.material.dispose();
        travelPathLine = null;
    }
}

function captureUiState() {
    return {
        qualityLevel: simState.qualityLevel,
        pixelationFactor: simState.pixelationFactor,
        starSizeMultiplier: simState.starSizeMultiplier,
        timeScale: simState.timeScale,
        crtEnabled: elCrtToggle?.checked ?? true,
        isAutopilot: simState.isAutopilot,
        showTravelPath: simState.showTravelPath,
        schwarzschildLensing: simState.useSchwarzschildLensing
    };
}

function applyUiState(state) {
    if (!state) return;
    if (state.qualityLevel && QUALITY_PRESETS[state.qualityLevel]) {
        simState.qualityLevel = state.qualityLevel;
        const q = QUALITY_PRESETS[state.qualityLevel];
        CONFIG.starCount = q.starCount;
        CONFIG.clusterCount = q.clusterCount;
        CONFIG.densityRes = q.densityRes || CONFIG.densityRes;
        document.querySelectorAll('.q-btn').forEach((btn) => {
            const isActive = btn.getAttribute('data-q') === state.qualityLevel;
            btn.classList.toggle('active', isActive);
        });
    }
    if (Number.isFinite(state.pixelationFactor)) {
        simState.pixelationFactor = state.pixelationFactor;
        if (elRetroSlider) elRetroSlider.value = simState.pixelationFactor;
        if (elRetroVal) elRetroVal.innerText = simState.pixelationFactor;
        updatePixelation();
    }
    if (Number.isFinite(state.starSizeMultiplier)) {
        simState.starSizeMultiplier = clampStarSizeMultiplier(state.starSizeMultiplier);
        updateStarSizeMultiplier();
    }
    if (Number.isFinite(state.timeScale)) {
        simState.timeScale = state.timeScale;
        if (elSlider) elSlider.value = simState.timeScale;
    }
    if (typeof state.crtEnabled === 'boolean' && elCrtToggle) {
        elCrtToggle.checked = state.crtEnabled;
        if (state.crtEnabled) elCrtOverlay.classList.add('crt-effects');
        else elCrtOverlay.classList.remove('crt-effects');
    }
    if (typeof state.isAutopilot === 'boolean') {
        simState.isAutopilot = state.isAutopilot;
        if (elAutopilotToggle) elAutopilotToggle.checked = simState.isAutopilot;
    }
    if (typeof state.showTravelPath === 'boolean') {
        simState.showTravelPath = state.showTravelPath;
        if (elPathToggle) elPathToggle.checked = simState.showTravelPath;
        updateTravelPathLine();
    }
    if (typeof state.schwarzschildLensing === 'boolean') {
        simState.useSchwarzschildLensing = state.schwarzschildLensing;
        if (elLensToggle) elLensToggle.checked = simState.useSchwarzschildLensing;
        if (lensingPass) lensingPass.enabled = simState.useSchwarzschildLensing;
    }
}

function getGalaxyCacheLimit() {
    switch (simState.qualityLevel) {
        case 'ULTRA': return 4;
        case 'HIGH': return 3;
        case 'MED': return 2;
        case 'LOW':
        default: return 1;
    }
}

function cacheActiveGalaxy() {
    if (!localGalaxy) return;
    localGalaxy.visible = true;
    localGalaxy.userData.isCachedGalaxy = true;
    galaxyCacheGroup?.add(localGalaxy);
    galaxyCache.push(localGalaxy);
    localGalaxy = null;
    if (nebulaSystem) {
        scene.remove(nebulaSystem);
        nebulaSystem.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        nebulaSystem = null;
    }
    smbhGroup?.clear();
    pruneGalaxyCache();
}

function pruneGalaxyCache(limit = getGalaxyCacheLimit()) {
    while (galaxyCache.length > limit) {
        const old = galaxyCache.shift();
        if (!old) continue;
        galaxyCacheGroup?.remove(old);
        if (old.geometry) old.geometry.dispose();
        if (old.material) old.material.dispose();
    }
}

function shiftGalaxyCache(offset) {
    if (!galaxyCacheGroup) return;
    galaxyCacheGroup.position.sub(offset);
}

function updateStarSizeMultiplier() {
    const starSizeMultiplier = clampStarSizeMultiplier(simState.starSizeMultiplier);
    simState.starSizeMultiplier = starSizeMultiplier;
    if (elStarSizeSlider) elStarSizeSlider.value = starSizeMultiplier.toString();
    if (elStarSizeVal) elStarSizeVal.innerText = formatStarSizeMultiplier(starSizeMultiplier);

    const applyToMesh = (mesh) => {
        if (mesh?.material?.uniforms?.uStarSizeMultiplier) {
            mesh.material.uniforms.uStarSizeMultiplier.value = starSizeMultiplier;
        }
        if (mesh?.material?.uniforms?.uPointFloorPx) {
            mesh.material.uniforms.uPointFloorPx.value = getGalaxyPointSizeFloorPx(mesh, starSizeMultiplier);
        }
    };

    applyToMesh(points);
    applyToMesh(localGalaxy);
    if (galaxyCacheGroup?.children?.length) {
        galaxyCacheGroup.children.forEach((mesh) => applyToMesh(mesh));
    }
}

function updateSmbhScaleForView() {
    if (!smbhGroup) return;
    smbhGroup.scale.setScalar(1);
}

function findNearbyNebula(position) {
    if (!nebulaSystem || !position) return null;
    let nearest = null;
    let nearestDist = Infinity;
    nebulaSystem.children.forEach((mesh) => {
        if (!mesh?.userData?.isNebula) return;
        const radius = mesh.userData.radius || 0;
        const dist = position.distanceTo(mesh.position);
        if (dist < radius * 0.8 && dist < nearestDist) {
            nearest = mesh;
            nearestDist = dist;
        }
    });
    return nearest;
}

function getNebulaRoot(obj) {
    let current = obj;
    while (current && !current.userData?.isNebula) current = current.parent;
    return current;
}

// Lensing Globals
let lensingPass, crtPass;
const MAX_BLACKHOLES = 4;
const blackHoleUniforms = {
    uBHCount: { value: 0 },
    uBHPos: { value: Array.from({ length: MAX_BLACKHOLES }, () => new THREE.Vector2()) },
    uBHMass: { value: new Array(MAX_BLACKHOLES).fill(0) },
    uBHRadius: { value: new Array(MAX_BLACKHOLES).fill(0) }
};
let activeBlackHoles = []; 
const travelPathPoints = [];
let travelPathLine = null;

// Physics & Events
let physicsBodies = []; 
let passiveBodies = []; 
let activeCMEs = []; 

let simState = {
    universeSimTime: 13.8,
    galaxySimTime: 0,
    isPaused: false,
    timeScale: 0.25,
    viewLevel: 0,
    isTransitioning: false,
    transitionTarget: new THREE.Vector3(),
    transitionData: null,
    transitionProgress: 0,
    nextLevel: 0,
    worldOffset: new THREE.Vector3(0,0,0),
    currentGalaxyType: 0,
    qualityLevel: URL_QUALITY || 'HIGH', // Use URL param if provided
    pixelationFactor: 1,
    starSizeMultiplier: INITIAL_STAR_SIZE_MULTIPLIER,
    selectedTarget: null, 
    activeGalaxyData: null,
    activeSystemData: null,
    activeNebula: null,
    isAutopilot: true,
    autopilotTimer: 0,
    autopilotNextAction: 2.0, 
    visitedSystemsCount: 0,
    lastGalaxyVisitTime: 0,
    autopilotZooming: false,
    autopilotPanelHidden: false,
    autopilotPriorityTargets: [],
    planetTourIndex: 0,
    trackingTarget: null,
    inspectingTarget: null,
    inspectingTargetPreviousPos: null,
    bigBangFlash: 0,
    showTravelPath: false,
    useSchwarzschildLensing: true
};

// --- Elements ---
const elCX = document.getElementById('c-x');
const elCY = document.getElementById('c-y');
const elCZ = document.getElementById('c-z');
const elTime = document.getElementById('time');
const elFPS = document.getElementById('fps');
const elObjects = document.getElementById('objects');
const elSeed = document.getElementById('seed-disp');
let elPauseBtn = document.getElementById('pause-btn');
let elBackBtn = document.getElementById('back-btn');
const elSlider = document.getElementById('timestep-slider');
const elAlert = document.getElementById('alert-box');
const elAlertTitle = document.getElementById('alert-title');
const elAlertMsg = document.getElementById('alert-msg');
const elAlertDismiss = document.getElementById('alert-dismiss');
const elConfigBtn = document.getElementById('config-btn');
const elConfigModal = document.getElementById('config-modal');
const elConfigClose = document.getElementById('config-close');
const elRetroSlider = document.getElementById('retro-slider');
const elRetroVal = document.getElementById('retro-val');
const elStarSizeSlider = document.getElementById('star-size-slider');
const elStarSizeVal = document.getElementById('star-size-val');
const elCrtToggle = document.getElementById('crt-toggle');
const elLensToggle = document.getElementById('bh-lens-toggle');
const elAutopilotToggle = document.getElementById('autopilot-toggle');
const elPathToggle = document.getElementById('path-toggle');
const elCrtOverlay = document.getElementById('crt-overlay');
let elStatusToggle = document.getElementById('status-toggle-btn');
const elSimToggle = document.getElementById('sim-toggle-btn');
const elStatusPanel = document.getElementById('stats-panel');
const elSimPanel = document.getElementById('controls-panel');
const elStatusClose = document.getElementById('stats-close');
const elSimClose = document.getElementById('sim-close');
const elLocBtn = document.getElementById('loc-btn');
const elTargetPanel = document.getElementById('target-panel');
const elTargetClose = document.getElementById('target-close');
const elTargetTitle = document.getElementById('target-title');
const elTName = document.getElementById('t-name');
const elTType = document.getElementById('t-type');
const elTAge = document.getElementById('t-age');
const elTMass = document.getElementById('t-mass');
const elTRad = document.getElementById('t-rad');
const elTLum = document.getElementById('t-lum');
const elSpectrograph = document.getElementById('spectrograph');
const elTComposition = document.getElementById('t-composition');
const elWarpBtn = document.getElementById('warp-btn');
const elCursor = document.getElementById('mouse-cursor');

let universeGenerationToken = 0;
let galaxyGenerationToken = 0;
let pendingUiState = null;

init();

function mountVrButton() {
    const oldVrBtn = document.getElementById('VRButton');
    if (oldVrBtn) oldVrBtn.remove();

    const vrContainer = document.getElementById('vr-button-container');

    const btn = document.createElement('button');
    btn.id = 'VRButton';
    btn.style.width = '100%';
    btn.textContent = 'VR...';
    btn.disabled = true;
    (vrContainer || document.body).appendChild(btn);

    if (!renderer?.xr || !navigator?.xr) {
        btn.style.display = 'none';
        return;
    }

    // NOTE: We intentionally do NOT request the WebXR 'layers' feature here.
    // Some devices/browsers appear to have trouble returning to the canvas after
    // an XR session that used projection layers.
    const sessionOptions = {
        optionalFeatures: ['local-floor', 'bounded-floor']
    };

    let currentSession = null;

    const updateLabel = () => {
        btn.textContent = currentSession ? 'EXIT VR' : 'ENTER VR';
    };

    const onSessionEnd = () => {
        if (!currentSession) return;
        currentSession.removeEventListener('end', onSessionEnd);
        currentSession = null;
        updateLabel();
    };

    btn.onclick = async () => {
        if (currentSession) {
            try { await currentSession.end(); } catch (e) {}
            return;
        }

        try {
            renderer.xr.setReferenceSpaceType('local-floor');
        } catch (e) {}

        try {
            currentSession = await navigator.xr.requestSession('immersive-vr', sessionOptions);
            currentSession.addEventListener('end', onSessionEnd);
            await renderer.xr.setSession(currentSession);
            updateLabel();
        } catch (e) {
            console.warn('WebXR session start failed:', e);
            currentSession = null;
            btn.textContent = 'VR FAILED';
            setTimeout(updateLabel, 1500);
        }
    };

    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (!supported) {
            btn.style.display = 'none';
            return;
        }
        btn.disabled = false;
        updateLabel();
    }).catch(() => {
        btn.style.display = 'none';
    });
}

function vrUiGetPlaneSize(aspect) {
    const width = 1.6;
    const safeAspect = Math.max(0.25, Math.min(4.0, aspect || 1));
    let height = width / safeAspect;
    height = Math.max(0.45, Math.min(1.55, height));
    return { width, height };
}

function vrUiUpdatePlaneGeometry(aspect) {
    if (!vrUI?.mesh) return;
    if (vrUI.planeAspect && Math.abs(vrUI.planeAspect - aspect) < 0.01) return;
    vrUI.planeAspect = aspect;
    const { width, height } = vrUiGetPlaneSize(aspect);
    try { vrUI.mesh.geometry.dispose(); } catch (e) {}
    vrUI.mesh.geometry = new THREE.PlaneGeometry(width, height);
    if (vrUI.bgMesh) {
        try { vrUI.bgMesh.geometry.dispose(); } catch (e) {}
        vrUI.bgMesh.geometry = new THREE.PlaneGeometry(width * 1.02, height * 1.02);
    }
    if (vrUI.border) {
        const z = 0.002;
        const pts = [
            new THREE.Vector3(-width / 2, -height / 2, z),
            new THREE.Vector3(width / 2, -height / 2, z),
            new THREE.Vector3(width / 2, height / 2, z),
            new THREE.Vector3(-width / 2, height / 2, z),
            new THREE.Vector3(-width / 2, -height / 2, z)
        ];
        try { vrUI.border.geometry.dispose(); } catch (e) {}
        vrUI.border.geometry = new THREE.BufferGeometry().setFromPoints(pts);
    }
}

function vrUiSetVisible(visible) {
    if (!vrUI?.anchor) return;
    vrUI.visible = visible;
    vrUI.anchor.visible = visible;
    if (!visible) {
        if (vrUI.reticle) vrUI.reticle.visible = false;
        (vrUI.controllers || []).forEach((c) => {
            if (c?.line) c.line.visible = false;
            if (c?.controller?.userData?.vrUi) {
                c.controller.userData.vrUi.hoverEl = null;
                c.controller.userData.vrUi.activeEl = null;
                c.controller.userData.vrUi.clickTarget = null;
                c.controller.userData.vrUi.draggingRange = null;
                c.controller.userData.vrUi.pressed = false;
            }
        });
    } else {
        vrUI.needsCapture = true;
        vrUI.lastCaptureMs = 0;
        (vrUI.controllers || []).forEach((c) => { if (c?.line) c.line.visible = true; });
    }
}

function vrUiDrawPlaceholder(message = 'VR UI') {
    if (!vrUI?.canvas) return;
    const ctx = vrUI.canvas.getContext('2d');
    if (!ctx) return;
    const w = vrUI.canvas.width || 1;
    const h = vrUI.canvas.height || 1;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0, 15, 0, 0.92)';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.85)';
    const lw = Math.max(2, Math.floor(Math.min(w, h) / 220));
    ctx.lineWidth = lw;
    ctx.strokeRect(lw / 2, lw / 2, w - lw, h - lw);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.95)';
    const titleSize = Math.max(18, Math.floor(Math.min(w, h) / 14));
    const smallSize = Math.max(12, Math.floor(titleSize * 0.55));
    ctx.font = `${titleSize}px monospace`;
    ctx.fillText(message, lw * 2, lw * 2 + titleSize);
    ctx.font = `${smallSize}px monospace`;
    ctx.fillText('waiting for capture…', lw * 2, lw * 2 + titleSize + smallSize + 6);
    ctx.fillText(new Date().toLocaleTimeString(), lw * 2, lw * 2 + titleSize + (smallSize + 6) * 2);
    if (vrUI.texture) vrUI.texture.needsUpdate = true;
}

function vrUiFindInteractiveElement(el) {
    let cur = el;
    for (let i = 0; i < 6 && cur; i++) {
        if (cur instanceof HTMLInputElement) {
            if (cur.type === 'range') return { kind: 'range', el: cur };
            if (cur.type === 'checkbox' || cur.type === 'button') return { kind: 'click', el: cur };
        }
        if (cur instanceof HTMLButtonElement) return { kind: 'click', el: cur };
        if (cur instanceof HTMLLabelElement) return { kind: 'click', el: cur };
        if (cur.classList && cur.classList.contains('panel-close')) return { kind: 'click', el: cur };
        cur = cur.parentElement;
    }
    return el ? { kind: 'click', el } : null;
}

function vrUiSyncFormState(srcRoot, dstRoot) {
    if (!srcRoot || !dstRoot) return;
    const src = srcRoot.querySelectorAll('input, textarea, select');
    const dst = dstRoot.querySelectorAll('input, textarea, select');
    const n = Math.min(src.length, dst.length);
    for (let i = 0; i < n; i++) {
        const s = src[i];
        const d = dst[i];
        if (!s || !d) continue;

        const sTag = (s.tagName || '').toLowerCase();
        const dTag = (d.tagName || '').toLowerCase();
        if (sTag !== dTag) continue;

        if (sTag === 'input') {
            const st = (s.type || '').toLowerCase();
            if (st === 'checkbox' || st === 'radio') {
                d.checked = s.checked;
                if (s.checked) d.setAttribute('checked', '');
                else d.removeAttribute('checked');
            } else {
                d.value = s.value;
                d.setAttribute('value', s.value ?? '');
            }
        } else if (sTag === 'textarea') {
            d.value = s.value;
            d.textContent = s.value ?? '';
        } else if (sTag === 'select') {
            d.selectedIndex = s.selectedIndex;
            const dOpts = d.options || [];
            const sOpts = s.options || [];
            const m = Math.min(dOpts.length, sOpts.length);
            for (let j = 0; j < m; j++) dOpts[j].selected = !!sOpts[j].selected;
        }
    }
}

function vrUiUpdateRange(rangeEl, clientX, emitChange = false) {
    if (!rangeEl) return;
    const rect = rangeEl.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const min = Number(rangeEl.min || 0);
    const max = Number(rangeEl.max || 1);
    const step = Number(rangeEl.step || 0);
    let t = (clientX - rect.left) / rect.width;
    t = Math.max(0, Math.min(1, t));
    let next = min + t * (max - min);
    if (Number.isFinite(step) && step > 0) next = Math.round(next / step) * step;
    const prev = rangeEl.value;
    rangeEl.value = String(next);
    if (prev !== rangeEl.value) rangeEl.dispatchEvent(new Event('input', { bubbles: true }));
    if (emitChange) rangeEl.dispatchEvent(new Event('change', { bubbles: true }));
}

function setupVrUiControllers() {
    if (!vrUI || !renderer || !scene) return;

    if (vrUI.controllers && vrUI.controllers.length) {
        vrUI.controllers.forEach(({ controller }) => {
            if (!controller) return;
            try { controller.removeEventListener('selectstart', onVrUiSelectStart); } catch (e) {}
            try { controller.removeEventListener('selectend', onVrUiSelectEnd); } catch (e) {}
            try { scene.remove(controller); } catch (e) {}
        });
    }

    vrUI.controllers = [];
    for (let i = 0; i < 2; i++) {
        const controller = renderer.xr.getController(i);
        controller.userData.vrUi = {
            index: i,
            pointerId: 9000 + i,
            pressed: false,
            hoverEl: null,
            activeEl: null,
            clickTarget: null,
            draggingRange: null,
            clientX: 0,
            clientY: 0
        };
        controller.addEventListener('selectstart', onVrUiSelectStart);
        controller.addEventListener('selectend', onVrUiSelectEnd);

        const lineGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
        const line = new THREE.Line(lineGeom, lineMat);
        line.name = 'vr-ui-ray';
        line.visible = false;
        line.renderOrder = 998;
        line.scale.z = 2.0;
        controller.add(line);

        scene.add(controller);
        vrUI.controllers.push({ controller, line });
    }
}

function setupVrUi() {
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;
    if (!scene) return;

    if (!vrUI) vrUI = {};
    vrUI.uiLayer = uiLayer;
    if (!vrUI.captureHost) {
        let host = document.getElementById('vr-ui-capture-host');
        if (!host) {
            host = document.createElement('div');
            host.id = 'vr-ui-capture-host';
            host.setAttribute('aria-hidden', 'true');
            host.style.position = 'fixed';
            host.style.left = '0';
            host.style.top = '200vh';
            host.style.width = '1px';
            host.style.height = '1px';
            host.style.overflow = 'hidden';
            host.style.pointerEvents = 'none';
            host.style.opacity = '0';
            host.style.zIndex = '-1';
            document.body.appendChild(host);
        }
        vrUI.captureHost = host;
        vrUI.captureLayer = null;
    }
    vrUI.maxCaptureDim = 2048;
    vrUI.captureIntervalMs = 500;
    vrUI.captureInFlight = false;
    vrUI.needsCapture = true;
    if (typeof vrUI.dirtyCounter !== 'number') vrUI.dirtyCounter = 0;
    if (typeof vrUI.forceCapture !== 'boolean') vrUI.forceCapture = false;
    vrUI.lastCaptureMs = 0;
    vrUI.visible = false;

    if (!vrUI.canvas) {
        vrUI.canvas = document.createElement('canvas');
        vrUI.canvas.width = 512;
        vrUI.canvas.height = 256;
    }

    if (!vrUI.texture) {
        vrUI.texture = new THREE.CanvasTexture(vrUI.canvas);
        vrUI.texture.minFilter = THREE.LinearFilter;
        vrUI.texture.magFilter = THREE.LinearFilter;
        vrUI.texture.generateMipmaps = false;
        try {
            if (renderer?.capabilities?.getMaxAnisotropy) {
                vrUI.texture.anisotropy = Math.max(1, renderer.capabilities.getMaxAnisotropy());
            }
        } catch (e) {}
        if (THREE.SRGBColorSpace) vrUI.texture.colorSpace = THREE.SRGBColorSpace;
    }
    vrUiDrawPlaceholder('VR UI');

    if (!vrUI.material) {
        vrUI.material = new THREE.MeshBasicMaterial({ map: vrUI.texture, transparent: true });
        vrUI.material.depthTest = false;
        vrUI.material.depthWrite = false;
        vrUI.material.side = THREE.DoubleSide;
    } else {
        vrUI.material.map = vrUI.texture;
    }

    if (vrUI.anchor) {
        try { scene.remove(vrUI.anchor); } catch (e) {}
    }
    vrUI.anchor = new THREE.Group();
    vrUI.anchor.visible = false;
    vrUI.anchor.name = 'vr-ui-anchor';
    scene.add(vrUI.anchor);
    vrUI.planeAspect = null;

    const aspect = window.innerWidth / window.innerHeight;
    vrUI.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), vrUI.material);
    vrUI.mesh.name = 'vr-ui-plane';
    vrUI.mesh.frustumCulled = false;
    vrUI.mesh.renderOrder = 999;
    vrUI.mesh.rotation.x = -0.07;
    vrUI.anchor.add(vrUI.mesh);

    if (!vrUI.bgMaterial) {
        vrUI.bgMaterial = new THREE.MeshBasicMaterial({
            color: 0x001a00,
            transparent: true,
            opacity: 0.25
        });
        vrUI.bgMaterial.depthTest = false;
        vrUI.bgMaterial.depthWrite = false;
        vrUI.bgMaterial.side = THREE.DoubleSide;
    }
    vrUI.bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), vrUI.bgMaterial);
    vrUI.bgMesh.name = 'vr-ui-backdrop';
    vrUI.bgMesh.frustumCulled = false;
    vrUI.bgMesh.renderOrder = 998;
    vrUI.bgMesh.position.z = -0.003;
    vrUI.mesh.add(vrUI.bgMesh);

    if (!vrUI.borderMaterial) {
        vrUI.borderMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.6 });
        vrUI.borderMaterial.depthTest = false;
        vrUI.borderMaterial.depthWrite = false;
    }
    vrUI.border = new THREE.Line(new THREE.BufferGeometry(), vrUI.borderMaterial);
    vrUI.border.name = 'vr-ui-border';
    vrUI.border.renderOrder = 1000;
    vrUI.mesh.add(vrUI.border);
    vrUiUpdatePlaneGeometry(aspect);

    const retMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.9 });
    retMat.depthTest = false;
    retMat.depthWrite = false;
    vrUI.reticle = new THREE.Mesh(new THREE.RingGeometry(0.008, 0.012, 32), retMat);
    vrUI.reticle.name = 'vr-ui-reticle';
    vrUI.reticle.visible = false;
    vrUI.reticle.position.z = 0.001;
    vrUI.reticle.renderOrder = 1000;
    vrUI.mesh.add(vrUI.reticle);

    if (vrUI.mutationObserver) vrUI.mutationObserver.disconnect();
    vrUI.mutationObserver = new MutationObserver(() => {
        if (!vrUI) return;
        vrUI.needsCapture = true;
        vrUI.dirtyCounter = (vrUI.dirtyCounter || 0) + 1;
    });
    vrUI.mutationObserver.observe(uiLayer, { attributes: true, childList: true, subtree: true, characterData: true });

    setupVrUiControllers();
}

async function vrUiCapture() {
    if (!vrUI?.uiLayer || !vrUI?.texture) return;
    if (!vrUI.visible) return;
    if (vrUI.captureInFlight) return;

    const rect = vrUI.uiLayer.getBoundingClientRect();
    if (!rect || rect.width < 2 || rect.height < 2) return;

    vrUI.captureInFlight = true;
    const maxDim = vrUI.maxCaptureDim || 1024;
    const scale = Math.min(2.0, maxDim / Math.max(rect.width, rect.height));
    const outW = Math.max(2, Math.round(rect.width * scale));
    const outH = Math.max(2, Math.round(rect.height * scale));

    if (vrUI.canvas) {
        if (vrUI.canvas.width !== outW) vrUI.canvas.width = outW;
        if (vrUI.canvas.height !== outH) vrUI.canvas.height = outH;
    }

    const dirtyAtStart = vrUI.dirtyCounter || 0;
    const wasForced = !!vrUI.forceCapture;
    vrUI.forceCapture = false;

    // Capture directly from the live UI layer.
    // The ignoreElements/onclone callbacks filter out canvas/video to prevent "hall of mirrors".
    let captureTarget = vrUI.uiLayer;

    try {
        // Let html2canvas create its own canvas, then copy to ours
        const resultCanvas = await html2canvas(captureTarget, {
            backgroundColor: 'rgba(0, 15, 0, 0.92)',
            logging: false,
            scale,
            useCORS: true,
            removeContainer: true,
            width: rect.width,
            height: rect.height,
            x: rect.left,
            y: rect.top,
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            ignoreElements: (el) => {
                try {
                    const tag = (el && el.tagName) ? el.tagName.toLowerCase() : '';
                    if (tag === 'canvas' || tag === 'video' || tag === 'iframe') return true;
                    if (el && (el.id === 'mouse-cursor' || el.id === 'crt-overlay' || el.id === 'canvas-container')) return true;
                } catch (e) {}
                return false;
            },
            onclone: (clonedDoc) => {
                try {
                    const canvasContainer = clonedDoc.getElementById('canvas-container');
                    if (canvasContainer) canvasContainer.style.display = 'none';
                    const crt = clonedDoc.getElementById('crt-overlay');
                    if (crt) crt.style.display = 'none';
                    const cursor = clonedDoc.getElementById('mouse-cursor');
                    if (cursor) cursor.style.display = 'none';

                    clonedDoc.documentElement.style.background = 'transparent';
                    clonedDoc.body.style.background = 'transparent';
                    clonedDoc.querySelectorAll('canvas, video, iframe').forEach((node) => {
                        try { node.style.display = 'none'; } catch (e) {}
                    });
                } catch (e) {}
            }
        });
        
        // Copy result to our canvas
        if (resultCanvas && vrUI.canvas) {
            const ctx = vrUI.canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, vrUI.canvas.width, vrUI.canvas.height);
                ctx.drawImage(resultCanvas, 0, 0, vrUI.canvas.width, vrUI.canvas.height);
                
                // Debug: Draw timestamp to verify canvas updates are working
                ctx.fillStyle = 'rgba(0, 255, 0, 1)';
                ctx.font = '20px monospace';
                ctx.fillText(`T: ${Date.now() % 100000}`, 10, 30);
            }
        }
        
        // Debug logging
        console.log('VR UI capture:', {
            resultCanvas: resultCanvas ? `${resultCanvas.width}x${resultCanvas.height}` : 'null',
            ourCanvas: vrUI.canvas ? `${vrUI.canvas.width}x${vrUI.canvas.height}` : 'null',
            rect: `${rect.width}x${rect.height}`
        });
        // Force texture update - use WebGL texImage2D directly via Three.js
        vrUI.texture.image = vrUI.canvas;
        vrUI.texture.needsUpdate = true;
        
        // Force WebGL to upload the texture immediately during XR
        if (renderer?.xr?.isPresenting && renderer.properties) {
            try {
                // Clear Three.js cached texture properties to force re-upload
                const props = renderer.properties.get(vrUI.texture);
                if (props && props.__webglTexture) {
                    const gl = renderer.getContext();
                    gl.bindTexture(gl.TEXTURE_2D, props.__webglTexture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vrUI.canvas);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
            } catch (e) {
                // Fallback: just mark for update
                console.warn('Direct texture upload failed:', e);
            }
        }
        
        vrUI.sourceRect = rect;
        vrUI.canvasWidth = vrUI.canvas.width;
        vrUI.canvasHeight = vrUI.canvas.height;
        vrUiUpdatePlaneGeometry(vrUI.canvasWidth / vrUI.canvasHeight);
    } catch (e) {
        console.warn('VR UI capture failed:', e);
        vrUiDrawPlaceholder('CAPTURE FAILED');
    } finally {
        vrUI.captureInFlight = false;
        const dirtyNow = vrUI.dirtyCounter || 0;
        // If anything changed while we were rasterizing, schedule another capture.
        vrUI.needsCapture = dirtyNow !== dirtyAtStart;
        if (wasForced && vrUI.needsCapture) vrUI.forceCapture = true;
        vrUI.lastCaptureMs = performance.now();
    }
}

function vrUiUpdatePoseAndRay(nowMs) {
    if (!vrUI?.visible || !renderer?.xr?.isPresenting) return;
    if (!scene || !camera) return;

    // Force a minimum refresh rate (5 fps = 200ms) for real-time values like FPS/coords
    // This ensures updates even if MutationObserver doesn't fire
    const timeSinceLastCapture = nowMs - (vrUI.lastCaptureMs || 0);
    if (timeSinceLastCapture >= 200) {
        vrUI.needsCapture = true;
    }

    // Head-lock the UI plane a short distance in front of the user.
    const xrCam = renderer.xr.getCamera(camera);
    vrTmpVec3a.setFromMatrixPosition(xrCam.matrixWorld);
    vrTmpMat4.extractRotation(xrCam.matrixWorld);
    vrTmpVec3b.set(0, 0, -1).applyMatrix4(vrTmpMat4);
    vrUI.anchor.position.copy(vrTmpVec3a).add(vrTmpVec3b.multiplyScalar(1.15));
    vrUI.anchor.quaternion.setFromRotationMatrix(vrTmpMat4);
    vrUI.anchor.position.y -= 0.12;

    // Controller rays + reticle.
    let anyHit = false;
    (vrUI.controllers || []).forEach(({ controller, line }) => {
        if (!controller || !line) return;
        const st = controller.userData.vrUi;
        if (!st) return;

        vrTmpMat4.identity().extractRotation(controller.matrixWorld);
        vrUiRaycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        vrUiRaycaster.ray.direction.set(0, 0, -1).applyMatrix4(vrTmpMat4).normalize();
        vrUiRaycaster.far = 10;

        const hits = vrUI.mesh ? vrUiRaycaster.intersectObject(vrUI.mesh, false) : [];
        if (hits.length > 0) {
            const hit = hits[0];
            anyHit = true;
            line.scale.z = Math.max(0.15, hit.distance);

            const uv = hit.uv;
            if (uv && vrUI.canvasWidth && vrUI.canvasHeight) {
                const elRect = vrUI.uiLayer.getBoundingClientRect();
                const px = uv.x * vrUI.canvasWidth;
                const py = (1 - uv.y) * vrUI.canvasHeight;
                const clientX = elRect.left + (px / vrUI.canvasWidth) * elRect.width;
                const clientY = elRect.top + (py / vrUI.canvasHeight) * elRect.height;

                st.clientX = clientX;
                st.clientY = clientY;

                let el = document.elementFromPoint(clientX, clientY);
                if (!el || !vrUI.uiLayer.contains(el)) el = null;
                st.hoverEl = el;

                if (st.pressed && st.draggingRange) {
                    vrUiUpdateRange(st.draggingRange, clientX, false);
                    vrUI.needsCapture = true;
                }
            }

            if (vrUI.reticle) {
                vrTmpVec3a.copy(hit.point);
                vrUI.mesh.worldToLocal(vrTmpVec3a);
                vrUI.reticle.position.set(vrTmpVec3a.x, vrTmpVec3a.y, 0.001);
            }
        } else {
            line.scale.z = 2.0;
            st.hoverEl = null;
        }
    });

    if (vrUI.reticle) vrUI.reticle.visible = anyHit;

    // Rasterize the DOM UI at a throttled rate (immediate on controller interaction).
    const due = (nowMs - (vrUI.lastCaptureMs || 0)) >= (vrUI.captureIntervalMs || 250);
    if (!vrUI.captureInFlight && (vrUI.forceCapture || (vrUI.needsCapture && due))) vrUiCapture();
}

function onVrUiSelectStart(event) {
    if (!vrUI?.visible) return;
    const controller = event.target;
    const st = controller?.userData?.vrUi;
    if (!st) return;

    st.pressed = true;
    st.activeEl = st.hoverEl;

    const picked = vrUiFindInteractiveElement(st.activeEl);
    if (!picked) return;

    if (picked.kind === 'range') {
        st.draggingRange = picked.el;
        vrUiUpdateRange(picked.el, st.clientX, false);
        if (vrUI) {
            vrUI.needsCapture = true;
            vrUI.dirtyCounter = (vrUI.dirtyCounter || 0) + 1;
        }
    } else {
        st.clickTarget = picked.el;
    }
}

function onVrUiSelectEnd(event) {
    const controller = event.target;
    const st = controller?.userData?.vrUi;
    if (!st) return;

    if (st.draggingRange) {
        vrUiUpdateRange(st.draggingRange, st.clientX, true);
        st.draggingRange = null;
        if (vrUI) {
            vrUI.needsCapture = true;
            vrUI.forceCapture = true;
            vrUI.dirtyCounter = (vrUI.dirtyCounter || 0) + 1;
        }
    } else if (st.clickTarget) {
        try { st.clickTarget.click(); } catch (e) {}
        st.clickTarget = null;
        if (vrUI) {
            vrUI.needsCapture = true;
            vrUI.forceCapture = true;
            vrUI.dirtyCounter = (vrUI.dirtyCounter || 0) + 1;
        }
    }

    st.pressed = false;
    st.activeEl = null;
}

function buildPostProcessing() {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // --- Shaders Re-Init ---
    const LensingShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "uBHCount": blackHoleUniforms.uBHCount,
            "uBHPos": blackHoleUniforms.uBHPos,
            "uBHMass": blackHoleUniforms.uBHMass,
            "uBHRadius": blackHoleUniforms.uBHRadius,
            "uAspect": { value: window.innerWidth / Math.max(1, window.innerHeight) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform int uBHCount;
            uniform vec2 uBHPos[${MAX_BLACKHOLES}];
            uniform float uBHMass[${MAX_BLACKHOLES}];
            uniform float uBHRadius[${MAX_BLACKHOLES}];
            uniform float uAspect;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 totalOffset = vec2(0.0);
                float shadowMask = 0.0;
                for(int i = 0; i < ${MAX_BLACKHOLES}; i++) {
                    if (i >= uBHCount) break;
                    vec2 o = uBHPos[i] - uv;
                    o.x *= uAspect;
                    float dist = length(o);
                    float bhRad = max(uBHRadius[i], 0.00025);
                    float inner = max(bhRad * 0.6, 0.001);
                    float outer = max(bhRad * 14.0, 0.02);
                    float influence = smoothstep(outer, inner, dist);
                    float safeDist = max(dist, inner);
                    vec2 dir = o / safeDist;
                    dir.x /= uAspect;
                    float strength = (0.1 + uBHMass[i] * 0.02) * influence;
                    totalOffset += dir * (strength / (safeDist * safeDist + 0.0001));
                    float shadow = 1.0 - smoothstep(inner * 0.6, inner, dist);
                    shadowMask = max(shadowMask, shadow);
                }
                float offsetLen = length(totalOffset);
                if (offsetLen > 0.25) {
                    totalOffset *= 0.25 / offsetLen;
                }
                vec2 warped = clamp(uv + totalOffset, vec2(0.001), vec2(0.999));
                vec4 col = texture2D(tDiffuse, warped);
                col.rgb = mix(col.rgb, vec3(0.0), clamp(shadowMask, 0.0, 1.0));
                gl_FragColor = col;
            }
        `
    };
    lensingPass = new ShaderPass(LensingShader);
    if (lensingPass?.material?.uniforms) {
        lensingPass.material.uniforms.uBHCount = blackHoleUniforms.uBHCount;
        lensingPass.material.uniforms.uBHPos = blackHoleUniforms.uBHPos;
        lensingPass.material.uniforms.uBHMass = blackHoleUniforms.uBHMass;
        lensingPass.material.uniforms.uBHRadius = blackHoleUniforms.uBHRadius;
    }
    lensingPass.enabled = simState.useSchwarzschildLensing;
    composer.addPass(lensingPass);

    const CRTShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "curvature": { value: new THREE.Vector2(3.0, 3.0) },
            "uFlash": { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float uFlash;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 dc = abs(0.5 - uv) * 2.0;
                uv.x -= 0.5; uv.x *= 1.0 + (dc.y * (0.04)); uv.x += 0.5;
                uv.y -= 0.5; uv.y *= 1.0 + (dc.x * (0.04)); uv.y += 0.5;
                if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0)
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                else {
                    vec4 color = texture2D(tDiffuse, uv);
                    color.rgb += vec3(uFlash); // Add The Flash
                    gl_FragColor = color;
                }
            }
        `
    };
    crtPass = new ShaderPass(CRTShader);
    composer.addPass(crtPass);
}

function rebuildGraphicsPipeline(reason = "unknown") {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    if (!scene || !camera) return;

    // Preserve view/camera state
    const camPos = camera.position.clone();
    const camQuat = camera.quaternion.clone();
    const target = controls?.target?.clone?.() || new THREE.Vector3();
    const controlsEnabled = controls?.enabled ?? true;

    // Clean pointer state
    activePointers.clear();
    hadMultiTouch = false;
    isPointerDown = false;
    activePointerId = null;
    isDragging = false;

    try { controls?.dispose?.(); } catch (e) {}

    const oldCanvas = renderer?.domElement;
    if (oldCanvas) {
        try {
            const gl = oldCanvas.getContext('webgl2') || oldCanvas.getContext('webgl');
            const ext = gl && gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
        } catch (e) {}
        try { container.removeChild(oldCanvas); } catch (e) {}
    }

    try { renderer?.dispose?.(); } catch (e) {}

    try {
        renderer = new THREE.WebGLRenderer({
            antialias: false, powerPreference: "high-performance", logarithmicDepthBuffer: true
        });
        renderer.xr.enabled = true;
    } catch (e) {
        console.error("Graphics rebuild failed:", reason, e);
        return;
    }

    container.appendChild(renderer.domElement);

    // Recreate XR + UI hookups
    mountVrButton();
    attachXRSessionListeners();
    setupVrUiControllers();

    // Rebind controls to the new canvas
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.enableZoom = false;
    controls.enableZoom = false;
    controls.enabled = controlsEnabled;
    controls.target.copy(target);
    camera.position.copy(camPos);
    camera.quaternion.copy(camQuat);
    resetCamera(simState.viewLevel);
    controls.update();

    // Rebuild post + sizing
    buildPostProcessing();
    updatePixelation();
    try { renderer.compile(scene, camera); } catch (e) {}

    // Ensure loop + inputs are bound to the new canvas
    renderer.setAnimationLoop(animate);
    setupUIEvents();
}

function attachXRSessionListeners() {
    renderer.xr.addEventListener('sessionstart', () => {
        try { renderer.resetState(); } catch (e) {}
        if (camera && controls) {
            preXRCameraState = {
                pos: camera.position.clone(),
                quat: camera.quaternion.clone(),
                target: controls.target.clone(),
                fov: camera.fov,
                near: camera.near,
                far: camera.far,
                zoom: camera.zoom,
                controlsEnabled: controls.enabled,
                controlsAutoRotate: controls.autoRotate
            };
            // Avoid OrbitControls mutating the camera while XR owns it.
            controls.enabled = false;
            controls.autoRotate = false;
        } else {
            preXRCameraState = null;
        }
        try {
            if (!vrUI?.anchor || !vrUI?.mesh) setupVrUi();
            else setupVrUiControllers();
            vrUiSetVisible(true);
            vrUiCapture();
            vrUiUpdatePoseAndRay(performance.now());
        } catch (e) {
            console.warn('VR UI init failed:', e);
        }
        clock.getDelta(); // prevent a huge delta on first XR frame
    });

    renderer.xr.addEventListener('sessionend', () => {
        try { vrUiSetVisible(false); } catch (e) {}
        const rendererAtEnd = renderer;
        try {
            renderer.setRenderTarget(null);
            renderer.resetState();
        } catch (e) {}

        try { composer?.reset?.(); } catch (e) {}

        // Restore camera/controls state that WebXR overwrote.
        if (preXRCameraState && camera && controls) {
            camera.position.copy(preXRCameraState.pos);
            camera.quaternion.copy(preXRCameraState.quat);
            camera.fov = preXRCameraState.fov;
            camera.near = preXRCameraState.near;
            camera.far = preXRCameraState.far;
            camera.zoom = preXRCameraState.zoom;
            camera.updateProjectionMatrix();
            camera.updateMatrixWorld(true);

            controls.target.copy(preXRCameraState.target);
            controls.enabled = preXRCameraState.controlsEnabled;
            controls.autoRotate = preXRCameraState.controlsAutoRotate;
            controls.update();
        }
        preXRCameraState = null;

        xrForceDirectFrames = 3;
        try {
            renderer.clear(true, true, true);
            renderer.render(scene, camera);
        } catch (e) {}

        // If some devices/context combos leave us black, rebuild the renderer+composer on exit.
        setTimeout(() => {
            if (renderer !== rendererAtEnd) return;
            rebuildGraphicsPipeline('xr sessionend');
        }, 50);
    });
}

function init() {
    activePointers.clear();
    hadMultiTouch = false;
    isPointerDown = false;
    activePointerId = null;
    isDragging = false;

    // Determine pixelation scale - URL param overrides auto-detection
    if (INITIAL_PIXELATION !== null && INITIAL_PIXELATION >= 0) {
        simState.pixelationFactor = INITIAL_PIXELATION;
    } else {
        // Auto-detect based on screen width: 720p->1, 4k->5
        simState.pixelationFactor = Math.max(1, Math.floor(window.innerWidth / 750));
    }
    if (elRetroSlider) elRetroSlider.value = simState.pixelationFactor;
    if (elRetroVal) elRetroVal.innerText = simState.pixelationFactor;
    updateStarSizeMultiplier();

    if (pendingUiState?.qualityLevel && QUALITY_PRESETS[pendingUiState.qualityLevel]) {
        const q = QUALITY_PRESETS[pendingUiState.qualityLevel];
        simState.qualityLevel = pendingUiState.qualityLevel;
        CONFIG.starCount = q.starCount;
        CONFIG.clusterCount = q.clusterCount;
        CONFIG.densityRes = q.densityRes || CONFIG.densityRes;
    }

    // Hard Clean: Remove canvas to ensure a full WebGL context restart
    const container = document.getElementById('canvas-container');
    while (container.firstChild) {
        if (container.firstChild.tagName === 'CANVAS') {
            try {
                // Attempt to lose context to force GPU resource cleanup
                const gl = container.firstChild.getContext('webgl2') || container.firstChild.getContext('webgl');
                if(gl && gl.getExtension('WEBGL_lose_context')) gl.getExtension('WEBGL_lose_context').loseContext();
            } catch(e) {}
        }
        container.removeChild(container.firstChild);
    }
    
    // Dispose old renderer if exists
    if (renderer) { renderer.dispose(); renderer = null; }

    // Re-initialize Renderer
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2', { antialias: false, powerPreference: "high-performance" });
        const rendererOptions = { antialias: false, powerPreference: "high-performance", logarithmicDepthBuffer: true };
        if (gl) {
            renderer = new THREE.WebGLRenderer({ ...rendererOptions, canvas, context: gl });
            console.log('[Universes] WebGL2 active (volume renderer enabled).');
        } else {
            renderer = new THREE.WebGLRenderer(rendererOptions);
            console.warn('[Universes] WebGL2 unavailable, falling back to mote renderer.');
        }
        renderer.xr.enabled = true;
    } catch (e) {
        console.error("Critical: WebGL Renderer could not be initialized.", e);
        return;
    }

    container.appendChild(renderer.domElement);
    
    // VR Support
    mountVrButton();
    attachXRSessionListeners();
    
    // Core Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, GALAXY_FOG_DENSITY);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1e30);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    buildPostProcessing();

    updatePixelation();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Re-create Groups
    localSystem = new THREE.Group();
    localSystem.visible = false;
    scene.add(localSystem);
    
    smbhGroup = new THREE.Group();
    scene.add(smbhGroup);

    galaxyCacheGroup = new THREE.Group();
    scene.add(galaxyCacheGroup);

    setupVrUi();
    elSlider.value = simState.timeScale;

    // Initial Generation
    void generateUniverse(CONFIG.seed);
    
    // STARTUP WITH BANG
    simState.universeSimTime = 0.0;
    simState.bigBangFlash = 1.0; 

    // Initial State Set
    resetCamera(0);
    applySceneFogForView(simState.viewLevel);
    elStatusPanel.style.display = 'none';
    elSimPanel.style.display = 'none';
    
    // Precompile to reduce stutter on first frame
    try { renderer.compile(scene, camera); } catch(e) {}
    
    // Start Loop
    renderer.setAnimationLoop(animate);
    
    // Listeners (Remove old to prevent duplicates, though init shouldn't be called repeatedly without cleanup)
    window.removeEventListener('resize', onWindowResize);
    window.addEventListener('resize', onWindowResize);
    
    setupUIEvents();
    if (pendingUiState) {
        applyUiState(pendingUiState);
        pendingUiState = null;
    }
}

function setupUIEvents() {
    if (onDocumentMouseMove) document.removeEventListener('mousemove', onDocumentMouseMove);
    onDocumentMouseMove = (e) => {
        if (elCursor) elCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        if (!isDragging && dragStartPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 5) isDragging = true;
    };
    document.addEventListener('mousemove', onDocumentMouseMove);

    if (onBodyMouseOver) document.body.removeEventListener('mouseover', onBodyMouseOver);
    onBodyMouseOver = (e) => {
        if (e.target.matches('button, input, .panel-close, label, a, .clickable')) {
            elCursor.classList.add('active'); elCursor.innerHTML = '&#8629;'; 
        } else {
            elCursor.classList.remove('active'); elCursor.innerHTML = '';
        }
    };
    document.body.addEventListener('mouseover', onBodyMouseOver);
    renderer.domElement.addEventListener('pointerdown', (e) => {
        activePointers.add(e.pointerId);
        hadMultiTouch = hadMultiTouch || activePointers.size > 1;
        isPointerDown = true;
        activePointerId = e.pointerId;
        isDragging = activePointers.size > 1;
        dragStartPos.set(e.clientX, e.clientY);
        if (!simState.inspectingTarget) simState.trackingTarget = null;
    });
    renderer.domElement.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;
        if (activePointerId !== null && e.pointerId !== activePointerId) return;
        if (!isDragging && dragStartPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 5) isDragging = true;
    });
    renderer.domElement.addEventListener('pointercancel', (e) => {
        activePointers.delete(e.pointerId);
        if (activePointerId === e.pointerId) activePointerId = null;
        if (activePointers.size === 0) {
            isPointerDown = false;
            activePointerId = null;
            hadMultiTouch = false;
        } else {
            isPointerDown = true;
            if (activePointerId === null) activePointerId = activePointers.values().next().value;
        }
    });
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    if (onWheelZoom) renderer.domElement.removeEventListener('wheel', onWheelZoom);
    onWheelZoom = (e) => {
        if (!camera || !controls) return;
        if (renderer?.xr?.isPresenting) return;
        if (e.deltaY === 0) return;
        e.preventDefault();
        const factor = e.deltaY > 0 ? 1.1 : 0.9;
        tmpZoomVec.copy(camera.position).sub(controls.target);
        if (tmpZoomVec.lengthSq() < 1e-12) tmpZoomVec.set(0, 0, 1);
        tmpZoomVec.multiplyScalar(factor);
        camera.position.copy(controls.target).add(tmpZoomVec);
        controls.update();
        updateCameraClipping();
    };
    renderer.domElement.addEventListener('wheel', onWheelZoom, { passive: false });

    // General purpose button binder that strips old listeners by cloning
    const bindBtn = (id, fn) => {
        const btn = document.getElementById(id);
        if(!btn) return;
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', fn);
        return newBtn;
    }

    bindBtn('reset-btn', () => void generateUniverse(Math.floor(Math.random() * 10000)));
    
    // --- BIG BANG: HARD RESET ---
    bindBtn('bang-btn', () => {
        pendingUiState = captureUiState();
        init();
    });
    
    elPauseBtn = bindBtn('pause-btn', () => {
        simState.isPaused = !simState.isPaused;
        elPauseBtn.textContent = simState.isPaused ? "RESUME SIM" : "PAUSE SIM";
        if(!simState.isPaused) clock.getDelta();
    });
    elBackBtn = bindBtn('back-btn', () => {
        if (simState.inspectingTarget) {
            simState.inspectingTarget = null; simState.inspectingTargetPreviousPos = null;
            if (simState.viewLevel === 2) positionCameraForSystemOverview(false);
            else controls.target.set(0,0,0);
            resetCamera(simState.viewLevel);
            elBackBtn.textContent = simState.viewLevel === 2 ? "BACK TO GALAXY" : "BACK TO UNIVERSE";
            return;
        }
        ejectView();
    });
    bindBtn('alert-dismiss', () => {
        elAlert.style.display = 'none'; if (simState.isTransitioning) completeTransition();
    });
    
    const panels = [elStatusPanel, elSimPanel, elConfigModal, elTargetPanel];
    const checkMobile = (active) => {
        if (window.innerWidth <= 768) panels.forEach(p => { if(p !== active) p.style.display = 'none'; });
    };

    // Toggle binder that also strips old listeners
    const bindToggle = (btnId, panelId) => {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (!btn || !panel) return;
        
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            const open = panel.style.display !== 'flex';
            if (open) checkMobile(panel);
            panel.style.display = open ? 'flex' : 'none';
        });
        return newBtn;
    };

    elStatusToggle = bindToggle('status-toggle-btn', 'stats-panel') || elStatusToggle;
    bindToggle('sim-toggle-btn', 'controls-panel');
    bindToggle('config-btn', 'config-modal');
    
    elStatusClose.onclick = () => elStatusPanel.style.display = 'none';
    elSimClose.onclick = () => elSimPanel.style.display = 'none';
    elConfigClose.onclick = () => elConfigModal.style.display = 'none';
    
    elTargetClose.onclick = () => {
        elTargetPanel.style.display = 'none';
        simState.selectedTarget = null;
        if(simState.isAutopilot) simState.autopilotPanelHidden = true;
    };

    // Location Button Logic (Toggle)
    const newLocBtn = bindBtn('loc-btn', () => {
        simState.autopilotPanelHidden = false;
        if (elTargetPanel.style.display === 'flex') { elTargetPanel.style.display = 'none'; return; }
        checkMobile(elTargetPanel);
        let d = null;
        if (simState.viewLevel === 0) {
            d = {
                designation: `UNIVERSE 0x${CONFIG.seed.toString(16).toUpperCase()}`,
                type: "COSMIC WEB",
                age: simState.universeSimTime.toFixed(2),
                mass: `${CONFIG.starCount.toLocaleString()} OBJECTS`,
                radius: `${(SCALES.UNIVERSE / UNITS.MLY).toFixed(1)} MLY`,
                lum: "N/A",
                composition: `SEED: 0x${CONFIG.seed.toString(16).toUpperCase()}\nOBJECTS: ${CONFIG.starCount.toLocaleString()}`
            };
        } else if (simState.viewLevel === 1) {
            d = simState.activeGalaxyData;
        } else if (simState.viewLevel === 2) {
            if (simState.inspectingTarget && isInspectableSystemBody(simState.inspectingTarget)) {
                const t = simState.inspectingTarget;
                d = getSystemBodyPanelData(t);
            } else d = simState.activeSystemData;
        }
        if (d) updateTargetPanel(d, true);
    });

    elWarpBtn.onclick = () => {
        if (simState.selectedTarget) {
            elTargetPanel.style.display = 'none';
            if (simState.selectedTarget.level === 0) startTransition(simState.selectedTarget.position, 1);
            else if (simState.selectedTarget.level === 1) {
                startTransition(simState.selectedTarget.position, 2);
            } else if (simState.selectedTarget.level === 2) {
                simState.inspectingTarget = simState.selectedTarget.object;
                simState.trackingTarget = null;
                simState.inspectingTargetPreviousPos = simState.inspectingTarget.position.clone();
                // LOCK CAMERA ON TARGET IMMEDIATELY
                focusCameraOnTarget(simState.inspectingTarget);
                elBackBtn.textContent = "BACK TO STAR SYSTEM";
            }
        }
    };

    document.querySelectorAll('.q-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const qKey = e.target.getAttribute('data-q');
            const q = QUALITY_PRESETS[qKey];
            if (q) {
                simState.qualityLevel = qKey;
                CONFIG.starCount = q.starCount;
                CONFIG.clusterCount = q.clusterCount;
                CONFIG.densityRes = q.densityRes || CONFIG.densityRes;
                pruneGalaxyCache();
                if (simState.viewLevel === 0) void generateUniverse(CONFIG.seed);
                else if (simState.viewLevel === 1) void generateDetailedGalaxy(simState.currentGalaxyType);
            }
        });
    });

    elRetroSlider.oninput = (e) => {
        simState.pixelationFactor = parseInt(e.target.value);
        elRetroVal.innerText = simState.pixelationFactor;
        updatePixelation();
    };
    if (elStarSizeSlider) {
        elStarSizeSlider.oninput = (e) => {
            simState.starSizeMultiplier = clampStarSizeMultiplier(parseFloat(e.target.value));
            updateStarSizeMultiplier();
        };
    }
    
    elCrtToggle.onchange = (e) => e.target.checked ? elCrtOverlay.classList.add('crt-effects') : elCrtOverlay.classList.remove('crt-effects');
    if (elLensToggle) {
        elLensToggle.checked = simState.useSchwarzschildLensing;
        elLensToggle.onchange = (e) => {
            simState.useSchwarzschildLensing = e.target.checked;
            if (lensingPass) lensingPass.enabled = simState.useSchwarzschildLensing;
        };
    }
    
    elAutopilotToggle.onchange = (e) => {
        simState.isAutopilot = e.target.checked;
        if (simState.isAutopilot) { simState.autopilotNextAction = 0; simState.inspectingTarget = null; simState.autopilotPanelHidden = false; }
        if (simState.isAutopilot && simState.viewLevel === 1 && simState.autopilotPriorityTargets.length === 0) queueAutopilotGalaxyPriorityTargets();
    };

    if (elPathToggle) {
        simState.showTravelPath = elPathToggle.checked;
        elPathToggle.onchange = (e) => {
            simState.showTravelPath = e.target.checked;
            updateTravelPathLine();
        };
    }
    
    document.getElementById('timestep-slider').oninput = (e) => simState.timeScale = parseFloat(e.target.value);
}

function updatePixelation() {
    if (!renderer || !composer) return;
    if (camera) { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); }
    const f = simState.pixelationFactor === 0 ? 1 : (simState.pixelationFactor * 0.8) + 1;
    const w = Math.floor(window.innerWidth / f); const h = Math.floor(window.innerHeight / f);
    renderer.setSize(w, h, false); composer.setSize(w, h);
    renderer.domElement.style.width = '100vw'; renderer.domElement.style.height = '100vh';
    if (points) { points.material.uniforms.uPixelRatio.value = renderer.getPixelRatio(); points.material.uniforms.uScreenHeight.value = h; }
    if (localGalaxy) { localGalaxy.material.uniforms.uPixelRatio.value = renderer.getPixelRatio(); localGalaxy.material.uniforms.uScreenHeight.value = h; }
    if (galaxyCacheGroup?.children?.length) {
        galaxyCacheGroup.children.forEach((mesh) => {
            if (mesh?.material?.uniforms?.uPixelRatio) {
                mesh.material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
                mesh.material.uniforms.uScreenHeight.value = h;
            }
        });
    }
    if (lensingPass?.material?.uniforms?.uAspect) {
        lensingPass.material.uniforms.uAspect.value = w / Math.max(1, h);
    }
}

function onWindowResize() { updatePixelation(); }

function resetCamera(level) {
    if (level === 0) {
        controls.maxDistance = Infinity;
        controls.minDistance = 0;
        controls.zoomSpeed = 1.0;
        elBackBtn.disabled = true; elBackBtn.textContent = "RETURN TO ORBIT";
    }
    else if (level === 1) {
        controls.maxDistance = Infinity;
        controls.minDistance = 0;
        controls.zoomSpeed = 2.0;
        elBackBtn.disabled = false; elBackBtn.textContent = "BACK TO UNIVERSE";
    }
    else if (level === 2) {
        controls.maxDistance = Infinity;
        controls.minDistance = 0;
        controls.zoomSpeed = 3.0;
        elBackBtn.disabled = false; elBackBtn.textContent = "BACK TO GALAXY";
    }
    camera.updateProjectionMatrix();
}

function getTargetRadiusM(target) {
    if (!target) return 1;
    const radius = target.userData?.radiusM;
    if (Number.isFinite(radius) && radius > 0) return radius;
    const geom = target.geometry;
    if (geom) {
        if (!geom.boundingSphere) geom.computeBoundingSphere();
        const geomRadius = geom.boundingSphere?.radius;
        if (Number.isFinite(geomRadius) && geomRadius > 0) return geomRadius;
    }
    return 1;
}

function focusCameraOnTarget(target) {
    if (!camera || !controls || !target) return;
    const radius = getTargetRadiusM(target);
    const isPlanet = Boolean(target.userData?.type) && !target.userData?.isStar;
    const isStar = Boolean(target.userData?.isStar);
    const distanceMultiplier = isPlanet ? 10 : (isStar ? 200 : 6);
    const distance = Math.max(radius * distanceMultiplier, radius * 2);
    tmpFocusDir.copy(camera.position).sub(target.position);
    if (tmpFocusDir.lengthSq() < 1e-6) tmpFocusDir.set(0, 1, 1);
    tmpFocusDir.normalize();
    camera.position.copy(target.position).addScaledVector(tmpFocusDir, distance);
    controls.target.copy(target.position);
    controls.update();
}

function positionCameraForSystemOverview(randomize = false) {
    if (!camera || !controls) return;
    const dist = SCALES.SYSTEM * SYSTEM_OVERVIEW_CAMERA_DIST;
    const theta = randomize ? Math.random() * Math.PI * 2 : Math.PI * 0.72;
    const phi = randomize ? (Math.random() * Math.PI * 0.35 + 0.25) : 0.8;
    camera.position.set(
        dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.cos(phi),
        dist * Math.sin(phi) * Math.sin(theta)
    );
    controls.target.set(0, 0, 0);
    controls.update();
}

function isInspectableSystemBody(obj) {
    if (!obj?.userData) return false;
    return Boolean(
        obj.userData.isStar ||
        obj.userData.type ||
        obj.userData.bodyType ||
        obj.userData.isAsteroid ||
        obj.userData.isComet
    );
}

function getSystemBodies() {
    if (!localSystem) return [];
    return localSystem.children.filter((obj) => isInspectableSystemBody(obj));
}

function getInspectableSystemBody(obj) {
    let current = obj;
    while (current && current !== localSystem && !isInspectableSystemBody(current)) {
        current = current.parent;
    }
    if (!current || current === localSystem) return null;
    return isInspectableSystemBody(current) ? current : null;
}

function clearSystemOverviewMarkers() {
    getSystemBodies().forEach((body) => {
        const marker = body.userData.systemOverviewMarker;
        if (!marker) return;
        disposeObjectRecursive(marker);
        body.remove(marker);
        body.userData.systemOverviewMarker = null;
    });
}

function buildSystemOverviewMarkers() {
    const markerTex = getSystemOverviewMarkerTexture();
    if (!markerTex) return;

    clearSystemOverviewMarkers();
    const bodies = getSystemBodies();
    bodies.forEach((body) => {
        const marker = new THREE.Group();
        const outer = new THREE.Sprite(new THREE.SpriteMaterial({
            map: markerTex,
            color: SYSTEM_OVERVIEW_MARKER_COLOR,
            opacity: 0.35,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false
        }));
        const inner = new THREE.Sprite(new THREE.SpriteMaterial({
            map: markerTex,
            color: SYSTEM_OVERVIEW_MARKER_COLOR,
            opacity: 0.95,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false
        }));
        outer.material.toneMapped = false;
        inner.material.toneMapped = false;
        outer.renderOrder = 10;
        inner.renderOrder = 11;
        marker.userData.outer = outer;
        marker.userData.inner = inner;
        marker.add(outer);
        marker.add(inner);
        marker.visible = false;
        body.add(marker);
        body.userData.systemOverviewMarker = marker;
    });
}

function updateSystemOverviewMarkers() {
    if (!camera) return;
    const bodies = getSystemBodies();
    if (!bodies.length) return;
    const show = simState.viewLevel === 2 && localSystem?.visible;

    bodies.forEach((body) => {
        const marker = body.userData.systemOverviewMarker;
        if (!marker) return;
        const isVisited = simState.inspectingTarget === body;
        marker.visible = show && !isVisited;
        if (!marker.visible) return;

        const d = camera.position.distanceTo(body.position);
        const radius = Number.isFinite(body.userData.radiusM) ? body.userData.radiusM : EARTH_RADIUS_M;
        const size = THREE.MathUtils.clamp((d * 0.003) + (radius * 10), radius * 8, SCALES.SYSTEM * 0.12);
        const outer = marker.userData.outer;
        const inner = marker.userData.inner;
        if (outer) outer.scale.setScalar(size * 1.3);
        if (inner) inner.scale.setScalar(size);
    });
}

function updateCameraClipping() {
    if (!camera || !controls) return;
    if (renderer?.xr?.isPresenting) return;
    // With logarithmic depth buffer, we can use a fixed small near plane
    // and a massive far plane without precision issues
    const near = 0.1; // Fixed near plane - log depth handles the precision
    const far = SCALES.UNIVERSE * 10; // Fixed far plane - encompasses entire universe

    if (camera.near !== near || camera.far !== far) {
        camera.near = near;
        camera.far = far;
        camera.updateProjectionMatrix();
    }
}

function applySceneFogForView(level = simState.viewLevel) {
    if (!scene) return;
    const enableFog = level !== 2;
    if (enableFog) {
        if (!scene.fog || !scene.fog.isFogExp2) {
            scene.fog = new THREE.FogExp2(0x000000, GALAXY_FOG_DENSITY);
        } else {
            scene.fog.color.set(0x000000);
            scene.fog.density = GALAXY_FOG_DENSITY;
        }
    } else if (scene.fog) {
        scene.fog = null;
    }
    markMaterialsForUpdate(scene);
}

function applyFloatingOrigin() {
    if (!camera || !controls) return;
    if (renderer?.xr?.isPresenting || simState.isTransitioning) return;
    const threshold = simState.viewLevel === 2
        ? SCALES.SYSTEM * 0.25
        : (simState.viewLevel === 1 ? SCALES.GALAXY * 0.1 : SCALES.GALAXY * 1.5);
    if (camera.position.length() < threshold) return;
    const shift = camera.position.clone();

    camera.position.sub(shift);
    controls.target.sub(shift);
    if (simState.transitionTarget) simState.transitionTarget.sub(shift);
    if (simState.selectedTarget?.position) simState.selectedTarget.position.sub(shift);
    if (simState.inspectingTargetPreviousPos) simState.inspectingTargetPreviousPos.sub(shift);
    simState.worldOffset.add(shift);

    const shiftNode = (node) => { if (node?.position) node.position.sub(shift); };
    shiftNode(points);
    shiftNode(volumeGroup);
    shiftNode(localGalaxy);
    shiftNode(localSystem);
    shiftNode(smbhGroup);
    shiftNode(nebulaSystem);
    shiftNode(nebulaNursery);
    shiftNode(supernovaSystem);
    shiftNode(galaxyCacheGroup);
    shiftTravelPath(shift);
    controls.update();
}

function resetSimulation() {
    simState.galaxySimTime = 0; simState.isPaused = false;
    simState.isTransitioning = false; simState.viewLevel = 0; simState.worldOffset.set(0,0,0);
    simState.selectedTarget = null; simState.activeGalaxyData = null; simState.activeSystemData = null;
    simState.autopilotPriorityTargets = [];
    simState.lastGalaxyVisitTime = 0; simState.visitedSystemsCount = 0; simState.planetTourIndex = 0;
    simState.trackingTarget = null; simState.inspectingTarget = null; simState.inspectingTargetPreviousPos = null;
    simState.bigBangFlash = 0; // Reset flash by default
    
    physicsBodies = []; passiveBodies = []; activeCMEs = [];
    activeBlackHoles = []; blackHoleUniforms.uBHCount.value = 0;
    elLocBtn.style.display = 'block';
    if(points) points.position.set(0,0,0);
    if (volumeGroup) {
        volumeGroup.visible = true;
        // Reset each sub-volume to its original scale
        const baseScale = volumeGroup.userData.baseScale || 1;
        const subScale = baseScale / 3;
        volumeMeshes.forEach(mesh => mesh.scale.setScalar(subScale));
    }
    if(localGalaxy) localGalaxy.visible = false;
    if(localSystem) localSystem.visible = false;
    if(smbhGroup) smbhGroup.clear();
    clearTravelPath();
    if (simState.showTravelPath) {
        travelPathPoints.push(simState.worldOffset.clone());
    }
    galaxyCache.forEach((mesh) => {
        if (!mesh) return;
        galaxyCacheGroup?.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
    });
    galaxyCache.length = 0;
    if (galaxyCacheGroup) galaxyCacheGroup.position.set(0, 0, 0);
    if(supernovaSystem) { scene.remove(supernovaSystem); supernovaSystem = null; }
    if (nebulaSystem) {
        scene.remove(nebulaSystem);
        nebulaSystem.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        nebulaSystem = null;
    }
    disposeNebulaNursery();
    nebulaStars.forEach((star) => {
        if (!star) return;
        localSystem?.remove(star);
        if (star.geometry) star.geometry.dispose();
        if (star.material) star.material.dispose();
    });
    nebulaStars.length = 0;
    nebulaSpawnTimer = 0;
    applySceneFogForView(0);
    camera.position.set(0, SCALES.UNIVERSE * 0.1, SCALES.UNIVERSE * 0.2);
    controls.target.set(0,0,0); resetCamera(0); controls.autoRotate = true; controls.enabled = true;
    elPauseBtn.textContent = "PAUSE SIM"; elAlert.style.display = 'none'; elTargetPanel.style.display = 'none';
}

function ejectView() {
    if (simState.isTransitioning) return;
    elTargetPanel.style.display = 'none';
    if (simState.viewLevel === 2) {
        startTransition(new THREE.Vector3(0, SCALES.GALAXY * 0.5, 0), 1, true); 
    } else if (simState.viewLevel === 1) {
        startTransition(new THREE.Vector3(0, SCALES.UNIVERSE * 0.1, 0), 0, true);
    }
}

function startTransition(targetPoint, level, isBackingOut = false) {
    if (simState.isTransitioning) return;
    simState.isTransitioning = true;
    simState.transitionTarget.copy(targetPoint);
    simState.transitionData = (!isBackingOut && simState.selectedTarget) ? simState.selectedTarget.data : null;
    simState.nextLevel = level;
    simState.transitionProgress = 0;
    controls.enabled = false;
    elAlert.style.display = 'block';
    if (!simState.isAutopilot || isBackingOut) elTargetPanel.style.display = 'none'; 
    
    if (isBackingOut) {
         elAlertTitle.innerText = "LEAVING GRAVITY WELL"; elAlertMsg.innerText = "ACCELERATING TO ESCAPE VELOCITY...";
    } else {
        const id = Math.floor(Math.abs(targetPoint.x + targetPoint.y)).toString(16).toUpperCase();
        if (level === 1) { elAlertTitle.innerText = "APPROACHING GALAXY"; elAlertMsg.innerText = `SECTOR ${id} :: HYPERDRIVE ENGAGED`; }
        else { elAlertTitle.innerText = "APPROACHING SYSTEM"; elAlertMsg.innerText = `STAR ${id} :: ORBITAL INSERTION`; }
    }
}

function completeTransition() {
    const level = simState.nextLevel;
    const prevLevel = simState.viewLevel;
    const prevWorldOffset = simState.worldOffset.clone();
    simState.viewLevel = level;
    applySceneFogForView(level);
    simState.isTransitioning = false;
    controls.enabled = true;
    elAlert.style.display = 'none';
    const shift = new THREE.Vector3().copy(simState.transitionTarget);
    
    activeBlackHoles = []; blackHoleUniforms.uBHCount.value = 0;
    if (level < prevLevel && prevLevel === 1 && level === 0) {
        cacheActiveGalaxy();
    }
    if (level < prevLevel) {
        simState.inspectingTarget = null;
        simState.inspectingTargetPreviousPos = null;
        simState.trackingTarget = null;
    }
    // Keep cosmic web always visible (drawn first, occluded by closer objects)
    if (volumeGroup) volumeGroup.visible = true;
    
    if (level > prevLevel) {
        if (simState.transitionData) {
            if (level === 1) simState.activeGalaxyData = simState.transitionData;
            if (level === 2) simState.activeSystemData = simState.transitionData;
        } else if (simState.selectedTarget && simState.selectedTarget.data) {
            if (level === 1) simState.activeGalaxyData = simState.selectedTarget.data;
            if (level === 2) simState.activeSystemData = simState.selectedTarget.data;
        }
    } else {
        if (level === 1) simState.activeSystemData = null;
        if (level === 0) simState.activeGalaxyData = null;
    }
    if (level === 2 && level > prevLevel) {
        if (simState.selectedTarget?.data?.isNebula) {
            simState.activeNebula = simState.selectedTarget.data;
        } else {
            const nearby = findNearbyNebula(shift);
            simState.activeNebula = nearby?.userData?.data || null;
        }
    } else if (level !== 2) {
        simState.activeNebula = null;
    }
    
    elLocBtn.style.display = 'block';
    
    if (level > prevLevel) {
        camera.position.sub(shift); controls.target.sub(shift);
        if (points) points.position.sub(shift);
        if (volumeGroup) volumeGroup.position.sub(shift);
        if (level === 2 && localGalaxy) localGalaxy.position.sub(shift);
        if (level === 2 && smbhGroup) smbhGroup.position.sub(shift);
        if (level === 2 && nebulaSystem) nebulaSystem.position.sub(shift);
        shiftGalaxyCache(shift);
    }
    
    // Reset Planet Tour
    if (level === 2) simState.planetTourIndex = 0;

    if (level === 0) {
        if (localGalaxy) localGalaxy.visible = false; if (localSystem) localSystem.visible = false;
        if (smbhGroup) smbhGroup.visible = false; if (supernovaSystem) supernovaSystem.visible = false;
        if (nebulaSystem) nebulaSystem.visible = false;
        disposeNebulaNursery();
        nebulaStars.forEach((star) => {
            if (!star) return;
            localSystem?.remove(star);
            if (star.geometry) star.geometry.dispose();
            if (star.material) star.material.dispose();
        });
        nebulaStars.length = 0;
        nebulaSpawnTimer = 0;
        resetCamera(0); elAlertMsg.innerText = "INTERGALACTIC SPACE";
    } else if (level === 1) {
        if (localSystem) localSystem.visible = false;
        if (!localGalaxy || prevLevel === 0) {
            const age = simState.universeSimTime;
            simState.currentGalaxyType = (age < 3.0) ? 2 : (age > 10.0 ? 1 : 0);
            void generateDetailedGalaxy(simState.currentGalaxyType);
        }
        if (localGalaxy) { localGalaxy.visible = true; if (level > prevLevel) localGalaxy.position.set(0,0,0); }
        if (smbhGroup) { smbhGroup.visible = true; if(level > prevLevel) smbhGroup.position.set(0,0,0); }
        if (smbhGroup.children.length > 0) activeBlackHoles.push(smbhGroup.children[0]);
        if (nebulaSystem) { nebulaSystem.visible = true; if (level > prevLevel) nebulaSystem.position.set(0,0,0); }
        if (prevLevel === 0) queueAutopilotGalaxyPriorityTargets();
        if (level > prevLevel) {
            if (simState.isAutopilot) {
                 const dist = SCALES.GALAXY * 1.5; const theta = Math.random() * Math.PI * 2; const phi = Math.random() * Math.PI * 0.5 + 0.1;
                 camera.position.set(dist * Math.sin(phi) * Math.cos(theta), dist * Math.cos(phi), dist * Math.sin(phi) * Math.sin(theta));
                 simState.autopilotZooming = true;
            } else camera.position.set(0, SCALES.GALAXY * 0.8, SCALES.GALAXY * 0.4);
            controls.target.set(0,0,0);
        }
        resetCamera(1); elAlertMsg.innerText = "ARRIVED AT LOCAL GALAXY";
    } else if (level === 2) {
        if (smbhGroup) smbhGroup.visible = false;
        if (nebulaSystem) nebulaSystem.visible = false;
        generateStarSystem(shift);
        if (localSystem) { localSystem.visible = true; localSystem.position.set(0,0,0); }
        disposeNebulaNursery();
        if (simState.activeNebula?.isNursery) {
            const nurseryRadius = (0.5 + Math.random() * 2.0) * UNITS.LY;
            const seed = Math.floor(Math.random() * 100000);
            const tint = new THREE.Color(0.3, 0.75, 0.9);
            const chunkCount = 14 + Math.floor(Math.random() * 8);
            nebulaNursery = buildNebulaCluster({
                seed,
                radius: nurseryRadius,
                tint,
                chunkCount
            });
            if (nebulaNursery) {
                nebulaNursery.userData.radius = nurseryRadius;
                nebulaNursery.userData.velocity = new THREE.Vector3();
                nebulaNursery.position.set(0, 0, 0);
                nebulaNursery.visible = true;
                scene.add(nebulaNursery);
            }
        }
        positionCameraForSystemOverview(false);
        if (simState.isAutopilot) simState.planetTourIndex = 0;
        simState.inspectingTarget = null;
        simState.inspectingTargetPreviousPos = null;
        resetCamera(2); elAlertMsg.innerText = "SYSTEM ORBIT STABLE";
    }
    
    if (simState.isAutopilot && level > 0 && !simState.autopilotPanelHidden) {
        elTargetPanel.style.display = 'flex';
        if (level === 1 && simState.activeGalaxyData) updateTargetPanel(simState.activeGalaxyData, true);
        if (level === 2 && simState.activeSystemData) updateTargetPanel(simState.activeSystemData, true);
    }
    if (level > prevLevel) simState.worldOffset.add(shift);
    if (level > prevLevel && (level === 1 || level === 2)) {
        if (simState.showTravelPath && travelPathPoints.length === 0) {
            travelPathPoints.push(prevWorldOffset);
        }
        recordTravelPoint(simState.worldOffset.clone());
    }
    if (galaxyCacheGroup) galaxyCacheGroup.visible = level === 0;
    updateStarSizeMultiplier();
    updateSmbhScaleForView();
}

function evolveStar(initialClass, formationTime, currentTime) {
    const age = currentTime - formationTime;
    if (age < 0.05) return { state: 'PROTO', age: age, classObj: initialClass };
    if (age < initialClass.lifespan) return { state: 'MAIN', age: age, classObj: initialClass };
    if (age < initialClass.lifespan * 1.1) return { state: 'GIANT', age: age, classObj: initialClass };
    let remnantType;
    if (initialClass.id === 'O' || initialClass.id === 'B') remnantType = (Math.random() > 0.5) ? 'BH' : 'N';
    else if (initialClass.id === 'A' || initialClass.id === 'F' || initialClass.id === 'G') remnantType = 'WD';
    else return { state: 'MAIN', age: age, classObj: initialClass };
    return { state: 'REMNANT', age: age, classObj: STAR_CLASSES.find(c => c.id === remnantType) };
}

function generateComposition(seed, isStar) {
    let s = seed; const rnd = () => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    let h, he, met;
    if (isStar) { h = 70 + rnd() * 10; he = 24 + rnd() * 4; met = 100 - (h + he); } 
    else { h = 74 + rnd() * 5; he = 23 + rnd() * 2; met = 100 - (h + he); }
    if (met < 0) met = 0;
    const trace = ['O','C','Ne','Fe', 'N', 'Si', 'Mg', 'S'][Math.floor(rnd()*8)];
    return `COMPOSITION:\nH: ${h.toFixed(2)}% | He: ${he.toFixed(2)}% | Met: ${met.toFixed(2)}%\nTrace: ${trace}`;
}

function getStarSystemInfo(seed) {
    let s = seed; const rnd = () => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    let initialClass = STAR_CLASSES[STAR_CLASSES.length - 2]; 
    let cumulative = 0; const typeRoll = rnd();
    for (let i = 0; i < STAR_CLASSES.length - 3; i++) {
        cumulative += STAR_CLASSES[i].prob;
        if (typeRoll < cumulative) { initialClass = STAR_CLASSES[i]; break; }
    }
    const evoData = evolveStar(initialClass, rnd() * simState.universeSimTime, simState.universeSimTime);
    const spectrum = []; for(let i=0; i<10; i++) spectrum.push({ pos: rnd() * 100, intensity: rnd() });
    return {
        designation: `HIP-${Math.floor(rnd()*100000)}`,
        typeObj: evoData.classObj, state: evoData.state, age: evoData.age.toFixed(3),
        mass: evoData.classObj.mass, radius: evoData.classObj.rad, lum: evoData.classObj.lum,
        spectrum: spectrum, composition: generateComposition(seed, true)
    };
}

function getSystemBodyPanelData(body) {
    if (!body) return null;
    const data = body.userData || {};
    const age = simState.universeSimTime.toFixed(2);
    const radiusM = Number.isFinite(data.radiusM) ? data.radiusM : getTargetRadiusM(body);
    const massKg = Number.isFinite(data.massKg) ? data.massKg : null;

    if (data.isStar) {
        const massSolar = Number.isFinite(data.massSolar)
            ? data.massSolar
            : (massKg ? (massKg / SOLAR_MASS_KG) : null);
        const radiusSolar = Number.isFinite(data.radiusSolar)
            ? data.radiusSolar
            : (radiusM / SOLAR_RADIUS_M);
        return {
            designation: data.designation || "PRIMARY STAR",
            type: data.bodyType || data.type || "STAR",
            age,
            mass: Number.isFinite(massSolar) ? massSolar.toFixed(3) : "VAR",
            radius: `${radiusSolar.toFixed(3)} R☉`,
            lum: data.luminosityText || "STELLAR",
            composition: data.composition || "ANALYZING..."
        };
    }

    const massSolar = Number.isFinite(massKg) ? (massKg / SOLAR_MASS_KG) : null;
    const radiusEarth = radiusM / EARTH_RADIUS_M;
    return {
        designation: data.designation || "UNIDENTIFIED BODY",
        type: data.bodyType || data.type || (data.isComet ? "COMET" : (data.isAsteroid ? "ASTEROID" : "BODY")),
        age,
        mass: Number.isFinite(massSolar) ? massSolar.toFixed(6) : "VAR",
        radius: `${radiusEarth.toFixed(2)} R⊕`,
        lum: data.lum || "REFLECTIVE",
        composition: data.composition || "ANALYZING..."
    };
}

function getGalaxyInfo(seed, age) {
    let s = seed; const rnd = () => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    let type = "SPIRAL GALAXY";
    if (age < 3.0) { if (rnd() > 0.3) type = "IRREGULAR GALAXY"; else if (rnd() > 0.5) type = "QUASAR (AGN)"; else type = "PROTO-GALAXY"; } 
    else if (age > 10.0) { if (rnd() > 0.4) type = "ELLIPTICAL GALAXY"; else type = "LENTICULAR GALAXY"; }
    const baseRadiusKly = SCALES.GALAXY / UNITS.KLY;
    const radiusKly = baseRadiusKly * (0.6 + rnd() * 0.8);
    return {
        designation: `NGC-${Math.floor(rnd()*5000)}`, type: type, age: age.toFixed(2),
        mass: (rnd() * 50 + 10).toFixed(1) + " Billion", radius: radiusKly.toFixed(1) + " kly",
        lum: "HIGH", spectrum: [], composition: generateComposition(seed, false)
    };
}

function updateTargetPanel(data, readOnly = false) {
    if (window.innerWidth <= 768) { [elStatusPanel, elSimPanel, elConfigModal].forEach(p => p.style.display = 'none'); }
    elTargetTitle.innerText = readOnly ? "CURRENT LOCATION" : "TARGET ANALYSIS";
    elTName.innerText = data.designation; elTAge.innerText = data.age + " Bn YR";
    if (data.typeObj) {
        let typeStr = `CLASS ${data.typeObj.id}`;
        if (data.state === 'PROTO') typeStr += " (PROTO-STAR)";
        else if (data.state === 'GIANT') typeStr += " (RED GIANT)";
        else if (data.state === 'REMNANT') typeStr += " (REMNANT)";
        elTType.innerText = typeStr;
        elTType.style.color = (data.typeObj.id === 'BH') ? '#0f0' : ('#' + data.typeObj.color.toString(16).padStart(6,'0'));
        elTMass.innerText = data.mass + " M☉"; elTRad.innerText = data.radius + " R☉"; elTLum.innerText = data.lum + " L☉";
    } else {
        elTType.innerText = data.type; elTType.style.color = "#0f0";
        elTMass.innerText = data.mass + " M☉"; elTRad.innerText = data.radius; elTLum.innerText = data.lum || "VAR";
    }
    elSpectrograph.innerHTML = '';
    let s = 0; for(let i=0; i<data.designation.length; i++) s += data.designation.charCodeAt(i);
    const rnd = () => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    const palette = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0088ff', '#ff00ff'];
    const numLines = 5 + Math.floor(rnd() * 8); 
    for(let i=0; i<numLines; i++) {
        const line = document.createElement('div'); line.className = 'spec-line';
        const pos = Math.floor(rnd() * 95 / 5) * 5; 
        line.style.left = pos + '%'; line.style.backgroundColor = palette[Math.floor((pos/100)*palette.length)];
        elSpectrograph.appendChild(line);
    }
    elTComposition.innerText = data.composition || "ANALYZING...";
    if (readOnly) { document.getElementById('warp-btn').style.display = 'none'; } 
    else { 
        document.getElementById('warp-btn').style.display = 'block'; 
        if (data.isNebula && simState.viewLevel === 1) {
            document.getElementById('warp-btn').innerText = data.isNursery ? "ENTER NURSERY" : "INSPECT NEBULA";
        } else {
            document.getElementById('warp-btn').innerText = (simState.viewLevel === 2) ? "INSPECT ORBIT" : "INITIATE HYPERDRIVE";
        }
    }
    if (simState.isAutopilot && simState.autopilotPanelHidden) elTargetPanel.style.display = 'none';
    else elTargetPanel.style.display = 'flex';
}

function createBlackHole(radius, x, y, z) {
    const ehGeom = new THREE.SphereGeometry(radius, 64, 64);
    const ehMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    ehMat.colorWrite = false;
    ehMat.depthWrite = false;
    ehMat.depthTest = false;
    ehMat.transparent = true;
    ehMat.opacity = 0;
    const blackHole = new THREE.Mesh(ehGeom, ehMat);
    blackHole.position.set(x,y,z);
    blackHole.userData.isBlackHole = true;
    blackHole.userData.ehRadius = radius;

    const diskGeom = new THREE.RingGeometry(radius * 1.5, radius * 8.0, 128);
    const diskMat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uEHRadius: { value: radius },
            uInnerRadius: { value: radius * 1.5 },
            uOuterRadius: { value: radius * 8.0 }
        },
        side: THREE.DoubleSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
        vertexShader: `
            varying vec3 vWorldPos;
            varying vec3 vBhPos;
            void main() {
                vec4 world = modelMatrix * vec4(position, 1.0);
                vWorldPos = world.xyz;
                vBhPos = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
                gl_Position = projectionMatrix * viewMatrix * world;
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uEHRadius;
            uniform float uInnerRadius;
            uniform float uOuterRadius;
            varying vec3 vWorldPos;
            varying vec3 vBhPos;
            ${NOISE_GLSL}
            void main() {
                vec3 rel = vWorldPos - vBhPos;
                float r = length(rel.xz);
                float rNorm = max(r / uEHRadius, 1.001);
                float diskT = smoothstep(uInnerRadius, uOuterRadius, r);

                float angle = atan(rel.z, rel.x);
                float flow = uTime * (2.2 / sqrt(rNorm));

                float density = 0.6;
                density += 0.25 * snoise(vec3(rel.xz * (0.08 / uEHRadius), uTime * 0.35));
                density += 0.15 * snoise(vec3(rel.xz * (0.22 / uEHRadius), uTime * 1.1));
                density = clamp(density, 0.0, 1.2);

                float spiral = 0.5 + 0.5 * sin(angle * 3.0 + rNorm * 0.9 - flow * 2.0);
                float intensity = (0.25 + 0.75 * spiral) * density;

                vec3 viewDir = normalize(vWorldPos - cameraPosition);
                vec3 radial = normalize(vec3(rel.x, 0.0, rel.z));
                vec3 tangential = normalize(vec3(-radial.z, 0.0, radial.x));

                // Relativistic-ish Doppler shift (from referenced article): √[(1-v)/(1+v)]
                float speed = clamp(0.65 / sqrt(rNorm), 0.0, 0.92);
                float velocity_dot = dot(viewDir, tangential) * speed;
                float dopplerShift = sqrt(max((1.0 - velocity_dot) / (1.0 + velocity_dot), 0.0));

                // Gravitational redshift (Schwarzschild-ish): √[(1-Rs/r_emit)/(1-Rs/r_obs)]
                float rCam = max(length(cameraPosition - vBhPos) / uEHRadius, 1.001);
                float Rs = 1.0;
                float redshift = sqrt(max((1.0 - Rs / rNorm) / (1.0 - Rs / rCam), 0.0));

                vec3 hot = vec3(1.0, 0.95, 0.85);
                vec3 warm = vec3(1.0, 0.60, 0.25);
                vec3 diskColor = mix(hot, warm, diskT);
                diskColor *= dopplerShift * redshift;

                float ring = smoothstep(uInnerRadius, uInnerRadius + uEHRadius * 0.5, r)
                    * (1.0 - smoothstep(uOuterRadius - uEHRadius, uOuterRadius, r));

                float alpha = ring * intensity * 0.85;
                if (alpha < 0.02) discard;

                gl_FragColor = vec4(diskColor, alpha);
            }
        `
    });
    const disk = new THREE.Mesh(diskGeom, diskMat);
    disk.rotation.x = Math.PI / 2;
    blackHole.add(disk);
    return blackHole;
}

// --- GENERATION FUNCTIONS ---

function disposeUniverseVolume() {
    if (volumeGroup) {
        scene.remove(volumeGroup);
        volumeGroup = null;
    }
    for (const mesh of volumeMeshes) {
        if (mesh.geometry) mesh.geometry.dispose();
    }
    for (const mat of volumeMaterials) {
        if (mat) mat.dispose();
    }
    if (volumeTexture) volumeTexture.dispose();
    volumeMeshes = [];
    volumeMaterials = [];
    volumeTexture = null;
}

function supportsVolumeRendering() {
    if (!renderer) return false;
    const gl = renderer.getContext?.();
    return Boolean(renderer.capabilities?.isWebGL2 || (gl && typeof gl.texImage3D === 'function'));
}

function buildUniverseVolume({ density, resolution, scale }) {
    if (!supportsVolumeRendering()) return false;
    if (!density || !resolution) return false;

    disposeUniverseVolume();

    const texture = new THREE.Data3DTexture(density, resolution, resolution, resolution);
    texture.format = THREE.RedFormat;
    texture.type = THREE.UnsignedByteType;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.wrapR = THREE.ClampToEdgeWrapping;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;
    volumeTexture = texture;

    // Create a group to hold all 27 sub-volumes
    volumeGroup = new THREE.Group();
    volumeGroup.userData.baseScale = scale * 2;
    scene.add(volumeGroup);

    const geom = new THREE.BoxGeometry(1, 1, 1);
    const subScale = volumeGroup.userData.baseScale / 3; // Each sub-volume is 1/3 the size
    const texScale = 1.0 / 3.0; // Each sub-volume samples 1/3 of texture in each dimension

    // Create 3x3x3 grid of sub-volumes
    for (let iz = 0; iz < 3; iz++) {
        for (let iy = 0; iy < 3; iy++) {
            for (let ix = 0; ix < 3; ix++) {
                // Texture offset for this sub-volume (0, 1/3, or 2/3)
                const texOffset = new THREE.Vector3(ix / 3, iy / 3, iz / 3);

                const material = new THREE.ShaderMaterial({
                    glslVersion: THREE.GLSL3,
                    uniforms: {
                        uDensity: { value: texture },
                        uCameraLocal: { value: new THREE.Vector3() },
                        uTexOffset: { value: texOffset },
                        uTexScale: { value: texScale },
                        uStepSize: { value: (1.0 / resolution) * 2.2 * 3 }, // Adjusted for smaller volume
                        uDensityScale: { value: 0.75 },
                        uTime: { value: 0.0 }
                    },
                    vertexShader: `
                        out vec3 vLocalPos;
                        void main() {
                            vLocalPos = position;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        precision highp float;
                        precision highp sampler3D;
                        uniform sampler3D uDensity;
                        uniform vec3 uCameraLocal;
                        uniform vec3 uTexOffset;
                        uniform float uTexScale;
                        uniform float uStepSize;
                        uniform float uDensityScale;
                        uniform float uTime;
                        in vec3 vLocalPos;
                        out vec4 fragColor;

                        vec2 intersectBox(vec3 rayOrigin, vec3 rayDir) {
                            vec3 boundsMin = vec3(-0.5);
                            vec3 boundsMax = vec3(0.5);
                            vec3 invDir = 1.0 / rayDir;
                            vec3 t0 = (boundsMin - rayOrigin) * invDir;
                            vec3 t1 = (boundsMax - rayOrigin) * invDir;
                            vec3 tmin = min(t0, t1);
                            vec3 tmax = max(t0, t1);
                            float tNear = max(max(tmin.x, tmin.y), tmin.z);
                            float tFar = min(min(tmax.x, tmax.y), tmax.z);
                            return vec2(tNear, tFar);
                        }

                        void main() {
                            vec3 rayOrigin = uCameraLocal;
                            // vLocalPos is on back face (exit point), compute proper ray direction
                            vec3 rayDir = normalize(vLocalPos - rayOrigin);

                            // Compute entry point - either front face intersection or camera if inside
                            vec2 hit = intersectBox(rayOrigin, rayDir);

                            // Skip invalid rays
                            if (hit.y < 0.0 || hit.y <= hit.x) discard;

                            float t = max(hit.x, 0.0);
                            float tEnd = hit.y;
                            vec3 color = vec3(0.0);
                            float alpha = 0.0;

                            for (int i = 0; i < 64; i++) {
                                if (t > tEnd || alpha > 0.97) break;
                                vec3 p = rayOrigin + rayDir * t;
                                // Map local [-0.5, 0.5] to this sub-volume's texture region
                                vec3 texPos = uTexOffset + (p + vec3(0.5)) * uTexScale;

                                if (any(lessThan(texPos, vec3(0.0))) || any(greaterThan(texPos, vec3(1.0)))) {
                                    t += uStepSize;
                                    continue;
                                }

                                float d = texture(uDensity, texPos).r;
                                d = pow(d, 0.9);
                                d = clamp(d * 1.15, 0.0, 1.0);
                                float a = d * uDensityScale;

                                vec3 tint = mix(vec3(0.45, 0.6, 1.0), vec3(1.0, 0.95, 0.8), d);
                                color += (1.0 - alpha) * a * tint;
                                alpha += (1.0 - alpha) * a;
                                t += uStepSize;
                            }

                            if (alpha <= 0.01) discard;
                            fragColor = vec4(color, alpha);
                        }
                    `,
                    transparent: true,
                    depthWrite: false,
                    depthTest: true,
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide // Only render back faces - proper volume raymarching
                });

                volumeMaterials.push(material);

                const mesh = new THREE.Mesh(geom, material);
                mesh.frustumCulled = false;
                mesh.renderOrder = -100;
                mesh.scale.setScalar(subScale);

                // Position in grid: center is at (1,1,1), so offset by (ix-1, iy-1, iz-1) * subScale
                mesh.position.set(
                    (ix - 1) * subScale,
                    (iy - 1) * subScale,
                    (iz - 1) * subScale
                );

                const invMatrix = new THREE.Matrix4();
                const camLocal = new THREE.Vector3();
                mesh.onBeforeRender = (renderer, scene, cam) => {
                    mesh.updateMatrixWorld();
                    invMatrix.copy(mesh.matrixWorld).invert();
                    camLocal.copy(cam.position).applyMatrix4(invMatrix);
                    material.uniforms.uCameraLocal.value.copy(camLocal);
                    material.uniforms.uTime.value = simState.universeSimTime;
                };

                volumeMeshes.push(mesh);
                volumeGroup.add(mesh);

                // Add debug wireframe if enabled
                if (DEBUG_WEB) {
                    const edgesGeom = new THREE.EdgesGeometry(geom);
                    const lineMat = makeDebugLineMaterial();
                    const wireframe = new THREE.LineSegments(edgesGeom, lineMat);
                    wireframe.scale.copy(mesh.scale);
                    wireframe.position.copy(mesh.position);
                    wireframe.renderOrder = 1000; // Draw on top
                    volumeGroup.add(wireframe);
                }
            }
        }
    }

    return true;
}

function createNebulaDensity(size, seed) {
    const rand = seededRandom(seed);
    const data = new Uint8Array(size * size * size);
    const half = size * 0.5;
    const phase = rand() * Math.PI * 2;
    const blobCount = 10 + Math.floor(rand() * 8);
    const blobs = [];
    for (let i = 0; i < blobCount; i++) {
        blobs.push({
            x: (rand() * 2 - 1) * 0.55,
            y: (rand() * 2 - 1) * 0.55,
            z: (rand() * 2 - 1) * 0.55,
            radius: 0.18 + rand() * 0.35,
            strength: 0.5 + rand() * 0.9
        });
    }
    for (let z = 0; z < size; z++) {
        const nz = (z - half) / half;
        for (let y = 0; y < size; y++) {
            const ny = (y - half) / half;
            for (let x = 0; x < size; x++) {
                const nx = (x - half) / half;
                let density = 0;
                for (let i = 0; i < blobs.length; i++) {
                    const b = blobs[i];
                    const dx = nx - b.x;
                    const dy = ny - b.y;
                    const dz = nz - b.z;
                    const dist2 = dx * dx + dy * dy + dz * dz;
                    density += b.strength * Math.exp(-dist2 / (b.radius * b.radius));
                }
                const turb1 = Math.abs(Math.sin((nx * 3.1 + ny * 4.7 + nz * 2.9 + phase) * 4.2));
                const turb2 = Math.abs(Math.sin((nx * 7.3 + ny * 5.1 + nz * 6.5 + phase * 0.7) * 2.1));
                density = density * (0.65 + 0.35 * turb1) + 0.15 * turb2;
                const edge = Math.max(0, 1.0 - Math.max(Math.abs(nx), Math.abs(ny), Math.abs(nz)) * 1.2);
                density *= edge;
                const val = Math.min(1, density);
                const idx = x + y * size + z * size * size;
                data[idx] = Math.max(0, Math.min(255, Math.round(Math.pow(val, 0.85) * 255)));
            }
        }
    }
    return { density: data, resolution: size };
}

function buildNebulaVolume({ density, resolution, radius, tint }) {
    if (!supportsVolumeRendering()) return null;
    const texture = new THREE.Data3DTexture(density, resolution, resolution, resolution);
    texture.format = THREE.RedFormat;
    texture.type = THREE.UnsignedByteType;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.wrapR = THREE.ClampToEdgeWrapping;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    const tintColor = new THREE.Color(tint);
    const material = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        uniforms: {
            uDensity: { value: texture },
            uCameraLocal: { value: new THREE.Vector3() },
            uStepSize: { value: (1.0 / resolution) * 2.4 },
            uDensityScale: { value: 0.85 },
            uTime: { value: 0.0 },
            uTint: { value: tintColor }
        },
        vertexShader: `
            out vec3 vLocalPos;
            void main() {
                vLocalPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            precision highp sampler3D;
            uniform sampler3D uDensity;
            uniform vec3 uCameraLocal;
            uniform float uStepSize;
            uniform float uDensityScale;
            uniform float uTime;
            uniform vec3 uTint;
            in vec3 vLocalPos;
            out vec4 fragColor;
            ${NOISE_GLSL}

            vec2 intersectBox(vec3 rayOrigin, vec3 rayDir) {
                vec3 boundsMin = vec3(-0.5);
                vec3 boundsMax = vec3(0.5);
                vec3 invDir = 1.0 / (rayDir + vec3(1e-10));
                vec3 t0 = (boundsMin - rayOrigin) * invDir;
                vec3 t1 = (boundsMax - rayOrigin) * invDir;
                vec3 tmin = min(t0, t1);
                vec3 tmax = max(t0, t1);
                float tNear = max(max(tmin.x, tmin.y), tmin.z);
                float tFar = min(min(tmax.x, tmax.y), tmax.z);
                return vec2(tNear, tFar);
            }

            void main() {
                // Camera position in local space computed on CPU with full precision
                vec3 rayOrigin = uCameraLocal;
                vec3 rayDir = normalize(vLocalPos - rayOrigin);
                vec2 hit = intersectBox(rayOrigin, rayDir);
                if (hit.y <= hit.x) discard;

                float t = max(hit.x, 0.0);
                float tEnd = hit.y;
                vec3 color = vec3(0.0);
                float alpha = 0.0;

                for (int i = 0; i < 128; i++) {
                    if (t > tEnd || alpha > 0.97) break;
                    vec3 p = rayOrigin + rayDir * t;
                    vec3 texPos = p + vec3(0.5);
                    vec3 local = texPos - vec3(0.5);
                    float edge = smoothstep(0.55, 0.2, max(abs(local.x), max(abs(local.y), abs(local.z))));
                    float edgeNoise = 0.6 + 0.4 * snoise(local * 4.0 + vec3(uTime * 0.02));
                    edge *= clamp(edgeNoise, 0.0, 1.0);
                    vec3 drift = vec3(
                        snoise(vec3(texPos.yz * 3.0, uTime * 0.12)),
                        snoise(vec3(texPos.xz * 3.0, uTime * 0.09)),
                        snoise(vec3(texPos.xy * 3.0, uTime * 0.11))
                    ) * 0.035;
                    float filaments = abs(snoise(vec3(local * 6.0 + uTime * 0.05)));
                    float d = texture(uDensity, clamp(texPos + drift, 0.0, 1.0)).r;
                    d = pow(d, 0.7) * edge;
                    d *= (0.7 + 0.3 * filaments);
                    float a = d * uDensityScale;
                    vec3 tint = mix(uTint * 0.35, uTint, d);
                    color += (1.0 - alpha) * a * tint;
                    alpha += (1.0 - alpha) * a;
                    t += uStepSize;
                }

                if (alpha <= 0.01) discard;
                fragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide // Only render back faces - proper volume raymarching
    });

    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geom, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = -100; // Same as cosmic web
    mesh.scale.setScalar(radius * 2);
    const invMatrix = new THREE.Matrix4();
    const camLocal = new THREE.Vector3();
    mesh.onBeforeRender = (renderer, scene, cam) => {
        mesh.updateMatrixWorld();
        // Compute camera position in nebula's local space on CPU with full precision
        invMatrix.copy(mesh.matrixWorld).invert();
        camLocal.copy(cam.position).applyMatrix4(invMatrix);
        material.uniforms.uCameraLocal.value.copy(camLocal);
        material.uniforms.uTime.value = simState.universeSimTime;
    };
    return mesh;
}

function buildNebulaCluster({ seed, radius, tint, chunkCount }) {
    const rand = seededRandom(seed);
    const group = new THREE.Group();
    group.userData.isNebula = true;
    group.userData.radius = radius;
        const nebulaSpeedMPerSec = 2000 + rand() * 6000;
        group.userData.velocity = randomSphericalLocal(rand, nebulaSpeedMPerSec * PHYSICS_SECONDS_PER_UNIT);
    const nurseryOptions = [
        { type: 'STELLAR NURSERY', isNursery: true, composition: 'H, He, dust, ionized gas' },
        { type: 'MOLECULAR CLOUD', isNursery: true, composition: 'H2, CO, dust, cold gas' }
    ];
    const nonNurseryOptions = [
        { type: 'EMISSION NEBULA', isNursery: false, composition: 'Ionized gas, dust' },
        { type: 'REFLECTION NEBULA', isNursery: false, composition: 'Dust, neutral gas' },
        { type: 'PLANETARY NEBULA', isNursery: false, composition: 'Ionized shells, dust' },
        { type: 'SUPERNOVA REMNANT', isNursery: false, composition: 'Shock-heated gas, metals' },
        { type: 'DARK NEBULA', isNursery: false, composition: 'Dense dust, cold gas' }
    ];
    const isNursery = rand() < 0.35;
    const nebulaProfile = isNursery
        ? nurseryOptions[Math.floor(rand() * nurseryOptions.length)]
        : nonNurseryOptions[Math.floor(rand() * nonNurseryOptions.length)];
    group.userData.data = {
        designation: `NEBULA-${seed.toString(16).toUpperCase().slice(-4)}`,
        type: nebulaProfile.type,
        age: simState.universeSimTime.toFixed(2),
        mass: `${(50 + rand() * 120).toFixed(1)} Billion`,
        radius: `${(radius / 1000).toFixed(1)} kly`,
        lum: 'DIFFUSE',
        composition: nebulaProfile.composition,
        isNebula: true,
        isNursery: nebulaProfile.isNursery
    };

    const chunkTotal = chunkCount ?? (10 + Math.floor(rand() * 6));
    const axis = randomSphericalLocal(rand, 1.0);
    if (axis.lengthSq() < 0.001) axis.set(1, 0, 0);
    axis.normalize();
    const spineSpread = radius * (0.35 + rand() * 0.15);
    const cloudSpread = radius * (0.22 + rand() * 0.08);
    for (let i = 0; i < chunkTotal; i++) {
        const chunkSeed = seed + i * 37;
        const chunkRand = seededRandom(chunkSeed);
        const chunkRadius = radius * (0.08 + chunkRand() * 0.18);
        const spineOffset = axis.clone().multiplyScalar((chunkRand() * 2 - 1) * spineSpread);
        const jitter = randomSphericalLocal(chunkRand, cloudSpread * (0.5 + chunkRand() * 0.5));
        const offset = spineOffset.add(jitter);
        const density = createNebulaDensity(32, chunkSeed);
        let mesh = buildNebulaVolume({
            density: density.density,
            resolution: density.resolution,
            radius: chunkRadius,
            tint
        });
        if (!mesh) {
            const fallbackGeom = new THREE.SphereGeometry(chunkRadius, 16, 16);
            const fallbackMat = new THREE.MeshBasicMaterial({
                color: tint,
                transparent: true,
                opacity: 0.2,
                depthWrite: false
            });
            mesh = new THREE.Mesh(fallbackGeom, fallbackMat);
        }
        mesh.position.copy(offset);
        mesh.userData.nebulaChunk = true;
        group.add(mesh);
    }
    return group;
}

function disposeNebulaNursery() {
    if (!nebulaNursery) return;
    scene.remove(nebulaNursery);
    nebulaNursery.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
    });
    nebulaNursery = null;
}

function spawnNebulaStar() {
    if (!nebulaNursery || !localSystem) return;
    const radius = nebulaNursery.userData?.radius || SCALES.SYSTEM;
    const pos = randomSphericalLocal(Math.random, radius * 0.5);
    const starRadius = SOLAR_RADIUS_M * (0.2 + Math.random() * 0.6);
    const geom = new THREE.SphereGeometry(starRadius, 24, 24);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xffd6aa,
        emissive: 0xffd6aa,
        emissiveIntensity: 2.0
    });
    const star = new THREE.Mesh(geom, mat);
    star.position.copy(pos);
    star.userData.nebulaStar = true;
    star.userData.age = 0;
    star.userData.life = 12 + Math.random() * 8;
    const driftMPerSec = 5000 + Math.random() * 15000;
    star.userData.velocity = randomSphericalLocal(Math.random, driftMPerSec * PHYSICS_SECONDS_PER_UNIT);
    localSystem.add(star);
    nebulaStars.push(star);
}

function buildUniversePoints({ positions, colors, sizes }, options = {}) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uPixelRatio: { value: renderer.getPixelRatio() },
            uScreenHeight: { value: window.innerHeight },
            uStarSizeMultiplier: { value: simState.starSizeMultiplier },
            uOpacity: { value: 1.0 }
        },
        vertexShader: `
            uniform float uTime; uniform float uPixelRatio; uniform float uScreenHeight; uniform float uStarSizeMultiplier;
            attribute float size; varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_vertex>
            void main() {
                // Inflation Physics: Universe expands from singularity (0,0,0)
                // Curve: Rapid expansion that tapers off (Inflation theory style)
                float expansion = 1.0 - exp(-uTime * 2.0);
                
                vec3 finalPos = position * expansion;
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * uStarSizeMultiplier * uPixelRatio * (uScreenHeight / -mvPosition.z);
                #include <logdepthbuf_vertex>
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uOpacity;
            varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_fragment>
            void main() {
                #include <logdepthbuf_fragment>
                vec2 center = gl_PointCoord - vec2(0.5);
                if (length(center) > 0.5) discard;
                
                // Thermodynamics: Early universe stars are hotter (white/blue) and cool to their colors
                float heat = exp(-uTime * 0.5); 
                vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), heat);
                
                gl_FragColor = vec4(finalColor, uOpacity);
            }
        `,
        depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true
    });
    const opacity = Number.isFinite(options.opacity)
        ? Math.max(0, Math.min(1, options.opacity))
        : 1.0;
    const pickOnly = Boolean(options.pickOnly);
    material.uniforms.uOpacity.value = opacity;
    material.opacity = opacity;
    material.transparent = opacity < 1;
    material.colorWrite = !pickOnly;
    points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    points.renderOrder = 0; // Render after cosmic web (which is -100)
    scene.add(points);
}

async function generateUniverse(seed) {
    const token = ++universeGenerationToken;
    if (points) { scene.remove(points); points.geometry.dispose(); points.material.dispose(); points = null; }
    disposeUniverseVolume();
    if (localGalaxy) { scene.remove(localGalaxy); localGalaxy.geometry.dispose(); if(localGalaxy.material) localGalaxy.material.dispose(); localGalaxy = null; }
    while (localSystem.children.length > 0) {
        const c = localSystem.children[0];
        disposeObjectRecursive(c);
        localSystem.remove(c);
    }
    if (renderer) renderer.renderLists.dispose();

    resetSimulation();
    CONFIG.seed = seed;
    elSeed.textContent = "0x" + CONFIG.seed.toString(16).toUpperCase();
    elObjects.textContent = CONFIG.starCount.toLocaleString();

    const params = {
        seed,
        starCount: CONFIG.starCount,
        clusterCount: CONFIG.clusterCount,
        scale: SCALES.UNIVERSE,
        filamentScatter: CONFIG.filamentScatter
    };

    const requestedDensityRes = Math.max(24, Math.floor(CONFIG.densityRes || 96));
    const densityRes = Math.min(MAX_DENSITY_RES, requestedDensityRes);
    if (densityRes !== requestedDensityRes) {
        console.warn(`[Universes] densityRes clamped to ${densityRes} (requested ${requestedDensityRes}).`);
    }
    let volumeBuilt = false;
    if (supportsVolumeRendering()) {
        const densityParams = { ...params, resolution: densityRes };
        let density = await runComputeTask('generateUniverseDensity', densityParams);
        if (token !== universeGenerationToken) return;
        if (!density) density = generateUniverseDensity(densityParams);
        if (density?.density) {
            volumeBuilt = buildUniverseVolume({ ...density, scale: params.scale });
        }
    } else if (!volumeSupportChecked) {
        volumeSupportChecked = true;
        console.warn('[Universes] Volume rendering unavailable (WebGL2 required).');
    }

    const pickCount = Math.min(params.starCount, Math.max(50_000, Math.floor(params.starCount * 0.25)));
    const pickParams = { ...params, starCount: pickCount };
    let pickData = await runComputeTask('generateUniverseData', pickParams);
    if (token !== universeGenerationToken) return;
    if (!pickData) pickData = generateUniverseData(pickParams);
    buildUniversePoints(pickData, {
        opacity: volumeBuilt ? 0.0 : 1.0,
        pickOnly: volumeBuilt
    });

    if (!volumeBuilt) {
        points.material.uniforms.uOpacity.value = 1.0;
        points.material.opacity = 1.0;
        points.material.transparent = false;
        points.material.blending = THREE.AdditiveBlending;
    }
}

async function generateDetailedGalaxy(type = 0) {
    const token = ++galaxyGenerationToken;
    if(localGalaxy) { scene.remove(localGalaxy); localGalaxy.geometry.dispose(); }
    if(supernovaSystem) { scene.remove(supernovaSystem); supernovaSystem = null; }
    if(nebulaSystem) {
        scene.remove(nebulaSystem);
        nebulaSystem.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        nebulaSystem = null;
    }
    smbhGroup.clear();
    const pCount = CONFIG.starCount;
    const radius = SCALES.GALAXY;
    const params = { starCount: pCount, radius, type };
    let data = await runComputeTask('generateGalaxyData', params);
    if (token !== galaxyGenerationToken) return;
    if (!data) data = generateGalaxyData(params);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(data.sizes, 1));
    geom.setAttribute('aOrbit', new THREE.BufferAttribute(data.orbitParams, 3));

    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uPixelRatio: { value: renderer.getPixelRatio() },
            uTime: { value: 0 },
            uScreenHeight: { value: window.innerHeight },
            uStarSizeMultiplier: { value: simState.starSizeMultiplier },
            uPointFloorPx: { value: simState.viewLevel === 1 ? (simState.starSizeMultiplier * 0.5) : 0.0 }
        },
        vertexShader: `
            uniform float uPixelRatio; uniform float uTime; uniform float uScreenHeight; uniform float uStarSizeMultiplier; uniform float uPointFloorPx;
            attribute float size; attribute vec3 aOrbit; varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_vertex>
            void main() {
                vColor = color;
                float radius = aOrbit.x; float speed = aOrbit.y; float initAngle = aOrbit.z;
                vec3 newPos = position;
                if (radius > 0.0) {
                     float finalAngle = initAngle + uTime * speed * 0.005;
                     newPos.x = cos(finalAngle) * radius; newPos.z = sin(finalAngle) * radius;
                }
                vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                float pointSize = size * uStarSizeMultiplier * uPixelRatio * (uScreenHeight / max(-mvPosition.z, 1.0));
                gl_PointSize = max(uPointFloorPx, pointSize);
                #include <logdepthbuf_vertex>
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_fragment>
            void main() {
                #include <logdepthbuf_fragment>
                vec2 center = gl_PointCoord - vec2(0.5);
                float glow = 1.0 - smoothstep(0.0, 0.5, length(center));
                gl_FragColor = vec4(vColor, pow(glow, 2.0)); 
            }
        `,
        depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true
    });
    localGalaxy = new THREE.Points(geom, mat);
    localGalaxy.frustumCulled = false;
    localGalaxy.renderOrder = 0; // Render after cosmic web (which is -100)
    localGalaxy.visible = simState.viewLevel !== 0;
    scene.add(localGalaxy);

    if (type !== 1) {
        const nebulaCount = type === 2 ? 4 : 3;
        nebulaSystem = new THREE.Group();
        nebulaSystem.userData.nebulae = [];
        const baseSeed = Math.floor(Math.random() * 100000);
        for (let i = 0; i < nebulaCount; i++) {
            const seed = baseSeed + i * 97;
            const rand = seededRandom(seed);
            const nebulaRadius = (5 + rand() * 80) * UNITS.LY;
            const position = randomSphericalLocal(rand, radius * (0.35 + rand() * 0.45));
            const tint = new THREE.Color(0.2 + rand() * 0.25, 0.5 + rand() * 0.3, 0.7 + rand() * 0.2);
            const chunkCount = 12 + Math.floor(rand() * 8);
            const nebula = buildNebulaCluster({ seed, radius: nebulaRadius, tint, chunkCount });
            nebula.position.copy(position);
            nebulaSystem.add(nebula);
            nebulaSystem.userData.nebulae.push(nebula);
        }
        nebulaSystem.visible = simState.viewLevel === 1;
        scene.add(nebulaSystem);
    }
    const smbhInfo = getSmbhInfo();
    const bhRadiusM = smbhInfo.radiusM || schwarzschildRadiusM((smbhInfo.massSolar || 1_000_000) * SOLAR_MASS_KG);
    const bh = createBlackHole(bhRadiusM, 0, 0, 0);
    bh.userData.massSolar = smbhInfo.massSolar;
    smbhGroup.add(bh);
    smbhGroup.visible = simState.viewLevel !== 0;

    if (simState.isAutopilot && simState.viewLevel === 1) {
        queueAutopilotGalaxyPriorityTargets();
    }
}

function generateStarSystem(seedPos) {
    physicsBodies = []; passiveBodies = []; activeCMEs = [];
    activeBlackHoles = [];
    blackHoleUniforms.uBHCount.value = 0;
    while (localSystem.children.length > 0) {
        const c = localSystem.children[0];
        disposeObjectRecursive(c);
        localSystem.remove(c);
    }
    coronaMeshes.length = 0;
    let seedVal = Math.abs(seedPos.x + seedPos.y + seedPos.z); const rand = () => { const x = Math.sin(seedVal++) * 10000; return x - Math.floor(x); };
    const S = SCALES.SYSTEM;
    const targetClass = resolveStarClass(simState.activeSystemData?.typeObj || simState.selectedTarget?.data?.typeObj);
    const isTargetBH = targetClass.id === 'BH';
    const numStars = isTargetBH ? 1 : (rand() > 0.6 ? (rand() > 0.9 ? 3 : 2) : 1);
    const starBodies = [];
    for(let i=0; i<numStars; i++) {
        const sizeMod = (i===0) ? 1.0 : (0.5 + rand() * 0.5);
        const classObj = (i === 0) ? targetClass : STAR_CLASSES[Math.max(0, Math.floor(rand() * (STAR_CLASSES.length - 3)))];
        const starMassSolar = classObj.mass * sizeMod;
        const starRadiusSolar = classObj.rad * sizeMod;
        const starMassKg = starMassSolar * SOLAR_MASS_KG;
        const starDesignation = `STAR ${String.fromCharCode(65 + i)}`;
        const starType = classObj.id === 'BH' ? 'BLACK HOLE' : `STAR CLASS ${classObj.id}`;
        let starRadiusM = starRadiusSolar * SOLAR_RADIUS_M;
        const isBH = classObj.id === 'BH';
        let luminosityFactor = 0;
        if (isBH) {
            starRadiusM = Math.max(schwarzschildRadiusM(starMassKg), SOLAR_RADIUS_M * 0.001);
        }
        let mesh;
        if (isBH) {
             mesh = createBlackHole(starRadiusM, 0, 0, 0);
             activeBlackHoles.push(mesh);
             mesh.add(new THREE.PointLight(0xffaa44, 100000, S * 5));
             mesh.add(new THREE.AmbientLight(0x222233, 0.5));
        } else {
            luminosityFactor = estimateStellarLightFactor(starMassSolar);
            const geom = new THREE.SphereGeometry(starRadiusM, 64, 64);
            const mat = new THREE.MeshBasicMaterial({
                color: classObj.color,
                side: THREE.DoubleSide
            });
            mat.toneMapped = false;
            mat.fog = false;
            
            mat.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = { value: 0 };
                shader.vertexShader = `
                    uniform float uTime;
                    varying vec3 vStarDir;
                    ${NOISE_GLSL}
                ` + shader.vertexShader;
                shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\n
                    float disp = (snoise(vec3(position * 0.2 + uTime * 0.45)) + snoise(vec3(position * 0.55 - uTime * 0.25))) * 0.035 * ${starRadiusM.toFixed(2)};
                    transformed += normal * disp;
                    vStarDir = normalize(transformed);
                `);
                shader.fragmentShader = `
                    uniform float uTime;
                    varying vec3 vStarDir;
                    ${NOISE_GLSL}
                ` + shader.fragmentShader;
                shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
                    vec3 base = diffuseColor.rgb;
                    float band = snoise(vec3(vStarDir * 6.0 + vec3(0.0, uTime * 0.8, 0.0)));
                    float flare = snoise(vec3(vStarDir * 13.0 - vec3(uTime * 1.4, 0.0, 0.0)));
                    float pulse = 0.92 + 0.08 * sin(uTime * 1.4);
                    vec3 col = base * (1.0 + 0.45 * smoothstep(-0.25, 0.65, band)) * pulse;
                    col += base * 0.55 * pow(max(flare, 0.0), 2.0);
                    col = max(col, base * 0.85);
                    diffuseColor.rgb = col;
                `);
                mat.userData.shader = shader;
            };
            mesh = new THREE.Mesh(geom, mat);
            mesh.frustumCulled = false;
            // Corona
            const cGeom = new THREE.SphereGeometry(starRadiusM * 1.4, 32, 32);
            const cMat = new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: new THREE.Color(classObj.color) },
                    uBlend: { value: 1.0 }
                },
                transparent: true,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                vertexShader: `varying vec3 vNorm; void main() { vNorm = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
                fragmentShader: `uniform vec3 uColor; uniform float uBlend; varying vec3 vNorm; void main() { float i = pow(0.6 - dot(vNorm, vec3(0,0,1)), 4.0); gl_FragColor = vec4(uColor, i*0.6*uBlend); }`
            });
            cMat.toneMapped = false;
            const coronaMesh = new THREE.Mesh(cGeom, cMat);
            coronaMesh.userData.isCorona = true;
            coronaMesh.frustumCulled = false;
            coronaMeshes.push(coronaMesh);
            mesh.add(coronaMesh);

            const glowTex = getStarGlowTexture();
            if (glowTex) {
                const glow = new THREE.Sprite(new THREE.SpriteMaterial({
                    map: glowTex,
                    color: classObj.color,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                }));
                glow.material.toneMapped = false;
                glow.scale.setScalar(starRadiusM * 8.0);
                glow.frustumCulled = false;
                glow.renderOrder = 1;
                mesh.add(glow);
            }

            const lightStrength = SOLAR_POINT_LIGHT_INTENSITY * luminosityFactor * STAR_SYSTEM_LIGHT_BOOST;
            const starLight = new THREE.PointLight(classObj.color, lightStrength, 0, 2);
            starLight.userData.isStellarLight = true;
            starLight.position.set(0, 0, 0);
            mesh.add(starLight);
        }
        mesh.userData.massKg = starMassKg;
        mesh.userData.radiusM = starRadiusM;
        mesh.userData.massSolar = starMassSolar;
        mesh.userData.radiusSolar = starRadiusSolar;
        mesh.userData.designation = starDesignation;
        mesh.userData.type = starType;
        mesh.userData.bodyType = starType;
        mesh.userData.classId = classObj.id;
        mesh.userData.luminosityText = isBH ? "0" : String(classObj.lum);
        mesh.userData.composition = generateComposition(Math.floor(seedVal + (i * 971)), true);
        mesh.userData.isStar = true;
        mesh.renderOrder = 0; // Render after cosmic web (which is -100)
        localSystem.add(mesh);
        starBodies.push({ mesh, massKg: starMassKg });
    }

    if (starBodies.length === 1) {
        physicsBodies.push({ mesh: starBodies[0].mesh, massKg: starBodies[0].massKg, velocity: new THREE.Vector3(0,0,0), isStar: true });
    } else if (starBodies.length >= 2) {
        const mass1 = starBodies[0].massKg;
        const mass2 = starBodies[1].massKg;
        const totalMass = mass1 + mass2;
        const separation = UNITS.AU * (0.2 + rand() * 4.0);
        const r1 = separation * (mass2 / totalMass);
        const r2 = separation * (mass1 / totalMass);
        const omega = Math.sqrt(G_M * totalMass / Math.pow(separation, 3));
        const v1 = omega * r1;
        const v2 = omega * r2;
        starBodies[0].mesh.position.set(-r1, 0, 0);
        starBodies[1].mesh.position.set(r2, 0, 0);
        physicsBodies.push({ mesh: starBodies[0].mesh, massKg: mass1, velocity: new THREE.Vector3(0, 0, v1), isStar: true });
        physicsBodies.push({ mesh: starBodies[1].mesh, massKg: mass2, velocity: new THREE.Vector3(0, 0, -v2), isStar: true });
        for (let i = 2; i < starBodies.length; i++) {
            physicsBodies.push({ mesh: starBodies[i].mesh, massKg: starBodies[i].massKg, velocity: new THREE.Vector3(0,0,0), isStar: true });
        }
    }
    
    // Planets
    const pCount = Math.floor(rand() * 5) + 3; 
    for(let i=0; i<pCount; i++) {
        const orbitBase = (numStars > 1) ? 0.6 : 0.3;
        const orbitAu = orbitBase + (i * 0.4) + rand() * 0.2;
        const dist = orbitAu * UNITS.AU;
        const isGas = (i > 2 && rand() > 0.3);
        const rad = isGas
            ? JUPITER_RADIUS_M * (0.4 + rand() * 1.2)
            : EARTH_RADIUS_M * (0.4 + rand() * 2.5);
        const density = isGas ? 1300 : 5500; // kg/m^3
        const mass = (4/3) * Math.PI * Math.pow(rad, 3) * density;
        const isRocky = !isGas;
        const pGeom = new THREE.SphereGeometry(rad, 64, 64);
        const pMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(rand(), isGas ? 0.8 : 0.2, 0.5), roughness: 0.7 });
        
        pMat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = { value: 0 };
            shader.vertexShader = `varying vec3 vPos; ${NOISE_GLSL}` + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\n vPos = position; ${isRocky ? `float h = snoise(position*0.2)*0.5 + snoise(position*1.0)*0.2; transformed += normal*h*${rad.toFixed(2)}*0.1;` : ''}`);
            shader.fragmentShader = `uniform float uTime; varying vec3 vPos; ${NOISE_GLSL}` + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
                float n = snoise(vPos * ${isGas ? '2.0' : '5.0'} + vec3(0.0, ${isGas ? 'uTime*0.5' : '0.0'}, 0.0));
                ${isGas ? `
                    // Increase Gas Giant animation speed
                    float band = sin(vPos.y * 20.0 + n * 2.0 + uTime * 2.0);
                    vec3 c1 = diffuseColor.rgb; vec3 c2 = diffuseColor.rgb * 0.5;
                    diffuseColor.rgb = mix(c1, c2, band * 0.5 + 0.5) + n * 0.05;
                    // Lightning
                    float storm = snoise(vPos * 5.0 + uTime * 3.0);
                    if(storm > 0.8) diffuseColor.rgb += vec3(0.8, 0.9, 1.0) * (storm - 0.8) * 5.0;
                ` : `
                    float h = snoise(vPos * 0.2);
                    if (h > 0.3) diffuseColor.rgb *= 1.2; else if (h < -0.2) diffuseColor.rgb *= 0.8;
                    diffuseColor.rgb *= (0.8 + 0.4 * n);
                `}
            `);
            pMat.userData.shader = shader;
        };
        const planet = new THREE.Mesh(pGeom, pMat);
        const ang = rand() * Math.PI * 2; planet.position.set(Math.cos(ang)*dist, 0, Math.sin(ang)*dist);
        
        const aGeom = new THREE.SphereGeometry(rad * 1.1, 32, 32);
        const aMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 } }, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
            vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: `uniform float uTime; uniform float uIntensity; varying vec2 vUv;
            void main() {
                if (uIntensity <= 0.01) discard;
                float pole = smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
                float wave = sin(vUv.x * 20.0 + uTime * 5.0) * 0.5 + 0.5;
                gl_FragColor = vec4(0.2, 0.8, 0.4, uIntensity * pole * wave * 0.5);
            }`
        });
        const aurora = new THREE.Mesh(aGeom, aMat);
        planet.add(aurora); planet.userData = {
            designation: `PLANET ${String.fromCharCode(65+i)}`,
            type: isGas ? "GAS GIANT" : "ROCKY",
            bodyType: isGas ? "GAS GIANT" : "ROCKY PLANET",
            aurora: aMat,
            radiusM: rad,
            orbitRadiusM: dist,
            massKg: mass,
            composition: isGas ? "H/HE ATMOSPHERE" : "SILICATE/METALLIC CRUST",
            lum: "REFLECTIVE"
        };
        planet.renderOrder = 0; // Render after cosmic web (which is -100)

        localSystem.add(planet);
        const centralMass = physicsBodies.reduce((acc, body) => acc + (body.isStar ? body.massKg : 0), 0);
        const speed = Math.sqrt(G_M * centralMass / dist);
        physicsBodies.push({ mesh: planet, massKg: mass, velocity: new THREE.Vector3(-Math.sin(ang)*speed,0,Math.cos(ang)*speed), isStar: false });
    }

    buildSystemOverviewMarkers();
}

function spawnCME() {
    if (simState.viewLevel !== 2 || !localSystem.visible) return;
    const stars = physicsBodies.filter(b => b.isStar && !b.mesh?.userData?.isBlackHole);
    if (stars.length === 0) return;
    const star = stars[Math.floor(Math.random()*stars.length)].mesh;
    const starRadius = star.userData?.radiusM || SOLAR_RADIUS_M;
    const starColor = star.material?.color ? star.material.color.clone() : new THREE.Color(0xffaa44);
    
    // Volumetric CME using custom shader on sphere
    const cmeGeom = new THREE.SphereGeometry(starRadius * 0.2, 32, 32);
    const cmeMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uColor: { value: starColor } },
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
        vertexShader: `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uTime; uniform vec3 uColor; varying vec3 vPos; ${NOISE_GLSL}
        void main() {
            float n = snoise(vec3(vPos * 0.5 + uTime * 2.0));
            float alpha = smoothstep(0.0, 0.5, n);
            gl_FragColor = vec4(uColor, alpha * 0.8);
        }`
    });
    const cme = new THREE.Mesh(cmeGeom, cmeMat);

    const orbitNormal = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    if (orbitNormal.lengthSq() < 1e-4) orbitNormal.set(0, 1, 0);
    orbitNormal.normalize();
    const refAxis = Math.abs(orbitNormal.y) > 0.8 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const orbitU = new THREE.Vector3().crossVectors(orbitNormal, refAxis).normalize();
    const orbitV = new THREE.Vector3().crossVectors(orbitNormal, orbitU).normalize();
    const baseRadius = starRadius * (1.08 + Math.random() * 0.25);
    const radiusJitter = starRadius * (0.03 + Math.random() * 0.06);
    const angle = Math.random() * Math.PI * 2;
    const angularSpeed = (0.6 + Math.random() * 0.9) / Math.max(0.6, starRadius / SOLAR_RADIUS_M);
    cme.userData = {
        star,
        orbitU,
        orbitV,
        angle,
        angularSpeed,
        radiusBase: baseRadius,
        radiusJitter,
        phase: Math.random() * Math.PI * 2,
        age: 0,
        life: 6.0 + Math.random() * 4.0,
        mat: cmeMat
    };
    cme.position.copy(star.position).addScaledVector(orbitU, baseRadius);
    localSystem.add(cme);
    activeCMEs.push(cme);
}

function updatePhysics(dtSeconds) {
    const subSteps = 4;
    const dt = dtSeconds / subSteps;
    const softening = 1e9; // m
    for (let s = 0; s < subSteps; s++) {
        for (let i = 0; i < physicsBodies.length; i++) {
            const bi = physicsBodies[i];
            const acc = new THREE.Vector3();
            for (let j = 0; j < physicsBodies.length; j++) {
                if (i === j) continue;
                const bj = physicsBodies[j];
                const rVec = new THREE.Vector3().subVectors(bj.mesh.position, bi.mesh.position);
                const distSq = rVec.lengthSq() + softening * softening;
                const invDist = 1 / Math.sqrt(distSq);
                const invDist3 = invDist * invDist * invDist;
                acc.addScaledVector(rVec, G_M * (bj.massKg || 0) * invDist3);
            }
            bi.velocity.addScaledVector(acc, dt);
        }
        for (let i = 0; i < physicsBodies.length; i++) {
            const b = physicsBodies[i];
            b.mesh.position.addScaledVector(b.velocity, dt);
        }
    }
}

function animate() {
    const nowMs = performance.now();
    const delta = clock.getDelta(); const simDelta = Math.min(delta, 0.1) * simState.timeScale;
    
    // Update Big Bang Flash
    if (simState.bigBangFlash > 0) {
        simState.bigBangFlash -= delta * 0.5; // Flash fades over 2 seconds
        if(simState.bigBangFlash < 0) simState.bigBangFlash = 0;
        if(crtPass) crtPass.uniforms.uFlash.value = simState.bigBangFlash;
    }

    if (!simState.isPaused) {
        if (simState.viewLevel === 0) {
            simState.universeSimTime += simDelta;
            // Link Time to Star Shader
            if(points) points.material.uniforms.uTime.value = simState.universeSimTime;
            if (galaxyCacheGroup?.children?.length) {
                galaxyCacheGroup.children.forEach((mesh) => {
                    if (mesh?.material?.uniforms?.uTime) {
                        mesh.material.uniforms.uTime.value = simState.universeSimTime;
                    }
                });
            }
            if (volumeGroup && volumeMeshes.length > 0) {
                const expansion = Math.max(0.08, 1.0 - Math.exp(-simState.universeSimTime * 2.0));
                const baseScale = volumeGroup.userData.baseScale || 1;
                const subScale = (baseScale / 3) * expansion;
                // Scale each sub-volume and adjust positions for expansion
                for (let i = 0; i < volumeMeshes.length; i++) {
                    const mesh = volumeMeshes[i];
                    mesh.scale.setScalar(subScale);
                    // Recompute position based on grid index
                    const iz = Math.floor(i / 9);
                    const iy = Math.floor((i % 9) / 3);
                    const ix = i % 3;
                    mesh.position.set(
                        (ix - 1) * subScale,
                        (iy - 1) * subScale,
                        (iz - 1) * subScale
                    );
                }
            }
        }
        else if (simState.viewLevel === 1) {
            simState.galaxySimTime += simDelta;
            if (localGalaxy?.material?.uniforms?.uTime) {
                localGalaxy.material.uniforms.uTime.value = simState.galaxySimTime;
            }
            if (nebulaSystem?.visible) {
                nebulaSystem.children.forEach((group) => {
                    const vel = group?.userData?.velocity;
                    if (vel && group.position) {
                        const toCenter = group.position.clone().multiplyScalar(-1);
                        const dist = Math.max(1, toCenter.length());
                        toCenter.normalize();
                        vel.add(toCenter.multiplyScalar((SCALES.GALAXY / dist) * 0.0000004 * simDelta));
                        group.position.addScaledVector(vel, simDelta);
                    }
                    group?.traverse?.((child) => {
                        if (child?.material?.uniforms?.uTime) {
                            child.material.uniforms.uTime.value = simState.galaxySimTime;
                        }
                    });
                });
            }
        }
        else if (simState.viewLevel === 2) {
            updatePhysics(simDelta * PHYSICS_SECONDS_PER_UNIT);

            const coronaBlend = nebulaNursery ? 0.35 : 1.0;
            if (coronaMeshes.length) {
                coronaMeshes.forEach((mesh) => {
                    if (mesh?.material?.uniforms?.uBlend) {
                        mesh.material.uniforms.uBlend.value = coronaBlend;
                    }
                });
            }
            
            if (Math.random() < 0.005) spawnCME(); 
            for (let i = activeCMEs.length - 1; i >= 0; i--) {
                const cme = activeCMEs[i];
                cme.userData.age += simDelta;
                const star = cme.userData.star;
                if (!star || !star.parent) {
                    localSystem.remove(cme); activeCMEs.splice(i, 1);
                    continue;
                }
                cme.userData.angle += cme.userData.angularSpeed * simDelta;
                const radius = cme.userData.radiusBase + Math.sin(cme.userData.age * 2.0 + cme.userData.phase) * cme.userData.radiusJitter;
                tmpCmeVec.copy(cme.userData.orbitU).multiplyScalar(Math.cos(cme.userData.angle));
                tmpCmeVec.addScaledVector(cme.userData.orbitV, Math.sin(cme.userData.angle));
                cme.position.copy(star.position).addScaledVector(tmpCmeVec, radius);
                cme.scale.setScalar(0.9 + cme.userData.age * 0.35); 
                if (cme.userData.mat) cme.userData.mat.uniforms.uTime.value += delta;
                
                physicsBodies.forEach(p => {
                    if (!p.isStar && p.mesh.userData.aurora) {
                        const d = cme.position.distanceTo(p.mesh.position);
                        if (d < 30) p.mesh.userData.aurora.uniforms.uIntensity.value = 1.0;
                        else p.mesh.userData.aurora.uniforms.uIntensity.value *= 0.98;
                    }
                });

                if (cme.userData.age > cme.userData.life) {
                    localSystem.remove(cme); activeCMEs.splice(i, 1);
                }
            }

            physicsBodies.forEach(b => {
                if (!b.isStar) b.mesh.rotation.y += delta * 0.1;
                if (b.mesh.userData.aurora) b.mesh.userData.aurora.uniforms.uTime.value += delta;
                if (b.mesh.material && b.mesh.material.userData && b.mesh.material.userData.shader) {
                    b.mesh.material.userData.shader.uniforms.uTime.value += delta;
                }
            });

            if (nebulaNursery) {
                nebulaNursery.traverse?.((child) => {
                    if (child?.material?.uniforms?.uTime) {
                        child.material.uniforms.uTime.value = simState.universeSimTime;
                    }
                });
                nebulaSpawnTimer += simDelta;
                if (nebulaSpawnTimer > 4.0 + Math.random() * 3.0) {
                    nebulaSpawnTimer = 0;
                    if (Math.random() < 0.6) spawnNebulaStar();
                }
            }
            for (let i = nebulaStars.length - 1; i >= 0; i--) {
                const star = nebulaStars[i];
                star.userData.age += simDelta;
                star.position.addScaledVector(star.userData.velocity, simDelta);
                if (star.userData.age > star.userData.life) {
                    localSystem.remove(star);
                    if (star.geometry) star.geometry.dispose();
                    if (star.material) star.material.dispose();
                    nebulaStars.splice(i, 1);
                }
            }
        }
    }

    if (simState.viewLevel === 2) updateSystemOverviewMarkers();

    // Camera Lock during Inspection
    if (simState.inspectingTarget && controls) {
        if (simState.inspectingTargetPreviousPos) {
            tmpInspectDelta.copy(simState.inspectingTarget.position)
                .sub(simState.inspectingTargetPreviousPos);
            camera.position.add(tmpInspectDelta);
        }
        controls.target.copy(simState.inspectingTarget.position);
        if (simState.inspectingTargetPreviousPos) {
            simState.inspectingTargetPreviousPos.copy(simState.inspectingTarget.position);
        }
    }

    let bhCount = 0;
    activeBlackHoles.forEach(bh => {
        bh.children?.forEach(c => {
            if (c && c.material && c.material.uniforms && c.material.uniforms.uTime) {
                c.material.uniforms.uTime.value += delta;
            }
        });

        const pos = bh.getWorldPosition(tmpBhPos);
        tmpBhNdc.copy(pos).project(camera);
        if (tmpBhNdc.z > -1.0 && tmpBhNdc.z < 1.0 && Math.abs(tmpBhNdc.x) < 1.5 && Math.abs(tmpBhNdc.y) < 1.5) {
            blackHoleUniforms.uBHPos.value[bhCount].set(tmpBhNdc.x * 0.5 + 0.5, tmpBhNdc.y * 0.5 + 0.5);
            let screenRadius = 0.01;
            let ehRadius = bh.userData?.ehRadius ?? 0;
            if (ehRadius > 0) {
                bh.getWorldScale(tmpBhScale);
                ehRadius *= tmpBhScale.x;
                tmpBhRight.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
                tmpBhOffset.copy(pos).addScaledVector(tmpBhRight, ehRadius);
                tmpBhNdcOffset.copy(tmpBhOffset).project(camera);
                const dx = tmpBhNdcOffset.x - tmpBhNdc.x;
                const dy = tmpBhNdcOffset.y - tmpBhNdc.y;
                screenRadius = Math.max(Math.sqrt(dx * dx + dy * dy) * 0.5, 0.00025);
            }
            blackHoleUniforms.uBHRadius.value[bhCount] = screenRadius;
            blackHoleUniforms.uBHMass.value[bhCount] = Math.min(6.0, 2.5 + screenRadius * 90.0);
            bhCount++;
        }
    });
    blackHoleUniforms.uBHCount.value = bhCount;
    if (lensingPass) {
        const allowLensing = simState.viewLevel === 1;
        lensingPass.enabled = simState.useSchwarzschildLensing && allowLensing && bhCount > 0;
        if (lensingPass.material) lensingPass.material.uniformsNeedUpdate = true;
    }

    if (simState.isAutopilot && !simState.isTransitioning) {
        simState.autopilotTimer += delta;
        
        let canTour = true;
        // Gate: Wait for universe to be > 1.0 Billion Years old before picking first target
        if (simState.viewLevel === 0 && simState.universeSimTime < 1.0) canTour = false;

        if (canTour && simState.autopilotTimer > simState.autopilotNextAction) {
            simState.autopilotTimer = 0; simState.autopilotNextAction = 5.0;
            if (simState.viewLevel === 0) {
                if (points) {
                    const posAttr = points.geometry.attributes.position;
                    const count = posAttr?.count || 0;
                    if (count > 0) {
                        const randIdx = Math.floor(Math.random() * count);
                        const pos = getUniversePointWorldPosition(randIdx, tmpPickPos)?.clone();
                        if (pos) {
                            const data = getGalaxyInfo(CONFIG.seed + randIdx, simState.universeSimTime);
                            simState.selectedTarget = { level: 0, index: randIdx, position: pos, data: data };
                            updateTargetPanel(data, true);
                            startTransition(pos, 1);
                        }
                    }
                }
            } else if (simState.viewLevel === 1) {
                if (simState.autopilotPriorityTargets.length === 0 && smbhGroup?.children?.length > 0) {
                    queueAutopilotGalaxyPriorityTargets();
                }
                if (simState.autopilotPriorityTargets.length > 0) {
                    const next = simState.autopilotPriorityTargets.shift();
                    if (next && next.object && typeof next.object.getWorldPosition === 'function') {
                        next.object.getWorldPosition(tmpPickPos);
                        const pos = tmpPickPos.clone();
                        const data = next.data || getSmbhInfo();
                        simState.selectedTarget = { level: 1, object: next.object, position: pos, data };
                        updateTargetPanel(data, true);
                        startTransition(pos, 2);
                    }
                } else {
                    if (localGalaxy) {
                        const count = localGalaxy.geometry?.attributes?.position?.count || 0;
                        if (count > 0) {
                            let randIdx = -1;
                            let pos = null;
                            for (let attempt = 0; attempt < 24; attempt++) {
                                const idx = Math.floor(Math.random() * count);
                                const world = getGalaxyPointWorldPosition(idx, tmpPickPos);
                                if (!world) continue;
                                randIdx = idx;
                                pos = world.clone();
                                break;
                            }
                            if (randIdx >= 0 && pos) {
                                const data = getStarSystemInfo(randIdx);
                                simState.selectedTarget = { level: 1, index: randIdx, position: pos, data: data };
                                updateTargetPanel(data, true);
                                startTransition(pos, 2);
                            }
                        }
                    }
                }
            } else if (simState.viewLevel === 2) {
                const bodies = getSystemBodies();
                if (simState.planetTourIndex < bodies.length) {
                    const body = bodies[simState.planetTourIndex];
                    const data = getSystemBodyPanelData(body);
                    if (!data) return;
                    simState.selectedTarget = { level: 2, object: body, position: body.position.clone(), data };
                    updateTargetPanel(data, true);
                    simState.inspectingTarget = body;
                    simState.trackingTarget = null;
                    simState.inspectingTargetPreviousPos = body.position.clone();
                    focusCameraOnTarget(body);
                    if (elBackBtn) elBackBtn.textContent = "BACK TO STAR SYSTEM";
                    simState.planetTourIndex++;
                } else {
                    ejectView();
                }
            }
        }
    }

    if (simState.isTransitioning) {
        simState.transitionProgress += delta;
        let t = Math.min(simState.transitionProgress * 0.5, 1.0); t = t * t * (3.0 - 2.0 * t);
        camera.position.lerp(simState.transitionTarget, 0.05); controls.target.lerp(simState.transitionTarget, 0.05);
        if (simState.transitionProgress > 3.0) completeTransition();
    } else controls.update();

    applyFloatingOrigin();
    updateCameraClipping();

    // Robust VR UI visibility even on polyfills/devices that don't reliably emit sessionstart/sessionend.
    const xrPresenting = !!renderer?.xr?.isPresenting;
    if (xrPresenting) {
        if (!vrUI?.anchor || !vrUI?.mesh) setupVrUi();
        if (vrUI && !vrUI.visible) {
            setupVrUiControllers();
            vrUiSetVisible(true);
            vrUiCapture();
        }
    } else if (vrUI?.visible) {
        vrUiSetVisible(false);
    }

    vrUiUpdatePoseAndRay(nowMs);

    if (renderer && !renderer?.xr?.isPresenting) {
        try {
            renderer.setRenderTarget(null);
            renderer.setViewport(0, 0, renderer.domElement.width, renderer.domElement.height);
            renderer.setScissorTest(false);
        } catch (e) {}
    }

    if (renderer?.xr?.isPresenting || xrForceDirectFrames > 0) {
        renderer.render(scene, camera);
        if (!renderer?.xr?.isPresenting) xrForceDirectFrames = Math.max(0, xrForceDirectFrames - 1);
    } else {
        composer.render();
    }
    const simAge = (simState.viewLevel === 0 ? simState.universeSimTime : simState.galaxySimTime);
    if(elTime) elTime.innerText = simAge.toFixed(2) + " Bn YR";
    if(elStatusToggle) elStatusToggle.innerText = `[ STATUS ${simAge.toFixed(2)}Bn ]`;
    
    if (camera && (elCX || elCY || elCZ)) {
        tmpWorldPos.copy(camera.position).add(simState.worldOffset);
        if (elCX) elCX.innerText = formatCoord(tmpWorldPos.x);
        if (elCY) elCY.innerText = formatCoord(tmpWorldPos.y);
        if (elCZ) elCZ.innerText = formatCoord(tmpWorldPos.z);
    }
    elFPS.innerText = Math.round(1 / (delta || 0.001));
}

function onPointerUp(event) {
    activePointers.delete(event.pointerId);
    if (activePointers.size === 0) {
        isPointerDown = false;
        activePointerId = null;
    } else {
        isPointerDown = true;
        if (activePointerId === event.pointerId) activePointerId = activePointers.values().next().value;
    }

    if (hadMultiTouch) {
        if (activePointers.size === 0) hadMultiTouch = false;
        return;
    }
    if (isDragging) return;
    if (event.target.closest('button') || event.target.closest('.hud-panel')) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (simState.viewLevel === 0 && points) {
        const fallback = findUniversePickFallback(event.clientX, event.clientY, rect);
        if (fallback) {
            disableAutopilot();
            const data = getGalaxyInfo(CONFIG.seed + fallback.index, simState.universeSimTime);
            simState.selectedTarget = { level: 0, index: fallback.index, position: fallback.position, data };
            updateTargetPanel(data);
        } else {
            raycaster.params.Points.threshold = SCALES.GALAXY;
            const intersects = raycaster.intersectObject(points);
            if (intersects.length > 0) {
                disableAutopilot();
                const index = intersects[0].index;
                const data = getGalaxyInfo(CONFIG.seed + index, simState.universeSimTime);
                const worldPos = getUniversePointWorldPosition(index, tmpPickPos)?.clone() || intersects[0].point;
                simState.selectedTarget = { level: 0, index, position: worldPos, data };
                updateTargetPanel(data);
            }
        }
    } else if (simState.viewLevel === 1 && localGalaxy) {
        if (nebulaSystem && nebulaSystem.visible) {
            const nebulaHits = raycaster.intersectObjects(nebulaSystem.children, true);
            if (nebulaHits.length > 0) {
                const nebula = getNebulaRoot(nebulaHits[0].object);
                if (nebula) {
                    disableAutopilot();
                    const data = nebula.userData?.data || {};
                    simState.selectedTarget = { level: 1, object: nebula, position: nebula.position.clone(), data };
                    updateTargetPanel(data);
                    return;
                }
            }
        }
        const smbh = (smbhGroup && smbhGroup.visible && smbhGroup.children.length > 0) ? smbhGroup.children[0] : null;
        if (smbh) {
            const smbhHits = raycaster.intersectObject(smbh, true);
            if (smbhHits.length > 0) {
                disableAutopilot();
                const data = getSmbhInfo();
                smbh.getWorldPosition(tmpPickPos);
                simState.selectedTarget = { level: 1, object: smbh, position: tmpPickPos.clone(), data };
                updateTargetPanel(data);
                return;
            }
            tmpPickNdc.copy(smbh.getWorldPosition(tmpPickPos)).project(camera);
            if (tmpPickNdc.z < 1.0) {
                const px = rect.left + (tmpPickNdc.x * 0.5 + 0.5) * rect.width;
                const py = rect.top + (-tmpPickNdc.y * 0.5 + 0.5) * rect.height;
                const r = Math.max(24, Math.min(rect.width, rect.height) * 0.06);
                if (Math.hypot(event.clientX - px, event.clientY - py) <= r) {
                    disableAutopilot();
                    const data = getSmbhInfo();
                    simState.selectedTarget = { level: 1, object: smbh, position: tmpPickPos.clone(), data };
                    updateTargetPanel(data);
                    return;
                }
            }
        }

        const fallback = findGalaxyPickFallback(event.clientX, event.clientY, rect);
        if (fallback) {
            disableAutopilot();
            const data = getStarSystemInfo(fallback.index);
            simState.selectedTarget = { level: 1, index: fallback.index, position: fallback.position, data };
            updateTargetPanel(data);
        } else {
            const galaxyCamDist = camera.position.distanceTo(localGalaxy.position);
            raycaster.params.Points.threshold = Math.max(UNITS.AU * 100, galaxyCamDist * 0.005);
            const intersects = raycaster.intersectObject(localGalaxy);
            if (intersects.length > 0) {
                disableAutopilot();
                const index = intersects[0].index;
                const data = getStarSystemInfo(index);
                const worldPos = getGalaxyPointWorldPosition(index, tmpPickPos)?.clone() || intersects[0].point;
                simState.selectedTarget = { level: 1, index, position: worldPos, data };
                updateTargetPanel(data);
            }
        }
    } else if (simState.viewLevel === 2 && localSystem) {
        raycaster.params.Points.threshold = 1;
        const intersects = raycaster.intersectObjects(localSystem.children, true);
        for (let i = 0; i < intersects.length; i++) {
            const body = getInspectableSystemBody(intersects[i].object);
            if (!body) continue;
            disableAutopilot();
            const data = getSystemBodyPanelData(body);
            if (!data) return;
            simState.selectedTarget = { level: 2, object: body, position: body.position.clone(), data };
            updateTargetPanel(data);
            return;
        }
    }
}
