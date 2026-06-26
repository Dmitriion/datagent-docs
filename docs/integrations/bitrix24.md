---
id: bitrix24
title: Как подключить Битрикс24 к AI-агентам — Datagent
sidebar_label: Битрикс24
description: "Битрикс24 + GigaChat в Datagent: агент читает сделки, ставит задачи, пишет в чат. Пошагово за 10 минут."
---

# Как подключить Битрикс24 к AI-агентам — Datagent

> **Зачем:** Агент сам работает в Bitrix24 — читает переписку, готовит ответы, ставит задачи. Вы контролируете риск через [согласования](../concepts/approvals).

> **Доступно на тарифе Studio и выше.**  
> На **Free** и **Solo** полный плагин Битрикс24 недоступен. [Тарифы →](../cloud/pricing)

⏱ Займёт: 10 минут

## Что агент делает в Bitrix24

Агент может **отвечать на входящие обращения** в чатах CRM, **готовить черновики** для клиентов, **фиксировать итог** в задаче Datagent и **вернуть ответ в чат** — без ручного переключения между системами.

Типовые сценарии:

- **Собирайте** просроченные диалоги по утрам и **шлите** менеджерам напоминания в задачах Datagent
- **Фиксируйте** итог звонка в задаче и **готовьте** ответ в чат CRM
- **Сводите** раз в неделю активные диалоги и **отправляйте** руководителю в [Telegram](./telegram)

**Раньше:** копировали переписку из Битрикс24 в ChatGPT. Ответ терялся в личном чате.  
**Теперь:** одна **задача** на диалог, **журнал** каждого шага, ответ уходит **обратно в CRM**.

**Честно:** плагин работает с **чатами и ботами** (imbot), не выгружает всю воронку сделок без отдельной доработки. Для сценариев со сделками и контактами вне чата — [BrowserBridge](../browser/overview) (**Studio+**) или кастомный плагин.

## Как подключить — пошагово

### Шаг 1. Webhook в Битрикс24

1. В портале: **Приложения → Вебхуки → входящий**.
2. Создайте webhook с URL вида  
   `https://ваш-портал.bitrix24.ru/rest/USER_ID/TOKEN/`
3. Права минимум: **imbot**. Для файлов — **disk**. Для ACL — **user**, **department**.

### Шаг 2. Плагин в Datagent

1. Войдите на [app.datagent.ru](https://app.datagent.ru).
2. **Менеджер плагинов** → установите плагин **Битрикс24**.
3. **Настройки компании → Битрикс24**.

### Шаг 3. Бот и агент

1. Укажите **URL портала** и **webhook**.
2. **Зарегистрируйте бота** в интерфейсе плагина.
3. Сохраните **APPLICATION TOKEN** бота.
4. Выберите **агента** (рекомендуем **GigaChat** — [подключение](./gigachat)).
5. Нажмите **Запустить bridge**.
6. **Проверить соединение** → тестовое сообщение в чат Bitrix.

### Шаг 4. Первый диалог

1. Напишите боту тестовый вопрос из Bitrix24.
2. В Datagent откройте **входящие** / новую **задачу**.
3. Запустите агента при необходимости.
4. Убедитесь, что ответ вернулся в чат CRM.

Подробнее с картинками: [учебник, каналы](../guides/06-channels) · [практическое руководство](../tutorials/automate-crm).

## Что нужно для старта

- Аккаунт Datagent с тарифом **Studio** или **Business** — [тарифы](../cloud/pricing)
- Входящий **webhook** в Bitrix24 (показали выше)
- **10 минут** и ключи **GigaChat** или **YandexGPT** (BYO — на любом тарифе Datagent)

## Системная инструкция агента (пример)

```text
Ты ассистент в чате Битрикс24. Контекст — в задаче и комментариях.
Отвечай кратко по-русски. Не выдумывай вызовы CRM API — отдельных bitrix24_* tools нет.
```

## Частые вопросы

**Нужен ли программист?**  
Первую связку часто делает администратор Bitrix + ответственный за Datagent. Сложные воронки — с разработчиком.

**Агент сам выгружает все лиды?**  
**Нет.** Плагин — **чаты** (imbot), не полный CRM ETL.

**Почему нет ответа в чате?**  
Проверьте: bridge включён, run завершился, нет зависшего [согласования](../concepts/approvals).

**Нужен ли тариф Studio?**  
**Да.** Плагин Битрикс24 — с **Studio** и выше. Модель GigaChat/Yandex подключается отдельно, без дополнительного paywall Datagent.

## Что дальше

→ [Подключить GigaChat](./gigachat)

:::note Для инженеров

Плагин `datagent.bitrix24`, polling `imbot.v2.Event.get`, issues + wakeup + heartbeat. **Нет** agent tools `bitrix24_*` в manifest.

### Схема

```mermaid
flowchart LR
  User[Пользователь в Bitrix чате] --> B24[Bitrix24 imbot]
  B24 --> Poll[Plugin worker poll]
  Poll --> Srv[server heartbeat]
  Srv --> Agent[Агент Datagent]
  Agent --> Srv
  Srv --> Poll
  Poll --> B24
  Board[Board UI] --> PM[Plugin Manager / Bitrix24]
  PM --> Poll
```

### Установка (on-premise / dev)

```bash
pnpm --filter @datagent/plugin-bitrix24 build
pnpm datagent plugin install packages/plugins/bitrix24
```

В Cloud — через **Plugin Manager** на app.datagent.ru.

### Внутренние вызовы REST (worker)

| Операция | Метод |
| --- | --- |
| Опрос входящих | `imbot.v2.Event.get` |
| Ответ в чат | `imbot.v2.Chat.Message.send` |
| Боты | `imbot.v2.Bot.list`, `Bot.register` |
| Вложения | `imbot.v2.File.upload`, `File.download` |
| ACL | `user.get`, `department.get`, `sonet_group.*` |

CRM (`crm.lead.*`, `crm.deal.*`) **не** вызывается.

### Поля конфигурации

| Поле | Назначение |
| --- | --- |
| `portal_url` | Адрес портала |
| `webhook_base_url` | База REST webhook |
| `bot_token_secret_ref` | APPLICATION TOKEN imbot |

Вход — **polling** (`bitrix-poll`), не push webhook на Datagent API.

### Типичные ошибки

| Симптом | Что сделать |
| --- | --- |
| 401 webhook | Пересоздать входящий webhook |
| Нет APPLICATION TOKEN | Сохранить после `Bot.register` |
| `BITRIX_DISK_SCOPE_REQUIRED` | Добавить scope disk |
| Polling не идёт | Включить **Запустить bridge** |

См. [Архитектура](../concepts/agent-architecture.md), [API](../api-reference/overview.md).

:::
