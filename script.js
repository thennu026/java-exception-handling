document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  var links = navLinks.querySelectorAll('a');
  var toTop = document.getElementById('toTop');

  // Mobile menu
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });
  links.forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // Smooth scrolling (also works where CSS scroll-behavior is unsupported)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // Active nav link + scroll-to-top visibility
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  function onScroll() {
    var y = window.pageYOffset + 120;
    var current = 0;
    sections.forEach(function (s, i) {
      if (s && s.offsetTop <= y) current = i;
    });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
    toTop.classList.toggle('show', window.pageYOffset > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Copy code buttons
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.closest('.code-wrap').querySelector('code').textContent;
      function done() {
        btn.textContent = 'Copied!';
        btn.classList.add('done');
        setTimeout(function () {
          btn.textContent = 'Copy Code';
          btn.classList.remove('done');
        }, 1800);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(done, function () { fallbackCopy(code); done(); });
      } else {
        fallbackCopy(code);
        done();
      }
    });
  });

  // Expand/collapse example cards
  document.querySelectorAll('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var body = btn.nextElementSibling;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      body.hidden = open;
    });
  });
});
