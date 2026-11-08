export function clamp(value, minimum = 0, maximum = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return minimum;
  return Math.min(maximum, Math.max(minimum, number));
}

export function applyDeadzone(value, deadzone = 0) {
  const number = clamp(value, -1, 1);
  const threshold = clamp(deadzone, 0, 0.95);
  const magnitude = Math.abs(number);
  if (magnitude <= threshold) return 0;
  return Math.sign(number) * ((magnitude - threshold) / (1 - threshold));
}

export function deepFreeze(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

export function uniqueStrings(values = []) {
  return [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))];
}

export function listen(target, type, listener, options) {
  if (!target?.addEventListener || !target?.removeEventListener) return () => {};
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}

export class EventHub {
  #listeners = new Set();

  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  emit(event) {
    for (const listener of [...this.#listeners]) listener(event);
  }

  clear() {
    this.#listeners.clear();
  }
}

export function setVector(target, values) {
  if (!target || !values) return;
  if (typeof target.fromArray === 'function') {
    target.fromArray(values);
  } else if (typeof target.set === 'function') {
    target.set(...values);
  } else {
    [target.x, target.y, target.z] = values;
  }
}

export function readVector(target, length = 3) {
  if (!target) return null;
  if (typeof target.toArray === 'function') return target.toArray([]).slice(0, length);
  const fields = length === 4 ? ['x', 'y', 'z', 'w'] : ['x', 'y', 'z'];
  const values = fields.map((field) => Number(target[field]));
  return values.every(Number.isFinite) ? values : null;
}

export function setQuaternion(target, values) {
  if (!target || !values) return;
  if (typeof target.fromArray === 'function') {
    target.fromArray(values);
  } else if (typeof target.set === 'function') {
    target.set(...values);
  } else {
    [target.x, target.y, target.z, target.w] = values;
  }
}

export function cloneGamepad(gamepad) {
  if (!gamepad) return null;
  return deepFreeze({
    id: String(gamepad.id ?? ''),
    index: Number.isInteger(gamepad.index) ? gamepad.index : -1,
    mapping: String(gamepad.mapping ?? ''),
    connected: gamepad.connected !== false,
    timestamp: Number.isFinite(gamepad.timestamp) ? gamepad.timestamp : 0,
    axes: Array.from(gamepad.axes ?? [], (value) => clamp(value, -1, 1)),
    buttons: Array.from(gamepad.buttons ?? [], (button) => {
      const value = clamp(typeof button === 'number' ? button : button?.value, 0, 1);
      return Object.freeze({
        value,
        pressed: typeof button === 'object' && 'pressed' in button ? Boolean(button.pressed) : value >= 0.5,
        touched: Boolean(typeof button === 'object' && button?.touched),
      });
    }),
  });
}
