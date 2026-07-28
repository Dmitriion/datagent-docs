/**
 * Яндекс.Метрика для docs.datagent.ru (счётчик 110571227).
 * Init живёт только в static/js/yandex-metrika.js (один bootstrap).
 * Этот client module только шлёт SPA hit при клиентских переходах — без init.
 */
declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

const COUNTER_ID = 110571227;

export function onRouteDidUpdate({
  location,
  previousLocation,
}: {
  location: {pathname: string; search: string; hash: string};
  previousLocation?: {pathname: string; search: string; hash: string} | null;
}): void {
  if (!previousLocation) return;
  if (
    previousLocation.pathname === location.pathname &&
    previousLocation.search === location.search &&
    previousLocation.hash === location.hash
  ) {
    return;
  }
  window.ym?.(COUNTER_ID, 'hit', location.pathname + location.search + location.hash);
}
