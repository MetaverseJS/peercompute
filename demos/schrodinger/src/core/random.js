export const hashSeed = (input) => {
  const text = String(input);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const createRng = (seed = 1) => {
  let state = (seed >>> 0) || 0x9e3779b9;
  const nextSeed = () => {
    state = (state + 0x9e3779b9) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    return (z ^ (z >>> 16)) >>> 0;
  };

  let a = nextSeed();
  let b = nextSeed();
  let c = nextSeed();
  let d = nextSeed();

  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    const t = (a + b + d) >>> 0;
    d = (d + 1) >>> 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) >>> 0;
    c = ((c << 21) | (c >>> 11)) >>> 0;
    c = (c + t) >>> 0;
    return t / 0x100000000;
  };
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const lerp = (a, b, t) => a + (b - a) * t;
