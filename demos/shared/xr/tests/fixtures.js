export class FakeEventTarget {
  listeners = new Map();

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event) {
    if (typeof event === 'string') event = { type: event };
    if (!event.target) event.target = this;
    for (const listener of [...(this.listeners.get(event.type) ?? [])]) listener.call(this, event);
    return !event.defaultPrevented;
  }

  listenerCount(type = null) {
    if (type) return this.listeners.get(type)?.size ?? 0;
    return [...this.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0);
  }
}

export class FakeElement extends FakeEventTarget {
  constructor(rect = { left: 0, top: 0, width: 100, height: 100 }) {
    super();
    this.rect = rect;
    this.style = { touchAction: 'pan-y' };
    this.captured = new Set();
  }

  getBoundingClientRect() {
    return { ...this.rect };
  }

  setPointerCapture(id) {
    this.captured.add(id);
  }

  releasePointerCapture(id) {
    this.captured.delete(id);
  }
}

export class FakePointerLockDocument extends FakeEventTarget {
  constructor() {
    super();
    this.pointerLockElement = null;
    this.visibilityState = 'visible';
    this.hidden = false;
    this.exitCalls = 0;
  }

  setPointerLock(element) {
    this.pointerLockElement = element;
    this.dispatchEvent({ type: 'pointerlockchange' });
  }

  exitPointerLock() {
    this.exitCalls += 1;
    this.setPointerLock(null);
  }

  setHidden(hidden) {
    this.hidden = Boolean(hidden);
    this.visibilityState = this.hidden ? 'hidden' : 'visible';
    this.dispatchEvent({ type: 'visibilitychange' });
  }
}

export class FakePointerLockElement extends FakeElement {
  constructor(documentTarget, rect) {
    super(rect);
    this.ownerDocument = documentTarget;
    this.pointerLockRequests = [];
  }

  requestPointerLock(options) {
    this.pointerLockRequests.push(options);
    this.ownerDocument.setPointerLock(this);
  }
}

export function fakeEvent(type, properties = {}) {
  return {
    type,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    ...properties,
  };
}

export class FakeNode extends FakeEventTarget {
  constructor(name = '') {
    super();
    this.name = name;
    this.parent = null;
    this.children = [];
    this.position = new FakeVector3();
    this.quaternion = new FakeQuaternion();
    this.scale = new FakeVector3(1, 1, 1);
    this.visible = true;
  }

  add(child) {
    if (child.parent) child.parent.remove(child);
    child.parent = this;
    this.children.push(child);
  }

  remove(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) this.children.splice(index, 1);
    if (child?.parent === this) child.parent = null;
  }

  updateMatrixWorld() {}
}

export class FakeVector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.set(x, y, z);
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  fromArray(values) {
    return this.set(values[0], values[1], values[2]);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }
}

export class FakeQuaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.set(x, y, z, w);
  }

  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  fromArray(values) {
    return this.set(values[0], values[1], values[2], values[3]);
  }

  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
}

export class FakeCamera extends FakeNode {
  constructor(name = '') {
    super(name);
    this.up = new FakeVector3(0, 1, 0);
    this.near = 0.1;
    this.far = 1000;
    this.fov = 60;
    this.zoom = 1;
    this.aspect = 1;
    this.matrixAutoUpdate = true;
    this.lookTarget = null;
    this.projectionUpdates = 0;
  }

  lookAt(...point) {
    this.lookTarget = point;
  }

  updateProjectionMatrix() {
    this.projectionUpdates += 1;
  }
}

export function makeGamepad({
  index = 0,
  mapping = 'standard',
  axes = [0, 0],
  buttons = Array.from({ length: 10 }, () => ({ value: 0, pressed: false, touched: false })),
} = {}) {
  return {
    id: `pad-${index}`,
    index,
    mapping,
    connected: true,
    timestamp: 1,
    axes,
    buttons,
  };
}
