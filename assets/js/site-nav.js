/* ==========================================================================
   Site navigation — fixed bar, mobile sheet, and the "More" dropdown.
   Ported verbatim from the design canvas (Homepage / About Us artboards),
   which shipped identical nav markup and identical nav behaviour on both.
   ========================================================================== */
(function () {
    'use strict';

    /* ---------------------------------------------------------------- nav -- */
    var nav    = document.querySelector('.site-nav');
    var burger = document.getElementById('nav-burger');
    var dd     = document.querySelector('.nav-dd');
    var more   = document.getElementById('nav-more');

    function closeDropdown() {
        dd.classList.remove('is-open');
        more.setAttribute('aria-expanded', 'false');
    }
    function closeSheet() {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
    }

    burger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (!open) closeDropdown();
    });

    more.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dd.classList.toggle('is-open');
        more.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function (e) {
        if (!dd.contains(e.target)) closeDropdown();
        if (!nav.contains(e.target)) closeSheet();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (dd.classList.contains('is-open')) { closeDropdown(); more.focus(); return; }
        if (nav.classList.contains('is-open')) { closeSheet(); burger.focus(); }
    });

    /* Tapping any destination dismisses the mobile sheet behind it. */
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () { closeDropdown(); closeSheet(); });
    });
}());
