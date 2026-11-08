import {
  bodyPointVelocity,
  bodyWorldVector,
} from '../particle-rigid/bodyMath.js';
import {
  quat,
  quatConjugate,
  quatMultiply,
  vec3,
  vecCross,
  vecDot,
  vecLength,
  vecNormalize,
  vecProjectOnPlane,
  vecScale,
  vecSub,
} from '../particle-rigid/math.js';
import { createNeutralControlFrame, normalizeControlFrame } from './controlFrame.js';

const DEFAULT_CONFIG = Object.freeze({
  gearRatios: Object.freeze([0, 2.55, 1.86, 1.47, 1.23, 1.08, 0.96]),
  finalDrive: 2.75,
  primaryDrive: 1.72,
  idleRpm: 1_200,
  redlineRpm: 11_500,
  // Keyboard throttle ramps into a responsive middleweight curve. The hard
  // cap and contact-derived slip/front-load scales below keep that torque in
  // the physical tire/load envelope instead of suppressing wheelies by pose.
  peakTorque: 72,
  engineBraking: 4,
  drivetrainEfficiency: 0.91,
  maximumDriveTorque: 600,
  throttleResponseExponent: 1.6,
  minimumDriveTorqueScale: 0.28,
  // Contact impulses arrive as discrete particle-ring samples. Filter the
  // physical observations (never the body pose/velocity) before they feed
  // traction and wheelie control so ring phase cannot pulse engine torque.
  tireLoadFilterTimeSeconds: 0.12,
  tireSlipFilterTimeSeconds: 0.08,
  tireContactGraceSeconds: 0.1,
  driveTorqueRiseRateNmPerSecond: 3_000,
  driveTorqueFallRateNmPerSecond: 6_000,
  tractionSlipStart: 0.18,
  tractionSlipEnd: 0.32,
  tractionControlMinimumSpeed: 0.1,
  tractionControlFullSpeed: 0.75,
  offroadNormalDeviationStart: 0.015,
  offroadNormalDeviationEnd: 0.05,
  frontLoadCutStart: 0.25,
  frontLoadCutEnd: 0.28,
  firstGearFrontLoadCutStart: 0.32,
  firstGearFrontLoadCutEnd: 0.35,
  firstGearFrontLoadFadeBeginSpeed: 2,
  firstGearFrontLoadFadeFullSpeed: 2.5,
  // Combined full-brake force is close to one vehicle weight at the tire
  // radius. This preserves grip-dependent stopping without an unavoidable
  // first-frame stoppie in the reusable default setup.
  rearBrakeTorque: 320,
  frontBrakeTorque: 580,
  steeringAngle: 0.42,
  steeringImpulse: 14,
  lateralAccelerationCap: 4.5,
  lateralAccelerationMinimumSpeed: 1.5,
  lateralAccelerationFullSpeed: 5,
  steerRiseRate: 2.5,
  steerReturnRate: 4,
  throttleRiseRate: 1.5,
  throttleFallRate: 3,
  brakeRiseRate: 10,
  brakeFallRate: 12,
  maxLean: 0.7,
  leanStiffness: 7_500,
  corneringLeanStiffness: 4_500,
  leanDamping: 2_500,
  maxLeanTorque: 12_000,
  aerodynamicDrag: 0.56,
  corneringDrag: 0.2,
  parkingHoldSpeed: 0.6,
  parkingSpring: 16_000,
  parkingDamping: 7_500,
  parkingMaximumForce: 4_000,
  parkingLeanStiffness: 10_000,
  parkingLeanDamping: 1_000,
  parkingMaximumLeanTorque: 2_000,
  automaticTransmission: true,
  automaticUpshiftRpm: 4_700,
  automaticDownshiftRpm: 2_600,
  automaticKickdownRpm: 3_200,
  automaticKickdownThrottle: 0.65,
  automaticDownshiftRedlineFraction: 0.92,
  automaticShiftMinimumContactSeconds: 0.08,
  automaticShiftMaximumSlip: 0.35,
  automaticShiftCooldownSeconds: 0.32,
  tirePeakFriction: 1.22,
  tireSlideFriction: 1.05,
  tireLateralPeakFriction: 0.4,
  tireLateralSlideFriction: 0.32,
  tireSlipFalloff: 0.36,
  lateralSlipFalloff: 0.52,
});

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothstep(minimum, maximum, value) {
  if (maximum <= minimum) return value >= maximum ? 1 : 0;
  const x = clamp((value - minimum) / (maximum - minimum), 0, 1);
  return x * x * (3 - 2 * x);
}

function moveTowards(current, target, maximumDelta) {
  if (Math.abs(target - current) <= maximumDelta) return Math.fround(target);
  return Math.fround(current + Math.sign(target - current) * maximumDelta);
}

function filterPedal(current, target, riseRate, fallRate, dt) {
  const rate = target > current ? riseRate : fallRate;
  return moveTowards(current, target, rate * dt);
}

function filterSteering(current, target, riseRate, returnRate, dt) {
  if (current !== 0 && target !== 0 && Math.sign(current) !== Math.sign(target)) {
    const timeToCenter = Math.abs(current) / returnRate;
    if (dt <= timeToCenter) return moveTowards(current, 0, returnRate * dt);
    return moveTowards(0, target, riseRate * (dt - timeToCenter));
  }
  const movingAwayFromCenter = Math.abs(target) > Math.abs(current);
  return moveTowards(current, target, (movingAwayFromCenter ? riseRate : returnRate) * dt);
}

function createActuatorState() {
  return {
    steer: 0,
    throttle: 0,
    frontBrake: 0,
    rearBrake: 0,
    handbrake: 0,
  };
}

function createFilteredTireState() {
  return {
    normalLoad: 0,
    longitudinalSlip: 0,
    lateralSlip: 0,
    sampledLongitudinalSlip: 0,
    sampledLateralSlip: 0,
    surfaceNormalAlignment: 1,
    contactPersistenceSeconds: 0,
    contactAgeSeconds: 1_000_000,
  };
}

function filterTimeConstant(current, target, timeSeconds, dt) {
  if (!(timeSeconds > 0)) return Math.fround(target);
  const alpha = 1 - Math.exp(-dt / timeSeconds);
  return Math.fround(current + (target - current) * alpha);
}

function torqueCurve(rpm, redline) {
  const x = clamp(rpm / redline, 0, 1.2);
  const midrange = 1 - Math.pow((x - 0.62) / 0.72, 2);
  const cutoff = x <= 1 ? 1 : Math.max(0, 1 - (x - 1) * 5);
  return clamp(0.42 + 0.58 * midrange, 0.18, 1) * cutoff;
}

function wheelKinematics(body, contact, wheelRadius) {
  const axle = vecNormalize(bodyWorldVector(body, [1, 0, 0]), [1, 0, 0]);
  const forwardRaw = vecProjectOnPlane(bodyWorldVector(body, [0, 0, 1]), contact.normal);
  const forward = vecNormalize(forwardRaw, [0, 0, 1]);
  const lateral = vecNormalize(vecCross(contact.normal, forward), [1, 0, 0]);
  const pointVelocity = bodyPointVelocity(body, contact.pointA);
  const relative = vecSub(pointVelocity, contact.surfaceVelocity ?? [0, 0, 0]);
  const centerForwardSpeed = vecDot(body.linearVelocity, forward);
  const longitudinalSpeed = vecDot(relative, forward);
  const lateralSpeed = vecDot(relative, lateral);
  const denominator = Math.max(2, Math.abs(centerForwardSpeed), Math.abs(vecDot(body.angularVelocity, axle) * wheelRadius));
  return {
    axle,
    forward,
    lateral,
    centerForwardSpeed,
    longitudinalSpeed,
    lateralSpeed,
    longitudinalSlip: longitudinalSpeed / denominator,
    lateralSlip: lateralSpeed / denominator,
  };
}

function emptyTireTelemetry() {
  return {
    contactCount: 0,
    normalLoad: 0,
    normalImpulse: 0,
    longitudinalImpulse: 0,
    lateralImpulse: 0,
    longitudinalSlip: 0,
    lateralSlip: 0,
    filteredNormalLoad: 0,
    filteredLongitudinalSlip: 0,
    filteredLateralSlip: 0,
    surfaceNormalAlignment: 0,
    filteredSurfaceNormalAlignment: 1,
    contactPersistenceSeconds: 0,
    contactAgeSeconds: 1_000_000,
  };
}

function emptyControllerTelemetry(gear, engineRpm) {
  return {
    controlSequence: 0,
    gear,
    engineRpm,
    engineTorque: 0,
    requestedDriveTorque: 0,
    driveTorqueTarget: 0,
    driveTorque: 0,
    driveTorqueRateLimited: false,
    driveTorqueScale: 1,
    driveSlipScale: 1,
    driveFrontLoadScale: 1,
    rearWheelRpm: 0,
    frontWheelRpm: 0,
    speed: 0,
    forwardSpeed: 0,
    leanAngle: 0,
    targetLean: 0,
    leanAssistTorque: 0,
    steeringTarget: 0,
    desiredLateralAcceleration: 0,
    steeringSpeedBlend: 0,
    automaticShiftCount: 0,
    groundCoupledRpm: engineRpm,
    predictedLowerGearRpm: engineRpm,
    automaticShiftRearContactQualified: false,
    lastAutomaticShiftReason: 'none',
    parkingHoldForceNewtons: 0,
    parkingHoldTorqueNewtonMeters: 0,
    actuators: createActuatorState(),
    suspension: {
      front: {
        positionMeters: 0,
        minimumMeters: 0,
        maximumMeters: 0,
        normalizedTravel: 0,
      },
      rear: {
        swingarmAngleRadians: 0,
        minimumRadians: 0,
        maximumRadians: 0,
        springForceNewtons: 0,
      },
    },
    tires: {
      rear: emptyTireTelemetry(),
      front: emptyTireTelemetry(),
    },
    synthetic: false,
  };
}

function shiftSnapshot(snapshot, shift) {
  for (const body of snapshot.bodies) {
    for (const field of ['position', 'previousPosition']) {
      body[field][0] = Math.fround(body[field][0] - shift[0]);
      body[field][1] = Math.fround(body[field][1] - shift[1]);
      body[field][2] = Math.fround(body[field][2] - shift[2]);
    }
    if (body.kinematicTarget) {
      body.kinematicTarget.position[0] = Math.fround(body.kinematicTarget.position[0] - shift[0]);
      body.kinematicTarget.position[1] = Math.fround(body.kinematicTarget.position[1] - shift[1]);
      body.kinematicTarget.position[2] = Math.fround(body.kinematicTarget.position[2] - shift[2]);
    }
  }
}

function transformSnapshot(snapshot, transform, world) {
  const point = (value) => Array.from(vec3(transform.transformPoint(Array.from(value))));
  const vector = (value) => Array.from(vec3(transform.transformVector(Array.from(value))));
  const orientation = (value) => Array.from(quat(
    transform.transformOrientation(Array.from(value)),
  ));
  const frameOrientation = quat(orientation([0, 0, 0, 1]));
  const inverseFrameOrientation = quatConjugate(frameOrientation, new Float32Array(4));
  const relativeOrientation = (value) => Array.from(quat(quatMultiply(
    quat(orientation(value)),
    inverseFrameOrientation,
    new Float32Array(4),
  )));
  return {
    ...snapshot,
    bodies: snapshot.bodies.map((body) => ({
      ...body,
      position: point(body.position),
      previousPosition: point(body.previousPosition ?? body.position),
      orientation: orientation(body.orientation),
      previousOrientation: orientation(body.previousOrientation ?? body.orientation),
      linearVelocity: vector(body.linearVelocity),
      angularVelocity: vector(body.angularVelocity),
      force: vector(body.force ?? [0, 0, 0]),
      torque: vector(body.torque ?? [0, 0, 0]),
      kinematicTarget: body.kinematicTarget
        ? {
            position: point(body.kinematicTarget.position),
            orientation: orientation(body.kinematicTarget.orientation),
          }
        : null,
    })),
    joints: (snapshot.joints ?? []).map((state) => {
      const worldConnected = world.getJoint(state.id).bodyB === null;
      return {
        ...state,
        motor: state.motor ? { ...state.motor } : null,
        runtime: {
          ...state.runtime,
          referenceA: Array.from(state.runtime.referenceA),
          referenceB: worldConnected
            ? vector(state.runtime.referenceB)
            : Array.from(state.runtime.referenceB),
          initialRelativeOrientation: worldConnected
            ? orientation(state.runtime.initialRelativeOrientation)
            : relativeOrientation(state.runtime.initialRelativeOrientation),
        },
      };
    }),
  };
}

export class MotorcycleController {
  constructor(world, rig, options = {}) {
    if (!world || !rig) throw new TypeError('MotorcycleController requires world and rig');
    this.world = world;
    this.rig = rig;
    this.config = Object.freeze({ ...DEFAULT_CONFIG, ...options });
    this.automaticTransmissionEnabled = Boolean(this.config.automaticTransmission);
    const initialGear = clamp(options.initialGear ?? 1, 0, this.config.gearRatios.length - 1);
    this.gear = this.automaticTransmissionEnabled ? Math.max(1, initialGear) : initialGear;
    this.engineRpm = this.config.idleRpm;
    this.actuators = createActuatorState();
    this.automaticShiftCooldown = 0;
    this.automaticShiftCount = 0;
    this.groundCoupledRpm = this.config.idleRpm;
    this.predictedLowerGearRpm = this.config.idleRpm;
    this.automaticShiftRearContactQualified = false;
    this.lastAutomaticShiftReason = 'none';
    this.driveTorqueState = 0;
    this.filteredTires = {
      rear: createFilteredTireState(),
      front: createFilteredTireState(),
    };
    this.hasObservedTireContact = false;
    this.lastSequence = -1;
    this.controls = createNeutralControlFrame();
    this.parkingAnchor = null;
    this.leanAssistEnabled = options.leanAssist !== false;
    this.initialSnapshot = world.getSnapshot();
    this.telemetry = emptyControllerTelemetry(this.gear, this.engineRpm);
    this.unsubscribeStep = world.addStepListener((context) => this.#beforeStep(context));
    this.unsubscribeContact = world.addContactModifier((contact) => this.#modifyContact(contact));
    this.unsubscribePost = world.addPostStepListener((context) => this.#afterStep(context));
    this.unsubscribeReferenceFrameTransform = world.addReferenceFrameTransformListener
      ? world.addReferenceFrameTransformListener((transform) => {
          this.initialSnapshot = transformSnapshot(this.initialSnapshot, transform, world);
          if (this.parkingAnchor) {
            this.parkingAnchor = vec3(transform.transformPoint(Array.from(this.parkingAnchor)));
          }
        })
      : null;
    this.unsubscribeOriginShift = this.unsubscribeReferenceFrameTransform
      ? null
      : world.addOriginShiftListener?.((shift) => {
          shiftSnapshot(this.initialSnapshot, shift);
          if (this.parkingAnchor) {
            this.parkingAnchor[0] = Math.fround(this.parkingAnchor[0] - shift[0]);
            this.parkingAnchor[1] = Math.fround(this.parkingAnchor[1] - shift[1]);
            this.parkingAnchor[2] = Math.fround(this.parkingAnchor[2] - shift[2]);
          }
        }) ?? null;
  }

  #wheelAxle(body) {
    return vecNormalize(bodyWorldVector(body, [1, 0, 0]), [1, 0, 0]);
  }

  #wheelAngularSpeed(body) {
    return vecDot(body.angularVelocity, this.#wheelAxle(body));
  }

  #applyWheelTorque(bodyId, torque) {
    const body = this.world.getBody(bodyId);
    this.world.applyTorque(bodyId, vecScale(this.#wheelAxle(body), torque));
  }

  #suspensionTelemetry() {
    const fork = this.world.getJoint(this.rig.jointIds.forkSlide);
    const swingarm = this.world.getJoint(this.rig.jointIds.rearSwingarm);
    const rearSpring = this.world.getJoint(this.rig.jointIds.rearSuspension);
    const position = Number(fork.runtime.position) || 0;
    const minimum = Number(fork.min) || 0;
    const maximum = Number(fork.max) || 0;
    const span = maximum - minimum;
    return {
      front: {
        positionMeters: Math.fround(position),
        minimumMeters: Math.fround(minimum),
        maximumMeters: Math.fround(maximum),
        normalizedTravel: Math.fround(span > 0 ? clamp((position - minimum) / span, 0, 1) : 0),
      },
      rear: {
        swingarmAngleRadians: Math.fround(Number(swingarm.runtime.angle) || 0),
        minimumRadians: Math.fround(Number(swingarm.min) || 0),
        maximumRadians: Math.fround(Number(swingarm.max) || 0),
        springForceNewtons: Math.fround(Number(rearSpring.runtime.springForce) || 0),
      },
    };
  }

  #processEdges(control) {
    if (control.sequence === this.lastSequence) return false;
    this.lastSequence = control.sequence;
    let shifted = false;
    if (!this.automaticTransmissionEnabled && control.shiftDelta !== 0) {
      this.gear = clamp(
        this.gear + control.shiftDelta,
        0,
        this.config.gearRatios.length - 1,
      );
      this.automaticShiftCooldown = this.config.automaticShiftCooldownSeconds;
      shifted = true;
    }
    if (control.reset) {
      this.reset({ preserveAccumulator: true });
      // Preserve the consumed sequence so a render frame with multiple fixed
      // substeps cannot replay the reset edge.
      this.lastSequence = control.sequence;
    }
    return shifted;
  }

  #updateActuators(control, dt) {
    // These rates advance only on the authoritative fixed step. Rendering and
    // input polling cadence therefore cannot change an actuator trajectory.
    this.actuators.steer = filterSteering(
      this.actuators.steer,
      control.steer,
      this.config.steerRiseRate,
      this.config.steerReturnRate,
      dt,
    );
    this.actuators.throttle = filterPedal(
      this.actuators.throttle,
      control.throttle,
      this.config.throttleRiseRate,
      this.config.throttleFallRate,
      dt,
    );
    for (const field of ['frontBrake', 'rearBrake', 'handbrake']) {
      this.actuators[field] = filterPedal(
        this.actuators[field],
        control[field],
        this.config.brakeRiseRate,
        this.config.brakeFallRate,
        dt,
      );
    }
  }

  #updateAutomaticGearbox(control, dt, manualShifted, groundWheelOmega) {
    this.automaticShiftCooldown = Math.max(0, this.automaticShiftCooldown - dt);
    const ratio = this.config.gearRatios[this.gear]
      * this.config.finalDrive
      * this.config.primaryDrive;
    this.groundCoupledRpm = Math.max(
      this.config.idleRpm,
      Math.abs(groundWheelOmega * ratio) * 60 / (Math.PI * 2),
    );
    const lowerGear = Math.max(1, this.gear - 1);
    const lowerRatio = this.config.gearRatios[lowerGear]
      * this.config.finalDrive
      * this.config.primaryDrive;
    this.predictedLowerGearRpm = Math.max(
      this.config.idleRpm,
      Math.abs(groundWheelOmega * lowerRatio) * 60 / (Math.PI * 2),
    );
    const rear = this.filteredTires.rear;
    this.automaticShiftRearContactQualified = rear.contactPersistenceSeconds
        >= this.config.automaticShiftMinimumContactSeconds
      && rear.contactAgeSeconds <= this.config.tireContactGraceSeconds
      && Math.abs(rear.longitudinalSlip) <= this.config.automaticShiftMaximumSlip;
    if (!this.automaticTransmissionEnabled || manualShifted || control.clutch > 0.05 || this.gear === 0) {
      return false;
    }
    if (this.automaticShiftCooldown > 0) return false;
    const lastGear = this.config.gearRatios.length - 1;
    let nextGear = this.gear;
    let shiftReason = 'none';
    if (this.groundCoupledRpm >= this.config.automaticUpshiftRpm
      && this.gear < lastGear
      && this.automaticShiftRearContactQualified) {
      nextGear += 1;
      shiftReason = 'ground-coupled-upshift';
    } else if (this.gear > 1
      && this.predictedLowerGearRpm
        <= this.config.redlineRpm * this.config.automaticDownshiftRedlineFraction
      && (this.groundCoupledRpm <= this.config.automaticDownshiftRpm
        || (this.actuators.throttle >= this.config.automaticKickdownThrottle
          && this.groundCoupledRpm <= this.config.automaticKickdownRpm))) {
      nextGear -= 1;
      shiftReason = this.actuators.throttle >= this.config.automaticKickdownThrottle
        ? 'ground-coupled-kickdown'
        : 'ground-coupled-downshift';
    }
    if (nextGear === this.gear) return false;
    this.gear = nextGear;
    this.automaticShiftCooldown = this.config.automaticShiftCooldownSeconds;
    this.automaticShiftCount += 1;
    this.lastAutomaticShiftReason = shiftReason;
    return true;
  }

  #driveTorqueLimits(forwardSpeed) {
    const rear = this.filteredTires.rear;
    const front = this.filteredTires.front;
    const axleLoad = rear.normalLoad + front.normalLoad;
    const rearContactRecent = rear.contactAgeSeconds <= this.config.tireContactGraceSeconds;
    const frontContactRecent = front.contactAgeSeconds <= this.config.tireContactGraceSeconds;
    const terrainNormalDeviation = Math.max(
      1 - rear.surfaceNormalAlignment,
      1 - front.surfaceNormalAlignment,
    );
    const offroadBlend = smoothstep(
      this.config.offroadNormalDeviationStart,
      this.config.offroadNormalDeviationEnd,
      terrainNormalDeviation,
    );
    const intervention = smoothstep(
      this.config.tractionControlMinimumSpeed,
      this.config.tractionControlFullSpeed,
      Math.abs(forwardSpeed),
    ) * (1 - offroadBlend);
    if (!rearContactRecent && !frontContactRecent) {
      const rawFrontLoadScale = this.hasObservedTireContact
        ? this.config.minimumDriveTorqueScale
        : 1;
      const frontLoadScale = 1 + (rawFrontLoadScale - 1) * intervention;
      return { scale: frontLoadScale, slipScale: 1, frontLoadScale };
    }
    const rawSlipScale = 1 - smoothstep(
      this.config.tractionSlipStart,
      this.config.tractionSlipEnd,
      Math.abs(rear.longitudinalSlip),
    ) * (1 - this.config.minimumDriveTorqueScale);
    const frontLoadRatio = axleLoad > 1e-6 ? front.normalLoad / axleLoad : 0;
    const firstGearLoadBlend = this.gear === 1
      ? 1 - smoothstep(
          this.config.firstGearFrontLoadFadeBeginSpeed,
          this.config.firstGearFrontLoadFadeFullSpeed,
          Math.abs(forwardSpeed),
        )
      : 0;
    const frontLoadCutStart = this.config.frontLoadCutStart
      + (this.config.firstGearFrontLoadCutStart - this.config.frontLoadCutStart)
        * firstGearLoadBlend;
    const frontLoadCutEnd = this.config.frontLoadCutEnd
      + (this.config.firstGearFrontLoadCutEnd - this.config.frontLoadCutEnd)
        * firstGearLoadBlend;
    const rawFrontLoadScale = this.config.minimumDriveTorqueScale
      + smoothstep(
        frontLoadCutStart,
        frontLoadCutEnd,
        frontLoadRatio,
      ) * (1 - this.config.minimumDriveTorqueScale);
    const slipScale = 1 + (rawSlipScale - 1) * intervention;
    const frontLoadScale = 1 + (rawFrontLoadScale - 1) * intervention;
    const scale = Math.fround(clamp(
      Math.min(slipScale, frontLoadScale),
      this.config.minimumDriveTorqueScale,
      1,
    ));
    return {
      scale,
      slipScale: Math.fround(slipScale),
      frontLoadScale: Math.fround(frontLoadScale),
    };
  }

  #beforeStep({ controlFrame, dt }) {
    const control = normalizeControlFrame(controlFrame ?? this.controls, this.lastSequence + 1);
    const manualShifted = this.#processEdges(control);
    this.controls = control;
    this.#updateActuators(control, dt);
    const chassis = this.world.getBody(this.rig.bodyIds.chassis);
    const rearWheel = this.world.getBody(this.rig.bodyIds.rearWheel);
    const frontWheel = this.world.getBody(this.rig.bodyIds.frontWheel);
    const rearOmega = this.#wheelAngularSpeed(rearWheel);
    const frontOmega = this.#wheelAngularSpeed(frontWheel);
    const forward = vecNormalize(bodyWorldVector(chassis, [0, 0, 1]), [0, 0, 1]);
    const up = vecNormalize(bodyWorldVector(chassis, [0, 1, 0]), [0, 1, 0]);
    const speed = vecLength(chassis.linearVelocity);
    const forwardSpeed = vecDot(chassis.linearVelocity, forward);
    const groundWheelOmega = Math.abs(forwardSpeed)
      / (this.rig.rollingRadiusMeters ?? (this.rig.wheelRadius + this.rig.tireRadius));
    let ratio = this.config.gearRatios[this.gear] * this.config.finalDrive * this.config.primaryDrive;
    const coupledRpm = Math.abs(rearOmega * ratio) * 60 / (Math.PI * 2);
    const freeRpm = this.config.idleRpm
      + this.actuators.throttle * (this.config.redlineRpm - this.config.idleRpm) * 0.72;
    const clutchEngagement = 1 - control.clutch;
    const targetRpm = Math.max(
      this.config.idleRpm,
      coupledRpm * clutchEngagement + freeRpm * (1 - clutchEngagement),
    );
    this.engineRpm += (targetRpm - this.engineRpm) * 0.12;
    this.engineRpm = clamp(this.engineRpm, this.config.idleRpm, this.config.redlineRpm * 1.05);
    if (this.#updateAutomaticGearbox(control, dt, manualShifted, groundWheelOmega)) {
      ratio = this.config.gearRatios[this.gear] * this.config.finalDrive * this.config.primaryDrive;
      this.engineRpm = clamp(
        Math.max(this.config.idleRpm, Math.abs(rearOmega * ratio) * 60 / (Math.PI * 2)),
        this.config.idleRpm,
        this.config.redlineRpm * 1.05,
      );
    }
    const engineTorque = Math.pow(this.actuators.throttle, this.config.throttleResponseExponent)
      * this.config.peakTorque
      * torqueCurve(this.engineRpm, this.config.redlineRpm);
    const requestedDriveTorque = this.gear === 0
      ? 0
      : engineTorque * ratio * clutchEngagement * this.config.drivetrainEfficiency;
    const driveTorqueLimits = this.#driveTorqueLimits(forwardSpeed);
    const driveTorqueScale = driveTorqueLimits.scale;
    const driveTorqueTarget = clamp(
      requestedDriveTorque,
      -this.config.maximumDriveTorque,
      this.config.maximumDriveTorque,
    ) * driveTorqueScale;
    const driveTorqueRate = Math.abs(driveTorqueTarget) > Math.abs(this.driveTorqueState)
      ? this.config.driveTorqueRiseRateNmPerSecond
      : this.config.driveTorqueFallRateNmPerSecond;
    this.driveTorqueState = moveTowards(
      this.driveTorqueState,
      driveTorqueTarget,
      driveTorqueRate * dt,
    );
    const driveTorqueRateLimited = Math.abs(this.driveTorqueState - driveTorqueTarget) > 1e-4;
    const engineBrake = this.gear === 0
      ? 0
      : (1 - this.actuators.throttle) * clutchEngagement * this.config.engineBraking * ratio;
    // With local +X as the axle and +Z as vehicle forward, positive wheel
    // rotation moves the bottom of the tire toward -Z and the road reaction
    // propels the motorcycle toward +Z.
    const driveDirection = 1;
    const netDriveTorque = this.driveTorqueState * driveDirection
      - Math.sign(rearOmega) * engineBrake * clamp(Math.abs(rearOmega) / 4, 0, 1);
    this.#applyWheelTorque(this.rig.bodyIds.rearWheel, netDriveTorque);
    this.world.applyTorque(
      this.rig.bodyIds.chassis,
      vecScale(this.#wheelAxle(rearWheel), -netDriveTorque),
    );

    const rearBrake = Math.max(this.actuators.rearBrake, this.actuators.handbrake);
    const rearBrakeTorque = -Math.sign(rearOmega) * rearBrake * this.config.rearBrakeTorque;
    const frontBrakeTorque = -Math.sign(frontOmega) * this.actuators.frontBrake * this.config.frontBrakeTorque;
    this.#applyWheelTorque(this.rig.bodyIds.rearWheel, rearBrakeTorque);
    this.#applyWheelTorque(this.rig.bodyIds.frontWheel, frontBrakeTorque);
    this.world.applyTorque(
      this.rig.bodyIds.rearSwingarm,
      vecScale(this.#wheelAxle(rearWheel), -rearBrakeTorque),
    );
    this.world.applyTorque(
      this.rig.bodyIds.lowerFork,
      vecScale(this.#wheelAxle(frontWheel), -frontBrakeTorque),
    );

    const steeringSpeedBlend = smoothstep(
      this.config.lateralAccelerationMinimumSpeed,
      this.config.lateralAccelerationFullSpeed,
      Math.abs(forwardSpeed),
    );
    // The action contract is rider-centric (-left, +right). This rig faces
    // local +Z, so its rider-right axis is local -X. Positive rotation about
    // +Y points the fork toward local +X (rider-left); convert the normalized
    // action once at the actuator boundary instead of reversing every input
    // adapter independently.
    // One lateral-acceleration request drives both compatible outputs:
    // bank = atan(a/g), fork = atan(wheelbase*a/v^2). Below road speed the
    // fork blends to direct steering while bank authority fades to zero.
    const desiredLateralAcceleration = this.actuators.steer
      * this.config.lateralAccelerationCap
      * steeringSpeedBlend;
    const physicalSteer = -this.actuators.steer;
    const directSteeringTarget = physicalSteer * this.config.steeringAngle;
    const curvatureSteeringTarget = -Math.sign(desiredLateralAcceleration) * Math.atan(
      this.rig.wheelbaseMeters * Math.abs(desiredLateralAcceleration)
        / Math.max(forwardSpeed * forwardSpeed, 0.25),
    );
    const steeringTarget = directSteeringTarget * (1 - steeringSpeedBlend)
      + curvatureSteeringTarget * steeringSpeedBlend;
    this.world.setJointMotor(this.rig.jointIds.steering, {
      enabled: true,
      targetPosition: steeringTarget,
      targetVelocity: 0,
      maxImpulse: this.config.steeringImpulse,
    });

    const globalUp = vecNormalize(
      vecScale(this.world.options.gravity, -1),
      [0, 1, 0],
    );
    const leanAngle = Math.atan2(vecDot(vecCross(globalUp, up), forward), vecDot(globalUp, up));
    const gravity = Math.max(1e-6, vecLength(this.world.options.gravity));
    const targetLean = clamp(
      Math.atan(desiredLateralAcceleration / gravity),
      -this.config.maxLean,
      this.config.maxLean,
    );
    let leanTorque = 0;
    if (this.leanAssistEnabled) {
      const rollRate = vecDot(chassis.angularVelocity, forward);
      const corneringBlend = smoothstep(0, 0.1, Math.abs(targetLean));
      const leanStiffness = this.config.leanStiffness
        + (this.config.corneringLeanStiffness - this.config.leanStiffness) * corneringBlend;
      leanTorque = clamp(
        (targetLean - leanAngle) * leanStiffness - rollRate * this.config.leanDamping,
        -this.config.maxLeanTorque,
        this.config.maxLeanTorque,
      );
      this.world.applyTorque(this.rig.bodyIds.chassis, vecScale(forward, leanTorque));
    }
    if (speed > 0.05) {
      const dragCoefficient = this.config.aerodynamicDrag
        + this.config.corneringDrag
          * Math.min(1, Math.abs(desiredLateralAcceleration) / this.config.lateralAccelerationCap);
      this.world.applyForce(
        this.rig.bodyIds.chassis,
        vecScale(chassis.linearVelocity, -dragCoefficient * speed),
      );
    }
    let parkingHoldForceNewtons = 0;
    let parkingHoldTorqueNewtonMeters = 0;
    const parkingInput = this.actuators.throttle <= 1e-4;
    const planarVelocity = vecProjectOnPlane(chassis.linearVelocity, globalUp);
    const planarSpeed = vecLength(planarVelocity);
    if (parkingInput && planarSpeed < this.config.parkingHoldSpeed) {
      // A real motorcycle needs a rider's feet at rest. Model that low-speed
      // assist as a bounded spring/damper distributed over every rigid
      // component, never as a pose/velocity overwrite.
      this.parkingAnchor ??= vec3(chassis.position);
      const displacement = vecProjectOnPlane(
        vecSub(chassis.position, this.parkingAnchor),
        globalUp,
      );
      let parkingForce = vecSub(
        vecScale(displacement, -this.config.parkingSpring),
        vecScale(planarVelocity, this.config.parkingDamping),
      );
      const magnitude = vecLength(parkingForce);
      if (magnitude > this.config.parkingMaximumForce) {
        parkingForce = vecScale(parkingForce, this.config.parkingMaximumForce / magnitude);
      }
      const totalMass = this.rig.bodyIdList.reduce(
        (sum, bodyId) => sum + this.world.getBody(bodyId).mass,
        0,
      );
      for (const bodyId of this.rig.bodyIdList) {
        const body = this.world.getBody(bodyId);
        const share = body.mass / totalMass;
        this.world.applyForce(bodyId, vecScale(parkingForce, share));
      }
      parkingHoldForceNewtons = vecLength(parkingForce);
      const rollRate = vecDot(chassis.angularVelocity, forward);
      const parkingLeanTorque = clamp(
        -leanAngle * this.config.parkingLeanStiffness
          - rollRate * this.config.parkingLeanDamping,
        -this.config.parkingMaximumLeanTorque,
        this.config.parkingMaximumLeanTorque,
      );
      this.world.applyTorque(
        this.rig.bodyIds.chassis,
        vecScale(forward, parkingLeanTorque),
      );
      parkingHoldTorqueNewtonMeters = Math.abs(parkingLeanTorque);
    } else {
      this.parkingAnchor = null;
    }

    this.telemetry = {
      ...this.telemetry,
      controlSequence: control.sequence,
      gear: this.gear,
      engineRpm: Math.fround(this.engineRpm),
      engineTorque: Math.fround(engineTorque),
      requestedDriveTorque: Math.fround(requestedDriveTorque),
      driveTorqueTarget: Math.fround(driveTorqueTarget),
      driveTorque: Math.fround(netDriveTorque),
      driveTorqueRateLimited,
      driveTorqueScale: Math.fround(driveTorqueScale),
      driveSlipScale: driveTorqueLimits.slipScale,
      driveFrontLoadScale: driveTorqueLimits.frontLoadScale,
      rearWheelRpm: Math.fround(rearOmega * 60 / (Math.PI * 2)),
      frontWheelRpm: Math.fround(frontOmega * 60 / (Math.PI * 2)),
      speed: Math.fround(speed),
      forwardSpeed: Math.fround(forwardSpeed),
      leanAngle: Math.fround(leanAngle),
      targetLean: Math.fround(targetLean),
      leanAssistTorque: Math.fround(leanTorque),
      steeringTarget: Math.fround(steeringTarget),
      desiredLateralAcceleration: Math.fround(desiredLateralAcceleration),
      steeringSpeedBlend: Math.fround(steeringSpeedBlend),
      automaticShiftCount: this.automaticShiftCount,
      groundCoupledRpm: Math.fround(this.groundCoupledRpm),
      predictedLowerGearRpm: Math.fround(this.predictedLowerGearRpm),
      automaticShiftRearContactQualified: this.automaticShiftRearContactQualified,
      lastAutomaticShiftReason: this.lastAutomaticShiftReason,
      parkingHoldForceNewtons: Math.fround(parkingHoldForceNewtons),
      parkingHoldTorqueNewtonMeters: Math.fround(parkingHoldTorqueNewtonMeters),
      actuators: { ...this.actuators },
      suspension: this.#suspensionTelemetry(),
      tires: {
        rear: emptyTireTelemetry(),
        front: emptyTireTelemetry(),
      },
    };
  }

  #modifyContact(contact) {
    // Tire slip/friction is a road-surface model. Particle contacts with
    // traffic or another rigid body must retain the generic two-body impulse
    // solver and its relative body velocity instead of being mislabeled as a
    // stationary terrain patch.
    if (contact.type !== 'surface' || contact.bodyB !== null) return null;
    const isRear = contact.bodyA.id === this.rig.bodyIds.rearWheel;
    const isFront = contact.bodyA.id === this.rig.bodyIds.frontWheel;
    if (!isRear && !isFront) return null;
    const kinematics = wheelKinematics(
      contact.bodyA,
      contact,
      this.rig.rollingRadiusMeters ?? (this.rig.wheelRadius + this.rig.tireRadius),
    );
    const longitudinalFalloff = Math.exp(
      -Math.pow(Math.abs(kinematics.longitudinalSlip) / this.config.tireSlipFalloff, 2),
    );
    const lateralFalloff = Math.exp(
      -Math.pow(Math.abs(kinematics.lateralSlip) / this.config.lateralSlipFalloff, 2),
    );
    const muLongitudinal = this.config.tireSlideFriction
      + (this.config.tirePeakFriction - this.config.tireSlideFriction) * longitudinalFalloff;
    const muLateral = this.config.tireLateralSlideFriction
      + (this.config.tireLateralPeakFriction - this.config.tireLateralSlideFriction)
        * lateralFalloff;
    const combinedMaterialFriction = Math.max(0, Number(contact.friction) || 0);
    return {
      tangentLongitudinal: kinematics.forward,
      // The tire curve can reduce available grip as slip grows, but it cannot
      // manufacture traction beyond the combined source surface/material.
      muLongitudinal: Math.min(combinedMaterialFriction, muLongitudinal),
      muLateral: Math.min(combinedMaterialFriction, muLateral),
      rollingFriction: Math.min(contact.rollingFriction ?? 0.006, 0.006),
      metadata: {
        ...(contact.metadata ?? {}),
        tire: isRear ? 'rear' : 'front',
        combinedMaterialFriction: Math.fround(combinedMaterialFriction),
        longitudinalSlip: Math.fround(kinematics.longitudinalSlip),
        lateralSlip: Math.fround(kinematics.lateralSlip),
        longitudinalSpeed: Math.fround(kinematics.longitudinalSpeed),
        lateralSpeed: Math.fround(kinematics.lateralSpeed),
      },
    };
  }

  #afterStep({ contacts, dt }) {
    const globalUp = vecNormalize(vecScale(this.world.options.gravity, -1), [0, 1, 0]);
    const tires = {
      rear: emptyTireTelemetry(),
      front: emptyTireTelemetry(),
    };
    for (const contact of contacts) {
      const tire = contact.metadata?.tire;
      if (!tire || !tires[tire]) continue;
      const target = tires[tire];
      target.contactCount += 1;
      target.normalImpulse += contact.normalImpulse;
      target.longitudinalImpulse += contact.longitudinalImpulse;
      target.lateralImpulse += contact.lateralImpulse;
      target.longitudinalSlip += contact.metadata.longitudinalSlip;
      target.lateralSlip += contact.metadata.lateralSlip;
      target.surfaceNormalAlignment += clamp(vecDot(contact.normal, globalUp), -1, 1);
    }
    for (const [name, tire] of Object.entries(tires)) {
      tire.normalLoad = Math.fround(tire.normalImpulse / dt);
      tire.normalImpulse = Math.fround(tire.normalImpulse);
      tire.longitudinalImpulse = Math.fround(tire.longitudinalImpulse);
      tire.lateralImpulse = Math.fround(tire.lateralImpulse);
      if (tire.contactCount > 0) {
        tire.longitudinalSlip = Math.fround(tire.longitudinalSlip / tire.contactCount);
        tire.lateralSlip = Math.fround(tire.lateralSlip / tire.contactCount);
        tire.surfaceNormalAlignment = Math.fround(
          tire.surfaceNormalAlignment / tire.contactCount,
        );
      } else {
        tire.surfaceNormalAlignment = 1;
      }
      const filtered = this.filteredTires[name];
      if (tire.contactCount > 0) {
        const continuedContact = filtered.contactAgeSeconds
          <= this.config.tireContactGraceSeconds;
        filtered.contactAgeSeconds = 0;
        filtered.contactPersistenceSeconds = continuedContact
          ? filtered.contactPersistenceSeconds + dt
          : dt;
        filtered.sampledLongitudinalSlip = tire.longitudinalSlip;
        filtered.sampledLateralSlip = tire.lateralSlip;
      } else {
        filtered.contactAgeSeconds += dt;
        if (filtered.contactAgeSeconds <= this.config.tireContactGraceSeconds) {
          filtered.contactPersistenceSeconds += dt;
        } else {
          filtered.contactPersistenceSeconds = 0;
          filtered.sampledLongitudinalSlip = 0;
          filtered.sampledLateralSlip = 0;
        }
      }
      filtered.normalLoad = filterTimeConstant(
        filtered.normalLoad,
        tire.normalLoad,
        this.config.tireLoadFilterTimeSeconds,
        dt,
      );
      filtered.longitudinalSlip = filterTimeConstant(
        filtered.longitudinalSlip,
        filtered.sampledLongitudinalSlip,
        this.config.tireSlipFilterTimeSeconds,
        dt,
      );
      filtered.lateralSlip = filterTimeConstant(
        filtered.lateralSlip,
        filtered.sampledLateralSlip,
        this.config.tireSlipFilterTimeSeconds,
        dt,
      );
      filtered.surfaceNormalAlignment = filterTimeConstant(
        filtered.surfaceNormalAlignment,
        tire.surfaceNormalAlignment,
        this.config.tireLoadFilterTimeSeconds,
        dt,
      );
      tire.filteredNormalLoad = filtered.normalLoad;
      tire.filteredLongitudinalSlip = filtered.longitudinalSlip;
      tire.filteredLateralSlip = filtered.lateralSlip;
      tire.filteredSurfaceNormalAlignment = filtered.surfaceNormalAlignment;
      tire.contactPersistenceSeconds = Math.fround(filtered.contactPersistenceSeconds);
      tire.contactAgeSeconds = Math.fround(filtered.contactAgeSeconds);
    }
    this.hasObservedTireContact ||= tires.front.contactCount > 0 || tires.rear.contactCount > 0;
    this.telemetry.tires = tires;
    this.telemetry.suspension = this.#suspensionTelemetry();
  }

  setLeanAssist(enabled) {
    this.leanAssistEnabled = Boolean(enabled);
  }

  setAutomaticTransmission(enabled) {
    this.automaticTransmissionEnabled = Boolean(enabled);
    if (this.automaticTransmissionEnabled && this.gear === 0) this.gear = 1;
    this.automaticShiftCooldown = 0;
    return this.getTelemetry();
  }

  setGear(gear) {
    if (!Number.isInteger(gear)) throw new TypeError('gear must be an integer');
    this.gear = clamp(
      gear,
      this.automaticTransmissionEnabled ? 1 : 0,
      this.config.gearRatios.length - 1,
    );
    this.automaticShiftCooldown = this.config.automaticShiftCooldownSeconds;
  }

  reset({ preserveAccumulator = false } = {}) {
    const accumulator = this.world.accumulator;
    this.world.reset(this.initialSnapshot);
    if (preserveAccumulator) this.world.accumulator = accumulator;
    this.gear = 1;
    this.engineRpm = this.config.idleRpm;
    this.actuators = createActuatorState();
    this.automaticShiftCooldown = 0;
    this.automaticShiftCount = 0;
    this.groundCoupledRpm = this.config.idleRpm;
    this.predictedLowerGearRpm = this.config.idleRpm;
    this.automaticShiftRearContactQualified = false;
    this.lastAutomaticShiftReason = 'none';
    this.driveTorqueState = 0;
    this.filteredTires = {
      rear: createFilteredTireState(),
      front: createFilteredTireState(),
    };
    this.hasObservedTireContact = false;
    this.lastSequence = -1;
    this.controls = createNeutralControlFrame();
    this.parkingAnchor = null;
    this.telemetry = emptyControllerTelemetry(this.gear, this.engineRpm);
  }

  getTelemetry() {
    return {
      ...this.telemetry,
      gear: this.gear,
      engineRpm: Math.fround(this.engineRpm),
      automaticTransmissionEnabled: this.automaticTransmissionEnabled,
      transmissionMode: this.automaticTransmissionEnabled ? 'automatic' : 'manual',
      controls: { ...this.controls },
      actuators: { ...this.telemetry.actuators },
      tires: {
        rear: { ...this.telemetry.tires.rear },
        front: { ...this.telemetry.tires.front },
      },
      suspension: {
        front: { ...this.telemetry.suspension.front },
        rear: { ...this.telemetry.suspension.rear },
      },
      leanAssistEnabled: this.leanAssistEnabled,
      componentCount: this.rig.componentCount,
    };
  }

  dispose() {
    this.unsubscribeStep?.();
    this.unsubscribeContact?.();
    this.unsubscribePost?.();
    this.unsubscribeReferenceFrameTransform?.();
    this.unsubscribeOriginShift?.();
    this.unsubscribeStep = null;
    this.unsubscribeContact = null;
    this.unsubscribePost = null;
    this.unsubscribeReferenceFrameTransform = null;
    this.unsubscribeOriginShift = null;
  }
}

export function createMotorcycleController(world, rig, options = {}) {
  return new MotorcycleController(world, rig, options);
}
