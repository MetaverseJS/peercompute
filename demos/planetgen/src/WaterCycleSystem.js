import * as THREE from 'three';
import { buildSurfaceFields, clamp01 } from './WaterCycleUtils.js';

const DEFAULT_GRID_WIDTH = 256;
const DEFAULT_GRID_HEIGHT = 128;

function makeWeatherTexture(data, width, height) {
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
}

export class WaterCycleSystem {
    constructor({ gridWidth = DEFAULT_GRID_WIDTH, gridHeight = DEFAULT_GRID_HEIGHT } = {}) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellCount = gridWidth * gridHeight;

        this.enabled = false;
        this.ready = false;

        this.device = null;
        this.pipeline = null;
        this.bindGroups = null;

        this.uniformBuffer = null;
        this.uniformData = new Float32Array(8 * 4); // array<vec4<f32>,8>

        this.stateBuffers = null;
        this.surfaceBuffer = null;
        this.outputBuffer = null;

        this.readbackBuffers = null;
        this.readbackInFlight = [false, false];
        this.readbackWriteIndex = 0;
        this.readbackVersion = 0;

        this.ping = 0;
        this.hasSurface = false;

        this.simTimeS = 0;
        this.timeScale = 1200; // sim seconds per real second (~20 min / s)
        this.readbackIntervalS = 0.15;
        this.readbackTimerS = 0;

        this.evapStrength = 1.0;
        this.precipStrength = 1.0;
        this.windStrength = 1.0;
        this.oceanInertia = 0.25;
        this.moistureLayers = 2;

        this.planetRadiusM = 500_000;

        this.textureData = new Uint8Array(this.cellCount * 4);
        this.weatherTexture = makeWeatherTexture(this.textureData, gridWidth, gridHeight);

        this.auxTextureData = new Uint8Array(this.cellCount * 4);
        this.weatherAuxTexture = makeWeatherTexture(this.auxTextureData, gridWidth, gridHeight);
    }

    setConfig({
        timeScale,
        readbackIntervalS,
        evapStrength,
        precipStrength,
        windStrength,
        oceanInertia,
        moistureLayers
    } = {}) {
        if (Number.isFinite(timeScale)) this.timeScale = Math.max(0, timeScale);
        if (Number.isFinite(readbackIntervalS)) this.readbackIntervalS = Math.max(0.01, readbackIntervalS);
        if (Number.isFinite(evapStrength)) this.evapStrength = Math.max(0, evapStrength);
        if (Number.isFinite(precipStrength)) this.precipStrength = Math.max(0, precipStrength);
        if (Number.isFinite(windStrength)) this.windStrength = Math.max(0, windStrength);
        if (Number.isFinite(oceanInertia)) this.oceanInertia = clamp01(oceanInertia);
        if (Number.isFinite(moistureLayers)) this.moistureLayers = Math.max(1, Math.min(4, Math.round(moistureLayers)));
    }

    static async create(opts = {}) {
        const { device, ...rest } = opts;
        const sys = new WaterCycleSystem(rest);
        await sys.init({ device });
        return sys;
    }

    async init({ device: injectedDevice } = {}) {
        if (injectedDevice) {
            this.device = injectedDevice;
            this.enabled = true;
        } else {
            if (typeof navigator === 'undefined' || !navigator.gpu) {
                console.warn('[WaterCycleSystem] WebGPU not available; weather simulation disabled.');
                this.enabled = false;
                return;
            }

            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.warn('[WaterCycleSystem] No GPU adapter found; weather simulation disabled.');
                this.enabled = false;
                return;
            }

            this.device = await adapter.requestDevice();
            this.enabled = true;
        }

        const device = this.device;
        const stateStrideBytes = 48; // 3 vec4<f32> per cell (up to 4 moisture layers)
        const surfaceStrideBytes = 16; // vec4<f32> per cell
        const outStrideBytes = 8; // 2x u32 per cell (main + aux)

        this.uniformBuffer = device.createBuffer({
            size: this.uniformData.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.stateBuffers = [
            device.createBuffer({
                size: this.cellCount * stateStrideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }),
            device.createBuffer({
                size: this.cellCount * stateStrideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            })
        ];

        this.surfaceBuffer = device.createBuffer({
            size: this.cellCount * surfaceStrideBytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.outputBuffer = device.createBuffer({
            size: this.cellCount * outStrideBytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });

        this.readbackBuffers = [
            device.createBuffer({
                size: this.cellCount * outStrideBytes,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            }),
            device.createBuffer({
                size: this.cellCount * outStrideBytes,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            })
        ];

        const module = device.createShaderModule({ code: this._wgsl() });
        this.pipeline = device.createComputePipeline({
            layout: 'auto',
            compute: { module, entryPoint: 'main' }
        });

        this.bindGroups = [
            device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                    { binding: 1, resource: { buffer: this.stateBuffers[0] } },
                    { binding: 2, resource: { buffer: this.stateBuffers[1] } },
                    { binding: 3, resource: { buffer: this.surfaceBuffer } },
                    { binding: 4, resource: { buffer: this.outputBuffer } }
                ]
            }),
            device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                    { binding: 1, resource: { buffer: this.stateBuffers[1] } },
                    { binding: 2, resource: { buffer: this.stateBuffers[0] } },
                    { binding: 3, resource: { buffer: this.surfaceBuffer } },
                    { binding: 4, resource: { buffer: this.outputBuffer } }
                ]
            })
        ];

        this.ready = true;
    }

    getTexture() {
        return this.weatherTexture;
    }

    getAuxTexture() {
        return this.weatherAuxTexture;
    }

    setPlanetSurface({ heightmap, size, seaLevel, planetRadiusM }) {
        if (!this.enabled || !this.ready) return;
        if (!heightmap || !size) return;

        this.planetRadiusM = planetRadiusM ?? this.planetRadiusM;

        const surface = buildSurfaceFields({
            heightmap,
            size,
            seaLevel,
            gridWidth: this.gridWidth,
            gridHeight: this.gridHeight
        });

        const initState = new Float32Array(this.cellCount * 12);
        const baseTemp = 288;
        const mountainHeightM = 8000;
        const hash01 = (x, y) => {
            const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
            return s - Math.floor(s);
        };

        for (let y = 0; y < this.gridHeight; y++) {
            const v = (y + 0.5) / this.gridHeight;
            const lat = (v - 0.5) * Math.PI;
            const latFactor = Math.abs(Math.sin(lat));
            for (let x = 0; x < this.gridWidth; x++) {
                const i = y * this.gridWidth + x;
                const ocean = surface[i * 4 + 0];
                const elev01 = surface[i * 4 + 1];
                const altM = elev01 * mountainHeightM;

                const n = (hash01(x, y) - 0.5) * 2;
                const t0 = baseTemp - 55 * latFactor - (altM * 0.0065) + n * 1.2;
                const qs = this._qsApprox(t0);
                const q0 = (ocean ? 0.94 : 0.65) * qs; // boundary layer (layer 0)
                const q1 = q0 * 0.85; // free troposphere (layer 1)
                const q2 = q1 * 0.72; // upper (layer 2)
                const q3 = q2 * 0.55; // upper (layer 3)
                const qc0 = ocean ? 0.00025 * (1 - latFactor) : 0.00005 * (1 - latFactor) * (1 - elev01);
                const p0 = (n * 700) + (Math.sin(lat * 3) * 250);
                const u0 = 10 * Math.sin(lat * 2);

                initState[i * 12 + 0] = t0;
                initState[i * 12 + 1] = q0; // q0 (boundary)
                initState[i * 12 + 2] = qc0;
                initState[i * 12 + 3] = 0;

                initState[i * 12 + 4] = p0; // pressure anomaly
                initState[i * 12 + 5] = u0; // u wind
                initState[i * 12 + 6] = 0; // v wind
                initState[i * 12 + 7] = ocean ? 1 : 0.25; // soil moisture proxy

                initState[i * 12 + 8] = q1;
                initState[i * 12 + 9] = q2;
                initState[i * 12 + 10] = q3;
                initState[i * 12 + 11] = 0; // snowpack
            }
        }

        const device = this.device;
        device.queue.writeBuffer(this.surfaceBuffer, 0, surface);
        device.queue.writeBuffer(this.stateBuffers[0], 0, initState);
        device.queue.writeBuffer(this.stateBuffers[1], 0, initState);

        // Seed the visual textures immediately so clouds aren't blank before the first GPU readback.
        for (let i = 0; i < this.cellCount; i++) {
            const T = initState[i * 12 + 0];
            const qc = initState[i * 12 + 2];
            const p = initState[i * 12 + 4];
            const u = initState[i * 12 + 5];
            const v = initState[i * 12 + 6];
            const soil = initState[i * 12 + 7];
            const cloud01 = clamp01(qc * 600);
            const p01 = clamp01(0.5 + p * (1 / 6000));
            const soil01 = clamp01(soil);
            this.textureData[i * 4 + 0] = Math.round(cloud01 * 255);
            this.textureData[i * 4 + 1] = 0;
            this.textureData[i * 4 + 2] = Math.round(p01 * 255);
            this.textureData[i * 4 + 3] = Math.round(soil01 * 255);

            const temp01 = clamp01((T - 240) / 70);
            const u01 = clamp01(0.5 + u * (1 / 120));
            const v01 = clamp01(0.5 + v * (1 / 120));
            this.auxTextureData[i * 4 + 0] = Math.round(temp01 * 255);
            this.auxTextureData[i * 4 + 1] = 0;
            this.auxTextureData[i * 4 + 2] = Math.round(u01 * 255);
            this.auxTextureData[i * 4 + 3] = Math.round(v01 * 255);
        }
        this.weatherTexture.needsUpdate = true;
        this.weatherAuxTexture.needsUpdate = true;

        this.simTimeS = 0;
        this.ping = 0;
        this.hasSurface = true;
    }

    update(deltaSeconds, sunDirLocal, opts = {}) {
        if (!this.enabled || !this.ready || !this.hasSurface) return;
        const dtReal = Math.min(Math.max(deltaSeconds ?? 0, 0), 0.25);
        const dtSimRaw = Number.isFinite(opts.dtSimOverride) ? opts.dtSimOverride : (dtReal * this.timeScale);
        const dtSim = Math.min(Math.max(dtSimRaw, 0), 900); // clamp to keep stable
        if (dtSim <= 0) return;

        this.simTimeS += dtSim;
        this.readbackTimerS += dtReal;

        this._writeUniforms(dtSim, this.simTimeS, sunDirLocal);

        const device = this.device;
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroups[this.ping]);
        pass.dispatchWorkgroups(
            Math.ceil(this.gridWidth / 8),
            Math.ceil(this.gridHeight / 8)
        );
        pass.end();

        let pendingReadbackIndex = null;
        const shouldReadback = Boolean(opts.forceReadback) || this.readbackTimerS >= this.readbackIntervalS;
        if (shouldReadback) {
            const rbIndex = this.readbackWriteIndex & 1;
            if (!this.readbackInFlight[rbIndex]) {
                encoder.copyBufferToBuffer(
                    this.outputBuffer,
                    0,
                    this.readbackBuffers[rbIndex],
                    0,
                    this.cellCount * 8
                );
                pendingReadbackIndex = rbIndex;
                this.readbackWriteIndex++;
                this.readbackTimerS = 0;
            }
        }

        device.queue.submit([encoder.finish()]);
        if (pendingReadbackIndex !== null) {
            this._scheduleReadback(pendingReadbackIndex);
        }
        this.ping = 1 - this.ping;
    }

    _scheduleReadback(rbIndex) {
        this.readbackInFlight[rbIndex] = true;
        const buf = this.readbackBuffers[rbIndex];
        this.device.queue.onSubmittedWorkDone().then(async () => {
            await buf.mapAsync(GPUMapMode.READ);
            const mapped = buf.getMappedRange();
            const bytes = new Uint8Array(mapped);
            const byteCount = this.cellCount * 4;
            this.textureData.set(bytes.subarray(0, byteCount));
            this.auxTextureData.set(bytes.subarray(byteCount, byteCount * 2));
            buf.unmap();
            this.weatherTexture.needsUpdate = true;
            this.weatherAuxTexture.needsUpdate = true;
            this.readbackVersion++;
        }).catch((err) => {
            console.warn('[WaterCycleSystem] Readback failed', err);
        }).finally(() => {
            this.readbackInFlight[rbIndex] = false;
        });
    }

    _writeUniforms(dtSim, timeSim, sunDirLocal) {
        const u = this.uniformData;

        // [0]: width, height, dt, time
        u[0] = this.gridWidth;
        u[1] = this.gridHeight;
        u[2] = dtSim;
        u[3] = timeSim;

        // [1]: radiusM, omega, baseTemp, lapseRate
        u[4] = this.planetRadiusM;
        u[5] = 2 * Math.PI / 86400; // omega (rad/s): 1 day
        u[6] = 288; // base temp K
        u[7] = 0.0065; // lapse K/m

        // [2]: scaleHeight, mountainHeight, gamma, unused
        u[8] = 8000; // scale height (m)
        u[9] = 8000; // max mountain height (m)
        u[10] = 0.0098; // adiabatic gamma K/m
        u[11] = this.moistureLayers;

        // [3]: sunDir.xyz, unused
        u[12] = sunDirLocal?.x ?? 0;
        u[13] = sunDirLocal?.y ?? 1;
        u[14] = sunDirLocal?.z ?? 0;
        u[15] = 0;

        // [4]: solarHeating, tempRelax, evapOcean, evapLand
        u[16] = 18; // solar heating K at zenith
        u[17] = 1 / 21600; // temp relax 6h
        u[18] = 3e-5 * this.evapStrength; // ocean evap rate
        u[19] = 1.2e-5 * this.evapStrength; // land evap rate

        // [5]: condenseRate, precipRate, rainDecay, cloudEvap
        u[20] = 1 / 1800; // condense timescale 30m
        u[21] = (1 / 1200) * this.precipStrength; // precip timescale 20m
        u[22] = 1 / 1800; // rain decay 30m
        u[23] = 1 / 3600; // cloud evap 1h

        // [6]: windRelax, windDrag, coriolisMin, maxWind
        u[24] = (1 / 7200) * this.windStrength; // wind relax 2h
        u[25] = 1 / 14400; // wind drag 4h
        u[26] = 2e-5; // coriolis min
        u[27] = 60 * this.windStrength; // max wind m/s

        // [7]: pressureTempCoeff, pressureVaporCoeff, pressureSmooth, scales
        u[28] = 120; // Pa per K
        u[29] = 45000; // Pa per kg/kg
        u[30] = 1 / 7200; // pressure smooth 2h
        u[31] = this.oceanInertia; // ocean temperature response multiplier (lower = higher heat capacity)

        this.device.queue.writeBuffer(this.uniformBuffer, 0, u);
    }

    _qsApprox(tK) {
        const Tc = tK - 273.15;
        const es_hPa = 6.112 * Math.exp((17.67 * Tc) / (Tc + 243.5));
        const e = es_hPa * 100;
        const p = 101325;
        const eps = 0.622;
        return (eps * e) / Math.max(p - e, 1);
    }

    _wgsl() {
        return /* wgsl */`
struct Cell {
  a: vec4<f32>, // T, q0, qc, rain
  b: vec4<f32>, // p, u, v, soil
  c: vec4<f32>, // q1, q2, q3, snow
};

@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 8>;
@group(0) @binding(1) var<storage, read> stateSrc: array<Cell>;
@group(0) @binding(2) var<storage, read_write> stateDst: array<Cell>;
@group(0) @binding(3) var<storage, read> surface: array<vec4<f32>>; // ocean, elev01, rawHeight, _
@group(0) @binding(4) var<storage, read_write> outPixels: array<u32>;

const MAX_MOISTURE_LAYERS: u32 = 4u;

fn getW() -> u32 { return u32(params[0].x); }
fn getH() -> u32 { return u32(params[0].y); }
fn getDt() -> f32 { return params[0].z; }
fn getTime() -> f32 { return params[0].w; }

fn radiusM() -> f32 { return params[1].x; }
fn omega() -> f32 { return params[1].y; }
fn baseTemp() -> f32 { return params[1].z; }
fn lapseRate() -> f32 { return params[1].w; }

fn scaleHeight() -> f32 { return params[2].x; }
fn mountainHeight() -> f32 { return params[2].y; }
fn gammaKPerM() -> f32 { return params[2].z; }

fn moistureLayers() -> u32 {
  let m = u32(clamp(params[2].w, 1.0, f32(MAX_MOISTURE_LAYERS)) + 0.5);
  return clamp(m, 1u, MAX_MOISTURE_LAYERS);
}

fn sunDir() -> vec3<f32> { return params[3].xyz; }

fn solarHeatingK() -> f32 { return params[4].x; }
fn tempRelax() -> f32 { return params[4].y; }
fn evapOcean() -> f32 { return params[4].z; }
fn evapLand() -> f32 { return params[4].w; }

fn condenseRate() -> f32 { return params[5].x; }
fn precipRate() -> f32 { return params[5].y; }
fn rainDecay() -> f32 { return params[5].z; }
fn cloudEvapRate() -> f32 { return params[5].w; }

fn windRelax() -> f32 { return params[6].x; }
fn windDrag() -> f32 { return params[6].y; }
fn coriolisMin() -> f32 { return params[6].z; }
fn maxWind() -> f32 { return params[6].w; }

fn pTempCoeff() -> f32 { return params[7].x; }
fn pVaporCoeff() -> f32 { return params[7].y; }
fn pSmooth() -> f32 { return params[7].z; }
fn oceanTempRelaxMul() -> f32 { return params[7].w; }

fn wrapX(x: i32, w: i32) -> u32 {
  var r = x % w;
  if (r < 0) { r = r + w; }
  return u32(r);
}

fn clampY(y: i32, h: i32) -> u32 {
  return u32(clamp(y, 0, h - 1));
}

fn idx(x: u32, y: u32) -> u32 {
  return y * getW() + x;
}

fn metersPerCellX(cosLat: f32) -> f32 {
  let w = f32(getW());
  let cl = max(cosLat, 0.08);
  return 2.0 * 3.14159265 * radiusM() * cl / w;
}

fn metersPerCellY() -> f32 {
  let h = f32(getH());
  return 3.14159265 * radiusM() / h;
}

fn satVaporPressurePa(T: f32) -> f32 {
  let Tc = T - 273.15;
  let es_hPa = 6.112 * exp((17.67 * Tc) / (Tc + 243.5));
  return es_hPa * 100.0;
}

fn satMixingRatio(T: f32) -> f32 {
  let e = satVaporPressurePa(T);
  let p = 101325.0;
  let eps = 0.622;
  return (eps * e) / max(p - e, 1.0);
}

fn packRGBA8(r: f32, g: f32, b: f32, a: f32) -> u32 {
  let R = u32(clamp(r, 0.0, 1.0) * 255.0 + 0.5);
  let G = u32(clamp(g, 0.0, 1.0) * 255.0 + 0.5);
  let B = u32(clamp(b, 0.0, 1.0) * 255.0 + 0.5);
  let A = u32(clamp(a, 0.0, 1.0) * 255.0 + 0.5);
  return (A << 24u) | (B << 16u) | (G << 8u) | R;
}

	fn wrapCoord(x: f32, w: f32) -> f32 {
	  return x - floor(x / w) * w;
	}

fn sampleTQc(xf: f32, yf: f32) -> vec2<f32> {
  let w = f32(getW());
  let h = f32(getH());
  let xw = wrapCoord(xf, w);
  let yc = clamp(yf, 0.0, h - 1.001);

  let x0i = i32(floor(xw));
  let y0i = i32(floor(yc));
  let x1i = x0i + 1;
  let y1i = y0i + 1;
  let tx = fract(xw);
  let ty = fract(yc);

  let x0 = wrapX(x0i, i32(getW()));
  let x1 = wrapX(x1i, i32(getW()));
  let y0 = clampY(y0i, i32(getH()));
  let y1 = clampY(y1i, i32(getH()));

  let c00 = vec2<f32>(stateSrc[idx(x0, y0)].a.x, stateSrc[idx(x0, y0)].a.z);
  let c10 = vec2<f32>(stateSrc[idx(x1, y0)].a.x, stateSrc[idx(x1, y0)].a.z);
  let c01 = vec2<f32>(stateSrc[idx(x0, y1)].a.x, stateSrc[idx(x0, y1)].a.z);
  let c11 = vec2<f32>(stateSrc[idx(x1, y1)].a.x, stateSrc[idx(x1, y1)].a.z);

  let c0 = mix(c00, c10, tx);
  let c1 = mix(c01, c11, tx);
  return mix(c0, c1, ty);
}

fn sampleQ(xf: f32, yf: f32) -> vec4<f32> {
  let w = f32(getW());
  let h = f32(getH());
  let xw = wrapCoord(xf, w);
  let yc = clamp(yf, 0.0, h - 1.001);

  let x0i = i32(floor(xw));
  let y0i = i32(floor(yc));
  let x1i = x0i + 1;
  let y1i = y0i + 1;
  let tx = fract(xw);
  let ty = fract(yc);

  let x0 = wrapX(x0i, i32(getW()));
  let x1 = wrapX(x1i, i32(getW()));
  let y0 = clampY(y0i, i32(getH()));
  let y1 = clampY(y1i, i32(getH()));

  let q00 = vec4<f32>(stateSrc[idx(x0, y0)].a.y, stateSrc[idx(x0, y0)].c.x, stateSrc[idx(x0, y0)].c.y, stateSrc[idx(x0, y0)].c.z);
  let q10 = vec4<f32>(stateSrc[idx(x1, y0)].a.y, stateSrc[idx(x1, y0)].c.x, stateSrc[idx(x1, y0)].c.y, stateSrc[idx(x1, y0)].c.z);
  let q01 = vec4<f32>(stateSrc[idx(x0, y1)].a.y, stateSrc[idx(x0, y1)].c.x, stateSrc[idx(x0, y1)].c.y, stateSrc[idx(x0, y1)].c.z);
  let q11 = vec4<f32>(stateSrc[idx(x1, y1)].a.y, stateSrc[idx(x1, y1)].c.x, stateSrc[idx(x1, y1)].c.y, stateSrc[idx(x1, y1)].c.z);

  let q0 = mix(q00, q10, tx);
  let q1 = mix(q01, q11, tx);
  return mix(q0, q1, ty);
}

fn sampleP(xf: f32, yf: f32) -> f32 {
  let w = f32(getW());
  let h = f32(getH());
  let xw = wrapCoord(xf, w);
  let yc = clamp(yf, 0.0, h - 1.001);

  let x0i = i32(floor(xw));
  let y0i = i32(floor(yc));
  let x1i = x0i + 1;
  let y1i = y0i + 1;
  let tx = fract(xw);
  let ty = fract(yc);

  let x0 = wrapX(x0i, i32(getW()));
  let x1 = wrapX(x1i, i32(getW()));
  let y0 = clampY(y0i, i32(getH()));
  let y1 = clampY(y1i, i32(getH()));

  let p00 = stateSrc[idx(x0, y0)].b.x;
  let p10 = stateSrc[idx(x1, y0)].b.x;
  let p01 = stateSrc[idx(x0, y1)].b.x;
  let p11 = stateSrc[idx(x1, y1)].b.x;

  let p0 = mix(p00, p10, tx);
  let p1 = mix(p01, p11, tx);
  return mix(p0, p1, ty);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let w = getW();
  let h = getH();
  if (gid.x >= w || gid.y >= h) { return; }
  let i = idx(gid.x, gid.y);

  let dt = getDt();

  let src = stateSrc[i];
  var T0 = src.a.x;
  var q0 = src.a.y;
  var qc0 = src.a.z;
  var rain0 = src.a.w;
  var p0 = src.b.x;
  var u0 = src.b.y;
  var v0 = src.b.z;
  var soil0 = src.b.w;
  var snow0 = src.c.w;

  let surf = surface[i];
  let ocean = surf.x;
  let elev01 = surf.y;
  let altM = elev01 * mountainHeight();

  let u = (f32(gid.x) + 0.5) / f32(w);
  let v = (f32(gid.y) + 0.5) / f32(h);
  let lon = (u - 0.5) * 6.28318531;
  let lat = (v - 0.5) * 3.14159265;
  let sinLat = sin(lat);
  let cosLat = cos(lat);
  let n = vec3<f32>(cosLat * cos(lon), sinLat, cosLat * sin(lon));
  let insolation = max(dot(normalize(n), normalize(sunDir())), 0.0);

  // Pressure gradient (Pa/m) from stored anomaly field.
  let xL = wrapX(i32(gid.x) - 1, i32(w));
  let xR = wrapX(i32(gid.x) + 1, i32(w));
  let yD = clampY(i32(gid.y) - 1, i32(h));
  let yU = clampY(i32(gid.y) + 1, i32(h));

  let mpcX = metersPerCellX(abs(cosLat));
  let mpcY = metersPerCellY();
  let inv2dx = 0.5 / mpcX;
  let inv2dy = 0.5 / mpcY;

  let pL = stateSrc[idx(xL, gid.y)].b.x;
  let pR = stateSrc[idx(xR, gid.y)].b.x;
  let pD = stateSrc[idx(gid.x, yD)].b.x;
  let pU = stateSrc[idx(gid.x, yU)].b.x;
  let dpdx = (pR - pL) * inv2dx;
  let dpdy = (pU - pD) * inv2dy;

  // Geostrophic wind estimate + relaxation.
  let rho = 1.2;
  var f = 2.0 * omega() * sinLat;
  if (abs(f) < coriolisMin()) {
    f = coriolisMin() * select(1.0, -1.0, f < 0.0);
  }
  let uGeo = -(1.0 / (rho * f)) * dpdy;
  let vGeo =  (1.0 / (rho * f)) * dpdx;
  let wMix = clamp(dt * windRelax(), 0.0, 1.0);
  var u1 = mix(u0, uGeo, wMix);
  var v1 = mix(v0, vGeo, wMix);
  let drag = exp(-windDrag() * dt);
  u1 *= drag;
  v1 *= drag;
  let spd = length(vec2<f32>(u1, v1));
  if (spd > maxWind()) {
    let s = maxWind() / max(spd, 1e-6);
    u1 *= s;
    v1 *= s;
  }

  // Semi-Lagrangian advection of T/q/qc using updated wind.
  let xB = f32(gid.x) - (u1 * dt) / mpcX;
  let yB = f32(gid.y) - (v1 * dt) / mpcY;
  let tqc = sampleTQc(xB, yB);
  let qAdv = sampleQ(xB, yB);
  let pAdv = sampleP(xB, yB);
  var T = tqc.x;
  var qc = tqc.y;
  var q: array<f32, MAX_MOISTURE_LAYERS>;
  q[0] = qAdv.x;
  q[1] = qAdv.y;
  q[2] = qAdv.z;
  q[3] = qAdv.w;
  var snow = snow0;
  let layers = moistureLayers();

  // Radiative equilibrium temperature + simple relaxation.
  let latFactor = abs(sinLat);
  let snowCover = clamp(snow, 0.0, 1.0) * (1.0 - ocean);
  let albedoBase = mix(0.22, 0.06, ocean);
  // Wet land darkens and gains thermal inertia.
  let wet = soil0 * (1.0 - ocean);
  albedoBase = mix(albedoBase, 0.12, wet);
  let cloudShade = clamp(qc * 3.0 + rain0 * 4.0, 0.0, 0.7);
  let albedo = mix(albedoBase, 0.75, snowCover);
  let Teq = baseTemp() - 55.0 * latFactor + solarHeatingK() * insolation * (1.0 - cloudShade) * (1.0 - albedo) - (lapseRate() * altM);
  let relaxRate = tempRelax() * mix(1.0, mix(0.6, oceanTempRelaxMul(), ocean), wet);
  T = mix(T, Teq, clamp(dt * relaxRate, 0.0, 1.0));

  // Lift cooling (convergence + orographic).
  let uL = stateSrc[idx(xL, gid.y)].b.y;
  let uR = stateSrc[idx(xR, gid.y)].b.y;
  let vD2 = stateSrc[idx(gid.x, yD)].b.z;
  let vU2 = stateSrc[idx(gid.x, yU)].b.z;
  let div = (uR - uL) * inv2dx + (vU2 - vD2) * inv2dy;
  let wConv = (-div) * scaleHeight();

  let altL = surface[idx(xL, gid.y)].y * mountainHeight();
  let altR = surface[idx(xR, gid.y)].y * mountainHeight();
  let altD = surface[idx(gid.x, yD)].y * mountainHeight();
  let altU = surface[idx(gid.x, yU)].y * mountainHeight();
  let dhdx = (altR - altL) * inv2dx;
  let dhdy = (altU - altD) * inv2dy;
  let wOrog = u1 * dhdx + v1 * dhdy;
  let wLift = clamp(wConv + wOrog, -20.0, 20.0);
  T -= gammaKPerM() * wLift * dt;

  // Evaporation (ocean deficit-based, land soil-based).
  let qs = satMixingRatio(T);
  let deficit = max(0.0, qs - q[0]);
  q[0] += ocean * evapOcean() * insolation * deficit * dt;
  q[0] += (1.0 - ocean) * evapLand() * insolation * soil0 * (1.0 - 0.85 * snowCover) * dt;

  // Configurable moisture layering: diffuse mixing between adjacent layers, enhanced by lift.
  let mixRate = (1.0 / 7200.0) * (0.35 + 0.65 * insolation);
  let liftMix = clamp(abs(wLift) * dt / scaleHeight(), 0.0, 0.25);
  for (var k: u32 = 0u; k < (MAX_MOISTURE_LAYERS - 1u); k = k + 1u) {
    if (k + 1u >= layers) { break; }
    let altFactor = exp(-f32(k) * 0.75);
    let mixAmt = clamp(dt * mixRate * altFactor + liftMix * altFactor, 0.0, 0.35);
    let dq = (q[k] - q[k + 1u]) * mixAmt;
    q[k] -= dq;
    q[k + 1u] += dq;
  }

  // Condensation / evaporation of cloud water.
  let latentK = 2000.0;
  let cloudIdx = select(0u, 1u, layers > 1u);
  if (q[cloudIdx] > qs) {
    let cond = (q[cloudIdx] - qs) * clamp(dt * condenseRate(), 0.0, 1.0);
    q[cloudIdx] -= cond;
    qc += cond;
    T += latentK * cond;
  } else if (qc > 0.0) {
    let evap = min(qs - q[cloudIdx], qc) * clamp(dt * cloudEvapRate(), 0.0, 1.0);
    q[cloudIdx] += evap;
    qc -= evap;
    T -= latentK * evap;
  }

  // Precipitation + soil moisture deposition.
  let qcThresh = 0.001;
  let pr = max(0.0, qc - qcThresh) * clamp(dt * precipRate(), 0.0, 1.0);
  qc -= pr;
  // Snow/rain phase: below freezing, precipitation does not count as "rain" and does not wet soil.
  let liquid = smoothstep(271.15, 275.15, T);
  let prLiquid = pr * liquid;
  let prSnow = pr * (1.0 - liquid);
  var rain = rain0 * exp(-rainDecay() * dt) + prLiquid;
  var soil = clamp(soil0 + prLiquid * (1.0 - ocean) * 400.0, 0.0, 1.0);
  soil *= exp(-dt * (1.0 / 86400.0)); // ~1 day drydown baseline
  snow = clamp(snow + prSnow * (1.0 - ocean) * 650.0, 0.0, 1.0);

  // Snowmelt adds surface wetness.
  let meltFactor = clamp((T - 272.15) / 6.0 + insolation * 0.15, 0.0, 1.0);
  let melt = min(snow, snow * meltFactor * dt * (1.0 / 21600.0)); // ~6h warm-season timescale
  snow -= melt;
  soil = clamp(soil + melt * (1.0 - ocean) * 0.65, 0.0, 1.0);

  // Pressure anomaly relax toward T/q-driven target.
  var qCol = q[0];
  if (layers > 1u) {
    qCol = q[1] + 0.6 * q[0];
    if (layers > 2u) { qCol += 0.35 * q[2]; }
    if (layers > 3u) { qCol += 0.25 * q[3]; }
  }
  let pEq = -(T - baseTemp()) * pTempCoeff() - (qCol * pVaporCoeff()) - (altM * 0.08);
  var p = mix(pAdv, pEq, clamp(dt * pSmooth(), 0.0, 1.0));

  // Clamp.
  T = clamp(T, 180.0, 330.0);
  for (var k: u32 = 0u; k < MAX_MOISTURE_LAYERS; k = k + 1u) {
    q[k] = clamp(q[k], 0.0, 0.05);
  }
  qc = clamp(qc, 0.0, 0.02);
  rain = clamp(rain, 0.0, 0.02);

  // Output packed weather (cloud, rain, pressure, soil).
  let cloud01 = clamp(qc * 600.0, 0.0, 1.0);
  let rain01 = clamp(rain * 800.0, 0.0, 1.0);
  let p01 = clamp(0.5 + p * (1.0 / 6000.0), 0.0, 1.0);
  let soil01 = clamp(soil, 0.0, 1.0);
  outPixels[i] = packRGBA8(cloud01, rain01, p01, soil01);

  // Aux packed weather (temp, snow, windU, windV).
  let cellCount = w * h;
  let temp01 = clamp((T - 240.0) / 70.0, 0.0, 1.0);
  let snow01 = clamp(snow, 0.0, 1.0);
  let u01 = clamp(0.5 + 0.5 * clamp(u1 / maxWind(), -1.0, 1.0), 0.0, 1.0);
  let v01 = clamp(0.5 + 0.5 * clamp(v1 / maxWind(), -1.0, 1.0), 0.0, 1.0);
  outPixels[i + cellCount] = packRGBA8(temp01, snow01, u01, v01);

  stateDst[i] = Cell(vec4<f32>(T, q[0], qc, rain), vec4<f32>(p, u1, v1, soil), vec4<f32>(q[1], q[2], q[3], snow));
}
        `;
    }
}
