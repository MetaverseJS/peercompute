const ANALOG_FIELDS = [
  'steer',
  'throttle',
  'frontBrake',
  'rearBrake',
  'clutch',
  'handbrake',
];

const EDGE_FIELDS = ['reset', 'cameraToggle', 'recenter'];

function clamp(value, minimum, maximum) {
  const numeric = Number.isFinite(value) ? value : 0;
  return Math.fround(Math.min(maximum, Math.max(minimum, numeric)));
}

export function normalizeControlFrame(input = {}, fallbackSequence = 0) {
  const sequence = Number.isSafeInteger(input.sequence) && input.sequence >= 0
    ? input.sequence
    : fallbackSequence;
  return Object.freeze({
    sequence,
    steer: clamp(input.steer, -1, 1),
    throttle: clamp(input.throttle, 0, 1),
    frontBrake: clamp(input.frontBrake, 0, 1),
    rearBrake: clamp(input.rearBrake, 0, 1),
    clutch: clamp(input.clutch, 0, 1),
    shiftDelta: Math.sign(Number.isFinite(input.shiftDelta) ? input.shiftDelta : 0),
    handbrake: clamp(input.handbrake, 0, 1),
    reset: Boolean(input.reset),
    cameraToggle: Boolean(input.cameraToggle),
    recenter: Boolean(input.recenter),
  });
}

export function createNeutralControlFrame(sequence = 0) {
  return normalizeControlFrame({ sequence });
}

export function controlFramesEqual(a, b) {
  return a.sequence === b.sequence
    && ANALOG_FIELDS.every((field) => a[field] === b[field])
    && a.shiftDelta === b.shiftDelta
    && EDGE_FIELDS.every((field) => a[field] === b[field]);
}

export const CONTROL_FRAME_FIELDS = Object.freeze([
  'sequence',
  ...ANALOG_FIELDS,
  'shiftDelta',
  ...EDGE_FIELDS,
]);
