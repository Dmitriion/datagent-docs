---
title: DOC-PLAN 2026 Q3
description: Внутренний план закрытия пробелов документации Datagent (cloud-first). Не в публичном sidebar.
---

# DOC-PLAN-2026-Q3

**Аудитория:** операторы [app.datagent.ru](https://app.datagent.ru) — люди, которые ведут агентов в облаке, без своего сервера.  
**Self-hosted:** в публичной справке только enterprise-лендинг [`cloud/on-premise`](../cloud/on-premise.md), не пошаговый runbook.  
**Снимок аудита:** [`audit-snapshot-2026-06-15.json`](./audit-snapshot-2026-06-15.json) (продукт `632e957d9`, docs `692f934`).

## Статус — Фаза 0 (Словарь и канон)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Baseline:** 14 файлов с устаревшим PRO, 29 строк тарифного дрейфа, 15 уникальных файлов с любым дрейфом лимитов/тарифов
- **Артефакт:** [`meta/VOCAB-CANON-2026-Q3.md`](./VOCAB-CANON-2026-Q3.md)
- **Снимок дрейфа:** [`meta/audit-snapshot-phase0.txt`](./audit-snapshot-phase0.txt)
- **Следующая фаза:** Phase 1 — Тарифы и монетизация

## Статус — Фаза 1 (Тарифы и монетизация)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 6 (`credits`, `what-is-datagent`, `agents`, `budgets`, `company-settings`, `intro`)
- **Устранено строк дрейфа:** 23 из 29 (в шести файлах фазы)
- **Оставшийся дрейф:** ~11 строк в `browser/*`, `integrations/browserbridge.md`, `integrations/bitrix24.md`, `concepts/channels.md`, `concepts/projects.md`, `integrations/gigachat.md` — фазы 2–4
- **Следующая фаза:** Phase 1 polish + Phase 2

## Статус — Фаза 1 polish (Копирайтинг)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 6 (те же страницы concepts + intro)
- **Артефакт:** живой русский, один блок «Что дальше» на страницу

## Статус — Фаза 2 (Вход в облако)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 6 (`intro`, `cloud/getting-started`, `cloud/first-agent`, `cloud/account`, `cloud/on-premise`, `changelog`)
- **localhost/Docker в основном потоке:** 0
- **CTA на app.datagent.ru:** подтверждены в intro и getting-started
- **Следующая фаза:** Phase 3 — Ядро: как работают агенты

## Статус — Фаза 3 (Ядро: как работают агенты)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 16 (блок concepts: how-it-works → agent-architecture)
- **Технических терминов в пользовательском тексте:** 0 (вынесены в `<details>` для разработчиков)
- **Блоки «Что дальше»:** все 16 страниц фазы
- **Ключевые правки:** Gardener и sandbox BYOC → Studio+; декомпозиция задач → Studio+; Bitrix24 → Studio+; Telegram → все тарифы; GigaChat/Yandex BYO без paywall
- **Следующая фаза:** Phase 4 — Интеграции и браузер

## Статус — Фаза 4 (Интеграции и браузер)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 10 (`browser/overview`, `browser/setup`, `integrations/browserbridge`, `integrations/bitrix24`, `integrations/telegram`, `integrations/gigachat`, `integrations/yandexgpt`, `integrations/1c-connector`, `cloud/plugins`, `cloud/skills`)
- **PRO → Studio/Business исправлено:** подтверждено
- **Plan gates совпадают с pricing.md:** ✅
- **Следующая фаза:** Phase 4 Polish → затем Phase 5 — Артефакты и Office

## Статус — Фаза 5 (Артефакты и Office)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 5 (`artifacts/overview`, `artifacts/agent-upload`, `office/overview`, `office/excel-pptx`, `guides/05-office-field`)
- **Office помечен как experimental:** ✅
- **Office Chat Solo+, Annotations Studio+:** ✅
- **Артефакты Solo+, mobile disclaimer:** ✅
- **Следующая фаза:** Phase 5 Polish → затем Phase 6 — API Reference

## Статус — Фаза 5 polish (Копирайтинг артефакты / Office)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 5 (`artifacts/overview`, `artifacts/agent-upload`, `office/overview`, `office/excel-pptx`, `guides/05-office-field`)
- **Office — тестовый режим в первом абзаце:** ✅
- **Артефакты — уверенный тон (стабильная функция):** ✅

## Статус — Фаза 6 (API Reference)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 7 (`api-reference/overview`, `agents`, `issues`, `memory`, `artifacts`, `plugins`, `access` + `meta/DOC-PLAN-2026-Q3.md`)
- **Billing planned badge:** ✅
- **Decompose Studio+ добавлен:** ✅ (`POST /issues/:id/accepted-plan-decompositions`)
- **Memory operator/agent scope:** ✅
- **Таблицы endpoints на всех страницах:** ✅
- **Следующая фаза:** Phase 7 — Учебник и сценарии

## Статус — Фаза 6 polish (API Reference копирайтинг)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 7 (`api-reference/*`)

## Статус — Фаза 7 (Учебник и сценарии)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **Изменено файлов:** 12
- **Gates совпадают с pricing.md:** ✅
- **localhost/Docker в guides:** 0
- **Аннотации Studio+ добавлены:** ✅
- **1С Business+ уточнён:** ✅
- **Следующая фаза:** Phase 7 Polish → затем Phase 8 — Навигация

## Статус — Фаза 7 polish (копирайтинг учебника)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено (ветка `docs/sync-phase-7-polish`, в `main`)
- **Изменено файлов:** 11 guides/tutorials/troubleshooting

## Статус — Фаза 8 (Навигация и внешние поверхности)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **sidebars.ts:** разделы русифицированы, порядок от простого к сложному (Начало → Концепции → Учебник → … → История изменений)
- **src/pages/index.tsx:** карточки «Сценарии», «Office», «История изменений»; Артефакты — на месте
- **llms.txt:** обновлён по итогам Фаз 1–7, тарифы = pricing.md
- **Landing drift:** resolved — `datagent.ru#pricing` совпадает с docs (Free/Solo/Studio/Business/Enterprise, CTA → app.datagent.ru)
- **navbar CTA → app.datagent.ru:** ✅ («Открыть приложение»)
- **footer:** Артефакты, API Reference, Сценарии, История изменений
- **Следующая фаза:** Phase 9 — QA и публикация

## Статус — Фаза 8 polish (копирайтинг навигации)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено (в `main`)
- **sidebars.ts:** операторские подписи глав учебника
- **index.tsx / navbar / footer:** формула «зачем читать» на карточках

## Статус — Фаза 9 (QA и публикация)

- **Дата:** 15 июня 2026
- **Статус:** ✅ Выполнено
- **drift-audit:** [`meta/drift-audit-final.md`](./drift-audit-final.md) — критичных находок 0
- **Build:** ✅ зелёный (`npm run build`)
- **Broken links:** 0
- **Plan gates:** совпадают с `pricing.md`
- **Post-QA backlog:** [`meta/issues-post-qa.md`](./issues-post-qa.md)

---

# DOC-PLAN-2026-Q3 — Финальный статус

## Все фазы

| Фаза | Название | Статус |
|------|----------|--------|
| 0 | Словарь и канон | ✅ |
| 1 | Тарифы и монетизация | ✅ |
| 2 | Вход в облако | ✅ |
| 3 | Ядро: как работают агенты | ✅ |
| 4 | Интеграции и браузер | ✅ |
| 5 | Артефакты и Office | ✅ |
| 6 | API Reference | ✅ |
| 7 | Учебник и сценарии | ✅ |
| 8 | Навигация и внешние поверхности | ✅ |
| 9 | QA и публикация | ✅ |

## Метрики

- Страниц и поверхностей обновлено в sync Q3: **~75+** (concepts, cloud, integrations, guides, API, nav, meta)
- Drift PRO / localhost в user-facing потоке: **0**
- Build: **✅ зелёный**
- Дата публикации: **15 июня 2026**

## Оставшиеся issues (не блокируют)

→ [`meta/issues-post-qa.md`](./issues-post-qa.md)


| Статус | Количество |
|--------|------------|
| ✅ Documented | 28 |
| 🟡 Partial | 18 |
| ❌ Missing | 24 |
| ⏸ Deferred (P4) | 10 |

---

## Gap table (cloud-first)

| # | Область | Продукт | Docs | Gap | Priority |
|---|---------|---------|------|-----|----------|
| 1 | Cloud onboarding | `cloud/*` UI | ✅ getting-started, first-agent, account | — | — |
| 2 | Тарифы / credits | billing, credits | ✅ credits, cloud-pricing | budgets/project caps | P2 |
| 3 | AI-агенты | agents routes, UI | ✅ concepts/agents | — | — |
| 4 | Heartbeat / runs | heartbeat service | 🟡 concepts/heartbeat | глубже troubleshooting | P3 |
| 5 | Согласования | approvals | ✅ concepts/approvals | — | — |
| 6 | Inbox | inbox routes | ✅ concepts/inbox | — | — |
| 7 | Память (operator) | memory UI, layers | 🟡 concepts/memory | layers API, policy UI | P1 UPDATE |
| 8 | Gardener / freeze | memory-trust, gardener | 🟡 в memory.md | отдельная deep-dive | P1 |
| 9 | Memory REST API | `memory.ts` (~54 endpoints) | ❌ | api-reference/memory | P1 |
| 10 | Задачи (issues) | `issues.ts`, plan decompose | 🟡 в учебнике | concepts/issues | P1 |
| 11 | Plan decompose | `decomposeAcceptedPlan` | ❌ | в issues.md | P1 |
| 12 | Routines / cron | `routines.ts`, `cron.ts` | ❌ | concepts/routines | P1 |
| 13 | Company skills | `company-skills.ts`, catalog | 🟡 в plugins | cloud/skills | P1 |
| 14 | **Артефакты каталог** | `Artifacts.tsx`, v609 | ❌ | artifacts/overview | P2 |
| 15 | **Агент upload** | `AGENT-ARTIFACTS.md` | ❌ | artifacts/agent-upload | P2 |
| 16 | Artifacts API | `company-artifacts.ts` | 🟡 в api overview | api-reference/artifacts | P2 |
| 17 | Excel → artifact | excel-workbench | 🟡 office/excel-pptx | cross-link artifacts | P2 |
| 18 | Проекты | `projects/*` UI | ❌ | concepts/projects | P2 |
| 19 | Execution workspaces | `execution-workspaces/*` | ❌ | concepts/workspaces | P2 |
| 20 | Goals / OKR | `goals/*` | ❌ | concepts/goals | P3 |
| 21 | Secrets UI | company settings | ❌ | concepts/secrets | P2 |
| 22 | Budget (company/project) | migration 0093 | 🟡 credits only | concepts/budgets | P2 |
| 23 | Invites / access | `/invite/:token` | ❌ | concepts/collaboration | P2 |
| 24 | Org chart | settings access | ❌ | collaboration | P2 |
| 25 | Company export/import | `company-portability.ts` | ❌ | concepts/company-export | P3 |
| 26 | Search | global search UI | ❌ | concepts/search | P3 |
| 27 | GigaChat | adapter | ✅ integrations/gigachat | — | — |
| 28 | YandexGPT | adapter | ✅ integrations/yandexgpt | — | — |
| 29 | Bitrix24 | plugin | ✅ integrations/bitrix24 | — | — |
| 30 | Telegram | plugin | ✅ integrations/telegram | — | — |
| 31 | 1С connector | plugin | ✅ integrations/1c-connector | — | — |
| 32 | BrowserBridge | plugin | ✅ browser/* | — | — |
| 33 | Office (experimental) | `ui/pages/office` | ✅ office/* | sync USER-GUIDE | P3 |
| 34 | Плагины (operator) | Plugin Manager | ✅ cloud/plugins | marketplace copy | P1 UPDATE |
| 35 | Build plugin tutorial | SDK | ✅ tutorials/build-plugin | — | — |
| 36 | CRM tutorial | — | ✅ automate-crm | — | — |
| 37 | Tutorials hub | — | 🟡 STUB 20 слов | tutorials/index | P1 FILL |
| 38 | REST API overview | 474 handlers | 🟡 overview.md | split per-resource | P2 |
| 39 | API issues | `issues.ts` | ❌ | api-reference/issues | P2 |
| 40 | API agents | `agents.ts` | ❌ | api-reference/agents | P2 |
| 41 | Integrations hub | generated-index | 🟡 | enrich copy | P2 |
| 42 | What is Datagent | — | ✅ | — | — |
| 43 | Architecture (user) | — | ✅ agent-architecture | — | — |
| 44 | LLM adapters | — | ✅ llm-adapters | — | — |
| 45 | How it works | — | ✅ how-it-works | — | — |
| 46 | Playbooks | guides | ✅ playbook-index | — | — |
| 47 | Troubleshooting | — | ✅ | memory/plugin errors | quick win |
| 48 | Changelog | releases | ✅ changelog | — | — |
| 49 | On-premise enterprise | — | ✅ on-premise | — | — |
| 50 | Self-hosted install | docker/, DEVELOPING | ⏸ | намеренно не публикуем | P4 |
| 51 | Docker compose | `docker/` | ⏸ | enterprise-only | P4 |
| 52 | Full env catalog | `config.ts` (231+) | ⏸ | 4 в .env.example | P4 |
| 53 | CLI reference | `cli/` | ⏸ | не cloud path | P4 |
| 54 | DB migrations guide | `packages/db` | ⏸ | contributor | P4 |
| 55 | CI/CD contributor | `.github` | ⏸ | — | P4 |
| 56 | i18n contributor gates | check scripts | ⏸ | — | P4 |
| 57 | MCP server docs | `@datagent/mcp-server` | ❌ | integrations or API | P3 |
| 58 | Resource memberships | v529 | ❌ | collaboration | P3 |
| 59 | Document annotations | v529 | ❌ | office or concepts | P3 |
| 60 | Workspace finalize | heartbeat phase | ❌ | workspaces | P3 |
| 61 | Agent API keys | agents keys route | 🟡 api overview | agents API page | P2 |
| 62 | Wakeup / heartbeat-runs | api | 🟡 api overview | — | — |
| 63 | Plugin tools execute | plugins API | 🟡 api overview | — | — |
| 64 | Attachments MIME | attachment-types | 🟡 dev docs | artifacts/agent-upload | P2 |
| 65 | Video preview artifacts | design-system | ❌ | artifacts/overview | P2 |
| 66 | Mobile artifacts UI | ArtifactsShell | ❌ | artifacts/overview | P2 |
| 67 | RU adapters QoL | gigachat, yandex | ✅ | — | — |
| 68 | Hermes adapter | board | 🟡 architecture | defer | P4 |
| 69 | Experimental flags | instance validators | ❌ | не для operators | P4 |
| 70 | Memory MCP tools | mcp-server | ❌ | memory API doc | P2 |
| 71 | Community skills | skills-catalog | 🟡 cloud/skills stub | full catalog UX | P1→P2 |
| 72 | Plugin marketplace revenue | product TBD | 🟡 honest WIP | no fake 70% | — |
| 73 | Getting-started orphan | redirect to cloud | 🟡 _category_.json | meta note | quick win |
| 74 | Home page cards | index.tsx | 🟡 | + Артефакты card | P2 |
| 75 | Brand page | BRAND.md | excluded | internal | — |
| 76 | Intro journey | intro.mdx | ✅ | — | — |
| 77 | First-day guide | guides/01 | ✅ | — | — |
| 78 | 1c bridge guide | guides/08 | ✅ | — | — |
| 79 | Credits hard-stop | budget service | 🟡 credits | budgets.md | P2 |
| 80 | Activity log | activity routes | ❌ | API or concepts | P3 |

---

## Priority 1 — Critical (cloud operators)

| Страница | Действие | Effort | Статус сессии |
|----------|----------|--------|---------------|
| `tutorials/index.md` | Заполнить hub | S | ✅ |
| `concepts/issues.md` | NEW stub | M | ✅ stub |
| `concepts/routines.md` | NEW stub | M | ✅ stub |
| `api-reference/memory.md` | NEW stub | M | ✅ stub |
| `cloud/skills.md` | NEW stub | S | ✅ stub |
| `concepts/memory.md` | UPDATE gardener/freeze | S | ✅ уже есть |

## Priority 2 — High

| Страница | Действие |
|----------|----------|
| `artifacts/overview.md` | NEW stub |
| `artifacts/agent-upload.md` | NEW stub |
| `api-reference/artifacts.md` | NEW (после stubs) |
| `concepts/projects.md`, `workspaces.md` | NEW |
| `concepts/secrets.md`, `budgets.md` | NEW |
| `api-reference/issues.md`, `agents.md` | split from overview |
| `concepts/collaboration.md` | NEW |
| `src/pages/index.tsx` | карточка Артефакты |

## Priority 3 — Medium

Цели (goals), глобальный поиск, экспорт компании, порт Office USER-GUIDE, детали маркетплейса плагинов, документация MCP.

## Priority 4 — Deferred

Установка на свой сервер, Docker, CLI, миграции БД, полный каталог переменных окружения, гейты i18n для контрибьюторов, experimental flags.

---

## Proposed sidebar (delta)

```
Облачная версия/
  + cloud/skills          [NEW P1]
Как работают агенты/
  + concepts/issues       [NEW P1]
  + concepts/routines     [NEW P1]
  memory                  [OK]
Артефакты/                [NEW category P2]
  artifacts/overview
  artifacts/agent-upload
API/
  overview                [UPDATE TOC]
  + api-reference/memory  [NEW P1]
```

Полное дерево навигации — в [`sidebars.ts`](../../sidebars.ts) после применения плана.

---

## Quick wins (выполнено / в очереди)

1. ✅ `tutorials/index.md` — hub на 150+ слов  
2. ✅ `concepts/memory.md` — Gardener и заморозка (уже в тексте)  
3. 🟡 `cloud/plugins.md` — сценарий установки есть; маркетплейс без выдуманных цифр  
4. ✅ `artifacts/overview.md` — краткая выжимка из DEVELOPING  
5. 🟡 `api-reference/overview.md` — оглавление на будущие split-страницы  
6. ✅ Главная — карточка «Артефакты»  
7. ⏸ `troubleshooting.md` — ошибки memory/plugin (следующая сессия)  
8. ⏸ orphan `getting-started/_category_.json` — заметка про redirect в meta

---

## Риски

1. **Счётчик API:** в ARCHITECTURE ~417 handlers, в аудите 474 — правим только в этом плане.  
2. **Память:** переносим выжимки, не копируем ADR целиком.  
3. **`.env.example`:** 4 переменные; полный каталог — P4.  
4. **`onBrokenLinks: throw`** — после каждой новой страницы запускать `npm run build`.

## Что дальше

- [Открыть снимок аудита](./audit-snapshot-2026-06-15.json) — цифры и хеши коммитов на момент сканирования
- [Вернуться к changelog](/docs/changelog) — что уже вышло пользователям в продукте
