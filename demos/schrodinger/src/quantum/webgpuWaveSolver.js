import { hashSeed } from '../core/random.js';
import {
  correctedRadialCharge,
  effectiveNuclearCharge
} from './orbitals.js';
import { HARTREE_EV, estimateOrbitalExtentBohr, hydrogenicEnergyEv } from './references.js';

let cachedDevicePromise = null;

export const RADIAL_WEBGPU_EIGENSOLVER_SCHEMA =
  'peercompute.schrodinger.radial-webgpu-eigensolver.v0';
export const ORBITAL_GRID_WEBGPU_SCHEMA =
  'peercompute.schrodinger.orbital-grid-webgpu.v0';

const BOHR_RADIUS_NM = 0.0529177210903;
const ATOMIC_TIME_AS = 24.188843265857;
const MIN_GRID_POINTS = 96;
const MAX_GRID_POINTS = 768;
const RADIAL_WORKGROUP_SIZE = 128;
const ORBITAL_GRID_WORKGROUP_SIZE = 128;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const finiteNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeGridPointCount = (value, n) => {
  const fallback = clamp(Math.round(192 + Math.max(1, n) * 32), MIN_GRID_POINTS, 512);
  return Math.round(clamp(finiteNumber(value, fallback), MIN_GRID_POINTS, MAX_GRID_POINTS));
};

const estimateDefaultExtentBohr = ({ n, radialZ }) => {
  const safeZ = Math.max(0.25, radialZ);
  const analyticExtent = estimateOrbitalExtentBohr({ n, zEff: safeZ, scale: 10 });
  return clamp(Math.max(18 / safeZ, analyticExtent), 8 / safeZ, 420);
};

const countRadialNodes = (values) => {
  let maxAbs = 0;
  for (const value of values) maxAbs = Math.max(maxAbs, Math.abs(value));
  const threshold = maxAbs * 1e-4;
  let previousSign = 0;
  let nodes = 0;
  for (const value of values) {
    if (Math.abs(value) <= threshold) continue;
    const sign = value < 0 ? -1 : 1;
    if (previousSign !== 0 && sign !== previousSign) nodes += 1;
    previousSign = sign;
  }
  return nodes;
};

const classifyRadialWebGpuStatus = ({ energyErrorEv, residualRelativeL2, potentialModel }) => {
  if (potentialModel !== 'coulomb') {
    return residualRelativeL2 < 2e-3 ? 'webgpu-screened-converged' : 'webgpu-screened-watch';
  }
  if (Math.abs(energyErrorEv) < 0.08 && residualRelativeL2 < 2e-3) return 'webgpu-converged';
  if (Math.abs(energyErrorEv) < 0.35 && residualRelativeL2 < 1e-2) return 'webgpu-watch';
  return 'webgpu-refine';
};

const createStorageBuffer = (device, label, byteLength, extraUsage = 0) => device.createBuffer({
  label,
  size: Math.max(4, byteLength),
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | extraUsage
});

const readFloat32Buffer = async (device, sourceBuffer, byteLength, label) => {
  const readback = device.createBuffer({
    label,
    size: Math.max(4, byteLength),
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
  });
  const encoder = device.createCommandEncoder();
  encoder.copyBufferToBuffer(sourceBuffer, 0, readback, 0, Math.max(4, byteLength));
  device.queue.submit([encoder.finish()]);
  await readback.mapAsync(GPUMapMode.READ);
  const copy = readback.getMappedRange().slice(0, byteLength);
  readback.unmap();
  readback.destroy();
  return new Float32Array(copy);
};

const sumPartialVec4 = (partials) => {
  const sums = [0, 0, 0, 0];
  for (let i = 0; i < partials.length; i += 4) {
    sums[0] += partials[i];
    sums[1] += partials[i + 1];
    sums[2] += partials[i + 2];
    sums[3] += partials[i + 3];
  }
  return sums;
};

const buildRadialSamples = ({ vector, spacing, pointCount }) => {
  const radialSamples = [];
  const sampleStride = Math.max(1, Math.floor(pointCount / 96));
  for (let i = 0; i < pointCount; i += sampleStride) {
    radialSamples.push({
      rBohr: (i + 1) * spacing,
      u: vector[i],
      probabilityDensity: vector[i] * vector[i]
    });
  }
  const last = pointCount - 1;
  if (radialSamples[radialSamples.length - 1]?.rBohr !== (last + 1) * spacing) {
    radialSamples.push({
      rBohr: (last + 1) * spacing,
      u: vector[last],
      probabilityDensity: vector[last] * vector[last]
    });
  }
  return radialSamples;
};

export const getWebGPUStatus = async () => {
  if (typeof navigator === 'undefined' || !navigator.gpu) {
    return { available: false, backend: 'none', reason: 'navigator.gpu unavailable' };
  }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return { available: false, backend: 'webgpu', reason: 'requestAdapter returned null' };
    return {
      available: true,
      backend: 'webgpu',
      reason: 'ok',
      adapterInfo: adapter.info || null
    };
  } catch (err) {
    return { available: false, backend: 'webgpu', reason: err.message || String(err) };
  }
};

const getDevice = async () => {
  if (!cachedDevicePromise) {
    cachedDevicePromise = (async () => {
      if (typeof navigator === 'undefined' || !navigator.gpu) {
        throw new Error('WebGPU unavailable');
      }
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw new Error('No WebGPU adapter available');
      return adapter.requestDevice();
    })();
  }
  return cachedDevicePromise;
};

export const solveRadialSchrodingerEigenstateGpu = async ({
  element = null,
  atomicNumber = null,
  n = 1,
  l = 0,
  zEff = null,
  options = {},
  gridPointCount = null,
  radialExtentBohr = null,
  gpuDevice = null
} = {}) => {
  const device = gpuDevice || await getDevice();
  const principalN = Math.max(1, Math.round(finiteNumber(n, 1)));
  const angularL = Math.max(0, Math.round(finiteNumber(l, 0)));
  if (angularL >= principalN) {
    throw new Error('radial WebGPU eigensolver requires 0 <= l < n');
  }

  const sourceZ = Math.max(1, Math.round(finiteNumber(atomicNumber, element?.Z || 1)));
  const baseZEff = Math.max(
    0.05,
    finiteNumber(
      zEff,
      element ? effectiveNuclearCharge(element, principalN, angularL, options) : sourceZ
    )
  );
  const radialZ = correctedRadialCharge(baseZEff, principalN, angularL, options);
  const pointCount = normalizeGridPointCount(gridPointCount, principalN);
  const extent = Math.max(
    1,
    finiteNumber(radialExtentBohr, estimateDefaultExtentBohr({ n: principalN, radialZ }))
  );
  const spacing = extent / (pointCount + 1);
  const debyeLengthBohr = finiteNumber(options.debyeLengthBohr, Infinity);
  const softeningBohr = Math.max(0, finiteNumber(options.coulombSofteningBohr, 0));
  const potentialModel = options.debyeLengthBohr || options.coulombSofteningBohr
    ? 'screened-softened-coulomb'
    : 'coulomb';
  const analyticEnergyHartree = hydrogenicEnergyEv({ n: principalN, zEff: radialZ }) / HARTREE_EV;
  const partialCount = Math.max(1, Math.ceil(pointCount / RADIAL_WORKGROUP_SIZE));
  const shader = device.createShaderModule({
    label: 'schrodinger-radial-webgpu-eigensolver',
    code: `
      @group(0) @binding(0) var<storage, read> params: array<f32>;
      @group(0) @binding(1) var<storage, read_write> waveU: array<f32>;
      @group(0) @binding(2) var<storage, read_write> residuals: array<f32>;
      @group(0) @binding(3) var<storage, read_write> partials: array<vec4f>;

      var<workgroup> localPartial: array<vec4f, ${RADIAL_WORKGROUP_SIZE}>;

      fn paramU(index: u32) -> u32 {
        return u32(max(0.0, params[index]) + 0.5);
      }

      fn factorialF(n: u32) -> f32 {
        var out = 1.0;
        var i = 2u;
        loop {
          if (i > n) {
            break;
          }
          out = out * f32(i);
          i = i + 1u;
        }
        return out;
      }

      fn binomialF(n: u32, k: u32) -> f32 {
        if (k > n) {
          return 0.0;
        }
        return factorialF(n) / max(1.0, factorialF(k) * factorialF(n - k));
      }

      fn associatedLaguerre(p: u32, k: u32, x: f32) -> f32 {
        var sum = 0.0;
        var i = 0u;
        loop {
          if (i > p) {
            break;
          }
          var sign = 1.0;
          if ((i % 2u) == 1u) {
            sign = -1.0;
          }
          sum = sum + sign * binomialF(p + k, p - i) * pow(x, f32(i)) / max(1.0, factorialF(i));
          i = i + 1u;
        }
        return sum;
      }

      fn radialUAtRadius(r: f32) -> f32 {
        let principalN = paramU(1u);
        let angularL = paramU(2u);
        let nF = max(1.0, f32(principalN));
        let lF = f32(angularL);
        let radialZ = max(0.0001, params[3u]);
        let rho = (2.0 * radialZ * max(r, 0.000001)) / nF;
        let laguerreP = principalN - angularL - 1u;
        let laguerreK = 2u * angularL + 1u;
        let numerator = factorialF(laguerreP);
        let denominator = max(1.0, 2.0 * nF * factorialF(principalN + angularL));
        let prefactor = sqrt(pow((2.0 * radialZ) / nF, 3.0) * numerator / denominator);
        return r * prefactor * exp(-0.5 * rho) * pow(rho, lF) * associatedLaguerre(laguerreP, laguerreK, rho);
      }

      fn rawUAtSlot(slot: i32) -> f32 {
        let count = i32(paramU(0u));
        if (slot <= 0 || slot > count) {
          return 0.0;
        }
        return radialUAtRadius(f32(slot) * params[4u]);
      }

      fn potentialAtRadius(r: f32) -> f32 {
        let angularL = f32(paramU(2u));
        let radialZ = max(0.0001, params[3u]);
        let softening = max(0.0, params[7u]);
        var denominator = max(r, 0.000001);
        if (softening > 0.0) {
          denominator = sqrt(r * r + softening * softening);
        }
        var screening = 1.0;
        let debyeLength = params[6u];
        if (debyeLength > 0.0) {
          screening = exp(-r / debyeLength);
        }
        let coulomb = -radialZ * screening / denominator;
        let centrifugal = angularL * (angularL + 1.0) / max(0.000001, 2.0 * r * r);
        return coulomb + centrifugal;
      }

      fn hamiltonianRawAtIndex(index: u32) -> f32 {
        let spacing = params[4u];
        let slot = i32(index) + 1;
        let r = f32(slot) * spacing;
        let u = rawUAtSlot(slot);
        let left = rawUAtSlot(slot - 1);
        let right = rawUAtSlot(slot + 1);
        let secondDerivative = (left - 2.0 * u + right) / max(0.0000001, spacing * spacing);
        return -0.5 * secondDerivative + potentialAtRadius(r) * u;
      }

      fn reduceLocal(localIndex: u32, workgroupIndex: u32) {
        workgroupBarrier();
        var stride = ${RADIAL_WORKGROUP_SIZE / 2}u;
        loop {
          if (stride == 0u) {
            break;
          }
          if (localIndex < stride) {
            localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
          }
          workgroupBarrier();
          stride = stride / 2u;
        }
        if (localIndex == 0u) {
          partials[workgroupIndex] = localPartial[0u];
        }
      }

      @compute @workgroup_size(${RADIAL_WORKGROUP_SIZE})
      fn prepare(
        @builtin(global_invocation_id) gid: vec3u,
        @builtin(local_invocation_id) lid: vec3u,
        @builtin(workgroup_id) wid: vec3u
      ) {
        let index = gid.x;
        let localIndex = lid.x;
        let count = paramU(0u);
        var sum = vec4f(0.0, 0.0, 0.0, 0.0);
        if (index < count) {
          let slot = i32(index) + 1;
          let spacing = params[4u];
          let r = f32(slot) * spacing;
          let u = rawUAtSlot(slot);
          let h = hamiltonianRawAtIndex(index);
          let density = u * u;
          waveU[index] = u;
          residuals[index] = 0.0;
          sum = vec4f(
            density * spacing,
            u * h * spacing,
            density * r * spacing,
            density * r * r * spacing
          );
        }
        localPartial[localIndex] = sum;
        reduceLocal(localIndex, wid.x);
      }

      @compute @workgroup_size(${RADIAL_WORKGROUP_SIZE})
      fn diagnose(
        @builtin(global_invocation_id) gid: vec3u,
        @builtin(local_invocation_id) lid: vec3u,
        @builtin(workgroup_id) wid: vec3u
      ) {
        let index = gid.x;
        let localIndex = lid.x;
        let count = paramU(0u);
        var sum = vec4f(0.0, 0.0, 0.0, 0.0);
        if (index < count) {
          let slot = i32(index) + 1;
          let spacing = params[4u];
          let r = f32(slot) * spacing;
          let normScale = params[10u];
          let energy = params[11u];
          let u = rawUAtSlot(slot) * normScale;
          let h = hamiltonianRawAtIndex(index) * normScale;
          let residual = h - energy * u;
          let reference = energy * u;
          let density = u * u;
          waveU[index] = u;
          residuals[index] = residual;
          sum = vec4f(
            density * spacing,
            residual * residual * spacing,
            reference * reference * spacing,
            density * r * spacing
          );
        }
        localPartial[localIndex] = sum;
        reduceLocal(localIndex, wid.x);
      }
    `
  });
  const bindGroupLayout = device.createBindGroupLayout({
    label: 'schrodinger-radial-webgpu-bindgroup-layout',
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }
    ]
  });
  const pipelineLayout = device.createPipelineLayout({
    label: 'schrodinger-radial-webgpu-pipeline-layout',
    bindGroupLayouts: [bindGroupLayout]
  });
  const preparePipeline = device.createComputePipeline({
    label: 'schrodinger-radial-webgpu-prepare-pipeline',
    layout: pipelineLayout,
    compute: { module: shader, entryPoint: 'prepare' }
  });
  const diagnosePipeline = device.createComputePipeline({
    label: 'schrodinger-radial-webgpu-diagnose-pipeline',
    layout: pipelineLayout,
    compute: { module: shader, entryPoint: 'diagnose' }
  });

  const params = new Float32Array(16);
  params[0] = pointCount;
  params[1] = principalN;
  params[2] = angularL;
  params[3] = radialZ;
  params[4] = spacing;
  params[5] = extent;
  params[6] = Number.isFinite(debyeLengthBohr) && debyeLengthBohr > 0 ? debyeLengthBohr : 0;
  params[7] = softeningBohr;
  params[8] = analyticEnergyHartree;
  params[9] = potentialModel === 'coulomb' ? 0 : 1;
  params[10] = 1;
  params[11] = analyticEnergyHartree;

  const paramsBuffer = device.createBuffer({
    label: 'schrodinger-radial-webgpu-params',
    size: params.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  const waveBuffer = createStorageBuffer(device, 'schrodinger-radial-webgpu-wave-u', pointCount * 4);
  const residualBuffer = createStorageBuffer(device, 'schrodinger-radial-webgpu-residuals', pointCount * 4);
  const partialBuffer = createStorageBuffer(device, 'schrodinger-radial-webgpu-partials', partialCount * 16);
  const bindGroup = device.createBindGroup({
    label: 'schrodinger-radial-webgpu-bindgroup',
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: paramsBuffer } },
      { binding: 1, resource: { buffer: waveBuffer } },
      { binding: 2, resource: { buffer: residualBuffer } },
      { binding: 3, resource: { buffer: partialBuffer } }
    ]
  });

  device.queue.writeBuffer(paramsBuffer, 0, params);
  let encoder = device.createCommandEncoder();
  let pass = encoder.beginComputePass({ label: 'schrodinger-radial-webgpu-prepare-pass' });
  pass.setPipeline(preparePipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(partialCount);
  pass.end();
  device.queue.submit([encoder.finish()]);

  const preparePartials = await readFloat32Buffer(
    device,
    partialBuffer,
    partialCount * 16,
    'schrodinger-radial-webgpu-prepare-readback'
  );
  const [rawNorm, rawEnergyNumerator, rawMeanRadiusNumerator, rawMeanRadiusSquaredNumerator] =
    sumPartialVec4(preparePartials);
  const safeRawNorm = Math.max(1e-30, rawNorm);
  const energyHartree = rawEnergyNumerator / safeRawNorm;
  const normScale = 1 / Math.sqrt(safeRawNorm);
  params[10] = normScale;
  params[11] = energyHartree;
  device.queue.writeBuffer(paramsBuffer, 0, params);

  encoder = device.createCommandEncoder();
  pass = encoder.beginComputePass({ label: 'schrodinger-radial-webgpu-diagnose-pass' });
  pass.setPipeline(diagnosePipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(partialCount);
  pass.end();
  device.queue.submit([encoder.finish()]);

  const [diagnosticPartials, wavefunction, residuals] = await Promise.all([
    readFloat32Buffer(device, partialBuffer, partialCount * 16, 'schrodinger-radial-webgpu-diagnostic-readback'),
    readFloat32Buffer(device, waveBuffer, pointCount * 4, 'schrodinger-radial-webgpu-wave-readback'),
    readFloat32Buffer(device, residualBuffer, pointCount * 4, 'schrodinger-radial-webgpu-residual-readback')
  ]);
  const [normalization, residualNormSquared, referenceNormSquared, meanRadiusNumerator] =
    sumPartialVec4(diagnosticPartials);
  const residualL2Hartree = Math.sqrt(Math.max(0, residualNormSquared));
  const residualRelativeL2 = residualL2Hartree / Math.max(1e-30, Math.sqrt(Math.max(0, referenceNormSquared)));
  const energyEv = energyHartree * HARTREE_EV;
  const analyticEnergyEv = analyticEnergyHartree * HARTREE_EV;
  const energyErrorEv = energyEv - analyticEnergyEv;
  let maxAbsResidualHartree = 0;
  let peakProbabilityDensity = 0;
  let peakRadiusBohr = 0;
  for (let i = 0; i < pointCount; i += 1) {
    maxAbsResidualHartree = Math.max(maxAbsResidualHartree, Math.abs(residuals[i]));
    const density = wavefunction[i] * wavefunction[i];
    if (density > peakProbabilityDensity) {
      peakProbabilityDensity = density;
      peakRadiusBohr = (i + 1) * spacing;
    }
  }

  paramsBuffer.destroy();
  waveBuffer.destroy();
  residualBuffer.destroy();
  partialBuffer.destroy();

  return {
    schema: RADIAL_WEBGPU_EIGENSOLVER_SCHEMA,
    modelId: 'radial-webgpu-hydrogenic-basis-hamiltonian-v0',
    mode: 'time-independent-radial-schrodinger',
    status: classifyRadialWebGpuStatus({ energyErrorEv, residualRelativeL2, potentialModel }),
    backend: 'webgpu-radial-schrodinger',
    hamiltonian: 'H_l = -1/2 d2/dr2 + l(l+1)/(2r^2) - Z_eff/r',
    solver: 'webgpu-analytic-basis-finite-difference-hamiltonian',
    potentialModel,
    units: {
      length: 'bohr',
      energy: 'hartree/eV',
      timeAtomicUnitAttoseconds: ATOMIC_TIME_AS
    },
    elementSymbol: element?.symbol || null,
    atomicNumber: sourceZ,
    principalN,
    angularL,
    radialNodeCountTarget: Math.max(0, principalN - angularL - 1),
    radialNodeCountObserved: countRadialNodes(wavefunction),
    zEff: baseZEff,
    radialZ,
    energyHartree,
    energyEv,
    analyticEnergyHartree,
    analyticEnergyEv,
    energyErrorHartree: energyHartree - analyticEnergyHartree,
    energyErrorEv,
    relativeEnergyError: Math.abs(energyErrorEv) / Math.max(1e-12, Math.abs(analyticEnergyEv)),
    residualL2Hartree,
    residualRelativeL2,
    maxAbsResidualHartree,
    maxAbsResidualEv: maxAbsResidualHartree * HARTREE_EV,
    normalization,
    meanRadiusBohr: meanRadiusNumerator / Math.max(1e-30, normalization),
    meanRadiusNm: (meanRadiusNumerator / Math.max(1e-30, normalization)) * BOHR_RADIUS_NM,
    rmsRadiusBohr: Math.sqrt(Math.max(0, rawMeanRadiusSquaredNumerator / safeRawNorm)),
    peakRadiusBohr,
    peakProbabilityDensity,
    gridPointCount: pointCount,
    radialExtentBohr: extent,
    spacingBohr: spacing,
    iterationsRequested: 0,
    iterationsCompleted: 0,
    shiftHartree: null,
    converged: residualRelativeL2 < 2e-3,
    radialSamples: buildRadialSamples({ vector: wavefunction, spacing, pointCount }),
    radialGrid: {
      schema: 'peercompute.schrodinger.radial-webgpu-grid.v0',
      radiiBohr: null,
      wavefunctionU: wavefunction,
      residualHartree: residuals,
      spacingBohr: spacing,
      pointCount
    },
    webgpuStatus: {
      available: true,
      kernelMode: 'webgpu-radial-hamiltonian',
      reductionMode: 'webgpu-workgroup-partials-js-final-sum',
      partialCount,
      workgroupSize: RADIAL_WORKGROUP_SIZE
    },
    validity: {
      status: 'webgpu-primary-schrodinger-basis',
      warnings: [
        'WebGPU samples the hydrogenic radial basis and evaluates the radial Hamiltonian/residual directly on GPU.',
        'This is not a CPU fallback path; unavailable WebGPU is reported as unavailable.'
      ]
    }
  };
};

export const buildOrbitalGridGpu = async ({
  element,
  n = 1,
  l = 0,
  m = 0,
  gridSize = 28,
  sampleCount = 60000,
  sampleSeed = 'orbital',
  jitterScale = 0.72,
  extentBohr = null,
  options = {}
} = {}) => {
  if (!element) throw new Error('buildOrbitalGridGpu requires an element');
  const device = await getDevice();
  const principalN = Math.max(1, Math.round(finiteNumber(n, 1)));
  const angularL = Math.max(0, Math.round(finiteNumber(l, 0)));
  const magneticM = Math.round(clamp(finiteNumber(m, 0), -angularL, angularL));
  if (angularL >= principalN) {
    throw new Error('orbital WebGPU grid requires 0 <= l < n');
  }
  const size = Math.round(clamp(finiteNumber(gridSize, 28), 8, 72));
  const count = size * size * size;
  const visualSampleCount = Math.round(clamp(finiteNumber(sampleCount, 60000), 1024, 250000));
  const seed = hashSeed(sampleSeed);
  const zEff = effectiveNuclearCharge(element, principalN, angularL, options);
  const radialZ = correctedRadialCharge(zEff, principalN, angularL, options);
  const extent = finiteNumber(extentBohr, estimateOrbitalExtentBohr({ n: principalN, zEff }));
  const spacing = (extent * 2) / Math.max(1, size - 1);
  const partialCount = Math.max(1, Math.ceil(count / ORBITAL_GRID_WORKGROUP_SIZE));
  const shader = device.createShaderModule({
    label: 'schrodinger-orbital-grid-webgpu',
    code: `
      const PI: f32 = 3.141592653589793;

      @group(0) @binding(0) var<storage, read> params: array<f32>;
      @group(0) @binding(1) var<storage, read_write> samples: array<vec4f>;
      @group(0) @binding(2) var<storage, read_write> partials: array<vec4f>;
      @group(0) @binding(3) var<storage, read_write> pointRecords: array<vec4f>;

      var<workgroup> localPartial: array<vec4f, ${ORBITAL_GRID_WORKGROUP_SIZE}>;

      fn paramU(index: u32) -> u32 {
        return u32(max(0.0, params[index]) + 0.5);
      }

      fn paramI(index: u32) -> i32 {
        let value = params[index];
        if (value < 0.0) {
          return -i32(abs(value) + 0.5);
        }
        return i32(value + 0.5);
      }

      fn absI(value: i32) -> u32 {
        if (value < 0) {
          return u32(-value);
        }
        return u32(value);
      }

      fn factorialF(n: u32) -> f32 {
        var out = 1.0;
        var i = 2u;
        loop {
          if (i > n) {
            break;
          }
          out = out * f32(i);
          i = i + 1u;
        }
        return out;
      }

      fn binomialF(n: u32, k: u32) -> f32 {
        if (k > n) {
          return 0.0;
        }
        return factorialF(n) / max(1.0, factorialF(k) * factorialF(n - k));
      }

      fn associatedLaguerre(p: u32, k: u32, x: f32) -> f32 {
        var sum = 0.0;
        var i = 0u;
        loop {
          if (i > p) {
            break;
          }
          var sign = 1.0;
          if ((i % 2u) == 1u) {
            sign = -1.0;
          }
          sum = sum + sign * binomialF(p + k, p - i) * pow(x, f32(i)) / max(1.0, factorialF(i));
          i = i + 1u;
        }
        return sum;
      }

      fn associatedLegendre(l: u32, m: u32, x: f32) -> f32 {
        let clampedX = clamp(x, -1.0, 1.0);
        var pmm = 1.0;
        if (m > 0u) {
          let root = sqrt(max(0.0, (1.0 - clampedX) * (1.0 + clampedX)));
          var fact = 1.0;
          var i = 1u;
          loop {
            if (i > m) {
              break;
            }
            pmm = pmm * (-fact * root);
            fact = fact + 2.0;
            i = i + 1u;
          }
        }
        if (l == m) {
          return pmm;
        }
        var pmmp1 = clampedX * f32(2u * m + 1u) * pmm;
        if (l == m + 1u) {
          return pmmp1;
        }
        var pll = 0.0;
        var ll = m + 2u;
        loop {
          if (ll > l) {
            break;
          }
          pll = (f32(2u * ll - 1u) * clampedX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
          pmm = pmmp1;
          pmmp1 = pll;
          ll = ll + 1u;
        }
        return pll;
      }

      fn realSphericalHarmonic(l: u32, mSigned: i32, theta: f32, phi: f32) -> f32 {
        let absM = absI(mSigned);
        let plm = associatedLegendre(l, absM, cos(theta));
        let norm = sqrt(((f32(2u * l + 1u)) / (4.0 * PI)) * (factorialF(l - absM) / max(1.0, factorialF(l + absM))));
        if (mSigned > 0) {
          return sqrt(2.0) * norm * plm * cos(f32(absM) * phi);
        }
        if (mSigned < 0) {
          return sqrt(2.0) * norm * plm * sin(f32(absM) * phi);
        }
        return norm * plm;
      }

      fn radialComponentAt(n: u32, l: u32, r: f32, radialZ: f32) -> f32 {
        let nF = max(1.0, f32(n));
        let rho = (2.0 * radialZ * max(r, 0.000001)) / nF;
        let prefactor = sqrt(pow((2.0 * radialZ) / nF, 3.0) * (factorialF(n - l - 1u) / max(1.0, 2.0 * nF * factorialF(n + l))));
        return prefactor * exp(-0.5 * rho) * pow(rho, f32(l)) * associatedLaguerre(n - l - 1u, 2u * l + 1u, rho);
      }

      fn orbitalProbabilityFor(n: u32, l: u32, mSigned: i32, r: f32, theta: f32, phi: f32, radialZ: f32) -> f32 {
        let radial = radialComponentAt(n, l, r, radialZ);
        let ylm = realSphericalHarmonic(l, mSigned, theta, phi);
        return max(0.0, radial * radial * ylm * ylm);
      }

      fn correlationProbability(baseProbability: f32, n: u32, l: u32, mSigned: i32, r: f32, theta: f32, phi: f32, radialZ: f32, zEff: f32) -> f32 {
        if (params[12u] < 0.5 || n < 2u) {
          return baseProbability;
        }
        var mixed = 0.0;
        var weight = 0.0;
        var candidateN = n - 1u;
        var candidateL = min(l, candidateN - 1u);
        var candidateM = clamp(mSigned, -i32(candidateL), i32(candidateL));
        mixed = mixed + 0.42 * orbitalProbabilityFor(candidateN, candidateL, candidateM, r, theta, phi, radialZ);
        weight = weight + 0.42;

        candidateN = n;
        candidateL = l;
        if (l > 0u) {
          candidateL = l - 1u;
        }
        candidateM = clamp(mSigned, -i32(candidateL), i32(candidateL));
        mixed = mixed + 0.29 * orbitalProbabilityFor(candidateN, candidateL, candidateM, r, theta, phi, radialZ);
        weight = weight + 0.29;

        candidateN = n;
        candidateL = min(n - 1u, l + 1u);
        candidateM = clamp(mSigned, -i32(candidateL), i32(candidateL));
        mixed = mixed + 0.29 * orbitalProbabilityFor(candidateN, candidateL, candidateM, r, theta, phi, radialZ);
        weight = weight + 0.29;

        let strength = clamp(0.04 + zEff * 0.002, 0.04, 0.18);
        return (1.0 - strength) * baseProbability + strength * (mixed / max(0.000001, weight));
      }

      fn spinOrbitDensityFactor(theta: f32, n: u32, l: u32, mSigned: i32, zEff: f32) -> f32 {
        if (params[11u] < 0.5 || l == 0u || mSigned == 0) {
          return 1.0;
        }
        let alpha = 0.0072973525693;
        let beta = (alpha * zEff) * (alpha * zEff);
        let coupling = (0.24 * beta * f32(l)) / max(1.0, f32(n * n));
        return clamp(1.0 + coupling * cos(theta) * (f32(mSigned) / max(1.0, f32(l))), 0.5, 1.5);
      }

      fn probabilityAt(x: f32, y: f32, z: f32) -> f32 {
        let n = paramU(1u);
        let l = paramU(2u);
        let mSigned = paramI(3u);
        let zEff = params[4u];
        let radialZ = params[5u];
        let r = sqrt(x * x + y * y + z * z);
        let theta = select(acos(clamp(z / max(0.000001, r), -1.0, 1.0)), 0.0, r <= 0.000001);
        let phi = atan2(y, x);
        var probability = orbitalProbabilityFor(n, l, mSigned, r, theta, phi, radialZ);
        probability = probability * spinOrbitDensityFactor(theta, n, l, mSigned, zEff);
        return correlationProbability(probability, n, l, mSigned, r, theta, phi, radialZ, zEff);
      }

      fn reduceLocal(localIndex: u32, workgroupIndex: u32) {
        workgroupBarrier();
        var stride = ${ORBITAL_GRID_WORKGROUP_SIZE / 2}u;
        loop {
          if (stride == 0u) {
            break;
          }
          if (localIndex < stride) {
            localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
          }
          workgroupBarrier();
          stride = stride / 2u;
        }
        if (localIndex == 0u) {
          partials[workgroupIndex] = localPartial[0u];
        }
      }

      fn hash32(value: u32) -> u32 {
        var x = value;
        x = (x ^ (x >> 16u)) * 0x7feb352du;
        x = (x ^ (x >> 15u)) * 0x846ca68bu;
        x = x ^ (x >> 16u);
        return x;
      }

      fn rand01(seed: u32, index: u32, salt: u32) -> f32 {
        let value = hash32(seed ^ (index * 0x9e3779b9u) ^ (salt * 0x85ebca6bu));
        return f32(value) / 4294967296.0;
      }

      @compute @workgroup_size(${ORBITAL_GRID_WORKGROUP_SIZE})
      fn evaluate(
        @builtin(global_invocation_id) gid: vec3u,
        @builtin(local_invocation_id) lid: vec3u,
        @builtin(workgroup_id) wid: vec3u
      ) {
        let index = gid.x;
        let localIndex = lid.x;
        let count = paramU(0u);
        let size = paramU(8u);
        var sum = vec4f(0.0, 0.0, 0.0, 0.0);
        if (index < count) {
          let area = size * size;
          let zIndex = index / area;
          let yz = index - zIndex * area;
          let yIndex = yz / size;
          let xIndex = yz - yIndex * size;
          let extent = params[6u];
          let spacing = params[7u];
          let x = -extent + f32(xIndex) * spacing;
          let y = -extent + f32(yIndex) * spacing;
          let z = -extent + f32(zIndex) * spacing;
          let probability = probabilityAt(x, y, z);
          let r = sqrt(x * x + y * y + z * z);
          var boundary = 0.0;
          if (xIndex == 0u || yIndex == 0u || zIndex == 0u || xIndex == size - 1u || yIndex == size - 1u || zIndex == size - 1u) {
            boundary = probability;
          }
          samples[index] = vec4f(x, y, z, probability);
          sum = vec4f(probability, probability * r, probability * r * r, boundary);
        }
        localPartial[localIndex] = sum;
        reduceLocal(localIndex, wid.x);
      }

      @compute @workgroup_size(${ORBITAL_GRID_WORKGROUP_SIZE})
      fn normalize(@builtin(global_invocation_id) gid: vec3u) {
        let index = gid.x;
        if (index >= paramU(0u)) {
          return;
        }
        let invNorm = params[10u];
        let sample = samples[index];
        samples[index] = vec4f(sample.x, sample.y, sample.z, max(0.0, sample.w * invNorm));
      }

      @compute @workgroup_size(${ORBITAL_GRID_WORKGROUP_SIZE})
      fn samplePoints(@builtin(global_invocation_id) gid: vec3u) {
        let index = gid.x;
        let pointCount = paramU(13u);
        if (index >= pointCount) {
          return;
        }
        let gridCount = paramU(0u);
        let seed = paramU(14u);
        var bestIndex = min(gridCount - 1u, u32(rand01(seed, index, 1u) * f32(gridCount)));
        var bestScore = -1.0;
        var candidateSlot = 0u;
        loop {
          if (candidateSlot >= 16u) {
            break;
          }
          let candidate = min(gridCount - 1u, u32(rand01(seed, index, 11u + candidateSlot * 3u) * f32(gridCount)));
          let probability = max(0.0, samples[candidate].w);
          let draw = max(0.000001, rand01(seed, index, 13u + candidateSlot * 3u));
          let score = pow(max(probability, 1e-30), 0.72) / draw;
          if (score > bestScore) {
            bestScore = score;
            bestIndex = candidate;
          }
          candidateSlot = candidateSlot + 1u;
        }
        let source = samples[bestIndex];
        let zJitter = 1.0 - 2.0 * rand01(seed, index, 101u);
        let ring = sqrt(max(0.0, 1.0 - zJitter * zJitter));
        let angle = rand01(seed, index, 103u) * PI * 2.0;
        let jitterRadius = pow(max(0.0, rand01(seed, index, 107u)), 0.33333334) * params[7u] * params[15u];
        let x = source.x + cos(angle) * ring * jitterRadius;
        let y = source.y + sin(angle) * ring * jitterRadius;
        let z = source.z + zJitter * jitterRadius;
        let pointRadius = sqrt(x * x + y * y + z * z);
        let shade = clamp(1.0 - pointRadius / 48.0, 0.28, 1.0);
        pointRecords[index] = vec4f(x, y, z, shade);
      }
    `
  });

  const bindGroupLayout = device.createBindGroupLayout({
    label: 'schrodinger-orbital-grid-bindgroup-layout',
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }
    ]
  });
  const pipelineLayout = device.createPipelineLayout({
    label: 'schrodinger-orbital-grid-pipeline-layout',
    bindGroupLayouts: [bindGroupLayout]
  });
  const evaluatePipeline = device.createComputePipeline({
    label: 'schrodinger-orbital-grid-evaluate-pipeline',
    layout: pipelineLayout,
    compute: { module: shader, entryPoint: 'evaluate' }
  });
  const normalizePipeline = device.createComputePipeline({
    label: 'schrodinger-orbital-grid-normalize-pipeline',
    layout: pipelineLayout,
    compute: { module: shader, entryPoint: 'normalize' }
  });
  const samplePipeline = device.createComputePipeline({
    label: 'schrodinger-orbital-grid-sample-pipeline',
    layout: pipelineLayout,
    compute: { module: shader, entryPoint: 'samplePoints' }
  });
  const params = new Float32Array(16);
  params[0] = count;
  params[1] = principalN;
  params[2] = angularL;
  params[3] = magneticM;
  params[4] = zEff;
  params[5] = radialZ;
  params[6] = extent;
  params[7] = spacing;
  params[8] = size;
  params[9] = element.Z || 1;
  params[10] = 1;
  params[11] = options.relativisticSpinOrbit ? 1 : 0;
  params[12] = options.correlationMixing ? 1 : 0;
  params[13] = visualSampleCount;
  params[14] = seed;
  params[15] = clamp(finiteNumber(jitterScale, 0.72), 0, 2);

  const paramsBuffer = device.createBuffer({
    label: 'schrodinger-orbital-grid-params',
    size: params.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  const sampleBuffer = createStorageBuffer(device, 'schrodinger-orbital-grid-samples', count * 16);
  const partialBuffer = createStorageBuffer(device, 'schrodinger-orbital-grid-partials', partialCount * 16);
  const pointBuffer = createStorageBuffer(device, 'schrodinger-orbital-grid-point-records', visualSampleCount * 16);
  const bindGroup = device.createBindGroup({
    label: 'schrodinger-orbital-grid-bindgroup',
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: paramsBuffer } },
      { binding: 1, resource: { buffer: sampleBuffer } },
      { binding: 2, resource: { buffer: partialBuffer } },
      { binding: 3, resource: { buffer: pointBuffer } }
    ]
  });

  device.queue.writeBuffer(paramsBuffer, 0, params);
  let encoder = device.createCommandEncoder();
  let pass = encoder.beginComputePass({ label: 'schrodinger-orbital-grid-evaluate-pass' });
  pass.setPipeline(evaluatePipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(partialCount);
  pass.end();
  device.queue.submit([encoder.finish()]);

  const partials = await readFloat32Buffer(
    device,
    partialBuffer,
    partialCount * 16,
    'schrodinger-orbital-grid-partial-readback'
  );
  const [rawNormalization, rawMeanRadius, rawMeanRadiusSquared, rawBoundaryMass] = sumPartialVec4(partials);
  const safeNorm = Math.max(1e-30, rawNormalization);
  params[10] = 1 / safeNorm;
  device.queue.writeBuffer(paramsBuffer, 0, params);

  encoder = device.createCommandEncoder();
  pass = encoder.beginComputePass({ label: 'schrodinger-orbital-grid-normalize-pass' });
  pass.setPipeline(normalizePipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(partialCount);
  pass.end();
  pass = encoder.beginComputePass({ label: 'schrodinger-orbital-grid-sample-pass' });
  pass.setPipeline(samplePipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(Math.max(1, Math.ceil(visualSampleCount / ORBITAL_GRID_WORKGROUP_SIZE)));
  pass.end();
  device.queue.submit([encoder.finish()]);

  const [sampleRecords, pointRecords] = await Promise.all([
    readFloat32Buffer(device, sampleBuffer, count * 16, 'schrodinger-orbital-grid-sample-readback'),
    readFloat32Buffer(device, pointBuffer, visualSampleCount * 16, 'schrodinger-orbital-grid-point-readback')
  ]);
  const positions = new Float32Array(count * 3);
  const probabilities = new Float32Array(count);
  const points = new Float32Array(visualSampleCount * 3);
  const colors = new Float32Array(visualSampleCount * 3);
  let normalization = 0;
  let maxProbability = 0;
  let maxRadius = 0;
  for (let i = 0; i < count; i += 1) {
    const src = i * 4;
    const dst = i * 3;
    const probability = sampleRecords[src + 3];
    positions[dst] = sampleRecords[src];
    positions[dst + 1] = sampleRecords[src + 1];
    positions[dst + 2] = sampleRecords[src + 2];
    probabilities[i] = probability;
    normalization += probability;
    if (probability > maxProbability) {
      maxProbability = probability;
      maxRadius = Math.hypot(positions[dst], positions[dst + 1], positions[dst + 2]);
    }
  }
  for (let i = 0; i < visualSampleCount; i += 1) {
    const src = i * 4;
    const dst = i * 3;
    const shade = pointRecords[src + 3];
    points[dst] = pointRecords[src];
    points[dst + 1] = pointRecords[src + 1];
    points[dst + 2] = pointRecords[src + 2];
    colors[dst] = shade;
    colors[dst + 1] = shade;
    colors[dst + 2] = shade;
  }

  paramsBuffer.destroy();
  sampleBuffer.destroy();
  partialBuffer.destroy();
  pointBuffer.destroy();

  return {
    schema: ORBITAL_GRID_WEBGPU_SCHEMA,
    modelId: 'orbital-grid-webgpu-hydrogenic-density-v0',
    status: 'webgpu-grid-ready',
    backend: 'webgpu-orbital-grid-density',
    positions,
    probabilities,
    points,
    colors,
    extentBohr: extent,
    spacingBohr: spacing,
    gridSize: size,
    zEff,
    radialZ,
    energyEv: hydrogenicEnergyEv({ n: principalN, zEff }),
    normalization,
    rawNormalization,
    maxProbability,
    maxRadiusBohr: maxRadius,
    pointSampleCount: visualSampleCount,
    pointSamplingMode: 'webgpu-hash-importance-sampling',
    meanRadiusBohr: rawMeanRadius / safeNorm,
    rmsRadiusBohr: Math.sqrt(Math.max(0, rawMeanRadiusSquared / safeNorm)),
    boundaryMass: rawBoundaryMass / safeNorm,
    webgpuStatus: {
      available: true,
      kernelMode: 'webgpu-orbital-grid-density',
      pointKernelMode: 'webgpu-orbital-grid-point-sampling',
      reductionMode: 'webgpu-workgroup-partials-js-final-sum',
      partialCount,
      workgroupSize: ORBITAL_GRID_WORKGROUP_SIZE
    },
    validity: {
      status: 'webgpu-primary-orbital-grid',
      warnings: [
        'The standalone orbital probability grid is evaluated on WebGPU; no CPU grid fallback is used by the live demo path.'
      ]
    }
  };
};

export const computeProbabilityDensityGpu = async (complexAmplitudes) => {
  if (!(complexAmplitudes instanceof Float32Array) || complexAmplitudes.length % 2 !== 0) {
    throw new Error('complexAmplitudes must be a Float32Array of re/im pairs');
  }

  const device = await getDevice();
  const count = complexAmplitudes.length / 2;
  const shader = device.createShaderModule({
    label: 'schrodinger-probability-density',
    code: `
      struct Params {
        count: u32,
      };

      @group(0) @binding(0) var<storage, read> amplitudes: array<vec2<f32>>;
      @group(0) @binding(1) var<storage, read_write> probabilities: array<f32>;
      @group(0) @binding(2) var<uniform> params: Params;

      @compute @workgroup_size(128)
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        let i = id.x;
        if (i >= params.count) {
          return;
        }
        let amp = amplitudes[i];
        probabilities[i] = amp.x * amp.x + amp.y * amp.y;
      }
    `
  });
  const pipeline = device.createComputePipeline({
    label: 'schrodinger-probability-density-pipeline',
    layout: 'auto',
    compute: { module: shader, entryPoint: 'main' }
  });

  const amplitudeBuffer = device.createBuffer({
    label: 'schrodinger-amplitudes',
    size: complexAmplitudes.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  const probabilityBuffer = device.createBuffer({
    label: 'schrodinger-probabilities',
    size: count * 4,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
  });
  const params = new Uint32Array([count, 0, 0, 0]);
  const paramsBuffer = device.createBuffer({
    label: 'schrodinger-probability-params',
    size: params.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });
  const readback = device.createBuffer({
    label: 'schrodinger-probability-readback',
    size: count * 4,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
  });

  device.queue.writeBuffer(amplitudeBuffer, 0, complexAmplitudes);
  device.queue.writeBuffer(paramsBuffer, 0, params);

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: amplitudeBuffer } },
      { binding: 1, resource: { buffer: probabilityBuffer } },
      { binding: 2, resource: { buffer: paramsBuffer } }
    ]
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass({ label: 'schrodinger-probability-pass' });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(Math.max(1, Math.ceil(count / 128)));
  pass.end();
  encoder.copyBufferToBuffer(probabilityBuffer, 0, readback, 0, count * 4);
  device.queue.submit([encoder.finish()]);

  await readback.mapAsync(GPUMapMode.READ);
  const result = new Float32Array(readback.getMappedRange().slice(0));
  readback.unmap();

  amplitudeBuffer.destroy();
  probabilityBuffer.destroy();
  paramsBuffer.destroy();
  readback.destroy();
  return result;
};

export const runWebGPUProbabilitySmoke = async () => {
  const amplitudes = new Float32Array([
    Math.SQRT1_2, 0,
    0, 0,
    0.5, 0.5,
    0, 0
  ]);
  const probabilities = await computeProbabilityDensityGpu(amplitudes);
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  return {
    probabilities,
    total,
    ok: Math.abs(total - 1) < 1e-4 && Math.abs(probabilities[0] - 0.5) < 1e-4
  };
};
