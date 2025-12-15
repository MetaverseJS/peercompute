import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlanetForge } from './worldgen.js';

const canvas = document.getElementById('viewport');
const statusEl = document.getElementById('status');
const presetEl = document.getElementById('preset');
const regenBtn = document.getElementById('regen');
const resolutionEl = document.getElementById('resolution');
const platesEl = document.getElementById('plates');
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
const atmosphereValueEl = document.getElementById('atmosphereValue');

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x05070f);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);
scene.fog = new THREE.Fog(0x05070f, 30, 120);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 10, 28);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 12;
controls.maxDistance = 60;

scene.add(new THREE.HemisphereLight(0xd8e7ff, 0x0a0c12, 0.9));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
dirLight.position.set(12, 16, 10);
scene.add(dirLight);

scene.add(buildStarfield());

let planet = null;
let generating = false;
let autoRegenTimer = null;
let water = null;
let atmosphere = null;
let clouds = null;

const presets = {
    fast: {
        resolution: 384,
        numPlates: 16,
        jitter: 0.6,
        iterations: 80000,
        erosionRate: 0.36,
        evaporation: 0.5,
        radius: 10,
        heightScale: 18.2,
        seaLevel: 0.53,
        smoothPasses: 20,
        subdivisions: 60,
        iceCap: 0.15,
        plateDelta: 1.25,
        atmosphere: 0.35,
        faultType: 'ridge'
    },
    balanced: {
        resolution: 384,
        numPlates: 16,
        jitter: 0.6,
        iterations: 80000,
        erosionRate: 0.36,
        evaporation: 0.5,
        radius: 10,
        heightScale: 18.2,
        seaLevel: 0.53,
        smoothPasses: 20,
        subdivisions: 60,
        iceCap: 0.12,
        plateDelta: 1.25,
        atmosphere: 0.35,
        faultType: 'mixed'
    },
    high: {
        resolution: 384,
        numPlates: 16,
        jitter: 0.6,
        iterations: 80000,
        erosionRate: 0.36,
        evaporation: 0.5,
        radius: 10,
        heightScale: 18.2,
        seaLevel: 0.53,
        smoothPasses: 20,
        subdivisions: 60,
        iceCap: 0.15,
        plateDelta: 1.25,
        atmosphere: 0.35,
        faultType: 'ridge'
    }
};

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const setStatus = (text) => {
    statusEl.textContent = text;
};

const waterUniforms = {
    time: { value: 0 },
    deepColor: { value: new THREE.Color(0x08203f) },
    shallowColor: { value: new THREE.Color(0x154f8a) },
    opacity: { value: 0.65 },
    fresnelPower: { value: 3.4 }
};
const atmosphereUniforms = {
    time: { value: 0 },
    glowColor: { value: new THREE.Color(0x4da8ff) },
    thickness: { value: 0.35 }
};
const cloudUniforms = {
    time: { value: 0 },
    color: { value: new THREE.Color(0xffffff) },
    opacity: { value: 0.45 },
    sunDir: { value: new THREE.Vector3(0.3, 0.5, 0.2).normalize() },
    windDir: { value: new THREE.Vector3(0.0, 0.0, 1.0) },
    planetRadius: { value: 10 },
    seaLevel: { value: 0.53 },
    heightScale: { value: 18.2 }
};

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function updateRangeLabels() {
    jitterValueEl.textContent = Number(jitterEl.value).toFixed(2);
    heightScaleValueEl.textContent = Number(heightScaleEl.value).toFixed(2);
    erosionRateValueEl.textContent = Number(erosionRateEl.value).toFixed(2);
    evaporationValueEl.textContent = Number(evaporationEl.value).toFixed(3);
    seaLevelValueEl.textContent = Number(seaLevelEl.value).toFixed(2);
    atmosphereValueEl.textContent = Number(atmosphereEl.value).toFixed(2);
    smoothPassesValueEl.textContent = Number(smoothPassesEl.value).toFixed(0);
    subdivisionsValueEl.textContent = Number(subdivisionsEl.value).toFixed(0);
    iceCapValueEl.textContent = Number(iceCapEl.value).toFixed(2);
    plateDeltaValueEl.textContent = Number(plateDeltaEl.value).toFixed(2);
}

function markDirty() {
    setStatus('Params changed. Regenerating…');
}

function applyPreset(key) {
    const preset = presets[key] || presets.balanced;
    presetEl.value = key;
    resolutionEl.value = preset.resolution;
    platesEl.value = preset.numPlates;
    jitterEl.value = preset.jitter;
    heightScaleEl.value = preset.heightScale;
    iterationsEl.value = preset.iterations;
    erosionRateEl.value = preset.erosionRate;
    evaporationEl.value = preset.evaporation;
    seaLevelEl.value = preset.seaLevel ?? 0.53;
    atmosphereEl.value = preset.atmosphere ?? 0.35;
    smoothPassesEl.value = preset.smoothPasses ?? 20;
    subdivisionsEl.value = preset.subdivisions ?? 60;
    iceCapEl.value = preset.iceCap ?? 0.15;
    plateDeltaEl.value = preset.plateDelta ?? 1.25;
    faultTypeEl.value = preset.faultType || 'ridge';
    updateRangeLabels();
}

function readSettings() {
    return {
        resolution: clamp(parseInt(resolutionEl.value, 10) || 256, 64, 4096),
        numPlates: clamp(parseInt(platesEl.value, 10) || 10, 4, 400),
        jitter: clamp(parseFloat(jitterEl.value) || 0.5, 0, 1),
        iterations: clamp(parseInt(iterationsEl.value, 10) || 50000, 1000, 2000000),
        erosionRate: clamp(parseFloat(erosionRateEl.value) || 0.1, 0.001, 2),
        evaporation: clamp(parseFloat(evaporationEl.value) || 0.02, 0, 2),
        heightScale: clamp(parseFloat(heightScaleEl.value) || 2, 0, 80),
        seaLevel: clamp(parseFloat(seaLevelEl.value) || 0.5, 0, 1),
        atmosphere: clamp(parseFloat(atmosphereEl.value) || 0.35, 0.05, 1.5),
        smoothPasses: Math.round(clamp(parseFloat(smoothPassesEl.value) || 0, 0, 40)),
        subdivisions: Math.round(clamp(parseFloat(subdivisionsEl.value) || 6, 0, 512)),
        iceCap: clamp(parseFloat(iceCapEl.value) || 0.1, 0, 1),
        plateDelta: clamp(parseFloat(plateDeltaEl.value) || 1.25, 0, 2),
        faultType: faultTypeEl.value || 'ridge',
        radius: 10
    };
}

function writeSettings(settings) {
    resolutionEl.value = settings.resolution;
    platesEl.value = settings.numPlates;
    jitterEl.value = settings.jitter;
    iterationsEl.value = settings.iterations;
    erosionRateEl.value = settings.erosionRate;
    evaporationEl.value = settings.evaporation;
    heightScaleEl.value = settings.heightScale;
    seaLevelEl.value = settings.seaLevel;
    atmosphereEl.value = settings.atmosphere;
    smoothPassesEl.value = settings.smoothPasses;
    subdivisionsEl.value = settings.subdivisions;
    iceCapEl.value = settings.iceCap;
    plateDeltaEl.value = settings.plateDelta;
    faultTypeEl.value = settings.faultType;
    updateRangeLabels();
}

function normalizeHeightmap(buffer) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < buffer.length; i++) {
        const v = buffer[i];
        if (v < min) min = v;
        if (v > max) max = v;
    }
    const range = Math.max(max - min, 1e-5);
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] = (buffer[i] - min) / range;
    }
}

function smoothHeightmap(buffer, size, passes = 1) {
    if (passes <= 0) return;
    const temp = new Float32Array(buffer.length);
    for (let p = 0; p < passes; p++) {
        for (let y = 0; y < size; y++) {
            const yUp = Math.max(0, y - 1);
            const yDown = Math.min(size - 1, y + 1);
            for (let x = 0; x < size; x++) {
                const left = (x - 1 + size) % size;
                const right = (x + 1) % size;
                const idx = y * size + x;
                const acc = buffer[idx] * 2
                    + buffer[y * size + left]
                    + buffer[y * size + right]
                    + buffer[yUp * size + x]
                    + buffer[yDown * size + x];
                temp[idx] = acc / 6;
            }
        }
        buffer.set(temp);
    }
}

async function generateWorld(presetKey) {
    if (generating) return;
    generating = true;
    clearTimeout(autoRegenTimer);
    regenBtn.disabled = true;
    presetEl.disabled = true;
    resolutionEl.disabled = true;
    platesEl.disabled = true;
    jitterEl.disabled = true;
    heightScaleEl.disabled = true;
    iterationsEl.disabled = true;
    erosionRateEl.disabled = true;
    evaporationEl.disabled = true;
    seaLevelEl.disabled = true;
    atmosphereEl.disabled = true;
    smoothPassesEl.disabled = true;
    subdivisionsEl.disabled = true;
    iceCapEl.disabled = true;

    const settings = readSettings();
    writeSettings(settings); // ensure UI reflects clamped values

    try {
        setStatus(`Tectonics: ${settings.numPlates} plates`);
        await nextFrame();

        const forge = new PlanetForge(settings.resolution);
        forge.generateTectonics({
            numPlates: settings.numPlates,
            jitter: settings.jitter,
            oceanFloor: 0.2,
            plateDelta: settings.plateDelta,
            faultType: settings.faultType
        });

        setStatus(`Erosion: ${settings.iterations.toLocaleString()} droplets`);
        await nextFrame();

        forge.applyErosion({
            iterations: settings.iterations,
            erosionRate: settings.erosionRate,
            evaporation: settings.evaporation
        });

        normalizeHeightmap(forge.data);
        smoothHeightmap(forge.data, forge.size, settings.smoothPasses);
        forge.applyHydrology({ seaLevel: settings.seaLevel });

        setStatus('Meshing planet…');
        await nextFrame();

        const mesh = forge.createMesh(settings.radius, settings.heightScale, settings.seaLevel, settings.subdivisions, settings.iceCap);
        mesh.rotation.x = 0.25;
        replacePlanet(mesh);
        replaceWater(buildWaterMesh(settings.radius, settings.subdivisions, settings.seaLevel, settings.heightScale));
        const sunDir = new THREE.Vector3().copy(dirLight.position).normalize();
        replaceAtmosphere(buildAtmosphereMesh(settings.radius, settings.subdivisions, settings.heightScale, settings.atmosphere, sunDir));
        replaceClouds(buildCloudMesh(settings.radius + settings.heightScale * 0.2, settings.subdivisions, sunDir, settings.radius, settings.seaLevel, settings.heightScale));

        setStatus(`${settings.resolution}² map · ${settings.iterations.toLocaleString()} steps`);
    } catch (err) {
        console.error(err);
        setStatus('Generation failed – check console');
    } finally {
        generating = false;
        regenBtn.disabled = false;
        presetEl.disabled = false;
        resolutionEl.disabled = false;
        platesEl.disabled = false;
        jitterEl.disabled = false;
        heightScaleEl.disabled = false;
        iterationsEl.disabled = false;
        erosionRateEl.disabled = false;
        evaporationEl.disabled = false;
        seaLevelEl.disabled = false;
        atmosphereEl.disabled = false;
        smoothPassesEl.disabled = false;
        subdivisionsEl.disabled = false;
        iceCapEl.disabled = false;
    }
}

function replacePlanet(mesh) {
    if (planet) {
        planet.geometry.dispose();
        if (Array.isArray(planet.material)) {
            planet.material.forEach((m) => m.dispose?.());
        } else {
            planet.material.dispose?.();
        }
        scene.remove(planet);
    }
    planet = mesh;
    scene.add(mesh);
}

function replaceWater(mesh) {
    if (water) {
        water.geometry.dispose();
        if (Array.isArray(water.material)) {
            water.material.forEach((m) => m.dispose?.());
        } else {
            water.material.dispose?.();
        }
        scene.remove(water);
    }
    water = mesh;
    scene.add(mesh);
}

function replaceAtmosphere(mesh) {
    if (atmosphere) {
        atmosphere.geometry.dispose();
        atmosphere.material.dispose?.();
        scene.remove(atmosphere);
    }
    atmosphere = mesh;
    scene.add(mesh);
}

function replaceClouds(mesh) {
    if (clouds) {
        clouds.geometry.dispose();
        clouds.material.dispose?.();
        scene.remove(clouds);
    }
    clouds = mesh;
    scene.add(mesh);
}

function buildStarfield() {
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        const r = 90 + Math.random() * 60;
        const theta = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        const phi = Math.acos(u);
        const sinPhi = Math.sin(phi);

        positions[i * 3] = r * sinPhi * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.cos(phi);
        positions[i * 3 + 2] = r * sinPhi * Math.sin(theta);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 0x7dd3fc,
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7
    });
    return new THREE.Points(geometry, material);
}

function buildWaterMesh(radius, subdivisions, seaLevel, heightScale) {
    const waterRadius = radius + ((seaLevel - 0.5) * heightScale) + 0.01; // align to slider, tiny lift to avoid z-fight
    const geometry = new THREE.IcosahedronGeometry(waterRadius, Math.max(0, Math.floor(subdivisions)));
    const material = new THREE.ShaderMaterial({
        uniforms: waterUniforms,
        transparent: true,
        depthWrite: true,
        side: THREE.FrontSide,
        blending: THREE.NormalBlending,
        vertexShader: `
            uniform float time;
            varying vec3 vWorldPos;
            varying vec3 vNormal;
            void main() {
                vec3 pos = position;
                float wave = sin((pos.x + pos.z) * 0.35 + time * 0.6) * 0.02;
                pos += normalize(normal) * wave;
                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                vWorldPos = worldPos.xyz;
                vNormal = normalize(normalMatrix * normalize(pos));
                vec4 mvPosition = viewMatrix * worldPos;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 deepColor;
            uniform vec3 shallowColor;
            uniform float opacity;
            uniform float fresnelPower;
            varying vec3 vWorldPos;
            varying vec3 vNormal;
            void main() {
                vec3 viewDir = normalize(cameraPosition - vWorldPos);
                float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), fresnelPower);
                vec3 base = mix(shallowColor, deepColor, fresnel);
                float sparkle = pow(fresnel, 4.0) * 0.3;
                gl_FragColor = vec4(base + sparkle, opacity);
            }
        `
    });
    return new THREE.Mesh(geometry, material);
}

function buildAtmosphereMesh(radius, subdivisions, heightScale, thickness, sunDir) {
    const outerRadius = radius + Math.max(0.05, thickness) * heightScale;
    atmosphereUniforms.thickness.value = Math.max(0.05, thickness);
    atmosphereUniforms.glowColor.value = new THREE.Color(0x4da8ff);
    const geometry = new THREE.IcosahedronGeometry(outerRadius, Math.max(0, Math.floor(subdivisions)));
    const material = new THREE.ShaderMaterial({
        uniforms: atmosphereUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vWorld;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vWorld = worldPos.xyz;
                gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            uniform float thickness;
            varying vec3 vNormal;
            varying vec3 vWorld;
            void main() {
                vec3 viewDir = normalize(cameraPosition - vWorld);
                float rim = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 3.0);
                float fade = smoothstep(0.0, 1.0, thickness);
                float alpha = rim * 0.5 * fade;
                if(alpha < 0.01) discard;
                gl_FragColor = vec4(glowColor, alpha);
            }
        `
    });
    return new THREE.Mesh(geometry, material);
}

function buildCloudMesh(radius, subdivisions, sunDir, planetRadius, seaLevel, heightScale) {
    const cloudRadius = radius + 0.5;
    cloudUniforms.sunDir.value.copy(sunDir).normalize();
    const windAngle = atmosphereUniforms.time.value * 0.02;
    cloudUniforms.windDir.value.set(Math.sin(windAngle), 0, Math.cos(windAngle)).normalize();
    cloudUniforms.planetRadius.value = planetRadius;
    cloudUniforms.seaLevel.value = seaLevel;
    cloudUniforms.heightScale.value = heightScale;
    const geometry = new THREE.IcosahedronGeometry(cloudRadius, Math.max(1, Math.floor(subdivisions * 0.5)));
    const material = new THREE.ShaderMaterial({
        uniforms: cloudUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.NormalBlending,
        vertexShader: `
            uniform float time;
            uniform vec3 sunDir;
            uniform vec3 windDir;
            uniform float planetRadius;
            uniform float seaLevel;
            uniform float heightScale;
            varying vec3 vWorld;
            varying vec3 vNormal;
            // 3D noise helpers
            float hash(vec3 p) {
                p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                p *= 17.0;
                return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
            }
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f*f*(3.0-2.0*f);
                float n000 = hash(i + vec3(0,0,0));
                float n100 = hash(i + vec3(1,0,0));
                float n010 = hash(i + vec3(0,1,0));
                float n110 = hash(i + vec3(1,1,0));
                float n001 = hash(i + vec3(0,0,1));
                float n101 = hash(i + vec3(1,0,1));
                float n011 = hash(i + vec3(0,1,1));
                float n111 = hash(i + vec3(1,1,1));
                float nx00 = mix(n000, n100, f.x);
                float nx10 = mix(n010, n110, f.x);
                float nx01 = mix(n001, n101, f.x);
                float nx11 = mix(n011, n111, f.x);
                float nxy0 = mix(nx00, nx10, f.y);
                float nxy1 = mix(nx01, nx11, f.y);
                return mix(nxy0, nxy1, f.z);
            }
            float fbm(vec3 p) {
                float sum = 0.0;
                float amp = 0.5;
                for(int i=0;i<4;i++){
                    sum += noise(p) * amp;
                    p *= 2.1;
                    amp *= 0.5;
                }
                return sum;
            }
            void main() {
                vec3 pos = position;
                vec3 dir = normalize(pos);
                float n = fbm(dir * 3.0 + windDir * time * 0.5);
                pos += normal * n * 0.35;
                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                vWorld = worldPos.xyz;
                vNormal = normalize(normalMatrix * normalize(pos));
                gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            uniform float time;
            uniform vec3 sunDir;
            uniform vec3 windDir;
            uniform float planetRadius;
            uniform float seaLevel;
            uniform float heightScale;
            varying vec3 vWorld;
            varying vec3 vNormal;
            float hash(vec3 p) {
                p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                p *= 17.0;
                return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
            }
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f*f*(3.0-2.0*f);
                float n000 = hash(i + vec3(0,0,0));
                float n100 = hash(i + vec3(1,0,0));
                float n010 = hash(i + vec3(0,1,0));
                float n110 = hash(i + vec3(1,1,0));
                float n001 = hash(i + vec3(0,0,1));
                float n101 = hash(i + vec3(1,0,1));
                float n011 = hash(i + vec3(0,1,1));
                float n111 = hash(i + vec3(1,1,1));
                float nx00 = mix(n000, n100, f.x);
                float nx10 = mix(n010, n110, f.x);
                float nx01 = mix(n001, n101, f.x);
                float nx11 = mix(n011, n111, f.x);
                float nxy0 = mix(nx00, nx10, f.y);
                float nxy1 = mix(nx01, nx11, f.y);
                return mix(nxy0, nxy1, f.z);
            }
            float fbm(vec3 p) {
                float sum = 0.0;
                float amp = 0.5;
                for(int i=0;i<4;i++){
                    sum += noise(p) * amp;
                    p *= 2.1;
                    amp *= 0.5;
                }
                return sum;
            }
            void main() {
                vec3 dir = normalize(vWorld);
                float day = clamp(dot(dir, normalize(sunDir)), 0.0, 1.0);
                float lat = 1.0 - abs(dir.y);
                float n = fbm(dir * 0.8 + windDir * time * 0.4 + vec3(0.0, time * 0.02, 0.0));
                float coverage = n + lat * 0.2 + day * 0.2;
                float alpha = smoothstep(0.48, 0.68, coverage) * opacity;
                if(alpha < 0.01) discard;
                vec3 viewDir = normalize(cameraPosition - vWorld);
                float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
                gl_FragColor = vec4(color * (0.8 + fresnel * 0.4), alpha);
            }
        `
    });
    return new THREE.Mesh(geometry, material);
}

function onResize() {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    updateRangeLabels();
    if (planet && !generating) {
        planet.rotation.y += 0.0009;
    }
    if (water) waterUniforms.time.value += 0.016;
    if (clouds) {
        cloudUniforms.time.value += 0.008;
        const windAngle = cloudUniforms.time.value * 0.2;
        cloudUniforms.windDir.value.set(Math.sin(windAngle), 0, Math.cos(windAngle)).normalize();
    }
    if (atmosphere) atmosphereUniforms.time.value += 0.002;
    controls.update();
    renderer.render(scene, camera);
}

regenBtn.addEventListener('click', () => generateWorld(presetEl.value));

const regenControls = [
    resolutionEl,
    platesEl,
    jitterEl,
    heightScaleEl,
    iterationsEl,
    erosionRateEl,
    evaporationEl,
    seaLevelEl,
    atmosphereEl,
    smoothPassesEl,
    subdivisionsEl,
    iceCapEl,
    plateDeltaEl,
    faultTypeEl
];

function queueAutoRegen() {
    if (generating) return;
    clearTimeout(autoRegenTimer);
    autoRegenTimer = setTimeout(() => generateWorld(presetEl.value), 400);
}

regenControls.forEach((el) => {
    el.addEventListener('input', () => {
        updateRangeLabels();
        markDirty();
        queueAutoRegen();
    });
    el.addEventListener('change', () => {
        updateRangeLabels();
        markDirty();
        queueAutoRegen();
    });
});

presetEl.addEventListener('change', () => {
    applyPreset(presetEl.value);
    setStatus('Preset applied. Regenerating…');
    queueAutoRegen();
});
window.addEventListener('resize', onResize);

applyPreset(presetEl.value);
generateWorld(presetEl.value);
animate();
