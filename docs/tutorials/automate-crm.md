---
id: automate-crm
title: Чат Bitrix24 и уведомления в Telegram
sidebar_label: Bitrix24 → Telegram
description: Сценарий — чат Битрикс24, ответ агента и уведомления в Телеграм.
---

**Сценарий:** сотрудник пишет боту в **чате Битрикс24** → в Datagent создаётся **задача**, агент отвечает → ответ возвращается в Битрикс. Параллельно **Телеграм** может присылать дайджесты или запросы на согласование команде.

Это **не** автоматическая выгрузка «новых лидов» из CRM и не набор кнопок «создать сделку» в панели.

Подробнее: [Битрикс24](../integrations/bitrix24.md), [Телеграм](../integrations/telegram.md).

## Предварительные условия

- [Старт в Cloud](../cloud/getting-started) — [app.datagent.ru](https://app.datagent.ru).
- Bitrix24: входящий REST webhook, scope **imbot** (+ user/department/disk по гайду).
- Плагины: `datagent.bitrix24` и **плагин Telegram Datagent**[^tg-npm].
- Агент: `gigachat_local` или `yandexgpt_local`, модель `gigachat/GigaChat-2-Pro` или `yandexgpt/rc`.

## Шаг 1. Агент для чата Битрикс24

В панели на [app.datagent.ru](https://app.datagent.ru) создайте агента (см. [Первый агент](../cloud/first-agent)):

| Поле | Значение |
| --- | --- |
| Name | `bitrix-chat-assistant` |
| Adapter | `gigachat_local` или `yandexgpt_local` |
| Model | `gigachat/GigaChat-2-Pro` или `yandexgpt/rc` (+ `folderId` для Yandex) |
| Инструменты | Только из **включённых** плагинов |

System prompt:

```text
Ты ассистент в открытой линии Битрикс24. Контекст — задача и комментарии в Datagent.
Отвечай кратко по-русски. Не выдумывай действия в CRM, которых нет в инструментах.
```

Секреты LLM — env агента с `secret_ref` ([GigaChat](../integrations/gigachat.md), [YandexGPT](../integrations/yandexgpt.md)).

## Шаг 2. Портал, бот, binding, polling

По [Bitrix24](../integrations/bitrix24.md):

1. **Менеджер плагинов** — установить `datagent.bitrix24`, включить для компании.
2. **Компания → Битрикс24**:
   - URL портала, webhook REST (`…/rest/USER/TOKEN/`);
   - регистрация imbot (`imbot.v2.Bot.register`) или привязка существующего;
   - **APPLICATION TOKEN** imbot в UI бота / `bot_token_secret_ref`.
3. **Binding** — выбрать агента `bitrix-chat-assistant` (поле agent в связке бота); опционально project и ACL.
4. **Запустить bridge** — `poll_enabled`; job плагина **`bitrix-poll`** (cron `* * * * *`) вызывает `imbot.v2.Event.get`.
5. **Проверить соединение** — `profile` + `imbot.v2.Event.get`.

Тест: сообщение боту в Битрикс24 → задача в панели → запуск агента → ответ в чате Битрикс24.

## Шаг 3. Телеграм (уведомления и согласования)

[^tg-npm]: Ключ registry: `datagent.plugin-telegram`; алиасы npm — [Технические идентификаторы](../integrations/telegram.md#технические-идентификаторы).

1. BotFather → token → company secret → `telegramBotTokenRef`.
2. **Менеджер плагинов** → установить плагин Телеграм → **Компания → Настройки Телеграм**.
3. Укажите чаты команды для дайджестов и уведомлений.
4. Подключите **доступ панели** — для кнопок согласования в мессенджере.

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

## Шаг 5. Где смотреть результат

- В панели: карточка агента → журнал запусков.
- Для инженеров: API журнала запуска (см. [Обзор API](../api-reference/overview.md)).

## Расширение

- Несколько ботов → отдельные bindings и агенты.
- Согласования в Телеграм (запрос из плагина).
- Выгрузка лидов и сделок CRM — **вне** стандартного плагина Битрикс24; нужна отдельная доработка.

## Связанные разделы

- [Bitrix24](../integrations/bitrix24.md)
- [Telegram](../integrations/telegram.md)
- [Первый агент](../cloud/first-agent)
- [Как это работает](../concepts/how-it-works.md)
