import { pathToFileURL } from 'node:url';

const toSpecifier = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (raw.startsWith('/') || raw.startsWith('./') || raw.startsWith('../')) {
    return pathToFileURL(raw).href;
  }
  return raw;
};

export const loadPlaywright = async () => {
  const candidates = [
    'playwright',
    process.env.CHAOSLAB_PLAYWRIGHT_MODULE || ''
  ]
    .map(toSpecifier)
    .filter(Boolean);

  const attempts = [];
  for (const specifier of candidates) {
    try {
      const mod = await import(specifier);
      if (mod && mod.chromium && typeof mod.chromium.launch === 'function') {
        return { module: mod, resolvedSpecifier: specifier };
      }
      attempts.push(`${specifier}: module loaded but chromium launcher missing`);
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      attempts.push(`${specifier}: ${message}`);
    }
  }

  throw new Error(
    `Unable to load Playwright runtime. Attempts: ${attempts.join(' | ')}`
  );
};

