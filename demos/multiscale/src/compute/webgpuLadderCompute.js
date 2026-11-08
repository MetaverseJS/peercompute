import { createSeededRandom } from '../simulation/multiscaleModel.js';

export const WEBGPU_PARTICLE_COUNT = 4096;
export const WEBGPU_PARTICLE_FLOATS = 8;
export const WEBGPU_PARTICLE_RECORD_BYTES = WEBGPU_PARTICLE_FLOATS * Float32Array.BYTES_PER_ELEMENT;
export const WEBGPU_SNAPSHOT_POSITION_FLOATS = 3;
export const WEBGPU_SNAPSHOT_RECORD_FLOATS = WEBGPU_PARTICLE_FLOATS;
export const WEBGPU_COMPUTE_STATUS_SCHEMA = 'peercompute.multiscale.compute.status.v0';
export const WEBGPU_COMPUTE_SNAPSHOT_SCHEMA = 'peercompute.multiscale.compute.snapshot.v0';

const PARTICLE_FLOATS = WEBGPU_PARTICLE_FLOATS;
const WORKGROUP_SIZE = 128;
const UNIFORM_FLOATS = 8;
const UNIFORM_BUFFER_BYTES = UNIFORM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const DEFAULT_READBACK_INTERVAL = 3;
const DEFAULT_READBACK_RING_SIZE = 2;
const MAX_READBACK_INTERVAL = 60;

const DEFAULT_ENVIRONMENT = Object.freeze({
  oxygenFraction: 0.21,
  gravityMps2: 9.8,
  stellarFlux: 1
});

const SHADER = `
struct Particle {
  posLife: vec4f,
  velScale: vec4f,
};

struct Uniforms {
  time: f32,
  dt: f32,
  layer: f32,
  count: f32,
  oxygen: f32,
  gravity: f32,
  stellarFlux: f32,
  pad0: f32,
};

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

fn hash1(n: f32) -> f32 {
  return fract(sin(n * 12.9898) * 43758.5453);
}

fn safe_normalize(v: vec3f) -> vec3f {
  let len = max(length(v), 0.0001);
  return v / len;
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  if (index >= u32(uniforms.count)) {
    return;
  }

  let i = f32(index);
  var particle = particles[index];
  var pos = particle.posLife.xyz;
  var vel = particle.velScale.xyz;
  let phase = particle.posLife.w;
  let group = hash1(i + phase * 97.0);
  let layer = uniforms.layer;
  let dt = clamp(uniforms.dt, 0.0, 0.04);
  var radius = 48.0;
  var accel = vec3f(0.0);
  var damping = 0.992;

  if (layer < 0.5) {
    radius = 50.0;
    let tangent = safe_normalize(vec3f(-pos.z, sin(uniforms.time * 0.08 + phase), pos.x));
    accel = tangent * 0.42 + safe_normalize(-pos) * 0.018 * max(length(pos) - 34.0, -18.0);
  } else if (layer < 1.5) {
    radius = 31.0;
    let tangent = safe_normalize(vec3f(-pos.z, pos.y * 0.08, pos.x));
    accel = tangent * 0.72 + safe_normalize(-pos) * 0.035 * max(length(pos) - 20.0, -8.0);
    pos.y = pos.y * 0.997;
  } else if (layer < 2.5) {
    radius = 23.0;
    let orbit = 5.0 + group * 20.0;
    let tangent = safe_normalize(vec3f(-pos.z, 0.0, pos.x));
    accel = tangent * (1.6 / sqrt(orbit)) + safe_normalize(-pos) * (length(pos) - orbit) * 0.022;
  } else if (layer < 3.5) {
    radius = 8.0;
    let wind = vec3f(sin(uniforms.time * 0.7 + phase), cos(uniforms.time * 0.5 + phase), sin(uniforms.time * 0.33 + phase * 2.0));
    accel = safe_normalize(wind) * (0.16 + uniforms.stellarFlux * 0.18) + safe_normalize(-pos) * (length(pos) - 7.2) * 0.035;
  } else if (layer < 4.5) {
    radius = 5.6;
    let classId = fract(group * 3.0);
    if (classId < 0.34) {
      let targetPos = vec3f(-0.3 + sin(phase) * 1.7, -0.9 + abs(sin(uniforms.time + phase)) * 0.35, cos(phase) * 1.5);
      accel = (targetPos - pos) * 0.48 + vec3f(0.0, -uniforms.gravity * 0.015, 0.0);
    } else if (classId < 0.68) {
      let heat = uniforms.oxygen * uniforms.stellarFlux;
      let targetPos = vec3f(2.4 + sin(phase) * 0.7, -0.8 + heat * 4.0 * hash1(i + 5.0), cos(phase) * 0.7);
      accel = (targetPos - pos) * 0.56 + vec3f(0.0, heat * 0.55, 0.0);
      damping = 0.975;
    } else {
      let targetPos = vec3f(0.2 + sin(phase) * 1.9, 1.7 + hash1(i + uniforms.time) * 3.0, cos(phase) * 1.9);
      accel = (targetPos - pos) * 0.2 + vec3f(0.0, 0.14, 0.0);
      damping = 0.982;
    }
  } else if (layer < 5.5) {
    radius = 3.6;
    let targetPos = vec3f(sin(phase * 2.1) * 2.8, cos(phase * 1.7) * 1.5, sin(phase * 1.3) * 2.8);
    accel = (targetPos - pos) * 0.38 + vec3f(0.0, uniforms.stellarFlux * 0.03, 0.0);
  } else if (layer < 6.5) {
    radius = 2.8;
    let targetPos = vec3f(sin(phase) * 1.8, cos(phase * 1.7) * 1.0, sin(phase * 2.3) * 1.3);
    accel = (targetPos - pos) * 0.72 + vec3f(sin(uniforms.time + phase), cos(uniforms.time * 0.7 + phase), 0.0) * 0.06;
  } else {
    radius = 3.0;
    let lobe = select(-1.0, 1.0, group > 0.5);
    let targetPos = vec3f(sin(phase * 3.0) * 0.9, lobe * (0.35 + hash1(i + 9.0) * 2.6), cos(phase * 2.0) * 0.9);
    accel = (targetPos - pos) * 1.1;
    damping = 0.965;
  }

  vel = (vel + accel * dt) * damping;
  pos = pos + vel * dt;
  let dist = length(pos);
  if (dist > radius) {
    pos = safe_normalize(pos) * radius * 0.92;
    vel = vel * -0.18;
  }

  particle.posLife = vec4f(pos, phase);
  particle.velScale = vec4f(vel, particle.velScale.w);
  particles[index] = particle;
}
`;

export function buildInitialParticleState(count = WEBGPU_PARTICLE_COUNT, seed = 1337) {
  const particleCount = normalizeParticleCount(count);
  const rand = createSeededRandom(seed);
  const data = new Float32Array(particleCount * PARTICLE_FLOATS);
  for (let i = 0; i < particleCount; i += 1) {
    const phase = rand() * Math.PI * 2;
    const radius = 2 + rand() * 42;
    const y = (rand() - 0.5) * 18;
    const offset = i * PARTICLE_FLOATS;
    data[offset] = Math.cos(phase) * radius;
    data[offset + 1] = y;
    data[offset + 2] = Math.sin(phase) * radius;
    data[offset + 3] = phase;
    data[offset + 4] = (rand() - 0.5) * 0.2;
    data[offset + 5] = (rand() - 0.5) * 0.2;
    data[offset + 6] = (rand() - 0.5) * 0.2;
    data[offset + 7] = 1;
  }
  return data;
}

export function buildParticleStateFromPositions(positions, count = WEBGPU_PARTICLE_COUNT, seed = 1337) {
  const data = buildInitialParticleState(count, seed);
  const source = positions || [];
  const available = Math.floor(source.length / WEBGPU_SNAPSHOT_POSITION_FLOATS);
  const particleCount = Math.min(data.length / PARTICLE_FLOATS, available);
  for (let i = 0; i < particleCount; i += 1) {
    const src = i * WEBGPU_SNAPSHOT_POSITION_FLOATS;
    const dst = i * PARTICLE_FLOATS;
    data[dst] = finiteOr(source[src], data[dst]);
    data[dst + 1] = finiteOr(source[src + 1], data[dst + 1]);
    data[dst + 2] = finiteOr(source[src + 2], data[dst + 2]);
    data[dst + 3] = Math.atan2(data[dst + 2], data[dst]);
  }
  return data;
}

export function buildParticleStateFromRecords(records, count = WEBGPU_PARTICLE_COUNT, seed = 1337) {
  const data = buildInitialParticleState(count, seed);
  const source = records || [];
  const available = Math.floor(source.length / PARTICLE_FLOATS);
  const particleCount = Math.min(data.length / PARTICLE_FLOATS, available);
  for (let i = 0; i < particleCount; i += 1) {
    const src = i * PARTICLE_FLOATS;
    const dst = i * PARTICLE_FLOATS;
    for (let field = 0; field < PARTICLE_FLOATS; field += 1) {
      data[dst + field] = finiteOr(source[src + field], data[dst + field]);
    }
  }
  return data;
}

export function extractPositions(particleData, count) {
  const source = particleData || [];
  const available = Math.floor(source.length / PARTICLE_FLOATS);
  const requested = count === undefined ? available : Math.floor(Number(count) || 0);
  const particleCount = Math.max(0, Math.min(requested, available));
  const positions = new Float32Array(particleCount * WEBGPU_SNAPSHOT_POSITION_FLOATS);
  for (let i = 0; i < particleCount; i += 1) {
    const src = i * PARTICLE_FLOATS;
    const dst = i * WEBGPU_SNAPSHOT_POSITION_FLOATS;
    positions[dst] = source[src];
    positions[dst + 1] = source[src + 1];
    positions[dst + 2] = source[src + 2];
  }
  return positions;
}

export function extractParticleRecords(particleData, count) {
  const source = particleData || [];
  const available = Math.floor(source.length / PARTICLE_FLOATS);
  const requested = count === undefined ? available : Math.floor(Number(count) || 0);
  const particleCount = Math.max(0, Math.min(requested, available));
  return Float32Array.from(source.slice(0, particleCount * PARTICLE_FLOATS));
}

export function summarizeParticleRecords(records, count) {
  const source = records || [];
  const available = Math.floor(source.length / PARTICLE_FLOATS);
  const requested = count === undefined ? available : Math.floor(Number(count) || 0);
  const particleCount = Math.max(0, Math.min(requested, available));
  const summary = {
    count: particleCount,
    positionCentroid: [0, 0, 0],
    momentumProxy: [0, 0, 0],
    kineticEnergyProxy: 0,
    scaleSum: 0,
    massProxySum: 0
  };
  if (!particleCount) return summary;

  for (let i = 0; i < particleCount; i += 1) {
    const offset = i * PARTICLE_FLOATS;
    const x = finiteOr(source[offset], 0);
    const y = finiteOr(source[offset + 1], 0);
    const z = finiteOr(source[offset + 2], 0);
    const vx = finiteOr(source[offset + 4], 0);
    const vy = finiteOr(source[offset + 5], 0);
    const vz = finiteOr(source[offset + 6], 0);
    const scale = finiteOr(source[offset + 7], 1);
    const mass = particleMassProxy(source, offset);
    summary.positionCentroid[0] += x * mass;
    summary.positionCentroid[1] += y * mass;
    summary.positionCentroid[2] += z * mass;
    summary.momentumProxy[0] += mass * vx;
    summary.momentumProxy[1] += mass * vy;
    summary.momentumProxy[2] += mass * vz;
    summary.kineticEnergyProxy += 0.5 * mass * (vx * vx + vy * vy + vz * vz);
    summary.scaleSum += scale;
    summary.massProxySum += mass;
  }

  const centroidDenominator = summary.massProxySum > 1e-12 ? summary.massProxySum : particleCount;
  summary.positionCentroid = summary.positionCentroid.map((value) => value / centroidDenominator);
  return summary;
}

function summarizeParticleVelocityRange(records, start, count) {
  const source = records || [];
  const available = Math.floor(source.length / PARTICLE_FLOATS);
  const safeStart = Math.max(0, Math.min(Math.floor(Number(start) || 0), available));
  const safeCount = Math.max(0, Math.min(Math.floor(Number(count) || 0), available - safeStart));
  const summary = {
    count: safeCount,
    momentumProxy: [0, 0, 0],
    kineticEnergyProxy: 0,
    massProxySum: 0
  };
  for (let i = 0; i < safeCount; i += 1) {
    const offset = (safeStart + i) * PARTICLE_FLOATS;
    const vx = finiteOr(source[offset + 4], 0);
    const vy = finiteOr(source[offset + 5], 0);
    const vz = finiteOr(source[offset + 6], 0);
    const mass = particleMassProxy(source, offset);
    summary.momentumProxy[0] += mass * vx;
    summary.momentumProxy[1] += mass * vy;
    summary.momentumProxy[2] += mass * vz;
    summary.kineticEnergyProxy += 0.5 * mass * (vx * vx + vy * vy + vz * vz);
    summary.massProxySum += mass;
  }
  return summary;
}

export function summarizeParticleRecordResize(beforeRecords, afterRecords, {
  beforeCount,
  afterCount
} = {}) {
  const before = beforeRecords || [];
  const after = afterRecords || [];
  const availableBefore = Math.floor(before.length / PARTICLE_FLOATS);
  const availableAfter = Math.floor(after.length / PARTICLE_FLOATS);
  const normalizedBeforeCount = beforeCount === undefined
    ? availableBefore
    : Math.max(0, Math.min(Math.floor(Number(beforeCount) || 0), availableBefore));
  const normalizedAfterCount = afterCount === undefined
    ? availableAfter
    : Math.max(0, Math.min(Math.floor(Number(afterCount) || 0), availableAfter));
  const prefixCount = Math.min(normalizedBeforeCount, normalizedAfterCount);
  let maxPositionDelta = 0;
  let maxVelocityDelta = 0;
  let maxScaleDelta = 0;

  for (let i = 0; i < prefixCount; i += 1) {
    const offset = i * PARTICLE_FLOATS;
    const dx = finiteOr(after[offset], 0) - finiteOr(before[offset], 0);
    const dy = finiteOr(after[offset + 1], 0) - finiteOr(before[offset + 1], 0);
    const dz = finiteOr(after[offset + 2], 0) - finiteOr(before[offset + 2], 0);
    const dvx = finiteOr(after[offset + 4], 0) - finiteOr(before[offset + 4], 0);
    const dvy = finiteOr(after[offset + 5], 0) - finiteOr(before[offset + 5], 0);
    const dvz = finiteOr(after[offset + 6], 0) - finiteOr(before[offset + 6], 0);
    maxPositionDelta = Math.max(maxPositionDelta, Math.hypot(dx, dy, dz));
    maxVelocityDelta = Math.max(maxVelocityDelta, Math.hypot(dvx, dvy, dvz));
    maxScaleDelta = Math.max(maxScaleDelta, Math.abs(finiteOr(after[offset + 7], 1) - finiteOr(before[offset + 7], 1)));
  }

  const beforeSummary = summarizeParticleRecords(before, normalizedBeforeCount);
  const afterSummary = summarizeParticleRecords(after, normalizedAfterCount);
  const momentumDelta = afterSummary.momentumProxy.map((value, index) => value - beforeSummary.momentumProxy[index]);
  const centroidDelta = afterSummary.positionCentroid.map((value, index) => value - beforeSummary.positionCentroid[index]);
  return {
    schema: 'peercompute.multiscale.compute.particle-resize-audit.v0',
    massProxySource: 'record-scale',
    momentumMode: 'scale-weighted',
    kineticEnergyMode: 'scale-weighted',
    centroidMode: 'scale-weighted',
    beforeCount: normalizedBeforeCount,
    afterCount: normalizedAfterCount,
    prefixCount,
    addedRecords: Math.max(0, normalizedAfterCount - normalizedBeforeCount),
    droppedRecords: Math.max(0, normalizedBeforeCount - normalizedAfterCount),
    maxPositionDelta,
    maxVelocityDelta,
    maxScaleDelta,
    momentumDelta,
    centroidDelta,
    kineticEnergyDelta: afterSummary.kineticEnergyProxy - beforeSummary.kineticEnergyProxy,
    scaleDelta: afterSummary.scaleSum - beforeSummary.scaleSum,
    massProxyDelta: afterSummary.massProxySum - beforeSummary.massProxySum,
    beforeMassProxy: beforeSummary.massProxySum,
    afterMassProxy: afterSummary.massProxySum
  };
}

export function applyParticleRecordResizeConservation(beforeRecords, afterRecords, {
  beforeCount,
  afterCount
} = {}) {
  const after = afterRecords || [];
  const availableAfter = Math.floor(after.length / PARTICLE_FLOATS);
  const normalizedAfterCount = afterCount === undefined
    ? availableAfter
    : Math.max(0, Math.min(Math.floor(Number(afterCount) || 0), availableAfter));
  const correctedRecords = Float32Array.from(after.slice(0, normalizedAfterCount * PARTICLE_FLOATS));
  const beforeAudit = summarizeParticleRecordResize(beforeRecords, afterRecords, { beforeCount, afterCount });
  const beforeSummary = summarizeParticleRecords(beforeRecords, beforeAudit.beforeCount);
  const correction = {
    schema: 'peercompute.multiscale.compute.particle-resize-correction.v0',
    massProxySource: 'record-scale',
    momentumMode: 'scale-weighted',
    kineticEnergyMode: 'scale-weighted',
    applied: false,
    mode: 'none',
    beforeCount: beforeAudit.beforeCount,
    afterCount: beforeAudit.afterCount,
    mutableStart: 0,
    mutableCount: 0,
    mutableMassProxy: 0,
    massConservationApplied: false,
    massConservationMode: 'all-record-scale',
    massScale: 1,
    beforeMassProxy: beforeSummary.massProxySum,
    uncorrectedAfterMassProxy: beforeAudit.afterMassProxy,
    afterMassProxy: beforeAudit.afterMassProxy,
    correctedAfterMassProxy: beforeAudit.afterMassProxy,
    massProxyDeltaBefore: beforeAudit.massProxyDelta,
    massProxyDeltaAfter: beforeAudit.massProxyDelta,
    massProxyDelta: beforeAudit.massProxyDelta,
    velocityOffset: [0, 0, 0],
    residualScale: 1,
    momentumDeltaBefore: beforeAudit.momentumDelta,
    momentumDeltaAfter: beforeAudit.momentumDelta,
    kineticEnergyDeltaBefore: beforeAudit.kineticEnergyDelta,
    kineticEnergyDeltaAfter: beforeAudit.kineticEnergyDelta,
    targetMutableKineticEnergy: 0,
    achievedMutableKineticEnergy: 0,
    minimumMutableKineticEnergy: 0,
    underResolvedKinetic: false
  };

  if (!beforeAudit.beforeCount || !beforeAudit.afterCount || !correctedRecords.length) {
    return {
      records: correctedRecords,
      correction,
      audit: beforeAudit,
      beforeAudit
    };
  }

  const mutableStart = beforeAudit.afterCount > beforeAudit.beforeCount
    ? beforeAudit.beforeCount
    : 0;
  const mutableCount = beforeAudit.afterCount > beforeAudit.beforeCount
    ? beforeAudit.afterCount - beforeAudit.beforeCount
    : beforeAudit.afterCount;
  correction.mutableStart = mutableStart;
  correction.mutableCount = mutableCount;
  correction.mode = mutableStart > 0 ? 'added-records' : 'remaining-records';
  if (mutableCount <= 0) {
    return {
      records: correctedRecords,
      correction,
      audit: beforeAudit,
      beforeAudit
    };
  }

  let afterSummary = summarizeParticleRecords(correctedRecords, beforeAudit.afterCount);
  if (beforeSummary.massProxySum > 1e-12 && afterSummary.massProxySum > 1e-12) {
    const massScale = beforeSummary.massProxySum / afterSummary.massProxySum;
    correction.massScale = massScale;
    correction.massConservationApplied = Math.abs(massScale - 1) > 1e-9;
    if (correction.massConservationApplied) {
      for (let i = 0; i < beforeAudit.afterCount; i += 1) {
        const offset = i * PARTICLE_FLOATS;
        correctedRecords[offset + 7] = particleMassProxy(correctedRecords, offset) * massScale;
      }
      afterSummary = summarizeParticleRecords(correctedRecords, beforeAudit.afterCount);
    }
  }
  correction.afterMassProxy = afterSummary.massProxySum;
  correction.correctedAfterMassProxy = afterSummary.massProxySum;
  correction.massProxyDeltaAfter = afterSummary.massProxySum - beforeSummary.massProxySum;
  correction.massProxyDelta = correction.massProxyDeltaAfter;
  const mutableSummaryBeforeOffset = summarizeParticleVelocityRange(correctedRecords, mutableStart, mutableCount);
  const mutableMassProxy = mutableSummaryBeforeOffset.massProxySum;
  correction.mutableMassProxy = mutableMassProxy;
  if (mutableMassProxy <= 1e-12) {
    return {
      records: correctedRecords,
      correction,
      audit: beforeAudit,
      beforeAudit
    };
  }
  const momentumOffset = beforeSummary.momentumProxy.map((target, index) => (
    (target - afterSummary.momentumProxy[index]) / mutableMassProxy
  ));
  correction.velocityOffset = momentumOffset;
  for (let i = 0; i < mutableCount; i += 1) {
    const offset = (mutableStart + i) * PARTICLE_FLOATS;
    correctedRecords[offset + 4] = finiteOr(correctedRecords[offset + 4], 0) + momentumOffset[0];
    correctedRecords[offset + 5] = finiteOr(correctedRecords[offset + 5], 0) + momentumOffset[1];
    correctedRecords[offset + 6] = finiteOr(correctedRecords[offset + 6], 0) + momentumOffset[2];
  }

  const offsetTotal = summarizeParticleRecords(correctedRecords, beforeAudit.afterCount);
  const mutableSummary = summarizeParticleVelocityRange(correctedRecords, mutableStart, mutableCount);
  const fixedKineticEnergy = offsetTotal.kineticEnergyProxy - mutableSummary.kineticEnergyProxy;
  const targetMutableKineticEnergy = Math.max(0, beforeSummary.kineticEnergyProxy - fixedKineticEnergy);
  const mutableMeanVelocity = mutableSummary.momentumProxy.map((value) => value / mutableMassProxy);
  const minimumMutableKineticEnergy = 0.5 * (
    mutableSummary.momentumProxy[0] * mutableSummary.momentumProxy[0]
      + mutableSummary.momentumProxy[1] * mutableSummary.momentumProxy[1]
      + mutableSummary.momentumProxy[2] * mutableSummary.momentumProxy[2]
  ) / mutableMassProxy;
  const residualKineticEnergy = Math.max(0, mutableSummary.kineticEnergyProxy - minimumMutableKineticEnergy);
  const targetResidualKineticEnergy = targetMutableKineticEnergy - minimumMutableKineticEnergy;
  let residualScale = 1;
  if (targetResidualKineticEnergy <= 1e-12) {
    residualScale = 0;
    correction.underResolvedKinetic = targetResidualKineticEnergy < -1e-8;
  } else if (residualKineticEnergy > 1e-12) {
    residualScale = Math.sqrt(targetResidualKineticEnergy / residualKineticEnergy);
  }
  correction.residualScale = Number.isFinite(residualScale) ? residualScale : 1;
  correction.targetMutableKineticEnergy = targetMutableKineticEnergy;
  correction.minimumMutableKineticEnergy = minimumMutableKineticEnergy;

  for (let i = 0; i < mutableCount; i += 1) {
    const offset = (mutableStart + i) * PARTICLE_FLOATS;
    const vx = finiteOr(correctedRecords[offset + 4], 0);
    const vy = finiteOr(correctedRecords[offset + 5], 0);
    const vz = finiteOr(correctedRecords[offset + 6], 0);
    correctedRecords[offset + 4] = mutableMeanVelocity[0] + (vx - mutableMeanVelocity[0]) * correction.residualScale;
    correctedRecords[offset + 5] = mutableMeanVelocity[1] + (vy - mutableMeanVelocity[1]) * correction.residualScale;
    correctedRecords[offset + 6] = mutableMeanVelocity[2] + (vz - mutableMeanVelocity[2]) * correction.residualScale;
  }

  const correctedAudit = summarizeParticleRecordResize(beforeRecords, correctedRecords, {
    beforeCount: beforeAudit.beforeCount,
    afterCount: beforeAudit.afterCount
  });
  const correctedMutableSummary = summarizeParticleVelocityRange(correctedRecords, mutableStart, mutableCount);
  correction.applied = correction.massConservationApplied
    || Math.hypot(...momentumOffset) > 1e-9
    || Math.abs(correction.residualScale - 1) > 1e-9;
  correction.achievedMutableKineticEnergy = correctedMutableSummary.kineticEnergyProxy;
  correction.momentumDeltaAfter = correctedAudit.momentumDelta;
  correction.kineticEnergyDeltaAfter = correctedAudit.kineticEnergyDelta;
  correction.massProxyDeltaAfter = correctedAudit.massProxyDelta;
  correction.massProxyDelta = correctedAudit.massProxyDelta;
  correction.afterMassProxy = correctedAudit.afterMassProxy;
  correction.correctedAfterMassProxy = correctedAudit.afterMassProxy;

  return {
    records: correctedRecords,
    correction,
    audit: correctedAudit,
    beforeAudit
  };
}

function normalizeParticleCount(count) {
  const value = Math.floor(Number(count));
  return Number.isFinite(value) && value > 0 ? value : WEBGPU_PARTICLE_COUNT;
}

function finiteOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function particleMassProxy(records, offset) {
  return Math.max(1e-6, Math.abs(finiteOr(records[offset + 7], 1)));
}

function normalizeReadbackInterval(value, fallback = DEFAULT_READBACK_INTERVAL) {
  const interval = Math.floor(Number(value));
  const base = Number.isFinite(interval) && interval > 0 ? interval : fallback;
  return Math.min(MAX_READBACK_INTERVAL, Math.max(1, base));
}

function normalizeStepInput({ time = 0, dt = 1 / 60, layerIndex = 0, environment = {} } = {}) {
  return {
    time: finiteOr(time, 0),
    dt: Math.min(0.25, Math.max(0, finiteOr(dt, 1 / 60))),
    layerIndex: Math.max(0, Math.floor(finiteOr(layerIndex, 0))),
    environment: {
      oxygenFraction: finiteOr(environment.oxygenFraction, DEFAULT_ENVIRONMENT.oxygenFraction),
      gravityMps2: finiteOr(environment.gravityMps2, DEFAULT_ENVIRONMENT.gravityMps2),
      stellarFlux: finiteOr(environment.stellarFlux, DEFAULT_ENVIRONMENT.stellarFlux)
    }
  };
}

export class WebGpuLadderCompute {
  constructor({
    count = WEBGPU_PARTICLE_COUNT,
    seed = 1337,
    initialPositions = null,
    initialParticleRecords = null,
    readbackInterval = DEFAULT_READBACK_INTERVAL,
    readbackRingSize = DEFAULT_READBACK_RING_SIZE
  } = {}) {
    this.count = normalizeParticleCount(count);
    this.seed = seed;
    this.readbackInterval = normalizeReadbackInterval(readbackInterval);
    this.readbackIntervalReason = 'initial';
    this.readbackIntervalRevision = 0;
    this.readbackIntervalUpdatedAt = Date.now();
    this.readbackRingSize = Math.max(1, Math.floor(Number(readbackRingSize) || DEFAULT_READBACK_RING_SIZE));
    this.backend = 'initializing';
    this.device = null;
    this.pipeline = null;
    this.bindGroup = null;
    this.particleBuffer = null;
    this.uniformBuffer = null;
    this.readBuffers = [];
    this.readBuffer = null;
    this.readPending = false;
    this.lastSnapshot = null;
    this.lastError = null;
    this.deviceLost = false;
    this.webgpuAvailable = false;
    this.submitSequence = 0;
    this.completedReadbackSequence = 0;
    this.cpuData = initialParticleRecords
      ? buildParticleStateFromRecords(initialParticleRecords, this.count, seed)
      : initialPositions
      ? buildParticleStateFromPositions(initialPositions, this.count, seed)
      : buildInitialParticleState(this.count, seed);
    this.lastSnapshot = this.createSnapshot({ backend: this.backend, layerIndex: 0, sequence: 0 });
  }

  async initialize() {
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) {
      this.backend = 'cpu-fallback';
      this.lastSnapshot = this.createSnapshot({ backend: this.backend, layerIndex: 0, sequence: this.completedReadbackSequence });
      return this.getStatus();
    }

    try {
      this.webgpuAvailable = true;
      const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (!adapter) throw new Error('No WebGPU adapter available');
      this.device = await adapter.requestDevice();
      this.attachDeviceHandlers(this.device);

      const bufferUsage = globalThis.GPUBufferUsage;
      if (!bufferUsage) throw new Error('GPUBufferUsage is unavailable');

      const byteLength = this.cpuData.byteLength;
      this.particleBuffer = this.device.createBuffer({
        size: byteLength,
        usage: bufferUsage.STORAGE | bufferUsage.COPY_SRC | bufferUsage.COPY_DST,
        mappedAtCreation: true
      });
      new Float32Array(this.particleBuffer.getMappedRange()).set(this.cpuData);
      this.particleBuffer.unmap();
      this.uniformBuffer = this.device.createBuffer({
        size: UNIFORM_BUFFER_BYTES,
        usage: bufferUsage.UNIFORM | bufferUsage.COPY_DST
      });
      this.readBuffers = Array.from({ length: this.readbackRingSize }, () => ({
        buffer: this.device.createBuffer({
          size: byteLength,
          usage: bufferUsage.COPY_DST | bufferUsage.MAP_READ
        }),
        pending: false,
        sequence: 0,
        layerIndex: 0
      }));
      this.readBuffer = this.readBuffers[0]?.buffer || null;

      this.device.pushErrorScope?.('validation');
      this.pipeline = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({ code: SHADER }),
          entryPoint: 'main'
        }
      });
      this.bindGroup = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: this.particleBuffer } },
          { binding: 1, resource: { buffer: this.uniformBuffer } }
        ]
      });
      const validationError = await this.device.popErrorScope?.();
      if (validationError) {
        throw new Error(`WebGPU validation: ${validationError.message || validationError}`);
      }
      this.backend = 'webgpu-compute';
      this.lastSnapshot = this.createSnapshot({ backend: this.backend, layerIndex: 0, sequence: this.completedReadbackSequence });
      return this.getStatus();
    } catch (error) {
      this.fallbackToCpu(error);
      return this.getStatus();
    }
  }

  attachDeviceHandlers(device) {
    device.lost?.then((info) => {
      const reason = info?.message || info?.reason || 'unknown reason';
      this.deviceLost = true;
      this.fallbackToCpu(`device lost: ${reason}`);
    });
    device.addEventListener?.('uncapturederror', (event) => {
      const message = event?.error?.message || 'uncaptured WebGPU error';
      this.fallbackToCpu(message);
    });
  }

  fallbackToCpu(error) {
    if (error) this.lastError = error instanceof Error ? error.message : String(error);
    this.backend = 'cpu-fallback';
    this.pipeline = null;
    this.bindGroup = null;
    this.readBuffers.forEach((slot) => {
      slot.pending = false;
    });
    this.updateReadPending();
    const layerIndex = this.lastSnapshot?.layerIndex || 0;
    this.lastSnapshot = this.createSnapshot({
      backend: this.backend,
      layerIndex,
      sequence: this.completedReadbackSequence
    });
    return this.lastSnapshot;
  }

  step(input) {
    const nextInterval = input?.readbackBudget?.readbackInterval ?? input?.readbackInterval;
    const normalizedInterval = nextInterval == null
      ? null
      : normalizeReadbackInterval(nextInterval, this.readbackInterval);
    if (normalizedInterval != null && normalizedInterval !== this.readbackInterval) {
      this.setReadbackInterval(nextInterval, input?.readbackReason || input?.readbackBudget?.reason || 'step-input');
    }
    const stepInput = normalizeStepInput(input);
    if (this.backend !== 'webgpu-compute' || !this.device || !this.pipeline || !this.bindGroup) {
      if (this.backend === 'cpu-fallback') {
        this.stepCpu(stepInput);
      }
      return this.lastSnapshot;
    }

    try {
      this.submitWebGpuStep(stepInput);
    } catch (error) {
      this.fallbackToCpu(error);
      return this.stepCpu(stepInput);
    }

    return this.lastSnapshot;
  }

  setReadbackInterval(readbackInterval, reason = 'runtime') {
    const next = normalizeReadbackInterval(readbackInterval, this.readbackInterval);
    if (next !== this.readbackInterval) {
      this.readbackInterval = next;
      this.readbackIntervalReason = reason;
      this.readbackIntervalRevision += 1;
      this.readbackIntervalUpdatedAt = Date.now();
    }
    return this.getStatus();
  }

  submitWebGpuStep({ time, dt, layerIndex, environment }) {
    const uniforms = new Float32Array([
      time,
      dt,
      layerIndex,
      this.count,
      environment.oxygenFraction,
      environment.gravityMps2,
      environment.stellarFlux,
      0
    ]);
    this.submitSequence += 1;
    const sequence = this.submitSequence;
    let readbackSlot = null;

    this.device.queue.writeBuffer(this.uniformBuffer, 0, uniforms);
    try {
      const encoder = this.device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(this.pipeline);
      pass.setBindGroup(0, this.bindGroup);
      pass.dispatchWorkgroups(Math.ceil(this.count / WORKGROUP_SIZE));
      pass.end();

      if (this.shouldReadback(sequence)) {
        readbackSlot = this.acquireReadbackSlot();
        if (readbackSlot) {
          encoder.copyBufferToBuffer(this.particleBuffer, 0, readbackSlot.buffer, 0, this.cpuData.byteLength);
          readbackSlot.pending = true;
          readbackSlot.sequence = sequence;
          readbackSlot.layerIndex = layerIndex;
          this.updateReadPending();
        }
      }

      this.device.queue.submit([encoder.finish()]);
    } catch (error) {
      if (readbackSlot) {
        readbackSlot.pending = false;
        this.updateReadPending();
      }
      throw error;
    }

    if (readbackSlot) this.mapReadback(readbackSlot);
  }

  shouldReadback(sequence) {
    return this.completedReadbackSequence === 0 || sequence % this.readbackInterval === 0;
  }

  acquireReadbackSlot() {
    return this.readBuffers.find((slot) => !slot.pending) || null;
  }

  mapReadback(slot) {
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) {
      slot.pending = false;
      this.updateReadPending();
      this.fallbackToCpu('GPUMapMode is unavailable');
      return;
    }

    slot.buffer.mapAsync(mapMode.READ)
      .then(() => {
        const mappedRange = slot.buffer.getMappedRange();
        this.cpuData.set(new Float32Array(mappedRange));
        slot.buffer.unmap();
        this.completedReadbackSequence = Math.max(this.completedReadbackSequence, slot.sequence);
        this.lastSnapshot = this.createSnapshot({
          backend: this.backend === 'webgpu-compute' ? 'webgpu-compute' : this.backend,
          layerIndex: slot.layerIndex,
          sequence: slot.sequence
        });
      })
      .catch((error) => {
        this.fallbackToCpu(error);
      })
      .finally(() => {
        slot.pending = false;
        this.updateReadPending();
      });
  }

  updateReadPending() {
    this.readPending = this.readBuffers.some((slot) => slot.pending);
  }

  stepCpu(input) {
    const { time, dt, layerIndex, environment } = normalizeStepInput(input);
    const radius = layerIndex < 1 ? 48 : layerIndex < 2 ? 30 : layerIndex < 3 ? 23 : layerIndex < 4 ? 8 : layerIndex < 5 ? 5.5 : layerIndex < 6 ? 3.6 : layerIndex < 7 ? 2.8 : 3;
    for (let i = 0; i < this.count; i += 1) {
      const offset = i * PARTICLE_FLOATS;
      const phase = this.cpuData[offset + 3];
      const heat = environment.oxygenFraction * environment.stellarFlux;
      const pull = 0.02 + layerIndex * 0.018;
      const ax = -this.cpuData[offset] * pull + Math.sin(time + phase) * 0.1;
      const ay = -this.cpuData[offset + 1] * pull + (layerIndex === 4 ? heat * 0.2 - environment.gravityMps2 * 0.004 : Math.cos(time + phase) * 0.06);
      const az = -this.cpuData[offset + 2] * pull + Math.cos(time * 0.8 + phase) * 0.1;
      this.cpuData[offset + 4] = (this.cpuData[offset + 4] + ax * dt) * 0.985;
      this.cpuData[offset + 5] = (this.cpuData[offset + 5] + ay * dt) * 0.985;
      this.cpuData[offset + 6] = (this.cpuData[offset + 6] + az * dt) * 0.985;
      this.cpuData[offset] += this.cpuData[offset + 4] * dt;
      this.cpuData[offset + 1] += this.cpuData[offset + 5] * dt;
      this.cpuData[offset + 2] += this.cpuData[offset + 6] * dt;
      const dist = Math.hypot(this.cpuData[offset], this.cpuData[offset + 1], this.cpuData[offset + 2]);
      if (dist > radius) {
        const scale = (radius * 0.92) / dist;
        this.cpuData[offset] *= scale;
        this.cpuData[offset + 1] *= scale;
        this.cpuData[offset + 2] *= scale;
      }
    }
    this.completedReadbackSequence += 1;
    this.lastSnapshot = this.createSnapshot({
      backend: this.backend,
      layerIndex,
      sequence: this.completedReadbackSequence
    });
    return this.lastSnapshot;
  }

  createCpuSnapshot(backend = this.backend, layerIndex = 0) {
    return this.createSnapshot({ backend, layerIndex, sequence: this.completedReadbackSequence });
  }

  createSnapshot({ backend = this.backend, layerIndex = 0, sequence = 0 } = {}) {
    return {
      schema: WEBGPU_COMPUTE_SNAPSHOT_SCHEMA,
      backend,
      count: this.count,
      layerIndex,
      sequence,
      positionFloats: WEBGPU_SNAPSHOT_POSITION_FLOATS,
      recordFloats: WEBGPU_SNAPSHOT_RECORD_FLOATS,
      positions: extractPositions(this.cpuData, this.count),
      particleRecords: extractParticleRecords(this.cpuData, this.count)
    };
  }

  getStatus() {
    return {
      schema: WEBGPU_COMPUTE_STATUS_SCHEMA,
      backend: this.backend,
      particleCount: this.count,
      particleFloats: WEBGPU_PARTICLE_FLOATS,
      particleStrideBytes: WEBGPU_PARTICLE_RECORD_BYTES,
      snapshotPositionFloats: WEBGPU_SNAPSHOT_POSITION_FLOATS,
      snapshotRecordFloats: WEBGPU_SNAPSHOT_RECORD_FLOATS,
      readPending: this.readPending,
      readbackInterval: this.readbackInterval,
      readbackIntervalReason: this.readbackIntervalReason,
      readbackIntervalRevision: this.readbackIntervalRevision,
      readbackIntervalUpdatedAt: this.readbackIntervalUpdatedAt,
      pendingReadbacks: this.readBuffers.filter((slot) => slot.pending).length,
      submittedFrames: this.submitSequence,
      completedReadbacks: this.completedReadbackSequence,
      readbackBacklogFrames: Math.max(0, this.submitSequence - this.completedReadbackSequence),
      webgpuAvailable: this.webgpuAvailable,
      deviceLost: this.deviceLost,
      lastError: this.lastError
    };
  }
}
