---
id: plugins-api
slug: /api-reference/plugins
title: REST API — плагины
sidebar_label: Плагины (API)
description: REST API плагинов Datagent — install, enable, tools, webhooks, config, jobs.
---

# REST API — плагины

> **Зачем:** Ставить и отлаживать plugin из CI, админ-скрипта или при разработке своего расширения.

Установка через панель — [плагины в облаке](/docs/cloud/plugins). Как войти в API — [обзор REST API](./overview). База: `https://app.datagent.ru/api`.

## Установка и жизненный цикл

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/plugins` | Установленные плагины instance |
| `GET` | `/plugins/examples` | Примеры для разработчиков |
| `POST` | `/plugins/install` | Установка (npm-имя или `file:` путь) |
| `GET` | `/plugins/:pluginId` | Метаданные плагина |
| `DELETE` | `/plugins/:pluginId` | Удалить |
| `POST` | `/plugins/:pluginId/enable` | Включить worker |
| `POST` | `/plugins/:pluginId/disable` | Выключить |
| `POST` | `/plugins/:pluginId/upgrade` | Обновить версию |
| `GET` | `/plugins/:pluginId/health` | Healthcheck worker |
| `GET` | `/plugins/:pluginId/logs` | Логи worker |

Нужны права администратора панели (board) — доступ к менеджеру плагинов.

## Включение для компании

Включите plugin для организации, не переустанавливая его на instance:

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/plugins/catalog` |
| `PATCH` | `/companies/:companyId/plugins/:pluginId/enabled` |

## Конфигурация

| Метод | Путь |
| --- | --- |
| `GET` | `/plugins/:pluginId/config` |
| `POST` | `/plugins/:pluginId/config` |
| `GET` | `/plugins/:pluginId/companies/:companyId/config` |
| `POST` | `/plugins/:pluginId/companies/:companyId/config` |
| `POST` | `/plugins/:pluginId/config/test` |

В конфиге — URL webhook, id линии Bitrix24, allowlist браузера. Токены храните в [секретах](/docs/concepts/secrets), не в открытом config.

## Инструменты агента (tools)

| Метод | Путь |
| --- | --- |
| `GET` | `/plugins/tools` | Список всех tools |
| `POST` | `/plugins/tools/execute` | Отладочный вызов tool |
| `GET` | `/plugins/ui-contributions` | UI-вклады плагинов в панель |

Имена tools: `pluginId:toolName`, например `datagent.browserbridge:browser_navigate`.

```bash
curl -s -X POST "https://app.datagent.ru/api/plugins/tools/execute" \
  -H "Authorization: Bearer ${BOARD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "datagent.browserbridge:browser_screenshot",
    "input": {}
  }'
```

В run agent вызывает tools через адаптер; `execute` — для отладки инженером без полного wakeup.

## Bridge, data, actions

Для страниц настроек plugin и long-poll (Telegram, Bitrix):

| Метод | Путь |
| --- | --- |
| `POST` | `/plugins/:pluginId/bridge/data` |
| `POST` | `/plugins/:pluginId/bridge/action` |
| `GET` | `/plugins/:pluginId/bridge/stream/:channel` |
| `POST` | `/plugins/:pluginId/data/:key` |
| `POST` | `/plugins/:pluginId/actions/:key` |

## Webhooks и jobs

| Метод | Путь |
| --- | --- |
| `POST` | `/plugins/:pluginId/webhooks/:endpointKey` |
| `GET` | `/plugins/:pluginId/jobs` |
| `GET` | `/plugins/:pluginId/jobs/:jobId/runs` |
| `POST` | `/plugins/:pluginId/jobs/:jobId/trigger` |

Webhook объявляют в **манифесте** plugin; без worker ответ будет `501`.

## Local folders (BrowserBridge)

| Метод | Путь |
| --- | --- |
| `GET` | `/plugins/:pluginId/companies/:companyId/local-folders` |
| `GET` | `…/local-folders/:folderKey/status` |
| `POST` | `…/local-folders/:folderKey/validate` |

См. [установить BrowserBridge](/docs/browser/setup).

## Dashboard плагина

`GET /api/plugins/:pluginId/dashboard` — метрики для вкладки plugin в панели (если объявлено).

## Агент и plugin-tools

По API-ключу agent: `POST /api/agents/me/plugin-tools/execute` — вызов tool внутри run. См. [агенты (API)](./agents).

## Ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидный manifest / тело |
| **403** | Нет прав board |
| **404** | Плагин не установлен |
| **501** | Worker не поднят или webhook без зависимостей |

## Что дальше?

- [Собрать свой plugin](/docs/tutorials/build-plugin) — SDK и manifest
- [Подключить BrowserBridge](/docs/integrations/browserbridge) · [Bitrix24](/docs/integrations/bitrix24)
- [Каналы](/docs/concepts/channels) — как plugin ведёт диалог в задачи
- [Обзор API](/docs/api-reference/overview) — аутентификация и смежные разделы
