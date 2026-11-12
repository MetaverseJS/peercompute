// World presentation units, independent of mesh export coordinates. CubeChat's
// six-unit person/cube is the reference; values describe the largest dimension.
export const WORLD_MODEL_SCALE_SCHEMA = 'peercompute.world.model-scale.v1';
export const WORLD_MODEL_SIZE = Object.freeze({ minimum: 0.3, maximum: 48, fallback: 6 });

export function normalizeWorldModelSize(value) {
  if (!Number.isFinite(value) || value < WORLD_MODEL_SIZE.minimum || value > WORLD_MODEL_SIZE.maximum) {
    throw new TypeError('Model size must be between 0.3 and 48 world units');
  }
  return value;
}

// A conservative fallback for older planners which omit size. Explicit model
// proposals win; this is a presentation estimate, never a physical measurement.
const estimates = [
  [/\b(toy|miniature|figurine)\b/i, 1],
  [/\b(cup|mug|bottle|apple|ball)\b/i, 0.8],
  [/\b(cat|dog|chair|stool)\b/i, 3],
  [/\b(person|human|robot|android|knight)\b/i, 6],
  [/\b(car|sedan|roadster|automobile|van)\b/i, 15],
  [/\b(bus|truck)\b/i, 24],
  [/\b(tree)\b/i, 24],
  [/\b(house|building)\b/i, 36],
];
export function resolveWorldModelSize(value, { name = '', prompt = '' } = {}) {
  if (value !== undefined) return normalizeWorldModelSize(value);
  for (const text of [name, prompt]) {
    const found = estimates.find(([pattern]) => pattern.test(text));
    if (found) return found[1];
  }
  return WORLD_MODEL_SIZE.fallback;
}

export function worldModelScale(size) {
  return { schema: WORLD_MODEL_SCALE_SCHEMA, size: normalizeWorldModelSize(size) };
}
export function worldModelSizeFromManifest(manifest) {
  const value = manifest?.provenance?.worldScale;
  if (value === undefined) return WORLD_MODEL_SIZE.fallback;
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some(key => !['schema', 'size'].includes(key)) || value.schema !== WORLD_MODEL_SCALE_SCHEMA) {
    throw new TypeError('Invalid retained world model scale');
  }
  return normalizeWorldModelSize(value.size);
}

export const WORLD_MODEL_SCALE_INSTRUCTIONS = 'Choose size for what the object actually represents, not its mesh export coordinates. '
  + 'Size is its largest dimension in world units (0.3 to 48); a standing person or normal resident cube is 6 units tall. '
  + 'Typical sizes: mug 0.8, chair 3, person/robot 6, full-size car 15, bus/tree 24, house 36. '
  + 'A toy car is about 1; a deliberately giant robot can be 24. Honor requested miniature/giant proportions. '
  + 'Keep natural proportions; one uniform scale is applied. Include the chosen numeric size in the action.';
