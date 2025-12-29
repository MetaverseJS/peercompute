/**
 * Shared utility functions for worldgen
 * Consolidated from index.js, UIManager.js, PlanetManager.js, WaterCycleUtils.js
 */

/**
 * Clamp a value between min and max
 * @param {number} v - Value to clamp
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number} Clamped value
 */
export function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

/**
 * Clamp a value between 0 and 1
 * @param {number} v - Value to clamp
 * @returns {number} Clamped value (0-1)
 */
export function clamp01(v) {
    return clamp(v, 0, 1);
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Normalize a heightmap buffer to 0-1 range
 * @param {Float32Array} buffer - Heightmap data
 */
export function normalizeHeightmap(buffer) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < buffer.length; i++) {
        const v = buffer[i];
        if (v < min) min = v;
        if (v > max) max = v;
    }
    const range = Math.max(max - min, 1e-5);
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] = (buffer[i] - min) / range;
    }
}

/**
 * Apply smoothing passes to a heightmap buffer
 * @param {Float32Array} buffer - Heightmap data
 * @param {number} size - Grid size (assumes square grid)
 * @param {number} passes - Number of smoothing passes
 */
export function smoothHeightmap(buffer, size, passes = 1) {
    if (passes <= 0) return;
    const temp = new Float32Array(buffer.length);
    for (let p = 0; p < passes; p++) {
        for (let y = 0; y < size; y++) {
            const yUp = Math.max(0, y - 1);
            const yDown = Math.min(size - 1, y + 1);
            for (let x = 0; x < size; x++) {
                const left = (x - 1 + size) % size;
                const right = (x + 1) % size;
                const idx = y * size + x;
                const acc = buffer[idx] * 2
                    + buffer[y * size + left]
                    + buffer[y * size + right]
                    + buffer[yUp * size + x]
                    + buffer[yDown * size + x];
                temp[idx] = acc / 6;
            }
        }
        buffer.set(temp);
    }
}

/**
 * Check if the current device is mobile
 * @returns {boolean} True if mobile device
 */
export function isMobileDevice() {
    return window.matchMedia('(max-width: 768px)').matches || 
           /Mobi|Android|iP(ad|hone|od)|IEMobile|BlackBerry|Kindle|Silk|Opera Mini/i.test(navigator.userAgent || '');
}

/**
 * Wait for the next animation frame
 * @returns {Promise} Resolves on next frame
 */
export function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Sample RGBA values from a DataTexture at normalized UV coordinates
 * @param {THREE.DataTexture} tex - The texture to sample
 * @param {number} u - U coordinate (0-1, wraps)
 * @param {number} v - V coordinate (0-1, clamped)
 * @returns {{r: number, g: number, b: number, a: number}} RGBA values (0-255)
 */
export function sampleDataTextureRGBA(tex, u, v) {
    const img = tex?.image;
    const data = img?.data;
    const w = img?.width ?? 0;
    const h = img?.height ?? 0;
    if (!data || !w || !h) return { r: 0, g: 0, b: 0, a: 0 };

    const uu = ((u % 1) + 1) % 1;
    const vv = clamp(v, 0, 1);
    const x = Math.min(w - 1, Math.floor(uu * w));
    const y = Math.min(h - 1, Math.floor(vv * h));
    const i = (y * w + x) * 4;
    return { r: data[i] ?? 0, g: data[i + 1] ?? 0, b: data[i + 2] ?? 0, a: data[i + 3] ?? 0 };
}
