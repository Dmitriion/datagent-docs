# Security Operations Runbook — docs.datagent.ru

**Не публиковать.** Исключён из docs plugin и sitemap.

Короткий процесс для маленькой команды. Без WAF/SSO/DAST.

---

## Немедленно

1. GitHub → Settings → Code security → **Secret scanning** (+ **Push protection**, если доступно).
2. Проверить collaborators и права; убрать лишние admin.
3. 2FA для всех maintainers.
4. Branch protection на `main`: PR required; status checks `typecheck`/`build` (+ gitleaks при наличии); запрет force-push.
5. Pages: Source = **GitHub Actions** (не `main/(root)`). **Enforce HTTPS** для `docs.datagent.ru`: Settings → Pages → чекбокс (см. README). Не публиковать `main/(root)`.
6. Убедиться, что в Actions нет лишних repository secrets с prod-токенами docs (обычно достаточно `GITHUB_TOKEN`).
7. Закрыть открытые P0/P1 из `SECURITY-HARDENING-REPORT.md` (на 2026-07-16 активных P0 нет).

---

## Ежемесячно

| Действие | Как |
|---|---|
| Dependency review | `npm audit`; Dependabot PR (не `--force`) |
| Actions | permissions, triggers, отсутствие `pull_request_target` / `curl \| bash` |
| Public build | после `npm run build` — нет audit/report/security runbooks / `.env` / keys |
| Trackers / embeds | новые external scripts только осознанно |
| Docs spot-check | нет реальных credentials в примерах |

---

## Перед каждым релизом docs

1. `npm run typecheck`
2. `npm run build`
3. Secret scan (Gitleaks workflow / локально)
4. Diff public assets: нет внутренних отчётов в `build/`
5. Deploy через `deploy.yml` (не случайный fallback `gh-pages`, если Source=Actions)
6. Smoke: homepage + 2–3 docs URL по HTTPS

---

## Host headers (GitHub Pages / CDN)

GitHub Pages **не** выставляет произвольные HTTP-заголовки. В `docusaurus.config.ts` уже есть best-effort `<meta>`: Referrer-Policy и baseline CSP (Docusaurus + Яндекс.Метрика). `frame-ancestors` в meta браузеры игнорируют.

Порядок на CDN (если появится Cloudflare или аналог — проект его сам не подключает):

1. **Enforce HTTPS** в Settings → Pages (обязательный ручной шаг; API `https_enforced` из CI — 403)
2. HSTS (после проверки HTTPS)
3. `X-Content-Type-Options: nosniff`
4. `Referrer-Policy: strict-origin-when-cross-origin`
5. `Permissions-Policy`
6. `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'`
7. CSP как HTTP-заголовок (сейчас baseline уже в HTML meta; не ломать `mc.yandex.ru` / `mc.yandex.com` и `/js/yandex-metrika.js`)

---

## CODEOWNERS (рекомендация)

Для `.github/workflows/**` и `docusaurus.config.*` — review владельца перед merge. Файл CODEOWNERS создавать только когда известны GitHub handles.

---

## Что не делать

- Auth / CAPTCHA / WAF на публичных docs  
- Блокировка Googlebot / Yandex / OAI-SearchBot / Perplexity без решения владельца  
- Жёсткая CSP без inventory  
- `npm audit fix --force` / major bump Docusaurus ради audit  
- Автоматический rewrite Git history без явного ОК
