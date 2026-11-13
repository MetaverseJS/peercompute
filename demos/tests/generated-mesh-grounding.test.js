import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { generatedMeshSupport, groundGeneratedMeshView, generatedGroundSurfaceSampler } from '../shared/world/GeneratedMeshGrounding.js';
import { fitGeneratedMeshView, prepareGeneratedMeshView } from '../shared/world/GeneratedMeshView.js';
import { meshFixture } from './world-generated-fixtures.js';

test('support projection contacts elevated and depressed surfaces without changing yaw, uniform scale or saved coordinates', async () => {
  const view = await prepareGeneratedMeshView(meshFixture()), position = [7, 0, -12];
  try {
    view.group.rotation.y = .7;
    fitGeneratedMeshView(view, 96, { profile: 'object' });
    const rotation = view.group.quaternion.toArray(), scale = view.group.scale.toArray();
    for (const height of [14, -9]) {
      const receipt = groundGeneratedMeshView(view, position, () => height);
      const bounds = new THREE.Box3().setFromObject(view.group);
      assert(Math.abs(bounds.min.y - height) < 1e-8);
      assert.deepEqual(view.group.quaternion.toArray(), rotation);
      assert.deepEqual(view.group.scale.toArray(), scale);
      assert.equal(receipt.method, 'sampled-support');
      assert.equal(receipt.authoritativeY, 0);
      assert.deepEqual(position, [7, 0, -12]);
    }
    assert.throws(() => fitGeneratedMeshView(view, 96), /48/, 'avatar default retains its separate size bound');
  } finally { view.dispose(); }
});

test('rolling terrain uses actual support points rather than the empty center of an AABB', () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([-4, 0, -3, 4, 2, -3, 0, 1, 3, 0, 8, 0], 3));
  geometry.setIndex([0, 1, 3, 1, 2, 3, 2, 0, 3, 0, 2, 1]);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial()), group = new THREE.Group(); group.add(mesh);
  const support = generatedMeshSupport(mesh), view = { group, support };
  const terrain = (x, z) => Math.sin(x / 5) * 2 + Math.cos(z / 7) * 3;
  group.rotation.y = .35; group.scale.setScalar(2);
  try {
    const receipt = groundGeneratedMeshView(view, [30, 0, 40], terrain);
    const gaps = support.map(sample => {
      const point = new THREE.Vector3().fromArray(sample).multiply(group.scale).applyQuaternion(group.quaternion).add(group.position);
      return point.y - terrain(point.x, point.z);
    });
    assert(gaps.every(gap => gap >= -1e-8)); assert(Math.abs(Math.min(...gaps)) < 1e-8);
    assert(gaps.some(gap => gap > .1), 'irregular support is not falsely described as a flattened base');
    assert.equal(group.rotation.x, 0); assert.equal(group.rotation.z, 0);
    assert.equal(receipt.samples, support.length);
    assert.throws(() => groundGeneratedMeshView(view, [30, 0, 40], () => undefined), /supporting surface/);
  } finally { geometry.dispose(); mesh.material.dispose(); }
});

test('displaced regular floor sampling matches rendered triangle intersections, including its diagonal and transformed edges', () => {
  const geometry = new THREE.PlaneGeometry(20, 16, 4, 3), attr = geometry.getAttribute('position');
  for (let i = 0; i < attr.count; i++) attr.setZ(i, Math.sin(attr.getX(i)) * 2 + Math.cos(attr.getY(i)) * 3);
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), floor = new THREE.Mesh(geometry, material);
  floor.rotation.set(-Math.PI / 2, 0, 0); floor.position.set(7, -4, 9); floor.scale.set(2, 1.5, 3); floor.updateWorldMatrix(true, false);
  try {
    const sample = generatedGroundSurfaceSampler(floor), ray = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);
    for (const [x, z] of [[7, 9], [-12.999, -2.999], [26.999, 20.999], [4.8, 11.7], [11.8, 5.1], [1.2, 17.1]]) {
      ray.ray.origin.set(x, 40, z);
      const hit = ray.intersectObject(floor)[0]; assert(hit);
      assert(Math.abs(sample(x, z) - hit.point.y) < 1e-5, 'sample equals the actual rendered triangle, not the analytic source function');
    }
    assert.equal(sample(100, 100), undefined);
  } finally { geometry.dispose(); material.dispose(); }
});

test('support sample count stays bounded while retaining the lowest contact in each occupied cell', () => {
  const geometry = new THREE.PlaneGeometry(10, 10, 100, 100); geometry.rotateX(-Math.PI / 2);
  const attr = geometry.getAttribute('position'); attr.setY(0, -2);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  try {
    const samples = generatedMeshSupport(mesh);
    assert(samples.length <= 64); assert.equal(Math.min(...samples.map(point => point[1])), -2);
  } finally { geometry.dispose(); mesh.material.dispose(); }
});

test('unused buffer vertices cannot become imaginary support contacts', () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, -1, 1, 0, -1, 0, 0, 1, 0, -10, 0], 3));
  geometry.setIndex([0, 1, 2]);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  try { assert(generatedMeshSupport(mesh).every(point => point[1] === 0)); }
  finally { geometry.dispose(); mesh.material.dispose(); }
});
