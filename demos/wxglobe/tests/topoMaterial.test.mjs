import test from 'node:test';
import assert from 'node:assert/strict';
import { createTopoMaterial, updateTopoMaterial } from '../src/terrain/topoMaterial.js';

class FakeColor {
  constructor(...values) {
    this.values = values;
  }
}

class FakeMaterial {
  static ElevationContourType = 'ElevationContour';

  constructor(options) {
    this.fabric = options.fabric;
    this.type = options.fabric.type;
    this.materials = {
      background: { uniforms: { ...options.fabric.materials.background.uniforms } },
      contours: { uniforms: { ...options.fabric.materials.contours.uniforms } }
    };
  }
}

const FakeCesium = { Color: FakeColor, Material: FakeMaterial };

test('topographic material composites opaque black beneath green elevation contours', () => {
  const material = createTopoMaterial(FakeCesium);
  assert.equal(material.type, 'WxGlobeTopoMaterial');
  assert.equal(material.fabric.materials.contours.type, 'ElevationContour');
  assert.equal(
    material.fabric.components.diffuse,
    'contours.alpha > 0.0 && min(min(materialInput.st.s, 1.0 - materialInput.st.s), min(materialInput.st.t, 1.0 - materialInput.st.t)) > 0.00001 ? contours.diffuse : background.diffuse'
  );
  assert.equal(material.fabric.components.alpha, '1.0');
  assert.deepEqual(material.materials.background.uniforms.color.values, [0.001, 0.008, 0.003, 1]);
  assert.deepEqual(material.materials.contours.uniforms.color.values, [0.2, 1, 0.45, 1]);
});

test('topographic material updates contour spacing and width without recreation', () => {
  const material = createTopoMaterial(FakeCesium);
  assert.equal(updateTopoMaterial(material, { contourSpacing: 1000, contourWidth: 2 }), material);
  assert.equal(material.materials.contours.uniforms.spacing, 1000);
  assert.equal(material.materials.contours.uniforms.width, 2);
  assert.equal(material.wxglobe.contourSpacing, 1000);
  assert.equal(material.wxglobe.contourWidth, 2);
  assert.throws(() => updateTopoMaterial(material, { contourSpacing: 0 }), /positive number/);
  assert.throws(() => updateTopoMaterial(material, { contourWidth: -1 }), /positive number/);
});
