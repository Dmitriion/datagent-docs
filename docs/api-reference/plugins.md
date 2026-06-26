---
id: plugins-api
slug: /api-reference/plugins
title: REST API — плагины
sidebar_label: Плагины (API)
description: REST API плагинов Datagent — install, enable, tools/execute, webhooks, config.
---

# REST API — плагины

> **Зачем:** Ставить и отлаживать plugin из CI, админ-скрипта или при разработке своего расширения.

Установка через панель — [плагины в облаке](/docs/cloud/plugins). Как войти в API — [обзор REST API](./overview). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>` (board для install; agent — для `agents/me/plugin-tools/execute`).

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/plugins` | Установленные плагины |
| `POST` | `/plugins/install` | Установить плагин |
| `GET` | `/plugins/tools` | Список tools |
| `POST` | `/plugins/tools/execute` | Вызов tool (отладка) |
| `POST` | `/plugins/:pluginId/webhooks/:endpointKey` | Webhook плагина |
| `POST` | `/agents/me/plugin-tools/execute` | Tool из run агента |

## Установка и жизненный цикл

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/plugins` | Установленные плагины instance |
| `POST` | `/plugins/install` | Установка (npm-имя или `file:` путь) |
| `GET` | `/plugins/:pluginId` | Метаданные |
| `DELETE` | `/plugins/:pluginId` | Удалить |
| `POST` | `/plugins/:pluginId/enable` | Включить worker |
| `POST` | `/plugins/:pluginId/disable` | Выключить |
| `GET` | `/plugins/:pluginId/health` | Healthcheck worker |

## Включение для компании

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/plugins/catalog` |
| `PATCH` | `/companies/:companyId/plugins/:pluginId/enabled` |

## Конфигурация

| Метод | Путь |
| --- | --- |
| `GET` | `/plugins/:pluginId/config` |
| `POST` | `/plugins/:pluginId/config` |
| `POST` | `/plugins/:pluginId/companies/:companyId/config` |

Токены — в [секретах](/docs/concepts/secrets), не в открытом config.

## Вызов инструмента плагина

В run агент вызывает tools через адаптер автоматически. Для **отладки без полного wakeup** — board endpoint:

```http
POST /plugins/tools/execute
```

Выполняет конкретный tool установленного плагина по полному имени `pluginId:toolName`.

```bash
curl -s -X POST "https://app.datagent.ru/api/plugins/tools/execute" \
  -H "Authorization: Bearer ${BOARD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "datagent.browserbridge:browser_screenshot",
    "input": {}
  }'
```

| Поле | Описание |
| --- | --- |
| `toolName` | Именованный tool, например `datagent.browserbridge:browser_navigate` |
| `input` | JSON-аргументы tool |

Список tools: `GET /plugins/tools`.

**Из run агента** (ключ агента):

```http
POST /agents/me/plugin-tools/execute
```

См. [агенты (API)](./agents).

:::note Путь в манифесте
В документации плагинов иногда встречается шаблон `/plugins/{plugin_id}/tools/{tool_name}/execute` — в открытом API хоста используется единый **`POST /plugins/tools/execute`** с полем `toolName`.
:::

## Bridge, webhooks, jobs

| Метод | Путь |
| --- | --- |
| `POST` | `/plugins/:pluginId/bridge/data` |
| `POST` | `/plugins/:pluginId/webhooks/:endpointKey` |
| `GET` | `/plugins/:pluginId/jobs` |
| `POST` | `/plugins/:pluginId/jobs/:jobId/trigger` |

Webhook без worker — `501`.

## Ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидный manifest / тело |
| **403** | Нет прав board |
| **404** | Плагин не установлен |
| **501** | Worker не поднят |

## Что дальше?

- **Соберите plugin** — [туториал](/docs/tutorials/build-plugin)
- **Интеграции** — [BrowserBridge](/docs/integrations/browserbridge) · [Bitrix24](/docs/integrations/bitrix24)
- **Аутентификация** — [обзор API](./overview)
