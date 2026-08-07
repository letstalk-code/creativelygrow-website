// Creatively Grow — editorial redesign behaviour.
// Two jobs: reveal bands as they scroll in, and swap the featured film on
// Brand Films. Everything else on these pages is static.

(function () {
  'use strict';

  // Mark the document before anything is hidden. Every reveal style is gated on
  // this class, so a script that never runs leaves the page fully visible
  // rather than blank.
  document.documentElement.classList.add('cg-js');

  var reduced = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- scroll reveals ----------------------------------------------------
  // The fanned landing pages assemble themselves; other bands rise a little.
  function reveal() {
    var fan = document.querySelector('.cg-fan');
    var targets = [];
    if (fan) targets.push(fan);

    // Tag the bands worth animating. Skipping the first screen keeps the hero
    // from flashing in on load.
    var bands = document.querySelectorAll('body > div > div, body > div');
    Array.prototype.forEach.call(bands, function (el, i) {
      if (i < 2 || el.classList.contains('cg-fan')) return;
      if (el.offsetHeight < 120) return;
      el.classList.add('cg-rise');
      targets.push(el);
    });

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });

    // Safety net. If the observer never delivers - an odd browser, a
    // background tab that never paints - show everything anyway. Content
    // being visible always beats content being animated.
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    }, 2500);
  }

  // ---- Brand Films player ------------------------------------------------
  function player() {
    var frame = document.getElementById('cgFeatured');
    if (!frame) return;
    var titleEl = document.getElementById('cgFeaturedTitle');
    var countEl = document.getElementById('cgFeaturedCount');
    var buttons = document.querySelectorAll('[data-guid]');

    Array.prototype.forEach.call(buttons, function (btn) {
      // The card wrapper carries the hover treatment.
      var card = btn.closest('div');
      if (card) card.classList.add('cg-film-card');

      btn.addEventListener('click', function () {
        var guid = btn.getAttribute('data-guid');
        // autoplay=true: the click IS the play intent, so honour it.
        frame.src = 'https://iframe.mediadelivery.net/embed/715384/' + guid
          + '?autoplay=true&preload=true';
        if (titleEl) titleEl.textContent = btn.getAttribute('data-title');
        if (countEl) countEl.textContent = btn.getAttribute('data-index') + ' / 08';

        Array.prototype.forEach.call(document.querySelectorAll('.cg-film-card'),
          function (c) { c.classList.remove('is-playing'); });
        if (card) card.classList.add('is-playing');

        frame.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'center'
        });
      });
    });
  }

  // ---- the showcase film in the fan --------------------------------------
  // Autoplay is a hint, not a promise. If the browser refuses, the poster
  // stays and we leave it alone rather than pretending it is playing.
  function fanVideo() {
    var v = document.querySelector('.cg-fan-video');
    if (!v) return;
    if (reduced) { v.removeAttribute('autoplay'); v.pause(); return; }
    var go = v.play();
    if (go && go.catch) go.catch(function () { /* poster carries it */ });
  }

  // ---- contact form -------------------------------------------------------
  // Same endpoint and payload the previous homepage used, so leads keep
  // landing in GHL exactly as before.
  function contactForm() {
    var form = document.getElementById('leakForm');
    if (!form) return;
    var success = document.getElementById('leakSuccess');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;

      var payload = {
        business: document.getElementById('lf-business').value.trim(),
        firstName: document.getElementById('lf-name').value.trim(),
        trade: document.getElementById('lf-trade').value.trim(),
        phone: document.getElementById('lf-phone').value.trim(),
        niche: 'contact'
      };

      // novalidate is set so the browser cannot bury a message behind the
      // dark band; check it here and say so plainly instead.
      if (!payload.business || !payload.firstName || !payload.trade || !payload.phone) {
        var missing = form.querySelector('input:placeholder-shown') || form.querySelector('input');
        if (missing) missing.focus();
        btn.textContent = 'Fill in every field';
        setTimeout(function () { btn.textContent = label; }, 1800);
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';

      fetch('/api/leak-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('bad response');
        form.hidden = true;
        if (success) success.hidden = false;
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = label;
        window.alert('Something hiccuped. Call or text us instead: (727) 270-8422');
      });
    });
  }

  function init() { reveal(); player(); fanVideo(); contactForm(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
