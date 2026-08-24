import { clamp, deepFreeze, EventHub } from './internal.js';

export const DEFAULT_ACTION_SCHEMA = deepFreeze({
  steer: { minimum: -1, maximum: 1, combine: 'max-absolute' },
  throttle: { minimum: 0, maximum: 1, combine: 'maximum' },
  frontBrake: { minimum: 0, maximum: 1, combine: 'maximum' },
  rearBrake: { minimum: 0, maximum: 1, combine: 'maximum' },
  clutch: { minimum: 0, maximum: 1, combine: 'maximum' },
  shiftDelta: { minimum: -1, maximum: 1, combine: 'sum-clamp', edge: 'change' },
  handbrake: { minimum: 0, maximum: 1, combine: 'maximum', boolean: true },
  reset: { minimum: 0, maximum: 1, combine: 'maximum', edge: 'press', boolean: true },
  cameraToggle: { minimum: 0, maximum: 1, combine: 'maximum', edge: 'press', boolean: true },
  recenter: { minimum: 0, maximum: 1, combine: 'maximum', edge: 'press', boolean: true },
});

// Compatibility exports describe only the default profile. ActionInput itself
// accepts any injected schema and is not limited to motorcycle actions.
export const CONTROL_ACTIONS = Object.freeze(Object.keys(DEFAULT_ACTION_SCHEMA));
export const CONTINUOUS_ACTIONS = Object.freeze(['steer', 'throttle', 'frontBrake', 'rearBrake', 'clutch']);
export const HELD_ACTIONS = Object.freeze(['handbrake']);
export const EDGE_ACTIONS = Object.freeze(['reset', 'cameraToggle', 'recenter']);

const COMBINE_MODES = new Set(['maximum', 'max-absolute', 'sum-clamp', 'latest']);
const EDGE_MODES = new Set(['none', 'press', 'change']);

function validateContextId(contextId) {
  if (typeof contextId !== 'string' || contextId.length === 0) {
    throw new TypeError('context id must be a non-empty string');
  }
}

function normalizeActionSchema(actions) {
  if (!actions || typeof actions !== 'object' || Array.isArray(actions)) {
    throw new TypeError('actions must be an object keyed by action id');
  }
  const entries = Object.entries(actions);
  if (entries.length === 0 || entries.length > 128) {
    throw new RangeError('actions must define between 1 and 128 entries');
  }
  const schema = {};
  for (const [id, source] of entries) {
    if (!/^[A-Za-z][A-Za-z0-9._-]{0,63}$/u.test(id)) {
      throw new TypeError(`invalid action id: ${id}`);
    }
    const descriptor = source && typeof source === 'object' ? source : {};
    const minimum = Number(descriptor.minimum ?? descriptor.min ?? 0);
    const maximum = Number(descriptor.maximum ?? descriptor.max ?? 1);
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum >= maximum) {
      throw new RangeError(`${id} must have finite ordered minimum/maximum bounds`);
    }
    const combine = descriptor.combine ?? (minimum < 0 ? 'max-absolute' : 'maximum');
    const edge = descriptor.edge ?? 'none';
    if (!COMBINE_MODES.has(combine)) throw new RangeError(`${id} has unsupported combine mode ${combine}`);
    if (!EDGE_MODES.has(edge)) throw new RangeError(`${id} has unsupported edge mode ${edge}`);
    schema[id] = Object.freeze({
      minimum,
      maximum,
      combine,
      edge,
      boolean: descriptor.boolean === true,
      integer: descriptor.integer === true,
    });
  }
  return deepFreeze(schema);
}

function neutralState(actionNames) {
  return Object.fromEntries(actionNames.map((action) => [action, 0]));
}

function normalizeValue(descriptor, value) {
  let normalized = Number(value);
  if (!Number.isFinite(normalized)) normalized = 0;
  normalized = clamp(normalized, descriptor.minimum, descriptor.maximum);
  if (descriptor.integer) normalized = Math.round(normalized);
  return normalized;
}

function mergeValues(descriptor, candidates) {
  if (candidates.length === 0) return 0;
  if (descriptor.combine === 'max-absolute') {
    return candidates.reduce((selected, candidate) => (
      Math.abs(candidate.value) > Math.abs(selected.value) ? candidate : selected
    ), candidates[0]).value;
  }
  if (descriptor.combine === 'sum-clamp') {
    return candidates.reduce((sum, candidate) => sum + candidate.value, 0);
  }
  if (descriptor.combine === 'latest') return candidates[candidates.length - 1].value;
  return Math.max(...candidates.map((candidate) => candidate.value));
}

export function createNeutralControlFrame(sequence = 0) {
  return deepFreeze({
    sequence,
    steer: 0,
    throttle: 0,
    frontBrake: 0,
    rearBrake: 0,
    clutch: 0,
    shiftDelta: 0,
    handbrake: false,
    reset: false,
    cameraToggle: false,
    recenter: false,
  });
}

/**
 * Device-independent, schema-driven action merger. Sources publish plain held
 * values; this class owns deterministic combination, edges, context capture,
 * immutable frames, and serializable output.
 */
export class ActionInput {
  #sources = new Map();
  #contexts = new Map();
  #schema;
  #actionNames;
  #actionSet;
  #previousValues;
  #sequence = 0;
  #disposed = false;
  #events = new EventHub();
  #now;

  constructor({ actions = DEFAULT_ACTION_SCHEMA, now = () => globalThis.performance?.now?.() ?? Date.now() } = {}) {
    if (typeof now !== 'function') throw new TypeError('now must be a function');
    this.#schema = normalizeActionSchema(actions);
    this.#actionNames = Object.freeze(Object.keys(this.#schema));
    this.#actionSet = new Set(this.#actionNames);
    this.#previousValues = neutralState(this.#actionNames);
    this.#now = now;
    this.defineContext('gameplay', { priority: 0 });
  }

  getActionNames() {
    return this.#actionNames;
  }

  hasAction(action) {
    return this.#actionSet.has(action);
  }

  defineContext(id, { priority = 0, enabled = true, capture = [] } = {}) {
    this.#assertLive();
    validateContextId(id);
    const captures = new Set(capture);
    for (const action of captures) {
      if (!this.#actionSet.has(action)) throw new RangeError(`unknown captured action: ${action}`);
    }
    this.#contexts.set(id, {
      id,
      priority: Number.isFinite(priority) ? priority : 0,
      enabled: Boolean(enabled),
      capture: captures,
    });
    return this;
  }

  setContextEnabled(id, enabled) {
    this.#assertLive();
    const context = this.#contexts.get(id);
    if (!context) throw new RangeError(`unknown context: ${id}`);
    context.enabled = Boolean(enabled);
    return this;
  }

  removeContext(id) {
    this.#assertLive();
    if (id === 'gameplay') throw new Error('the gameplay context cannot be removed');
    const removed = this.#contexts.delete(id);
    if (removed) {
      for (const source of this.#sources.values()) {
        if (source.context === id) source.context = 'gameplay';
      }
    }
    return removed;
  }

  #normalizedPatch(patch = {}, base = neutralState(this.#actionNames)) {
    const result = { ...base };
    for (const [action, value] of Object.entries(patch)) {
      if (this.#actionSet.has(action)) result[action] = normalizeValue(this.#schema[action], value);
    }
    return result;
  }

  setSourceState(id, patch, { context } = {}) {
    this.#assertLive();
    if (typeof id !== 'string' || id.length === 0) throw new TypeError('source id must be a non-empty string');
    const existing = this.#sources.get(id);
    const contextId = context ?? existing?.context ?? 'gameplay';
    if (!this.#contexts.has(contextId)) throw new RangeError(`unknown context: ${contextId}`);
    this.#sources.set(id, {
      id,
      context: contextId,
      state: this.#normalizedPatch(patch, existing?.state),
    });
    return this;
  }

  replaceSourceState(id, state = {}, options = {}) {
    this.#assertLive();
    const existing = this.#sources.get(id);
    const contextId = options.context ?? existing?.context ?? 'gameplay';
    if (!this.#contexts.has(contextId)) throw new RangeError(`unknown context: ${contextId}`);
    this.#sources.set(id, { id, context: contextId, state: this.#normalizedPatch(state) });
    return this;
  }

  clearSource(id) {
    const source = this.#sources.get(id);
    if (!source) return false;
    source.state = neutralState(this.#actionNames);
    return true;
  }

  removeSource(id) {
    return this.#sources.delete(id);
  }

  clearAllSources() {
    for (const source of this.#sources.values()) source.state = neutralState(this.#actionNames);
  }

  sample({ time = this.#now() } = {}) {
    this.#assertLive();
    this.#sequence += 1;
    const activeContexts = [...this.#contexts.values()]
      .filter((context) => context.enabled)
      .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
    const activeContextIds = new Set(activeContexts.map((context) => context.id));
    const captures = {};
    const values = neutralState(this.#actionNames);
    const actions = {};

    for (const action of this.#actionNames) {
      const descriptor = this.#schema[action];
      const capturingContext = activeContexts.find((context) => context.capture.has(action));
      captures[action] = capturingContext?.id ?? null;
      const candidates = [];
      for (const source of this.#sources.values()) {
        if (!activeContextIds.has(source.context)) continue;
        if (capturingContext && source.context !== capturingContext.id) continue;
        const value = source.state[action];
        if (value !== 0) candidates.push({ id: source.id, value });
      }
      const rawValue = normalizeValue(descriptor, mergeValues(descriptor, candidates));
      const previous = this.#previousValues[action];
      const pressed = rawValue !== 0 && previous === 0;
      const released = rawValue === 0 && previous !== 0;
      let outputValue = rawValue;
      if (descriptor.edge === 'press') outputValue = pressed ? 1 : 0;
      if (descriptor.edge === 'change') outputValue = rawValue !== previous && rawValue !== 0 ? rawValue : 0;
      values[action] = descriptor.boolean ? outputValue !== 0 : outputValue;
      actions[action] = Object.freeze({
        value: values[action],
        rawValue,
        held: rawValue !== 0,
        pressed,
        released,
        sources: Object.freeze(candidates.map((candidate) => candidate.id).sort()),
      });
      this.#previousValues[action] = rawValue;
    }

    const control = deepFreeze({ sequence: this.#sequence, ...values });
    const frame = deepFreeze({
      sequence: this.#sequence,
      time: Number.isFinite(time) ? time : 0,
      control,
      actions,
      contexts: { active: activeContexts.map((context) => context.id), captures },
    });
    this.#events.emit(Object.freeze({ type: 'frame', frame }));
    return frame;
  }

  sampleControlFrame(options) {
    return this.sample(options).control;
  }

  getStatus() {
    return deepFreeze({
      disposed: this.#disposed,
      sequence: this.#sequence,
      actionSchema: this.#schema,
      sources: [...this.#sources.values()]
        .map((source) => ({ id: source.id, context: source.context }))
        .sort((a, b) => a.id.localeCompare(b.id)),
      contexts: [...this.#contexts.values()]
        .map((context) => ({
          id: context.id,
          priority: context.priority,
          enabled: context.enabled,
          capture: [...context.capture].sort(),
        }))
        .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id)),
    });
  }

  subscribe(listener) {
    return this.#events.subscribe(listener);
  }

  dispose() {
    if (this.#disposed) return;
    this.clearAllSources();
    this.#sources.clear();
    this.#contexts.clear();
    this.#events.clear();
    this.#disposed = true;
  }

  #assertLive() {
    if (this.#disposed) throw new Error('ActionInput is disposed');
  }
}
