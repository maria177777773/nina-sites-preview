/* Мост к утверждённому фильтру Ф-1 (#sf1, его скрипт внутри блока): кнопка «Семинары лектора» ставит фильтр по лектору.
   Наружу: window.Schedule.lecturer(фамилия), window.Schedule.dir(направление). */
(function () {
  'use strict';
  function sf() { var r = document.getElementById('sf1'); return r && r.sf; }
  window.Schedule = {
    lecturer: function (sur) { var s = sf(); if (!s) return; s.reset(); s.set('lect', sur); },
    dir: function (d) { var s = sf(); if (!s) return; s.reset(); s.set('dir', d); }
  };
})();
