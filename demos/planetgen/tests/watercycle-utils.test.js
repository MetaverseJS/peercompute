import assert from 'node:assert/strict';
import { buildSurfaceFields, sampleBilinear, sampleTriplanarHeight } from '../WaterCycleUtils.js';

function makeRampHeightmap(size) {
    const buf = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            buf[y * size + x] = (x / (size - 1)) * 0.8 + (y / (size - 1)) * 0.2;
        }
    }
    return buf;
}

function approxEqual(a, b, eps = 1e-5) {
    return Math.abs(a - b) <= eps;
}

{
    const size = 32;
    const hm = makeRampHeightmap(size);
    const h00 = sampleBilinear(0, 0, hm, size);
    const h11 = sampleBilinear(1, 1, hm, size);
    assert.ok(h00 >= 0 && h00 <= 1);
    assert.ok(h11 >= 0 && h11 <= 1);
}

{
    const size = 32;
    const hm = makeRampHeightmap(size);
    const dir = { x: 1, y: 0, z: 0 };
    const h = sampleTriplanarHeight(dir, hm, size);
    assert.ok(Number.isFinite(h));
}

{
    const size = 64;
    const hm = makeRampHeightmap(size);
    const gridWidth = 16;
    const gridHeight = 8;
    const seaLevel = 0.5;
    const surface = buildSurfaceFields({ heightmap: hm, size, seaLevel, gridWidth, gridHeight });
    assert.equal(surface.length, gridWidth * gridHeight * 4);
    for (let i = 0; i < gridWidth * gridHeight; i++) {
        const ocean = surface[i * 4 + 0];
        const elev01 = surface[i * 4 + 1];
        const raw = surface[i * 4 + 2];
        assert.ok(ocean === 0 || ocean === 1);
        assert.ok(elev01 >= 0 && elev01 <= 1);
        assert.ok(raw >= 0 && raw <= 1);
        if (ocean === 1) assert.ok(approxEqual(elev01, 0));
    }
}

console.log('watercycle-utils: ok');

