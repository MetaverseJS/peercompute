const encoder = new TextEncoder();
const forbidden = new Set(['__proto__', 'prototype', 'constructor']);

/** Copy only bounded plain data; scene objects and executable values never cross. */
export function boundedSceneContext(value, { maximumBytes = 8192 } = {}) {
  let nodes = 0;
  const visit = (entry, depth = 0) => {
    if (++nodes > 512 || depth > 6) throw new Error('Scene context exceeds its structural budget');
    if (entry == null || typeof entry === 'boolean') return entry;
    if (typeof entry === 'number' && Number.isFinite(entry)) return entry;
    if (typeof entry === 'string' && encoder.encode(entry).length <= 2048) return entry;
    if (Array.isArray(entry) && entry.length <= 64) return entry.map((item) => visit(item, depth + 1));
    if (typeof entry !== 'object' || Object.getPrototypeOf(entry) !== Object.prototype) {
      throw new Error('Scene context must contain bounded plain JSON values');
    }
    const keys = Object.keys(entry);
    if (keys.length > 64 || keys.some((key) => forbidden.has(key) || key.length > 80)) throw new Error('Invalid scene context keys');
    return Object.fromEntries(keys.map((key) => [key, visit(entry[key], depth + 1)]));
  };
  const serialized = JSON.stringify(visit(value));
  if (encoder.encode(serialized).length > maximumBytes) throw new Error('Scene context exceeds its byte budget');
  return serialized;
}

/** Model suggestions become single-use UI actions, never executable model code. */
export function createDemoAgentActions(definitions, { now = () => Date.now(), ttlMs = 60_000 } = {}) {
  if (!Number.isSafeInteger(ttlMs) || ttlMs < 1 || ttlMs > 300_000) throw new Error('Invalid action lifetime');
  const actions = new Map();
  for (const definition of definitions) {
    if (!/^[a-z][a-zA-Z0-9]{0,39}$/.test(definition?.name) || actions.has(definition.name)
        || typeof definition.validate !== 'function' || typeof definition.apply !== 'function'
        || typeof definition.description !== 'string' || definition.description.length > 300) {
      throw new Error('Invalid registered demo action');
    }
    actions.set(definition.name, definition);
  }
  if (actions.size > 8) throw new Error('Too many demo actions');
  let revision = 0;
  return {
    instructions: 'You may suggest these local demo actions for user approval: '
      + [...actions.values()].map(({ name, description }) => `${name}: ${description}`).join('; ')
      + '. To suggest an action, reply with JSON {"text":"your reply","actions":[{"name":"actionName","args":{}}]}. Never claim an action has already run.',
    invalidate() { revision += 1; },
    propose(text) {
      const current = ++revision;
      if (typeof text !== 'string' || encoder.encode(text).length > 16_384) return [];
      let response;
      try { response = JSON.parse(text); } catch { return []; }
      if (!Array.isArray(response?.actions) || response.actions.length > 4) return [];
      const proposals = [];
      for (const proposal of response.actions) {
        if (!proposal || Object.keys(proposal).some((key) => !['name', 'args'].includes(key))) return [];
        const definition = actions.get(proposal.name);
        if (!definition) return [];
        let args;
        try { args = JSON.parse(boundedSceneContext(proposal.args, { maximumBytes: 1024 })); }
        catch { return []; }
        if (definition.validate(args) !== true) return [];
        const expiresAt = now() + ttlMs;
        let consumed = false;
        proposals.push({
          label: `Apply ${proposal.name}: ${JSON.stringify(args)}`,
          async apply() {
            if (consumed || current !== revision || now() >= expiresAt) throw new Error('Action suggestion expired or was already used');
            consumed = true;
            // Revalidate at the moment of application; definitions own all effects.
            if (definition.validate(args) !== true) throw new Error('Action is no longer valid');
            return definition.apply(args);
          }
        });
      }
      return proposals;
    }
  };
}

/** Downsample a user-selected scene capture into the model's bounded RGBA input. */
export function captureAgentImage(source, { maximumEdge = 512, createCanvas = () => document.createElement('canvas') } = {}) {
  if (!Number.isInteger(maximumEdge) || maximumEdge < 1 || maximumEdge > 1024) throw new Error('Invalid image size');
  const width = source?.width, height = source?.height;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) throw new Error('Scene canvas is unavailable');
  const scale = Math.min(1, maximumEdge / Math.max(width, height));
  const canvas = createCanvas();
  canvas.width = Math.max(1, Math.floor(width * scale));
  canvas.height = Math.max(1, Math.floor(height * scale));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Image capture is unavailable');
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  return { width: canvas.width, height: canvas.height, channels: 4, data: new Uint8Array(pixels.data) };
}
