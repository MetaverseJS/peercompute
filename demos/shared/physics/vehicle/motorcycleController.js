import {
  bodyPointVelocity,
  bodyWorldVector,
} from '../particle-rigid/bodyMath.js';
import {
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
  // A responsive middleweight curve keeps first-gear rear-wheel torque below
  // the static wheelie threshold of the modeled rider/chassis. Higher-output
  // bikes can opt in through controller options without destabilizing the
  // reusable default rig.
  peakTorque: 75,
  engineBraking: 22,
  drivetrainEfficiency: 0.91,
  // Combined full-brake force is close to one vehicle weight at the tire
  // radius. This preserves grip-dependent stopping without an unavoidable
  // first-frame stoppie in the reusable default setup.
  rearBrakeTorque: 250,
  frontBrakeTorque: 450,
  steeringAngle: 0.52,
  steeringImpulse: 14,
  maxLean: 0.7,
  leanStiffness: 2_800,
  leanDamping: 420,
  maxLeanTorque: 3_500,
  aerodynamicDrag: 0.42,
  parkingHoldSpeed: 0.6,
  parkingSpring: 1_200,
  parkingDamping: 3_500,
  parkingMaximumForce: 3_000,
  tirePeakFriction: 1.22,
  tireSlideFriction: 0.78,
  tireSlipFalloff: 0.36,
  lateralSlipFalloff: 0.52,
});

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
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
  };
}

function emptyControllerTelemetry(gear, engineRpm) {
  return {
    controlSequence: 0,
    gear,
    engineRpm,
    engineTorque: 0,
    driveTorque: 0,
    rearWheelRpm: 0,
    frontWheelRpm: 0,
    speed: 0,
    forwardSpeed: 0,
    leanAngle: 0,
    targetLean: 0,
    leanAssistTorque: 0,
    steeringTarget: 0,
    parkingHoldForceNewtons: 0,
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

export class MotorcycleController {
  constructor(world, rig, options = {}) {
    if (!world || !rig) throw new TypeError('MotorcycleController requires world and rig');
    this.world = world;
    this.rig = rig;
    this.config = Object.freeze({ ...DEFAULT_CONFIG, ...options });
    this.gear = clamp(options.initialGear ?? 1, 0, this.config.gearRatios.length - 1);
    this.engineRpm = this.config.idleRpm;
    this.lastSequence = -1;
    this.controls = createNeutralControlFrame();
    this.parkingAnchor = null;
    this.leanAssistEnabled = options.leanAssist !== false;
    this.initialSnapshot = world.getSnapshot();
    this.telemetry = emptyControllerTelemetry(this.gear, this.engineRpm);
    this.unsubscribeStep = world.addStepListener((context) => this.#beforeStep(context));
    this.unsubscribeContact = world.addContactModifier((contact) => this.#modifyContact(contact));
    this.unsubscribePost = world.addPostStepListener((context) => this.#afterStep(context));
    this.unsubscribeOriginShift = world.addOriginShiftListener?.((shift) => {
      shiftSnapshot(this.initialSnapshot, shift);
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
    if (control.sequence === this.lastSequence) return;
    this.lastSequence = control.sequence;
    if (control.shiftDelta !== 0) {
      this.gear = clamp(
        this.gear + control.shiftDelta,
        0,
        this.config.gearRatios.length - 1,
      );
    }
    if (control.reset) {
      this.reset({ preserveAccumulator: true });
      // Preserve the consumed sequence so a render frame with multiple fixed
      // substeps cannot replay the reset edge.
      this.lastSequence = control.sequence;
    }
  }

  #beforeStep({ controlFrame }) {
    const control = normalizeControlFrame(controlFrame ?? this.controls, this.lastSequence + 1);
    this.#processEdges(control);
    this.controls = control;
    const chassis = this.world.getBody(this.rig.bodyIds.chassis);
    const rearWheel = this.world.getBody(this.rig.bodyIds.rearWheel);
    const frontWheel = this.world.getBody(this.rig.bodyIds.frontWheel);
    const rearOmega = this.#wheelAngularSpeed(rearWheel);
    const frontOmega = this.#wheelAngularSpeed(frontWheel);
    const ratio = this.config.gearRatios[this.gear] * this.config.finalDrive * this.config.primaryDrive;
    const coupledRpm = Math.abs(rearOmega * ratio) * 60 / (Math.PI * 2);
    const freeRpm = this.config.idleRpm
      + control.throttle * (this.config.redlineRpm - this.config.idleRpm) * 0.72;
    const clutchEngagement = 1 - control.clutch;
    const targetRpm = Math.max(
      this.config.idleRpm,
      coupledRpm * clutchEngagement + freeRpm * (1 - clutchEngagement),
    );
    this.engineRpm += (targetRpm - this.engineRpm) * 0.12;
    this.engineRpm = clamp(this.engineRpm, this.config.idleRpm, this.config.redlineRpm * 1.05);
    const engineTorque = control.throttle
      * this.config.peakTorque
      * torqueCurve(this.engineRpm, this.config.redlineRpm);
    const driveTorque = this.gear === 0
      ? 0
      : engineTorque * ratio * clutchEngagement * this.config.drivetrainEfficiency;
    const engineBrake = this.gear === 0
      ? 0
      : (1 - control.throttle) * clutchEngagement * this.config.engineBraking * ratio;
    // With local +X as the axle and +Z as vehicle forward, positive wheel
    // rotation moves the bottom of the tire toward -Z and the road reaction
    // propels the motorcycle toward +Z.
    const driveDirection = 1;
    const netDriveTorque = driveTorque * driveDirection
      - Math.sign(rearOmega) * engineBrake * clamp(Math.abs(rearOmega) / 4, 0, 1);
    this.#applyWheelTorque(this.rig.bodyIds.rearWheel, netDriveTorque);
    this.world.applyTorque(
      this.rig.bodyIds.chassis,
      vecScale(this.#wheelAxle(rearWheel), -netDriveTorque),
    );

    const rearBrake = Math.max(control.rearBrake, control.handbrake);
    const rearBrakeTorque = -Math.sign(rearOmega) * rearBrake * this.config.rearBrakeTorque;
    const frontBrakeTorque = -Math.sign(frontOmega) * control.frontBrake * this.config.frontBrakeTorque;
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

    const forward = vecNormalize(bodyWorldVector(chassis, [0, 0, 1]), [0, 0, 1]);
    const up = vecNormalize(bodyWorldVector(chassis, [0, 1, 0]), [0, 1, 0]);
    const speed = vecLength(chassis.linearVelocity);
    const forwardSpeed = vecDot(chassis.linearVelocity, forward);
    const speedSteeringScale = 1 / (1 + Math.abs(forwardSpeed) * 0.055);
    const steeringTarget = control.steer * this.config.steeringAngle * clamp(speedSteeringScale, 0.28, 1);
    this.world.setJointMotor(this.rig.jointIds.steering, {
      enabled: true,
      targetPosition: steeringTarget,
      targetVelocity: 0,
      maxImpulse: this.config.steeringImpulse,
    });

    const globalUp = vec3([0, 1, 0]);
    const leanAngle = Math.atan2(vecDot(vecCross(globalUp, up), forward), vecDot(globalUp, up));
    const targetLean = -control.steer
      * this.config.maxLean
      * clamp(Math.abs(forwardSpeed) / 12, 0, 1);
    let leanTorque = 0;
    if (this.leanAssistEnabled) {
      const rollRate = vecDot(chassis.angularVelocity, forward);
      leanTorque = clamp(
        (targetLean - leanAngle) * this.config.leanStiffness - rollRate * this.config.leanDamping,
        -this.config.maxLeanTorque,
        this.config.maxLeanTorque,
      );
      this.world.applyTorque(this.rig.bodyIds.chassis, vecScale(forward, leanTorque));
    }
    if (speed > 0.05) {
      this.world.applyForce(
        this.rig.bodyIds.chassis,
        vecScale(chassis.linearVelocity, -this.config.aerodynamicDrag * speed),
      );
    }
    let parkingHoldForceNewtons = 0;
    const neutralParkingInput = control.throttle <= 1e-4
      && Math.abs(control.steer) <= 1e-4
      && control.frontBrake <= 1e-4
      && control.rearBrake <= 1e-4
      && control.handbrake <= 1e-4;
    const planarSpeed = Math.hypot(chassis.linearVelocity[0], chassis.linearVelocity[2]);
    if (neutralParkingInput
      && (this.parkingAnchor !== null || planarSpeed < this.config.parkingHoldSpeed)) {
      // A real motorcycle needs a rider's feet at rest. Model that low-speed
      // assist as a bounded spring/damper distributed over every rigid
      // component, never as a pose/velocity overwrite.
      this.parkingAnchor ??= [chassis.position[0], chassis.position[2]];
      let forceX = -(chassis.position[0] - this.parkingAnchor[0]) * this.config.parkingSpring
        - chassis.linearVelocity[0] * this.config.parkingDamping;
      let forceZ = -(chassis.position[2] - this.parkingAnchor[1]) * this.config.parkingSpring
        - chassis.linearVelocity[2] * this.config.parkingDamping;
      const magnitude = Math.hypot(forceX, forceZ);
      if (magnitude > this.config.parkingMaximumForce) {
        const scale = this.config.parkingMaximumForce / magnitude;
        forceX *= scale;
        forceZ *= scale;
      }
      const totalMass = this.rig.bodyIdList.reduce(
        (sum, bodyId) => sum + this.world.getBody(bodyId).mass,
        0,
      );
      for (const bodyId of this.rig.bodyIdList) {
        const body = this.world.getBody(bodyId);
        const share = body.mass / totalMass;
        const force = [forceX * share, 0, forceZ * share];
        this.world.applyForce(bodyId, force);
      }
      parkingHoldForceNewtons = Math.hypot(forceX, forceZ);
    } else {
      this.parkingAnchor = null;
    }

    this.telemetry = {
      ...this.telemetry,
      controlSequence: control.sequence,
      gear: this.gear,
      engineRpm: Math.fround(this.engineRpm),
      engineTorque: Math.fround(engineTorque),
      driveTorque: Math.fround(netDriveTorque),
      rearWheelRpm: Math.fround(rearOmega * 60 / (Math.PI * 2)),
      frontWheelRpm: Math.fround(frontOmega * 60 / (Math.PI * 2)),
      speed: Math.fround(speed),
      forwardSpeed: Math.fround(forwardSpeed),
      leanAngle: Math.fround(leanAngle),
      targetLean: Math.fround(targetLean),
      leanAssistTorque: Math.fround(leanTorque),
      steeringTarget: Math.fround(steeringTarget),
      parkingHoldForceNewtons: Math.fround(parkingHoldForceNewtons),
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
    const kinematics = wheelKinematics(contact.bodyA, contact, this.rig.wheelRadius);
    const longitudinalFalloff = Math.exp(
      -Math.pow(Math.abs(kinematics.longitudinalSlip) / this.config.tireSlipFalloff, 2),
    );
    const lateralFalloff = Math.exp(
      -Math.pow(Math.abs(kinematics.lateralSlip) / this.config.lateralSlipFalloff, 2),
    );
    const muLongitudinal = this.config.tireSlideFriction
      + (this.config.tirePeakFriction - this.config.tireSlideFriction) * longitudinalFalloff;
    const muLateral = this.config.tireSlideFriction
      + (this.config.tirePeakFriction - this.config.tireSlideFriction) * lateralFalloff;
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
    }
    for (const tire of Object.values(tires)) {
      tire.normalLoad = Math.fround(tire.normalImpulse / dt);
      tire.normalImpulse = Math.fround(tire.normalImpulse);
      tire.longitudinalImpulse = Math.fround(tire.longitudinalImpulse);
      tire.lateralImpulse = Math.fround(tire.lateralImpulse);
      if (tire.contactCount > 0) {
        tire.longitudinalSlip = Math.fround(tire.longitudinalSlip / tire.contactCount);
        tire.lateralSlip = Math.fround(tire.lateralSlip / tire.contactCount);
      }
    }
    this.telemetry.tires = tires;
    this.telemetry.suspension = this.#suspensionTelemetry();
  }

  setLeanAssist(enabled) {
    this.leanAssistEnabled = Boolean(enabled);
  }

  setGear(gear) {
    if (!Number.isInteger(gear)) throw new TypeError('gear must be an integer');
    this.gear = clamp(gear, 0, this.config.gearRatios.length - 1);
  }

  reset({ preserveAccumulator = false } = {}) {
    const accumulator = this.world.accumulator;
    this.world.reset(this.initialSnapshot);
    if (preserveAccumulator) this.world.accumulator = accumulator;
    this.gear = 1;
    this.engineRpm = this.config.idleRpm;
    this.lastSequence = -1;
    this.controls = createNeutralControlFrame();
    this.parkingAnchor = null;
    this.telemetry = emptyControllerTelemetry(this.gear, this.engineRpm);
  }

  getTelemetry() {
    return {
      ...this.telemetry,
      controls: { ...this.controls },
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
    this.unsubscribeOriginShift?.();
    this.unsubscribeStep = null;
    this.unsubscribeContact = null;
    this.unsubscribePost = null;
    this.unsubscribeOriginShift = null;
  }
}

export function createMotorcycleController(world, rig, options = {}) {
  return new MotorcycleController(world, rig, options);
}
