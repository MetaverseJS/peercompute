import { clamp, clamp01 } from './utils.js';

// Re-export clamp and clamp01 for backward compatibility
export { clamp, clamp01 };

export function directionFromLatLon(latRad, lonRad) {
    const cosLat = Math.cos(latRad);
    return {
        x: cosLat * Math.cos(lonRad),
        y: Math.sin(latRad),
        z: cosLat * Math.sin(lonRad)
    };
}

export function sampleBilinear(u, v, buf, size) {
    const fu = clamp01(u) * (size - 1);
    const fv = clamp01(1 - v) * (size - 1);
    const x0 = Math.floor(fu);
    const y0 = Math.floor(fv);
    const x1 = Math.min(size - 1, x0 + 1);
    const y1 = Math.min(size - 1, y0 + 1);
    const tx = fu - x0;
    const ty = fv - y0;
    const i00 = buf[y0 * size + x0];
    const i10 = buf[y0 * size + x1];
    const i01 = buf[y1 * size + x0];
    const i11 = buf[y1 * size + x1];
    const a = i00 * (1 - tx) + i10 * tx;
    const b = i01 * (1 - tx) + i11 * tx;
    const h = a * (1 - ty) + b * ty;
    return Number.isFinite(h) ? h : 0;
}

export function sampleTriplanarHeight(dir, heightmap, size) {
    const ax = Math.abs(dir.x);
    const ay = Math.abs(dir.y);
    const az = Math.abs(dir.z);
    const sum = ax + ay + az + 1e-6;
    const wx = ax / sum;
    const wy = ay / sum;
    const wz = az / sum;

    const uvX = { u: dir.z * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };
    const uvY = { u: dir.x * 0.5 + 0.5, v: dir.z * 0.5 + 0.5 };
    const uvZ = { u: dir.x * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };

    const hX = sampleBilinear(uvX.u, uvX.v, heightmap, size);
    const hY = sampleBilinear(uvY.u, uvY.v, heightmap, size);
    const hZ = sampleBilinear(uvZ.u, uvZ.v, heightmap, size);

    return (hX * wx) + (hY * wy) + (hZ * wz);
}

export function buildSurfaceFields({ heightmap, size, seaLevel, gridWidth, gridHeight }) {
    const cellCount = gridWidth * gridHeight;
    const surface = new Float32Array(cellCount * 4); // vec4 per cell: oceanMask, elev01, rawHeight, 0

    for (let y = 0; y < gridHeight; y++) {
        const v = (y + 0.5) / gridHeight;
        const lat = (v - 0.5) * Math.PI;
        for (let x = 0; x < gridWidth; x++) {
            const u = (x + 0.5) / gridWidth;
            const lon = (u - 0.5) * Math.PI * 2;

            const dir = directionFromLatLon(lat, lon);
            const h = sampleTriplanarHeight(dir, heightmap, size);
            const ocean = h < seaLevel ? 1 : 0;
            const elev01 = ocean ? 0 : clamp01((h - seaLevel) / Math.max(1e-6, 1 - seaLevel));

            const idx = (y * gridWidth + x) * 4;
            surface[idx + 0] = ocean;
            surface[idx + 1] = elev01;
            surface[idx + 2] = h;
            surface[idx + 3] = 0;
        }
    }

    return surface;
}
