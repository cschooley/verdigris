// ---- shared mockup chrome: theme, launcher, e-stop, meter, rail keys ----
(function () {
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable: in-memory only */ } }
  };
  const $ = (id) => document.getElementById(id);

  // theme: metal (rust | blued) x mode (dark | light)
  const theme = Object.assign({ metal: 'rust', light: false }, store.get('vg-theme', {}));
  const q = new URLSearchParams(location.search).get('theme');
  if (q) { theme.metal = q.startsWith('blued') ? 'blued' : 'rust'; theme.light = q.endsWith('-light'); }
  function applyTheme() {
    const name = theme.metal + (theme.light ? '-light' : '');
    if (name === 'rust') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', name);
    document.querySelectorAll('[data-metal]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.metal === theme.metal)));
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.mode === 'light') === theme.light)));
    if ($('themeName')) $('themeName').textContent = 'theme ' + name;
    store.set('vg-theme', { metal: theme.metal, light: theme.light });
  }
  document.querySelectorAll('[data-metal]').forEach(b => b.onclick = () => { theme.metal = b.dataset.metal; applyTheme(); });
  document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { theme.light = b.dataset.mode === 'light'; applyTheme(); });
  applyTheme();

  // launcher
  $('launchBtn').onclick = (e) => { e.stopPropagation(); $('launch').classList.toggle('open'); };
  document.addEventListener('click', e => { if (!$('launch').contains(e.target)) $('launch').classList.remove('open'); });

  // e-stop
  function setHalted(on) {
    document.body.classList.toggle('halted', on);
    $('estopLabel').textContent = on ? 'AGENT HALTED · RESUME' : 'STOP AGENT';
    store.set('vg-halted', on);
    window.dispatchEvent(new CustomEvent('vg-halted', { detail: on }));
  }
  $('estop').onclick = () => setHalted(!document.body.classList.contains('halted'));
  document.querySelectorAll('[data-resume]').forEach(b => b.onclick = () => setHalted(false));
  const hq = new URLSearchParams(location.search).get('halted');
  if (hq !== null ? hq === '1' : store.get('vg-halted', false)) setHalted(true);

  // request-rate meter: pages call window.vgPulse() per request; ambient pulses otherwise
  const segs = $('segs'); for (let i = 0; i < 10; i++) segs.appendChild(document.createElement('i'));
  let recent = [];
  window.vgPulse = () => recent.push(Date.now());
  setInterval(() => {
    const now = Date.now(); recent = recent.filter(x => now - x < 5000);
    const r = recent.length / 5; $('rate').textContent = r.toFixed(1);
    [...segs.children].forEach((s, i) => s.classList.toggle('on', i < Math.round(r * 2.5)));
  }, 500);
  if (!window.vgOwnTraffic) (function amb() { window.vgPulse(); setTimeout(amb, (300 + Math.random() * 600) / (window.vgQuad ? 4 : 1)); })();

  // keys: t theme, 1-5 views, Shift+Esc e-stop
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'Escape' && e.shiftKey) { setHalted(!document.body.classList.contains('halted')); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 't') { theme.light = !theme.light; applyTheme(); }
    const link = document.querySelector(`.rail a[data-key="${e.key}"]`);
    if (link && !link.classList.contains('todo')) location.href = link.getAttribute('href');
  });

  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));
})();
/*PARTIAL:console.js*/
