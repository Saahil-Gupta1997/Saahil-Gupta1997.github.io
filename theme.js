(() => {
  'use strict';
  const root = document.documentElement;
  const storageKey = 'saahil-portfolio-theme';
  const query = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let preference = 'system';
  try {
    const saved = localStorage.getItem(storageKey);
    if (['light', 'dark', 'system'].includes(saved)) preference = saved;
  } catch (_) { /* Device preference still works without local storage. */ }
  function paint() {
    root.dataset.theme = preference === 'system' ? (query && query.matches ? 'dark' : 'light') : preference;
    root.dataset.themePreference = preference;
  }
  window.portfolioTheme = {
    get preference() { return preference; },
    set(value) {
      if (!['light', 'dark', 'system'].includes(value)) return;
      preference = value;
      try { localStorage.setItem(storageKey, value); } catch (_) { /* Selection works for this visit. */ }
      paint();
    }
  };
  if (query && query.addEventListener) query.addEventListener('change', () => { if (preference === 'system') paint(); });
  else if (query && query.addListener) query.addListener(() => { if (preference === 'system') paint(); });
  paint();
})();
