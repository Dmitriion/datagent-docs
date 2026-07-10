/**
 * Яндекс.Метрика для docs.datagent.ru (счётчик 110571227).
 * Docusaurus clientModule: init once + hit on client-side route changes.
 */
declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

const COUNTER_ID = 110571227;

function ensureMetrika(): void {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ym-docs-script')) return;

  const script = document.createElement('script');
  script.id = 'ym-docs-script';
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  script.onload = () => {
    window.ym?.(COUNTER_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  };
  document.head.appendChild(script);

  if (!document.getElementById('ym-docs-noscript')) {
    const noscript = document.createElement('noscript');
    noscript.id = 'ym-docs-noscript';
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${COUNTER_ID}" style="position:absolute;left:-9999px" alt="" /></div>`;
    document.body.appendChild(noscript);
  }
}

if (typeof window !== 'undefined') {
  ensureMetrika();
}

export function onRouteDidUpdate({
  location,
  previousLocation,
}: {
  location: {pathname: string; search: string; hash: string};
  previousLocation?: {pathname: string; search: string; hash: string} | null;
}): void {
  ensureMetrika();
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
