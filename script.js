/* ==========================================================================
   KNICKOSH FEDERIS PORTFOLIO - script.js
   - Smooth scrolling page with scroll-spy dock + progress bar
   - Reveal on scroll, loader, particles, cursor, tilt, magnetic buttons
   - Typing text, counters, skill tabs, theme switch, contact form
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  const EMAIL = 'knickoshfederis11@gmail.com';
  const sections = $$('.sec');
  const ids = sections.map(s => s.id);
  const labels = { home: 'Home', about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education', contact: 'Contact' };

  /* ---------------- Theme ---------------- */
  const themeBtn = $('#themeBtn'), themeMeta = $('meta[name="theme-color"]');
  function applyTheme(t, save) {
    root.dataset.theme = t;
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#07050f' : '#f7f4fe');
    if (save) store.set('kf-theme', t);
    bg.readColor();
  }
  themeBtn.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

  /* ---------------- Split text into animated words / letters ---------------- */
  function splitText() {
    $$('[data-split]').forEach(el => {
      const lines = $$('.name-line', el);
      let n = 0;
      const make = (txt, hide) => {
        const w = document.createElement('span'), i = document.createElement('span');
        w.className = 'word'; i.className = 'word-i';
        if (hide) w.setAttribute('aria-hidden', 'true');
        i.style.setProperty('--w', n++); i.textContent = txt;
        w.appendChild(i);
        return w;
      };
      if (lines.length) {
        lines.forEach(line => {
          const text = line.textContent.trim();
          line.textContent = '';
          Array.from(text).forEach(ch => line.appendChild(make(ch, false)));
        });
      } else {
        const text = el.textContent.trim();
        el.setAttribute('aria-label', text);
        el.textContent = '';
        text.split(/\s+/).forEach((word, idx, arr) => {
          el.appendChild(make(word, true));
          if (idx < arr.length - 1) el.appendChild(document.createTextNode(' '));
        });
      }
    });
  }

  /* ---------------- Particle network background ---------------- */
  const bg = (() => {
    const canvas = $('#bgCanvas'), ctx = canvas.getContext('2d');
    let w = 0, h = 0, pts = [], color = '139,92,246', raf = 0;
    const mouse = { x: -9999, y: -9999 };

    function readColor() {
      const c = getComputedStyle(root).getPropertyValue('--particle').trim();
      if (c) color = c;
      if (reduceMotion) draw();
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(40, Math.max(16, (w * h) / 28000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6
      }));
      if (reduceMotion) draw();
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const link = Math.min(140, w / 5);
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(${color},.6)`; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(${color},${(1 - d / link) * .28})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < 170) {
          ctx.strokeStyle = `rgba(${color},${(1 - md / 170) * .55})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    function step() {
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { p.x += (dx / d) * .8; p.y += (dy / d) * .8; }
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    const start = () => { if (!reduceMotion && !raf) raf = requestAnimationFrame(step); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    resize(); readColor(); start();
    return { readColor };
  })();

  /* Soft glow that follows the pointer */
  (function glow() {
    const el = $('#bgGlow');
    let tx = innerWidth * .7, ty = innerHeight * .3, x = tx, y = ty, running = false;
    function tick() {
      x += (tx - x) * .08; y += (ty - y) * .08;
      el.style.setProperty('--gx', x + 'px'); el.style.setProperty('--gy', y + 'px');
      if (Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) requestAnimationFrame(tick); else running = false;
    }
    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!running && !reduceMotion) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
  })();

  /* ---------------- Custom cursor (mouse only) ---------------- */
  (function cursor() {
    return; // custom cursor disabled for a cleaner, professional feel
    const ring = $('#cursor'), dot = $('#cursorDot');
    root.classList.add('has-cursor');
    let tx = 0, ty = 0, x = 0, y = 0, on = false;
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      if (!on) { on = true; x = tx; y = ty; ring.classList.add('is-on'); dot.classList.add('is-on'); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => { on = false; ring.classList.remove('is-on'); dot.classList.remove('is-on'); });
    (function loop() {
      x += (tx - x) * .18; y += (ty - y) * .18;
      ring.style.transform = `translate3d(${x}px,${y}px,0)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', e => {
      ring.classList.toggle('is-hover', !!e.target.closest('a, button, summary, [data-tilt], input, textarea'));
    });
  })();

  /* ---------------- 3D tilt + magnetic buttons ---------------- */
  function initInteractions() {
    if (reduceMotion) return;
    $$('[data-tilt]').forEach(el => {
      const strong = el.classList.contains('portrait-tilt');
      el.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', ((.5 - py) * (strong ? 14 : 8)).toFixed(2) + 'deg');
        el.style.setProperty('--ry', ((px - .5) * (strong ? 16 : 10)).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - (r.left + r.width / 2)) * .28).toFixed(1)}px ${((e.clientY - (r.top + r.height / 2)) * .36).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = '0 0'; });
    });
  }

  /* ---------------- Typing text (Home) ---------------- */
  (function typing() {
    const el = $('#typeWord');
    if (!el || reduceMotion) return;
    const words = el.dataset.words.split('|');
    let wi = 0, ci = words[0].length, deleting = false;
    function tick() {
      if (document.hidden) return setTimeout(tick, 600);
      const word = words[wi];
      if (!deleting) {
        ci++; el.textContent = word.slice(0, ci);
        if (ci >= word.length) { deleting = true; return setTimeout(tick, 1900); }
        return setTimeout(tick, 70);
      }
      ci--; el.textContent = word.slice(0, ci);
      if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 320); }
      setTimeout(tick, 34);
    }
    setTimeout(tick, 3200);
  })();

  /* ---------------- Count-up numbers ---------------- */
  function runCounters(scope) {
    $$('[data-count]', scope).forEach(el => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = Number(el.dataset.count) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const start = performance.now() + 400, dur = 1300;
      (function frame(now) {
        const t = Math.max(0, Math.min(1, (now - start) / dur));
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(frame);
      })(performance.now());
    });
  }

  /* ---------------- Sliding highlight (dock + tabs) ---------------- */
  function moveGlider(glider, target) {
    if (!target || !target.offsetWidth) return;
    glider.style.setProperty('--x', target.offsetLeft + 'px');
    glider.style.setProperty('--w', target.offsetWidth + 'px');
  }
  const dockGlider = $('#dockGlider'), dockLinks = $$('.dock-link');
  const tablist = $('.tablist'), tabGlider = $('.tab-glider');
  const tabs = $$('.tab'), panels = $$('.tabpanel');
  const refreshGliders = () => {
    moveGlider(dockGlider, $('.dock-link.is-active'));
    moveGlider(tabGlider, $('.tab.is-active'));
  };

  /* ---------------- Scroll navigation ---------------- */
  const pad = n => String(n).padStart(2, '0');
  const announcer = $('#announcer');
  let current = null, locked = false, lockTimer;

  function setActive(id) {
    if (id === current) return;
    current = id;
    dockLinks.forEach(a => {
      const on = a.dataset.nav === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    document.title = id === 'home' ? 'Knickosh Federis | Aspiring Web Developer' : labels[id] + ' | Knickosh Federis';
    announcer.textContent = labels[id] + ' section';
    if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
    refreshGliders();
  }

  function goTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    locked = true; setActive(id);
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { locked = false; }, 900);
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-nav]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goTo(a.dataset.nav);
  });

  // Scroll-spy: the section crossing the middle of the screen becomes active
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting && !locked) setActive(en.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  // Reveal on scroll
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      if (en.target.id === 'about') runCounters(en.target);
      reveal.unobserve(en.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  const watch = [...$$('[data-reveal]'), ...$$('[data-split]')];
  watch.forEach(el => reveal.observe(el));
  const counterWatch = new IntersectionObserver(en => {
    if (en[0].isIntersecting) { runCounters($('#about')); counterWatch.disconnect(); }
  }, { threshold: .3 });
  counterWatch.observe($('.stats'));

  // Progress bar + back-to-top (one rAF-throttled scroll handler)
  const progress = $('#progress'), toTop = $('#toTop');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const max = root.scrollHeight - innerHeight;
    progress.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
    toTop.classList.toggle('is-on', scrollY > innerHeight * .6);
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  toTop.addEventListener('click', () => goTo('home'));

  // Keyboard: arrows (when not typing) and 1-7 jump between sections
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input, textarea, select, [role="tab"], summary')) return;
    const i = ids.indexOf(current);
    if (e.key === 'ArrowRight' && i < ids.length - 1) goTo(ids[i + 1]);
    else if (e.key === 'ArrowLeft' && i > 0) goTo(ids[i - 1]);
    else if (/^[1-7]$/.test(e.key)) goTo(ids[Number(e.key) - 1]);
  });

  /* ---------------- Skill tabs ---------------- */
  function selectTab(tab, focus) {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(p => {
      const on = p.id === tab.getAttribute('aria-controls');
      p.hidden = !on;
      p.classList.toggle('is-active', on);
    });
    moveGlider(tabGlider, tab);
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      const map = { ArrowRight: tabs[(i + 1) % tabs.length], ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length], Home: tabs[0], End: tabs[tabs.length - 1] };
      if (map[e.key]) { e.preventDefault(); selectTab(map[e.key], true); }
    });
  });

  /* ---------------- Contact form ---------------- */
  (function form() {
    const f = $('#contactForm'), status = $('#formStatus');
    if (!f) return;
    const rules = {
      'f-name': v => v.trim().length >= 2 || 'Please enter your name.',
      'f-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email.',
      'f-msg': v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
    };
    function check(input) {
      const res = rules[input.id](input.value);
      const field = input.closest('.field');
      field.classList.toggle('is-invalid', res !== true);
      $('.err', field).textContent = res === true ? '' : res;
      input.setAttribute('aria-invalid', String(res !== true));
      return res === true;
    }
    const inputs = $$('input[id], textarea[id]', f).filter(i => rules[i.id]);
    inputs.forEach(i => i.addEventListener('input', () => { if (i.closest('.field').classList.contains('is-invalid')) check(i); }));
    f.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      const results = inputs.map(check);
      if (results.includes(false)) { inputs[results.indexOf(false)].focus(); return; }
      const btn = $('button[type="submit"]', f), label = $('span', btn), old = label.textContent;
      btn.disabled = true; label.textContent = 'Sending…';
      try {
        const res = await fetch(f.getAttribute('action'), { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        const data = await res.json();
        if (!res.ok || !(data.ok || data.success)) throw new Error('send failed');
        status.className = 'form-status is-ok';
        status.textContent = 'Thank you! Your message has been sent.';
        f.reset();
      } catch (err) {
        const href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Portfolio message from ' + $('#f-name').value.trim()) + '&body=' + encodeURIComponent($('#f-msg').value.trim());
        status.textContent = 'Could not send automatically. ';
        const a = document.createElement('a');
        a.href = href; a.textContent = 'Send it with your email app';
        status.appendChild(a);
      } finally {
        btn.disabled = false; label.textContent = old;
      }
    });
  })();

  /* ---------------- Projects side-scroll rail ---------------- */
  (function rail() {
    const track = $('#projectRail');
    if (!track) return;
    const cards = $$('.project', track), prev = $('#railPrev'), next = $('#railNext'), now = $('#railNow');
    $('#railTotal').textContent = pad(cards.length);
    function index() {
      const left = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
      let best = 0, d = Infinity;
      cards.forEach((c, i) => { const x = Math.abs(c.getBoundingClientRect().left - left); if (x < d) { d = x; best = i; } });
      return best;
    }
    function update() {
      const i = index(), end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      now.textContent = pad(end ? cards.length : i + 1);
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = end;
    }
    function move(dir) {
      const gap = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
      track.scrollBy({ left: dir * gap, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); move(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); move(-1); }
    });
    let t = 0;
    track.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(update); }, { passive: true });
    addEventListener('resize', update);
    update();
  })();

  $('#year').textContent = new Date().getFullYear();
  addEventListener('resize', refreshGliders);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshGliders);

  /* ---------------- Start: theme → split text → loader → first view ---------------- */
  applyTheme(store.get('kf-theme') === 'light' ? 'light' : 'dark', false);
  splitText();
  initInteractions();
  // re-observe split headings that were created after the first query
  $$('[data-split]').forEach(el => { if (!el.classList.contains('is-in')) reveal.observe(el); });

  const startId = ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
  setActive(startId);
  if (startId !== 'home') $('#' + startId).scrollIntoView({ block: 'start' });
  onScroll();

  (function loader() {
    const el = $('#loader'), bar = $('#loaderBar'), pct = $('#loaderPct');
    const finish = () => {
      el.classList.add('is-done');
      root.classList.remove('is-booting');
      setTimeout(() => el.remove(), 1100);
    };
    if (reduceMotion) { finish(); return; }
    let ready = false;
    const loaded = new Promise(res => { document.readyState === 'complete' ? res() : addEventListener('load', res, { once: true }); });
    Promise.all([loaded, document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()]).then(() => { ready = true; });
    setTimeout(() => { ready = true; }, 4000);
    const t0 = performance.now(), min = 1500;
    let shown = 0;
    (function tick(now) {
      const t = Math.min(1, (now - t0) / min);
      let target = 100 * (1 - Math.pow(1 - t, 2.2));
      if (!ready) target = Math.min(target, 92);
      shown += (target - shown) * .25;
      const v = Math.min(100, Math.round(shown + .4));
      bar.style.width = v + '%'; pct.textContent = v;
      if (ready && t >= 1 && v >= 100) { setTimeout(finish, 220); return; }
      requestAnimationFrame(tick);
    })(t0);
  })();
})();