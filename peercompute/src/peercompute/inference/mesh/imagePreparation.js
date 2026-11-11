// TripoSR removes the background before alpha framing/gray compositing. Its
// reference uses rembg: RGB maximum normalization, ImageNet channel statistics,
// U2NetP's first output, then a min/max normalized mask. Canvas high-quality
// resizing is the browser counterpart of the reference's PIL Lanczos filter.
export const FOREGROUND_SIZE = 320;
const mean = [.485, .456, .406], deviation = [.229, .224, .225];
const defaultCanvas = (width, height) => new OffscreenCanvas(width, height);
const foregroundError = message => Object.assign(new Error(message), { code: 'ERR_MESH_FOREGROUND' });

export function validateMeshImage(image) {
  const { width, height, data } = image ?? {};
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1
      || width * height > 4096 * 4096 || !(data instanceof Uint8Array || data instanceof Uint8ClampedArray)
      || data.length !== width * height * 4) throw new Error('TripoSR needs bounded RGBA pixels');
  return image;
}

/** A genuine transparent margin can be used unchanged. One alpha254 pixel in
 * an otherwise opaque PNG must not bypass segmentation and recreate a slab. */
export function hasForegroundAlpha(image) {
  const { width, height, data } = validateMeshImage(image);
  let transparent = 0, border = 0, transparentBorder = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const clear = data[(y * width + x) * 4 + 3] <= 16;
    if (clear) transparent++;
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
      border++; if (clear) transparentBorder++;
    }
  }
  return transparent >= Math.max(1, width * height * .01) && transparentBorder >= border * .25;
}

export function requireForegroundAlpha(image) {
  if (!hasForegroundAlpha(image)) throw foregroundError('This stored TripoSR package needs a transparent cutout. Load the current TripoSR package to remove image backgrounds automatically.');
  return image;
}

/** Convert already resized pixels into the exact bounded U2NetP input tensor. */
export function normalizeForegroundPixels(data) {
  const count = FOREGROUND_SIZE ** 2;
  if (!(data instanceof Uint8Array || data instanceof Uint8ClampedArray) || data.length !== count * 4) {
    throw new Error('Foreground input must be 320×320 RGBA');
  }
  let maximum = 1e-6;
  for (let i = 0; i < data.length; i += 4) maximum = Math.max(maximum, data[i], data[i + 1], data[i + 2]);
  const output = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let c = 0; c < 3; c++) {
    output[c * count + i] = (data[i * 4 + c] / maximum - mean[c]) / deviation[c];
  }
  return output;
}

export function prepareForegroundInput(image, { canvas = defaultCanvas } = {}) {
  const { width, height, data } = validateMeshImage(image);
  // rembg converts to RGB before resizing. Make that explicit so canvas alpha
  // premultiplication cannot change RGB normalization for partially opaque input.
  const rgb = new Uint8ClampedArray(data);
  for (let i = 3; i < rgb.length; i += 4) rgb[i] = 255;
  const source = canvas(width, height), target = canvas(FOREGROUND_SIZE, FOREGROUND_SIZE);
  source.getContext('2d').putImageData(new ImageData(rgb, width, height), 0, 0);
  const context = target.getContext('2d', { willReadFrequently: true });
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, FOREGROUND_SIZE, FOREGROUND_SIZE);
  return normalizeForegroundPixels(context.getImageData(0, 0, FOREGROUND_SIZE, FOREGROUND_SIZE).data);
}

/** Normalize a learned saliency mask without inferring foreground from color.
 * Original RGBA is immutable; existing alpha is multiplied, never made opaque.
 * The bounded 320² output and one image-sized copy cap work and allocation. */
export function applyForegroundMask(image, prediction, { canvas = defaultCanvas } = {}) {
  const { width, height, data } = validateMeshImage(image), size = FOREGROUND_SIZE;
  if (!(prediction instanceof Float32Array) || prediction.length !== size * size) throw foregroundError('Invalid foreground model mask');
  let low = Infinity, high = -Infinity;
  for (const value of prediction) {
    if (!Number.isFinite(value) || value < -.0001 || value > 1.0001) throw foregroundError('Invalid foreground model values');
    low = Math.min(low, value); high = Math.max(high, value);
  }
  if (high - low < 1e-6) throw foregroundError('The foreground model could not isolate an object. Try one clearly visible object or a transparent cutout.');
  const rgba = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < prediction.length; i++) {
    const value = Math.floor(255 * (prediction[i] - low) / (high - low));
    rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = value; rgba[i * 4 + 3] = 255;
  }
  const source = canvas(size, size), target = canvas(width, height);
  source.getContext('2d').putImageData(new ImageData(rgba, size, size), 0, 0);
  const context = target.getContext('2d', { willReadFrequently: true });
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, width, height);
  const mask = context.getImageData(0, 0, width, height).data, output = new Uint8Array(data);
  let visible = 0;
  for (let i = 0; i < width * height; i++) {
    const alpha = Math.round(data[i * 4 + 3] * mask[i * 4] / 255);
    output[i * 4 + 3] = alpha;
    if (alpha >= 128) visible++;
  }
  const result = { width, height, channels: 4, data: output };
  if (!visible || !hasForegroundAlpha(result)) throw foregroundError('The foreground model could not isolate an object. Try one clearly visible object with space around it, or a transparent cutout.');
  return result;
}
