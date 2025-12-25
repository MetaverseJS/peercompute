import * as THREE from 'three';

/**
 * WebGPU compute-based ocean wave simulation.
 * Uses a lat/lon grid for height simulation, outputting a texture
 * that the ocean shader can sample for displacement and normals.
 */

const DEFAULT_GRID_W = 256;
const DEFAULT_GRID_H = 128;

function makeDataTexture(data, width, height, opts = {}) {
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    tex.wrapS = opts.wrapS ?? THREE.RepeatWrapping;
    tex.wrapT = opts.wrapT ?? THREE.ClampToEdgeWrapping;
    tex.minFilter = opts.minFilter ?? THREE.LinearFilter;
    tex.magFilter = opts.magFilter ?? THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
}

export class OceanComputeSystem {
    constructor({
        gridWidth = DEFAULT_GRID_W,
        gridHeight = DEFAULT_GRID_H
    } = {}) {
        this.gridW = Math.max(32, Math.min(512, Math.round(gridWidth)));
        this.gridH = Math.max(16, Math.min(256, Math.round(gridHeight)));
        this.cellCount = this.gridW * this.gridH;

        this.enabled = false;
        this.ready = false;

        this.device = null;
        this.pipelineSim = null;
        this.bindGroupLayout = null;
        this.bindGroups = null;

        this.uniformBuffer = null;
        this.uniformData = new Float32Array(16); // 4 vec4

        // Ping-pong height buffers (heightA <-> heightB)
        this.heightBuffers = null;
        // Previous height for velocity integration
        this.prevHeightBuffer = null;
        // Output buffer for readback
        this.outputBuffer = null;
        // Readback staging buffers
        this.readbackBuffers = null;
        this.readbackInFlight = [false, false];
        this.readbackWriteIndex = 0;

        this.ping = 0;

        // Simulation parameters
        this.viscosity = 0.985;      // Wave damping (higher = less damping)
        this.waveSpeed = 2.0;        // Wave propagation speed multiplier
        this.mousePos = new THREE.Vector2(-999, -999); // lat/lon coords
        this.mouseSpeed = new THREE.Vector2(0, 0);
        this.mouseSize = 0.08;       // Radius of mouse disturbance in UV space
        this.mouseDeep = 0.3;        // Strength of mouse disturbance
        this.windStrength = 0.5;     // Ambient wind-driven waves
        this.windDirection = new THREE.Vector2(0.7, 0.3).normalize();

        this.timeS = 0;
        this.readbackIntervalS = 0.033; // ~30Hz readback
        this.readbackTimerS = 0;

        // Output texture: RGBA = (height, normalX, normalY, foam)
        this.textureData = new Uint8Array(this.cellCount * 4);
        this.oceanTexture = makeDataTexture(this.textureData, this.gridW, this.gridH);
    }

    static async create(opts = {}) {
        const { device, ...rest } = opts;
        const sys = new OceanComputeSystem(rest);
        await sys.init({ device });
        return sys;
    }

    setConfig({
        viscosity,
        waveSpeed,
        mouseSize,
        mouseDeep,
        windStrength,
        windDirectionX,
        windDirectionY,
        readbackIntervalS
    } = {}) {
        if (Number.isFinite(viscosity)) this.viscosity = Math.max(0.9, Math.min(0.999, viscosity));
        if (Number.isFinite(waveSpeed)) this.waveSpeed = Math.max(0.1, Math.min(10, waveSpeed));
        if (Number.isFinite(mouseSize)) this.mouseSize = Math.max(0.01, Math.min(0.5, mouseSize));
        if (Number.isFinite(mouseDeep)) this.mouseDeep = Math.max(0, Math.min(2, mouseDeep));
        if (Number.isFinite(windStrength)) this.windStrength = Math.max(0, Math.min(2, windStrength));
        if (Number.isFinite(windDirectionX) && Number.isFinite(windDirectionY)) {
            this.windDirection.set(windDirectionX, windDirectionY).normalize();
        }
        if (Number.isFinite(readbackIntervalS)) this.readbackIntervalS = Math.max(0.01, readbackIntervalS);
    }

    getTexture() {
        return this.oceanTexture;
    }

    setMouseInteraction(uvX, uvY, speedX, speedY) {
        // UV coords in [0,1] range mapped to lat/lon grid
        this.mousePos.set(uvX, uvY);
        this.mouseSpeed.set(speedX, speedY);
    }

    clearMouseInteraction() {
        this.mousePos.set(-999, -999);
        this.mouseSpeed.set(0, 0);
    }

    async init({ device: injectedDevice } = {}) {
        if (injectedDevice) {
            this.device = injectedDevice;
            this.enabled = true;
        } else {
            if (typeof navigator === 'undefined' || !navigator.gpu) {
                console.warn('[OceanComputeSystem] WebGPU not available; compute ocean disabled.');
                this.enabled = false;
                return;
            }

            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.warn('[OceanComputeSystem] No GPU adapter found; compute ocean disabled.');
                this.enabled = false;
                return;
            }

            this.device = await adapter.requestDevice();
            this.enabled = true;
        }

        const device = this.device;
        const cellBytes = this.cellCount * 4; // f32 per cell for height
        const outBytes = this.cellCount * 4;  // u32 RGBA8 packed

        // Uniform buffer
        this.uniformBuffer = device.createBuffer({
            size: this.uniformData.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        // Height ping-pong buffers (f32 per cell)
        this.heightBuffers = [
            device.createBuffer({
                size: cellBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }),
            device.createBuffer({
                size: cellBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            })
        ];

        // Previous height buffer for velocity computation
        this.prevHeightBuffer = device.createBuffer({
            size: cellBytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        // Output buffer
        this.outputBuffer = device.createBuffer({
            size: outBytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });

        // Readback buffers
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

        // Bind group layout
        this.bindGroupLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }
            ]
        });

        const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayout] });
        const shaderModule = device.createShaderModule({ code: this._wgslOcean() });

        this.pipelineSim = device.createComputePipeline({
            layout: pipelineLayout,
            compute: { module: shaderModule, entryPoint: 'main' }
        });

        // Create bind groups for ping-pong
        this.bindGroups = [
            device.createBindGroup({
                layout: this.bindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                    { binding: 1, resource: { buffer: this.heightBuffers[0] } },
                    { binding: 2, resource: { buffer: this.heightBuffers[1] } },
                    { binding: 3, resource: { buffer: this.prevHeightBuffer } },
                    { binding: 4, resource: { buffer: this.outputBuffer } }
                ]
            }),
            device.createBindGroup({
                layout: this.bindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                    { binding: 1, resource: { buffer: this.heightBuffers[1] } },
                    { binding: 2, resource: { buffer: this.heightBuffers[0] } },
                    { binding: 3, resource: { buffer: this.prevHeightBuffer } },
                    { binding: 4, resource: { buffer: this.outputBuffer } }
                ]
            })
        ];

        // Initialize with calm water
        this._resetState();
        this.ready = true;
    }

    _resetState() {
        const init = new Float32Array(this.cellCount);
        // Start with slight noise for visual interest
        for (let i = 0; i < this.cellCount; i++) {
            init[i] = (Math.random() - 0.5) * 0.001;
        }
        this.device.queue.writeBuffer(this.heightBuffers[0], 0, init);
        this.device.queue.writeBuffer(this.heightBuffers[1], 0, init);
        this.device.queue.writeBuffer(this.prevHeightBuffer, 0, init);
        this.ping = 0;
        this.timeS = 0;
    }

    update(deltaSeconds, opts = {}) {
        if (!this.enabled || !this.ready) return;

        const dtReal = Math.min(Math.max(deltaSeconds ?? 0, 0), 0.1);
        this.timeS += dtReal;
        this.readbackTimerS += dtReal;

        this._writeUniforms(dtReal);

        const device = this.device;
        const encoder = device.createCommandEncoder();

        // Run simulation step
        const pass = encoder.beginComputePass();
        pass.setPipeline(this.pipelineSim);
        pass.setBindGroup(0, this.bindGroups[this.ping]);
        pass.dispatchWorkgroups(
            Math.ceil(this.gridW / 8),
            Math.ceil(this.gridH / 8)
        );
        pass.end();

        this.ping = 1 - this.ping;

        // Schedule readback if interval elapsed
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
                    this.cellCount * 4
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
            this.textureData.set(bytes);
            buf.unmap();
            this.oceanTexture.needsUpdate = true;
        }).catch((err) => {
            console.warn('[OceanComputeSystem] Readback failed', err);
        }).finally(() => {
            this.readbackInFlight[rbIndex] = false;
        });
    }

    _writeUniforms(dt) {
        const u = this.uniformData;

        // [0]: gridW, gridH, dt, time
        u[0] = this.gridW;
        u[1] = this.gridH;
        u[2] = dt;
        u[3] = this.timeS;

        // [1]: viscosity, waveSpeed, mouseSize, mouseDeep
        u[4] = this.viscosity;
        u[5] = this.waveSpeed;
        u[6] = this.mouseSize;
        u[7] = this.mouseDeep;

        // [2]: mousePos.x, mousePos.y, mouseSpeed.x, mouseSpeed.y
        u[8] = this.mousePos.x;
        u[9] = this.mousePos.y;
        u[10] = this.mouseSpeed.x;
        u[11] = this.mouseSpeed.y;

        // [3]: windStrength, windDir.x, windDir.y, unused
        u[12] = this.windStrength;
        u[13] = this.windDirection.x;
        u[14] = this.windDirection.y;
        u[15] = 0;

        this.device.queue.writeBuffer(this.uniformBuffer, 0, u);
    }

    _wgslOcean() {
        return /* wgsl */`
@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 4>;
@group(0) @binding(1) var<storage, read> heightSrc: array<f32>;
@group(0) @binding(2) var<storage, read_write> heightDst: array<f32>;
@group(0) @binding(3) var<storage, read_write> prevHeight: array<f32>;
@group(0) @binding(4) var<storage, read_write> outPixels: array<u32>;

fn gridW() -> u32 { return u32(params[0].x + 0.5); }
fn gridH() -> u32 { return u32(params[0].y + 0.5); }
fn dt() -> f32 { return params[0].z; }
fn time() -> f32 { return params[0].w; }

fn viscosity() -> f32 { return params[1].x; }
fn waveSpeed() -> f32 { return params[1].y; }
fn mouseSize() -> f32 { return params[1].z; }
fn mouseDeep() -> f32 { return params[1].w; }

fn mousePos() -> vec2<f32> { return params[2].xy; }
fn mouseSpd() -> vec2<f32> { return params[2].zw; }

fn windStrength() -> f32 { return params[3].x; }
fn windDir() -> vec2<f32> { return params[3].yz; }

fn idx(x: u32, y: u32) -> u32 {
    return y * gridW() + x;
}

fn wrapX(x: i32) -> u32 {
    let w = i32(gridW());
    return u32((x % w + w) % w);
}

fn clampY(y: i32) -> u32 {
    return u32(clamp(y, 0, i32(gridH()) - 1));
}

fn hash(p: vec2<f32>) -> f32 {
    return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    let a = hash(i);
    let b = hash(i + vec2<f32>(1.0, 0.0));
    let c = hash(i + vec2<f32>(0.0, 1.0));
    let d = hash(i + vec2<f32>(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2<f32>) -> f32 {
    var s = 0.0;
    var amp = 0.5;
    var freq = 1.0;
    for (var i = 0; i < 4; i++) {
        s += noise(p * freq) * amp;
        freq *= 2.1;
        amp *= 0.5;
    }
    return s;
}

fn packRGBA8(r: f32, g: f32, b: f32, a: f32) -> u32 {
    let R = u32(clamp(r, 0.0, 1.0) * 255.0 + 0.5);
    let G = u32(clamp(g, 0.0, 1.0) * 255.0 + 0.5);
    let B = u32(clamp(b, 0.0, 1.0) * 255.0 + 0.5);
    let A = u32(clamp(a, 0.0, 1.0) * 255.0 + 0.5);
    return (A << 24u) | (B << 16u) | (G << 8u) | R;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let w = gridW();
    let h = gridH();
    if (gid.x >= w || gid.y >= h) { return; }

    let i = idx(gid.x, gid.y);
    let x = i32(gid.x);
    let y = i32(gid.y);

    // Get neighbor heights (wrap X for longitude, clamp Y for latitude)
    let xL = wrapX(x - 1);
    let xR = wrapX(x + 1);
    let yD = clampY(y - 1);
    let yU = clampY(y + 1);

    let hC = heightSrc[i];
    let hL = heightSrc[idx(xL, gid.y)];
    let hR = heightSrc[idx(xR, gid.y)];
    let hD = heightSrc[idx(gid.x, yD)];
    let hU = heightSrc[idx(gid.x, yU)];

    let hPrev = prevHeight[i];

    // Wave equation: new height based on neighbors and velocity
    // h_new = viscosity * (avg_neighbors * 2 - prev_height)
    let neighborAvg = (hL + hR + hD + hU) * 0.5;
    var hNew = viscosity() * (neighborAvg - hPrev);

    // Mouse interaction
    let uv = vec2<f32>(f32(gid.x) / f32(w), f32(gid.y) / f32(h));
    let mPos = mousePos();
    if (mPos.x >= 0.0 && mPos.x <= 1.0 && mPos.y >= 0.0 && mPos.y <= 1.0) {
        let dist = length(uv - mPos);
        let mousePhase = clamp(dist * 3.14159265 / mouseSize(), 0.0, 3.14159265);
        let mouseInfluence = (cos(mousePhase) + 1.0) * 0.5 * mouseDeep() * length(mouseSpd());
        hNew -= mouseInfluence * 0.05;
    }

    // Wind-driven ambient waves using FBM noise
    let windUV = uv * 8.0 + windDir() * time() * 0.5;
    let windWave = (fbm(windUV) - 0.5) * windStrength() * 0.008;
    hNew += windWave;

    // Small random perturbation to keep water "alive"
    let jitter = (hash(uv * 1000.0 + time() * 0.1) - 0.5) * 0.0002;
    hNew += jitter;

    // Clamp height
    hNew = clamp(hNew, -0.2, 0.2);

    // Store previous height and new height
    prevHeight[i] = hC;
    heightDst[i] = hNew;

    // Calculate normals from height gradient
    let dhdx = (hR - hL) * f32(w) * 0.5;
    let dhdy = (hU - hD) * f32(h) * 0.5;

    // Pack output: height01, normalX01, normalY01, foam
    let height01 = clamp(hNew * 2.5 + 0.5, 0.0, 1.0);
    let normalX01 = clamp(dhdx * 5.0 + 0.5, 0.0, 1.0);
    let normalY01 = clamp(dhdy * 5.0 + 0.5, 0.0, 1.0);
    
    // Foam based on wave steepness
    let steepness = sqrt(dhdx * dhdx + dhdy * dhdy);
    let foam = clamp(steepness * 8.0, 0.0, 1.0);

    outPixels[i] = packRGBA8(height01, normalX01, normalY01, foam);
}
        `;
    }

    dispose() {
        if (this.heightBuffers) {
            this.heightBuffers.forEach(b => b?.destroy());
        }
        this.prevHeightBuffer?.destroy();
        this.outputBuffer?.destroy();
        this.readbackBuffers?.forEach(b => b?.destroy());
        this.uniformBuffer?.destroy();
        this.device = null;
        this.enabled = false;
        this.ready = false;
    }
}
