/* SIGNAL — motion engine. Progressive enhancement only:
   the page is fully readable WITHOUT this file (html.no-js shows everything,
   and a 3s failsafe in <head> adds html.reveal-all if this never boots).
   Every module is isolated; any failure degrades to the static page. */
(function () {
  'use strict';

  var d = document.documentElement;
  d.classList.add('booted'); // cancels the <head> reveal-all failsafe

  var reduce = false;
  try {
    reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduce = false; }

  var fine = false;
  try {
    fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  } catch (e) { fine = false; }

  /* ---------- failsafe: reveal absolutely everything ---------- */
  function showAll() {
    var i, els = document.querySelectorAll('.reveal');
    for (i = 0; i < els.length; i++) { els[i].classList.add('in'); }
    els = document.querySelectorAll('.cs-row');
    for (i = 0; i < els.length; i++) { els[i].classList.add('passed'); }
    var c = document.querySelector('[data-case]');
    if (c) { c.classList.add('stamped'); }
    d.classList.add('reveal-all');
  }

  /* ---------- intro: hand back the stage ---------- */
  try {
    if (d.classList.contains('intro-live')) {
      var endIntro = function () { d.classList.remove('intro-live'); };
      setTimeout(endIntro, 1850);                       // normal end (CSS exit anim finishes ~1.8s)
      window.addEventListener('keydown', endIntro, { once: true });
      window.addEventListener('pointerdown', endIntro, { once: true });
    }
  } catch (e) { d.classList.remove('intro-live'); }

  /* ---------- reduced motion: the page at rest, fully visible ---------- */
  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
    initClock();
    initClipboard();
    return;
  }

  /* ---------- quote: split into words for the staggered rise ---------- */
  try {
    var q = document.querySelector('[data-words]');
    if (q) {
      var words = q.textContent.split(' ');
      q.textContent = '';
      for (var wi = 0; wi < words.length; wi++) {
        var w = document.createElement('span');
        w.className = 'w';
        var win = document.createElement('span');
        win.className = 'w-in';
        win.style.setProperty('--wi', wi);
        win.textContent = words[wi];
        w.appendChild(win);
        q.appendChild(w);
        if (wi < words.length - 1) { q.appendChild(document.createTextNode(' ')); }
      }
    }
  } catch (e) { /* unsplit quote stays plain text — fine */ }

  /* ---------- reveals (staggered within each parent) ---------- */
  try {
    var revealEls = document.querySelectorAll('.reveal');
    var perParent = [];
    for (var r = 0; r < revealEls.length; r++) {
      var p = revealEls[r].parentNode;
      var idx = perParent.indexOf(p);
      if (idx === -1) { perParent.push(p); idx = perParent.length - 1; revealEls[r].__i = 0; perParent[idx].__n = 1; }
      else { revealEls[r].__i = Math.min(p.__n || 0, 5); p.__n = (p.__n || 0) + 1; }
      revealEls[r].style.setProperty('--i', revealEls[r].__i);
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('in');
          io.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    for (var j = 0; j < revealEls.length; j++) { io.observe(revealEls[j]); }
  } catch (e) { showAll(); }

  /* ---------- decision record: station nodes + the stamp ---------- */
  try {
    var caseEl = document.querySelector('[data-case]');
    var rows = document.querySelectorAll('.cs-row');
    if (rows.length) {
      var ioCs = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('passed');
            if (caseEl && entries[i].target.hasAttribute('data-stamp-trigger')) {
              caseEl.classList.add('stamped');
            }
            ioCs.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.55 });
      for (var k = 0; k < rows.length; k++) { ioCs.observe(rows[k]); }
    }
  } catch (e) { /* nodes stay hollow; copy is unaffected */ }

  /* ---------- counters (odometer count-ups) ---------- */
  try {
    var counters = document.querySelectorAll('[data-count]');
    var ioC = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          runCount(entries[i].target);
          ioC.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.6 });
    for (var c2 = 0; c2 < counters.length; c2++) { ioC.observe(counters[c2]); }
  } catch (e) { /* static numbers remain */ }

  function runCount(el) {
    try {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (!isFinite(target)) { return; }
      var t0 = null, dur = 900;
      function tick(ts) {
        if (!t0) { t0 = ts; }
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) { requestAnimationFrame(tick); } else { el.textContent = String(target); }
      }
      requestAnimationFrame(tick);
    } catch (e) { el.textContent = el.getAttribute('data-count'); }
  }

  /* ---------- rail: active section ---------- */
  try {
    var railLinks = document.querySelectorAll('[data-rail]');
    if (railLinks.length) {
      var byId = {};
      for (var rl = 0; rl < railLinks.length; rl++) { byId[railLinks[rl].getAttribute('data-rail')] = railLinks[rl]; }
      var ioR = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var link = byId[entries[i].target.id];
          if (!link) { continue; }
          if (entries[i].isIntersecting) {
            for (var n = 0; n < railLinks.length; n++) { railLinks[n].classList.remove('active'); }
            link.classList.add('active');
          }
        }
      }, { rootMargin: '-40% 0px -52% 0px', threshold: 0 });
      var secs = document.querySelectorAll('main section[id]');
      for (var s = 0; s < secs.length; s++) { ioR.observe(secs[s]); }
    }
  } catch (e) { /* rail just doesn't highlight */ }

  /* ---------- the scroll loop: progress · parallax · spine · 48h bar · marquee ---------- */
  try {
    var progressEl = document.querySelector('[data-progress]');
    var paraEls = document.querySelectorAll('[data-parallax]');
    var spineEl = document.querySelector('[data-spine]');
    var spineBody = spineEl ? spineEl.closest('.case-body') : null;
    var gjFill = document.querySelector('[data-gjfill]');
    var gjHrs = document.querySelector('[data-gjhrs]');
    var gjBlock = gjFill ? gjFill.closest('.feature') : null;
    var mqTrack = document.querySelector('[data-mq-track]');
    var mqAnim = null;
    if (mqTrack && mqTrack.getAnimations) {
      var anims = mqTrack.getAnimations();
      if (anims && anims.length) { mqAnim = anims[0]; }
    }

    var lastY = window.scrollY || 0;
    var velo = 0;
    var running = true;

    function frame() {
      if (!running) { return; }
      var y = window.scrollY || 0;
      var vh = window.innerHeight || 1;
      var doc = document.documentElement.scrollHeight - vh;

      if (progressEl) {
        progressEl.style.transform = 'scaleX(' + (doc > 0 ? Math.min(y / doc, 1) : 0) + ')';
      }

      for (var i = 0; i < paraEls.length; i++) {
        var el = paraEls[i];
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > vh + 80) { continue; }
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var off = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = 'translateY(' + (-off).toFixed(1) + 'px)';
      }

      if (spineEl && spineBody) {
        var sr = spineBody.getBoundingClientRect();
        var sp = (vh * 0.8 - sr.top) / sr.height;
        spineEl.style.transform = 'scaleY(' + Math.max(0, Math.min(sp, 1)).toFixed(3) + ')';
      }

      if (gjFill && gjBlock) {
        var gr = gjBlock.getBoundingClientRect();
        var gp = (vh * 0.85 - gr.top) / (gr.height * 0.9);
        gp = Math.max(0, Math.min(gp, 1));
        gjFill.style.transform = 'scaleX(' + gp.toFixed(3) + ')';
        if (gjHrs) { gjHrs.textContent = String(Math.round(gp * 48)); }
      }

      // marquee speed breathes with scroll velocity
      velo += ((y - lastY) - velo) * 0.08;
      lastY = y;
      if (mqAnim) {
        var rate = 1 + Math.min(Math.abs(velo) / 28, 1.6);
        try { mqAnim.playbackRate = rate; } catch (e2) { mqAnim = null; }
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) { requestAnimationFrame(frame); }
    });
  } catch (e) { /* static chrome; content unaffected */ }

  /* ---------- ember field (hero canvas) ---------- */
  try {
    var canvas = document.querySelector('[data-embers]');
    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var hero = canvas.parentNode;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = 0, H = 0, parts = [], heroVisible = true, emberRun = true;
      var px = -9999, py = -9999;

      function sizeCanvas() {
        W = hero.offsetWidth; H = hero.offsetHeight;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
      }

      function seed() {
        parts = [];
        var n = Math.min(90, Math.round((W * H) / 18000));
        for (var i = 0; i < n; i++) {
          parts.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: 0.6 + Math.random() * 1.6,
            vx: -0.06 - Math.random() * 0.1,
            vy: -0.10 - Math.random() * 0.16,
            a: 0.15 + Math.random() * 0.35,
            ph: Math.random() * Math.PI * 2,
            warm: Math.random() < 0.62
          });
        }
      }

      function emberFrame(ts) {
        if (!emberRun || !heroVisible) { return; }
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < parts.length; i++) {
          var pt = parts[i];
          pt.x += pt.vx; pt.y += pt.vy;
          // gentle pointer repulsion
          var dx = pt.x - px, dy = pt.y - py;
          var dist2 = dx * dx + dy * dy;
          if (dist2 < 14400 && dist2 > 0.01) {
            var f = (14400 - dist2) / 14400 * 0.6;
            var dist = Math.sqrt(dist2);
            pt.x += (dx / dist) * f;
            pt.y += (dy / dist) * f;
          }
          if (pt.y < -6) { pt.y = H + 6; pt.x = Math.random() * W; }
          if (pt.x < -6) { pt.x = W + 6; }
          var tw = pt.a * (0.65 + 0.35 * Math.sin(ts / 900 + pt.ph));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, 6.2832);
          ctx.fillStyle = pt.warm
            ? 'rgba(242,182,60,' + tw.toFixed(3) + ')'
            : 'rgba(244,239,228,' + (tw * 0.55).toFixed(3) + ')';
          ctx.fill();
        }
        requestAnimationFrame(emberFrame);
      }

      hero.addEventListener('pointermove', function (ev) {
        var rect = canvas.getBoundingClientRect();
        px = ev.clientX - rect.left; py = ev.clientY - rect.top;
      });
      hero.addEventListener('pointerleave', function () { px = -9999; py = -9999; });

      var ioE = new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        if (heroVisible && emberRun) { requestAnimationFrame(emberFrame); }
      });
      ioE.observe(hero);

      document.addEventListener('visibilitychange', function () {
        emberRun = !document.hidden;
        if (emberRun && heroVisible) { requestAnimationFrame(emberFrame); }
      });

      var rsTimer = null;
      window.addEventListener('resize', function () {
        clearTimeout(rsTimer);
        rsTimer = setTimeout(sizeCanvas, 180);
      });

      sizeCanvas();
      requestAnimationFrame(emberFrame);
    }
  } catch (e) { /* no embers — the hero still stands */ }

  /* ---------- custom cursor (fine pointers only) ---------- */
  try {
    if (fine) {
      var cur = document.createElement('div');
      cur.className = 'cursor';
      cur.setAttribute('aria-hidden', 'true');
      cur.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"><span class="cursor-label"></span></div>';
      document.body.appendChild(cur);
      var dot = cur.firstChild;
      var ring = cur.lastChild;
      var label = ring.firstChild;
      var cx = -100, cy = -100, rx = -100, ry = -100, rs = 1, seen = false;

      document.addEventListener('pointermove', function (ev) {
        if (ev.pointerType && ev.pointerType !== 'mouse') { return; }
        cx = ev.clientX; cy = ev.clientY;
        if (!seen) { seen = true; rx = cx; ry = cy; d.classList.add('has-cursor'); }
        dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        var t = ev.target;
        var hot = t.closest ? t.closest('a, button, [data-cursor]') : null;
        if (hot) {
          ring.classList.add('big');
          label.textContent = hot.getAttribute('data-cursor') || '';
        } else {
          ring.classList.remove('big');
        }
      });
      document.addEventListener('pointerdown', function () { rs = 0.8; });
      document.addEventListener('pointerup', function () { rs = 1; });
      document.addEventListener('pointerleave', function () { d.classList.remove('has-cursor'); seen = false; });

      (function ringLoop() {
        rx += (cx - rx) * 0.16;
        ry += (cy - ry) * 0.16;
        ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px) scale(' + rs + ')';
        requestAnimationFrame(ringLoop);
      })();
    }
  } catch (e) { d.classList.remove('has-cursor'); }

  /* ---------- magnetic button ---------- */
  try {
    var mags = document.querySelectorAll('[data-magnetic]');
    for (var m = 0; m < mags.length; m++) {
      (function (el) {
        el.addEventListener('pointermove', function (ev) {
          var r2 = el.getBoundingClientRect();
          var mx = ev.clientX - (r2.left + r2.width / 2);
          var my = ev.clientY - (r2.top + r2.height / 2);
          el.style.transform = 'translate(' + (mx * 0.18).toFixed(1) + 'px,' + (my * 0.22).toFixed(1) + 'px)';
        });
        el.addEventListener('pointerleave', function () {
          el.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1)';
          el.style.transform = '';
          setTimeout(function () { el.style.transition = ''; }, 460);
        });
      })(mags[m]);
    }
  } catch (e) { /* buttons stay put */ }

  initClock();
  initClipboard();

  /* ---------- shared modules (also run under reduced motion) ---------- */
  function initClock() {
    try {
      var el = document.querySelector('[data-clock]');
      if (!el || !window.Intl || !Intl.DateTimeFormat) { return; }
      var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
      function setTime() { el.textContent = fmt.format(new Date()); }
      setTime();
      setInterval(setTime, 30000);
    } catch (e) { /* placeholder dots remain */ }
  }

  function initClipboard() {
    try {
      var btns = document.querySelectorAll('[data-copy]');
      var toast = document.querySelector('[data-toast]');
      var hideTimer = null;
      for (var b = 0; b < btns.length; b++) {
        btns[b].addEventListener('click', function (ev) {
          var text = ev.currentTarget.getAttribute('data-copy');
          var done = function () {
            if (!toast) { return; }
            toast.textContent = 'EMAIL COPIED ✓';
            toast.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { /* quiet */ });
          }
        });
      }
    } catch (e) { /* copy button degrades to decoration */ }
  }
})();
