/* Portofolio Muhammad Fathurrahman — main.js */
(function () {
  'use strict';

  /* ===== PENGATURAN ===== */
  var GITHUB_URL = 'https://github.com/Fathursite';
  var EMAIL = 'farhana3rut@gmail.com';
  var ROLES = ['Full-stack web developer', 'Perancang basis data', 'Peminat computer vision', 'Sarjana Komputer (S.Kom)'];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  $$('[data-gh]').forEach(function (a) { a.href = GITHUB_URL; });
  document.body.classList.add('ready');

  /* ===== PERAN YANG DIKETIK ===== */
  var roleEl = $('#role');
  function renderRole(t) {
    roleEl.textContent = t;
    var c = document.createElement('span');
    c.className = 'cur';
    c.setAttribute('aria-hidden', 'true');
    roleEl.appendChild(c);
  }
  if (reduce) { renderRole(ROLES[0]); }
  else {
    var ri = 0, ci = 0, del = false;
    (function loop() {
      var full = ROLES[ri];
      ci += del ? -1 : 1;
      renderRole(full.slice(0, ci));
      var wait = del ? 38 : 68;
      if (!del && ci === full.length) { del = true; wait = 1900; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % ROLES.length; wait = 320; }
      setTimeout(loop, wait);
    })();
  }

  /* ===== KANVAS PARTIKEL HERO ===== */
  var field = $('#field');
  if (field && !reduce) {
    var fx = field.getContext('2d'), pts = [], W = 0, H = 0, mouse = { x: -999, y: -999 }, visible = true;
    var seed = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = field.offsetWidth; H = field.offsetHeight;
      field.width = W * dpr; field.height = H * dpr;
      fx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(28, Math.min(Math.round(W * H / 20000), 95));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .26, vy: (Math.random() - .5) * .26, r: Math.random() * 1.5 + .7 });
    };
    var draw = function () {
      if (visible) {
        fx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          var dm = Math.hypot(p.x - mouse.x, p.y - mouse.y), near = dm < 150;
          fx.beginPath(); fx.arc(p.x, p.y, near ? p.r * 1.9 : p.r, 0, 6.283);
          fx.fillStyle = near ? 'rgba(232,163,61,.85)' : 'rgba(95,208,180,.42)'; fx.fill();
          if (near) {
            fx.beginPath(); fx.moveTo(p.x, p.y); fx.lineTo(mouse.x, mouse.y);
            fx.strokeStyle = 'rgba(232,163,61,' + (.26 * (1 - dm / 150)).toFixed(3) + ')'; fx.lineWidth = 1; fx.stroke();
          }
          for (var j = i + 1; j < pts.length; j++) {
            var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 118) {
              fx.beginPath(); fx.moveTo(p.x, p.y); fx.lineTo(q.x, q.y);
              fx.strokeStyle = 'rgba(226,238,235,' + (.09 * (1 - d / 118)).toFixed(3) + ')'; fx.lineWidth = 1; fx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(draw);
    };
    seed(); draw();
    window.addEventListener('resize', seed);
    window.addEventListener('mousemove', function (e) { var b = field.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
    window.addEventListener('mouseout', function () { mouse.x = mouse.y = -999; });
    // hemat baterai: berhenti menggambar saat hero tidak terlihat
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(field);
  }

  /* ===== REVEAL, METER, ANGKA, RING IPK ===== */
  function countUp(el) {
    var goal = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), slot = $('span', el) || el;
    if (reduce) { slot.textContent = goal.toFixed(dec); return; }
    var t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1700, 1);
      slot.textContent = (goal * (1 - Math.pow(1 - p, 4))).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target;
      t.classList.add('in'); io.unobserve(t);
      $$('[data-fill]', t).forEach(function (b) { b.style.right = (100 - parseFloat(b.dataset.fill)) + '%'; });
      $$('[data-count]', t).forEach(countUp);
      var fg = $('.ring .fg', t);
      if (fg) fg.style.strokeDashoffset = (289 - 289 * 3.63 / 4).toFixed(1);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  $$('.rv, .tl-item').forEach(function (el) { io.observe(el); });

  /* ===== SCROLL: PROGRES, NAV AKTIF, GARIS LINIMASA ===== */
  var railBar = $('#railBar'), upBtn = $('#up'), dots = $$('.rail-dot'),
      secs = dots.map(function (d) { return document.getElementById(d.dataset.sec); }),
      timeline = $('#timeline'), tlDraw = $('#tlDraw'), ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    railBar.style.height = ((max > 0 ? y / max : 0) * 96).toFixed(1) + 'px';
    upBtn.classList.toggle('show', y > 700);
    var active = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= window.innerHeight * .4) active = i; });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === active); });
    var box = timeline.getBoundingClientRect();
    var seen = Math.max(0, Math.min(1, (window.innerHeight * .75 - box.top) / box.height));
    tlDraw.style.height = (seen * (box.height - 12)) + 'px';
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  upBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ===== MENU MOBILE ===== */
  var burger = $('#burger'), sheet = $('#sheet');
  function toggleSheet(force) {
    var open = typeof force === 'boolean' ? force : !sheet.classList.contains('open');
    sheet.classList.toggle('open', open);
    burger.classList.toggle('x', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('is-locked', open);
  }
  burger.addEventListener('click', function () { toggleSheet(); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { toggleSheet(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleSheet(false); });

  /* ===== FILTER + CARI SERTIFIKAT ===== */
  var fbtns = $$('.certs-filter button'), cards = $$('.cc'), sInput = $('#certSearch'), sEmpty = $('#certEmpty'), curF = 'all';
  function applyCerts() {
    var q = sInput.value.trim().toLowerCase(), n = 0;
    cards.forEach(function (c) {
      var ok = (curF === 'all' || c.dataset.c === curF) && (!q || c.dataset.q.indexOf(q) > -1);
      c.classList.toggle('hide', !ok); if (ok) n++;
    });
    sEmpty.hidden = n > 0;
  }
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      fbtns.forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); curF = b.dataset.f; applyCerts();
    });
  });
  sInput.addEventListener('input', applyCerts);

  /* ===== PRATINJAU (sertifikat, tangkapan layar, hak cipta) ===== */
  var lb = $('#lb'), lbImg = $('#lbImg'), list = [], pos = 0;
  function shown() { return cards.filter(function (c) { return !c.classList.contains('hide'); }); }
  function info(el) {
    if (el.classList.contains('cc')) {
      var p = 'sertifikat/pdf/' + el.dataset.slug + '.pdf';
      return { img: 'sertifikat/preview/' + el.dataset.slug + '.jpg', t: el.dataset.name, m: el.dataset.date + ' · ' + el.dataset.tag, open: p, dl: p, dn: el.dataset.dl, alt: 'Sertifikat ' + el.dataset.name };
    }
    return { img: el.dataset.full, t: el.dataset.title, m: el.dataset.meta, open: el.dataset.pdf || el.dataset.full, dl: el.dataset.pdf || '', dn: el.dataset.dn || '', alt: el.dataset.title };
  }
  function openAt(l, i) {
    list = l; pos = i; var it = info(l[i]);
    lbImg.src = it.img; lbImg.alt = it.alt;
    $('#lbTitle').textContent = it.t; $('#lbMeta').textContent = it.m;
    $('#lbOpen').href = it.open;
    var d = $('#lbDl'); d.hidden = !it.dl; if (it.dl) { d.href = it.dl; d.setAttribute('download', it.dn); }
    $('#lbPrev').hidden = $('#lbNext').hidden = l.length < 2;
    if (!lb.open) { lb.showModal(); document.body.classList.add('is-locked'); }
  }
  function step(d) { if (list.length) openAt(list, (pos + d + list.length) % list.length); }
  cards.forEach(function (c) { $('.cc-view', c).addEventListener('click', function () { var l = shown(); openAt(l, l.indexOf(c)); }); });
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = cards.filter(function (x) { return x.dataset.slug === b.dataset.open; })[0];
      if (c) { c.classList.remove('hide'); var l = shown(); openAt(l, l.indexOf(c)); }
    });
  });
  $$('.shot').forEach(function (b) {
    b.addEventListener('click', function () { var l = $$('.shot', b.closest('.pj')); openAt(l, l.indexOf(b)); });
  });
  $('#lbPrev').addEventListener('click', function () { step(-1); });
  $('#lbNext').addEventListener('click', function () { step(1); });
  $('#lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('close', function () { document.body.classList.remove('is-locked'); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-box')) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });

  /* ===== CETAK ===== */
  $('#printBtn').addEventListener('click', function () { window.print(); });

  /* ===== SALIN EMAIL ===== */
  var copyBtn = $('#copyBtn'), copyTxt = $('#copyTxt');
  copyBtn.addEventListener('click', function () {
    function done() {
      copyBtn.classList.add('ok'); copyTxt.textContent = 'Email tersalin';
      setTimeout(function () { copyBtn.classList.remove('ok'); copyTxt.textContent = 'Salin alamat email'; }, 2100);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = EMAIL; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { copyTxt.textContent = EMAIL; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(done, fallback);
    else fallback();
  });
})();
