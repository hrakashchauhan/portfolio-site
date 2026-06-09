/* The Operating Ledger — progressive enhancement.
   The page is fully readable WITHOUT this file. The .js class (set in <head>) is what hides
   .reveal elements; this script only reveals them on scroll. Every failure path reveals
   everything so nothing can get stuck hidden. */
(function () {
  'use strict';

  var els = document.querySelectorAll('.reveal');

  function showAll() {
    for (var i = 0; i < els.length; i++) { els[i].classList.add('in'); }
  }

  try {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('in');
          io.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    for (var j = 0; j < els.length; j++) { io.observe(els[j]); }
  } catch (e) {
    showAll();
  }
})();
