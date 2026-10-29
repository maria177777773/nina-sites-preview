/* Новые главные: меню (бургер, подсветка раздела), плавные якоря, «Показать всех лекторов», связь лектор → расписание, «Было / Стало». */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var params = new URLSearchParams(location.search);

  function go(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
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
  $$('form[data-form]').forEach(function (fm) { fm.addEventListener('submit', function (e) { e.preventDefault(); }); });
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
