import { WebGpuLadderCompute } from './webgpuLadderCompute.js';

const computes = new Map();
const configs = new Map();
const committedSequences = new Map();

function getExecutionContext() {
  const scope = globalThis.self;
  const workerScope = globalThis.WorkerGlobalScope;
  if (scope && workerScope && scope instanceof workerScope) {
    return 'dedicated-worker';
  }
  return 'inline';
}

function normalizeConfig(input = {}) {
  return {
    count: input.count,
    seed: input.seed,
    readbackInterval: input.readbackInterval,
    readbackRingSize: input.readbackRingSize,
    stateKey: input.stateKey || input.taskId || input.affinityKey || 'default',
    taskId: input.taskId || input.stateKey || input.affinityKey || 'multiscale-ladder',
    scope: input.scope || 'multiscale-compute',
    emitCommitDelta: input.emitCommitDelta === true,
    layerIndex: input.layerIndex,
    layerId: input.layerId,
    shardIndex: input.shardIndex,
    initialPositions: input.initialPositions || null,
    initialParticleRecords: input.initialParticleRecords || null
  };
}

async function ensureCompute(input = {}) {
  const config = normalizeConfig(input);
  const stateKey = config.stateKey;
  if (computes.has(stateKey)) return computes.get(stateKey);
  const compute = new WebGpuLadderCompute(config);
  configs.set(stateKey, {
    ...config,
    initialPositions: null,
    initialParticleRecords: null,
    initialPositionCount: config.initialPositions
      ? Math.floor(config.initialPositions.length / 3)
      : 0,
    initialParticleRecordCount: config.initialParticleRecords
      ? Math.floor(config.initialParticleRecords.length / 8)
      : 0
  });
  computes.set(stateKey, compute);
  await compute.initialize();
  return compute;
}

function snapshotPayload(snapshot, config) {
  if (!snapshot) return null;
  return {
    schema: 'peercompute.multiscale.shard-delta.v0',
    stateKey: config.stateKey,
    taskId: config.taskId,
    layerIndex: snapshot.layerIndex,
    layerId: config.layerId,
    shardIndex: config.shardIndex,
    backend: snapshot.backend,
    count: snapshot.count,
    sequence: snapshot.sequence,
    positionFloats: snapshot.positionFloats,
    positions: Array.from(snapshot.positions || [])
  };
}

function createResult(stateKey, snapshot) {
  const config = configs.get(stateKey) || normalizeConfig({ stateKey });
  const compute = computes.get(stateKey);
  const value = {
    ok: true,
    executionContext: getExecutionContext(),
    config,
    status: compute?.getStatus() || null,
    snapshot: snapshot || null
  };

  const sequence = snapshot?.sequence ?? -1;
  if (!config.emitCommitDelta || !snapshot || committedSequences.get(stateKey) === sequence) {
    return value;
  }

  committedSequences.set(stateKey, sequence);
  return {
    value,
    commitDelta: {
      taskId: config.taskId,
      scope: config.scope,
      version: sequence,
      timestamp: Date.now(),
      payload: snapshotPayload(snapshot, config)
    }
  };
}

export async function initLadderCompute(input = {}) {
  const config = normalizeConfig(input);
  computes.delete(config.stateKey);
  configs.delete(config.stateKey);
  committedSequences.delete(config.stateKey);
  const compute = await ensureCompute(input);
  return createResult(config.stateKey, compute.lastSnapshot);
}

export async function stepLadderCompute(input = {}) {
  const config = normalizeConfig({ ...(input.config || {}), ...input });
  const instance = await ensureCompute(config);
  const snapshot = instance.step(input);
  return createResult(config.stateKey, snapshot);
}

export async function getLadderComputeStatus(input = {}) {
  const config = normalizeConfig(input);
  const compute = computes.get(config.stateKey);
  if (!compute) {
    return {
      ok: false,
      executionContext: getExecutionContext(),
      config: configs.get(config.stateKey) || config,
      status: null,
      snapshot: null
    };
  }
  return createResult(config.stateKey, compute.lastSnapshot);
}

export function resetLadderCompute(input = {}) {
  if (input.stateKey || input.taskId || input.affinityKey) {
    const config = normalizeConfig(input);
    computes.delete(config.stateKey);
    configs.delete(config.stateKey);
    committedSequences.delete(config.stateKey);
  } else {
    computes.clear();
    configs.clear();
    committedSequences.clear();
  }
  return {
    ok: true,
    executionContext: getExecutionContext()
  };
}
