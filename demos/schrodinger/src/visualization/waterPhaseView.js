import * as THREE from 'three';
import { getElementBySymbol } from '../data/elements.js';
import { BOND_CLASS_STYLE, getBondEventsForFormula, getMolecularStructure } from '../data/molecularStructures.js';

const phaseLayout = {
  solid: { spacing: 1.2, jitter: 0.02, spread: 4.4, moleculeScale: 0.95 },
  liquid: { spacing: 1.18, jitter: 0.22, spread: 4.5, moleculeScale: 1.0 },
  gas: { spacing: 2.05, jitter: 0.55, spread: 6.4, moleculeScale: 1.0 },
  mixed: { spacing: 1.45, jitter: 0.35, spread: 5.2, moleculeScale: 0.98 }
};

const atomStyle = {
  H: { radius: 0.105, color: '#f3fbff' },
  C: { radius: 0.17, color: '#9ea7ad' },
  N: { radius: 0.16, color: '#7aa7ff' },
  O: { radius: 0.19, color: '#ff6f7d' },
  Na: { radius: 0.19, color: '#9fd0ff' },
  Cl: { radius: 0.21, color: '#8dff9a' }
};

const makeSphere = (symbol) => {
  const element = getElementBySymbol(symbol);
  const style = atomStyle[symbol] || { radius: 0.16, color: element.color || '#d7fff0' };
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(style.radius, 28, 20),
    new THREE.MeshStandardMaterial({
      color: style.color,
      roughness: 0.42,
      metalness: 0.03,
      emissive: style.color,
      emissiveIntensity: 0.035
    })
  );
  mesh.name = `atom:${symbol}`;
  return mesh;
};

const makeBond = (start, end, bond = {}) => {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const midpoint = from.clone().lerp(to, 0.5);
  const direction = to.clone().sub(from);
  const length = direction.length();
  const bondClass = bond.bondClass || 'unknown';
  const style = BOND_CLASS_STYLE[bondClass] || BOND_CLASS_STYLE.unknown;
  const order = Math.max(1, Math.min(3, Number(bond.order || 1)));
  const radius = bondClass === 'ionic' ? 0.03 : 0.018 + order * 0.005;
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 18),
    new THREE.MeshStandardMaterial({
      color: style.color,
      emissive: style.emissive,
      emissiveIntensity: bondClass === 'ionic' ? 0.2 : 0.14,
      roughness: 0.42,
      transparent: true,
      opacity: bondClass === 'ionic' ? 0.72 : 0.88
    })
  );
  mesh.name = `bond:${bondClass}`;
  mesh.userData = {
    bondClass,
    order,
    label: bond.label || style.label,
    from: bond.from,
    to: bond.to
  };
  mesh.position.copy(midpoint);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
};

const createMoleculeGroup = (formula) => {
  const template = getMolecularStructure(formula);
  const group = new THREE.Group();
  group.name = `molecule:${formula}`;
  for (const atom of template.atoms) {
    const sphere = makeSphere(atom.symbol);
    sphere.position.set(...atom.position);
    group.add(sphere);
  }
  for (const bond of template.bonds) {
    const start = template.atoms[bond.from]?.position;
    const end = template.atoms[bond.to]?.position;
    if (start && end) group.add(makeBond(start, end, bond));
  }
  group.userData = {
    formula,
    atomCount: template.atoms.length,
    bondCount: template.bonds.length,
    bondClasses: [...new Set(template.bonds.map((bond) => bond.bondClass || 'unknown'))]
  };
  return group;
};

const formulaFromPacket = (packet) => {
  const composition = packet?.state?.composition || {};
  return Object.keys(composition)[0] || 'H2O';
};

export const createWaterPhaseGroup = (packet) => {
  const phase = packet?.state?.phase || 'liquid';
  const layout = phaseLayout[phase] || phaseLayout.liquid;
  const formula = formulaFromPacket(packet);
  const group = new THREE.Group();
  group.name = 'material-phase-group';

  const moleculeCount = phase === 'gas' ? 16 : 27;
  const side = Math.ceil(Math.cbrt(moleculeCount));
  let index = 0;
  for (let z = 0; z < side; z++) {
    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        if (index >= moleculeCount) break;
        const molecule = createMoleculeGroup(formula);
        molecule.name = `molecule:${formula}:${index}`;
        molecule.scale.setScalar(layout.moleculeScale);
        molecule.position.set(
          (x - (side - 1) / 2) * layout.spacing,
          (y - (side - 1) / 2) * layout.spacing,
          (z - (side - 1) / 2) * layout.spacing
        );
        molecule.position.x += Math.sin(index * 7.13) * layout.jitter;
        molecule.position.y += Math.cos(index * 3.81) * layout.jitter;
        molecule.position.z += Math.sin(index * 4.47) * layout.jitter;
        molecule.rotation.set(index * 0.41, index * 0.27, index * 0.19);
        group.add(molecule);
        index += 1;
      }
    }
  }

  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(layout.spread, layout.spread, layout.spread),
    new THREE.MeshBasicMaterial({
      color: phase === 'solid' ? '#9fd8ff' : phase === 'gas' ? '#ffe2a1' : '#7af0d1',
      wireframe: true,
      transparent: true,
      opacity: 0.24
    })
  );
  group.add(shell);
  const template = getMolecularStructure(formula);
  group.userData = {
    formula,
    moleculeCount,
    atomsPerMolecule: template.atoms.length,
    bondsPerMolecule: template.bonds.length,
    bondClasses: [...new Set(template.bonds.map((bond) => bond.bondClass || 'unknown'))],
    bondEvents: getBondEventsForFormula(formula),
    extent: layout.spread
  };
  return group;
};
