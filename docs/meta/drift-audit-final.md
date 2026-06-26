# Финальный drift-audit — 15 июня 2026

Прогон по чеклисту Фазы 9 (`docs/sync-phase-9-qa`).  
База: `main` @ `6ff1fa3`, `npm run build` — **SUCCESS** (`onBrokenLinks: throw`).

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

## Сводка по категориям

| Проверка | Результат |
|----------|-----------|
| PRO / 2 000 run / Business 3 900 в user-facing `docs/` | **0** (кроме `meta/VOCAB-CANON`, `meta/DOC-PLAN` — исторический контекст) |
| Paperclip | **0** |
| localhost в intro / cloud / guides | **0** |
| localhost в tutorials/build-plugin, agent-architecture | Есть — **допустимо** (dev / API tutorial) |
| Broken links (`npm run build`) | **0** |
| Orphan страницы в sidebar | **0** публичных (см. ниже) |
| Plan gates vs `pricing.md` | **Совпадают** (BrowserBridge/Bitrix24/аннотации Studio+; 1С Business+; артефакты Solo+; Telegram без gate) |
| CTA `app.datagent.ru` | intro, getting-started, index, docusaurus navbar/footer — **≥ 4** |

### Orphan-скрипт (ложные срабатывания)

Файлы `docs/api-reference/{agents,issues,memory,plugins,artifacts,access}.md` в sidebar зарегистрированы как `api-reference/*-api` (id frontmatter). Пути на диске ≠ id в `sidebars.ts` — это ожидаемо, не orphan.

Намеренно вне sidebar: `docs/meta/*`, `docs/BRAND.md`, `docs/getting-started/*` (redirect / exclude).
