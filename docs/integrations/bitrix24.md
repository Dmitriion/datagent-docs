---
id: bitrix24
title: Bitrix24
sidebar_label: Bitrix24
description: Подключение Bitrix24 REST API к Datagent — входящий вебхук, переменные окружения и пример задачи агента в CRM.
---

Интеграция Bitrix24 позволяет агентам читать и изменять сущности CRM (лиды, сделки, контакты) через REST. Datagent использует **входящий вебхук** с правами, ограниченными администратором портала.

## Создать входящий вебхук

1. Bitrix24 → **Приложения** → **Вебхуки** → **Добавить входящий вебхук**.
2. Права: `crm` (чтение/запись по необходимости), `user` (опционально).
3. Скопируйте URL вида:

```
https://your-company.bitrix24.ru/rest/1/abcdefghijklmnopqrstuvwx/
```

## Настройка Datagent

`.env`:

```env
BITRIX24_WEBHOOK_URL=https://your-company.bitrix24.ru/rest/1/abcdefghijklmnopqrstuvwx/
BITRIX24_DEFAULT_CATEGORY_ID=0
```

Перезапустите API. Проверка:

```bash
curl -s "${BITRIX24_WEBHOOK_URL}crm.lead.list?filter[STATUS_ID]=NEW&select[]=ID&select[]=TITLE" | jq '.total'
```

## Tools агента

| Tool | Действие |
| --- | --- |
| `bitrix24_list_leads` | `crm.lead.list` с фильтром |
| `bitrix24_update_lead` | `crm.lead.update` |
| `bitrix24_add_comment` | Timeline comment |

## Пример задачи агента в CRM

System prompt:

```text
При появлении нового лида (статус NEW) сформируй краткую сводку:
компания, телефон, источник. Предложи следующий шаг менеджеру.
```

Run из Board:

```text
Обработай лиды со статусом NEW за последние 24 часа.
```

Внутри Runner вызовется:

```json
{
  "tool": "bitrix24_list_leads",
  "arguments": {
    "filter": {"STATUS_ID": "NEW", ">=DATE_CREATE": "2026-05-25"},
    "select": ["ID", "TITLE", "PHONE", "SOURCE_ID"]
  }
}
```

## Исходящий вебхук (опционально)

Для push-событий из Bitrix24 настройте **исходящий вебхук** на:

```
POST https://api.your-domain.ru/integrations/bitrix24/events
```

Секрет: `BITRIX24_OUTBOUND_SECRET`. Datagent поставит run агента `crm-inbound-handler` в очередь.

См. туториал: [Автоматизация CRM](../tutorials/automate-crm).
