/* ==========================================================================
   Site navigation: About Us dropdown, mobile sheet, and the dotted pulsar
   orbit drawn around each link on hover. Loaded on every page.
   ========================================================================== */
(function () {
    'use strict';

    var nav = document.querySelector('.pvn');
    if (!nav) return;
    var ab = document.getElementById('pvnAboutBtn');
    var am = document.getElementById('pvnAboutMenu');
    var mb = document.getElementById('pvnMenuBtn');
    var nl = document.getElementById('pvnLinks');

    function closeAbout() { ab.setAttribute('aria-expanded', 'false'); am.hidden = true; }
    function closeSheet() {
        nl.classList.remove('open');
        mb.setAttribute('aria-expanded', 'false');
        mb.setAttribute('aria-label', 'Open menu');
    }

    ab.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = ab.getAttribute('aria-expanded') === 'true';
        ab.setAttribute('aria-expanded', String(!open));
        am.hidden = open;
    });
    mb.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = nl.classList.toggle('open');
        mb.setAttribute('aria-expanded', String(open));
        mb.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.pvn-dd')) closeAbout();
        if (!nav.contains(e.target)) closeSheet();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (!am.hidden) { closeAbout(); ab.focus(); }
        else if (nl.classList.contains('open')) { closeSheet(); mb.focus(); }
    });
    /* Tapping any destination dismisses the sheet and the dropdown. */
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () { closeAbout(); closeSheet(); });
    });

    /* Hover orbit: two dotted ellipses sized to the link, with an orange bead. */
    var NS = 'http://www.w3.org/2000/svg';
    function orbits() {
        Array.prototype.forEach.call(nav.querySelectorAll('.pvn-link'), function (el) {
            var old = el.querySelector(':scope>.pv-orbit');
            if (old) old.remove();
            var w = el.offsetWidth, h = el.offsetHeight;
            if (!w) return;
            var W = w + 22, H = h + 18, svg = document.createElementNS(NS, 'svg');
            svg.setAttribute('class', 'pv-orbit');
            svg.setAttribute('width', W); svg.setAttribute('height', H);
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            svg.setAttribute('aria-hidden', 'true');
            svg.innerHTML =
                '<ellipse cx="' + W / 2 + '" cy="' + H / 2 + '" rx="' + (W / 2 - 2) + '" ry="' + (H / 2 - 2) + '"/>' +
                '<ellipse class="o2" cx="' + W / 2 + '" cy="' + H / 2 + '" rx="' + (W / 2 - 9) + '" ry="' + (H / 2 - 7) + '"/>' +
                '<circle cx="' + W / 2 + '" cy="2" r="3"><animateTransform attributeName="transform" type="rotate" from="0 ' + W / 2 + ' ' + H / 2 + '" to="360 ' + W / 2 + ' ' + H / 2 + '" dur="3s" repeatCount="indefinite"/></circle>';
            el.appendChild(svg);
        });
    }
    orbits();
    addEventListener('resize', orbits);
    if (document.fonts) document.fonts.ready.then(orbits);
}());
