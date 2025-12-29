import assert from 'node:assert/strict';
import { decodeWindFieldFromAuxTexture } from '../src/oceanWindField.js';

function approxEqual(a, b, eps = 1e-4) {
    return Math.abs(a - b) <= eps;
}

{
    const data = new Uint8Array([
        0, 0, 255, 0,
        0, 0, 128, 128
    ]);
    const auxTexture = { image: { data, width: 2, height: 1 } };
    const field = decodeWindFieldFromAuxTexture(auxTexture, 2, 1, { maxWind: 10 });
    assert.equal(field.length, 4);
    assert.ok(approxEqual(field[0], 10));
    assert.ok(approxEqual(field[1], -10));
    assert.ok(approxEqual(field[2], 0.0392157));
    assert.ok(approxEqual(field[3], 0.0392157));
}

{
    const data = new Uint8Array([
        0, 0, 255, 128
    ]);
    const auxTexture = { image: { data, width: 1, height: 1 } };
    const field = decodeWindFieldFromAuxTexture(auxTexture, 1, 1, { maxWind: 10, scale: 0.5 });
    assert.equal(field.length, 2);
    assert.ok(approxEqual(field[0], 5));
}

{
    const data = new Uint8Array([
        0, 0, 0, 255,
        0, 0, 255, 0,
        0, 0, 0, 255,
        0, 0, 255, 0
    ]);
    const auxTexture = { image: { data, width: 2, height: 2 } };
    const field = decodeWindFieldFromAuxTexture(auxTexture, 1, 1, { maxWind: 20 });
    assert.equal(field.length, 2);
    assert.ok(Number.isFinite(field[0]));
    assert.ok(Number.isFinite(field[1]));
}

console.log('ocean-wind-field: ok');
