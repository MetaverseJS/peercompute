const MAX_PIXELS = 1024 * 1024;
const MAX_PREVIEWS = 6;
const MAX_PREVIEW_BYTES = 24 * 1024 * 1024;
const checkCancelled = (signal) => { if (signal?.aborted) throw new DOMException('Image generation cancelled', 'AbortError'); };

/** Only locally encoded, bounded pixels become conversation image URLs. */
export function createGeneratedImageRenderer(transcript) {
  const previews = new Map();
  let retainedBytes = 0;
  let disposed = false;

  function release(image, { expired = false } = {}) {
    const preview = previews.get(image);
    if (!preview) return;
    URL.revokeObjectURL(preview.url); retainedBytes -= preview.bytes; previews.delete(image);
    if (expired && transcript.contains(image)) {
      const note = document.createElement('p'); note.className = 'pc-inference-note';
      note.textContent = 'Earlier image preview released.'; image.replaceWith(note);
    } else image.removeAttribute('src');
  }

  function prune() {
    for (const image of previews.keys()) if (!transcript.contains(image)) release(image);
    while (previews.size > MAX_PREVIEWS || retainedBytes > MAX_PREVIEW_BYTES) {
      release(previews.keys().next().value, { expired: true });
    }
  }

  return {
    async append(reply, image, { signal, prompt = '' } = {}) {
      checkCancelled(signal);
      if (disposed) throw new Error('Conversation image renderer is closed');
      const { width, height, channels, data } = image ?? {};
      if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1
          || width * height > MAX_PIXELS || channels !== 4
          || !(data instanceof Uint8Array || data instanceof Uint8ClampedArray)
          || data.byteLength !== width * height * 4) {
        throw new Error('Generated image must contain bounded RGBA pixels');
      }
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image preview encoding is unavailable');
      context.putImageData(new ImageData(new Uint8ClampedArray(data), width, height), 0, 0);
      const blob = await canvas.convertToBlob({ type: 'image/png' });
      checkCancelled(signal);
      if (disposed || !transcript.contains(reply)) throw new DOMException('Conversation closed', 'AbortError');
      if (blob.type !== 'image/png' || blob.size > MAX_PIXELS * 4 + 65536) throw new Error('Generated image preview exceeds its byte budget');
      const preview = document.createElement('img'); preview.className = 'pc-generated-image';
      preview.width = width; preview.height = height;
      preview.alt = prompt ? `Generated image: ${prompt.slice(0, 160)}` : 'Generated image';
      const url = URL.createObjectURL(blob); preview.src = url;
      previews.set(preview, { url, bytes: blob.size }); retainedBytes += blob.size;
      reply.after(preview); prune();
      return preview;
    },
    prune,
    dispose() { disposed = true; for (const image of previews.keys()) release(image); },
  };
}
