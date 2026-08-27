/**
 * Yandex Metrika counter IDs for docs.datagent.ru.
 *
 * Agent documentation (everything except `/docs/apps/*`): 110571227.
 * Bitrix Marketplace apps contour (`/docs/apps/*`): a separate counter.
 *
 * Do not reuse:
 * - 110571227 — this site's agent-docs counter
 * - 110571216 — datagent.ru landing (agent marketing)
 */

export const AGENT_DOCS_COUNTER_ID = 110571227;

/**
 * PLACEHOLDER until ops creates a dedicated counter for the apps contour.
 * While `0`, `/docs/apps/*` sends no hits and must not fall back to 110571227.
 */
export const APPS_DOCS_COUNTER_ID = 0;

export function isAppsDocsPath(pathname: string): boolean {
  return pathname === '/docs/apps' || pathname.startsWith('/docs/apps/');
}

/** `null` means do not init or hit any counter (apps placeholder). */
export function metrikaCounterIdForPath(pathname: string): number | null {
  if (isAppsDocsPath(pathname)) {
    return APPS_DOCS_COUNTER_ID > 0 ? APPS_DOCS_COUNTER_ID : null;
  }
  return AGENT_DOCS_COUNTER_ID;
}
