import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createRoadRaceSession,
  deriveRoadRaceCourse,
  detectGateCrossing,
  inspectGateCrossing,
  restoreRoadRaceSession,
  ROAD_RACE_SNAPSHOT_SCHEMA,
} from '../../src/race/index.js';
import {
  createOpenLineGraph,
  createSquareLoopGraph,
  motionAcrossGate,
} from './fixtures.mjs';

function crossGate(session, gate, passageTimeSeconds, motionOptions = {}) {
  return session.stepMotion({
    ...motionAcrossGate(gate, motionOptions),
    fromTimeSeconds: passageTimeSeconds - 0.1,
    toTimeSeconds: passageTimeSeconds + 0.1,
  });
}

function assertFiniteNumbers(value, path = 'snapshot') {
  if (typeof value === 'number') {
    assert.equal(Number.isFinite(value), true, `${path} must be finite`);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) assertFiniteNumbers(child, `${path}.${key}`);
}

test('segment-plane corridor detection catches high-speed motion and rejects reverse/outside travel', () => {
  const course = deriveRoadRaceCourse(createOpenLineGraph(), { gateCount: 3 });
  const gate = course.gates[1];
  const forward = motionAcrossGate(gate, { distanceMeters: 500, heightMeters: 1 });
  const crossing = detectGateCrossing(
    gate,
    forward.previousLocalPosition,
    forward.currentLocalPosition,
  );
  assert.ok(crossing);
  assert.ok(crossing.alpha > 0 && crossing.alpha < 1);
  assert.ok(Math.abs(crossing.lateralMeters) < 1e-9);

  assert.equal(detectGateCrossing(
    gate,
    forward.currentLocalPosition,
    forward.previousLocalPosition,
  ), null, 'reverse travel must not count');

  const outside = motionAcrossGate(gate, {
    lateralMeters: gate.crossing.halfWidthMeters + 2,
    heightMeters: 1,
  });
  assert.equal(detectGateCrossing(gate, outside.previousLocalPosition, outside.currentLocalPosition), null);
  const missed = inspectGateCrossing(gate, outside.previousLocalPosition, outside.currentLocalPosition);
  assert.equal(missed.status, 'missed-corridor');
  assert.equal(missed.withinLateral, false);
});

test('missed, out-of-order, and duplicate gates are rejected while expected passage is exactly once', () => {
  const course = deriveRoadRaceCourse(createSquareLoopGraph(), { gateCount: 4 });
  const session = createRoadRaceSession(course, { totalLaps: 1 });

  let snapshot = crossGate(session, course.gates[1], 1);
  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.progress.rejectedOutOfOrderCount, 1);
  assert.equal(snapshot.progress.acceptedPassageCount, 0);

  snapshot = crossGate(session, course.gates[0], 2, {
    lateralMeters: course.gates[0].crossing.halfWidthMeters + 2,
  });
  assert.equal(snapshot.progress.missedGateCount, 1);
  assert.equal(snapshot.progress.expectedGateIndex, 0);

  snapshot = crossGate(session, course.gates[0], 3);
  assert.equal(snapshot.status, 'racing');
  assert.equal(snapshot.progress.acceptedPassageCount, 1);
  assert.equal(snapshot.progress.expectedGateIndex, 1);

  snapshot = crossGate(session, course.gates[0], 4);
  assert.equal(snapshot.progress.duplicatePassageCount, 1);
  assert.equal(snapshot.progress.acceptedPassageCount, 1);

  snapshot = crossGate(session, course.gates[2], 5);
  assert.equal(snapshot.progress.rejectedOutOfOrderCount, 2);
  assert.equal(snapshot.progress.expectedGateIndex, 1);

  snapshot = crossGate(session, course.gates[1], 6);
  assert.equal(snapshot.progress.acceptedPassageCount, 2);
  assert.equal(snapshot.progress.expectedGateIndex, 2);
  assert.equal(new Set(snapshot.passageHistory.map((event) => event.exactlyOnceKey)).size, 2);
  assert.deepEqual(snapshot.currentLapSplits.map((split) => split.gateIndex), [1]);
});

test('one high-speed swept step can accept multiple spatially ordered gates and finish', () => {
  const course = deriveRoadRaceCourse(createOpenLineGraph(), { gateCount: 5 });
  const session = createRoadRaceSession(course);
  const snapshot = session.stepMotion({
    previousLocalPosition: [-10, 1, 0],
    currentLocalPosition: [210, 1, 0],
    fromTimeSeconds: 10,
    toTimeSeconds: 20,
  });

  assert.equal(snapshot.status, 'finished');
  assert.equal(snapshot.laps.requestedTotal, 3);
  assert.equal(snapshot.laps.total, 1);
  assert.equal(snapshot.laps.limitedByOpenCourse, true);
  assert.equal(snapshot.progress.acceptedPassageCount, 5);
  assert.equal(snapshot.progress.rejectedOutOfOrderCount, 0);
  assert.equal(snapshot.lastStep.acceptedPassages.length, 5);
  assert.deepEqual(snapshot.lastStep.acceptedPassages.map((event) => event.gateIndex), [0, 1, 2, 3, 4]);
  assert.equal(snapshot.lapRecords.length, 1);
  assert.equal(snapshot.lapRecords[0].gateSplits.length, 4);
  const expectedTime = (
    (course.gates.at(-1).positionLocal[0] - course.gates[0].positionLocal[0]) / 220
  ) * 10;
  assert.ok(Math.abs(snapshot.timing.finishTimeSeconds - expectedTime) < 1e-9);
});

test('default three-lap timing reports checkpoint splits, current, best, and finish values', () => {
  const course = deriveRoadRaceCourse(createSquareLoopGraph(), { gateCount: 4 });
  const session = createRoadRaceSession(course);

  crossGate(session, course.gates[0], 10);
  crossGate(session, course.gates[1], 11);
  crossGate(session, course.gates[2], 12);
  crossGate(session, course.gates[3], 13);
  crossGate(session, course.gates[0], 14);
  crossGate(session, course.gates[1], 15);
  crossGate(session, course.gates[2], 16);
  crossGate(session, course.gates[3], 17);
  crossGate(session, course.gates[0], 18);
  crossGate(session, course.gates[1], 18.5);
  crossGate(session, course.gates[2], 19);
  crossGate(session, course.gates[3], 19.5);
  const snapshot = crossGate(session, course.gates[0], 20);

  assert.equal(snapshot.schemaVersion, ROAD_RACE_SNAPSHOT_SCHEMA);
  assert.equal(snapshot.status, 'finished');
  assert.equal(snapshot.timingSource, 'caller-monotonic-simulation-time');
  assert.deepEqual(snapshot.lapRecords.map((record) => record.lapTimeSeconds), [4, 4, 2]);
  assert.ok(snapshot.lapRecords.every((record) => record.gateSplits.length === 4));
  assert.equal(snapshot.timing.lastLapSeconds, 2);
  assert.equal(snapshot.timing.bestLapSeconds, 2);
  assert.equal(snapshot.timing.currentLapSeconds, 2);
  assert.equal(snapshot.timing.finishTimeSeconds, 10);
  assert.equal(snapshot.timing.raceElapsedSeconds, 10);
  assert.equal(snapshot.progress.acceptedPassageCount, 13);
  assert.equal(snapshot.laps.completed, 3);
  assert.equal(snapshot.laps.current, 3);
  assert.equal(snapshot.progress.expectedGateId, null);
  assert.equal(new Set(snapshot.passageHistory.map((event) => event.exactlyOnceKey)).size, 13);
  assertFiniteNumbers(snapshot);
});

test('reset clears race/timer state and bounded histories report dropped passages', () => {
  const course = deriveRoadRaceCourse(createSquareLoopGraph(), { gateCount: 3 });
  const session = createRoadRaceSession(course, {
    totalLaps: 1,
    maxPassageHistory: 2,
  });
  crossGate(session, course.gates[0], 1);
  crossGate(session, course.gates[1], 2);
  crossGate(session, course.gates[2], 3);
  const finished = crossGate(session, course.gates[0], 4);
  assert.equal(finished.status, 'finished');
  assert.equal(finished.passageHistory.length, 2);
  assert.equal(finished.state.counters.passageHistoryDroppedCount, 2);
  assert.deepEqual(restoreRoadRaceSession(course, finished).getSnapshot(), finished);

  const reset = session.reset();
  assert.equal(reset.status, 'ready');
  assert.equal(reset.progress.expectedGateIndex, 0);
  assert.equal(reset.progress.acceptedPassageCount, 0);
  assert.equal(reset.timing.suppliedTimeSeconds, null);
  assert.equal(reset.timing.raceElapsedSeconds, 0);
  assert.deepEqual(reset.passageHistory, []);
  assert.deepEqual(reset.lapRecords, []);
});

test('snapshot/restore resumes byte-for-byte and rejects time rollback or incompatible state', () => {
  const course = deriveRoadRaceCourse(createSquareLoopGraph(), { gateCount: 4 });
  const original = createRoadRaceSession(course, { totalLaps: 2 });
  crossGate(original, course.gates[0], 10);
  crossGate(original, course.gates[1], 11);
  const saved = original.getSnapshot();
  const restored = restoreRoadRaceSession(course, saved);
  const restoredDirectly = createRoadRaceSession(course, { snapshot: saved });
  assert.deepEqual(restored.getSnapshot(), saved);
  assert.deepEqual(restoredDirectly.getSnapshot(), saved);

  assert.throws(() => restored.stepMotion({
    ...motionAcrossGate(course.gates[2]),
    fromTimeSeconds: 10,
    toTimeSeconds: 10.5,
  }), /monotonic/u);

  let left = crossGate(original, course.gates[2], 12);
  let right = crossGate(restored, course.gates[2], 12);
  assert.deepEqual(right, left);
  left = crossGate(original, course.gates[3], 13);
  right = crossGate(restored, course.gates[3], 13);
  assert.deepEqual(right, left);

  const wrongCourse = structuredClone(saved);
  wrongCourse.courseId = 'other-course';
  assert.throws(() => restoreRoadRaceSession(course, wrongCourse), /different deterministic race course/u);

  const corrupt = structuredClone(saved);
  corrupt.state.lastSuppliedTimeSeconds = Number.NaN;
  assert.throws(() => restoreRoadRaceSession(course, corrupt), /finite/u);

  const corruptProgress = structuredClone(saved);
  corruptProgress.state.passedGateIds = [course.gates[0].id, course.gates[2].id];
  assert.throws(() => restoreRoadRaceSession(course, corruptProgress), /passed gates/u);
});

test('session caps and supplied-time/position finite validation reject invalid work', () => {
  const course = deriveRoadRaceCourse(createSquareLoopGraph(), { gateCount: 4 });
  assert.throws(() => createRoadRaceSession(course, { totalLaps: 100 }), /totalLaps/u);
  assert.throws(() => createRoadRaceSession(course, { maxCrossingsPerStep: 65 }), /maxCrossingsPerStep/u);
  const session = createRoadRaceSession(course);
  assert.throws(() => session.stepMotion({
    previousLocalPosition: [0, 0, 0],
    currentLocalPosition: [Number.NaN, 0, 0],
    fromTimeSeconds: 0,
    toTimeSeconds: 1,
  }), /finite/u);
  assert.throws(() => session.stepMotion({
    previousLocalPosition: [0, 0, 0],
    currentLocalPosition: [1, 0, 0],
    fromTimeSeconds: 2,
    toTimeSeconds: 1,
  }), /greater than or equal/u);
});
