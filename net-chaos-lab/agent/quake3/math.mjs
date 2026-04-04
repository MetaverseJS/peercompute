export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const normalizeAngle = (value) => {
  let next = Number(value) || 0;
  while (next <= -Math.PI) next += Math.PI * 2;
  while (next > Math.PI) next -= Math.PI * 2;
  return next;
};

export const angleDelta = (from, to) => normalizeAngle((Number(to) || 0) - (Number(from) || 0));

export const approachAngle = (current, target, maxStep) => {
  const delta = angleDelta(current, target);
  if (Math.abs(delta) <= maxStep) return normalizeAngle(target);
  return normalizeAngle((Number(current) || 0) + clamp(delta, -maxStep, maxStep));
};

export const createDeterministicRng = (seed = 1) => {
  let state = Math.floor(Math.abs(Number(seed) || 1)) % 2147483647;
  if (state <= 0) state = 1;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

export const length2d = (vector) => Math.hypot(Number(vector?.x) || 0, Number(vector?.z) || 0);

export const distance2d = (from, to) => {
  const dx = (Number(to?.x) || 0) - (Number(from?.x) || 0);
  const dz = (Number(to?.z) || 0) - (Number(from?.z) || 0);
  return Math.hypot(dx, dz);
};

export const distance3d = (from, to) => {
  const dx = (Number(to?.x) || 0) - (Number(from?.x) || 0);
  const dy = (Number(to?.y) || 0) - (Number(from?.y) || 0);
  const dz = (Number(to?.z) || 0) - (Number(from?.z) || 0);
  return Math.hypot(dx, dy, dz);
};

export const bearingTo = (from, to) => {
  const dx = (Number(to?.x) || 0) - (Number(from?.x) || 0);
  const dz = (Number(to?.z) || 0) - (Number(from?.z) || 0);
  return Math.atan2(-dx, -dz);
};

export const pitchTo = (from, to) => {
  const dy = (Number(to?.y) || 0) - (Number(from?.y) || 0);
  const horizontal = distance2d(from, to);
  return Math.atan2(dy, Math.max(0.001, horizontal));
};
