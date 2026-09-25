# Datagent Docs

Официальная документация [Datagent](https://datagent.ru) на Docusaurus 3.

## Локальный запуск

```bash
npm install && npm run start
```

Сайт откроется на http://localhost:3000.

## Сборка

```bash
npm run build
npm run serve
```

## Деплой

Сайт: https://docs.datagent.ru (GitHub Pages + CNAME `docs.datagent.ru`).

### Почему на сайте README вместо Docusaurus

Workflow **Deploy docs to GitHub Pages** может быть зелёным, но домен отдаёт **не** сборку `build/`, если в **Settings → Pages** включён неверный источник.

| Source в Settings | Что видит пользователь |
| --- | --- |
| **Branch `main` / `(root)`** | Корневой `README.md` и сырой `docs/*.md` — **сломанный вид** |
| **GitHub Actions** | Сборка Docusaurus из workflow (рекомендуется) |
| **Branch `gh-pages` / `(root)`** | Сборка из ветки `gh-pages` (fallback, см. workflow) |

Проверка: на главной должны быть ink hero и кнопки «Быстрый старт», не блок «Локальный запуск» из этого README.

### Исправление (один раз, вручную)

**Вариант A (рекомендуется):** **Settings → Pages → Build and deployment → Source → GitHub Actions**, затем **Actions → Deploy docs to GitHub Pages → Run workflow**.

**Вариант B (если Actions недоступен):** **Source → Deploy from a branch → `gh-pages` / `(root)`**, затем **Actions → Publish gh-pages branch (fallback) → Run workflow** (не пушить `gh-pages` из основного deploy — иначе красный «pages build and deployment» при Source = GitHub Actions).

**Нельзя** оставлять **Branch `main` / `(root)`**.

### Автоматический деплой

Push в `main` → [deploy.yml](.github/workflows/deploy.yml): `npm run build` → `deploy-pages` (GitHub Actions). Ветку `gh-pages` — только через [deploy-gh-pages-branch.yml](.github/workflows/deploy-gh-pages-branch.yml) при fallback.

Если в **Settings → Pages → Source** сейчас стоит **Deploy from a branch → `gh-pages` / `(root)`**, одного merge в `main` недостаточно для обновления живого `docs.datagent.ru`: нужно либо переключить Source на **GitHub Actions**, либо один раз запустить workflow **Publish gh-pages branch (fallback)**. CI не отключать.

## Enforce HTTPS

Кастомный домен `docs.datagent.ru` уже прописан в корневом `CNAME`. GitHub Pages **не включает** редирект HTTP→HTTPS из репозитория: это чекбокс в настройках.

`http://docs.datagent.ru/` без **Enforce HTTPS** отвечает **200** (без редиректа). API GitHub (`https_enforced`) из CI/агента недоступен (403, нет `pages: write` у integration token).

### Шаги для владельца репозитория

1. Откройте [Settings → Pages](https://github.com/Dmitriion/datagent-docs/settings/pages) репозитория **Dmitriion/datagent-docs**.
2. В **Custom domain** должно быть `docs.datagent.ru` (совпадает с файлом `CNAME`).
3. Дождитесь успешной проверки DNS и сертификата (**TLS certificate is ready** / HTTPS certificate: approved).
4. Включите чекбокс **Enforce HTTPS**.
5. Проверка:

```bash
curl -sI http://docs.datagent.ru/
# ожидается: HTTP/1.1 301 (или 302) и Location: https://docs.datagent.ru/
```

- [ ] **Enforce HTTPS** включён в Settings → Pages (ручной шаг владельца)

## Заголовки безопасности

GitHub Pages **не умеет** задавать произвольные HTTP-заголовки ответа (`Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`).

В сборке Docusaurus есть best-effort через `headTags` в `docusaurus.config.ts`:

- `Referrer-Policy: strict-origin-when-cross-origin`
- baseline `Content-Security-Policy` (Docusaurus inline + локальный поиск + Яндекс.Метрика `mc.yandex.ru` / `mc.yandex.com`)

Полноценные HSTS / CSP / X-Frame-Options как **HTTP-заголовки** — только если перед Pages стоит Cloudflare (или аналог). Проект такой CDN **не** подключает; не добавляйте его «на всякий случай». `frame-ancestors` в meta-CSP браузеры игнорируют.
