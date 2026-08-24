export const DEFAULT_TOPO_STYLE = Object.freeze({
  contourSpacing: 500,
  contourWidth: 1.5,
  contourColor: Object.freeze([0.2, 1, 0.45, 1]),
  backgroundColor: Object.freeze([0.001, 0.008, 0.003, 1])
});

export function createTopoMaterial(Cesium, options = {}) {
  if (!Cesium?.Material || !Cesium?.Color) {
    throw new TypeError('Cesium Material and Color constructors are required.');
  }

  const style = { ...DEFAULT_TOPO_STYLE, ...options };
  const contourColor = new Cesium.Color(...style.contourColor);
  const backgroundColor = new Cesium.Color(...style.backgroundColor);

  const material = new Cesium.Material({
    fabric: {
      type: 'WxGlobeTopoMaterial',
      materials: {
        background: {
          type: 'Color',
          uniforms: { color: backgroundColor }
        },
        contours: {
          type: Cesium.Material.ElevationContourType,
          uniforms: {
            color: contourColor,
            spacing: style.contourSpacing,
            width: style.contourWidth
          }
        }
      },
      components: {
        // Heightmap skirts reuse an exact tile-edge texture coordinate. Keep
        // contour ink off that zero-width boundary so the vertical crack guards
        // do not appear as false straight meridians.
        diffuse: 'contours.alpha > 0.0 && min(min(materialInput.st.s, 1.0 - materialInput.st.s), min(materialInput.st.t, 1.0 - materialInput.st.t)) > 0.00001 ? contours.diffuse : background.diffuse',
        alpha: '1.0'
      }
    }
  });

  material.wxglobe = {
    contourSpacing: style.contourSpacing,
    contourWidth: style.contourWidth,
    contourColor: [...style.contourColor],
    backgroundColor: [...style.backgroundColor]
  };
  return material;
}

export function createTopoOverlayMaterial(Cesium, options = {}) {
  if (!Cesium?.Material?.fromType || !Cesium?.Color) {
    throw new TypeError('Cesium Material.fromType and Color constructors are required.');
  }
  const style = { ...DEFAULT_TOPO_STYLE, ...options };
  const contourColor = new Cesium.Color(...style.contourColor);
  const material = Cesium.Material.fromType(Cesium.Material.ElevationContourType, {
    color: contourColor,
    spacing: style.contourSpacing,
    width: style.contourWidth
  });
  material.wxglobe = {
    contourSpacing: style.contourSpacing,
    contourWidth: style.contourWidth,
    contourColor: [...style.contourColor],
    backgroundColor: null,
    transparentBetweenContours: true
  };
  return material;
}

export function updateTopoMaterial(material, { contourSpacing, contourWidth } = {}) {
  const uniforms = material?.materials?.contours?.uniforms ?? material?.uniforms;
  if (!uniforms) throw new TypeError('Expected a WXGlobe contour material.');

  if (contourSpacing !== undefined) {
    if (!Number.isFinite(contourSpacing) || contourSpacing <= 0) {
      throw new RangeError('Contour spacing must be a positive number.');
    }
    uniforms.spacing = contourSpacing;
    material.wxglobe.contourSpacing = contourSpacing;
  }

  if (contourWidth !== undefined) {
    if (!Number.isFinite(contourWidth) || contourWidth <= 0) {
      throw new RangeError('Contour width must be a positive number.');
    }
    uniforms.width = contourWidth;
    material.wxglobe.contourWidth = contourWidth;
  }

  return material;
}
