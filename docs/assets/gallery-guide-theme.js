// The shell resolves custom and catalogue themes to the same RGB palette.
// Mirror the resolved colors so standalone guides can follow an open desktop.
const key = 'peercompute.guide.palette.v1';
const roles = ['background', 'surface', 'text', 'accent', 'muted', 'border'];
const color = triplet => '#' + triplet.map(n => n.toString(16).padStart(2, '0')).join('');

function apply(palette) {
  if (!palette || !roles.every(role => /^#[\da-f]{6}$/i.test(palette[role]))) return false;
  const style = document.documentElement.style;
  for (const role of roles) style.setProperty('--guide-' + role, palette[role]);
  const [r, g, b] = palette.background.slice(1).match(/../g).map(s => parseInt(s, 16));
  style.setProperty('--guide-scheme', (r * 299 + g * 587 + b * 114) / 1000 > 145 ? 'light' : 'dark');
  return true;
}

export function syncGuideTheme(theme) {
  const palette = Object.fromEntries(roles.map(role => [role, color(theme[role])]));
  apply(palette);
  try { localStorage.setItem(key, JSON.stringify(palette)); } catch { /* Private storage can be unavailable. */ }
}

// Reading an old desktop preference must never create a new empty database
// before ExoWebTUI has a chance to create its desktop store.
async function savedThemeId() {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('peercompute-demo-atlas');
    request.onupgradeneeded = () => request.transaction.abort();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
  try {
    if (!db.objectStoreNames.contains('desktop')) return;
    return await new Promise((resolve, reject) => {
      const request = db.transaction('desktop').objectStore('desktop').get('settings');
      request.onsuccess = () => resolve(request.result?.themeId);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}

if (document.body?.classList.contains('pc-guide')) {
  let generation = 0;
  async function restore() {
    const current = ++generation;
    try { if (apply(JSON.parse(localStorage.getItem(key)))) return; } catch { /* Try desktop storage instead. */ }
    try {
      const id = await savedThemeId().catch(() => undefined);
      const response = await fetch(new URL('./gallery-guide-themes.json', import.meta.url));
      if (!response.ok) return;
      const themes = await response.json();
      if (current === generation) apply(themes[id] || themes.section9);
    } catch { /* The static guide remains readable offline and with restricted storage. */ }
  }
  restore();
  window.addEventListener('pageshow', event => { if (event.persisted) restore(); });
  window.addEventListener('storage', event => { if (event.key === key || !event.key) restore(); });
}
