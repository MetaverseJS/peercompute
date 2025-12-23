import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TerrainCache } from '../src/world/terrainCache.js';

class FakeStore {
  constructor() {
    this.map = new Map();
  }
  read(key) { return this.map.get(key); }
  write(key, value) { this.map.set(key, value); }
  delete(key) { this.map.delete(key); }
  listKeys() { return Array.from(this.map.keys()); }
}

test('cache clears old data when version changes', () => {
  const store = new FakeStore();
  store.write('chunk-1', { foo: 'old' });
  store.write('__version', '0.1.0');

  const cache = new TerrainCache(store, '0.2.0');
  assert.equal(cache.getChunk('chunk-1'), null);
  assert.equal(store.listKeys().includes('chunk-1'), false);
  assert.equal(store.read('__version'), '0.2.0');
});

test('cache reads/writes chunks and mirrors to store', () => {
  const store = new FakeStore();
  const cache = new TerrainCache(store, '0.2.0');
  cache.putChunk('chunk-2', { heights: [1, 2, 3] });
  assert.deepEqual(cache.getChunk('chunk-2'), { heights: [1, 2, 3] });
  assert.deepEqual(store.read('chunk-2'), { heights: [1, 2, 3] });
});
