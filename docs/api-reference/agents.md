---
id: agents-api
slug: /api-reference/agents
title: REST API — агенты и запуски
sidebar_label: Агенты (API)
description: REST API агентов Datagent — CRUD, возобновление работы, heartbeat-runs, ключи, пауза, org.
---

# REST API — агенты и запуски

> **Зачем:** Запускать и настраивать агентов из CI, скриптов или внешней системы — по тем же правилам, что кнопка «Запуск» в панели.

Как войти в API — [обзор REST API](./overview). Для оператора — [агенты](/docs/concepts/agents) и [heartbeat](/docs/concepts/heartbeat). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>`.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/agents` | Список агентов |
| `POST` | `/companies/:companyId/agents` | Создать агента |
| `GET` | `/agents/:id` | Получить агента |
| `PATCH` | `/agents/:id` | Обновить агента |
| `DELETE` | `/agents/:id` | Удалить агента |
| `POST` | `/agents/:id/wakeup` | Возобновить работу агента (новый run) |
| `GET` | `/agents/me` | Профиль агента по ключу |
| `POST` | `/agents/:id/keys` | Создать ключ API агента |

## Агенты компании

Список агентов всегда привязан к **компании**.

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/agents` | Список агентов |
| `POST` | `/companies/:companyId/agents` | Создать агента |
| `POST` | `/companies/:companyId/agent-hires` | Сценарий «найма» с оргструктурой |
| `GET` | `/agents/:id` | Карточка агента |
| `PATCH` | `/agents/:id` | Обновить настройки |
| `DELETE` | `/agents/:id` | Удалить |
| `POST` | `/agents/:id/pause` | Пауза |
| `POST` | `/agents/:id/resume` | Снять с паузы |
| `POST` | `/agents/:id/terminate` | Завершить активность |

### Агент по API-ключу

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/agents/me` | Профиль текущего агента |
| `GET` | `/agents/me/inbox-lite` | Упрощённый inbox |
| `POST` | `/agents/me/plugin-tools/execute` | Вызов tool из run |

Ключ agent видит только себя: не управляет другими агентами и не читает чужую компанию.

## Модели и адаптеры

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/adapters/:type/models` |
| `GET` | `/companies/:companyId/adapters/:type/model-profiles` |
| `POST` | `/companies/:companyId/adapters/:type/test-environment` |

## Возобновление работы и heartbeat-runs

Отдельного `POST /runs` нет — новый run создаёте через **`POST /agents/:id/wakeup`** (возобновить работу агента).

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/agents/:id/wakeup` | Возобновить работу (`202` + run или `skipped`) |
| `POST` | `/agents/:id/heartbeat/invoke` | Устаревший псевдоним wakeup |
| `GET` | `/companies/:companyId/heartbeat-runs` | Список run (`agentId`, `limit`) |
| `GET` | `/companies/:companyId/live-runs` | Активные run |
| `GET` | `/heartbeat-runs/:runId` | Метаданные run |
| `GET` | `/heartbeat-runs/:runId/events` | События по шагам |
| `GET` | `/heartbeat-runs/:runId/log` | Текстовый журнал |
| `POST` | `/heartbeat-runs/:runId/cancel` | Отмена (board) |

### POST /agents/:id/wakeup

```json
{
  "source": "on_demand",
  "triggerDetail": "manual",
  "reason": "Проверка API",
  "payload": { "issueId": "uuid-задачи" },
  "idempotencyKey": "мой-запуск-2026-06-15",
  "forceFreshSession": false
}
```

| Поле | Значения | Смысл |
| --- | --- | --- |
| `source` | `timer`, `assignment`, `on_demand`, `automation` | Источник запуска |
| `triggerDetail` | `manual`, `ping`, `callback`, `system` | Уточнение |
| `payload` | объект | Контекст (часто `issueId`) |
| `idempotencyKey` | строка | Защита от дубликата run |
| `forceFreshSession` | boolean | Новая сессия адаптера |

```bash
curl -s -X POST "https://app.datagent.ru/api/agents/${AGENT_ID}/wakeup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"source":"on_demand","reason":"API test","payload":{"note":"привет"}}'
```

## Ключи API агента

| Метод | Путь |
| --- | --- |
| `GET` | `/agents/:id/keys` |
| `POST` | `/agents/:id/keys` |
| `DELETE` | `/agents/:id/keys/:keyId` |

Секрет ключа показывается **один раз** — сохраните его как пароль.

## Конфигурация и инструкции

| Метод | Путь |
| --- | --- |
| `GET` | `/agents/:id/configuration` |
| `GET` | `/agents/:id/config-revisions` |
| `POST` | `/agents/:id/config-revisions/:revisionId/rollback` |
| `GET/PATCH` | `/agents/:id/instructions-bundle` |
| `GET` | `/agents/:id/skills` |

## Оргструктура и бюджет

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/org` |
| `PATCH` | `/agents/:id/budgets` |

См. [команду и доступ](/docs/concepts/collaboration), [бюджеты](/docs/concepts/budgets).

## Что дальше?

- **Возьмите задачу в работу** — [задачи (API)](./issues): checkout после wakeup
- **Память агента** — [память (API)](./memory): слои по `agentId`
- **Аутентификация** — [обзор API](./overview)
