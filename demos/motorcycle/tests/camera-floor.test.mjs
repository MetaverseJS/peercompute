import assert from 'node:assert/strict';
import test from 'node:test';

import * as THREE from 'three';

import { createTerrainCameraFloor } from '../src/view/terrainCameraFloor.js';

function terrain(sampleLocalHeight, localBounds = null) {
  return {
    schemaVersion: 'peercompute.geo.local-terrain-grid.v1',
    sampleLocalHeight,
    localBounds,
  };
}

test('desktop camera is clamped above the exact terrain surface and left alone when clear', () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  scene.add(camera);
  const floor = createTerrainCameraFloor(THREE, { minimumClearanceMeters: 0.35 });
  camera.position.set(3, 1, -4);
  let status = floor.apply({
    camera,
    mode: 'third',
    terrain: terrain((x, z) => {
      assert.equal(x, 3);
      assert.equal(z, -4);
      return 5;
    }),
  });
  assert.equal(status.status, 'clamped');
  assert.ok(Math.abs(camera.position.y - 5.35) < 1e-12);
  assert.ok(Math.abs(status.correctionMeters - 4.35) < 1e-12);

  camera.position.y = 8;
  status = floor.apply({ camera, mode: 'first', terrain: terrain(() => 5) });
  assert.equal(status.status, 'clear');
  assert.equal(camera.position.y, 8);
});

test('camera floor converts rebased coordinates back to the immutable rendered terrain frame', () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  scene.add(camera);
  camera.position.set(2, -3, 4);
  const floor = createTerrainCameraFloor(THREE);
  const status = floor.apply({
    camera,
    mode: 'third',
    originOffset: [100, 2, -50],
    terrain: terrain((x, z) => {
      assert.equal(x, 102);
      assert.equal(z, -46);
      return 12;
    }),
  });
  assert.equal(status.terrainHeightMeters, 10);
  assert.ok(Math.abs(camera.position.y - 10.35) < 1e-12);
});

test('XR floor moves only the locomotion root and never overwrites tracked camera pose', () => {
  const scene = new THREE.Scene();
  const xrRoot = new THREE.Group();
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(0, -2, 0);
  xrRoot.position.set(0, 1, 0);
  xrRoot.add(camera);
  scene.add(xrRoot);
  const originalTrackedPose = camera.position.clone();
  const floor = createTerrainCameraFloor(THREE);
  const status = floor.apply({
    camera,
    xrRoot,
    mode: 'xr',
    terrain: terrain(() => 3),
  });
  const world = new THREE.Vector3();
  camera.getWorldPosition(world);
  assert.equal(status.status, 'clamped');
  assert.ok(Math.abs(world.y - 3.35) < 1e-12);
  assert.deepEqual(camera.position.toArray(), originalTrackedPose.toArray());
  assert.equal(status.xrPolicy, 'move-locomotion-root-not-tracked-camera');
});

test('camera floor clamps edge queries and fails safe to the terrain maximum', () => {
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(20, -5, -20);
  const floor = createTerrainCameraFloor(THREE);
  let status = floor.apply({
    camera,
    mode: 'third',
    terrain: terrain((x, z) => {
      assert.equal(x, 1);
      assert.equal(z, -1);
      return 2;
    }, { minX: -1, maxX: 1, minY: -2, maxY: 7, minZ: -1, maxZ: 1 }),
  });
  assert.equal(status.sampleMode, 'nearest-terrain-edge');
  assert.ok(Math.abs(camera.position.y - 2.35) < 1e-12);
  assert.equal(camera.position.x, 20);
  assert.equal(camera.position.z, -20);

  camera.position.y = -5;
  status = floor.apply({
    camera,
    mode: 'third',
    terrain: terrain(() => Number.NaN, {
      minX: -1, maxX: 1, minY: -2, maxY: 7, minZ: -1, maxZ: 1,
    }),
  });
  assert.equal(status.sampleMode, 'terrain-maximum-fallback');
  assert.ok(Math.abs(camera.position.y - 7.35) < 1e-12);
});

test('camera floor follows the committed streaming composite instead of the seed grid', () => {
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(2, -5, 4);
  const floor = createTerrainCameraFloor(THREE, { minimumClearanceMeters: 0.5 });
  const status = floor.apply({
    camera,
    mode: 'third',
    terrain: null,
    sampleSurface(position) {
      assert.deepEqual(position, [2, -5, 4]);
      return {
        available: true,
        height: 12,
        surfaceKind: 'terrain',
        tileKey: '14/1/2',
        snapshotRevision: 3,
      };
    },
  });
  assert.equal(status.sampleMode, 'streaming-composite-surface');
  assert.equal(status.coordinateSpace, 'current-local-tangent-meters');
  assert.equal(status.terrainHeightMeters, 12);
  assert.equal(status.snapshotRevision, 3);
  assert.equal(camera.position.y, 12.5);

  camera.position.y = 7;
  const unavailable = floor.apply({
    camera,
    mode: 'third',
    sampleSurface: () => ({ available: false }),
  });
  assert.equal(unavailable.status, 'clamped-held');
  assert.equal(unavailable.sampleMode, 'streaming-composite-held');
  assert.equal(unavailable.snapshotRevision, 3);
  assert.equal(camera.position.y, 12.5);

  assert.equal(floor.transformReferenceFrame({
    transformPoint: ([x, y, z]) => [x - 100, y + 5, z + 40],
  }), true);
  camera.position.set(-98, 8, 44);
  const transformedHold = floor.apply({
    camera,
    mode: 'third',
    sampleSurface: () => ({ available: false }),
  });
  assert.equal(transformedHold.status, 'clamped-held');
  assert.equal(transformedHold.terrainHeightMeters, 17);
  assert.equal(camera.position.y, 17.5);

  const reset = floor.reset();
  assert.equal(reset.status, 'uninitialized');
  camera.position.set(1, 4, 2);
  const newLocationMiss = floor.apply({
    camera,
    mode: 'third',
    sampleSurface: () => ({ available: false }),
  });
  assert.equal(newLocationMiss.snapshotRevision, null);
  assert.equal(newLocationMiss.terrainHeightMeters, 3.5);
  assert.equal(camera.position.y, 4, 'a prior location floor cannot lift the new location');
});
