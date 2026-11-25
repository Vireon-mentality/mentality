// Typewriter effect for the tagline (skipped if the visitor prefers reduced motion)
(function () {
  var el = document.getElementById('typed');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (!el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var text = el.getAttribute('data-text') || el.textContent;
  var i = 0;
  el.textContent = '';
  setTimeout(function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      setTimeout(type, 38);
    }
  }, 500);
})();
