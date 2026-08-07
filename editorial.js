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
    wireForm('leakForm', 'leakSuccess', 'lf-');
    wireForm('leakFormM', 'leakSuccessM', 'm-lf-');
    wireForm('leakFormX', 'leakSuccessX', 'x-lf-');
  }

  // ---- contact modal ------------------------------------------------------
  // Every CTA opens this rather than scrolling the page to the form. Sending
  // someone thousands of pixels down the page to answer four questions is the
  // thing this replaces.
  function modal() {
    var box = document.getElementById('cgModal');
    if (!box) return;
    var panel = box.querySelector('.cg-modal-box');
    var lastFocus = null;

    function open(e, trigger) {
      if (e) e.preventDefault();
      // Take the trigger we were handed rather than reading activeElement:
      // Safari does not focus a link on click, so that would lose the return
      // point and dump focus at the top of the page on close.
      lastFocus = trigger || document.activeElement;
      box.hidden = false;
      document.body.classList.add('cg-modal-open');
      var first = box.querySelector('input');
      if (first) first.focus();
    }

    function close() {
      if (box.hidden) return;
      box.hidden = true;
      document.body.classList.remove('cg-modal-open');
      // Send focus back where it came from, or it lands at the top of the page.
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // Any control pointing at the contact form opens the dialog instead,
    // including the cross-page links on How It Works and Brand Films.
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('a[href="#contact"], a[href="/#contact"]');
      if (trigger) { open(e, trigger); return; }
      if (e.target.closest('[data-modal-close]')) { e.preventDefault(); close(); }
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      // Keep tabbing inside the dialog while it is open.
      var focusable = panel.querySelectorAll('button, input, a[href], textarea, select');
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function wireForm(formId, successId, prefix) {
    var form = document.getElementById(formId);
    if (!form) return;
    var success = document.getElementById(successId);
    var sending = false;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // A disabled button stops a second click, but not a second submit event
      // from an Enter-key race. One lead should never write two notes.
      if (sending) return;
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;

      var payload = {
        business: document.getElementById(prefix + 'business').value.trim(),
        firstName: document.getElementById(prefix + 'name').value.trim(),
        trade: document.getElementById(prefix + 'trade').value.trim(),
        phone: document.getElementById(prefix + 'phone').value.trim(),
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

      sending = true;
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
        sending = false;
        btn.disabled = false;
        btn.textContent = label;
        window.alert('Something hiccuped. Call or text us instead: (727) 270-8422');
      });
    });
  }

  // ---- mobile menu --------------------------------------------------------
  function burger() {
    var btn = document.getElementById('cgBurger');
    var head = document.querySelector('.cg-head');
    if (!btn || !head) return;

    function setOpen(open) {
      head.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    btn.addEventListener('click', function () {
      setOpen(!head.classList.contains('is-open'));
    });

    // Tapping a link, tapping away, or Escape all close it.
    head.querySelectorAll('.cg-nav a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('click', function (e) {
      if (!head.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // ---- condensed mobile controls -----------------------------------------
  // The condensed bands collapse long content behind toggles. Each control
  // shows one of a pair, or opens one accordion row at a time.
  function condensed() {
    var root = document.querySelector('.cg-m');
    if (!root) return;

    function swap(showSel, hideSel, onBtn, offBtn) {
      var show = root.querySelector(showSel), hide = root.querySelector(hideSel);
      if (show) show.hidden = false;
      if (hide) hide.hidden = true;
      if (onBtn) onBtn.style.background = 'rgba(20,16,12,0.14)';
      if (offBtn) offBtn.style.background = 'transparent';
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act], [data-obj]');
      if (!btn || !root.contains(btn)) return;
      var act = btn.getAttribute('data-act');

      if (act === 'pickCrew' || act === 'pickAi') {
        var crew = root.querySelector('[data-act="pickCrew"]');
        var ai = root.querySelector('[data-act="pickAi"]');
        var toCrew = act === 'pickCrew';
        swap(toCrew ? '.cg-m-crew' : '.cg-m-ai',
             toCrew ? '.cg-m-ai' : '.cg-m-crew',
             toCrew ? crew : ai, toCrew ? ai : crew);
        return;
      }

      if (act === 'pickLaunch' || act === 'pickMonthly') {
        var toLaunch = act === 'pickLaunch';
        var l = root.querySelector('.cg-m-pkg-launch');
        var m = root.querySelector('.cg-m-pkg-monthly');
        if (l) l.hidden = !toLaunch;
        if (m) m.hidden = toLaunch;
        var lb = root.querySelector('[data-act="pickLaunch"]');
        var mb = root.querySelector('[data-act="pickMonthly"]');
        if (lb) lb.style.background = toLaunch ? 'rgba(239,121,56,0.16)' : '#f9f8eb';
        if (mb) mb.style.background = toLaunch ? '#f9f8eb' : 'rgba(239,121,56,0.16)';
        return;
      }

      if (act === 'toggleSeo') {
        var panel = root.querySelector('.cg-m-seo');
        if (!panel) return;
        panel.hidden = !panel.hidden;
        var sign = btn.querySelector('span:last-child') || btn;
        sign.textContent = panel.hidden ? '+' : '\u2212';
        return;
      }

      if (btn.hasAttribute('data-obj')) {
        var rows = root.querySelectorAll('[data-obj]');
        var answers = root.querySelectorAll('.cg-m-a');
        var idx = Number(btn.getAttribute('data-obj'));
        var wasOpen = answers[idx] && !answers[idx].hidden;
        Array.prototype.forEach.call(answers, function (a, i) {
          a.hidden = true;
          var s = rows[i] && rows[i].querySelector('span:last-child');
          if (s) s.textContent = '+';
        });
        if (!wasOpen && answers[idx]) {
          answers[idx].hidden = false;
          var s2 = btn.querySelector('span:last-child');
          if (s2) s2.textContent = '\u2212';
        }
      }
    });
  }

  // ---- services marquee (mobile only) -------------------------------------
  // A seamless loop needs two copies of the strip: the track slides exactly one
  // copy's width and restarts, so the join is never visible. The clones are
  // hidden from assistive tech and from desktop, where the strip is static.
  function marquee() {
    var strip = document.querySelector('.cg-chips');
    if (!strip || strip.querySelector('.cg-chips-track')) return;

    var chips = Array.prototype.slice.call(strip.children);
    if (!chips.length) return;

    var track = document.createElement('div');
    track.className = 'cg-chips-track';
    chips.forEach(function (c) { track.appendChild(c); });
    chips.forEach(function (c) {
      var clone = c.cloneNode(true);
      clone.classList.add('cg-chip-clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    strip.appendChild(track);
  }

  function init() { reveal(); player(); fanVideo(); contactForm(); burger(); condensed(); marquee(); modal(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
