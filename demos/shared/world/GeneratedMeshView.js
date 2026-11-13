import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { validateGeneratedMesh, getGeneratedMeshTextureSources } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { decodeGeneratedMeshTexture } from '../../../peercompute/src/peercompute/inference/GeneratedMeshTexture.js';
import { normalizeWorldModelSize, normalizeWorldObjectSize } from './WorldModelScale.js';
import { generatedMeshSupport } from './GeneratedMeshGrounding.js';

/** Uniform sizing preserves the generated proportions and its grounded origin. */
export function fitGeneratedMeshView(view, size, { profile = 'avatar' } = {}) {
  if (!['avatar', 'object'].includes(profile)) throw new TypeError('Unknown generated mesh size profile');
  const checked = profile === 'object' ? normalizeWorldObjectSize(size) : normalizeWorldModelSize(size);
  if (!Number.isFinite(view.extent) || view.extent <= 0 || !Number.isFinite(view.height) || view.height < 0) {
    throw new TypeError('Invalid generated mesh bounds');
  }
  view.group.scale.setScalar(checked / view.extent);
  view.worldSize = checked; view.renderedHeight = view.height * checked / view.extent;
  return view.renderedHeight;
}

function disposeObject(root, textures = new Set(), bitmaps = new Set()) {
  const geometries = new Set(), materials = new Set();
  root?.traverse(item => {
    if (item.geometry) geometries.add(item.geometry);
    for (const material of Array.isArray(item.material) ? item.material : item.material ? [item.material] : []) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  root?.removeFromParent();
  for (const value of [...geometries, ...materials, ...textures]) value.dispose();
  for (const bitmap of bitmaps) bitmap.close();
}

/** Decode only the self-contained generated mesh profile; share between objects and bodies. */
export async function prepareGeneratedMeshView(mesh, { signal, alignForward = false } = {}) {
  if (typeof alignForward !== 'boolean') throw new TypeError('Generated mesh forward alignment must be a boolean');
  signal?.throwIfAborted();
  const checked = validateGeneratedMesh(mesh);
  const manager = new THREE.LoadingManager();
  manager.setURLModifier(() => { throw new Error('Generated meshes cannot load external resources'); });
  const bitmaps = new Set(), textures = new Set(), images = [];
  let root;
  let released = false;
  const dispose = () => { if (!released) { released = true; disposeObject(root, textures, bitmaps); } };
  try {
    // Decode sequentially so cancellation/failure always releases earlier images.
    // Never use GLTFLoader's URL path: its standard embedded-image path creates
    // blob URLs, while our isolated decoder needs no network permission at all.
    for (const source of getGeneratedMeshTextureSources(checked)) {
      const bitmap = await decodeGeneratedMeshTexture(source.data, source.mimeType, { signal });
      bitmaps.add(bitmap); images.push(bitmap);
    }
    const filters = { 9728: THREE.NearestFilter, 9729: THREE.LinearFilter, 9984: THREE.NearestMipmapNearestFilter,
      9985: THREE.LinearMipmapNearestFilter, 9986: THREE.NearestMipmapLinearFilter, 9987: THREE.LinearMipmapLinearFilter };
    const wraps = { 33071: THREE.ClampToEdgeWrapping, 33648: THREE.MirroredRepeatWrapping, 10497: THREE.RepeatWrapping };
    const loader = new GLTFLoader(manager);
    loader.register(parser => ({ name: 'PEERCOMPUTE_embedded_textures', loadTexture(index) {
      const entry = parser.json.textures[index], sampler = parser.json.samplers?.[entry.sampler] ?? {};
      const texture = new THREE.Texture(images[entry.source]);
      texture.flipY = false;
      texture.magFilter = filters[sampler.magFilter] ?? THREE.LinearFilter;
      texture.minFilter = filters[sampler.minFilter] ?? THREE.LinearMipmapLinearFilter;
      texture.wrapS = wraps[sampler.wrapS] ?? THREE.RepeatWrapping;
      texture.wrapT = wraps[sampler.wrapT] ?? THREE.RepeatWrapping;
      texture.generateMipmaps = ![THREE.NearestFilter, THREE.LinearFilter].includes(texture.minFilter);
      texture.needsUpdate = true;
      textures.add(texture); parser.associations.set(texture, { textures: index });
      return Promise.resolve(texture);
    } }));
    const asset = await loader.parseAsync(checked.data.slice().buffer, '');
    root = asset.scene;
    signal?.throwIfAborted();
    const bounds = new THREE.Box3().setFromObject(root), size = bounds.getSize(new THREE.Vector3());
    const extent = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(extent) || extent <= 0) throw new Error('Generated mesh has no visible extent');
    const center = bounds.getCenter(new THREE.Vector3());
    root.position.set(-center.x, -bounds.min.y, -center.z);
    const group = new THREE.Group(); group.add(root);
    const support = generatedMeshSupport(root);
    // SF3D's export turns its camera-facing +X side into glTF -Z. Resident
    // bodies face +Z; align only that known convention when the caller opts in.
    // Existing TripoSR/unknown meshes and placed props keep their original yaw.
    // The validated generator string is a cosmetic hint, never authority.
    if (alignForward && asset.asset?.generator === 'SF3D-WebGPU') group.rotation.y = Math.PI;
    return { group, extent, height: size.y, support, dispose, get released() { return released; } };
  } catch (error) { dispose(); throw error; }
}
