/* ============================================================================
   THE RECORD — motion engine (restrained, content-serving)
   Vanilla JS, no dependencies. Progressive enhancement: every module is wrapped
   so that any failure leaves a fully readable static document. Order:
   boot · reveals · stamp · scrollLoop (progress/rail/spine/gj) · counters
   · clock · clipboard. Honours prefers-reduced-motion and missing APIs.
   ============================================================================ */
(function () {
  'use strict';
  var d = document.documentElement;
  var reduce = false;
  try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var hasIO = 'IntersectionObserver' in window;

  function showAll() { d.classList.add('reveal-all'); }
  function safe(fn) { try { fn(); } catch (e) { /* a dead module must never break the page */ } }

  // cancel the 3s head failsafe — we booted
  d.classList.add('booted');

  // If we can't (or shouldn't) animate reveals, show everything up front.
  if (reduce || !hasIO) { showAll(); }

  /* — stagger: index reveals within their own parent ----------------------- */
  safe(function () {
    var nodes = document.querySelectorAll('.reveal');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i], p = el.parentElement, n = 0, idx = 0;
      var kids = p ? p.children : [];
      for (var k = 0; k < kids.length; k++) {
        if (kids[k].classList && kids[k].classList.contains('reveal')) {
          if (kids[k] === el) { idx = n; }
          n++;
        }
      }
      el.style.setProperty('--i', Math.min(idx, 6));
    }
  });

  /* — reveals on scroll ---------------------------------------------------- */
  safe(function () {
    if (reduce || !hasIO) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  });

  /* — the kill: set the stamp when the Decision row is reached ------------- */
  safe(function () {
    var stamp = document.querySelector('[data-stamp]');
    var trigger = document.querySelector('[data-stamp-trigger]');
    if (!stamp || !trigger) return;
    if (reduce || !hasIO) { stamp.classList.add('set'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { stamp.classList.add('set'); io.disconnect(); }
      });
    }, { threshold: 0.6 });
    io.observe(trigger);
  });

  /* — single scroll loop: progress, rail, case spine, gamejam bar ---------- */
  safe(function () {
    if (reduce) return;
    var progress = document.querySelector('[data-progress]');
    var spine = document.querySelector('[data-spine]');
    var gj = document.querySelector('[data-gjfill]');
    var gjSection = document.getElementById('gamejam');
    var caseBody = spine ? spine.closest('.case-body') : null;
    var railLinks = Array.prototype.slice.call(document.querySelectorAll('.rail a[data-rail]'));
    var sections = railLinks.map(function (a) { return document.getElementById(a.getAttribute('data-rail')); });

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight || 1;

      if (progress) {
        var max = (document.documentElement.scrollHeight - vh) || 1;
        progress.style.transform = 'scaleX(' + clamp(window.scrollY / max) + ')';
      }
      if (spine && caseBody) {
        var r = caseBody.getBoundingClientRect();
        spine.style.transform = 'scaleY(' + clamp((vh * 0.82 - r.top) / (r.height || 1)) + ')';
      }
      if (gj && gjSection) {
        var g = gjSection.getBoundingClientRect();
        gj.style.transform = 'scaleX(' + clamp((vh * 0.8 - g.top) / ((g.height || 1) * 0.6)) + ')';
      }
      if (railLinks.length) {
        var active = -1;
        for (var i = 0; i < sections.length; i++) {
          if (sections[i] && sections[i].getBoundingClientRect().top <= 130) { active = i; }
        }
        for (var j = 0; j < railLinks.length; j++) {
          railLinks[j].classList.toggle('active', j === active);
        }
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  });

  /* — odometer counters ---------------------------------------------------- */
  safe(function () {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (reduce || !hasIO) { els.forEach(function (el) { el.textContent = el.getAttribute('data-count'); }); return; }
    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var start = null, dur = 900;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(step); else el.textContent = target;
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  });

  /* — Ernakulam clock (IST) ----------------------------------------------- */
  safe(function () {
    var el = document.querySelector('[data-clock]');
    if (!el) return;
    function fmt() {
      try {
        return new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
        }).format(new Date());
      } catch (e) {
        var n = new Date(); return ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2);
      }
    }
    function tick() { el.textContent = fmt(); }
    tick();
    setInterval(tick, 30000);
  });

  /* — copy email → toast --------------------------------------------------- */
  safe(function () {
    var toast = document.querySelector('[data-toast]');
    var t;
    function flash(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(t);
      t = setTimeout(function () { toast.classList.remove('show'); }, 1800);
    }
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-copy');
        function ok() { flash('Email copied  ✓'); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(val).then(ok).catch(legacy);
        } else { legacy(); }
        function legacy() {
          try {
            var ta = document.createElement('textarea');
            ta.value = val; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            ok();
          } catch (e) { flash('Copy failed — ' + val); }
        }
      });
    });
  });
})();
