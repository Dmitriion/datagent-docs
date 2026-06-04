---
id: what-is-datagent
title: Что такое Datagent
sidebar_label: Что такое Datagent
description: "Справочное определение Datagent — операционная платформа (control plane) для AI-агентов, heartbeat, подотчётность, память, затраты, плагины; не фреймворк для сборки агентов."
---

**Datagent** — операционная платформа (*control plane*) для компаний, где уже работают или будут работать AI-агенты. Платформа держит в одном контуре реестр агентов, **задачи**, запуски (**heartbeat run**), подотчётность, память, учёт затрат и интеграции. Продукт рассчитан на **эксплуатацию** настроенных агентов и связанных процессов — а не на замену библиотек вроде LangGraph или CrewAI, если вы с нуля проектируете граф агента в своём приложении.

Datagent **не является** фреймворком постройки агентов: он не подменяет код оркестрации у заказчика. Исполнение дают **адаптеры** (OpenCode, CLI-сессии и др.) и **плагины**; платформа координирует wakeup, контекст, одобрения и наблюдаемость. Удобная аналогия: слой observability над приложением — отдельный операционный уровень **над** runtime агентов, а не вместо него.

Организации с требованиями **self-hosted**, хранением данных у себя и российскими LLM (**GigaChat**, **YandexGPT** через адаптеры `gigachat_local` / `yandexgpt_local`) могут развернуть один instance Datagent (`server` + Board) на своей инфраструктуре. Это не единственный профиль заказчика, но он хорошо совпадает с текущими интеграциями и адаптерами в репозитории.

## Контекст

В 2026 году фокус смещается от демо «умного чата» к **управляемости действий агентов**: кто что запустил, сколько это стоило, где нужно решение человека, как восстановиться после сбоя. Datagent закрывает этот слой — governance и operations — а не только написание промпта и один вызов модели. Для оператора и руководителя это означает единую историю по **задаче** и прозрачный **run**, а не переписку без журнала.

## Определения

| Термин | Значение |
| --- | --- |
| **Control plane** | Центральное ПО Datagent (`server`, Board, `cli`): компании, агенты, задачи, run, одобрения, память, плагины — без отдельного сервиса «Agent Runner» |
| **Агент** | Сущность в компании: тип адаптера, модель, env (`secret_ref`), включённые plugin tools, политики |
| **Heartbeat run** | Одно исполнение агента; планирует `heartbeatService`, хранится в `heartbeat_runs`; запуск — `POST /api/agents/:id/wakeup` |
| **Задача (issue)** | Тема работы или диалог: переписка, документы, исполнитель; источник — Board, API или bridge (Bitrix24, входящие из Телеграм) |
| **Tool** | Операция плагина с JSON-schema; имя `pluginId:toolName` (например `datagent.browserbridge:browser_navigate`) |
| **Plugin** | Расширение в дочернем процессе (JSON-RPC stdio): manifest, worker, опционально UI; установка через Plugin Manager |
| **Адаптер** | Модуль LLM/runtime в `packages/adapters/*` (`gigachat_local`, `yandexgpt_local`, `opencode_local`, …); для российских адаптеров inference через OpenCode upstream |
| **Одобрение (approval)** | Запрос решения человека (`request_board_approval`, `browser_action`, …); маршруты `/api/.../approvals`, раздел Board «Согласования» |
| **Knowledge Fabric** | Продуктовое имя корпоративной памяти и контекста; **реализация:** LLM Memory control plane — PostgreSQL, при production RAG — **pgvector**; API `/api/companies/:companyId/memory/*` |
| **Board** | Веб-интерфейс `@datagent/ui` на том же HTTP-origin, что API (порт `PORT`, по умолчанию **3100**) |

## Ключевые возможности

| Слой (видение) | Назначение | Реализация (кратко) |
| --- | --- | --- |
| Подотчётность | Решение человека до рискованных действий агента | API одобрений + Board (`/approvals`); типы в shared constants; плагин Телеграм для уведомлений[^tg] |
| Восстановление | Понять, «жив ли» агент; отменить или повторить run | `heartbeatService`, `heartbeat-runs`, cancel, recovery/issues в control plane; см. [Как это работает](./how-it-works.md) |
| Knowledge Fabric | Долговременный контекст компании | Memory routes, Gardener, bindings; pgvector на внешнем Postgres; [Архитектура](./agent-architecture.md) |
| Управление затратами | Бюджеты и расход токенов | Routes `costs`, UI `CompanyBudget` (учёт на уровне компании и агентов) |
| Наблюдаемость | Структура «кто кому подчинён», статусы | Org chart (`/org`), агенты, задачи, heartbeat run, Operator View «Офис» |
| Расширяемость | Интеграции без форка `server` | Plugins (`PluginWorkerManager`), реестр adapters, MCP-сервер `@datagent/mcp-server` (REST-обёртка) |
| Исполнение LLM | Вызов моделей | Адаптеры + heartbeat; OAuth/IAM в `adapter_oauth_tokens`; [LLM-адаптеры](./llm-adapters.md) |
| Каналы | Вход и выход вне Board | [Bitrix24 imbot](../integrations/bitrix24.md), [Телеграм](../integrations/telegram.md), [BrowserBridge](../tutorials/browserbridge-setup.md) |

[^tg]: Плагин Телеграм Datagent; установка — Plugin Manager или npm, ключ `datagent.plugin-telegram` (см. [Технические идентификаторы](../integrations/telegram.md#технические-идентификаторы)).

## Роли пользователей

Ниже — **роли в продукте** (не должности в HR). Один человек может совмещать несколько уровней; разграничение доступа — через Better Auth и membership компании (`local_trusted` / `authenticated`).

| Уровень | Задача | Интерфейс Datagent |
| --- | --- | --- |
| **Оператор** | Принимать решения, вести задачи и run, эскалировать | Задачи, **входящие** согласований, комментарии, статусы в «Офисе», уведомления в Телеграм |
| **Тренер / менеджер** | Настраивать агентов, связки, бюджеты, оргструктуру | Board: агенты, org chart, настройки компании, Bitrix24/Телеграм, память (политики/bindings) |
| **Инженер** | Развёртывание, плагины, адаптеры, секреты, API | `cli` (`onboard`, `doctor`), Plugin Manager, instance settings, [Обзор API](../api-reference/overview.md), [Создание плагина](../tutorials/build-plugin.md) |

## Технические компоненты

Монорепозиторий pnpm (подробнее — [Архитектура](./agent-architecture.md)):

| Компонент | Путь / пакет | Функция |
| --- | --- | --- |
| API + orchestration | `server/` | Express `app.use("/api", …)`, `heartbeat.ts`, plugins, memory, approvals |
| Board | `ui/` | SPA; при `SERVE_UI=false` и `pnpm dev` — Vite middleware на `:3100` |
| CLI | `cli/` | Instance в `DATAGENT_HOME`, миграции, запуск |
| Схема БД | `packages/db` | Drizzle, миграции |
| Контракты | `packages/shared` | Типы, validators, deployment modes |
| LLM adapters | `packages/adapters/*` | Регистрация в `server/src/adapters/` |
| Plugins | `packages/plugins/*` | bitrix24, plugin-browserbridge, … |
| BrowserBridge local | `packages/browserbridge-local` | CLI `datagent-bridge`, порт **9247** (локальный демон) |
| MCP | `packages/mcp-server` | stdio-сервер поверх REST `/api` |

**Запуск run:** Board или API → `POST /api/agents/:id/wakeup` → `heartbeat_runs` → adapter + при отладке `POST /api/plugins/tools/execute`. Публичного **`POST /api/runs`** нет. Очередь run — записи в **PostgreSQL**, не обязательный стек BullMQ/Redis.

## Интеграции (факт)

| Интеграция | Что даёт | Ограничение (честные ожидания) | Документация |
| --- | --- | --- | --- |
| **GigaChat** | `gigachat_local`, OAuth, OpenCode | — | [gigachat.md](../integrations/gigachat.md) |
| **YandexGPT** | `yandexgpt_local`, IAM, `folderId`, OpenCode | — | [yandexgpt.md](../integrations/yandexgpt.md) |
| **Bitrix24** | Плагин `datagent.bitrix24`: imbot, polling `bitrix-poll`, задачи, привязка агента к линии | **Не** штатный CRM REST (`crm.lead.*`) — диалог и задачи, не воронка | [bitrix24.md](../integrations/bitrix24.md) |
| **Телеграм** | Плагин Datagent: long poll `getUpdates`, одобрения, входящие в задачи | **Не** замена Board; решение в control plane | [telegram.md](../integrations/telegram.md) |
| **BrowserBridge** | `datagent.browserbridge:*` + tunnel | Не обход CAPTCHA / ToS сайтов | [browserbridge-setup.md](../tutorials/browserbridge-setup.md) |

Опциональные ссылки на ERP в ответах Bitrix-плагина (`@@erp-links`) — настройка портала, **не** отдельная «выгрузка 1С» как ядро продукта. Коннектор 1С в монорепо может существовать как плагин; в базовой документации он не на уровне Bitrix24/Телеграм.

**Как формулировать ожидания по каналам:** «Мы подключили диалог и управление процессом в Datagent, а не полную CRM». Агент не выгрузит воронку Bitrix24 без отдельной интеграции и своих tools в manifest.

## Сравнение с аналогами

Оценка — по типичным возможностям класса продукта на mid-2026; конкретные редакции n8n/Dify/CrewAI у заказчика могут отличаться.

| Критерий | Datagent | n8n / Dify | LangGraph | CrewAI | Класс «task board» / ad-hoc |
| --- | --- | --- | --- | --- | --- |
| Operator UI для агентов компании | ✅ | частично | ❌ | частично | частично |
| Governance / одобрения | ✅ | частично | ❌ | ❌ | ❌ |
| Self-hosted, данные у заказчика | ✅ | частично | ✅ (как lib) | ✅ (как lib) | ❌ |
| Корпоративная memory (RAG-слой) | ✅ | частично | самописно | самописно | ❌ |
| Cost / token control на компанию | ✅ | частично | ❌ | ❌ | ❌ |
| Recovery / heartbeat observability | ✅ | частично | самописно | самописно | ❌ |
| Российские LLM (GigaChat, YandexGPT) | ✅ | HTTP nodes | custom | custom | ❌ |
| Bitrix24 imbot → задачи | ✅ | custom | custom | custom | ❌ |
| Plugin tools + browser bridge | ✅ | nodes | code | code | ❌ |

Datagent собирает в **одной** self-hosted платформе control plane, UI и ряд интеграций. LangGraph, CrewAI и n8n остаются релевантными там, где вы **строите** workflow или граф; Datagent позиционируется **над** ними как эксплуатационный слой.

## Развёртывание

- **Self-hosted / on-prem / VPC:** основной режим; instance на хосте или в контейнере заказчика.
- **Один HTTP-порт** (`PORT=3100`): API и Board на одном origin в dev; см. [Установка](../getting-started/installation.md), [Быстрый старт](../getting-started/quickstart).
- **PostgreSQL:** внешний `DATABASE_URL` или **embedded** Postgres при онбординге без внешней БД.
- **Секреты:** company/agent `secret_ref`; корневой `.env` — instance (`BETTER_AUTH_SECRET`, `PORT`, …), не ключи LLM по умолчанию.
- Режимы: `local_trusted` (dev) и `authenticated` (Better Auth).

Облачный managed-хостинг может предлагаться отдельно; контракт в open-source репозитории описывает прежде всего self-hosted instance.

## Цели продукта

Ориентиры развития (не гарантии каждой сборки):

- Сократить время до первого осмысленного одобрения в новой компании: целевой **time-to-first-approval** — менее 10 минут при типовом онбординге.
- Сохранить прозрачность: оператор видит агентов, run и затраты без чтения сырых логов адаптера.

## Ограничения

Datagent **не**:

- заменяет ETL, DWH или полноценную CRM;
- даёт штатный доступ к Bitrix24 CRM REST (`crm.lead.*`) через `datagent.bitrix24` — только **imbot** и задачи;
- обходит CAPTCHA и нарушает ToS сайтов через BrowserBridge;
- требует отдельного порта Board `:3200` в стандартном dev (`pnpm dev` на **3100**);
- экспонирует `POST /api/runs` как публичный API (используется wakeup / `heartbeat-runs`).

## Планы (roadmap)

Пункты из продуктового видения v3.0 (июнь 2026); **могут отсутствовать или быть неполными в установленной версии**:

- Стабилизация и документирование широкого REST API control plane (внутренняя оценка порядка **~400** маршрутов — не публичный SLA по числу endpoints).
- Расширение каталога **MCP**-инструментов (цель **30+** специализированных tools к **Q4 2026**); базовый пакет `@datagent/mcp-server` уже оборачивает часть `/api`.
- Углубление Operator View / «Офис» и сценариев handoff между людьми и агентами.
- Расширение федерации памяти и policy-presets (см. планы в репозитории Datagent `doc/plans/*`).
- OKR-метрики adoption и cost visibility — продуктовые, не часть open-source tarball.

## Связанные материалы

- [Как это работает](./how-it-works.md) — цикл heartbeat run
- [Архитектура](./agent-architecture.md) — слои и пакеты
- [LLM-адаптеры](./llm-adapters.md) — GigaChat, YandexGPT, OpenCode
- [Обзор API](../api-reference/overview.md) — wakeup, plugins, heartbeat-runs
- [Быстрый старт](../getting-started/quickstart)
