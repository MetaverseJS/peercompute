import { encodeGeneratedMesh } from '../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
export const worldId = 'cubechat:objects';
export const action = { name: 'Test pyramid', prompt: 'A small stone pyramid on a plain white background', size: 6 };
/** Small structural test data, never presented as inference evidence. */
export const meshFixture = () => encodeGeneratedMesh({
  positions: new Float32Array([-1, 0, -1, 1, 0, -1, 0, 2, 0, 0, 0, 1]),
  indices: new Uint32Array([0, 1, 2, 1, 3, 2, 3, 0, 2, 0, 3, 1]),
  colors: new Float32Array([1, .3, .2, 1, .8, .2, .2, 1, .5, .2, .4, 1]),
});
export const imageFixture = () => ({ width: 2, height: 2, channels: 4, data: new Uint8Array(16).fill(128) });
export const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
export const tick = () => new Promise(resolve => setImmediate(resolve));
export async function until(check) { for (let i = 0; i < 100; i++) { if (check()) return; await tick(); } throw new Error('Fixture condition did not settle'); }
export function sceneAdapter() {
  const visible = new Map(), prepared = [], removed = [];
  return { visible, prepared, removed, getPlacement: () => [10, 0, 4],
    async prepare(mesh, { signal, size } = {}) {
      signal?.throwIfAborted(); const state = { mesh, size, released: false, committed: false }; prepared.push(state);
      return { commit(key, descriptor) { state.committed = true; visible.set(key, descriptor); }, dispose() { state.released = true; } };
    },
    remove(key) { removed.push(key); visible.delete(key); },
    dispose() { visible.clear(); },
  };
}
