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

### Источник публикации (обязательно)

В репозитории: **Settings → Pages → Build and deployment → Source** должно быть **GitHub Actions** (workflow [Deploy docs to GitHub Pages](.github/workflows/deploy.yml)).

**Нельзя** публиковать с **Deploy from a branch → `main` / `(root)`**. В этом режиме на сайте отдаётся корневой `README.md` и сырой `docs/*.md` без сборки Docusaurus — без navbar, sidebar и стилей.

После смены Source на GitHub Actions: **Actions → Deploy docs to GitHub Pages → Run workflow** (ветка `main`).

### Автоматический деплой

Push в `main` запускает workflow: `npm run build` → артефакт из папки `build/` → `deploy-pages`.
