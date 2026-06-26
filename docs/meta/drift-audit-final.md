# Финальный drift-audit — 15 июня 2026

Прогон: **Фаза 9** + **финальная QA** (`docs/sync-final-qa`).  
База: фазы 0–9, `npm run build` — **SUCCESS** (`onBrokenLinks: throw`), **82** HTML-страниц.

## Найдено (требует отдельного PR)

| Файл | Строка | Проблема |
|------|--------|----------|
| `docs/guides/06-channels.md` | 11 | В `:::info` написано **Telegram** вместо **Телеграм** (канон VOCAB) |
| `src/pages/index.tsx` | 10, 90–91 | **Telegram** / **AI** в чипах и hero — не критично, но не единый RU-голос |
| `src/components/HomePaths/index.tsx` | 53 | Подпись «История версий» вместо «История изменений» (компонент не на главной) |
| `docs/concepts/agent-architecture.md` | 150 | `localhost:3100` в блоке для разработчиков (`vite-dev`) — вне cloud-потока |

## Критично (блокирует публикацию)

| Файл | Строка | Проблема |
|------|--------|----------|
| — | — | **Не найдено** |

## Сводка по категориям (финальный прогон)

| Проверка | Результат |
|----------|-----------|
| PRO / 2 000 run / Business 3 900 в user-facing `docs/` (без `meta/`) | **0** |
| Paperclip | **0** |
| localhost в intro / cloud / guides / `src/` | **0** |
| localhost в tutorials/build-plugin, agent-architecture | Есть — **допустимо** (dev / API tutorial) |
| Английские заголовки `# Getting Started` и т.п. | **0** |
| Broken links (`npm run build`) | **0** |
| Orphan страницы (публичный контент) | **0** |
| Cross-links `/docs/...` (ручная выборка) | **0** мёртвых |
| Plan gates vs `pricing.md` | **10/10** подтверждено |
| CTA `app.datagent.ru` | intro, getting-started, index, docusaurus — **≥ 4** |
| `static/llms.txt` — устаревшие тарифы | **0** |
| `concepts/*` — блок «Что дальше» | **20/20** |
| `guides/0*` — финал с результатом / следующей главой | **8/8** |

### Orphan-скрипт (ложные срабатывания)

Файлы `docs/api-reference/{agents,issues,memory,plugins,artifacts,access}.md` в sidebar зарегистрированы как `api-reference/*-api` (id frontmatter). Пути на диске ≠ id в `sidebars.ts` — ожидаемо.

Намеренно вне sidebar: `docs/meta/*`, `docs/BRAND.md`, `docs/getting-started/*` (redirect / exclude).
