/**
 * preprocess_core.js — pure, DOM-free image-preprocess math.
 *
 * Extracted from inference.js so the exact same Lanczos-3 resize + alpha-blend +
 * ImageNet-normalize runs on either the main thread OR a Web Worker, guaranteeing
 * byte-identical output. No canvas/DOM here: the caller supplies raw float32 RGBA
 * source pixels (from getImageData) and gets back the CHW float32 tensor.
 *
 * This is the tail-collapse target: image-preprocess is the largest foreground
 * gap (~700ms, main-thread Lanczos), and it has ZERO GPU sync — moving it to a
 * worker removes it from the main thread entirely with no per-duty fence floor.
 */

export const SF3D_IMAGE_PREPROCESS = Object.freeze({
  condImageSize:512, bgColor:Object.freeze([0.5,0.5,0.5]),
  imageMean:Object.freeze([0.485,0.456,0.406]), imageStd:Object.freeze([0.229,0.224,0.225]),
});

export function lanczosKernel(x, a = 3) {
  if (x === 0) return 1;
  if (Math.abs(x) >= a) return 0;
  const px = Math.PI * x;
  return (a * Math.sin(px) * Math.sin(px / a)) / (px * px);
}

export function lanczosResize(src, srcW, srcH, dstW, dstH) {
  // src is Float32Array [srcH, srcW, 4] RGBA
  const a = 3; // Lanczos-3
  const dst = new Float32Array(dstH * dstW * 4);
  const tmp = new Float32Array(dstW * srcH * 4);

  // Horizontal pass
  const xScale = srcW / dstW;
  for (let y = 0; y < srcH; y++) {
    for (let x = 0; x < dstW; x++) {
      const center = (x + 0.5) * xScale - 0.5;
      const left = Math.ceil(center - a);
      const right = Math.floor(center + a);
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0, sumW = 0;
      for (let i = left; i <= right; i++) {
        const si = Math.min(Math.max(i, 0), srcW - 1);
        const w = lanczosKernel(center - i, a);
        const off = (y * srcW + si) * 4;
        sumR += src[off] * w;
        sumG += src[off + 1] * w;
        sumB += src[off + 2] * w;
        sumA += src[off + 3] * w;
        sumW += w;
      }
      const off = (y * dstW + x) * 4;
      tmp[off] = sumR / sumW;
      tmp[off + 1] = sumG / sumW;
      tmp[off + 2] = sumB / sumW;
      tmp[off + 3] = sumA / sumW;
    }
  }

  // Vertical pass
  const yScale = srcH / dstH;
  for (let y = 0; y < dstH; y++) {
    const center = (y + 0.5) * yScale - 0.5;
    const top = Math.ceil(center - a);
    const bottom = Math.floor(center + a);
    for (let x = 0; x < dstW; x++) {
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0, sumW = 0;
      for (let j = top; j <= bottom; j++) {
        const sj = Math.min(Math.max(j, 0), srcH - 1);
        const w = lanczosKernel(center - j, a);
        const off = (sj * dstW + x) * 4;
        sumR += tmp[off] * w;
        sumG += tmp[off + 1] * w;
        sumB += tmp[off + 2] * w;
        sumA += tmp[off + 3] * w;
        sumW += w;
      }
      const off = (y * dstW + x) * 4;
      dst[off] = sumR / sumW;
      dst[off + 1] = sumG / sumW;
      dst[off + 2] = sumB / sumW;
      dst[off + 3] = sumA / sumW;
    }
  }
  return dst;
}

/**
 * Resize + alpha-blend + ImageNet-normalize raw float32 RGBA source pixels into
 * a CHW float32 tensor. Pure — identical on main thread and worker.
 *
 * @param {Float32Array} srcFloat  [srcH*srcW*4] float32 RGBA in [0,1]
 * @param {number} srcW
 * @param {number} srcH
 * @param {number} size            output size (512)
 * @param {number[]} bg            background color [r,g,b]
 * @param {number[]} imageMean
 * @param {number[]} imageStd
 * @returns {Float32Array} CHW [3*size*size]
 */
export function resizeBlendNormalize(srcFloat, srcW, srcH, size, bg, imageMean, imageStd) {
  const resized = lanczosResize(srcFloat, srcW, srcH, size, size);
  const chw = new Float32Array(3 * size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const off = (y * size + x) * 4;
      const r = resized[off];
      const g = resized[off + 1];
      const b = resized[off + 2];
      const a = Math.max(0, Math.min(1, resized[off + 3]));
      const blendR = bg[0] * (1 - a) + r * a;
      const blendG = bg[1] * (1 - a) + g * a;
      const blendB = bg[2] * (1 - a) + b * a;
      chw[0 * size * size + y * size + x] = (blendR - imageMean[0]) / imageStd[0];
      chw[1 * size * size + y * size + x] = (blendG - imageMean[1]) / imageStd[1];
      chw[2 * size * size + y * size + x] = (blendB - imageMean[2]) / imageStd[2];
    }
  }
  return chw;
}
