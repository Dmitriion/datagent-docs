/**
 * Яндекс.Метрика — единственный bootstrap для docs.datagent.ru (счётчик 110571227).
 *
 * Владеет: stub ym + очередь, async inject tag.js, ровно один init.
 * Не подключать mc.yandex.ru/metrika/tag.js отдельно из HTML.
 */
(function (window, document) {
  var TAG_SRC = 'https://mc.yandex.ru/metrika/tag.js';
  var INIT_FLAG = '__datagentYmInit110571227';

  if (window[INIT_FLAG]) {
    return;
  }
  window[INIT_FLAG] = true;

  window.ym =
    window.ym ||
    function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
  window.ym.l = 1 * new Date();

  var scripts = document.scripts || document.getElementsByTagName('script');
  var tagAlreadyPresent = false;
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src === TAG_SRC) {
      tagAlreadyPresent = true;
      break;
    }
  }

  if (!tagAlreadyPresent) {
    var s = document.createElement('script');
    s.async = true;
    s.src = TAG_SRC;
    s.onerror = function () {
      // SDK unavailable (network / blocker) — do not break the docs app.
    };
    var first = document.getElementsByTagName('script')[0];
    if (first && first.parentNode) {
      first.parentNode.insertBefore(s, first);
    } else {
      (document.head || document.documentElement).appendChild(s);
    }
  }

  ym(110571227, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
})(window, document);
