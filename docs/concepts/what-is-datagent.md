---
id: what-is-datagent
title: Что такое Datagent
sidebar_label: Что такое Datagent
description: "Справочное определение Datagent — операционная платформа (control plane) для AI-агентов, heartbeat, подотчётность, память, затраты, плагины; не фреймворк для сборки агентов."
---

**Datagent** — операционная платформа (*control plane*) для компаний, в которых работают AI-агенты: реестр агентов, задачи (**issues**), запуски (**heartbeat runs**), подотчётность, память, учёт затрат и интеграции. Продукт предназначен для **эксплуатации** уже настроенных агентов и связанных процессов, а не для замены библиотек вроде LangGraph или CrewAI при разработке графа агента с нуля.

Datagent **не является** фреймворком постройки агентов: он не подменяет код оркестрации в приложении заказчика. Слой исполнения — **адаптеры** (OpenCode, CLI-сессии и др.) и **плагины**; платформа координирует wakeup, контекст, approvals и наблюдаемость. Аналогия: observability-стек над приложением — отдельный операционный слой над runtime агентов.

Организации с требованиями **self-hosted**, хранением данных у заказчика и российскими LLM (**GigaChat**, **YandexGPT** через адаптеры `gigachat_local` / `yandexgpt_local`) могут развернуть один instance Datagent (`server` + Board) на своей инфраструктуре. Это не единственный возможный профиль заказчика, но соответствует текущей реализации интеграций и адаптеров в репозитории.

## Контекст

В 2026 году индустриальный фокус смещается от демонстрации «умного чата» к **управляемости действий агентов**: кто что запустил, что стоило, что требует человеческого решения, как восстановиться после сбоя. Datagent адресует этот слой — governance и operations — а не только создание промпта и вызов модели.

## Определения

| Термин | Значение |
| --- | --- |
| **Control plane** | Центральное ПО Datagent (`server`, Board, `cli`): компании, агенты, issues, runs, approvals, память, плагины — без отдельного сервиса «Agent Runner» |
| **Agent** | Сущность в компании: тип адаптера, модель, env (`secret_ref`), включённые plugin tools, политики |
| **Heartbeat run** | Одно исполнение агента; планирует `heartbeatService`, хранится в `heartbeat_runs`; запуск — `POST /api/agents/:id/wakeup` |
| **Issue** | Задача или диалог (комментарии, документы, assignee); источник — Board, API или bridge (Bitrix24, Telegram inbound) |
| **Tool** | Операция плагина с JSON-schema; имя `pluginId:toolName` (например `datagent.browserbridge:browser_navigate`) |
| **Plugin** | Расширение в child-process (JSON-RPC stdio): manifest, worker, опционально UI; установка через Plugin Manager |
| **Adapter** | Модуль LLM/runtime в `packages/adapters/*` (`gigachat_local`, `yandexgpt_local`, `opencode_local`, …); inference через OpenCode upstream для российских адаптеров |
| **Approval** | Запрос человеческого решения (`request_board_approval`, `browser_action`, …); маршруты `/api/.../approvals`, UI Approvals |
| **Knowledge Fabric** | Продуктовое имя корпоративной памяти и контекста; **реализация:** LLM Memory control plane — PostgreSQL, при production RAG — **pgvector**; API `/api/companies/:companyId/memory/*` |
| **Board** | Веб-интерфейс `@datagent/ui` на том же HTTP-origin, что API (порт `PORT`, по умолчанию **3100**) |

## Ключевые возможности

| Слой (видение) | Назначение | Реализация (кратко) |
| --- | --- | --- |
| Подотчётность | Решения человека до рискованных действий агента | Approvals API + Board (`/approvals`); типы в shared constants; Telegram-плагин для уведомлений[^tg] |
| Восстановление | Понимание «жив ли» агент, отмена/повтор run | `heartbeatService`, `heartbeat-runs`, cancel, recovery/issues в control plane; см. [Как это работает](./how-it-works.md) |
| Knowledge Fabric | Долговременный контекст компании | Memory routes, Gardener, bindings; pgvector на внешнем Postgres; [Архитектура](./agent-architecture.md) |
| Управление затратами | Бюджеты и расход токенов | Routes `costs`, UI `CompanyBudget` (учёт на уровне компании/агентов) |
| Наблюдаемость | Структура «кто кому подчинён», статусы | Org chart (`/org`), агенты, issues, heartbeat runs, Office view (операторский UI) |
| Расширяемость | Интеграции без форка `server` | Plugins (`PluginWorkerManager`), adapters registry, MCP-сервер `@datagent/mcp-server` (REST-обёртка) |
| Исполнение LLM | Вызов моделей | Адаптеры + heartbeat; OAuth/IAM в `adapter_oauth_tokens`; [LLM-адаптеры](./llm-adapters.md) |
| Каналы | Вход/выход вне Board | [Bitrix24 imbot](../integrations/bitrix24.md), [Telegram](../integrations/telegram.md), [BrowserBridge](../tutorials/browserbridge-setup.md) |

[^tg]: Плагин Telegram Datagent; npm-пакет для установки — `paperclip-plugin-telegram` (см. [Технические идентификаторы](../integrations/telegram.md#технические-идентификаторы)).

## Роли пользователей

Модель продукта (не оргдолжности в HR): три уровня взаимодействия с одним instance.

| Уровень | Задача | Интерфейс Datagent |
| --- | --- | --- |
| **Оператор** | Принимать решения, следить за задачами и run, эскалации | Issues, Approvals (inbox), комментарии, Office/статусы агентов, уведомления Telegram |
| **Тренер / менеджер** | Настраивать агентов, связки, бюджеты, оргструктуру | Board: агенты, org chart, company settings, Bitrix24/Telegram settings, память (политики/bindings) |
| **Инженер** | Развёртывание, плагины, адаптеры, секреты, API | `cli` (`onboard`, `doctor`), Plugin Manager, instance settings, [Обзор API](../api-reference/overview.md), [Создание плагина](../tutorials/build-plugin.md) |

Один человек может совмещать роли; разграничение прав — через Better Auth и membership компании (`local_trusted` / `authenticated`).

## Технические компоненты

Монорепозиторий pnpm (см. [Архитектура](./agent-architecture.md)):

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

**Запуск run:** Board или API → `POST /api/agents/:id/wakeup` → `heartbeat_runs` → adapter + `POST /api/plugins/tools/execute` (отладка tools). Публичного **`POST /api/runs`** нет. Очередь run — записи в **PostgreSQL**, не BullMQ/Redis как обязательный стек.

## Интеграции (факт)

| Интеграция | Что делает | Документация |
| --- | --- | --- |
| **GigaChat** | `gigachat_local`, OAuth, OpenCode | [gigachat.md](../integrations/gigachat.md) |
| **YandexGPT** | `yandexgpt_local`, IAM, `folderId`, OpenCode | [yandexgpt.md](../integrations/yandexgpt.md) |
| **Bitrix24** | Плагин `datagent.bitrix24`: imbot, polling `bitrix-poll`, issues, binding агента; **не** `crm.lead.*` | [bitrix24.md](../integrations/bitrix24.md) |
| **Telegram** | Плагин Datagent: long poll `getUpdates`, апрувы, inbound | [telegram.md](../integrations/telegram.md) |
| **BrowserBridge** | `datagent.browserbridge:*` + tunnel | [browserbridge-setup.md](../tutorials/browserbridge-setup.md) |

Опциональные ссылки на ERP в ответах Bitrix-плагина (`@@erp-links`) — конфигурация портала, **не** отдельная «выгрузка 1С» как ядро продукта. Отдельный коннектор 1С в монорепо может существовать как плагин; в базовой документации не считается штатной интеграцией уровня Bitrix24/Telegram.

## Сравнение с аналогами

Оценка — по типичным возможностям класса продукта на mid-2026; конкретные редакции n8n/Dify/CrewAI у заказчика могут отличаться.

| Критерий | Datagent | n8n / Dify | LangGraph | CrewAI | Класс «task board» / ad-hoc |
| --- | --- | --- | --- | --- | --- |
| Operator UI для агентов компании | ✅ | частично | ❌ | частично | частично |
| Governance / approvals | ✅ | частично | ❌ | ❌ | ❌ |
| Self-hosted, данные у заказчика | ✅ | частично | ✅ (как lib) | ✅ (как lib) | ❌ |
| Корпоративная memory (RAG слой) | ✅ | частично | самописно | самописно | ❌ |
| Cost / token control на компанию | ✅ | частично | ❌ | ❌ | ❌ |
| Recovery / heartbeat observability | ✅ | частично | самописно | самописно | ❌ |
| Российские LLM (GigaChat, YandexGPT) | ✅ | HTTP nodes | custom | custom | ❌ |
| Bitrix24 imbot → issues | ✅ | custom | custom | custom | ❌ |
| Plugin tools + browser bridge | ✅ | nodes | code | code | ❌ |

Datagent сочетает в **одной** self-hosted платформе control plane, UI и ряд интеграций. LangGraph, CrewAI и n8n остаются релевантными на слое **построения** workflow или графа; Datagent позиционируется **над** ними как эксплуатационный слой (как платформа наблюдаемости над приложением, а не замена приложению).

## Развёртывание

- **Self-hosted / on-prem / VPC:** основной режим; instance на хосте или в контейнере заказчика.
- **Один HTTP-порт** (`PORT=3100`): API и Board на одном origin в dev; см. [Установка](../getting-started/installation.md), [Быстрый старт](../getting-started/quickstart.md).
- **PostgreSQL:** внешний `DATABASE_URL` или **embedded** Postgres при онбординге без внешней БД.
- **Секреты:** company/agent `secret_ref`; корневой `.env` — instance (`BETTER_AUTH_SECRET`, `PORT`, …), не ключи LLM по умолчанию.
- Режимы: `local_trusted` (dev) и `authenticated` (Better Auth).

Облачный managed-хостинг может предлагаться отдельно как продуктовая услуга; контракт развёртывания в open-source репозитории описывает прежде всего self-hosted instance.

## Цели продукта

Ориентиры развития (не гарантии текущей сборки):

- Сократить время до первого осмысленного approval в новой компании: целевой **time-to-first-approval** — менее 10 минут при типовом онбординге.
- Сохранить прозрачность: оператор видит агентов, runs и затраты без чтения логов адаптера.

## Ограничения

Datagent **не**:

- заменяет ETL, DWH или полноценную CRM-систему;
- предоставляет штатный доступ к Bitrix24 CRM REST (`crm.lead.*`) через плагин `datagent.bitrix24` — только **imbot** и issues;
- обходит CAPTCHA и нарушает ToS сайтов через BrowserBridge;
- требует отдельного порта Board `:3200` в стандартном dev (`pnpm dev` на **3100**);
- экспонирует `POST /api/runs` как публичный API run (используется wakeup / `heartbeat-runs`).

## Планы (roadmap)

Пункты из продуктового видения v3.0 (июнь 2026); **могут отсутствовать или быть неполными в установленной версии**:

- Стабилизация и документирование широкого REST API control plane (внутренняя оценка порядка **~400** маршрутов — не публичный SLA по числу endpoints).
- Расширение каталога **MCP**-инструментов (цель **30+** специализированных tools к **Q4 2026**); базовый пакет `@datagent/mcp-server` уже оборачивает часть `/api`.
- Углубление Operator View / Office и сценариев handoff между людьми и агентами.
- Расширение федерации памяти и policy-presets (см. планы в репозитории Datagent `doc/plans/*`).
- OKR-метрики adoption и cost visibility — продуктовые, не часть open-source tarball.

## Связанные материалы

- [Как это работает](./how-it-works.md) — цикл heartbeat run
- [Архитектура](./agent-architecture.md) — слои и пакеты
- [LLM-адаптеры](./llm-adapters.md) — GigaChat, YandexGPT, OpenCode
- [Обзор API](../api-reference/overview.md) — wakeup, plugins, heartbeat-runs
- [Быстрый старт](../getting-started/quickstart.md)
