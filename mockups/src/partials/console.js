// ---- ~ console + quad mode (mockup) ----
(function () {
  const $ = (id) => document.getElementById(id);
  const con = $('console'), log = $('conLog'), input = $('conInput');
  const hist = []; let hi = 0;

  let unread = 0;
  function badge() {
    let b = document.getElementById('conUnread');
    const f = document.querySelector('footer');
    if (!b && f) { b = document.createElement('span'); b.id = 'conUnread'; b.className = 'con-unread'; b.title = 'New console messages (press `)'; b.onclick = () => open(true); f.insertBefore(b, f.children[2] || null); }
    if (b) { b.textContent = '` ' + unread; b.style.display = unread ? '' : 'none'; }
  }
  function line(text, cls) {
    if (!con.classList.contains('open') && cls && cls !== 'cmd' && booted) { unread++; badge(); }
    const d = document.createElement('div');
    d.className = 'l-' + (cls || 'out');
    d.textContent = text;              // text only: console output is never HTML
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  window.vgConsoleLine = line;

  function open(on) {
    const want = on === undefined ? !con.classList.contains('open') : on;
    con.classList.toggle('open', want);
    con.setAttribute('aria-hidden', String(!want));
    if (want) { unread = 0; badge(); setTimeout(() => input.focus(), 0); } else input.blur();
  }
  let booted = false;

  // ---------- quad ----------
  const LIMIT = 5, BASE = 2;           // engagement ceiling and normal agent rate (req/s)
  let quadEnd = 0, quadTimer = null, quadStart = 0, quadReqs = 0;
  const basePulse = window.vgPulse;
  window.vgPulse = () => { if (window.vgQuad) quadReqs++; basePulse && basePulse(); };
  window.vgQuad = false;
  function quadTick() {
    const left = Math.max(0, Math.round((quadEnd - Date.now()) / 1000));
    $('quadT').textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
    if (left <= 0) endQuad('wore off');
  }
  function startQuad(secs) {
    if (document.body.classList.contains('halted')) { line('quad: agent is halted. resume first.', 'stop'); return; }
    const want = BASE * 4, got = Math.min(want, LIMIT);
    window.vgQuad = true; document.body.classList.add('quad');
    quadStart = Date.now(); quadReqs = 0; quadEnd = Date.now() + secs * 1000; clearInterval(quadTimer); quadTimer = setInterval(quadTick, 250); quadTick();
    line(`QUAD DAMAGE  4 workers, ${secs}s`, 'quad');
    if (got < want) line(`rate ${want} req/s capped at engagement limit ${LIMIT} req/s`, 'warn');
    line('counts against task budgets · e-stop ends it · logged to task T-3', 'sys');
  }
  function endQuad(why) {
    if (!window.vgQuad) return;
    window.vgQuad = false; document.body.classList.remove('quad'); clearInterval(quadTimer);
    line(`quad ${why}. back to ${BASE} req/s.`, why === 'ended by e-stop' ? 'stop' : 'sys');
    const secs = Math.round((Date.now() - quadStart) / 1000);
    line(`── QUAD SCORECARD ─ ${secs}s · ${quadReqs} requests · ~${(quadReqs * 1900 / 1000).toFixed(1)}k agent tokens · 1 candidate`, 'quad');
    line('quad card copied (redacted: no hosts, paths or payloads)', 'sys');
  }
  window.addEventListener('vg-halted', e => { if (e.detail) endQuad('ended by e-stop'); });

  // ---------- commands (one registry: palette, console and MCP share these names) ----------
  const views = { engagement: null, traffic: 'spall-console.html', surface: null, tasks: 'spall-tasks.html', findings: 'spall-findings.html' };
  const cmds = {
    help: { usage: 'help', run: () => Object.entries(cmds).filter(([, c]) => c.desc !== undefined).forEach(([, c]) => line(`  ${c.usage.padEnd(30)} ${c.desc}`)), desc: 'this list' },
    clear: { usage: 'clear', desc: 'clear the console', run: () => { log.textContent = ''; } },
    quad: { usage: 'quad [seconds]', desc: '4x agent workers, time-boxed', run: (a) => {
      if (a[0] === 'off') return endQuad('cancelled');
      const s = Math.min(600, Math.max(10, parseInt(a[0] || '120', 10) || 120)); startQuad(s); } },
    halt: { usage: 'halt', desc: 'e-stop: halt all agent tasks', run: () => { if (!document.body.classList.contains('halted')) $('estop').click(); line('all agent tasks halted.', 'stop'); } },
    resume: { usage: 'resume', desc: 'resume agent tasks', run: () => { if (document.body.classList.contains('halted')) $('estop').click(); line('agent tasks resumed.', 'sys'); } },
    goto: { usage: 'goto <view>', desc: 'traffic | tasks | findings', run: (a) => {
      const v = views[a[0]]; if (v) location.href = v; else line(`no such view: ${a[0] || ''}. try: ${Object.keys(views).join(' | ')}`, 'warn'); } },
    theme: { usage: 'theme <name>', desc: 'rust | blued | rust-light | blued-light', run: (a) => {
      const n = a[0] || ''; const metal = n.startsWith('blued') ? 'blued' : n.startsWith('rust') ? 'rust' : null;
      if (!metal) return line('theme: rust | blued | rust-light | blued-light', 'warn');
      document.querySelector(`[data-metal="${metal}"]`).click();
      document.querySelector(`[data-mode="${n.endsWith('-light') ? 'light' : 'dark'}"]`).click();
      line('theme ' + n, 'sys'); } },
    replay: { usage: 'replay <id> [--header H:V]', desc: 'resend an exchange', run: (a) => {
      if (!a[0]) return line('replay: need an exchange id', 'warn');
      line(`replay ${a[0]} → 401 Unauthorized in 171 ms (same as original)`); line('recorded as 01JD8RB2…4E7, linked to original', 'sys'); } },
    tasks: { usage: 'tasks', desc: 'list agent tasks', run: () => {
      ['T-3  running   auth bypass on POST /api/v2/session   142/300',
       'T-4  waiting   IDOR sweep on /v1/cart/{id}            40/200  (needs approval)',
       'T-2  done      map /v1 API surface                   124/200',
       'T-1  done      security headers check                  9/100'].forEach(t => line(t)); } },
    god: { usage: 'god', desc: '', run: () => line('no.') },
  };
  delete cmds.god.desc; // undocumented on purpose

  function exec(raw) {
    const text = raw.trim(); if (!text) return;
    line(text, 'cmd'); hist.push(text); hi = hist.length;
    const [name, ...args] = text.split(/\s+/);
    const c = cmds[name];
    if (!c) return line(`unknown command: ${name}. try help`, 'warn');
    c.run(args);
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { exec(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { if (hi > 0) input.value = hist[--hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const m = Object.keys(cmds).filter(k => k.startsWith(input.value.trim()) && k !== 'god');
      if (m.length === 1) input.value = m[0] + ' '; else if (m.length) line(m.join('  '), 'sys');
    }
    else if (e.key === '`' || e.key === '~' || e.key === 'Escape') { e.preventDefault(); open(false); }
  });
  document.addEventListener('keydown', e => {
    if (e.target === input || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === '`' || e.key === '~') { e.preventDefault(); open(); }
  });

  window.vgCmds = cmds; window.vgExec = exec;
  window.vgOpenConsole = (prefill) => { open(true); if (prefill !== undefined) { input.value = prefill; setTimeout(() => { input.focus(); input.setSelectionRange(prefill.length, prefill.length); }, 0); } };
  line('spall console · type help', 'sys');
  line('agent T-3: session fixation confirmed with second account, candidate proposed', 'agent');
  line('oob: late DNS callback on a7f3.oast.example.net (exchange 01JD8N7A…E02, 41 min after send)', 'sys');

  booted = true;
  // a late event arriving while the console is closed: shows the unread count
  setTimeout(() => line('oob: HTTP callback on c19e.oast.example.net from 10.20.4.17 (exchange 01JD8Q41…A10)', 'sys'), 6000);
  // ?console=1 and ?quad=1 for screenshots
  const q = new URLSearchParams(location.search);
  if (q.get('console') === '1') { open(true); if (q.get('demo') === '1') ['help', 'quad 120'].forEach(exec); }
  if (q.get('quad') === '1' && q.get('demo') !== '1') startQuad(120);
})();
