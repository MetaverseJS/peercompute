import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import html2canvas from 'html2canvas';
import { ComputeManager } from '@peercompute';
import { generateUniverseData, generateGalaxyData } from './compute/universeTasks.js';

// --- Configuration ---
const SCALES = {
    UNIVERSE: 100_000_000,
    GALAXY: 1_000_000,
    SYSTEM: 500,
    G: 50.0 
};

// Quality Presets
const QUALITY_PRESETS = {
    LOW: { starCount: 100_000, clusterCount: 200 },
    MED: { starCount: 250_000, clusterCount: 300 },
    HIGH: { starCount: 500_000, clusterCount: 400 },
    ULTRA: { starCount: 1_000_000, clusterCount: 500 }
};

const CONFIG = {
    starCount: QUALITY_PRESETS.HIGH.starCount, 
    clusterCount: QUALITY_PRESETS.HIGH.clusterCount,  
    filamentScatter: 0.04, 
    seed: 1337
};

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
let points, localGalaxy, localSystem, smbhGroup, supernovaSystem, nebulaSystem;
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
let preXRCameraState = null;
let vrUI = null;
const vrUiRaycaster = new THREE.Raycaster();
const vrTmpMat4 = new THREE.Matrix4();
const vrTmpVec3a = new THREE.Vector3();
const vrTmpVec3b = new THREE.Vector3();
const tmpWorldPos = new THREE.Vector3();
const tmpPickPos = new THREE.Vector3();
const tmpPickNdc = new THREE.Vector3();

function formatCoord(value) {
    const abs = Math.abs(value);
    if (abs >= 1e7) return value.toExponential(2);
    if (abs >= 1e4) return Math.round(value).toLocaleString();
    return value.toFixed(1);
}

function getSmbhInfo() {
    const baseSeed = (simState.activeGalaxyData?.designation || `SEED-${CONFIG.seed}`).split('')
        .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0);
    const isQuasar = /QUASAR|AGN/i.test(simState.activeGalaxyData?.type || '');
    const mass = 1_000_000 + (baseSeed % 9_000_000);
    const radius = (0.02 + (baseSeed % 400) / 10_000).toFixed(3); // purely cosmetic
    return {
        designation: simState.activeGalaxyData?.designation
            ? `${simState.activeGalaxyData.designation} ${isQuasar ? 'QUASAR' : 'CORE'}`
            : (isQuasar ? "QUASAR CORE" : "GALACTIC CORE"),
        typeObj: { id: 'BH', color: 0x00ff00 },
        state: 'REMNANT',
        age: simState.universeSimTime.toFixed(3),
        mass: mass.toLocaleString(),
        radius,
        lum: isQuasar ? "ACTIVE" : "0",
        spectrum: [],
        composition: isQuasar
            ? `AGN: ACTIVE (QUASAR)\nACCRETION: EXTREME\nMASS: ${mass.toLocaleString()} M☉`
            : `EVENT HORIZON: STABLE\nACCRETION: ACTIVE\nMASS: ${mass.toLocaleString()} M☉`
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

// Lensing Globals
let lensingPass, crtPass;
const MAX_BLACKHOLES = 4;
const blackHoleUniforms = {
    uBHCount: { value: 0 },
    uBHPos: { value: new Array(MAX_BLACKHOLES).fill(new THREE.Vector2(0,0)) },
    uBHMass: { value: new Array(MAX_BLACKHOLES).fill(0) }
};
let activeBlackHoles = []; 

// Physics & Events
let physicsBodies = []; 
let passiveBodies = []; 
let activeCMEs = []; 

let simState = {
    universeSimTime: 13.8, 
    galaxySimTime: 0,   
    isPaused: false,
    timeScale: 0.1, 
    viewLevel: 0, 
    isTransitioning: false,
    transitionTarget: new THREE.Vector3(),
    transitionData: null,
    transitionProgress: 0,
    nextLevel: 0,
    worldOffset: new THREE.Vector3(0,0,0),
    currentGalaxyType: 0,
    pixelationFactor: 1,
    selectedTarget: null, 
    activeGalaxyData: null,
    activeSystemData: null,
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
    bigBangFlash: 0
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
const elCrtToggle = document.getElementById('crt-toggle');
const elAutopilotToggle = document.getElementById('autopilot-toggle');
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
            "uBHMass": blackHoleUniforms.uBHMass
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
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 totalOffset = vec2(0.0);
                float halo = 0.0;
                float shadowMask = 0.0;
                for(int i = 0; i < ${MAX_BLACKHOLES}; i++) {
                    if (i >= uBHCount) break;
                    vec2 dir = uv - uBHPos[i];
                    float dist = length(dir) + 1e-6;
                    vec2 dirN = dir / dist;
                    float influence = smoothstep(0.65, 0.0, dist);
                    float strength = uBHMass[i] * 0.02;
                    float falloff = 1.0 / (dist * dist + 0.0009);
                    float distortion = strength * influence * falloff;
                    distortion = min(distortion, 0.45);
                    totalOffset -= dirN * distortion;

                    // Photon ring glow
                    float ringCenter = 0.03 + uBHMass[i] * 0.012;
                    float ringWidth = 0.006 + uBHMass[i] * 0.004;
                    float ring = exp(-pow((dist - ringCenter) / ringWidth, 2.0));
                    halo += ring * influence * 2.2;

                    // Event horizon shadow (lensing-only blackout)
                    float shadowRadius = 0.012 + uBHMass[i] * 0.008;
                    float shadowSoft = shadowRadius * 1.6;
                    float shadow = 1.0 - smoothstep(shadowRadius, shadowSoft, dist);
                    shadowMask = max(shadowMask, shadow);
                }
                vec2 warped = uv + totalOffset;
                vec3 col;
                col.r = texture2D(tDiffuse, warped + totalOffset * 0.12).r;
                col.g = texture2D(tDiffuse, warped).g;
                col.b = texture2D(tDiffuse, warped - totalOffset * 0.12).b;
                col += halo * vec3(1.0, 0.65, 0.3);
                col = mix(col, vec3(0.0), clamp(shadowMask, 0.0, 1.0));
                gl_FragColor = vec4(col, 1.0);
            }
        `
    };
    lensingPass = new ShaderPass(LensingShader);
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

    // Determine pixelation scale based on screen width
    // 720p (approx 1280w) -> 1
    // 4k (approx 3840w) -> 5
    // Formula: floor(width / 750) clamped at 1
    simState.pixelationFactor = Math.max(1, Math.floor(window.innerWidth / 750));
    if (elRetroSlider) elRetroSlider.value = simState.pixelationFactor;
    if (elRetroVal) elRetroVal.innerText = simState.pixelationFactor;

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
        renderer = new THREE.WebGLRenderer({ 
            antialias: false, powerPreference: "high-performance", logarithmicDepthBuffer: true 
        });
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
    scene.fog = new THREE.FogExp2(0x000000, 1e-9);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1e12);
    
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

    setupVrUi();
    elSlider.value = simState.timeScale;

    // Initial Generation
    void generateUniverse(CONFIG.seed);
    
    // STARTUP WITH BANG
    simState.universeSimTime = 0.0;
    simState.bigBangFlash = 1.0; 

    // Initial State Set
    resetCamera(0);
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
            controls.target.set(0,0,0); elBackBtn.textContent = "BACK TO GALAXY"; return;
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
                radius: `${(SCALES.UNIVERSE / 1_000_000).toFixed(1)} MLY`,
                lum: "N/A",
                composition: `SEED: 0x${CONFIG.seed.toString(16).toUpperCase()}\nOBJECTS: ${CONFIG.starCount.toLocaleString()}`
            };
        } else if (simState.viewLevel === 1) {
            d = simState.activeGalaxyData;
        } else if (simState.viewLevel === 2) {
            if (simState.inspectingTarget && simState.inspectingTarget.userData && simState.inspectingTarget.userData.type) {
                const t = simState.inspectingTarget;
                d = {
                    designation: t.userData.designation || "UNKNOWN",
                    type: t.userData.type || "UNKNOWN",
                    age: simState.universeSimTime.toFixed(2),
                    mass: "VAR",
                    radius: "VAR",
                    lum: "REFLECTIVE",
                    composition: t.userData.composition || "ANALYZING..."
                };
            } else d = simState.activeSystemData;
        }
        if (d) updateTargetPanel(d, true);
    });

    elWarpBtn.onclick = () => {
        if (simState.selectedTarget) {
            elTargetPanel.style.display = 'none';
            if (simState.selectedTarget.level === 0) startTransition(simState.selectedTarget.position, 1);
            else if (simState.selectedTarget.level === 1) startTransition(simState.selectedTarget.position, 2);
            else if (simState.selectedTarget.level === 2) {
                simState.inspectingTarget = simState.selectedTarget.object;
                simState.trackingTarget = null;
                simState.inspectingTargetPreviousPos = simState.inspectingTarget.position.clone();
                // LOCK CAMERA ON TARGET IMMEDIATELY
                controls.target.copy(simState.inspectingTarget.position);
                elBackBtn.textContent = "LEAVE ORBIT";
            }
        }
    };

    document.querySelectorAll('.q-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const q = QUALITY_PRESETS[e.target.getAttribute('data-q')];
            if (q) {
                CONFIG.starCount = q.starCount; CONFIG.clusterCount = q.clusterCount;
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
    
    elCrtToggle.onchange = (e) => e.target.checked ? elCrtOverlay.classList.add('crt-effects') : elCrtOverlay.classList.remove('crt-effects');
    
    elAutopilotToggle.onchange = (e) => {
        simState.isAutopilot = e.target.checked;
        if (simState.isAutopilot) { simState.autopilotNextAction = 0; simState.inspectingTarget = null; simState.autopilotPanelHidden = false; }
        if (simState.isAutopilot && simState.viewLevel === 1 && simState.autopilotPriorityTargets.length === 0) queueAutopilotGalaxyPriorityTargets();
    };
    
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
}

function onWindowResize() { updatePixelation(); }

function resetCamera(level) {
    if (level === 0) { controls.maxDistance = SCALES.UNIVERSE * 2; controls.minDistance = 1000; controls.zoomSpeed = 1.0; elBackBtn.disabled = true; elBackBtn.textContent = "RETURN TO ORBIT"; }
    else if (level === 1) { controls.maxDistance = SCALES.GALAXY * 3; controls.minDistance = 100; controls.zoomSpeed = 2.0; elBackBtn.disabled = false; elBackBtn.textContent = "BACK TO UNIVERSE"; }
    else if (level === 2) { controls.maxDistance = SCALES.SYSTEM * 4; controls.minDistance = 10; controls.zoomSpeed = 3.0; elBackBtn.disabled = false; elBackBtn.textContent = "BACK TO GALAXY"; }
    camera.updateProjectionMatrix();
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
    if(localGalaxy) localGalaxy.visible = false;
    if(localSystem) localSystem.visible = false;
    if(smbhGroup) smbhGroup.clear();
    if(supernovaSystem) { scene.remove(supernovaSystem); supernovaSystem = null; }
    if(nebulaSystem) { scene.remove(nebulaSystem); nebulaSystem = null; }
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
    simState.viewLevel = level;
    simState.isTransitioning = false;
    controls.enabled = true;
    elAlert.style.display = 'none';
    const shift = new THREE.Vector3().copy(simState.transitionTarget);
    
    activeBlackHoles = []; blackHoleUniforms.uBHCount.value = 0;
    
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
    
    elLocBtn.style.display = 'block';
    
    if (level > prevLevel) {
        camera.position.sub(shift); controls.target.sub(shift);
        if (points) points.position.sub(shift);
        if (level === 2 && localGalaxy) localGalaxy.position.sub(shift);
        if (level === 2 && smbhGroup) smbhGroup.position.sub(shift);
        if (level === 2 && nebulaSystem) nebulaSystem.position.sub(shift);
    }
    
    // Reset Planet Tour
    if (level === 2) simState.planetTourIndex = 0;

    if (level === 0) {
        if (localGalaxy) localGalaxy.visible = false; if (localSystem) localSystem.visible = false;
        if (smbhGroup) smbhGroup.visible = false; if (supernovaSystem) supernovaSystem.visible = false;
        if (nebulaSystem) nebulaSystem.visible = false;
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
        if(smbhGroup) smbhGroup.visible = false; if(nebulaSystem) nebulaSystem.visible = false;
        generateStarSystem(shift);
        if (localSystem) { localSystem.visible = true; localSystem.position.set(0,0,0); }
        if (simState.isAutopilot) {
             const dist = SCALES.SYSTEM * 1.5; const theta = Math.random() * Math.PI * 2; const phi = Math.random() * Math.PI * 0.5 + 0.1;
             camera.position.set(dist * Math.sin(phi) * Math.cos(theta), dist * Math.cos(phi), dist * Math.sin(phi) * Math.sin(theta));
             simState.autopilotZooming = true; simState.planetTourIndex = 0; 
        } else camera.position.set(0, SCALES.SYSTEM * 0.4, SCALES.SYSTEM * 0.8);
        controls.target.set(0,0,0);
        resetCamera(2); elAlertMsg.innerText = "SYSTEM ORBIT STABLE";
    }
    
    if (simState.isAutopilot && level > 0 && !simState.autopilotPanelHidden) {
        elTargetPanel.style.display = 'flex';
        if (level === 1 && simState.activeGalaxyData) updateTargetPanel(simState.activeGalaxyData, true);
        if (level === 2 && simState.activeSystemData) updateTargetPanel(simState.activeSystemData, true);
    }
    if (level > prevLevel) simState.worldOffset.add(shift);
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

function getGalaxyInfo(seed, age) {
    let s = seed; const rnd = () => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    let type = "SPIRAL GALAXY";
    if (age < 3.0) { if (rnd() > 0.3) type = "IRREGULAR GALAXY"; else if (rnd() > 0.5) type = "QUASAR (AGN)"; else type = "PROTO-GALAXY"; } 
    else if (age > 10.0) { if (rnd() > 0.4) type = "ELLIPTICAL GALAXY"; else type = "LENTICULAR GALAXY"; }
    return {
        designation: `NGC-${Math.floor(rnd()*5000)}`, type: type, age: age.toFixed(2),
        mass: (rnd() * 50 + 10).toFixed(1) + " Billion", radius: (rnd() * 50 + 20).toFixed(1) + " kly",
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
        elTMass.innerText = data.mass + " M☉"; elTRad.innerText = data.radius; elTLum.innerText = "VAR";
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
        document.getElementById('warp-btn').innerText = (simState.viewLevel === 2) ? "INSPECT ORBIT" : "INITIATE HYPERDRIVE";
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

function buildUniversePoints({ positions, colors, sizes }) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 }, uPixelRatio: { value: renderer.getPixelRatio() }, uScreenHeight: { value: window.innerHeight } },
        vertexShader: `
            uniform float uTime; uniform float uPixelRatio; uniform float uScreenHeight;
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
                gl_PointSize = size * uPixelRatio * (uScreenHeight / -mvPosition.z);
                #include <logdepthbuf_vertex>
            }
        `,
        fragmentShader: `
            uniform float uTime;
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
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,
        depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true
    });
    points = new THREE.Points(geometry, material); points.frustumCulled = false; scene.add(points);
}

async function generateUniverse(seed) {
    const token = ++universeGenerationToken;
    if (points) { scene.remove(points); points.geometry.dispose(); points.material.dispose(); points = null; }
    if (localGalaxy) { scene.remove(localGalaxy); localGalaxy.geometry.dispose(); if(localGalaxy.material) localGalaxy.material.dispose(); localGalaxy = null; }
    while(localSystem.children.length > 0){ const c = localSystem.children[0]; if(c.geometry) c.geometry.dispose(); if(c.material) c.material.dispose(); localSystem.remove(c); }
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

    let data = await runComputeTask('generateUniverseData', params);
    if (token !== universeGenerationToken) return;
    if (!data) data = generateUniverseData(params);
    buildUniversePoints(data);
}

async function generateDetailedGalaxy(type = 0) {
    const token = ++galaxyGenerationToken;
    if(localGalaxy) { scene.remove(localGalaxy); localGalaxy.geometry.dispose(); }
    if(supernovaSystem) { scene.remove(supernovaSystem); supernovaSystem = null; }
    if(nebulaSystem) { scene.remove(nebulaSystem); nebulaSystem = null; }
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
        uniforms: { uPixelRatio: { value: renderer.getPixelRatio() }, uTime: { value: 0 }, uScreenHeight: { value: window.innerHeight } },
        vertexShader: `
            uniform float uPixelRatio; uniform float uTime; uniform float uScreenHeight;
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
                gl_PointSize = size * uPixelRatio * (uScreenHeight / -mvPosition.z);
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
    localGalaxy.visible = simState.viewLevel !== 0;
    scene.add(localGalaxy);

    if (type !== 1) {
        const nebCount = (type === 2) ? 60 : 30;
        const nebGeom = new THREE.BufferGeometry(); const nebPos = new Float32Array(nebCount * 3); const nebCol = new Float32Array(nebCount * 3); const nebSize = new Float32Array(nebCount);
        for(let i=0; i<nebCount; i++) {
             const r = Math.random() * radius * 0.8; const angle = Math.random() * Math.PI * 2;
             nebPos[i*3] = r * Math.cos(angle); nebPos[i*3+1] = (Math.random()-0.5)*radius*0.2; nebPos[i*3+2] = r * Math.sin(angle);
             nebCol[i*3]=0.4; nebCol[i*3+1]=0.1; nebCol[i*3+2]=0.6; nebSize[i] = Math.random() * 800000 + 400000;
        }
        nebGeom.setAttribute('position', new THREE.BufferAttribute(nebPos, 3)); nebGeom.setAttribute('color', new THREE.BufferAttribute(nebCol, 3)); nebGeom.setAttribute('size', new THREE.BufferAttribute(nebSize, 1));
        const nebMat = new THREE.ShaderMaterial({
            uniforms: { uPixelRatio: { value: renderer.getPixelRatio() }, uScreenHeight: { value: window.innerHeight }, uTime: { value: 0 } },
            vertexShader: `
                uniform float uPixelRatio; uniform float uScreenHeight; attribute float size; varying vec3 vColor;
                #include <common>
                #include <logdepthbuf_pars_vertex>
                void main() {
                    vColor = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * uPixelRatio * (uScreenHeight / -mvPosition.z) * 0.05;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                varying vec3 vColor; uniform float uTime; ${NOISE_GLSL}
                #include <common>
                #include <logdepthbuf_pars_fragment>
                void main() {
                    #include <logdepthbuf_fragment>
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float n = snoise(vec3(center * 4.0, uTime * 0.2));
                    float alpha = (1.0 - smoothstep(0.0, 0.5, length(center))) * (0.5 + 0.5 * n);
                    if (alpha < 0.05) discard;
                    gl_FragColor = vec4(vColor, alpha * 0.3);
                }
            `,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true
        });
        nebulaSystem = new THREE.Points(nebGeom, nebMat);
        nebulaSystem.visible = simState.viewLevel === 1;
        scene.add(nebulaSystem);
    }
    const bh = createBlackHole(radius * 0.005, 0, 0, 0);
    smbhGroup.add(bh);
    smbhGroup.visible = simState.viewLevel === 1;
}

function generateStarSystem(seedPos) {
    physicsBodies = []; passiveBodies = []; activeCMEs = [];
    while(localSystem.children.length > 0){ const c = localSystem.children[0]; if(c.geometry) c.geometry.dispose(); if(c.material) c.material.dispose(); localSystem.remove(c); }
    let seedVal = Math.abs(seedPos.x + seedPos.y + seedPos.z); const rand = () => { const x = Math.sin(seedVal++) * 10000; return x - Math.floor(x); };
    const S = SCALES.SYSTEM; const G = SCALES.G; 
    let baseStarColor = 0xffaa00; let baseStarRad = S * 0.25; let isBH = false;
    if (simState.selectedTarget && simState.selectedTarget.data) {
         const d = simState.selectedTarget.data;
         if (d.typeObj) baseStarColor = d.typeObj.color;
         if (d.typeObj.id === 'BH') { baseStarRad = S * 0.1; isBH = true; }
    }
    const numStars = isBH ? 1 : (rand() > 0.6 ? (rand() > 0.9 ? 3 : 2) : 1);
    for(let i=0; i<numStars; i++) {
        const sizeMod = (i===0) ? 1.0 : (0.5 + rand() * 0.5); const rad = baseStarRad * sizeMod; const mass = 1000.0 * sizeMod; 
        let mesh;
        if (isBH) {
             mesh = createBlackHole(rad, 0, 0, 0);
             activeBlackHoles.push(mesh);
             mesh.add(new THREE.PointLight(0xffaa44, 100000, SCALES.SYSTEM * 5));
             mesh.add(new THREE.AmbientLight(0x222233, 0.5));
        } else {
            const geom = new THREE.SphereGeometry(rad, 64, 64);
            const mat = new THREE.MeshStandardMaterial({ color: baseStarColor, emissive: baseStarColor, emissiveIntensity: 2.0 });
            
            mat.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = { value: 0 };
                // Use a unique varying name to avoid collision with standard material's vNormal/vViewPosition
                shader.vertexShader = `
                    uniform float uTime; varying vec3 vCustomWorldPos; ${NOISE_GLSL}
                ` + shader.vertexShader;
                shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', `#include <worldpos_vertex>\n vCustomWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
                shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\n
                    float disp = (snoise(vec3(position * 0.2 + uTime * 0.5)) + snoise(vec3(position * 0.5 - uTime * 0.2))) * 0.05 * ${rad.toFixed(2)};
                    transformed += normal * disp;
                `);
                shader.fragmentShader = `uniform float uTime; varying vec3 vCustomWorldPos; ${NOISE_GLSL}` + shader.fragmentShader;
                shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
                    float n = snoise(vec3(vCustomWorldPos * 0.1 + uTime * 0.2));
                    float bright = snoise(vec3(vCustomWorldPos * 0.3 + uTime * 0.5));
                    vec3 base = diffuseColor.rgb;
                    vec3 final = mix(base, base*0.3, smoothstep(0.4, 0.8, n));
                    final = mix(final, base*3.0, smoothstep(0.5, 0.9, bright));
                    diffuseColor.rgb = final;
                `);
                mat.userData.shader = shader;
            };
            mesh = new THREE.Mesh(geom, mat);
            // Corona
            const cGeom = new THREE.SphereGeometry(rad * 1.4, 32, 32);
            const cMat = new THREE.ShaderMaterial({
                uniforms: { uColor: { value: new THREE.Color(baseStarColor) } }, transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending,
                vertexShader: `varying vec3 vNorm; void main() { vNorm = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
                fragmentShader: `uniform vec3 uColor; varying vec3 vNorm; void main() { float i = pow(0.6 - dot(vNorm, vec3(0,0,1)), 4.0); gl_FragColor = vec4(uColor, i*0.6); }`
            });
            mesh.add(new THREE.Mesh(cGeom, cMat));
            mesh.add(new THREE.PointLight(baseStarColor, 300000, SCALES.SYSTEM * 10, 2));
        }
        localSystem.add(mesh);
        if (numStars === 1) physicsBodies.push({ mesh: mesh, mass: mass, velocity: new THREE.Vector3(0,0,0), isStar: true });
        else {
             const dist = S * 0.4; mesh.position.set((i===0?1:-1)*dist, 0, 0); 
             const v = Math.sqrt(G*mass/(2*dist)); physicsBodies.push({ mesh: mesh, mass: mass, velocity: new THREE.Vector3(0,0,(i===0?1:-1)*v), isStar: true });
        }
    }
    
    // Planets
    const pCount = Math.floor(rand() * 5) + 3; 
    for(let i=0; i<pCount; i++) {
        const orbitBase = (numStars > 1) ? S * 0.8 : S * 0.3; const dist = orbitBase + (i * S * 0.2) + rand() * S * 0.1; 
        const rad = S * 0.01 + rand() * S * 0.02; const mass = rad * 10.0; 
        const isGas = (i > 2 && rand() > 0.3); const isRocky = !isGas;
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
        planet.add(aurora); planet.userData = { designation: `PLANET ${String.fromCharCode(65+i)}`, type: isGas?"GAS GIANT":"ROCKY", aurora: aMat };
        
        localSystem.add(planet);
        physicsBodies.push({ mesh: planet, mass: mass, velocity: new THREE.Vector3(-Math.sin(ang)*Math.sqrt(G*1000/dist),0,Math.cos(ang)*Math.sqrt(G*1000/dist)), isStar: false });
    }
}

function spawnCME() {
    if (simState.viewLevel !== 2 || !localSystem.visible) return;
    const stars = physicsBodies.filter(b => b.isStar && !b.mesh?.userData?.isBlackHole);
    if (stars.length === 0) return;
    const star = stars[Math.floor(Math.random()*stars.length)].mesh;
    
    // Volumetric CME using custom shader on sphere
    const cmeGeom = new THREE.SphereGeometry(5, 32, 32);
    const cmeMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xff4400) } },
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
    cme.position.copy(star.position);
    
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const dir = new THREE.Vector3(Math.sin(phi)*Math.cos(theta), Math.cos(phi), Math.sin(phi)*Math.sin(theta));
    
    cme.userData = { dir: dir, age: 0, life: 10.0, speed: 20.0, mat: cmeMat };
    localSystem.add(cme);
    activeCMEs.push(cme);
}

function updatePhysics(dt) {
    const subSteps = 2; const dtSub = dt/subSteps;
    for(let s=0; s<subSteps; s++) {
        for(let i=0; i<physicsBodies.length; i++) {
            const b = physicsBodies[i]; 
            b.mesh.position.add(b.velocity.clone().multiplyScalar(dtSub));
            if(!b.isStar) {
                const r = b.mesh.position.lengthSq();
                const f = b.mesh.position.clone().normalize().multiplyScalar(-SCALES.G * 1000 / r);
                b.velocity.add(f.multiplyScalar(dtSub));
            }
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
        }
        else if (simState.viewLevel === 1) simState.galaxySimTime += simDelta;
        else if (simState.viewLevel === 2) {
            updatePhysics(simDelta * 5.0);
            
            if (Math.random() < 0.005) spawnCME(); 
            for (let i = activeCMEs.length - 1; i >= 0; i--) {
                const cme = activeCMEs[i];
                cme.userData.age += simDelta;
                cme.position.add(cme.userData.dir.clone().multiplyScalar(cme.userData.speed * simDelta));
                cme.scale.setScalar(1.0 + cme.userData.age * 2.0); 
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
        }
    }

    // Camera Lock during Inspection
    if (simState.inspectingTarget && controls) {
        controls.target.copy(simState.inspectingTarget.position);
    }

    let bhCount = 0;
    activeBlackHoles.forEach(bh => {
        bh.children?.forEach(c => {
            if (c && c.material && c.material.uniforms && c.material.uniforms.uTime) {
                c.material.uniforms.uTime.value += delta;
            }
        });

        const pos = bh.getWorldPosition(new THREE.Vector3()); pos.project(camera);
        if (pos.z < 1.0 && Math.abs(pos.x) < 1.5 && Math.abs(pos.y) < 1.5) {
            blackHoleUniforms.uBHPos.value[bhCount].set(pos.x * 0.5 + 0.5, pos.y * 0.5 + 0.5);
            blackHoleUniforms.uBHMass.value[bhCount] = 3.5; bhCount++;
        }
    });
    blackHoleUniforms.uBHCount.value = bhCount;

    if (simState.isAutopilot && !simState.isTransitioning) {
        simState.autopilotTimer += delta;
        
        let canTour = true;
        // Gate: Wait for universe to be > 1.0 Billion Years old before picking first target
        if (simState.viewLevel === 0 && simState.universeSimTime < 1.0) canTour = false;

        if (canTour && simState.autopilotTimer > simState.autopilotNextAction) {
            simState.autopilotTimer = 0; simState.autopilotNextAction = 5.0;
            if (simState.viewLevel === 0) {
                const randIdx = Math.floor(Math.random() * CONFIG.starCount);
                if (points) {
                    const posAttr = points.geometry.attributes.position;
                    const pos = new THREE.Vector3(posAttr.getX(randIdx), posAttr.getY(randIdx), posAttr.getZ(randIdx));
                    const data = getGalaxyInfo(CONFIG.seed + randIdx, simState.universeSimTime);
                    simState.selectedTarget = { level: 0, index: randIdx, position: pos, data: data };
                    updateTargetPanel(data, true);
                    startTransition(pos, 1);
                }
            } else if (simState.viewLevel === 1) {
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
                    const randIdx = Math.floor(Math.random() * CONFIG.starCount);
                    if (localGalaxy) {
                        const posAttr = localGalaxy.geometry.attributes.position;
                        const pos = new THREE.Vector3(posAttr.getX(randIdx), posAttr.getY(randIdx), posAttr.getZ(randIdx));
                        const data = getStarSystemInfo(randIdx);
                        simState.selectedTarget = { level: 1, index: randIdx, position: pos, data: data };
                        updateTargetPanel(data, true);
                        startTransition(pos, 2);
                    }
                }
            } else if (simState.viewLevel === 2) {
                // Autopilot Planet Tour
                const planets = localSystem.children.filter(c => c.userData && c.userData.type); 
                if (simState.planetTourIndex < planets.length) {
                    const p = planets[simState.planetTourIndex];
                    const data = {
                        designation: p.userData.designation,
                        type: p.userData.type,
                        age: simState.universeSimTime.toFixed(2),
                        mass: "VAR", radius: "VAR", lum: "REFLECTIVE",
                        composition: "SILICATES/ICE"
                    };
                    simState.selectedTarget = { level: 2, object: p, position: p.position, data: data };
                    updateTargetPanel(data, true);
                    controls.target.copy(p.position); // Look at planet
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
        raycaster.params.Points.threshold = 500000; const intersects = raycaster.intersectObject(points);
        if (intersects.length > 0) {
            disableAutopilot();
            const index = intersects[0].index; const data = getGalaxyInfo(CONFIG.seed + index, simState.universeSimTime);
            simState.selectedTarget = { level: 0, index: index, position: intersects[0].point, data: data };
            updateTargetPanel(data);
        }
    } else if (simState.viewLevel === 1 && localGalaxy) {
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

        raycaster.params.Points.threshold = 50000;
        const intersects = raycaster.intersectObject(localGalaxy);
        if (intersects.length > 0) {
            disableAutopilot();
            const index = intersects[0].index; const data = getStarSystemInfo(index);
            simState.selectedTarget = { level: 1, index: index, position: intersects[0].point, data: data };
            updateTargetPanel(data);
        }
    } else if (simState.viewLevel === 2 && localSystem) {
         raycaster.params.Points.threshold = 1; 
         const intersects = raycaster.intersectObjects(localSystem.children);
         if (intersects.length > 0) {
             let target = intersects[0].object;
             if (!target.userData.type && target.parent && target.parent.userData.type) target = target.parent;
             
             if (target.userData.type) {
                 disableAutopilot();
                 const data = {
                    designation: target.userData.designation,
                    type: target.userData.type,
                    age: simState.universeSimTime.toFixed(2),
                    mass: "0.003 M☉", radius: "0.01 R☉", lum: "0",
                    composition: "Atmosphere: N2, O2"
                 };
                 simState.selectedTarget = { level: 2, object: target, position: target.position, data: data };
                 updateTargetPanel(data);
             }
         }
    }
}
