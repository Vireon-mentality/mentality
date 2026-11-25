// 1) Typewriter tagline + footer year
(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  var el = document.getElementById('typed');
  if (!el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var text = el.getAttribute('data-text') || el.textContent;
  var i = 0;
  el.textContent = '';
  setTimeout(function type() {
    if (i <= text.length) { el.textContent = text.slice(0, i++); setTimeout(type, 38); }
  }, 500);
})();

// 2) Auto-sliding image carousels (infinite loop, dots, swipe, pause on hover)
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 3600;

  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.track');
    var slides = Array.prototype.slice.call(track.children);
    var n = slides.length;
    if (n < 2) return;

    track.appendChild(slides[0].cloneNode(true)); // clone for seamless loop
    track.lastChild.setAttribute('aria-hidden', 'true');

    var idx = 0, timer = null, paused = false, startX = null;

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'dots';
    var dots = slides.map(function (_, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show image ' + (k + 1));
      b.addEventListener('click', function () { go(k); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });
    root.appendChild(dotsWrap);

    function render() {
      track.style.transform = 'translateX(' + (-100 * idx) + '%)';
      dots.forEach(function (d, k) { d.classList.toggle('active', k === idx % n); });
    }
    function go(k) { idx = k; render(); }
    function next() { idx++; render(); }
    function prev() { go((idx - 1 + n) % n); }

    track.addEventListener('transitionend', function () {
      if (idx >= n) { // landed on the clone: jump back to the real first slide
        track.classList.add('no-anim');
        idx = 0; render();
        void track.offsetWidth;
        track.classList.remove('no-anim');
      }
    });

    function start() { if (!reduce && !timer) timer = setInterval(function () { if (!paused && !document.hidden) next(); }, INTERVAL); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    root.addEventListener('mouseenter', function () { paused = true; });
    root.addEventListener('mouseleave', function () { paused = false; });
    root.addEventListener('focusin', function () { paused = true; });
    root.addEventListener('focusout', function () { paused = false; });

    root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) { if (dx < 0) { next(); } else { prev(); } restart(); }
    }, { passive: true });

    render();
    var offset = parseInt(root.getAttribute('data-offset') || '0', 10);
    setTimeout(start, offset); // stagger so the two carousels don't slide in sync
  });
})();
