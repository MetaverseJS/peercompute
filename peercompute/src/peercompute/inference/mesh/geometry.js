import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { MeshBasicMaterial } from 'three';

// TripoSR's MIT reference uses 0.87 world radius, zero-padded grid_sample with
// align_corners=false, plane order xy/xz/yz, and exp(raw_density - 1) at iso25.
// The pinned ONNX decoder already applies density and color activations.
export const TRIPOSR = Object.freeze({ imageSize: 512, foregroundRatio: 0.85,
  radius: 0.87, channels: 40, planeSize: 64, threshold: 25, resolution: 64,
  queryBatch: 32768, maxVertices: 100000, maxTriangles: 150000 });

export function requireFinite(values, label) {
  for (const value of values) if (!Number.isFinite(value)) throw new Error(`${label} contains non-finite values`);
  return values;
}

export function foregroundBounds(image) {
  const { width, height, data } = image ?? {};
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1
      || width * height > 4096 * 4096 || !(data instanceof Uint8Array || data instanceof Uint8ClampedArray)
      || data.length !== width * height * 4) throw new Error('TripoSR needs bounded RGBA pixels');
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!data[(y * width + x) * 4 + 3]) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  if (maxX < minX) throw new Error('The image has no visible foreground');
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export function rgbaToTripoInput(data) {
  const count = TRIPOSR.imageSize ** 2;
  if (!(data instanceof Uint8Array || data instanceof Uint8ClampedArray) || data.length !== count * 4) {
    throw new Error('TripoSR input must be 512×512 RGBA');
  }
  const output = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const alpha = data[i * 4 + 3] / 255;
    for (let c = 0; c < 3; c++) output[c * count + i] = data[i * 4 + c] / 255 * alpha + 0.5 * (1 - alpha);
  }
  return output;
}

export function prepareTripoImage(image, { canvas = (width, height) => new OffscreenCanvas(width, height) } = {}) {
  const bounds = foregroundBounds(image), size = TRIPOSR.imageSize;
  const source = canvas(image.width, image.height), target = canvas(size, size);
  source.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);
  const scale = size * TRIPOSR.foregroundRatio / Math.max(bounds.width, bounds.height);
  const width = bounds.width * scale, height = bounds.height * scale;
  const context = target.getContext('2d', { willReadFrequently: true });
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  context.drawImage(source, bounds.x, bounds.y, bounds.width, bounds.height, (size - width) / 2, (size - height) / 2, width, height);
  // RGB 0..1 only: the DINO normalization is already inside this ONNX graph.
  return rgbaToTripoInput(context.getImageData(0, 0, size, size).data);
}

export function tripoGridPoints(resolution, offset, count) {
  if (!Number.isInteger(resolution) || resolution < 4 || resolution > 128
      || !Number.isSafeInteger(offset) || !Number.isSafeInteger(count) || offset < 0 || count < 1
      || count > TRIPOSR.queryBatch || offset + count > resolution ** 3) throw new Error('Invalid TripoSR query grid');
  const output = new Float32Array(count * 3), factor = 2 * TRIPOSR.radius / (resolution - 1);
  for (let n = 0; n < count; n++) {
    const i = offset + n;
    output[n * 3] = (i % resolution) * factor - TRIPOSR.radius;
    output[n * 3 + 1] = (Math.floor(i / resolution) % resolution) * factor - TRIPOSR.radius;
    output[n * 3 + 2] = Math.floor(i / (resolution * resolution)) * factor - TRIPOSR.radius;
  }
  return output;
}

export function sampleTriplane(planes, points) {
  if (!(planes instanceof Float32Array) || planes.length !== 3 * 40 * 64 * 64
      || !(points instanceof Float32Array) || points.length % 3 || points.length / 3 > TRIPOSR.queryBatch) {
    throw new Error('Invalid TripoSR sample tensors');
  }
  requireFinite(points, 'Query points');
  const output = new Float32Array(points.length / 3 * 120);
  for (let n = 0; n < points.length / 3; n++) {
    const x = points[n * 3] / TRIPOSR.radius, y = points[n * 3 + 1] / TRIPOSR.radius, z = points[n * 3 + 2] / TRIPOSR.radius;
    for (let p = 0; p < 3; p++) {
      const u = ((p === 2 ? y : x) + 1) * 32 - 0.5;
      const v = ((p === 0 ? y : z) + 1) * 32 - 0.5;
      const ix = Math.floor(u), iy = Math.floor(v), wx = u - ix, wy = v - iy;
      for (let c = 0; c < 40; c++) {
        let value = 0;
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
          const xx = ix + dx, yy = iy + dy;
          // Reference grid_sample pads with zero; clamping here changes borders.
          if (xx >= 0 && xx < 64 && yy >= 0 && yy < 64) {
            value += planes[(p * 40 + c) * 4096 + yy * 64 + xx]
              * (dx ? wx : 1 - wx) * (dy ? wy : 1 - wy);
          }
        }
        output[n * 120 + p * 40 + c] = value;
      }
    }
  }
  return requireFinite(output, 'Triplane features');
}

export function extractTripoSurface(field, resolution = TRIPOSR.resolution) {
  if (!(field instanceof Float32Array) || field.length !== resolution ** 3 || !Number.isInteger(resolution)
      || resolution < 4 || resolution > 128) throw new Error('Invalid density field');
  requireFinite(field, 'Density');
  const material = new MeshBasicMaterial();
  // Non-indexed marching cubes has three vertices per triangle. One spare
  // triangle makes an over-budget result detectable rather than silently clipped.
  const surface = new MarchingCubes(resolution, material, false, false, Math.floor(TRIPOSR.maxVertices / 3) + 1);
  try {
    surface.field.set(field); surface.isolation = TRIPOSR.threshold; surface.update();
    const count = surface.count;
    if (!count) throw new Error('No solid object was found; use one object on a plain or transparent background');
    if (count > TRIPOSR.maxVertices) throw new Error('Generated mesh exceeds its vertex budget');
    const positions = new Float32Array(surface.positionArray.slice(0, count * 3));
    const normals = new Float32Array(surface.normalArray.slice(0, count * 3));
    const indices = Uint32Array.from({ length: count }, (_, i) => i);
    // Three's field coordinates use i/N; our neural query grid uses i/(N-1).
    for (let i = 0; i < positions.length; i++) positions[i] = ((positions[i] + 1) * resolution / (resolution - 1) - 1) * TRIPOSR.radius;
    for (let i = 0; i < normals.length; i += 3) {
      const length = Math.hypot(normals[i], normals[i + 1], normals[i + 2]);
      if (!Number.isFinite(length) || length <= 1e-12) throw new Error('Generated surface has an invalid normal');
      normals[i] /= length; normals[i + 1] /= length; normals[i + 2] /= length;
    }
    return { positions, normals, indices };
  } finally { surface.geometry.dispose(); material.dispose(); }
}

export function orientTripoMesh(mesh) {
  for (const key of ['positions', 'normals']) {
    const values = mesh[key];
    for (let i = 0; i < values.length; i += 3) {
      const y = values[i + 1]; values[i + 1] = values[i + 2]; values[i + 2] = -y;
    }
  }
  return mesh;
}

export function tripoColorsToLinear(colors) {
  requireFinite(colors, 'Vertex colors');
  return Float32Array.from(colors, (value) => {
    const bounded = Math.max(0, Math.min(1, value));
    return bounded <= 0.04045 ? bounded / 12.92 : ((bounded + 0.055) / 1.055) ** 2.4;
  });
}
