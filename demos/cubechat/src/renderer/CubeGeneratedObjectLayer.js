import * as THREE from 'three';
import { prepareGeneratedMeshView, fitGeneratedMeshView } from '../../../shared/world/GeneratedMeshView.js';
import { groundGeneratedMeshView, generatedGroundSurfaceSampler } from '../../../shared/world/GeneratedMeshGrounding.js';
import { normalizeWorldObjectDescriptor, objectPosition, WORLD_OBJECT_LIMITS } from '../../../shared/agents/WorldObjectAction.js';
import { normalizeWorldObjectSize } from '../../../shared/world/WorldModelScale.js';

/** Cosmetic objects, independent of resident cubes and their physics bodies. */
export class CubeGeneratedObjectLayer {
  constructor({ scene, physics, getResidentPosition, resolvePlacement }) {
    if (!scene?.scene?.isScene || typeof getResidentPosition !== 'function') throw new TypeError('Generated objects require a scene and resident positions');
    this.scene = scene; this.physics = physics; this.getResidentPosition = getResidentPosition;
    this.resolvePlacement = resolvePlacement;
    this.supportsGroundedPlacement = typeof resolvePlacement === 'function';
    this.group = new THREE.Group(); this.group.name = 'CubeChat generated objects'; scene.scene.add(this.group);
    this.entries = new Map(); this.closed = false;
    this.surface = null;
  }
  getPlacement(agentId, size, target, { excludeKey, transformExisting = false } = {}) {
    if (this.closed) throw new Error('Generated object renderer is closed');
    normalizeWorldObjectSize(size);
    if (this.supportsGroundedPlacement) {
      const obstacles = [...this.entries].filter(([key]) => key !== excludeKey).map(([, { group, descriptor }]) => {
        group.updateWorldMatrix(true, true);
        const bounds = new THREE.Box3().setFromObject(group);
        // Physical admission remains in the Cannon frame. Cosmetic terrain
        // projection must not make another object disappear from clearance.
        bounds.translate(new THREE.Vector3(0, descriptor.placement.position[1] - group.position.y, 0));
        return { min: bounds.min.toArray(), max: bounds.max.toArray() };
      });
      return objectPosition(this.resolvePlacement(agentId, size, target, { obstacles, transformExisting }));
    }
    if (target !== undefined) throw new Error('Grounded object placement is unavailable in this world');
    const position = objectPosition(this.getResidentPosition(agentId));
    const half = Number.isFinite(this.scene.gridSize) ? this.scene.gridSize / 2 : 1000;
    const x = Math.min(half - size, Math.max(-half + size, position[0] + 6 + size / 2));
    const z = Math.min(half - size, Math.max(-half + size, position[2]));
    const height = this.physics?.getGroundHeight?.(x, z);
    return objectPosition([x, Number.isFinite(height) ? height : Math.max(0, position[1] - 3), z]);
  }
  refreshSurface() {
    const floor = this.scene.floor, geometry = floor?.geometry;
    floor?.updateWorldMatrix(true, false);
    const signature = [floor, geometry, geometry?.getAttribute('position')?.version, geometry?.index?.version,
      this.scene.worldThemeId, this.scene.getGroundHeight];
    if (this.surface && signature.every((value, i) => value === this.surface.signature[i])
        && (!floor || this.surface.matrix.equals(floor.matrixWorld))) return false;
    const sample = floor?.isMesh ? generatedGroundSurfaceSampler(floor)
      : typeof this.scene.getGroundHeight === 'function' ? (x, z) => this.scene.getGroundHeight(x, z) : null;
    this.surface = { signature, matrix: floor?.matrixWorld.clone(), sample };
    return true;
  }
  placeView(view, placement) {
    this.refreshSurface();
    if (this.surface.sample) view.grounding = groundGeneratedMeshView(view, placement.position, this.surface.sample);
    else { view.group.position.fromArray(placement.position); view.grounding = null; }
  }
  updateGrounding() {
    if (this.closed || !this.refreshSurface()) return false;
    for (const entry of this.entries.values()) {
      try { this.placeView(entry.view, entry.descriptor.placement); delete entry.groundingError; }
      catch (error) { entry.groundingError = String(error.message).slice(0, 240); }
    }
    return true;
  }
  validateTransform(key, descriptor, { agentId } = {}) {
    if (this.closed) throw new Error('Generated object renderer is closed');
    const entry = this.entries.get(key), checked = normalizeWorldObjectDescriptor(descriptor);
    if (!entry || key !== `local:${checked.placement.objectId}`) throw new Error('Only an existing local object can be resized');
    const current = entry.descriptor.placement, next = checked.placement;
    if (['objectId', 'agentId', 'ownerHostId', 'worldId'].some(field => next[field] !== current[field])
        || next.position[0] !== current.position[0] || next.position[2] !== current.position[2]) {
      throw new Error('Object identity or fixed placement changed before resize');
    }
    if (!this.supportsGroundedPlacement) throw new Error('Object resizing needs grounded placement validation');
    return this.getPlacement(agentId, next.size, { kind: 'location', id: `object:${current.objectId}`,
      position: [...current.position], observedAt: Date.now() }, { excludeKey: key, transformExisting: true });
  }
  updateTransform(key, descriptor) {
    if (this.closed) throw new Error('Generated object renderer is closed');
    const entry = this.entries.get(key), checked = normalizeWorldObjectDescriptor(descriptor);
    if (!entry || checked.placement.objectId !== entry.descriptor.placement.objectId) throw new Error('Displayed object changed before resize');
    const { view, group } = entry, previous = { scale: group.scale.clone(), position: group.position.clone(),
      worldSize: view.worldSize, renderedHeight: view.renderedHeight, grounding: view.grounding };
    try {
      fitGeneratedMeshView(view, checked.placement.size, { profile: 'object' }); this.placeView(view, checked.placement);
    } catch (error) {
      group.scale.copy(previous.scale); group.position.copy(previous.position);
      view.worldSize = previous.worldSize; view.renderedHeight = previous.renderedHeight; view.grounding = previous.grounding;
      throw error;
    }
    group.name = checked.placement.name; group.userData.generatedObject = checked;
    entry.descriptor = checked; delete entry.groundingError;
  }
  async prepare(mesh, { signal } = {}) {
    if (this.closed) throw new Error('Generated object renderer is closed');
    signal?.throwIfAborted();
    const view = await prepareGeneratedMeshView(mesh, { signal });
    const { group, dispose } = view;
    let committed = false;
    try {
      signal?.throwIfAborted();
      if (this.closed) throw new Error('Generated object renderer is closed');
      return {
        commit: (key, descriptor) => {
          if (this.closed || view.released || committed) throw new Error('Generated object preparation is no longer usable');
          const checkedDescriptor = normalizeWorldObjectDescriptor(descriptor);
          if (!this.entries.has(key) && this.entries.size >= WORLD_OBJECT_LIMITS.visible) throw new Error('World object display limit reached');
          const placement = checkedDescriptor.placement;
          fitGeneratedMeshView(view, placement.size, { profile: 'object' }); this.placeView(view, placement);
          group.name = placement.name; group.userData.generatedObject = checkedDescriptor;
          this.remove(key); this.group.add(group); committed = true;
          this.entries.set(key, { group, view, descriptor: checkedDescriptor, dispose });
        },
        dispose,
      };
    } catch (error) { dispose(); throw error; }
  }
  remove(key) {
    const entry = this.entries.get(key); if (!entry) return;
    entry.group.removeFromParent(); entry.dispose(); this.entries.delete(key);
  }
  getStatus() { return { objects: this.entries.size, closed: this.closed,
    groundingErrors: [...this.entries].filter(([, entry]) => entry.groundingError).map(([key, entry]) => ({ key, error: entry.groundingError })) }; }
  dispose() {
    if (this.closed) return; this.closed = true;
    for (const key of this.entries.keys()) this.remove(key);
    this.group.removeFromParent();
  }
}
