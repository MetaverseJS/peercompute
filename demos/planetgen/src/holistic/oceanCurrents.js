import { createCubedSphereGrid, CUBE_FACE_COUNT } from './cubedSphereGrid.js';

function clampResolution(value) {
    const n = Math.floor(Number(value) || 0);
    return Math.min(Math.max(n, 4), 256);
}

function buildFaceFields(resolution, channels) {
    const cellCount = resolution * resolution;
    return Array.from({ length: CUBE_FACE_COUNT }, () => new Float32Array(cellCount * channels));
}

export function createOceanCurrentState(options = {}) {
    const resolution = clampResolution(options.resolution ?? 32);
    const grid = createCubedSphereGrid(resolution, { channels: 1 });

    return {
        resolution,
        cellCount: resolution * resolution,
        grid,
        velocity: buildFaceFields(resolution, 2),
        temperature: buildFaceFields(resolution, 1),
        salinity: buildFaceFields(resolution, 1),
        pressure: buildFaceFields(resolution, 1),
        surfaceFlux: buildFaceFields(resolution, 2)
    };
}

export function resetOceanCurrentState(state) {
    if (!state) return;
    const resetField = (field) => {
        if (!field) return;
        for (const face of field) {
            if (face?.fill) face.fill(0);
        }
    };
    resetField(state.velocity);
    resetField(state.temperature);
    resetField(state.salinity);
    resetField(state.pressure);
    resetField(state.surfaceFlux);
}
