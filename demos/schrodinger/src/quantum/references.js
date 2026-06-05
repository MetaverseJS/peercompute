export const ELECTRON_MASS_KG = 9.1093837015e-31;
export const PLANCK_REDUCED_JS = 1.054571817e-34;
export const ELEMENTARY_CHARGE_C = 1.602176634e-19;
export const HARTREE_EV = 27.211386245988;
export const RYDBERG_EV = HARTREE_EV / 2;

export const hydrogenicEnergyEv = ({ n = 1, zEff = 1 } = {}) => {
  if (n < 1) throw new Error('n must be >= 1');
  return -RYDBERG_EV * zEff * zEff / (n * n);
};

export const particleInBoxEnergyEv = ({ n = 1, lengthNm = 1, massKg = ELECTRON_MASS_KG } = {}) => {
  if (n < 1) throw new Error('n must be >= 1');
  if (lengthNm <= 0) throw new Error('lengthNm must be positive');
  const lengthM = lengthNm * 1e-9;
  const joules = (n * n * Math.PI * Math.PI * PLANCK_REDUCED_JS * PLANCK_REDUCED_JS) /
    (2 * massKg * lengthM * lengthM);
  return joules / ELEMENTARY_CHARGE_C;
};

export const harmonicOscillatorEnergyEv = ({ level = 0, omega = 1e15 } = {}) => {
  if (level < 0) throw new Error('level must be >= 0');
  if (omega <= 0) throw new Error('omega must be positive');
  return ((level + 0.5) * PLANCK_REDUCED_JS * omega) / ELEMENTARY_CHARGE_C;
};

export const estimateOrbitalExtentBohr = ({ n = 1, zEff = 1, scale = 4.5 } = {}) => {
  const safeZ = Math.max(0.25, zEff);
  return Math.max(2, scale * n * n / safeZ);
};
