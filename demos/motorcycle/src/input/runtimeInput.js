import {
  ActionInput,
  KeyboardPointerAdapter,
  MultiTouchAdapter,
  StandardGamepadAdapter,
  WebXRInputAdapter,
  XRControllerRegistry,
  XRSessionLifecycle,
} from '../../../shared/xr/index.js';
import { createMotorcycleXrInputMapper } from './xrMotorcycleMapping.js';

function liveEventTarget(candidate, label) {
  if (!candidate?.addEventListener || !candidate?.removeEventListener) {
    throw new TypeError(`${label} must support DOM-style events.`);
  }
  return candidate;
}

function normalizeTouchControl(control, index) {
  if (!control?.element) throw new TypeError(`touchControls[${index}].element is required.`);
  if (typeof control.action !== 'string' || control.action.length === 0) {
    throw new TypeError(`touchControls[${index}].action is required.`);
  }
  return control;
}

/**
 * Device-agnostic motorcycle input boundary. Physics receives only immutable
 * ActionInput control frames; live browser, gamepad, touch, and XR objects do
 * not cross into the deterministic simulation.
 */
export function createMotorcycleInputRuntime({
  eventTarget = globalThis.window,
  pointerTarget = null,
  getGamepads = () => globalThis.navigator?.getGamepads?.() ?? [],
  touchControls = [],
  rendererXR = null,
  scene = null,
  xrRoot = scene,
  camera = null,
  xrSystem = globalThis.navigator?.xr,
  domOverlayRoot = null,
  controllerModelFactory = null,
  handModelFactory = null,
  disposeObject = null,
  now = () => globalThis.performance?.now?.() ?? Date.now(),
} = {}) {
  const target = liveEventTarget(eventTarget, 'eventTarget');
  const input = new ActionInput({ now });
  input.defineContext('ui', {
    priority: 100,
    enabled: false,
    capture: [
      'steer',
      'throttle',
      'frontBrake',
      'rearBrake',
      'clutch',
      'shiftDelta',
      'handbrake',
      'reset',
      'cameraToggle',
      'recenter',
    ],
  });

  const keyboard = new KeyboardPointerAdapter({
    input,
    target,
    pointerTarget,
    pointerLock: true,
  });
  const gamepad = new StandardGamepadAdapter({
    input,
    getGamepads,
    eventTarget: target,
  });
  const touch = new MultiTouchAdapter({
    input,
    controls: touchControls.map(normalizeTouchControl),
  });

  let registry = null;
  let webxr = null;
  let sessions = null;
  let unsubscribeSession = null;
  if (rendererXR?.setSession) {
    registry = new XRControllerRegistry({
      rendererXR,
      scene: xrRoot,
      controllerModelFactory,
      handModelFactory,
      disposeObject,
      maximumSources: 4,
    });
    webxr = new WebXRInputAdapter({
      input,
      registry,
      mapInput: createMotorcycleXrInputMapper(),
    });
    sessions = new XRSessionLifecycle({
      xrSystem,
      rendererXR,
      camera,
      registry,
      domOverlayRoot,
      enableLayers: false,
      optionalFeatures: ['bounded-floor', 'hand-tracking'],
    });
    unsubscribeSession = sessions.subscribe((event) => {
      if (['ended', 'failed'].includes(event.type)) {
        webxr.clear();
        input.clearAllSources();
      }
    });
  }

  let disposed = false;
  const assertLive = () => {
    if (disposed) throw new Error('Motorcycle input runtime is disposed.');
  };
  const runtime = {
    input,
    keyboard,
    gamepad,
    touch,
    registry,
    webxr,
    sessions,
    poll({ time = now(), xrFrame = null, referenceSpace = null } = {}) {
      assertLive();
      gamepad.poll();
      webxr?.poll({ frame: xrFrame, referenceSpace });
      return input.sample({ time });
    },
    setUiContextActive(active) {
      assertLive();
      input.setContextEnabled('ui', Boolean(active));
    },
    setVirtualControl(state = {}) {
      assertLive();
      input.replaceSourceState('virtual-test-control', state);
    },
    clearVirtualControl() {
      input.removeSource('virtual-test-control');
    },
    requestPointerLock(options) {
      assertLive();
      return keyboard.requestPointerLock(options);
    },
    async checkXRSupport() {
      assertLive();
      return sessions ? sessions.isSupported() : false;
    },
    async enterXR() {
      assertLive();
      if (!sessions) throw new Error('WebXR is unavailable.');
      return sessions.enter();
    },
    async exitXR() {
      assertLive();
      return sessions?.exit();
    },
    getStatus() {
      return Object.freeze({
        disposed,
        input: input.getStatus(),
        keyboard: keyboard.getStatus(),
        gamepads: gamepad.getSnapshots(),
        xr: sessions?.getStatus() ?? Object.freeze({
          disposed: false,
          available: false,
          presenting: false,
          support: {},
        }),
        xrControllers: registry?.getStatus() ?? null,
        xrInputs: webxr?.getInputStates() ?? Object.freeze([]),
      });
    },
    async dispose() {
      if (disposed) return;
      unsubscribeSession?.();
      unsubscribeSession = null;
      await sessions?.dispose();
      webxr?.dispose();
      registry?.dispose();
      touch.dispose();
      gamepad.dispose();
      keyboard.dispose();
      input.dispose();
      disposed = true;
    },
  };
  return Object.freeze(runtime);
}
