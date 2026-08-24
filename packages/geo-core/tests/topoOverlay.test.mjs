import assert from 'node:assert/strict';
import test from 'node:test';

import { createTopoOverlayMaterial, updateTopoMaterial } from '../src/terrain/topoMaterial.js';

class Color {
  constructor(...values) { this.values = values; }
}

class Material {
  static ElevationContourType = 'ElevationContour';

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
