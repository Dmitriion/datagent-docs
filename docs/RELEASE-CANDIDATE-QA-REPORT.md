---
id: release-candidate-qa-report
title: Release Candidate QA — отчёт
sidebar_label: RC QA
unlisted: true
---

# Release Candidate QA — финальный проход

Дата: 2026-07-16  
Область: публичная документация docs.datagent.ru (локальный preview `http://127.0.0.1:3001`)  
База: `docs/FINAL-DOCS-POLISH-REPORT.md` (P0/P1 уже закрыты — не повторялись)

| Критерий | Статус |
| --- | --- |
| Browser QA 390 / 1440 | ✅ |
| P1 визуальные дефекты исправлены | ✅ |
| Emoji на стартовых карточках | ✅ убраны |
| Concepts: смягчение «Вы» | ✅ точечно |
| Agent Architecture — верх для операторов | ✅ |
| llms.txt how-it-works без дубля | ✅ |
| SVG без изменений файлов | ✅ |
| Отчёт исключён из публикации | ✅ `exclude` + `unlisted` |
| `npm run typecheck` / `npm run build` | ✅ |

---

## 1. Browser QA

### Viewports

- Desktop: **1440 × 900**
- Mobile: **390 × 844**
- Тема: светлая и тёмная (переключатель navbar)

### Проверенные страницы

| URL | 390 | 1440 | Примечание |
| --- | --- | --- | --- |
| `/` | ✅ | ✅ | Hero, карточки, CTA |
| `/docs/concepts/what-is-datagent` | ✅ | — | FAQ, breadcrumbs |
| `/docs/cloud` | ✅ | — | FAQ, dual-path |
| `/docs/tutorials` | ✅ | — | карточки сценариев |
| `/docs/guides` | ✅ | — | каталоги по ролям |
| `/docs/integrations` → `…/overview` | ✅ | — | редирект/alias OK |
| `/docs/integrations/moysklad` | ✅ | — | 211 tools, только чтение |
| `/docs/workflows/pipelines` | ✅ | — | SVG board/review/mobile |
| `/docs/concepts/agent-architecture` | ✅ | — | «Если коротко» / «Для ИТ» |
| `/docs/integrations/mcp` | ✅ | — | |
| `/docs/cloud/on-premise` | ✅ | — | свой контур |
| `/llms.txt` | HTTP 200 | | |

HTTP-проверка всех ключевых маршрутов: **200**.

### Найденные и исправленные дефекты (P1)

1. **Announcement bar emoji** `🚀` — убран из `docusaurus.config.ts`.
2. **Обрезка «Datagent» в navbar на 390 px** — `max-width` на brand снят; на ≤480 px title скрыт (логотип достаточно); `flex-shrink: 0` на title для промежуточных ширин.
3. **Кнопка «Сайт» не скрывалась на ≤768 px** — `display: inline-flex !important` у `.navbar--btn-outline` перекрывал `.navbar__link--hide-md`; добавлен media-override **после** pill-кнопок.
4. **Hero на mobile: превью выше H1** — убран `order: -1` у `.heroPreview` (сначала заголовок и CTA, затем превью).
5. **Hero copy** «а вы контролируете…» → «а контроль остаётся в журнале и согласованиях».

### Проверено — правок не потребовалось

- Горизонтальный скролл на ключевых страницах: `overflowX: false`
- Карточки homepage в одну колонку на 390
- FAQ (details/кнопки) на concepts/cloud/tutorials/guides/integrations
- Code blocks / таблицы на architecture и MCP — без поломки layout
- Breadcrumbs и sidebar (hamburger на mobile)
- SVG на `/docs/workflows/pipelines` загружаются (`pipelines-board.svg` и др.; файлы не менялись)
- Focus на CTA: видимый `box-shadow` от pill-стиля
- Тёмная тема: hero и navbar читаемы

---

## 2. Visual polish

### Emoji

- Убраны декоративные emoji с карточек разделов на homepage (`src/pages/index.tsx` — без `icon`-поля).
- Убран 🚀 из announcement bar.
- Бейдж «⏱ ~5 мин» ранее заменён на: `Free: до 3 агентов и 100 запусков в месяц · без карты`.

### Прочее

- Минимальные CSS-правки navbar/hero (без нового редизайна, без новых зависимостей).
- **SVG-файлы и imports не изменялись.**

---

## 3. Copywriting

### Concepts — смягчение «Вы» (не механическая замена)

Затронуты в том числе: `what-is-datagent.mdx`, `memory.md`, `inbox.md`, `approvals.md`, плюс ранее в сессии — `how-it-works`, `agents`, `secrets`, `workspaces`, `channels`, `credits` и др.

Примеры:

- Lead what-is: контроль через панель, без «вы контролируете».
- memory / inbox: нейтральные конструкции без навязчивого «вы» в соседних фразах.
- approvals: заголовок «Как узнать о запросе».

Оставлены «вы», где нужны для ясности инструкции (согласования, выбор модели и т.п.).

### Agent Architecture

Файл: `docs/concepts/agent-architecture.md`  
Route: `/docs/concepts/agent-architecture`

- Переписан вводный абзац (зачем страница оператору).
- Добавлен блок **«Если коротко»** (5 тезисов).
- Добавлен переход **«Для ИТ-команды»** перед диаграммами и пакетами.
- Термины в верхней части пояснены по-русски; ниже сохранены точные имена пакетов/слоёв.
- «только чтение» вместо голого Read-only в инвариантах коннекторов.

---

## 4. Маршрутизация и llms.txt

### how-it-works

- Стабильных отдельных public anchors для product vs security **нет** → искусственные якоря **не создавались**.
- В `static/llms.txt` оставлена **одна** запись:
  - `https://docs.datagent.ru/docs/concepts/how-it-works` — цикл задачи + секреты/права.
- Дублирующая security-строка с тем же URL удалена ранее в RC.

### Публикация служебных отчётов

`docusaurus.config.ts` → `docs.exclude` включает:

- `**/FINAL-DOCS-POLISH-REPORT.md`
- `**/RELEASE-CANDIDATE-QA-REPORT.md`
- (+ audit/polish patterns)

В `build/` отчёты не попадают. В `llms.txt` и sidebar — нет.

---

## 5. Проверки

| Команда | Результат |
| --- | --- |
| `npm run typecheck` | OK |
| `npm run build` | OK |
| HTTP 200 на ключевых URL (локальный serve :3001) | OK |

Скрипта `lint` / отдельного link-checker в `package.json` нет — внутренние маршруты сверены HTTP + browser.

---

## 6. Остаточный backlog (≤3, не блокирует релиз)

1. **Focus ring** на pill-CTA опирается на `box-shadow`, не на стандартный `outline` — при желании усилить `:focus-visible` отдельно.
2. **FAQ в what-is** ещё содержит единичное «вы создаёте…» в ответе — можно смягчить в следующем микро-проходе.
3. **Широкие таблицы** на отдельных API/connector pages на 390 px — горизонтальный scroll контейнера таблицы (норма Docusaurus); при жалобах — точечный `overflow-x` wrapper, без смены структуры.
