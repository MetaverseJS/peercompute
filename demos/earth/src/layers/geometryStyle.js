export const EARTH_GEOMETRY_STYLE = Object.freeze({
  schemaVersion: 'peercompute.earthgrid.actual-geometry-style.v2',
  renderer: 'cesium-buffer-geometry',
  renderingModel: 'actual-cesium-buffer-geometry',
  geometryBackend: 'Cesium.BufferPolygonCollection/BufferPolylineCollection',
  coordinateModel: 'explicit-geodetic-heights',
  rasterPainted: false,
  canvasTileCount: 0,
  glow: false,
  bloom: false,
  haloPasses: 0,
  linePassesPerPath: 1,
  lineMaterial: 'solid-unlit-color',
  curveModel: 'exact-degree-one-nurbs-polyline',
  terrainSurface: Object.freeze({
    color: '#000000',
    frontFaceAlpha: 0.035,
    backFaceAlpha: 0,
  }),
  colors: Object.freeze({
    terrainAboveWater: '#33ff73',
    terrainAtOrBelowWater: '#24cfff',
    waterSurface: '#0080ff',
    shoreline: '#24cfff',
    building: '#32aaff',
  }),
  categoryOrder: Object.freeze([
    'terrain-contour',
    'water-surface',
    'shoreline',
    'building-wireframe',
    'global-road',
    'local-road',
  ]),
  // Cesium's experimental Buffer* geometry has no public ground z-index.
  // Every vector is therefore assigned an explicit source/sampled height plus
  // this small radial bias. The monotonic offsets are the road-over-water
  // ordering contract; array or decoder order is never used as a substitute.
  heightOffsetsMeters: Object.freeze({
    terrainContours: 0.25,
    waterSurfaces: 0.5,
    shorelines: 0.75,
    buildingWires: 1,
    globalRoads: 2,
    localRoads: 4,
  }),
  roadsTopmost: true,
});

export function assertBufferGeometrySupport(Cesium, scene) {
  if (!scene?.primitives) throw new TypeError('A Cesium scene primitive collection is required.');
  const exports = Object.freeze({
    polygonCollection: typeof Cesium?.BufferPolygonCollection === 'function',
    polygon: typeof Cesium?.BufferPolygon === 'function',
    polygonMaterial: typeof Cesium?.BufferPolygonMaterial === 'function',
    polylineCollection: typeof Cesium?.BufferPolylineCollection === 'function',
    polyline: typeof Cesium?.BufferPolyline === 'function',
    polylineMaterial: typeof Cesium?.BufferPolylineMaterial === 'function',
  });
  if (Object.values(exports).some((supported) => !supported)) {
    const error = new Error('EarthGrid requires the pinned Cesium buffer polygon and polyline APIs.');
    error.code = 'ERR_EARTH_BUFFER_GEOMETRY_UNSUPPORTED';
    throw error;
  }
  return exports;
}

export function configureTransparentTerrainGlobe(Cesium, scene) {
  if (!Cesium?.Color || !scene?.globe?.translucency) {
    throw new TypeError('Cesium globe translucency primitives are required.');
  }
  const { globe } = scene;
  globe.material = undefined;
  globe.baseColor = Cesium.Color.BLACK;
  globe.depthTestAgainstTerrain = true;
  globe.translucency.enabled = true;
  globe.translucency.frontFaceAlpha = EARTH_GEOMETRY_STYLE.terrainSurface.frontFaceAlpha;
  globe.translucency.backFaceAlpha = EARTH_GEOMETRY_STYLE.terrainSurface.backFaceAlpha;
  globe.undergroundColor = undefined;
  return EARTH_GEOMETRY_STYLE.terrainSurface;
}
