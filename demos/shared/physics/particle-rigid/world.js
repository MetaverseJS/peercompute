import {
  bodyInverseInertiaWorld,
  bodyInertiaWorld,
  bodyWorldPoint,
} from './bodyMath.js';
import {
  contactImpulseVector,
  correctContactPosition,
  initializeContact,
  solveContactVelocity,
} from './contacts.js';
import {
  beginJointStep,
  correctJointLimitPosition,
  correctJointPosition,
  initializeJointRuntime,
  snapshotJoint,
  solveJointVelocity,
} from './constraints.js';
import {
  finiteArray,
  mat3MulVec,
  quat,
  quatDeltaVector,
  quatIntegrateWorld,
  quatRotate,
  quatSlerp,
  rotateTensor,
  vec3,
  vecAdd,
  vecClampLength,
  vecCross,
  vecDot,
  vecLength,
  vecScale,
  vecSub,
} from './math.js';
import { calculateParticleCloudMassProperties } from './particleCloud.js';
import {
  normalizeJointDefinition,
  normalizeMaterial,
  normalizeWorldOptions,
} from './schema.js';
import { DeterministicSpatialHash } from './spatialHash.js';
import { normalizeSurfaceCollider } from './surfaceColliders.js';
import { cloneTelemetry, createStepTelemetry } from './telemetry.js';

const ID_COMPARE = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

function requireId(id, label) {
  if (typeof id !== 'string' || id.length === 0) {
    throw new TypeError(`${label} id must be a non-empty string`);
  }
  return id;
}

function publicContact(contact) {
  return {
    id: contact.id,
    type: contact.type,
    bodyA: contact.bodyA.id,
    bodyB: contact.bodyB?.id ?? null,
    surfaceId: contact.surfaceId ?? null,
    particleA: contact.particleIndexA,
    particleB: contact.particleIndexB ?? null,
    particleTagA: contact.particleTagA ?? null,
    particleTagB: contact.particleTagB ?? null,
    point: Array.from(contact.pointA),
    normal: Array.from(contact.normal),
    penetration: contact.penetration,
    separation: contact.separation,
    normalImpulse: contact.normalImpulse,
    longitudinalImpulse: contact.longitudinalImpulse,
    lateralImpulse: contact.lateralImpulse,
    impulse: Array.from(contactImpulseVector(contact)),
    muLongitudinal: contact.muLongitudinal,
    muLateral: contact.muLateral,
    metadata: contact.metadata ?? null,
  };
}

function combineMaterial(a, b) {
  return {
    friction: Math.fround(Math.sqrt(a.friction * b.friction)),
    restitution: Math.fround(Math.max(a.restitution, b.restitution)),
    rollingFriction: Math.fround(Math.sqrt(a.rollingFriction * b.rollingFriction)),
  };
}

function angularVelocityFromMomentum(body, orientation, momentum, out = vec3()) {
  return mat3MulVec(rotateTensor(body.inverseInertia, orientation), momentum, out);
}

function integrateAngularMomentum(body, dt, angularScale) {
  const initialMomentum = mat3MulVec(
    rotateTensor(body.inertia, body.orientation),
    body.angularVelocity,
  );
  const finalMomentum = vecAdd(initialMomentum, vecScale(body.torque, dt));
  vecScale(finalMomentum, angularScale, finalMomentum);
  const midpointMomentum = vecScale(vecAdd(initialMomentum, finalMomentum), 0.5);

  // Integrate orientation against world-space angular momentum with a fixed,
  // deterministic midpoint iteration. This preserves torque-free momentum and
  // avoids the energy growth of explicit Euler's `-omega x Iomega` update.
  let predicted = quatIntegrateWorld(
    body.orientation,
    angularVelocityFromMomentum(body, body.orientation, midpointMomentum),
    dt,
  );
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const midpointOrientation = quatSlerp(body.orientation, predicted, 0.5);
    const midpointVelocity = angularVelocityFromMomentum(
      body,
      midpointOrientation,
      midpointMomentum,
    );
    predicted = quatIntegrateWorld(body.orientation, midpointVelocity, dt, predicted);
  }
  body.predictedOrientation.set(predicted);
  angularVelocityFromMomentum(
    body,
    body.predictedOrientation,
    finalMomentum,
    body.angularVelocity,
  );
}

function sampledParticlePosition(entry, time, out = vec3()) {
  const samples = entry.sweptPositions ?? [entry.previousPosition, entry.position];
  if (samples.length <= 1 || time <= 0) {
    out.set(samples[0]);
    return out;
  }
  if (time >= 1) {
    out.set(samples.at(-1));
    return out;
  }
  const scaled = time * (samples.length - 1);
  const left = Math.floor(scaled);
  const alpha = scaled - left;
  const start = samples[left];
  const end = samples[Math.min(samples.length - 1, left + 1)];
  out[0] = Math.fround(start[0] + (end[0] - start[0]) * alpha);
  out[1] = Math.fround(start[1] + (end[1] - start[1]) * alpha);
  out[2] = Math.fround(start[2] + (end[2] - start[2]) * alpha);
  return out;
}

function sweptSphereSegment(startA, endA, startB, endB, totalRadius) {
  const start = vecSub(startA, startB);
  const end = vecSub(endA, endB);
  const motion = vecSub(end, start);
  const quadraticA = vecDot(motion, motion);
  const quadraticC = vecDot(start, start) - totalRadius * totalRadius;
  if (quadraticA <= 1e-12 || quadraticC <= 0) return null;
  const quadraticB = 2 * vecDot(start, motion);
  const discriminant = quadraticB * quadraticB - 4 * quadraticA * quadraticC;
  if (discriminant < 0) return null;
  const root = Math.sqrt(discriminant);
  const inverseDenominator = 1 / (2 * quadraticA);
  const first = (-quadraticB - root) * inverseDenominator;
  const second = (-quadraticB + root) * inverseDenominator;
  const toi = first >= 0 && first <= 1
    ? first
    : second >= 0 && second <= 1
      ? second
      : null;
  if (toi === null) return null;
  const impactDelta = vecAdd(start, vecScale(motion, toi));
  const impactDistance = vecLength(impactDelta);
  return {
    toi,
    centerA: vecAdd(startA, vecScale(vecSub(endA, startA), toi)),
    centerB: vecAdd(startB, vecScale(vecSub(endB, startB), toi)),
    normal: impactDistance > 1e-7
      ? vecScale(impactDelta, 1 / impactDistance)
      : vec3(entryA.key < entryB.key ? [1, 0, 0] : [-1, 0, 0]),
  };
}

function sweptSphereContact(entryA, entryB, totalRadius) {
  const segmentCount = Math.max(
    1,
    (entryA.sweptPositions?.length ?? 2) - 1,
    (entryB.sweptPositions?.length ?? 2) - 1,
  );
  for (let segment = 0; segment < segmentCount; segment += 1) {
    const fromTime = segment / segmentCount;
    const toTime = (segment + 1) / segmentCount;
    const hit = sweptSphereSegment(
      sampledParticlePosition(entryA, fromTime),
      sampledParticlePosition(entryA, toTime),
      sampledParticlePosition(entryB, fromTime),
      sampledParticlePosition(entryB, toTime),
      totalRadius,
    );
    if (hit) {
      return {
        normal: hit.normal,
        toi: Math.fround((segment + hit.toi) / segmentCount),
        segmentCount,
        centerA: hit.centerA,
        centerB: hit.centerB,
      };
    }
  }
  return null;
}

function cloneTarget(target) {
  if (!target) return null;
  return {
    position: vec3(target.position),
    orientation: quat(target.orientation),
  };
}

function shiftSnapshot(snapshot, shift) {
  if (!snapshot) return;
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

export class ParticleRigidWorld {
  #collisionExclusionsByBody = new Map();

  constructor(options = {}) {
    this.options = normalizeWorldOptions(options);
    this.fixedDt = this.options.fixedDt;
    this.accumulator = 0;
    this.simulationTime = 0;
    this.stepCount = 0;
    this.disposed = false;
    this.bodies = new Map();
    this.bodyOrder = [];
    this.joints = new Map();
    this.jointOrder = [];
    this.surfaces = new Map();
    this.surfaceOrder = [];
    this.totalParticleCount = 0;
    this.contacts = [];
    this.stepListeners = [];
    this.postStepListeners = [];
    this.contactModifiers = [];
    this.originShiftListeners = [];
    this.collisionExclusions = new Set();
    this.telemetry = createStepTelemetry();
    this.spatialHash = new DeterministicSpatialHash({
      cellSize: this.options.spatialCellSize,
      maxEntriesPerCell: this.options.maxEntriesPerCell,
      maxCells: this.options.maxGridCells,
      maxCandidatePairs: this.options.maxCandidatePairs,
    });
    this.defaultSnapshot = null;
  }

  #assertAlive() {
    if (this.disposed) throw new Error('particle-rigid world has been disposed');
  }

  #refreshDefaultSnapshot() {
    this.defaultSnapshot = this.getSnapshot();
  }

  addBody(definition = {}) {
    this.#assertAlive();
    if (this.bodies.size >= this.options.maxBodies) {
      throw new RangeError(`body capacity exceeded (${this.options.maxBodies})`);
    }
    const id = requireId(definition.id, 'body');
    if (this.bodies.has(id)) throw new Error(`duplicate body id: ${id}`);
    const motionType = definition.motionType ?? 'dynamic';
    if (!['dynamic', 'static', 'kinematic'].includes(motionType)) {
      throw new TypeError(`body ${id} has unsupported motionType ${motionType}`);
    }
    const mass = definition.mass ?? 1;
    if (!Number.isFinite(mass) || mass <= 0) {
      throw new RangeError(`body ${id} mass must be finite and positive`);
    }
    const cloud = calculateParticleCloudMassProperties(definition.particleCloud, mass);
    if (this.totalParticleCount + cloud.count > this.options.maxParticles) {
      throw new RangeError(`particle capacity exceeded (${this.options.maxParticles})`);
    }
    const orientation = quat(definition.orientation);
    const position = vecAdd(
      vec3(definition.position),
      quatRotate(orientation, cloud.centerOfMass),
    );
    const material = normalizeMaterial(definition.material);
    const body = {
      id,
      index: this.bodies.size,
      motionType,
      position,
      previousPosition: vec3(position),
      predictedPosition: vec3(position),
      orientation,
      previousOrientation: quat(orientation),
      predictedOrientation: quat(orientation),
      linearVelocity: vec3(definition.linearVelocity),
      angularVelocity: vec3(definition.angularVelocity),
      force: vec3(),
      torque: vec3(),
      mass: Math.fround(mass),
      inverseMass: motionType === 'dynamic' ? Math.fround(1 / mass) : 0,
      inertia: cloud.inertia,
      inverseInertia: motionType === 'dynamic' ? cloud.inverseInertia : new Float32Array(9),
      particleCloud: cloud,
      material,
      collisionGroup: (definition.collisionGroup ?? 1) | 0,
      collisionMask: (definition.collisionMask ?? 0x7fffffff) | 0,
      groups: Object.freeze((Array.isArray(definition.groups)
        ? definition.groups
        : definition.groups === undefined
          ? []
          : [definition.groups]).map(String).sort()),
      metadata: { ...(definition.metadata ?? {}) },
      kinematicTarget: null,
      sleeping: false,
    };
    if (body.motionType === 'dynamic') bodyInverseInertiaWorld(body);
    this.bodies.set(id, body);
    this.bodyOrder = [...this.bodies.values()].sort(ID_COMPARE);
    this.totalParticleCount += cloud.count;
    this.#refreshDefaultSnapshot();
    return id;
  }

  addJoint(definition = {}) {
    this.#assertAlive();
    if (this.joints.size >= this.options.maxJoints) {
      throw new RangeError(`joint capacity exceeded (${this.options.maxJoints})`);
    }
    const joint = normalizeJointDefinition(definition, this.joints.size);
    if (this.joints.has(joint.id)) throw new Error(`duplicate joint id: ${joint.id}`);
    const bodyA = this.bodies.get(joint.bodyA);
    const bodyB = joint.bodyB === null ? null : this.bodies.get(joint.bodyB);
    if (!bodyA || (joint.bodyB !== null && !bodyB)) {
      throw new Error(`joint ${joint.id} references an unknown body`);
    }
    if (bodyA === bodyB) throw new Error(`joint ${joint.id} cannot connect a body to itself`);
    initializeJointRuntime(joint, bodyA, bodyB);
    this.joints.set(joint.id, joint);
    this.jointOrder = [...this.joints.values()].sort(ID_COMPARE);
    this.#refreshDefaultSnapshot();
    return joint.id;
  }

  addSurfaceCollider(collider) {
    this.#assertAlive();
    if (this.surfaces.size >= this.options.maxSurfaces) {
      throw new RangeError(`surface collider capacity exceeded (${this.options.maxSurfaces})`);
    }
    const normalized = normalizeSurfaceCollider(collider);
    if (this.surfaces.has(normalized.id)) throw new Error(`duplicate surface collider id: ${normalized.id}`);
    this.surfaces.set(normalized.id, normalized);
    this.surfaceOrder = [...this.surfaces.values()].sort(ID_COMPARE);
    return normalized.id;
  }

  getBody(id) {
    this.#assertAlive();
    const body = this.bodies.get(id);
    if (!body) throw new Error(`unknown body id: ${id}`);
    return body;
  }

  getJoint(id) {
    this.#assertAlive();
    const joint = this.joints.get(id);
    if (!joint) throw new Error(`unknown joint id: ${id}`);
    return joint;
  }

  setJointMotor(id, patch = {}) {
    const joint = this.getJoint(id);
    if (!joint.motor) {
      joint.motor = { enabled: true, targetVelocity: 0, targetPosition: null, maxImpulse: 0 };
    }
    if (patch.enabled !== undefined) joint.motor.enabled = Boolean(patch.enabled);
    for (const key of ['targetVelocity', 'targetPosition', 'maxImpulse']) {
      if (patch[key] !== undefined) {
        if (patch[key] !== null && !Number.isFinite(patch[key])) {
          throw new TypeError(`joint motor ${key} must be finite or null`);
        }
        joint.motor[key] = patch[key] === null ? null : Math.fround(Math.max(
          key === 'maxImpulse' ? 0 : -Infinity,
          patch[key],
        ));
      }
    }
  }

  applyForce(bodyId, force) {
    const body = this.getBody(bodyId);
    if (body.motionType !== 'dynamic') return;
    const value = vec3(force);
    body.force[0] = Math.fround(body.force[0] + value[0]);
    body.force[1] = Math.fround(body.force[1] + value[1]);
    body.force[2] = Math.fround(body.force[2] + value[2]);
  }

  applyTorque(bodyId, torque) {
    const body = this.getBody(bodyId);
    if (body.motionType !== 'dynamic') return;
    const value = vec3(torque);
    body.torque[0] = Math.fround(body.torque[0] + value[0]);
    body.torque[1] = Math.fround(body.torque[1] + value[1]);
    body.torque[2] = Math.fround(body.torque[2] + value[2]);
  }

  applyForceAtPoint(bodyId, force, point) {
    const body = this.getBody(bodyId);
    if (body.motionType !== 'dynamic') return;
    const value = vec3(force);
    this.applyForce(bodyId, value);
    this.applyTorque(bodyId, vecCross(vecSub(vec3(point), body.position), value));
  }

  setKinematicTarget(bodyId, target = {}) {
    const body = this.getBody(bodyId);
    if (body.motionType !== 'kinematic') {
      throw new Error(`body ${bodyId} is not kinematic`);
    }
    body.kinematicTarget = {
      position: vec3(target.position ?? body.position),
      orientation: quat(target.orientation ?? body.orientation),
    };
  }

  addStepListener(listener) {
    if (typeof listener !== 'function') throw new TypeError('step listener must be a function');
    this.stepListeners.push(listener);
    return () => {
      this.stepListeners = this.stepListeners.filter((candidate) => candidate !== listener);
    };
  }

  addPostStepListener(listener) {
    if (typeof listener !== 'function') throw new TypeError('post-step listener must be a function');
    this.postStepListeners.push(listener);
    return () => {
      this.postStepListeners = this.postStepListeners.filter((candidate) => candidate !== listener);
    };
  }

  addContactModifier(modifier) {
    if (typeof modifier !== 'function') throw new TypeError('contact modifier must be a function');
    this.contactModifiers.push(modifier);
    return () => {
      this.contactModifiers = this.contactModifiers.filter((candidate) => candidate !== modifier);
    };
  }

  addOriginShiftListener(listener) {
    if (typeof listener !== 'function') throw new TypeError('origin shift listener must be a function');
    this.originShiftListeners.push(listener);
    return () => {
      this.originShiftListeners = this.originShiftListeners.filter((candidate) => candidate !== listener);
    };
  }

  setBodiesCollide(bodyIdA, bodyIdB, enabled) {
    this.getBody(bodyIdA);
    this.getBody(bodyIdB);
    if (bodyIdA === bodyIdB) throw new Error('a body cannot be paired with itself');
    const first = bodyIdA < bodyIdB ? bodyIdA : bodyIdB;
    const second = bodyIdA < bodyIdB ? bodyIdB : bodyIdA;
    const key = `${first}|${second}`;
    const exclusions = this.#collisionExclusionsByBody.get(first);
    if (enabled) {
      this.collisionExclusions.delete(key);
      if (!exclusions) return;
      exclusions.delete(second);
      if (exclusions.size === 0) this.#collisionExclusionsByBody.delete(first);
      return;
    }
    this.collisionExclusions.add(key);
    if (exclusions) exclusions.add(second);
    else this.#collisionExclusionsByBody.set(first, new Set([second]));
  }

  #bodiesCanCollide(bodyA, bodyB) {
    if ((bodyA.collisionGroup & bodyB.collisionMask) === 0
      || (bodyB.collisionGroup & bodyA.collisionMask) === 0) return false;
    const first = bodyA.id < bodyB.id ? bodyA.id : bodyB.id;
    const second = bodyA.id < bodyB.id ? bodyB.id : bodyA.id;
    if (this.#collisionExclusionsByBody.get(first)?.has(second)) return false;
    for (const joint of this.jointOrder) {
      if (joint.collideConnected) continue;
      if ((joint.bodyA === bodyA.id && joint.bodyB === bodyB.id)
        || (joint.bodyA === bodyB.id && joint.bodyB === bodyA.id)) return false;
    }
    return true;
  }

  #broadphasePairAllowed = (entryA, entryB) => (
    this.#bodiesCanCollide(entryA.body, entryB.body)
  );

  #integrateBodies(dt) {
    for (const body of this.bodyOrder) {
      body.previousPosition.set(body.position);
      body.previousOrientation.set(body.orientation);
      body.predictedPosition.set(body.position);
      body.predictedOrientation.set(body.orientation);
      if (body.motionType === 'static') {
        body.linearVelocity.fill(0);
        body.angularVelocity.fill(0);
        continue;
      }
      if (body.motionType === 'kinematic') {
        const target = body.kinematicTarget ?? {
          position: body.position,
          orientation: body.orientation,
        };
        vecScale(vecSub(target.position, body.position), 1 / dt, body.linearVelocity);
        vecScale(quatDeltaVector(body.orientation, target.orientation), 1 / dt, body.angularVelocity);
        body.predictedPosition.set(target.position);
        body.predictedOrientation.set(target.orientation);
        continue;
      }

      body.linearVelocity[0] = Math.fround(body.linearVelocity[0]
        + (this.options.gravity[0] + body.force[0] * body.inverseMass) * dt);
      body.linearVelocity[1] = Math.fround(body.linearVelocity[1]
        + (this.options.gravity[1] + body.force[1] * body.inverseMass) * dt);
      body.linearVelocity[2] = Math.fround(body.linearVelocity[2]
        + (this.options.gravity[2] + body.force[2] * body.inverseMass) * dt);

      const linearScale = 1 / (1 + this.options.linearDamping * dt);
      const angularScale = 1 / (1 + this.options.angularDamping * dt);
      vecScale(body.linearVelocity, linearScale, body.linearVelocity);
      integrateAngularMomentum(body, dt, angularScale);
      vecClampLength(body.linearVelocity, this.options.maxLinearSpeed, body.linearVelocity);
      vecClampLength(body.angularVelocity, this.options.maxAngularSpeed, body.angularVelocity);
      body.predictedPosition[0] = Math.fround(body.position[0] + body.linearVelocity[0] * dt);
      body.predictedPosition[1] = Math.fround(body.position[1] + body.linearVelocity[1] * dt);
      body.predictedPosition[2] = Math.fround(body.position[2] + body.linearVelocity[2] * dt);
      body.force.fill(0);
      body.torque.fill(0);
    }
  }

  #particleEntries() {
    const entries = [];
    for (const body of this.bodyOrder) {
      const cloud = body.particleCloud;
      const angularDisplacement = vecLength(quatDeltaVector(
        body.previousOrientation,
        body.predictedOrientation,
      ));
      const segmentCount = Math.max(1, Math.ceil(angularDisplacement / 0.125));
      const motionSamples = Array.from({ length: segmentCount + 1 }, (_, index) => {
        const alpha = index / segmentCount;
        return {
          position: vec3([
            body.previousPosition[0] + (body.predictedPosition[0] - body.previousPosition[0]) * alpha,
            body.previousPosition[1] + (body.predictedPosition[1] - body.previousPosition[1]) * alpha,
            body.previousPosition[2] + (body.predictedPosition[2] - body.previousPosition[2]) * alpha,
          ]),
          orientation: quatSlerp(body.previousOrientation, body.predictedOrientation, alpha),
        };
      });
      for (let index = 0; index < cloud.count; index += 1) {
        const offset = index * 3;
        const local = cloud.positions.subarray(offset, offset + 3);
        const sweptPositions = motionSamples.map((sample) => vecAdd(
          sample.position,
          quatRotate(sample.orientation, local),
        ));
        entries.push({
          key: `${body.id}#${String(index).padStart(5, '0')}`,
          bodyId: body.id,
          body,
          particleIndex: index,
          tag: cloud.tags[index],
          radius: cloud.radii[index],
          material: cloud.materials[index] ? normalizeMaterial({ ...body.material, ...cloud.materials[index] }) : body.material,
          previousPosition: sweptPositions[0],
          position: sweptPositions.at(-1),
          sweptPositions,
        });
      }
    }
    return entries;
  }

  #particleContacts(entries) {
    this.spatialHash.build(entries);
    const contacts = [];
    for (const [entryA, entryB] of this.spatialHash.candidatePairs(this.#broadphasePairAllowed)) {
      const delta = vecSub(entryA.position, entryB.position);
      const distance = vecLength(delta);
      const totalRadius = entryA.radius + entryB.radius;
      const separation = distance - totalRadius;
      const swept = separation > this.options.precontactMargin
        ? sweptSphereContact(entryA, entryB, totalRadius)
        : null;
      if (separation > this.options.precontactMargin && !swept) continue;
      const normal = swept?.normal ?? (distance > 1e-7
        ? vecScale(delta, 1 / distance)
        : vec3(entryA.key < entryB.key ? [1, 0, 0] : [-1, 0, 0]));
      const pointA = vecAdd(swept?.centerA ?? entryA.position, vecScale(normal, -entryA.radius));
      const pointB = vecAdd(swept?.centerB ?? entryB.position, vecScale(normal, entryB.radius));
      const material = combineMaterial(entryA.material, entryB.material);
      contacts.push({
        id: `particle:${entryA.key}|${entryB.key}`,
        type: 'particle',
        bodyA: entryA.body,
        bodyB: entryB.body,
        particleIndexA: entryA.particleIndex,
        particleIndexB: entryB.particleIndex,
        particleTagA: entryA.tag,
        particleTagB: entryB.tag,
        pointA,
        pointB,
        normal,
        penetration: Math.fround(swept ? 0 : Math.max(0, -separation)),
        separation: Math.fround(swept ? 0 : separation),
        surfaceVelocity: vec3(),
        ...material,
        metadata: swept ? {
          swept: true,
          toi: swept.toi,
          ccdSegments: swept.segmentCount,
        } : null,
      });
    }
    return contacts;
  }

  #surfaceContacts(entries, telemetry) {
    const contacts = [];
    outer: for (const entry of entries) {
      if (entry.body.motionType !== 'dynamic') continue;
      for (const surface of this.surfaceOrder) {
        if (telemetry.surfaceQueries >= this.options.maxSurfaceQueries) {
          telemetry.overflows.surfaceQueries += 1;
          break outer;
        }
        const query = {
          from: entry.previousPosition,
          to: entry.position,
          center: entry.position,
          radius: entry.radius,
          bodyId: entry.bodyId,
          particleIndex: entry.particleIndex,
          dt: this.fixedDt,
        };
        let sample = surface.sweepSphere ? surface.sweepSphere(query) : null;
        telemetry.surfaceQueries += 1;
        if ((!sample || (!sample.hit && sample.signedDistance === undefined)) && surface.sampleSphere) {
          if (telemetry.surfaceQueries >= this.options.maxSurfaceQueries) {
            telemetry.overflows.surfaceQueries += 1;
            break outer;
          }
          sample = surface.sampleSphere(query);
          telemetry.surfaceQueries += 1;
        }
        if (!sample || (!sample.hit
          && !(Number.isFinite(sample.signedDistance)
            && sample.signedDistance <= this.options.precontactMargin))) continue;
        const normal = vec3(sample.normal ?? [0, 1, 0]);
        // The impulse lever arm must be on the predicted body, even when a
        // sweep reports an earlier time-of-impact point.
        const point = vecAdd(entry.position, vecScale(normal, -entry.radius));
        const surfaceMaterial = normalizeMaterial({
          friction: sample.friction ?? entry.material.friction,
          restitution: sample.restitution ?? entry.material.restitution,
          rollingFriction: sample.rollingFriction ?? entry.material.rollingFriction,
        });
        const material = combineMaterial(entry.material, surfaceMaterial);
        const signedDistance = sample.signedDistance ?? -(sample.penetration ?? 0);
        contacts.push({
          id: `surface:${surface.id}|${entry.key}`,
          type: 'surface',
          surfaceId: surface.id,
          bodyA: entry.body,
          bodyB: null,
          particleIndexA: entry.particleIndex,
          particleIndexB: null,
          particleTagA: entry.tag,
          particleTagB: null,
          pointA: point,
          pointB: point,
          normal,
          penetration: Math.fround(Math.max(0, sample.penetration ?? -signedDistance)),
          separation: Math.fround(signedDistance),
          surfaceVelocity: vec3(sample.surfaceVelocity),
          tangentLongitudinal: sample.tangentLongitudinal ? vec3(sample.tangentLongitudinal) : null,
          ...material,
          metadata: {
            ...(surface.metadata ?? {}),
            ...(sample.metadata ?? {}),
            sampledSurfacePoint: sample.point ? Array.from(sample.point) : null,
            swept: Boolean(sample.swept),
            toi: sample.toi ?? null,
          },
        });
      }
    }
    return contacts;
  }

  #modifyAndBoundContacts(rawContacts, telemetry) {
    const contacts = [];
    for (const contact of rawContacts.sort(ID_COMPARE)) {
      let disabled = false;
      for (const modifier of this.contactModifiers) {
        const patch = modifier(contact, {
          dt: this.fixedDt,
          step: this.stepCount,
          world: this,
        });
        if (patch?.disabled) {
          disabled = true;
          break;
        }
        if (patch) {
          for (const key of [
            'muLongitudinal',
            'muLateral',
            'friction',
            'restitution',
            'rollingFriction',
            'metadata',
          ]) {
            if (patch[key] !== undefined) contact[key] = patch[key];
          }
          if (patch.tangentLongitudinal) contact.tangentLongitudinal = vec3(patch.tangentLongitudinal);
          if (patch.surfaceVelocity) contact.surfaceVelocity = vec3(patch.surfaceVelocity);
        }
      }
      if (!disabled) contacts.push(initializeContact(contact));
    }
    if (contacts.length > this.options.maxContacts) {
      telemetry.overflows.contacts = contacts.length - this.options.maxContacts;
      return contacts.slice(0, this.options.maxContacts);
    }
    return contacts;
  }

  #commitAndValidate() {
    for (const body of this.bodyOrder) {
      body.position.set(body.predictedPosition);
      body.orientation.set(body.predictedOrientation);
      if (!finiteArray(body.position)
        || !finiteArray(body.orientation)
        || !finiteArray(body.linearVelocity)
        || !finiteArray(body.angularVelocity)) {
        throw new Error(`non-finite physics state detected in body ${body.id}`);
      }
    }
  }

  #updateTelemetry(telemetry) {
    telemetry.step = this.stepCount;
    telemetry.simulationTime = this.simulationTime;
    telemetry.bodyCount = this.bodies.size;
    telemetry.particleCount = this.totalParticleCount;
    telemetry.jointCount = this.joints.size;
    telemetry.surfaceCount = this.surfaces.size;
    telemetry.contactCount = this.contacts.length;
    telemetry.particleContactCount = this.contacts.filter((contact) => contact.type === 'particle').length;
    telemetry.surfaceContactCount = telemetry.contactCount - telemetry.particleContactCount;
    telemetry.solverIterations = this.options.solverIterations;
    telemetry.maximumPenetration = this.contacts.reduce(
      (maximum, contact) => Math.max(maximum, contact.penetration),
      0,
    );
    for (const body of this.bodyOrder) {
      const linearSpeed = vecLength(body.linearVelocity);
      const angularSpeed = vecLength(body.angularVelocity);
      telemetry.maximumLinearSpeed = Math.max(telemetry.maximumLinearSpeed, linearSpeed);
      telemetry.maximumAngularSpeed = Math.max(telemetry.maximumAngularSpeed, angularSpeed);
      if (body.motionType === 'dynamic') {
        const linearEnergy = 0.5 * body.mass * linearSpeed * linearSpeed;
        const angularMomentum = mat3MulVec(bodyInertiaWorld(body), body.angularVelocity);
        const angularEnergy = 0.5 * vecDot(body.angularVelocity, angularMomentum);
        telemetry.kineticEnergy += linearEnergy + angularEnergy;
      }
    }
    const grid = this.spatialHash.getDiagnostics();
    telemetry.overflows.gridCells = grid.overflowedCells;
    telemetry.overflows.gridReferences = grid.overflowedReferences;
    telemetry.overflows.candidatePairs = grid.droppedCandidatePairs;
    telemetry.overflows.overflowed = Object.values(telemetry.overflows)
      .some((value) => typeof value === 'number' && value > 0);
    this.telemetry = telemetry;
    if (this.options.throwOnOverflow && telemetry.overflows.overflowed) {
      throw new RangeError(`physics capacity overflow: ${JSON.stringify(telemetry.overflows)}`);
    }
  }

  #stepFixed(controlFrame) {
    const dt = this.fixedDt;
    const telemetry = createStepTelemetry();
    for (const listener of this.stepListeners) {
      listener({ world: this, dt, step: this.stepCount, controlFrame });
    }
    for (const joint of this.jointOrder) {
      beginJointStep(joint, this.bodies.get(joint.bodyA), joint.bodyB ? this.bodies.get(joint.bodyB) : null, dt);
    }
    this.#integrateBodies(dt);
    const entries = this.#particleEntries();
    const particleContacts = this.#particleContacts(entries);
    const surfaceContacts = this.#surfaceContacts(entries, telemetry);
    this.contacts = this.#modifyAndBoundContacts([...particleContacts, ...surfaceContacts], telemetry);

    const solverOptions = {
      ...this.options,
      maxPositionCorrection: Math.max(
        0.08,
        this.options.maxLinearSpeed * dt + this.options.precontactMargin,
      ),
    };
    for (let iteration = 0; iteration < this.options.solverIterations; iteration += 1) {
      for (const joint of this.jointOrder) {
        solveJointVelocity(
          joint,
          this.bodies.get(joint.bodyA),
          joint.bodyB ? this.bodies.get(joint.bodyB) : null,
          dt,
          solverOptions,
        );
      }
      for (const contact of this.contacts) solveContactVelocity(contact, dt, solverOptions);
    }
    // Re-evaluate anchors/axes after each positional pass. A single pass can
    // leave compliant compound rigs beyond a travel stop after a hard landing.
    const jointPositionIterations = Math.min(8, this.options.solverIterations);
    for (let iteration = 0; iteration < jointPositionIterations; iteration += 1) {
      for (const joint of this.jointOrder) {
        correctJointPosition(
          joint,
          this.bodies.get(joint.bodyA),
          joint.bodyB ? this.bodies.get(joint.bodyB) : null,
        );
      }
    }
    // Hard travel stops win the final positional projection so later compound
    // joint corrections cannot leave the published rig outside its limits.
    for (let iteration = 0; iteration < 4; iteration += 1) {
      for (const joint of this.jointOrder) {
        correctJointLimitPosition(
          joint,
          this.bodies.get(joint.bodyA),
          joint.bodyB ? this.bodies.get(joint.bodyB) : null,
        );
      }
    }
    for (const contact of this.contacts) correctContactPosition(contact, solverOptions);
    this.#commitAndValidate();
    this.stepCount += 1;
    this.simulationTime = Math.fround(this.simulationTime + dt);
    this.#updateTelemetry(telemetry);
    for (const listener of this.postStepListeners) {
      listener({
        world: this,
        dt,
        step: this.stepCount,
        controlFrame,
        contacts: this.contacts,
        telemetry: cloneTelemetry(this.telemetry),
      });
    }
  }

  stepFrame(frameDt, controlFrame = null) {
    this.#assertAlive();
    if (!Number.isFinite(frameDt) || frameDt < 0) {
      throw new RangeError('frameDt must be finite and non-negative');
    }
    const accepted = Math.min(frameDt, this.options.maxFrameDt);
    let droppedTime = Math.max(0, frameDt - accepted);
    this.accumulator += accepted;
    const maximumAccumulator = this.fixedDt * this.options.maxSubSteps;
    if (this.accumulator > maximumAccumulator) {
      droppedTime += this.accumulator - maximumAccumulator;
      this.accumulator = maximumAccumulator;
    }
    let substeps = 0;
    const accumulatorEpsilon = this.fixedDt * 1e-6;
    while (this.accumulator + accumulatorEpsilon >= this.fixedDt
      && substeps < this.options.maxSubSteps) {
      this.#stepFixed(controlFrame);
      this.accumulator = Math.max(0, this.accumulator - this.fixedDt);
      if (this.accumulator < accumulatorEpsilon) this.accumulator = 0;
      substeps += 1;
    }
    const alpha = Math.min(1, Math.max(0, this.accumulator / this.fixedDt));
    this.telemetry.accumulator = this.accumulator;
    this.telemetry.interpolationAlpha = alpha;
    this.telemetry.frameSubsteps = substeps;
    this.telemetry.droppedFrameTime = droppedTime;
    return {
      substeps,
      alpha,
      droppedTime,
      telemetry: cloneTelemetry(this.telemetry),
    };
  }

  getInterpolatedTransforms(alpha = this.accumulator / this.fixedDt) {
    this.#assertAlive();
    const blend = Math.min(1, Math.max(0, alpha));
    return this.bodyOrder.map((body) => ({
      id: body.id,
      position: vec3([
        body.previousPosition[0] + (body.position[0] - body.previousPosition[0]) * blend,
        body.previousPosition[1] + (body.position[1] - body.previousPosition[1]) * blend,
        body.previousPosition[2] + (body.position[2] - body.previousPosition[2]) * blend,
      ]),
      orientation: quatSlerp(body.previousOrientation, body.orientation, blend),
    }));
  }

  getParticleTransforms(interpolatedAlpha = null) {
    const bodyTransforms = interpolatedAlpha === null
      ? new Map(this.bodyOrder.map((body) => [body.id, {
          position: body.position,
          orientation: body.orientation,
        }]))
      : new Map(this.getInterpolatedTransforms(interpolatedAlpha).map((transform) => [transform.id, transform]));
    const particles = [];
    for (const body of this.bodyOrder) {
      const transform = bodyTransforms.get(body.id);
      for (let index = 0; index < body.particleCloud.count; index += 1) {
        const local = body.particleCloud.positions.subarray(index * 3, index * 3 + 3);
        particles.push({
          id: `${body.id}#${index}`,
          bodyId: body.id,
          particleIndex: index,
          position: vecAdd(transform.position, quatRotate(transform.orientation, local)),
          radius: body.particleCloud.radii[index],
          tag: body.particleCloud.tags[index],
        });
      }
    }
    return particles;
  }

  getContacts() {
    return this.contacts.map(publicContact);
  }

  getTelemetry() {
    return cloneTelemetry(this.telemetry);
  }

  getSnapshot() {
    this.#assertAlive();
    return {
      version: 1,
      fixedDt: this.fixedDt,
      simulationTime: this.simulationTime,
      stepCount: this.stepCount,
      accumulator: this.accumulator,
      bodies: this.bodyOrder.map((body) => ({
        id: body.id,
        position: Array.from(body.position),
        previousPosition: Array.from(body.previousPosition),
        orientation: Array.from(body.orientation),
        previousOrientation: Array.from(body.previousOrientation),
        linearVelocity: Array.from(body.linearVelocity),
        angularVelocity: Array.from(body.angularVelocity),
        force: Array.from(body.force),
        torque: Array.from(body.torque),
        kinematicTarget: body.kinematicTarget
          ? {
              position: Array.from(body.kinematicTarget.position),
              orientation: Array.from(body.kinematicTarget.orientation),
            }
          : null,
      })),
      joints: this.jointOrder.map(snapshotJoint),
    };
  }

  reset(snapshot = this.defaultSnapshot) {
    this.#assertAlive();
    if (!snapshot || snapshot.version !== 1) throw new TypeError('a version 1 physics snapshot is required');
    const ids = snapshot.bodies.map((body) => body.id).sort();
    const currentIds = this.bodyOrder.map((body) => body.id).sort();
    if (JSON.stringify(ids) !== JSON.stringify(currentIds)) {
      throw new Error('snapshot body ids do not match this world');
    }
    for (const state of snapshot.bodies) {
      const body = this.bodies.get(state.id);
      body.position.set(state.position);
      body.previousPosition.set(state.previousPosition ?? state.position);
      body.predictedPosition.set(state.position);
      body.orientation.set(state.orientation);
      body.previousOrientation.set(state.previousOrientation ?? state.orientation);
      body.predictedOrientation.set(state.orientation);
      body.linearVelocity.set(state.linearVelocity);
      body.angularVelocity.set(state.angularVelocity);
      body.force.set(state.force ?? [0, 0, 0]);
      body.torque.set(state.torque ?? [0, 0, 0]);
      body.kinematicTarget = cloneTarget(state.kinematicTarget);
    }
    for (const state of snapshot.joints ?? []) {
      const joint = this.joints.get(state.id);
      if (!joint) throw new Error(`snapshot references unknown joint ${state.id}`);
      joint.enabled = state.enabled;
      if (state.motor) joint.motor = { ...state.motor };
      joint.runtime = {
        ...joint.runtime,
        ...state.runtime,
        referenceA: vec3(state.runtime.referenceA),
        referenceB: vec3(state.runtime.referenceB),
        initialRelativeOrientation: quat(state.runtime.initialRelativeOrientation),
      };
    }
    this.simulationTime = Math.fround(snapshot.simulationTime ?? 0);
    this.stepCount = snapshot.stepCount ?? 0;
    this.accumulator = snapshot.accumulator ?? 0;
    this.contacts = [];
    this.telemetry = createStepTelemetry();
  }

  captureInitialState() {
    this.defaultSnapshot = this.getSnapshot();
    return this.defaultSnapshot;
  }

  shiftOrigin(offset) {
    const shift = vec3(offset);
    for (const body of this.bodyOrder) {
      for (const position of [body.position, body.previousPosition, body.predictedPosition]) {
        position[0] = Math.fround(position[0] - shift[0]);
        position[1] = Math.fround(position[1] - shift[1]);
        position[2] = Math.fround(position[2] - shift[2]);
      }
      if (body.kinematicTarget) {
        body.kinematicTarget.position[0] = Math.fround(body.kinematicTarget.position[0] - shift[0]);
        body.kinematicTarget.position[1] = Math.fround(body.kinematicTarget.position[1] - shift[1]);
        body.kinematicTarget.position[2] = Math.fround(body.kinematicTarget.position[2] - shift[2]);
      }
    }
    for (const joint of this.jointOrder) {
      if (joint.bodyB === null) {
        joint.localAnchorB[0] = Math.fround(joint.localAnchorB[0] - shift[0]);
        joint.localAnchorB[1] = Math.fround(joint.localAnchorB[1] - shift[1]);
        joint.localAnchorB[2] = Math.fround(joint.localAnchorB[2] - shift[2]);
      }
    }
    shiftSnapshot(this.defaultSnapshot, shift);
    this.contacts = [];
    for (const listener of this.originShiftListeners) listener(vec3(shift));
  }

  dispose() {
    if (this.disposed) return;
    this.bodies.clear();
    this.joints.clear();
    this.surfaces.clear();
    this.bodyOrder = [];
    this.jointOrder = [];
    this.surfaceOrder = [];
    this.contacts = [];
    this.stepListeners = [];
    this.postStepListeners = [];
    this.contactModifiers = [];
    this.originShiftListeners = [];
    this.collisionExclusions.clear();
    this.#collisionExclusionsByBody.clear();
    this.spatialHash.clear();
    this.disposed = true;
  }
}

export function createParticleRigidWorld(options = {}) {
  return new ParticleRigidWorld(options);
}
