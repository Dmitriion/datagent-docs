/**
 * Яндекс.Метрика для docs.datagent.ru.
 * Первый init — в static/js/yandex-metrika.js (один bootstrap, без отдельного tag.js в HTML).
 * Этот client module шлёт SPA hit на счётчик по префиксу пути
 * и goals контура приложений только на `/docs/apps/*`.
 * Init здесь только если bootstrap пропустил счётчик (изоляция /docs/apps/*).
 */
import {
  APPS_DOCS_COUNTER_ID,
  isAppsDocsPath,
  metrikaCounterIdForPath,
} from '../data/yandex-metrika-ids';

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
    __datagentMetrikaInited?: Set<number>;
  }
}

const INIT_OPTIONS = {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
} as const;

function initedSet(): Set<number> {
  if (!window.__datagentMetrikaInited) {
    window.__datagentMetrikaInited = new Set();
  }
  return window.__datagentMetrikaInited;
}

function ensureInit(id: number): void {
  if (!id || initedSet().has(id)) {
    return;
  }
  window.ym?.(id, 'init', INIT_OPTIONS);
  initedSet().add(id);
}

function hit(pathname: string, search: string, hash: string): void {
  const id = metrikaCounterIdForPath(pathname);
  if (!id) {
    return;
  }
  ensureInit(id);
  window.ym?.(id, 'hit', pathname + search + hash);
}

function installGoalForPath(pathname: string): string {
  if (pathname.includes('/requestspro')) {
    return 'cta_install_requestspro';
  }
  if (pathname.includes('/edportal')) {
    return 'cta_install_edportal';
  }
  return 'cta_install_apps';
}

function onDocumentClick(event: MouseEvent): void {
  if (!isAppsDocsPath(window.location.pathname)) {
    return;
  }
  const id = APPS_DOCS_COUNTER_ID;
  if (!id) {
    return;
  }
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  const anchor = target.closest('a');
  if (!anchor) {
    return;
  }
  const href = anchor.getAttribute('href') ?? '';
  if (href.startsWith('mailto:sales@datagent.ru')) {
    window.ym?.(id, 'reachGoal', 'cta_mailto_bitrix');
    window.ym?.(id, 'reachGoal', installGoalForPath(window.location.pathname));
    return;
  }
  if (href.includes('bitrix24.ru/apps') || href.includes('1c-bitrix.ru')) {
    window.ym?.(id, 'reachGoal', installGoalForPath(window.location.pathname));
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('click', onDocumentClick);
}

export function onRouteDidUpdate({
  location,
  previousLocation,
}: {
  location: {pathname: string; search: string; hash: string};
  previousLocation?: {pathname: string; search: string; hash: string} | null;
}): void {
  if (!previousLocation) {
    const firstId = metrikaCounterIdForPath(location.pathname);
    if (firstId) {
      initedSet().add(firstId);
    }
    return;
  }
  if (
    previousLocation.pathname === location.pathname &&
    previousLocation.search === location.search &&
    previousLocation.hash === location.hash
  ) {
    return;
  }
  hit(location.pathname, location.search, location.hash);
}
