import {
  createMotorcycleController,
  createMotorcycleRig,
} from '../../../shared/physics/vehicle/index.js';
import { createParticleRigidWorld } from '../../../shared/physics/particle-rigid/index.js';
import { createRoadTrafficSimulation } from '../../../shared/traffic/index.js';
import {
  createRoadRaceSession,
  deriveRoadRaceCourse,
} from '../race/index.js';
import { createRoadTerrainSurface } from '../world/roadSurfaceCollider.js';
import {
  addTrafficPhysicsBodies,
  updateTrafficPhysicsBodies,
} from './trafficPhysics.js';

const MAXIMUM_QUEUED_SHIFT_EDGES = 8;

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

export function createMotorcycleGameRuntime({
  terrain,
  sceneData,
  trafficSeed = 'peercompute-motorcycle-traffic-v1',
  trafficVehicleCount = 14,
  maximumPhysicalTrafficVehicles = 14,
  rebaseThresholdMeters = null,
  boundaryMarginMeters = 8,
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
    maxSubSteps: 4,
    maxFrameDt: 1 / 30,
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
  const terrainSurface = createRoadTerrainSurface(terrain);
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
  const trafficPhysics = addTrafficPhysicsBodies(
    world,
    trafficSnapshot,
    terrain,
    { maximumVehicles: maximumPhysicalTrafficVehicles, originOffset },
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
  let boundaryState = Object.freeze({
    active: false,
    resetCount: 0,
    lastOriginalPosition: null,
    action: null,
  });

  const assertLive = () => {
    if (disposed) throw new Error('Motorcycle game runtime is disposed.');
  };
  const reset = ({ preserveBoundaryState = false } = {}) => {
    assertLive();
    trafficSnapshot = traffic.reset();
    controller.reset();
    race.reset();
    raceClockSeconds = 0;
    lastRaceOriginalPosition = [...raceCourse.start.positionLocal];
    updateTrafficPhysicsBodies(world, trafficSnapshot, terrain, trafficPhysics, { originOffset });
    pendingShiftEdges.splice(0);
    frameCount = 0;
    lastStep = null;
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
    }),
    boundary: boundaryState,
    pendingInputEdges: Object.freeze({
      shiftCount: pendingShiftEdges.length,
      shifts: Object.freeze([...pendingShiftEdges]),
      lastObservedControlSequence,
    }),
    syntheticTraffic: true,
    liveTraffic: false,
    terrainSource: terrain.source,
    osmProvenance: sceneData.provenance,
    operationalUse: false,
    physicsProfile: Object.freeze({
      authority: 'deterministic-cpu',
      fixedDt: world.fixedDt,
      solverIterations: world.options.solverIterations,
      maxSubSteps: world.options.maxSubSteps,
      maxFrameDt: world.options.maxFrameDt,
    }),
  });
  return Object.freeze({
    world,
    rig,
    controller,
    traffic,
    trafficPhysics,
    race,
    raceCourse,
    stepFrame(frameDeltaSeconds, controlFrame) {
      assertLive();
      generatedControlSequence += 1;
      const sequence = controlSequence(controlFrame, generatedControlSequence);
      const isNewControlFrame = sequence !== lastObservedControlSequence;
      let resetApplied = false;
      if (isNewControlFrame) {
        lastObservedControlSequence = sequence;
        if (controlFrame?.reset) {
          reset();
          // The reset is atomic across traffic, controller, and world even
          // when this render frame does not produce a fixed physics substep.
          lastObservedControlSequence = sequence;
          resetApplied = true;
        } else if (Number(controlFrame?.shiftDelta) !== 0) {
          if (pendingShiftEdges.length >= MAXIMUM_QUEUED_SHIFT_EDGES) {
            throw new RangeError(`Queued shift input exceeds ${MAXIMUM_QUEUED_SHIFT_EDGES} edges.`);
          }
          pendingShiftEdges.push(Math.sign(Number(controlFrame.shiftDelta)));
        }
      }
      trafficSnapshot = resetApplied
        ? trafficSnapshot
        : traffic.stepFrame(frameDeltaSeconds);
      updateTrafficPhysicsBodies(world, trafficSnapshot, terrain, trafficPhysics, { originOffset });
      const effectiveControl = {
        ...(controlFrame ?? {}),
        sequence,
        reset: false,
        shiftDelta: pendingShiftEdges[0] ?? 0,
      };
      const physics = world.stepFrame(frameDeltaSeconds, effectiveControl);
      if (physics.substeps > 0 && pendingShiftEdges.length > 0) pendingShiftEdges.shift();

      let originRebase = null;
      let boundaryReset = null;
      let raceStep = null;
      if (physics.substeps > 0) {
        const chassis = world.getBody(rig.bodyIds.chassis);
        const originalPosition = [
          chassis.position[0] + originOffset[0],
          chassis.position[1] + originOffset[1],
          chassis.position[2] + originOffset[2],
        ];
        const outside = originalPosition[0] < terrain.localBounds.minX + selectedBoundaryMargin
          || originalPosition[0] > terrain.localBounds.maxX - selectedBoundaryMargin
          || originalPosition[2] < terrain.localBounds.minZ + selectedBoundaryMargin
          || originalPosition[2] > terrain.localBounds.maxZ - selectedBoundaryMargin;
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
        } else {
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
        if (!outside && Math.hypot(chassis.position[0], chassis.position[2]) >= selectedRebaseThreshold) {
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
        boundaryReset,
        queuedShiftCount: pendingShiftEdges.length,
        race: raceStep ?? race.getSnapshot(),
      });
      return Object.freeze({ ...lastStep, trafficSnapshot });
    },
    reset,
    runTrafficImpactScenario,
    getState,
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.dispose();
      traffic.dispose();
      world.dispose();
    },
  });
}
