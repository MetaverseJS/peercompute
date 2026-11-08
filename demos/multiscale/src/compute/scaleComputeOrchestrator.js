import { SCALE_LAYERS } from '../simulation/multiscaleModel.js';
import {
  WEBGPU_COMPUTE_STATUS_SCHEMA,
  WEBGPU_PARTICLE_COUNT,
  WEBGPU_SNAPSHOT_RECORD_FLOATS,
  WEBGPU_SNAPSHOT_POSITION_FLOATS,
  applyParticleRecordResizeConservation,
  buildParticleStateFromPositions,
  buildParticleStateFromRecords,
  extractPositions
} from './webgpuLadderCompute.js';
import {
  PEERCOMPUTE_LADDER_RUNTIME_SCHEMA,
  PeerComputeLadderRuntime
} from './peercomputeLadderRuntime.js';

export const SCALE_COMPUTE_POOL_SCHEMA = 'peercompute.multiscale.scale-worker-pool.v0';

const DEFAULT_WORKERS_PER_SCALE = 2;
const DEFAULT_BACKGROUND_STEP_INTERVAL = 12;
const DEFAULT_DELTA_SCOPE = 'multiscale-compute';
const DEFAULT_READBACK_INTERVAL = 3;

function normalizePositiveInteger(value, fallback) {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function normalizeLayerIndex(index, layerCount = SCALE_LAYERS.length) {
  const value = Math.round(Number(index));
  if (!Number.isFinite(value)) return 0;
  return Math.min(layerCount - 1, Math.max(0, value));
}

function makeLayerPlan(layers, workersPerScale, totalParticleCount) {
  const safeWorkers = normalizePositiveInteger(workersPerScale, DEFAULT_WORKERS_PER_SCALE);
  const safeTotal = normalizePositiveInteger(totalParticleCount, WEBGPU_PARTICLE_COUNT);
  return layers.map((layer, layerIndex) => {
    const baseCount = Math.floor(safeTotal / safeWorkers);
    const remainder = safeTotal % safeWorkers;
    return {
      layerIndex,
      layerId: layer.id,
      targetWorkers: safeWorkers,
      targetParticleCount: safeTotal,
      shards: Array.from({ length: safeWorkers }, (_, shardIndex) => ({
        layerIndex,
        layerId: layer.id,
        shardIndex,
        particleCount: baseCount + (shardIndex < remainder ? 1 : 0)
      }))
    };
  });
}

function cloneStatus(status) {
  return status ? JSON.parse(JSON.stringify(status)) : null;
}

function combineLayerSnapshots(layerPool, fallbackSnapshot = null) {
  const valid = layerPool.shards
    .map((shard) => shard.runtime.lastSnapshot)
    .filter((snapshot) => snapshot?.positions && snapshot.layerIndex === layerPool.layerIndex);

  if (valid.length !== layerPool.shards.length) {
    return fallbackSnapshot;
  }

  const totalPositions = valid.reduce((sum, snapshot) => sum + snapshot.positions.length, 0);
  const positions = new Float32Array(totalPositions);
  let offset = 0;
  for (const snapshot of valid) {
    positions.set(snapshot.positions, offset);
    offset += snapshot.positions.length;
  }

  const count = Math.floor(totalPositions / WEBGPU_SNAPSHOT_POSITION_FLOATS);
  const backendSet = new Set(valid.map((snapshot) => snapshot.backend));
  const backend = backendSet.size === 1 ? valid[0].backend : 'mixed-compute';

  return {
    schema: valid[0].schema,
    backend,
    count,
    layerIndex: layerPool.layerIndex,
    sequence: Math.min(...valid.map((snapshot) => snapshot.sequence || 0)),
    positionFloats: WEBGPU_SNAPSHOT_POSITION_FLOATS,
    shardCount: layerPool.shards.length,
    positions
  };
}

function snapshotFromWarmDelta(entry) {
  const payload = entry?.payload;
  if (!payload?.positions || !Number.isInteger(payload.layerIndex)) return null;
  return {
    schema: 'peercompute.multiscale.compute.snapshot.v0',
    backend: payload.backend || 'warm-delta',
    count: payload.count || Math.floor(payload.positions.length / WEBGPU_SNAPSHOT_POSITION_FLOATS),
    layerIndex: payload.layerIndex,
    sequence: payload.sequence || entry.version || 0,
    positionFloats: payload.positionFloats || WEBGPU_SNAPSHOT_POSITION_FLOATS,
    recordFloats: payload.recordFloats || WEBGPU_SNAPSHOT_RECORD_FLOATS,
    shardIndex: payload.shardIndex,
    positions: Float32Array.from(payload.positions)
  };
}

function cloneSnapshotPositions(snapshot) {
  return snapshot?.positions ? Float32Array.from(snapshot.positions) : null;
}

function cloneSnapshotParticleRecords(snapshot) {
  return snapshot?.particleRecords ? Float32Array.from(snapshot.particleRecords) : null;
}

function summarizeResizeAudits(audits = []) {
  const valid = audits.filter((audit) => audit?.schema === 'peercompute.multiscale.compute.particle-resize-audit.v0');
  return {
    schema: 'peercompute.multiscale.compute.particle-resize-audit-summary.v0',
    massProxySource: valid.length > 0 ? 'record-scale' : null,
    momentumMode: valid.length > 0 ? 'scale-weighted' : null,
    kineticEnergyMode: valid.length > 0 ? 'scale-weighted' : null,
    auditedShardCount: valid.length,
    addedRecords: valid.reduce((sum, audit) => sum + (audit.addedRecords || 0), 0),
    droppedRecords: valid.reduce((sum, audit) => sum + (audit.droppedRecords || 0), 0),
    maxPositionDelta: valid.reduce((max, audit) => Math.max(max, audit.maxPositionDelta || 0), 0),
    maxVelocityDelta: valid.reduce((max, audit) => Math.max(max, audit.maxVelocityDelta || 0), 0),
    maxScaleDelta: valid.reduce((max, audit) => Math.max(max, audit.maxScaleDelta || 0), 0),
    maxAbsMassProxyDelta: valid.reduce((max, audit) => Math.max(max, Math.abs(audit.massProxyDelta || 0)), 0),
    maxAbsKineticEnergyDelta: valid.reduce((max, audit) => Math.max(max, Math.abs(audit.kineticEnergyDelta || 0)), 0),
    massProxyDelta: valid.reduce((sum, audit) => sum + (audit.massProxyDelta || 0), 0),
    momentumDelta: valid.reduce((sum, audit) => {
      const delta = audit.momentumDelta || [0, 0, 0];
      sum[0] += delta[0] || 0;
      sum[1] += delta[1] || 0;
      sum[2] += delta[2] || 0;
      return sum;
    }, [0, 0, 0])
  };
}

function vectorMagnitude(vector = []) {
  return Math.hypot(vector[0] || 0, vector[1] || 0, vector[2] || 0);
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function summarizeResizeCorrections(corrections = []) {
  const valid = corrections.filter((correction) => (
    correction?.schema === 'peercompute.multiscale.compute.particle-resize-correction.v0'
  ));
  return {
    schema: 'peercompute.multiscale.compute.particle-resize-correction-summary.v0',
    massProxySource: valid.length > 0 ? 'record-scale' : null,
    momentumMode: valid.length > 0 ? 'scale-weighted' : null,
    kineticEnergyMode: valid.length > 0 ? 'scale-weighted' : null,
    correctedShardCount: valid.length,
    appliedShardCount: valid.filter((correction) => correction.applied).length,
    massConservedShardCount: valid.filter((correction) => correction.massConservationApplied).length,
    massConservationMode: valid.length > 0 ? 'all-record-scale' : null,
    addedRecordCorrectionCount: valid.filter((correction) => correction.mode === 'added-records').length,
    remainingRecordCorrectionCount: valid.filter((correction) => correction.mode === 'remaining-records').length,
    underResolvedKineticShardCount: valid.filter((correction) => correction.underResolvedKinetic).length,
    mutableRecordCount: valid.reduce((sum, correction) => sum + (correction.mutableCount || 0), 0),
    mutableMassProxy: valid.reduce((sum, correction) => sum + (correction.mutableMassProxy || 0), 0),
    maxAbsMassProxyDeltaBefore: valid.reduce((max, correction) => (
      Math.max(max, Math.abs(finiteNumber(correction.massProxyDeltaBefore, correction.massProxyDelta || 0)))
    ), 0),
    maxAbsMassProxyDeltaAfter: valid.reduce((max, correction) => (
      Math.max(max, Math.abs(finiteNumber(correction.massProxyDeltaAfter, correction.massProxyDelta || 0)))
    ), 0),
    maxAbsMassProxyDelta: valid.reduce((max, correction) => (
      Math.max(max, Math.abs(finiteNumber(correction.massProxyDeltaAfter, correction.massProxyDelta || 0)))
    ), 0),
    maxMassScaleDelta: valid.reduce((max, correction) => (
      Math.max(max, Math.abs(finiteNumber(correction.massScale, 1) - 1))
    ), 0),
    maxAbsMomentumDeltaBefore: valid.reduce((max, correction) => (
      Math.max(max, vectorMagnitude(correction.momentumDeltaBefore))
    ), 0),
    maxAbsMomentumDeltaAfter: valid.reduce((max, correction) => (
      Math.max(max, vectorMagnitude(correction.momentumDeltaAfter))
    ), 0),
    maxAbsKineticEnergyDeltaBefore: valid.reduce((max, correction) => (
      Math.max(max, Math.abs(correction.kineticEnergyDeltaBefore || 0))
    ), 0),
    maxAbsKineticEnergyDeltaAfter: valid.reduce((max, correction) => (
      Math.max(max, Math.abs(correction.kineticEnergyDeltaAfter || 0))
    ), 0),
    maxVelocityOffset: valid.reduce((max, correction) => (
      Math.max(max, vectorMagnitude(correction.velocityOffset))
    ), 0),
    maxResidualScaleDelta: valid.reduce((max, correction) => (
      Math.max(max, Math.abs((correction.residualScale ?? 1) - 1))
    ), 0)
  };
}

export class ScaleComputeOrchestrator {
  constructor({
    layers = SCALE_LAYERS,
    workersPerScale = DEFAULT_WORKERS_PER_SCALE,
    totalParticleCount = WEBGPU_PARTICLE_COUNT,
    seed = 1337,
    readbackInterval,
    readbackRingSize,
    backgroundStepInterval = DEFAULT_BACKGROUND_STEP_INTERVAL,
    computeManager = null,
    submitTask = null,
    getCapabilities = null,
    stateManager = null,
    deltaScope = DEFAULT_DELTA_SCOPE,
    computeBudget = null,
    solverRegistry = null,
    moduleUrl
  } = {}) {
    this.layers = layers;
    this.seed = seed;
    this.totalParticleCount = normalizePositiveInteger(totalParticleCount, WEBGPU_PARTICLE_COUNT);
    this.workersPerScale = normalizePositiveInteger(workersPerScale, DEFAULT_WORKERS_PER_SCALE);
    this.backgroundStepInterval = normalizePositiveInteger(backgroundStepInterval, DEFAULT_BACKGROUND_STEP_INTERVAL);
    this.computeManager = computeManager;
    this.submitTaskFn = submitTask || ((task) => this.computeManager.submitTask(task));
    this.getCapabilitiesFn = getCapabilities || (() => this.computeManager?.getCapabilities?.() || null);
    this.stateManager = stateManager;
    this.deltaScope = deltaScope;
    this.computeBudget = computeBudget;
    this.solverRegistry = solverRegistry;
    this.readbackInterval = readbackInterval == null
      ? undefined
      : normalizePositiveInteger(readbackInterval, DEFAULT_READBACK_INTERVAL);
    this.readbackIntervalReason = 'initial';
    this.readbackIntervalRevision = 0;
    this.readbackRingSize = readbackRingSize;
    this.moduleUrl = moduleUrl;
    this.layerPlan = makeLayerPlan(this.layers, this.workersPerScale, this.totalParticleCount);
    this.layerPools = this.layerPlan.map((plan) => this.createLayerPool(plan));
    this.activeLayerIndex = 0;
    this.frame = 0;
    this.backgroundCursor = 0;
    this.initialized = false;
    this.initializing = false;
    this.initializePromise = null;
    this.lastSnapshot = null;
    this.lastError = null;
    this.lastResize = null;
    this.initPromises = new Map();
  }

  createShardRuntime(plan, shard, previousShard = null) {
    const taskId = `multiscale:${plan.layerId}:shard:${shard.shardIndex}`;
    const canReuse = previousShard?.runtime
      && previousShard.particleCount === shard.particleCount
      && previousShard.taskId === taskId;
    if (canReuse) {
      return {
        ...shard,
        taskId,
        stateSnapshot: previousShard.stateSnapshot || null,
        runtime: previousShard.runtime,
        reused: true
      };
    }

    const seed = this.seed + plan.layerIndex * 1009 + shard.shardIndex * 131;
    const sourceParticleRecords = cloneSnapshotParticleRecords(previousShard?.stateSnapshot)
      || cloneSnapshotParticleRecords(previousShard?.runtime?.lastSnapshot);
    const sourcePositions = cloneSnapshotPositions(previousShard?.stateSnapshot)
      || cloneSnapshotPositions(previousShard?.runtime?.lastSnapshot);
    let initialParticleRecords = null;
    let initialPositions = null;
    let resizeAudit = null;
    let resizeCorrection = null;
    if (sourceParticleRecords) {
      const beforeCount = Math.floor(sourceParticleRecords.length / WEBGPU_SNAPSHOT_RECORD_FLOATS);
      const preliminaryRecords = buildParticleStateFromRecords(sourceParticleRecords, shard.particleCount, seed);
      const corrected = applyParticleRecordResizeConservation(
        sourceParticleRecords,
        preliminaryRecords,
        {
          beforeCount,
          afterCount: shard.particleCount
        }
      );
      initialParticleRecords = corrected.records;
      initialPositions = extractPositions(initialParticleRecords, shard.particleCount);
      resizeAudit = corrected.audit;
      resizeCorrection = corrected.correction;
    } else if (sourcePositions) {
      const beforeCount = Math.floor(sourcePositions.length / WEBGPU_SNAPSHOT_POSITION_FLOATS);
      const previousRecords = buildParticleStateFromPositions(sourcePositions, beforeCount, seed);
      const preliminaryRecords = buildParticleStateFromPositions(sourcePositions, shard.particleCount, seed);
      const corrected = applyParticleRecordResizeConservation(
        previousRecords,
        preliminaryRecords,
        {
          beforeCount,
          afterCount: shard.particleCount
        }
      );
      initialParticleRecords = corrected.records;
      initialPositions = extractPositions(initialParticleRecords, shard.particleCount);
      resizeAudit = corrected.audit;
      resizeCorrection = corrected.correction;
    }
    return {
      ...shard,
      taskId,
      stateSnapshot: initialPositions ? {
        schema: 'peercompute.multiscale.compute.snapshot-seed.v0',
        backend: 'resize-carry-forward',
        count: Math.floor(initialPositions.length / WEBGPU_SNAPSHOT_POSITION_FLOATS),
        layerIndex: plan.layerIndex,
        sequence: previousShard?.stateSnapshot?.sequence || previousShard?.runtime?.lastSnapshot?.sequence || 0,
        positionFloats: WEBGPU_SNAPSHOT_POSITION_FLOATS,
        recordFloats: WEBGPU_SNAPSHOT_RECORD_FLOATS,
        shardIndex: shard.shardIndex,
        positions: initialPositions,
        particleRecords: initialParticleRecords,
        resizeAudit,
        resizeCorrection
      } : null,
      reused: false,
      carriedForward: !!initialPositions,
      carriedForwardRecords: !!sourceParticleRecords,
      resizeAudit,
      resizeCorrection,
      runtime: new PeerComputeLadderRuntime({
        count: shard.particleCount,
        seed,
        initialPositions,
        initialParticleRecords,
        readbackInterval: this.readbackInterval,
        readbackRingSize: this.readbackRingSize,
        submitTask: this.submitTaskFn,
        getCapabilities: this.getCapabilitiesFn,
        moduleUrl: this.moduleUrl,
        taskId,
        affinityKey: taskId,
        stateKey: taskId,
        scope: this.deltaScope,
        layerIndex: plan.layerIndex,
        layerId: plan.layerId,
        shardIndex: shard.shardIndex,
        emitCommitDelta: true
      })
    };
  }

  createLayerPool(plan, previousPool = null) {
    const previousShards = new Map((previousPool?.shards || []).map((shard) => [shard.shardIndex, shard]));
    const shards = plan.shards.map((shard) => this.createShardRuntime(
      plan,
      shard,
      previousShards.get(shard.shardIndex)
    ));
    const reusedShardCount = shards.filter((shard) => shard.reused).length;
    const carriedForwardShardCount = shards.filter((shard) => shard.carriedForward).length;
    const carriedForwardRecordShardCount = shards.filter((shard) => shard.carriedForwardRecords).length;
    const resizeAuditSummary = summarizeResizeAudits(shards.map((shard) => shard.resizeAudit));
    const resizeCorrectionSummary = summarizeResizeCorrections(shards.map((shard) => shard.resizeCorrection));
    const fullyReused = previousPool?.initialized
      && reusedShardCount === shards.length
      && previousPool.shards.length === shards.length;
    return {
      ...plan,
      initialized: !!fullyReused,
      initializing: false,
      lastSnapshot: previousPool?.lastSnapshot || null,
      lastError: null,
      reusedShardCount,
      carriedForwardShardCount,
      carriedForwardRecordShardCount,
      resizeAuditSummary,
      resizeCorrectionSummary,
      shards
    };
  }

  async initialize() {
    if (this.initialized) return this.getStatus();
    if (this.initializePromise) return this.initializePromise;
    this.initializing = true;
    this.initializePromise = (async () => {
      await this.computeManager?.initialize?.();
      if (this.stateManager && !this.stateManager.isInitialized) {
        await this.stateManager.initialize();
      }
      await this.ensureLayerInitialized(this.activeLayerIndex);
      this.prewarmAllLayers();
      this.initialized = true;
      this.initializing = false;
      return this.getStatus();
    })().catch((error) => {
      this.initializing = false;
      this.initializePromise = null;
      throw error;
    });
    return this.initializePromise;
  }

  prewarmAllLayers() {
    for (const pool of this.layerPools) {
      this.ensureLayerInitialized(pool.layerIndex).catch((error) => {
        pool.lastError = error instanceof Error ? error.message : String(error);
        this.lastError = pool.lastError;
      });
    }
  }

  async ensureLayerInitialized(layerIndex) {
    const safeIndex = normalizeLayerIndex(layerIndex, this.layerPools.length);
    const pool = this.layerPools[safeIndex];
    if (pool.initialized) return pool;
    if (this.initPromises.has(safeIndex)) return this.initPromises.get(safeIndex);

    pool.initializing = true;
    const promise = Promise.all(pool.shards.map((shard) => shard.runtime.initialize()))
      .then(() => {
        pool.initialized = true;
        pool.initializing = false;
        this.refreshLayerFromWarmDeltas(pool);
        pool.lastSnapshot = combineLayerSnapshots(pool, pool.lastSnapshot);
        if (pool.layerIndex === this.activeLayerIndex && pool.lastSnapshot) {
          this.lastSnapshot = pool.lastSnapshot;
        }
        return pool;
      })
      .catch((error) => {
        pool.initializing = false;
        pool.lastError = error instanceof Error ? error.message : String(error);
        this.lastError = pool.lastError;
        throw error;
      });
    this.initPromises.set(safeIndex, promise);
    return promise;
  }

  step(input = {}) {
    if (!this.initialized) {
      if (!this.initializing) {
        this.initialize().catch((error) => {
          this.lastError = error instanceof Error ? error.message : String(error);
        });
      }
      return this.lastSnapshot;
    }

    const nextReadbackInterval = input?.readbackBudget?.readbackInterval ?? input?.readbackInterval;
    if (nextReadbackInterval != null
      && normalizePositiveInteger(nextReadbackInterval, this.readbackInterval || DEFAULT_READBACK_INTERVAL) !== this.readbackInterval) {
      this.setReadbackInterval(nextReadbackInterval, input?.readbackReason || input?.readbackBudget?.reason || 'step-input');
    }
    const stepInput = this.readbackInterval == null
      ? input
      : {
        ...input,
        readbackInterval: this.readbackInterval,
        readbackReason: this.readbackIntervalReason
      };
    const layerIndex = normalizeLayerIndex(input.layerIndex, this.layerPools.length);
    this.activeLayerIndex = layerIndex;
    this.frame += 1;

    const activePool = this.layerPools[layerIndex];
    if (!activePool.initialized && !activePool.initializing) {
      this.ensureLayerInitialized(layerIndex).catch(() => {});
      return this.lastSnapshot;
    }

    if (activePool.initialized) {
      this.stepLayerPool(activePool, stepInput);
      this.refreshLayerFromWarmDeltas(activePool);
      const snapshot = combineLayerSnapshots(activePool, activePool.lastSnapshot);
      if (snapshot) {
        activePool.lastSnapshot = snapshot;
        this.lastSnapshot = snapshot;
      }
    }

    if (this.frame % this.backgroundStepInterval === 0) {
      this.stepNextBackgroundLayer(stepInput);
    }

    return this.lastSnapshot;
  }

  setReadbackInterval(readbackInterval, reason = 'runtime') {
    const next = normalizePositiveInteger(
      readbackInterval,
      this.readbackInterval || DEFAULT_READBACK_INTERVAL
    );
    if (next !== this.readbackInterval) {
      this.readbackInterval = next;
      this.readbackIntervalReason = reason;
      this.readbackIntervalRevision += 1;
      for (const pool of this.layerPools) {
        for (const shard of pool.shards) {
          shard.runtime.setReadbackInterval?.(next, reason);
        }
      }
    }
    return this.getStatus();
  }

  stepLayerPool(pool, input = {}) {
    for (const shard of pool.shards) {
      shard.runtime.step({
        ...input,
        layerIndex: pool.layerIndex
      });
    }
  }

  stepNextBackgroundLayer(input = {}) {
    const count = this.layerPools.length;
    for (let attempt = 0; attempt < count; attempt += 1) {
      this.backgroundCursor = (this.backgroundCursor + 1) % count;
      if (this.backgroundCursor === this.activeLayerIndex) continue;
      const pool = this.layerPools[this.backgroundCursor];
      if (!pool.initialized && !pool.initializing) {
        this.ensureLayerInitialized(pool.layerIndex).catch(() => {});
        return;
      }
      if (pool.initialized) {
        this.stepLayerPool(pool, {
          ...input,
          layerIndex: pool.layerIndex
        });
        this.refreshLayerFromWarmDeltas(pool);
        pool.lastSnapshot = combineLayerSnapshots(pool, pool.lastSnapshot);
      }
      return;
    }
  }

  async whenIdle() {
    const pending = [];
    for (const pool of this.layerPools) {
      for (const shard of pool.shards) {
        pending.push(shard.runtime.whenIdle());
      }
    }
    await Promise.allSettled(pending);
    for (const pool of this.layerPools) {
      this.refreshLayerFromWarmDeltas(pool);
      pool.lastSnapshot = combineLayerSnapshots(pool, pool.lastSnapshot);
    }
    const activePool = this.getActivePool();
    if (activePool?.lastSnapshot) {
      this.lastSnapshot = activePool.lastSnapshot;
    }
    return null;
  }

  async resizePool({
    workersPerScale = this.workersPerScale,
    totalParticleCount = this.totalParticleCount,
    computeBudget = this.computeBudget,
    reason = 'manual'
  } = {}) {
    await this.whenIdle();
    const previous = {
      workersPerScale: this.workersPerScale,
      totalParticleCount: this.totalParticleCount,
      plannedShardTasks: this.layerPools.length * this.workersPerScale
    };
    this.workersPerScale = normalizePositiveInteger(workersPerScale, this.workersPerScale);
    this.totalParticleCount = normalizePositiveInteger(totalParticleCount, this.totalParticleCount);
    this.computeBudget = computeBudget || this.computeBudget;
    const previousPools = new Map(this.layerPools.map((pool) => [pool.layerIndex, pool]));
    this.layerPlan = makeLayerPlan(this.layers, this.workersPerScale, this.totalParticleCount);
    this.initPromises.clear();
    this.layerPools = this.layerPlan.map((plan) => this.createLayerPool(plan, previousPools.get(plan.layerIndex)));
    this.activeLayerIndex = normalizeLayerIndex(this.activeLayerIndex, this.layerPools.length);
    this.backgroundCursor = normalizeLayerIndex(this.backgroundCursor, this.layerPools.length);
    const reusedShardCount = this.layerPools.reduce((sum, pool) => sum + pool.reusedShardCount, 0);
    const carriedForwardShardCount = this.layerPools.reduce((sum, pool) => sum + pool.carriedForwardShardCount, 0);
    const carriedForwardRecordShardCount = this.layerPools.reduce((sum, pool) => sum + pool.carriedForwardRecordShardCount, 0);
    const resizeAuditSummary = summarizeResizeAudits(this.layerPools.flatMap((pool) => (
      pool.shards.map((shard) => shard.resizeAudit)
    )));
    const resizeCorrectionSummary = summarizeResizeCorrections(this.layerPools.flatMap((pool) => (
      pool.shards.map((shard) => shard.resizeCorrection)
    )));
    const plannedShardTasks = this.layerPools.length * this.workersPerScale;
    this.lastResize = {
      schema: 'peercompute.multiscale.scale-worker-pool-resize.v0',
      reason,
      previous,
      next: {
        workersPerScale: this.workersPerScale,
        totalParticleCount: this.totalParticleCount,
        plannedShardTasks
      },
      reusedShardCount,
      carriedForwardShardCount,
      carriedForwardRecordShardCount,
      resizeAuditSummary,
      resizeCorrectionSummary,
      changed: previous.workersPerScale !== this.workersPerScale
        || previous.totalParticleCount !== this.totalParticleCount,
      timestamp: Date.now()
    };
    await this.ensureLayerInitialized(this.activeLayerIndex);
    this.prewarmAllLayers();
    return this.getStatus();
  }

  refreshLayerFromWarmDeltas(pool) {
    if (!this.stateManager?.getDataState) return;
    const dataState = this.stateManager.getDataState();
    for (const shard of pool.shards) {
      const entry = dataState.readWarm(shard.taskId, this.deltaScope);
      const snapshot = snapshotFromWarmDelta(entry);
      if (snapshot && snapshot.layerIndex === pool.layerIndex) {
        const priorRecords = cloneSnapshotParticleRecords(shard.runtime.lastSnapshot);
        if (priorRecords
          && shard.runtime.lastSnapshot?.sequence === snapshot.sequence
          && Math.floor(priorRecords.length / WEBGPU_SNAPSHOT_RECORD_FLOATS) >= snapshot.count) {
          snapshot.particleRecords = priorRecords;
        }
        shard.stateSnapshot = snapshot;
        shard.runtime.lastSnapshot = snapshot;
      }
    }
  }

  getActivePool() {
    return this.layerPools[this.activeLayerIndex] || this.layerPools[0];
  }

  getStatus() {
    const activePool = this.getActivePool();
    const poolStatusEntries = this.layerPools.map((pool) => ({
      pool,
      shardStatuses: pool.shards.map((shard) => shard.runtime.getStatus())
    }));
    const activeEntry = poolStatusEntries.find((entry) => entry.pool === activePool)
      || poolStatusEntries[0]
      || { pool: activePool, shardStatuses: [] };
    const shardStatuses = activeEntry.shardStatuses;
    const primaryStatus = shardStatuses[0] || {};
    const liveWorkers = poolStatusEntries.reduce((sum, entry) => (
      sum + entry.shardStatuses.reduce((inner, status) => (
        inner + (status.peercompute?.workerCount || 0)
      ), 0)
    ), 0);
    const liveLayers = this.layerPools.filter((pool) => pool.initialized).length;
    const pendingTask = poolStatusEntries.some((entry) => (
      entry.shardStatuses.some((status) => status.peercompute?.pendingTask)
    ));
    const submittedTasks = poolStatusEntries.reduce((sum, entry) => (
      sum + entry.shardStatuses.reduce((inner, status) => (
        inner + (status.peercompute?.submittedTasks || 0)
      ), 0)
    ), 0);
    const completedTasks = poolStatusEntries.reduce((sum, entry) => (
      sum + entry.shardStatuses.reduce((inner, status) => (
        inner + (status.peercompute?.completedTasks || 0)
      ), 0)
    ), 0);
    const failedTasks = poolStatusEntries.reduce((sum, entry) => (
      sum + entry.shardStatuses.reduce((inner, status) => (
        inner + (status.peercompute?.failedTasks || 0)
      ), 0)
    ), 0);
    const activeExecutions = new Set(shardStatuses.map((status) => status.peercompute?.execution || 'unknown'));
    const activeBackends = new Set(shardStatuses.map((status) => status.backend || 'unknown'));
    const activeExecution = activeExecutions.size === 1
      ? `${[...activeExecutions][0]}-pool`
      : 'mixed-peercompute-pool';
    const backend = activeBackends.size === 1 ? primaryStatus.backend : 'mixed-compute';
    const managerCapabilities = this.getCapabilitiesFn?.() || null;
    const plannedShardTasks = this.layerPools.length * this.workersPerScale;
    const managerWorkerCount = managerCapabilities?.workers ?? liveWorkers;
    const managerTargetWorkers = managerCapabilities?.targetWorkers
      ?? managerCapabilities?.workerPolicy?.targetWorkers
      ?? managerWorkerCount;

    return {
      schema: WEBGPU_COMPUTE_STATUS_SCHEMA,
      backend,
      particleCount: activePool.targetParticleCount,
      particleFloats: primaryStatus.particleFloats,
      particleStrideBytes: primaryStatus.particleStrideBytes,
      snapshotPositionFloats: WEBGPU_SNAPSHOT_POSITION_FLOATS,
      readPending: shardStatuses.some((status) => status.readPending),
      readbackInterval: primaryStatus.readbackInterval ?? this.readbackInterval,
      readbackIntervalReason: primaryStatus.readbackIntervalReason || this.readbackIntervalReason,
      readbackIntervalRevision: this.readbackIntervalRevision,
      readbackIntervalUpdatedAt: primaryStatus.readbackIntervalUpdatedAt,
      pendingReadbacks: shardStatuses.reduce((sum, status) => sum + (status.pendingReadbacks || 0), 0),
      submittedFrames: shardStatuses.reduce((sum, status) => sum + (status.submittedFrames || 0), 0),
      completedReadbacks: shardStatuses.reduce((sum, status) => sum + (status.completedReadbacks || 0), 0),
      readbackBacklogFrames: shardStatuses.reduce((sum, status) => sum + (status.readbackBacklogFrames || 0), 0),
      webgpuAvailable: shardStatuses.some((status) => status.webgpuAvailable),
      deviceLost: shardStatuses.some((status) => status.deviceLost),
      lastError: this.lastError || activePool.lastError || primaryStatus.lastError || null,
      peercompute: {
        schema: PEERCOMPUTE_LADDER_RUNTIME_SCHEMA,
        poolSchema: SCALE_COMPUTE_POOL_SCHEMA,
        manager: 'peercompute-scale-worker-pool',
        execution: activeExecution,
        workerCount: managerWorkerCount,
        plannedWorkers: managerTargetWorkers,
        plannedShardTasks,
        shardRuntimeCount: liveWorkers,
        managerCapabilities,
        computeBudget: this.computeBudget,
        lastResize: this.lastResize,
        solverRegistry: this.solverRegistry,
        stateScope: this.deltaScope,
        stateBacked: !!this.stateManager,
        liveLayers,
        totalLayers: this.layerPools.length,
        workersPerScale: this.workersPerScale,
        activeLayerIndex: this.activeLayerIndex,
        activeLayerId: activePool.layerId,
        activeWorkerCount: activePool.shards.length,
        activeShardCount: activePool.shards.length,
        pendingTask,
        submittedTasks,
        completedTasks,
        failedTasks,
        localFallback: shardStatuses.some((status) => status.peercompute?.localFallback),
        scalePools: poolStatusEntries.map(({ pool, shardStatuses: poolShardStatuses }) => ({
          layerIndex: pool.layerIndex,
          layerId: pool.layerId,
          initialized: pool.initialized,
          initializing: pool.initializing,
          targetWorkers: pool.targetWorkers,
          reusedShardCount: pool.reusedShardCount,
          carriedForwardShardCount: pool.carriedForwardShardCount,
          carriedForwardRecordShardCount: pool.carriedForwardRecordShardCount,
          resizeAuditSummary: pool.resizeAuditSummary,
          resizeCorrectionSummary: pool.resizeCorrectionSummary,
          liveWorkers: poolShardStatuses.reduce((sum, status) => (
            sum + (status.peercompute?.workerCount || 0)
          ), 0),
          pendingTasks: poolShardStatuses.filter((status) => status.peercompute?.pendingTask).length,
          lastError: pool.lastError
        })),
        activeShardStatuses: shardStatuses.map(cloneStatus)
      }
    };
  }
}
