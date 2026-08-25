import { clamp, listen } from './internal.js';

export const DEFAULT_KEYBOARD_BINDINGS = Object.freeze({
  ArrowLeft: Object.freeze({ action: 'steer', value: -1 }),
  KeyA: Object.freeze({ action: 'steer', value: -1 }),
  ArrowRight: Object.freeze({ action: 'steer', value: 1 }),
  KeyD: Object.freeze({ action: 'steer', value: 1 }),
  ArrowUp: Object.freeze({ action: 'throttle', value: 1 }),
  KeyW: Object.freeze({ action: 'throttle', value: 1 }),
  ArrowDown: Object.freeze({ action: 'rearBrake', value: 1 }),
  KeyS: Object.freeze({ action: 'rearBrake', value: 1 }),
  Space: Object.freeze({ action: 'frontBrake', value: 1 }),
  ShiftLeft: Object.freeze({ action: 'clutch', value: 1 }),
  ShiftRight: Object.freeze({ action: 'clutch', value: 1 }),
  KeyQ: Object.freeze({ action: 'shiftDelta', value: -1 }),
  KeyE: Object.freeze({ action: 'shiftDelta', value: 1 }),
  KeyX: Object.freeze({ action: 'handbrake', value: 1 }),
  KeyR: Object.freeze({ action: 'reset', value: 1 }),
  KeyC: Object.freeze({ action: 'cameraToggle', value: 1 }),
  KeyH: Object.freeze({ action: 'recenter', value: 1 }),
});

function emptyState(actionNames) {
  return Object.fromEntries(actionNames.map((action) => [action, 0]));
}

function mergeState(target, action, value) {
  if (!(action in target)) return;
  if (action === 'steer' || action === 'shiftDelta') {
    target[action] = clamp(target[action] + value, -1, 1);
  } else {
    target[action] = Math.max(target[action], value);
  }
}

/** Keyboard controls plus an optional mouse drag steering/pedal surface. */
export class KeyboardPointerAdapter {
  #input;
  #sourceId;
  #context;
  #target;
  #pointerTarget;
  #documentTarget;
  #bindings;
  #actionNames;
  #pressed = new Set();
  #pointer = null;
  #pointerState;
  #cleanup = [];
  #disposed = false;
  #started = false;
  #pointerSpan;
  #preventDefault;
  #requestPointerLockOnPointerDown;
  #pointerLockOptions;
  #pointerLocked = false;
  #lockedMovement = { x: 0, y: 0 };

  constructor({
    input,
    target = globalThis.window,
    pointerTarget = null,
    documentTarget = pointerTarget?.ownerDocument ?? globalThis.document,
    sourceId = 'keyboard-pointer',
    context = 'gameplay',
    bindings = DEFAULT_KEYBOARD_BINDINGS,
    pointerSpan = 120,
    preventDefault = true,
    pointerLock = false,
    requestPointerLockOnPointerDown,
    pointerLockOptions,
  } = {}) {
    if (!input?.replaceSourceState) throw new TypeError('input must be an ActionInput-compatible object');
    if (!target?.addEventListener) throw new TypeError('target must support events');
    this.#input = input;
    this.#actionNames = input.getActionNames?.() ?? [];
    if (this.#actionNames.length === 0) throw new TypeError('input must expose one or more action names');
    this.#target = target;
    this.#pointerTarget = pointerTarget;
    this.#documentTarget = documentTarget;
    this.#sourceId = sourceId;
    this.#context = context;
    this.#bindings = bindings;
    for (const binding of Object.values(bindings)) {
      if (!input.hasAction?.(binding.action)) throw new RangeError(`unknown keyboard action: ${binding.action}`);
    }
    this.#pointerState = emptyState(this.#actionNames);
    this.#pointerSpan = Math.max(16, Number(pointerSpan) || 120);
    this.#preventDefault = Boolean(preventDefault);
    const pointerLockConfig = pointerLock && typeof pointerLock === 'object' ? pointerLock : {};
    this.#requestPointerLockOnPointerDown = requestPointerLockOnPointerDown === undefined
      ? pointerLock === true || pointerLockConfig.requestOnPointerDown === true
      : Boolean(requestPointerLockOnPointerDown);
    this.#pointerLockOptions = pointerLockOptions ?? pointerLockConfig.options;
    this.start();
  }

  start() {
    if (this.#disposed) throw new Error('KeyboardPointerAdapter is disposed');
    if (this.#started) return this;
    this.#started = true;
    this.#cleanup.push(
      listen(this.#target, 'keydown', (event) => this.#onKey(event, true)),
      listen(this.#target, 'keyup', (event) => this.#onKey(event, false)),
      listen(this.#target, 'blur', () => this.clear()),
    );
    if (this.#pointerTarget?.addEventListener) {
      this.#cleanup.push(
        listen(this.#pointerTarget, 'pointerdown', (event) => this.#onPointerDown(event)),
        listen(this.#pointerTarget, 'pointermove', (event) => this.#onPointerMove(event)),
        listen(this.#pointerTarget, 'pointerup', (event) => this.#onPointerEnd(event)),
        listen(this.#pointerTarget, 'pointercancel', (event) => this.#onPointerEnd(event)),
        listen(this.#pointerTarget, 'lostpointercapture', (event) => this.#onPointerEnd(event)),
        listen(this.#pointerTarget, 'contextmenu', (event) => {
          if (this.#preventDefault) event.preventDefault?.();
        }),
      );
    }
    this.#cleanup.push(
      listen(this.#documentTarget, 'pointerlockchange', () => this.#onPointerLockChange()),
      listen(this.#documentTarget, 'visibilitychange', () => this.clear()),
    );
    this.#pointerLocked = Boolean(this.#pointerTarget)
      && this.#documentTarget?.pointerLockElement === this.#pointerTarget;
    this.#publish();
    return this;
  }

  clear() {
    this.#pressed.clear();
    this.#resetPointerState();
    if (!this.#disposed && this.#started) this.#publish();
  }

  /**
   * Requests pointer lock. Call this from an application-owned user gesture,
   * or opt into the primary-pointer gesture with `pointerLock: true`.
   */
  requestPointerLock(options = this.#pointerLockOptions) {
    if (this.#disposed) throw new Error('KeyboardPointerAdapter is disposed');
    if (!this.#started || typeof this.#pointerTarget?.requestPointerLock !== 'function') return false;
    const result = options === undefined
      ? this.#pointerTarget.requestPointerLock()
      : this.#pointerTarget.requestPointerLock(options);
    return result && typeof result.then === 'function' ? result.then(() => true) : true;
  }

  #requestPointerLockFromGesture() {
    try {
      const result = this.requestPointerLock();
      result?.catch?.(() => {});
    } catch {
      // Unsupported/denied lock leaves normal pointer-drag controls active.
    }
  }

  #onKey(event, down) {
    const binding = this.#bindings[event.code];
    if (!binding) return;
    if (this.#preventDefault) event.preventDefault?.();
    if (down) this.#pressed.add(event.code);
    else this.#pressed.delete(event.code);
    this.#publish();
  }

  #onPointerDown(event) {
    if (event.pointerType === 'touch') return;
    if (event.button === 2) {
      if ('frontBrake' in this.#pointerState) this.#pointerState.frontBrake = 1;
      this.#publish();
      if (this.#preventDefault) event.preventDefault?.();
      return;
    }
    if (event.button !== 0 || this.#pointer) return;
    if (this.#requestPointerLockOnPointerDown) this.#requestPointerLockFromGesture();
    if (this.#pointerLocked) {
      if (this.#preventDefault) event.preventDefault?.();
      return;
    }
    this.#pointer = {
      id: event.pointerId,
      x: Number(event.clientX) || 0,
      y: Number(event.clientY) || 0,
    };
    try {
      this.#pointerTarget?.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is an optional continuity aid; a cancelled or
      // synthetic pointer must not break desktop controls.
    }
    if (this.#preventDefault) event.preventDefault?.();
  }

  #onPointerMove(event) {
    if (this.#pointerLocked) {
      const movementX = Number(event.movementX);
      const movementY = Number(event.movementY);
      this.#lockedMovement.x += Number.isFinite(movementX) ? movementX : 0;
      this.#lockedMovement.y += Number.isFinite(movementY) ? movementY : 0;
      this.#applyPointerMovement(this.#lockedMovement.x, this.#lockedMovement.y);
      this.#publish();
      if (this.#preventDefault) event.preventDefault?.();
      return;
    }
    if (!this.#pointer || event.pointerId !== this.#pointer.id) return;
    const dx = (Number(event.clientX) || 0) - this.#pointer.x;
    const dy = (Number(event.clientY) || 0) - this.#pointer.y;
    this.#applyPointerMovement(dx, dy);
    this.#publish();
    if (this.#preventDefault) event.preventDefault?.();
  }

  #applyPointerMovement(dx, dy) {
    if ('steer' in this.#pointerState) this.#pointerState.steer = clamp(dx / this.#pointerSpan, -1, 1);
    if ('throttle' in this.#pointerState) this.#pointerState.throttle = clamp(-dy / this.#pointerSpan, 0, 1);
    if ('rearBrake' in this.#pointerState) this.#pointerState.rearBrake = clamp(dy / this.#pointerSpan, 0, 1);
  }

  #onPointerEnd(event) {
    if ((event.button === 2 || (event.buttons & 2) === 0) && 'frontBrake' in this.#pointerState) {
      this.#pointerState.frontBrake = 0;
    }
    if (this.#pointer && event.pointerId === this.#pointer.id) {
      try {
        this.#pointerTarget?.releasePointerCapture?.(event.pointerId);
      } catch {
        // The browser may have already released the pointer during teardown.
      }
      this.#pointer = null;
      if ('steer' in this.#pointerState) this.#pointerState.steer = 0;
      if ('throttle' in this.#pointerState) this.#pointerState.throttle = 0;
      if ('rearBrake' in this.#pointerState) this.#pointerState.rearBrake = 0;
    }
    this.#publish();
  }

  #onPointerLockChange() {
    const locked = Boolean(this.#pointerTarget)
      && this.#documentTarget?.pointerLockElement === this.#pointerTarget;
    if (locked === this.#pointerLocked) return;
    this.#pointerLocked = locked;
    if (locked) {
      this.#resetPointerState();
      this.#publish();
    } else {
      this.clear();
    }
  }

  #resetPointerState() {
    if (this.#pointer) {
      try {
        this.#pointerTarget?.releasePointerCapture?.(this.#pointer.id);
      } catch {
        // Blur, lock loss, and disposal can invalidate capture first.
      }
    }
    this.#pointer = null;
    this.#lockedMovement = { x: 0, y: 0 };
    this.#pointerState = emptyState(this.#actionNames);
  }

  #publish() {
    const state = emptyState(this.#actionNames);
    for (const code of this.#pressed) {
      const binding = this.#bindings[code];
      if (binding) mergeState(state, binding.action, Number(binding.value) || 0);
    }
    for (const action of this.#actionNames) mergeState(state, action, this.#pointerState[action]);
    this.#input.replaceSourceState(this.#sourceId, state, { context: this.#context });
  }

  getStatus() {
    return Object.freeze({
      disposed: this.#disposed,
      started: this.#started,
      pointerLocked: this.#pointerLocked,
      requestPointerLockOnPointerDown: this.#requestPointerLockOnPointerDown,
      lockedMovement: Object.freeze({ ...this.#lockedMovement }),
    });
  }

  stop() {
    if (!this.#started) return this;
    this.#pressed.clear();
    this.#resetPointerState();
    this.#pointerLocked = false;
    for (const cleanup of this.#cleanup.splice(0)) cleanup();
    if (this.#pointerTarget
      && this.#documentTarget?.pointerLockElement === this.#pointerTarget) {
      this.#documentTarget.exitPointerLock?.();
    }
    this.#input.removeSource(this.#sourceId);
    this.#started = false;
    return this;
  }

  dispose() {
    if (this.#disposed) return;
    this.stop();
    this.#disposed = true;
  }
}
