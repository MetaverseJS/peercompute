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

// Rectangles are fractions of the unwarped desktop. Composite at the shader's
// backing resolution and skip redundant 2D copies/uploads when layers are clean.
export function createFrameCompositor(shader, guideLayers = () => []) {
  const output = document.createElement('canvas');
  let layers = [];
  let sourceVersion = 1;
  let layoutVersion = 1;
  let lastKey = '';
  let lastSource = null;
  shader.setSourceComposer((source, targetWidth, targetHeight, forceUpload) => {
    const media = guideLayers();
    const width = targetWidth || source.width;
    const height = targetHeight || source.height;
    const animatedMedia = media.some(layer => {
      const src = layer.canvas?.currentSrc || layer.canvas?.src || '';
      return /\.gif(?:$|[?#])/i.test(src);
    });
    const key = animatedMedia ? '' : [
      sourceVersion, layoutVersion, width, height,
      ...media.map(l => `${l.key || ''}:${l.canvas.width}x${l.canvas.height}:${l.parts.length}`),
      ...layers.map(l => `${l.canvas.width}x${l.canvas.height}:${l.version?.() ?? ''}`),
    ].join('|');
    if (!forceUpload && !animatedMedia && key === lastKey && lastSource === source) return null;
    lastKey = key;
    lastSource = source;
    if (!layers.length && !media.length && width === source.width && height === source.height) {
      return source;
    }
    if (output.width !== width) output.width = width;
    if (output.height !== height) output.height = height;
    const context = output.getContext('2d');
    context.globalCompositeOperation = 'copy';
    context.drawImage(source, 0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
    drawFrameLayers(context, width, height, media);
    drawFrameLayers(context, width, height, layers);
    return output;
  });
  return {
    setLayers(nextLayers) { layers = nextLayers; layoutVersion++; },
    markSourceDirty() { sourceVersion++; },
    dispose() {
      shader.setSourceComposer(null);
      layers = [];
      output.width = output.height = 0;
    },
  };
}
