import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { validateGeneratedMesh } from '../../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { normalizeWorldObjectDescriptor, objectPosition, WORLD_OBJECT_LIMITS } from '../../../shared/agents/WorldObjectAction.js';

function disposeObject(root) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  root.traverse(item => {
    if (item.geometry) geometries.add(item.geometry);
    for (const material of Array.isArray(item.material) ? item.material : item.material ? [item.material] : []) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  root.removeFromParent();
  for (const value of [...geometries, ...materials, ...textures]) value.dispose();
}

/** Cosmetic objects, independent of resident cubes and their physics bodies. */
export class CubeGeneratedObjectLayer {
  constructor({ scene, physics, getResidentPosition }) {
    if (!scene?.scene?.isScene || typeof getResidentPosition !== 'function') throw new TypeError('Generated objects require a scene and resident positions');
    this.scene = scene; this.physics = physics; this.getResidentPosition = getResidentPosition;
    this.group = new THREE.Group(); this.group.name = 'CubeChat generated objects'; scene.scene.add(this.group);
    this.entries = new Map(); this.closed = false;
    const manager = new THREE.LoadingManager();
    // The validated profile is entirely in its BIN chunk. Never allow a future
    // loader feature to fetch URLs supplied by a remote generated asset.
    manager.setURLModifier(() => { throw new Error('Generated objects cannot load external resources'); });
    this.loader = new GLTFLoader(manager);
  }
  getPlacement(agentId, size) {
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
    const checked = validateGeneratedMesh(mesh);
    const asset = await this.loader.parseAsync(checked.data.slice().buffer, '');
    const root = asset.scene;
    let committed = false, released = false;
    const dispose = () => { if (!released) { released = true; disposeObject(root); } };
    try {
      signal?.throwIfAborted();
      if (this.closed) throw new Error('Generated object renderer is closed');
      const bounds = new THREE.Box3().setFromObject(root), size = bounds.getSize(new THREE.Vector3());
      const extent = Math.max(size.x, size.y, size.z);
      if (!Number.isFinite(extent) || extent <= 0) throw new Error('Generated mesh has no visible extent');
      const center = bounds.getCenter(new THREE.Vector3());
      root.position.set(-center.x, -bounds.min.y, -center.z);
      const group = new THREE.Group(); group.add(root);
      return {
        commit: (key, descriptor) => {
          if (this.closed || released || committed) throw new Error('Generated object preparation is no longer usable');
          const checkedDescriptor = normalizeWorldObjectDescriptor(descriptor);
          if (!this.entries.has(key) && this.entries.size >= WORLD_OBJECT_LIMITS.visible) throw new Error('World object display limit reached');
          const placement = checkedDescriptor.placement;
          group.scale.setScalar(placement.size / extent); group.position.fromArray(placement.position);
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
