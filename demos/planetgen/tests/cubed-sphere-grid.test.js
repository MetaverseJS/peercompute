import assert from 'node:assert/strict';
import { faceUvToDirection, directionToFaceUv, CUBE_FACE_NAMES } from '../src/holistic/cubedSphereGrid.js';

function approx(a, b, eps = 1e-4) {
    return Math.abs(a - b) <= eps;
}

const faceSamples = [
    { face: 0, u: 0.25, v: 0.75 },
    { face: 1, u: 0.8, v: 0.2 },
    { face: 2, u: 0.45, v: 0.55 },
    { face: 3, u: 0.1, v: 0.9 },
    { face: 4, u: 0.66, v: 0.34 },
    { face: 5, u: 0.33, v: 0.66 }
];

for (const sample of faceSamples) {
    const dir = faceUvToDirection(sample.face, sample.u, sample.v, new Float32Array(3));
    const back = directionToFaceUv(dir[0], dir[1], dir[2]);
    assert.equal(back.face, sample.face, `face mismatch for ${CUBE_FACE_NAMES[sample.face]}`);
    assert.ok(approx(back.u, sample.u, 1e-3));
    assert.ok(approx(back.v, sample.v, 1e-3));
}

{
    const v = directionToFaceUv(1, 0, 0);
    assert.equal(v.face, 0);
    assert.ok(approx(v.u, 0.5));
    assert.ok(approx(v.v, 0.5));
}
{
    const v = directionToFaceUv(-1, 0, 0);
    assert.equal(v.face, 1);
    assert.ok(approx(v.u, 0.5));
    assert.ok(approx(v.v, 0.5));
}
{
    const v = directionToFaceUv(0, 1, 0);
    assert.equal(v.face, 2);
    assert.ok(approx(v.u, 0.5));
    assert.ok(approx(v.v, 0.5));
}
{
    const v = directionToFaceUv(0, -1, 0);
    assert.equal(v.face, 3);
    assert.ok(approx(v.u, 0.5));
    assert.ok(approx(v.v, 0.5));
}
{
    const v = directionToFaceUv(0, 0, 1);
    assert.equal(v.face, 4);
    assert.ok(approx(v.u, 0.5));
    assert.ok(approx(v.v, 0.5));
}
{
    const v = directionToFaceUv(0, 0, -1);
    assert.equal(v.face, 5);
    assert.ok(approx(v.u, 0.5));
    assert.ok(approx(v.v, 0.5));
}

console.log('cubed-sphere-grid: ok');
