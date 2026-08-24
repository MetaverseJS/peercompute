import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ActionInput,
  WebXRInputAdapter,
  XRControllerRegistry,
  XRHaptics,
  XRSessionLifecycle,
  buildXRSessionInit,
  pulseGamepad,
} from '../index.js';
import {
  FakeCamera,
  FakeEventTarget,
  FakeNode,
  FakeVector3,
  makeGamepad,
} from './fixtures.js';

class FakeSession extends FakeEventTarget {
  constructor(inputSources = []) {
    super();
    this.inputSources = inputSources;
    this.mode = 'immersive-vr';
    this.enabledFeatures = new Set(['local-floor', 'dom-overlay']);
    this.domOverlayState = { type: 'screen' };
    this.endCalls = 0;
  }

  async end() {
    this.endCalls += 1;
    this.dispatchEvent({ type: 'end' });
  }
}

function makeRendererXR() {
  const targetRays = [];
  const grips = [];
  const hands = [];
  return {
    targetRays,
    grips,
    hands,
    getController(index) {
      return targetRays[index] ??= new FakeNode(`ray-${index}`);
    },
    getControllerGrip(index) {
      return grips[index] ??= new FakeNode(`grip-${index}`);
    },
    getHand(index) {
      return hands[index] ??= new FakeNode(`hand-${index}`);
    },
  };
}

test('controller registry distinguishes target ray, grip model, and tracked hand by role', () => {
  const rendererXR = makeRendererXR();
  const scene = new FakeNode('scene');
  const disposed = [];
  const controllerFactory = {
    createControllerModel: (grip) => new FakeNode(`model:${grip.name}`),
  };
  const handFactory = {
    createHandModel: (hand) => new FakeNode(`hand-model:${hand.name}`),
  };
  const registry = new XRControllerRegistry({
    rendererXR,
    scene,
    controllerModelFactory: controllerFactory,
    handModelFactory: handFactory,
    disposeObject: (object) => disposed.push(object.name),
  });
  const left = {
    handedness: 'left',
    targetRayMode: 'tracked-pointer',
    profiles: ['oculus-touch-v3'],
    gripSpace: {},
    gamepad: makeGamepad({ mapping: 'xr-standard' }),
  };
  const rightHand = {
    handedness: 'right',
    targetRayMode: 'tracked-pointer',
    profiles: ['generic-hand-select'],
    hand: new Map(),
  };
  const session = new FakeSession([left, rightHand]);
  registry.attachSession(session);

  const entries = registry.getEntries();
  assert.equal(entries.length, 2);
  const controller = entries.find((entry) => entry.role === 'controller');
  const hand = entries.find((entry) => entry.role === 'hand');
  assert.equal(controller.handedness, 'left');
  assert.notEqual(controller.targetRayObject, controller.gripObject);
  assert.equal(controller.controllerModel.parent, controller.gripObject);
  assert.equal(hand.handedness, 'right');
  assert.equal(hand.gripObject, null);
  assert.equal(hand.handModel.parent, hand.handObject);
  assert.equal(scene.children.length, 4);

  session.inputSources = [rightHand];
  session.dispatchEvent({ type: 'inputsourceschange', removed: [left], added: [] });
  assert.equal(registry.getEntries().length, 1);
  assert.deepEqual(disposed, ['model:grip-0']);
  registry.dispose();
  assert.equal(session.listenerCount(), 0);
  assert.equal(scene.children.length, 0);
  assert.deepEqual(disposed.sort(), ['hand-model:hand-1', 'model:grip-0']);
});

test('WebXR adapter maps xr-standard snapshots by handedness and clears removed held actions', () => {
  const input = new ActionInput();
  const rendererXR = makeRendererXR();
  const registry = new XRControllerRegistry({ rendererXR });
  const leftButtons = Array.from({ length: 6 }, () => ({ value: 0, pressed: false }));
  leftButtons[0] = { value: 0.5, pressed: false };
  leftButtons[5] = { value: 1, pressed: true };
  const rightButtons = Array.from({ length: 6 }, () => ({ value: 0, pressed: false }));
  rightButtons[0] = { value: 0.8, pressed: false };
  rightButtons[1] = { value: 0.25, pressed: false };
  const leftPad = makeGamepad({ mapping: 'xr-standard', axes: [0, 0, -0.75, 0], buttons: leftButtons });
  const rightPad = makeGamepad({ index: 1, mapping: 'xr-standard', axes: [0, 0, 0, 0], buttons: rightButtons });
  const left = { handedness: 'left', profiles: ['touch'], gripSpace: {}, gamepad: leftPad };
  const right = { handedness: 'right', profiles: ['touch'], gripSpace: {}, gamepad: rightPad };
  const session = new FakeSession([left, right]);
  registry.attachSession(session);
  const mappedButton = (snapshot, index) => {
    const candidate = snapshot.buttons[index];
    return candidate?.value > 0 ? candidate.value : (candidate?.pressed ? 1 : 0);
  };
  const adapter = new WebXRInputAdapter({
    input,
    registry,
    deadzone: 0,
    mapSource(snapshot, entry) {
      if (entry.handedness === 'left') {
        return {
          steer: snapshot.axes[2] ?? snapshot.axes[0] ?? 0,
          rearBrake: mappedButton(snapshot, 0),
          cameraToggle: mappedButton(snapshot, 5),
        };
      }
      return {
        throttle: mappedButton(snapshot, 0),
        frontBrake: mappedButton(snapshot, 1),
      };
    },
  });
  adapter.poll();
  leftPad.axes[2] = 1;
  rightPad.buttons[0].value = 0;
  const first = input.sample().control;
  assert.equal(first.steer, -0.75);
  assert.equal(first.rearBrake, 0.5);
  assert.equal(first.throttle, 0.8);
  assert.equal(first.frontBrake, 0.25);
  assert.equal(first.cameraToggle, true);
  assert.equal(input.sample().control.cameraToggle, false);

  session.inputSources = [right];
  session.dispatchEvent({ type: 'inputsourceschange', removed: [left], added: [] });
  const afterRemoval = input.sample().control;
  assert.equal(afterRemoval.steer, 0);
  assert.equal(afterRemoval.rearBrake, 0);
  assert.equal(afterRemoval.throttle, 0.8);
  session.dispatchEvent({ type: 'end' });
  assert.equal(input.sample().control.throttle, 0, 'session end clears every held XR action');
  adapter.dispose();
  registry.dispose();
  assert.equal(input.getStatus().sources.length, 0);
});

test('WebXR generic mapping copies select/squeeze edges, hand state, poses, and cleans removal/end', () => {
  const input = new ActionInput({
    actions: {
      primaryHeld: { minimum: 0, maximum: 1, combine: 'maximum', boolean: true },
      primaryPressed: { minimum: 0, maximum: 1, combine: 'maximum', boolean: true },
      gripHeld: { minimum: 0, maximum: 1, combine: 'maximum', boolean: true },
      pointerX: { minimum: -10, maximum: 10, combine: 'latest' },
    },
  });
  const rendererXR = makeRendererXR();
  const registry = new XRControllerRegistry({ rendererXR });
  const controller = {
    handedness: 'left',
    targetRayMode: 'tracked-pointer',
    targetRaySpace: {},
    gripSpace: {},
    profiles: ['generic-trigger'],
    gamepad: makeGamepad({ mapping: 'xr-standard' }),
  };
  const hand = {
    handedness: 'right',
    targetRayMode: 'tracked-pointer',
    targetRaySpace: {},
    profiles: ['generic-hand-select'],
    hand: new Map([
      ['index-finger-tip', {}],
      ['wrist', {}],
    ]),
  };
  const session = new FakeSession([controller, hand]);
  registry.attachSession(session);
  rendererXR.targetRays[0].position.set(-1, 2, 3);
  rendererXR.targetRays[1].position.set(4, 5, 6);

  const mapped = [];
  const adapter = new WebXRInputAdapter({
    input,
    registry,
    deadzone: 0,
    mapInput(sourceState, entry, options) {
      mapped.push({ sourceState, entryId: entry.id, options });
      return {
        primaryHeld: sourceState.select.held ? 1 : 0,
        primaryPressed: sourceState.select.pressed ? 1 : 0,
        gripHeld: sourceState.squeeze.held ? 1 : 0,
        pointerX: sourceState.pointer.pose?.position?.[0] ?? 0,
      };
    },
  });

  const selectEvent = { type: 'selectstart', inputSource: hand, timeStamp: 12.5 };
  session.dispatchEvent(selectEvent);
  session.dispatchEvent({ type: 'squeezestart', inputSource: controller, timeStamp: 13 });
  session.dispatchEvent({ type: 'squeezestart', inputSource: hand, timeStamp: 13.5 });
  selectEvent.timeStamp = 999;
  const registryHand = registry.getByInputSource(hand);
  assert.equal(registryHand.select.held, true);
  assert.equal(registryHand.squeeze.held, true);
  assert.equal(registryHand.inputState.select.lastEvent.timeStamp, 12.5);
  const firstPoll = adapter.poll();
  assert.equal(firstPoll.length, 2, 'generic mapping includes the hand without a Gamepad');
  const handPoll = firstPoll.find((item) => item.inputState.role === 'hand');
  const controllerPoll = firstPoll.find((item) => item.inputState.role === 'controller');
  assert.equal(handPoll.snapshot, null);
  assert.equal(handPoll.inputState.xrStandard, null);
  assert.equal(handPoll.inputState.hand.tracked, true);
  assert.deepEqual(handPoll.inputState.hand.joints, ['index-finger-tip', 'wrist']);
  assert.equal(handPoll.inputState.select.held, true);
  assert.equal(handPoll.inputState.select.pressed, true);
  assert.equal(handPoll.inputState.select.released, false);
  assert.equal(handPoll.inputState.events.selectstart, true);
  assert.equal(handPoll.inputState.squeeze.held, true);
  assert.equal(handPoll.inputState.events.squeezestart, true);
  assert.equal(handPoll.inputState.select.lastEvent.timeStamp, 12.5, 'XR events are copied at dispatch');
  assert.deepEqual(handPoll.inputState.pointer.pose.position, [4, 5, 6]);
  assert.equal(controllerPoll.inputState.xrStandard.mapping, 'xr-standard');
  assert.equal(controllerPoll.inputState.squeeze.held, true);
  assert.equal(controllerPoll.inputState.squeeze.pressed, true);
  assert.ok(Object.isFrozen(handPoll.inputState));
  assert.ok(Object.isFrozen(handPoll.inputState.select.lastEvent));
  let control = input.sample().control;
  assert.equal(control.primaryHeld, true);
  assert.equal(control.primaryPressed, true);
  assert.equal(control.gripHeld, true);
  assert.equal(control.pointerX, 4);

  const secondPoll = adapter.poll();
  const heldHand = secondPoll.find((item) => item.inputState.role === 'hand').inputState;
  assert.equal(heldHand.select.held, true);
  assert.equal(heldHand.select.pressed, false, 'event edges last for exactly one adapter poll');
  assert.equal(heldHand.events.selectstart, false);
  control = input.sample().control;
  assert.equal(control.primaryHeld, true);
  assert.equal(control.primaryPressed, false);

  session.dispatchEvent({ type: 'selectend', inputSource: hand, timeStamp: 14 });
  session.dispatchEvent({ type: 'squeezeend', inputSource: controller, timeStamp: 15 });
  session.dispatchEvent({ type: 'squeezeend', inputSource: hand, timeStamp: 15.5 });
  const releasePoll = adapter.poll();
  const releasedHand = releasePoll.find((item) => item.inputState.role === 'hand').inputState;
  const releasedController = releasePoll.find((item) => item.inputState.role === 'controller').inputState;
  assert.equal(releasedHand.select.held, false);
  assert.equal(releasedHand.select.released, true);
  assert.equal(releasedHand.events.selectend, true);
  assert.equal(releasedHand.squeeze.held, false);
  assert.equal(releasedHand.squeeze.released, true);
  assert.equal(releasedController.squeeze.held, false);
  assert.equal(releasedController.squeeze.released, true);

  session.dispatchEvent({ type: 'selectstart', inputSource: hand, timeStamp: 16 });
  adapter.poll();
  input.sample();
  session.inputSources = [controller];
  session.dispatchEvent({ type: 'inputsourceschange', removed: [hand], added: [] });
  assert.equal(adapter.getInputStates().length, 1);
  assert.equal(input.sample().control.primaryHeld, false, 'input removal clears held hand actions');

  session.dispatchEvent({ type: 'squeezestart', inputSource: controller, timeStamp: 17 });
  adapter.poll();
  assert.equal(input.sample().control.gripHeld, true);
  session.dispatchEvent({ type: 'end' });
  assert.equal(session.listenerCount(), 0);
  assert.equal(adapter.getInputStates().length, 0);
  assert.equal(input.sample().control.gripHeld, false, 'session end removes every mapped XR source');
  adapter.dispose();
  registry.dispose();
  input.dispose();
  assert.ok(mapped.some(({ sourceState }) => sourceState.hand.tracked && sourceState.gamepad === null));
});

test('haptics support pulse and dual-rumble without treating absence as success', async () => {
  const calls = [];
  const pulseResult = await pulseGamepad({
    hapticActuators: [{
      pulse: async (intensity, duration) => {
        calls.push([intensity, duration]);
        return true;
      },
    }],
  }, { intensity: 2, duration: 40 });
  assert.equal(pulseResult.ok, true);
  assert.deepEqual(calls, [[1, 40]]);

  let effect = null;
  const rumbleResult = await pulseGamepad({
    vibrationActuator: {
      playEffect: async (name, options) => {
        effect = { name, options };
        return true;
      },
    },
  }, { intensity: 0.4, strongMagnitude: 0.8, duration: 20 });
  assert.equal(rumbleResult.ok, true);
  assert.equal(effect.name, 'dual-rumble');
  assert.equal(effect.options.strongMagnitude, 0.8);
  assert.deepEqual(await pulseGamepad(null), {
    supported: false,
    ok: false,
    duration: 35,
    intensity: 0.5,
    results: [],
  });

  const registry = {
    getEntries: () => [{ id: 'left', inputSource: { gamepad: { hapticActuators: [{ pulse: async () => true }] } } }],
  };
  const haptics = new XRHaptics({ registry });
  assert.equal((await haptics.pulse({ handedness: 'left' })).pulsed, 1);
  await haptics.dispose();
});

test('session init keeps DOM overlay optional and projection layers explicitly opt-in', () => {
  const root = {};
  const normal = buildXRSessionInit({
    optionalFeatures: ['hand-tracking', 'layers'],
    domOverlayRoot: root,
  });
  assert.deepEqual(normal.requiredFeatures, ['local-floor']);
  assert.deepEqual(normal.optionalFeatures, ['hand-tracking', 'dom-overlay']);
  assert.equal(normal.domOverlay.root, root);
  const layers = buildXRSessionInit({ enableLayers: true, optionalFeatures: [] });
  assert.deepEqual(layers.optionalFeatures, ['layers']);
});

test('XRSessionLifecycle enters, reports capabilities, and restores non-XR state on end', async () => {
  const session = new FakeSession();
  let request = null;
  const xrSystem = {
    isSessionSupported: async (mode) => mode === 'immersive-vr',
    requestSession: async (mode, init) => {
      request = { mode, init };
      return session;
    },
  };
  const setSessions = [];
  const rendererXR = {
    referenceSpaceType: null,
    setReferenceSpaceType(type) { this.referenceSpaceType = type; },
    async setSession(value) { setSessions.push(value); },
  };
  const camera = new FakeCamera();
  camera.position.set(1, 2, 3);
  const controls = { enabled: true, target: new FakeVector3(4, 5, 6), updateCalls: 0, update() { this.updateCalls += 1; } };
  const registry = {
    attached: null,
    detachCalls: 0,
    attachSession(value) { this.attached = value; },
    detachSession() { this.attached = null; this.detachCalls += 1; },
  };
  const lifecycle = new XRSessionLifecycle({
    xrSystem,
    rendererXR,
    camera,
    controls,
    registry,
    domOverlayRoot: {},
  });
  assert.equal(await lifecycle.isSupported(), true);
  await lifecycle.enter();
  assert.equal(request.mode, 'immersive-vr');
  assert.ok(request.init.optionalFeatures.includes('dom-overlay'));
  assert.ok(!request.init.optionalFeatures.includes('layers'));
  assert.equal(rendererXR.referenceSpaceType, 'local-floor');
  assert.equal(controls.enabled, false);
  assert.equal(registry.attached, session);
  assert.equal(lifecycle.getStatus().domOverlayType, 'screen');
  assert.ok(Object.isFrozen(lifecycle.getStatus()));

  camera.position.set(90, 90, 90);
  controls.target.set(80, 80, 80);
  await lifecycle.exit();
  assert.equal(session.endCalls, 1);
  assert.deepEqual(camera.position.toArray(), [1, 2, 3]);
  assert.deepEqual(controls.target.toArray(), [4, 5, 6]);
  assert.equal(controls.enabled, true);
  assert.equal(lifecycle.getStatus().presenting, false);
  assert.equal(session.listenerCount(), 0);
  assert.equal(setSessions.length, 1);
  await lifecycle.dispose();
});

test('XRSessionLifecycle ends and restores after renderer setup failure', async () => {
  const session = new FakeSession();
  const camera = new FakeCamera();
  camera.position.set(1, 1, 1);
  const lifecycle = new XRSessionLifecycle({
    xrSystem: {
      isSessionSupported: async () => true,
      requestSession: async () => session,
    },
    rendererXR: {
      setReferenceSpaceType() {},
      async setSession() {
        camera.position.set(8, 8, 8);
        throw new Error('renderer rejected session');
      },
    },
    camera,
  });
  await assert.rejects(lifecycle.enter(), /renderer rejected session/);
  assert.equal(session.endCalls, 1);
  assert.deepEqual(camera.position.toArray(), [1, 1, 1]);
  assert.equal(lifecycle.getStatus().presenting, false);
  assert.equal(lifecycle.getStatus().lastError.message, 'renderer rejected session');
  await lifecycle.dispose();
});
