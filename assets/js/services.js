/* ==========================================================================
   Services behaviour — ported from the design canvas Services artboard.

   The canvas shipped this as a DCLogic component: a componentDidMount that
   repainted the lucide icons and called four methods. The methods are plain
   functions here. nav() is gone — site-nav.js does that on every page — and
   the lucide createIcons() calls went with it, because the icons are inline
   SVG now and there is no runtime to wait for. That also retires the canvas's
   `setTimeout(() => this.fourA(), 300)` retry, which existed only to re-bind
   the rail after lucide swapped its <i> tags for <svg>. Everything else is
   unchanged.
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
    /* Duplicated from home.js, deliberately. The canvas gave every artboard
       carrying a .fa-rail its own copy of this method, and the site layout
       loads exactly one page_js file per page — so a shared helper has no home
       yet. The palette values below are home.js's live ones (#dee2e9 border,
       #0c1b33 title), not the canvas's (#dbe1ea, #0e1526), so both rails
       behave identically. Change one copy, change the other. */
    function fourA() {
      const rail = document.querySelector('.fa-rail');
      if (!rail || rail.dataset.on) return;
      rail.dataset.on = '1';
      const fill = rail.querySelector('.fa-fill');
      const steps = [].slice.call(rail.querySelectorAll('.fa-step'));
      const paint = (i) => {
        steps.forEach((st, k) => {
          const on = i !== null && k <= i;
          st.querySelector('.fa-dot').style.background = on ? '#ff6b1a' : '#ffffff';
          st.querySelector('.fa-dot').style.borderColor = on ? '#ff6b1a' : '#dee2e9';
          st.querySelector('.fa-dot').style.transform = (i === k) ? 'scale(1.12)' : 'scale(1)';
          st.querySelector('.fa-icon').setAttribute('stroke', on ? '#ffffff' : '#0e3a6e');
          st.querySelector('.fa-title').style.color = on ? '#0b2452' : '#0c1b33';
        });
        fill.style.width = i === null ? '0%' : (i / (steps.length - 1)) * 75 + '%';
      };
      steps.forEach((st, k) => {
        st.addEventListener('mouseenter', () => paint(k));
        st.addEventListener('click', () => paint(k));
      });
      rail.addEventListener('mouseleave', () => paint(null));
      paint(null);
    }

    [fourA, processTimeline, faq].forEach(function (fn) {
        try { fn(); } catch (e) { console.warn(e); }
    });
}());
