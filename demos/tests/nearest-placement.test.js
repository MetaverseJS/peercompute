import test from 'node:test';
import assert from 'node:assert/strict';
import { nearestPlacement, PLACEMENT_CLEARANCE as gap } from '../shared/world/nearestPlacement.js';

const bounds = { min: [-100, -100], max: [100, 100] };
const rectangle = (min, max) => ({ planes: [
  { normal: [1, 0], offset: max[0] }, { normal: [-1, 0], offset: -min[0] },
  { normal: [0, 1], offset: max[1] }, { normal: [0, -1], offset: -min[1] }
] });
const near = (actual, expected) => actual.forEach((value, axis) => assert(Math.abs(value - expected[axis]) < 1e-7, `${actual} != ${expected}`));

test('nearest placement preserves clear anchors and projects onto surface edges continuously', () => {
  near(nearestPlacement({ target: [5.125, -7.75], bounds }), [5.125, -7.75]);
  near(nearestPlacement({ target: [102, 9], bounds }), [100, 9]);
  near(nearestPlacement({ target: [102, 103], bounds }), [100, 100]);
});

test('blocked center uses the nearest clearance boundary, with deterministic ties', () => {
  const obstacles = [rectangle([-3, -6], [4, 6])];
  near(nearestPlacement({ target: [0, 0], bounds, obstacles }), [-3 - gap, 0]);
  near(nearestPlacement({ target: [2, 1], bounds, obstacles }), [4 + gap, 1]);
  const square = [rectangle([-3, -3], [3, 3])];
  const tied = nearestPlacement({ target: [0, 0], bounds, obstacles: square });
  assert(Math.abs(Math.hypot(...tied) - 3 - gap) < 1e-7);
  for (let index = 0; index < 3; index++) assert.deepEqual(nearestPlacement({ target: [0, 0], bounds, obstacles: square }), tied);
});

test('overlapping obstacles preserve a narrow continuous gap rather than selecting a grid sample', () => {
  const obstacles = [rectangle([-5, -100], [5, 0]), rectangle([-5, .02], [5, 100]), rectangle([4, -1], [8, 1])];
  near(nearestPlacement({ target: [0, -1], bounds, obstacles }), [0, gap]);
  near(nearestPlacement({ target: [5, .01], bounds, obstacles }), [5 + gap, 1 + gap]);
});

test('nearest search handles non-axis plane strips and fully blocking planes', () => {
  const obstacles = [{ planes: [{ normal: [1, 1], offset: 2 }, { normal: [-1, -1], offset: 2 }] }];
  const point = nearestPlacement({ target: [0, 0], bounds, obstacles });
  near(point, [-1 - gap / Math.sqrt(2), -1 - gap / Math.sqrt(2)]);
  assert.equal(nearestPlacement({ target: [0, 0], bounds, obstacles: [{ planes: [] }] }), null);
});

test('range disk clips the search while retaining its exact nearest curved boundary', () => {
  const range = { center: [0, 0], radius: 10 };
  near(nearestPlacement({ target: [12, 0], bounds, range }), [10, 0]);
  const obstacles = [rectangle([-100, -100], [8, 100])];
  near(nearestPlacement({ target: [8, 8], bounds, range, obstacles }), [8 + gap, Math.sqrt(100 - (8 + gap) ** 2)]);
  assert.equal(nearestPlacement({ target: [0, 0], bounds, range, obstacles: [rectangle([-11, -11], [11, 11])] }), null);
});

test('a smaller retained domain can meet the range disk at a single tangent point', () => {
  const range = { center: [0, 0], radius: 10 };
  near(nearestPlacement({ target: [10, 8], bounds: { min: [10, -5], max: [20, 5] }, range }), [10, 0]);
  assert.equal(nearestPlacement({ target: [11, 8], bounds: { min: [11, -5], max: [20, 5] }, range }), null);
});

test('rounded circle intersections remain inside the strict physical range', () => {
  const range = { center: [0, 0], radius: 160 }, target = [-47.70563075701048, 151.69335370301175];
  const obstacles = [{ planes: [
    { normal: [-.9579845354538137, -.2868198560618508], offset: 29.403151828395508 },
    { normal: [.9579845354538137, .2868198560618508], offset: 25.0179705390983 }
  ] }];
  const point = nearestPlacement({ target, bounds: { min: [-300, -300], max: [300, 300] }, range, obstacles });
  assert(Math.hypot(...point) <= range.radius);
  assert(obstacles[0].planes.some(({ normal, offset }) => normal[0] * point[0] + normal[1] * point[1] > offset));
});

test('large world bounds do not degrade the nearest result inside the same movement disk', () => {
  const target = [83.83566234302805, -134.11471774066834], range = { center: [0, 0], radius: 160 };
  const obstacles = [{ planes: [
    { normal: [-.8364753398909894, -.5480045672749942], offset: 32.442551099854114 },
    { normal: [.8364753398909894, .5480045672749942], offset: 25.704523685229418 }
  ] }];
  const small = nearestPlacement({ target, bounds: { min: [-200, -200], max: [200, 200] }, range, obstacles });
  const large = nearestPlacement({ target, bounds: { min: [-1_000_000, -1_000_000], max: [1_000_000, 1_000_000] }, range, obstacles });
  near(large, small);
  assert(Math.abs(Math.hypot(large[0] - target[0], large[1] - target[1]) - 29.0743548494362) < 1e-6);
});

test('exact-fit surface envelopes retain point and line domains without escaping bounds', () => {
  near(nearestPlacement({ target: [0, 20], bounds: { min: [0, 0], max: [0, 0] } }), [0, 0]);
  near(nearestPlacement({ target: [0, 20], bounds: { min: [0, 0], max: [0, 10] } }), [0, 10]);
  near(nearestPlacement({ target: [2, 4], bounds: { min: [0, 0], max: [0, 10] } }), [0, 4]);
  near(nearestPlacement({ target: [2, 4], bounds: { min: [0, 0], max: [0, 10] },
    obstacles: [rectangle([-1, 2], [1, 5])] }), [0, 5 + gap]);
  assert.equal(nearestPlacement({ target: [0, 20], bounds: { min: [0, 0], max: [0, 0] },
    obstacles: [rectangle([-1, -1], [1, 1])] }), null);
});

test('a bounded search reports exhaustion instead of returning an arbitrary farther point', () => {
  assert.throws(() => nearestPlacement({ target: [0, 0], bounds, obstacles: [rectangle([-3, -3], [3, 3])], maximumRegions: 1 }),
    error => error.code === 'PLACEMENT_SEARCH_LIMIT');
});

test('malformed geometry is rejected rather than treated as an obstruction to work around', () => {
  for (const input of [
    { target: [NaN, 0], bounds }, { target: [, 0], bounds }, { target: [0, 0], bounds: { min: [1, 1], max: [0, 0] } },
    { target: [0, 0], bounds: { min: [, 0], max: [1, 1] } },
    { target: [0, 0], bounds, range: { center: [0, 0], radius: 0 } },
    { target: [0, 0], bounds, obstacles: [{ planes: [{ normal: [0, 0], offset: 2 }] }] },
    { target: [0, 0], bounds, obstacles: [{ planes: [{ normal: [1, ], offset: 2 }] }] }
  ]) assert.throws(() => nearestPlacement(input), TypeError);
});
