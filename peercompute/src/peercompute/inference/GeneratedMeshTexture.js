/** Encoded textures are untrusted, even inside a checked GLB. Bound decoded
 * dimensions before asking a browser decoder to allocate their pixels. */
export const GENERATED_MESH_TEXTURE_LIMITS = Object.freeze({ count: 4, dimension: 2048,
  pixels: 8 * 1024 ** 2, byteLength: 8 * 1024 ** 2 });
const fail = message => { throw new Error(`Invalid generated mesh texture: ${message}`); };
const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
function dimensions(width, height) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1
      || width > GENERATED_MESH_TEXTURE_LIMITS.dimension || height > GENERATED_MESH_TEXTURE_LIMITS.dimension) fail('dimensions');
  return { width, height, pixels: width * height };
}
function crc32(bytes, start, end) {
  let crc = 0xffffffff;
  for (let i = start; i < end; i++) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function png(data, view) {
  if (!pngSignature.every((value, i) => data[i] === value)) fail('PNG signature');
  let offset = 8, result, image = false, endedImage = false, palette = false;
  while (offset + 12 <= data.length) {
    const length = view.getUint32(offset), end = offset + 12 + length;
    if (end > data.length) fail('PNG chunk range');
    const type = String.fromCharCode(...data.subarray(offset + 4, offset + 8));
    if (view.getUint32(end - 4) !== crc32(data, offset + 4, end - 4)) fail('PNG chunk checksum');
    // No animation, compressed metadata, color profiles or decoder extensions.
    if (!['IHDR', 'IDAT', 'IEND', 'PLTE', 'tRNS', 'sRGB', 'gAMA', 'cHRM', 'pHYs'].includes(type)) fail('PNG chunk type');
    if (offset === 8 && type !== 'IHDR') fail('PNG header order');
    if (type === 'IHDR') {
      if (result || length !== 13 || data[offset + 16] !== 8 || ![0, 2, 3, 4, 6].includes(data[offset + 17])
          || data[offset + 18] !== 0 || data[offset + 19] !== 0 || data[offset + 20] !== 0) fail('PNG header');
      result = dimensions(view.getUint32(offset + 8), view.getUint32(offset + 12));
      result.colorType = data[offset + 17];
    } else if (type === 'PLTE') {
      if (image || palette || !length || length > 768 || length % 3) fail('PNG palette');
      palette = true;
    } else if (type === 'IDAT') {
      if (endedImage || (result.colorType === 3 && !palette)) fail('PNG image order');
      image = true;
    } else if (type === 'IEND') {
      if (length || !image || end !== data.length) fail('PNG end');
      return dimensions(result.width, result.height);
    } else {
      if (image) endedImage = true;
      const fixed = { sRGB: 1, gAMA: 4, cHRM: 32, pHYs: 9 }[type];
      if (fixed !== undefined ? length !== fixed : length > 256) fail('PNG metadata length');
    }
    offset = end;
  }
  fail('PNG truncated');
}
function jpeg(data, view) {
  if (data[0] !== 255 || data[1] !== 216) fail('JPEG signature');
  let offset = 2, result, scan = false, inScan = false;
  while (offset < data.length) {
    if (inScan) {
      while (offset < data.length && data[offset] !== 255) offset++;
    }
    if (data[offset++] !== 255) fail('JPEG marker');
    while (data[offset] === 255) offset++;
    const marker = data[offset++];
    if (inScan && (marker === 0 || (marker >= 208 && marker <= 215))) continue;
    inScan = false;
    if (marker === 217) {
      if (!result || !scan || offset !== data.length) fail('JPEG end');
      return result;
    }
    if (marker === undefined || marker === 0 || marker === 216 || marker === 1 || (marker >= 208 && marker <= 215)
        || offset + 2 > data.length) fail('JPEG marker');
    const length = view.getUint16(offset), end = offset + length;
    if (length < 2 || end > data.length) fail('JPEG segment range');
    if ([192, 193, 194].includes(marker)) {
      if (result || scan || length < 11 || data[offset + 2] !== 8) fail('JPEG frame');
      const components = data[offset + 7];
      if (![1, 3].includes(components) || length !== 8 + 3 * components) fail('JPEG components');
      result = dimensions(view.getUint16(offset + 5), view.getUint16(offset + 3));
    } else if (marker >= 192 && marker <= 207 && ![196].includes(marker)) fail('JPEG frame type');
    if (marker === 218) {
      if (!result || length < 6 || length !== 6 + 2 * data[offset + 2]) fail('JPEG scan');
      scan = true; inScan = true;
    } else if (![192, 193, 194, 196, 219, 221, 254].includes(marker) && !(marker >= 224 && marker <= 239)) fail('JPEG unsupported segment');
    offset = end;
  }
  fail('JPEG truncated');
}

/** Structural verification is followed by a real bounded browser decode at
 * presentation time. It does not claim that compressed pixel data is valid. */
export function inspectGeneratedMeshTexture(data, mimeType) {
  if (!(data instanceof Uint8Array) || data.length < 12 || data.length > GENERATED_MESH_TEXTURE_LIMITS.byteLength) fail('encoded byte limit');
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (mimeType === 'image/png') return { mimeType, ...png(data, view) };
  if (mimeType === 'image/jpeg') return { mimeType, ...jpeg(data, view) };
  fail('MIME type');
}

/** Blob decoding requires no URL, fetch, cache, or external resource permission. */
export async function decodeGeneratedMeshTexture(data, mimeType, { signal } = {}) {
  signal?.throwIfAborted();
  const checked = inspectGeneratedMeshTexture(data, mimeType);
  if (typeof globalThis.createImageBitmap !== 'function') throw new Error('This browser cannot decode generated mesh textures');
  const bitmap = await createImageBitmap(new Blob([data], { type: mimeType }),
    { premultiplyAlpha: 'none', colorSpaceConversion: 'none', imageOrientation: 'none' });
  try {
    signal?.throwIfAborted();
    if (bitmap.width !== checked.width || bitmap.height !== checked.height) fail('decoded dimensions');
    return bitmap;
  } catch (error) { bitmap.close(); throw error; }
}
