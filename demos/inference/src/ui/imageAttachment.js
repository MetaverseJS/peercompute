const TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

/** Decode one explicitly selected file into a bounded model input and thumbnail. */
export async function readImageAttachment(file, { signal } = {}) {
  if (!file || !TYPES.has(file.type)) throw new Error('Choose a PNG, JPEG, WebP or GIF image');
  if (file.size > 8 * 1024 ** 2) throw new Error('Choose an image smaller than 8 MiB');
  signal?.throwIfAborted();
  const bitmap = await createImageBitmap(file);
  try {
    signal?.throwIfAborted();
    if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 32 * 1024 ** 2) throw new Error('Choose an image smaller than 32 megapixels');
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Image decoding is unavailable');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const thumbnail = document.createElement('canvas');
    const thumbScale = Math.min(1, 96 / Math.max(canvas.width, canvas.height));
    thumbnail.width = Math.max(1, Math.round(canvas.width * thumbScale)); thumbnail.height = Math.max(1, Math.round(canvas.height * thumbScale));
    thumbnail.getContext('2d').drawImage(canvas, 0, 0, thumbnail.width, thumbnail.height);
    return { name: file.name.slice(0, 160), preview: thumbnail.toDataURL('image/webp', 0.8),
      image: { data: new Uint8Array(pixels.data), width: canvas.width, height: canvas.height, channels: 4 } };
  } finally { bitmap.close(); }
}
