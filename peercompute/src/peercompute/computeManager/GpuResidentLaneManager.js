export const GPU_RESIDENT_LANE_MANAGER_SCHEMA = 'peercompute.compute.gpu-resident-lane-manager.v0';
export const GPU_RESIDENT_LANE_SCHEMA = 'peercompute.compute.gpu-resident-lane.v0';
export const GPU_RESIDENT_LANE_LEASE_SCHEMA = 'peercompute.compute.gpu-resident-lane-lease.v0';
export const GPU_RESIDENT_LANE_LEASE_IDENTITY_SCHEMA =
  'peercompute.compute.gpu-resident-lane-lease-identity.v0';
export const GPU_RESIDENT_LANE_EXECUTION_SCHEMA = 'peercompute.compute.gpu-resident-lane-execution.v0';
export const GPU_RESIDENT_LANE_COPY_BUDGET_SCHEMA = 'peercompute.compute.gpu-resident-lane-copy-budget.v0';
export const GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA = 'peercompute.compute.gpu-fence-report.v0';
export const GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA = 'peercompute.compute.gpu-resident-lane-stage-plan.v0';
export const GPU_RESIDENT_LANE_STAGE_EXECUTION_SCHEMA = 'peercompute.compute.gpu-resident-lane-stage-execution.v0';
export const GPU_RESIDENT_LANE_STAGE_PLACEMENT_PREFLIGHT_SCHEMA = 'peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0';

const DEFAULT_QUEUE_FENCE_POLICY = 'queue.onSubmittedWorkDone-before-readback-map';
const EXPLICIT_STAGE_DEPENDENCY_MODE = 'explicit-stage-dependencies';
const SEQUENTIAL_STAGE_ORDER_MODE = 'sequential-stage-order';
const STATE_FAMILY_CONFLICT_POLICY = 'defer-read-write-conflicting-ready-stages';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeString(value, fallback = null) {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function normalizeStringList(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeString(entry)).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((entry) => normalizeString(entry)).filter(Boolean);
  }
  return [...fallback];
}

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeResidentLaneContract(source = {}) {
  const contract = source?.residentSequenceLaneContract
    || source?.residentLaneContract
    || source?.laneContract
    || source?.executionContract
    || null;
  if (!contract || typeof contract !== 'object') return null;
  return clonePlain(contract);
}

function normalizeStageRecord(stage = {}, index = 0) {
  const id = normalizeString(stage.id, `stage:${index}`);
  return {
    ...clonePlain(stage),
    id,
    index,
    lawNodeId: normalizeString(stage.lawNodeId, null),
    runtimeTarget: normalizeString(stage.runtimeTarget, null),
    dependsOn: normalizeStringList(stage.dependsOn ?? stage.dependencies),
    inputFrom: normalizeString(stage.inputFrom ?? stage.primaryInputFrom ?? stage.inputStageId, null),
    reads: normalizeStringList(stage.reads ?? stage.readFamilies),
    writes: normalizeStringList(stage.writes ?? stage.writeFamilies)
  };
}

function createStagePlanFromContract(contract = null, {
  laneId = null,
  stateKey = null,
  domainKey = null,
  queueFencePolicy = null
} = {}) {
  if (!contract || typeof contract !== 'object') return null;
  const stages = Array.isArray(contract.passDagStages)
    ? contract.passDagStages.map((stage, index) => normalizeStageRecord(stage, index))
    : [];
  const dependencyMode = normalizeString(
    contract.stageDependencyMode ?? contract.dependencyMode,
    stages.some((stage) => stage.dependsOn.length > 0) || contract.parallelStageExecution === true
      ? 'explicit-stage-dependencies'
      : 'sequential-stage-order'
  );
  return {
    schema: GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA,
    status: stages.length > 0
      ? (contract.sequenceRunnable === true ? 'contract-stage-plan-ready' : 'contract-stage-plan-review-only')
      : 'contract-stage-plan-empty',
    authority: 'compute-manager-gpu-resident-lane-manager',
    laneId: normalizeString(contract.laneId, laneId),
    stateKey: normalizeString(contract.stateKey, stateKey),
    domainKey: normalizeString(contract.domainKey, domainKey),
    queueFencePolicy: normalizeString(contract.queueFencePolicy, queueFencePolicy || DEFAULT_QUEUE_FENCE_POLICY),
    contractSchema: normalizeString(contract.schema, null),
    contractStatus: normalizeString(contract.status, null),
    sequenceMode: normalizeString(contract.sequenceMode, null),
    sequenceRunnable: contract.sequenceRunnable === true,
    defaultEnabled: contract.defaultEnabled === true,
    dependencyMode,
    parallelStageExecution: dependencyMode === 'explicit-stage-dependencies',
    stageCount: stages.length,
    stages
  };
}

function normalizeStageExecutorResult(result = {}) {
  const object = result && typeof result === 'object' ? result : { value: result };
  return {
    value: Object.prototype.hasOwnProperty.call(object, 'value') ? object.value : result,
    retainedBufferRefs: normalizeStringList(object.retainedBufferRefs ?? object.gpuFence?.retainedBufferRefs),
    gpuFence: object.gpuFence && typeof object.gpuFence === 'object' ? clonePlain(object.gpuFence) : null,
    summary: object.summary && typeof object.summary === 'object' ? clonePlain(object.summary) : null
  };
}

function normalizeCopyBudget(source = {}) {
  const input = source.copyBudget && typeof source.copyBudget === 'object'
    ? source.copyBudget
    : source;
  return {
    schema: GPU_RESIDENT_LANE_COPY_BUDGET_SCHEMA,
    uploadBytes: Math.max(0, Math.round(finite(input.uploadBytes ?? input.expectedUploadBytes, 0))),
    readbackBytes: Math.max(0, Math.round(finite(input.readbackBytes ?? input.expectedReadbackBytes, 0))),
    retainedBytes: Math.max(0, Math.round(finite(input.retainedBytes ?? input.expectedRetainedBytes, 0))),
    compactSummaryBytes: Math.max(0, Math.round(finite(input.compactSummaryBytes ?? input.summaryBytes, 0))),
    fullReadbackReason: normalizeString(input.fullReadbackReason ?? input.readbackReason, null)
  };
}

function mergeCopyBudget(a = {}, b = {}) {
  const left = normalizeCopyBudget(a);
  const right = normalizeCopyBudget(b);
  return {
    schema: GPU_RESIDENT_LANE_COPY_BUDGET_SCHEMA,
    uploadBytes: left.uploadBytes + right.uploadBytes,
    readbackBytes: left.readbackBytes + right.readbackBytes,
    retainedBytes: Math.max(left.retainedBytes, right.retainedBytes),
    compactSummaryBytes: left.compactSummaryBytes + right.compactSummaryBytes,
    fullReadbackReason: right.fullReadbackReason || left.fullReadbackReason || null
  };
}

function stagePlanUsesExplicitDependencies(stagePlan = {}) {
  return stagePlan.parallelStageExecution === true
    || stagePlan.dependencyMode === EXPLICIT_STAGE_DEPENDENCY_MODE
    || (stagePlan.stages || []).some((stage) => (stage.dependsOn || []).length > 0);
}

function inputForStage(stage, {
  baseInput = null,
  currentValue = null,
  stageValues = {}
} = {}) {
  if (stage.inputFrom && Object.prototype.hasOwnProperty.call(stageValues, stage.inputFrom)) {
    return stageValues[stage.inputFrom];
  }
  const dependsOn = normalizeStringList(stage.dependsOn);
  if (dependsOn.length === 1 && Object.prototype.hasOwnProperty.call(stageValues, dependsOn[0])) {
    return stageValues[dependsOn[0]];
  }
  if (dependsOn.length > 1) {
    return {
      source: 'gpu-resident-lane-stage-dependencies',
      dependencyResults: Object.fromEntries(
        dependsOn.map((stageId) => [stageId, stageValues[stageId]])
      ),
      previousValue: currentValue,
      baseInput
    };
  }
  return currentValue;
}

function stringIntersection(a = [], b = []) {
  const right = new Set(normalizeStringList(b));
  return normalizeStringList(a).filter((entry) => right.has(entry));
}

function stateFamilyConflictBetweenStages(left = {}, right = {}) {
  const writeWrite = stringIntersection(left.writes, right.writes);
  if (writeWrite.length > 0) {
    return {
      conflictType: 'write-write',
      families: writeWrite
    };
  }
  const leftWriteRightRead = stringIntersection(left.writes, right.reads);
  if (leftWriteRightRead.length > 0) {
    return {
      conflictType: 'write-read',
      families: leftWriteRightRead
    };
  }
  const leftReadRightWrite = stringIntersection(left.reads, right.writes);
  if (leftReadRightWrite.length > 0) {
    return {
      conflictType: 'read-write',
      families: leftReadRightWrite
    };
  }
  return null;
}

function selectConflictFreeReadyBatch(readyStages = []) {
  const batch = [];
  const deferred = [];
  for (const stage of readyStages) {
    const conflict = batch
      .map((batchStage) => ({
        stage: batchStage,
        conflict: stateFamilyConflictBetweenStages(batchStage, stage)
      }))
      .find((entry) => entry.conflict);
    if (conflict) {
      deferred.push({
        stageId: stage.id,
        blockedByStageId: conflict.stage.id,
        conflictType: conflict.conflict.conflictType,
        families: conflict.conflict.families
      });
    } else {
      batch.push(stage);
    }
  }
  return { batch, deferred };
}

function validateStageDependencies(stagePlan = {}) {
  const stageIds = new Set((stagePlan.stages || []).map((stage) => stage.id));
  for (const stage of stagePlan.stages || []) {
    for (const dependencyId of stage.dependsOn || []) {
      if (!stageIds.has(dependencyId)) {
        const err = new Error(`GPU resident lane stage ${stage.id} depends on unknown stage ${dependencyId}`);
        err.code = 'ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING';
        err.stage = clonePlain(stage);
        throw err;
      }
    }
  }
}

function planStageExecutionBatches(stagePlan = {}) {
  validateStageDependencies(stagePlan);
  const useExplicitDependencies = stagePlanUsesExplicitDependencies(stagePlan);
  const executionBatches = [];
  const stateFamilyConflictDeferrals = [];
  if (useExplicitDependencies) {
    const pending = new Map((stagePlan.stages || []).map((stage) => [stage.id, stage]));
    const completedStageIds = new Set();
    while (pending.size > 0) {
      const ready = (stagePlan.stages || [])
        .filter((stage) => pending.has(stage.id))
        .filter((stage) => (stage.dependsOn || []).every((dependencyId) => completedStageIds.has(dependencyId)));
      if (!ready.length) {
        const err = new Error(`GPU resident lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(pending.keys()).join(', ')}`);
        err.code = 'ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_CYCLE';
        throw err;
      }
      const { batch, deferred } = selectConflictFreeReadyBatch(ready);
      const batchIndex = executionBatches.length;
      stateFamilyConflictDeferrals.push(
        ...deferred.map((entry) => ({
          ...entry,
          batchIndex
        }))
      );
      executionBatches.push(batch.map((stage) => stage.id));
      for (const stage of batch) {
        pending.delete(stage.id);
        completedStageIds.add(stage.id);
      }
    }
  } else {
    for (const stage of stagePlan.stages || []) {
      executionBatches.push([stage.id]);
    }
  }
  return {
    dependencyMode: useExplicitDependencies ? EXPLICIT_STAGE_DEPENDENCY_MODE : SEQUENTIAL_STAGE_ORDER_MODE,
    parallelStageExecution: useExplicitDependencies,
    stateFamilyConflictPolicy: useExplicitDependencies
      ? STATE_FAMILY_CONFLICT_POLICY
      : SEQUENTIAL_STAGE_ORDER_MODE,
    stateFamilyConflictDeferrals,
    stateFamilyConflictDeferralCount: stateFamilyConflictDeferrals.length,
    executionBatches,
    maxConcurrentStageCount: executionBatches.reduce((max, batch) => Math.max(max, batch.length), 0)
  };
}

function summarizeStagePlacement(stage = {}, {
  batchIndex = -1,
  executorSource = null,
  gpuHubExecutorDescriptor = null
} = {}) {
  const workerPolicy = clonePlain(gpuHubExecutorDescriptor?.workerPolicy);
  const workerMode = normalizeString(workerPolicy?.mode, null);
  const workerReady = workerPolicy?.status === 'worker-ready';
  const workerRequested = workerMode === 'dedicated-worker';
  let placementTarget = 'missing-stage-executor';
  if (executorSource === 'stage-plan-executor') {
    placementTarget = 'stage-plan-executor';
  } else if (executorSource === 'provided-stage-executor') {
    placementTarget = 'provided-stage-executor';
  } else if (executorSource === 'gpu-hub-resident-stage-executor') {
    if (workerReady) placementTarget = 'gpu-hub-worker-resident-stage';
    else if (workerRequested) placementTarget = 'gpu-hub-inline-fallback-for-worker-stage';
    else placementTarget = 'gpu-hub-inline-resident-stage';
  }
  return {
    stageId: stage.id,
    lawNodeId: stage.lawNodeId,
    runtimeTarget: stage.runtimeTarget,
    batchIndex,
    dependsOn: normalizeStringList(stage.dependsOn),
    inputFrom: normalizeString(stage.inputFrom, null),
    reads: normalizeStringList(stage.reads),
    writes: normalizeStringList(stage.writes),
    executorSource,
    placementTarget,
    gpuHubExecutorDescriptor: clonePlain(gpuHubExecutorDescriptor),
    workerPolicy,
    workerResidencyStatus: workerPolicy?.status || null,
    workerRequested,
    workerReady,
    sameDeviceRequired: workerPolicy?.sameDeviceRequired === true,
    bufferTransferPolicy: workerPolicy?.bufferTransferPolicy || null
  };
}

function fenceSatisfied(status) {
  return [
    'gpu-fence-completed',
    'queue-work-completed',
    'readback-map-completed',
    'ordered-before-consumer-queue-completed'
  ].includes(String(status || ''));
}

export class GpuResidentLaneManager {
  constructor({
    gpuHub = null,
    deviceId = 'gpu-hub',
    now = () => Date.now()
  } = {}) {
    this.gpuHub = gpuHub;
    this.deviceId = deviceId;
    this.now = now;
    this.lanes = new Map();
    this.leases = new Map();
    this.nextLeaseOrdinal = 1;
    this.stats = {
      schema: GPU_RESIDENT_LANE_MANAGER_SCHEMA,
      laneCount: 0,
      activeLeaseCount: 0,
      completedLeaseCount: 0,
      rejectedLeaseCount: 0,
      totalUploadBytes: 0,
      totalReadbackBytes: 0,
      totalCompactSummaryBytes: 0,
      maxRetainedBytes: 0,
      lastFence: null
    };
  }

  resolveLaneId({ laneId, stateKey, domainKey, solverId } = {}) {
    return normalizeString(
      laneId,
      `gpu-lane:${normalizeString(stateKey || domainKey || solverId, 'default')}`
    );
  }

  getOrCreateLane(spec = {}) {
    const laneId = this.resolveLaneId(spec);
    const stateKey = normalizeString(spec.stateKey, null);
    const sourceFamily = normalizeString(spec.sourceFamily, null);
    const existing = this.lanes.get(laneId);
    if (existing) {
      if (stateKey && existing.stateKey && existing.stateKey !== stateKey) {
        throw new Error(`GPU resident lane ${laneId} already owns stateKey ${existing.stateKey}, not ${stateKey}`);
      }
      if (stateKey && !existing.stateKey) existing.stateKey = stateKey;
      if (sourceFamily && existing.sourceFamily && existing.sourceFamily !== sourceFamily) {
        throw new Error(
          `GPU resident lane ${laneId} already owns sourceFamily ${existing.sourceFamily}, not ${sourceFamily}`
        );
      }
      if (sourceFamily && !existing.sourceFamily) existing.sourceFamily = sourceFamily;
      if (spec.domainKey && !existing.domainKey) existing.domainKey = normalizeString(spec.domainKey, null);
      if (spec.solverId && !existing.solverId) existing.solverId = normalizeString(spec.solverId, null);
      return existing;
    }

    const lane = {
      schema: GPU_RESIDENT_LANE_SCHEMA,
      laneId,
      stateKey,
      sourceFamily,
      domainKey: normalizeString(spec.domainKey, null),
      solverId: normalizeString(spec.solverId, null),
      deviceId: normalizeString(spec.deviceId, this.deviceId),
      queueFencePolicy: normalizeString(spec.queueFencePolicy, DEFAULT_QUEUE_FENCE_POLICY),
      status: 'ready',
      activeLeases: new Map(),
      retainedBufferRefs: new Set(normalizeStringList(spec.retainedBufferRefs)),
      copyBudget: normalizeCopyBudget(spec.copyBudget || {}),
      residentSequenceLaneContract: normalizeResidentLaneContract(spec),
      stagePlan: null,
      createdAt: this.now(),
      updatedAt: this.now(),
      lastFence: null
    };
    lane.stagePlan = createStagePlanFromContract(lane.residentSequenceLaneContract, lane);
    this.lanes.set(laneId, lane);
    this.stats.laneCount = this.lanes.size;
    return lane;
  }

  acquireLease(spec = {}) {
    const lane = this.getOrCreateLane(spec);
    const leaseId = normalizeString(
      spec.leaseId,
      `${lane.laneId}:lease:${this.nextLeaseOrdinal++}`
    );
    if (this.leases.has(leaseId)) {
      throw new Error(`GPU resident lane lease already exists: ${leaseId}`);
    }
    const copyBudget = normalizeCopyBudget(spec.copyBudget || {});
    const residentSequenceLaneContract = normalizeResidentLaneContract(spec) || clonePlain(lane.residentSequenceLaneContract);
    const stagePlan = createStagePlanFromContract(residentSequenceLaneContract, {
      laneId: lane.laneId,
      stateKey: lane.stateKey,
      domainKey: lane.domainKey,
      queueFencePolicy: lane.queueFencePolicy
    });
    if (residentSequenceLaneContract) {
      lane.residentSequenceLaneContract = clonePlain(residentSequenceLaneContract);
      lane.stagePlan = clonePlain(stagePlan);
    }
    const lease = {
      schema: GPU_RESIDENT_LANE_LEASE_SCHEMA,
      leaseId,
      laneId: lane.laneId,
      stateKey: lane.stateKey,
      sourceFamily: normalizeString(spec.sourceFamily, lane.sourceFamily),
      domainKey: lane.domainKey,
      solverId: normalizeString(spec.solverId, lane.solverId),
      taskId: normalizeString(spec.taskId, null),
      owner: normalizeString(spec.owner, 'compute-manager'),
      readFamilies: normalizeStringList(spec.readFamilies),
      writeFamilies: normalizeStringList(spec.writeFamilies),
      retainedBufferRefs: normalizeStringList(spec.retainedBufferRefs),
      copyBudget,
      queueFencePolicy: lane.queueFencePolicy,
      residentSequenceLaneContract,
      stagePlan,
      stageExecution: null,
      status: 'active',
      acquiredAt: this.now(),
      releasedAt: null,
      releaseReason: null,
      gpuFence: null
    };
    this.leases.set(leaseId, lease);
    lane.activeLeases.set(leaseId, lease);
    lane.copyBudget = mergeCopyBudget(lane.copyBudget, copyBudget);
    for (const ref of lease.retainedBufferRefs) lane.retainedBufferRefs.add(ref);
    lane.updatedAt = this.now();
    this.stats.activeLeaseCount = this.leases.size;
    this.stats.totalUploadBytes += copyBudget.uploadBytes;
    this.stats.totalReadbackBytes += copyBudget.readbackBytes;
    this.stats.totalCompactSummaryBytes += copyBudget.compactSummaryBytes;
    this.stats.maxRetainedBytes = Math.max(this.stats.maxRetainedBytes, copyBudget.retainedBytes);
    return clonePlain(lease);
  }

  createFenceReport(leaseOrId, {
    status = 'queue-work-completed',
    method = 'queue.onSubmittedWorkDone',
    queueCompletionStatus = status,
    queueCompletionMethod = method,
    readbackCompletionStatus = null,
    readbackCompletionMethod = null,
    retainedBufferRefs = null,
    completed = null,
    source = 'gpu-resident-lane-manager'
  } = {}) {
    const lease = typeof leaseOrId === 'string' ? this.leases.get(leaseOrId) : leaseOrId;
    if (!lease) throw new Error(`Unknown GPU resident lane lease: ${leaseOrId}`);
    const lane = this.lanes.get(lease.laneId);
    const satisfied = completed == null ? fenceSatisfied(status) : completed === true;
    return {
      schema: GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA,
      status,
      method,
      fenceSatisfied: satisfied,
      required: true,
      laneId: lease.laneId,
      stateKey: lease.stateKey,
      queueFencePolicy: lease.queueFencePolicy || lane?.queueFencePolicy || DEFAULT_QUEUE_FENCE_POLICY,
      queueCompletionStatus,
      queueCompletionMethod,
      readbackCompletionStatus,
      readbackCompletionMethod,
      retainedBufferRefs: normalizeStringList(retainedBufferRefs, lease.retainedBufferRefs),
      workerId: null,
      deviceId: lane?.deviceId || this.deviceId,
      completedAt: satisfied ? this.now() : null,
      source
    };
  }

  completeLease(leaseId, options = {}) {
    const lease = this.leases.get(leaseId);
    if (!lease) throw new Error(`Unknown GPU resident lane lease: ${leaseId}`);
    const lane = this.lanes.get(lease.laneId);
    const gpuFence = this.createFenceReport(lease, options);
    lease.status = gpuFence.fenceSatisfied ? 'completed' : 'completed-unsatisfied-fence';
    lease.gpuFence = gpuFence;
    lease.releasedAt = this.now();
    lease.releaseReason = options.releaseReason || lease.status;
    if (Array.isArray(options.retainedBufferRefs)) {
      lease.retainedBufferRefs = normalizeStringList(options.retainedBufferRefs);
    }
    if (lane) {
      lane.activeLeases.delete(leaseId);
      lane.lastFence = gpuFence;
      lane.updatedAt = this.now();
      for (const ref of lease.retainedBufferRefs) lane.retainedBufferRefs.add(ref);
    }
    this.leases.delete(leaseId);
    this.stats.activeLeaseCount = this.leases.size;
    this.stats.completedLeaseCount += 1;
    this.stats.lastFence = clonePlain(gpuFence);
    return {
      schema: GPU_RESIDENT_LANE_EXECUTION_SCHEMA,
      lease: clonePlain(lease),
      gpuFence,
      lane: lane ? this.snapshotLane(lane.laneId) : null,
      residentSequenceLaneContract: clonePlain(lease.residentSequenceLaneContract),
      stagePlan: clonePlain(lease.stagePlan),
      stageExecution: clonePlain(lease.stageExecution)
    };
  }

  async executeStagePlan(leaseOrId, {
    input = null,
    context = {},
    executor = null,
    stageExecutors = {},
    allowMissingExecutors = false
  } = {}) {
    const lease = typeof leaseOrId === 'string' ? this.leases.get(leaseOrId) : leaseOrId;
    if (!lease) throw new Error(`Unknown GPU resident lane lease: ${leaseOrId}`);
    const lane = this.lanes.get(lease.laneId);
    const stagePlan = lease.stagePlan || createStagePlanFromContract(lease.residentSequenceLaneContract, {
      laneId: lease.laneId,
      stateKey: lease.stateKey,
      domainKey: lease.domainKey,
      queueFencePolicy: lease.queueFencePolicy
    });
    if (!stagePlan || !Array.isArray(stagePlan.stages) || stagePlan.stages.length === 0) {
      const err = new Error(`GPU resident lane lease ${lease.leaseId} has no executable stage plan`);
      err.code = 'ERR_GPU_RESIDENT_LANE_STAGE_PLAN_MISSING';
      throw err;
    }

    const startedAt = this.now();
    const stageResults = [];
    const stageValues = {};
    const batchPlan = planStageExecutionBatches(stagePlan);
    const stageById = new Map(stagePlan.stages.map((stage) => [stage.id, stage]));
    let currentValue = input;
    const runOneStage = async (stage, stageInput) => {
      let runStage = typeof executor === 'function'
        ? executor
        : (stageExecutors?.[stage.id] || stageExecutors?.[stage.lawNodeId]);
      let executorSource = typeof executor === 'function'
        ? 'stage-plan-executor'
        : (runStage ? 'provided-stage-executor' : null);
      if (
        typeof runStage !== 'function'
        && this.gpuHub
        && typeof this.gpuHub.hasResidentStageExecutor === 'function'
        && this.gpuHub.hasResidentStageExecutor(stage)
        && typeof this.gpuHub.executeResidentStage === 'function'
      ) {
        runStage = (args) => this.gpuHub.executeResidentStage(args);
        executorSource = 'gpu-hub-resident-stage-executor';
      }
      const gpuHubExecutorDescriptor = executorSource === 'gpu-hub-resident-stage-executor'
        && typeof this.gpuHub?.describeResidentStageExecutor === 'function'
        ? this.gpuHub.describeResidentStageExecutor(stage)
        : null;
      if (typeof runStage !== 'function') {
        if (!allowMissingExecutors) {
          const err = new Error(`Missing GPU resident lane stage executor: ${stage.id}`);
          err.code = 'ERR_GPU_RESIDENT_LANE_STAGE_EXECUTOR_MISSING';
          err.stage = clonePlain(stage);
          throw err;
        }
        return {
          result: {
            stageId: stage.id,
            lawNodeId: stage.lawNodeId,
            status: 'blocked-missing-stage-executor',
            retainedBufferRefs: [],
            workerResidency: null
          },
          value: stageInput
        };
      }
      const stageStartedAt = this.now();
      const rawResult = await runStage({
        stage: clonePlain(stage),
        stageIndex: stage.index,
        input: stageInput,
        lease: clonePlain(lease),
        lane: lane ? this.snapshotLane(lane.laneId) : null,
        context
      });
      const normalized = normalizeStageExecutorResult(rawResult);
      const retainedBufferRefs = normalizeStringList(normalized.retainedBufferRefs);
      if (retainedBufferRefs.length > 0) {
        lease.retainedBufferRefs = normalizeStringList([
          ...lease.retainedBufferRefs,
          ...retainedBufferRefs
        ]);
        if (lane) {
          for (const ref of retainedBufferRefs) lane.retainedBufferRefs.add(ref);
          lane.updatedAt = this.now();
        }
      }
      return {
        result: {
          stageId: stage.id,
          lawNodeId: stage.lawNodeId,
          runtimeTarget: stage.runtimeTarget,
          status: 'completed',
          executorSource,
          startedAt: stageStartedAt,
          completedAt: this.now(),
          retainedBufferRefs,
          gpuFence: normalized.gpuFence,
          workerResidency: clonePlain(gpuHubExecutorDescriptor?.workerPolicy),
          summary: normalized.summary
        },
        value: normalized.value
      };
    };

    const useExplicitDependencies = batchPlan.parallelStageExecution === true;
    if (useExplicitDependencies) {
      for (const batchStageIds of batchPlan.executionBatches) {
        const batch = batchStageIds.map((stageId) => stageById.get(stageId)).filter(Boolean);
        const readyResults = await Promise.all(batch.map((stage) => runOneStage(
          stage,
          inputForStage(stage, {
            baseInput: input,
            currentValue,
            stageValues
          })
        )));
        for (let i = 0; i < batch.length; i += 1) {
          const stage = batch[i];
          const entry = readyResults[i];
          stageValues[stage.id] = entry.value;
          currentValue = entry.value;
          stageResults.push(entry.result);
        }
      }
    } else {
      for (const batchStageIds of batchPlan.executionBatches) {
        const stage = stageById.get(batchStageIds[0]);
        const entry = await runOneStage(stage, currentValue);
        currentValue = entry.value;
        stageValues[stage.id] = entry.value;
        stageResults.push(entry.result);
      }
    }

    const blocked = stageResults.some((result) => result.status !== 'completed');
    const execution = {
      schema: GPU_RESIDENT_LANE_STAGE_EXECUTION_SCHEMA,
      status: blocked ? 'blocked' : 'completed',
      leaseId: lease.leaseId,
      laneId: lease.laneId,
      stateKey: lease.stateKey,
      stagePlan: clonePlain(stagePlan),
      stageCount: stagePlan.stages.length,
      completedStageCount: stageResults.filter((result) => result.status === 'completed').length,
      dependencyMode: batchPlan.dependencyMode,
      parallelStageExecution: batchPlan.parallelStageExecution,
      stateFamilyConflictPolicy: batchPlan.stateFamilyConflictPolicy,
      stateFamilyConflictDeferrals: batchPlan.stateFamilyConflictDeferrals,
      stateFamilyConflictDeferralCount: batchPlan.stateFamilyConflictDeferralCount,
      executionBatches: batchPlan.executionBatches,
      maxConcurrentStageCount: batchPlan.maxConcurrentStageCount,
      stageResults,
      retainedBufferRefs: normalizeStringList(lease.retainedBufferRefs),
      output: currentValue,
      startedAt,
      completedAt: this.now()
    };
    lease.stageExecution = clonePlain(execution);
    if (lane) lane.updatedAt = this.now();
    return execution;
  }

  preflightStagePlacement(leaseOrId, {
    executor = null,
    stageExecutors = {},
    allowMissingExecutors = false
  } = {}) {
    const lease = typeof leaseOrId === 'string' ? this.leases.get(leaseOrId) : leaseOrId;
    if (!lease) throw new Error(`Unknown GPU resident lane lease: ${leaseOrId}`);
    const lane = this.lanes.get(lease.laneId);
    const stagePlan = lease.stagePlan || createStagePlanFromContract(lease.residentSequenceLaneContract, {
      laneId: lease.laneId,
      stateKey: lease.stateKey,
      domainKey: lease.domainKey,
      queueFencePolicy: lease.queueFencePolicy
    });
    if (!stagePlan || !Array.isArray(stagePlan.stages) || stagePlan.stages.length === 0) {
      const err = new Error(`GPU resident lane lease ${lease.leaseId} has no executable stage plan`);
      err.code = 'ERR_GPU_RESIDENT_LANE_STAGE_PLAN_MISSING';
      throw err;
    }
    const batchPlan = planStageExecutionBatches(stagePlan);
    const batchIndexByStageId = new Map();
    batchPlan.executionBatches.forEach((batch, batchIndex) => {
      for (const stageId of batch) batchIndexByStageId.set(stageId, batchIndex);
    });
    const stagePlacements = stagePlan.stages.map((stage) => {
      let runStage = typeof executor === 'function'
        ? executor
        : (stageExecutors?.[stage.id] || stageExecutors?.[stage.lawNodeId]);
      let executorSource = typeof executor === 'function'
        ? 'stage-plan-executor'
        : (runStage ? 'provided-stage-executor' : null);
      let gpuHubExecutorDescriptor = null;
      if (
        typeof runStage !== 'function'
        && this.gpuHub
        && typeof this.gpuHub.hasResidentStageExecutor === 'function'
        && this.gpuHub.hasResidentStageExecutor(stage)
        && typeof this.gpuHub.describeResidentStageExecutor === 'function'
      ) {
        gpuHubExecutorDescriptor = this.gpuHub.describeResidentStageExecutor(stage);
        executorSource = 'gpu-hub-resident-stage-executor';
      }
      return summarizeStagePlacement(stage, {
        batchIndex: batchIndexByStageId.get(stage.id) ?? -1,
        executorSource,
        gpuHubExecutorDescriptor
      });
    });
    const missingExecutorStageIds = stagePlacements
      .filter((entry) => !entry.executorSource)
      .map((entry) => entry.stageId);
    const workerRequestedStageIds = stagePlacements
      .filter((entry) => entry.workerRequested)
      .map((entry) => entry.stageId);
    const workerReadyStageIds = stagePlacements
      .filter((entry) => entry.workerReady)
      .map((entry) => entry.stageId);
    const workerFallbackStageIds = stagePlacements
      .filter((entry) => entry.workerRequested && !entry.workerReady)
      .map((entry) => entry.stageId);
    const canExecute = allowMissingExecutors === true || missingExecutorStageIds.length === 0;
    return {
      schema: GPU_RESIDENT_LANE_STAGE_PLACEMENT_PREFLIGHT_SCHEMA,
      status: canExecute ? 'placement-preflight-ready' : 'blocked-missing-stage-executors',
      authority: 'compute-manager-gpu-resident-lane-manager',
      advisory: true,
      leaseId: lease.leaseId,
      laneId: lease.laneId,
      stateKey: lease.stateKey,
      domainKey: lease.domainKey,
      deviceId: lane?.deviceId || this.deviceId,
      stagePlan: clonePlain(stagePlan),
      stageCount: stagePlan.stages.length,
      dependencyMode: batchPlan.dependencyMode,
      parallelStageExecution: batchPlan.parallelStageExecution,
      stateFamilyConflictPolicy: batchPlan.stateFamilyConflictPolicy,
      stateFamilyConflictDeferrals: batchPlan.stateFamilyConflictDeferrals,
      stateFamilyConflictDeferralCount: batchPlan.stateFamilyConflictDeferralCount,
      placementBatches: batchPlan.executionBatches,
      maxConcurrentStageCount: batchPlan.maxConcurrentStageCount,
      stagePlacements,
      executorSources: Object.fromEntries(stagePlacements.map((entry) => [entry.stageId, entry.executorSource])),
      workerResidencyStatuses: Object.fromEntries(stagePlacements.map((entry) => [entry.stageId, entry.workerResidencyStatus])),
      missingExecutorStageIds,
      missingExecutorCount: missingExecutorStageIds.length,
      workerRequestedStageIds,
      workerRequestedCount: workerRequestedStageIds.length,
      workerReadyStageIds,
      workerReadyCount: workerReadyStageIds.length,
      workerFallbackStageIds,
      workerFallbackCount: workerFallbackStageIds.length,
      canExecute,
      createdAt: this.now()
    };
  }

  planStagePlacement(leaseOrId, options = {}) {
    return this.preflightStagePlacement(leaseOrId, options);
  }

  rejectLease(leaseId, reason = 'lane-validation-rejected') {
    const lease = this.leases.get(leaseId);
    if (!lease) throw new Error(`Unknown GPU resident lane lease: ${leaseId}`);
    const lane = this.lanes.get(lease.laneId);
    lease.status = 'rejected';
    lease.releasedAt = this.now();
    lease.releaseReason = reason;
    if (lane) {
      lane.activeLeases.delete(leaseId);
      lane.updatedAt = this.now();
    }
    this.leases.delete(leaseId);
    this.stats.activeLeaseCount = this.leases.size;
    this.stats.rejectedLeaseCount += 1;
    return clonePlain(lease);
  }

  snapshotLane(laneId) {
    const lane = this.lanes.get(laneId);
    if (!lane) return null;
    return {
      schema: lane.schema,
      laneId: lane.laneId,
      stateKey: lane.stateKey,
      domainKey: lane.domainKey,
      solverId: lane.solverId,
      deviceId: lane.deviceId,
      queueFencePolicy: lane.queueFencePolicy,
      status: lane.status,
      activeLeaseCount: lane.activeLeases.size,
      retainedBufferRefs: [...lane.retainedBufferRefs].sort(),
      copyBudget: clonePlain(lane.copyBudget),
      residentSequenceLaneContract: clonePlain(lane.residentSequenceLaneContract),
      stagePlan: clonePlain(lane.stagePlan),
      createdAt: lane.createdAt,
      updatedAt: lane.updatedAt,
      lastFence: clonePlain(lane.lastFence)
    };
  }

  listLanes() {
    return [...this.lanes.keys()].sort().map((laneId) => this.snapshotLane(laneId));
  }

  getStats() {
    return {
      ...clonePlain(this.stats),
      laneCount: this.lanes.size,
      activeLeaseCount: this.leases.size,
      lanes: this.listLanes()
    };
  }
}
