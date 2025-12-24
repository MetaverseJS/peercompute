import * as THREE from 'three';
import { buildSurfaceFields, clamp01 } from './WaterCycleUtils.js';

const DEFAULT_SURFACE_W = 256;
const DEFAULT_SURFACE_H = 128;
const DEFAULT_VOLUME_N = 8; // NxNxN voxels

function makeDataTexture(data, width, height, {
    wrapS = THREE.ClampToEdgeWrapping,
    wrapT = THREE.ClampToEdgeWrapping,
    minFilter = THREE.NearestFilter,
    magFilter = THREE.NearestFilter
} = {}) {
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    tex.wrapS = wrapS;
    tex.wrapT = wrapT;
    tex.minFilter = minFilter;
    tex.magFilter = magFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
}

function computeAtlasLayout(nz) {
    const tilesX = Math.max(1, Math.ceil(Math.sqrt(nz)));
    const tilesY = Math.max(1, Math.ceil(nz / tilesX));
    return {
        tilesX,
        tilesY,
        atlasW: tilesX * nz,
        atlasH: tilesY * nz
    };
}

export class WaterCycleVolumeSystem {
    constructor({
        volumeN = DEFAULT_VOLUME_N,
        surfaceW = DEFAULT_SURFACE_W,
        surfaceH = DEFAULT_SURFACE_H
    } = {}) {
        this.volumeN = Math.max(1, Math.min(192, Math.round(volumeN)));
        this.surfaceW = Math.max(8, Math.min(1024, Math.round(surfaceW)));
        this.surfaceH = Math.max(8, Math.min(1024, Math.round(surfaceH)));

        this.voxelCount = this.volumeN * this.volumeN * this.volumeN;
        this.surfaceCellCount = this.surfaceW * this.surfaceH;

        const atlas = computeAtlasLayout(this.volumeN);
        this.tilesX = atlas.tilesX;
        this.tilesY = atlas.tilesY;
        this.atlasW = atlas.atlasW;
        this.atlasH = atlas.atlasH;
        this.atlasPixelCount = this.atlasW * this.atlasH;

        // Keep surface fields and 2D weather outputs on the same grid so we can reuse indices.
        this.weatherW = this.surfaceW;
        this.weatherH = this.surfaceH;
        this.weatherCellCount = this.weatherW * this.weatherH;

        this.weatherOffset = this.atlasPixelCount;
        this.auxOffset = this.atlasPixelCount + this.weatherCellCount;
        this.totalOutPixels = this.atlasPixelCount + this.weatherCellCount * 2;

        this.enabled = false;
        this.ready = false;

        this.device = null;
        this.pipelineSim = null;
        this.pipelineCollapse = null;
        this.bindGroupLayout = null;
        this.bindGroupsSim = null;
        this.bindGroupsCollapse = null;

        this.uniformBuffer = null;
        this.uniformData = new Float32Array(12 * 4); // array<vec4<f32>,12>

        this.stateBuffers = null; // volume state ping-pong
        this.surfaceBuffer = null; // static surface fields (ocean/elev)
        this.surfaceStateBuffers = null; // soil/snow/rain ping-pong (2D)
        this.outputBuffer = null; // packed atlas + 2D maps

        this.readbackBuffers = null;
        this.readbackInFlight = [false, false];
        this.readbackWriteIndex = 0;

        this.ping = 0;
        this.hasSurface = false;

        this.simTimeS = 0;
        this.timeScale = 1200; // sim seconds per real second (~20 min / s)
        this.readbackIntervalS = 0.15;
        this.readbackTimerS = 0;

        this.evapStrength = 1.0;
        this.precipStrength = 1.0;
        this.windStrength = 1.0;
        this.windShear = 0.6;
        this.surfaceDrag = 0.4;
        this.oceanInertia = 0.25;

        this.planetRadiusM = 500_000;
        this.atmoThicknessM = 20_000;
        this.mountainHeightM = 8000;

        this.volumeTextureData = new Uint8Array(this.atlasPixelCount * 4);
        this.volumeAtlasTexture = makeDataTexture(this.volumeTextureData, this.atlasW, this.atlasH, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter
        });

        this.weatherTextureData = new Uint8Array(this.weatherCellCount * 4);
        this.weatherTexture = makeDataTexture(this.weatherTextureData, this.weatherW, this.weatherH, {
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter
        });

        this.auxTextureData = new Uint8Array(this.weatherCellCount * 4);
        this.weatherAuxTexture = makeDataTexture(this.auxTextureData, this.weatherW, this.weatherH, {
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter
        });
    }

    static async create(opts = {}) {
        const { device, ...rest } = opts;
        const sys = new WaterCycleVolumeSystem(rest);
        await sys.init({ device });
        return sys;
    }

    setConfig({
        timeScale,
        readbackIntervalS,
        evapStrength,
        precipStrength,
        windStrength,
        oceanInertia,
        atmoThicknessM,
        windShear,
        surfaceDrag
    } = {}) {
        if (Number.isFinite(timeScale)) this.timeScale = Math.max(0, timeScale);
        if (Number.isFinite(readbackIntervalS)) this.readbackIntervalS = Math.max(0.01, readbackIntervalS);
        if (Number.isFinite(evapStrength)) this.evapStrength = Math.max(0, evapStrength);
        if (Number.isFinite(precipStrength)) this.precipStrength = Math.max(0, precipStrength);
        if (Number.isFinite(windStrength)) this.windStrength = Math.max(0, windStrength);
        if (Number.isFinite(oceanInertia)) this.oceanInertia = clamp01(oceanInertia);
        if (Number.isFinite(atmoThicknessM)) this.atmoThicknessM = Math.max(1000, atmoThicknessM);
        if (Number.isFinite(windShear)) this.windShear = Math.max(0, windShear);
        if (Number.isFinite(surfaceDrag)) this.surfaceDrag = Math.max(0, surfaceDrag);
    }

    getVolumeTexture() {
        return this.volumeAtlasTexture;
    }

    getVolumeMeta() {
        return {
            n: this.volumeN,
            tilesX: this.tilesX,
            tilesY: this.tilesY,
            atlasW: this.atlasW,
            atlasH: this.atlasH,
            extentM: this.planetRadiusM + this.atmoThicknessM + this.mountainHeightM,
            planetRadiusM: this.planetRadiusM,
            atmoThicknessM: this.atmoThicknessM
        };
    }

    getTexture() {
        return this.weatherTexture;
    }

    getAuxTexture() {
        return this.weatherAuxTexture;
    }

    async init({ device: injectedDevice } = {}) {
        if (injectedDevice) {
            this.device = injectedDevice;
            this.enabled = true;
        } else {
            if (typeof navigator === 'undefined' || !navigator.gpu) {
                console.warn('[WaterCycleVolumeSystem] WebGPU not available; volume weather disabled.');
                this.enabled = false;
                return;
            }

            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.warn('[WaterCycleVolumeSystem] No GPU adapter found; volume weather disabled.');
                this.enabled = false;
                return;
            }

            this.device = await adapter.requestDevice();
            this.enabled = true;
        }

        const device = this.device;
        const volumeStrideBytes = 32; // 2 vec4<f32> per voxel
        const surfaceStrideBytes = 16; // vec4<f32> per surface cell
        const surfaceStateStrideBytes = 16; // vec4<f32> per weather 2D cell (soil, snow, rain, _)
        const outBytes = this.totalOutPixels * 4; // u32 RGBA8 packed

        this.uniformBuffer = device.createBuffer({
            size: this.uniformData.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.stateBuffers = [
            device.createBuffer({
                size: this.voxelCount * volumeStrideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }),
            device.createBuffer({
                size: this.voxelCount * volumeStrideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            })
        ];

        this.surfaceBuffer = device.createBuffer({
            size: this.surfaceCellCount * surfaceStrideBytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.surfaceStateBuffers = [
            device.createBuffer({
                size: this.weatherCellCount * surfaceStateStrideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }),
            device.createBuffer({
                size: this.weatherCellCount * surfaceStateStrideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            })
        ];

        this.outputBuffer = device.createBuffer({
            size: outBytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });

        this.readbackBuffers = [
            device.createBuffer({
                size: outBytes,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            }),
            device.createBuffer({
                size: outBytes,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            })
        ];

        this.bindGroupLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }
            ]
        });

        const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayout] });

        const simModule = device.createShaderModule({ code: this._wgslSim() });
        const collapseModule = device.createShaderModule({ code: this._wgslCollapse() });

        this.pipelineSim = device.createComputePipeline({
            layout: pipelineLayout,
            compute: { module: simModule, entryPoint: 'main' }
        });

        this.pipelineCollapse = device.createComputePipeline({
            layout: pipelineLayout,
            compute: { module: collapseModule, entryPoint: 'main' }
        });

        const makeBindGroup = ({ volumeSrc, volumeDst, surfaceStateSrc, surfaceStateDst }) => device.createBindGroup({
            layout: this.bindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: this.uniformBuffer } },
                { binding: 1, resource: { buffer: volumeSrc } },
                { binding: 2, resource: { buffer: volumeDst } },
                { binding: 3, resource: { buffer: this.surfaceBuffer } },
                { binding: 4, resource: { buffer: surfaceStateSrc } },
                { binding: 5, resource: { buffer: surfaceStateDst } },
                { binding: 6, resource: { buffer: this.outputBuffer } }
            ]
        });

        this.bindGroupsSim = [
            makeBindGroup({
                volumeSrc: this.stateBuffers[0],
                volumeDst: this.stateBuffers[1],
                surfaceStateSrc: this.surfaceStateBuffers[0],
                surfaceStateDst: this.surfaceStateBuffers[1]
            }),
            makeBindGroup({
                volumeSrc: this.stateBuffers[1],
                volumeDst: this.stateBuffers[0],
                surfaceStateSrc: this.surfaceStateBuffers[1],
                surfaceStateDst: this.surfaceStateBuffers[0]
            })
        ];

        this.bindGroupsCollapse = [
            makeBindGroup({
                volumeSrc: this.stateBuffers[1], // read new state after sim ping=0
                volumeDst: this.stateBuffers[0],
                surfaceStateSrc: this.surfaceStateBuffers[0],
                surfaceStateDst: this.surfaceStateBuffers[1]
            }),
            makeBindGroup({
                volumeSrc: this.stateBuffers[0], // read new state after sim ping=1
                volumeDst: this.stateBuffers[1],
                surfaceStateSrc: this.surfaceStateBuffers[1],
                surfaceStateDst: this.surfaceStateBuffers[0]
            })
        ];

        this.ready = true;
    }

    setPlanetSurface({ heightmap, size, seaLevel, planetRadiusM } = {}) {
        if (!this.enabled || !this.ready) return;
        if (!(heightmap && size && Number.isFinite(seaLevel))) return;

        if (Number.isFinite(planetRadiusM)) this.planetRadiusM = Math.max(1, planetRadiusM);
        this.seaLevel = clamp01(seaLevel);

        const surface = buildSurfaceFields({
            heightmap,
            size,
            seaLevel: this.seaLevel,
            gridWidth: this.surfaceW,
            gridHeight: this.surfaceH
        });
        this.device.queue.writeBuffer(this.surfaceBuffer, 0, surface);

        this._resetState();
        this.hasSurface = true;
    }

    _resetState() {
        const N = this.volumeN;
        const voxelCount = this.voxelCount;
        const floatsPerVoxel = 8;
        const buf = new Float32Array(voxelCount * floatsPerVoxel);

        const seaOffsetM = (this.seaLevel - 0.5) * this.mountainHeightM;
        const baseSeaR = this.planetRadiusM + seaOffsetM;
        const extentM = this.planetRadiusM + this.atmoThicknessM + this.mountainHeightM;
        const voxelSizeM = (2 * extentM) / Math.max(N, 1);
        const halfVoxelM = voxelSizeM * 0.5;
        const baseTemp = 288;
        const lapse = 0.0065;
        const scaleH = 8000;

        const satMixingRatio = (T) => {
            const Tc = T - 273.15;
            const es_hPa = 6.112 * Math.exp((17.67 * Tc) / (Tc + 243.5));
            const e = es_hPa * 100.0;
            const p = 101325.0;
            const eps = 0.622;
            return (eps * e) / Math.max(p - e, 1.0);
        };

        let i = 0;
        for (let z = 0; z < N; z++) {
            const fz = ((z + 0.5) / N) * 2 - 1;
            const pz = fz * extentM;
            for (let y = 0; y < N; y++) {
                const fy = ((y + 0.5) / N) * 2 - 1;
                const py = fy * extentM;
                for (let x = 0; x < N; x++) {
                    const fx = ((x + 0.5) / N) * 2 - 1;
                    const px = fx * extentM;
                    const r = Math.hypot(px, py, pz);
                    const altCenter = r - baseSeaR;
                    let T = 0;
                    let qv = 0;
                    if (r > 1e-3) {
                        const dirX = px / r;
                        const dirY = py / r;
                        const dirZ = pz / r;
                        // Approximate how far the voxel extends along the radial direction (reduces altitude bias at low N).
                        const halfRadialM = halfVoxelM * (Math.abs(dirX) + Math.abs(dirY) + Math.abs(dirZ));
                        const altMin = altCenter - halfRadialM;
                        const altMax = altCenter + halfRadialM;
                        if (altMax > 0 && altMin < this.atmoThicknessM) {
                            const altEff = Math.min(Math.max(altMin, 0), this.atmoThicknessM);
                            const latFactor = Math.abs(dirY);
                            const Teq = baseTemp - 55 * latFactor - lapse * altEff;
                            T = Teq;
                            // Start humid near the surface so clouds can form quickly.
                            const qs = satMixingRatio(T);
                            const rh = altEff < 2000 ? 0.85 : 0.55;
                            qv = qs * rh * Math.exp(-altEff / (scaleH * 1.25));
                            if (altEff < 2000) {
                                // Seed a small amount of cloud water near the surface so visuals appear quickly.
                                buf[i + 2] = qs * 0.02;
                            }
                        }
                    }
                    buf[i + 0] = T;
                    buf[i + 1] = qv;
                    buf[i + 2] = 0; // qc
                    buf[i + 3] = 0; // qr
                    buf[i + 4] = 0; // p
                    buf[i + 5] = 0; // vx
                    buf[i + 6] = 0; // vy
                    buf[i + 7] = 0; // vz
                    i += floatsPerVoxel;
                }
            }
        }

        const surfaceState = new Float32Array(this.weatherCellCount * 4);
        for (let k = 0; k < this.weatherCellCount; k++) {
            surfaceState[k * 4 + 0] = 0.15; // soil
            surfaceState[k * 4 + 1] = 0.0; // snow
            surfaceState[k * 4 + 2] = 0.0; // rain
            surfaceState[k * 4 + 3] = 0.0;
        }

        this.device.queue.writeBuffer(this.stateBuffers[0], 0, buf);
        this.device.queue.writeBuffer(this.stateBuffers[1], 0, buf);
        this.device.queue.writeBuffer(this.surfaceStateBuffers[0], 0, surfaceState);
        this.device.queue.writeBuffer(this.surfaceStateBuffers[1], 0, surfaceState);

        this.simTimeS = 0;
        this.readbackTimerS = 0;
        this.ping = 0;

        this.lastDiag = { maxCloud: 0, maxRain: 0 };
    }

    update(deltaSeconds, sunDirLocal, opts = {}) {
        if (!this.enabled || !this.ready || !this.hasSurface) return;

        const dtReal = Math.min(Math.max(deltaSeconds ?? 0, 0), 0.25);
        const dtSimRaw = Number.isFinite(opts.dtSimOverride) ? opts.dtSimOverride : (dtReal * this.timeScale);
        let remainingSim = Math.max(dtSimRaw, 0);
        if (remainingSim <= 0) return;

        // Stability: keep steps small enough that advection doesn't "teleport" across many voxels.
        // Large dt makes the semi‑Lagrangian nearest sampling jump into empty (out-of-shell) voxels,
        // which looks like the weather "disappearing" instantly.
        const extentM = this.planetRadiusM + this.atmoThicknessM + this.mountainHeightM;
        const voxelSizeM = (2 * extentM) / Math.max(this.volumeN, 1);
        const maxWindMS = Math.max(5, 60 * this.windStrength);
        const cflDt = 0.25 * voxelSizeM / maxWindMS; // stricter CFL
        const maxStepSim = 10; // hard cap (sim seconds) per dispatch step
        const stepCap = Math.max(0.5, Math.min(maxStepSim, cflDt));
        const maxSubsteps = 64;

        this.readbackTimerS += dtReal;
        const device = this.device;
        const encoder = device.createCommandEncoder();

        let substeps = 0;
        while (remainingSim > 0.0 && substeps < maxSubsteps) {
            const dtSim = Math.min(remainingSim, stepCap);
            if (dtSim <= 0) break;
            remainingSim -= dtSim;
            this.simTimeS += dtSim;

            this._writeUniforms(dtSim, this.simTimeS, sunDirLocal);

            {
                const pass = encoder.beginComputePass();
                pass.setPipeline(this.pipelineSim);
                pass.setBindGroup(0, this.bindGroupsSim[this.ping]);
                const wg = 4;
                pass.dispatchWorkgroups(
                    Math.ceil(this.volumeN / wg),
                    Math.ceil(this.volumeN / wg),
                    Math.ceil(this.volumeN / wg)
                );
                pass.end();
            }
            {
                const pass = encoder.beginComputePass();
                pass.setPipeline(this.pipelineCollapse);
                pass.setBindGroup(0, this.bindGroupsCollapse[this.ping]);
                pass.dispatchWorkgroups(
                    Math.ceil(this.weatherW / 8),
                    Math.ceil(this.weatherH / 8)
                );
                pass.end();
            }

            this.ping = 1 - this.ping;
            substeps++;
        }

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
                    this.totalOutPixels * 4
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
    }

    _scheduleReadback(rbIndex) {
        this.readbackInFlight[rbIndex] = true;
        const buf = this.readbackBuffers[rbIndex];
        this.device.queue.onSubmittedWorkDone().then(async () => {
            await buf.mapAsync(GPUMapMode.READ);
            const mapped = buf.getMappedRange();
            const bytes = new Uint8Array(mapped);

            const atlasByteCount = this.atlasPixelCount * 4;
            const weatherByteCount = this.weatherCellCount * 4;
            this.volumeTextureData.set(bytes.subarray(0, atlasByteCount));
            this.weatherTextureData.set(bytes.subarray(atlasByteCount, atlasByteCount + weatherByteCount));
            this.auxTextureData.set(bytes.subarray(atlasByteCount + weatherByteCount, atlasByteCount + weatherByteCount * 2));

            // Simple diagnostics: track max cloud/rain in the atlas for visibility tuning.
            let maxCloud = 0;
            let maxRain = 0;
            for (let i = 0; i < atlasByteCount; i += 4) {
                if (this.volumeTextureData[i] > maxCloud) maxCloud = this.volumeTextureData[i];
                if (this.volumeTextureData[i + 1] > maxRain) maxRain = this.volumeTextureData[i + 1];
            }
            this.lastDiag.maxCloud = maxCloud / 255;
            this.lastDiag.maxRain = maxRain / 255;

            buf.unmap();
            this.volumeAtlasTexture.needsUpdate = true;
            this.weatherTexture.needsUpdate = true;
            this.weatherAuxTexture.needsUpdate = true;
        }).catch((err) => {
            console.warn('[WaterCycleVolumeSystem] Readback failed', err);
        }).finally(() => {
            this.readbackInFlight[rbIndex] = false;
        });
    }

    _writeUniforms(dtSim, timeSim, sunDirLocal) {
        const u = this.uniformData;

        // Define the cube extent to encompass the entire atmosphere shell.
        // This ensures voxels can represent the full atmospheric volume from surface to top.
        const extentM = this.planetRadiusM + this.atmoThicknessM + this.mountainHeightM;
        const invVoxel = this.volumeN / Math.max(2 * extentM, 1e-6);
        const resScale = Math.max(1, this.volumeN / 32);

        // [0]: N, N, N, dt
        u[0] = this.volumeN;
        u[1] = this.volumeN;
        u[2] = this.volumeN;
        u[3] = dtSim;

        // [1]: time, extentM, invVoxelSize, planetRadiusM
        u[4] = timeSim;
        u[5] = extentM;
        u[6] = invVoxel;
        u[7] = this.planetRadiusM;

        // [2]: atmoThicknessM, baseTempK, lapse, scaleHeightM
        u[8] = this.atmoThicknessM;
        u[9] = 288;
        u[10] = 0.0065;
        u[11] = 8000;

        // [3]: sunDir.xyz, omega
        u[12] = sunDirLocal?.x ?? 0;
        u[13] = sunDirLocal?.y ?? 1;
        u[14] = sunDirLocal?.z ?? 0;
        u[15] = 2 * Math.PI / 86400;

        // [4]: solarHeatingK, tempRelax, evapOcean, evapLand
        u[16] = 18;
        u[17] = 1 / 21600;
        // Stronger evaporation so the system rapidly humidifies (more at higher res).
        const resScale2 = resScale * resScale;
        const resScaleExp = Math.pow(resScale, 3.0);
        u[18] = 4.5e-4 * this.evapStrength * resScaleExp;
        u[19] = 1.6e-4 * this.evapStrength * resScaleExp;

        // [5]: condenseRate, precipRate, rainDecay, cloudEvap
        // Easier cloud formation and very slow rain-out to keep clouds visible.
        u[20] = (1 / 200) * resScaleExp;
        // Autoconversion slows down aggressively with resolution so small voxels keep cloud water.
        const prBase = 1.0 / 240000.0;
        const prScale = Math.pow(resScale, 3.0);
        u[21] = prBase * this.precipStrength / prScale;
        u[22] = 1 / 259200; // slower rain decay
        u[23] = 1 / 259200; // slower cloud evaporation

        // [6]: windRelax, windDrag, coriolisMin, maxWind
        u[24] = (1 / 7200) * this.windStrength;
        u[25] = 1 / 14400;
        u[26] = 2e-5;
        u[27] = 60 * this.windStrength;

        // [7]: pressureTempCoeff, pressureVaporCoeff, pressureSmooth, fallSpeed
        u[28] = 120;
        u[29] = 45000;
        u[30] = 1 / 7200;
        // Reduce fall speed so precipitation doesn't clear the column too quickly.
        u[31] = 0.05 / resScaleExp;

        // [8]: surfaceW, surfaceH, weatherW, weatherH
        u[32] = this.surfaceW;
        u[33] = this.surfaceH;
        u[34] = this.weatherW;
        u[35] = this.weatherH;

        // [9]: atlasW, atlasH, tilesX, tilesY
        u[36] = this.atlasW;
        u[37] = this.atlasH;
        u[38] = this.tilesX;
        u[39] = this.tilesY;

        // [10]: weatherOffset, auxOffset, oceanInertia, unused
        u[40] = this.weatherOffset;
        u[41] = this.auxOffset;
        u[42] = this.oceanInertia;
        u[43] = 0;

        // [11]: reserved
        // Mountain height scale (meters) used to convert surface elev01 -> meters for terrain-aware boundaries.
        u[44] = this.mountainHeightM;
        // Sea level offset in meters so oceans start at sea surface, not planet base radius.
        u[45] = (this.seaLevel - 0.5) * this.mountainHeightM;
        u[46] = this.windShear;
        u[47] = this.surfaceDrag;

        this.device.queue.writeBuffer(this.uniformBuffer, 0, u);
    }

    _wgslSim() {
        return /* wgsl */`
struct Voxel {
  a: vec4<f32>, // T, qv, qc, qr
  b: vec4<f32>, // p, vx, vy, vz
};

@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 12>;
@group(0) @binding(1) var<storage, read> stateSrc: array<Voxel>;
@group(0) @binding(2) var<storage, read_write> stateDst: array<Voxel>;
@group(0) @binding(3) var<storage, read> surface: array<vec4<f32>>; // ocean, elev01, rawHeight, _
@group(0) @binding(4) var<storage, read> surfaceStateSrc: array<vec4<f32>>; // soil, snow, rain, _
@group(0) @binding(5) var<storage, read_write> surfaceStateDst: array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> outPixels: array<u32>;

fn N() -> u32 { return u32(params[0].x + 0.5); }
fn dt() -> f32 { return params[0].w; }
fn timeS() -> f32 { return params[1].x; }
fn extentM() -> f32 { return params[1].y; }
fn invVoxelSize() -> f32 { return params[1].z; }
fn planetRadiusM() -> f32 { return params[1].w; }
fn seaOffsetM() -> f32 { return params[11].y; }

fn atmoThicknessM() -> f32 { return params[2].x; }
fn baseTempK() -> f32 { return params[2].y; }
fn lapseRate() -> f32 { return params[2].z; }
fn scaleHeightM() -> f32 { return params[2].w; }

fn sunDir() -> vec3<f32> { return params[3].xyz; }
fn omega() -> f32 { return params[3].w; }

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
fn fallSpeed() -> f32 { return params[7].w; }

fn surfaceW() -> u32 { return u32(params[8].x + 0.5); }
fn surfaceH() -> u32 { return u32(params[8].y + 0.5); }

fn atlasW() -> u32 { return u32(params[9].x + 0.5); }
fn tilesX() -> u32 { return u32(params[9].z + 0.5); }

fn oceanInertia() -> f32 { return clamp(params[10].z, 0.05, 1.0); }
fn mountainHeightM() -> f32 { return max(params[11].x, 0.0); }
fn windShear() -> f32 { return max(params[11].z, 0.0); }
fn surfaceDrag() -> f32 { return clamp(params[11].w, 0.05, 2.5); }

fn idx3(x: u32, y: u32, z: u32) -> u32 {
  let n = N();
  return (z * n + y) * n + x;
}

fn clampU(v: i32, lo: i32, hi: i32) -> u32 {
  return u32(clamp(v, lo, hi));
}

fn posFromIndex(x: u32, y: u32, z: u32) -> vec3<f32> {
  let n = f32(N());
  let fx = ((f32(x) + 0.5) / n) * 2.0 - 1.0;
  let fy = ((f32(y) + 0.5) / n) * 2.0 - 1.0;
  let fz = ((f32(z) + 0.5) / n) * 2.0 - 1.0;
  return vec3<f32>(fx, fy, fz) * extentM();
}

fn uvwFromPos(pos: vec3<f32>) -> vec3<f32> {
  return clamp(pos / extentM() * 0.5 + vec3<f32>(0.5), vec3<f32>(0.0), vec3<f32>(0.999999));
}

fn sampleNearest(pos: vec3<f32>) -> Voxel {
  let n = f32(N());
  let uvw = uvwFromPos(pos);
  let x = clampU(i32(floor(uvw.x * n)), 0, i32(N()) - 1);
  let y = clampU(i32(floor(uvw.y * n)), 0, i32(N()) - 1);
  let z = clampU(i32(floor(uvw.z * n)), 0, i32(N()) - 1);
  return stateSrc[idx3(x, y, z)];
}

fn surfaceIndexFromDir(dir: vec3<f32>) -> u32 {
  let u = atan2(dir.z, dir.x) / (2.0 * 3.14159265) + 0.5;
  let v = asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265 + 0.5;
  let uu = fract(u);
  let vv = clamp(v, 0.0, 0.999999);
  let x = u32(uu * f32(surfaceW()));
  let y = u32(vv * f32(surfaceH()));
  return y * surfaceW() + x;
}

fn groundAltFromSurface(s: vec4<f32>) -> f32 {
  let ocean = clamp(s.x, 0.0, 1.0);
  let elev01 = clamp(s.y, 0.0, 1.0);
  // Oceans sit at sea level offset; land uses elevation meters.
  return mix(seaOffsetM(), elev01 * mountainHeightM(), 1.0 - ocean);
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

// Simplex noise for turbulent pressure forcing
fn mod289_3(x: vec3<f32>) -> vec3<f32> { return x - floor(x * (1.0 / 289.0)) * 289.0; }
fn mod289_4(x: vec4<f32>) -> vec4<f32> { return x - floor(x * (1.0 / 289.0)) * 289.0; }
fn permute(x: vec4<f32>) -> vec4<f32> { return mod289_4(((x * 34.0) + 1.0) * x); }
fn taylorInvSqrt(r: vec4<f32>) -> vec4<f32> { return 1.79284291400159 - 0.85373472095314 * r; }

fn snoise(v: vec3<f32>) -> f32 {
  let C = vec2<f32>(1.0/6.0, 1.0/3.0);
  let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);
  
  var i = floor(v + dot(v, vec3<f32>(C.y, C.y, C.y)));
  let x0 = v - i + dot(i, vec3<f32>(C.x, C.x, C.x));
  
  let g = step(x0.yzx, x0.xyz);
  let l = 1.0 - g;
  let i1 = min(g.xyz, l.zxy);
  let i2 = max(g.xyz, l.zxy);
  
  let x1 = x0 - i1 + vec3<f32>(C.x, C.x, C.x);
  let x2 = x0 - i2 + vec3<f32>(C.y, C.y, C.y);
  let x3 = x0 - D.yyy;
  
  i = mod289_3(i);
  let p = permute(permute(permute(
    i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0));
  
  let n_ = 0.142857142857;
  let ns = n_ * D.wyz - D.xzx;
  
  let j = p - 49.0 * floor(p * ns.z * ns.z);
  let x_ = floor(j * ns.z);
  let y_ = floor(j - 7.0 * x_);
  
  let x = x_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
  let y = y_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
  let h = 1.0 - abs(x) - abs(y);
  
  let b0 = vec4<f32>(x.xy, y.xy);
  let b1 = vec4<f32>(x.zw, y.zw);
  
  let s0 = floor(b0) * 2.0 + 1.0;
  let s1 = floor(b1) * 2.0 + 1.0;
  let sh = -step(h, vec4<f32>(0.0, 0.0, 0.0, 0.0));
  
  let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw * sh.zzww;
  
  var p0 = vec3<f32>(a0.xy, h.x);
  var p1 = vec3<f32>(a0.zw, h.y);
  var p2 = vec3<f32>(a1.xy, h.z);
  var p3 = vec3<f32>(a1.zw, h.w);
  
  let norm = taylorInvSqrt(vec4<f32>(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  
  var m = max(vec4<f32>(0.6, 0.6, 0.6, 0.6) - vec4<f32>(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), vec4<f32>(0.0, 0.0, 0.0, 0.0));
  m = m * m;
  return 42.0 * dot(m * m, vec4<f32>(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Multi-octave turbulent noise
fn turbulentNoise(p: vec3<f32>, t: f32) -> f32 {
  var n = 0.0;
  // Large-scale pressure systems
  n += snoise(p * 2.0 + vec3<f32>(t * 0.003, 0.0, t * 0.002)) * 1.0;
  // Medium-scale disturbances  
  n += snoise(p * 4.0 + vec3<f32>(t * 0.007, t * 0.005, 0.0)) * 0.5;
  // Smaller turbulent eddies
  n += snoise(p * 8.0 + vec3<f32>(0.0, t * 0.01, t * 0.008)) * 0.25;
  return n;
}

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let n = N();
  if (gid.x >= n || gid.y >= n || gid.z >= n) { return; }

  let i = idx3(gid.x, gid.y, gid.z);
  let pos = posFromIndex(gid.x, gid.y, gid.z);
  let r = length(pos);
  if (r < 1e-3) {
    stateDst[i] = Voxel(vec4<f32>(0.0), vec4<f32>(0.0));
    return;
  }
  let dir = pos / r;

  // Surface coupling (ocean mask + soil/snow from 2D surface state).
  let surfIdx = surfaceIndexFromDir(dir);
  let surf = surface[surfIdx];
  let ocean = clamp(surf.x, 0.0, 1.0);
  let ss = surfaceStateSrc[surfIdx];
  let soil = clamp(ss.x, 0.0, 1.0);
  let snow = clamp(ss.y, 0.0, 1.0);

  // Terrain-aware ground radius so we don't simulate atmosphere under sea level or inside mountains.
  let groundR = planetRadiusM() + groundAltFromSurface(surf);
  let altCenter = r - groundR;
  // Approx radial reach of this voxel along the radial direction (reduces near-surface altitude bias at low N).
  let halfVoxelM = 0.5 / max(invVoxelSize(), 1e-9);
  let halfRadialM = halfVoxelM * (abs(dir.x) + abs(dir.y) + abs(dir.z));
  let altMin = altCenter - halfRadialM;
  let altMax = altCenter + halfRadialM;
  let inAtmo = (altMax > 0.0) && (altMin < atmoThicknessM());
  let altEff = clamp(altMin, 0.0, atmoThicknessM());

  // Outside atmosphere shell: damp to zero quickly to avoid garbage.
  if (!inAtmo) {
    stateDst[i] = Voxel(vec4<f32>(0.0), vec4<f32>(0.0));
    // Still write atlas pixel so we don't leave stale data in used voxels.
    let tx = gid.z % tilesX();
    let ty = gid.z / tilesX();
    let ax = tx * n + gid.x;
    let ay = ty * n + gid.y;
    outPixels[ay * atlasW() + ax] = packRGBA8(0.0, 0.0, 0.5, 0.0);
    return;
  }

  let s0 = stateSrc[i];
  let vel0 = s0.b.yzw;

  // Semi-Lagrangian advection (nearest for now; stable + fast).
  let posBack = pos - vel0 * dt();
  let sAdv = sampleNearest(posBack);

  // Rain sedimentation: advect with additional radial fall speed.
  let posBackRain = pos - (vel0 - dir * fallSpeed()) * dt();
  let sRain = sampleNearest(posBackRain);

  var T = sAdv.a.x;
  var qv = sAdv.a.y;
  var qc = sAdv.a.z;
  var qr = sRain.a.w * exp(-rainDecay() * dt());
  var p = sAdv.b.x;
  var vel = sAdv.b.yzw;

  // Radiative equilibrium temperature proxy.
  let insolation = max(dot(dir, normalize(sunDir())), 0.0);
  // Simple cloud shading: attenuate insolation by in-column cloud/rain.
  let cloudShade = clamp(qc * 3.0 + qr * 6.0, 0.0, 0.7);
  // Keep a floor so the sun-facing half still evaporates when the sun is low.
  let insFloor = max(insolation, 0.2) * (1.0 - cloudShade);
  let latFactor = abs(dir.y);
  let snowCover = snow * (1.0 - ocean);
  var albedoBase = mix(0.22, 0.06, ocean);
  // Wet land darkens and gains thermal mass.
  let wetFactor = soil * (1.0 - ocean);
  albedoBase = mix(albedoBase, 0.12, wetFactor);
  let albedo = mix(albedoBase, 0.75, snowCover);
  let Teq = baseTempK() - 55.0 * latFactor + solarHeatingK() * insFloor * (1.0 - albedo) - (lapseRate() * altEff);
  let relaxRate = tempRelax() * mix(1.0, mix(0.65, oceanInertia(), ocean), wetFactor);
  T = mix(T, Teq, clamp(dt() * relaxRate, 0.0, 1.0));

  // Convergence lift proxy (uses full divergence as a cheap stand-in).
  let inv2dx = 0.5 * invVoxelSize();
  let xL = clampU(i32(gid.x) - 1, 0, i32(n) - 1);
  let xR = clampU(i32(gid.x) + 1, 0, i32(n) - 1);
  let yD = clampU(i32(gid.y) - 1, 0, i32(n) - 1);
  let yU = clampU(i32(gid.y) + 1, 0, i32(n) - 1);
  let zB = clampU(i32(gid.z) - 1, 0, i32(n) - 1);
  let zF = clampU(i32(gid.z) + 1, 0, i32(n) - 1);

  let vL = stateSrc[idx3(xL, gid.y, gid.z)].b.yzw;
  let vR = stateSrc[idx3(xR, gid.y, gid.z)].b.yzw;
  let vD = stateSrc[idx3(gid.x, yD, gid.z)].b.yzw;
  let vU = stateSrc[idx3(gid.x, yU, gid.z)].b.yzw;
  let vB = stateSrc[idx3(gid.x, gid.y, zB)].b.yzw;
  let vF = stateSrc[idx3(gid.x, gid.y, zF)].b.yzw;

  let div = (vR.x - vL.x) * inv2dx + (vU.y - vD.y) * inv2dx + (vF.z - vB.z) * inv2dx;
  let wConv = (-div) * scaleHeightM();
  
  // Orographic lift from terrain slope projected into local east/north wind.
  let sw = surfaceW();
  let sh = surfaceH();
  let sx = surfIdx % sw;
  let sy = surfIdx / sw;
  let xLs = (sx + sw - 1u) % sw;
  let xRs = (sx + 1u) % sw;
  let yDs = u32(max(i32(sy) - 1, 0));
  let yUs = u32(min(i32(sy) + 1, i32(sh) - 1));

  let altL = groundAltFromSurface(surface[sy * sw + xLs]);
  let altR = groundAltFromSurface(surface[sy * sw + xRs]);
  let altD = groundAltFromSurface(surface[yDs * sw + sx]);
  let altU = groundAltFromSurface(surface[yUs * sw + sx]);

  let cosLat = max(sqrt(max(1.0 - dir.y * dir.y, 0.0)), 0.08);
  let dxM = 2.0 * 3.14159265 * planetRadiusM() * cosLat / f32(sw);
  let dyM = 3.14159265 * planetRadiusM() / f32(sh);
  let dhdx = (altR - altL) * (0.5 / max(dxM, 1.0));
  let dhdy = (altU - altD) * (0.5 / max(dyM, 1.0));

  let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(dir.y) > 0.99);
  let east = normalize(cross(up, dir));
  let north = normalize(cross(dir, east));
  let velHoriz = vel - dir * dot(vel, dir);
  let uEast = dot(velHoriz, east);
  let vNorth = dot(velHoriz, north);
  let orogMask = exp(-altEff / 4500.0);
  let wOrog = (uEast * dhdx + vNorth * dhdy) * orogMask;

  let wLift = clamp(wConv + wOrog, -20.0, 20.0);
  T -= 0.0098 * wLift * dt();

  // Evaporation near surface.
  let qs = satMixingRatio(T);
  let deficit = max(0.0, qs - qv);
  let nearSurface = select(0.0, 1.0, altEff < 2000.0);
  qv += nearSurface * ocean * evapOcean() * insFloor * deficit * dt();
  qv += nearSurface * (1.0 - ocean) * evapLand() * insFloor * soil * (1.0 - 0.85 * snowCover) * dt();
  // Keep a minimum humidity reservoir near the surface so it can't dry out completely.
  let qMin = qs * 0.35;
  qv = max(qv, nearSurface * qMin + (1.0 - nearSurface) * qv);
  // Seed a tiny cloud amount near the surface to kickstart visuals/stability.
  let seedQc = nearSurface * insFloor * (0.0015 + 0.0015 * ocean);
  let take = min(seedQc, qv * 0.7);
  qv -= take;
  qc += take;

  // Condensation / evaporation of cloud water.
  let latentK = 2000.0;
  if (qv > qs) {
    let cond = (qv - qs) * clamp(dt() * condenseRate(), 0.0, 1.0);
    qv -= cond;
    qc += cond;
    T += latentK * cond;
  } else if (qc > 0.0) {
    let evap = min(qs - qv, qc) * clamp(dt() * cloudEvapRate(), 0.0, 1.0);
    qv += evap;
    qc -= evap;
    T -= latentK * evap;
  }

  // Precipitation generation.
  // Threshold tuned so small clouds survive; autoconversion is slow.
  let qcThresh = 0.0015;
  let pr = max(0.0, qc - qcThresh) * clamp(dt() * precipRate(), 0.0, 1.0);
  qc -= pr;
  qr += pr;

  // Pressure relax toward a T/q-driven target.
  // Base pressure centered at 0 - warm/moist = low (negative), cold/dry = high (positive)
  // REDUCED coefficients to keep pressure in a sensible range [-3000, +3000]
  let tempAnomaly = (T - baseTempK());  // + = warm, - = cold
  let moistAnomaly = qv * 500.0;         // Reduced: More vapor = lower pressure
  let altPenalty = altEff * 0.01;        // Reduced: Higher = lower pressure
  let pPhysics = -tempAnomaly * 10.0 - moistAnomaly - altPenalty;
  
  // Turbulent noise for weather systems - REDUCED strength to stay in range
  let turbStrength = 2500.0;  // Reduced from 5000
  let noisePos = dir * 4.0;   // Higher spatial frequency for more distinct cells
  let noiseTime = timeS() * 0.001;  // Faster evolution  
  let pTurb = turbulentNoise(noisePos, noiseTime) * turbStrength;
  
  // Hadley cell structure - latitude-dependent pressure bands
  // Subtropical highs at ~30°, polar highs at poles, ITCZ low at equator
  let latAbs = abs(dir.y);
  // Subtropical high pressure belt (stronger)
  let subtropicalHigh = exp(-pow((latAbs - 0.5) / 0.2, 2.0)) * 1500.0;
  // Equatorial low (ITCZ)
  let itczLow = exp(-pow(latAbs / 0.15, 2.0)) * -1200.0;
  // Polar high (weaker)
  let polarHigh = smoothstep(0.7, 0.95, latAbs) * 800.0;
  let hadleyP = subtropicalHigh + itczLow + polarHigh;
  
  let pEq = pPhysics + pTurb + hadleyP;
  
  // Faster relaxation so pressure systems develop quickly
  p = mix(p, pEq, clamp(dt() * pSmooth() * 3.0, 0.0, 1.0));

  // Wind from geostrophic balance in the local tangent plane + weak ageostrophic convergence.
  let pL = stateSrc[idx3(xL, gid.y, gid.z)].b.x;
  let pR = stateSrc[idx3(xR, gid.y, gid.z)].b.x;
  let pD = stateSrc[idx3(gid.x, yD, gid.z)].b.x;
  let pU = stateSrc[idx3(gid.x, yU, gid.z)].b.x;
  let pB = stateSrc[idx3(gid.x, gid.y, zB)].b.x;
  let pF = stateSrc[idx3(gid.x, gid.y, zF)].b.x;
  let dpdx = (pR - pL) * inv2dx;
  let dpdy = (pU - pD) * inv2dx;
  let dpdz = (pF - pB) * inv2dx;
  let gradP = vec3<f32>(dpdx, dpdy, dpdz);
  let gradH = gradP - dir * dot(gradP, dir);

  var f = 2.0 * omega() * dir.y;
  if (abs(f) < coriolisMin()) {
    f = select(-coriolisMin(), coriolisMin(), f >= 0.0);
  }
  let rho = 1.2;
  let vGeo = cross(dir, gradH) * (1.0 / (rho * f));
  let vAgeo = -gradH * 0.012;
  let vTarget = vGeo + vAgeo;

  vel = mix(vel, vTarget, clamp(dt() * windRelax(), 0.0, 1.0));
  vel *= exp(-windDrag() * dt());
  let altFrac = clamp(altEff / max(atmoThicknessM(), 1e-3), 0.0, 1.0);
  // Boundary-layer drag slows near-surface winds; upper levels can accelerate into jets.
  let blDrag = mix(surfaceDrag(), 1.0, smoothstep(0.05, 0.4, altFrac));
  let jetGain = mix(0.85, 1.25, smoothstep(0.15, 0.9, altFrac));
  vel *= blDrag * jetGain;
  // Turn winds with height to create vertical shear/veering.
  let veer = (altFrac - 0.35) * windShear();
  let vHoriz = vel - dir * dot(vel, dir);
  let vEast0 = dot(vHoriz, east);
  let vNorth0 = dot(vHoriz, north);
  let ca = cos(veer);
  let sa = sin(veer);
  let vEast = vEast0 * ca - vNorth0 * sa;
  let vNorthShear = vEast0 * sa + vNorth0 * ca;
  let vSheared = east * vEast + north * vNorthShear;
  let vVert = dir * dot(vel, dir);
  vel = vSheared + vVert;
  // Add a gentle vertical component from vertical pressure gradients to build stacked systems.
  let wP = clamp(-dpdz * 0.0015, -8.0, 8.0);
  vel += dir * wP;
  // Add a small vertical component for convection/uplift so moisture can become volumetric.
  let topFrac = clamp(altEff / max(atmoThicknessM(), 1e-3), 0.0, 1.0);
  let wDamp = 1.0 - smoothstep(0.70, 1.0, topFrac);
  vel += dir * clamp(wLift, -8.0, 8.0) * 0.25 * wDamp;
  let maxAltWind = mix(maxWind() * 0.65, maxWind() * 1.35, smoothstep(0.08, 0.95, altFrac));
  let sp = length(vel);
  if (sp > maxAltWind) {
    vel *= maxAltWind / max(sp, 1e-3);
  }

  // Clamp.
  T = clamp(T, 180.0, 330.0);
  qv = clamp(qv, 0.0, 0.05);
  qc = clamp(qc, 0.0, 0.02);
  qr = clamp(qr, 0.0, 0.02);

  stateDst[i] = Voxel(vec4<f32>(T, qv, qc, qr), vec4<f32>(p, vel));

  // Pack volume atlas with wind tell-tail visualization
  let scaleN = max(1.0, 64.0 / f32(N())); // higher res → scale up visibility
  let cloud01 = clamp(qc * 8000.0 * scaleN, 0.0, 1.0);
  let rain01 = clamp(qr * 800.0, 0.0, 1.0);
  let p01 = clamp(0.5 + p * (1.0 / 6000.0), 0.0, 1.0);
  let rh01 = clamp(select(0.0, qv / max(qs, 1e-6), qs > 0.0), 0.0, 1.0);

  let tx = gid.z % tilesX();
  let ty = gid.z / tilesX();
  let ax = tx * n + gid.x;
  let ay = ty * n + gid.y;
  
  // Wind tell-tail: draw lines showing wind direction, colored by pressure
  let windMag = length(vel);
  let windSpeed01 = clamp(windMag / maxWind(), 0.0, 1.0);
  
  // Pressure coloring: RED = low pressure (cyclone), BLUE = high pressure (anticyclone)
  let lowP = clamp((0.5 - p01) * 4.0, 0.0, 1.0);   // Red intensity for low pressure
  let highP = clamp((p01 - 0.5) * 4.0, 0.0, 1.0);  // Blue intensity for high pressure
  
  // Base color shows pressure system type vividly
  var baseR = lowP * 0.9 + highP * 0.1;     // Red for low pressure
  var baseG = 0.15 + windSpeed01 * 0.3;      // Green shows wind strength
  var baseB = highP * 0.9 + lowP * 0.1;     // Blue for high pressure
  
  // Brighten based on wind magnitude
  let brightness = 0.3 + windSpeed01 * 0.7;
  baseR = baseR * brightness;
  baseG = baseG * brightness;
  baseB = baseB * brightness;
  
  // Add cloud overlay (white)
  baseR = baseR + cloud01 * 0.5;
  baseG = baseG + cloud01 * 0.5;
  baseB = baseB + cloud01 * 0.5;
  
  // Draw the base cell
  outPixels[ay * atlasW() + ax] = packRGBA8(baseR, baseG, baseB, 1.0);
  
  // Draw wind tell-tail as bright line extending from this cell in wind direction
  // Only draw if this is a "leader" cell (every other cell draws the tail)
  if (windMag > 1.0 && (gid.x % 2u == 0u) && (gid.y % 2u == 0u)) {
    // Normalize wind direction in 3D space, project to XY of voxel grid
    let windDir = vel / max(windMag, 1e-6);
    
    // Length of tail based on wind speed (1-3 cells)
    let tailLen = 1u + u32(windSpeed01 * 2.0);
    
    // Draw the tail line - bright white/yellow
    let tailR = 1.0;
    let tailG = 0.9;
    let tailB = 0.2;
    
    for (var step: u32 = 1u; step <= tailLen; step = step + 1u) {
      // Calculate tail position based on wind direction
      let offsetX = i32(round(windDir.x * f32(step) * 1.5));
      let offsetY = i32(round(windDir.y * f32(step) * 1.5));
      
      let tailX = i32(gid.x) + offsetX;
      let tailY = i32(gid.y) + offsetY;
      
      // Bounds check within this tile
      if (tailX >= 0 && tailX < i32(n) && tailY >= 0 && tailY < i32(n)) {
        let tailAx = tx * n + u32(tailX);
        let tailAy = ty * n + u32(tailY);
        
        // Fade tail brightness with distance
        let fade = 1.0 - f32(step) / f32(tailLen + 1u);
        outPixels[tailAy * atlasW() + tailAx] = packRGBA8(
          tailR * fade + baseR * (1.0 - fade),
          tailG * fade + baseG * (1.0 - fade),
          tailB * fade + baseB * (1.0 - fade),
          1.0
        );
      }
    }
  }

}
        `;
    }

    _wgslCollapse() {
        return /* wgsl */`
struct Voxel {
  a: vec4<f32>, // T, qv, qc, qr
  b: vec4<f32>, // p, vx, vy, vz
};

@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 12>;
@group(0) @binding(1) var<storage, read> stateSrc: array<Voxel>;
@group(0) @binding(2) var<storage, read_write> stateDst: array<Voxel>;
@group(0) @binding(3) var<storage, read> surface: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> surfaceStateSrc: array<vec4<f32>>; // soil, snow, rain, _
@group(0) @binding(5) var<storage, read_write> surfaceStateDst: array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> outPixels: array<u32>;

fn N() -> u32 { return u32(params[0].x + 0.5); }
fn dt() -> f32 { return params[0].w; }
fn extentM() -> f32 { return params[1].y; }
fn invVoxelSize() -> f32 { return params[1].z; }
fn planetRadiusM() -> f32 { return params[1].w; }

fn atmoThicknessM() -> f32 { return params[2].x; }
fn sunDir() -> vec3<f32> { return params[3].xyz; }

fn maxWind() -> f32 { return params[6].w; }

fn surfaceW() -> u32 { return u32(params[8].x + 0.5); }
fn surfaceH() -> u32 { return u32(params[8].y + 0.5); }
fn weatherW() -> u32 { return u32(params[8].z + 0.5); }
fn weatherH() -> u32 { return u32(params[8].w + 0.5); }

fn weatherOffset() -> u32 { return u32(params[10].x + 0.5); }
fn auxOffset() -> u32 { return u32(params[10].y + 0.5); }
fn mountainHeightM() -> f32 { return max(params[11].x, 0.0); }
fn seaOffsetM() -> f32 { return params[11].y; }

fn idx3(x: u32, y: u32, z: u32) -> u32 {
  let n = N();
  return (z * n + y) * n + x;
}

fn clampU(v: i32, lo: i32, hi: i32) -> u32 {
  return u32(clamp(v, lo, hi));
}

fn uvwFromPos(pos: vec3<f32>) -> vec3<f32> {
  return clamp(pos / extentM() * 0.5 + vec3<f32>(0.5), vec3<f32>(0.0), vec3<f32>(0.999999));
}

fn sampleNearest(pos: vec3<f32>) -> Voxel {
  let n = f32(N());
  let uvw = uvwFromPos(pos);
  let x = clampU(i32(floor(uvw.x * n)), 0, i32(N()) - 1);
  let y = clampU(i32(floor(uvw.y * n)), 0, i32(N()) - 1);
  let z = clampU(i32(floor(uvw.z * n)), 0, i32(N()) - 1);
  return stateSrc[idx3(x, y, z)];
}

fn surfaceIndexFromDir(dir: vec3<f32>) -> u32 {
  let u = atan2(dir.z, dir.x) / (2.0 * 3.14159265) + 0.5;
  let v = asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265 + 0.5;
  let uu = fract(u);
  let vv = clamp(v, 0.0, 0.999999);
  let x = u32(uu * f32(surfaceW()));
  let y = u32(vv * f32(surfaceH()));
  return y * surfaceW() + x;
}

fn groundAltFromSurface(s: vec4<f32>) -> f32 {
  let ocean = clamp(s.x, 0.0, 1.0);
  let elev01 = clamp(s.y, 0.0, 1.0);
  // Must match sim shader: oceans at sea level offset, land at elevation
  return mix(seaOffsetM(), elev01 * mountainHeightM(), 1.0 - ocean);
}

fn packRGBA8(r: f32, g: f32, b: f32, a: f32) -> u32 {
  let R = u32(clamp(r, 0.0, 1.0) * 255.0 + 0.5);
  let G = u32(clamp(g, 0.0, 1.0) * 255.0 + 0.5);
  let B = u32(clamp(b, 0.0, 1.0) * 255.0 + 0.5);
  let A = u32(clamp(a, 0.0, 1.0) * 255.0 + 0.5);
  return (A << 24u) | (B << 16u) | (G << 8u) | R;
}

fn directionFromLatLon(lat: f32, lon: f32) -> vec3<f32> {
  let cl = cos(lat);
  return vec3<f32>(cl * cos(lon), sin(lat), cl * sin(lon));
}

fn makeBasis(dir: vec3<f32>) -> mat3x3<f32> {
  let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(dir.y) > 0.99);
  let east = normalize(cross(up, dir));
  let north = normalize(cross(dir, east));
  return mat3x3<f32>(east, north, dir);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= weatherW() || gid.y >= weatherH()) { return; }
  let w = weatherW();
  let h = weatherH();
  let i2 = gid.y * w + gid.x;

  let u = (f32(gid.x) + 0.5) / f32(w);
  let v = (f32(gid.y) + 0.5) / f32(h);
  let lat = (v - 0.5) * 3.14159265;
  let lon = (u - 0.5) * 2.0 * 3.14159265;
  let dir = directionFromLatLon(lat, lon);

  let surfIdx = surfaceIndexFromDir(dir);
  let surf = surface[surfIdx];
  let ocean = clamp(surf.x, 0.0, 1.0);
  var groundR = planetRadiusM() + groundAltFromSurface(surf);
  // Ensure ocean columns start at sea surface, not base planet radius.
  groundR = max(groundR, planetRadiusM() + seaOffsetM());

  let ss0 = surfaceStateSrc[i2];
  var soil = clamp(ss0.x, 0.0, 1.0);
  var snow = clamp(ss0.y, 0.0, 1.0);
  var rain = clamp(ss0.z, 0.0, 0.02);
  var runoff = clamp(ss0.w, 0.0, 1.0);

  // Integrate along the column to form 2D maps.
  var maxQc = 0.0;
  var maxQr = 0.0;
  var pSum = 0.0;
  var pCount = 0.0;
  var Tsurf = 280.0;
  var velSample = vec3<f32>(0.0);

  // Sample more layers so thin clouds are captured in the 2D maps.
  // Also average pressure across the lower atmosphere for a stable signal.
  let steps: u32 = 32u;
  for (var k: u32 = 0u; k < steps; k = k + 1u) {
    let t = (f32(k) + 0.5) / f32(steps);
    let r = groundR + t * atmoThicknessM();
    let pos = dir * r;
    let s = sampleNearest(pos);
    maxQc = max(maxQc, s.a.z);
    maxQr = max(maxQr, s.a.w);
    if (k == 0u) { Tsurf = s.a.x; }
    // Average pressure across lower half of atmosphere for more stable signal
    if (k < steps / 2u) { 
      pSum += s.b.x; 
      pCount += 1.0;
    }
    if (k == 3u) { velSample = s.b.yzw; }
  }
  let pMid = select(0.0, pSum / pCount, pCount > 0.0);

  // If 3D sampling didn't get good pressure data, use latitude-based Hadley pattern directly
  // This ensures the 2D texture shows proper pressure variation even with coarse voxels
  let latAbs = abs(dir.y);
  // Subtropical high pressure belt at ~30° latitude
  let subtropicalHigh = exp(-pow((latAbs - 0.5) / 0.2, 2.0)) * 1500.0;
  // Equatorial low (ITCZ)
  let itczLow = exp(-pow(latAbs / 0.15, 2.0)) * -1200.0;
  // Polar high
  let polarHigh = smoothstep(0.7, 0.95, latAbs) * 800.0;
  let hadleyP = subtropicalHigh + itczLow + polarHigh;
  
  // Blend sampled pressure with analytical Hadley pattern
  // If pMid is near zero (no valid voxel data), use pure Hadley
  let pMidValid = select(0.0, 1.0, abs(pMid) > 10.0);
  let pFinal = mix(hadleyP, pMid, pMidValid * 0.7);

  // Update surface rain/soil/snow (simple persistence).
  let liquid = smoothstep(271.15, 275.15, Tsurf);
  let prLiquid = maxQr * liquid;
  let prSnow = maxQr * (1.0 - liquid);
  rain = rain * exp(-params[5].z * dt()) + prLiquid; // rainDecay in params[5].z
  soil = clamp(soil + prLiquid * (1.0 - ocean) * 400.0, 0.0, 1.0);
  soil *= exp(-dt() * (1.0 / 86400.0));
  snow = clamp(snow + prSnow * (1.0 - ocean) * 650.0, 0.0, 1.0);

  let insolation = max(dot(dir, normalize(sunDir())), 0.0);
  let meltFactor = clamp((Tsurf - 272.15) / 6.0 + insolation * 0.15, 0.0, 1.0);
  let melt = min(snow, snow * meltFactor * dt() * (1.0 / 21600.0));
  snow -= melt;
  soil = clamp(soil + melt * (1.0 - ocean) * 0.65, 0.0, 1.0);
  runoff = clamp(runoff + prLiquid * 120.0 + prSnow * 80.0 + melt * 60.0, 0.0, 5.0);
  runoff *= exp(-dt() * (1.0 / 172800.0)); // 2-day decay
  // Glacier formation proxy: excess snow turns into slow-decay runoff/glacier store.
  let glacier = max(0.0, snow - 1.0);
  snow = min(snow, 1.0);
  runoff = min(runoff + glacier * 0.2, 5.0);

  surfaceStateDst[i2] = vec4<f32>(soil, snow, rain, runoff);

  // Main weather map (cloud, rain, pressure, soil).
  // If column is very humid but maxQc is tiny, boost cloud to make it visible.
  var cloud01 = clamp(maxQc * 600.0, 0.0, 1.0);
  let rain01 = clamp(rain * 800.0, 0.0, 1.0);
  // Use pFinal (blended with analytical Hadley pattern) for stable pressure visualization
  let p01 = clamp(0.5 + pFinal * (1.0 / 6000.0), 0.0, 1.0);
  outPixels[weatherOffset() + i2] = packRGBA8(cloud01, rain01, p01, clamp(soil, 0.0, 1.0));

  // Aux map (temp, snow, windU, windV) where wind is (east,north).
  let temp01 = clamp((Tsurf - 240.0) / 70.0, 0.0, 1.0);
  let snow01 = clamp(snow, 0.0, 1.0);

  // If column is very humid/warm (temp01 high) but cloud is tiny, nudge visibility.
  if (cloud01 < 0.02 && maxQr < 1e-4) {
    cloud01 = max(cloud01, temp01 * 0.25);
  }

  let basis = makeBasis(dir);
  let windEast = dot(velSample, basis[0]);
  let windNorth = dot(velSample, basis[1]);
  let u01 = clamp(0.5 + 0.5 * clamp(windEast / maxWind(), -1.0, 1.0), 0.0, 1.0);
  let v01 = clamp(0.5 + 0.5 * clamp(windNorth / maxWind(), -1.0, 1.0), 0.0, 1.0);
  outPixels[auxOffset() + i2] = packRGBA8(temp01, snow01, u01, v01);

}
        `;
    }
}
