export const BOND_CLASS_STYLE = {
  covalent: {
    label: 'covalent',
    color: '#ffc857',
    emissive: '#5c3410'
  },
  ionic: {
    label: 'ionic',
    color: '#63e6ff',
    emissive: '#0f4b5c'
  },
  metallic: {
    label: 'metallic',
    color: '#d7dce2',
    emissive: '#343a40'
  },
  unknown: {
    label: 'unknown',
    color: '#d8fff0',
    emissive: '#173d31'
  }
};

const parseFormula = (formula = 'H2O') => {
  const atoms = [];
  const re = /([A-Z][a-z]?)(\d*)/g;
  let match;
  while ((match = re.exec(formula))) {
    const count = Math.max(1, Number.parseInt(match[2] || '1', 10));
    for (let i = 0; i < count; i++) atoms.push(match[1]);
  }
  return atoms.length ? atoms : ['H', 'H', 'O'];
};

const covalentBond = (from, to, order = 1, label = 'covalent bond') => ({
  from,
  to,
  bondClass: 'covalent',
  order,
  label
});

const ionicBond = (from, to, label = 'ionic bond') => ({
  from,
  to,
  bondClass: 'ionic',
  order: 1,
  label
});

const diatomicStructure = ({ formula, order = 1, bondClass = 'covalent', spacing = 0.62 }) => {
  const atoms = parseFormula(formula).slice(0, 2);
  const bond = bondClass === 'ionic'
    ? ionicBond(0, 1, `${atoms[0]}-${atoms[1]} ionic`)
    : covalentBond(0, 1, order, `${atoms[0]}-${atoms[1]} covalent`);
  return {
    formula,
    atoms: atoms.map((symbol, index) => ({ symbol, position: [(index - 0.5) * spacing, 0, 0] })),
    bonds: [bond]
  };
};

const waterStructure = () => {
  const bond = 0.56;
  const halfAngle = (104.5 / 2) * Math.PI / 180;
  const hX = Math.sin(halfAngle) * bond;
  const hY = Math.cos(halfAngle) * bond;
  return {
    formula: 'H2O',
    atoms: [
      { symbol: 'O', position: [0, 0, 0] },
      { symbol: 'H', position: [hX, hY, 0] },
      { symbol: 'H', position: [-hX, hY, 0] }
    ],
    bonds: [
      covalentBond(0, 1, 1, 'O-H covalent'),
      covalentBond(0, 2, 1, 'O-H covalent')
    ]
  };
};

const STRUCTURES = {
  H2O: waterStructure(),
  H2: diatomicStructure({ formula: 'H2', order: 1, spacing: 0.56 }),
  O2: diatomicStructure({ formula: 'O2', order: 2, spacing: 0.6 }),
  N2: diatomicStructure({ formula: 'N2', order: 3, spacing: 0.56 }),
  NaCl: diatomicStructure({ formula: 'NaCl', bondClass: 'ionic', spacing: 0.72 }),
  CO2: {
    formula: 'CO2',
    atoms: [
      { symbol: 'O', position: [-0.64, 0, 0] },
      { symbol: 'C', position: [0, 0, 0] },
      { symbol: 'O', position: [0.64, 0, 0] }
    ],
    bonds: [
      covalentBond(0, 1, 2, 'C-O double covalent'),
      covalentBond(1, 2, 2, 'C-O double covalent')
    ]
  },
  CH4: {
    formula: 'CH4',
    atoms: [
      { symbol: 'C', position: [0, 0, 0] },
      { symbol: 'H', position: [0.55, 0.55, 0.55] },
      { symbol: 'H', position: [-0.55, -0.55, 0.55] },
      { symbol: 'H', position: [-0.55, 0.55, -0.55] },
      { symbol: 'H', position: [0.55, -0.55, -0.55] }
    ],
    bonds: [
      covalentBond(0, 1, 1, 'C-H covalent'),
      covalentBond(0, 2, 1, 'C-H covalent'),
      covalentBond(0, 3, 1, 'C-H covalent'),
      covalentBond(0, 4, 1, 'C-H covalent')
    ]
  },
  NH3: {
    formula: 'NH3',
    atoms: [
      { symbol: 'N', position: [0, 0, 0.12] },
      { symbol: 'H', position: [0.55, 0, -0.16] },
      { symbol: 'H', position: [-0.28, 0.48, -0.16] },
      { symbol: 'H', position: [-0.28, -0.48, -0.16] }
    ],
    bonds: [
      covalentBond(0, 1, 1, 'N-H covalent'),
      covalentBond(0, 2, 1, 'N-H covalent'),
      covalentBond(0, 3, 1, 'N-H covalent')
    ]
  }
};

const fallbackStructure = (formula) => {
  const atoms = parseFormula(formula);
  return {
    formula,
    atoms: atoms.map((symbol, index) => {
      if (index === 0) return { symbol, position: [0, 0, 0] };
      const angle = (index / Math.max(1, atoms.length - 1)) * Math.PI * 2;
      return { symbol, position: [Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0] };
    }),
    bonds: atoms.slice(1).map((_, index) => covalentBond(0, index + 1, 1, 'template covalent'))
  };
};

export const getMolecularStructure = (formula = 'H2O') => STRUCTURES[formula] || fallbackStructure(formula);

export const getBondEventsForFormula = (formula = 'H2O') => {
  const structure = getMolecularStructure(formula);
  return structure.bonds.map((bond, index) => {
    const fromAtom = structure.atoms[bond.from];
    const toAtom = structure.atoms[bond.to];
    return {
      model: 'molecular-structure-reference-v0',
      formula: structure.formula,
      index,
      atoms: [fromAtom?.symbol || '?', toAtom?.symbol || '?'],
      from: bond.from,
      to: bond.to,
      bondClass: bond.bondClass || 'unknown',
      order: bond.order || 1,
      label: bond.label || `${bond.bondClass || 'unknown'} bond`,
      confidence: 'reference-template'
    };
  });
};

export const summarizeBondEvents = (bondEvents = []) => bondEvents.reduce((summary, event) => {
  const key = event.bondClass || 'unknown';
  summary[key] = (summary[key] || 0) + 1;
  return summary;
}, {});
