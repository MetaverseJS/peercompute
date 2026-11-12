import { prepareGeneratedMeshView, fitGeneratedMeshView } from '../../../shared/world/GeneratedMeshView.js';
import { normalizeResidentAvatar, sameResidentAvatar } from '../../../../peercompute/src/peercompute/agents/ResidentAvatar.js';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { WorldResidentMotion } from '../../../shared/agents/WorldResidentMotion.js';
import { SpeechBubbleLayer } from '../../../shared/world/SpeechBubbleLayer.js';
import { MOTOR_DYNAMICS as MOTOR } from '../../../shared/agents/motor/motorContracts.js';
import { CubeResidentMotor } from './CubeResidentMotor.js';
import { createCubeNavigationSensors } from './CubeNavigationSensors.js';
import { createCubeSpatialTargets } from './CubeSpatialTargets.js';
import { ResidentViewCapture } from '../../../shared/world/ResidentViewCapture.js';

const HALF_SIZE = 3;
const MAX_COORDINATE = 1_000_000;
const states = new Set(['idle', 'thinking', 'speaking', 'paused']);
const boundedText = (value, maximum, label) => {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || /[\u0000-\u001f]/.test(value)) {
    throw new TypeError(`Invalid agent ${label}`);
  }
  return value;
};

export function normalizeCubeAgentPosition(value) {
  if (!Array.isArray(value) || value.length !== 3
      || value.some((coordinate) => typeof coordinate !== 'number' || !Number.isFinite(coordinate) || Math.abs(coordinate) > MAX_COORDINATE)) {
    throw new TypeError('Agent position must contain three bounded coordinates');
  }
  return [...value];
}

function normalizeDescriptor(value) {
  if (!value || typeof value !== 'object') throw new TypeError('Invalid agent descriptor');
  const key = boundedText(value.key, 300, 'key');
  const agentId = boundedText(value.agentId, 128, 'ID');
  const ownerPeerId = value.local && !value.ownerPeerId ? '' : boundedText(value.ownerPeerId, 128, 'owner');
  const name = boundedText(value.name, 240, 'name');
  if (!/^#[a-f\d]{6}$/i.test(value.color) || !states.has(value.status) || typeof value.local !== 'boolean') {
    throw new TypeError('Invalid agent appearance');
  }
  if (value.caption !== undefined && (typeof value.caption !== 'string' || value.caption.length > 4096)) {
    throw new TypeError('Invalid agent caption');
  }
  if (value.movement !== undefined && !['roam', 'stationary', 'follow'].includes(value.movement)) throw new TypeError('Invalid resident movement preference');
  return { key, agentId, ownerPeerId, name, color: value.color, status: value.status, local: value.local,
    position: normalizeCubeAgentPosition(value.position), caption: value.caption ?? '', shared: value.shared === true,
    ...(value.avatar ? { avatar: normalizeResidentAvatar(value.avatar) } : {}),
    ...(value.movement !== undefined ? { movement: value.movement } : {}) };
}

function textSprite(text) {
  const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
  if (!context) throw new Error('Agent labels require a canvas text context');
  const font = '28px monospace'; context.font = font;
  const lines = []; let line = '';
  for (const character of Array.from(text.replace(/\s+/g, ' ').slice(0, 160))) {
    if (context.measureText(line + character).width > 492) { lines.push(line); line = ''; }
    line += character;
  }
  if (line) lines.push(line);
  if (lines.length > 2) lines[1] = lines[1].slice(0, -3) + '…';
  const shown = lines.slice(0, 2);
  canvas.width = Math.ceil(Math.max(...shown.map(value => context.measureText(value).width), 1)) + 20;
  canvas.height = shown.length * 34 + 20;
  context.fillStyle = '#061613'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#a0ffce'; context.lineWidth = 2; context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  context.fillStyle = '#dcffe9'; context.font = font;
  context.textAlign = 'center'; context.textBaseline = 'middle';
  shown.forEach((value, index) => context.fillText(value, canvas.width / 2, canvas.height / 2 + (index - (shown.length - 1) / 2) * 34));
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false, transparent: false }));
  sprite.scale.set(canvas.width / 64, canvas.height / 64, 1); sprite.renderOrder = 1000;
  sprite.position.y = 4.5;
  return sprite;
}

function disposeSprite(sprite) {
  if (!sprite) return;
  sprite.removeFromParent();
  sprite.material.map?.dispose();
  sprite.material.dispose();
}

/** Scene bodies only. The shared host owns persistence, authority and conversations. */
export class CubeAgentLayer {
  constructor({ scene, physics, getPlayerPosition, onSelect, captionDurationMs = 12_000, maximumAgents = 64,
    motionFactory = (options) => new WorldResidentMotion(options), remoteInterpolationSeconds = 5,
    getParticipants = () => [] } = {}) {
    if (!scene?.scene?.isScene || !scene.camera?.isCamera || !scene.renderer?.domElement
        || !physics?.world || typeof getPlayerPosition !== 'function') throw new TypeError('Cube agent scene dependencies are required');
    if (!Number.isInteger(maximumAgents) || maximumAgents < 1 || maximumAgents > 256
        || !Number.isInteger(captionDurationMs) || captionDurationMs < 1 || captionDurationMs > 60_000
        || !Number.isFinite(remoteInterpolationSeconds) || remoteInterpolationSeconds < 0.1 || remoteInterpolationSeconds > 15) throw new RangeError('Invalid agent layer limits');
    if (typeof motionFactory !== 'function') throw new TypeError('A resident motion factory is required');
    if (typeof getParticipants !== 'function') throw new TypeError('World participants must be observable');
    Object.assign(this, { scene, physics, getPlayerPosition, getParticipants, onSelect, captionDurationMs, maximumAgents, motionFactory, remoteInterpolationSeconds });
    this.entries = new Map(); this.closed = false; this.selectedKey = null; this.intentRevision = 0;
    this.navigationSensors = createCubeNavigationSensors({ physics, getEntries: () => this.entries });
    this.spatialTargets = createCubeSpatialTargets({ physics, getEntries: () => this.entries, sensors: this.navigationSensors,
      getBounds: () => Number.isFinite(this.scene.gridSize) && this.scene.gridSize > 7
        ? { min: [-this.scene.gridSize / 2 + 3.5, -this.scene.gridSize / 2 + 3.5], max: [this.scene.gridSize / 2 - 3.5, this.scene.gridSize / 2 - 3.5] } : null,
      groundHeight: (x, z) => this.groundHeight(x, z) });
    this.motor = new CubeResidentMotor({ getEntries: () => this.entries,
      observe: key => this.observeParticipants(key, { physical: true }),
      validateSpatialTarget: (key, position) => this.validateSpatialTarget(key, position),
      senseNavigation: (key, target) => this.navigationSensors.sample(key, target) });
    this.onPhysicsStep = () => this.beforePhysics();
    this.physics.world.addEventListener('preStep', this.onPhysicsStep);
    this.onNavigationGeometryChanged = () => this.motor.invalidateNavigation();
    this.physics.world.addEventListener('addBody', this.onNavigationGeometryChanged);
    this.physics.world.addEventListener('removeBody', this.onNavigationGeometryChanged);
    this.captions = new SpeechBubbleLayer({ scene: scene.scene, camera: scene.camera,
      getAnchor: key => {
        const entry = this.entries.get(key); if (!entry) return null;
        const position = entry.mesh.getWorldPosition(new THREE.Vector3());
        if (entry.avatarView) position.y += entry.avatarView.renderedHeight - HALF_SIZE * 2;
        return position;
      }, durationMs: captionDurationMs, maximum: maximumAgents, offsetY: 6 });
    this.group = new THREE.Group(); this.group.name = 'CubeChat agents'; scene.scene.add(this.group);
    this.geometry = new THREE.BoxGeometry(6, 6, 6);
    this.edgeGeometry = new THREE.EdgesGeometry(this.geometry);
    this.raycaster = new THREE.Raycaster(); this.raycaster.far = 300;
    this.canvas = scene.renderer.domElement;
    this.originalTabIndex = this.canvas.getAttribute('tabindex');
    if (this.canvas.tabIndex < 0) this.canvas.tabIndex = 0;
    this.pointerStart = null;
    this.onPointerDown = (event) => { this.pointerStart = { x: event.clientX, y: event.clientY }; };
    this.onClick = (event) => {
      if (event.button !== 0 || this.closed) return;
      if (this.pointerStart && Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y) > 8) return;
      const key = this.pick(event.clientX, event.clientY);
      if (!key) return;
      event.preventDefault(); event.stopImmediatePropagation();
      this.select(key);
    };
    this.onKeyDown = (event) => {
      if (event.key !== 'Enter' || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.isComposing || event.defaultPrevented) return;
      const bounds = this.canvas.getBoundingClientRect();
      const key = this.pick(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      if (!key) return;
      event.preventDefault(); event.stopImmediatePropagation(); this.select(key);
    };
    this.canvas.addEventListener('pointerdown', this.onPointerDown, true);
    this.canvas.addEventListener('click', this.onClick, true);
    this.canvas.addEventListener('keydown', this.onKeyDown, true);
  }

  normalizePosition(input) { return normalizeCubeAgentPosition(input); }

  groundHeight(x, z) {
    if (typeof this.scene.getGroundHeight === 'function') return this.scene.getGroundHeight(x, z);
    if (!this.scene.floor) return 0;
    this.scene.floor.updateWorldMatrix(true, true);
    const ground = new THREE.Raycaster(new THREE.Vector3(x, MAX_COORDINATE, z), new THREE.Vector3(0, -1, 0), 0, MAX_COORDINATE * 2);
    return ground.intersectObject(this.scene.floor, true)[0]?.point.y ?? 0;
  }

  getPosition(key) { return this.entries.get(key)?.mesh.position.toArray() ?? null; }

  setMovement(key, mode, { restore = false } = {}) {
    const entry = this.entries.get(key);
    if (!entry?.descriptor.local) throw new Error('Only the resident owner can control movement');
    if (!['stationary', 'follow', 'roam'].includes(mode)) throw new TypeError('Unknown movement mode');
    if (mode === 'follow') {
      const owner = this.observe(key).participants.find(p => p.peerId === entry.descriptor.ownerPeerId && p.kind === 'human');
      if (!owner && !restore) throw new Error('The owner is not currently observed');
      this.motor.setIntent(key, { type: 'follow', targetId: owner?.id ?? `human:${entry.descriptor.ownerPeerId}` }, { restoredOwner: restore });
    } else if (mode === 'stationary') this.motor.setIntent(key, { type: 'stop' });
    else this.motor.clear(key);
    entry.motion.setMode(mode); entry.movement = mode;
    entry.intentRevision = ++this.intentRevision;
    return mode;
  }

  setMotor(service) { this.motor.setService(service); }
  subscribeOutcomes(listener) { return this.motor.subscribe(listener); }
  setIntent(key, intent) {
    const result = this.motor.setIntent(key, intent);
    this.entries.get(key).intentRevision = ++this.intentRevision;
    return result;
  }
  getMotorStatus() { return this.motor.getStatus(); }
  getResidentMotorStatus(key) { return this.motor.getResidentStatus(key); }
  validateSpatialTarget(key, position) { return this.spatialTargets.validate(key, position); }

  /** Shared participant admission; motor reads omit public obstacle/terrain work. */
  observeParticipants(key, { requesterPeerId, physical = false } = {}) {
    const entry = this.entries.get(key); if (!entry) throw new Error('Resident body is unavailable');
    const position = entry.mesh.position.toArray(), participants = [], seen = new Set();
    const append = value => {
      if (!value || typeof value.id !== 'string' || value.id.length > 300 || seen.has(value.id)) return;
      let pose; try { pose = this.normalizePosition(value.position); } catch { return; }
      const relativePosition = pose.map((v, i) => v - position[i]), distance = Math.hypot(relativePosition[0], relativePosition[2]);
      if (distance > 250) return;
      const velocity = Array.isArray(value.velocity) && value.velocity.length === 3 && value.velocity.every(Number.isFinite) ? value.velocity.map(v => Math.max(-50, Math.min(50, v))) : [0, 0, 0];
      participants.push({ id: value.id, kind: value.kind, name: String(value.name ?? 'Anonymous').slice(0, 120),
        ...(value.peerId ? { peerId: value.peerId } : {}), ...(value.agentId ? { agentId: value.agentId, ownerPeerId: value.ownerPeerId } : {}),
        position: pose, relativePosition, velocity, distance }); seen.add(value.id);
    };
    for (const person of this.getParticipants().slice(0, 128)) append({ ...person, kind: 'human' });
    for (const [otherKey, other] of this.entries) if (otherKey !== key && (!other.descriptor.local || other.descriptor.shared)) append({
      id: `resident:${other.descriptor.ownerPeerId}:${other.descriptor.agentId}`, kind: 'resident', name: other.descriptor.name,
      ownerPeerId: other.descriptor.ownerPeerId, agentId: other.descriptor.agentId,
      position: other.mesh.position.toArray(), velocity: other.body.velocity.toArray() });
    participants.sort((a, b) => Number(b.peerId === requesterPeerId) - Number(a.peerId === requesterPeerId) || a.distance - b.distance || a.id.localeCompare(b.id));
    const visible = participants.slice(0, 16);
    if (!physical) return { position, participants: visible };
    // Preserve public visibility/range admission before resolving the chosen
    // participants to current physics coordinates for the local controller.
    const physicalPosition = entry.body.position.toArray();
    return { position: physicalPosition, participants: visible.map(person => {
      const body = person.kind === 'human'
        ? this.physics.getPlayerBody?.(person.peerId) ?? this.physics.bodies?.get(person.peerId)
        : [...this.entries.values()].find(other => other.descriptor.agentId === person.agentId
          && other.descriptor.ownerPeerId === person.ownerPeerId)?.body;
      const pose = body?.position.toArray() ?? person.position;
      const relativePosition = pose.map((value, index) => value - physicalPosition[index]);
      return { ...person, position: pose, relativePosition, distance: Math.hypot(relativePosition[0], relativePosition[2]) };
    }) };
  }

  nearbyObstacleBodies(key) {
    const entry = this.entries.get(key); if (!entry) throw new Error('Resident body is unavailable');
    const position = entry.mesh.position;
    const privateBodies = new Set([...this.entries.values()].filter(other => other.descriptor.local && !other.descriptor.shared).map(other => other.body));
    const distance = body => Math.hypot(body.position.x - position.x, body.position.z - position.z);
    return this.physics.world.bodies.filter(body => body !== entry.body && !privateBodies.has(body)
      && body.shapes.some(shape => shape.type === CANNON.Shape.types.BOX) && distance(body) < 80)
      .sort((a, b) => distance(a) - distance(b)).slice(0, 8);
  }

  /** Plain public observations. Private collision sensing stays in the local motor. */
  observe(key, { requesterPeerId } = {}) {
    const entry = this.entries.get(key); if (!entry) throw new Error('Resident body is unavailable');
    const { position, participants } = this.observeParticipants(key, { requesterPeerId });
    const motion = entry.descriptor.local ? this.motor.getResidentStatus(key) : null;
    const obstacles = this.nearbyObstacleBodies(key).map(body => ({
      position: [body.position.x, this.groundHeight(body.position.x, body.position.z) + HALF_SIZE, body.position.z],
      radius: Math.min(30, body.boundingRadius || 3) }));
    return { observedAt: Date.now(), self: { id: `resident:${entry.descriptor.ownerPeerId}:${entry.descriptor.agentId}`,
      agentId: entry.descriptor.agentId, ownerPeerId: entry.descriptor.ownerPeerId, name: entry.descriptor.name,
      position, velocity: entry.body.velocity.toArray(), status: entry.descriptor.status, intentRevision: entry.intentRevision,
      ...(motion ? { motion: { type: motion.type, status: motion.status, targetId: motion.targetId,
        ...(motion.targetPosition ? { targetPosition: motion.targetPosition } : {}) } } : {}) },
    participants, obstacles, ...(entry.descriptor.local ? this.spatialTargets.describe(key) : {}),
    ...(requesterPeerId && participants.some(p => p.peerId === requesterPeerId) ? { requesterId: `human:${requesterPeerId}` } : {}) };
  }

  /** Capture the current owned body's view, not the human orbit/VR camera. */
  async captureVision(key, { signal } = {}) {
    signal?.throwIfAborted();
    const entry = this.entries.get(key);
    const stale = () => Object.assign(new Error('Resident vision requires an active owned body'), { code: 'ERR_WORLD_VISION_STALE' });
    if (this.closed || !entry?.descriptor.local || entry.descriptor.status === 'paused') throw stale();
    const intentRevision = entry.intentRevision;
    this.viewCapture ??= new ResidentViewCapture({ renderer: this.scene.renderer, scene: this.scene.scene });
    const position = entry.mesh.getWorldPosition(new THREE.Vector3());
    // The visual ground may differ from the planar collision body. Generated
    // avatars use their own height; ordinary cubes look from near their top.
    position.y += (entry.avatarView?.renderedHeight ?? HALF_SIZE * 2) * .8 - HALF_SIZE;
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(entry.mesh.getWorldQuaternion(new THREE.Quaternion()));
    const exclude = [...this.entries.values()].filter(other => other === entry || (other.descriptor.local && !other.descriptor.shared)).map(other => other.mesh);
    const frame = await this.viewCapture.capture({ pose: { position: position.toArray(), direction: direction.toArray() }, exclude, signal });
    signal?.throwIfAborted();
    if (this.closed || this.entries.get(key) !== entry || !entry.descriptor.local || entry.descriptor.status === 'paused'
        || entry.intentRevision !== intentRevision) throw stale();
    return { ...frame, intentRevision };
  }

  place(entry, position) {
    entry.mesh.position.fromArray(position);
    // CubeChat simulates humans on a flat plane and contours only their visual
    // body to themed terrain. Resident collision uses those same coordinates.
    entry.body.position.set(position[0], HALF_SIZE, position[2]);
    entry.body.velocity.set(0, 0, 0);
    entry.body.previousPosition.copy(entry.body.position);
    entry.body.interpolatedPosition.copy(entry.body.position);
    entry.body.aabbNeedsUpdate = true;
    if (this.physics.world.broadphase) this.physics.world.broadphase.dirty = true;
    entry.descriptor.position = [...position];
  }

  /** Cannon invokes this once per fixed substep, after damping and before integration. */
  beforePhysics() {
    if (this.closed) return;
    for (const [key, entry] of this.entries) {
      if (!entry.descriptor.local) continue;
      entry.body.position.y = HALF_SIZE; entry.body.velocity.y = 0; entry.body.force.y = 0;
      const speed = Math.hypot(entry.body.velocity.x, entry.body.velocity.z);
      if (speed > MOTOR.maxSpeed) { entry.body.velocity.x *= MOTOR.maxSpeed / speed; entry.body.velocity.z *= MOTOR.maxSpeed / speed; }
      if (entry.descriptor.status === 'paused') { this.motor.halt(entry); continue; }
      // Roam remains an explicitly labelled scripted baseline. Follow/approach
      // use only the managed neural policy and never silently fall back to it.
      if (!this.motor.intents.has(key) && entry.movement === 'roam') {
        const previous = entry.mesh.position.toArray(), next = entry.motion.step({ position: previous,
          target: previous, dt: MOTOR.fixedDt, status: 'idle',
          obstacles: this.nearbyObstacleBodies(key).map(body => [body.position.x, HALF_SIZE, body.position.z]) });
        for (const [axis, index] of [['x', 0], ['z', 2]]) {
          const desired = Math.max(-MOTOR.maxSpeed, Math.min(MOTOR.maxSpeed, (next[index] - previous[index]) / MOTOR.fixedDt));
          const acceleration = Math.max(-MOTOR.maxAcceleration, Math.min(MOTOR.maxAcceleration, (desired - entry.body.velocity[axis]) * 4));
          entry.body.force[axis] += MOTOR.mass * acceleration;
        }
      }
    }
    this.motor.beforeStep();
  }

  /** Physics owns local XZ integration; the renderer only contours visual height. */
  afterPhysics(dt) {
    if (this.closed) return;
    if (!Number.isFinite(dt) || dt < 0) throw new TypeError('Invalid resident timestep');
    for (const [key, entry] of this.entries) {
      const previous = entry.mesh.position.toArray();
      let next;
      if (entry.descriptor.local) {
        next = [entry.body.position.x, this.groundHeight(entry.body.position.x, entry.body.position.z) + HALF_SIZE, entry.body.position.z];
      } else {
        // Interpolate one directory sample behind the owner (five seconds by
        // default). No extrapolated authority or remote gravity is simulated.
        entry.remoteElapsed = Math.min(this.remoteInterpolationSeconds, entry.remoteElapsed + Math.min(dt, 0.1));
        const fraction = entry.remoteElapsed / this.remoteInterpolationSeconds;
        const desired = entry.remoteStart.map((value, index) => value + (entry.target[index] - value) * fraction);
        const delta = desired.map((value, index) => value - previous[index]);
        const distance = Math.hypot(...delta), travel = Math.min(distance, 12 * Math.min(dt, 0.1));
        next = distance ? previous.map((value, index) => value + delta[index] / distance * travel) : previous;
      }
      if (Math.hypot(next[0] - previous[0], next[2] - previous[2]) > 0.00001) entry.mesh.rotation.y = Math.atan2(next[0] - previous[0], next[2] - previous[2]);
      if (entry.descriptor.local) { entry.mesh.position.fromArray(this.normalizePosition(next)); entry.descriptor.position = [...next]; }
      else this.place(entry, this.normalizePosition(next));
    }
    this.captions.update();
  }

  update(dt) { this.afterPhysics(dt); }

  getSpawnPosition() {
    const raw = this.getPlayerPosition();
    const position = this.normalizePosition(Array.isArray(raw) ? raw : [raw?.x ?? 0, raw?.y ?? HALF_SIZE, raw?.z ?? 0]);
    const forward = this.scene.camera.getWorldDirection(new THREE.Vector3());
    const heading = Math.atan2(forward.x, forward.z);
    let candidate;
    for (let index = 0; index < 24; index++) {
      const angle = heading + index * Math.PI / 4;
      const distance = 14 + Math.floor(index / 8) * 10;
      candidate = [position[0] + Math.sin(angle) * distance, position[1], position[2] + Math.cos(angle) * distance];
      if ([...this.entries.values()].every(({ descriptor }) => Math.hypot(descriptor.position[0] - candidate[0], descriptor.position[2] - candidate[2]) >= 9)) break;
    }
    candidate[1] = this.groundHeight(candidate[0], candidate[2]) + HALF_SIZE;
    return this.normalizePosition(candidate);
  }

  upsert(input) {
    if (this.closed) throw new Error('Agent layer is closed');
    const descriptor = normalizeDescriptor(input);
    let entry = this.entries.get(descriptor.key);
    if (!entry && this.entries.size >= this.maximumAgents) throw new RangeError('Too many visible agents');
    if (!entry) {
      const motion = descriptor.local ? this.motionFactory({ key: descriptor.key, position: [...descriptor.position], mode: 'roam' }) : null;
      if (motion && (typeof motion.step !== 'function' || typeof motion.setMode !== 'function')) throw new TypeError('Resident motion must implement step and setMode');
      if (descriptor.local && !motion) throw new TypeError('Resident motion is required for the local owner');
      const mesh = new THREE.Mesh(this.geometry, new THREE.MeshStandardMaterial({ color: descriptor.color, emissive: descriptor.color, emissiveIntensity: 0.12 }));
      mesh.userData.agentKey = descriptor.key;
      const outline = new THREE.LineSegments(this.edgeGeometry, new THREE.LineBasicMaterial({ color: descriptor.color }));
      mesh.add(outline);
      const body = new CANNON.Body({ type: descriptor.local ? CANNON.Body.DYNAMIC : CANNON.Body.KINEMATIC,
        mass: descriptor.local ? MOTOR.mass : 0, linearDamping: MOTOR.linearDamping, fixedRotation: true,
        shape: new CANNON.Box(new CANNON.Vec3(HALF_SIZE, HALF_SIZE, HALF_SIZE)) });
      if (descriptor.local) body.linearFactor.set(1, 0, 1);
      entry = { mesh, baseMaterial: mesh.material, faceMaterial: null, outline, body, descriptor: null, label: null, captionTimer: null,
        target: [...descriptor.position], remoteStart: [...descriptor.position], remoteElapsed: 0, motion, movement: 'roam', intentRevision: ++this.intentRevision };
      Object.defineProperty(entry, 'caption', { get: () => this.entries.get(descriptor.key) === entry
        ? this.captions.entries.get(descriptor.key)?.sprite ?? null : null });
      this.group.add(mesh); this.physics.world.addBody(body); this.entries.set(descriptor.key, entry);
    }
    const previous = entry.descriptor;
    if (previous && previous.local !== descriptor.local) throw new Error('A body cannot change authority in place');
    if (entry.target.some((value, index) => value !== descriptor.position[index])) {
      entry.remoteStart = entry.mesh.position.toArray(); entry.remoteElapsed = 0;
      entry.target = [...descriptor.position];
    }
    const livePosition = previous ? entry.mesh.position.toArray() : descriptor.position;
    entry.baseMaterial.color.set(descriptor.color); entry.baseMaterial.emissive.set(descriptor.color);
    entry.baseMaterial.emissiveIntensity = ['thinking', 'speaking'].includes(descriptor.status) ? 0.4 : 0.12;
    entry.outline.material.color.set(this.selectedKey === descriptor.key ? '#ffffff' : descriptor.color);
    if (!previous || previous.name !== descriptor.name || previous.status !== descriptor.status) {
      const label = textSprite(`${descriptor.name}${descriptor.status === 'idle' ? '' : ` · ${descriptor.status}`}`);
      disposeSprite(entry.label); entry.label = label; entry.mesh.add(label);
      if (entry.avatarView) label.position.y = entry.avatarView.renderedHeight - HALF_SIZE + 1.5;
    }
    if (!previous || previous.caption !== descriptor.caption) {
      clearTimeout(entry.captionTimer); entry.captionTimer = null;
      this.captions.remove(descriptor.key);
      if (descriptor.caption) {
        this.captions.show(descriptor.key, descriptor.caption);
        // Preserve expiry while the render loop is paused, without owning a
        // second renderer or letting an old timer remove a replacement body.
        entry.captionTimer = setTimeout(() => {
          if (this.entries.get(descriptor.key) === entry) this.captions.remove(descriptor.key);
          entry.captionTimer = null;
        }, this.captionDurationMs);
      }
    }
    entry.descriptor = descriptor;
    if (previous && descriptor.local && (previous.status === 'paused') !== (descriptor.status === 'paused')) entry.intentRevision = ++this.intentRevision;
    if (!previous || !descriptor.local) this.place(entry, livePosition);
    else entry.descriptor.position = [...livePosition];
    if (descriptor.local && descriptor.status === 'paused') this.motor.suspend(descriptor.key);
    if (descriptor.local && descriptor.movement !== undefined && (previous?.movement !== descriptor.movement
        || (descriptor.movement === 'follow' && previous?.ownerPeerId !== descriptor.ownerPeerId))) {
      this.setMovement(descriptor.key, descriptor.movement, { restore: true });
    }
    this.captions.update();
    return descriptor.key;
  }

  /** +Z is the fixed cube front; byte-only input keeps URL fetching out of the renderer. */
  setAppearance(key, image) {
    const entry = this.entries.get(key);
    if (!entry || this.closed) return false;
    if (image != null && (!Number.isInteger(image.width) || !Number.isInteger(image.height)
        || image.width < 1 || image.height < 1 || image.width > 256 || image.height > 256
        || image.channels !== 4 || !(image.data instanceof Uint8Array)
        || image.data.byteLength !== image.width * image.height * 4)) throw new TypeError('Invalid resident face pixels');
    let material = null;
    if (image) {
      const texture = new THREE.DataTexture(image.data.slice(), image.width, image.height, THREE.RGBAFormat);
      texture.colorSpace = THREE.SRGBColorSpace; texture.flipY = true;
      texture.needsUpdate = true;
      material = new THREE.MeshBasicMaterial({ map: texture });
    }
    if (material && entry.avatarView) material.visible = false;
    const previous = entry.faceMaterial; entry.faceMaterial = material;
    entry.mesh.material = material
      ? [entry.baseMaterial, entry.baseMaterial, entry.baseMaterial, entry.baseMaterial, material, entry.baseMaterial]
      : entry.baseMaterial;
    previous?.map?.dispose(); previous?.dispose();
    return true;
  }

  async prepareAvatar(mesh, { signal, size = 6 } = {}) {
    if (this.closed) throw new Error('Resident renderer closed');
    const view = await prepareGeneratedMeshView(mesh, { signal, alignForward: true });
    try { fitGeneratedMeshView(view, size); }
    catch (error) { view.dispose(); throw error; }
    let committed = false;
    return { dispose: view.dispose, commit: (key, descriptor) => {
      const entry = this.entries.get(key);
      if (this.closed || view.released || committed || !entry
          || !sameResidentAvatar(entry.descriptor.avatar, descriptor.avatar)) throw new Error('Resident avatar changed before display');
      this.clearAvatar(key);
      view.group.position.y = -HALF_SIZE;
      view.avatar = normalizeResidentAvatar(descriptor.avatar);
      view.group.userData.residentAvatar = view.avatar;
      entry.mesh.add(view.group); entry.avatarView = view;
      entry.baseMaterial.visible = false; if (entry.faceMaterial) entry.faceMaterial.visible = false;
      entry.outline.visible = false; entry.label.position.y = view.renderedHeight - HALF_SIZE + 1.5;
      this.captions.update();
      committed = true;
    } };
  }

  clearAvatar(key) {
    const entry = this.entries.get(key); if (!entry) return;
    entry.avatarView?.group.removeFromParent(); entry.avatarView?.dispose(); entry.avatarView = null;
    entry.baseMaterial.visible = true; if (entry.faceMaterial) entry.faceMaterial.visible = true;
    entry.outline.visible = true; if (entry.label) entry.label.position.y = 4.5;
    this.captions.update();
  }

  pick(clientX, clientY) {
    if (this.closed) return null;
    const bounds = this.canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    const locked = document.pointerLockElement === this.canvas || document.webkitPointerLockElement === this.canvas;
    const pointer = locked ? new THREE.Vector2() : new THREE.Vector2((clientX - bounds.left) / bounds.width * 2 - 1, -(clientY - bounds.top) / bounds.height * 2 + 1);
    this.scene.camera.updateWorldMatrix(true, false); this.group.updateWorldMatrix(true, true);
    this.raycaster.setFromCamera(pointer, this.scene.camera);
    const targets = [], keys = new Map();
    for (const [key, entry] of this.entries) {
      if (entry.avatarView) entry.avatarView.group.traverseVisible(object => {
        if (object.isMesh) { targets.push(object); keys.set(object, key); }
      });
      else { targets.push(entry.mesh); keys.set(entry.mesh, key); }
    }
    return keys.get(this.raycaster.intersectObjects(targets, false)[0]?.object) ?? null;
  }

  select(key) {
    if (!this.focus(key)) return;
    try { Promise.resolve(this.onSelect?.(key)).catch((error) => console.warn('[CubeChat] Agent conversation failed', error)); }
    catch (error) { console.warn('[CubeChat] Agent conversation failed', error); }
  }

  focus(key) {
    if (this.closed || !this.entries.has(key)) return false;
    this.selectedKey = key;
    for (const [entryKey, entry] of this.entries) entry.outline.material.color.set(entryKey === key ? '#ffffff' : entry.descriptor.color);
    return true;
  }

  getContext(descriptor) {
    const entry = this.entries.get(descriptor?.key)?.descriptor ?? normalizeDescriptor(descriptor);
    return { demo: 'CubeChat', theme: String(this.scene.worldThemeId ?? 'tron').slice(0, 40),
      agent: { name: entry.name, position: [...entry.position], status: entry.status },
      nearbyPlayers: Math.min(1000, this.scene.players?.size ?? 0) };
  }

  getAudioPose(key) {
    const entry = this.entries.get(key);
    if (!entry || this.closed) return null;
    this.scene.camera.updateWorldMatrix(true, false);
    // The orbit camera can be far behind the avatar. Zooming the view must not
    // change acoustic distance while the player and speaker remain stationary.
    const player = this.getPlayerPosition();
    const listener = new THREE.Vector3(...this.normalizePosition(Array.isArray(player)
      ? player : [player?.x, player?.y, player?.z])).add(new THREE.Vector3(0, 2, 0));
    const forward = this.scene.camera.getWorldDirection(new THREE.Vector3());
    const rotation = this.scene.camera.getWorldQuaternion(new THREE.Quaternion());
    return { source: entry.mesh.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 2, 0)).toArray(),
      listener: listener.toArray(), forward: forward.toArray(), up: new THREE.Vector3(0, 1, 0).applyQuaternion(rotation).normalize().toArray() };
  }

  remove(key) {
    const entry = this.entries.get(key);
    if (!entry) return false;
    this.clearAvatar(key);
    this.motor.clear(key); clearTimeout(entry.captionTimer); this.captions.remove(key); disposeSprite(entry.label);
    entry.mesh.removeFromParent(); entry.faceMaterial?.map?.dispose(); entry.faceMaterial?.dispose();
    entry.baseMaterial.dispose(); entry.outline.material.dispose();
    this.physics.world.removeBody(entry.body); this.entries.delete(key);
    if (this.selectedKey === key) this.selectedKey = null;
    return true;
  }

  clear() { for (const key of [...this.entries.keys()]) this.remove(key); }

  dispose() {
    if (this.closed) return;
    this.closed = true; this.viewCapture?.dispose(); this.clear(); this.captions.dispose(); this.group.removeFromParent();
    this.physics.world.removeEventListener('preStep', this.onPhysicsStep); this.motor.dispose();
    this.physics.world.removeEventListener('addBody', this.onNavigationGeometryChanged);
    this.physics.world.removeEventListener('removeBody', this.onNavigationGeometryChanged);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown, true);
    this.canvas.removeEventListener('click', this.onClick, true);
    this.canvas.removeEventListener('keydown', this.onKeyDown, true);
    if (this.originalTabIndex === null) this.canvas.removeAttribute('tabindex');
    else this.canvas.setAttribute('tabindex', this.originalTabIndex);
    this.geometry.dispose(); this.edgeGeometry.dispose(); this.pointerStart = null;
  }
}
