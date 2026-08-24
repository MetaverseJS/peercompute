import assert from 'node:assert/strict';
import test from 'node:test';

import { createMotorcycleInputRuntime } from '../src/input/runtimeInput.js';
import {
  createMotorcycleXrInputMapper,
  mapMotorcycleXrInput,
} from '../src/input/xrMotorcycleMapping.js';
import {
  FakeElement,
  FakeEventTarget,
  FakePointerLockDocument,
  FakePointerLockElement,
  fakeEvent,
} from '../../shared/xr/tests/fixtures.js';

test('motorcycle input runtime merges keyboard, touch, and virtual controls', async () => {
  const windowTarget = new FakeEventTarget();
  const steer = new FakeElement();
  const throttle = new FakeElement();
  let now = 10;
  const runtime = createMotorcycleInputRuntime({
    eventTarget: windowTarget,
    getGamepads: () => [],
    touchControls: [
      { element: steer, action: 'steer', mode: 'axis-x' },
      { element: throttle, action: 'throttle', mode: 'axis-y', invert: true },
    ],
    now: () => now,
  });

  windowTarget.dispatchEvent(fakeEvent('keydown', { code: 'KeyW' }));
  steer.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 100,
    clientY: 50,
  }));
  throttle.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 2,
    pointerType: 'touch',
    clientX: 50,
    clientY: 20,
  }));
  runtime.setVirtualControl({ rearBrake: 0.35 });

  const frame = runtime.poll();
  assert.equal(frame.time, 10);
  assert.equal(frame.control.throttle, 1);
  assert.equal(frame.control.steer, 1);
  assert.equal(frame.control.rearBrake, 0.35);
  assert.deepEqual(frame.actions.throttle.sources, ['keyboard-pointer', 'touch']);

  runtime.setUiContextActive(true);
  now = 11;
  const captured = runtime.poll();
  assert.equal(captured.control.throttle, 0);
  assert.equal(captured.control.steer, 0);
  assert.equal(captured.contexts.captures.throttle, 'ui');

  runtime.setUiContextActive(false);
  runtime.clearVirtualControl();
  windowTarget.dispatchEvent(fakeEvent('keyup', { code: 'KeyW' }));
  steer.dispatchEvent(fakeEvent('pointerup', { pointerId: 1, pointerType: 'touch' }));
  throttle.dispatchEvent(fakeEvent('pointerup', { pointerId: 2, pointerType: 'touch' }));
  const released = runtime.poll();
  assert.equal(released.control.throttle, 0);
  assert.equal(released.control.steer, 0);
  assert.equal(released.control.rearBrake, 0);

  await runtime.dispose();
  assert.equal(runtime.getStatus().disposed, true);
  assert.equal(windowTarget.listenerCount(), 0);
  assert.equal(steer.listenerCount(), 0);
  assert.equal(throttle.listenerCount(), 0);
});

test('motorcycle input runtime reports WebXR unavailable without a renderer XR bridge', async () => {
  const runtime = createMotorcycleInputRuntime({
    eventTarget: new FakeEventTarget(),
    getGamepads: () => [],
  });
  assert.equal(await runtime.checkXRSupport(), false);
  await assert.rejects(() => runtime.enterXR(), /WebXR is unavailable/);
  assert.equal(runtime.getStatus().xr.available, false);
  await runtime.dispose();
});

test('motorcycle pointer controls request lock from a primary canvas gesture and expose lifecycle status', async () => {
  const documentTarget = new FakePointerLockDocument();
  const pointerTarget = new FakePointerLockElement(documentTarget);
  const runtime = createMotorcycleInputRuntime({
    eventTarget: new FakeEventTarget(),
    pointerTarget,
    getGamepads: () => [],
  });
  pointerTarget.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 7,
    pointerType: 'mouse',
    button: 0,
    clientX: 20,
    clientY: 30,
  }));
  assert.equal(pointerTarget.pointerLockRequests.length, 1);
  assert.equal(runtime.getStatus().keyboard.pointerLocked, true);
  documentTarget.exitPointerLock();
  assert.equal(runtime.getStatus().keyboard.pointerLocked, false);
  await runtime.dispose();
});

test('RoadVector maps copied XR hand select and squeeze state without a Gamepad', () => {
  const right = mapMotorcycleXrInput({
    handedness: 'right',
    xrStandard: null,
    select: { held: true },
    squeeze: { held: true },
  }, { handedness: 'right' });
  assert.equal(right.throttle, 1);
  assert.equal(right.frontBrake, 1);

  const left = mapMotorcycleXrInput({
    handedness: 'left',
    xrStandard: null,
    select: { held: true },
    squeeze: { held: true },
  }, { handedness: 'left' });
  assert.equal(left.rearBrake, 1);
  assert.equal(left.clutch, 1);
});

test('RoadVector calibrates tracked-hand target-ray pose into bounded steering', () => {
  const mapper = createMotorcycleXrInputMapper({ deadzone: 0.1, handSteerRangeRadians: 0.5 });
  const entry = { id: 'left-hand', handedness: 'left', inputSource: {} };
  const source = (yaw) => ({
    role: 'hand',
    handedness: 'left',
    xrStandard: null,
    select: { held: false },
    squeeze: { held: false },
    poses: {
      targetRay: {
        orientation: [0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)],
      },
    },
  });
  assert.equal(mapper(source(0.25), entry).steer, 0, 'first tracked pose establishes neutral steering');
  const right = mapper(source(0.5), entry).steer;
  const left = mapper(source(0), entry).steer;
  assert.ok(right > 0.4 && right < 0.6);
  assert.ok(left < -0.4 && left > -0.6);
  assert.equal(mapper(source(2), entry).steer, 1, 'hand pose steering is hard-clamped');
  assert.equal(mapper({
    ...source(2),
    poses: { targetRay: { ...source(2).poses.targetRay, visible: false } },
  }, entry).steer, 0, 'temporarily untracked hand poses cannot retain steering');
  const rightEntry = { id: 'right-hand', handedness: 'right', inputSource: {} };
  const rightSource = (yaw) => ({ ...source(yaw), handedness: 'right' });
  assert.equal(mapper(rightSource(-0.4), rightEntry).steer, 0);
  assert.equal(mapper(rightSource(0.4), rightEntry).steer, 0,
    'right throttle/pointer hand cannot override left-hand steering');
  assert.throws(() => createMotorcycleXrInputMapper({ handSteerRangeRadians: 0 }), /handSteerRangeRadians/);
});
