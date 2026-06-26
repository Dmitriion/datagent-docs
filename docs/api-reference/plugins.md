---
id: plugins-api
slug: /api-reference/plugins
title: REST API — плагины
sidebar_label: Плагины (API)
description: REST API плагинов Datagent — install, enable, tools/execute, webhooks, config.
---

# REST API — плагины

> **Зачем:** Ставить и отлаживать плагин из CI, админ-скрипта или при разработке своего расширения.

Установка через панель — [плагины в облаке](/docs/cloud/plugins). Как войти в API — [обзор REST API](./overview). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>` (панель для install; агент — для `agents/me/plugin-tools/execute`).

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/plugins` | Установленные плагины — инвентарь instance перед деплоем |
| `POST` | `/plugins/install` | Установить плагин — CI/CD или dev-машина |
| `GET` | `/plugins/tools` | Список tools — выбор имени для `execute` |
| `POST` | `/plugins/tools/execute` | Вызов tool вручную — отладка без полного run |
| `POST` | `/plugins/:pluginId/webhooks/:endpointKey` | Входящий webhook — Telegram, Bitrix и др. |
| `POST` | `/agents/me/plugin-tools/execute` | Tool из run агента по ключу агента |

## Установка и жизненный цикл

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/plugins` | Список плагинов на instance |
| `POST` | `/plugins/install` | Установить из npm или `file:` пути |
| `GET` | `/plugins/:pluginId` | Метаданные — версия и capabilities |
| `DELETE` | `/plugins/:pluginId` | Удалить неиспользуемый плагин |
| `POST` | `/plugins/:pluginId/enable` | Поднять worker после установки |
| `POST` | `/plugins/:pluginId/disable` | Остановить worker на время обслуживания |
| `GET` | `/plugins/:pluginId/health` | Проверка состояния worker в мониторинге |

## Включение для компании

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/plugins/catalog` | Какие плагины доступны организации |
| `PATCH` | `/companies/:companyId/plugins/:pluginId/enabled` | Включить плагин для компании без переустановки |

## Конфигурация

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/plugins/:pluginId/config` | Прочитать глобальный config instance |
| `POST` | `/plugins/:pluginId/config` | Записать глобальный config |
| `POST` | `/plugins/:pluginId/companies/:companyId/config` | Config для конкретной компании |

Токены — в [секретах](/docs/concepts/secrets), не в открытом config.

## Вызов инструмента плагина

### POST /plugins/tools/execute

Выполняет tool по полному имени `pluginId:toolName` — когда нужно проверить интеграцию без возобновления работы агента.

```http
POST /plugins/tools/execute
```

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
| `toolName` | Полное имя tool, например `datagent.browserbridge:browser_navigate` |
| `input` | JSON-аргументы tool |

Список tools: `GET /plugins/tools`.

### POST /agents/me/plugin-tools/execute

Тот же вызов из run агента — адаптер дергает tool от имени текущего run.

```http
POST /agents/me/plugin-tools/execute
```

См. [агенты (API)](./agents).

:::note Путь в манифесте
Шаблон `/plugins/{plugin_id}/tools/{tool_name}/execute` в открытом API хоста **не используется**. Рабочий маршрут — **`POST /plugins/tools/execute`** с полем `toolName`.
:::

## Bridge, webhooks, jobs

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/plugins/:pluginId/bridge/data` | Данные для UI настроек плагина |
| `POST` | `/plugins/:pluginId/webhooks/:endpointKey` | Внешнее событие → задачи и run |
| `GET` | `/plugins/:pluginId/jobs` | Список фоновых jobs плагина |
| `POST` | `/plugins/:pluginId/jobs/:jobId/trigger` | Запустить job вручную из скрипта |

Webhook без поднятого worker — `501`.

## Ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидный manifest / тело |
| **403** | Нет прав панели |
| **404** | Плагин не установлен |
| **501** | Worker не поднят |

## Что дальше?

- **Соберите plugin** — [туториал](/docs/tutorials/build-plugin)
- **Интеграции** — [BrowserBridge](/docs/integrations/browserbridge) · [Bitrix24](/docs/integrations/bitrix24)
- **Аутентификация** — [обзор API](./overview)
