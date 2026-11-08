import * as THREE from 'three';
import { getElementBySymbol } from '../data/elements.js';
import { BOND_CLASS_STYLE } from '../data/molecularStructures.js';
import { ReactiveAtomSimulation } from '../simulation/reactiveAtoms.js';

const atomRadius = (symbol) => {
  const element = getElementBySymbol(symbol);
  if (symbol === 'H') return 0.12;
  if (['O', 'N', 'C'].includes(symbol)) return 0.18;
  if (['Na', 'Cl'].includes(symbol)) return 0.22;
  return Math.min(0.28, 0.13 + Math.cbrt(element.Z) * 0.03);
};

const makeAtomMesh = (atom) => {
  const element = getElementBySymbol(atom.symbol);
  const color = element.color || '#d7fff0';
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(atomRadius(atom.symbol), 32, 24),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.08,
      roughness: 0.38,
      metalness: element.category.includes('metal') ? 0.22 : 0.03
    })
  );
  mesh.name = `reactive-atom:${atom.symbol}:${atom.id}`;
  mesh.userData = { id: atom.id, symbol: atom.symbol };
  return mesh;
};

const makeBondMesh = (bond) => {
  const style = BOND_CLASS_STYLE[bond.bondClass] || BOND_CLASS_STYLE.unknown;
  const radius = bond.bondClass === 'ionic' ? 0.034 : bond.bondClass === 'metallic' ? 0.026 : 0.025;
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 1, 18),
    new THREE.MeshStandardMaterial({
      color: style.color,
      emissive: style.emissive,
      emissiveIntensity: bond.bondClass === 'ionic' ? 0.28 : 0.18,
      roughness: 0.38,
      transparent: true,
      opacity: bond.bondClass === 'ionic' ? 0.76 : 0.9
    })
  );
  mesh.name = `reactive-bond:${bond.bondClass}:${bond.id}`;
  mesh.userData = { id: bond.id, bondClass: bond.bondClass, label: bond.label };
  return mesh;
};

const setCylinderBetween = (mesh, start, end) => {
  const from = new THREE.Vector3(start.x, start.y, start.z);
  const to = new THREE.Vector3(end.x, end.y, end.z);
  const midpoint = from.clone().lerp(to, 0.5);
  const direction = to.clone().sub(from);
  const length = Math.max(0.001, direction.length());
  mesh.position.copy(midpoint);
  mesh.scale.set(1, length, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
};

const disposeMesh = (mesh) => {
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) mesh.material.dispose();
};

export class ReactiveAtomView {
  constructor() {
    this.simulation = new ReactiveAtomSimulation();
    this.group = new THREE.Group();
    this.group.name = 'reactive-atom-sandbox';
    this.atomMeshes = new Map();
    this.bondMeshes = new Map();

    this.shell = new THREE.Mesh(
      new THREE.BoxGeometry(this.simulation.extent, this.simulation.extent, this.simulation.extent),
      new THREE.MeshBasicMaterial({
        color: '#66f7c0',
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
    );
    this.shell.name = 'reactive-boundary';
    this.group.add(this.shell);
  }

  setEnvironment(environment) {
    this.simulation.setEnvironment(environment);
  }

  addAtoms(symbol, count) {
    const atoms = this.simulation.addAtoms(symbol, count);
    this.sync();
    return atoms;
  }

  addWaterRecipe(count) {
    const atoms = this.simulation.addWaterRecipe(count);
    this.sync();
    return atoms;
  }

  clear() {
    this.simulation.clear();
    this.sync();
  }

  update(dt) {
    this.simulation.update(dt);
    this.sync();
  }

  getSummary() {
    return this.simulation.getSummary();
  }

  getSnapshot() {
    return this.simulation.getSnapshot();
  }

  sync() {
    const atomIds = new Set(this.simulation.atoms.map((atom) => atom.id));
    for (const [id, mesh] of this.atomMeshes.entries()) {
      if (!atomIds.has(id)) {
        this.group.remove(mesh);
        disposeMesh(mesh);
        this.atomMeshes.delete(id);
      }
    }

    for (const atom of this.simulation.atoms) {
      let mesh = this.atomMeshes.get(atom.id);
      if (!mesh) {
        mesh = makeAtomMesh(atom);
        this.atomMeshes.set(atom.id, mesh);
        this.group.add(mesh);
      }
      mesh.position.set(atom.position.x, atom.position.y, atom.position.z);
    }

    const bondIds = new Set(this.simulation.bonds.map((bond) => bond.id));
    for (const [id, mesh] of this.bondMeshes.entries()) {
      if (!bondIds.has(id)) {
        this.group.remove(mesh);
        disposeMesh(mesh);
        this.bondMeshes.delete(id);
      }
    }

    const atomsById = new Map(this.simulation.atoms.map((atom) => [atom.id, atom]));
    for (const bond of this.simulation.bonds) {
      let mesh = this.bondMeshes.get(bond.id);
      if (!mesh) {
        mesh = makeBondMesh(bond);
        this.bondMeshes.set(bond.id, mesh);
        this.group.add(mesh);
      }
      const start = atomsById.get(bond.a)?.position;
      const end = atomsById.get(bond.b)?.position;
      if (start && end) setCylinderBetween(mesh, start, end);
    }
  }

  dispose() {
    for (const mesh of this.atomMeshes.values()) disposeMesh(mesh);
    for (const mesh of this.bondMeshes.values()) disposeMesh(mesh);
    disposeMesh(this.shell);
    this.atomMeshes.clear();
    this.bondMeshes.clear();
  }
}
