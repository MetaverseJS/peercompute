import * as THREE from 'three';
import { prepareGeneratedMeshView, fitGeneratedMeshView } from '../../../shared/world/GeneratedMeshView.js';
import { normalizeWorldObjectDescriptor, objectPosition, WORLD_OBJECT_LIMITS } from '../../../shared/agents/WorldObjectAction.js';
import { normalizeWorldModelSize } from '../../../shared/world/WorldModelScale.js';

/** Cosmetic objects, independent of resident cubes and their physics bodies. */
export class CubeGeneratedObjectLayer {
  constructor({ scene, physics, getResidentPosition, resolvePlacement }) {
    if (!scene?.scene?.isScene || typeof getResidentPosition !== 'function') throw new TypeError('Generated objects require a scene and resident positions');
    this.scene = scene; this.physics = physics; this.getResidentPosition = getResidentPosition;
    this.resolvePlacement = resolvePlacement;
    this.supportsGroundedPlacement = typeof resolvePlacement === 'function';
    this.group = new THREE.Group(); this.group.name = 'CubeChat generated objects'; scene.scene.add(this.group);
    this.entries = new Map(); this.closed = false;

  }
  getPlacement(agentId, size, target) {
    if (this.closed) throw new Error('Generated object renderer is closed');
    normalizeWorldModelSize(size);
    if (this.supportsGroundedPlacement) {
      const obstacles = [...this.entries.values()].map(({ group }) => {
        group.updateWorldMatrix(true, true);
        const bounds = new THREE.Box3().setFromObject(group);
        return { min: bounds.min.toArray(), max: bounds.max.toArray() };
      });
      return objectPosition(this.resolvePlacement(agentId, size, target, { obstacles }));
    }
    if (target !== undefined) throw new Error('Grounded object placement is unavailable in this world');
    const position = objectPosition(this.getResidentPosition(agentId));
    const half = Number.isFinite(this.scene.gridSize) ? this.scene.gridSize / 2 : 1000;
    const x = Math.min(half - size, Math.max(-half + size, position[0] + 6 + size / 2));
    const z = Math.min(half - size, Math.max(-half + size, position[2]));
    const height = this.physics?.getGroundHeight?.(x, z);
    return objectPosition([x, Number.isFinite(height) ? height : Math.max(0, position[1] - 3), z]);
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
          fitGeneratedMeshView(view, placement.size); group.position.fromArray(placement.position);
          group.name = placement.name; group.userData.generatedObject = checkedDescriptor;
          this.remove(key); this.group.add(group); committed = true;
          this.entries.set(key, { group, descriptor: checkedDescriptor, dispose });
        },
        dispose,
      };
    } catch (error) { dispose(); throw error; }
  }
  remove(key) {
    const entry = this.entries.get(key); if (!entry) return;
    entry.group.removeFromParent(); entry.dispose(); this.entries.delete(key);
  }
  getStatus() { return { objects: this.entries.size, closed: this.closed }; }
  dispose() {
    if (this.closed) return; this.closed = true;
    for (const key of this.entries.keys()) this.remove(key);
    this.group.removeFromParent();
  }
}
