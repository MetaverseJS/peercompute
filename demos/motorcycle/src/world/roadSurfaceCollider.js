import { createHeightfieldSurfaceCollider } from '../../../shared/physics/particle-rigid/index.js';

export function createRoadTerrainSurface(terrain, {
  id = 'real-terrain-surface',
  friction = 1.05,
  restitution = 0.01,
} = {}) {
  if (terrain?.schemaVersion !== 'peercompute.geo.local-terrain-grid.v1') {
    throw new TypeError('A canonical local terrain grid is required.');
  }
  const originOffset = [0, 0, 0];
  const collider = createHeightfieldSurfaceCollider({
    id,
    // Physics coordinates are periodically rebased around the motorcycle.
    // Convert every query back into the immutable terrain grid's original
    // local frame so rebasing cannot detach collision from rendered relief.
    sampleHeight: (x, z) => (
      terrain.sampleLocalHeight(x + originOffset[0], z + originOffset[2])
        - originOffset[1]
    ),
    sampleNormal: (x, z) => terrain.sampleLocalNormal(
      x + originOffset[0],
      z + originOffset[2],
    ),
    // The translated bounds change after every rebase. The immutable terrain
    // sampler already returns NaN outside its exact source grid, so a static
    // heightfield bound would be incorrect here.
    bounds: null,
    normalStep: terrain.normalStep,
    friction,
    restitution,
    metadata: {
      sourceId: terrain.source.id,
      sourceAuthoritative: terrain.source.authoritative,
      derivedTerrain: terrain.source.derived,
      operationalUse: false,
      originRebasing: true,
    },
  });
  return Object.freeze({
    ...collider,
    shiftOrigin(shift) {
      if ((!Array.isArray(shift) && !ArrayBuffer.isView(shift)) || shift.length < 3) {
        throw new TypeError('Terrain origin shift must contain three components.');
      }
      const next = Array.from(shift).slice(0, 3).map(Number);
      if (!next.every(Number.isFinite)) throw new TypeError('Terrain origin shift must be finite.');
      for (let index = 0; index < 3; index += 1) originOffset[index] += next[index];
      return Object.freeze([...originOffset]);
    },
    getOriginOffset() {
      return Object.freeze([...originOffset]);
    },
  });
}
