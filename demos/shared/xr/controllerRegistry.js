import { deepFreeze, EventHub, listen, readVector } from './internal.js';

const INPUT_EVENT_TYPES = Object.freeze([
  'selectstart',
  'selectend',
  'squeezestart',
  'squeezeend',
]);

function roleFor(source) {
  return source?.hand ? 'hand' : 'controller';
}

function poseSnapshot(object) {
  if (!object) return null;
  const position = readVector(object.position);
  const orientation = readVector(object.quaternion, 4);
  if (!position && !orientation) return null;
  return deepFreeze({
    position,
    orientation,
    visible: object.visible !== false,
  });
}

function handSnapshot(source) {
  if (!source?.hand) return deepFreeze({ tracked: false, jointCount: 0, joints: [] });
  let joints = [];
  try {
    joints = Array.from(source.hand.keys?.() ?? [], (joint) => String(joint)).sort();
  } catch {
    joints = [];
  }
  const size = Number(source.hand.size);
  return deepFreeze({
    tracked: true,
    jointCount: Number.isInteger(size) && size >= 0 ? size : joints.length,
    joints,
  });
}

function interactionChannel() {
  return {
    held: false,
    startCount: 0,
    endCount: 0,
    lastEvent: null,
  };
}

function copyInteractionChannel(channel) {
  return deepFreeze({
    held: channel.held,
    startCount: channel.startCount,
    endCount: channel.endCount,
    lastEvent: channel.lastEvent ? { ...channel.lastEvent } : null,
  });
}

function inputStateFor(entry) {
  const targetRayPose = poseSnapshot(entry.targetRayObject);
  const gripPose = poseSnapshot(entry.gripObject);
  const handPose = poseSnapshot(entry.handObject);
  return deepFreeze({
    select: copyInteractionChannel(entry.interaction.select),
    squeeze: copyInteractionChannel(entry.interaction.squeeze),
    hand: handSnapshot(entry.source),
    pointer: {
      available: Boolean(entry.targetRayObject),
      mode: entry.source.targetRayMode || 'tracked-pointer',
      pose: targetRayPose,
    },
    poses: {
      targetRay: targetRayPose,
      grip: gripPose,
      hand: handPose,
    },
  });
}

function publicEntry(entry) {
  const inputState = inputStateFor(entry);
  return Object.freeze({
    id: entry.id,
    slot: entry.slot,
    handedness: entry.source.handedness || 'none',
    role: roleFor(entry.source),
    targetRayMode: entry.source.targetRayMode || 'tracked-pointer',
    profiles: Object.freeze(Array.from(entry.source.profiles ?? [])),
    inputSource: entry.source,
    targetRayObject: entry.targetRayObject,
    gripObject: entry.gripObject,
    handObject: entry.handObject,
    controllerModel: entry.controllerModel,
    handModel: entry.handModel,
    inputState,
    select: inputState.select,
    squeeze: inputState.squeeze,
    pointer: inputState.pointer,
    poses: inputState.poses,
    handState: inputState.hand,
  });
}

/**
 * Tracks XRInputSource identity independently of Three controller array order,
 * while still provisioning Three target-ray, grip, and hand spaces by slot.
 */
export class XRControllerRegistry {
  #rendererXR;
  #scene;
  #controllerModelFactory;
  #handModelFactory;
  #disposeObject;
  #maximumSources;
  #session = null;
  #entries = new Map();
  #sourceIds = new WeakMap();
  #nextId = 1;
  #cleanup = [];
  #events = new EventHub();
  #disposed = false;

  constructor({
    rendererXR,
    scene = null,
    controllerModelFactory = null,
    handModelFactory = null,
    disposeObject = null,
    maximumSources = 8,
  } = {}) {
    if (!rendererXR) throw new TypeError('rendererXR is required');
    this.#rendererXR = rendererXR;
    this.#scene = scene;
    this.#controllerModelFactory = controllerModelFactory;
    this.#handModelFactory = handModelFactory;
    this.#disposeObject = disposeObject;
    this.#maximumSources = Math.max(1, Math.floor(maximumSources));
  }

  attachSession(session) {
    this.#assertLive();
    if (session === this.#session) {
      this.sync();
      return;
    }
    this.detachSession();
    if (!session) return;
    this.#session = session;
    this.#cleanup.push(
      listen(session, 'inputsourceschange', () => this.sync()),
      listen(session, 'end', () => this.detachSession()),
      ...INPUT_EVENT_TYPES.map((type) => listen(session, type, (event) => this.#onInputEvent(type, event))),
    );
    this.sync();
  }

  detachSession() {
    for (const cleanup of this.#cleanup.splice(0)) cleanup();
    for (const entry of [...this.#entries.values()]) this.#removeEntry(entry);
    this.#entries.clear();
    this.#session = null;
  }

  sync() {
    this.#assertLive();
    const sources = Array.from(this.#session?.inputSources ?? []).slice(0, this.#maximumSources);
    const sourceSet = new Set(sources);
    for (const entry of [...this.#entries.values()]) {
      if (!sourceSet.has(entry.source)) {
        this.#entries.delete(entry.source);
        this.#removeEntry(entry);
      }
    }
    const occupiedSlots = new Set([...this.#entries.values()].map((entry) => entry.slot));
    for (const source of sources) {
      if (this.#entries.has(source)) continue;
      let slot = 0;
      while (occupiedSlots.has(slot) && slot < this.#maximumSources) slot += 1;
      if (slot >= this.#maximumSources) break;
      occupiedSlots.add(slot);
      const entry = this.#createEntry(source, slot);
      this.#entries.set(source, entry);
      this.#events.emit(Object.freeze({ type: 'added', entry: publicEntry(entry) }));
    }
    this.#events.emit(Object.freeze({ type: 'change', entries: this.getEntries() }));
  }

  #createEntry(source, slot) {
    let id = this.#sourceIds.get(source);
    if (!id) {
      id = `xr-source:${this.#nextId}`;
      this.#nextId += 1;
      this.#sourceIds.set(source, id);
    }
    const targetRayObject = this.#rendererXR.getController?.(slot) ?? null;
    const gripObject = source.gripSpace ? (this.#rendererXR.getControllerGrip?.(slot) ?? null) : null;
    const handObject = source.hand ? (this.#rendererXR.getHand?.(slot) ?? null) : null;
    const entry = {
      id,
      slot,
      source,
      targetRayObject,
      gripObject,
      handObject,
      controllerModel: null,
      handModel: null,
      interaction: {
        sequence: 0,
        select: interactionChannel(),
        squeeze: interactionChannel(),
      },
      sceneOwned: [],
    };
    for (const object of [targetRayObject, gripObject, handObject]) {
      if (object && this.#scene?.add && !object.parent) {
        this.#scene.add(object);
        entry.sceneOwned.push(object);
      }
    }
    if (gripObject && this.#controllerModelFactory?.createControllerModel) {
      entry.controllerModel = this.#controllerModelFactory.createControllerModel(gripObject) ?? null;
      if (entry.controllerModel && entry.controllerModel.parent !== gripObject) gripObject.add?.(entry.controllerModel);
    }
    if (handObject && this.#handModelFactory?.createHandModel) {
      entry.handModel = this.#handModelFactory.createHandModel(handObject, 'mesh') ?? null;
      if (entry.handModel && entry.handModel.parent !== handObject) handObject.add?.(entry.handModel);
    }
    return entry;
  }

  #onInputEvent(type, event) {
    const inputSource = event?.inputSource;
    if (!inputSource) return;
    if (!this.#entries.has(inputSource)) this.sync();
    const entry = this.#entries.get(inputSource);
    if (!entry) return;
    const channel = type.startsWith('select') ? entry.interaction.select : entry.interaction.squeeze;
    const started = type.endsWith('start');
    channel.held = started;
    if (started) channel.startCount += 1;
    else channel.endCount += 1;
    entry.interaction.sequence += 1;
    channel.lastEvent = Object.freeze({
      type,
      sequence: entry.interaction.sequence,
      timeStamp: Number.isFinite(event.timeStamp) ? event.timeStamp : 0,
      inputSourceId: entry.id,
      handedness: entry.source.handedness || 'none',
    });
    this.#events.emit(Object.freeze({
      type: 'input',
      phase: type,
      event: channel.lastEvent,
      entry: publicEntry(entry),
    }));
  }

  #removeEntry(entry) {
    for (const model of [entry.controllerModel, entry.handModel]) {
      if (!model) continue;
      model?.parent?.remove?.(model);
      this.#disposeObject?.(model);
    }
    for (const object of entry.sceneOwned) this.#scene?.remove?.(object);
    this.#events.emit(Object.freeze({ type: 'removed', entry: publicEntry(entry) }));
  }

  getEntries({ handedness, role } = {}) {
    return Object.freeze([...this.#entries.values()]
      .filter((entry) => !handedness || (entry.source.handedness || 'none') === handedness)
      .filter((entry) => !role || roleFor(entry.source) === role)
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(publicEntry));
  }

  getByInputSource(inputSource) {
    const entry = this.#entries.get(inputSource);
    return entry ? publicEntry(entry) : null;
  }

  getStatus() {
    return deepFreeze({
      disposed: this.#disposed,
      attached: Boolean(this.#session),
      sourceCount: this.#entries.size,
      inputs: this.getEntries().map((entry) => ({
        id: entry.id,
        handedness: entry.handedness,
        role: entry.role,
        targetRayMode: entry.targetRayMode,
        profiles: [...entry.profiles],
        hasGamepad: Boolean(entry.inputSource.gamepad),
        hasTargetRay: entry.pointer.available,
        selectHeld: entry.select.held,
        squeezeHeld: entry.squeeze.held,
        handTracked: entry.handState.tracked,
      })),
    });
  }

  subscribe(listener) {
    return this.#events.subscribe(listener);
  }

  dispose() {
    if (this.#disposed) return;
    this.detachSession();
    this.#events.clear();
    this.#disposed = true;
  }

  #assertLive() {
    if (this.#disposed) throw new Error('XRControllerRegistry is disposed');
  }
}
