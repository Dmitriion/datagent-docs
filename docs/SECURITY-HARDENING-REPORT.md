# Security Hardening Report — docs.datagent.ru

**Не публиковать.** Исключён из docs plugin (`exclude`) и sitemap (`ignorePatterns`).

Дата: 2026-07-16  
Область: `C:\Datagent-docs` (публичный Docusaurus → GitHub Pages → `https://docs.datagent.ru/`)  
Метод: ограниченный review (секреты, публикация, Actions, deps, XSS/JSON-LD, headers на хостинге). Не пентест.

## Вердикт

**Нет критичных находок (P0).**  
Найдены и частично закрыты **P1/P2** hardening-пункты (права Actions, JSON-LD, gitignore, exclusions). Активных credentials в working tree не обнаружено.

| Приоритет | Область | Находка | Доказательство | Исправление | Статус |
|---|---|---|---|---|---|
| P0 | Secrets | Активных API keys / PAT / private keys / `.env` в дереве не найдено | Pattern-scan ~229 файлов (ghp_/sk-/AKIA/PEM/webhooks/DB URLs); `git grep` по выборке истории без совпадений; build HTML без token-паттернов | — | Закрыто (мониторинг) |
| P1 | Actions | Deploy workflow не объявлял `contents: read` при явном `permissions` | `.github/workflows/deploy.yml` | Добавлен `contents: read` рядом с `pages: write` / `id-token: write` | Исправлено |
| P1 | XSS / MDX | `JsonLd` писал `JSON.stringify` в `<script>` без экранирования `<` | `src/components/JsonLd/index.tsx` + `dangerouslySetInnerHTML` | `serializeJsonLd`: `<` → `\u003c` | Исправлено |
| P1 | Actions | Security-scan без явных минимальных permissions; checkout на старом major | `.github/workflows/security-scan.yml` | `permissions: contents: read`; `checkout@v6`; `gitleaks-action@v3` | Исправлено |
| P2 | Hosting headers | На `docs.datagent.ru` нет HSTS / CSP / nosniff / Referrer-Policy / Permissions-Policy / X-Frame-Options | Passive HEAD к production | Только checklist владельца на GitHub Pages / CDN; **не** CSP в HTML | Открыто (владелец) |
| P2 | Git hygiene | Не хватало паттернов backup/archives/coverage/OS | `.gitignore` | Добавлены `Thumbs.db`, `coverage/`, `*.bak`/`*.backup`/`*.old`/`*.orig`, dumps/archives, `.netrc`, `.npmrc` | Исправлено |
| P2 | Publish surface | Новые security-отчёты могли бы попасть в docs, если не исключить | `docusaurus.config.ts` exclude/ignorePatterns | `SECURITY-HARDENING-REPORT.md`, `SECURITY-OPERATIONS-RUNBOOK.md` | Исправлено |
| P2 | Supply chain | `npm audit`: 1 critical / 2 high (транзитивно) | `websocket-driver` ← webpack-dev-server; `serialize-javascript` ← webpack plugins; `undici` ← cheerio (search-local) | Не форсить upgrade: уязвимости в основном build/dev-time, не runtime статики | P3 backlog |
| P2 | Actions pinning | Actions закреплены на major tags (`@v6`), не на commit SHA | workflows | Dependabot для `github-actions` уже weekly; SHA-pin — backlog | Частично (Dependabot есть) |
| P2 | Fallback deploy | `deploy-gh-pages-branch.yml` требует `contents: write` | workflow_dispatch only | Комментарий: использовать только если Pages Source = branch; основной путь — Actions Pages | Принято / документировано |
| P3 | Privacy | Яндекс.Метрика + `webvisor: true` на docs | `static/js/yandex-metrika.js` | Решение владельца (уже осознанный tracker) | Backlog |
| P3 | Lockfile drift | `package.json` указывает Docusaurus 3.10.2, дерево тянет 3.10.1 `invalid` | `npm ls` | Аккуратный `npm ci` / sync lock без major bump | Backlog |
| P3 | Internal docs in Git | `_meta/*`, SEO/QA reports в репозитории | tracked files; уже `exclude: **/_meta/**` и audit excludes | Оставить в Git как внутренние; не публиковать (уже) | Принято |

## Что проверено и признано безопасным / допустимым

- Публичные guides, API, deployment, MCP, Chrome Web Store extension ID, `sales@datagent.ru`, `127.0.0.1` в локальных примерах curl.
- `CNAME` = `docs.datagent.ru` (нужен для Pages).
- Политика robots: search/answer bots allow; GPTBot disallow — **не менялась**.
- Sitemap / llms.txt не содержат audit/security runbooks (после exclusions).
- Source maps в production build: **0**.
- Dependabot: npm + github-actions, weekly, лимиты PR — уже настроен.
- JSON-LD / FAQ / HowTo — данные статические из MDX авторов, не user query params.

## Секреты: действия при будущем P0

1. Удалить из дерева → `.gitignore` → `.env.example` без значений.  
2. **Отозвать и заменить** секрет у провайдера.  
3. Оценить Git history; при подтверждении — `git filter-repo` / GitHub secret remediation **только с явного разрешения владельца**.  
4. Не печатать значения секретов в issues/PR/чатах.

## Host-level checklist (вне репозитория)

1. HTTPS enforcement для custom domain (GitHub Pages).  
2. После стабильного HTTPS — HSTS.  
3. `X-Content-Type-Options: nosniff`.  
4. `Referrer-Policy: strict-origin-when-cross-origin`.  
5. `Permissions-Policy` (отключить неиспользуемые API).  
6. Framing: `X-Frame-Options: DENY` или CSP `frame-ancestors 'self'`.  
7. CSP только **Report-Only** после инвентаря: Docusaurus inline, fonts, `mc.yandex.ru`, images, GitHub.

CSP через `<meta>` **не** внедряли.
