import {
  deepFreeze,
  RACE_LIMITS,
  ROAD_RACE_COURSE_SCHEMA,
  ROAD_RACE_SNAPSHOT_SCHEMA,
} from './constants.js';
import { detectGateCrossing, inspectGateCrossing } from './crossing.js';

const STATUS_VALUES = new Set(['ready', 'racing', 'finished']);

export class RoadRaceStateError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'RoadRaceStateError';
    this.code = code;
  }
}

function fail(code, message, ErrorType = RoadRaceStateError) {
  if (ErrorType === RoadRaceStateError) throw new RoadRaceStateError(code, message);
  const error = new ErrorType(message);
  error.code = code;
  throw error;
}

function finiteNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail('ERR_RACE_NON_FINITE', `${name} must be a finite number.`, TypeError);
  }
  return value;
}

function finiteNonNegative(value, name) {
  const number = finiteNumber(value, name);
  if (number < 0) fail('ERR_RACE_TIME_NEGATIVE', `${name} must not be negative.`, RangeError);
  return number;
}

function finiteVector3(value, name) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    fail('ERR_RACE_POSITION', `${name} must be an [x, y, z] array.`, TypeError);
  }
  return [
    finiteNumber(value[0], `${name}[0]`),
    finiteNumber(value[1], `${name}[1]`),
    finiteNumber(value[2], `${name}[2]`),
  ];
}

function boundedInteger(value, fallback, minimum, maximum, name) {
  const selected = value ?? fallback;
  if (!Number.isSafeInteger(selected) || selected < minimum || selected > maximum) {
    fail('ERR_RACE_OPTION_BOUNDS', `${name} must be an integer between ${minimum} and ${maximum}.`, RangeError);
  }
  return selected;
}

function clonePlain(value) {
  if (Array.isArray(value)) return value.map(clonePlain);
  if (!value || typeof value !== 'object') return value;
  const clone = {};
  for (const [key, child] of Object.entries(value)) clone[key] = clonePlain(child);
  return clone;
}

function validateSerializableTree(value, name, budget = { remaining: 20_000 }) {
  budget.remaining -= 1;
  if (budget.remaining < 0) fail('ERR_RACE_SNAPSHOT_CAP', `${name} exceeds the snapshot validation cap.`, RangeError);
  if (typeof value === 'number') {
    finiteNumber(value, name);
    return;
  }
  if (typeof value === 'string') {
    if (value.length > 4_096) fail('ERR_RACE_SNAPSHOT_CAP', `${name} contains an oversized string.`, RangeError);
    return;
  }
  if (value === null || typeof value === 'boolean') return;
  if (!value || typeof value !== 'object') {
    fail('ERR_RACE_SNAPSHOT_DATA', `${name} contains a non-serializable value.`, TypeError);
  }
  for (const [key, child] of Object.entries(value)) {
    validateSerializableTree(child, `${name}.${key}`, budget);
  }
}

function normalizeCourse(course) {
  if (!course || typeof course !== 'object' || course.schemaVersion !== ROAD_RACE_COURSE_SCHEMA) {
    fail('ERR_RACE_COURSE_SCHEMA', `course.schemaVersion must be ${ROAD_RACE_COURSE_SCHEMA}.`, TypeError);
  }
  if (typeof course.id !== 'string' || course.id.length === 0 || !Array.isArray(course.gates)) {
    fail('ERR_RACE_COURSE_SCHEMA', 'Course id and ordered gates are required.', TypeError);
  }
  if (course.gates.length < 2 || course.gates.length > RACE_LIMITS.absoluteMaxGates) {
    fail('ERR_RACE_GATE_CAP', `Course must contain between 2 and ${RACE_LIMITS.absoluteMaxGates} gates.`, RangeError);
  }
  if (course.provenance?.geometrySource !== 'real OSM road graph'
    || course.provenance?.courseNature !== 'game-derived course'
    || course.provenance?.navigationGrade !== false
    || course.source?.navigationGrade !== false) {
    fail('ERR_RACE_COURSE_TRUTH', 'Course must preserve real-OSM/game-derived/non-navigation provenance.', TypeError);
  }
  if (course.lapCapable !== true && course.lapCapable !== false) {
    fail('ERR_RACE_COURSE_SCHEMA', 'course.lapCapable must be explicit.', TypeError);
  }
  const gateIds = new Set();
  course.gates.forEach((gate, index) => {
    if (gate?.order !== index || typeof gate.id !== 'string' || gateIds.has(gate.id)) {
      fail('ERR_RACE_GATE_ORDER', 'Course gates must have unique ids in contiguous stable order.', TypeError);
    }
    gateIds.add(gate.id);
    const point = finiteVector3(gate.crossing?.planePointLocal, `Gate ${gate.id} planePointLocal`);
    const normal = finiteVector3(gate.crossing?.planeNormalLocal, `Gate ${gate.id} planeNormalLocal`);
    const before = point.map((component, axis) => component - normal[axis] * 2);
    const after = point.map((component, axis) => component + normal[axis] * 2);
    if (!detectGateCrossing(gate, before, after)) {
      fail('ERR_RACE_GATE_CORRIDOR', `Gate ${gate.id} does not define a usable finite crossing corridor.`, TypeError);
    }
  });
  return course;
}

function normalizeOptions(course, options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    fail('ERR_RACE_OPTIONS', 'Race session options must be an object.', TypeError);
  }
  const requestedTotalLaps = boundedInteger(
    options.totalLaps,
    RACE_LIMITS.defaultLaps,
    1,
    RACE_LIMITS.absoluteMaxLaps,
    'totalLaps',
  );
  const maxPassageHistory = boundedInteger(
    options.maxPassageHistory,
    RACE_LIMITS.defaultMaxPassageHistory,
    1,
    RACE_LIMITS.absoluteMaxPassageHistory,
    'maxPassageHistory',
  );
  const maxRejectionHistory = boundedInteger(
    options.maxRejectionHistory,
    RACE_LIMITS.defaultMaxRejectionHistory,
    1,
    RACE_LIMITS.absoluteMaxRejectionHistory,
    'maxRejectionHistory',
  );
  const maxCrossingsPerStep = boundedInteger(
    options.maxCrossingsPerStep,
    RACE_LIMITS.defaultMaxCrossingsPerStep,
    1,
    RACE_LIMITS.absoluteMaxCrossingsPerStep,
    'maxCrossingsPerStep',
  );
  const planeEpsilonMeters = finiteNumber(options.planeEpsilonMeters ?? 1e-6, 'planeEpsilonMeters');
  const corridorEpsilonMeters = finiteNumber(options.corridorEpsilonMeters ?? 1e-6, 'corridorEpsilonMeters');
  if (planeEpsilonMeters <= 0 || planeEpsilonMeters > 1) {
    fail('ERR_RACE_OPTION_BOUNDS', 'planeEpsilonMeters must be greater than zero and at most one.', RangeError);
  }
  if (corridorEpsilonMeters < 0 || corridorEpsilonMeters > 10) {
    fail('ERR_RACE_OPTION_BOUNDS', 'corridorEpsilonMeters must be between zero and ten.', RangeError);
  }
  return Object.freeze({
    requestedTotalLaps,
    totalLaps: course.lapCapable ? requestedTotalLaps : 1,
    lapCountLimitedByOpenCourse: !course.lapCapable && requestedTotalLaps !== 1,
    maxPassageHistory,
    maxRejectionHistory,
    maxCrossingsPerStep,
    planeEpsilonMeters,
    corridorEpsilonMeters,
  });
}

function initialState() {
  return {
    status: 'ready',
    currentLap: 1,
    completedLaps: 0,
    expectedGateIndex: 0,
    passedGateIds: new Set(),
    raceStartedAtSeconds: null,
    lapStartedAtSeconds: null,
    lastGateAtSeconds: null,
    lastSuppliedTimeSeconds: null,
    finishedAtSeconds: null,
    currentLapSplits: [],
    lapRecords: [],
    passageHistory: [],
    rejectionHistory: [],
    counters: {
      acceptedPassageCount: 0,
      rejectedOutOfOrderCount: 0,
      duplicatePassageCount: 0,
      missedGateCount: 0,
      crossingOverflowCount: 0,
      passageHistoryDroppedCount: 0,
      rejectionHistoryDroppedCount: 0,
      stepCount: 0,
    },
    lastStep: null,
  };
}

function appendBounded(target, value, maximum, counters, droppedCounter) {
  target.push(value);
  if (target.length > maximum) {
    target.shift();
    counters[droppedCounter] += 1;
  }
}

function elapsed(now, start) {
  if (now === null || start === null) return 0;
  return Math.max(0, now - start);
}

export class RoadRaceSession {
  #course;
  #config;
  #state;

  constructor(course, options = {}) {
    this.#course = normalizeCourse(course);
    const snapshotConfig = options.snapshot?.config;
    this.#config = normalizeOptions(course, {
      ...options,
      totalLaps: options.totalLaps
        ?? snapshotConfig?.requestedTotalLaps
        ?? options.snapshot?.laps?.requestedTotal,
      maxPassageHistory: options.maxPassageHistory ?? snapshotConfig?.maxPassageHistory,
      maxRejectionHistory: options.maxRejectionHistory ?? snapshotConfig?.maxRejectionHistory,
      maxCrossingsPerStep: options.maxCrossingsPerStep ?? snapshotConfig?.maxCrossingsPerStep,
      planeEpsilonMeters: options.planeEpsilonMeters ?? snapshotConfig?.planeEpsilonMeters,
      corridorEpsilonMeters: options.corridorEpsilonMeters ?? snapshotConfig?.corridorEpsilonMeters,
    });
    this.#state = initialState();
    if (options.snapshot !== undefined) this.restore(options.snapshot);
  }

  get course() {
    return this.#course;
  }

  get status() {
    return this.#state.status;
  }

  get expectedGate() {
    return this.#state.expectedGateIndex === null
      ? null
      : this.#course.gates[this.#state.expectedGateIndex];
  }

  #appendPassage(event) {
    appendBounded(
      this.#state.passageHistory,
      event,
      this.#config.maxPassageHistory,
      this.#state.counters,
      'passageHistoryDroppedCount',
    );
  }

  #appendRejection(event) {
    appendBounded(
      this.#state.rejectionHistory,
      event,
      this.#config.maxRejectionHistory,
      this.#state.counters,
      'rejectionHistoryDroppedCount',
    );
  }

  #passageEvent(gate, crossing, passageTimeSeconds, role, exactlyOnceKey) {
    const event = deepFreeze({
      id: `${this.#course.id}/passage/${this.#state.counters.acceptedPassageCount}`,
      exactlyOnceKey,
      role,
      gateId: gate.id,
      gateIndex: gate.order,
      lap: this.#state.currentLap,
      passageTimeSeconds,
      raceElapsedSeconds: elapsed(passageTimeSeconds, this.#state.raceStartedAtSeconds),
      lapElapsedSeconds: elapsed(passageTimeSeconds, this.#state.lapStartedAtSeconds),
      splitSeconds: elapsed(passageTimeSeconds, this.#state.lastGateAtSeconds),
      crossingAlpha: crossing.alpha,
      crossingPointLocal: crossing.pointLocal,
    });
    this.#state.counters.acceptedPassageCount += 1;
    this.#appendPassage(event);
    return event;
  }

  #checkpointSplit(gate, passageTimeSeconds, crossing) {
    return deepFreeze({
      gateId: gate.id,
      gateIndex: gate.order,
      passageTimeSeconds,
      lapElapsedSeconds: elapsed(passageTimeSeconds, this.#state.lapStartedAtSeconds),
      splitSeconds: elapsed(passageTimeSeconds, this.#state.lastGateAtSeconds),
      crossingAlpha: crossing.alpha,
    });
  }

  #finishLap(gate, crossing, passageTimeSeconds, role) {
    const lapNumber = this.#state.currentLap;
    const finishSplit = this.#checkpointSplit(gate, passageTimeSeconds, crossing);
    const lapTimeSeconds = elapsed(passageTimeSeconds, this.#state.lapStartedAtSeconds);
    this.#state.currentLapSplits.push(finishSplit);
    this.#state.lapRecords.push(deepFreeze({
      lap: lapNumber,
      startedAtSeconds: this.#state.lapStartedAtSeconds,
      finishedAtSeconds: passageTimeSeconds,
      lapTimeSeconds,
      gateSplits: [...this.#state.currentLapSplits],
    }));
    const event = this.#passageEvent(
      gate,
      crossing,
      passageTimeSeconds,
      role,
      `lap/${lapNumber}/finish`,
    );
    this.#state.completedLaps += 1;
    this.#state.lastGateAtSeconds = passageTimeSeconds;
    if (this.#state.completedLaps >= this.#config.totalLaps) {
      this.#state.status = 'finished';
      this.#state.finishedAtSeconds = passageTimeSeconds;
      this.#state.expectedGateIndex = null;
      this.#state.passedGateIds.add(gate.id);
      return event;
    }
    this.#state.currentLap += 1;
    this.#state.lapStartedAtSeconds = passageTimeSeconds;
    this.#state.lastGateAtSeconds = passageTimeSeconds;
    this.#state.currentLapSplits = [];
    this.#state.passedGateIds = new Set([this.#course.gates[0].id]);
    this.#state.expectedGateIndex = 1;
    return event;
  }

  #acceptExpected(gate, crossing, passageTimeSeconds) {
    if (this.#state.status === 'ready') {
      this.#state.status = 'racing';
      this.#state.raceStartedAtSeconds = passageTimeSeconds;
      this.#state.lapStartedAtSeconds = passageTimeSeconds;
      this.#state.lastGateAtSeconds = passageTimeSeconds;
      this.#state.passedGateIds.add(gate.id);
      this.#state.expectedGateIndex = 1;
      return this.#passageEvent(gate, crossing, passageTimeSeconds, 'start', 'race/start');
    }

    if (this.#course.lapCapable && gate.order === 0) {
      const finalLap = this.#state.completedLaps + 1 >= this.#config.totalLaps;
      return this.#finishLap(
        gate,
        crossing,
        passageTimeSeconds,
        finalLap ? 'finish' : 'lap-boundary',
      );
    }

    const isOpenFinish = !this.#course.lapCapable && gate.order === this.#course.gates.length - 1;
    if (isOpenFinish) {
      return this.#finishLap(gate, crossing, passageTimeSeconds, 'finish');
    }

    const split = this.#checkpointSplit(gate, passageTimeSeconds, crossing);
    const event = this.#passageEvent(
      gate,
      crossing,
      passageTimeSeconds,
      'checkpoint',
      `lap/${this.#state.currentLap}/gate/${gate.order}`,
    );
    this.#state.currentLapSplits.push(split);
    this.#state.passedGateIds.add(gate.id);
    this.#state.lastGateAtSeconds = passageTimeSeconds;
    this.#state.expectedGateIndex = gate.order + 1 < this.#course.gates.length
      ? gate.order + 1
      : 0;
    return event;
  }

  #reject(gate, crossing, passageTimeSeconds, reason) {
    if (reason === 'out-of-order') this.#state.counters.rejectedOutOfOrderCount += 1;
    if (reason === 'duplicate') this.#state.counters.duplicatePassageCount += 1;
    if (reason === 'missed-gate-corridor') this.#state.counters.missedGateCount += 1;
    const event = deepFreeze({
      id: `${this.#course.id}/rejection/${this.#state.counters.rejectedOutOfOrderCount
        + this.#state.counters.duplicatePassageCount + this.#state.counters.missedGateCount}`,
      reason,
      gateId: gate.id,
      gateIndex: gate.order,
      expectedGateId: this.expectedGate?.id ?? null,
      expectedGateIndex: this.#state.expectedGateIndex,
      lap: this.#state.currentLap,
      passageTimeSeconds,
      crossingAlpha: crossing.alpha,
      crossingPointLocal: crossing.pointLocal,
      lateralMeters: crossing.lateralMeters,
      heightMeters: crossing.heightMeters,
    });
    this.#appendRejection(event);
    return event;
  }

  /**
   * Advance with a swept local-space point and caller-supplied monotonic
   * simulation-time interval. No wall clock is read by this module.
   */
  stepMotion({
    previousLocalPosition,
    currentLocalPosition,
    fromTimeSeconds,
    toTimeSeconds,
  } = {}) {
    const from = finiteVector3(previousLocalPosition, 'previousLocalPosition');
    const to = finiteVector3(currentLocalPosition, 'currentLocalPosition');
    const fromTime = finiteNonNegative(fromTimeSeconds, 'fromTimeSeconds');
    const toTime = finiteNonNegative(toTimeSeconds, 'toTimeSeconds');
    if (toTime < fromTime) {
      fail('ERR_RACE_TIME_ORDER', 'toTimeSeconds must be greater than or equal to fromTimeSeconds.', RangeError);
    }
    if (this.#state.lastSuppliedTimeSeconds !== null
      && fromTime + Number.EPSILON < this.#state.lastSuppliedTimeSeconds) {
      fail('ERR_RACE_TIME_MONOTONIC', 'Caller-supplied race time must be monotonic across motion steps.', RangeError);
    }

    const crossingOptions = {
      planeEpsilonMeters: this.#config.planeEpsilonMeters,
      corridorEpsilonMeters: this.#config.corridorEpsilonMeters,
    };
    let candidates = this.#course.gates.map((gate) => ({
      gate,
      crossing: inspectGateCrossing(gate, from, to, crossingOptions),
    })).filter((candidate) => candidate.crossing !== null)
      .sort((left, right) => (
        left.crossing.alpha - right.crossing.alpha || left.gate.order - right.gate.order
      ));
    const candidateCount = candidates.length;
    if (candidates.length > this.#config.maxCrossingsPerStep) {
      this.#state.counters.crossingOverflowCount += candidates.length - this.#config.maxCrossingsPerStep;
      candidates = candidates.slice(0, this.#config.maxCrossingsPerStep);
    }

    const acceptedPassages = [];
    const rejections = [];
    const timeSpan = toTime - fromTime;
    for (const { gate, crossing } of candidates) {
      if (this.#state.status === 'finished') break;
      const passageTimeSeconds = fromTime + timeSpan * crossing.alpha;
      if (crossing.status === 'missed-corridor') {
        if (gate.order === this.#state.expectedGateIndex) {
          rejections.push(this.#reject(
            gate,
            crossing,
            passageTimeSeconds,
            'missed-gate-corridor',
          ));
        }
        continue;
      }
      if (gate.order === this.#state.expectedGateIndex) {
        acceptedPassages.push(this.#acceptExpected(gate, crossing, passageTimeSeconds));
      } else if (this.#state.passedGateIds.has(gate.id)) {
        rejections.push(this.#reject(gate, crossing, passageTimeSeconds, 'duplicate'));
      } else {
        rejections.push(this.#reject(gate, crossing, passageTimeSeconds, 'out-of-order'));
      }
    }

    this.#state.lastSuppliedTimeSeconds = toTime;
    this.#state.counters.stepCount += 1;
    this.#state.lastStep = deepFreeze({
      fromTimeSeconds: fromTime,
      toTimeSeconds: toTime,
      previousLocalPosition: from,
      currentLocalPosition: to,
      candidateCount,
      processedCandidateCount: candidates.length,
      acceptedPassages,
      rejections,
      statusAfterStep: this.#state.status,
      expectedGateIdAfterStep: this.expectedGate?.id ?? null,
    });
    return this.getSnapshot();
  }

  advance(motion) {
    return this.stepMotion(motion);
  }

  step(motion) {
    return this.stepMotion(motion);
  }

  getSnapshot() {
    const now = this.#state.lastSuppliedTimeSeconds;
    const lapTimes = this.#state.lapRecords.map((record) => record.lapTimeSeconds);
    const bestLapSeconds = lapTimes.length === 0 ? null : Math.min(...lapTimes);
    const lastLapSeconds = lapTimes.length === 0 ? null : lapTimes[lapTimes.length - 1];
    const raceElapsedSeconds = this.#state.status === 'finished'
      ? elapsed(this.#state.finishedAtSeconds, this.#state.raceStartedAtSeconds)
      : elapsed(now, this.#state.raceStartedAtSeconds);
    const currentLapSeconds = this.#state.status === 'finished'
      ? (lastLapSeconds ?? 0)
      : elapsed(now, this.#state.lapStartedAtSeconds);
    const currentSplitSeconds = this.#state.status === 'racing'
      ? elapsed(now, this.#state.lastGateAtSeconds)
      : 0;
    const passedGateIds = this.#course.gates
      .filter((gate) => this.#state.passedGateIds.has(gate.id))
      .map((gate) => gate.id);
    const serializedState = {
      status: this.#state.status,
      currentLap: this.#state.currentLap,
      completedLaps: this.#state.completedLaps,
      expectedGateIndex: this.#state.expectedGateIndex,
      passedGateIds,
      raceStartedAtSeconds: this.#state.raceStartedAtSeconds,
      lapStartedAtSeconds: this.#state.lapStartedAtSeconds,
      lastGateAtSeconds: this.#state.lastGateAtSeconds,
      lastSuppliedTimeSeconds: this.#state.lastSuppliedTimeSeconds,
      finishedAtSeconds: this.#state.finishedAtSeconds,
      currentLapSplits: clonePlain(this.#state.currentLapSplits),
      lapRecords: clonePlain(this.#state.lapRecords),
      passageHistory: clonePlain(this.#state.passageHistory),
      rejectionHistory: clonePlain(this.#state.rejectionHistory),
      counters: { ...this.#state.counters },
      lastStep: clonePlain(this.#state.lastStep),
    };
    return deepFreeze({
      schemaVersion: ROAD_RACE_SNAPSHOT_SCHEMA,
      courseId: this.#course.id,
      status: this.#state.status,
      timingSource: 'caller-monotonic-simulation-time',
      mode: this.#course.raceMode,
      laps: {
        requestedTotal: this.#config.requestedTotalLaps,
        total: this.#config.totalLaps,
        current: this.#state.currentLap,
        completed: this.#state.completedLaps,
        limitedByOpenCourse: this.#config.lapCountLimitedByOpenCourse,
      },
      progress: {
        expectedGateIndex: this.#state.expectedGateIndex,
        expectedGateId: this.expectedGate?.id ?? null,
        passedGateIds,
        acceptedPassageCount: this.#state.counters.acceptedPassageCount,
        rejectedOutOfOrderCount: this.#state.counters.rejectedOutOfOrderCount,
        duplicatePassageCount: this.#state.counters.duplicatePassageCount,
        missedGateCount: this.#state.counters.missedGateCount,
        crossingOverflowCount: this.#state.counters.crossingOverflowCount,
        exactlyOnce: true,
      },
      timing: {
        running: this.#state.status === 'racing',
        suppliedTimeSeconds: now,
        raceStartedAtSeconds: this.#state.raceStartedAtSeconds,
        lapStartedAtSeconds: this.#state.lapStartedAtSeconds,
        finishedAtSeconds: this.#state.finishedAtSeconds,
        raceElapsedSeconds,
        currentLapSeconds,
        currentSplitSeconds,
        lastLapSeconds,
        bestLapSeconds,
        finishTimeSeconds: this.#state.status === 'finished' ? raceElapsedSeconds : null,
      },
      currentLapSplits: clonePlain(this.#state.currentLapSplits),
      lapRecords: clonePlain(this.#state.lapRecords),
      passageHistory: clonePlain(this.#state.passageHistory),
      rejectionHistory: clonePlain(this.#state.rejectionHistory),
      lastStep: clonePlain(this.#state.lastStep),
      caps: {
        totalLaps: RACE_LIMITS.absoluteMaxLaps,
        passageHistory: this.#config.maxPassageHistory,
        rejectionHistory: this.#config.maxRejectionHistory,
        crossingsPerStep: this.#config.maxCrossingsPerStep,
      },
      config: {
        requestedTotalLaps: this.#config.requestedTotalLaps,
        totalLaps: this.#config.totalLaps,
        maxPassageHistory: this.#config.maxPassageHistory,
        maxRejectionHistory: this.#config.maxRejectionHistory,
        maxCrossingsPerStep: this.#config.maxCrossingsPerStep,
        planeEpsilonMeters: this.#config.planeEpsilonMeters,
        corridorEpsilonMeters: this.#config.corridorEpsilonMeters,
      },
      provenance: this.#course.provenance,
      state: serializedState,
    });
  }

  snapshot() {
    return this.getSnapshot();
  }

  reset() {
    this.#state = initialState();
    return this.getSnapshot();
  }

  restore(snapshot) {
    if (!snapshot || typeof snapshot !== 'object'
      || snapshot.schemaVersion !== ROAD_RACE_SNAPSHOT_SCHEMA) {
      fail('ERR_RACE_SNAPSHOT_SCHEMA', `snapshot.schemaVersion must be ${ROAD_RACE_SNAPSHOT_SCHEMA}.`, TypeError);
    }
    if (snapshot.courseId !== this.#course.id) {
      fail('ERR_RACE_SNAPSHOT_COURSE', 'Snapshot belongs to a different deterministic race course.', TypeError);
    }
    if (snapshot.laps?.requestedTotal !== this.#config.requestedTotalLaps
      || snapshot.laps?.total !== this.#config.totalLaps) {
      fail('ERR_RACE_SNAPSHOT_LAPS', 'Snapshot lap configuration does not match this race session.', TypeError);
    }
    const expectedConfig = {
      requestedTotalLaps: this.#config.requestedTotalLaps,
      totalLaps: this.#config.totalLaps,
      maxPassageHistory: this.#config.maxPassageHistory,
      maxRejectionHistory: this.#config.maxRejectionHistory,
      maxCrossingsPerStep: this.#config.maxCrossingsPerStep,
      planeEpsilonMeters: this.#config.planeEpsilonMeters,
      corridorEpsilonMeters: this.#config.corridorEpsilonMeters,
    };
    if (!snapshot.config || Object.entries(expectedConfig).some(([key, value]) => (
      snapshot.config[key] !== value
    ))) {
      fail('ERR_RACE_SNAPSHOT_CONFIG', 'Snapshot race bounds/configuration do not match this session.', TypeError);
    }
    const state = snapshot.state;
    if (!state || typeof state !== 'object' || !STATUS_VALUES.has(state.status)) {
      fail('ERR_RACE_SNAPSHOT_STATE', 'Snapshot contains an invalid race state.', TypeError);
    }
    validateSerializableTree(state, 'snapshot.state');
    const currentLap = boundedInteger(state.currentLap, null, 1, this.#config.totalLaps, 'snapshot currentLap');
    const completedLaps = boundedInteger(
      state.completedLaps,
      null,
      0,
      this.#config.totalLaps,
      'snapshot completedLaps',
    );
    const expectedGateIndex = state.expectedGateIndex === null
      ? null
      : boundedInteger(
        state.expectedGateIndex,
        null,
        0,
        this.#course.gates.length - 1,
        'snapshot expectedGateIndex',
      );
    if (!Array.isArray(state.passedGateIds)
      || state.passedGateIds.length > this.#course.gates.length
      || new Set(state.passedGateIds).size !== state.passedGateIds.length
      || state.passedGateIds.some((id) => !this.#course.gates.some((gate) => gate.id === id))) {
      fail('ERR_RACE_SNAPSHOT_GATES', 'Snapshot passedGateIds are invalid.', TypeError);
    }
    const arrays = [
      ['currentLapSplits', state.currentLapSplits, this.#course.gates.length],
      ['lapRecords', state.lapRecords, this.#config.totalLaps],
      ['passageHistory', state.passageHistory, this.#config.maxPassageHistory],
      ['rejectionHistory', state.rejectionHistory, this.#config.maxRejectionHistory],
    ];
    for (const [name, value, cap] of arrays) {
      if (!Array.isArray(value) || value.length > cap) {
        fail('ERR_RACE_SNAPSHOT_CAP', `Snapshot ${name} exceeds its bounded cap.`, RangeError);
      }
    }
    const nullableTime = (value, name) => (
      value === null ? null : finiteNonNegative(value, name)
    );
    const raceStartedAtSeconds = nullableTime(state.raceStartedAtSeconds, 'snapshot raceStartedAtSeconds');
    const lapStartedAtSeconds = nullableTime(state.lapStartedAtSeconds, 'snapshot lapStartedAtSeconds');
    const lastGateAtSeconds = nullableTime(state.lastGateAtSeconds, 'snapshot lastGateAtSeconds');
    const lastSuppliedTimeSeconds = nullableTime(
      state.lastSuppliedTimeSeconds,
      'snapshot lastSuppliedTimeSeconds',
    );
    const finishedAtSeconds = nullableTime(state.finishedAtSeconds, 'snapshot finishedAtSeconds');
    if (!state.counters || typeof state.counters !== 'object') {
      fail('ERR_RACE_SNAPSHOT_COUNTERS', 'Snapshot counters are required.', TypeError);
    }
    const counterNames = Object.keys(initialState().counters);
    const counters = {};
    for (const name of counterNames) {
      counters[name] = boundedInteger(
        state.counters[name],
        null,
        0,
        Number.MAX_SAFE_INTEGER,
        `snapshot counter ${name}`,
      );
    }
    if (state.lapRecords.length !== completedLaps) {
      fail('ERR_RACE_SNAPSHOT_LAPS', 'Snapshot lap record count does not match completed laps.', TypeError);
    }
    if (state.status === 'ready') {
      if (completedLaps !== 0 || currentLap !== 1 || expectedGateIndex !== 0
        || raceStartedAtSeconds !== null || lapStartedAtSeconds !== null
        || finishedAtSeconds !== null || state.passedGateIds.length !== 0) {
        fail('ERR_RACE_SNAPSHOT_STATE', 'Ready snapshot timing/progress is inconsistent.', TypeError);
      }
    } else if (state.status === 'racing') {
      if (completedLaps >= this.#config.totalLaps || currentLap !== completedLaps + 1
        || expectedGateIndex === null
        || raceStartedAtSeconds === null || lapStartedAtSeconds === null
        || lastGateAtSeconds === null || lastSuppliedTimeSeconds === null
        || finishedAtSeconds !== null) {
        fail('ERR_RACE_SNAPSHOT_STATE', 'Racing snapshot timing/progress is inconsistent.', TypeError);
      }
    } else if (completedLaps !== this.#config.totalLaps
      || currentLap !== this.#config.totalLaps || expectedGateIndex !== null
      || raceStartedAtSeconds === null || lastSuppliedTimeSeconds === null
      || finishedAtSeconds === null) {
      fail('ERR_RACE_SNAPSHOT_STATE', 'Finished snapshot timing/progress is inconsistent.', TypeError);
    }
    const expectedPassedGateIds = state.status === 'ready'
      ? []
      : state.status === 'finished' || expectedGateIndex === 0
        ? this.#course.gates.map((gate) => gate.id)
        : this.#course.gates.slice(0, expectedGateIndex).map((gate) => gate.id);
    if (state.passedGateIds.length !== expectedPassedGateIds.length
      || state.passedGateIds.some((id, index) => id !== expectedPassedGateIds[index])) {
      fail('ERR_RACE_SNAPSHOT_GATES', 'Snapshot passed gates do not match ordered exactly-once progress.', TypeError);
    }
    if (raceStartedAtSeconds !== null && lapStartedAtSeconds < raceStartedAtSeconds
      || lapStartedAtSeconds !== null && lastGateAtSeconds < lapStartedAtSeconds
      || finishedAtSeconds !== null && lastGateAtSeconds !== finishedAtSeconds) {
      fail('ERR_RACE_SNAPSHOT_TIME', 'Snapshot race/lap/gate times are not ordered.', RangeError);
    }
    if (lastSuppliedTimeSeconds !== null) {
      for (const [name, value] of [
        ['raceStartedAtSeconds', raceStartedAtSeconds],
        ['lapStartedAtSeconds', lapStartedAtSeconds],
        ['lastGateAtSeconds', lastGateAtSeconds],
        ['finishedAtSeconds', finishedAtSeconds],
      ]) {
        if (value !== null && value > lastSuppliedTimeSeconds + Number.EPSILON) {
          fail('ERR_RACE_SNAPSHOT_TIME', `Snapshot ${name} exceeds its last supplied time.`, RangeError);
        }
      }
    }
    this.#state = {
      status: state.status,
      currentLap,
      completedLaps,
      expectedGateIndex,
      passedGateIds: new Set(state.passedGateIds),
      raceStartedAtSeconds,
      lapStartedAtSeconds,
      lastGateAtSeconds,
      lastSuppliedTimeSeconds,
      finishedAtSeconds,
      currentLapSplits: clonePlain(state.currentLapSplits),
      lapRecords: clonePlain(state.lapRecords),
      passageHistory: clonePlain(state.passageHistory),
      rejectionHistory: clonePlain(state.rejectionHistory),
      counters,
      lastStep: clonePlain(state.lastStep),
    };
    return this.getSnapshot();
  }
}

export function createRoadRaceSession(course, options = {}) {
  return new RoadRaceSession(course, options);
}

export function restoreRoadRaceSession(course, snapshot, options = {}) {
  return new RoadRaceSession(course, {
    ...options,
    totalLaps: options.totalLaps
      ?? snapshot?.config?.requestedTotalLaps
      ?? snapshot?.laps?.requestedTotal,
    maxPassageHistory: options.maxPassageHistory ?? snapshot?.config?.maxPassageHistory,
    maxRejectionHistory: options.maxRejectionHistory ?? snapshot?.config?.maxRejectionHistory,
    maxCrossingsPerStep: options.maxCrossingsPerStep ?? snapshot?.config?.maxCrossingsPerStep,
    planeEpsilonMeters: options.planeEpsilonMeters ?? snapshot?.config?.planeEpsilonMeters,
    corridorEpsilonMeters: options.corridorEpsilonMeters ?? snapshot?.config?.corridorEpsilonMeters,
    snapshot,
  });
}
