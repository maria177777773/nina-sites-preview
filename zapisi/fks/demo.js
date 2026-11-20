// Демо «Семинары в записи» на копии сайта ФКС-Центра (20.11.2026).
// Вариант меню берётся из data-v у тега <script> или из ?v= адреса: 1 — отдельный пункт «Записи», 2 — список под «Расписание».
// Заявки с копии НЕ отправляются: отправку формы перехватываем.
(function () {
  'use strict'
  var BASE = 'https://maria177777773.github.io/nina-sites-preview/zapisi/fks/'
  var me = document.currentScript
  var qv = new URLSearchParams(location.search).get('v')
  var V = qv === '1' || qv === '2' ? qv : (me && me.getAttribute('data-v')) || '2'
  var PAGE = me && me.getAttribute('data-page')
  var REC = BASE + 'zapisi/?v=' + V
  var RASP = 'https://center-fks.ru/raspisanie'

  var css = document.createElement('style')
  css.textContent = [
    '.zd-drop{position:fixed;z-index:99999;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(20,30,60,.16);padding:8px;min-width:240px;display:none;font-family:Inter,Arial,sans-serif}',
    '.zd-drop.on{display:block}',
    '.zd-drop a{display:block;padding:11px 14px;border-radius:8px;color:#292929;font-size:16px;text-decoration:none;white-space:nowrap}',
    '.zd-drop a:hover{background:#f3f7ff;color:#426bbd}',
    '.zd-chev{display:inline-block;width:8px;height:8px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);margin:0 0 4px 8px}',
    '.zd-bar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:99998;background:#121619;color:#fff;border-radius:14px;padding:12px 16px;display:flex;gap:12px;align-items:center;font:500 15px/1.3 Inter,Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:calc(100% - 24px);flex-wrap:wrap;justify-content:center}',
    '.zd-bar a{color:#121619;background:#fff;border-radius:9px;padding:8px 14px;text-decoration:none;white-space:nowrap}',
    '.zd-bar a.on{background:#426bbd;color:#fff}',
    '.zd-toast{position:fixed;left:50%;top:24px;transform:translateX(-50%);z-index:100000;background:#1e7b45;color:#fff;border-radius:12px;padding:14px 20px;font:500 16px Inter,Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.2)}',
    '.zd-sub a{padding-left:28px!important;font-size:.92em!important}'
  ].join('')
  document.head.appendChild(css)

  // ── плашка демо внизу ──
  function bar() {
    var b = document.createElement('div')
    b.className = 'zd-bar'
    b.innerHTML = '<span>Демо на копии сайта. Меню:</span>' +
      '<a href="' + BASE + 'v1/"' + (V === '1' ? ' class="on"' : '') + '>Вариант 1: пункт «Записи»</a>' +
      '<a href="' + BASE + 'v2/"' + (V === '2' ? ' class="on"' : '') + '>Вариант 2: список под «Расписание»</a>'
    document.body.appendChild(b)
  }

  // ── заявки с копии не уходят ──
  function toast(t) {
    var d = document.createElement('div'); d.className = 'zd-toast'; d.textContent = t
    document.body.appendChild(d); setTimeout(function () { d.remove() }, 3500)
  }
  function stop(e) {
    var t = e.target
    if (e.type === 'submit' || (t.closest && t.closest('.t-submit, button[type=submit]'))) {
      e.preventDefault(); e.stopImmediatePropagation(); toast('Это демо: заявка не отправлена')
    }
  }
  window.addEventListener('submit', stop, true)
  window.addEventListener('click', stop, true)

  // ── шапка: свободный блок Тильды, пункты по координатам ──
  var NAV = ['Расписание', 'Лекторы', 'Отзывы', 'О нас', 'Контакты']
  function headerElems() {
    var out = {}
    document.querySelectorAll('.t396 .tn-elem').forEach(function (el) {
      var a = el.querySelector('a.tn-atom, .tn-atom')
      if (!a) return
      var t = a.textContent.trim()
      var r = el.getBoundingClientRect()
      if (NAV.indexOf(t) >= 0 && r.top < 160 && r.width > 0 && !out[t]) out[t] = el
    })
    return out
  }
  // Тильда сама переписывает left и width у пунктов: сдвигаем через свой стиль с !important (transform она не трогает)
  function pos(rules) {
    var st = document.getElementById('zd-pos')
    if (!st) { st = document.createElement('style'); st.id = 'zd-pos'; document.head.appendChild(st) }
    st.textContent = '@media (min-width:960px){' + rules.join('') + '}'
  }
  function sel(el) { return el.getAttribute('data-elem-id') ? '.tn-elem[data-elem-id="' + el.getAttribute('data-elem-id') + '"]' : '.zd-item' }
  function after(h, add) {
    return ['Лекторы', 'Отзывы', 'О нас', 'Контакты'].map(function (k) { var el = h[k]; return el ? sel(el) + '{transform:translateX(' + add + 'px)!important}' : '' })
  }
  function v1() {
    var h = headerElems(), rasp = h['Расписание']
    if (!rasp) return false
    var c = document.querySelector('.zd-item')
    if (!c) {
      c = rasp.cloneNode(true)
      c.classList.add('zd-item')
      c.removeAttribute('data-elem-id')
      var a = c.querySelector('.tn-atom')
      a.setAttribute('href', REC); a.removeAttribute('target')
      var txt = a.querySelector('.tn-atom__button-text') || a
      txt.textContent = 'Записи'
      // стили Тильды привязаны к data-elem-id: переносим цвет и шрифт пункта «Расписание»
      var ra = rasp.querySelector('.tn-atom'), cs = getComputedStyle(ra)
      ;['color', 'fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'display', 'alignItems', 'justifyContent', 'height', 'textDecoration'].forEach(function (k) { a.style[k] = cs[k] })
      c.style.position = 'absolute'; c.style.zIndex = getComputedStyle(rasp).zIndex
      rasp.parentNode.insertBefore(c, rasp.nextSibling)
    }
    // шаг между пунктами 22 px вместо 30: иначе «Контакты» налезают на телефон в шапке
    var w = 66, gap = 22, x = rasp.offsetLeft + rasp.offsetWidth + gap
    var rules = ['.zd-item{top:' + rasp.offsetTop + 'px!important;left:' + rasp.offsetLeft + 'px!important;width:' + w + 'px!important;height:' + rasp.offsetHeight + 'px!important;transform:translateX(' + (x - rasp.offsetLeft) + 'px)!important}',
      '.zd-item .tn-atom{width:' + w + 'px!important}']
    x += w + gap
    ;['Лекторы', 'Отзывы', 'О нас', 'Контакты'].forEach(function (k) {
      var el = h[k]; if (!el) return
      rules.push(sel(el) + '{transform:translateX(' + (x - el.offsetLeft) + 'px)!important}')
      x += el.offsetWidth + gap
    })
    pos(rules)
    return true
  }
  var drop
  function v2() {
    var h = headerElems(), rasp = h['Расписание']
    if (!rasp) return false
    var a = rasp.querySelector('.tn-atom')
    var txt = a.querySelector('.tn-atom__button-text') || a
    if (!txt.querySelector('.zd-chev')) txt.insertAdjacentHTML('beforeend', '<i class="zd-chev"></i>')
    var add = 18
    pos([sel(rasp) + '{width:' + (98 + add) + 'px!important}', sel(rasp) + ' .tn-atom{width:' + (98 + add) + 'px!important}'].concat(after(h, add)))
    if (!drop) {
      drop = document.createElement('div'); drop.className = 'zd-drop'
      drop.innerHTML = '<a href="' + RASP + '">Ближайшие семинары</a><a href="' + REC + '">Семинары в записи</a>'
      document.body.appendChild(drop)
      var hide
      function show() { clearTimeout(hide); var r = rasp.getBoundingClientRect(); drop.style.left = Math.max(8, r.left - 14) + 'px'; drop.style.top = (r.bottom + 6) + 'px'; drop.classList.add('on') }
      function later() { hide = setTimeout(function () { drop.classList.remove('on') }, 250) }
      rasp.addEventListener('mouseenter', show); rasp.addEventListener('mouseleave', later)
      drop.addEventListener('mouseenter', show); drop.addEventListener('mouseleave', later)
      window.addEventListener('scroll', function () { drop.classList.remove('on') }, { passive: true })
      // касание: первый тап открывает список, второй ведёт на расписание
      rasp.addEventListener('click', function (e) { if (matchMedia('(hover:none)').matches && !drop.classList.contains('on')) { e.preventDefault(); show() } })
    }
    return true
  }

  // ── мобильное меню (бургер) ──
  function mobile() {
    document.querySelectorAll('.t-menu__link-item, .t450__list_item a, .t-menuburger ~ * a').forEach(function () {})
    var links = Array.prototype.filter.call(document.querySelectorAll('a'), function (x) {
      return /^Расписание/.test(x.textContent.trim()) && !x.closest('.t396') && !x.closest('.zd-bar') && !x.dataset.zd
    })
    links.forEach(function (x) {
      x.dataset.zd = '1'
      var li = x.closest('li') || x
      if (V === '1') {
        var c = li.cloneNode(true), ca = c.tagName === 'A' ? c : c.querySelector('a')
        ca.textContent = 'Записи'; ca.setAttribute('href', REC); ca.dataset.zd = '1'
        li.parentNode.insertBefore(c, li.nextSibling)
      } else {
        ;[['Семинары в записи', REC], ['Ближайшие семинары', RASP]].forEach(function (p) {
          var c = li.cloneNode(true), ca = c.tagName === 'A' ? c : c.querySelector('a')
          ca.textContent = p[0]; ca.setAttribute('href', p[1]); ca.dataset.zd = '1'
          c.classList.add('zd-sub')
          li.parentNode.insertBefore(c, li.nextSibling)
        })
      }
    })
  }

  function apply() { (V === '1' ? v1 : v2)(); mobile() }
  var tries = 0
  function boot() {
    bar(); mobile()
    var t = setInterval(function () { tries++; if ((V === '1' ? v1 : v2)() || tries > 40) { clearInterval(t); mobile() } }, 250)
    var rt
    window.addEventListener('resize', function () {
      clearTimeout(rt)
      rt = setTimeout(function () {
        setTimeout(function () { (V === '1' ? v1 : v2)() }, 400)
      }, 300)
    })
    if (PAGE === 'zapisi') recordings()
  }

  // ── страница «Семинары в записи» ──
  var ITEMS = [
    { t: 'Нововведения в сфере регулирования 44-ФЗ и 223-ФЗ', d: '18–20 ноября 2026', topic: 'buy', who: 'Лектор: Бабунов С.В.', len: '3 дня', url: 'https://center-fks.ru/18-20nov-zakupki-spb' },
    { t: 'Антидробление и безразрывный НДС. Налоговые проверки и споры: от допроверочной стадии до рассмотрения материалов', d: '19–20 ноября 2026', topic: 'tax', who: 'Лекторы: Ряховский Д.И., Кузьминых А.Е.', len: '2 дня', url: 'https://center-fks.ru/19-20nov-nalogi-msk' },
    { t: 'Гособоронзаказ. Эволюция требований к организации раздельного учета ГОЗ: прозрачная себестоимость, учет фактических затрат и ежемесячная справка', d: '16 ноября 2026', topic: 'goz', who: 'Лектор: Хабарова Л.П.', len: '1 день', url: 'https://center-fks.ru/goz-msk' },
    { t: 'ИП-управляющий: как не надо делать и как можно (но лучше всё равно не делать)', d: '16 ноября 2026', topic: 'tax', who: 'Лектор: Артём К.', len: 'вебинар', url: 'https://center-fks.ru/nalogi-web-2026' },
    { t: 'Налоговая оптимизация 2026–2027: безопасные методы, налоговые риски и практические решения', d: '19–20 октября 2026', topic: 'tax', who: 'Лектор: Джаарбеков С.М.', len: '2 дня', url: 'https://center-fks.ru/19-20okt-nalogi-msk' }
  ]
  var NAMES = { goz: 'ГОЗ', buy: 'Закупки', tax: 'Бухгалтерия и налоги' }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function recordings() {
    var root = document.getElementById('ecpk-calendar')
    if (!root) return
    var topic = 'all'
    function paint() {
      var list = ITEMS.filter(function (e) { return topic === 'all' || e.topic === topic })
      root.querySelector('#ec-count').textContent = 'Записей: ' + list.length
      root.querySelector('#ec-events').innerHTML = list.map(function (e, i) {
        return '<article class="event"><div class="date"><strong style="font-size:26px">Запись</strong><span>' + esc(e.d) + '</span></div>' +
          '<div><span class="tag">' + NAMES[e.topic] + '</span><h3><a href="' + esc(e.url) + '" target="_blank" rel="noopener">' + esc(e.t) + '</a></h3>' +
          '<div class="meta"><span>' + esc(e.len) + '</span><span>Смотреть в удобное время</span></div><p class="teacher">' + esc(e.who) + '</p></div>' +
          '<div class="actions"><a href="' + esc(e.url) + '" target="_blank" rel="noopener">Программа</a>' +
          '<a href="#popup:schet2" data-zd-buy="' + i + '">Купить запись</a></div></article>'
      }).join('')
    }
    root.querySelectorAll('[data-topic]').forEach(function (b) {
      b.addEventListener('click', function () {
        topic = b.dataset.topic
        root.querySelectorAll('[data-topic]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
        paint()
      })
    })
    root.addEventListener('click', function (ev) {
      var a = ev.target.closest('a[data-zd-buy]'); if (!a) return
      var e = ITEMS[Number(a.dataset.zdBuy)]
      var pop = document.querySelector('.t-popup[data-tooltip-hook="#popup:schet2"]') || document.querySelector('.t-popup[data-tooltip-hook="#popup:schet"]')
      var f = pop && pop.querySelector('form'); if (!f) return
      function put(n, v) { var i = f.querySelector('[name="' + n + '"]'); if (!i) return; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })) }
      put('Название семинара', e.t)
      var sel = f.querySelector('select[name="Формат обучения"]')
      if (sel) { var o = Array.prototype.find.call(sel.options, function (x) { return /запис/i.test(x.textContent) }); if (o) { sel.value = o.value; sel.dispatchEvent(new Event('change', { bubbles: true })) } }
      put('Даты обучения', 'Запись семинара ' + e.d)
      a.setAttribute('href', pop.getAttribute('data-tooltip-hook'))
    })
    paint()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
