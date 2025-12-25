// Simple CPU-side validation of element property derivation vs reference tables.
// Uses the same heuristics as the emergent phase model in shaders.

const ELEMENTS = [
  { key: "Hydrogen", melt: 14.0, boil: 20.3, rhoS: 0.086, rhoL: 0.071, rhoG: 0.000089, bulkS: 2.0, shearS: 0.1, bulkL: 0.02, viscL: 0.000009, gasR: 4124.0 },
  { key: "Oxygen", melt: 54.0, boil: 90.2, rhoS: 1.14, rhoL: 1.14, rhoG: 0.0014, bulkS: 0.9, shearS: 0.4, bulkL: 0.04, viscL: 0.00002, gasR: 259.8 },
  { key: "Sodium", melt: 371.0, boil: 1156.0, rhoS: 0.97, rhoL: 0.97, rhoG: 0.5, bulkS: 6.3, shearS: 2.8, bulkL: 2.0, viscL: 0.001, gasR: 100.0 },
  { key: "Potassium", melt: 336.5, boil: 1032.0, rhoS: 0.86, rhoL: 0.83, rhoG: 0.4, bulkS: 3.1, shearS: 1.3, bulkL: 1.0, viscL: 0.0008, gasR: 80.0 },
  { key: "Magnesium", melt: 923.0, boil: 1363.0, rhoS: 1.74, rhoL: 1.58, rhoG: 0.5, bulkS: 45.0, shearS: 17.0, bulkL: 18.0, viscL: 0.0015, gasR: 100.0 },
  { key: "Aluminum", melt: 933.0, boil: 2743.0, rhoS: 2.70, rhoL: 2.38, rhoG: 0.4, bulkS: 76.0, shearS: 26.0, bulkL: 16.0, viscL: 0.0013, gasR: 80.0 },
  { key: "Silicon", melt: 1687.0, boil: 3538.0, rhoS: 2.33, rhoL: 2.57, rhoG: 0.4, bulkS: 98.0, shearS: 31.0, bulkL: 35.0, viscL: 0.0007, gasR: 80.0 },
  { key: "Calcium", melt: 1115.0, boil: 1757.0, rhoS: 1.55, rhoL: 1.35, rhoG: 0.5, bulkS: 17.0, shearS: 7.5, bulkL: 9.0, viscL: 0.0015, gasR: 90.0 },
  { key: "Titanium", melt: 1941.0, boil: 3560.0, rhoS: 4.50, rhoL: 4.1, rhoG: 0.5, bulkS: 160.0, shearS: 74.0, bulkL: 25.0, viscL: 0.004, gasR: 100.0 },
  { key: "Iron", melt: 1811.0, boil: 3134.0, rhoS: 7.87, rhoL: 7.0, rhoG: 0.5, bulkS: 170.0, shearS: 82.0, bulkL: 80.0, viscL: 0.006, gasR: 100.0 },
  { key: "Lead", melt: 600.6, boil: 2022.0, rhoS: 11.34, rhoL: 10.66, rhoG: 0.5, bulkS: 46.0, shearS: 14.0, bulkL: 45.0, viscL: 0.004, gasR: 100.0 }
];

function deriveProps(elem, temp, ambientPressure = 1.0, dt = 0.1) {
  const deltaT = 10;
  const melt = elem.melt;
  const boil = elem.boil * Math.pow(ambientPressure, 0.07);
  const solid_w = Math.min(Math.max((melt - temp) / deltaT, 0), 1);
  const gas_w = Math.min(Math.max((temp - boil) / deltaT, 0), 1);
  const liquid_w = Math.min(Math.max(1 - solid_w - gas_w, 0), 1);
  const phase = solid_w > liquid_w && solid_w > gas_w ? "solid" : gas_w > liquid_w ? "gas" : "liquid";
  const restDensity = Math.max(
    solid_w * elem.rhoS + liquid_w * elem.rhoL + gas_w * Math.max(elem.rhoG, 1e-4),
    1e-4
  );
  const mu = elem.shearS * solid_w * Math.max(Math.min(0.1 / dt, 1), 0.1);
  const lambda =
    phase === "solid"
      ? elem.bulkS * solid_w * Math.max(Math.min(0.1 / dt, 1), 0.1)
      : phase === "liquid"
      ? elem.bulkL * liquid_w
      : elem.gasR * gas_w;
  return { phase, restDensity, mu, lambda, liquid_visc: elem.viscL * liquid_w, gasR: elem.gasR * gas_w };
}

function assertClose(name, val, ref, relTol, absTol = 0) {
  const diff = Math.abs(val - ref);
  if (diff > Math.max(Math.abs(ref) * relTol, absTol)) {
    throw new Error(`${name} out of bounds: got ${val}, expected ${ref} (tol ${relTol}, abs ${absTol})`);
  }
}

function run() {
  ELEMENTS.forEach((elem) => {
    // Solid check
    const s = deriveProps(elem, elem.melt - 20);
    if (elem.rhoS > 0.1) assertClose(`${elem.key} solid rho`, s.restDensity, elem.rhoS, 0.3);
    if (elem.shearS > 0.01) assertClose(`${elem.key} solid mu`, s.mu, elem.shearS, 0.5);
    // Liquid check (mid between melt/boil)
    const midT = (elem.melt + elem.boil) / 2;
    const l = deriveProps(elem, midT);
    if (elem.rhoL > 0.1) assertClose(`${elem.key} liquid rho`, l.restDensity, elem.rhoL, 0.3);
    if (elem.bulkL > 0.01) assertClose(`${elem.key} liquid bulk`, l.lambda, elem.bulkL, 0.5);
    // Gas check
    const g = deriveProps(elem, elem.boil + 50);
    assertClose(`${elem.key} gas rho`, g.restDensity, Math.max(elem.rhoG, 1e-4), 2.0, 1e-4);
    assertClose(`${elem.key} gas R`, g.gasR, elem.gasR, 0.5, 0);
  });
  console.log("Element validation passed");
}

run();
