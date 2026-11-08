export const complex = (re = 0, im = 0) => ({ re, im });

export const add = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });

export const sub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });

export const mul = (a, b) => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re
});

export const scale = (a, s) => ({ re: a.re * s, im: a.im * s });

export const abs2 = (a) => a.re * a.re + a.im * a.im;

export const normalizeComplexVector = (values) => {
  let norm2 = 0;
  for (let i = 0; i + 1 < values.length; i += 2) {
    norm2 += values[i] * values[i] + values[i + 1] * values[i + 1];
  }
  if (!Number.isFinite(norm2) || norm2 <= 0) {
    return { values, norm: 0 };
  }
  const inv = 1 / Math.sqrt(norm2);
  for (let i = 0; i < values.length; i++) {
    values[i] *= inv;
  }
  return { values, norm: Math.sqrt(norm2) };
};

export const probabilitiesFromComplexVector = (values) => {
  const n = Math.floor(values.length / 2);
  const out = new Float64Array(n);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const re = values[i * 2];
    const im = values[i * 2 + 1];
    const p = re * re + im * im;
    out[i] = p;
    total += p;
  }
  if (total > 0) {
    for (let i = 0; i < out.length; i++) out[i] /= total;
  }
  return out;
};
