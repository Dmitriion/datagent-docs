/**
 * Init Яндекс.Метрики — docs.datagent.ru (счётчик 110571227).
 * tag.js подключается отдельным <script src> в head (виден в исходнике/DOM для проверки).
 */
window.ym =
  window.ym ||
  function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
window.ym.l = 1 * new Date();

ym(110571227, 'init', {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
});
