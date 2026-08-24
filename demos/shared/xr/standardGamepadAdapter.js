import { applyDeadzone, clamp, cloneGamepad, deepFreeze, listen } from './internal.js';

export const DEFAULT_STANDARD_GAMEPAD_MAPPING = deepFreeze({
  steerAxis: 0,
  throttleButton: 7,
  frontBrakeButton: 6,
  rearBrakeButton: 1,
  clutchButton: 2,
  shiftDownButton: 4,
  shiftUpButton: 5,
  handbrakeButton: 0,
  resetButton: 8,
  cameraToggleButton: 3,
  recenterButton: 9,
});

function button(snapshot, index) {
  if (!Number.isInteger(index) || index < 0) return 0;
  const candidate = snapshot.buttons[index];
  if (!candidate) return 0;
  return candidate.value > 0 ? candidate.value : (candidate.pressed ? 1 : 0);
}

function mapSnapshot(snapshot, mapping, deadzone) {
  const steer = applyDeadzone(snapshot.axes[mapping.steerAxis] ?? 0, deadzone);
  return {
    steer,
    throttle: button(snapshot, mapping.throttleButton),
    frontBrake: button(snapshot, mapping.frontBrakeButton),
    rearBrake: button(snapshot, mapping.rearBrakeButton),
    clutch: button(snapshot, mapping.clutchButton),
    shiftDelta: Math.sign(
      button(snapshot, mapping.shiftUpButton) - button(snapshot, mapping.shiftDownButton),
    ),
    handbrake: button(snapshot, mapping.handbrakeButton),
    reset: button(snapshot, mapping.resetButton),
    cameraToggle: button(snapshot, mapping.cameraToggleButton),
    recenter: button(snapshot, mapping.recenterButton),
  };
}

/** Polling adapter for W3C `standard` mapped gamepads. */
export class StandardGamepadAdapter {
  #input;
  #getGamepads;
  #sourcePrefix;
  #context;
  #mapping;
  #mapSource;
  #deadzone;
  #allowUnmapped;
  #active = new Set();
  #snapshots = new Map();
  #cleanup = [];
  #disposed = false;

  constructor({
    input,
    getGamepads = () => globalThis.navigator?.getGamepads?.() ?? [],
    eventTarget = globalThis.window,
    sourcePrefix = 'gamepad',
    context = 'gameplay',
    mapping = DEFAULT_STANDARD_GAMEPAD_MAPPING,
    mapSource = null,
    deadzone = 0.12,
    allowUnmapped = false,
  } = {}) {
    if (!input?.replaceSourceState) throw new TypeError('input must be an ActionInput-compatible object');
    if (typeof getGamepads !== 'function') throw new TypeError('getGamepads must be a function');
    this.#input = input;
    this.#getGamepads = getGamepads;
    this.#sourcePrefix = sourcePrefix;
    this.#context = context;
    this.#mapping = mapping;
    this.#deadzone = clamp(deadzone, 0, 0.95);
    if (mapSource !== null && typeof mapSource !== 'function') throw new TypeError('mapSource must be a function');
    this.#mapSource = mapSource;
    this.#allowUnmapped = Boolean(allowUnmapped);
    this.#cleanup.push(
      listen(eventTarget, 'gamepadconnected', () => this.poll()),
      listen(eventTarget, 'gamepaddisconnected', () => this.poll()),
      listen(eventTarget, 'blur', () => this.clear()),
    );
  }

  poll() {
    if (this.#disposed) return Object.freeze([]);
    const next = new Set();
    const snapshots = [];
    for (const liveGamepad of Array.from(this.#getGamepads() ?? [])) {
      if (!liveGamepad || liveGamepad.connected === false) continue;
      if (!this.#allowUnmapped && liveGamepad.mapping !== 'standard') continue;
      const snapshot = cloneGamepad(liveGamepad);
      if (!snapshot) continue;
      const sourceId = `${this.#sourcePrefix}:${snapshot.index}`;
      next.add(sourceId);
      this.#snapshots.set(sourceId, snapshot);
      snapshots.push(snapshot);
      const state = this.#mapSource
        ? this.#mapSource(snapshot, { deadzone: this.#deadzone, mapping: this.#mapping })
        : mapSnapshot(snapshot, this.#mapping, this.#deadzone);
      this.#input.replaceSourceState(sourceId, state ?? {}, {
        context: this.#context,
      });
    }
    for (const sourceId of this.#active) {
      if (!next.has(sourceId)) {
        this.#input.removeSource(sourceId);
        this.#snapshots.delete(sourceId);
      }
    }
    this.#active = next;
    return Object.freeze(snapshots);
  }

  getSnapshots() {
    return deepFreeze([...this.#snapshots.entries()]
      .map(([sourceId, snapshot]) => ({ sourceId, snapshot }))
      .sort((a, b) => a.sourceId.localeCompare(b.sourceId)));
  }

  clear() {
    for (const sourceId of this.#active) this.#input.removeSource(sourceId);
    this.#active.clear();
    this.#snapshots.clear();
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const cleanup of this.#cleanup.splice(0)) cleanup();
    this.clear();
  }
}
