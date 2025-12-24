export const createNurbsCurve = (THREE, degree, knots, controlPoints, startKnot = 0, endKnot = knots.length - 1) => {
  const nurbsUtils = {
    findSpan: (deg, knotVec, u, numControlPoints) => {
      const n = numControlPoints - 1;
      if (u >= knotVec[n + 1]) return n;
      if (u <= knotVec[deg]) return deg;
      let low = deg;
      let high = n + 1;
      while (high - low > 1) {
        const mid = Math.floor((low + high) / 2);
        if (u < knotVec[mid]) high = mid;
        else low = mid;
      }
      return low;
    },
    calcBSplinePoint: (deg, knotVec, ctrlPoints, u) => {
      const k = nurbsUtils.findSpan(deg, knotVec, u, ctrlPoints.length);
      const d = [];
      for (let j = 0; j <= deg; j++) {
        d[j] = ctrlPoints[k - deg + j].clone();
      }
      for (let r = 1; r <= deg; r++) {
        for (let j = deg; j >= r; j--) {
          const i = k - deg + j;
          const left = knotVec[i];
          const right = knotVec[i + deg - r + 1];
          const alpha = right !== left ? (u - left) / (right - left) : 0;
          d[j] = d[j - 1].clone().multiplyScalar(1 - alpha)
            .add(d[j].clone().multiplyScalar(alpha));
        }
      }
      return d[deg];
    }
  };

  class NURBSCurve extends THREE.Curve {
    constructor(curveDegree, knotVec, ctrlPoints, start = 0, end = knotVec.length - 1) {
      super();
      this.degree = curveDegree;
      this.knots = knotVec;
      this.controlPoints = ctrlPoints.map((p) => new THREE.Vector4(p.x, p.y, p.z, p.w ?? 1));
      this.startKnot = start;
      this.endKnot = end;
    }

    getPoint(t, target = new THREE.Vector3()) {
      const u = this.knots[this.startKnot]
        + t * (this.knots[this.endKnot] - this.knots[this.startKnot]);
      const hpoint = nurbsUtils.calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);
      if (hpoint.w !== 1 && hpoint.w !== 0) hpoint.divideScalar(hpoint.w);
      return target.set(hpoint.x, hpoint.y, hpoint.z);
    }
  }

  return new NURBSCurve(degree, knots, controlPoints, startKnot, endKnot);
};
