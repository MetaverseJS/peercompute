import { initWebGPU } from "../src/index.js";
import { ParticleRenderer } from "./shared/particleRenderer.js";
import { OrbitCamera } from "./shared/orbitControls.js";

const canvas = document.getElementById("canvas");
const errorEl = document.getElementById("error");
const particleCountEl = document.getElementById("particleCount");
const fpsEl = document.getElementById("fps");
const particleInputEl = document.getElementById("particleInput");
const particleApplyEl = document.getElementById("particleApply");

const MIN_PARTICLES = 128;
const MAX_PARTICLES = 200000;
const DEFAULT_PARTICLES = 128;

const settings = {
  particleCount: DEFAULT_PARTICLES,
  radius: 0.2,
  ghat: 0.08,
  mass: 1.0,
  gravityY: -9.8,
  damping: 0.995,
  boxHalf: 4.2,
  forceLimit: 180.0,
  stiffnessScale: 0.75,
};

settings.particleCount = readParticleCountFromUrl();

if (particleInputEl) {
  particleInputEl.value = String(settings.particleCount);
}

function clampParticleCount(value) {
  const v = Math.round(Number(value));
  if (!Number.isFinite(v)) return DEFAULT_PARTICLES;
  return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, v));
}

function readParticleCountFromUrl() {
  if (typeof window === "undefined") return DEFAULT_PARTICLES;
  const params = new URLSearchParams(window.location.search || "");
  const raw = params.get("particles");
  if (!raw) return DEFAULT_PARTICLES;
  const parsed = parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_PARTICLES;
  return clampParticleCount(parsed);
}

function setParticleCountParam(count) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("particles", String(count));
  window.history.replaceState({}, "", url);
}

function createInitialParticles(count, radius) {
  const positions = new Float32Array(count * 4);
  const velocities = new Float32Array(count * 4);
  const side = Math.ceil(Math.cbrt(count));
  const spacing = radius * 2.35;
  const baseY = 1.6;
  let idx = 0;
  for (let y = 0; y < side && idx < count; y++) {
    for (let z = 0; z < side && idx < count; z++) {
      for (let x = 0; x < side && idx < count; x++) {
        const px = (x - side * 0.5) * spacing;
        const py = baseY + y * spacing;
        const pz = (z - side * 0.5) * spacing;
        positions[idx * 4 + 0] = px;
        positions[idx * 4 + 1] = py;
        positions[idx * 4 + 2] = pz;
        positions[idx * 4 + 3] = idx;
        velocities[idx * 4 + 0] = 0;
        velocities[idx * 4 + 1] = 0;
        velocities[idx * 4 + 2] = 0;
        velocities[idx * 4 + 3] = 0;
        idx++;
      }
    }
  }
  return { positions, velocities };
}

function updateCanvasSize() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.floor(canvas.clientWidth * dpr);
  const height = Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

function setError(message) {
  if (!errorEl) return;
  errorEl.textContent = message;
}

function applyParticleCountFromUi() {
  const next = clampParticleCount(particleInputEl?.value);
  if (particleInputEl) particleInputEl.value = String(next);
  setParticleCountParam(next);
  window.location.reload();
}

if (particleApplyEl) {
  particleApplyEl.addEventListener("click", () => applyParticleCountFromUi());
}
if (particleInputEl) {
  particleInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") applyParticleCountFromUi();
  });
}

async function main() {
  try {
    const { device } = await initWebGPU();
    const context = canvas.getContext("webgpu");
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "opaque" });

    const { positions, velocities } = createInitialParticles(settings.particleCount, settings.radius);

    const positionBuffer = device.createBuffer({
      size: positions.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });
    device.queue.writeBuffer(positionBuffer, 0, positions);

    const velocityBuffer = device.createBuffer({
      size: velocities.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });
    device.queue.writeBuffer(velocityBuffer, 0, velocities);

    const uniformBuffer = device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Cubic barrier gradient mirrors the ppf-contact-solver cubic.hpp reference.
    const shaderCode = `
      struct Params {
        dt: f32,
        ghat: f32,
        radius: f32,
        mass: f32,
        gravityY: f32,
        damping: f32,
        boxHalf: f32,
        forceLimit: f32,
        count: f32,
        stiffnessScale: f32,
        pad0: vec2<f32>,
      };

      @group(0) @binding(0) var<storage, read_write> positions: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> velocities: array<vec4<f32>>;
      @group(0) @binding(2) var<uniform> params: Params;

      fn cubic_gradient(g: f32, ghat: f32, offset: f32) -> f32 {
        let gg = g - offset;
        let y = gg - ghat;
        if (y < 0.0) {
          return -2.0 * y * y / ghat;
        }
        return 0.0;
      }

      fn barrier_force(g: f32, normal: vec3<f32>) -> vec3<f32> {
        if (g >= params.ghat) {
          return vec3(0.0);
        }
        let grad = cubic_gradient(g, params.ghat, 0.0);
        let denom = max(g * g, 1e-5);
        let stiff = params.stiffnessScale * params.mass / denom;
        let fmag = -grad * stiff;
        return normal * fmag;
      }

      fn apply_plane(pos: vec3<f32>, normal: vec3<f32>, planeD: f32) -> vec3<f32> {
        let g = dot(normal, pos) - planeD - params.radius;
        return barrier_force(g, normal);
      }

      @compute @workgroup_size(64)
      fn cs_main(@builtin(global_invocation_id) id: vec3<u32>) {
        let idx = id.x;
        let count = u32(params.count);
        if (idx >= count) {
          return;
        }

        var pos = positions[idx].xyz;
        var vel = velocities[idx].xyz;
        let idVal = positions[idx].w;

        var force = vec3<f32>(0.0, params.mass * params.gravityY, 0.0);

        force += apply_plane(pos, vec3<f32>(0.0, 1.0, 0.0), 0.0);
        force += apply_plane(pos, vec3<f32>(1.0, 0.0, 0.0), -params.boxHalf);
        force += apply_plane(pos, vec3<f32>(-1.0, 0.0, 0.0), -params.boxHalf);
        force += apply_plane(pos, vec3<f32>(0.0, 0.0, 1.0), -params.boxHalf);
        force += apply_plane(pos, vec3<f32>(0.0, 0.0, -1.0), -params.boxHalf);

        for (var j: u32 = 0u; j < count; j = j + 1u) {
          if (j == idx) {
            continue;
          }
          let other = positions[j].xyz;
          let dir = pos - other;
          let dist = length(dir);
          let g = dist - (params.radius * 2.0);
          if (g < params.ghat) {
            let normal = dir / max(dist, 1e-5);
            force += barrier_force(g, normal);
          }
        }

        let fLen = length(force);
        if (fLen > params.forceLimit) {
          force = (force / fLen) * params.forceLimit;
        }

        vel = vel + (force / params.mass) * params.dt;
        vel = vel * params.damping;
        pos = pos + vel * params.dt;

        positions[idx] = vec4<f32>(pos, idVal);
        velocities[idx] = vec4<f32>(vel, 0.0);
      }
    `;

    const shaderModule = device.createShaderModule({ code: shaderCode });
    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
      ],
    });

    const pipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
      compute: { module: shaderModule, entryPoint: "cs_main" },
    });

    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: positionBuffer } },
        { binding: 1, resource: { buffer: velocityBuffer } },
        { binding: 2, resource: { buffer: uniformBuffer } },
      ],
    });

    const renderer = new ParticleRenderer(device);
    renderer.updateBindGroup(positionBuffer);

    const camera = new OrbitCamera(canvas, { radius: 12, target: [0, 1, 0] });

    let depthTexture = null;
    function ensureDepthTexture() {
      if (!updateCanvasSize() && depthTexture) return;
      if (depthTexture) depthTexture.destroy();
      depthTexture = device.createTexture({
        size: [canvas.width, canvas.height],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
    }

    const uniformData = new Float32Array(16);
    let lastTime = performance.now();
    let fpsSma = 60;

    function writeUniforms(dt) {
      uniformData[0] = dt;
      uniformData[1] = settings.ghat;
      uniformData[2] = settings.radius;
      uniformData[3] = settings.mass;
      uniformData[4] = settings.gravityY;
      uniformData[5] = settings.damping;
      uniformData[6] = settings.boxHalf;
      uniformData[7] = settings.forceLimit;
      uniformData[8] = settings.particleCount;
      uniformData[9] = settings.stiffnessScale;
      device.queue.writeBuffer(uniformBuffer, 0, uniformData);
    }

    function frame(now) {
      const dt = Math.min(Math.max((now - lastTime) * 0.001, 0.0), 0.032);
      lastTime = now;
      const fps = dt > 1e-6 ? 1 / dt : 0;
      fpsSma = fpsSma * 0.9 + fps * 0.1;
      if (fpsEl) fpsEl.textContent = fpsSma.toFixed(1);
      if (particleCountEl) particleCountEl.textContent = settings.particleCount;

      writeUniforms(dt);
      ensureDepthTexture();

      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.dispatchWorkgroups(Math.ceil(settings.particleCount / 64));
      pass.end();

      const textureView = context.getCurrentTexture().createView();
      const renderPass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: textureView,
            clearValue: { r: 0.02, g: 0.03, b: 0.025, a: 1.0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
        depthStencilAttachment: {
          view: depthTexture.createView(),
          depthClearValue: 1.0,
          depthLoadOp: "clear",
          depthStoreOp: "store",
        },
      });

      const aspect = canvas.width / Math.max(1, canvas.height);
      const viewProj = camera.getViewProj(aspect);
      renderer.updateViewProj(viewProj, settings.radius);
      renderer.record(renderPass, settings.particleCount);
      renderPass.end();

      device.queue.submit([encoder.finish()]);
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", () => {
      ensureDepthTexture();
    });

    ensureDepthTexture();
    requestAnimationFrame(frame);
  } catch (err) {
    console.error(err);
    setError(err.message || "Failed to start WebGPU demo");
  }
}

main();
