// ---- command palette (Ctrl/Cmd+K) and shortcut sheet (?) ----
(function () {
  const $ = (id) => document.getElementById(id);
  const isMac = /Mac|iPhone|iPad/.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '');
  const MOD = isMac ? '⌘' : 'Ctrl';
  document.querySelectorAll('.modk').forEach(k => k.textContent = isMac ? '⌘K' : 'Ctrl K');

  const pal = $('palette'), pin = $('palInput'), plist = $('palList');
  const view = document.body.dataset.view;
  const items = [
    { grp: 'view', label: 'Go to Traffic', hint: '2', run: () => location.href = 'spall-console.html' },
    { grp: 'view', label: 'Go to Tasks', hint: '4', run: () => location.href = 'spall-tasks.html' },
    { grp: 'view', label: 'Go to Findings', hint: '5', run: () => location.href = 'spall-findings.html' },
    { grp: 'agent', label: 'Quad damage (2 min)', hint: 'quad', run: () => window.vgExec('quad 120') },
    { grp: 'agent', label: 'Halt all agent tasks', hint: 'Shift Esc', run: () => window.vgExec('halt') },
    { grp: 'agent', label: 'Resume agent tasks', hint: 'resume', run: () => window.vgExec('resume') },
    { grp: 'agent', label: 'List tasks', hint: 'tasks', run: () => { window.vgOpenConsole(); window.vgExec('tasks'); } },
    { grp: 'traffic', label: 'Replay exchange…', hint: 'replay <id>', run: () => window.vgOpenConsole('replay ') },
    { grp: 'app', label: 'Open console', hint: '`', run: () => window.vgOpenConsole() },
    { grp: 'app', label: 'Toggle light / dark', hint: 't', run: () => document.querySelector(`[data-mode="${document.documentElement.getAttribute('data-theme')?.endsWith('-light') ? 'dark' : 'light'}"]`).click() },
    { grp: 'app', label: 'Theme: Blued', hint: 'theme blued', run: () => window.vgExec('theme blued') },
    { grp: 'app', label: 'Theme: Rust', hint: 'theme rust', run: () => window.vgExec('theme rust') },
    { grp: 'app', label: 'Keyboard shortcuts', hint: '?', run: () => openKeys(true) },
  ];
  let shown = [], sel = 0;
  const score = (q, s) => { q = q.toLowerCase(); s = s.toLowerCase(); let i = 0; for (const ch of s) if (ch === q[i]) i++; return i === q.length; };
  function render() {
    const q = pin.value.trim();
    shown = items.filter(it => !q || score(q, it.label + ' ' + it.hint + ' ' + it.grp));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    plist.textContent = '';
    if (!shown.length) { const li = document.createElement('li'); li.className = 'none'; li.textContent = 'No match. The console takes any command: press `'; plist.appendChild(li); return; }
    shown.forEach((it, i) => {
      const li = document.createElement('li'); li.className = i === sel ? 'on' : ''; li.setAttribute('role', 'option');
      const g = document.createElement('span'); g.className = 'grp'; g.textContent = it.grp;
      const l = document.createElement('span'); l.textContent = it.label;
      const h = document.createElement('span'); h.className = 'hint'; h.textContent = it.hint;
      li.append(g, l, h); li.onmouseenter = () => { sel = i; mark(); }; li.onclick = () => go(i);
      plist.appendChild(li);
    });
  }
  const mark = () => [...plist.children].forEach((li, i) => li.classList.toggle('on', i === sel));
  function openPal(on) { pal.hidden = !on; if (on) { pin.value = ''; sel = 0; render(); setTimeout(() => pin.focus(), 0); } }
  function go(i) { const it = shown[i]; openPal(false); if (it) it.run(); }
  pin.addEventListener('input', () => { sel = 0; render(); });
  pin.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); mark(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); mark(); e.preventDefault(); }
    else if (e.key === 'Enter') { go(sel); }
    else if (e.key === 'Escape') { openPal(false); }
  });
  pal.addEventListener('mousedown', e => { if (e.target === pal) openPal(false); });

  // shortcut sheet, with the right modifier for this platform
  const keys = $('keys');
  const global = [[`${MOD} K`, 'Command palette'], ['`', 'Console'], ['?', 'This sheet'], ['1 – 5', 'Switch view'], ['t', 'Light / dark'], ['Shift Esc', 'Halt all agent tasks']];
  const perView = { traffic: [['/', 'Filter'], ['j  k', 'Next / previous row'], ['⏎', 'Replay'], ['f', 'Flag candidate'], ['a', 'Task agent'], ['x', 'Hex view (binary)']],
                    tasks: [['n', 'New task'], ['j  k', 'Next / previous task']],
                    findings: [['j  k', 'Next / previous'], ['c', 'Confirm'], ['r', 'Reject (needs reason)'], ['d', 'Duplicate (needs reason)'], ['e', 'Export flux']] };
  function fill(dl, rows) { dl.textContent = ''; rows.forEach(([k, d]) => { const dt = document.createElement('dt'); k.split(/\s+/).forEach(p => { const kb = document.createElement('kbd'); kb.textContent = p; dt.append(kb, ' '); }); const dd = document.createElement('dd'); dd.textContent = d; dl.append(dt, dd); }); }
  fill($('keysGlobal'), global); fill($('keysView'), perView[view] || []);
  function openKeys(on) { keys.hidden = !on; }
  keys.addEventListener('mousedown', e => { if (e.target === keys) openKeys(false); });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault(); e.stopPropagation(); openPal(pal.hidden); return;   // keep Ctrl+K from reaching the browser
    }
    if (e.key === 'Escape' && !keys.hidden) { openKeys(false); return; }
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === '?') { e.preventDefault(); openKeys(keys.hidden); }
  }, true);

  const q = new URLSearchParams(location.search);
  if (q.get('palette') === '1') openPal(true);
  if (q.get('keys') === '1') openKeys(true);
})();
