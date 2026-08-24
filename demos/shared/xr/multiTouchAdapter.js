import { applyDeadzone, clamp, listen } from './internal.js';

const VALID_MODES = new Set(['button', 'axis-x', 'axis-y']);

function emptyState(actionNames) {
  return Object.fromEntries(actionNames.map((action) => [action, 0]));
}

function pointerValue(event, binding) {
  if (binding.mode === 'button') {
    const pressure = Number(event.pressure);
    return (binding.usePressure && pressure > 0) ? clamp(pressure, 0, 1) : binding.value;
  }
  const rect = binding.element.getBoundingClientRect?.() ?? { left: 0, top: 0, width: 1, height: 1 };
  if (binding.mode === 'axis-x') {
    const normalized = (((Number(event.clientX) || 0) - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    return applyDeadzone(binding.invert ? -normalized : normalized, binding.deadzone);
  }
  const normalized = clamp(((Number(event.clientY) || 0) - rect.top) / Math.max(1, rect.height), 0, 1);
  return binding.invert ? 1 - normalized : normalized;
}

/** Pointer Events based multi-touch adapter; every pointer remains independent. */
export class MultiTouchAdapter {
  #input;
  #actionNames;
  #sourceId;
  #context;
  #bindings = new Map();
  #elementStyles = new Map();
  #pointers = new Map();
  #cleanup = [];
  #sequence = 0;
  #disposed = false;

  constructor({
    input,
    controls = [],
    sourceId = 'touch',
    context = 'gameplay',
  } = {}) {
    if (!input?.replaceSourceState) throw new TypeError('input must be an ActionInput-compatible object');
    this.#input = input;
    this.#actionNames = input.getActionNames?.() ?? [];
    if (this.#actionNames.length === 0) throw new TypeError('input must expose one or more action names');
    this.#sourceId = sourceId;
    this.#context = context;
    for (const control of controls) this.bindControl(control.element, control);
    this.#publish();
  }

  bindControl(element, {
    action,
    mode = 'button',
    value = 1,
    deadzone = 0.08,
    invert = false,
    usePressure = false,
    pointerTypes = ['touch', 'pen'],
    preventDefault = true,
  } = {}) {
    if (this.#disposed) throw new Error('MultiTouchAdapter is disposed');
    if (!element?.addEventListener) throw new TypeError('touch control element must support events');
    if (!this.#input.hasAction?.(action)) throw new RangeError(`unknown action: ${action}`);
    if (!VALID_MODES.has(mode)) throw new RangeError(`unknown touch control mode: ${mode}`);
    const bindingId = Symbol(action);
    const binding = {
      id: bindingId,
      element,
      action,
      mode,
      value: action === 'shiftDelta' ? Math.sign(value) : clamp(value, 0, 1),
      deadzone: clamp(deadzone, 0, 0.95),
      invert: Boolean(invert),
      usePressure: Boolean(usePressure),
      pointerTypes: new Set(pointerTypes),
      preventDefault: Boolean(preventDefault),
    };
    if (element.style && !this.#elementStyles.has(element)) {
      this.#elementStyles.set(element, element.style.touchAction);
      element.style.touchAction = 'none';
    }
    this.#bindings.set(bindingId, binding);

    const down = (event) => {
      if (!binding.pointerTypes.has(event.pointerType)) return;
      this.#sequence += 1;
      this.#pointers.set(event.pointerId, {
        bindingId,
        value: pointerValue(event, binding),
        order: this.#sequence,
      });
      try {
        element.setPointerCapture?.(event.pointerId);
      } catch {
        // The pointer may already be cancelled or synthetic. Capture improves
        // continuity but is never allowed to break the normalized input path.
      }
      if (binding.preventDefault) event.preventDefault?.();
      this.#publish();
    };
    const move = (event) => {
      const pointer = this.#pointers.get(event.pointerId);
      if (!pointer || pointer.bindingId !== bindingId) return;
      this.#sequence += 1;
      pointer.value = pointerValue(event, binding);
      pointer.order = this.#sequence;
      if (binding.preventDefault) event.preventDefault?.();
      this.#publish();
    };
    const end = (event) => {
      const pointer = this.#pointers.get(event.pointerId);
      if (!pointer || pointer.bindingId !== bindingId) return;
      this.#pointers.delete(event.pointerId);
      try {
        element.releasePointerCapture?.(event.pointerId);
      } catch {
        // Lost/cancelled pointers may no longer be capturable in the DOM.
      }
      if (binding.preventDefault) event.preventDefault?.();
      this.#publish();
    };
    const cleanups = [
      listen(element, 'pointerdown', down),
      listen(element, 'pointermove', move),
      listen(element, 'pointerup', end),
      listen(element, 'pointercancel', end),
      listen(element, 'lostpointercapture', end),
    ];
    this.#cleanup.push(...cleanups);
    let unbound = false;
    return () => {
      if (unbound) return;
      unbound = true;
      for (const cleanup of cleanups) {
        cleanup();
        const index = this.#cleanup.indexOf(cleanup);
        if (index >= 0) this.#cleanup.splice(index, 1);
      }
      for (const [pointerId, pointer] of this.#pointers) {
        if (pointer.bindingId === bindingId) this.#pointers.delete(pointerId);
      }
      this.#bindings.delete(bindingId);
      if (![...this.#bindings.values()].some((candidate) => candidate.element === element)) {
        if (element.style) element.style.touchAction = this.#elementStyles.get(element) ?? '';
        this.#elementStyles.delete(element);
      }
      if (!this.#disposed) this.#publish();
    };
  }

  clear() {
    this.#pointers.clear();
    if (!this.#disposed) this.#publish();
  }

  #publish() {
    const state = emptyState(this.#actionNames);
    const latest = new Map();
    for (const pointer of this.#pointers.values()) {
      const binding = this.#bindings.get(pointer.bindingId);
      if (!binding) continue;
      const current = latest.get(binding.action);
      if (binding.mode === 'button') {
        const next = current ? Math.max(current.value, pointer.value) : pointer.value;
        latest.set(binding.action, { value: next, order: pointer.order });
      } else if (!current || pointer.order > current.order) {
        latest.set(binding.action, { value: pointer.value, order: pointer.order });
      }
    }
    for (const [action, entry] of latest) state[action] = entry.value;
    this.#input.replaceSourceState(this.#sourceId, state, { context: this.#context });
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const cleanup of this.#cleanup.splice(0)) cleanup();
    for (const [element, touchAction] of this.#elementStyles) {
      if (element.style) element.style.touchAction = touchAction ?? '';
    }
    this.#elementStyles.clear();
    this.#bindings.clear();
    this.#pointers.clear();
    this.#input.removeSource(this.#sourceId);
  }
}
