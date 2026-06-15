---
id: agents-api
slug: /api-reference/agents
title: REST API — агенты и запуски
sidebar_label: Агенты (API)
description: REST API агентов Datagent — CRUD, wakeup, heartbeat-runs, ключи, пауза, org.
---

# REST API — агенты и запуски

> **Зачем:** Создавать и будить агентов из CI, скриптов или внешней оркестрации — с теми же правилами, что и кнопка «Запуск» в панели.

Обзор аутентификации — [REST API overview](./overview). Концепции для оператора — [агенты](/docs/concepts/agents), [heartbeat](/docs/concepts/heartbeat).

Базовый URL: `https://app.datagent.ru/api`.

## Агенты компании

Агенты всегда в scope **компании**. Глобального списка без `companyId` нет.

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

Ключ агента **не** управляет другими агентами и **не** читает чужую компанию.

## Модели и адаптеры

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/adapters/:type/models` |
| `GET` | `/companies/:companyId/adapters/:type/model-profiles` |
| `POST` | `/companies/:companyId/adapters/:type/test-environment` |

Перед production run проверьте окружение и секреты — [GigaChat](/docs/integrations/gigachat), [YandexGPT](/docs/integrations/yandexgpt).

## Запуск (wakeup) и heartbeat-runs

Публичного `POST /api/runs` **нет**. Новый run — через **wakeup**.

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/agents/:id/wakeup` | Запустить агента (`202` + run или `skipped`) |
| `POST` | `/agents/:id/heartbeat/invoke` | Устаревший псевдоним wakeup |
| `GET` | `/companies/:companyId/heartbeat-runs` | Список run (`agentId`, `limit`) |
| `GET` | `/companies/:companyId/live-runs` | Активные run |
| `GET` | `/heartbeat-runs/:runId` | Метаданные run |
| `GET` | `/heartbeat-runs/:runId/events` | События по шагам |
| `GET` | `/heartbeat-runs/:runId/log` | Текстовый журнал |
| `POST` | `/heartbeat-runs/:runId/cancel` | Отмена (board) |

Статусы run: `queued`, `running`, `succeeded`, `failed`, и др.

### POST /api/agents/:id/wakeup

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

Секрет ключа показывается **один раз** при создании. Храните как пароль.

## Конфигурация и инструкции

| Метод | Путь |
| --- | --- |
| `GET` | `/agents/:id/configuration` |
| `GET` | `/agents/:id/config-revisions` |
| `POST` | `/agents/:id/config-revisions/:revisionId/rollback` |
| `GET/PATCH` | `/agents/:id/instructions-bundle` |
| `GET` | `/agents/:id/skills` |

## Оргструктура

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/org` |
| `GET` | `/companies/:companyId/org.svg` |
| `GET` | `/companies/:companyId/org.png` |

См. [команда и доступ](/docs/concepts/collaboration).

## Бюджет агента

`PATCH /api/agents/:id/budgets` — месячный лимит в копейках. См. [бюджеты](/docs/concepts/budgets).

## Что дальше?

- [Задачи (API)](/docs/api-reference/issues) — checkout, документы, work products
- [Память (API)](/docs/api-reference/memory) — слои агента
- [Обзор API](/docs/api-reference/overview) — аутентификация и плагины
- [Первый агент в панели](/docs/cloud/first-agent)
