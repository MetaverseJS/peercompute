export const DEFAULT_WORLD_THEME = 'tron';
export const WORLD_THEME_NAMESPACE = 'world';
export const WORLD_THEME_KEY = 'theme';

export const WORLD_THEMES = [
  { id: 'tron', label: 'Tron' },
  { id: 'moon', label: 'Moon' },
  { id: 'beach', label: 'Beach' },
  { id: 'desert', label: 'Desert' },
  { id: 'jungle', label: 'Jungle' },
  { id: 'hyperborea', label: 'Hyperborea' },
  { id: 'ireland', label: 'Ireland' }
];

const WORLD_THEME_IDS = new Set(WORLD_THEMES.map((theme) => theme.id));

export const normalizeWorldTheme = (value) => {
  const id = String(value || '').trim().toLowerCase();
  return WORLD_THEME_IDS.has(id) ? id : DEFAULT_WORLD_THEME;
};

export const getWorldThemeLabel = (value) => {
  const id = normalizeWorldTheme(value);
  return WORLD_THEMES.find((theme) => theme.id === id)?.label || 'Tron';
};
