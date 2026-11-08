import { NEON_TOPO_PALETTE } from './constants.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

export function createTopoTerrainMaterial(THREE, {
  color = NEON_TOPO_PALETTE.terrain,
  surfaceOpacity = 0.035,
} = {}) {
  if (!THREE?.ShaderMaterial || !THREE?.Color) {
    throw new TypeError('A Three.js namespace with ShaderMaterial and Color is required.');
  }
  if (!Number.isFinite(surfaceOpacity) || surfaceOpacity < 0 || surfaceOpacity > 0.2) {
    throw new RangeError('surfaceOpacity must be between 0 and 0.2.');
  }
  const material = new THREE.ShaderMaterial({
    name: 'motorcycle-transparent-topographic-terrain',
    uniforms: {
      surfaceColor: { value: new THREE.Color(color) },
      surfaceOpacity: { value: surfaceOpacity },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 surfaceColor;
      uniform float surfaceOpacity;
      varying vec3 vWorldNormal;
      void main() {
        float grazing = 1.0 - abs(normalize(vWorldNormal).y);
        float alpha = surfaceOpacity * mix(0.55, 1.0, grazing);
        gl_FragColor = vec4(surfaceColor, alpha);
      }
    `,
    side: THREE.DoubleSide,
    // Keep the surface visually translucent while still occluding contour
    // strokes on the far side of hills. The NURBS lines are lifted slightly
    // and render after this depth pre-pass.
    depthWrite: true,
    transparent: true,
    toneMapped: false,
    // Bias the translucent depth surface away from the co-located contour
    // strokes. This keeps the 6 cm geometric lift stable with the 20 km ride
    // camera far plane instead of flickering at medium/distant ranges.
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  material.userData = {
    style: 'transparent-terrain-surface-under-nurbs-contours',
    surfaceOpacity,
    contourDepthBias: 'surface-polygon-offset-positive',
  };
  return material;
}

export function createNeonLineMaterial(THREE, color, {
  category = null,
  opacity = 0.9,
  linewidth = 1.5,
} = {}) {
  if (!THREE?.AdditiveBlending) throw new TypeError('A Three.js namespace with additive blending is required.');
  if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
    throw new RangeError('Line opacity must be between zero and one.');
  }
  if (!Number.isFinite(linewidth) || linewidth <= 0 || linewidth > 16) {
    throw new RangeError('Line width must be between zero and sixteen pixels.');
  }
  const material = new LineMaterial({
    color,
    linewidth,
    worldUnits: false,
    transparent: true,
    opacity,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    dashed: false,
    alphaToCoverage: false,
  });
  material.toneMapped = false;
  material.userData = {
    category,
    neon: true,
    lineWidthPixels: linewidth,
    additive: true,
  };
  return material;
}

export function createNeonBasicMaterial(THREE, color, options = {}) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: options.transparent ?? true,
    opacity: options.opacity ?? 0.82,
    depthWrite: options.depthWrite ?? false,
    side: options.side ?? THREE.DoubleSide,
    wireframe: options.wireframe ?? false,
    toneMapped: false,
  });
  material.userData = { category: options.category ?? null, neon: true };
  return material;
}
