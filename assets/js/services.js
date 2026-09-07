/* ==========================================================================
   Services behaviour — ported from the design canvas Services artboard.

   The canvas shipped this as a DCLogic component: a componentDidMount that
   repainted the lucide icons and called four methods. The methods are plain
   functions here. nav() is gone — site-nav.js does that on every page — and
   the lucide createIcons() calls went with it, because the icons are inline
   SVG now and there is no runtime to wait for. fourA() is gone too: the 4A
   rail was taken off this page and now lives only on the homepage, so home.js
   holds the sole copy. That also retires the canvas's
   `setTimeout(() => this.fourA(), 300)` retry, which existed only to re-bind
   the rail after lucide swapped its <i> tags for <svg>.

   faq() is deliberately still here while the FAQ block sits behind a Liquid
   comment in _pages/services.html: it finds no .faq-q, returns, and costs
   nothing, so un-commenting that block is the whole job of restoring it.
   ========================================================================== */
(function () {
    'use strict';
    /* ======================================================================
       Section behaviours — the canvas component's methods, with the canvas
       neutrals rewritten to the live palette (#c2500f → #bd450a,
       #7b8598 → #7a8aa5, #dbe1ea → #dee2e9, #0e1526 → #0c1b33).
       ====================================================================== */
    function processTimeline() {
      const steps = [].slice.call(document.querySelectorAll('.proc-step'));
      if (!steps.length || steps[0].dataset.on) return;
      steps[0].dataset.on = '1';
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const activate = (el) => {
        el.classList.add('is-on');
        const prev = el.previousElementSibling;
        if (prev) { const p = prev.querySelector('.proc-line-fill'); if (p) p.style.height = '100%'; }
        const own = el.querySelector('.proc-line-fill');
        if (own && el.nextElementSibling && el.nextElementSibling.classList.contains('is-on')) own.style.height = '100%';
      };
      if (reduce) { steps.forEach(activate); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { activate(en.target); io.unobserve(en.target); } });
      }, { rootMargin: '-20% 0px -30% 0px', threshold: 0.01 });
      steps.forEach((st) => io.observe(st));
    }
    function faq() {
      const questions = [].slice.call(document.querySelectorAll('.faq-q'));
      if (!questions.length || questions[0].dataset.on) return;
      const setFaq = (btn, open) => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        const mark = btn.querySelector('.faq-mark');
        btn.setAttribute('aria-expanded', String(open));
        if (panel) panel.style.display = open ? '' : 'none';
        if (mark) { mark.style.color = open ? '#bd450a' : '#7a8aa5'; mark.style.transform = open ? 'rotate(45deg)' : 'none'; }
      };
      questions.forEach((btn) => {
        btn.dataset.on = '1';
        btn.addEventListener('click', () => {
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          questions.forEach((o) => setFaq(o, false));
          if (!isOpen) setFaq(btn, true);
        });
      });
    }
    [processTimeline, faq].forEach(function (fn) {
        try { fn(); } catch (e) { console.warn(e); }
    });
}());
