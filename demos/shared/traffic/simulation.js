import {
  bearingRadians,
  interpolateHeadingRadians,
  interpolateWgs84,
  offsetWgs84Right
} from './geo.js';
import { compileRoadGraph, isTrafficEdgeAccessible } from './roadGraph.js';
import {
  deepFreeze,
  TRAFFIC_LIMITS,
  TRAFFIC_PROVENANCE,
  TRAFFIC_SNAPSHOT_SCHEMA
} from './schema.js';

const TRAFFIC_KINDS = Object.freeze([
  Object.freeze({
    id: 'commuter',
    colorCategory: 'traffic-cyan',
    dimensionsMeters: Object.freeze([4.3, 1.8, 1.45])
  }),
  Object.freeze({
    id: 'delivery',
    colorCategory: 'traffic-magenta',
    dimensionsMeters: Object.freeze([5.1, 2.05, 2.25])
  }),
  Object.freeze({
    id: 'service',
    colorCategory: 'traffic-amber',
    dimensionsMeters: Object.freeze([4.7, 1.95, 1.75])
  })
]);

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function finiteNumber(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be finite.`);
  return number;
}

function positiveNumber(value, fallback, name) {
  const selected = value ?? fallback;
  const number = finiteNumber(selected, name);
  if (number <= 0) throw new RangeError(`${name} must be greater than zero.`);
  return number;
}

function boundedInteger(value, fallback, maximum, name, minimum = 1) {
  const selected = value ?? fallback;
  if (!Number.isSafeInteger(selected) || selected < minimum || selected > maximum) {
    throw new RangeError(`${name} must be an integer between ${minimum} and ${maximum}.`);
  }
  return selected;
}

function normalizeSeed(seed) {
  if (typeof seed === 'number') {
    if (!Number.isFinite(seed)) throw new TypeError('seed must be a finite number or non-empty string.');
    return Math.trunc(seed) >>> 0;
  }
  if (typeof seed === 'string' && seed.length > 0) {
    let hash = 2_166_136_261;
    for (let index = 0; index < seed.length; index += 1) {
      hash ^= seed.charCodeAt(index);
      hash = Math.imul(hash, 16_777_619) >>> 0;
    }
    return hash;
  }
  if (seed === undefined) return 0x50454552;
  throw new TypeError('seed must be a finite number or non-empty string.');
}

function hashToken(seed, token) {
  let hash = (seed ^ 0x9e3779b9) >>> 0;
  const text = String(token);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x85ebca6b) >>> 0;
    hash ^= hash >>> 13;
  }
  hash = Math.imul(hash ^ (hash >>> 16), 0xc2b2ae35) >>> 0;
  return (hash ^ (hash >>> 16)) >>> 0;
}

function sampleUnit(seed, ...tokens) {
  let hash = seed;
  for (const token of tokens) hash = hashToken(hash, token);
  return hash / 0x1_0000_0000;
}

function roundFinite(value, digits = 9) {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function centerlineCoordinateOnEdge(compiled, edge, distanceMeters) {
  const from = compiled.nodeById.get(edge.from).coordinates;
  const to = compiled.nodeById.get(edge.to).coordinates;
  const progress = Math.min(1, Math.max(0, distanceMeters / edge.lengthMeters));
  return interpolateWgs84(from, to, progress);
}

function edgeHeading(compiled, edge) {
  return bearingRadians(
    compiled.nodeById.get(edge.from).coordinates,
    compiled.nodeById.get(edge.to).coordinates
  );
}

function laneCenterOffsetMeters(edge, laneIndexFromRight) {
  const { directionalLaneCount, laneWidthMeters, reciprocalDirection } = edge.laneModel;
  if (!Number.isSafeInteger(laneIndexFromRight)
    || laneIndexFromRight < 0
    || laneIndexFromRight >= directionalLaneCount) {
    throw new RangeError(`Edge ${edge.id} lane index is outside its derived directional lane count.`);
  }
  const offset = reciprocalDirection
    ? (directionalLaneCount - laneIndexFromRight - 0.5) * laneWidthMeters
    : ((directionalLaneCount - 1) / 2 - laneIndexFromRight) * laneWidthMeters;
  if (Math.abs(offset) > TRAFFIC_LIMITS.absoluteMaxLaneCenterOffsetMeters) {
    throw new RangeError(`Edge ${edge.id} derived lane center exceeds the geometry cap.`);
  }
  return offset;
}

function lanePoseOnEdge(compiled, edge, distanceMeters, laneIndexFromRight) {
  const centerlineCoordinates = centerlineCoordinateOnEdge(compiled, edge, distanceMeters);
  const headingRadians = edgeHeading(compiled, edge);
  const offsetMeters = laneCenterOffsetMeters(edge, laneIndexFromRight);
  return Object.freeze({
    centerlineCoordinates,
    coordinates: offsetWgs84Right(centerlineCoordinates, headingRadians, offsetMeters),
    headingRadians,
    offsetMeters
  });
}

function normalizeOptions(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Traffic simulation options must be an object.');
  }
  const maxVehicles = boundedInteger(
    options.maxVehicles,
    TRAFFIC_LIMITS.defaultMaxVehicles,
    TRAFFIC_LIMITS.absoluteMaxVehicles,
    'maxVehicles'
  );
  const spawnEdgeIds = options.spawnEdgeIds === undefined
    ? null
    : (() => {
      if (!Array.isArray(options.spawnEdgeIds) || options.spawnEdgeIds.length === 0) {
        throw new TypeError('spawnEdgeIds must be a non-empty array when provided.');
      }
      if (options.spawnEdgeIds.length > TRAFFIC_LIMITS.absoluteMaxVehicles) {
        throw new RangeError('spawnEdgeIds exceeds the absolute vehicle cap.');
      }
      return Object.freeze(options.spawnEdgeIds.map((id, index) => {
        if (typeof id !== 'string' || id.length === 0) {
          throw new TypeError(`spawnEdgeIds[${index}] must be a non-empty string.`);
        }
        return id;
      }));
    })();
  const requestedVehicleCount = boundedInteger(
    options.vehicleCount,
    spawnEdgeIds?.length ?? TRAFFIC_LIMITS.defaultVehicleCount,
    Number.MAX_SAFE_INTEGER,
    'vehicleCount',
    0
  );
  const fixedDtSeconds = positiveNumber(
    options.fixedDtSeconds,
    TRAFFIC_LIMITS.defaultFixedDtSeconds,
    'fixedDtSeconds'
  );
  const maxFrameDeltaSeconds = positiveNumber(
    options.maxFrameDeltaSeconds,
    TRAFFIC_LIMITS.defaultMaxFrameDeltaSeconds,
    'maxFrameDeltaSeconds'
  );
  const maxSubsteps = boundedInteger(
    options.maxSubsteps,
    TRAFFIC_LIMITS.defaultMaxSubsteps,
    TRAFFIC_LIMITS.absoluteMaxSubsteps,
    'maxSubsteps'
  );
  const maxTransitionsPerVehicleStep = boundedInteger(
    options.maxTransitionsPerVehicleStep,
    TRAFFIC_LIMITS.defaultMaxTransitionsPerVehicleStep,
    TRAFFIC_LIMITS.absoluteMaxTransitionsPerVehicleStep,
    'maxTransitionsPerVehicleStep'
  );
  const maxRestrictions = boundedInteger(
    options.maxRestrictions,
    TRAFFIC_LIMITS.absoluteMaxRestrictions,
    TRAFFIC_LIMITS.absoluteMaxRestrictions,
    'maxRestrictions'
  );
  return Object.freeze({
    seed: normalizeSeed(options.seed),
    requestedVehicleCount,
    maxVehicles,
    fixedDtSeconds,
    maxFrameDeltaSeconds,
    effectiveFrameDeltaCapSeconds: Math.min(maxFrameDeltaSeconds, fixedDtSeconds * maxSubsteps),
    maxSubsteps,
    maxTransitionsPerVehicleStep,
    maxGraphNodes: options.maxGraphNodes,
    maxGraphEdges: options.maxGraphEdges,
    maxRestrictions,
    spawnEdgeIds
  });
}

export class RoadTrafficSimulation {
  #compiled;
  #config;
  #vehicles = [];
  #disposed = false;
  #accumulatorSeconds = 0;
  #frameCount = 0;
  #sequence = 0;
  #cappedFrameCount = 0;
  #droppedFrameSeconds = 0;
  #routeTransitionCount = 0;
  #transitionOverflowCount = 0;
  #deadEndCount = 0;
  #restrictionAppliedDecisionCount = 0;
  #restrictionBlockedCandidateCount = 0;
  #restrictionDeadEndCount = 0;
  #prohibitedRestrictionDecisionCount = 0;
  #onlyRestrictionDecisionCount = 0;
  #lastFrameDeltaSeconds = 0;
  #lastAcceptedDeltaSeconds = 0;
  #lastDroppedDeltaSeconds = 0;
  #lastFrameSubsteps = 0;
  #graphSummary;

  constructor(roadGraph, options = {}) {
    this.#config = normalizeOptions(options);
    this.#compiled = compileRoadGraph(roadGraph, {
      maxGraphNodes: this.#config.maxGraphNodes,
      maxGraphEdges: this.#config.maxGraphEdges,
      maxRestrictions: this.#config.maxRestrictions
    });
    this.#graphSummary = this.#compiled.graphSummary;
    this.#validateSpawnEdges();
    this.#spawnVehicles();
  }

  get disposed() {
    return this.#disposed;
  }

  get interpolationAlpha() {
    if (this.#disposed || this.#config.fixedDtSeconds === 0) return 0;
    return Math.min(1, Math.max(0, this.#accumulatorSeconds / this.#config.fixedDtSeconds));
  }

  advance(frameDeltaSeconds) {
    this.#assertActive('advance');
    const delta = finiteNumber(frameDeltaSeconds, 'frameDeltaSeconds');
    if (delta < 0) throw new RangeError('frameDeltaSeconds must not be negative.');

    const accepted = Math.min(delta, this.#config.effectiveFrameDeltaCapSeconds);
    const dropped = delta - accepted;
    this.#frameCount += 1;
    this.#lastFrameDeltaSeconds = delta;
    this.#lastAcceptedDeltaSeconds = accepted;
    this.#lastDroppedDeltaSeconds = dropped;
    this.#lastFrameSubsteps = 0;
    if (dropped > 0) {
      this.#cappedFrameCount += 1;
      this.#droppedFrameSeconds += dropped;
    }

    this.#accumulatorSeconds += accepted;
    const epsilon = this.#config.fixedDtSeconds * 1e-9;
    while (this.#lastFrameSubsteps < this.#config.maxSubsteps
      && this.#accumulatorSeconds + epsilon >= this.#config.fixedDtSeconds) {
      this.#stepFixed();
      this.#accumulatorSeconds -= this.#config.fixedDtSeconds;
      if (this.#accumulatorSeconds < 0 && this.#accumulatorSeconds > -epsilon) {
        this.#accumulatorSeconds = 0;
      }
      this.#lastFrameSubsteps += 1;
    }
    return this.getInterpolatedSnapshot();
  }

  stepFrame(frameDeltaSeconds) {
    return this.advance(frameDeltaSeconds);
  }

  getSnapshot() {
    return this.#createSnapshot(1);
  }

  getInterpolatedSnapshot(alpha = this.interpolationAlpha) {
    const fraction = Math.min(1, Math.max(0, finiteNumber(alpha, 'alpha')));
    return this.#createSnapshot(fraction);
  }

  getTelemetry() {
    return this.#createTelemetry();
  }

  reset() {
    this.#assertActive('reset');
    this.#accumulatorSeconds = 0;
    this.#frameCount = 0;
    this.#sequence = 0;
    this.#cappedFrameCount = 0;
    this.#droppedFrameSeconds = 0;
    this.#routeTransitionCount = 0;
    this.#transitionOverflowCount = 0;
    this.#deadEndCount = 0;
    this.#restrictionAppliedDecisionCount = 0;
    this.#restrictionBlockedCandidateCount = 0;
    this.#restrictionDeadEndCount = 0;
    this.#prohibitedRestrictionDecisionCount = 0;
    this.#onlyRestrictionDecisionCount = 0;
    this.#lastFrameDeltaSeconds = 0;
    this.#lastAcceptedDeltaSeconds = 0;
    this.#lastDroppedDeltaSeconds = 0;
    this.#lastFrameSubsteps = 0;
    this.#spawnVehicles();
    return this.getSnapshot();
  }

  dispose() {
    if (this.#disposed) return false;
    this.#vehicles.length = 0;
    this.#compiled.nodeById.clear();
    this.#compiled.edgeById.clear();
    this.#compiled.outgoingByNode.clear();
    this.#compiled.restrictionByFromEdge.clear();
    this.#compiled = null;
    this.#disposed = true;
    this.#accumulatorSeconds = 0;
    return true;
  }

  #assertActive(operation) {
    if (this.#disposed) throw new Error(`Cannot ${operation} a disposed traffic simulation.`);
  }

  #validateSpawnEdges() {
    if (!this.#config.spawnEdgeIds) return;
    for (const edgeId of this.#config.spawnEdgeIds) {
      const edge = this.#compiled.edgeById.get(edgeId);
      if (!edge) throw new TypeError(`Unknown traffic spawn edge: ${edgeId}.`);
      if (!isTrafficEdgeAccessible(edge)) {
        throw new TypeError(`Traffic spawn edge is access-restricted: ${edgeId}.`);
      }
    }
  }

  #orderedSpawnEdges() {
    if (this.#config.spawnEdgeIds) {
      return this.#config.spawnEdgeIds.map((edgeId) => this.#compiled.edgeById.get(edgeId));
    }
    return [...this.#compiled.eligibleEdges].sort((left, right) => {
      const leftHash = hashToken(this.#config.seed, left.id);
      const rightHash = hashToken(this.#config.seed, right.id);
      return leftHash - rightHash || compareText(left.id, right.id);
    });
  }

  #selectLaneIndex(vehicleOrdinal, edge, routeDecisionCount) {
    const selection = sampleUnit(
      this.#config.seed,
      'lane-from-right',
      vehicleOrdinal,
      routeDecisionCount,
      edge.id
    );
    return Math.min(
      edge.laneModel.directionalLaneCount - 1,
      Math.floor(selection * edge.laneModel.directionalLaneCount)
    );
  }

  #spawnVehicles() {
    this.#vehicles.length = 0;
    const spawnEdges = this.#orderedSpawnEdges();
    if (spawnEdges.length === 0) return;
    const count = Math.min(this.#config.requestedVehicleCount, this.#config.maxVehicles);
    for (let index = 0; index < count; index += 1) {
      const edge = spawnEdges[index % spawnEdges.length];
      const laneSlot = Math.floor(index / spawnEdges.length);
      const progressSample = sampleUnit(this.#config.seed, 'spawn-progress', index, laneSlot);
      const progress = 0.12 + progressSample * 0.76;
      const speedScale = 0.56 + sampleUnit(this.#config.seed, 'speed-scale', index) * 0.28;
      const kind = TRAFFIC_KINDS[
        Math.floor(sampleUnit(this.#config.seed, 'vehicle-kind', index) * TRAFFIC_KINDS.length)
      ];
      const distanceMeters = edge.lengthMeters * progress;
      const laneIndexFromRight = this.#selectLaneIndex(index, edge, 0);
      const pose = lanePoseOnEdge(this.#compiled, edge, distanceMeters, laneIndexFromRight);
      this.#vehicles.push({
        id: `synthetic-traffic/${String(index).padStart(4, '0')}`,
        ordinal: index,
        kind,
        edgeId: edge.id,
        distanceMeters,
        speedScale,
        speedMetersPerSecond: edge.speedLimit.kph / 3.6 * speedScale,
        laneIndexFromRight,
        previousCenterlineCoordinates: pose.centerlineCoordinates,
        centerlineCoordinates: pose.centerlineCoordinates,
        previousCoordinates: pose.coordinates,
        coordinates: pose.coordinates,
        previousHeadingRadians: pose.headingRadians,
        headingRadians: pose.headingRadians,
        routeDecisionCount: 0,
        stoppedReason: null
      });
    }
  }

  #stepFixed() {
    for (const vehicle of this.#vehicles) this.#stepVehicle(vehicle);
    this.#sequence += 1;
  }

  #stepVehicle(vehicle) {
    vehicle.previousCenterlineCoordinates = vehicle.centerlineCoordinates;
    vehicle.previousCoordinates = vehicle.coordinates;
    vehicle.previousHeadingRadians = vehicle.headingRadians;
    if (vehicle.stoppedReason) return;

    let remainingMeters = vehicle.speedMetersPerSecond * this.#config.fixedDtSeconds;
    let transitions = 0;
    while (remainingMeters > 0) {
      const edge = this.#compiled.edgeById.get(vehicle.edgeId);
      const availableMeters = Math.max(0, edge.lengthMeters - vehicle.distanceMeters);
      if (remainingMeters <= availableMeters) {
        vehicle.distanceMeters += remainingMeters;
        remainingMeters = 0;
        break;
      }

      remainingMeters -= availableMeters;
      vehicle.distanceMeters = edge.lengthMeters;
      if (transitions >= this.#config.maxTransitionsPerVehicleStep) {
        this.#transitionOverflowCount += 1;
        remainingMeters = 0;
        break;
      }
      const nextEdge = this.#chooseNextEdge(vehicle, edge);
      vehicle.routeDecisionCount += 1;
      if (!nextEdge) {
        vehicle.speedMetersPerSecond = 0;
        vehicle.stoppedReason = 'directed-dead-end';
        this.#deadEndCount += 1;
        remainingMeters = 0;
        break;
      }
      vehicle.edgeId = nextEdge.id;
      vehicle.distanceMeters = 0;
      vehicle.laneIndexFromRight = this.#selectLaneIndex(
        vehicle.ordinal,
        nextEdge,
        vehicle.routeDecisionCount
      );
      vehicle.speedMetersPerSecond = nextEdge.speedLimit.kph / 3.6 * vehicle.speedScale;
      transitions += 1;
      this.#routeTransitionCount += 1;
    }

    const currentEdge = this.#compiled.edgeById.get(vehicle.edgeId);
    const pose = lanePoseOnEdge(
      this.#compiled,
      currentEdge,
      vehicle.distanceMeters,
      vehicle.laneIndexFromRight
    );
    vehicle.centerlineCoordinates = pose.centerlineCoordinates;
    vehicle.coordinates = pose.coordinates;
    vehicle.headingRadians = pose.headingRadians;
  }

  #chooseNextEdge(vehicle, currentEdge) {
    const outgoing = this.#compiled.outgoingByNode
      .get(currentEdge.to)
      .filter(isTrafficEdgeAccessible);
    if (outgoing.length === 0) return null;
    const restriction = this.#compiled.restrictionByFromEdge.get(currentEdge.id);
    let permitted = outgoing;
    if (restriction) {
      const hasOnlyTransitions = restriction.onlyToEdgeIds.size > 0;
      permitted = outgoing.filter((edge) => (
        (!hasOnlyTransitions || restriction.onlyToEdgeIds.has(edge.id))
          && !restriction.prohibitedToEdgeIds.has(edge.id)
      ));
      this.#restrictionAppliedDecisionCount += 1;
      this.#restrictionBlockedCandidateCount += outgoing.length - permitted.length;
      if (restriction.prohibitedToEdgeIds.size > 0) {
        this.#prohibitedRestrictionDecisionCount += 1;
      }
      if (hasOnlyTransitions) this.#onlyRestrictionDecisionCount += 1;
      if (permitted.length === 0) {
        this.#restrictionDeadEndCount += 1;
        return null;
      }
    }
    const withoutImmediateUTurn = permitted.filter((edge) => edge.to !== currentEdge.from);
    const candidates = withoutImmediateUTurn.length > 0 ? withoutImmediateUTurn : permitted;
    const selection = sampleUnit(
      this.#config.seed,
      'route',
      vehicle.ordinal,
      vehicle.routeDecisionCount,
      currentEdge.to
    );
    return candidates[Math.floor(selection * candidates.length)];
  }

  #createSnapshot(alpha) {
    const vehicles = this.#disposed ? [] : this.#vehicles.map((vehicle) => {
      const edge = this.#compiled.edgeById.get(vehicle.edgeId);
      const coordinates = interpolateWgs84(
        vehicle.previousCoordinates,
        vehicle.coordinates,
        alpha
      );
      const centerlineCoordinates = interpolateWgs84(
        vehicle.previousCenterlineCoordinates,
        vehicle.centerlineCoordinates,
        alpha
      );
      const laneOffsetMeters = laneCenterOffsetMeters(edge, vehicle.laneIndexFromRight);
      return deepFreeze({
        id: vehicle.id,
        synthetic: true,
        kind: vehicle.kind.id,
        colorCategory: vehicle.kind.colorCategory,
        dimensionsMeters: [...vehicle.kind.dimensionsMeters],
        edgeId: edge.id,
        osmWayId: edge.osmWayId,
        direction: edge.direction,
        fromNodeId: edge.from,
        toNodeId: edge.to,
        distanceMeters: roundFinite(vehicle.distanceMeters),
        edgeProgress: roundFinite(vehicle.distanceMeters / edge.lengthMeters),
        speedMetersPerSecond: roundFinite(vehicle.speedMetersPerSecond),
        speedLimitKph: roundFinite(edge.speedLimit.kph, 6),
        speedLimitProvenance: edge.speedLimit.provenance,
        reportedTotalLaneCount: edge.lanes,
        directionalLaneCount: edge.laneModel.directionalLaneCount,
        laneIndexFromRight: vehicle.laneIndexFromRight,
        laneCenterOffsetMeters: roundFinite(laneOffsetMeters, 6),
        laneGeometryProvenance: 'derived-right-hand-game-lane-center',
        centerlineCoordinates: [
          roundFinite(centerlineCoordinates[0]),
          roundFinite(centerlineCoordinates[1])
        ],
        coordinates: [roundFinite(coordinates[0]), roundFinite(coordinates[1])],
        wgs84: {
          longitudeDegrees: roundFinite(coordinates[0]),
          latitudeDegrees: roundFinite(coordinates[1]),
          heightMeters: 0
        },
        lane: {
          reportedTotalLaneCount: edge.laneModel.reportedTotalLaneCount,
          reportedTotalLaneCountProvenance: edge.laneModel.reportedTotalLaneCountProvenance,
          derivedTotalLaneCount: edge.laneModel.derivedTotalLaneCount,
          directionalLaneCount: edge.laneModel.directionalLaneCount,
          indexFromRight: vehicle.laneIndexFromRight,
          centerOffsetMeters: roundFinite(laneOffsetMeters, 6),
          laneWidthMeters: edge.laneModel.laneWidthMeters,
          reciprocalDirection: edge.laneModel.reciprocalDirection,
          placement: edge.laneModel.placement,
          sourceRoundedForGame: edge.laneModel.sourceRoundedForGame,
          sourceCappedForGame: edge.laneModel.sourceCappedForGame,
          minimumExpandedForGame: edge.laneModel.minimumExpandedForGame,
          derivation: [...edge.laneModel.derivation],
          derived: true,
          gameOnly: true,
          navigationGrade: false
        },
        headingRadians: roundFinite(interpolateHeadingRadians(
          vehicle.previousHeadingRadians,
          vehicle.headingRadians,
          alpha
        )),
        routeDecisionCount: vehicle.routeDecisionCount,
        stoppedReason: vehicle.stoppedReason
      });
    });
    return deepFreeze({
      schemaVersion: TRAFFIC_SNAPSHOT_SCHEMA,
      provenance: TRAFFIC_PROVENANCE,
      coordinateReferenceSystem: 'EPSG:4326',
      headingConvention: 'radians-clockwise-from-true-north',
      heightReference: 'sample-road-surface-in-consuming-world',
      seed: this.#config.seed,
      sequence: this.#sequence,
      simulationTimeSeconds: roundFinite(this.#sequence * this.#config.fixedDtSeconds),
      interpolationAlpha: roundFinite(alpha),
      status: this.#status(),
      vehicleCount: vehicles.length,
      vehicles,
      telemetry: this.#createTelemetry()
    });
  }

  #status() {
    if (this.#disposed) return 'disposed';
    if (this.#graphSummary.eligibleDirectedEdgeCount === 0) return 'no-eligible-edges';
    if (this.#vehicles.length === 0) return 'no-vehicles-requested';
    if (this.#vehicles.every((vehicle) => vehicle.stoppedReason)) return 'all-stopped';
    return 'running';
  }

  #createTelemetry() {
    return deepFreeze({
      schemaVersion: 'peercompute.synthetic-road-traffic.telemetry.v1',
      synthetic: true,
      liveTraffic: false,
      navigationGrade: false,
      frameCount: this.#frameCount,
      fixedStepCount: this.#sequence,
      lastFrameSubsteps: this.#lastFrameSubsteps,
      lastFrameDeltaSeconds: roundFinite(this.#lastFrameDeltaSeconds),
      lastAcceptedDeltaSeconds: roundFinite(this.#lastAcceptedDeltaSeconds),
      lastDroppedDeltaSeconds: roundFinite(this.#lastDroppedDeltaSeconds),
      cappedFrameCount: this.#cappedFrameCount,
      droppedFrameSeconds: roundFinite(this.#droppedFrameSeconds),
      routeTransitionCount: this.#routeTransitionCount,
      transitionOverflowCount: this.#transitionOverflowCount,
      deadEndCount: this.#deadEndCount,
      restrictionAppliedDecisionCount: this.#restrictionAppliedDecisionCount,
      restrictionBlockedCandidateCount: this.#restrictionBlockedCandidateCount,
      restrictionDeadEndCount: this.#restrictionDeadEndCount,
      prohibitedRestrictionDecisionCount: this.#prohibitedRestrictionDecisionCount,
      onlyRestrictionDecisionCount: this.#onlyRestrictionDecisionCount,
      requestedVehicleCount: this.#config.requestedVehicleCount,
      maxVehicles: this.#config.maxVehicles,
      spawnedVehicleCount: this.#disposed ? 0 : this.#vehicles.length,
      vehicleCapApplied: this.#config.requestedVehicleCount > this.#config.maxVehicles,
      fixedDtSeconds: roundFinite(this.#config.fixedDtSeconds),
      maxFrameDeltaSeconds: roundFinite(this.#config.maxFrameDeltaSeconds),
      effectiveFrameDeltaCapSeconds: roundFinite(this.#config.effectiveFrameDeltaCapSeconds),
      maxSubsteps: this.#config.maxSubsteps,
      maxTransitionsPerVehicleStep: this.#config.maxTransitionsPerVehicleStep,
      caps: {
        maxVehicles: this.#config.maxVehicles,
        maxGraphNodes: this.#graphSummary.caps.maxGraphNodes,
        maxGraphEdges: this.#graphSummary.caps.maxGraphEdges,
        maxRestrictions: this.#graphSummary.caps.maxRestrictions,
        maxDerivedTotalLanes: this.#graphSummary.caps.maxDerivedTotalLanes,
        maxLaneCenterOffsetMeters: this.#graphSummary.caps.maxLaneCenterOffsetMeters,
        unresolvedRestrictionDetailCap: this.#graphSummary.caps.unresolvedRestrictionDetailCap,
        maxSubsteps: this.#config.maxSubsteps,
        maxTransitionsPerVehicleStep: this.#config.maxTransitionsPerVehicleStep
      },
      graph: this.#graphSummary
    });
  }
}

export function createRoadTrafficSimulation(roadGraph, options = {}) {
  return new RoadTrafficSimulation(roadGraph, options);
}
