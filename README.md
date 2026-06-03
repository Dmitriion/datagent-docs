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

**Вариант B (если Actions недоступен):** **Source → Deploy from a branch → `gh-pages` / `(root)`** (не `main`). Ветку `gh-pages` обновляет тот же workflow после каждого push в `main`.

**Нельзя** оставлять **Branch `main` / `(root)`**.

### Автоматический деплой

Push в `main` → [deploy.yml](.github/workflows/deploy.yml): `npm run build` → `deploy-pages` + публикация в ветку `gh-pages`.
