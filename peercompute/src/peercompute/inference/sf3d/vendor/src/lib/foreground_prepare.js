// SF3D resize_foreground at ff21fc4: inclusive alpha bounds, 0.85 occupancy,
// transparent square padding, then Pillow-compatible bicubic RGBA resampling.
const PRECISION = 2 ** 22;
const byte = value => Math.max(0, Math.min(255, value));

function cubic(x) {
  x = Math.abs(x);
  if (x < 1) return ((1.5 * x - 2.5) * x) * x + 1;
  if (x < 2) return ((-0.5 * x + 2.5) * x - 4) * x + 2;
  return 0;
}

function coefficients(sourceSize, targetSize) {
  const scale = sourceSize / targetSize;
  const filterScale = Math.max(1, scale);
  const support = 2 * filterScale;
  return Array.from({ length: targetSize }, (_, target) => {
    const center = (target + 0.5) * scale;
    const start = Math.max(0, Math.trunc(center - support + 0.5));
    const end = Math.min(sourceSize, Math.trunc(center + support + 0.5));
    const weights = Array.from({ length: end - start }, (_, i) => cubic((start + i - center + 0.5) / filterScale));
    const sum = weights.reduce((a, b) => a + b, 0);
    return { start, weights: weights.map(w => Math.trunc(w / sum * PRECISION + (w < 0 ? -0.5 : 0.5))) };
  });
}

function resizeRgba(source, side, size) {
  if (side === size) return source;
  // Pillow resizes RGBA in premultiplied RGBa, quantizing after each pass.
  for (let i = 0; i < source.length; i += 4) {
    for (let c = 0; c < 3; c++) source[i + c] = Math.round(source[i + c] * source[i + 3] / 255);
  }
  const kernel = coefficients(side, size);
  const horizontal = new Uint8Array(size * side * 4);
  const output = new Uint8Array(size * size * 4);
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < size; x++) {
      const { start, weights } = kernel[x];
      for (let c = 0; c < 4; c++) {
        let sum = PRECISION / 2;
        for (let i = 0; i < weights.length; i++) sum += source[(y * side + start + i) * 4 + c] * weights[i];
        horizontal[(y * size + x) * 4 + c] = byte(Math.floor(sum / PRECISION));
      }
    }
  }
  for (let y = 0; y < size; y++) {
    const { start, weights } = kernel[y];
    for (let x = 0; x < size; x++) {
      for (let c = 0; c < 4; c++) {
        let sum = PRECISION / 2;
        for (let i = 0; i < weights.length; i++) sum += horizontal[((start + i) * size + x) * 4 + c] * weights[i];
        output[(y * size + x) * 4 + c] = byte(Math.floor(sum / PRECISION));
      }
    }
  }
  for (let i = 0; i < output.length; i += 4) {
    const alpha = output[i + 3];
    if (alpha && alpha < 255) {
      for (let c = 0; c < 3; c++) output[i + c] = byte(Math.floor(output[i + c] * 255 / alpha));
    }
  }
  return output;
}

export function prepareForeground(data, width, height, size = 512) {
  if (![width, height, size].every(x => Number.isSafeInteger(x) && x > 0)
      || !(data instanceof Uint8Array || data instanceof Uint8ClampedArray)
      || data.length !== width * height * 4) throw new TypeError('Expected positive dimensions and matching RGBA bytes');
  let x1 = width, y1 = height, x2 = -1, y2 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 0) {
        x1 = Math.min(x1, x); x2 = Math.max(x2, x);
        y1 = Math.min(y1, y); y2 = Math.max(y2, y);
      }
    }
  }
  if (x2 < 0) throw new Error('Empty foreground mask');
  const scale = Math.max(x2 - x1, y2 - y1) / 0.85;
  const side = Math.trunc(scale);
  if (side < 1) throw new Error('Foreground crop is empty');
  const left = Math.trunc((x1 + x2 - scale) / 2) || 0;
  const top = Math.trunc((y1 + y2 - scale) / 2) || 0;
  const cropped = new Uint8Array(side * side * 4);
  for (let y = Math.max(0, top); y < Math.min(height, top + side); y++) {
    const from = Math.max(0, left), to = Math.min(width, left + side);
    cropped.set(data.subarray((y * width + from) * 4, (y * width + to) * 4), ((y - top) * side + from - left) * 4);
  }
  return { data: resizeRgba(cropped, side, size), width: size, height: size,
    crop: [left, top, left + side, top + side] };
}
