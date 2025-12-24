export const ELEV_MAX = 3000;

export const TERRAIN_THRESHOLDS = {
  peak: 0.9 * ELEV_MAX,
  summit: 0.8 * ELEV_MAX,
  alpine: 0.6 * ELEV_MAX,
  boreal: 0.15 * ELEV_MAX,
  beach: 0.025 * ELEV_MAX,
};

export const SUMMIT_SEARCH = {
  step: 256,
  radius: 8000,
};

export const TREE_BAND = {
  min: 0.15 * ELEV_MAX,
  max: 0.6 * ELEV_MAX,
};
