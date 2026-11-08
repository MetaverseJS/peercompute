import {
  createMotorcycleController,
  createMotorcycleRig,
} from '../../../shared/physics/vehicle/index.js';
import { createParticleRigidWorld } from '../../../shared/physics/particle-rigid/index.js';
import { createRoadTrafficSimulation } from '../../../shared/traffic/index.js';
import { createEnuFrameTransform, createLocalEnuFrame } from '@peercompute/geo-core';
import {
  createRoadRaceSession,
  deriveRoadRaceCourse,
} from '../race/index.js';
import { createTerrainDrapedRoadSurface } from '../world/roadSurface.js';
import { createRoadTerrainSurface } from '../world/roadSurfaceCollider.js';
import { rideTileAt } from '../world/rideTile.js';
import { createStreamingSurfaceCollider } from '../world/streamingSurfaceCollider.js';
import {
  addTrafficPhysicsBodies,
  setTrafficPhysicsActive,
  updateTrafficPhysicsBodies,
} from './trafficPhysics.js';

const MAXIMUM_QUEUED_SHIFT_EDGES = 8;
const STREAM_SURFACE_SNAPSHOT_SCHEMA = 'peercompute.motorcycle.globe-surface-snapshot.v1';
const STREAM_COVERAGE_LOOKAHEAD_ACCELERATION_METERS_PER_SECOND_SQUARED = 12;
const STREAM_COVERAGE_LOOKAHEAD_PADDING_METERS = 1;

function finitePositive(value, fallback, label) {
  const selected = value ?? fallback;
  if (!Number.isFinite(selected) || selected <= 0) {
    throw new RangeError(`${label} must be finite and positive.`);
  }
  return Number(selected);
}

function controlSequence(controlFrame, fallback) {
  return Number.isSafeInteger(controlFrame?.sequence) && controlFrame.sequence >= 0
    ? controlFrame.sequence
    : fallback;
}

function fallbackTransformFromInitialToCurrent(initialToCurrent) {
  return Object.freeze({
    currentToFallbackPoint: initialToCurrent.inverse.transformPoint,
    fallbackToCurrentPoint: initialToCurrent.transformPoint,
    fallbackToCurrentVector: initialToCurrent.transformVector,
  });
}

function insideTerrainBounds(position, terrain, margin = 0) {
  return position[0] >= terrain.localBounds.minX + margin
    && position[0] <= terrain.localBounds.maxX - margin
    && position[2] >= terrain.localBounds.minZ + margin
    && position[2] <= terrain.localBounds.maxZ - margin;
}

function sameActiveSurfaceResources(left, right) {
  if (!left || !right || left.activeKeys?.length !== right.activeKeys?.length) return false;
  if (!left.activeKeys.every((key, index) => key === right.activeKeys[index])) return false;
  if (left.resourceIdentities?.length !== right.resourceIdentities?.length) return false;
  return left.resourceIdentities.every((identity, index) => {
    const other = right.resourceIdentities[index];
    return identity.key === other?.key
      && identity.terrainResourceId === other.terrainResourceId
      && identity.roadResourceId === other.roadResourceId
      && identity.roadState === other.roadState;
  });
}

export function createMotorcycleGameRuntime({
  terrain,
  sceneData,
  trafficSeed = 'peercompute-motorcycle-traffic-v1',
  trafficVehicleCount = 14,
  maximumPhysicalTrafficVehicles = 14,
  rebaseThresholdMeters = null,
  boundaryMarginMeters = 8,
  surfaceStream = null,
  worldOptions = {},
  controllerOptions = {},
} = {}) {
  if (terrain?.schemaVersion !== 'peercompute.geo.local-terrain-grid.v1') {
    throw new TypeError('Motorcycle runtime requires a canonical terrain grid.');
  }
  if (sceneData?.schemaVersion !== 'peercompute.motorcycle.scene-data.v1') {
    throw new TypeError('Motorcycle runtime requires canonical scene data.');
  }
  const world = createParticleRigidWorld({
    // Keep the game on the same CPU-authoritative contract as the reusable
    // solver. Rendering interpolates independently on desktop, mobile, and XR.
    fixedDt: 1 / 120,
    solverIterations: 12,
    maxSubSteps: 8,
    maxFrameDt: 1 / 15,
    maxBodies: 64,
    maxParticles: 8_192,
    maxContacts: 16_384,
    throwOnOverflow: false,
    ...worldOptions,
  });
  const terrainWidth = terrain.localBounds.maxX - terrain.localBounds.minX;
  const terrainDepth = terrain.localBounds.maxZ - terrain.localBounds.minZ;
  const minimumTerrainSpan = Math.min(terrainWidth, terrainDepth);
  const selectedRebaseThreshold = finitePositive(
    rebaseThresholdMeters,
    Math.max(48, Math.min(256, minimumTerrainSpan / 4)),
    'rebaseThresholdMeters',
  );
  if (selectedRebaseThreshold >= minimumTerrainSpan / 2) {
    throw new RangeError('rebaseThresholdMeters must remain inside half the terrain span.');
  }
  const selectedBoundaryMargin = finitePositive(
    boundaryMarginMeters,
    8,
    'boundaryMarginMeters',
  );
  if (selectedBoundaryMargin * 2 >= minimumTerrainSpan) {
    throw new RangeError('boundaryMarginMeters must leave a usable terrain interior.');
  }
  const roadSurface = createTerrainDrapedRoadSurface(terrain, sceneData.roadSegments);
  const fallbackTerrainSurface = createRoadTerrainSurface(terrain, { roadSurface });
  if (surfaceStream !== null && (
    typeof surfaceStream?.update !== 'function'
    || typeof surfaceStream?.stage !== 'function'
    || typeof surfaceStream?.reserve !== 'function'
    || typeof surfaceStream?.commit !== 'function'
    || typeof surfaceStream?.release !== 'function'
    || typeof surfaceStream?.tick !== 'function'
    || typeof surfaceStream?.getSnapshot !== 'function'
    || typeof surfaceStream?.getStatus !== 'function'
  )) {
    throw new TypeError('surfaceStream must expose the canonical globe-surface stream API.');
  }
  const terrainSurface = surfaceStream
    ? createStreamingSurfaceCollider({
      getSnapshot: surfaceStream.getSnapshot,
      fallbackSurface: fallbackTerrainSurface,
    })
    : fallbackTerrainSurface;
  world.addSurfaceCollider(terrainSurface);

  const raceCourse = deriveRoadRaceCourse(sceneData.localGraph, {
    sourceStatus: sceneData.status,
    sourceProvenance: sceneData.provenance,
  });
  const race = createRoadRaceSession(raceCourse, { totalLaps: 3 });
  const raceYaw = raceCourse.start.headingRadiansLocal;
  const raceOrientation = [0, Math.sin(raceYaw / 2), 0, Math.cos(raceYaw / 2)];

  const traffic = createRoadTrafficSimulation(sceneData.localGraph.sourceRoadGraph, {
    seed: trafficSeed,
    vehicleCount: trafficVehicleCount,
    // The full deterministic traffic population remains visible. A bounded
    // subset receives particle collision cages to keep the CPU-authoritative
    // player solver responsive on mobile and standalone XR hardware.
    maxVehicles: Math.max(trafficVehicleCount, maximumPhysicalTrafficVehicles),
  });
  let trafficSnapshot = traffic.getSnapshot();
  const originOffset = [0, 0, 0];
  const initialFrame = terrain.frame;
  let currentFrame = initialFrame;
  let initialToCurrentTransform = createEnuFrameTransform(initialFrame, currentFrame);
  const trafficPhysics = addTrafficPhysicsBodies(
    world,
    trafficSnapshot,
    terrain,
    {
      maximumVehicles: maximumPhysicalTrafficVehicles,
      originOffset,
      referenceTransform: initialToCurrentTransform,
    },
  );

  const rig = createMotorcycleRig(world, {
    position: raceCourse.start.positionLocal,
    orientation: raceOrientation,
  });
  const controller = createMotorcycleController(world, rig, controllerOptions);
  let disposed = false;
  let frameCount = 0;
  let lastStep = null;
  let generatedControlSequence = 0;
  let lastObservedControlSequence = null;
  const pendingShiftEdges = [];
  let rebaseCount = 0;
  let lastRebase = null;
  let raceClockSeconds = 0;
  let lastRaceOriginalPosition = [...raceCourse.start.positionLocal];
  let streamWaitSeconds = 0;
  let wallTimeSeconds = 0;
  let simulatedTimeSeconds = 0;
  let droppedTimeSeconds = 0;
  let referenceFrameTransformCount = 0;
  let lastReferenceFrameTransform = null;
  let lastStreamCommit = null;
  let lastStreamTargetTileKey = null;
  let lastEvaluatedStreamContentEpoch = surfaceStream?.getStatus().contentEpoch ?? null;
  let streamActiveSnapshotNoopCount = 0;
  let lastCoveragePreflight = null;
  let referenceFrameParticipants = Object.freeze([]);
  let pendingResetReferenceFrameTransform = null;
  let trafficPhysicsCollisionActive = trafficPhysics.bindings.length > 0;
  let boundaryState = Object.freeze({
    active: false,
    resetCount: 0,
    lastOriginalPosition: null,
    action: null,
  });
  let regionActivityState = Object.freeze({
    seedRegionActive: true,
    raceStatus: 'active',
    trafficStatus: 'active',
    physicalTrafficActive: trafficPhysics.bindings.length > 0,
    reason: null,
  });

  const assertLive = () => {
    if (disposed) throw new Error('Motorcycle game runtime is disposed.');
  };
  const originalPositionFromCurrent = (position) => (
    initialToCurrentTransform.inverse.transformPoint(position)
  );
  const currentGlobePose = () => {
    const chassis = world.getBody(rig.bodyIds.chassis);
    const position = currentFrame.fromLocal(chassis.position);
    return Object.freeze({
      longitude: position.longitude,
      latitude: position.latitude,
      height: position.height,
      ecef: Object.freeze(currentFrame.localToEcef(chassis.position)),
      local: Object.freeze(Array.from(chassis.position)),
      frameOrigin: currentFrame.origin,
    });
  };
  const sampleSurface = (position) => {
    if ((!Array.isArray(position) && !ArrayBuffer.isView(position)) || position.length < 3) {
      throw new TypeError('Surface-sample position must contain three components.');
    }
    const currentPoint = Array.from(position).slice(0, 3).map(Number);
    if (!currentPoint.every(Number.isFinite)) {
      throw new TypeError('Surface-sample position must be finite.');
    }
    if (surfaceStream) return terrainSurface.samplePoint(currentPoint);
    const fallbackSample = terrainSurface.sampleSphere({ center: currentPoint, radius: 0 });
    if (fallbackSample?.unavailable || !Number.isFinite(fallbackSample?.signedDistance)) {
      return Object.freeze({
        available: false,
        height: null,
        normal: null,
        surfaceKind: null,
        tileKey: null,
        snapshotRevision: null,
      });
    }
    return Object.freeze({
      available: true,
      height: currentPoint[1] - fallbackSample.signedDistance,
      normal: fallbackSample.normal,
      surfaceKind: fallbackSample.metadata?.surfaceKind ?? 'terrain',
      tileKey: null,
      snapshotRevision: null,
      metadata: fallbackSample.metadata,
    });
  };
  const sampleSurfaceHeight = (position) => {
    const sample = sampleSurface(position);
    return sample.available ? sample.height : undefined;
  };
  const preflightStreamCoverage = (frameDeltaSeconds) => {
    if (!surfaceStream) {
      return Object.freeze({ available: true, probes: 0, unavailableProbe: null });
    }
    const maximumAdvancedSeconds = Math.min(
      frameDeltaSeconds,
      world.options.maxFrameDt,
      world.options.maxSubSteps * world.fixedDt,
    );
    const probes = [];
    for (const bodyId of [rig.bodyIds.rearWheel, rig.bodyIds.frontWheel]) {
      const body = world.getBody(bodyId);
      const horizontalSpeed = Math.hypot(body.linearVelocity[0], body.linearVelocity[2]);
      const padding = STREAM_COVERAGE_LOOKAHEAD_PADDING_METERS
        + 0.5 * STREAM_COVERAGE_LOOKAHEAD_ACCELERATION_METERS_PER_SECOND_SQUARED
          * maximumAdvancedSeconds ** 2;
      const directionX = horizontalSpeed > 1e-6 ? body.linearVelocity[0] / horizontalSpeed : 0;
      const directionZ = horizontalSpeed > 1e-6 ? body.linearVelocity[2] / horizontalSpeed : 0;
      probes.push(Array.from(body.position));
      probes.push([
        body.position[0] + body.linearVelocity[0] * maximumAdvancedSeconds + directionX * padding,
        body.position[1] + body.linearVelocity[1] * maximumAdvancedSeconds,
        body.position[2] + body.linearVelocity[2] * maximumAdvancedSeconds + directionZ * padding,
      ]);
    }
    for (let index = 0; index < probes.length; index += 1) {
      const sample = sampleSurface(probes[index]);
      if (!sample.available) {
        return Object.freeze({
          available: false,
          probes: index + 1,
          unavailableProbe: Object.freeze(probes[index]),
          maximumAdvancedSeconds,
          snapshotRevision: sample.snapshotRevision,
        });
      }
    }
    return Object.freeze({
      available: true,
      probes: probes.length,
      unavailableProbe: null,
      maximumAdvancedSeconds,
      snapshotRevision: surfaceStream.getSnapshot().revision,
    });
  };
  const prepareParticipantTransactions = (method, value) => {
    const prepared = [];
    try {
      for (const participant of referenceFrameParticipants) {
        if (typeof participant?.[method] !== 'function') continue;
        const transaction = participant[method](value);
        if (!transaction || typeof transaction.commit !== 'function') {
          throw new TypeError(`${method}() must return a prepared transaction.`);
        }
        if (transaction.commitModel !== 'validated-synchronous-noexcept') {
          throw new TypeError(`${method}() must guarantee a validated synchronous no-throw commit.`);
        }
        prepared.push(transaction);
      }
      return prepared;
    } catch (error) {
      for (const transaction of prepared) transaction.dispose?.();
      throw error;
    }
  };
  const recordReferenceFrameTransform = (transform) => {
    referenceFrameTransformCount += 1;
    lastReferenceFrameTransform = Object.freeze({
      sequence: referenceFrameTransformCount,
      schemaVersion: transform.schema,
      fromOrigin: transform.fromOrigin,
      toOrigin: transform.toOrigin,
      translation: transform.translation,
      rotationQuaternion: transform.rotationQuaternion,
    });
    return transform;
  };
  const updateStreamAtFixedBoundary = (frameDeltaSeconds = 0) => {
    if (!surfaceStream) {
      return Object.freeze({ waiting: false, referenceFrameTransform: null, committed: null });
    }
    const chassis = world.getBody(rig.bodyIds.chassis);
    const globe = currentGlobePose();
    let tile;
    try {
      tile = rideTileAt(globe);
    } catch (error) {
      const unsupported = surfaceStream.update(globe);
      lastStreamTargetTileKey = null;
      lastEvaluatedStreamContentEpoch = unsupported.contentEpoch;
      lastCoveragePreflight = Object.freeze({
        available: false,
        probes: 0,
        unavailableProbe: null,
        maximumAdvancedSeconds: 0,
        snapshotRevision: surfaceStream.getSnapshot().revision,
        reason: error?.code === 'ERR_RIDE_TILE_POLAR_UNSUPPORTED'
          ? 'polar-source-coverage-unavailable'
          : 'ride-tile-selection-failed',
      });
      boundaryState = Object.freeze({
        active: true,
        resetCount: boundaryState.resetCount,
        lastOriginalPosition: Object.freeze(Array.from(originalPositionFromCurrent(chassis.position))),
        action: error?.code === 'ERR_RIDE_TILE_POLAR_UNSUPPORTED'
          ? 'stream-unsupported-polar-coverage'
          : 'stream-wait',
      });
      return Object.freeze({ waiting: true, referenceFrameTransform: null, committed: null });
    }
    const streamStatus = tile.key === lastStreamTargetTileKey
      ? (surfaceStream.tick(), surfaceStream.getStatus())
      : surfaceStream.update(globe);
    lastStreamTargetTileKey = tile.key;
    const horizontalDistance = Math.hypot(chassis.position[0], chassis.position[2]);
    const needsReferenceFrame = horizontalDistance >= selectedRebaseThreshold;
    const nextFrame = needsReferenceFrame
      ? createLocalEnuFrame(currentFrame.fromLocal([
        chassis.position[0],
        0,
        chassis.position[2],
      ]))
      : currentFrame;
    let candidate = null;
    const targetNeedsCommit = streamStatus.committed.generation !== streamStatus.generation
      || lastEvaluatedStreamContentEpoch !== streamStatus.contentEpoch;
    if (targetNeedsCommit || needsReferenceFrame) {
      candidate = surfaceStream.stage({ currentFrame: nextFrame });
      if (!needsReferenceFrame
        && candidate.ready
        && candidate.generation === surfaceStream.getSnapshot().generation
        && sameActiveSurfaceResources(candidate.snapshot, surfaceStream.getSnapshot())) {
        candidate = null;
        streamActiveSnapshotNoopCount += 1;
        lastEvaluatedStreamContentEpoch = streamStatus.contentEpoch;
      }
    }
    let referenceFrameTransform = null;
    let committed = null;
    const reservation = candidate?.ready ? surfaceStream.reserve(candidate) : null;
    if (reservation?.accepted) {
      const transform = needsReferenceFrame
        ? createEnuFrameTransform(currentFrame, nextFrame)
        : null;
      let preparedFrames = [];
      let preparedSurfaces;
      try {
        preparedFrames = transform
          ? prepareParticipantTransactions('prepareReferenceFrameTransform', transform)
          : [];
        preparedSurfaces = prepareParticipantTransactions(
          'prepareSurfaceSnapshot',
          reservation.snapshot,
        );
      } catch (error) {
        for (const transaction of preparedFrames) transaction.dispose?.();
        surfaceStream.release(reservation);
        throw error;
      }
      if (needsReferenceFrame) {
        try {
          world.transformReferenceFrame(transform, { gravity: [0, -9.81, 0] });
        } catch (error) {
          for (const transaction of preparedFrames) transaction.dispose?.();
          for (const transaction of preparedSurfaces) transaction.dispose?.();
          surfaceStream.release(reservation);
          throw error;
        }
        committed = surfaceStream.commit(reservation);
        currentFrame = nextFrame;
        initialToCurrentTransform = createEnuFrameTransform(initialFrame, currentFrame);
        terrainSurface.setFallbackTransform(
          fallbackTransformFromInitialToCurrent(initialToCurrentTransform),
        );
        referenceFrameTransform = recordReferenceFrameTransform(transform);
      } else {
        committed = surfaceStream.commit(reservation);
      }
      for (const transaction of preparedFrames) transaction.commit();
      for (const transaction of preparedSurfaces) transaction.commit();
      terrainSurface.setStreamEnabled(true);
      lastEvaluatedStreamContentEpoch = committed.contentEpoch;
      lastStreamCommit = Object.freeze({
        revision: committed.revision,
        generation: committed.generation,
        contentEpoch: committed.contentEpoch,
        centerTile: committed.centerTile,
        roads: committed.roads,
        referenceFrameSequence: referenceFrameTransformCount,
      });
    }
    const updatedGlobe = currentGlobePose();
    const currentTile = rideTileAt(updatedGlobe);
    const snapshot = surfaceStream.getSnapshot();
    const streamCovered = snapshot.schemaVersion === STREAM_SURFACE_SNAPSHOT_SCHEMA
      && snapshot.activeKeys.includes(currentTile.key);
    if (streamCovered && terrainSurface.getTelemetry().streamEnabled !== true) {
      terrainSurface.setStreamEnabled(true);
      for (const participant of referenceFrameParticipants) {
        participant.setStreamedTerrainVisible?.(true);
      }
    }
    const fallbackPosition = originalPositionFromCurrent(
      world.getBody(rig.bodyIds.chassis).position,
    );
    const fallbackCovered = insideTerrainBounds(fallbackPosition, terrain, selectedBoundaryMargin);
    lastCoveragePreflight = preflightStreamCoverage(frameDeltaSeconds);
    const waiting = (!streamCovered && !fallbackCovered) || !lastCoveragePreflight.available;
    boundaryState = Object.freeze({
      active: waiting,
      resetCount: boundaryState.resetCount,
      lastOriginalPosition: waiting ? Object.freeze(Array.from(fallbackPosition)) : null,
      action: waiting ? 'stream-wait' : null,
    });
    return Object.freeze({ waiting, referenceFrameTransform, committed });
  };
  const restoreInitialReferenceFrameForReset = () => {
    if (!surfaceStream) return null;
    const transform = currentFrame === initialFrame
      ? null
      : createEnuFrameTransform(currentFrame, initialFrame);
    const preparedFrames = transform
      ? prepareParticipantTransactions('prepareReferenceFrameTransform', transform)
      : [];
    if (transform) {
      try {
        world.transformReferenceFrame(transform, { gravity: [0, -9.81, 0] });
      } catch (error) {
        for (const transaction of preparedFrames) transaction.dispose?.();
        throw error;
      }
      currentFrame = initialFrame;
      initialToCurrentTransform = createEnuFrameTransform(initialFrame, initialFrame);
      terrainSurface.setFallbackTransform(
        fallbackTransformFromInitialToCurrent(initialToCurrentTransform),
      );
      for (const transaction of preparedFrames) transaction.commit();
    }
    terrainSurface.setStreamEnabled(false);
    for (const participant of referenceFrameParticipants) {
      participant.setStreamedTerrainVisible?.(false);
    }
    surfaceStream.update(initialFrame.origin);
    lastStreamTargetTileKey = rideTileAt(initialFrame.origin).key;
    lastEvaluatedStreamContentEpoch = surfaceStream.getStatus().contentEpoch;
    return transform ? recordReferenceFrameTransform(transform) : null;
  };
  const reset = ({ preserveBoundaryState = false } = {}) => {
    assertLive();
    pendingResetReferenceFrameTransform = restoreInitialReferenceFrameForReset();
    trafficSnapshot = traffic.reset();
    controller.reset();
    race.reset();
    raceClockSeconds = 0;
    lastRaceOriginalPosition = [...raceCourse.start.positionLocal];
    updateTrafficPhysicsBodies(world, trafficSnapshot, terrain, trafficPhysics, {
      originOffset,
      referenceTransform: initialToCurrentTransform,
    });
    setTrafficPhysicsActive(world, trafficPhysics, true);
    trafficPhysicsCollisionActive = trafficPhysics.bindings.length > 0;
    pendingShiftEdges.splice(0);
    frameCount = 0;
    lastStep = null;
    regionActivityState = Object.freeze({
      seedRegionActive: true,
      raceStatus: 'active',
      trafficStatus: 'active',
      physicalTrafficActive: trafficPhysics.bindings.length > 0,
      reason: null,
    });
    if (!preserveBoundaryState) {
      boundaryState = Object.freeze({
        active: false,
        resetCount: boundaryState.resetCount,
        lastOriginalPosition: null,
        action: null,
      });
    }
    return getState();
  };
  const runTrafficImpactScenario = () => {
    assertLive();
    if (trafficPhysics.bindings.length < 1) {
      throw new Error('Traffic impact scenario requires at least one physical traffic cage.');
    }
    reset();
    const binding = trafficPhysics.bindings[0];
    const trafficBody = world.getBody(binding.bodyId);
    const chassis = world.getBody(rig.bodyIds.chassis);
    const start = [chassis.position[0] - 5, chassis.position[1], chassis.position[2]];
    const orientation = [0, 0, 0, 1];
    for (const field of ['position', 'previousPosition', 'predictedPosition']) {
      trafficBody[field].set(start);
    }
    for (const field of ['orientation', 'previousOrientation', 'predictedOrientation']) {
      trafficBody[field].set(orientation);
    }
    trafficBody.linearVelocity.fill(0);
    trafficBody.angularVelocity.fill(0);
    world.setKinematicTarget(binding.bodyId, { position: start, orientation });

    let collisionStep = null;
    let maximumImpulse = 0;
    let maximumPenetration = 0;
    try {
      for (let step = 0; step < 48; step += 1) {
        const target = [start[0] + (step + 1) * 0.12, start[1], start[2]];
        world.setKinematicTarget(binding.bodyId, { position: target, orientation });
        generatedControlSequence += 1;
        world.stepFrame(world.fixedDt, {
          sequence: generatedControlSequence,
          steer: 0,
          throttle: 0,
          frontBrake: 0,
          rearBrake: 0,
          clutch: 0,
          shiftDelta: 0,
          handbrake: false,
          reset: false,
        });
        const contacts = world.getContacts().filter((contact) => (
          contact.type === 'particle'
          && (contact.bodyA === binding.bodyId || contact.bodyB === binding.bodyId)
          && rig.bodyIdList.includes(contact.bodyA === binding.bodyId ? contact.bodyB : contact.bodyA)
        ));
        maximumImpulse = Math.max(maximumImpulse, ...contacts.map((contact) => contact.normalImpulse));
        maximumPenetration = Math.max(maximumPenetration, ...contacts.map((contact) => contact.penetration));
        if (maximumImpulse > 0) {
          collisionStep = step;
          break;
        }
      }
      return Object.freeze({
        schemaVersion: 'peercompute.motorcycle.traffic-impact-scenario.v1',
        collisionStep,
        maximumImpulse,
        maximumPenetration,
        chassisLinearVelocity: Object.freeze(Array.from(chassis.linearVelocity)),
        chassisAngularVelocity: Object.freeze(Array.from(chassis.angularVelocity)),
        finite: [...chassis.linearVelocity, ...chassis.angularVelocity].every(Number.isFinite),
        overflowed: world.getTelemetry().overflows.overflowed,
        source: Object.freeze({
          syntheticTraffic: true,
          liveTraffic: false,
          bodyId: binding.bodyId,
        }),
      });
    } finally {
      reset();
    }
  };
  const getState = () => ({
    schemaVersion: 'peercompute.motorcycle.game-runtime-state.v1',
    disposed,
    frameCount,
    motorcycle: controller.getTelemetry(),
    physics: world.getTelemetry(),
    traffic: traffic.getTelemetry(),
    trafficSnapshot,
    trafficPhysics,
    race: race.getSnapshot(),
    raceCourse,
    lastStep,
    origin: Object.freeze({
      schemaVersion: 'peercompute.motorcycle.local-origin-state.v1',
      offset: Object.freeze([...originOffset]),
      rebaseThresholdMeters: selectedRebaseThreshold,
      rebaseCount,
      lastRebase,
      mode: surfaceStream ? 'wgs84-ecef-enu-stream' : 'bounded-local-translation',
      currentFrameOrigin: currentFrame.origin,
      referenceFrameTransformCount,
      lastReferenceFrameTransform,
    }),
    boundary: boundaryState,
    regionActivity: regionActivityState,
    globe: surfaceStream ? Object.freeze({
      authority: 'wgs84-ecef-cesium-overview',
      rideRenderer: 'three-webxr-local-tangent-frame',
      pose: currentGlobePose(),
      stream: surfaceStream.getStatus(),
      collision: terrainSurface.getTelemetry(),
      lastCommit: lastStreamCommit,
      streamWaitSeconds,
      activeSnapshotNoopCount: streamActiveSnapshotNoopCount,
      evaluatedContentEpoch: lastEvaluatedStreamContentEpoch,
      polarCoverage: surfaceStream.getStatus().coverage,
      coveragePreflight: lastCoveragePreflight,
    }) : null,
    pendingInputEdges: Object.freeze({
      shiftCount: pendingShiftEdges.length,
      shifts: Object.freeze([...pendingShiftEdges]),
      lastObservedControlSequence,
    }),
    syntheticTraffic: true,
    liveTraffic: false,
    terrainSource: terrain.source,
    roadSurface: Object.freeze({
      geometry: roadSurface.getTelemetry(),
      collider: terrainSurface.getTelemetry(),
      fallbackCollider: surfaceStream ? fallbackTerrainSurface.getTelemetry() : null,
    }),
    osmProvenance: sceneData.provenance,
    operationalUse: false,
    physicsProfile: Object.freeze({
      authority: 'deterministic-cpu',
      fixedDt: world.fixedDt,
      solverIterations: world.options.solverIterations,
      maxSubSteps: world.options.maxSubSteps,
      maxFrameDt: world.options.maxFrameDt,
      timing: Object.freeze({
        wallTimeSeconds,
        simulatedTimeSeconds,
        droppedTimeSeconds,
        streamWaitSeconds,
        wallMinusSimulatedSeconds: Math.max(0, wallTimeSeconds - simulatedTimeSeconds),
      }),
    }),
  });
  return Object.freeze({
    world,
    rig,
    controller,
    roadSurface,
    terrainSurface,
    fallbackTerrainSurface,
    surfaceStream,
    sampleSurfaceHeight,
    sampleSurface,
    setReferenceFrameParticipants(participants = []) {
      assertLive();
      if (!Array.isArray(participants)) {
        throw new TypeError('Reference-frame participants must be an array.');
      }
      for (const participant of participants) {
        if (!participant || typeof participant.prepareReferenceFrameTransform !== 'function') {
          throw new TypeError('Every reference-frame participant must expose prepareReferenceFrameTransform().');
        }
      }
      referenceFrameParticipants = Object.freeze([...participants]);
      return referenceFrameParticipants.length;
    },
    traffic,
    trafficPhysics,
    race,
    raceCourse,
    stepFrame(frameDeltaSeconds, controlFrame) {
      assertLive();
      if (!Number.isFinite(frameDeltaSeconds) || frameDeltaSeconds < 0) {
        throw new RangeError('frameDeltaSeconds must be finite and non-negative.');
      }
      wallTimeSeconds += frameDeltaSeconds;
      generatedControlSequence += 1;
      const sequence = controlSequence(controlFrame, generatedControlSequence);
      const isNewControlFrame = sequence !== lastObservedControlSequence;
      let resetApplied = false;
      let resetReferenceFrameTransform = null;
      if (isNewControlFrame) {
        lastObservedControlSequence = sequence;
        if (controlFrame?.reset) {
          reset();
          // The reset is atomic across traffic, controller, and world even
          // when this render frame does not produce a fixed physics substep.
          lastObservedControlSequence = sequence;
          resetApplied = true;
          resetReferenceFrameTransform = pendingResetReferenceFrameTransform;
          pendingResetReferenceFrameTransform = null;
        } else if (Number(controlFrame?.shiftDelta) !== 0) {
          if (pendingShiftEdges.length >= MAXIMUM_QUEUED_SHIFT_EDGES) {
            throw new RangeError(`Queued shift input exceeds ${MAXIMUM_QUEUED_SHIFT_EDGES} edges.`);
          }
          pendingShiftEdges.push(Math.sign(Number(controlFrame.shiftDelta)));
        }
      }
      const streamBoundary = resetApplied
        ? Object.freeze({
          waiting: false,
          referenceFrameTransform: resetReferenceFrameTransform,
          committed: null,
        })
        : updateStreamAtFixedBoundary(frameDeltaSeconds);
      const effectiveFrameDelta = streamBoundary.waiting ? 0 : frameDeltaSeconds;
      if (streamBoundary.waiting) streamWaitSeconds += frameDeltaSeconds;
      const seedOriginalPosition = originalPositionFromCurrent(
        world.getBody(rig.bodyIds.chassis).position,
      );
      const seedRegionActive = insideTerrainBounds(seedOriginalPosition, terrain, 0);
      regionActivityState = Object.freeze({
        seedRegionActive,
        raceStatus: seedRegionActive ? 'active' : 'out-of-region',
        trafficStatus: seedRegionActive ? 'active' : 'out-of-region',
        physicalTrafficActive: seedRegionActive && trafficPhysics.bindings.length > 0,
        reason: seedRegionActive ? null : 'seed-road-overlay-out-of-region',
      });
      const shouldEnableTrafficPhysics = seedRegionActive && trafficPhysics.bindings.length > 0;
      if (shouldEnableTrafficPhysics !== trafficPhysicsCollisionActive) {
        setTrafficPhysicsActive(world, trafficPhysics, shouldEnableTrafficPhysics);
        trafficPhysicsCollisionActive = shouldEnableTrafficPhysics;
      }
      trafficSnapshot = resetApplied || streamBoundary.waiting || !seedRegionActive
        ? trafficSnapshot
        : traffic.stepFrame(effectiveFrameDelta);
      if (seedRegionActive) {
        updateTrafficPhysicsBodies(world, trafficSnapshot, terrain, trafficPhysics, {
          originOffset,
          referenceTransform: initialToCurrentTransform,
        });
      }
      const effectiveControl = {
        ...(controlFrame ?? {}),
        sequence,
        reset: false,
        shiftDelta: pendingShiftEdges[0] ?? 0,
      };
      const physics = world.stepFrame(effectiveFrameDelta, effectiveControl);
      simulatedTimeSeconds += physics.substeps * world.fixedDt;
      droppedTimeSeconds += physics.droppedTime;
      if (physics.substeps > 0 && pendingShiftEdges.length > 0) pendingShiftEdges.shift();

      let originRebase = null;
      let boundaryReset = null;
      let raceStep = null;
      if (physics.substeps > 0) {
        const chassis = world.getBody(rig.bodyIds.chassis);
        const originalPosition = Array.from(originalPositionFromCurrent(chassis.position));
        const postStepSeedRegionActive = insideTerrainBounds(originalPosition, terrain, 0);
        if (postStepSeedRegionActive !== regionActivityState.seedRegionActive) {
          regionActivityState = Object.freeze({
            seedRegionActive: postStepSeedRegionActive,
            raceStatus: postStepSeedRegionActive ? 'active' : 'out-of-region',
            trafficStatus: postStepSeedRegionActive ? 'active' : 'out-of-region',
            physicalTrafficActive: postStepSeedRegionActive && trafficPhysics.bindings.length > 0,
            reason: postStepSeedRegionActive ? null : 'seed-road-overlay-out-of-region',
          });
          const enablePostStepTraffic = postStepSeedRegionActive
            && trafficPhysics.bindings.length > 0;
          if (enablePostStepTraffic !== trafficPhysicsCollisionActive) {
            setTrafficPhysicsActive(world, trafficPhysics, enablePostStepTraffic);
            trafficPhysicsCollisionActive = enablePostStepTraffic;
          }
        }
        const outside = !surfaceStream && !insideTerrainBounds(
          originalPosition,
          terrain,
          selectedBoundaryMargin,
        );
        if (outside) {
          boundaryState = Object.freeze({
            active: true,
            resetCount: boundaryState.resetCount + 1,
            lastOriginalPosition: Object.freeze(originalPosition),
            action: 'reset-to-real-road-spawn',
          });
          boundaryReset = boundaryState;
          reset({ preserveBoundaryState: true });
          lastObservedControlSequence = sequence;
        } else if (postStepSeedRegionActive) {
          const fromTimeSeconds = raceClockSeconds;
          raceClockSeconds += physics.substeps * world.fixedDt;
          raceStep = race.stepMotion({
            previousLocalPosition: lastRaceOriginalPosition,
            currentLocalPosition: originalPosition,
            fromTimeSeconds,
            toTimeSeconds: raceClockSeconds,
          });
          lastRaceOriginalPosition = [...originalPosition];
        }
        if (!surfaceStream && !outside
          && Math.hypot(chassis.position[0], chassis.position[2]) >= selectedRebaseThreshold) {
          const shift = [chassis.position[0], 0, chassis.position[2]];
          world.shiftOrigin(shift);
          terrainSurface.shiftOrigin(shift);
          for (let index = 0; index < 3; index += 1) originOffset[index] += shift[index];
          rebaseCount += 1;
          lastRebase = Object.freeze({
            sequence: rebaseCount,
            simulationTime: world.simulationTime,
            shift: Object.freeze([...shift]),
            offset: Object.freeze([...originOffset]),
          });
          originRebase = lastRebase;
        } else if (!outside && boundaryState.active) {
          boundaryState = Object.freeze({
            ...boundaryState,
            active: false,
            action: null,
          });
        }
      }
      frameCount += 1;
      lastStep = Object.freeze({
        frameDeltaSeconds,
        physicsSubsteps: physics.substeps,
        physicsAlpha: physics.alpha,
        droppedTime: physics.droppedTime,
        resetApplied,
        trafficSequence: trafficSnapshot.sequence,
        originRebase,
        referenceFrameTransform: streamBoundary.referenceFrameTransform,
        streamWait: streamBoundary.waiting,
        streamCommit: streamBoundary.committed ? Object.freeze({
          revision: streamBoundary.committed.revision,
          generation: streamBoundary.committed.generation,
          contentEpoch: streamBoundary.committed.contentEpoch,
          activeKeys: streamBoundary.committed.activeKeys,
          roads: streamBoundary.committed.roads,
        }) : null,
        boundaryReset,
        queuedShiftCount: pendingShiftEdges.length,
        race: raceStep ?? race.getSnapshot(),
      });
      return Object.freeze({ ...lastStep, trafficSnapshot });
    },
    reset,
    setAutomaticTransmission(enabled) {
      assertLive();
      pendingShiftEdges.splice(0);
      controller.setAutomaticTransmission(enabled);
      return controller.getTelemetry();
    },
    runTrafficImpactScenario,
    getState,
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.dispose();
      traffic.dispose();
      world.dispose();
      surfaceStream?.dispose?.();
    },
  });
}
