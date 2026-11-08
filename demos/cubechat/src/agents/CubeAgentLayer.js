import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { WorldResidentMotion } from '../../../shared/agents/WorldResidentMotion.js';
import { SpeechBubbleLayer } from '../../../shared/world/SpeechBubbleLayer.js';

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
  return { key, agentId, ownerPeerId, name, color: value.color, status: value.status, local: value.local,
    position: normalizeCubeAgentPosition(value.position), caption: value.caption ?? '' };
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
    motionFactory = (options) => new WorldResidentMotion(options), remoteInterpolationSeconds = 5 } = {}) {
    if (!scene?.scene?.isScene || !scene.camera?.isCamera || !scene.renderer?.domElement
        || !physics?.world || typeof getPlayerPosition !== 'function') throw new TypeError('Cube agent scene dependencies are required');
    if (!Number.isInteger(maximumAgents) || maximumAgents < 1 || maximumAgents > 256
        || !Number.isInteger(captionDurationMs) || captionDurationMs < 1 || captionDurationMs > 60_000
        || !Number.isFinite(remoteInterpolationSeconds) || remoteInterpolationSeconds < 0.1 || remoteInterpolationSeconds > 15) throw new RangeError('Invalid agent layer limits');
    if (typeof motionFactory !== 'function') throw new TypeError('A resident motion factory is required');
    Object.assign(this, { scene, physics, getPlayerPosition, onSelect, captionDurationMs, maximumAgents, motionFactory, remoteInterpolationSeconds });
    this.entries = new Map(); this.closed = false; this.selectedKey = null;
    this.captions = new SpeechBubbleLayer({ scene: scene.scene, camera: scene.camera,
      getAnchor: key => this.entries.get(key)?.mesh, durationMs: captionDurationMs, maximum: maximumAgents, offsetY: 6 });
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

  setMovement(key, mode) {
    const entry = this.entries.get(key);
    if (!entry?.descriptor.local) throw new Error('Only the resident owner can control movement');
    entry.motion.setMode(mode);
    return mode;
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

  /** Called after the world's physics step. Only local owners run steering. */
  update(dt) {
    if (this.closed) return;
    if (!Number.isFinite(dt) || dt < 0) throw new TypeError('Invalid resident timestep');
    const player = this.getPlayerPosition();
    const target = this.normalizePosition(Array.isArray(player) ? player : [player?.x ?? 0, player?.y ?? 3, player?.z ?? 0]);
    const humans = [...(this.physics.bodies?.values() ?? [])].slice(0, 192)
      .map((body) => [body.position.x, body.position.y, body.position.z]);
    for (const [key, entry] of this.entries) {
      const previous = entry.mesh.position.toArray();
      let next;
      if (entry.descriptor.local) {
        const obstacles = [...this.entries].filter(([otherKey]) => otherKey !== key)
          .map(([, other]) => other.mesh.position.toArray()).concat(humans).slice(0, 256);
        next = entry.descriptor.status === 'idle'
          ? this.normalizePosition(entry.motion.step({ position: [...previous], target: [...target], dt: Math.min(dt, 0.1), status: entry.descriptor.status, obstacles }))
          : [...previous];
        // Replaceable application policies still share the motor's speed and
        // grounded-body boundary. No network descriptor selects executable code.
        const distance = Math.hypot(next[0] - previous[0], next[2] - previous[2]), maximum = 20 * Math.min(dt, 0.1);
        if (distance > maximum) {
          next[0] = previous[0] + (next[0] - previous[0]) / distance * maximum;
          next[2] = previous[2] + (next[2] - previous[2]) / distance * maximum;
        }
        next[1] = this.groundHeight(next[0], next[2]) + HALF_SIZE;
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
      this.place(entry, this.normalizePosition(next));
    }
    this.captions.update();
  }

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
      const body = new CANNON.Body({ type: CANNON.Body.KINEMATIC, mass: 0, fixedRotation: true,
        shape: new CANNON.Box(new CANNON.Vec3(HALF_SIZE, HALF_SIZE, HALF_SIZE)) });
      entry = { mesh, baseMaterial: mesh.material, faceMaterial: null, outline, body, descriptor: null, label: null, captionTimer: null,
        target: [...descriptor.position], remoteStart: [...descriptor.position], remoteElapsed: 0, motion };
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
    this.place(entry, livePosition); this.captions.update();
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
    const previous = entry.faceMaterial; entry.faceMaterial = material;
    entry.mesh.material = material
      ? [entry.baseMaterial, entry.baseMaterial, entry.baseMaterial, entry.baseMaterial, material, entry.baseMaterial]
      : entry.baseMaterial;
    previous?.map?.dispose(); previous?.dispose();
    return true;
  }

  pick(clientX, clientY) {
    if (this.closed) return null;
    const bounds = this.canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    const locked = document.pointerLockElement === this.canvas || document.webkitPointerLockElement === this.canvas;
    const pointer = locked ? new THREE.Vector2() : new THREE.Vector2((clientX - bounds.left) / bounds.width * 2 - 1, -(clientY - bounds.top) / bounds.height * 2 + 1);
    this.scene.camera.updateWorldMatrix(true, false); this.group.updateWorldMatrix(true, true);
    this.raycaster.setFromCamera(pointer, this.scene.camera);
    return this.raycaster.intersectObjects([...this.entries.values()].map(({ mesh }) => mesh), false)[0]?.object.userData.agentKey ?? null;
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
    clearTimeout(entry.captionTimer); this.captions.remove(key); disposeSprite(entry.label);
    entry.mesh.removeFromParent(); entry.faceMaterial?.map?.dispose(); entry.faceMaterial?.dispose();
    entry.baseMaterial.dispose(); entry.outline.material.dispose();
    this.physics.world.removeBody(entry.body); this.entries.delete(key);
    if (this.selectedKey === key) this.selectedKey = null;
    return true;
  }

  clear() { for (const key of [...this.entries.keys()]) this.remove(key); }

  dispose() {
    if (this.closed) return;
    this.closed = true; this.clear(); this.captions.dispose(); this.group.removeFromParent();
    this.canvas.removeEventListener('pointerdown', this.onPointerDown, true);
    this.canvas.removeEventListener('click', this.onClick, true);
    this.canvas.removeEventListener('keydown', this.onKeyDown, true);
    if (this.originalTabIndex === null) this.canvas.removeAttribute('tabindex');
    else this.canvas.setAttribute('tabindex', this.originalTabIndex);
    this.geometry.dispose(); this.edgeGeometry.dispose(); this.pointerStart = null;
  }
}
