---
id: telegram
title: Telegram
sidebar_label: Telegram
description: Плагин Telegram Datagent — уведомления, команды бота, апрувы Board и agent tools через long polling Bot API.
---

**Плагин Telegram Datagent** — отдельная интеграция с Telegram Bot API, не LLM-адаптер. Исходников в монорепозитории `packages/plugins/telegram` **нет** — пакет устанавливается через **Plugin Manager** или CLI из npm (см. [Технические идентификаторы](#технические-идентификаторы)). Worker поднимается через **PluginWorkerManager** (`server/src/services/plugin-worker-manager.ts`), как у [Bitrix24](./bitrix24.md). Плагин шлёт уведомления в чаты, принимает команды и inline-кнопки, маршрутизирует ответы в issues и работает с **апрувами Board** (`request_board_approval`, `browser_action` и др.) — **не** с CRM tools Bitrix24.

## Схема

```mermaid
flowchart LR
  TG[Telegram Bot API] -->|long poll getUpdates| Worker[Plugin worker]
  Worker --> PWM[PluginWorkerManager]
  PWM --> API[server :3100 /api]
  API --> HB[heartbeat / issues / approvals]
  HB --> Agent[Агенты Datagent]
  Agent --> HB
  HB --> Worker
  Worker --> TG
  Board[Board UI] --> PM[Plugin Manager / Telegram Settings]
  PM --> Worker
```

## Создание бота

1. [@BotFather](https://t.me/BotFather) → `/newbot` → сохраните **bot token**.
2. Узнайте `chat.id`: напишите боту, затем `GET https://api.telegram.org/bot<TOKEN>/getUpdates` (или команда `/connect` в плагине после настройки).
3. Токен храните как **company secret** (UUID), не в корневом `.env` — в `.env.example` Datagent **нет** `TELEGRAM_*`.

## Установка в Datagent

1. **Plugin Manager** → установить плагин Telegram → включить для instance.
2. Либо из корня checkout Datagent (см. [Быстрый старт](../getting-started/quickstart.md)):

```bash
pnpm datagent plugin install <npm-пакет из раздела «Технические идентификаторы»>
```

REST (Board на `http://localhost:3100`):

```bash
curl -X POST http://127.0.0.1:3100/api/plugins/install \
  -H "Content-Type: application/json" \
  -d "{\"packageName\":\"<npm-пакет>\"}"
```

3. **Company → Telegram Settings** (страница настроек плагина). После обновления worker перезапустите **server** на `PORT=3100`.

Секрет бота: **Company / Agent → Environment variables** → создать secret → UUID в поле `telegramBotTokenRef` (см. тест `server/src/__tests__/plugin-secrets-handler.test.ts` и emergency UI в `ui/src/pages/PluginSettings.tsx`). Сырой токен в поле не принимается (ожидается UUID secret ref).

## Настройка (instance config)

Поля задаются в UI плагина Telegram Datagent (в монорепозитории проверено имя `telegramBotTokenRef`).

| Поле | Обязательность | Назначение |
| --- | --- | --- |
| `telegramBotTokenRef` | Да | UUID company secret с bot token |
| `defaultChatId` | Нет | Чат по умолчанию для уведомлений |
| `approvalsChatId` / `approvalsTopicId` | Нет | Отдельный чат/топик для апрувов |
| `errorsChatId` / `errorsTopicId` | Нет | Ошибки агентов |
| `digestChatId` / `digestTopicId` | Нет | Дайджесты (`digestMode`: off / daily / bidaily / tridaily) |
| `escalationChatId` | Нет | Канал HITL-эскалаций |
| Base URL API | Нет | URL Datagent (default `http://localhost:3100`)[^tg-fields] |
| Public URL инстанса | Нет | Публичный URL для ссылок на issues в сообщениях[^tg-fields] |
| Board API token ref | Нет | Secret ref board token (кнопки апрува); лучше **Board Access Connection** в UI[^tg-fields] |
| `enableCommands` | Нет | Команды бота (default true) |
| `enableInbound` | Нет | Ответы в Telegram → комментарии issue (default true) |
| `onlyNotifyBoardApprovals` | Нет | Только апрувы типа `request_board_approval` |
| `allowedTelegramUserIds` | Нет | Allowlist user id (пусто = без ограничения) |
| `allowedTelegramChatIds` | Нет | Allowlist chat id (пусто = без ограничения) |
| `escalationTimeoutMs` | Нет | Таймаут эскалации (default 900000 ms ≈ 15 мин) |
| `briefAgentId`, `briefAgentChatIds`, `transcriptionApiKeyRef` | Нет | Медиа-пайплайн / Whisper |

Переменная окружения **`TELEGRAM_ALLOWED_CHAT_IDS`** в коде Datagent **не** используется — только `allowedTelegramChatIds` в config плагина.

Исходящие запросы к `api.telegram.org` идут через capability `http.outbound`; для прокси на хосте: `DATAGENT_PLUGIN_HTTP_PROXY` / `ALL_PROXY` (`server/src/services/plugin-host-services.ts`).

## Входящие апдейты (long polling, не server webhook)

Плагин Telegram Datagent **не** объявляет `webhooks.receive` в manifest — маршрут хоста

`POST /api/plugins/:pluginId/webhooks/:endpointKey`

(`server/src/routes/plugins.ts`) для этого плагина **не** является входом от Telegram.

Вместо этого worker опрашивает Bot API:

`https://api.telegram.org/bot<token>/getUpdates?offset=…&timeout=10&allowed_updates=…`

Хост увеличивает таймаут `http.fetch` плагина до **90 с** для URL с `api.telegram.org` и путём `/getUpdates` (`PLUGIN_FETCH_TELEGRAM_LONG_POLL_TIMEOUT_MS` в `plugin-host-services.ts`).

Следствия:

- Публичный URL инстанса Datagent **не обязателен** для приёма сообщений от Telegram (в отличие от входящего webhook Bitrix24).
- Старый путь `POST …/integrations/telegram/webhook` и корневые `TELEGRAM_WEBHOOK_*` в `.env` — **не** соответствуют реализации.
- `setWebhook` / `secret_token` Telegram — только при ручной настройке webhook **вне** штатного worker; штатный режим — **getUpdates**.

Для ссылок на issues в сообщениях задайте **публичный URL инстанса** в настройках плагина (при локальной разработке — туннель на Board, например ngrok на **3100**). Это не замена long poll.

## Команды бота

Команды реализованы в worker плагина Telegram Datagent. В монорепозитории Datagent handler-кода нет.

| Команда | Поведение |
| --- | --- |
| `/help` | Список команд |
| `/status` | Активные агенты и недавние завершения |
| `/issues` | Открытые issues |
| `/agents` | Список агентов со статусами |
| `/approve <id>` | Подтвердить pending approval (нужен board access) |
| `/connect <company>` | Привязать чат к компании |
| `/connect_topic [topic-id]` | Топик форума → project |
| `/topics list` / `remove` / `clear` | Управление маппингом топиков |
| `/acp spawn` / `status` / `cancel` / `close` | Сессии агентов в треде |
| `/commands import` / `list` / `run` / `delete` | Пользовательские workflow-команды |

Команды **`/run`**, **`/reject`** как в старой доке — **не** входят в список built-in команд (отклонение — inline-кнопка **Reject** на уведомлении апрува).

Отключение: `enableCommands: false`. Ограничение доступа: `allowedTelegramUserIds`, `allowedTelegramChatIds`.

## Agent tools (manifest плагина)

Имена в Board после установки — с namespace плагина (например `datagent.plugin-telegram:escalate_to_human`). **Нет** tool `telegram_send_message` в manifest.

| Tool | Назначение |
| --- | --- |
| `escalate_to_human` | Эскалация оператору (HITL) |
| `handoff_to_agent` | Передача другому агенту в треде |
| `discuss_with_agent` | Диалог двух агентов |
| `register_watch` | Проактивные watch / suggestions |

## Апрувы (human-in-the-loop)

Апрувы создаёт **Datagent** (`POST /api/companies/:companyId/approvals`, типы в `APPROVAL_TYPES`: `request_board_approval`, `browser_action`, `hire_agent`, `budget_override_required`, … — `packages/shared/src/constants.ts`). Плагин Telegram подписывается на события (issue/approval/agent) и шлёт уведомления с inline **Approve** / **Reject**.

- Фильтр только board-апрувов: `onlyNotifyBoardApprovals: true` → в основном `request_board_approval`.
- Решение в Telegram: inline-кнопки или `/approve <approval_id>`; для мутаций API нужен **Board Access Connection** (альтернатива — board token ref в config плагина[^tg-fields]).
- Таймаут **эскалаций** в Telegram: `escalationTimeoutMs` (default 15 мин), действие по умолчанию `escalationDefaultAction` (`defer` / `auto_reply` / `close`).

**Не документировать:** `requireApprovalFor: ["bitrix24_update_lead"]`, tool `bitrix24_update_lead` — таких типов и CRM tools в Datagent/Bitrix-плагине **нет** (см. [Bitrix24](./bitrix24.md)).

## Связь с Bitrix24

Плагины **независимы**: Bitrix24 bridge и плагин Telegram Datagent не делят общий issue-bridge в коде монорепозитория. Сквозной сценарий imbot → агент → Telegram — [Bitrix24 → Telegram](../tutorials/automate-crm.md) (без CRM tools).

## Проверка

1. **Plugin Manager** → **Plugin Settings** → worker status **running**; вкладка webhook deliveries (для Telegram обычно пусто — long poll).
2. `POST /api/plugins/{pluginId}/config/test` — если плагин реализует `validateConfig` (`server/src/routes/plugins.ts`).
3. `pnpm datagent doctor` — instance / DB / adapters (не специфичен для Telegram).
4. Отправьте боту `/help`; в логах worker — обработка `getUpdates`.
5. Создайте тестовый `request_board_approval` в Board — уведомление в `approvalsChatId` или `defaultChatId`.

## Типичные ошибки

| Симптом | Причина | Что сделать |
| --- | --- | --- |
| 401 от Telegram | Неверный token / не UUID в `telegramBotTokenRef` | Пересоздать company secret, вставить UUID |
| Команды не работают | Allowlist / `enableCommands: false` | Проверить `allowedTelegramChatIds`, `allowedTelegramUserIds` |
| Кнопки Approve 403 | Нет board token | **Connect board access** в UI плагина |
| Нет входящих | Worker stopped / неверный offset | Перезапуск плагина, проверить статус worker |
| Таймаут fetch | Сеть / прокси | `DATAGENT_PLUGIN_HTTP_PROXY`, firewall к `api.telegram.org` |
| Старый URL webhook | Ожидание `/integrations/telegram/webhook` | Использовать long poll; не настраивать фиктивный path |

## Связанные разделы

- [Bitrix24 Bridge](./bitrix24.md) — чат-боты Bitrix (отдельный плагин).
- [Архитектура платформы](../concepts/agent-architecture.md) — heartbeat, PluginWorkerManager.
- [Быстрый старт](../getting-started/quickstart.md) — `:3100`, Plugin Manager.
- [Bitrix24 → Telegram](../tutorials/automate-crm.md) — imbot + long poll.

[^tg-fields]: В schema npm-пакета эти три поля могут иметь legacy-имена; в Board UI — URL API Datagent, публичный URL и secret ref токена Board (см. manifest установленного пакета).

## Технические идентификаторы

| Идентификатор | Значение |
| --- | --- |
| Ключ в registry Datagent | `datagent.plugin-telegram` |
| npm / install | Предпочтительно `datagent.plugin-telegram`; устаревшие имена пакетов сопоставляются в `packages/shared/src/constants/plugin-keys.ts` |
| CLI / REST install | `pnpm datagent plugin install datagent.plugin-telegram` или `{"packageName":"datagent.plugin-telegram"}` |
| Слот UI настроек | `telegram-settings` |

Поля config в schema опубликованного npm-пакета могут использовать legacy-префикс в именах (см. manifest пакета в Plugin Manager); в Board UI — URL инстанса Datagent, публичный URL и ссылка на secret API-токена Board.
