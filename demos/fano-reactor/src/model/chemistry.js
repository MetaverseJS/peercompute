import {
  FANO_TRIPLES,
  addElements,
  formatElement,
  fromTerms,
  isZeroElement,
  multiplyElements,
  normSquared,
  nonZeroTerms
} from '../algebra/sedenion.js';

export const PERIOD_META = [
  { lowerIndex: 1, period: 1, shellLength: 2, nobleGas: 'He', partnerIndex: 9, layer: 'C' },
  { lowerIndex: 2, period: 2, shellLength: 8, nobleGas: 'Ne', partnerIndex: 10, layer: 'H' },
  { lowerIndex: 3, period: 3, shellLength: 8, nobleGas: 'Ar', partnerIndex: 11, layer: 'H' },
  { lowerIndex: 4, period: 4, shellLength: 18, nobleGas: 'Kr', partnerIndex: 12, layer: 'O' },
  { lowerIndex: 5, period: 5, shellLength: 18, nobleGas: 'Xe', partnerIndex: 13, layer: 'O' },
  { lowerIndex: 6, period: 6, shellLength: 32, nobleGas: 'Rn', partnerIndex: 14, layer: 'O' },
  { lowerIndex: 7, period: 7, shellLength: 32, nobleGas: 'Og', partnerIndex: 15, layer: 'O' }
];

const PERIOD_BY_INDEX = new Map(PERIOD_META.map((item) => [item.lowerIndex, item]));
const FANO_LINES_BY_INDEX = new Map();
for (const triple of FANO_TRIPLES) {
  for (const value of triple) {
    const current = FANO_LINES_BY_INDEX.get(value) || [];
    current.push(triple);
    FANO_LINES_BY_INDEX.set(value, current);
  }
}

const BOND_TYPE_META = {
  ionic: { label: 'Ionic', tone: 'ionic', color: 'cyan', detail: 'Norm annihilation / energy release' },
  covalent: { label: 'Covalent', tone: 'covalent', color: 'amber', detail: 'Norm conserved / neutral lock' },
  anti: { label: 'Anti-bond', tone: 'anti', color: 'red', detail: 'Norm amplified / repulsive pressure' },
  inert: { label: 'Inert', tone: 'inert', color: 'green', detail: 'No zero-divisor path discovered' },
  exotic: { label: 'Exotic', tone: 'exotic', color: 'pink', detail: 'Composite-state defect outside atomic spectrum' }
};

const stateId = (lowerIndex, upperIndex, sign) => `e${lowerIndex}${sign >= 0 ? '+' : '-'}e${upperIndex}`;

const sortTerms = (terms) => terms.slice().sort((a, b) => a.index - b.index);

const normalizeElementTerms = (element) => sortTerms(nonZeroTerms(element));

export const formatTerms = (terms) => formatElement(fromTerms(terms));

const compositeIdFromTerms = (terms) => terms
  .map(({ index, coefficient }) => `${coefficient >= 0 ? '+' : '-'}${Math.abs(coefficient)}e${index}`)
  .join('');

export const createAtomicState = ({ lowerIndex, upperIndex, sign }) => {
  const terms = [
    { index: lowerIndex, coefficient: 1 },
    { index: upperIndex, coefficient: sign >= 0 ? 1 : -1 }
  ];
  const element = fromTerms(terms);
  const periodMeta = PERIOD_BY_INDEX.get(lowerIndex) || null;
  return {
    id: stateId(lowerIndex, upperIndex, sign),
    kind: 'atom',
    lowerIndex,
    upperIndex,
    sign: sign >= 0 ? 1 : -1,
    period: periodMeta?.period ?? null,
    shellLength: periodMeta?.shellLength ?? null,
    nobleGas: periodMeta?.nobleGas ?? null,
    layer: periodMeta?.layer ?? null,
    label: formatElement(element),
    element,
    norm: normSquared(element),
    terms,
    familyKey: `${lowerIndex}:${upperIndex}`,
    isCdPartner: upperIndex === lowerIndex + 8
  };
};

export const classifyBondType = (delta, zeroDivisor) => {
  if (zeroDivisor || delta === -4) return BOND_TYPE_META.ionic;
  if (delta === 0) return BOND_TYPE_META.covalent;
  if (delta === 4) return BOND_TYPE_META.anti;
  return BOND_TYPE_META.exotic;
};

export const classifyInteraction = (leftState, rightState) => {
  const product = multiplyElements(leftState.element, rightState.element);
  const productNorm = normSquared(product);
  const delta = productNorm - (leftState.norm * rightState.norm);
  const zeroDivisor = isZeroElement(product);
  const inertEndpoint = getCanonicalReactiveDegree(leftState) === 0 || getCanonicalReactiveDegree(rightState) === 0;
  const bond = (!zeroDivisor && inertEndpoint)
    ? BOND_TYPE_META.inert
    : classifyBondType(delta, zeroDivisor);
  return {
    left: leftState,
    right: rightState,
    product,
    productNorm,
    delta,
    zeroDivisor,
    bond,
    moleculeElement: addElements(leftState.element, rightState.element),
    moleculeLabel: formatElement(addElements(leftState.element, rightState.element))
  };
};

export const createCompositeState = (element, kind = 'molecule') => {
  const terms = normalizeElementTerms(element);
  return {
    id: `${kind}:${compositeIdFromTerms(terms)}`,
    kind,
    label: formatElement(element),
    element,
    norm: normSquared(element),
    terms
  };
};

const isReactiveIndexPair = (lowerIndex, upperIndex) => (
  lowerIndex >= 1
  && lowerIndex <= 7
  && upperIndex >= 9
  && upperIndex <= 15
  && upperIndex !== lowerIndex + 8
);

const canonicalStates = [];
for (let lowerIndex = 1; lowerIndex <= 14; lowerIndex += 1) {
  for (let upperIndex = lowerIndex + 1; upperIndex <= 15; upperIndex += 1) {
    canonicalStates.push(createAtomicState({ lowerIndex, upperIndex, sign: 1 }));
    canonicalStates.push(createAtomicState({ lowerIndex, upperIndex, sign: -1 }));
  }
}

const reactiveStates = canonicalStates.filter((state) => isReactiveIndexPair(state.lowerIndex, state.upperIndex));
const nobleGasStates = canonicalStates.filter((state) => state.isCdPartner);
const nobleGasShowcaseStates = nobleGasStates.filter((state) => state.sign === 1);
const stateById = new Map(canonicalStates.map((state) => [state.id, state]));

export const getStateById = (id) => stateById.get(id) || null;

const zeroTargetsByStateId = new Map();
for (const state of reactiveStates) {
  const targets = reactiveStates.filter((candidate) => (
    candidate.id !== state.id
    && isZeroElement(multiplyElements(state.element, candidate.element))
  ));
  zeroTargetsByStateId.set(state.id, targets);
}

const compositeZeroTargetCount = (element) => reactiveStates.filter((candidate) => (
  isZeroElement(multiplyElements(element, candidate.element))
)).length;

const summarizeComposite = (element, label) => {
  const canonicalTargets = compositeZeroTargetCount(element);
  return {
    label,
    element,
    formatted: formatElement(element),
    norm: normSquared(element),
    canonicalTargets,
    paperTargets: canonicalTargets
  };
};

const findCascadeSample = () => {
  for (const left of reactiveStates) {
    const targets = zeroTargetsByStateId.get(left.id) || [];
    for (const right of targets) {
      const moleculeElement = addElements(left.element, right.element);
      const moleculeCanonicalTargets = reactiveStates.filter((candidate) => (
        ![left.id, right.id].includes(candidate.id)
        && isZeroElement(multiplyElements(moleculeElement, candidate.element))
      ));
      for (const next of moleculeCanonicalTargets) {
        const superElement = addElements(moleculeElement, next.element);
        const superCanonicalTargets = compositeZeroTargetCount(superElement);
        if (superCanonicalTargets !== 0) continue;
        return {
          atomA: left,
          atomB: right,
          molecule: summarizeComposite(moleculeElement, 'molecule'),
          moleculeTargets: moleculeCanonicalTargets,
          atomC: next,
          superMolecule: summarizeComposite(superElement, 'super-molecule')
        };
      }
    }
  }
  return null;
};

export const CHEMISTRY_CATALOG = {
  allStates: canonicalStates,
  reactiveStates,
  nobleGasStates,
  showcaseStates: reactiveStates.concat(nobleGasShowcaseStates),
  inertStates: canonicalStates.filter((state) => !reactiveStates.includes(state)),
  zeroTargetsByStateId,
  cascadeSample: findCascadeSample(),
  counts: {
    canonicalStates: canonicalStates.length,
    reactiveStates: reactiveStates.length,
    reactiveFamilies: reactiveStates.length / 2,
    directedZeroDivisorPairs: reactiveStates.reduce(
      (sum, state) => sum + (zeroTargetsByStateId.get(state.id)?.length || 0),
      0
    ),
    nobleGasChannels: nobleGasStates.length / 2
  }
};

export const getZeroTargets = (state) => zeroTargetsByStateId.get(state.id) || [];

export const getCanonicalReactiveDegree = (stateOrElement) => {
  if (Array.isArray(stateOrElement)) return compositeZeroTargetCount(stateOrElement);
  return getZeroTargets(stateOrElement).length;
};

export const getPaperReactiveDegree = (stateOrElement) => getCanonicalReactiveDegree(stateOrElement) * 2;
export const getDisplayReactiveDegree = (stateOrElement) => {
  if (Array.isArray(stateOrElement)) return getCanonicalReactiveDegree(stateOrElement);
  if (stateOrElement?.kind === 'atom') return getCanonicalReactiveDegree(stateOrElement) * 2;
  return getCanonicalReactiveDegree(stateOrElement);
};

export const getFanoLinesForIndex = (lowerIndex) => FANO_LINES_BY_INDEX.get(lowerIndex) || [];

export const getConnectedLowerIndices = (lowerIndex) => {
  const lines = getFanoLinesForIndex(lowerIndex);
  const connected = new Set();
  for (const triple of lines) {
    for (const value of triple) {
      if (value !== lowerIndex) connected.add(value);
    }
  }
  return Array.from(connected).sort((a, b) => a - b);
};

export const listStatesForLowerIndex = (lowerIndex) => reactiveStates.filter((state) => state.lowerIndex === lowerIndex);

export const findStateByLabel = (label) => canonicalStates.find((state) => state.label === label) || null;

export const summarizeInteraction = (leftState, rightState) => {
  const interaction = classifyInteraction(leftState, rightState);
  const molecule = createCompositeState(interaction.moleculeElement, 'molecule');
  const moleculeTargets = reactiveStates.filter((candidate) => (
    ![leftState.id, rightState.id].includes(candidate.id)
    && isZeroElement(multiplyElements(molecule.element, candidate.element))
  ));

  return {
    ...interaction,
    molecule,
    moleculeCanonicalTargets: moleculeTargets.length,
    moleculePaperTargets: moleculeTargets.length,
    productLabel: formatElement(interaction.product),
    moleculeTargets
  };
};

export const getBondLegend = () => BOND_TYPE_META;
