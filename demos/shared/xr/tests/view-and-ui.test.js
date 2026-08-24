import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TerminalButton,
  TerminalPanel,
  TerminalSlider,
  TerminalUIInteraction,
  ViewRig,
  createThreeHtmlUiBridge,
  createThreeTerminalPanel,
} from '../index.js';
import { FakeCamera, FakeNode } from './fixtures.js';

test('ViewRig coordinates first, damped third, and tracked XR modes without moving the XR camera', () => {
  const first = new FakeCamera('first');
  const third = new FakeCamera('third');
  const xr = new FakeCamera('xr');
  const anchor = new FakeNode('anchor');
  const activations = [];
  let recentered = 0;
  const rig = new ViewRig({
    firstCamera: first,
    thirdCamera: third,
    xrCamera: xr,
    xrAnchor: anchor,
    setActiveCamera: (camera, mode) => activations.push([camera?.name, mode]),
    recenter: () => { recentered += 1; },
  });

  let pose = rig.update({ position: [10, 0, 0], orientation: [0, 0, 0, 1], deltaTime: 1 / 60 });
  assert.deepEqual(pose.position, [10, 2.2, 5.2]);
  assert.deepEqual(third.lookTarget, [10, 1.1, -1.5]);
  rig.toggle();
  pose = rig.update({ position: [10, 0, 0], orientation: [0, 0, 0, 1] });
  assert.deepEqual(pose.position, [10, 1.35, -0.2]);
  assert.deepEqual(first.quaternion.toArray(), [0, 0, 0, 1]);

  rig.setXRActive(true);
  xr.position.set(44, 55, 66);
  pose = rig.update({ position: [20, 3, 4], orientation: [0, 0, 0, 1] });
  assert.deepEqual(anchor.position.toArray(), [20, 3, 4]);
  assert.deepEqual(xr.position.toArray(), [44, 55, 66], 'tracked XR camera is never overwritten');
  rig.consumeControlFrame({ cameraToggle: true, recenter: true });
  assert.equal(rig.getStatus().mode, 'xr');
  assert.equal(rig.getStatus().nonXRMode, 'third');
  assert.equal(recentered, 1);
  rig.setXRActive(false);
  assert.equal(rig.getStatus().mode, 'third');
  assert.deepEqual(activations.map((entry) => entry[1]), ['third', 'first', 'xr', 'third']);
  rig.dispose();
});

test('ViewRig resetPose and snap clear chase damping and invoke recenter only when requested', () => {
  const first = new FakeCamera('first');
  const third = new FakeCamera('third');
  let recentered = 0;
  const events = [];
  const rig = new ViewRig({
    firstCamera: first,
    thirdCamera: third,
    thirdDamping: 1,
    recenter: () => { recentered += 1; },
  });
  rig.subscribe((event) => events.push(event.type));

  rig.update({ position: [0, 0, 0], orientation: [0, 0, 0, 1], deltaTime: 0.1 });
  const damped = rig.update({ position: [100, 0, 0], orientation: [0, 0, 0, 1], deltaTime: 0.1 });
  assert.ok(damped.position[0] > 0 && damped.position[0] < 100);
  assert.equal(rig.getStatus().thirdPoseInitialized, true);

  rig.resetPose();
  assert.equal(recentered, 0);
  assert.equal(rig.getStatus().thirdPoseInitialized, false);
  const resetPose = rig.update({ position: [100, 0, 0], orientation: [0, 0, 0, 1], deltaTime: 0.001 });
  assert.deepEqual(resetPose.position, [100, 2.2, 5.2], 'next chase update snaps exactly after reset');

  rig.update({ position: [200, 0, 0], orientation: [0, 0, 0, 1], deltaTime: 0.1 });
  const snapped = rig.snap({
    position: [200, 0, 0],
    orientation: [0, 0, 0, 1],
    recenter: true,
  });
  assert.deepEqual(snapped.position, [200, 2.2, 5.2]);
  assert.equal(recentered, 1);
  rig.resetPose({ recenter: true });
  assert.equal(recentered, 2);
  assert.deepEqual(events, ['reset', 'reset', 'reset']);
  rig.dispose();
});

test('ViewRig composes application view-axis offsets into first-person and XR anchors', () => {
  const first = new FakeCamera('first');
  const third = new FakeCamera('third');
  const xr = new FakeCamera('xr');
  const anchor = new FakeNode('anchor');
  const vehicleForwardToCameraForward = [0, 1, 0, 0];
  const rig = new ViewRig({
    firstCamera: first,
    thirdCamera: third,
    xrCamera: xr,
    xrAnchor: anchor,
    firstOrientation: vehicleForwardToCameraForward,
    xrOrientation: vehicleForwardToCameraForward,
  });
  rig.setMode('first');
  let pose = rig.update({ position: [0, 0, 0], orientation: [0, 0, 0, 1] });
  assert.deepEqual(pose.orientation, vehicleForwardToCameraForward);
  assert.deepEqual(first.quaternion.toArray(), vehicleForwardToCameraForward);

  rig.setXRActive(true);
  pose = rig.update({ position: [1, 2, 3], orientation: [0, 0, 0, 1] });
  assert.deepEqual(pose.orientation, vehicleForwardToCameraForward);
  assert.deepEqual(anchor.quaternion.toArray(), vehicleForwardToCameraForward);
  assert.deepEqual(xr.quaternion.toArray(), [0, 0, 0, 1], 'tracked headset pose remains untouched');
  rig.dispose();
});

test('ViewRig shifts camera, XR anchor, and chase damping state through one origin rebase', () => {
  const first = new FakeCamera('first');
  const third = new FakeCamera('third');
  const xr = new FakeCamera('xr');
  const anchor = new FakeNode('anchor');
  const rig = new ViewRig({
    firstCamera: first,
    thirdCamera: third,
    xrCamera: xr,
    xrAnchor: anchor,
    thirdDamping: 2,
  });
  rig.update({ position: [100, 2, -30], orientation: [0, 0, 0, 1], deltaTime: 0.1 });
  rig.update({ position: [110, 2, -30], orientation: [0, 0, 0, 1], deltaTime: 0.1 });
  const before = third.position.toArray();
  first.position.set(90, 3, -20);
  anchor.position.set(101, 2, -31);

  const result = rig.shiftOrigin([80, 0, -25]);
  assert.deepEqual(result.shift, [80, 0, -25]);
  assert.deepEqual(third.position.toArray(), [before[0] - 80, before[1], before[2] + 25]);
  assert.deepEqual(first.position.toArray(), [10, 3, 5]);
  assert.deepEqual(anchor.position.toArray(), [21, 2, -6]);

  const rebasedPose = rig.update({
    position: [30, 2, -5],
    orientation: [0, 0, 0, 1],
    deltaTime: 0.1,
  });
  const unshiftedExpected = before[0] + (110 - before[0]) * (1 - Math.exp(-0.2));
  assert.ok(Math.abs((rebasedPose.position[0] + 80) - unshiftedExpected) < 1e-9,
    'damped chase position remains equivalent in the shifted frame');
  assert.throws(() => rig.shiftOrigin([0, Number.NaN, 0]), /finite/);
  rig.dispose();
});

test('terminal UI shares ray, poke, slider capture, and focus interaction semantics', () => {
  const activations = [];
  const sliderInputs = [];
  const sliderChanges = [];
  const panel = new TerminalPanel({ id: 'bike', title: 'BIKE', width: 100, height: 100 });
  const button = panel.add(new TerminalButton({
    id: 'reset',
    label: 'RESET',
    bounds: { x: 10, y: 10, width: 30, height: 20 },
    onActivate: (event) => activations.push(event),
  }));
  const slider = panel.add(new TerminalSlider({
    id: 'traffic',
    label: 'TRAFFIC',
    bounds: { x: 10, y: 50, width: 80, height: 20 },
    minimum: 0,
    maximum: 10,
    step: 1,
    onInput: (event) => sliderInputs.push(event.value),
    onChange: (event) => sliderChanges.push(event.value),
  }));
  const ui = new TerminalUIInteraction({ panel });

  ui.updatePointer({ id: 'left-ray', type: 'ray', x: 20, y: 20, pressed: false });
  assert.equal(button.hovered, true);
  ui.updatePointer({ id: 'left-ray', type: 'ray', x: 20, y: 20, pressed: true });
  ui.updatePointer({ id: 'left-ray', type: 'ray', x: 20, y: 20, pressed: false });
  assert.equal(activations.length, 1);
  assert.equal(activations[0].pointerType, 'ray');

  ui.updatePointer({ id: 'finger', type: 'poke', x: 30, y: 55, pressed: true });
  ui.updatePointer({ id: 'finger', type: 'poke', x: 82, y: 55, pressed: true });
  ui.updatePointer({ id: 'finger', type: 'poke', x: 82, y: 55, pressed: false });
  assert.equal(slider.value, 9);
  assert.ok(sliderInputs.includes(9));
  assert.deepEqual(sliderChanges, [9]);

  ui.focus('reset');
  ui.activateFocused();
  assert.equal(activations.length, 2);
  ui.focusNext(1);
  assert.equal(ui.getStatus().focusedControlId, 'traffic');
  ui.activateFocused({ adjustment: -2 });
  assert.equal(slider.value, 7);
  assert.ok(Object.isFrozen(ui.getStatus()));

  ui.removePointer('left-ray');
  ui.removePointer('finger');
  ui.dispose();
  assert.equal(button.focused, false);
  panel.dispose();
});

test('terminal UI can consume copied select state without a Gamepad', () => {
  let activations = 0;
  const panel = new TerminalPanel({ id: 'hand-ui', width: 100, height: 100 });
  panel.add(new TerminalButton({
    id: 'select',
    label: 'SELECT',
    bounds: { x: 10, y: 10, width: 40, height: 30 },
    onActivate: () => { activations += 1; },
  }));
  const ui = new TerminalUIInteraction({ panel });
  const intersection = { uv: { x: 0.2, y: 0.8 } };
  ui.updateFromIntersection({
    id: 'tracked-hand',
    type: 'poke',
    intersection,
    inputState: { select: { held: true }, hand: { tracked: true } },
  });
  ui.updateFromIntersection({
    id: 'tracked-hand',
    type: 'poke',
    intersection,
    inputState: { select: { held: false }, hand: { tracked: true } },
  });
  assert.equal(activations, 1);
  ui.dispose();
  panel.dispose();
});

function makeCanvas() {
  const calls = [];
  const context = new Proxy({ calls }, {
    get(target, property) {
      if (property in target) return target[property];
      return (...args) => calls.push([property, ...args]);
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  });
  return { width: 0, height: 0, context, getContext: () => context };
}

test('in-scene terminal fallback uses injected Three and disposes every owned resource', () => {
  class CanvasTexture {
    constructor(canvas) { this.canvas = canvas; this.needsUpdate = false; this.disposed = false; }
    dispose() { this.disposed = true; }
  }
  class PlaneGeometry {
    constructor(width, height) { this.width = width; this.height = height; this.disposed = false; }
    dispose() { this.disposed = true; }
  }
  class MeshBasicMaterial {
    constructor(options) { this.options = options; this.disposed = false; }
    dispose() { this.disposed = true; }
  }
  class Mesh extends FakeNode {
    constructor(geometry, material) { super(); this.geometry = geometry; this.material = material; }
  }
  const THREE = {
    CanvasTexture,
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    DoubleSide: 2,
    SRGBColorSpace: 'srgb',
  };
  const panel = new TerminalPanel({ id: 'panel', title: 'SYSTEM', width: 100, height: 50 });
  const button = panel.add(new TerminalButton({
    id: 'go',
    label: 'GO',
    bounds: { x: 10, y: 10, width: 40, height: 20 },
  }));
  const canvas = makeCanvas();
  const rendered = createThreeTerminalPanel({ THREE, panel, createCanvas: () => canvas });
  assert.equal(rendered.texture.colorSpace, 'srgb');
  assert.equal(rendered.texture.needsUpdate, true);
  assert.ok(canvas.context.calls.some((entry) => entry[0] === 'fillRect'));
  assert.deepEqual(rendered.coordinatesFromIntersection({ uv: { x: 0.25, y: 0.5 } }), { x: 25, y: 25 });
  const parent = new FakeNode();
  parent.add(rendered.mesh);
  button.setState({ focused: true });
  rendered.dispose();
  assert.equal(rendered.mesh.parent, null);
  assert.equal(rendered.mesh.geometry.disposed, true);
  assert.equal(rendered.mesh.material.disposed, true);
  assert.equal(rendered.texture.disposed, true);
  panel.dispose();
});

test('optional HTMLMesh bridge is dependency-injected and cleans scene/controller wiring', () => {
  class InteractiveGroup extends FakeNode {
    constructor(renderer, camera) {
      super('interactive-group');
      this.renderer = renderer;
      this.camera = camera;
      this.controllers = [];
      this.disconnected = false;
    }
    listenToXRControllerEvents(controller) { this.controllers.push(controller); }
    disconnect() { this.disconnected = true; }
  }
  class HTMLMesh extends FakeNode {
    constructor(root) { super('html-mesh'); this.root = root; this.disposed = false; }
    dispose() { this.disposed = true; }
  }
  const scene = new FakeNode('scene');
  const controller = new FakeNode('controller');
  const bridge = createThreeHtmlUiBridge({
    InteractiveGroup,
    HTMLMesh,
    renderer: {},
    camera: {},
    root: { id: 'accessible-ui' },
    scene,
  });
  assert.equal(scene.children[0], bridge.group);
  assert.equal(bridge.registerController(controller), true);
  assert.equal(bridge.registerController(controller), false);
  bridge.dispose();
  assert.equal(scene.children.length, 0);
  assert.equal(bridge.group.disconnected, true);
  assert.equal(bridge.mesh.disposed, true);
});
