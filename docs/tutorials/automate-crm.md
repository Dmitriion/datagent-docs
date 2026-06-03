---
id: automate-crm
title: Чат Bitrix24 и уведомления в Telegram
sidebar_label: Bitrix24 → Telegram
description: Сценарий Datagent — imbot bridge (bitrix-poll), binding агента, heartbeat issues; плагин Telegram Datagent с long poll.
---

Сценарий: **пользователь пишет боту в чате Bitrix24** → плагин `datagent.bitrix24` создаёт issue и будит агента → ответ возвращается в Bitrix; параллельно **плагин Telegram Datagent**[^tg-npm] может слать дайджесты или апрувы в чат команды. Это **не** выгрузка «новых лидов CRM» и **не** agent tools `bitrix24_*` / `telegram_send_message`.

Эталон по bridge: [Bitrix24](../integrations/bitrix24.md). По Telegram: [интеграция Telegram](../integrations/telegram.md).

## Предварительные условия

- [Быстрый старт](../getting-started/quickstart.md) — `http://localhost:3100`, `pnpm dev`.
- Bitrix24: входящий REST webhook, scope **imbot** (+ user/department/disk по гайду).
- Плагины: `datagent.bitrix24` и **плагин Telegram Datagent**[^tg-npm].
- Агент: `gigachat_local` или `yandexgpt_local`, модель `gigachat/GigaChat-2-Pro` или `yandexgpt/rc`.

## Шаг 1. Агент для чата Bitrix

Board → `/{issuePrefix}/agents/new` (префикс компании в URL, см. [Первый агент](../getting-started/first-agent.md)):

| Поле | Значение |
| --- | --- |
| Name | `bitrix-chat-assistant` |
| Adapter | `gigachat_local` или `yandexgpt_local` |
| Model | `gigachat/GigaChat-2-Pro` или `yandexgpt/rc` (+ `folderId` для Yandex) |
| Tools | Только из **включённых** плагинов (BrowserBridge, Telegram tools и т.д.) |

System prompt:

```text
Ты ассистент в открытой линии Bitrix24. Контекст — issue и комментарии Datagent.
Отвечай кратко по-русски. Не вызывай несуществующие CRM API из Board.
```

Секреты LLM — env агента с `secret_ref` ([GigaChat](../integrations/gigachat.md), [YandexGPT](../integrations/yandexgpt.md)).

## Шаг 2. Портал, бот, binding, polling

По [Bitrix24](../integrations/bitrix24.md):

1. **Plugin Manager** — установить `datagent.bitrix24`, включить для instance.
2. **Company → Bitrix24** (UI портала):
   - URL портала, webhook REST (`…/rest/USER/TOKEN/`);
   - регистрация imbot (`imbot.v2.Bot.register`) или привязка существующего;
   - **APPLICATION TOKEN** imbot в UI бота / `bot_token_secret_ref`.
3. **Binding** — выбрать агента `bitrix-chat-assistant` (поле agent в связке бота); опционально project и ACL.
4. **Запустить bridge** — `poll_enabled`; job плагина **`bitrix-poll`** (cron `* * * * *`) вызывает `imbot.v2.Event.get`.
5. **Проверить соединение** — `profile` + `imbot.v2.Event.get`.

Тест: сообщение боту в Bitrix → issue в Board → heartbeat run → ответ в чате Bitrix (`imbot.v2.Chat.Message.send`).

## Шаг 3. Плагин Telegram Datagent (long poll)

[^tg-npm]: Технический npm-пакет для установки: `paperclip-plugin-telegram` (алиас → `datagent.plugin-telegram`). См. [Технические идентификаторы](../integrations/telegram.md#технические-идентификаторы).

1. BotFather → token → company secret → `telegramBotTokenRef`.
2. Plugin Manager → установить плагин Telegram Datagent[^tg-npm] → **Company → Telegram Settings**.
3. `defaultChatId` / `digestChatId` — чат команды; `enableInbound` при двусторонней связи с issues.
4. **Board Access Connection** — для inline-апрувов.

Входящие сообщения: worker **`getUpdates`** (long poll), не webhook Datagent. Публичный URL инстанса нужен для **ссылок на issues** в TG, не для приёма апдейтов.

## Шаг 4. Сквозной поток

```mermaid
sequenceDiagram
  participant U as Пользователь Bitrix
  participant B24 as imbot.v2
  participant W as bitrix24 worker bitrix-poll
  participant S as server heartbeat
  participant A as gigachat_local / yandexgpt_local
  participant TG as Telegram worker getUpdates
  U->>B24: текст в чат бота
  B24->>W: Event.get
  W->>S: issue + comment + wakeup binding.agent
  S->>A: heartbeat run
  A->>S: комментарий issue
  W->>B24: Chat.Message.send
  Note over TG: Параллельно: notify / digest / approvals<br/>в настроенный chat_id
```

## Шаг 5. Мониторинг

- Board: `/{issuePrefix}/agents/{agentId}/runs/{runId}` или список heartbeat runs компании.
- API:

```bash
curl -s "http://127.0.0.1:3100/api/heartbeat-runs/<RUN_ID>/log" \
  -H "Authorization: Bearer <board_token>"
```

- `pnpm datagent doctor` — instance / БД.

## Расширение

- Несколько ботов → отдельные bindings и агенты.
- Апрувы в Telegram (`request_board_approval`).
- CRM REST (лиды/сделки) — вне `datagent.bitrix24`; нужен отдельный плагин.

## Связанные разделы

- [Bitrix24](../integrations/bitrix24.md)
- [Telegram](../integrations/telegram.md)
- [Первый агент](../getting-started/first-agent.md)
- [Как это работает](../concepts/how-it-works.md)
