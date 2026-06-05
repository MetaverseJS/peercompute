import { clamp, createRng, hashSeed } from '../core/random.js';
import { getElementBySymbol } from '../data/elements.js';

export const DEFAULT_REACTIVE_ENVIRONMENT = {
  temperatureK: 293.15,
  pressureAtm: 1,
  gravityMps2: 9.81
};

const VALENCE_CAPACITY = {
  H: 1,
  C: 4,
  N: 3,
  O: 2,
  Na: 1,
  Cl: 1,
  S: 2,
  P: 3
};

const BOND_RULES = [
  { symbols: ['O', 'H'], bondClass: 'covalent', order: 1, restLength: 0.52, captureRadius: 1.75, priority: 100, breakK: 4200, label: 'O-H covalent' },
  { symbols: ['C', 'H'], bondClass: 'covalent', order: 1, restLength: 0.58, captureRadius: 1.55, priority: 80, breakK: 4300, label: 'C-H covalent' },
  { symbols: ['N', 'H'], bondClass: 'covalent', order: 1, restLength: 0.56, captureRadius: 1.55, priority: 78, breakK: 3900, label: 'N-H covalent' },
  { symbols: ['C', 'O'], bondClass: 'covalent', order: 2, restLength: 0.62, captureRadius: 1.45, priority: 72, breakK: 4700, label: 'C-O covalent' },
  { symbols: ['Na', 'Cl'], bondClass: 'ionic', order: 1, restLength: 0.72, captureRadius: 1.95, priority: 95, breakK: 3400, label: 'Na-Cl ionic' },
  { symbols: ['S', 'H'], bondClass: 'covalent', order: 1, restLength: 0.62, captureRadius: 1.45, priority: 55, breakK: 3400, label: 'S-H covalent' },
  { symbols: ['P', 'H'], bondClass: 'covalent', order: 1, restLength: 0.64, captureRadius: 1.45, priority: 52, breakK: 3400, label: 'P-H covalent' }
];

const METAL_CATEGORIES = new Set(['alkali metal', 'alkaline earth', 'post-transition metal', 'transition metal', 'actinide']);

const vector = (x = 0, y = 0, z = 0) => ({ x, y, z });

const addScaled = (target, source, scale) => {
  target.x += source.x * scale;
  target.y += source.y * scale;
  target.z += source.z * scale;
};

const sub = (a, b) => vector(a.x - b.x, a.y - b.y, a.z - b.z);

const length = (v) => Math.hypot(v.x, v.y, v.z);

const scaleTo = (v, magnitude) => {
  const len = Math.max(1e-6, length(v));
  const scale = magnitude / len;
  v.x *= scale;
  v.y *= scale;
  v.z *= scale;
  return v;
};

const pairKey = (a, b) => {
  const [left, right] = [a, b].sort();
  return `${left}-${right}`;
};

const ruleKey = (symbols) => pairKey(symbols[0], symbols[1]);
const RULES_BY_KEY = new Map(BOND_RULES.map((rule) => [ruleKey(rule.symbols), rule]));

const isMetal = (symbol) => METAL_CATEGORIES.has(getElementBySymbol(symbol).category);

export const getReactiveBondRule = (symbolA, symbolB) => {
  const exact = RULES_BY_KEY.get(pairKey(symbolA, symbolB));
  if (exact) return exact;
  if (symbolA === symbolB && isMetal(symbolA)) {
    return {
      symbols: [symbolA, symbolB],
      bondClass: 'metallic',
      order: 1,
      restLength: 0.82,
      captureRadius: 1.25,
      priority: 24,
      breakK: 2200,
      label: `${symbolA}-${symbolB} metallic`
    };
  }
  return null;
};

const valenceCapacityFor = (symbol) => {
  if (VALENCE_CAPACITY[symbol]) return VALENCE_CAPACITY[symbol];
  if (isMetal(symbol)) return 6;
  return 0;
};

const formulaForCounts = (counts) => {
  const symbols = Object.keys(counts).filter((symbol) => counts[symbol] > 0);
  const onlyNaCl = symbols.every((symbol) => ['Na', 'Cl'].includes(symbol));
  const order = onlyNaCl
    ? ['Na', 'Cl']
    : symbols.includes('C')
      ? ['C', 'H', ...symbols.filter((symbol) => !['C', 'H'].includes(symbol)).sort()]
      : ['H', 'O', ...symbols.filter((symbol) => !['H', 'O'].includes(symbol)).sort()];
  return [...new Set(order)]
    .filter((symbol) => counts[symbol] > 0)
    .map((symbol) => `${symbol}${counts[symbol] === 1 ? '' : counts[symbol]}`)
    .join('');
};

export class ReactiveAtomSimulation {
  constructor({ seed = 'reactive-atoms-v0', extent = 4.7 } = {}) {
    this.rng = createRng(hashSeed(seed));
    this.extent = extent;
    this.atoms = [];
    this.bonds = [];
    this.nextAtomId = 1;
    this.nextBondId = 1;
    this.timeS = 0;
    this.environment = { ...DEFAULT_REACTIVE_ENVIRONMENT };
  }

  setEnvironment(environment = {}) {
    this.environment = {
      temperatureK: clamp(Number(environment.temperatureK ?? this.environment.temperatureK), 20, 6000),
      pressureAtm: clamp(Number(environment.pressureAtm ?? this.environment.pressureAtm), 0.01, 250),
      gravityMps2: clamp(Number(environment.gravityMps2 ?? this.environment.gravityMps2), 0, 100)
    };
  }

  clear() {
    this.atoms = [];
    this.bonds = [];
    this.nextAtomId = 1;
    this.nextBondId = 1;
    this.timeS = 0;
  }

  addAtoms(symbol, count = 1) {
    const element = getElementBySymbol(symbol);
    const safeCount = Math.max(0, Math.min(80, Math.floor(Number(count) || 0)));
    const created = [];
    for (let i = 0; i < safeCount; i++) {
      const index = this.atoms.length + 1;
      const angle = index * 2.399963229728653;
      const radius = 0.22 + Math.cbrt(index) * 0.28;
      const y = ((index % 7) - 3) * 0.13;
      const thermal = Math.sqrt(this.environment.temperatureK / 293.15) * 0.34;
      const atom = {
        id: this.nextAtomId++,
        symbol: element.symbol,
        name: element.name,
        color: element.color,
        valenceCapacity: valenceCapacityFor(element.symbol),
        position: vector(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
        velocity: vector(
          (this.rng() - 0.5) * thermal,
          (this.rng() - 0.5) * thermal,
          (this.rng() - 0.5) * thermal
        ),
        force: vector()
      };
      this.atoms.push(atom);
      created.push(atom);
    }
    return created;
  }

  addWaterRecipe(moleculeCount = 5) {
    const count = Math.max(1, Math.min(20, Math.floor(Number(moleculeCount) || 5)));
    const oxygen = this.addAtoms('O', count);
    const hydrogen = this.addAtoms('H', count * 2);
    return [...oxygen, ...hydrogen];
  }

  bondSlotsUsed(atomId) {
    return this.bonds.reduce((sum, bond) => (
      bond.a === atomId || bond.b === atomId ? sum + (bond.order || 1) : sum
    ), 0);
  }

  canBond(atomA, atomB, rule) {
    if (!rule) return false;
    if (this.bonds.some((bond) => (
      (bond.a === atomA.id && bond.b === atomB.id) || (bond.a === atomB.id && bond.b === atomA.id)
    ))) return false;
    return this.bondSlotsUsed(atomA.id) + (rule.order || 1) <= atomA.valenceCapacity &&
      this.bondSlotsUsed(atomB.id) + (rule.order || 1) <= atomB.valenceCapacity;
  }

  addBond(atomA, atomB, rule) {
    const bond = {
      id: this.nextBondId++,
      a: atomA.id,
      b: atomB.id,
      bondClass: rule.bondClass,
      order: rule.order || 1,
      restLength: rule.restLength,
      breakK: rule.breakK,
      label: rule.label,
      formedAtS: this.timeS
    };
    this.bonds.push(bond);
    return bond;
  }

  update(dt = 1 / 60) {
    const safeDt = clamp(dt, 0, 0.05);
    const substeps = Math.max(1, Math.ceil(safeDt / 0.012));
    const h = safeDt / substeps;
    for (let i = 0; i < substeps; i++) this.step(h);
  }

  step(dt) {
    this.timeS += dt;
    for (const atom of this.atoms) atom.force = vector();

    const pressurePull = 0.24 * Math.sqrt(this.environment.pressureAtm);
    const thermalScale = Math.sqrt(this.environment.temperatureK / 293.15);
    for (const atom of this.atoms) {
      addScaled(atom.force, atom.position, -pressurePull);
      atom.force.y -= this.environment.gravityMps2 * 0.055;
      atom.velocity.x += (this.rng() - 0.5) * thermalScale * 0.028 * dt;
      atom.velocity.y += (this.rng() - 0.5) * thermalScale * 0.028 * dt;
      atom.velocity.z += (this.rng() - 0.5) * thermalScale * 0.028 * dt;
    }

    this.applyPairForces();
    this.applyBondForces();
    this.breakHotOrStretchedBonds(dt);
    this.integrate(dt);
    this.attemptBonding();
  }

  applyPairForces() {
    for (let i = 0; i < this.atoms.length; i++) {
      for (let j = i + 1; j < this.atoms.length; j++) {
        const a = this.atoms[i];
        const b = this.atoms[j];
        const delta = sub(b.position, a.position);
        const dist = Math.max(0.001, length(delta));
        const direction = scaleTo(delta, 1);
        const nearRepel = Math.max(0, 0.34 - dist) * 7.2;
        if (nearRepel > 0) {
          addScaled(a.force, direction, -nearRepel);
          addScaled(b.force, direction, nearRepel);
        }
        const rule = getReactiveBondRule(a.symbol, b.symbol);
        if (this.canBond(a, b, rule) && dist < 3.4) {
          const attraction = (rule.priority / 100) * 0.42 / Math.max(0.4, dist);
          addScaled(a.force, direction, attraction);
          addScaled(b.force, direction, -attraction);
        }
      }
    }
  }

  applyBondForces() {
    const byId = new Map(this.atoms.map((atom) => [atom.id, atom]));
    for (const bond of this.bonds) {
      const a = byId.get(bond.a);
      const b = byId.get(bond.b);
      if (!a || !b) continue;
      const delta = sub(b.position, a.position);
      const dist = Math.max(0.001, length(delta));
      const direction = scaleTo(delta, 1);
      const stretch = dist - bond.restLength;
      const spring = bond.bondClass === 'ionic' ? 3.2 : bond.bondClass === 'metallic' ? 1.7 : 4.4;
      const force = stretch * spring;
      addScaled(a.force, direction, force);
      addScaled(b.force, direction, -force);
      const damping = 0.05;
      const relative = sub(b.velocity, a.velocity);
      const damp = (relative.x * direction.x + relative.y * direction.y + relative.z * direction.z) * damping;
      addScaled(a.force, direction, damp);
      addScaled(b.force, direction, -damp);
    }
  }

  integrate(dt) {
    const half = this.extent * 0.5;
    const damping = clamp(0.992 - this.environment.pressureAtm * 0.0008, 0.94, 0.994);
    for (const atom of this.atoms) {
      addScaled(atom.velocity, atom.force, dt);
      const speed = length(atom.velocity);
      if (speed > 6) scaleTo(atom.velocity, 6);
      addScaled(atom.position, atom.velocity, dt);
      atom.velocity.x *= damping;
      atom.velocity.y *= damping;
      atom.velocity.z *= damping;
      for (const axis of ['x', 'y', 'z']) {
        if (atom.position[axis] > half) {
          atom.position[axis] = half;
          atom.velocity[axis] *= -0.68;
        } else if (atom.position[axis] < -half) {
          atom.position[axis] = -half;
          atom.velocity[axis] *= -0.68;
        }
      }
    }
  }

  attemptBonding() {
    const candidates = [];
    for (let i = 0; i < this.atoms.length; i++) {
      for (let j = i + 1; j < this.atoms.length; j++) {
        const a = this.atoms[i];
        const b = this.atoms[j];
        const rule = getReactiveBondRule(a.symbol, b.symbol);
        if (!this.canBond(a, b, rule)) continue;
        if (this.environment.temperatureK > rule.breakK * 0.92) continue;
        const dist = length(sub(b.position, a.position));
        const pressureBoost = clamp(1 + Math.log1p(this.environment.pressureAtm) * 0.16, 1, 1.75);
        const capture = rule.captureRadius * pressureBoost;
        if (dist <= capture) candidates.push({ a, b, rule, dist });
      }
    }
    candidates.sort((left, right) => (
      right.rule.priority - left.rule.priority || left.dist - right.dist
    ));
    let formed = 0;
    for (const candidate of candidates) {
      if (formed >= 6) break;
      if (this.canBond(candidate.a, candidate.b, candidate.rule)) {
        this.addBond(candidate.a, candidate.b, candidate.rule);
        formed += 1;
      }
    }
  }

  breakHotOrStretchedBonds(dt) {
    const byId = new Map(this.atoms.map((atom) => [atom.id, atom]));
    this.bonds = this.bonds.filter((bond) => {
      const a = byId.get(bond.a);
      const b = byId.get(bond.b);
      if (!a || !b) return false;
      const dist = length(sub(b.position, a.position));
      if (dist > bond.restLength * 3.8) return false;
      if (this.environment.temperatureK <= bond.breakK) return true;
      const breakChance = clamp((this.environment.temperatureK - bond.breakK) / bond.breakK, 0, 1) * dt * 0.8;
      return this.rng() > breakChance;
    });
  }

  getComposition() {
    return this.atoms.reduce((counts, atom) => {
      counts[atom.symbol] = (counts[atom.symbol] || 0) + 1;
      return counts;
    }, {});
  }

  getMoleculeSummary() {
    const parent = new Map(this.atoms.map((atom) => [atom.id, atom.id]));
    const find = (id) => {
      let root = parent.get(id);
      while (root !== parent.get(root)) root = parent.get(root);
      return root;
    };
    const union = (a, b) => {
      const rootA = find(a);
      const rootB = find(b);
      if (rootA !== rootB) parent.set(rootB, rootA);
    };
    for (const bond of this.bonds) union(bond.a, bond.b);
    const components = new Map();
    for (const atom of this.atoms) {
      const root = find(atom.id);
      if (!components.has(root)) components.set(root, []);
      components.get(root).push(atom);
    }
    const summary = new Map();
    for (const atoms of components.values()) {
      const counts = atoms.reduce((acc, atom) => {
        acc[atom.symbol] = (acc[atom.symbol] || 0) + 1;
        return acc;
      }, {});
      const formula = formulaForCounts(counts) || 'n/a';
      const current = summary.get(formula) || { formula, count: 0, atomCount: atoms.length };
      current.count += 1;
      summary.set(formula, current);
    }
    return [...summary.values()].sort((a, b) => b.atomCount - a.atomCount || a.formula.localeCompare(b.formula));
  }

  getBondSummary() {
    return this.bonds.reduce((summary, bond) => {
      summary[bond.bondClass] = (summary[bond.bondClass] || 0) + 1;
      return summary;
    }, {});
  }

  getSummary() {
    const unsupported = [...new Set(this.atoms
      .filter((atom) => atom.valenceCapacity === 0)
      .map((atom) => atom.symbol))];
    return {
      model: 'toy-reactive-atoms-v0',
      timeS: this.timeS,
      atomCount: this.atoms.length,
      bondCount: this.bonds.length,
      composition: this.getComposition(),
      bondSummary: this.getBondSummary(),
      molecules: this.getMoleculeSummary(),
      environment: { ...this.environment },
      warnings: [
        'Toy dynamics: heuristic valence/bond rules, not validated quantum chemistry.',
        ...(unsupported.length ? [`No bond rule for: ${unsupported.join(', ')}`] : [])
      ]
    };
  }

  getSnapshot() {
    return {
      ...this.getSummary(),
      atoms: this.atoms.map((atom) => ({
        id: atom.id,
        symbol: atom.symbol,
        position: { ...atom.position },
        velocity: { ...atom.velocity },
        valenceUsed: this.bondSlotsUsed(atom.id),
        valenceCapacity: atom.valenceCapacity
      })),
      bonds: this.bonds.map((bond) => ({ ...bond }))
    };
  }
}
