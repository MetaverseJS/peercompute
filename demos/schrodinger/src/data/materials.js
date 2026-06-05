export const MATERIALS = [
  { id: 'water', label: 'Water H2O', formula: 'H2O', model: 'water.reference-eos-v0', meltingK: 273.15, boilingK: 373.15 },
  { id: 'hydrogen', label: 'Hydrogen H2', formula: 'H2', model: 'gas.reference-table-v0', meltingK: 13.99, boilingK: 20.27, molarMassKgMol: 0.002016, refractiveIndexGas: 1.000132, dielectricGas: 1.00026 },
  { id: 'oxygen', label: 'Oxygen O2', formula: 'O2', model: 'gas.reference-table-v0', meltingK: 54.36, boilingK: 90.19, molarMassKgMol: 0.031998, refractiveIndexGas: 1.000271, dielectricGas: 1.00049 },
  { id: 'nitrogen', label: 'Nitrogen N2', formula: 'N2', model: 'gas.reference-table-v0', meltingK: 63.15, boilingK: 77.36, molarMassKgMol: 0.028014, refractiveIndexGas: 1.000298, dielectricGas: 1.00058 },
  { id: 'carbon-dioxide', label: 'Carbon dioxide CO2', formula: 'CO2', model: 'gas.reference-table-v0', meltingK: 216.58, boilingK: 194.67, molarMassKgMol: 0.04401, refractiveIndexGas: 1.00045, dielectricGas: 1.00098 },
  { id: 'methane', label: 'Methane CH4', formula: 'CH4', model: 'gas.reference-table-v0', meltingK: 90.69, boilingK: 111.66, molarMassKgMol: 0.01604, refractiveIndexGas: 1.000444, dielectricGas: 1.00094 },
  { id: 'ammonia', label: 'Ammonia NH3', formula: 'NH3', model: 'polar-fluid.reference-table-v0', meltingK: 195.42, boilingK: 239.82, molarMassKgMol: 0.017031, refractiveIndexGas: 1.000376, dielectricGas: 1.007 },
  { id: 'sodium-chloride', label: 'Sodium chloride NaCl', formula: 'NaCl', model: 'ionic-solid.reference-table-v0', meltingK: 1074, boilingK: 1738, densitySolidKgM3: 2160, refractiveIndexSolid: 1.544, youngsModulusPa: 4.0e10, bulkModulusPa: 2.5e10 }
];

export const getMaterialById = (id) => MATERIALS.find((material) => material.id === id) || MATERIALS[0];
