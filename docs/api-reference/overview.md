---
id: overview
title: Обзор REST API
sidebar_label: Обзор API
description: REST API Datagent — Bearer-токен, базовый URL app.datagent.ru/api, коды ошибок; для разработчиков.
---

# Обзор REST API

REST API для интеграции с Datagent: CI, CRM, скрипты, собственные панели. Сценарии оператора без кода — в [облаке](/docs/cloud/getting-started) и [концепциях](/docs/concepts/how-it-works).

**Базовый URL:**

```text
https://app.datagent.ru/api
```

Отдельного хоста `api.datagent.ru` **нет** — тот же origin, что у панели. В таблицах пути указаны **без** префикса `/api`.

Новый run агента — через **`POST /agents/:id/wakeup`**, не через отдельный `POST /runs`.

## Аутентификация

Получите **ключ API**:

- **Ключ агента** — в карточке агента (**API-ключи**) или **`POST /agents/:agentId/keys`** (профиль агента, память, задачи).
- **Ключ панели (board)** — **`datagent auth login`** (одобрение запроса в браузере; для install плагинов — **`datagent auth login --instance-admin`**).

**Настройки → Секреты** — ключи GigaChat и интеграций, **не** Bearer для REST API.

Передавайте в каждом запросе:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```bash
curl -s -H "Authorization: Bearer ${TOKEN}" \
  "https://app.datagent.ru/api/companies/${COMPANY_ID}/agents"
```

| Режим | Когда |
| --- | --- |
| **Сессия (cookie)** | Браузер после `/api/auth/*` |
| **Bearer — ключ панели** | CRUD компании, агентов, плагинов, согласований |
| **Bearer — ключ агента** | Профиль агента, память, разрешённые маршруты задач |

## Лимиты запросов

Глобальный rate limit для всего board API в открытой документации **не зафиксирован**. Отдельные маршруты (загрузка файлов, webhooks) могут вернуть **`429 Too Many Requests`**.

**Целевые лимиты по тарифу** (после запуска enforcement — могут измениться):

| Тариф | Запросов в минуту (план) |
| --- | --- |
| Free | 10 |
| Solo | 60 |
| Studio | 300 |
| Business | 1 000 |
| Enterprise | по договору |

При **`429`** смотрите заголовок **`Retry-After`** (если сервер его отдал) и повторите запрос позже.

## Ошибки

| Код | Значение |
| --- | --- |
| `400` | Неверное тело или параметры |
| `401` | Нет или неверный токен |
| `403` | Нет прав или чужая компания |
| `404` | Ресурс не найден |
| `409` | Конфликт (checkout, дубликат) |
| `422` | Бизнес-правило (план не принят) |
| `429` | Превышен лимит запросов |
| `501` | Подсистема не настроена |
| `500` | Ошибка сервера |

Типичное тело ошибки:

```json
{
  "error": "packageName is required and must be a string"
}
```

При проверке тарифа (после enforcement) возможны ответы **`403`** с текстом вроде «требуется тариф Studio или выше».

## Доступные разделы

| Раздел | Справочник |
| --- | --- |
| Агенты, wakeup, heartbeat-runs | [Агенты (API)](./agents) |
| Задачи, checkout, вложения | [Задачи (API)](./issues) |
| Память | [Память (API)](./memory) |
| Артефакты | [Артефакты (API)](./artifacts) |
| Плагины | [Плагины (API)](./plugins) |
| Приглашения | [Доступ (API)](./access) |
| Биллинг | 🔜 [ниже](#биллинг-в-разработке) |

## Проверка доступности

```bash
curl -s https://app.datagent.ru/api/health
```

## Пример: возобудить агента

```bash
curl -s -X POST "https://app.datagent.ru/api/agents/${AGENT_ID}/wakeup" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"source":"on_demand","reason":"Проверка API"}'
```

Ответ **`202`** — запуск принят или пропущен по политике; детали — в `GET /heartbeat-runs/:runId`.

## Биллинг (в разработке)

Endpoints **`/billing/*`** и **`/api/v1/billing/*`** в текущей версии **не реализованы**. Канон тарифов — [Тарифы](/docs/cloud/pricing), лимиты — [Биллинг → Лимиты](/docs/billing/limits).

## OpenAPI

Полной OpenAPI-спеки всего API **нет**. Частичная спека памяти — `doc/openapi/memory-control-plane.yaml` в репозитории продукта.

## Что дальше?

→ [Плагины (API)](./plugins) — install, tools, webhooks

→ [Агенты (API)](./agents) — ключи и журнал запусков

→ [Сборка плагина](/docs/tutorials/build-plugin)
