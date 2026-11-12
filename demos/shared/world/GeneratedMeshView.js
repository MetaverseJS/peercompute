import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { validateGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { normalizeWorldModelSize } from './WorldModelScale.js';

/** Uniform sizing preserves the generated proportions and its grounded origin. */
export function fitGeneratedMeshView(view, size) {
  const checked = normalizeWorldModelSize(size);
  if (!Number.isFinite(view.extent) || view.extent <= 0 || !Number.isFinite(view.height) || view.height < 0) {
    throw new TypeError('Invalid generated mesh bounds');
  }
  view.group.scale.setScalar(checked / view.extent);
  view.worldSize = checked; view.renderedHeight = view.height * checked / view.extent;
  return view.renderedHeight;
}

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

/** Decode only the self-contained generated mesh profile; share between objects and bodies. */
export async function prepareGeneratedMeshView(mesh, { signal } = {}) {
  signal?.throwIfAborted();
  const checked = validateGeneratedMesh(mesh);
  const manager = new THREE.LoadingManager();
  manager.setURLModifier(() => { throw new Error('Generated meshes cannot load external resources'); });
  const asset = await new GLTFLoader(manager).parseAsync(checked.data.slice().buffer, '');
  const root = asset.scene;
  let released = false;
  const dispose = () => { if (!released) { released = true; disposeObject(root); } };
  try {
    signal?.throwIfAborted();
    const bounds = new THREE.Box3().setFromObject(root), size = bounds.getSize(new THREE.Vector3());
    const extent = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(extent) || extent <= 0) throw new Error('Generated mesh has no visible extent');
    const center = bounds.getCenter(new THREE.Vector3());
    root.position.set(-center.x, -bounds.min.y, -center.z);
    const group = new THREE.Group(); group.add(root);
    return { group, extent, height: size.y, dispose, get released() { return released; } };
  } catch (error) { dispose(); throw error; }
}
