import { initWebGPU } from "../src/index.js";
import { ParticleRenderer } from "./shared/particleRenderer.js";
import { OrbitCamera } from "./shared/orbitControls.js";

const canvas = document.getElementById("canvas");
const errorEl = document.getElementById("error");
const particleCountEl = document.getElementById("particleCount");
const fpsEl = document.getElementById("fps");
const particleInputEl = document.getElementById("particleInput");
const particleApplyEl = document.getElementById("particleApply");
const iterInputEl = document.getElementById("iterInput");
const iterValueEl = document.getElementById("iterValue");
const frictionInputEl = document.getElementById("frictionInput");
const frictionValueEl = document.getElementById("frictionValue");

const MIN_PARTICLES = 128;
const MAX_PARTICLES = 200000;
const DEFAULT_PARTICLES = 1024;
const WORKGROUP_SIZE = 64;

const settings = {
  particleCount: DEFAULT_PARTICLES,
  radius: 0.2,
  ghat: 0.08,
  mass: 1.0,
  gravityY: -9.8,
  damping: 0.995,
  boxHalf: 20.0,
  forceLimit: 220.0,
  stiffnessScale: 0.75,
  solverIterations: 8,
  friction: 0.35,
  frictionEps: 0.001,
};

settings.particleCount = readParticleCountFromUrl();

if (particleInputEl) {
  particleInputEl.value = String(settings.particleCount);
}
if (iterInputEl && iterValueEl) {
  iterInputEl.value = String(settings.solverIterations);
  iterValueEl.textContent = String(settings.solverIterations);
}
if (frictionInputEl && frictionValueEl) {
  frictionInputEl.value = String(settings.friction);
  frictionValueEl.textContent = settings.friction.toFixed(2);
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

function createInitialParticles(count, radius, boxHalf) {
  const positions = new Float32Array(count * 4);
  const velocities = new Float32Array(count * 4);
  const side = Math.ceil(Math.cbrt(count));
  const maxSpan = boxHalf * 1.6;
  const spacing = Math.min(radius * 2.2, maxSpan / Math.max(1, side - 1));
  const halfSpan = spacing * (side - 1) * 0.5;
  let idx = 0;
  for (let y = 0; y < side && idx < count; y++) {
    for (let z = 0; z < side && idx < count; z++) {
      for (let x = 0; x < side && idx < count; x++) {
        const px = (x * spacing - halfSpan);
        const py = (y * spacing - halfSpan) + boxHalf * 0.35;
        const pz = (z * spacing - halfSpan);
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
if (iterInputEl && iterValueEl) {
  iterInputEl.addEventListener("input", () => {
    const next = Math.max(1, Math.min(32, Math.round(Number(iterInputEl.value))));
    settings.solverIterations = next;
    iterValueEl.textContent = String(next);
  });
}
if (frictionInputEl && frictionValueEl) {
  frictionInputEl.addEventListener("input", () => {
    const next = Math.max(0, Math.min(1, Number(frictionInputEl.value)));
    settings.friction = next;
    frictionValueEl.textContent = next.toFixed(2);
  });
}

function createGridConfig(count, radius, ghat, boxHalf) {
  const contactRadius = radius * 2 + ghat;
  const boxSize = boxHalf * 2;
  const targetCellCount = Math.min(262144, Math.max(4096, Math.ceil(count * 0.75)));
  const targetDim = Math.max(1, Math.ceil(Math.cbrt(targetCellCount)));
  // Keep the grid bounded while still covering contact radius with a 3x3x3 neighborhood.
  const cellSize = Math.max(contactRadius * 1.05, boxSize / targetDim);
  const dim = Math.max(1, Math.ceil(boxSize / cellSize));
  const cellCount = dim * dim * dim;
  const avg = count / Math.max(1, cellCount);
  const cellCapacity = Math.min(256, Math.max(32, Math.ceil(avg * 12)));
  return {
    cellSize,
    dim: [dim, dim, dim],
    cellCount,
    cellCapacity,
    min: [-boxHalf, -boxHalf, -boxHalf],
  };
}

async function main() {
  try {
    const { device } = await initWebGPU();
    const context = canvas.getContext("webgpu");
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "opaque" });

    const grid = createGridConfig(
      settings.particleCount,
      settings.radius,
      settings.ghat,
      settings.boxHalf
    );

    const { positions, velocities } = createInitialParticles(
      settings.particleCount,
      settings.radius,
      settings.boxHalf
    );

    const positionBytes = positions.byteLength;
    const velocityBytes = velocities.byteLength;
    const positionBuffers = [
      device.createBuffer({
        size: positionBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      }),
      device.createBuffer({
        size: positionBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      }),
    ];
    const velocityBuffers = [
      device.createBuffer({
        size: velocityBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      }),
      device.createBuffer({
        size: velocityBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      }),
    ];
    const prevPositionBuffer = device.createBuffer({
      size: positionBytes,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });

    device.queue.writeBuffer(positionBuffers[0], 0, positions);
    device.queue.writeBuffer(positionBuffers[1], 0, positions);
    device.queue.writeBuffer(velocityBuffers[0], 0, velocities);
    device.queue.writeBuffer(velocityBuffers[1], 0, velocities);
    device.queue.writeBuffer(prevPositionBuffer, 0, positions);

    const gridCountsBuffer = device.createBuffer({
      size: grid.cellCount * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });
    const gridIndicesBuffer = device.createBuffer({
      size: grid.cellCount * grid.cellCapacity * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const gridOverflowBuffer = device.createBuffer({
      size: 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    });

    const uniformBufferSize = 96;
    const uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const clearShader = `
      @group(0) @binding(0) var<storage, read_write> gridCounts: array<atomic<u32>>;
      @group(0) @binding(1) var<storage, read_write> overflow: atomic<u32>;

      @compute @workgroup_size(${WORKGROUP_SIZE})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x < arrayLength(&gridCounts)) {
          atomicStore(&gridCounts[id.x], 0u);
        }
        if (id.x == 0u) {
          atomicStore(&overflow, 0u);
        }
      }
    `;

    const paramsStruct = `
      struct SimParams {
        sim0: vec4<f32>,
        sim1: vec4<f32>,
        sim2: vec4<f32>,
        gridMin: vec4<f32>,
        gridDim: vec4<u32>,
        counts: vec4<u32>,
      };
    `;

    const buildShader = `
      ${paramsStruct}

      @group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> gridCounts: array<atomic<u32>>;
      @group(0) @binding(2) var<storage, read_write> gridIndices: array<u32>;
      @group(0) @binding(3) var<storage, read_write> overflow: atomic<u32>;
      @group(0) @binding(4) var<uniform> params: SimParams;

      @compute @workgroup_size(${WORKGROUP_SIZE})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x >= params.counts.x) {
          return;
        }
        let pos = positions[id.x].xyz;
        let cellF = (pos - params.gridMin.xyz) / params.sim2.z;
        let cell = vec3<i32>(floor(cellF));
        let maxCell = vec3<i32>(i32(params.gridDim.x) - 1, i32(params.gridDim.y) - 1, i32(params.gridDim.z) - 1);
        let clamped = clamp(cell, vec3<i32>(0), maxCell);
        let cellIndex = u32(clamped.x) * params.gridDim.y * params.gridDim.z +
          u32(clamped.y) * params.gridDim.z +
          u32(clamped.z);
        let offset = atomicAdd(&gridCounts[cellIndex], 1u);
        if (offset < params.gridDim.w) {
          let base = cellIndex * params.gridDim.w;
          gridIndices[base + offset] = id.x;
        } else {
          atomicAdd(&overflow, 1u);
        }
      }
    `;

    const solveShader = `
      ${paramsStruct}

      @group(0) @binding(0) var<storage, read> positionsIn: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read> velocitiesIn: array<vec4<f32>>;
      @group(0) @binding(2) var<storage, read> prevPositions: array<vec4<f32>>;
      @group(0) @binding(3) var<storage, read> gridCounts: array<u32>;
      @group(0) @binding(4) var<storage, read> gridIndices: array<u32>;
      @group(0) @binding(5) var<uniform> params: SimParams;
      @group(0) @binding(6) var<storage, read_write> positionsOut: array<vec4<f32>>;
      @group(0) @binding(7) var<storage, read_write> velocitiesOut: array<vec4<f32>>;

      fn cubic_gradient(g: f32, ghat: f32) -> f32 {
        let y = g - ghat;
        if (y < 0.0) {
          return -2.0 * y * y / ghat;
        }
        return 0.0;
      }

      fn barrier_force(g: f32, normal: vec3<f32>) -> vec3<f32> {
        if (g >= params.sim0.z) {
          return vec3(0.0);
        }
        let grad = cubic_gradient(g, params.sim0.z);
        let denom = max(g * g, 1e-5);
        let stiff = params.sim2.x * params.sim0.w / denom;
        let fmag = -grad * stiff;
        return normal * fmag;
      }

      fn friction_force(normal: vec3<f32>, contact: vec3<f32>, disp: vec3<f32>) -> vec3<f32> {
        let mu = params.sim2.y;
        let fmag = length(contact);
        if (mu <= 0.0 || fmag <= 0.0) {
          return vec3(0.0);
        }
        let tang = disp - normal * dot(disp, normal);
        let tLen = length(tang);
        if (tLen <= 1e-6) {
          return vec3(0.0);
        }
        let denom = max(params.sim2.w, tLen);
        let scale = mu * fmag / denom;
        return -tang * scale;
      }

      fn plane_contact(pos: vec3<f32>, prevPos: vec3<f32>, normal: vec3<f32>, planeD: f32) -> vec3<f32> {
        let g = dot(normal, pos) - planeD - params.sim0.y;
        if (g >= params.sim0.z) {
          return vec3(0.0);
        }
        let contact = barrier_force(g, normal);
        let disp = pos - prevPos;
        return contact + friction_force(normal, contact, disp);
      }

      fn particle_contact(
        pos: vec3<f32>,
        prevPos: vec3<f32>,
        otherPos: vec3<f32>,
        otherPrev: vec3<f32>
      ) -> vec3<f32> {
        let dir = pos - otherPos;
        let dist = length(dir);
        let g = dist - params.sim0.y * 2.0;
        if (g >= params.sim0.z) {
          return vec3(0.0);
        }
        let normal = dir / max(dist, 1e-5);
        let contact = barrier_force(g, normal);
        let disp = (pos - prevPos) - (otherPos - otherPrev);
        return contact + friction_force(normal, contact, disp);
      }

      @compute @workgroup_size(${WORKGROUP_SIZE})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x >= params.counts.x) {
          return;
        }

        let posIn = positionsIn[id.x];
        var pos = posIn.xyz;
        var vel = velocitiesIn[id.x].xyz;
        let prevPos = prevPositions[id.x].xyz;

        var force = vec3<f32>(0.0, params.sim0.w * params.sim1.x, 0.0);

        force += plane_contact(pos, prevPos, vec3<f32>(1.0, 0.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(-1.0, 0.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, 1.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, -1.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, 0.0, 1.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, 0.0, -1.0), -params.sim1.z);

        let cellF = (pos - params.gridMin.xyz) / params.sim2.z;
        let cell = vec3<i32>(floor(cellF));
        let maxCell = vec3<i32>(i32(params.gridDim.x) - 1, i32(params.gridDim.y) - 1, i32(params.gridDim.z) - 1);
        let baseCell = clamp(cell, vec3<i32>(0), maxCell);

        for (var dx = -1; dx <= 1; dx = dx + 1) {
          for (var dy = -1; dy <= 1; dy = dy + 1) {
            for (var dz = -1; dz <= 1; dz = dz + 1) {
              let neighbor = baseCell + vec3<i32>(dx, dy, dz);
              if (neighbor.x < 0 || neighbor.y < 0 || neighbor.z < 0 ||
                  neighbor.x > maxCell.x || neighbor.y > maxCell.y || neighbor.z > maxCell.z) {
                continue;
              }
              let cellIndex = u32(neighbor.x) * params.gridDim.y * params.gridDim.z +
                u32(neighbor.y) * params.gridDim.z +
                u32(neighbor.z);
              let count = min(gridCounts[cellIndex], params.gridDim.w);
              let base = cellIndex * params.gridDim.w;
              for (var i = 0u; i < count; i = i + 1u) {
                let otherIndex = gridIndices[base + i];
                if (otherIndex == id.x) {
                  continue;
                }
                let otherPos = positionsIn[otherIndex].xyz;
                let otherPrev = prevPositions[otherIndex].xyz;
                force += particle_contact(pos, prevPos, otherPos, otherPrev);
              }
            }
          }
        }

        let fLen = length(force);
        if (fLen > params.sim1.w) {
          force = (force / fLen) * params.sim1.w;
        }

        let iterCount = max(1u, params.counts.y);
        let dt = params.sim0.x / f32(iterCount);
        vel = vel + (force / params.sim0.w) * dt;
        vel = vel * params.sim1.y;
        pos = pos + vel * dt;
        let minPos = vec3<f32>(-params.sim1.z + params.sim0.y);
        let maxPos = vec3<f32>(params.sim1.z - params.sim0.y);
        pos = clamp(pos, minPos, maxPos);

        positionsOut[id.x] = vec4<f32>(pos, posIn.w);
        velocitiesOut[id.x] = vec4<f32>(vel, 0.0);
      }
    `;

    const clearModule = device.createShaderModule({ code: clearShader });
    const buildModule = device.createShaderModule({ code: buildShader });
    const solveModule = device.createShaderModule({ code: solveShader });

    const clearPipeline = device.createComputePipeline({
      layout: "auto",
      compute: { module: clearModule, entryPoint: "main" },
    });
    const buildPipeline = device.createComputePipeline({
      layout: "auto",
      compute: { module: buildModule, entryPoint: "main" },
    });
    const solvePipeline = device.createComputePipeline({
      layout: "auto",
      compute: { module: solveModule, entryPoint: "main" },
    });

    const clearBindGroup = device.createBindGroup({
      layout: clearPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: gridCountsBuffer } },
        { binding: 1, resource: { buffer: gridOverflowBuffer } },
      ],
    });

    const buildBindGroups = positionBuffers.map((buffer) =>
      device.createBindGroup({
        layout: buildPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer } },
          { binding: 1, resource: { buffer: gridCountsBuffer } },
          { binding: 2, resource: { buffer: gridIndicesBuffer } },
          { binding: 3, resource: { buffer: gridOverflowBuffer } },
          { binding: 4, resource: { buffer: uniformBuffer } },
        ],
      })
    );

    const solveBindGroups = [
      device.createBindGroup({
        layout: solvePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: positionBuffers[0] } },
          { binding: 1, resource: { buffer: velocityBuffers[0] } },
          { binding: 2, resource: { buffer: prevPositionBuffer } },
          { binding: 3, resource: { buffer: gridCountsBuffer } },
          { binding: 4, resource: { buffer: gridIndicesBuffer } },
          { binding: 5, resource: { buffer: uniformBuffer } },
          { binding: 6, resource: { buffer: positionBuffers[1] } },
          { binding: 7, resource: { buffer: velocityBuffers[1] } },
        ],
      }),
      device.createBindGroup({
        layout: solvePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: positionBuffers[1] } },
          { binding: 1, resource: { buffer: velocityBuffers[1] } },
          { binding: 2, resource: { buffer: prevPositionBuffer } },
          { binding: 3, resource: { buffer: gridCountsBuffer } },
          { binding: 4, resource: { buffer: gridIndicesBuffer } },
          { binding: 5, resource: { buffer: uniformBuffer } },
          { binding: 6, resource: { buffer: positionBuffers[0] } },
          { binding: 7, resource: { buffer: velocityBuffers[0] } },
        ],
      }),
    ];

    const renderer = new ParticleRenderer(device);
    renderer.updateBindGroup(positionBuffers[0]);

    const camera = new OrbitCamera(canvas, { radius: 48, target: [0, 0, 0] });

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

    const uniformData = new ArrayBuffer(uniformBufferSize);
    const uniformFloats = new Float32Array(uniformData);
    const uniformU32 = new Uint32Array(uniformData);
    let lastTime = performance.now();
    let fpsSma = 60;
    let ping = 0;
    let renderBufferIndex = 0;

    function writeUniforms(dt) {
      uniformFloats[0] = dt;
      uniformFloats[1] = settings.radius;
      uniformFloats[2] = settings.ghat;
      uniformFloats[3] = settings.mass;
      uniformFloats[4] = settings.gravityY;
      uniformFloats[5] = settings.damping;
      uniformFloats[6] = settings.boxHalf;
      uniformFloats[7] = settings.forceLimit;
      uniformFloats[8] = settings.stiffnessScale;
      uniformFloats[9] = settings.friction;
      uniformFloats[10] = grid.cellSize;
      uniformFloats[11] = settings.frictionEps;
      uniformFloats[12] = grid.min[0];
      uniformFloats[13] = grid.min[1];
      uniformFloats[14] = grid.min[2];
      uniformFloats[15] = 0;
      uniformU32[16] = grid.dim[0];
      uniformU32[17] = grid.dim[1];
      uniformU32[18] = grid.dim[2];
      uniformU32[19] = grid.cellCapacity;
      uniformU32[20] = settings.particleCount;
      uniformU32[21] = settings.solverIterations;
      uniformU32[22] = 0;
      uniformU32[23] = 0;
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
      encoder.copyBufferToBuffer(positionBuffers[ping], 0, prevPositionBuffer, 0, positionBytes);

      const clearPass = encoder.beginComputePass();
      clearPass.setPipeline(clearPipeline);
      clearPass.setBindGroup(0, clearBindGroup);
      clearPass.dispatchWorkgroups(Math.ceil(grid.cellCount / WORKGROUP_SIZE));
      clearPass.end();

      const buildPass = encoder.beginComputePass();
      buildPass.setPipeline(buildPipeline);
      buildPass.setBindGroup(0, buildBindGroups[ping]);
      buildPass.dispatchWorkgroups(Math.ceil(settings.particleCount / WORKGROUP_SIZE));
      buildPass.end();

      for (let i = 0; i < settings.solverIterations; i++) {
        const solvePass = encoder.beginComputePass();
        solvePass.setPipeline(solvePipeline);
        solvePass.setBindGroup(0, solveBindGroups[ping]);
        solvePass.dispatchWorkgroups(Math.ceil(settings.particleCount / WORKGROUP_SIZE));
        solvePass.end();
        ping = 1 - ping;
      }

      if (ping !== renderBufferIndex) {
        renderBufferIndex = ping;
        renderer.updateBindGroup(positionBuffers[renderBufferIndex]);
      }

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
