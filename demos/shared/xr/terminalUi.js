import { clamp, deepFreeze, EventHub } from './internal.js';

export const TERMINAL_UI_THEME = deepFreeze({
  background: '#000900',
  panel: '#001400',
  foreground: '#7dff9b',
  accent: '#00ff66',
  focus: '#00e5ff',
  pressed: '#ff2eea',
  disabled: '#54705b',
  track: '#0b4d2b',
  font: 'monospace',
});

function validateBounds(bounds = {}) {
  const normalized = {
    x: Number(bounds.x) || 0,
    y: Number(bounds.y) || 0,
    width: Number(bounds.width),
    height: Number(bounds.height),
  };
  if (!(normalized.width > 0) || !(normalized.height > 0)) {
    throw new RangeError('control bounds need positive width and height');
  }
  return normalized;
}

class TerminalControl {
  _events = new EventHub();

  constructor({ id, label = '', bounds, disabled = false, visible = true } = {}) {
    if (typeof id !== 'string' || id.length === 0) throw new TypeError('control id is required');
    this.id = id;
    this.label = String(label);
    this.bounds = validateBounds(bounds);
    this.disabled = Boolean(disabled);
    this.visible = Boolean(visible);
    this.hovered = false;
    this.focused = false;
    this.pressed = false;
  }

  contains(x, y) {
    const { bounds } = this;
    return this.visible
      && x >= bounds.x
      && y >= bounds.y
      && x <= bounds.x + bounds.width
      && y <= bounds.y + bounds.height;
  }

  setState(patch = {}) {
    let changed = false;
    for (const field of ['disabled', 'visible', 'hovered', 'focused', 'pressed']) {
      if (field in patch && this[field] !== Boolean(patch[field])) {
        this[field] = Boolean(patch[field]);
        changed = true;
      }
    }
    if (changed) this._emit('state');
  }

  subscribe(listener) {
    return this._events.subscribe(listener);
  }

  _emit(type, detail = null) {
    this._events.emit(Object.freeze({ type, control: this, detail }));
  }

  snapshot() {
    return deepFreeze({
      type: 'control',
      id: this.id,
      label: this.label,
      bounds: { ...this.bounds },
      disabled: this.disabled,
      visible: this.visible,
      hovered: this.hovered,
      focused: this.focused,
      pressed: this.pressed,
    });
  }

  dispose() {
    this._events.clear();
  }
}

export class TerminalButton extends TerminalControl {
  #onActivate;

  constructor({ onActivate = () => {}, ...options } = {}) {
    super(options);
    if (typeof onActivate !== 'function') throw new TypeError('onActivate must be a function');
    this.#onActivate = onActivate;
  }

  activate(detail = {}) {
    if (this.disabled || !this.visible) return false;
    this.#onActivate(deepFreeze({ controlId: this.id, ...detail }));
    this._emit('activate', detail);
    return true;
  }

  snapshot() {
    return deepFreeze({ ...super.snapshot(), type: 'button' });
  }
}

export class TerminalSlider extends TerminalControl {
  #onInput;
  #onChange;

  constructor({
    minimum = 0,
    maximum = 1,
    step = 0,
    value = minimum,
    onInput = () => {},
    onChange = () => {},
    ...options
  } = {}) {
    super(options);
    this.minimum = Number(minimum);
    this.maximum = Number(maximum);
    this.step = Math.max(0, Number(step) || 0);
    if (!Number.isFinite(this.minimum) || !Number.isFinite(this.maximum) || this.maximum <= this.minimum) {
      throw new RangeError('slider maximum must be greater than minimum');
    }
    if (typeof onInput !== 'function' || typeof onChange !== 'function') {
      throw new TypeError('slider callbacks must be functions');
    }
    this.#onInput = onInput;
    this.#onChange = onChange;
    this.value = this.#quantize(value);
  }

  #quantize(value) {
    let result = clamp(value, this.minimum, this.maximum);
    if (this.step > 0) {
      result = this.minimum + Math.round((result - this.minimum) / this.step) * this.step;
      result = clamp(result, this.minimum, this.maximum);
    }
    return result;
  }

  setValue(value, { commit = false, detail = {} } = {}) {
    if (this.disabled || !this.visible) return false;
    const next = this.#quantize(value);
    const changed = next !== this.value;
    this.value = next;
    if (changed) {
      const payload = deepFreeze({ controlId: this.id, value: next, ...detail });
      this.#onInput(payload);
      this._emit('input', payload);
    }
    if (commit) {
      const payload = deepFreeze({ controlId: this.id, value: next, ...detail });
      this.#onChange(payload);
      this._emit('change', payload);
    }
    return changed;
  }

  setFromPosition(x, options = {}) {
    const fraction = clamp((x - this.bounds.x) / this.bounds.width, 0, 1);
    return this.setValue(this.minimum + fraction * (this.maximum - this.minimum), options);
  }

  adjust(steps, options = {}) {
    const increment = this.step || (this.maximum - this.minimum) / 20;
    return this.setValue(this.value + increment * steps, options);
  }

  snapshot() {
    return deepFreeze({
      ...super.snapshot(),
      type: 'slider',
      minimum: this.minimum,
      maximum: this.maximum,
      step: this.step,
      value: this.value,
    });
  }
}

export class TerminalPanel {
  #controls = [];
  #controlCleanup = new Map();
  #events = new EventHub();

  constructor({
    id,
    title = '',
    width = 1000,
    height = 600,
    visible = true,
    theme = TERMINAL_UI_THEME,
  } = {}) {
    if (typeof id !== 'string' || id.length === 0) throw new TypeError('panel id is required');
    if (!(width > 0) || !(height > 0)) throw new RangeError('panel dimensions must be positive');
    this.id = id;
    this.title = String(title);
    this.width = Number(width);
    this.height = Number(height);
    this.visible = Boolean(visible);
    this.theme = { ...TERMINAL_UI_THEME, ...theme };
  }

  add(control) {
    if (!(control instanceof TerminalControl)) throw new TypeError('panel control is invalid');
    if (this.#controls.some((candidate) => candidate.id === control.id)) {
      throw new Error(`duplicate control id: ${control.id}`);
    }
    this.#controls.push(control);
    this.#controlCleanup.set(control, control.subscribe((event) => this.#emit('control', event)));
    this.#emit('layout');
    return control;
  }

  remove(id) {
    const index = this.#controls.findIndex((control) => control.id === id);
    if (index < 0) return null;
    const [control] = this.#controls.splice(index, 1);
    this.#controlCleanup.get(control)?.();
    this.#controlCleanup.delete(control);
    this.#emit('layout');
    return control;
  }

  getControl(id) {
    return this.#controls.find((control) => control.id === id) ?? null;
  }

  getControls() {
    return Object.freeze([...this.#controls]);
  }

  hitTest(x, y) {
    if (!this.visible) return null;
    for (let index = this.#controls.length - 1; index >= 0; index -= 1) {
      const control = this.#controls[index];
      if (!control.disabled && control.contains(x, y)) return control;
    }
    return null;
  }

  setVisible(visible) {
    const next = Boolean(visible);
    if (next === this.visible) return;
    this.visible = next;
    this.#emit('state');
  }

  snapshot() {
    return deepFreeze({
      type: 'panel',
      id: this.id,
      title: this.title,
      width: this.width,
      height: this.height,
      visible: this.visible,
      theme: { ...this.theme },
      controls: this.#controls.map((control) => control.snapshot()),
    });
  }

  subscribe(listener) {
    return this.#events.subscribe(listener);
  }

  #emit(type, detail = null) {
    this.#events.emit(Object.freeze({ type, panel: this, detail }));
  }

  dispose() {
    for (const cleanup of this.#controlCleanup.values()) cleanup();
    this.#controlCleanup.clear();
    for (const control of this.#controls) control.dispose();
    this.#controls.length = 0;
    this.#events.clear();
  }
}

export function panelCoordinatesFromUv(panel, uv) {
  const u = clamp(uv?.x ?? uv?.u, 0, 1);
  const v = clamp(uv?.y ?? uv?.v, 0, 1);
  return Object.freeze({ x: u * panel.width, y: (1 - v) * panel.height });
}

/** Shared ray, poke, and focus interaction state machine. */
export class TerminalUIInteraction {
  #panel;
  #pointers = new Map();
  #focused = null;
  #events = new EventHub();
  #disposed = false;

  constructor({ panel } = {}) {
    if (!(panel instanceof TerminalPanel)) throw new TypeError('panel is required');
    this.#panel = panel;
  }

  updatePointer({ id, type = 'ray', x, y, pressed = false, active = true } = {}) {
    this.#assertLive();
    if (typeof id !== 'string' && typeof id !== 'number') throw new TypeError('pointer id is required');
    if (!['ray', 'poke'].includes(type)) throw new RangeError(`unsupported pointer type: ${type}`);
    const key = String(id);
    const previous = this.#pointers.get(key) ?? {
      id: key,
      type,
      pressed: false,
      hovered: null,
      captured: null,
    };
    if (!active) {
      this.removePointer(key);
      return null;
    }
    const hovered = this.#panel.hitTest(Number(x), Number(y));
    if (previous.hovered !== hovered) {
      previous.hovered?.setState({ hovered: false });
      hovered?.setState({ hovered: true });
    }
    if (!previous.pressed && pressed) {
      previous.captured = hovered;
      hovered?.setState({ pressed: true });
      if (hovered) this.focus(hovered.id);
      if (hovered instanceof TerminalSlider) {
        hovered.setFromPosition(x, { detail: { pointerId: key, pointerType: type } });
      }
      this.#emit('press', key, hovered, type);
    } else if (previous.pressed && pressed && previous.captured instanceof TerminalSlider) {
      previous.captured.setFromPosition(x, { detail: { pointerId: key, pointerType: type } });
    } else if (previous.pressed && !pressed) {
      const captured = previous.captured;
      captured?.setState({ pressed: false });
      if (captured instanceof TerminalButton && captured === hovered) {
        captured.activate({ pointerId: key, pointerType: type });
      } else if (captured instanceof TerminalSlider) {
        captured.setFromPosition(x, {
          commit: true,
          detail: { pointerId: key, pointerType: type },
        });
      }
      this.#emit('release', key, captured, type);
      previous.captured = null;
    }
    previous.type = type;
    previous.x = Number(x) || 0;
    previous.y = Number(y) || 0;
    previous.pressed = Boolean(pressed);
    previous.hovered = hovered;
    this.#pointers.set(key, previous);
    return hovered;
  }

  updateFromIntersection({
    id,
    type = 'ray',
    intersection,
    pressed,
    inputState = null,
  } = {}) {
    if (!intersection?.uv) {
      this.removePointer(id);
      return null;
    }
    const point = panelCoordinatesFromUv(this.#panel, intersection.uv);
    const resolvedPressed = pressed ?? inputState?.select?.held ?? false;
    return this.updatePointer({ id, type, ...point, pressed: resolvedPressed, active: true });
  }

  removePointer(id) {
    const key = String(id);
    const pointer = this.#pointers.get(key);
    if (!pointer) return false;
    pointer.hovered?.setState({ hovered: false });
    pointer.captured?.setState({ pressed: false });
    this.#pointers.delete(key);
    this.#emit('remove', key, pointer.captured ?? pointer.hovered, pointer.type);
    return true;
  }

  focus(id) {
    if (id === null || id === undefined) {
      this.#focused?.setState({ focused: false });
      this.#focused = null;
      this.#emit('focus', 'focus', null, 'focus');
      return true;
    }
    const control = this.#panel.getControl(id);
    if (control?.disabled || !control?.visible) return false;
    this.#focused?.setState({ focused: false });
    this.#focused = control;
    this.#focused?.setState({ focused: true });
    this.#emit('focus', 'focus', this.#focused, 'focus');
    return Boolean(control);
  }

  focusNext(direction = 1) {
    const controls = this.#panel.getControls().filter((control) => control.visible && !control.disabled);
    if (controls.length === 0) return null;
    const currentIndex = controls.indexOf(this.#focused);
    const step = Math.sign(direction || 1);
    const nextIndex = currentIndex < 0
      ? (step > 0 ? 0 : controls.length - 1)
      : (currentIndex + step + controls.length) % controls.length;
    this.focus(controls[nextIndex].id);
    return controls[nextIndex];
  }

  activateFocused({ adjustment = 1 } = {}) {
    if (this.#focused instanceof TerminalButton) return this.#focused.activate({ pointerType: 'focus' });
    if (this.#focused instanceof TerminalSlider) {
      return this.#focused.adjust(adjustment, { commit: true, detail: { pointerType: 'focus' } });
    }
    return false;
  }

  getStatus() {
    return deepFreeze({
      disposed: this.#disposed,
      focusedControlId: this.#focused?.id ?? null,
      pointers: [...this.#pointers.values()].map((pointer) => ({
        id: pointer.id,
        type: pointer.type,
        pressed: pointer.pressed,
        hoveredControlId: pointer.hovered?.id ?? null,
        capturedControlId: pointer.captured?.id ?? null,
        x: pointer.x,
        y: pointer.y,
      })).sort((a, b) => a.id.localeCompare(b.id)),
    });
  }

  subscribe(listener) {
    return this.#events.subscribe(listener);
  }

  #emit(type, pointerId, control, pointerType) {
    this.#events.emit(Object.freeze({
      type,
      pointerId,
      pointerType,
      controlId: control?.id ?? null,
      status: this.getStatus(),
    }));
  }

  dispose() {
    if (this.#disposed) return;
    for (const id of [...this.#pointers.keys()]) this.removePointer(id);
    this.#focused?.setState({ focused: false });
    this.#focused = null;
    this.#events.clear();
    this.#disposed = true;
  }

  #assertLive() {
    if (this.#disposed) throw new Error('TerminalUIInteraction is disposed');
  }
}

function drawPanel(context, snapshot, canvas) {
  const scaleX = canvas.width / snapshot.width;
  const scaleY = canvas.height / snapshot.height;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = snapshot.theme.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = snapshot.theme.accent;
  context.lineWidth = Math.max(2, canvas.width / 400);
  context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
  context.fillStyle = snapshot.theme.foreground;
  context.font = `${Math.max(18, Math.floor(canvas.height / 22))}px ${snapshot.theme.font}`;
  context.textBaseline = 'middle';
  context.fillText(`> ${snapshot.title}`, 24, 38);

  for (const control of snapshot.controls) {
    if (!control.visible) continue;
    const x = control.bounds.x * scaleX;
    const y = control.bounds.y * scaleY;
    const width = control.bounds.width * scaleX;
    const height = control.bounds.height * scaleY;
    const color = control.disabled
      ? snapshot.theme.disabled
      : control.pressed
        ? snapshot.theme.pressed
        : control.focused
          ? snapshot.theme.focus
          : snapshot.theme.accent;
    context.fillStyle = snapshot.theme.panel;
    context.fillRect(x, y, width, height);
    context.strokeStyle = color;
    context.lineWidth = control.hovered || control.focused ? 4 : 2;
    context.strokeRect(x, y, width, height);
    context.fillStyle = color;
    context.font = `${Math.max(14, Math.floor(height * 0.34))}px ${snapshot.theme.font}`;
    if (control.type === 'slider') {
      const fraction = (control.value - control.minimum) / (control.maximum - control.minimum);
      const trackY = y + height * 0.68;
      context.fillStyle = snapshot.theme.track;
      context.fillRect(x + 12, trackY, width - 24, Math.max(4, height * 0.08));
      context.fillStyle = color;
      context.fillRect(x + 12, trackY, (width - 24) * fraction, Math.max(4, height * 0.08));
      context.fillText(`${control.label}: ${control.value}`, x + 14, y + height * 0.32);
    } else {
      context.fillText(`[ ${control.label} ]`, x + 14, y + height / 2);
    }
  }
}

/** CanvasTexture fallback renderer built entirely from an injected Three copy. */
export function createThreeTerminalPanel({
  THREE,
  panel,
  createCanvas = () => globalThis.document?.createElement?.('canvas'),
  canvasWidth = 1024,
  canvasHeight = 640,
  widthMeters = 1.4,
  renderOrder = 1000,
} = {}) {
  if (!THREE?.CanvasTexture || !THREE?.PlaneGeometry || !THREE?.MeshBasicMaterial || !THREE?.Mesh) {
    throw new TypeError('an injected Three namespace with canvas panel primitives is required');
  }
  if (!(panel instanceof TerminalPanel)) throw new TypeError('panel is required');
  const canvas = createCanvas();
  const context = canvas?.getContext?.('2d');
  if (!canvas || !context) throw new Error('a 2D canvas is required for the terminal panel fallback');
  canvas.width = Math.max(64, Math.floor(canvasWidth));
  canvas.height = Math.max(64, Math.floor(canvasHeight));
  const texture = new THREE.CanvasTexture(canvas);
  if (THREE.SRGBColorSpace !== undefined) texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  const heightMeters = widthMeters * (panel.height / panel.width);
  const geometry = new THREE.PlaneGeometry(widthMeters, heightMeters);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `terminal-panel:${panel.id}`;
  mesh.renderOrder = renderOrder;
  mesh.visible = panel.visible;
  const redraw = () => {
    const snapshot = panel.snapshot();
    drawPanel(context, snapshot, canvas);
    mesh.visible = snapshot.visible;
    texture.needsUpdate = true;
  };
  const unsubscribe = panel.subscribe(redraw);
  redraw();
  let disposed = false;
  return Object.freeze({
    object3D: mesh,
    mesh,
    canvas,
    texture,
    redraw,
    coordinatesFromIntersection: (intersection) => panelCoordinatesFromUv(panel, intersection?.uv),
    dispose() {
      if (disposed) return;
      disposed = true;
      unsubscribe();
      mesh.parent?.remove?.(mesh);
      geometry.dispose?.();
      material.dispose?.();
      texture.dispose?.();
    },
  });
}

/** Optional accessible DOM bridge for injected Three HTMLMesh/InteractiveGroup addons. */
export function createThreeHtmlUiBridge({
  InteractiveGroup,
  HTMLMesh,
  renderer,
  camera,
  root,
  scene = null,
} = {}) {
  if (typeof InteractiveGroup !== 'function' || typeof HTMLMesh !== 'function') {
    throw new TypeError('InteractiveGroup and HTMLMesh constructors must be injected');
  }
  if (!root) throw new TypeError('DOM root is required');
  const group = new InteractiveGroup(renderer, camera);
  const mesh = new HTMLMesh(root);
  group.add?.(mesh);
  scene?.add?.(group);
  const controllers = new Set();
  let disposed = false;
  return Object.freeze({
    group,
    mesh,
    registerController(controller) {
      if (disposed || !controller || controllers.has(controller)) return false;
      group.listenToXRControllerEvents?.(controller);
      controllers.add(controller);
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      scene?.remove?.(group);
      group.remove?.(mesh);
      group.disconnect?.();
      mesh.dispose?.();
      controllers.clear();
    },
  });
}
