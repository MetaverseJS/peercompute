import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CONFIG, GAME_NAMESPACE, getRenderDistanceFromQuery } from '../src/config.js';

test('config exposes expected defaults', () => {
  assert.equal(GAME_NAMESPACE, 'cb');
  assert.equal(CONFIG.CHUNK_SIZE, 2048);
  assert.ok(CONFIG.RENDER_DISTANCE > 0);
});

test('render distance query parsing respects bounds', () => {
  const originalWindow = global.window;
  try {
    global.window = { location: { search: '?RD=12' } };
    assert.equal(getRenderDistanceFromQuery(), 12);

    global.window = { location: { search: '?RD=9001' } };
    assert.equal(getRenderDistanceFromQuery(), null);
  } finally {
    global.window = originalWindow;
  }
});
