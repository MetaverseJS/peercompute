import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ActionInput,
  KeyboardPointerAdapter,
  MultiTouchAdapter,
  StandardGamepadAdapter,
} from '../index.js';
import {
  FakeElement,
  FakeEventTarget,
  FakePointerLockDocument,
  FakePointerLockElement,
  fakeEvent,
  makeGamepad,
} from './fixtures.js';

test('ActionInput emits immutable held and edge state with deterministic context capture', () => {
  let now = 10;
  const input = new ActionInput({ now: () => now });
  input.replaceSourceState('keyboard', {
    steer: -0.5,
    throttle: 0.6,
    shiftDelta: 1,
    reset: 1,
  });
  input.replaceSourceState('pad', { steer: 0.8, throttle: 0.4 });

  const first = input.sample();
  assert.equal(first.time, 10);
  assert.deepEqual(first.control, {
    sequence: 1,
    steer: 0.8,
    throttle: 0.6,
    frontBrake: 0,
    rearBrake: 0,
    clutch: 0,
    shiftDelta: 1,
    handbrake: false,
    reset: true,
    cameraToggle: false,
    recenter: false,
  });
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.control));
  assert.ok(Object.isFrozen(first.actions.steer.sources));
  assert.throws(() => { first.control.throttle = 0; }, TypeError);

  now = 11;
  const held = input.sample();
  assert.equal(held.control.throttle, 0.6);
  assert.equal(held.control.shiftDelta, 0);
  assert.equal(held.control.reset, false);
  assert.equal(held.actions.reset.held, true);

  input.defineContext('menu', { priority: 100, capture: ['throttle', 'reset'] });
  input.replaceSourceState('menu-ui', { reset: 1 }, { context: 'menu' });
  input.setSourceState('keyboard', { reset: 0 });
  const captured = input.sample();
  assert.equal(captured.control.throttle, 0);
  assert.equal(captured.control.reset, false, 'held reset from a newly selected context does not repeat');
  assert.equal(captured.contexts.captures.throttle, 'menu');

  input.replaceSourceState('menu-ui', { reset: 0 });
  input.sample();
  input.replaceSourceState('menu-ui', { reset: 1 });
  assert.equal(input.sample().control.reset, true);
  input.setContextEnabled('menu', false);
  const gameplayAgain = input.sample();
  assert.equal(gameplayAgain.control.throttle, 0.6);
  assert.equal(gameplayAgain.contexts.captures.throttle, null);
  input.dispose();
});

test('ActionInput accepts a reusable application-defined action schema', () => {
  const input = new ActionInput({
    actions: {
      moveX: { minimum: -1, maximum: 1, combine: 'sum-clamp' },
      jump: { minimum: 0, maximum: 1, combine: 'maximum', edge: 'press', boolean: true },
      menuAccept: { minimum: 0, maximum: 1, combine: 'latest', edge: 'press', boolean: true },
    },
  });
  assert.deepEqual(input.getActionNames(), ['moveX', 'jump', 'menuAccept']);
  assert.equal(input.hasAction('throttle'), false);
  input.replaceSourceState('left', { moveX: -0.7, jump: 1, throttle: 1 });
  input.replaceSourceState('right', { moveX: 0.2 });
  const first = input.sample();
  assert.equal(first.control.sequence, 1);
  assert.ok(Math.abs(first.control.moveX + 0.5) < 1e-12);
  assert.equal(first.control.jump, true);
  assert.equal(first.control.menuAccept, false);
  assert.equal(input.sample().control.jump, false);
  input.defineContext('menu', { priority: 10, capture: ['menuAccept'] });
  input.replaceSourceState('menu', { menuAccept: 1 }, { context: 'menu' });
  assert.equal(input.sample().control.menuAccept, true);
  assert.throws(() => input.defineContext('bad', { capture: ['throttle'] }), /unknown captured action/);
  input.dispose();
});

test('keyboard and desktop pointer drag publish combined controls and fully clean listeners', () => {
  const input = new ActionInput();
  const keys = new FakeEventTarget();
  const surface = new FakeElement();
  const adapter = new KeyboardPointerAdapter({
    input,
    target: keys,
    pointerTarget: surface,
    pointerSpan: 100,
  });
  keys.dispatchEvent(fakeEvent('keydown', { code: 'KeyW' }));
  keys.dispatchEvent(fakeEvent('keydown', { code: 'KeyC' }));
  let frame = input.sample().control;
  assert.equal(frame.throttle, 1);
  assert.equal(frame.cameraToggle, true);
  assert.equal(input.sample().control.cameraToggle, false);

  surface.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 7,
    pointerType: 'mouse',
    button: 0,
    clientX: 100,
    clientY: 100,
  }));
  surface.dispatchEvent(fakeEvent('pointermove', {
    pointerId: 7,
    pointerType: 'mouse',
    clientX: 160,
    clientY: 50,
  }));
  frame = input.sample().control;
  assert.equal(frame.steer, 0.6);
  assert.equal(frame.throttle, 1, 'keyboard throttle and pointer pedal merge by maximum');

  keys.dispatchEvent(fakeEvent('keyup', { code: 'KeyW' }));
  frame = input.sample().control;
  assert.equal(frame.throttle, 0.5);
  surface.dispatchEvent(fakeEvent('pointerup', { pointerId: 7, pointerType: 'mouse', button: 0, buttons: 0 }));
  assert.equal(input.sample().control.steer, 0);

  assert.ok(keys.listenerCount() > 0);
  assert.ok(surface.listenerCount() > 0);
  adapter.dispose();
  assert.equal(keys.listenerCount(), 0);
  assert.equal(surface.listenerCount(), 0);
  assert.equal(input.getStatus().sources.length, 0);
});

test('pointer lock is gesture-opt-in, accumulates relative movement, and resets every lifecycle edge', async () => {
  const passiveInput = new ActionInput();
  const passiveKeys = new FakeEventTarget();
  const passiveDocument = new FakePointerLockDocument();
  const passiveSurface = new FakePointerLockElement(passiveDocument);
  const passive = new KeyboardPointerAdapter({
    input: passiveInput,
    target: passiveKeys,
    pointerTarget: passiveSurface,
    documentTarget: passiveDocument,
  });
  passiveSurface.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    clientX: 10,
    clientY: 10,
  }));
  assert.equal(passiveSurface.pointerLockRequests.length, 0, 'normal pointer gestures never auto-lock');
  passive.dispose();
  passiveInput.dispose();

  const input = new ActionInput();
  const keys = new FakeEventTarget();
  const documentTarget = new FakePointerLockDocument();
  const surface = new FakePointerLockElement(documentTarget);
  const adapter = new KeyboardPointerAdapter({
    input,
    target: keys,
    pointerTarget: surface,
    documentTarget,
    pointerSpan: 100,
    pointerLock: { requestOnPointerDown: true, options: { unadjustedMovement: true } },
  });

  surface.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 7,
    pointerType: 'mouse',
    button: 0,
    clientX: 100,
    clientY: 100,
  }));
  assert.deepEqual(surface.pointerLockRequests, [{ unadjustedMovement: true }]);
  assert.equal(adapter.getStatus().pointerLocked, true);
  surface.dispatchEvent(fakeEvent('pointermove', { movementX: 20, movementY: -10 }));
  surface.dispatchEvent(fakeEvent('pointermove', { movementX: 15, movementY: -20 }));
  let frame = input.sample().control;
  assert.equal(frame.steer, 0.35, 'relative movement is accumulated while locked');
  assert.equal(frame.throttle, 0.3);
  assert.deepEqual(adapter.getStatus().lockedMovement, { x: 35, y: -30 });

  keys.dispatchEvent(fakeEvent('keydown', { code: 'KeyW' }));
  documentTarget.setPointerLock(null);
  frame = input.sample().control;
  assert.equal(frame.steer, 0);
  assert.equal(frame.throttle, 0, 'lock loss clears pointer and held keyboard state');
  assert.equal(adapter.getStatus().pointerLocked, false);

  assert.equal(await adapter.requestPointerLock(), true, 'applications can request lock from their own gesture');
  surface.dispatchEvent(fakeEvent('pointermove', { movementX: -50, movementY: 40 }));
  assert.equal(input.sample().control.steer, -0.5);
  keys.dispatchEvent(fakeEvent('blur'));
  assert.equal(input.sample().control.steer, 0, 'blur clears accumulated lock movement');
  surface.dispatchEvent(fakeEvent('pointermove', { movementX: 10, movementY: -10 }));
  documentTarget.setHidden(true);
  assert.equal(input.sample().control.throttle, 0, 'visibility changes clear accumulated state');

  adapter.stop();
  assert.equal(documentTarget.exitCalls, 1);
  assert.equal(keys.listenerCount(), 0);
  assert.equal(surface.listenerCount(), 0);
  assert.equal(documentTarget.listenerCount(), 0);
  assert.equal(input.getStatus().sources.length, 0);

  adapter.start();
  await adapter.requestPointerLock();
  surface.dispatchEvent(fakeEvent('pointermove', { movementX: 100, movementY: 0 }));
  adapter.dispose();
  assert.equal(documentTarget.exitCalls, 2);
  assert.deepEqual(adapter.getStatus().lockedMovement, { x: 0, y: 0 });
  assert.equal(adapter.getStatus().disposed, true);
  assert.equal(adapter.getStatus().started, false);
  assert.equal(keys.listenerCount(), 0);
  assert.equal(surface.listenerCount(), 0);
  assert.equal(documentTarget.listenerCount(), 0);
  assert.equal(input.getStatus().sources.length, 0, 'dispose removes restarted source state');
  input.dispose();
});

test('standard gamepad polling snapshots live arrays before edge detection and clears disconnects', () => {
  const input = new ActionInput();
  const events = new FakeEventTarget();
  const buttons = Array.from({ length: 10 }, () => ({ value: 0, pressed: false }));
  buttons[7] = { value: 0.75, pressed: true };
  buttons[8] = { value: 1, pressed: true };
  const pad = makeGamepad({ axes: [0.5, 0], buttons });
  let gamepads = [pad];
  const adapter = new StandardGamepadAdapter({
    input,
    eventTarget: events,
    getGamepads: () => gamepads,
    deadzone: 0,
  });

  const snapshots = adapter.poll();
  pad.axes[0] = -1;
  pad.buttons[7].value = 0;
  pad.buttons[7].pressed = false;
  const frame = input.sample().control;
  assert.equal(frame.steer, 0.5);
  assert.equal(frame.throttle, 0.75, 'analog button value is preserved in the cloned poll snapshot');
  assert.equal(frame.reset, true);
  assert.equal(snapshots[0].axes[0], 0.5);
  assert.ok(Object.isFrozen(snapshots[0]));
  assert.equal(input.sample().control.reset, false);

  gamepads = [];
  adapter.poll();
  assert.equal(input.sample().control.throttle, 0);
  assert.equal(adapter.getSnapshots().length, 0);
  adapter.dispose();
  assert.equal(events.listenerCount(), 0);
});

test('multitouch Pointer Events retain independent simultaneous controls and restore DOM state', () => {
  const input = new ActionInput();
  const steering = new FakeElement({ left: 0, top: 0, width: 200, height: 100 });
  const throttle = new FakeElement({ left: 200, top: 0, width: 100, height: 100 });
  const adapter = new MultiTouchAdapter({
    input,
    controls: [
      { element: steering, action: 'steer', mode: 'axis-x', deadzone: 0 },
      { element: throttle, action: 'throttle', mode: 'button' },
    ],
  });
  assert.equal(steering.style.touchAction, 'none');
  assert.equal(throttle.style.touchAction, 'none');

  steering.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 150,
    clientY: 50,
  }));
  throttle.dispatchEvent(fakeEvent('pointerdown', {
    pointerId: 2,
    pointerType: 'touch',
    pressure: 0,
    clientX: 250,
    clientY: 50,
  }));
  let frame = input.sample().control;
  assert.equal(frame.steer, 0.5);
  assert.equal(frame.throttle, 1);

  steering.dispatchEvent(fakeEvent('pointermove', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 50,
    clientY: 50,
  }));
  throttle.dispatchEvent(fakeEvent('pointerup', { pointerId: 2, pointerType: 'touch' }));
  frame = input.sample().control;
  assert.equal(frame.steer, -0.5);
  assert.equal(frame.throttle, 0);
  steering.dispatchEvent(fakeEvent('pointercancel', { pointerId: 1, pointerType: 'touch' }));
  assert.equal(input.sample().control.steer, 0);

  adapter.dispose();
  assert.equal(steering.listenerCount(), 0);
  assert.equal(throttle.listenerCount(), 0);
  assert.equal(steering.style.touchAction, 'pan-y');
  assert.equal(throttle.style.touchAction, 'pan-y');
  assert.equal(input.getStatus().sources.length, 0);
});
