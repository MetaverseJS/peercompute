export const GPU_RESIDENT_LANE_MANAGER_SCHEMA = 'peercompute.compute.gpu-resident-lane-manager.v0';
export const GPU_RESIDENT_LANE_SCHEMA = 'peercompute.compute.gpu-resident-lane.v0';
export const GPU_RESIDENT_LANE_LEASE_SCHEMA = 'peercompute.compute.gpu-resident-lane-lease.v0';
export const GPU_RESIDENT_LANE_EXECUTION_SCHEMA = 'peercompute.compute.gpu-resident-lane-execution.v0';
export const GPU_RESIDENT_LANE_COPY_BUDGET_SCHEMA = 'peercompute.compute.gpu-resident-lane-copy-budget.v0';
export const GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA = 'peercompute.compute.gpu-fence-report.v0';
export const GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA = 'peercompute.compute.gpu-resident-lane-stage-plan.v0';
export const GPU_RESIDENT_LANE_STAGE_EXECUTION_SCHEMA = 'peercompute.compute.gpu-resident-lane-stage-execution.v0';

const DEFAULT_QUEUE_FENCE_POLICY = 'queue.onSubmittedWorkDone-before-readback-map';

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
    || stagePlan.dependencyMode === 'explicit-stage-dependencies'
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
    const existing = this.lanes.get(laneId);
    if (existing) {
      if (stateKey && existing.stateKey && existing.stateKey !== stateKey) {
        throw new Error(`GPU resident lane ${laneId} already owns stateKey ${existing.stateKey}, not ${stateKey}`);
      }
      if (stateKey && !existing.stateKey) existing.stateKey = stateKey;
      if (spec.domainKey && !existing.domainKey) existing.domainKey = normalizeString(spec.domainKey, null);
      if (spec.solverId && !existing.solverId) existing.solverId = normalizeString(spec.solverId, null);
      return existing;
    }

    const lane = {
      schema: GPU_RESIDENT_LANE_SCHEMA,
      laneId,
      stateKey,
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
    const executionBatches = [];
    const stageValues = {};
    const stageIds = new Set(stagePlan.stages.map((stage) => stage.id));
    for (const stage of stagePlan.stages) {
      for (const dependencyId of stage.dependsOn || []) {
        if (!stageIds.has(dependencyId)) {
          const err = new Error(`GPU resident lane stage ${stage.id} depends on unknown stage ${dependencyId}`);
          err.code = 'ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING';
          err.stage = clonePlain(stage);
          throw err;
        }
      }
    }
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

    const useExplicitDependencies = stagePlanUsesExplicitDependencies(stagePlan);
    if (useExplicitDependencies) {
      const pending = new Map(stagePlan.stages.map((stage) => [stage.id, stage]));
      while (pending.size > 0) {
        const completedStageIds = new Set(Object.keys(stageValues));
        const ready = stagePlan.stages
          .filter((stage) => pending.has(stage.id))
          .filter((stage) => (stage.dependsOn || []).every((dependencyId) => completedStageIds.has(dependencyId)));
        if (!ready.length) {
          const err = new Error(`GPU resident lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(pending.keys()).join(', ')}`);
          err.code = 'ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_CYCLE';
          throw err;
        }
        executionBatches.push(ready.map((stage) => stage.id));
        const readyResults = await Promise.all(ready.map((stage) => runOneStage(
          stage,
          inputForStage(stage, {
            baseInput: input,
            currentValue,
            stageValues
          })
        )));
        for (let i = 0; i < ready.length; i += 1) {
          const stage = ready[i];
          const entry = readyResults[i];
          pending.delete(stage.id);
          stageValues[stage.id] = entry.value;
          currentValue = entry.value;
          stageResults.push(entry.result);
        }
      }
    } else {
      for (const stage of stagePlan.stages) {
        executionBatches.push([stage.id]);
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
      dependencyMode: useExplicitDependencies ? 'explicit-stage-dependencies' : 'sequential-stage-order',
      parallelStageExecution: useExplicitDependencies,
      executionBatches,
      maxConcurrentStageCount: executionBatches.reduce((max, batch) => Math.max(max, batch.length), 0),
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
