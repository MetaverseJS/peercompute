import assert from 'node:assert/strict';
import test from 'node:test';

import * as THREE from 'three';

import { createMotorcycleXrPanel } from '../src/runtime/xrPanel.js';

function createCanvas() {
  const context = new Proxy({}, {
    get(target, property) {
      if (!(property in target)) target[property] = () => {};
      return target[property];
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  });
  return { width: 0, height: 0, getContext: () => context };
}

function xrEntry({ id, handedness, role, handObject = null } = {}) {
  const targetRayObject = new THREE.Group();
  targetRayObject.name = `${id}:ray`;
  const gripObject = role === 'controller' ? new THREE.Group() : null;
  return {
    id,
    handedness,
    role,
    targetRayObject,
    gripObject,
    handObject,
    inputSource: {
      gamepad: role === 'controller'
        ? { buttons: [{ pressed: false, value: 0 }] }
        : null,
    },
    inputState: { select: { held: false } },
  };
}

test('XR ride panel mounts to a tracked wrist, ignores its owner ray, and captures only controls', () => {
  const root = new THREE.Group();
  const handRoot = new THREE.Group();
  const wrist = new THREE.Group();
  handRoot.joints = { wrist };
  handRoot.add(wrist);
  const owner = xrEntry({
    id: 'left-hand',
    handedness: 'left',
    role: 'hand',
    handObject: handRoot,
  });
  const pointer = xrEntry({ id: 'right-controller', handedness: 'right', role: 'controller' });
  let entries = [owner, pointer];
  const raycasted = [];
  let cameraToggles = 0;
  const panel = createMotorcycleXrPanel({
    THREE,
    scene: root,
    registry: { getEntries: () => entries },
    createCanvas,
    createRaycaster: () => ({
      current: null,
      setFromXRController(object) {
        this.current = object;
        raycasted.push(object.name);
      },
      intersectObject() {
        return this.current.userData.intersection ? [this.current.userData.intersection] : [];
      },
    }),
    onCameraToggle: () => { cameraToggles += 1; },
  });

  const blankUv = new THREE.Vector2(0.5, 1 - 50 / 620);
  pointer.targetRayObject.userData.intersection = { uv: blankUv };
  let state = panel.update();
  assert.equal(panel.mesh.parent, wrist, 'hand panels mount to the tracked wrist joint');
  assert.equal(state.mountOwnerId, owner.id);
  assert.deepEqual(raycasted, [pointer.targetRayObject.name], 'the mounting source never raycasts itself');
  assert.equal(state.surfaceHovered, true);
  assert.equal(state.hovered, false, 'blank panel space is not an interactive hover');
  assert.equal(state.captureGameplay, false, 'blank panel space never suppresses ride controls');

  pointer.targetRayObject.userData.intersection = {
    uv: new THREE.Vector2(200 / 1_000, 1 - 170 / 620),
  };
  state = panel.update();
  assert.equal(state.hovered, true);
  assert.equal(state.captureGameplay, true);
  pointer.inputSource.gamepad.buttons[0] = { pressed: true, value: 1 };
  panel.update();
  pointer.targetRayObject.userData.intersection = { uv: blankUv };
  state = panel.update();
  assert.equal(state.captureGameplay, true, 'a captured control retains UI context over blank panel space while pressed');
  pointer.inputSource.gamepad.buttons[0] = { pressed: false, value: 0 };
  pointer.targetRayObject.userData.intersection = {
    uv: new THREE.Vector2(200 / 1_000, 1 - 170 / 620),
  };
  state = panel.update();
  assert.equal(cameraToggles, 1, 'release over the same button activates exactly once');
  assert.equal(state.captureGameplay, true);

  entries = [owner];
  owner.targetRayObject.userData.intersection = { uv: blankUv };
  state = panel.update();
  assert.equal(state.pointers, 1, 'a sole input source keeps an interactive panel pointer');
  assert.equal(state.mountOwnerId, null);
  assert.equal(state.mountMode, 'xr-root-fallback');
  assert.equal(panel.mesh.parent, root, 'sole-source panels mount in the XR root instead of self-excluding');
  delete handRoot.joints.wrist;
  state = panel.update();
  assert.equal(state.mounted, true, 'a missing wrist retains the explicit XR-root fallback');
  entries = [];
  state = panel.update();
  assert.equal(state.mounted, false, 'the panel hides when no XR input source exists');
  assert.equal(panel.mesh.visible, false);

  panel.dispose();
  assert.equal(panel.getStatus().disposed, true);
});
