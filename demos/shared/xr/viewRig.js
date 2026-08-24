import { clamp, deepFreeze, EventHub, setQuaternion, setVector } from './internal.js';

const VIEW_MODES = new Set(['first', 'third', 'xr']);

function vector3(value, fallback = [0, 0, 0]) {
  if (Array.isArray(value) || ArrayBuffer.isView(value)) {
    const result = Array.from(value).slice(0, 3).map(Number);
    if (result.length === 3 && result.every(Number.isFinite)) return result;
  }
  if (value && [value.x, value.y, value.z].every(Number.isFinite)) return [value.x, value.y, value.z];
  return [...fallback];
}

function quaternion(value) {
  if (Array.isArray(value) || ArrayBuffer.isView(value)) {
    const result = Array.from(value).slice(0, 4).map(Number);
    if (result.length === 4 && result.every(Number.isFinite)) return result;
  }
  if (value && [value.x, value.y, value.z, value.w].every(Number.isFinite)) {
    return [value.x, value.y, value.z, value.w];
  }
  return [0, 0, 0, 1];
}

function rotateVector(vector, rotation) {
  const [x, y, z] = vector;
  const [qx, qy, qz, qw] = rotation;
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;
  return [
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx,
  ];
}

function multiplyQuaternion(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function lerp(a, b, alpha) {
  return [
    a[0] + (b[0] - a[0]) * alpha,
    a[1] + (b[1] - a[1]) * alpha,
    a[2] + (b[2] - a[2]) * alpha,
  ];
}

/** First-person, damped chase, and tracked-head view coordinator. */
export class ViewRig {
  #cameras;
  #xrAnchor;
  #setActiveCamera;
  #setXRAnchorPose;
  #recenter;
  #mode;
  #nonXRMode;
  #firstOffset;
  #firstOrientation;
  #xrOrientation;
  #thirdOffset;
  #thirdLookOffset;
  #thirdDamping;
  #minimumViewY;
  #thirdPosition = null;
  #lastXrViewOffsets = null;
  #lastConstraint = null;
  #events = new EventHub();
  #disposed = false;

  constructor({
    firstCamera,
    thirdCamera,
    xrCamera = null,
    xrAnchor = null,
    mode = 'third',
    firstOffset = [0, 1.35, -0.2],
    firstOrientation = [0, 0, 0, 1],
    xrOrientation = [0, 0, 0, 1],
    thirdOffset = [0, 2.2, 5.2],
    thirdLookOffset = [0, 1.1, -1.5],
    thirdDamping = 8,
    minimumViewY = () => Number.NEGATIVE_INFINITY,
    setActiveCamera = () => {},
    setXRAnchorPose = null,
    recenter = () => {},
  } = {}) {
    if (!firstCamera || !thirdCamera) throw new TypeError('firstCamera and thirdCamera are required');
    if (!VIEW_MODES.has(mode) || mode === 'xr') throw new RangeError('initial mode must be first or third');
    this.#cameras = { first: firstCamera, third: thirdCamera, xr: xrCamera };
    this.#xrAnchor = xrAnchor;
    this.#mode = mode;
    this.#nonXRMode = mode;
    this.#firstOffset = vector3(firstOffset);
    this.#firstOrientation = quaternion(firstOrientation);
    this.#xrOrientation = quaternion(xrOrientation);
    this.#thirdOffset = vector3(thirdOffset);
    this.#thirdLookOffset = vector3(thirdLookOffset);
    this.#thirdDamping = Math.max(0, Number(thirdDamping) || 0);
    if (typeof minimumViewY !== 'function') throw new TypeError('minimumViewY must be a function');
    this.#minimumViewY = minimumViewY;
    this.#setActiveCamera = setActiveCamera;
    this.#setXRAnchorPose = setXRAnchorPose;
    this.#recenter = recenter;
    this.#activate();
  }

  setMode(mode) {
    this.#assertLive();
    if (!VIEW_MODES.has(mode)) throw new RangeError(`unknown view mode: ${mode}`);
    if (mode !== 'xr') this.#nonXRMode = mode;
    if (mode === this.#mode) return;
    this.#mode = mode;
    this.#activate();
    this.#emit('mode');
  }

  toggle() {
    const next = this.#nonXRMode === 'first' ? 'third' : 'first';
    if (this.#mode === 'xr') {
      this.#nonXRMode = next;
      this.#emit('mode');
    } else {
      this.setMode(next);
    }
  }

  setXRActive(active) {
    this.setMode(active ? 'xr' : this.#nonXRMode);
  }

  consumeControlFrame(frame) {
    if (frame?.cameraToggle) this.toggle();
    if (frame?.recenter) this.resetPose({ recenter: true });
  }

  /** Clears chase-camera damping so the next update uses the exact pose. */
  resetPose({ recenter = false } = {}) {
    this.#assertLive();
    this.#thirdPosition = null;
    if (recenter) this.#recenter();
    this.#emit('reset');
    return this.getStatus();
  }

  /** Clears damping and, when given a pose, applies it immediately. */
  snap({ position, orientation, lookAt = null, recenter = false } = {}) {
    this.resetPose({ recenter });
    if (position === undefined && orientation === undefined) return this.getStatus();
    return this.update({ position, orientation, lookAt, deltaTime: 0 });
  }

  /**
   * Applies a local-origin shift to every owned camera frame without clearing
   * chase damping. Physics/world coordinates subtract the same shift, so this
   * preserves the exact camera-to-target relationship across a rebase.
   */
  shiftOrigin(shift) {
    this.#assertLive();
    if ((!Array.isArray(shift) && !ArrayBuffer.isView(shift)) || shift.length < 3) {
      throw new TypeError('origin shift must contain three components');
    }
    const value = Array.from(shift).slice(0, 3).map(Number);
    if (!value.every(Number.isFinite)) throw new TypeError('origin shift must be finite');
    if (this.#thirdPosition) this.#thirdPosition = subtract(this.#thirdPosition, value);
    const shiftedCameras = new Set();
    for (const camera of [this.#cameras.first, this.#cameras.third]) {
      if (!camera || shiftedCameras.has(camera)) continue;
      shiftedCameras.add(camera);
      const next = subtract(vector3(camera.position), value);
      setVector(camera.position, next);
      camera.updateMatrixWorld?.(true);
    }
    if (this.#xrAnchor) {
      setVector(this.#xrAnchor.position, subtract(vector3(this.#xrAnchor.position), value));
      this.#xrAnchor.updateMatrixWorld?.(true);
    }
    this.#emit('origin-shift');
    return deepFreeze({ shift: value, status: this.getStatus() });
  }

  #constrain(position, mode) {
    const minimum = Number(this.#minimumViewY([...position], { mode }));
    if (minimum !== Number.NEGATIVE_INFINITY && !Number.isFinite(minimum)) {
      throw new TypeError('minimumViewY must return a finite height or -Infinity');
    }
    const correction = Math.max(0, minimum - position[1]);
    const constrained = correction > 0
      ? [position[0], minimum, position[2]]
      : [...position];
    this.#lastConstraint = deepFreeze({ mode, minimumY: minimum, correction, position: constrained });
    return constrained;
  }

  update({ position, orientation, deltaTime = 0, lookAt = null, xrViewOffsets = null } = {}) {
    this.#assertLive();
    const targetPosition = vector3(position);
    const targetOrientation = quaternion(orientation);
    if (this.#mode === 'xr') {
      const anchorOrientation = multiplyQuaternion(targetOrientation, this.#xrOrientation);
      if (Array.isArray(xrViewOffsets) && xrViewOffsets.length > 0) {
        this.#lastXrViewOffsets = xrViewOffsets.map((offset) => vector3(offset));
      }
      const viewOffsets = this.#lastXrViewOffsets ?? [[0, 0, 0]];
      let correction = 0;
      for (const offset of viewOffsets) {
        const eye = add(targetPosition, rotateVector(offset, anchorOrientation));
        const constrainedEye = this.#constrain(eye, 'xr');
        correction = Math.max(correction, constrainedEye[1] - eye[1]);
      }
      const anchorPosition = [targetPosition[0], targetPosition[1] + correction, targetPosition[2]];
      this.#lastConstraint = deepFreeze({
        mode: 'xr',
        minimumY: null,
        correction,
        position: anchorPosition,
        eyeCount: viewOffsets.length,
      });
      const pose = deepFreeze({
        position: anchorPosition,
        orientation: anchorOrientation,
        eyeCount: viewOffsets.length,
        correction,
      });
      if (this.#setXRAnchorPose) {
        this.#setXRAnchorPose(pose);
      } else if (this.#xrAnchor) {
        setVector(this.#xrAnchor.position, anchorPosition);
        setQuaternion(this.#xrAnchor.quaternion, pose.orientation);
        this.#xrAnchor.updateMatrixWorld?.(true);
      }
      return pose;
    }
    if (this.#mode === 'first') {
      const camera = this.#cameras.first;
      const cameraPosition = this.#constrain(
        add(targetPosition, rotateVector(this.#firstOffset, targetOrientation)),
        'first',
      );
      const cameraOrientation = multiplyQuaternion(targetOrientation, this.#firstOrientation);
      setVector(camera.position, cameraPosition);
      setQuaternion(camera.quaternion, cameraOrientation);
      camera.updateMatrixWorld?.(true);
      return deepFreeze({ position: cameraPosition, orientation: cameraOrientation });
    }

    const camera = this.#cameras.third;
    const desired = add(targetPosition, rotateVector(this.#thirdOffset, targetOrientation));
    const delta = clamp(deltaTime, 0, 1);
    const alpha = this.#thirdPosition === null ? 1 : 1 - Math.exp(-this.#thirdDamping * delta);
    this.#thirdPosition = this.#constrain(
      lerp(this.#thirdPosition ?? desired, desired, alpha),
      'third',
    );
    const focus = lookAt ? vector3(lookAt) : add(targetPosition, rotateVector(this.#thirdLookOffset, targetOrientation));
    setVector(camera.position, this.#thirdPosition);
    if (typeof camera.lookAt === 'function') camera.lookAt(...focus);
    camera.updateMatrixWorld?.(true);
    return deepFreeze({ position: [...this.#thirdPosition], lookAt: focus });
  }

  getStatus() {
    return deepFreeze({
      disposed: this.#disposed,
      mode: this.#mode,
      nonXRMode: this.#nonXRMode,
      activeCamera: this.#mode,
      thirdPoseInitialized: this.#thirdPosition !== null,
      lastConstraint: this.#lastConstraint,
    });
  }

  subscribe(listener) {
    return this.#events.subscribe(listener);
  }

  #activate() {
    this.#setActiveCamera(this.#mode === 'xr' ? this.#cameras.xr : this.#cameras[this.#mode], this.#mode);
  }

  #emit(type) {
    this.#events.emit(Object.freeze({ type, status: this.getStatus() }));
  }

  dispose() {
    if (this.#disposed) return;
    this.#events.clear();
    this.#disposed = true;
  }

  #assertLive() {
    if (this.#disposed) throw new Error('ViewRig is disposed');
  }
}
