/* ==========================================================================
   Site navigation — fixed bar, mobile sheet, and Company dropdown.
   ========================================================================== */
(function () {
    'use strict';

    var nav    = document.querySelector('.site-nav');
    var burger = document.getElementById('nav-burger');
    var ddBtn  = nav.querySelector('.nav-dd-btn');
    var ddMenu = document.getElementById('nav-dd-menu');

    /* ---- mobile sheet ---- */
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
    });

    /* ---- Company dropdown ---- */
    function closeDd() {
        ddBtn.setAttribute('aria-expanded', 'false');
        ddMenu.classList.remove('is-open');
    }
    function openDd() {
        ddBtn.setAttribute('aria-expanded', 'true');
        ddMenu.classList.add('is-open');
    }

    ddBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = ddMenu.classList.contains('is-open');
        if (isOpen) { closeDd(); } else { openDd(); }
    });

    /* ---- global dismiss ---- */
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) { closeSheet(); closeDd(); }
        else if (!ddBtn.contains(e.target) && !ddMenu.contains(e.target)) { closeDd(); }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (ddMenu.classList.contains('is-open')) { closeDd(); ddBtn.focus(); }
            else if (nav.classList.contains('is-open')) { closeSheet(); burger.focus(); }
        }
    });

    /* Tapping any destination dismisses the mobile sheet and dropdown. */
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () { closeSheet(); closeDd(); });
    });
}());
