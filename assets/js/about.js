/* ==========================================================================
   About Us behaviour — ported from the design canvas About Us artboard.

   The canvas duplicated the full Homepage component onto this artboard, so
   the export also carried the hero shader, the intake form, the FAQ and the
   process timeline — none of which exist in this page's markup, and all of
   which threw on load. Only the team picker has hooks here, so only the team
   picker is kept.
   ========================================================================== */
(function () {
    'use strict';

    function teamPicker() {
      const cards = [].slice.call(document.querySelectorAll('.team-card'));
      const details = [].slice.call(document.querySelectorAll('.team-detail'));
      if (!cards.length || cards[0].dataset.on) return;
      const set = (i) => {
        cards.forEach((c) => { c.dataset.active = c.dataset.i === String(i) ? '1' : '0'; });
        details.forEach((d) => { d.style.display = d.dataset.i === String(i) ? 'flex' : 'none'; });
      };
      cards.forEach((c) => {
        c.dataset.on = '1';
        const i = c.dataset.i;
        c.addEventListener('mouseenter', () => set(i));
        c.addEventListener('focus', () => set(i));
        c.addEventListener('click', () => set(i));
      });
      set(0);
    }

    try { teamPicker(); } catch (e) { console.warn(e); }
}());
