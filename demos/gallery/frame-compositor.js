export function drawFrameLayers(context, width, height, layers) {
  for (const { canvas, box, parts } of layers) {
    if (!canvas.width || !canvas.height || !parts.length) continue;
    context.save();
    context.beginPath();
    for (const part of parts) {
      const left = Math.round(part.left * width);
      const top = Math.round(part.top * height);
      const right = Math.round((part.left + part.width) * width);
      const bottom = Math.round((part.top + part.height) * height);
      context.rect(left, top, right - left, bottom - top);
    }
    context.clip();
    context.drawImage(canvas, box.left * width, box.top * height, box.width * width, box.height * height);
    context.restore();
  }
}

// Rectangles are fractions of the unwarped desktop. Use the terminal's
// backing resolution so every pass sees the same pixels and screen origin.
export function createFrameCompositor(shader, guideLayers = () => []) {
  const output = document.createElement('canvas');
  let layers = [];
  shader.setSourceComposer(source => {
    const media = guideLayers();
    if (!layers.length && !media.length) return source;
    const { width, height } = source;
    if (output.width !== width) output.width = width;
    if (output.height !== height) output.height = height;
    const context = output.getContext('2d');
    context.globalCompositeOperation = 'copy';
    context.drawImage(source, 0, 0);
    context.globalCompositeOperation = 'source-over';
    drawFrameLayers(context, width, height, media);
    drawFrameLayers(context, width, height, layers);
    return output;
  });
  return {
    setLayers(nextLayers) { layers = nextLayers; },
    dispose() {
      shader.setSourceComposer(null);
      layers = [];
      output.width = output.height = 0;
    },
  };
}
