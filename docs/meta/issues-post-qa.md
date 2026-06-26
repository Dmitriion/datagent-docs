# Issues после QA (Фаза 9) — не блокируют публикацию

Записи для отдельных PR после релиза документации.  
Дата: 15 июня 2026.

## P3 — Копирайтинг / единый голос

1. **Телеграм vs Telegram** — в `guides/06-channels.md` (info-блок) и на главной `index.tsx` осталось латиницей. Канон: [VOCAB-CANON](./VOCAB-CANON-2026-Q3.md).
2. **HomePaths** — подпись «История версий» → «История изменений» (`src/components/HomePaths/index.tsx`).

## P4 — Dev-only контент (не трогать в cloud-потоке)

1. `tutorials/build-plugin.md` — `127.0.0.1:3100` в примере `curl` (допустимо).
2. `concepts/agent-architecture.md` — `localhost:3100` в `<details>` про vite-dev.

## P4 — Gap table (из DOC-PLAN)

Остаются **24 Missing** и **18 Partial** в gap-таблице Q3 — цели пост-QA, не блокер публикации текущего sync.
