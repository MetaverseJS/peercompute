import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OceanVectorVisualizationSystem } from '../src/OceanVectorVisualizationSystem.js';

const group = new THREE.Group();
const viz = new OceanVectorVisualizationSystem(group, { gridLat: 2, gridLon: 2 });

const oceanData = new Uint8Array([
    128, 255, 128, 0,
    128, 128, 255, 0,
    128, 255, 128, 0,
    128, 128, 255, 0
]);
const oceanTex = new THREE.DataTexture(oceanData, 2, 2, THREE.RGBAFormat, THREE.UnsignedByteType);
oceanTex.needsUpdate = true;

viz.setOceanTexture(oceanTex);
const weatherData = new Uint8Array([
    0, 0, 0, 0,
    0, 0, 255, 0,
    0, 0, 128, 0,
    0, 0, 64, 0
]);
const weatherTex = new THREE.DataTexture(weatherData, 2, 2, THREE.RGBAFormat, THREE.UnsignedByteType);
weatherTex.needsUpdate = true;
viz.setWeatherTexture(weatherTex);

const windField = new Float32Array(2 * 4);
windField[0] = 10;
windField[1] = 0;
windField[2] = 5;
windField[3] = 2;
windField[4] = 0;
windField[5] = 6;
windField[6] = -4;
windField[7] = 1;

viz.setWindField(windField, 2, 2);
viz.setPlanetRadius(1);
viz.setConfig({ showCurrents: true, showWaves: true, visible: true });

viz.update();

const currentPositions = viz.currentMesh.geometry.attributes.position.array;
const wavePositions = viz.waveMesh.geometry.attributes.position.array;

assert.ok(currentPositions.length > 0);
assert.ok(wavePositions.length > 0);
assert.notEqual(currentPositions[0], currentPositions[3]);
assert.notEqual(wavePositions[0], wavePositions[3]);

console.log('ocean-vector-viz: ok');
