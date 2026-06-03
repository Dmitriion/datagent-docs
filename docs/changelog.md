---
id: changelog
title: История версий
sidebar_label: История версий
description: История изменений Datagent и документации — выравнивание с server/API, BrowserBridge, офис и интеграции.
sidebar_position: 2
---

Здесь — заметные изменения продукта и документации Datagent.

## [1.4.0] — 2026-06-03

### Added

- **Учебник** в `docs/guides/`: восемь глав-пользовательских историй + [шпаргалка](./guides/playbook-index); обложка с journey и таблицей «30 / 60 / 90 минут».

### Changed

- Категория sidebar: «Учебник»; переписаны `docs/guides/*` (удалены `board-basics`, `agents`, `issues-and-dialogs`, `approvals`, `what-agents-can-do`).
- [Введение](./intro) и главная — карточка учебника с продающим описанием.

## [1.2.1] — 2026-05-26

### Added

- Раздел [Работа с платформой](./guides) — руководство для оператора: Board, агенты, задачи, одобрения, возможности агентов.

### Changed

- Сайт docs: убраны ссылки на GitHub из navbar и footer; упрощена [история версий](./changelog).
- Footer «Интеграции»: ссылки **1С** и **Телеграм**; блок «Сообщество» с репозиториями удалён.
- Отключена кнопка «Редактировать на GitHub» на страницах документации.

## [1.2.0] — 2026-06-03

### Added

- Публичный сайт документации на Docusaurus 3 (`docs.datagent.ru`).
- Разделы Getting Started, Concepts, Integrations, Tutorials, API Reference.
- Публикация документации на `docs.datagent.ru` (CNAME).
- Гайды интеграций: [GigaChat](./integrations/gigachat), [YandexGPT](./integrations/yandexgpt), [Bitrix24](./integrations/bitrix24), [Telegram](./integrations/telegram).
- Туториалы: [BrowserBridge](./tutorials/browserbridge-setup), [плагин](./tutorials/build-plugin), [Bitrix24 → Telegram](./tutorials/automate-crm).
- [Обзор REST API](./api-reference/overview) по фактическим маршрутам `server/src/routes/*` и `app.ts`.

### Changed

- Документация **выровнена с реальностью server/API** (монорепозиторий Datagent, read-only при сверке):
  - исполнение агентов — **heartbeat** (`heartbeatService`, `heartbeat-runs`), не отдельный Agent Runner и не `POST /api/runs`;
  - Board и API на **одном порту `3100`** (`SERVE_UI=false` + dev middleware); убраны ссылки на `:3200` и `apps/api`;
  - LLM: типы адаптеров **`gigachat_local`**, **`yandexgpt_local`**, **`opencode_local`**, модели `gigachat/GigaChat-2-*`, `yandexgpt/rc`, кэш OAuth/IAM в PostgreSQL (`adapter_oauth_tokens`), не Redis;
  - Bitrix24: плагин **`datagent.bitrix24`**, imbot polling (`bitrix-poll`), binding агента; убраны вымышленные CRM tools (`bitrix24_list_leads` и др.);
  - Telegram: **плагин Telegram Datagent**, long poll `getUpdates`; убраны `telegram_send_message` и server webhook как штатный вход;
  - BrowserBridge: plugin namespace `datagent.browserbridge:*`, tunnel с server;
  - аутентификация API: Better Auth session / Bearer board|agent key, режим `local_trusted` в dev;
  - OpenAPI: только частичная спека memory control plane; нет выдуманного `GET /openapi.json` на server.
- [Введение](./intro), [Как это работает](./concepts/how-it-works), [Первый агент](./getting-started/first-agent), [LLM-адаптеры](./concepts/llm-adapters) — переписаны под эту модель.
- Board UI: ссылки «Справка» ведут на внешнюю документацию.

### Removed (из docs)

- Устаревшие примеры: `POST /runs`, `config/triggers/*.yaml`, `@datagent/api`, BullMQ/Redis как очередь run, порт Board `:3200`, `packages/core`, фиктивные agent tools CRM/Telegram.

## [1.1.0] — 2026-05-15

### Added

- **BrowserBridge Phase 1** — локальный сервис `datagent-bridge` (Playwright + CDP, типичный порт **9247**).
- Plugin tools (manifest): `browser_navigate`, `browser_screenshot`, `browser_extract_text`, `browser_click`, `browser_fill_form`, `browser_wait_for_element`, `browser_scroll`, `browser_get_cookies`, `browser_execute_js`, `browser_close_tab` (namespace `datagent.browserbridge:*`).
- Изоляция browser-сессий в контексте компании/run.

### Fixed

- Таймаут CDP при перезапуске Chromium в headless-режиме на Linux.

## [1.0.0] — 2026-04-01

### Added

- Первый GA: **heartbeat** в `server`, адаптеры **`gigachat_local`** и **`yandexgpt_local`** (OpenCode).
- Плагин **Bitrix24** imbot bridge (polling, issues, wakeup).
- Плагин **Telegram** — уведомления, команды, апрувы Board.
- PostgreSQL + схема `packages/db`; память агентов (pgvector на внешнем Postgres).
- Board UI: компании, агенты, issues, просмотр heartbeat runs.
