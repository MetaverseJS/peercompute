import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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

function textSprite(text, { caption = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = caption ? 320 : 160;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Agent labels require a canvas text context');
  context.fillStyle = '#061613'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#a0ffce'; context.lineWidth = 4; context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
  context.fillStyle = '#dcffe9'; context.font = `${caption ? 30 : 32}px monospace`;
  context.textAlign = 'center'; context.textBaseline = 'middle';
  const maximumLines = caption ? 7 : 3;
  const lines = [];
  let line = '';
  for (const character of Array.from(text.replace(/\s+/g, ' ').slice(0, caption ? 420 : 160))) {
    if (context.measureText(line + character).width > 704) { lines.push(line); line = ''; }
    line += character;
  }
  if (line) lines.push(line);
  if (lines.length > maximumLines) lines[maximumLines - 1] = lines[maximumLines - 1].slice(0, -3) + '…';
  const shown = lines.slice(0, maximumLines);
  shown.forEach((value, index) => context.fillText(value, canvas.width / 2, canvas.height / 2 + (index - (shown.length - 1) / 2) * 38));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: true, transparent: false }));
  sprite.scale.set(caption ? 18 : 14, caption ? 7.5 : 3, 1);
  sprite.position.y = caption ? 13 : 6;
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
  constructor({ scene, physics, getPlayerPosition, onSelect, captionDurationMs = 12_000, maximumAgents = 64 } = {}) {
    if (!scene?.scene?.isScene || !scene.camera?.isCamera || !scene.renderer?.domElement
        || !physics?.world || typeof getPlayerPosition !== 'function') throw new TypeError('Cube agent scene dependencies are required');
    if (!Number.isInteger(maximumAgents) || maximumAgents < 1 || maximumAgents > 256
        || !Number.isInteger(captionDurationMs) || captionDurationMs < 1 || captionDurationMs > 60_000) throw new RangeError('Invalid agent layer limits');
    Object.assign(this, { scene, physics, getPlayerPosition, onSelect, captionDurationMs, maximumAgents });
    this.entries = new Map(); this.closed = false; this.selectedKey = null;
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
    // Pick the actual rendered floor, including themed terrain, without using renderer internals.
    if (this.scene.floor) {
      this.scene.floor.updateWorldMatrix(true, true);
      const ground = new THREE.Raycaster(new THREE.Vector3(candidate[0], MAX_COORDINATE, candidate[2]), new THREE.Vector3(0, -1, 0), 0, MAX_COORDINATE * 2);
      const hit = ground.intersectObject(this.scene.floor, true)[0];
      if (hit) candidate[1] = hit.point.y + HALF_SIZE;
    }
    return this.normalizePosition(candidate);
  }

  upsert(input) {
    if (this.closed) throw new Error('Agent layer is closed');
    const descriptor = normalizeDescriptor(input);
    let entry = this.entries.get(descriptor.key);
    if (!entry && this.entries.size >= this.maximumAgents) throw new RangeError('Too many visible agents');
    if (!entry) {
      const mesh = new THREE.Mesh(this.geometry, new THREE.MeshStandardMaterial({ color: descriptor.color, emissive: descriptor.color, emissiveIntensity: 0.12 }));
      mesh.userData.agentKey = descriptor.key;
      const outline = new THREE.LineSegments(this.edgeGeometry, new THREE.LineBasicMaterial({ color: descriptor.color }));
      mesh.add(outline);
      const body = new CANNON.Body({ type: CANNON.Body.STATIC, mass: 0, shape: new CANNON.Box(new CANNON.Vec3(HALF_SIZE, HALF_SIZE, HALF_SIZE)) });
      entry = { mesh, outline, body, descriptor: null, label: null, caption: null, captionTimer: null };
      this.group.add(mesh); this.physics.world.addBody(body); this.entries.set(descriptor.key, entry);
    }
    const previous = entry.descriptor;
    entry.mesh.position.fromArray(descriptor.position);
    entry.mesh.material.color.set(descriptor.color); entry.mesh.material.emissive.set(descriptor.color);
    entry.mesh.material.emissiveIntensity = ['thinking', 'speaking'].includes(descriptor.status) ? 0.4 : 0.12;
    entry.outline.material.color.set(this.selectedKey === descriptor.key ? '#ffffff' : descriptor.color);
    entry.body.position.set(...descriptor.position); entry.body.aabbNeedsUpdate = true;
    if (this.physics.world.broadphase) this.physics.world.broadphase.dirty = true;
    if (!previous || previous.name !== descriptor.name || previous.status !== descriptor.status) {
      const label = textSprite(`${descriptor.name} · AGENT · ${descriptor.status}`);
      disposeSprite(entry.label); entry.label = label; entry.mesh.add(label);
    }
    if (!previous || previous.caption !== descriptor.caption) {
      clearTimeout(entry.captionTimer); entry.captionTimer = null;
      disposeSprite(entry.caption); entry.caption = null;
      if (descriptor.caption) {
        entry.caption = textSprite(descriptor.caption, { caption: true }); entry.mesh.add(entry.caption);
        entry.captionTimer = setTimeout(() => {
          disposeSprite(entry.caption); entry.caption = null; entry.captionTimer = null;
        }, this.captionDurationMs);
      }
    }
    entry.descriptor = descriptor;
    return descriptor.key;
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
    clearTimeout(entry.captionTimer); disposeSprite(entry.caption); disposeSprite(entry.label);
    entry.mesh.removeFromParent(); entry.mesh.material.dispose(); entry.outline.material.dispose();
    this.physics.world.removeBody(entry.body); this.entries.delete(key);
    if (this.selectedKey === key) this.selectedKey = null;
    return true;
  }

  clear() { for (const key of [...this.entries.keys()]) this.remove(key); }

  dispose() {
    if (this.closed) return;
    this.closed = true; this.clear(); this.group.removeFromParent();
    this.canvas.removeEventListener('pointerdown', this.onPointerDown, true);
    this.canvas.removeEventListener('click', this.onClick, true);
    this.canvas.removeEventListener('keydown', this.onKeyDown, true);
    if (this.originalTabIndex === null) this.canvas.removeAttribute('tabindex');
    else this.canvas.setAttribute('tabindex', this.originalTabIndex);
    this.geometry.dispose(); this.edgeGeometry.dispose(); this.pointerStart = null;
  }
}
