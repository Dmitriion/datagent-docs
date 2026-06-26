---
id: plugins-api
slug: /api-reference/plugins
title: REST API — плагины
sidebar_label: Плагины (API)
description: REST API плагинов — install, enable, tools/execute, webhooks; примеры curl и JSON.
---

# REST API — плагины

API для **установки и управления плагинами** на instance Datagent. Плагин — пакет с **manifest**, **worker** и **tools**, которые агент вызывает в run.

**База:** `https://app.datagent.ru/api` · **Auth:** `Authorization: Bearer <board-api-key>`

Установка через UI — [плагины в облаке](/docs/cloud/plugins). Обзор API — [REST API](./overview).

---

## POST /plugins/install

Установить плагин с **npm** или с **локального пути** (только **администратор instance**).

**Тело запроса:**

```json
{
  "packageName": "@datagent/plugin-excel-workbench",
  "version": "1.2.0"
}
```

Локальный путь:

```json
{
  "packageName": "/path/to/my-plugin",
  "isLocalPath": true
}
```

**Ответ `200`** — объект плагина (`PluginRecord`: `id`, `pluginKey`, `status`, …).

**Ошибка `400`:**

```json
{
  "error": "packageName is required and must be a string"
}
```

**Пример curl:**

```bash
curl -s -X POST "https://app.datagent.ru/api/plugins/install" \
  -H "Authorization: Bearer ${BOARD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "packageName": "@datagent/plugin-excel-workbench"
  }'
```

После install: `POST /plugins/:pluginId/enable` и `PATCH /companies/:companyId/plugins/:pluginId/enabled`.

---

## GET /plugins

Список плагинов, установленных на **instance**.

**Ответ `200 OK`:**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "pluginKey": "datagent.excel-workbench",
    "displayName": "Excel Workbench",
    "status": "ready",
    "version": "1.2.0"
  }
]
```

**Пример curl:**

```bash
curl -s "https://app.datagent.ru/api/plugins" \
  -H "Authorization: Bearer ${BOARD_TOKEN}"
```

---

## GET /plugins/:pluginId

Метаданные одного плагина — версия, capabilities, health.

```bash
curl -s "https://app.datagent.ru/api/plugins/${PLUGIN_ID}" \
  -H "Authorization: Bearer ${BOARD_TOKEN}"
```

---

## DELETE /plugins/:pluginId

Удалить плагин с instance (только **администратор instance**).

Query **`purge=true`** — полное удаление данных плагина; без флага — мягкое удаление с retention **30 дней**.

**Ответ `200 OK`** — объект **`PluginRecord`** удалённого плагина (тело **не пустое**).

**Ответ `403`** — нет прав instance admin.

**Ответ `404`** — плагин не найден:

```json
{
  "error": "Plugin not found"
}
```

```bash
curl -s -X DELETE "https://app.datagent.ru/api/plugins/${PLUGIN_ID}" \
  -H "Authorization: Bearer ${BOARD_TOKEN}"
```

---

## POST /plugins/tools/execute

Вызвать tool **вручную** (отладка без полного run агента).

**Тело:**

```json
{
  "toolName": "datagent.excel-workbench:inspect_workbook",
  "input": {
    "issueId": "00000000-0000-4000-8000-000000000001"
  }
}
```

```bash
curl -s -X POST "https://app.datagent.ru/api/plugins/tools/execute" \
  -H "Authorization: Bearer ${BOARD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "datagent.excel-workbench:inspect_workbook",
    "input": {}
  }'
```

Список имён: **`GET /plugins/tools`**.

:::note
Шаблон `/plugins/{id}/tools/{name}/execute` **не используется**. Рабочий маршрут — **`POST /plugins/tools/execute`** с полем **`toolName`** (`pluginId:toolName`).
:::

---

## POST /agents/me/plugin-tools/execute

Тот же вызов **из run агента** — Bearer **ключ агента**, не панели. См. [Агенты (API)](./agents).

---

## Webhooks и jobs

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/plugins/:pluginId/webhooks/:endpointKey` | Входящее событие (Telegram, Bitrix24) |
| `GET` | `/plugins/:pluginId/jobs` | Фоновые jobs |
| `POST` | `/plugins/:pluginId/jobs/:jobId/trigger` | Запуск job вручную |

Worker не поднят — **`501`**.

---

## Конфигурация и компания

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/plugins/catalog` |
| `PATCH` | `/companies/:companyId/plugins/:pluginId/enabled` |
| `GET/POST` | `/plugins/:pluginId/config` |
| `GET/POST` | `/plugins/:pluginId/companies/:companyId/config` |

Секреты — в [секретах](/docs/concepts/secrets), не в открытом JSON config.

---

## Коды ошибок

| Код | Когда |
| --- | --- |
| `400` | Невалидное тело / manifest |
| `403` | Нет прав (install — только admin instance) |
| `404` | Плагин не установлен |
| `501` | Worker не запущен |

## Что дальше?

→ [Сборка плагина](/docs/tutorials/build-plugin)

→ [BrowserBridge](/docs/integrations/browserbridge) · [Bitrix24](/docs/integrations/bitrix24)

→ [Обзор API](./overview)
