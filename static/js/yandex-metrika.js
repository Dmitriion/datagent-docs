/**
 * Init Яндекс.Метрики — docs.datagent.ru.
 * tag.js подключается отдельным <script src> в head (виден в исходнике/DOM для проверки).
 *
 * Счётчики:
 * - 110571227 — документация ИИ-агентов (всё, кроме /docs/apps/*)
 * - APPS_DOCS_COUNTER_ID — контур приложений Маркетплейса (/docs/apps/*)
 *
 * Не использовать 110571216 (лендинг datagent.ru) и не ставить счётчик агентов
 * на /docs/apps/*.
 */
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

function datagentDocsMetrikaId(pathname) {
  if (datagentDocsIsAppsPath(pathname)) {
    return APPS_DOCS_COUNTER_ID > 0 ? APPS_DOCS_COUNTER_ID : 0;
  }
  return AGENT_DOCS_COUNTER_ID;
}

window.__datagentMetrikaInited = window.__datagentMetrikaInited || new Set();

var datagentMetrikaId = datagentDocsMetrikaId(location.pathname);
if (datagentMetrikaId) {
  ym(datagentMetrikaId, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
  window.__datagentMetrikaInited.add(datagentMetrikaId);
}
