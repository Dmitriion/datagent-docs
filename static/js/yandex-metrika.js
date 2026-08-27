/**
 * Яндекс.Метрика — единственный bootstrap для docs.datagent.ru.
 *
 * Владеет: stub ym + очередь, async inject tag.js, init выбранного счётчика.
 * Не подключать mc.yandex.ru/metrika/tag.js отдельно из HTML.
 *
 * Счётчики:
 * - 110571227 — документация ИИ-агентов (всё, кроме /docs/apps/*)
 * - APPS_DOCS_COUNTER_ID — контур приложений Маркетплейса (/docs/apps/*)
 *
 * Не использовать 110571216 (лендинг datagent.ru) и не ставить счётчик агентов
 * на /docs/apps/*.
 */
(function (window, document) {
  var TAG_SRC = 'https://mc.yandex.ru/metrika/tag.js';
  var INIT_FLAG = '__datagentYmBootstrap';

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

  var AGENT_DOCS_COUNTER_ID = 110571227;
  // PLACEHOLDER: dedicated counter for /docs/apps/* (EDPortal, Заявки PRO).
  // Replace when ops creates the counter. 0 = do not init (no fallback to 110571227).
  var APPS_DOCS_COUNTER_ID = 0;

  function datagentDocsIsAppsPath(pathname) {
    return pathname === '/docs/apps' || pathname.indexOf('/docs/apps/') === 0;
  }

  window.__datagentMetrikaInited = window.__datagentMetrikaInited || new Set();

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

  if (datagentDocsIsAppsPath(location.pathname)) {
    if (APPS_DOCS_COUNTER_ID > 0) {
      ym(APPS_DOCS_COUNTER_ID, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
      window.__datagentMetrikaInited.add(APPS_DOCS_COUNTER_ID);
    }
    return;
  }

  ym(110571227, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
  window.__datagentMetrikaInited.add(AGENT_DOCS_COUNTER_ID);
})(window, document);
