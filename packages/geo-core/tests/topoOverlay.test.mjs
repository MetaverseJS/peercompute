import assert from 'node:assert/strict';
import test from 'node:test';

import { createTopoOverlayMaterial, updateTopoMaterial } from '../src/terrain/topoMaterial.js';

class Color {
  constructor(...values) { this.values = values; }
}

class Material {
  static ElevationContourType = 'ElevationContour';

  constructor({ fabric, translucent }) {
    this.type = fabric.type;
    this.fabric = fabric;
    this.uniforms = { ...fabric.uniforms };
    this.materials = Object.fromEntries(Object.entries(fabric.materials ?? {}).map(([key, value]) => [
      key,
      { type: value.type, uniforms: { ...value.uniforms } },
    ]));
    this.translucent = translucent;
  }

  static fromType(type, uniforms) {
    return { type, uniforms: { ...uniforms } };
  }
}

test('transparent contour overlay preserves underlying GIS imagery between lines', () => {
  const material = createTopoOverlayMaterial({ Color, Material }, { contourSpacing: 250, contourWidth: 2 });
  assert.equal(material.type, 'ElevationContour');
  assert.deepEqual(material.uniforms.color.values, [0.2, 1, 0.45, 1]);
  assert.equal(material.uniforms.spacing, 250);
  assert.equal(material.uniforms.width, 2);
  assert.equal(material.wxglobe.transparentBetweenContours, true);
  assert.equal(material.wxglobe.backgroundColor, null);
  updateTopoMaterial(material, { contourSpacing: 500, contourWidth: 1.25 });
  assert.equal(material.uniforms.spacing, 500);
  assert.equal(material.uniforms.width, 1.25);
});

test('Earth waterline overlay uses one exact bright blue for every contour at or below source-native zero', () => {
  const submerged = [36 / 255, 207 / 255, 1, 1];
  const material = createTopoOverlayMaterial({ Color, Material }, {
    contourSpacing: 100,
    contourWidth: 1.75,
    submergedContourColor: submerged,
    waterLineElevationMeters: 0,
    waterLineVerticalDatum: 'terrain-source-native',
    waterLineReference: 'terrain-source-native-zero',
  });
  assert.equal(material.type, 'EarthGridWaterlineTopoOverlayMaterial');
  assert.equal(material.translucent, true);
  assert.match(material.fabric.components.diffuse, /materialInput\.height <= waterLineElevationMeters/u);
  assert.equal((material.fabric.components.alpha.match(/contours\.alpha/gu) ?? []).length, 1);
  assert.equal(material.uniforms.waterLineElevationMeters, 0);
  assert.deepEqual(material.materials.contours.uniforms.color.values, [1, 1, 1, 1]);
  assert.deepEqual(material.materials.aboveWaterColor.uniforms.color.values, [0.2, 1, 0.45, 1]);
  assert.deepEqual(material.materials.submergedColor.uniforms.color.values, submerged);
  assert.deepEqual(material.wxglobe.submergedContours, {
    enabled: true,
    color: submerged,
    waterLineElevationMeters: 0,
    verticalDatum: 'terrain-source-native',
    waterLineReference: 'terrain-source-native-zero',
    comparison: 'at-or-below',
  });
  updateTopoMaterial(material, { contourSpacing: 250, contourWidth: 2.25 });
  assert.equal(material.materials.contours.uniforms.spacing, 250);
  assert.equal(material.materials.contours.uniforms.width, 2.25);
});
