import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveOverviewUrl } from '../inference/src/ui/consoleNavigation.js';

test('overview navigation retains deployment prefixes and uses the existing dedicated dev gallery', () => {
  for (const [input, expected] of [
    ['https://metaversejs.github.io/peercompute/inference/', 'https://metaversejs.github.io/peercompute/'],
    ['https://metaversejs.github.io/peercompute/inference/index.html?model=old#chat', 'https://metaversejs.github.io/peercompute/'],
    ['https://fastbox.tail5c077c.ts.net:5197/peercompute/inference/?prod=1', 'https://fastbox.tail5c077c.ts.net:5197/peercompute/?prod=1'],
    ['https://fastbox.tail5c077c.ts.net:5189/?dev=1&v=preview', 'https://fastbox.tail5c077c.ts.net:4173/?dev=1'],
    ['https://localhost:5189/index.html', 'https://localhost:4173/?dev=1'],
    ['http://127.0.0.1:5189/?prod=1', 'http://127.0.0.1:4173/?prod=1'],
    ['https://localhost:4173/docs/inference/?prod=1', 'https://localhost:4173/docs/?prod=1'],
    ['https://metaversejs.github.io/peercompute/cubechat/', 'https://metaversejs.github.io/peercompute/'],
    ['https://fastbox.tail5c077c.ts.net:5187/', 'https://fastbox.tail5c077c.ts.net:4173/?dev=1'],
    ['https://localhost:5176/', 'https://localhost:4173/?dev=1'],
  ]) assert.equal(resolveOverviewUrl(input), expected, input);
});

test('a nested static deployment on a dedicated port keeps its path instead of switching servers', () => {
  assert.equal(resolveOverviewUrl('https://localhost:5189/peercompute/inference/'), 'https://localhost:5189/peercompute/');
  assert.equal(resolveOverviewUrl('https://example.test/team/releases/inference'), 'https://example.test/team/releases/');
});
