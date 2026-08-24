import {
  deepFreeze,
  EventHub,
  listen,
  readVector,
  setQuaternion,
  setVector,
  uniqueStrings,
} from './internal.js';

const CAMERA_SCALARS = Object.freeze(['near', 'far', 'fov', 'zoom', 'aspect', 'matrixAutoUpdate']);
const CONTROL_SCALARS = Object.freeze(['enabled', 'autoRotate', 'enableDamping']);

export function captureNonXRViewState({ camera = null, controls = null } = {}) {
  const cameraState = camera ? {
    position: readVector(camera.position),
    quaternion: readVector(camera.quaternion, 4),
    scale: readVector(camera.scale),
    up: readVector(camera.up),
    scalars: Object.fromEntries(CAMERA_SCALARS
      .filter((field) => camera[field] !== undefined)
      .map((field) => [field, camera[field]])),
  } : null;
  const controlsState = controls ? {
    target: readVector(controls.target),
    scalars: Object.fromEntries(CONTROL_SCALARS
      .filter((field) => controls[field] !== undefined)
      .map((field) => [field, controls[field]])),
  } : null;
  return deepFreeze({ camera: cameraState, controls: controlsState });
}

export function restoreNonXRViewState(snapshot, { camera = null, controls = null } = {}) {
  if (snapshot?.camera && camera) {
    setVector(camera.position, snapshot.camera.position);
    setQuaternion(camera.quaternion, snapshot.camera.quaternion);
    setVector(camera.scale, snapshot.camera.scale);
    setVector(camera.up, snapshot.camera.up);
    Object.assign(camera, snapshot.camera.scalars);
    camera.updateProjectionMatrix?.();
    camera.updateMatrixWorld?.(true);
  }
  if (snapshot?.controls && controls) {
    setVector(controls.target, snapshot.controls.target);
    Object.assign(controls, snapshot.controls.scalars);
    controls.update?.();
  }
}

export function buildXRSessionInit({
  referenceSpaceType = 'local-floor',
  requiredFeatures = [],
  optionalFeatures = ['bounded-floor', 'hand-tracking'],
  domOverlayRoot = null,
  enableLayers = false,
} = {}) {
  const required = uniqueStrings(requiredFeatures);
  if (referenceSpaceType && !['viewer', 'local'].includes(referenceSpaceType)) required.push(referenceSpaceType);
  const optional = uniqueStrings(optionalFeatures)
    .filter((feature) => feature !== 'layers' || enableLayers)
    .filter((feature) => feature !== 'dom-overlay' || domOverlayRoot);
  if (domOverlayRoot) optional.push('dom-overlay');
  if (enableLayers) optional.push('layers');
  const init = {
    requiredFeatures: uniqueStrings(required),
    optionalFeatures: uniqueStrings(optional),
  };
  if (domOverlayRoot) init.domOverlay = { root: domOverlayRoot };
  return init;
}

/** Owns feature probing and an actual enter/end WebXR session lifecycle. */
export class XRSessionLifecycle {
  #xrSystem;
  #rendererXR;
  #camera;
  #controls;
  #registry;
  #mode;
  #referenceSpaceType;
  #requiredFeatures;
  #optionalFeatures;
  #domOverlayRoot;
  #enableLayers;
  #captureState;
  #restoreState;
  #session = null;
  #sessionCleanup = [];
  #savedState = null;
  #transition = null;
  #support = new Map();
  #events = new EventHub();
  #lastError = null;
  #disposed = false;

  constructor({
    xrSystem = globalThis.navigator?.xr,
    rendererXR,
    camera = null,
    controls = null,
    registry = null,
    mode = 'immersive-vr',
    referenceSpaceType = 'local-floor',
    requiredFeatures = [],
    optionalFeatures = ['bounded-floor', 'hand-tracking'],
    domOverlayRoot = null,
    enableLayers = false,
    captureState = null,
    restoreState = null,
  } = {}) {
    if (!rendererXR?.setSession) throw new TypeError('rendererXR.setSession is required');
    this.#xrSystem = xrSystem;
    this.#rendererXR = rendererXR;
    this.#camera = camera;
    this.#controls = controls;
    this.#registry = registry;
    this.#mode = mode;
    this.#referenceSpaceType = referenceSpaceType;
    this.#requiredFeatures = requiredFeatures;
    this.#optionalFeatures = optionalFeatures;
    this.#domOverlayRoot = domOverlayRoot;
    this.#enableLayers = Boolean(enableLayers);
    this.#captureState = captureState ?? (() => captureNonXRViewState({ camera, controls }));
    this.#restoreState = restoreState ?? ((snapshot) => restoreNonXRViewState(snapshot, { camera, controls }));
  }

  async isSupported(mode = this.#mode) {
    this.#assertLive();
    if (this.#support.has(mode)) return this.#support.get(mode);
    let supported = false;
    try {
      supported = Boolean(await this.#xrSystem?.isSessionSupported?.(mode));
    } catch (error) {
      this.#lastError = error;
    }
    this.#support.set(mode, supported);
    this.#emit('capabilities');
    return supported;
  }

  async enter(options = {}) {
    this.#assertLive();
    if (this.#session) return this.#session;
    if (this.#transition) return this.#transition;
    this.#transition = this.#enter(options);
    try {
      return await this.#transition;
    } finally {
      this.#transition = null;
    }
  }

  async #enter(options) {
    const mode = options.mode ?? this.#mode;
    if (!this.#xrSystem?.requestSession) throw new Error('WebXR is unavailable');
    if (options.checkSupport !== false && !(await this.isSupported(mode))) {
      throw new Error(`${mode} is not supported`);
    }
    const referenceSpaceType = options.referenceSpaceType ?? this.#referenceSpaceType;
    const init = buildXRSessionInit({
      referenceSpaceType,
      requiredFeatures: options.requiredFeatures ?? this.#requiredFeatures,
      optionalFeatures: options.optionalFeatures ?? this.#optionalFeatures,
      domOverlayRoot: options.domOverlayRoot ?? this.#domOverlayRoot,
      enableLayers: options.enableLayers ?? this.#enableLayers,
    });
    this.#lastError = null;
    this.#savedState = await this.#captureState();
    let session = null;
    try {
      session = await this.#xrSystem.requestSession(mode, init);
      this.#session = session;
      const ended = () => this.#finishSession(session, 'ended');
      this.#sessionCleanup.push(listen(session, 'end', ended));
      this.#rendererXR.setReferenceSpaceType?.(referenceSpaceType);
      if (this.#controls && 'enabled' in this.#controls) this.#controls.enabled = false;
      await this.#rendererXR.setSession(session);
      if (this.#session !== session) throw new Error('WebXR session ended during renderer setup');
      this.#registry?.attachSession?.(session);
      this.#emit('entered');
      return session;
    } catch (error) {
      this.#lastError = error;
      if (session) {
        try {
          await session.end?.();
        } catch {
          // The original setup failure remains the public error.
        }
      }
      this.#finishSession(session, 'failed');
      throw error;
    }
  }

  async exit() {
    this.#assertLive();
    if (this.#transition) await this.#transition.catch(() => {});
    const session = this.#session;
    if (!session) return;
    try {
      await session.end();
    } finally {
      this.#finishSession(session, 'ended');
    }
  }

  #finishSession(session, reason) {
    if (session && this.#session !== session) return;
    for (const cleanup of this.#sessionCleanup.splice(0)) cleanup();
    this.#registry?.detachSession?.();
    this.#session = null;
    const snapshot = this.#savedState;
    this.#savedState = null;
    if (snapshot) this.#restoreState(snapshot);
    this.#emit(reason);
  }

  getSession() {
    return this.#session;
  }

  getStatus() {
    const enabledFeatures = Array.from(this.#session?.enabledFeatures ?? []);
    return deepFreeze({
      disposed: this.#disposed,
      available: Boolean(this.#xrSystem?.requestSession),
      presenting: Boolean(this.#session),
      mode: this.#session?.mode ?? this.#mode,
      support: Object.fromEntries(this.#support),
      referenceSpaceType: this.#referenceSpaceType,
      enabledFeatures,
      domOverlayType: this.#session?.domOverlayState?.type ?? null,
      layersOptIn: this.#enableLayers,
      transitioning: Boolean(this.#transition),
      lastError: this.#lastError ? {
        name: this.#lastError.name ?? 'Error',
        message: this.#lastError.message ?? String(this.#lastError),
      } : null,
    });
  }

  subscribe(listener) {
    return this.#events.subscribe(listener);
  }

  #emit(type) {
    this.#events.emit(Object.freeze({ type, status: this.getStatus() }));
  }

  async dispose() {
    if (this.#disposed) return;
    if (this.#transition) await this.#transition.catch(() => {});
    if (this.#session) await this.exit();
    for (const cleanup of this.#sessionCleanup.splice(0)) cleanup();
    this.#registry?.detachSession?.();
    this.#events.clear();
    this.#disposed = true;
  }

  #assertLive() {
    if (this.#disposed) throw new Error('XRSessionLifecycle is disposed');
  }
}
