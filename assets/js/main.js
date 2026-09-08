/* S. Sadra Mousavi — site behaviour. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js-ready');

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById('theme');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      themeBtn.setAttribute('aria-label',
        next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function closeMenu() {
    if (!menu || !burger) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-locked');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  /* ---------- scroll progress, sticky nav, active section ---------- */
  var bar = document.getElementById('progress');
  var nav = document.getElementById('nav');

  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)')
  );
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  // The active section is the last one whose top has passed under the nav bar.
  // There is no observer band to fall between, so the highlight cannot lag a
  // section behind the one that was clicked.
  function activeSection() {
    if (!sections.length) return null;

    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
      return sections[sections.length - 1];   // bottom of the page: last section
    }

    var edge = (nav ? nav.getBoundingClientRect().bottom : 64) + 24;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= edge) current = sections[i];
      else break;
    }
    return current;                            // null while still in the hero
  }

  function paintActive(id) {
    links.forEach(function (a) {
      a.classList.toggle('is-active', !!id && a.getAttribute('href') === '#' + id);
    });
  }

  // Clicking a nav link starts a smooth scroll that can take a while on a tall
  // page. Highlight the destination straight away and hold it there until the
  // scroll settles, so the indicator never trails the click.
  var pending = null;
  var pendingTimer = null;

  function releasePending() {
    if (pending === null) return;
    pending = null;
    clearTimeout(pendingTimer);
    paintActive(activeSection() && activeSection().id);
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      pending = a.getAttribute('href').slice(1);
      paintActive(pending);
      clearTimeout(pendingTimer);
      pendingTimer = setTimeout(releasePending, 1400);   // if scrollend never fires
    });
  });

  window.addEventListener('scrollend', releasePending);

  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    if (nav) nav.classList.toggle('is-stuck', y > 8);

    if (pending === null) {
      var current = activeSection();
      paintActive(current && current.id);
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      // Stagger the items that come into view together, capped so a long
      // list never leaves the last card waiting.
      var shown = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var delay = Math.min(shown, 6) * 60;
        shown++;
        en.target.style.transitionDelay = delay + 'ms';
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- project filter ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.filters .chip'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#grid .card'));
  var empty = document.getElementById('empty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var want = chip.dataset.filter;

      chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });

      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.dataset.cat || '').split(/\s+/);
        var hit = want === 'all' || cats.indexOf(want) !== -1;
        card.classList.toggle('is-hidden', !hit);
        if (hit) shown++;
      });

      if (empty) empty.hidden = shown > 0;
    });
  });

  /* ---------- CV link, from assets/js/config.js ---------- */
  var cfg = window.SITE || {};
  if (cfg.cvPath) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-cv]'), function (a) {
      a.setAttribute('href', cfg.cvPath);
      a.setAttribute('download', cfg.cvFileName || '');
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
