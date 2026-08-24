import { cloneGamepad, deepFreeze, readVector } from './internal.js';

function poseFromXRFrame(frame, space, referenceSpace) {
  if (!frame?.getPose || !space || !referenceSpace) return null;
  try {
    const pose = frame.getPose(space, referenceSpace);
    const transform = pose?.transform;
    if (!transform) return null;
    return deepFreeze({
      position: readVector(transform.position),
      orientation: readVector(transform.orientation, 4),
      emulatedPosition: Boolean(pose.emulatedPosition),
    });
  } catch {
    return null;
  }
}

function eventEdges(channel, previous = {}) {
  return deepFreeze({
    held: Boolean(channel?.held),
    pressed: Number(channel?.startCount ?? 0) > Number(previous.startCount ?? 0),
    released: Number(channel?.endCount ?? 0) > Number(previous.endCount ?? 0),
    startCount: Number(channel?.startCount ?? 0),
    endCount: Number(channel?.endCount ?? 0),
    lastEvent: channel?.lastEvent ? { ...channel.lastEvent } : null,
  });
}

function eventCursor(inputState) {
  return {
    select: {
      startCount: inputState.select.startCount,
      endCount: inputState.select.endCount,
    },
    squeeze: {
      startCount: inputState.squeeze.startCount,
      endCount: inputState.squeeze.endCount,
    },
  };
}

function sourceSnapshot({ sourceId, entry, gamepad, previous, frame, referenceSpace }) {
  const registered = entry.inputState;
  const targetRayPose = poseFromXRFrame(frame, entry.inputSource.targetRaySpace, referenceSpace)
    ?? registered.poses.targetRay;
  const gripPose = poseFromXRFrame(frame, entry.inputSource.gripSpace, referenceSpace)
    ?? registered.poses.grip;
  const select = eventEdges(registered.select, previous?.select);
  const squeeze = eventEdges(registered.squeeze, previous?.squeeze);
  return deepFreeze({
    sourceId,
    entryId: entry.id,
    handedness: entry.handedness,
    role: entry.role,
    targetRayMode: entry.targetRayMode,
    profiles: [...entry.profiles],
    xrStandard: gamepad,
    gamepad,
    events: {
      selectstart: select.pressed,
      selectend: select.released,
      squeezestart: squeeze.pressed,
      squeezeend: squeeze.released,
    },
    select,
    squeeze,
    hand: registered.hand,
    pointer: {
      available: registered.pointer.available || Boolean(targetRayPose),
      mode: registered.pointer.mode,
      pose: targetRayPose,
    },
    poses: {
      targetRay: targetRayPose,
      grip: gripPose,
      hand: registered.poses.hand,
    },
  });
}

/** Maps copied WebXR event, hand, pose, and `xr-standard` state. */
export class WebXRInputAdapter {
  #input;
  #registry;
  #context;
  #sourcePrefix;
  #mapSource;
  #mapInput;
  #deadzone;
  #active = new Set();
  #snapshots = new Map();
  #inputStates = new Map();
  #eventCursors = new Map();
  #unsubscribe;
  #disposed = false;

  constructor({
    input,
    registry,
    context = 'gameplay',
    sourcePrefix = 'webxr',
    mapSource = null,
    mapInput = null,
    deadzone = 0.14,
  } = {}) {
    if (!input?.replaceSourceState) throw new TypeError('input must be an ActionInput-compatible object');
    if (!registry?.getEntries || !registry?.subscribe) throw new TypeError('registry is required');
    if (typeof mapSource !== 'function' && typeof mapInput !== 'function') {
      throw new TypeError('mapInput or mapSource must be a function');
    }
    this.#input = input;
    this.#registry = registry;
    this.#context = context;
    this.#sourcePrefix = sourcePrefix;
    this.#mapSource = typeof mapSource === 'function' ? mapSource : null;
    this.#mapInput = typeof mapInput === 'function' ? mapInput : null;
    this.#deadzone = deadzone;
    this.#unsubscribe = registry.subscribe((event) => {
      if (event.type === 'removed') this.#removeEntry(event.entry.id);
    });
  }

  poll({ frame = null, referenceSpace = null } = {}) {
    if (this.#disposed) return Object.freeze([]);
    const next = new Set();
    const polled = [];
    for (const entry of this.#registry.getEntries()) {
      const gamepad = entry.inputSource.gamepad;
      const snapshot = gamepad?.mapping === 'xr-standard' ? cloneGamepad(gamepad) : null;
      if (!this.#mapInput && !snapshot) continue;
      const sourceId = `${this.#sourcePrefix}:${entry.id}`;
      next.add(sourceId);
      if (snapshot) this.#snapshots.set(sourceId, snapshot);
      else this.#snapshots.delete(sourceId);
      const inputState = sourceSnapshot({
        sourceId,
        entry,
        gamepad: snapshot,
        previous: this.#eventCursors.get(sourceId),
        frame,
        referenceSpace,
      });
      this.#inputStates.set(sourceId, inputState);
      this.#eventCursors.set(sourceId, eventCursor(inputState));
      const options = Object.freeze({ deadzone: this.#deadzone, inputState });
      const state = (this.#mapInput
        ? this.#mapInput(inputState, entry, options)
        : this.#mapSource(snapshot, entry, options)) ?? {};
      this.#input.replaceSourceState(sourceId, state, { context: this.#context });
      polled.push(Object.freeze({
        entryId: entry.id,
        handedness: entry.handedness,
        snapshot,
        inputState,
      }));
    }
    for (const sourceId of this.#active) {
      if (!next.has(sourceId)) this.#removeSource(sourceId);
    }
    this.#active = next;
    return Object.freeze(polled);
  }

  #removeEntry(entryId) {
    this.#removeSource(`${this.#sourcePrefix}:${entryId}`);
  }

  #removeSource(sourceId) {
    this.#input.removeSource(sourceId);
    this.#active.delete(sourceId);
    this.#snapshots.delete(sourceId);
    this.#inputStates.delete(sourceId);
    this.#eventCursors.delete(sourceId);
  }

  getSnapshots() {
    return deepFreeze([...this.#snapshots.entries()]
      .map(([sourceId, snapshot]) => ({ sourceId, snapshot }))
      .sort((a, b) => a.sourceId.localeCompare(b.sourceId)));
  }

  getInputStates() {
    return deepFreeze([...this.#inputStates.entries()]
      .map(([sourceId, inputState]) => ({ sourceId, inputState }))
      .sort((a, b) => a.sourceId.localeCompare(b.sourceId)));
  }

  clear() {
    for (const sourceId of this.#active) this.#input.removeSource(sourceId);
    this.#active.clear();
    this.#snapshots.clear();
    this.#inputStates.clear();
    this.#eventCursors.clear();
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.clear();
  }
}
