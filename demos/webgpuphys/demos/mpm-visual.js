import { mpm } from "../src/index.js";
import { getSharedDevice } from "./shared/peercomputeDevice.js";
import { OrbitCamera } from "./shared/orbitControls.js";
import { createSphereGeometry } from "./shared/geometries.js";
import { FluidRenderer } from "./shared/fluidRenderer.js";

const canvas = document.getElementById("canvas");
const toggleBtn = document.getElementById("toggleBtn");
const statusEl = document.getElementById("status");
const particleCountEl = document.getElementById("particleCount");
const fpsEl = document.getElementById("fps");
const massEl = document.getElementById("mass");
const momentumEl = document.getElementById("momentum");
const errorEl = document.getElementById("error");

let device, context, format;
let depthTexture, depthView;
let renderer; // Particle renderer
let fluidRenderer; // Fluid renderer
let sphereRenderer; // For interaction sphere
let domain;
let buffers; // Keep track of current buffers
let running = true;
let lastTime = performance.now();
let fps = 0;
let lastDiag = 0;
let animationFrameId;
let currentParticleCount = 0;
let initializing = false;
let initialOrientation = null;
let useDeviceOrientation = false;  // Flag to track if we're using device orientation
let gui;
let temperatureController;

// Element list (materialType encodes element ID, phase will be computed in shaders)
const ELEMENTS = [
  { key: "Hydrogen", id: 0 },
  { key: "Oxygen", id: 1 },
  { key: "Sodium", id: 2 },
  { key: "Potassium", id: 3 },
  { key: "Magnesium", id: 4 },
  { key: "Aluminum", id: 5 },
  { key: "Silicon", id: 6 },
  { key: "Calcium", id: 7 },
  { key: "Titanium", id: 8 },
  { key: "Iron", id: 9 },
  { key: "Lead", id: 10 }
];

const BASE_SPACING = [0.8, 0.8, 1.0, 1.1, 0.95, 1.0, 0.95, 1.1, 1.0, 1.0, 1.0];
const EXPANSION_COEFF = [2e-4, 2e-4, 3e-4, 3e-4, 2.5e-4, 2e-4, 1.5e-4, 2.5e-4, 1.8e-4, 1.7e-4, 1.6e-4];
const BASE_JITTER = [0.05, 0.05, 0.08, 0.1, 0.07, 0.05, 0.05, 0.08, 0.06, 0.05, 0.05];

// Parse URL query parameters
function getQueryParam(name, defaultValue) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(name);
    if (value !== null) {
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
}

const params = {
  renderMode: 'Fluid', // 'Particles' or 'Fluid'
  particleCount: getQueryParam('particles', 20000),  // Default 20000, override with ?particles=N
  gridSizeX: 64,
  gridSizeY: 64,
  gridSizeZ: 64,
  spacing: 1.0,
  jitter: 0.1,
  
  // Material selection (two elements)
  materialA: "Titanium",
  materialB: "Lead",
  temperature: 300.0,
  
  // Physics
  dt: 0.1,
  gravity: -0.3,  // Gravity Y component (negative = down)
  ambientPressure: 1.0, // Dimensionless reference ambient pressure
  stiffness: 50.0,
  restDensity: 1.0,
  dynamicViscosity: 0.1,
  iterations: 1,
  fixedPointScale: 1e5,
  
  // Rendering
  visualRadius: 0.2, // For particles
  fluidRadius: 1,   // For fluid (larger for overlap)
  
  // Interaction
  interactionRadius: 9.0,
  interactionX: 32,
  interactionY: 10,  // Elevated so sphere is inside the fluid
  interactionZ: 32,
  interactionActive: false,
  
  // Thermal interaction (heat source sphere)
  heatSourceTemp: 400,  // Heat source temperature (K). >1 = active. 400K will melt ice, 200K will freeze water
};

toggleBtn.addEventListener("click", () => {
  running = !running;
  toggleBtn.textContent = running ? "Pause" : "Resume";
  statusEl.textContent = running ? "running" : "paused";
});

function setError(err) {
  console.error(err);
  errorEl.textContent = err?.stack || String(err);
  statusEl.textContent = "error";
  running = false;
  toggleBtn.disabled = true;
}

function addTooltip(controller, text) {
  if (controller?.domElement) {
    controller.domElement.title = text;
  }
  return controller;
}

function deriveSpawnParams(elementId, temperature, ambientPressure) {
  const idx = Math.max(0, Math.min(elementId, BASE_SPACING.length - 1));
  const base = BASE_SPACING[idx];
  const alpha = EXPANSION_COEFF[idx];
  const jitterBase = BASE_JITTER[idx];
  const deltaT = temperature - 300.0;
  let spacing = base * (1.0 + alpha * deltaT);
  // Compress with higher ambient pressure
  const pressureScale = 1.0 / Math.max(0.2, 1.0 + 0.1 * (ambientPressure - 1.0));
  spacing *= pressureScale;
  spacing = Math.min(Math.max(spacing, 0.4), 2.5);
  let jitter = jitterBase + Math.abs(deltaT) * 1e-4 + Math.max(0, ambientPressure - 1.0) * 0.02;
  jitter = Math.min(Math.max(jitter, 0.0), 0.6);
  return { spacing, jitter };
}

function applyTooltips(map) {
  if (!gui) return;
  gui.controllersRecursive().forEach((c) => {
    const key = c._property || c.property || c._name;
    const tip = map[key];
    if (tip) {
      addTooltip(c, tip);
    }
  });
}

// Phase-invariant material selection is driven by element choice; properties derive from temperature/pressure in shaders.

function resize() {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(canvas.clientWidth * devicePixelRatio));
  const height = Math.max(1, Math.floor(canvas.clientHeight * devicePixelRatio));
  canvas.width = width;
  canvas.height = height;
  context.configure({
    device,
    format,
    alphaMode: "opaque"
  });
  if (depthTexture) depthTexture.destroy();
  depthTexture = device.createTexture({
    size: [width, height],
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  });
  depthView = depthTexture.createView();
  if (renderer) renderer.resize(width, height);
  if (fluidRenderer) fluidRenderer.resize(width, height);
}

class MpmRenderer {
  constructor(device) {
    this.device = device;
    this.canvasAspect = 1;
    const { vertices, indices } = createSphereGeometry(1, 8, 6);
    this.vertexBuffer = device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, vertices);
    this.indexBuffer = device.createBuffer({
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this.indexBuffer, 0, indices);
    this.indexCount = indices.length;

    this.uniformBuffer = device.createBuffer({
      size: 256,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const shaderCode = /* wgsl */ `
      struct Uniforms {
        viewProj: mat4x4<f32>,
        radius: f32,
        pad0: vec3<f32>,
      };
      struct PosVel {
        position: vec3<f32>,
        velocity: vec3<f32>,
        temperature: f32,
      };
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      @group(0) @binding(1) var<storage, read> posvel: array<PosVel>;

      struct VSOut {
        @builtin(position) position: vec4<f32>,
        @location(0) normal: vec3<f32>,
        @location(1) color: vec3<f32>,
      };

      @vertex
      fn vs_main(
        @location(0) localPos: vec3<f32>,
        @location(1) normal: vec3<f32>,
        @builtin(instance_index) instanceId: u32
      ) -> VSOut {
        let p = posvel[instanceId].position;
        let t = posvel[instanceId].temperature;
        let worldPos = p + localPos * uniforms.radius;
        
        // Temperature mapping: 273K (Blue) -> 373K (Red)
        let tempT = clamp((t - 273.0) / 100.0, 0.0, 1.0);
        let colorCold = vec3<f32>(0.2, 0.7, 0.95);
        let colorHot = vec3<f32>(0.95, 0.2, 0.2);
        let color = mix(colorCold, colorHot, tempT);

        var out: VSOut;
        out.position = uniforms.viewProj * vec4<f32>(worldPos, 1.0);
        out.normal = normal;
        out.color = color;
        return out;
      }

      @fragment
      fn fs_main(in: VSOut) -> @location(0) vec4<f32> {
        let lightDir = normalize(vec3<f32>(0.3, 1.0, 0.2));
        let ambient = 0.25;
        let diffuse = max(dot(in.normal, lightDir), 0.0);
        let lighting = ambient + diffuse * 1.2;
        return vec4<f32>(in.color * lighting, 1.0);
      }
    `;

    const shaderModule = device.createShaderModule({ code: shaderCode });
    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: "uniform" } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: "read-only-storage" } }
      ]
    });

    this.pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
      vertex: {
        module: shaderModule,
        entryPoint: "vs_main",
        buffers: [{
          arrayStride: 24, // Stride for vertex attributes (geometry), not instance buffer
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" },
            { shaderLocation: 1, offset: 12, format: "float32x3" }
          ]
        }]
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_main",
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
      },
      primitive: { topology: "triangle-list", cullMode: "back" },
      depthStencil: { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" }
    });

    this.bindGroup = null;
  }

  resize(width, height) {
    this.canvasAspect = width / height;
  }

  updateBindGroup(posVelBuffer) {
    this.bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: { buffer: posVelBuffer } }
      ]
    });
  }

  updateUniforms(viewProj, radius) {
    const data = new Float32Array(20);
    data.set(viewProj, 0);
    data[16] = radius;
    this.device.queue.writeBuffer(this.uniformBuffer, 0, data);
  }

  record(pass, particleCount) {
    if (!this.bindGroup) return;
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setIndexBuffer(this.indexBuffer, "uint16");
    pass.drawIndexed(this.indexCount, particleCount);
  }
}

// Simple Renderer for Interaction Sphere (Red wireframe or solid)
class SphereRenderer {
    constructor(device) {
        this.device = device;
        const { vertices, indices } = createSphereGeometry(1, 16, 12);
        this.vertexBuffer = device.createBuffer({ size: vertices.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
        device.queue.writeBuffer(this.vertexBuffer, 0, vertices);
        this.indexBuffer = device.createBuffer({ size: indices.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST });
        device.queue.writeBuffer(this.indexBuffer, 0, indices);
        this.indexCount = indices.length;
        
        this.uniformBuffer = device.createBuffer({ size: 80, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
        
        const shaderCode = /* wgsl */ `
            struct Uniforms {
                viewProj: mat4x4<f32>,
                position: vec3<f32>,
                radius: f32,
            };
            @group(0) @binding(0) var<uniform> uniforms: Uniforms;
            
            struct VSOut {
                @builtin(position) position: vec4<f32>,
                @location(0) normal: vec3<f32>,
            };
            
            @vertex
            fn vs(@location(0) pos: vec3<f32>, @location(1) norm: vec3<f32>) -> VSOut {
                var out: VSOut;
                let worldPos = uniforms.position + pos * uniforms.radius;
                out.position = uniforms.viewProj * vec4<f32>(worldPos, 1.0);
                out.normal = norm;
                return out;
            }
            
            @fragment
            fn fs(in: VSOut) -> @location(0) vec4<f32> {
                let light = vec3<f32>(0.5, 1.0, 0.2);
                let diff = max(dot(in.normal, normalize(light)), 0.2);
                return vec4<f32>(1.0, 0.4, 0.4, 1.0) * diff;
            }
        `;
        
        const module = device.createShaderModule({ code: shaderCode });
        this.pipeline = device.createRenderPipeline({
            layout: 'auto',
            vertex: { module, entryPoint: 'vs', buffers: [{ arrayStride: 24, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }, { shaderLocation: 1, offset: 12, format: 'float32x3' }] }] },
            fragment: { module, entryPoint: 'fs', targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }] },
            primitive: { topology: 'triangle-list', cullMode: 'back' },
            depthStencil: { format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less' }
        });
        
        this.bindGroup = device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{ binding: 0, resource: { buffer: this.uniformBuffer } }]
        });
    }
    
    update(viewProj, pos, radius) {
        const data = new Float32Array(20);
        data.set(viewProj, 0);
        data.set(pos, 16); // vec3
        data[19] = radius; // float (packed after vec3? 16+12=28? No. 16+3*4 = 28. Float aligned 4. But vec3 align 16? In uniform, yes. So pos is 16..28. radius at 28?)
        // Standard uniform layout:
        // mat4 (0..64)
        // vec3 (64..76)
        // f32 (76..80)
        // My code says `data.set(pos, 16)`. That's offset 16 FLOATs (64 bytes). Correct.
        // `data[19]`. That's offset 19 floats (76 bytes). Correct.
        this.device.queue.writeBuffer(this.uniformBuffer, 0, data);
    }
    
    record(pass) {
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.setIndexBuffer(this.indexBuffer, 'uint16');
        pass.drawIndexed(this.indexCount);
    }
}

async function initSimulation() {
  if (initializing) return;
  initializing = true;
  statusEl.textContent = "initializing...";

  try {
    const particleCount = params.particleCount;
    const gridSize = { x: params.gridSizeX, y: params.gridSizeY, z: params.gridSizeZ };
    
    // Sub-stepping for stability
    // Fix physics step to a stable value (e.g. 5ms) and iterate to match requested dt
    const physics_dt = 0.005;
    const iterations = Math.ceil(params.dt / physics_dt);

    // Constants including brittle solid parameters
    const constants = {
        stiffness: params.stiffness,
        restDensity: params.restDensity,
        dynamicViscosity: params.dynamicViscosity,
        dt: physics_dt,
        fixedPointScale: params.fixedPointScale,
        tensileStrength: 0,
        damageRate: 0,
        ambientPressure: params.ambientPressure
    };

    // Create buffers
    // Safety size for PosVel struct stride 32
    const posVelBuffer = device.createBuffer({
        size: particleCount * 32, 
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    });
    
    const interactionBuffer = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const setup = mpm.setupMpmDomain(device, {
        particleCount,
        gridSize,
        iterations: iterations, // Use calculated sub-steps
        posVelBuffer,
        interactionBuffer,
        constants
    });

    // Initialize two material blocks (each 50% of particles)
    const halfCount = Math.floor(particleCount / 2);
    const remaining = particleCount - halfCount;
    const matA = ELEMENTS.find(e => e.key === params.materialA) ?? ELEMENTS[0];
    const matB = ELEMENTS.find(e => e.key === params.materialB) ?? ELEMENTS[1] ?? ELEMENTS[0];
    const sideA = Math.ceil(Math.cbrt(halfCount));
    const sideB = Math.ceil(Math.cbrt(remaining));
    const spawnA = deriveSpawnParams(matA.id, params.temperature, params.ambientPressure);
    const spawnB = deriveSpawnParams(matB.id, params.temperature, params.ambientPressure);
    const margin = 2;
    const maxSideSpan = Math.max(sideA * spawnA.spacing, sideB * spawnB.spacing);
    const sameY = Math.max(
      margin,
      Math.min(gridSize.y - margin - maxSideSpan, gridSize.y * 0.7)
    );
    const startA = [margin, sameY, margin];
    const startB = [
      Math.max(margin, gridSize.x - margin - sideB * spawnB.spacing),
      sameY,
      Math.max(margin, gridSize.z - margin - sideB * spawnB.spacing)
    ];
    const buf = new ArrayBuffer(particleCount * mpm.MPM_PARTICLE_STRIDE);
    const blockA = mpm.createBlockParticleData({
        count: halfCount,
        gridSize,
        start: startA,
        spacing: spawnA.spacing,
        jitter: spawnA.jitter,
        temperature: params.temperature,
        restDensity: params.restDensity,
        materialType: matA.id,
        cubeSideCount: sideA
    });
    const blockB = mpm.createBlockParticleData({
        count: remaining,
        gridSize,
        start: startB,
        spacing: spawnB.spacing,
        jitter: spawnB.jitter,
        temperature: params.temperature,
        restDensity: params.restDensity,
        materialType: matB.id,
        cubeSideCount: sideB
    });
    new Uint8Array(buf, 0, blockA.byteLength).set(new Uint8Array(blockA));
    new Uint8Array(buf, blockA.byteLength, blockB.byteLength).set(new Uint8Array(blockB));
    const data = buf;
    mpm.uploadParticleData(device, setup.buffers.particleBuffer, data);

    domain = setup.domain;
    buffers = setup.buffers;
    currentParticleCount = particleCount;

    if (renderer) renderer.updateBindGroup(posVelBuffer);
    if (fluidRenderer) fluidRenderer.updateBindGroup(posVelBuffer);
    
    particleCountEl.textContent = particleCount.toString();
    statusEl.textContent = "running";
  } catch(e) {
    console.warn("Init error:", e);
    setError(e);
  } finally {
    initializing = false;
  }
}

async function setup() {
  try {
    device = await getSharedDevice();
    context = canvas.getContext("webgpu");
    format = navigator.gpu.getPreferredCanvasFormat();
    
    renderer = new MpmRenderer(device);
    fluidRenderer = new FluidRenderer(device, format);
    sphereRenderer = new SphereRenderer(device);
    
    resize();
    window.addEventListener("resize", resize);

    // Center camera on the default grid (64x64x64)
    // Center: 32, 32, 32
    // Radius: ~1.5 * max_dim to fit in view
    const camera = new OrbitCamera(canvas, { target: [32, 32, 32], radius: 120 });

    // Initial Sim
    await initSimulation();

    // GUI Setup
    gui = new window.lil.GUI({ title: "MLS-MPM Controls" });
    
    // Collapse on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) {
        gui.close();
    }

    addTooltip(gui.add(params, "renderMode", ['Particles', 'Fluid']).name("Render Mode"),
      "Choose between particle instancing or screen-space fluid rendering");
    
    const viewFolder = gui.addFolder("Visuals");
    addTooltip(viewFolder.add(params, "visualRadius", 0.05, 1.0, 0.05).name("Particle Radius"),
      "Sphere radius for particle rendering (visual only)");
    addTooltip(viewFolder.add(params, "fluidRadius", 0.05, 3.0, 0.05).name("Fluid Radius"),
      "Splat radius for screen-space fluid rendering");

    const simFolder = gui.addFolder("Simulation");
    addTooltip(simFolder.add(params, "particleCount", 100, 100000, 1000).name("Particle Count").onFinishChange(initSimulation),
      "Total number of particles spawned (higher = heavier GPU load)");
    
    // Material selection (phase-invariant elements)
    const elementOptions = {};
    ELEMENTS.forEach(el => { elementOptions[el.key] = el.key; });
    addTooltip(simFolder.add(params, "materialA", elementOptions).name("Element A").onChange(initSimulation),
      "Element for first spawn block (50% of particles)");
    addTooltip(simFolder.add(params, "materialB", elementOptions).name("Element B").onChange(initSimulation),
      "Element for second spawn block (50% of particles)");
    
    // Box Size - update camera target and interaction sphere when changed
    function updateCameraAndInteraction() {
        // Center the camera on the grid
        const centerX = params.gridSizeX / 2;
        const centerY = params.gridSizeY / 2;
        const centerZ = params.gridSizeZ / 2;
        camera.setTarget([centerX, centerY, centerZ]);
        
        // Adjust camera radius to fit the box
        const maxDim = Math.max(params.gridSizeX, params.gridSizeY, params.gridSizeZ);
        camera.setRadius(maxDim * 1.8);
        
        // Center the interaction sphere
        params.interactionX = centerX;
        params.interactionY = centerY * 0.3; // Keep it in lower part of the volume
        params.interactionZ = centerZ;
        gui.controllersRecursive().forEach(c => c.updateDisplay());
        
        initSimulation();
    }
    
    simFolder.add(params, "gridSizeX", 16, 256, 16).name("Box X").onFinishChange(updateCameraAndInteraction);
    simFolder.add(params, "gridSizeY", 16, 256, 16).name("Box Y").onFinishChange(updateCameraAndInteraction);
    simFolder.add(params, "gridSizeZ", 16, 256, 16).name("Box Z").onFinishChange(updateCameraAndInteraction);
    
    addTooltip(simFolder.add(params, "spacing", 0.1, 2.5, 0.05).name("Spacing").onFinishChange(initSimulation),
      "Initial particle pitch (grid units); smaller = denser packing");
    addTooltip(simFolder.add(params, "jitter", 0.0, 1.0, 0.05).name("Jitter").onFinishChange(initSimulation),
      "Random perturbation of initial positions to break symmetry");
    temperatureController = addTooltip(simFolder.add(params, "temperature", 0, 5_000, 1).name("Temperature (K)").onFinishChange(initSimulation),
      "Initial particle temperature for the selected material");
    
    const physFolder = gui.addFolder("Physics Constants");
    addTooltip(physFolder.add(params, "dt", 0.001, 0.2, 0.001).name("Time Step (dt)").onChange(() => initSimulation()),
      "Simulation timestep (seconds) per sub-step; smaller = more stable");
    addTooltip(physFolder.add(params, "gravity", -20, 20, 0.1).name("Gravity (Y)"),
      "Gravity acceleration along Y (negative = downward)");
    addTooltip(physFolder.add(params, "ambientPressure", 0.0, 5.0, 0.05).name("Ambient Pressure"),
      "Ambient pressure baseline applied to fluids/gases (dimensionless)");
    addTooltip(physFolder.add(params, "stiffness", 0.1, 100.0, 0.1).name("Stiffness").onFinishChange(initSimulation),
      "Fluid bulk modulus for Tait EOS (affects compressibility)");
    addTooltip(physFolder.add(params, "restDensity", 0.1, 10.0, 0.1).onFinishChange(initSimulation),
      "Target rest density for mass/volume and pressure calculations");
    addTooltip(physFolder.add(params, "dynamicViscosity", 0.0, 5.0, 0.01).onFinishChange(initSimulation),
      "Viscosity term applied to fluids (damps shear/velocity gradients)");
    
    // Solid material parameters
    const interactFolder = gui.addFolder("Interaction Sphere");
    addTooltip(interactFolder.add(params, "interactionActive").name("Active"),
      "Enable or disable the interaction sphere");
    addTooltip(interactFolder.add(params, "interactionRadius", 0.1, 20.0).name("Radius"),
      "Sphere radius for collision/thermal interaction");
    addTooltip(interactFolder.add(params, "interactionX", 0, 100).name("X"),
      "Sphere center X (grid units)");
    addTooltip(interactFolder.add(params, "interactionY", 0, 100).name("Y"),
      "Sphere center Y (grid units)");
    addTooltip(interactFolder.add(params, "interactionZ", 0, 100).name("Z"),
      "Sphere center Z (grid units)");
    addTooltip(interactFolder.add(params, "heatSourceTemp", 0, 10_000, 1).name("Heat Source (K)"),
      "Temperature of the heat/cool sphere (0 disables thermal effect)");
    
    addTooltip(gui.add({ reset: initSimulation }, "reset").name("Reset Simulation"),
      "Rebuild buffers and restart the current scene");
    addTooltip(gui.add({ calibrate: () => initialOrientation = null }, "calibrate").name("Calibrate Sensors"),
      "Reset device-orientation baseline for gravity control");

    statusEl.textContent = "running";

    // Mouse Interaction for Sphere
    // Middle mouse button (button 1) drags sphere on XZ plane
    // Ctrl + Scroll changes sphere Y position
    let sphereDragging = false;
    let planeY = 0;
    
    canvas.addEventListener('pointerdown', e => {
        if(e.button === 1 && params.interactionActive) { // Middle click to drag sphere
            sphereDragging = true;
            planeY = params.interactionY;
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    });
    window.addEventListener('pointerup', () => sphereDragging = false);
    
    // Ctrl + Scroll to change sphere Y
    canvas.addEventListener('wheel', e => {
        if (e.ctrlKey && params.interactionActive) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -1 : 1;
            params.interactionY = Math.max(0, Math.min(params.gridSizeY, params.interactionY + delta));
            gui.controllersRecursive().forEach(c => c.updateDisplay());
        }
    }, { passive: false });
    
    // Device Orientation
    window.addEventListener("deviceorientation", (event) => {
        if (!buffers || !buffers.simUniformBuffer) return;
        
        // Only use device orientation if we have valid values
        if (event.beta === null || event.gamma === null) return;
        
        if (!initialOrientation) {
            initialOrientation = { beta: event.beta, gamma: event.gamma };
        }
        
        // Mark that we're using device orientation (disables gravity slider)
        useDeviceOrientation = true;

        const g = 0.3;
        // Calculate relative tilt
        const beta = (event.beta - initialOrientation.beta) * (Math.PI / 180);
        const gamma = (event.gamma - initialOrientation.gamma) * (Math.PI / 180);
        
        // Logic:
        // Initial state (relative 0,0): Gravity is straight down (-Y).
        // Tilting device (changing beta/gamma) rotates the gravity vector.
        
        // Rotate vector (0, -1, 0) by Euler angles?
        // Simplified:
        // Gamma (left/right tilt) affects X.
        // Beta (front/back tilt) affects Z.
        
        let gx = Math.sin(gamma) * g;
        let gz = Math.sin(beta) * g;
        // Ensure y component maintains magnitude roughly
        let gy = -Math.sqrt(Math.max(0, g*g - gx*gx - gz*gz));
        
        const data = new Float32Array(4);
        data.set([gx, gy, gz], 0); 
        data[3] = params.ambientPressure;
        device.queue.writeBuffer(buffers.simUniformBuffer, 0, data);
    }, true);

    canvas.addEventListener('pointermove', e => {
        if (sphereDragging && params.interactionActive) {
            // Raycast logic
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * 2 - 1;
            const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
            
            // Get camera ray
            const mats = camera.getMatrices(rect.width/rect.height);
            const invView = mats.invView;
            const invProj = mats.invProj;
            
            const clip = [x, y, 0.5, 1.0];
            // View space
            let viewX = invProj[0]*x + invProj[4]*y + invProj[8]*0.5 + invProj[12];
            let viewY = invProj[1]*x + invProj[5]*y + invProj[9]*0.5 + invProj[13];
            let viewZ = invProj[2]*x + invProj[6]*y + invProj[10]*0.5 + invProj[14];
            let viewW = invProj[3]*x + invProj[7]*y + invProj[11]*0.5 + invProj[15];
            viewX/=viewW; viewY/=viewW; viewZ/=viewW;
            
            // World space
            let worldX = invView[0]*viewX + invView[4]*viewY + invView[8]*viewZ; // No translation for dir?
            let worldY = invView[1]*viewX + invView[5]*viewY + invView[9]*viewZ;
            let worldZ = invView[2]*viewX + invView[6]*viewY + invView[10]*viewZ;
            // Camera pos
            const eye = mats.eye;
            const dir = [worldX, worldY, worldZ]; // Vector from eye? 
            // Correct way: unproject (x,y,0) and (x,y,1) or just use direction from eye.
            // Simplified: Unproject near plane point
            const worldPos = [
                invView[0]*viewX + invView[4]*viewY + invView[8]*viewZ + invView[12],
                invView[1]*viewX + invView[5]*viewY + invView[9]*viewZ + invView[13],
                invView[2]*viewX + invView[6]*viewY + invView[10]*viewZ + invView[14]
            ];
            
            const rayDir = [worldPos[0]-eye[0], worldPos[1]-eye[1], worldPos[2]-eye[2]];
            // Normalize
            const len = Math.hypot(rayDir[0], rayDir[1], rayDir[2]);
            rayDir[0]/=len; rayDir[1]/=len; rayDir[2]/=len;
            
            // Intersect plane Y = planeY
            // P = O + t*D. P.y = planeY.
            // planeY = O.y + t*D.y => t = (planeY - O.y) / D.y
            if (Math.abs(rayDir[1]) > 0.001) {
                const t = (planeY - eye[1]) / rayDir[1];
                if (t > 0) {
                    params.interactionX = eye[0] + t * rayDir[0];
                    params.interactionZ = eye[2] + t * rayDir[2];
                    gui.controllers.forEach(c => c.updateDisplay());
                }
            }
        }
    });

    async function frame(now) {
      const dtSeconds = (now - lastTime) / 1000;
      lastTime = now;
      const smooth = 0.9;
      if (dtSeconds > 0) {
        const instFps = 1 / dtSeconds;
        fps = fps * smooth + instFps * (1 - smooth);
        fpsEl.textContent = fps.toFixed(1);
      }

      if (initializing) {
        animationFrameId = requestAnimationFrame(frame);
        return;
      }

      // Update Gravity Uniform (if no device orientation is active)
      if (buffers && buffers.simUniformBuffer && !useDeviceOrientation) {
          const gData = new Float32Array(4);
          gData[0] = 0;              // gx
          gData[1] = params.gravity; // gy (negative = down)
          gData[2] = 0;              // gz
          gData[3] = params.ambientPressure;
          device.queue.writeBuffer(buffers.simUniformBuffer, 0, gData);
      }

      // Update Interaction Buffer
      // MouseInteraction struct: point(vec3f), radius(f32), velocity(vec3f), temperature(f32)
      if (buffers && buffers.interactionBuffer) {
          const iData = new Float32Array(8);
          if (params.interactionActive) {
              iData[0] = params.interactionX;
              iData[1] = params.interactionY;
              iData[2] = params.interactionZ;
              iData[3] = params.interactionRadius;
              iData[4] = 0;  // velocity x (unused for now)
              iData[5] = 0;  // velocity y
              iData[6] = 0;  // velocity z
              iData[7] = params.heatSourceTemp;  // Heat source temperature
          } else {
              iData[3] = -1.0;  // Negative radius = inactive
          }
          device.queue.writeBuffer(buffers.interactionBuffer, 0, iData);
      }

      const encoder = device.createCommandEncoder({ label: "mpm-visual-frame" });
      if (running && domain) {
        domain.step(encoder, params.dt);
      }

      // Render
      if (params.renderMode === 'Fluid') {
        const matrices = camera.getMatrices(canvas.width / canvas.height);
        fluidRenderer.updateUniforms(matrices, params.fluidRadius); 
        
        const textureView = context.getCurrentTexture().createView();
        const clearPass = encoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.05, g: 0.08, b: 0.14, a: 1 },
                loadOp: 'clear',
                storeOp: 'store'
            }],
            depthStencilAttachment: {
                view: depthView,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
                depthClearValue: 1.0
            }
        });
        // Draw interaction sphere in fluid mode? Maybe as solid?
        // Let's draw it before fluid or after?
        // If we draw it before, fluid covers it.
        // If after, it's on top.
        // Let's render sphere inside fluid renderer? No, separate.
        // Render sphere to screen.
        if (params.interactionActive) {
            sphereRenderer.update(matrices.viewProj, [params.interactionX, params.interactionY, params.interactionZ], params.interactionRadius);
            sphereRenderer.record(clearPass);
        }
        clearPass.end();
        
        fluidRenderer.render(encoder, textureView, depthView, currentParticleCount);

      } else {
        const viewProj = camera.getViewProj(canvas.width / canvas.height);
        renderer.updateUniforms(viewProj, params.visualRadius);

        const textureView = context.getCurrentTexture().createView();
        const pass = encoder.beginRenderPass({
          colorAttachments: [{
            view: textureView,
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0.05, g: 0.08, b: 0.14, a: 1 }
          }],
          depthStencilAttachment: {
            view: depthView,
            depthLoadOp: "clear",
            depthStoreOp: "store",
            depthClearValue: 1.0
          }
        });
        
        if (params.interactionActive) {
            sphereRenderer.update(viewProj, [params.interactionX, params.interactionY, params.interactionZ], params.interactionRadius);
            sphereRenderer.record(pass);
        }
        
        renderer.record(pass, currentParticleCount);
        pass.end();
      }

      device.queue.submit([encoder.finish()]);

      // Occasional diagnostics
      if (now - lastDiag > 500 && running && buffers) {
        lastDiag = now;
        mpm.computeMassMomentum(device, buffers.particleBuffer, currentParticleCount)
          .then(({ mass, momentum }) => {
            massEl.textContent = mass.toFixed(3);
            momentumEl.textContent = momentum.map((v) => v.toFixed(3)).join(", ");
          })
          .catch(err => console.warn(err));
      }

      animationFrameId = requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  } catch (err) {
    setError(err);
  }
}

setup();
