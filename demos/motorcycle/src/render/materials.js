import { NEON_TOPO_PALETTE } from './constants.js';

export function createTopoTerrainMaterial(THREE, {
  contourSpacingMeters = 4,
  majorContourEvery = 5,
  contourWidth = 0.075,
  color = NEON_TOPO_PALETTE.terrain,
  majorColor = NEON_TOPO_PALETTE.terrainMajor,
} = {}) {
  if (!THREE?.ShaderMaterial || !THREE?.Color) {
    throw new TypeError('A Three.js namespace with ShaderMaterial and Color is required.');
  }
  if (!Number.isFinite(contourSpacingMeters) || contourSpacingMeters <= 0) {
    throw new RangeError('contourSpacingMeters must be positive.');
  }
  if (!Number.isInteger(majorContourEvery) || majorContourEvery < 1) {
    throw new RangeError('majorContourEvery must be a positive integer.');
  }
  const material = new THREE.ShaderMaterial({
    name: 'motorcycle-neon-topographic-terrain',
    uniforms: {
      contourSpacingMeters: { value: contourSpacingMeters },
      majorContourEvery: { value: majorContourEvery },
      contourWidth: { value: contourWidth },
      contourColor: { value: new THREE.Color(color) },
      majorContourColor: { value: new THREE.Color(majorColor) },
      baseColor: { value: new THREE.Color(0x000000) },
    },
    vertexShader: `
      varying float vWorldHeight;
      varying vec3 vWorldNormal;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldHeight = worldPosition.y;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float contourSpacingMeters;
      uniform float majorContourEvery;
      uniform float contourWidth;
      uniform vec3 contourColor;
      uniform vec3 majorContourColor;
      uniform vec3 baseColor;
      varying float vWorldHeight;
      varying vec3 vWorldNormal;
      void main() {
        float level = vWorldHeight / contourSpacingMeters;
        float nearest = abs(fract(level + 0.5) - 0.5);
        float rawDerivativeWidth = fwidth(level);
        float contourVariation = smoothstep(0.000001, 0.00005, rawDerivativeWidth);
        float derivativeWidth = max(rawDerivativeWidth, 0.0001);
        float minorLine = 1.0 - smoothstep(contourWidth * derivativeWidth,
          (contourWidth + 1.15) * derivativeWidth, nearest);
        float majorLevel = level / majorContourEvery;
        float majorNearest = abs(fract(majorLevel + 0.5) - 0.5);
        float majorLine = 1.0 - smoothstep(contourWidth * derivativeWidth * 1.8,
          (contourWidth + 1.7) * derivativeWidth, majorNearest);
        minorLine *= contourVariation;
        majorLine *= contourVariation;
        float grazing = 0.11 + 0.12 * (1.0 - abs(normalize(vWorldNormal).y));
        vec3 neon = mix(contourColor, majorContourColor, majorLine);
        vec3 finalColor = baseColor + neon * max(minorLine, majorLine) + contourColor * grazing;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide,
    depthWrite: true,
    transparent: false,
    toneMapped: false,
  });
  material.extensions.derivatives = true;
  material.userData = {
    style: 'black-neon-repeating-topographic-contours',
    contourSpacingMeters,
    majorContourEvery,
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
