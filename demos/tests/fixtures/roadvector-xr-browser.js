import * as THREE from 'three';

import { createMotorcycleInputRuntime } from '../../motorcycle/src/input/runtimeInput.js';
import { createMotorcycleXrPanel } from '../../motorcycle/src/runtime/xrPanel.js';
import { ViewRig } from '../../shared/xr/index.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

class FakeSession extends EventTarget {
  constructor(inputSources) {
    super();
    this.inputSources = inputSources;
    this.enabledFeatures = new Set(['local-floor', 'hand-tracking']);
    this.mode = 'immersive-vr';
    this.domOverlayState = null;
    this.ended = false;
  }

  dispatchInput(type, inputSource) {
    const event = new Event(type);
    Object.defineProperty(event, 'inputSource', { value: inputSource });
    Object.defineProperty(event, 'timeStamp', { value: performance.now() });
    this.dispatchEvent(event);
  }

  replaceSources(next, { added = [], removed = [] } = {}) {
    this.inputSources = next;
    const event = new Event('inputsourceschange');
    Object.defineProperties(event, {
      added: { value: added },
      removed: { value: removed },
    });
    this.dispatchEvent(event);
  }

  async end() {
    if (this.ended) return;
    this.ended = true;
    this.dispatchEvent(new Event('end'));
  }
}

function xrButton(value = 0) {
  return { pressed: value > 0.5, touched: value > 0, value };
}

function inputSources() {
  const leftHand = {
    handedness: 'left',
    targetRayMode: 'tracked-pointer',
    profiles: ['generic-hand-select'],
    targetRaySpace: {},
    gripSpace: null,
    gamepad: null,
    hand: new Map([['wrist', {}], ['index-finger-tip', {}]]),
  };
  const rightController = {
    handedness: 'right',
    targetRayMode: 'tracked-pointer',
    profiles: ['runtime-smoke-controller'],
    targetRaySpace: {},
    gripSpace: {},
    gamepad: {
      id: 'RoadVector XR Browser Controller',
      index: 1,
      connected: true,
      mapping: 'xr-standard',
      timestamp: 1,
      axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 6 }, () => xrButton()),
    },
  };
  return { leftHand, rightController };
}

function fakeRendererXr() {
  const targetRays = [];
  const grips = [];
  const hands = [];
  return {
    targetRays,
    grips,
    hands,
    session: null,
    referenceSpaceType: null,
    getController(slot) {
      targetRays[slot] ??= new THREE.Group();
      targetRays[slot].name = `browser-xr-target-ray:${slot}`;
      return targetRays[slot];
    },
    getControllerGrip(slot) {
      grips[slot] ??= new THREE.Group();
      return grips[slot];
    },
    getHand(slot) {
      if (!hands[slot]) {
        const hand = new THREE.Group();
        const wrist = new THREE.Group();
        wrist.name = `browser-xr-wrist:${slot}`;
        hand.joints = { wrist };
        hand.add(wrist);
        hands[slot] = hand;
      }
      return hands[slot];
    },
    setReferenceSpaceType(value) { this.referenceSpaceType = value; },
    async setSession(value) { this.session = value; },
  };
}

const PANEL_WIDTH_METERS = 0.48;
const PANEL_HEIGHT_METERS = PANEL_WIDTH_METERS * 620 / 1_000;
const XR_RAY_FORWARD = new THREE.Vector3(0, 0, -1);

function aimRayAtPanelUv(targetRay, panelMesh, [u, v], distance = 0.45) {
  if (!targetRay?.parent) throw new Error('XR target ray requires a parent transform');
  targetRay.parent.updateMatrixWorld(true);
  panelMesh.updateMatrixWorld(true);

  const targetWorld = new THREE.Vector3(
    (u - 0.5) * PANEL_WIDTH_METERS,
    (v - 0.5) * PANEL_HEIGHT_METERS,
    0,
  ).applyMatrix4(panelMesh.matrixWorld);
  const panelNormalWorld = new THREE.Vector3(0, 0, 1)
    .transformDirection(panelMesh.matrixWorld);
  const originWorld = targetWorld.clone().addScaledVector(panelNormalWorld, distance);
  const directionWorld = targetWorld.clone().sub(originWorld).normalize();

  const parentWorldQuaternion = targetRay.parent
    .getWorldQuaternion(new THREE.Quaternion())
    .invert();
  const desiredWorldQuaternion = new THREE.Quaternion()
    .setFromUnitVectors(XR_RAY_FORWARD, directionWorld);
  targetRay.position.copy(targetRay.parent.worldToLocal(originWorld.clone()));
  targetRay.quaternion.copy(parentWorldQuaternion.multiply(desiredWorldQuaternion));
  targetRay.updateMatrixWorld(true);
}

async function run() {
  const rendererXR = fakeRendererXr();
  const xrRoot = new THREE.Group();
  const camera = new THREE.PerspectiveCamera();
  const sessions = [];
  const sourceSets = [];
  const xrSystem = {
    async isSessionSupported(mode) { return mode === 'immersive-vr'; },
    async requestSession() {
      const sources = inputSources();
      sourceSets.push(sources);
      const session = new FakeSession([sources.leftHand, sources.rightController]);
      sessions.push(session);
      return session;
    },
  };
  const runtime = createMotorcycleInputRuntime({
    eventTarget: window,
    getGamepads: () => [],
    rendererXR,
    xrRoot,
    camera,
    xrSystem,
    domOverlayRoot: document.body,
  });
  assert(await runtime.checkXRSupport(), 'immersive-vr support probe failed');
  const session = await runtime.enterXR();
  assert(runtime.getStatus().xr.presenting, 'XR session did not enter');
  assert(runtime.getStatus().xrControllers.sourceCount === 2, 'controller plus hand were not registered');
  assert(rendererXR.referenceSpaceType === 'local-floor', 'local-floor reference space was not selected');
  assert(xrRoot.children.includes(rendererXR.targetRays[0]), 'tracked target rays are outside the moving XR root');

  const firstCamera = new THREE.PerspectiveCamera();
  const thirdCamera = new THREE.PerspectiveCamera();
  const viewRig = new ViewRig({
    firstCamera,
    thirdCamera,
    xrCamera: camera,
    xrAnchor: xrRoot,
    firstOrientation: [0, 1, 0, 0],
    xrOrientation: [0, 1, 0, 0],
  });
  viewRig.setXRActive(true);
  const trackedCameraPose = camera.position.toArray();
  const xrPose = viewRig.update({ position: [100, 3, -40], orientation: [0, 0, 0, 1] });
  assert(Math.abs(xrPose.orientation[1] - 1) < 1e-9, 'XR anchor did not apply vehicle-to-view forward orientation');
  const anchorBeforeShift = xrRoot.position.toArray();
  viewRig.shiftOrigin([80, 0, -25]);
  const anchorAfterShift = xrRoot.position.toArray();
  const xrRebaseError = Math.hypot(...anchorAfterShift.map((value, index) => (
    value - (anchorBeforeShift[index] - [80, 0, -25][index])
  )));
  assert(xrRebaseError < 1e-9, 'XR anchor did not shift atomically with the local origin');
  assert(camera.position.toArray().every((value, index) => value === trackedCameraPose[index]),
    'XR rebase mutated the tracked camera instead of its anchor');

  let cameraToggles = 0;
  const panel = createMotorcycleXrPanel({
    THREE,
    scene: xrRoot,
    registry: runtime.registry,
    onCameraToggle: () => { cameraToggles += 1; },
  });
  const [handEntry] = runtime.registry.getEntries({ role: 'hand' });
  const [controllerEntry] = runtime.registry.getEntries({ role: 'controller' });
  // First update establishes the wrist mount. Every later hit goes through
  // Three r182's real Raycaster.setFromXRController and mesh transforms.
  let panelState = panel.update();
  assert(panel.mesh.parent === rendererXR.hands[handEntry.slot].joints.wrist, 'panel did not mount to the tracked wrist');
  assert(panelState.mountOwnerId === handEntry.id, 'panel mount source was not retained');
  aimRayAtPanelUv(rendererXR.targetRays[handEntry.slot], panel.mesh, [0.2, 1 - 170 / 620]);
  aimRayAtPanelUv(rendererXR.targetRays[controllerEntry.slot], panel.mesh, [0.5, 1 - 50 / 620]);
  panelState = panel.update();
  assert(panelState.surfaceHovered && !panelState.captureGameplay, 'blank panel space captured ride controls');
  assert(panelState.pointers === 1, 'wrist owner ray was not excluded from real mesh hit testing');

  sourceSets[0].rightController.gamepad.buttons[0] = xrButton(1);
  runtime.setUiContextActive(panelState.captureGameplay);
  let frame = runtime.poll();
  assert(frame.control.throttle === 1, 'blank panel hover suppressed xr-standard throttle');

  session.dispatchInput('selectstart', sourceSets[0].leftHand);
  frame = runtime.poll();
  assert(frame.control.rearBrake === 1, 'tracked-hand select did not map to rear brake');
  session.dispatchInput('squeezestart', sourceSets[0].leftHand);
  frame = runtime.poll();
  assert(frame.control.clutch === 1, 'tracked-hand squeeze did not map to clutch');
  rendererXR.targetRays[handEntry.slot].quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.35);
  frame = runtime.poll();
  assert(frame.control.steer > 0.5, 'tracked-hand target-ray pose did not map to steering');

  aimRayAtPanelUv(rendererXR.targetRays[controllerEntry.slot], panel.mesh, [200 / 1_000, 1 - 170 / 620]);
  panelState = panel.update();
  assert(panelState.captureGameplay, 'interactive panel control did not capture gameplay');
  runtime.setUiContextActive(panelState.captureGameplay);
  frame = runtime.poll();
  assert(frame.control.throttle === 0 && frame.control.rearBrake === 0,
    'UI context did not neutralize every riding source');
  sourceSets[0].rightController.gamepad.buttons[0] = xrButton(0);
  panel.update();
  assert(cameraToggles === 1, 'XR panel button did not activate exactly once');

  session.dispatchInput('selectend', sourceSets[0].leftHand);
  session.dispatchInput('squeezeend', sourceSets[0].leftHand);
  session.replaceSources([sourceSets[0].leftHand], { removed: [sourceSets[0].rightController] });
  runtime.poll();
  assert(runtime.getStatus().xrControllers.sourceCount === 1, 'removed XR input source remained registered');
  assert(runtime.getStatus().xrInputs.length === 1, 'removed XR input source retained an action state');
  panelState = panel.update();
  assert(panelState.mountMode === 'xr-root-fallback' && panel.mesh.parent === xrRoot,
    'sole XR source did not receive the non-self-excluding root panel fallback');
  aimRayAtPanelUv(rendererXR.targetRays[handEntry.slot], panel.mesh, [200 / 1_000, 1 - 170 / 620]);
  session.dispatchInput('selectstart', sourceSets[0].leftHand);
  panelState = panel.update();
  assert(panelState.captureGameplay && panelState.pointers === 1,
    'sole-source root panel did not accept its remaining real XR ray');
  session.dispatchInput('selectend', sourceSets[0].leftHand);
  panel.update();
  assert(cameraToggles === 2, 'sole-source root panel did not activate exactly once');

  await runtime.exitXR();
  assert(!runtime.getStatus().xr.presenting, 'XR session did not exit');
  assert(runtime.getStatus().xrControllers.sourceCount === 0, 'XR controllers survived session exit');
  assert(runtime.poll().control.throttle === 0, 'XR actions survived session exit');

  const secondSession = await runtime.enterXR();
  assert(secondSession !== session && runtime.getStatus().xr.presenting, 'XR session did not re-enter cleanly');
  assert(runtime.getStatus().xrControllers.sourceCount === 2, 'XR sources did not reattach on re-entry');
  await runtime.exitXR();
  viewRig.dispose();
  panel.dispose();
  await runtime.dispose();
  assert(runtime.getStatus().disposed, 'XR input runtime did not dispose');
  assert(panel.getStatus().disposed, 'XR panel did not dispose');
  assert(sessions.every((value) => value.ended), 'a fake XR session remained open');

  return {
    secureContext: globalThis.isSecureContext,
    sessionCount: sessions.length,
    controllerAndHandRegistered: true,
    xrStandardMapped: true,
    handSelectSqueezeMapped: true,
    handPoseSteeringMapped: true,
    wristPanelMounted: true,
    ownerRayExcluded: true,
    soleSourcePanelFallback: true,
    soleSourcePanelInteractive: true,
    realThreeRaycasterPassed: true,
    xrViewAxisAndRebasePassed: true,
    uiCapturedOnlyControls: true,
    sourceRemovalCleared: true,
    reentryPassed: true,
    disposed: true,
  };
}

globalThis.__roadVectorXrBrowser = { status: 'running', result: null, error: null };
run().then((result) => {
  globalThis.__roadVectorXrBrowser = { status: 'passed', result, error: null };
  document.documentElement.dataset.xrBrowserReady = 'true';
}).catch((error) => {
  globalThis.__roadVectorXrBrowser = {
    status: 'failed',
    result: null,
    error: error instanceof Error ? `${error.name}: ${error.message}\n${error.stack ?? ''}` : String(error),
  };
  document.documentElement.dataset.xrBrowserReady = 'failed';
});
