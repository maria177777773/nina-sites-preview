/* Новые главные: меню (бургер, подсветка раздела), плавные якоря, «Показать всех лекторов», связь лектор → расписание, «Было / Стало». */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var params = new URLSearchParams(location.search);

  function go(id) {  // к заголовку блока, сразу под липкую шапку (Маша 29.10: не проскакивать выше или ниже)
    var el = document.getElementById(id); if (!el) return;
    var t = el.querySelector('h2') || el, hh = ($('.hdr') || { offsetHeight: 0 }).offsetHeight;
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - hh - 24, behavior: 'smooth' });
  }
  var mnav = $('[data-mnav]'), burger = $('[data-burger]');
  function menu(open) {
    if (!mnav) return;
    mnav.hidden = !open; if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-burger],[data-go],[data-lect-go],[data-more],[data-ba],a[href^="#"]');
    if (!t) return;
    var d = t.dataset;
    if (d.burger !== undefined) { menu(mnav.hidden); return; }
    if (d.ba) {
      var old = d.ba === 'old';
      $('[data-bylo]').hidden = !old; document.body.classList.toggle('old', old);
      $$('[data-ba]').forEach(function (b) { b.classList.toggle('on', b === t); });
      return;
    }
    if (d.more !== undefined) {
      var w = t.closest('.wrap'); var s = w.classList.toggle('show-all');
      t.textContent = s ? 'Свернуть' : t.dataset.label; return;
    }
    if (d.lectGo) { if (window.Schedule) window.Schedule.lecturer(d.lectGo); go('raspisanie'); return; }
    var id = d.go || (t.getAttribute('href') || '').slice(1);
    if (id && document.getElementById(id)) { ev.preventDefault(); menu(false); go(id); history.replaceState(null, '', '#' + id); }
  });
  $$('[data-more]').forEach(function (b) { b.dataset.label = b.textContent; });

  // телефон: маска +7 (___) ___-__-__ и проверка (правило Маши 29.10: без маски и проверки форма с дефектом)
  function digits(v) { var d = (v || '').replace(/\D/g, ''); if (d[0] === '7' || d[0] === '8') d = d.slice(1); return d.slice(0, 10); }
  function fmt(d) {
    var o = '+7 (' + d.slice(0, 3);
    if (d.length >= 3) o += ') ' + d.slice(3, 6);
    if (d.length >= 6) o += '-' + d.slice(6, 8);
    if (d.length >= 8) o += '-' + d.slice(8, 10);
    return d.length ? o : '';
  }
  function phoneOk(d) { return d.length === 10 && !/^(\d)\1+$/.test(d) && /^[3489]/.test(d) && !/^(333|444|888)/.test(d); }
  $$('input[data-phone]').forEach(function (inp) {
    inp.addEventListener('input', function () { inp.value = fmt(digits(inp.value)); inp.classList.remove('err'); inp.removeAttribute('aria-invalid'); });
    inp.addEventListener('focus', function () { if (!inp.value) inp.value = '+7 ('; });
    inp.addEventListener('blur', function () { if (inp.value === '+7 (') inp.value = ''; });
  });
  $$('form[data-form]').forEach(function (fm) {
    fm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = fm.querySelector('[data-fmsg]'), bad = false;
      $$('input[data-phone]', fm).forEach(function (inp) {
        if (!phoneOk(digits(inp.value))) { bad = true; inp.classList.add('err'); inp.setAttribute('aria-invalid', 'true'); inp.focus(); }
      });
      fm.dataset.state = bad ? 'bad' : 'ok';
      if (msg) { msg.classList.toggle('bad', bad); msg.textContent = bad ? 'Проверьте номер: нужен мобильный или городской, 10 цифр после +7' : 'Спасибо! Перезвоним в течение 15 минут'; }
    });
  });
  // слайдер первого экрана: сам каждые 5 с, точки снизу, пауза при наведении и фокусе
  $$('[data-slider]').forEach(function (sl) {
    var items = $$('[data-sl]', sl), dots = $$('[data-sl-go]', sl), i = 0, paused = false;
    function show(n) { i = (n + items.length) % items.length; items.forEach(function (x, k) { x.classList.toggle('on', k === i); }); dots.forEach(function (x, k) { x.classList.toggle('on', k === i); x.setAttribute('aria-current', k === i ? 'true' : 'false'); }); }
    dots.forEach(function (d) { d.addEventListener('click', function () { show(+d.dataset.slGo); }); });
    ['mouseenter', 'focusin'].forEach(function (ev) { sl.addEventListener(ev, function () { paused = true; }); });
    ['mouseleave', 'focusout'].forEach(function (ev) { sl.addEventListener(ev, function () { paused = false; }); });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(function () { if (!paused && !document.hidden) show(i + 1); }, +(sl.dataset.interval || 3500));
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });

  // подсветка текущего раздела в меню
  var links = $$('[data-spy]');
  var ids = links.map(function (a) { return a.getAttribute('href').slice(1); }).filter(function (v, i, a) { return a.indexOf(v) === i; });
  function spy() {
    var hh = Math.max(($('.hdr') || { offsetHeight: 0 }).offsetHeight + 24, innerHeight * 0.4), cur = '';
    ids.forEach(function (id) { var el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= hh) cur = id; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = ids[ids.length - 1];
    links.forEach(function (a) { var on = a.getAttribute('href') === '#' + cur; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var raf = 0; addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; spy(); }); }, { passive: true });
  addEventListener('resize', function () { if (innerWidth > 1180) menu(false); });
  spy();

  // было / стало
  var ba = $('[data-ba-panel]');
  if (ba) {
    if (params.get('ba') === '0') ba.hidden = true;
    if (window.DragPanel) DragPanel.make(ba, { key: 'sites-home-ba', handle: '.ba-grip', side: 'right', top: function () { return innerHeight - 76; } });
  }
})();
