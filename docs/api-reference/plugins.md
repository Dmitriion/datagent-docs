---
id: plugins-api
slug: /api-reference/plugins
title: REST API — плагины
sidebar_label: Плагины (API)
description: REST API плагинов Datagent — install, enable, tools, webhooks, config, jobs.
---

# REST API — плагины

> **Зачем:** Устанавливать и отлаживать плагины из CI, скриптов администратора или при разработке своего расширения.

Операторская установка через панель — [плагины в облаке](/docs/cloud/plugins). Аутентификация — [обзор API](./overview). База: `https://app.datagent.ru/api`.

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

Установка требует прав **board** (администратор instance или облачный оператор с доступом к менеджеру плагинов).

## Включение для компании

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/plugins/catalog` |
| `PATCH` | `/companies/:companyId/plugins/:pluginId/enabled` |

Каталог — что доступно компании; `enabled` — вкл/выкл без переустановки на instance.

## Конфигурация

| Метод | Путь |
| --- | --- |
| `GET` | `/plugins/:pluginId/config` |
| `POST` | `/plugins/:pluginId/config` |
| `GET` | `/plugins/:pluginId/companies/:companyId/config` |
| `POST` | `/plugins/:pluginId/companies/:companyId/config` |
| `POST` | `/plugins/:pluginId/config/test` |

Конфиг плагина часто содержит URL webhook, id линии Bitrix24, allowlist браузера — не путайте с [секретами](/docs/concepts/secrets) (токены в bindings).

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

Агент в run вызывает tools через адаптер; отладка `execute` — для инженера без полного wakeup.

## Bridge, data, actions

Плагины с UI bridge:

| Метод | Путь |
| --- | --- |
| `POST` | `/plugins/:pluginId/bridge/data` |
| `POST` | `/plugins/:pluginId/bridge/action` |
| `GET` | `/plugins/:pluginId/bridge/stream/:channel` |
| `POST` | `/plugins/:pluginId/data/:key` |
| `POST` | `/plugins/:pluginId/actions/:key` |

Используются страницами настроек плагина в панели и long-poll сценариями (Telegram, Bitrix poll).

## Webhooks и jobs

| Метод | Путь |
| --- | --- |
| `POST` | `/plugins/:pluginId/webhooks/:endpointKey` |
| `GET` | `/plugins/:pluginId/jobs` |
| `GET` | `/plugins/:pluginId/jobs/:jobId/runs` |
| `POST` | `/plugins/:pluginId/jobs/:jobId/trigger` |

Webhook объявляется в **манифесте** плагина; без worker вернётся `501`.

## Local folders (BrowserBridge)

| Метод | Путь |
| --- | --- |
| `GET` | `/plugins/:pluginId/companies/:companyId/local-folders` |
| `GET` | `…/local-folders/:folderKey/status` |
| `POST` | `…/local-folders/:folderKey/validate` |

См. [установка BrowserBridge](/docs/browser/setup).

## Dashboard плагина

`GET /api/plugins/:pluginId/dashboard` — агрегированные метрики для UI вкладки плагина (если объявлено).

## Агент и plugin-tools

Агент по API-ключу:

`POST /api/agents/me/plugin-tools/execute` — вызов tool в контексте run (ограниченный набор). См. [агенты (API)](./agents).

## Ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидный manifest / тело |
| **403** | Нет прав board |
| **404** | Плагин не установлен |
| **501** | Worker не поднят или webhook без зависимостей |

## Что дальше?

- [Собрать плагин](/docs/tutorials/build-plugin) — SDK и manifest
- [BrowserBridge](/docs/integrations/browserbridge) · [Bitrix24](/docs/integrations/bitrix24)
- [Каналы](/docs/concepts/channels) — как плагины ведут в задачи
- [Обзор API](/docs/api-reference/overview)
