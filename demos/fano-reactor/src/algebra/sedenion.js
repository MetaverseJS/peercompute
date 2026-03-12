export const SEDENION_DIMENSION = 16;

export const FANO_TRIPLES = [
  [1, 2, 3],
  [1, 4, 5],
  [1, 6, 7],
  [2, 4, 6],
  [2, 5, 7],
  [3, 4, 7],
  [3, 5, 6]
];

const assertSameLength = (a, b) => {
  if (a.length !== b.length) {
    throw new Error(`Length mismatch: ${a.length} !== ${b.length}`);
  }
};

const clone = (value) => value.slice();

const split = (value) => {
  const half = value.length / 2;
  return [value.slice(0, half), value.slice(half)];
};

export const zeroElement = (dimension = SEDENION_DIMENSION) => new Array(dimension).fill(0);

export const basisElement = (index, dimension = SEDENION_DIMENSION) => {
  const element = zeroElement(dimension);
  element[index] = 1;
  return element;
};

export const fromTerms = (terms, dimension = SEDENION_DIMENSION) => {
  const element = zeroElement(dimension);
  for (const term of terms) {
    if (!term) continue;
    const { index, coefficient = 1 } = term;
    if (!Number.isInteger(index) || index < 0 || index >= dimension) {
      throw new Error(`Invalid basis index: ${index}`);
    }
    element[index] += coefficient;
  }
  return element;
};

export const addElements = (a, b) => {
  assertSameLength(a, b);
  return a.map((value, index) => value + b[index]);
};

export const subtractElements = (a, b) => {
  assertSameLength(a, b);
  return a.map((value, index) => value - b[index]);
};

export const scaleElement = (element, scalar) => element.map((value) => value * scalar);

export const conjugate = (value) => {
  if (value.length === 1) return clone(value);
  const [left, right] = split(value);
  return conjugate(left).concat(scaleElement(right, -1));
};

export const multiplyElements = (a, b) => {
  assertSameLength(a, b);
  if (a.length === 1) {
    return [a[0] * b[0]];
  }

  const [leftA, rightA] = split(a);
  const [leftB, rightB] = split(b);
  const left = subtractElements(
    multiplyElements(leftA, leftB),
    multiplyElements(conjugate(rightB), rightA)
  );
  const right = addElements(
    multiplyElements(rightB, leftA),
    multiplyElements(rightA, conjugate(leftB))
  );
  return left.concat(right);
};

export const normSquared = (element) => element.reduce((sum, value) => sum + (value * value), 0);

export const isZeroElement = (element) => element.every((value) => value === 0);

export const nonZeroTerms = (element) => element
  .map((coefficient, index) => ({ index, coefficient }))
  .filter((term) => term.coefficient !== 0);

export const formatElement = (element) => {
  const terms = nonZeroTerms(element);
  if (!terms.length) return '0';

  return terms
    .map(({ index, coefficient }, termIndex) => {
      const sign = coefficient < 0 ? '-' : '+';
      const magnitude = Math.abs(coefficient);
      const unit = index === 0 ? '1' : `e${index}`;
      const value = magnitude === 1 ? unit : `${magnitude}${unit}`;
      return termIndex === 0
        ? (coefficient < 0 ? `-${value}` : value)
        : ` ${sign} ${value}`;
    })
    .join('');
};
