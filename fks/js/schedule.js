/* Мост к утверждённому фильтру Ф-1 (#sf1, его скрипт внутри блока): кнопка «Семинары лектора» ставит фильтр по лектору.
   Наружу: window.Schedule.lecturer(фамилия), window.Schedule.dir(направление). */
(function () {
  'use strict';
  function sf() { var r = document.getElementById('sf1'); return r && r.sf; }
  // сетка карточек без «хвоста»: показываем число, кратное колонкам, остальное по «Показать все» (правило Маши 29.10)
  var root = document.getElementById('sf1'), wrapAll = document.querySelector('[data-sf-all]'), all = false;
  if (root && root.sf && wrapAll) {
    var btn = wrapAll.querySelector('button');
    root.sf.post.push(function () {
      var grid = root.querySelector('.sf-grid'); if (!grid) return;
      var vis = [].slice.call(grid.querySelectorAll('[data-sf-card]')).filter(function (c) { return !c.hidden; });
      var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
      var keep = vis.length;
      if (!all && cols > 1 && vis.length > cols && vis.length % cols) keep = vis.length - vis.length % cols;
      vis.forEach(function (c, k) { if (k >= keep) c.hidden = true; });
      wrapAll.hidden = keep === vis.length; btn.textContent = 'Показать все (' + vis.length + ')';
    });
    btn.addEventListener('click', function () { all = true; root.sf.render(); });
    var t = 0; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { root.sf.render(); }, 150); });
    root.sf.render();
  }
  window.Schedule = {
    lecturer: function (sur) { var s = sf(); if (!s) return; s.reset(); s.set('lect', sur); },
    dir: function (d) { var s = sf(); if (!s) return; s.reset(); s.set('dir', d); }
  };
})();
