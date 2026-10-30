// Apply the selected theme before the first paint; storage can be unavailable.
(() => {
  let saved;
  try { saved = localStorage.getItem('lorz-theme'); } catch {}
  const dark = saved === 'dark' || (saved !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();
